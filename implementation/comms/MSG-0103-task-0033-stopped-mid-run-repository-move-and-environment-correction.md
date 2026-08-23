# MSG-0103 — TASK-0033 Stopped at the Mid-Run Repository-Movement Boundary; and a Correction to the Probe Environment

**Status:** **OPEN** — informational. **No decision is required to resume**, and nothing is blocked.
**Raised:** 2026-08-23
**Raised by:** Claude Code — supervisor-started session, runner pid 15500
**Type:** Stop record + environment correction
**Authority:** MSG-0101 | **Related:** MSG-0102, TASK-0033 queue section, EPA-0006 §4.4, ADR-0020 + AMD-01, MSG-0028 decision 2, BLK-0006, BLK-0009

---

## 1. Summary

**The probe was not run. No candidate was evaluated, no verdict of any kind was reached, and
`EPA-0007` does not exist.**

The session stopped at a **stop boundary that fired for real**: `HEAD` and `origin/main` moved
underneath a running session. The move was **benign and convergent** — it was the reconciliation of
this very task — but the rule that governs it is fail-closed and is stated **twice**, once globally and
once inside TASK-0033's own specification.

**Two things are delivered instead, and the second is the reason this message is worth reading:**

1. the stop, documented with its timeline, so the next session knows exactly what happened;
2. **a correction to the environment finding in MSG-0102 §2 and in the queue section.** The record
   currently tells the next runner that Tier 2 and Tier 3 evidence *cannot be obtained here*. **That is
   not correct.** A real relational engine with lexical search, query-plan output and counter
   instrumentation **is already present on this machine**, needs no installation, no `PATH` change, no
   network access and no Docker. Left uncorrected, the next runner would scope the probe around a
   constraint that does not hold and record `NOT CLEARED` for a candidate it could actually have
   tested.

## 2. What happened, with the timeline

| Time (UTC) | Event | Evidence |
|---|---|---|
| **06:37:18Z** | Supervisor acquired the runner lock **for TASK-0033** | `state/runner.lock` → `{ "taskId": "TASK-0033", "pid": 15500, "acquired": "2026-08-23T06:37:18Z" }` |
| **06:37:48Z** | Heartbeat confirms the runner is **live on this task** | `state/heartbeat.json` → `decision "RUNNER_RUNNING"`, `reason "TASK-0033 running for 30s"`, `runnerPid 15500`, `head d4a0d2d…` |
| ~06:37–06:39Z | This session ran the startup checklist against **`HEAD = d4a0d2d`** and wrote checkpoint 1 | `checkpoints/TASK-0033.md` checkpoint 1 |
| **06:39:24Z** | **A concurrent interactive session committed `55a617c`**, moving `HEAD` **and** `origin/main` | `git show --stat 55a617c` → *"ops: reconcile TASK-0033 - conformance probe, with its execution tiers gated"*, 4 files, +256 −2 |
| ~06:41Z | This session detected the move | `git rev-parse HEAD` → `55a617c…`, where checkpoint 1 had recorded `d4a0d2d…` |

**The runner was already running the task 2 minutes 6 seconds before that commit was made.**

### Why this is a stop and not a judgment call

`CLAUDE.md`, *Mid-run repository movement — abort* (authority: MSG-0028 decision 2):

> If `HEAD` or `origin/main` changes unexpectedly **after a session has started**, that session must
> stop at the next safe checkpoint, document the discrepancy, and make no further changes against a
> moving repository state. **This is a fail-closed recovery boundary, not a warning.**

And **TASK-0033's own stop conditions**, in the queue section that arrived *in the moving commit
itself*:

> **Also stop if `origin/main` moves mid-run** — BLK-0006 is the precedent, and **the scheduler is now
> enabled**, so a supervisor cycle can start while other work is in flight.

**Both fired.** The continuation clause — *"a run may continue only after reconciliation confirms the
repository is again consistent with the state the session recorded at its start"* — is **not**
satisfied: the repository is at `55a617c`, and this session recorded `d4a0d2d`.

**The convergent-and-therefore-harmless argument was considered and rejected**, and it is recorded
because it is the argument a future session will also find persuasive. The move added the TASK-0033
task section, an authorized reconciliation under MSG-0101 §5, and it contradicts nothing this session
had done. But *"my judgment that this particular move was safe"* is authority tier 8, and the rule is
tier 1. **Overriding an explicit repository rule on the strength of the mover's good intentions is the
precise thing `CLAUDE.md` forbids** — and a rule that yields whenever the mover meant well is not
fail-closed. The cost of stopping is **one supervisor cycle**; the cost of the precedent is permanent.

### The stop was safe, and cost almost nothing

**Nothing had been written to the repository at the moment the move was detected.** The only artifact
this session had produced was checkpoint 1, still untracked. **No probe was built or executed, no
fixture created, no candidate evaluated, no `EPA-0007` drafted.** There is no partial deliverable for
anyone to reconcile.

## 3. The environment correction — the substantive part of this message

**MSG-0102 §2 and the queue section both state that Tier 2 and Tier 3 cannot be run here. That
conclusion does not hold**, and the next runner should not act on it.

### What MSG-0102 got right, and what it missed

MSG-0102 §2 records `psql, sqlite3, java   absent`. **The `sqlite3` command-line tool is indeed absent —
that part is correct.** What the check missed is that **SQLite is not only a CLI**. It is an *embedded*
engine, and it is **compiled into the Node.js runtime that the very same table records as available**,
reachable through the built-in `node:sqlite` module with no dependency of any kind.

**This is precisely the failure mode MSG-0102 §3 warns about, one level down.** That section records a
near-miss where Git Bash reported Docker and Python absent — a `PATH` artefact, not a machine fact —
and draws the lesson *"disbelieve a suspicious absence and check a second way."* **The same lesson
applies to `sqlite3`, and the second way was not taken:** the tool was absent from `PATH`, and the
engine was concluded absent from the machine. **The lesson is easier to state than to apply**, which is
worth recording alongside it — the near-miss and the miss are in the same document.

### VERIFIED in this session

```text
$ node -e "const s=require('node:sqlite'); const d=new s.DatabaseSync(':memory:'); ..."
node:sqlite OK
sqlite version 3.51.3
FTS5 available
```

```text
$ node -e "... DatabaseSync.function / EXPLAIN QUERY PLAN ..."
DatabaseSync.function typeof: function
EXPLAIN QUERY PLAN rows:
   {"id":4,"parent":0,"notused":51,"detail":"SEARCH c USING INDEX i_scope (scope=? AND eff_from<?)"}
```

### Why this matters for each tier

| Tier (EPA-0006 §4.4) | What the queue section says | What is actually available |
|---|---|---|
| **1 — query shape** | available | available — unchanged |
| **2 — k-completeness under adversarial selectivity** (black-box) | cannot be run | **Can be run.** It needs only a collection where `M` unauthorized chunks outrank `k` authorized ones, a constrained top-`k` query, and `M` varied. An in-process engine satisfies that completely |
| **3 — plan / counter / instrumentation evidence** | cannot be run | **Can be run, and this is the tier EPA-0006 §4.4 calls the one that *"actually discharges AMD-01's selection criterion"*.** `EXPLAIN QUERY PLAN` returns structured plan rows, and `DatabaseSync.prototype.function` permits registering the authorization predicate as a user-defined SQL function, so **the number of rows the engine actually examines can be counted directly** — the exact Shape-1-versus-Shape-3 discriminator |

**The plan line above is capability evidence, and it is deliberately not a verdict.** It shows the
engine *can* be made to report how a predicate participated in building a candidate set. It clears
nothing, disqualifies nothing, and is not a probe result. **No candidate has been evaluated by this
session.** Reading that line as a conformance finding would be exactly the *"engine that looks
conformant on paper"* error the queue section calls its single most important instruction.

### What is still genuinely gated — this correction is narrow

**Class R is the only class this reaches.** Everything MSG-0102 says about the rest stands:

- **Class S** (search engines with filtered kNN) and **class V** (purpose-built vector stores) remain
  **unreachable** — they are containerised candidates and Docker is not usable from this runner.
- **Class K** (retrieval against the kernel store) remains **unmeasured**; it needs PostgreSQL, which is
  absent.
- **Strategy-switching under selectivity (acceptance criterion 6)** is the behaviour of engines with
  *approximate* vector indexes. SQLite has none, so **a probe against it cannot settle criterion 6 for
  classes S or V** — those stay `NOT CLEARED` for want of evidence, and must be recorded that way.

**So the correction widens what is provable; it does not make the probe complete.** It converts one
class from "no evidence obtainable" to "all three tiers obtainable against one named test subject",
and leaves the remaining classes exactly where MSG-0102 left them.

### Docker — what this session verified, and what it did not

| Claim | Status here |
|---|---|
| `com.docker.service` is running | **VERIFIED** — `sc query com.docker.service` → `STATE : 4  RUNNING` |
| the `docker` Windows service is running | **VERIFIED** — `sc query docker` → `STATE : 4  RUNNING` |
| the `docker` CLI is usable from this runner | **VERIFIED FALSE** — `docker --version` → `bash: docker: command not found` (exit 127) |
| the Linux engine backend is down (`dockerDesktopLinuxEngine` pipe missing) | **NOT INDEPENDENTLY VERIFIED HERE.** This session could not reach the CLI at all, so it could not reproduce that diagnosis. It is reported as **MSG-0102's finding**, not as this session's |

**No workaround was attempted** — the CLI was not invoked by absolute path, `PATH` was not modified, and
no permission was widened. `C:\Program Files` is outside this session's allowed read roots, so the
binary could not be located from here either. **Rule 2 forbids routing around a reachability boundary**,
so it is recorded rather than circumvented.

## 4. A factual error in MSG-0102 §7, recorded rather than edited

MSG-0102 §7 states: *"**TASK-0033 is READY and is the single READY task.** Not started at the time of
writing."*

**It had been started.** The runner lock was acquired at **06:37:18Z** and the heartbeat read
`RUNNER_RUNNING` at **06:37:48Z**; MSG-0102's commit is timestamped **06:39:24Z**. The interactive
session wrote *"not started"* while a supervisor-started runner was already executing the task.

**MSG-0102 is not modified by this message.** It is another actor's record, it was written in good
faith, and the error is exactly the concurrency hazard its own §7 names one sentence later — *"the
BLK-0009 concurrency discipline applies again to anyone editing the tree."* **The record is corrected
here rather than overwritten there**, so both the original observation and the correction survive.

**The mechanism is worth naming, because it will recur.** `runner.lock` is what tells an editor a
runner is live. An interactive session that does not read it has no way to know — and the supervisor
being *enabled* means the window between "task queued" and "runner started" is now about ten minutes
wide, not indefinite. **The reconciliation and the run raced, and the reconciliation lost by two
minutes.**

## 5. State after this message

- **TASK-0033 remains READY, and deliberately so.** Its work is untouched and unstarted, and the
  condition that stopped this session — a repository in motion — **has already cleared**:
  `git rev-parse HEAD` and `git rev-parse origin/main` both read `55a617c`, and the working tree
  carries only this session's own documentation.
- **Leaving it READY is the right call here, and it is the opposite of the TASK-0017 case.** There,
  READY would have had the supervisor repeat unbounded work every cycle. Here the blocking condition
  was **transient and is gone**, so the next supervisor cycle should simply run the task against a
  stable `HEAD` — which is what the abort rule is *for*. **This session changed no task status.**
- **No blocker is raised.** Nothing is blocked: no decision, no privilege, and no operator action is
  required to resume.
- **No accepted ADR was modified.** `git diff --name-only docs/decisions/` is **empty**.
- **No engine was selected, adopted, or named as a recommendation.** No corpus was entered —
  `D:\Work\pci-corpus` was **not read by this task**, though MSG-0083 would permit it.
- **Nothing was installed and no network was reached.** `npm install` is on this runner's allowlist and
  was **not used**, because MSG-0101 §4 stops on provisioning a runtime.

## 6. What the next session should do

1. **Run the startup checklist and re-verify the environment from scratch.** The queue's own recovery
   procedure says an operator may have started Docker Desktop in the interval, which would widen the
   probe. **Re-check; do not inherit §3 above.**
2. **Do not treat "Tier 2/3 cannot be run here" as settled.** §3 shows all three tiers are obtainable
   against an in-process relational engine. **Re-verify it in that session** — this message is a
   pointer, never evidence.
3. **Record the two runs' relationship honestly.** This session produced **no probe result**, so there
   is nothing to resume from and nothing to avoid repeating. Checkpoint 1 records what was verified;
   checkpoint 2 records the stop.
4. **Check `runner.lock` before editing the tree**, and re-check `HEAD` immediately before every commit
   and push.

## 7. One item referred to the Architecture Lead — non-blocking, no decision needed to proceed

**The scheduler being enabled has made the reconcile-then-run race a live hazard rather than a
theoretical one**, and this is the second time it has produced a defect: BLK-0006 previously, and here
a stopped run plus an incorrect *"not started"* in MSG-0102. Both were cheap. The pattern is that an
**interactive session and a supervisor-started runner edit the same tree with no mutual exclusion** —
`runner.lock` guards against a second *supervisor*, not against a human session, which is the same gap
MSG-0028 recorded and which remains open.

**No change is proposed and none is self-authorized.** Whether anything should constrain interactive
editing while a runner holds the lock is the Lead's call, and TASK-0033 does not authorize raising it as
work. **It is recorded because it is now evidenced twice, and it will otherwise be rediscovered a third
time.**
