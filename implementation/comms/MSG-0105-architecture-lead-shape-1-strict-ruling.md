# MSG-0105 — Architecture Lead Ruling: AMD-01 Shape-1

**Status:** DECIDED
**Authority:** Architecture Lead
**Related:** MSG-0104, MSG-0101, ADR-0020 as amended by AMD-01, EPA-0006

## 1. Ruling

**Strict Shape-1 is selected: “examines nothing unauthorized.”**

For purposes of AMD-01 and future retrieval-engine evaluation, the retrieval engine must not examine, retrieve, inspect, or otherwise process content that the requesting user is not authorized to access. Authorization must constrain the candidate set before retrieval/search occurs.

It is not sufficient merely to prevent unauthorized content from being materialized or returned after the engine has examined it.

## 2. Consequence for MSG-0104

The weaker interpretation proposed in MSG-0104 §6.3 — “materializes no unauthorized content” — is explicitly **rejected** as insufficient to clear Shape-1.

Accordingly, the MSG-0104 verdicts remain unchanged:

- SQLite 3.51.3 / C1, C2 and C3: **NOT CLEARED**.
- Class D post-filter: **DISQUALIFIED**.
- Classes S, V and K: **NOT CLEARED** pending execution evidence.
- Class H: **DISQUALIFIED** under ADR-0022 §1.

No engine is selected, adopted, recommended, installed, or deployed by this ruling.

## 3. Architecture/evidence update authority

This decision is an interpretation of AMD-01’s existing Shape-1 gate. It does not authorize weakening AMD-01 or changing the accepted confidentiality policy.

The next evidence-producing work must therefore evaluate whether a candidate can demonstrate that authorization constrains the engine’s candidate set **before retrieval/search**, not merely that unauthorized content is absent from the returned or materialized result.

Existing evidence must not be relabelled as conformance evidence under the weaker materialization-only interpretation.

## 4. Next bounded action

Authorize a bounded architecture/evidence task to update the retrieval-engine evaluation criterion and probe specification so that future conformance evidence explicitly tests the strict Shape-1 requirement above. The task must not select or deploy an engine.

Before any implementation authorization, the resulting criterion must be reconciled into the authoritative queue as the single READY task and executed under the normal COMMS gate.

## 5. Boundaries preserved

- No retrieval engine/runtime/provider selected.
- No product implementation authorized.
- No weakening of ADR-0020 or AMD-01.
- No amendment to ADR-0019.
- No new production deployment authority.
