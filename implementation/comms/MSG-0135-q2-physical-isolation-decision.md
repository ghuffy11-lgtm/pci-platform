# MSG-0135 — Q2 Physical Isolation Decision

**Status:** DECIDED / APPLIED
**Raised:** 2026-08-24
**Authority:** Architecture Lead decision, following the Q2 referral in EPA-0006 §4.7
**Related:** EPA-0006 §4.6 S4–S6; §4.7 Q2; MSG-0134

## Decision

**Q2 = B — physical isolation is required where necessary to satisfy strict Shape-1.**

Query-time authorization predicates alone are not sufficient when the retrieval engine must examine unauthorized candidates before applying those predicates. The governed projection must be physically organized/partitioned as necessary so that the engine does not examine unauthorized candidates.

The distinction between the **logical projection** and its **physical organization** is preserved. Multiple physical structures may constitute one logical projection where the existing architecture permits this.

## Consequences

1. Strict Shape-1 remains a pre-retrieval boundary, not a post-filtering requirement.
2. Physical projection isolation/partitioning is an architectural requirement where needed to prevent unauthorized examination.
3. Logical projection identity is not equated with a single physical structure.
4. No engine, runtime, provider, model, index technology, implementation, or deployment is selected or authorized by this decision.
5. Q7 remains open and is not decided by this record.
