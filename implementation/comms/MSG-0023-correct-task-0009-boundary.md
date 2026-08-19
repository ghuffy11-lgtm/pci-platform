# MSG-0023 — Correct TASK-0009 Boundary

**Status:** DECIDED
**From:** Architecture lead
**To:** Claude Code
**Related:** TASK-0009, MSG-0020, MSG-0021, MSG-0022

## Decision

The previous MSG-0020 conflict and the subsequent repository reconciliation incorrectly introduced TASK-0012 into the execution path.

**TASK-0009 is the terminal decision for WP-0001. WP-0001 is COMPLETE. No TASK-0012 is authorized, READY, or part of the WP-0001 sequence.**

The final completion ruling is the later MSG-0020 decision: DISC-0009 does not block WP-0001 completion because the observed `/home/claude/.docker/buildx/*` entries are Docker CLI account-level tool state, not PCI project artifacts. The accepted v0.2 boundary permits the named `~/.ssh` exception and does not create a blanket prohibition on all account-level tool state.

No remediation task is authorized by this decision. Any future change to Docker client state placement requires a separate architecture decision and task authorization.

## Required reconciliation

- TASK-0009 must be recorded COMPLETE.
- TASK-0012 must not be created, authorized, READY, or referenced as a required follow-up to WP-0001.
- MSG-0020(a), which proposed TASK-0012, remains historical and is SUPERSEDED.
- MSG-0020(b) is the surviving completion ruling; MSG-0022 is retained only as the historical conflict-resolution record.
- MSG-0021 is CLOSED by this decision.
- Claude Code must stop at the next unauthorized boundary and must not infer any post-WP-0001 work from these records.
