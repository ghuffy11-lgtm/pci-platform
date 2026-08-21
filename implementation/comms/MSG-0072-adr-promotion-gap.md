# MSG-0072 — Five of Six Accepted ADRs Are Not Yet Promoted

**Status:** **CLOSED** 2026-08-21 — answered by **MSG-0073**, which authorizes **TASK-0025** to promote ADR-0018…ADR-0022 into `docs/decisions/`. The decision this record requested has been made; the promotion itself is now queue-authorized work.
**Raised:** 2026-08-21
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Reconciliation record + decision request
**Authority:** MSG-0071 (accepts ADR-0017…ADR-0022) | **Related:** MSG-0070, TASK-0024, WP-0009 §7, ADR-0015 (promotion precedent)

## The gap

MSG-0071 accepted **all six** ADRs and directed that "the proposed ADRs are to be promoted to the
accepted decision register according to repository convention."

**One was promoted. Five were not.**

```text
docs/decisions/            ADR-0017 only
implementation/decisions/  ADR-0017, ADR-0018, ADR-0019, ADR-0020, ADR-0021, ADR-0022
```

Since `docs/` is the accepted register and `implementation/decisions/` holds proposals, **five
accepted architecture decisions currently have no authoritative record.** ADR-0018, ADR-0020 and
ADR-0022 carry the confidentiality, retrieval and inference-locality boundaries that later
implementation tasks are meant to be gated on, so this is worth closing before the next task is
authorized rather than after.

## What I reconciled, and what I deliberately did not

**Reconciled — recording decisions that already exist:**

- **The ADR index** (`implementation/decisions/README.md`) said all six were "**PROPOSED** — awaiting
  the Architecture Lead". That was false the moment MSG-0071 was written. All six rows now record the
  acceptance, and distinguish **promoted** (ADR-0017) from **awaiting promotion** (the other five).
- **The ADR-0017 draft** still read PROPOSED although it had been promoted. It is now marked
  **RATIFIED**, pointing at the authoritative copy, following the **ADR-0015 precedent** exactly:
  *"RATIFIED … accepted as `docs/decisions/…`. The proposed text below is retained unchanged as the
  historical record."* Its text is unchanged.
- **The five accepted drafts** now record `ACCEPTED by MSG-0071 — awaiting promotion`, with the
  qualification that they carry no architectural authority until the promoted record exists. Both
  halves are true at once, and saying only the first would overstate them.
- **MSG-0071 was unregistered** in both the COMMS register and the queue ledger. It is now in both,
  with its bounded conditions stated rather than flattened to "accepted".

**Not done — the promotion itself.**

Creating `docs/decisions/ADR-0018…0022` is the act that **confers architectural authority**. It is the
highest-consequence documentation operation in this repository, and:

- **no READY task authorizes it** — the queue holds nothing, and the operating rules are explicit that
  work is authorized through the queue, not inferred;
- **the lead performed ADR-0017's promotion personally** (`d9c4524`, "Accept ADR-0017 — Architecture
  Lead"), which reads as the lead doing this work rather than delegating it;
- MSG-0071 says promotion is "the next action" but does not say whose.

Guessing wrong in the permissive direction would mean I had unilaterally made five documents
authoritative. Guessing wrong in the cautious direction costs one message. **The asymmetry decides
it**, so nothing was promoted.

## The decision required

**Either** finish the promotion yourself, as with ADR-0017 — five files, the same pattern — **or**
authorize a bounded task and reconcile it into the queue as the single READY task.

If you authorize it, the work is mechanical and the convention is already established by ADR-0015 and
by your own ADR-0017 promotion:

1. copy each draft to `docs/decisions/` with `**Status:** ACCEPTED`, preserving the traceability line;
2. mark each draft **RATIFIED**, pointing at the promoted copy, text otherwise unchanged;
3. update the ADR index rows from *awaiting promotion* to *promoted*;
4. introduce **no** provider, model, runtime, framework, or implementation selection — MSG-0071 is
   explicit that what was left open stays open, in particular ADR-0017's entailment model and
   thresholds (SPEC-0020) and ADR-0019's Arabic normalization rules.

**I have not marked any task READY**, and this message does not authorize anything.

## Also worth noting

**MSG-0071 was the second unregistered decision message in a row** — MSG-0067 and both MSG-0068 files
had the same gap yesterday, recorded in MSG-0069. The register is what a new session reads to find out
what has been decided; a decision that is not in it is invisible unless someone already knows to look
for the file.

That is the same shape as the queue-reconciliation gap now at seven recurrences, one register down.
**No rule was changed and none is mine to change** — recorded so the pattern is visible.

## State

- **ADR-0017 … ADR-0022: all ACCEPTED by MSG-0071.** ADR-0017 promoted; **five awaiting promotion**.
- Indexes and draft headers reconciled; **no ADR text was altered**.
- MSG-0071 registered in the COMMS register and the queue ledger.
- **No task is READY.** A-SURVEY and A-STACK remain unauthorized; no implementation task is authorized.
- No OPEN blocker.

---

## Pre-promotion verification — performed 2026-08-21, nothing promoted

MSG-0071's acceptance carries conditions, and the moment to check them is **before** the drafts become
authoritative, not after. This is a read-only pass; **no ADR was promoted, and no ADR text was
altered.**

### 1. No provider, model, runtime, or framework is selected

MSG-0071 requires the accepted records to "not introduce provider, model, runtime, framework, or
implementation selections that were deliberately left open."

A scan of all six drafts for concrete technology names returned only three kinds of hit: `Claude` in
"Proposed by: Claude Code" bylines, `CLAUDE` in `CLAUDE.md` path references, and `express` as an
ordinary English verb in ADR-0018 ("must be able to express 'authorized approver'…").

The one substantive hit is **Ollama, twice in ADR-0022** — the inference-locality ADR, where a runtime
selection would matter most. **It is a citation, not a selection**, and the ADR is explicit both times:

> **No model, runtime, embedding model, or serving technology is selected by this ADR.** … ADR-0003
> notes Ollama as a practical initial local runtime and is explicit that this is "an implementation
> decision, not a platform identity" — this ADR does not elevate it.

**The citation was verified against the source rather than trusted.** `docs/decisions/ADR-0003` line 17
reads verbatim: *"The first local inference environment may use Ollama because it is practical for the
target hardware and familiar operational environment. This is an implementation decision, not a
platform identity."* ADR-0022's quotation is accurate and its use of it is correct.

**Verdict: MET.** Nothing left open has been closed by these drafts.

### 2. ADR-0019 invents no normalization rules

MSG-0071 accepted ADR-0019 on condition that "no invented normalization rules are authorized."

The draft records the **obligation** and defers the **rule set**: raw authoritative text immutable;
ingestion-time and query-time normalization identical, with divergence named as a defect; the rule set
versioned so a change is a reindex. It states plainly that it "must be amended before production use"
with the empirical rule set, and lists the rule set under *Deliberately not decided here*, traced to
MSG-0056a D6.

**Verdict: MET.** The obligation is fixed; no rule was invented.

### 3. ADR numbering is collision-free

```text
docs/decisions/            ADR-0001 … ADR-0017   (contiguous)
implementation/decisions/  ADR-0015 … ADR-0022
```

The three overlapping ids — 0015, 0016, 0017 — carry **identical filenames** in both directories, so
they are promoted pairs rather than collisions. **No id is claimed by two different titles.** Given
that four message numbers and two task specifications have collided in this project, the check was
worth running rather than assuming; TASK-0024's numbering claim holds.

### 4. A quoted control was verified at source

ADR-0022 quotes `docs/security/data-classification.md`: *"A model being local does not make data
automatically safe. Authorization, classification, minimization, and audit controls apply equally to
local and remote model runtimes."* That is line 31 of that file, verbatim.

### What this does and does not establish

**It establishes** that promoting ADR-0018 … ADR-0022 as written would not violate the conditions
MSG-0071 attached to its own acceptance, and would not silently close a question the lead left open.

**It does not** authorize the promotion, and none was performed. The decision in this message stands
unchanged: finish it yourself, or authorize a bounded task.
