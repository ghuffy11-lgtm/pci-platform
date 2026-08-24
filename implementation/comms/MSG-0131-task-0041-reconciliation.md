# MSG-0131 — TASK-0041 Reconciled: Q3 Architecture Response

**Status:** **OPEN** — informational; no decision blocks TASK-0041
**Raised:** 2026-08-24
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0130, with MSG-0129 binding | **Related:** MSG-0128, EPA-0006 §4.6–§4.8, §4.12

---

## 1. What was reconciled

**TASK-0041 is the single READY task**: define and evaluate the **technology-agnostic retrieval
topology** Q3 requires, map it to the existing gates, and state the minimum evidence a future
engine-selection task would need. **Two distinct message numbers, no collision.**

## 2. Which branch Q3 took, and what stays open

**§4.7 Q3 named three shapes of answer** — settle what `U` counts (Q1), accept physical organisation as
a requirement (Q2), or **reconsider the retrieval topology**. **MSG-0129 takes the third**, and it takes
it without ruling the other two: **Q1 and Q2 remain open.**

**The ruling's own words matter more than any summary of them:**

> **"The response is not to relax the bar and not to select the least-bad engine."**

**The project stays NOT CLEARED for retrieval-engine selection.** Failure of every tested candidate is
**evidence that the explored space is insufficient**, not authority to weaken AMD-01 or strict Shape-1.
**§4.7 anticipated exactly this temptation** — *"a criterion loosened whenever nothing passes it is not
a criterion"* — and the ruling agrees with it in terms.

## 3. What makes this task different from the five before it

**It is entirely structural, and structure clears nothing.** §4.9 **G-Q6 rejects construction-only
evidence**, and MSG-0130 repeats the prohibition directly: *"Do not claim that a structural design
clears a gate where execution evidence is required."*

**So the honest output of TASK-0041 is a topology plus the evidence still owed on it** — never a
cleared candidate. That is why acceptance criterion 4 asks for **minimum evidence**, not a shortlist.

## 4. The evidence a proposal has to survive

**Start from §4.8's measured catalogue (I0–I6), not a fresh one** — a new catalogue that ignores it
discards five probes of work. The specific results that constrain any topology:

| Result | Where |
|---|---|
| **A global lexical or vector index undoes perfect partitioning** — traversal returns to a scope-spanning structure, **disqualifying under E1 regardless of any counter** | §4.8, I6 |
| **I5, per-principal materialisation, discharges four conjuncts and was never measured** | §4.8 |
| **Removing the copy does not help**: the designs holding **no copy at all** carry the **largest `U`**, growing with `N` | §4.11 |
| **`U = 0` is purchasable by withholding authorized content** (K4) — a topology that answers nothing does not clear | §4.11 |
| **The planner decided the outcome** (K7 vs K8, one `INDEXED BY` token, `U` 715 → 0) **and so did `ANALYZE`** | §4.11, §4.12 |
| **A row-access zero is not an index-cursor zero** | §4.6 S7-R3 |

**The planner result is the one that argues for this task's existence.** If a maintenance command can
flip a design's `U` between 2857 and 0, then **whatever satisfies the gates cannot be a property of an
engine's optimizer** — it has to be structural, which is precisely what MSG-0129 asks for.

## 5. Boundaries

**No engine, runtime, provider, model or index technology selected; no implementation or deployment.**
**No accepted ADR modified.** **No weakening of strict Shape-1, `U = 0`, E1–E4 or Q4–Q12.** **No real or
confidential corpus.** **No invented benchmark, latency, capacity, recall or throughput figure.** **No
generalizing `node:sqlite` planner behaviour to an engine class.** **No prior verdict relabelled and no
prior probe re-run.**

## 6. State

- **TASK-0041 is READY and is the single READY task.** Not started at the time of writing.
- **TASK-0040 is COMPLETE** (8/8), and its result was verified from `main` by a second session
  (MSG-0128).
- **Q3 is ruled** by MSG-0129. **Q1, Q2 and Q7's numeric limb remain open.**
- **K7/K8 remain NOT CLEARED; five probes have cleared nothing.**
- The scheduler is **enabled** — heartbeat `2026-08-24T15:17:18Z`, `NOOP` — so a cycle can take
  TASK-0041 without a manual trigger.
- No blocker open. **No implementation task authorized or READY.**
