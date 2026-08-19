# BLK-0001 — No PostgreSQL or Container Execution Environment

**Status:** OPEN — narrowed 2026-08-19 by the accepted bootstrap contract
**Severity:** High — prevents formal verification of two acceptance criteria
**Raised:** 2026-08-19
**Work package:** WP-0001 — PCI Kernel Foundation
**Communication:** `implementation/comms/MSG-0001-execution-host-and-storage-boundary.md`

## Blocked acceptance criteria

| AC | Status | Reason |
|---|---|---|
| AC-01 — Build | **Partially met** | Node build, typecheck, and test pipeline verified. Container image build unverified (no Docker). |
| AC-02 — Database | **NOT MET** | Migrations are written but have never been applied to a PostgreSQL instance. |
| AC-09 — Tests | **Partially met** | Unit and contract tiers pass. Integration tier against real PostgreSQL never executed. |

All other acceptance criteria (AC-03 … AC-08, AC-10) are verified against the in-memory adapter
through the adapter-agnostic contract suite.

## Cause

Docker, Docker Compose, and PostgreSQL are absent from the authoring host, and no authorized
implementation host is recorded in the repository. See MSG-0001 for the full tooling inventory.

## Mitigation applied

1. The repository contract suite in `services/kernel/test/contract/` is written against the
   `KnowledgeRepository` **port**, not against any adapter. It is executed against the in-memory
   adapter today and will run unmodified against the PostgreSQL adapter once a host exists.
2. `services/kernel/test/integration/` contains the PostgreSQL harness. It **skips with an
   explicit console notice** when `PCI_TEST_DATABASE_URL` is unset, so an unverified tier can
   never be silently counted as passing.
3. Migrations are plain, ordered SQL applied by a deterministic runner — no ORM-generated schema
   that could drift from the committed DDL.

## Residual risk

The in-memory adapter could satisfy the contract suite while the PostgreSQL adapter contains a
defect in SQL, transaction handling, or row-level-security configuration. The contract suite
constrains this risk but does not eliminate it. This is recorded in
`implementation/discoveries/DISC-0002-adapter-test-fidelity.md`.

**This risk is not resolved and must not be treated as resolved until the integration tier has
actually been executed against PostgreSQL.**

## Resolution requirement

Answer MSG-0001, then run:

```bash
docker compose -f deploy/compose/docker-compose.yml up -d postgres
cd services/kernel
PCI_TEST_DATABASE_URL=postgres://pci:<dev-password>@localhost:5432/pci_test npm run test:integration
```

---

## Narrowed — 2026-08-19

`docs/operations/pci-server-bootstrap.md` was accepted, answering MSG-0001. The architectural
half of this blocker is gone: an execution host (customer-controlled Ubuntu server, `claude`
account) and a persistent-storage boundary (`/data/docker`, mandatory) are now recorded, and
Claude Code is authorised to install Docker and prepare the host when a work package requires it.

What remains is purely operational: **the authorised host has not yet been bootstrapped, and no
PostgreSQL instance exists yet.** AC-02 and the integration tier of AC-09 stay unverified for
that reason alone.

Revised statement of the blocker: *the defined execution environment is not yet stood up* —
rather than *no execution environment is defined*.

Clearing it now requires no decision, only execution: bootstrap the authorised host per the
contract, bring up PostgreSQL with persistent state under `/data/docker` (see DISC-0004), run the
integration tier (see DISC-0005 before trusting any tier's result), and record the outcome in the
WP-0001 report.
