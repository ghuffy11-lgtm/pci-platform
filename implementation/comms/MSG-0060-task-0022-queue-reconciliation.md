# MSG-0060 — TASK-0022 Reconciled Into the Queue; A Fifth Collision, This Time on a Task Spec

**Status:** **OPEN** — informational; one observation for the lead, no decision blocking TASK-0022
**Raised:** 2026-08-21
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0059 (TASK-0022 authorized) | **Related:** MSG-0058, MSG-0057, MSG-0044, TASK-0022

## What MSG-0059 required, and what was done

MSG-0059 authorized TASK-0022 and set an explicit precondition:

> The authoritative execution queue must contain TASK-0022 as the **single READY task** before the
> Execution Supervisor may execute it. If queue reconciliation has not yet been applied, the
> Supervisor must remain idle.

**It had not been applied.** TASK-0022 appeared nowhere in `CLAUDE-TASKS.md`:

```text
$ grep -c "TASK-0022" implementation/operations/CLAUDE-TASKS.md
0
```

This is the **fifth** occurrence of the structural failure MSG-0044 named: an authorization exists,
the task file exists and says `READY`, and the supervisor — which reads the queue and nothing else —
would have idled indefinitely reporting a healthy `no READY task`. MSG-0059 anticipated it and stated
the precondition, which is exactly the right guard; it still had to be executed by someone.

**Now applied.** TASK-0022 is on the board as **READY**, and it is the only one:

```text
$ grep -cE '^\| TASK-[0-9]+ \|[^|]*\| \*\*READY\*\* \|' implementation/operations/CLAUDE-TASKS.md
1
```

Verified end to end with a **dry run**, against a copy of the config with `dryRun` forced true so that
nothing could start:

```text
DRY_RUN: would start TASK-0022 (dryRun)
heartbeat: decision=DRY_RUN  readyTask=TASK-0022
lock: none
```

The supervisor parses the edited queue, passes its consistency check, and selects the intended task.
**Nothing was authorized by this message** — every field in the queue entry comes from MSG-0058,
MSG-0059, or the two specification files.

## The fifth collision — and this one is different

**Two files specify TASK-0022**, both committed by the Architecture Lead on 2026-08-21:

```text
TASK-0022-employee-policy-assistant-work-package-definition.md   (768300b)  - "spec A"
TASK-0022-policy-assistant-work-package-definition.md            (4fca7fe)  - "spec B"
```

**They agree**, and that matters: same authorization (MSG-0059), same scope (definition only), same
forbidden list, same success gate, same binding rulings. So this is the MSG-0046 case, not the
MSG-0020 case, and **no stop condition fired**.

**But they are not identical, and the difference is not cosmetic:**

| Present in | Content |
|---|---|
| Spec A only | **Stop conditions**; the instruction not to invent decisions already settled; **queue changes as recommendations only** |
| Spec B only | A finer **ten-item** required-outcomes list — retrieval contracts, threat-model coverage, frontend contract, audit boundaries |

**A previous collision was on a message; this one is on an executable specification.** That is a
different risk. A runner told to read one file would silently lose either the stop conditions or half
the required outcomes, and would report success against whichever half it read. Nothing would look
wrong.

**Reconciled by union.** The queue's TASK-0022 section carries the requirements of **both** files,
links both, and says plainly that both are authoritative and both must be read. **Neither file was
renamed** — MSG-0058 F4 ruled that historical records are not renamed, and that ruling is followed
here rather than reinterpreted for a task file.

## One observation, offered not urged

MSG-0058 F4 called the collision "documentary and non-blocking", which was accurate for MSG-0056:
two messages, complementary, read by humans. A task specification is read by an **unattended runner**
that cannot notice a sibling file exists. The union above removes the risk for TASK-0022 specifically.

If it recurs on a future task, the same union treatment works — but the cheaper guard remains the one
MSG-0044 suggested: **a task is executable only when it appears on the queue board**, and the board
entry names its specification. The board is then the single thing the runner must read, and a second
file cannot go unnoticed because the board decides what counts.

**No rule was changed, and none is mine to change.** Recorded so the next session sees it.

## State

- **TASK-0022 is READY and is the single READY task.** Prerequisites verified: TASK-0021 COMPLETE,
  MSG-0058 DECIDED, MSG-0059 recorded.
- MSG-0058 and MSG-0059 are registered in the COMMS register and the queue ledger.
- The three MSG-0057 findings are **closed** by MSG-0058 — F1 in scope and fail-closed with abstention,
  F2 deferred, F3 bounded to the OIDC/OAuth2 boundary of ADR-0007, F4 preserve and do not rename.
- No implementation, ADR, provider selection, permission, or Supervisor change was made or authorized.
