# MSG-0071 — Architecture Lead Review of TASK-0024 ADR Set

**Status:** DECIDED
**Authority:** Architecture Lead
**Related:** MSG-0070, MSG-0068a, MSG-0068b, WP-0009 §7
**Date:** 2026-08-21

## Decision

The Architecture Lead accepts ADR-0017 through ADR-0022 as the required enforceable ADR set for WP-0009, subject to the bounded conditions below.

1. **ADR-0017 — Grounded Answer Contract:** ACCEPTED. The fail-closed, citation-bound answer contract is approved. The entailment model and numeric thresholds remain explicitly undecided under SPEC-0020.
2. **ADR-0018 — Approved Document Authority and Lifecycle:** ACCEPTED.
3. **ADR-0019 — Bilingual Policy Semantics:** ACCEPTED as a bounded architectural decision. Its Arabic normalization rules remain deliberately incomplete and must be established from empirical corpus evidence before production use; no invented normalization rules are authorized.
4. **ADR-0020 — Retrieval Projection and Index Boundary:** ACCEPTED. The no-retrieve-then-suppress confidentiality boundary and fail-closed handling are approved.
5. **ADR-0021 — Employee Question Privacy and Retention:** ACCEPTED.
6. **ADR-0022 — Inference Locality and Provider Boundary:** ACCEPTED.

The proposed ADRs are to be promoted to the accepted decision register according to repository convention. The accepted records must preserve their traceability and must not introduce provider, model, runtime, framework, or implementation selections that were deliberately left open.

## Explicit non-decisions

- A-SURVEY remains unauthorized.
- A-STACK remains unauthorized.
- No implementation task is authorized or marked READY by this decision.
- No provider/model/framework/runtime selection is authorized.
- ADR-0019's normalization rule set is deferred to empirical corpus evidence.

## Next architecture boundary

The next action is to reconcile and promote the accepted ADR set into the governed architecture records. Only after that reconciliation may the Architecture Lead consider authorizing the next bounded architecture task (A-SURVEY or A-STACK) based on the resulting dependency state.
