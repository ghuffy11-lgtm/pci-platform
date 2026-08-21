# MSG-0065 — Correction: the Schedule Service Is Running; the Scheduled Task Is Disabled

**Status:** **OPEN** — informational, but it changes the operator action needed to resume automation
**Raised:** 2026-08-21
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** State/record correction
**Related:** MSG-0064, MSG-0059, TASK-0023, CLAUDE.md *Status consistency*

## The claim that was wrong

Several records I wrote today, including MSG-0064 and `implementation/status/current.md`, said the
Windows **`Schedule` service was stopped by the operator**, and that resuming automation therefore
meant restarting that service.

**Verified this session, and it is not the case:**

```text
$ Get-Service Schedule
Name      Status   StartType
Schedule  Running  Automatic

$ Get-ScheduledTask -TaskName 'PCI-Execution-Supervisor'
State: Disabled
LastRun: 2026-08-21 13:47:47 (local, +03:00)  ->  10:47:47Z
LastResult: 0
NextRunTime: 2026-08-21 20:47:47 (local)      ->  will not fire while Disabled
Trigger repetition: PT10M
```

**The service is running. The scheduled task is Disabled.** The observable effect was the same — no
cycle fires on its own — which is why the error survived several records unchallenged. **The remedy
is not the same.** Restarting the `Schedule` service would have done nothing at all.

## How the error arose, stated plainly

The operator said Task Scheduler had been stopped, and I recorded that as the service being stopped
without verifying which of the two things it was. It was inference presented as observed state, and
`CLAUDE.md` requires the opposite: verify current host or environment state directly rather than
assuming a previous session's or a conversation's account still holds.

**The functional conclusion drawn from it was right** — automation was inert and cycles only ran when
triggered manually — so nothing was done incorrectly *because* of the error. It would have cost the
operator a wasted action the moment they tried to resume automation, which is exactly when a wrong
remedy is most expensive.

## Corroborating evidence from the supervisor's own log

The log agrees with the task info and separates scheduled cycles from manual ones cleanly:

```text
06:37:13Z … 10:47:13Z   every 10 minutes on a :X7:13 pattern   <- scheduled
10:47:13Z                                                       <- LAST scheduled cycle
11:05:47Z  11:39:08Z  12:35:00Z  13:01:51Z  13:06:23Z
14:04:05Z  14:10:39Z                                            <- irregular: manual triggers
```

`LastRunTime` of 10:47:47 local (10:47:47Z) matches the final scheduled cycle exactly. Every entry
after it is at an irregular time and corresponds to a manual invocation from this session. **No cycle
has fired since 14:10:39Z**, and at the time of writing it is 17:47Z — roughly three and a half hours
of silence, which is consistent with a Disabled task and inconsistent with a running schedule.

## What was NOT done

**The scheduled task was not enabled.** Enabling it changes Supervisor scheduling, which the TASK-0023
specification and MSG-0063 both forbid, and it is an operator decision besides. The discrepancy is
recorded; the state is left exactly as found.

No service was started or stopped, no task was created, modified, or deleted, and no supervisor
configuration was touched.

## What the operator actually needs to do

To resume unattended execution, **enable the scheduled task** — not restart the service:

```text
Enable-ScheduledTask -TaskName 'PCI-Execution-Supervisor'
```

Once enabled it resumes its ten-minute cadence, and TASK-0023 is READY, so the next cycle would start
it. **If that is not wanted yet, leave the task disabled** — the queue stays armed and nothing
consumes it.

The alternative remains a manual trigger of a single cycle, which is how every task since TASK-0021
has been started.

## Corrections applied

- `implementation/status/current.md` — the Next Action operational note now says enabling the task,
  with the previous wording quoted and marked wrong rather than deleted.
- **MSG-0064's closing bullet is wrong on this point** and is corrected in place with a pointer here.
  It is annotated rather than rewritten, because it is a published record and the mistake is part of
  what it recorded.

## State

- `Schedule` service: **Running (Automatic)**. Scheduled task `PCI-Execution-Supervisor`: **Disabled**.
- Last scheduled cycle 10:47:13Z; last cycle of any kind 14:10:39Z; none since.
- **TASK-0023 remains READY, the single READY task, and has not been started.**
- No open blockers. `HEAD` equals `origin/main`.
