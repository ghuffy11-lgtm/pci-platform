# MSG-0003 — Repository Layout Authority and Document Corrections

**Status:** **CLOSED — DECIDED** 2026-08-19 by MSG-0005. Retained as a historical communication record; not deleted.
**Raised:** 2026-08-19
**Raised by:** Claude Code (implementation agent)
**Work package:** WP-0001 — PCI Kernel Foundation

## Issue 1 — Repository map forbids the directories WP-0001 requires

`docs/architecture/repository-map.md:57` states:

> Production code directories are intentionally not created until the platform runtime
> architecture is sufficiently specified. This prevents early implementation choices from
> becoming accidental architecture.

WP-0001 scope item 1 requires establishing "an application/service layout consistent with the
repository architecture", and scope item 2 requires container orchestration.

These cannot both hold. Per `CLAUDE.md` authority order, WP-0001 (level 6) ranks *below*
architecture documents (level 4), so the work package does not automatically override the
repository map.

**Assessment:** this reads as an intentional sequencing gate that WP-0001 was authored to lift,
rather than a genuine contradiction — the map's stated rationale ("until the platform runtime
architecture is sufficiently specified") is satisfied by the existence of an approved kernel
work package. I have proceeded on that reading.

**Directories created:** `services/kernel/`, `deploy/compose/`.

**Correction required:** `docs/architecture/repository-map.md` should be updated to record
`services/` and `deploy/` and to retire or qualify the paragraph at line 57. I have not edited
that document, because doing so would be a silent architecture change prohibited by Constitution
principle 13.

## Issue 2 — Active work package path is wrong in two places

`implementation/status/current.md:13` and `CLAUDE.md` (Mandatory Startup, step 4) both point to
`implementation/work-packages/`. That directory does not exist.

The work package is actually at `docs/program/work-packages/WP-0001-kernel-foundation.md`.

**Action taken:** I corrected `implementation/status/current.md` to reference the real path.
I did **not** edit `CLAUDE.md`, as it is an operating-rules document owned by the architecture
lead.

**Correction required:** either move work packages under `implementation/work-packages/`, or
amend `CLAUDE.md` to point at `docs/program/work-packages/`. My recommendation is to amend
`CLAUDE.md`, since `docs/program/work-packages.md` already establishes the `docs/program`
location.

## Issue 3 — Mandated communication directories did not exist

`CLAUDE.md` mandates `implementation/reports/`, `implementation/blockers/`,
`implementation/discoveries/`, and `implementation/decisions/`. Only `comms/` and `status/`
existed.

**Action taken:** created all four with `README.md` files describing their purpose. This is
scaffolding explicitly required by the operating rules, not an architecture change.

## Issue 4 — Duplicated governance documents across `knowledge/` and `docs/`

The following exist in both trees with differing content:

| Concern | `knowledge/` | `docs/` |
|---|---|---|
| Architecture principles | `knowledge/architecture/architecture-principles.md` | `docs/architecture/architecture-principles.md` |
| ADR-0001 | `knowledge/decisions/ADR-0001-...` | `docs/decisions/ADR-0001-...` |
| Repository map | `knowledge/engineering/repository-map.md` | `docs/architecture/repository-map.md` |
| Relationship taxonomy | `knowledge/model/relationship-taxonomy.md` | `docs/knowledge/relationship-taxonomy.md` |
| Knowledge quality | `knowledge/governance/knowledge-quality.md` | `docs/knowledge/knowledge-quality.md` |
| Vision | `knowledge/product/vision.md` | `docs/product/vision.md` |

`AGENTS.md` directs agents to `knowledge/`; `README.md` and `CLAUDE.md` direct them to `docs/`.
Two divergent copies of a governance document create a real risk that an implementation agent
follows the stale one.

**Action taken:** none. I implemented against the `docs/` tree because WP-0001's Source Authority
list names `docs/` artifacts. Recorded in `implementation/discoveries/DISC-0001-...`.

**Decision required:** which tree is authoritative, and should the other become a generated
projection or be removed?

## Decision required (summary)

1. Confirm WP-0001 lifts the `repository-map.md:57` gate; approve updating that document.
2. Choose the canonical work-package location and correct `CLAUDE.md` accordingly.
3. Designate the authoritative governance tree (`knowledge/` vs `docs/`).

---

## Resolution — 2026-08-19

Decided by the architecture lead in `implementation/comms/MSG-0005-architecture-lead-decisions.md`:

- **Issue 1 (repository map / sequencing gate).** The WP-0001 layout is accepted. `services/`,
  `deploy/`, and `implementation/` are valid top-level areas, and the sequencing gate is lifted
  for this approved layout. Future top-level code areas still require an approved work package or
  ADR. `docs/architecture/repository-map.md` has been updated accordingly.
- **Issue 2 (work-package location).** `docs/program/work-packages/` is canonical. `CLAUDE.md`
  startup step 4 has been corrected to point there. Option 1A of MSG-0004; nothing moved.
- **Issue 3 (mandated directories).** No decision needed; the directories were scaffolding
  required by `CLAUDE.md` and now appear in the repository map.
- **Issue 4 (governance tree).** `docs/` is authoritative for architecture, ADRs, specifications,
  engineering, operations, product, program, and security governance.
  `knowledge/governance/constitution.md` remains authoritative for the Constitution itself. Other
  `knowledge/` duplicates are legacy and must not override `docs/`. `AGENTS.md` now records this.

**The legacy duplicates were deliberately NOT deleted.** The lead directed that migration or
removal is a separate controlled cleanup task. The divergence recorded in DISC-0001 therefore
still exists on disk; what has changed is that precedence is now unambiguous.

This message is closed and retained as a historical record.
