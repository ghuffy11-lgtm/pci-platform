# Claude Code Execution Queue

**This file is the authoritative execution queue.** `CLAUDE.md` requires every session to read it at
startup and to execute the highest-priority **READY** task, following that task's prerequisites,
dependencies, allowed actions, forbidden actions, verification requirements, documentation
requirements, checkpoint requirements, stop conditions, and recovery procedure.

Roadmap: [`ROADMAP.md`](ROADMAP.md) — the A→Z sequence this queue implements.
Checkpoints: [`checkpoints/`](checkpoints/) — resumable state for interrupted tasks.

Only the architecture lead may authorize new work, mark a task READY, or change priority or scope.
Claude Code may propose tasks; a proposed task is **not** executable.

---

## Status board

| ID | Task | Status | Depends On | Last Verified | Next Action | Owner |
|---|---|---|---|---|---|---|
| TASK-0001 | WP-0001 verification on the authorized host | **COMPLETE** | — | 2026-08-19 `a693910` | none | Claude Code |
| TASK-0004 | Fix database role provisioning (DISC-0007) | **WAITING_FOR_ARCHITECTURE_LEAD** | TASK-0001 | — | Mark READY to authorize | Architecture lead |
| TASK-0005 | Fix compose kernel service configuration (DISC-0008) | **WAITING_FOR_ARCHITECTURE_LEAD** | TASK-0001 | — | Choose the credential approach, then mark READY | Architecture lead |
| TASK-0006 | Clean-room reproducibility verification | **BLOCKED** | TASK-0004, TASK-0005 | — | Await dependencies **and** destructive-operation authorization | Architecture lead |
| TASK-0007 | Full re-verification after fixes | **BLOCKED** | TASK-0006 | — | Await dependency | Claude Code |
| TASK-0008 | Final report and status reconciliation | **BLOCKED** | TASK-0007 | — | Await dependency | Claude Code |
| TASK-0009 | WP-0001 completion decision | **WAITING_FOR_ARCHITECTURE_LEAD** | TASK-0008 | — | Lead declares complete or names gaps | Architecture lead |
| TASK-0003 | Normalise `*.md` line endings (DISC-0006) | **WAITING_FOR_ARCHITECTURE_LEAD** | — | — | Mark READY to authorize | Architecture lead |
| TASK-0002 | Make test entry points shell-independent | **ABORTED** | — | 2026-08-19 | none — premise disproven by measurement | — |

**No task is currently READY.** Every path forward needs an architecture-lead decision. This is a
genuine stop boundary, not an omission.

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

READY means *authorized to attempt*, never *authorized to force*. A READY task whose prerequisite is
unmet stops at the prerequisite and records why.

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
| MSG-0010 | Record | OPEN | Claude Code | Architecture lead | **Phase 0 execution-control system built. Awaiting authorization of TASK-0004 and TASK-0005.** | TASK-0004, TASK-0005 |

**What remains, in one line:** everything is verified and recorded; nothing is executable until the
architecture lead authorizes the two defect fixes.

---

## Interruption and recovery protocol

Applies after **any** interruption: crash, network failure, machine restart, context loss, or a new
Claude session.

### Checkpointing

Every task with status IN_PROGRESS **must** maintain a checkpoint at
`implementation/operations/checkpoints/TASK-XXXX.md`, committed and pushed. A checkpoint identifies:

1. task ID;
2. checkpoint number (monotonic);
3. current phase;
4. completed operations;
5. last **verified** operation;
6. next operation;
7. actual external/system state as observed, not as intended;
8. Git commit / HEAD at checkpoint time;
9. whether resumption is safe, and if not, why.

A checkpoint is written **after** an operation is verified, never in anticipation of one.

### Resuming

Before resuming anything:

- **a.** Read the task checkpoint.
- **b.** Read GitHub state — status, queue, blockers, communications, discoveries.
- **c.** Inspect the actual system state directly. Docker, database, filesystem, service health.
- **d.** Inspect git state — `git status`, `git rev-parse HEAD origin/main`.
- **e.** Compare documented state against actual state, item by item.
- **f.** **NEVER repeat an operation merely because the checkpoint says it was incomplete.** The
  checkpoint records what was known before the interruption; the system may have moved on. Re-running
  a migration, a volume creation, or a role change on that basis can destroy data or corrupt state.
  Determine what is *actually* true first.
- **g.** If documented and actual state disagree — **STOP.** Document the discrepancy in the
  checkpoint and in a blocker, and reconcile safely. A disagreement is evidence that something
  happened outside the record, which is more important than the task.
- **h.** Resume only from the first operation whose completion is **not verified** by direct
  observation.

### Idempotence

Prefer operations that are safe to repeat, and verify-before-acting on those that are not. Where an
operation cannot be made idempotent — volume initialisation, migrations that are not
checksum-guarded, credential rotation — the checkpoint must say so explicitly, so a resuming session
knows the difference between "unknown" and "unsafe".

---

## Continuation rule

**Claude Code MUST NOT stop merely because one authorized subtask completed.**

If the next task is READY, its prerequisites are satisfied, and no architecture or operator decision
is required, Claude Code **MUST continue automatically** — documenting and pushing as it goes.

Stopping after each task is as much a failure as skipping documentation. The queue exists so that
work flows without a human clicking "next".

## Stop boundaries

Claude Code MUST stop, document, commit, push, and report when:

- architecture approval is required;
- privileged operator action is required;
- a security boundary would be crossed;
- a prerequisite cannot be satisfied;
- documentation conflicts with documentation, or with the instruction given;
- actual state differs materially from recorded state;
- an operation is destructive or irreversible and is not explicitly authorized.

Stopping means recording *why*, not falling silent.

---

# Tasks

## TASK-0001 — WP-0001 verification on the authorized host

**Priority:** 1 | **Status:** **COMPLETE** (2026-08-19) | **Owner:** Claude Code
**Depends on:** — | **Next eligible task:** TASK-0004, TASK-0005

**Objective.** Convert WP-0001 from IMPLEMENTED to VERIFIED against real infrastructure.

**Outcome.** All ten acceptance criteria MET. 229 tests pass, 0 fail — 102 unit, 101 contract, 26
integration against real PostgreSQL. ADR-0016 obligations proven live. Boundary held: no PCI artifact
outside `/data`. Evidence: WP-0001 report section 11; commit `a693910`.

**Findings that became work:** DISC-0007, DISC-0008 → TASK-0004, TASK-0005.

---

## TASK-0004 — Fix database role provisioning

**Priority:** 1 | **Status:** **WAITING_FOR_ARCHITECTURE_LEAD** | **Owner:** Architecture lead → Claude Code
**Depends on:** TASK-0001 | **Source:** DISC-0007 | **Next eligible task:** TASK-0005, then TASK-0006

### Objective

Make the database stack provision its own access control correctly, so that a clean initialisation
produces a usable least-privilege `pci_app` role without manual SQL.

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | Architecture lead marks this task READY | **UNMET** |
| P2 | Docker and PostgreSQL available on the host | MET — verified 2026-08-19 |
| P3 | Workspace at `/data/pci-platform` with the repository | MET |

### Dependencies

TASK-0001 (complete). Verification of this fix additionally requires the destructive volume
re-initialisation authorized under TASK-0006 — the fix can be *written* and reviewed without it, but
**cannot be proven** until `initdb` runs again.

### Allowed actions

1. Reorder `deploy/compose/initdb/00-roles.sql` so the password guard runs **before** `CREATE ROLE`.
2. Supply the password to the init session, e.g. `PGOPTIONS: "-c pci.app_password=${PCI_APP_PASSWORD:?...}"`.
3. Grant `pci_app` the minimum privileges it needs, explicitly.
4. Provision the `pci_test` database, or align the integration tier's documented usage with what the
   stack creates — whichever the lead prefers; both are recorded in DISC-0007.
5. Make the health check meaningful, or record explicitly that `pg_isready` says nothing about
   provisioning.

### Forbidden actions

- Weakening the `NOSUPERUSER` / `NOBYPASSRLS` posture of `pci_app` — it is what makes ADR-0016 bite.
- Committing any credential, or a real password in `.env.example`.
- Destroying the PostgreSQL volume — that is TASK-0006 and needs its own authorization.
- Creating any artifact outside `/data` on the host.
- Declaring the fix verified on the strength of a code change alone.

### Verification requirements

Gate **G1**. On a freshly initialised volume: `pci_app` exists with a password, `super=false`,
`bypassrls=false`, holds exactly the privileges it needs, and **no manual SQL was run**. Quote
`pg_authid` output. Until G1 passes, the fix is written, not verified — and must be reported that way.

### Documentation requirements

Update DISC-0007 with the fix and its verification state; update the WP-0001 report; update status;
update this queue's board and ledger; commit and push before reporting.

### Checkpoint requirements

Checkpoint after: (1) the SQL and compose changes are written and committed; (2) any verification
attempt, recording whether G1 passed. Record actual database state observed, not intended.

### Stop conditions

Lead has not marked READY; verification would require destroying the volume without authorization;
a fix would require relaxing the least-privilege posture; documentation conflicts.

### Recovery procedure

Read the checkpoint, then inspect the live database directly: does `pci_app` have a password now,
and which privileges does it hold? **Do not re-run `ALTER ROLE` or re-apply grants because the
checkpoint is silent** — observe first. If the volume was re-initialised outside the record, stop and
reconcile: the manual workaround from 2026-08-19 will have been lost, and the stack's real state must
be established before anything is changed.

---

## TASK-0005 — Fix compose kernel service configuration

**Priority:** 2 | **Status:** **WAITING_FOR_ARCHITECTURE_LEAD** | **Owner:** Architecture lead → Claude Code
**Depends on:** TASK-0001 | **Source:** DISC-0008 | **Next eligible task:** TASK-0006

### Objective

Allow the kernel service to start from a clean checkout with documented setup only, without relaxing
its fail-closed configuration guard.

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | Architecture lead marks this task READY | **UNMET** |
| P2 | Architecture lead chooses how a development principal is supplied | **UNMET** — options in DISC-0008 |
| P3 | Docker available on the host | MET |

### Dependencies

TASK-0001 (complete). Independent of TASK-0004; either may run first.

### Allowed actions

Implement the option the lead selects: ship `.env.example` with a clearly fake placeholder and
document generation (recommended); and/or generate a development principal during bootstrap.

### Forbidden actions

- **Relaxing the fail-closed guard** so the service starts without principals. Recorded in DISC-0008
  as option 3 and explicitly not recommended: it converts a security control into a convenience.
- Committing a real token. `.gitignore` already carries the `!.env.example` negation for this.
- Making the static identity adapter usable in production — it is a development fixture (ADR-0007,
  SPEC-0004, DISC-0003) and must keep warning loudly.

### Verification requirements

Gate **G2**. `docker compose up kernel` reaches healthy from a clean checkout following only the
documented setup; `/health/ready` returns 200 with `store: ok`. Confirm the guard still refuses to
start when principals are absent — a fix that silently starts without identity has failed.

### Documentation requirements

Update DISC-0008; update `services/kernel/README.md` with the setup step; update status and this
queue; commit and push.

### Checkpoint requirements

Checkpoint after the change is committed, and after the clean start is verified.

### Stop conditions

P1 or P2 unmet; the only workable approach would require committing a credential or relaxing the
guard.

### Recovery procedure

Inspect whether `.env.example` exists and whether the running kernel container is healthy. **Do not
regenerate an existing `.env` principal** — a running service may depend on it, and regenerating
invalidates issued tokens. Observe, then resume.

---

## TASK-0006 — Clean-room reproducibility verification

**Priority:** 3 | **Status:** **BLOCKED** | **Owner:** Architecture lead (authorization) → Claude Code
**Depends on:** TASK-0004, TASK-0005 | **Next eligible task:** TASK-0007

### Objective

Prove that a clean checkout plus documented setup produces a working stack with **zero** manual
database or environment surgery — the criterion WP-0001 currently fails.

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | TASK-0004 COMPLETE | **UNMET** |
| P2 | TASK-0005 COMPLETE | **UNMET** |
| P3 | **Explicit authorization to destroy the PostgreSQL volume** | **UNMET** |

### Dependencies

Both fixes. Testing either alone cannot demonstrate reproducibility.

### Allowed actions

Once P3 is granted: `docker compose down -v` to remove `pci-kernel_postgres-data`, then bring the
stack up from scratch following only documented steps, and observe.

### Forbidden actions

- **Destroying the volume without explicit authorization** (Rule 9). This is the task's defining
  constraint.
- Any manual `ALTER ROLE`, `CREATE DATABASE`, or `.env` surgery during the run — that is precisely
  what is being tested. If a manual step proves necessary, the gate has **failed**; record it.
- Touching the pre-existing non-PCI directories under `/data`.

### Verification requirements

Gate **G3**. From a fresh volume: PostgreSQL healthy → migrations applied → `pci_app` correctly
provisioned → kernel healthy, with no manual intervention. Every step quoted.

### Documentation requirements

Record the full clean-room transcript in the WP-0001 report; update DISC-0007 and DISC-0008 to
RESOLVED only if the gate passes; update status and queue; commit and push.

### Checkpoint requirements

Checkpoint **before** the destructive step, recording exactly what will be destroyed and the
authorization that permits it; and after the rebuild, recording observed state.

### Stop conditions

P3 not granted; the rebuild needs manual surgery (gate failed — record, do not paper over); any data
of value is discovered in the volume during the pre-destruction check.

### Recovery procedure

**This is the highest-risk recovery in the queue.** If interrupted around the destructive step:
determine by direct observation whether the volume still exists and whether it is initialised.
**Never re-run `down -v` because the checkpoint is ambiguous.** If the volume is gone and the rebuild
incomplete, the stack is mid-provision — record that plainly, then continue the rebuild from the
first unverified step rather than starting over.

---

## TASK-0007 — Full re-verification after fixes

**Priority:** 4 | **Status:** **BLOCKED** | **Owner:** Claude Code
**Depends on:** TASK-0006 | **Next eligible task:** TASK-0008

**Objective.** Re-run the complete verification against the cleanly provisioned stack, so the
recorded evidence describes a reproducible system rather than a hand-patched one.

**Allowed actions.** Run all three test tiers; re-prove the ADR-0016 obligations; re-confirm the
`/data` boundary and that no credential appears in the repository.

**Forbidden actions.** Reporting any tier as passing without a non-zero count; reusing TASK-0001's
evidence in place of a fresh run; modifying tests to make them pass.

**Verification requirements.** Gate **G4** — all tiers pass with non-zero counts; integration ≥ 26
tests; FORCE RLS, non-BYPASSRLS role, cross-tenant blocking, and fail-closed tenant context all
re-proven and quoted.

**Documentation requirements.** New evidence section in the WP-0001 report; status and queue updated;
committed and pushed.

**Checkpoint requirements.** Checkpoint after each tier, recording actual counts.

**Stop conditions.** Any tier fails; any tier reports zero tests; tenant isolation fails — which is a
**security finding**, recorded as such before anything else proceeds.

**Recovery procedure.** Test runs are idempotent and safe to repeat; re-run any tier whose result is
not recorded. Verify the database is still cleanly provisioned before trusting results.

---

## TASK-0008 — Final report and status reconciliation

**Priority:** 5 | **Status:** **BLOCKED** | **Owner:** Claude Code
**Depends on:** TASK-0007 | **Next eligible task:** TASK-0009

**Objective.** Bring every record into agreement so the architecture lead can decide on completion
from the repository alone.

**Allowed actions.** Update the WP-0001 report to final; reconcile status, blockers, discoveries,
communications, queue board, and ledger; state remaining limitations explicitly.

**Forbidden actions.** Declaring WP-0001 complete — that is TASK-0009 and belongs to the lead;
omitting a limitation to make the record look finished.

**Verification requirements.** Gate **G5** — every record describes the same state; `HEAD` =
`origin/main`; working tree clean.

**Documentation requirements.** This task *is* documentation. Committed and pushed.

**Checkpoint requirements.** One checkpoint on completion, recording the reconciled SHA.

**Stop conditions.** Two records disagree and the truth cannot be established by observation.

**Recovery procedure.** Purely documentary and idempotent — re-read every record and re-reconcile.

---

## TASK-0009 — WP-0001 completion decision

**Priority:** 6 | **Status:** **WAITING_FOR_ARCHITECTURE_LEAD** | **Owner:** Architecture lead
**Depends on:** TASK-0008 | **Next eligible task:** none — the next work package requires separate authorization

**Objective.** The architecture lead declares WP-0001 complete, or names the gaps that prevent it.

Claude Code does not self-certify completion (`CLAUDE.md` Completion Rule, ROADMAP section I,
criterion 10). Its role here is to have the record ready and to answer questions.

**Prerequisites.** TASK-0008 COMPLETE, so the lead decides on a reconciled record — **UNMET**.

**Dependencies.** TASK-0008.

**Allowed actions (Claude Code).** Answer questions from the record; correct any inaccuracy the lead
identifies; record the decision once given.

**Forbidden actions.** Declaring completion; implying completion by starting downstream work;
omitting a known limitation to make the decision easier.

**Verification requirements.** The decision itself is the outcome. Claude Code verifies only that
the record the lead is deciding on is accurate and reconciled (gate G5).

**Documentation requirements.** Record the decision in this queue, in `implementation/status/current.md`,
and in the WP-0001 report. If gaps are named, create tasks for them.

**Checkpoint requirements.** None — no operations to interrupt.

**Stop conditions.** Absolute: no work package after WP-0001 may begin until this decision is
recorded.

**Recovery procedure.** None needed; nothing is in flight. On resumption, check whether the decision
was recorded while away.

**Next eligible task.** None. A subsequent work package requires separate authorization.

---

## TASK-0003 — Normalise `*.md` line endings to LF

**Priority:** low | **Status:** **WAITING_FOR_ARCHITECTURE_LEAD** | **Owner:** Architecture lead → Claude Code
**Depends on:** — | **Source:** DISC-0006

**Objective.** Stop record files acquiring CRLF on checkout, which silently defeats line-anchored
edits — a substitution matches nothing and exits 0. This has already produced one inaccurate commit
message.

**Allowed action.** Add `*.md text eol=lf` to `.gitattributes` and renormalise.

**Forbidden actions.** Renormalising without authorization — it touches every record file in the
repository, including lead-owned documents, and would produce a large diff obscuring real changes.

**Prerequisites.** Architecture lead marks this READY — **UNMET**.

**Dependencies.** None. Independent of the WP-0001 chain; schedulable at any point once authorized.

**Verification requirements.** After renormalisation, no `*.md` file reports CRLF (`file` on each),
and an anchored substitution against a record file succeeds where it previously matched nothing.

**Documentation requirements.** Update DISC-0006 to RESOLVED with the verification; note the
renormalisation commit in status; commit and push.

**Checkpoint requirements.** One checkpoint after renormalisation, recording the commit and how many
files changed — the diff is large and a resuming session needs to know it was intentional.

**Stop conditions.** Not marked READY; the renormalisation would conflict with uncommitted work.

**Recovery procedure.** Renormalisation is idempotent, but a partially committed renormalisation is
confusing. On resumption, check `git status` and whether `.gitattributes` already carries the rule
before re-running anything.

**Next eligible task.** Returns to whatever the queue's highest-priority READY task is.

---

## TASK-0002 — Make test entry points shell-independent

**Priority:** — | **Status:** **ABORTED** 2026-08-19 | **Source:** DISC-0005 (corrected)

Withdrawn: the premise was disproven by measurement. `npm test` runs all 203 unit and contract tests
correctly under `/bin/sh` on the target platform; the zero-test failure is confined to Git Bash on
Windows. The proposed fix — pointing `--test` at a directory — is the variant that actually breaks
(1 test, 1 fail), so applying it would have introduced the failure it was meant to prevent.

Retained as a record of a wrong finding that reached the queue. The surviving principle — a tier
reporting zero tests is a failure — is now `CLAUDE.md` Rule 10.
