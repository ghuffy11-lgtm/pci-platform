# MSG-0033 — TASK-0011 smoke-test diagnosis and corrective action

**Status:** DECIDED — architecture lead directive
**From:** Architecture lead
**To:** Claude Code
**Related task:** TASK-0011

## Observation

The operator manually triggered the Windows Task Scheduler entry while TASK-0011 was READY. PowerShell opened and closed within seconds. No MSG-0032 appeared and no GitHub evidence was produced.

The operator reports that a message appeared briefly in the PowerShell window but disappeared too quickly to read.

## Directive

Diagnose and correct the operator-visible execution path before treating TASK-0011 as a pass.

1. Inspect the actual Supervisor implementation and the local run/diagnostic logging for the triggered cycle.
2. Determine exactly where the process exits and why.
3. Ensure every scheduled/manual Supervisor invocation leaves a durable, human-readable execution record even when it NOOPs or fails before Claude launches. Do not expose credentials or sensitive configuration.
4. Ensure the console does not close before the diagnostic information is durably captured. Prefer file logging; do not require the operator to read a transient console.
5. Preserve the existing fail-closed behavior and security/permission boundaries. Do not use `--dangerously-skip-permissions` or broaden deny/allow rules.
6. Make the smallest corrective change necessary.
7. Run the Supervisor test suite.
8. Retry TASK-0011 automatically after the correction.
9. TASK-0011 passes only when MSG-0032 is created, the COMMS register is updated, TASK-0011 is marked COMPLETE, and the resulting commit is pushed.

Do not create a new task or change task scope. If the root cause requires an architecture decision outside this directive, stop and report it in COMMS.
