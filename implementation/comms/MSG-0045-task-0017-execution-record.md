# MSG-0045 — TASK-0017 execution record: heartbeat corrected, NOT verified

**Status:** **CLOSED** — the decision came in MSG-0046 (Option A); the test was run and TASK-0017 is COMPLETE (MSG-0047). Original text follows.
**Superseded header:** OPEN — a decision is required. The correction is written and committed; its success
gate cannot be met by an unattended session
**Type:** Record + decision request
**From:** Claude Code (session started by the Execution Supervisor, 2026-08-20T12:31:16Z)
**To:** Architecture lead
**Date:** 2026-08-20
**Authority:** MSG-0043 (TASK-0017 authorized) | **Related:** TASK-0017, TASK-0010, MSG-0028, MSG-0042, MSG-0044

---

## 1. Summary

TASK-0017 is **IMPLEMENTED but NOT COMPLETE.**

The defect was reproduced, diagnosed, and corrected, and focused tests were written for it. **The
test suite could not be executed**: no permission-layer allowlist entry permits running a PowerShell
script, so the command documented in the supervisor README was refused three times. MSG-0043's
success gate requires that "the relevant test suite passes", and it therefore is **not met**.

No substitute was used. CLAUDE.md Rule 2 forbids routing around a permission denial, so the denial is
reported instead — the same boundary that stopped TASK-0003, and the same shape as MSG-0028 §2.

## 2. The defect — VERIFIED by direct observation

**This session was itself the reproduction.** No contrived test was needed. The Supervisor started
this runner at 12:31:16Z; while it was running, `state/heartbeat.json` still described the previous
idle cycle:

```text
state/heartbeat.json                    <- what an external observer sees
{ "timestamp": "2026-08-20T12:27:18Z", "decision": "NOOP", "reason": "no READY task",
  "readyTask": "", "head": "420eabc...", "runnerActive": false, ... }

state/runner.lock                       <- what was actually happening
{ "taskId": "TASK-0017", "pid": 24376, "acquired": "2026-08-20T12:31:15Z", ... }

logs/supervisor-20260820.log
2026-08-20T12:31:16Z [ACTION] RUNNER_STARTED :: pid=24376 task=TASK-0017
```

Four ways the heartbeat was wrong about the present moment: `decision: NOOP` and `reason: no READY
task` while a task was selected and running; `runnerActive: false` while a runner had been alive for
minutes; `readyTask: ""` while TASK-0017 was in flight; and `head: 420eabc` while actual HEAD was
`d0007b0`.

**The log was correct throughout.** That is worth stating: the defect was confined to the state file,
never to the supervisor's decision-making. Nothing was mis-scheduled, and no run was lost. What was
lost was the ability to *see* a run from outside.

## 3. Cause — established, not guessed

`supervisor.ps1` wrote the heartbeat in exactly one place: the nested `Complete-Cycle` helper, which
runs only at a cycle's **terminal** point. When a runner starts, `Start-RunnerProcess` calls
`$proc.WaitForExit()` and blocks for the entire Claude session. Between lock acquisition and that
call returning there was no heartbeat write anywhere on the path, so the file kept the previous
cycle's content for the whole run — minutes to hours.

A second, smaller defect sat beside it: a **completed** run also wrote `decision: STARTED`, with the
difference carried only in free-text `reason`. Parsing `decision` could not distinguish "just
launched" from "finished successfully".

## 4. The correction

`implementation/operations/supervisor/supervisor.ps1`:

1. **`Start-RunnerProcess` now polls instead of blocking.** `while (-not $proc.WaitForExit($ms))`
   with an `OnProgress` callback every `ProgressIntervalSeconds`. Both stream `.Result` reads are
   retained deliberately — the timed `WaitForExit` overload does *not* drain redirected streams the
   way the argless one does, and dropping them would truncate output written just before exit.
2. **A heartbeat is written the instant the runner launches**, inside the existing `OnStarted`
   callback, carrying the task id and the live runner PID.
3. **A heartbeat is refreshed while the runner is alive**, via `OnProgress`, carrying elapsed
   seconds. A failing callback is caught and logged — it must never kill a running task.
4. **The decision vocabulary now distinguishes the five states MSG-0043 asked for.** `STARTED` is
   replaced by `RUNNER_STARTED`, `RUNNER_RUNNING`, `COMPLETED`, and `FAILED`. `ERROR` is narrowed to
   mean the *supervisor itself* failed, as against a runner that failed — different reader, different
   remedy.
5. **`runnerPid` added to the heartbeat**, so the claim "a runner is active" is checkable against the
   process table rather than merely asserted.
6. **New config key `heartbeatIntervalSeconds`, default 30.** Read defensively, so a config without
   the key still works.

Nothing else changed. **The ten-minute schedule is untouched** — `intervalMinutes` is not read or
written by this change, and the new key governs only the in-run refresh. The reconciliation and
fail-closed gates are untouched. No permission or deny rule was altered. No product code was touched.

## 5. Tests written — and NOT run

Nine `Test-Case` blocks added to `tests/supervisor.tests.ps1`, bringing the file to **36** (a static
count of `Test-Case` blocks, *not* a test result):

- progress polling: a multi-second run ticks `OnProgress`; a fast run ticks zero times; output
  written just before exit is still captured;
- heartbeat content: an active beat carries `runnerPid` and the task id; an idle beat carries neither;
- live-run observability: mid-run the heartbeat is never `NOOP`; a clean run ends `COMPLETED`; a
  non-zero exit ends `FAILED`; an idle cycle still ends `NOOP`.

The regression test targets the exact failure: it seeds `heartbeat.json` with a stale idle beat, then
has a throwaway `cmd.exe` runner **copy the heartbeat file while it is running**. That copy is what an
external observer would have seen. The assertion is that it is never `NOOP` again.

### The denial, quoted

```text
$ powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\supervisor.tests.ps1
This command requires approval
```

Refused three times, including with the exact command documented in supervisor README section 8.
**Cause established rather than assumed:** `.claude/settings.local.json` contains one `powershell`
entry, and it is a single exact command for stopping stray `node.exe` processes — not a pattern.
`runner-settings.json` adds only the four capabilities MSG-0028 authorized. Neither permits executing
a PowerShell script, and an unattended runner has no one to approve a prompt. This is the ceiling
MSG-0028 §2 identified: **the allowlist, not the deny list, bounds unattended work.**

## 6. Risk this creates, stated plainly

**The supervisor is ENABLED and will execute this changed code on its next cycle, unverified.** If
the change contains a syntax or runtime fault, the supervisor breaks and unattended execution stops
until a human intervenes. That is a real operational risk and I am not going to understate it.

What reduces it, and what does not:

- the file was re-read after editing and is ASCII-only, verified by grep for non-ASCII bytes — the
  specific hazard the README warns maintainers about;
- the changes are additive and confined to the state-writing path; the decision logic, gates, and
  parsing are untouched;
- **none of that is execution.** A static read is not a passing test, and I am not presenting it as
  one.

The change is a single commit and is revertible with `git revert`, which is the fastest remedy if the
next cycle logs nothing.

## 7. Decision required

The success gate needs one command run by someone who can approve it:

```powershell
cd D:\Work\pci-platform\implementation\operations\supervisor
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\supervisor.tests.ps1
```

Please choose one:

- **(A)** The operator runs it once and reports the result; I reconcile the records against the real
  outcome. Smallest grant, no lasting change to the runner's authority. **Recommended.**
- **(B)** Add a narrowly scoped allowlist entry for exactly this test script — path-pinned, no
  wildcard — so future supervisor work can verify itself. This widens unattended authority
  permanently and is a governance decision, not mine to take.
- **(C)** Revert the change until (A) or (B) is possible, accepting the stale heartbeat meanwhile.
  Safest for the running supervisor; leaves the defect in place.

I recommend **(A)**, and note the precedent constraint recorded in MSG-0031: an accepted narrow
authorization creates **no general licence** for adjacent commands.

## 8. A structural finding — the register lag, fourth occurrence

**MSG-0043 has no row in `implementation/comms/README.md`.** The file exists and is `DECIDED`, and
`CLAUDE-TASKS.md` carries its ledger entry, but the register does not list it. I added the row while
allocating MSG-0045, along with MSG-0045's own.

This is the fourth occurrence of the pattern first recorded in MSG-0036 §6 and re-recorded in
MSG-0038 §6 and MSG-0040 §6 — and it is worth noting that MSG-0042 reported the lag had *stopped*,
because the lead had added the MSG-0041 row himself. That conclusion was correct about MSG-0041 and
does not generalise: MSG-0044 was registered by its author, MSG-0043 was not. The register lags
whenever the message's author is not the one who registers it, which is a property of *who commits*,
not of the protocol.

**No ruling is requested** on this. It is recorded so a fifth occurrence is not read as a surprise,
and because the MSG-0035 directory-listing step caught it for the fourth time — the convention doing
its job.

## 9. What a new session needs to know

- The correction is committed. Its behaviour is **unproven by execution**.
- `implementation/operations/checkpoints/TASK-0017.md` holds both checkpoints, including the raw
  observation of the defect.
- Do not re-run anything on the strength of a checkpoint. Read `state/heartbeat.json` and
  `logs/supervisor-20260820.log` directly; both move independently of this record.
- TASK-0017 remains **IN_PROGRESS** in the queue, not COMPLETE. It is not complete, and rounding it
  up would put the queue back into exactly the state TASK-0013 through TASK-0016 spent four tasks
  correcting.
