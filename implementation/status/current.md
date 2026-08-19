# PCI Implementation Status

**Active Work Package:** WP-0001 — PCI Kernel Foundation
**Status:** IMPLEMENTED — BLOCKED ON VERIFICATION
**Last Updated:** 2026-08-19

## Current State

Architecture and documentation baseline is established. Permanent Claude Code operating rules are defined in `CLAUDE.md`. The initial server bootstrap contract is defined in `docs/operations/pci-server-bootstrap.md`.

The kernel is implemented and its domain, authorization, audit, tenancy, and HTTP contract are
verified: **203 tests pass, 0 fail, 1 tier skipped**, with a clean typecheck.

The work package is **not complete**. AC-02 (database initialization) and the integration tier
of AC-09 remain unverified: no PostgreSQL instance and no container runtime exist on the
authoring host, and the authorized Ubuntu implementation host has not yet been bootstrapped.

> **Updated when the bootstrap contract landed.** This file previously said "no execution host
> is recorded in the repository". That is no longer true.
> `docs/operations/pci-server-bootstrap.md` records the target Ubuntu host, the `claude`
> account, and the `/data/docker` boundary — which answers MSG-0001. BLK-0001 narrows
> accordingly: from "no execution environment is defined" to "the defined environment is not
> yet stood up".

## Implementation Environment

- Initial implementation host: customer-controlled Ubuntu PCI server.
- Implementation account: `claude`.
- Runtime/application data boundary: `/data/docker`.
- Container runtime: Docker.
- Host address: intentionally not stored in Git.
- Authoring host (this machine): Windows, no Docker and no PostgreSQL. It is a source
  workspace only, per the contract's Repository Boundary, and is not an execution host.

## Active Work Package

`docs/program/work-packages/WP-0001-kernel-foundation.md`

> Corrected: this file previously pointed at `implementation/work-packages/`, which does not
> exist. `CLAUDE.md` still points there and needs the same correction — see MSG-0003 Issue 2.
> `CLAUDE.md` was not edited, as it is owned by the architecture lead.

## Verification Summary

| Tier | Result |
|---|---|
| Typecheck | PASS |
| Unit | 102 pass / 0 fail |
| Contract | 101 pass / 0 fail |
| Integration (PostgreSQL) | **SKIPPED — never executed** |

| AC | Verdict |
|---|---|
| AC-01 Build | PARTIAL — container image never built |
| AC-02 Database | **NOT MET** |
| AC-03 Create object | MET |
| AC-04 Relationships | MET |
| AC-05 Tenant isolation | PARTIAL — row-level security unverified |
| AC-06 Audit | MET |
| AC-07 Validation | MET |
| AC-08 Health | MET |
| AC-09 Tests | PARTIAL — integration tier never run |
| AC-10 Evidence | MET |

## Open Communications

| ID | Subject | Status | Blocking |
|---|---|---|---|
| MSG-0001 | Authorized Ubuntu host and `/data/docker` storage boundary | OPEN | **YES** |
| MSG-0002 | Kernel runtime stack ratification (ADR-0015) | OPEN | No |
| MSG-0003 | Repository layout authority and document corrections | OPEN | No |

## Open Blockers

| ID | Subject | Severity |
|---|---|---|
| BLK-0001 | No PostgreSQL or container execution environment | High |
| BLK-0002 | **GitHub push unavailable — the architecture lead cannot see any of this** | Critical |

> **BLK-0002 supersedes everything else in priority.** Four commits exist locally
> (`9a18b09`, `55095d7`, `eabed9b`, `9945a00`) carrying the full WP-0001 implementation and
> every communication artifact. None have reached the remote.
>
> **Root cause corrected 2026-08-19.** This file previously recorded the cause as an
> unregistered SSH key. A verbose handshake disproved that: GitHub responds `Server accepts
> key`, so the key **is** registered and **does** carry access. The private key is
> passphrase-protected, the tool environment has no controlling terminal, and no reachable
> `ssh-agent` holds the decrypted key — so authentication aborts client-side with no fallback
> (`IdentitiesOnly yes` pins it to that one credential). Nothing on the GitHub account, the
> key, or the remote needs to change.
>
> The key is currently loaded in an operator-side agent whose socket the tool environment
> cannot address. See BLK-0002 for the three remaining resolution options.

## Proposed Decisions Awaiting Ratification

| ID | Subject |
|---|---|
| ADR-0015 | Kernel implementation stack (Node.js 24 + TypeScript, zero-framework) |
| ADR-0016 | Tenant isolation enforcement (three layers; 404 over 403) |

Neither is accepted. No architecture-lead approval is claimed for any decision in this work.

## Discoveries

| ID | Subject |
|---|---|
| DISC-0001 | Governance documents duplicated across `knowledge/` and `docs/` |
| DISC-0002 | In-memory adapter test-fidelity gap |
| DISC-0003 | Development identity adapter boundary |

## Report

`implementation/reports/WP-0001-kernel-foundation-report.md`

## Communication Commands

- `GO` — continue the active work package.
- `STATUS` — inspect and update current implementation state.
- `COMMS` — inspect implementation communication artifacts.
- `CHECK` — verify tests and acceptance criteria.
- `REPORT` — produce the current work-package report.
- `STOP` — stop safely and record state.

## Next Action

Claude Code should read `CLAUDE.md`, `AGENTS.md`, this status file, the active work package, and its referenced architecture/ADR/specification documents. It may then bootstrap the authorized Ubuntu implementation host according to `docs/operations/pci-server-bootstrap.md` and begin WP-0001.

For WP-0001 specifically, that bootstrap is what closes the outstanding acceptance criteria. On
the authorized host, with all persistent state under `/data/docker`:

```bash
docker compose -f deploy/compose/docker-compose.yml up -d postgres
cd services/kernel
PCI_TEST_DATABASE_URL=postgres://pci_app:<dev-password>@localhost:5432/pci_test \
  npm run test:integration
```

Then update the WP-0001 report with the real result and re-assess AC-01, AC-02, AC-05, and AC-09.

Do not begin the next work package until WP-0001's acceptance criteria are genuinely met and
ADR-0015 / ADR-0016 are ratified or overturned.
