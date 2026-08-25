# MSG-0163 — TASK-0048 Execution Record: N6 Measured, and L4 Violates It

**From:** Claude Code
**To:** PCI Architecture Lead
**Date:** 2026-08-26
**Status:** **OPEN** — record, with **one question referred (§8)**, **not blocking**
**Authority:** **MSG-0161b (Q20 = YES)**, the Lead's task file `TASK-0048-n6-measurement.md`, the queue board row (single READY task); **EPA-0006 §4.18 (N6) binding as written**
**Artefacts:** `implementation/probes/TASK-0048/probe.mjs`, `probe-output.txt`

---

## 1. The result

**A real probe ran: 4 topologies × 2 journal modes × 2 write shapes = 16 measured configurations**, each
with a **baseline taken before the request** and artefacts read **while the transaction was open** as
well as after it. **Both negative controls behaved as required, so the run is VALID.**

**N6 is VIOLATED by L4 — the isolated-stores-after-re-partition topology — on this subject.** **L4
satisfies N1** (no unauthorized entry in reach) **and still failed N6**, which is the distinction §4.18
was written to make, now measured directly against the criterion rather than inferred from TASK-0046.

**Nothing is CLEARED. No candidate verdict moved. No gate changed. `git diff --name-only docs/` is
empty. Ten probes have now cleared nothing.**

## 2. What was measured (criterion 1)

| | Topology | Live unauthorized rows in the store | Baseline residue pages |
|---|---|---|---|
| **L1** | shared projection, both classes in one structure | **400** | **23 of 25** |
| **L2** | isolated structures in one store | **400** (in the sibling structure, by design) | **12 of 26** |
| **L3** | isolated stores, routed store holds one partition | **0** | **0 of 14** |
| **L4** | isolated stores **after re-partition** | **0** | **1 of 14** |

**Write shapes, both from MSG-0158:** **W-A** access accounting (`UPDATE` of entitled rows) and **W-B**
cache writeback (appending `INSERT ... SELECT`). **Journal modes:** `delete` and `wal`.

## 3. Findings, per limb (criteria 1, 5)

| Topology | W-A | W-B | N6.3 — history within the invariant |
|---|---|---|---|
| **L1** | **N6.1 + N6.2 FINDING**, both modes — `wal` frames **22 of 22** carrying, `delete` journal marker **×400** | no finding | **n/a** — holds unauthorized rows by design |
| **L2** | no finding | no finding | **n/a** — sibling structure holds them by design |
| **L3** | no finding | no finding | **satisfied on this measurement** — no residue |
| **L4** | **N6.1 + N6.2 FINDING**, both modes — `wal` **1 of 11** frames carrying, `delete` journal marker **×20** | no finding | **VIOLATED in all four arms** — 1 store page carries unauthorized bytes with **0** unauthorized rows |

**The L4 finding is history-sourced and the probe establishes that before calling it one (criterion 3):
the store holds no unauthorized row, so bytes in the artefact cannot have come from live content.**
Their provenance is the store's history, and **the request is what made them durable.**

**N6.3 is violated in all four L4 arms including the two with no N6.1/N6.2 finding** — the residue is
present whether or not a request happens to reach it. **That residue is not itself a violation of N6.1**
(DA-4 row 1: its provenance is the transition), **but N6.3 asks a different question** — whether the
N3 transition brought the history within the invariant — **and it did not.**

## 4. Where this run DIFFERS from TASK-0046, stated rather than smoothed over

**TASK-0046 found W-B leaking in L4. This run did not.** **W-B produced no finding in any topology
here.**

**The likely reason is a property of this fixture, not a property of appends:** **this L4 retained only
1 residue page**, because re-materialising the partition reused most of the pages the delete freed. **An
append can only expose residue if it consumes a residue page**, and with one such page the odds of that
are small.

**So this is NOT evidence that W-B is safe.** **DA-5 row 3 governs: absence is not sufficient alone.**
The honest reading is that **this run did not reproduce that arm**, and its silence about W-B is
**silence, not exoneration**.

## 5. Four defects in the probe's own apparatus, found and fixed before any result was reported (§7 discipline)

**Every one of them would have produced a wrong record, and two would have understated the subject.**

| | Defect | What it would have reported | Fix |
|---|---|---|---|
| **1** | Artefacts scanned **after** an autocommitted write | **DA-6 sixteen times** — "no artefact to inspect" — because the rollback journal is deleted at commit | Write inside an **explicit transaction**; read the journal **while it is open** |
| **1b** | Default page cache | journal holding **only a header**: SQLite writes page images when a dirty page **spills**, and the whole write fit in memory | `PRAGMA cache_size = -8`, the setting TASK-0045 used for the same reason |
| **2** | `liveUnauth` counted `chunk` alone | **L2 as holding zero unauthorized rows**, so any L2 finding would have been scored **"history-sourced"** when the sibling structure holds them **by design** — the presence/provenance error **DA-4 exists to prevent**, in a new costume |
| **3** | Journal parser starting at byte 28 with a hard-coded page size | **"no pre-image"** for a journal a raw scan shows carries the marker **800 times** — records begin at the **sector boundary**, and both sector and page size are **header fields** | Read both from the header |
| **4** | Verdict scored on parsed images only | **L4 / delete / W-A as "no finding"** while the raw scan of the same file showed the marker **×20** — the mid-transaction parse is a **lower bound** on what the transaction will journal | Score on the raw scan too: **the parse says WHERE, the raw scan says WHETHER** |

**Defects 2 and 4 both understated the subject**, which is the direction that matters: **a probe whose
errors flatter the thing it measures is worse than one that fails loudly.**

## 6. Run validity (criterion 2)

**Controls are structurally separate from subject findings and are reported as controls:**

```text
NC-1 mechanism control: L1 shared layout arms          4
NC-1 arms that produced a durability finding           2
NC-2 instrument control: hits for a marker never written  0
RUN VALIDITY                                           VALID
```

**NC-1 fired**, so the instrument can see the mechanism. **NC-2 is clean**, so the scanner is not
matching spuriously. **Neither is quoted anywhere as a subject result** — the correction in MSG-0156 is
the reason that sentence is here.

## 7. Required outcomes — each with its evidence

| # | Required outcome (TASK-0048) | Evidence |
|---|---|---|
| 1 | Per-topology, per-mode, per-write evidence against N6.1/N6.2/N6.3 | §3 and probe output sections C and D — **16 configurations, each with all three limbs** |
| 2 | Controls structurally separate; run INVALID if they do not fire | §6; the probe **fails the run** if NC-1 does not fire or NC-2 matches |
| 3 | Provenance established before assigning a finding | §3 — baseline first; a history-sourced finding requires **0 live unauthorized rows** |
| 4 | Fail-closed where the artefact cannot be inspected | The DA-6 branch exists and **was deliberately removed from firing by fixing defect 1** rather than left to inflate the record |
| 5 | Satisfies/violates stated per configuration, without generalizing | §3; §9 states the single-subject boundary explicitly |
| 6 | N1 and all gates and verdicts preserved | **No gate touched**; **L4 satisfies N1 throughout**; no verdict moved |
| 7 | COMMS, status, queue, checkpoint, harness/output, verification from `main` | this record, the queue row, the status file, `checkpoints/TASK-0048.md`, the probe directory, §10 |

## 8. One question referred — **Q21**, and it blocks nothing

**Q21 — does an N6 violation belong in the EV-list of minimum evidence before an engine-selection task,
and at what strength?** **§4.13's EV-list predates N6 and does not mention it.** **Not taken here**: the
task is evidence-only and adding an EV item is an architecture change.

**Fail-closed default until ruled: N6 is unmet for every candidate**, because **unmeasured is not
satisfied** and **the one topology measured against it failed**. **Nothing turns on it today** —
selection is blocked on independent grounds.

## 9. Limitations — stated, not omitted

- **One subject, one build.** SQLite **3.51.3** via `node:sqlite`, Node **v24.15.0**. **§4.6 S10 forbids
  generalizing to SQLite as a product or to an engine class**, and **§4.15's binding-not-build point
  applies unchanged.**
- **This L4 fixture is a weak history arm** — **1 residue page**, against the 10 TASK-0046 reported.
  **W-B's silence here is a property of that**, not of appends.
- **The delete-mode journal snapshot is a LOWER BOUND**, taken mid-transaction because the file is
  written, synced and deleted at commit faster than any scan.
- **Byte-scanning sees literal markers.** Re-encoded, compressed or encrypted content would be missed;
  **absence remains "not sufficient alone"** (DA-5 row 3).
- **Filesystem- and device-level residue is outside DA-3's scope** and was not measured.
- **`VACUUM`, `PRAGMA secure_delete` and checkpoint variants were not tested**, so **no remedy is
  evaluated or recommended here.**

## 10. Verification, quoted

```text
starting HEAD                  -> 9f8f416 (verified equal to origin/main before work began)
git diff --name-only docs/     -> empty
probe                          -> 16 configurations, exit 0, RUN VALIDITY: VALID
negative controls              -> NC-1 fired (2 of 4 L1 arms); NC-2 zero
git status --porcelain         -> empty after commit
```

**Post-change content verified from `origin/main` after pushing.**

## 11. State

- **TASK-0048 is COMPLETE. No task is READY.** **TASK-0049 (the Q18 §4.19 promotion) is authorized but
  not reconciled**, so it is not executable.
- **N6 is measured: L4 violates it; L3 satisfied it on this measurement; L1 and L2 are n/a for N6.3 and
  produced findings only where a shared layout holds the rows in reach.**
- **Nothing selected, adopted, deployed, implemented or cleared. Ten probes have cleared nothing.**
- **Open for the Lead:** **Q21**, **Q17**, **Q14**, and **MSG-0060** — now **nine** number collisions.
- **No blocker open.** DISC-0011 and DISC-0012 open; neither moves a verdict.
