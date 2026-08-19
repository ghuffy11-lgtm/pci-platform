# PCI Server Bootstrap Contract

**Status:** Accepted implementation contract
**Version:** 0.1

## Target Host

The initial PCI implementation target is the customer-controlled Ubuntu Server identified in the deployment environment configuration. Claude Code connects using the dedicated `claude` operating-system account and the dedicated PCI server SSH key.

The exact host address is intentionally kept out of the repository.

## Mandatory Application Boundary

All PCI application, Docker, model, database, search, logs, configuration, and persistent service data MUST reside under:

```text
/data/docker
```

Do not create PCI application state under `/opt`, `/srv`, `/home/claude`, or arbitrary host paths.

## Host Responsibilities

Claude may bootstrap the host when required by an active work package, including:

- required OS packages;
- Docker Engine;
- Docker Compose/plugin;
- required host configuration for PCI;
- filesystem ownership and permissions for `/data/docker`;
- PCI-specific firewall/network prerequisites;
- time synchronization prerequisites;
- PCI service startup/health checks.

## Host Safety Boundary

Claude must not modify unrelated host infrastructure, RAID/storage configuration, boot configuration, kernel settings, unrelated services, or network infrastructure unless an explicit work package authorizes it.

Host-level changes must be documented in the implementation report.

## Docker Boundary

Docker is the initial application isolation mechanism. PCI services should run as containers wherever practical. Persistent Docker data must use explicit paths below `/data/docker` rather than uncontrolled container writable layers.

## Repository Boundary

The Git working tree may be located in the Claude user's home directory or another explicitly designated source workspace. This source workspace is not the application-data boundary. Runtime/application state remains under `/data/docker`.

## Bootstrap Principles

- Bootstrap must be repeatable.
- Installation must be observable and verifiable.
- Secrets must not be committed or embedded in images.
- Configuration must be reproducible.
- Destructive host changes require explicit authorization.
- A failed bootstrap must leave enough evidence to diagnose and retry safely.

## Acceptance Criteria

A clean supported Ubuntu host can be prepared for PCI by Claude Code, Docker is installed and healthy, `/data/docker` is present with correct ownership and permissions, required prerequisites are verified, and no PCI runtime data is placed outside the mandatory boundary.
