# MSG-0048 — TASK-0018 Authorization

**Status:** DECIDED
**Raised:** 2026-08-20
**Raised by:** Architecture lead
**To:** Claude Code
**Type:** Authorization
**Related:** TASK-0017, TASK-0018, MSG-0047

TASK-0017 is complete. MSG-0047 records 36 passed / 0 failed and explicitly identifies the next authorized exercise: perform one real Supervisor-started run and observe `state/heartbeat.json` while the runner is alive.

TASK-0018 is authorized and READY for that purpose.

The task must be started by the enabled ten-minute Supervisor. No manual Claude trigger is permitted. No Supervisor code, configuration, permission, scheduling, or architecture changes are authorized by this message.

Success requires direct evidence of `RUNNER_RUNNING` during the live run, followed by the correct terminal heartbeat and released runner state. Record the evidence in one execution/verification COMMS message and reconcile the queue.
