# MSG-0110 — Architecture Lead Rulings: TASK-0035 Referrals

**Status:** DECIDED
**Authority:** Architecture Lead
**Related:** MSG-0109, MSG-0107b, MSG-0105, ADR-0020 AMD-01, EPA-0006

## 1. Verified source

The three referrals are the actual Q4, Q5 and Q6 in MSG-0109. They are not inferred from the TASK-0035 summary.

## 2. Q4 — Does routing to a partition examine anything?

**Ruling: ACCEPT the strict fail-closed default.**

Partition routing must be computed from the requesting subject's own entitlements. It must not discover partitions by enumerating a catalogue of structures whose identifiers or metadata may encode authorization attributes belonging to other subjects.

For strict Shape-1, partition selection itself must not become an unauthorized examination step. The logical/physical distinction remains unchanged: this does not require one physical index or store.

## 3. Q5 — Temporally materialised structures

**Ruling: ACCEPT the strict fail-closed default as a clearance prerequisite.**

A temporally materialised structure is NOT CLEARED unless both conditions are demonstrated:

1. its re-materialisation interval is bounded in accordance with the already-accepted staleness discipline in ADR-0020 §1; and
2. the ADR-0020 §3.2 post-retrieval re-check against the kernel is demonstrated to run.

The TASK-0035 staleness evidence is decisive against clearing a stale materialisation: after the clock moved, the design examined unauthorized rows and returned 5 of 5 unauthorized rows. No relaxation or new tolerance is authorized. This ruling does not invent a new numeric staleness threshold; the existing ADR-0020 threshold remains authoritative.

## 4. Q6 — Structural confinement as E3 evidence

**Ruling: REJECT the proposed default that construction alone can satisfy E3.**

Structural confinement alone is not sufficient E3 evidence for an opaque/unmeasurable stage. It may contribute to the evidence package only when the candidate provides demonstrable evidence that the stage genuinely cannot reach outside the confined structure.

Documentation describing an intended partition boundary is not execution evidence of the engine's actual traversal boundary. Until such evidence exists, the candidate remains NOT CLEARED.

## 5. Effect on existing evidence

- TASK-0035's nine MSG-0104 verdicts remain unchanged.
- SQLite/class-R configurations remain NOT CLEARED.
- No candidate is cleared by this ruling.
- No engine, runtime, provider, model, index technology, or physical implementation is selected.
- No product implementation or deployment is authorized.

## 6. Next bounded action

Authorize TASK-0036: update the EPA-0006 retrieval-engine evidence/probe specification to encode Q4, Q5 and Q6 as explicit strict Shape-1 clearance requirements and evidence gates, without changing accepted ADR-0020 or selecting any technology.

TASK-0036 must:
- make computed-only partition routing testable;
- make bounded temporal re-materialisation plus demonstrated kernel re-check a prerequisite for clearing temporal materialisation;
- require execution evidence for opaque-stage confinement rather than construction-only claims;
- preserve all existing verdicts;
- stop at the evidence-instrument update and COMMS execution record.

The task may be reconciled as the single READY task and executed under the normal COMMS gate. No implementation or engine-selection authority is granted by this record.
