# ADR-0018 — Approved Document Authority and Lifecycle

**Status:** **ACCEPTED** — promoted from `implementation/decisions/ADR-0018-approved-document-authority-and-lifecycle.md` (PROPOSED) by MSG-0071; **Q13 Release-1 temporal-scope clarification applied 2026-08-24 by MSG-0133**
**Date:** 2026-08-21
**Proposed by:** Claude Code — TASK-0024 (A-ADR), under MSG-0068a and MSG-0068b
**Accepted by:** Architecture Lead — MSG-0071; **Q13 clarification — MSG-0133**
**Work package:** WP-0009 — Employee Policy Assistant
**Surface:** WP-0009 §7, surface 2 (`REQUIRED`)
**Settles:** MSG-0056b **D3** (approval authority, audience and classification assignment),
MSG-0056a **D11** (historical questions out of scope for release 1), **MSG-0133 Q13** (Release 1 temporal scope)
**Gates it makes enforceable:** G1 — implementation task T-A, the first implementation task

## Context

If *approved* is not a precise, machine-checkable property of a **specific version of a specific
document**, then citation, abstention, supersession, and audit are all decoration. Every control in
ADR-0017 rests on this layer: a grounded answer is only as trustworthy as the definition of the corpus
it is grounded in.

T-A is the first implementation task in WP-0009 §6.3 and cannot start without this decision.

## Decision

### 1. Three distinct identities

| Identity | Meaning | Stability |
|---|---|---|
| **Document identity** | The policy as an ongoing organizational artifact | Stable for the life of the policy; never reused |
| **Document version identity** | One immutable issue of that document | Immutable once published; never edited in place |
| **Source-file identity** | The exact bytes ingested (content hash, filename, acquisition metadata) | Immutable; different bytes are a different source file |

**A citation names a document version, never a document.** Conflating these is the standard route by
which a document-grounded system produces a confidently wrong answer from superseded text.

### 2. Lifecycle, with answerability as an explicit property

```text
DRAFT ──► IN_REVIEW ──► APPROVED ──► PUBLISHED ──► SUPERSEDED
            │                            │              │
            └──► REJECTED                └──► WITHDRAWN ─┘
```

| State | Answerable | Retrievable | Indexed |
|---|---|---|---|
| DRAFT, IN_REVIEW, REJECTED | No | No | **No — never indexed at all** |
| APPROVED (not yet published/effective) | No | No | No |
| **PUBLISHED** | **Yes** | Yes | Yes |
| SUPERSEDED | **No** (release 1 — D11) | Yes, for audit and reconstruction | Retained, not answerable |
| WITHDRAWN | No | Yes, for audit only | Dropped from the projection |

**PUBLISHED is the only state a grounded answer may rest on.** Draft policy is not policy. Draft
content is never indexed rather than indexed-and-filtered: **a filter that fails open leaks; an index
that never held the content cannot.**

**Withdrawal is not deletion.** The projection drops it; the Knowledge Object and its audit history
remain (ADR-0013; SPEC-0006).

### 3. Approval authority — the separation-of-duties rule

Per MSG-0056b D3:

1. **Only users holding the required privilege may place a document into the governed policy-management
   flow.** Upload is a privileged action.
2. **Upload or creation does not itself confer authority.** An uploaded document is not a policy.
3. **Authorized personnel approve and publish, and assign audience and classification.**
4. **The creator or author MUST NOT be the sole approver of their own policy.** This is a structural
   separation-of-duties control, enforced by the approval record rather than by convention.
5. **Only approved and published versions are authoritative sources for employee answers.**

The **ApprovalRecord** therefore carries approver identity, approving role, approval time, the policy
version applied, **evidence that the approver is not the sole author**, and any multi-party approvals
required under SPEC-0022.

### 4. Effectivity is evaluated at answer time

A version carries `effective_from` and optionally `effective_to`, evaluated **at answer time against
the question's temporal frame**, which defaults to *now*. Two consequences, both of which otherwise
produce answers that are wrong while looking right:

- A version approved but not yet effective is **not** answerable.
- A version whose `effective_to` has passed with **no successor published** is a **policy gap** — an
  abstention (A4), never a licence to fall back to the expired text.

**Release 1 temporal scope is now explicitly bounded by MSG-0133 Q13:** the supported answer path uses
the **current/“now” temporal frame only**. Historical and future temporal frames are **out of scope for
Release 1**. If a request requires a temporal frame outside that supported “now” frame, the system
**MUST ABSTAIN** rather than answer from an incorrect, stale, or otherwise inapplicable interval.
Effective-date and supersession data remain captured so a later, separately authorized temporal capability
can be added without losing the underlying history.

### 5. Supersession is a relationship, not a flag

`supersedes` / `superseded_by` are typed relationships between version objects, traversable in both
directions and reconstructible for audit.

**Constraint:** at most one PUBLISHED version of a document may be effective at any instant. **Two
simultaneously effective versions is a data defect that must fail ingestion loudly** rather than be
resolved by ranking — silently preferring one is the "competing truths" outcome ADR-0013 forbids.

### 6. Ownership

Every document has an owning organizational role. **PCI is not authoritative over policy content; the
organization is. PCI is authoritative only over its own record of that content** (ADR-0013).

### 7. Release-1 boundary, and the data that must be captured anyway

Historical and temporal questions over superseded versions are **out of scope for release 1**
(MSG-0056a D11). **Effective-date and supersession data must nevertheless be captured from T-A
onward**: adding the capability later must not require a migration, and omitting the data now
guarantees one. Any future historical answer must be conspicuously labelled as historical.

**MSG-0133 further settles the Release-1 temporal boundary:** Release 1 supports only the current/“now”
temporal frame. Historical and future temporal frames are not required for Release 1. Requests requiring
a non-now temporal frame must fail closed by abstaining. Historical and future temporal support may be
considered later only as a separately authorized product/architecture capability.

### 8. Ingestion is downstream of approval, never a path around it

No content is indexed whose version record is not PUBLISHED and whose bytes do not match an approved
source file. Re-ingestion never mutates a published version in place: new bytes are a new version
requiring its own approval.

## Why a new ADR is required — the reuse-before-create test

| Candidate existing authority | Covers | Does not cover |
|---|---|---|
| **ADR-0013** (source ownership) | The organization is authoritative over policy content; provenance preserved; disconnecting a source does not destroy knowledge | The lifecycle states, answerability, effectivity-at-answer-time, or approval authority |
| **SPEC-0022** (human approval) | Approval as a governed, auditable action; approvers must be authorized; *multi-person approval **may** be required*; **an agent** cannot approve its own action | That a **human author** must not be the sole approver of their own policy. SPEC-0022's multi-person clause is discretionary and its self-approval rule is scoped to agents |
| **SPEC-0014** (ingestion) | The pipeline; "never silently overwrite authoritative data" | That draft content is never indexed; validation against an approval record |
| **SPEC-0015** | "Preserve document version history" | The state machine, the single-effective-version constraint, or answerability |
| **SPEC-0031** | Versioning and expiry named | The PUBLISHED-only rule |
| ADR-0001, ADR-0004 | Canonical identity; Git as the **engineering** source of truth | Organizational policy documents, which are runtime governed content, not repository artifacts |

**The gap is real and specific.** ADR-0013 and SPEC-0022 are reused unchanged and need no successor;
what neither supplies is a machine-checkable definition of *approved* for a policy version, and the
author ≠ sole approver rule that MSG-0056b D3 introduces. That rule currently exists only in a ruling
message, which is not an accepted architecture document.

## Rationale

The lifecycle is designed so the **security property is structural rather than procedural.** Draft
content is unindexed rather than filtered; approval is validated at ingestion rather than trusted;
effectivity is computed at answer time rather than stamped at index time; supersession is a traversable
relationship rather than a mutable flag. Each choice removes a way for a later implementation defect to
become a wrong policy answer.

Failing ingestion loudly on two simultaneously effective versions is deliberate. The tempting
alternative — rank them and answer from the better match — converts a governance defect the
organization must fix into an invisible behaviour the assistant has already normalized.

## Consequences

- **T-A cannot be completed without G1 evidence**: a version reaches PUBLISHED only through an approval
  by an authorized approver who is not the sole author; supersession chains traverse; effectivity is
  evaluated at answer time; no draft is ever retrievable; no two versions are simultaneously effective.
- The organization must be able to express "authorized approver" and "author" as distinct identities.
  Deployments where one person owns and approves every policy will **fail G1 by design**, and that is
  the control working, not a defect to configure away.
- Policy documents and versions are persisted as Knowledge Objects on the WP-0001 kernel, not in a
  private store — reusing persistence, typed relationships, provenance, and audit that WP-0001 already
  verified.
- Every lifecycle transition is audited under SPEC-0006.
- Release 1 answers only from currently effective versions, and users asking historical questions
  receive an abstention rather than a superseded answer.
- Release 1 supports only the current/“now” temporal frame; non-now temporal requests fail closed by
  abstention. Historical and future temporal support requires separate product/architecture
  authorization.

## Traceability

| Element | Accepted authority |
|---|---|
| Privileged upload; upload does not confer authority; author ≠ sole approver; only published versions authoritative | MSG-0056b **D3** |
| Historical questions out of scope for release 1; preserve the data | MSG-0056a **D11** |
| Release-1 current/“now” temporal scope; non-now requests abstain | **MSG-0133 Q13 ruling** |
| Organization authoritative over content; PCI over its record | **ADR-0013** (reused unchanged) |
| Approval as a governed, auditable, authorized action; multi-party approval | **SPEC-0022** (reused unchanged) |
| Ingestion never silently overwrites authoritative data | SPEC-0014 |
| Version history preserved | SPEC-0015 |
| Lifecycle transitions audited and reconstructible | SPEC-0006 |
| Separation of duties | `docs/security/rbac-abac-model.md` |
| Persistence, typed relationships, provenance, audit | WP-0001 (AC-03, AC-04, AC-06, verified) |

## Deliberately not decided here

- **Which organizational roles hold approval authority in a given deployment.** That is customer
  configuration; encoding one organization's governance into the platform is exactly what MSG-0056a
  warned against.
- **Whether a policy document may be classified Restricted, and its corpus consequences** — governed by
  **ADR-0020** under MSG-0062 §7.6.
- Retention of the documents themselves, as distinct from employee questions — **ADR-0021** covers
  question privacy only.
- Document formats accepted at ingestion. MSG-0056a D14 rules text-native only and scans rejected; that
  is an ingestion rule carried by WP-0009 gate G2, and this ADR does not restate it.
