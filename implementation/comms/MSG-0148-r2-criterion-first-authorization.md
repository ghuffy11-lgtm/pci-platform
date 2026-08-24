# MSG-0148 — R2 Criterion-First Authorization

**Status:** AUTHORIZED — bounded criterion definition only
**Authority:** Architecture Lead decision following MSG-0147 and COMMS reconciliation commit 95d260e0

## Decision

Authorize defining the WAL/durability-artifact security criterion **before** running a dedicated WAL exposure evidence task.

The criterion must establish the security bar independently of the measurement. The later evidence task must measure against the already-authoritative criterion.

## Boundary

This task may:
- draft the precise security criterion for unauthorized policy content in engine-managed durability/persistence artifacts;
- define its scope, exclusions, evidence semantics, and fail-closed interpretation;
- record the criterion through the established architecture/COMMS mechanism.

This task may not:
- run the WAL exposure experiment;
- select, compare, adopt, deploy, or implement an engine;
- change E1–E4 or other existing clearance gates;
- weaken Shape-1;
- combine criterion creation and measurement in the same task.

## Success criteria

A bounded criterion record exists on `main`, is independently reviewable, and clearly states what durability-artifact exposure is prohibited and what evidence would satisfy or fail it. No measurement is performed under this authorization.
