# MSG-0107 — Architecture Lead Authorization: Physical Projection Isolation Evaluation

**Status:** AUTHORIZED
**Authority:** Architecture Lead
**Related:** MSG-0105, MSG-0106, MSG-0104, EPA-0006, ADR-0020 AMD-01

## 1. Ruling

Physical projection isolation/partitioning is part of the strict Shape-1 requirement **where necessary to guarantee that the retrieval engine does not examine unauthorized content**.

Query-time predicates alone are insufficient unless execution evidence demonstrates that they genuinely prevent examination of unauthorized candidates.

## 2. Authorized task

Authorize the next bounded architecture/evidence task to evaluate physical-isolation strategies against the candidate retrieval architectures/classes identified by EPA-0006.

The task must:

1. Define the physical-isolation patterns relevant to the governed logical projection (for example, authorization-scope partitioning or equivalent physical candidate-set separation) without assuming a particular technology.
2. Evaluate each applicable EPA-0006 candidate class against the strict Shape-1 requirement.
3. Distinguish **logical projection** from its physical organization; do not reinterpret MSG-0101 §1(1) as requiring one physical index or one physical store.
4. Produce evidence showing whether an architecture can prevent unauthorized candidates from being examined before retrieval/search, rather than merely preventing their return or materialization.
5. Identify what execution evidence is required to clear a candidate and what cannot be established from documentation alone.
6. Preserve the existing MSG-0104 verdicts unless new evidence actually meets the strict criterion; do not relabel existing evidence.
7. Record disqualifiers and remaining evidence gaps explicitly.

## 3. Candidate scope

Evaluate the EPA-0006 classes as applicable, including the already observed relational/class-R shape, search/class-S, vector/class-V, kernel/class-K, lexical/class-L, and any other class that can materially satisfy the governed retrieval boundary.

The prior SQLite evidence remains **NOT CLEARED** and must be treated as evidence against the tested configuration, not as proof that all relational engines fail.

## 4. Boundaries

- **No engine, runtime, provider, model, index technology, or physical implementation is selected.**
- No product implementation or deployment is authorized.
- No real/confidential corpus is required or authorized for this evaluation; synthetic fixtures and execution evidence are preferred.
- Do not weaken ADR-0020/AMD-01.
- Do not amend ADR-0019.
- Do not create a new production architecture decision merely to record evaluation findings unless separately authorized.
- The resulting task must stop at evidence and recommendation/NOT CLEARED status; selection remains a later Architecture Lead decision.

## 5. Required output

Produce a numbered COMMS execution record with:

- candidate architecture/class;
- physical-isolation strategy evaluated;
- whether strict Shape-1 can be demonstrated;
- evidence/instrumentation used;
- limitations and unmeasured behavior;
- verdict: CLEARED / NOT CLEARED / DISQUALIFIED;
- explicit statement that no technology was selected or deployed.

Reconcile the task as the single READY task through the authoritative queue before execution. After execution, stop and report the evidence; do not self-authorize the next implementation or technology-selection step.
