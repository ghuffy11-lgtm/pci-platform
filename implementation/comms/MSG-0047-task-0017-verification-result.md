# MSG-0047 — TASK-0017 Verification Result: 36 Passed, 0 Failed

**Status:** **CLOSED** — TASK-0017 COMPLETE; the one gap it named (no live post-fix run) was closed by TASK-0018 (MSG-0049).
**Raised:** 2026-08-20
**Raised by:** Claude Code (interactive session)
**Type:** Record — verification evidence
**Authority:** MSG-0046 (Option A) | **Related:** TASK-0017, MSG-0043, MSG-0045

## The result

MSG-0046 authorized exactly one action: run the specified test command once and report the real
result. Run verbatim, from the specified directory:

```powershell
cd D:\Work\pci-platform\implementation\operations\supervisor
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\supervisor.tests.ps1
```

**36 passed, 0 failed.**

The four tests that decide TASK-0017, under `live-run observability (TASK-0017 regression)`:

```text
PASS  the heartbeat is NOT stale while a supervisor-started runner is alive
PASS  the terminal heartbeat reports completion and releases the runner
PASS  a runner that exits non-zero is FAILED, not COMPLETED
PASS  an idle cycle still reports NOOP
```

Nothing was substituted, nothing routed around, and no result inferred. The full output is in this
session's transcript; the counts above are what the run printed.

## Why running it here was not a workaround

The command was refused by the **unattended runner's** permission layer, which is why MSG-0045 had
to ask. It is not refused in an interactive session on the same machine, where it has run
repeatedly throughout this work. Executing the exact authorized command in the context that permits
it is the operator-side path MSG-0046 describes — not a substitute for it.

No permission, allowlist, deny rule, schedule, or gate changed. The unattended boundary is exactly
where it was.

## Assessment against the MSG-0043 success gate

| Gate clause | State |
|---|---|
| Heartbeat reflects a live supervisor-started run and its terminal result | **MET** — proven by the four regression tests above |
| A controlled test proves the behaviour | **MET** |
| The relevant test suite passes | **MET** — 36/36 |
| Committed and pushed, no unrelated modifications | **MET** — `9f87e70`, on `origin/main` |

**TASK-0017 is COMPLETE.** Its commit was titled "NOT verified" because the runner could not run the
suite; that qualifier is now discharged, and the record says so rather than leaving a commit message
permanently disclaiming a fix that works.

## One limit worth stating precisely

The gate asks for a **controlled test**, and that is what exists. What has *not* happened is a
post-fix **real** supervisor-started run: the last live run was TASK-0017's own, which used the
pre-fix code, and nothing has been READY since.

So the heartbeat's live-run behaviour is proven by construction and by test, not yet observed in
production. The next authorized task will exercise it for real, and that is the moment to glance at
`state/heartbeat.json` mid-run and confirm it reads `RUNNER_RUNNING` rather than a stale `NOOP`.

I would rather name that gap than let "36 passed" imply more than it does.

## A recurring numbering collision

Two files both claim MSG-0046:

```text
MSG-0046-architecture-decision-task-0017-test.md
MSG-0046-architecture-decision-task-0017-test-gate.md
```

**They agree** — both select Option A, both forbid permanent permission expansion — so unlike the
MSG-0020 pair this is not a conflict and required no stop. But it is the third time one number has
carried two files (MSG-0020, MSG-0033, MSG-0046), and the first of those cost a full stop-and-ask
cycle because the two copies disagreed.

The existing rule from MSG-0035 covers numbering; what recurs is two files being written for one
decision. A cheap habit would help: when a decision needs restating, amend the existing file rather
than adding a sibling. Recorded as an observation, not a change — no rule of yours is mine to
rewrite.

## State

TASK-0017 COMPLETE. No task is READY, no blocker is open, the supervisor is idle at
`NOOP: no READY task`, and `HEAD` equals `origin/main`.
