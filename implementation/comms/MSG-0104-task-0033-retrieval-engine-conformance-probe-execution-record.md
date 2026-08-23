# MSG-0104 — TASK-0033 Execution Record: Bounded Retrieval-Engine Conformance Probe

**Status:** OPEN — informational; **no decision is required to proceed, and nothing is blocked**
**Date:** 2026-08-23
**Author:** Claude Code — supervisor-started session (`runner.lock` pid 16300, acquired 06:57:18Z)
**Authority:** MSG-0101 (AUTHORIZED) · `CLAUDE-TASKS.md` §TASK-0033
**Applies:** ADR-0020 as amended by AMD-01 · ADR-0018 §2, §4 · EPA-0006 §3, §4.1, §4.3, §4.4
**Related:** MSG-0100, MSG-0102, MSG-0103 (the stopped first run)

---

## 1. Result in one paragraph

**The probe was built and executed. It cleared nothing.** One engine was reachable — **SQLite 3.51.3,
embedded in the Node runtime via `node:sqlite`**, a genuine member of EPA-0006 class **R** — and it was
exercised as a **test subject**, in three distinct query shapes plus a deliberately non-conforming
negative control, against a synthetic adversarial fixture at three collection sizes and two index
designs: **24 candidate executions across 6 fixtures**, all three EPA-0006 §4.4 tiers. **Tier 1 passed
and Tier 2 passed. Tier 3 is the tier that decided the outcome, and it decided it against the
candidate.** Every tested query shape causes the engine to examine a number of **unauthorized** rows
that is **non-zero and grows linearly with the collection**, bounded by index coverage rather than by
the authorization predicate — while returning results that are **indistinguishable from a perfectly
conforming engine's**. The verdict for the one engine actually probed is **NOT CLEARED**. Classes
**S**, **V** and **K** remain **NOT CLEARED** with zero execution evidence, because no engine of those
classes is reachable from this runner. Class **D** is **DISQUALIFIED and now demonstrated** rather
than merely argued. **No engine was selected, adopted, recommended, installed or deployed; no accepted
ADR was modified; no implementation task was authorized.**

---

## 2. The candidate set — evaluation only (acceptance criterion 1)

**Naming an engine here is not adoption or selection.** MSG-0101 §3 permits naming concrete candidate
engines as test subjects and states in terms that doing so "is not adoption or selection."

### 2.1 What was reachable, and why the set is this small

| Class (EPA-0006 §4.3) | Reachable in this session? | Evidence |
|---|---|---|
| **R — relational with lexical + vector search** | **YES**, one member | `node:sqlite` → SQLite **3.51.3**, FTS5 present, `EXPLAIN QUERY PLAN` and `DatabaseSync.function` both available |
| **S — search engine with filtered lexical + kNN** | **NO** | containerised; `docker --version` → `command not found`, exit 127 |
| **V — purpose-built vector store** | **NO** | containerised; same barrier |
| **K — retrieval against the kernel store** | **NO** | `psql --version` → `command not found`, exit 127; no PostgreSQL on this host |
| **L — lexical-only** | **partially**, as FTS5 inside the class-R subject | candidates C2 and C3 below |
| **D — post-filter-only** | **YES**, constructed deliberately as the negative control | candidate NC below |
| **H — hosted / managed** | **not tested and needs no test** | DISQUALIFIED by ADR-0022 §1 on independent grounds (derived embeddings must not leave the host) |

**Nothing was installed and no network was reached**, per MSG-0101 §4's stop condition on
*"provisioning an implementation runtime"*. **The Docker CLI was not invoked by absolute path, no
`PATH` was modified, and no permission was widened.** Docker Desktop was **not** started: that is an
operator action on the operator's machine, recorded rather than attempted.

### 2.2 The four test subjects

**EPA-0006 finding 2 is why the candidates are query *shapes* and not just products:** for class R,
*"conformance is a property of the query plan"*. Probing "SQLite" as a single candidate would answer
the wrong question.

| ID | Test subject | Why it is in the set |
|---|---|---|
| **C1** | Relational scalar retrieval; the predicate participates in candidate-set construction | The shape an implementer writes when told to pre-constrain |
| **C2** | FTS5 lexical match + authorization in one statement, **written the natural way** | The realistic hybrid-retrieval shape under ADR-0020 §7 |
| **C3** | Same as C2, but the authorization scan is **forced to lead the join** (`CROSS JOIN`) | Tests whether join order can be made to serve the security property |
| **NC** | **Negative control** — rank the whole collection, then filter in application code | **Deliberately Shape 2.** If the harness does not catch this, its passes prove nothing |

**The negative control is the part that makes the rest of the record worth reading.** A probe in which
everything passes is indistinguishable from a probe that measures nothing.

---

## 3. The authorization predicate (acceptance criterion 2)

**Derived once, from ADR-0020 §2/§3.1 and ADR-0018 §2/§4 via EPA-0006 §3, and used verbatim and
identically for every candidate.** MSG-0101 §2 requires the same predicate for every candidate; a probe
that varies it proves nothing comparative.

```sql
      c.scope = :scope
  AND c.state = 'PUBLISHED'
  AND c.eff_from <= :T
  AND (c.eff_to IS NULL OR c.eff_to > :T)
  AND c.classification IN ('PUBLIC','INTERNAL')
  AND EXISTS (SELECT 1 FROM chunk_audience ca
              WHERE ca.chunk_id = c.id AND ca.audience IN ('staff','all-employees'))
```

Bound: `:scope="org-a"  :T=1700000000  :q="leave"  :k=5`

Mapping to EPA-0006 §3's four constraint shapes, all four of which are present:

| # | Constraint | Clause above | Source |
|---|---|---|---|
| 1 | Organizational / tenant scope | `c.scope = :scope` | ADR-0020 §3.3; ADR-0016 |
| 2 | Classification **and** audience vs entitlements — **multi-valued set overlap** | `classification IN (…)` + the `EXISTS` join | ADR-0020 §2, §3.1 |
| 3 | **Effectivity at answer time, open upper bound** | `eff_from <= :T AND (eff_to IS NULL OR eff_to > :T)` | **ADR-0018 §4** |
| 4 | Answerable lifecycle state | `c.state = 'PUBLISHED'` | **ADR-0018 §2** |

**Constraint 4 is enforced in-query deliberately.** EPA-0006 §3.1 notes that DRAFT/IN_REVIEW/REJECTED
are never indexed, but **SUPERSEDED is "retained, not answerable"**, so it is a real query predicate.
The fixture therefore includes SUPERSEDED chunks as one of five distinct ways to be unauthorized.
**MSG-0101 §1(2) forbids settling the supersession design here, and this probe settles nothing about
it** — it enforces the predicate as the accepted ADR reads today.

---

## 4. Method, and the honest limits of each instrument

### 4.1 The fixture is adversarial by construction — and that was verified, not assumed

Per EPA-0006 §4.4 tier 2: a collection where at least `k` **authorized** chunks exist but rank **below**
`M` **unauthorized** chunks, `M ≫ k`. Here `k=5`, authorized `=8`, and `M ∈ {50, 500, 5000}`, with the
`M` unauthorized chunks spread evenly across five failure modes — one per constraint above, plus
SUPERSEDED. Unauthorized bodies are short with the query term five times; authorized bodies are long
with it once, so **unauthorized chunks are the better lexical match**.

**Before every measurement the harness verifies the fixture is actually adversarial**, by issuing the
**unconstrained** lexical top-5 and asserting that **no authorized chunk appears in it**. It printed
`ADVERSARIAL, as required` on **all 6 fixtures**. Had it not, tier 2 would have been void and the
harness says so rather than proceeding quietly.

### 4.2 Two engine-side instruments, and what each does and does not measure

- **`probe_rank(id, body)` — the ORDER BY expression**, so the engine must call it once per row it
  actually ranks, **handing this probe the row's body**. Counting unauthorized bodies passed to it is a
  **direct measurement of the hazard ADR-0020's Context section names** — *"the content is in the
  process, in memory, in a log line, or in a timing difference"* — not a proxy for it.
- **`probe_seen(id)` — a counted conjunct** in the `WHERE` clause, measuring how many rows reach the
  point in predicate evaluation **where the instrument is written**.

> **The limitation of `probe_seen`, stated because it would otherwise produce a false comparison.**
> Its count is **position-dependent**. C2 and C3 have **identical query plans** in covering-index mode
> yet report **2000** and **1000** unauthorized rows examined, purely because the instrument sits before
> the effectivity filter in one and after it in the other. **Neither number is "the" answer**, and
> **C2 is not worse than C3**. The safe reading is the **largest** observed count, as a **lower bound**
> on rows the engine examined. **Rows scanned is not measured at all** by this instrument — the query
> plan is the evidence for that, which is why plans are quoted throughout.

### 4.3 Boundaries honoured by construction

- database is **`:memory:`** — the probe leaves no file, no volume, no state;
- the corpus is **synthetic and generated in-process**. **`D:\Work\pci-corpus` was not read**, even
  though MSG-0083 grants read access to it, because MSG-0101 §4 stops on *"entering a real or
  confidential corpus"*;
- **no network, no install, no privileged action.**

Harness and full captured output are committed as re-readable evidence:
`implementation/probes/TASK-0033/probe.mjs` and `probe-output.txt`.

---

## 5. Results

### 5.1 Tier 1 — query shape (acceptance criterion 3): **PASS for C1, C2, C3**

**All four constraint shapes are expressible inside a single retrieval operation**, including the two
EPA-0006 §3 flagged as the discriminating ones: the **open-ended temporal range** (constraint 3, *"the
sharpest discriminator"*) and the **multi-valued set overlap** (constraint 2). The query issued to the
engine carries the complete predicate. **This discharges AMD-01's G3 evidence rule and, exactly as
EPA-0006 finding 1 predicts, establishes nothing whatever about execution.**

### 5.2 Tier 2 — k-completeness and invariance (criterion 4): **PASS for C1/C2/C3; the control FAILED**

| Candidate | Index | M=50 | M=500 | M=5000 | k-complete everywhere | Result set invariant |
|---|---|---|---|---|---|---|
| **C1** | partial | `[1,2,3,4,5]` | `[1,2,3,4,5]` | `[1,2,3,4,5]` | **yes** | **yes** |
| **C2** | partial | `[1,2,3,4,5]` | `[1,2,3,4,5]` | `[1,2,3,4,5]` | **yes** | **yes** |
| **C3** | partial | `[1,2,3,4,5]` | `[1,2,3,4,5]` | `[1,2,3,4,5]` | **yes** | **yes** |
| **NC** | partial | `[1,2,3,4,5]` | **`[]`** | **`[]`** | **NO** | **NO** |
| **C1/C2/C3** | covering | `[1,2,3,4,5]` | `[1,2,3,4,5]` | `[1,2,3,4,5]` | **yes** | **yes** |
| **NC** | covering | `[1,2,3,4,5]` | **`[]`** | **`[]`** | **NO** | **NO** |

**No candidate ever returned an unauthorized row** — including the negative control, which is exactly
why response inspection is worthless here.

**The negative control's failure is the most instructive single result in the probe.** NC is
**k-complete at M=50 and returns nothing at all at M=500 and M=5000.** A post-filter design therefore
**looks perfectly correct on a small collection and silently starts returning empty answers as the
collection grows** — the failure appears as an availability defect long after the design decision, and
it is precisely the M-dependence EPA-0006 §4.4 requires tier 2 to test for. **A probe run at one
collection size would have cleared it.**

### 5.3 Tier 3 — execution evidence (criterion 4): **the tier that decided the outcome**

Unauthorized rows examined, and unauthorized **bodies** materialized inside the engine:

| Cand | Index | M | rows reached | **unauthorized examined** | ranked | **unauthorized BODIES materialised** |
|---|---|---|---|---|---|---|
| C1 | partial | 50 / 500 / 5000 | 38 / 308 / 3008 | **30 / 300 / 3000** | 8 / 8 / 8 | **0 / 0 / 0** |
| C2 | partial | 50 / 500 / 5000 | 38 / 308 / 3008 | **30 / 300 / 3000** | 0 | **0** |
| C3 | partial | 50 / 500 / 5000 | 38 / 308 / 3008 | **30 / 300 / 3000** | 0 | **0** |
| C1 | covering | 50 / 500 / 5000 | 18 / 108 / 1008 | **10 / 100 / 1000** | 8 / 8 / 8 | **0 / 0 / 0** |
| C2 | covering | 50 / 500 / 5000 | 28 / 208 / 2008 | **20 / 200 / 2000** | 0 | **0** |
| C3 | covering | 50 / 500 / 5000 | 18 / 108 / 1008 | **10 / 100 / 1000** | 0 | **0** |
| **NC** | both | 50 / 500 / 5000 | — | — | **58 / 508 / 5008** | **50 / 500 / 5000** |

Representative plan, C1 covering:

```text
SEARCH c USING INDEX i_auth (scope=? AND state=? AND classification=? AND eff_from<?)
SEARCH ca EXISTS USING COVERING INDEX i_aud (chunk_id=? AND audience=?)
USE TEMP B-TREE FOR ORDER BY
```

> **Read the `ranked` column carefully — a zero there means the instrument was not active, not that
> nothing happened.** C2 and C3 rank by `bm25`, not by `probe_rank`, so `probe_rank` is never called in
> those queries. **Their "0 unauthorized bodies" is therefore ABSENCE OF MEASUREMENT, not evidence of
> absence**, and it must not be read as a clean result. **Body materialization is measured only for C1
> and NC.** For C2/C3 — that is, for the lexical half — **whether FTS5 internally traverses the
> tokenized content of unauthorized documents while resolving the `MATCH` is NOT MEASURED by this
> probe**, and no instrument available through `node:sqlite` reaches inside the FTS5 traversal. This is
> a genuine gap in the evidence and is one reason C2 and C3 are NOT CLEARED.

**Two results, pulling in opposite directions, and both are load-bearing.**

1. **For C1 — the one candidate where the instrument was active — no unauthorized passage body was ever
   materialized: zero, at every collection size, under both index designs**, against 8 ranked rows (the
   authorized set exactly). The negative control materialized **all** of them (5000 at M=5000). **This
   is the ADR-0020 Context hazard measured directly, and C1 does not exhibit it.**
2. **But the number of unauthorized rows the engine examines is non-zero and grows linearly with the
   collection, under every tested index design.** Improving the index from partial to covering reduced
   it — 3000 → 1000 at M=5000 — **but did not reach zero, and cannot.** The residual is the
   **set-overlap audience conjunct**, which lives in a junction table and **cannot be pushed into the
   chunks index**. The engine resolves it by examining candidate rows and rejecting as it goes.

**EPA-0006 §4.1 defines Shape 1 as: "the engine only ever examines chunks that satisfy it."** Measured
against that text, **no tested query shape achieved Shape 1.** See §6.3 — this is referred, not ruled.

### 5.4 Criterion 6 — strategy switching under selectivity, and pinning: **tested, class R**

**Strategy switching: none observed.** The plan was compared for a **highly selective** authorization
predicate against a **broad** one, both **before and after `ANALYZE`** (i.e. with the optimizer guessing
and with real statistics — the condition under which a cost-based optimizer switches). The plan was
**identical in all four combinations**; `strategy differs between selectivities: false`. **This is a
negative result on one engine at one corpus scale, not a general property**, and EPA-0006 finding 3's
obligation is unaffected for engines that do switch.

**Pinning is available but advisory, and that is the sharper finding.**

```text
INDEXED BY i_auth      -> accepted; plan pinned to the authorization index; returned 5/5, unauthorized 0
INDEXED BY i_unusable  -> ACCEPTED; plan = "SCAN c USING INDEX i_unusable"
```

`i_unusable` is an index on the same table that cannot serve this predicate at all. **The engine
accepted a pin that performs no authorization restriction whatsoever** and silently produced a full
scan. **So `INDEXED BY` can pin a good plan, but it cannot prevent a bad one** — the mechanism
constrains which index is used, not whether the authorization predicate restricts the traversal.

> **A correction made during this run, recorded because the wrong version was briefly printed.** An
> earlier iteration tested the pin with `INDEXED BY i_aud` and reported *"the pin is enforced by the
> engine"* on the strength of the rejection. **That conclusion was wrong**: `i_aud` is an index on a
> **different table**, so the error was name resolution — `no such index: i_aud` — and proved nothing
> about pin enforcement. The test was replaced with a same-table unusable index, **which reversed the
> finding.** A bare command failure is not a diagnosis (CLAUDE.md rule 5).

### 5.5 EPA-0006 finding 2, demonstrated by measurement rather than asserted

Same SQL, same engine, same data; only the plan forced to differ:

```text
optimizer-chosen : SEARCH c USING INDEX i_auth (…)  -> rows reached 3008, unauthorized 3000, returned 5/5, unauthorized returned 0
NOT INDEXED      : SCAN c                           -> rows reached 5008, unauthorized 5000, returned 5/5, unauthorized returned 0
```

**The returned answer is identical and correct in both cases. The execution is not.** EPA-0006 finding
2 — *"the same engine and the same SQL can produce either"* — and finding 1 — *"a Shape-3 engine
receives a fully constrained query and returns a correct response"* — are both now **demonstrated
experimentally**, on a real engine, with numbers. **A plan change is a security-relevant regression
here, not a performance one**, exactly as EPA-0006 §4.4 states.

---

## 6. Findings

### 6.1 Finding A — index coverage, not the engine, determines how much unauthorized data is examined

The discriminating variable in this probe was **not** the product and **not** the SQL. It was **which
conjuncts the index covers.** Widening the index from 3 conjuncts to 5 cut unauthorized rows examined
by two thirds. **The conjunct that cannot be covered — the multi-valued audience set-overlap — sets the
floor**, and that conjunct is required by ADR-0020 §2's *"chunks inherit authorization exactly"*.

**Consequence for any future engine selection:** the AMD-01 question *"can this engine pre-constrain?"*
is under-specified. The answerable question is **"can this engine pre-constrain *this* predicate,
including the set-overlap term, inside the traversal?"** — and for the one engine probed, the answer is
*mostly, with a residual proportional to the collection.*

### 6.2 Finding B — a post-filter design fails as an availability defect, long after it is chosen

The negative control returned **correct results on a small collection and empty results on a large
one**, never once returning an unauthorized row. A team that validated it at small scale would ship it,
and would later see **abstentions rather than a security alarm**. **The confidentiality property and the
availability symptom are separated by the collection size**, which is why EPA-0006 §4.4's insistence on
`M ≫ k` **and** invariance is not a formality.

### 6.3 Finding C — EPA-0006's Shape-1 definition, read strictly, may not be satisfiable by any engine

*"The engine only ever examines chunks that satisfy it"* is the definition. **Evaluating a conjunctive
predicate requires examining candidates and rejecting them** — that is what predicate evaluation *is*.
An engine cannot know a row fails the audience test without examining that row's audience.

The probe suggests the architecturally meaningful line is not *"examines nothing unauthorized"* but
**"materializes no unauthorized passage content"** — a line **C1 held** (zero unauthorized bodies
against 8 ranked rows) and the post-filter control **did not** (all of them). **For C2 and C3 that line
is unmeasured**, so this is not a claim that hybrid retrieval holds it. That distinction tracks
ADR-0020's own stated hazard, which is about **content** in the process, not about metadata.

**This is referred, not decided** (§8, item 1). **No ADR was amended and no EPA record was edited.**
Drawing this line is an architecture decision and MSG-0101 authorizes none.

---

## 7. Verdicts — per candidate and per class, with the deciding tier

**Required format from the queue's Verification block: CLEARED / DISQUALIFIED / NOT CLEARED.**

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

**Nothing is CLEARED. That is the honest result, and under MSG-0101 §2 it is the required one wherever
the evidence does not positively establish Shape 1.**

---

## 8. Items referred to the Architecture Lead — none blocking

1. **Is the Shape-1 bar "examines nothing unauthorized", or "materializes no unauthorized content"?**
   (§6.3.) The first appears unsatisfiable by any engine; the second is measurable, tracks ADR-0020's
   stated hazard, and **was met by all three conforming shapes and failed by the control**. **Only the
   Lead can settle which line AMD-01 intends.** Until settled, **NOT CLEARED stands** — this record
   does not adopt the weaker reading in order to clear anything.
2. **Probing classes S, V and K needs one operator action or one authorization**, and neither is
   self-authorizable: either **an operator starts Docker Desktop** (and the `docker` CLI is made
   reachable from the runner shell), or **installing a local engine is authorized** — currently barred
   by MSG-0101 §4. **Recorded as a sequencing observation; no task is proposed and none is marked
   READY.**
3. **No `EPA-0007` was created.** The queue's Documentation section requires the result be recorded as
   **a numbered COMMS message**, which this is. Creating a new architecture record was not authorized,
   and MSG-0101 §1(4) states **no new ADR is authorized**. **Flagged so a later reader does not go
   looking for a missing document.**

---

## 9. Acceptance criteria (MSG-0101 §3)

| # | Criterion | State | Evidence |
|---|---|---|---|
| 1 | Candidate list labelled evaluation-only; nothing adopted or selected | **MET** | §2; the harness header and footer both state it; no selection anywhere |
| 2 | Full ADR-0020 authorization predicate recorded | **MET** | §3 — printed verbatim by the probe, identical for every candidate |
| 3 | Tier-1 query evidence captured for each candidate | **MET** | §5.1; all four §3 constraint shapes in-query |
| 4 | Tier-2/3 evidence where exposed; insufficient evidence = NOT CLEARED | **MET** | §5.2, §5.3; classes S/V/K recorded NOT CLEARED with zero evidence |
| 5 | Shape 1 vs Shape 3 distinguished; post-filter and over-fetch stay disqualified | **MET** | §5.5 demonstrates the distinction experimentally; §7 disqualifies class D on measurement |
| 6 | Strategy switching tested, or explicitly NOT CLEARED | **MET** | §5.4 — tested for class R (no switch observed; pinning advisory); explicitly NOT CLEARED for S and V |
| 7 | No accepted ADR modified; no implementation task authorized | **MET** | `git diff --name-only docs/decisions/` → **empty**; no task status changed |
| 8 | COMMS, queue and status reconciled; stop after reporting | **MET** | this message, the queue row, `current.md`, and the checkpoint; the run stops here |

**Test count, reported as a real count rather than a claim:** **24 candidate executions** across **6
fixtures** (2 index designs × 3 collection sizes), **6 adversarial-precondition checks** (all
`ADVERSARIAL, as required`), plus the criterion-6 battery — 4 plan comparisons across the
selectivity × `ANALYZE` matrix, 2 pinning tests, and 2 census runs. **This is a probe, not a test
suite; it has no assertions framework and reports no pass/fail count beyond the verdicts in §7.**

---

## 10. Boundary verification

```text
git diff --name-only docs/decisions/   -> (empty)      no accepted ADR modified
git rev-parse HEAD                     -> e7aef44…     unchanged from session start
git rev-parse origin/main              -> e7aef44…     equal; no mid-run movement
docker                                 -> service `docker` VERIFIED RUNNING;
                                          `docker --version` VERIFIED unreachable from this runner
                                          (command not found, exit 127). Not started, not worked around
psql                                   -> VERIFIED absent (command not found, exit 127)
corpus                                 -> D:\Work\pci-corpus NOT read by this task
network / installs                     -> none
```

**Known runner limit, restated:** `git fetch` is off this runner's Bash allowlist, so the `origin/main`
comparison is against the **local remote-tracking ref**. A mid-run move of the real remote surfaces
here only as a **rejected push**.

---

## 11. What this record does **not** do

- **It selects, adopts, recommends and deploys nothing.** No engine is preferred over another; the one
  engine probed is **NOT CLEARED**.
- **It modifies no accepted ADR** — not ADR-0020 as amended, not ADR-0018 on supersession (MSG-0101
  §1(2)), not ADR-0019, on which **no Arabic normalization rule was written, inferred or proposed**.
- **It authorizes no implementation task** — T-C, T-D, T-E, T-F and every other remain unauthorized.
- **It invents no benchmark, latency, capacity, recall or throughput figure.** **Every number in this
  record is a count emitted by the probe in this session**, reproducible by re-running
  `implementation/probes/TASK-0033/probe.mjs`. **No timing figure appears anywhere**, deliberately:
  timing on a shared workstation would be noise presented as measurement.
- **It cites no vendor claim as a measurement.** No product documentation was consulted or relied on.
- **It settles neither of EPA-0006 §4.5's readings of "one projection index"**, which MSG-0101 §1(1)
  rules is one *logical* projection; the fusion hazard was not exercised, because only one engine was
  reachable.
