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

> **Three further clearance conditions were added 2026-08-23 by TASK-0036 (MSG-0110), and this table
> is unchanged by them.** §4.9 states **how E3 is discharged for an opaque stage** — by execution
> evidence, **never by construction** (**G-Q6**) — and adds two prerequisites this table does not
> carry: **G-Q4**, that partition routing be computed from the subject's entitlements and be itself
> measured, and **G-Q5**, that a temporally materialised structure demonstrate **both** a bounded
> re-materialisation interval **and** a working ADR-0020 §3 point-2 kernel re-check. **All three are
> necessary and none is sufficient** — E1–E4 above remain the clearance bar.

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

> **Added 2026-08-24 by TASK-0040 (MSG-0125), encoding the Architecture Lead's Q12 ruling
> (MSG-0124). Additive and declared: the three numbered requirements above are reproduced unchanged —
> no sentence of S7, or of any other section, is deleted or reworded — and no verdict recorded
> anywhere in this record changes.** S7 as it stood said **how** placements are reported and **never
> which placements must be attempted**; §4.12's Q12 referral names that gap in those words. **S7.1–S7.4
> below close it.** They **weaken nothing**: E2, strict Shape-1, `U = 0`, E1–E4, G-Q4, and the Q8, Q10
> and Q11 rulings are untouched, **no numeric tolerance or threshold is introduced**, and **no engine,
> runtime, provider, model or index technology is selected.**

##### S7.1 — The ruling, quoted rather than paraphrased

> When the engine exposes a reachable index-cursor placement, the probe must exercise that placement
> in addition to other applicable placements and report the maximum observed result. A row-access-only
> `U = 0` is not sufficient to satisfy E2 when an index-cursor placement exists but has not been
> exercised.
>
> — **MSG-0124**, Q12 decision

**This is a criterion decision, not an engine selection and not an implementation authorization**
(MSG-0124). Its stated consequences are part of the ruling and are quoted with it: *"The existing
strict Shape-1 / E2 bar is not relaxed"*; *"A probe that omits a reachable index-cursor placement
cannot clear a candidate on the basis of row-access-only `U = 0`"*; *"Existing MSG-0123 verdicts are
unchanged: K7 and K8 remain NOT CLEARED."*

**Why the rule is worth a gate rather than a caution.** A row-access counter can read **zero** while
an index cursor is walking entries the subject may not see. §4.12 gap 2 demonstrated it at opcode
level on this record's own test subject: an entry failing the residual is rejected **from the index**
and the table row is **never read**, so a counter placed at row access *cannot fire for it*. **S5
predicted this — a zero count proves only that nothing crossed the point where the instrument sits.**
S7.1–S7.4 make the **omission itself** disqualifying rather than something a diligent probe happens to
notice.

##### S7.2 — The three requirements, stated so a probe can be failed against them

| | Requirement | What discharges it | What fails it |
|---|---|---|---|
| **S7-R1** | **Every reachable index-cursor placement the test subject exposes must be exercised**, *in addition to* the other applicable placements — never instead of them | The probe **runs** each such placement and reports its count. Exercised means **executed and captured**, on the same fixtures and at the same collection sizes as the other placements | A placement that is reachable and was not exercised. **Naming a placement, describing it, or arguing what it would have shown is not exercising it** — §4.9 G-Q6's rule that execution evidence is never replaced by construction applies here in the same terms |
| **S7-R2** | **The candidate's reported `U` is the MAXIMUM observed across the exercised applicable placements**, and remains a **lower bound** on units examined (unchanged from S7 item 2) | The probe records every placement's count, states which is the maximum, and reports **that** figure as `U` | Reporting a count from one placement as the candidate's `U` while a higher count was observed at another; or reporting a mean, a median, a preferred placement, or a count taken at a placement chosen after the numbers were seen |
| **S7-R3** | **Row-access-only `U = 0` is INSUFFICIENT for E2 where a reachable index-cursor placement exists and was not exercised.** The insufficiency is **disqualifying**: **E2 is NOT satisfied**, and by S6 the candidate is **NOT CLEARED** | Nothing discharges R3 except **exercising the placement** and reporting the maximum under R2 | Any argument that the row-access zero "would have been" matched at the index cursor. **A row-access zero does not prove an index-cursor zero, and this specification does not permit that inference to be drawn or recorded** (MSG-0125) |

**None of R1–R3 introduces a threshold, a tolerance, or a count.** They say *which placements must be
attempted* and *which number is reported*. **The bar remains `U = 0` at every measured collection
size, invariant with `N`, with E1 + E2 + E3 + E4 all obtained** (S6, S9).

##### S7.3 — "Reachable", and the one way a probe may report that no such placement exists

**Reachable** means: **a placement an instrument can actually occupy through the test subject's own
API, runtime or configuration, as exercised.** Reachability is established **by taking the placement**,
not by reading documentation about it.

**A probe may report that no index-cursor placement is reachable — but only by enumeration, never by
assertion.** The enumeration must name what was checked and what it returned: the API surface actually
exposed, the build's compiled-in options, and any instrument that was tried and found inert. **§4.12
gap 1 is the worked example of the required standard**, including its control: the subject silently
ignores an unrecognised pragma, so a probe there ran **a pragma that certainly does not exist** and
required every tracing pragma to behave differently from it before believing any of them. **Without
such a control, "the instrument reported nothing" and "the instrument was never running" are the same
observation.**

**Unreachability is not relief, and it is not a pass.** Where no index-cursor placement is reachable:

- the count obtained at whatever placements *were* reachable is still a **lower bound** (S5), and a
  zero is still **inconclusive**;
- **E1 is still required** and still carries the traversal-extent question that counters cannot answer;
- **S10 may bite** — an engine that cannot be observed fails the burden AMD-01 places on it, *"regardless
  of what its documentation asserts"*.

**What a probe must record for E2, in every case:** the placements attempted; the count at each; which
is the maximum and therefore the reported `U`; and **the set of reachable-but-unexercised placements —
which must be empty.** A non-empty set is E2 **not satisfied**, however clean the row-access figure
looks.

##### S7.4 — What this does NOT change, stated item by item

- **No verdict recorded in this document changes.** TASK-0033, TASK-0035, TASK-0037, TASK-0038 and
  TASK-0039 stand exactly as measured; **none was re-run for this update**, and re-running one to make
  the criterion fit is forbidden (MSG-0125).
- **TASK-0038's recorded `U = 0` for K8 remains correct as a row-access count.** §4.12 already says so,
  and this section does not relabel it. What R3 forbids is **reading such a figure as satisfying E2**
  when a reachable index-cursor placement was not exercised — which is the reading §4.12 also declined
  to take.
- **K7 and K8 remain NOT CLEARED** (MSG-0123, §4.12); **K3 and K4 remain NOT CLEARED** under MSG-0119's
  strict Q11 reading. **Five probes have cleared nothing, and nothing here clears anything.**
- **No ADR is amended, proposed, or affected.** This is an evidence-instrument change, on the mechanism
  TASK-0034 and TASK-0036 established.
- **G-Q4.4 is not modified.** It already counts routing-phase units *"at the placement rules of S7"*; that
  existing reference now reaches R1–R3 like every other, which is a consequence of the cross-reference
  rather than a new requirement placed on the gate.
- **No implementation task is authorized or marked READY**, and **no next evidence action is started** —
  MSG-0125 requires the next one to be separately authorized.

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

> **Question numbering, recorded 2026-08-23 by TASK-0036 so the sequence is not restarted.** This
> section holds **Q1–Q3** and they are **still open**. **Q4, Q5 and Q6** were raised by MSG-0109 §9
> and **have since been RULED by MSG-0110** — they are encoded as clearance gates in **§4.9**, not
> here. **Q7**, the *numeric* staleness bound, is raised in **§4.9** and is open. **The next free
> number is Q8.** This note changes none of the three questions below; **Q2 in particular remains
> open** — TASK-0035 produced evidence for it (§4.8) and MSG-0110 did not rule it.

#### Q1 — Does "examine" reach index metadata, or only passage content?

> **Q1 is RULED by MSG-0134 — A: the strict reading.** Note added 2026-08-24 by an interactive COMMS
> session; **additive, nothing below deleted or reworded**, so the narrower reading stays visible as
> the reading that was rejected. **Reading an unauthorized index entry, key or metadata is examination**
> even when no passage content is touched; **U1–U5 as §4.6 S4 defines them remain authoritative**, and
> **U1 stays in scope**. **A candidate cannot satisfy E2 by arguing unauthorized metadata was harmless.**
> Ruling text in MSG-0134; **deliberately not restated here.**

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

> **Q2 is RULED by MSG-0135 — B: physical isolation is required where necessary.** Note added
> 2026-08-24 by an interactive COMMS session; **additive, nothing below deleted or reworded.**
> Query-time predicates alone are **insufficient where the engine must examine unauthorized candidates
> before applying them**; the governed projection must be **physically organized/partitioned as
> necessary**. **The logical-projection / physical-organization distinction is preserved** — multiple
> physical structures may constitute **one logical projection**. Ruling text in MSG-0135;
> **deliberately not restated here.**

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

> **Q3 HAS SINCE BEEN RULED, and this question is otherwise unchanged.** Note added 2026-08-24 by
> **TASK-0041** under **MSG-0130**; **additive — nothing below is deleted or reworded, and the heading
> is left as TASK-0034 wrote it** so the referral reads as it did when made. **MSG-0129 takes the third
> of the three branches named below — *reconsider the retrieval topology*** — and the response is
> worked out in **§4.13**, which is where it must be read from. **It is deliberately not restated
> here**; two statements of one answer invite drift, which is the convention §4.12's Q12 note
> established. **Q1 and Q2 above are NOT ruled by MSG-0129 and remain open.** **No verdict changes:
> the project stays NOT CLEARED for retrieval-engine selection**, and MSG-0129 says so in terms —
> *"Failure of all tested candidates … is not authority to weaken AMD-01 or strict Shape-1."*

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

> **I5's status has since changed and the row above is left as TASK-0035 wrote it.** Note added
> 2026-08-24 by **TASK-0042** under **MSG-0137**; **additive — nothing above is deleted or reworded**,
> so the catalogue reads as the probe that measured I0–I6 left it. **I5 was MEASURED by TASK-0042 and
> is NOT CLEARED**; the measurement, and the parts of I5 that remain NEVER MEASURED with their exact
> limitations, are in **§4.14**, which is where they must be read from. **They are deliberately not
> restated here** — two statements of one result invite drift. **No verdict in this section changes.**

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

### 4.9 Three clearance gates: routing, temporal materialisation, opaque-stage confinement (TASK-0036, MSG-0110)

**Added 2026-08-23 by TASK-0036. Additive and declared: nothing in §4.1–§4.8 is deleted or
reworded, and no verdict changes.** This section converts the Architecture Lead's rulings on
**Q4**, **Q5** and **Q6** — MSG-0109's three referrals — into **explicit, testable clearance
requirements**. Authority: **MSG-0110 §2–§6**.

**This is an evidence instrument, not policy.** It **amends no ADR**, weakens nothing, invents no
threshold, and **selects, adopts, recommends, installs and deploys no engine.** MSG-0110 §5 is
explicit that no candidate is cleared by the ruling and that *"no engine, runtime, provider, model,
index technology, or physical implementation is selected."*

**All three rulings are fail-closed, and all three are NECESSARY conditions, never sufficient ones.**
Passing a gate below moves a candidate no closer to CLEARED on its own. **§4.6 S6 still governs
clearance**: E1 + E2 + E3 + E4 all obtained, `U = 0` at every measured collection size, invariant
with `N`. The gates here are additional hurdles placed in front of that bar, not alternative routes
to it.

#### G-Q4 — partition routing must be computed, and routing itself is measured

> Partition routing must be computed from the requesting subject's own entitlements. It must not
> discover partitions by enumerating a catalogue of structures whose identifiers or metadata may
> encode authorization attributes belonging to other subjects.
>
> For strict Shape-1, partition selection itself must not become an unauthorized examination step.
> The logical/physical distinction remains unchanged: this does not require one physical index or
> store.
>
> — **MSG-0110 §2**

**Why this gate is easy to omit, and worth saying before the requirements:** routing *feels* like a
step that happens **before** retrieval, so a specification that measures "the query" naturally starts
counting after the structures have been chosen. **MSG-0110 §2 closes that gap by making selection
part of what must not examine.** §4.6 S4 already counts every unit the engine touches *"while
resolving the query"*, and **choosing which structures to open is part of resolving it.**

**What must be shown — all four:**

| | Requirement | Evidence that counts |
|---|---|---|
| **G-Q4.1** | **The routed set is a function of the subject's entitlements alone.** Its inputs are the requesting subject's entitlement set and the query parameters — and nothing else | The routing step's actual inputs, exhibited: a trace, a call record, or an execution log showing the derivation. **A description of the intended function is not the function** — Q6's rule applies here too |
| **G-Q4.2** | **The routed set does not vary with collection contents.** Adding, removing or repopulating structures belonging to other subjects changes neither the set of structures opened nor the number of units read during routing | **A differential test.** Run the same subject and query against collections that differ **only** in other subjects' partitions. Identical routed set, identical routing-phase read count. **A difference is decisive failure** |
| **G-Q4.3** | **No catalogue enumeration.** The engine does not scan, list, or range-read a catalogue, system table, directory, alias map, or manifest of structures in order to decide which to open | **E1-class evidence** — plan, explain output, or engine trace — covering the **routing phase**, not only the retrieval phase. A plan showing a scan over a structure catalogue is **disqualifying on the same reasoning §4.6 S6/E1 applies to a data scan** |
| **G-Q4.4** | **Routing-phase units are counted in `U`.** Any unit read while selecting structures is subject to §4.6 S4 and is included in the candidate's `U`, at the placement rules of S7 | Counters instrumented **at the routing step specifically**, with placement recorded. A probe that instruments only the retrieval step has **not measured this gate** and must say so |

**What falsifies it.** Any one of: a routing decision that reads a catalogue row describing a
structure the subject is not entitled to; a routed set that changes when only other subjects'
partitions change; a routing implementation that first opens a structure and then decides whether it
was the right one; or an engine that exposes no observability over its routing phase at all.

**Not demonstrated yields NOT CLEARED** — never assumed conformance, and never a pass by default
(§4.6 S9).

> **A design consequence worth stating, because it is where this gate bites in practice.** A partition
> **naming scheme** that encodes authorization attributes — the `p_org_a_internal_published` form
> TASK-0035's own probe used (§4.8; MSG-0109 §5.2) — turns the engine's structure catalogue into a
> **directory of other subjects' authorization attributes**. Under G-Q4 the *name* must be **computed**
> from the requesting subject's entitlements and resolved by **exact key**; it must not be **found** by
> scanning that catalogue for names that look applicable. **The two implementations are behaviourally
> identical and only one satisfies the gate**, which is precisely why G-Q4.3 demands plan or trace
> evidence rather than a description.

> **One boundary this gate does NOT cross, stated so it cannot drift.** MSG-0110 §2 keeps the
> logical/physical distinction unchanged, and so does this gate: **it does not require one physical
> index or one physical store**, and **MSG-0101 §1(1) is not reinterpreted** — *"one projection index"*
> still means one **logical** projection (§4.5, §4.8).

> **An open interaction, surfaced and NOT decided.** Whether an **exact-key catalogue lookup** of an
> already-computed structure name is itself an examination depends on §4.7 **Q1** — whether *"examine"*
> reaches metadata — which is unruled. MSG-0109 §9 Q4 records that the two questions are related but
> distinct: Q1 concerns index entries describing **chunks**, this concerns identifiers describing
> **structures**. **Until Q1 is ruled the criterion takes its stated fail-closed default** (§4.7 Q1,
> §4.6 S4): the strict reading, and a routing read of a catalogue entry describing a structure the
> subject is not entitled to **counts**. **That default can only withhold clearance, never grant it**,
> so the gate is operable now.
>
> **Q1 has since been RULED A — the strict reading (MSG-0134).** Note added 2026-08-24 by an
> interactive COMMS session; **additive, nothing above deleted or reworded.** **The fail-closed default
> this paragraph names is therefore now the ruling**, and a routing read of a catalogue entry describing
> a structure the subject is not entitled to **counts**, exactly as stated. **What is deliberately not
> claimed here is that MSG-0134 settles the structure-identifier variant.** MSG-0134 rules on index
> entries, keys and metadata; MSG-0109 §9 Q4 records that this question — identifiers describing
> **structures** rather than **chunks** — is *"related but distinct"*. **The practical position is
> unchanged either way: the strict reading applies, and it can only withhold clearance, never grant
> it.** Referred in MSG-0139 §4.
>
> **The quantity this interaction turns on has since been MEASURED to be UNOBSERVABLE here.** Note
> added 2026-08-24 by **TASK-0042** under **MSG-0137**; **additive, nothing above deleted or
> reworded.** **§4.14 finding 3** records it: an **explicit** catalogue read is measurable and was
> measured — the catalogue-scanning routing mechanism read **320** entries naming other subjects'
> structures — while **implicit schema resolution is NEVER MEASURED**, because `node:sqlite` binds no
> hook below statement compilation and `SQLITE_ENABLE_STMT_SCANSTATUS` is **ABSENT** from this build.
> **This still decides nothing about the interaction**, and it is not offered as an argument for
> either reading. It records that **the quantity the question asks about cannot be observed on the
> only reachable test subject** — which is a fact a ruling will need whichever way it goes.

#### G-Q5 — temporal materialisation requires BOTH conditions, and one of them is only testable structurally

> A temporally materialised structure is NOT CLEARED unless **both** conditions are demonstrated:
>
> 1. its re-materialisation interval is bounded in accordance with the already-accepted staleness
>    discipline in ADR-0020 §1; **and**
> 2. the ADR-0020 §3.2 post-retrieval re-check against the kernel is demonstrated to run.
>
> The TASK-0035 staleness evidence is decisive against clearing a stale materialisation: after the
> clock moved, the design examined unauthorized rows and returned 5 of 5 unauthorized rows. No
> relaxation or new tolerance is authorized. This ruling does not invent a new numeric staleness
> threshold; the existing ADR-0020 threshold remains authoritative.
>
> — **MSG-0110 §3**

**The conjunction is the gate. A specification that clears an I4 design on either condition alone is
wrong**, and would silently restore the failure §4.8 measured — `U` = 5/50/500 **and 5 of 5
unauthorized rows returned.** Condition 1 bounds *how long* the structure may be wrong; condition 2
catches a hit that is wrong *anyway*. **Neither substitutes for the other**, because a bound that has
not yet elapsed does not make the materialisation correct, and a re-check that runs does not make an
unbounded staleness window acceptable.

**Applies to:** any design using pattern **I4** (temporal materialisation), and to any other design
whose partition invariant is **true only as of an instant** rather than by construction. §4.8's
refinement rule identifies these: **effectivity-at-answer-time does not refine without fixing a
time**, and *"that refinement decays from the instant onward."*

##### Condition 1 — bounded re-materialisation. **This gate is STRUCTURAL, not numeric.**

**Stated plainly, because MSG-0111 §4 required this task to say which of the two it tests:** the
accepted architecture **names** a staleness threshold and **deliberately declines to fix its value.**

- **ADR-0020 §1** — *"a stale index beyond threshold triggers abstention (A7), never a stale answer"*.
- **ADR-0020, *Deliberately not decided here*** — *"**The staleness threshold that triggers A7** — an
  operational parameter, tuned with real evidence."*

**Verified by TASK-0036, not assumed:** a case-insensitive search for `stale` across the whole
authoritative `docs/` tree returns those two lines as the only ones bearing on the bound, and **no
numeric value is fixed anywhere in the accepted set.**

**Consequence: condition 1 is testable structurally — that a bound exists, is enforced, and its
breach triggers abstention — and it is NOT testable numerically.** The two are materially different
gates: the first asks whether the mechanism is present, the second whether the window is short
enough. **Only the first is available**, and **choosing a number would invent the tolerance MSG-0110
§3 forbids.** The numeric gap is referred to the Architecture Lead as **Q7** below.

| | Requirement | Evidence that counts |
|---|---|---|
| **G-Q5.1a** | **A bound exists and has a configured value** | The configured value, exhibited. **Its magnitude is not judged by this gate** — no value passes or fails here |
| **G-Q5.1b** | **The bound is enforced against a clock the candidate does not control** | Staleness computed from a trusted time source and the materialisation instant; not from the materialised structure's own contents |
| **G-Q5.1c** | **Breach triggers abstention A7, never a degraded answer** | **A behavioural test.** Advance the clock past the bound and issue the query. **Abstention A7 is the only passing outcome.** An answer returned — of any quality, with any warning attached — **fails** |
| **G-Q5.1d** | **Every `U = 0` measurement records its materialisation instant** | §4.8 finding 3: *"`U = 0` for a materialised structure is a property of an instant, not of a design."* A zero reported without the instant it was taken at **is not interpretable and does not count** |

##### Condition 2 — the post-retrieval kernel re-check, demonstrated to run

**ADR-0020 §3 enforcement point 2**, quoted: *"**Post-retrieval re-check** — every hit is
re-authorized against its version's classification and audience before entering evidence selection."*

> **A label note, so a reader does not go looking for a heading that does not exist.** MSG-0110 §3 and
> MSG-0111 cite this as **"§3.2"**. ADR-0020 §3 is a numbered list, not a subsectioned one: **"§3.2"
> means §3's second enumerated enforcement point**, quoted above. The anchor is real and was verified
> in the accepted, promoted copy.

| | Requirement | Evidence that counts |
|---|---|---|
| **G-Q5.2a** | **The re-check runs on every hit** — not sampled, not cached, not skipped when the materialisation is believed fresh | Execution evidence that it executed for each hit in the result set |
| **G-Q5.2b** | **It re-authorizes against the KERNEL**, which is the truth, and not against the materialised structure's own columns | **This is the limb most easily faked and it is the one that matters.** A "re-check" reading the stale copy's own attributes **re-checks the stale data against itself and is a no-op** — it would have passed every row of TASK-0035's P4S while that design returned 5 of 5 unauthorized rows |
| **G-Q5.2c** | **It is demonstrated to REJECT, not merely to execute** | **An adversarial test.** Materialise; change the authorization facts in the kernel so a materialised hit becomes unauthorized; query. **The hit must be rejected.** §4.6 S5's asymmetry applies directly: a re-check observed running but never observed rejecting has demonstrated **that it runs**, not **that it works** |

**What falsifies G-Q5 as a whole.** Any of: no bound configured; a bound not enforced; a stale query
answered rather than abstained; a re-check that reads the materialised copy rather than the kernel; a
re-check never demonstrated to reject; or a `U = 0` claim carrying no materialisation instant.

**Not demonstrated yields NOT CLEARED.** And satisfying **both** conditions still yields **NOT
CLEARED** unless §4.6 S6's E1–E4 are independently obtained — **G-Q5 is a prerequisite, not a
clearance.**

> **Forward reference added 2026-08-23 by TASK-0037, changing nothing above.** **MSG-0113 adds a
> second, independent requirement on temporally materialised structures** — **version-transition
> freshness**, encoded as **G-Q7** in **§4.10** — and **G-Q5.2b/G-Q5.2c are now demonstrated rather
> than predicted** (MSG-0115 §6 F3). **The sentence immediately above is no longer only a
> statement of principle:** a design has since met **both** G-Q5 conditions **and** every G-Q7
> requirement, and is **NOT CLEARED** on E2 and E4. **A bounded, correctly re-checking materialisation
> is still not a cleared one.**

#### G-Q6 — opaque-stage confinement requires execution evidence; construction alone is rejected

> **Ruling: REJECT the proposed default that construction alone can satisfy E3.**
>
> Structural confinement alone is not sufficient E3 evidence for an opaque/unmeasurable stage. It may
> contribute to the evidence package only when the candidate provides demonstrable evidence that the
> stage genuinely cannot reach outside the confined structure.
>
> Documentation describing an intended partition boundary is not execution evidence of the engine's
> actual traversal boundary. Until such evidence exists, the candidate remains NOT CLEARED.
>
> — **MSG-0110 §4**

**The weaker reading is recorded as rejected so it cannot quietly return** — the same discipline §4.6
S2 applies to the materialization reading. **The rejected proposition:** *"the structure the opaque
stage traverses contains only authorized entries, therefore the stage examined nothing unauthorized."*
**That is an argument from construction, and MSG-0110 §4 rejects it as sufficient.** It is not
worthless — it *may contribute* — but it does not discharge **E3** by itself, and a candidate resting
on it stays **NOT CLEARED**.

**Why the argument is not enough, stated once so the gate is not read as pedantry:** it assumes the
stage cannot reach outside its own structure, and **that assumption is itself an engine property**
(MSG-0109 §9 Q6). Real opaque stages routinely consult things outside the structure they nominally
traverse — a global term dictionary, a shared document-id map, a corpus-wide statistics table, a
global ANN graph or centroid set. **Each is a path out of the confinement that the construction
argument does not see.**

| | Requirement | Evidence that counts |
|---|---|---|
| **G-Q6.1** | **Execution evidence of the actual traversal boundary** | Engine-internal trace, per-structure I/O accounting, handle- or file-level read counters, or an engine-exposed counter **taken from inside the stage** — showing which structures the stage actually read |
| **G-Q6.2** | **Demonstration that the stage cannot reach outside**, not merely that it did not on one run | Evidence about the mechanism: that the stage's reachable set is the confined structure. **§4.6 S5 applies** — an observation of non-reaching is a zero count, and a zero count proves only what crossed the instrument |
| **G-Q6.3** | **No shared out-of-partition structure is consulted** | Explicit evidence that global term dictionaries, shared doc-id maps, corpus-wide scoring statistics, global ANN graphs and centroid structures are **either absent or themselves per-partition**. **§4.8 I6 is the pattern; §6.2 records the class-V form of the failure**: *"A global ANN graph traversed with a filter is Shape 3 by construction, whatever the API calls it"* |
| **G-Q6.4** | **Structural confinement, where offered, is labelled as a CONTRIBUTOR** | It may appear in the evidence package; it may not appear as the discharge of E3. A record presenting it as E3 has misreported |

**What falsifies it.** Documentation-only or construction-only claims; any evidence the stage reads a
structure spanning partitions; an engine exposing no observability into the stage at all — which
§4.6 S10 already makes disqualifying in its own right.

**Not demonstrated yields NOT CLEARED for that candidate**, which is §4.6 S6/E3 unchanged: *"never a
pass by default."*

> **A cost this gate does not price, carried forward from §4.8 and still unmeasured.** Building a
> lexical or vector index per partition **splits its scoring statistics**, so cross-partition score
> comparison is not simply a sort. **That is an observation from construction; no figure is claimed
> and none was measured** (§4.8; MSG-0109 §5.5, §5.6).

#### Applying the three gates to what has already been measured — nothing moves

**Every verdict in this record is unchanged by this section.** The gates are applied below to the
TASK-0035 designs to show what they would have required; **each design's verdict is the one §4.8
already recorded, and none is relabelled.**

| Design | G-Q4 routing | G-Q5 both conditions | G-Q6 opaque stage | **Verdict (unchanged)** |
|---|---|---|---|---|
| **P0** | n/a — no partitioning | n/a | not reached | **NOT CLEARED** |
| **P1** | **not measured** — routing was computed in the harness, never instrumented | n/a | not reached | **NOT CLEARED** |
| **P2** | **not measured** | n/a | not reached | **NOT CLEARED** |
| **P3** | **not measured** | n/a | not reached | **NOT CLEARED** |
| **P4** | **not measured** | **neither condition demonstrated** — no bound configured, no kernel re-check present in the fixture | n/a (pure relational) | **NOT CLEARED** — E4 also not obtained |
| **P5** | **not measured** | **neither condition demonstrated** | **FAILS G-Q6** — E3 argued from construction, exactly the reading MSG-0110 §4 rejects | **NOT CLEARED** |
| **P4S** | **not measured** | **fails both limbs by demonstration** — the clock moved past no bound, no abstention occurred, and 5 of 5 unauthorized rows were **returned** | n/a | **NOT CLEARED** |
| **NC** | n/a | n/a | n/a | **DISQUALIFIED** — negative control, failed as required (§4.6 S8) |

**Two things this table establishes that are worth more than the cells.**

1. **P4S is now a demonstrated gate failure rather than only an alarming measurement.** Under G-Q5 the
   design does not merely look bad — it **fails a named clearance condition**, and it fails the limb
   that was already accepted architecture before the probe ran.
2. **"Not measured" is not a defect in TASK-0035 and is not being recorded as one.** G-Q4 did not
   exist when that probe ran; **the honest entry is that routing was never instrumented**, and under
   §4.6 S9 the consequence of unobtained evidence is the verdict those designs already carry.

**The nine MSG-0104 class and candidate verdicts are unchanged and are reproduced in full in
MSG-0112 §6.** **Nothing in this section clears anything.** SQLite and every class-R configuration
remain **NOT CLEARED**; classes **S**, **V** and **K** remain **NOT CLEARED** with no execution
evidence; class **D** and class **H** remain **DISQUALIFIED**.

#### Q7 — the numeric staleness bound. Surfaced for the Architecture Lead, deliberately NOT decided

> **Q7 is RULED by MSG-0136 — zero stale-answer tolerance, and no numeric threshold.** Note added
> 2026-08-24 by an interactive COMMS session; **additive, nothing below deleted or reworded.** Once a
> policy is updated, approved, revoked or superseded, **the prior version must not answer**, and where
> the current approved version cannot be established the system **abstains**. **The numeric limb this
> heading refers to is answered by being refused**: the requirement is freshness, **not an elapsed-time
> allowance**, so **no threshold is introduced**. **G-Q5's bounded re-materialisation interval remains
> an evidence requirement, and does not become permission to answer stale content.** Ruling text in
> MSG-0136; **deliberately not restated here.**

**Numbering:** §4.7 holds **Q1–Q3**; MSG-0109 §9 raised **Q4–Q6**, now ruled by MSG-0110 and encoded
above. **Q7 is the next free number**, allocated here and verified unused.

**The question.** ADR-0020 §1 makes a bound authoritative and ADR-0020's *Deliberately not decided
here* leaves its **value** to operations, *"tuned with real evidence."* **G-Q5.1 therefore tests that a
bound exists and is enforced; it cannot test whether the window is short enough.** Is the structural
gate the intended standing state, or should a numeric bound be fixed — and if so, by whom and in which
record?

**What this task did NOT do, and why.** It did not choose a number. MSG-0110 §3 states *"This ruling
does not invent a new numeric staleness threshold"*, and fixing one here would amend an accepted ADR
by implication — a stop condition under this task's own section and under CLAUDE.md's authority rule.

**Default until ruled: the structural gate, as written above.** It is a real gate — it fails P4S by
demonstration — and it is **strictly stronger than the construction-only evidence G-Q6 rejects**.
**This blocks nothing:** a probe can run G-Q4, G-Q5 and G-Q6 today and return defensible verdicts with
Q7 still open.

**One observation offered as input to that ruling and explicitly not as any part of it:** the tolerable
window is a function of how fast the authorization facts actually change, which is **corpus and
organizational evidence this project does not yet have** — PR5 is met only at n=1 (WP-0009 §8). **No
figure, range, or typical value is proposed**, consistent with §2.1.

> **Q7 HAS SINCE BEEN RULED — added 2026-08-23 by TASK-0037, and nothing above is altered.**
> **MSG-0113 resolves Q7 without fixing a number, by replacing the question:** freshness is a
> **version-transition** property, not an elapsed-time SLA. *"When an authorized policy or procedure is
> manually updated, approved, revoked, or superseded, the previous version must no longer be used for
> employee answers once the change is recorded … If the current approved version cannot be established
> or made available to retrieval, the system must abstain rather than answer from the stale version."*
> **A timer measures how long ago a structure was rebuilt; the requirement is whether the authoritative
> version changed, which a timer cannot observe.** **No numeric threshold is introduced**, and
> **G-Q5.1 stands exactly as written above — structural, not numeric.** What MSG-0113 adds is a
> **second, independent** requirement that a temporally materialised structure must also meet; it is
> encoded in **§4.10**. **The question as posed above — whether a numeric bound should also be fixed,
> and by whom — is not answered by MSG-0113 and remains open**, which is why this note is additive
> rather than a deletion.

---

### 4.10 Version-transition freshness: the fail-closed requirement, and what was measured (TASK-0037, MSG-0113)

**Added 2026-08-23 by TASK-0037. Additive and declared: nothing in §4.1–§4.9 is deleted or reworded,
and no verdict changes.** This section encodes MSG-0113's version-transition requirement as testable
conditions and records what a probe measured against them. **It amends no ADR, invents no threshold,
and selects, adopts, recommends, installs and deploys no engine.** Authority: **MSG-0113 §2–§5**. Full
evidence: **MSG-0115**; harness and captured output at `implementation/probes/TASK-0037/`.

**Like §4.9's gates, everything here is NECESSARY and never SUFFICIENT.** **§4.6 S6 still governs
clearance** — E1 + E2 + E3 + E4 all obtained, `U = 0` at every measured collection size, invariant with
`N`. **The probe demonstrated this in practice rather than by assertion:** one design satisfied every
condition below **and both G-Q5 conditions**, and is **NOT CLEARED**.

#### G-Q7 — the six mechanism properties, from MSG-0113 §2

| | Requirement | Evidence that counts |
|---|---|---|
| **G-Q7.1** | **The governance/kernel record is authoritative** for the current version and its lifecycle state | The answer path's actual source for currency, exhibited. A design that resolves currency from the projection has resolved it from a copy |
| **G-Q7.2** | **A transition invalidates or supersedes the retrievable prior version AS PART OF the recorded transition** — not by a periodic timer | **The discriminator test below.** A design whose only mechanism is a timer fails, however short the interval |
| **G-Q7.3** | **Retrieval resolves against the current version**; stale materialisation is **not authoritative** after the transition is recorded | The version identity of every chunk returned, checked against the kernel's current version at answer time |
| **G-Q7.4** | **If the current version is unavailable to retrieval, the answer path ABSTAINS** | **An abstention, not an empty answer.** ADR-0017 §5 classifies abstentions **A1–A7**; an empty answer is none of them and is indistinguishable to the employee from *"no approved policy covers this"* |
| **G-Q7.5** | **The kernel re-check remains mandatory** and is demonstrated **against the authoritative current state** | **§4.9 G-Q5.2b/G-Q5.2c unchanged** — against the kernel, and demonstrated to **reject** |
| **G-Q7.6** | **Any physical or partitioned representation carries version/lifecycle identity sufficient to prove the candidate is current.** Physical isolation does not excuse stale-version use | The identity carried in the structure — **and evidence that something consults the authoritative record with it.** Carrying it and never consulting is measured below as changing **nothing** |

**Also required, and it is the condition most easily satisfied by accident:** MSG-0113 §1's
*"cannot be established"* limb. **A design that never asks the kernel cannot establish currency**, so
it must abstain — even when its projection happens to be current. Answering correctly without being
able to know it is correct **fails**.

#### The discriminator, which is the whole test

> *"Evidence must distinguish **transition-triggered** freshness from ordinary **periodic
> re-materialization**. Passing a fixed-time test alone does not establish the requirement."*
> — **MSG-0113 §3**

**Method:** record one transition; query it **twice** — once at an instant when the periodic timer has
**not** fired, once after it has. **A design that fails the first and passes the second was made
correct by waiting, not by the transition.** A fixture that does not separate the two proves nothing
however many cases it runs.

#### What was measured (class R test subject; MSG-0115 §5)

**8 designs × 11 scenarios × 3 collection sizes**, two instrument placements each. **The pass/fail
grid was identical at M=50, M=500 and M=5000** — freshness behaviour is a property of the mechanism,
not of collection size. **`U` is not**, and that difference is the point of the second table.

| Design | Mechanism | Grid | `U` max over all scenarios (M=50/500/5000) | **Verdict** |
|---|---|---|---|---|
| **A0** | live kernel-backed store, no projection | 10/10 | **62 / 512 / 5012** — grows with `N` | **NOT CLEARED** — E1 fails (`SCAN` over a store spanning scopes); E4 not obtained |
| **A1** | materialised, **no version identity**, periodic only | 3/11 | 4 / 4 / 4 | **NOT CLEARED** — returned a superseded version in 7 scenarios |
| **A2** | **+ version identity**, periodic only | 3/11 | 4 / 4 / 4 | **NOT CLEARED** — **grid identical to A1** |
| **A3** | + transition-triggered invalidation | 5/11 | 4 / 4 / 4 | **NOT CLEARED** — leaks where the hook is not wired; answers where abstention is required |
| **A4** | + kernel consult and §3 point-2 re-check | 10/11 | 4 / 4 / 4 | **NOT CLEARED** — G-Q5 condition 2 met; condition 1 not; `U` > 0; E4 not obtained |
| **A5** | as A4 but the re-check reads **the copy** | 9/11 | 4 / 4 / 4 | **NOT CLEARED** — **fails G-Q5.2b and G-Q5.2c by demonstration** |
| **A6** | A4 + a configured staleness bound | **11/11** | 4 / 4 / 4 | **NOT CLEARED** — **both G-Q5 conditions met, and still not cleared**: `U` > 0, E4 not obtained, G-Q4 not measured |
| **NC** | negative control — falls back to the prior snapshot | 5/11 | 4 / 4 / 4 | **DISQUALIFIED** — leaked a superseded version in **12 cases**; the control failed as required (§4.6 S8) |

**Five results carry beyond this engine.**

1. **Version identity is necessary and nowhere near sufficient.** **A1 and A2 differ in exactly that
   property and their grids are identical.** G-Q7.6 is real, but the work is done by G-Q7.2/G-Q7.3 —
   something must **consult** the authoritative record. **A design carrying no version identity also
   cannot name the version it answered from**, which defeats ADR-0018 §1's *"a citation names a
   document version, never a document"* independently of any freshness question.
2. **"Answered nothing" is not "abstained".** A3 returned an **empty ANSWER** where abstention was
   required, and on the kernel-unreachable case **answered correctly by luck** — its hook had fired,
   and it had no way to know. **G-Q7.4 exists because an empty answer is a wrong answer to the
   employee, not a safe one.**
3. **The faked re-check is a no-op, now demonstrated.** A4 and A5 differ only in what the re-check
   reads. Against the same change: A4 `kept 0/4` and abstained; **A5 `kept 4/4` and returned four
   chunks of a version the kernel had reclassified.** Same structures, same plan, **same `U`**.
   **§4.9 G-Q5.2c is satisfied for the first time here** — a re-check observed to **reject**.
4. **`U` cannot distinguish a leaking design from a conservative one.** **A4 and A5 both report
   `U` = 4 at every collection size, with identical plans — one abstains, the other leaks.**
   **This extends §4.6 S5 in a direction it did not state:** the asymmetry rule warns that a *zero*
   count can be an artefact of placement; here a *non-zero* count **identical between two designs
   conceals opposite security outcomes.** Clearance can never rest on `U` alone.
5. **"`U` = 0 is a property of an instant" is not only about time.** §4.8 finding 3 established that
   for **effectivity decay**, where a clock moves. **In the decisive scenario here no time passes at
   all** — an authorization attribute changes in the kernel and the routed structures immediately hold
   unauthorized rows. **No timer would have caught it**, which is exactly why MSG-0113 replaced the
   elapsed-time question. This **corroborates §4.8 finding 1** in a second, independent fixture.
   **Whether an in-query join against the kernel would change it was NOT measured.**

**A trap this section exists to close, stated plainly:** a design can be **wired to invalidate on
lifecycle transitions** and still serve unauthorized content, because **a hook is only as complete as
the set of changes it is wired to.** Delivered as a recorded transition, the change was caught by
re-materialisation and the faked re-check was never tested; delivered as an attribute reassignment
outside that set, **only the designs re-checking against the kernel survived.** **MSG-0113 §2(2) and
§2(5) are therefore not alternatives.**

**Nothing is CLEARED and no verdict moves.** The nine MSG-0104 verdicts and the eight §4.8 design
verdicts are unchanged and reproduced in MSG-0115 §8; **neither prior probe was re-run and no figure
of theirs is re-measured.** **No numeric staleness threshold is introduced** — A6's bound is a
**fixture constant** exhibited because **G-Q5.1a** requires a bound to exist, and **its magnitude is
not judged, proposed or recommended.** **G-Q4 was NOT MEASURED** by this probe, as **G-Q4.4** requires
a probe instrumenting only retrieval to say.

---

### 4.11 Kernel-constrained retrieval and non-divergent projection: what was measured (TASK-0038, MSG-0116a+b)

**Added 2026-08-23 by TASK-0038. Additive and declared: nothing in §4.1–§4.10 is deleted or
reworded, and no verdict changes.** This section records what the **kernel-constrained / in-query
authorization** alternative and the **non-divergent projection** alternative actually did when
measured — the alternative **MSG-0115 identified and explicitly did not measure**. **It amends no
ADR, invents no threshold, and selects, adopts, recommends, installs and deploys no engine.**
Authority: **MSG-0116a §2–§6 and MSG-0116b**, which agree on all three rulings. Full evidence:
**MSG-0118**; harness and captured output at `implementation/probes/TASK-0038/`.

**Both rulings forbid the shortcut this section could otherwise be read as taking.** MSG-0116a:
*"Do not select an engine on the assumption that an unmeasured kernel join or equivalent mechanism
will solve the problem."* MSG-0116b: **no clearance follows from Q8** — *"E1–E4 and
G-Q4/G-Q5/G-Q6/G-Q7 remain independently necessary."* **Nothing below clears anything.**

#### The instrument Q8 requires, and why one counter could not have delivered it

**MSG-0116b's operative addition is a requirement on the apparatus, not on the architecture:** the
re-check *"must be instrumented **separately** from retrieval-content examination, and evidence must
demonstrate that it reads **only** the authoritative kernel facts required to authorize the
candidate."* **MSG-0116a supplies the complementary half:** *"the existing measured kernel-read
count is **not, by itself, a Shape-1 violation**."*

**Together they fix the instrument: three counters, never one.**

| | Counter | What it counts | How the rulings treat it |
|---|---|---|---|
| **`U`** | retrieval-path units (§4.6 S4), **including routing-phase units** (G-Q4.4) | unauthorized units examined while resolving the query | the strict Shape-1 bar, unchanged |
| **`KR.meta`** | the re-check's reads of authoritative authorization / version / lifecycle metadata | bounded by the candidate count, **invariant with `N`** | **permitted by Q8**; **not added to `U`** (MSG-0116a) |
| **`KR.content`** | content-bearing data read by the re-check | any such read **from an unauthorized candidate** | **a Shape-1 FAILURE** (MSG-0116b) |

**The separation is not bookkeeping, and the probe demonstrates why.** Designs **K0** and **K6**
differ in exactly one property — whether the re-check reads the candidate's body before authorizing
it. They have **the same `U`, the same `Ustruct`, the same plan, the same routed set, the same
answers and the same 7-scenario grid.** **Every other measurement in the probe is identical.** The
**only** instrument that separates them is `KR.content`, which fires **12 times against unauthorized
candidates** for K6 and **zero** for K0. **Without MSG-0116b's separate-instrumentation requirement
the two designs are indistinguishable**, and the probe would have reported the violating one as
clean.

#### G-Q7.8 — the re-check is a control-plane lookup, and must be shown to be one

**This is Q8 encoded as a testable condition. It adds no new obligation to any ADR**; it states what
evidence discharges the obligation ADR-0020 §3 point 2 already imposes.

| | Requirement | Evidence that counts |
|---|---|---|
| **G-Q7.8a** | **The re-check is instrumented separately** from retrieval-content examination | Two distinct counters, whose separation is exhibited. A single combined figure **has not measured this** |
| **G-Q7.8b** | **It reads only authoritative kernel authorization / version / lifecycle metadata** | The field set it may read, **exhibited and closed**; a read outside that set is a failure, not a note |
| **G-Q7.8c** | **It reads no content-bearing data from an unauthorized candidate** | **MSG-0116b: "that is examination and fails Shape-1."** The candidate must be **rejected or abstained before its content is used** (MSG-0116a) |
| **G-Q7.8d** | **It consults authoritative current state, not a materialized copy** | **G-Q5.2b unchanged.** The no-op limb §4.9 identified and MSG-0115 §6 F3 demonstrated |
| **G-Q7.8e** | **Its kernel-read count is reported, and is not read as a violation** | **MSG-0116a in terms.** Report it; do not treat it as `U` |

**Not demonstrated yields NOT CLEARED.** And **satisfying all five clears nothing** — Q8 removes an
apparent conflict between AMD-01 and ADR-0020 §3; **E1–E4 and G-Q4…G-Q7 remain independently
necessary.**

#### What was measured (class R test subject; MSG-0118 §5)

**9 designs × 7 scenarios × 3 collection sizes**, two instrument placements each, plus a
placement-independent structural measure. **The behavioural grid was identical at M=50, M=500 and
M=5000** — checked, not assumed.

`U` = unauthorized units examined, maximum across placements, over all scenarios.
`Ustruct` = unauthorized **versions present in the structures the traversal opens** — placement-independent.

| Design | Mechanism | Grid | `U` (50/500/5000) | `Ustruct`@5000 | E1 strict | G-Q4 | **Verdict** |
|---|---|---|---|---|---|---|---|
| **K0** | materialised copy; predicate on the copy; kernel re-check after | 6/7 | 4 / 4 / 4 | 2 | HOLDS | MET | **NOT CLEARED** |
| **K1** | in-query kernel join, **collection-driven** | 7/7 | 56 / 506 / 5006 | 5003 | VIOLATED | n/a | **NOT CLEARED** |
| **K2** | in-query kernel join, **entitlement-driven** | 7/7 | 53 / 503 / 5003 | 5003 | VIOLATED | n/a | **NOT CLEARED** |
| **K3** | **kernel-side authorization edge**, exact-key routed, co-written with the facts | 7/7 | 22 / 214 / 2143 | 2143 | VIOLATED | MET | **NOT CLEARED** |
| **K4** | K3, **open-ended effectivity limb only** | **3/7** | **0 / 0 / 0** | 714 | VIOLATED | MET | **NOT CLEARED** |
| **K5** | K0 but **routing by catalogue enumeration** | 6/7 | 7 / 7 / 7 | 2 | HOLDS | **FAILED** | **DISQUALIFIED** |
| **K6** | K0 but the **re-check reads the candidate body** | 6/7 | 4 / 4 / 4 | 2 | HOLDS | MET | **DISQUALIFIED** |
| **K7** | **physically partitioned authoritative store**, both limbs | 7/7 | 8 / 72 / 715 | 2143 | **HOLDS** | MET | **NOT CLEARED** |
| **K8** | K7 with the bounded limb **forced onto the `eff_to` index** | **7/7** | **0 / 0 / 0** | 2143 | **HOLDS** | MET | **NOT CLEARED** |
| **NC** | negative control — rank first, authorize after | 2/7 | 56 / 506 / 5006 | 5003 | VIOLATED | n/a | **DISQUALIFIED** |

**Both validity gates passed.** The adversarial precondition held at all three sizes
(`authorized-among-them = 0`), and **the negative control failed in 15 of 21 cases**, so the run is
valid (§4.6 S8).

#### Six results carry beyond this engine

**1. Removing the copy fixes divergence and does nothing whatever for Shape-1.** K1 and K2 hold no
copy at all — the authorization facts are joined from the authoritative kernel inside the retrieval
operation — so they answer **7/7** and cannot go stale. **Their `U` is the largest in the table and
grows linearly with `N`.** *Non-divergence and non-examination are independent properties, and the
kernel join buys only the first.* **This is the direct answer to the question MSG-0115 referred**,
and it is the answer both rulings warned against assuming the other way.

**2. The four discrete conjuncts refine perfectly; effectivity is the entire residual.** K3's
residual at M=5000 is **2142 units, composed exclusively of the three effectivity failure modes** —
714 expired, 714 not-yet-effective-open, 714 not-yet-effective-bounded. **Not one wrong-scope,
wrong-audience, restricted-class or superseded version is examined at any size.** **§4.7 Q2 asked
whether the conjuncts can be physically organised at all; for scope, classification, lifecycle state
and audience the measured answer here is yes, cleanly** — and the co-written kernel edge is what does
it. **Effectivity-at-answer-time remains the sharpest discriminator, exactly as §3 predicted.**

**3. `U = 0` is purchasable by withholding authorized content, and a probe measuring only `U` would
call that a success.** **K4 is the only design in four probes to reach zero at every collection size
while scoring 3/7** — it withholds every version whose effectivity window is bounded, returning an
**empty ANSWER** in two scenarios where an answer exists. That is EPA-0006 §3.3's **wrong-exclusive**
defect: an availability failure, not a confidentiality one, and **invisible to `U` by construction.**
**A clearance criterion that reads `U` without reading the served set can be satisfied by a design
that answers nothing.**

**4. A design can report `U = 0` while the structures it opens still hold unauthorized entries.**
K4 and K8 both report zero; their `Ustruct` is **714** and **2143**. The seek bound skipped those
rows, the counter never saw them, and **whether the engine read the index entries describing them is
NOT OBSERVABLE through `node:sqlite`** — **U1 is not instrumentable on this test subject and this
record says so rather than reporting a zero it cannot support.** **This is §4.6 S5's asymmetry rule
meeting §4.6 S7's *"an in-query counter does not measure rows scanned at all"*, and it is why E1 is
required rather than optional.**

**5. And this is the uncomfortable one: on this engine, whether unauthorized content is examined is
decided by the query planner.** **K7 and K8 have the same schema, the same data, the same indexes,
the same query text apart from one `INDEXED BY` token, the same answers and the same 7/7 grid.**
**`U` goes 715 → 0.** Both indexes exist on both designs; the optimiser chose the one that seeks on
the *lower* effectivity bound and leaves every expired version exposed, **and the design had no way
to tell.** **A `U = 0` measurement taken without pinning the plan is a measurement of one plan, not
of a design** — and a plan is not stable across data volumes, statistics or engine versions.
**Consequence for engine selection, offered as evidence and not as a rule:** an engine whose planner
may silently substitute a traversal that examines unauthorized content places the Shape-1 property
outside the architecture. **E1 is the only evidence class that can see this.**

**6. The separately-instrumented re-check is the only thing that distinguishes a clean design from a
violating one.** K0 and K6 agree on every other measurement the probe takes. **MSG-0116b's
requirement is what makes Q8 falsifiable**, and result 5 above is why the ruling's own phrasing —
*evidence must demonstrate* — is doing real work: without the separate counter, the violating design
reports clean.

**And one result that reproduces a prior finding in a third independent fixture.** K0's `U` is
**0 in the steady state and non-zero in every scenario where an authorization fact changed at the
query instant** — divergence with **zero elapsed time**, which no timer could catch. That is
**§4.8 finding 1 and §4.10 finding 5, corroborated a third time.** The kernel re-check caught it
every time (`kept 2/4`), which is **ADR-0020 §3's defence in depth working as specified** — and the
re-check cannot reduce `U`, because by the time it runs the units have been examined.

#### What this section does NOT establish

- **Nothing is CLEARED.** Six designs **NOT CLEARED**, three **DISQUALIFIED**.
- **E4 was NOT OBTAINED** for any design — `node:sqlite` exposes no engine log to inspect, unchanged
  from TASK-0033/0035/0037. **No design could have been cleared here whatever `U` showed**, and that
  is stated before the results table in the probe output so no row is misread.
- **E3 is N/A for this fixture and the exemption is not transferable.** Every design is purely
  relational; there is no FTS5 `MATCH`, no vector index and no ANN graph. **A real lexical or vector
  stage reintroduces the opaque stage and G-Q6 applies unchanged**, construction arguments still
  rejected.
- **G-Q4 was measured for the first time** — the differential test of G-Q4.2 — and **K5 fails it
  while returning exactly the answers K0 returns**, its routing reads scaling **12 → 76** with other
  subjects' structures. **§4.9's *"behaviourally identical and only one satisfies the gate"* is now
  demonstrated rather than predicted.**
- **No numeric staleness threshold is introduced.** No benchmark, latency, capacity, recall or
  throughput figure was produced.
- **All prior verdicts are unchanged.** The nine MSG-0104 verdicts, the eight §4.8 design verdicts
  and the eight §4.10 design verdicts stand, **A6's freshness-passed-but-NOT-CLEARED status
  included** (MSG-0116b). **No prior probe was modified or re-run.**

#### Q11 — does an exact-key seek into a scope-spanning structure violate E1? Surfaced, NOT decided

**Numbering:** §4.7 holds Q1–Q3; Q4–Q6 are ruled and encoded in §4.9; **Q7 is ruled** (MSG-0113) with
its numeric limb still open; **Q8, Q9 and Q10 are ruled** by MSG-0116a and MSG-0116b. **Q11 is the
next free number**, allocated here and verified unused.

**The question.** §4.6 S6/E1 requires the traversal be confined to *"a structure or region **every
entry of which** satisfies the predicate"*, and states that *"a plan showing a scan **or seek** over
a structure that spans authorization scopes is **disqualifying regardless of any counter**."* **Read
strictly, an exact-key seek into a global table violates E1 even though it touches only an entitled
row.** That reading decides **K3 and K4**, whose plans seek `k_authz_edge`, `k_version` and `k_chunk`
by exact key and are recorded **VIOLATED** above; under the narrower *entries-touched* reading they
would hold.

**This probe reports both readings and adopts the strict one**, because it is **fail-closed** — it
can only withhold clearance, never grant it — so **the criterion is operable now and Q11 blocks
nothing.** **K7 and K8 satisfy E1 under BOTH readings**, by partitioning the version and chunk stores
as well, so the question does not decide the strongest candidates.

**The interaction worth stating:** Q11 is close to §4.7 **Q1** (does *"examine"* reach metadata?) and
to §4.9's open note on exact-key **catalogue** lookups, but it is distinct from both — **Q1 concerns
index entries describing chunks, §4.9's note concerns identifiers describing structures, and Q11
concerns rows in a scope-spanning table reached by exact key.** All three currently take the same
fail-closed default.

---

### 4.12 K7/K8 remaining clearance evidence: E4, `U1` observability, plan-independence (TASK-0039, MSG-0120)

**Added 2026-08-24 by TASK-0039. Additive and declared: nothing in §4.1–§4.11 is deleted or
reworded, and no verdict changes.** This section records what happened when the three remaining
clearance gaps on the **physically partitioned K7/K8 class** were attacked directly. **It amends no
ADR, invents no threshold, relaxes no gate, and selects, adopts, recommends, installs and deploys no
engine.** Authority: **MSG-0120**, with **MSG-0119** binding. Full evidence: **MSG-0123**; harness
and captured output at `implementation/probes/TASK-0039/`.

**Why K7/K8 and nothing else.** MSG-0119 ruled Q11 strictly, so **K3 and K4 remain NOT CLEARED** and
were not re-run. K7 and K8 partition their version **and** chunk stores, satisfying E1's
reachable-structure limb under **both** readings — which made them the only candidates whose E1
position was not in question, and the only ones worth closing gaps on.

**Both are NOT CLEARED. Nothing here clears anything.**

#### Gap 1 — E4 is UNOBTAINABLE on this test subject, established by enumeration

**MSG-0120 required E4 be obtained or explicitly established as unobtainable, and forbade inferring
it.** It was established, by enumeration rather than by assertion:

| Check | Result |
|---|---|
| `DatabaseSync` / `StatementSync` prototypes, enumerated at runtime | **no trace, profile or log member of any kind** |
| `sqlite3_trace_v2`, `sqlite3_profile`, `SQLITE_CONFIG_LOG`, `sqlite3_stmt_scanstatus` | **none bound by `node:sqlite`** |
| `PRAGMA compile_options` | **`SQLITE_DEBUG` ABSENT · `ENABLE_SQLLOG` ABSENT · `ENABLE_STMT_SCANSTATUS` ABSENT** |
| `PRAGMA vdbe_trace` / `vdbe_listing` / `parser_trace` / `sql_trace` | accepted **and inert** |
| `db.location()` on `:memory:` | **`null`** — no file, so no journal, WAL or engine-written artefact to read |

**The trap that check caught is worth keeping.** SQLite **silently ignores an unrecognised pragma**,
so *"`PRAGMA vdbe_trace=on` returned no error"* is evidence of nothing. The probe ran a pragma that
certainly does not exist as a **control**, and every tracing pragma behaved identically to it. **A
probe without that control could have reported E4 obtained from an instrument that was never
running.**

**Consequence, stated before any count in the record it belongs to:** under §4.6 S6 an absent
evidence class yields **NOT CLEARED**, so **no candidate could have been cleared in that run
whatever `U` showed.**

#### Gap 2 — `U1` is partially instrumentable after all, and the prior zero was a ROW-ACCESS zero

**MSG-0118 recorded that `U1` is not instrumentable through `node:sqlite`, and MSG-0120 forbade
reporting `U1 = 0` on that basis. The stronger of the two turns out to be available:** `U1` **is**
measurable in part, and what it measures is **failure**.

**The engine's own bytecode shows where a row-access counter sits.** For the pinned bounded limb,
`EXPLAIN` prints `SeekGT` → `IdxGT` → **`DeferredSeek`** → `Column` *on the index cursor* → `Gt` →
**`Next`**. **An entry failing the residual is rejected from the index and the table row is never
read**, so a counter on a non-indexed column **cannot fire for it**. §4.6 S5 predicted exactly this;
here it is demonstrated at opcode level.

**The instrument:** a function applied to `open_ended`, the **leading column of both candidate
indexes**, is evaluated **from the index cursor** and therefore fires **once per entry visited in the
seek range**. It was **calibrated against a cohort known by construction, on both candidate plans,
and reproduced the constructed count exactly** (302 and 402) before being used on anything.

**What it is, precisely, because the bound only works one way:**

- **`Nidx`** — engine-measured entries visited. **All** entries; the instrument cannot classify them.
- **`U1lb`** — a **derived, deliberately generous** lower bound on the unauthorized share.
- It is a **LOWER BOUND**: it does not see interior b-tree pages, pager reads, or other loops.
  **A positive value is conclusive of failure (§4.6 S5); no value of it may ever be read as
  `U1 = 0`, and the probe never so reads it.**
- The transfer licence was **checked, not assumed**: every measurement captured the plan with and
  without the instrument and required the **seek bound to be identical**. **0 of 96 failed.**

#### The measurement, and the two results that carry

**K7 and K8 visit THE SAME NUMBER OF ENTRIES. `U` sees one and not the other.**

| M | K7 `Nidx` | K8 `Nidx` | K7 `U` | K8 `U` |
|---|---|---|---|---|
| 50 | 10 | 10 | 7 | 0 |
| 500 | 74 | 74 | 71 | 0 |
| 5000 | 717 | 717 | 714 | 0 |
| 20000 | 2860 | 2860 | 2857 | 0 |

**MSG-0118 §5 result 5 called K7-vs-K8 the sharpest finding in that table, and it was correctly
measured — it simply meant something narrower than it looked. K8 did not examine less.** It examined
the same amount, in a place the instrument could not see, because its seek is on the **upper**
effectivity bound and the unauthorized entries are rejected **from the index**. **MSG-0118's own
result 4 said this could not be measured; it now is.**

**`ANALYZE` alone drives K7's `U` from 2857 to 0, and changes nothing else.** `ANALYZE` is ordinary
maintenance: it writes statistics and touches no schema, data, index, query text or design. After
it, K7's planner switches the populated partition's bounded limb to the upper-bound index —
**becoming K8 in the only respect that matters.** `U`: 2857 → **0**. `Nidx`: 2860 → **2861**, i.e.
**one entry more, not fewer.**

> **The same candidate, measured before and after a routine `ANALYZE`, receives opposite `U`
> readings. On this engine `U` is not a property of the design; it is a property of the statistics
> table.** That sharpens §4.11 result 5 from *"the planner decides"* to *"a maintenance command
> decides"*.

#### Gap 3 — E1 splits: one limb is plan-independent and obtained, the other is not

**OBTAINED, and genuinely independent of the optimizer.** `sqlite3_set_authorizer`, bound as
`DatabaseSync.setAuthorizer`, enumerates every `(table, column)` a statement **may** read, **at
compilation**, before and regardless of any plan choice. For K7 and K8 it reports **eight structures,
all routed partitions, and no scope-spanning structure**, identically under every configuration. It
reports a **superset** of what any plan opens — the fail-closed direction, so **what it excludes, no
plan can reach**. For the negative control it reports `k_chunk` and `k_version`, **failing E1
plan-independently**.

**The instrument was characterised rather than assumed.** Its callback count is **invariant with
collection size** (101 at M=500 and at M=5000), so it is a **compilation event, not a per-entry
counter**; it cannot measure `U` or `U1` and is not used to.

**NOT OBTAINED: the confinement limb.** Across configurations that are all ordinary engine states —
baseline, `automatic_index=off`, fresh connections, shifted query instant, after `ANALYZE`, after
`ANALYZE` + `PRAGMA optimize` — at four collection sizes and two distributions:

| Design | distinct version traversals | `U` range | derived `U1lb` range |
|---|---|---|---|
| **K7** | **2** | 0 … 4445 | 0 … 4437 |
| **K8** | **2** | 0 | 0 … 4436 |

**`INDEXED BY` pinned the bounded limb and did not pin the rest** — K8's *open* limb still became a
full partition scan after `ANALYZE`. **Pinning one limb pins one limb.**

#### Verdicts — both NOT CLEARED

| Candidate | E1 | E2 | E3 | E4 | G-Q4 | **Verdict** |
|---|---|---|---|---|---|---|
| **K7** | reachable-structure limb **HOLDS plan-independently**; confinement limb **NOT plan-independent** | **NOT OBTAINED** — `U1lb` to 4437, rising with `N` | N/A, **not transferable** | **NOT OBTAINABLE** | MET in all 12 configurations | **NOT CLEARED** |
| **K8** | as K7 | **NOT OBTAINED** — `U1lb` to 4436, rising with `N` | N/A, **not transferable** | **NOT OBTAINABLE** | MET in all 12 configurations | **NOT CLEARED** |

**Both validity gates passed:** the adversarial precondition held at all four sizes under both
distributions, and the negative control **failed in 4 of 4 cases** (§4.6 S8).

#### What this section does NOT establish

- **Nothing is CLEARED**, and no gate was relaxed to reach that. MSG-0119 is explicit that failure
  does not authorize weakening the gates; **the question returns to §4.7 Q3.**
- **`U1 = 0` is not established for anything and is not claimed.** The instrument proves
  examination, never its absence.
- **E4 is not obtained — it is established unobtainable ON THIS TEST SUBJECT.** That is a fact about
  `node:sqlite` and this build, **not** a claim that no engine can supply E4.
- **No planner behaviour is generalized.** Every plan, count and bound is evidence about **SQLite
  3.51.3 via `node:sqlite`**, in these configurations, on these fixtures.
- **The configuration set is not exhaustive.** Plan stability across what was tested is not plan
  stability: a different engine version, page size, statistics state, or a build with
  `ENABLE_STAT4`, could all choose differently.
- **K3 and K4 are unchanged** and remain **NOT CLEARED** under MSG-0119's strict Q11 reading.
- **All prior verdicts stand.** TASK-0033/0035/0037/0038 were **not modified or re-run**; TASK-0038's
  seven-scenario grid is not replaced. **Its recorded `U = 0` for K8 remains correct as a row-access
  count** and is insufficient as evidence of non-examination — which is what §4.6 S5 always said.
- **No numeric staleness threshold**; no benchmark, latency, capacity, recall or throughput figure.
- **No engine, runtime, provider, model or index technology is selected**, and no implementation task
  is authorized or marked READY.

#### Q12 — must a probe take the index-cursor placement wherever the engine exposes one? Surfaced, NOT decided

> **Q12 has since been RULED, and this section is otherwise unchanged.** Note added 2026-08-24 by
> **TASK-0040** under **MSG-0125**; **additive — nothing below is deleted or reworded, and the heading
> is left as TASK-0039 wrote it** so the referral reads as it did when made. **MSG-0124 answers the
> question YES, strictly**, and the ruling is encoded as **§4.6 S7.1–S7.4**, which is where it must be
> read from. **It is deliberately not restated here** — two statements of one rule invite drift. **No
> verdict in this section changes: K7 and K8 remain NOT CLEARED**, and MSG-0124 says so in terms.

**Numbering:** §4.7 holds **Q1–Q3**, still open. **Q4–Q6** are ruled and encoded in §4.9. **Q7** is
ruled with its numeric limb open. **Q8–Q10** are ruled (MSG-0116a/b). **Q11** is ruled by MSG-0119.
**Q12 is the next free number**, allocated here and verified unused.

**The question.** §4.6 S7 requires a probe to *"record where each instrument sits"*, *"report the
maximum count across all placements"*, and *"never present a single count as 'the' number"*. **It
does not say which placements must be attempted.** This run found a reachable placement that four
prior probes did not take, and taking it changed a reported `U = 0` into a rising `U1` lower bound
on the same design.

**Should §4.6 S7 be strengthened to require the index-cursor placement — or any index-only-evaluable
placement — wherever the engine permits one, and should a `U` taken only at row access be
insufficient for E2 by rule rather than by a probe's diligence?**

**Why it is referred rather than applied.** That would be a change to the **criterion**, and
encoding a ruling into §4.6 is what TASK-0034 and TASK-0036 were separately authorized to do.
**TASK-0039 is an evidence task and MSG-0120 stops it at evidence and clearance status.**

**Why it blocks nothing.** The fail-closed default already covers the case: §4.6 S5 makes a
**non-zero count conclusive** and a **zero count inconclusive**, so a probe that omits the placement
cannot clear anything it should not have — it can only fail to detect a failure. **Q12 asks whether
that should depend on a probe noticing, and the answer changes no verdict recorded anywhere.**

---

### 4.13 The Q3 architecture response: a technology-agnostic retrieval topology, and the evidence still owed on it (TASK-0041, MSG-0130)

**Added 2026-08-24 by TASK-0041. Additive and declared: nothing in §4.1–§4.12 is deleted or
reworded, and no verdict changes.** Authority: **MSG-0130**, with **MSG-0129** (Q3, **DECIDED**)
binding. Full record: **MSG-0132**.

**This section clears nothing, and it is the first section in this record that could not have cleared
anything even in principle.** It is **entirely structural**, and §4.9 **G-Q6 rejects
construction-only evidence in terms**. MSG-0130 repeats the prohibition: *"Do not claim that a
structural design clears a gate where execution evidence is required."* **Its honest output is a
topology plus the evidence still owed on it — never a cleared candidate**, which is why the evidence
list below is the section's real deliverable and the pattern catalogue is its scaffolding.

**No engine, runtime, provider, model or index technology is selected, adopted, recommended,
installed or deployed. No ADR is amended. No gate is weakened, and no numeric threshold, benchmark,
latency, capacity, recall or throughput figure appears anywhere below.** **No prior probe was re-run
and no prior verdict is relabelled.**

#### The ruling, quoted rather than paraphrased

> Q3 asks what the architectural response is if no engine class can satisfy the existing strict
> Shape-1 clearance gates.
>
> The response is **not to relax the bar and not to select the least-bad engine**. If the remaining
> candidate classes cannot satisfy strict Shape-1, the project remains **NOT CLEARED** for
> retrieval-engine selection and returns to architecture work to define a retrieval topology that can
> satisfy the existing gates.
>
> The existing security criterion remains authoritative: `U = 0`, E1–E4, G-Q4/G-Q5/G-Q6 and the other
> recorded gates remain mandatory. Failure of all tested candidates is evidence that the
> architecture/technology space explored so far is insufficient; it is not authority to weaken AMD-01
> or strict Shape-1.
>
> — **MSG-0129**, Q3 ruling

Two further limbs of the same ruling bind this section and are quoted with it: *"The next architecture
work is to define and evaluate a technology-agnostic retrieval topology capable of satisfying the
existing strict gates, including physical candidate-set confinement where necessary, before any
engine-selection decision"*, and *"the architecture work must preserve the distinction between a
logical projection and its physical organization and must not assume that a particular engine's
planner behaviour generalizes to the class."*

**Which of §4.7's three branches this is.** §4.7 Q3 named the shape of the choice as: accept physical
organisation as an architectural requirement (**Q2**); or settle what `U` counts (**Q1**); or
**reconsider the retrieval topology**. **MSG-0129 takes the third and rules neither of the others.**
**Q1 and Q2 therefore remain OPEN**, and this section decides neither. It is worth recording that the
answer below runs *with* the direction §4.7 Q2's evidence already pointed — *"`U = 0` appears to
require that the traversal open only structures whose every entry is already authorized"* — **without
settling Q2**, because Q2 asks whether that is a *requirement of the criterion* and this section asks
only what a topology would have to look like.

**And the boundary MSG-0101 §1(1) sets is unchanged and is not reinterpreted here:** *"one projection
index"* means one **logical** projection. **Nothing below requires one physical index or one physical
store**, and nothing below permits more than one logical projection.

#### What five probes established that any topology must survive — and no verdict moves

**All prior verdicts are reproduced unchanged and nothing is relabelled.** §4.9 states the class
position and it still stands verbatim: *"SQLite and every class-R configuration remain NOT CLEARED;
classes S, V and K remain NOT CLEARED with no execution evidence; class D and class H remain
DISQUALIFIED."* **K7 and K8 remain NOT CLEARED** (§4.12, MSG-0123); **K3 and K4 remain NOT CLEARED**
under MSG-0119's strict Q11 reading; **K5, K6 and every negative control remain DISQUALIFIED**; the
eight §4.8 design verdicts and the eight §4.10 design verdicts stand. **Five probes have cleared
nothing, and this section clears nothing.** The full reproduction is in **MSG-0132**.

**The measured results a topology proposal has to survive**, each carried from where it was measured
rather than restated as a new claim:

| # | Result | Where |
|---|---|---|
| **F1** | **`U` equals the number of unauthorized rows the routed structures still contain.** Isolation reduces `U` exactly insofar as it removes unauthorized rows from the structures opened, **and by nothing else** — two independent measurements agreeing at every design and every collection size | §4.8 finding 1 |
| **F2** | **A global lexical or vector index undoes perfect partitioning.** A partitioned base paired with one scope-spanning secondary structure puts traversal back over a structure spanning every authorization scope — **disqualifying under E1 regardless of any counter** | §4.8 I6; §4.6 S6/E1 |
| **F3** | **Partial isolation can be worse than none.** Scope-only partitioning examined **the most** of any design measured, by moving work from an index restriction into a structural scan without carrying the rest of the predicate | §4.8 finding 2, design P1 |
| **F4** | **The four discrete conjuncts refine perfectly; effectivity is the entire residual.** In the sharpest measurement **not one** wrong-scope, wrong-audience, restricted-class or superseded unit was examined at any size — the residual was composed **exclusively** of the three effectivity failure modes | §4.11 result 2 |
| **F5** | **Instant-refined effectivity decays into leakage, not conservatism.** Where examine-then-reject examines unauthorized rows and discards them, a stale materialised structure **returns** them — 5 of 5, at every collection size | §4.8 finding 3, design P4S |
| **F6** | **Divergence happens at ZERO elapsed time.** An authorization fact changing in the kernel puts unauthorized rows in the routed structures immediately. **No timer can observe this**, corroborated in three independent fixtures | §4.10 finding 5; §4.11; §4.8 finding 1 |
| **F7** | **A hook is only as complete as the set of changes it is wired to.** Delivered as a recorded transition the change was caught; delivered as an attribute reassignment outside that set, **only the designs re-checking against the kernel survived** | §4.10 |
| **F8** | **Removing the copy does not help.** The designs holding **no copy at all** eliminate divergence, answer every scenario, and carry the **largest `U` in the record, growing linearly with `N`** | §4.11 result 1 |
| **F9** | **`U = 0` is purchasable by withholding authorized content.** One design reached zero at every size while returning an **empty ANSWER** where an answer existed — a **wrong-exclusive** availability defect, **invisible to `U` by construction** | §4.11 result 3, design K4 |
| **F10** | **A design can report `U = 0` while the structures it opens still hold unauthorized entries.** Two designs reporting zero carried `Ustruct` of **714** and **2143** | §4.11 result 4 |
| **F11** | **On the one measured class, the planner decided the outcome** — one index-hint token, same schema, data, indexes, answers and grid, `U` **715 → 0** | §4.11 result 5 |
| **F12** | **And a routine maintenance command decided it.** Statistics maintenance alone drove the same design's `U` from **2857 to 0** while entries visited went **2860 → 2861 — one more, not fewer** | §4.12 |
| **F13** | **A row-access zero is not an index-cursor zero.** An entry failing the residual is rejected **from the index** and the row is never read, so a row-access counter **cannot fire for it** | §4.6 S7-R3; §4.12 gap 2 |
| **F14** | **E1 splits, and one limb was obtained plan-independently.** A compilation-time enumeration of every structure a statement **may** read returned a **superset** of what any plan opens, invariant with collection size, identical in every configuration, and **failed the negative control** — while the **confinement** limb was **not** plan-independent | §4.12 gap 3 |
| **F15** | **E4 was established UNOBTAINABLE on the only reachable test subject, by enumeration with a control.** Under §4.6 S6 **no candidate could have been cleared in that run whatever any count showed** | §4.12 gap 1 |
| **F16** | **Per-principal materialisation (I5) discharges four conjuncts and has never been measured.** | §4.8 |

**F11 and F12 together are the argument for this section's existence.** If a maintenance command can
flip a design's `U` between 2857 and 0 without touching schema, data, index, query text or design,
then **whatever satisfies the gates cannot be a property of an engine's optimizer.** MSG-0129's
instruction not to *"assume that a particular engine's planner behaviour generalizes to the class"*
is the conservative reading of that; the stronger reading, and the one this section takes, is that
**a property held only by the optimizer is not held by the architecture at all.**

#### The reduction — what the evidence forces the answer to be

**F1 is the whole reduction.** `U` falls only as unauthorized entries leave the structures the
traversal opens. Every other lever measured in five probes — widening an index, pushing a conjunct
into a `WHERE` clause, joining the authoritative facts inline, pinning a plan, removing the copy —
**moved `U` without changing what the opened structures contained, and none reached a defensible
zero.**

**So the topology requirement is a statement about containment and reach.** It is stated as five
invariants, numbered so a proposal can be failed against them.

| | Invariant | Why, from the evidence |
|---|---|---|
| **N1** | **Containment.** Every structure the traversal may open contains, **at answer time**, no entry unauthorized for the routed subject — **for every conjunct, effectivity included** | **F1** — the only measured mechanism by which `U` falls. **F4** says four of the five conjuncts already do this; **effectivity is the entire remaining problem** |
| **N2** | **Closure of the reachable set.** The set of structures the query **may** open is enumerable **before execution**, contains no scope-spanning structure, and **includes every secondary structure** — lexical index, vector index, ANN graph or centroid set, term dictionary, document-id map, corpus-wide scoring statistics, structure catalogue | **F2** and **G-Q6.3**. **F14** shows this limb is obtainable **plan-independently** on at least one engine class, which is what makes N2 a checkable requirement rather than an aspiration |
| **N3** | **Refinement by enumerated transition.** The partition invariant is restored by **the recorded event that would break it**, never by a timer; and **the set of breaking events is enumerated and closed** | **F5, F6, F7.** MSG-0113 already made this move for lifecycle transitions and the Lead ruled it; **F6 shows the same is required for changes that consume no time at all** |
| **N4** | **Plan-independence.** Whether unauthorized content is examined is **not** a function of the optimizer's choice, of a statistics-maintenance command, of the data distribution, or of an engine version | **F11, F12.** A security property a maintenance command can toggle is not a property of the architecture |
| **N5** | **Non-withholding.** The routed structures contain **every** entry the subject **is** authorized to see. A topology reaching N1 by dropping authorized content has traded a confidentiality defect for an availability one | **F9.** `U = 0` is purchasable, and the purchase is invisible to `U` |

**The load-bearing claim of this section, stated so it can be attacked:**

> **N1 and N2 together make N4 free.** If every structure within reach contains only entries the
> routed subject is authorized to see, then **no plan over that reachable set can examine an
> unauthorized unit** — whatever the optimizer chooses, whatever the statistics say, and whatever a
> maintenance command rewrites. **The planner's freedom stops mattering exactly when there is nothing
> unauthorized left for it to reach.**
>
> **This is the precise sense in which the Q3 answer is topological rather than engine-behavioural.**
> §4.12's maintenance-command result is not an argument for finding a better-behaved planner; it is
> an argument for a topology in which planner behaviour **cannot decide the question.**

**Three caveats on that claim — each is where it could fail, and none is hypothetical:**

1. **It holds only if N2's reachable set is genuinely complete.** A single omitted secondary
   structure — a shared dictionary, a corpus-wide statistics table, a catalogue read during routing —
   reintroduces exactly the traversal F2 disqualifies. **This is why N2 must be established by
   enumeration at compilation or authorization time (F14) and never by reading the query text.**
2. **It does not discharge E2 and must not be read as doing so.** `U` counts what the engine
   **examined**; N1 is a claim about what the structures **contain**. **F10 is the demonstration** —
   two designs reporting `U = 0` while holding 714 and 2143 unauthorized entries. **N1's own
   measurement already exists and is placement-independent: `Ustruct`, defined in §4.11.** So the
   topology's central claim is falsifiable by an instrument this record has already built and used,
   which is the most that can be said for a structural claim.
3. **It says nothing about U5 or about routing-phase units.** Buffers, caches, temporary structures
   and log lines (§4.6 S4 **U5**) and every unit read while **selecting** structures (**G-Q4.4**)
   remain in scope and are not addressed by containment.

**N1 is an instantaneous property, and that is the fragile part.** §4.8 finding 3 put it exactly:
*"`U = 0` for a materialised structure is a property of an instant, not of a design."* **N3 exists to
convert an instantaneous property into a maintained one**, and **F6 is the proof that a clock cannot
do it.**

#### Two additions to §4.8's catalogue — extended, not replaced

**§4.8's I0–I6 are measured and are kept.** A fresh catalogue would discard five probes of evidence,
and MSG-0130's second required work item forbids relabelling any of it. **Two patterns are added
because the evidence identifies gaps the existing six do not cover.** Both are **structural
proposals and neither has been measured**; under **G-Q6 neither can contribute to a clearance.**

| | Pattern | Conjunct discharged | Status |
|---|---|---|---|
| **I7** | **Boundary-refined effectivity** — the structure holds what is effective across the **half-open interval to the next effectivity boundary**, and is re-refined **at** that boundary rather than on a timer | 3, **without a decay term** | **Structural proposal. NEVER MEASURED** |
| **I8** | **Entitlement-class materialisation** — one structure per **equivalence class of subject entitlement sets**, rather than per token (I3) or per principal (I5) | 1, 2a, 2b, 4 — the I5 set, at a coarser key | **Structural proposal. NEVER MEASURED** |

> **Both rows have since been measured, and both are left as TASK-0041 wrote them.** Note added
> 2026-08-24 by **TASK-0042** under **MSG-0137**; **additive — nothing above is deleted or reworded.**
> **I7 and I8 were BUILT AND RUN and both are NOT CLEARED** (**§4.14**), so *"NEVER MEASURED"* in the
> Status column is **no longer true of `U`** — and **remains true** of the costs and mechanisms §4.14
> lists with their exact limitations, **I7's re-refinement rate and its abstention-on-breach mechanism
> among them**. **The measurement is in §4.14 and is deliberately not restated here.** **Two results
> below are worth the reader's attention before proceeding**: **I8 measured identically to K7 at every
> size**, and **I7 reached `U` = 0 and failed anyway — by WITHHOLDING**, at the boundary and on
> ingestion inside the interval, exactly as the third bullet under this table predicted.

**I7 answers the residual F4 names, and its argument is written out because it contradicts a reading
of §4.8 that would otherwise stand.** §4.8's refinement rule requires that *"every row in a partition
agree on that conjunct's truth value for every subject routed to it"*, and §4.8 concluded that
**effectivity-at-answer-time does not refine at all without fixing a time**, refining only *as of an
instant* and **decaying from that instant onward**. **That conclusion is precise, and it was read one
step too pessimistically.**

**Effectivity is piecewise constant in time.** The set of versions effective at `T` changes only when
`T` crosses some version's `effective_from` or `effective_to` — and **those boundaries are data
already held in the kernel, not a tuning parameter.** So on the half-open interval from an instant
`t` to the **next boundary after `t`**, every row's effectivity truth value is constant **by
construction**, and **§4.8's refinement rule is satisfied on that interval.** I4 fixes a point and
decays; **I7 fixes an interval whose end is computable, and is invalidated by the event of reaching
it.** That is the move MSG-0113 made for lifecycle — freshness is a **transition** property, not an
elapsed-time one — **applied to a second class of transition.**

**Three costs and traps of I7, recorded with no figure attached because none was measured:**

- **The interval end is a corpus-wide minimum**, so it **shortens as the corpus grows**. The
  re-refinement rate is a function of the corpus's boundary density, which is **UNKNOWN** — §11 #1,
  corpus scale, is unmeasured at n=1.
- **A version added to the projection between `t` and the next boundary changes the partition without
  any boundary being crossed.** **Ingestion is therefore itself an invalidating event** under N3, and
  it is the one a boundary-driven design omits most naturally.
- **I7 is an I4 descendant, so G-Q5 applies to it in full, unrelaxed.** Its interval end is a **bound
  that exists and has a value** in G-Q5.1a's sense, but **G-Q5.1c's abstention-on-breach and
  G-Q5.2's kernel re-check are unchanged and are execution evidence.**

**I8 sits between I3 and I5.** I3 replicates per audience token and fans a subject's query in across
tokens; I5 gives one structure set per principal and **has never been measured**. Keying on the
**equivalence class of entitlement sets** collapses subjects who see exactly the same corpus into one
structure set — fewer structures than I5, no cross-token fan-in of I3 — at the cost of a **class
count that is combinatorial in the worst case** and a **further invalidating event**: a subject's
entitlement change moves them between classes. **No class count, replication factor or fan-out figure
is claimed; none was measured.**

#### Four topology patterns, defined technology-agnostically

**No product, engine, vendor or index technology is named as the bearer of any property below**, and
none of these is a shortlist entry. Each is a **composition** over §4.8's catalogue as extended.

| | Topology | Composition | The idea in one line |
|---|---|---|---|
| **W1** | **Fully refined partitioning with boundary-maintained effectivity** | I1 + I2 + I3 + **I7** + I6 | Refine every conjunct structurally, effectivity included, and build **every secondary structure per partition** |
| **W2** | **Per-principal materialisation** | **I5** + **I7** + I6 | One reachable structure set per principal; routing is the identity of the requester |
| **W3** | **Entitlement-class materialisation** | **I8** + **I7** + I6 | W2's shape at a coarser key — one structure set per distinct entitlement class |
| **W4** | **Scoped execution confinement** | any of W1–W3, **plus** a retrieval component instance whose **reachable dataset is the routed partition** | Move the confinement boundary from the schema to the **execution context**: the component cannot open what is not in its dataset |

**W4 is a different axis, not a fourth alternative, and it is included because F14 is what suggests
it.** The one limb of E1 obtained **plan-independently** was an enumeration, at compilation, of every
structure a statement **may** read. **W4 generalises that**: if the reachable set is bounded by the
execution context rather than by the query, then **N2 is checkable at a coarser and more auditable
granularity** — what the component can open **at all**, rather than what this statement chose to open.
**It composes with W1, W2 or W3 and replaces none of them.**

**What W4 is NOT.** It is **not** a claim that process, container or dataset isolation substitutes
for any gate — **every gate below applies to it unchanged.** And it is **not** a licence to read
*"physical"* as *"one store per tenant and therefore done"*: **MSG-0101 §1(1) still binds — one
logical projection.**

#### The mapping — each topology against E1–E4 and G-Q4/G-Q5/G-Q6

**Legend, and it is the point of the table.** **S** = **structurally supplied**: the property follows
from the topology's construction and does not depend on engine behaviour. **X** = **execution
evidence required**: no structure can supply it, and §4.9 G-Q6 forbids arguing it from construction.
**S→X** = the structure creates the **precondition** and the evidence is still owed.

| Requirement | W1 | W2 | W3 | W4 | The property, and why it lands where it does |
|---|---|---|---|---|---|
| **E1 — reachable-structure limb** | **S→X** | **S→X** | **S→X** | **S→X** | The topology determines the reachable set; **that it is what the engine actually reaches is F14's compilation-time enumeration**, which is evidence and has been obtained once. **Structure proposes; enumeration disposes** |
| **E1 — confinement limb** | **S→X** | **S→X** | **S→X** | **S→X** | **Made vacuous by N1 if N1 holds** — nothing unauthorized is reachable to confine. **That N1 holds at answer time is `Ustruct = 0`, a measurement** (§4.11), not a construction |
| **E2 — `U = 0`, invariant with `N`** | **X** | **X** | **X** | **X** | **No topology can supply a count.** Under **§4.6 S7-R1/R2/R3** every **reachable index-cursor placement must be exercised**, the maximum reported, and the reachable-but-unexercised set **empty** |
| **E3 — opaque stages** | **S→X** | **S→X** | **S→X** | **S→X** | **I6 confines the stage; G-Q6 rejects construction as the discharge** and admits it only as a **contributor** (G-Q6.4). Where a topology carries **no** opaque stage, that must be shown **by enumeration**, not asserted |
| **E4 — engine logs** | **X** | **X** | **X** | **X** | **No topology property whatsoever.** This is an **engine-exposure** criterion (§4.6 S10), and **F15 is decisive**: on the only reachable test subject E4 is **UNOBTAINABLE**, so nothing could be cleared there under any topology |
| **G-Q4.1 routing from entitlements alone** | **S** | **S** | **S** | **S** | **The strongest structural result in the table.** W2 and W3 route on the requester's own identity or entitlement class; W1 computes an exact key from the entitlement set. **None needs to consult the corpus in order to route** |
| **G-Q4.2 differential test** | **X** | **X** | **X** | **X** | Whether the routed set and the routing-phase read count are **invariant to other subjects' partitions** is behavioural (§4.9), and it has already failed one design that returned identical answers |
| **G-Q4.3 no catalogue enumeration** | **S→X** | **S→X** | **S→X** | **S** | Computing a name is structural; **that the engine resolves it by exact key rather than by scanning a catalogue is plan or trace evidence** — §4.9's *"behaviourally identical and only one satisfies the gate"*, since demonstrated. **W4 is the one case where the catalogue is itself bounded by the execution context**, and even there the resolution must be exhibited |
| **G-Q4.4 routing units counted in `U`** | **X** | **X** | **X** | **X** | A counter at the routing step specifically, placement recorded, **at the S7 placement rules including S7-R1** |
| **G-Q5.1 bounded re-materialisation** | **S→X** | **S→X** | **S→X** | **S→X** | **I7's interval end is a bound whose value is data**, which is G-Q5.1a. **G-Q5.1b (a clock the candidate does not control), G-Q5.1c (abstention on breach) and G-Q5.1d (the instant recorded with every zero) are all execution evidence** |
| **G-Q5.2 kernel re-check, demonstrated to reject** | **X** | **X** | **X** | **X** | **Unchanged and undiminished by any topology. F7 is why** — the re-check is what caught the change no invalidation hook was wired for. **G-Q5.2b's no-op limb is the one most easily faked** |
| **G-Q6 opaque-stage confinement** | **X** | **X** | **X** | **X** | **MSG-0110 §4 in terms.** Per-partition secondary structures are a **contributor**; the discharge is execution evidence of the actual traversal boundary |
| **G-Q7.1–7.6 version-transition freshness** | **S→X** | **S→X** | **S→X** | **S→X** | **N3 is the structural half** — an enumerated, closed event set. **G-Q7.2's discriminator, G-Q7.4's abstention and G-Q7.5's re-check are execution evidence** |
| **G-Q7.8a–e re-check is a control-plane lookup** | **X** | **X** | **X** | **X** | Requires **two separated counters**; without the separation a violating design reports clean |
| **N5 non-withholding** | **X** | **X** | **X** | **X** | **The served set must be measured alongside `U`. F9**: a design that answers nothing reaches zero |

**Read the table by its columns and the finding is uncomfortable and correct.** **The four topologies
differ from one another in exactly one cell** — G-Q4.3, where W4's execution-scoped catalogue is the
only structural rather than conditional entry. **Everywhere else they are identical.** That is not a
defect in the analysis; **it is the answer to Q3.** Topology decides **G-Q4.1 outright** and creates
the **precondition** for E1, E3, G-Q5.1 and G-Q7. **It decides E2, E4, G-Q5.2, G-Q6, G-Q7.8 and N5
not at all.** A future session choosing between W1–W4 is therefore choosing on **cost and
operability**, not on clearance — and **the cost figures do not exist.**

#### The minimum evidence before any engine-selection task could be authorized

**MSG-0130 asks for evidence, not a shortlist, and this is the list.** Each item states what
discharges it. **All twelve are necessary, none is sufficient, and satisfying all twelve is what
§4.6 S6 already means by CLEARED** — this list **adds no gate and relaxes none.**

| | Evidence | Discharged by |
|---|---|---|
| **EV1** | **E1's reachable-set limb, plan-independently** | An enumeration taken from the engine's own compilation or authorization surface, **characterised rather than assumed** (shown invariant with `N`, so it is a compilation event and not a counter), returning **no scope-spanning structure**, and **demonstrated to FAIL a negative control.** F14 is the worked standard |
| **EV2** | **N1 itself, measured: `Ustruct = 0`** | The placement-independent count of §4.11 — unauthorized entries **present in the structures the traversal opens** — **zero at every measured collection size and at every measured instant.** **This is the item that would have caught the two designs reporting `U = 0` over 714 and 2143 unauthorized entries** |
| **EV3** | **E2 under the full S7 placement rules** | `U = 0` at **≥ 3 collection sizes**, shown **invariant with `N`**; **every reachable index-cursor placement exercised** (S7-R1); the **maximum** reported as `U` (S7-R2); the **reachable-but-unexercised set EMPTY** (S7-R3). A *"no such placement is reachable"* report is admissible **only by enumeration with a control** (S7.3) |
| **EV4** | **E3 for every opaque stage** | G-Q6.1–G-Q6.4: execution evidence of the actual traversal boundary, evidence about the **mechanism** rather than one run, and explicit evidence that **no shared out-of-partition structure** is consulted. **Or:** a demonstration **by enumeration** that the topology carries no opaque stage |
| **EV5** | **E4, or its unobtainability established** | Inspection of the engine's own logs showing no unauthorized passage text — **or** unobtainability established **by enumeration with a control** (F15's nonexistent-pragma control is the standard). **Note the asymmetry: unobtainable is NOT relief.** Under §4.6 S6/S10 it yields **NOT CLEARED**, so **an engine that cannot supply EV5 cannot be selected under any topology** |
| **EV6** | **G-Q4.1–G-Q4.4 in full** | Including **the differential test** — same subject and query against collections differing **only** in other subjects' partitions, with an **identical routed set and identical routing-phase read count** — and routing-phase units counted into `U` at the S7 placements |
| **EV7** | **G-Q5, both conditions** | A bound that exists, is enforced against a clock the candidate does not control, **breaches into abstention A7 rather than a degraded answer**, and **every `U = 0` carrying its materialisation instant**; plus a kernel re-check **demonstrated to REJECT**, not merely to run |
| **EV8** | **G-Q7.1–G-Q7.6 and G-Q7.8a–e** | Including MSG-0113's **discriminator** — the transition queried **both before and after** the periodic mechanism would have fired — and **two separated counters** for the re-check, one of which must read **no content-bearing data from an unauthorized candidate** |
| **EV9** | **N3's event set, exhibited and closed** | The enumerated set of invalidating events, **each demonstrated to restore the invariant.** It must include the classes the record shows are most easily missed: **zero-elapsed-time authorization-attribute reassignment** (F6, F7), **effectivity-boundary crossing** and **ingestion into the projection** (I7's own traps), and, for W3, **a subject changing entitlement class** |
| **EV10** | **N5, measured** | The **served set** reported alongside `U` in every cell, with at least one scenario in which an answer exists. **A design returning an empty answer where an answer exists fails**, whatever its `U` |
| **EV11** | **Plan- and maintenance-independence** | The same verdict in **every** configuration cell, across at minimum: baseline; **after statistics maintenance**; with and without any available plan pinning; fresh connections; a shifted query instant; and **≥ 2 data distributions**. **F12 is why this is not optional** — a single-configuration measurement is a measurement of one plan |
| **EV12** | **Both validity gates, per run** | The **adversarial precondition** verified before **every** measurement (the unconstrained top-`k` contains **no** authorized chunk), and a **negative control that FAILS**. **§4.6 S8: if the harness does not fail the control, the run is void and its passes prove nothing** |

**Two scoping rules on this list, both carried from the record rather than invented here.** **No
result may be generalized from one build to an engine class** (§4.12; MSG-0130) — evidence obtained
against a specific runtime, version and configuration is evidence about that, and must say so. And
**EV1–EV12 are obtained against a test subject, which is not a selection**: naming a candidate names
a **test subject** (§4.6 S11; MSG-0101 §3).

#### The bounded recommendation, and what stays open

**MSG-0130 permits a bounded architecture recommendation or the preservation of the choice as open.
This section does the second for the topology choice and the first for one criterion**, on §12.2's
precedent — *recommend criteria, not selections.*

> **R1 — recommended for recording as settled, subject to the Lead's ruling.** **The architectural
> response to Q3 is N1 + N2: stop requiring the engine not to examine unauthorized content, and
> instead ensure there is no unauthorized content within its reach.** The **confinement limb of E1
> becomes a property the topology makes vacuous** rather than one the engine must prove, and the
> surviving question — whether containment actually holds at answer time — is answered by a
> **placement-independent measurement that already exists** (`Ustruct`, §4.11) rather than by an
> instrument whose placement can flatter it.
>
> **R1 selects nothing, clears nothing, and amends no ADR.** It is a **criterion**, and like every
> item in §12.2 it is a consequence of already-accepted material — **AMD-01's strict Shape-1, §4.6
> S6/E1, and §4.8 finding 1** — rather than a new decision.

**The topology choice among W1–W4 stays OPEN, and the reason is a named missing measurement rather
than indecision.** The mapping table shows the four are **indistinguishable on clearance** and differ
on **structure count, replication factor, invalidation fan-out, re-refinement rate, and the cost of
splitting scoring statistics across per-partition secondary structures.** **Every one of those is
unmeasured**, and the corpus scale that would size them is **UNKNOWN at n=1** (§11 #1). **Choosing
between them now would be choosing without evidence, which is the failure mode this section exists to
avoid.**

**§12.1's engine-selection row is unchanged: OPEN, and now additionally blocked.** MSG-0129: a future
engine *"may be selected only after the existing clearance gates are positively satisfied with
evidence."*

#### The architecture gap, recorded because selection stays blocked

**MSG-0130: *"If the evidence cannot establish a topology capable of satisfying the existing gates,
record the architecture gap and keep selection blocked."*** The gap is recorded here. **It is the
honest outcome and not a failure of the task** — §4.7 Q3 anticipated it, and an open choice preserved
as open is a valid result.

| | Gap | Consequence |
|---|---|---|
| **GAP-A** | **I5, I7 and I8 have never been measured.** §4.8 recorded I5 as *"not measured"* and nothing since has measured it; I7 and I8 are introduced above as structural proposals | **No topology in this section is shown capable of satisfying the gates.** All four rest on at least one unmeasured pattern |
| **GAP-B** | **E4 is UNOBTAINABLE on the only reachable test subject** (F15) | **This blocks clearance independently of topology.** A future probe on the same subject **would clear nothing whatever the topology**, because an absent evidence class is NOT CLEARED by rule (§4.6 S6). **Reaching a clearance at all requires a test subject that exposes its own log, or is shown to write none** |
| **GAP-C** | **Cost is entirely unmeasured** — structure count, replication factor, invalidation fan-out, re-refinement rate, split scoring statistics | The choice among W1–W4 cannot be made on evidence. **No figure is claimed and none was produced** |
| **GAP-D** | **The addressable temporal frame is unsettled** — see **Q13** below | I7's interval is defined relative to a query instant; a question addressing a **different** temporal frame addresses a different interval |
| **GAP-E** | **§4.7 Q1 and Q2 remain OPEN**, and **Q7's numeric limb** remains open | MSG-0129 ruled Q3 **without** ruling Q1 or Q2. The fail-closed default recorded for each continues to apply, so **none of them blocks the evidence work above** |

**GAP-B is the one to read first.** It says the topology work this section performs is **necessary and
nowhere near sufficient**, and that the next binding constraint is an **engine-observability**
property that **no amount of architecture can supply.**

> **GAP-E is DISCHARGED, and the row above is left as TASK-0041 wrote it.** Note added 2026-08-24 by an
> interactive COMMS session; **additive, nothing deleted**. **Q1 is ruled A** (MSG-0134), **Q2 is ruled
> B** (MSG-0135) and **Q7 is ruled A** (MSG-0136) — see the notes at each heading and
> [`EPA-0006-Q1-Q2-Q7-reconciliation.md`](EPA-0006-Q1-Q2-Q7-reconciliation.md). **GAP-A, GAP-B and
> GAP-C are NOT discharged**, and **GAP-B still blocks clearance independently of topology.**
>
> **Sentences elsewhere in this record still say Q1 and Q2 are open** — §4.7's own bodies, §4.11, and
> the numbering paragraph below among them. **They were true when written and are deliberately not
> rewritten**; the heading notes carry the current state. Whether this record should be updated in
> place more fully, on TASK-0040's declared mechanism, is **the Architecture Lead's call** and is
> recorded in MSG-0139.

#### Q13 — which temporal frames must a topology be able to answer? **RULED by MSG-0133** — Release 1 is the current/"now" frame only

> **RULED by MSG-0133 — Release 1 is the current/"now" temporal frame only.** Note added 2026-08-24 by
> an interactive COMMS session; **additive — nothing below is deleted or reworded**, so the referral
> reads as TASK-0041 made it. **The heading is the one exception**, changed from *"Surfaced, NOT
> decided"* because **MSG-0133 instructs that change in terms**. Historical and future frames are **out
> of scope for Release 1**, a non-now request **must ABSTAIN**, and effective-date and supersession data
> **stay captured** so a later, separately authorized capability loses no history. **The ruling text is
> in MSG-0133 and the reconciliation in
> [`EPA-0006-Q13-release-1-temporal-scope-reconciliation.md`](EPA-0006-Q13-release-1-temporal-scope-reconciliation.md);
> it is deliberately not restated here.** **GAP-D is discharged as a scope decision. I7 remains a
> structural pattern and remains NEVER MEASURED. No verdict, gate or selection authority changes.**

**Numbering:** §4.7 holds **Q1–Q3**; **Q3 is now ruled** by MSG-0129 and answered above, with **Q1 and
Q2 still open**. **Q4–Q6** are ruled and encoded in §4.9; **Q7** is ruled with its numeric limb open;
**Q8–Q10** are ruled (MSG-0116a/b); **Q11** is ruled by MSG-0119; **Q12** is ruled by MSG-0124 and
encoded in §4.6 S7.1–S7.4. **Q13 is the next free number**, allocated here and verified unused.

**The question.** §3 constraint 3 defines effectivity as evaluated at *"`T`, the question's temporal
frame, **defaulting to now**"* — which admits questions whose frame is **not** now. **I7 refines
effectivity on the interval containing a given instant**, so a structure refined for the interval
around *now* **cannot answer a question addressed to a different interval**, and a topology required
to serve an arbitrary `T` needs a structure per addressable interval.

**Is the addressable temporal frame restricted to *now* for release 1, or must the retrieval topology
serve historical and future frames?** The two have materially different topologies and materially
different costs.

**Why it is referred rather than answered.** It is a **product and architecture** question — what an
employee may ask — and settling it here would decide the scope of ADR-0018 §4's effectivity semantics
by implication. **This record proposes no answer.**

**Default until ruled, and it blocks nothing: the strictest available reading — a topology must serve
only the frames the answer path actually admits, and any frame it cannot serve must ABSTAIN rather
than answer from the wrong interval.** That is fail-closed in the same shape as G-Q7.4, it can only
withhold an answer and never grant an unauthorized one, and **it requires no ruling to operate.**

#### What this section does NOT establish

- **Nothing is CLEARED, and nothing could have been.** This section is structural, and **G-Q6 rejects
  construction-only evidence.** **Five probes have cleared nothing and this section clears nothing.**
- **No topology is shown capable of satisfying the gates.** W1–W4 are **proposals mapped against the
  gates**, and all four rest on at least one **never-measured** pattern (**GAP-A**).
- **No engine, runtime, provider, model or index technology is selected, adopted, recommended,
  installed or deployed**, and **no shortlist is created.** No product is named as the bearer of any
  property above.
- **No prior verdict changes and nothing is relabelled.** **K7 and K8 remain NOT CLEARED**; **K3 and
  K4 remain NOT CLEARED**; the **DISQUALIFIED** set is unchanged; the nine MSG-0104 class and
  candidate verdicts, the eight §4.8 design verdicts, the eight §4.10 design verdicts and **every**
  §4.11 and §4.12 design verdict all stand. **No prior probe was modified or re-run.**
- **No gate is weakened and no bar is moved.** `U = 0`, **E1–E4**, **G-Q4/G-Q5/G-Q6/G-Q7/G-Q7.8** and
  **S7-R1/R2/R3** are reproduced as they stand. **No numeric threshold, tolerance or allowance is
  introduced.**
- **No ADR is amended, proposed, or affected**, and **MSG-0101 §1(1) is not reinterpreted** — *"one
  projection index"* still means one **logical** projection.
- **No numeric figure of any kind is produced** — no benchmark, latency, capacity, recall,
  throughput, structure count, replication factor or fan-out. Where a cost is named it is named as
  **unmeasured**.
- **No planner behaviour is generalized from one build to an engine class**, and no measured result
  above is re-derived — each is carried from the section that measured it.
- **No implementation task is authorized or marked READY**, and **no engine-selection task becomes
  executable.** MSG-0129: selection follows the gates being *"positively satisfied with evidence"*,
  and MSG-0130's acceptance ends at this documented response.

---

### 4.14 Architecture-bound evidence: routing, placements, transitions, I5/I7/I8 (TASK-0042, MSG-0137)

**Added 2026-08-24 by TASK-0042. Additive and declared: nothing in §4.1–§4.13 is deleted or
reworded, and no verdict changes.** This section records what happened when the evidence the four
rulings make possible was actually taken. **It amends no ADR, invents no threshold, relaxes no gate,
and selects, adopts, recommends, installs and deploys no engine.** Authority: **MSG-0137**, with
**MSG-0134 (Q1 = A, strict)**, **MSG-0135 (Q2 = B)**, **MSG-0136 (Q7 = A)** and **MSG-0133 (Q13)**
binding. Full evidence: **MSG-0140**; harness and captured output at `implementation/probes/TASK-0042/`.

**Six candidates measured. All six NOT CLEARED. Nothing here clears anything**, and **E4 alone would
have been enough for that** — which §4.13 GAP-B said in advance and section 2 of the probe re-checked.

**What was NOT re-run, because item 3 forbids repetition:** TASK-0033's sweep, TASK-0035's P0…NC
grid, TASK-0037's 8×11 freshness grid, TASK-0038's 7-scenario grid, TASK-0039's 12-configuration grid
and its `M=20000` column. **All of it stands as measured.** The **validity gates were re-run**,
because §4.6 S8 requires them in every run and without them this run's numbers would prove nothing.

#### Run validity, stated before any number

| Gate | Result |
|---|---|
| Adversarial precondition (§4.6 S8) | **HELD** at `M` = 50 / 500 / 5000 under **both** distributions — unconstrained top-6 contained **0** authorized chunks in all six cases |
| Retrieval negative control | **FAILED in 3 of 3** cases — `U` = 116 / 566 / 5066, answering 1 of 4 authorized chunks |
| **Routing** negative control | **FAILED G-Q4.2 as required** — see below |
| **Freshness** negative control | **FAILED in 6 of 6** cells |
| Index-cursor calibration | **EXACT on both plans** — 302 and 402 reproduced from a constructed cohort |
| Plan-transfer control | **0 of 54** instrumented measurements moved the planner's seek signature |
| Measurements | **18 placement-grid cells + 36 freshness cells**, plus calibration, routing and E4 enumeration |

#### Finding 1 — the G-Q4.2 differential had never been run against a catalogue that could fail it

**This is the correction that matters most, and it is a correction to the evidence base rather than to
a verdict.** TASK-0038 and TASK-0039 both ran the G-Q4.2 differential with other subjects added to the
**kernel** — but their store builder skips any partition key that is not the subject's, saying so in
its own comment: *"other subjects' partitions are not materialised here"*. **So the structure
catalogue those runs routed against contained no other subject's structure at all.**

**A differential that varies rows in a table nobody routes over does not test G-Q4.2.** TASK-0039's
*"G-Q4 MET in all 12 configurations"* was measured, and is not withdrawn — but **it was measured
against a catalogue with nothing in it to find.** This probe materialised other subjects' partitions
**physically**, and counted the catalogue:

| other subjects | catalogue objects | subject's own | **another subject's** | kernel/other |
|---|---|---|---|---|
| 0 | 32 | 20 | **0** | 12 |
| 16 | 128 | 20 | **80** | 28 |
| 64 | 416 | 20 | **320** | 76 |

**The subject's own structure count does not move. The foreign count does.** That is what the
differential needed and had not had.

#### Finding 2 — two routing mechanisms, behaviourally identical, and only one satisfies the gate

**§4.9 G-Q4's design note predicted this and the probe measured it.** `R-COMPUTED` derives structure
names from the subject's entitlements and resolves them by exact key. `R-CATALOGUE` finds them by
scanning the catalogue for names that look applicable. **They select the same four structures** — so
**no functional test could tell them apart.**

| mechanism | others | routed | catalogue rows read | **`U`(routing)** | kernel/other entries |
|---|---|---|---|---|---|
| R-COMPUTED | 0 | 4 | **0** | **0** | 0 |
| R-COMPUTED | 64 | 4 | **0** | **0** | 0 |
| R-CATALOGUE | 0 | 4 | 32 | **0** | 12 |
| R-CATALOGUE | 64 | 4 | **416** | **320** | 76 |

**G-Q4.2, applied:** R-COMPUTED — routed set identical, routing reads **4 vs 4** → **MET**.
R-CATALOGUE — routed set **identical**, routing reads **32 vs 416** → **FAILED**.

> **The gate names both limbs, and this is why.** **A test checking only the routed set would have
> passed the catalogue-scanning mechanism.** It returns exactly the right structures; it simply reads
> 320 catalogue entries naming other subjects' structures on the way. **Under Q1 = A those reads are
> examination** (MSG-0134), and **G-Q4.4 puts them in `U`** — which is why the candidate carrying that
> routing mechanism reports `U` = 320 at `M` = 50, where its retrieval-phase `U` is 7.

**G-Q4.3 is evidenced from the plan, not from the mechanism's name:** `EXPLAIN QUERY PLAN` on the
routing statement returns **`SCAN sqlite_schema`** — a scan over the structure catalogue, disqualifying
on the same reasoning §4.6 S6/E1 applies to a data scan.

#### Finding 3 — routing-phase observability is PARTIAL, and the unmeasurable half is the one Q1's open interaction asks about

**An explicit catalogue read is measurable and was measured. Implicit schema resolution is NEVER
MEASURED on this test subject**, and the limitation is exact:

- the **authorizer** reports `SQLITE_READ` for statements reading `sqlite_schema` **as data**, and
  reports **nothing** for implicit name resolution. On the computed-routing statement it reported
  **8 distinct read targets and none of them a catalogue object**;
- **`SQLITE_ENABLE_STMT_SCANSTATUS` is ABSENT** from this build (the one API that would report
  per-loop visits), and `node:sqlite` binds no hook below statement compilation.

> **`NONE` there means the statement does not read the catalogue as data. It does NOT mean the engine
> performed no schema lookup**, and no reachable instrument on this subject can say. **Under §4.6 S9 an
> unmeasurable stage is NOT CLEARED, never a pass by default.**
>
> **This is §4.9 G-Q4's unnumbered open interaction in its measurable form** — whether an exact-key
> catalogue lookup of an already-computed structure name is itself examination. **The probe decides
> nothing about it.** It records that **the quantity the question asks about is not observable here**,
> which is a fact the ruling needs either way. Kernel-object catalogue reads are **counted separately
> and deliberately not folded into `U`**, for the same reason.

#### Finding 4 — the placement set is now enumerated, and the reachable-but-unexercised set is EMPTY

**§4.6 S7.3 requires that set to be empty, and requires reachability to be established by taking the
placement.** Five were taken:

| | Placement | What calibration showed it counts |
|---|---|---|
| **P-ROW** | `probe_ver(pv.version_id)` | once per **version row accessed** — TASK-0038's placement |
| **P-VIDX** | `probe_idx(pv.open_ended)` | once per **version index entry visited**; reproduced the constructed cohort **exactly** (302 planner-choice, 402 pinned) — TASK-0039's placement |
| **P-CIDX** | `probe_cidx(pc.version_id)` | **NEW — no prior probe took it.** Fires **once per surviving pair**: on this join shape the chunk cursor is entered only for versions that already passed the version-side residual, so **it does not see what that residual rejected** |
| **P-RANK** | `probe_rank(...)` | once per candidate entering the ordering — §4.6 S4 **U3** |
| **P-ROUTE** | `probe_cat(name)` | once per catalogue entry read while **selecting structures** — G-Q4.4 |

**And one the compile options said existed was taken rather than argued away.**
**`SQLITE_ENABLE_DBSTAT_VTAB` is PRESENT** — the only relevant option that is. The `dbstat` virtual
table **is reachable**, and **is not a `U1` instrument**: it reports the **stored layout** of a b-tree,
identically whether a query ran or not, and cannot say how many entries a **traversal visited** —
which is the quantity §4.6 S4 U1 is defined on. **So the unexercised set is empty for the right
reason: the placement was taken and found to measure a different quantity.**

#### The grid — maximum `U` across exercised placements (S7-R2), at three collection sizes

`Nvidx` is engine-measured; **`U1lb` is arithmetic applied to it** and is a **deliberately generous
lower bound**. **A zero in `U1lb` means "this bound proves nothing at this size" — it is NOT `U1 = 0`.**

| Candidate | Pattern | `M`=50 | `M`=500 | `M`=5000 | Growth | Verdict |
|---|---|---|---|---|---|---|
| **K7** | I1+I2+I3, planner-chosen index | **7** | **71** | **714** | **GROWS** | **NOT CLEARED** |
| **K8** | K7, bounded limb pinned | **2** | **66** | **709** | **GROWS** | **NOT CLEARED** |
| **I5** | per-principal materialisation | **7** | **71** | **714** | **GROWS** | **NOT CLEARED** |
| **I8** | entitlement-class materialisation | **7** | **71** | **714** | **GROWS** | **NOT CLEARED** |
| **I7** | boundary-refined effectivity | **0** | **0** | **0** | — **and the bound is VACUOUS in 3 of 3 cells** | **NOT CLEARED** |
| **KR** | K7 structures, catalogue-scanned routing | **320** | **320** | **714** | **GROWS** | **NOT CLEARED** |

> **K8's `M`=50 row is the S7-R3 rule working.** Its **row-access `U` is 0** at every size, exactly as
> TASK-0038 measured. **The figure reported here is 2 / 66 / 709**, because S7-R2 requires the maximum
> across exercised placements and the index-cursor placement is higher. **This is the first grid in
> this record where a row-access zero is superseded by rule rather than by a probe's diligence.**

#### Finding 5 — I5 and I8 measure IDENTICALLY to K7, and that is the result

**I5 (per principal) and I8 (per entitlement class) discharge conjuncts 1, 2a, 2b and 4 — but not 3.**
Their measured `U` is **7 / 71 / 714 — the same as K7's at every size**, on one routed structure
instead of four.

**§4.8 finding 1 predicted exactly this and is corroborated in a third independent fixture:** *"`U`
equals the number of unauthorized rows the routed structures still contain… isolation reduces `U`
exactly insofar as it removes unauthorized rows from the structures opened, and by nothing else."*
**A finer partition key that does not refine the effectivity conjunct removes no unauthorized row, so
it reduces `U` by nothing.** **I5 and I8 are not improvements on K7 in the only dimension the gate
measures**, and neither is cleared by being finer-grained.

#### Finding 6 — I7 reaches `U` = 0 and fails anyway, in the direction a counter cannot see

**I7 is the only pattern whose measured `U` is zero at every size**, because refining on the interval
to the next boundary discharges effectivity **by construction** for that interval. **§4.13's argument
holds as far as it goes.** It does not go far enough, and the probe measured both reasons:

- **At the boundary.** The next effectivity boundary is **computed from kernel data** (`eff_from` /
  `eff_to`) and lands **15000 fixture units** after the query instant. Crossing it without re-refining:
  the structure returned **4 rows, leaked 0** — the kernel re-check caught the leak — **and WITHHELD
  142 of the 146 authorized chunks the kernel held at that instant.**
- **Inside the interval.** A version **ingested** between `t` and the boundary — **no boundary
  crossed** — **did not appear in the answer.** §4.13 named this in advance: *"ingestion is therefore
  itself an invalidating event under N3, and it is the one a boundary-driven design omits most
  naturally."* **It is measured here, not predicted.**

> **Both failures are WITHHOLDING, and `U` is blind to both.** §4.6 S5 warns that a zero count may be
> an artefact of placement; §4.10 result 4 extended that to a non-zero count concealing opposite
> outcomes. **This extends it again: a genuine, correctly-placed `U` = 0 can sit on top of a design
> that answers almost nothing it should.** **§3.3 wrong-exclusive and the K4 trap both say that cannot
> be traded for a clean `U`** — and the record now has a measurement of it rather than a warning.

#### Finding 7 — the four Q7 transitions, with the discriminator, and the faked re-check isolated

**Six transitions × six designs × two instants = 36 cells.** The instants are **before** and **after**
a periodic timer fires — **G-Q7.2's discriminator**. *The period is a fixture constant, present only
so a "before" and an "after" exist; no magnitude is judged, proposed or recommended, and Q7 = A
introduces no threshold.*

| Design | Mechanism | Passes at BOTH instants |
|---|---|---|
| **T1** | materialised, **periodic only** | **0 / 6** |
| **T2** | + transition-triggered invalidation, hooked to **lifecycle state only** | **2 / 6** |
| **T3** | + kernel consult for currency + §3 point-2 re-check **against the kernel** | **6 / 6** |
| **T4** | **authoritative partitioned store** — the truth lives in the partition, no copy | **6 / 6** |
| **T5** | as T3 but the re-check reads **the copy** | **5 / 6** |
| **NCF** | negative control — falls back to the last good snapshot | **0 / 6** — the control failed as required |

**Aggregate failure counts, taken from recorded flags rather than from the displayed verdict string**
(a cell that is both stale and unauthorized displays only the first; **the categories overlap**):
**15 of 36** answered the prior version at at least one instant; **12 of 36** answered a version
unauthorized for the subject; **6 of 36** returned an **empty answer** where an abstention was
required (G-Q7.4); **6 of 36** withheld an authorized current version.

**The discriminator fired in 4 cells** — T1 and NCF on *update* and *approval* — each **failing before
the timer and passing after it**. **Those designs were made correct by waiting, not by the transition**,
which is precisely what MSG-0113 §3 says a fixed-time test cannot detect. **Under Q7 = A the later pass
is not mitigation**, because there is no elapsed-time allowance for it to fall inside.

**T3 versus T5 isolates G-Q5.2b's "limb most easily faked".** On the one transition that separates them
— a version that stays **current** by lifecycle and becomes **unauthorized** by reclassification —
**T3 abstained and T5 answered it.** Same hooks, same consult, same structures; **they differ only in
what the re-check reads.** §4.10 result 3 demonstrated this once; it is now reproduced on an
independent fixture.

> **A defect in this probe's own first version is recorded rather than quietly repaired.** The currency
> consult originally ran the **full authorization predicate**, so it rejected the reclassified version
> before the re-check was reached and **T5 passed 6 of 6** — a control that could not fail. **The
> repair is architecturally the right one anyway: currency is not authorization.** G-Q7.1/G-Q7.3 ask
> whether the answer resolves against the **current** version; ADR-0020 §3 point 2 and G-Q5.2 ask
> whether each hit is **re-authorized**. Separating them is what made the limb testable.

#### Finding 8 — E4, re-checked, unchanged

**The §4.12 enumeration was re-run in full on the runtime as it stands** — SQLite **3.51.3** via
`node:sqlite`, Node **v24.15.0** — including the **nonexistent-pragma control**:

| Check | Result |
|---|---|
| `DatabaseSync` / `StatementSync` prototypes, enumerated at runtime | **no trace, profile or log member** |
| `PRAGMA compile_options` | **`DEBUG` ABSENT · `ENABLE_SQLLOG` ABSENT · `ENABLE_STMT_SCANSTATUS` ABSENT** |
| Five tracing pragmas vs a pragma that does not exist | **identical behaviour — all inert** |
| `db.location()` on `:memory:` | **`null`** — no file, so no engine-written artefact |

**E4 remains NOT OBTAINABLE on this test subject. §4.13 GAP-B stands, and the second negative is the
expected result rather than a failure.** Under §4.6 S6 that yields **NOT CLEARED independently of
every count above**, and MSG-0137 forbids inferring otherwise.

#### What this section does NOT establish

- **Nothing is CLEARED.** **All six candidates are NOT CLEARED**, and **no gate was relaxed to reach
  that**. **Six probes have now cleared nothing.**
- **`U1 = 0` is not established for anything and is not claimed.** Every index-entry figure is a
  **lower bound**; **I7's zeroes sit on a bound that is VACUOUS in 3 of 3 cells** — a zero taken while
  the version cursor did visit entries proves nothing at that size.
- **I5, I7 and I8 are now MEASURED for `U` at three collection sizes and NOT CLEARED. They are not
  measured for everything**, and what remains is recorded with its exact limitation: structure and
  class **counts at scale** (corpus unmeasured at n=1, §11 #1), **I7's re-refinement rate** (a
  function of corpus boundary density, **UNKNOWN**), **I7's G-Q5.1c abstention-on-breach mechanism**
  (no abstention controller was built), **I8's cost of a subject moving between classes**, **E3** for
  any lexical or vector stage, and **E4** for all of them.
- **The routing-phase measurement is PARTIAL.** Explicit catalogue reads are measured; **implicit
  schema resolution is NEVER MEASURED**, and §4.9 G-Q4's unnumbered open interaction is **left
  exactly as open as it was**.
- **TASK-0039's G-Q4 result is not withdrawn.** It was correctly measured; finding 1 records that
  **the catalogue it was measured against was empty of foreign structures**, which bounds what it
  established. **No verdict moves on that basis.**
- **No planner behaviour is generalized.** Every plan, count and bound is evidence about **SQLite
  3.51.3 via `node:sqlite`**, in these configurations, on these fixtures.
- **All prior verdicts stand.** TASK-0033/0035/0037/0038/0039 were **not modified or re-run**; **K7
  and K8 remain NOT CLEARED**; **K3 and K4 remain NOT CLEARED**; **class D and class H remain
  DISQUALIFIED**.
- **No numeric staleness threshold is introduced**; the freshness period is a **fixture constant** and
  its magnitude is not judged. **No benchmark, latency, capacity, recall, throughput, structure count,
  replication factor or fan-out figure is produced.**
- **No engine, runtime, provider, model or index technology is selected**, **no ADR is amended**, and
  **no implementation task is authorized or marked READY.** **Engine selection stays blocked.**

---

### 4.16 The durability-artefact criterion — DA-1 (TASK-0044, MSG-0148b)

**Added 2026-08-25 by TASK-0044.** Authority: **MSG-0148b**, which authorizes *"defining the
WAL/durability-artifact security criterion **before** running a dedicated WAL exposure evidence task"*,
with **MSG-0147** binding. **This section is documentary. Nothing was measured to produce it, nothing
was executed, and it clears, selects, adopts, compares, deploys and implements nothing.**

**Why it exists at all, in the Lead's words:**

> **"The criterion must establish the security bar independently of the measurement. The later evidence
> task must measure against the already-authoritative criterion."** — MSG-0148b

**And why that ordering is a prohibition rather than a preference:** a bar written by the session that
also takes the measurement is a bar shaped by what that measurement could reach, and afterwards the
shaping is invisible — the record shows only a criterion and a result that agree. This is **§4.6 S5's
asymmetry rule applied to the criterion itself** rather than to a counter.

#### DA-0 — Two structural choices, declared rather than assumed

**MSG-0148b requires both of these to be stated, because either could defensibly have gone the other
way and a silent choice cannot be reviewed.**

**Choice 1 — the label is `DA-1`, and deliberately not `E5`.** MSG-0148b forbids changing or extending
E1–E4. An `E`-number would read as a fifth Shape-1 evidence class no matter what its text said, and
**§4.6 S6's table is the clearance bar** — adding to it is precisely the change that is forbidden.
`DA` (**d**urability **a**rtefact) was verified unused across `docs/` and
`implementation/architecture/` before it was allocated, so it collides with no existing identifier in
this record's namespaces (`E1–E4`, `S1–S11`, `U1–U5`, `G-Q4…G-Q7.8`, `I1–I8`, `N1–N5`, `W1–W4`,
`EV1–EV12`, `F1–F16`, `GAP-A…GAP-E`).

**Choice 2 — a new section `§4.16`, with `§4.15` deliberately left unallocated.** Beside the other
criteria in §4.6 was the alternative, and it was rejected for a reason internal to §4.6: **that
section's own preamble states it exists to decide "whether a candidate satisfies the Shape-1 gate"**,
and DA-1 is **not** a Shape-1 question. Housing it there would invite exactly the conflation MSG-0147
ruled against. **The number skips 4.15 on purpose:** **R1 is OPEN** — MSG-0146 §8 asks whether the
TASK-0043 E4 record becomes **§4.15** — and taking that number here would consume, in passing, a slot
the Lead's own open referral has provisionally claimed. **The gap is declared, not accidental.**

#### DA-1 — The prohibition

> **Resolving a retrieval request on behalf of a subject `s` must not cause content that `s` is not
> authorized to receive to be written to, or left readable in, any engine-managed durability or
> persistence artefact.**

Three limbs, kept separate because a candidate can fail any one of them alone:

| | Limb | What it prohibits |
|---|---|---|
| **DA-1.1** | **No request-induced persistence** | Content unauthorized for the requesting subject becoming **durable** as a consequence of that subject's request — written into a write-ahead log, journal, temporary or spill file, or an engine-produced snapshot, because the request was resolved |
| **DA-1.2** | **No residual retention** | Such content **remaining readable** in an engine-managed artefact after the request has completed. Transient presence during the operation is still presence; the limb asks what survives the operation |
| **DA-1.3** | **No widened reach** | A durability artefact placing corpus content where **more principals, or a longer lifetime, can reach it than the projection store itself allows** — a spill file outside the store's protection, an artefact surviving teardown, or one written outside the governed persistent-state boundary the bootstrap contract already fixes (`/data/docker`, contract v0.2, MSG-0006 — **pointed at, not restated**) |

**"Unauthorized" carries §4.6 S4's meaning unchanged** — failing the §3 predicate **for the requesting
subject at answer time**, including all five failure modes that fixture kept separate. **No new
definition of authorization is introduced here, and none may be inferred from this section.**

#### DA-2 — Scope: what is an engine-managed durability artefact

**In scope — any file or shared region the engine itself writes as part of storing or recovering
state:**

| In scope | Note |
|---|---|
| **Write-ahead logs** | the artefact that raised R2 |
| **Rollback / undo journals** | the pre-WAL equivalent; MSG-0146 §5 recorded `-journal` **absent** in that configuration, which is a fact about the configuration, not about the criterion |
| **Shared-memory / index files** (`-shm` and equivalents) | in scope even where an observation finds them empty |
| **Temporary and spill files** — sorter, merge, materialisation, external-sort overflow | the artefacts a query creates under memory pressure, which is when they are least likely to be looked for |
| **Backups, snapshots and replication streams produced by the engine itself** | *"produced by the engine"* is the boundary; see DA-3 |

#### DA-3 — Exclusions, each for a stated reason rather than by omission

| Deliberately out | Why |
|---|---|
| **Application logs, telemetry, ordinary audit payloads** | already governed by **ADR-0020 §6.2** and **§9.3 finding 9**. **Pointing, not restating** — a second statement of that rule is the drift this record has warned about since TASK-0030 |
| **The engine's own execution surface** — traces, profiles, slow-query and debug logs | **that is E4** (§4.6 S6). See **DA-7** |
| **OS page cache and other volatile kernel buffers** | not engine-written and not durable |
| **Filesystem-, volume- or storage-layer encryption at rest** | a **storage** control (`docs/security/security-architecture.md`), orthogonal to what the engine writes. It can make an artefact unreadable to an outside reader; **it does not make DA-1 satisfied**, because DA-1 concerns what the engine puts there |
| **Operator-taken backups, filesystem snapshots, host images** | *"anything the engine does not itself write"* (MSG-0148b). They inherit whatever DA-1 permits; they do not define it |
| **The projection's own at-rest storage of approved corpus content** | governed by **ADR-0020 §1** — the index **is** a projection of approved content, so its data files holding that content is the design, not a breach. **DA-1.3 still applies to it**, and **DA-4 is where this boundary is actually load-bearing** |

> **Numbering correction, recorded 2026-08-25 rather than tidied away.** As first published in commit
> `86493bb`, the exclusions table sat inside **DA-2** and the section ran **DA-2 → DA-4**, leaving a gap
> where **DA-3** should be. The exclusions now carry their own **DA-3** heading. **No text of the
> criterion changed, no rule moved, and DA-4…DA-7 keep the numbers they were published with** — the
> correction adds a heading and nothing else.

#### DA-4 — The line that makes DA-1 usable: **provenance**, not presence

**This is the part a criterion written after a measurement would most likely have got wrong, and it is
the reason MSG-0148b ordered them this way.**

A projection index durably holds the corpus it indexes. Under a **single shared projection** every
subject is unauthorized for some of it, so *"unauthorized-for-`s` bytes exist somewhere in the engine's
files"* is **true by construction for every candidate at every moment**. A criterion phrased as mere
presence would therefore fail every engine trivially, tell nobody anything, and be indistinguishable
from a criterion that had been tuned to fail.

**DA-1 is therefore a claim about provenance and reach, not about presence:**

| Provenance of the content in the artefact | DA-1 |
|---|---|
| Written at **ingest**, as part of maintaining the projection of approved content | **Not a DA-1.1 or DA-1.2 finding.** ADR-0020 §1 governs it. **DA-1.3 still applies** |
| Written, or retained, **because a request was resolved** | **DA-1.1 / DA-1.2 apply directly** |
| **Provenance not established** | **See DA-6 — the answer is NOT CLEARED, never "presumed ingest"** |

**The topology interaction, recorded because §4.13 already carries it:** where **N1 containment** holds
— the reachable structure for a subject contains only content that subject may receive — the two
provenances converge, because there is no unauthorized content in that partition to write down in the
first place. **Under a single shared projection they do not converge, and DA-4 is the whole question.**
**This observation adds no gate and moves no verdict**; it says which topologies make DA-1 easy to
satisfy and which make it the binding constraint.

#### DA-5 — Evidence semantics, in §4.6 S9's existing vocabulary

**No new verdict vocabulary is created. §4.6 S9's three terms are used unchanged**, so a later probe
cannot invent its own:

| Observation | Verdict |
|---|---|
| Content unauthorized for the requesting subject **found** in an in-scope artefact, **attributable to the request** | **NOT CLEARED**, conclusively. **A single occurrence is sufficient**; no structural argument, vendor claim or configuration note rehabilitates it |
| An engine that **writes such content by design** into an in-scope artefact, or whose durability artefacts are **reachable by a wider principal set than the projection store** | **DISQUALIFIED**, on the same footing as §4.6 S9's Shape-2/Shape-3 disqualification — the property is structural rather than incidental |
| A scan of the in-scope artefacts finding **no such content** | **Not sufficient on its own.** §4.6 S5's asymmetry rule transfers intact: **an absence proves only that nothing crossed the point, and the moment, at which the inspection was taken.** An artefact may have been checkpointed, truncated, rotated or reclaimed between the request and the scan |
| **Absence, plus evidence that the engine could not have written it** — containment of the reachable structure (**§4.13 N1/N2**), or an enumerated account of every in-scope artefact the request could touch, each inspected across the request's whole lifetime including under spill | **DA-1 satisfied.** This is deliberately the shape of **§4.6 S6's E1-with-E2-corroborating** requirement rather than a counter-only test, and for the same reason |
| Provenance (DA-4) **not separable** by the available instruments | **NOT CLEARED** — DA-6 |

**Two consequences, stated so they cannot be read the other way:**

1. **Satisfying DA-1 clears nothing.** It is not an evidence class in §4.6 S6's table, it does not
   contribute to a **CLEARED** Shape-1 verdict, and it cannot substitute for E1, E2, E3 or E4.
2. **DA-1 relaxes nothing.** It adds a requirement. **Strict Shape-1, E1–E4 and G-Q4…G-Q7.8 are
   unchanged by this section**, and no verdict recorded anywhere in this document moves because of it.

#### DA-6 — The fail-closed interpretation, stated in DA-1's own terms

**Where an in-scope artefact cannot be inspected at all — the engine exposes no way to read it, the
deployment does not retain it, the instrument cannot reach it, or the artefact is reclaimed before it
can be read — the verdict is `NOT CLEARED`.**

**Never an inferred pass.** This is §4.6 S9's rule (*"`NOT CLEARED` is the required answer wherever
evidence is absent"*) and §4.6 S10's engine-exposure criterion applied to persistence: **an engine
whose durability artefacts cannot be observed fails the burden of demonstrating DA-1**, exactly as an
engine whose opaque stages cannot be observed fails E3. **Uninspectable is not clean**, and
**"we looked and found nothing" is not "it was never written"** — DA-5 row 3.

#### DA-7 — DA-1 is not E4, and here is the difference in its own terms

**MSG-0147 is explicit that the WAL finding is *"not reclassified as E4"* and that E4 *"remains limited
to the established execution-observability criterion"*. Restated here so DA-1 carries the distinction
without a reader having to hold MSG-0147 in mind:**

| | **E4** (§4.6 S6) | **DA-1** (this section) |
|---|---|---|
| Boundary | what the engine's **execution surface emits** | **content at rest** in files the engine writes |
| Artefacts | traces, profiles, slow-query and debug logs | WAL, journals, shared-memory, temporary and spill files, engine-produced backups |
| Lifetime asked about | **during** execution | **after** the request completes |
| Governing rule | §9.3 / ADR-0020 §6.2 — the logging prohibition | this section, under MSG-0147 |
| Role in clearance | **an evidence class; required for CLEARED** | **a separate requirement; contributes to no Shape-1 verdict** |

**MSG-0146 paid to keep these apart, and that is why the distinction is trustworthy.** It held a
striking result — unauthorized text sitting in a file on disk — and **declined to offer it as E4**,
when doing so would have looked like the stronger finding. **A criterion that quietly absorbed that
result into E4 would be undoing the one act that establishes the boundary is real.**

**One adjacency worth pointing at rather than restating:** **§4.6 S4 U5** already counts content placed
in *"a buffer, cache, temporary structure, or log line **while resolving the query**"* as a **unit
examined** — a Shape-1 count. **DA-1 is not that rule.** U5 counts an examination as it happens;
**DA-1 asks what is still readable on disk afterwards, and by whom.** The same byte can be both, and
the two are recorded separately.

#### The TASK-0043 observation — an illustrative SHAPE, explicitly NOT evidence under DA-1

**MSG-0148b forbids this task from measuring anything, so the figures below are reproduced from
MSG-0146 §5 and are re-run, extended and treated as a result nowhere.** They appear for exactly one
purpose: **a criterion that cannot classify this shape is not yet usable.**

| Artefact | Size | Unauthorized marker |
|---|---|---|
| main db | 4096 B | absent |
| **`-wal`** | 28872 B | **present — 135 times** |
| `-shm` | 32768 B | absent |
| `-journal` | absent | — |

**DA-1 classifies it as follows, plainly:**

1. **The artefacts are in scope** — DA-2 puts WAL, `-shm` and journals in, and the empty findings are
   in scope as much as the non-empty one.
2. **The shape alone does not decide DA-1.1 or DA-1.2**, because **the record does not establish
   provenance** (DA-4): it does not say whether those 135 occurrences arrived when the fixture was
   ingested or because a request was resolved. **Naming that missing discriminator is what a criterion
   is for**, and it is the first thing the separately-authorized evidence task must separate.
3. **In the absence of that discriminator the verdict is not "presumed ingest" — it is `NOT CLEARED`**
   (DA-6). **The criterion returns a determinate, fail-closed answer on the shape as recorded.**
4. **The observation does establish the mechanism DA-1 exists for**: content the engine wrote **outlives
   the operation in a file on disk**, and **a scan of the main database alone would have found nothing**
   — the exact false negative DA-5 row 3 refuses to accept as satisfaction.

**Nothing here is a DA-1 verdict about any candidate**, because no candidate has been measured against
DA-1 and **this task was forbidden to measure one.**

#### Q14 — does a DA-1 failure block selection? **Surfaced, deliberately NOT decided**

**DA-1 yields its own verdict in §4.6 S9's vocabulary. What that verdict does to a candidate's
eligibility is an architecture decision, and it is the Lead's.** MSG-0147 consequence 2 states the R2
ruling *"does not by itself clear or fail any retrieval engine"*, and MSG-0148b forbids changing any
existing clearance gate — so **this section makes DA-1 a separate, separately-recorded requirement and
stops there.**

**Fail-closed default until ruled:** a **DA-1 NOT CLEARED or DISQUALIFIED result is recorded alongside
the Shape-1 verdict and changes no Shape-1 verdict**. **The default costs nothing in either direction**,
because **engine selection is blocked on independent grounds already** — all six TASK-0042 candidates
are NOT CLEARED and no candidate is eligible for selection on any reading of Q14.

#### What this section does NOT establish

- **Nothing is CLEARED, and nothing could have been.** No measurement was performed under this
  authorization; **seven probes have still cleared nothing**, and **all six TASK-0042 candidates remain
  NOT CLEARED**.
- **No DA-1 verdict exists for any candidate.** DA-1 has been **defined and never applied**.
- **The TASK-0043 WAL figures are not evidence under DA-1** and are not offered as any. They are an
  illustration, labelled as one, and **nothing was re-run, extended or reinterpreted as a result.**
- **E1–E4 are unchanged**; **no existing clearance gate is changed**; **strict Shape-1 is not weakened,
  and DA-1 cannot be used to satisfy any part of it.**
- **No engine, runtime, provider, model or index technology is named as the bearer of any property**,
  compared, selected, adopted, deployed or implemented.
- **No ADR is amended or proposed**; `git diff --name-only docs/` is **empty** for this change.
- **No numeric threshold, benchmark, size, count, interval or figure is introduced.** The only figures
  in this section are MSG-0146's, quoted as an illustration.
- **No probe, fixture or harness was written or run, no test executed, and no test count is claimed** —
  none could be.
- **The exposure evidence task is separate and is NOT authorized by this section.** It must be
  authorized on its own, and it measures **against this criterion as it now stands**.

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
