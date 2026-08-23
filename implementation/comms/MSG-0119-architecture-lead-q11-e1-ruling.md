# MSG-0119 — Architecture Lead Ruling: Q11 Strict E1

**Status:** DECIDED
**Authority:** Architecture Lead
**Related:** MSG-0118 TASK-0038 execution record; EPA-0006 §4.6 S6/E1

## Q11 ruling

The strict interpretation applies: **an exact-key seek into a scope-spanning structure does not satisfy E1**, even when the seek ultimately touches only an authorized row.

EPA-0006 §4.6 S6/E1 requires confinement to a structure or region **every entry of which** satisfies the authorization predicate. A seek does not change the authorization scope of the underlying structure.

## Consequences

- K3 and K4 remain **NOT CLEARED** under the strict reading.
- The ruling is fail-closed: it withholds clearance and does not relax any security requirement.
- K7 and K8 are unaffected by this ruling because their version and chunk stores are physically partitioned and satisfy E1 under both readings recorded by MSG-0118.
- No engine, runtime, provider, model, index technology, implementation, or deployment is selected or authorized.
- Existing strict Shape-1, U=0, E1–E4, G-Q4 and related clearance requirements remain unchanged.

## Next authorized action

Authorize a bounded evidence task focused on the remaining clearance gaps for the physically partitioned K7/K8 class, particularly E4 and the observability limitation around index-entry examination. The task must not assume that the tested engine's planner behavior generalizes to another engine and must not select or deploy an engine.

The task stops at evidence and clearance status; failure does not authorize weakening the existing gates.
