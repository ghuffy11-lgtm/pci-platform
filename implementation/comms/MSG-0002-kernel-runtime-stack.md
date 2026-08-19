# MSG-0002 — Kernel Implementation Stack Selection

**Status:** **CLOSED — DECIDED** 2026-08-19. ADR-0015 was ratified by MSG-0005 and promoted to `docs/decisions/ADR-0015-kernel-implementation-stack.md` (ACCEPTED). Retained as a historical record; not deleted.
**Raised:** 2026-08-19
**Raised by:** Claude Code (implementation agent)
**Work package:** WP-0001 — PCI Kernel Foundation
**Proposed decision:** `implementation/decisions/ADR-0015-kernel-implementation-stack.md`

## Issue

WP-0001:119 delegates the language/framework choice to Claude Code but requires that the choice
be justified against the Technology Selection Principles and "recorded in an ADR if it creates a
significant architectural commitment".

The kernel runtime language is a significant architectural commitment. It is therefore recorded
as a **proposed** ADR requiring ratification by the architecture lead. It is not self-accepted.

## Selection

**Node.js 24 LTS + TypeScript**, using Node's native type-stripping, the built-in `node:test`
runner, and `node:http`. Sole production dependency: `pg` (PostgreSQL driver, MIT).

## Justification against Technology Selection Principles

| Criterion | Assessment |
|---|---|
| Standards support | Mature OpenAPI, OpenTelemetry, and OIDC client tooling; JSON-LD is native JSON |
| Security | Active LTS with a defined security-release process; minimal dependency surface |
| Maturity | Node.js 24 is LTS; TypeScript is an industry-standard type layer |
| Interoperability | HTTP/JSON contract is language-neutral by construction |
| Operational simplicity | Single OCI image, no JVM or GC tuning, low operator burden |
| Performance | Adequate for an I/O-bound transactional kernel |
| License compatibility | Node (MIT), TypeScript (Apache-2.0), `pg` (MIT) — satisfies zero-mandatory-licensing |
| Replaceability | Domain and application layers contain no runtime-specific constructs |

## Decisive constraint

Node.js is the **only** language runtime present on the authoring host. Python, Go, Java, and
.NET are all absent. The Constitution and `AGENTS.md:21` require that changes be tested before
completion is reported. Selecting an absent runtime would make every acceptance criterion
unverifiable in this session. This constraint is recorded honestly: it is a practical
determinant, not a claim that Node.js is architecturally superior to the alternatives.

## Explicit non-commitments

Selecting Node.js for the kernel does **not** commit PCI to Node.js for:

- the AI runtime or model-serving tier;
- ingestion, document processing, or embedding pipelines;
- domain connectors;
- the eventual UI.

`docs/architecture/platform-kernel.md:32` requires kernel contracts to change slowly. The
HTTP/JSON contract and SQL schema are the durable artifacts; the runtime behind them is not.

## Dependency-minimisation position

`docs/security/supply-chain-security.md` requires pinned production dependencies and minimal
images. `docs/engineering/claude-code-rules.md:25` prohibits new dependencies where an existing
capability suffices. Accordingly no HTTP framework, ORM, validation library, test framework, or
assertion library was introduced. Routing, validation, and tests use Node built-ins.

This trades a small amount of hand-written wiring for a near-zero third-party attack surface and
straightforward offline artifact acquisition under SPEC-0026. If the architecture lead prefers a
conventional framework, that is a legitimate alternative and this is the moment to say so.

## Decision required

1. Ratify, amend, or reject proposed ADR-0015.
2. Confirm or overturn the zero-framework dependency posture.
3. Confirm whether `pg` is acceptable as the sole production dependency, or whether the driver
   should also be abstracted behind a port for a future non-PostgreSQL store.
