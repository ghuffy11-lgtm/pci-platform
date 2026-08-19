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
| MSG-0001 | Authorized Ubuntu host and `/data/docker` storage boundary | **ANSWERED** — bootstrap contract accepted | No |
| MSG-0002 | Kernel runtime stack ratification (ADR-0015) | OPEN | No |
| MSG-0003 | Repository layout authority and document corrections | OPEN | No |
| MSG-0004 | Prepared repository corrections for MSG-0003 (not applied) | OPEN | No |

## Repository / GitHub State

**The communication channel is operational.** Verified 2026-08-19:

```text
HEAD          383de3a5e60adf71a0f991f33f788a797899fd78
origin/main   383de3a5e60adf71a0f991f33f788a797899fd78
ahead 0, behind 0
```

Local and remote are identical. All WP-0001 implementation and communication artifacts are on
`origin/main`, rebased onto the accepted bootstrap contract `d738a60`. The architecture lead can
read every artifact directly; the operator is no longer required as a messenger.

## Open Blockers

| ID | Subject | Severity |
|---|---|---|
| BLK-0001 | Authorized host not yet bootstrapped (narrowed — environment is now defined) | High |

BLK-0001 is the only open blocker. It is operational, not architectural: the host, account, and
`/data/docker` boundary are defined by the accepted contract, but the host has not been stood up,
so AC-02 and the integration tier of AC-09 remain unverified.

## Recently Closed

| ID | Subject | Closed | Outcome |
|---|---|---|---|
| BLK-0002 | GitHub push unavailable — communication channel down | 2026-08-19 | **RESOLVED.** All commits reached `origin/main`. Diagnosis history preserved in the blocker. |
| MSG-0001 | Authorized Ubuntu host and `/data/docker` storage boundary | 2026-08-19 | **ANSWERED** by `docs/operations/pci-server-bootstrap.md` (accepted contract). |

## Proposed Decisions Awaiting Ratification

| ID | Subject |
|---|---|
| ADR-0015 | Kernel implementation stack (Node.js 24 + TypeScript, zero-framework) |
| ADR-0016 | Tenant isolation enforcement (three layers; 404 over 403) |

Both remain **PROPOSED** as of 2026-08-19. The architecture review of the committed WP-0001
artifacts did not ratify either one, and neither has been promoted to `docs/decisions/`. No
architecture-lead approval is claimed for any decision in this work, and none has been inferred
from the review taking place.

Implementation continues to run on the assumptions these ADRs describe, because the kernel is
already built on them. That is a recorded risk, not an approval: if either is overturned, the
affected kernel code changes accordingly.

## Discoveries

| ID | Subject |
|---|---|
| DISC-0001 | Governance documents duplicated across `knowledge/` and `docs/` |
| DISC-0002 | In-memory adapter test-fidelity gap |
| DISC-0003 | Development identity adapter boundary |
| DISC-0004 | Compose stack predates the `/data/docker` boundary |
| DISC-0005 | `npm test` reports success while running zero tests under POSIX shells |

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

**No new work package is to be started.** Per the 2026-08-19 architecture review, the repository
is reconciled and implementation holds here. WP-0001 remains the active work package and is
still IMPLEMENTED, not COMPLETE.

Awaiting the architecture lead on four items, none of which Claude Code may decide:

- **MSG-0002** — ratify or overturn ADR-0015 (kernel runtime stack).
- **MSG-0003** — the three repository-layout decisions. Remains OPEN and is the decision of record.
- **MSG-0004** — approve the prepared corrections. They are written out exactly and NOT applied.
- **ADR-0016** — ratify or overturn tenant isolation enforcement.

When implementation resumes, the standing instruction is unchanged: read `CLAUDE.md`, `AGENTS.md`,
this status file, the active work package, and its referenced architecture/ADR/specification
documents; then bootstrap the authorized Ubuntu implementation host according to
`docs/operations/pci-server-bootstrap.md`.

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
