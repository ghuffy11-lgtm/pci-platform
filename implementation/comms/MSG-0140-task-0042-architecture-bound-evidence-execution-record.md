# MSG-0140 — TASK-0042 Execution Record: Architecture-Bound Retrieval Evidence

**Status:** **OPEN** — informational; **one discovery recorded (DISC-0012)**, **nothing referred that
blocks anything**
**Raised:** 2026-08-24
**Raised by:** Claude Code (supervisor-started runner, TASK-0042)
**Type:** Evidence / measurement execution record
**Authority:** **MSG-0137** (AUTHORIZED), with **MSG-0134 (Q1 = A, strict)**, **MSG-0135 (Q2 = B)**,
**MSG-0136 (Q7 = A)** and **MSG-0133 (Q13)** binding; queue section TASK-0042; reconciliation MSG-0139
**Architecture record:** **EPA-0006 §4.14** · **Harness and captured output:**
`implementation/probes/TASK-0042/probe.mjs`, `probe-output.txt`

---

## 0. The result, first

**Six candidates measured. All six NOT CLEARED. Nothing is cleared, nothing is selected, no ADR is
amended, no gate is relaxed, and no numeric threshold is introduced.**

**E4 alone would have been enough for that**, and §4.13 GAP-B said so before the task started. The
measurement still mattered, because it decides whether E4 is the **only** thing missing — **and it is
not.** Four candidates fail **E2** on their own evidence, one fails **G-Q4.3**, and the one that
reaches `U` = 0 fails by **withholding**, in a direction no counter can see.

**Nothing was cleared and nothing could have been. Six probes have now cleared nothing.**

---

## 1. What was run, and what was deliberately not

**Not re-run, because MSG-0137 item 3 forbids repetition:** TASK-0033's sweep, TASK-0035's P0…NC grid,
TASK-0037's 8 × 11 freshness grid, TASK-0038's 7-scenario grid, TASK-0039's 12-configuration grid and
its `M` = 20000 column. **All of that evidence stands exactly as measured, and none of it was
modified.**

**Re-run deliberately:** the **validity gates**. §4.6 S8 requires the adversarial precondition and a
failing negative control in **every** probe run; without them this run's numbers would prove nothing.
That is a requirement on each run, not a repetition of a prior case.

**New in this run:** other subjects' partitions materialised **physically**; two routing **mechanisms**
compared; **two placements no prior probe took**; **three patterns never measured** (I5, I7, I8); the
**four Q7 transitions** with the discriminator and the abstention case; and the **E4 re-check**.

**Run validity — all gates, quoted from the probe's own output:**

```text
adversarial precondition       : HELD at every size and both distributions
index-cursor calibration       : EXACT on both plans
retrieval negative control     : failed 3/3 cases
routing negative control       : FAILED G-Q4.2 as required
freshness negative control     : failed 6/6 cells
plan-transfer control          : 0/54 non-transferable
measurements recorded          : 18 placement grid cells + 36 freshness cells
>> THIS RUN IS VALID.
```

**The adversarial precondition held** — the unconstrained top-6 contained **0** authorized chunks at
`M` = 50 / 500 / 5000 under both distributions. **The retrieval control failed in 3 of 3 cases**
(`U` = 116 / 566 / 5066, answering 1 of 4 authorized chunks). **The measurement count is non-zero and
"0 measurements" would have been a failure**, as the task's Verification section requires.

---

## 2. Item 1 — routing and physical structure (Q2 = B, G-Q4)

### 2.1 The finding that matters most is a correction to the evidence base, not to a verdict

**TASK-0038 and TASK-0039 both ran the G-Q4.2 differential against a catalogue containing no other
subject's structure at all.** Their store builder skips any partition key that is not the requesting
subject's, and says so in its own comment: *"other subjects' partitions are not materialised here"*.
The differential varied rows in the **kernel**, which routing never opens.

**A differential that varies rows in a table nobody routes over does not test G-Q4.2.** TASK-0039's
*"G-Q4 MET in all 12 configurations"* **was correctly measured and is not withdrawn** — but it was
measured against a catalogue with nothing in it to find, and that **bounds what it established**.
Recorded as **DISC-0012**.

**This probe materialised other subjects' partitions physically and counted the catalogue:**

| other subjects | catalogue objects | subject's own | **another subject's** | kernel/other |
|---|---|---|---|---|
| 0 | 32 | 20 | **0** | 12 |
| 16 | 128 | 20 | **80** | 28 |
| 64 | 416 | 20 | **320** | 76 |

### 2.2 Two mechanisms, behaviourally identical, one gate

**§4.9 G-Q4's design-consequence note predicted this in those words and it is now measured.**

| mechanism | others | routed | catalogue rows | **`U`(routing)** |
|---|---|---|---|---|
| R-COMPUTED — names derived from entitlements, resolved by exact key | 0 / 64 | 4 / 4 | **0 / 0** | **0 / 0** |
| R-CATALOGUE — names found by scanning the catalogue | 0 / 64 | 4 / 4 | **32 / 416** | **0 / 320** |

**They select the same four structures.** G-Q4.2 applied: R-COMPUTED **4 vs 4 reads → MET**;
R-CATALOGUE **identical set, 32 vs 416 reads → FAILED**.

> **A test checking only the routed set would have passed the catalogue-scanning mechanism.** It
> returns exactly the right structures and reads **320** catalogue entries naming other subjects'
> structures on the way. **Under Q1 = A those reads are examination and G-Q4.4 puts them in `U`.**
> That is why the gate names **both** limbs, and why the candidate carrying that routing mechanism
> reports `U` = 320 at `M` = 50 where its retrieval-phase `U` is 7.

**G-Q4.3 is evidenced from the plan:** `EXPLAIN QUERY PLAN` on the routing statement returns
**`SCAN sqlite_schema`**.

### 2.3 Routing-phase observability is PARTIAL, and the unmeasurable half is what Q1's open interaction asks about

**Explicit catalogue reads are measurable and were measured. Implicit schema resolution is NEVER
MEASURED**, with the exact limitation: the authorizer reports `SQLITE_READ` only for statements
reading the catalogue **as data** — on the computed-routing statement it reported **8 distinct read
targets, none of them a catalogue object** — and `SQLITE_ENABLE_STMT_SCANSTATUS` is **ABSENT** from
this build, with no `node:sqlite` hook below statement compilation.

**"NONE" there means the statement does not read the catalogue as data. It does not mean the engine
performed no schema lookup**, and no reachable instrument can say. **This probe decides nothing about
§4.9 G-Q4's unnumbered open interaction** (MSG-0139 §4); it records that **the quantity the question
turns on is not observable on the only reachable test subject** — a fact a ruling needs either way.
**Kernel-object catalogue reads are counted separately and deliberately not folded into `U`**, for
the same reason.

---

## 3. Item 2 — every applicable placement exercised, maximum reported (S7-R1/R2/R3)

**Five placements were taken. Reachability was established by taking them, never by documentation.**

| | Placement | What calibration showed it counts |
|---|---|---|
| **P-ROW** | `probe_ver(pv.version_id)` | once per version **row accessed** — TASK-0038's placement |
| **P-VIDX** | `probe_idx(pv.open_ended)` | once per version **index entry visited**; reproduced a constructed cohort **exactly** — **302** planner-choice, **402** pinned |
| **P-CIDX** | `probe_cidx(pc.version_id)` | **NEW.** Fires **once per surviving pair** — the chunk cursor is entered only for versions that already passed the version-side residual, so **it does not see what that residual rejected** |
| **P-RANK** | `probe_rank(...)` | once per candidate entering the ordering — §4.6 S4 **U3** |
| **P-ROUTE** | `probe_cat(name)` | once per catalogue entry read while selecting structures — **G-Q4.4** |

**And one more the compile options said existed was taken rather than argued away.**
**`SQLITE_ENABLE_DBSTAT_VTAB` is PRESENT** — the only relevant option that is. The `dbstat` virtual
table **is reachable and is not a `U1` instrument**: it reports the **stored layout** of a b-tree,
identically whether a query ran or not, and cannot report how many entries a **traversal visited**.
**So the reachable-but-unexercised set is EMPTY for the right reason** (§4.6 S7.3): the placement was
**taken** and found to measure a different quantity.

**The grid — maximum `U` across exercised placements (S7-R2):**

| Candidate | `M`=50 | `M`=500 | `M`=5000 | Growth | Verdict |
|---|---|---|---|---|---|
| **K7** | 7 | 71 | **714** | GROWS | **NOT CLEARED** |
| **K8** | **2** | 66 | **709** | GROWS | **NOT CLEARED** |
| **I5** | 7 | 71 | **714** | GROWS | **NOT CLEARED** |
| **I8** | 7 | 71 | **714** | GROWS | **NOT CLEARED** |
| **I7** | **0** | **0** | **0** | — **bound VACUOUS in 3/3 cells** | **NOT CLEARED** |
| **KR** | **320** | **320** | 714 | GROWS | **NOT CLEARED** |

> **K8's row is S7-R3 working as a rule rather than as a probe's diligence.** Its **row-access `U` is
> 0** at every size, exactly as TASK-0038 measured and as §4.12 said remains correct **as a row-access
> count**. **The figure reported here is 2 / 66 / 709**, because S7-R2 requires the maximum across
> exercised placements. **This is the first grid in the record where a row-access zero is superseded
> by the criterion itself.**

**`U1 = 0` is claimed for nothing.** Every index-entry figure is a **lower bound**, and **a zero in
the derived bound means "this bound proves nothing at this size"** — which is why I7's zeroes are
labelled **VACUOUS** rather than reported as clean.

---

## 4. Item 5 — I5, I7 and I8: measured, and what stays NEVER MEASURED

### 4.1 I5 and I8 measure IDENTICALLY to K7, and that is the result

**Both discharge conjuncts 1, 2a, 2b and 4 — and not 3.** Measured `U`: **7 / 71 / 714 — the same as
K7 at every size**, on **one** routed structure instead of four.

**§4.8 finding 1 is corroborated in a third independent fixture:** *"isolation reduces `U` exactly
insofar as it removes unauthorized rows from the structures opened, and by nothing else."* **A finer
partition key that does not refine the effectivity conjunct removes no unauthorized row and reduces
`U` by nothing.** **Neither I5 nor I8 is an improvement on K7 in the dimension the gate measures.**

### 4.2 I7 reaches `U` = 0 and fails anyway, by WITHHOLDING

**I7 is the only pattern whose measured `U` is zero at every size** — refining on the interval to the
next boundary discharges effectivity **by construction** for that interval, so **§4.13's argument
holds as far as it goes.** It does not go far enough, and both reasons were measured:

- **At the boundary.** The next boundary is **computed from kernel data** and lands **15000 fixture
  units** after the query instant. Crossing it without re-refining: the structure returned **4 rows**,
  **leaked 0** — the kernel re-check caught the leak — **and WITHHELD 142 of the 146 authorized chunks
  the kernel held at that instant.**
- **Inside the interval.** A version **ingested** between `t` and the boundary — **no boundary
  crossed** — **did not appear in the answer.** §4.13 named this in advance; **it is now measured.**

> **Both failures are WITHHOLDING, and `U` is blind to both.** §4.6 S5 warned that a zero may be an
> artefact of placement; §4.10 result 4 extended it to a non-zero count concealing opposite outcomes.
> **This extends it again: a genuine, correctly-placed `U` = 0 can sit on top of a design that
> answers almost nothing it should.** §3.3 wrong-exclusive and the K4 trap both say that cannot be
> traded for a clean `U`.

### 4.3 What stays NEVER MEASURED, each with its exact limitation

| Pattern | Quantity | Limitation |
|---|---|---|
| I5 | structure count / replication factor at scale | corpus **unmeasured at n=1** (§11 #1); no principal population exists to count against |
| I8 | entitlement-class count, combinatorial worst case | no real entitlement population in the fixture; a synthetic count would be **an invented figure** (§4.6 S11) |
| I8 | cost of a subject moving between classes | needs a migration mechanism this probe does not build and MSG-0137 does not authorize |
| I7 | re-refinement **rate** vs corpus boundary density | §4.13: *"UNKNOWN"* — corpus unmeasured at n=1 |
| I7 | **G-Q5.1c abstention-on-breach as a mechanism** | this probe measures what the structure **returns**; it builds **no abstention controller**, so the mechanism limb is untested |
| all | **E4** — engine log inspection | **UNOBTAINABLE** on this subject (§5 below); not inferable (§4.6 S9) |
| all | **E3** — opaque-stage confinement | no lexical or vector stage is built here; FTS5 `MATCH` internals were NOT MEASURED by MSG-0104 §5.3 and remain so |
| all | implicit schema resolution during routing | no instrument below statement compilation; `ENABLE_STMT_SCANSTATUS` ABSENT |
| all | interior b-tree pages, pager reads, other loops | the instrument is a **lower bound by construction** (§4.6 S5); no reachable API reports them |

**Under §4.6 S9 every one of these yields NOT CLEARED for the pattern that carries it. There is no
third option and none was taken.**

---

## 5. Item 4 — Q7 zero stale-answer tolerance across the four transitions

**Six transitions × six designs × two instants = 36 cells.** The two instants are **before** and
**after** a periodic timer fires — **G-Q7.2's discriminator**.

> **The period is a FIXTURE CONSTANT**, present only so a "before" and an "after" exist. **No
> magnitude is judged, proposed or recommended, and Q7 = A introduces no threshold** — which is
> precisely why the test is the **transition itself** and not an elapsed-time measurement.

| Design | Mechanism | Passes at BOTH instants |
|---|---|---|
| **T1** | materialised, **periodic only** | **0 / 6** |
| **T2** | + transition-triggered invalidation, hooked to **lifecycle state only** | **2 / 6** |
| **T3** | + kernel consult for currency + §3 point-2 re-check **against the kernel** | **6 / 6** |
| **T4** | **authoritative partitioned store** — truth in the partition, no copy | **6 / 6** |
| **T5** | as T3 but the re-check reads **the copy** | **5 / 6** |
| **NCF** | negative control — falls back to the last good snapshot | **0 / 6** — failed as required |

**Aggregate failure counts, from recorded flags rather than displayed verdict strings** (a cell both
stale and unauthorized displays only the first; **categories overlap and do not sum to 36**):

- **15 of 36** answered the **prior version** at at least one instant;
- **12 of 36** answered a version **unauthorized** for the subject at the query instant;
- **6 of 36** returned an **empty answer** where an abstention was required (**G-Q7.4**);
- **6 of 36** **withheld** an authorized current version — the other failure direction.

**The discriminator fired in 4 cells** — T1 and NCF on *update* and *approval* — **failing before the
timer and passing after it. Those designs were made correct by waiting, not by the transition.** Under
Q7 = A **the later pass is not mitigation**, because there is no allowance for it to fall inside.

**T3 versus T5 isolates G-Q5.2b's "limb most easily faked".** On the one transition that separates
them — a version that stays **current** by lifecycle and becomes **unauthorized** by reclassification
— **T3 abstained and T5 answered it.** Same hooks, same consult, same structures; **they differ only
in what the re-check reads.** §4.10 result 3 demonstrated this once; it is reproduced here on an
independent fixture.

**T3 and T4 pass every transition at both instants and are STILL NOT CLEARED.** §4.9 and §4.10 both
say why in terms — these gates are **necessary and never sufficient** — and §4.10 demonstrated it
rather than asserting it, with design A6 meeting **both** G-Q5 conditions and **every** G-Q7
requirement and remaining NOT CLEARED.

> **A defect in this probe's own first version, recorded rather than quietly repaired.** The currency
> consult originally ran the **full authorization predicate**, so it rejected the reclassified version
> before the re-check was reached and **T5 passed 6 of 6 — a control that could not fail.** The repair
> is architecturally the right one anyway: **currency is not authorization.** G-Q7.1/G-Q7.3 ask whether
> the answer resolves against the **current** version; ADR-0020 §3 point 2 and G-Q5.2 ask whether each
> hit is **re-authorized**. Separating them is what made the limb testable. **Both the defect and the
> repair are in the probe source as a comment, and in EPA-0006 §4.14 finding 7.**

**Abstention-class assignment is a fixture convention, not a ruling.** ADR-0017 §5 names A1–A7 but
fixes no mapping from a specific failure to a specific class, and this probe proposes none. **What the
gate actually turns on is G-Q7.4: an abstention, not an answer and not an empty answer** — and that is
what is scored.

---

## 6. Item 6 — the E4 re-check

**The §4.12 enumeration was re-run in full on the runtime as it stands**, including the
**nonexistent-pragma control** without which *"the instrument reported nothing"* and *"the instrument
was never running"* are the same observation.

| Check | Result in this run |
|---|---|
| `DatabaseSync` / `StatementSync` prototypes | **no trace, profile or log member of any kind** |
| `PRAGMA compile_options` | **`DEBUG` ABSENT · `ENABLE_SQLLOG` ABSENT · `ENABLE_STMT_SCANSTATUS` ABSENT** |
| Five tracing pragmas vs a pragma that does not exist | **identical behaviour — every one inert** |
| `db.location()` on `:memory:` | **`null`** — no file, so no journal, WAL or engine-written artefact |

**Subject:** SQLite **3.51.3** via `node:sqlite`; runtime Node **v24.15.0** — recorded so a later
reader can tell whether a different answer would mean a changed engine or a changed probe.

**E4 remains NOT OBTAINABLE on this test subject. §4.13 GAP-B stands.** The second negative is the
**expected result, not a failure**, and **nothing is inferred from the absent log.**

**A surface scan was run and is NOT offered as E4:** 5 engine-produced text surfaces scanned against 3
unauthorized passage bodies → **0 occurrences**, parameters being bound rather than inlined. **That
says nothing about an engine log**, which is what E4 concerns.

---

## 7. Item 7 — gate status per candidate, and every prior verdict

**All six NOT CLEARED**, with the reason stated per candidate rather than as a single sentence:

| Candidate | E1 | E2 | E3 | E4 | G-Q4 | **Verdict** |
|---|---|---|---|---|---|---|
| **K7** | routed partitions only | **NOT OBTAINED** — `U` to 714, grows with `N` | **NEVER MEASURED** | **NOT OBTAINABLE** | MET | **NOT CLEARED** |
| **K8** | as K7 | **NOT OBTAINED** — `U` to 709, grows with `N` | **NEVER MEASURED** | **NOT OBTAINABLE** | MET | **NOT CLEARED** |
| **I5** | one routed structure | **NOT OBTAINED** — `U` to 714, grows with `N` | **NEVER MEASURED** | **NOT OBTAINABLE** | MET | **NOT CLEARED** |
| **I8** | one routed structure | **NOT OBTAINED** — `U` to 714, grows with `N` | **NEVER MEASURED** | **NOT OBTAINABLE** | MET | **NOT CLEARED** |
| **I7** | one routed structure | **NOT SATISFIED on a zero alone** (§4.6 S5); bound **VACUOUS 3/3**; **withholds** at the boundary and on ingestion | **NEVER MEASURED** | **NOT OBTAINABLE** | MET | **NOT CLEARED** |
| **KR** | as K7 | **NOT OBTAINED** — `U` to 714, grows with `N` | **NEVER MEASURED** | **NOT OBTAINABLE** | **FAILED (G-Q4.3)** | **NOT CLEARED** |

**Prior verdicts, reproduced unchanged and not re-measured:** MSG-0104's nine class verdicts; §4.8's
P0…NC verdicts; §4.10's A0…NC verdicts; §4.11's K0…NC verdicts; **§4.12's K7 and K8 — both NOT
CLEARED**; **K3 and K4 under MSG-0119's strict Q11 — both NOT CLEARED**; class D and class H —
**DISQUALIFIED**. **Nothing was relabelled, re-run or re-measured.**

---

## 8. Boundaries — each MSG-0137 prohibition, checked

| Prohibition | Verified |
|---|---|
| No engine / runtime / provider / model / index selection | **Nothing selected.** SQLite via `node:sqlite` is named a **test subject** throughout, and its planner behaviour is explicitly not generalized |
| No implementation or deployment authorization | **None given.** No task is marked READY |
| No modification of accepted ADRs | **`git diff --name-only docs/` → empty**, checked after the edits and again from `main` |
| No relaxation or reinterpretation of strict Shape-1 or any gate | **EPA-0006's diff is 287 insertions / 0 deletions** — no gate line is altered because no line is removed |
| No invented counts, inferred observability, construction-only substitution | Every figure is engine-reported or arithmetic **explicitly labelled as derived**; **`U1 = 0` is claimed for nothing**; E4 is recorded unobtainable rather than inferred |
| No Docker / host installation, no operator intervention | **Nothing installed.** `:memory:` only; no network; no file created except the probe's own captured output |
| No numeric staleness threshold | The freshness period is a **fixture constant**, declared as such in the probe and in §4.14 |

**Q13 was respected:** every measurement is at the **current/"now"** frame. **No historical or future
frame is answered**, and none was tested as answerable.

---

## 9. Discovery recorded

**DISC-0012 — the G-Q4.2 differential in TASK-0038 and TASK-0039 ran against a catalogue containing no
foreign structures.** Recorded in `implementation/discoveries/`. **No verdict moves on it**: those
measurements were correct, and what the discovery establishes is **the bound on what they showed**.
Correcting the prior sections is not proposed and is not this task's to make.

---

## 10. What this record does NOT establish

- **Nothing is CLEARED**, and **no gate was relaxed to reach that**. **Six probes have cleared
  nothing.**
- **`U1 = 0` is not established for anything**; **I7's zeroes rest on a bound that is VACUOUS in 3 of
  3 cells.**
- **I5, I7 and I8 are measured for `U` only.** Their costs, counts and mechanisms remain **NEVER
  MEASURED** with the limitations in §4.3 above.
- **The routing measurement is PARTIAL** — implicit schema resolution is **NEVER MEASURED**, and §4.9
  G-Q4's unnumbered open interaction is **left exactly as open as it was.**
- **TASK-0039's G-Q4 result is not withdrawn** — DISC-0012 bounds it, and does not overturn it.
- **No planner behaviour is generalized** beyond SQLite 3.51.3 via `node:sqlite` on these fixtures.
- **No numeric threshold, benchmark, latency, capacity, recall, throughput, structure count,
  replication factor or fan-out figure is produced.**
- **Engine selection stays BLOCKED and must be separately authorized.**

---

## 11. State

- **TASK-0042 is COMPLETE**, 8 of 8 acceptance criteria satisfied with evidence (queue section).
- **No task is READY.** MSG-0137's *Next eligible task* reads **none**; **the next action is the
  Architecture Lead's.**
- **All prior verdicts stand. Nothing is selected. GAP-A, GAP-B and GAP-C stand**, and **GAP-B
  continues to block clearance independently of anything measured here.**
- **DISC-0011** (the §4.11 arithmetic tally) remains **open**; **DISC-0012** is **new and open**.
- **One process observation, not a blocker:** the supervisor started this runner at `2841f23`, a
  commit whose **committed** queue contained **zero** occurrences of `TASK-0042` — the queue write was
  uncommitted in the working tree. **This is the third recorded occurrence of the supervisor reading
  the working-tree copy** (BLK-0009's root cause; TASK-0041 checkpoint 1). **No supervisor change is
  made or proposed** — that needs its own authorization. Recorded in the TASK-0042 checkpoint.
