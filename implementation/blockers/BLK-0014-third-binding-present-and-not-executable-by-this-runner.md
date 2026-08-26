# BLK-0014 — A THIRD SQLite Binding Is Installed on This Host and This Runner May Not Execute It

**Status:** **OPEN** 2026-08-26 — requires an operator decision on this machine's runner permission
set. **Nothing was installed, nothing was routed around, and no permission denial was worked past.**
**Raised:** 2026-08-26, by the supervisor-started TASK-0054 session (`runner.lock` pid **21540**,
acquired **2026-08-26T09:15:25Z**, host `LENOVO-LA0X1754`)
**Severity:** **Bounds the survey, and it is CHEAP to clear** — this is **not** an install request.
The artefact is **already on the disk**. What is missing is permission to run it.
**Related:** **MSG-0181** (the execution record), **MSG-0180** (the authorization), **TASK-0054**;
**BLK-0012** (the blocker this sits beside, still OPEN), **BLK-0011** and **BLK-0010** (the precedents
this stop follows and the option-A shape it recommends); EPA-0006 §4.13 **GAP-B**, **§4.15**.
**Starting HEAD:** `b2030b820fd8bb21916420080350527af4830e90`

---

## Summary

**TASK-0054 executed and answered its question. This blocker is not a failure to execute it.**

The survey asked whether **any** engine or binding obtainable **without a source build** supplies a
surface that accumulates across statements, can be read back, and exposes statement text without
inlined values. **Within this runner's reach the answer is no**, and MSG-0181 records the measurement
in full with 26 controls.

**This blocker records one thing the survey found that it could not measure**, and it is a different
shape from every reach boundary recorded before it.

---

## VERIFIED — what the widened enumeration found

**The enumeration was widened deliberately** (DISC-0014 is the reason): rather than checking a fixed
list of names, the probe scanned **all 29 PATH directories** against the engine vocabulary, with a
**fabricated-executable negative control** that did not fire. It also checked runtime install
directories directly.

```text
PRESENT  bun install dir C:\Users\Administrator\.bun
         bin/: bun.exe, bunx.exe
         bun.exe: 98480216 bytes, mtime 2026-05-12T19:39:24.000Z
ABSENT   deno install dir C:\Users\Administrator\.deno
```

**Bun is installed on this host.** It is a JavaScript runtime that ships **`bun:sqlite`** — and
**EPA-0006 §4.15's central finding is that E4's obtainability changed with the BINDING, not the
build:**

> *"the two subjects **differ in the binding, not in the build**. **E4's obtainability here is a
> property of what the language binding exposes**, not of a differently-compiled engine"*

**Every subject in this programme has been reached through one of two bindings** — `node:sqlite` and
Python's `sqlite3`. **A third binding has been sitting on this machine the whole time and no probe has
ever enumerated it.** That is a gap in the *reach*, not in the reasoning of any prior record.

---

## VERIFIED — the denial, and its cause established by READING rather than inferred

`bun --version` was attempted **once** and returned `This command requires approval`. **No workaround
was taken** — no `child_process`, no shell indirection, no alternate path. **BLK-0011's precedent is
followed exactly.**

**The cause was then established by reading both permission files, not guessed from the failure:**

| File | What it grants | `bun`? |
|---|---|---|
| `.claude/settings.local.json` | `Bash(node *)`, `Bash(py -V)`, `Bash(py implementation/probes/TASK-0043/probe.py*)`, `Bash(npm install *)`, and ~30 other narrow entries | **NO ENTRY OF ANY KIND** |
| `implementation/operations/supervisor/runner-settings.json` | four git operations; `additionalDirectories` for the corpus | **NO ENTRY OF ANY KIND** |

**A bare command failure is not a diagnosis** (CLAUDE.md rule 5). This is a **denial**, not an absence:
the file exists at a verified path with a verified size and mtime, and no allow-rule matches it.
**Nobody should be sent to install bun; it is installed.**

---

## VERIFIED — one thing that CHANGED since BLK-0011, reported because a stale blocker is worse than none

**`py -V` now succeeds.** It was attempted once in this session and returned:

```text
Python 3.14.5
```

**BLK-0011 recorded `py -V` returning `This command requires approval`.** That is no longer true:
`.claude/settings.local.json` now carries `Bash(py -V)` explicitly. **BLK-0011's headline condition is
therefore narrower than its text describes** — and it is **NOT edited here**, because this session is
not authorized to rewrite another blocker's finding. **Reported, not fixed.**

**What this does NOT unlock.** The only other `py` entry is
`Bash(py implementation/probes/TASK-0043/probe.py*)` — **TASK-0043's committed probe, by path.**
**Arbitrary Python is not granted, so subject 2 cannot be measured against TASK-0054's question**, and
**writing a new script into TASK-0043's path to slip under its glob would be a workaround and was not
done.** A version check is not an evidence instrument.

---

## The ask — MSG-0173b §1's five items, and item 1 is the point

**1. The exact artefact, name, version, and where it comes from.**
**Nothing to obtain.** `C:\Users\Administrator\.bun\bin\bun.exe`, **98 480 216 bytes**, mtime
**2026-05-12T19:39:24Z**, already installed by the operator at some earlier date. **Its version string
is UNKNOWN and is deliberately not guessed** — reading it requires executing it. What is requested is
**one allow-rule**, not a download:

```json
"Bash(bun --version)",
"Bash(bun implementation/probes/TASK-0055/probe.mjs)"
```

**This is BLK-0010's and BLK-0011's option-A shape**: narrow, path-scoped, version-controlled, and
granting no write capability and no network access.

**2. Why it is needed, tied to the specific evidence the task cannot otherwise obtain.**
**§4.15 established the binding is the variable.** Twelve probes have run against two bindings; a
third is present and unmeasured. **GAP-B is undischarged because no subject supplies a log**, and the
only honest current statement of that finding is *"no log exists in the two bindings measured."*
**Measuring a third binding is the cheapest available move toward making it a claim about more.**

**3. The exact step the operator would run.**
Add the two lines above to `.claude/settings.local.json`. **No install, no download, no source build,
no host configuration, no elevation.**

**4. What it would prove — and, honestly, what it would still NOT prove.**

**Would prove:** whether `bun:sqlite` exposes a statement-level surface at all, whether any such
surface **accumulates** across statements, whether it can be **read back**, and whether its statement
text is available **unexpanded**. Answered per surface in C1–C4, directly comparable to §4.15 and
MSG-0168 §5.

**Would NOT prove — and this is stated at least as plainly:**

- **It would not discharge GAP-B.** MSG-0180 §4 is explicit: finding a surface *"would require a
  separate authorized measurement against it."* **Finding one here would open a task, not close a gap.**
- **It would not clear any candidate.** All six §4.14 candidates remain NOT CLEARED and a binding is
  **an instrument, not a candidate** (MSG-0141).
- **It is still SQLite.** A third binding widens the claim across bindings; it does **not** make the
  finding true of any other engine family, and **§4.6 S10 forbids reading it that way.**
- **The likely outcome is another C1 = NO.** `bun:sqlite` is a binding over the same C API whose
  trace entry points were found unbound on `node:sqlite` and whose build lacks `ENABLE_SQLLOG`. **The
  operator should expect a negative and should grant this only because a cheap negative is worth
  having, not because it is expected to succeed.**

**5. Whether a cheaper alternative was checked and rejected, with the check recorded.**
**Yes — and the cheaper alternatives were checked FIRST, which is why this ask is one permission line
rather than an install.**

| Cheaper route | Checked | Result |
|---|---|---|
| Another runtime built-in | `node:module` `builtinModules`, **72 modules**, live-enumerated with two controls | **`node:sqlite` only** |
| A package already installed | repository `node_modules`; npm global | **repo: NOT PRESENT.** npm global: **2 entries — `corepack`, `npm`.** Engine-shaped: **NONE** |
| A package in the npm cache | `%LOCALAPPDATA%\npm-cache\_cacache` | **PRESENT — and installing from a cache is still an install.** Recorded, **not attempted** |
| A database CLI on PATH | 23 named + all 29 PATH directories by vocabulary, with a negative control | `sqlite3`, `psql`, `mysql`, `mongod`, `duckdb`, `redis-server`, `sqlcmd`, `docker` **ALL ABSENT** |
| Python's `sqlite3` (subject 2) | permission files read | **`py -V` granted; arbitrary Python NOT granted.** Cannot measure |
| Windows ESE / JET Blue | `esentutl.EXE`, `esent.dll` **PRESENT** | **Not a SQL engine — it has no statements**, so it cannot supply a statement log. Rejected on its own semantics, not on reach |
| ODBC driver-manager tracing | `odbc32.dll`, `odbctrac.dll`, `odbcad32.EXE` **PRESENT** | **Rejected on TWO independent grounds.** Enabling it is a **registry/host change**, which TASK-0054 forbids outright — and it is the **driver manager's** log, not the **engine's**, so it would fail C1 on the same reasoning that disqualified the caller-side surfaces |
| Building SQLite with `ENABLE_STMTVTAB` | **MSG-0180 §2 already costed it** | **Not requested.** A compile, and `sqlite_stmt` is a live registry that likely fails C1 anyway |

---

## What this blocker does NOT claim

- **It does not claim the survey is incomplete.** MSG-0180 §4: *"A finding that nothing qualifies is
  complete and valid."* **TASK-0054's question is answered within its authorized reach.**
- **It does not claim bun would supply a log.** That is **UNKNOWN**, and §4 above says the negative is
  the more likely result.
- **It does not claim GAP-B is closer to discharge.** **GAP-B is UNDISCHARGED and E4 is UNMET**, and
  nothing in this record moves either.
- **It does not supersede BLK-0012.** BLK-0012 records that no reachable subject supplies E4 both
  obtainable and non-adverse; **that remains true and remains OPEN.** This blocker records a
  *different* boundary — an unmeasured binding, not an unsatisfiable criterion.

---

## Recommended next action — for the Architecture Lead and the operator, not taken here

**Neither of these is executed by this session, and neither may be without authorization.**

- **Option A — grant the two allow-rules above.** Costs one edit to a version-controlled file, grants
  no write or network capability, and would let a bounded TASK-0055 measure the third binding. **This
  is the cheapest evidence available to the programme and it is recommended on that basis alone.**
- **Option B — decline, and record that the reach is final.** Entirely defensible given §4 above.
  **If Option B is taken, the standing finding should be restated honestly** as *"no log exists in the
  bindings this programme can reach"*, with the third binding named as enumerated-and-unmeasured, so a
  later reader is not misled about how wide the claim is.

**Option A costs almost nothing and decides whether Option B's restatement is the right one. It is
recommended first for that reason** — the same reasoning BLK-0012's option A used.
