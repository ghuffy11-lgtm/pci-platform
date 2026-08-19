# MSG-0001 — Authorized Execution Host and Persistent Storage Boundary

**Status:** OPEN
**Raised:** 2026-08-19
**Raised by:** Claude Code (implementation agent)
**Work package:** WP-0001 — PCI Kernel Foundation
**Blocks:** AC-01 (Build), AC-02 (Database), AC-09 (integration test tier)
**Related:** `implementation/blockers/BLK-0001-no-execution-environment.md`

## Issue

WP-0001 requires container orchestration for the kernel (scope item 2), PostgreSQL as the
transactional store (scope item 3), and database initialization from migrations (AC-02).

No execution environment capable of satisfying these exists in the authoring session, and no
execution host is recorded anywhere in the repository.

## Evidence

Tooling inventory of the current authoring host (Windows Server 2022, `D:\Work\pci-platform`):

| Tool | Result |
|---|---|
| Node.js | v24.15.0 present |
| npm | 11.12.1 present |
| git | 2.55.0 present |
| Docker / Docker Compose | **absent** |
| PostgreSQL / `psql` | **absent** |
| Python, Go, Java, .NET | absent |

Repository search results:

- The string `/data/docker` does **not** appear anywhere in the repository.
- No hostname, address, credential reference, or access method for an implementation host
  appears anywhere in the repository.
- `docs/operations/deployment-architecture.md:18` and `docs/operations/installation-architecture.md:38`
  describe Ubuntu Server + Docker only as an *initial reference environment* that is explicitly
  "not a permanent architectural dependency".
- `docs/specifications/SPEC-0026-deployment-and-air-gap.md:23` states the same.
- `docs/operations/deployment-architecture.md:22` states the governing storage principle:
  "Container writable layers and image caches must not consume the operating-system root
  filesystem without bounds. Persistent PCI data, model data, knowledge stores, backups, and
  large artifacts should reside on explicitly managed data storage."

The storage *principle* is recorded. The concrete path, device, and boundary are not.

## Why this was not assumed

`docs/engineering/claude-code-rules.md:29` prohibits modifying systems from development tooling
without explicit authorization. An unrecorded host is not an authorized host, and the operating
rules forbid using the user as a technical messenger to supply that authorization verbally.

## Options

**Option A — Authorize and record a dedicated Ubuntu implementation host.**
Record hostname/address, access method, the persistent data path, and the storage boundary in
`docs/operations/`. Highest fidelity: AC-01, AC-02, and the full AC-09 tier become verifiable.

**Option B — Authorize a local container runtime on the authoring host.**
Install Docker Desktop / Rancher Desktop on the Windows authoring host. Lower fidelity than the
Ubuntu reference environment but unblocks AC-02 and integration tests immediately.

**Option C — Defer the PostgreSQL-backed tiers.**
Deliver the kernel with migrations and the PostgreSQL adapter written but unexecuted, verified
only through the adapter-agnostic contract suite. AC-02 and the integration tier of AC-09
remain formally unmet.

## Recommendation

**Option A**, with Option C applied in the interim so implementation is not idle.

I have proceeded under Option C. All work that does not require a live PostgreSQL instance is
complete and tested. Nothing has been executed against, installed on, or written to any host
other than this repository working tree.

## Decision required

1. Is there an authorized Ubuntu implementation host for WP-0001? If yes, record its address,
   access method, and authorization scope in the repository.
2. What is the exact persistent storage boundary intended by `/data/docker`? Specifically:
   - Is `/data/docker` the Docker daemon `data-root` (images, writable layers), the PCI
     persistent volume root, or both?
   - Which paths may the kernel's compose stack bind-mount?
   - Is the kernel permitted to write anywhere outside that boundary?
3. Should this boundary be promoted into `docs/operations/deployment-architecture.md` as a
   normative storage requirement rather than remaining an unrecorded convention?

## Constraint until answered

I will not connect to, install on, or mutate any host outside this repository working tree.
