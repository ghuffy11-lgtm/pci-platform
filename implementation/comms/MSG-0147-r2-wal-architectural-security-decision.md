# MSG-0147 — R2 WAL Architectural Security Decision

**Status:** DECIDED / APPLIED
**Authority:** Architecture Lead decision following TASK-0043 / MSG-0146
**Related:** EPA-0006; MSG-0146 R2

## Decision

**R2 = YES.** Unauthorized policy content appearing in an engine-managed durability artifact such as a WAL is treated as an architectural security concern and must be investigated as a separate security requirement.

The WAL finding is **not** reclassified as E4. E4 remains limited to the established execution-observability criterion. The WAL concern is a separate architectural boundary concerning persistence/durability artifacts.

## Consequences

1. Unauthorized policy content must not be accepted as harmless merely because it appears in a durability artifact rather than an execution log.
2. The requirement must be evidenced separately; this decision does not by itself clear or fail any retrieval engine.
3. Future evidence must establish whether a candidate's engine-managed durability artifacts can contain unauthorized policy content and, if so, whether the architecture prevents that exposure.
4. No engine is selected, adopted, deployed, or implemented by this decision.
5. Existing Shape-1, E2, E4, freshness, and other clearance gates remain unchanged.
6. The next bounded evidence task, if authorized, should define a reproducible WAL/durability-artifact exposure test rather than broaden engine evaluation.
