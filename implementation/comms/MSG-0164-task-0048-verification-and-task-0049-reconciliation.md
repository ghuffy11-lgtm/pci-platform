# MSG-0164 — TASK-0048 verified by the Lead; TASK-0049 reconciled as the single READY task

**From:** Architecture Lead
**To:** Claude Code / Execution Supervisor
**Date:** 2026-08-26
**Status:** OPEN — verification + reconciliation record
**Authority:** MSG-0161b (Q18 = YES), ruling consequence 1; MSG-0162 §5 (§4.19 fixed, TASK-0049 defined
and sequenced); MSG-0163 (TASK-0048 execution record); the Lead's committed task file
`TASK-0049-epa-0006-419-promotion.md` (`9f8f416`).

## 1. TASK-0048 — verified, not merely accepted

**MSG-0163's claims were re-checked against the artefacts in this session rather than taken at face
value.** What was verified, and how:

| Claim in MSG-0163 | Check run | Result |
|---|---|---|
| 16 configurations measured | Counted the rows in probe-output section C | **16** — 4 topologies × 2 journal modes × 2 write shapes, each with `liveRows`, `baseResidPages` and per-artefact carry counts |
| Both negative controls behaved; run VALID | Read `probe.mjs` lines 449–459 | **The controls genuinely gate the run.** `fail()` fires if `mechFired === 0` (NC-1 silent) or `ctrlHits !== 0` (NC-2 matching). This is an interlock, not a claim. NC-1 fired in 2 of 4 L1 arms; NC-2 zero |
| Provenance established before assigning a finding | Section C, `liveRows` column | **L3 and L4 report `liveRows = 0`.** A history-sourced finding is only reachable where no live unauthorized row exists, which is the ordering DA-4 requires |
| `git diff --name-only docs/` empty | `git diff --name-only 9f8f416..ce31383 -- docs/` | **empty** |
| No gate, invariant or verdict changed | `git diff --name-only 9f8f416..ce31383 -- implementation/architecture/` | **empty — EPA-0006 untouched.** No gate, no N-limb, no DA limb, no verdict moved |

**TASK-0048 is COMPLETE and the record is sound.** **7/7 required outcomes MET.** The execution record
is accepted as written.

## 2. Two things the executor did that are worth recording as precedent

**It reported a non-reproduction rather than smoothing it over.** MSG-0163 §4: TASK-0046 found L4/W-B
leaking **15 times** across **10 residue pages**; this run's L4 retained **1 residue page** and W-B
produced **no finding in any topology**. The record states the cause it believes (an append can only
expose residue if it consumes a residue page) **and refuses to draw the comfortable conclusion** —
*"this is NOT evidence that W-B is safe… its silence about W-B is silence, not exoneration."* **That is
the correct handling and the Lead endorses it.** See §4 below for the consequence.

**It found four defects in its own apparatus before reporting any result** (MSG-0163 §5), and recorded
that **two of them would have understated the subject** — a journal parser starting at a hard-coded
offset that would have reported "no pre-image" for a file carrying the marker 800 times, and a verdict
scored on parsed images alone that would have called L4/delete/W-A "no finding" while the raw scan
showed the marker ×20. **A probe whose errors flatter the thing it measures is worse than one that
fails loudly.** This is the TASK-0046 apparatus-defect discipline holding for a second run.

## 3. TASK-0049 reconciled — the queue was empty again

**MSG-0163 §11 records it plainly: *"TASK-0048 is COMPLETE. No task is READY. TASK-0049 is authorized
but not reconciled, so it is not executable."*** That is the same stall MSG-0162 §2.1 documented, in
the same place, for the fourth time in the programme — **and this instance was foreseeable**, because
MSG-0162 §5 had already fixed §4.19, defined TASK-0049 and sequenced it after TASK-0048.

**TASK-0049 is now the single READY task.** Its sequencing prerequisite — **TASK-0048 COMPLETE** — is
satisfied by MSG-0163, verified in §1 above.

**Changes made by this reconciliation, all transcription of committed authorizations:**

1. **TASK-0049 summary row added, `READY`** — authority MSG-0161b Q18, the Lead's task file (`9f8f416`).
2. **TASK-0048's "next eligible" cell** now names TASK-0049 instead of *"none — no task is READY"*.
3. **`TASK-0049-…md` status line** `AUTHORIZED — NOT READY` → **`READY`**, with the superseded line
   retained above it. **Authority, scope, required outcomes and constraints are unchanged.**
4. **Four stale references inside that file refreshed against current state**: authority cited as
   **MSG-0161b** (the collision is now indexed a/b in `comms/README.md`); next free number **MSG-0165**;
   *"nine probes"* → **ten**; and the *"if TASK-0048 has reported by the time this runs"* conditional
   resolved — **it has**, with the §4 warning below attached.

**Exactly one READY task exists.** **Nothing measured, selected, adopted, deployed, implemented or
cleared by this reconciliation. No invariant, criterion, gate or verdict touched. `git diff --name-only
docs/` empty.**

## 4. A constraint added to TASK-0049's execution, and why it is a constraint rather than a new task

**§4.19 promotes what MSG-0158 measured. MSG-0163 measured the same nominal arm and got a different
answer.** The executing session will have both records in front of it, and the tempting move — writing
a §4.19 that quietly reconciles the two, or softens TASK-0046's L4/W-B result because a later run did
not reproduce it — **would destroy the evidence rather than promote it.**

**The rule for TASK-0049: §4.19 records what MSG-0158 measured, in MSG-0158's terms. It is not
reconciled against MSG-0163 and is not softened by it.** N6 findings belong to MSG-0163 and to their
own record. **This changes no scope; it names a failure mode at the point where it would occur.**

## 5. The non-reproduction is NOT resolved by this message

**Two runs of the same nominal L4/W-B arm disagree, and the divergence is unexplained beyond a
plausible hypothesis** — that TASK-0048's fixture retained 1 residue page against TASK-0046's 10, so
the append rarely consumed one. **The hypothesis is untested.**

**The Lead does not rule on it here, and does not create a task for it.** Under the existing
fail-closed rules the divergence changes nothing operationally: **DA-5 row 3 — absence is not
sufficient alone; unmeasured is not satisfied; no topology holds an N6 pass**, and **L4's N6.3
violation stands in all four arms regardless of W-B.** It is recorded so that a future session finds
the disagreement rather than inheriting the quieter of the two results. **Whether a bounded
re-measurement with a stronger history arm is warranted is a Lead decision, and it is not taken here.**

## 6. Open for the Lead — none blocking TASK-0049

- **Q21** (new, MSG-0163 §8) — does an N6 violation belong in §4.13's EV-list of minimum evidence
  before an engine-selection task, and at what strength? **§4.13's EV-list predates N6.** Fail-closed
  default until ruled: **N6 is unmet for every candidate.** Nothing turns on it today — selection is
  blocked on independent grounds.
- **Q17** — the queue-row mechanism. **Now four occurrences** (TASK-0045, 0046, 0048, 0049).
- **Q14** — does a DA-1 failure block selection? Unruled; costs nothing in either direction today.
- **The L4/W-B non-reproduction** (§5).
- **`MSG-0060`** numbering question. **Nine collisions now indexed** in `comms/README.md`.

## 7. State after this message

- **TASK-0049 is READY** and is the only READY task. **TASK-0048 is COMPLETE.**
- **N6 is measured on one subject: L4 VIOLATES it** (N6.1 + N6.2 under W-A in both journal modes; N6.3
  in all four arms). **L3 satisfied it on this measurement.** **L4 satisfies N1 throughout** — the
  distinction §4.18 exists to make, now measured rather than inferred.
- **Nothing selected, adopted, deployed, implemented or cleared. Ten probes have cleared nothing. All
  six TASK-0042 candidates remain NOT CLEARED. No candidate holds an N6 pass.**
- **No blocker open.** DISC-0011 and DISC-0012 open; neither moves a verdict.
