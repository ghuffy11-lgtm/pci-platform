# MSG-0029 — Supervisor Start Path: Diagnosis, Fixes, and First Successful Launch

**Status:** OPEN — informational; one reporting defect confirmed fixed, one behaviour worth a ruling
**Raised:** 2026-08-20
**Raised by:** Claude Code (interactive session)
**Type:** Record — diagnosis
**Related:** TASK-0010, MSG-0026, MSG-0028, TASK-0003

## The reported symptom

> The Supervisor is visibly opening a PowerShell window and then exiting without visible output.

## Root cause: it never reached the start path

The supervisor's own log had already recorded why:

```text
2026-08-19T20:37:18Z [NOOP] :: not reconciled: local and remote differ
2026-08-19T20:47:18Z [NOOP] :: not reconciled: local and remote differ
```

The workstation clone was **behind `origin/main`** after the architecture lead pushed MSG-0027. The
supervisor's fail-closed reconciliation gate stops the cycle *before* the queue is even read, so it
never selected TASK-0003 and never launched `claude.exe`.

The window appearing and vanishing was the scheduled task running a no-op and closing. **Nothing was
wrong with the runner, the permission mode, the settings path, or the quoting.** The gate worked
exactly as designed.

What was genuinely missing was any way to see that from outside the machine: the decision was in the
log, but a person watching a window flash could not tell a healthy no-op from a crash.

## Three defects found while instrumenting it

Fixing the visibility gap meant opening the start path, and it was not in a state that would have
survived first contact.

### 1. Runner output went nowhere

`Start-Process` wrote the runner's stdout and stderr to a console that closed with the scheduled
task. A real runner failure would have left **no trace anywhere**.

Fixed: both streams are captured to `logs/runner-<TASK>-<stamp>.out.log` / `.err.log`, and the
**exact command line is logged before launch**, so even a failure to launch is diagnosable.

### 2. The lock pointed at the wrong process

The lock must be created *before* the launch to be race-safe, but it was created with the
**supervisor's** PID — and the supervisor is a short-lived `-Once` process. Every completed run
would have left a lock whose PID was already dead, which `Test-RunnerActive` correctly reads as
**stale**, and policy says never to clear stale locks automatically.

**The supervisor would have stalled permanently after its very first task.**

Fixed: the lock is repointed at the runner PID immediately after launch, and released deliberately
when the runner exits.

### 3. Exit codes were invisible — and my first fix got this wrong

`Start-Process -PassThru` does not surface `ExitCode` in this environment. Verified against a
control:

```text
cmd /c exit 3   ->  ExitCode = []      (empty, even after WaitForExit and Refresh)
```

My first version of the fix branched on `$code -eq 0` and would therefore have reported **every
successful run as a failure**. Replaced with `System.Diagnostics.Process`, which reports correctly:

```text
cmd /c exit 0  -> 0
cmd /c exit 3  -> 3
claude.exe -p  -> 0 (Int32), stdout captured
```

Both streams are read asynchronously before `WaitForExit`, because reading one to completion first
can deadlock when the other fills its buffer.

## Controlled diagnostic — TASK-0003 was not executed by me

The exact invocation was run with a **harmless prompt** rather than the task prompt:

```text
executable   C:/Users/Administrator/.local/bin/claude.exe   exists: True
commandLine  -p "DIAGNOSTIC: ..." --permission-mode acceptEdits --settings D:\...\runner-settings.json
working dir  D:\Work\pci-platform   (CLAUDE-TASKS.md resolves)
stdout       RUNNER_PATH_OK
stderr       empty
```

Executable resolution, working directory, settings path, and argument quoting all confirmed good —
the prompt survives as **one** quoted argument.

## First real launch — the supervisor did it, and it worked

After pushing the fix and restoring reconciliation, the scheduled task fired on its own cadence:

```text
20:57:18Z [ACTION] RUNNER_COMMAND :: claude.exe -p "You were started automatically ... TASK-0003 ..."
                                     --permission-mode acceptEdits --settings .../runner-settings.json
20:57:18Z [ACTION] RUNNER_STARTED :: pid=27012 task=TASK-0003
lock                                {"taskId":"TASK-0003","pid":27012,...}
```

The runner ran for roughly 15 minutes, produced 4,699 bytes of captured stdout, empty stderr, and
committed real work (`93d7067`, `6fa7d90`) plus MSG-0028. The lock was released on exit.

**The supervisor launched Claude successfully. That is the first end-to-end proof of the start
path**, which MSG-0026 §8 had explicitly listed as unproven.

## One false negative in that run, already fixed

The supervisor recorded:

```text
21:12:40Z [ERROR] :: runner failed: TASK-0003 exited ; stdout 4699 bytes
```

Note the empty exit code. That run used the **intermediate** version of the start path — defect 3
above — because of a two-minute race:

| Time (UTC) | Event |
|---|---|
| 20:57:18 | scheduled task fires, launches the runner with the intermediate code |
| 20:59:23 | the `System.Diagnostics.Process` fix is committed (`aaf0d34`) |
| 21:12:40 | the already-running cycle reports the outcome using the code it started with |

So the `ERROR` is an artifact of code that no longer exists, not a live fault. The current code was
verified directly afterwards (`ExitCode = 0`, `Int32`) and by the test suite: **25 passed, 0
failed**, four of them new for the launch path.

**The runner's work itself succeeded.** Anyone reading that heartbeat without this record would
reasonably conclude TASK-0003 had failed, which it had not — hence this message.

## Security posture: unchanged

`acceptEdits` and the deny list are exactly as authorized. **No `--dangerously-skip-permissions`.**
No credential was written to project configuration. The fail-closed gates and the ten-minute cadence
are untouched.

## Two things for the architecture lead

1. **The runner cannot push** (MSG-0028 raises this). Its two commits sat local-only until this
   session pushed them. An unattended session can currently complete authorized work and be unable
   to deliver any record of it — worth deciding on the exact allowlist pattern, and I agree with the
   runner that `Bash(git push origin main)` is safer than `git push:*`.

2. **A supervisor run can be overtaken by its own repository.** This run began at one HEAD and
   finished after that HEAD had moved. Nothing broke, but MSG-0028 asks whether a session should
   abort when HEAD moves mid-run. It is a real question and I have not assumed an answer.

TASK-0003 was left exactly as the runner set it — `IMPLEMENTED — NOT COMPLETE` — and I did not
execute, alter, or complete it.
