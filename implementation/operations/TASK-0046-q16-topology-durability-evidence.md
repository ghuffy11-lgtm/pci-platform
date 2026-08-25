# TASK-0046 — bounded Q16 topology/durability evidence

**Priority:** 1
**Status:** AUTHORIZED — pending authoritative queue reconciliation
**Owner:** Claude Code
**Authority:** MSG-0157 (Q15/Q16 DECIDED); EPA-0006 §4.13 and §4.16; existing strict Shape-1 architecture
**Type:** evidence / measurement only

## Objective

Determine whether the physical containment/isolation structures already permitted by the strict Shape-1 architecture prevent the TASK-0045 page-granularity durability exposure: an authorized-row update causing unauthorized neighbouring content to become durable because authorized and unauthorized rows share physical pages.

This task answers the Q16 topology boundary only. It does not select, compare for adoption, clear, deploy, or implement an engine.

## Scope

Measure a bounded comparison using the existing reachable test subject and synthetic fixture:

1. a shared physical projection containing authorized and unauthorized neighbours; and
2. a physically isolated/routed organization in which the authorized subject's reachable structure contains only authorized rows.

Exercise the same request-induced update/access-accounting operation against each structure and inspect the applicable engine-managed durability artefact(s) using the established DA-4 provenance method.

The test must distinguish ingest-created content from request-induced content. If provenance cannot be separated, apply DA-6 / NOT CLEARED rather than infer a pass.

## Success criteria

1. The shared-layout baseline reproduces or otherwise directly measures the page-co-residency mechanism described by TASK-0045, without relying on presence alone.
2. The physically isolated layout is measured under the same request-induced write shape.
3. Provenance is separated; otherwise the result is NOT CLEARED.
4. Results are reported per physical organization and per applicable durability artefact, using existing DA-5 vocabulary.
5. A negative control that must produce a DA-1 finding fires; otherwise the run is INVALID.
6. The result states whether physical containment prevents the observed durability exposure for the tested configuration, without generalizing to an engine class.
7. No E1–E4, G-Q4…G-Q7, S1–S11, DA-1…DA-7, or other clearance gate is changed.
8. No engine is selected, adopted, deployed, or implemented; no candidate is cleared.
9. COMMS, status, queue, checkpoint, harness/output and verification are reconciled from `main`.

## Constraints

- Synthetic fixtures only; no real/confidential corpus.
- Reuse existing harnesses where suitable; do not silently re-run prior evidence as new evidence.
- No installation or host configuration changes.
- No numeric threshold or benchmark.
- Do not broaden into engine evaluation or selection.
- Stop on any new operator-only/environment permission boundary and record it rather than routing around it.
- Re-check `origin/main` before the execution push.

## Verification

Before completion, verify from `main`:

- non-zero measurement count;
- negative control fired and run validity recorded;
- shared versus isolated physical organization results;
- provenance/DA-4 handling;
- no candidate/gate verdict changes;
- clean working tree after commit;
- exact files changed and commit identity.

## Execution boundary

This task is not executable until it appears as the single **READY** task in the authoritative `implementation/operations/CLAUDE-TASKS.md` queue. Only then may the Supervisor/Claude execute it.
