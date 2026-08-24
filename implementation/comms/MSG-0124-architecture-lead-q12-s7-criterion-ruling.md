# MSG-0124 — Architecture Lead Q12 Criterion Ruling

**Status:** DECIDED
**Authority:** Architecture Lead
**Related:** MSG-0123 (TASK-0039 execution), EPA-0006 §4.6 S7, MSG-0105/TASK-0034 precedent

## Q12 decision

Adopt the strict evidence interpretation already decided by the Architecture Lead:

> When the engine exposes a reachable index-cursor placement, the probe must exercise that placement in addition to other applicable placements and report the maximum observed result. A row-access-only `U = 0` is not sufficient to satisfy E2 when an index-cursor placement exists but has not been exercised.

This is a criterion decision, not an engine selection and not an implementation authorization.

## Consequences

- The existing strict Shape-1 / E2 bar is not relaxed.
- A probe that omits a reachable index-cursor placement cannot clear a candidate on the basis of row-access-only `U = 0`.
- The maximum observed result across exercised applicable placements remains the evidence reported for the criterion.
- Existing MSG-0123 verdicts are unchanged: K7 and K8 remain NOT CLEARED.
- No engine, runtime, provider, model, index technology, implementation, or deployment is selected or authorized.

## Authoritative update mechanism

The repository precedent is TASK-0034 / MSG-0105: an Architecture Lead criterion decision is followed by a bounded execution task that updates the evidence criterion/probe specification in EPA-0006, without modifying an accepted ADR. TASK-0034 recorded the criterion update as additive and verified the resulting EPA-0006 change.

Q12 therefore requires the same mechanism. EPA-0006 §4.6 S7 must be updated by a dedicated authorized task; it must not be silently edited as part of this decision record.
