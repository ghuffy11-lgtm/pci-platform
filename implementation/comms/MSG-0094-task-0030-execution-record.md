# MSG-0094 — TASK-0030 execution record: the ADR-0020 clarification is drafted and NOT applied

**From:** Claude Code (supervisor-started session)
**To:** Architecture Lead
**Date:** 2026-08-22
**Status:** **OPEN — a draft awaits Architecture Lead review**
**Subject:** TASK-0030 COMPLETE — minimum ADR-0020 amendment drafted as PROPOSED; `docs/` untouched
**Authorization:** MSG-0092 §3 and §5; queued as the single READY task by MSG-0093

---

## 1. Result

**TASK-0030 is COMPLETE. All seven acceptance criteria are MET.**

The deliverable is
[`implementation/decisions/ADR-0020-AMD-01-pre-constrained-retrieval-engine-criterion.md`](../decisions/ADR-0020-AMD-01-pre-constrained-retrieval-engine-criterion.md)
— **PROPOSED, not applied.**

**The single most important fact in this record: `docs/decisions/ADR-0020-retrieval-projection-and-index-boundary.md` is unmodified.**

```text
$ git diff --name-only docs/decisions/
(empty)                                                    <- no accepted ADR touched

$ git diff --name-only docs/
docs/program/work-packages/WP-0009-employee-policy-assistant.md
```

**The second command is not empty, and that is reported rather than glossed** — see §11. It shows
exactly one path, the work package this task's own *Documentation* section required be updated. **No
file under `docs/decisions/` appears in either command.**

MSG-0092 §5 required stopping before application, and this session stopped. **ADR-0020 is accepted
and promoted; editing it is the Architecture Lead's act**, exactly as promotion was (TASK-0025 /
MSG-0073).

Being documentary, this task **produced no test count and claims none.**

## 2. The finding, before the wording

**The stop condition was tested rather than assumed.** The queue permits "no amendment is needed" as a
legitimate outcome, so §§3–4 were read in the accepted copy and judged against that possibility first.

**It does not apply — but the reason is narrower than "the ADR is unclear".** ADR-0020 is not unclear
about policy. §3.1 requires the candidate set be built "already constrained" and says "Unauthorized
content is never a candidate"; §4 makes retrieving broadly and filtering afterwards "a **gate
failure**". As statements about system behaviour these are unambiguous, and **nothing in the draft
changes them.**

**What is missing is the consequence, in two places:**

1. **The rule does not say it disqualifies an engine.** As written it reads as a constraint on how the
   assistant is built — satisfiable, on a permissive reading, by any engine plus careful surrounding
   code. That is precisely the reading that lets post-filtering through.
2. **The ADR does not say what G3 inspects.** §3 closes with "A design in which three are decorative
   fails G3 however correct its output looks" — right failure, but silent on the evidence. **A
   conforming design and a retrieve-then-filter design return byte-identical responses.** A gate
   evidenced from the response cannot separate them.

EPA-0005 §3.3 — accepted by MSG-0092 — states it sharply: over-fetch top-k then filter is *"the
prohibited shape executed one layer down, where it is harder to see"*, and *"an implementer could
violate this while believing they conform."*

## 3. The proposed wording, quotable in isolation

**Hunk 1 — insert at the end of §4**, after *"An exclusion cannot fail open; a filter can."* Nothing
existing is deleted or reworded.

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

**148 words.** One paragraph, plus one disclaiming sentence.

**Hunk 2 — optional, recommended, separable.** One row appended to the Traceability table:

> | Pre-constrained retrieval as an **engine-selection criterion**; G3 evidenced at the query | MSG-0092 **§1(1)** and **§3**; EPA-0005 §3.3 (ACCEPTED) |

It exists so the new text traces to accepted authority rather than appearing without provenance.
**Hunk 1 stands alone**; for the absolute minimum, take hunk 1 and drop hunk 2.

## 4. Minimality — what was deliberately not changed

Twelve candidates were considered and left alone, each with a reason, in §6 of the draft. The ones
worth naming here:

- **§3's four numbered points were not edited.** They already carry the "already constrained" wording.
  Rewording accepted policy text to make a point that belongs in §4 is a rewrite, not a clarification.
- **§7 and *Deliberately not decided here* were not touched**, and that is deliberate rather than an
  omission: **a criterion is not a selection**, so §7 must go on saying no index technology is selected
  — and it does.
- **No bullet was added to *Consequences***, although one would have fit. §4 is where the rule lives;
  two statements of the same rule in one document invite drift.
- **No header change was drafted.** See §6 below — that is a convention the Lead sets.
- **ADR-0017, ADR-0018, ADR-0019, ADR-0021, ADR-0022: not touched at all.**

## 5. No substantive policy change — how it was checked

Each accepted semantic was re-read in the **accepted** copy and compared against the proposed text
(draft §7). Preserved, all of them:

| Accepted semantic | Verdict |
|---|---|
| The four enforcement points, each independently sufficient to deny | **Preserved** — none added, removed, or reordered |
| "No single point may be the only thing preventing access" | **Preserved** — the insertion constrains the *engine* used at point 1; it does not make point 1 sufficient alone |
| Fail-closed denial (§5) | **Preserved** — not referenced, not modified |
| The three named side channels — existence, timing/result-count, audit/analytics | **Preserved** — not modified. The new text's mention of identical *responses* is an argument about **gate evidence**, not a claim that response uniformity suffices |
| Restricted eligibility and its three conditions (§6) | **Preserved** — not referenced, not modified |
| Hybrid shape; no technology selected (§7) | **Preserved**, and explicitly reaffirmed by the draft's own second sentence |
| Index as projection; rebuild is a no-op; stale ⇒ abstain (§1) | **Preserved** — not referenced, not modified |

**One phrase is flagged rather than buried.** *"over-fetching … and discarding the surplus"* is not in
ADR-0020's own words — it comes from **MSG-0092 §1(1)**, which states it verbatim as a settled
constraint. It is a restatement of the Lead's accepted ruling, not an invention. **If the Lead reads
it as an addition rather than a clarification, strike it**; hunk 1 still closes the main ambiguity
without it, less sharply.

## 6. One question for the Architecture Lead — a convention, not a blocker

**This repository has no precedent for amending an already-accepted ADR.** ADR-0015 and ADR-0016 carry
`**Supersedes:**` lines, but those record the *promotion of a draft*, not the amendment of an accepted
record. Two options, and the choice is the Lead's:

- **(a) In place** — insert hunk 1 into the promoted file and add an amendment note to its header.
  Smaller, and proportionate to a 148-word additive clarification. It edits a promoted file.
- **(b) Superseding record** — a new accepted ADR superseding ADR-0020 in whole. Heavier, but follows
  the one promotion pattern the repository already has.

**No header change was drafted**, because inventing the convention is the silent architecture change
this task forbids.

## 7. Acceptance criteria — evidence for each

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| 1 | ADR-0020 §§3–4 inspected in the accepted copy and **quoted, not summarised** | **MET** | Draft §2 reproduces both sections in full from `docs/decisions/`. Eight distinctive phrases from the quotes were re-matched against the accepted file mechanically — **8/8 found verbatim**, so the quotes are not paraphrase |
| 2 | A **minimum** clarification drafted, with minimality argued and non-changes stated | **MET** | Draft §4 (148 words, one insertion point) and §6 (twelve deliberate non-changes with reasons) |
| 3 | **No substantive policy change** — four points, fail-closed, side channels, Restricted condition demonstrably preserved | **MET** | Draft §7 and §5 above: a semantic-by-semantic comparison against the accepted copy |
| 4 | **No engine or technology selection anywhere in the draft** | **MET** | The draft's own text says it *"selects no engine and rules none in"*; draft §9 restates all nine MSG-0092 §4 categories as open |
| 5 | **ADR-0020 in `docs/decisions/` unmodified** — `git diff --name-only docs/` empty | **MET on the criterion; the literal command is NOT empty** | `git diff --name-only docs/decisions/` is **empty** — the stated criterion holds and **no accepted ADR was touched**. The literal command shows **one** path, `docs/program/work-packages/WP-0009-employee-policy-assistant.md`, because the task's *Documentation* section required that file be updated and it lives under `docs/`. **The two instructions conflict; §11 records it rather than resolving it silently** |
| 6 | Draft presented for Lead review, **exact wording quotable in isolation** | **MET** | §3 above and draft §4/§5 — both hunks are given as standalone block quotes |
| 7 | COMMS, queue and status reconciled; completion reported only after repository verification | **MET** | This message, the queue board and ledger, `implementation/status/current.md`, WP-0009's ADR tracking, and the TASK-0030 checkpoint |

## 8. What this task did not do

- **Selected nothing.** All nine MSG-0092 §4 categories remain open — application framework/runtime,
  retrieval/index engine, extraction toolchain, embedding model, generation model, entailment model,
  local serving runtime, frontend framework, identity provider.
- **Created no generic stack ADR** — MSG-0092 §3 declined one.
- **Wrote no Arabic normalization rule.** ADR-0019 §6's deferral is unchanged, and the Arabic n=1
  evidence did not become production corpus evidence.
- **Marked no implementation task READY**; started none of T-A, T-B, T-D, T-E, T-0.
- **Modified no file under `docs/decisions/`, `docs/specifications/`, or `docs/architecture/`.**

## 9. Runner limits encountered, recorded rather than routed around

**`git fetch` is off the runner's Bash allowlist** and was refused. The queue's own *Known runner
limits* note predicts this: a mid-run `origin/main` move is therefore detectable **only by a rejected
push**. Nothing was substituted for the missing command. The starting HEAD `581327b` is recorded in
checkpoint 1 and was re-checked before the push.

## 10. Decision required

**One decision, and it is not urgent because nothing is blocked on it:**

**Accept, amend, or reject AMD-01** — and if accepting, say which recording convention (§6 above) and
whether hunk 2 is included. **Applying it requires an explicit authorization**, per MSG-0092 §5;
this session has none and did not act as though it did.

**No task is READY after this one.** TASK-0030's own *Next eligible task* field reads *"none — the Lead
reviews the draft before anything is applied"*, and that is now the state.

## 11. A conflict inside TASK-0030's own specification — recorded, not resolved silently

**Two requirements in the same task section cannot both be satisfied literally:**

- **Verification / criterion 5:** *"`git diff --name-only docs/` -> empty (no accepted ADR touched)"*.
- **Documentation:** *"update `implementation/status/current.md`, this queue, **and WP-0009 where it
  tracks the ADR set**"* — and WP-0009 lives at `docs/program/work-packages/WP-0009-employee-policy-assistant.md`,
  **inside `docs/`**.

**Updating WP-0009 as instructed necessarily makes the criterion-5 command non-empty.**

**What was done, and why.** The WP-0009 update was made, and the deviation is reported in full rather
than hidden by omitting the update or by quoting a narrower command as though it were the one asked
for. The reasoning:

- **The criterion states its own intent in its own words** — *"ADR-0020 in `docs/decisions/` is
  unmodified"*, annotated *"(no accepted ADR touched)"*. **That intent is fully met**:
  `git diff --name-only docs/decisions/` is empty.
- **The Documentation instruction is specific and names the file.** Skipping it would breach the
  documentation rule, which is non-negotiable, to satisfy a command whose stated purpose is already
  satisfied.
- **`docs/` is broader than the accepted decision register.** It also holds program, operations and
  specification material; the WP-0009 row is ADR-set *tracking*, not architecture.

**This is a documentation-conflicts-with-documentation condition and it is recorded here as the rule
requires.** It is **non-blocking** — nothing about the deliverable depends on the answer — but it will
recur in every future task that both touches `docs/`-resident tracking and carries this verification
line. **The durable fix is one word**: state the check as `git diff --name-only docs/decisions/`. That
is the Lead's to make, and this session did not amend the queue's verification wording.

**Exact diff surface, for review:** the WP-0009 change is **one added table row** under §6.2's A-ADR
entry, recording that AMD-01 is proposed and not applied. **No existing WP-0009 line was modified or
deleted.**
