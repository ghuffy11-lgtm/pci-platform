# MSG-0102 — TASK-0033 Reconciled; the Probe's Execution Tiers Are Gated

**Status:** **OPEN** — informational, with one operator action that would widen what the probe can prove
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
