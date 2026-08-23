# MSG-0102 — TASK-0033 Reconciled; the Probe's Execution Tiers Are Gated

**Status:** **CLOSED** 2026-08-23 — the reconciliation stands, but **§2's environment finding was WRONG and is superseded by MSG-0103**: SQLite is embedded in the Node runtime via `node:sqlite`, so Tier 2/3 were runnable all along. TASK-0033 is COMPLETE (MSG-0104).
**Raised:** 2026-08-23
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation + environment finding
**Authority:** MSG-0101 | **Related:** EPA-0006 §4.4, ADR-0020 AMD-01, TASK-0032

---

## 1. What was reconciled

**TASK-0033 is the single READY task**, as MSG-0101 §5 requires and permits — a **bounded
retrieval-engine conformance probe** that names candidates **as test subjects only** and adopts nothing.

The five rulings in MSG-0101 §1 are carried into the queue section as binding context, in particular
that **"one projection index" means one *logical* projection** and that **the fusion layer must never be
where authorization is resolved** — the point where a lexical+semantic pairing would otherwise quietly
become a retrieve-then-filter design.

## 2. The environment finding — established before the task was queued

**Tier 2 and Tier 3 require running engines. They cannot be run here right now.**

```text
Docker Desktop        INSTALLED
com.docker.service    Running
docker service        Running
docker.exe            C:\Program Files\Docker\Docker\resources\bin\docker.exe   (not on either shell PATH)
docker version        FAILS - npipe:////./pipe/dockerDesktopLinuxEngine does not exist
                      -> the Linux engine backend is NOT up
psql, sqlite3, java   absent
python 3.14.5         installed, not on PATH
node                  v24.15.0 available
```

**The services running is not the same as the engine running.** Docker Desktop's Windows services are
up, but the Linux backend pipe does not exist, so no container can start.

## 3. A near-miss worth recording

**A first check through Git Bash reported no Docker and no Python at all.** That was a **PATH artefact,
not a machine fact** — both are installed, and only a second check through the Windows uninstall
registry showed it.

Had that first answer been written down, this record would have told the Lead the machine lacks
capabilities it actually has, and the probe would have been scoped around a false constraint.

**It is the same shape as the TASK-0029 error**, where fonts appeared "absent" because the search looked
in decompressed streams while that file kept its objects in the plain body. **The lesson repeats:
disbelieve a suspicious absence and check a second way.** The queue section carries it so the runner
applies it too.

## 4. What the task may and may not do about it

**May not:**

- **Install anything** — no `docker pull`, no `npm install` of a search library, no `pip install`.
  MSG-0101 §4 stops on *"provisioning an implementation runtime or production service"*, and installing
  software on this host is authorized by no record.
- **Start Docker Desktop.** That is an operator action on the operator's machine and typically needs an
  interactive session. **The task records that it is required; it does not attempt it.**

**May, and should:**

- **Run Tier 1 now.** Query-shape analysis from an engine's documented API and query grammar needs no
  execution, and it is the tier that establishes whether the authorization predicate can even be
  *expressed* in-query — which is precisely what AMD-01 made a disqualifier.
- **Record `NOT CLEARED` wherever Tier 2/3 evidence is unobtainable.** MSG-0101 §2 is explicit, and the
  queue section repeats it as the single most important instruction in the task: **an engine that looks
  conformant on paper is not cleared.**

## 5. The operator action that would widen the probe

**Starting Docker Desktop** — so the Linux engine backend comes up — would let the probe attempt Tier 2
and Tier 3 against containerised candidates, and turn some `NOT CLEARED` results into real evidence
either way.

**It is not a blocker.** The probe is worth running without it: Tier 1 results are real findings, and a
documented, reasoned `NOT CLEARED` is a legitimate and useful outcome. **Nothing should wait on this**,
and no task should be held open pending it.

## 6. Boundaries restated

**Nothing is selected, adopted, deployed, or integrated.** No accepted ADR may be modified — including
ADR-0020 as amended and **ADR-0018 on supersession**, which MSG-0101 §1(2) explicitly declines to settle
now. **ADR-0019 stays untouched.** No real or confidential corpus is entered; fixtures are synthetic.

**No benchmark, latency, capacity, recall, or throughput figure may be invented** — only what the probe
actually measures, with method and evidence, and **vendor claims cited as claims**.

**No corpus request or survey task is authorized** (MSG-0101 §1(5)), and none is created here.

## 7. State

- **TASK-0033 is READY and is the single READY task.** Not started at the time of writing.
- **TASK-0032 is COMPLETE**, having delivered `EPA-0006` while selecting nothing.
- **The scheduler is enabled again** (`Ready`), so a supervisor cycle can now take TASK-0033 without a
  manual trigger — and the BLK-0009 concurrency discipline applies again to anyone editing the tree.
- No blocker open. No implementation task authorized or READY.

---

## CORRECTED and CLOSED — 2026-08-23

**§2's environment finding was wrong, and the error was mine.** The correction is **MSG-0103**, raised
by the TASK-0033 runner; the probe then ran and its result is **MSG-0104**.

**What was wrong.** §2 concluded that Tier 2 and Tier 3 evidence *"cannot be run here right now"*
because Docker's Linux backend was unreachable and `psql`, `sqlite3` and `java` were absent. The Docker
part is accurate. **The conclusion drawn from it is not.**

**SQLite is not only a CLI.** It is an *embedded* engine, and it is **compiled into the Node.js runtime
that §2's own table lists as available**, reachable through the built-in `node:sqlite` module with no
dependency, no install, and no network. A genuine relational engine — with lexical search, index
selection, `EXPLAIN QUERY PLAN` output and row counters — was on this machine the entire time.

**So Tiers 2 and 3 were runnable, and the probe ran them.** They are the tiers that decided the
outcome.

### Why this matters more than an ordinary mistake

**§3 of this very record warned against exactly this error**, in these words: *"disbelieve a suspicious
absence and check a second way."* It was written about Docker and Python appearing absent through a
`PATH` artefact — and then, in the same table, `sqlite3` returning nothing was read as SQLite being
absent from the machine.

**Stating a lesson is not applying it.** The runner's framing is the right one to keep: the lesson is
easier to state than to apply, and a warning written for one instance does not automatically transfer
to the next line of the same table.

**The practical harm was bounded but real.** Left uncorrected, the next runner would have scoped the
probe around a false constraint and recorded `NOT CLEARED` for want of evidence it could have obtained
— an answer that looks identical to a genuine one.

### Status

**CLOSED** — the reconciliation this record performed stands (TASK-0033 was correctly queued as the
single READY task), its §2 environment finding is **superseded by MSG-0103**, and the task it queued is
**COMPLETE** (MSG-0104, 8/8 criteria). **Nothing here awaits anyone.**

**The operator action §5 suggested — starting Docker Desktop — is still optional and still not a
blocker**, and it is now less significant than it appeared: it would widen the *classes* of engine
testable, not enable execution evidence as such.
