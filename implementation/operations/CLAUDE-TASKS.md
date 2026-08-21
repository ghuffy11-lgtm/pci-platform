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
| TASK-0021 | **Employee policy assistant — architecture definition** | **COMPLETE** | WP-0001 COMPLETE, MSG-0054 | 2026-08-21 — 11/11 acceptance criteria, MSG-0055; **accepted by the Architecture Lead (MSG-0056a)** | none — all fourteen EPA-0003 decisions ruled (MSG-0056a/b); three reconciliation findings resolved by MSG-0058 | Claude Code |
| TASK-0022 | **Employee policy assistant — work-package definition** | **COMPLETE** — output **ACCEPTED** by MSG-0062 | TASK-0021 COMPLETE, MSG-0058 DECIDED, MSG-0059 | 2026-08-21 — `EPA-0004` delivered, MSG-0061; accepted MSG-0062 with all seven open items ruled | none — the seven items in MSG-0061 §7 are ruled by MSG-0062 | Claude Code |
| TASK-0023 | **EPA work-package governance reconciliation** | **READY** | TASK-0022 COMPLETE, MSG-0062 DECIDED, MSG-0063 AUTHORIZED | — | none — architecture/governance reconciliation only; **no implementation task may be marked READY** | Claude Code |
| TASK-0002 | Make test entry points shell-independent | **ABORTED** | — | 2026-08-19 | none — premise disproven by measurement | — |

**TASK-0019 is COMPLETE (2026-08-21).** It was authorized by MSG-0050, reconciled into this queue in `39eabdb`, and executed by a supervisor-started session on its scheduled 06:37:13Z cycle. It was maintenance/audit work only, not a new product work package.

**TASK-0023 is READY — the single READY task.** Authorized by **MSG-0063** and reconciled into this
board on 2026-08-21 after its prerequisites were verified individually, not assumed: TASK-0022
COMPLETE, MSG-0062 DECIDED, MSG-0063 AUTHORIZED, no OPEN blocker, no runner lock held, and exactly
one TASK-0023 specification file on disk.

It is **architecture/governance reconciliation only.** It may not implement, select any provider,
model, embedding, framework or runtime, change permissions, security boundaries, Supervisor behaviour
or scheduling, create or modify accepted ADRs, or perform any operator-only or privileged action.
**It may not mark any downstream implementation task READY.**

**EPA-0004 was ACCEPTED by MSG-0062**, which also ruled all seven of the open items MSG-0061 §7
raised. Three of those rulings change what the next task must do:

- **7.3** — **T-D (grounded QA) must precede T-E (retrieval-time authorization).** Authorization
  controls must not be validated against an unproven answer path.
- **7.6** — Restricted documents **are** eligible for the governed corpus, but **no retrieve-then-suppress
  design is permitted**: a Restricted document is never retrieved into a request unless the
  authenticated subject satisfies its policy, and denial must fail closed without revealing existence,
  content, timing, or result-count.
- **7.7** — **ADR-0015 is not inherited** as the service stack. A dedicated architecture task must
  propose the concrete stack; nothing is selected by that ruling.

**7.1 leaves the work-package identifier deliberately unallocated** — no existing WP number is
repurposed — and allocating it through the register reconciliation is TASK-0023's job.

> **Reconciliation warning, from MSG-0060 — still live.** Five times an authorization has existed while
> this queue did not reflect it, leaving the Supervisor idling on a healthy-looking "no READY task".
> TASK-0023 was the sixth occurrence: MSG-0063 authorized it and `grep -c "TASK-0023"` on this file
> returned **0**. It is reconciled now. When the next task is authorized, the same step is required
> again, or it becomes the seventh.

> **The line this replaces, retained:** "**TASK-0022 is COMPLETE (2026-08-21) and no task is READY.** …
> **No task is READY, and that is the correct state.** MSG-0059 makes the Architecture Lead's
> acceptance of EPA-0004 the precondition …" True from TASK-0022's completion until MSG-0062 accepted
> EPA-0004 and MSG-0063 authorized TASK-0023 on the same day. The acceptance boundary it described has
> been passed, not removed: implementation remains prohibited.

> **Reconciliation warning, from MSG-0060.** Five times now an authorization has existed while this
> queue did not reflect it, leaving the Supervisor idling on a healthy-looking "no READY task". When
> T-A is authorized, it must be **reconciled into this board as the single READY task** or it will be
> the sixth.

> **The line this replaces, retained:** "**TASK-0022 is READY — the single READY task**, authorized by
> MSG-0059 and reconciled into this board on 2026-08-21. It is architecture/work-package definition
> only …" True from the MSG-0060 reconciliation until TASK-0022 executed on the same day.

> **The line that replaced, retained:** "**No task is READY.**" True from TASK-0021's completion
> until MSG-0059 authorized TASK-0022. The note below it records the earlier correction and is
> kept intact.

> **Corrected 2026-08-21 by TASK-0021.** This line previously read "**No task is READY.** TASK-0019
> was the last authorized one." That was true when written and stopped being true when MSG-0054
> authorized TASK-0021, which was reconciled into the board above in `3350cb4` and has since been
> executed. **TASK-0021 is now COMPLETE** (MSG-0055) and no task is READY again — but for a different
> reason: the project sits at an **architecture decision boundary**, not at an empty queue.
> EPA-0003 lists fourteen decisions; four are marked Highest and are enough to unblock the
> foundation. The Supervisor will correctly remain idle until the lead authorizes something.

**MSG-0052 has since ruled on C1-C5** (2026-08-21). C1 is applied: the accepted work package now reads
`Status: COMPLETE`, so the conflict TASK-0019 referred is closed. C2 and C3 are applied as documentary
supersessions; C4 and C5 required no action. **C6 (a bounded proof of MSG-0049 option B) and C7 (the
next work package) remain architecture-lead decisions and are not self-authorized.**

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
| MSG-0054 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0021 authorized — architecture definition ONLY** for the employee policy assistant; outside WP-0001; no implementation, no work package yet | TASK-0021 |
| MSG-0053 | Decision | DECIDED | Architecture lead | Claude Code | **C6 NOT AUTHORIZED / NOT REQUIRED** (option B proof adds execution with no requirement); **C7 no new product work package** pending a concrete objective | — |
| MSG-0052 | Decision | DECIDED | Architecture lead | Claude Code | **C1-C5 ruled.** C1 WP-0001 status COMPLETE; C2/C3 documentary supersessions; C4/C5 no action; **C6/C7 not self-authorized** | TASK-0019 |
| MSG-0055 | Record | CREATED — definition delivered | Claude Code | Architecture lead | **TASK-0021 execution record.** Architecture definition produced as `EPA-0001` (architecture), `EPA-0002` (proposed work package, gates, sequence), `EPA-0003` (**fourteen open decisions**). All eleven acceptance criteria met. **No implementation, no work package, no ADR, no downstream task authorized.** §5 requests the rulings; §7 records three observations needing no action | TASK-0021 |
| MSG-0056a | Decision | DECIDED | Architecture lead | Claude Code | **EPA decision ruling.** TASK-0021 accepted as a complete architecture-definition task. Ten decisions ruled: D2 hybrid retrieval, D4 uniform abstention, D5 layered grounding gate (fail closed), D6 empirical normalization with the final rule in an ADR, **D8 external inference prohibited by default**, **D9 separate service outside the kernel** (ADR-0015 does not automatically govern it), D10 single-shot, D11 no historical questions in release 1, D12 grounded-answer contract promoted to an ADR, D14 text-native only. **D1, D3, D7, D13 escalated — the repository lacks the organizational authority to settle them.** No work package, no implementation task, no ADR, no provider selection authorized | 2026-08-21 |
| MSG-0056b | Decision | DECIDED | Architecture lead | Claude Code | **Employee policy assistant decisions — the four escalated by MSG-0056a, resolved from organizational authority supplied to the lead.** D1: English is the authoritative policy language, Arabic an approved translation; English governs on divergence and the discrepancy is flagged; citations always resolve to English. D3: only privileged users may place documents in the governed flow, upload does not confer authority, the creator must not be sole approver, only approved/published documents are authoritative. D7: session retention by default, administrator-configurable, storage minimized, retained content readable only by the asker. D13: configurable identity modes — Microsoft 365/Entra ID, existing AD/enterprise integration, and optional unauthenticated access for explicitly disclosable information. **No implementation authorized.** Shares a number with MSG-0056a; complementary, not contradictory | 2026-08-21 |
| MSG-0057 | Record + decision request | **OPEN** | Claude Code | Architecture lead | **Reconciliation of both MSG-0056 rulings.** All fourteen EPA-0003 decisions annotated inline with their source; register, ledger and status reconciled. Three findings need a lead decision before the work package is gated: **F1** the D1 ruling permits answer-time Arabic generation that EPA-0003 recommended prohibiting, so the D5 grounding gate must do cross-language entailment — scope and fallback undefined; **F2** unauthenticated access has zero supporting authority in accepted docs and names a classification value no spec enumerates (recommend deferring); **F3** AD integration must terminate at an OIDC/OAuth2 boundary or ADR-0007 is contradicted. **F4** records a fourth number collision. No task marked READY | 2026-08-21 |
| MSG-0058 | Decision | DECIDED | Architecture lead | Claude Code | **Rules the three MSG-0057 findings, all as recommended.** F1 cross-language grounding is **in scope and fail-closed** — if the Arabic gate fails the system **abstains**, never silently falling back to English or presenting an unofficial rendering as policy; the Arabic bar is evaluated separately under SPEC-0020. F2 unauthenticated access is **deferred** from the first release; no new trust boundary or classification is introduced. F3 enterprise directory integration **must terminate at the OIDC/OAuth2 boundary** of ADR-0007; direct LDAP/Kerberos implementation is not authorized. F4 preserve the MSG-0056a/b distinction and do not rename historical records. **Gate ruling:** findings sufficiently resolved to proceed to a work-package authorization task; implementation still prohibited | 2026-08-21 |
| MSG-0059 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0022 authorized** as the next architecture/work-package definition task. May define scope, gates, acceptance criteria, dependencies, security checkpoints, and the implementation task sequence. **Does not authorize** implementation, provider/model selection, runtime changes, deployment, new permissions, or Supervisor changes, and **no implementation task may be marked READY**. Requires TASK-0022 to be **the single READY task on the board** before the Supervisor may execute it, and the Lead must accept its output before implementation is authorized | 2026-08-21 |
| MSG-0060 | Record | **OPEN** | Claude Code | Architecture lead | **Queue reconciliation for TASK-0022, and a fifth collision — this time on an executable task specification.** Two TASK-0022 files were committed; they agree on scope, authorization, forbidden list and acceptance gate, so no stop fired, but they differ in content (A carries stop conditions and the recommendations-only constraint; B carries a ten-item outcome list). The queue section carries the **union** and links both; neither was renamed, per MSG-0058 F4. TASK-0022 is now the single READY task | 2026-08-21 |
| MSG-0061 | Record | CREATED — awaiting acceptance | Claude Code | Architecture lead | **TASK-0022 execution record.** `EPA-0004` delivered as a **PROPOSED** work-package definition: thirteen gates (G1–G13; G12 identity and G13 retention/privacy are new), ten dependency-ordered tasks (T-0 IdP as an **operator** task, then T-A…T-I), five test tiers, T1–T11 threat coverage, and every required field of the work-package standard. All fourteen rulings and F1–F4 folded in; **F1's cross-language gate is made a protocol-level contract rule** so a failed Arabic gate abstains rather than falling back to English. **No implementation, no ADR created, no provider or stack selected, no work-package number allocated, no task marked READY.** §7 refers **seven decisions** to the Architecture Lead, led by *may a policy document be Restricted?* — the one D3 sub-question MSG-0056b does not reach | 2026-08-21 |
| MSG-0062 | Decision | DECIDED | Architecture lead | Claude Code | **EPA-0004 ACCEPTED** as the bounded work-package definition, and **all seven MSG-0061 §7 items ruled.** 7.1 allocate a **new** work package, no existing WP number repurposed, identifier allocated by register reconciliation. 7.2 create only the ADRs needed to make the architecture enforceable before production; numbers allocated by convention in the next architecture task. **7.3 T-D (grounded QA) precedes T-E (retrieval-time authorization)** — authorization must not be validated against an unproven answer path. 7.4 integrate an OIDC/OAuth2 provider, never implement one; selection and deployment stay operator actions. 7.5 **a bounded corpus survey is authorized before T-B**, discovery input only, no production ingestion. **7.6 Restricted documents are eligible for the corpus but NO retrieve-then-suppress design is permitted** — never retrieved unless the subject satisfies policy; denial fails closed without revealing existence, content, timing, or result-count. **7.7 ADR-0015 is not inherited** as the service stack; a dedicated task proposes it. **Acceptance does not authorize implementation** | 2026-08-21 |
| MSG-0063 | Decision | AUTHORIZED | Architecture lead | Claude Code | **TASK-0023 authorized** — reconcile EPA-0004 and the MSG-0062 rulings into the governed work-package records, resolve the WP numbering/register discrepancy, allocate the formal work-package identity, and define the dependency-ordered architecture tasks and ADR allocation. Seven acceptance criteria. **Forbidden:** implementation, provider/model/runtime selection, permission or security-boundary changes, Supervisor changes, and **marking any implementation task READY**. Must reconcile rather than duplicate existing records | 2026-08-21 |
| MSG-0064 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0023 queue reconciliation.** MSG-0063 authorized TASK-0023 and the queue did not contain it — the **sixth** recurrence of the MSG-0044 gap. Reconciled as the single READY task after verifying prerequisites individually: TASK-0022 COMPLETE, MSG-0062 DECIDED, MSG-0063 AUTHORIZED, no OPEN blocker, no runner lock, one specification file. Verified by dry run. **TASK-0023 was not executed in this session**, per the operator instruction | 2026-08-21 |
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

**The stop condition fired once, and was obeyed.** At the time of the audit,
`docs/program/work-packages/WP-0001-kernel-foundation.md`
still read `**Status:** Ready for implementation` while MSG-0022 / MSG-0023 declared WP-0001 COMPLETE.
**Resolved 2026-08-21 by MSG-0052 C1** — the work package now reads `Status: COMPLETE`.
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

---

## TASK-0021 — Employee policy assistant: architecture definition

**Priority:** 1 | **Status:** **COMPLETE** — executed 2026-08-21; all eleven acceptance criteria met, evidence in MSG-0055 | **Owner:** Claude Code
**Depends on:** WP-0001 COMPLETE | **Next eligible task:** none — the work package itself is not authorized
**Full specification:** [`TASK-0021-employee-policy-assistant-architecture-definition.md`](TASK-0021-employee-policy-assistant-architecture-definition.md)
**Checkpoint:** [`checkpoints/TASK-0021.md`](checkpoints/TASK-0021.md)

### TASK-0021 — result

**COMPLETE, 2026-08-21.** Started by the Supervisor on its own cycle (`CYCLE_START` 11:05:47Z,
`RUNNER_STARTED pid=26508 task=TASK-0021`), with the logged prompt verbatim identical to the one the
session received. Evidence: **MSG-0055**; `checkpoints/TASK-0021.md`.

**Delivered** — four PROPOSED records under [`../architecture/`](../architecture/README.md), carrying
no architectural authority:

| File | Contents |
|---|---|
| `EPA-0001` | Architecture definition: scope boundary, document authority and lifecycle, components and data flow, the grounded-answer contract, bilingual behaviour, four-point authorization, threat model T1–T11, frontend responsibilities, audit and retention, operational architecture, conflict check against every accepted document it touches |
| `EPA-0002` | Proposed work package: scope/non-scope, data contracts, interfaces, gates G1–G11, prerequisites, task sequence T-A…T-I. **Written in the conditional; authorizes nothing** |
| `EPA-0003` | **Fourteen open architecture-lead decisions**, each with options, consequences and a recommendation |

**The finding in one line: the boundary is definable from existing authority, and the one genuine
authority vacuum is bilingual policy semantics.** A search of `docs/` and the Constitution for
language/Arabic/bilingual/localization returns a single relevant line — SPEC-0016's notification
templates. Everything else instantiates SPEC-0011/0013/0014/0015/0031, ADR-0016 and ADR-0003 under a
stricter contract; EPA-0001 §12 names the five things that are genuinely new so review effort lands
in the right place.

**No stop condition fired**, and all three were checked explicitly (MSG-0055 §6). Repository authority
was sufficient; **no accepted ADR conflicts** — three areas are *stricter* than the accepted baseline,
which under the authority hierarchy is not a contradiction, and is flagged as decision D12 anyway; and
no decision required inventing product scope, because none was made.

**Nothing was verified by execution.** This was a definition task and produced no runnable artifact,
so there is no test count to report. Its acceptance criteria are documentary and each is mapped to its
evidence in MSG-0055 §9.

**Three observations, none requesting action** (MSG-0055 §7): the work-package registers already
disagree about WP-0001/WP-0002 so **EPA-0002 allocates no number**; MSG-0054's proposed task order
builds the answer path before retrieval-time authorization, which was **followed as issued** with a
mitigation offered rather than a reordering made; and the COMMS register lag recurred — MSG-0054 had
no register row — and was corrected in the same commit.

### TASK-0021 — authorization (as issued)

### Objective

Turn the new product objective — an employee-facing assistant answering only from approved
organizational policy, in English and Arabic, with authoritative citations and fail-closed
abstention — into a decision-ready architecture specification. **Definition only.**

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | Architecture lead authorization | **MET** — MSG-0054 |
| P2 | WP-0001 COMPLETE | MET — TASK-0009, MSG-0022 / MSG-0023 |
| P3 | This objective recognised as outside WP-0001 | MET — MSG-0054 ruling |

### Allowed actions

Define, at architecture level only: approved-document authority and lifecycle; ingestion,
normalization, chunking and provenance; retrieval and grounded QA with citation, abstention and
prompt-injection defence; English/Arabic behaviour including cross-language retrieval; authorization
and confidentiality enforced at retrieval time; auditability and retention; frontend
responsibilities; PCI kernel integration boundaries; required ADRs, threat decisions, data
contracts, interfaces and acceptance gates. Produce one architecture-definition COMMS record plus
the repository documentation that makes the next work package unambiguous.

### Forbidden actions

- **No product implementation** — no ingestion, retrieval, LLM, frontend, or schema migration code.
- No credentials, no external model-service registration.
- No supervisor configuration, scheduling, or permission changes.
- No change to accepted WP-0001 architecture, the `/data` boundary, or existing fail-closed controls.
- **No authorization of downstream implementation tasks** — the work package is not yet authorized.

### Verification requirements

All eleven acceptance criteria in the specification, notably: the objective is established as
**outside WP-0001**; the grounded-answer contract prevents unsupported policy claims and requires
authoritative citations; English and Arabic behaviour is explicit including cross-language
boundaries; authorization is enforced **at retrieval time, not only at the frontend**; audit and
retention are defined without exposing unnecessary sensitive content; prompt injection and
exfiltration through documents are addressed; and unresolved substantive choices are **recorded as
architecture-lead decisions rather than guessed**.

### Documentation requirements

One architecture-definition COMMS record; supporting repository documentation; queue, checkpoint and
status reconciliation. Commit and push before reporting completion.

### Checkpoint requirements

Checkpoint after the scope boundary and document-authority model are settled, and again before the
final record is committed — recording what was decided and what was deliberately left open.

### Stop conditions

Stop and record if repository authority is insufficient to define a safe boundary, if an accepted
ADR conflicts materially with the proposed architecture, or if a decision would require **inventing
product scope the objective did not supply**. Guessing scope is the failure mode this task most
needs to avoid: an architecture invented to fill a silence is harder to unpick than an open question.

### Recovery procedure

The work is documentary. On resumption, re-read MSG-0054 and the specification before continuing,
and check which sections already exist rather than rewriting them — a half-written architecture
record is easy to duplicate and hard to reconcile.

---

## TASK-0022 — Employee policy assistant: work-package definition

**Priority:** 1 | **Status:** **COMPLETE** (2026-08-21) — the deliverable is **PROPOSED** and awaits the Architecture Lead's acceptance | **Owner:** Claude Code
**Depends on:** TASK-0021 COMPLETE; MSG-0058 DECIDED (F1-F4); MSG-0059 (authorization)
**Delivered:** [`EPA-0004`](../architecture/EPA-0004-employee-policy-assistant-work-package-definition.md) | **Execution record:** [`MSG-0061`](../comms/MSG-0061-task-0022-execution-record.md)
**Next eligible task:** none — the Architecture Lead must accept this task's output before any implementation task is authorized

> **Executed 2026-08-21 by a supervisor-started session.** Both specification files were read; the
> requirements below are the union and every one is mapped to its evidence in MSG-0061 §2. The task
> produced **no test count**, as its verification section requires, and none is claimed. **No task was
> marked READY**, and seven decisions are referred to the lead in MSG-0061 §7. The requirements below
> are retained unchanged as the specification that was executed against.

**Full specification — TWO files, both authoritative, read BOTH:**

- [`TASK-0022-employee-policy-assistant-work-package-definition.md`](TASK-0022-employee-policy-assistant-work-package-definition.md) — referred to below as **spec A**
- [`TASK-0022-policy-assistant-work-package-definition.md`](TASK-0022-policy-assistant-work-package-definition.md) — referred to below as **spec B**

> **Why two.** Both were committed by the Architecture Lead on 2026-08-21 (`768300b`, `4fca7fe`) and
> **they agree** — same scope, same authorization, same forbidden list, same acceptance gate — so this
> is not a conflict and no stop condition fired. They are not identical in content: spec A carries the
> stop conditions and the "queue changes as recommendations only" constraint; spec B carries a finer
> ten-item outcome list. **The requirements below are the union of both.** Neither file was renamed,
> per the MSG-0058 F4 ruling that historical records are not renamed. Recorded in MSG-0060.

### Objective

Define the bounded post-WP-0001 work package for the Employee Policy Assistant, using the accepted EPA
architecture decisions (EPA-0001/0002/0003 as ruled by MSG-0056a/b) and the MSG-0058 findings.

**This is architecture/work-package definition only.** It authorizes no implementation.

### Required outputs — the union of both specifications

1. **Work-package scope and boundaries**, covering approved-document management, versioning and
   supersession; ingestion, normalization, provenance and retrieval contracts; grounded English/Arabic
   answering with citation and abstention gates; retrieval-time authorization and confidentiality;
   session-only default retention with configurable retention; authenticated identity via OIDC/OAuth2;
   auditability and security boundaries; the employee-facing frontend contract; and superseded-policy
   handling.
2. **Explicit implementation gates and acceptance criteria**, derived from EPA-0001/EPA-0002/EPA-0003
   and MSG-0056a/b and MSG-0058.
3. **A dependency-ordered implementation task sequence**, with security and architecture checkpoints
   and explicit architecture/operator boundaries.
4. **Test/acceptance gates and threat-model coverage.**
5. **Identification of any remaining genuine architecture decisions.** Do **not** invent decisions that
   are already settled — all fourteen EPA-0003 decisions are ruled, and F1-F4 are ruled by MSG-0058.
6. **A proposed work-package record and execution queue changes as recommendations only.**

### Binding architecture rulings (MSG-0058, MSG-0059)

- **English is authoritative**; Arabic is an approved translation/access language.
- **Cross-language grounding is in scope and fail-closed.** If the Arabic grounding gate fails the
  system must **abstain** — never silently fall back to English, never present an unofficial rendering
  as policy. The Arabic acceptance bar is evaluated separately under SPEC-0020.
- **Unauthenticated access is deferred** from the first release; first release requires authenticated
  identity. No new unauthenticated classification or trust boundary is introduced.
- **Enterprise directory integration terminates at the OIDC/OAuth2 boundary** required by ADR-0007.
  Entra ID, AD FS, or an OIDC/OAuth2 broker may front an existing directory. **Direct LDAP/Kerberos
  authentication implementation is not authorized.**
- **Only approved/published documents are authoritative sources.**
- **Session-only conversation retention is the default**, with configurable retention support.

### Forbidden

- No product or runtime implementation.
- No provider/model selection or external model registration.
- No changes to accepted ADRs.
- No new permissions, security boundaries, Supervisor behaviour, or scheduling changes.
- No credentials or external privileged operations.
- **No implementation task may be marked READY by this task** — queue changes are recommendations only.

### Verification

The definition is complete only when scope, boundaries, acceptance criteria, dependencies, security
gates, and the proposed implementation sequence are documented **and reconciled with the governing
architecture records**. Unresolved decisions must be stated explicitly rather than omitted.

Being documentary, this task produces no test count. Do not report a test result it cannot have; report
each required output against its evidence instead.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md` and this queue, and write the checkpoint. A completely new session
must be able to resume from the repository alone.

### Checkpoint

`implementation/operations/checkpoints/TASK-0022.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one — the TASK-0021 checkpoint recorded a push as successful before
it was attempted, and the push was then rejected (BLK-0006).

### Stop conditions

Stop and report through COMMS if repository authority materially conflicts, if a required architecture
decision is genuinely missing, or if completing the task would require implementation or an
unauthorized architecture change.

**Also stop if `origin/main` moves mid-run.** BLK-0006 is the precedent: the deliverable was pushed,
the Architecture Lead pushed concurrently, and the closeout push was rejected. Stopping was correct.
Record the starting HEAD in checkpoint 1 and re-check it before every push.

### Recovery procedure

The work is documentary. On resumption, re-read MSG-0058, MSG-0059, and **both** specification files
before continuing, and check which sections already exist rather than rewriting them — a half-written
architecture record is easy to duplicate and hard to reconcile.

---

## TASK-0023 — EPA work-package governance reconciliation

**Priority:** 1 | **Status:** **READY** | **Owner:** Claude Code
**Depends on:** TASK-0022 COMPLETE; MSG-0062 DECIDED (EPA-0004 accepted, seven items ruled); MSG-0063 AUTHORIZED
**Next eligible task:** none — MSG-0063 reserves the next authorization to the Architecture Lead after this task is accepted
**Full specification:** [`TASK-0023-epa-work-package-reconciliation.md`](TASK-0023-epa-work-package-reconciliation.md)
**Checkpoint:** `implementation/operations/checkpoints/TASK-0023.md`

> **One specification file this time**, and MSG-0062/MSG-0063 carry distinct numbers — verified on
> reconciliation. The TASK-0022 union treatment was needed because two files existed; it is not needed
> here. Read the specification **and** MSG-0062 and MSG-0063: the acceptance criteria below come from
> MSG-0063, and the rulings the task must apply come from MSG-0062.

### Objective

Reconcile the **accepted** EPA-0004 work-package definition and the MSG-0062 rulings into the
authoritative governance records. **Architecture and governance only — no implementation.**

### Required work (TASK-0023 specification)

1. Re-read MSG-0062, MSG-0063, EPA-0004, the work-package register, and the existing work-package
   records.
2. **Resolve the WP numbering/register discrepancy explicitly, preserving historical WP-0001** and the
   existing records.
3. Allocate and record the formal work-package identity using the repository's established convention,
   **without inventing or repurposing an existing identifier**.
4. Reconcile the six proposed ADR surfaces into an explicit architecture sequence, **creating no ADRs**
   unless separately authorized.
5. Record **T-0 as an operator-only prerequisite**, kept distinct from Claude-executable work.
6. Produce the dependency-ordered architecture/implementation gate sequence, with the next task
   **identified but not implicitly authorized**.
7. Reconcile COMMS, queue, status, and work-package records consistently.

### Acceptance criteria (MSG-0063)

1. EPA-0004 remains the accepted architecture/work-package definition.
2. The register/directory discrepancy is explicitly reconciled **without repurposing historical WP-0001**.
3. The formal work-package identifier is recorded consistently in the authoritative work-package records.
4. The six ADR recommendations become an explicit proposed/required ADR sequence, **no duplicates and
   no modification of accepted ADRs**.
5. T-0 operator prerequisites, including authenticated IdP deployment, are clearly separated from
   Claude-executable work.
6. The resulting sequence is dependency ordered, with **only the next authorized architecture task
   eligible for READY after queue reconciliation**.
7. **No implementation authorization is implied.**

### Rulings this task must apply (MSG-0062)

- **7.1** — allocate as a **new** work package; **no existing WP number is repurposed**. The identifier
  is allocated by the register reconciliation before implementation authorization.
- **7.2** — create only the ADRs needed to make the accepted architecture enforceable before production:
  the grounded-answer contract, and any new service-boundary/security decisions not already covered.
  **Numbers allocated by repository convention during the next architecture task** — this task defines
  the sequence, it does not create the ADRs.
- **7.3** — **T-D (grounded QA) precedes T-E (retrieval-time authorization).** Authorization controls
  must not be validated against an unproven answer path. Security review remains a gate on the complete
  path before release.
- **7.4** — first release requires an authenticated OIDC/OAuth2 provider; **the platform integrates,
  it does not implement one**. Provider selection and privileged deployment are operator/organization
  actions that must be established before the identity-dependent gates.
- **7.5** — a **bounded corpus survey is authorized before T-B**, as a discovery/architecture input
  only: formats, language mix, scanned-document prevalence, classification/audience patterns,
  version and supersession characteristics. It **must not ingest production content or bypass approval
  controls**.
- **7.6** — Restricted documents **are eligible** for the governed corpus, but **no retrieve-then-suppress
  design is permitted**. A Restricted document is never retrieved into an employee request unless the
  authenticated subject satisfies its authorization policy, and denial must **fail closed without
  revealing existence, content, timing, or result-count**.
- **7.7** — **ADR-0015 is not inherited** as the service stack. The service stays outside the kernel
  boundary and uses accepted platform contracts; a dedicated architecture task proposes the concrete
  stack. **No provider, framework, model, embedding technology, or runtime is selected.**

### Forbidden

- No product or runtime implementation.
- No provider, model, embedding, framework, or runtime selection.
- No permission or security-boundary changes.
- No Supervisor behaviour or scheduling changes.
- **No creation or modification of accepted ADRs.**
- No operator-only action, credential access, or privileged host operation.
- **Do not mark any downstream implementation task READY.**

### Verification

Complete only when the authoritative work-package records, COMMS, queue, and status **agree**; the
formal work-package identity is established **without historical collision**; the ADR sequence is
explicit; T-0 is identified as operator-only; and no implementation authorization has been implied.

Being documentary, this task produces **no test count**. Do not report a test result it cannot have —
map each acceptance criterion to re-readable evidence instead.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and the work-package records, and write the checkpoint.
A completely new session must be able to resume from the repository alone.

### Checkpoint

`implementation/operations/checkpoints/TASK-0023.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one.

### Stop conditions

Stop and record COMMS if the authoritative records materially conflict, if a work-package identifier
**cannot be allocated without repurposing an existing identifier**, or if completing the task would
require an architecture decision beyond MSG-0062/MSG-0063.

**Also stop if `origin/main` moves mid-run.** BLK-0006 is the precedent, and the Architecture Lead has
pushed concurrently during three of the last four tasks. Record the starting HEAD in checkpoint 1 and
re-check it before every push.

> **Known runner limit, not a defect to route around.** `git fetch` is off the runner allowlist, so a
> mid-run move by the lead is detectable only when a push is rejected. Both TASK-0022 and BLK-0006
> record this. Do not attempt to work around it; record it and stop if a push is rejected.

### Recovery procedure

The work is documentary. On resumption, re-read MSG-0062, MSG-0063, EPA-0004 and the specification,
and check which records already exist rather than rewriting them — governance records are easy to
duplicate and hard to reconcile, which is the exact failure this task exists to fix.
