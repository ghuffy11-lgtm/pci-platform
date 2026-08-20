# TASK-0015 — Discoveries index reconciliation

**Status:** READY — authorized by MSG-0039
**Owner:** Claude Code
**Depends on:** TASK-0014, MSG-0039

## Objective
Reconcile `implementation/discoveries/README.md` with the actual set of `implementation/discoveries/DISC-*.md` records.

## Allowed
- Enumerate all discovery records.
- Add missing index rows using the underlying records as source of truth.
- Correct unambiguous stale index metadata.
- Preserve discovery records unchanged.
- Record verification in COMMS and update required task/status documentation.
- Commit and push the result.

## Forbidden
- No discovery-record content changes.
- No deletion or renumbering of discoveries.
- No blocker changes.
- No Supervisor/permission/scheduling/runner changes.
- No product/code changes.
- No historical COMMS renumbering.
- No destructive commands or credential access.

## Stop conditions
Stop and report in COMMS if any discovery's title/status is ambiguous or contradictory, if an index-only entry cannot be safely resolved, or if anything outside this scope is required.

## Success gate
The index accurately represents every `DISC-*.md` file, all changes are verified against the underlying records, and execution evidence is committed/pushed.
