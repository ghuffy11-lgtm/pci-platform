# MSG-0134 — Q1 Strict Examination Decision

**Status:** DECIDED / APPLIED
**Raised:** 2026-08-24
**Authority:** Architecture Lead decision, following the Q1 referral in EPA-0006 §4.7
**Related:** EPA-0006 §4.6 S4–S6; MSG-0105; MSG-0129; MSG-0132

## Decision

**Q1 = A — strict interpretation.**

Reading an unauthorized index entry, key, or metadata counts as **examination of unauthorized material**, even when the underlying policy/document passage is never accessed.

The existing strict **U1–U5** interpretation is retained. In particular, U1 remains in scope: reading an index entry or key during traversal counts as examination. No Shape-1 security boundary is weakened to permit examination of unauthorized metadata.

## Consequences

1. EPA-0006 §4.6 S4's current U1–U5 definition remains authoritative.
2. The fail-closed default previously attached to Q1 is now the Architecture Lead ruling rather than a temporary unresolved default.
3. A candidate cannot satisfy strict Shape-1/E2 by arguing that unauthorized metadata was harmless because no passage content was touched.
4. No engine, runtime, provider, model, index technology, implementation, or deployment is selected or authorized by this decision.
5. Q2 and Q7 remain open and are not decided by this record.

## Verification requirement

The authoritative EPA-0006 copy and this COMMS record must be verified from `main` before Q2 is presented as the next Architecture Lead decision.
