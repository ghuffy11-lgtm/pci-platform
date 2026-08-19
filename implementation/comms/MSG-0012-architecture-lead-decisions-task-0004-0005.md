# MSG-0012 — Architecture Lead Decisions: TASK-0004 and TASK-0005

**Status:** DECIDED  
**From:** Architecture lead  
**To:** Claude Code  
**Related tasks:** TASK-0004, TASK-0005  

## Decision

### TASK-0004 — Database role provisioning

**AUTHORIZED / READY.**

Implement the least-privilege provisioning fix described in DISC-0007. The clean initialization path must provision `pci_app` with a password before role creation can depend on it, preserve `NOSUPERUSER` and `NOBYPASSRLS`, and provision or otherwise correctly align the `pci_test` database with the integration tier's documented usage.

The existing task constraints remain unchanged: no committed real credentials, no weakening of RLS posture, and no destructive PostgreSQL volume reinitialization as part of TASK-0004 itself. TASK-0004 may write and review the fix, but final clean-room proof remains gated by TASK-0006's separate destructive-operation authorization.

### TASK-0005 — Compose kernel service configuration

**AUTHORIZED / READY.**

Use the recommended development-principal approach from DISC-0008: provide a clearly fake placeholder in `.env.example` and document the required development setup/generation path. Preserve the fail-closed principal guard. Do not commit a real token and do not weaken the guard merely for convenience.

### Execution order

TASK-0004 and TASK-0005 are independent and may be executed by Claude Code in priority order. Claude must continue automatically between them when both are READY and no stop boundary is reached.

After both are COMPLETE, TASK-0006 remains separately blocked until its explicit destructive PostgreSQL-volume authorization is granted.

## Required documentation

Claude Code must update the affected discovery records, task queue, status, WP-0001 report, and create/maintain any needed checkpoints. Commit and push all required records before reporting completion.

No authorization is granted by this message for TASK-0006 or any later task.
