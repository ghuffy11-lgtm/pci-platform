# ADR-0020 — Retrieval Projection and Index Boundary

**Status:** **ACCEPTED** — promoted from `implementation/decisions/ADR-0020-retrieval-projection-and-index-boundary.md` (PROPOSED) by MSG-0071
**MSG-0071 approves the no-retrieve-then-suppress confidentiality boundary and the fail-closed handling.**
**Date:** 2026-08-21
**Proposed by:** Claude Code — TASK-0024 (A-ADR), under MSG-0068a and MSG-0068b
**Accepted by:** Architecture Lead — MSG-0071
**Work package:** WP-0009 — Employee Policy Assistant
**Surface:** WP-0009 §7, surface 4 (`REQUIRED`)
**Settles:** MSG-0062 **§7.6** (Restricted documents; no retrieve-then-suppress), MSG-0056a **D2**
(retrieval strategy), MSG-0056a **D9** (service boundary)
**Gates it makes enforceable:** G3, G4, G6 — implementation tasks T-C and T-E

## Context

The retrieval layer is where a confidentiality failure becomes invisible. An authorization check that
runs *after* content has been fetched into a request has already lost: the content is in the process,
in memory, in a log line, or in a timing difference, whatever the response body eventually says.

MSG-0062 §7.6 closed the one D3 sub-question MSG-0056b did not reach — whether a policy document may
be Restricted — and attached a design constraint to the answer. That constraint is a **new
confidentiality decision no accepted ADR covers**, and it is the reason this surface needs a record of
its own.

## Decision

### 1. The index is a projection; the approved document version is the truth

The retrieval index holds **only** chunks of **published, effective, in-scope** document versions. It
is rebuildable from the kernel at any time, and:

- **a full rebuild must be a no-op with respect to answers.** If a rebuild changes what the system
  says, the index had drifted from the truth it projects, and that is a defect the gates must catch;
- **a stale index beyond threshold triggers abstention (A7), never a stale answer**;
- **the index is deliberately not in the backup path.** Losing it costs availability, never truth.

### 2. Chunks inherit authorization exactly, never weakly

A chunk's authorization constraints are **exactly** those of its document version. A chunk is **not** a
separate authorization subject — treating it as one is precisely how a restricted paragraph escapes a
restricted document. Chunks carry classification, audience, effectivity, and language inherited from
the version.

### 3. Authorization is enforced at four points, each independently sufficient to deny

1. **Query construction** — the candidate set is built **already constrained** to the authorized,
   in-scope, published, effective corpus. Unauthorized content is never a candidate.
2. **Post-retrieval re-check** — every hit is re-authorized against its version's classification and
   audience before entering evidence selection.
3. **Data layer** — organizational scope is enforced by RLS under **ADR-0016, reused unchanged**: FORCE
   RLS, a runtime role that is neither `SUPERUSER` nor `BYPASSRLS`, cross-scope reads returning **404,
   not 403**.
4. **Citation resolution** — opening a cited passage **re-authorizes**. A citation link is not a
   capability; if entitlements changed between the answer and the click, the click is denied.

**No single point may be the only thing preventing access.** A design in which three are decorative
fails G3 however correct its output looks.

### 4. No retrieve-then-suppress — the rule this ADR exists for

Per MSG-0062 §7.6:

> **A document the authenticated subject is not authorized for is NEVER retrieved into the request.**

Retrieving broadly and filtering afterwards is a **gate failure**, not a style preference — however
correct the resulting response happens to look. **An exclusion cannot fail open; a filter can.**

### 5. Denial fails closed, with the side channels named and closed

Unauthorized access must fail closed **without revealing existence, content, timing, or result-count**.
Three channels leak without ever returning a document, and each must be closed and demonstrated by
test:

- **existence disclosure** through differentiated abstentions — closed by the uniformity rule of
  **ADR-0021** (A1 and A2 indistinguishable);
- **timing and result-count** differences between "nothing exists" and "not authorized" —
  behaviourally observable even when the wording is identical;
- **audit and analytics surfaces** exposing question text or document titles across scope boundaries.

**Isolation is demonstrated by test, not argued** (SPEC-0010's acceptance criterion).

### 6. Restricted policy documents are eligible for the corpus — under a condition

Per MSG-0062 §7.6, Restricted documents **are eligible** for the governed corpus. They are never
retrieved unless the authenticated subject satisfies their authorization policy.

**This is consistent with the accepted classification standard, and the reason is worth stating
precisely because it is easy to misread.** `docs/security/data-classification.md` reads:

> "Restricted data must never be placed in prompts, logs, Git, or Knowledge Objects **unless
> specifically designed for that data class and protected accordingly**."

**The accepted rule is conditional, not absolute.** It carries an explicit carve-out, and MSG-0062 §7.6
is the ruling that this capability may use it. Three obligations follow, and they are the price of the
carve-out rather than optional hardening:

1. **Authorized subject only.** Restricted content enters model context only for a subject who
   satisfies its policy — never as a default, never "retrieved and then trimmed".
2. **Never in logs.** The classification standard's prohibition on Restricted data in **logs** carries
   no authorization exception. Restricted passages must not reach application logs, telemetry, or
   ordinary audit payloads. Audit records the *decision and the identifiers*, not the content.
3. **Local inference does not relax any of this.** The standard is explicit: *"A model being local does
   not make data automatically safe. Authorization, classification, minimization, and audit controls
   apply equally to local and remote model runtimes."* **ADR-0022** is not a substitute for this
   section.

> **A correction worth recording.** EPA-0001 §7.3 and EPA-0004 §11.6 both state the classification rule
> as an absolute — *"Restricted-class content must not enter model context at all"* — and EPA-0004 §11.6
> built an open decision on that reading. The accepted text has an exception clause those summaries
> omit. Reading it in full is what makes MSG-0062 §7.6 consistent with the accepted standard rather
> than in tension with it, so no stop condition arises here.

### 7. Retrieval strategy — the shape, not the technology

Per MSG-0056a D2, adopted provisionally: **hybrid lexical + semantic retrieval, multilingual local
embeddings, one projection index**, with **separate acceptance bars per language** under SPEC-0020.

**No index technology, embedding model, vector store, or search engine is selected here.** Indexing
technology must remain replaceable (SPEC-0013). Cross-language retrieval semantics are constrained by
**ADR-0019**.

### 8. Service boundary

Per MSG-0056a D9 and MSG-0062 §7.7, the assistant — including the retrieval index and the model runtime
— is a **separate service outside the PCI kernel**, consuming kernel contracts through its API. It
reuses the kernel's persistence, typed relationships, provenance, audit, and tenant boundary rather
than building private equivalents.

**ADR-0015 is NOT inherited as this service's implementation stack.** No replacement is selected here;
that is WP-0009 §6.2's **A-STACK**, which is a separate architecture task and is not authorized by this
ADR.

All persistent state remains under `/data/docker` (bootstrap contract v0.2, MSG-0006 — unchanged).

## Why a new ADR is required — the reuse-before-create test

**This is the most marginal of the six surfaces, and the argument against it deserves stating.**

| Candidate existing authority | Covers | Does not cover |
|---|---|---|
| **SPEC-0013** | "Projections, not alternate truths"; authorization enforced "before results enter application or AI context"; no "side-channel indication of sensitive contents"; indexing technology replaceable | **Timing and result-count** side channels; the four enforcement points; the rebuild-is-a-no-op property; stale ⇒ abstain |
| **ADR-0016** | Tenant isolation: three layers, FORCE RLS, non-`BYPASSRLS` runtime role, 404 over 403 | Document **classification and audience** authorization, which is a different axis from tenancy. **Reused unchanged; needs no successor** |
| **SPEC-0011** | Deny by default; policy enforced outside the model; decisions recorded | Retrieval-time placement of the check, or the no-retrieve-then-suppress rule |
| SPEC-0015 | "Enforce authorization and classification before retrieval" | The Restricted-eligibility ruling and its conditions |
| `data-classification.md` | The Restricted rule **and its carve-out** | Whether this capability may use the carve-out — that is MSG-0062 §7.6 |

**The case against a new ADR:** SPEC-0013 already says authorization is enforced before results enter
application or AI context, and SPEC-0015 says before retrieval. One could argue the rule is already
accepted authority.

**Why that argument fails.** SPEC-0013's phrasing — *"before results enter application or AI context"*
— permits a design that retrieves into the **application** and filters before the model. MSG-0062 §7.6
forbids exactly that: the document is never retrieved **into the request** at all. The specifications
are also silent on **timing and result-count**, which are the channels that leak when the wording is
already uniform. And a specification is a lower tier than an ADR in the CLAUDE.md authority order,
while §7.6 is a **new confidentiality decision** that currently exists only in a ruling message.
**A ruling message is not an accepted architecture document.**

## Rationale

Placing the check at query construction rather than after retrieval is the difference between a
property and a promise. The four points are defence in depth: the RBAC/ABAC model and ADR-0016 both
require authorization be re-checked before privileged execution, and a citation click is a second
request that has to earn its own authorization.

The index is a projection because P5 and SPEC-0013 both require it, and because it makes the truth
recoverable: an index defect costs availability and is repaired by a rebuild, whereas an index treated
as authoritative turns every projection bug into a wrong policy answer.

Restricted eligibility is a real trade. Excluding Restricted documents outright cannot fail open, which
is why EPA-0003 recommended it. The Architecture Lead ruled the other way, and the ruling pays for it
with the no-retrieve-then-suppress constraint — which is what turns "eligible" into something narrower
than "in the corpus like everything else".

## Consequences

- **T-E must implement authorization at all four points and demonstrate G3 and G6.** A design that
  passes on output inspection but retrieves broadly fails.
- **The adversarial suite must measure timing and result counts**, not merely compare response text. G6
  requires that no probe distinguishes A1 from A2 by wording, timing, or count.
- **T-D precedes T-E** (MSG-0062 §7.3), so a working answer path exists before retrieval-time
  authorization does. **MSG-0067 §1 bounds that exposure: T-D testing is authorized only against
  synthetic or otherwise non-confidential documents, and no real or confidential corpus may enter the
  T-D path until T-E is implemented and verified.** That constraint is a precondition of this ADR being
  safe to implement in the ruled order.
- Restricted policy content in the corpus obliges the deployment to meet the classification carve-out
  in full — including keeping Restricted passages out of logs and telemetry.
- The index is excluded from backup by design; recovery is a rebuild.
- **A-STACK remains unauthorized and unselected.** Nothing here permits an implementation session to
  pick a stack and call it inherited.

## Traceability

| Element | Accepted authority |
|---|---|
| Restricted eligible; **no retrieve-then-suppress**; fail closed with no existence/content/timing/result-count disclosure | MSG-0062 **§7.6** |
| Hybrid lexical + semantic; multilingual local embeddings; one index; per-language bars | MSG-0056a **D2**; SPEC-0020 |
| Separate service outside the kernel; ADR-0015 not inherited | MSG-0056a **D9**; MSG-0062 **§7.7** |
| T-D before T-E, with the synthetic-corpus interim limit | MSG-0062 §7.3; MSG-0067 **§1** |
| Tenant isolation, FORCE RLS, 404 over 403 | **ADR-0016** (reused unchanged) |
| Projections not alternate truths; no side-channel disclosure; replaceable indexing | SPEC-0013 |
| Deny by default; policy outside the model | SPEC-0011 |
| Authorization and classification before retrieval | SPEC-0015 |
| Restricted rule and its carve-out; local ≠ safe | `docs/security/data-classification.md` |
| Isolation demonstrated by test | SPEC-0010 |
| `/data/docker` boundary | Bootstrap contract v0.2; MSG-0006 |

## Deliberately not decided here

- **The index technology, embedding model, vector store, or search engine** — replaceability is
  required; selection is the Architecture Lead's under SPEC-0020.
- **The assistant service's implementation stack** — WP-0009 §6.2 **A-STACK**, not authorized.
- **The staleness threshold that triggers A7** — an operational parameter, tuned with real evidence.
- **The cross-language retrieval mechanism** — constrained by **ADR-0019**, selected under SPEC-0020.
- Whether any specific organizational policy document is in fact classified Restricted. That is
  customer configuration, not architecture.
