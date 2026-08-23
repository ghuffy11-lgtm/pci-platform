# MSG-0101 — Architecture Lead Ruling: MSG-0100 Referrals and Next Retrieval Conformance Probe

**Status:** AUTHORIZED
**Date:** 2026-08-23
**Authority:** Architecture Lead
**Related:** MSG-0100, EPA-0006, ADR-0020 as amended by AMD-01, ADR-0018, ADR-0019, MSG-0092, MSG-0095

## 1. Ruling summary

MSG-0100 has been read in full. Its five referrals are real and verified. None is a blocker.

The Lead rules as follows:

1. **One projection index:** interpret ADR-0020 §7's "one projection index" as one **logical projection**. It does not, by itself, require one physical engine. A lexical retriever paired with a semantic retriever may be evaluated only if both operate over the same governed projection and **each retriever independently satisfies AMD-01**. The fusion layer must never be the place where authorization is resolved. This interpretation does not select an engine or authorize implementation.

2. **SUPERSEDED chunks:** do not settle this as a new architecture decision now. Treat exclusion from the projection as the safer implementation shape because it removes a query control surface, but preserve ADR-0018's audit/reconstruction semantics in the kernel. The next task must not modify the accepted ADR on this point.

3. **Engine conformance probe:** **AUTHORIZE a bounded probe.** This is the only major evidence item in EPA-0006 that is not blocked on the organization or operator. It may name concrete candidate engines as **test subjects only**; naming a candidate for evaluation is not adoption or selection. The probe must apply EPA-0006 §4.4's tiered evidence and must not clear an engine without execution evidence sufficient to distinguish Shape 1 from Shape 3.

4. **EPA-0006 §12.2 implementation obligations:** accept them as implementation-planning constraints already implied by the accepted ADR set; **no new ADR is authorized by this ruling**. In particular, authorization context must be required at the retrieval port and worker seam, index-assigned identifiers must not be citation anchors, and the audit store must not be reused for expiring conversation content. These are not technology selections.

5. **Corpus action:** remains the organization's responsibility. No new corpus request or survey task is authorized by this ruling.

## 2. Authorized next task

**TASK-0033 — Bounded retrieval-engine conformance probe.**

Purpose: produce execution evidence for candidate retrieval-engine implementations against ADR-0020 + AMD-01, sufficient to determine whether each tested candidate can satisfy the pre-constrained retrieval requirement without Shape-3 over-fetch-then-discard behavior.

Scope:

- Select a small, explicit set of candidate engines **for evaluation only**, with the selection rationale recorded and no adoption implied.
- Derive the complete authorization predicate from ADR-0020/ADR-0018 and use the same predicate for every candidate.
- Run EPA-0006 §4.4's three evidence tiers where supported:
  - Tier 1: inspect the actual query shape.
  - Tier 2: inspect execution evidence sufficient to distinguish candidate-set restriction from internal over-fetch/rejection.
  - Tier 3: use plan/counter/instrumentation evidence where available.
- Treat inability to obtain sufficient execution evidence as **NOT CLEARED**, not as conformance.
- Test highly selective authorization predicates, because EPA-0006 identifies that as the security-relevant case for optimizer/strategy switching.
- For relational candidates, verify the actual query plan rather than relying on SQL text alone.
- Record whether strategy can be pinned; a strategy that can switch into Shape 3 under restrictive predicates is disqualified for the relevant candidate.
- Do not select, adopt, deploy, or integrate any engine.
- Do not modify accepted ADRs.
- Do not modify ADR-0019 or infer Arabic normalization rules.
- Do not authorize T-C/T-D/T-E/T-F or any other product implementation.
- Do not invent benchmark, latency, capacity, recall, or throughput figures. Report only measurements actually produced by the bounded probe, with method and evidence.

## 3. Acceptance criteria

1. Candidate list is explicitly labelled evaluation-only; no candidate is adopted or selected.
2. The full ADR-0020 authorization predicate used in each probe is recorded.
3. Tier-1 query evidence is captured for each candidate.
4. Tier-2/3 execution evidence is captured where the candidate exposes it; lack of sufficient evidence is recorded as NOT CLEARED.
5. Shape-1 vs Shape-3 is explicitly distinguished; post-filter and over-fetch-then-discard remain disqualified.
6. Any strategy-switching behaviour under highly selective authorization is tested or explicitly left NOT CLEARED because evidence is unavailable.
7. No accepted ADR is modified and no implementation task is authorized.
8. COMMS, queue, and status are reconciled; stop after reporting the result if product-level selection would otherwise be required.

## 4. Stop conditions

Stop immediately if execution would require:

- selecting or adopting a production engine;
- modifying an accepted ADR;
- entering a real or confidential corpus;
- provisioning an implementation runtime or production service;
- inventing or substituting unmeasured evidence.

The result may narrow the engine shortlist, disqualify candidates, or leave selection open. It must not convert evaluation evidence into an implementation authorization.

## 5. Next action

Claude Code may reconcile **TASK-0033 as the single READY task** through the normal COMMS/supervisor path and execute it. No second READY task is permitted concurrently.
