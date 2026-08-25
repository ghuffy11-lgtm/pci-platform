# DISC-0013 — A task-file link in the dependency cell makes a task depend on itself, and the Supervisor fails closed

**Raised:** 2026-08-26 by the Architecture Lead, after the operator reported that a Supervisor cycle
ran and started nothing while TASK-0050 stood READY.
**Status:** OPEN — recorded; the immediate instance is fixed.
**Severity:** **Silent stall.** The Supervisor behaves exactly as designed; the queue is what is wrong.
**Bears on:** **Q17** (the queue-row mechanism), and the Lead Loop's reconciliation rules.

## 1. What happened

TASK-0050 was reconciled as the single READY task. The operator's Supervisor ran its cycle and
**started nothing**. It was right to.

## 2. Cause — established from the Supervisor source, not inferred from the symptom

`implementation/operations/supervisor/supervisor.ps1` parses the board and extracts dependencies by
regex over the **dependency cell**:

```powershell
foreach ($m in ([regex]::Matches($dependsRaw, 'TASK-\d{4}'))) { $depends += $m.Value }
```

and then validates:

```powershell
# A READY task whose dependencies are not COMPLETE is a contradiction, not an invitation.
elseif ($depTask.Status -ne 'COMPLETE') {
    $problems += ('{0} is READY but dependency {1} is {2}' -f $t.Id, $dep, $depTask.Status)
}
```

**The Lead had written a markdown link to the task's own definition file into that cell:**

```text
the Lead's committed task definition [`TASK-0050-gap-b-e4-subject.md`](TASK-0050-gap-b-e4-subject.md)
```

**The regex does not know a filename from a dependency.** It extracted `TASK-0050`, so **TASK-0050
depended on itself**, its own status was `READY` rather than `COMPLETE`, and the queue was therefore
**contradictory**. A contradictory queue is a fail-closed no-op by design.

**Reproduced before the fix, by replicating the parser's logic against the committed file:**

```text
READY task TASK-0050: deps parsed = ['TASK-0043', 'TASK-0049', 'TASK-0050']
PROBLEMS: TASK-0050 is READY but dependency TASK-0050 is READY
IsConsistent = False -> supervisor FAILS CLOSED (NOOP)
```

**And after the fix:**

```text
READY TASK-0050: deps=['TASK-0049']
PROBLEMS: none
supervisor -> STARTS RUNNER
```

**The Supervisor is not defective and was not changed.** *"Every uncertainty is a no-op"* is its
stated design principle, and a self-dependent task is an uncertainty.

## 3. The part that matters more than the fix

**The same defect is present in the committed rows for TASK-0048 and TASK-0049**, which carry the same
self-referencing link. **Both of those tasks nevertheless executed.**

**The only reading consistent with both facts is that the Supervisor did not start them — the operator
did, by typing `COMMS`.** The manual trigger **masked the defect for two consecutive tasks**, and it
surfaced only when a cycle was expected to start work on its own.

**INFERRED, not verified:** this session cannot read the Supervisor's logs or `runner.lock`, both of
which live on the Windows development machine. **What would settle it** is
`implementation/operations/supervisor/logs/` for the cycles covering TASK-0048 and TASK-0049 — a
`NOOP :: contradictory queue` (or similar) there would confirm it directly.

**TASK-0048's and TASK-0049's rows are left as they are.** Both are `COMPLETE`, only `READY` tasks are
validated, so they cause no present problem, and **rewriting a completed task's committed row to tidy
a defect would damage the record for no operational gain.** They are named here instead.

## 4. Rule, for every future queue reconciliation

**Never put a `TASK-NNNN` string in the dependency cell unless it IS a dependency.**

- **No markdown links to task definition files** in that cell — name the file in the notes cell.
- **No parenthetical citations** that happen to contain a task ID, e.g. `§4.15 (TASK-0043/MSG-0146)` —
  cite the message or section instead. **That one would have fired too** had the board row for
  TASK-0043 not read `COMPLETE`.
- **Every ID in the cell must name a task that is `COMPLETE`**, or the queue is contradictory.
- **Verify by replicating the parser before pushing a READY row.** The check is cheap, and the failure
  it prevents is silent.

## 5. Why this is a discovery and not just a typo

**The failure mode is indistinguishable from "no work to do."** The Supervisor logs a no-op, the queue
looks correct to a human reader — the row says `READY` in plain sight — and **nothing anywhere reports
that a contradiction was detected** unless someone reads the cycle log.

**This is the fourth distinct way the queue-row mechanism has failed** (the three preceding ones are
recorded in MSG-0162 §2.1 and MSG-0164 §3, all "authorized task, no row"). **Q17 asks what that
mechanism should be, and this is evidence for it: a queue whose rows are written in prose, and parsed
by regex, will keep producing silent stalls.** **Not ruled here** — Q17 is the Lead's, and this
discovery is input to it, not an answer.

## 6. What is NOT affected

**No architecture, invariant, criterion, gate, candidate verdict or evidence result is touched.** This
is a queue-encoding defect. **TASK-0050's authorization (MSG-0167) and definition are unchanged**, and
nothing was selected, adopted, deployed, implemented or cleared.
