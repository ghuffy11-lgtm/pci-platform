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
| TASK-0017 | **Supervisor heartbeat / unattended observability** | **COMPLETE** | TASK-0016 | 2026-08-20 tests 36/36 | none | Claude Code |
| TASK-0018 | **Live Supervisor heartbeat validation** | **COMPLETE** — 5 of 5 gates MET | TASK-0017 | 2026-08-21 `COMPLETED` observed externally | none | Claude Code |
| TASK-0019 | **Post-WP-0001 repository baseline audit** | **COMPLETE** | TASK-0018, MSG-0050 | 2026-08-21 — 6 corrections applied, 7 items referred, MSG-0051 | none | Claude Code |
| TASK-0002 | Make test entry points shell-independent | **ABORTED** | — | 2026-08-19 | none — premise disproven by measurement | — |

**TASK-0019 is COMPLETE (2026-08-21).** It was authorized by MSG-0050, reconciled into this queue in `39eabdb`, and executed by a supervisor-started session on its scheduled 06:37:13Z cycle. It was maintenance/audit work only, not a new product work package.

**No task is READY.** TASK-0019 was the last authorized one. What follows is an architecture-lead decision: MSG-0051 §C lists seven items, prioritized, and self-authorizes none of them. §C1 is the one that matters — the accepted WP-0001 work package still reads `Status: Ready for implementation` while every other record says COMPLETE, and TASK-0019's stop condition required that correction to be referred rather than made.

**TASK-0016 is explicitly authorized by the architecture lead after WP-0001 completion.** It is maintenance/documentation work, not a new product work package.

### TASK-0017 — result: COMPLETE (the section below is superseded history)

> **Corrected 2026-08-20 by TASK-0018.** The status board above reads **COMPLETE** for TASK-0017 and
> the narrative below reads **IMPLEMENTED but NOT COMPLETE** — a straight contradiction inside one
> file. The board is right: MSG-0046 authorized the operator-side test run, MSG-0047 records **36
> passed / 0 failed**, and the task closed in `1f2903d`. The block below was accurate when written,
> before the suite could be executed, and is retained rather than rewritten because the sequence
> — blocked, asked, authorized, verified — is the useful part of the record.
>
> This correction is **additive and declared** (MSG-0049 §7.3). TASK-0018's scope permits updating
> queue documentation; it does not extend to the MSG-0045 record's own status line, which was left
> untouched and still reads OPEN.

**IN_PROGRESS, 2026-08-20.** The defect was reproduced, diagnosed and corrected, and nine focused
tests were written. **The success gate is NOT met**: MSG-0043 requires that the relevant test suite
passes, and the suite **could not be executed** — no allowlist entry permits running a PowerShell
script, so the command documented in the supervisor README was refused three times. Evidence and the
decision request: **MSG-0045**. Both checkpoints: `checkpoints/TASK-0017.md`.

**The reproduction cost nothing.** This session *was* the defect: the Supervisor started it at
12:31:16Z and `state/heartbeat.json` went on reading `NOOP :: no READY task`, `runnerActive: false`,
with a two-commit-old `head`, for the whole run. The log was correct throughout — the fault was
confined to the state file and never touched scheduling.

**Corrected** in `supervisor.ps1`: the runner wait polls instead of blocking, a heartbeat is written
at launch and refreshed while the runner is alive, `runnerPid` is published, and the overloaded
`STARTED` decision is split into `RUNNER_STARTED` / `RUNNER_RUNNING` / `COMPLETED` / `FAILED`, with
`ERROR` narrowed to mean the supervisor itself failed. The ten-minute schedule, the reconciliation
gate, the fail-closed behaviour, and every permission rule are **untouched**.

**Status is IN_PROGRESS, deliberately, not COMPLETE and not READY.** Not COMPLETE because the gate is
unmet. Not READY because that would have the Supervisor start the task again on its next cycle and
repeat the work indefinitely. A checkpoint exists, as IN_PROGRESS requires.

> **Operational risk, stated rather than buried.** The Supervisor is ENABLED and will run this changed
> code unverified on its next cycle. If it contains a fault, unattended execution stops until a human
> intervenes. The change is ASCII-verified, additive, and confined to the state-writing path — but a
> static read is not a passing test. It is one commit and `git revert` undoes it.

### TASK-0017 — authorization (as issued)

**READY, 2026-08-20.** MSG-0043 authorizes diagnosing and correcting the heartbeat/observability
defect. Full specification: [`TASK-0017-supervisor-heartbeat.md`](TASK-0017-supervisor-heartbeat.md);
the queue section below carries prerequisites, allowed and forbidden actions, verification,
documentation, checkpoint, stop conditions, and recovery. Queue reconciliation is recorded in
MSG-0044.

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
| MSG-0043 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0017 AUTHORIZED** — correct the stale-heartbeat defect; schedule, gates and permissions unchanged | TASK-0017 |
| MSG-0044 | Record | CLOSED | Claude Code | Architecture lead | **TASK-0017 authorized in MSG-0043 but absent from the queue**, so the supervisor could never select it. Queue reconciled; structural finding recorded | TASK-0017 |
| MSG-0046 (a) / (b) | Decision | DECIDED | Architecture lead | Claude Code | Option A: operator runs the test once; no permission expansion. **Duplicate number, non-conflicting** — two files, same ruling; registered as (a)/(b) by TASK-0019 and neither renumbered, per MSG-0035 decision 2 | TASK-0017 |
| MSG-0047 | Record | CLOSED | Claude Code | Architecture lead | **TASK-0017 verification: 36 passed, 0 failed.** Gate satisfied; task COMPLETE | TASK-0017 |
| MSG-0048 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0018 AUTHORIZED** — one real Supervisor-started run, observe RUNNER_RUNNING live; no manual trigger, no supervisor changes | TASK-0018 |
| MSG-0045 | Record | **CLOSED** — corrected 2026-08-21 by TASK-0019; the record file and the COMMS register both read CLOSED | Claude Code | Architecture lead | **TASK-0017 IMPLEMENTED but NOT COMPLETE.** Defect reproduced and corrected; the test suite **could not be run** — no allowlist entry permits executing a PowerShell script. Three options in §7. *Answered by MSG-0046 and discharged by MSG-0047; the status line in the record itself was not changed by TASK-0018, which had no authority over another message's record* | TASK-0017 |
| MSG-0049 | Record | CLOSED | Claude Code | Architecture lead | **TASK-0018 verification: `RUNNER_RUNNING` observed live during a supervisor-started run.** Gates 1, 2, 4 and 5 MET with quoted evidence; gate 3 (terminal heartbeat) is **structurally unobservable from inside the run it measures**. Three options in §6; (B) recommended | TASK-0018 |
| MSG-0050 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0019 AUTHORIZED and READY** — post-WP-0001 repository baseline audit; maintenance/audit only; queue reconciliation required before execution | TASK-0019 |
| MSG-0051 | Record | CREATED — audit complete | Claude Code | Architecture lead | **TASK-0019 baseline audit.** Six documentary corrections applied with their authorities quoted; four record classes verified already correct; **§C refers seven items for decision**, led by the accepted WP-0001 work package still reading `Status: Ready for implementation` — the stop condition fired and that correction was **not** made | TASK-0019 |

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

---

## TASK-0017 — Supervisor heartbeat / unattended observability

**Priority:** 1 | **Status:** **COMPLETE** — authorized by MSG-0043; verified 36/36 under MSG-0046, recorded in MSG-0047 | **Owner:** Claude Code
**Depends on:** TASK-0016 (COMPLETE) | **Next eligible task:** none — nothing follows automatically
**Full specification:** [`TASK-0017-supervisor-heartbeat.md`](TASK-0017-supervisor-heartbeat.md)
**Checkpoint:** [`checkpoints/TASK-0017.md`](checkpoints/TASK-0017.md)

### Objective

Correct the heartbeat/state defect recorded in MSG-0042: `state/heartbeat.json` can still read
`NOOP :: no READY task` while a supervisor-started run is actually in progress, so unattended
execution looks idle from outside.

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | Architecture lead authorization | **MET** — MSG-0043 |
| P2 | TASK-0016 COMPLETE | MET |
| P3 | Supervisor installed and enabled | MET |

### Allowed actions

Inspect the heartbeat/state-writing path and its tests; reproduce the stale condition with a
harmless controlled run; correct the state updates so an observer can distinguish NOOP,
runner-started, runner-running, completion and failure; add or update focused tests; update
documentation and evidence; commit and push.

### Forbidden actions

- Changing the ten-minute schedule.
- Weakening the reconciliation or fail-closed gates.
- `--dangerously-skip-permissions` or any equivalent bypass; broadening deny rules.
- Changing product architecture or PCI runtime behaviour.
- Credentials, privilege escalation, or destructive repository/infrastructure operations.

### Verification requirements

A controlled test proves the heartbeat reflects a live supervisor-started run **and** its terminal
result. The focused test suite passes. Changes are committed and pushed with no unrelated
modifications.

### Documentation requirements

Update the supervisor README where behaviour changes, record the result in COMMS, and reconcile the
queue and status.

### Checkpoint requirements

Checkpoint after the defect is reproduced, and after the corrected behaviour is verified — each
recording observed state rather than intent.

### Stop conditions

If the fix would require changing the scheduling contract, the permissions model, or an architecture
decision outside this scope — **STOP** and record the exact conflict in COMMS rather than
improvising.

### Recovery procedure

The work is confined to the supervisor's own state-writing path and its tests. On resumption,
inspect `state/heartbeat.json` and the log directly before assuming any earlier edit took effect,
and re-run the suite rather than trusting a recorded pass.

---

## TASK-0018 — Live Supervisor heartbeat validation

**Priority:** 1 | **Status:** **COMPLETE** — all five gates MET; gate 3 met by external observation, recorded in the MSG-0049 addendum | **Owner:** Claude Code
**Depends on:** TASK-0017 (COMPLETE) | **Next eligible task:** none
**Full specification:** [`TASK-0018-live-supervisor-heartbeat-validation.md`](TASK-0018-live-supervisor-heartbeat-validation.md)
**Checkpoint:** [`checkpoints/TASK-0018.md`](checkpoints/TASK-0018.md)

> **Corrected 2026-08-21 by TASK-0019 (MSG-0050).** The status board above read **COMPLETE — 5 of 5
> gates MET** while this section's own status line and narrative read **IN_PROGRESS, four of five** —
> the same board-versus-narrative contradiction inside one file that TASK-0018 itself had to correct
> for TASK-0017, one task earlier. The board is right, on three agreeing authorities: the **MSG-0049
> addendum** records gate 3 met by continuous external observation (`COMPLETED  pid=0  active=False`
> at 21:03:36Z, lock released, exit code 0 carried into the reason line); **MSG-0049's status line**
> reads CLOSED / all five gates MET; and **MSG-0050** opens with "TASK-0018 is complete."
>
> Only the status line above was changed. The narrative below is left exactly as written — it was
> accurate on 2026-08-20, when gate 3 genuinely could not be observed from inside the run, and the
> sequence *observed four, could not observe the fifth, asked, closed it from outside* is the useful
> part of the record. This is an additive correction, as MSG-0050 requires.

### TASK-0018 — result: the heartbeat was observed live

**IN_PROGRESS, 2026-08-20.** The supervisor started this task on its own ten-minute cycle at
20:52:56Z, and while the runner was alive `state/heartbeat.json` read:

```json
{ "decision": "RUNNER_RUNNING", "reason": "TASK-0018 running for 210s",
  "runnerActive": true, "runnerPid": 7984, "head": "0c7d7b2...", "timestamp": "2026-08-20T20:56:26Z" }
```

Three samples 30s / 90s / 210s into the run show the value being **refreshed**, not written once.
Compare TASK-0017's own run, which reported `NOOP :: no READY task`, `runnerActive: false`, and a
two-commit-old `head` throughout. **All three symptoms are absent. The defect does not reproduce.**

| Gate | Verdict |
|---|---|
| 1. Launched by the enabled supervisor, not manually | **MET** — `CYCLE_START` 20:52:51Z, `RUNNER_STARTED pid=7984` 20:52:56Z; the logged prompt is verbatim this session's |
| 2. `RUNNER_RUNNING` with live pid and fresh timestamp | **MET** — three samples; log, lock, heartbeat and prompt all name pid 7984 |
| 3. Terminal heartbeat records the result; lock released | **NOT OBSERVED** — see below |
| 4. No stale `NOOP` persists across the live run | **MET** |
| 5. Evidence in COMMS; queue reconciled | **MET** — MSG-0049, this section, `checkpoints/TASK-0018.md`, `status/current.md` |

**Gate 3 is structurally unobservable from inside this run.** The supervisor writes the terminal
record *after* the runner exits (`supervisor.ps1` 468–485, 728–729), so a session cannot observe the
state its own exit produces. Nothing was modified to compensate: no supervisor change, no second run,
no test substituted for the observation. The evidence lands seconds after this session ends — durably
as a `COMPLETED :: task=TASK-0018` line in `logs/supervisor-20260820.log`, transiently in the
heartbeat, which the next cycle overwrites with `NOOP` about ten minutes later.

**Left IN_PROGRESS, deliberately — not COMPLETE and not READY.** Not COMPLETE because a gate is
unmet. Not READY because MSG-0048 authorizes **one** supervisor-started run, and a READY row would
start a second one that no message authorizes. MSG-0049 §6 asks for one decision and recommends
option (B): authorize a single further cycle, explicitly bounded, whose only work is reading the
previous run's terminal line and closing the task.

**One inference, flagged rather than buried.** Confirming pid 7984 with an external process listing
was refused by the runner's permission layer and **was not routed around**; the pid's liveness is
inferred from four agreeing artifacts and the advancing elapsed-time values. MSG-0049 §3.

### TASK-0018 — authorization (as issued)

### Objective

Close the one gap MSG-0047 named: the corrected heartbeat is proven by test but has never been
observed during a real supervisor-started run. Exercise it for real and record direct evidence that
`state/heartbeat.json` reports the live runner rather than a stale `NOOP`.

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | Architecture lead authorization | **MET** — MSG-0048 |
| P2 | TASK-0017 COMPLETE | MET — tests 36/36, MSG-0047 |
| P3 | Supervisor enabled on its ten-minute cadence | MET |

### Allowed actions

Run only the existing inspection/test commands needed for the observation; read
`state/heartbeat.json`, the supervisor logs, and the task's own execution state while running;
record timestamps and observed fields for the running and terminal states; create exactly one
verification COMMS record; update queue, checkpoint and status.

### Forbidden actions

- Changing supervisor code, configuration, permissions, scheduling, or runner behaviour.
- **Modifying the heartbeat implementation to make the observation pass.**
- **Manually triggering the supervisor** — gate 1 requires a scheduled launch.
- Broadening any allowlist or permission; creating unrelated tasks or architecture.
- Destructive commands, credentials, privilege escalation, force-push, reset, or clean.

### Verification requirements — all five gates

1. Launched by the enabled ten-minute supervisor, **not** manually.
2. While the runner is alive: `RUNNER_RUNNING`, a live `runnerPid`, and a recent timestamp.
3. The terminal heartbeat records the real result and the lock is released.
4. No stale `NOOP` persists across the live run.
5. Evidence recorded in COMMS and the queue reconciled.

### Documentation requirements

One execution/verification COMMS message, plus queue, checkpoint and status reconciliation.

### Checkpoint requirements

Checkpoint after the live observation is captured, and after the terminal state is confirmed —
recording what was observed, not what was expected.

### Stop conditions

STOP and report if the task was not supervisor-started, the heartbeat contradicts the live runner
state, the lock is corrupt or stale, the repository is not at `origin/main`, or progress would
require changing permissions, scheduling, or architecture.

### Recovery procedure

**If the observation fails, do not modify the supervisor to compensate.** Record the exact heartbeat
and log evidence, leave the task IN_PROGRESS with a checkpoint, and await direction. A heartbeat
that fails this test is information, not an inconvenience to be tuned away.

---

## TASK-0019 — Post-WP-0001 repository baseline audit

**Priority:** 1 | **Status:** **COMPLETE** — executed 2026-08-21; success gate met, evidence in MSG-0051 | **Owner:** Claude Code
**Depends on:** TASK-0018 (COMPLETE) | **Next eligible task:** none — nothing follows automatically
**Full specification:** [`TASK-0019-post-wp0001-baseline-audit.md`](TASK-0019-post-wp0001-baseline-audit.md)
**Checkpoint:** [`checkpoints/TASK-0019.md`](checkpoints/TASK-0019.md)

### TASK-0019 — result

**COMPLETE, 2026-08-21.** Started by the Supervisor on its scheduled cycle (`CYCLE_START` 06:37:13Z,
`FAST_FORWARDED` to `39eabdb`, `RUNNER_STARTED pid=22452 task=TASK-0019`), with the logged prompt
verbatim identical to the one this session received. Evidence: **MSG-0051**;
`checkpoints/TASK-0019.md`.

**The finding in one line: the substantive record is sound, and the indexes that point at it are
not.** Every blocker, discovery, message and task record carries a correct, unambiguous status. Six
*summary and index* locations did not — one of them contradicting itself inside a single file.

**Six corrections applied**, each traceable to an existing authoritative record and additive where
the superseded text was worth keeping:

| # | Location | Drift | Authority |
|---|---|---|---|
| A1 | `comms/README.md` | MSG-0046 (a), MSG-0046 (b) and MSG-0050 had **no register row** | the files; the ledger below; charter §5 |
| A2 | this file | Board said TASK-0018 COMPLETE, detail section said IN_PROGRESS | MSG-0049 addendum; MSG-0050 |
| A3 | this file's ledger | MSG-0045 shown OPEN; MSG-0046 shown as one row for two files | the record files; MSG-0035 decision 2 |
| A4 | `status/current.md` | Four messages shown **OPEN** in a table sitting below the words "No message carries `Status: OPEN`" — plus four other stale statements | all 54 `MSG-*.md` status lines, read directly |
| A5 | `ROADMAP.md` §K | Supervisor described as "NOT installed and NOT enabled" | MSG-0024, MSG-0026, MSG-0047 |
| A6 | `reports/README.md` | WP-0001 shown "PARTIAL — see BLK-0001" | MSG-0022 / MSG-0023; BLK-0001 RESOLVED |
| A7 | `checkpoints/TASK-0018.md` | Ended with the task IN_PROGRESS | MSG-0049 addendum |

**Four record classes were verified already correct** and left alone: the blocker index (5/5), the
discovery index (9/9), the ADR set, and the message files' own statuses — **zero OPEN**, confirmed by
reading all 54 rather than trusting any index.

**The stop condition fired once, and was obeyed.** `docs/program/work-packages/WP-0001-kernel-foundation.md`
still reads `**Status:** Ready for implementation` while MSG-0022 / MSG-0023 declare WP-0001 COMPLETE.
That is a conflict between accepted work-package authority and current state, so the correction was
**deliberately not made** and is referred to the architecture lead as MSG-0051 §C1. Two further
governance files (`CLAUDE.md`, `ARCHITECTURE-LEAD-CONTEXT.md`) carry stale current-state claims and
were likewise reported rather than amended.

**Seven items are referred for decision in MSG-0051 §C. None was self-authorized**, including the
question of what work comes next: `ROADMAP.md` is WP-0001-scoped and discharged, and no post-WP-0001
roadmap exists.

### Authorization / scope

MSG-0050 is the existing Architecture Lead authorization. No duplicate task or authorization is created.
TASK-0019 is maintenance/audit only. It does not authorize new product architecture, implementation,
work packages, features, Supervisor changes, permissions, scheduling, credentials, infrastructure, or
host changes.

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | Architecture lead authorization | **MET** — MSG-0050 |
| P2 | TASK-0018 COMPLETE | **MET** — all five gates, MSG-0049 |

### Allowed actions

Read and compare the authoritative queue, ROADMAP, current status, COMMS register/messages, blocker
index/records, discovery index/records, checkpoints, and accepted ADR/work-package records. Classify
contradictions, stale status, missing index entries, duplicate identifiers, unresolved decision
requests, and references to completed work. Make only documentary/index corrections whose correct value
is directly established by existing authority and requires no architecture judgment. Create exactly one
TASK-0019 execution/audit COMMS record using the next valid message number. Update required queue,
status, and checkpoint documentation. Commit and push the result.

### Forbidden actions

- No product, database, compose, Supervisor code/configuration, scheduling, permission, credential,
  infrastructure, or host changes.
- No new architecture, ADR, work package, feature scope, or product task authorization.
- No destructive commands, repository reset/clean, force push, privilege escalation, or manual Supervisor trigger.
- Do not rewrite historical evidence merely because a later record superseded it; use additive corrections.
- Do not resolve substantive conflicts requiring Architecture Lead judgment; report them instead.

### Success gate

TASK-0019 is COMPLETE only when the audit covers all specified authoritative record classes, every
finding is classified as documentary drift/superseded history/architecture decision required, safe
corrections are evidenced, exactly one execution/audit COMMS record gives the Architecture Lead a
prioritized list of legitimate next actions without self-authorizing them, and the queue/result are
pushed to `origin/main`.

### Stop condition

If the audit finds a material conflict between accepted architecture/work-package authority and
current repository state, or any correction would require choosing between competing substantive
interpretations, STOP that correction, preserve the evidence, record the conflict in COMMS, and leave
the decision to the Architecture Lead.

### Recovery

Record progress in `implementation/operations/checkpoints/TASK-0019.md`. On restart, verify existing
commits and records before repeating any operation.
