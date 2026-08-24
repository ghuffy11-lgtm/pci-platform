# MSG-0146 — TASK-0043 Execution Record: E4 Is OBTAINABLE, and the Inspection Is Adverse

**Status:** **OPEN** — record, with **two referrals** (§8), **neither blocking**
**Raised:** 2026-08-24
**Raised by:** Claude Code (interactive session, under MSG-0145's operator authorization)
**Type:** Evidence / instrument-capability execution record
**Authority:** **MSG-0141** (AUTHORIZED), **MSG-0145** (operator grant to invoke `py`), TASK-0043 queue section
**Harness and captured output:** `implementation/probes/TASK-0043/probe.py`, `probe-output.txt`

---

## 0. The result, first

**E4 is OBTAINABLE on the second test subject — and what the inspection SHOWS is adverse.**

**Unauthorized passage text bound as a query PARAMETER appears verbatim in the engine's own trace
surface.** Not inlined text; a bound parameter. The trace emits the **expanded** statement, so the
parameter is written into it.

**This clears nothing.** MSG-0141: a successful E4 observation *"does not clear any candidate or permit
engine selection."* **All six TASK-0042 candidates remain NOT CLEARED. Seven probes have now cleared
nothing.** **GAP-B is a statement about the FIRST subject and is not withdrawn.**

## 1. Subject and runtime (criterion 1)

| | |
|---|---|
| Interpreter | **Python 3.14.5**, `C:\Python314\python.exe`, reached via the `py` launcher |
| Engine | **SQLite 3.50.4** (`sqlite3.sqlite_version`) |
| Platform | `win32` |
| **First subject, for contrast — NOT re-run** | SQLite **3.51.3** via `node:sqlite`, Node v24.15.0 — **E4 NOT OBTAINABLE** (§4.14 finding 8) |

**Both are recorded so a later reader can tell whether a different answer means a changed engine or a
changed probe.** **The subject is an INSTRUMENT, not a candidate**, and nothing here evaluates it for
product suitability.

## 2. The surface, enumerated rather than assumed (criterion 2)

**Present:** `set_trace_callback`, `set_progress_handler`, `set_authorizer` — 3 of 42 public
`Connection` names. **`Cursor` exposes none.**

**Absent, each checked explicitly:** `stmt_scanstatus`, `set_profile`, `config_log`, `trace_v2`.

**Build:** 43 compile options reported. **`DEBUG` ABSENT · `ENABLE_SQLLOG` ABSENT ·
`ENABLE_STMT_SCANSTATUS` ABSENT** — **the same three absences as the first subject**, so the difference
between the two subjects is **the binding, not the build**.

**Five tracing pragmas against the §4.12 nonexistent-pragma control:** `vdbe_trace`, `vdbe_listing`,
`vdbe_addoptrace`, `parser_trace`, `sql_trace` — **all five returned `(False, None, [])`, identical to
the control. 5 of 5 INERT.** Without that control, *"no error"* would have been evidence of nothing.

## 3. Instrument 1 — `set_trace_callback`: the one that works, and what it costs

**Control (criterion 3): disarmed → 0 entries; armed → 1 entry.** *"Absent log"* and *"never armed"* are
therefore distinguishable, and the armed reading is believable.

**F2 — the adverse finding, verbatim from the captured output:**

```text
F2 trace entries from the parameterised query: 1
    [0] "SELECT id FROM chunk WHERE body = 'ZZ-UNAUTHORIZED-PASSAGE-TEXT-ZZ body 7'"
F2 entries containing the UNAUTHORIZED marker: 1
```

**The query was `SELECT id FROM chunk WHERE body = ?` with the marker passed as a bound parameter.**
The trace still carries the text. **§9.3 and ADR-0020 §6.2's concern is demonstrated, not argued.**

> **This is the reverse of what TASK-0042 §6 observed.** That run's surface scan found **0 occurrences**
> across five engine-produced surfaces *"parameters being bound rather than inlined"*, and **explicitly
> declined to offer it as E4**. Declining was right: **the protection it seemed to observe does not hold
> at the surface E4 actually asks about.** Binding a parameter keeps text out of *some* surfaces and
> **not out of this one.**

**F3 — granularity, and the limit of the whole result:** the query examines **200 rows**, returns
**100**, and the trace emits **1 entry**. **It records the instruction, never the examination.**

## 4. Instruments 2 and 3 — real surfaces that cannot answer E4

| Instrument | Disarmed | Armed | What it carries | E4? |
|---|---|---|---|---|
| `set_progress_handler` (every 1 VM instruction) | **0** | **807 invocations** | **nothing — the callback takes no arguments** | **NO — a counter, not a log** |
| `set_authorizer` | **0** | **3 events**, and **0 on an identical second execution** | action codes and **object names** (`chunk.id`, `chunk.scope`) — **never content** | **NO — prepare-time, per column reference** |

**The authorizer's 0-on-re-execution is the same compile-time signature TASK-0039 characterised on the
first subject** — recorded because it confirms the instrument's nature rather than being assumed from it.

## 5. Engine-written file artefacts — recorded, and NOT offered as E4

**§4.12 could not check this limb at all**, because `:memory:` leaves no file. With a real file and
`journal_mode = wal`:

| Artefact | Size | Unauthorized marker |
|---|---|---|
| main db | 4096 B | **absent** |
| **`-wal`** | 28872 B | **PRESENT — 135 times** |
| `-shm` | 32768 B | absent |
| `-journal` | ABSENT | — |

**These are DURABILITY artefacts, not logs, and they are not offered as E4 evidence** — E4 asks about
the engine's own **logs** (§4.6 S6, §9.3). **Recorded because it closes a limb the earlier probe could
not reach, and referred in §8 rather than acted on.**

## 6. Verdict (criteria 4, 5)

**Four conditions, kept separate because two readings can disagree:**

| | Condition | Result |
|---|---|---|
| **C1** | an engine-emitted log surface exists **and was taken** | **YES** |
| **C2** | a control separates *"absent log"* from *"never armed"* | **YES** |
| **C3** | the surface can be inspected **for passage text** | **YES** |
| **C4** | the surface records **what the engine EXAMINED** | **NO — per-statement granularity** |

**VERDICT: E4 is OBTAINABLE on this subject under §4.6 S6's definition** — MSG-0141's first permitted
outcome — **and it is obtainable in the adverse direction.**

**RUN VALIDITY: VALID.** Every negative control behaved as required: **disarmed instruments silent,
armed instruments not**, and the pragma control matched all five tracing pragmas. **Probe exit code 0,
`FAILURES` empty.**

## 7. Acceptance criteria (TASK-0043 section)

| # | Criterion | Evidence |
|---|---|---|
| 1 | Subject and runtime named **with versions** | §1 — Python 3.14.5, SQLite 3.50.4, plus the first subject for contrast |
| 2 | Observability surface described exactly, **including what it does not emit** | §2, §3 F3, §4 — granularity stated for each of the three |
| 3 | Negative control distinguishing absent log from inactive instrument, **quoted** | §3 (0 → 1), §4 (0 → 807, 0 → 3), §2 (5 of 5 pragmas vs control) |
| 4 | One of MSG-0141's two verdicts | §6 — **E4 OBTAINABLE**, with C4 recorded separately |
| 5 | **No candidate cleared, no engine selected** | §0 and the probe's own output: *"WHAT THIS CLEARS: NOTHING"* |
| 6 | **Nothing installed**, no host configuration modified; `git diff --name-only docs/` **empty** | Python and SQLite were already present (MSG-0142 §3); the probe writes one temp DB **outside the repository** and deletes it — *"temporary directory removed: True"* |
| 7 | **All verdicts unchanged; no prior probe re-run** | No prior harness executed; the first subject's result is **quoted, not re-derived** |
| 8 | COMMS, queue and status reconciled | This record, the queue row, the status file, and **BLK-0011 RESOLVED** |

## 8. Two referrals — neither blocks anything

**R1 — does this belong in EPA-0006 as §4.15?** Every prior evidence task added a section; **this one
was not instructed to**, and MSG-0141 asks only that the execution be recorded through COMMS. **The
Lead's call**, and the record is complete either way.

**R2 — the WAL result.** Unauthorized passage text sits **135 times** in a durability artefact on disk.
**That is not E4 and this record does not treat it as one.** Whether text at rest in engine-managed
files deserves architectural treatment alongside §9.3's log concern is **a question for the Lead**, not
something this task may answer. **It changes no gate and no verdict.**

## 9. Boundaries — each MSG-0141 prohibition, checked

- **No engine, runtime, provider, model or index technology selected**; the subject is an instrument.
- **No implementation or deployment.**
- **Nothing installed and no host configuration modified.** `py` was **invoked**, under MSG-0145.
- **No accepted ADR modified**; `git diff --name-only docs/` **empty**.
- **No gate weakened, no numeric threshold introduced, no verdict relabelled.**
- **E4 was NOT inferred** from surface scans, query results, planner output or absence of errors — **it
  was armed, controlled and read.**
- **No broadening** into performance, cost, capability or engine comparison. The two subjects are
  contrasted **on E4 alone**, which is the task.

## 10. State

- **TASK-0043 is COMPLETE.** **BLK-0011 is RESOLVED** — by the operator grant in MSG-0145, not by a
  workaround.
- **E4 is OBTAINABLE on this subject; on the first subject it remains NOT OBTAINABLE. GAP-B stands.**
- **Nothing is CLEARED. Seven probes have cleared nothing.** **All six TASK-0042 candidates remain NOT
  CLEARED.**
- **No task is READY.** MSG-0141 returns control to the Architecture Lead.
