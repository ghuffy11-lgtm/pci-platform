# MSG-0044 — TASK-0017 Was Authorized but Invisible to the Supervisor

**Status:** **CLOSED** — TASK-0017 was executed and COMPLETE (MSG-0047). The structural finding it records stands; no action outstanding.
**Raised:** 2026-08-20
**Raised by:** Claude Code (interactive session)
**Type:** Record — queue reconciliation and a structural finding
**Authority:** MSG-0043 (TASK-0017 authorized) | **Related:** TASK-0017, TASK-0010, MSG-0013, MSG-0014

## What I found

MSG-0043 authorized TASK-0017, and `implementation/operations/TASK-0017-supervisor-heartbeat.md`
specifies it fully and marks it `READY`.

**The supervisor could never have seen it.** It reads exactly one file —
`implementation/operations/CLAUDE-TASKS.md` — and TASK-0017 appeared nowhere in it:

```text
$ grep -c "TASK-0017" implementation/operations/CLAUDE-TASKS.md
0
$ tail -n 5 logs/supervisor-20260820.log
12:17:19Z [NOOP] :: no READY task
12:27:18Z [NOOP] :: no READY task
```

So the supervisor was idling on a ten-minute cycle, correctly reporting that nothing was READY,
while an authorized and READY task sat beside the queue in its own file. It would have idled
indefinitely.

## Reconciled

Per the precedent MSG-0013 and MSG-0014 set — *reconcile the queue from the controlling decision,
and never infer authorization from anywhere else* — I added TASK-0017 to the authoritative queue:

- a board row, `READY`, depending on TASK-0016, sourced from MSG-0043;
- a task section carrying the objective, prerequisites, allowed and forbidden actions, verification,
  documentation, checkpoint, stop conditions, and recovery, with the standalone file linked as the
  full specification;
- MSG-0043 recorded in the communication ledger.

Nothing was invented: every field comes from MSG-0043 or the task file. **I did not authorize the
task** — the lead did, in MSG-0043; I only made the authoritative queue reflect it.

## The structural finding

This is the third time an authorization has existed while the queue did not reflect it. MSG-0013 and
MSG-0014 dealt with the first, and this is the same shape.

The failure mode is quiet, which is what makes it worth naming:

- the lead records a decision and reasonably considers the work authorized;
- the supervisor reads the queue, finds nothing READY, and reports a healthy no-op;
- **both are behaving correctly, and nothing happens** — indefinitely, with no error anywhere.

An unattended system makes this worse than it was when a human was driving. A person would notice
that authorized work never started; a scheduler logging `no READY task` every ten minutes looks
exactly like a scheduler with nothing to do.

### Suggestion, not a change

The cheapest guard is a convention rather than code: **a task is executable only when it appears in
the queue board.** Authorizing a task and adding its board row belong in the same commit — as the
comms register protocol already requires for messages, after the same failure happened there
(MSG-0009 era).

A code guard is possible — the supervisor could warn when it sees `TASK-*.md` files under
`implementation/operations/` that no board row mentions — but that is scope beyond TASK-0017's
mandate, and I am not adding it uninstructed. If you want it, it is a small, well-bounded task.

## Status

TASK-0017 is now READY in the authoritative queue. The supervisor will select it on its next cycle
and execute it unattended, as it has for the last five tasks. Nothing else in the queue changed, and
no other task was created, altered, or authorized.
