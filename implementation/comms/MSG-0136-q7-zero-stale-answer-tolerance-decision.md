# MSG-0136 — Q7 Zero Stale-Answer Tolerance Decision

**Status:** DECIDED / APPLIED
**Raised:** 2026-08-24
**Authority:** Architecture Lead decision, following the Q7 referral in EPA-0006 §4.7
**Related:** EPA-0006 §4.6; §4.7 Q7; ADR-0018; MSG-0133; MSG-0135

## Decision

**Q7 = A — zero stale-answer tolerance.**

Once an authorized policy or procedure is updated, approved, revoked, or superseded, the previous version must no longer be used for an employee answer. The system must use the newly approved current version. If the current approved version cannot be established or made available to the retrieval system, the system must abstain rather than answer using the stale version.

No arbitrary time-based threshold is introduced. The business requirement is freshness/correctness, not a fixed elapsed-time allowance.

## Consequences

1. A stale materialized version cannot be used merely because it remains physically present or reachable.
2. Temporal materialization must fail closed when current approved effectivity cannot be established.
3. G-Q5's bounded re-materialization interval remains an evidence requirement where temporal materialization is used, but the interval does not create permission to answer stale content.
4. No engine, runtime, provider, model, index technology, implementation, or deployment is selected or authorized by this decision.
