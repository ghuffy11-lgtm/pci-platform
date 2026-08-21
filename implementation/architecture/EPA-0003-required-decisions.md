# EPA-0003 — Employee Policy Assistant: Required Architecture-Lead Decisions

**Status:** **OPEN — fourteen decisions required**
**Produced by:** TASK-0021 (definition only) | **Authority:** MSG-0054
**Date:** 2026-08-21
**Companions:** [`EPA-0001`](EPA-0001-employee-policy-assistant-architecture.md) (architecture) · [`EPA-0002`](EPA-0002-proposed-work-package-and-gates.md) (proposed work package)

---

## Why this record exists

TASK-0021's stop condition names one failure mode above the others: *a decision that would require
inventing product scope the objective did not supply*. Its verification requirements close with
"unresolved substantive choices are **recorded as architecture-lead decisions rather than guessed**."

The objective supplied a clear and demanding capability. It did not — and reasonably could not —
supply answers to the fourteen questions below. Each is a point where a plausible-sounding assumption
would have produced a coherent architecture that was **wrong in a way later work could not easily
unpick**. Each therefore carries a recommendation and no decision.

**None of these is a request for permission to proceed with something already chosen.** Where a
recommendation is given it is reasoning offered to the lead, and the lead's ruling governs whatever
this document recommends.

**Priority ordering.** D1, D3 and D13 block the most downstream work. D5 and D7 are the ones most
likely to be expensive to change later. D2, D6 and D14 are technology decisions that can follow the
others but constrain hardware and offline operation.

---

## Decision index

| ID | Decision | Blocks | Priority |
|---|---|---|---|
| **D1** | Bilingual policy authority model | Everything in §6; citation semantics; index design | **Highest** |
| **D2** | Retrieval strategy and cross-language approach | Ingestion output; hardware sizing | High |
| **D3** | Approval authority and audience/classification assignment | Lifecycle; all authorization | **Highest** |
| **D4** | Abstention distinguishability (does "not authorized" look like "does not exist"?) | Answer contract; frontend | High |
| **D5** | Grounding-gate mechanism | The core safety control | **Highest** |
| **D6** | Arabic text normalization rules | Ingestion; retrieval parity | Medium |
| **D7** | Question-text retention and who may read the question log | Audit design; legal posture | High |
| **D8** | External model provider — permitted, ever? | Data egress; deployment | Medium |
| **D9** | Deployment shape: new service vs kernel extension | Repository layout; ops | Medium |
| **D10** | Single-shot answers vs multi-turn conversation | Answer contract; retention | Medium |
| **D11** | Historical/temporal questions over superseded versions | Retrieval scope; product surface | Medium |
| **D12** | Where the strict grounded-answer contract lives (ADR vs proposal) | Whether it binds future capabilities | Medium |
| **D13** | Identity provider — an unmet prerequisite, not a preference | Every authorization control | **Highest** |
| **D14** | Supported document classes, and whether OCR is in scope | Ingestion scope; feasibility for Arabic | High |

---

## D1 — Bilingual policy authority model

**Question.** When a policy exists in English and Arabic, which text is authoritative, and may a
translation ever be cited as policy?

**Why it cannot be inferred.** The repository contains **no accepted authority on bilingual
semantics whatsoever** — a search of `docs/` and the Constitution returns one line, SPEC-0016's
"support templates and localization", about notifications. The answer varies by organization and
frequently by document within one organization. It is a legal question before it is a technical one.

**Options.**

- **M1 — Parallel authority.** Both texts separately approved, equally authoritative. Divergence
  between them is a policy defect the system must detect and surface. Highest fidelity; requires the
  organization to actually approve both, and makes divergence detection a build requirement.
- **M2 — Single authority + reference translation.** One language governs per document; the other is
  a convenience rendering that may be displayed but never cited as the policy. Simpler; requires
  every citation to resolve to the governing text even for a reader in the other language.
- **M3 — Machine translation at answer time.** One text exists; the system renders it in the asker's
  language.

**Consequence of getting it wrong.** Under M3, an Arabic-speaking employee acts on Arabic text that
no one in the organization approved, produced by a model, presented as policy. By EPA-0001 §5.1 that
is an **unsupported policy claim** — the precise defect the whole architecture exists to prevent —
and it would be produced by the system's normal, intended operation rather than by a failure.

**Recommendation.** Support **M1 and M2 as a per-document property**, and **prohibit M3 for policy
claims**. A translation may be shown as an aid, clearly labelled, never as the cited text.

**Decision required:** which models are supported; whether M3 is prohibited outright.

---

## D2 — Retrieval strategy and cross-language approach

**Question.** How does an Arabic question retrieve English-authored policy, and vice versa?

**Why it cannot be inferred.** The approaches differ materially in accuracy, hardware cost, and — the
binding constraint — **offline availability**. ADR-0005 and Constitution principle 7 forbid a core
dependency on Internet connectivity, which removes cloud translation and cloud embedding APIs from
consideration as core components. That constraint genuinely narrows the field, and the remaining
options must be evaluated rather than assumed.

**Options.** Multilingual embedding model over a single index; query translation into the corpus
language before retrieval; per-language indexes with query fan-out; hybrid lexical (BM25-class) plus
semantic. These compose — the real decision is which combination is evaluated and against what bar.

**Recommendation.** **Hybrid lexical + semantic**, both languages in one index, using a locally
hosted multilingual embedding model, with the index treated strictly as a projection (EPA-0001 P5).
Lexical retrieval matters more than usual here: policy questions frequently name exact terms,
numbers, and document titles, and pure semantic retrieval handles those worse than keyword search.
Model selection runs through SPEC-0020 evaluation with **separate acceptance bars per language**, not
one aggregate score.

**Decision required:** the strategy, and confirmation that embedding-model selection follows SPEC-0020
evaluation with a recorded rollback path.

---

## D3 — Approval authority and audience/classification assignment

**Question.** Who may move a document version to APPROVED/PUBLISHED, who assigns its audience and
data classification, and how is that authority represented and reviewed?

**Why it cannot be inferred.** ADR-0013 requires authoritative ownership be explicit. The RBAC/ABAC
model requires separation of duties for high-risk operations. Both establish that the answer must
exist; neither supplies it, because it is the customer organization's governance structure. Guessing
it would embed one organization's approval hierarchy into the platform — the opposite of ADR-0013's
intent.

**What rests on it.** Everything. If "approved" is not precisely defined, EPA-0001 §3 has no
foundation, citation means nothing, and retrieval-time authorization has no attributes to evaluate. A
policy tagged with the wrong audience is a confidentiality incident, not a metadata error.

**Sub-questions the ruling must reach.**

1. May the document author approve their own document? (Separation of duties says no; small
   organizations often say yes.)
2. Is approval single or multi-party? SPEC-0022 supports both.
3. Who sets audience/classification — the author, the approver, or a separate data steward?
4. **May a policy document ever be classified Restricted?** `docs/security/data-classification.md`
   forbids Restricted content in prompts. If a Restricted document is the only source for a question,
   the assistant must abstain even for an authorized asker — which is defensible but must be
   *chosen*, not discovered in production.

**Recommendation.** Approval is a governed action under SPEC-0022, distinct from authorship, with the
approving role configurable per deployment and per document class. Audience and classification are
set at approval time and changing either is an audited administrative action (EPA-0001 §10.1).
Restricted-class policy documents are **excluded from the assistant's corpus entirely** rather than
retrieved and then suppressed — an exclusion cannot fail open.

**Decision required:** all four sub-questions.

---

## D4 — Abstention distinguishability

**Question.** May an employee tell "no approved policy covers this" (A1) from "a policy covers this
but you may not see it" (A2)?

**Why it cannot be inferred.** It is a direct trade between usefulness and information disclosure,
and the repository's accepted position points one way while practical helpfulness points the other.
SPEC-0013's acceptance criterion: an unauthorized user receives "neither the restricted object nor a
side-channel indication of its sensitive contents." ADR-0016 chose 404-over-403 for the same reason.
Against that: an employee who cannot distinguish the two cannot tell whether to ask their manager for
access or accept that no policy exists.

**Note the harder half.** Wording is the easy part. Making A1 and A2 genuinely indistinguishable also
requires closing **timing and result-count side channels** (EPA-0001 §7.4) — a system that takes
measurably longer to deny than to find nothing has disclosed the difference regardless of what it
says.

**Options.** (a) Fully uniform — indistinguishable, side channels closed. (b) Distinguishable, with
A2 naming no title or content, only that access exists elsewhere. (c) Classification-dependent —
uniform for Confidential and above, distinguishable for Internal.

**Recommendation.** **(c)**, as the honest reading of both concerns: most policy is Internal, where
"ask your manager for access" is useful and harmless; the disclosure control matters where
classification says it matters. If the lead prefers a single rule, **(a)** is the safe one.

**Decision required:** which option, and confirmation that timing/count side channels are in scope
for the acceptance gates.

---

## D5 — Grounding-gate mechanism

**Question.** How is "every policy claim is supported by cited evidence" (EPA-0001 §5.3) actually
verified before an answer reaches the employee?

**Why it cannot be inferred.** This is the single control that separates this capability from a
chatbot that cites things, and the mechanisms differ in cost, latency, false-positive rate, and — most
importantly — in **what they can be trusted to catch**.

**Options.**

- **(a) Structural only.** Require citation markers on every claim-bearing sentence; suppress
  uncited sentences. Cheap, deterministic, fully explainable. Catches *missing* citations; **does not
  catch a claim that cites a passage which does not support it** — the more dangerous failure.
- **(b) Model-assisted entailment.** A second inference pass checks each claim against its cited
  evidence. Catches unsupported-but-cited claims. Costs a second inference per answer, and uses a
  model to police a model — which needs its own evaluation evidence under SPEC-0020.
- **(c) Both, layered.** Structural first (cheap, deterministic), entailment second on what survives.
- **(d) Constrained generation** — extractive answers only, quoting rather than composing. Nearly
  eliminates the failure; produces answers many employees will find unhelpfully rigid, especially
  across a language boundary where quoting the source language may not answer the question at all.

**Recommendation.** **(c)**, with the structural layer non-optional and the entailment layer's model
selected and evaluated under SPEC-0020 with a per-language bar. **(d) deserves serious consideration
for a first release**: it is the only option whose safety does not depend on a model's judgment, and
"rigid but never wrong" is a defensible starting posture for a policy assistant that can be relaxed
later on evidence.

**Fixed regardless of the ruling:** the gate runs before the employee sees anything, and it **fails
closed** — if it cannot complete, the response is an abstention.

**Decision required:** the mechanism, and the acceptance bar it must clear.

---

## D6 — Arabic text normalization rules

**Question.** What normalization is applied to Arabic text at ingestion and query time?

**Why it cannot be inferred.** Arabic normalization choices are lossy and directly determine
retrieval recall. Alef forms (`أ إ آ ا`), ta marbuta vs ha (`ة / ه`), ya vs alef maqsura (`ي / ى`),
tatweel, diacritics, and Arabic-Indic vs Latin digits each involve a recall-versus-precision trade.
Over-normalizing merges genuinely distinct terms; under-normalizing means an employee's spelling
silently fails to match the policy's.

**The part that is not a preference:** normalization must be applied **identically at ingestion and at
query time**, and it must **never alter the stored authoritative text** — only the projection. A
citation must return the document's real characters, not the normalized form.

**Recommendation.** Unicode NFC on stored text; a normalized *index* form applying alef unification,
tatweel and diacritic stripping, ta marbuta folding, and digit unification; both the raw and
normalized forms retained in the index so exact-match queries remain possible. Validate against real
customer documents before fixing the rules — this is an empirical decision, not a theoretical one.

**Decision required:** approval of the normalization set, or a direction to determine it empirically
during the work package with the outcome recorded in an ADR.

---

## D7 — Question-text retention and access to the question log

**Question.** Is the employee's question text retained; for how long; and who may read it?

**Why it cannot be inferred.** SPEC-0006 requires a reviewer be able to reconstruct a governed
operation, and reconstruction needs the question. But employee policy questions are frequently the
most sensitive data in the system — grievance, harassment, medical leave, termination, whistleblowing.
"What is the process for reporting my manager" is a question whose *existence*, attributed to a named
employee, is harmful regardless of the answer. In several jurisdictions retention here is a works-council
or labour-law matter, not an engineering preference.

**Options.** (a) Full retention under classification-aware policy. (b) Retain the answer, citations,
authorization decision and correlation id, but **not** the question text — reconstruction becomes
partial. (c) Pseudonymize: retain question text unlinked from identity, and identity-linked metadata
without question text; reconstruction requires a governed join. (d) Configurable per deployment with a
conservative default.

**Recommendation.** **(d) with (c) as the default**, and access to identity-linked question text
governed as a separate, audited, multi-party administrative action. The platform must be configurable
rather than opinionated here, because the correct answer is jurisdictional.

**Decision required:** the default, the configurability boundary, and who may read the log.

---

## D8 — External model provider

**Question.** May any deployment ever route inference to an external provider?

**Why it cannot be inferred.** Constitution principle 1 (customer data ownership) and ADR-0005
(offline-first) make local inference the default and forbid a *mandatory* external dependency. Neither
forbids an *optional*, explicitly chosen one — ADR-0005 says optional external services "may exist,
but they must be explicit and replaceable." Whether that latitude extends to sending policy text
outside the customer boundary is the lead's call, not an inference from the text.

**Recommendation.** **Prohibit by default.** If ever permitted, require a dedicated ADR, per-classification
rules (never Restricted, never Confidential without explicit opt-in), per-request audit of the egress,
and a deployment-level switch that is off unless deliberately enabled.

**Decision required:** prohibited outright, or permitted under a future ADR.

---

## D9 — Deployment shape

**Question.** Is this a new service alongside the kernel, or an extension of the kernel service?

**Why it cannot be inferred.** `docs/architecture/platform-kernel.md` places "a particular AI model"
and "a particular vector database" **explicitly outside** the kernel and requires kernel contracts to
change slowly under architecture review. That argues strongly for separation. But repository layout,
process boundaries, and operational footprint are decisions with real cost on a single customer host,
and ADR-0015's zero-framework kernel posture does not automatically extend to a document-processing
service (ADR-0015 is scoped to the kernel by its own text).

**Recommendation.** A **separate service** consuming the kernel through its API, so that the index,
the embedding model, and the inference runtime stay outside kernel contracts and can be replaced
without architecture review. All persistent state under `/data/docker`, unchanged.

**Decision required:** the boundary, and whether ADR-0015's stack applies to the new service or the
runtime choice is open (ADR-0015 explicitly does not constrain "ingestion, document processing,
connectors, or UI", so this is a genuine choice rather than a settled one).

---

## D10 — Single-shot vs multi-turn

**Question.** Is each question independent, or does the assistant hold conversation?

**Why it cannot be inferred.** The objective describes answering questions; it does not describe a
conversation. Multi-turn is what employees expect and materially improves clarification (EPA-0001
§5.4 A5). It also introduces a specific hazard: **evidence retrieved for turn 1 can appear to ground a
claim in turn 3 that it does not actually support**, which is the grounding contract failing in a way
single-shot cannot produce. Conversation history is also itself sensitive under D7/T7.

**Recommendation.** **Single-shot for the first release**, with one bounded exception: clarifying
questions (A5) may carry forward the original question text, but **evidence is re-retrieved and
re-authorized from scratch on every turn** and never inherited.

**Decision required:** which, and if multi-turn, whether evidence may ever be carried across turns
(recommended: never).

---

## D11 — Historical and temporal questions

**Question.** May an employee ask what policy applied at a past date, retrieving a SUPERSEDED version?

**Why it cannot be inferred.** The objective says "approved organizational policy", which naturally
reads as *current* policy. But "what was the leave policy when I took leave in March" is a legitimate
and common employee question, and the data model supports it — EPA-0001 §3.3/§3.4 already carry
effective dating and supersession chains for audit purposes.

**Recommendation.** **Out of scope for the first release**, with the data model retaining full
capability so it can be added without migration. If added: superseded answers must be **conspicuously
labelled** with their effective window and the fact that they are not current — an unlabelled
historical answer is worse than no answer, because it is correct-looking and actionably wrong.

**Decision required:** in or out for the first release.

---

## D12 — Where the strict grounded-answer contract lives

**Question.** EPA-0001 §5 is **stricter** than SPEC-0015. Should it become an accepted ADR binding
future PCI capabilities, or remain scoped to this one?

**Why it matters.** Stricter-than-accepted is safe under the authority hierarchy — adding a constraint
is not contradicting a higher artifact. But if the lead intends "no uncited policy claim, ever" to
govern *every* future PCI answering capability (helpdesk, network, biomedical), it belongs in
`docs/decisions/` as an accepted ADR rather than in a proposal under `implementation/`. Left where it
is, a future capability may reasonably not know it exists.

**Recommendation.** Promote it to an ADR — provisionally **ADR-0017, "Grounded Answer Contract"** —
because the reasoning is not specific to policy documents. Any PCI capability that answers from
retrieved content faces the same failure mode.

**Decision required:** promote, or keep scoped to this capability.

---

## D13 — Identity provider: an unmet prerequisite

**Question.** Which OIDC identity provider serves employee authentication, and when is it deployed?

**Why this is not a preference.** ADR-0007 and SPEC-0004 require a standards-based external IdP and
forbid PCI implementing authentication. **No identity provider is deployed today** — WP-0001's
non-scope reads "Production identity provider integration beyond an adapter boundary", and DISC-0003
records the development identity adapter as exactly that: a development boundary. Every authorization
control in EPA-0001 §7 assumes an authenticated employee with roles, groups, and organizational scope.

**Without an IdP, the four-point enforcement model has no subject to evaluate.** This is a
prerequisite, not a design choice, and it is on the critical path for the entire work package
(EPA-0002 §4).

**Recommendation.** Select and deploy the IdP **before** the work package's authorization stage
begins, not alongside it. Selection is an operator and architecture decision — the platform must not
be built against a specific provider's behaviour beyond the OIDC standard (ADR-0007: "identity becomes
replaceable").

**Decision required:** which provider, and whether its deployment is a precondition of the work
package or its first task.

---

## D14 — Supported document classes and OCR

**Question.** Which document formats are ingested, and is OCR of scanned documents in scope?

**Why it cannot be inferred.** The objective says "approved organizational policy" without saying what
form those documents take, and the answer changes the work substantially. Real organizational policy
frequently exists as **scanned PDFs**, and **Arabic OCR is materially harder than Latin-script OCR** —
ligatures, diacritics, and RTL layout all degrade accuracy. An OCR error in a policy passage produces a
citation to text the document does not contain, which is EPA-0001 T10 (citation forgery) arriving
through the front door rather than an attack.

**Options.** (a) Text-native only — PDF with a text layer, DOCX, Markdown, HTML; reject scans with a
clear message. (b) Text-native plus OCR, with OCR'd content marked lower-confidence and subject to a
stricter grounding bar. (c) Full OCR including Arabic, treated as equivalent.

**Recommendation.** **(a) for the first release.** Rejecting a scan with "this document needs a text
version before it can be used" is honest, cheap, and safe; silently OCR-ing Arabic and citing the
result is neither. Revisit with evidence once the corpus is known — and note this decision should be
made against the **actual customer document set**, which is not visible from the repository.

**Decision required:** which option, and whether the real corpus can be surveyed before deciding.

---

## Proposed new ADRs

Numbers are **proposals** — allocation is the lead's, and this record does not create them. Listed so
the ADR surface is visible before implementation rather than discovered during it.

| Proposed | Title | Settles |
|---|---|---|
| ADR-0017 | Grounded Answer Contract | D5, D12 |
| ADR-0018 | Approved Document Authority and Lifecycle | D3, D11 |
| ADR-0019 | Bilingual Policy Semantics (English/Arabic) | D1, D2, D6 |
| ADR-0020 | Retrieval Projection and Index Boundary | D2, D9 |
| ADR-0021 | Employee Question Privacy and Retention | D7, D4 |
| ADR-0022 | Inference Locality and Provider Boundary | D8 |

Two existing accepted ADRs are **reused unchanged** and need no successor: **ADR-0016** (tenant
isolation — three layers, FORCE RLS, 404 over 403) and **ADR-0007** (identity), the latter subject to
D13's deployment prerequisite rather than to any change in the decision itself.

---

## What is blocked until these are answered

**All of it.** EPA-0002 proposes a work package; MSG-0053 C7 and MSG-0054 are both explicit that no
work package is authorized. Beyond that formal position, the substantive dependencies are real:

- **D1, D3, D13** block essentially everything — without them there is no defined notion of an
  approved document, an authorized subject, or an authoritative language.
- **D5** blocks the answer path, which is the capability itself.
- **D2, D6, D14** block ingestion and index design, and constrain hardware sizing.
- **D4, D7, D10, D11, D12** shape surfaces and contracts but do not block the foundation, and could be
  answered after the work package starts if the lead prefers to sequence them that way.

A definition task can go no further than this. The next move is the architecture lead's.
