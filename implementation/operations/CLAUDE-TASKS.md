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
| TASK-0006 | Clean-room reproducibility verification | **COMPLETE** | TASK-0004, TASK-0005 | 2026-08-19 G3 pass | none | Claude Code |
| TASK-0007 | Full re-verification after fixes | **COMPLETE** | TASK-0006 | 2026-08-19 G4 pass, 229 tests | none | Claude Code |
| TASK-0008 | Final report and status reconciliation | **COMPLETE** | TASK-0007 | 2026-08-19 G5 pass | none — TASK-0009 decision recorded in MSG-0022 | Claude Code |
| TASK-0009 | WP-0001 completion decision | **COMPLETE** | TASK-0008 | 2026-08-19 | none — WP-0001 complete; no post-WP-0001 work authorized until explicitly authorized | Architecture lead |
| TASK-0003 | Normalise `*.md` line endings (DISC-0006) | **COMPLETE** | — | 2026-08-20 w/crlf 150 -> 0 | none | Claude Code |
| TASK-0010 | Execution Supervisor (installed and **ENABLED**, 10-min) | **COMPLETE** | — | 2026-08-19 tests 21/21, enabled cycle verified | none — start path proven by TASK-0003 | Claude Code |
| TASK-0011 | **Execution Supervisor smoke test — COMMS audit and end-to-end report** | **COMPLETE** | TASK-0010 | 2026-08-20 `d16665a` — PASSED | none — terminal by design | Claude Code |
| TASK-0013 | **Apply MSG-0035 maintenance decisions — blocker index + COMMS numbering rule** | **COMPLETE** | TASK-0011, MSG-0035 | 2026-08-20 — both decisions applied, MSG-0036 | none — one finding awaits a ruling, MSG-0036 §6 | Claude Code |
| TASK-0014 | **Reconcile BLK-0005 in blocker index** | **COMPLETE** | TASK-0013, MSG-0037 | 2026-08-20 — row added, MSG-0038 | none | Claude Code |
| TASK-0015 | **Reconcile discoveries index with actual DISC records** | **COMPLETE** | TASK-0014, MSG-0039 | 2026-08-20 — index 3 rows -> 9, MSG-0040 | none | Claude Code |
| TASK-0016 | **Close resolved MSG-0034 informational record** | **COMPLETE** | TASK-0015, MSG-0041 | 2026-08-20 — closure verified, MSG-0042 | none | Claude Code |
| TASK-0002 | Make test entry points shell-independent | **ABORTED** | — | 2026-08-19 | none — premise disproven by measurement | — |

**TASK-0016 is explicitly authorized by the architecture lead after WP-0001 completion.** It is maintenance/documentation work, not a new product work package.

### TASK-0016 — result

**COMPLETE, 2026-08-20.** MSG-0034 is CLOSED in its own record and in the COMMS register, its
substantive content intact. Evidence: MSG-0042; commit and push quoted in `checkpoints/TASK-0016.md`
checkpoint 2.

**Two of the four success-gate items were already satisfied when this session started.** The
architecture lead closed the MSG-0034 record itself in `4b5965d` and the register row in `9c6244c`,
before the Supervisor's 09:57:18Z fast-forward. **Neither was re-done** — CLAUDE.md *Checkpointing and
Recovery* rule (f) forbids repeating an operation because a record says it is incomplete, and both
closures were verified by direct observation of the files. This session executed only what remained:
the execution record, the register row, this queue update, the `current.md` reconciliation, and the
push. **MSG-0034 itself was not modified by this session**, which is the opposite of what "TASK-0016
closed MSG-0034" would suggest, and is why it is stated here.

The stop condition was checked before acting and **did not fire**. It fires on a *material conflict*
between MSG-0034's evidence or MSG-0041 and the actual repository state; what was found instead was
state **ahead of** the authorization in the direction the authorization points. Convergence, not
conflict. The substantive-content check was made by reading the file, not by trusting the diffstat:
`4b5965d` added a `## Closure` section and changed the status line, and deleted nothing.

**The COMMS register lag did not recur** — the first time in four tasks. MSG-0041's register row was
already present, added by the lead in the same commit that closed the MSG-0034 row. Recorded in
MSG-0042 §6 as an observation; **no change proposed, no ruling requested**.

**Zero messages now carry `Status: OPEN`.**

### TASK-0016 — authorization (as issued)

**READY, 2026-08-20.** MSG-0041 authorizes closing MSG-0034 because its diagnosis is verified, the TASK-0011 smoke test passed, and no unresolved action depends on it.

**Allowed:**
- Change only the status/closure section of `implementation/comms/MSG-0034-task-0011-execution-path-correction.md` from OPEN to CLOSED, preserving its substantive historical content.
- Ensure the COMMS register records MSG-0034 as CLOSED.
- Create exactly one execution record for TASK-0016 using the message-numbering protocol, and reconcile the register in the same commit.
- Update required task/status documentation and push the result.

**Forbidden:**
- No changes to Supervisor code/configuration, permissions, scheduling, blockers, discoveries, product/code, or historical substantive COMMS content.
- No renumbering of existing messages.
- No credential access, privilege escalation, destructive commands, repository reset/clean, or force push.

**Success gate:** MSG-0034 is CLOSED in its own record and the register; exactly one TASK-0016 execution record exists; queue/status documentation is consistent; changes are committed and pushed.

**Stop condition:** If MSG-0034's evidence or MSG-0041 materially conflicts with the actual repository state, STOP and report in COMMS. Do not improvise.

### TASK-0015 — result

**COMPLETE, 2026-08-20.** The discoveries index went from **three rows to nine**. DISC-0004 through
DISC-0009 were missing entirely — including the two deployment-artifact defects (DISC-0007,
DISC-0008) and the `/data` boundary finding (DISC-0009). Every status is transcribed from the
record's own header line; **no `DISC-*.md` record was altered, deleted, or renumbered**, evidenced by
the pre-commit `git status --porcelain` in `checkpoints/TASK-0015.md`. Zero index rows were stale and
zero lacked a record — the drift was pure omission. Evidence: MSG-0040.

No stop condition fired. All nine records carry an unambiguous status. The one apparent exception was
checked and dismissed: `grep "Status:.*OPEN"` hits `DISC-0006` line 17, which is quoted `grep` output
inside a fenced example block, not that file's status.

**One judgment call, declared rather than folded in** (MSG-0040 §5): `implementation/status/current.md`
keeps a second discovery table whose DISC-0009 row read **OPEN** while the record reads "CLOSED —
ACCEPTED, NOT A VIOLATION". It was corrected under MSG-0039 (a) §4 and §7, because leaving it would
have created a fresh contradiction the moment the discoveries index became correct. That table's
header was also widened from two columns to three, which is what its rows already supplied — the
renderer had been silently dropping four statuses.

**The authorization was duplicate-numbered.** Two MSG-0039 files exist (`b123361`, `dc307fa`). They do
not conflict; the task executed the stricter reading of both, registered them as MSG-0039 (a)/(b), and
renumbered neither, per MSG-0035 decision 2. Reported in MSG-0040 §6; **no ruling requested**.

### TASK-0015 — authorization (as issued)

**READY, 2026-08-20.** MSG-0039 authorizes a narrowly scoped reconciliation of `implementation/discoveries/README.md` against the actual `DISC-*.md` records. The task may update only the discoveries index and required task/COMMS evidence. It must not alter discovery substance, architecture decisions, blockers, product/code, Supervisor configuration, permissions, scheduling, or repository history. It must stop for malformed records or conflicts requiring architectural judgment.

### TASK-0014 — result

**COMPLETE, 2026-08-20.** The blocker index now lists **BLK-0005 · Two contradictory MSG-0020 decisions · High · RESOLVED 2026-08-19**, citing MSG-0022, MSG-0023, and the blocker record. The underlying `BLK-0005-conflicting-msg-0020-decisions.md` was **not** altered, BLK-0001 through BLK-0004 are unchanged, and the discoveries index was not touched. Evidence: MSG-0038; commit and push quoted in `checkpoints/TASK-0014.md` checkpoint 2.

The stop condition was checked before acting: MSG-0037, MSG-0022, MSG-0023, and the BLK-0005 record agree that WP-0001 is COMPLETE and BLK-0005 is closed, so it did not fire. The one nuance — MSG-0023 retains MSG-0022 "only as the historical conflict-resolution record" — is a clarification of which record survives, not a disagreement about BLK-0005, and is recorded in MSG-0038 §3 so it is not misread later.

**All five blockers are now listed and all five read RESOLVED.** With BLK-0001 and BLK-0004 corrected by TASK-0013 and BLK-0005 added here, the index and the underlying records finally describe the same state.

### TASK-0013 — result

**COMPLETE, 2026-08-20.** Both MSG-0035 decisions applied: BLK-0001 and BLK-0004 are RESOLVED in the blocker index with their resolution date and evidence reference, and the COMMS numbering-allocation convention is recorded in `implementation/comms/README.md`. Evidence: MSG-0036; commit and push quoted in `checkpoints/TASK-0013.md`.

---

## TASK-0011 — prior result

TASK-0011 was a one-time execution-infrastructure test. The Supervisor selected it, launched Claude, Claude read shared repository state, produced MSG-0032, and pushed the result to GitHub with no human relay. The smoke test passed. Earlier attempts had stopped at the reconciliation gate because the clone was behind `origin/main`; the gated fast-forward correction in `479dfa9` resolved that failure mode.

---

## Status values

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
| MSG-0009 | Directive | DECIDED | Architecture lead | Claude Code | Documentation is mandatory | all |
| MSG-0010 | Record | CLOSED | Claude Code | Architecture lead | Phase 0 execution-control system built | TASK-0004, TASK-0005 |
| MSG-0011 | Record | SUPERSEDED | Claude Code | Architecture lead | Execution Supervisor built, tested (17/17), NOT installed and NOT enabled | TASK-0010 |
| MSG-0012 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0004 and TASK-0005 authorized | TASK-0004, TASK-0005 |
| MSG-0013 | Directive | DECIDED | Claude Code | Architecture lead | Reconcile queue to READY from MSG-0012 | TASK-0004, TASK-0005 |
| MSG-0014 | Directive | DECIDED | Claude Code | Architecture lead | Queue authorization reconciliation | TASK-0004, TASK-0005 |
| MSG-0015 | Record | CLOSED | Claude Code | Architecture lead | TASK-0004 and TASK-0005 complete; TASK-0006 authorization required | TASK-0006 |
| MSG-0016 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0006 authorized | TASK-0006 |
| MSG-0017 | Record | CLOSED | Claude Code | Architecture lead | TASK-0006 complete; TASK-0007 authorization required | TASK-0007 |
| MSG-0018 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0007 authorized; continuation to TASK-0008 permitted | TASK-0007, TASK-0008 |
| MSG-0019 | Record | CLOSED | Claude Code | Architecture lead | TASK-0007 / TASK-0008 complete; WP-0001 ready for completion decision | TASK-0009 |
| MSG-0020 (a) | Decision | SUPERSEDED | Architecture lead | Claude Code | Erroneous NOT COMPLETE decision; TASK-0012 authorization superseded by MSG-0022 | TASK-0009 |
| MSG-0020 (b) | Decision | SUPERSEDED | Architecture lead | Claude Code | Duplicate COMPLETE decision; final ruling restated by MSG-0022 | TASK-0009 |
| MSG-0021 | Question | CLOSED | Claude Code | Architecture lead | Duplicate MSG-0020 conflict resolved by MSG-0022 | TASK-0009 |
| MSG-0022 | Decision | DECIDED | Architecture lead | Claude Code | Duplicate MSG-0020 resolved: **WP-0001 COMPLETE**; TASK-0012 not authorized | TASK-0009 |
| MSG-0023 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0009 terminal; TASK-0012 not in the WP-0001 path | TASK-0009 |
| MSG-0024 | Decision | DECIDED | Architecture lead | Claude Code | **Execution Supervisor enablement authorized**, fail-closed preserved | TASK-0010 |
| MSG-0025 | Question | CLOSED | Claude Code | Architecture lead | Supervisor installed and verified in dry-run; NOT enabled | TASK-0010 |
| MSG-0026 | Record | CLOSED | Claude Code | Architecture lead | **Supervisor ENABLED**; acceptEdits + version-controlled deny list; no bypassPermissions | TASK-0010 |
| MSG-0027 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0003 authorized and marked READY; line-ending normalization only | TASK-0003 |
| MSG-0028 | Record | DECIDED | Claude Code | Architecture lead | TASK-0003 implemented, NOT complete; decisions resolved by MSG-0030 | TASK-0003, TASK-0010 |
| MSG-0029 | Record | CLOSED | Claude Code | Architecture lead | Supervisor start path diagnosed and fixed; first launch PROVEN | TASK-0010 |
| MSG-0030 | Question | DECIDED | Architecture lead | Claude Code | Option B authorized: `git checkout -- "*.md"` | TASK-0003 |
| MSG-0031 | Record | DECIDED | Claude Code | Architecture lead | TASK-0003 COMPLETE; CRLF residue 150 -> 0 | TASK-0003 |
| MSG-0032 | Record | CREATED — smoke test PASSED | Claude Code | Architecture lead | End-to-end Supervisor evidence; two findings requested rulings | TASK-0011 |
| MSG-0033 (a) | Directive | DECIDED | Architecture lead | Claude Code | TASK-0011 smoke-test diagnosis/correction | TASK-0011 |
| MSG-0033 (b) | Directive | DECIDED | Architecture lead | Claude Code | TASK-0011 retry correction; duplicate historical number | TASK-0011, TASK-0010 |
| MSG-0034 | Record | CLOSED | Claude Code | Architecture lead | Informational: execution-path diagnosis; smoke test passed; closure authorized by MSG-0041 | TASK-0011, TASK-0016 |
| MSG-0035 | Decision | DECIDED | Architecture lead | Claude Code | BLK-0001/0004 resolved; COMMS numbering-allocation convention approved | TASK-0013 |
| MSG-0036 | Record | CREATED — both decisions applied | Claude Code | Architecture lead | TASK-0013 execution evidence; BLK-0005 index row needs a ruling (§6) | TASK-0013 |
| MSG-0037 | Decision | DECIDED | Architecture lead | Claude Code | **BLK-0005 index reconciliation authorized**; underlying record unchanged | TASK-0014 |
| MSG-0038 | Record | CREATED — authorization applied | Claude Code | Architecture lead | TASK-0014 execution evidence; BLK-0005 row added; **no decision requested** | TASK-0014 |
| MSG-0039 (a) | Decision | DECIDED | Architecture lead | Claude Code | **Discoveries-index reconciliation authorized**; duplicate number, non-conflicting | TASK-0015 |
| MSG-0039 (b) | Decision | DECIDED | Architecture lead | Claude Code | Same authorization restated; duplicate number, non-conflicting — both satisfied | TASK-0015 |
| MSG-0040 | Record | CREATED — authorization applied | Claude Code | Architecture lead | TASK-0015 execution evidence; index 3 rows -> 9; **no decision requested** | TASK-0015 |
| MSG-0041 | Decision | DECIDED | Architecture lead | Claude Code | Close resolved MSG-0034 informational record; applied by TASK-0016, see MSG-0042 | TASK-0016 |
| MSG-0042 | Record | CREATED — closure verified | Claude Code | Architecture lead | TASK-0016 execution evidence; MSG-0034 CLOSED in record and register; **no decision requested** | TASK-0016 |

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
- **NEVER repeat an operation merely because the checkpoint says it was incomplete.** Observe actual state first.
- If documented and actual state disagree — **STOP**, document the discrepancy, and reconcile safely.
- Resume only from the first operation whose completion is not verified by direct observation.

### Idempotence

Prefer operations that are safe to repeat, and verify-before-acting on those that are not. Where an operation cannot be made idempotent — volume initialisation, migrations that are not checksum-guarded, credential rotation — the checkpoint must say so explicitly.

## Continuation rule

**Claude Code MUST NOT stop merely because one authorized subtask completed.** If the next task is READY, its prerequisites are satisfied, and no architecture or operator decision is required, Claude Code **MUST continue automatically** — documenting and pushing as it goes.

## Stop boundaries

Claude Code MUST stop, document, commit, push, and report when architecture approval is required; privileged operator action is required; a security boundary would be crossed; a prerequisite cannot be satisfied; documentation conflicts; actual state differs materially from recorded state; or an operation is destructive or irreversible and is not explicitly authorized.
