# MSG-0126 — TASK-0040 Reconciled: Encode Q12 in EPA-0006 §4.6 S7

**Status:** **OPEN** — informational; no decision blocks TASK-0040
**Raised:** 2026-08-24
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0125, with MSG-0124 binding | **Related:** MSG-0123, TASK-0034 precedent, EPA-0006 §4.6 S7

---

## 1. What was reconciled

**TASK-0040 is the single READY task**: update **EPA-0006 §4.6 S7** so Q12 is explicit and testable,
via the criterion-update mechanism TASK-0034 established. Three distinct message numbers again —
MSG-0123, MSG-0124, MSG-0125 — **no collision**.

## 2. The inference Q12 closes, and why it keeps recurring

**A row-access counter can read zero while an index cursor is walking entries the subject cannot
see.** MSG-0125 forbids the shortcut in terms: *"Do not claim that a row-access zero proves
index-cursor zero."*

**This is the same error shape the project keeps meeting, in four different costumes:**

| Where it appeared | The unobserved thing read as absent |
|---|---|
| `U1` in TASK-0038 / TASK-0039 | index-entry reads the subject cannot instrument |
| Q12 here | index-cursor traversal behind a clean row-access count |
| MSG-0103 | SQLite "absent" because the **CLI** was absent |
| MSG-0102 | Docker and Python "absent" because of a **`PATH`** artefact |

**Each time, an instrument's silence was read as evidence of nothing happening.** So S7 must make the
**omission itself disqualifying** rather than merely noted: an unexercised reachable placement means
**E2 is not satisfied**, however clean the row-access figure looks. That is what turns the rule from a
caution into a gate.

## 3. Method constraints worth stating plainly

**Additive and declared, on TASK-0034's precedent** — that update was **272 insertions, 0 deletions**.
MSG-0125: *"do not silently rewrite unrelated text."* If existing S7 wording must change, the change is
**stated**, not absorbed.

**Verify from `main`, not the working tree.** MSG-0125 asks for the post-change content to be verified
and the exact change statistics recorded. The task section says to read the committed object after
pushing — the step that distinguishes *"I wrote it"* from *"it is published"*, and this project has had
a push rejected mid-run before (BLK-0006).

**Preserve verdicts and re-run nothing.** K7 and K8 remain **NOT CLEARED**, and MSG-0125 is explicit
that prior probes are not re-run merely because the criterion is being encoded. **Five probes have now
cleared nothing**, and that record stands as measured.

## 4. Boundaries

**No engine, runtime, provider, model or index technology selected; no implementation or deployment.**
**No weakening of E2, strict Shape-1, `U = 0`, E1–E4, G-Q4, Q8, Q10 or Q11.** **No numeric tolerance or
threshold.** **No accepted ADR modified.** **Stop after the update and its verification** — MSG-0125
requires the next evidence action to be **separately authorized**.

## 5. A reconciliation slip, recorded

**I created a duplicate MSG-0123 ledger row** — the TASK-0039 runner had already added one — and removed
it in the same pass, keeping the runner's original. **This is the second time**; the same happened with
MSG-0115 two cycles ago.

**The cause is mine and mechanical**: I insert ledger rows for every message I see in a cycle without
first checking which the runner already recorded. **The check is one `grep` and belongs before the
insert, not after it.** Recorded rather than quietly fixed, because a duplicate ledger row is exactly
the kind of drift the register discipline exists to catch, and I introduced it.

## 6. State

- **TASK-0040 is READY and is the single READY task.** Not started at the time of writing.
- **TASK-0039 is COMPLETE** (8/8): **K7 and K8 NOT CLEARED**, on 96 measurements plus calibration,
  API enumeration, opcode capture and a negative control.
- **Q12 is resolved** by MSG-0124; the E2 bar is unchanged.
- The scheduler is **enabled**, so a supervisor cycle can take TASK-0040 without a manual trigger.
- No blocker open. No implementation task authorized or READY.
