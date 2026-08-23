# MSG-0108 — TASK-0035 Reconciled; and a Sixth Number Collision

**Status:** **OPEN** — informational; no decision blocks TASK-0035
**Raised:** 2026-08-23
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record + numbering observation
**Authority:** MSG-0107b | **Related:** MSG-0105, MSG-0106, MSG-0104, EPA-0006, MSG-0058 F4

---

## 1. What was reconciled

**TASK-0035 is the single READY task**, authorized by MSG-0107b: evaluate **physical-isolation
strategies** against strict Shape-1, across the EPA-0006 candidate classes. The id was allocated here
and verified unused.

## 2. The ruling answers the question MSG-0106 §4 left open

MSG-0106 surfaced — deliberately without deciding — whether strict Shape-1 is satisfiable by query-time
predicates alone, or implies something about how the projection is physically organised.

**MSG-0107b answers it:**

> **Physical projection isolation/partitioning is part of the strict Shape-1 requirement where
> necessary** to guarantee the engine does not examine unauthorized content. **Query-time predicates
> alone are insufficient unless execution evidence demonstrates that they genuinely prevent examination
> of unauthorized candidates.**

**Two things in that are worth not blurring.** Predicates are **not disqualified in principle** — they
are *unproven without execution evidence*, which is a different and weaker claim. And isolation is
required **where necessary**, not universally; establishing where it is necessary is the task's work.

**MSG-0101 §1(1) is explicitly preserved**: "one projection index" still means one **logical**
projection, and MSG-0107b §2(3) forbids reinterpreting it as requiring one physical index or store.
The logical/physical distinction is now load-bearing, exactly as MSG-0106 suspected.

## 3. One instruction that guards against over-reading the evidence

**The SQLite result is evidence against the tested configuration, not proof that all relational engines
fail** — MSG-0107b §3 states it, and the task section repeats it.

TASK-0033 tested **one engine, three query shapes, two index designs**. That is a configuration, not a
class. **NOT CLEARED stands**, and class R is not disqualified by it. The opposite reading would be the
mirror of the error the strict ruling exists to prevent: treating partial evidence as a general verdict.

## 4. The bar is zero

TASK-0034's criterion makes strict Shape-1 testable, and **the bar is zero unauthorized candidates
examined.** The task is told to use it as written and **not to introduce a tolerance the ruling does not
contain** — a "negligible" or "bounded" allowance would quietly reinstate the materialization-only
reading MSG-0105 rejected.

## 5. A sixth number collision — and a new kind

**Two files are numbered MSG-0107:**

```text
MSG-0107-task-0034-execution-record.md                            -> 0107a  (runner, TASK-0034 record)
MSG-0107-physical-projection-isolation-evaluation-authorization.md -> 0107b  (Architecture Lead, authorization)
```

**They are complementary, not contradictory** — entirely different subjects — so **no stop condition
fired**, as with the MSG-0056 pair. They are disambiguated **a** and **b** in both indexes, and
**neither file was renamed**, per the MSG-0058 F4 ruling that historical records are not renamed.

**MSG-0107b was registered in neither index** until this reconciliation; only the runner's record was.

**This is the sixth collision** — MSG-0020, MSG-0033, MSG-0046, MSG-0056, MSG-0107 — but **the first
between a lead-authored decision and a runner-authored record.** The earlier ones were two records from
the same authorship path. This one has a specific cause worth naming: **the Architecture Lead and the
unattended runner allocate numbers independently and cannot see each other's in-flight files.** A
runner writing its execution record and a Lead writing an authorization in the same window will collide
whatever either does locally.

**No rule of yours is mine to change, and none was.** Recorded because the cause is structural rather
than careless, and because the a/b convention has now been used twice and works.

## 6. Boundaries

**No engine, runtime, provider, model, index technology or physical implementation is selected.** No
implementation or deployment is authorized. **No real corpus** — synthetic fixtures only. **ADR-0020,
AMD-01 and ADR-0019 are untouched.** The task **stops at evidence**; selection remains a later
Architecture Lead decision, and MSG-0107b §5 forbids self-authorizing the next step.

## 7. State

- **TASK-0035 is READY and is the single READY task.** Not started at the time of writing.
- **TASK-0034 is COMPLETE**; its criterion — the zero bar — is what TASK-0035 applies.
- The scheduler is **enabled**, so a supervisor cycle can take TASK-0035 without a manual trigger.
- No blocker open. No implementation task authorized or READY.
