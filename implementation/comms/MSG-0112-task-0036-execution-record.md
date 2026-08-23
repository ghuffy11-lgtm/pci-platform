# MSG-0112 — TASK-0036 Execution Record: Q4/Q5/Q6 Encoded as Strict Shape-1 Clearance Gates

**Status:** **OPEN** — record, plus **one question referred** (Q7), which blocks nothing
**Raised:** 2026-08-23
**Raised by:** Claude Code (supervisor-started session, `runner.lock` pid 25120, acquired 13:17:18Z)
**Type:** Task execution record — **evidence-instrument update**
**Authority:** MSG-0110 §2–§6 | **Related:** MSG-0111, MSG-0109, MSG-0107b, MSG-0105, MSG-0104,
ADR-0020 §1 / §3 point 2 / *Deliberately not decided here*, EPA-0006 §4.6–§4.9

---

## 1. Result in one paragraph

**TASK-0036 is COMPLETE — 8/8 acceptance criteria MET.** The deliverable is **EPA-0006 §4.9**, which
converts MSG-0110's rulings on **Q4**, **Q5** and **Q6** into three explicit, testable clearance
gates — **G-Q4** (routing must be computed, and routing is itself measured), **G-Q5** (temporal
materialisation requires **both** a bounded re-materialisation interval **and** a demonstrated kernel
re-check), and **G-Q6** (opaque-stage confinement requires **execution** evidence; construction alone
is rejected). **The task is documentary and claims no test count: nothing was executed, and neither
the TASK-0033 nor the TASK-0035 probe was re-run.** **The change to EPA-0006 is purely additive —
272 insertions, 0 deletions** — and **`git diff --name-only docs/` is empty**, which is stronger than
the acceptance criterion's `docs/decisions/` check. (The queue and status files also carry the
ordinary status-line replacements any completed task makes; **EPA-0006 itself has no deletion.**) **Nothing is CLEARED**; all nine
MSG-0104 verdicts and all eight TASK-0035 design verdicts are reproduced below **unchanged**.
**One question is referred and not decided:** no numeric staleness threshold exists anywhere in the
accepted set, so **G-Q5's bounded-interval limb is structural, not numeric** — recorded as **Q7**
rather than closed by choosing a number.

## 2. The finding that shaped the deliverable, established before anything was written

**MSG-0111 §4 anticipated a subtlety and instructed this task to say which of two gates it actually
tests. The subtlety is real, and it was checked rather than assumed.**

A case-insensitive search for `stale` across the whole authoritative `docs/` tree returns four files.
**Only two lines bear on the bound, and both are in ADR-0020:**

```text
docs/decisions/ADR-0020-…:35    - **a stale index beyond threshold triggers abstention (A7), never a stale answer**;
docs/decisions/ADR-0020-…:228   - **The staleness threshold that triggers A7** — an operational parameter, tuned with real evidence.
```

**Line 228 sits under ADR-0020's *Deliberately not decided here* heading.** So the accepted set
**names** the threshold and **deliberately declines to fix its value**.

**Therefore G-Q5.1 is written as a structural gate and says so in its own text:** it tests that a
bound **exists**, is **enforced**, and that its breach triggers **abstention A7** — and it explicitly
**cannot** test whether the window is short enough. **No number was chosen.** MSG-0110 §3 states *"This
ruling does not invent a new numeric staleness threshold"*, and fixing one here would amend an
accepted ADR by implication — a stop condition under this task's own section. **The gap is referred as
Q7 (§7 below).**

**This is not a weak outcome and the record should not read as one.** The structural gate **fails P4S
by demonstration**: the clock moved past no bound, no abstention occurred, and the design **returned 5
of 5 unauthorized rows**. It is also **strictly stronger than the construction-only evidence G-Q6
rejects**.

## 3. What each gate requires — the shape, in brief

**Full text is EPA-0006 §4.9.** All three quote MSG-0110 rather than paraphrasing it, per acceptance
criterion 1.

### G-Q4 — routing must be computed, and routing is itself measured

**Four requirements:** the routed set is a function of the **subject's entitlements alone**
(G-Q4.1); it **does not vary with collection contents**, tested differentially (G-Q4.2); **no
catalogue enumeration**, evidenced by a plan or trace covering the **routing phase** (G-Q4.3); and
**routing-phase units count toward `U`** under §4.6 S4/S7 (G-Q4.4).

**The point most easily lost, and MSG-0110 §2 is what closes it:** routing *feels* like a step
occurring **before** retrieval, so a probe naturally starts counting after the structures are chosen.
**Choosing which structures to open is part of resolving the query**, and §4.6 S4 already counts every
unit touched while resolving it.

**A design consequence recorded because it is where the gate bites:** a partition **naming scheme**
that encodes authorization attributes — the `p_org_a_internal_published` form TASK-0035's own probe
used — turns the engine's structure catalogue into a **directory of other subjects' authorization
attributes**. The name must be **computed** and resolved by exact key, never **found** by scanning
that catalogue. **The two implementations are behaviourally identical**, which is exactly why G-Q4.3
demands plan or trace evidence rather than a description.

**The logical/physical boundary is unchanged**: the gate does **not** require one physical index or
store, and **MSG-0101 §1(1) is not reinterpreted**.

**One interaction is surfaced and not decided:** whether an **exact-key catalogue lookup** is itself an
examination depends on §4.7 **Q1**, which is unruled. **The stated fail-closed default applies** — the
strict reading — and it can only withhold clearance, never grant it.

### G-Q5 — both conditions, and one of them only structurally

**The conjunction is the gate**, per acceptance criterion 3. **Condition 1** bounds *how long* the
structure may be wrong; **condition 2** catches a hit that is wrong anyway. **Neither substitutes for
the other.**

- **Condition 1 (structural):** a bound exists with a configured value (G-Q5.1a); it is enforced
  against a clock the candidate does not control (G-Q5.1b); **breach triggers abstention A7 and an
  answer of any quality fails** (G-Q5.1c); and **every `U = 0` measurement records its materialisation
  instant** (G-Q5.1d), since §4.8 established that `U = 0` for a materialised structure is *"a property
  of an instant, not of a design."*
- **Condition 2:** the re-check runs on **every** hit (G-Q5.2a); it re-authorizes **against the
  kernel**, not against the materialised structure's own columns (G-Q5.2b); and it is **demonstrated
  to reject**, not merely to execute (G-Q5.2c).

**G-Q5.2b is the limb most easily faked and it is the one that matters.** A "re-check" reading the
stale copy's own attributes **re-checks the stale data against itself and is a no-op** — it would have
passed every row of P4S while that design returned 5 of 5 unauthorized rows. **G-Q5.2c is §4.6 S5's
asymmetry rule applied**: a re-check observed running but never observed rejecting has demonstrated
**that it runs**, not **that it works**.

**Satisfying both conditions still yields NOT CLEARED** unless §4.6 S6's E1–E4 are independently
obtained. **G-Q5 is a prerequisite, not a clearance.**

### G-Q6 — execution evidence, never construction

**The rejected proposition is recorded as rejected** so it cannot quietly return, the same discipline
§4.6 S2 applies to the materialization reading: *"the structure the opaque stage traverses contains
only authorized entries, therefore the stage examined nothing unauthorized."* **MSG-0110 §4 rejects
that as sufficient.** It *may contribute* to the package; it does not discharge **E3**.

**Why it is not enough, stated once:** the argument assumes the stage cannot reach outside its own
structure, and **that assumption is itself an engine property**. Real opaque stages routinely consult
a global term dictionary, a shared document-id map, corpus-wide statistics, or a global ANN graph —
**each a path out of the confinement the construction argument does not see**. G-Q6.3 requires those
be shown absent or themselves per-partition, and cites §6.2's class-V form of the failure: *"A global
ANN graph traversed with a filter is Shape 3 by construction, whatever the API calls it."*

## 4. Boundaries held — checkable rather than asserted

| Boundary (MSG-0110 §5, task section *Forbidden*) | Evidence |
|---|---|
| **No candidate cleared** | §6 below; §4.9's own applied-gates table records every design's **existing** verdict |
| **No existing verdict altered** | §6 reproduces both tables; **none differs from MSG-0104 §7 / MSG-0109 §6.1** |
| **No engine, runtime, provider, model, index technology or physical implementation selected** | §4.9 names candidates only as test subjects already on the record (SQLite, FTS5, the P0–P5 designs); no product is named as a choice |
| **No accepted ADR changed** | `git diff --name-only docs/` → **empty**. ADR-0019 and ADR-0020 included |
| **Strict Shape-1 not weakened; no tolerance introduced** | All three gates are **necessary conditions added in front of** §4.6 S6's bar. §4.9 states: *"Passing a gate below moves a candidate no closer to CLEARED on its own."* **No number, budget, proportion or exception was created** |
| **No implementation task marked READY** | Queue board unchanged except TASK-0036's own row; *Next eligible task* reads **none** |
| **No probe re-run** | `implementation/probes/` untouched — not in `git status --porcelain` |
| **No real or confidential corpus entered** | Nothing was executed at all |

## 5. Changes made — file by file

| File | Change | Nature |
|---|---|---|
| `implementation/architecture/EPA-0006-…md` | **§4.9 added** (G-Q4, G-Q5, G-Q6, the applied-gates table, Q7); a declared note after **§4.6 S6**'s table pointing at the three new conditions; a declared **question-numbering note** at the head of **§4.7** | **Additive — 272 insertions, 0 deletions.** No existing sentence deleted or reworded |
| `implementation/comms/MSG-0112-…md` | this record | new |
| `implementation/comms/README.md` | MSG-0112 registered | additive row |
| `implementation/operations/CLAUDE-TASKS.md` | TASK-0036 board row and section → COMPLETE; MSG-0112 ledger row | status + additive row |
| `implementation/status/current.md` | current position updated; prior line retained | additive-and-declared |
| `implementation/operations/checkpoints/TASK-0036.md` | checkpoints 1 and 2 | new |

**The §4.7 numbering note is worth flagging.** §4.7 holds **Q1–Q3**, MSG-0109 raised **Q4–Q6** (now
ruled), and this record raises **Q7**. **This repository has recorded six message-number collisions**
(MSG-0108); the note states that the next free number is **Q8** so the question sequence is not
restarted by a future session reading §4.7 in isolation.

## 6. Existing verdicts, reproduced unchanged (acceptance criterion 5)

**Reproduced verbatim. Nothing here is relabelled, softened, or re-presented as conformance. This
task's gates altered no verdict — they are new requirements, and the designs they would apply to were
measured before they existed.**

### 6.1 The nine MSG-0104 verdicts — as reproduced in MSG-0109 §7

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

### 6.2 The eight TASK-0035 isolation-design verdicts — MSG-0109 §6.1 / EPA-0006 §4.8

| Design | Patterns | M=50 | M=500 | M=5000 | **Verdict (unchanged)** |
|---|---|---|---|---|---|
| **P0** | I0 | 20 | 200 | 2000 | **NOT CLEARED** |
| **P1** | I1 | **40** | **400** | **4000** | **NOT CLEARED** |
| **P2** | I1+I2 | 20 | 200 | 2000 | **NOT CLEARED** |
| **P3** | I1+I2+I3 | 10 | 100 | 1000 | **NOT CLEARED** |
| **P4** | +I4 | **0** | **0** | **0** | **NOT CLEARED** — E4 not obtained; zero holds at the materialisation instant only |
| **P5** | P4+I6 | **0** | **0** | **0** | **NOT CLEARED** — E3 argued from construction, not instrumented |
| **P4S** | P4 after the clock moved | 5 | 50 | 500 | **NOT CLEARED** — and it **returned** unauthorized rows |
| **NC** | negative control | 50 | 500 | 5000 | **DISQUALIFIED** — the control fails, so the run is valid |

**Which verdicts did this task alter? None.** **No figure above is new** — every number is transcribed
from MSG-0109, whose harness at `implementation/probes/TASK-0035/` is untouched and was not re-run.

**Two things the gates add to the reading of that table, neither of which changes a verdict.**

1. **P4S is now a demonstrated failure of a named clearance condition**, not only an alarming
   measurement — and it fails the limb that was already accepted architecture before the probe ran.
2. **"Not measured" for G-Q4 is not a defect in TASK-0035 and is not recorded as one.** G-Q4 did not
   exist when that probe ran. **The honest entry is that routing was never instrumented**, and under
   §4.6 S9 the consequence of unobtained evidence is the verdict those designs already carry.

## 7. Question referred to the Architecture Lead — Q7, and it blocks nothing

### Q7 — Should a numeric staleness bound be fixed, and if so where?

**ADR-0020 §1 makes a bound authoritative; ADR-0020's *Deliberately not decided here* leaves its
value to operations, *"tuned with real evidence."*** **G-Q5.1 therefore tests that a bound exists and
is enforced; it cannot test whether the window is short enough.**

**The question:** is the structural gate the intended standing state, or should a numeric bound be
fixed — and if so, by whom and in which record?

**Default until ruled: the structural gate as written.** **This blocks nothing** — a probe can run
G-Q4, G-Q5 and G-Q6 today and return defensible verdicts with Q7 still open.

**One observation offered as input to the ruling and explicitly not as any part of it:** the tolerable
window is a function of how fast the organization's authorization facts actually change, which is
**corpus and organizational evidence this project does not have** — PR5 is met only at n=1 (WP-0009
§8). **No figure, range, or typical value is proposed.**

**Nothing is self-authorized and no task is proposed by this record.**

## 8. Verification, quoted

```text
git diff --name-only docs/            ->  (empty)
git diff --name-only docs/decisions/  ->  (empty)
git diff --stat                       ->  1 file changed, 272 insertions(+)
grep -c "^### 4.9" EPA-0006           ->  1        (written exactly once; no double application)
git status --porcelain                ->  (empty, after commit)
```

**Documentary — no test count, and none is claimed.** Nothing was executed. **CLAUDE.md Rule 10
applies and is satisfied by that statement, not evaded by it**: this task produced a specification,
and a specification's evidence is its text, not a test run.

**Starting `HEAD` = `f984b9c`**, recorded in checkpoint 1 and **re-checked before the commit**. **The
push was accepted**, which is the mid-run movement check: a move of `origin/main` under this session
would have produced a rejected non-fast-forward.

> **Known runner limit, recorded rather than routed around.** `git fetch` is off this runner's Bash
> allowlist and was refused. The `origin/main` comparison is therefore against the **local
> remote-tracking ref** and is reported as such — the same limit MSG-0097 §4 recorded for TASK-0031.

## 9. Acceptance against the TASK-0036 criteria — item by item

| # | Criterion | Where discharged | Result |
|---|---|---|---|
| 1 | Q4/Q5/Q6 each an **explicit, testable clearance requirement**, **quoting** MSG-0110 | §4.9 G-Q4, G-Q5, G-Q6 — each opens with the ruling block-quoted and attributed | **MET** |
| 2 | For each: **what evidence counts, what falsifies it, and what "not demonstrated" yields** | Each gate carries a requirements table, a *"What falsifies it"* paragraph, and an explicit **NOT CLEARED** consequence | **MET** |
| 3 | **Q5 requires both conditions**; clearing on one is wrong | §4.9 G-Q5: *"The conjunction is the gate"*, with the failure it would restore named | **MET** |
| 4 | **Q6 rejects construction-only claims explicitly** | §4.9 G-Q6 records the rejected proposition **as rejected**, and G-Q6.4 forbids presenting confinement as the discharge of E3 | **MET** |
| 5 | **All existing verdicts reproduced unchanged** | §6.1 (nine, MSG-0104) and §6.2 (eight, MSG-0109) | **MET** |
| 6 | **No accepted ADR modified** — `git diff --name-only docs/decisions/` empty | §8; **`docs/` as a whole is empty**, which is stronger | **MET** |
| 7 | Any unresolved question **surfaced, not decided** | §7 **Q7**; §4.9 states no number was chosen and why | **MET** |
| 8 | **COMMS, queue and status reconciled; stop and report** | §5; checkpoint 2 | **MET** |

## 10. One observation, recorded rather than acted on

**WP-0009 §6.2's A-STACK row-chain stops at TASK-0033.** TASK-0034, TASK-0035 and TASK-0036 have all
executed since, and none is recorded there. **This was noticed, not fixed.** WP-0009 lives in the
authoritative `docs/` tree, TASK-0036's documentation requirement names EPA-0006, the queue, status
and COMMS — **not the work package** — and CLAUDE.md forbids expanding a task because a related
improvement looks worthwhile. **It is recorded here so a future authorized session can close it, and
it blocks nothing:** the queue and this comms series are the authoritative record of what those tasks
did.

## 11. What this record does not do

- **It clears nothing**, and no verdict in §6 moved.
- **It selects, adopts, recommends, installs and deploys nothing.**
- **It amends no ADR**, ADR-0019 and ADR-0020 included, and proposes none.
- **It fixes no numeric threshold**, staleness or otherwise, and invents no benchmark, latency,
  capacity, recall or timing figure.
- **It marks no implementation task READY** and grants no implementation or engine-selection
  authority.
- **It re-ran no probe** and produced no new measurement.
