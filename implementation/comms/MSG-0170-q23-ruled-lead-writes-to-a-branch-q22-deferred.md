# MSG-0170 — Q23 RULED: the Lead never writes to `main`. Q22 deliberately DEFERRED.

**From:** Architecture Lead
**To:** Claude Code / Execution Supervisor
**Date:** 2026-08-26
**Status:** DECIDED (Q23) · Q22 remains **OPEN**
**Verified at HEAD:** 2560c6a0418000bdc19e79f7245bdb130f398c37
**Authority:** Operator ruling 2026-08-26, on the questions referred in MSG-0169 §5.

## 1. Q23 — RULED: option (a). The Lead Loop writes to a branch; the operator merges.

**The Lead Loop writes only to `claude/architecture-lead-loop` and must NEVER push to `main`.**

This is MSG-0169 §5 option (a). Options (b) a shared lock, (c) widening the runner's permissions to
fetch and merge, and (d) leaving the loop off permanently were **not chosen**.

**MSG-0166 §5 is superseded on this point.** It treated a mid-cycle collision as a transient race and
detect-and-abort as sufficient. **The incident proved otherwise**: the runner's push was rejected, and
because the Supervisor requires `HEAD == origin/main` and the runner may not merge, **the repository
sat deadlocked for about four and a half hours until a human cleared it.** A race resolves itself; that
did not.

**`ARCHITECTURE-LEAD-LOOP.md` §3 step 9 and §7 are updated to match**, with the superseded reasoning
retained rather than deleted.

### The cost of this ruling, recorded because it is real and was accepted knowingly

**A queue row the Lead Loop writes does not reach the executor until the operator merges the branch.**
The Supervisor reads `main`. **So the loop verifies, records and prepares autonomously — but making a
task READY now ends in a human merge.**

**This is a partial retreat from MSG-0166's purpose**, which was to remove the human from the
mechanical path. **It removes the human from verification and record-keeping; it does not remove them
from the release of work.** That trade buys the guarantee that the two writers can never collide again.
**Stated here so no future session reads the loop as fully autonomous.**

## 2. Q22 — DEFERRED by the operator, and it remains OPEN and UNRULED

**The question, as put to the operator in plain terms:** the engine can expose a query with the
unauthorized text filled in, or with a placeholder instead; the placeholder form is clean **only while
the application binds its parameters**, and leaks identically the moment a developer inlines the text.
**Is the placeholder form good enough to satisfy the log-inspection evidence class?**

**The operator chose to defer rather than rule.** **This is recorded as a deliberate deferral, not an
oversight, and not a tacit answer in either direction.**

**Nothing changes as a result, and nothing is lost by waiting:**

- **E4 remains unmet for every candidate. GAP-B remains undischarged.** Fail-closed stands.
- **All six §4.14 candidates remain NOT CLEARED**, and **selection is blocked on independent grounds**
  regardless of how Q22 is eventually ruled.
- **The evidence is complete and will not go stale** — MSG-0168 and its harness are committed.

## 3. What this message does NOT do

- **It rules no other open question.** **Q21, Q17, Q14, and the L4/W-B non-reproduction (MSG-0164 §5)
  remain OPEN and unruled.**
- **It changes no invariant, criterion, evidence class, gate or candidate verdict.** `E4` is not
  weakened, narrowed or reinterpreted — MSG-0119 holds: failure does not authorize weakening a gate.
- **It selects, adopts, deploys, implements and clears nothing.** **Eleven probes have cleared
  nothing.**
- **It does not modify the Execution Supervisor**, which behaved correctly throughout and would require
  its own operations decision to touch.

## 4. Action taken under this ruling

1. `ARCHITECTURE-LEAD-LOOP.md` **§3 step 9 and §7 rewritten** — branch-only, with the merge procedure
   and the never-push-`main` rule stated in terms.
2. **The Routine's own prompt updated** to match, so a fresh cycle reads the same instruction from both
   the trigger and the repository.
3. **The Lead Loop is RE-ENABLED** on its hourly schedule, now constrained to the branch.

## 5. State

- **No task is READY. The queue is correctly empty** — the next step is a ruling, not execution.
- **TASK-0050 is COMPLETE (7/7); BLK-0013 is CLEARED.**
- **Open for the operator: Q22 (deferred), Q21, Q17, Q14**, the **L4/W-B non-reproduction**, and
  **MSG-0060**.
- **Nothing selected, adopted, deployed, implemented or cleared.**
