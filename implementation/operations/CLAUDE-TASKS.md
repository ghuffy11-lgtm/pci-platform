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
| TASK-0009 | WP-0001 completion decision | **COMPLETE** | TASK-0008 | 2026-08-19 | none — WP-0001 complete; no post-WP-0001 work authorized | Architecture lead |
| TASK-0003 | Normalise `*.md` line endings (DISC-0006) | **COMPLETE** | — | 2026-08-20 w/crlf 150 -> 0 | none | Claude Code |
| TASK-0010 | Execution Supervisor (installed and **ENABLED**, 10-min) | **COMPLETE** | — | 2026-08-19 tests 21/21, enabled cycle verified | none — start path proven by TASK-0003 | Claude Code |
| TASK-0011 | **Execution Supervisor smoke test — COMMS audit and end-to-end report** | **COMPLETE** | TASK-0010 | 2026-08-20 `d16665a` — PASSED | none — terminal by design; no task is READY | Claude Code |
| TASK-0002 | Make test entry points shell-independent | **ABORTED** | — | 2026-08-19 | none — premise disproven by measurement | — |

**TASK-0011 is a one-time execution-infrastructure test, not a new product work package.** It is explicitly authorized by the architecture lead to prove that a READY task is automatically selected, Claude actually starts, Claude can read the shared repository state, Claude can create a COMMS record, and the result is pushed back to GitHub without user relay.

### TASK-0011 — exact scope and boundaries

**Allowed:**
- Read `implementation/comms/README.md` and every `implementation/comms/MSG-*.md` file.
- Reconcile the register against the actual message files and identify any stale/missing/contradictory status.
- Read `implementation/operations/CLAUDE-TASKS.md` and confirm TASK-0011 is the only READY task.
- Read the Supervisor implementation/configuration as needed to explain the observed execution path.
- Create exactly one new COMMS record, **MSG-0032**, documenting the smoke-test result, evidence, and whether the end-to-end path worked.
- Update the COMMS register to include MSG-0032 in the same commit.
- Mark TASK-0011 COMPLETE in this queue only after the evidence is committed and pushed.
- Push the resulting commit with the existing narrowly authorized `git push origin main` capability.

**Forbidden:**
- No product/code changes.
- No changes to Supervisor permissions, scheduling, deny rules, or runner configuration.
- No new task authorization or priority changes.
- No changes to existing architectural decisions.
- No closing, reopening, or rewriting existing COMMS messages except correcting an objectively stale register entry required to make the audit truthful; if such a correction would alter substance, STOP and report it instead.
- No credential access, privilege escalation, destructive commands, repository reset/clean, or force push.

**Success gate:** A successful run must leave a pushed Git commit containing MSG-0032 and the corresponding register entry, with TASK-0011 marked COMPLETE. MSG-0032 must state whether Claude was automatically launched by the Supervisor and provide concrete repository evidence. A run that merely opens and closes PowerShell without producing this evidence is a **failure**, not a pass.

**Stop conditions:** If the queue is not READY when read, repository reconciliation fails, the Supervisor/runner is not the actor that started the task, the required push is unavailable, or any action outside the exact scope above is needed, STOP, document the reason in COMMS if possible, and do not improvise.

**No continuation after TASK-0011.** This is a terminal smoke test; after it completes there will be no READY task unless the architecture lead explicitly authorizes another one.

### TASK-0011 — RESULT: PASSED (2026-08-20)

The Supervisor selected the READY task, launched Claude, Claude read shared repository state,
produced the audit, and pushed it to GitHub. **No human relayed anything.** Full record and evidence:
[`../comms/MSG-0032-task-0011-supervisor-smoke-test.md`](../comms/MSG-0032-task-0011-supervisor-smoke-test.md).

Success gate, item by item:

| Requirement | Verdict |
|---|---|
| Pushed commit containing MSG-0032 and its register entry | **MET** — `d16665a`, pushed `479dfa9..d16665a` |
| TASK-0011 marked COMPLETE | **MET** — this row, in the follow-on commit |
| MSG-0032 states whether the Supervisor launched Claude, with concrete evidence | **MET** — MSG-0032 §2, three independent artifacts |
| Not merely a PowerShell window opening and closing | **MET** — that was the *prior* failure; diagnosed in MSG-0032 §3 |

The earlier attempts failed at the **reconciliation gate**, before the queue was ever read: the clone
was behind `origin/main` because the lead had just pushed this very authorization. A NOOP, not a
runner, prompt, permission, or Claude-session failure. Corrected in `479dfa9`; this run is the first
cycle after that fix.

**Scope held.** No product or code change, no Supervisor permission/schedule/deny/runner change, no
task authorized, no priority or scope changed, no architectural decision altered, no COMMS message
opened, closed, reopened, or rewritten. Exactly one new COMMS record was created.

**Two findings stop short of action and request a ruling** — MSG-0032 §6.2 (the blocker register
contradicts the status file; correcting a blocker status is substantive and outside this scope) and
§6.3 (message numbers have now been duplicated twice). Neither blocks anything.

**Note for whoever authorizes next.** TASK-0011 is the first queue entry written with an explicit
scope block — allowed, forbidden, success gate, stop conditions. It worked: the boundaries were
unambiguous in execution, *including where to stop*. Recommended as the pattern.

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
| MSG-0014 | Directive | DECIDED | Architecture lead | Claude Code | Queue authorization reconciliation | TASK-0004, TASK-0005 |
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
| MSG-0025 | Question | CLOSED | Claude Code | Architecture lead | **Supervisor installed and verified in dry-run; NOT enabled.** Runner invocation and permission posture required | TASK-0010 |
| MSG-0026 | Record | CLOSED | Claude Code | Architecture lead | **Supervisor ENABLED.** acceptEdits + version-controlled deny list; no bypassPermissions. Deny rules are the effective control, not the mode. Start path unproven until a task is READY | TASK-0010 |
| MSG-0027 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0003 authorized and marked READY; line-ending normalization only** | TASK-0003 |
| MSG-0028 | Record | DECIDED | Claude Code | Architecture lead | **TASK-0003 implemented, NOT complete.** Attribute set, zero content changed; working-tree refresh of 152 files refused by the permission layer and not worked around. Decisions resolved by MSG-0030 | TASK-0003, TASK-0010 |
| MSG-0029 | Record | CLOSED | Claude Code | Architecture lead | **Supervisor start path diagnosed and fixed; first launch PROVEN.** Symptom was the reconciliation gate, not the runner. Three start-path defects fixed | TASK-0010 |
| MSG-0030 | Question | DECIDED | Architecture lead | Claude Code | Option B authorized: `git checkout -- "*.md"` | TASK-0003 |
| MSG-0031 | Record | DECIDED | Claude Code | Architecture lead | **TASK-0003 COMPLETE.** CRLF residue 150 -> 0; stat-cache `touch` addition accepted as scoped to MSG-0030 Option B | TASK-0003 |
| MSG-0032 | Record | **CREATED — smoke test PASSED** | Claude Code | Architecture lead | Execution Supervisor smoke-test result; end-to-end queue → Supervisor → Claude → COMMS → GitHub evidence. Two findings request a ruling (§6.2 blocker register, §6.3 message numbering) | TASK-0011 |
| MSG-0033 | Directive | DECIDED | Architecture lead | Claude Code | Diagnose and correct the TASK-0011 execution path before treating it as a pass | TASK-0011 |
| MSG-0034 | Record | OPEN | Claude Code | Architecture lead | **Cause: reconciliation gate — the clone was behind, so nothing ever pulled.** Fixed with a gated fast-forward; smoke test then PASSED | TASK-0011 |
| MSG-0033 (a) | Directive | DECIDED | Architecture lead | Claude Code | TASK-0011 smoke-test diagnosis and corrective action; durable logging so a cycle that dies early still leaves a trace | TASK-0011 |
| MSG-0033 (b) | Directive | DECIDED | Architecture lead | Claude Code | TASK-0011 retry: distinguish NOOP/reconciliation from runner, prompt, permission, and session failure; smallest correction only. **Duplicate number, non-conflicting** — both satisfied by `479dfa9` and answered in MSG-0032 §3 | TASK-0011, TASK-0010 |

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
