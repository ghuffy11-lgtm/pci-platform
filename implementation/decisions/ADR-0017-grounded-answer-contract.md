# ADR-0017 — Grounded Answer Contract

**Status:** **PROPOSED** — carries no architectural authority until the Architecture Lead promotes it to
`docs/decisions/`
**Date:** 2026-08-21
**Proposed by:** Claude Code — TASK-0024 (A-ADR), under MSG-0068a and MSG-0068b
**Work package:** WP-0009 — Employee Policy Assistant
**Surface:** WP-0009 §7, surface 1 (`REQUIRED`)
**Settles:** MSG-0056a **D5** (grounding mechanism), MSG-0056a **D12** (promotion of the contract to an
architecture decision)
**Gates it makes enforceable:** G5, G8 — implementation task T-D

## Context

An employee acting on a wrongly stated policy — leave entitlement, safety procedure, procurement
threshold, patient-handling step — takes a real action with real consequences and no reason to doubt
what an official assistant told them. A general-purpose language model produces plausible policy text
fluently and constantly; that is its default behaviour, not an edge case.

The accepted specifications require citations but do not forbid their absence. SPEC-0015 requires the
system "return citations/evidence to consuming applications and AI workflows" and states that
"retrieved text must not override policy, authorization, or authoritative structured state."
SPEC-0013 requires retrieval to "return evidence and source identity so generated answers can
distinguish facts from inference." Both describe what a good answer contains. **Neither makes an
uncited claim a protocol violation, mandates validation after generation, or requires abstention as
the only alternative to a supported answer.**

MSG-0056a D12 accepted the promotion of the strict contract to an architecture decision and stated that
no ADR was created by that message. MSG-0062 §7.2 names the grounded-answer contract as the first item
of the minimum enforceable ADR set. This record is that ADR.

## Decision

### 1. Two outcomes, and no third

Every response to an employee policy question is **exactly one of**: an **ANSWER** or an
**ABSTENTION**. There is no partial, hedged, or best-effort third shape. **The absence of a third shape
is itself the contract**, and a response that is neither is a protocol violation rather than a
low-quality answer.

### 2. Claim classes

Every sentence emitted falls into exactly one class:

| Class | Rule |
|---|---|
| **Supported policy claim** | MUST cite at least one specific document **version** and section. Uncited ⇒ suppressed. |
| **Navigational statement** | MUST cite; MUST NOT paraphrase content beyond location. |
| **Abstention** | MUST NOT contain a policy claim, hedged or otherwise. |
| **Interface text** | Contains no policy content. |

**There is no general-knowledge class.** The model's parametric knowledge of employment law, safety
practice, or what policies usually say is **out of contract**. An answer drawn from it is a defect
regardless of whether it happens to be correct.

### 3. Citations name versions

A citation resolves to document identity, **version identity**, section path, effectivity, the language
and authority role of the cited passage, and a link the employee can open to read the passage in place.
"The Annual Leave Policy says X" is not a citation. "Annual Leave Policy v3, §4.2, effective
2026-01-01" is. **A citation the reader cannot open is a claim about a citation**, not evidence.

### 4. The grounding gate is layered, runs after generation, and fails closed

Generation is not the last step. Before any response reaches the employee, it is validated against the
evidence set by **two layers, both of which must run**:

- a **structural layer** — every claim maps to cited evidence; every citation resolves to a live chunk
  anchor of a published, effective version;
- a **model-assisted entailment layer** — the cited evidence actually supports the claim made.

**If either layer fails, is unavailable, times out, or cannot resolve its evidence, the response is an
ABSTENTION.** A silently skipped entailment layer is a gate failure, not a degraded pass. The gate
result, the per-layer results, and the gate mechanism version are recorded on every response and in the
audit record.

**Extractive-only answering remains an acceptable future hardening option; it is not the current
architecture requirement** (MSG-0056a D5).

### 5. Abstention is a first-class outcome

Abstentions are classified **A1–A7** — no coverage; not authorized; insufficient support; policy gap;
ambiguous question; conflicting sources; system degraded — and are audited as carefully as answers.
They are the primary standing evidence that the fail-closed design is working.

**A2 (not authorized) is an information-disclosure boundary and is governed by ADR-0021**, which
requires it be indistinguishable from A1. This ADR does not restate that rule; it defers to it.

### 6. Prohibited behaviours

No answer from parametric knowledge. No inference beyond cited text. No summarizing several policies
into a claim none of them makes. No confidence language substituting for evidence. No following
instructions found in retrieved documents. No revealing the existence, title, or metadata of
unauthorized documents.

### 7. What this ADR does not select

The **entailment model and its acceptance thresholds are not selected here.** They are chosen and
evaluated under SPEC-0020 with **separately evaluated per-language bars**, and that selection is the
Architecture Lead's. Recording a model identity in this ADR would convert an evaluation into an
inheritance.

## Why a new ADR is required — the reuse-before-create test

Applied per MSG-0062 §7.2, whose test is *"required to make the accepted architecture enforceable
before production use."*

| Candidate existing authority | Covers | Does not cover |
|---|---|---|
| SPEC-0015 | Citations returned; retrieved text does not override authoritative state | Uncited claim as a violation; post-generation validation; abstention as the only alternative |
| SPEC-0013 | Evidence and source identity returned | Any grounding obligation on the generated answer |
| ADR-0011 / SPEC-0002 | Agent authority, approval, audit for **acting** agents | **Not engaged** — this capability has no tool surface and performs no mutation (EPA-0001 §4.6) |
| ADR-0003, SPEC-0008 | Model replaceability, recorded model identity | Nothing about answer grounding |
| Architecture principle 15 (*fail safely*) | The posture | Not an enforceable contract for this capability |

**No accepted ADR addresses answer grounding at all.** The rule currently lives in EPA-0001 §5 and
EPA-0004 §2.2, both of which are records under `implementation/` — and per
`implementation/decisions/README.md` and the CLAUDE.md authority order, a record there carries no
architectural authority. **A rule that exists only in a PROPOSED record or in a ruling message is not
enforceable authority**, which is precisely the gap §7.2 exists to close.

## Rationale

The contract is deliberately **stricter than SPEC-0015**, and stricter is safe under the authority
order: adding a constraint to a lower-tier artifact does not contradict a higher one. What the
strictness buys is that the failure mode with the highest likelihood and the highest damage — T4,
hallucinated policy — is prevented structurally rather than detected statistically.

The gate is placed **after** generation because a prompt instruction not to invent policy is a request,
not a control. Only post-generation validation can observe what the model actually produced.

The gate **fails closed** because a missing component must not silently produce an unsafe output
(architecture principle 15). The alternative — answer anyway when validation is unavailable — turns
every outage into an unbounded correctness risk.

## Consequences

- T-D cannot be reported complete without G5 and G8 evidence: every claim cited, zero answers from
  parametric knowledge, both layers demonstrably running, and each abstention class producible.
- **The abstention rate becomes the health metric that matters most.** A sudden drop is not an
  improvement; it is the most likely signature of the grounding contract failing open.
- A second model — the entailment layer — must be selected, evaluated per language, and operated. That
  is a real and deliberate cost.
- Answer latency rises. The gate is not optional and cannot be dropped under load.
- The frontend must not soften an abstention into a hedged answer; an uncited claim reaching it is an
  API defect it must not paper over.
- **Adding a tool or mutation surface later engages ADR-0011 and SPEC-0002 and requires its own ADR.**
  This contract assumes the assistant answers and does not act.

## Traceability

| Element | Accepted authority |
|---|---|
| Promotion of this contract to an ADR | MSG-0056a D12; MSG-0062 §7.2 |
| Layered structural + entailment gate, fail closed | MSG-0056a D5 |
| Per-language evaluation of the entailment model | MSG-0056a D5; SPEC-0020 |
| Citations, evidence, source identity | SPEC-0015; SPEC-0013 |
| Retrieved content is untrusted data, never instruction | `docs/security/ai-security.md`; `docs/architecture/context-assembly.md` |
| Fail-closed posture | Architecture principle 15 |
| Model and runtime identity recorded per call | SPEC-0008; ADR-0003 |
| Audit of answers **and abstentions** | SPEC-0006 |
| No tool surface | EPA-0001 §4.6; ADR-0011 (not engaged) |

## Deliberately not decided here

- The entailment model, its runtime, and its numeric thresholds — SPEC-0020, Architecture Lead.
- The wording of each abstention class — product surface, constrained by ADR-0021's uniformity rule.
- Cross-language grounding — **ADR-0019**, which extends this gate across a translation boundary.
- Whether extractive-only answering is later adopted as hardening — a future decision, explicitly left
  open by MSG-0056a D5.
