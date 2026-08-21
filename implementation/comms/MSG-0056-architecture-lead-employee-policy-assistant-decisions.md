# MSG-0056 — Architecture Lead Decisions: Employee Policy Assistant

**Status:** DECIDED — D1, D3, D7, and D13 resolved from organizational authority supplied to the Architecture Lead. No implementation authorized.
**Date:** 2026-08-21
**Authority:** Architecture Lead review of TASK-0021 / EPA-0003, with organizational decisions supplied by the Human Operator.

## Decisions

### D1 — Bilingual policy authority

**Ruling:** English is the authoritative policy language. Arabic is an approved translation/accessibility language, not an independent authority. If English and Arabic differ in meaning, English governs and the discrepancy must be flagged rather than silently selecting the Arabic wording. Employees may ask and receive answers in either language; Arabic answers may be generated from the authoritative English policy, but the cited policy authority remains English.

### D3 — Approval authority and audience/classification assignment

**Ruling:** Only users with the required privilege and authorization to upload/manage policy documents may place documents into the governed policy-management flow. Upload/creation does not itself make a document authoritative. Authorized personnel must approve/publish policies and assign audience/classification. The creator/author must not be the sole approver of their own policy. Only approved/published documents are authoritative sources for employee answers.

### D7 — Question-text retention and access

**Ruling:** Employee questions and answers are retained for the session by default. The platform shall support an administrator-configurable retention period, including session-only or a defined period such as one week, without requiring architectural redesign. Storage is minimized; abusive/meaningless queries must not create unnecessary indefinite retention. Security/audit records may have separate retention requirements. Access to retained conversation content is restricted to the employee who asked it; administrative/audit access is governed separately.

### D13 — Identity provider

**Ruling:** The architecture shall support configurable identity modes: Microsoft 365 / Microsoft Entra ID; existing Active Directory / enterprise identity integration; and optional unauthenticated access. Unauthenticated access is permitted only for information explicitly classified safe for unauthenticated disclosure. Authentication is required whenever access depends on identity, role, department, or permissions. Identity integration is a configurable deployment capability rather than a separate product architecture.

## Boundary

These rulings resolve the organizational choices requested for D1, D3, D7, and D13. They do not authorize implementation. Remaining EPA-0003 decisions must be resolved or explicitly delegated before the corresponding work-package gates are authorized.

## Implementation prohibition

No implementation task is READY or authorized by this message. The next Architecture Lead action is to reconcile these rulings with EPA-0003, MSG-0055, the COMMS register, and the execution queue, then determine whether the remaining architecture decisions are sufficiently resolved to authorize the next architecture/work-package task.
