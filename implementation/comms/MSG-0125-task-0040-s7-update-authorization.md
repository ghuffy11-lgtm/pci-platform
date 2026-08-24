# MSG-0125 — TASK-0040 Authorization: Encode Q12 in EPA-0006 §4.6 S7

**Status:** AUTHORIZED / READY
**Authority:** Architecture Lead, MSG-0124
**Related:** MSG-0123, MSG-0124, EPA-0006 §4.6 S7, MSG-0105/TASK-0034

## Authorized task

Update EPA-0006 §4.6 S7 through the established TASK-0034 criterion-update mechanism so that the Q12 decision is explicit and testable.

The resulting S7 must require:

1. every reachable index-cursor placement exposed by the test subject to be exercised, in addition to other applicable placements;
2. the maximum observed result across the exercised applicable placements to be reported;
3. row-access-only `U = 0` to be insufficient for E2 when a reachable index-cursor placement exists but has not been exercised.

## Required method

- Preserve the existing strict Shape-1 and E1–E4 clearance bar.
- Make the update additive/declared in EPA-0006, following TASK-0034's precedent; do not silently rewrite unrelated text.
- Do not modify any accepted ADR.
- Preserve all existing verdicts and do not re-run prior probes merely because the criterion is being encoded.
- Reconcile the queue, COMMS register, and status consistently.
- Verify the post-change EPA-0006 content from `main` and record the exact change statistics.

## Forbidden

- No engine/runtime/provider/model/index technology selection.
- No implementation or deployment.
- No weakening of E2, strict Shape-1, U=0, E1–E4, G-Q4, Q8, Q10, or Q11.
- Do not claim that a row-access zero proves index-cursor zero.
- Do not create a numeric tolerance or threshold.

## Completion

Stop after the criterion/probe-specification update and its repository verification. The next evidence action, if any, must be separately authorized from the resulting COMMS state.
