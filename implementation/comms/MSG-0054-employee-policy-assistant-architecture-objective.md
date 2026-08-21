# MSG-0054 — Employee Policy Assistant Architecture Objective

**Status:** DECIDED — architecture-definition task authorized; no product implementation authorized
**From:** Architecture Lead
**To:** Claude Code
**Related:** MSG-0053, TASK-0021
**Raised:** 2026-08-21

## Architecture Lead ruling

The new employee policy-assistant objective is **outside WP-0001**. WP-0001 is complete and its accepted scope is the PCI kernel foundation. The new objective spans approved-document lifecycle/management, ingestion, retrieval, grounded question answering, English/Arabic behavior, authorization/confidentiality, auditability, supersession handling, and an employee-facing frontend. Those concerns require a separate post-WP-0001 work package.

No implementation work package is authorized yet. First, TASK-0021 is authorized as an **architecture-definition task only**.

## Required architecture decisions

TASK-0021 must establish the decisions needed before implementation, including:

1. **Authoritative document model:** ownership, approval state, version identity, effective dates, supersession/withdrawal, publication, provenance, and immutable source identity.
2. **Ingestion/retrieval:** supported document classes, normalization, chunk/provenance model, indexing, re-indexing, version consistency, and retrieval-time authority checks.
3. **Grounded QA:** evidence selection, citation format, abstention/fail-closed behavior, unsupported-claim prevention, answer/version traceability, and prompt-injection defenses for untrusted document content.
4. **English/Arabic:** language detection, bilingual retrieval, Arabic source handling, cross-language answering, citation fidelity, and explicit language acceptance gates.
5. **Security/confidentiality:** authorization at document/retrieval boundaries, tenant/organizational scope, prevention of cross-scope leakage, model/provider data boundaries, retention, and administrative access.
6. **Auditability:** auditable document lifecycle, retrieval/access, question/answer, cited evidence, policy version, administrative actions, and retention/privacy boundaries.
7. **Frontend:** employee-facing interaction, language selection, citations/source navigation, abstention/error presentation, and accessibility requirements.
8. **PCI integration boundary:** reuse/integration with the existing kernel and security controls without modifying WP-0001 architecture or weakening existing `/data` and fail-closed boundaries.
9. **Operational architecture:** deployment/data residency, model dependency boundaries, failure modes, observability, and recovery requirements.

## Proposed governed sequence

1. **TASK-0021 — architecture definition** (authorized by this message; no implementation).
2. Architecture Lead review of TASK-0021 output and approval/rejection of the proposed architecture.
3. Create/authorize the new post-WP-0001 work package only after the architecture boundary is accepted.
4. Derive implementation tasks from the accepted work package in dependency order: approved-document lifecycle → ingestion/provenance → retrieval/index → grounded QA/citations/abstention → authorization/confidentiality → bilingual behavior → auditability → employee frontend → end-to-end security/acceptance verification.
5. Only one implementation task should normally become READY at a time.

## Acceptance boundary for TASK-0021

The task succeeds only when the repository contains a decision-ready architecture specification covering the above domains, explicit acceptance/test gates, security threats and mitigations, dependency ordering, and explicit unresolved decisions. It must not create implementation code or authorize downstream implementation.

## Security boundary

The existing PCI kernel security model, `/data` boundary, Supervisor controls, and fail-closed governance remain unchanged. Claude must not register external model services, handle credentials, change permissions, modify Supervisor behavior, or implement product functionality under this authorization.

## Consequence

TASK-0021 is authorized as architecture-definition work. It is **not yet READY in the authoritative execution queue**; queue reconciliation is required before the Supervisor may execute it. No product implementation task is authorized by this message.
