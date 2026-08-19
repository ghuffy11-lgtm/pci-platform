# Claude Code Execution Queue

**This file is the authoritative execution queue.** `CLAUDE.md` requires every session to read it at startup and to execute the highest-priority **READY** task, following that task's prerequisites, dependencies, allowed actions, forbidden actions, verification requirements, documentation requirements, checkpoint requirements, stop conditions, and recovery procedure.

Roadmap: [`ROADMAP.md`](ROADMAP.md) — the A→Z sequence this queue implements.
Checkpoints: [`checkpoints/`](checkpoints/) — resumable state for interrupted tasks.

Only the architecture lead may authorize new work, mark a task READY, or change priority or scope. Claude Code may propose tasks; a proposed task is **not** executable.

---

## Status board

| ID | Task | Status | Depends On | Last Verified | Next Action | Owner |
|---|---|---|---|---|---|---|
| TASK-0001 | WP-0001 verification on the authorized host | **COMPLETE** | — | 2026-08-19 `a693910` | none | Claude Code |
| TASK-0004 | Fix database role provisioning (DISC-0007) | **COMPLETE** | TASK-0001 | 2026-08-19 G1 pass | none — clean-room proof is TASK-0006 | Claude Code |
| TASK-0005 | Fix compose kernel service configuration (DISC-0008) | **COMPLETE** | TASK-0001 | 2026-08-19 G2 pass | none | Claude Code |
| TASK-0006 | Clean-room reproducibility verification | **COMPLETE** | TASK-0004, TASK-0005 | 2026-08-19 G3 pass | none — TASK-0007 not authorized | Claude Code |
| TASK-0007 | Full re-verification after fixes | **COMPLETE** | TASK-0006 | 2026-08-19 G4 pass, 229 tests | none | Claude Code |
| TASK-0008 | Final report and status reconciliation | **COMPLETE** | TASK-0007 | 2026-08-19 G5 pass | none — TASK-0009 is the lead's decision | Claude Code |
| TASK-0009 | WP-0001 completion decision | **WAITING_FOR_ARCHITECTURE_LEAD** | TASK-0008 | — | Lead declares complete or names gaps | Architecture lead |
| TASK-0003 | Normalise `*.md` line endings (DISC-0006) | **WAITING_FOR_ARCHITECTURE_LEAD** | — | — | Mark READY to authorize | Architecture lead |
| TASK-0010 | Execution Supervisor (dev machine, not installed) | **COMPLETE** | — | 2026-08-19 `tests 17/17` | none — installation is a separate operator decision | Claude Code |
| TASK-0002 | Make test entry points shell-independent | **ABORTED** | — | 2026-08-19 | none — premise disproven by measurement | — |

**TASK-0004 and TASK-0005 are COMPLETE** (2026-08-19, gates G1 and G2 passed). The continuation rule was applied: both ran without stopping in between.

**TASK-0007 and TASK-0008 are COMPLETE** (2026-08-19; gates G4 and G5 passed). Authorized by MSG-0018, which also permitted the continuation into TASK-0008 — applied, so both ran without stopping in between.

**TASK-0009 is explicitly NOT authorized** and remains the architecture lead's decision. Execution stops here. See MSG-0019.

**TASK-0006 is COMPLETE** (2026-08-19, gate G3 passed). Its destructive volume re-initialisation was authorized by MSG-0016, executed, checkpointed before and after, and verified directly. **No authorization is granted for TASK-0007, TASK-0008, TASK-0009, or Execution Supervisor installation/enabling** — so execution stops here rather than continuing. See MSG-0017.

### Status values

| Status | Meaning |
|---|---|
| **READY** | Authorized and executable now. Prerequisites are checked before actions begin. |
| **IN_PROGRESS** | Started; a checkpoint exists in `checkpoints/`. |
| **COMPLETE** | Finished and verified, with evidence recorded in the repository. |
| **BLOCKED** | Authorized in principle, but a dependency or prerequisite is unmet. |
| **WAITING_FOR_ARCHITECTURE_LEAD** | Needs a decision or authorization only the lead can give. |
| **WAITING_FOR_OPERATOR** | Needs a privileged or credential-holding action only the operator can perform. |
| **ABORTED** | Withdrawn. Its premise was wrong or it was superseded. Kept for the record. |

READY means *authorized to attempt*, never *authorized to force*. A READY task whose prerequisite is unmet stops at the prerequisite and records why.

---

## Communication ledger

| MSG ID | Type | Status | From | To | Decision / Action | Related Task |
|---|---|---|---|---|---|---|
| MSG-0001 | Question | ANSWERED | Claude Code | Architecture lead | Ubuntu host, `claude` account, `/data/docker` boundary — answered by the accepted bootstrap contract | TASK-0001 |
| MSG-0002 | Proposal | CLOSED | Claude Code | Architecture lead | Kernel stack — ADR-0015 ratified | TASK-0001 |
| MSG-0003 | Question | CLOSED | Claude Code | Architecture lead | Repository layout and governance authority — decided by MSG-0005 | — |
| MSG-0004 | Proposal | CLOSED | Claude Code | Architecture lead | Prepared corrections — approved and applied | — |
| MSG-0005 | Decision | DECIDED | Architecture lead | Claude Code | ADR-0015 and ADR-0016 ratified; `docs/` authoritative; `docs/program/work-packages/` canonical; WP-0001 layout accepted | TASK-0001 |
| MSG-0006 | Directive | DECIDED | Architecture lead | Claude Code | Absolute `/data` boundary; `/data/pci-platform` mandatory workspace; contract v0.2 | all |
| MSG-0007 | Directive | DECIDED | Architecture lead | Claude Code | Twelve non-negotiable rules; startup and pre-action checklists | all |
| MSG-0008 | Procedure | CLOSED | Claude Code | Operator | Authorized bootstrap executed; `DockerRootDir` = `/data/docker` verified | TASK-0001 |
| MSG-0009 | Directive | DECIDED | Architecture lead | Claude Code | "Documentation Is Mandatory" — ten clauses | all |
| MSG-0010 | Record | OPEN | Claude Code | Architecture lead | Phase 0 execution-control system built | TASK-0004, TASK-0005 |
| MSG-0011 | Record | OPEN | Claude Code | Architecture lead | Execution Supervisor built, tested (17/17), NOT installed and NOT enabled | TASK-0010 |
| MSG-0012 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0004 and TASK-0005 authorized | TASK-0004, TASK-0005 |
| MSG-0013 | Directive | DECIDED | Architecture lead | Claude Code | Reconcile queue to READY from MSG-0012 | TASK-0004, TASK-0005 |
| MSG-0014 | Directive | DECIDED | Architecture lead | Claude Code | Queue reconciliation record, discoverable to a fresh session | TASK-0004, TASK-0005 |
| MSG-0015 | Record | OPEN | Claude Code | Architecture lead | TASK-0004 and TASK-0005 complete; TASK-0006 needs explicit destructive authorization | TASK-0006 |
| MSG-0017 | Record | OPEN | Claude Code | Architecture lead | **TASK-0006 COMPLETE, gate G3 passed. WP-0001 is now reproducible.** Awaiting TASK-0007 authorization | TASK-0007 |
| MSG-0018 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0007 AUTHORIZED**, non-destructive; continuation to TASK-0008 permitted; TASK-0009, TASK-0003 and supervisor install excluded | TASK-0007, TASK-0008 |
| MSG-0016 | Decision | **DECIDED** | Architecture lead | Claude Code | **TASK-0006 AUTHORIZED / READY. Destructive PostgreSQL volume re-initialization authorized solely for clean-room verification.** | TASK-0006 |

## Interruption and recovery protocol

Applies after any interruption: crash, network failure, machine restart, context loss, or a new Claude session.

### Checkpointing

Every task with status IN_PROGRESS **must** maintain a checkpoint at `implementation/operations/checkpoints/TASK-XXXX.md`, committed and pushed. A checkpoint identifies task ID, checkpoint number, current phase, completed operations, last verified operation, next operation, actual external/system state, Git commit/HEAD, and whether resumption is safe.

A checkpoint is written **after** an operation is verified, never in anticipation of one.

### Resuming

Before resuming anything:

- Read the task checkpoint.
- Read GitHub state — status, queue, blockers, communications, discoveries.
- Inspect actual system state directly.
- Inspect git state — `git status`, `git rev-parse HEAD origin/main`.
- Compare documented state against actual state.
- **NEVER repeat an operation merely because the checkpoint says it was incomplete.** Observe actual state first.
- If documented and actual state disagree — **STOP**, document the discrepancy, and reconcile safely.
- Resume only from the first operation whose completion is not verified by direct observation.

### Idempotence

Prefer operations that are safe to repeat, and verify-before-acting on those that are not. Where an operation cannot be made idempotent — volume initialisation, migrations that are not checksum-guarded, credential rotation — the checkpoint must say so explicitly.

## Continuation rule

**Claude Code MUST NOT stop merely because one authorized subtask completed.** If the next task is READY, its prerequisites are satisfied, and no architecture or operator decision is required, Claude Code **MUST continue automatically** — documenting and pushing as it goes.

## Stop boundaries

Claude Code MUST stop, document, commit, push, and report when architecture approval is required; privileged operator action is required; a security boundary would be crossed; a prerequisite cannot be satisfied; documentation conflicts; actual state differs materially from recorded state; or an operation is destructive or irreversible and is not explicitly authorized.

---

# Tasks

## TASK-0001 — WP-0001 verification on the authorized host

**Priority:** 1 | **Status:** **COMPLETE** (2026-08-19) | **Owner:** Claude Code
**Depends on:** — | **Next eligible task:** TASK-0004, TASK-0005

**Objective.** Convert WP-0001 from IMPLEMENTED to VERIFIED against real infrastructure.

**Outcome.** All ten acceptance criteria MET. 229 tests pass, 0 fail — 102 unit, 101 contract, 26 integration against real PostgreSQL. ADR-0016 obligations proven live. Boundary held: no PCI artifact outside `/data`. Evidence: WP-0001 report section 11; commit `a693910`.

**Findings that became work:** DISC-0007, DISC-0008 → TASK-0004, TASK-0005.

---

## TASK-0004 — Fix database role provisioning

**Priority:** 1 | **Status:** **COMPLETE** — 2026-08-19, gate G1 passed | **Owner:** Claude Code
**Depends on:** TASK-0001 | **Source:** DISC-0007 | **Next eligible task:** TASK-0005, then TASK-0006

### Objective
Make the database stack provision its own access control correctly, so that a clean initialisation produces a usable least-privilege `pci_app` role without manual SQL.

### Verification
Gate G1 passed. Clean-room proof remains TASK-0006.

### Documentation / recovery
DISC-0007, WP-0001 report, status, queue, and checkpoints were updated and pushed. Recovery requires direct observation before repeating role or grant operations.

---

## TASK-0005 — Fix compose kernel service configuration

**Priority:** 2 | **Status:** **COMPLETE** — 2026-08-19, gate G2 passed | **Owner:** Claude Code
**Depends on:** TASK-0001 | **Source:** DISC-0008 | **Next eligible task:** TASK-0006

### Objective
Allow the kernel service to start from a clean checkout with documented setup only, without relaxing its fail-closed configuration guard.

### Verification
Gate G2 passed. Clean-room proof remains TASK-0006.

### Documentation / recovery
DISC-0008, kernel README, status, queue, and checkpoints were updated and pushed. Recovery requires direct observation before repeating service/configuration operations.

---

## TASK-0006 — Clean-room reproducibility verification

**Priority:** 1 | **Status:** **COMPLETE** — 2026-08-19, gate G3 passed | **Owner:** Claude Code
**Depends on:** TASK-0004, TASK-0005 | **Next eligible task:** TASK-0007

### Objective
Prove the fixes survive a genuinely clean PostgreSQL initialization and that the full stack remains within the accepted architecture and `/data` boundary.

### Authorization
MSG-0016 explicitly authorizes the destructive PostgreSQL volume re-initialization required by this task. This authorization is limited to TASK-0006 and does not authorize later tasks or supervisor installation.

### Allowed actions
1. Checkpoint immediately before destructive action.
2. Stop/remove the relevant PostgreSQL stack state as required by the existing task procedure.
3. Re-initialize the PostgreSQL volume cleanly.
4. Start the stack from repository configuration only; do not apply manual SQL fixes.
5. Verify role provisioning, database availability, privileges, RLS posture, kernel startup, and required health endpoints directly.
6. Record exact evidence and checkpoint after each verified gate.

### Forbidden actions
- Commit credentials or secrets.
- Run manual SQL to make clean-room evidence pass.
- Modify architecture or weaken security controls.
- Create PCI artifacts outside `/data`.
- Continue into TASK-0007 without completing and documenting TASK-0006.

### Verification requirements
All clean-room gates defined by the existing WP-0001 acceptance criteria and task procedure must pass. Evidence must be from the clean initialization, not from the prior manually repaired state.

### Recovery
After any interruption, inspect the actual Docker volumes, containers, database roles, and Git state before repeating any destructive or initialization operation. If state differs from the checkpoint, stop and document the discrepancy.

---

## TASK-0007 — Full re-verification after fixes

**Priority:** 1 | **Status:** **BLOCKED** | **Depends on:** TASK-0006 | **Owner:** Claude Code

### Objective
Re-run the complete WP-0001 verification suite and acceptance criteria after clean-room fixes.

### Stop condition
Do not begin until TASK-0006 is COMPLETE.

---

## TASK-0008 — Final report and status reconciliation

**Priority:** 1 | **Status:** **BLOCKED** | **Depends on:** TASK-0007 | **Owner:** Claude Code

### Objective
Reconcile implementation status, report, discoveries, blockers, communications, and task queue using verified evidence.

### Stop condition
Do not begin until TASK-0007 is COMPLETE.

---

## TASK-0009 — WP-0001 completion decision

**Priority:** 1 | **Status:** **WAITING_FOR_ARCHITECTURE_LEAD** | **Depends on:** TASK-0008 | **Owner:** Architecture lead

### Objective
Architecture lead decides whether WP-0001 is genuinely complete or identifies remaining gaps.

---

## TASK-0003 — Normalise `*.md` line endings (DISC-0006)

**Priority:** 3 | **Status:** **WAITING_FOR_ARCHITECTURE_LEAD** | **Depends on:** — | **Owner:** Claude Code

### Objective
Normalize repository markdown line endings if and when explicitly authorized by the architecture lead.

---

## TASK-0010 — Execution Supervisor

**Priority:** 0 | **Status:** **COMPLETE** — 2026-08-19 | **Owner:** Claude Code

Built and tested (17/17). Installation and enabling remain a separate operator decision and are not authorized by MSG-0016.

---

## TASK-0002 — Make test entry points shell-independent

**Priority:** 4 | **Status:** **ABORTED** — 2026-08-19 | **Owner:** —

Premise disproven by measurement; retained for record.
