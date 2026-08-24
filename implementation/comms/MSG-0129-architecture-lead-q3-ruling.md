# MSG-0129 — Architecture Lead Ruling: Q3

**Status:** DECIDED
**Authority:** Architecture Lead
**Related:** MSG-0116a/b, MSG-0118, MSG-0119, MSG-0123, MSG-0128, EPA-0006 §4.7 Q3

## Q3 ruling

Q3 asks what the architectural response is if no engine class can satisfy the existing strict Shape-1 clearance gates.

The response is **not to relax the bar and not to select the least-bad engine**. If the remaining candidate classes cannot satisfy strict Shape-1, the project remains **NOT CLEARED** for retrieval-engine selection and returns to architecture work to define a retrieval topology that can satisfy the existing gates.

The existing security criterion remains authoritative: `U = 0`, E1–E4, G-Q4/G-Q5/G-Q6 and the other recorded gates remain mandatory. Failure of all tested candidates is evidence that the architecture/technology space explored so far is insufficient; it is not authority to weaken AMD-01 or strict Shape-1.

## Scope of the ruling

- No engine, runtime, provider, model, index technology or product is selected, adopted, recommended, installed or deployed by this ruling.
- No accepted ADR is modified.
- Existing NOT CLEARED and DISQUALIFIED verdicts remain unchanged.
- K7/K8 remain NOT CLEARED; Q3 does not convert their partial evidence into clearance.
- The next architecture work is to define and evaluate a technology-agnostic retrieval topology capable of satisfying the existing strict gates, including physical candidate-set confinement where necessary, before any engine-selection decision.
- The architecture work must preserve the distinction between a logical projection and its physical organization and must not assume that a particular engine's planner behaviour generalizes to the class.

## Decision boundary

Q3 is now **ruled**. It does not authorize product implementation or engine selection. A future engine may be selected only after the existing clearance gates are positively satisfied with evidence.
