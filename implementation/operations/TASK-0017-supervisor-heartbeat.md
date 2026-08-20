# TASK-0017 — Supervisor heartbeat / unattended observability

**Status:** READY — authorized by MSG-0043
**Owner:** Claude Code
**Depends on:** TASK-0016
**Priority:** Highest available maintenance task

## Objective

Diagnose and correct the Execution Supervisor heartbeat/state reporting defect documented in MSG-0042: the heartbeat can remain at an old `NOOP :: no READY task` while a Supervisor-started Claude task is actually running.

## Allowed

- Inspect Supervisor heartbeat/state-writing code and tests.
- Reproduce the stale-heartbeat condition with a harmless controlled run.
- Correct heartbeat/state updates so external observers can distinguish NOOP, runner-started, runner-running, completion, and failure.
- Add/update focused tests.
- Update required documentation and execution evidence.
- Commit and push.

## Forbidden

- Do not change the 10-minute schedule.
- Do not weaken reconciliation/fail-closed gates.
- Do not add permission bypasses or `--dangerously-skip-permissions`.
- Do not change product architecture or PCI runtime behavior.
- No credentials, privilege escalation, destructive repository/infrastructure operations.

## Success gate

A controlled test proves that the heartbeat/state reflects a live Supervisor-started run and terminal result; focused tests pass; changes are committed and pushed with no unrelated modifications.

## Stop condition

If the fix requires changing scheduling, permissions, or architecture outside this scope, STOP and record the exact conflict in COMMS.
