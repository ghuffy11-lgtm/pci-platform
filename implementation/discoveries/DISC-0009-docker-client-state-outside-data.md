# DISC-0009 — Docker CLI Writes Client State to `/home/claude`, Outside the `/data` Boundary

**Status:** OPEN — boundary question for the architecture lead; mitigation proposed, not applied
**Raised:** 2026-08-19 (during TASK-0007 verification)
**Severity:** Low technically, but it touches a **hard** boundary rule
**Related:** contract v0.2 Absolute Host File Boundary, MSG-0006, TASK-0007

## Discovery

The TASK-0007 boundary check found 18 paths under `/home/claude` with today's timestamps. Broken
down, they are two different things:

### 1. OS-provided shell dotfiles — not PCI artifacts

```text
/home/claude/.bashrc  /home/claude/.profile  /home/claude/.bash_logout
```

Created with the account, not by this project. No action.

### 2. Docker CLI state — a genuine byproduct of PCI work

```text
/home/claude/.docker/buildx/{.lock,.buildNodeID,current,activity,defaults,instances}
/home/claude/.docker/buildx/refs/default/default/6vygmu7in326x7tj11bhaqsrf
/home/claude/.docker/buildx/refs/default/default/a40z3ibz8kfon20dqky5rn8s2
```

These were created by `docker compose build` while building the kernel images. They are **client**
state — builder references, a lock file, a node id — not project content: no source, no build
output, no configuration, no data, no credential.

But they exist **because of PCI work**, and they are in `/home/claude`, which contract v0.2 lists
among the forbidden paths with only an SSH exception.

## The question

Contract v0.2 forbids creating "any PCI project artifact" outside `/data`, and exempts `~/.ssh` as
infrastructure credentials rather than project artifacts.

`~/.docker` sits in the same category as `~/.ssh`: **tool state belonging to the account, created
automatically by a CLI, not content belonging to the project.** The parallel is close enough that
the existing exception's reasoning appears to cover it — but the contract names `~/.ssh`
specifically, not tool state generally, and I will not widen an explicit exception by inference.

Reported rather than resolved, and rather than quietly deleted: removing `~/.docker` would be a
change to the operator's account state to make a report look clean, which is the wrong instinct.

## Mitigation available, not applied

Docker honours `DOCKER_CONFIG`. Pointing it inside the boundary keeps all client state in `/data`:

```bash
export DOCKER_CONFIG=/data/pci-platform/.docker
```

If adopted it belongs in the bootstrap or in a documented environment file, so every session
inherits it rather than remembering it. `.gitignore` would need `.docker/` so the state is not
committed.

This is cheap and has no downside I can see. It is not applied because:

1. the boundary's scope is the architecture lead's to define, not mine to widen or narrow; and
2. TASK-0007's authorization is for verification, not for changing host or repository configuration.

## Recommended decision

One of:

- **A.** Extend the contract's exception to cover account-level tool state (`~/.docker`, and by the
  same reasoning any future CLI's dotfiles), keeping `~/.ssh` as a named example rather than the
  sole case. Nothing to change on the host.
- **B.** Keep the boundary literal and adopt `DOCKER_CONFIG=/data/pci-platform/.docker`, with a task
  to set it in the bootstrap and to remove the existing `~/.docker` directory once nothing depends
  on it.

**B is the stricter reading and the one that keeps the rule simple to check** — "nothing of ours
outside `/data`, full stop" is much easier to verify than a list of tolerated exceptions. A is less
work and arguably already the intent.

Either way this should be settled explicitly, because the boundary check is now part of routine
verification and will keep reporting these files until it is.
