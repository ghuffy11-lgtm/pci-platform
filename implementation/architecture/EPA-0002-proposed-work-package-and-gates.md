# EPA-0002 — Employee Policy Assistant: Proposed Work Package, Sequence, and Gates

**Status:** **PROPOSED — NOT AUTHORIZED.** MSG-0053 C7 rules that no new product work package is
authorized; MSG-0054 authorizes architecture definition only and states that a work package may be
created "only after the architecture boundary is accepted."
**Produced by:** TASK-0021 | **Authority for the task:** MSG-0054
**Date:** 2026-08-21
**Companions:** [`EPA-0001`](EPA-0001-employee-policy-assistant-architecture.md) · [`EPA-0003`](EPA-0003-required-decisions.md) (**fourteen open decisions — this document is not executable until they are answered**)

> **Superseded in substance 2026-08-21 by [`EPA-0004`](EPA-0004-employee-policy-assistant-work-package-definition.md) (TASK-0022, MSG-0059).**
> All fourteen decisions have since been ruled (MSG-0056a/b) and the four reconciliation findings with
> them (MSG-0058). This record was written **before** any of that and is conditional throughout; it is
> retained **unchanged** as the pre-ruling proposal. Where the two differ, EPA-0004 is the later record
> and its §12 tabulates the six differences with the ruling behind each — most consequentially G7,
> which here tested bilingual *parity* and there tests *cross-language grounding*, fail-closed.
> **Do not read this document as current.** Its own §5 ordering observation (T-D before T-E) remains
> unruled and is carried forward in EPA-0004 §11.3 rather than dropped.

---

## 0. Standing of this document

This is what a work package **would** look like if the architecture in EPA-0001 were accepted and the
decisions in EPA-0003 were answered. It is written so the lead can judge the shape and size of the
work before committing to it.

**It authorizes nothing.** No task here may be marked READY, reconciled into
`implementation/operations/CLAUDE-TASKS.md`, or started. TASK-0021's forbidden actions include "no
authorization of downstream implementation tasks", and this document is deliberately written in the
conditional to keep that boundary legible to a future session reading it out of context.

**A numbering caution, flagged rather than resolved.** The obvious identifier for this work package is
WP-0002 — but `docs/program/work-packages.md` (PLAN-WP-0001) already lists a WP-0002, "Repository and
Engineering Platform", and lists WP-0001 as "Knowledge Foundation" while the delivered
`docs/program/work-packages/WP-0001-kernel-foundation.md` is "PCI Kernel Foundation". **The planning
register and the delivered work-package directory already disagree about what WP-0001 is**, so
allocating WP-0002 here would compound an existing collision rather than create a new one. This
record therefore allocates **no number** and refers to "the assistant work package" throughout.
Allocation is the lead's. *(This is an observation, not a request for a task — it is recorded here
because it was found while doing authorized work, per the discoveries rule.)*

---

## 1. Scope and non-scope

Following the required fields of `docs/engineering/implementation-work-package-standard.md`.

### Objective

Deliver a governed, employee-facing capability that answers questions about organizational policy and
procedure, in English and Arabic, **exclusively** from approved document versions the asker is
authorized to see, with verifiable citations and fail-closed abstention.

### Source authority

Constitution · `docs/architecture/platform-kernel.md` · `context-assembly.md` · `knowledge-fabric.md` ·
`data-architecture.md` · ADR-0003, ADR-0005, ADR-0007, ADR-0009, ADR-0013, ADR-0016 ·
SPEC-0004, SPEC-0005, SPEC-0006, SPEC-0008, SPEC-0010, SPEC-0011, SPEC-0013, SPEC-0014, SPEC-0015,
SPEC-0020, SPEC-0022, SPEC-0026, SPEC-0031 · `docs/security/ai-security.md`, `data-classification.md`,
`rbac-abac-model.md` · plus whichever of the EPA-0003 ADRs the lead accepts.

### In scope

1. Document authority service: lifecycle, versions, effectivity, supersession, ownership, approval records.
2. Ingestion: extraction, normalization, classification, validation against approval, chunking, provenance.
3. Retrieval index as a rebuildable projection over published, effective, in-scope content.
4. Retrieval-time authorization at all four enforcement points (EPA-0001 §7.1).
5. Grounded QA: evidence selection, context assembly, generation, grounding gate, abstention taxonomy.
6. Bilingual behaviour per the D1 ruling, with per-language acceptance gates.
7. Audit and retention for lifecycle, retrieval, answers, **abstentions**, citation opens, and admin actions.
8. Employee frontend within the constraints of EPA-0001 §9.
9. Model-runtime integration through SPEC-0008 abstraction, local by default.
10. Tests at every tier, including the adversarial security suite of §3 G6.

### Non-scope

- Any change to accepted WP-0001 architecture, the `/data` boundary, or an existing fail-closed control.
- **Any mutating action or tool use.** The assistant answers; it does not act (EPA-0001 §4.6).
- Domain capabilities beyond policy/procedure documents (network, helpdesk, facilities, biomedical).
- Historical/temporal questions, unless D11 rules them in.
- Multi-turn conversation, unless D10 rules it in.
- OCR, unless D14 rules it in.
- Identity provider **implementation** — PCI integrates one, it does not build one (ADR-0007).
- Multi-tenant SaaS operation; SPEC-0010's requirement is that the model must not *prevent* it.

---

## 2. Data contracts and interfaces

Contract level only — no schema, no migration, no code. Field lists are the minimum the architecture
requires, not a complete design.

### 2.1 Core objects

| Object | Required attributes |
|---|---|
| **PolicyDocument** | stable id; title (per language); owning role; document class; organizational scope; current published version ref; lifecycle summary |
| **DocumentVersion** | stable id; parent document; version label; lifecycle state; `effective_from` / `effective_to`; authoritative language(s) (D1); classification; audience; approval record ref; source-file ref; `supersedes` / `superseded_by` |
| **SourceFile** | content hash; original filename; media type; acquisition time; acquiring identity; ingestion run ref |
| **Chunk** | id; version ref; section path; character offsets; language; inherited classification and audience; index projection state |
| **ApprovalRecord** | approver identity; approving role; approval time; policy version applied; multi-party approvals where required (SPEC-0022) |
| **IngestionRun** | id; pipeline version; source files; outcome; chunk counts; errors |

**Invariant:** a Chunk's authorization constraints are exactly its DocumentVersion's — never weaker
(EPA-0001 §4.4).

### 2.2 Answer response contract

The API returns exactly one of two shapes. There is no partial or hedged third shape — that absence is
the contract:

```text
ANSWER {
  answer_text            (in the asker's language)
  claims[]               { text, citations[] }        -- every claim carries >= 1 citation
  citations[]            { document_id, version_id, version_label, section_path,
                           effective_from, effective_to, language, resolve_url }
  answer_language
  grounding              { gate_result, mechanism_version }
  model                  { model_id, runtime_id }
  correlation_id
}

ABSTENTION {
  abstention_class       (A1 | A2 | A3 | A4 | A5 | A6 | A7)
  reason_text            (in the asker's language; contains NO policy claim)
  next_step              (owner to contact, clarifying question, or nothing)
  correlation_id
}
```

Two contract rules follow directly and must be testable: **a claim with an empty `citations[]` is a
protocol violation, not a lower-confidence answer**; and an ABSTENTION carrying policy content is
likewise a violation (EPA-0001 §5.1).

### 2.3 Service interfaces

| Interface | Purpose | Notes |
|---|---|---|
| Document authority API | Submit, review, approve, publish, supersede, withdraw | Every transition audited; approval per D3 |
| Ingestion API / trigger | Ingest an approved source file; re-index | Rejects content with no valid approval record |
| Ask API | Question in, ANSWER or ABSTENTION out | Authorization before retrieval; no tool surface |
| Citation resolve API | Return a cited passage in context | **Re-authorizes on every call** — a citation is not a capability |
| Admin API | Classification, audience, ownership changes | Audited administrative actions |

All are consumed by the frontend, which enforces nothing (EPA-0001 §9).

---

## 3. Acceptance gates

Each gate is a *demonstration*, not a claim. Per CLAUDE.md Rule 10, evidence must be recorded where it
can be re-read, tests must report a non-zero count, and integration claims require the real
integration environment — a passing mocked suite is evidence about the double, not the system.

**Every gate that involves a question or a document runs twice, once per language, and both runs must
pass** (MSG-0054's explicit language acceptance gates).

| Gate | Demonstrates | Fails if |
|---|---|---|
| **G1 — Document authority** | A version moves DRAFT → PUBLISHED only through an authorized approval; supersession chains traverse; effectivity is evaluated at answer time | A draft is ever retrievable; two versions of one document are simultaneously effective |
| **G2 — Ingestion and provenance** | Every chunk resolves to a version, a source hash, and an ingestion run; re-ingestion creates a new version rather than mutating one | Any indexed chunk lacks a valid approval record |
| **G3 — Retrieval authorization** | Unauthorized content is not a candidate, is re-checked on hit, is denied by RLS, and is denied again at citation resolve | Any one of the four points is the *only* thing preventing access |
| **G4 — Index is a projection** | A full rebuild from the kernel changes no answer; a stale index triggers abstention rather than a stale answer | A rebuild changes what the system says |
| **G5 — Grounded answer contract** | On a curated question set: every claim cited; no uncited claim emitted; abstention on unsupported questions; **zero answers from parametric knowledge** | Any answer contains a policy claim absent from cited evidence |
| **G6 — Adversarial security suite** | T1–T11 exercised as attacks: injected instructions in approved documents; probing questions; forged/unresolvable citations; poisoned index entries; cross-scope attempts | Any injected instruction changes behaviour; any probe distinguishes scopes contrary to the D4 ruling |
| **G7 — Bilingual parity** | The same question in English and Arabic retrieves the same governing policy and yields equivalent answers; citations resolve to the authoritative text per D1; RTL rendering with embedded LTR is correct | Answers differ by question language; a translation is cited as policy |
| **G8 — Abstention behaviour** | Each class A1–A7 is producible and correctly classified; every degraded path (index, runtime, gate, authorization) abstains rather than answers | Any degraded path produces an answer |
| **G9 — Audit reconstruction** | A reviewer reconstructs a complete question → authorization → retrieval → evidence → generation → gate → answer chain from audit records alone; **abstentions reconstruct equally**; no secrets present | Reconstruction requires application logs or model memory (SPEC-0006) |
| **G10 — Offline operation** | Full capability with the host network-isolated | Any core path requires Internet |
| **G11 — Boundary integrity** | All persistent state under `/data/docker`; no WP-0001 control weakened; kernel contracts unchanged | Any artifact outside `/data`; any accepted control modified |

**G5 and G6 are the gates that decide whether this capability is safe to deploy.** The others are
necessary; those two are the reason the architecture exists.

**Test tiers**, following WP-0001's proven structure: unit; contract (the §2.2 response contract,
enforced as a protocol); integration against real PostgreSQL, a real index, and a real inference
runtime; adversarial security (G6); bilingual (G7). WP-0001's precedent — 229 tests across three
tiers, all counts non-zero, run on the target platform — is the standard to match.

---

## 4. Prerequisites — checked before, not during

| # | Prerequisite | State today |
|---|---|---|
| **PR1** | Architecture accepted; EPA-0003 decisions answered | **NOT MET** — fourteen open |
| **PR2** | Work package authorized by the lead | **NOT MET** — MSG-0053 C7, MSG-0054 |
| **PR3** | **OIDC identity provider deployed** | **NOT MET** — none exists; WP-0001 non-scope; DISC-0003. **EPA-0003 D13** |
| **PR4** | Inference runtime available on the authorized host, with an Arabic-capable model evaluated per SPEC-0020 | **NOT MET / UNKNOWN** — no model runtime is installed |
| **PR5** | Real approved policy corpus available for ingestion and gate evaluation | **UNKNOWN** — not visible from the repository. Bears directly on D14 |
| **PR6** | Host capacity for embeddings + inference | **UNKNOWN** — not measured; depends on D2 and D5 |

**PR3 is on the critical path and is the one most likely to be underestimated.** Every authorization
control in EPA-0001 §7 presumes an authenticated employee with roles, groups, and organizational
scope. Until an IdP exists there is no subject to authorize, and a work package that starts without it
will build against a development adapter and discover the gap at the security gate — the most
expensive possible moment.

---

## 5. Dependency-ordered task sequence

**MSG-0054's proposed order, followed as issued:** approved-document lifecycle → ingestion/provenance
→ retrieval/index → grounded QA/citations/abstention → authorization/confidentiality → bilingual
behaviour → auditability → employee frontend → end-to-end security/acceptance verification. MSG-0054
also directs that normally only one implementation task is READY at a time.

| # | Task | Depends on | Gate |
|---|---|---|---|
| T-A | Document authority: lifecycle, versions, effectivity, supersession, ownership, approval | PR1–PR3 | G1 |
| T-B | Ingestion: extraction, normalization, classification, validation, chunking, provenance | T-A | G2 |
| T-C | Retrieval index as projection; rebuild path | T-B, D2 | G4 |
| T-D | Grounded QA: evidence selection, context assembly, generation, grounding gate, abstention | T-C, PR4, D5 | G5, G8 |
| T-E | Authorization and confidentiality at all four points | T-C, PR3, D3 | G3 |
| T-F | Bilingual behaviour per D1 | T-D, T-E, D1, D6 | G7 |
| T-G | Audit and retention | T-A…T-F, D7 | G9 |
| T-H | Employee frontend | T-D…T-G, D10 | — |
| T-I | End-to-end security and acceptance verification | all | G6, G10, G11 |

### One observation on the ordering, recorded rather than acted on

The sequence places **authorization (T-E) after grounded QA (T-D)**. That is the lead's proposed
order and this record follows it. It is noted because it produces an interim state in which a working
answer path exists before retrieval-time authorization does — and an unauthorized answering system,
even in development, is exactly the artifact most likely to be demonstrated, copied, or accidentally
pointed at real documents.

Two ways to remove the exposure without disturbing the lead's sequence: (a) build T-D against
synthetic, non-confidential fixture documents only, with real corpus ingestion gated behind T-E; or
(b) move T-E before T-D. **(a) preserves the stated order and is the recommendation.**

**No reordering is proposed and none is made** — TASK-0021 has no authority over the sequence, and
CLAUDE.md's authority rules put a recorded lead decision above an executing session's judgment. This
is recorded so the lead can rule on it, or dismiss it, deliberately.

---

## 6. Security, migration, and operational considerations

**Security.** The threat table in EPA-0001 §8 (T1–T11) with G6 as its acceptance gate. Deny by
default; authorization outside the model; retrieved content as untrusted data; no tool surface; no
secrets in context, logs, or audit; classification enforced before model exposure; ADR-0016's tenant
model reused unchanged.

**Migration.** New tables/objects for document authority and chunk provenance; **no change to
WP-0001's accepted schema semantics.** The retrieval index requires no migration path because it is
rebuildable from the kernel (EPA-0001 P5) — losing it costs availability, never truth.

**Operational.** Containerized, all state under `/data/docker`; offline artifact acquisition per
SPEC-0026; deterministic startup with readiness reflecting index and runtime health; backup per
SPEC-0025 covering the kernel (the index need not be backed up). Observability per EPA-0001 §11 —
with **abstention rate by class and language as the primary safety signal**, since a sudden drop is
the most likely signature of the grounding contract failing open rather than a sign of improvement.

**Evidence required at completion.** Every gate G1–G11 with re-readable evidence; non-zero test counts
per tier; integration results from the real environment; the security suite's results in full,
including what it failed to break; and unresolved limitations stated plainly. Per CLAUDE.md Rule 11,
anything missing means the work package is reported **IMPLEMENTED but NOT COMPLETE**, naming the gap.

---

## 7. Rough shape, stated with its uncertainty

The lead asked for a decision-ready proposal, and size is part of a decision. **This is a judgment,
not a measurement, and it should not be quoted as an estimate.**

Nine tasks, eleven gates, five to six new ADRs, and three unmet prerequisites of which one (PR3, the
identity provider) is infrastructure work not yet started. **This is substantially larger than
WP-0001**, which delivered 229 tests across a kernel with a settled specification and no open
architecture questions. This capability starts with fourteen.

The largest single risks to the estimate, in order: **PR3** (an IdP deployment with no current owner),
**D14/PR5** (if the real corpus is scanned Arabic PDFs, ingestion becomes a research problem rather
than an engineering one), and **D5** (if entailment-based grounding is chosen, a second model must be
selected, evaluated per language, and operated — effectively a second model programme).
