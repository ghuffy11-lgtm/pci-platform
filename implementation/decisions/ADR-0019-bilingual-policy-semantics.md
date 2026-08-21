# ADR-0019 — Bilingual Policy Semantics (English / Arabic)

**Status:** **ACCEPTED** by MSG-0071 (2026-08-21) — **awaiting promotion** to `docs/decisions/`.
The decision is made; this copy carries no architectural authority until the promoted record exists.
**MSG-0071 accepts this as a bounded decision: the Arabic normalization rules remain deliberately incomplete and must be established from empirical corpus evidence before production use. No invented normalization rules are authorized.**
**Date:** 2026-08-21
**Proposed by:** Claude Code — TASK-0024 (A-ADR), under MSG-0068a and MSG-0068b
**Work package:** WP-0009 — Employee Policy Assistant
**Surface:** WP-0009 §7, surface 3 (`REQUIRED`)
**Settles:** MSG-0056b **D1** (bilingual policy authority), MSG-0058 **F1** (cross-language grounding),
MSG-0056a **D6** (Arabic normalization — *obligation recorded, rule set deferred; see §6*)
**Gates it makes enforceable:** G7, G2 — implementation tasks T-B and T-F

> **This ADR is not complete for production use, deliberately.** §6 records the D6 normalization
> obligation but does **not** fix the rule set, because MSG-0056a D6 requires it be determined
> empirically against the real corpus and no corpus survey has been performed. See §6 and *Deliberately
> not decided here*.

## Context

**This is the area with the least existing repository authority — and the gap was verified, not
assumed.** Searching every accepted ADR for *language*, *Arabic*, *bilingual*, *localization*, *i18n*
returns two hits, and neither is about human language: ADR-0006's "programming language" and ADR-0011's
"natural-language requests." Across the wider governance tree the only relevant line is SPEC-0016's
template localization for *notifications*.

**No accepted PCI document establishes bilingual policy semantics.** The organization supplied the
missing authority to the Architecture Lead, who ruled it in MSG-0056b D1 and MSG-0058 F1. Those rulings
are the substance of this ADR; recording them here is what makes them enforceable.

The failure mode this prevents is concrete: an Arabic-speaking employee acting on English policy that
nobody approved in Arabic, or on an Arabic rendering that quietly diverges from the governing text.

## Decision

### 1. English is the authoritative policy language

Arabic is an **approved translation and accessibility language**, never an independent authority.

**`authority_role` is a property of the document version, not of answer-path logic**, taking the values
`authoritative` (English) and `approved_translation` (Arabic). This makes the rule enforceable at the
data layer: **an Arabic version is never `authoritative`**, and that invariant is testable rather than
conventional.

### 2. Divergence is flagged, never silently resolved

Where the English and Arabic texts differ in meaning, **English governs and the discrepancy must be
surfaced**. A `TranslationLink` between the authoritative version and its approved translation carries
a **divergence status**. Silently selecting the Arabic wording — or silently preferring the English one
without saying so — is prohibited; the first is wrong, and the second hides a policy defect the
organization needs to see.

### 3. Employees may ask and be answered in either language; citations always resolve to English

The answer is composed in the employee's language. **Every citation resolves to the authoritative
English text**, displayed alongside the answer and never replaced by it.

**A citation whose `authority_role` is `approved_translation` may be displayed alongside, but MUST NOT
be returned as the sole support for a policy claim.** An approved translation is an accessibility aid;
citing it as the policy would make a translation authoritative by the back door.

### 4. Cross-language answering is permitted, and paid for with a fail-closed gate

Per MSG-0058 F1, **Arabic answers may be generated from authoritative English policy** — reversing
EPA-0003's recommended prohibition, which is the Architecture Lead's call to make — **provided the
grounding gate of ADR-0017 establishes support across the English-source / Arabic-answer boundary.**

**When the answer language differs from the authoritative source language:**

1. a cross-language grounding result **MUST be present and passing** on the response;
2. **absent or failed ⇒ ABSTENTION**;
3. **the system MUST NOT fall back to an English answer**, and MUST NOT present an unofficial rendering
   as policy.

> **This is the single most consequential rule in this ADR.** If the cross-language gate is ever
> implemented as *"fall back to English,"* the MSG-0058 F1 ruling has been **inverted rather than
> implemented**. The fallback is the intuitive engineering choice and it is precisely what is
> forbidden.

The cross-language gate is a **degraded path** in ADR-0017's terms: unavailable or failing means
abstain.

### 5. The Arabic acceptance bar is evaluated separately

Per MSG-0058 F1 and MSG-0056a D5, the Arabic acceptance bar is **evaluated separately under
SPEC-0020**, never inherited from the English bar and never aggregated with it.

**Every gate involving a question or a document runs twice, once per language, and both runs must
pass.** A single aggregate score lets Arabic performance hide behind English performance. Per-language
results are reported separately at completion.

### 6. Normalization — the obligation, with the rule set deliberately deferred

MSG-0056a D6 rules that normalization **must not be frozen now**, may be determined **empirically
against the real corpus**, and that **the final normalization rule must be recorded in an ADR before
production use.**

**Three constraints are fixed by this ADR and are not deferred:**

1. **Raw authoritative text is immutable.** Normalization never alters stored authoritative text; it
   produces an index projection alongside it.
2. **Ingestion-time and query-time normalization are identical.** A divergence between them is a
   correctness defect, not a tuning parameter — it silently changes which passages are findable.
3. **The rule set is versioned and recorded**, so a change to normalization is a reindex with a
   traceable cause rather than an unexplained shift in retrieval behaviour.

**The concrete Arabic rule set — alef and hamza forms, ta marbuta, tatweel, diacritics, Arabic-Indic
digits — is NOT decided here.** It requires the empirical corpus evidence that WP-0009 §6.2's
**A-SURVEY** exists to gather, and A-SURVEY has not been authorized or performed. **Inventing the rules
now would substitute this session's guess for the evidence the ruling explicitly requires.**

**Consequence, stated plainly: this ADR must be amended with the empirical rule set before production
use.** Until then D6 is partially discharged, and that is a known gap rather than an oversight.

## Why a new ADR is required — the reuse-before-create test

| Candidate existing authority | Covers | Does not cover |
|---|---|---|
| **All sixteen accepted ADRs** | — | **Nothing at all.** Verified by search: zero hits on human language authority |
| SPEC-0016 | Notification template localization | Policy authority, citation resolution, cross-language grounding |
| SPEC-0020 | Evaluation and model registry; the evaluation frame | The per-language bar, and any bilingual policy semantics |
| SPEC-0015, SPEC-0013 | Citations, evidence, retrieval | Which language is authoritative, or what happens across a translation boundary |
| ADR-0017 (proposed) | The grounding gate for same-language answers | The cross-language extension and its fail-closed rule |

**This is the clearest of the six cases.** The surface has **no** accepted authority whatsoever — it is
a genuine vacuum that the organization filled through MSG-0056b and MSG-0058, and a ruling message is
not an accepted architecture document.

## Rationale

Single-authority-plus-approved-translation (model M2 in EPA-0001 §6.1) is what the organization ruled,
and it has a property parallel authority does not: **there is always exactly one text that governs**,
so a divergence is a defect to surface rather than an ambiguity to arbitrate at answer time.

Requiring citations to resolve to English while answering in Arabic is what makes *"verify the
citation"* mean anything across a language boundary. The employee sees both what the assistant says and
what the policy actually says.

The fail-closed cross-language gate is the price of permitting cross-language generation at all.
Generating Arabic from English inserts a translation step between the source and the citation, and
**a translation error is citation forgery arriving through the front door** (threat T10). The gate is
the only control that stands between those two facts.

## Consequences

- **G7 becomes the hardest gate in the work package.** It tests *support across a translation boundary*
  — a materially harder claim than parity between two approved texts, and one with no accepted PCI
  specification behind it. SPEC-0020 supplies the evaluation frame but not the bar.
- Arabic-language capability becomes a **selection constraint** on the embedding and inference models,
  which must also run locally under ADR-0022. That constraint is real and narrows the field.
- **A cross-language rejection rate near zero must be treated as suspicious rather than excellent.** It
  most likely means the gate is not actually evaluating across the boundary.
- The frontend needs full RTL support with correctly embedded LTR citation fragments, and accessibility
  in both languages.
- **This ADR must be amended before production use** with the empirical normalization rule set (§6).
- Arabic PDF text extraction — a known-hard problem for ligatures — becomes a gate in its own right,
  bounded by MSG-0056a D14's rejection of scanned documents.

## Traceability

| Element | Accepted authority |
|---|---|
| English authoritative; Arabic an approved translation; English governs on divergence; discrepancy flagged; citations resolve to English | MSG-0056b **D1** |
| Cross-language generation in scope; gate must establish support across the boundary; **failed gate ⇒ abstain, never an English fallback**; Arabic bar separate | MSG-0058 **F1** |
| Normalization empirical; raw text immutable; ingestion/query projections identical; final rule recorded in an ADR before production | MSG-0056a **D6** |
| Per-language evaluation and acceptance bars | SPEC-0020; MSG-0056a D5 |
| The grounding gate this rule extends | **ADR-0017** (proposed) |
| Citation forgery as a threat (T10) | EPA-0001 §8; SPEC-0006 |
| Offline constraint on any language technology | ADR-0005; **ADR-0022** (proposed) |

## Deliberately not decided here

- **The Arabic normalization rule set** — deferred by MSG-0056a D6 to empirical corpus evidence (§6).
- **The embedding model, the inference model, and the cross-language gate mechanism** — SPEC-0020
  evaluation, and the Architecture Lead's selection.
- **The cross-language retrieval strategy** — multilingual embeddings, query translation, or
  per-language indexes is a retrieval decision carried by **ADR-0020** under MSG-0056a D2.
- Languages beyond English and Arabic. Nothing here presumes a third; adding one is a new decision.
