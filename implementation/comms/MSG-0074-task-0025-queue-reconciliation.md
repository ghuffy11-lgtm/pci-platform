# MSG-0074 — TASK-0025 Reconciled Into the Queue as the Single READY Task

**Status:** **CLOSED** 2026-08-21 — discharged by execution. TASK-0025 ran against this reconciliation
and is COMPLETE (**MSG-0075**). The reconciliation did its job: the eighth recurrence of the MSG-0044
queue gap, recorded below, was repaired *before* the Supervisor's next cycle, so the task was already
the single READY task on the board when the run started and the Supervisor never idled on a
healthy-looking `no READY task`. This record was informational throughout and never blocked anything.

> **The line this replaces, retained:** "**Status:** **OPEN** — informational; no decision blocks
> TASK-0025."
**Raised:** 2026-08-21
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0073 (TASK-0025 authorized) | **Related:** MSG-0072, MSG-0071, TASK-0024, MSG-0069

## What was done

TASK-0025 is reconciled into `implementation/operations/CLAUDE-TASKS.md` as the **single READY task**,
with a board row, a full task section, and ledger rows for MSG-0073 and this record. **MSG-0072 is
closed** — the decision it requested has been made.

**Nothing was authorized here, and no ADR was promoted.** The promotion is TASK-0025's work.

## Prerequisites — verified individually

| Prerequisite | State | Evidence |
|---|---|---|
| TASK-0024 COMPLETE | **MET** | Board row; MSG-0070; ADR-0017…0022 drafted |
| MSG-0071 DECIDED | **MET** | All six ADRs accepted |
| MSG-0073 AUTHORIZED | **MET** | `**Status:** AUTHORIZED` |
| No OPEN blocker | **MET** | BLK-0001…BLK-0007 all RESOLVED |
| No runner active | **MET** | `state/runner.lock` absent |
| No colliding sibling files | **MET** | One `MSG-0073-*`; **no** `TASK-0025-*` file at all |

## Two things a future session needs to know

### 1. There is no TASK-0025 specification file, and that is not an omission

Every task since TASK-0017 has had a standalone `TASK-00NN-*.md`. This one does not. **MSG-0073 carries
the objective, constraints and acceptance criteria**, and the queue section carries them plus the
mechanics.

Recorded explicitly so that a runner does not hunt for a missing file, and — more importantly — does
not conclude that something was lost and improvise a specification to fill the gap. **The queue section
is the specification.**

### 2. The promotion convention was verified, not assumed

The queue section states the convention precisely, taken from two existing examples rather than from
memory:

- **ADR-0015** — the earlier promotion, which set the draft-side wording: *"RATIFIED … accepted as
  `docs/decisions/…`. The proposed text below is retained unchanged as the historical record."*
- **ADR-0017** — the lead's own promotion, three commits ago, which set the accepted-side wording:
  `**Status:** **ACCEPTED** — promoted from `implementation/decisions/…` (PROPOSED) by MSG-0071`, plus
  an added `**Accepted by:** Architecture Lead — MSG-0071` line, with the body otherwise unchanged.

A `diff` of the ADR-0017 pair shows exactly that shape: the status line, the added acceptance line, and
line-rewrapping only. **The queue section tells TASK-0025 that any body difference is a defect, not a
formatting preference** — these records are cited as authority, and promotion is precisely where a
silent edit would be hardest to notice.

## The pattern did not repeat this time

MSG-0069 recorded the seventh occurrence of an authorization existing while the queue did not reflect
it, and MSG-0060's question about colliding sibling files is still open.

**Neither problem recurred here in the sibling-file sense**: MSG-0073 arrived alone, with no second
authorization message and no competing specification. That is the first clean authorization in four.

**The queue gap itself did recur** — `grep -c "TASK-0025"` on the queue returned 0 before this
reconciliation, making it the eighth occurrence. It is a smaller thing when the Supervisor is idle
between tasks and the operator is actively driving, but it is the same gap, and it is recorded rather
than skipped because the count is the only thing that makes the pattern visible.

## Consequence of pushing this

**The Supervisor will start TASK-0025 on its next cycle.** It is enabled and cycling every ten minutes,
and MSG-0073 says plainly: *"Claude may execute TASK-0025 when it is reconciled as READY."* No manual
trigger is needed, and none was used.

## State

- **TASK-0025 is READY and is the single READY task.** Not started at the time of writing.
- **MSG-0072 is CLOSED**, answered by MSG-0073. Its pre-promotion verification — no provider, model or
  runtime selection; ADR-0019 invents no normalization rules; numbering collision-free — stands as
  evidence for TASK-0025 rather than being discarded with the message.
- MSG-0073 is registered in the COMMS register and the queue ledger.
- **ADR-0018…ADR-0022 remain unpromoted** until TASK-0025 runs. ADR-0017 is already promoted and must
  not be touched.
- No OPEN blocker. A-SURVEY, A-STACK and T-0 remain unauthorized.
