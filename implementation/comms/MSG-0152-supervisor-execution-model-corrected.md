# MSG-0152 — How the Supervisor Is Actually Driven, and a Correction to the Status File

**Status:** **OPEN** — operational record and **a correction of a claim now in `implementation/status/current.md`**
**Raised:** 2026-08-25
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Operational state / correction
**Related:** MSG-0143 (the Disabled-schedule record), TASK-0043's execution session, TASK-0010 (the supervisor)

---

## 1. The claim being corrected

**`implementation/status/current.md` currently tells a future session:**

> *"the supervisor IS running unattended, and it DID start TASK-0043 — the schedule being Disabled did
> not prevent it … **The scheduler STARTS the supervisor loop; it does not drive each cycle** — so a
> `Disabled` task with `NumberOfMissedRuns: 2` missed *starts* of a process that was already running."*

**The observation behind it was real; the inference from it is wrong.** The supervisor is **not** a
long-running loop that survives a disabled schedule. **Every cycle is its own process, started by Task
Scheduler.**

## 2. Evidence — the supervisor's own log

**Across the window when the scheduled task was `Disabled`, no cycle ran at all:**

```text
2026-08-24T18:07:13Z [INFO] CYCLE_START :: pid=22136 …
2026-08-24T18:07:18Z [NOOP]  no READY task
        (52 minutes; NOTHING)
2026-08-24T18:59:33Z [INFO] CYCLE_START :: pid=24604 …
2026-08-24T18:59:38Z [ACTION] RUNNER_STARTED :: pid=25932 task=TASK-0043
```

**Every cycle carries a different pid** — 14696, 28536, 25972, 22136, 24604, 21484, 22884, 14480,
18928, 27416, 18140, 24032 — which is what one process per cycle looks like, not one loop.

**TASK-0043 was started by a cycle that itself began at 18:59:33Z**, *after* the gap — **not by a
process that had been running through it.** MSG-0143's diagnosis stands: **a Disabled schedule stops
cycles.**

## 3. The model that fits every observation

| Situation | What the supervisor process does |
|---|---|
| Cycle finds **no READY task** | starts, reconciles, writes `NOOP`, **exits in ~5 seconds** |
| Cycle **starts a runner** | **stays alive monitoring it**, advancing the heartbeat **every ~30s**, and logs `COMPLETED` when the runner exits — **off-cadence**, e.g. `19:20:08Z` |

**That second row is what the corrected claim actually saw.** A heartbeat advancing `19:03:08Z →
19:03:38Z` with no `CYCLE_START` between them is **the 18:59:33Z cycle still monitoring its runner** —
**real, and not evidence of a schedule-independent loop.**

**The practical consequence, which is why this is worth a record:** **while a runner is active the
supervisor looks alive regardless of the schedule — but no NEW cycle can start while the task is
Disabled.** Both statements are true at once, and confusing them produces exactly the claim being
corrected here.

## 4. A second gap, today, and it is NOT diagnosed

**VERIFIED at 04:41Z:** the last cycle was **04:17:13Z**; cycles at **04:27 and 04:37 did not run**;
`NumberOfMissedRuns: 2`; `NextRunTime` **04:47:47Z**.

**VERIFIED settings:** `State: Ready`, `Interval: PT10M`, `StartWhenAvailable: True`, `WakeToRun:
False`, `DisallowStartIfOnBatteries: True` with **no battery device present**, `Schedule` service
**Running**, `LastTaskResult: 0`.

**UNKNOWN: why those two cycles did not run.** The schedule is enabled, the last result was clean, and
nothing in the log records a failure — **a missed start leaves no entry, because the process that would
have written one never ran.** **I am not calling this sleep, load, or anything else without evidence**;
a bare symptom is not a diagnosis.

**It delayed nothing.** **No task is READY**, so every one of those cycles would have recorded `NOOP`.

**Update, 05:01Z — the cadence resumed on its own, and the cause is still UNKNOWN:**

```text
04:17:13Z CYCLE_START pid=24032   04:17:18Z NOOP
        (30 minutes; two cycles missed)
04:47:13Z CYCLE_START pid=24696   04:47:18Z NOOP
04:57:13Z CYCLE_START pid=28076   04:57:18Z NOOP
```

**No intervention was made and none was needed.** **Resumption is not a diagnosis** — it narrows the
gap to something transient rather than a configuration fault, and **that is all it establishes.** The
schedule's own state never changed: `Ready` throughout.

## 5. The reason this matters even though nothing was delayed

**A missed cycle and a cycle that found nothing to do are indistinguishable in the heartbeat.** Both
leave the same file saying `NOOP`, `no READY task` — one because it ran and found nothing, the other
because it never ran. **Only the timestamp separates them**, and only if someone compares it to the
clock.

**That is the same shape as MSG-0143's error** (a config's self-reported `enabled: true` read as
evidence something was calling it), **and as Q12's** (a row-access counter's zero read as an
index-cursor zero). **The heartbeat's age is the instrument that distinguishes them**, and it should be
read as part of any claim that the supervisor will take the next task.

## 6. State

- **No task is READY**; none is authorized. The next action is the Architecture Lead's.
- **The schedule is `Ready` and the model above is verified.** **Two cycles were missed today with the
  cause UNKNOWN**, and nothing waited on them.
- **DA-1 exists as EPA-0006 §4.16 and has never been measured against anything.**
- **Nothing CLEARED — seven probes.** **All six TASK-0042 candidates remain NOT CLEARED. GAP-B stands.**
- **No blocker open.** This is an operational observation, not a blocker: **nothing is degraded and no
  work is waiting.**
- **Open for the Lead:** **Q14**, **R1**, and **MSG-0060**'s numbering question — **eight** collisions.
