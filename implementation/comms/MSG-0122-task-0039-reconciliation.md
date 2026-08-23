# MSG-0122 — TASK-0039 Reconciled: K7/K8 Remaining Clearance Evidence

**Status:** **OPEN** — informational; no decision blocks TASK-0039
**Raised:** 2026-08-24
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0120, with MSG-0119 binding | **Related:** MSG-0118, MSG-0121, EPA-0006 §4.6–§4.11

---

## 1. What was reconciled

**TASK-0039 is the single READY task**, authorized by MSG-0120: close the remaining strict Shape-1
clearance gaps on the **physically partitioned K7/K8 class** — the missing **E4 engine-log evidence**,
the **index-entry observability limitation (`U1`)**, and whether E1–E4 and G-Q4 can be satisfied with
evidence **independent of a single observed optimizer plan**.

**Three numbers, three files, no collision** — MSG-0119, MSG-0120 and MSG-0121 are distinct, which is
worth noting after seven collisions.

## 2. Why K7/K8, and why the strict Q11 ruling made them the subject

**MSG-0119 ruled Q11 strictly**: an exact-key seek into a scope-spanning structure **does not satisfy
E1**, even when it touches only an entitled row, because E1 requires confinement to a structure **every
entry of which** satisfies the predicate. **K3 and K4 stay NOT CLEARED.**

**K7 and K8 are untouched by that ruling**, because their **version and chunk stores are physically
partitioned** — so they satisfy E1 under **both** readings, exactly as TASK-0038 reported. **That makes
them the only candidates whose E1 position is not in question**, and the only ones on which closing the
remaining gaps is worth the effort.

**The ruling is fail-closed and it is worth noticing which way it cuts.** It narrowed the field by
disqualifying a reading, not by clearing anything — and it left the strongest candidates standing on
their own merits rather than on a permissive interpretation.

## 3. Three shortcuts that would each produce a false pass

MSG-0120's boundaries are stated as prohibitions; the task section states them as **the specific
mistakes they prevent**, because each is tempting precisely when a candidate looks promising.

**Absence of observation is not observation of absence.** MSG-0118 recorded that the test subject
**cannot observe index-entry reads**. An unmeasurable `U1` is **not a zero `U1`**. MSG-0120 forbids
claiming otherwise, and the correct outcome is that the affected gate stands **NOT CLEARED** — not that
the probe failed.

**Missing logs may not be inferred.** If E4 evidence is unobtainable from this engine, **record it as
not obtained**. Reconstructing what a log *would* have shown is the exact substitution the E-gates
exist to prevent.

**One plan is not plan-independence.** A single `EXPLAIN QUERY PLAN` shows what the optimizer chose *on
that occasion, for that fixture, at that size*. Where MSG-0120 §3 requires evidence independent of a
single observed plan, **one observation does not satisfy it** — establishing plan stability, or
recording that it could not be established, is the work.

**And the standing bar carries forward:** `node:sqlite` planner behaviour **may not be generalized to
other engines without evidence**. TASK-0033's verdict already had to say this when a candidate looked
doomed; **the same discipline applies now that one looks promising**, which is the harder direction.

## 4. What a negative result would mean

**If K7/K8 cannot be cleared, that is a finding, not a failure of the task.** MSG-0119 is explicit that
**failure does not authorize weakening the gates**, and the question would return to **EPA-0006 §4.7
Q3** for an explicit architectural response.

**Four probes have now cleared nothing**, and the alternative expected to help — the kernel-constrained
path — was measured by TASK-0038 and **eliminated divergence while doing nothing for Shape-1**. K7/K8
are the narrowed ground that remains, not a likely pass.

## 5. Boundaries

**No engine, runtime, provider, model or index technology selected; no implementation or deployment.**
**No relaxation of strict Shape-1, `U = 0`, E1–E4, G-Q4, Q8, Q10 or Q11.** **Unauthorized examination
remains disqualifying.** **No accepted ADR modified.** **Unobtainable evidence yields NOT CLEARED, never
an inferred pass.**

## 6. State

- **TASK-0039 is READY and is the single READY task.** Not started at the time of writing.
- **TASK-0038 is COMPLETE** (8/8): six NOT CLEARED, three DISQUALIFIED, and the kernel-constrained
  alternative measured and found not to help.
- **Q11 is resolved** by MSG-0119; **K3/K4 remain NOT CLEARED** under the strict reading.
- The scheduler is **enabled**, so a supervisor cycle can take TASK-0039 without a manual trigger.
- No blocker open. No implementation task authorized or READY.
