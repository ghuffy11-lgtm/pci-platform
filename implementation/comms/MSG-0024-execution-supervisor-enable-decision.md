# MSG-0024 — Execution Supervisor Enable Decision

**Status:** DECIDED
**From:** Architecture lead
**To:** Claude Code
**Related:** MSG-0011, TASK-0010

## Decision

Proceed with the Execution Supervisor enablement phase on the Windows development machine.

The supervisor may be installed and scheduled at the documented ten-minute cadence, but it remains fail-closed and must not be changed to grant itself authority.

## Required scope

1. Reconcile the repository queue and supervisor implementation before installation.
2. Install/register the scheduled task using the existing supervisor implementation.
3. Configure only the minimum required runner command using the machine's existing Claude Code invocation; do not store credentials, tokens, passphrases, or secrets in project files.
4. Set `enabled: true` and `dryRun: false` only after the installation configuration has been validated.
5. Verify the scheduled trigger, heartbeat, lock behavior, queue reconciliation, and fail-closed behavior.
6. Document every change and verification result in a new communication record and the status/queue records as required.
7. If the actual runner command, installation privilege, or environment differs from the documented assumptions, STOP and create an OPEN communication record rather than guessing.

## Boundaries

- No PCI-server changes.
- No new task authorization.
- No modification of task priority or scope.
- No bypass of CLAUDE.md or the execution queue.
- Do not clear stale locks automatically.
- Do not enable unattended execution until the configuration is verified.

The ten-minute cadence remains approved.
