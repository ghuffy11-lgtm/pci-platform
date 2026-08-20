# TASK-0018 — Live Supervisor Heartbeat Validation

**Status:** READY
**Depends on:** TASK-0017 COMPLETE, MSG-0047
**Owner:** Claude Code
**Authority:** Architecture lead

## Objective
Exercise the corrected Supervisor through a real unattended Supervisor-started run and record direct evidence that `state/heartbeat.json` reflects the live runner state rather than remaining at a stale `NOOP`.

MSG-0047 states that TASK-0017 is complete and identifies this as the next authorized exercise: observe `state/heartbeat.json` mid-run and confirm `RUNNER_RUNNING`, then confirm the terminal result.

## Allowed
- Execute only the existing repository test/inspection commands needed to perform the controlled live-run observation.
- Observe `state/heartbeat.json`, Supervisor logs, and the task's own execution state while this task is running.
- Record timestamps and the observed heartbeat fields for the running and terminal states.
- Create exactly one execution/verification COMMS record using the next available message number.
- Update the queue/checkpoint/status documentation required to record the result.

## Forbidden
- Do not change Supervisor code, configuration, permissions, scheduling, or runner behavior.
- Do not modify the heartbeat implementation to make the observation pass.
- Do not manually trigger the Supervisor.
- Do not broaden any allowlist or permission.
- Do not create unrelated tasks or architecture.
- No destructive commands, credentials, privilege escalation, force-push, reset, or clean.

## Success gate
1. This task is actually launched by the enabled ten-minute Supervisor, not manually.
2. While the runner is alive, `state/heartbeat.json` shows `RUNNER_RUNNING` and a live `runnerPid`/recent heartbeat timestamp.
3. The terminal heartbeat records the actual completion result and the runner lock is released.
4. No stale `NOOP` state persists throughout the live run.
5. Evidence is recorded in COMMS and the queue is reconciled.

## Stop conditions
STOP and report in COMMS if the task was not Supervisor-started, the heartbeat contradicts the live runner state, the runner lock is corrupt/stale, the repository is not at `origin/main`, or any action would require changing permissions, scheduling, or architecture.

## Recovery
If the observation fails, do not modify the Supervisor to compensate. Record the exact heartbeat/log evidence, leave the task IN_PROGRESS with a checkpoint, and await architecture-lead direction.
