# PCI Server Bootstrap Contract

**Status:** Accepted implementation contract
**Version:** 0.2
**Last amended:** 2026-08-19 — absolute host file boundary and mandatory source workspace

## Target Host

The initial PCI implementation target is the customer-controlled Ubuntu Server identified in the deployment environment configuration. Claude Code connects using the dedicated `claude` operating-system account and the dedicated PCI server SSH key.

The exact host address is intentionally kept out of the repository.

## Absolute Host File Boundary

**This is a hard requirement, not a preference.**

On the PCI server, Claude must NOT create, clone, copy, extract, generate, compile, cache, or persist any PCI project artifact anywhere outside `/data`.

Required layout:

```text
/data/pci-platform/     <- Claude source workspace / Git working tree
/data/docker/           <- ALL runtime, application, and container persistent data
```

Nothing belonging to this project may be placed in:

```text
/home/claude/
/root/
/tmp/
/var/tmp/
/opt/
/usr/local/
/etc/          (except system configuration installed by the privileged bootstrap itself)
/var/lib/
/var/cache/
```

Before performing any operation on the PCI server:

1. Determine the intended destination path.
2. If the path is outside `/data`, **STOP**.
3. Do not create the file or directory.
4. Record the violation or risk in GitHub.

This boundary supersedes any earlier wording that permitted a source workspace outside `/data`.

### SSH exception

SSH's own operational files under `~/.ssh` are infrastructure credentials, not PCI application or project artifacts. They are outside the scope of this boundary. Do not move, delete, or recreate SSH credentials in order to satisfy it.

## Mandatory Application Boundary

All PCI application, Docker, model, database, search, logs, configuration, and persistent service data MUST reside under:

```text
/data/docker
```

Do not create PCI application state under `/opt`, `/srv`, `/home/claude`, or arbitrary host paths.

## Source Workspace

The canonical server workspace is:

```text
/data/pci-platform
```

The Git working tree lives there and nowhere else. The workspace is a source location, not the application-data boundary; runtime and application state remain under `/data/docker`.

If `/data/pci-platform` does not exist, or is not writable by `claude`, **do not work around the restriction** — not by cloning elsewhere, not by using a temporary directory, and not by piping content into a shell. Record a blocker in GitHub requiring the operator to provision the workspace with appropriate ownership and permissions, and stop.

## Host Responsibilities

Claude may bootstrap the host when required by an active work package, including:

- required OS packages;
- Docker Engine;
- Docker Compose/plugin;
- required host configuration for PCI;
- creation of `/data/pci-platform` with ownership and permissions allowing `claude` to work in it;
- filesystem ownership and permissions for `/data/docker`;
- PCI-specific firewall/network prerequisites;
- time synchronization prerequisites;
- PCI service startup/health checks.

## Host Safety Boundary

Claude must not modify unrelated host infrastructure, RAID/storage configuration, boot configuration, kernel settings, unrelated services, or network infrastructure unless an explicit work package authorizes it.

Host-level changes must be documented in the implementation report.

## Docker Boundary

Docker is the initial application isolation mechanism. PCI services should run as containers wherever practical. Persistent Docker data must use explicit paths below `/data/docker` rather than uncontrolled container writable layers.

Docker's `data-root` must be configured to `/data/docker` and **verified after installation**, so that image layers, container writable state, and named volumes all fall inside the boundary rather than only those paths that were explicitly bind-mounted.

## Bootstrap Sequence

The bootstrap must establish the required `/data` layout **before** installing or starting application services:

1. Verify `/data` is a real mount point.
2. Create and permission `/data/pci-platform` and `/data/docker`.
3. Install Docker Engine and Compose.
4. Configure and verify `data-root`.
5. Start services and run health checks.

## Auditability

The bootstrap script must exist as a repository artifact and be executed from the authorized `/data/pci-platform` workspace, unless the architecture lead explicitly authorizes another `/data` path.

Do not pipe the bootstrap script directly from the network, and do not execute it from an untracked temporary location. A bootstrap that leaves no artifact on the host leaves no evidence of what was run.

## Bootstrap Principles

- Bootstrap must be repeatable.
- Installation must be observable and verifiable.
- Secrets must not be committed or embedded in images.
- Configuration must be reproducible.
- Destructive host changes require explicit authorization.
- A failed bootstrap must leave enough evidence to diagnose and retry safely.
- No PCI artifact of any kind is created outside `/data`.

## Acceptance Criteria

A clean supported Ubuntu host can be prepared for PCI by Claude Code; `/data/pci-platform` exists and is writable by `claude`; Docker is installed and healthy with `data-root` verified as `/data/docker`; required prerequisites are verified; and **no PCI runtime data and no PCI project artifact of any kind is placed outside `/data`**.
