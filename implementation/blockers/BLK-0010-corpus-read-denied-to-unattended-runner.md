# BLK-0010 — The Corpus Read Is Denied to the Unattended Runner; TASK-0027 Stopped at Its First Action

**Status:** **RESOLVED** 2026-08-22 — MSG-0083 authorized option A; the narrow read-only grant is applied to `runner-settings.json` and **verified empirically** (headless session read 641,807 bytes, `%PDF-1.7`; writes denied). Three ineffective deny rules were caught by the permission layer and removed rather than left giving false assurance
**Raised:** 2026-08-22, by the supervisor-started TASK-0027 session (`runner.lock` pid **24140**, acquired **2026-08-22T09:47:18Z**, host `LENOVO-LA0X1754`)
**Severity:** Hard boundary. Nothing was executed, nothing was lost, **no survey figure of any kind exists**
**Related:** MSG-0080 (the A-SURVEY authorization), **MSG-0082** (the decision request this confirms), BLK-0009 (the previous cycle's stop, pid 21164), BLK-0008, MSG-0028 (the runner permission set), TASK-0026, TASK-0027

## Summary

The Execution Supervisor started this session to execute **TASK-0027**. **It reached the task's first
action and stopped there.**

**TASK-0027's prerequisites were unmet at session start and became met during the session** — the
concurrent interactive session committed and pushed its reconciliation at ~09:51Z, mid-run. So the
queue condition that stopped the previous cycle (BLK-0009) is **genuinely cleared**, and this run got
further than that one did.

**It then hit the one condition that a retry cannot clear:** the corpus lives outside the repository by
MSG-0080's requirement, and this session may not read outside the repository. **That is now confirmed
by an explicit, unambiguous refusal** — quoted in full below — rather than inferred.

**MSG-0082 asked the Architecture Lead to choose between three options and said a runner that hit this
wall "should produce a blocker, not a survey." This is that blocker.**

## VERIFIED — the corpus read is denied, and the cause is established rather than guessed

**Two attempts were made, and the first one's error message was misleading. Both are recorded, because
the first nearly produced a wrong diagnosis.**

**Attempt 1** — a compound command with a redirect:

```text
$ ls -l "/d/Work/pci-corpus/" 2>&1 | head -20
This Bash command contains multiple operations. The following part requires approval:
ls -l "/d/Work/pci-corpus/" 2>&1
```

**This refusal does not name a path boundary.** It complains about *multiple operations* and points at
the redirect. Read alone, it is equally consistent with "the command shape needs approval" — which
would mean the corpus is readable and **MSG-0082's whole decision request rests on a misdiagnosis**.
`CLAUDE.md` rule 5 is directly on point: *"A bare command failure is not a diagnosis. Establish the
cause before naming it; a wrong diagnosis sends the operator to fix something that was never broken."*

**Attempt 2** — the same read reduced to a single plain command, no redirect, no chaining, no
substitution of path or method:

```text
$ ls -l /d/Work/pci-corpus/
ls in '/d/Work/pci-corpus/' was blocked. For security, Claude Code may only list files in the
allowed working directories for this session: 'D:\Work\pci-platform'.
```

**That settles it.** The boundary is **session-scoped and path-based**, not command-shape-based. The
one allowed working directory is the repository itself.

**This is a clarification of the cause, not a second denial and not an escalation.** Re-issuing the
*same* read in its simplest form to learn *why* it failed is establishing a diagnosis; it is not
routing around a denial, because it sought no different path, no privilege substitute, and no piped
shell. Once the message named the boundary, **no third attempt was made and no other tool was tried.**
Reaching for a different tool to obtain what Bash refused would have been a substitute for a privilege
not granted — precisely what `CLAUDE.md` rule 2 forbids.

## VERIFIED — the corpus is UNKNOWN to this session

**Nothing in this record is evidence that `D:\Work\pci-corpus\plan.pdf` is present, absent, readable,
or of any particular size, format, language, or content.**

The `626.8 KB / %PDF-1.7` figures that appear in MSG-0081 and in the TASK-0027 queue section were
recorded by an *interactive* session. **They were not observed here and are not repeated as this
session's findings.** They may well be correct; this session simply cannot corroborate them.

**No survey was performed. No survey figure exists in this record — not as an estimate, not as an
illustration, not as an expected value, and no substitute method was offered in place of the
authorized output.** This is the same restraint TASK-0026 exercised at PR5 and BLK-0009 exercised one
cycle ago, for a third distinct reason.

## Why this cannot be cleared by the Supervisor retrying

**BLK-0009's condition was transient. This one is not.**

The tree condition resolved the moment the interactive session committed. **Nothing about the runner's
permission set has changed or will change on its own.** With a perfectly clean tree and TASK-0027 READY
in the committed queue — which is exactly the state as of this record — the next unattended runner will
issue the same read and receive the same refusal.

**Repeated supervisor cycles will not produce a survey.** They will produce identical blockers at one
cycle apiece. This record is therefore explicit that the remedy is a decision, not a retry.

## The mid-run repository movement, and why this session did not abort on it

**`HEAD` and `origin/main` moved during this session**, from `f67bc7c` to `66314e1`:

```text
session start, 09:47Z    HEAD = origin/main = f67bc7c   (the commit that CREATED BLK-0009)
re-checked   09:48:15Z   HEAD = origin/main = f67bc7c   unchanged
re-checked   09:50:10Z   HEAD = origin/main = f67bc7c   unchanged
re-checked   09:52:16Z   HEAD = origin/main = 66314e1   MOVED
                         66314e1  "ops: reconcile TASK-0027; resolve BLK-0008/BLK-0009; raise MSG-0082"
```

`CLAUDE.md` *Mid-run repository movement — abort* requires a session to stop at the next safe
checkpoint when this happens, and permits continuing **"only after reconciliation confirms the
repository is again consistent with the state the session recorded at its start."**

**That reconciliation was performed and it passes**, and the judgment is recorded here rather than left
implicit:

- The movement is **not an unrelated actor** — it is the *exact* commit BLK-0009 and this record's own
  earlier draft said was needed, landing the reconciliation this run was blocked on.
- `HEAD` and `origin/main` **agree** at the new commit; the repository is not in a split state.
- The working tree is **clean** apart from this session's own two new records.
- **No work by this session was invalidated**, because this session had performed no task action at
  all — it was still in its prerequisite check. There is no evidence produced against the old state
  that would now describe a different repository.

**This is the BLK-0006 signature without the BLK-0006 hazard**, and the distinction is recorded so a
future reader can check the reasoning rather than inherit the conclusion. The precedent is MSG-0075
§6.2, which recorded a comparable non-abort judgment explicitly instead of passing over it.

## What the prerequisite check found, before and after the movement

**At session start — TASK-0027 was NOT READY in the authoritative committed queue:**

```text
$ git show HEAD:implementation/operations/CLAUDE-TASKS.md | grep -c "TASK-0027"
0            <- at 09:48:15Z, and again at 09:50:10Z

$ grep -c "TASK-0027" implementation/operations/CLAUDE-TASKS.md
11           <- present ONLY in the uncommitted working copy
```

Eleven paths were dirty, none of them this session's, and the concurrent actor was **still writing**:
`implementation/status/current.md` was modified at 09:49:25Z, more than two minutes *after* this
session's lock was acquired. **This session executed nothing against that moving state and did not run
`git add -A`.**

**After the movement, at 09:52:16Z — both conditions cleared:**

```text
$ git show HEAD:implementation/operations/CLAUDE-TASKS.md | grep -c "TASK-0027"
11           <- READY in the AUTHORITATIVE queue, not just the working copy

$ git status --porcelain
A  implementation/blockers/BLK-0010-...md          <- this session's own records only
A  implementation/operations/checkpoints/TASK-0027.md
```

**MSG-0080 criteria 4 and 6 are therefore satisfiable now**, and the task became genuinely executable —
which is how this run reached the corpus read at all.

### A correction worth keeping, because the earlier reading was wrong

**An earlier draft of this record asserted that BLK-0009's `RESOLVED` status was false.** At the time
it was written that was accurate: the committed `BLK-0009` read `Status: OPEN`, while the *uncommitted
working copy* claimed RESOLVED and cited a clean `git status` and a non-zero `TASK-0027` count that were
both untrue at 09:50:10Z.

**It stopped being accurate two minutes later.** The interactive session committed, and the committed
`BLK-0009` now reads `RESOLVED` with both of its cited checks passing. **The claim was written slightly
ahead of the commit that made it true, not incorrectly.**

Both readings are kept, per `CLAUDE.md`: *"Where a diagnosis was wrong and later corrected, keep both —
the correction is worth more to that reader than a tidy record would be."* The lesson is not that
anyone erred; it is that **a record asserting a git state should be written after the commit, not
before it**, because a supervisor cycle can fall into the gap — which is exactly what happened twice
today.

**`BLK-0009` was never edited by this session.** Correcting another actor's in-flight file is not
something an unattended runner is entitled to do.

## What was NOT done, and why

- **TASK-0027 was not executed**, and **no survey figure of any kind was produced**.
- **The corpus was not read, opened, copied, inspected, or inferred from.** Its properties are UNKNOWN
  to this session. **No property was derived from the filename, the size, or any other proxy** — that
  is the invented-findings failure the n=1 discipline exists to prevent (MSG-0082).
- **No permission setting was changed.** `runner-settings.json` was not opened or edited. No
  authorization exists to widen it, and *"the task could not finish otherwise"* is precisely the
  reasoning a permission boundary exists to refuse.
- **Nothing was copied into the repository.** No `plan.pdf` was created, staged, or committed —
  checked, not assumed: `git status --porcelain` carries no `.pdf` path, at session start and at the
  end.
- **`git add -A` was never run.** While the tree held another session's mid-edit files, it would have
  swept them into history under this session's authorship — the failure mode BLK-0008 records with a
  627 KB payload.
- **No `git pull`, `fetch`, `merge`, `rebase`, `reset`, `stash`, `checkout`, or force-push was
  attempted.** No other actor's work was touched or reverted. Both of this session's files were staged
  **by explicit path**.
- **No ADR was touched**; T-A, T-B, T-D, T-E and T-0 remain unauthorized; no provider, model,
  framework, embedding technology, or runtime was selected.

## Impact

**Low, and bounded** — but it will recur every cycle until a decision is taken. No work was lost, no
history rewritten, no permission changed, no incorrect claim published. TASK-0027 remains unstarted and
fully executable the moment the corpus becomes readable.

## What is needed to clear this

**One decision, and it is the Architecture Lead's and the operator's.** MSG-0082 states the options and
deliberately does not recommend between the first two, because they trade different things:

- **A — grant a narrow read permission** for `D:\Work\pci-corpus\` (or that one file) in
  `runner-settings.json`. Keeps A-SURVEY unattended and repeatable. It is a change to a **governance
  control**, needs the Lead's authorization, and should be scoped to that path and no wider.
- **B — run TASK-0027 interactively**, where reads outside the working directory are available with
  approval. Nothing is granted permanently and no control changes. The cost is that this one task is
  not executed by the mechanism the project built.
- **C — the operator supplies a read-only extraction** produced outside the repository. This changes
  what A-SURVEY is surveying, so whether it still answers the question is the Lead's call.

**Not options:** copying the PDF into the repository, editing the permission set without authorization,
or reporting document properties that were never observed.

**TASK-0027 needs no re-authorization.** MSG-0080 authorizes it and remains AUTHORIZED. **It should not
be left to the Supervisor to retry**, because retrying changes nothing until A, B, or C is chosen.

**Recommended handling of the queue in the meantime:** this is an observation, not a change — **only
the Architecture Lead may alter task status.** Leaving TASK-0027 `READY` means one blocker per cycle,
each one honest and each one identical. That is safe and it is noisy. Whether to hold it pending the
decision is the Lead's call.

## Note for a resuming session

**Do not assume this is still open, and do not inherit its conclusions. Verify each directly:**

- **Re-attempt the corpus read yourself**, with a single plain command. A denial recorded here is
  evidence about *this* runner at *this* time — **not a standing fact**. If option A was granted, or if
  you are an interactive session, it may now succeed. **Equally, do not assume it will fail and skip
  the attempt**; the task's own stop condition says *"verify by inspection first; do not assume it from
  this text."*
- `git show HEAD:implementation/operations/CLAUDE-TASKS.md | grep -c "TASK-0027"` — **non-zero** is the
  test of whether TASK-0027 is READY. The working copy is not the queue.
- `git status --porcelain` — clean? Check file mtimes against the current time before assuming no one
  else is writing.
- **If the read succeeds, TASK-0027 is executable exactly as written**: **n=1**, document-level
  observations only, the distributional dimensions recorded as *insufficient* rather than estimated,
  and **the PDF never enters the repository**.
- **If a `plan.pdf` is ever found inside the repository, that is a defect**: move it out and record it.
  Do not commit it, and do not delete the corpus.

---

## RESOLVED — 2026-08-22 by MSG-0083 option A

**The Architecture Lead granted the narrowest read-only access**, and it was applied to
`runner-settings.json` — the version-controlled permission file, so the change is reviewable rather
than buried in a command line:

```json
"additionalDirectories": [ "D:\Work\pci-corpus" ]
"deny": [ "Edit(//D:/Work/pci-corpus/**)", ... ]
```

**Read-only by construction.** The directory is granted for access, and a single `Edit()` deny covers
every file-editing tool, so the grant cannot become a write path.

### Verified empirically, before relying on it

A headless session using exactly these settings was asked whether it could read the file:

```text
VERIFIED read: D:\Work\pci-corpus\plan.pdf readable - 641,807 bytes, magic %PDF-1.7
Write: cannot - denied by Edit(//D:/Work/pci-corpus/**)
```

**This is the criterion MSG-0083 §2 asks for** — "the runner can read the authorized PDF without any
broader permission grant" — and it is now observed rather than assumed. The alternative was to let the
next supervisor cycle discover it, which would have cost a cycle and produced another blocker if the
syntax were wrong. It nearly was: see below.

### Three deny rules were wrong and were removed rather than left in

The first attempt also denied `Write(...)`, `MultiEdit(...)` and `NotebookEdit(...)` on that path. The
permission layer rejected them explicitly:

```text
Permission deny rule "MultiEdit(//D:/Work/pci-corpus/**)" matches no known tool - check for typos.
Permission deny rule: Write(...) is not matched by file permission checks - only Edit(path) rules are.
Use Edit(//D:/Work/pci-corpus/**) instead (Edit rules cover all file-editing tools).
```

They were removed. **Leaving them would have been worse than useless**: a warning on every runner start,
and a settings file that appeared to deny writes through three tools it was not actually matching.
A security control that reads as stricter than it is, is a liability.

### Scope held

**Nothing was broadened.** One external directory, read-only. The four `allow` entries from MSG-0028
are untouched. No repository access, no write, no other external path — exactly the boundary MSG-0083
drew.

**TASK-0027 is READY again** and needs no re-authorization; MSG-0080 still authorizes it.
