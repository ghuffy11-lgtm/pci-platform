# MSG-0130 — TASK-0041 Authorization: Q3 Architecture Response

**Status:** AUTHORIZED / READY
**Authority:** Architecture Lead via MSG-0129
**Related:** MSG-0129, MSG-0128, EPA-0006 §4.7 Q3, §4.6, §4.8

## Objective

Execute a bounded architecture/evidence task to define and evaluate the next technology-agnostic retrieval topology required by Q3 after the current candidates remain NOT CLEARED under strict Shape-1.

The task must identify the minimum architectural properties needed to make a future retrieval candidate capable of satisfying the existing gates, with particular attention to physical candidate-set confinement, routing, lifecycle/version state, opaque-stage confinement, and the requirement that unauthorized examination be zero.

## Required work

1. Re-read EPA-0006 §4.6–§4.8 and the actual Q3 authority in MSG-0129.
2. Reconcile all prior evidence without relabelling K7/K8 or any other candidate.
3. Define technology-agnostic retrieval-topology patterns that could satisfy the existing strict Shape-1 gates.
4. Map each pattern to E1–E4 and G-Q4/G-Q5/G-Q6, identifying which properties are structurally necessary and which require execution evidence.
5. Identify the minimum evidence needed before any future engine-selection task could be authorized.
6. Produce a bounded architecture recommendation or preserve the architecture choice as open if evidence is insufficient.

## Boundaries

- No engine/runtime/provider/model/index technology selection.
- No implementation or deployment.
- No accepted ADR modification.
- No weakening of strict Shape-1, `U = 0`, E1–E4, Q4–Q12 or existing security gates.
- No real or confidential corpus.
- No invented benchmark, latency, capacity, recall or throughput figures.
- Do not claim that a structural design clears a gate where execution evidence is required.
- Do not generalize observed planner behaviour from `node:sqlite` to an engine class.

## Acceptance

The task is complete only when the architecture response to Q3 is explicitly documented, the remaining clearance requirements are mapped, prior verdicts remain unchanged, and the repository contains no engine-selection or implementation authorization.

If the evidence cannot establish a topology capable of satisfying the existing gates, record the architecture gap and keep selection blocked. Failure does not authorize relaxing the gates.
