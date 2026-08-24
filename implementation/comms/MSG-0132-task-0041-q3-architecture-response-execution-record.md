# MSG-0132 — TASK-0041 Execution Record: the Q3 architecture response

**Status:** **OPEN** — informational; **one non-blocking question referred (Q13)**, one discovery
recorded (DISC-0011). **No decision is required before the repository is consistent.**
**Raised:** 2026-08-24
**Raised by:** Claude Code (supervisor-started runner, `runner.lock` pid 4316, acquired
`2026-08-24T15:27:18Z`)
**Type:** task execution record
**Authority:** **MSG-0130** (AUTHORIZED / READY), with **MSG-0129** (Q3, DECIDED) binding
**Related:** MSG-0131 (reconciliation), MSG-0128, MSG-0123, MSG-0118, MSG-0115, MSG-0109, MSG-0104;
EPA-0006 §4.6–§4.13; DISC-0011

---

## 1. What was produced

**EPA-0006 gains §4.13 — the Q3 architecture response — and §4.7's Q3 gains a declared pointer note to
it.** One file changed for the deliverable, **392 insertions / 0 deletions**, additive throughout.

**Nothing is CLEARED, and nothing could have been.** The task is **entirely structural**, and §4.9
**G-Q6 rejects construction-only evidence** in terms; MSG-0130 repeats the prohibition. **Its output
is a topology plus the evidence still owed on it.** **K7 and K8 remain NOT CLEARED. Five probes have
cleared nothing, and this task clears nothing.**

**Nothing was executed.** No probe was written, run or re-run; no engine installed or started; no
network reached; no corpus entered. **There is no test count and none is claimed** — the task's own
Verification section says documentary evidence only.

## 2. The content, in one page

**The ruling is quoted, not paraphrased**, and §4.13 records which of §4.7's three branches it takes:
**the third — reconsider the retrieval topology — leaving Q1 and Q2 open rather than ruling them.**

**The reduction.** §4.8 finding 1 is the whole of it: *"`U` equals the number of unauthorized rows the
routed structures still contain … isolation reduces `U` exactly insofar as it removes unauthorized
rows from the structures opened, and by nothing else."* Sixteen measured results (**F1–F16**) are
carried forward as the constraints any proposal must survive.

**Five invariants** are derived from those results — **N1** containment, **N2** closure of the
reachable set, **N3** refinement by enumerated transition, **N4** plan-independence, **N5**
non-withholding.

**The load-bearing claim, stated in §4.13 so it can be attacked:**

> **N1 and N2 together make N4 free.** If every structure within reach contains only entries the
> routed subject is authorized to see, **no plan over that reachable set can examine an unauthorized
> unit** — whatever the optimizer chooses and whatever a maintenance command rewrites. **The planner's
> freedom stops mattering exactly when there is nothing unauthorized left for it to reach.**

**This is why §4.12's `ANALYZE` result argues for redesign rather than for a better-behaved engine.**
If a routine maintenance command can move a design's `U` between **2857 and 0** without touching
schema, data, index, query text or design, then the property cannot be an optimizer property.

**Three caveats are recorded with the claim rather than after it**, and they are where it could fail:
N2's reachable set must be **genuinely complete** (one omitted shared dictionary or statistics
structure reintroduces exactly the traversal E1 disqualifies); the claim **does not discharge E2**,
because `U` counts what was **examined** and N1 states what is **contained** — §4.11 result 4 is the
demonstration, two designs reporting `U = 0` while holding **714** and **2143** unauthorized entries;
and it says nothing about **U5** or **routing-phase units**.

**Two patterns are added to §4.8's catalogue rather than replacing it** — **I7** boundary-refined
effectivity and **I8** entitlement-class materialisation. **Both are structural proposals and neither
has been measured.**

**I7 is the substantive architectural argument and it corrects a reading, not a fact.** §4.8 concluded
that effectivity-at-answer-time *"does not refine at all without fixing a time"*, refining only as of
an instant and decaying from it. **That is precise, and it was read one step too pessimistically.**
Effectivity is **piecewise constant in time**: the set of versions effective at `T` changes only when
`T` crosses some version's `effective_from` or `effective_to`, and **those boundaries are data already
held in the kernel, not a tuning parameter.** On the half-open interval to the next boundary, §4.8's
own refinement rule **is** satisfied. **I4 fixes a point and decays; I7 fixes an interval whose end is
computable and is invalidated by the event of reaching it** — MSG-0113's transition move, applied to a
second class of transition. **Its three traps are recorded with it**, with no figure attached: the
interval end is a **corpus-wide minimum** and shortens as the corpus grows; **ingestion changes the
partition without any boundary being crossed**; and **G-Q5 applies to I7 in full, unrelaxed.**

**Four topologies** — **W1** fully refined partitioning, **W2** per-principal materialisation, **W3**
entitlement-class materialisation, **W4** scoped execution confinement — are mapped cell by cell
against **E1–E4** and **G-Q4/G-Q5/G-Q6/G-Q7/G-Q7.8**, each property marked **S** (structurally
supplied), **X** (execution evidence required) or **S→X** (precondition only).

**The mapping's own finding is the uncomfortable one and it is the answer to Q3.** **The four
topologies differ from one another in exactly ONE cell** — G-Q4.3. Everywhere else they are identical.
**Topology decides G-Q4.1 outright and creates the precondition for E1, E3, G-Q5.1 and G-Q7. It
decides E2, E4, G-Q5.2, G-Q6, G-Q7.8 and N5 not at all.** A future session choosing among W1–W4 is
choosing on **cost and operability, not on clearance** — and **the cost figures do not exist**.

**Twelve minimum-evidence items (EV1–EV12)** state what a future engine-selection authorization would
need. **They are evidence, not a shortlist**, and they **add no gate and relax none** — satisfying all
twelve is what §4.6 S6 already means by CLEARED.

## 3. The recommendation, and what stays open

**One bounded recommendation is made, and it is a criterion rather than a selection** — §12.2's
precedent.

> **R1.** The architectural response to Q3 is **N1 + N2**: stop requiring the engine not to examine
> unauthorized content, and instead ensure **there is no unauthorized content within its reach.** The
> **confinement limb of E1 becomes a property the topology makes vacuous** rather than one the engine
> must prove, and the surviving question — whether containment holds at answer time — is answered by
> **`Ustruct`, a placement-independent measurement §4.11 already built and used.**

**R1 selects nothing, clears nothing and amends no ADR.** Like every §12.2 item it is a consequence of
already-accepted material — AMD-01's strict Shape-1, §4.6 S6/E1, §4.8 finding 1.

**The choice among W1–W4 is preserved as OPEN, and the reason is a named missing measurement.** They
are indistinguishable on clearance and differ on structure count, replication factor, invalidation
fan-out, re-refinement rate and split scoring statistics — **all unmeasured**, with corpus scale
**UNKNOWN at n=1** (§11 #1). **An open choice preserved as open is the valid outcome the task section
names, not a failure.**

## 4. The architecture gap — selection stays blocked

**MSG-0130: *"If the evidence cannot establish a topology capable of satisfying the existing gates,
record the architecture gap and keep selection blocked."*** Five gaps are recorded in §4.13.

| | Gap | Consequence |
|---|---|---|
| **GAP-A** | **I5, I7 and I8 have never been measured** | **No topology here is shown capable of satisfying the gates.** All four rest on at least one unmeasured pattern |
| **GAP-B** | **E4 is UNOBTAINABLE on the only reachable test subject** | **Blocks clearance independently of topology.** A probe on the same subject **would clear nothing whatever the topology** |
| **GAP-C** | **Cost is entirely unmeasured** | The W1–W4 choice cannot be made on evidence. **No figure is claimed** |
| **GAP-D** | **The addressable temporal frame is unsettled** — Q13 | I7's interval is relative to a query instant |
| **GAP-E** | **Q1, Q2 and Q7's numeric limb remain OPEN** | Their fail-closed defaults continue to apply, so none blocks the evidence work |

**GAP-B is the one to read first.** It says the topology work is **necessary and nowhere near
sufficient**, and that the next binding constraint is an **engine-observability** property that **no
amount of architecture can supply.** A future evidence task run against the same test subject would
reproduce NOT CLEARED regardless of how good the topology is — which is worth knowing **before** such
a task is authorized rather than after it runs.

## 5. Acceptance criteria — evidence for each

| # | Criterion | Evidence | Status |
|---|---|---|---|
| 1 | The Q3 architecture response is explicitly documented, **quoting MSG-0129 rather than paraphrasing** | §4.13 *"The ruling, quoted rather than paraphrased"* reproduces the ruling as a blockquote, plus two further limbs quoted inline | **MET** |
| 2 | Topology patterns defined **technology-agnostically** — no product, engine or vendor named as the bearer of a property | W1–W4 and I7/I8 are defined by composition over §4.8's catalogue. **No product, engine or vendor name appears in §4.13** | **MET** |
| 3 | Each pattern mapped to **E1–E4 and G-Q4/G-Q5/G-Q6**, marking each property **structural** or **execution-evidence-required** | The mapping table — 15 requirement rows × 4 topologies, every cell marked **S**, **X** or **S→X**, with the reason stated per row. G-Q7 and G-Q7.8 included beyond the required set | **MET** |
| 4 | **The minimum evidence** for a future engine-selection authorization is stated, and it is **evidence, not a shortlist** | **EV1–EV12**, each with what discharges it. **No candidate, product or class is named as a selection** | **MET** |
| 5 | **All prior verdicts reproduced unchanged** — K7/K8 NOT CLEARED, the DISQUALIFIED set unchanged, nothing relabelled; **no prior probe re-run** | §6 below reproduces all four verdict tables. `git status --porcelain implementation/probes/` → **empty**; no probe file touched | **MET** |
| 6 | **`git diff --name-only docs/` is empty**; no implementation task marked READY | `git diff --name-only docs/` → **empty**, checked after the edits and again before the commit. No task status changed except TASK-0041 → COMPLETE | **MET** |
| 7 | Where evidence is insufficient, **the architecture gap is recorded and selection stays blocked** | §4 above and §4.13's GAP-A…GAP-E. **Selection stays blocked; W1–W4 preserved as open** | **MET** |
| 8 | COMMS, queue and status reconciled; **stop at the documented response** | This message, the queue board row and section, the COMMS register, the status file, and checkpoint 2. **The run stops here** | **MET** |

## 6. Prior verdicts, reproduced unchanged (criterion 5)

**Transcribed, not re-derived. Nothing below is relabelled, softened, or re-presented as
conformance. No probe was re-run and no harness was touched.**

### 6.1 The nine MSG-0104 verdicts — as reproduced in MSG-0109 §7 and MSG-0112 §6.1

| Subject | Verdict | Decided at |
|---|---|---|
| **SQLite 3.51.3 — C1**, relational scalar | **NOT CLEARED** | Tier 3 |
| **SQLite 3.51.3 — C2**, FTS5 natural form | **NOT CLEARED** | Tier 3 |
| **SQLite 3.51.3 — C3**, FTS5 authorization-first join | **NOT CLEARED** | Tier 3 |
| **NC — application post-filter** (class **D**) | **DISQUALIFIED** | Tier 2 |
| **Class S** — search engines | **NOT CLEARED** | — (no engine reachable) |
| **Class V** — vector stores | **NOT CLEARED** | — |
| **Class K** — kernel store | **NOT CLEARED** | — |
| **Class L** — lexical-only | **NOT CLEARED** | Tier 3 |
| **Class H** — hosted / managed | **DISQUALIFIED** | not tested; none needed (ADR-0022 §1) |

### 6.2 The eight TASK-0035 isolation-design verdicts — EPA-0006 §4.8

| Design | Patterns | M=50 | M=500 | M=5000 | **Verdict (unchanged)** |
|---|---|---|---|---|---|
| **P0** | I0 | 20 | 200 | 2000 | **NOT CLEARED** |
| **P1** | I1 | 40 | 400 | 4000 | **NOT CLEARED** |
| **P2** | I1+I2 | 20 | 200 | 2000 | **NOT CLEARED** |
| **P3** | I1+I2+I3 | 10 | 100 | 1000 | **NOT CLEARED** |
| **P4** | +I4 | 0 | 0 | 0 | **NOT CLEARED** — E4 not obtained; zero holds at the materialisation instant only |
| **P5** | P4+I6 | 0 | 0 | 0 | **NOT CLEARED** — E3 argued from construction |
| **P4S** | P4 after the clock moved | 5 | 50 | 500 | **NOT CLEARED** — and it **returned** unauthorized rows |
| **NC** | negative control | 50 | 500 | 5000 | **DISQUALIFIED** — the control fails, so the run is valid |

### 6.3 The eight TASK-0037 freshness-design verdicts — EPA-0006 §4.10

| Design | Grid | `U` max (M=50/500/5000) | **Verdict (unchanged)** |
|---|---|---|---|
| **A0** | 10/10 | 62 / 512 / 5012 | **NOT CLEARED** |
| **A1** | 3/11 | 4 / 4 / 4 | **NOT CLEARED** |
| **A2** | 3/11 | 4 / 4 / 4 | **NOT CLEARED** |
| **A3** | 5/11 | 4 / 4 / 4 | **NOT CLEARED** |
| **A4** | 10/11 | 4 / 4 / 4 | **NOT CLEARED** |
| **A5** | 9/11 | 4 / 4 / 4 | **NOT CLEARED** |
| **A6** | **11/11** | 4 / 4 / 4 | **NOT CLEARED** — both G-Q5 conditions met, and still not cleared |
| **NC** | 5/11 | 4 / 4 / 4 | **DISQUALIFIED** |

### 6.4 The TASK-0038 kernel-constrained verdicts — EPA-0006 §4.11

| Design | `U` (50/500/5000) | `Ustruct`@5000 | E1 strict | G-Q4 | **Verdict (unchanged)** |
|---|---|---|---|---|---|
| **K0** | 4 / 4 / 4 | 2 | HOLDS | MET | **NOT CLEARED** |
| **K1** | 56 / 506 / 5006 | 5003 | VIOLATED | n/a | **NOT CLEARED** |
| **K2** | 53 / 503 / 5003 | 5003 | VIOLATED | n/a | **NOT CLEARED** |
| **K3** | 22 / 214 / 2143 | 2143 | VIOLATED | MET | **NOT CLEARED** |
| **K4** | 0 / 0 / 0 | 714 | VIOLATED | MET | **NOT CLEARED** |
| **K5** | 7 / 7 / 7 | 2 | HOLDS | **FAILED** | **DISQUALIFIED** |
| **K6** | 4 / 4 / 4 | 2 | HOLDS | MET | **DISQUALIFIED** |
| **K7** | 8 / 72 / 715 | 2143 | HOLDS | MET | **NOT CLEARED** |
| **K8** | 0 / 0 / 0 | 2143 | HOLDS | MET | **NOT CLEARED** |
| **NC** | 56 / 506 / 5006 | 5003 | VIOLATED | n/a | **DISQUALIFIED** |

### 6.5 The TASK-0039 verdicts — EPA-0006 §4.12

| Candidate | E1 | E2 | E3 | E4 | G-Q4 | **Verdict (unchanged)** |
|---|---|---|---|---|---|---|
| **K7** | reachable-structure limb **HOLDS plan-independently**; confinement limb **NOT** plan-independent | **NOT OBTAINED** | N/A, not transferable | **NOT OBTAINABLE** | MET in all 12 configurations | **NOT CLEARED** |
| **K8** | as K7 | **NOT OBTAINED** | N/A, not transferable | **NOT OBTAINABLE** | MET in all 12 configurations | **NOT CLEARED** |

**Also unchanged and stated so it cannot drift:** **K3 and K4 remain NOT CLEARED** under MSG-0119's
strict Q11 reading; **TASK-0038's recorded `U = 0` for K8 remains correct as a row-access count** and
is **not relabelled**; **class D and class H remain DISQUALIFIED**; **§4.3's withdrawn class-K
*"conforms structurally"* claim stays withdrawn** and its NOT CLEARED verdict stands.

## 7. One discovery, recorded and NOT corrected — DISC-0011

**While reproducing §6.4 the summary line above that table was found to disagree with it.** EPA-0006
§4.11 closes with *"Six designs **NOT CLEARED**, three **DISQUALIFIED**"*, while the table lists
**seven** NOT CLEARED and three DISQUALIFIED (or seven and two, excluding the negative control, which
the section's own *"9 designs"* phrasing implies). **Neither reading produces six.**

**No verdict is wrong** — each of the ten rows carries its own explicit verdict, all reproduced above
— and **nothing downstream depends on the tally**: MSG-0123, MSG-0124, MSG-0127, MSG-0129 and MSG-0130
all cite verdicts, never the count.

**It was NOT corrected, deliberately.** TASK-0041 is **additive-only** — *"nothing in §4.1–§4.12 is
deleted or reworded"* — and rewording a prior section needs its own authorization, of the kind
TASK-0031, TASK-0034, TASK-0036 and TASK-0040 each received. **Recorded in
[`DISC-0011`](../discoveries/DISC-0011-epa-0006-4-11-verdict-count.md), with its index row added in
the same commit that raises it.** The cheapest correct fix, offered as a suggestion and not a
decision, is an **additive dated note** on the §4.12/§4.7 pattern rather than a reword.

**This also required one wording change inside §4.13's own new text**, disclosed here rather than left
silent: a sentence originally read *"the nine §4.11 design verdicts"* and now reads *"every §4.11 and
§4.12 design verdict"*, so the new section **asserts no count** over a table whose count is in
question.

## 8. Boundaries — each verified, not asserted

- **No engine, runtime, provider, model or index technology selected, adopted, recommended, installed
  or deployed.** No product, engine or vendor name appears in §4.13. **No shortlist created.**
- **No implementation or deployment.** Nothing was executed; **`git status --porcelain
  implementation/probes/` → empty.** No host was touched; **the PCI server was not contacted.**
- **No accepted ADR modified.** `git diff --name-only docs/` → **empty**.
- **No weakening of strict Shape-1, `U = 0`, E1–E4 or Q4–Q12.** The diff **removes no line** —
  **392 insertions, 0 deletions.** No numeric threshold, tolerance or allowance introduced.
- **No real or confidential corpus.** None was opened; the corpus directory was not read.
- **No invented benchmark, latency, capacity, recall or throughput figure.** Every number in §4.13 is
  transcribed from the section that measured it. Where a cost is named — structure count, replication
  factor, fan-out, re-refinement rate — it is named as **unmeasured**.
- **No structural design claimed to clear a gate.** Every gate is marked **S**, **X** or **S→X** in
  the mapping table, and **every X and S→X is stated as evidence still owed.**
- **No planner behaviour generalized** from `node:sqlite` to an engine class; §4.13 states the rule
  and applies it.
- **No prior verdict relabelled and no prior probe re-run.**
- **MSG-0101 §1(1) not reinterpreted** — *"one projection index"* still means one **logical**
  projection, stated twice in §4.13 because W4 is the pattern most likely to be misread as licence.

## 9. One question referred — Q13, and it blocks nothing

**Q13 — which temporal frames must a topology be able to answer?** §3 constraint 3 evaluates
effectivity at *"`T`, the question's temporal frame, defaulting to now"*, which admits frames that are
not now. **I7 refines effectivity on the interval containing a given instant**, so a structure refined
around *now* cannot answer a question addressed to a different interval, and serving an arbitrary `T`
needs a structure per addressable interval.

**Referred rather than answered** because it is a product and architecture question — what an employee
may ask — and settling it here would decide the scope of ADR-0018 §4's effectivity semantics by
implication.

**Default until ruled, and it blocks nothing:** the strictest reading — **a topology serves only the
frames the answer path admits, and any frame it cannot serve must ABSTAIN** rather than answer from
the wrong interval. Fail-closed in the same shape as G-Q7.4; it can only withhold an answer.

**Q13 was verified unused before allocation:** `grep -rn "Q13" implementation/ docs/` → **0 matches**.
So were **I7**, **I8**, **N1–N5**, **W1–W4** and **EV1–EV12**, each checked against EPA-0006 and the
`implementation/` tree before use. **`T-A` was checked and is TAKEN** — it is a WP-0009 implementation
task label — which is why the topologies are **W1–W4** and not `T-A…T-D`.

## 10. A repeat process hazard, recorded because it is the second occurrence

**This run began against `090fb21` with a dirty working tree, and `HEAD` and `origin/main` moved to
`8a751ea` while it was still reading.** The mover was the **interactive COMMS session** committing the
TASK-0041 reconciliation (MSG-0131) — **35 seconds after this runner acquired its lock.**

**It was diagnosed before any work began, not after**, and the diagnosis is in
[`checkpoint TASK-0041`](../operations/checkpoints/TASK-0041.md) §*MID-RUN REPOSITORY MOVEMENT*: the
four files the commit touched are exactly the four that were uncommitted at session start; nothing
this session had read was invalidated; the tree is clean; and BLK-0009's prescribed test was **run**
rather than inferred — `git show HEAD:…CLAUDE-TASKS.md | grep -c "TASK-0041"` → **4**.

**This is BLK-0009's root cause recurring: the Supervisor reads the working-tree copy of
`CLAUDE-TASKS.md`, not the committed one**, so an interactive session editing the queue while the
Supervisor is enabled can start a runner against a half-written state. **No blocker is raised** — the
movement was convergent and the tree settled before the first action — and **no supervisor behaviour
was changed, which would need its own authorization.** It is recorded so the third occurrence is
recognised as a pattern rather than diagnosed from scratch.

## 11. State after this task

- **TASK-0041 is COMPLETE**, 8/8 acceptance criteria met with the evidence in §5.
- **No task is READY.** MSG-0130's acceptance ends at the documented architecture response;
  **engine selection stays blocked and must be separately authorized.**
- **Nothing is CLEARED. K7/K8 remain NOT CLEARED; five probes have cleared nothing**, and this task
  is not a sixth probe.
- **Q3 is ruled and answered.** **Q1, Q2 and Q7's numeric limb remain open**, and **Q13 is newly
  open** — none of them blocks anything.
- **No blocker is open.** **One discovery recorded: DISC-0011.**
- WP-0009 still reads **`DEFINED — NOT AUTHORIZED FOR IMPLEMENTATION`**; **T-0 and T-A…T-I remain
  unauthorized.**

## 12. What the Architecture Lead may want to decide next — offered, not requested

**None of these blocks anything, and this record requests no decision.**

1. **Whether R1 is recorded as settled** — the N1 + N2 criterion, on the §12.2 *criteria, not
   selections* pattern.
2. **Q13** — the addressable temporal frame.
3. **GAP-B's consequence for sequencing.** A future evidence task on the same test subject **cannot
   clear anything**, because E4 is unobtainable there. Whether the next evidence action should
   therefore be **measuring I5/I7/I8 on the reachable subject knowing it cannot clear** — which would
   still falsify or support N1/N2/N3 — **or obtaining a test subject that can supply E4 first**, is a
   sequencing decision this record deliberately does not take.
4. **DISC-0011** — whether the §4.11 summary line is worth an additive correction note.
5. **MSG-0060's observation about colliding task specifications** remains unanswered, unchanged by
   this task.
