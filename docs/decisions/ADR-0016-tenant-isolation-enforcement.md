# ADR-0016 — Tenant Isolation Enforcement Strategy

**Status:** ACCEPTED
**Date:** 2026-08-19
**Accepted by:** PCI architecture lead
**Work package:** WP-0001 — PCI Kernel Foundation
**Supersedes:** `implementation/decisions/ADR-0016-tenant-isolation-enforcement.md` (PROPOSED)

## Decision

Tenant isolation is enforced at three independent layers:

1. **Type/application layer:** persistence ports require a verified `TenantContext`; tenant context is not supplied as an ungoverned free-form value.
2. **Query/data-model layer:** tenant-scoped SQL statements constrain tenant identity, and composite keys prevent cross-tenant relationships.
3. **PostgreSQL RLS layer:** every tenant-scoped table uses enabled and forced row-level security, with a transaction-local tenant setting used by the policies.

Cross-tenant reads return **404 Not Found**, not 403, so the API does not reveal whether an object exists in another tenant.

The kernel runtime role MUST NOT be PostgreSQL `SUPERUSER` or `BYPASSRLS`. Migrations use a separate privileged role. System-level governance remains explicitly outside WP-0001 scope.

## Rationale

The security model requires default deny, least privilege, separation of duties, policy decisions outside model reasoning, authorization re-checks before privileged execution, and auditable policy changes. fileciteturn118file0

Three independent enforcement layers reduce the chance that a single application defect becomes a tenant-isolation failure. `FORCE ROW LEVEL SECURITY` is specifically required so the runtime policy cannot silently be bypassed merely because the runtime role owns a table.

The 404 behavior is an intentional information-disclosure control: authorization failure for an object that is not visible to the caller is represented as non-existence.

## Consequences

- Tenant isolation is a defense-in-depth property rather than a convention in individual handlers.
- Every future persistence adapter must preserve tenant context semantics.
- Database deployment must enforce the non-superuser/non-BYPASSRLS runtime role constraint.
- RLS remains an acceptance-test requirement; this ADR is accepted, but the implementation is not considered fully verified until PostgreSQL integration tests run on the authorized host.
- System-tenant governance workflows are deferred beyond WP-0001 and require their own specification/decision when introduced.
