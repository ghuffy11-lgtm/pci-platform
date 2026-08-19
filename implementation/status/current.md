# PCI Implementation Status

**Active Work Package:** WP-0001 — PCI Kernel Foundation
**Status:** READY_FOR_IMPLEMENTATION
**Last Updated:** 2026-08-19

## Current State

Architecture and documentation baseline is established. Permanent Claude Code operating rules are defined in `CLAUDE.md`. The initial server bootstrap contract is defined in `docs/operations/pci-server-bootstrap.md`.

## Implementation Environment

- Initial implementation host: customer-controlled Ubuntu PCI server.
- Implementation account: `claude`.
- Runtime/application data boundary: `/data/docker`.
- Container runtime: Docker.
- Host address: intentionally not stored in Git.

## Active Work Package

`implementation/work-packages/WP-0001-kernel-foundation.md`

## Communication Commands

- `GO` — continue the active work package.
- `STATUS` — inspect and update current implementation state.
- `COMMS` — inspect implementation communication artifacts.
- `CHECK` — verify tests and acceptance criteria.
- `REPORT` — produce the current work-package report.
- `STOP` — stop safely and record state.

## Next Action

Claude Code should read `CLAUDE.md`, `AGENTS.md`, this status file, the active work package, and its referenced architecture/ADR/specification documents. It may then bootstrap the authorized Ubuntu implementation host according to `docs/operations/pci-server-bootstrap.md` and begin WP-0001.
