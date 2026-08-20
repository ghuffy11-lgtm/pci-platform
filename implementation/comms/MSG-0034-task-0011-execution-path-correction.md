# MSG-0034 — TASK-0011 Execution Path: Diagnosis and Correction

**Status:** OPEN — informational; the smoke test passed after the correction
**Raised:** 2026-08-20
**Raised by:** Claude Code (interactive session)
**Type:** Record — diagnosis and minimal fix
**Authority:** MSG-0033 | **Related:** TASK-0011, TASK-0010, MSG-0032, MSG-0029

## Diagnosis

MSG-0033 asked where the process exits and why, and to distinguish a reconciliation failure from a
runner-launch, prompt, permission, or Claude-session failure.

**It was a reconciliation failure — the earliest gate.** The supervisor's log recorded every one of
the operator's manual triggers:

```text
05:20:13Z [NOOP] :: not reconciled: local and remote differ
05:22:54Z [NOOP] :: not reconciled: local and remote differ
05:24:29Z [NOOP] :: not reconciled: local and remote differ
05:25:04Z [NOOP] :: not reconciled: local and remote differ
05:27:18Z [NOOP] :: not reconciled: local and remote differ
```

The workstation clone was **behind** `origin/main`, because the architecture lead had just pushed
the TASK-0011 authorization. The supervisor exits at that gate *before reading the queue*, so it
never saw TASK-0011 as READY, never launched `claude.exe`, and produced no MSG-0032.

Nothing was wrong with the runner, the prompt, the permissions, or the Claude session. The window
really did open and close having correctly decided to do nothing. The message the operator glimpsed
was that decision.

## The defect underneath it

The gate was right; the design around it was not. **Nothing ever pulled.**

The supervisor refuses to act unless local equals remote, and had no way to reach that state on its
own. So every push by the architecture lead — including every authorization the supervisor exists to
act on — stalled it permanently until a human intervened. It happened here, and it happened once
before, in MSG-0029.

A scheduler that cannot see the authorization it is waiting for is not fail-closed. It is stuck.

## The correction — smallest that resolves it

`Test-RepositoryReconciled` now distinguishes the three ways local and remote can differ, and
resolves only the one that is safe:

| Situation | Behaviour |
|---|---|
| strictly **behind**, clean tree | `git merge --ff-only` — cannot lose work, cannot merge, cannot rewrite history. This *is* "reconcile". |
| **ahead** (with or without behind) | **refuses.** What to do with unpushed local work is not a scheduler's decision. |
| behind but **dirty** | **refuses.** Something is mid-change; a human should look. |

Plus, for MSG-0033 items 3 and 4: every invocation now writes a `CYCLE_START` line before doing
anything, so a cycle that dies early still leaves a trace. *"Nothing in the log"* and *"the script
never ran"* must not look identical to someone watching a console flash past.

Logging was already durable and file-based; the console was never the record. What was missing was
a first line proving the invocation happened at all.

**Nothing else changed.** `acceptEdits` unchanged, deny list unchanged, no
`--dangerously-skip-permissions`, no credential access, no force push, no new task, no scope change.

## Verification

Tests: **27 passed, 0 failed** — two new, built on a real git fixture. The behind-case test asserts
the fixture *actually diverged* before trusting its result, because the first version of it silently
tested nothing: the second clone had landed on an unborn `master`, so its `push origin main` matched
no refspec and the two repositories never diverged at all.

That is worth recording as its own small lesson. A test that sets up the wrong precondition passes
for the wrong reason, and looks exactly like a test that works.

## The retry — the supervisor did it

```text
05:33:35Z [INFO]   CYCLE_START    :: pid=23196 enabled=True dryRun=False
05:33:40Z [ACTION] RUNNER_COMMAND :: claude.exe -p "You were started automatically ... TASK-0011 ..."
05:33:40Z [ACTION] RUNNER_STARTED :: pid=26424 task=TASK-0011
05:46:46Z [ACTION] STARTED        :: runner completed: TASK-0011 exited 0; stdout 4317 bytes
```

Thirteen minutes, **exit 0**, stderr empty, lock acquired and released.

Note `exited 0`: the earlier TASK-0003 run reported an empty exit code from the pre-fix launch path.
This is the first end-to-end confirmation that the `System.Diagnostics.Process` replacement reports
exit codes correctly in a real supervisor cycle, not only in unit tests.

## TASK-0011 pass criteria — all four met

| Criterion | Evidence |
|---|---|
| MSG-0032 created | `implementation/comms/MSG-0032-task-0011-supervisor-smoke-test.md`, present on `origin/main` |
| COMMS register updated | contains MSG-0032 |
| TASK-0011 COMPLETE | queue board records it |
| Commit pushed | `d16665a`, `3b2eda5`, `87034a7` — **pushed by the runner itself** |

The runner used the `Bash(git push origin main)` capability authorized in MSG-0028. This is the
first time an unattended session has delivered its own evidence to GitHub without a human carrying
it, which was the gap MSG-0028 §3 was opened to close.

## One record corrected

`implementation/status/current.md` still listed TASK-0006 as `WAITING_FOR_ARCHITECTURE_LEAD` while
the queue recorded it `COMPLETE`. The queue is authoritative and was right; the status table was
stale. Corrected here.

## State

Every task is COMPLETE except TASK-0002 (ABORTED, premise disproven). No task is READY, no blocker
is open, and the supervisor is back to `NOOP: no READY task` on its ten-minute cadence.
