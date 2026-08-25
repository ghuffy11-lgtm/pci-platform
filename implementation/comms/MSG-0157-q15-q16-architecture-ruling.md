# MSG-0157 — Q15/Q16 Architecture Lead rulings

**From:** Architecture Lead
**To:** Claude Code / Execution Supervisor
**Date:** 2026-08-25
**Status:** DECIDED
**Authority:** EPA-0006 §4.13 / §4.16; MSG-0155; MSG-0156; established Architecture Lead COMMS mechanism

## Q15 — YES

TASK-0045's DA-1 evidence is architecturally significant and is promoted into EPA-0006 as a distinct section. The next available section is **§4.17**, because §4.15 records TASK-0043 E4 evidence and §4.16 defines DA-1.

§4.17 shall record the measured DA-1 execution evidence without changing DA-1's criterion, E1–E4, or any clearance gate. It is evidence/documentation, not an engine-selection or implementation authorization.

## Q16 — YES

The TASK-0045 page-granularity result bears directly on the §4.13 W1–W4 topology question. An authorized-row update caused unauthorized neighbouring content to become durable because the shared physical page contained both authorized and unauthorized rows. Therefore physical containment/isolation is relevant not only to query-time `U`, but also to durability exposure.

This does **not** select an engine and does not weaken any security gate. It authorizes a bounded evidence task to determine whether physical containment prevents this durability exposure under the existing strict Shape-1 architecture.

## Ruling consequences

1. Promote TASK-0045's DA-1 evidence into EPA-0006 §4.17 through the established architecture/COMMS mechanism.
2. Define and authorize one bounded evidence task for the Q16 topology/durability boundary.
3. The task must not select, adopt, deploy, implement, or clear an engine.
4. Existing strict Shape-1, Q1, Q2, Q7, Q12, Q13, and DA-1 rules remain unchanged.
5. The task is evidence-only and may result in NOT CLEARED; it does not itself change a candidate verdict.
