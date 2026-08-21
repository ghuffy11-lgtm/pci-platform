# MSG-0073 — TASK-0025 ADR Promotion Authorization

**Status:** AUTHORIZED
**Authority:** Architecture Lead
**Related:** MSG-0072, MSG-0071, TASK-0024

## Authorization

TASK-0025 is authorized as a bounded architecture-record promotion task.

### Objective
Promote ADR-0018 through ADR-0022 from their accepted/proposed implementation records into the authoritative `docs/decisions/` decision register, preserving their approved content, numbering, traceability, and explicit non-decisions.

### Constraints
- Do not change the substance of the accepted ADR decisions.
- Do not introduce provider, model, framework, runtime, or implementation selections that remain deliberately open.
- Do not alter ADR-0019 normalization rules; those remain deferred to empirical corpus evidence.
- Do not authorize implementation.
- Do not mark A-SURVEY, A-STACK, or T-0 READY.
- Verify every promoted ADR against its source before reporting completion.

### Acceptance criteria
1. ADR-0018, ADR-0019, ADR-0020, ADR-0021, and ADR-0022 each exist in `docs/decisions/` using the repository's established ADR convention.
2. Promoted records preserve the accepted decision content and traceability.
3. No implementation authorization is introduced.
4. COMMS and queue records are updated consistently.
5. TASK-0025 is reported COMPLETE only after repository verification.

**Claude may execute TASK-0025 when it is reconciled as READY.**
