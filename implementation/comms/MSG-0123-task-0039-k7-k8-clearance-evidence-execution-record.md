# MSG-0123 — TASK-0039 Execution Record: K7/K8 Remaining Clearance Evidence

**Status:** **OPEN** — record + one non-blocking referral
**Raised:** 2026-08-24
**Raised by:** Claude Code (supervisor-started runner)
**Type:** Execution record
**Authority:** MSG-0120 (AUTHORIZED), with **MSG-0119 (strict Q11) binding**
**Related:** MSG-0118, MSG-0121, MSG-0122, ADR-0018, ADR-0020 (+AMD-01), EPA-0006 §4.6–§4.12
**Deliverables:** `implementation/probes/TASK-0039/` (harness + captured output); EPA-0006 **§4.12**

---

## 1. Summary

**8/8 acceptance criteria MET. Nothing is CLEARED** — **K7 NOT CLEARED, K8 NOT CLEARED**. **No
engine, runtime, provider, model or index technology was selected, adopted, installed, deployed or
recommended. No accepted ADR was modified** — `git diff --name-only docs/` is **empty**. **No gate
was relaxed. No numeric staleness threshold was introduced**, and **no benchmark, latency, capacity,
recall or throughput figure was produced.**

**A real probe ran**: **2 candidate designs × 6 configurations × 4 collection sizes × 2
distributions**, three instrument variants per cell (uninstrumented, row-access, index-cursor) —
**96 measurements** — plus a calibration, an API enumeration, an opcode capture and a negative
control, on **SQLite 3.51.3 via `node:sqlite`** (EPA-0006 class **R** test subject, the only engine
reachable — `docker` **re-checked and still not on this runner's PATH**). `:memory:` only; nothing
installed; no network; no corpus; no wall-clock read.

**Both mandatory validity gates passed.** The adversarial precondition held at **all four sizes under
both distributions**, and the **negative control failed in 4 of 4 cases**, so the run is valid under
§4.6 S8.

**All three gaps MSG-0120 named are closed — two of them against the candidates.**

1. **E4 is established UNOBTAINABLE**, by enumeration, with the reason. Not inferred.
2. **`U1` turned out to be partially instrumentable after all**, and what it measures is **failure**:
   K8's celebrated `U = 0` is a **row-access zero**, and its index traversal visits unauthorized
   entries in a number that **rises linearly with the collection**.
3. **Plan-independence splits.** E1's *reachable-structure* limb **is** obtainable independently of
   the optimizer, by an instrument no prior probe used. E1's *confinement* limb **is not** — and a
   plain `ANALYZE` is enough to change it.

---

## 2. Two defects in this probe's own apparatus, found and corrected before any result was reported

**Recorded first, because both would have put a false number into the record**, and because
TASK-0037 and TASK-0038 both established that a probe's own failures are worth more to a later
reader than a tidy account.

**Defect 1 — the index-entry column was mislabelled, and the label overstated it.** The index-cursor
instrument receives `open_ended`, which **cannot identify the entry**, so it counts **entries
visited**, not **unauthorized entries visited**. The first draft printed that raw count under the
heading `U1lb`. On the uniform fixture the two happened to differ by a constant, so the column *looked*
right — and on a fixture where an authorized version is visited by more than one limb it would have
**overstated the unauthorized count**, which is the dangerous direction for a bound that exists to
prove failure.

**Corrected by splitting the column in two and making the arithmetic visible:** `Nidx` is
**engine-measured** entries visited; `U1lb` is **derived** as `max(0, Nidx − Amax)`, where `Amax` is
the **most generous possible** allowance for authorized entry-visits — authorized-resident entries ×
limbs × chunks-per-version. **The bound is deliberately weak**, and at the smallest collection it
reaches zero. **A zero there means "this bound proves nothing at this size" — it is not a measurement
of `U1 = 0`**, and the output says so on the same line.

**Defect 2 — the probe asserted something its own output contradicted, in the same line.** The first
draft asserted the authorizer is a compile-time hook and printed the execution-phase callback count
*"confirming"* it. **It printed `101`.** A minimal case showed zero execution-phase callbacks; the
probe's own query shape showed a count **equal to the prepare-phase count**, i.e. the statement is
compiled a **second** time on first step.

**Corrected by replacing the assertion with a measurement that can distinguish the possibilities:** a
compilation event is **invariant with collection size**; a per-entry counter is not. Measured at
M=500 and M=5000: **101 and 101** for K7 and K8, **20 and 20** for the control. **Invariant — so it
is a compilation event, and it cannot measure `U` or `U1`.** The corrected claim is checkable; the
original was not.

**And one trap the probe was built to avoid, which is worth recording because it nearly is not a
defect at all.** SQLite **silently ignores an unrecognised pragma**. `PRAGMA vdbe_trace = on` returns
without error whether or not tracing exists. The probe therefore runs **a pragma that certainly does
not exist as a control**, and every tracing pragma behaved identically to it. **Without that control
this probe could have reported E4 obtained from an instrument that was never running.**

---

## 3. Gap 1 — E4. NOT OBTAINABLE, established by enumeration

**MSG-0120: *"Do not infer engine-log evidence that is unavailable."*** It was not inferred. It was
enumerated, in this session:

| Check | Result |
|---|---|
| `DatabaseSync` / `StatementSync` prototypes | **no trace, profile or log member of any kind** |
| `sqlite3_trace_v2`, `sqlite3_profile`, `SQLITE_CONFIG_LOG`, `sqlite3_stmt_scanstatus` | **none bound by `node:sqlite`** |
| `PRAGMA compile_options` (49 options read) | **`SQLITE_DEBUG` ABSENT · `ENABLE_SQLLOG` ABSENT · `ENABLE_STMT_SCANSTATUS` ABSENT** |
| tracing pragmas vs a nonexistent-pragma control | **identical behaviour — all inert** |
| `db.location()` | **`null`** — no file, therefore no journal, WAL or engine-written artefact |

**>> E4 VERDICT: NOT OBTAINABLE on this test subject.** Under §4.6 S6 an absent evidence class yields
**NOT CLEARED**, so **no candidate could have been cleared in this run whatever any count showed** —
stated **before** the results table in the probe output so no row is read as a near-miss.

**One surface scan was run and is explicitly NOT offered as E4.** Plan text and opcode operands were
scanned for unauthorized passage bodies: **0 occurrences**, because parameters are bound rather than
inlined. **That is a clean scan of outputs this probe requested, not of a log the engine keeps.**

---

## 4. Gap 2 — `U1`. The prior zero was a ROW-ACCESS zero, and this run measures the difference

**MSG-0120: *"Do not claim `U1 = 0` when the test subject cannot observe index-entry reads."*** It is
not claimed anywhere. What follows is the opposite of a zero.

### 4.1 The engine's own bytecode shows where a row-access counter sits

`EXPLAIN` on the pinned bounded limb prints, in order:

```text
SeekGT 1        seek the INDEX cursor to the start of the range
IdxGT  1        range-end test, ON THE INDEX
DeferredSeek 1  the TABLE seek is DEFERRED — no row fetched yet
Column 1 2      read eff_from FROM THE INDEX CURSOR
Gt     -> Next  FAILS THE RESIDUAL AND JUMPS TO Next — the row is never touched
Column 0 0      only reached by entries that PASSED; this is where probe_ver fires
```

**A counter on a non-indexed column cannot fire for an entry the residual rejects.** §4.6 S5
predicted this in words; here it is the engine's bytecode.

### 4.2 The instrument, and its calibration

A function applied to `open_ended` — **the leading column of both candidate indexes** — is evaluated
**from the index cursor** and fires **once per entry visited in the seek range**.

**Calibrated against a cohort known by construction, on both candidate plans, before use:**
expired=300, not-yet-bounded=400, authorized=2. Lower-bound plan → **302 expected, 302 measured**.
Upper-bound plan → **402 expected, 402 measured**. **Exact on both.** And in the pinned case the
**row-access counter reported 2** while 402 entries were visited — **TASK-0038's K8 result, on a
fixture small enough to check by hand.**

**Its limits are stated rather than left to be discovered.** It is a **LOWER BOUND**: it does not see
interior b-tree pages descended during the seek, pager reads, or other loops. **A positive value is
conclusive of failure (§4.6 S5); no value of it may be read as `U1 = 0`.** It **perturbs the query**,
so the transfer licence was **checked in every cell** — plan captured with and without the
instrument, seek bound required identical. **0 of 96 measurements failed that check.**

### 4.3 The result

**K7 and K8 visit the same number of entries. `U` sees one and not the other.**

| M | K7 `Nidx` | K8 `Nidx` | K7 `U` | K8 `U` |
|---|---|---|---|---|
| 50 | 10 | 10 | **7** | **0** |
| 500 | 74 | 74 | **71** | **0** |
| 5000 | 717 | 717 | **714** | **0** |
| 20000 | 2860 | 2860 | **2857** | **0** |

**MSG-0118 §5 result 5 called K7-vs-K8 the sharpest finding in that table. It was correctly measured
and it meant something narrower than it looked.** K8 **did not examine less**. It examined the same
amount, where the instrument could not see it: its seek is on the **upper** effectivity bound, so the
unauthorized entries are rejected **from the index** rather than after a row read. **MSG-0118's own
result 4 said this could not be measured. It now is.**

---

## 5. Gap 3 — plan-independence. E1 splits into a limb that has it and a limb that does not

### 5.1 OBTAINED: reachable structures, independently of the optimizer

`sqlite3_set_authorizer` — bound in this Node build as `DatabaseSync.setAuthorizer`, **a surface no
prior probe used** — enumerates every `(table, column)` a statement **may** read, **at compilation**,
before and regardless of any plan choice.

For **K7 and K8** it reports **eight structures, all routed partitions, and no scope-spanning
structure**, identically under every configuration. It reports a **superset** of what any plan opens
— the fail-closed direction, so **what it excludes, no plan can reach**. For the **negative control**
it reports `k_chunk` and `k_version`, **failing E1 plan-independently**, which is what makes it a
discriminating instrument rather than one that agrees with everything.

**This is the one piece of E1 evidence in the record that survives gap 3 intact.**

### 5.2 NOT OBTAINED: confinement

Across six configurations — baseline, `automatic_index=off`, fresh connections with re-prepares,
shifted query instant, after `ANALYZE`, after `ANALYZE` + `PRAGMA optimize` — at four sizes and two
distributions:

| Design | distinct version traversals | `U` range | derived `U1lb` range |
|---|---|---|---|
| **K7** | **2** | 0 … 4445 | 0 … 4437 |
| **K8** | **2** | 0 | 0 … 4436 |

**`ANALYZE` alone drives K7's `U` from 2857 to 0.** It is ordinary maintenance — it writes statistics
and touches no schema, data, index, query text or design. After it, K7's planner switches the
populated partition's bounded limb to the upper-bound index, **becoming K8 in the only respect that
matters**. `U`: **2857 → 0**. `Nidx`: **2860 → 2861** — **one entry more, not fewer.**

> **The same candidate, measured before and after a routine `ANALYZE`, receives opposite `U`
> readings.** §4.11 result 5 said the planner decides; this says **a maintenance command decides**.

**`INDEXED BY` pinned the bounded limb and did not pin the rest** — K8's *open* limb still became a
full partition scan after `ANALYZE`. **Pinning one limb pins one limb.** And `INDEXED BY` is an
engine-specific construct; **nothing here proposes it as architecture.**

**Signature instability across fresh re-prepares: 0 of 96.** Within a fixed configuration the
planner is deterministic. **The variability is between configurations, not within one** — which is
worse for evidence, not better, because it will not show up in a repeated test.

---

## 6. G-Q4, re-measured across every configuration

**MET in all 12 design × configuration pairs.** The differential test of G-Q4.2 — same subject and
query against collections differing **only** in other subjects' structures — gives **identical routed
set (4) and identical routing read count (4)** at `otherSubjects = 0` and `= 64`, in every
configuration. **G-Q4.3** is now evidenced **plan-independently**: the authorizer would report
`sqlite_schema` as reachable if the statement could read it, and it does not. **G-Q4.4** holds by
construction — routing units are unioned into `U` in every cell.

---

## 7. Verdicts

| Candidate | E1 | E2 | E3 | E4 | G-Q4 | **Verdict** |
|---|---|---|---|---|---|---|
| **K7** | reachable-structure limb **HOLDS plan-independently**; **confinement limb NOT plan-independent** (2 traversals) | **NOT OBTAINED** — `U1lb` to **4437**, rising with `N`; and `U` itself varies with configuration | **N/A for this fixture, NOT transferable** | **NOT OBTAINABLE** | **MET** (12/12) | **NOT CLEARED** |
| **K8** | as K7 (2 traversals) | **NOT OBTAINED** — `U1lb` to **4436**, rising with `N`; `U = 0` is a row-access zero | **N/A for this fixture, NOT transferable** | **NOT OBTAINABLE** | **MET** (12/12) | **NOT CLEARED** |

**Neither candidate withheld authorized content and neither returned unauthorized content** in any of
the 48 cells each — the steady-state answer anchor held at every size and configuration. **That is a
correctness result and it clears nothing**, which is precisely EPA-0006 §4.11 result 3's point in
reverse: answering correctly is necessary and nowhere near sufficient.

**K3 and K4 remain NOT CLEARED** under MSG-0119's strict Q11 reading. They were **not re-run** and no
evidence here bears on them.

---

## 8. Acceptance criteria

| # | Criterion (task section / MSG-0120 §Acceptance) | Result |
|---|---|---|
| 1 | **Per-candidate evidence and verdicts**, each with the evidence that decided it | **MET** — §7; per-evidence-class detail in the probe output section 10 |
| 2 | **Unobtainable evidence yields NOT CLEARED, never an inferred pass** | **MET** — E4 unobtainable ⇒ NOT CLEARED, stated **before** the results table |
| 3 | **E4 obtained, or explicitly established unobtainable, with the reason** | **MET** — §3; enumerated across five independent checks, with a control |
| 4 | **`U1` measured, or its unobservability recorded — never reported as zero** | **MET** — §4; **partially measured**, calibrated exactly, reported as a **lower bound**; `U1 = 0` claimed nowhere |
| 5 | **Plan-independence demonstrated where required, or its absence recorded** | **MET** — §5; **obtained** for the reachable-structure limb, **absence recorded** for confinement |
| 6 | **Strict Q11 preserved; K3/K4 remain NOT CLEARED** | **MET** — neither re-run, neither re-verdicted; the strict reading is restated in §4.12 |
| 7 | **All existing verdicts reproduced unchanged; `git diff --name-only docs/` empty** | **MET** — verified after every edit; no prior probe modified or re-run |
| 8 | **COMMS, queue and status reconciled; stop at evidence and clearance status** | **MET** — this message, EPA-0006 §4.12, the queue, both registers, the status file and the checkpoint; **the run stops here** |

---

## 9. Boundaries honoured

- **Nothing selected, adopted, recommended, installed or deployed.** The engine is a **test subject**.
- **`U = 0`, E1–E4, G-Q4, strict Shape-1, Q8, Q10 and Q11 not relaxed.** No gate weakened, no
  tolerance invented. **`INDEXED BY` is not proposed as architecture.**
- **No accepted ADR modified** — `docs/` untouched.
- **No implementation task authorized or marked READY.**
- **No numeric staleness threshold**; no benchmark, latency, capacity, recall or throughput figure.
- **No real or confidential corpus entered**; fixtures synthetic and generated in-process.
- Nothing installed; **Docker Desktop not started**; no network; `:memory:` only; no wall-clock read.
- **EPA-0006 §4.12 is additive** — **178 insertions, 0 deletions**, `### 4.12` written exactly once.
- **`node:sqlite` planner behaviour is not generalized to any other engine.**

---

## 10. One question referred — Q12. It blocks nothing.

**Q12 — must a probe take the index-cursor placement wherever the engine exposes one, and is a `U`
taken only at row access sufficient for E2?**

§4.6 S7 requires a probe to record placements and report the maximum across them. **It does not say
which placements must be attempted.** This run found a reachable placement four prior probes did not
take, and taking it turned a reported `U = 0` into a rising `U1` lower bound **on the same design**.

**Referred rather than applied**, because strengthening S7 is a change to the **criterion**, and
encoding rulings into §4.6 is what TASK-0034 and TASK-0036 were separately authorized to do.
**MSG-0120 stops this task at evidence and clearance status.**

**Why it blocks nothing:** §4.6 S5's asymmetry already means a probe omitting the placement **cannot
clear anything it should not have** — it can only fail to detect a failure. Q12 asks whether that
should depend on a probe noticing. **It changes no verdict recorded anywhere.**

---

## 11. State after this task

- **TASK-0039 is COMPLETE** — 8/8 acceptance criteria MET.
- **Nothing is CLEARED.** K7 and K8 are **NOT CLEARED**. Classes **S**, **V** and **K** remain
  unreachable and NOT CLEARED with zero execution evidence; **D** and **H** remain DISQUALIFIED.
- **No task is READY**, and none was marked so. **MSG-0120 requires stopping at evidence and
  clearance status.**
- **No blocker is open.**
- **The next action is the Architecture Lead's, and MSG-0119 already states what it is:** *"failure
  does not authorize weakening the existing gates"*, and the question **returns to EPA-0006 §4.7
  Q3** — *if no engine class can reach zero, what is the architectural response?*

**Five probes have now cleared nothing, and this one narrows what remains to be decided.** The
strongest candidates were not defeated by examining too much. **They were defeated by the engine not
being answerable**: E4 cannot be asked for at all, and the one API that would settle `U1` outright —
`sqlite3_stmt_scanstatus` — is absent from the build **and** unbound by the runtime. **EPA-0006 §4.6
S10 already holds that an engine which cannot be observed fails the burden AMD-01 places on it**;
this run is that rule biting, and it is offered as the sharpest input to the Q3 decision.

**Offered as evidence, not as a recommendation, and naming no engine as a choice:** the two
properties that failed here are **observability properties of the engine**, not shape properties of
the design — which bears directly on what an engine-selection criterion must require before any
candidate is measured at all.
