# MSG-0092 — Architecture Lead Ruling on EPA-0005

**From:** Architecture Lead
**To:** Claude Code / Execution Supervisor
**Date:** 2026-08-22
**Status:** OPEN — action required
**Subject:** EPA-0005 ruling and next bounded architecture action

## Ruling

I have reviewed the actual `implementation/architecture/EPA-0005-assistant-stack-evaluation.md`, not a summary.

**EPA-0005 is ACCEPTED as the architecture evaluation record, with the following ruling.**

### 1. Record the three §9.1 constraints as settled architecture constraints

1. Retrieval must enforce authorization-relevant constraints **inside the retrieval operation**. Retrieve-then-filter or over-fetch-then-filter is not acceptable.
2. Capacity planning must account for **three local model workloads**: generation, multilingual embedding, and the entailment/grounding model.
3. **Conversation storage and audit storage remain separate**, with their distinct readers/retention, and Restricted policy passages must not enter ordinary application logs or telemetry.

These are accepted as consequences/constraints of the existing ADR set; they are not provider or technology selections.

### 2. Runtime seam decision

**Choose EPA-0005 Approach C: two services along the C2/C6 seam.**

Use a governed application layer for the authorization-critical application/API/orchestration path and a separate document/inference worker behind an explicit contract.

The worker is not an authorization authority and must not make authorization decisions. Authorization remains in the governed application layer before retrieval. The existing SPEC-0008 boundary is to be preserved.

Rationale: Approach C best preserves the already-verified security evidence in the governed layer while allowing the document/model workload to use the ecosystem appropriate to extraction and local model serving. The additional operational complexity is accepted as the price of keeping the security-critical surface concentrated and the C2/C6 technology replaceable. This is a stack-shape decision, not a selection of a particular runtime, framework, model, or provider.

### 3. Stack ADR decision

**Do not create a new generic stack ADR.**

EPA-0005 is the evaluation record and is now accepted as the ruling record for the runtime seam. Do not manufacture an ADR merely to restate that the remaining technology selections are open.

However, the pre-filter requirement in §9.1(1) is important enough to make its enforcement unambiguous. **Authorize a narrow follow-on governance task to draft the minimum clarification/amendment to ADR-0020, without changing its substantive policy**, specifically making the existing §3/§4 pre-constrained retrieval requirement explicit as an engine-selection/gate criterion. No retrieval engine is selected by that task.

### 4. What remains deliberately OPEN

Do not select or authorize a specific:

- application framework/runtime,
- retrieval/index engine,
- extraction toolchain,
- embedding model,
- generation model,
- entailment model,
- local serving runtime,
- frontend framework, or
- identity provider.

Arabic normalization rules remain deferred exactly as ADR-0019 requires. The Arabic n=1 evidence is sufficient for bounded architecture testing, but it does not become production corpus evidence.

### 5. Next action

Create/reconcile **one bounded architecture-governance task** as the single READY task for the narrow ADR-0020 clarification described above. Execute it through the normal queue/supervisor path.

The task must:

- inspect ADR-0020 §§3–4;
- draft the minimum clarification only;
- preserve all accepted semantics;
- make no provider/engine selection;
- leave ADR-0017…ADR-0022 otherwise untouched;
- produce the proposed amendment for Architecture Lead review; and
- stop before applying the amendment unless a subsequent explicit authorization permits acceptance.

Do not start T-A, T-B, T-D, T-E, T-0, model selection, engine selection, or production implementation from this message.

**This message is the Architecture Lead's ruling required by EPA-0005.**
