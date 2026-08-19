# MSG-0005 — Architecture Lead Decisions

**Status:** DECIDED — 2026-08-19
**From:** PCI architecture lead
**Work package:** WP-0001

## Decisions

### ADR-0015 — Kernel implementation stack

**RATIFIED.** Use Node.js 24 LTS + TypeScript for the PCI kernel. Keep the zero-framework posture and `pg` as the PostgreSQL driver. This decision applies to the kernel only and does not constrain future AI, ingestion, connector, or UI runtimes.

### ADR-0016 — Tenant isolation

**RATIFIED.** Use the three-layer tenant-isolation strategy: type/application tenant context, query/data-model tenant constraints, and PostgreSQL RLS with FORCE RLS. Cross-tenant reads return 404. Runtime database roles must not be SUPERUSER or BYPASSRLS. System-tenant governance remains outside WP-0001.

### MSG-0003 / MSG-0004 — Repository governance and layout

**DECIDED.** `docs/` is authoritative for architecture, ADRs, specifications, engineering, operations, product, program, and security governance. `knowledge/governance/constitution.md` remains authoritative for the PCI Constitution itself. Other duplicated governance content under `knowledge/` is legacy and must not override `docs/`.

**DECIDED.** `docs/program/work-packages/` is the canonical work-package location.

**DECIDED.** The approved WP-0001 layout is accepted: `services/`, `deploy/`, and `implementation/` are valid top-level areas. The repository-map sequencing gate is lifted for this approved layout; future top-level code areas still require an approved work package or ADR.

## Required repository actions

Claude Code may now apply the prepared MSG-0004 corrections:

1. Correct `CLAUDE.md` to read the active work package from `docs/program/work-packages/`.
2. Update `AGENTS.md` so it distinguishes the Constitution source from the authoritative `docs/` governance tree.
3. Update `docs/architecture/repository-map.md` for `services/`, `deploy/`, and `implementation/`, and replace the obsolete sequencing gate.
4. Update the implementation copies of ADR-0015 and ADR-0016 to record that the decisions have been ratified, while retaining their historical proposed text.
5. Keep MSG-0003 and MSG-0004 as historical communication records; do not delete them.

Do not delete the legacy `knowledge/` duplicates yet. Migration/removal is a separate controlled cleanup task.

## Implementation authorization

After the above repository corrections are committed and pushed, Claude Code is authorized to resume WP-0001 and bootstrap the authorized Ubuntu PCI server according to `docs/operations/pci-server-bootstrap.md`.

The next operational objective is to complete the real container/PostgreSQL/RLS verification on that host. All persistent runtime state remains under `/data/docker`.

Do not begin a new work package until WP-0001 acceptance criteria are met.
