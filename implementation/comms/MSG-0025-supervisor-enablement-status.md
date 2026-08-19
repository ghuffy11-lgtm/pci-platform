# MSG-0025 — Execution Supervisor: Installed and Verified, NOT Enabled

**Status:** **CLOSED** — answered by MSG-0026. Supervisor enabled 2026-08-19 with `acceptEdits` and a version-controlled deny list.
**Raised:** 2026-08-19
**Raised by:** Claude Code (implementation agent)
**Type:** Question — decision required
**Authority:** MSG-0024 (enablement authorized) | **Related:** TASK-0010, MSG-0011

## Done

| MSG-0024 step | State |
|---|---|
| 1. Reconcile queue and implementation before installation | **Done** — WP-0001 completion reconciled in `cbdf2c4`; queue, status, and report agree |
| 2. Install/register the scheduled task | **Done** — `PCI-Execution-Supervisor`, 10-minute repetition |
| 3. Configure the minimum required runner command | **PARTIAL — stopped, see below** |
| 4. Set `enabled: true` / `dryRun: false` after validation | **NOT DONE — blocked by step 3** |
| 5. Verify trigger, heartbeat, lock, queue reconciliation, fail-closed | **Mostly done, see below** |
| 6. Document every change and verification | This message |
| 7. Stop rather than guess if the invocation differs from assumptions | **Invoked — this message is that stop** |

### Registration

```text
task        PCI-Execution-Supervisor        state: Ready
action      powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass
            -File "...\supervisor.ps1" -Once -ConfigPath "...\supervisor-config.json"
repetition  PT10M            multipleInstances: IgnoreNew    startWhenAvailable: True
```

### Verification performed

Manual cycle, then a forced scheduled run:

```text
manual      NOOP: no READY task
scheduled   lastTaskResult 0, next run +1 min
heartbeat   {"decision":"NOOP","reason":"no READY task",
             "head":"cbdf2c4346aef340be82b42ec6fab7c9dd4fffd2","runnerActive":false,
             "supervisorPid":12392,"host":"LENOVO-LA0X1754"}
log         2026-08-19T19:55:48Z [NOOP] NOOP :: no READY task
lock        none created
```

The heartbeat's `head` matches `origin/main`, so the git reconciliation path ran for real against the
live repository, not a fixture. The scheduled run wrote its own heartbeat under a different PID,
confirming the task actually executes the script rather than merely reporting success.

**Configuration is inert:** `enabled: false`, `dryRun: true`, `runnerArguments: []`. Three
independent reasons nothing can start. `supervisor-config.json` is gitignored and contains no
credential — only paths.

### One verification I could not complete honestly

I tried to exercise the lock path live by planting a stale lock and then a corrupt one. Both cycles
reported `no READY task` — because the cycle checks for a READY task **before** it checks the lock,
and short-circuits when there is none. **So the live run did not exercise the lock path at all.**

Lock behaviour remains covered by the unit tests (stale lock blocks, corrupt lock treated as held,
second lock refused, no lock means free — 4 of the 17), not by this live run. It can only be
exercised live once a task is actually READY. Saying it was "verified live" would have been false.

## Where I stopped, and why

MSG-0024 step 3 says to configure "the minimum required runner command using the machine's existing
Claude Code invocation". The executable is unambiguous:

```text
C:\Users\Administrator\.local\bin\claude.exe    (Claude Code 2.1.235)
```

**The arguments are not.** There is no documented headless invocation for this repository. Running a
queue task unattended requires `-p/--print` plus a permission posture, and the CLI offers:

- `--permission-mode <mode>` — a specific mode, or
- `--dangerously-skip-permissions` — *"Bypass all permission checks."*

Neither appears in any accepted document, and the choice is not a detail. It decides what an
unattended agent may do without a human present.

### Why this is the stop condition MSG-0024 anticipated

A supervisor-started session on this machine would inherit:

- the SSH agent holding the **PCI server key**, so it can reach and change the production-target host;
- `git push` credentials for `origin/main`;
- Docker group membership on the PCI server, which is root-equivalent there.

With `--dangerously-skip-permissions`, such a session would act on all of that with no prompt, every
ten minutes, whenever a task is marked READY. That may well be the intent — it is close to what
"autonomous execution" means — but it is a security posture decision, not a configuration value I
should pick and record as if it were obvious.

The supervisor's own guards do not narrow this. They constrain **when** a session starts, never what
it does once running. The queue's authorization model is what bounds behaviour, and it bounds a
compliant agent; it is not an enforcement boundary.

## Decision required

1. **The exact runner invocation**, including the permission posture. For example
   `-p "<prompt>" --permission-mode <mode>`, or `--dangerously-skip-permissions`, or a
   `--settings` file that encodes the intended permissions.
2. **The prompt or entry point** the runner should receive. The supervisor substitutes `{TASK_ID}`
   into `runnerArguments`, so something like `-p "COMMS: execute {TASK_ID} from the queue"` would
   work, but the wording determines what the unattended session actually does and should be yours.
3. Confirmation to then set `enabled: true` and `dryRun: false`.

Once those are recorded I will configure `runnerArguments`, validate with a dry run, enable, and
verify the lock path live against the first genuinely READY task.

## Current state

The scheduled task is **registered and running every ten minutes in dry-run**, doing exactly
nothing except writing a heartbeat. That is a useful state to sit in: it proves the trigger,
scheduling, git reconciliation, queue parsing, and fail-closed no-op all work under the real
scheduler, without any unattended execution.

To remove it entirely: `supervisor.ps1 -Uninstall`.
