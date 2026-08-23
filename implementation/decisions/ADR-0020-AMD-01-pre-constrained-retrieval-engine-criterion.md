# ADR-0020 AMD-01 — Proposed amendment: pre-constrained retrieval as an engine-selection and gate criterion

**Status:** **ACCEPTED (MSG-0095) and APPLIED IN PLACE** — 2026-08-23, commit
`a1be892178dea11d62dee6693c7c8d7d80798e43`, by TASK-0031.
**Applied to:** `docs/decisions/ADR-0020-retrieval-projection-and-index-boundary.md` — **both hunks**,
plus the header note MSG-0095 required. That ADR is now the authoritative text; **this file is the
proposal record and is no longer the operative copy.**
**Date:** 2026-08-22 (drafted) · 2026-08-23 (accepted and applied)

> **The status line this replaces, retained:** "**PROPOSED — for Architecture Lead review. NOT
> APPLIED.**" True from drafting until MSG-0095 ruled on it.
**Drafted by:** Claude Code — TASK-0030, under MSG-0092 §3 and §5
**Amends (if accepted):** `docs/decisions/ADR-0020-retrieval-projection-and-index-boundary.md` — **ACCEPTED**, promoted by MSG-0071
**Work package:** WP-0009 — Employee Policy Assistant
**Scope:** one insertion at the end of ADR-0020 §4, plus one optional traceability row
**Selects:** nothing — no retrieval engine, index engine, embedding model, framework, runtime, or provider

> **Superseded 2026-08-23 — the boundary described below was real, was respected, and has since been
> passed by explicit authorization.** MSG-0095 is the "subsequent explicit authorization" MSG-0092 §5
> anticipated: it accepted this amendment **with the optional traceability row** and directed that it
> be applied **in place**. TASK-0031 applied it. **ADR-0020 is now modified, and that is authorized.**
> The paragraph below is retained as the record of why TASK-0030 stopped where it did.
>
> > **This file is a draft for review. The accepted ADR-0020 is unmodified.** Applying an amendment to a
> > promoted ADR is the Architecture Lead's act, exactly as promotion was (TASK-0025 / MSG-0073).
> > MSG-0092 §5 is explicit: *"stop before applying the amendment unless a subsequent explicit
> > authorization permits acceptance."* This session stopped.

---

## 1. What was asked for

MSG-0092 §3:

> "However, the pre-filter requirement in §9.1(1) is important enough to make its enforcement
> unambiguous. **Authorize a narrow follow-on governance task to draft the minimum
> clarification/amendment to ADR-0020, without changing its substantive policy**, specifically making
> the existing §3/§4 pre-constrained retrieval requirement explicit as an engine-selection/gate
> criterion. No retrieval engine is selected by that task."

The settled constraint being made explicit, MSG-0092 §1(1):

> "Retrieval must enforce authorization-relevant constraints **inside the retrieval operation**.
> Retrieve-then-filter or over-fetch-then-filter is not acceptable."

## 2. What ADR-0020 §§3–4 already say — quoted, not summarised

From the accepted copy, `docs/decisions/ADR-0020-retrieval-projection-and-index-boundary.md`.

**§3, in full:**

> ### 3. Authorization is enforced at four points, each independently sufficient to deny
>
> 1. **Query construction** — the candidate set is built **already constrained** to the authorized,
>    in-scope, published, effective corpus. Unauthorized content is never a candidate.
> 2. **Post-retrieval re-check** — every hit is re-authorized against its version's classification and
>    audience before entering evidence selection.
> 3. **Data layer** — organizational scope is enforced by RLS under **ADR-0016, reused unchanged**: FORCE
>    RLS, a runtime role that is neither `SUPERUSER` nor `BYPASSRLS`, cross-scope reads returning **404,
>    not 403**.
> 4. **Citation resolution** — opening a cited passage **re-authorizes**. A citation link is not a
>    capability; if entitlements changed between the answer and the click, the click is denied.
>
> **No single point may be the only thing preventing access.** A design in which three are decorative
> fails G3 however correct its output looks.

**§4, in full:**

> ### 4. No retrieve-then-suppress — the rule this ADR exists for
>
> Per MSG-0062 §7.6:
>
> > **A document the authenticated subject is not authorized for is NEVER retrieved into the request.**
>
> Retrieving broadly and filtering afterwards is a **gate failure**, not a style preference — however
> correct the resulting response happens to look. **An exclusion cannot fail open; a filter can.**

## 3. The gap — it is consequence, not policy

**The policy is already there and does not need changing.** §3.1 requires the candidate set be built
"already constrained"; §4 makes retrieving broadly and filtering afterwards a gate failure. Both are
unambiguous **as statements about system behaviour**.

**Two consequences of that policy are not stated, and both are the ones an implementer gets wrong:**

1. **Engine selection.** Neither section says that the rule **disqualifies a retrieval or index engine
   that cannot apply authorization constraints within the query**. As written, the ADR can be read as
   a constraint on how the assistant is built, satisfiable by any engine plus careful surrounding
   code — which is exactly the reading that permits post-filtering.
2. **Where the gate looks.** §3's closing line — "A design in which three are decorative fails G3
   however correct its output looks" — points at the right failure but does not say what G3 inspects.
   A conforming and a non-conforming design **return byte-identical responses**. If G3 is evidenced
   from the response, it cannot tell them apart.

EPA-0005 §3.3 named this precisely, and MSG-0092 accepted that record: the usual workaround —
over-fetch top-k, then filter — is **the prohibited shape executed one layer down, where it is harder
to see**, and *"an implementer could violate this while believing they conform, because post-filtering
looks like enforcement."*

**This is a real gap, not a manufactured one.** The queue's stop condition — "ADR-0020 §§3–4 turn out
to already state the consequence unambiguously … report that no amendment is needed rather than
manufacturing one" — was tested against the accepted text above and **does not apply**: the sections
state the rule and are silent on the engine consequence.

## 4. Proposed wording — hunk 1 (the amendment proper)

**Insertion point:** at the end of **§4**, after the sentence *"An exclusion cannot fail open; a filter
can."* **Nothing existing is deleted or reworded.**

> **Consequence for engine selection, and for what the gate inspects.** This rule is a **selection
> criterion**, not only a description of correct behaviour. A retrieval or index engine may be adopted
> only if authorization-relevant constraints can be expressed and applied **within the retrieval
> operation itself**, so that unauthorized content is never a candidate under §3.1. An engine that can
> only match or rank first and exclude afterwards — including over-fetching a wider candidate set and
> discarding the surplus, **at any layer, including inside the retrieval component** — does not satisfy
> §3.1 and is **disqualified**. **G3 is therefore evidenced against the query actually issued to the
> engine, not against the response returned to the caller**, because a conforming and a
> retrieve-then-filter design can return identical responses.
>
> **This criterion selects no engine and rules none in.** It states the bar a candidate must clear;
> selection remains open exactly as recorded in §7 and in *Deliberately not decided here*.

**Word count: 148 words, one paragraph plus one disclaiming sentence.**

## 5. Proposed wording — hunk 2 (optional, recommended, separable)

One row appended to the **Traceability** table, so the new text traces to accepted authority rather
than appearing without provenance:

> | Pre-constrained retrieval as an **engine-selection criterion**; G3 evidenced at the query | MSG-0092 **§1(1)** and **§3**; EPA-0005 §3.3 (ACCEPTED) |

**It is offered separately because it is not strictly required to remove the ambiguity.** Hunk 1 stands
alone. If the Lead wants the absolute minimum, take hunk 1 and drop hunk 2.

## 6. Minimality — what was deliberately NOT changed

Minimum was treated as a constraint, not an aspiration. Everything below was considered and left
alone:

| Not changed | Why |
|---|---|
| **§3's four numbered points** | They already say "already constrained" and "never a candidate". Editing them to add the engine consequence would reword accepted policy text to make a point that belongs in §4 |
| **§3's closing line** ("No single point may be the only thing…") | Correct as it stands; the gate-evidence clarification is additive in §4 rather than a rewrite here |
| **§4's existing text**, including the MSG-0062 §7.6 block quote | Untouched — the insertion follows it |
| **§5** — fail-closed and the three named side channels | Unrelated to engine capability; touching it would be a tidy-up |
| **§6** — Restricted eligibility and its three obligations | Untouched; the carve-out conditions are unchanged |
| **§7** — retrieval strategy, "no index technology … is selected here" | A criterion is not a selection. §7 must keep saying nothing is selected, and it does |
| **§8** — service boundary; ADR-0015 not inherited | Out of scope |
| **§1, §2** — index-as-projection; chunks inherit authorization exactly | Out of scope |
| **Consequences** section | A bullet could be added, but §4 is where the rule lives and one statement of it is enough. Two statements invite drift |
| **Deliberately not decided here** | Still accurate and must stay accurate: engine selection remains the Lead's under SPEC-0020 |
| **Context, Rationale, reuse-before-create test** | Historical argument; not amended |
| **Header block** | See §8 — how an amendment is *recorded* on an accepted ADR is the Lead's convention to set, not this draft's to invent |
| **ADR-0017, ADR-0018, ADR-0019, ADR-0021, ADR-0022** | Not touched at all, per MSG-0092 §5 |

## 7. No substantive policy change — how that was checked

Each accepted semantic was re-read in the accepted copy and compared against the proposed text:

| Accepted semantic | Preserved? | Check |
|---|---|---|
| **The four enforcement points**, each independently sufficient to deny | **Yes** | The insertion adds no point, removes none, and reorders none. It references §3.1 without restating it |
| **No single point may be the only thing preventing access** | **Yes** | Untouched. The insertion constrains the *engine* used at point 1; it does not make point 1 sufficient on its own |
| **Fail-closed denial** (§5) | **Yes** | Not referenced and not modified |
| **The three named side channels** — existence, timing/result-count, audit/analytics (§5) | **Yes** | Not referenced and not modified. The new text mentions identical *responses*, which is an argument about gate evidence, **not** a claim that response uniformity is sufficient |
| **Restricted documents eligible under condition** (§6) | **Yes** | Not referenced and not modified |
| **Authorized-subject-only, never-in-logs, local-is-not-safe** (§6.1–6.3) | **Yes** | Not referenced and not modified |
| **Hybrid retrieval shape; no technology selected** (§7) | **Yes** | The insertion explicitly reaffirms it: *"selects no engine and rules none in"* |
| **Index is a projection; rebuild is a no-op; stale ⇒ abstain** (§1) | **Yes** | Not referenced and not modified |

**Is "over-fetch-then-filter" a new policy?** It is the one phrase in hunk 1 that is not already in
ADR-0020's own words — it comes from **MSG-0092 §1(1)**, which is the Architecture Lead's accepted
ruling and states it verbatim. It is therefore a restatement of settled authority, not an invention.
**It is flagged here rather than buried** so the Lead can strike it if they read it as an addition
rather than a clarification; hunk 1 still removes the main ambiguity without it, though less sharply.

## 8. One question for the Architecture Lead — a convention, not a blocker

> **ANSWERED 2026-08-23 by MSG-0095: option (a), in place.** The Lead directed that the amendment be
> applied in place with "a concise amendment note in its header identifying AMD-01 and MSG-0095", and
> explicitly declined (b): *"Do not create a superseding ADR."* The note applied reads
> `**Amended:** 2026-08-23 — AMD-01 (MSG-0095), applied in place: §4 engine-selection criterion`.
>
> **This is the repository's first amendment of an accepted ADR, so it is now the precedent** — for an
> *additive clarification that changes no substantive policy*. It is not authority to edit a promoted
> ADR in any other circumstance: MSG-0095 §3 authorizes "acceptance/application of AMD-01 only".
> The section below is retained as the record of the choice that was open.

**There is no precedent in this repository for amending an already-accepted ADR.** ADR-0015 and
ADR-0016 carry `**Supersedes:**` lines, but those record *promotion of a draft*, not amendment of an
accepted record. Two conventions are available and the choice is the Lead's:

- **(a) In place** — insert hunk 1 into `docs/decisions/ADR-0020-*.md` and add an amendment note to
  its header (`**Amended:** 2026-08-22 — AMD-01, MSG-00xx`), keeping one authoritative file.
- **(b) Superseding record** — issue a new accepted ADR that supersedes ADR-0020 in whole.

**(a) is the smaller and, for a 148-word additive clarification, the proportionate one** — but it
edits a promoted file, and this draft does not presume that authority. **No header change is drafted
here**, because inventing the convention would be exactly the silent-architecture-change this task
forbids.

## 9. What this draft does not do

- **It selects no retrieval engine, index engine, extraction toolchain, embedding model, generation
  model, entailment model, serving runtime, application framework, frontend framework, or identity
  provider.** MSG-0092 §4's nine open categories are all still open.
- **It creates no new generic stack ADR** — MSG-0092 §3 declined one.
- **It writes no Arabic normalization rule.** ADR-0019's §6 deferral is unchanged, and the n=1 Arabic
  evidence does not become production corpus evidence.
- **It marks no implementation task READY**, and starts none of T-A, T-B, T-D, T-E or T-0.
- ~~**It modifies no file under `docs/`.**~~ **No longer true, and deliberately not deleted.** As
  drafted this file modified nothing under `docs/`; **on application under MSG-0095 it modified exactly
  one file** — `docs/decisions/ADR-0020-retrieval-projection-and-index-boundary.md`, in three places,
  with **15 insertions and 0 deletions**. Every other bullet in this section still holds: **no engine,
  index technology, embedding model, framework, runtime or provider is selected**, no generic stack ADR
  was created, ADR-0019's §6 Arabic deferral is untouched, and **no implementation task is READY.**
