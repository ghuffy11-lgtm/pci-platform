# BLK-0013 — `origin/main` Moved Mid-Run; TASK-0050's Records Are Committed Locally and CANNOT Be Published

**Status:** **OPEN** 2026-08-26 — requires an operator or Architecture Lead action. **This runner cannot
clear it and must not try.**
**Raised:** 2026-08-26, by the supervisor-started TASK-0050 session (`runner.lock` pid **14068**,
acquired **2026-08-25T21:51:58Z**, host `LENOVO-LA0X1754`)
**Severity:** **Communication channel down for this session.** The evidence work is complete and
committed; **none of it is on `origin/main`.**
**Related:** **BLK-0006** (the mid-run-movement precedent), **BLK-0002** / **BLK-0007** (push
unavailable), **BLK-0012**, **MSG-0168**, TASK-0050; CLAUDE.md *"Mid-run repository movement — abort"*
(authority: MSG-0028 decision 2)
**Starting HEAD:** `9d71790d9480f699715c25811da3c3c4dda84a9b`
**Local HEAD at the stop:** `339157f`

---

## Summary

**TASK-0050 executed in full and its records are written and committed. The push was REJECTED because
`origin/main` moved after this session started, and this runner has no permitted way to read the
remote, reconcile against it, or publish.**

**This is the fail-closed boundary CLAUDE.md names, not an error to retry past.** *"If `HEAD` or
`origin/main` changes unexpectedly after a session has started, that session must stop at the next safe
checkpoint, document the discrepancy, and make no further changes against a moving repository state."*

**Nothing was force-pushed, rebased, merged, reset or discarded.** The three commits are intact locally
and will land unchanged once an authorized reconciliation happens.

---

## VERIFIED — the rejection, quoted

```text
$ git push origin main
To github-pci:ghuffy11-lgtm/pci-platform.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'github-pci:ghuffy11-lgtm/pci-platform.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally.
```

**Read exactly:** the remote holds at least one commit this session does not have, so `origin/main` is
**no longer** `9d71790` and **has moved since the run began**.

## VERIFIED — the transport is fine, which corrects checkpoint 1's open question

**Checkpoint 1 recorded that `git fetch` was denied and established the cause by reading both permission
files.** That diagnosis is now **confirmed from the other direction**: `git push origin main` **reached
`github-pci`** and came back with a *protocol-level* rejection. **The network, the SSH transport and the
credential all work.** So the fetch denial is the **permission set** and nothing else — **not** BLK-0007's
transport fault, which this could otherwise have been mistaken for.

**Recorded because a wrong diagnosis here would send the operator to fix SSH, which is not broken.**

## VERIFIED — no reconciliation is possible from this session

**Every route was tried once, in the single-command form BLK-0010 and BLK-0011 established, and none was
tried twice:**

```text
$ git fetch origin              -> This command requires approval
$ git fetch --all --prune       -> This command requires approval
$ git ls-remote origin main     -> This command requires approval
$ git push --dry-run origin main-> This command requires approval
```

**Cause established by reading the permission set, not inferred from the failures.**
`runner-settings.json` grants exactly `git push origin main`, two `checkout-index` forms and one
`ls-files`. `.claude/settings.local.json` adds `git config`, `git var`, `git add` and `git commit`.
**Neither grants `fetch`, `pull`, `ls-remote`, `merge` or `rebase`.**

**So this runner can push and cannot read the remote at all.** It can discover that `origin/main` moved
**only** by being refused — which is what happened, and which is the weakest possible form of the check
the stop condition asks for.

## UNKNOWN — what moved it, and by how much

**Stated as UNKNOWN rather than guessed, because a wrong attribution here costs more than an absent
one.** This session cannot read the remote, so it cannot name the commit, the author, the time, or
whether the change touches any file this task wrote.

**INFERRED, and offered only as the first place to look:** **MSG-0166** records that the Architecture
Lead side of the loop is automated — *"a durable Routine starts a fresh session hourly at an off-minute"*
— and an hourly Lead session is the most likely mover during a run of this length. **That is an
inference from a repository record, not an observation, and it must be checked before it is acted on.**

## What is committed locally and NOT published

| Commit | Contents |
|---|---|
| `f41c202` | checkpoint 1 — startup, run provenance, starting `HEAD`, the `git fetch` denial |
| `f063f09` | `implementation/probes/TASK-0050/` — both harnesses and both outputs, executed |
| `339157f` | **MSG-0168**, **BLK-0012**, **DISC-0014**, the three index updates, the queue row, the status file, checkpoint 2 |

**All three are intact. None is on `origin/main`.**

## The consequence for TASK-0050's completion, stated without rounding up

**TASK-0050's required outcome 7 is *"Record COMMS, status, queue, checkpoint, harness/output, and
verification from `main`."*** **That outcome is NOT MET**, and the task is therefore **reported as
executed but NOT COMPLETE**, naming the gap:

- **outcomes 1–6 and the referral: MET**, with evidence in `f063f09` and MSG-0168;
- **outcome 7: UNMET** — the records exist and are committed, **but they are not on `main`, and
  verification from `main` is impossible from this session.**

**The queue row is marked BLOCKED accordingly.** **A record that only this machine can read is not the
project record** — CLAUDE.md is explicit that the repository is the memory, and until these commits
land, for every practical purpose the work has not been published.

**None of the evidence changes when it lands.** The measurements, controls and referral in MSG-0168 are
what they are; only their availability is blocked.

## What must NOT be done, and was not

- **No force-push.** Forbidden without explicit authorization, and it would destroy whatever moved the
  remote.
- **No rebase, merge, pull or reset.** Not granted, and CLAUDE.md forbids further changes against a
  moving repository state until reconciliation confirms consistency.
- **No retry loop.** The push was attempted, refused, and attempted once more at the close of the run so
  the final record states a current result rather than a stale one. **A non-fast-forward does not
  become a fast-forward by repetition.**
- **No `node` + `child_process` route to a denied git capability.** Same rule, same refusal, third time
  in this programme (BLK-0011, BLK-0012, here).

## What the operator or Architecture Lead can do

| | Option | What it costs | What it risks |
|---|---|---|---|
| **A** | **Reconcile in an attended session** — `git fetch`, inspect what moved, rebase these three commits onto it, push | A few minutes | **Recommended.** The commits touch `implementation/` only; **the likeliest mover is an hourly Lead session**, whose files should not overlap the probe or the new records. **Inspect before rebasing** — the queue row, the status header and the three index files are the plausible conflict points |
| **B** | **Grant the unattended runner `git fetch origin` (read-only)** | One line in `runner-settings.json` | **Least broadening of the three, and it removes the whole class of failure.** A runner that can read the remote can detect mid-run movement **when it happens** rather than at the push, and can stop before writing a record it cannot publish. **It grants no write capability** — the push grant already exists and is narrower than the fetch would be |
| **C** | Leave it and let the next session inherit the divergence | Nothing now | **Not recommended.** The next runner's startup checklist reads a status file claiming state that `origin/main` does not have. **BLK-0006 is the precedent for how confusing that becomes** |

**Option B is a standing fix and option A is the immediate one; they are not alternatives.**

## Evidence trail

| Item | Where |
|---|---|
| The full execution record this blocker cannot publish | `implementation/comms/MSG-0168-task-0050-gap-b-e4-subject-execution-record.md` |
| Run provenance, starting `HEAD`, and the fetch denial diagnosed | `implementation/operations/checkpoints/TASK-0050.md` checkpoints 1 and 3 |
| The harness and output | `implementation/probes/TASK-0050/` (`f063f09`) |
| The mid-run-movement precedent | `implementation/blockers/BLK-0006-mid-run-repository-movement.md` |
| The rule this stop obeys | `CLAUDE.md`, *"Mid-run repository movement — abort"* (MSG-0028 decision 2) |
