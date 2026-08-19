# WP-0001 — PCI Kernel Foundation — Implementation Report

**Status:** **ALL TEN ACCEPTANCE CRITERIA MET AND VERIFIED ON REAL INFRASTRUCTURE** — with two
reproducibility defects recorded (DISC-0007, DISC-0008) that must be fixed before the stack can be
called deployable.
**Date:** 2026-08-19, host verification appended same day

> ## Host verification — 2026-08-19
>
> Everything below this banner was written before any of it had been executed. It has now been run
> against the authorized Ubuntu host. **The results are recorded in section 11 at the end of this
> report, which supersedes the earlier verdicts in sections 3 and 7.** The original text is left
> unchanged so the difference between "written" and "verified" stays visible.
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

---

# 11. Host verification — 2026-08-19

Executed on the authorized Ubuntu PCI server (`hcaisrv`, Ubuntu 24.04.4 LTS) after the operator ran
the one-time privileged bootstrap. **This section supersedes sections 3 and 7 where they conflict.**

## 11.1 Environment

| Property | Value |
|---|---|
| Docker | 29.1.3 (Ubuntu archive), Compose 2.40.3 |
| `DockerRootDir` | `/data/docker` — **inside the mandatory boundary** |
| `daemon.json` | `{"data-root": "/data/docker"}` |
| Workspace | `/data/pci-platform`, `claude:claude`, repository at `dc3d3f2` |
| PostgreSQL | `postgres:16.4-alpine`, healthy |
| Volume | `/data/docker/volumes/pci-kernel_postgres-data/_data` — inside the boundary |
| Images built | `pci-kernel-kernel:latest`, `pci-kernel-migrate:latest` (227 MB each) |

No PCI project artifact exists outside `/data`. The only file outside it is
`~/.ssh/known_hosts`, which contract v0.2 explicitly exempts as an infrastructure credential.

## 11.2 Acceptance criteria — verified verdicts

| AC | Previous | **Verified** | Evidence |
|---|---|---|---|
| AC-01 Build | PARTIAL | **MET** | Both images built from the committed Dockerfile; `DockerRootDir` confirmed under `/data/docker` |
| AC-02 Database | **NOT MET** | **MET** | `applying 0001_kernel_foundation … migrations complete: 1 applied, 0 already present`; idempotency re-verified by the integration tier |
| AC-03 Create object | MET | MET | contract + integration |
| AC-04 Relationships | MET | MET | contract + integration |
| AC-05 Tenant isolation | PARTIAL | **MET** | RLS + FORCE RLS live; see 11.4 |
| AC-06 Audit | MET | MET | `audit records cannot be updated or deleted by the runtime role` ✔ |
| AC-07 Validation | MET | MET | contract tier |
| AC-08 Health | MET | MET | `/health/ready` 200 with `store: ok` against real PostgreSQL; `/health/live` 200 |
| AC-09 Tests | PARTIAL | **MET** | all three tiers executed with non-zero counts; see 11.3 |
| AC-10 Evidence | MET | MET | this section |

## 11.3 Test tiers — all executed on the target platform

| Tier | Result |
|---|---|
| Unit | **102 pass / 0 fail** |
| Contract | **101 pass / 0 fail** |
| Integration (real PostgreSQL) | **26 pass / 0 fail / 0 skipped / 0 cancelled** |
| **Total** | **229 pass / 0 fail** |

Every tier reported a non-zero test count, which the standing rule requires before a pass may be
claimed. The integration tier had previously never executed.

## 11.4 ADR-0016 obligations — proven against a live database

| Obligation | Evidence |
|---|---|
| Runtime role holds neither SUPERUSER nor BYPASSRLS | `pci_app \| super=false \| bypassrls=false` from `pg_authid` |
| FORCE RLS on every tenant-scoped table | `audit_records, events, knowledge_object_versions, knowledge_objects, provenance_records, relationships` — all `rls=true FORCE=true` |
| Cross-tenant read blocked | ✔ `ADR-0016 layer 3 — row-level security blocks a cross-tenant read` |
| Fail-closed on missing tenant context | ✔ `an unset tenant GUC returns no rows rather than all rows` |
| Cross-tenant relationship rejected | ✔ `a cross-tenant relationship is rejected by the composite foreign key` |
| Audit append-only under the runtime role | ✔ `audit records cannot be updated or deleted by the runtime role` |

Ratification was never verification; these obligations are now demonstrated rather than asserted.

## 11.5 Two defects found on first execution

Both were found *because* the stack ran for the first time, and both are recorded in full:

- **DISC-0007** — `initdb/00-roles.sql` creates `pci_app` **before** the guard that is supposed to
  prevent a passwordless role, the resulting exception does not stop initialisation, and the stack
  reports **healthy** with an unusable role. It also grants the role nothing and never creates the
  `pci_test` database the integration tier documents. Severity: high.
- **DISC-0008** — the compose `kernel` service sets `PCI_IDENTITY_MODE=static` but never supplies
  `PCI_STATIC_PRINCIPALS`, so the service refuses to start. The kernel's fail-closed validation
  behaved correctly; the wiring is incomplete.

### What this means for the verdicts above

The acceptance criteria are genuinely met — the software does what WP-0001 requires, proven against
real infrastructure. **But the stack as committed is not reproducible.** Reaching the verified state
needed two manual steps not present in the repository:

1. `ALTER ROLE pci_app WITH PASSWORD …` and `CREATE DATABASE pci_test OWNER pci_app` (DISC-0007);
2. appending a generated `PCI_STATIC_PRINCIPALS` entry to the uncommitted `.env` (DISC-0008).

A clean checkout plus `docker compose up` still produces a broken stack. That gap is a defect in the
deployment artifacts, not in the kernel, and it is why this report does not describe WP-0001 as
"deployable" despite every acceptance criterion being met.

## 11.6 Secrets handling

All credentials were generated **on the host** with `openssl rand`, written only to
`/data/pci-platform/.env` (mode `0600`, matched by `.gitignore:5`), and never printed to a
terminal, a log, a commit, or a conversation. `git check-ignore -v .env` was confirmed before use.
No credential value appears anywhere in this repository.

## 11.7 Corrections to earlier records

- **DISC-0005 was wrong** about the target platform and has been corrected. `npm test` runs all 203
  unit and contract tests correctly under `/bin/sh`; the zero-test failure is confined to Git Bash
  on Windows. Notably, the "obvious fix" it recommended (pointing `--test` at a directory) is the
  variant that actually breaks — measured, not assumed.
- Section 7's limitation "the container image has never been built" no longer holds. Both images
  are built.

## 11.8 Remaining limitations

- The compose stack is not reproducible from a clean checkout (DISC-0007, DISC-0008).
- The fixed initialisation path cannot be verified without destroying and re-creating the
  PostgreSQL volume, which is a destructive operation and is not authorized.
- Images are tag-pinned, not digest-pinned. Unchanged from the original report.
- The static identity adapter remains a development fixture, prohibited in production, and it warns
  loudly at startup (DISC-0003).

---

# 12. Reproducibility defects fixed — 2026-08-19 (TASK-0004, TASK-0005)

Authorized by MSG-0012. Both defects recorded in section 11.5 are now fixed and verified.

## 12.1 TASK-0004 — database role provisioning (DISC-0007)

`deploy/compose/initdb/00-roles.sql` and the compose postgres service:

- the password guard runs **before** `CREATE ROLE`;
- `\set ON_ERROR_STOP on`, so a failed init exits non-zero instead of continuing;
- minimum password length of 16;
- idempotent `ALTER ROLE` path preserving NOSUPERUSER / NOBYPASSRLS;
- explicit post-creation assertion that neither SUPERUSER nor BYPASSRLS is held;
- grants: `CONNECT` (via `current_database()`), `USAGE` + `CREATE` on `public`;
- `pci_test` created and owned by `pci_app`;
- `PGOPTIONS` supplies `pci.app_password` from `PCI_APP_PASSWORD`.

**Gate G1 — passed**, on a throwaway container with its own ephemeral volume, leaving
`pci-kernel_postgres-data` untouched:

```text
NEGATIVE (no password):  exited exit=3, guard message x3 -- init FAILS, no healthy-but-broken stack
POSITIVE (PGOPTIONS):    password_set=true super=false bypassrls=false login=true
                         CREATE on public: true   USAGE on public: true
                         pci_test: exists=true owner=pci_app
                         no ERROR/FATAL in the init log
```

No manual SQL was run.

## 12.2 TASK-0005 — development principal (DISC-0008)

`.env.example` added per MSG-0012's selection of DISC-0008 option 1: placeholder-only values,
documented generation, and the fail-closed guard left intact.

**Gate G2 — passed:**

```text
no principals      -> refused
placeholder token  -> refused ("token must be a string of at least 16 characters")
documented setup   -> kernel Up (healthy), /health/ready HTTP 200
```

## 12.3 Two defects found in the fixes themselves

1. `GRANT CONNECT ON DATABASE :"POSTGRES_DB"` used a psql variable the entrypoint does not define
   and aborted initialisation — fixed in `a259888`. The abort was itself evidence that the
   `ON_ERROR_STOP` change works.
2. The first placeholder token was 35 characters and therefore **passed** the 16-character minimum.
   An unedited copy of `.env.example` would have produced a running service authenticating against a
   token published in a public repository, while the file claimed all placeholders were rejected.
   Fixed in `4519dfa`.

The second was a security defect introduced by a security fix, caught only because the guard was
run rather than read.

## 12.4 What remains

**A full `docker compose up` from a fresh volume is still unproven.** The live
`pci-kernel_postgres-data` carries the manual workaround from 2026-08-19 and will not re-run
`initdb`, so its state is not evidence of these fixes.

WP-0001 remains **verified but not yet demonstrated reproducible**. Closing that gap is TASK-0006,
which needs explicit authorization to destroy the volume (MSG-0015).

---

# 13. Clean-room reproducibility — 2026-08-19 (TASK-0006)

Authorized by MSG-0016, which explicitly permitted the destructive PostgreSQL volume
re-initialisation for this purpose and for nothing else.

## 13.1 What was destroyed

`pci-kernel_postgres-data`, inspected first and recorded in checkpoint 1 **before** the operation:
databases `pci` and `pci_test`, 8 tables, 0 knowledge objects, 0 audit records, 1 tenant row — only
TASK-0001 verification artifacts and the 2026-08-19 manual workaround.

## 13.2 Gate G3 — PASSED

Rebuilt with `docker compose up -d` from repository configuration and the host `.env` only.
**No manual SQL was run.**

```text
migrations   applying 0001_kernel_foundation ... applied
             migrations complete: 1 applied, 0 already present
role         password_set=true  super=false  bypassrls=false  login=true
privileges   CREATE on public: true | USAGE on public: true
pci_test     exists=true  owner=pci_app
schema       8 tables | 6 with FORCE RLS | 6 policies
kernel       /health/ready HTTP 200 — store ok (1ms), identity ok (static), policy ok
boundary     /data/docker/volumes/pci-kernel_postgres-data/_data
```

## 13.3 What this changes

Sections 11 and 12 recorded WP-0001 as **verified but not reproducible**: the working system had
been reached through two manual steps that did not exist in the repository. That qualifier no
longer applies. A clean initialisation now produces:

- a `pci_app` role with a password and the correct least-privilege posture, created by the
  repository's own init script rather than by hand;
- the `pci_test` database the integration tier documents;
- the full schema with FORCE RLS on all six tenant-scoped tables;
- a kernel that starts and reports healthy against it.

**The DISC-0007 and DISC-0008 fixes are now demonstrated, not merely asserted.** The live database
is, for the first time, evidence of the repository's own behaviour.

## 13.4 Scope boundary

MSG-0016 authorized TASK-0006 alone. The full test-tier re-verification (TASK-0007) was **not**
run, and no acceptance criterion is re-asserted here on the strength of this rebuild. The AC
verdicts in section 11 stand on their original evidence; section 13 adds reproducibility, which was
the missing completion criterion, not new AC evidence.

---

# 14. Full re-verification against the clean-room stack — 2026-08-19 (TASK-0007)

Authorized by MSG-0018, non-destructive. The stack verified here is the one TASK-0006 built from a
destroyed volume, confirmed unchanged by its creation timestamp (`2026-08-19T18:25:02Z`).

## 14.1 Test tiers — all three, all non-zero

| Tier | Result |
|---|---|
| Unit | **102 pass / 0 fail** |
| Contract | **101 pass / 0 fail** |
| Integration (clean-room PostgreSQL) | **26 pass / 0 fail / 0 skipped / 0 cancelled** |
| **Total** | **229 pass / 0 fail** |

## 14.2 ADR-0016 — re-proven against the clean-room database

```text
runtime role   super=false  bypassrls=false
FORCE RLS      6 of 6 RLS-enabled tables
policies       6
```

Named tests, all passing:

- `ADR-0016 layer 3 — row-level security blocks a cross-tenant read`
- `an unset tenant GUC returns no rows rather than all rows` (fail-closed)
- `a cross-tenant relationship is rejected by the composite foreign key`
- `audit records cannot be updated or deleted by the runtime role` (append-only)
- `audit records are not visible across tenants`
- `an object from another tenant is invisible`
- `updating an object in another tenant returns null`
- `listing never returns another tenant's objects`

## 14.3 Acceptance criteria — evidence now describes a reproducible system

All ten remain **MET**. The difference from section 11 is not the verdicts but their basis: that
evidence came from a database repaired by hand, this evidence comes from one the repository built
itself.

| AC | Evidence in this run |
|---|---|
| AC-01 | `pci-kernel-kernel:latest`, `pci-kernel-migrate:latest`; stack built and started from repository configuration |
| AC-02 | Migrations applied by the clean-room rebuild; idempotency re-confirmed by the integration tier |
| AC-03/04 | Contract + integration tiers |
| AC-05 | Section 14.2 — RLS and FORCE RLS proven live |
| AC-06 | `audit records cannot be updated or deleted by the runtime role` |
| AC-07 | Contract tier |
| AC-08 | `/health/ready` 200, `/health/live` 200 |
| AC-09 | Section 14.1 — three tiers, every count non-zero |
| AC-10 | This section |

## 14.4 One boundary finding

The routine `/data` boundary check reported 18 paths under `/home/claude`. Three are OS-provided
shell dotfiles. The rest are `/home/claude/.docker/buildx/*` — **Docker CLI client state created by
the earlier image builds**: builder references, a lock file, a node id. No source, no build output,
no configuration, no data, no credential.

It is nonetheless outside `/data`, and contract v0.2 forbids that with only a named `~/.ssh`
exception. Recorded as **DISC-0009** with two options for the architecture lead: extend the
exception to account-level tool state, or keep the boundary literal and set
`DOCKER_CONFIG=/data/pci-platform/.docker`.

Not deleted. Tidying the operator's account to make a check pass would be the wrong instinct, and
the boundary's scope is the lead's to define rather than mine to narrow by inference.
