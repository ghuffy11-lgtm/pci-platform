# EPA-0006 — Employee Policy Assistant: Technology Evaluation and Implementation Planning (bounded A-STACK)

**Status:** **PROPOSED — and it selects nothing.** No retrieval engine, vector store, model, model-serving
runtime, application runtime, framework, library, or provider is selected, adopted, or shortlisted by this
record.
**Date:** 2026-08-23
**Produced by:** Claude Code — TASK-0032
**Authority:** **MSG-0098** (AUTHORIZED) · queue section `implementation/operations/CLAUDE-TASKS.md` §TASK-0032 · MSG-0099 (reconciliation)
**Work package:** WP-0009 — Employee Policy Assistant
**Binding inputs read in full:** ADR-0017, ADR-0018, ADR-0019, **ADR-0020 as amended by AMD-01**, ADR-0021,
ADR-0022; EPA-0005 (ACCEPTED, MSG-0092); `docs/architecture/technology-selection-principles.md`; WP-0009 §6
**Amended:** 2026-08-23 — **TASK-0034 (MSG-0105), §4 only**: strict Shape-1 criterion and probe
specification added as **§4.6**, three surfaced questions as **§4.7**, declared notes at §4.1, §4.3, §4.4
and §4.5. **Additive** — no existing sentence of §1–§16 was deleted or reworded, and **one claim was
withdrawn by annotation** (§4.3, class K). **This record still selects nothing, and no ADR was touched.**

---

## 0. What this record is, what it is not, and how it relates to EPA-0005

**This is not a second copy of EPA-0005, and the label reuse is the reason that has to be said in the
first paragraph.** WP-0009 §6.2 lists **A-STACK** once and already records it EXECUTED as TASK-0026. Both
tasks carry that label. They answer different questions:

| | **EPA-0005** (TASK-0026) | **EPA-0006** — this record (TASK-0032) |
|---|---|---|
| Question | Stack **shape** — one runtime or two, and where the seam falls | **Technology classes** *within* the settled shape |
| Evaluated against | The ADR set as it stood on 2026-08-22 | **Approach C as settled by MSG-0092**, and **ADR-0020 as amended by AMD-01** |
| Outcome | Approaches A/B/C framed, none chosen | Per-class verdicts against a now-testable disqualifier; **every product-level selection still open** |

**Neither of the two things this record evaluates against existed when EPA-0005 was written.** Approach C
was chosen by MSG-0092 *after* EPA-0005 was delivered, and AMD-01 was accepted on 2026-08-22 (MSG-0095)
and applied in place on 2026-08-23 (TASK-0031). MSG-0099 §2 records the distinction; this section repeats
it because a reader who finds two "A-STACK" records will otherwise reasonably conclude one task ran twice.

**EPA-0005 is treated here as accepted input and is not restated, contradicted, or superseded.** Where this
record extends one of its findings, it says so and names the section.

**This record modifies no accepted ADR.** ADR-0017 … ADR-0022 are read as binding. Several findings below
are consequences an implementer could get wrong; **none of them requires an ADR change**, and §14 states
that individually rather than leaving it to be assumed.

---

## 1. The question, restated so the boundary is visible

MSG-0098 authorizes *"technology evaluation and implementation planning"* and permits **either** a bounded
recommendation **or** an explicit record that selection remains open. It forbids production technology
selection, implementation, and deployment, and states that **no engine, store, model, serving runtime,
application runtime, framework, or provider is selected by the authorization**.

**Naming a candidate and choosing one are different acts.** This record names candidate *classes*, defines
what would disqualify each, and specifies the evidence that would settle it. It concludes with **selection
open** for every product-level choice, and with a bounded recommendation confined to obligations that need
no measurement (§12).

---

## 2. Method, and the two honesty rules it runs under

### 2.1 No unmeasured figure appears anywhere in this record

**No throughput, latency, memory footprint, index size, recall, precision, token rate, or capacity figure
appears below — not as an estimate, a typical value, a range, or a vendor claim presented as fact.** The
reason is not caution; it is that the project has measured none of them:

- **PR4** — a local inference runtime on the authorized host — is recorded **NOT MET** (ADR-0022
  consequences; WP-0009 §6.1). It is an operator action.
- **PR6** — host capacity for embeddings plus inference — is recorded **UNKNOWN and unmeasured** (ADR-0022
  consequences).
- **No corpus-scale survey exists.** A-SURVEY has run at **n=1, three times, on three different producers**
  (MSG-0084, MSG-0087, MSG-0089). WP-0009 §6.2's A-SURVEY row records **format mix, language prevalence,
  scanned prevalence, classification/audience distribution and version/supersession prevalence** as
  INSUFFICIENT at n=1, with no estimates invented.
- **No benchmark of any kind has been run in this project.**

§11 is the register of what is missing, stated as an obligation rather than filled in.

**What this record does contain instead are counts and requirements *derived* from accepted documents** —
for example, "at least three model invocations on the critical path of one English answer" (§6.4). A count
derived from ADR text is not a measurement and is not presented as one; the derivation is shown each time.

### 2.2 Product naming is deliberately minimal, and that is a stated trade, not an omission

EPA-0005 §0 warns that *"a comparison with no named alternatives is an essay."* That warning is right, and
this record answers it differently from EPA-0005 rather than ignoring it.

**The discriminating property in §4 — how an engine executes an authorization filter relative to candidate-set
construction — is not reliably determinable from a product's documentation, and it is not determinable at
all from this session.** This session has no verified source for any product's filter execution strategy.
Recording one would be precisely the vendor-claim-as-fact that MSG-0098 §5 forbids.

**So the classes below are defined by architectural shape, and membership is decided by a specified test
(§4.4) rather than by reputation.** Product names appear in exactly two places: products already named in
accepted repository documents (PostgreSQL, verified by WP-0001; Ollama, cited by ADR-0003 and SPEC-0008 and
explicitly *not* elevated by ADR-0022), and one legibility footnote in §4.3 that names well-known systems
**by category only**. **No claim is made anywhere here about any named product's conformance**, and the
footnote must not be read as a shortlist.

---

## 3. What must be expressible inside the query — the predicate, derived

**AMD-01 makes "the engine must support filtering" the wrong requirement. The right one is: *this specific
predicate*, evaluated within the retrieval operation.** Deriving it is the precondition for evaluating any
engine, and it has not previously been written down.

ADR-0020 §2 gives chunks **classification, audience, effectivity and language** inherited exactly from the
document version. ADR-0020 §3.1 requires the candidate set be built *"already constrained to the authorized,
in-scope, published, effective corpus."* ADR-0018 supplies the lifecycle and effectivity semantics. Putting
those together, the constraint the engine must apply is a **conjunction of four predicate shapes**, and they
are not equally easy to express:

| # | Constraint | Predicate shape | Source | Why it discriminates between engines |
|---|---|---|---|---|
| 1 | **Organizational / tenant scope** | Equality on a scope key | ADR-0020 §3.3; ADR-0016 | Universally supported. **But see §3.2 — this one has a trap.** |
| 2 | **Classification and audience vs. the subject's entitlements** | **Set-overlap** between a multi-valued chunk attribute and a multi-valued subject attribute | ADR-0020 §2, §3.1 | Multi-valued containment is common in search engines, uneven in vector stores |
| 3 | **Effectivity at answer time** | **Two-sided temporal range with an open upper bound** — `effective_from <= T AND (effective_to IS NULL OR effective_to > T)`, where `T` is the question's temporal frame, defaulting to now | **ADR-0018 §4** | **The sharpest discriminator.** Range predicates over an optional/nullable bound are materially harder than equality or keyword filters, and some vector stores support only the latter |
| 4 | **Answerable lifecycle state** | Exclusion of non-answerable states | **ADR-0018 §2** | See §3.1 — the subtlety is which states are even present |

### 3.1 Lifecycle is mostly an ingestion invariant — except for one state, which is a real query predicate

ADR-0018 §2 says DRAFT, IN_REVIEW, REJECTED and APPROVED-not-yet-published are **never indexed at all**, and
WITHDRAWN is **dropped from the projection**. Those need no query predicate: content that was never indexed
cannot be retrieved, which is exactly ADR-0018's own rationale — *"a filter that fails open leaks; an index
that never held the content cannot."*

**SUPERSEDED is different, and it is the one that must be enforced in-query.** ADR-0018 §2 marks it
**"Retained, not answerable"** — retained *for audit and reconstruction*, but never a basis for an answer in
release 1 (MSG-0056a D11). If the projection retains superseded chunks, then **"not answerable" is a query
predicate**, and under AMD-01 it must be applied inside the retrieval operation like any other.

**There is a design choice here and it is not this record's to make**, but the two options have different
consequences worth stating: either the projection excludes superseded versions entirely (simplest; audit
reconstruction then reads the kernel, not the index, which ADR-0020 §1 already implies since the index holds
no truth), or it retains them behind an in-query predicate (more index state, one more thing that must be
pre-constrained). **The first option removes a predicate rather than implementing one, and removing a
control surface is generally the safer shape** — recorded as an observation for T-C, not a decision.

### 3.2 The trap in constraint 1: ADR-0016's RLS does not reach an external index

**ADR-0020 §3.3 names the data layer as one of four independently sufficient enforcement points, and defines
it as RLS under ADR-0016 — FORCE RLS, a runtime role that is neither `SUPERUSER` nor `BYPASSRLS`, 404 over
403.** That mechanism is a property of the **kernel's PostgreSQL**, verified live by WP-0001.

**A retrieval index in a separate engine is outside that mechanism entirely.** Whatever the engine is, RLS
does not extend to it. So enforcement point 3 must be *reproduced* in the index — by the engine's own
scope predicate (constraint 1 above) — or the point becomes decorative, and **ADR-0020 §3 explicitly refuses
that**: *"A design in which three are decorative fails G3 however correct its output looks."*

**Consequence for evaluation:** scope enforcement in the index is **not free** and is not the same control
as the kernel's RLS, even though the two enforce the same property. Its cost is a per-class evaluation
dimension in §4.3. **This is not a conflict with ADR-0020 and needs no amendment** — §3.3 describes the data
layer; it does not claim the index inherits it. It is an obligation an implementer is likely to assume away.

### 3.3 The index's copy of authorization attributes can go stale — and that is what point 2 is for

Pre-constraining requires the index to hold classification, audience and effectivity. Those are copies. If
entitlements or lifecycle change between an indexing run and a query, the copy is wrong in one of two
directions:

- **wrong-inclusive** — a chunk the subject may no longer see remains a candidate. **This is what enforcement
  point 2 (post-retrieval re-check, ADR-0020 §3.2) exists to catch**, and it follows that point 2 must
  re-authorize against **the kernel**, not against the index's own attributes. Re-checking the index copy
  against itself would be a tautology, and it is the natural implementation.
- **wrong-exclusive** — a chunk the subject may now see is filtered out. This is a **correctness and
  availability** defect, not a confidentiality one, and it is what ADR-0020 §1's staleness threshold and
  **abstention A7** already govern.

**Both readings are already covered by accepted architecture; neither needs a new rule.** They are recorded
because "pre-filtering" invites the assumption that point 1 makes point 2 redundant, and ADR-0020 §3 says the
opposite in terms.

---

## 4. Retrieval engines against ADR-0020 + AMD-01 — the criterion applied

**This is the section MSG-0098 §2 and acceptance criterion 2 are about, and it is where the amendment earns
its keep.**

AMD-01, now in ADR-0020 §4:

> A retrieval or index engine may be adopted only if authorization-relevant constraints can be expressed and
> applied **within the retrieval operation itself**, so that unauthorized content is never a candidate under
> §3.1. An engine that can only match or rank first and exclude afterwards — including over-fetching a wider
> candidate set and discarding the surplus, **at any layer, including inside the retrieval component** — does
> not satisfy §3.1 and is **disqualified**. **G3 is therefore evidenced against the query actually issued to
> the engine, not against the response returned to the caller.**

### 4.1 Three execution shapes, of which only one conforms

The criterion sorts every candidate into one of three shapes. **The sort is by execution strategy, not by
product category and not by API surface** — and that distinction is the whole finding.

| Shape | How the authorization constraint is executed | Verdict under AMD-01 |
|---|---|---|
| **Shape 1 — constraint-in-candidate-set** | The predicate participates in building the candidate set: the engine only ever examines chunks that satisfy it | **CONFORMS** |
| **Shape 2 — post-filter** | The engine ranks over the whole collection, returns top-k, and something downstream discards the unauthorized ones | **DISQUALIFIED** — this is the shape ADR-0020 §4 has always forbidden |
| **Shape 3 — over-fetch-then-discard, inside the engine** | The engine accepts the predicate in the query, then satisfies it by retrieving a wider set and dropping non-matching entries — commonly by traversing an unfiltered index and rejecting as it goes, or by fetching `k × f` and truncating | **DISQUALIFIED — and this is the one AMD-01 was written to catch.** *"at any layer, including inside the retrieval component"* |

> **Amended 2026-08-23 by TASK-0034 (MSG-0105), additive and declared — and the Shape-1 row above is
> confirmed rather than changed.** MSG-0105 selects **strict Shape-1: *"examines nothing
> unauthorized."*** The row's existing wording — *"the engine only ever examines chunks that satisfy
> it"* — **already states the strict reading**, and the Lead's ruling adopts it. **What was missing was
> not strictness but testability**: the row says what conformance *is* and not what evidence
> establishes it, and MSG-0104 §6.3 proposed relaxing it to *"materializes no unauthorized content"* on
> exactly that gap. **That weaker reading is explicitly REJECTED** (MSG-0105 §2). **§4.6 below is the
> testable form of this row**, and nothing in §4.1–§4.5 is deleted or reworded.

### 4.2 Finding 1 — Shape 3 is invisible to the evidence rule that AMD-01 itself specifies

**AMD-01 states two obligations, and an implementer will conflate them.**

1. **A selection criterion** — the engine must be *capable* of Shape 1.
2. **A gate evidence rule** — G3 is evidenced against the query issued to the engine.

**Obligation 2 does not discharge obligation 1.** A Shape-3 engine receives a fully constrained query and
returns a correct response. **The query is conformant; the execution is not.** So G3 evidence — which
inspects the query — cannot distinguish Shape 1 from Shape 3, and a project that collects only G3 evidence
will believe it has cleared the engine criterion when it has not.

**This is not a defect in AMD-01 and requires no amendment.** AMD-01 says both things; it simply does not say
that the second is insufficient for the first, because it is answering a different question. The practical
consequence is a **separate conformance obligation at engine selection**, with its own evidence — specified
in §4.4.

**Why Shape 3 matters even when the returned results are correct**, since "the answer is right either way" is
the objection this will meet:

- **Unauthorized passage content is materialized inside the engine process.** ADR-0020's own context section
  is explicit that this is the failure — *"the content is in the process, in memory, in a log line, or in a
  timing difference, whatever the response body eventually says."*
- **It can leak through the engine's own logs.** See §9.3 — ADR-0020 §6.2's prohibition on Restricted content
  in logs carries **no authorization exception**, and an engine's slow-query or debug log is not exempt
  because the application wrote nothing.
- **It changes result counts under selectivity**, which is a *timing and result-count* surface — precisely the
  side channel ADR-0020 §5 and ADR-0021 §5 require to be closed and demonstrated by test.

### 4.3 Candidate engine classes, with the criterion applied to each

**Verdicts are about the class's shape, not about any product.** A class marked *not disqualified* is **not
cleared** — it is a class within which both conformant and non-conformant members exist, and membership is
settled by §4.4's test.

| Class | Shape | Predicate coverage from §3 | Verdict under AMD-01 | Reasoning |
|---|---|---|---|---|
| **R — Relational engine with integrated lexical and vector search** (the projection held in a relational store; the kernel's verified store, PostgreSQL, is of this family) | **Shape 1 *or* Shape 3 — plan-dependent.** See finding 2 | **All four.** Set-overlap and open-ended temporal ranges are native to the relational model | **NOT DISQUALIFIED as a class; not cleared.** Conformance is a property of the **query plan**, not the engine | A predicate-restricted exact scan is Shape 1 by construction. An *approximate* vector index scanned first and filtered as it goes is Shape 3. **The same engine and the same SQL can produce either**, depending on what the optimizer chooses |
| **S — Search engine with filtered lexical + kNN retrieval** | **Shape 1, 2 or 3 — commonly strategy-switching.** See finding 3 | **All four**, typically; faceted filtering with ranges is this class's native strength | **NOT DISQUALIFIED as a class; not cleared** | Filtered approximate search in this class is implemented variously as constrained traversal (Shape 1), post-filter (Shape 2), or adaptive over-fetch (Shape 3), and several members **choose between them at runtime based on filter selectivity** |
| **V — Purpose-built vector store with declared pre-filtering** | **Shape 1 or 3 — same hazard as S** | **Uneven.** Constraint 3 (the open-ended temporal range) is the likely gap; constraint 2 (multi-valued set overlap) is the second | **NOT DISQUALIFIED as a class; not cleared — and carries an additional §7 problem** | Declared "pre-filtering" is an API property. Whether the filter constrains the traversal or prunes its output is an implementation property, and the two are not distinguishable from the API. **Separately: ADR-0020 §7 requires *hybrid lexical + semantic*, which a pure vector store does not supply alone** — see §4.5 |
| **L — Lexical-only engine** | Shape 1 for the predicate | All four, typically | **NOT DISQUALIFIED on the AMD-01 criterion, but insufficient alone** | Fails ADR-0020 §7's hybrid requirement by itself. Usable only as one half of a pair, which raises §4.5 |
| **K — No separate engine: retrieval computed against the kernel store** | **Shape 1 by construction** | All four, and **it is the only class where enforcement point 3 is the kernel's own verified RLS** rather than a reproduction of it (§3.2) | **CONFORMS structurally — and its cost is entirely unmeasured** | The candidate set *is* an authorized query result; there is no wider set to over-fetch from. Its viability is a performance question at corpus scale, and **both the corpus scale and the host capacity are UNKNOWN** (§11). It is listed because it is the only class whose conformance needs no test, and omitting it would misrepresent the option space |
| **D — Post-filter-only similarity search** (any engine whose only filtering applies to an already-returned result set) | **Shape 2** | — | **DISQUALIFIED** | Directly, by ADR-0020 §4 as amended. No test required |
| **H — Hosted / managed retrieval or vector service** | — | — | **DISQUALIFIED — and twice over, on independent grounds** | **(i) ADR-0022 §1** — embeddings are *derived from policy content* and are named explicitly; nothing derived may leave the host, so this class is out regardless of its filter shape. **(ii)** Where such a service is also Shape 2 or 3, AMD-01 disqualifies it independently. **The two eliminations do not depend on each other**, which matters: relaxing one would not revive the class |

> **Legibility footnote, by category only.** Class R corresponds to relational engines with full-text search
> plus a vector index capability; class S to document search engines offering lexical retrieval alongside kNN
> (Elasticsearch and OpenSearch are of this category); class V to dedicated vector databases (Qdrant, Milvus,
> Weaviate, Chroma are of this category); class H to managed vector and retrieval services. **These names
> establish category membership and nothing else. No claim is made here about any of them — not about filter
> execution strategy, not about predicate coverage, not about suitability — and this list is not a
> shortlist.** Determining any product's shape is §4.4's job and has not been done.

> **Amended 2026-08-23 by TASK-0034 (MSG-0105) — one claim in the table above is WITHDRAWN, and the
> class verdicts are otherwise unchanged.**
>
> **Class K's cell reads *"CONFORMS structurally"*. That claim does not survive strict Shape-1 and is
> withdrawn.** Its supporting argument is *"the candidate set **is** an authorized query result; there
> is no wider set to over-fetch from"* — a statement about **what the query returns**, not about what
> the engine **examined** while resolving it. **That is the materialization-only reasoning MSG-0105 §2
> rejects.** A relational engine evaluating this predicate examines rows and rejects them exactly as
> the probed class-R engine did (MSG-0104 §5.3); enforcing the predicate through RLS rather than a
> `WHERE` clause changes **where the rule is written**, not **what the traversal touches**. Class K may
> still turn out to conform — **it has simply never been measured**, and the structural argument is no
> longer sufficient to assert it without measurement.
>
> **Class K's authoritative verdict is unchanged: NOT CLEARED** (MSG-0104 §7, "no PostgreSQL on this
> host … this probe produced no execution evidence for it"). **No verdict in MSG-0104 is softened,
> relabelled, or re-presented as conformance** (MSG-0105 §3). **This withdrawal moves in the strict
> direction only** — it removes a conformance claim, and creates none.
>
> The rest of the table stands: **D and H DISQUALIFIED**; **R, S, V, L not disqualified and explicitly
> not cleared.** The phrase *"not cleared"* now carries the §4.6 bar rather than the §4.4 one.

### 4.4 Finding 2, finding 3, and the conformance probe that settles them

**Finding 2 — for class R, conformance is a property of the query plan, and a plan is not stable.** The same
statement can be executed as a predicate-restricted exact scan (Shape 1) or as an approximate index scan with
rejection (Shape 3), and which one runs depends on the optimizer's cost model — which depends on statistics,
which depend on the data. **A security control whose satisfaction depends on the optimizer's estimate of
selectivity is not a control.** So for class R the obligation is: **pin the plan and evidence it per query
shape**, and treat a plan change as a security-relevant regression, not a performance one.

**Finding 3 — a strategy-switching engine is disqualified unless the strategy can be pinned.** Where an engine
chooses between constrained traversal and over-fetch **at runtime based on filter selectivity**, its
conformance flips with the data. Under AMD-01 the engine "can only match or rank first and exclude afterwards"
in exactly those cases where it chooses to. **An engine that is Shape 1 for common queries and Shape 3 for
highly selective ones is disqualified for the selective case — which is the case that matters**, because high
selectivity is what a restrictive authorization predicate produces. Pinning the strategy, where the engine
permits it, converts the class member into a candidate again; where it does not, the member is out.

**The conformance probe — three tiers of evidence, increasing in strength.** This is what T-C would run, and
it is offered as an implementation-planning artifact, not as a selection.

| Tier | Evidence | What it establishes | What it does **not** establish |
|---|---|---|---|
| **1 — query shape** | The query actually issued to the engine carries the full §3 predicate | **Discharges AMD-01's G3 evidence rule.** Necessary | **Nothing about execution.** Shapes 1 and 3 are identical at this tier — finding 1 |
| **2 — k-completeness under adversarial selectivity** (black-box) | Build a collection where at least `k` **authorized** chunks exist but rank below `M` **unauthorized** chunks, `M` ≫ `k`. Issue the constrained top-`k` query. **A Shape-1 engine returns exactly `k` authorized results, and the result set is invariant as `M` grows.** A Shape-3 engine returns **fewer than `k`**, or a set that changes with `M` | Discriminates Shape 1 from Shape 3 **from outside the engine**, with no vendor claim and no instrumentation | **Not a proof.** An engine that over-fetches with adaptive retry until `k` is satisfied can pass this while still materializing unauthorized content. It detects the common failure, not every failure |
| **3 — execution evidence** | Query plan or engine counters showing the number of candidates examined is bounded by the authorized subset; **plus** inspection of the engine's own logs showing no unauthorized passage text is materialized there (§9.3) | **This is what actually discharges AMD-01's *selection criterion*** | Requires the engine to expose plan or counter instrumentation. **An engine that exposes neither cannot be cleared at all** — which is itself a selection criterion worth stating |

**The last cell is the sharpest practical consequence in this section: an engine that cannot be observed
cannot be cleared.** Under AMD-01 the burden is on the engine to demonstrate Shape 1, and an opaque engine
fails that burden regardless of what its documentation asserts.

> **Amended 2026-08-23 by TASK-0034 (MSG-0105) — tiers 1 and 2 stand; tier 3's bar is RESTATED in
> testable form in §4.6, which governs where the two differ.**
>
> **Tier 3's evidence column requires that the candidates examined be *"bounded by the authorized
> subset"*, and that phrase is not decidable as written.** It admits two readings — *"no more numerous
> than the authorized subset"* and *"a subset of the authorized set"* — which differ by exactly the
> quantity MSG-0104 measured. Under **strict Shape-1** only the second is the bar, and **the threshold
> is zero**: §4.6 S3.
>
> **Tier 3 also leaves the instrument's placement unspecified, and that gap is load-bearing.** MSG-0104
> §4.2 found two candidates with **identical query plans** reporting **2000** and **1000** unauthorized
> rows examined, purely because the counter sat at different points in predicate evaluation. **A count
> is therefore a lower bound, and a zero count from a conveniently placed instrument is not evidence of
> conformance.** §4.6 S4–S6 supply the asymmetry rule and the placement rule that close this.
>
> **Tier 2 is unchanged, and its worth is now demonstrated rather than argued** — the TASK-0033
> negative control passed it at `M=50` and failed at `M=500` and `M=5000` (MSG-0104 §5.2), so a probe
> run at a single collection size would have cleared a post-filter design. **Tier 1 is unchanged**, and
> finding 1's warning that it establishes nothing about execution is now an experimental result
> (MSG-0104 §5.5) rather than a prediction.

### 4.5 A clarification question the criterion raises, referred rather than answered

**ADR-0020 §7 says "hybrid lexical + semantic retrieval, multilingual local embeddings, *one projection
index*."** Classes L and V each supply one half of "hybrid" and would be paired.

**Two readings of "one projection index" are available and they have different consequences:**

- **one *projection*, possibly served by more than one engine** — in which case a lexical engine plus a vector
  engine is permitted, and **AMD-01 then binds both independently**: each must be Shape 1, because a
  conformant lexical half combined with a Shape-2 vector half retrieves unauthorized content just as surely;
- **one *engine*** — in which case classes L and V are excluded from use in a pair, and only classes R, S and
  K remain.

**This record does not choose between them**, because doing so would settle the meaning of an accepted ADR by
implication. It is referred in §15 as a non-blocking clarification. **What holds under either reading, and is
worth stating now, is the fusion hazard**: where results from two retrievers are combined, **the fusion step
must not be where authorization is resolved**. A fusion layer that merges a constrained result set with an
unconstrained one and then filters is Shape 2 wearing a different name.

> **Ruled 2026-08-23 — MSG-0101 §1(1) answers this question and it is no longer open.** *"One
> projection index"* means **one *logical* projection**; a lexical + semantic pair may be evaluated
> only if both operate over that same governed projection and **each independently satisfies AMD-01**,
> and **the fusion layer must never resolve authorization**. The first reading above is therefore the
> ruled one, with the independent-binding condition attached. **The fusion hazard paragraph is
> confirmed by that ruling, not superseded by it.** §4.7 Q2 records why the word *logical* may become
> load-bearing under strict Shape-1.

---

### 4.6 The strict Shape-1 criterion and probe specification (TASK-0034, MSG-0105)

**Added 2026-08-23 by TASK-0034.** This section is an **evidence instrument, not policy.** It states
how a future probe decides whether a candidate satisfies the Shape-1 gate that ADR-0020 §4, as amended
by AMD-01, already imposes. **It amends no ADR, weakens nothing, and selects, adopts, recommends,
installs and deploys no engine.** Authority: **MSG-0105 §3–§5**, which authorizes exactly this
instrument update and calls it *"an interpretation of AMD-01's existing Shape-1 gate"* that *"does not
authorize weakening AMD-01 or changing the accepted confidentiality policy."*

#### S1 — The requirement, quoted rather than paraphrased

> **Strict Shape-1 is selected: "examines nothing unauthorized."**
>
> For purposes of AMD-01 and future retrieval-engine evaluation, the retrieval engine **must not
> examine, retrieve, inspect, or otherwise process** content that the requesting user is not authorized
> to access. **Authorization must constrain the candidate set before retrieval/search occurs.**
>
> It is **not sufficient** merely to prevent unauthorized content from being materialized or returned
> after the engine has examined it.
>
> — MSG-0105 §1

#### S2 — The rejected reading, recorded as rejected so it cannot quietly return

**MSG-0104 §6.3 proposed that the architecturally meaningful line is *"materializes no unauthorized
passage content"* rather than *"examines nothing unauthorized."* MSG-0105 §2 rejects it explicitly**,
as *"insufficient to clear Shape-1."*

**The worked example is why this must be written down rather than assumed remembered.** TASK-0033's
candidate **C1 met the rejected line exactly** — zero unauthorized bodies materialized, at every
collection size, under both index designs — while examining **1000 unauthorized rows at `M=5000`** under
its better index. Its verdict was **NOT CLEARED**, and under this criterion it stays NOT CLEARED. **A
future probe reporting zero materialized bodies has reported a true thing that clears nothing.**

**Stated as a rule:** *no candidate may be marked CLEARED on materialization evidence.* Materialization
evidence is still worth collecting — it is how class D was disqualified on measurement rather than
argument — but it evidences **a distinct and lesser property**, and a probe must label it as such.

#### S3 — The bar: zero, and invariant with collection size

**The passing threshold is ZERO unauthorized units examined.** Strict Shape-1 admits **no non-zero
allowance** — not a fixed budget, not a proportion of the collection, not a "negligible at realistic
scale" exception.

For a candidate `C`, a requesting subject `s`, and a collection of size `N`:

```text
U(C, s, N) = | { units examined by the engine while resolving the query
                 that do NOT satisfy the §3 predicate for s at answer time } |

CLEARED requires   U(C, s, N) = 0    at every measured N
```

**And it must be shown invariant with `N`.** Measure at **no fewer than three collection sizes** with
`M ≫ k`, as tier 2 already requires. **A count that grows with `N` is decisive evidence of failure**:
growth with collection size — rather than with the predicate's selectivity — is the signature of a
traversal bounded by **index coverage** instead of by **authorization**. That is exactly what TASK-0033
measured: **30 / 300 / 3000** on a partial index and **10 / 100 / 1000** on a covering one, with the
residual immovable because the multi-valued audience conjunct lives in a junction table and cannot be
pushed into the chunks index (MSG-0104 §6.1).

#### S4 — What counts as a "unit examined"

**A criterion that does not say what it counts cannot return a defensible verdict.** A unit is
**examined** if the engine, while resolving the query, does any of:

| | Unit | Why it counts |
|---|---|---|
| **U1** | reads an **index entry or key** during traversal | the traversal *is* the candidate-set construction that MSG-0105 §1 requires to be already constrained |
| **U2** | reads a **row, document, or vector** from storage | the ordinary meaning of *retrieve* |
| **U3** | passes a value to a **ranking, scoring, distance, or filter function** | measured directly by TASK-0033's `probe_rank` |
| **U4** | traverses a **term posting, token, or vector-index node** while resolving a full-text or approximate match | the FTS5 gap of MSG-0104 §5.3 — the stage the prior probe **could not see into** |
| **U5** | places content in a **buffer, cache, temporary structure, or log line** while resolving the query | ADR-0020 Context: *"the content is in the process, in memory, in a log line, or in a timing difference"*; ADR-0020 §6.2 carries **no authorization exception**, so the engine's own slow-query or debug log is in scope |

A unit is **unauthorized** if it fails the §3 predicate **for the requesting subject at answer time** —
including any of the five failure modes the TASK-0033 fixture kept separate: wrong scope, disallowed
classification, non-overlapping audience, outside the effectivity window, and **SUPERSEDED** lifecycle
state.

> **The scoping question this raises is surfaced in §4.7 Q1 and is NOT decided here.** Until it is
> ruled, **the criterion takes the strictest available reading**: U1–U5 all count, and reading an index
> entry's metadata key counts as examining it even where no passage content is touched. **That default
> is fail-closed** — it can only turn a would-be CLEARED into NOT CLEARED, never the reverse — **so the
> criterion is usable now and needs no ruling to operate.**

#### S5 — The asymmetry rule: counters can prove failure, never success

**This is the most important rule in the specification**, because it is what stops a future probe from
clearing an engine by placing its instrument somewhere convenient.

- **A non-zero count is conclusive.** It proves the engine examined unauthorized units. **NOT CLEARED**,
  and no plan evidence rehabilitates it.
- **A zero count is not conclusive.** It proves only that nothing unauthorized crossed **the point where
  the instrument sits**. It says nothing about what the engine touched *before* that point — index
  entries scanned, pages read, postings traversed — and an instrument written into a `WHERE` clause is
  **structurally incapable** of observing those.

**A CLEARED verdict may therefore never rest on counters alone.** It requires **E1**, with E2–E4
corroborating.

#### S6 — The four evidence classes, all required for CLEARED

| | Evidence | What it must show | If absent |
|---|---|---|---|
| **E1** | **Traversal-bounding evidence** — query plan, explain output, or engine-internal trace | that the traversal is **confined to a structure or region every entry of which satisfies the predicate**. A plan showing a scan or seek over a structure that **spans authorization scopes** is **disqualifying regardless of any counter**, because the counter may sit past the point where those entries were read | **NOT CLEARED** |
| **E2** | **Counter evidence** — engine-reported counters: rows read, index entries examined, documents scored, pages or buffers touched | `U = 0` at every measured collection size, with **instrument placement recorded** | **NOT CLEARED** |
| **E3** | **Opaque-stage evidence** — for every stage whose internals the engine does not expose | that the stage examined nothing unauthorized. **The worked example is FTS5's `MATCH` traversal**, recorded by MSG-0104 §5.3 as **NOT MEASURED**, no instrument reachable through `node:sqlite` getting inside it | **NOT CLEARED for that candidate** — *never* a pass by default |
| **E4** | **Log inspection** — carried forward unchanged from §4.4 tier 3 | no unauthorized passage text in the engine's own logs (§9.3; ADR-0020 §6.2) | **NOT CLEARED** |

**E3 is the addition that changes how a record like MSG-0104 reads.** That probe's C2 and C3 reported
*"0 unauthorized bodies materialized"*, and the record was careful to say this was **absence of
measurement, not evidence of absence**. Under this criterion that distinction no longer depends on the
writer's care: **an unmeasurable stage yields NOT CLEARED by rule.**

#### S7 — Instrument placement, and reporting the maximum

Because counts are position-dependent (S5), a probe **must**:

1. **record where each instrument sits** in the evaluation order;
2. **report the maximum count across all placements** as the candidate's `U`, treated as a **lower
   bound** on units examined;
3. **never present a single count as "the" number**, and never compare two candidates on counts taken at
   different placements.

**MSG-0104 §4.2 is the precedent:** C2 and C3 had **identical query plans** and reported **2000** and
**1000**, and that record states plainly that **neither is "the" answer and C2 is not worse than C3.**

**An in-query counter does not measure rows scanned at all.** The **plan** is the evidence for scan
extent — which is why E1 is required rather than optional.

#### S8 — Mandatory negative control, and the adversarial precondition

Both carried forward from TASK-0033, because both earned their place.

- **A deliberately non-conforming candidate must be included in every probe run.** If the harness does
  not fail it, **the run is void and its passes prove nothing.** TASK-0033's control was k-complete at
  `M=50` and returned **empty** at `M=500` and `M=5000` — so a post-filter design *"looks perfectly
  correct on a small collection and silently starts returning empty answers as the collection grows"*
  (MSG-0104 §6.2), surfacing as an **availability** defect long after the design decision was made.
- **The fixture must be verified adversarial before every measurement**, by issuing the **unconstrained**
  top-`k` and asserting **no authorized chunk appears in it**. If one does, tier 2 is void and the
  harness must say so rather than proceed quietly.

#### S9 — Verdict vocabulary, and how absence of evidence is recorded

**Unchanged from MSG-0101 §2, and as MSG-0104 applied it.**

| Verdict | Awarded when |
|---|---|
| **CLEARED** | **E1 + E2 + E3 + E4 all obtained**, `U = 0` at every measured collection size, and the count shown **not to grow** with `N` |
| **DISQUALIFIED** | The candidate is Shape 2 or Shape 3 by design or by demonstration — post-filtering, or over-fetch-then-discard at any layer — or is excluded on independent grounds such as ADR-0022 §1 |
| **NOT CLEARED** | **Everything else.** Any missing evidence class, any unmeasurable stage, any non-zero `U`, any engine exposing no plan or counter instrumentation, and **any candidate not reachable at all** |

**`NOT CLEARED` is the required answer wherever evidence is absent.** It is **never** upgraded to
conformance by a documentary argument, a vendor claim, an API description, or a structural inference.
**The class-K withdrawal in §4.3 is the worked example of that rule applied to this record's own prior
text.**

#### S10 — The engine-exposure criterion, restated and strengthened

§4.4 already held that **an engine exposing neither plan nor counter instrumentation cannot be cleared
at all.** Strict Shape-1 extends it: **an engine must also expose its opaque stages**, or those stages
are NOT CLEARED and the candidate with them.

**This is a selection criterion in its own right, and it is prior to any performance question.** Under
AMD-01 the burden is on the engine to demonstrate Shape 1; an engine that cannot be observed fails that
burden **regardless of what its documentation asserts**, and regardless of how well it performs.

#### S11 — What a probe running this specification must NOT do

- **Must not relabel prior evidence.** MSG-0104's verdicts stand; nothing already measured may be
  re-presented as conformance under the rejected reading (MSG-0105 §3).
- **Must not select, adopt, recommend, install, or deploy an engine.** Naming a candidate names a **test
  subject** (MSG-0101 §3).
- **Must not enter a real or confidential corpus.** Fixtures are synthetic.
- **Must not amend an ADR**, propose one, or mark any implementation task READY.
- **Must not report a timing figure** taken on a shared workstation as a measurement, and must not
  invent a benchmark, capacity, latency, or recall figure of any kind.

---

### 4.7 Three questions strict Shape-1 raises — surfaced, and deliberately NOT decided

**MSG-0105 §5 and MSG-0106 §4 both require these be surfaced rather than answered.** Deciding any of
them would be an architecture change TASK-0034 is not authorized to make. **§4.6 is operable without any
of them being answered** — each carries a stated fail-closed default.

#### Q1 — Does "examine" reach index metadata, or only passage content?

§4.6 S4 counts **U1** — reading an index entry or key — as examining. A narrower reading would count
only units carrying **passage content** (U2–U5), on the ground that ADR-0020's stated hazard is content
in the process.

**This is NOT the rejected MSG-0104 §6.3 reading returning under a new name, and the difference should
be checked rather than taken on trust.** §6.3 asked *what suffices to clear a candidate*, and was
rejected. Q1 asks *what the counter counts*. They come apart in a case that is not hypothetical: an
engine that seeks an index confined to authorized entries but reads **one boundary key** belonging to an
unauthorized row scores `U = 1` under the strict reading and `U = 0` under the narrow one, **while
touching no passage content under either.**

**Default until ruled: the strict reading, U1–U5.** Fail-closed, and therefore safe to operate under.

#### Q2 — Can strict Shape-1 be satisfied by query-time predicates alone, or does it constrain how the projection is *physically organised*?

**This is the question with the most architectural leverage, and it is MSG-0106 §4's question.**

**The evidence points one way and this record stops there.** Evaluating a conjunctive predicate normally
means examining candidates and rejecting them — an engine cannot know a row fails the audience test
without examining that row's audience. TASK-0033 drove the residual down by widening the index and
**could not reach zero** (MSG-0104 §6.1). **So `U = 0` appears to require that the traversal open only
structures whose every entry is already authorized** — a statement about **physical organisation**
(partitioned, sharded, or per-scope structures), not about query text.

**Two further difficulties are recorded because they bear on whether the question has a clean answer at
all:**

1. **Not every conjunct partitions.** Scope, classification and lifecycle state are **discrete and
   finite**, and could plausibly be organised cleanly. **Effectivity-at-answer-time is a continuous
   two-sided range with an open upper bound** — §3 already calls it *"the sharpest discriminator"* — and
   **audience is a multi-valued set overlap**. Whether these can be physically organised at all, rather
   than only evaluated, is genuinely open.
2. **It interacts directly with MSG-0101 §1(1)**, which ruled that *"one projection index"* means one
   **logical** projection. That wording deliberately leaves physical organisation open, and **may prove
   load-bearing precisely here** — per-scope physical structures beneath one logical projection is the
   shape Q2 points at.

**Default until ruled: none needed.** The criterion measures `U` and reports it. If no candidate reaches
zero, the correct output is **NOT CLEARED for all of them** — a defensible verdict, not a stalemate.

#### Q3 — If no engine class can reach zero, what is the architectural response?

**This may well be the outcome, and it should be visible before a probe runs rather than discovered
after.** TASK-0033 cleared nothing; §4.3's one structural conformance claim is withdrawn above; and
**class K faces the same measurement question as class R**, having never been measured at all.

**The response is the Architecture Lead's and this record proposes none.** For completeness, the shape
of the choice is: accept physical organisation as an architectural requirement (Q2); or settle what `U`
counts (Q1); or reconsider the retrieval topology. **What this record explicitly does NOT propose is
relaxing the bar** — MSG-0105 §3 forbids weakening AMD-01, and **a criterion loosened whenever nothing
passes it is not a criterion.**

---

### 4.8 Physical projection isolation — patterns, and what they measured (TASK-0035, MSG-0107b)

**Added 2026-08-23 by TASK-0035. Additive and declared: nothing in §4.1–§4.7 is deleted or
reworded, and no class verdict changes.** This section records what physical isolation is, which
conjuncts it can and cannot discharge, and what it measured on the one reachable engine. **It
selects, adopts, recommends, installs and deploys nothing, amends no ADR, and clears nothing.**
Authority: **MSG-0107b**. Full evidence: **MSG-0109**; harness and captured output at
`implementation/probes/TASK-0035/`.

**MSG-0107b §1 is the ruling this section serves:** physical projection isolation **is** part of
strict Shape-1 *where necessary to guarantee the engine does not examine unauthorized content*, and
**query-time predicates alone are insufficient unless execution evidence demonstrates they genuinely
prevent examination** — **not disqualified in principle, only unproven.**

**Logical and physical stay distinct.** Every design below serves **one logical projection**.
**MSG-0101 §1(1) is unchanged and is not reinterpreted**: *"one projection index"* means one
**logical** projection, and nothing here requires one physical index or one physical store.

#### The refinement rule, from which the patterns follow

> A physical partitioning **discharges** a conjunct only if the partition key **refines** it — every
> row in a partition agreeing on that conjunct's truth value for every subject routed to it. A key
> that merely *correlates* with a conjunct discharges nothing.

**The four §3 constraints do not split evenly under that rule.** Scope, classification and lifecycle
state are discrete and refine cleanly. **Audience refines at the cost of replication** — one
structure per token, a chunk stored once per token it carries. **Effectivity-at-answer-time does not
refine at all without fixing a time**, being a two-sided range with an open upper bound; it can be
refined only *as of an instant*, and **that refinement decays from the instant onward.** This is the
difficulty §4.7 Q2 recorded in advance, now with a measurement attached.

#### Pattern catalogue

| | Pattern | Conjunct discharged |
|---|---|---|
| **I0** | no isolation — one shared structure | none |
| **I1** | scope / tenant partitioning | 1 |
| **I2** | discrete-attribute partitioning — classification, lifecycle state | 2a, 4 |
| **I3** | entitlement-token partitioning — one structure per audience token | 2b, **with replication** |
| **I4** | temporal materialisation — the structure holds only what is effective at an instant | 3, **with a decay term** |
| **I5** | per-principal materialisation | 1, 2a, 2b, 4 — **not measured** |
| **I6** | per-partition secondary structures — lexical or vector index built per partition | **none by itself**; it extends existing confinement into the secondary structure |

**I6 is the one most easily omitted, and omitting it undoes the rest**: a perfectly partitioned base
paired with **one global lexical or vector index** puts the traversal back over a structure spanning
every authorization scope, which §4.6 S6/E1 makes disqualifying regardless of any counter.

#### What was measured (class R test subject; MSG-0109 §5)

`U` = unauthorized units examined, maximum across three instrument placements (§4.6 S7):

| Design | Patterns | M=50 | M=500 | M=5000 | E1 structure invariant | Verdict |
|---|---|---|---|---|---|---|
| P0 | I0 | 20 | 200 | 2000 | VIOLATED | NOT CLEARED |
| P1 | I1 | **40** | **400** | **4000** | VIOLATED | NOT CLEARED |
| P2 | I1+I2 | 20 | 200 | 2000 | VIOLATED | NOT CLEARED |
| P3 | I1+I2+I3 | 10 | 100 | 1000 | VIOLATED | NOT CLEARED |
| P4 | +I4 | **0** | **0** | **0** | **holds** | **NOT CLEARED** — E4 not obtained; zero holds at the materialisation instant only |
| P5 | P4+I6 | **0** | **0** | **0** | **holds** | **NOT CLEARED** — E3 argued from construction, not instrumented |
| P4S | P4 after the clock moved | 5 | 50 | 500 | VIOLATED | **NOT CLEARED** — and it **returned** unauthorized rows |
| NC | negative control | 50 | 500 | 5000 | VIOLATED | **DISQUALIFIED** — the control fails, so the run is valid (§4.6 S8) |

**Four results carry beyond this engine.**

1. **`U` equals the number of unauthorized rows the routed structures still contain.** Two
   independent measurements — counting stored rows, and counting engine calls inside each structure's
   own scan — agree at every design and every collection size. **Isolation reduces `U` exactly
   insofar as it removes unauthorized rows from the structures opened, and by nothing else.**
2. **Partial isolation can make matters worse.** **P1, scope-only, examined the most of any
   design** — replacing an index restriction (`SEARCH … USING INDEX i_auth`) with a structural one
   (`SCAN p_org_a`) moved work from the index into the scan without carrying the rest of the
   predicate. An evaluation reporting only survivor counts would have recorded it as an improvement.
3. **Temporal materialisation changes the failure mode from conservative to leaking.** Where
   examine-then-reject examines unauthorized rows and correctly discards them, a stale materialised
   structure **returns** them: **5 of 5 results, at every collection size.** No TASK-0033 candidate
   ever returned an unauthorized row. **ADR-0020 §3.2's post-retrieval re-check against the kernel,
   §1's staleness threshold and abstention A7 are what catch this** — which is why the enforcement
   points are not redundant here. **No new rule is proposed;** whether they are *prerequisites* for
   clearing an I4 design is referred (MSG-0109 §9 Q5).
4. **I6 offers a structural answer to the opaque-stage problem, and it is not an instrument
   reading.** MSG-0104 could not see inside the FTS5 `MATCH` traversal. Building that index **per
   partition** means the stage has no unauthorized entry to reach. **Whether that is admissible as
   E3 evidence is unruled, and until it is, the default is no** (MSG-0109 §9 Q6). A cost worth
   planning for: **splitting one lexical index splits its scoring statistics**, so cross-partition
   score comparison is not simply a sort — an observation from construction, **unmeasured**.

**Nothing is CLEARED, no class verdict moves, and all nine MSG-0104 verdicts stand unchanged.**
Classes **S and V remain unreachable** on the authoring host and **K remains unmeasured** — for K the
point sharpened by this evidence is that **RLS is enforcement, not isolation**: it decides where the
rule is written, not what the traversal opens, which is the same gap §4.3's withdrawn *"conforms
structurally"* claim rested on.

---

## 5. Candidate technology classes against Approach C (MSG-0098 item 1)

**Approach C is settled and is treated here as a constraint, not an option** (EPA-0005 §5; MSG-0092): a
governed application layer for the authorization-critical path, plus a **separate document/inference worker
behind an explicit contract**, where **the worker is not an authorization authority**.

### 5.1 What the settled seam already determines

**The seam is not a deployment convenience; it is a security boundary with a stated direction.** Because the
worker makes no authorization decisions, the following fall out without any technology choice:

| Component (EPA-0001 §4.1) | Side of the seam | Fixed by |
|---|---|---|
| C1 Document Authority · C4 Authorization · C5 Grounded QA orchestration · C7 Audit Sink | **Governed application layer** | MSG-0092 — authorization stays in the governed layer *before* retrieval |
| C2 Ingestion / extraction · C6 Model runtime adapter · the embedding path | **Document/inference worker** | MSG-0092 — the C2/C6 seam is where Approach C cuts |
| **C3 Retrieval index** | **Neither, exactly — and this is the placement question §5.2 is about** | — |

### 5.2 The one placement question the settled seam does not answer, and how AMD-01 constrains it

**C3 sits awkwardly.** It is *outside the kernel* (EPA-0001 §4.1), it is queried on the
authorization-critical path, and its content is produced by the worker. So which side owns it?

**AMD-01 answers half of it and the answer is directional.** Since the authorization predicate must be
**inside the query issued to the engine**, the component that **composes the query must be the governed
layer**, or a component acting under its constraint — never the worker composing a query on its own account.
Otherwise the worker would be deciding what a subject may see, which MSG-0092 forbids in terms.

**Three arrangements are consistent with that, and this record chooses none:**

| Arrangement | Consistent with MSG-0092 and AMD-01? | The cost, stated |
|---|---|---|
| **C3 read by the governed layer; the worker only writes to it** | **Yes** — the query, and therefore the predicate, is composed on the governed side | The worker needs write access to the index; index write and index read become separately authorized paths |
| **C3 read through the worker, with the governed layer supplying the complete predicate as part of the request** | **Yes, but only if the contract makes the predicate non-optional** — see §10.2 | A contract that permits an unconstrained search call reintroduces Shape 2 at the seam. The interface signature is the control |
| **C3 co-located with the kernel store (class R / class K)** | **Yes** | Inherits ADR-0016 RLS for the scope constraint (§3.2), but see §10.3 — **the index is excluded from the backup path by ADR-0020 §1 while the kernel store is not**, so co-location makes an explicit backup-scope exception mandatory rather than optional |

### 5.3 Application runtime and framework — open, and less consequential than it looks

EPA-0005 §5 framed the runtime trade and §2 recorded that **ADR-0015 is not inherited** and that
re-selecting the same runtime on fresh evidence is a legitimate outcome. **Approach C being settled reduces
what the runtime choice decides**, and that is worth stating plainly:

- The governed layer's requirements are **transactional, contract-bound, audit-heavy, security-critical** —
  the class of work WP-0001 delivered and verified live (229 tests, FORCE RLS, non-`BYPASSRLS` runtime role).
  **That evidence is about the kernel**, and EPA-0005 §2 is right that it is not a transferable credential;
  but it is directly relevant evidence about *this class of work on this platform*, which is a weaker and
  honest claim.
- The worker's requirements are **document extraction and model serving**, where §7's derived requirements
  (marked-content awareness, bidirectional reconstruction, producer-hazard detection) are the discriminating
  ones — and **which toolchain satisfies them is corpus-blocked** (§7.4).

**Neither is selected here.** The API framework question carries the least architectural weight of anything in
this record; ADR-0015's zero-framework posture is scoped to the kernel and does not reach this service.

---

## 6. Local inference — three workloads, evaluated (MSG-0098 item 3)

**All three execute locally.** ADR-0022 §1 — *"all inference and embedding computation for this capability
executes locally on the customer-controlled host. No policy content, no employee question, and no derived
embedding leaves the host."* §2 makes egress a **G10 gate failure demonstrated by a network-isolated run**,
not by configuration review. §3 forbids a fallback triggered by local unavailability — **a local outage must
produce abstention A7**. §6 requires models be acquired as **verified offline artifacts**, never runtime
downloads.

### 6.1 The three workloads and what each one's requirement actually is

| # | Workload | Required by | Derived requirement — beyond "local" |
|---|---|---|---|
| 1 | **Generation** | ADR-0022 §1 | **Arabic-capable**, evaluated against a **separate Arabic acceptance bar** never inherited from or aggregated with the English one (ADR-0019 §5). **Must not stream to the user** — see §6.3 |
| 2 | **Embedding** | ADR-0020 §7 (*"multilingual local embeddings"*) | **Multilingual**, and — see §6.2 — **its identity is part of the index's projection contract**, not merely a configuration value |
| 3 | **Entailment** (ADR-0017 §4's model-assisted layer) | ADR-0017 §4; ADR-0022 consequences (*"a second local model … Local-only applies to it too"*) | **Cross-language capable**, which is a materially stronger requirement than monolingual entailment — see §6.5 |

**Model selection for all three is explicitly outside this task**: ADR-0017 §7 and ADR-0022 §4 both forbid it,
and it proceeds under SPEC-0020 with per-language bars as the Architecture Lead's act. **Nothing is proposed
here.**

### 6.2 Finding 4 — the embedding model's identity belongs on the index, alongside the normalization version

EPA-0005 §7 established that **the normalization rule-set version must be recorded on the index**, so a
divergence between ingestion-time and query-time normalization is detectable rather than silent (ADR-0019 §6
calls such a divergence *"a correctness defect, not a tuning parameter"*).

**The same argument extends to the embedding model, and it has not been recorded anywhere.** An embedding
model applies its own internal tokenization and normalization. Two consequences:

- **Query and ingestion must use the same embedding model**, not merely the same normalization rules. Mixing
  vectors from two models yields distances that are meaningless rather than merely worse — and, exactly like
  the normalization divergence, **it degrades silently: retrieval returns plausible results, and nothing
  errors.**
- **Replacing the embedding model is a full reindex**, not a configuration change — which is affordable
  precisely because ADR-0020 §1 makes rebuild routine, and is a good example of that property earning its
  cost.

**Recommendation (§12), not a decision: record embedding-model identity on the index alongside the
normalization rule-set version, and treat a mismatch as a staleness condition under ADR-0020 §1 — which
already routes to abstention A7.** **This requires no ADR change**: ADR-0022 §4 already requires model and
runtime identity be recorded for every governed operation, and ADR-0020 §1 already defines the staleness
response. This is an implementation obligation derived from both, not a new rule.

### 6.3 The generation workload cannot stream — restated because it is product-visible

EPA-0005 §3.6 established it and it survives unchanged: **ADR-0017 §4's gate runs after generation and may
veto the entire response**, so a design that streams tokens to the employee as they are produced is
incompatible with the contract. The constraint belongs in the *product* conversation, not only the technical
one, and it is easier to accept before a frontend is built than after.

### 6.4 A count, derived — the critical path holds at least three model invocations

**This is arithmetic over the accepted documents, not a measurement, and it is stated as such.**

Answering one English question requires, at minimum:

1. **embed the question** — required by ADR-0020 §7's *semantic* half of hybrid retrieval;
2. **generate** — ADR-0017;
3. **entail** — ADR-0017 §4, which runs *after* generation and cannot be skipped or dropped under load.

**Three, sequentially, on the critical path.** An **Arabic answer grounded in English policy** adds ADR-0019
§4's cross-language grounding result, which must be *present and passing* — **at least one further
evaluation**, whose mechanism is not selected (ADR-0019 *Deliberately not decided here*).

**What follows structurally, with no figure attached:** the three models are **concurrent tenants of one
host**, and whether they can be co-resident or must be swapped in and out is the question PR6 answers. **If
they cannot be co-resident, model load time enters the critical path** — and ADR-0017 is explicit that the
gate *"cannot be dropped under load"*, so the pressure that creates has nowhere to go except latency or
abstention. **Which of those it is, is unmeasured and is not guessed here.** §11 records the measurement.

### 6.5 Finding 5 — the entailment workload is three evaluations, not one

ADR-0019 §5 requires every gate involving a question or a document to **run twice, once per language, both
passing**, with **no aggregation**. ADR-0019 §4 additionally requires grounding across the
**English-source / Arabic-answer** boundary. So the entailment layer must be evaluated as:

1. English claim against English evidence;
2. Arabic claim against Arabic evidence;
3. **Arabic claim against English evidence** — the cross-language case.

**Case 3 is the hard one and ADR-0019's consequences already say so**: G7 *"tests support across a
translation boundary — a materially harder claim than parity between two approved texts, and one with no
accepted PCI specification behind it."* ADR-0019 also supplies the acceptance heuristic that matters:
**a cross-language rejection rate near zero must be treated as suspicious rather than excellent**, because
the most likely cause is that the gate is not evaluating across the boundary at all.

**Evaluation consequence, offered for SPEC-0020 rather than decided here:** a model may clear cases 1 and 2
and fail case 3, so **an aggregate entailment score is not evidence for this capability** — which is exactly
what ADR-0019 §5's no-aggregation rule already requires, applied to the entailment model specifically.

### 6.6 Model serving — deliberately not narrowed, for the same reason EPA-0005 gave

SPEC-0008 and ADR-0003 name **Ollama** as a *possible* initial local runtime, and **ADR-0022 §4 is explicit
that it "does not select it or anything else."** EPA-0005 §6 declined to narrow it and this record takes the
same position for the same reason: recording a runtime identity in a PROPOSED document converts an accepted
non-decision into a de facto selection.

**One derived requirement does belong to the serving runtime and is recorded in §9.3: it must not log
prompts or completions by default**, because those carry policy passages.

---

## 7. Extraction and normalization (MSG-0098 item 4)

### 7.1 What three documents at n=1 actually established — and the pattern across them

A-SURVEY has run three times, on three documents, from **three different producers**, and produced **three
disjoint families of defect with no overlap at all** (MSG-0089 §6.1):

| Producer | Document | Defect family | Record |
|---|---|---|---|
| Word 2016 | English, 45pp, text-native | **Every glyph on page 1 drawn twice**, the second copy an `/Artifact`-tagged drop shadow → an extractor without marked-content scoping **doubles** the page carrying title, authorship and approval. `/Span <</Lang(...)>>` property dictionaries read as body text by a naive regex (1,865 spurious strings). **Page 23 yields 67 characters** — a vector flow chart | MSG-0084 §5 |
| ABBYY FineReader | Arabic, OCR-derived | **Rejected by D14** — 31 images, CCITTFax and DCTDecode, OCR producer string | MSG-0087 |
| WeasyPrint 68.0 | Arabic, text-native, **generated (Creator: ChatGPT)** | **Text stored in visual order, not logical order** — naive extraction returns every Arabic word reversed, proven by code-point comparison against the document's own `/Info /Title`. Kerning offsets in `TJ` arrays read as **intra-word spaces**. **Detached diacritics.** `/Lang` declares `en` on an Arabic body | MSG-0089 §4.4–§4.6 |

**The reusable finding is not any single defect. It is that all three fail silently.** None raises an error;
each produces confident, fluent, wrong output that no downstream component flags. That is the property a
grounding gate cannot repair, because the gate checks that a claim is entailed by the retrieved evidence —
and reversed or doubled evidence is still *evidence*.

### 7.2 Derived requirements on the extraction toolchain — from evidence, not preference

| # | Requirement | Derived from |
|---|---|---|
| 1 | **Marked-content aware.** The extractor must distinguish `/Artifact` from tagged body content, or it doubles decorated pages | MSG-0084 §5.1 |
| 2 | **Logical-order reconstruction.** Text order must be reconstructed, never taken from content-stream order. **Normalizing reversed text produces normalized nonsense** — this is upstream of every ADR-0019 §6 rule | MSG-0089 §4.4, §5.2 |
| 3 | **Token boundaries must not be inferred from extracted spacing** where kerning injects it | MSG-0089 §4.5 |
| 4 | **Declared language is a hint to be checked, never a routing decision.** Across three documents `/Lang` was correct once, absent once, and **wrong once** | MSG-0089 §4.6 |
| 5 | **Non-text-native detection and rejection** — the D14 rule, which is WP-0009 gate G2 | MSG-0056a D14; ADR-0018 *Deliberately not decided here* |
| 6 | **Low-yield-page detection** — see §7.3 | MSG-0084 §5.3; derived |

### 7.3 Finding 6 — the gap between D14 and the citation contract, and why it needs no new rule

**MSG-0084 §5.3 found a page that is text-native — so D14 never fires — and yields 67 characters, because
its content is a vector flow chart.** The content is real policy content; it is simply not extractable as
text.

**D14 does not catch it, and it does not need to.** The obligation is already carried by two accepted
documents read together:

- **ADR-0018 §1** requires chunk anchors that resolve to sections **a reader can open**;
- **ADR-0017 §3** — *"a citation the reader cannot open is a claim about a citation, not evidence."*

**So a page that ingests to near-nothing is an ingestion defect under accepted authority already**, and the
implementation obligation is a **low-yield-page detector** that surfaces it at ingestion rather than at
answer time. **No ADR change is required and none is proposed.** What is required is that T-B not treat
"D14 passed" as "the page ingested usefully" — which is the assumption the failure exploits.

**How large this problem is across a real corpus is UNKNOWN** and is one of the things a corpus-scale survey
would size (§11).

### 7.4 Toolchain classes — and why this one is genuinely corpus-blocked

| Class | Status |
|---|---|
| Native-format parsers exposing structure and marked content | Candidate — satisfies requirement 1 in principle |
| Layout-aware extractors | Candidate — relevant to requirements 2 and 3 |
| **OCR** | **Excluded by MSG-0056a D14** for ingestion. Not a candidate |

**Selection is blocked for a reason that is not going to resolve by thinking harder about it.** Extraction
hazards are **a property of the producing toolchain**, and MSG-0089 §6.1 records the decisive point: the
three surveyed documents came from three producers and produced three disjoint defect families. **Hardening
against WeasyPrint's hazards says little about what the organization's own authoring toolchain produces**,
and **the organization's producing toolchain is unknown.** MSG-0091 scoped the Arabic n=1 evidence as
sufficient for *bounded architecture testing* and **explicitly not as production corpus evidence**; that
scoping is respected here.

### 7.5 Normalization — architecture only, no rule proposed

**ADR-0019 §6 defers the rule set — alef and hamza forms, ta marbuta, tatweel, diacritics, Arabic-Indic
digits — to empirical corpus evidence, and MSG-0071 accepted the ADR on that condition. No rule is proposed
here, and none is inferred from the n=1 evidence.**

Three constraints are fixed by ADR-0019 §6 and are stack-relevant:

1. **raw authoritative text immutable** — normalization produces an index projection alongside it;
2. **ingestion-time and query-time normalization identical** — which in technology terms means **one
   implementation invoked by both paths, not two implementations that agree today**;
3. **the rule set versioned and recorded** — extended by §6.2 above to include the embedding model identity.

**One n=1 observation bears on the deferred rule set without proposing any part of it**, and is recorded as
evidence for whoever eventually writes it: MSG-0089 §4.5 found **detached diacritics**, so any rule that
strips or folds diacritics will behave differently on detached marks than on composed ones. **That is an
input to the decision, not the decision.**

---

## 8. Grounding validation (MSG-0098 item 4)

### 8.1 The shape is fixed and it constrains the technology

ADR-0017 §4: two layers, **both must run**, **after** generation; failure, unavailability, or timeout ⇒
**ABSTENTION**; the gate result, per-layer results, and gate mechanism version are recorded on every
response and in the audit record. *"A silently skipped entailment layer is a gate failure, not a degraded
pass."*

**Technology consequences, all derived:**

- the answer path is a **pipeline with a mandatory terminal stage that can veto the response** — this rules
  out any arrangement where generation returns to the caller (§6.3);
- **the gate mechanism version is response metadata**, so the gate is a versioned component, not a
  configuration setting;
- **the structural layer needs anchor resolution that does not depend on the index** — §8.2.

### 8.2 Finding 7 — index-assigned identifiers must never appear in a citation

**ADR-0020 §1 requires that a full index rebuild be a no-op with respect to answers**, and the index is
**deliberately excluded from the backup path**. ADR-0017 §3 requires a citation to resolve to *"document
identity, version identity, section path, effectivity, the language and authority role of the cited
passage, and a link the employee can open."*

**Put those together and a concrete prohibition falls out: if a citation embeds an identifier the index
assigned — a row id, a document id, a point id, a chunk ordinal generated at index time — then a rebuild
that reassigns identifiers invalidates every citation issued before it.** Previously issued answers would
carry links that resolve to the wrong passage or to nothing, which contradicts the no-op requirement
directly, and does so **silently** where identifiers are reused rather than merely reassigned.

**Therefore chunk anchors must be derived deterministically from kernel-side identity** — document version
identity plus section path — **and the structural layer must resolve them against the kernel, not against
the index.** This also keeps the structural layer working when the index is stale or being rebuilt, which is
the state ADR-0020 §1 explicitly contemplates.

**This needs no ADR change.** It is what ADR-0020 §1 and ADR-0017 §3 already require of any conforming
implementation; it is recorded because the convenient implementation — cite what the engine returned — is
the one that breaks it.

---

## 9. Storage separation and logging restrictions (MSG-0098 item 4)

### 9.1 Two stores, and one of them cannot be the audit store

**ADR-0021 §4** separates conversation storage from audit storage; **§2** restricts retained conversation
content to **the employee who asked** — *"not readable … by an ordinary administrator … including admin
surfaces, analytics, reporting, and support tooling"*; **§3** requires expiry to **actually delete** —
*"an expiry that only hides a record from a default view has not been honoured."*

**Finding 8 — the kernel's verified audit store is disqualified for conversation content, by the very
property that makes it good audit storage.** WP-0001 proved the audit store **append-only** under the
runtime role (AC-06, verified live). **Append-only and "expiry actually deletes" are incompatible.** So the
natural reuse — one governed, verified, append-only store for everything — **violates ADR-0021 §3, and
§2 and §4 alongside it**, and does so invisibly: the system behaves correctly in every observable way except
the one ADR-0021 exists to guarantee.

**Derived requirements on the conversation store**, none of which selects a technology:

| # | Requirement | From |
|---|---|---|
| 1 | **Enforceable per-subject read restriction** — enforced at the store, not only in application code, since §2 forbids readability *"through any interface"* including analytics and support tooling | ADR-0021 §2 |
| 2 | **Real deletion on expiry**, demonstrable as a claim about storage rather than about views | ADR-0021 §3 |
| 3 | **Not the audit store**, and not deleted by it or with it | ADR-0021 §4 |
| 4 | Minimized storage; abusive or meaningless queries create no indefinite retention | ADR-0021 §3 |

**Requirement 1 has a shape the platform already knows**: the kernel enforces tenant isolation at the data
layer with FORCE RLS and a runtime role that is neither `SUPERUSER` nor `BYPASSRLS` (ADR-0016, verified).
**The same *mechanism class* — data-layer enforcement keyed on the subject rather than the tenant — is what
requirement 1 asks for.** That is an observation about mechanism, **not a selection of a store**, and the
requirement is satisfiable other ways.

### 9.2 G13 cannot be discharged by tests alone, and that is a planning fact

ADR-0021 consequences: G13 is *"a negative claim across every interface"*. **A negative claim across an
open set of interfaces is not testable to exhaustion** — it requires a review of the surfaces as well as
tests against them. **The planning consequence is that every component added to the stack extends G13's
review surface**, which makes "add an analytics tool later" a governance event rather than an operational
one. That is worth knowing before the stack has five such components rather than after.

### 9.3 Finding 9 — the logging prohibition binds components, not just application code

**ADR-0020 §6.2 carries no authorization exception**: *"Restricted passages must not reach application logs,
telemetry, or ordinary audit payloads. Audit records the decision and the identifiers, not the content."*

**An implementer reads that as a rule about their own log statements. It is not — it binds every component
that can observe a passage**, and passages flow through several that log by default:

| Surface | How Restricted content reaches it | Consequence |
|---|---|---|
| **Index engine query and slow-query logs** | The query carries text; a Shape-3 engine additionally materializes *unauthorized* passages internally (§4.2) | **A selection criterion on the engine**: its logging must be controllable, and a Shape-3 engine can breach §6.2 through its own logs while the application logs nothing |
| **Model serving runtime prompt/completion logs** | The prompt *is* the retrieved passages | **A selection criterion on the serving runtime**: it must not log prompts or completions by default, and must be configurable to not log them at all |
| **Crash dumps, traces, and error reports** | A passage in a stack frame or an exception message | An operational requirement on the whole deployment, not a code review item |
| **Analytics and telemetry over questions** | ADR-0021 consequences already warn that aggregate reporting can re-identify an individual through a small cohort | Inherited by any telemetry component added later — §9.2 |

**None of this changes ADR-0020; it applies it.** The finding is that §6.2 is **a technology-selection
criterion as well as a coding rule**, and that it disqualifies components whose logging cannot be turned off
— which is not obvious from the ADR's placement inside a section about Restricted documents.

---

## 10. Rebuild, replaceability, and the capability boundaries (MSG-0098 item 4; "define interfaces")

### 10.1 Rebuild is ordinary, and that is a technology criterion

**ADR-0020 §1**: a full rebuild must be a **no-op with respect to answers**; a stale index beyond threshold
triggers **abstention A7, never a stale answer**; the index is **deliberately not in the backup path**.

**Derived criteria**, none of which selects an engine: rebuild must be a **routine, unattended, repeatable
operation** rather than an exceptional recovery procedure — an engine whose reindex is a multi-hour
hand-operated process is a poor fit for a design that treats rebuild as ordinary (EPA-0005 §3.4, unchanged);
**staleness must be observable**, because A7 is triggered by a threshold and a threshold needs a measurable
quantity; and §6.2's embedding-model identity plus the normalization rule-set version are **part of what
"stale" means**, not merely part of what is recorded.

### 10.2 Finding 10 — the retrieval port's signature is itself the control

**This is the single most actionable planning output in this record.**

SPEC-0013 requires indexing technology remain replaceable; ADR-0020 §7 says no index technology is selected.
So retrieval sits behind a port. **The port's *signature* decides whether AMD-01 can be violated at all:**

- a port typed as **`search(queryText, k) -> hits`** makes the conformant design *unrepresentable*. There is
  nowhere to put the authorization predicate, so every implementation behind it must post-filter. **The
  interface has mandated Shape 2.**
- a port typed as **`search(authorizationContext, queryText, k) -> hits`**, where the context is
  **required**, non-nullable, and carries the complete §3 predicate, makes the constrained call the **only**
  call available.

**Therefore: the retrieval port must take the authorization context as a required parameter, and must expose
no unconstrained search method at all** — including "internal", "admin", "debug" and "reindex verification"
variants, which are exactly where an unconstrained search reappears.

**The same argument applies at the Approach C seam** (§5.2, arrangement 2): a worker contract that permits an
unconstrained retrieval request has reintroduced Shape 2 at the service boundary, where it is harder to see
than in code.

### 10.3 Replaceability is real but bounded — and the bound should be stated

**SPEC-0013 and ADR-0020 §7 both require the index remain replaceable.** AMD-01 narrows what that means:
**replaceable by a *conformant* engine.** An engine that cannot express the §3 predicate in-query cannot sit
behind the §10.2 port at all — not as a degraded option, not as a development convenience.

**This is not a conflict with SPEC-0013 and needs no amendment.** Replaceability was never a promise that
any engine would do. It is recorded because "keep it replaceable" is often implemented as "keep the interface
generic", and here the correct move is the opposite: **the interface must be specific enough to make
non-conformance impossible to express.**

### 10.4 The capability boundaries, defined technology-free

MSG-0098 permits this task to **define interfaces**. These are capability boundaries, not APIs; no signature,
serialization, transport, or technology is prescribed, and defining them selects nothing.

| Port | Obligation it carries | Binding authority |
|---|---|---|
| **Retrieval** | Authorization context **required** on every call (§10.2); no unconstrained variant; returns kernel-derived anchors, never index-assigned identifiers (§8.2); reports staleness so A7 can fire | ADR-0020 §1, §3, §4+AMD-01; SPEC-0013 |
| **Inference** | Normalized local invocation; **model and runtime identity recorded per call**; no model identity in business logic; **no egress**; local unavailability surfaces as a condition the caller turns into **A7**, never a provider fallback | SPEC-0008; ADR-0003; ADR-0022 §1–§4 |
| **Extraction** | Yields text **plus structure plus openable section anchors**; rejects non-text-native input (D14/G2); surfaces low-yield pages (§7.3); reports detected language separately from declared language (§7.2 #4) | ADR-0018 §1, §8; MSG-0056a D14; MSG-0089 |
| **Normalization** | **One implementation, invoked by both ingestion and query**; raw text immutable; rule-set version exposed for recording on the index | ADR-0019 §6 |
| **Conversation store** | Per-subject read enforced at the store; expiry **deletes**; separate from audit (§9.1) | ADR-0021 §2, §3, §4 |
| **Audit sink** | Decision and identifiers, **not passage content**; no secrets; retention independent of conversation expiry | ADR-0021 §4; ADR-0009; SPEC-0006; ADR-0020 §6.2 |
| **Grounding gate** | Both layers run; versioned mechanism; failure/unavailability/timeout ⇒ **ABSTENTION**; per-layer results recorded | ADR-0017 §4 |

---

## 11. Missing evidence register (MSG-0098 item 5)

**Everything below is UNKNOWN or unmeasured. Nothing below has been estimated, illustrated, or filled in with
a typical value.**

| # | Missing | Current state | What would close it | Whose action |
|---|---|---|---|---|
| 1 | **Corpus scale, format mix, language prevalence** | **INSUFFICIENT at n=1** ×3 | A corpus-scale A-SURVEY over representative approved material | **Organization** (PR5) |
| 2 | **Scanned-document prevalence → D14 rejection exposure** | **Completely unmeasured** | Same | **Organization** |
| 3 | **The organization's own authoring toolchain**, and therefore which extraction hazards are real here | **UNKNOWN** — the three surveyed producers are Word 2016, ABBYY FineReader and WeasyPrint, and none is known to be the organization's (MSG-0089 §6.1) | Material produced the way the organization actually produces policy | **Organization** |
| 4 | **Classification and audience distribution** | **INSUFFICIENT** — the one real document surveyed carried **no classification marking of any kind** (MSG-0084) | Corpus-scale survey | **Organization** |
| 5 | **PR4 — a local inference runtime on the authorized host** | **NOT MET** | Operator provisioning | **Operator** |
| 6 | **PR6 — host capacity for three concurrent model workloads plus indexing** | **UNKNOWN and unmeasured** | A capacity measurement on the authorized host, against a corpus of known size | **Operator** + #1 |
| 7 | **Whether the three models can be co-resident, or must be swapped** (§6.4) | **UNKNOWN** — follows from #5 and #6 | Same measurement | **Operator** |
| 8 | **Any candidate engine's filter execution shape** (§4.1) | **UNKNOWN for every engine** — determinable only by §4.4 tier 2/3 evidence, which has not been run | Running the §4.4 probe against named candidates | Implementation task, **not authorized** |
| 9 | **Whether any candidate engine exposes plan or counter instrumentation** (§4.4 tier 3) | **UNKNOWN** | Same | Same |
| 10 | **Per-language acceptance bars for all three models**, including the cross-language entailment case (§6.5) | **Not established** — SPEC-0020's frame exists; the bar does not (ADR-0019 consequences) | SPEC-0020 evaluation | **Architecture Lead** |
| 11 | **Whether semantic retrieval earns its cost at this corpus's scale** | **UNKNOWN** — the *shape* is settled by ADR-0020 §7; the sizing is not | #1 plus an engine measurement | — |
| 12 | **Low-yield-page prevalence** (§7.3) | **UNKNOWN** — one instance observed in one document | Corpus-scale survey | **Organization** |

**Items 1–4 and 12 are the same organizational action** that MSG-0078, MSG-0084 and MSG-0089 have each
recorded as outstanding. **This record does not request it as a precondition to finishing** — MSG-0098
forbids that, and the work above was completed without it.

---

## 12. Recommendation, and what stays open (MSG-0098 item 6)

**MSG-0098 permits a bounded recommendation *or* an explicit statement that selection remains open. This
record does the second for every product-level choice, and the first for obligations that need no
measurement.**

### 12.1 Selection remains OPEN — every one of them

| Selection | Status | What would close it |
|---|---|---|
| Retrieval index engine | **OPEN** | §4.4 tier 2 and tier 3 evidence against named candidates, then corpus-scale sizing (§11 #1, #8, #9, #11) |
| C3 placement relative to the Approach C seam | **OPEN** | §5.2 — the three arrangements are all consistent; the choice is operational |
| Application runtime and API framework | **OPEN** | §5.3 — a program judgment about operability and team capability, which the operational-fit principle makes the customer's context to weigh |
| Extraction toolchain | **OPEN — corpus-blocked** | §11 #1, #3, #12 |
| Embedding, generation, entailment models | **OPEN — not this task's** | SPEC-0020, per-language bars; ADR-0017 §7, ADR-0022 §4; the Architecture Lead's |
| Local serving runtime | **OPEN — deliberately not narrowed** | §6.6; the Lead's, after the model decisions it must serve |
| Conversation and audit stores | **OPEN** | §9.1's four requirements applied to candidates |
| Frontend framework | **OPEN — low architectural weight, real accessibility weight** | RTL and accessibility evaluation; enforces nothing |
| Arabic normalization rule set | **DEFERRED BY ACCEPTED DECISION** | A-SURVEY at corpus scale, then an amendment to ADR-0019 (§7.5) |
| Identity provider | **NOT this task's** | T-0 — operator and organization |

### 12.2 What is recommended for recording as settled — criteria, not selections

**Each item below is a consequence of accepted documents, holds regardless of the corpus, and is offered as
a recommendation subject to the Lead's ruling. None selects anything. None requires an ADR change, and §14
says why for each.**

1. **Engine conformance needs its own evidence, distinct from G3** (§4.2, §4.4). G3's query-shape evidence
   is necessary and insufficient; tier 3 execution evidence is what discharges AMD-01's selection criterion.
   **An engine that exposes no plan or counter instrumentation cannot be cleared.**
2. **A strategy-switching engine is disqualified unless the strategy can be pinned** (§4.4 finding 3), and
   for class R the plan must be pinned and treated as security-relevant (finding 2).
3. **The retrieval port takes authorization context as a required parameter and exposes no unconstrained
   search** (§10.2) — including at the Approach C service seam.
4. **Citations carry kernel-derived anchors only; no index-assigned identifier ever appears in one** (§8.2).
5. **The embedding model's identity is recorded on the index alongside the normalization rule-set version,
   and a mismatch is a staleness condition** (§6.2).
6. **ADR-0020 §6.2 is a selection criterion on the index engine and the model serving runtime**, not only a
   coding rule (§9.3).
7. **The conversation store is not the audit store, and append-only storage is disqualified for conversation
   content** (§9.1).
8. **Extraction must reconstruct logical order, scope marked content, distrust `/Lang`, and surface
   low-yield pages** (§7.2, §7.3).

### 12.3 Should any of this become an ADR?

**Recommendation: no new ADR, and this record creates none.** MSG-0098 authorizes no ADR drafting, and
**every item in §12.2 is a consequence of an already-accepted ADR rather than a new decision** — which is
precisely the test EPA-0005 §9.3 applied when it recommended against a stack ADR, and the same answer holds
for the same reason.

**If the Lead judges any item at risk of being implemented away** — items 1, 3 and 4 are the candidates,
because each is violated by the *convenient* implementation rather than by a careless one — **the natural
response is the same one MSG-0092 chose last time: a narrow amendment to the ADR the rule already follows
from**, not a new record. That is the Lead's call and this record makes no amendment and proposes none.

---

## 13. Implementation planning — the decision sequence (MSG-0098, "implementation planning")

**Nothing here is authorized, nothing is marked READY, and no task identifier is allocated.** WP-0009 §6.3
already defines T-A…T-I and §6.1 defines T-0; this section only records **which decisions unblock which**,
because the dependency structure is not obvious and getting it wrong wastes the corpus survey.

| Order | Decision or evidence | Blocked by | Unblocks |
|---|---|---|---|
| 1 | **Corpus-scale A-SURVEY** (§11 #1–#4, #12) | Organization supplying representative material | Extraction toolchain; the ADR-0019 §6 rule set; D14 exposure; index sizing |
| 2 | **PR4 + PR6 measurement** (§11 #5–#7) | Operator | Whether the three models are co-resident; the answer-path latency shape |
| 3 | **Engine conformance probe** (§4.4) against named candidates | Nothing external — it needs a decision to *name* candidates, not new evidence | The engine shortlist. **This is the only major item on this list that is not blocked on the organization or the operator** |
| 4 | Engine selection | 1 (sizing), 3 (conformance) | T-C |
| 5 | Model selections under SPEC-0020, per-language bars incl. cross-language entailment | 1 (real text), 2 (capacity) | T-C, T-D, T-F |
| 6 | ADR-0019 amendment with the empirical normalization rule set | 1 | T-B |

**The one observation worth carrying out of this table:** item 3 is the only substantial piece of evidence in
this whole evaluation that is **not** blocked on an external party. Everything else waits on the
organization or the operator. **Whether to run it is the Architecture Lead's to authorize** — it is named
here as a sequencing observation and is explicitly **not** proposed as a task, marked READY, or
self-authorized.

---

## 14. What this record does not do — item by item

- **It selects, adopts, or shortlists no engine, store, model, serving runtime, application runtime,
  framework, library, or provider.**
- **It modifies no accepted ADR**, and `git diff --name-only docs/decisions/` is empty at completion.
- **It proposes no ADR and no amendment**, and creates neither (§12.3).
- **It marks no task READY**, allocates no task identifier, and authorizes no implementation. T-0 and
  T-A…T-I remain unauthorized.
- **It invents no Arabic normalization rule** (§7.5) and leaves **ADR-0019 untouched**.
- **It contains no benchmark, capacity figure, latency, memory, recall, or corpus-scale finding** (§2.1), and
  substitutes no estimate for one.
- **It requests no new corpus or provider authorization as a precondition**; §11 records the need and the
  work was completed without it.
- **Each finding that could look like a policy change is not one**, and here is why for each:
  §3.2 (RLS does not reach an external index) — ADR-0020 §3.3 describes the data layer and never claims the
  index inherits it. §4.2 (G3 evidence ≠ engine clearance) — AMD-01 states both obligations; this observes
  that one does not discharge the other. §6.2 (embedding identity on the index) — ADR-0022 §4 already
  requires recorded model identity; ADR-0020 §1 already defines the staleness response. §7.3 (low-yield
  pages) — ADR-0018 §1 and ADR-0017 §3 already require openable citations. §8.2 (no index-assigned ids in
  citations) — ADR-0020 §1's rebuild-is-a-no-op already requires it. §9.1 (append-only disqualified for
  conversation) — ADR-0021 §3 already requires expiry to delete. §9.3 (logging binds components) —
  ADR-0020 §6.2 already carries no authorization exception. §10.3 (bounded replaceability) — SPEC-0013 never
  promised any engine would do.
- **It carries no authority.** It is **PROPOSED**, in a directory whose README states that records here are
  proposals awaiting a ruling.

---

## 15. Items referred to the Architecture Lead — none blocking

1. **"One projection index" — one projection or one engine?** (§4.5). The reading decides whether a lexical
   engine paired with a vector engine is permitted. **Not settled here**, because settling it would fix the
   meaning of an accepted ADR by implication. **Under either reading AMD-01 binds each retriever
   independently**, and the fusion step must not be where authorization is resolved.
2. **Whether the projection should retain SUPERSEDED chunks at all** (§3.1). Excluding them removes a
   predicate rather than implementing one; retaining them adds an in-query constraint that must be
   pre-constrained like the others. Both are consistent with ADR-0018 §2 and ADR-0020 §1. Recorded as an
   observation for T-C.
3. **Whether the engine conformance probe (§4.4) should be run** (§13 item 3). It is the only significant
   evidence in this evaluation not blocked on the organization or the operator. **Not proposed as a task and
   not self-authorized.**
4. **Whether any §12.2 item warrants recording as accepted authority** (§12.3). This record recommends no new
   ADR and creates none; if the Lead judges items 1, 3 or 4 at risk, a narrow amendment to the ADR each
   already follows from is the shape MSG-0092 chose before.
5. **The corpus action is unchanged and is still the organization's** — representative approved material,
   **plural**, produced the way the organization actually produces policy. It has now been recorded as
   outstanding by MSG-0078, MSG-0084, MSG-0089 and this record.

---

## 16. Traceability

| Element | Authority |
|---|---|
| This task's mandate, its six required outputs, and "evaluate, do not select" | **MSG-0098**; queue §TASK-0032; MSG-0099 |
| Approach C; the worker is not an authorization authority; the three settled constraints | **MSG-0092**; **EPA-0005** §9.1 (ACCEPTED) |
| Pre-constrained retrieval as an **engine-selection criterion**; over-fetch-then-discard disqualified at any layer; **G3 evidenced against the query issued** | **ADR-0020 §4 as amended by AMD-01** (MSG-0095; applied by TASK-0031, MSG-0097) |
| Index is a projection; rebuild is a no-op; stale ⇒ A7; excluded from backup; four enforcement points; no index technology selected | **ADR-0020** §1, §3, §7 |
| Restricted eligible under conditions; **no authorization exception for logs** | **ADR-0020** §6 |
| Denial fails closed; existence, content, **timing and result-count** channels named | **ADR-0020** §5; **ADR-0021** §5; SPEC-0010; SPEC-0013 |
| Lifecycle, PUBLISHED-only indexing, SUPERSEDED retained-not-answerable, effectivity at answer time, section anchors | **ADR-0018** §1, §2, §4, §8; MSG-0056a D11 |
| Grounded answer contract; layered gate after generation; fail closed; citations name versions and must be openable; entailment model not selected | **ADR-0017** §3, §4, §7 |
| English authoritative; cross-language gate fail-closed with **no English fallback**; **per-language bars, never aggregated**; normalization obligation with the rule set **deferred** | **ADR-0019** §1, §3, §4, §5, §6 |
| Local-only inference and embeddings; egress fails G10; no failover; offline model artifacts; recorded model/runtime identity; nothing selected | **ADR-0022** §1–§6 |
| Conversation/audit separation; employee-only read; expiry **deletes**; G13 a negative claim across every interface | **ADR-0021** §2, §3, §4 |
| Tenant isolation, FORCE RLS, non-`BYPASSRLS` runtime role, 404 over 403 — reused unchanged, and **not extended to an external index** | **ADR-0016**; WP-0001 verified evidence |
| Append-only audit store, proven live | WP-0001 AC-06 (verified) |
| Identity terminates at OIDC/OAuth2; no LDAP/Kerberos | **ADR-0007**; MSG-0058 F3; EPA-0005 §3.2 |
| Text-native only; scans rejected | MSG-0056a **D14**; WP-0009 G2 |
| Selection principles; no accidental architectural requirement; **operational fit** | `docs/architecture/technology-selection-principles.md` |
| Extraction hazards at n=1 — doubled glyphs, OCR rejection, **visual-order Arabic**, kerning spacing, detached diacritics, wrong `/Lang` | **MSG-0084** §5; **MSG-0087**; **MSG-0089** §4 |
| Arabic n=1 sufficient for bounded architecture testing, **not** production corpus evidence | **MSG-0091** |
| PR4 NOT MET; PR5 the organization's; PR6 UNKNOWN | **WP-0009** §6.1, §8; ADR-0022 consequences; EPA-0004 §11.5 |
| `/data/docker` boundary; offline deployment and verified artifacts | Bootstrap contract v0.2; MSG-0006; SPEC-0026; ADR-0005; ADR-0014 |
| Component decomposition and answer path | EPA-0001 §4 (PROPOSED — read as description, not authority) |
| **Strict Shape-1 — "examines nothing unauthorized"; the materialization-only reading REJECTED; existing evidence not to be relabelled; criterion/probe-spec update authorized as an evidence instrument, not an ADR amendment** | **MSG-0105** §1–§5 (DECIDED); queue §TASK-0034; MSG-0106 (reconciliation) |
| **The measured behaviour §4.6 is written against** — unauthorized rows examined growing linearly with the collection while results stay indistinguishable from a conforming engine's; the FTS5 stage NOT MEASURED; instrument counts position-dependent; the negative control passing at `M=50` and failing at `M=500`/`M=5000` | **MSG-0104** §4.2, §5.2, §5.3, §6.1, §6.2 (TASK-0033 probe evidence) |
| **"One projection index" means one *logical* projection; both halves bind independently; the fusion layer never resolves authorization** | **MSG-0101** §1(1) |
| Verdict vocabulary — CLEARED / DISQUALIFIED / **NOT CLEARED**, and absence of evidence is never conformance | **MSG-0101** §2; applied by **MSG-0104** §7 |
