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
| ADR-0017 | Grounded Answer Contract | **PROPOSED** — awaiting the Architecture Lead | WP-0009 | TASK-0024 |
| ADR-0018 | Approved Document Authority and Lifecycle | **PROPOSED** — awaiting the Architecture Lead | WP-0009 | TASK-0024 |
| ADR-0019 | Bilingual Policy Semantics (English/Arabic) | **PROPOSED** — awaiting the Architecture Lead; **incomplete for production by design**, see its §6 | WP-0009 | TASK-0024 |
| ADR-0020 | Retrieval Projection and Index Boundary | **PROPOSED** — awaiting the Architecture Lead | WP-0009 | TASK-0024 |
| ADR-0021 | Employee Question Privacy and Retention | **PROPOSED** — awaiting the Architecture Lead | WP-0009 | TASK-0024 |
| ADR-0022 | Inference Locality and Provider Boundary | **PROPOSED** — awaiting the Architecture Lead | WP-0009 | TASK-0024 |

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
