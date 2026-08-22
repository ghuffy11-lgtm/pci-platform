# MSG-0089 — TASK-0029 Execution Record: Text-Native Arabic Survey at n=1

**Status:** **OPEN** — two items for the Architecture Lead; neither blocks anything
**Raised:** 2026-08-22
**Raised by:** Claude Code (interactive session; the scheduled task is Disabled, so no runner could take it)
**Type:** Task execution record
**Authority:** MSG-0088 | **Related:** MSG-0087, ADR-0019, D14, D6, MSG-0083

---

## 1. Outcome

**TASK-0029 is COMPLETE.** The document at `D:\Work\pci-corpus\سياسة التعافي.pdf` was inspected in
place under the MSG-0083 read grant. **ADR-0019 was not amended and no normalization rule was
proposed.**

**It is text-native and admissible under D14.** Zero images, zero OCR markers, embedded Unicode-capable
fonts, and text that round-trips to real Arabic code points. MSG-0088's question — whether an
admissible Arabic document can yield useful ADR-0019 evidence without weakening D14 — is answered
**yes**, and the evidence is in §4.

**The finding that matters is new and reproducible: the Arabic text is stored in visual order, not
logical order.** A naive extractor returns every Arabic word reversed. This is proven by code-point
comparison in §4.4, not asserted.

**One caveat is structural and needs the Lead's eye:** the document's `/Producer` is **WeasyPrint 68.0**
and its `/Creator` is **ChatGPT** — it is a generated document, not organizational policy material
(§6).

---

## 2. Method and its ceiling

Byte-level inspection only, as MSG-0088 §9 requires — no PDF tooling installed, none requested.

```text
streams decoded : 15   (2 not Flate)      decoded bytes : 236,095
object streams  : 0    -> body objects are plain, unlike the previous Arabic file
```

**One method correction worth recording.** The first pass looked for font dictionaries inside the
*decompressed streams*, as had worked for the OCR document, and found none. That was wrong: this file
has **no `/ObjStm`**, so its font and metadata objects sit in the **plain body**. Searching the raw
bytes found them immediately. **The absence was an artefact of where I looked, not a property of the
file** — the same class of mistake as the `ToUnicode` miscount in MSG-0087 §2, caught the same way, by
disbelieving a suspicious zero.

---

## 3. Acceptance against MSG-0088

| # | Instruction | State |
|---|---|---|
| 1 | Use the exact file | **MET** — filename code points verified against MSG-0088 character by character |
| 2 | Keep outside the repo; no copy/stage/commit | **MET** — §7 |
| 3 | Use the existing MSG-0083 permission; no broadening | **MET** — `runner-settings.json` unchanged |
| 4 | Inspect D14 admissibility **before** using as evidence | **MET** — §4.2 precedes §5 |
| 5 | Record as n=1; do not combine with the other documents | **MET** — §5.1 |
| 6 | Assess Arabic presence/extraction, `/Lang`, fonts/`ToUnicode`, native vs OCR, mixed script, hazards | **MET** — §4 |
| 7 | Do not modify ADR-0019; findings are evidence only | **MET** — §5.2 |
| 8 | Record admissibility either way | **MET** — **admissible**, §4.2 |
| 9 | No tooling, no permission changes; unanswered stays unanswered | **MET** — §2 |
| 10 | File outside repo, tree clean | **MET** — §7 |
| 11 | Reconcile a new bounded task, not a silent re-run | **MET** — TASK-0029 allocated; TASK-0028 untouched |

---

## 4. What n=1 established about **this document**

### 4.1 Identity

| Property | Value |
|---|---|
| Path | `D:\Work\pci-corpus\سياسة التعافي.pdf` (outside the repository) |
| Size | **119,055 bytes** |
| Format | **PDF 1.7**, 5 pages, **no `/Encrypt`** |
| **Producer** | **`WeasyPrint 68.0`** — an HTML-to-PDF renderer |
| **Creator** | **`ChatGPT`** |
| **Author** | **`ChatGPT Canvas`** |
| Title | `سياسة التعافي من الكوارث` — "Disaster Recovery Policy", stored UTF-16BE in `/Info` |
| Tagged | **yes** — `/StructTreeRoot`, `/MarkInfo`, `/Marked true` |

### 4.2 Text-native and D14-admissible — VERIFIED

```text
/Subtype/Image   0      /DCTDecode   0      /CCITTFaxDecode  0
/JBIG2Decode     0      ImageMask    0      OCR producers    none
BT 226    TJ 469    Tj 0    Tf 363    Do 1
```

**No raster content of any kind**, and no OCR producer string. The text exists because it was rendered
from markup, not recognised from pixels. **Under D14 this document is admissible** — the first Arabic
document surveyed that is.

Contrast with the previous Arabic file (MSG-0087): 31 images, CCITTFax and DCTDecode, `/Producer`
ABBYY FineReader — **rejected under D14**.

### 4.3 Fonts and `ToUnicode` — full round-trip capability

```text
/Type/Font dicts 12     /Subtype/Type0 4     /Identity-H 4     /CIDFontType0|2 4
/FontFile*        4     /ToUnicode     4
BaseFonts: FOLJZL+FreeSerif   MQHTFA+FreeSerif-Bold   HUHQIP+Noto-Sans   SDIUIR+Noto-Sans-Bold
```

**Four CID fonts, each subset-embedded and each with a `ToUnicode` CMap** — a complete
glyph-to-Unicode path, which the OCR document did not have. The CMaps carry **209 mappings across 5
`bfchar` blocks, of which 186 target the Arabic block U+0600–U+06FF.**

**Extraction works.** Translating content-stream hex strings through the CMaps yielded **331 characters
from the first 40 runs, 232 of them Arabic**. This is the property ADR-0019 needs and could not get
from an OCR file.

### 4.4 THE HAZARD: text is stored in visual order, not logical order

**Proven by comparing the extracted run against the document's own `/Info /Title`**, which is stored in
logical order as authored:

```text
authored title            : U+0633 U+064A U+0627 U+0633 U+0629 ... U+0645 U+0646 ... U+0643 U+0648 U+0627 U+0631 U+062B
first TJ run extracted    : U+062B U+0631 U+0627 U+0648 U+0643 U+0644 U+0627 U+0020 U+0646 U+0645
that run REVERSED         : U+0645 U+0646 U+0020 U+0627 U+0644 U+0643 U+0648 U+0627 U+0631 U+062B
```

**The reversed run is byte-identical to the tail of the authored title.** Two things follow:

1. **Characters within a run are stored in reverse (visual) order.** Reversing recovers the authored
   text exactly.
2. **Runs are emitted in reverse document order too** — the *last* logical phrase of the title is the
   *first* TJ run on the page.

**Naive extraction therefore produces fluent-looking but wholly reversed Arabic**, which no downstream
component would flag as an error. It is the same failure shape as the English drop-shadow hazard
(MSG-0084 §5.1): **the pipeline does not fail, it produces confident garbage.**

> **A caveat on my own test, stated because the raw output looks like a contradiction.** The scripted
> `StartsWith` check printed **False for both** the forward and the reversed run. That is because the
> extracted run is the title's **tail**, not its head — the check compared against the title's opening
> characters. **The code-point identity above is the actual evidence**, and it is exact.

### 4.5 Two further hazards, observed in the extracted text

- **Intra-word spacing.** Extracted text shows spaces inside words (for example a single word split as
  `ي فاعتلا`), an artefact of kerning offsets inside `TJ` arrays being read as word breaks. **A
  tokenizer would index fragments rather than words.**
- **Detached diacritics.** Arabic tashkeel appear separated from their base letters (for example
  `ددح ُ ي`). **Any normalization that strips or folds diacritics will behave differently on detached
  marks than on composed ones** — which is squarely ADR-0019's subject matter.

### 4.6 `/Lang` is declared — and it is wrong

```text
/Lang : en
```

**The document declares English while its body is Arabic.** The previous Arabic document declared
nothing at all (MSG-0087 §4.4); the English document declared `en-ZA`/`en-GB` correctly and abundantly
(MSG-0084 §5.2).

**So across three documents the language declaration has been correct once, absent once, and wrong
once.** A pipeline that trusts `/Lang` would route this Arabic policy down an English path — selecting
English normalization, English analyzers, and an English acceptance bar.

**Language must be detected from content, and any declared value treated as a hint to be checked** —
n=1 evidence, but the specific failure is concrete and reproducible.

---

## 5. What n=1 did NOT establish

### 5.1 Nothing distributional, and the three documents are not a corpus

**No prevalence, mix, or distribution claim is made or supportable.** MSG-0088 §5 forbids combining
this with the OCR Arabic document or the English one, and that is right: three files chosen by an
operator, each from a different producer, are **not a sample of anything**. The pattern in §4.6 is
offered as three observations, explicitly **not** as a rate.

### 5.2 ADR-0019 — evidence recorded, nothing proposed

**ADR-0019 is untouched.** For a later decision, this document evidences:

- **Bidirectional order must be reconstructed at extraction**, not assumed. This is upstream of every
  normalization rule — normalizing reversed text produces normalized nonsense.
- **Token boundaries cannot be taken from extracted spacing** where kerning injects them.
- **Diacritic handling must cope with detached marks**, not only composed ones.
- **`/Lang` is not trustworthy** and language detection needs its own error behaviour.

**None of this is a rule and none is proposed as one.** ADR-0019's deferral continues to look
well-judged: a rule generalised from any single one of the three documents surveyed so far would have
been wrong for the other two.

---

## 6. Two items for the Architecture Lead — neither blocking

**(1) The document is generated, not organizational.** `/Producer` is WeasyPrint 68.0, `/Creator` is
ChatGPT, `/Author` is "ChatGPT Canvas". As a **technical specimen of admissible text-native Arabic** it
is exactly what MSG-0088 asked for, and its hazards in §4.4–§4.6 are real and reproducible.

**But extraction hazards are a property of the producing toolchain**, and this is demonstrably not the
organization's. The three documents surveyed have three different producers — Word 2016, ABBYY
FineReader, WeasyPrint — and **each produced a different family of defect, with no overlap at all**.
Hardening a T-B pipeline against WeasyPrint's hazards says little about what the organization's own
Arabic authoring toolchain will produce. **If the goal is to characterise real material, a document
produced the way the organization actually produces policy is what is needed.**

**(2) The prior Arabic document has been removed.** `Arabic.pdf` is no longer in the corpus directory —
it was replaced rather than added alongside. **MSG-0087's findings remain valid as a record**, but they
can no longer be re-verified against the file. Noted so a future reader is not surprised.

---

## 7. Repository and corpus verification

```text
corpus dir : plan.pdf (641,807)  and  سياسة التعافي.pdf (119,055)   - Arabic.pdf no longer present
Test-Path D:\Work\pci-platform\*.pdf        -> none
git log --diff-filter=A --name-only | .pdf  -> nothing ever added
git diff --name-only runner-settings.json   -> empty
git diff --name-only docs/                  -> empty
git status --porcelain                      -> clean at completion
```

---

## 8. Decision required

**None to proceed.** The §6 items are for the Lead's attention.

**A-SURVEY has now been performed at n=1 three times, on three producers.** A-SURVEY **at corpus scale
remains unperformed**, and the organizational action that would enable it — representative approved
material, **plural**, produced the way the organization actually produces policy — is unchanged.

**Operational note:** the scheduled task `PCI-Execution-Supervisor` is **Disabled** (last run
17:37:37), so no unattended cycle will pick up future work until it is re-enabled.
