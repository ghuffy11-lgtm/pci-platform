# TASK-0022 — Employee Policy Assistant Work-Package Definition

**Status:** READY
**Owner:** Claude Code / Execution Agent
**Authorized by:** MSG-0059 / Architecture Lead
**Depends on:** TASK-0021 COMPLETE; MSG-0058 DECIDED

## Objective
Define the bounded post-WP-0001 work package for the Employee Policy Assistant. This task is architecture/work-package definition only. It does not authorize implementation, provider selection, runtime changes, or production deployment.

## Required outputs
1. A proposed work-package scope and boundaries covering approved-document management/versioning, ingestion, retrieval, grounded Q&A, English/Arabic support, permissions/confidentiality, auditability, superseded-policy handling, and employee frontend.
2. Explicit implementation gates and acceptance criteria derived from EPA-0001/EPA-0002/EPA-0003 and MSG-0056a/b/MSG-0058.
3. A dependency-ordered implementation task sequence, with security and architecture checkpoints.
4. Identification of any remaining genuine architecture decisions; do not invent decisions that are already settled.
5. A proposed work-package record and execution queue changes as recommendations only; do not mark implementation tasks READY.

## Binding decisions
- English is authoritative; Arabic is an approved translation/access language. Cross-language grounding is required and must fail closed.
- First release is authenticated; unauthenticated access is deferred.
- Enterprise directory integration terminates at OIDC/OAuth2; no direct LDAP/Kerberos authentication implementation.
- Approved/published documents only are authoritative.
- Session-only conversation retention is the default, with configurable retention support.

## Forbidden
- No product/runtime implementation.
- No provider/model selection.
- No changes to accepted ADRs.
- No new permissions, security boundaries, or Supervisor behavior.
- No credentials or external privileged operations.
- Do not mark any implementation task READY.

## Success gate
The work-package definition is complete only when its scope, boundaries, acceptance criteria, dependencies, security gates, and proposed implementation sequence are documented and reconciled with the governing architecture records. The Architecture Lead must review and accept the definition before any implementation task is authorized.

## Stop conditions
Stop and report through COMMS if repository authority materially conflicts, a required architecture decision is genuinely missing, or completion would require implementation or an unauthorized architecture change.
