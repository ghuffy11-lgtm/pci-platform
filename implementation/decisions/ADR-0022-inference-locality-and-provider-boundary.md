# ADR-0022 — Inference Locality and Provider Boundary

**Status:** **PROPOSED** — carries no architectural authority until the Architecture Lead promotes it to
`docs/decisions/`
**Date:** 2026-08-21
**Proposed by:** Claude Code — TASK-0024 (A-ADR), under MSG-0068a and MSG-0068b
**Work package:** WP-0009 — Employee Policy Assistant
**Surface:** WP-0009 §7, surface 6 (`REQUIRED`)
**Settles:** MSG-0056a **D8** (external model provider)
**Gates it makes enforceable:** G10 — implementation tasks T-D and T-I

## Context

Answering a policy question sends the organization's approved policy text — potentially Confidential,
potentially Restricted — to whatever runtime serves inference. Where that runtime executes is therefore
a **data-egress decision**, not a deployment convenience.

The accepted ADRs establish a strong preference for local operation but **stop short of a
prohibition**, and the difference is exactly what needs recording:

- **ADR-0005:** "Core platform operation must not require continuous Internet connectivity after
  installation. **Optional cloud services, update channels, and external integrations may exist**, but
  they must be explicit and replaceable."
- **ADR-0014:** "no **mandatory** dependency on a public cloud or remote AI service. Internet
  connectivity **may be used** for optional updates, integrations, or model acquisition when the
  customer permits it. … **Cloud-only** dependencies are prohibited in the core path."

Read together, the accepted position is: **external inference must never be required, and may be
optionally available.** MSG-0056a D8 rules something stricter for this capability — **prohibited by
default** — and that delta is not recorded anywhere in the accepted set.

## Decision

### 1. External inference is prohibited by default and for the initial implementation

Per MSG-0056a D8: **all inference and embedding computation for this capability executes locally on the
customer-controlled host.** No policy content, no employee question, and no derived embedding leaves
the host in the course of answering.

This is a **prohibition, not a preference**. It is stricter than ADR-0005 and ADR-0014, and stricter is
safe under the authority order — adding a constraint to a lower-tier artifact does not contradict a
higher one. **Neither ADR-0005 nor ADR-0014 is modified, contradicted, or superseded by this record.**

### 2. Egress is a gate failure, not a configuration state

Per WP-0009 gate **G10**: the capability must demonstrate full function with the host
**network-isolated**, and **any egress to an external model provider fails the gate.** The verification
is behavioural — a network-isolated run — not an inspection of configuration.

### 3. Any future exception requires four things, together

MSG-0056a D8 permits a future exception, and names its price. An external provider may be introduced
only with **all** of:

1. **a dedicated ADR** — not a configuration change, not a deployment note;
2. **an explicit deployment switch** — never a default, never implicit, never a fallback triggered by
   local unavailability;
3. **classification controls** determining which classes of content may egress at all;
4. **audit of egress** — what left, when, under which policy, for which subject.

**Absent any one of the four, the prohibition stands.** In particular, **a local runtime outage must
produce an abstention (A7), never a silent failover to an external provider.** A fallback of that shape
would convert an availability event into an undetected data-egress event, which is the specific outcome
this ADR exists to prevent.

### 4. The model remains replaceable, and its identity is recorded

Locality is **not** a model choice. ADR-0003 and SPEC-0008 continue to govern: inference is consumed
through the model-runtime abstraction, no model identity leaks into business logic, and **model and
runtime identity are recorded for every governed operation.**

**No model, runtime, embedding model, or serving technology is selected by this ADR.** Selection and
promotion proceed under SPEC-0020 with **per-language acceptance bars**, and are the Architecture
Lead's. ADR-0003 notes Ollama as a practical initial local runtime and is explicit that this is "an
implementation decision, not a platform identity" — this ADR does not elevate it.

### 5. Local execution does not relax any other control

Per `docs/security/data-classification.md`: *"A model being local does not make data automatically safe.
Authorization, classification, minimization, and audit controls apply equally to local and remote model
runtimes."*

**ADR-0022 is not a substitute for ADR-0020.** Authorization still precedes retrieval; Restricted
content still enters model context only for an authorized subject; the model still receives no
credentials, no authorization state, and no content the asker may not see.

### 6. Model artifacts are acquired as verified offline artifacts

Model acquisition is an **operator** action under SPEC-0026, performed as a verified offline artifact
rather than by a runtime download at answer time. Acquisition connectivity is permitted by ADR-0014;
**answer-time connectivity is not.** The two must not be conflated — they have different threat
profiles, and only the second is an egress of organizational content.

## Why a new ADR is required — the reuse-before-create test

| Candidate existing authority | Covers | Does not cover |
|---|---|---|
| **ADR-0005** | Core operation needs no Internet; optional cloud services **may exist**, explicit and replaceable | That external inference is **prohibited**. It is permitted-if-optional, which is weaker |
| **ADR-0014** | No **mandatory** cloud or remote AI dependency; **cloud-only** dependencies prohibited in the core path | An optional, customer-permitted external provider — which ADR-0014 expressly contemplates |
| **ADR-0003** | Models, runtimes, embeddings, providers are replaceable implementation components | **Where** inference executes, or whether an external provider is allowed |
| SPEC-0008 | Runtime abstraction; recorded model identity | Egress policy |
| SPEC-0026 | Offline deployment and air-gap | The default prohibition and the exception conditions |
| Constitution 1, 7 | Customer data ownership; offline-first | Not an enforceable per-capability rule |

**The delta is precise and consequential.** The accepted set says external inference must never be
*required*. D8 says it is *prohibited* — a different rule with a different failure mode. An engineer
reasoning correctly from ADR-0005 and ADR-0014 alone would conclude that adding an optional,
customer-permitted external provider is fully compliant. **It is not, for this capability**, and
nothing in the accepted set would tell them so.

The exception conditions matter as much as the prohibition. Without them recorded as accepted
authority, "we added a config flag and the customer permitted it" reads like conformance with
ADR-0005's "explicit and replaceable" language while bypassing every control D8 attaches.

## Rationale

Policy content is organizational data whose disclosure "could materially affect operations, customers,
employees, or security" — Confidential at minimum, sometimes Restricted. Sending it to a third-party
inference provider is a disclosure to that provider, whatever the contract says, and it happens on
every single question rather than once at integration time.

Local-only also removes a threat outright rather than mitigating it. **T8 — model substitution and
silent drift** — has no provider-swap surface when there is no provider. That is a stronger position
than monitoring for drift.

The four exception conditions are conjunctive because each defeats a different way the prohibition
erodes in practice: an undocumented decision (1), an implicit default (2), unclassified content leaving
(3), and an egress nobody can later reconstruct (4).

## Consequences

- **PR4 becomes a hard prerequisite**: a local inference runtime on the authorized host, with an
  **Arabic-capable** model evaluated per SPEC-0020. It is currently **NOT MET**, and it is an operator
  action.
- **PR6 — host capacity for embeddings plus inference — is currently UNKNOWN and unmeasured.** Local-only
  makes it a real constraint rather than an elastic one: capacity cannot be borrowed from a provider.
- **G10 must be demonstrated with the host network-isolated.** A configuration review is not evidence.
- Arabic capability must be met by a **locally runnable** model, which materially narrows the field —
  and interacts directly with **ADR-0019**'s per-language acceptance bar and cross-language gate.
- **ADR-0017's entailment layer is a second local model**, with its own capacity, latency, and
  evaluation cost. Local-only applies to it too.
- A local runtime outage degrades the capability to abstention (A7). That is the intended behaviour and
  must not be engineered around.
- Model updates are offline artifact operations by the operator, not runtime downloads.

## Traceability

| Element | Accepted authority |
|---|---|
| External inference prohibited by default and for the initial implementation; exception requires a dedicated ADR, explicit deployment switch, classification controls, and egress audit | MSG-0056a **D8** |
| Egress fails gate G10; network-isolated demonstration | WP-0009 §5 / EPA-0004 §3 G10 |
| Offline core operation; optional external services explicit and replaceable | **ADR-0005** (reused unchanged, not modified) |
| No mandatory cloud or remote AI dependency; offline artifact acquisition | **ADR-0014** (reused unchanged, not modified) |
| Model/runtime replaceability; no model identity in business logic | **ADR-0003**; SPEC-0008 |
| Model identity recorded per governed operation | SPEC-0008; SPEC-0006 |
| Evaluation before promotion, per-language bars | SPEC-0020 |
| Offline deployment and air-gap; verified artifacts | SPEC-0026 |
| Local models are not automatically safe | `docs/security/data-classification.md` |
| Customer data ownership; offline-first | Constitution 1, 7 |

## Deliberately not decided here

- **The inference runtime, the model, the embedding model, or the serving technology.** ADR-0003 names
  Ollama as a practical initial local runtime and explicitly denies it platform identity; this ADR does
  not select it or anything else.
- **Host capacity sizing** — PR6, unmeasured, an operator matter.
- **Whether any future external-provider exception is ever granted.** That is a future ADR, and this
  record fixes its price rather than its outcome.
- **Whether this prohibition binds PCI capabilities beyond the Employee Policy Assistant.** It is scoped
  to WP-0009 here. Extending it platform-wide would be a broader decision and is the Architecture
  Lead's to make.
