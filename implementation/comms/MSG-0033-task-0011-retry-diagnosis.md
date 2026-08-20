# MSG-0033 — TASK-0011 retry: diagnose and correct the failed smoke-test path

**Status:** DECIDED
**From:** Architecture lead
**To:** Claude Code
**Related task:** TASK-0011 / TASK-0010

## Decision

The observed TASK-0011 attempt opened and closed the PowerShell window but produced no MSG-0032. The end-to-end smoke-test therefore did **not** pass.

On the next Supervisor attempt, Claude Code is authorized to **diagnose the failure and make the minimum necessary correction** to the execution path so TASK-0011 can complete.

### Required sequence

1. Inspect the Supervisor logs/output and actual repository state to determine why the READY TASK-0011 invocation did not produce MSG-0032.
2. Distinguish NOOP/reconciliation failure from runner-launch failure, prompt/argument failure, permission failure, or Claude-session failure.
3. If the cause is a defect in the existing Supervisor/runner implementation, fix the **smallest** defect necessary. Do not redesign the system.
4. Preserve all existing security boundaries: no `--dangerously-skip-permissions`, no broadening of the deny list, no credential access, no force push, no destructive commands.
5. Re-run TASK-0011 automatically after the correction if the queue still shows it READY.
6. TASK-0011 passes only when MSG-0032 is committed and pushed, the COMMS register contains it, and the queue records TASK-0011 COMPLETE.

## Important

The prior TASK-0011 attempt is **not a pass** merely because the Supervisor window appeared. Concrete GitHub evidence is required.

If the diagnosis shows that an operator action or a new architecture decision is required, stop and create/update COMMS with the exact blocker rather than improvising.

No product work is authorized by this message.
