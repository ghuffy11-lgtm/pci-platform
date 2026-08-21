# MSG-0062 — Architecture Lead Acceptance of EPA-0004

**Status:** DECIDED
**Authority:** Architecture Lead
**Related:** MSG-0061, MSG-0059, MSG-0058, EPA-0004

## Ruling

EPA-0004 is **ACCEPTED as the bounded work-package definition**, subject to the decisions below. This acceptance authorizes the work-package boundary and architecture governance path; it does **not** authorize implementation, provider selection, runtime changes, or permissions changes.

### 7.1 Work-package number

**Decision:** Allocate this assistant capability as a new work package rather than forcing it into the conflicting WP-0001/WP-0002 planning labels. The formal work-package identifier is to be allocated by the governing work-package register reconciliation before implementation authorization. No existing WP number is repurposed by this ruling.

### 7.2 ADR set

**Decision:** Create only the ADRs required to make the accepted architecture enforceable before production use: the grounded-answer contract and any new service boundary/security decisions that are not already covered by accepted ADRs. Do not duplicate or modify accepted ADRs. The exact ADR numbers are to be allocated using the repository numbering convention during the next architecture task.

### 7.3 T-D before T-E

**Decision:** **T-D (grounded QA) must precede T-E (retrieval-time authorization) in the implementation sequence.** Authorization controls must not be validated against an unproven answer path. Security review remains a gate on the complete path before release.

### 7.4 PR3 — identity provider

**Decision:** The first release requires an authenticated OIDC/OAuth2 identity provider. The platform shall integrate with the organization's selected provider; it shall not implement an identity provider. Provider selection and privileged deployment remain an operator/organization action and must be established before implementation reaches the identity-dependent gates.

### 7.5 PR5 — corpus survey

**Decision:** **Yes.** A bounded corpus survey is authorized before T-B. It is a discovery/architecture input only: inspect representative approved policy material to determine formats, language mix, scanned-document prevalence, classification/audience patterns, and version/supersession characteristics. It must not ingest production content or bypass approval controls.

### 7.6 — Restricted policy documents

**Decision:** Restricted documents are **eligible for the governed corpus**, but retrieval-time authorization must prevent unauthorized content from entering model context. A document marked Restricted is never retrieved into an employee request unless the authenticated subject satisfies its authorization policy. No retrieve-then-suppress design is permitted. Unauthorized access must fail closed without revealing document existence, content, timing, or result-count side channels.

### 7.7 — implementation stack

**Decision:** Do not inherit ADR-0015 as the service implementation stack. The new service remains outside the kernel boundary and must use the existing accepted platform contracts. A dedicated architecture task shall evaluate and propose the concrete stack against the repository's constraints before implementation. No provider, framework, model, embedding technology, or runtime is selected by this ruling.

## Gate

EPA-0004 is accepted. The next authorized action is to reconcile the accepted work-package definition and these rulings into the architecture/work-package governance records, allocate the formal work-package identity, and define the next architecture-gated tasks. **No implementation task is READY as a consequence of this message.**
