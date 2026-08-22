# EPA-0005 — Employee Policy Assistant: Service Stack Evaluation (A-STACK)

**Status:** **PROPOSED — not authorized, and it selects nothing.**
This record carries no architectural authority. Per `implementation/architecture/README.md`, records in
this directory are proposals awaiting a ruling.
**Date:** 2026-08-22
**Produced by:** Claude Code — TASK-0026, architecture task **A-STACK**
**Authority:** MSG-0076 (AUTHORIZED) · WP-0009 §6.2 · MSG-0062 **§7.7**
**Work package:** WP-0009 — Employee Policy Assistant
**Companion outcome:** **A-SURVEY did not run** — its corpus prerequisite (PR5) is unmet. See §8 and
MSG-0078. Several gaps below are open *because* of that, and say so individually.

---

## 0. What this record is, and what it is forbidden to be

MSG-0076 authorizes A-STACK to *"evaluate candidate service-stack approaches against the accepted
platform contracts and EPA ADR set"* and to produce *"an evidence-based recommendation or explicitly
record why selection remains open."* It states, in the same breath: **"Do not select or authorize a
provider, framework, model, embedding technology, or runtime."**

**Those two sentences are compatible, and the distinction between them is the whole discipline of this
record.** Naming candidates is how an evaluation acquires content — a comparison with no named
alternatives is an essay. Concluding *"therefore we will use X"* is the thing forbidden. **Every
technology named below is a candidate inside an evaluation, never a choice**, and §9 states plainly
which selections remain open and what evidence would close each one.

**This record does not modify any accepted ADR.** ADR-0017 … ADR-0022 are read as binding input.

---

## 1. The finding that comes before any technology: "the stack" is not one decision

**The most common way this task goes wrong is answering it as a single question** — *"what do we build
the assistant in?"* — and producing one runtime, one framework, one database.

EPA-0001 §4.1 decomposes the capability into eight components, and they do not share a technology
problem:

| Component | The actual engineering problem | Governed by |
|---|---|---|
| **C1** Document Authority | Lifecycle, versions, approval records — **a governed domain layer over the kernel's Knowledge Object API** | ADR-0018 |
| **C2** Ingestion Pipeline | Text and structure extraction from real document formats, language detection, normalization, chunking | ADR-0019, ADR-0018 §8 |
| **C3** Retrieval Index | Hybrid lexical + semantic search **with authorization expressed inside the query** | **ADR-0020** |
| **C4** Authorization | Deny-by-default decisions, consulted **before** retrieval | ADR-0020 §3, SPEC-0011 |
| **C5** Grounded QA | Evidence selection, context assembly, generation, **post-generation validation**, abstention | **ADR-0017** |
| **C6** Model Runtime Adapter | Normalized local inference behind SPEC-0008 | **ADR-0022**, SPEC-0008 |
| **C7** Audit Sink | Evidence records — a kernel capability | SPEC-0006, ADR-0021 §4 |
| **C8** Employee Frontend | Bilingual RTL/LTR presentation that **enforces nothing** | ADR-0019, EPA-0001 §9 |

C1, C4 (in part), and C7 rest on capabilities **WP-0001 already delivered and verified**. C3 and C6 are
named in `docs/architecture/platform-kernel.md` as explicitly *outside* the kernel (EPA-0001 §4.1).

**Consequence for A-STACK: the real fork is not "which runtime" but "how many," and where the seam
falls.** §5 treats that as the primary trade. Answering "which framework" first presumes the seam,
which is the error.

---

## 2. What "ADR-0015 is not inherited" does and does not mean

MSG-0062 §7.7 and ADR-0020 §8 both state it: **ADR-0015 is NOT inherited as this service's
implementation stack.** ADR-0015 itself agrees in its own text — *"The runtime choice applies to the
platform kernel only. It does not constrain the future AI runtime, model serving, ingestion, document
processing, connectors, or UI."*

**Two misreadings are both available, and both are wrong:**

| Misreading | Why it fails |
|---|---|
| *"The kernel stack is the house style; adopt TypeScript/Node and move on."* | This is precisely what §7.7 forbids — adopting by default and calling it inheritance. The kernel's evidence is evidence **about the kernel**, gathered against a different problem |
| *"Not inherited means disqualified; the assistant must use something else."* | Nothing says this. **Re-selecting the same runtime on its own fresh evidence is a legitimate outcome.** Rejecting it *because* the kernel uses it would be as unevidenced as adopting it for that reason |

**The operative rule: the assistant's runtime must be argued from the assistant's requirements.** The
kernel's 229 passing tests are a fact about the kernel foundation, not a transferable credential for a
document-extraction pipeline or an embedding workload.

---

## 3. What the accepted set already determines — the eliminations that need no corpus

**These follow from accepted ADRs alone. They are the firmest output of this task**, because unlike the
sizing and quality questions in §8 they do not wait on the corpus.

### 3.1 Hosted inference, hosted embeddings, and hosted vector search are eliminated outright

**ADR-0022 §1** — *"all inference and embedding computation for this capability executes locally on the
customer-controlled host. No policy content, no employee question, and no derived embedding leaves the
host."* **ADR-0022 §2** makes egress a **gate failure (G10)**, demonstrated by a network-isolated run
rather than by configuration review.

This removes an entire class of otherwise-mainstream candidates: managed model APIs, hosted embedding
services, and **managed vector databases** — the last because embeddings are derived from policy
content and **ADR-0022 §1 names derived embeddings explicitly**.

**This is the single largest narrowing in the evaluation, and it is not negotiable at stack level.**
ADR-0022 §3 prices any future exception at four conjunctive conditions — a dedicated ADR, an explicit
deployment switch, classification controls, and egress audit — and none of them is A-STACK's to grant.

**A trap worth naming**: ADR-0022 §3 forbids a fallback *triggered by local unavailability*. A stack
that configures a remote provider as a resilience tier has **inverted** the ADR, not implemented it. A
local runtime outage must produce abstention **A7**.

### 3.2 Direct LDAP/Kerberos is eliminated; identity is an integration, never an implementation

**ADR-0007**, confirmed unchanged by MSG-0058 F3: integration terminates at the **OIDC/OAuth2**
boundary. The stack therefore needs a standards-conformant OIDC **relying-party** capability and
nothing more. PCI implements no authentication and stores no passwords (EPA-0001 §4.2 step 1).

**This is a small requirement and a mature one** — conformant RP libraries exist for every serious
server runtime, so it discriminates weakly between candidates. Recorded because its *absence* would be
a real disqualifier, and because "we'll bind to AD directly, it's simpler" is the tempting shortcut
ADR-0007 forecloses.

**T-0 remains an operator prerequisite and is untouched by this record** (WP-0009 §6.1). No provider is
named here.

### 3.3 The index engine must support authorization **inside** the query — this eliminates post-filter-only search

**This is the sharpest technical finding in A-STACK, and it is a functional requirement on the engine
rather than a preference.**

**ADR-0020 §3.1** requires the candidate set be built *"**already constrained** to the authorized,
in-scope, published, effective corpus. Unauthorized content is never a candidate."* **ADR-0020 §4**
makes retrieve-then-filter a **gate failure**: *"A document the authenticated subject is not authorized
for is NEVER retrieved into the request."*

**Read those as an engine selection criterion and they disqualify a real and popular class of
candidate:** a similarity index that supports only *post-hoc* filtering of a top-k result set. With
post-filtering, the engine retrieves unauthorized chunks and the application discards them — which is
the prohibited shape **executed one layer lower**, where it is harder to see and where it still lands
in process memory, and potentially in an engine query log.

The usual mitigation — over-fetch top-k and filter down — is worse rather than better: it makes the
volume of unauthorized content retrieved **larger**, and it introduces a correctness bug ADR-0020 §1
would catch only indirectly, because a heavily filtered result set silently returns fewer results than
the corpus contains.

**Therefore the engine must be able to express classification, audience, scope, lifecycle state and
effectivity as constraints evaluated *within* the retrieval operation** — not as a wrapper around it.
Engines offering true pre-filtered or filtered-search semantics satisfy this; engines offering only
post-filter do not.

> **The boundary this finding respects:** it is a **capability requirement**, and it selects no engine.
> Several candidate classes meet it — a relational engine with full-text and vector support, a search
> engine with filtered kNN, or a purpose-built vector store with genuine pre-filtering. **Which one is
> not decided here** (§9), and ADR-0020 §7 and SPEC-0013 both require the choice remain replaceable.

**Corollary — the index sits behind a port.** SPEC-0013: *"Keep indexing technology replaceable."*
ADR-0020 §7: *"No index technology, embedding model, vector store, or search engine is selected here."*
The retrieval capability is consumed through an interface, exactly as the kernel isolates PostgreSQL
behind adapters/ports (ADR-0015 rationale). This also means a **provisional** engine choice is cheap to
revise once corpus evidence exists — which matters, because §8 shows the evidence does not exist yet.

### 3.4 The index holds no truth, and is excluded from backup

**ADR-0020 §1**: the index is a projection; a full rebuild **must be a no-op with respect to answers**;
a stale index beyond threshold triggers **abstention A7**, never a stale answer; and *"the index is
deliberately not in the backup path."*

Two stack consequences: the engine must support **full rebuild from the kernel** as a routine
operation, not an exceptional recovery path; and index storage is **excluded from SPEC-0025 backup**,
so its durability guarantees are an availability concern only. An engine whose reindex is a
multi-hour, hand-operated procedure is a poor fit for a design that treats rebuild as ordinary.

### 3.5 Three local models are required, not one

Easy to under-count, and it multiplies the **PR6** capacity question:

| # | Model | Required by | Constraint |
|---|---|---|---|
| 1 | **Generation** | ADR-0022 §1 | Local; Arabic-capable (ADR-0019 §5) |
| 2 | **Embedding** | ADR-0020 §7 — *"multilingual local embeddings"* | Local; multilingual |
| 3 | **Entailment** (the grounding gate's model-assisted layer) | **ADR-0017 §4** | Local — ADR-0022 §consequences: *"ADR-0017's entailment layer is a second local model … Local-only applies to it too"* |

**All three must clear a per-language acceptance bar evaluated separately under SPEC-0020** (ADR-0019
§5: *"never inherited from the English bar and never aggregated with it"*).

**Consequence:** host capacity (PR6) is a function of three concurrent model workloads plus indexing,
and PR6 is **UNKNOWN and unmeasured** (WP-0009 §8, ADR-0022 consequences). **A-STACK cannot close it**,
and sizing it against an assumed corpus would be the same fabrication A-SURVEY refused (§8).

### 3.6 The grounding gate is an architectural stage, never a prompt instruction

**ADR-0017 §4**: validation runs **after** generation, in two layers, both of which must run; failure,
unavailability, or timeout ⇒ **ABSTENTION**. Its rationale is explicit: *"a prompt instruction not to
invent policy is a request, not a control."*

**Stack consequence:** the answer path is a **pipeline with a mandatory post-generation stage that can
veto the response**, plus a second inference call in the critical path. This constrains the service's
concurrency and timeout design — the gate *cannot be dropped under load* (ADR-0017 consequences) — and
it rules out any framework arrangement in which "generate" is the terminal step returning to the
caller. **A streaming-to-the-user-as-generated design is incompatible** with a gate that may veto the
whole response, and that is a genuine product-visible constraint worth surfacing early rather than
discovering at T-D.

### 3.7 Conversation storage and audit storage are two stores with different retention and different readers

**ADR-0021 §4** separates them deliberately, and §2 restricts retained conversation content to **the
employee who asked** — *"not readable … by an ordinary administrator … including admin surfaces,
analytics, reporting, and support tooling."* **§3** requires expiry to **actually delete**.

**Stack consequences:** conversation content needs a store with **enforceable per-subject read
restriction and real deletion on expiry**; audit evidence follows SPEC-0006 retention and is not
deleted by conversation expiry. A single "log everything to one place" design — the default in most
observability stacks — **violates ADR-0021 §2 and §4 simultaneously**, and the violation is invisible
in the response body. Any telemetry or analytics component in the stack inherits this restriction
(ADR-0021 consequences: G13 is *"a negative claim across every interface"*).

**Restricted passage content must not reach application logs or telemetry at all** — ADR-0020 §6.2,
which carries **no authorization exception**. That is a constraint on the logging stack, not only on
application code.

---

## 4. Where the accepted set leaves genuine freedom

Stated so the evaluation is not mistaken for a set of foregone conclusions. Nothing accepted determines:
the service's implementation **language or runtime**; the **HTTP/API framework**, if any; the
**extraction toolchain**; the **specific index engine**; the **specific local serving runtime**; the
**frontend framework**; or the **orchestration/packaging** shape beyond containerization and the
`/data/docker` boundary (bootstrap contract v0.2, MSG-0006).

`docs/architecture/technology-selection-principles.md` governs all of them: standards support,
security, maturity, interoperability, operational simplicity, performance, licence compatibility, and
**replaceability**; *"no single AI model, vector store, graph database, container platform, cloud
provider, UI framework, or monitoring backend should become an accidental architectural requirement"*;
and **operational fit** — *"a technically superior component that cannot be reliably operated by the
target customer is not automatically the correct PCI component."*

---

## 5. The primary trade: one runtime or two

**This is the decision the other technology questions hang from**, and it is the one A-STACK can
usefully frame even without a corpus.

The capability contains two workloads with genuinely different centres of gravity:

- **A governed application layer** (C1, C4, C5 orchestration, the API) — transactional, contract-bound,
  audit-heavy, security-critical. The repository has **directly verified evidence** about this class of
  work: WP-0001 delivered it in TypeScript/Node with a minimal dependency surface and proved tenant
  isolation live (229 tests, FORCE RLS, non-`BYPASSRLS` runtime role).
- **A document-and-model pipeline** (C2 extraction and normalization, C6 serving, the embedding path) —
  where the mature open-source toolchain for PDF/DOCX structure extraction, Arabic text handling, and
  local model serving is **predominantly Python-centric**, and where a runtime with a thin ecosystem
  imports a real integration cost.

| Approach | For | Against | Notes against the principles |
|---|---|---|---|
| **A. Single runtime, application-centric** (one service, extraction and serving reached through subprocesses or local HTTP) | One deployment artifact, one dependency surface, one security review; reuses verified kernel patterns; simplest to operate | Extraction and embedding tooling is thinner or wrapped; risk of reimplementing document processing badly | Strong on **operational simplicity**; weaker on **maturity** for C2 |
| **B. Single runtime, pipeline-centric** (one service in the document/ML ecosystem) | Best-in-class extraction and serving libraries directly available | Re-solves the governed-application problem WP-0001 already solved, in a stack with no verified precedent **here**; ADR-0016 RLS discipline must be re-established | Strong on **maturity** for C2/C6; weakest on carried-over **security evidence** |
| **C. Two services along the C2/C6 seam** — governed application layer + a document/inference worker, communicating over a contract | Each workload uses the ecosystem it fits; the seam is already an architectural boundary (C6 is a SPEC-0008 adapter; C3 is outside the kernel); the worker handles **no authorization decisions**, so the security-critical surface stays in one place | Two runtimes to build, operate, patch, and secure; a contract to version; more moving parts on a single customer host | Strong on **maturity** and **replaceability**; costs **operational simplicity** — which principle 4 warns is not a free trade |

**Two observations that bear on the choice, both derived from accepted records rather than preference:**

1. **The seam in approach C already exists in the accepted architecture.** SPEC-0008 requires inference
   be consumed through a normalized abstraction, and ADR-0022 §4 requires model and runtime identity be
   recorded per call while *"no model identity leaks into business logic."* **C6 is a port by accepted
   design.** Approach C extends an existing boundary rather than inventing one; approaches A and B put
   a different implementation behind the same port. This makes the trade less dramatic than it looks —
   **and it means the serving decision can be deferred without blocking the others.**
2. **Approach B carries a cost the other two do not: it discards verified security evidence.**
   ADR-0020 §3.3 reuses ADR-0016 unchanged — FORCE RLS, a runtime role that is neither `SUPERUSER` nor
   `BYPASSRLS`, 404-over-403. WP-0001 proved that arrangement live against a real database. A new
   runtime for the governed layer must re-establish it from scratch. That is not disqualifying, but it
   is a real, nameable cost that a stack proposal should not leave implicit.

**No approach is selected.** §9 records what would decide it.

---

## 6. Layer-by-layer: candidate classes and the constraints that bind them

Candidate **classes**, with the binding constraint named. Concrete products are named only where
naming them makes the class legible, and never as a choice.

| Layer | Candidate classes | Binding constraints | Status |
|---|---|---|---|
| **Application runtime** | Application-centric runtime (e.g. the TypeScript/Node line WP-0001 verified); document/ML-centric runtime; polyglot split | §2 (argue from requirements, inherit nothing); ADR-0016 reuse; ADR-0017 §4 pipeline shape | **OPEN** — §5 |
| **API surface** | Minimal HTTP over standard library; a thin framework | ADR-0015's zero-framework posture applies to the **kernel only**; principle: replaceability | **OPEN** — low architectural weight |
| **Document extraction (C2)** | Native-format parsers (PDF/DOCX text + structure); layout-aware extractors; **OCR is out of scope** | **MSG-0056a D14 — text-native only; scans rejected** (ADR-0018 *Deliberately not decided*, WP-0009 G2). Must yield **stable, resolvable section anchors** (ADR-0018 §1, EPA-0001 §4.4) and **per-section** language detection (EPA-0001 §4.3) | **OPEN and corpus-blocked** — §8 |
| **Arabic text handling** | Unicode NFC + a versioned normalization projection | **ADR-0019 §6** — three constraints fixed (raw text immutable; ingestion and query normalization **identical**; rule set **versioned**); **the rule set itself is deferred to empirical evidence and MUST NOT be invented** | **DEFERRED BY ACCEPTED DECISION** — see §7 |
| **Retrieval index (C3)** | Relational engine with full-text + vector; search engine with filtered kNN; vector store with true pre-filtering | **§3.3 — pre-filtered query semantics are mandatory**; ADR-0020 §1 rebuildable, excluded from backup; SPEC-0013 replaceable; hybrid lexical + semantic (ADR-0020 §7) | **OPEN, but with a hard capability filter now available** |
| **Model serving (C6)** | Local serving runtime behind the SPEC-0008 adapter | **ADR-0022 — local only, no egress, no failover**; SPEC-0008 *"Ollama may be used as an initial local runtime … an implementation choice, not a platform dependency"*; **ADR-0022 explicitly declines to elevate it** | **OPEN — and deliberately not narrowed here** |
| **Models (×3)** | — | **ADR-0022 §4 and ADR-0017 §7 both forbid selection here**; SPEC-0020 evaluation with per-language bars; the Architecture Lead's | **NOT A-STACK's TO TOUCH** |
| **Identity (C4 input)** | Standards-conformant OIDC relying party | ADR-0007; SPEC-0004; **no LDAP/Kerberos** (§3.2) | **OPEN — weakly discriminating; T-0 is the operator's** |
| **Conversation + audit storage** | Two stores, separate retention | **ADR-0021 §2/§3/§4** — per-subject read restriction, expiry deletes, audit separate; ADR-0020 §6.2 — no Restricted content in logs | **OPEN — with a hard shape requirement (§3.7)** |
| **Frontend (C8)** | Any framework with mature **RTL** support and embedded-LTR citation rendering | ADR-0019 consequences; EPA-0001 §9 — **enforces nothing**, must not soften an abstention | **OPEN — low architectural weight, real accessibility weight** |
| **Packaging** | Containers on the customer-controlled host | `/data/docker` (bootstrap v0.2, MSG-0006); **SPEC-0026 offline/air-gap**; ADR-0022 §6 — models are **verified offline artifacts**, never runtime downloads | **CONSTRAINED, not open in shape** |

> **On the serving runtime specifically.** SPEC-0008 and ADR-0003 both name Ollama as a *possible*
> initial local runtime, and **ADR-0022 is explicit that it "does not select it or anything else."**
> This record repeats the citation and takes the same position. Recording a runtime identity here would
> convert an accepted non-decision into a de facto selection through a PROPOSED document — exactly the
> move ADR-0017 §7 warns against when it says naming a model *"would convert an evaluation into an
> inheritance."*

---

## 7. Arabic normalization — not evaluated, by accepted decision

**ADR-0019 §6** fixes three constraints and **defers the rule set** — alef and hamza forms, ta marbuta,
tatweel, diacritics, Arabic-Indic digits — to empirical corpus evidence, stating: *"Inventing the rules
now would substitute this session's guess for the evidence the ruling explicitly requires."* MSG-0071
accepted the ADR **on that condition**, and MSG-0076 repeats it as a task constraint.

**A-STACK therefore proposes no normalization rule, and no library on the basis of one.** The three
fixed constraints are stack-relevant and are recorded in §6 as requirements: raw text immutable,
**ingestion-time and query-time normalization identical** — which in stack terms means *one
implementation used by both paths, not two that agree today* — and a **versioned** rule set so a change
is a traceable reindex.

**That third constraint has a concrete architectural consequence worth stating:** the normalization
rule-set version must be **recorded on the index** so a mismatch between index and query normalization
is detectable rather than silent. ADR-0019 §6 calls a divergence *"a correctness defect, not a tuning
parameter."* A stack that cannot detect the divergence cannot honour the constraint.

---

## 8. What A-SURVEY would have closed, and what remains open because it did not

**A-SURVEY did not run. Its prerequisite (PR5, the approved policy corpus) is unmet** — re-verified by
inspection during this task, not inherited from a prior record. Details: MSG-0078 and the TASK-0026
checkpoint.

**MSG-0077 anticipated that some A-STACK gaps would point back at the missing corpus, and recorded that
saying so is a legitimate result rather than a failure to conclude.** These are those gaps. Each names
the evidence that would close it, so the work is queued rather than merely lamented:

| # | Open question | Why the corpus decides it | Closed by |
|---|---|---|---|
| 1 | **Extraction toolchain** | The toolchain follows the formats actually present. A DOCX-dominant corpus with clean heading structure and a PDF-dominant one are different engineering problems, and **Arabic PDF extraction is a known-hard ligature problem** (ADR-0019 consequences) | A-SURVEY: formats, structural quality, Arabic PDF prevalence |
| 2 | **D14 rejection exposure** | MSG-0056a D14 rejects scanned documents. **The rule is correct either way; what is unknown is what fraction of the corpus it silently removes.** WP-0009 §6.2 states the risk precisely: if the corpus is largely scanned Arabic PDFs, *"the first release answers from a fraction of the corpus — and without the survey nobody discovers that until T-B runs"* | A-SURVEY: scanned-document prevalence |
| 3 | **Whether semantic retrieval is needed at all, and at what index scale** | Hybrid lexical + semantic is ruled by MSG-0056a D2 and carried in ADR-0020 §7, so the **shape** is settled — but engine sizing, and whether the semantic half earns its operational cost at this corpus's scale, are empirical | A-SURVEY: document count, size distribution, language mix |
| 4 | **Embedding behaviour on the real Arabic text** | Per-language acceptance bars (ADR-0019 §5) are evaluated against **real** policy text under SPEC-0020. Selecting on published multilingual benchmarks would be selecting on a proxy | A-SURVEY + SPEC-0020 evaluation |
| 5 | **PR6 host capacity** (§3.5) | Three concurrent local models plus indexing, against a corpus of unknown size, on a host of unmeasured capacity | A-SURVEY + an operator capacity measurement |
| 6 | **Chunking strategy** | Chunk anchors must resolve to sections a reader can open (ADR-0018 §1). Whether sections are short and well-delimited or long and unstructured changes the design | A-SURVEY: structural characteristics |
| 7 | **Classification and audience distribution** | Whether Restricted documents are rare or common changes how much §3.3's pre-filtered retrieval is exercised in practice, and how much of the corpus a typical employee can reach | A-SURVEY: classification/audience patterns |

**Seven of the questions a stack proposal would ordinarily answer are corpus-dependent, and none of
them can be answered honestly today.** This is the substantive reason A-STACK produces a constraint
analysis and a framed trade rather than a recommended stack — and it is a finding about **sequencing**,
not a shortfall in the evaluation: **A-SURVEY is a genuine input to A-STACK, and running A-STACK first
was always going to leave this residue.**

---

## 9. Recommendation, and what stays open

**MSG-0076 permits "an evidence-based recommendation **or** explicitly record why selection remains
open." This record does the second for the stack itself, and the first for three constraints that do
not depend on the corpus.**

### 9.1 What A-STACK recommends recording as settled (subject to the Lead's ruling)

1. **The index engine must support authorization-relevant pre-filtering inside the retrieval
   operation** (§3.3). This is entailed by ADR-0020 §3.1 and §4; A-STACK's contribution is to state it
   as a **selection criterion** so it is applied when an engine is chosen, rather than discovered to be
   violated afterwards.
2. **Three local models, not one** (§3.5) — the entailment layer is easy to omit from sizing, and
   ADR-0022's local-only rule applies to it.
3. **Conversation and audit storage are separate stores with different readers and different retention**
   (§3.7), and the logging/telemetry stack inherits ADR-0021 §2 and ADR-0020 §6.2.

### 9.2 What remains open, and what would close it

| Selection | Status | What would close it |
|---|---|---|
| Application runtime and the one-service/two-service seam | **OPEN** | The Architecture Lead's ruling on the §5 trade — it is a program judgment about operability and team capability as much as a technical one, and the operational-fit principle makes it explicitly the customer's context to weigh |
| Retrieval index engine | **OPEN** | Candidates filtered by §3.3's capability requirement, then decided against corpus scale (§8 #3) |
| Extraction toolchain | **OPEN — corpus-blocked** | A-SURVEY §8 #1, #2, #6 |
| Embedding model | **OPEN — not A-STACK's** | SPEC-0020 evaluation with per-language bars; ADR-0020 §7; the Lead's |
| Generation and entailment models | **OPEN — not A-STACK's** | SPEC-0020; ADR-0017 §7; ADR-0022 §4; the Lead's |
| Local serving runtime | **OPEN — deliberately not narrowed** (§6) | The Lead's, after the model decisions it must serve |
| Frontend framework | **OPEN — low weight** | RTL and accessibility evaluation; enforces nothing |
| Arabic normalization rule set | **DEFERRED BY ACCEPTED DECISION** | A-SURVEY, then an **amendment to ADR-0019** (§7) |
| Identity provider | **NOT A-STACK's** | T-0 — operator and organization (WP-0009 §6.1) |

### 9.3 Should this be recorded as an ADR? — the question WP-0009 §6.2 assigns to this task

WP-0009 §6.2 states that whether A-STACK's output becomes an ADR is *"that task's question, not settled
here."* **Answering it is therefore in scope; creating the ADR is not** — MSG-0076 authorizes no ADR
drafting, and A-ADR was separately authorized when drafting was intended (MSG-0068).

**Recommendation: not yet — with one qualification.**

**Why not yet.** An ADR records a **decision**. The honest state of this evaluation is that the stack
selections are open, most of them pending corpus evidence that does not exist. An ADR that recorded
"the stack remains open" would add no enforceable constraint while creating a record that later reads
like a settled choice — and the repository has already been bitten by records that outlived their
accuracy.

**The qualification.** The three items in §9.1 are constraints that hold **regardless of the corpus**,
and §3.3 in particular is a rule an implementer could plausibly violate while believing they conform to
ADR-0020 — because post-filtering *looks* like enforcement, and the response body is identical either
way. **If the Architecture Lead judges that risk material, the natural response is a narrow amendment
or successor to ADR-0020 rather than a new "stack ADR"**, since the rule is a consequence of ADR-0020's
own §3 and §4 and belongs with them.

**Either way it is the Lead's call, and this record makes no ADR and amends none.**

---

## 10. What this record does not do

- **It selects no provider, framework, model, embedding technology, index engine, or runtime.**
- **It authorizes no implementation**, and marks no task READY — T-A, T-B, T-D, T-E and T-0 remain
  unauthorized.
- **It modifies no accepted ADR.** ADR-0017 … ADR-0022 are inputs, quoted and unaltered.
- **It invents no Arabic normalization rule** (§7).
- **It introduces no retrieve-then-suppress behaviour** — §3.3 argues the opposite direction, and
  identifies over-fetch-then-filter as the same defect one layer down.
- **It produces no corpus survey data**, and substitutes no method or plan for one (§8).
- **It creates no ADR**, and answers the WP-0009 §6.2 ADR question as a recommendation only (§9.3).
- **It carries no authority.** It is PROPOSED, in a directory whose README states that records here are
  proposals awaiting a ruling.

## 11. Traceability

| Element | Authority |
|---|---|
| A-STACK's mandate, constraints, and "evaluate, do not select" | **MSG-0076**; WP-0009 §6.2 |
| ADR-0015 not inherited; dedicated task proposes the stack | **MSG-0062 §7.7**; ADR-0020 §8; ADR-0015 (own scope statement) |
| Local-only inference and embeddings; egress fails G10; no failover; offline model artifacts | **ADR-0022** §1, §2, §3, §6 |
| Model/runtime replaceability; recorded identity; Ollama not elevated | **ADR-0003**; **SPEC-0008**; ADR-0022 §4 |
| Pre-constrained candidate set; no retrieve-then-suppress; four enforcement points; index as rebuildable projection; replaceable index technology | **ADR-0020** §1, §3, §4, §7; **SPEC-0013** |
| Post-generation layered grounding gate; fail closed; entailment model not selected | **ADR-0017** §4, §7 |
| English authority; per-language bars; normalization obligation with the rule set deferred | **ADR-0019** §1, §5, §6 |
| Lifecycle, PUBLISHED-only indexing, section anchors, ingestion downstream of approval | **ADR-0018** §1, §2, §8 |
| Conversation/audit separation; employee-only read; expiry deletes; no Restricted content in logs | **ADR-0021** §2, §3, §4; ADR-0020 §6.2 |
| Identity terminates at OIDC/OAuth2; no LDAP/Kerberos | **ADR-0007**; MSG-0058 F3; SPEC-0004 |
| Tenant isolation reused unchanged | **ADR-0016**; WP-0001 verified evidence |
| Text-native only; scans rejected | MSG-0056a **D14**; WP-0009 G2 |
| Selection principles; no accidental architectural requirement; operational fit | `docs/architecture/technology-selection-principles.md` |
| Offline deployment, air gap, verified artifacts | **SPEC-0026**; ADR-0005; ADR-0014 |
| `/data/docker` boundary | Bootstrap contract v0.2; MSG-0006 |
| Component decomposition and answer path | EPA-0001 §4 (PROPOSED — read as description, not authority) |
| Corpus survey as an input this record lacks | WP-0009 §6.2 **A-SURVEY**; EPA-0004 §11.5 **PR5**; **MSG-0077**; **MSG-0078** |
