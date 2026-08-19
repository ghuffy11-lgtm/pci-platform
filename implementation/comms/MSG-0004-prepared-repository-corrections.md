# MSG-0004 — Prepared Repository Corrections for MSG-0003

**Status:** **CLOSED — APPLIED** 2026-08-19. Approved by MSG-0005; corrections 1, 2, and 4 applied, plus the governance-tree ruling. Retained as a historical communication record; not deleted.
**Raised:** 2026-08-19
**Raised by:** Claude Code (implementation agent)
**Work package:** WP-0001 — PCI Kernel Foundation (reconciliation only; no new work package started)
**Supersedes nothing.** `MSG-0003` was the decision of record; both are now CLOSED by MSG-0005 and retained as history.

## Purpose

The architecture lead asked for the *minimum* repository corrections that would resolve MSG-0003
to be **prepared but not executed**. This message is that preparation.

Every change below is written out exactly as it would be applied, against verified current file
content. **None of them had been made when this message was written.** (They were applied later, on approval — see Outcome at the end.) No file named in this message was modified by the
commit that adds this message. Each targets a document owned by the architecture lead
(`CLAUDE.md`, `docs/architecture/repository-map.md`) or the governance trees, and applying any of
them unilaterally would be the silent architecture change that Constitution principle 13 and
`CLAUDE.md`'s authority order prohibit.

Nothing here ratifies a decision. Where a choice exists, both options are stated, and a
recommendation is marked as a recommendation.

---

## Correction 1 — Canonical work-package location

**MSG-0003 Issue 2.** `CLAUDE.md` startup step 4 and, previously, the status file pointed at
`implementation/work-packages/`, which does not exist.

Verified current state:

```text
docs/program/work-packages/WP-0001-kernel-foundation.md   exists
implementation/work-packages/                             does not exist
docs/program/work-packages.md                             exists (establishes the docs/program location)
```

Two mutually exclusive options; the lead picks one.

**Option 1A — declare `docs/program/work-packages/` canonical (recommended).** It is where the
only work package actually lives, and `docs/program/work-packages.md` already establishes that
location as the standard. Zero files move; one line of `CLAUDE.md` changes (Correction 2).

**Option 1B — move work packages to `implementation/work-packages/`.** Then `CLAUDE.md` is
already correct, and instead:

```bash
git mv docs/program/work-packages implementation/work-packages
```

plus updating every reference to the old path, including `docs/program/work-packages.md`,
`implementation/status/current.md`, and the WP-0001 report. This is the larger change, and it
splits program documentation across two trees.

**Recommendation:** Option 1A. **Not applied — the canonical location is the lead's to designate.**

---

## Correction 2 — `CLAUDE.md` path correction

Follows from Correction 1 and is valid only under Option 1A.

**File:** `CLAUDE.md`, line 27, section "Mandatory Startup".

Current:

```markdown
4. Read the active work package under `implementation/work-packages/`.
```

Prepared replacement:

```markdown
4. Read the active work package under `docs/program/work-packages/`.
```

That single line is the whole correction. Lines 25, 26, 75, and 103 of `CLAUDE.md` reference
`AGENTS.md` and `implementation/status/current.md`; both exist at the stated paths and need no
change.

**Not applied — `CLAUDE.md` is an operating-rules document owned by the architecture lead.**

---

## Correction 3 — Authoritative governance tree (`knowledge/` vs `docs/`)

**MSG-0003 Issue 4, DISC-0001.** Six governance concerns exist in both trees. Verified: **every
duplicated pair differs in content.** None is a stale-but-identical copy.

| Concern | `knowledge/` | `docs/` | State |
|---|---|---|---|
| Architecture principles | 44 lines | 24 lines | differ |
| Repository map | 33 lines | 57 lines | differ |
| Relationship taxonomy | 50 lines | 46 lines | differ |
| Knowledge quality | 33 lines | 32 lines | differ |
| Vision | 51 lines | 45 lines | differ |
| ADRs | 1 record (ADR-0001 only) | 14 records (ADR-0001 to ADR-0014) | diverged |

Further evidence, offered as fact rather than as a decision:

- Last commit touching `knowledge/`: `8ae5fe0`, 2026-08-18.
- Last commit touching `docs/`: `6765aa9`, 2026-08-19 — the accepted bootstrap contract.
- `AGENTS.md` directs agents to `knowledge/`; `README.md` and `CLAUDE.md` direct them to `docs/`.
- WP-0001's Source Authority list names `docs/` artifacts, which is why the kernel was
  implemented against `docs/`.

**Recommendation:** designate `docs/` authoritative — it holds all fourteen ADRs, received the
most recent accepted contract, and is what the active work package cites. Then either retire the
`knowledge/` duplicates or regenerate them as an explicit projection.

Prepared follow-up once the lead decides (not applied):

- Amend `AGENTS.md` "Required Reading" to cite the authoritative tree, resolving its conflict
  with `README.md` and `CLAUDE.md`.
- For each duplicated pair, either delete the non-authoritative copy, or add a header marking it
  a generated projection and naming its source path.

**This is a genuine architectural decision and is explicitly NOT taken here.** Deleting or
demoting a governance tree on my own judgement is exactly what the operating rules forbid. The
risk stays live until the lead rules: six documents currently give two different answers to the
same question, and an implementation agent can follow the wrong one.

---

## Correction 4 — Repository map: record `services/` and `deploy/`

**MSG-0003 Issue 1.** `docs/architecture/repository-map.md` does not list the directories WP-0001
created, and its closing paragraph forbids them.

### 4a — directory tree

Lines 6 to 24 currently read:

```text
/
├── AGENTS.md
├── README.md
├── knowledge/
│   ├── governance/
│   ├── model/
│   └── examples/
└── docs/
    ├── architecture/
    ├── decisions/
    ├── engineering/
    ├── operations/
    ├── product/
    ├── program/
    ├── security/
    ├── specifications/
    └── templates/
```

Prepared replacement — adds only what exists on disk today:

```text
/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── knowledge/
│   ├── governance/
│   ├── model/
│   └── examples/
├── docs/
│   ├── architecture/
│   ├── decisions/
│   ├── engineering/
│   ├── knowledge/
│   ├── operations/
│   ├── product/
│   ├── program/
│   ├── security/
│   ├── specifications/
│   └── templates/
├── services/
│   └── kernel/
├── deploy/
│   └── compose/
└── implementation/
    ├── blockers/
    ├── comms/
    ├── decisions/
    ├── discoveries/
    ├── reports/
    └── status/
```

### 4b — new directory-responsibility entries

To be inserted after the `docs/templates/` entry (current line 50):

```markdown
### `services/`
Deployable platform services. Each subdirectory is one independently buildable service.
`services/kernel/` is the WP-0001 platform kernel.

### `deploy/`
Deployment topology and orchestration definitions. `deploy/compose/` holds the Docker Compose
stack. Persistent runtime state belongs under the `/data/docker` boundary defined in
`docs/operations/pci-server-bootstrap.md`, never inside the repository.

### `implementation/`
Claude Code's implementation communication channel: status, reports, blockers, discoveries,
proposed decisions, and direct messages to the architecture lead. Mandated by `CLAUDE.md`.
```

### 4c — the sequencing gate at line 57

Current text:

```markdown
## Future Code Layout

Production code directories are intentionally not created until the platform runtime architecture
is sufficiently specified. This prevents early implementation choices from becoming accidental
architecture.
```

Prepared replacement:

```markdown
## Code Layout

Production code directories were intentionally withheld until the platform runtime architecture
was sufficiently specified, so that early implementation choices could not become accidental
architecture. That gate was lifted by the approval of WP-0001, which specifies the kernel runtime
and mandates a service layout. `services/` and `deploy/` exist under that authority.

New top-level code directories still require an approved work package or ADR.
```

**Not applied.** MSG-0003 Issue 1 asked the lead to *confirm* that WP-0001 lifts this gate. I
proceeded on that reading in order to build the kernel and recorded it at the time, but writing
the confirmation into the architecture document is the lead's act, not mine. If the reading is
wrong, the remedy is to overturn it — `services/kernel/` and `deploy/compose/` would then need
relocating or withdrawing, and I should be told so.

---

## Summary of what is required

| # | Correction | File(s) | Decision needed |
|---|---|---|---|
| 1 | Canonical work-package location | *(designation only)* | Choose 1A or 1B |
| 2 | Startup path correction | `CLAUDE.md` line 27 | Follows from 1A |
| 3 | Authoritative governance tree | `AGENTS.md`, one of the two trees | **Genuine architectural decision** |
| 4 | Record `services/`, `deploy/`, `implementation/`; retire the gate | `docs/architecture/repository-map.md` | Confirm WP-0001 lifts the gate |

**Status: PREPARED, NOT APPLIED.** On approval, corrections 1, 2, and 4 are mechanical and can be
applied in a single commit. Correction 3 needs the lead's ruling before any file changes, because
its options are mutually exclusive and destructive in one direction.

`MSG-0003` stays **OPEN** as the decision of record; this message only supplies the exact edits.

---

## Outcome — 2026-08-19

Approved by `implementation/comms/MSG-0005-architecture-lead-decisions.md` and applied.

| # | Correction | Outcome |
|---|---|---|
| 1 | Canonical work-package location | **Option 1A adopted.** `docs/program/work-packages/` is canonical; no files moved. |
| 2 | `CLAUDE.md` line 27 | **Applied** exactly as prepared. |
| 3 | Authoritative governance tree | **Decided:** `docs/` authoritative, with `knowledge/governance/constitution.md` excepted. `AGENTS.md` updated. Legacy duplicates retained by explicit instruction — deletion is a separate controlled task. |
| 4 | Repository map | **Applied**, extended beyond the prepared text to record `implementation/`, `CLAUDE.md`, and `docs/program/` per the lead's ruling. |

One deviation from the prepared text is worth stating plainly: correction 3 was prepared as a
straight choice between the two trees, and the lead's ruling was narrower — `docs/` wins
generally, but the Constitution stays in `knowledge/governance/`. The applied wording follows the
ruling, not the prepared recommendation.

This message is closed and retained as a historical record.
