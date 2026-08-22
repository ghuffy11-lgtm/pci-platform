# MSG-0090 — What ADR-0019 Still Needs, and Whether the Material Exists

**Status:** **OPEN** — **SCOPED 2026-08-22 (MSG-0091)**: the finding is preserved for the eventual production normalization decision and does **not** gate current bounded architecture testing. The requirement before ADR-0019 amendment and before production is unchanged.
**Raised:** 2026-08-22
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Evidence-gap analysis + decision request
**Authority:** requested by the operator | **Related:** MSG-0089, MSG-0087, MSG-0084, ADR-0019 §6, MSG-0056a D6, WP-0009 §6.1/§6.2, EPA-0004 §11.5

---

## 1. The answer in one paragraph

**Representative approved organizational Arabic policy material is REQUIRED and is NOT available.**
Verified by inspection: the corpus directory holds one genuine English organizational policy and one
ChatGPT-generated Arabic specimen, and nothing else. **Nothing currently authorized is blocked** — no
task is READY and none needs this material. What it blocks is **ADR-0019's amendment**, and through
that, **production use**, because MSG-0056a D6 requires the final normalization rule to be recorded in
an ADR **before production**.

**The next Architecture Lead action is a scoping decision, not an authorization**: decide whether the
Arabic normalization rule set is pursued now — which requires an organizational corpus action nobody
has yet been asked for in those terms — or explicitly deferred to a later gate, with the D6 obligation
carried as a named debt against production.

---

## 2. What is available — verified, not assumed

```text
D:\Work\pci-corpus\
  plan.pdf              641,807   Hadi Clinic emergency preparedness plan   Word 2016      REAL, English
  سياسة التعافي.pdf     119,055   "Disaster Recovery Policy"                WeasyPrint/ChatGPT  GENERATED, Arabic
```

**Neither is representative approved organizational Arabic policy material.**

- `plan.pdf` is genuine organizational material and genuinely approved — but it is **English**.
- `سياسة التعافي.pdf` is **Arabic** and structurally admissible under D14 — but `/Creator` is ChatGPT
  and `/Producer` is WeasyPrint. **It was not authored, approved, or produced by the organization.**
- The earlier `Arabic.pdf` was real-world material but **ABBYY-OCR output, rejected by D14** (MSG-0087),
  and has since been **removed** from the directory.

**So across three surveys the project has seen: real+English+admissible, real+Arabic+rejected, and
generated+Arabic+admissible. It has never seen real+Arabic+admissible** — which is precisely the
intersection ADR-0019's evidence requirement names.

---

## 3. What is blocked, and what is not — the distinction matters

**Not blocked:**

- **No task is READY**, and nothing in the queue is waiting on this.
- **The architecture is not blocked.** ADR-0017…ADR-0022 are accepted and promoted; ADR-0019 is
  accepted *as a bounded decision* with this gap explicitly recorded, not as an oversight.
- **A-STACK is not blocked** — `EPA-0005` is delivered and awaits review on its own merits.

**Blocked:**

- **ADR-0019's amendment with the concrete rule set.** ADR-0019 §6 says so directly: the Arabic rule
  set *"requires the empirical corpus evidence that A-SURVEY exists to gather"*.
- **Production use**, transitively. MSG-0056a D6: the final normalization rule *"must be recorded in an
  ADR before production use"*. ADR-0019 §6 states the consequence plainly — *"this ADR must be amended
  with the empirical rule set before production use. Until then D6 is partially discharged."*
- **T-B in practice, though not formally.** WP-0009 places the corpus survey *before* T-B, and T-B is
  the task that implements normalization. Building it against unknown orthographic variation means
  guessing the rules in code instead of in an ADR — which is the same guess D6 forbids, relocated.

---

## 4. The exact evidence needed

### 4.1 The five rule classes, named by ADR-0019 itself

ADR-0019 §6 names precisely what is undecided: **alef and hamza forms · ta marbuta · tatweel ·
diacritics · Arabic-Indic digits.** For each, the decision needs **observed variation in real approved
organizational Arabic documents** — specifically:

| Rule class | The evidence that would settle it |
|---|---|
| **Alef / hamza forms** | Do the organization's own documents spell the same word with differing alef forms (`ا` / `أ` / `إ` / `آ`)? If variation is real, folding is required; if the corpus is consistent, folding may be unnecessary and would lose distinctions |
| **Ta marbuta** | Do `ة` and `ه` interchange in word-final position across documents or authors? |
| **Tatweel** | Is kashida padding (`ـ`) used for justification? If present it must be stripped before indexing; if absent, stripping is a no-op that still costs a projection step |
| **Diacritics** | Are tashkeel present in the source at all, partially, or inconsistently between documents? A corpus with no diacritics needs no folding rule; one with partial diacritics needs one, and MSG-0089 showed they can arrive **detached** from their base letters |
| **Arabic-Indic digits** | Do documents use `٠١٢٣` or `0123` — or both, including within a single document, for clause and version numbering? This directly affects citation and version matching |

**Each of these is a question about how the organization's authors actually write**, not about how a
PDF renderer emits glyphs. **No amount of further PDF inspection answers any of them.**

### 4.2 The distinction that matters most, and the trap to avoid

**The three surveys answered an extraction-layer question. They did not touch the normalization
question, and cannot.**

| Layer | What it depends on | Status |
|---|---|---|
| **Extraction** — bidi order, tokenization, diacritic attachment, `/Lang` reliability, OCR vs native | The **producing toolchain** | **Well evidenced** — three producers, three disjoint defect families |
| **Normalization** — the five rule classes above | **How the organization's authors write Arabic** | **No evidence at all** |

**Treating the extraction findings as normalization evidence would be the error.** MSG-0089 found that
Arabic is stored in visual order and that diacritics arrive detached — those are facts about WeasyPrint,
and they tell you what an extractor must repair. They say **nothing** about whether the organization's
policy authors use tatweel, or mix Arabic-Indic and Western digits. A rule set derived from them would
be a rule set about a PDF library.

### 4.3 What a sufficient sample looks like

Since orthographic variation is the thing being measured, **n=1 cannot answer it in principle** — a
single document is internally consistent by construction, and consistency across authors is exactly the
unknown. The material needs to be:

1. **Genuinely organizational** — authored and approved by the organization, not generated or sourced
   externally;
2. **Approved/published**, per D3 — only approved documents are authoritative;
3. **Text-native**, per D14 — OCR output is rejected, so scanned archives do not qualify however real;
4. **Plural, and spanning authors and dates** — variation between authors and over time is the signal;
5. **Produced the way policy is actually produced** — because the extraction hazards T-B must handle
   follow from the real toolchain, not from a specimen's.

**How many is a judgement the Lead should make against cost**, and this record does not name a number:
naming one would be inventing a threshold with no more evidence than the guess D6 forbids.

### 4.4 One prerequisite that may be discovered rather than decided

**If the organization's approved Arabic policy exists only as scanned documents**, then under D14 there
is no admissible Arabic corpus at all, and the question changes from "what are the normalization rules"
to "does the assistant support Arabic in the first release". EPA-0004 §11.5 flagged exactly this risk —
that the ruling would be correct while the first release answered from a fraction of the corpus, *"and
nobody discovers that until ingestion runs"*. **Asking what form the Arabic policy actually takes is
cheap now and expensive later**, and it is the first thing worth establishing.

---

## 5. The next Architecture Lead action — identified, not authorized

**Ordered by what unblocks the most at the least cost.**

1. **Establish what form the organization's approved Arabic policy actually takes** — text-native,
   scanned, or non-existent. This is a question to the organization, not a task, and its answer decides
   whether the rest is even reachable (§4.4).
2. **Decide the scoping question**: pursue the Arabic normalization rule set now, or **explicitly defer
   it** and carry D6 as a named debt against production. **Deferral is a legitimate choice** — ADR-0019
   is already accepted as bounded — but it should be a decision on the record rather than a gap that
   quietly persists.
3. **If pursued**: the corpus action in §4.3 is an **organizational** prerequisite of the same class as
   PR5, and it has never been requested in these specific terms. WP-0009 §6.1 places it with the
   organization; MSG-0062 §7.5 authorized a survey but could not supply material.
4. **Independently of all of the above**, `EPA-0005` (A-STACK) still awaits acceptance, along with its
   §9 recommendation that no stack ADR be created yet, and the one-runtime-or-two trade.

---

## 6. What this record does not do

- **ADR-0019 is untouched.** No normalization rule is proposed, named as likely, or hinted at. The five
  rule classes above are quoted from the ADR's own list of what it deferred, not answered.
- **No task was created or marked READY**, and no work package or implementation is authorized.
- **No threshold, count, or acceptance bar is invented** — §4.3 deliberately declines to name a sample
  size.
- **No permission, ADR, or corpus file was changed.** `git status` clean; the corpus is untouched and
  outside the repository.

---

## 7. State

- **No task is READY. No blocker is open.** The scheduled task remains **Disabled**, so nothing runs
  unattended.
- **A-SURVEY at n=1 has been performed three times; A-SURVEY at corpus scale remains unperformed**, and
  is the thing ADR-0019's amendment waits on.
- **Representative approved organizational Arabic policy material: NOT AVAILABLE, and REQUIRED** before
  ADR-0019 can be amended and therefore before production use.

---

## SCOPED — 2026-08-22 by Architecture Lead ruling (MSG-0091)

**This finding stands unchanged and is preserved.** The Architecture Lead ruled that the Arabic **n=1**
documents are **sufficient technical test evidence for the current architecture work**, that
representative organizational Arabic material is **not required to continue bounded testing**, and that
this record's evidence gap is **preserved for the eventual production normalization decision**.

**What changed is the scope of consequence, not the finding:**

| | This record's position | After the ruling |
|---|---|---|
| Representative material required for **bounded architecture testing** | implied | **No — explicitly not required** |
| Required before **ADR-0019's amendment** | Yes | **Yes, unchanged** |
| Required before **production use**, via MSG-0056a D6 | Yes | **Yes, unchanged** |

**Nothing here was withdrawn, softened, or re-argued**, and §4's evidence specification remains the
statement of what the production decision will need. **ADR-0019 §6 still requires empirical corpus
evidence in its own words**, and that requirement is untouched by this scoping.

**No new corpus requirement was created by this record**, then or now — it reported one an accepted ADR
already states. See **MSG-0091**.
