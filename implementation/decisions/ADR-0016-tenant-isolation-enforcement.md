# ADR-0016 — Tenant Isolation Enforcement Strategy (PROPOSED)

**Status:** PROPOSED — requires ratification by the architecture lead
**Date:** 2026-08-19
**Proposed by:** Claude Code (implementation agent)
**Work package:** WP-0001 — PCI Kernel Foundation
**Source authority:** SPEC-0010, SPEC-0011, `docs/security/rbac-abac-model.md`

> This ADR is **not accepted**. It records an enforcement mechanism chosen during implementation
> that SPEC-0010 requires but does not itself specify.

## Context

SPEC-0010 requires that every customer-owned object carry an explicit tenant boundary, that
authorization be evaluated within tenant context, and that cross-tenant access be denied by
default. It does not prescribe *how* isolation is enforced.

A single missed `WHERE tenant_id = ...` clause is sufficient to breach SPEC-0010. Relying on
application-layer discipline alone makes tenant isolation a property of programmer attention.

## Decision

Tenant isolation is enforced at **three** independent layers.

### Layer 1 — Type-level

The repository port accepts no free-form tenant string. Every method takes a `TenantContext`
value object that can only be constructed from a verified `Principal`. There is no code path that
reaches persistence without a tenant.

### Layer 2 — Query-level

Every SQL statement in the PostgreSQL adapter filters on `tenant_id`, and every composite primary
and foreign key includes `tenant_id`. A relationship therefore cannot reference an object in
another tenant — the database rejects it as a foreign-key violation rather than relying on an
application check.

### Layer 3 — PostgreSQL row-level security

Every tenant-scoped table has `ENABLE ROW LEVEL SECURITY` plus `FORCE ROW LEVEL SECURITY` with a
policy predicated on `current_setting('pci.tenant_id')`. The application sets that GUC
transaction-locally via `set_config('pci.tenant_id', $1, true)` before any statement runs.

`FORCE` is specified so the policy also applies to the table owner, closing the common
misconfiguration where RLS is silently bypassed by the migration role.

If layer 2 is ever breached by a coding error, layer 3 returns zero rows rather than another
tenant's data.

## Cross-tenant read semantics

A request for an object belonging to another tenant returns **404 Not Found**, not 403 Forbidden.

A 403 would confirm that the identifier exists, leaking cross-tenant information through the
error channel. This is an intentional security-over-precision trade-off and is asserted in
`test/contract/tenant-isolation.contract.ts`.

## System-level objects

SPEC-0010 requires that system-level objects be "explicitly classified and separately governed".
WP-0001 implements the *boundary* — a reserved `system` tenant that ordinary principals cannot
be issued a context for — but does **not** implement system-level governance workflows, which
are out of scope. Recorded as a known limitation.

## Consequences

- Isolation survives a single-layer programming error.
- The kernel must run as a database role that is **not** superuser and **not** `BYPASSRLS`;
  otherwise layer 3 is inert. Enforced in `deploy/compose/docker-compose.yml` and asserted by
  the integration harness.
- Migrations run as a separate, more privileged role than the runtime role.
- A small per-transaction cost for `set_config` — negligible relative to query cost.
- Layer 3 is **unverified**: no PostgreSQL instance was available. See BLK-0001. Layers 1 and 2
  are verified by the contract suite.

## Decision required

1. Ratify, amend, or reject the three-layer strategy.
2. Confirm 404-over-403 for cross-tenant reads.
3. Confirm that system-tenant governance is correctly deferred beyond WP-0001.
