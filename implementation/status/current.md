# PCI Implementation Status

**Active Work Package:** WP-0001 — PCI Kernel Foundation
**Status:** IMPLEMENTED — VERIFICATION IN PROGRESS ON AUTHORIZED HOST
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
- Source workspace on the host: `/data/pci-platform` (mandatory).
- Runtime/application data boundary: `/data/docker` (mandatory).
- **No PCI artifact of any kind may exist outside `/data` on the PCI server** (contract v0.2,
  MSG-0006).
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

All architecture communications are now closed. None are blocking.

| ID | Subject | Status |
|---|---|---|
| MSG-0001 | Authorized Ubuntu host and `/data/docker` storage boundary | ANSWERED — bootstrap contract |
| MSG-0002 | Kernel runtime stack ratification | CLOSED — ADR-0015 ratified |
| MSG-0003 | Repository layout authority and document corrections | CLOSED — decided by MSG-0005 |
| MSG-0004 | Prepared repository corrections | CLOSED — approved and applied |
| MSG-0005 | Architecture lead decisions | DECIDED — acted on 2026-08-19 |
| MSG-0006 | Absolute host file boundary (override) | DECIDED — correction applied, awaiting review |
| MSG-0007 | Permanent operating rule hardening | DECIDED — applied to CLAUDE.md and AGENTS.md |

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
| BLK-0004 | No privilege to bootstrap the authorized host (no passwordless sudo) | High |

Both open blockers are operational, not architectural. BLK-0001: the host, account, and
`/data/docker` boundary are defined by the accepted contract, but the host has not been stood up,
so AC-02 and the integration tier of AC-09 remain unverified. BLK-0004: SSH access now works, but
Docker is absent and `claude` has no passwordless sudo, so nothing could be installed. A
verifying bootstrap script is committed for the operator to run. No architecture decision is
required for either.

## Recently Closed

| ID | Subject | Closed | Outcome |
|---|---|---|---|
| BLK-0002 | GitHub push unavailable — communication channel down | 2026-08-19 | **RESOLVED.** All commits reached `origin/main`. Diagnosis history preserved in the blocker. |
| BLK-0003 | PCI server key could not be unlocked | 2026-08-19 | **RESOLVED.** Key loaded into a reachable agent; SSH access to the host verified. Passphrase retained. |
| MSG-0001 | Authorized Ubuntu host and `/data/docker` storage boundary | 2026-08-19 | **ANSWERED** by `docs/operations/pci-server-bootstrap.md` (accepted contract). |

## Accepted Decisions

| ID | Subject | Authoritative record |
|---|---|---|
| ADR-0015 | Kernel implementation stack (Node.js 24 LTS + TypeScript, zero-framework, `pg`) | `docs/decisions/ADR-0015-kernel-implementation-stack.md` — ACCEPTED |
| ADR-0016 | Tenant isolation enforcement (three layers, FORCE RLS, 404 over 403) | `docs/decisions/ADR-0016-tenant-isolation-enforcement.md` — ACCEPTED |

Both were ratified by the architecture lead on 2026-08-19 in MSG-0005 and promoted to
`docs/decisions/`. The implementation-side proposals in `implementation/decisions/` are retained
as history and now record their ratification.

**Stated scope limits, which implementation must respect:**

- ADR-0015 applies to the kernel only. It does not constrain future AI, ingestion, connector, or
  UI runtimes.
- ADR-0016 excludes system-tenant governance from WP-0001.
- ADR-0016's FORCE RLS and non-BYPASSRLS requirements remain **unverified**. They are design
  obligations that have never been exercised against a real PostgreSQL instance. Ratification
  does not constitute verification.

## Applied Repository Corrections — 2026-08-19

Authorized by MSG-0005; prepared in MSG-0004.

| File | Correction |
|---|---|
| `CLAUDE.md` | Startup step 4 now reads the active work package from `docs/program/work-packages/`. |
| `AGENTS.md` | New Governance Tree Authority section: `docs/` authoritative, `knowledge/governance/constitution.md` excepted, other `knowledge/` content legacy. |
| `docs/architecture/repository-map.md` | Records `services/`, `deploy/`, `implementation/`, `CLAUDE.md`, and `docs/program/`; sequencing gate replaced with the lifted-gate statement. |
| `implementation/decisions/ADR-0015`, `ADR-0016` | Ratification recorded; proposed text retained. |
| `implementation/comms/MSG-0003`, `MSG-0004` | Closed and retained as historical records; not deleted. |

Legacy `knowledge/` duplicates were **not** deleted, by explicit instruction — their migration is
a separate controlled cleanup task. DISC-0001's divergence therefore still exists on disk; only
precedence has changed.

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

**Stopped by instruction (MSG-0006), and blocked on BLK-0004 — host privilege.** Implementation
is held pending architecture-lead review of the contract v0.2 correction. Docker was not
installed, the host was not bootstrapped, `/data/pci-platform` was not created, and the host has
not been modified since the out-of-boundary clone was removed.

**Blocked on BLK-0004 — host privilege.** Resuming WP-0001 on the authorized Ubuntu PCI server is
authorized by MSG-0005 and was attempted 2026-08-19. SSH access is verified and the host was
surveyed read-only: Ubuntu 24.04.4 LTS, `/data` on a dedicated 8.7T disk, `/data/docker` present
with a pre-staged `daemon.json` setting `data-root`. Docker is absent and `claude` has no
passwordless sudo, so no bootstrap step ran. **Nothing on the host was created, installed, or
modified.**

`deploy/bootstrap/pci-server-bootstrap.sh` is committed and awaits one privileged run:

```bash
sudo bash /data/pci-platform/deploy/bootstrap/pci-server-bootstrap.sh
```

Once BLK-0004 clears, the objective is unchanged. Original text follows.

**Resume WP-0001 on the authorized Ubuntu PCI server.** Authorized by MSG-0005 after the
repository corrections above were committed and pushed. No new work package is to be started.

The objective is real verification, not further construction: bootstrap the host per
`docs/operations/pci-server-bootstrap.md`, stand up PostgreSQL with all persistent state under
`/data/docker`, run the integration tier, and prove tenant isolation against a live database with
FORCE RLS and a non-BYPASSRLS runtime role.

That closes AC-02 and the integration tier of AC-09, and converts AC-01 and AC-05 from partial to
verified. Two recorded items must be handled on the way:

- **DISC-0004** — the compose stack uses a named volume and predates the `/data/docker` boundary.
  Correct it on the host, where it can be verified.
- **DISC-0005** — `npm test` exits 0 while running zero tests under POSIX shells, which is the
  default on the target Ubuntu host. Fix before trusting any tier's result there, or the
  integration evidence will be worthless.
