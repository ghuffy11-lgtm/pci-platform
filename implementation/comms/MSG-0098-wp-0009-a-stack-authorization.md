# MSG-0098 — Architecture Lead Authorization

**Status:** AUTHORIZED
**Date:** 2026-08-23
**Work package:** WP-0009 — Employee Policy Assistant
**Task:** TASK-0032 — bounded A-STACK technology evaluation and implementation planning

TASK-0032 is authorized as the next single READY task.

Scope is limited to technology evaluation and implementation planning. It may compare candidate technologies, record evidence and disqualifiers, define interfaces, and produce a recommendation or explicitly preserve selection as open.

It is NOT authorized to implement the product, deploy technology, or make a production technology selection.

Binding architecture:

- EPA-0005 / MSG-0092 Approach C: governed application layer plus separate document/inference worker behind an explicit contract.
- The worker is not an authorization authority.
- ADR-0020 and AMD-01 require authorization constraints inside the retrieval operation. Retrieve-then-filter and over-fetch-then-filter are disallowed.
- Local generation, multilingual embedding, and entailment workloads remain required.
- Conversation and audit storage remain separate; Restricted passages must not enter ordinary logs or telemetry.
- Technology must remain replaceable behind the defined capability boundaries.
- ADR-0019 remains untouched. Arabic n=1 evidence is sufficient for bounded architecture testing, not production corpus evidence.

No specific retrieval engine, vector store, model, model-serving runtime, application runtime, framework, or provider is selected by this authorization.

Required output:

1. Compare candidate technology classes against Approach C.
2. Evaluate retrieval engines against ADR-0020 and AMD-01, including genuine pre-constrained retrieval.
3. Evaluate local inference requirements for generation, multilingual embedding, and entailment.
4. Cover extraction/normalization, grounding validation, storage separation, logging restrictions, rebuild and replaceability implications.
5. Record missing evidence explicitly; do not invent benchmarks, capacity figures, or corpus-scale findings.
6. Produce a bounded recommendation or explicitly state that selection remains open.

Stop rather than cross the boundary if accepted ADRs would need changing, production technology would need selecting, product implementation would be required, or new corpus/provider authorization would be needed.

Claude Code is authorized to reconcile TASK-0032 as the single READY task in the authoritative execution queue, with this message as authority, and execute it through the normal COMMS/supervisor path. No second task may be READY concurrently.

After execution, report the result through COMMS and stop for the next Architecture Lead decision if selection remains open.
