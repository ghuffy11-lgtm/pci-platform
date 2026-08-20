# TASK-0019 — Post-WP-0001 baseline audit

**Status:** READY
**Owner:** Claude Code
**Authorized by:** Architecture lead via MSG-0050
**Depends on:** TASK-0018

## Purpose

Establish a trustworthy post-WP-0001 baseline before any new product work is authorized. WP-0001 and the Supervisor validation chain are complete; this task audits the repository records for drift, stale status, contradictory task/COMMS statements, and unresolved maintenance findings so the architecture lead can choose the next work from evidence rather than assumption.

## Allowed actions

- Read the authoritative queue, ROADMAP, current status, COMMS register/messages, blocker index/records, discovery index/records, checkpoints, and accepted ADR/work-package records.
- Compare those records for contradictions, stale status, missing index entries, duplicate identifiers, unresolved decision requests, and references to work already completed.
- Create exactly one TASK-0019 execution/audit COMMS record using the next valid message number.
- Update queue/status/checkpoint documentation required to record TASK-0019 execution and result.
- Make purely documentary/index reconciliation corrections only when the correct value is directly established by an authoritative existing record and requires no architectural judgment.
- Commit and push the result.

## Forbidden actions

- No product, database, compose, Supervisor code/configuration, scheduling, permission, credential, infrastructure, or host changes.
- No new architecture, ADR, work package, feature scope, or product task authorization.
- No destructive commands, repository reset/clean, force push, privilege escalation, or manual Supervisor trigger.
- Do not rewrite historical evidence merely because a later record superseded it; use additive corrections where needed.
- Do not resolve a substantive conflict that requires architecture-lead judgment; report it instead.

## Verification / success gate

TASK-0019 is COMPLETE only when:

1. The audit covers queue, status, COMMS, blockers, discoveries, checkpoints, roadmap/work-package completion references, and accepted architecture references.
2. Every discrepancy found is classified as either: corrected documentary drift; already-superseded historical state; or architecture-lead decision required.
3. Any safe documentary corrections are committed with evidence showing the authoritative source for each correction.
4. One execution/audit COMMS record summarizes the baseline and gives the architecture lead a prioritized list of legitimate next actions, without self-authorizing them.
5. The queue is reconciled and the result is pushed to `origin/main`.

## Stop condition

If the audit finds a material conflict between accepted architecture/work-package authority and current repository state, or any correction would require choosing between competing substantive interpretations, STOP that correction, preserve the evidence, record the conflict in COMMS, and leave the decision to the architecture lead.

## Recovery

This task is documentation/audit only. Record progress in `implementation/operations/checkpoints/TASK-0019.md`. On restart, verify existing commits and records before repeating any operation.