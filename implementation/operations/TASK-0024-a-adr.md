# TASK-0024 — A-ADR: Draft Required Employee Policy Assistant ADR Set

**Status:** READY only after queue reconciliation  
**Authorization:** MSG-0068  
**Work package:** WP-0009 — Employee Policy Assistant  
**Type:** Architecture / governance only

## Objective

Draft the minimal set of new ADRs required to make the accepted WP-0009 architecture enforceable before implementation, without duplicating or modifying accepted ADRs.

## Required inputs

- WP-0009 — Employee Policy Assistant
- EPA-0004 accepted by MSG-0062
- MSG-0067 Architecture Lead rulings
- existing accepted ADR register
- repository ADR numbering convention

## Required work

1. Identify accepted ADRs that already govern relevant boundaries.
2. Determine the minimal required new ADR surfaces from WP-0009 §7.2.
3. Draft those ADRs and allocate numbers by repository convention at drafting time.
4. Trace every new decision to accepted authority.
5. Record any unresolved architecture issue rather than inventing a ruling.
6. Create one execution COMMS record and reconcile the queue/status evidence.

## Required surfaces to evaluate

- Grounded Answer Contract
- Approved Document Authority and Lifecycle
- Bilingual Policy Semantics (English/Arabic)
- Retrieval Projection and Index Boundary
- Employee Question Privacy and Retention
- Inference Locality and Provider Boundary

These are proposed surfaces in WP-0009, not pre-authorized ADR numbers. The task must make the final allocation from the repository's actual ADR state.

## Constraints

- No implementation.
- No provider/model/framework/runtime selection.
- No production corpus ingestion.
- No permission or security-boundary changes.
- No Supervisor or scheduling changes.
- No operator-only actions.
- Do not modify accepted ADRs.
- Do not create duplicate ADRs.
- Do not mark T-A, T-B, T-C, T-D, T-E, or any other implementation task READY.

## Acceptance criteria

- Existing accepted ADRs were verified.
- Minimal new ADR set is justified against WP-0009 §7.2.
- New ADR numbers are collision-free and allocated by repository convention.
- Each ADR is traceable to accepted authority.
- No implementation was authorized or performed.
- Evidence is committed and recorded in COMMS.
