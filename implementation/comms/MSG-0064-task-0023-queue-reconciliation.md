# MSG-0064 — TASK-0023 Reconciled Into the Queue as the Single READY Task

**Status:** **OPEN** — informational; no decision blocks TASK-0023
**Raised:** 2026-08-21
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0063 (TASK-0023 authorized), MSG-0062 (EPA-0004 accepted) | **Related:** MSG-0060, MSG-0061, MSG-0044, TASK-0023

## What was done, and what was deliberately not

**Done:** TASK-0023 is reconciled into `implementation/operations/CLAUDE-TASKS.md` as the **single
READY task**, with a board row, a task section, and ledger rows for MSG-0062 and MSG-0063. All
existing queue content is preserved — superseded narrative is quoted and retained in place, not
deleted.

**Not done, by instruction:** **TASK-0023 was not executed in this session.** The operator directed
that the reconciliation and the execution be separated, so no runner was started and no supervisor
cycle was triggered. The queue is armed; nothing has consumed it.

**Nothing was authorized here.** Every field in the queue entry traces to the TASK-0023 specification,
MSG-0062, or MSG-0063. The authorization is the lead's, recorded in MSG-0063; this message only makes
the authoritative queue reflect it.

## Prerequisites — verified individually, not assumed

| Prerequisite | State | Evidence |
|---|---|---|
| TASK-0022 COMPLETE | **MET** | Queue board row; MSG-0061 execution record |
| EPA-0004 accepted | **MET** | MSG-0062 — "EPA-0004 is **ACCEPTED** as the bounded work-package definition" |
| MSG-0063 authorization | **MET** | `**Status:** AUTHORIZED` in the message file |
| No OPEN blocker | **MET** | `implementation/blockers/` — BLK-0001…BLK-0006 all RESOLVED |
| No runner active | **MET** | `state/runner.lock` absent; TASK-0022's runner released it at 13:21:07Z |
| Exactly one TASK-0023 specification | **MET** | `ls implementation/operations/ \| grep TASK-0023` returns one file |
| MSG-0062/MSG-0063 numbering | **MET** | Distinct numbers; no collision this time |

That last two rows are checked because they have failed before. TASK-0022 arrived as **two**
specification files (MSG-0060), and four message numbers have collided across the project's history.
Neither happened here, and confirming it costs one command.

## The sixth recurrence

MSG-0063 authorized TASK-0023, and the queue did not contain it:

```text
$ grep -c "TASK-0023" implementation/operations/CLAUDE-TASKS.md
0
```

**This is the sixth time an authorization has existed while the queue did not reflect it** — the
structural failure MSG-0044 named, and the one MSG-0060 predicted would recur. The pattern is
unchanged and still quiet: the lead records a decision and reasonably considers the work authorized;
the Supervisor reads the queue, finds nothing READY, and reports a healthy no-op; both behave
correctly and nothing happens.

MSG-0061 §8 said explicitly that the next authorization would be the sixth occurrence if it were not
reconciled. It was right.

**No rule was changed to prevent a seventh, because that is not mine to change.** The cheapest guard
remains the one MSG-0044 proposed: authorizing a task and adding its board row belong in the same
commit. The TASK-0023 specification itself already leans that way — its *Allowed* section names queue
reconciliation as part of the authorized work.

## Verification

**The dry run could not complete, and the reason is BLK-0007.** It was attempted against a copy of the
config with `dryRun` forced true, and the supervisor failed at its reconciliation gate before reaching
task selection:

```text
ERROR: unhandled: Connection closed by 20.233.83.145 port 22
```

So **supervisor selection of TASK-0023 is NOT verified** — that is stated rather than glossed. The real
`supervisor-config.json` was not modified, confirmed by diff against a copy taken before the run, and
no lock was created.

What **was** verified, offline:

```text
$ (count of board rows whose status column reads READY or IN_PROGRESS)   ->  1
$ powershell -File ./tests/supervisor.tests.ps1                                 ->  36 passed, 0 failed
```

The queue has exactly one READY row and the parser the supervisor uses is healthy. Selection itself
must be re-verified once BLK-0007 clears.

## Two records corrected while reconciling

Both are consequences of MSG-0062 arriving, and both would otherwise have left the queue asserting
something no longer true:

1. **The TASK-0022 board row** read "COMPLETE — output PROPOSED, **awaiting acceptance**". MSG-0062
   accepted it. The row now reads "output **ACCEPTED** by MSG-0062", and the seven open items it
   pointed at are recorded as ruled.
2. **The TASK-0023 specification header** read `AUTHORIZED — not yet READY`, which was accurate when
   the lead wrote it and stopped being accurate the moment the queue was reconciled. It now reads
   READY, with the transition traced to this message and to the file's own *Allowed* clause —
   "queue reconciliation so TASK-0023 is the single READY task when prerequisites are verified" —
   rather than to a conversational instruction.

**The second one is worth being explicit about.** A task specification is the lead's record. It was
edited only because the document itself defines this transition and the transition has now occurred;
the previous text is quoted in the new status line rather than erased.

## What TASK-0023 may not do

Restated here because the queue section is what an unattended runner reads: no implementation; no
provider, model, embedding, framework, or runtime selection; no permission or security-boundary
change; no Supervisor or scheduling change; **no creation or modification of accepted ADRs**; no
operator-only or privileged action; and **no downstream implementation task may be marked READY**.

## State

- **TASK-0023 is READY and is the single READY task.** It has not been started.
- MSG-0062 and MSG-0063 are registered in the COMMS register and the queue ledger.
- No implementation, ADR, provider selection, permission, or Supervisor change was made or authorized.
- The Windows `Schedule` service remains stopped, so no cycle will fire on its own. Starting TASK-0023
  requires either restarting that service or an explicit manual trigger.
