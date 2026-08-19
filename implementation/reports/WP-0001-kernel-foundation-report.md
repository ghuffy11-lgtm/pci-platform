# WP-0001 — PCI Kernel Foundation — Implementation Report

**Status:** IMPLEMENTATION COMPLETE — **WORK PACKAGE NOT COMPLETE**
**Date:** 2026-08-19
**Author:** Claude Code (implementation agent)
**Work package:** `docs/program/work-packages/WP-0001-kernel-foundation.md`

> Per the `CLAUDE.md` Completion Rule, WP-0001 is **not** complete. AC-02 and the integration
> tier of AC-09 cannot be verified without a PostgreSQL instance, and no execution host is
> recorded in the repository. See `implementation/blockers/BLK-0001-no-execution-environment.md`
> and `implementation/comms/MSG-0001-execution-host-and-storage-boundary.md`.

## 1. Work package

WP-0001 — PCI Kernel Foundation. Source authority: Constitution, Platform Kernel Architecture,
Canonical Knowledge Object Schema, SPEC-0004, SPEC-0005, SPEC-0006, SPEC-0007, SPEC-0010,
SPEC-0011, SPEC-0012.

## 2. Implemented changes

### Layering

```text
services/kernel/src/
  domain/        pure — envelope, vocabularies, validation, secret guard, errors. No I/O.
  ports/         interfaces — repository, policy, identity, clock. The replacement seam.
  application/   governed operations: authorize -> transact -> mutate -> audit -> event
  adapters/      postgres | memory | static-identity | oidc-seam | static-policy
  http/          node:http transport, routing, RFC 9457 problems
  observability/ structured JSON logging with correlation and unconditional redaction
  config/        environment configuration with fail-closed production guards
  cli/           migration runner
```

### Scope coverage

| # | Scope item | Status |
|---|---|---|
| 1 | Application/service layout | Done — `services/kernel/`, hexagonal layering |
| 2 | Local development and container orchestration | Written, **never executed** (no Docker) |
| 3 | PostgreSQL behind service contracts | Done — `KnowledgeRepository` port; adapter written, **never executed** |
| 4 | Database migrations | Written — ordered SQL + checksum-verifying runner; **never applied** |
| 5 | Knowledge Object persistence | Done |
| 6 | Typed relationships | Done — all 36 taxonomy types |
| 7 | Provenance records | Done — append-only, W3C PROV-aligned |
| 8 | Audit records | Done — SPEC-0006 evidence fields, append-only |
| 9 | Tenant context | Done — three enforcement layers (ADR-0016) |
| 10 | Health/readiness endpoints | Done — no secret disclosure |
| 11 | Initial Knowledge Object API | Done — 12 endpoints + OpenAPI 3.1 |
| 12 | Unit, integration, contract tests | Unit ✅, contract ✅, integration **written, never run** |
| 13 | Structured logging and correlation IDs | Done — verified end to end |
| 14 | Document local development and test execution | Done — `services/kernel/README.md` |

### Required architectural properties

| Property | How it is enforced |
|---|---|
| Storage behind a repository boundary | `ports/knowledge-repository.ts`; no driver type appears above `adapters/` |
| Secrets externalized, absent from source control | Environment-only config; `.gitignore`; `.env.example` carries synthetic placeholders only |
| Tenant context explicit in protected operations | `TenantContext` is the only way to open a transaction; it can only be built from a verified `Principal` |
| IDs stable, never reused | UUIDs; no delete path for objects; retirement is a lifecycle transition |
| Relationships reference IDs | `Relationship` holds only identifiers; composite FKs enforce same-tenant endpoints |
| Provenance/audit append-oriented | No update/delete methods on the port; `UPDATE`/`DELETE` revoked from the runtime role |
| Derived indexes not canonical | Schema is committed DDL; the GIN index is an accelerator, never a source of truth |

## 3. Tests and results

Executed on Node.js v24.15.0, Windows Server 2022, 2026-08-19.

```text
typecheck (tsc --noEmit)   PASS
unit          102 tests    102 pass    0 fail
contract      101 tests    101 pass    0 fail
integration     1 test       0 pass    0 fail    1 SKIPPED
```

**Total: 203 passing, 0 failing, 1 skipped.**

The skipped test is the entire PostgreSQL tier. It prints an explicit console banner stating
that migrations, row-level security, and the PostgreSQL adapter are **not** verified, so a green
run cannot be misread as database verification.

### Acceptance criteria

| AC | Verdict | Evidence |
|---|---|---|
| AC-01 Build | **PARTIAL** | Node build, typecheck, and test pipeline verified from a clean `npm install`. Container image **never built**. |
| AC-02 Database | **NOT MET** | Migrations written but never applied. No PostgreSQL available. |
| AC-03 Create object | **MET** | `knowledge-service.test.ts`, `http-api.test.ts` — identity, type, ownership, classification, lifecycle, provenance all asserted |
| AC-04 Relationships | **MET** | `knowledge-service.test.ts`, `http-api.test.ts` — create, query, neighbourhood, duplicate rejection |
| AC-05 Tenant isolation | **PARTIAL** | 10 service-level + 2 HTTP-level tests pass (ADR-0016 layers 1–2). Layer 3 (RLS) **unverified**. |
| AC-06 Audit | **MET** | `audit.test.ts` — every SPEC-0006 evidence field asserted; success, denial, approval-required, and error paths all audited; secrets absent |
| AC-07 Validation | **MET** | `validation.test.ts`, `policy.test.ts`, `http-api.test.ts` — invalid types, malformed relationships, missing fields, unauthorized operations, all deterministic |
| AC-08 Health | **MET** | `http-api.test.ts` + `config.test.ts` assert no token, connection string, password, or principal identifier appears in health output |
| AC-09 Tests | **PARTIAL** | Unit and contract pass in a clean environment. Integration tier never executed. |
| AC-10 Evidence | **MET** | This report; every source file cites its governing document |

**7 of 10 met, 3 partial or unmet.** All three gaps trace to BLK-0001.

### Defect found and fixed during verification

A smoke test of the actual entrypoints revealed that **neither `main.ts` nor `migrate.ts` would
start on Windows**. The "invoked directly" guard built `file://D:/...` by string concatenation
while `import.meta.url` is `file:///D:/...`, so the comparison never matched and both processes
exited silently with code 0.

The test suite did not catch this because tests import `buildServer` and `migrate` directly.
Fixed by using `pathToFileURL()`; both entrypoints then verified — the config guard exits 78,
the migration CLI exits 2, and the service boots, serves requests, and shuts down cleanly.

This is recorded because it is a genuine near-miss: a full green test suite coexisted with a
service that could not start.

## 4. Files changed

**Repository communication (11)** — `implementation/comms/MSG-0001…0003`,
`implementation/blockers/BLK-0001`, `implementation/decisions/ADR-0015`, `ADR-0016`,
`implementation/discoveries/DISC-0001…0003`, four directory `README.md` files.

**Kernel source (24)** — `services/kernel/src/` across `domain/` (8), `ports/` (4),
`application/` (1), `adapters/` (6), `http/` (5), `observability/` (1), `config/` (1),
`cli/` (1), `main.ts`.

**Tests (10)** — `test/unit/` (5), `test/contract/` (6), `test/integration/` (1),
`test/support/fixtures.ts`.

**Schema and contracts (2)** — `migrations/0001_kernel_foundation.sql`,
`openapi/kernel.openapi.json`.

**Build and deployment (7)** — `package.json`, `package-lock.json`, `tsconfig.json`,
`Dockerfile`, `deploy/compose/docker-compose.yml`, `deploy/compose/initdb/00-roles.sql`,
`deploy/compose/.env.example`.

**Documentation (2)** — `services/kernel/README.md`, root `.gitignore`.

**Modified (1)** — `implementation/status/current.md` (corrected the wrong work-package path).

No existing architecture, ADR, or specification document was modified.

## 5. Security considerations

| Control | Implementation |
|---|---|
| Deny by default | `StaticPolicyEngine.authorize()` — unmatched requests deny; it is the final statement of the method |
| Authorization outside the model | Enforced in the application layer via a port; no model output reaches a privileged path |
| Agent authority (ADR-0011) | Reads allowed; mutations return `approval_required`; high-risk actions denied **even for `platform_admin` agents**; undelegated agents cannot mutate |
| Separation of duties | Retirement and relationship deletion require `knowledge_steward`, which authors do not hold |
| Tenant isolation | Three layers; cross-tenant reads return **404, never 403**, so the error channel cannot confirm an identifier |
| Secret exclusion | Key-name and value-shape guard applied at validation, service write, audit write, and every log line; rejections never echo the submitted value |
| Restricted classification | Requires `security_officer`; authorization uses the **higher** of current and requested classification so a same-request downgrade cannot dodge the rule |
| Audit tamper-evidence | `UPDATE`/`DELETE` revoked from the runtime role; no update method exists on the port |
| Credential oracle prevention | Absent, malformed, and unknown credentials produce byte-identical 401s; constant-time token comparison |
| Fail-closed startup | Static identity and in-memory store both refuse `PCI_ENV=production`; invalid config exits 78 |
| Unimplemented auth fails closed | `OidcIdentityProvider.verify()` throws; it never returns a principal |
| Transport hardening | Body cap, header/request timeouts, `nosniff`, `no-store`, all-capabilities-dropped read-only container |
| SQL injection | Every value bound as a parameter; no interpolation anywhere in the adapter |

**Not verified:** row-level security, append-only privilege enforcement, and cross-tenant
foreign-key rejection all require a live database.

## 6. Database and configuration changes

**New schema** (`migrations/0001_kernel_foundation.sql`, never applied): `schema_migrations`,
`tenants`, `knowledge_objects`, `knowledge_object_versions`, `relationships`,
`provenance_records`, `audit_records`, `events` — plus RLS policies on all six tenant-scoped
tables and least-privilege grants for `pci_app`.

**New configuration**: 15 `PCI_*` environment variables, documented in
`services/kernel/README.md` with defaults and production refusals.

**Operational impact**: the kernel must run as a database role that is neither `SUPERUSER` nor
`BYPASSRLS`, or tenant isolation layer 3 silently becomes inert. Migrations run as a separate,
more privileged role. This is enforced in the compose stack and asserted by the integration
harness.

## 7. Known limitations

1. **The PostgreSQL adapter has never been executed.** Migrations, RLS, composite-FK rejection,
   real concurrency, and JSONB round-tripping are all unverified (BLK-0001, DISC-0002).
2. **The in-memory adapter is a second implementation** and could pass tests the PostgreSQL
   adapter would fail. Bounded by the shared contract suite, not eliminated.
3. **OIDC is a declared seam, not an implementation.** Only the development static adapter
   authenticates (DISC-0003).
4. **Events are persisted but never dispatched.** No broker or subscription — out of scope.
5. **The secret guard is heuristic.** It catches credential-shaped keys and known value formats;
   a secret pasted into a field named `notes` will pass.
6. **Only 7 of 31 registry object types** are implemented — the work package restricts this.
7. **No temporal re-establishment of a relationship.** The unique edge index forbids the same
   `(from, to, type)` twice, so an edge that lapsed and resumed cannot be represented.
8. **SPEC-0012 workflow engine is not implemented.** Listed as source authority but no scope
   item requires it; approval decisions surface as `approval_required` with no durable
   approval workflow behind them.
9. **System-tenant governance is deferred.** The boundary exists; the governance around it does
   not (ADR-0016).
10. **No OpenTelemetry exporter.** Logs use OTel-compatible field naming, but no SDK was added
    because no collector is in scope.
11. **The container image was never built** and image pinning is by tag, not digest.

## 8. Discoveries

- **DISC-0001** — six governance documents exist in both `knowledge/` and `docs/` with
  differing content, and `AGENTS.md` and `CLAUDE.md` point at different trees.
- **DISC-0002** — in-memory adapter test-fidelity gap, mitigated by the shared contract suite.
- **DISC-0003** — development identity adapter boundary and its production refusals.

### Assumptions recorded

- **Lifecycle back-transitions.** The lifecycle document specifies only the forward path. Three
  additional transitions were implemented as judgement calls: review rejection
  (`reviewed`/`approved` → `draft`), reinstatement (`deprecated` → `active`), and withdrawal
  (any non-terminal → `retired`). `retired` is terminal.
- **Read auditing.** SPEC-0006 scopes audit to security-sensitive, administrative, and
  agent-driven activity. Ordinary human reads are therefore **not** audited; agent reads and
  Restricted-classification reads **are**.
- **Event persistence.** SPEC-0007 is listed source authority but no scope item names events.
  The envelope and a transactional outbox were implemented because audit reconstruction is
  incomplete without them; no dispatcher was built.
- **Repository layout.** `repository-map.md:57` forbids production code directories. WP-0001
  was read as the authorization that lifts that gate — see MSG-0003 Issue 1.

## 9. Architecture decisions required

| Item | Decision needed | Blocking? |
|---|---|---|
| **MSG-0001** | Authorized Ubuntu host; exact `/data/docker` storage boundary | **YES** — AC-01, AC-02, AC-09 |
| **MSG-0002 / ADR-0015** | Ratify the Node.js + TypeScript kernel stack and the zero-framework posture | No — WP-0001 delegated the choice |
| **MSG-0003** | Confirm WP-0001 lifts `repository-map.md:57`; choose canonical work-package location; designate the authoritative governance tree | No |
| **ADR-0016** | Ratify the three-layer isolation strategy and 404-over-403 | No |

Both ADRs are **PROPOSED**. Neither is self-accepted. No approval by the architecture lead is
claimed anywhere in this work.

## 10. Recommended next action

1. **Answer MSG-0001.** Nothing else closes AC-02.
2. Once a host exists, run the integration tier and update this report with the real result.
3. Ratify or overturn ADR-0015 and ADR-0016 before further code is written on top of them.
4. Resolve MSG-0003 so the repository map and `CLAUDE.md` stop contradicting the tree.
5. Only then proceed to the next work package.

**Do not treat WP-0001 as complete until items 1 and 2 are done.**
