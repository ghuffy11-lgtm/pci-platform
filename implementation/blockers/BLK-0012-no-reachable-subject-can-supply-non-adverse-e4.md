# BLK-0012 — The E4 Subject Enumeration Is Bounded by This Runner's Reach, and the Boundary Is Where GAP-B Now Sits

**Status:** **OPEN** 2026-08-26 — requires an Architecture Lead / operator decision. **Nothing was
installed, nothing was routed around, and no permission denial was worked past.**
**Raised:** 2026-08-26, by the supervisor-started TASK-0050 session (`runner.lock` pid **14068**,
acquired **2026-08-25T21:51:58Z**, host `LENOVO-LA0X1754`)
**Severity:** **This is the binding constraint on the programme, not a local obstacle.** EPA-0006 §4.13
EV5: *"an engine that cannot supply EV5 cannot be selected under any topology."*
**Related:** **MSG-0168** (the execution record), **MSG-0167** (the authorization), **TASK-0050**,
EPA-0006 §4.13 **GAP-B** / **EV5**, §4.15, §4.12 gap 1 (F15);
**BLK-0011**, **BLK-0010**, **BLK-0008** — the precedents this stop follows
**Starting HEAD:** `9d71790d9480f699715c25811da3c3c4dda84a9b`

---

## Summary

**TASK-0050 executed and answered its question. This blocker is not a failure to execute it.**

The task asked whether a **reachable** test subject supplies **E4 that is both OBTAINABLE and
NON-ADVERSE**. **Within this runner's reach the answer is no**, and MSG-0168 records the measurement in
full. **This blocker records the reach itself** — what bounded the enumeration, and what an operator
decision could add to it. Per TASK-0050's own words, *"a recorded blocker here is a useful result: it
tells the Lead exactly what the programme needs from the operator."*

---

## VERIFIED — what was reachable, and what it produced

| Subject | Reachable? | E4 |
|---|---|---|
| **SQLite 3.51.3 via `node:sqlite`, Node v24.15.0** | **YES — measured in this session** | **NOT OBTAINABLE.** No trace, profile, log or scanstatus entry point bound (21 names checked); **7 of 7** tracing pragmas inert against the F15 control; `sqlite_stmt`, `bytecode`, `tables_used` and `sqlite_dbpage` **absent from the build** |
| SQLite 3.50.4 via Python `sqlite3` | **NO — see below** | **OBTAINABLE and ADVERSE** (EPA-0006 §4.15) — carried from the record, **not re-measured** |
| Any third subject | **NONE FOUND** | — |

**The third row is an enumeration, not an assumption.** Repository `node_modules` **does not exist**;
npm global carries **4 packages, none engine-shaped**; `node:sqlite` is the **only** database engine
this runtime supplies without an install, enumerated from `node:module`'s own `builtinModules`.

---

## VERIFIED — the three boundaries, each named rather than implied

### 1. `py` is authorized for TASK-0043 only, and this is TASK-0050

**MSG-0145 granted `py` *"solely for TASK-0043's bounded E4 observability probe."*** **BLK-0011's
resolution states the consequence in terms:**

> *"Nothing was installed and the runner's own permission set was NOT broadened — the grant was scoped
> to one task… The condition this blocker describes therefore remains true for future UNATTENDED tasks,
> and needs a fresh decision if one requires `py`."*

**No such decision exists for TASK-0050.** `py` was therefore **not invoked in this session** — not for
a version check, not for a probe, not at all.

**The allowlist would have permitted one thing and it is the wrong thing.**
`.claude/settings.local.json`, read in this session, carries `Bash(py -V)` and
`Bash(py implementation/probes/TASK-0043/probe.py*)` — **TASK-0043's own probe, which TASK-0050 is
expressly forbidden to re-run and report as new evidence.** So even the granted invocation could not
have produced a permissible measurement.

### 2. A rebuilt engine, or a different binding, is an install

**The one surface that would have made E4 obtainable without a statement expansion is `sqlite_stmt`** —
the engine's own registry of prepared statements. **`ENABLE_STMTVTAB` is ABSENT from this build's 49
compile options**, along with `ENABLE_BYTECODE_VTAB` and `ENABLE_DBPAGE_VTAB`.

Obtaining it means **a build with different flags**. **TASK-0050's stop conditions name that case
exactly**, and so does MSG-0167 §4.

### 3. A loadable extension is a binary that is not present

`DatabaseSync` **does** expose `loadExtension` / `enableLoadExtension`. **No extension binary exists on
this machine**, and acquiring one is an install. Recorded so it is not mistaken for an unexplored path.

---

## The workaround that exists, and why it was NOT taken

**Stated plainly, exactly as BLK-0011 did, because a future session will find it within minutes.**

`Bash(node *)` is granted. The permission layer inspects the Bash command line, not what the process
that command starts goes on to spawn. A Node one-liner could have invoked `py`, or any other
interpreter, and produced a measurement on a subject this session has recorded as unreachable.

**It was not attempted, and it must not be.** CLAUDE.md non-negotiable rule 2: *"**Never work around a
permission denial.** Do not use a different path, a temporary location, a user-writable directory, a
piped shell, or any other substitute for the privilege you were not given."* **BLK-0011 recorded this
same gap and the same refusal; nothing has changed except the task number.**

---

## A second denial, recorded because it limits a stop condition rather than a measurement

**`git fetch` is denied to this runner.** Disambiguated in BLK-0010's two-step form — `git fetch origin`
alone and `git fetch --all --prune` alone both returned *"This command requires approval"*, while the
compound form returned the unrelated *"multiple operations"* message. **Cause established by reading
both permission files**, neither of which carries any `git fetch` entry, rather than inferred from the
failure.

**Consequence:** TASK-0050's stop condition *"stop if `origin/main` moves mid-run"* could be enforced
only against the locally-cached ref and against the supervisor's own heartbeat
(`2026-08-25T21:56:59Z`, `head 9d71790…`, equal to this session's starting `HEAD`). **That is
corroboration, not a live check**, and it is recorded as a limitation rather than glossed.

---

## What this does NOT establish — the distinction BLK-0011 exists to protect

**A subject behind an install or a fresh grant was NOT shown to lack a non-adverse E4 surface. It was
not reachable.** Those are different findings, and conflating them is the precise error the
nonexistent-pragma control was invented to prevent, committed at the level of a task instead of a
pragma.

So, exactly:

- **GAP-B is NOT discharged, NOT withdrawn, and NOT weakened.**
- **E4 remains NOT OBTAINABLE on subject 1** — now on a **wider** enumeration than §4.12 or §4.14 used.
- **Subject 2's E4 position is unchanged from §4.15** — OBTAINABLE and ADVERSE — because nothing about
  it was executed in this session.
- **No candidate verdict moves.** All six §4.14 candidates remain **NOT CLEARED**. **Eleven probes have
  cleared nothing.**
- **Nothing is selected, adopted, deployed, implemented or cleared.**

---

## What the operator or Architecture Lead can do

**The decision is genuinely theirs**: each option either widens what an unattended runner may execute or
changes what is installed on the machine. **This session recommends nothing be done until the MSG-0168
§7 referral is ruled**, because that ruling determines whether any of these would help.

| | Option | What it costs | What it gets, and what it risks |
|---|---|---|---|
| **A** | **Rule the §7 referral first.** Decide whether E4 can be satisfied by a surface built on the **unexpanded** statement text, given that its non-adversity is defeated by inlining | Nothing | **The highest-value action, and free.** If the answer is *no*, options B–D are wasted effort: no reachable or obtainable binding would satisfy the gate anyway. **Recommended first** |
| **B** | **A narrow `py` grant for a TASK-0050-style probe**, scoped to one committed file — BLK-0010 option A and MSG-0083 are the precedents | One line | Lets a future unattended task measure subject 2's **other** surfaces. **But §4.15 already measured its trace and found it adverse**, so the gain is smaller than it looks |
| **C** | **A SQLite build carrying `ENABLE_STMTVTAB`** | An install, and a decision that the machine may hold one | **The only option that could produce a non-adverse E4 LOG.** `sqlite_stmt` holds statement text and is a real accumulating surface. **Whether it holds the expanded or unexpanded form is UNKNOWN and would itself have to be measured** — this record does not predict it |
| **D** | **Accept the finding and treat GAP-B as undischargeable by measurement on any subject now in reach** | Nothing | MSG-0167 anticipated this: *"the most consequential result the programme could produce."* **It is a conclusion about the clearance bar and belongs to the Lead alone** |

**Whichever is chosen, the harness is ready.** `implementation/probes/TASK-0050/probe.mjs` and
`probe-surfaces.mjs` are committed, take no arguments, need no network, install nothing, and spawn no
process. Both are written to §4.12's control standard: **every instrument is run disarmed before armed,
and a disarmed instrument that is not silent voids the run.**

---

## Evidence trail

| Item | Where |
|---|---|
| The full execution record, with C1–C4 per surface and the referral | `implementation/comms/MSG-0168-task-0050-gap-b-e4-subject-execution-record.md` |
| The harness and its committed output | `implementation/probes/TASK-0050/` (`f063f09`) |
| Startup, run provenance, starting HEAD, and the `git fetch` denial | `implementation/operations/checkpoints/TASK-0050.md` checkpoint 1 |
| The enumeration asymmetry this run also found | `implementation/discoveries/DISC-0014-subjects-enumerated-to-different-standards.md` |
| The authorization this stops inside | `implementation/comms/MSG-0167-gap-b-e4-subject-authorization.md` |
| The precedent for the refusal, in the same words | `implementation/blockers/BLK-0011-python-interpreter-denied-to-unattended-runner.md` |
