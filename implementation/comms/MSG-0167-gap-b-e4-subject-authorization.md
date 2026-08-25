# MSG-0167 — GAP-B authorized: is there a subject where E4 is obtainable AND passes?

**From:** Architecture Lead
**To:** Claude Code / Execution Supervisor
**Date:** 2026-08-26
**Status:** DECIDED — authorization
**Verified at HEAD:** 0912007f6856f12609631939fe0ca2ea6b15e736
**Authority:** Operator authorization 2026-08-26; **EPA-0006 §4.13 GAP-B** (undischarged); **§4.13 EV5**;
**§4.15** (TASK-0043, MSG-0146); **§4.12** (F15); **§4.6 S6/S9/S10**; MSG-0141 precedent for a test
subject as an evidence instrument.

## 1. A correction the Lead owes before the authorization

**The Lead stated to the operator that E4 was unobtainable on both tested subjects. That is wrong, and
§4.15 says so in its own heading — *"obtainable, and adverse."*** The correction matters because it
changes what the task must look for.

**What the record actually establishes:**

| | First subject (§4.12, §4.14) | Second subject (§4.15) |
|---|---|---|
| Engine / binding | SQLite **3.51.3** via `node:sqlite` | SQLite **3.50.4** via Python `sqlite3` |
| **E4** | **NOT OBTAINABLE** | **OBTAINABLE** |
| Result | no surface to inspect | **ADVERSE** |

**The three build flags are absent on both** (`DEBUG`, `ENABLE_SQLLOG`, `ENABLE_STMT_SCANSTATUS`) — the
Lead had that part right — **but the conclusion drawn from it was backwards.** §4.15: *"the two subjects
differ in the binding, not in the build… E4's obtainability here is a property of what the language
binding exposes."* **The binding is why the second subject HAS a surface, not why it lacks one.**

## 2. Why GAP-B still blocks, and why the operator's authorization was still the right call

**GAP-B is explicitly NOT withdrawn** (§4.15): it is a claim about the **first** subject — *"the subject
every Shape-1 measurement in §4.11, §4.12 and §4.14 was taken on"* — and *"those measurements do not
acquire E4 evidence because a different subject has a trace surface."*

**So the position is worse than "no surface exists", not better.** Three facts, each recorded:

1. **Where the Shape-1 evidence lives, E4 cannot be taken.** §4.13 GAP-B: this *"blocks clearance
   independently of topology"*, and a future probe on that subject *"would clear nothing whatever the
   topology."*
2. **Where E4 could be taken, it FAILED.** Unauthorized passage text **bound as a parameter** appeared
   **verbatim** in the engine's trace, because *"the trace emits the EXPANDED statement, so binding a
   parameter does not keep the text out of it."*
3. **Even that surface cannot serve elsewhere.** §4.15 verdict C4 = **NO**: it records the
   **instruction**, not the **examination** — 200 rows examined, 100 returned, **1 trace entry**. **It
   is not E2 evidence and cannot substitute for an S7 placement.**

**EV5 states the consequence in terms:** *"an engine that cannot supply EV5 cannot be selected under any
topology."* **GAP-B is therefore the binding constraint on the entire programme**, and §4.13 says it is
*"the one to read first."* **Ten probes have cleared nothing; on the subject the evidence uses, the next
ten cannot either.**

## 3. The authorization

**One bounded evidence task — `TASK-0050` — is authorized** to discharge GAP-B by establishing whether a
**reachable** test subject can supply E4 that is **both OBTAINABLE and NON-ADVERSE**, and whether such a
subject can carry the Shape-1 measurements that the existing evidence took on the first subject.

**The question §4.15 leaves open, stated exactly:** the one surface that made E4 obtainable is a
**statement trace**, and it failed **because it expands the statement**. **Whether that is a property of
that binding or of statement-trace observability generally is NOT established, and the task must not
assume either.** If the task finds the two properties are inseparable — that obtainability implies
adversity for this class of surface — **that is a referral to the Lead, not a finding the task may act
on.**

**This authorizes evidence and nothing else.** Following MSG-0141's precedent verbatim: **a test subject
is an evidence instrument, not a candidate**; it *"must not be evaluated for product suitability"*; and
a successful E4 observation *"does not clear any candidate or permit engine selection."*

## 4. Constraints — binding on the task

- **No engine, runtime, binding or index technology is selected, adopted, preferred, ranked, deployed,
  implemented or cleared.** **Choosing a test subject is not choosing a product.**
- **No generalization from one subject to an engine class** (§4.6 S10; §4.12's standing prohibition;
  §4.15's *"binding, not the build"*).
- **No change to E1–E4, S1–S11, DA-1…DA-7, N1–N6, G-Q4…G-Q7.8, strict Shape-1, or any clearance gate.**
  **In particular, E4 may not be weakened to make a subject pass.** MSG-0119's rule holds: failure does
  not authorize weakening the gates.
- **No candidate verdict changes.** All six §4.14 candidates remain NOT CLEARED.
- **Unobtainable is NOT relief** (EV5): an absent evidence class yields **NOT CLEARED** by rule, and a
  "none reachable" answer is admissible **only by enumeration with a control** — F15's nonexistent-pragma
  control is the standard, without which *"the instrument reported nothing"* and *"the instrument was
  never running"* are the same observation.
- **Fail closed.** An uninspectable surface is not a clean one.
- **Stop at any environment or operator boundary rather than routing around it.** **If discharging
  GAP-B requires installing a runtime, compiling a build with different flags, or any host change, that
  is a BLOCKER to record — not a problem to solve locally.** **BLK-0011 is the precedent** and this task
  is the most likely in the programme to hit it.
- **Stop if `origin/main` moves mid-run.**

## 5. What this authorization does NOT do

- **It rules no open question.** **Q21, Q17, Q14 and the L4/W-B non-reproduction (MSG-0164 §5) remain
  OPEN and unruled.**
- **It does not withdraw or amend GAP-B**, and it does not promise GAP-B can be discharged. **A recorded
  finding that no reachable subject supplies a non-adverse E4 would be a complete and valid outcome** —
  and would be the most consequential result the programme has produced, because it would mean the
  clearance bar cannot be met by measurement on any subject now in reach.
- **It authorizes no implementation, no deployment, and no work package.**

## 6. State

- **TASK-0050 is authorized and, on reconciliation, is the single READY task.** No other task is READY.
- **Nothing selected, adopted, deployed, implemented or cleared. Ten probes have cleared nothing.**
- **No blocker open.** DISC-0011 and DISC-0012 open; neither moves a verdict.
