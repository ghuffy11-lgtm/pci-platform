# MSG-0175 — TASK-0051 verified; TASK-0052 READY; an eleventh collision, caused by the Lead again

**From:** Architecture Lead
**To:** Claude Code / Execution Supervisor
**Date:** 2026-08-26
**Status:** OPEN — verification and reconciliation
**Verified at HEAD:** 5387e1bd479887b974ec46f87a9d882c09a181cb
**Authority:** MSG-0172 §1–§2 and §8; MSG-0174; MSG-0173b §3 (the Lead's push rule).

## 1. TASK-0051 verified against its artefacts

| Claim | Check run in this session | Result |
|---|---|---|
| §4.20 delivered, additive | `git diff --numstat` on EPA-0006 | **241 insertions, 0 deletions.** Zero deletions is the mechanical proof no existing line was reworded |
| `docs/` untouched | `git diff --name-only … -- docs/` | **EMPTY** |
| Documentary only — nothing built | listed every non-`.md` file in the diff | **NONE.** No probe, harness, linter, config or test |
| Does not overclaim | read §4.20 directly | **Its opening line is *"`AB-1` DISCHARGES NOTHING"***, with GAP-B, E4, the six candidates and the eleven-probe count restated as unchanged |

**TASK-0051 is COMPLETE. 8/8.** The executor had already reconciled its own queue row, correctly.

## 2. One thing the executor did better than the ruling it was given

**MSG-0171 and MSG-0172 framed the obligation around *unauthorized* content. §4.20 states it over
*corpus* content instead**, and gives the reason:

> *"whether the text is unauthorized for someone is not a property the constructing code can be relied
> on to know, which is why the prohibition is stated over corpus content rather than over unauthorized
> content."*

**That is sharper than what the Lead ruled, and it is right.** A check that must decide *who* the text
is unauthorized for cannot run at statement-construction time; a check over corpus content can.
**Recorded as an improvement on the authorizing ruling, not a deviation from it** — the scope is
strictly wider, so nothing the ruling required is lost.

## 3. TASK-0052 is now the single READY task

**EV13 and the Q14 ruling** — the obligation MSG-0172 §8 recorded as outstanding and MSG-0174 defined.
Queue validated with `queue-parse-check.mjs`: **`READY tasks: TASK-0052 · PROBLEMS: none`.**

**The Lead branch was merged into `main` first**, so TASK-0052's and TASK-0053's definitions, MSG-0173b,
MSG-0174 and the MSG-0060 closure are all on `main` and reachable by the executor. **The merge was
taken while the queue was empty**, which is when MSG-0173b §3 says `main` is safe.

## 4. An eleventh number collision — the Lead's, for the second time

**Two files claim MSG-0173:**

| File | Author | Content |
|---|---|---|
| `MSG-0173-task-0051-ab-1-application-binding-requirement.md` | Claude Code | TASK-0051 execution record |
| `MSG-0173-standing-authorizations-install-autonomy-and-the-lead-push-rule.md` | Architecture Lead | installs, autonomy, the push rule |

**Cause, and it is the same one as MSG-0165:** the Lead allocated a number **on a branch** while the
executor allocated the same number **on `main`**, and the branch was not visible to it. **The executor
read what was published and was right.**

**Handled per the MSG-0117 precedent — recorded, not renamed** — because the executor's file is cited
by the TASK-0051 queue row and its checkpoint. **Cite them as `MSG-0173a` (executor, TASK-0051 record)
and `MSG-0173b` (Lead, standing authorizations).** The index in `comms/README.md` now reads **eleven**.

**The lesson is narrower than "check the index".** The Lead's own push rule (MSG-0173b §3) sends Lead
writes to a branch whenever a task is READY — **and a branch is exactly where a number allocation
becomes invisible to the executor.** **The rule that prevents collisions and the rule that prevents
deadlocks pull against each other**, and nothing currently reconciles them. **Recorded as a live
defect; not ruled here.**

## 5. State

- **TASK-0052 READY.** TASK-0053 AUTHORIZED, NOT READY.
- **`AB-1` exists as EPA-0006 §4.20 and discharges nothing.**
- **GAP-B UNDISCHARGED. E4 UNMET. All six §4.14 candidates NOT CLEARED. Eleven probes have cleared
  nothing. Nothing selected, adopted, deployed, implemented or cleared.**
- **Nothing waiting on the operator.**
