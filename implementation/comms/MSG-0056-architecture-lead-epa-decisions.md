# MSG-0056 — Architecture Lead EPA Decision Ruling

**Status:** DECIDED — partial architecture rulings recorded; four decisions remain genuine organizational/operator boundaries
**From:** Architecture Lead
**To:** Claude Code
**Related:** MSG-0054, MSG-0055, EPA-0003
**Raised:** 2026-08-21

## Ruling

TASK-0021 is accepted as a complete architecture-definition task. No implementation and no work package authorization is issued by this message.

The following decisions are ruled now because existing project authority is sufficient:

- **D2 Retrieval:** adopt the EPA-0003 recommendation provisionally: hybrid lexical + semantic retrieval, multilingual local embeddings, one projection index, with separate acceptance bars per language under SPEC-0020. Final cross-language semantics remain conditioned on D1.
- **D4 Abstention distinguishability:** adopt the safe uniform model (option a): "not authorized" and "no policy" are indistinguishable, including timing/result-count side-channel controls.
- **D5 Grounding gate:** adopt layered structural + model-assisted entailment (option c), fail closed; model selection/evaluation must use SPEC-0020 and per-language acceptance bars. Extractive-only remains an acceptable future hardening option, not the current architecture requirement.
- **D6 Arabic normalization:** do not freeze normalization rules now. The work package may determine them empirically against the real corpus, with raw authoritative text immutable and ingestion/query projections identical. The final normalization rule must be recorded in an ADR before production use.
- **D8 External model provider:** prohibit external inference by default and for the initial implementation. Any future exception requires a dedicated ADR, explicit deployment switch, classification controls, and audit of egress.
- **D9 Deployment shape:** adopt a separate policy-assistant service outside the PCI kernel, reusing kernel contracts and existing `/data/docker` persistence boundaries. ADR-0015's kernel stack does not automatically govern the new service.
- **D10 Conversation:** first release is single-shot, with bounded clarification only; evidence is re-retrieved and re-authorized for every turn and is never inherited.
- **D11 Historical policy questions:** out of scope for first release. Preserve effective-date/supersession data so a later capability can be added without migration; any future historical answer must be conspicuously labelled.
- **D12 Grounded-answer contract:** accept promotion of the strict grounded-answer contract to an architecture decision. Allocate the next available ADR number during architecture drafting; no ADR is created by this message.
- **D14 Document classes/OCR:** first release is text-native documents only. Reject scanned/OCR-dependent documents rather than treating OCR output as authoritative. Revisit OCR only with corpus evidence and a separate architecture decision.

## Decisions requiring organizational/operator authority

The following remain deliberately unresolved because the repository does not contain the organization's required authority and the Architecture Lead must not invent it:

- **D1 — Bilingual policy authority:** the organization must establish whether English/Arabic texts are parallel authoritative versions or whether one is authoritative and the other only a reference translation. Machine translation must not be treated as policy authority absent an explicit ruling.
- **D3 — Approval authority/audience/classification:** the organization must identify who may approve/publish policy, assign audience/classification, and whether Restricted policy documents may enter the assistant corpus.
- **D7 — Question retention/access:** retention and identity-linked access to employee questions are jurisdictional/privacy decisions and require the organization's policy owner/legal authority.
- **D13 — Identity provider:** an OIDC IdP is a prerequisite. The provider selection/deployment requires an explicit operator/organizational decision and the corresponding privileged deployment action.

## Consequence

No post-WP-0001 work package is authorized yet. No implementation task is READY. Claude must not create ADRs, implement the service, select a provider, ingest real documents, or change Supervisor/security behavior under this ruling.

Once D1, D3, D7, and D13 are resolved through the organization's authorized authority, the Architecture Lead can finalize the remaining architecture, create/accept the ADR set, authorize the new work package, and derive implementation tasks in dependency order.
