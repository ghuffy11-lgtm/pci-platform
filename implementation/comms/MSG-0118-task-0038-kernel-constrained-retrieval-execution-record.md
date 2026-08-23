# MSG-0118 — TASK-0038 Execution Record: Kernel-Constrained Retrieval and Non-Divergent Projection

**Status:** **OPEN** — record + one non-blocking referral
**Raised:** **2026-08-23** — the session started and the probe was built and executed on 2026-08-23;
the run crossed local midnight, so this record and the accompanying commits carry **2026-08-24**.
Both dates are real and neither is a correction of the other.
**Raised by:** Claude Code (supervisor-started runner)
**Type:** Execution record
**Authority:** MSG-0116a **and** MSG-0116b (both DECIDED) | **Related:** MSG-0115, MSG-0117,
ADR-0018, ADR-0020 (+AMD-01), ADR-0017 §5, EPA-0006 §4.6–§4.11
**Deliverables:** `implementation/probes/TASK-0038/` (harness + captured output); EPA-0006 **§4.11**

---

## 1. Summary

**8/8 acceptance criteria MET. Nothing is CLEARED** — six designs **NOT CLEARED**, three
**DISQUALIFIED**. **No engine, runtime, provider, model or index technology was selected, adopted,
installed, deployed or recommended. No accepted ADR was modified** — `git diff --name-only docs/` is
**empty**. **No numeric staleness threshold was introduced** and **no benchmark, latency, capacity,
recall or throughput figure was produced.**

**A real probe ran**: **9 designs × 7 scenarios × 3 collection sizes**, two instrument placements
each plus a placement-independent structural measure, on **SQLite 3.51.3 via `node:sqlite`** (EPA-0006
class **R** test subject, the only engine reachable — `docker` is **not on this runner's PATH**,
re-checked in this session). `:memory:` only; nothing installed; no network; no corpus; no wall-clock
read.

**Both mandatory validity gates passed.** The adversarial precondition held at all three sizes, and
**the negative control failed in 15 of 21 cases**, so the run is valid under §4.6 S8.

**The question both rulings authorized has an answer, and it is not the hoped-for one.** A
kernel-constrained / in-query authorization path **eliminates divergence completely and does nothing
whatever for strict Shape-1**. The two designs holding no copy at all answered **7/7** and cannot go
stale — and carry **the largest `U` in the table**, growing linearly with `N`.

---

## 2. Two defects in this probe's own apparatus, found and fixed before any result was reported

**Recorded first, because both would have produced a false clean bill of health**, and because
TASK-0037's record established that a probe's own failures are worth more to a later reader than a
tidy account.

**Defect 1 — the E1 check was blind.** `EXPLAIN QUERY PLAN` prints the **alias**, not the table name.
The first draft aliased `k_chunk` as `c` and matched its spanning-structure check against **table
names**, so it found nothing and reported **E1 HOLDS for every design — including one whose plan
reads `SCAN c` over the entire collection.** Fixed by naming every alias after the structure it opens
(`kc`, `kv`, `kva`, `kedge`, `stok`), which also makes the captured plans checkable by a reader
rather than only by the regex. **After the fix E1 discriminates**, and it separates K3/K4 from K7/K8 —
a distinction the whole record turns on.

**Defect 2 — the counters sat past the effectivity filter, and one design's `U = 0` was an
artefact.** The instrument is a SQL function, so it fires at **row access**. In the first draft
`probe_ver(...)` was written as the **last** conjunct for the partitioned design and the **first** for
the edge designs — violating §4.6 S7's *"never compare two candidates on counts taken at different
placements"* — and SQLite had already applied the effectivity terms before calling it. **K7 reported
`U = 0`. With the placement made uniform it reports 715, growing with `N`.** The zero was the
instrument's, not the design's.

**Defect 2 is also what produced this probe's most useful instrument.** It made plain that a SQL
function **cannot observe index-entry reads at all**, so `U1` is **not instrumentable** on this test
subject. Rather than report a zero that cannot cover it, the probe adds **`Ustruct`** — the
unauthorized versions **present in the structures the traversal opens** — which is placement-independent
by construction and **cannot be moved by moving an instrument.** §4.6 S5 predicted exactly this
failure mode; here it occurred, was caught, and became a measurement.

**Four smaller fixture defects were also corrected before measurement**, each recorded in the harness
source at the point it bites: a routed partition that was never created (so the baseline design
silently abstained in every scenario instead of querying); `UNION ALL` across
entitlement-token partitions letting one chunk consume several of the `k` slots; a
catalogue-routing design paired with a structure that has no catalogue to enumerate; and a
content-reading re-check paired with a design whose retrieval never surfaces an unauthorized
candidate — so **the Shape-1 instrument could never have fired.** The last two are why K5 and K6 are
built on the **copy** design in the delivered harness.

---

## 3. What was asked, and how each ruling was encoded

### Q8 — the re-check is a control-plane lookup, under conditions

**Both files rule NO**, the mandatory ADR-0020 §3 point-2 re-check is not *examination*, **provided**
it reads only authoritative authorization / version / lifecycle metadata.

**MSG-0116b's addition is a requirement on the apparatus and it changed the instrument design:** the
re-check *"must be instrumented **separately** from retrieval-content examination, and evidence must
demonstrate that it reads **only** the authoritative kernel facts required to authorize the
candidate."* **MSG-0116a supplies the other half:** *"the existing measured kernel-read count is
**not, by itself, a Shape-1 violation**."*

**So the probe carries three counters, never one** — `U`, `KR.meta` and `KR.content` — and the split
is the evidence. Encoded in EPA-0006 §4.11 as **G-Q7.8a–e**.

**`KR.meta` is bounded by the candidate count and invariant with `N`** (98 reads at M=500 for the
kernel-constrained designs, identical at every size), **which is the measurement MSG-0116a's ruling
turns on.**

### Q9 — the bar is not relaxed

**It was not relaxed anywhere.** `U = 0`, E1–E4 and strict Shape-1 stand exactly as written. **No
design was cleared on a non-zero result for being invariant with collection size**, and **no engine
was selected on the assumption that the kernel join would fix it** — the probe measured that
assumption instead, and **§5 result 1 records that it is false.**

**A6's status is preserved as MSG-0116b requires:** it **passed the freshness gates and remains NOT
CLEARED** (E2 failed, E4 not obtained, G-Q4 not measured). Nothing in this record moves it.

### Q10 — currently effective version only

**Encoded in the fixture rather than described.** Version **V2** is `APPROVED` **but not
`PUBLISHED`**, and no design answers from it in any scenario; `WITHDRAWN` and `SUPERSEDED` versions
are likewise never answerable; and where the current version cannot be established the answer path
**abstains A7** rather than falling back — measured in scenario **S7**, which every non-control
design passes.

---

## 4. The designs, and why each exists

| | Design | What it isolates |
|---|---|---|
| **K0** | materialised copy; predicate on the copy; kernel re-check after | the shape every prior design shared. **Baseline, newly instrumented for G-Q4 and for the separately-counted re-check** — neither measured by any prior probe |
| **K1** | in-query kernel join, **collection-driven** | whether removing the copy is by itself sufficient |
| **K2** | in-query kernel join, **entitlement-driven** | whether driving the traversal from the subject rather than the collection is sufficient |
| **K3** | **kernel-side authorization edge**, exact-key routed, **co-written with the facts** in the same transaction | whether the four discrete conjuncts refine into a key |
| **K4** | K3, **open-ended effectivity limb only** | what buying `U = 0` by narrowing the served set actually costs |
| **K5** | K0 but **routing by catalogue enumeration** | whether G-Q4.3 bites on something returning identical answers |
| **K6** | K0 but the **re-check reads the candidate body** | **that MSG-0116b's Shape-1 instrument fires** — §4.6 S5's asymmetry rule applied to the instrument itself |
| **K7** | **physically partitioned authoritative store** — versions *and* chunks, both effectivity limbs | the strongest honest form of "prevents security-relevant projection divergence": **the partitions are where the truth lives**, so there is no copy and moving a version between partitions **is** the recorded transition |
| **NC** | negative control — rank first, authorize after | Shape 2 by construction (§4.6 S8) |
| **K8** | K7 with the bounded limb **forced onto the `eff_to` index** — one token's difference | whether the remaining residual belongs to the **predicate** or to the **optimiser** |

---

## 5. Results

**Full grid, plans and per-scenario detail: `implementation/probes/TASK-0038/probe-output.txt`
(550 lines). Harness: `probe.mjs` (1,376 lines). Both committed.**

| Design | Grid | `U` (50/500/5000) | `Ustruct`@5000 | E1 strict | G-Q4 | `KR.content` | **Verdict** |
|---|---|---|---|---|---|---|---|
| K0 | 6/7 | 4 / 4 / 4 | 2 | HOLDS | MET | 0 | **NOT CLEARED** |
| K1 | 7/7 | 56 / 506 / 5006 | 5003 | VIOLATED | n/a | 0 | **NOT CLEARED** |
| K2 | 7/7 | 53 / 503 / 5003 | 5003 | VIOLATED | n/a | 0 | **NOT CLEARED** |
| K3 | 7/7 | 22 / 214 / 2143 | 2143 | VIOLATED | MET | 0 | **NOT CLEARED** |
| K4 | **3/7** | **0 / 0 / 0** | 714 | VIOLATED | MET | 0 | **NOT CLEARED** |
| K5 | 6/7 | 7 / 7 / 7 | 2 | HOLDS | **FAILED** | 0 | **DISQUALIFIED** |
| K6 | 6/7 | 4 / 4 / 4 | 2 | HOLDS | MET | **24 (12 unauthorized)** | **DISQUALIFIED** |
| K7 | 7/7 | 8 / 72 / 715 | 2143 | **HOLDS** | MET | 0 | **NOT CLEARED** |
| K8 | **7/7** | **0 / 0 / 0** | 2143 | **HOLDS** | MET | 0 | **NOT CLEARED** |
| NC | 2/7 | 56 / 506 / 5006 | 5003 | VIOLATED | n/a | 0 | **DISQUALIFIED** |

### Six results carry beyond this engine

**1. Removing the copy fixes divergence and does nothing whatever for Shape-1.** K1 and K2 hold no
copy — authorization is joined from the authoritative kernel inside the retrieval operation — so they
answer **7/7** and cannot go stale. **Their `U` is the largest in the table and grows linearly with
`N`.** **Non-divergence and non-examination are independent properties, and the kernel join buys only
the first.** This is the direct answer to the question MSG-0115 referred and MSG-0116a forbade
assuming.

**2. The four discrete conjuncts refine perfectly; effectivity is the entire residual.** K3's
residual at M=5000 is **2142 units, composed exclusively of the three effectivity failure modes** —
714 expired, 714 not-yet-effective-open, 714 not-yet-effective-bounded. **Not one wrong-scope,
wrong-audience, restricted-class or superseded version is examined at any collection size.**
**§4.7 Q2 asked whether the conjuncts can be physically organised at all; for scope, classification,
lifecycle state and audience the measured answer is yes, cleanly.** Effectivity-at-answer-time
remains the sharpest discriminator, exactly as §3 predicted.

**3. `U = 0` is purchasable by withholding authorized content, and a criterion reading only `U` would
call that a success.** **K4 reaches zero at every size while scoring 3/7**: it withholds every version
whose effectivity window is bounded, returning an **empty ANSWER** in two scenarios where an answer
exists. That is EPA-0006 §3.3's **wrong-exclusive** defect — an availability failure, invisible to `U`
by construction. **A clearance criterion that reads `U` without reading the served set can be
satisfied by a design that answers nothing.**

**4. A design can report `U = 0` while the structures it opens still hold unauthorized entries.**
K4 and K8 both report zero; their `Ustruct` is **714** and **2143**. The seek bound skipped those
rows, the counter never saw them, and **whether the engine read the index entries describing them is
NOT OBSERVABLE through `node:sqlite`.** **`U1` is not instrumentable on this test subject and this
record says so rather than reporting a zero it cannot support.**

**5. On this engine, whether unauthorized content is examined is decided by the query planner.**
**K7 and K8 have the same schema, the same data, the same indexes, the same query text apart from one
`INDEXED BY` token, the same answers and the same 7/7 grid. `U` goes 715 → 0.** Both indexes exist on
both designs; the optimiser chose the one that seeks on the *lower* effectivity bound and leaves every
expired version exposed, **and the design had no way to tell.** **A `U = 0` measurement taken without
pinning the plan is a measurement of one plan, not of a design** — and a plan is not stable across
data volumes, statistics or engine versions.

**6. The separately-instrumented re-check is the only thing distinguishing a clean design from a
violating one.** **K0 and K6 agree on every other measurement this probe takes** — same `U`, same
`Ustruct`, same plan, same routed set, same answers, same grid. **Only `KR.content` separates them**,
firing **12 times against unauthorized candidates** for K6 and zero for K0. **Without MSG-0116b's
separate-instrumentation requirement the two are indistinguishable and the violating design reports
clean.** That is what makes Q8 falsifiable rather than an assertion about intent.

### And one prior finding reproduced in a third independent fixture

K0's `U` is **0 in the steady state and non-zero in every scenario where an authorization fact changed
at the query instant** — **divergence with zero elapsed time**, which no timer could catch.
**§4.8 finding 1 and §4.10 finding 5, corroborated a third time.** The kernel re-check caught it every
time (`kept 2/4`) — **ADR-0020 §3's defence in depth working as specified** — and **the re-check
cannot reduce `U`**, because by the time it runs the units have been examined.

### G-Q4 measured for the first time

**K5 fails G-Q4 while returning exactly the answers K0 returns.** Its routing reads scale **12 → 76**
with other subjects' structures, and it reads **67 catalogue rows describing partitions the subject is
not entitled to**. **§4.9's *"behaviourally identical and only one satisfies the gate"* is now
demonstrated rather than predicted.** Every computed-routing design met G-Q4: routed set and routing
read count **identical** across collections differing only in other subjects' structures.

---

## 6. Acceptance criteria

| # | Criterion | Result |
|---|---|---|
| 1 | Kernel-constrained / non-divergent alternative evaluated with **execution evidence, not design argument** | **MET** — 9 designs × 7 scenarios × 3 sizes; harness and 550-line output committed |
| 2 | **E1–E4 and G-Q4 each addressed** — obtained or explicitly recorded as not obtained | **MET** — E1 obtained under two stated readings; E2 obtained with placement recorded **and** a placement-independent companion; **E3 recorded N/A for this fixture and expressly non-transferable**; **E4 NOT OBTAINED**, stated before the results table; G-Q4 measured, first time |
| 3 | **Re-check instrumented separately** from content examination, with evidence it reads only authoritative kernel facts | **MET** — `KR.meta` / `KR.content` are distinct counters; the readable field set is exhibited and closed; `KR.meta` shown invariant with `N` |
| 4 | **Any content-bearing read from an unauthorized candidate reported as a Shape-1 failure** | **MET** — **and demonstrated to fire**: K6 reports 12 such reads and is **DISQUALIFIED** |
| 5 | Per candidate **CLEARED / NOT CLEARED / DISQUALIFIED** with the deciding evidence; unobtainable evidence ⇒ NOT CLEARED | **MET** — see §5 |
| 6 | **All existing verdicts reproduced unchanged**, including A6's freshness-passed-but-NOT-CLEARED status | **MET** — nine MSG-0104, eight §4.8 and eight §4.10 verdicts unchanged; **no prior probe modified or re-run** |
| 7 | **No accepted ADR modified** — `git diff --name-only docs/` empty | **MET** — verified after every edit |
| 8 | COMMS, queue and status reconciled; **stop at evidence and clearance status** | **MET** — this message, the queue, the registers and the status file; **the run stops here** |

---

## 7. Boundaries honoured

- **Nothing selected, adopted, recommended, installed or deployed.** The engine is a **test subject**.
- **`U = 0`, E1–E4 and strict Shape-1 not relaxed.** No gate weakened, no tolerance invented.
- **No accepted ADR modified** — ADR-0018 and ADR-0020 included. **`docs/` untouched.**
- **No implementation task authorized or marked READY.**
- **No numeric staleness threshold**; no benchmark, latency, capacity, recall or throughput figure.
- **No real or confidential corpus entered**; fixtures synthetic and generated in-process.
- Nothing installed; **Docker Desktop not started** (operator action); no network; `:memory:` only.
- **EPA-0006 §4.11 is additive** — **187 insertions, 0 deletions**, `### 4.11` written exactly once.

---

## 8. One question referred — Q11. It blocks nothing.

**Q11 — does an exact-key seek into a scope-spanning structure violate E1?**

§4.6 S6/E1 requires confinement to *"a structure or region **every entry of which** satisfies the
predicate"* and calls *"a scan **or seek** over a structure that spans authorization scopes …
disqualifying regardless of any counter."* **Read strictly, an exact-key seek into a global table
violates E1 even though it touches only an entitled row.**

**It decides K3 and K4**, whose plans seek `k_authz_edge`, `k_version` and `k_chunk` by exact key.
**This probe reports both readings and adopts the strict one**, because it is **fail-closed** — it can
only withhold clearance, never grant it.

**Why it blocks nothing: K7 and K8 satisfy E1 under BOTH readings**, by partitioning the version and
chunk stores as well. The question does not decide the strongest candidates, and a probe can run every
gate today with Q11 open.

**Related but distinct from two open questions, and the distinction is worth keeping:** §4.7 **Q1**
concerns index entries describing **chunks**; §4.9's open note concerns identifiers describing
**structures**; **Q11 concerns rows in a scope-spanning table reached by exact key.** All three
currently take the same fail-closed default.

---

## 9. State after this task

- **TASK-0038 is COMPLETE** — 8/8 acceptance criteria MET.
- **Nothing is CLEARED.** Six NOT CLEARED, three DISQUALIFIED. Classes **S**, **V** and **K** remain
  unreachable and NOT CLEARED with zero execution evidence; **D** and **H** remain DISQUALIFIED.
- **No task is READY**, and none was marked so. **Both rulings require stopping at evidence and
  clearance status** — MSG-0116a §6, MSG-0116b *Next authorized action*.
- **No blocker is open.**
- **The next action is the Architecture Lead's.** The evidence Q9 asked for now exists, and
  **MSG-0116a's instruction on what to do with it is explicit**: *"If no candidate can satisfy the
  existing gates, the project must return to Q3 for an explicit architectural response; the failure
  does not authorize relaxing Shape-1."* **No candidate satisfied the gates.** Result 5 above is
  offered as the sharpest input to that decision — on this engine class the Shape-1 property sits
  **outside the architecture**, in the query planner.
