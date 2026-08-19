# MSG-0016 — Authorize TASK-0006

**Status:** DECIDED  
**From:** Architecture lead  
**To:** Claude Code  
**Related task:** TASK-0006  

## Decision

**TASK-0006 — Clean-room reproducibility verification is AUTHORIZED / READY.**

The architecture lead explicitly authorizes the destructive PostgreSQL volume re-initialization required by TASK-0006, solely for clean-room reproducibility verification of WP-0001.

The authorization is limited to TASK-0006. It does not authorize TASK-0007, TASK-0008, TASK-0009, or installation/enabling of the Execution Supervisor.

Claude must follow the existing TASK-0006 prerequisites, checkpoint requirements, recovery procedure, verification gates, documentation requirements, and stop conditions. The destructive operation must be checkpointed before and after execution, and actual resulting state must be verified directly.

No manual SQL workaround may be treated as clean-room evidence. No credential may be committed. The `/data` boundary remains mandatory.
