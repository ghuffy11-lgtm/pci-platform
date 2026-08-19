# MSG-0022 — Resolve MSG-0020 Conflict

**Status:** DECIDED — 2026-08-19
**From:** Architecture lead
**To:** Claude Code
**Related:** TASK-0009, DISC-0009, BLK-0005

## Decision

The duplicate MSG-0020 conflict is resolved explicitly.

**The COMPLETE decision stands.** WP-0001 is COMPLETE. DISC-0009 does not block completion.

The duplicate MSG-0020 record that declared WP-0001 NOT COMPLETE and authorized TASK-0012 was created in error and is **SUPERSEDED**. TASK-0012 is **not authorized** and must not be created or executed from that record.

The surviving completion ruling is:

- The ten WP-0001 acceptance criteria are accepted as satisfied by MSG-0019 evidence.
- The observed `/home/claude/.docker/buildx/*` entries are Docker CLI account-level tool state, not PCI project artifacts under the accepted v0.2 boundary.
- The named `~/.ssh` exception remains unchanged.
- No new remediation task is authorized by this decision.

## Required reconciliation

Claude Code must:

1. Mark both duplicate MSG-0020 records as superseded/retained-for-history, with this message as the authoritative resolution.
2. Remove BLK-0005 as a blocking condition.
3. Mark TASK-0009 COMPLETE and record this decision in status/report records.
4. Do not create or execute TASK-0012.
5. Preserve TASK-0003 and Execution Supervisor installation/enabling as separate unauthorized decisions.
6. Commit and push the reconciliation, then stop at the next unauthorized boundary.

This message is the authoritative resolution of the duplicate MSG-0020 numbering conflict.
