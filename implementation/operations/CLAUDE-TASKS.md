# Claude Code Execution Queue

**This file is the authoritative execution queue.** `CLAUDE.md` requires every session to read it
at startup and to execute the highest-priority **READY** task, following that task's prerequisites,
allowed actions, forbidden actions, verification requirements, documentation requirements, and stop
conditions.

Only the architecture lead may authorize new work, mark a task READY, or change priority or scope.
Claude Code may propose follow-up tasks; a proposed task is **not** executable until the
architecture lead marks it READY.

## Status values

| Status | Meaning |
|---|---|
| **READY** | Authorized. Execute when it is the highest-priority READY task. |
| **BLOCKED** | Authorized, but a prerequisite is unmet. Do not attempt beyond the prerequisite check. |
| **PROPOSED** | Written by Claude Code as a suggestion. **Not authorized.** Do not execute. |
| **DONE** | Completed and verified, with evidence recorded in the repository. |

READY means *authorized to attempt*, never *authorized to force*. Prerequisites are checked before
a task's actions begin. If a prerequisite is unmet, the task stops there and records why — it does
not proceed by another route.

## Queue

| # | Task | Priority | Status |
|---|---|---|---|
| TASK-0001 | Complete WP-0001 verification on the authorized host | 1 | **DONE** — 2026-08-19, all ten AC met and verified |
| TASK-0002 | Make the test entry points shell-independent (DISC-0005) | — | **WITHDRAWN** — premise disproven by measurement |
| TASK-0003 | Normalise `*.md` line endings to LF (DISC-0006) | 3 | PROPOSED — not authorized |
| TASK-0004 | Fix database role provisioning (DISC-0007) | 1 | PROPOSED — not authorized |
| TASK-0005 | Fix compose kernel service configuration (DISC-0008) | 2 | PROPOSED — not authorized |

**No task is currently READY.** TASK-0001 is complete; TASK-0004 and TASK-0005 address the two
defects found while executing it and require the architecture lead to mark them READY before any
work begins.

---

## TASK-0001 — Complete WP-0001 verification on the authorized host

**Priority:** 1
**Status:** **DONE** — 2026-08-19. All ten acceptance criteria met and verified on the authorized host. See the completion record at the end of this task.
**Work package:** WP-0001 — PCI Kernel Foundation
**Authority:** MSG-0005 (implementation authorization), MSG-0008 (bootstrap procedure)
**Blocker:** BLK-0004 — step 3 of MSG-0008 not executed

### Objective

Convert WP-0001 from IMPLEMENTED to genuinely VERIFIED by exercising it against real
infrastructure. AC-02 is unmet and AC-01, AC-05, and AC-09 are partial; all four require a running
container runtime and a real PostgreSQL instance.

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | Docker installed and healthy, `DockerRootDir` under `/data/docker` — i.e. `sudo bash /data/pci-platform/deploy/bootstrap/pci-server-bootstrap.sh` has been run by the operator | **MET** — verified 2026-08-19, `DockerRootDir` = `/data/docker` |
| P2 | `/data/pci-platform` exists, owned by `claude`, containing the repository | MET — verified 2026-08-19, clone at `9f19bce` |
| P3 | SSH access to the host as `claude` | MET — verified 2026-08-19 |

**Check P1 first.** If unmet: update BLK-0004, stop, and report. Do not install Docker by another
route, do not use a package manager without authorization, and do not attempt rootless Docker.

### Allowed actions

Once P1 is met, all work happens inside `/data/pci-platform` and `/data/docker`:

1. Fix DISC-0005 — make the test entry points shell-independent — **before** trusting any test
   result on this host, and confirm each tier reports a non-zero test count.
2. Bring up PostgreSQL from `deploy/compose/`, with persistent state inside `/data/docker`.
3. Run the migrations (`npm run migrate`).
4. Run the integration tier against the real database.
5. Prove the ADR-0016 obligations against the live database: FORCE RLS enabled, the runtime role
   holding neither SUPERUSER nor BYPASSRLS, and cross-tenant reads returning 404.
6. Build the container image (AC-01).
7. Verify no PCI runtime state exists outside `/data/docker`.

### Forbidden actions

- Creating any PCI artifact outside `/data` — no exceptions, including temporary files.
- Working around a permission denial by any route.
- Modifying the pre-existing non-PCI directories under `/data` (`postgres`, `grafana`, `n8n`,
  `ollama`, `loki`, `redis`, and the rest). `/data/postgres` is **not** the PCI database directory.
- Modifying unrelated host infrastructure, storage, boot, kernel, or network configuration.
- Reporting any acceptance criterion as met without recorded evidence.
- Beginning the next work package.

### Verification requirements

Each of these needs recorded evidence, quoted rather than summarised:

| AC | Evidence required |
|---|---|
| AC-01 | Container image built; bootstrap evidence block; `DockerRootDir` under `/data/docker` |
| AC-02 | Migrations applied to a real PostgreSQL instance; schema present |
| AC-05 | Cross-tenant read returns 404 against the live database, with FORCE RLS on and a non-BYPASSRLS role |
| AC-09 | Integration tier executed with a **non-zero** test count; unit and contract counts re-confirmed on this host |

Exit code 0 is not evidence. A tier reporting zero tests is a failure, not a pass.

### Documentation requirements

- Update `implementation/reports/WP-0001-kernel-foundation-report.md` with real results.
- Update `implementation/status/current.md`: AC verdicts, blockers, next action.
- Close or narrow BLK-0001 and BLK-0004 with evidence.
- Close MSG-0008 once step 3 is verified.
- Record any new discovery in `implementation/discoveries/`.
- Commit and push **before** reporting completion.

### Stop conditions

Stop, record, push, and report if:

- P1 is unmet;
- any privileged operation is required that is not already authorized;
- an acceptance criterion cannot be verified with real evidence;
- the `/data` boundary would have to be crossed to proceed;
- a test tier reports zero tests;
- tenant isolation fails against the live database — that is a security finding, not a bug to work
  around, and it is recorded as such before anything else proceeds.

### Completion

TASK-0001 is DONE only when every acceptance criterion carries recorded evidence, or when the
criteria that remain unmet are explicitly recorded with the reason. WP-0001 is not declared
complete on the strength of code running.

---

## TASK-0002 — Make test entry points shell-independent (PROPOSED)

**Status:** **WITHDRAWN** 2026-08-19 — the premise is disproven. Do not execute.
**Source:** DISC-0005 (corrected)

> **The paragraph below is retained but WRONG.** Measured on the authorized host: `npm test` runs
> all 203 unit and contract tests correctly under `/bin/sh`. The zero-test failure is confined to
> Git Bash on Windows. Worse, the proposed fix — pointing `--test` at a directory — is the variant
> that actually breaks (1 test, 1 fail). Applying it would have introduced the failure it was meant
> to prevent. See the correction in DISC-0005.

`npm test` exits 0 while running zero tests under a POSIX shell, which is the default on the target
host. The scripts single-quote their globs, so `node --test` matches nothing. This can manufacture
AC-09 evidence that does not exist.

Proposed fix: make each tier's glob shell-independent and treat a zero test count as failure.
Folded into TASK-0001 step 1 as a precondition for trusting any result there, but recorded
separately because the package definition change deserves its own review.

**Withdrawn.** The only part worth keeping is the standing rule that a tier reporting zero tests is
a failure — which now lives in `CLAUDE.md` Rule 10.

## TASK-0003 — Normalise `*.md` line endings to LF (PROPOSED)

**Status:** PROPOSED — not authorized. Do not execute.
**Source:** DISC-0006

Record files acquire CRLF on checkout, which silently defeats line-anchored edits — a substitution
matches nothing and exits 0. This has already produced one inaccurate commit message.

Proposed fix: add `*.md text eol=lf` to `.gitattributes`. This is repository-wide normalisation
touching files owned by the architecture lead, so it is proposed rather than applied.

---

## TASK-0001 — completion record (2026-08-19)

**DONE.** Executed on the authorized Ubuntu host after the operator ran the privileged bootstrap.

| Prerequisite | Outcome |
|---|---|
| P1 Docker healthy, `DockerRootDir` under `/data/docker` | MET — verified directly, `/data/docker` |
| P2 workspace with repository | MET |
| P3 SSH access | MET |

Results:

- **229 tests pass, 0 fail** — 102 unit, 101 contract, 26 integration against real PostgreSQL.
  Every tier reported a non-zero count.
- **All ten acceptance criteria MET.** AC-02 moved from NOT MET; AC-01, AC-05, AC-09 from PARTIAL.
- **ADR-0016 proven live**: FORCE RLS on all six tenant-scoped tables, runtime role without
  SUPERUSER or BYPASSRLS, cross-tenant reads blocked, unset tenant context returning no rows rather
  than all rows, audit records not updatable or deletable by the runtime role.
- **Boundary held**: no PCI artifact outside `/data`; PostgreSQL volume inside `/data/docker`;
  credentials generated on the host, never printed or committed.

Full evidence: section 11 of `implementation/reports/WP-0001-kernel-foundation-report.md`.

Two defects were found by running the stack for the first time — DISC-0007 and DISC-0008. They are
recorded as TASK-0004 and TASK-0005 and are **not** authorized. The acceptance criteria are met, but
**the stack is not reproducible from a clean checkout** until they are fixed.

The forbidden actions held throughout: nothing was created outside `/data`, no permission denial was
worked around, no pre-existing non-PCI directory was touched, and no acceptance criterion is
reported met without recorded evidence.

## TASK-0004 — Fix database role provisioning (PROPOSED)

**Status:** PROPOSED — not authorized. Do not execute.
**Source:** DISC-0007 | **Suggested priority:** 1 — highest of the outstanding work

`initdb/00-roles.sql` creates `pci_app` before the guard meant to prevent a passwordless role, the
resulting exception does not stop initialisation, and the stack reports healthy with an unusable
role. It also grants the role nothing and never creates the `pci_test` database the integration
tier documents.

Proposed: reorder the guard before creation; pass the password in via `PGOPTIONS`; grant the
minimum privileges explicitly; provision `pci_test` or align the documented usage.

**Note a destructive dependency:** `initdb` runs only on first initialisation, so verifying the fix
requires destroying and re-creating the `pci-kernel_postgres-data` volume. That volume holds only
verification data, but the deletion needs explicit authorization under Rule 9.

## TASK-0005 — Fix compose kernel service configuration (PROPOSED)

**Status:** PROPOSED — not authorized. Do not execute.
**Source:** DISC-0008 | **Suggested priority:** 2

The compose `kernel` service sets `PCI_IDENTITY_MODE=static` but never supplies
`PCI_STATIC_PRINCIPALS`, so the service refuses to start. The kernel's fail-closed validation is
correct; the wiring is incomplete.

Proposed: ship `.env.example` with a clearly fake placeholder and document generation, optionally
generating a development principal during bootstrap. The fail-closed guard must not be relaxed to
make the demo convenient.
