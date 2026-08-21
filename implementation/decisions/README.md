# Proposed Architecture Decisions

Decisions discovered during implementation that require architecture-lead review.

Records here are **PROPOSED**, never accepted. They carry no architectural authority until the
architecture lead promotes them to `docs/decisions/`.

Per `CLAUDE.md`, an implementation agent must stop at the boundary where an architectural
decision is required, record the issue here, explain impact and options, and must not silently
modify accepted architecture.

| ID | Title | Status | Work package | Drafted by |
|---|---|---|---|---|
| ADR-0015 | Kernel Implementation Stack | PROPOSED — **promoted**; accepted at `docs/decisions/ADR-0015-kernel-implementation-stack.md` | WP-0001 | — |
| ADR-0016 | Tenant Isolation Enforcement Strategy | PROPOSED — **promoted**; accepted at `docs/decisions/ADR-0016-tenant-isolation-enforcement.md` | WP-0001 | — |
| ADR-0017 | Grounded Answer Contract | **ACCEPTED** by MSG-0071 — **promoted**; accepted at `docs/decisions/ADR-0017-grounded-answer-contract.md` | WP-0009 | TASK-0024 |
| ADR-0018 | Approved Document Authority and Lifecycle | **ACCEPTED** by MSG-0071 — **promoted**; accepted at `docs/decisions/ADR-0018-approved-document-authority-and-lifecycle.md` | WP-0009 | TASK-0024 |
| ADR-0019 | Bilingual Policy Semantics (English/Arabic) | **ACCEPTED** by MSG-0071 as a bounded decision — **promoted**; accepted at `docs/decisions/ADR-0019-bilingual-policy-semantics.md`. Arabic normalization rules remain **deliberately incomplete** and must come from empirical corpus evidence before production use, with no invented rules authorized | WP-0009 | TASK-0024 |
| ADR-0020 | Retrieval Projection and Index Boundary | **ACCEPTED** by MSG-0071 — **promoted**; accepted at `docs/decisions/ADR-0020-retrieval-projection-and-index-boundary.md`. The no-retrieve-then-suppress boundary and fail-closed handling are approved | WP-0009 | TASK-0024 |
| ADR-0021 | Employee Question Privacy and Retention | **ACCEPTED** by MSG-0071 — **promoted**; accepted at `docs/decisions/ADR-0021-employee-question-privacy-and-retention.md` | WP-0009 | TASK-0024 |
| ADR-0022 | Inference Locality and Provider Boundary | **ACCEPTED** by MSG-0071 — **promoted**; accepted at `docs/decisions/ADR-0022-inference-locality-and-provider-boundary.md` | WP-0009 | TASK-0024 |

## The WP-0009 set — ADR-0017 … ADR-0022

Drafted by **TASK-0024 (A-ADR)** under MSG-0068a and MSG-0068b, as the minimum set MSG-0062 §7.2
requires to make the accepted WP-0009 architecture enforceable before production use. They correspond
to the six surfaces sequenced in `docs/program/work-packages/WP-0009-employee-policy-assistant.md` §7.

**Numbers were allocated at drafting time** by the repository convention, verified collision-free
against the actual repository state: `docs/decisions/` holds ADR-0001…ADR-0016 with no gaps, and a
repository-wide search for ADR-0017…ADR-0029 returned only prose references and proposals — no record
file. Evidence: `implementation/operations/checkpoints/TASK-0024.md` checkpoint 1; MSG-0070.

**No accepted ADR was modified, duplicated, renamed, or superseded.** ADR-0007 (identity) and ADR-0016
(tenant isolation) are reused unchanged and need no successor; ADR-0003, ADR-0005, ADR-0009, ADR-0013
and ADR-0014 are reused and cited. **ADR-0011 and SPEC-0002 are not engaged** — the assistant has no
tool surface and performs no mutation; engaging either later is itself an ADR.

**These drafts authorize nothing.** No implementation task is READY, no provider, model, embedding,
framework, index technology or runtime is selected, and none may be inferred from them.

## Promotion — completed 2026-08-21 by TASK-0025

**All six are now promoted.** ADR-0017 was promoted by the Architecture Lead in `d9c4524`;
**ADR-0018 … ADR-0022 were promoted by TASK-0025** under MSG-0073, which answers the MSG-0072
promotion gap. The copies in `docs/decisions/` are the authoritative records; the copies here are
**RATIFIED** historical drafts retained unchanged.

**Promotion changed headers only.** Each promoted file was produced by copying its draft byte for byte
and editing exactly two things — the `Status` block, and an added `Accepted by: Architecture Lead —
MSG-0071` line. A `diff` of each pair shows those two changes and nothing else; **zero body
differences**. Evidence: MSG-0075 §3 and `implementation/operations/checkpoints/TASK-0025.md`
checkpoint 2.

**The sentence above still holds after promotion, and that was checked rather than assumed.** The three
conditions MSG-0071 attached were re-verified in the promoted copies: no provider, model, runtime or
framework is selected (ADR-0022 still cites ADR-0003's note on Ollama and explicitly declines to elevate
it); ADR-0019 still states it is incomplete for production by design; ADR-0017's entailment model and
numeric thresholds remain open under SPEC-0020. **A-SURVEY, A-STACK and T-0 remain unauthorized.**
