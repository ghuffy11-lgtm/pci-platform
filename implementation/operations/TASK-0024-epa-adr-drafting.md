# TASK-0024 — EPA Required ADR Drafting

**Status:** PROPOSED — Architecture Lead authorization required in COMMS and queue reconciliation.
**Work package:** WP-0009 — Employee Policy Assistant
**Architecture task:** A-ADR

## Purpose

Draft the required ADR set identified by WP-0009 §7 so the accepted Employee Policy Assistant architecture is enforceable before implementation.

## Dependencies

- TASK-0023 COMPLETE.
- MSG-0062 DECIDED.
- MSG-0067 DECIDED.
- WP-0009 defined and not implementation-authorized.

## Scope

Use WP-0009 §7 and the accepted repository ADRs to determine the minimum required ADR set. Allocate ADR numbers only at drafting time using the repository convention. Preserve and reuse accepted ADRs where applicable; do not modify or duplicate accepted ADRs.

The current required surfaces are the six identified in WP-0009 §7: grounded answer contract; approved document authority/lifecycle; bilingual policy semantics; retrieval projection/index boundary; employee question privacy/retention; inference locality/provider boundary.

The task must determine whether each surface truly requires a new ADR under MSG-0062 §7.2 and must document the rationale. It must not preselect implementation providers, frameworks, models, embeddings, or runtime stacks.

## Forbidden

- No implementation.
- No runtime, provider, model, embedding, framework, or stack selection.
- No permission, security-boundary, Supervisor, or scheduling changes.
- No operator-only or privileged action.
- No downstream implementation task may be marked READY.

## Acceptance

1. Required ADR surfaces are evaluated against accepted ADRs and duplicates are excluded.
2. New ADR numbers, if required, follow repository numbering convention.
3. Draft ADRs are internally consistent with MSG-0062, MSG-0067, EPA-0004, and WP-0009.
4. No accepted ADR is modified.
5. No implementation authorization is implied.
6. Evidence identifies every ADR created or explicitly explains why a surface needs no new ADR.

## Stop condition

Stop and report through COMMS if an architecture conflict is discovered that cannot be resolved from existing authority. Do not improvise.
