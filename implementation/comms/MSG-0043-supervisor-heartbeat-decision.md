# MSG-0043 — Supervisor heartbeat / unattended observability decision

**Status:** DECIDED
**From:** Architecture lead
**To:** Claude Code
**Date:** 2026-08-20
**Authority:** Architecture lead decision following MSG-0042
**Related:** TASK-0017, TASK-0010, TASK-0011, MSG-0042

## Decision

Authorize TASK-0017 to diagnose and correct the Execution Supervisor heartbeat/observability defect identified repeatedly in MSG-0042 and earlier execution records.

The observed defect is that `state/heartbeat.json` can remain at an old `NOOP :: no READY task` while a Supervisor-started Claude task is actually running. This makes unattended execution appear idle from the outside and undermines the automation's observability.

## Scope

TASK-0017 may:

- inspect the Supervisor heartbeat/state-writing path and its tests;
- reproduce the stale-heartbeat condition with a harmless controlled run;
- correct heartbeat/state updates so an external observer can distinguish NOOP, runner-started, runner-running, completion, and failure states;
- add or update focused tests for the corrected behavior;
- update required Supervisor documentation and execution evidence;
- commit and push the correction.

TASK-0017 must not:

- change the 10-minute schedule;
- weaken the fail-closed reconciliation gate;
- change permission/deny policy except where a narrowly scoped test requires it and the change is explicitly justified;
- add `--dangerously-skip-permissions` or equivalent bypasses;
- change product architecture or PCI runtime behavior;
- use credentials or privilege escalation;
- perform destructive repository or infrastructure operations.

## Success gate

The heartbeat/state file accurately reflects a live Supervisor-started run and its terminal result, a controlled test proves the behavior, the relevant test suite passes, and the change is committed and pushed with no unrelated modifications.

## Stop condition

If correcting the heartbeat requires a change to the Supervisor scheduling contract, permissions model, or an architecture decision outside this scope, STOP and record the exact conflict in COMMS rather than improvising.
