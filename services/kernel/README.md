# PCI Platform Kernel

**Work package:** WP-0001 — PCI Kernel Foundation
**Status:** Implemented; PostgreSQL tiers unverified — see `implementation/blockers/BLK-0001-no-execution-environment.md`

The transactional foundation for Knowledge Objects, typed relationships, provenance, audit
evidence, and tenant context.

## Source authority

| Concern | Document |
|---|---|
| Object envelope | `docs/knowledge/canonical-object-schema.md` |
| Object types | `docs/knowledge/object-type-registry.md` |
| Lifecycle | `docs/knowledge/knowledge-object-lifecycle.md` |
| Relationships | `docs/knowledge/relationship-taxonomy.md` |
| Provenance | `docs/knowledge/provenance-model.md` |
| API contract | `docs/specifications/SPEC-0005-knowledge-object-api.md` |
| Audit | `docs/specifications/SPEC-0006-audit-and-evidence.md` |
| Events | `docs/specifications/SPEC-0007-event-model.md` |
| Tenancy | `docs/specifications/SPEC-0010-tenant-and-data-isolation.md` |
| Authorization | `docs/specifications/SPEC-0011-policy-and-authorization.md` |
| Identity | `docs/specifications/SPEC-0004-identity-service.md` |
| Classification | `docs/security/data-classification.md` |

Proposed decisions awaiting ratification: `implementation/decisions/ADR-0015` (stack),
`ADR-0016` (tenant isolation strategy).

## Architecture

```text
http/          transport only — node:http, routing, RFC 9457 problems
  |
application/   governed operations: authorize -> transact -> mutate -> audit -> event
  |
domain/        pure: envelope, vocabularies, validation, secret guard. No I/O.
  |
ports/         interfaces — the replacement seam
  |
adapters/      postgres | memory | static-identity | oidc-seam | static-policy
```

`domain/` and `application/` contain no framework or driver types, so the storage and identity
implementations can be replaced without touching business logic (Constitution principle 6).

### Where the security properties live

| Property | Enforced in |
|---|---|
| Tenant isolation | `TenantContext` (type-level), every SQL predicate, PostgreSQL RLS |
| Authorization | `application/knowledge-service.ts` via the `PolicyEngine` port — never in the transport, never in a model |
| Audit completeness | `governed()` — the only path a mutation can take |
| Secret exclusion | `domain/secret-guard.ts`, applied on validation, service write, audit write, and every log line |
| Deny by default | `adapters/policy/static-policy-engine.ts` — final statement of `authorize()` |

## Requirements

- Node.js **24 LTS or later** (native TypeScript type-stripping, `node:test`)
- PostgreSQL **16** for anything beyond the unit and contract tiers

## Local development

```bash
cd services/kernel
npm install

# Typecheck (no build step — Node runs the TypeScript directly)
npm run typecheck

# Unit + contract tiers. These need no database.
npm test
```

Run the service against the in-memory store, with no database at all:

```bash
PCI_ENV=development \
PCI_STORE_MODE=memory \
PCI_IDENTITY_MODE=static \
PCI_STATIC_PRINCIPALS='[{"token":"dev-token-replace-me-000000000001","subject":"user:dev","tenantId":"tenant-alpha","actorType":"human","roles":["platform_admin"]}]' \
npm start
```

```bash
curl -s localhost:8080/health/ready | jq

curl -s -X POST localhost:8080/api/v1/objects \
  -H 'Authorization: Bearer dev-token-replace-me-000000000001' \
  -H 'Content-Type: application/json' \
  -d '{"type":"Service","name":"Records API","ownership":{"organization":"org:clinic","owner":"user:dev"},"classification":"internal"}' | jq
```

## Running with PostgreSQL

> Neither of the following has been executed. Docker and PostgreSQL were unavailable during
> WP-0001 (BLK-0001), and the persistent-storage boundary is still unresolved (MSG-0001).

```bash
cd deploy/compose
cp .env.example .env      # then replace every placeholder value
docker compose up -d postgres
docker compose run --rm migrate
docker compose up -d kernel
```

Or apply migrations directly:

```bash
cd services/kernel
PCI_DATABASE_URL=postgres://pci_admin:<password>@localhost:5432/pci npm run migrate
PCI_DATABASE_URL=postgres://pci_admin:<password>@localhost:5432/pci npm run migrate -- --dry-run
```

## Tests

| Tier | Command | Needs a database | Verified |
|---|---|---|---|
| Unit | `npm run test:unit` | no | ✅ |
| Contract | `npm run test:contract` | no | ✅ |
| Integration | `npm run test:integration` | **yes** | ❌ never executed |

```bash
# Integration tier — skips loudly when the URL is unset
PCI_TEST_DATABASE_URL=postgres://pci_app:<password>@localhost:5432/pci_test \
  npm run test:integration
```

`test/contract/repository.contract.ts` is written against the repository **port**. The same
suite runs against the in-memory adapter today and against PostgreSQL unchanged once a host
exists, so the two adapters cannot drift apart silently. The residual risk until that happens
is recorded in `implementation/discoveries/DISC-0002-adapter-test-fidelity.md`.

## Configuration

All configuration is environment-based; nothing is read from a committed file. Invalid
configuration terminates startup with exit code 78 rather than degrading to a permissive mode.

| Variable | Default | Notes |
|---|---|---|
| `PCI_ENV` | `development` | `development` \| `test` \| `staging` \| `production` |
| `PCI_HOST` | `0.0.0.0` | |
| `PCI_PORT` | `8080` | `0` binds any free port |
| `PCI_LOG_LEVEL` | `info` | |
| `PCI_STORE_MODE` | `postgres` | `memory` is a test double, **prohibited in production** |
| `PCI_DATABASE_URL` | — | required when `PCI_STORE_MODE=postgres`; contains a password, never logged |
| `PCI_DATABASE_POOL_MAX` | `10` | |
| `PCI_DATABASE_STATEMENT_TIMEOUT_MS` | `15000` | |
| `PCI_IDENTITY_MODE` | `static` | `static` is development-only, **prohibited in production** |
| `PCI_STATIC_PRINCIPALS` | `[]` | JSON array of synthetic development principals |
| `PCI_OIDC_ISSUER` / `PCI_OIDC_AUDIENCE` | — | required when `PCI_IDENTITY_MODE=oidc` |
| `PCI_REQUEST_BODY_LIMIT_BYTES` | `1048576` | |
| `PCI_SHUTDOWN_GRACE_MS` | `10000` | |

### Production refusals

The kernel **exits non-zero at startup** when `PCI_ENV=production` and either:

- `PCI_IDENTITY_MODE=static` — ADR-0007 forbids PCI implementing authentication; or
- `PCI_STORE_MODE=memory` — no durability and no row-level security.

## Roles

| Role | Grants |
|---|---|
| `knowledge_reader` | read and query |
| `knowledge_author` | create and update |
| `knowledge_steward` | retire objects, delete relationships |
| `security_officer` | read audit evidence, access Restricted classification |
| `platform_admin` | every recognised kernel action |

Agent principals are governed separately: reads are permitted, mutations return
`approval_required`, high-risk actions are denied outright regardless of role, and an agent
with no delegating principal cannot mutate at all (ADR-0011).

## API

`openapi/kernel.openapi.json` (OpenAPI 3.1). `test/contract/openapi.test.ts` fails the build if
the document and the router disagree.

Mutations require `If-Match` carrying the current object version. Errors are RFC 9457 problem
documents. Cross-tenant access returns **404, never 403** — see ADR-0016.

## Known limitations

Recorded in full in `implementation/reports/WP-0001-kernel-foundation-report.md`. In brief:

- The PostgreSQL adapter, migrations, and row-level security have **never been executed**.
- The OIDC adapter is a declared seam that throws; only the static development adapter works.
- Events are persisted to a transactional outbox but nothing dispatches them.
- The secret guard catches credential-shaped keys and values, not a secret hidden in a
  free-text field.
- Only 7 of the 31 registry object types are implemented, per the work package's own scope.
