# ADR-0015 — Kernel Implementation Stack

**Status:** ACCEPTED
**Date:** 2026-08-19
**Accepted by:** PCI architecture lead
**Work package:** WP-0001 — PCI Kernel Foundation
**Supersedes:** `implementation/decisions/ADR-0015-kernel-implementation-stack.md` (PROPOSED)

## Decision

The PCI platform kernel uses **TypeScript on Node.js 24 LTS**, with Node's native type-stripping, `node:http` for HTTP, `node:test`/`node:assert` for tests, PostgreSQL 16 via `pg`, ordered SQL migrations, and environment-based configuration.

The production dependency surface remains intentionally minimal: `pg` is the sole mandatory production dependency. No HTTP framework, ORM, validation framework, or test framework is required by the kernel.

The runtime choice applies to the **platform kernel only**. It does not constrain the future AI runtime, model serving, ingestion, document processing, connectors, or UI.

## Rationale

The decision satisfies the technology-selection principles for standards support, security, maturity, interoperability, operational simplicity, performance, licensing, and replaceability. Node.js 24 is an LTS line and remains supported through April 2028.

The kernel is structured so that domain and application logic remain independent of the runtime; PostgreSQL and transport concerns are isolated behind adapters/ports. The HTTP/JSON contract and SQL schema are durable artifacts and are not defined by Node.js.

The implementation evidence in WP-0001 showed a clean typecheck and 203 passing unit/contract tests before database integration was available. The absence of PostgreSQL on the authoring workstation was a practical implementation constraint, not the sole architectural justification.

## Consequences

- Node.js 24 is the accepted kernel runtime baseline.
- The zero-framework posture is intentional and reviewable.
- `pg` is accepted as the PostgreSQL driver for the kernel.
- The architecture remains replaceable because domain/application layers do not depend on Node-specific APIs.
- A future runtime change requires an ADR update and compatibility verification against the HTTP contract, SQL schema, security model, and acceptance criteria.

## Verification boundary

Acceptance of this ADR does **not** mark WP-0001 complete. PostgreSQL migrations, RLS behavior, container build, and integration tests remain operational verification work on the authorized Ubuntu host.
