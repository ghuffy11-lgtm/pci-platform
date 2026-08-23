# MSG-0114 — TASK-0037 Reconciled: Version-Transition Freshness Evidence

**Status:** **OPEN** — informational; no decision blocks TASK-0037
**Raised:** 2026-08-23
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0113 | **Related:** MSG-0112 (Q7 referral), MSG-0109 (TASK-0035 evidence), EPA-0006 §4.9

---

## 1. What was reconciled

**TASK-0037 is the single READY task**, authorized by MSG-0113 §5: produce **execution evidence** for
version-transition freshness and stale-version fail-closed behaviour, across update, approve, revoke
and supersede, plus the **unavailable-new-version abstention** case. The id was allocated here and
verified unused.

## 2. Why Q7's reframing is better than the answer it replaces

MSG-0112 referred Q7 because **no numeric staleness threshold exists anywhere in the accepted set**, and
G-Q5's bounded-interval limb was therefore structural rather than numeric. The obvious way to close
that would have been to pick a number.

**MSG-0113 does something better: it establishes that a number was never the right instrument.**

> A **timer** measures how long ago a structure was rebuilt. The **requirement** is whether the
> **authoritative version changed** — which a timer cannot observe.

A policy can be superseded one second after a refresh, and a design with a generous interval and a
correct transition hook is safe, while a design with a tight interval and no hook is not. **The elapsed
time is the wrong axis.** So Q7 is retired not by choosing a threshold but by replacing the question,
and **no numeric threshold is introduced** — MSG-0113 §2 permits one only where an architecture needs it
as an *enforcement mechanism*, never as a substitute for the requirement.

## 3. The discriminator, carried into the task because it is the likeliest error

MSG-0113 §3: *"Evidence must distinguish **transition-triggered** freshness from ordinary **periodic
re-materialization**. Passing a fixed-time test alone does not establish the requirement."*

**A design that re-materialises every N seconds will pass a naive V1→V2 test simply by waiting** — and
will still be wrong, because nothing tied the refresh to the transition. The probe must therefore **test
at a moment when a timer would not have fired**, so that a periodic design *fails* and a
transition-triggered one *passes*.

**A fixture that does not separate the two proves nothing**, however many cases it runs. That is stated
in the task section in those terms.

## 4. It closes the TASK-0035 finding

TASK-0035 measured a materialised design that, once stale, **returned 5 of 5 unauthorized rows** — a
leaking failure rather than a conservative one, and the sharpest result the probes have produced.

**MSG-0113 §2(6) is the rule that answers it:** *"Any physical/partitioned representation must carry
sufficient version/lifecycle identity to prove that the candidate is current; physical isolation does
not excuse stale-version use."*

So the same class-R harness is the natural subject, extended with lifecycle transitions. The task is
told to **reuse the committed harnesses and not re-run their existing cases** — that evidence stands.

## 5. Boundaries

**Nothing is selected or deployed.** **No accepted ADR is modified.** **Strict Shape-1 remains "examines
nothing unauthorized."** **G-Q5 gets no numeric threshold** — Q7 strengthens it rather than replacing
it. **TASK-0035 and MSG-0104 verdicts remain unchanged**, and unobtainable evidence is **NOT CLEARED**,
never assumed conformance.

**Environment:** SQLite via `node:sqlite` has been the working subject for both prior probes; Docker's
Linux backend was unreachable at last check. The task is told to **re-check rather than assume**,
**install nothing**, and **not start Docker Desktop** — an operator action.

## 6. State

- **TASK-0037 is READY and is the single READY task.** Not started at the time of writing.
- **TASK-0036 is COMPLETE** (8/8); EPA-0006 §4.9 carries G-Q4/G-Q5/G-Q6, and its change was purely
  additive — 272 insertions, 0 deletions.
- **Q7 is resolved** by MSG-0113 and needs no further referral.
- The scheduler is **enabled**, so a supervisor cycle can take TASK-0037 without a manual trigger.
- No blocker open. No implementation task authorized or READY.
