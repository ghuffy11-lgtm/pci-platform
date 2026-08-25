# TASK-0050 — discharge GAP-B: is there a reachable subject where E4 is obtainable AND non-adverse?

**Authority:** **MSG-0167** (operator authorization, 2026-08-26); **EPA-0006 §4.13 GAP-B** and **EV5**;
**§4.15** (TASK-0043 / MSG-0146); **§4.12** (F15); **§4.6 S6 / S9 / S10**; **MSG-0141** precedent — a
test subject is an evidence instrument, not a candidate.
**Type:** Bounded evidence / enumeration task.
**Status:** AUTHORIZED — not READY until reconciled into the authoritative queue as the single READY task.

## Why this task exists

**GAP-B blocks clearance independently of topology and is undischarged.** §4.13 calls it *"the one to
read first"*: E4 is **NOT OBTAINABLE** on the first subject — *"the subject every Shape-1 measurement in
§4.11, §4.12 and §4.14 was taken on"* — so *"a future probe on that subject would clear nothing whatever
the topology."*

**A second subject did not fix it, and the record is explicit that it did not.** §4.15 found E4
**OBTAINABLE** on Python's `sqlite3` binding **and ADVERSE**: unauthorized passage text **bound as a
parameter** appeared **verbatim** in the trace, because *"the trace emits the EXPANDED statement."*
**GAP-B was not withdrawn** — *"those measurements do not acquire E4 evidence because a different
subject has a trace surface."*

**So the open question is not whether a surface exists. It is whether a surface exists that PASSES**,
on a subject that can also carry the Shape-1 measurements. **EV5: *"an engine that cannot supply EV5
cannot be selected under any topology."***

## Objective

Establish, by enumeration with controls, whether a **reachable** test subject supplies **E4 that is both
OBTAINABLE and NON-ADVERSE** — and whether such a subject can carry the Shape-1 measurement apparatus
the existing evidence used.

**A finding that none does is a complete and valid outcome.** It must be reported as such, not as a
failure of the task.

## Required outcomes

1. **Enumerate the reachable subjects** — engine build **and** language binding stated separately for
   each, as §4.15's table does. **The binding is the variable that changed E4's obtainability last
   time**, so it is enumerated, never assumed.
2. **For each subject, determine E4 obtainability by enumeration against a control.** The
   **nonexistent-pragma control (F15)** is the standard: without it *"the instrument reported nothing"*
   and *"the instrument was never running"* are the same observation. **Run every instrument disarmed
   before armed**, as §4.15 did, and record both.
3. **For each obtainable surface, inspect it for unauthorized passage text and report ADVERSE or
   NON-ADVERSE.** Reproduce §4.15's specific probe: **pass unauthorized text as a BOUND PARAMETER** and
   check whether it appears expanded in the surface. **A surface that survives that is not thereby
   clean** — test inlined text and any other reachable path too.
4. **For each obtainable surface, state §4.15's C1–C4 explicitly**, including **C4 — does the surface
   record what the engine EXAMINED, or only the instruction?** A per-statement surface **cannot measure
   `U`, is not E2, and cannot substitute for an S7 placement.**
5. **State whether a non-adverse subject, if any, can carry the Shape-1 apparatus** — the placements,
   counters and plan access §4.6 S6/S7 require. **A subject that supplies E4 but cannot carry E1/E2
   discharges GAP-B for nothing.**
6. **Report per subject, in §4.6 S9's existing vocabulary. Do not invent verdict terms.**
7. **Record COMMS, status, queue, checkpoint, harness/output, and verification from `main`.**

## Constraints

- **No engine, runtime, binding or index technology is selected, adopted, preferred, ranked, deployed,
  implemented or cleared.** **Choosing a test subject is not choosing a product** (MSG-0141).
- **No generalization from one subject to an engine class** — §4.6 S10, §4.12's standing prohibition,
  and §4.15's *"binding, not the build"*.
- **No change to E1–E4, S1–S11, DA-1…DA-7, N1–N6, G-Q4…G-Q7.8, strict Shape-1 or any clearance gate.**
  **E4 may NOT be weakened, reinterpreted or narrowed to let a subject pass.** MSG-0119: failure does
  not authorize weakening the gates.
- **No candidate verdict changes.** All six §4.14 candidates remain NOT CLEARED, and **no candidate
  gains E4 evidence from this task** — the subjects here are instruments.
- **Unobtainable is NOT relief.** An absent evidence class is **NOT CLEARED** by rule (§4.6 S6, EV5).
- **Fail closed.** An uninspectable surface is not a clean one; *"we looked and found nothing"* is not
  *"nothing was written"*.
- **Do not re-run TASK-0043's probe and report its output as new evidence.** §4.15 is the **basis**;
  this task must measure beyond it.
- **A negative control's finding may never be reported as a finding about the subject** — MSG-0156.

## The referral this task must make rather than resolve

**§4.15's adverse result came from a statement trace, and it failed BECAUSE it expands the statement.**
**Whether obtainability and adversity are separable for that class of surface is NOT established.**

**If the evidence suggests they are inseparable — that any surface able to satisfy E4 necessarily
carries expanded statement text — REFER IT. Do not act on it, and do not conclude the gate is
unsatisfiable.** That conclusion would bear on the clearance bar itself and **belongs to the
Architecture Lead.**

## Stop conditions

**Stop and record a BLOCKER — do not route around it — if the work would require:**

- **installing a runtime, interpreter or engine build**, or **compiling with different flags**;
- **any host or environment change**, or privilege not already granted;
- **operator action beyond the existing grants**;
- **changing any gate, criterion, invariant or verdict**;
- **selecting, adopting, clearing, deploying or implementing an engine**.

**BLK-0008, BLK-0010 and BLK-0011 are the precedents, and this task is the most likely in the programme
to hit one** — discharging GAP-B may simply require a build or binding that is not present. **That is a
blocker to record and report, not a problem to solve locally.** A recorded blocker here is a **useful
result**: it tells the Lead exactly what the programme needs from the operator.

**Also stop if `origin/main` moves mid-run.** Record the starting `HEAD` in checkpoint 1.

## Execution boundary

This task is **not executable** until it appears as the **single READY task** in the authoritative
`implementation/operations/CLAUDE-TASKS.md` queue.

**Numbering:** MSG-0167 is this authorization; **use MSG-0168 or later** for the execution record, and
check `implementation/comms/README.md` first — **ten numbers are already doubly claimed.**
