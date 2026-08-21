# TASK-0021 — Employee Policy Assistant Architecture Definition

**Status:** DEFINED — Architecture Lead authorized; not yet READY for execution queue
**Priority:** 1
**Owner:** Claude Code
**Depends on:** WP-0001 COMPLETE; MSG-0054
**Type:** Architecture/governance definition only — no product implementation

## Objective

Translate the new product objective into an architecture-ready specification for an employee-facing capability that answers questions only from approved organizational policies and procedures, supports English and Arabic, cites authoritative source documents/sections, and fails closed when authoritative support is absent or access is not permitted.

## Scope

Define, without implementing product behavior:

1. Approved-document authority, ownership, lifecycle, versioning, effective dates, supersession, withdrawal, and publication rules.
2. Document ingestion, normalization, metadata, chunking/indexing, re-ingestion, and provenance requirements.
3. Retrieval and grounded question-answering architecture, including citation/provenance, abstention, confidence/evidence requirements, and protection against unsupported claims and prompt injection from source documents.
4. English/Arabic question and answer behavior, including language detection, Arabic document handling, cross-language retrieval/answering, citation preservation, and language-specific acceptance criteria.
5. Authorization and confidentiality boundaries, including tenant/organizational scope, document-level permissions, retrieval-time enforcement, model/data-provider boundaries, and prevention of cross-scope leakage.
6. Auditability: document lifecycle, access/retrieval, questions/answers, citations, policy-version used, administrative actions, retention, and privacy/security constraints.
7. Employee-facing frontend responsibilities and UX constraints, without implementing the frontend.
8. Integration boundaries with the existing PCI kernel and existing `/data` / runtime security boundaries.
9. Required ADRs, threat/security decisions, data contracts, interfaces, and acceptance gates for the eventual work package.

## Required output

Produce one architecture-definition COMMS record and the repository documentation necessary to make the next work package unambiguous. The output must identify:

- what is inside and outside the new work package;
- architecture decisions required before implementation;
- security/privacy decisions required before implementation;
- authoritative data/provenance model;
- proposed component/data-flow boundaries;
- acceptance criteria and test gates;
- a dependency-ordered implementation task sequence;
- explicit stop conditions where a later Architecture Lead decision is still required.

## Acceptance criteria

1. The record explicitly establishes that this objective is **outside WP-0001** and requires a new post-WP-0001 work package.
2. No implementation code, production feature, Supervisor behavior, permission model, or product architecture is changed by this task.
3. Approved-document authority and lifecycle/version/supersession rules are defined at the architecture level.
4. The grounded-answer contract explicitly prevents unsupported company-policy claims and requires authoritative citations/provenance.
5. English and Arabic behavior is explicitly specified, including cross-language retrieval/answering boundaries.
6. Authorization/confidentiality controls are defined at retrieval time, not only at the frontend.
7. Audit and retention requirements are defined without exposing unnecessary sensitive content.
8. Security threats and required mitigations are identified, including prompt injection/data exfiltration through documents.
9. Integration with the existing PCI kernel, `/data` boundary, and existing security controls is explicitly bounded.
10. A dependency-ordered implementation sequence and acceptance gates are proposed for the new work package.
11. Any unresolved substantive architecture choices are recorded as explicit Architecture Lead decisions rather than guessed.

## Forbidden

- No product implementation.
- No schema migration.
- No ingestion/retrieval/LLM/frontend code.
- No credentials or external service registration.
- No Supervisor configuration, scheduling, or permission changes.
- No change to accepted WP-0001 architecture.
- No authorization of downstream implementation tasks.

## Stop conditions

Stop and record the exact issue if repository authority is insufficient to define a safe boundary, if an existing accepted ADR conflicts materially with the proposed architecture, or if a decision would require inventing product scope not supplied by the objective.
