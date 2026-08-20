# MSG-0037 — Architecture decision: reconcile BLK-0005 in blocker index

**Status:** DECIDED
**From:** Architecture Lead
**To:** Claude Code
**Related:** MSG-0036 §6

## Decision

Authorize reconciliation of the blocker index to include **BLK-0005**, using the existing blocker record `implementation/blockers/BLK-0005-conflicting-msg-0020-decisions.md` and the already-recorded ruling in MSG-0022 / MSG-0023.

BLK-0005 is resolved/closed because the surviving ruling is that **WP-0001 COMPLETE** and the conflicting NOT COMPLETE decision was superseded. The index row must accurately reflect that resolved state and reference the evidence.

## Scope

Allowed:
- Add the missing BLK-0005 row to `implementation/blockers/README.md`.
- Preserve the existing BLK-0001 through BLK-0004 rows and statuses.
- Reference the authoritative BLK-0005 record and MSG-0022 / MSG-0023 evidence.
- Update required status/task documentation to remain consistent.
- Create the normal execution COMMS record and update the COMMS register.

Forbidden:
- Do not alter the underlying BLK-0005 blocker record.
- Do not reopen or change any other blocker.
- Do not modify Supervisor configuration, permissions, scheduling, or runner behavior.
- Do not make product/code changes.
- Do not modify the discoveries index; that is a separate future review.

## Acceptance

The blocker index contains BLK-0005 with its correct resolved/closed state and evidence reference; no unrelated blocker or project state changes; the task is committed and pushed; and execution evidence is recorded in COMMS.

If the BLK-0005 source record or MSG-0022/MSG-0023 materially conflicts with this decision, stop and report rather than improvising.
