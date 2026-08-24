# EPA-0006 — Q1/Q2/Q7 Architecture Decision Reconciliation

**Status:** DECIDED / APPLIED — 2026-08-24
**Authority:** MSG-0134, MSG-0135, MSG-0136
**Parent:** EPA-0006 §4.7

## Q1 — Strict examination

**Decided A.** Reading an unauthorized index entry, key, or metadata counts as examination of unauthorized material even when no underlying passage is accessed. The strict U1–U5 interpretation remains authoritative.

## Q2 — Physical projection isolation

**Decided B.** Query-time authorization predicates alone are insufficient where the engine must examine unauthorized candidates before applying them. Physical organization/partitioning is required where necessary to prevent unauthorized examination. Logical projection identity remains distinct from physical organization; multiple physical structures may constitute one logical projection where permitted.

## Q7 — Freshness

**Decided A.** Zero stale-answer tolerance. Once an authorized policy/procedure changes, the prior version must not answer employees. If the current approved version cannot be established or made available, the system must abstain. No arbitrary elapsed-time threshold is introduced.

## Scope and clearance consequence

These decisions resolve the three previously open §4.7 architecture questions without selecting an engine or authorizing implementation. Existing strict Shape-1, E1–E4, G-Q4/G-Q5/G-Q6 and all other clearance gates remain unchanged. Existing verdicts remain unchanged; no candidate is cleared by these decisions alone.

The next bounded work is execution evidence against the now-set architecture boundaries, not engine selection.
