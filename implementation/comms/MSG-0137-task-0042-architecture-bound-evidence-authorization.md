# MSG-0137 — TASK-0042 Architecture-Bound Evidence Authorization

**Status:** AUTHORIZED / READY FOR QUEUE RECONCILIATION
**Raised:** 2026-08-24
**Authority:** Architecture Lead
**Related:** MSG-0134 (Q1), MSG-0135 (Q2), MSG-0136 (Q7), MSG-0132, EPA-0006 §4.6/§4.9/§4.13

## Authorization

Authorize **TASK-0042 — architecture-bound retrieval evidence** as a bounded evidence-only task under the now-resolved Q1/Q2/Q7 architecture boundaries.

## Scope

1. Exercise and measure the **routing phase** and reachable physical structures under strict Shape-1, treating routing-phase examination as part of `U` under G-Q4 and Q2.
2. Exercise applicable index-cursor and other reachable placements required by S7; report the maximum observed `U` and preserve the strict U1–U5 interpretation.
3. Reuse the committed harnesses/fixtures where applicable; do not re-run prior cases merely for repetition.
4. Test Q7's **zero stale-answer tolerance** across update, approval, revocation and supersession transitions, including the unavailable-current-version abstention case. The test must distinguish transition-triggered invalidation/re-check from ordinary periodic re-materialisation.
5. Measure I5/I7/I8 where the existing test subject and instrumentation can genuinely observe them; otherwise record **NEVER MEASURED / NOT CLEARED** with the exact observability limitation.
6. Re-check E4/log observability on the reachable test subject; if still unobtainable, record the limitation and do not infer clearance.
7. Preserve all existing verdicts and report no clearance unless every applicable E1–E4 and G-Q4/G-Q5/G-Q6 requirement is actually satisfied by execution evidence.

## Explicit prohibitions

- No engine, runtime, provider, model, or index technology selection.
- No implementation or deployment authorization.
- No modification of accepted ADRs.
- No relaxation, reinterpretation, or weakening of strict Shape-1 or any clearance gate.
- No invented counts, inferred observability, or construction-only substitution for execution evidence.
- No Docker/host-environment installation or operator intervention; if the environment blocks a required measurement, record the exact boundary.

## Deliverable

Produce an execution record identifying each probe/fixture, placement exercised, observed counts, transition result, observability boundary, and resulting gate status. The task may clear nothing; its purpose is to obtain the evidence now authorized by the resolved architecture boundaries.
