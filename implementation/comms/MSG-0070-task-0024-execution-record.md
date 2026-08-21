# MSG-0070 — TASK-0024 Execution Record: the EPA ADR set is drafted

**Status:** RECORD — created; the drafts await the Architecture Lead's acceptance
**From:** Claude Code
**To:** Architecture Lead
**Related:** MSG-0068a, MSG-0068b (authorization) · MSG-0069 (queue reconciliation) · MSG-0062 §7.2 ·
MSG-0067 · MSG-0056a · MSG-0056b · MSG-0058 · WP-0009 §7 · EPA-0004 · TASK-0024
**Date:** 2026-08-21

---

## 1. What was done

TASK-0024 (**A-ADR**) was executed by a supervisor-started session (`runner.lock` pid 26328, acquired
2026-08-21T19:27:19Z). It drafted **six ADRs** as **PROPOSED** records in `implementation/decisions/`,
covering the six surfaces WP-0009 §7 sequences.

| ADR | Title | Surface | Settles | Gates it makes enforceable |
|---|---|---|---|---|
| **ADR-0017** | Grounded Answer Contract | 1 | D5, D12 | G5, G8 — T-D |
| **ADR-0018** | Approved Document Authority and Lifecycle | 2 | D3, D11 | G1 — T-A |
| **ADR-0019** | Bilingual Policy Semantics (English/Arabic) | 3 | D1, F1, **D6 partial** | G7, G2 — T-B, T-F |
| **ADR-0020** | Retrieval Projection and Index Boundary | 4 | D2, D9, **§7.6** | G3, G4, G6 — T-C, T-E |
| **ADR-0021** | Employee Question Privacy and Retention | 5 | D7, D4 | G13, G6 — T-G |
| **ADR-0022** | Inference Locality and Provider Boundary | 6 | D8 | G10 — T-D, T-I |

**Being documentary, this task produced no test count and claims none.** Its verification section
forbids reporting one. Each acceptance criterion is mapped to re-readable evidence in §2.

---

## 2. Acceptance criteria — the union of spec A, spec B and MSG-0068b

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| 1 | Existing accepted ADRs identified, verified, **neither duplicated nor modified** | **MET** | All sixteen read in full this session. `git status --porcelain` before commit shows **no path under `docs/decisions/`** — checkpoint 2 |
| 2 | Minimal new ADR set **justified against WP-0009 §7.2** | **MET** | Each draft carries a *"Why a new ADR is required — the reuse-before-create test"* section naming the candidate existing authority and what it does not cover. Summary: §3 |
| 3 | Numbers follow repository convention and are **collision-free** | **MET** | Checked against actual repository state before drafting: `docs/decisions/` = ADR-0001…0016, no gaps; repo-wide grep for ADR-0017…0029 returned **only prose references**, zero record files — checkpoint 1 |
| 4 | Each draft **traceable to accepted authority** | **MET** | Every draft carries a `## Traceability` table mapping each element to MSG-0056a/b, MSG-0058, MSG-0062, MSG-0067, an accepted ADR, an accepted SPEC, or a security standard |
| 5 | Internally consistent with MSG-0062, MSG-0067, EPA-0004, WP-0009 | **MET** | §5 records the consistency check, including the four cross-ADR seams |
| 6 | **No implementation authorized or performed**, and none implied | **MET** | No code, no schema, no migration, no provider/model/stack selection, no permission or Supervisor change. Every draft carries a *"Deliberately not decided here"* section |
| 7 | Evidence identifies **every ADR created, or why a surface needs none** | **MET** | §1 table; §3 gives the per-surface justification. **All six were judged required** — the reasoning, including the marginal case, is in §3 and §4 |
| 8 | Committed and recorded in COMMS | **MET** | This record; commit and push quoted in checkpoint 3 |

---

## 3. The reuse-before-create test — done independently, not inherited

**WP-0009 §7 marks all six surfaces REQUIRED and invites disagreement**: *"stated so the lead can
disagree cheaply."* That recommendation was treated as a **hypothesis to test**, not a conclusion to
transcribe. Each surface was checked against the accepted ADR set — read in full — and the relevant
accepted specifications.

**All six were independently judged required, and the reason is structural rather than six separate
coincidences.** Every one of them rests on a ruling that is **stricter than, or wholly absent from,
the accepted set**, and each of those rulings currently exists **only in a COMMS message**. Under the
CLAUDE.md authority order, communications are not an authority tier — accepted ADRs are tier 2,
accepted specifications tier 3. **A rule that lives only in a ruling message or a PROPOSED
`implementation/` record is not enforceable authority**, which is precisely the gap MSG-0062 §7.2 exists
to close.

| Surface | Nearest accepted authority | The delta that requires an ADR |
|---|---|---|
| 1 Grounded answer | SPEC-0015, SPEC-0013 require citations and evidence | Neither makes an **uncited claim a violation**, mandates **post-generation validation**, or makes abstention the only alternative. **No accepted ADR addresses answer grounding at all** |
| 2 Document authority | ADR-0013 (ownership), SPEC-0022 (approval) — both **reused unchanged** | SPEC-0022's multi-person clause is discretionary (*"may be required"*) and its self-approval rule is scoped to **agents**. **D3's "the author must not be the sole approver"** — a rule about humans — is in neither |
| 3 Bilingual | **None.** Verified: searching all sixteen ADRs for *language/Arabic/bilingual/i18n/localization* returns two hits, ADR-0006's "programming language" and ADR-0011's "natural-language requests" | A genuine authority vacuum the organization filled via MSG-0056b D1 and MSG-0058 F1 |
| 4 Retrieval boundary | SPEC-0013, SPEC-0015, ADR-0016 (**reused unchanged**) | **The marginal case — see §4** |
| 5 Question privacy | SPEC-0006 (configurable retention), ADR-0009 (secrets), SPEC-0021 (agent memory) | Employee questions are **personal data, not secrets**; SPEC-0021 is scoped to agent memory. **D7 restricts an ordinary administrator's read access** — a boundary nothing accepted establishes, and one an implementer reasoning from the rest of the platform would remove as an oversight |
| 6 Inference locality | ADR-0005, ADR-0014 (**reused unchanged, not modified**) | The accepted set says external inference must never be **required**; ADR-0014 expressly contemplates optional customer-permitted use. **D8 says prohibited.** An engineer reasoning correctly from ADR-0005 + ADR-0014 would ship an optional external provider and be wrong |

**No duplicates were created.** ADR-0007 and ADR-0016 are reused unchanged and need no successor, as
WP-0009 §7 and EPA-0004 §14 both state. **ADR-0011 and SPEC-0002 are not engaged** — no tool surface, no
mutation.

---

## 4. Surface 4 was the close call, and the argument against it is recorded

**Honest disclosure: surface 4 is the one where a reasonable reviewer could rule the other way**, and
that is worth more to you than a uniform "all six required".

**The case against a new ADR:** SPEC-0013 already requires authorization "before results enter
application or AI context" and forbids "a side-channel indication of sensitive contents". SPEC-0015
requires authorization "before retrieval". One could argue MSG-0062 §7.6 restates accepted
specifications.

**Why the draft nonetheless treats it as required — three reasons, any one sufficient:**

1. SPEC-0013's wording — *"before results enter application or AI context"* — **permits retrieving into
   the application and filtering before the model.** §7.6 forbids exactly that shape: the document is
   never retrieved **into the request**. The specification is compatible with the design §7.6 rules out.
2. **Timing and result-count side channels are named in no accepted specification.** SPEC-0013 covers
   disclosure of *contents*; two responses can be textually identical and still distinguishable.
3. §7.6 is a **new confidentiality decision** and a specification is a lower authority tier than an ADR.

**If you disagree, surface 4 is the one to reject**, and rejecting it would leave §7.6 resting on
SPEC-0013 plus the ruling message. The draft states the counter-argument in its own text so the decision
can be made without re-deriving it.

---

## 5. Consistency check, and the four cross-ADR seams

Checked against MSG-0062, MSG-0067, MSG-0056a/b, MSG-0058, EPA-0004 and WP-0009. **No conflict with
accepted authority was found.** Four seams run between drafts and were made explicit rather than left to
be discovered during implementation:

1. **ADR-0019 extends ADR-0017's gate across a language boundary.** ADR-0017 defines the layered
   fail-closed gate; ADR-0019 adds the cross-language rule and the abstention that follows a failure.
   ADR-0019 does not restate the gate.
2. **ADR-0021 owns abstention uniformity; ADR-0017 and ADR-0020 defer to it.** D4's A1/A2
   indistinguishability is a disclosure rule, and putting it in one place prevents it being implemented
   in one and forgotten in the other.
3. **ADR-0020 owns Restricted handling; ADR-0022 explicitly does not relax it.** ADR-0022 §5 states that
   local execution relaxes no other control, quoting the accepted standard's own line to that effect.
4. **ADR-0018 owns the lifecycle; ADR-0020 consumes it.** Only PUBLISHED, effective versions are
   projected; the projection rule lives with retrieval, the answerability rule with authority.

**MSG-0067 §1 is carried into ADR-0020's consequences**: T-D precedes T-E, and T-D testing is limited to
synthetic or non-confidential documents until T-E is implemented **and verified**. It is recorded as a
precondition of the ordering being safe, not as background.

---

## 6. Two things deliberately not done, both of which would have looked helpful

### 6.1 The drafts are PROPOSED, in `implementation/decisions/` — not accepted into `docs/decisions/`

**Claude Code does not accept architecture.** `implementation/decisions/README.md` states the
convention: *"Records here are PROPOSED, never accepted. They carry no architectural authority until the
architecture lead promotes them to `docs/decisions/`."* **ADR-0015 and ADR-0016 are the precedent** —
each was drafted PROPOSED there, and the accepted `docs/decisions/` version carries
`Supersedes: implementation/decisions/… (PROPOSED)`.

Neither MSG-0068a nor MSG-0068b grants acceptance authority; both authorize *drafting*. Writing these
into the accepted register would also have put PROPOSED records into `docs/decisions/`, which is the
register acceptance criterion 1 protects.

**Number allocation still happened at drafting time**, exactly as required — the ADR-0015/0016 precedent
shows numbers are allocated in `implementation/decisions/` and carried through promotion unchanged.

### 6.2 ADR-0019 does not contain the Arabic normalization rules

MSG-0056a **D6** rules that normalization must **not** be frozen now, may be determined **empirically
against the real corpus**, and that the final rule **must be recorded in an ADR before production use**.

No corpus survey exists — **A-SURVEY** (WP-0009 §6.2) is defined and **not authorized**. ADR-0019
therefore records the **obligation** and three constraints that are fixed regardless of the eventual rule
set (raw authoritative text immutable; ingestion-time and query-time normalization identical; the rule
set versioned and recorded), and states plainly that **it must be amended before production use**.

**Inventing alef/hamza, ta marbuta, tatweel, diacritic and digit rules now would have substituted this
session's guess for the evidence the ruling explicitly requires.** D6 is therefore **partially
discharged**, disclosed here and in the draft rather than papered over.

---

## 7. One finding — a summary that has been read as stricter than the accepted standard

**Not a stop condition, and not a conflict. It removes an apparent conflict rather than creating one.**

EPA-0001 §7.3 and EPA-0004 §11.6 both state the classification rule as absolute — *"Restricted-class
content must not enter model context at all"* — and EPA-0004 §11.6 built an open decision on that
reading. The accepted standard, `docs/security/data-classification.md`, actually reads:

> "Restricted data must never be placed in prompts, logs, Git, or Knowledge Objects **unless
> specifically designed for that data class and protected accordingly**."

**The accepted rule is conditional.** Reading it in full is what makes **MSG-0062 §7.6** — Restricted
documents eligible for the corpus, never retrieved unless the subject satisfies policy — **consistent
with the accepted standard** rather than in tension with it. Had the absolute reading been correct, §7.6
would have needed escalation as a documentation conflict.

ADR-0020 §6 records the carve-out and the three obligations that come with it, one of which is easy to
lose: **the prohibition on Restricted data in *logs* carries no authorization exception.** An authorized
subject may see the content; the log may not contain it.

**No correction is proposed to EPA-0001 or EPA-0004** — they are PROPOSED and ACCEPTED records
respectively, and amending either is outside TASK-0024's scope. It is recorded so a later session does
not re-derive the tension and stop on it.

---

## 8. Boundaries respected

- **No implementation, and no product or runtime work of any kind.**
- **No provider, model, embedding, framework, index technology, runtime, or stack selected.** Every
  draft carries an explicit *"Deliberately not decided here"* section. **A-STACK remains unauthorized**,
  and ADR-0020 §8 states that ADR-0015 is not inherited and no replacement is chosen.
- **No production corpus ingestion**, and **no corpus survey** — A-SURVEY is not authorized.
- **No permission, security-boundary, Supervisor behaviour, or scheduling change.**
- **No operator-only or privileged action.**
- **No accepted ADR modified, duplicated, renamed, or deleted** — verified by `git status --porcelain`.
- **No task marked READY.** T-A, T-B, T-C, T-D, T-E and every other implementation task remain
  unauthorized. **The queue has zero READY tasks after this record.**

---

## 9. Decisions required from the Architecture Lead

**None is self-authorized, and none blocks anything already recorded.**

1. **Accept, amend, or reject each of ADR-0017…ADR-0022**, and promote what is accepted to
   `docs/decisions/`. **Surface 4 (ADR-0020) is the one with a stated counter-argument** — §4.
2. **Whether all six are required.** WP-0009 §7 left the final count to you, and this task's independent
   test agreed with all six rather than assumed them. §3.
3. **ADR-0019's normalization gap.** It is incomplete for production by design (§6.2). Either authorize
   **A-SURVEY** so the empirical rule set can be determined, or rule that it is deferred to T-B — but the
   ADR cannot be promoted as production-complete until one of those happens.
4. **The next bounded architecture task**, if any: **A-STACK** or **A-SURVEY** from WP-0009 §6.2. Both
   remain unauthorized.

**The reconciliation warning applies to whichever you authorize next, and the count now stands at
seven** (MSG-0044, MSG-0060, MSG-0064, MSG-0069 and the earlier recurrences). An authorization that is
not reconciled into `CLAUDE-TASKS.md` as the single READY task leaves the Supervisor idling on a
healthy-looking `no READY task` — which was **observed live** at 19:07:18Z and 19:17:18Z on 2026-08-21
while TASK-0024 sat authorized.

---

## 10. What a completely new session needs to know

- **Six PROPOSED ADR drafts exist** at `implementation/decisions/ADR-0017…ADR-0022`. They carry **no
  architectural authority** until promoted to `docs/decisions/`.
- **TASK-0024 is COMPLETE. No task is READY.** The boundary is acceptance, and it is the Architecture
  Lead's.
- **ADR-0019 is knowingly incomplete** — the Arabic normalization rule set is deferred to empirical
  corpus evidence per MSG-0056a D6. That is a ruling being honoured, not an omission.
- **Nothing is implementable.** WP-0009 remains `DEFINED — NOT AUTHORIZED FOR IMPLEMENTATION`.
