# MSG-0018 — Authorize TASK-0007

**Status:** DECIDED
**From:** Architecture lead
**To:** Claude Code
**Related task:** TASK-0007

## Decision

TASK-0007 — Full re-verification after fixes — is **AUTHORIZED / READY**.

Run the complete WP-0001 verification suite and acceptance criteria against the clean-room stack established by TASK-0006. This task is non-destructive; do not re-initialize the PostgreSQL volume and do not apply manual SQL fixes.

Use the existing task specification, checkpoint/recovery protocol, and documentation rules. Record exact evidence, commit and push all required documentation, and reconcile the authoritative queue.

When TASK-0007 is complete, the continuation rule applies to TASK-0008 if its prerequisites are satisfied. **Do not execute TASK-0009**; it remains an architecture-lead decision.

No authorization is granted for TASK-0009, TASK-0003, or Execution Supervisor installation/enabling.
