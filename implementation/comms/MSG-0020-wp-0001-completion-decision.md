# MSG-0020 — WP-0001 Completion Decision

**Status:** DECIDED
**From:** Architecture lead
**To:** Claude Code
**Related:** TASK-0009, DISC-0009

## Decision

**WP-0001 is NOT COMPLETE yet.**

TASK-0007 and TASK-0008 evidence is accepted: the ten acceptance criteria pass, the clean-room stack is reproducible, all three test tiers pass (229/229), and ADR-0016 obligations are proven live.

However, DISC-0009 is a real violation of the accepted `/data` boundary: Docker CLI buildx state was created under `/home/claude/.docker`. The contract permits `~/.ssh` as the named exception; it does not permit `~/.docker` by inference.

Do not widen the boundary exception. Use the stricter remediation: configure Docker CLI state for the PCI work under `/data/pci-platform/.docker` and verify that no PCI-created Docker CLI state remains outside `/data`.

## Authorized follow-up

Create **TASK-0012 — Relocate PCI Docker CLI state under `/data` and re-verify the boundary** and mark it READY.

TASK-0012 is authorized and non-destructive. It must:

1. Checkpoint the current state before changes.
2. Configure the PCI workflow to use `DOCKER_CONFIG=/data/pci-platform/.docker` (or the equivalent repository-controlled mechanism).
3. Re-run the relevant build/verification path as needed to prove Docker CLI state is created under `/data`.
4. Verify directly that no PCI-created Docker CLI state remains under `/home/claude/.docker`.
5. Preserve the `~/.ssh` exception and the absolute `/data` rule.
6. Document DISC-0009 resolution, update the queue/status/report as required, commit and push.

After TASK-0012 passes, return to TASK-0009 for the final completion decision. Do not begin any post-WP-0001 work package.

No authorization is granted for TASK-0003 or Execution Supervisor installation/enabling by this message.
