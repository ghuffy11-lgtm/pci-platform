# MSG-0120 — TASK-0039 Authorization: K7/K8 Clearance Evidence

**Status:** AUTHORIZED / READY
**Authority:** Architecture Lead via MSG-0119
**Related:** MSG-0118, MSG-0119, EPA-0006 §4.6–§4.11

## Scope

Evaluate the remaining strict Shape-1 clearance gaps for the physically partitioned K7/K8 class.

The evidence task shall focus on:

1. obtaining or explicitly establishing the missing **E4 engine-log evidence**;
2. addressing the **index-entry observability limitation** (`U1`) without claiming an unsupported zero;
3. determining whether the K7/K8 class can satisfy E1–E4 and G-Q4 with evidence that is independent of a single observed optimizer plan where required;
4. preserving the strict Q11 interpretation from MSG-0119;
5. preserving the existing requirement that unauthorized examination is disqualifying.

## Boundaries

- No engine/runtime/provider/model/index technology selection.
- No implementation or deployment.
- No relaxation of strict Shape-1, U=0, E1–E4, G-Q4, Q8, Q10, or Q11.
- Do not infer engine-log evidence that is unavailable.
- Do not claim `U1 = 0` when the test subject cannot observe index-entry reads.
- Do not generalize SQLite/`node:sqlite` planner behavior to other engines without evidence.
- Stop at evidence and clearance status.

## Acceptance

Produce per-candidate evidence and verdicts. Any required evidence that remains unobtainable results in **NOT CLEARED**, not an inferred pass.
