# MSG-0069 — TASK-0024 Reconciled Into the Queue; the Seventh Recurrence, Observed Live

**Status:** **CLOSED** 2026-08-21 — the reconciliation is discharged: TASK-0024 was executed by a supervisor-started session and is **COMPLETE** (MSG-0070), its ADR set accepted by MSG-0071. **The collision observation it records is NOT closed by this** — it is the same question MSG-0060 carries, which remains OPEN rather than being duplicated here.
**Raised:** 2026-08-21
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0068a and MSG-0068b (both authorize TASK-0024) | **Related:** MSG-0066, MSG-0067, MSG-0060, MSG-0064, MSG-0044, WP-0009

## What was done

TASK-0024 (A-ADR) is reconciled into `implementation/operations/CLAUDE-TASKS.md` as the **single READY
task**, with a board row, a task section carrying the union of its four governing documents, and
ledger rows for MSG-0067, MSG-0068a and MSG-0068b. Existing queue content is preserved; superseded
narrative is quoted in place rather than deleted.

**Nothing was authorized here.** Every field traces to a specification file, MSG-0067, or one of the
two MSG-0068 files. The authorization is the lead's; this only makes the queue reflect it.

## Prerequisites — verified individually

| Prerequisite | State | Evidence |
|---|---|---|
| TASK-0023 COMPLETE | **MET** | Board row; MSG-0066 execution record; `WP-0009` delivered |
| MSG-0062 DECIDED | **MET** | EPA-0004 accepted |
| MSG-0067 DECIDED | **MET** | `**Status:** DECIDED` — all three carried-forward items ruled |
| WP-0009 defined, not implementation-authorized | **MET** | `docs/program/work-packages/WP-0009-employee-policy-assistant.md` |
| No OPEN blocker | **MET** | BLK-0001…BLK-0007 all RESOLVED |
| No runner active | **MET** | `state/runner.lock` absent |

## The seventh recurrence — and the first one visible in the log

MSG-0068 authorized TASK-0024. The queue did not contain it:

```text
$ grep -c "TASK-0024" implementation/operations/CLAUDE-TASKS.md
0
```

**What makes this one different is that the cost was observable rather than hypothetical.** The
operator re-enabled the scheduled task, so the Supervisor was running its ten-minute cadence
throughout — and it was idling:

```text
2026-08-21T19:07:18Z [NOOP] :: no READY task
2026-08-21T19:17:18Z [NOOP] :: no READY task
```

An authorized task existed. The Supervisor was awake, healthy, and looking. It reported nothing to do,
correctly, because the queue is the only thing it reads. Every previous occurrence had to be argued
from first principles; this one is in the log.

MSG-0044 named this failure, MSG-0060 predicted its recurrence, MSG-0061 §8 named the exact number it
would reach, and MSG-0064 recorded the sixth. **This is the seventh.** The pattern has not changed and
no rule of mine is involved in changing it — the cheapest guard remains authorizing a task and adding
its board row in the same commit.

## A doubled collision

**Four files govern this one task, in two colliding pairs:**

```text
TASK-0024-epa-adr-drafting.md                              (28ff09d)  spec A
TASK-0024-a-adr.md                                         (263ad3c)  spec B
MSG-0068-task-0024-authorization-epa-adr-drafting.md       (049b87c)  MSG-0068a
MSG-0068-task-0024-a-adr-authorization.md                  (6e3568a)  MSG-0068b
```

**All four agree**, and that was checked before anything else: same objective (the minimal enforceable
ADR set), same six candidate surfaces, same forbidden list, same insistence that ADR numbers be
allocated at drafting time from the repository's actual state, same prohibition on marking any
implementation task READY, and the same queue gate. **No stop condition fired.**

**They are not interchangeable**, which is why the union matters:

| Only in | Content |
|---|---|
| Spec A / MSG-0068a | The **stop condition** — "stop at that boundary rather than improvising"; the requirement to **document why a surface needs no ADR**; the dependency list |
| Spec B / MSG-0068b | The **ten constraints to preserve** (ADR-0007/OIDC, T-D before T-E with MSG-0067's synthetic-only interim limit, no retrieve-then-suppress, English authority with fail-closed cross-language grounding, session retention with employee-only access, inference locality); the explicit **"no production corpus ingestion"**; the named prohibition on marking **T-A through T-E** READY |

A runner reading only spec B would not know to stop rather than improvise. A runner reading only spec A
would not know that T-D testing is restricted to synthetic documents. **Both gaps are safety-relevant**,
which is a step up from the TASK-0022 collision, where the split was between stop conditions and an
outcome list.

The queue section therefore carries all four, links all four, and says both specifications and both
messages must be read. **Nothing was renamed**, per the MSG-0058 F4 ruling.

## An observation, offered once and not pressed

MSG-0058 F4 judged the MSG-0056 collision "documentary and non-blocking", which was true of it. Since
then the pattern has produced a colliding **task specification** (MSG-0060) and now a **doubled**
collision in which each half carries safety-relevant content the other lacks.

The union treatment works and has been applied twice. It also depends on someone noticing the second
file — which the Supervisor cannot do, since it reads the board and the board names the specification.
**No rule was changed and none is mine to change.** Recorded so the next session sees the trend rather
than the instance.

## Consequence of pushing this

**The Supervisor will start TASK-0024 on its next cycle**, without a manual trigger. The scheduled task
`PCI-Execution-Supervisor` is enabled and cycling every ten minutes, and TASK-0024 is now the single
READY task with all prerequisites met. That is the behaviour MSG-0068 specifies — both files make
queue reconciliation the gate for execution — and it is stated here so the effect is not a surprise.

## State

- **TASK-0024 is READY and is the single READY task.**
- MSG-0067, MSG-0068a and MSG-0068b are registered in the COMMS register and the queue ledger.
- No implementation, ADR, provider selection, permission, or Supervisor change was made or authorized
  by this reconciliation.
- No OPEN blocker. `HEAD` equals `origin/main` at the time of writing.
