# MSG-0107 — TASK-0034 Execution Record: The Strict Shape-1 Criterion and Probe Specification

**Status:** **OPEN** — informational; **three questions are surfaced for the Architecture Lead and none
blocks anything**
**Date:** 2026-08-23
**Author:** Claude Code — supervisor-started session (`runner.lock` pid 24340, acquired 09:17:18Z)
**Authority:** **MSG-0105** (DECIDED) §3–§5 · queue section `CLAUDE-TASKS.md` §TASK-0034 · reconciled by
MSG-0106
**Applies:** ADR-0020 §4 as amended by AMD-01 · EPA-0006 §3, §4.1–§4.5
**Related:** MSG-0104 (the probe evidence), MSG-0101, MSG-0100

---

## 1. Result in one paragraph

**The criterion and the probe specification are updated, and nothing else changed.** EPA-0006 §4 now
carries **§4.6** — the strict Shape-1 criterion in testable form: what a "unit examined" is, that the
passing bar is **zero** and must be shown invariant with collection size, the four evidence classes
required for a `CLEARED` verdict, an **asymmetry rule** stating that counters can prove failure but
never success, an instrument-placement rule, a mandatory negative control, and the rule that absence of
evidence is recorded `NOT CLEARED` — and **§4.7**, three questions surfaced and deliberately left
unanswered. **The rejected weaker reading is recorded as rejected, with the worked example that shows
why it matters.** **All nine MSG-0104 verdicts are carried forward unchanged and are reproduced verbatim
in §5 below.** **No accepted ADR was modified** — `git diff --name-only docs/decisions/` is **empty**,
and so is `git diff --name-only docs/`. **No engine was selected, adopted, recommended, installed or
deployed; no implementation task was marked READY; the probe was not re-run and no engine was
re-measured.**

---

## 2. What was changed, precisely

**All changes are additive and declared, and confined to `implementation/`.** The convention is the one
this repository has used since TASK-0019: annotate, never quietly rewrite.

| Section | Change | Nature |
|---|---|---|
| **EPA-0006 header** | `**Amended:** 2026-08-23 — TASK-0034 (MSG-0105), §4 only` | one added line |
| **§4.1** (three execution shapes) | Declared note: the Shape-1 row is **confirmed, not changed** | note added; **table untouched** |
| **§4.3** (engine classes) | Declared note: **class K's *"CONFORMS structurally"* claim is WITHDRAWN**; all other class verdicts stand | note added; **table untouched** |
| **§4.4** (three tiers) | Declared note: **tiers 1 and 2 stand; tier 3's bar is restated in §4.6, which governs** | note added; **table untouched** |
| **§4.5** ("one projection index") | Declared note: **MSG-0101 §1(1) already ruled this** — one *logical* projection, both halves bind independently, fusion never resolves authorization | note added |
| **§4.6** — **new** | **The strict Shape-1 criterion and probe specification**, S1–S11 | new section |
| **§4.7** — **new** | **Three questions surfaced and not decided**, Q1–Q3 | new section |
| **§16 Traceability** | Four rows added, tracing §4.6/§4.7 to MSG-0105, MSG-0104, MSG-0101 | rows added |

**No existing sentence anywhere in EPA-0006 was deleted or reworded — and the check came out stronger
than that claim.**

```text
git diff --stat implementation/architecture/EPA-0006-assistant-technology-evaluation.md
  -> 1 file changed, 310 insertions(+)
```

**310 insertions, ZERO deletions.** Every note was added as new lines rather than by rewriting an
existing one, so **§1–§16 of the promoted-to-PROPOSED record are byte-identical to the TASK-0032
copy** — not "reviewed and found equivalent", but untouched. This is the same verification shape
TASK-0031 reported for the AMD-01 application (MSG-0097), and it matters for the same reason: **a
criterion record that quietly reworded its own prior findings would be indistinguishable from one that
relabelled evidence.**

### 2.1 Why the criterion lives in EPA-0006 and no new record was created

**EPA-0006 §4.1 and §4.4 *are* the retrieval-engine criterion and probe specification** — they are what
MSG-0104 measured against and what MSG-0105 §4 directs be updated. The queue's Documentation section
names EPA-0006 explicitly, *"where it carries the §4.4 tier model"*.

**No `EPA-0007` was created**, for the reason MSG-0104 §8.3 already recorded: creating a new architecture
record is not authorized, and MSG-0101 §1(4) states no new ADR is authorized. **Flagged so a later reader
does not go looking for a document that does not exist.**

---

## 3. The substantive content, and the four decisions inside it

MSG-0105 §3 requires the instrument to test *"whether a candidate can demonstrate that authorization
constrains the engine's candidate set **before retrieval/search**"*. Making that testable required
settling four things the old tier 3 left open. **Each is an evidence-instrument decision, not an
architecture decision**; where a genuine architecture question appeared instead, it was routed to §4.7.

### 3.1 What is counted — because a criterion that does not say what it counts cannot decide anything

§4.6 S4 defines five unit kinds: **U1** index entries or keys read during traversal, **U2** rows,
documents or vectors read from storage, **U3** values passed to a ranking, scoring, distance or filter
function, **U4** term postings, tokens or vector-index nodes traversed while resolving a match, and
**U5** content placed in a buffer, cache, temporary structure or log line.

**U4 and U5 are the additions that matter.** U4 is the FTS5 stage MSG-0104 §5.3 recorded as **NOT
MEASURED**; U5 follows from ADR-0020's own Context — *"the content is in the process, in memory, in a
log line, or in a timing difference"* — and from §6.2 carrying **no authorization exception**.

### 3.2 The bar is zero, and must be shown invariant with collection size

Strict Shape-1 admits no allowance, so the criterion says so plainly: `U = 0` at every measured `N`,
measured at **no fewer than three collection sizes**.

**The invariance requirement is doing real work, not decoration.** Growth with collection size — rather
than with the predicate's selectivity — is the *signature* of a traversal bounded by index coverage
rather than by authorization. That is exactly the shape MSG-0104 measured: **30 / 300 / 3000** on a
partial index, **10 / 100 / 1000** on a covering one, with the residual immovable because the
multi-valued audience conjunct lives in a junction table.

### 3.3 The asymmetry rule — the single most consequential sentence in the update

**Counters can prove failure. They cannot prove success.**

A non-zero count is conclusive: the engine examined unauthorized units. A zero count proves only that
nothing crossed **the point where the instrument sits** — it observes nothing about what the engine
touched before that point, and an instrument written into a `WHERE` clause is **structurally incapable**
of observing index entries scanned or pages read.

**Without this rule the criterion could be satisfied by placing an instrument conveniently.** With it, a
`CLEARED` verdict requires **E1 traversal-bounding evidence** — a plan or trace showing the traversal is
confined to a structure every entry of which satisfies the predicate — with counters, opaque-stage
evidence and log inspection corroborating. **A plan showing a scan over a structure that spans
authorization scopes is disqualifying regardless of any counter.**

**The precedent is MSG-0104 §4.2**, which found two candidates with **identical query plans** reporting
**2000** and **1000** unauthorized rows examined purely because the counter sat at different points, and
stated that **neither is "the" answer**. §4.6 S7 turns that observation into a rule: record the
placement, report the **maximum** as a lower bound, never compare candidates across placements.

### 3.4 An unmeasurable stage is NOT CLEARED by rule, not by the writer's care

MSG-0104 was scrupulous about this — it flagged that C2/C3's *"0 unauthorized bodies"* was **absence of
measurement, not evidence of absence**. **Under §4.6 S6/E3 that no longer depends on a careful author:**
any stage whose internals the engine does not expose yields `NOT CLEARED` for the candidate.

Combined with S10, this is a selection criterion prior to any performance question: **an engine that
cannot be observed cannot be cleared, however it performs and whatever its documentation asserts.**

---

## 4. The rejected reading, and the one claim withdrawn

### 4.1 The rejected reading is recorded as rejected (acceptance criterion 3)

§4.6 **S2** records that MSG-0104 §6.3's *"materializes no unauthorized passage content"* is **explicitly
rejected** by MSG-0105 §2 as *"insufficient to clear Shape-1"*, and states the rule that follows: **no
candidate may be marked CLEARED on materialization evidence.**

**The worked example is carried with it, because that is what stops the reading returning.** TASK-0033's
**C1 met the rejected line exactly** — zero unauthorized bodies materialized at every collection size
under both index designs — while examining **1000 unauthorized rows at `M=5000`**. **It was NOT CLEARED
then and it is NOT CLEARED under this criterion.**

### 4.2 One EPA-0006 claim is withdrawn — and this is not softening a verdict

**§4.3's class-K cell read *"CONFORMS structurally — and its cost is entirely unmeasured"*.** That claim
does not survive strict Shape-1 and is **withdrawn by annotation**.

Its supporting argument was *"the candidate set **is** an authorized query result; there is no wider set
to over-fetch from"* — **a statement about what the query returns, not about what the engine examined
while resolving it.** That is the materialization-only reasoning MSG-0105 §2 rejects. A relational engine
evaluating this predicate examines rows and rejects them exactly as the probed class-R engine did;
enforcing the rule through RLS rather than a `WHERE` clause changes **where the rule is written**, not
**what the traversal touches**.

**Three things about this are stated so it cannot be misread:**

1. **Class K's authoritative verdict is unchanged — NOT CLEARED**, exactly as MSG-0104 §7 recorded it.
2. **The correction moves in the strict direction only.** It removes a conformance claim and creates
   none. **No MSG-0104 verdict is softened, relabelled, or re-presented as conformance.**
3. **Class K may still conform. It has simply never been measured**, and the structural argument is no
   longer sufficient to assert it without measurement.

---

## 5. MSG-0104's verdicts, reproduced unchanged (acceptance criterion 4)

**The queue's Verification block requires explicit confirmation that this table is reproduced unchanged.
It is transcribed from MSG-0104 §7 and nothing in it is edited, reordered, softened, or annotated.**

| Subject | Verdict | Decided at | Reason |
|---|---|---|---|
| **SQLite 3.51.3 — C1**, relational scalar | **NOT CLEARED** | **Tier 3** | Tier 1 and Tier 2 both pass; Tier 3 shows unauthorized rows examined scaling with the collection (1000 at M=5000, covering index). Strict Shape 1 not demonstrated |
| **SQLite 3.51.3 — C2**, FTS5 natural form | **NOT CLEARED** | **Tier 3** | As C1, **plus a measurement gap**: the FTS5 traversal cannot accept the authorization predicate into its own index — the join applies it outside — and **whether unauthorized content is traversed inside FTS5 was NOT MEASURED** (§5.3) |
| **SQLite 3.51.3 — C3**, FTS5 authorization-first join | **NOT CLEARED** | **Tier 3** | As C2. Forcing join order **did not** eliminate the residual, and does not close the FTS5 measurement gap |
| **NC — application post-filter** (class **D**) | **DISQUALIFIED** | **Tier 2** | Failed k-completeness at M=500 and M=5000; result set not invariant; materialized every unauthorized body. **Demonstrated, not merely argued** |
| **Class S** — search engines | **NOT CLEARED** | — | **No execution evidence: no engine reachable.** MSG-0101 §2: inability to obtain evidence is NOT CLEARED, never conformance |
| **Class V** — vector stores | **NOT CLEARED** | — | As S. Criterion 6's strategy-switching case is **untestable here** — SQLite has no approximate vector index, which is the property that produces switching |
| **Class K** — kernel store | **NOT CLEARED** | — | No PostgreSQL on this host. EPA-0006 §4.3 argues it conforms *structurally*; **that is a documentary argument and this probe produced no execution evidence for it** |
| **Class L** — lexical-only | **NOT CLEARED** | Tier 3 | Exercised only as FTS5 inside the class-R subject. ADR-0020 §7's hybrid requirement keeps it insufficient alone regardless |
| **Class H** — hosted / managed | **DISQUALIFIED** | not tested; none needed | ADR-0022 §1 — derived embeddings must not leave the host. Independent of filter shape |

**Nothing is CLEARED, and nothing became CLEARED as a result of this task.**

> **Note on the class-K row, which is the only place the table and this record touch.** The row's own
> reason text already calls EPA-0006's structural argument *"a documentary argument"* for which *"this
> probe produced no execution evidence"*. **§4.2 above withdraws that argument; the verdict the row
> records was NOT CLEARED then and is NOT CLEARED now.** The table is unchanged.

---

## 6. Acceptance criteria (queue §TASK-0034)

| # | Criterion | State | Evidence |
|---|---|---|---|
| 1 | Criterion states the **strict** requirement in testable terms, **quoting MSG-0105** rather than paraphrasing | **MET** | EPA-0006 **§4.6 S1** quotes MSG-0105 §1 in full as a block quote and attributes it; S3–S7 supply the testable form — bar, units, evidence classes, placement rule |
| 2 | Probe spec says **what must be measured**, **what evidence counts**, **what the passing bar is**, such that a future probe can return a defensible verdict | **MET** | **S3** the bar (`U = 0`, invariant across ≥3 collection sizes); **S4** what is measured (U1–U5); **S6** what evidence counts (E1–E4, all required); **S9** the verdict vocabulary and how each is awarded |
| 3 | **The rejected weaker interpretation is recorded as rejected**, so it cannot quietly return | **MET** | **S2**, with the C1 worked example — zero bodies materialized, 1000 unauthorized rows examined, **NOT CLEARED** — plus the standing rule that no candidate may be CLEARED on materialization evidence. Restated in §4.2 of this record |
| 4 | **All MSG-0104 verdicts carried forward unchanged**; none relabelled or softened | **MET** | **§5 above reproduces the §7 table verbatim.** The only related change is the **withdrawal of a conformance *claim*** in EPA-0006 §4.3 (§4.2 above), which moves strictly toward NOT CLEARED and changes no verdict |
| 5 | **No accepted ADR modified** — `git diff --name-only docs/decisions/` empty | **MET** | Quoted in §8. **`docs/` in its entirety is untouched**, which is stronger than the criterion asks |
| 6 | Any architectural consequence **surfaced as a question**, not decided | **MET** | **§4.7 Q1/Q2/Q3**, each with a stated fail-closed default so the criterion operates without a ruling. **Q2 is MSG-0106 §4's question** and is left open, including its interaction with MSG-0101 §1(1)'s *logical* projection |
| 7 | COMMS, queue and status reconciled; result reported and **stopped for the Lead** | **MET** | This message; the comms register row; the queue board row, task-section result block and ledger row; `current.md`; the checkpoint. **The run stops here** |

**Verification is documentary. There is no test count and none is claimed** — nothing was executed,
nothing was measured, and the probe was **not** re-run, per the task's recovery procedure.

---

## 7. Items referred to the Architecture Lead — none blocking

**All three are in EPA-0006 §4.7 in full. None blocks the criterion from being used**: each carries a
fail-closed default, so a future probe can run and return a defensible verdict with all three still open.

1. **Q1 — does "examine" reach index metadata, or only passage content?** The criterion counts index
   entries (U1). The two readings come apart on an engine that seeks an index confined to authorized
   entries but reads **one boundary key** of an unauthorized row: `U = 1` strictly, `U = 0` narrowly,
   **no passage content touched either way.** **This is not the rejected §6.3 reading under a new name**
   — §6.3 asked what suffices to *clear* a candidate; Q1 asks what the counter *counts* — but the
   distinction is fine enough that it is stated explicitly rather than left implicit. **Default: the
   strict reading.**

2. **Q2 — can strict Shape-1 be satisfied by query-time predicates alone, or does it constrain how the
   projection is *physically organised*?** **This is the referral with the most leverage, and it is
   MSG-0106 §4's question.** The evidence suggests `U = 0` requires the traversal to open only structures
   whose every entry is already authorized — a **physical organisation** property. Two difficulties are
   recorded: **not every conjunct partitions** (scope, classification and state are discrete and finite;
   **effectivity is a continuous open-ended range** and **audience is a multi-valued set overlap**), and
   it interacts directly with **MSG-0101 §1(1)**, whose word *logical* deliberately left physical
   organisation open and **may prove load-bearing here**. **Surfaced, not decided.**

3. **Q3 — if no engine class can reach zero, what is the architectural response?** Stated because it may
   be the outcome and should be visible before a probe runs rather than after. TASK-0033 cleared nothing;
   the one structural conformance claim is now withdrawn; **class K faces the same measurement question
   as class R and has never been measured.** **The response is the Lead's; this record proposes none, and
   explicitly does not propose relaxing the bar** — MSG-0105 §3 forbids weakening AMD-01, and a criterion
   loosened whenever nothing passes it is not a criterion.

---

## 8. Boundary verification

```text
git diff --name-only docs/decisions/  -> (empty)     no accepted ADR modified
git diff --name-only docs/            -> (empty)     nothing under docs/ touched at all
git diff --stat  EPA-0006             -> 310 insertions(+), 0 deletions   purely additive
git rev-parse HEAD    (session start) -> 1451024…    recorded in checkpoint 1
git rev-parse origin/main             -> 1451024…    equal; no mid-run movement observed
git status --porcelain (before commit)-> 4 modified, 2 untracked; all under implementation/
git status --porcelain (after commit) -> (empty)     tree clean
```

**Files changed — all six under `implementation/`:**

```text
implementation/architecture/EPA-0006-assistant-technology-evaluation.md
implementation/comms/MSG-0107-task-0034-execution-record.md
implementation/comms/README.md
implementation/operations/CLAUDE-TASKS.md
implementation/operations/checkpoints/TASK-0034.md
implementation/status/current.md
```

**Known runner limit, restated because it bounds the `origin/main` claim.** `git fetch` is off this
runner's Bash allowlist and **was refused in this session** — *"This Bash command contains multiple
operations. The following part requires approval: git fetch origin"*. The comparison is against the
**local remote-tracking ref**. A mid-run move of the real remote surfaces here only as a **rejected
push**; the push was accepted. Recorded, not routed around — as in MSG-0097, MSG-0100 and MSG-0104.

---

## 9. What this record does **not** do

- **It selects, adopts, recommends, installs and deploys nothing.** No engine is preferred over another,
  and **nothing became CLEARED.**
- **It modifies no accepted ADR.** Not ADR-0020, not AMD-01, not ADR-0018, and **not ADR-0019** — on
  which **no Arabic normalization rule was written, inferred, or proposed**.
- **It weakens nothing.** Every change to the criterion moves toward stricter evidence or toward
  `NOT CLEARED`; **none moves toward clearance.**
- **It re-measures nothing.** The probe was **not** re-run; TASK-0033's harness and captured output at
  `implementation/probes/TASK-0033/` are untouched, and **no number in this record is new** — every
  figure quoted is transcribed from MSG-0104.
- **It authorizes no implementation task**, and marks none READY.
- **It answers none of the three questions in §7**, and **decides nothing about physical index
  organisation**, which would be an architecture change this task is not authorized to make.
- **It invents no benchmark, latency, capacity, recall or throughput figure**, and cites no vendor claim.
