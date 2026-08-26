# MSG-0181 — TASK-0054 execution record: seven surfaces, no log, and the two halves that never meet

**From:** Claude Code (Execution Supervisor runner, `runner.lock` pid **21540**)
**To:** Architecture Lead
**Date:** 2026-08-26
**Status:** OPEN — record, **one referral**, one new blocker. **No decision is required to proceed,
because there is nothing queued to proceed to.**
**Starting HEAD:** `b2030b820fd8bb21916420080350527af4830e90`
**Authority:** **MSG-0180** (authorization); the Lead's task file
[`TASK-0054-enumerate-log-surfaces-beyond-sqlite.md`](../operations/TASK-0054-enumerate-log-surfaces-beyond-sqlite.md),
**which is the specification and wins on any difference with the queue row**. Binding as written:
EPA-0006 **§4.6 S6/S10/S11**, **§4.13 GAP-B**, **§4.15 C1–C4**, **§4.20 `AB-1`**; **MSG-0168 §5**
(table form); **MSG-0173b §1** (blocker contents); **MSG-0141**; **MSG-0119**.

---

## 1. The answer, stated before the evidence

**NO. No engine or binding obtainable without a source build, within this runner's reach, supplies a
surface that is both (a) accumulating across statements and readable back, and (b) available in a form
whose statement text does not carry inlined content.**

**C1 = NO on all seven surfaces measured.** **MSG-0180 §4 anticipated this outcome in terms and it is
a complete and valid result, reported as a finding and not as a failure.**

**And the survey found something the prediction did not contain**, which is the reason a survey is
worth more than a forecast:

> **The two halves of the question are BOTH satisfied in reach — on different surfaces, and never
> together.** One surface accumulates across statements and can be read back. A different surface has
> clean, unexpanded statement text. **No reachable engine puts them in the same place**, and the two
> failures have **different causes**, so neither is evidence about the other.

---

## 2. Run validity, stated before any result

**RUN VALID — 26 controls fired, none failed.** Controls **enforce**: `fail()` aborts the run, per
MSG-0169 §2's correction that a control which only reports is not a control. **This is not decoration
— the run aborted twice on its own controls before producing the output below** (§9).

| Control class | Instances | What it makes distinguishable |
|---|---|---|
| Scanner discrimination | 1 | a "0 hits" from a scanner that cannot find anything is not a result |
| Enumeration discrimination | 5 | a fabricated builtin, member, pragma, table and executable name must each NOT be found |
| Disarmed-before-armed | 4 | *"absent"* and *"never armed"* stay separable — §4.15's standing method |
| Wiring | 2 | the deny-authorizer threw `not authorized`; the session moved 0 → 74 → 137 bytes |
| Fixture non-emptiness | 2 | 100 unauthorized rows verified present, so a 0 elsewhere is a **real** 0 |
| Finding-specific | 12 | each headline claim below has its own enforcing control |

Harness: [`implementation/probes/TASK-0054/probe.mjs`](../probes/TASK-0054/probe.mjs).
Captured output: [`probe-output.txt`](../probes/TASK-0054/probe-output.txt).

**Subject:** SQLite **3.51.3** via `node:sqlite`, Node **v24.15.0**, win32 x64 — **the same subject
every Shape-1 measurement in §4.11, §4.12 and §4.14 was taken on**, which is why §4.13 calls GAP-B
*"the one to read first"*. **A test subject is an instrument, not a candidate** (MSG-0141).

---

## 3. Required outcome 1 — what is reachable, and how the list was established

**An absence is admissible only by enumeration, so what was checked and what returned nothing are
both recorded.** **DISC-0014 is why the enumeration was deliberately widened** past a fixed list.

| Where an engine could have come from | Method | Result |
|---|---|---|
| Runtime built-ins | `node:module`'s own `builtinModules`, **72 modules**, live — with a control that a fabricated match is excluded | **`node:sqlite` ONLY.** The sole database engine this runtime supplies without an install |
| Repository packages | `D:\Work\pci-platform\node_modules` | **NOT PRESENT — the directory does not exist** |
| npm global packages | `C:\Program Files\nodejs\node_modules` | **2 entries — `corepack`, `npm`.** Engine-shaped: **NONE** |
| npm cache | `%LOCALAPPDATA%\npm-cache\_cacache` | **PRESENT.** **A package in a cache is not an installed package, and installing from cache is still an install.** Recorded, **not attempted** |
| Database CLIs, by name | 23 names against every PATH entry | `sqlite3`, `psql`, `postgres`, `mysql`, `mariadb`, `mongod`, `redis-server`, `duckdb`, `sqlcmd`, `docker`, `java`, `dotnet`, `deno`, `ruby`, `php` — **ALL ABSENT** |
| Database CLIs, by vocabulary | **all 29 PATH directories** scanned against the engine word list, **with a fabricated-name negative control** | **5 matches, ALL false positives on the word "search"/"db"**: `gpg.exe`, `watchgnupg.exe`, `SearchFilterHost.exe`, `SearchIndexer.exe`, `SearchProtocolHost.exe`. **No engine** |
| Windows ESE / JET Blue | `esentutl.EXE`, `esent.dll` | **PRESENT — and rejected on its own semantics, not on reach: ESE has no SQL statements, so it cannot supply a statement log** |
| ODBC driver manager | `odbc32.dll`, `odbctrac.dll`, `odbcad32.EXE` | **PRESENT — and rejected on TWO independent grounds** (§7) |
| **A second JS runtime** | runtime install directories read directly | **`bun` IS INSTALLED** — `C:\Users\Administrator\.bun\bin\bun.exe`, 98 480 216 bytes. **`deno` ABSENT.** **See §6 and BLK-0014** |

**Build, re-verified in this session rather than carried from MSG-0180:**

```text
SQLite 3.51.3, 49 compile options
  ENABLE_STMTVTAB        ABSENT      <- confirms the Lead's own measurement
  ENABLE_SQLLOG          ABSENT
  DEBUG                  ABSENT
  ENABLE_STMT_SCANSTATUS ABSENT
  ENABLE_NORMALIZE       ABSENT
  ENABLE_DBSTAT_VTAB     PRESENT
  ENABLE_SESSION         PRESENT     <- and this one matters; see §5
  ENABLE_PREUPDATE_HOOK  PRESENT
```

**Statement-log virtual tables, against a fabricated-table control that threw `no such table`:**
`sqlite_stmt` **ABSENT** · `sqlite_dbpage` **ABSENT** · `bytecode` **ABSENT** · `tables_used`
**ABSENT** · `dbstat` **PRESENT** · `sqlite_schema` **PRESENT**.

**Trace/profile/log entry points: 24 names checked, PRESENT = none**, against a control confirming a
real member is found and a fabricated one is not. **Tracing pragmas: 7 of 7 INERT** — identical to the
nonexistent-pragma control, which itself was verified to return an *empty* result so that "empty" is
not mistaken for a live pragma.

---

## 4. Required outcomes 2 and 3 — C1–C4 on every surface, in MSG-0168 §5's table form

| Surface | **C1** — engine-emitted **LOG** exists and was taken | **C2** — control separates *absent* from *never armed* | **C3** — inspectable for passage text | **C4** — records what the engine **EXAMINED** |
|---|---|---|---|---|
| **`createSession` / `Session.changeset()`** | **NO** — a **row-change set**, not a log of statements. **Records WRITES only: a SELECT examining 103 unauthorized rows moved it 0 bytes** | **YES** — 0 bytes disarmed | **YES** — an inspectable `Uint8Array`, **and it carries row CONTENT verbatim** | **NO** — records what **CHANGED**, not what was examined |
| **`createTagStore`** | **NO** — a caller-side statement cache in the binding | **YES** — `size` 0 disarmed | **NO — there is no read path at all** | **NO** |
| **`sourceSQL`** (unexpanded) | **NO** — **no accumulation**; each handle reports only its own text | **YES** | **YES** | **NO** — statement text is the **instruction** |
| **`expandedSQL`** | **NO** — no accumulation | **YES** | **YES** | **NO** — the instruction |
| **`setAuthorizer`** | **NO** — a prepare-time authorization callback; **the engine retains nothing** | **YES** — the deny control threw `not authorized` | **YES** | **NO** — per column reference |
| **`dbstat`** | **NO** — page-level storage statistics | **YES** | **YES** | **NO** — describes pages |
| **user-defined function / aggregate** | **NO** — **the APPLICATION logging content the engine handed it** | **YES** | **YES** | **NO** |

**C1 = NO on every surface. Seven surfaces, one engine, and no log.**

**MSG-0168 §5.3 reproduced exactly on this run**, so the two records are comparable rather than merely
consistent: parameter-bound → `sourceSQL` **0 hits**, `expandedSQL` **1 hit verbatim**; inlined →
**both 1**.

---

## 5. The finding — `createSession` accumulates, and MSG-0168 never asked whether it did

**MSG-0168 §4.1 enumerated `Session` and recorded its observability surfaces as *"none"*.** **That was
a correct answer to the question TASK-0050 was asking.** TASK-0054 asks a different one — *does it
accumulate?* — and **the surface was therefore MEASURED rather than dismissed**, on exactly the
reasoning MSG-0168 §5.4 itself applied to `createTagStore`.

**Measured, with `ENABLE_SESSION` confirmed PRESENT in the build:**

```text
disarmed (session open, no statement) : 0 bytes
after statement 1                     : 74 bytes   · unauthorized-marker hits: 1
after statement 2                     : 137 bytes  · unauthorized-marker hits: 2
patchset after statement 2            : 137 bytes  · hits: 2
statement text ("INSERT INTO chunk")  : 0 hits
a SELECT examining 103 unauthorized rows : 137 -> 137 bytes
```

**Four facts, and they must be read together:**

1. **It ACCUMULATES across statements.** 0 → 74 → 137 bytes across two distinct statements. **It is
   the first surface in this programme measured to do so and to be readable back.**
2. **It is READABLE BACK** — an inspectable `Uint8Array`, not an opaque handle.
3. **It carries NO statement text and DOES carry row content verbatim.** 0 hits for `INSERT INTO
   chunk`; **2 hits for the unauthorized marker.**
4. **It records WRITES only, never reads.** A SELECT examining **103 unauthorized rows** moved it
   **0 bytes**.

**So it fails C1 on what it IS, not on whether it was found**: a changeset is a record of **data
changed**, and E4 asks about **the engine's logs of what it executed**. **It also fails C4 decisively
— it cannot measure `U`** — and **it is ADVERSE**, carrying unauthorized content verbatim. **It is not
offered as E4, and E4 is not reinterpreted to admit it** (MSG-0119).

> **This is the same discipline §4.15 applied to the WAL and MSG-0147 upheld.** A surface that
> **accumulates content the engine wrote** is a **durability/change artefact**, not a log of
> execution. **§4.16's DA-1…DA-7 is the vocabulary for that class**, and **whether a changeset falls
> inside it is NOT ruled here** — see §8.

---

## 6. The two halves, answered together for the first time

**This is the substance of the record.**

| Surface | **(a)** accumulates across statements AND readable back | **(b)** statement text **without** inlined content | **BOTH?** |
|---|---|---|---|
| **`createSession` / `changeset()`** | **YES** — 0 → 74 → 137 bytes, readable | **NO** — carries **no statement text at all**, and row content verbatim | **NO** |
| `createTagStore` | **NO** — accumulates (0 → 1 → 2) but **has no read path** | n/a — unreadable | **NO** |
| `sourceSQL` | **NO** — per-handle | **YES** — parameter-bound text stays out of it | **NO** |
| `expandedSQL` | **NO** — per-handle | **NO** — inlines bound values | **NO** |
| `setAuthorizer` | **NO** — the accumulation is the **caller's array**; the engine retains nothing | n/a — never carries statement text | **NO** |
| **Python `sqlite3.set_trace_callback`** (§4.15 — **CARRIED, not re-measured**) | **YES** | **NO** — emits the **EXPANDED** statement | **NO** |

**NOTHING REACHABLE SATISFIES BOTH HALVES**, and **the two failures have different causes** — one
surface has no statement text, the other has no accumulation. **Neither is evidence about the other,
and this record does not let one be rounded into the other.**

**Why the Python row is CARRIED and not re-measured, stated plainly.** `.claude/settings.local.json`
grants **`Bash(py -V)`** and **`Bash(py implementation/probes/TASK-0043/probe.py*)`** — a version check
and **TASK-0043's committed probe by path**. **Arbitrary Python is not granted.** `py -V` was run once
and returned **`Python 3.14.5`**; **no Python script was written or executed**, and **writing a new
script into TASK-0043's path to slip under its glob would be a workaround and was not done.**

> **A correction to a standing record, reported and deliberately NOT edited.** **BLK-0011 states that
> `py -V` returns `This command requires approval`. That is no longer true** — it succeeds, because
> the permission file now carries `Bash(py -V)` explicitly. **BLK-0011's headline condition is
> narrower than its text describes.** This session is not authorized to rewrite another blocker's
> finding, so it is **reported here and left standing**, on the MSG-0037 / MSG-0039 precedent.

**And the third binding, which is the reason BLK-0014 exists.** **§4.15's central finding is that E4's
obtainability changed with the BINDING, not the build.** **Twelve probes have run against two
bindings. A third — `bun`, shipping `bun:sqlite` — is installed on this host and has never been
enumerated by any probe.** **This runner may not execute it**: `bun --version` was attempted **once**,
returned `This command requires approval`, and **the cause was established by reading both permission
files** — neither carries any `bun` entry. **No workaround was taken.** **That is a PERMISSION
boundary, not an install boundary**, and clearing it costs the operator one line rather than a
download. **BLK-0014 carries the five MSG-0173b §1 items, including what it would still NOT prove.**

---

## 7. Required outcome 4 — what would require an install or a host change, and was not attempted

**Nothing in this survey required an install to complete, and none was performed, attempted or
requested.** Two routes were reached and **stopped at rather than routed around**:

| Route | Why it stops |
|---|---|
| **Any engine from the npm registry** | **An install.** MSG-0173b §1 is explicit that the executor **asks** and the operator **installs**, and **no ask is made here** — because the enumeration found no reason to believe a different SQLite binding from the registry would do what the two measured ones do not, and **a request that probably fails is a bad request** (MSG-0180 §2's own reasoning, applied to this executor) |
| **ODBC driver-manager tracing** | **Rejected on TWO independent grounds, either sufficient.** Enabling it is a **registry/host change**, forbidden outright by this task — **and** it is the **driver manager's** log, not the **engine's**, so it would fail C1 on precisely the reasoning that disqualified every caller-side surface in §4 |
| **Building SQLite with `ENABLE_STMTVTAB`** | **MSG-0180 §2 costed it and declined it.** Not re-opened here; see §8 |

**BLK-0014 is the one boundary recorded**, and it is deliberately **not** an install request.

---

## 8. Required outcome 6 — the compile route, REFERRED as a question and NOT ruled

**The task says: record whether the SQLite compile route is worth pursuing, and *"refer that as a
question if the evidence does not settle it; do not rule it."* The evidence does not settle it, so it
is referred.**

**`sqlite_stmt` is ABSENT from this build (verified against a fabricated-table control), so it was NOT
measured and no claim is made about it.** What **was** measured is the analogous property on the
binding that is reachable:

```text
while the caller HOLDS the handle : sourceSQL marker hits = 1
after the handle is DROPPED       : dbstat 0 hits · sqlite_schema 0 hits
                                    (while the database itself still carries 100 — a real 0)
```

**The finding: on this binding, the retention window for statement text is exactly the CALLER'S HANDLE
LIFETIME.** The read path **is** the handle, and the handle belongs to the **application**. So *"the
engine retained it"* and *"the application kept a reference"* are **the same event** here — which is
the same shape as the user-defined-function surface, and the shape `AB-1` exists to constrain.

### Q25 — REFERRED, not answered

> **Can a LIVE REGISTRY of currently-prepared statements satisfy C1 at all, or does C1's requirement
> for a *log* exclude the registry shape by construction?**

**Why this executor does not answer it.** The measurement above is **analogous, not equivalent** —
`sqlite_stmt` is a different surface on a build nobody in this programme has, and **§4.6 S10 forbids
generalizing one subject's behaviour to a class.** **What the evidence supports is narrow**: the
live-registry *shape*, where it exists in reach, **collapses into the caller keeping its own record**.
**What it does not support is a ruling**, and MSG-0180 §2 called this *"likely"* rather than certain
for the same reason.

**The practical consequence for the Lead's decision, offered as reasoning and not as a
recommendation:** if Q25 resolves that a live registry cannot satisfy C1, **the compile route is
closed before it is paid for**, and MSG-0180 §2's instinct is confirmed rather than merely acted on.
**That is a Lead ruling and it is not taken here.**

---

## 9. Two harness defects, found by the harness's own controls and KEPT rather than tidied away

**Both were caught by enforcing controls, and both would have produced a confidently wrong record.**

**Defect 1 — a scan that was not a scan.** The marker scanner tested `Buffer.isBuffer(s)` and
otherwise fell through to `Buffer.from(String(s))`. **`Session.changeset()` returns a `Uint8Array`,
not a `Buffer`**, so the first armed run scanned the **text `"1,2,3,..."`** instead of the bytes and
reported **0 marker hits on a surface that in fact carries the marker twice.** **The READABLE-BACK
control asserted `Buffer.isBuffer` and aborted the run** — `RUN INVALID`, exit 2. **The scanner was
fixed and the control widened to `ArrayBuffer.isView`; the run was re-executed before any result was
recorded.**

> **This is MSG-0168 §5.1's `LIMIT 1` correction in a new costume**, and it is worth naming as a
> class: **a scan of the wrong representation of a surface is not a scan of that surface**, and its
> zero means nothing. **Had the control merely reported, this record would have said the changeset is
> non-adverse. It is adverse.**

**Defect 2 — the tagged-template call.** `store\`SELECT …\`` threw `store is not a function`; the
store's `get`/`all`/`iterate`/`run` are the tagged-template **executors** (MSG-0168 §5.4). Corrected to
``store.all`SELECT …` `` and re-run.

**A third correction, to the record rather than the harness:** two cells of the C1–C4 table were
hard-coded prose that had drifted from the measurement — *"an inspectable Buffer"* where the run
measured a `Uint8Array`, and *"100 unauthorized rows"* where it measured **103**. **Both were
corrected to the measured values before publication**, and the correction is recorded here rather than
silently applied.

---

## 10. What this record does NOT establish

- **GAP-B is NOT discharged and is NOT closer to discharge.** **MSG-0180 §4 is explicit** that finding
  a surface would still require a separate authorized measurement — **and no surface was found.**
- **E4 remains UNMET.** **E4 is not weakened, narrowed or reinterpreted** (MSG-0119). No surface was
  admitted by relaxing what a log is.
- **Nothing is CLEARED.** **All six §4.14 candidates remain NOT CLEARED**, and **thirteen probes have
  now cleared nothing.**
- **No engine, binding, runtime, provider, model or index technology is selected, adopted, deployed,
  preferred, ranked or described as suitable** (MSG-0141). **`bun` is named as an unmeasured
  INSTRUMENT; naming it selects nothing.**
- **No gate, invariant, criterion or verdict changed.** E1–E4, S1–S11, DA-1…DA-7, N1–N6, EV1–EV13,
  `AB-1`, G-Q4…G-Q7.8 and strict Shape-1 are untouched. **Verified mechanically:**
  `git diff --name-only b2030b8..HEAD -- docs/ implementation/architecture/` → **EMPTY**.
- **No generalization beyond what was measured** (§4.6 S10). **The finding is about the surfaces
  enumerated on the subjects reachable to this runner** — it is **not** a claim about SQLite as a
  class, still less about any other engine family.
- **The changeset is not classified under DA-1…DA-7.** It has the shape the criterion was written for,
  **and classifying it is §4.16's question, not this record's** — the same boundary §4.15 drew for the
  WAL. **Recorded as an observation, deliberately not a result under a criterion.**

---

## 11. Required outcomes — checked against the Lead's task file, one by one

| # | Required outcome | Status |
|---|---|---|
| 1 | Enumerate what is reachable and **how the list was established**; name what returned nothing | **MET** — §3. Nine routes, **all 29 PATH directories** by vocabulary, five discrimination controls, absences recorded by enumeration |
| 2 | Per engine/binding: surface exists? **accumulates?** **readable back?** text without inlined values? | **MET** — §4 and §6, each with an enforcing control |
| 3 | Apply **C1–C4** to every surface, in **MSG-0168 §5's table form** | **MET** — §4. Seven surfaces |
| 4 | Where an install would be required — **STOP and record a BLOCKER** with MSG-0173b §1's five items. **Install nothing** | **MET** — **BLK-0014**, and it is deliberately **not** an install ask. **Nothing installed** |
| 5 | A finding that nothing qualifies is **complete and valid** — report as a finding | **MET** — §1 |
| 6 | Record whether the compile route is worth pursuing; **refer as a question if unsettled, do not rule** | **MET** — §8. Evidence given, **Q25 REFERRED and explicitly not ruled** |
| 7 | COMMS, status, queue row and checkpoint recorded, **verified from `origin/main`** | **MET with a stated qualification** — see below |

**Outcome 7's qualification, not rounded up.** `git fetch` is **DENIED to this runner** — attempted
once, refused, **no workaround** — so **this session did not itself read the remote.** What it did
verify: **`.git/FETCH_HEAD` records `origin/main` at `b2030b8`** and was **written at 12:15:24 local,
one second before this run's lock was acquired**, by the Supervisor cycle that launched it. **That is
an observation of a fetch this session did not perform, and it covers the START of the run only.** For
movement *during* the run the detector is an **interlock, not a claim**: **every push in this task was
FAST-FORWARD, without exception**, which is the server enforcing what the denied client check would
only have observed. **BLK-0013 is where that interlock fired once already.**

---

## 12. Recommended next action — for the Lead, not taken here

**No task is marked READY by this session and none may be.** **The queue is empty again**, and
**MSG-0177 §4 / MSG-0179 §3's standing warning applies: an empty queue here is not a stall.**

1. **Rule Q25** (§8). **Costs nothing and is prior to everything else** — if a live registry cannot
   satisfy C1, the compile route MSG-0180 §2 already doubted is closed rather than merely deferred.
2. **Decide BLK-0014** (§6). **Option A is one line in a version-controlled permission file**, grants
   no write or network capability, and would let a bounded task measure **a third binding to the same
   engine** — the variable §4.15 identified as decisive. **The likely result is another C1 = NO, and
   the operator should grant it only because a cheap negative is worth having.**
3. **If BLK-0014 is declined, restate the standing finding honestly** as *"no log exists in the
   bindings this programme can reach"*, naming the third binding as **enumerated and unmeasured**, so
   no later reader mistakes the claim's width. **§3 of MSG-0180 made exactly this point about SQLite;
   it applies one level down as well.**
4. **MSG-0179 §3 item 2 is untouched and still stands** — the architecture decision about what the
   programme does if the clearance bar cannot be met by measurement on anything reachable. **That one
   is genuinely the operator's**, and nothing in this record makes it more or less urgent.

---

## 13. State

- **TASK-0054 COMPLETE.** 7/7 required outcomes met, **one with a stated qualification** (§11).
- **No task is READY. The queue is correctly empty.**
- **BLK-0014 raised OPEN.** **BLK-0012 remains OPEN** and is **not** superseded by it.
- **Q25 REFERRED**, not ruled.
- **GAP-B UNDISCHARGED. E4 UNMET. All six §4.14 candidates NOT CLEARED. Thirteen probes have cleared
  nothing. Nothing selected, adopted, deployed, implemented or cleared.**
- **Two live defects reported and deliberately not fixed:** BLK-0011's stale `py -V` finding (§6), and
  the blockers-index row for **BLK-0013**, which reads **OPEN** while its own record reads **CLEARED**.
