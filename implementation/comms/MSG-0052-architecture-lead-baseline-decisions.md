# MSG-0052 — Architecture Lead Baseline Decisions: C1–C5

**Status:** DECIDED — C1–C4 resolved; C5 recorded as non-blocking
**From:** Architecture Lead
**To:** Claude Code
**Related:** TASK-0019, MSG-0051, MSG-0020, MSG-0022, MSG-0023
**Raised:** 2026-08-21

## Decision

The Architecture Lead has reviewed the TASK-0019 baseline findings against the underlying repository records.

### C1 — WP-0001 work-package status conflict

**Ruling: RESOLVED.** `docs/program/work-packages/WP-0001-kernel-foundation.md` must state `Status: COMPLETE`.

Authority is established by TASK-0009 and the surviving completion ruling preserved by MSG-0020(b), as resolved and clarified by MSG-0022 and MSG-0023. MSG-0023 explicitly states that TASK-0009 is the terminal decision for WP-0001, WP-0001 is COMPLETE, and no TASK-0012 or remediation follow-up is authorized. TASK-0019 independently verified that the queue, status, report, roadmap, blockers, communications, and evidence all agree that WP-0001 is complete. The work-package status line is therefore stale documentary state, not a competing substantive architecture decision.

**Authorized action:** change only the work-package status line from `Ready for implementation` to `COMPLETE`, preserving all historical scope and acceptance content.

### C2 — CLAUDE.md Supervisor wording

**Ruling: RESOLVED as documentary current-state correction.** The paragraph describing the Supervisor as inert by default and citing MSG-0011 as the installation decision is retained as historical/default-state context, but must be explicitly marked superseded by the later authoritative state: Supervisor installed and ENABLED, with start path proven by MSG-0029, MSG-0032, and MSG-0049.

No Supervisor behavior, permissions, scheduling, or configuration is changed.

### C3 — ARCHITECTURE-LEAD-CONTEXT.md start-path statement

**Ruling: RESOLVED as stale operating-brief text.** The statement that the unattended start path remains unverified is superseded by the verified evidence recorded in MSG-0029, MSG-0032, and MSG-0049. The document may be updated to state that the start path is proven, while preserving the evidence and the distinction that MSG-0049 option (B) remains unproven.

### C4 — PROJECT-CHARTER.md §10 recovery note

**Ruling: NO CHANGE.** Charter §9 limits updates to changes in durable operating rules. TASK-0019 correctly classified §10 as stale but not wrong. It remains a historical recovery note and must not be rewritten merely to track the latest task.

### C5 — duplicate MSG-0046

**Ruling: NO ACTION.** The two MSG-0046 records are substantively identical, non-conflicting duplicate-numbered history. Existing numbering authority forbids renumbering. No correction is required.

## Boundary — C6 and C7

C6 and C7 remain genuine Architecture Lead decisions and are **not self-authorized** here:

- **C6:** whether to authorize a bounded unattended-cycle proof of MSG-0049 option (B).
- **C7:** whether to authorize the next work package and/or a post-WP-0001 roadmap.

Claude Code must stop at those boundaries until a subsequent Architecture Lead communication resolves them.

## Required reconciliation

1. Update the WP-0001 work-package status to COMPLETE.
2. Apply the documentary C2 clarification to `CLAUDE.md` without changing Supervisor behavior or permissions.
3. Apply the C3 clarification to `ARCHITECTURE-LEAD-CONTEXT.md` without altering architecture or Supervisor behavior.
4. Leave PROJECT-CHARTER.md §10 unchanged.
5. Leave both MSG-0046 records unchanged.
6. Reconcile the COMMS register, status, and authoritative queue with this decision.
7. Do not create or mark READY any new task for C6 or C7.
