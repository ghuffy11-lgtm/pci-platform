# MSG-0117 — TASK-0038 Reconciled; and a Seventh Collision, This Time Lead-vs-Lead

**Status:** **OPEN** — informational; no decision blocks TASK-0038
**Raised:** 2026-08-23
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record + numbering observation
**Authority:** MSG-0116a and MSG-0116b | **Related:** MSG-0115, MSG-0020 (the precedent), MSG-0058 F4

---

## 1. The collision, and why it needed checking rather than absorbing

**Two Architecture-Lead-authored files claim MSG-0116:**

```text
MSG-0116-architecture-lead-rulings-q8-q10.md   -> 0116a   (commit 1858512)
MSG-0116-architecture-lead-q8-q10-rulings.md   -> 0116b   (commit fb2d127)
```

**This is the MSG-0020 shape — two lead-authored records on the same subject — and MSG-0020's pair
contradicted each other**, which raised BLK-0005 and cost a full stop-and-ask cycle before MSG-0022 and
MSG-0023 resolved it. **So agreement was verified clause by clause before this task was queued**, not
assumed from the fact that earlier collisions turned out benign.

**They agree**: Q8 *no, under conditions*; Q9 *do not relax the bar*; Q10 *strict effective-version*;
and the same next action. **No stop condition fired.**

**But they are not interchangeable**, and the differences are operative rather than stylistic:

| Only in **0116a** | Only in **0116b** |
|---|---|
| The **measured kernel-read count is not by itself a Shape-1 violation** | The re-check **must be instrumented separately** from retrieval-content examination |
| The re-check must consult **authoritative current state, not a materialized copy** | **Evidence must show it reads only authoritative kernel facts**; a re-check reading content-bearing data from an unauthorized candidate **is examination and fails Shape-1** |
| **Citation/version identity must name the actual current version** (ADR-0018) | **No clearance follows from Q8** — E1–E4 and G-Q4…G-Q7 remain independently necessary |
| If nothing satisfies the gates, **return to EPA-0006 §4.7 Q3** | **A6 passed freshness yet stayed NOT CLEARED** — E2 failed, E4 not obtained, G-Q4 not measured |
| — | Any formal lifecycle change **remains an ADR question** |

**A runner reading only one would miss either the separate-instrumentation requirement or the
citation-version point.** The task section therefore carries **the union** and links both. **Neither
file was renamed**, per MSG-0058 F4, and **neither was registered in either index** until this
reconciliation.

## 2. Why the two additions matter most

**0116b's separate-instrumentation requirement is what makes Q8 falsifiable.** Q8 says the kernel
re-check is a control-plane lookup rather than examination — which, without instrumentation, is an
assertion about intent. Requiring the re-check to be measured *separately from* content access turns it
into something a probe can check, and names the failure: **if the re-check touches content-bearing data
on an unauthorized candidate, it is examination and Shape-1 fails.**

**0116b's "no clearance follows" is the guard against the obvious misreading.** Q8 removes an apparent
conflict between AMD-01 and ADR-0020 §3; it does not clear anything. **E1–E4 and the G-gates remain
independently necessary**, and A6 is the worked example — **it passed the freshness gates and is still
NOT CLEARED.**

## 3. What TASK-0038 investigates

The alternative **MSG-0115 identified and explicitly did not measure**: a **kernel-constrained /
in-query authorization path**, and/or an architecture that **prevents security-relevant projection
divergence** — whether either can obtain **E1–E4 and G-Q4 evidence without examining unauthorized
content**.

**MSG-0115's sharpest result is why this is the right next question:** every tested materialized design
examined unauthorized rows once its copy diverged from the kernel — **including divergence with zero
elapsed time.** Divergence, not staleness, is the mechanism.

**Both rulings forbid assuming the kernel join solves it.** MSG-0116a is explicit: do not select an
engine on the assumption that an **unmeasured** mechanism will work. That is exactly what this task
must measure rather than presume.

## 4. Boundaries

**`U = 0`, E1–E4 and strict Shape-1 are not relaxed.** **Nothing is selected, adopted, installed,
deployed or recommended.** **No accepted ADR is modified** — ADR-0018 and ADR-0020 included. **All
existing NOT CLEARED and DISQUALIFIED verdicts stand**, A6's included. **If no candidate satisfies the
gates, the question returns to EPA-0006 §4.7 Q3** — failure does not authorize relaxation.

## 5. A note on the numbering pattern

**Seventh collision** — MSG-0020, 0033, 0039, 0046, 0056, 0107, 0116 — and the **second between two
lead-authored records**, after MSG-0020.

MSG-0108 recorded that the MSG-0107 collision had a structural cause: the Lead and the unattended
runner allocate numbers independently. **This one does not fit that explanation** — both files came
from the same authorship path, minutes apart, on the same subject. **It is closer to MSG-0047's
observation**: when a decision is restated, a sibling file gets written rather than the existing one
amended.

**No rule of yours is mine to change, and none was changed.** The a/b convention has now absorbed three
collisions and works. Recorded so the pattern stays visible rather than becoming routine.

## 6. State

- **TASK-0038 is READY and is the single READY task.** Not started at the time of writing.
- **TASK-0037 is COMPLETE** (8/8); nothing was cleared, and Q8/Q9/Q10 are now ruled.
- The scheduler is **enabled**, so a supervisor cycle can take TASK-0038 without a manual trigger.
- No blocker open. No implementation task authorized or READY.
