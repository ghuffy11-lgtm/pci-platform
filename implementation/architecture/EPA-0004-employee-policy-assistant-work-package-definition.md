# EPA-0004 — Employee Policy Assistant: Work-Package Definition

**Status:** **PROPOSED — NOT AUTHORIZED.** This record defines a work package; it does not authorize
one. MSG-0059: "The Architecture Lead must review and accept TASK-0022's resulting work-package
definition before any implementation task is authorized or marked READY."
**Produced by:** TASK-0022 (definition only) | **Authority for the task:** MSG-0059
**Binding rulings folded in:** MSG-0056a (D2, D4, D5, D6, D8, D9, D10, D11, D12, D14) ·
MSG-0056b (D1, D3, D7, D13) · MSG-0058 (F1, F2, F3, F4)
**Date:** 2026-08-21
**Supersedes in substance:** [`EPA-0002`](EPA-0002-proposed-work-package-and-gates.md), which was
written **before** any decision was ruled and is therefore written in the conditional throughout.
EPA-0002 is retained unchanged as the record of what was proposed pre-ruling. **Where the two differ,
this record is the later one and states why** — see §12.
**Companions:** [`EPA-0001`](EPA-0001-employee-policy-assistant-architecture.md) (architecture) ·
[`EPA-0003`](EPA-0003-required-decisions.md) (the fourteen decisions, each annotated with its ruling)

---

## 0. Standing of this document, and what changed since EPA-0002

EPA-0002 asked "what would a work package look like if the architecture were accepted and the
fourteen decisions answered?" **All fourteen are now answered, and so are the four reconciliation
findings.** This record is the same question asked with the answers in hand: it is specific where
EPA-0002 was conditional, and it names what the rulings *changed* rather than quietly rewriting it.

**It authorizes nothing.** No task defined here may be marked READY, reconciled into
`implementation/operations/CLAUDE-TASKS.md` as READY, or started. TASK-0022's forbidden list is
explicit — "No implementation task may be marked READY by this task; queue changes are
recommendations only" — and §13 is written as a recommendation to the lead for exactly that reason.

**It creates no ADR.** MSG-0056a D12 accepted *promotion* of the grounded-answer contract to an
architecture decision and stated "no ADR is created by this message"; TASK-0022 forbids changing
accepted ADRs and does not authorize creating them. §11.2 lists the ADR surface as a recommendation.

**It selects no provider, model, embedding model, index technology, or runtime.** Those are
forbidden by MSG-0059 and by both TASK-0022 specifications. Where a choice must eventually be made,
this record states the *constraint and the evaluation path*, never the product.

---

## 1. Work-package record — required fields

Following `docs/engineering/implementation-work-package-standard.md`. Every required field is present;
where a field cannot be filled without a lead decision, it says so instead of guessing.

### 1.1 Work package ID — **not allocated, deliberately**

**Recommendation: the Architecture Lead allocates the number.** It is not withheld out of caution but
because allocating it here would compound an existing collision.

**VERIFIED this session.** `docs/program/work-packages.md` (PLAN-WP-0001, `Status: Active`) lists
**WP-0001 as "Knowledge Foundation"** and **WP-0002 as "Repository and Engineering Platform"**, while
the only file in `docs/program/work-packages/` is **`WP-0001-kernel-foundation.md`, "PCI Kernel
Foundation"**. The planning register and the delivered work-package directory already disagree about
what WP-0001 is, and WP-0002 through WP-0008 are already spoken for in the register.

This capability maps most naturally onto the register's **WP-0004 (Knowledge Service)**,
**WP-0005 (AI Runtime Abstraction)** and parts of **WP-0003 (Platform Runtime Foundation)** without
being any one of them. **Which register entries this work package satisfies, supersedes, or sits
beside is a planning decision, not an implementation one.** It is recorded in §11.1 as an open item.
Throughout this document the work package is called **"the assistant work package"**.

### 1.2 Objective

Deliver a governed, employee-facing capability that answers questions about organizational policy and
procedure, in English and Arabic, **exclusively** from approved and published document versions the
asker is authenticated and authorized to see, with verifiable citations that resolve to the
authoritative English text, and fail-closed abstention whenever that standard cannot be met.

### 1.3 Source ADRs and specifications

**Accepted, reused unchanged:** ADR-0003, ADR-0005, ADR-0007, ADR-0009, ADR-0013, ADR-0016 ·
SPEC-0004, SPEC-0005, SPEC-0006, SPEC-0008, SPEC-0010, SPEC-0011, SPEC-0013, SPEC-0014, SPEC-0015,
SPEC-0020, SPEC-0022, SPEC-0025, SPEC-0026, SPEC-0031 · `docs/architecture/platform-kernel.md`,
`context-assembly.md`, `knowledge-fabric.md`, `data-architecture.md` · `docs/security/ai-security.md`,
`threat-model.md`, `data-classification.md`, `rbac-abac-model.md` · the Constitution.

**Explicitly not governing:** **ADR-0015** — MSG-0056a D9 rules that the kernel stack "does not
automatically govern the new service", and ADR-0015 is scoped to the kernel by its own text.
**ADR-0011 / SPEC-0002** — not engaged, because the assistant has no tool surface and performs no
mutation (EPA-0001 §4.6). Engaging either later is an ADR, not a feature.

**Proposed but not created:** the six ADRs in §11.2. None exists; none is created here.

### 1.4 Scope

1. **Document authority** — lifecycle, immutable versions, effectivity, supersession, ownership, and
   approval records, per EPA-0001 §3 and the D3 ruling.
2. **Ingestion** — extraction, normalization, language detection, classification, validation against
   an approval record, chunking with resolvable anchors, and provenance, per EPA-0001 §4.3.
   **Text-native documents only** (D14).
3. **Retrieval index** — a rebuildable projection over published, effective, in-scope chunks. Hybrid
   lexical + semantic, one index, local multilingual embeddings (D2).
4. **Retrieval-time authorization** at all four enforcement points (EPA-0001 §7.1), with uniform
   abstention and closed timing/result-count side channels (D4).
5. **Grounded answering** — evidence selection, context assembly, generation, the layered
   structural + entailment grounding gate, and the A1–A7 abstention taxonomy (D5, EPA-0001 §5).
6. **Bilingual behaviour** — English authoritative, Arabic an approved translation/access language;
   Arabic answers may be generated from English policy **only** through a cross-language grounding
   gate that fails closed (D1, MSG-0058 F1).
7. **Authenticated identity** through the ADR-0007 OIDC/OAuth2 boundary, configurable across
   deployment modes (D13, MSG-0058 F3).
8. **Retention and privacy** — session-default conversation retention, administrator-configurable,
   employee-only read access to retained conversation content (D7).
9. **Audit** — lifecycle, retrieval, answer, **abstention**, citation-open, and administrative events
   (EPA-0001 §10.1).
10. **Employee frontend** — within the constraints of EPA-0001 §9; enforces nothing.
11. **Model-runtime integration** through the SPEC-0008 abstraction, **local inference only** (D8).
12. **Tests at every tier**, including the adversarial security suite and per-language gates.

### 1.5 Non-scope

- Any change to accepted WP-0001 architecture, the `/data` boundary, or any existing fail-closed control.
- **Any mutating action or tool use.** The assistant answers; it does not act (EPA-0001 §4.6).
- Domain capabilities beyond policy/procedure documents (network, helpdesk, facilities, biomedical).
- **Historical/temporal questions over superseded versions** — out of scope for the first release
  (D11), with the data model retaining full capability so a later addition needs no migration.
- **Multi-turn conversation** — single-shot only, with bounded clarification (D10).
- **OCR and scanned documents** — rejected rather than ingested (D14).
- **Unauthenticated access** — deferred from the first release (MSG-0058 F2). No new unauthenticated
  classification and no new trust boundary is introduced.
- **Direct LDAP/Kerberos authentication** — not authorized (MSG-0058 F3).
- **External inference** — prohibited by default and for the initial implementation (D8).
- Identity provider **implementation** — PCI integrates one; it does not build one (ADR-0007).
- Multi-tenant SaaS operation. SPEC-0010's requirement is only that the model must not *prevent* it.

### 1.6 Dependencies and prerequisites — checked before the work package starts, not during

| # | Prerequisite | State, as of 2026-08-21 | Owner |
|---|---|---|---|
| **PR1** | Architecture accepted; EPA-0003 decisions ruled | **MET for the decisions** — all fourteen ruled (MSG-0056a/b), F1–F4 ruled (MSG-0058). **EPA-0001/0002/0004 themselves remain PROPOSED** | Architecture Lead |
| **PR2** | Work package authorized | **NOT MET** — MSG-0059 requires acceptance of this record first | Architecture Lead |
| **PR3** | **An OIDC/OAuth2 identity provider deployed** | **NOT MET** — none exists. WP-0001 non-scope; DISC-0003 records the development adapter as a development boundary | **Operator + Architecture Lead** |
| **PR4** | A local inference runtime on the authorized host, with an Arabic-capable model evaluated per SPEC-0020 | **NOT MET / UNKNOWN** — no model runtime is installed | Operator |
| **PR5** | A real approved policy corpus available for ingestion and gate evaluation | **UNKNOWN** — not visible from the repository | Organization |
| **PR6** | Host capacity for embeddings plus inference | **UNKNOWN — not measured** | Operator |

**PR3 remains the critical path and the item most likely to be underestimated.** Every control in
EPA-0001 §7 presumes an authenticated subject with roles, groups, and organizational scope. Until an
IdP exists there is no subject to authorize, and a work package that starts without one builds against
a development adapter and meets the gap at the security gate — the most expensive possible moment.
The D13 ruling names *modes* (Entra ID, an existing directory fronted by OIDC, or a broker); it does
not name a provider, a deployment date, or an owner. §11.4.

**PR5 has grown teeth since EPA-0002.** D14 rejects scanned documents outright. If the organization's
policy corpus is substantially scanned Arabic PDFs, the ruling is still correct but the first release
answers from a fraction of the corpus — and **nobody discovers that until ingestion runs**. A corpus
survey is cheap now and expensive later (§11.5).

### 1.7 Inputs

Approved, published, text-native policy and procedure documents supplied by the organization through
the governed upload path of D3; the deployment's OIDC identity configuration; a locally hosted
embedding model and inference model, both selected under SPEC-0020 with per-language acceptance bars;
and the accepted authority listed in §1.3.

### 1.8 Expected repository changes

Stated as shape, not as a file plan — a definition task does not lay out someone else's tree.

- A **new service** outside the kernel (D9), consuming kernel contracts through its API, with all
  persistent state under `/data/docker` and no change to kernel contracts or to WP-0001's schema
  semantics.
- New domain objects for document authority, versions, approval records, source files, ingestion runs,
  and chunk provenance (§2.1), persisted as Knowledge Objects rather than in a private store.
- A retrieval index that is **not** in the backup path, because it is rebuildable from the kernel.
- Frontend assets for the employee surface.
- Tests at every tier of §7, including the adversarial suite.
- Documentation: the ADRs of §11.2 once the lead creates them, an updated deployment/runbook set, and
  the evidence records of §9.

---

## 2. Data contracts and interfaces

Contract level only — no schema, no migration, no code. Field lists are the minimum the architecture
requires, not a complete design.

### 2.1 Core objects

| Object | Required attributes |
|---|---|
| **PolicyDocument** | stable id; title per language; owning organizational role; document class; organizational scope; current published version ref; lifecycle summary |
| **DocumentVersion** | stable id; parent document; version label; lifecycle state; `effective_from` / `effective_to`; **language and authority role** (`authoritative` for English, `approved_translation` for Arabic — D1); classification; audience; approval record ref; source-file ref; `supersedes` / `superseded_by` |
| **SourceFile** | content hash; original filename; media type; acquisition time; acquiring identity; ingestion run ref |
| **Chunk** | id; version ref; section path; character offsets; language; inherited classification and audience; raw and normalized index forms (D6); projection state |
| **ApprovalRecord** | approver identity; approving role; approval time; policy version applied; **evidence that the approver is not the sole author** (D3); multi-party approvals where required (SPEC-0022) |
| **IngestionRun** | id; pipeline version; source files; outcome; chunk counts; rejections with reasons |
| **TranslationLink** | authoritative version ref; approved-translation version ref; **divergence status** — D1 requires a meaning discrepancy be *flagged*, not silently resolved |

**Invariants, each testable:**

- A Chunk's authorization constraints are **exactly** its DocumentVersion's — never weaker (EPA-0001 §4.4).
- At most one PUBLISHED version of a document is effective at any instant (EPA-0001 §3.4). Two is a
  data defect that fails ingestion loudly.
- Normalization never alters stored authoritative text; it applies identically at ingestion and query
  time (D6).
- **An Arabic version is never `authoritative`.** The authority role is a property of the version, so
  the invariant is enforceable at the data layer rather than in answer-path logic.

### 2.2 Answer response contract

The API returns exactly one of two shapes. There is no partial or hedged third shape — that absence
**is** the contract.

```text
ANSWER {
  answer_text            (in the asker's language)
  claims[]               { text, citations[] }        -- every claim carries >= 1 citation
  citations[]            { document_id, version_id, version_label, section_path,
                           effective_from, effective_to, language, authority_role,
                           resolve_url }
  answer_language
  source_authority_language                            -- always the authoritative language
  cross_language         { applies: bool, gate_result } -- present when answer_language != source language
  grounding              { gate_result, structural_layer, entailment_layer, mechanism_version }
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

**Four contract rules, each a protocol violation rather than a quality issue:**

1. A claim with an empty `citations[]` is a violation, **not** a lower-confidence answer.
2. An ABSTENTION carrying policy content is a violation.
3. A citation whose `authority_role` is `approved_translation` may be **displayed alongside** but
   never returned as the sole support for a policy claim (D1).
4. When `answer_language` differs from the authoritative source language, `cross_language.gate_result`
   must be present and passing. **Absent or failed ⇒ ABSTENTION, never an English fallback**
   (MSG-0058 F1).

> **Rule 4 is the single most consequential line in this document.** MSG-0058 F1 rules cross-language
> generation *in* — reversing EPA-0003's recommendation, which the lead is entitled to do — and pays
> for it with a fail-closed gate. If that gate is ever implemented as "fall back to English", the
> ruling has been inverted rather than implemented.

### 2.3 Service interfaces

| Interface | Purpose | Notes |
|---|---|---|
| Document authority API | Submit, review, approve, publish, supersede, withdraw | Every transition audited; **privileged upload, and author ≠ sole approver** (D3) |
| Ingestion API / trigger | Ingest an approved source file; re-index | **Rejects** content with no valid approval record, and **rejects non-text-native files with a clear message** (D14) |
| Ask API | Question in, ANSWER or ABSTENTION out | Authenticated subject required (F2); authorization before retrieval; no tool surface |
| Citation resolve API | Return a cited passage in context | **Re-authorizes on every call** — a citation is not a capability |
| Conversation API | Session-scoped retained Q&A | **Readable only by the employee who asked** (D7); retention window administrator-configurable |
| Admin API | Classification, audience, ownership, retention configuration | Audited administrative actions |

All are consumed by the frontend, which enforces nothing (EPA-0001 §9).

---

## 3. Acceptance gates

Each gate is a **demonstration**, not a claim. Per CLAUDE.md Rule 10: evidence recorded where it can be
re-read; a non-zero test count; integration claims only from the real integration environment.

**Every gate that involves a question or a document runs twice, once per language, and both runs must
pass.** A single aggregate score lets Arabic performance hide behind English performance.

G1–G11 keep EPA-0002's identifiers so existing references stay valid. **Where a ruling changed a
gate's content, the change is stated in the last column.** G12–G13 are new, and exist because D7 and
D13 were unruled when EPA-0002 was written.

| Gate | Demonstrates | Fails if | Changed by a ruling? |
|---|---|---|---|
| **G1 — Document authority** | A version reaches PUBLISHED only through an approval by an authorized approver who is **not the sole author**; supersession chains traverse; effectivity evaluated at answer time | A draft is ever retrievable; two versions of one document are simultaneously effective; an author self-approves | **Yes — D3** adds the separation-of-duties assertion |
| **G2 — Ingestion and provenance** | Every chunk resolves to a version, a source hash, and an ingestion run; re-ingestion creates a new version rather than mutating one; **a scanned/non-text-native file is rejected with a clear message and never partially ingested** | Any indexed chunk lacks a valid approval record; a scan is ingested | **Yes — D14** |
| **G3 — Retrieval authorization** | Unauthorized content is not a candidate, is re-checked on hit, is denied by RLS, and is denied again at citation resolve | Any one of the four points is the **only** thing preventing access | No |
| **G4 — Index is a projection** | A full rebuild from the kernel changes no answer; a stale index triggers abstention rather than a stale answer | A rebuild changes what the system says | No |
| **G5 — Grounded answer contract** | On a curated question set: every claim cited; no uncited claim emitted; abstention on unsupported questions; **zero answers from parametric knowledge**; **both grounding layers demonstrably run, and the gate fails closed when either is unavailable** | Any answer contains a policy claim absent from cited evidence; the entailment layer is skipped silently | **Yes — D5** fixes the mechanism as layered structural + entailment |
| **G6 — Adversarial security suite** | T1–T11 exercised as attacks: injected instructions in approved documents; probing questions; forged/unresolvable citations; poisoned index entries; cross-scope attempts | Any injected instruction changes behaviour; **any probe distinguishes A1 from A2, by wording, timing, or result count** | **Yes — D4** makes uniformity mandatory rather than optional |
| **G7 — Cross-language grounding** | An Arabic answer generated from English policy passes a grounding gate evaluated **across** the language boundary, under a separate SPEC-0020 acceptance bar; the citation resolves to the **English** text; a divergent Arabic approved translation is **flagged**, not silently preferred | **The Arabic gate fails and the system answers anyway — in Arabic, or by falling back to English**; a translation is cited as the policy | **Yes, fundamentally — D1 + MSG-0058 F1.** EPA-0002's G7 tested *parity between two approved texts*; this tests *support across a translation boundary*, which is a different and harder claim |
| **G8 — Abstention behaviour** | Each class A1–A7 is producible and correctly classified; every degraded path (index, runtime, either grounding layer, authorization, cross-language gate) abstains rather than answers | Any degraded path produces an answer | **Extended** — the cross-language gate is now a degraded path |
| **G9 — Audit reconstruction** | A reviewer reconstructs question → authentication → authorization → retrieval → evidence → generation → gate → answer from audit records alone; **abstentions reconstruct equally**; no secrets present | Reconstruction requires application logs or model memory (SPEC-0006) | No |
| **G10 — Offline operation** | Full capability with the host network-isolated; **no inference or embedding call leaves the host** | Any core path requires Internet; any egress to an external model provider | **Yes — D8** makes egress a gate failure, not a configuration choice |
| **G11 — Boundary integrity** | All persistent state under `/data/docker`; no WP-0001 control weakened; kernel contracts unchanged | Any artifact outside `/data`; any accepted control modified | No |
| **G12 — Identity and session** *(new)* | Authentication through the OIDC/OAuth2 boundary in each supported mode; **an unauthenticated request receives no policy content of any kind**; no direct LDAP/Kerberos code path exists | An unauthenticated caller obtains any policy content; PCI implements an authentication mechanism | **New — D13, MSG-0058 F2 and F3** |
| **G13 — Retention and question privacy** *(new)* | Retention defaults to session scope; the configured window is honoured and expiry actually deletes; **retained conversation content is unreadable by any identity other than the asker**, demonstrated by test; security/audit records follow their own retention | Another employee, or an ordinary administrator, can read a retained question through any interface | **New — D7** |

**G5, G6, G7 and G12 are the gates that decide whether this capability is safe to deploy.** The others
are necessary; those four are the reason the architecture exists.

---

## 4. Test tiers

Following WP-0001's proven structure — 229 tests across three tiers, every count non-zero, executed on
the target platform. That is the standard to match, not a ceiling.

| Tier | Content | Environment |
|---|---|---|
| **Unit** | Lifecycle transitions, effectivity, supersession, normalization projections, claim/citation parsing, abstention classification | Any |
| **Contract** | §2.2 enforced as a protocol: uncited claim rejected; abstention-with-policy-content rejected; translation-only citation rejected; missing/failed `cross_language.gate_result` forces abstention | Any |
| **Integration** | Real PostgreSQL, real index, **real local inference runtime**. Mocked runs are evidence about the double, not the system | Authorized host |
| **Adversarial security** | G6 in full, including timing and result-count measurement for A1 vs A2 | Authorized host |
| **Bilingual** | Every question-bearing test, twice, with separate per-language acceptance bars under SPEC-0020 | Authorized host |

**One gate cannot be satisfied by tests alone.** G13's "unreadable by any identity other than the
asker" is a negative claim across every interface, including admin and analytics surfaces. It needs a
review of the surfaces as well as tests against them.

---

## 5. Dependency-ordered implementation task sequence

**MSG-0054's proposed order, followed as issued** and unchanged by any later ruling: approved-document
lifecycle → ingestion/provenance → retrieval/index → grounded QA → authorization/confidentiality →
bilingual behaviour → auditability → frontend → end-to-end verification. MSG-0054 also directs that
normally only one implementation task is READY at a time.

**These are proposed identifiers, not queue entries.** None is READY; none may be marked READY by
this record.

| # | Task | Depends on | Gate | Boundary |
|---|---|---|---|---|
| **T-0** | **IdP selection and deployment** | PR2 | G12 (partial) | **Operator + Architecture Lead.** Not a Claude Code task — it needs a privileged deployment action and an organizational choice |
| T-A | Document authority: lifecycle, versions, effectivity, supersession, ownership, approval with separation of duties | PR1, PR2 | G1 | Architecture checkpoint: the approval model is the D3 ruling's first concrete expression |
| T-B | Ingestion: extraction, normalization, language detection, classification, validation, chunking, provenance; **non-text-native rejection** | T-A | G2 | Requires PR5 evidence before the normalization rules are fixed (D6) |
| T-C | Retrieval index as projection; hybrid lexical + semantic; rebuild path | T-B | G4 | Embedding-model evaluation under SPEC-0020, per-language bars. **Selection is the lead's** |
| T-D | Grounded QA: evidence selection, context assembly, generation, **layered grounding gate**, abstention taxonomy | T-C, PR4 | G5, G8 | **Security checkpoint.** See the ordering note below |
| T-E | Authorization and confidentiality at all four points; uniform abstention; side-channel closure | T-C, PR3, T-0 | G3, G6 (partial) | **Security checkpoint** |
| T-F | Bilingual behaviour: cross-language grounding gate, citation authority resolution, divergence flagging | T-D, T-E | G7 | **Security checkpoint** — this is where F1's fail-closed rule is either implemented or inverted |
| T-G | Audit, retention, and question privacy | T-A…T-F | G9, G13 | **Privacy checkpoint** — D7's employee-only access is verified here |
| T-H | Employee frontend | T-D…T-G | — | Enforces nothing; must not soften an abstention |
| T-I | End-to-end security and acceptance verification | all | G6, G10, G11, G12 | **Final security gate.** Full adversarial suite on the authorized host |

### 5.1 The T-D before T-E ordering — recorded again, still unruled

EPA-0002 §5 flagged that the lead's sequence places **grounded QA (T-D) before retrieval-time
authorization (T-E)**, producing an interim state in which a working answer path exists before
authorization does. It proposed two ways to remove the exposure without disturbing the order:
**(a)** build T-D against synthetic, non-confidential fixture documents only, with real-corpus
ingestion gated behind T-E; or **(b)** move T-E before T-D. It recommended **(a)**.

**No ruling on this has been issued.** MSG-0056a, MSG-0056b, MSG-0058 and MSG-0059 are silent on it,
verified by reading all four. The order above therefore still follows the lead's sequence, and the
recommendation is repeated rather than acted on. It is listed in §11.3 as an open item.

---

## 6. Security considerations and threat coverage

Threat model from EPA-0001 §8 (T1–T11), each mapped to the gate that must demonstrate it and to the
ruling that changed it, if any.

| ID | Threat | Primary gate | Ruling effect |
|---|---|---|---|
| T1 | Prompt injection via approved document content | G6 | — |
| T2 | Injection via uploaded content, entering before approval | G2, G6 | **D3** — privileged upload narrows the entry point; **D14** — rejecting scans removes an OCR-shaped injection path |
| T3 | Exfiltration through crafted probing questions | G6 | **D4** — uniform abstention is now mandatory, including timing and count |
| T4 | Hallucinated policy — highest likelihood, highest damage | G5 | **D5** — the layered gate is the specified mechanism |
| T5 | Stale or superseded answer | G4, G1 | **D11** — superseded content is retrievable for audit but never answerable in release 1 |
| T6 | Cross-scope leakage | G3, G6 | — |
| T7 | Sensitive question logging | G13 | **D7** — session default, configurable window, employee-only read |
| T8 | Model substitution / silent drift | G5, G10 | **D8** — local-only removes the provider-swap surface entirely |
| T9 | Index poisoning | G2, G4 | — |
| T10 | Citation forgery — a plausible citation to a passage that does not say it | G5, G7 | **D1 + F1 raise this threat's severity.** Generating Arabic from English is a translation step between the source and the citation, and a translation error *is* citation forgery arriving through the front door. G7 is its control |
| T11 | Availability as a safety issue — a degraded system that answers anyway | G8 | **F1** adds the cross-language gate as a degraded path that must abstain |

**T4 and T10 are the two the rulings made harder, not easier.** Everything else is well covered by
accepted PCI architecture.

**Standing security constraints, unchanged:** deny by default; authorization outside the model;
retrieved content is untrusted data; no tool surface; no secrets in context, logs, or audit;
classification enforced before model exposure; ADR-0016's tenant model reused unchanged; Restricted
content never enters model context.

---

## 7. Migration considerations

New objects for document authority and chunk provenance. **No change to WP-0001's accepted schema
semantics, and no change to any accepted control.** The retrieval index needs no migration path
because it is rebuildable from the kernel (EPA-0001 P5) — losing it costs availability, never truth.

The D11 ruling has a migration consequence worth stating: **effective-date and supersession data must
be captured from T-A onward even though release 1 cannot answer historical questions.** Adding the
capability later must not require a migration; omitting the data now guarantees one.

---

## 8. Operational considerations

Containerized on the customer-controlled host, all persistent state under `/data/docker` (bootstrap
contract v0.2, MSG-0006 — unchanged and untouched). Offline artifact acquisition per SPEC-0026.
Deterministic startup with readiness reflecting index and runtime health. Backup per SPEC-0025 covering
the kernel; the index is deliberately **not** in the backup path.

**Failure modes, all fail-closed** (EPA-0001 §11), with one addition from F1:

| Failure | Behaviour |
|---|---|
| Inference runtime down | Abstain A7; readiness reflects it |
| Index unavailable or stale beyond threshold | Abstain A7 rather than answer from a stale projection |
| Authorization service unavailable | **Deny.** Never fail open |
| Kernel unavailable | Full stop; citations cannot be resolved |
| Either grounding layer unavailable | Abstain |
| **Cross-language grounding gate unavailable or failing** | **Abstain — never fall back to English** (F1) |

**Observability.** Abstention rate by class **and language**, grounding-gate rejection rate split by
layer, **cross-language gate rejection rate**, retrieval latency, index freshness lag, authorization
denials, model routing. **The abstention rate remains the health metric that matters most** — a sudden
drop is not an improvement, it is the most likely signature of the grounding contract failing open.

**One operational signal is new.** A cross-language rejection rate near zero should be treated as
suspicious rather than excellent: it most likely means the gate is not actually evaluating across the
boundary.

---

## 9. Evidence required at completion

Per CLAUDE.md Rules 10 and 11, and non-negotiable:

- Every gate **G1–G13** with re-readable recorded evidence.
- Non-zero test counts per tier, with the intended tests demonstrably executed.
- Integration and adversarial results from the **real** environment on the authorized host.
- The security suite's results in full, **including what it failed to break**.
- Per-language results reported separately — never aggregated.
- Unresolved limitations stated plainly.

Anything missing means the work package is reported **IMPLEMENTED but NOT COMPLETE**, naming the
specific gap. There is no partial credit and no rounding up.

---

## 10. Rough shape, stated with its uncertainty

**A judgment, not a measurement. Do not quote it as an estimate.**

Ten tasks, thirteen gates, six proposed ADRs, and four unmet or unknown prerequisites of which one
(PR3) is infrastructure work with no current owner. **Substantially larger than WP-0001**, which
delivered 229 tests against a settled specification with no open architecture questions.

The largest risks to that judgment, in order:

1. **PR3** — an IdP deployment with no named owner and no date. Unchanged from EPA-0002.
2. **PR5 + D14** — if the real corpus is largely scanned, the first release ingests a fraction of it.
   The ruling is right; the exposure is that it is discovered late.
3. **F1's cross-language gate** — the newest and least precedented control here. EPA-0003 recommended
   avoiding this problem entirely; the lead ruled it in scope with a fail-closed gate, which is a
   defensible call that makes G7 the hardest gate to pass. There is no accepted PCI specification for
   cross-language entailment, and SPEC-0020 supplies the evaluation frame but not the bar.
4. **D5's entailment layer** — a second model to select, evaluate per language, and operate.

---

## 11. Genuinely remaining decisions

**Deliberately short.** All fourteen EPA-0003 decisions are ruled and F1–F4 are ruled; nothing settled
is reopened here. Each item below is either a sub-question that was asked and not answered, or a
consequence of a ruling that the ruling itself does not resolve. **None is a request for permission to
proceed with something already chosen.**

### 11.1 Work-package number and its relationship to PLAN-WP-0001

The register and the delivered work-package directory already disagree (§1.1). **Decision required:**
which number this work package takes, and which PLAN-WP-0001 entries it satisfies, supersedes, or sits
beside. Not self-allocated.

### 11.2 The ADR surface — proposed, not created

MSG-0056a D12 accepted promotion of the grounded-answer contract to an architecture decision and stated
that the ADR number is allocated during architecture drafting and that no ADR was created. EPA-0003
proposed six. Restated with what the rulings now fix in each:

| Proposed | Title | Now settles |
|---|---|---|
| ADR-00xx | Grounded Answer Contract | D5's layered gate, fail-closed; D12's promotion |
| ADR-00xx | Approved Document Authority and Lifecycle | D3's privileged upload, author ≠ sole approver; D11's release-1 boundary |
| ADR-00xx | Bilingual Policy Semantics (English/Arabic) | D1's English authority; **F1's cross-language fail-closed rule**; D6's empirical normalization, which the ruling requires be recorded in an ADR before production use |
| ADR-00xx | Retrieval Projection and Index Boundary | D2's hybrid strategy; D9's service boundary |
| ADR-00xx | Employee Question Privacy and Retention | D7's session default and employee-only access; D4's uniform abstention |
| ADR-00xx | Inference Locality and Provider Boundary | D8's default prohibition and the conditions of any future exception |

**Decision required:** whether to create this set, how many, and their numbers. **Numbers are left as
`00xx` on purpose** — EPA-0003 proposed ADR-0017…ADR-0022, and allocating them here would be a second
session guessing at a register the lead owns. ADR-0016 and ADR-0007 are reused unchanged and need no
successor.

### 11.3 T-D before T-E

Unruled since EPA-0002 (§5.1). **Decision required:** accept mitigation (a) — synthetic fixtures only
until T-E lands — or reorder, or accept the interim exposure deliberately.

### 11.4 PR3 — who owns the IdP, and when

D13 names the supported *modes*; it names no provider, owner, or date, and MSG-0058 F3 fixes the OIDC
boundary without deploying anything. **Decision required:** which provider in this deployment, who
performs the privileged deployment, and whether it precedes the work package or is its first task.
This is an operator and organizational decision.

### 11.5 PR5 — may the real corpus be surveyed before T-B?

D14's rejection rule and D6's "determine normalization empirically against the real corpus" both
depend on a corpus nobody has looked at from the repository side. **Decision required:** authorize a
read-only corpus survey — formats, languages, scanned proportion — or accept that ingestion scope is
discovered during T-B. **No survey is performed or scheduled by this record.**

### 11.6 May a policy document be classified Restricted? — asked, not answered

EPA-0003 D3 posed four sub-questions. MSG-0056b answers three: who may upload, who approves, and that
the author must not be the sole approver. **The fourth is not addressed in the ruling text** —
verified by reading MSG-0056b in full this session.

The question matters because `docs/security/data-classification.md` forbids Restricted content in
prompts. If a Restricted document is the only source for a question, the assistant must abstain **even
for an authorized asker**. EPA-0003 recommended excluding Restricted policy documents from the corpus
entirely rather than retrieving and then suppressing them, on the ground that an exclusion cannot fail
open.

**Decision required:** may policy documents carry Restricted classification, and if so are they
excluded from the corpus or retrieved-then-suppressed? **This is not a reopened decision** — it is the
one sub-question of D3 the ruling does not reach, and building either way without a ruling would embed
a confidentiality posture by accident.

### 11.7 The service's implementation stack — half-answered

MSG-0056a D9 rules a separate service and states that **ADR-0015's kernel stack does not automatically
govern it**. EPA-0003's D9 also asked "whether ADR-0015's stack applies to the new service or the
runtime choice is open". The ruling settles that it does not *automatically* apply; it does not say
what does. **Decision required:** does the assistant service adopt the ADR-0015 stack by choice, or is
the runtime an open technology decision needing its own ADR under
`docs/architecture/technology-selection-principles.md`? Recorded because an implementation session
would otherwise pick a stack by default and call it inherited.

---

## 12. Where this record differs from EPA-0002, and why

EPA-0002 is retained unchanged. Six substantive differences, each traceable to a ruling rather than to
this session's judgment:

| # | EPA-0002 said | This record says | Because |
|---|---|---|---|
| 1 | G7 tests **bilingual parity** between two approved texts; M3 machine translation recommended prohibited | G7 tests **cross-language grounding**, English source to Arabic answer, fail-closed | D1 + MSG-0058 F1 ruled generation in scope with a gate |
| 2 | Grounding mechanism open (D5) | Layered structural + entailment, fail closed | MSG-0056a D5 |
| 3 | Abstention distinguishability open (D4) | Uniform, including timing and result-count | MSG-0056a D4 |
| 4 | Document classes open (D14) | Text-native only; scans rejected | MSG-0056a D14 |
| 5 | Eleven gates | Thirteen — G12 identity, G13 retention/privacy | D13 + F2/F3, and D7, were unruled when EPA-0002 was written |
| 6 | Nine tasks, T-A…T-I | Ten — T-0, the IdP, made explicit as an operator task | PR3 was named a prerequisite but never appeared in the sequence, which is how a critical-path item goes missing |

**One thing did not change and is worth saying plainly: the T-D/T-E ordering observation.** EPA-0002
raised it, no ruling addressed it, and this record neither acts on it nor drops it (§11.3). An
unresolved item that quietly disappears between two revisions of a proposal is worse than one that is
still open.

---

## 13. Recommended queue changes — recommendations only

**Nothing here is applied by TASK-0022, and no task below is READY.** MSG-0059: "No implementation
task may be marked READY by TASK-0022." Both TASK-0022 specifications repeat it. This section exists so
the lead can authorize by ruling rather than by drafting.

**Recommended, in order:**

1. **Accept, amend, or reject EPA-0004**, and with it EPA-0001 and EPA-0002's standing. Until then
   PR2 is unmet and no implementation task can be authorized.
2. **Rule on the seven open items in §11.** §11.1 (number), §11.6 (Restricted) and §11.4 (IdP owner)
   block the earliest tasks; §11.2, §11.3, §11.5 and §11.7 can follow but each blocks a specific task.
3. **Allocate the work-package number** and record the relationship to PLAN-WP-0001.
4. **Create the ADR set** the lead judges necessary from §11.2, or rule that the rulings themselves
   suffice as authority. *(Claude Code creates no ADR without an explicit instruction to do so.)*
5. **Authorize T-0 (IdP) as an operator task**, separately from the implementation sequence, since it
   needs a privileged deployment action no Claude session may perform.
6. **Then, and only then**, authorize T-A and reconcile it into `CLAUDE-TASKS.md` as the single READY
   task — the MSG-0059 pattern, which exists because five separate occasions have now produced an
   authorization the queue did not reflect (MSG-0044, and MSG-0060's fifth recurrence).

**Until item 1 is done, the correct queue state is: no READY task.** That is not a stall — it is the
architecture-acceptance boundary working as designed.

---

## 14. Conflict check against accepted authority

Checked against every accepted document this record touches. **No conflict with accepted architecture
was found.** Three relationships are worth naming rather than burying:

| Accepted authority | Relationship |
|---|---|
| Constitution 1, 5, 7, 8, 10, 11 | Consistent — local inference (reinforced by D8), replaceable models, offline core, security by design |
| ADR-0003, SPEC-0008, SPEC-0020 | Consistent — model abstraction, recorded model identity, evaluation before promotion, now with **per-language bars** |
| ADR-0005, SPEC-0026 | Consistent — offline-first, and **D8 makes it stricter**: external inference is prohibited, not merely non-mandatory |
| ADR-0007, SPEC-0004 | Consistent, and **MSG-0058 F3 confirms ADR-0007 as governing rather than amending it**. Direct LDAP/Kerberos is excluded; a directory may be fronted by OIDC |
| ADR-0009 | Consistent — no credentials in model context |
| ADR-0011, SPEC-0002 | **Not engaged** — no tool use, no mutation. Engaging them later requires an ADR |
| ADR-0013 | Consistent — the organization is authoritative over policy content; PCI over its record of it |
| ADR-0015 | **Does not govern this service** (D9). This record does not extend it and does not choose a replacement — §11.7 |
| ADR-0016 | Consistent and reused unchanged — three layers, FORCE RLS, 404 over 403 |
| SPEC-0010, 0011, 0013, 0014, 0015, 0031 | Consistent; **stricter** on grounding, on draft non-indexing, and on cross-language support |
| SPEC-0006 | Consistent; extended with abstention auditing and constrained by D7's employee-only read |
| SPEC-0022 | Consistent — approval as a governed action, with D3's separation of duties |
| `docs/security/data-classification.md` | Consistent, **with one unresolved interaction** — §11.6 |
| WP-0001 | No change proposed to any accepted WP-0001 architecture, artifact, or control |
| PLAN-WP-0001 | **Pre-existing inconsistency observed, not resolved** — §1.1. This record allocates no number and creates no new collision |

**Two boundaries flagged rather than buried:**

1. **§2.2 rule 4 is stricter than any accepted specification**, as EPA-0001 §5 already was. Stricter is
   safe under the authority hierarchy — adding a constraint is not contradicting a higher artifact —
   but if the lead intends it to bind future PCI answering capabilities, it belongs in an accepted ADR
   (§11.2), not in a proposal under `implementation/`.
2. **MSG-0056b D13 permits "optional unauthenticated access"; MSG-0058 F2 defers it.** These are not in
   conflict — F2 is the later ruling and defers a mode the earlier one permitted — but a future session
   reading D13 alone would build a trust boundary the lead has explicitly postponed. **F2 governs for
   the first release**, and this record's §1.5 and G12 are written accordingly.
