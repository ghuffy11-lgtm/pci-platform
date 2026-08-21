# MSG-0068 — TASK-0024 Authorization: EPA Required ADR Drafting

**Status:** AUTHORIZED
**Authority:** Architecture Lead
**Related:** MSG-0067, TASK-0023, WP-0009 §6.2 and §7

## Decision

TASK-0024 (A-ADR) is **AUTHORIZED** as the next bounded Architecture Lead task for WP-0009.

## Rationale

WP-0009 §6.2 defines A-ADR as a required architecture task before implementation. MSG-0062 §7.2 requires the minimum ADR set needed to make the accepted architecture enforceable, while preserving accepted ADRs and avoiding duplicates. MSG-0067 resolved the remaining carried-forward architecture decisions and therefore removes the prior decision boundary.

A-ADR is sequenced before implementation task T-A because WP-0009 §6.3 makes A-ADR a prerequisite for T-A, and the queue explicitly requires architecture tasks to be separately authorized and reconciled.

## Boundaries

- Architecture/documentation only.
- No implementation.
- No provider, model, embedding, framework, or runtime selection.
- No permissions, security-boundary, Supervisor, or scheduling changes.
- Do not modify accepted ADRs.
- Do not mark downstream implementation tasks READY.
- Allocate ADR numbers only if and when drafting requires new ADRs, using repository convention.

## Required result

Evaluate the six ADR surfaces in WP-0009 §7 against accepted ADRs, create only the required new ADRs, preserve accepted ADRs, and report evidence through COMMS. If an unresolved architecture conflict is found, stop at that boundary rather than improvising.

## Queue gate

TASK-0024 must be reconciled into the authoritative execution queue as the **single READY task** before Claude Code may execute it. This authorization does not by itself mark the task READY.
