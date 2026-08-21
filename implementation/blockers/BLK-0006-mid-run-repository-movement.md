# BLK-0006 — `origin/main` Moved Mid-Run; TASK-0021 Closeout Commit Cannot Be Pushed

**Status:** **RESOLVED** 2026-08-21 — reconciled by interactive session via option 1 (fetch + rebase); no conflict, no force-push; all commits on `origin/main`
**Raised:** 2026-08-21, during TASK-0021, immediately after the second `git push`
**Severity:** Low impact, **hard boundary.** The TASK-0021 deliverable is already on `origin/main`; one follow-up commit is stranded
**Related:** MSG-0028 decision 2 (the abort rule and the precedent), MSG-0055, TASK-0021, DISC-0010

## What happened

TASK-0021's work was delivered in two commits. **The first push succeeded:**

```text
$ git push origin main
To github-pci:ghuffy11-lgtm/pci-platform.git
   3350cb4..b96187b  main -> main
```

`b96187b` contains the entire TASK-0021 deliverable — EPA-0001, EPA-0002, EPA-0003, the architecture
README, MSG-0055, the COMMS register rows, the queue reconciliation, the status reconciliation, and
checkpoints 1 and 2. **The architecture lead can read all of it on GitHub now.**

The second commit, `c8059eb` — DISC-0010 plus its two index rows and checkpoint 3 — **was rejected:**

```text
$ git push origin main
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'github-pci:ghuffy11-lgtm/pci-platform.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref.
```

**Something pushed to `origin/main` between the two pushes.** That is the *Mid-run repository
movement* condition in `CLAUDE.md`: a fail-closed recovery boundary, not a warning. This session
stopped there.

## What was NOT done, and why

**No `git pull`, `git fetch`, `git merge`, `git rebase`, `git reset`, or force push was attempted.**
The rule is explicit — stop at the next safe checkpoint, document the discrepancy, and make no
further changes against a moving repository state. A session that began against one repository and
finishes against another has produced evidence about neither.

A second push attempt was also **deliberately not made**. It would be non-destructive, and it would
also be exactly the hazard the rule exists to prevent: delivering a commit built on a base that may
no longer be current, without knowing what the base now is.

## What is UNKNOWN, stated plainly

**The current value of `origin/main` on the server is UNKNOWN to this session.** It could not be
established:

- `git fetch` is not on the unattended runner's allowlist — the standing limit recorded by
  TASK-0011, TASK-0018 and TASK-0019.
- `git ls-remote origin main` was attempted once as a read-only alternative and was refused by the
  permission layer: `This command requires approval`.

**Neither was routed around.** The local `origin/main` ref therefore still reads `b96187b`, which is
stale by definition — `git status -sb` reports `## main...origin/main [ahead 1]`, and that "ahead 1"
is measured against a ref that is known to be out of date. **Do not read it as the divergence.**

## What is VERIFIED

```text
$ git log --oneline -3
c8059eb docs(records): record DISC-0010 and close out TASK-0021     <- stranded locally
b96187b feat(architecture): TASK-0021 - employee policy assistant... <- ON origin/main
3350cb4 ops: reconcile TASK-0021 into the queue; record C6/C7 closure

$ git status -sb
## main...origin/main [ahead 1]        (working tree otherwise clean)
```

The supervisor log shows **no cycle after 11:05:47Z**, the one that started this session:

```text
2026-08-21T11:05:47Z [INFO]   CYCLE_START    :: pid=25620 enabled=True dryRun=False
2026-08-21T11:05:53Z [ACTION] RUNNER_STARTED :: pid=26508 task=TASK-0021
```

**INFERRED, and labelled as inference:** because no supervisor cycle ran in the window, the mover was
not a supervisor fast-forward. It was a concurrent actor — most likely the architecture lead pushing
directly, or a second session in the same tree. This is the same pattern MSG-0028 §3(a) recorded when
`aaf0d34` landed mid-TASK-0003: `runner.lock` guards against a second *supervisor*, not against a
human or a manually-started session.

## Impact

**Low, and bounded.** Everything TASK-0021 was authorized to produce is on `origin/main` in
`b96187b`, including MSG-0055 and all three EPA records. The stranded commit contains only:

- `DISC-0010` — an observation requiring no action, already summarised in MSG-0055 §7.1, which **is**
  published;
- its two index rows;
- checkpoint 3.

**One correction matters more than the rest.** Checkpoint 3, inside the stranded commit, states that
the second push succeeded. It was written before the push and that claim is **false**. Checkpoint 4
corrects it in the same file. A checkpoint that records intent as result is the specific failure the
checkpoint protocol exists to prevent, and it is corrected rather than quietly rewritten.

## What is needed to clear this

A human with the ability to inspect the remote must decide. Options, cheapest first:

1. **Inspect and fast-forward-or-rebase locally, then push.** `git fetch origin` followed by
   `git rebase origin/main` — `c8059eb` touches `implementation/discoveries/`,
   `implementation/status/current.md`, `implementation/comms/MSG-0055-*.md` and
   `implementation/operations/checkpoints/TASK-0021.md`, so a conflict is only possible if the
   concurrent push touched the same files.
2. **Discard `c8059eb` and let a later session re-create DISC-0010** against the reconciled state.
   Nothing depends on it — MSG-0055 §7.1 already carries the finding, and it is published.
3. **Leave it stranded** until the next authorized task reconciles the tree, accepting that DISC-0010
   is absent from GitHub in the meantime.

**No option is recommended and none was taken.** Reconciliation against an unknown remote is not a
decision an unattended session is entitled to make.

## Note for a resuming session

**Do not assume this is still open.** Check `git status -sb` and the actual remote before acting — if
someone already reconciled the tree, re-doing it could rewrite history that has since been built on.
`CLAUDE.md` *Checkpointing and Recovery* rule (f) applies: never repeat an operation merely because a
record says it was incomplete.

---

## RESOLVED — 2026-08-21, interactive session

**Option 1 was taken, and the unknown is now known.** The mover was the architecture lead pushing
`182698c` ("Architecture Lead: rule EPA decisions", **MSG-0056**) directly, exactly as this record
inferred and labelled as inference. The inference was correct.

### What the remote actually held

```text
$ git fetch origin
$ git rev-list --left-right --count origin/main...HEAD
1	2          # origin had 1 commit local lacked; local had 2 origin lacked
```

The stranded work was **two** commits, not one: `c8059eb` (DISC-0010) and `e1735a0` (this record).
`e1735a0` did not exist when the "ahead 1" above was written — this file was committed after it.

### Why a rebase was safe to perform here

The overlap was checked **before** rebasing, precisely as this record specified:

```text
$ comm -12 <(git show --name-only --format='' 182698c | sort -u) \
           <(git log --name-only --format='' c8059eb e1735a0 | sort -u | grep .)
                                    # empty - zero shared files
```

`182698c` touched exactly one file, `implementation/comms/MSG-0056-architecture-lead-epa-decisions.md`,
which neither stranded commit touches. A conflict was therefore impossible, and none occurred:

```text
$ git rebase origin/main
Successfully rebased and updated refs/heads/main.

2badf5b docs(blockers): BLK-0006 - origin/main moved mid-run; closeout push rejected
56dcaab docs(records): record DISC-0010 and close out TASK-0021
182698c Architecture Lead: rule EPA decisions
```

**No force-push, and no history was rewritten.** Both rebased commits were unpushed local commits, so
nothing that existed on `origin/main` changed identity. The published commit `b96187b` carrying the
TASK-0021 deliverable is untouched and remains an ancestor of `HEAD`.

### Why the unattended session could not do this and an interactive one can

Nothing about the *decision* changed — what changed is who is entitled to make it. The runner could
not read the remote at all (`git fetch` off-allowlist, `git ls-remote` refused), so for it,
reconciliation meant acting against a base it could not name. It stopped, which was correct: this
record's own "Note for a resuming session" is the reason the resumption was cheap.

The interactive session can read the remote, so the base is a fact rather than a guess. Repository
reconciliation of this kind is delegated implementation work — the standing instruction is to resolve
it without routing it through the operator, preserving both sides and never force-pushing. Both
constraints were honoured.

### Correction carried forward

The false claim this record identified — checkpoint 3 stating the second push succeeded — remains
corrected by checkpoint 4 in `implementation/operations/checkpoints/TASK-0021.md`, and is left
visible rather than edited away.

**Nothing is outstanding. DISC-0010, checkpoints 3-5, and this record are on `origin/main`.**
