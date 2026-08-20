# MSG-0039 — Architecture Decision: reconcile discoveries index

**Status:** DECIDED  
**From:** Architecture lead  
**To:** Claude Code  
**Related task:** TASK-0015

## Decision

Authorize TASK-0015 to reconcile `implementation/discoveries/README.md` with the actual `DISC-*.md` records present in `implementation/discoveries/`.

## Scope

- Enumerate the actual `DISC-*.md` files in `implementation/discoveries/`.
- Reconcile the README index so every existing discovery record is represented exactly once with an accurate title and current status.
- Do not invent discoveries, delete discovery records, or alter discovery substance.
- Do not change architecture decisions, blockers, product/code, Supervisor configuration, permissions, scheduling, or repository history.
- Preserve existing accurate rows and statuses.
- Create exactly one COMMS execution record for the task using the established numbering protocol and reconcile the register in the same commit.
- Mark TASK-0015 COMPLETE only after direct verification and committed/pushed evidence.

## Stop conditions

Stop and report in COMMS if a discovery record materially conflicts with its index entry in a way that requires architectural judgment, if a record is malformed or missing required identity/status information, or if work outside this scope is required.

## Rationale

The project state previously recorded a drift between the discoveries index and the discovery files. This is documentation reconciliation and does not reopen WP-0001 or authorize product work.
