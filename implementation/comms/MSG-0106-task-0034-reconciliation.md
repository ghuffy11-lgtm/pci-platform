# MSG-0106 — TASK-0034 Reconciled: Strict Shape-1 Criterion and Probe Specification

**Status:** **OPEN** — informational; no decision blocks TASK-0034
**Raised:** 2026-08-23
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0105 | **Related:** MSG-0104, MSG-0101, ADR-0020 AMD-01, EPA-0006 §4.4

---

## 1. What was reconciled

**TASK-0034 is the single READY task**, authorized by MSG-0105 §4: update the **retrieval-engine
evaluation criterion** and the **probe specification** so future conformance evidence explicitly tests
**strict Shape-1**. The id was allocated here and verified unused.

## 2. What strict Shape-1 settles

> **"examines nothing unauthorized"** — the engine **must not examine, retrieve, inspect, or otherwise
> process** content the requesting user is not authorized to access, and **authorization must constrain
> the candidate set before retrieval/search occurs.**

**MSG-0104 §6.3's weaker reading — "materializes no unauthorized content" — is explicitly rejected.**

**The probe is why this ruling has teeth.** TASK-0033 measured an engine whose results were
**indistinguishable from a perfectly conforming engine's** while examining unauthorized rows in numbers
growing linearly with the collection. Under the materialization-only reading that engine would have
looked clear. Under strict Shape-1 it is not, and the verdict stands: **NOT CLEARED**.

## 3. Two constraints the task could otherwise blur

**Existing evidence must not be relabelled.** MSG-0105 §3 says so directly. Every MSG-0104 verdict is
carried forward unchanged — SQLite C1/C2/C3 **NOT CLEARED**, class D **DISQUALIFIED**, classes S/V/K
**NOT CLEARED** pending evidence, class H **DISQUALIFIED** under ADR-0022 §1. **No verdict may be
softened because a new criterion is being written**, and none may be re-presented as conformance under
the rejected reading.

**This is an evidence-instrument update, not an ADR amendment.** MSG-0105 §3 calls it *"an
interpretation of AMD-01's existing Shape-1 gate"* that *"does not authorize weakening AMD-01 or
changing the accepted confidentiality policy."* The criterion and probe spec are instruments;
**ADR-0020, AMD-01 and every other accepted ADR stay untouched.**

## 4. One consequence surfaced, deliberately not decided

**Strict Shape-1 asks that unauthorized content never be *examined*.** Where a single index spans
multiple authorization scopes, an index scan may touch unauthorized entries **even when the predicate
is correct** — which is exactly what the probe measured, and why the numbers grew with collection size
rather than with the predicate's selectivity.

**So a real question follows: can strict Shape-1 be satisfied by query-time predicates alone, or does
it imply something about how the projection is physically organised?**

It interacts directly with **MSG-0101 §1(1)**, which ruled that "one projection index" means one
**logical** projection — a formulation that leaves physical organisation open, and may turn out to be
load-bearing here.

**The task is instructed to surface this and stop, not to answer it.** Deciding it would be an
architecture change TASK-0034 is not authorized to make, and MSG-0105 §5 preserves the boundary
explicitly.

## 5. A ledger gap repaired

**MSG-0103 and MSG-0104 had register rows but no queue-ledger rows.** Both were written by the
TASK-0033 runner, which updated `comms/README.md` and not the ledger in `CLAUDE-TASKS.md`.

Rows for MSG-0103, MSG-0104, MSG-0105 and MSG-0106 are added here, so the two indexes agree again.
**This is the same drift the blocker index suffered three times** — a record present in one index and
absent from the other — and the same remedy applies: **update both in the commit that creates the
message.**

## 6. Boundaries

**No retrieval engine, runtime or provider is selected, adopted, recommended, installed or deployed.**
No product implementation is authorized. **No accepted ADR may be modified**, ADR-0019 included. No new
production deployment authority is created. **No implementation task may be marked READY.**

## 7. State

- **TASK-0034 is READY and is the single READY task.** Not started at the time of writing.
- **TASK-0033 is COMPLETE** at 8/8; its probe artefacts are committed and its verdicts stand.
- The scheduler is **enabled**, so a supervisor cycle can take TASK-0034 without a manual trigger.
- No blocker open. No implementation task authorized or READY.
