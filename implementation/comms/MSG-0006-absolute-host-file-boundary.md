# MSG-0006 — Absolute Host File Boundary (Architecture Lead Override)

**Status:** DECIDED — 2026-08-19. Documentation correction applied; implementation held pending review.
**From:** PCI architecture lead
**Work package:** WP-0001 — PCI Kernel Foundation
**Amends:** `docs/operations/pci-server-bootstrap.md` (v0.1 → v0.2)

## What happened

While preparing to bootstrap the authorized host, Claude Code cloned the repository to
`/home/claude/pci-platform` and, in doing so, created `/home/claude/.ssh/known_hosts`.

The wording then in force — contract v0.1, "Repository Boundary" — read:

> The Git working tree may be located in the Claude user's home directory or another explicitly
> designated source workspace. This source workspace is not the application-data boundary.
> Runtime/application state remains under `/data/docker`.

The clone was consistent with that clause. The operator judged the operational requirement to be
stricter than the clause allowed, and issued a hard boundary override.

**The clone and the `known_hosts` file it created have been removed.** `/home/claude` is back to
its prior contents. No packages were installed, no services started, and nothing was ever written
to `/data`.

## Decision — absolute host file boundary

On the PCI server, Claude must NOT create, clone, copy, extract, generate, compile, cache, or
persist any PCI project artifact anywhere outside `/data`. This is a hard requirement, not a
preference.

Required layout:

```text
/data/pci-platform/     <- Claude source workspace / Git working tree
/data/docker/           <- ALL runtime/application/container persistent data
```

Forbidden for any project artifact: `/home/claude/`, `/root/`, `/tmp/`, `/var/tmp/`, `/opt/`,
`/usr/local/`, `/var/lib/`, `/var/cache/`, and `/etc/` except system configuration that the
privileged bootstrap must install.

Procedure before any host operation: determine the destination path; if it is outside `/data`,
stop, do not create it, and record the risk in GitHub.

**Workspace provisioning is not to be worked around.** If `/data/pci-platform` does not exist or
is not writable by `claude`, the required response is a blocker in GitHub asking the operator to
provision it — not a clone elsewhere, not a temporary directory, not piping a script into a shell.

**SSH exception.** Files under `~/.ssh` are infrastructure credentials, not project artifacts.
They are out of scope for this boundary and must not be moved, deleted, or recreated to satisfy
it. (Noted against the removal above: `known_hosts` was deleted because this session had created
it minutes earlier and it contained nothing else. Under the exception as now written, that file
would have been left alone.)

**Auditability.** The bootstrap script must exist as a repository artifact and run from
`/data/pci-platform`, unless another `/data` path is explicitly authorized. It must not be piped
from the network or executed from an untracked temporary location.

## Applied

| File | Change |
|---|---|
| `docs/operations/pci-server-bootstrap.md` | v0.1 → **v0.2**. New *Absolute Host File Boundary* section with the forbidden-path list, stop procedure, and SSH exception. New *Source Workspace* section making `/data/pci-platform` mandatory and forbidding workarounds. New *Bootstrap Sequence* (layout before services) and *Auditability* sections. `data-root` verification made explicit. Acceptance criteria extended to cover the workspace and the no-artifact-outside-`/data` rule. The permissive v0.1 Repository Boundary clause is superseded and removed. |
| `deploy/bootstrap/pci-server-bootstrap.sh` | New step 2 creates `/data/pci-platform`, chowns it to `claude`, and verifies writability — before Docker is installed. Header documents the boundary; invocation path corrected to `/data/pci-platform/...`; workspace ownership added to the evidence block. |
| `implementation/blockers/BLK-0004-...` | Stale `~/pci-platform` invocation corrected; workspace provisioning added to the required operator action. |
| `implementation/status/current.md` | Boundary and workspace recorded; next action updated. |

## A note on the contract change itself

`docs/operations/pci-server-bootstrap.md` is an accepted architecture document, and the operating
rules forbid Claude Code from silently changing one. This amendment was made **only** because the
architecture lead directed it explicitly, and this message exists so the change is traceable to
that instruction rather than to implementation judgement. The wording follows the directive as
given; nothing was added beyond it except the first-run note below, which is an implementation
detail rather than a policy choice.

## One implementation detail the directive leaves open

The bootstrap script must live in `/data/pci-platform` and run from there, but `/data/pci-platform`
is created *by* the bootstrap script, and `claude` cannot create it — `/data` is `root:root`.

For the first run only, one of these is needed:

- the operator creates `/data/pci-platform` owned by `claude`, after which Claude Code clones the
  repository into it and the script runs from the authorized path thereafter; or
- the operator runs the script once from their own copy, which provisions the workspace as step 2.

Either satisfies the boundary. Claude Code will not resolve this by placing a copy outside `/data`.
The blocker is recorded in BLK-0004.

## Status

Implementation is **stopped**, per instruction. Docker was not installed, the host was not
bootstrapped, `/data/pci-platform` was not created, and the host has not been modified since the
clone was removed. Awaiting architecture-lead review of this correction.
