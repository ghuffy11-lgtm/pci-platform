# TASK-0048 — Bounded N6 measurement

**Authority:** MSG-0161 (Q20 = YES); MSG-0160 (Q19 = YES); MSG-0158; EPA-0006 §4.18.
**Type:** Bounded evidence / measurement task.
**Status:** AUTHORIZED — not READY until reconciled into the authoritative queue as the single READY task.

## Objective

Measure the N6 byte-level durability containment requirement defined in EPA-0006 §4.18 without selecting, adopting, deploying, implementing, or clearing an engine.

## Topologies and scope

Test the four physical organizations established by MSG-0158:

- **L1 — Shared projection:** one structure with both authorization classes interleaved. This is the shared baseline and mechanism-control arm.
- **L2 — Isolated structures, one store:** separate b-trees in one store.
- **L3 — Isolated stores:** one store per partition, the routed Shape-1 W2/W3 organization bounded by execution context in W4.
- **L4 — Isolated stores after re-partition:** L3 after the store previously held the other partition and was re-materialised; this is the history-sensitive N6 arm.

For each applicable topology, measure both existing request-induced write shapes from MSG-0158 — **W-A access accounting** and **W-B cache writeback** — and both journal modes used there. The same one-subject/build boundary applies; do not generalize to an engine class.

The task must measure request-induced durability of unauthorized bytes and distinguish it from pre-existing residue whose provenance is the topology transition itself. Prior TASK-0046 results are evidence basis and mechanism guidance, not new N6 measurements.

## Required outcomes

1. Produce per-topology, per-journal-mode, per-write-shape evidence against N6.1, N6.2 and N6.3 where the instrument can establish the relevant mechanism.
2. Keep negative controls structurally separate from subject findings; if required controls do not fire, the run is INVALID.
3. Establish provenance of any observed unauthorized bytes before assigning an N6 finding.
4. Apply fail-closed treatment where the relevant durability artefact or residue cannot be inspected.
5. State whether each tested topology/configuration satisfies or violates the measured N6 requirement, without generalizing beyond the measured subject/build.
6. Preserve N1 and all existing security gates and candidate verdicts.
7. Record COMMS, status, queue, checkpoint, harness/output and verification from main.

## Constraints

- No engine selection, adoption, deployment, implementation, or clearance.
- No change to N1–N5, DA-1…DA-7, E1–E4, strict Shape-1, or any clearance gate.
- No candidate verdict changes.
- Do not silently re-run TASK-0046 and report its output as new N6 evidence.
- Stop at any environment/operator boundary rather than routing around it.
- Stop if origin/main moves mid-run and reconcile before continuing.

## Execution boundary

This is an evidence-only task. It is not executable until it appears as the single READY task in the authoritative `implementation/operations/CLAUDE-TASKS.md` queue.
