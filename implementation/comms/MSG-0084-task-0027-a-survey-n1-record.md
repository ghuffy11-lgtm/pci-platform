# MSG-0084 — TASK-0027 Execution Record: A-SURVEY at n=1

**Status:** **OPEN** — record, plus **two items referred to the Architecture Lead** (§8). Neither blocks anything.
**Type:** Execution record for **TASK-0027** (A-SURVEY, bounded follow-up)
**Authority:** **MSG-0080** (A-SURVEY authorization) · **MSG-0083** (corpus read permission, option A)
**Related:** MSG-0076, MSG-0077, MSG-0078, MSG-0081, MSG-0082 (CLOSED), BLK-0009, BLK-0010 (RESOLVED), WP-0009 §6.2, ADR-0018, ADR-0019, ADR-0020
**Executed:** 2026-08-22 by a supervisor-started session, against `HEAD = 9d5f747`
**Test count:** **none, and none is claimed.** The task is documentary and its own verification section forbids reporting one.

---

## 1. Outcome in one paragraph

**TASK-0027 is COMPLETE. The corpus PDF was inspected successfully, and the survey is recorded at
n=1.** All seven MSG-0080 acceptance criteria are met (§3). The document is **text-native, not
scanned**, and **contains no Arabic** — established from the file's own structure and its decoded
content streams, not inferred from filename, size, or any other proxy. **The corpus never entered the
repository**: `git status --porcelain` is empty, no `plan.pdf` exists under `D:\Work\pci-platform`,
and no PDF has ever been added in this repository's history (§9). **Four of A-SURVEY's five original
questions remain unanswerable**, because they are distributional and one document is not a population
— and, critically, **this document supplies no Arabic evidence at all, so MSG-0056a D6 remains exactly
as deferred and ADR-0019 must not be amended** (§6).

**The most useful thing this survey produced was not a language finding.** It was three concrete,
reproducible **extraction hazards** in a single real 45-page approved policy document, each of which
would silently corrupt a T-B ingestion pipeline built without them in view (§5). Those are the part
worth reading.

---

## 2. Method, and what the method cannot support

**The corpus was read in place at `D:\Work\pci-corpus\plan.pdf`.** MSG-0083's narrow read-only grant
worked as intended: the read succeeded on the first attempt, no write was attempted, and nothing was
copied anywhere.

**No page was rendered visually.** `pdftoppm` is not installed on this machine, and `pdftotext` — which
is present at `/mingw64/bin/pdftotext` — is **not on the unattended runner's Bash allowlist**, so it was
refused and **not routed around**. The survey was therefore performed by reading the PDF's own object
graph directly: cross-reference and object streams inflated with `zlib`, dictionaries parsed, embedded
`ToUnicode` CMaps decoded, and per-page content streams tokenized with marked-content (BDC/BMC/EMC)
scope tracking so that *artifact* text is separated from *content* text.

**What that supports:** every structural and textual claim below, because each comes from the file's
own bytes.

**What it does not support:** any claim about how the document *looks*. Nothing here rests on visual
inspection, and none is asserted.

> **Operational note worth keeping.** A supervisor-started runner has **no PDF tooling available to it**
> — the one extractor on this machine is off its allowlist, and the renderer is not installed. Reading a
> PDF unattended currently means writing a parser in-session. That is a fact about this environment, not
> a request; if PDF inspection becomes routine, it is the Lead's call whether to allowlist `pdftotext`.

---

## 3. Acceptance criteria — MSG-0080, each with its evidence

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| 1 | The PDF at the stated external path is **inspected successfully** | **MET** | 641,807 bytes read at `D:\Work\pci-corpus\plan.pdf`; header `%PDF-1.7`; 45 page objects enumerated; **107,988 characters of tagged content text decoded across all 45 pages**, every page non-empty (§4) |
| 2 | The record states **n=1** and separates document-level observation from distributional conclusion | **MET** | §4 is the observations; §6 is the explicit non-conclusions. The separation is structural, not a footnote |
| 3 | The record **identifies which requested dimensions cannot be inferred** from n=1 | **MET** | §6 names all five A-SURVEY dimensions and rules four of them unanswerable, with the consequence for D6, D14 and ADR-0019 stated |
| 4 | **The corpus remains outside the repository and `git status` stays clean** | **MET** | §9 — four checks, each quoted |
| 5 | No ADR and no implementation authorization is changed | **MET** | §7. No file under `docs/decisions/` was opened for writing; no task marked READY |
| 6 | COMMS and the queue are reconciled consistently | **MET** | This message, `CLAUDE-TASKS.md`, `implementation/status/current.md`, `implementation/comms/README.md`, WP-0009 §6.2 and the TASK-0027 checkpoint were updated in the same commit |
| 7 | **Completion reported only after repository and corpus-path verification** | **MET** | §9 was run *before* this record claimed completion, not after |

---

## 4. What n=1 DID establish — observations about **this document**

Every statement in this section is about the single file inspected. None is a statement about a corpus.

### 4.1 Identity and provenance

| Property | Value | Source |
|---|---|---|
| Path | `D:\Work\pci-corpus\plan.pdf` (outside the repository) | filesystem |
| Size | **641,807 bytes** | filesystem |
| Format | **PDF 1.7** | file header `%PDF-1.7` |
| Producer / Creator | **Microsoft® Word 2016** (both fields) | `/Info` dict and XMP `pdf:Producer`, `xmp:CreatorTool` |
| Created / Modified | **2024-11-21T11:25:29+03:00** — the two timestamps are **identical** | `/CreationDate`, `/ModDate`, and XMP `xmp:CreateDate` / `xmp:ModifyDate` |
| `/Info /Title` | `HADI CLINIC` | `/Info` dict; XMP `dc:title` agrees |
| `/Info /Author` | a personal given name — **deliberately not transcribed here**, see the note below | `/Info` dict; XMP `dc:creator` agrees |
| Document title on page 1 | **HADI CLINIC EMERGENCY PREPAREDNESS AND DISASTER MANAGEMENT PLAN** | decoded page-1 content text |
| Pages | **45**, `/Type/Pages /Count 45` | page tree |
| Page geometry | **595.44 × 841.68 pt on every page** — near-A4, uniform, no landscape or mixed sizes | 45 `/MediaBox` entries, all identical |
| Encryption | **none** — no `/Encrypt` anywhere in the file | byte scan |

> **On the personal names.** The title page carries an author name and an approver name, and `/Info
> /Author` carries a given name. **They were read and are deliberately not transcribed into this
> record.** They are not needed for any architectural conclusion, and an ordinary project record is not
> the right place for personal data about identifiable staff. The fields are **present**, not absent —
> a future reader who needs them can re-read the file at the path above. Their *structure* is what
> matters here, and it is recorded in §4.4.

### 4.2 Text-native, not scanned — **VERIFIED**

This is the one A-SURVEY dimension n=1 answers cleanly, and four independent lines of evidence agree:

1. **Text decodes.** **107,988 characters** of tagged *content* text were extracted from the 45 page
   content streams. Per-page content character counts run from **67** (page 23) to **3,507**, and
   **no page is empty**.
2. **Nothing failed to decode.** The count of `U+FFFD` replacement characters is **0**. Every byte in
   every text-showing operator mapped to a Unicode character through either `WinAnsiEncoding` or an
   embedded `ToUnicode` CMap.
3. **There are almost no images.** The file contains exactly **two** image XObjects — a `103 × 92`
   `DeviceRGB` image and its `103 × 92` `DeviceGray` `/SMask`. That is **one small logo with
   transparency**, on page 1. There is no page-sized raster anywhere.
4. **The images are barely drawn.** Across all 45 pages the `Do` operator is executed exactly
   **twice** — once for the logo on page 1, once for a vector Form XObject on page 23 (§5.3).

**A scanned document would show the inverse of all four**: little or no decodable text, one large image
per page, and one `Do` per page. **D14's non-text-native rejection rule would not reject this
document.**

### 4.3 Language — **English only; zero Arabic**

| Measure | Result |
|---|---|
| Characters in Arabic ranges `U+0600–06FF`, `U+0750–077F`, `U+FB50–FEFF` | **0** |
| Latin letters `A–Z` / `a–z` | **86,581** |
| Decimal digits | **669** |
| Undecodable glyphs (`U+FFFD`) | **0** |

Two structural confirmations, so the count does not stand alone:

- **The composite fonts cannot produce Arabic.** All five `Identity-H` `Type0` fonts carry `ToUnicode`
  CMaps, and **every target codepoint in all five is Basic Latin plus four punctuation marks** —
  `U+2013`, `U+2018`, `U+201C`, `U+2022`. There is no Arabic codepoint in any CMap.
- **The simple fonts cannot encode Arabic.** All seven `TrueType` simple fonts use
  `/Encoding /WinAnsiEncoding`, a single-byte Latin encoding.

**The declared languages disagree with each other, and all of them are English.** The catalog declares
`/Lang (en-US)`. Inside the page content, marked-content spans declare a language **1,865 times**:

```text
/Lang (en-ZA)   1819 occurrences
/Lang (en-GB)     46 occurrences
```

**Three different English locales in one document — `en-US`, `en-ZA`, `en-GB` — and no Arabic tag at
all.** This is worth recording because it is a trap for an ingestion pipeline that trusts the
document's own language declaration: the catalog value, the dominant span value, and the minority span
value are three different tags, and picking the wrong one is easy. Here the disagreement is harmless
because all three are English; **the disagreement itself, not the values, is the finding.**

### 4.4 Classification, audience, version, supersession — **present as free text, absent as metadata**

**There is no classification marking of any kind in this document.** A case-insensitive search of all
107,988 decoded content characters returned **zero** occurrences of `confidential`, `restricted`,
`internal use`, `proprietary`, `copyright`, `audience`, `draft`, `document no`, `policy no`, `version`,
`revision`, `supersede` or `replaces`. The words `classified` and `distribution` occur **five** and
**five** times respectively and every occurrence is **clinical prose** — triage classification and the
distribution of casualties — not document metadata.

**What the document does carry is a title-page block, in free text**, reproduced structurally with the
two personal names removed:

```text
HADI CLINIC EMERGENCY PREPAREDNESS AND DISASTER MANAGEMENT PLAN

Developed:  June 2010          <named individual>          Date   Approved by
Revised:    November 2024                                  Date
            __________________________________________
            <named individual>, General Manager
```

and, on page 2, the single word `Signed`.

**Four things follow, all about this document only:**

- **Version is a pair of month-year strings in prose** — `Developed: June 2010`, `Revised: November
  2024`. There is no version number, no revision identifier, and **no statement of what this document
  supersedes**.
- **There is no effective date and no review date.** The `Date` fields next to `Approved by` and next
  to the signature rule are **blank in the text layer**.
- **Approval is a handwritten-signature convention.** The document expresses approval as a printed
  name, a role, a signature rule and the word `Signed` — not as a machine-readable approval record.
- **The PDF `/ModDate` (2024-11-21) and the printed revision (`November 2024`) agree**, which is a
  weak corroboration and is not evidence that the two are maintained together.

**The architectural consequence, stated at the strength n=1 supports:** ADR-0018 requires governed
documents to carry authority, lifecycle, version, effectivity and supersession. **At least one real
approved policy document carries none of that in-band** — every one of those attributes would have to
be supplied *at ingestion*, by a human or a system outside the file. That is an **existence claim**,
which n=1 can support. It is **not** a claim that policy documents generally lack this metadata, which
n=1 cannot support (§6).

### 4.5 Structure

- **Tagged PDF.** `/MarkInfo <</Marked true>>` and a `/StructTreeRoot` are both present, and the
  structure is real rather than nominal: the 8 object streams hold ~3,758 of the file's 4,234 objects,
  which are the structure elements.
- **Page content is marked up**: `2,300` BDC/BMC operations across the 45 pages — `/Span` × 1,865,
  `/P` × 345, `/Artifact` × 90.
- **Headers and footers are correctly marked as artifacts.** Every page carries a
  `/Artifact <</Attached [/Bottom]/Type/Pagination/Subtype/Footer>>` block containing the page number
  as `- N -`, and page 1 additionally carries a `/Subtype/Header` block.
- **Heavy table usage.** `9,934` `re` and `9,684` `W*` operations — rectangle-plus-clip pairs, the
  shape Word emits for table cells.
- **No active content whatsoever.** Zero occurrences of `/AcroForm`, `/JavaScript`, `/JS`,
  `/EmbeddedFile`, `/Launch`, `/OpenAction`, `/RichMedia`, `/Movie`, `/Sound`, `/URI`, `/GoToR`,
  `/Annots`, `/Names` or `/Filespec`. The one apparent `/AA` hit is a coincidental byte pair **inside a
  compressed stream**, verified by inspecting its surrounding bytes — it is not an additional-actions
  dictionary. There are no bookmarks (`/Outlines` absent).

**One structural question is deliberately left UNKNOWN.** The file ends with two `%%EOF` markers
(offsets 641,615 and 641,802) and a final trailer reading
`/Size 4234 /Root 1 0 R /Info 197 0 R /Prev 556779 /XRefStm 547540`, i.e. a multi-section,
hybrid-reference cross-reference layout. **Whether that represents a second revision saved
incrementally — and therefore whether an earlier state of the content is still recoverable from the
file — was not determined.** It is the ordinary shape Word 2016 emits, so the likely answer is "no",
but *likely* is not *verified* and this record will not round it up. **It matters**: a governed-document
pipeline that stores an uploaded PDF byte-for-byte may be storing superseded content it does not know
it has. This belongs at T-B, against more than one document.

---

## 5. The three extraction hazards — the most reusable output of this survey

Each was observed in this file, each is reproducible from it, and each would corrupt a T-B ingestion
pipeline **silently** — producing plausible text rather than an error.

### 5.1 Every glyph on the title page is drawn twice, and one copy is a decoration

Page 1 emits each character **two times**: once in light grey (`0.753 g`) inside `/Artifact BMC`, at an
offset of `(+0.36, −0.36)` pt, and once in black inside `/P <</MCID n>> BDC`. The grey copy is a **drop
shadow**, correctly tagged as an artifact.

```text
/Artifact BMC BT  1 0 0 1 110.06 216.98 Tm  0.753 g  [(D)] TJ  ET  EMC
/P <</MCID 89>> BDC BT  1 0 0 1 109.70 217.34 Tm  0 g  [(D)] TJ  ET  EMC
```

**An extractor that ignores marked-content scoping doubles every character on that page**, and the
title page reads `HHAADDII CCLLIINNIICC`. It does not fail; it produces confident garbage, on the one
page carrying the document's title, authorship and approval block.

**The measured size of the effect, stated precisely, because it is easy to overstate.** Artifact-marked
text across the whole document is **726 characters against 107,988 of content — about 0.7%**, so
document-wide the damage looks negligible. **On page 1 it is not negligible: 276 content characters
against 231 artifact characters**, so naive extraction very nearly doubles the title page. **The
document-wide ratio is the misleading number and the per-page one is the real one** — the corruption is
concentrated exactly where the governance metadata lives.

**It also silently ingests the page furniture.** Without artifact scoping, the `- 1 -` … `- 45 -`
footers enter the body text as content.

### 5.2 Language tags look like body text to a regex

The `/Span <</Lang (en-ZA)>> BDC` property dictionaries contain **parenthesised strings**. A regex-based
extractor that harvests `(...)` operands without checking that they precede `Tj`/`TJ` picks up **`en-ZA`
1,819 times and `en-GB` 46 times** and interleaves them through the body text. This was observed here
before the tokenizer was corrected, so it is a real failure mode rather than a hypothetical one.

### 5.3 A whole page of content is a vector drawing with 67 characters of text

**Page 23 of 45 yields 67 characters** — the lowest in the document by a factor of thirty — and it is
the only page carrying a Form XObject (`/Meta83`), which holds **100+ tiling patterns** and is one of
the two `Do` invocations in the entire file. The document's table of contents lists a section
**`9. FLOW CHART`**; that this is that page is **INFERRED** from position and shape, not verified.

**A text-only pipeline does not reject this page — it ingests it as almost empty.** D14's rejection
rule protects against a *non-text-native document*; it does not fire on a **text-native document
containing a page whose meaning is carried entirely by vector graphics**. A grounded-answer system
would then be unable to cite the flow chart while showing no sign that anything is missing.

**This is a gap between D14 and ADR-0017's grounding contract that n=1 is enough to demonstrate**,
because it is an existence proof. It is **not** enough to size it (§6).

---

## 6. What n=1 did NOT establish — recorded as insufficient, with no estimates

MSG-0080 requires these to be recorded as unanswerable rather than approximated. **No figure,
estimate, illustration, expected value, or "typical" case appears anywhere in this record for any of
them.**

| A-SURVEY dimension | Status at n=1 |
|---|---|
| **Format mix across the corpus** | **INSUFFICIENT.** One file is one format. Nothing here bears on how many corpus documents are PDF, DOCX, scanned TIFF, HTML or anything else |
| **Language prevalence across the corpus** | **INSUFFICIENT — and see below** |
| **Scanned-document prevalence** | **INSUFFICIENT.** This document is text-native. That is one document. **D14's rejection exposure remains completely unmeasured** |
| **Classification / audience distribution** | **INSUFFICIENT.** This document carries no classification marking. Whether that is the norm, an exception, or a property of this document type is unknown |
| **Version / supersession prevalence** | **INSUFFICIENT.** This document versions itself in prose. One instance is not a pattern |

**The language result needs stating carefully, because it is the one most likely to be misread.**

**This document contains no Arabic. That is not evidence that the corpus contains little Arabic — and
it is not evidence that it contains much.** It is one document, and it happens to be an English one.

**Therefore MSG-0056a D6 is exactly as discharged as it was before this task ran: partially, and no
further.** ADR-0019's Arabic normalization rules were accepted by MSG-0071 **on the express condition
that they come from empirical corpus evidence**. This survey produced **no Arabic text at all**, so it
supplies **zero** evidence about Arabic normalization. **No normalization rule was invented, inferred,
or drafted, and ADR-0019 was not amended and must not be amended on the strength of this record.**

**The one thing the language finding does establish** is narrower and worth keeping: **at least one
document in the approved material declares three different English locale tags and none in Arabic**, so
an ingestion pipeline cannot treat "the document's declared language" as a single reliable value even
within a single language (§4.3).

---

## 7. What this task changed, and what it did not

**Changed:** this record; `CLAUDE-TASKS.md`; `implementation/status/current.md`;
`implementation/comms/README.md`; WP-0009 §6.2's A-SURVEY row; the TASK-0027 checkpoint.

**Not changed, deliberately:**

- **No ADR.** `ADR-0017 … ADR-0022` are untouched — no file under `docs/decisions/` was written.
  **ADR-0019 in particular was not amended** (§6).
- **No Arabic normalization rule** was invented, drafted, or implied.
- **No provider, model, framework, embedding technology or runtime** was selected or recommended.
- **No task was marked READY.** **T-A, T-B, T-D, T-E and T-0 remain unauthorized.**
- **No permission setting was touched.** `runner-settings.json` was not opened for writing; MSG-0083's
  grant was used exactly as granted and nothing was broadened.
- **The corpus was not copied, moved, staged, committed, or written to.** It was read in place.

---

## 8. Two items referred to the Architecture Lead — neither blocking

**(1) The corpus is real organizational material, not synthetic — please confirm the designation.**
MSG-0080 authorizes A-SURVEY against an *"approved/synthetic"* corpus and constrains it to
*"approved/synthetic test corpus only. No production or confidential corpus ingestion."* The file at the
designated path is a **genuine 45-page Hadi Clinic emergency-preparedness and disaster-management plan**,
authored and approved by named individuals, with a real approval and signature block. **It carries no
confidentiality marking of any kind** (§4.4), and the Architecture Lead designated this exact path — so
**the read was authorized and no boundary was crossed**, and the survey proceeded rather than stopping.

**It is raised because the record should not quietly describe production material as synthetic.** Two
things follow if the Lead confirms the designation stands: this record has deliberately kept personal
names and document content out of the repository (§4.1), and **that restraint should continue** in any
follow-up. If the Lead intends A-SURVEY to run against genuinely synthetic material instead, this
record's observations should be re-read as observations about a *real* document — which makes them more
useful, not less, but changes what may be quoted from them.

**(2) The unattended runner has no PDF tooling.** `pdftoppm` is absent from the machine and `pdftotext`
is off the runner's Bash allowlist (§2). This survey worked around neither — it read the file's bytes
directly, which is within the granted read permission. **If PDF inspection is to become routine, that is
a permission/tooling decision and it is the Lead's**, not something to be self-authorized the way the
corpus read correctly was not.

---

## 9. Repository and corpus-path verification — run before completion was claimed

```text
$ git status --porcelain
(empty)

$ ls -l D:/Work/pci-corpus/plan.pdf
-rw-r--r-- 1 Administrator 197121 641807 Aug 22 11:31 plan.pdf        -> present, outside the repo

$ ls -l D:/Work/pci-platform/plan.pdf
ls: cannot access 'D:/Work/pci-platform/plan.pdf': No such file or directory   -> nothing copied in

$ git log --diff-filter=A --name-only --pretty=format: | grep -i "\.pdf"
(no output)                                                          -> no PDF ever added, in any commit

$ git rev-parse HEAD origin/main
9d5f747499f9eb1bc2ee9653a39170aad7260fe8
9d5f747499f9eb1bc2ee9653a39170aad7260fe8                             -> agreed at start and re-checked before commit
```

**Criterion 4 is the one that can fail silently, so it was checked four ways rather than assumed** —
working tree, corpus path, repository path, and the whole of history.

> **A known limit of this session, stated rather than glossed.** `git fetch` is off the runner
> allowlist, so `origin/main` above is the **local remote-tracking ref**. It agreed with `HEAD` at
> session start and again immediately before the commit, but a move on the true remote in that window
> would be detectable only by a rejected push. If the push is rejected, that is the mid-run movement
> condition — record it and stop.

---

## 10. Decision required

**None.** This is a record. The two §8 items are for the Lead's attention when convenient and block
nothing.

**TASK-0027 is COMPLETE and no task is READY.** A-SURVEY is now performed at n=1; **A-SURVEY at corpus
scale is not, and the organizational action that would enable it — representative approved material,
plural — is unchanged and still outside this repository's reach.**
