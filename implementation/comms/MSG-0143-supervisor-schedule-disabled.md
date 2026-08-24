# MSG-0143 — The Supervisor Schedule Is Disabled; TASK-0043 Will Not Start Unattended

**Status:** **OPEN** — operational record and **one correction to MSG-0142 §6 and the status file**
**Raised:** 2026-08-24
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Operational state / correction
**Related:** MSG-0141, MSG-0142, TASK-0043, TASK-0010 (supervisor), MSG-0011

---

## 1. The correction, first

**MSG-0142 §6 and the status file both say the scheduler is enabled and that a cycle can take TASK-0043
without a manual trigger. That is wrong in the present tense, and I wrote it.**

**There are two independent switches and I checked only one:**

| Switch | State |
|---|---|
| `supervisor-config.json` — `enabled` / `dryRun` | **`true` / `false`** — live, as recorded |
| **Windows scheduled task `PCI-Execution-Supervisor`** | **`Disabled`** |

**Config-enabled plus schedule-disabled means nothing fires.** The supervisor is not stalled and is not
broken — **it is simply not being invoked.**

## 2. Evidence

```text
Get-ScheduledTask PCI-Execution-Supervisor
  State              : Disabled
  LastRunTime        : 2026-08-24 21:07:07 local  (18:07:07Z)
  LastTaskResult     : 0
  NextRunTime        : 2026-08-24 21:37:37 local  (18:37:37Z)
  NumberOfMissedRuns : 2

Get-Service Schedule -> Running
```

**The supervisor log agrees and stops at the same point:**

```text
2026-08-24T17:57:18Z [NOOP] no READY task
2026-08-24T18:07:13Z [INFO] CYCLE_START pid=22136 enabled=True dryRun=False
2026-08-24T18:07:18Z [NOOP] no READY task
                      (no further entry)
```

**Two ten-minute cycles — 18:17 and 18:27 — did not run**, matching `NumberOfMissedRuns : 2`. The
service itself is **Running**, so this is the task's own registration state, not a scheduler fault.
**`LastTaskResult : 0`** — the last cycle that did run exited cleanly.

## 3. What this does and does not mean

**TASK-0043 is READY in the committed queue and correctly reconciled** (`96c5ccd`). **Nothing about the
authorization, the queue or the task is wrong.** **It will simply not start until the schedule is
re-enabled or a cycle is triggered by hand.**

**This is very likely deliberate.** The schedule has been stopped by the operator before, and
re-enabling it is an **operator action on host configuration** — **not something this session may do**,
and not something it did.

**Nothing was installed, changed or started.** The checks above are read-only.

## 4. The general lesson, since it is the fourth of its kind

**I reported an "enabled" state from the file that says `enabled: true` without checking the mechanism
that actually invokes it.** That is the same shape as the three `PATH`-artefact readings already
recorded (MSG-0102, MSG-0103, MSG-0142 §3) and as Q12's counter: **a component reporting its own
readiness is not evidence that anything is calling it.**

**The cheap check is `Get-ScheduledTask`, and a heartbeat's timestamp**: a heartbeat that has not moved
in two cycle intervals is the symptom, and it was visible in this session's very first command.

## 5. What the Architecture Lead / operator may want to decide

**Offered, requested by nothing, and neither is urgent:**

1. **Re-enable `PCI-Execution-Supervisor`**, so TASK-0043 and later tasks run unattended; or
2. **Leave it disabled and trigger runs manually**, which is the current working arrangement.

**Either is fine and the queue is correct under both.** **What must not happen is the record claiming
unattended execution while the schedule is disabled** — which is what this message corrects.

## 6. State

- **TASK-0043 is READY and is the single READY task.** **Not started, and it will not start on its own.**
- **The supervisor config is live; the Windows schedule is Disabled; the scheduler service is Running.**
- **TASK-0042 is COMPLETE** — six candidates, **all NOT CLEARED**.
- **No blocker is open.** This is an operational state, not a blocker: **no work is blocked that an
  operator decision does not immediately unblock**, and nothing is degraded.
- **Nothing installed, selected, deployed or modified on the host by this session.**
