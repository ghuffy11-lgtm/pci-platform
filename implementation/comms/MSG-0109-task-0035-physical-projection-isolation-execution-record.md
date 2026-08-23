# MSG-0109 — TASK-0035 Execution Record: Physical Projection Isolation against Strict Shape-1

**Status:** OPEN — record, plus three questions referred; **none blocks anything**
**From:** Claude Code · **To:** Architecture Lead
**Authority:** MSG-0107b (AUTHORIZED); `CLAUDE-TASKS.md` §TASK-0035
**Applies:** MSG-0105 §1 (strict Shape-1); EPA-0006 §3, §4.1–§4.7 (criterion S1–S11); ADR-0020 as
amended by AMD-01; ADR-0018 §2/§4; MSG-0104 (prior probe evidence)
**Date:** 2026-08-23

---

## 1. Result in one paragraph

**Physical isolation reaches `U = 0`, and it reaches it only when the structures the traversal opens
contain no unauthorized row at all — which is a stronger and more brittle condition than it sounds.**
Six isolation designs were built and executed against one reachable engine (SQLite 3.51.3 embedded,
an EPA-0006 **class R** test subject) over the same synthetic adversarial fixture at three collection
sizes. **Partitioning on the discrete conjuncts alone did not reach zero** — scope-only, then
scope + classification + lifecycle state, then + audience, each reduced `U` and each left a residual
that **grew linearly with the collection**. **Zero was reached only when the last conjunct —
effectivity — was also resolved physically, by materialising the structure as of an answer-time
instant.** And **that is where the sharpest finding is: the moment that materialisation goes stale,
`U` becomes non-zero again and the design starts RETURNING unauthorized rows** — 5 of 5 at every
collection size. **No candidate in TASK-0033 ever returned an unauthorized row; this one does.**
Physical isolation therefore converts a conservative failure mode (examine, then reject) into a
leaking one (return stale content) unless re-materialisation is bounded and the post-retrieval
re-check of ADR-0020 §3.2 actually runs. **Nothing is CLEARED. All nine MSG-0104 verdicts are
reproduced unchanged and none was altered by this evidence. No engine, technology or physical
implementation was selected, adopted, recommended, installed or deployed.**

---

## 2. What this task did and did not touch

**It did not re-run TASK-0033.** That harness, its output and its verdicts are untouched — the
recovery procedure in the queue section forbids re-running it, and there was no reason to: it
answered a different question. TASK-0033 varied the **query and the index** over one shared
structure. This probe holds the **predicate constant** and varies the **physical organisation of the
projection**. A new harness was written at `implementation/probes/TASK-0035/probe.mjs`, and its full
captured output is committed at `implementation/probes/TASK-0035/probe-output.txt` (354 lines).

**Logical projection and physical organisation are kept distinct throughout, as MSG-0107b §2(3)
requires.** Every design below serves **one logical projection** — one governed candidate space, one
predicate, one ingestion contract. What varies is how that single logical projection is laid out in
storage. **MSG-0101 §1(1) is not reinterpreted:** *"one projection index"* still means one **logical**
projection, and nothing here requires — or is read as requiring — one physical index or one physical
store. That ruling is what makes these designs admissible at all.

---

## 3. The physical-isolation patterns, defined without assuming a technology (MSG-0107b §2(1))

**The organising rule, stated first because everything else follows from it.**

> A physical partitioning **discharges** a conjunct of the authorization predicate if, and only if,
> the partition key is a **refinement** of that conjunct — that is, every row placed in a partition
> agrees on that conjunct's truth value for every subject routed to it. A partitioning that merely
> *correlates* with a conjunct discharges nothing.

Applied to the four EPA-0006 §3 constraints, this sorts them into two kinds, and **the split is not
even:**

| Constraint | Shape | Refines into a finite partition set? |
|---|---|---|
| 1 — organizational / tenant scope | equality on a discrete key | **Yes** |
| 2a — classification vs. entitlement | membership in a discrete set | **Yes** |
| 2b — audience vs. entitlement | **multi-valued set overlap** | **Yes, at the cost of replication** — one partition per token, and a chunk carrying *n* tokens is stored *n* times |
| 4 — answerable lifecycle state | discrete state | **Yes** |
| 3 — effectivity at answer time | **two-sided range, open upper bound** | **No — not without fixing a time.** It can only be refined *as of an instant*, and the refinement decays from that instant onward |

**That asymmetry is the whole of the finding**, and it is precisely the difficulty EPA-0006 §4.7 Q2
recorded in advance: *"effectivity-at-answer-time is a continuous two-sided range with an open upper
bound … whether these can be physically organised at all, rather than only evaluated, is genuinely
open."* **It can be — by materialisation — and the price is measured in §5.4 below.**

### 3.1 The pattern catalogue

| | Pattern | Conjunct discharged | Notes |
|---|---|---|---|
| **I0** | **No isolation** — one shared structure | none | The TASK-0033 shape. Every conjunct is residual in-query work |
| **I1** | **Scope / tenant partitioning** | 1 | The pattern an implementer reaches for first, and on its own it is the weakest of the four |
| **I2** | **Discrete-attribute partitioning** — classification, lifecycle state | 2a, 4 | Composes with I1 as a compound key |
| **I3** | **Entitlement-token partitioning** — one structure per audience token | 2b | **Replicates rows.** A subject with *m* entitlement tokens routes to *m* structures and their results must be merged |
| **I4** | **Temporal materialisation** — the structure holds only what is effective at an instant | 3 | The only pattern that discharges the continuous conjunct, and **the only one with a decay term** |
| **I5** | **Per-principal materialisation** — a candidate set per subject or per role | 1, 2a, 2b, 4 at once | The extreme of I3. **Not measured here** — no execution evidence, and it is recorded as a pattern, not as a recommendation |
| **I6** | **Per-partition secondary structures** — a lexical or vector index built per partition rather than one global index | none by itself | **Does not discharge a conjunct; it extends whatever confinement the partitioning already achieved into the secondary structure.** This is the pattern that bears on the opaque-stage problem — §5.5 |

**I6 is the pattern most likely to be missed**, because it discharges nothing on its own and therefore
looks unnecessary. **A perfectly partitioned base structure paired with one global lexical or vector
index re-introduces the whole problem**: the traversal that resolves the match runs over a structure
spanning every authorization scope, and under EPA-0006 §4.6 S6/E1 that is disqualifying regardless of
what any counter downstream reports.

---

## 4. Method (EPA-0006 §4.6 S3, S4, S5, S7, S8)

**Engine under test:** SQLite 3.51.3, embedded in the Node runtime (`node:sqlite`), Node v24.15.0.
**It is a test subject and nothing else** (MSG-0101 §3). It was chosen because it is the only
retrieval engine reachable on this host — re-verified in this session, not assumed: `docker` is
`command not found`, so classes S and V remain unreachable and class K has no PostgreSQL here.
**Nothing was installed, no network was reached, every database was `:memory:`, and no real corpus
was read** — `D:\Work\pci-corpus` was not opened, MSG-0083's standing read grant notwithstanding,
because MSG-0107b §4 excludes it.

**The fixture is TASK-0033's, deliberately.** Eight authorized chunks; `M ∈ {50, 500, 5000}`
unauthorized chunks spread evenly across the same five failure modes (wrong scope, wrong audience,
restricted classification, SUPERSEDED, expired effectivity); unauthorized bodies are short with the
query term five times and authorized bodies long with it once, so **the unauthorized chunks are the
better lexical match**. Two changes, both declared:

1. **Half the authorized chunks carry two audience tokens**, so that pattern I3's replication is
   exercised by the fixture rather than assumed away.
2. **A sixth cohort exists only in the staleness fixture** — rows fully authorized at build time that
   expire before answer time. Nothing else uses it.

**The adversarial precondition was verified before every measurement** (S8): the unconstrained
lexical top-5 returned **no authorized chunk** on all three fixtures — `ADVERSARIAL, as required`.

**The negative control is present and it failed, so the run is valid** (S8). A deliberately Shape-2
post-filter design was k-complete at `M=50` and returned **0 of 5** at `M=500` and `M=5000`,
materialising **50 / 500 / 5000** unauthorized bodies. Had the harness not failed it, every pass in
this record would prove nothing.

**Three instrument placements, and the maximum is reported as `U`** (S7):

| Placement | Where it sits | What it measures |
|---|---|---|
| `pre` | first conjunct of the outer `WHERE` | rows crossing that point — **not** a census, see below |
| `post` | last conjunct of the outer `WHERE` | survivors of the residual predicate |
| `structure` | the **only** `WHERE` term inside each partition's own scan | rows the scan of that physical structure actually surfaces |

**Two instrument defects were found during construction and are recorded rather than quietly
fixed, because both are the S5 hazard happening in practice.**

- **`pre` is not a census.** SQLite reorders outer `WHERE` terms freely, so a term written first is
  not evaluated first. In the first run the audience-partitioned design reported `U = 0` at `pre`
  while its routed structures held ten unauthorized rows. **A zero from a conveniently placed
  instrument is not evidence** — S5, demonstrated on a real engine, against this probe's own code.
- **An instrument in a subquery's select list was elided entirely.** Because the outer query never
  read the column, SQLite did not compute it, and the counter reported `0` rows seen while the scan
  surfaced 22. Moving it into the branch's `WHERE` fixed it. **The `structure` counts below then
  agreed exactly with the independently computed structure invariant** — two measurements of the
  same quantity, arrived at by different routes, agreeing at every design and every size.
- **The negative control's `U` was initially read from an instrument that is not active in it** —
  the same "zero from an absent instrument" error MSG-0104 §5.3 caught in its own record. It now
  reports the ranking function, which *is* the control's instrument.

**The structure invariant is what makes E1 checkable rather than asserted.** For each design the
probe counts, directly, how many rows physically present in the routed structures are unauthorized at
answer time. **E1 requires the traversal be confined to a structure every entry of which satisfies
the predicate; this is that claim, measured.**

---

## 5. Results

### 5.1 `U` — unauthorized units examined, by design and collection size

**The bar (EPA-0006 §4.6 S3): `U = 0` at every measured `N`, shown invariant with `N`.**

| Design | Isolation pattern | M=50 | M=500 | M=5000 | invariant with N | structure invariant (E1) |
|---|---|---|---|---|---|---|
| **P0** | I0 — none, one shared structure | **20** | **200** | **2000** | **no — grows** | **VIOLATED** |
| **P1** | I1 — scope-partitioned | **40** | **400** | **4000** | **no — grows** | **VIOLATED** |
| **P2** | I1+I2 — scope, classification, state | **20** | **200** | **2000** | **no — grows** | **VIOLATED** |
| **P3** | I1+I2+I3 — + audience-partitioned | **10** | **100** | **1000** | **no — grows** | **VIOLATED** |
| **P4** | I1+I2+I3+I4 — + effectivity materialised at T | **0** | **0** | **0** | **yes** | **holds** |
| **P5** | P4 + I6 — per-partition lexical index | **0** | **0** | **0** | **yes** | **holds** |
| **P4S** | P4, queried after the clock moved | **5** | **50** | **500** | **no — grows** | **VIOLATED** |
| **NC** | negative control — post-filter | 50 | 500 | 5000 | no — grows | VIOLATED (by design) |

**Every design returned the same correct answer** — result set `[4,5,6,7,8]`, 5 of 5, no unauthorized
row returned — **except P4S and the control.** That is EPA-0006 finding 1 again, now at the level of
physical organisation: **response inspection cannot distinguish any of these designs from one
another**, and they differ by three orders of magnitude in what the engine touched.

### 5.2 The residual, conjunct by conjunct — and why P1 is *worse* than P0

**Read the P1 row before concluding that partitioning helps.** Scope-only partitioning reported the
**highest** `U` of any non-control design — 4000 at `M=5000`, twice P0's. This is not a paradox and
it is not an artifact:

- **P0's traversal is an index seek** — `SEARCH chunks USING INDEX i_auth (scope=? AND state=? AND
  cls=? AND eff_from<?)` — so four conjuncts restrict the traversal before any instrument sees a row.
- **P1's traversal is a full scan of the scope partition** — `SCAN p_org_a` — because once scope is
  guaranteed by the structure, the remaining conjuncts have no index to work with in this design.

**So replacing an index restriction with a structural one, without carrying the rest of the
predicate, moves work from the index into the scan and examines more, not less.** The instrument
placements make this legible: P1's `post` count is 10/100/1000, identical to P3's `structure` count,
while its `structure` count is 40/400/4000. **Per S7 the maximum is `U`.** An evaluation reporting
only the survivor count would have recorded P1 as an improvement over P0. It is not.

**The residual tracks exactly one thing: how many unauthorized rows remain physically present in the
structures the traversal opens.** At `M=5000`:

| Design | Unauthorized rows in routed structures | `U` (structure placement) |
|---|---|---|
| P1 | 4000 | 4000 |
| P2 | 2000 | 2000 |
| P3 | 1000 | 1000 |
| P4 | **0** | **0** |

**The two columns are equal at every design and every collection size.** They are measured
independently — one by counting stored rows, one by counting engine calls — and they agree. **That
equality is the finding**, stated as a rule: **`U` is the count of unauthorized rows the routed
structures still contain.** Isolation reduces `U` exactly insofar as it removes unauthorized rows
from the structures opened, and by nothing else.

### 5.3 Corroboration with MSG-0104, and a placement caveat that must not be read as a contradiction

**P0's `post`-placement figures are 10 / 100 / 1000 — reproducing MSG-0104's C1 covering-index
numbers exactly**, from a separately written harness. That is independent corroboration of the prior
probe, and it is offered as such.

**P0's `U` is nevertheless recorded as 20 / 200 / 2000, because S7 requires the maximum across
placements and the `pre` placement reports twice as many.** This is **not** a correction of MSG-0104
and **no MSG-0104 figure is restated, adjusted or superseded**: that record measured what it measured,
at the placement it documented, and said so. It is the same position-dependence MSG-0104 §4.2 itself
recorded when C2 and C3 reported 2000 and 1000 on identical plans.

### 5.4 P4S — the staleness measurement, and the most consequential result here

**P4 stores only what is effective at the instant of materialisation. P4S is the same design, the
same structures, the same query — with the clock moved forward. Nothing else changes.**

| M | expiring cohort | rows in routed structures | unauthorized **at answer time** | `U` | unauthorized bodies materialised | **unauthorized rows RETURNED** |
|---|---|---|---|---|---|---|
| 50 | 5 | 17 | 5 | **5** | 5 | **5 of 5** |
| 500 | 50 | 62 | 50 | **50** | 50 | **5 of 5** |
| 5000 | 500 | 512 | 500 | **500** | 500 | **5 of 5** |

**Every answer returned was built entirely from content the subject was no longer authorized to
see.** This is qualitatively different from everything TASK-0033 measured. There, `U > 0` meant the
engine examined and then correctly rejected — **no candidate ever returned an unauthorized row.**
Here the rejection step no longer exists, because it was traded away for the structural guarantee:
**the design trusts the structure, and the structure is only as current as its last rebuild.**

**Three consequences, and the third is the one that matters for architecture.**

1. **`U = 0` for a temporally materialised structure is a property of an instant, not of a design.**
   It should never be recorded without the materialisation time it was measured at.
2. **The failure is silent in exactly the way ADR-0020 warns about.** No error, no empty result, a
   fluent and correct-looking answer citing a superseded or expired policy.
3. **Accepted architecture already contains the control that catches it, and this is why the four
   enforcement points are not redundant.** ADR-0020 §3.2's post-retrieval re-check — which EPA-0006
   §3.3 already established **must re-authorize against the kernel, not against the index's own
   copy** — is precisely what turns this from a leak into a correctly-abstained answer, together with
   ADR-0020 §1's staleness threshold and abstention **A7**. **No new rule is needed; what is needed
   is a ruling that a temporally materialised structure may not be cleared without them.** That is
   referred in §9, not decided here.

### 5.5 P5 — per-partition lexical indexing, and the opaque stage

**MSG-0104's sharpest evidence gap was that FTS5's `MATCH` traversal could not be instrumented at
all** — *"no instrument available through `node:sqlite` reaches inside the FTS5 traversal"* — and
EPA-0006 §4.6 **E3** turns that into a rule: an unmeasurable stage is **NOT CLEARED**, never a pass by
default.

**P5 does not close that gap by measuring the stage. It closes it, if it closes it at all, by
construction:** the FTS index is built per partition and contains **only** the rows of a structure
whose invariant is independently verified to hold. Whatever the traversal does internally, **there is
no unauthorized entry inside the structure for it to reach.** The plan shows the confinement:

```text
SCAN fts_p_org_a_internal_published_staff VIRTUAL TABLE INDEX 0:M1
BLOOM FILTER ON c (id=?)
SEARCH c USING AUTOMATIC COVERING INDEX (id=?)
```

**This is an argument from construction, corroborated by a verified structure invariant — it is not
an instrument reading, and it must not be recorded as one.** Whether it is admissible as E3 evidence
is a criterion question the Lead has not ruled, and it is referred in §9 (**Q6**). **Until it is
ruled, P5 is NOT CLEARED**, and this record does not treat structural confinement as discharging E3.

**One consequence of I6 is worth recording for whoever plans T-C, because it is a real cost and it is
not a security property:** relevance scoring statistics in a lexical index are properties of the
indexed collection. **Splitting one index into per-partition indexes splits those statistics**, so
scores computed in different partitions are not directly comparable and merging results across
partitions is not simply a sort. **This is an observation from construction, not a measurement** — no
ranking quality figure was produced, and none is claimed.

### 5.6 The physical cost, as measured in the fixture and nowhere else

| Design | structures created | routed to | stored rows ÷ corpus rows |
|---|---|---|---|
| P0 | 1 | 1 | 1.00 |
| P1 | 2 | 1 | 1.00 |
| P2 | 4 | 1 | 1.00 |
| P3 | 6 | 2 | 1.00 – 1.07 |
| P4 / P5 | 6 | 2 | 0.80 – 0.90 |

**These are counts taken from this fixture. They are not capacity figures, not projections, and not
an estimate of anything at corpus scale** — the corpus scale is UNKNOWN (EPA-0006 §11) and no
benchmark of any kind was run. Two structural observations do follow from the construction itself
and are stated as such: **structure count is bounded by the cardinality of the cross-product of the
discrete authorization attributes**, and **I3 stores a chunk once per audience token it carries**, so
the ratio above exceeds 1 exactly when multi-token chunks are present. **P4's ratio falls below 1
only because effectivity materialisation drops rows** — which is storage saved by excluding content,
not efficiency.

---

## 6. Per-candidate verdicts (MSG-0107b §5)

### 6.1 The isolation designs — class R test subject, new evidence

| Candidate | Class | Physical-isolation strategy | Strict Shape-1 demonstrated? | Evidence / instrumentation | Limitations and unmeasured behaviour | **Verdict** |
|---|---|---|---|---|---|---|
| **P0** | R | **none** — one shared structure | **No.** `U` = 20/200/2000, growing linearly with `N` | E1 plan (index seek over a structure spanning all scopes); E2 counters at 2 placements; structure invariant VIOLATED (50/500/5000 unauthorized rows present) | E3 not obtained; E4 not obtained | **NOT CLEARED** |
| **P1** | R | **I1** scope partitioning | **No.** `U` = 40/400/4000 — **the highest of any design**, §5.2 | E1 plan `SCAN p_org_a`; E2 at 3 placements; invariant VIOLATED | E3, E4 not obtained | **NOT CLEARED** |
| **P2** | R | **I1+I2** scope, classification, lifecycle state | **No.** `U` = 20/200/2000 | E1 plan `SCAN p_org_a_internal_published`; E2 at 3 placements; invariant VIOLATED | E3, E4 not obtained | **NOT CLEARED** |
| **P3** | R | **+I3** audience-token partitioning | **No.** `U` = 10/100/1000 — the effectivity residual, and nothing else | E1 plan (compound scan of 2 partitions); E2 at 3 placements; invariant VIOLATED (exactly the expired-effectivity cohort) | E3, E4 not obtained | **NOT CLEARED** |
| **P4** | R | **+I4** effectivity materialised at answer-time instant | **`U` = 0 at all three sizes, invariant with `N`, with E1 holding** — but see the two conditions | **E1 obtained** — traversal confined to structures whose invariant is verified to hold; **E2 obtained** — `U = 0` at three placements × three sizes | **E4 NOT obtained** — no engine log was inspected and none was shown not to exist. **E3 not applicable to this pure-relational form and not separately evidenced.** **`U = 0` holds at the materialisation instant only — P4S measures what happens after** | **NOT CLEARED** |
| **P5** | R | **P4 + I6** per-partition lexical index | Same as P4, **plus** structural confinement of the opaque `MATCH` stage | E1 plan shows the traversal confined to `fts_p_…`; E2 `U = 0`; structure invariant holds | **E3 argued from construction, NOT instrumented** — admissibility is unruled (§9 Q6). **E4 NOT obtained.** Per-partition scoring statistics diverge (§5.5) — observation, unmeasured | **NOT CLEARED** |
| **P4S** | R | **P4 queried after the clock moved** | **No — and it is the worst result in the probe.** `U` = 5/50/500 **and it RETURNED 5 of 5 unauthorized rows** at every size | E1 invariant VIOLATED at answer time; E2 counters; direct observation of the returned set | Staleness interval is a parameter of the fixture, not a measurement of any real system | **NOT CLEARED** |
| **NC** | **D** | negative control — post-filter over the shared structure | **No, by construction** | Failed k-completeness at `M=500` and `M=5000`; materialised 50/500/5000 unauthorized bodies | — | **DISQUALIFIED** — demonstrated, consistent with MSG-0104 |

### 6.2 The EPA-0006 classes — isolation availability, and what would be needed to clear each

**No class verdict changes. Every one of these is reproduced from MSG-0104 and none is relabelled.**

| Class | Isolation patterns available in principle | What execution evidence would be required | Evidence obtained here | **Verdict (unchanged)** |
|---|---|---|---|---|
| **R** — relational with integrated lexical/vector search | I1–I6 all expressible; demonstrated above | E1 plan confinement per query shape, E2 at recorded placements, E3 for every opaque stage, E4 log inspection — **and a bounded staleness discipline for I4** | **Substantial** — 8 designs × 3 sizes on one member | **NOT CLEARED** |
| **S** — search engine with filtered lexical + kNN | I1/I2 as separate indices or routing aliases; I3 by per-token indices; **I4 requires index-level time materialisation**; I6 is native (one index per partition) | As R, plus evidence that the **kNN traversal** is confined to the partition and does not consult a global graph or centroid structure | **NONE — no engine reachable** (`docker: command not found`) | **NOT CLEARED** |
| **V** — purpose-built vector store with declared pre-filtering | I1–I3 by collection/namespace separation; **I6 is the critical one** — whether the approximate index can be built per partition rather than globally | Evidence that the ANN structure itself is per-partition. **A global ANN graph traversed with a filter is Shape 3 by construction**, whatever the API calls it | **NONE — no engine reachable** | **NOT CLEARED** |
| **K** — retrieval computed against the kernel store | I1–I4 expressible in the kernel's own relational engine; **RLS is enforcement, not isolation** — it does not by itself confine a traversal | Plan evidence from the kernel's engine that RLS-qualified traversals are confined, not filtered. **This is exactly what EPA-0006 §4.3's withdrawn "conforms structurally" claim assumed without measuring** | **NONE — no PostgreSQL on this host** | **NOT CLEARED** |
| **L** — lexical-only | I6 is the whole question for this class | That the per-partition lexical structure is the only one traversed | **Indirect only** — exercised as FTS5 inside the class-R subject (P5) | **NOT CLEARED** |
| **D** — post-filter-only similarity search | **None applicable.** Isolation cannot rescue a design that ranks first and excludes afterwards | — | Demonstrated again here by the negative control | **DISQUALIFIED** |
| **H** — hosted / managed retrieval service | Irrelevant to the elimination | — | — | **DISQUALIFIED** — ADR-0022 §1, independent of filter shape |

**No technology was selected or deployed.** No engine, runtime, provider, model, index technology or
physical implementation is chosen by this record; no product implementation or deployment is
authorized by it; and no implementation task is marked READY.

---

## 7. The MSG-0104 verdict table, reproduced unchanged (MSG-0107b §2(6))

**Reproduced verbatim from MSG-0104 §7. Nothing here is relabelled, softened, or re-presented as
conformance. No verdict in it was altered by this task's evidence.**

| Subject | Verdict | Decided at | Reason |
|---|---|---|---|
| **SQLite 3.51.3 — C1**, relational scalar | **NOT CLEARED** | **Tier 3** | Tier 1 and Tier 2 both pass; Tier 3 shows unauthorized rows examined scaling with the collection (1000 at M=5000, covering index). Strict Shape 1 not demonstrated |
| **SQLite 3.51.3 — C2**, FTS5 natural form | **NOT CLEARED** | **Tier 3** | As C1, **plus a measurement gap**: the FTS5 traversal cannot accept the authorization predicate into its own index — the join applies it outside — and **whether unauthorized content is traversed inside FTS5 was NOT MEASURED** (§5.3) |
| **SQLite 3.51.3 — C3**, FTS5 authorization-first join | **NOT CLEARED** | **Tier 3** | As C2. Forcing join order **did not** eliminate the residual, and does not close the FTS5 measurement gap |
| **NC — application post-filter** (class **D**) | **DISQUALIFIED** | **Tier 2** | Failed k-completeness at M=500 and M=5000; result set not invariant; materialized every unauthorized body. **Demonstrated, not merely argued** |
| **Class S** — search engines | **NOT CLEARED** | — | **No execution evidence: no engine reachable.** MSG-0101 §2: inability to obtain evidence is NOT CLEARED, never conformance |
| **Class V** — vector stores | **NOT CLEARED** | — | As S. Criterion 6's strategy-switching case is **untestable here** — SQLite has no approximate vector index, which is the property that produces switching |
| **Class K** — kernel store | **NOT CLEARED** | — | No PostgreSQL on this host. EPA-0006 §4.3 argues it conforms *structurally*; **that is a documentary argument and this probe produced no execution evidence for it** |
| **Class L** — lexical-only | **NOT CLEARED** | Tier 3 | Exercised only as FTS5 inside the class-R subject. ADR-0020 §7's hybrid requirement keeps it insufficient alone regardless |
| **Class H** — hosted / managed | **DISQUALIFIED** | not tested; none needed | ADR-0022 §1 — derived embeddings must not leave the host. Independent of filter shape |

**Which verdicts did new evidence alter? None.** The new evidence concerns **isolation designs**,
which are new candidates with their own rows in §6.1. It neither clears nor further condemns any
subject MSG-0104 evaluated. **One thing it does do is narrow class R's position from "not
disqualified, not cleared" to something more specific: for this member, the gap between `U > 0` and
`U = 0` is closed by physical organisation and by nothing else that was tried** — and closing it that
way introduces a new failure mode that had not previously been visible.

---

## 8. What execution evidence is required, and what documentation cannot establish (MSG-0107b §2(5))

| Question | Can documentation settle it? | Why |
|---|---|---|
| Does the engine accept the full §3 predicate in one operation? | **Yes** — API reference is sufficient | Tier 1; and EPA-0006 finding 1 already established this settles nothing about execution |
| Can the store be physically partitioned at all? | **Yes** | A capability claim, checkable in documentation |
| **Is the traversal confined to the partition?** | **No** | **Requires E1 — a plan, explain output or engine trace.** "Pre-filtering" in a vendor document is an API property; whether the filter constrains the traversal or prunes its output is an implementation property, and EPA-0006 §4.3 already records that the two are not distinguishable from the API |
| **Does an opaque stage — lexical `MATCH`, ANN graph walk — stay inside the partition?** | **No** | Requires E3, or the structural argument of §5.5 **if the Lead rules it admissible**. MSG-0104 established that the stage may be uninstrumentable |
| **Where does a reported counter sit?** | **No** | S7. A count without its placement is not interpretable, and this probe produced a 2× spread on the same design purely from placement |
| **Does the engine write unauthorized content to its own logs?** | **No** | E4. ADR-0020 §6.2 carries no authorization exception, and an engine's slow-query log is not exempt because the application wrote nothing |
| **What happens when a materialised structure goes stale?** | **No** | §5.4. It is behaviour under a clock, and it changed the outcome from "examined and rejected" to "returned" |
| Does splitting an index split its scoring statistics? | **Partly** | The mechanism is documented for most lexical engines; **the effect on this corpus is unmeasured and no figure is claimed** |

**The general rule this supports:** documentation can establish that a design is **possible**; only
execution can establish that the engine **does** it. Under AMD-01 the burden is on the engine, so
**absence of obtainable execution evidence is NOT CLEARED** — never conformance.

---

## 9. Questions referred to the Architecture Lead — none blocking

**Each carries a fail-closed default, so a future probe can run and return defensible verdicts with
all three still open.** None of them is proposed as a task and none is self-authorized.

### Q4 — Does routing to a partition examine anything?

A partitioned design must decide **which structures to open**. In this probe that decision is
**computed from the subject's own entitlements** — no chunk is read. But an implementation could
instead **discover** partitions by enumerating a catalogue, and partition identifiers encode
authorization attributes belonging to other subjects.

**Default until ruled, and it is the stricter of the two:** routing must be **computed** from the
requesting subject's entitlements, never **discovered** by enumerating structures. Under that
discipline no unit in the EPA-0006 §4.6 S4 sense is examined. **This is related to Q1 — whether
"examine" reaches metadata — but it is not the same question**: Q1 asks about index entries
describing chunks; this asks about identifiers describing *structures*.

### Q5 — May a temporally materialised structure be cleared at all, and under what staleness bound?

§5.4 is the evidence. **The controls that catch the failure already exist in accepted architecture**
— ADR-0020 §3.2 enforcement point 2 re-checking against the kernel, ADR-0020 §1's staleness
threshold, abstention A7 — so **no new rule appears to be needed**; what is needed is a ruling on
whether they are **prerequisites** for clearing an I4 design.

**Default until ruled:** a temporally materialised structure is **NOT CLEARED** unless the
re-materialisation interval is bounded *and* the post-retrieval re-check against the kernel is
demonstrated to run. **This record does not propose relaxing anything**, and it notes that the
alternative — leaving effectivity as an in-query predicate — is the P3 design, whose `U` grows with
the collection.

### Q6 — Is structural confinement admissible as E3 evidence for an unmeasurable stage?

§5.5. If a stage cannot be instrumented, but the structure it traverses is verified to contain only
authorized entries, has E3 been satisfied? **The argument is sound only if the stage genuinely cannot
reach outside its own structure**, which is itself an engine property that may need evidence.

**Default until ruled: no.** E3 is not satisfied by construction, and P5 is recorded **NOT CLEARED**
accordingly. **The default is fail-closed and can only withhold clearance, never grant it.**

> **A note on EPA-0006 §4.7 Q2, which this task was authorized to produce evidence for rather than to
> answer.** The evidence now points in one direction with numbers behind it: **across every design
> tried, query-time predicates alone did not reach zero, and zero was reached only when the traversal
> opened structures containing no unauthorized row.** That is one engine, one class, one synthetic
> fixture — **it does not prove that no engine can reach zero by predicate alone**, and MSG-0107b §1
> is explicit that predicates are *"not disqualified in principle, only unproven."* **The ruling
> remains the Lead's and none is assumed here.**

---

## 10. Acceptance against MSG-0107b §2 — item by item

| MSG-0107b §2 | Where discharged | Evidence |
|---|---|---|
| 1. Define isolation patterns without assuming a technology | §3 | Seven patterns I0–I6 with the refinement rule that generates them |
| 2. Evaluate each applicable EPA-0006 class against strict Shape-1 | §6.2 | All seven classes; R with execution evidence, S/V/K/L documentary with the gap named, D/H disqualified |
| 3. Distinguish logical projection from physical organisation; do not reinterpret MSG-0101 §1(1) | §2 | Stated explicitly; every design serves one logical projection; the ruling is quoted and left intact |
| 4. Produce evidence on preventing examination **before** retrieval | §5.1–§5.5 | 8 designs × 3 sizes, three instrument placements, plans quoted, structure invariant measured independently |
| 5. Identify required execution evidence vs. what documentation cannot establish | §8 | Eight-row table with the reason for each |
| 6. Preserve MSG-0104 verdicts; do not relabel | §7 | Nine-row table reproduced verbatim; "which verdicts did new evidence alter? None" |
| 7. Record disqualifiers and remaining evidence gaps explicitly | §6.1, §6.2, §8, §11 | E3/E4 gaps named per candidate; S/V/K unreachable; NC disqualified by demonstration |
| §5 — explicit statement that nothing was selected or deployed | §1, §6.1, §11 | Stated three times |

---

## 11. Boundary verification

- **`git diff --name-only docs/decisions/` → empty.** No accepted ADR was modified. **ADR-0019 was
  not amended and no Arabic normalization rule was written, inferred or proposed.**
- **`git diff --name-only docs/` → empty.** Nothing under the governance tree changed at all.
- **AMD-01 was not weakened.** The bar used throughout is `U = 0`, EPA-0006 §4.6 S3, unmodified. **No
  tolerance was introduced and no candidate was cleared on a weaker reading.**
- **No new production architecture decision was created.** The record is this message plus an
  **additive, declared** EPA-0006 §4.8; no ADR was created or proposed, and EPA-0007 does not exist.
  **`git diff --numstat` on EPA-0006 reads `94 0`** — ninety-four insertions, **zero deletions**, so
  no existing sentence of that record was deleted or reworded.
- **No real or confidential corpus was entered.** Fixtures are synthetic and generated in-process.
  `D:\Work\pci-corpus` was not read.
- **Nothing was installed.** No `docker pull`, `npm install` or `pip install` was run; **Docker
  Desktop was not started** — that is an operator action and remains one.
- **No benchmark, latency, throughput, capacity or recall figure appears anywhere in this record.**
  Every number is a count taken from the committed probe output. The counts in §5.6 are properties of
  the fixture and are labelled as such.
- **No implementation task is marked READY, and no next step is self-authorized.**
- **TASK-0033's harness and output are untouched**; `implementation/probes/TASK-0033/` was not
  modified.

---

## 12. What this record does not do

- It does **not** select, adopt, recommend, install or deploy any engine, index technology, storage
  layout or physical implementation. **SQLite is a test subject** (MSG-0101 §3) and its appearance
  here is not a candidacy.
- It does **not** claim any design conforms. **Nothing is CLEARED.**
- It does **not** claim that physical isolation is required. **It shows what reached zero here and
  what did not.** Whether physical organisation becomes an architectural requirement is EPA-0006
  §4.7 Q2 and remains the Lead's decision.
- It does **not** generalise from one engine to a class. **The class-R evidence is evidence about one
  member**, exactly as MSG-0107b §3 says of the prior SQLite result.
- It does **not** re-run, re-interpret or restate TASK-0033's measurements.
- It does **not** propose relaxing the bar, and records that MSG-0105 §3 forbids it.
