# TASK-0022 — Employee Policy Assistant: Work-Package Definition

**Status:** READY
**Authorization:** Architecture Lead, MSG-0059
**Scope:** architecture/work-package definition only; no implementation

## Objective
Define the bounded first implementation work package for the employee-facing policy assistant, using the accepted EPA architecture decisions and MSG-0058 findings.

## Dependencies
- TASK-0021 COMPLETE — architecture definition accepted.
- EPA-0003 decisions D1–D14 resolved.
- MSG-0058 F1–F4 resolved.

## Required outcomes
Produce the implementation-ready work-package specification, including:
1. approved-document lifecycle, versioning and supersession;
2. ingestion, normalization, provenance and retrieval contracts;
3. grounded English/Arabic answering and citation/abstention gates;
4. retrieval-time authorization and confidentiality;
5. session-only/default retention with configurable retention policy;
6. authenticated identity integration through OIDC/OAuth2; unauthenticated access remains deferred;
7. auditability and security boundaries;
8. employee-facing frontend contract;
9. test/acceptance gates and threat-model coverage;
10. ordered implementation tasks with explicit architecture and operator boundaries.

## Forbidden
- No product/runtime implementation.
- No provider selection or external model registration.
- No credentials or privileged operations.
- No changes to accepted ADRs, Supervisor behavior, scheduling, permissions, or security boundaries.
- No downstream implementation task may be marked READY by this task.

## Success gate
A complete, reviewable work-package definition is committed with explicit acceptance criteria, dependencies, security boundaries, implementation sequence, and unresolved decisions. The Architecture Lead must review and accept it before any implementation task is authorized.
