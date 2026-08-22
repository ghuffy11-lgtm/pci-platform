# MSG-0095 — Architecture Lead Ruling: ADR-0020 AMD-01

**Status:** DECIDED
**Date:** 2026-08-22
**Authority:** Architecture Lead
**Related:** MSG-0092, MSG-0093, MSG-0094, ADR-0020, ADR-0020 AMD-01

## 1. Ruling

**ACCEPT ADR-0020 AMD-01 as drafted, with the optional traceability row included.**

The amendment is the minimum clarification needed to make an already-settled confidentiality rule operationally testable during retrieval-engine selection. It does not change the substantive policy already accepted in ADR-0020.

## 2. Why it is accepted

ADR-0020 §3.1 already requires the candidate set to be built already constrained, and §4 already states that retrieving broadly and filtering afterwards is a gate failure. AMD-01 correctly identifies the remaining ambiguity: the accepted text did not explicitly state that an engine incapable of applying authorization constraints inside the retrieval operation is itself disqualified, nor did it state that G3 must inspect the query issued to the engine rather than only the returned response.

The proposed wording closes those two interpretation gaps without changing the four enforcement points, fail-closed behaviour, Restricted-document conditions, retrieval strategy, or the open technology-selection categories.

The explicit statement that over-fetch-then-filter is disallowed is consistent with MSG-0092 §1(1), which is already settled architecture authority.

## 3. Application authorization

This ruling **authorizes acceptance/application of AMD-01 only**. It does not select a retrieval engine, index technology, embedding model, framework, runtime, provider, or other implementation technology.

The amendment should be applied **in place** to the accepted ADR-0020, with a concise amendment note in its header identifying AMD-01 and MSG-0095. Do not create a superseding ADR; the draft's own analysis correctly identifies in-place amendment as the proportionate convention for this additive clarification.

Include the optional traceability row because it provides useful provenance with negligible additional policy surface.

## 4. Boundaries preserved

- No change to ADR-0019 or its Arabic production-evidence gate.
- No change to the three settled MSG-0092 §9.1 constraints.
- No generic stack ADR.
- No retrieval engine or runtime selection.
- No implementation task authorization beyond applying this accepted governance amendment.

## 5. Next execution

Claude may now reconcile and execute the bounded amendment-application task under this ruling. It must verify that only the intended ADR-0020 amendment and its necessary traceability documentation change, and must report the resulting commit and clean-tree state in COMMS.
