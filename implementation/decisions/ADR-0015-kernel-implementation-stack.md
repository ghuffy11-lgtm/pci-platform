# ADR-0015 — Kernel Implementation Stack (PROPOSED)

**Status:** PROPOSED — requires ratification by the architecture lead
**Date:** 2026-08-19
**Proposed by:** Claude Code (implementation agent)
**Work package:** WP-0001 — PCI Kernel Foundation
**Communication:** `implementation/comms/MSG-0002-kernel-runtime-stack.md`

> This ADR is **not accepted**. It is recorded in `implementation/decisions/` per `CLAUDE.md`.
> It must be reviewed and promoted to `docs/decisions/` by the architecture lead before it
> carries architectural authority.

## Context

WP-0001:119 delegates the language/framework choice to the implementation agent, subject to
justification against `docs/architecture/technology-selection-principles.md` and an ADR where the
choice is a significant architectural commitment. The kernel runtime language is such a commitment.

## Decision

The PCI platform kernel is implemented in **TypeScript on Node.js 24 LTS**, with:

| Concern | Choice | Rationale |
|---|---|---|
| Language | TypeScript | Static types on the domain model; erased at runtime |
| Runtime | Node.js 24 LTS | Active LTS; native type-stripping removes the build step in development |
| HTTP | `node:http` + internal router | No framework dependency (`claude-code-rules.md:25`) |
| Tests | `node:test` + `node:assert` | Built in; no test-framework dependency |
| Database | PostgreSQL 16 via `pg` (MIT) | Mandated by WP-0001 scope item 3 and `data-architecture.md:41` |
| Migrations | Ordered plain SQL + deterministic runner | Committed DDL cannot drift from an ORM's generated schema |
| Config | Environment variables | Twelve-factor; keeps secrets out of source control (ADR-0009) |

`pg` is the sole production dependency.

## Rationale

Assessed against each Technology Selection Principle:

- **Standards support** — mature OpenAPI, OpenTelemetry, and OIDC client ecosystems; JSON-LD
  (ADR-0006) is plain JSON in this runtime.
- **Security** — active LTS with a defined CVE process; a one-dependency production tree is a
  materially smaller supply-chain surface than a framework stack.
- **Maturity** — Node.js LTS and TypeScript are both long-established.
- **Interoperability** — the external contract is HTTP/JSON and SQL, both language-neutral.
- **Operational simplicity** — one small OCI image; no JVM tuning or native toolchain.
- **Performance** — the kernel is I/O-bound; the runtime is not the constraint at this scale.
- **License compatibility** — MIT/Apache-2.0 only; satisfies Constitution principle 3.
- **Replaceability** — see below.

### Decisive practical constraint

Node.js is the only language runtime present on the authoring host (Python, Go, Java, and .NET
are all absent — see MSG-0001). The Constitution requires tested work before completion is
reported; choosing an absent runtime would leave every acceptance criterion unverifiable.

This is recorded plainly as a practical determinant. It is **not** a claim that Node.js is
architecturally superior to Go or Python for this kernel, and the architecture lead should
overturn this ADR if the long-term platform direction favours a different runtime. The cost of
overturning it is bounded by the replaceability measures below.

## Replaceability (Constitution principle 6, Five-Year Test)

The durable artifacts are the HTTP contract (`services/kernel/openapi/kernel.yaml`) and the SQL
schema (`services/kernel/migrations/`). Neither depends on Node.js.

Enforced structure:

```text
domain/       pure TypeScript, zero I/O, zero framework types  -> portable logic
ports/        interfaces only                                   -> the replacement seam
application/  orchestration over ports                          -> portable logic
adapters/     PostgreSQL, in-memory, identity, policy           -> the only I/O
http/         node:http transport                               -> the only runtime coupling
```

A rewrite in another language reimplements `http/` and `adapters/` against an unchanged contract
and schema. `domain/` and `application/` translate mechanically.

## Consequences

- No AI model, inference provider, or vector store is introduced (ADR-0003 preserved).
- No proprietary or cloud-only dependency enters the core path (ADR-0014 preserved).
- Offline operation is preserved: the runtime image and `pg` can be vendored into an offline
  artifact bundle under SPEC-0026.
- Hand-written routing and validation carry a small ongoing maintenance cost, accepted in
  exchange for the reduced dependency surface.
- Node's type-stripping does not support TypeScript `enum`, `namespace`, or decorators. The
  codebase uses `const` objects and union types instead. This is a deliberate constraint.

## Alternatives considered

| Option | Assessment |
|---|---|
| **Go** | Excellent operational fit — single static binary, strong concurrency. Genuinely competitive and arguably the better five-year choice for a kernel. Rejected here only because the toolchain is absent, making WP-0001 unverifiable. Worth revisiting. |
| **Python + FastAPI** | Strongest long-term AI-ecosystem alignment for later phases. Absent from the host; also a heavier dependency tree and weaker runtime type guarantees for a governance-critical kernel. |
| **Java/Kotlin + Spring** | Mature and well-governed, but the heaviest operational footprint, contradicting `technology-selection-principles.md` "Operational Fit" for the target customer. |
| **Node.js + Express/Fastify/Prisma** | Conventional and faster to write. Rejected for WP-0001 to keep the supply-chain surface minimal and to prevent an ORM from becoming the de facto schema authority, which would conflict with "derived indexes must not become the canonical source of truth". |

## Decision required

Ratify, amend, or reject. If ratified, promote to `docs/decisions/ADR-0015-...` and update
`docs/architecture/technology-standards.md`.
