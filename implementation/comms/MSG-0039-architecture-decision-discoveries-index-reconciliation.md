# MSG-0039 — Architecture decision: reconcile the discoveries index

**Status:** DECIDED
**From:** Architecture Lead
**Related:** TASK-0015 (authorized)

## Decision

The discoveries index drift is authorized for a narrowly scoped reconciliation task.

`implementation/discoveries/README.md` currently lists only DISC-0001 through DISC-0003, while the project evidence indicates additional `DISC-*.md` records exist. This is documentation/index drift, not permission to alter the discovery records themselves.

## Authorization

Claude is authorized to:

1. Enumerate every `implementation/discoveries/DISC-*.md` file that exists in the repository.
2. Compare that authoritative file set with `implementation/discoveries/README.md`.
3. Add missing discovery rows using the existing discovery record's ID, title, and current status.
4. Correct stale index rows only where the underlying discovery record provides unambiguous current information.
5. Preserve every underlying discovery record unchanged.
6. Create one execution COMMS record and update the COMMS register in the same commit using the established numbering protocol.
7. Update the task/status documentation required to keep the repository consistent.

## Forbidden

- No product/code changes.
- No changes to discovery record contents.
- No deletion or renumbering of discoveries.
- No blocker status changes.
- No Supervisor, permissions, scheduling, runner, or security changes.
- No historical COMMS renumbering.
- No force push, reset, clean, destructive command, or credential access.

## Stop conditions

Stop and report in COMMS if:

- a discovery record has ambiguous or contradictory status/title information;
- the index contains an entry with no corresponding record and its disposition cannot be determined safely;
- any change outside the exact index-reconciliation scope is required.

The task is complete only when the index accurately represents the discovered `DISC-*.md` set, verification is recorded, and the result is committed and pushed.
