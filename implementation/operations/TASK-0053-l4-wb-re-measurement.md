# TASK-0053 — re-measure the L4 append arm against a deliberately strong history

**Authority:** **MSG-0172 §4**; MSG-0158 (TASK-0046), MSG-0163 (TASK-0048), MSG-0164 §5.
**Type:** Bounded evidence / measurement.
**Status:** **AUTHORIZED — NOT READY.** Sequenced after TASK-0052. It becomes READY only when the
Architecture Lead reconciles it into the queue as the single READY task.

## The contradiction this exists to settle

**Two runs of the same nominal arm disagree.**

| | TASK-0046 (MSG-0158) | TASK-0048 (MSG-0163) |
|---|---|---|
| L4 residue pages | **10**, each at `UNAUTH ×15` | **1** |
| L4 append (W-B) finding | **leaked, 15 occurrences** | **no finding, in any topology** |

**MSG-0163 §4 proposed a cause and refused to assert it:** an append can only expose residue if it
consumes a residue page, and with one such page the odds are small. **It called its own silence
*"silence, not exoneration"*, which is an honest holding position and not a resolution.**

**The hypothesis has never been tested.** The record currently supports either reading, and **DA-5
row 3 governs: absence is not sufficient alone.**

## Objective

**Test the hypothesis directly**: construct an L4 fixture with a **deliberately large** residue
population, run the append shape against it, and establish whether the leak reproduces as a function
of residue density.

## Required outcomes

1. **Residue population is a controlled variable, not an accident.** Measure at **no fewer than three
   residue densities**, including one at or above TASK-0046's ten pages and one at TASK-0048's single
   page. **Report the residue count for every cell** — it is the variable under test.
2. **Both journal modes and both request-induced write shapes**, as MSG-0158 and MSG-0163 used, so the
   result is comparable to both.
3. **Provenance established before any finding is assigned** — a history-sourced finding requires
   **zero live unauthorized rows**, as MSG-0163 did.
4. **Negative controls MUST GATE THE RUN, not merely be reported.** **MSG-0169 §2 is the standing
   correction**: TASK-0048's harness printed its controls and did not enforce them. **This harness
   must `fail()` and mark the run INVALID when a control does not fire**, as TASK-0048's *predecessor*
   did. **A printed line is a claim; an abort is an interlock.**
5. **State plainly whether the hypothesis is CONFIRMED, REFUTED, or UNRESOLVED**, and **do not round
   an unresolved result to either.**
6. **Reconcile the two prior runs explicitly.** If residue density explains the divergence, say so and
   say what that means for MSG-0158's and MSG-0163's standing. **If it does not, that is a more
   important finding and must be referred, not explained away.**
7. **COMMS, status, queue row, checkpoint, harness and output recorded**, verified from `origin/main`.

## Constraints

- **This does not re-open, weaken or supersede either prior record.** Both stand as taken. **This run
  measures a variable neither controlled.**
- **No engine selected, adopted, deployed, implemented or cleared.** **No generalization beyond the
  measured subject and build** (§4.6 S10).
- **No change to N1–N6, DA-1…DA-7, E1–E4, EV1–EV13, G-Q4…G-Q7.8, strict Shape-1 or any gate.**
- **No candidate verdict changes.**
- **A negative control's finding may never be reported as a finding about the subject** — MSG-0156.
- **Fail closed** where an artefact or residue cannot be inspected (DA-6).
- **If it needs an install, a different build, or any host change: record a BLOCKER and STOP**, with
  the five items MSG-0173 §1 requires. **Do not route around it.**
- Stop if `origin/main` moves mid-run.
