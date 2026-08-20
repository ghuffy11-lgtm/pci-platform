# PCI Execution Supervisor

**Status:** implemented, **NOT installed, NOT enabled**. Defaults to dry-run.
**Task:** TASK-0010 | **Record:** MSG-0011 | **Runs on:** the Windows development machine only.

A fail-closed scheduler that periodically reconciles with `origin/main`, reads the task queue, and
starts an authorized Claude runner when — and only when — there is a READY task and nothing is
already running.

---

## 1. Architecture and design

### What it is

A **trigger**, not an authority.

```text
Windows Task Scheduler  ──every 10 min──►  supervisor.ps1 -Once
                                                 │
                    ┌────────────────────────────┼────────────────────────────┐
                    ▼                            ▼                            ▼
            git fetch + compare        parse CLAUDE-TASKS.md          check runner.lock
            HEAD vs origin/main        board + priorities             (exclusive create)
                    │                            │                            │
                    └──────────── all three must be satisfied ────────────────┘
                                                 │
                                    ┌────────────┴────────────┐
                                    ▼                         ▼
                          READY task + no runner        anything else
                                    │                         │
                            start Claude runner          DO NOTHING
                            (only if enabled and         (log + heartbeat)
                             not dryRun)
```

### What it is not

The supervisor does **not** decide what work is allowed. It cannot mark a task COMPLETE, change a
status, alter a priority, or authorize anything. **The repository queue remains the sole authority**;
the supervisor's entire job is noticing that an authorized task exists and that nothing is running.

That separation is the point. If the supervisor could edit the queue, a scheduling bug would become
an authorization bug.

### Design principles

| Principle | How it shows up |
|---|---|
| **Fail closed** | Every uncertainty is a no-op: unreadable repo, unreachable remote, unparseable queue, contradictory queue, corrupt lock, lost lock race, any unhandled exception |
| **Inert by default** | `enabled: false` **and** `dryRun: true` **and** empty `runnerCommand` — three independent reasons nothing runs until deliberately changed |
| **Single flight** | Exclusive file creation for the lock; a race loser does nothing rather than retrying |
| **Never guess** | An unrecognised status is a consistency failure, not a value to interpret |
| **Observability over cleverness** | Every cycle writes a heartbeat and a log line, including the no-ops |
| **Periodic reconciliation is authoritative** | A webhook may only ever *reduce latency*; the 10-minute cycle is what makes recovery automatic |

### Why polling stays authoritative

A webhook can be missed: the machine sleeps, the network drops, GitHub has an incident, the endpoint
is misconfigured. A missed webhook is silent, and silence is indistinguishable from "nothing to do".
Periodic reconciliation converges regardless of what was missed. If a webhook is added later it must
sit *on top of* the 10-minute cycle, never replace it.

---

## 2. Installation

**Prerequisites:** Windows PowerShell 5.1, `git` on `PATH`, a clone at the configured path.

```powershell
cd D:\Work\pci-platform\implementation\operations\supervisor
copy supervisor-config.example.json supervisor-config.json
notepad supervisor-config.json      # set repositoryPath and runnerCommand
```

Verify before installing anything — this runs one cycle and reports what it *would* do:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\supervisor.ps1 -Once
```

Register the scheduled task (10-minute repetition):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\supervisor.ps1 -Install
```

Then, and only then, flip `enabled` to `true` and `dryRun` to `false` in `supervisor-config.json`.
**Installing does not enable.** A registered task in dry-run mode observes and logs; it starts
nothing.

### Removal

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\supervisor.ps1 -Uninstall
```

That unregisters `PCI-Execution-Supervisor`. Nothing else is left behind except `state/` and `logs/`,
which are gitignored and safe to delete. To disable without uninstalling, set `enabled: false` — the
task keeps running and keeps logging, but starts nothing.

---

## 3. Configuration

`supervisor-config.json`, created from `supervisor-config.example.json` and **gitignored**.

| Key | Default | Meaning |
|---|---|---|
| `enabled` | `false` | Master switch. False = observe only |
| `dryRun` | `true` | Second switch, independent of `enabled`, so a live supervisor can be returned to observation without unregistering |
| `repositoryPath` | *(derived)* | Absolute path to the clone |
| `queueRelativePath` | `implementation/operations/CLAUDE-TASKS.md` | The queue |
| `remote` / `branch` | `origin` / `main` | Reconciliation target |
| `intervalMinutes` | `10` | Authoritative cadence |
| `staleRunMinutes` | `120` | When an IN_PROGRESS task is considered stale |
| `lockTimeoutMinutes` | `240` | When a lock whose process is gone is reported stale |
| `heartbeatIntervalSeconds` | `30` | How often the heartbeat is refreshed **while a runner is alive**. Not the schedule — `intervalMinutes` is untouched and remains authoritative. This governs only how quickly an observer learns a long run is still progressing |
| `runnerCommand` | `""` | Absolute path to the authorized Claude runner. Empty = never starts anything |
| `runnerArguments` | `[]` | `{TASK_ID}` is substituted with the READY task id |

Both `enabled: true` and `dryRun: false` are required before the supervisor will start anything.

---

## 4. Security model

### What it can do

Read the repository, run `git fetch` and `git rev-parse`, write to `state/` and `logs/`, and start
one configured local process.

### What it cannot do

| Constraint | Enforcement |
|---|---|
| **Never executes PCI-server commands** | The supervisor has no SSH code path at all. It cannot reach the server |
| **Never stores credentials** | No token, passphrase, or secret is read or written. Git and SSH auth belong to the environment the runner inherits |
| **Never marks a task COMPLETE** | It has no write path to the queue |
| **Never changes authorization or priority** | Same — the queue is read-only to it |
| **Never bypasses `CLAUDE.md`, `AGENTS.md`, stop conditions, or operator boundaries** | It starts a Claude session; that session reads and obeys those rules itself. The supervisor decides *when*, never *what* |
| **Never runs two sessions** | Exclusive-create lock; a race loser does nothing |

### Trust boundary

The supervisor is inside the developer's Windows session and inherits its privileges. It does not
elevate, and it does not need to. The `supervisor-config.json` file is gitignored specifically so a
local absolute path or runner command never reaches the repository — and the schema has no field
that could hold a secret.

The runner it starts is a full Claude Code session with the developer's own credentials. **That is
the real privilege boundary, and it is why `enabled` defaults to false**: turning this on means
consenting to unattended sessions acting on authorized queue tasks.

---

## 5. Failure and recovery behaviour

| Failure | Behaviour |
|---|---|
| **Windows restart** | Task Scheduler restarts the task (`-StartWhenAvailable`). The next cycle reconciles from scratch; no state is assumed |
| **Claude crash** | The lock outlives the process. The next cycle sees a lock with a dead PID, reports **stale**, and **still does not start anything** — a human decides, because a crashed session may have left partial work |
| **Network interruption** | `git fetch` fails, cycle is a no-op, next cycle retries |
| **GitHub outage** | Identical to the above. Nothing is started while the remote cannot be reconciled |
| **Supervisor crash** | It is stateless between cycles; the scheduler starts the next one. A lock it created remains, which is deliberate: an orphaned lock is safer than a double start |
| **Queue contradiction** | `BLOCKED` decision; nothing starts until a human resolves it |

### Stale locks are not cleared automatically

A stale lock means a previous run ended without releasing it — which usually means it crashed
mid-operation. Clearing it automatically would start a second session against unknown state. The
supervisor reports it and stops. Clearing is a human act, after the checkpoint reconciliation in
`../CLAUDE-TASKS.md`.

### Before any resumption

The runner — not the supervisor — performs the checkpoint procedure in `../CLAUDE-TASKS.md`: read
the checkpoint, read GitHub state, inspect the actual system, compare, and **never repeat an
operation merely because the checkpoint says it was incomplete**.

---

## 6. Logging and heartbeat

**Logs:** `logs/supervisor-YYYYMMDD.log`, one line per cycle, UTC:

```text
2026-08-19T16:40:02Z [NOOP] NOOP :: no READY task
2026-08-19T16:50:03Z [NOOP] NOOP :: not reconciled: local and remote differ
2026-08-19T17:00:01Z [NOOP] BLOCKED :: queue inconsistent: TASK-0006 is READY but dependency TASK-0004 is BLOCKED
2026-08-20T17:10:04Z [ACTION] RUNNER_STARTED :: pid=23668 task=TASK-0004
2026-08-20T17:41:22Z [ACTION] COMPLETED :: runner completed: TASK-0004 exited 0; stdout 8412 bytes -> runner-TASK-0004-20260820-171004.out.log
```

**Heartbeat:** `state/heartbeat.json` — the answer to "is this thing alive and what is it doing
*right now*?":

```json
{
  "timestamp": "2026-08-20T17:23:41Z",
  "decision": "RUNNER_RUNNING",
  "reason": "TASK-0004 running for 810s",
  "readyTask": "TASK-0004",
  "head": "78c4a0f...",
  "runnerActive": true,
  "runnerPid": 23668,
  "supervisorPid": 12345,
  "host": "DEV-WORKSTATION"
}
```

### Decision vocabulary

| `decision` | Meaning | `runnerActive` |
|---|---|---|
| `NOOP` | Nothing to do, or a reason not to act — no READY task, not reconciled, a runner already active | `false` |
| `BLOCKED` | The queue contradicts itself, or a lock is stale. Needs a human | `false` |
| `DRY_RUN` | A READY task was found, but `enabled`/`dryRun` prevented starting it | `false` |
| `RUNNER_STARTED` | A runner has just been launched | `true` |
| `RUNNER_RUNNING` | The runner is still alive; refreshed every `heartbeatIntervalSeconds` | `true` |
| `COMPLETED` | The runner exited 0 | `false` |
| `FAILED` | The runner exited non-zero, or could not be launched | `false` |
| `ERROR` | The **supervisor itself** failed. Distinct from `FAILED`: different reader, different remedy | `false` |

### Reading it correctly

The heartbeat is written **during** a run, not only at the end of a cycle. That matters because a
Claude run lasts minutes to hours, and the supervisor blocks for its whole duration.

- A `timestamp` that is minutes old with `decision: RUNNER_RUNNING` is **healthy** — a long task is
  progressing. Compare `runnerPid` against the process table to confirm.
- A `timestamp` that has stopped advancing means the supervisor itself has stopped. Check Task
  Scheduler.
- `decision: NOOP` genuinely means idle. It no longer needs to be cross-checked against
  `runner.lock` to find out whether a run is secretly in flight.

> **This was not always true.** Until TASK-0017 the heartbeat was written only when a cycle *ended*,
> so throughout a live run it kept describing the previous idle cycle — typically `NOOP :: no READY
> task` with `runnerActive: false`. Unattended execution was indistinguishable from a dead scheduler
> for exactly as long as it was working. See MSG-0045.

---

## 7. Concurrency and locking

`state/runner.lock`, created with `FileMode.CreateNew` — an atomic exclusive create. Two supervisors
racing cannot both win; the loser logs and does nothing.

```json
{ "taskId": "TASK-0004", "pid": 12345, "acquired": "2026-08-19T17:10:04Z", "host": "DEV-WORKSTATION" }
```

Lock states:

| State | Meaning | Supervisor |
|---|---|---|
| absent | no runner | may start |
| present, PID alive | runner working | does nothing |
| present, PID dead | **stale** | does nothing, reports |
| present, unparseable | **treated as held** | does nothing |

A corrupt lock reads as *held*, never as free. The failure mode of guessing "probably free" is two
concurrent sessions against shared state, which is far worse than a stall.

---

## 8. Tests

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\supervisor.tests.ps1
```

Self-contained; no Pester required. Exit 0 = pass. **36 `Test-Case` blocks** as of 2026-08-20:

| Area | Tests |
|---|---|
| READY detection | finds it; picks highest priority; `WAITING_FOR_*` is never mistaken for `READY` |
| No-READY behaviour | returns nothing; an empty-of-READY queue is still *consistent* |
| Duplicate-run prevention | live lock reads active; second lock refused; no lock = free |
| Stale-run handling | dead PID is stale **and still blocks**; corrupt lock treated as held |
| GitHub unavailable | non-repository is unreadable not an error; unreconciled repo yields `NOOP` |
| Inconsistent queue | READY with incomplete dependency; two IN_PROGRESS; unknown status; empty parse |
| Defaults | disabled, dry-run, no runner command, 10-minute interval |
| Runner command line | spaces quoted as one argument; bare args left alone; embedded quotes escaped |
| Runner launch | real exit code 0 and 3; `OnStarted` carries the pid; the lock is repointed |
| **Progress polling** | a multi-second run ticks `OnProgress`; a fast run ticks zero times; output written just before exit is still captured |
| **Heartbeat content** | an active beat carries `runnerPid` and the task id; an idle beat carries neither |
| **Live-run observability** | mid-run the heartbeat is never `NOOP`; a clean run ends `COMPLETED`; a non-zero exit ends `FAILED`; an idle cycle still ends `NOOP` |

The tests never contact the PCI server. The live-run tests do start a process, but it is `cmd.exe`
running a throwaway `.cmd` script in a temp directory, and the git fixtures are local bare
repositories — no network, no remote, no credentials. Fixtures are removed afterwards.

The live-run regression test is worth describing, because it tests the thing that actually broke: it
seeds `heartbeat.json` with a stale idle beat, then has the fake runner **copy the heartbeat file
while it is running**. That copy is what an external observer would have seen. Before TASK-0017 it
read `NOOP :: no READY task`; the assertion is that it never does again.

> **Verification status, stated plainly.** The counts above are a static count of `Test-Case` blocks,
> not a test result. The suite could **not be executed** in the unattended session that wrote these
> tests: no allowlist entry permits running a PowerShell script, so the documented command was
> refused. The tests are written and committed; they are **not yet proven to pass**. See MSG-0045 and
> `../checkpoints/TASK-0017.md` checkpoint 2.

Note for maintainers: these scripts are **ASCII-only on purpose**. Windows PowerShell 5.1 reads a
BOM-less file as ANSI, where a UTF-8 em dash decodes to `U+201D` — which PowerShell accepts as a
string delimiter. That produced a parser error the first time this file was written, and ASCII avoids
the whole class of problem.
