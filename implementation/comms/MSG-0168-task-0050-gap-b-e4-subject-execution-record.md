# MSG-0168 — TASK-0050 execution record: GAP-B measured, and no reachable subject discharges it

**From:** Claude Code (unattended runner, started by the Execution Supervisor for TASK-0050)
**To:** Architecture Lead
**Date:** 2026-08-26
**Status:** EXECUTION RECORD — evidence only. **NOT PUBLISHED: the push was rejected because
`origin/main` moved mid-run — see §13 and BLK-0013. Required outcome 7 is UNMET and TASK-0050 is
reported as executed but NOT COMPLETE.**
**Task:** TASK-0050, from the Lead's committed definition
[`TASK-0050-gap-b-e4-subject.md`](../operations/TASK-0050-gap-b-e4-subject.md)
**Authority:** MSG-0167; EPA-0006 §4.13 GAP-B / EV5, §4.15, §4.12 gap 1 (F15), §4.6 S5/S6/S7/S8/S9/S10/S11;
MSG-0141 (a test subject is an evidence instrument), MSG-0156 (a control's finding is never a finding
about the subject), MSG-0119 (failure does not authorize weakening a gate)
**Starting HEAD:** `9d71790d9480f699715c25811da3c3c4dda84a9b`
**Harness:** [`implementation/probes/TASK-0050/`](../probes/TASK-0050/) — `probe.mjs`, `probe-surfaces.mjs`,
and both outputs, committed at `f063f09`

---

## 1. The answer, stated before the evidence

**No reachable test subject supplies E4 that is both OBTAINABLE and NON-ADVERSE.**

**GAP-B is NOT discharged. It is not withdrawn, not weakened, and not narrowed.** MSG-0167 anticipated
this outcome in terms — *"a recorded finding that no reachable subject supplies a non-adverse E4 would
be a complete and valid outcome"* — and this is that finding.

**But the shape of the failure is not the one the record predicted, and that is the substance of this
message.** §4.15 left open whether obtainability and adversity are *separable* for statement surfaces.
**They are separable, and this task measured it.** The engine on the Shape-1 subject exposes the
**unexpanded** statement text and the **expanded** statement text as **two distinct accessors**, and
under §4.15's own probe the first carries **zero** occurrences of parameter-bound unauthorized text
while the second carries it **verbatim**.

**So §4.15's adverse result was a property of what that binding chose to emit, not a property of
statement observability.** That distinction is the referral in §7, and it is the reason this record
does **not** conclude the gate is unsatisfiable.

**Nothing is selected, adopted, preferred, ranked, deployed, implemented or cleared. No gate, criterion,
invariant or verdict changes. All six §4.14 candidates remain NOT CLEARED, and no candidate gains E4
evidence from this task.** Eleven probes have now cleared nothing.

---

## 2. Run validity, stated before any result

| Control | Required behaviour | Observed |
|---|---|---|
| **F15 nonexistent-pragma control** | A tracing pragma is believed only if it behaves **differently** from a pragma that certainly does not exist | Control: set threw `false`, read threw `false`, rows `[]`. **7 of 7** tracing pragmas **identical to it** |
| **Nonexistent-virtual-table control** | A surface is believed present only if it behaves **differently** from a table that certainly does not exist | Control threw `no such table: zzz_task_0050_vtab_that_certainly_does_not_exist` |
| **Authorizer wiring control** | A callback that reports nothing may be a no-op. An authorizer returning `SQLITE_DENY` **must** make a prepare **fail** | `prepare` under a denying authorizer threw **`Error: not authorized`** — **the instrument is wired to the engine** |
| **Disarmed before armed** (§4.15) | Every instrument silent before it is armed, or its result is void | Authorizer **0 events** disarmed · `dbstat` **0 marker hits** disarmed · SQL accessors **0 marker hits** disarmed · tag store **size 0** disarmed. **All silent** |

**Run validity: VALID.** Every control behaved as required.

**MSG-0156 is honoured throughout: control findings are kept in their own rows and are never reported
as findings about a subject.**

---

## 3. Required outcome 1 — the reachable subjects, enumerated

**The binding is enumerated separately from the build, because §4.15 established that the binding is
the variable that changed E4's obtainability.**

| | Engine build | Language binding | Reachable to this run? | E4 |
|---|---|---|---|---|
| **Subject 1** | **SQLite 3.51.3** (source id `2026-03-13 10:38:09 737ae4a3…`) | **`node:sqlite`**, Node **v24.15.0**, win32 x64 | **YES — measured in this session** | **NOT OBTAINABLE** (§4 below) |
| **Subject 2** | SQLite 3.50.4 | Python `sqlite3`, Python 3.14.5 | **NO — see §8** | **OBTAINABLE and ADVERSE** (§4.15; **carried, not re-measured**) |
| **Any third** | — | — | **NONE FOUND** | — |

**The "any third" row is an enumeration, not an assumption.** What was checked, and what it returned:

| Where a third subject could have come from | Result |
|---|---|
| `node_modules` in the repository | **NOT PRESENT** — the directory does not exist |
| npm global `node_modules` | present, **4 packages**, **none** matching engine/index names (`sqlite`, `duckdb`, `libsql`, `postgres`, `mysql`, `lmdb`, `level`, `rocks`, `lucene`, `tantivy`, `meili`, `typesense`, `elastic`, `opensearch`, `orama`, `flexsearch`, `minisearch`, `lunr`) |
| Runtime built-ins, enumerated from `node:module`'s own `builtinModules` | **`node:sqlite` only.** It is the sole database engine this runtime supplies without an install |
| Loadable SQLite extension | `DatabaseSync` **does** expose `loadExtension` / `enableLoadExtension`. **No extension binary is present, and obtaining one is an INSTALL** — TASK-0050's stop conditions forbid it. Recorded, not attempted |

**Subject 1 is the subject every Shape-1 measurement in §4.11, §4.12 and §4.14 was taken on**, which is
why §4.13 calls GAP-B *"the one to read first"*.

---

## 4. Required outcome 2 — E4 obtainability on subject 1, by enumeration against the control

**§4.12 gap 1 and §4.14 finding 8 each established this negative once. This run establishes it a third
time on a WIDER enumeration than either used** — and the widening found two members neither reported
(§9).

### 4.1 The API surface, enumerated rather than assumed

`node:sqlite` exports 6 names: `DatabaseSync`, `Session`, `StatementSync`, `backup`, `constants`,
`default`.

| Class | Members | Log/trace/profile-shaped |
|---|---|---|
| `DatabaseSync` | 16 — `aggregate, applyChangeset, close, createSession, createTagStore, enableDefensive, enableLoadExtension, exec, function, loadExtension, location, open, prepare, setAuthorizer` (+2 function intrinsics) | **`setAuthorizer`** |
| `StatementSync` | 11 — `all, columns, expandedSQL, get, iterate, run, setAllowBareNamedParameters, setAllowUnknownNamedParameters, setReadBigInts, setReturnArrays, sourceSQL` | none by name |
| `Session` | 5 — `changeset, close, patchset` (+2) | none |

**Twenty-one C-API entry points E4 would need were each checked BY NAME**, not inferred:

```text
sqlite3_trace_v2 ABSENT · trace ABSENT · traceV2 ABSENT · setTrace ABSENT
profile ABSENT · setProfile ABSENT · config_log ABSENT · configLog ABSENT
setLogger ABSENT · log ABSENT · stmt_scanstatus ABSENT · scanstatus ABSENT
setAuthorizer *** PRESENT *** · authorizer ABSENT
setProgressHandler ABSENT · progressHandler ABSENT · setUpdateHook ABSENT
updateHook ABSENT · commitHook ABSENT · rollbackHook ABSENT · preupdateHook ABSENT
```

### 4.2 The build — 49 compile options

**`DEBUG` ABSENT · `ENABLE_SQLLOG` ABSENT · `ENABLE_STMT_SCANSTATUS` ABSENT** — the same three §4.15
named on both subjects.

**Four further absences, checked here because each would have created a surface:**
`ENABLE_STMTVTAB` **ABSENT** · `ENABLE_BYTECODE_VTAB` **ABSENT** · `ENABLE_DBPAGE_VTAB` **ABSENT** ·
`ENABLE_NORMALIZE` **ABSENT**. `ENABLE_DBSTAT_VTAB` is **PRESENT** (§5.1).

> **One absence points the other way and is recorded because it bears on what the operator could
> supply.** **`OMIT_TRACE` is ABSENT from the compile options**, so trace support **is compiled into
> this engine**. It is the **binding** that does not expose it. That is §4.15's *"binding, not the
> build"* observed from the other side, on the other subject.

### 4.3 Tracing pragmas against the F15 control

**7 of 7 INERT** — `vdbe_trace`, `vdbe_listing`, `vdbe_addoptrace`, `vdbe_debug`, `parser_trace`,
`sql_trace`, `stmt_scanstatus`, each **indistinguishable** from a pragma that certainly does not exist.
**§4.14 finding 8 tested five; this run tested seven.**

### 4.4 Engine-emitted virtual-table surfaces — the class §4.15 did not measure

`PRAGMA module_list` returns **10** modules: `dbstat, fts3, fts3tokenize, fts4, fts4aux, fts5,
fts5vocab, geopoly, rtree, rtree_i32`.

| Candidate | Why it was tried | Result |
|---|---|---|
| **`sqlite_stmt`** | the engine's own **registry of prepared statements** — a statement surface of the same family as §4.15's trace, and the strongest candidate for a non-adverse E4 log | **NOT REACHABLE** — `no such table`, **the same shape as the nonexistent-vtab control** |
| `bytecode` | the compiled program for a statement | **NOT REACHABLE** — same |
| `tables_used` | the tables a statement reads | **NOT REACHABLE** — same |
| `sqlite_dbpage` | raw page images (a **durability** artefact, DA-1/N6 territory — listed for completeness, not as E4) | **NOT REACHABLE** — same |
| **`dbstat`** | page-level storage statistics | **REACHABLE** — 8 rows, **differs from the control** |

**`sqlite_stmt` is the one that matters.** It is the surface that would have made E4 obtainable
**without** a statement expansion, and **this build does not carry it** — `ENABLE_STMTVTAB` is absent.

---

## 5. Required outcomes 3 and 4 — every reachable surface, its adversity, and C1–C4

**§4.15's specific probe is reproduced exactly on every surface: unauthorized passage text bound as a
BOUND PARAMETER.** And because *"a surface that survives that is not thereby clean"*, the same text is
also **INLINED** and re-checked. Fixture: 200 rows — 100 authorized, 100 unauthorized carrying the
marker — as §4.15 used.

### 5.1 `dbstat`

| | | |
|---|---|---|
| Disarmed | **0** marker hits | valid |
| Armed, **parameter-bound** | **0** hits over **all 8** surface rows | **NON-ADVERSE** |
| Armed, **inlined** | **0** hits over **all 8** surface rows | **NON-ADVERSE** |

> **A correction this record keeps rather than tidies away.** The first execution of this probe scanned
> `dbstat` with `LIMIT 1`. **An adversity scan over one row of a surface is a scan of one row, not of
> the surface**, and a "0 hits" from it would have meant nothing. The harness was corrected to scan
> every row and re-run before any result was recorded. The figures above are from the corrected run.

| Condition | Result |
|---|---|
| **C1** — an engine-emitted **log** surface exists and was taken | **NO** — page-level storage statistics are not a log of operations |
| **C2** — a control separates *"absent"* from *"never armed"* | **YES** |
| **C3** — the surface can be inspected for passage text | **YES** |
| **C4** — the surface records what the engine **EXAMINED** | **NO** — 8 entries describe **pages**, not units examined |

**Does not answer E4** (C1 = NO). Non-adverse, and irrelevant to the gate.

### 5.2 `setAuthorizer` — present on subject 1, and neither §4.12 nor §4.14 reported it

| | Observed |
|---|---|
| Wiring control | denying authorizer → prepare threw **`Error: not authorized`** → **wired to the engine** |
| Disarmed | **0 events** |
| Armed, **parameter-bound** | **3 events at PREPARE, 0 at EXECUTE.** Marker occurrences: **0** |
| Armed, **inlined** | **3 events.** Marker occurrences: **0** |
| The events, in full | `[21,null,null,null,null]` · `[20,"chunk","id","main",null]` · `[20,"chunk","body","main",null]` — action codes `SQLITE_SELECT` and `SQLITE_READ`, with **table and column names only, never content** |
| Invariance with `N` | rows **200 → 1000 → 5000**: events **3 → 3 → 3**. The collection grows **25×** and the surface **does not move** |
| Second identical execution | **0 events** |

| Condition | Result |
|---|---|
| **C1** — an engine-emitted **log** surface | **NO** — a prepare-time authorization callback, not a log |
| **C2** — control separates absent from never-armed | **YES** — and stronger than a silence test: the deny control proves the instrument acts on the engine |
| **C3** — inspectable for passage text | **YES** |
| **C4** — records what the engine **EXAMINED** | **NO** — per **column reference**, invariant with `N`, and **silent on re-execution** |

**NON-ADVERSE, and does NOT answer E4.** **This is §4.15's own classification of the same instrument
on the other subject** — *"NO — prepare-time, per column reference"* — reached independently here.
**E4 is not reinterpreted to let this surface count** (MSG-0167 §4; MSG-0119).

**§4.6 S5 and S7-R3 in one line:** a surface that returns 3 for 200 rows and 3 for 5000 **cannot
measure `U`**, and no reading of it may be offered as E2.

### 5.3 `sourceSQL` and `expandedSQL` — the measurement §4.15 could not make

**This is the pair that answers the referral.**

| Path | `sourceSQL` (**unexpanded**) | `expandedSQL` (**expanded**) |
|---|---|---|
| Disarmed | `SELECT id FROM chunk WHERE scope = ?` — **0 hits** | `SELECT id FROM chunk WHERE scope = NULL` — **0 hits** |
| **Parameter-bound** unauthorized text | `SELECT id FROM chunk WHERE body = ?` — **0 hits** | `SELECT id FROM chunk WHERE body = 'ZZ-UNAUTHORIZED-PASSAGE-TEXT-ZZ body 7'` — **1 hit, VERBATIM** |
| **Inlined** unauthorized text | `… body = 'ZZ-UNAUTH-INLINE-TEXT-ZZ body 7'` — **1 hit** | `… body = 'ZZ-UNAUTH-INLINE-TEXT-ZZ body 7'` — **1 hit** |

**Two facts, and they must be read together:**

1. **On the parameter-bound path the two accessors DIFFER.** The unexpanded form is **non-adverse**;
   the expanded form reproduces §4.15's adverse finding **on the other subject and the other engine
   build**. **§4.15's failure mechanism is confirmed, and confirmed to be avoidable.**
2. **On the inlined path they are IDENTICAL and both adverse.** The unexpanded form's cleanliness is
   contingent on the **caller** binding rather than inlining — a property of the application, **not a
   guarantee the engine provides.**

| Condition | Result (both accessors) |
|---|---|
| **C1** — an engine-emitted **log** | **NO** — measured, not asserted: after running two statements, `s1.sourceSQL` returns **only s1's own text**. There is **no accumulation**, and nothing to inspect for any statement the caller did not keep a handle on |
| **C2** | **YES** |
| **C3** | **YES** |
| **C4** — records what the engine **EXAMINED** | **NO** — statement text is the **instruction**. §4.15's own numbers apply unchanged: 200 examined, 100 returned, one statement |

**Neither accessor answers E4** — C1 = NO. **They are decisive about the mechanism and silent about the
gate**, and this record does not let the first fact be rounded up into the second.

### 5.4 `createTagStore` — the only member that ACCUMULATES

Enumerated in §4.1 and classified nowhere in the record, so it is measured rather than dismissed. **Its
shape is the shape a log has.**

| | Observed |
|---|---|
| Disarmed | `size` **0**, `capacity` 1000 — silent |
| Armed | `size` **0 → 1 → 2** across two distinct statements. **It accumulates across statements** |
| **Read paths, every one this binding offers, tried rather than assumed** | `getOwnPropertyNames` → `capacity, db, size` · prototype → `get, all, iterate, run, clear` · `JSON.stringify` → metadata only · `iterate()` **THREW** · `[Symbol.iterator]` **THREW** · `entries()` **THREW** · `get()` **THREW** |

**`get`, `all`, `iterate` and `run` are tagged-template EXECUTORS, not enumerators** — each throws
`First argument must be an array of strings (template literal)` when called as a reader. **The store
accumulates statements and exposes no path to read them back.**

| Condition | Result |
|---|---|
| **C1** — engine-emitted log | **NO** — a caller-side statement cache in the binding, not an engine log |
| **C2** | **YES** |
| **C3** — **inspectable for passage text** | **NO — there is no read path at all** |
| **C4** | **NO** |

**Fail closed, in the task's own words: *"an uninspectable surface is not a clean one; 'we looked and
found nothing' is not 'nothing was written'."*** **Its 0 marker hits are reported as ZERO EVIDENCE, not
as a clean result** — nothing readable carries statement content, so there was nothing for the scan to
be a scan of.

*(Recorded for completeness: the store's API is tagged-template only, so an interpolation always becomes
a bound parameter and unauthorized text cannot be inlined through it even deliberately. That is a
property of the caller-side API and **not** evidence about what the engine retains.)*

---

## 6. Required outcomes 5 and 6 — per subject, in §4.6 S9's existing vocabulary

**No verdict term is invented, and no candidate verdict moves.** S9's vocabulary applies to
**candidates**; the subjects here are **instruments** (MSG-0141), so what is reported per subject is the
**evidence-class state** and the S9 **consequence** the record already attaches to it.

| | Subject 1 — SQLite 3.51.3 / `node:sqlite` | Subject 2 — SQLite 3.50.4 / Python `sqlite3` |
|---|---|---|
| **E4** | **NOT OBTAINABLE**, established by enumeration with a control, on a **wider** enumeration than §4.12 or §4.14 used | **OBTAINABLE** (§4.15) |
| **Inspection** | no surface to inspect | **ADVERSE** (§4.15) |
| **Can it carry the Shape-1 apparatus?** (§4.6 S6/S7 placements, counters, plan access) | **YES — demonstrably.** Every Shape-1 measurement in §4.11, §4.12 and §4.14 was taken on it, including §4.12 gap 2's index-cursor placement and the S7-R1/R2/R3 grid in §4.14 | **NO for E2.** §4.15 C4 = NO: the surface records the instruction, *"cannot measure `U`, cannot substitute for an S7 placement"*, and *"E2 evidence it is not"* |
| **S9 consequence** | an absent evidence class yields **NOT CLEARED** by rule (§4.6 S6, EV5). **Unobtainable is NOT relief** | an adverse inspection is not a pass; EV5 is not discharged |

**The two halves do not meet, and that is the finding.** **The subject that can carry the Shape-1
apparatus supplies no E4. The subject that supplies E4 does so adversely, and its surface cannot carry
E2.** §4.13 EV5 states the consequence in terms already accepted: *"an engine that cannot supply EV5
cannot be selected under any topology."*

**Subject 2 was NOT re-measured in this session, deliberately and for two independent reasons:** the
task forbids re-running TASK-0043's probe and reporting its output as new evidence, and the
authorization to invoke it does not extend to this task (§8).

---

## 7. The referral — obtainability and adversity ARE separable, and the gate is NOT shown unsatisfiable

**TASK-0050 §"The referral this task must make rather than resolve":**

> *"Whether obtainability and adversity are separable for that class of surface is NOT established. If
> the evidence suggests they are inseparable — that any surface able to satisfy E4 necessarily carries
> expanded statement text — REFER IT. Do not act on it, and do not conclude the gate is unsatisfiable."*

**The evidence suggests the opposite of inseparable, so the referral is made in the other direction —
and it is still a referral, because it bears on the clearance bar and belongs to the Lead.**

**What was measured (§5.3):** the engine exposes the **unexpanded** and the **expanded** statement text
as **two distinct accessors**. Under §4.15's exact probe the unexpanded form carries **0** occurrences
of parameter-bound unauthorized passage text and the expanded form carries it **verbatim**.

**Three consequences, stated separately because they do not all point the same way:**

1. **§4.15's adverse result is a BINDING CHOICE, not an engine necessity.** Python's
   `set_trace_callback` is built on the expanded form. A trace built on the unexpanded form would have
   been non-adverse **for parameter-bound text**. **The gate is not shown unsatisfiable, and this record
   does not conclude that it is.**
2. **But separability is CONDITIONAL on the caller.** With text **inlined**, both forms carry it
   verbatim. **A non-adverse statement surface therefore depends on the application never inlining
   passage text — which is an application invariant, not an engine property.** Whether E4 may be
   satisfied on a conditional of that kind is **not for this task to decide**.
3. **And nothing in reach exposes a LOG built on the non-adverse form.** On subject 1 the unexpanded
   text exists but only as a **per-statement accessor** with **no accumulation** (C1 = NO); the
   accumulating member (`createTagStore`) has **no read path** (C3 = NO); and `sqlite_stmt`, which
   would have been exactly such a log, is **absent from the build**.

**The question this leaves for the Lead — stated as a question, not answered:**

> **Is E4 satisfiable by a statement surface built on the UNEXPANDED statement text, given that its
> non-adversity holds only for parameter-bound content and is defeated by inlining?**

**Why it belongs to the Lead and not here.** Answering *yes* would make E4 satisfiable subject to an
application-level invariant that E4 does not currently state — **which is a change to the clearance
bar**, and MSG-0167 forbids weakening E4 to let a subject pass. Answering *no* would establish that E4
requires a surface no reachable binding provides. **Both answers move the bar; this task moves neither.**

---

## 8. The boundary — recorded as BLK-0012, not routed around

**The enumeration in §3 is bounded by what this unattended runner may execute, and that boundary is
stated rather than left implicit.**

**Subject 2 could not be re-measured, and no new subject could be reached**, because:

- **MSG-0145's `py` authorization is scoped to ONE task** — *"solely for TASK-0043's bounded E4
  observability probe"* — and **BLK-0011's resolution says so explicitly**: *"the condition this blocker
  describes therefore remains true for future UNATTENDED tasks, and needs a fresh decision if one
  requires `py`."* **No such decision exists for TASK-0050.**
- The only `py` invocation in the allowlist is **TASK-0043's own probe**, which this task is **forbidden
  to re-run as new evidence**.
- Any further subject — a different binding, a rebuilt engine with `ENABLE_STMTVTAB`, a loadable
  extension — requires an **install** or a **build with different flags**. **TASK-0050's stop conditions
  name both.**

**No workaround was attempted.** `Bash(node *)` is granted and could spawn any process; BLK-0011 records
that precise temptation and prohibits it, and the prohibition is honoured.

**BLK-0012 records what the programme would need from the operator to extend the enumeration further.**
Per the task file, *"a recorded blocker here is a useful result."*

**One further limit, recorded in checkpoint 1 and repeated here so it is not lost:** **`git fetch` is
denied to this runner**, so *"stop if `origin/main` moves mid-run"* could be enforced only against the
locally-cached ref and against the supervisor's own heartbeat (`2026-08-25T21:56:59Z`, `head 9d71790…`,
equal to this session's starting `HEAD`). **That is corroboration, not a live check.**

---

## 9. A discovery about the record's own method — DISC-0014

**`setAuthorizer` is present on subject 1 and neither §4.12 gap 1 nor §4.14 finding 8 reported it —
and §4.14 finding 8 ran on the SAME runtime this session measured** (SQLite 3.51.3, Node v24.15.0).
**So this is not a version change. The two subjects were enumerated to different standards.**

§4.12 checked four C-API names and asked for *"trace, profile or log"* members. §4.15, on subject 2,
enumerated and **exercised** the authorizer alongside the trace and the progress handler. **Subject 1's
E4-unobtainability therefore rested on the narrower enumeration** while subject 2's rested on the wider
one, and the record compared the two as though they were like for like.

**The verdict does not move, and that is worth saying plainly.** Applying §4.15's wider standard to
subject 1 yields **the same E4 answer** — the authorizer is non-adverse, prepare-time, invariant with
`N`, and **does not answer E4**, exactly as §4.15 classified it on subject 2. **This strengthens §4.12
and §4.14's conclusion; it does not overturn it.** **No sentence of either section is amended, and no
verdict changes.**

**What it is evidence about is the METHOD:** an enumeration is only as good as the name list it runs,
and two subjects compared on different name lists are not compared. Recorded as **DISC-0014**.

---

## 10. What this record does NOT establish

- **Nothing is CLEARED.** All six §4.14 candidates remain **NOT CLEARED**. **Eleven probes have cleared
  nothing.**
- **GAP-B is NOT discharged and NOT withdrawn.** It is measured, and the measurement is negative.
- **No engine, runtime, binding, provider, model or index technology is selected, adopted, preferred,
  ranked, deployed, implemented or cleared.** The subjects are **instruments** (MSG-0141).
- **No generalization to an engine class** (§4.6 S10; §4.12's standing prohibition; §4.15's *"binding,
  not the build"*). Every figure above is about **SQLite 3.51.3 via `node:sqlite` on Node v24.15.0**,
  on these fixtures, in this configuration — and about nothing else.
- **No gate, criterion, invariant or verdict is changed.** E1–E4, S1–S11, DA-1…DA-7, N1–N6,
  G-Q4…G-Q7.8 and strict Shape-1 are untouched. **E4 is not weakened, reinterpreted or narrowed.**
- **No open question is ruled.** **Q21, Q17, Q14 and the L4/W-B non-reproduction remain OPEN.**
- **Nothing is written into EPA-0006.** TASK-0050's required outcomes list COMMS, status, queue,
  checkpoint, harness/output and verification — **not a section of the evaluation record**. Promotion is
  a separate Lead decision on the mechanism MSG-0153 and TASK-0049 established, and §11 recommends it.
- **The enumeration is bounded by this runner's reach.** A subject behind an install or a fresh `py`
  grant was **not** shown absent — it was **not reachable**, which is a different finding (BLK-0012).

---

## 11. Required outcomes — checked against the Lead's task file

| | Required outcome | State |
|---|---|---|
| **1** | Enumerate the reachable subjects, binding stated separately from build | **MET** — §3, with the "no third subject" row established by enumeration |
| **2** | E4 obtainability per subject, by enumeration against the F15 control, every instrument disarmed before armed | **MET** — §2, §4; 7/7 pragmas inert, 4 controls all behaved |
| **3** | Every obtainable surface inspected for unauthorized passage text; §4.15's bound-parameter probe reproduced; inlined and other paths also tested | **MET** — §5.1–§5.4, both paths on all four surfaces |
| **4** | C1–C4 stated explicitly for each, **including C4** | **MET** — §5.1–§5.4, four C-tables |
| **5** | Whether a non-adverse subject can carry the Shape-1 apparatus | **MET** — §6. No non-adverse E4 subject exists in reach; the split between the two subjects is stated |
| **6** | Report per subject in §4.6 S9's existing vocabulary, inventing no terms | **MET** — §6 |
| **7** | Record COMMS, status, queue, checkpoint, harness/output, and verification from `main` | **NOT MET — see §13.** The records are **written and committed** (this file, DISC-0014, BLK-0012, BLK-0013, checkpoints 1–3, the queue row, the status file, and `implementation/probes/TASK-0050/` at `f063f09`), **but the push was REJECTED: `origin/main` moved mid-run and this runner cannot reconcile.** **Not rounded up** |
| **—** | Make the referral rather than resolve it | **MADE** — §7 |

---

## 12. Recommended next action — for the Lead, not taken here

1. **Rule the §7 referral.** It is the only question that decides whether GAP-B is dischargeable *at
   all*, and it bears on the clearance bar.
2. **Decide whether §4–§6 are promoted into EPA-0006** as a new section, on the MSG-0153/TASK-0049
   mechanism. **Not done here** — no authorization exists for it.
3. **Decide BLK-0012** — whether the programme wants a subject reachable to an unattended runner, and if
   so which of its options.
4. **Note DISC-0014** when the next enumeration is specified.

**No task is proposed as READY, and none may be.**

---

## 13. Addendum, written after the rest of this record — the push was REJECTED

**Everything above was written, committed, and then could not be published.** Recorded here rather than
silently amended above, because a reader is better served by seeing what changed and when.

```text
$ git push origin main
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'github-pci:ghuffy11-lgtm/pci-platform.git'
```

**`origin/main` moved after this session started.** That is TASK-0050's own stop condition — *"stop if
`origin/main` moves mid-run"* — and CLAUDE.md's fail-closed recovery boundary. **The session stopped
there.** No force-push, no rebase, no merge, no reset, no retry loop.

**§8 predicted the shape of this and understated it.** It recorded that the `git fetch` denial made the
stop condition enforceable *"only against the locally-cached ref and the heartbeat"*. **In the event the
condition was detected by the push being refused** — the weakest possible form of the check, and the
last possible moment. **A runner that cannot read the remote cannot notice movement until it tries to
write.**

**One thing this corrects rather than qualifies.** §8 left open whether the fetch denial could have been
a transport fault. **It could not:** the push **reached** `github-pci` and returned a protocol-level
rejection, so the network, SSH and credential all work. **The denial is the permission set alone** —
which is what checkpoint 1 diagnosed by reading both files, now confirmed from the other direction.
**This matters because BLK-0007 was a real transport fault, and sending the operator to fix SSH here
would be sending them to fix something that is not broken.**

**Consequence for this record's own status:** **required outcome 7 is UNMET**, TASK-0050 is reported as
**executed but NOT COMPLETE**, and the queue row is marked **BLOCKED**. **Outcomes 1–6 and the referral
are unaffected** — the measurements, the controls and §7's finding are what they are; **only their
availability is blocked.**

**Recorded as BLK-0013**, which names what an operator can do: **reconcile in an attended session
(immediate)**, and **grant the unattended runner a read-only `git fetch` (standing)** — so that a future
runner detects movement when it happens instead of after it has written a record it cannot publish.
