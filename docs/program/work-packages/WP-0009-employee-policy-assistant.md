# WP-0009 — Employee Policy Assistant

**Status:** **DEFINED — NOT AUTHORIZED FOR IMPLEMENTATION.**
Its definition is accepted; its execution is not. No task under this work package is READY, and none
may be marked READY without a separate authorization from the Architecture Lead.
**Owner:** Engineering / Claude Code (implementation) · Architecture Lead (architecture gates) · Operator (T-0)
**Priority:** not assigned — sequencing is the Architecture Lead's
**Allocated:** 2026-08-21 by TASK-0023 under MSG-0063, applying the MSG-0062 §7.1 ruling

**Accepted definition:** [`EPA-0004`](../../../implementation/architecture/EPA-0004-employee-policy-assistant-work-package-definition.md)
— accepted by **MSG-0062**. That record is the substance of this work package. **This record does not
restate it and must not diverge from it**; it establishes the work package's *identity* and the
*governance sequence* MSG-0063 requires, and points at EPA-0004 for everything else.

**Architecture:** [`EPA-0001`](../../../implementation/architecture/EPA-0001-employee-policy-assistant-architecture.md) ·
**Decisions, all fourteen ruled:** [`EPA-0003`](../../../implementation/architecture/EPA-0003-required-decisions.md) ·
**Pre-ruling proposal, retained unchanged:** [`EPA-0002`](../../../implementation/architecture/EPA-0002-proposed-work-package-and-gates.md)

**Governing rulings:** MSG-0056a (D2, D4, D5, D6, D8, D9, D10, D11, D12, D14) · MSG-0056b (D1, D3, D7, D13) ·
MSG-0058 (F1–F4) · **MSG-0062 (§7.1–§7.7)** · MSG-0063 (this reconciliation's authority)

---

## 1. Identifier — how WP-0009 was allocated, and what it does not disturb

**MSG-0062 §7.1** ruled: *"Allocate this assistant capability as a new work package rather than forcing
it into the conflicting WP-0001/WP-0002 planning labels … No existing WP number is repurposed by this
ruling."*

**The number is the next unused one under the repository's established convention** — `WP-NNNN`, with
one record file `WP-NNNN-<slug>.md` in `docs/program/work-packages/`, the canonical work-package
location designated by **MSG-0005**.

| Source | Numbers occupied |
|---|---|
| `docs/program/work-packages.md` (planning register, `PLAN-WP-0001`) | WP-0001 … WP-0008 |
| `docs/program/work-packages/` (canonical delivered records) | WP-0001 |
| **Highest allocated in either** | **WP-0008** |

**VERIFIED 2026-08-21 before allocation:** `grep -rn "WP-0009\|WP-0010" . --include=*.md` returned no
output. Neither number appeared anywhere in the repository.

**Nothing is repurposed.** Historical **WP-0001 — PCI Kernel Foundation** (`Status: COMPLETE`) is
untouched, as are all eight planning entries. The register discrepancy that made this allocation
delicate is reconciled — not resolved by renumbering — in `docs/program/work-packages.md` §0 and in
[`DISC-0010`](../../../implementation/discoveries/DISC-0010-work-package-register-disagreement.md).

---

## 2. Objective

Deliver a governed, employee-facing capability that answers questions about organizational policy and
procedure, in English and Arabic, **exclusively** from approved and published document versions the
asker is authenticated and authorized to see, with verifiable citations resolving to the authoritative
English text, and fail-closed abstention whenever that standard cannot be met.

Full statement: EPA-0004 §1.2.

## 3. Source ADRs and specifications

EPA-0004 §1.3, unchanged. Two boundaries are load-bearing enough to repeat:

- **ADR-0015 does not govern this work package.** MSG-0056a D9 and **MSG-0062 §7.7**: the service sits
  outside the kernel boundary and the kernel stack is **not inherited**. No replacement stack is
  selected — see §7, architecture task **A-STACK**.
- **ADR-0007 governs identity and is confirmed, not amended** (MSG-0058 F3). PCI integrates an
  OIDC/OAuth2 provider; it never implements one, and direct LDAP/Kerberos is not authorized.

## 4. Scope · Non-scope · Dependencies · Inputs · Expected repository changes

EPA-0004 §1.4, §1.5, §1.6, §1.7, §1.8 respectively — accepted by MSG-0062 and not restated here.

**The prerequisite that decides the schedule is PR3**, an OIDC/OAuth2 identity provider, which does not
exist. **MSG-0062 §7.4** confirms it is an operator/organization action and requires it to be
established *before* the identity-dependent gates. It is carried in §6 as **T-0**.

## 5. Acceptance criteria, tests, security, migration, operations, evidence

EPA-0004 §3 (gates G1–G13), §4 (five test tiers), §6 (threats T1–T11), §7, §8, §9 respectively.

**Two gate contents are fixed by MSG-0062 and must not drift:**

- **G3 / G6 — §7.6.** Restricted documents **are eligible** for the governed corpus, and **no
  retrieve-then-suppress design is permitted.** A Restricted document is never retrieved into an
  employee request unless the authenticated subject satisfies its authorization policy, and denial
  must fail closed **without revealing existence, content, timing, or result-count**. A design that
  retrieves first and filters afterwards fails this gate however correct its output looks.
- **G7 — MSG-0058 F1, carried unchanged.** When the answer language differs from the authoritative
  source language, a passing cross-language grounding result must be present; **absent or failed means
  ABSTENTION, never an English fallback.** EPA-0004 §2.2 rule 4.

**Completion standard:** CLAUDE.md Rules 10 and 11 — every gate with re-readable evidence, non-zero
test counts per tier, integration and adversarial results from the real environment on the authorized
host, per-language results reported separately, limitations stated plainly. Anything missing means
**IMPLEMENTED but NOT COMPLETE**, naming the gap.

---

## 6. Dependency-ordered sequence

**Nothing below is authorized. Nothing below is READY.** Identifiers `T-0` and `T-A`…`T-I` are
EPA-0004's labels, retained so existing references stay valid; `A-*` are architecture tasks defined by
this reconciliation. **Queue task numbers (`TASK-00NN`) are allocated by the Architecture Lead at the
moment of authorization** — this record allocates none.

### 6.1 Operator-only prerequisite, kept separate from Claude-executable work

| ID | Work | Owner | Why it is not Claude work |
|---|---|---|---|
| **T-0** | **Select and deploy an OIDC/OAuth2 identity provider** (Entra ID, AD FS, or an OIDC broker fronting an existing directory) and supply its deployment configuration | **Operator + Architecture Lead / organization** | Requires an organizational product choice and a **privileged host deployment**. No Claude Code session may perform either. MSG-0062 §7.4; CLAUDE.md Non-Negotiable Rule 2 |

**T-0 gates every identity-dependent gate: G12 in full, G3 and G6 in part, and T-E.** MSG-0062 §7.4
requires it established before implementation reaches those gates. It has **no named owner and no
date** — EPA-0004 §11.4 asked for both and MSG-0062 §7.4 supplies the boundary rather than the
assignment. That remains the single largest schedule risk in this work package, and it is an
organizational decision, not an implementation one.

**PR4 (a local inference runtime on the authorized host) and PR6 (host capacity) are likewise
operator prerequisites**, and PR5 (the corpus) is the organization's. Only PR1 and PR2 are the
Architecture Lead's, and both are now MET for the decisions — see §8.

### 6.2 Architecture tasks — required before implementation, each needing its own authorization

| ID | Task | Depends on | Produces | Authority |
|---|---|---|---|---|
| **A-ADR** | Draft the required ADR set of §7 | this reconciliation | The ADRs, with numbers allocated by repository convention at drafting time | MSG-0062 §7.2 |
| ↳ | **EXECUTED as TASK-0024, 2026-08-21 (MSG-0068a/b → MSG-0070).** Delivered **ADR-0017…ADR-0022** as **PROPOSED** drafts in `implementation/decisions/` — one per §7 surface, all six independently judged required. **They are not accepted**; promotion to `docs/decisions/` is the Architecture Lead's. **ADR-0019 is incomplete by design** — D6's normalization rules await the empirical corpus evidence **A-SURVEY** would supply | — | — | — |
| ↳ | **ACCEPTED and PROMOTED, 2026-08-21.** **MSG-0071 accepts all six** — ADR-0019 as a *bounded* decision with its normalization rules still deferred, ADR-0017 with the entailment model and thresholds still open under SPEC-0020. **ADR-0017 was promoted by the Architecture Lead** (`d9c4524`); **ADR-0018…ADR-0022 were promoted by TASK-0025** under MSG-0073 (record → MSG-0075). All six now live in `docs/decisions/` and are **accepted architecture**; the `implementation/decisions/` copies are RATIFIED historical drafts. **A-STACK and A-SURVEY remain unauthorized and no implementation task is READY** | — | — | — |
| ↳ | **THE AMENDMENT IS APPLIED, 2026-08-23 (MSG-0095 → TASK-0031 → MSG-0097), applying commit `a1be892`.** The row below is **superseded and retained** — its account of *what* AMD-01 says is still exact; only its "PROPOSED and NOT APPLIED" state has changed. MSG-0095 accepted it **with the optional traceability row** and directed **in-place** application with a header note, **declining a superseding ADR** — settling AMD-01 §8 as option **(a)**, the repository's **first amendment of an accepted ADR** and a precedent for an *additive clarification changing no substantive policy* only. Three edits: hunk 1 at the end of §4, hunk 2 as one Traceability row, and the header note. `git diff --name-only docs/decisions/` named **ADR-0020 and nothing else**, at **15 insertions / 0 deletions** — the note was *added* rather than replacing a line, so every accepted semantic is **byte-identical** to the promoted copy, and §7's "no index technology … is selected here" is intact. **The ADR set for this work package is now complete and stable. Nothing was selected**, all nine MSG-0092 §4 categories stay open, ADR-0019's §6 deferral is untouched, and **no implementation task is READY** | — | — | — |
| ↳ | **Superseded 2026-08-23 by the row above — retained.** **ONE AMENDMENT IS PROPOSED AND NOT APPLIED, 2026-08-22 (MSG-0092 §3 → TASK-0030 → MSG-0094).** `ADR-0020-AMD-01` in `implementation/decisions/` proposes **one 148-word insertion at the end of ADR-0020 §4**, making the existing §3.1/§4 pre-constrained retrieval requirement explicit as an **engine-selection and gate criterion** — an engine that can only match or rank first and exclude afterwards (including over-fetch-then-discard, at any layer) is **disqualified**, and **G3 is evidenced against the query issued to the engine, not the response returned**, because the two designs return byte-identical responses. **The accepted, promoted ADR-0020 is UNMODIFIED** — `git diff --name-only docs/` empty — and applying the amendment requires an explicit Lead authorization (MSG-0092 §5). **It changes no substantive policy**: the four enforcement points, fail-closed denial, the three named side channels and the Restricted condition are all preserved and were re-checked one by one. **It selects nothing**, and §7's "no index technology is selected here" is deliberately untouched, because **a criterion is not a selection**. **The ADR set otherwise stands as promoted** | — | — | — |
| **A-STACK** | Evaluate and propose the assistant service's concrete implementation stack against `docs/architecture/technology-selection-principles.md` | this reconciliation | A stack proposal; **whether it is recorded as an ADR is that task's question**, not settled here | MSG-0062 §7.7 |
| ↳ | **EXECUTED as TASK-0026, 2026-08-22 (MSG-0076 → MSG-0078).** Delivered **EPA-0005** in `implementation/architecture/`, **PROPOSED — and it selects nothing.** It maps candidate approaches to the accepted EPA ADR set and **preserves every open selection** (§9.2, with the evidence that would close each). Three constraints hold **regardless of the corpus**: **pre-filtered retrieval is a functional requirement on the index engine** (ADR-0020 §3.1/§4 disqualify post-filter-only similarity search — over-fetch-then-filter is the prohibited shape one layer down); **three local models are required, not one** (generation, embedding, **and ADR-0017's entailment layer**), multiplying the unmeasured PR6; and **conversation and audit storage are separate stores** (ADR-0021 §2/§4). **The ADR question above is ANSWERED, not left open** — EPA-0005 §9.3 recommends **not yet**, observing that if the pre-filtering rule warrants recording it belongs with **ADR-0020** rather than in a stack ADR — and **no ADR was created**. **Seven of its questions are corpus-blocked** because A-SURVEY could not run | — | — | — |
| **A-SURVEY** | **Bounded, read-only corpus survey** — formats, language mix, scanned-document prevalence, classification/audience patterns, version and supersession characteristics | this reconciliation | Discovery input fixing D6's normalization rules and sizing D14's rejection exposure | MSG-0062 §7.5 |
| ↳ | **PERFORMED at n=1 as TASK-0027, 2026-08-22 (MSG-0080 + MSG-0083 → MSG-0084). 7/7 acceptance criteria MET.** The organization supplied **one** approved document; it was **read in place outside the repository** and never entered repository history. **What it establishes, about that document only:** it is **text-native, not scanned** — 45 pages, PDF 1.7, Word 2016, tagged, unencrypted, no active content; **107,988 characters decoded from all 45 pages with 0 undecodable glyphs**, and only **two** image XObjects in the entire file (a 103×92 logo and its mask), so **D14's non-text-native rule would not reject it**. It is **English only — 0 Arabic characters**, confirmed structurally (all five `ToUnicode` CMaps Basic-Latin-only; all simple fonts `WinAnsiEncoding`), while declaring **three different English locales** (`en-US` in the catalog, `en-ZA`×1819 and `en-GB`×46 in marked-content spans) — so **a document's own declared language is not a single reliable value**. It carries **no classification marking of any kind**, and its version and approval exist **only as title-page prose** (`Developed: June 2010` / `Revised: November 2024`) with **blank date fields** and a **handwritten-signature convention** — so **at least one real approved policy document carries none of ADR-0018's authority/lifecycle/version/effectivity/supersession metadata in-band**, and all of it would have to be supplied at ingestion. **Three extraction hazards that fail *silently* rather than erroring** (MSG-0084 §5): page 1 draws **every glyph twice**, the second copy an `/Artifact`-tagged drop shadow, so an extractor without marked-content scoping doubles the one page carrying title, authorship and approval; `/Span <</Lang(...)>>` property dictionaries look like body text to a naive regex (1,865 spurious strings); and **page 23 yields 67 characters** because its content is a vector flow chart — text-native, so D14 never fires, yet effectively unreadable, a gap between D14 and ADR-0017's grounding contract. **What it does NOT establish — recorded as INSUFFICIENT with no estimates invented:** format mix, language prevalence, scanned-document prevalence, classification/audience distribution, and version/supersession prevalence **across a corpus**. **Critically, this document supplies no Arabic evidence at all, so MSG-0056a D6 remains exactly as deferred and ADR-0019's normalization rules were not written, inferred, or amended.** **D14's rejection exposure remains completely unmeasured.** **The corpus-scale survey is still outstanding and still the organization's action.** Record: **MSG-0084** | — | — | — |
| ↳ | **Superseded, retained — the position after TASK-0026. AUTHORIZED as part of TASK-0026 but NOT PERFORMED, 2026-08-22 — prerequisite PR5 UNMET.** No approved policy corpus is reachable, **re-verified by inspection during the task** rather than inherited from the earlier records: a tree-wide search for document-like files returned two TypeScript dependency licence texts and nothing else. **No survey figure of any kind was produced** — no format breakdown, language mix, scanned-document prevalence, classification pattern, or version characteristic, *not as estimates, illustrations, or expected values* — and **no method or plan was substituted** for the authorized output, since a method document is easy to mistake later for a completed survey. **MSG-0056a D6 therefore remains partially discharged and ADR-0019's normalization rules remain deferred**, exactly as MSG-0071 accepted them. **The outstanding action is the organization's**: supply representative approved policy material for a read-only survey, or defer A-SURVEY until the corpus exists. Records: **MSG-0077**, **MSG-0078** | — | — | — |

**A-SURVEY carries a hard constraint from its own ruling: it is a discovery/architecture input only.
It must not ingest production content or bypass approval controls.** MSG-0062 §7.5 authorizes it
*before T-B*; it does not authorize it before the Architecture Lead marks it READY.

**A-SURVEY is the survey EPA-0004 §11.5 asked for, and it is worth doing early for the reason EPA-0004
gave: if the real corpus is largely scanned Arabic PDFs, D14's rejection rule is still correct but the
first release answers from a fraction of the corpus — and without the survey nobody discovers that
until T-B runs.**

### 6.3 Implementation sequence — not authorized

| # | Task | Depends on | Gate | Checkpoint |
|---|---|---|---|---|
| T-A | Document authority: lifecycle, versions, effectivity, supersession, ownership, approval with separation of duties | PR1, PR2, A-ADR | G1 | Architecture |
| T-B | Ingestion: extraction, normalization, language detection, classification, validation, chunking, provenance; non-text-native rejection | T-A, **A-SURVEY** | G2 | — |
| T-C | Retrieval index as projection; hybrid lexical + semantic; rebuild path | T-B | G4 | Embedding evaluation under SPEC-0020; **selection is the lead's** |
| **T-D** | **Grounded QA**: evidence selection, context assembly, generation, layered grounding gate, abstention taxonomy | T-C, PR4 | G5, G8 | **Security** |
| **T-E** | **Retrieval-time authorization** and confidentiality at all four points; uniform abstention; side-channel closure; §7.6 enforcement | **T-D**, PR3, T-0 | G3, G6 (partial) | **Security** |
| T-F | Bilingual behaviour: cross-language grounding gate, citation authority resolution, divergence flagging | T-D, T-E | G7 | **Security** |
| T-G | Audit, retention, and question privacy | T-A…T-F | G9, G13 | **Privacy** |
| T-H | Employee frontend | T-D…T-G | — | Enforces nothing; must not soften an abstention |
| T-I | End-to-end security and acceptance verification | all | G6, G10, G11, G12 | **Final security gate** |

### 6.4 T-D before T-E — ruled, and the exposure it creates is now explicit

**MSG-0062 §7.3 rules that T-D (grounded QA) precedes T-E (retrieval-time authorization)**, because
"authorization controls must not be validated against an unproven answer path." Security review remains
a gate on the complete path before release.

**This closes EPA-0004 §11.3 and §5.1, open since EPA-0002.** The ordering EPA-0002 flagged is now the
ruled ordering, on a stated rationale rather than by default.

**The interim exposure the ordering creates does not disappear by being ruled**, and this record states
it rather than letting it pass silently: between T-D and T-E a working answer path exists before
retrieval-time authorization does. EPA-0002 §5 proposed mitigation **(a)** — build T-D against
synthetic, non-confidential fixture documents only, with real-corpus ingestion gated behind T-E.
**MSG-0062 does not rule on the mitigation**, verified by reading §7.3 in full. It is therefore
**carried forward as an open item for the T-D authorization** (§8), not decided here — deciding it
would be an architecture decision beyond MSG-0062/MSG-0063.

---

## 7. Required ADR sequence — proposed, none created

> **Superseded as current state, 2026-08-21 by TASK-0024 (MSG-0070) — the section below is retained as
> issued.** "None created" was true when this record was written and stopped being true the same day.
> **A-ADR has run.** The six surfaces below were each tested independently against the accepted ADR and
> SPEC set, all six were judged required, and **ADR-0017…ADR-0022 now exist as PROPOSED drafts** in
> `implementation/decisions/` — in the order this table sequences them.
>
> **The observation below was correct and was verified again rather than trusted:** the highest
> allocated ADR was **ADR-0016**, and ADR-0017…ADR-0022 were confirmed free by a repo-wide search
> returning only prose references before any file was written.
>
> **Two boundaries this record drew still hold.** The drafts are **PROPOSED and carry no architectural
> authority** — the final call on how many to accept remains the Architecture Lead's, exactly as the
> "stated so the lead can disagree cheaply" paragraph below intends, and MSG-0070 §4 supplies the
> counter-argument for surface 4. **No accepted ADR was modified or duplicated.** **A-STACK and
> A-SURVEY remain unauthorized**, and no seventh surface was added.
>
> **Superseded again, later the same day — the six are now ACCEPTED and PROMOTED.** The paragraph
> immediately above says the drafts carry no authority and that acceptance is the lead's. **The lead
> exercised it: MSG-0071 accepts ADR-0017 … ADR-0022**, all six surfaces, none rejected — including
> surface 4, whose counter-argument was on the table when the decision was made. ADR-0017 was promoted
> by the lead in `d9c4524`; **ADR-0018 … ADR-0022 were promoted into `docs/decisions/` by TASK-0025**
> under MSG-0073, which answers the MSG-0072 promotion gap. Record: **MSG-0075**.
>
> **Two acceptances are bounded, and the bound is part of the accepted decision rather than a caveat on
> it.** ADR-0019's Arabic normalization rules stay deferred to empirical corpus evidence — the record
> still says it is incomplete for production by design, and **no invented rule is authorized**, so the
> D6 obligation that **A-SURVEY** would feed is unchanged. ADR-0017's entailment model and numeric
> thresholds stay open under SPEC-0020.
>
> **Promotion conferred authority; it authorized nothing else.** No provider, model, framework, index
> technology or runtime is selected by any promoted record. **A-SURVEY, A-STACK and T-0 remain
> unauthorized, and no implementation task is READY.**

**MSG-0062 §7.2:** create only the ADRs required to make the accepted architecture enforceable before
production use — the grounded-answer contract, and any new service-boundary/security decisions not
already covered by accepted ADRs. Do not duplicate or modify accepted ADRs.

**No ADR is created, modified, or numbered by this record.** MSG-0062 §7.2 and the TASK-0023 queue
section both place number allocation in the ADR-drafting task (**A-ADR**): *"this task defines the
sequence, it does not create the ADRs."*

**Observation, recorded so A-ADR does not have to re-derive it, and explicitly NOT an allocation:** the
highest accepted ADR on disk is **ADR-0016**, so the next free number is ADR-0017.
EPA-0003 proposed ADR-0017…ADR-0022 for these six surfaces; those numbers are a
**proposal in a PROPOSED record, carrying no authority**, and A-ADR allocates by convention at drafting
time.

The six surfaces are EPA-0004 §11.2's, converted here into a dependency-ordered sequence:

| Order | ADR surface | Settles | Gates / tasks it unblocks | Standing |
|---|---|---|---|---|
| **1** | **Grounded Answer Contract** | D5's layered structural + entailment gate, fail-closed; D12's promotion | **G5, G8** — T-D | **REQUIRED** — named explicitly by §7.2 |
| **2** | **Approved Document Authority and Lifecycle** | D3's privileged upload and author ≠ sole approver; D11's release-1 boundary | **G1** — T-A | **REQUIRED** — T-A is the first implementation task and cannot start without it |
| **3** | **Bilingual Policy Semantics (English/Arabic)** | D1's English authority; **F1's cross-language fail-closed rule**; D6's empirical normalization | **G7, G2** — T-B, T-F | **REQUIRED** — MSG-0056a D6 requires the normalization rule be recorded in an ADR **before production use** |
| **4** | **Retrieval Projection and Index Boundary** | D2's hybrid strategy; D9's service boundary; **§7.6's no-retrieve-then-suppress rule and fail-closed denial** | **G3, G4, G6** — T-C, T-E | **REQUIRED** — §7.6 is a new confidentiality decision no accepted ADR covers |
| **5** | **Employee Question Privacy and Retention** | D7's session default and employee-only read; D4's uniform abstention | **G13, G6** — T-G | **REQUIRED** — D7's employee-only access is not covered by any accepted ADR |
| **6** | **Inference Locality and Provider Boundary** | D8's default prohibition on external inference and the conditions of any future exception | **G10** — T-D, T-I | **REQUIRED** — ADR-0005 makes offline-first the norm; **D8 is stricter** (prohibition, not preference), and the difference needs recording |

**Why all six are marked REQUIRED, stated so the lead can disagree cheaply:** §7.2's test is
*"required to make the accepted architecture enforceable before production use."* Each of the six
carries at least one ruling that is **stricter than, or absent from, the accepted ADR set** — and a
rule that lives only in a PROPOSED `implementation/` record is not enforceable authority. **The final
call on how many to create is the Architecture Lead's**, per §7.2 and EPA-0004 §11.2; this record
supplies the sequence and the justification, not the decision.

**No duplicates are proposed.** **ADR-0016** (tenant isolation) and **ADR-0007** (identity) are reused
unchanged and need no successor — EPA-0004 §14. **ADR-0011 / SPEC-0002** are not engaged, because the
assistant has no tool surface and performs no mutation; engaging either later is itself an ADR.

**The stack decision is deliberately not in this table.** MSG-0062 §7.7 assigns it to a dedicated
architecture task (**A-STACK**), and whether its output is an ADR is that task's question. Adding a
seventh surface here would decide it in advance.

---

## 8. Open items — what is settled, and what is not

**All seven items EPA-0004 §11 referred to the Architecture Lead are RULED by MSG-0062:**

| EPA-0004 item | Ruling | Where it now lives |
|---|---|---|
| §11.1 Work-package number | §7.1 — allocate new, repurpose nothing | **§1 — WP-0009** |
| §11.2 ADR surface | §7.2 — create only what is required; numbers at drafting | **§7 — six surfaces, sequenced** |
| §11.3 T-D before T-E | §7.3 — **T-D precedes T-E** | **§6.4** |
| §11.4 PR3 — IdP | §7.4 — integrate, never implement; operator/organization action | **§6.1 — T-0** |
| §11.5 PR5 — corpus survey | §7.5 — **authorized before T-B**, discovery only | **§6.2 — A-SURVEY** |
| §11.6 Restricted documents | §7.6 — eligible; **no retrieve-then-suppress**; fail closed | **§5, §7 surface 4** |
| §11.7 Implementation stack | §7.7 — **ADR-0015 not inherited**; dedicated task proposes | **§6.2 — A-STACK** |

**Three items remain genuinely open. None is a reopened decision; each is a consequence a ruling does
not itself resolve.**

1. **The T-D/T-E interim exposure and its mitigation** (§6.4). §7.3 fixes the order and is silent on
   the mitigation. To be decided when T-D is authorized.
2. **PR3's owner and date** (§6.1). §7.4 fixes the boundary and names no provider, owner, or date.
   Organizational.
3. **Which PLAN-WP-0001 entries WP-0009 satisfies, supersedes, or sits beside** — see
   `docs/program/work-packages.md` §0. §7.1 settles *the number*; the planning relationship is a
   program-structure judgment and remains the Architecture Lead's. **It blocks nothing.**

**Prerequisite state, 2026-08-21:** PR1 **MET for the decisions** (all fourteen ruled, F1–F4 ruled) —
**EPA-0001 and EPA-0002 remain PROPOSED; EPA-0004 is ACCEPTED**. PR2 **MET as to the definition**
(MSG-0062 accepts it) and **NOT MET as to implementation** — MSG-0062 states plainly that acceptance
"does not authorize implementation". PR3, PR4 **NOT MET**. PR5, PR6 **UNKNOWN**.

> **Updated later on 2026-08-21, after the ADR set was accepted and promoted (TASK-0025, MSG-0075).**
> The line above is unchanged and still accurate; what follows is what the promotion adds to it.
> **The §7 ADR dependency is now discharged: ADR-0017 … ADR-0022 are accepted architecture in
> `docs/decisions/`.** Under the CLAUDE.md authority order they now sit at tier 2, above the COMMS
> messages that previously carried these rulings — which was the whole point of drafting them.
>
> **Nothing else moved.** PR2 is still NOT MET as to implementation; PR3 and PR4 are still NOT MET;
> PR5 and PR6 are still UNKNOWN. The three open items above are all still open — promotion touched
> none of them. **A-SURVEY, A-STACK and T-0 remain unauthorized**, so ADR-0019's deferred normalization
> rules and D14's unmeasured rejection exposure stay exactly where they were.

> **Updated 2026-08-22 by TASK-0026 (MSG-0078). One prerequisite sharpens; the rest are unchanged.**
> **PR5 moves from UNKNOWN to VERIFIED UNMET** — the corpus was searched for during A-SURVEY's
> prerequisite check and **is not reachable from this repository**. That is a stronger statement than
> "unknown": it was looked for, in this repository, on this date. **It is not a claim about whether the
> organization possesses such material** — only about what is reachable here, which is the boundary the
> survey depends on.
>
> **PR6 remains UNKNOWN, and EPA-0005 §3.5 makes it larger than it looked**: the capability needs
> **three** concurrent local models — generation, embedding, and ADR-0017's entailment layer — not one.
>
> **Nothing else moved.** PR1 unchanged; PR2 still NOT MET as to implementation; PR3 and PR4 still NOT
> MET. **T-0 remains unauthorized**, and no implementation task is READY. **A-STACK is now executed**
> (§6.2); **A-SURVEY is authorized-but-unperformed**, so ADR-0019's deferred normalization rules and
> D14's unmeasured rejection exposure **stay exactly where they were** — the one thing A-SURVEY existed
> to move is the one thing that did not move. The three open items above all remain open.

> **Updated 2026-08-22 by TASK-0027 (MSG-0084). PR5 moves again — partly.**
> **PR5 is MET at n=1 and UNMET at corpus scale, and the distinction is the whole point.** The
> organization supplied **one** approved document at `D:\Work\pci-corpus\plan.pdf`, deliberately outside
> the repository; it was **read in place** and surveyed successfully. So PR5 is no longer "verified
> unmet" — material exists and is reachable. **But PR5 asks for *representative* approved policy
> material, and one document is not representative of anything.** The corpus-scale prerequisite is
> unchanged and still the organization's action.
>
> **What moved for the architecture, and what did not.** **D14's rejection exposure is still completely
> unmeasured** — this document is text-native, which is one data point about one document and no
> estimate of prevalence. **ADR-0019's deferred normalization rules did not move at all**: the supplied
> document contains **zero Arabic characters**, so A-SURVEY produced **no Arabic evidence whatsoever**,
> and **MSG-0056a D6 remains exactly as partially discharged as MSG-0071 accepted it.** No normalization
> rule was invented or inferred, and **ADR-0019 was not amended**.
>
> **What A-SURVEY did add** is unrelated to prevalence and useful anyway: **at least one real approved
> policy document carries none of ADR-0018's authority, lifecycle, version, effectivity or supersession
> metadata in-band** — an existence claim n=1 can carry — and **three extraction hazards that corrupt
> ingestion silently** rather than failing (MSG-0084 §5), one of which is a **gap between D14 and
> ADR-0017's grounding contract**: a text-native page whose meaning is entirely vector graphics passes
> D14 and yields 67 characters.
>
> **Nothing else moved.** PR1 unchanged; PR2 still NOT MET as to implementation; PR3 and PR4 still NOT
> MET; **PR6 remains UNKNOWN**. **T-A, T-B, T-D, T-E and T-0 remain unauthorized**, no implementation
> task is READY, and no ADR was touched. The three open items above all remain open.

---

## 9. What this record does not do

- **It authorizes no implementation.** MSG-0062: acceptance "does not authorize implementation,
  provider selection, runtime changes, or permissions changes." MSG-0063 forbids any implementation
  task being marked READY.
- **It creates and modifies no ADR.**
- **It selects no provider, model, embedding technology, index technology, framework, or runtime.**
- **It changes no permission, security boundary, Supervisor behaviour, or schedule.**
- **It renumbers, renames, and deletes no existing record** — historical WP-0001 and all eight
  planning entries are intact.

**The next action is the Architecture Lead's:** authorize one bounded architecture task from §6.2 and
reconcile it into `implementation/operations/CLAUDE-TASKS.md` as the single READY task. Until then the
correct queue state is **no READY task**, which is the architecture-gate boundary working as designed
rather than a stall.
