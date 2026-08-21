# ADR-0021 — Employee Question Privacy and Retention

**Status:** **ACCEPTED** by MSG-0071 (2026-08-21) — **awaiting promotion** to `docs/decisions/`.
The decision is made; this copy carries no architectural authority until the promoted record exists.
**Date:** 2026-08-21
**Proposed by:** Claude Code — TASK-0024 (A-ADR), under MSG-0068a and MSG-0068b
**Work package:** WP-0009 — Employee Policy Assistant
**Surface:** WP-0009 §7, surface 5 (`REQUIRED`)
**Settles:** MSG-0056b **D7** (question retention and access), MSG-0056a **D4** (abstention
uniformity)
**Gates it makes enforceable:** G13, G6 — implementation task T-G

## Context

**The employee's question may be the most sensitive thing in the system** — more sensitive than any
document it retrieves. "What are my options if my manager is harassing me", "how much notice do I get
if I'm terminated", "what does the policy say about disclosing a medical condition": each reveals the
asker's situation, not merely their curiosity. In some jurisdictions the retention and readability of
such a log is a works-council or data-protection matter rather than an engineering preference.

SPEC-0006 requires audit retention be "policy-driven and configurable per deployment" and requires a
reviewer be able to reconstruct a governed operation. **That requirement and the privacy requirement
pull in opposite directions**, and no accepted document resolves the tension for this capability.

MSG-0056a escalated D7 explicitly on the ground that it is a jurisdictional and privacy decision the
repository does not contain the authority to settle. The organization supplied that authority and the
Architecture Lead ruled it in MSG-0056b D7.

## Decision

### 1. Session-scope retention by default

Employee questions and answers are **retained for the session by default**. The platform supports an
**administrator-configurable retention period** — session-only, or a defined period such as one week —
**without architectural redesign**. Configuration is a deployment decision; the *capability* to
configure it is an architectural requirement.

### 2. Retained conversation content is readable only by the employee who asked it

**This is the load-bearing rule.** Access to retained conversation content is restricted to the
employee who asked. It is not readable by other employees, by their manager, or **by an ordinary
administrator** through any interface — including admin surfaces, analytics, reporting, and support
tooling.

Administrative and audit access to security records is **governed separately** (§4) and is not a
back door into conversation content.

### 3. Storage is minimized, and expiry actually deletes

Storage is minimized. **Abusive or meaningless queries must not create unnecessary indefinite
retention.** When a retention window expires, the content is **deleted** — an expiry that only hides a
record from a default view has not been honoured.

### 4. Security and audit records are a separate class with separate retention

Audit evidence under SPEC-0006 — actor identity, authorization decision, cited version and chunk
identifiers, model and runtime identity, grounding-gate result, abstention class, correlation
identifiers — is governed by its own retention policy and is not deleted by conversation expiry.

**The separation is what makes both requirements satisfiable at once.** The audit record proves what
the system did; the conversation record holds what the employee said. A reviewer can reconstruct an
answer's authorization and grounding chain from audit evidence **without** reading the question text.

Two constraints hold regardless of configuration, both from accepted authority:

- **No secrets in audit records** (ADR-0009, SPEC-0006).
- **No unnecessary sensitive content**, and no Restricted passage content in logs or telemetry
  (`docs/security/data-classification.md`; **ADR-0020** §6).

### 5. Abstention is uniform — the disclosure boundary

Per MSG-0056a D4, **"not authorized" (A2) and "no approved policy covers this" (A1) are
indistinguishable**, including **timing and result-count side-channel controls**.

This is recorded here, alongside retention, because both are the same property: **what the system
reveals about an employee, or to an employee, beyond the answer itself.**

"There is a confidential policy about redundancy that you may not read" is itself a disclosure. The
accepted authority is unambiguous — SPEC-0013 requires an unauthorized user receive "neither the
restricted object nor a side-channel indication of its sensitive contents", and ADR-0016 chose 404 over
403 for exactly this reason.

**The cost is real and is accepted deliberately:** an employee cannot tell "nothing exists" from "not
for you", and will occasionally be told nothing is available when something is. That cost was weighed
and ruled by the Architecture Lead.

### 6. Question content is classification-aware

Audit of questions is classification-aware (SPEC-0006, `data-classification.md`). Where a question or
its answer touches Restricted content, the retention and access rules of **ADR-0020** §6 apply to it as
well.

## Why a new ADR is required — the reuse-before-create test

| Candidate existing authority | Covers | Does not cover |
|---|---|---|
| **SPEC-0006** | Retention "policy-driven and configurable per deployment"; no secrets; reconstruction requirement | **Who may read** a retained question; the session default; the audit/conversation split; that expiry deletes |
| **ADR-0009** | Secrets never in logs, prompts, Knowledge Objects, or model context | Employee questions, which are **not secrets** — they are personal data, a different class the ADR does not reach |
| **SPEC-0021** | Agent memory has provenance, owner, classification, lifecycle; "reviewed, corrected, expired, and deleted"; context bounded by policy | Scoped to **agent memory**, not employee conversation records; says nothing about read access being restricted to the data subject |
| **SPEC-0011** | Deny by default; authorization decisions recorded | No rule that an administrator is denied access to conversation content |
| **ADR-0016** | Tenant isolation; 404 over 403 | Intra-tenant privacy between an employee and their own administrator |
| `data-classification.md` | Retention and deletion must be classification-aware | The employee-question sensitivity problem specifically |

**The gap is sharp and unusual.** Accepted authority consistently makes administrators *more* able to
see records, not less. **D7 restricts an ordinary administrator's read access to a class of content**,
which is a genuine confidentiality boundary that no accepted ADR or specification establishes. A rule
of that kind — one that will surprise an implementer who reasons from the rest of the platform — must
be recorded as accepted architecture or it will be implemented away as an oversight.

## Rationale

The session default is the minimizing choice: it satisfies the immediate product need (a coherent
single-shot exchange with bounded clarification) while retaining nothing by default. Anything longer is
an explicit administrative act with a stated purpose.

Splitting audit evidence from conversation content is what dissolves the apparent conflict between
SPEC-0006's reconstruction requirement and D7's privacy requirement. The two records answer different
questions and therefore need not have the same retention or the same readers.

Uniform abstention belongs in the same decision as retention because they are one property viewed from
two sides — the system must not leak an employee's situation outward, and must not leak the corpus's
contents inward. Splitting them across two ADRs would let one be implemented without the other.

## Consequences

- **G13 cannot be satisfied by tests alone.** "Unreadable by any identity other than the asker" is a
  **negative claim across every interface**, including admin, analytics, reporting, and support
  surfaces. It requires a review of the surfaces as well as tests against them, and T-G must budget for
  that.
- **G6 requires timing and result-count measurement**, not response-text comparison. Two responses can
  be textually identical and still distinguishable.
- Support and troubleshooting workflows must be designed against this boundary from the start. An
  administrator debugging a complaint **cannot** simply read the employee's question, and discovering
  that late means rebuilding the support surface.
- Analytics over questions must be designed to avoid re-identification — aggregate reporting that
  reveals an individual's question through a small cohort defeats the rule without violating its
  letter.
- Employees will sometimes be told nothing is available when something is (§5). That is the accepted
  cost of the uniformity rule and must not be "fixed" by a helpful hint.
- Expiry must be demonstrated to **delete**, which is a testable claim about storage, not about views.

## Traceability

| Element | Accepted authority |
|---|---|
| Session default; administrator-configurable window; storage minimized; abusive queries create no indefinite retention; **access restricted to the employee who asked**; admin/audit access governed separately | MSG-0056b **D7** |
| Uniform abstention including timing and result-count controls | MSG-0056a **D4** |
| Retention policy-driven and configurable; reconstruction without model memory or application logs | SPEC-0006 |
| No secrets in audit records | ADR-0009; SPEC-0006 |
| Retention and deletion classification-aware; no unnecessary sensitive content | `docs/security/data-classification.md` |
| No side-channel indication of restricted contents | SPEC-0013 |
| 404 over 403 as an information-disclosure control | ADR-0016 (reused unchanged) |
| Sensitive question logging as threat T7 | EPA-0001 §8 |
| Restricted content handling in logs and context | **ADR-0020** (proposed) |

## Deliberately not decided here

- **The default retention window's numeric value** beyond "session", and the permitted configuration
  range — deployment configuration, and in some jurisdictions a legal question.
- **The lawful basis, jurisdiction-specific obligations, or works-council process** for retaining
  employee questions. These are organizational and legal determinations. The architecture is
  configurable rather than opinionated precisely so the organization can meet them.
- **Whether an authorized investigator may ever access conversation content under a governed
  exception**, and through what approval path. MSG-0056b D7 says administrative and audit access is
  "governed separately" and does not define that path. **No exception path is created by this ADR**, and
  building one without a ruling would reopen the boundary D7 drew.
- The wording of each abstention class — product surface, constrained by §5's uniformity requirement.
