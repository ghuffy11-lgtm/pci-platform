# MSG-0087 — TASK-0028 Execution Record: Arabic Follow-up Survey at n=1

**Status:** **OPEN** — two findings need the Architecture Lead's attention; neither blocks anything
**Raised:** 2026-08-22
**Raised by:** Claude Code (interactive session, executed on explicit operator instruction)
**Type:** Task execution record
**Authority:** MSG-0085 (authorization), MSG-0086 (queue reconciliation), MSG-0083 (read grant) | **Related:** ADR-0019, D14, D6, MSG-0084

---

## 1. Outcome

**TASK-0028 is COMPLETE.** The Arabic document was inspected in place at
`D:\Work\pci-corpus\Arabic.pdf` under the existing MSG-0083 read grant. **ADR-0019 was not amended, no
normalization rule was proposed, and no corpus-wide claim is made.**

**The headline finding is that this document is OCR-derived.** Its producer is **ABBYY FineReader PDF
15**, and it carries both page images and a text layer. Under **D14** — *text-native only; scanned and
OCR-dependent documents are rejected rather than treated as authoritative* — **this document is the
class the accepted architecture excludes.**

That is a result, not a failure. It is the first empirical instance of the case D14 was written for.

**A second finding is about the document's identity, not its architecture:** its metadata title is
**`00. Country COVID-19 IAR Guidance (vers 1.0)`**, which is not a Hadi Clinic policy document. See §6.

---

## 2. Method, and its ceiling

**Byte-level inspection only.** The runner has no PDF tooling — `pdftoppm` is absent and `pdftotext` is
off the allowlist (MSG-0084 §8.2) — and MSG-0086 forbids installing any. The file was read through the
granted read-only path, its Flate streams decompressed in memory, and the decompressed content
examined.

```text
streams decoded : 90   (8 not Flate / not decodable)
decoded bytes   : 6,868,508
```

**This method has a ceiling, and one measurement hit it.** Attributing `/ToUnicode` to individual font
dictionaries needs real object-graph parsing; a windowed regex over decompressed bytes returned an
obviously wrong answer (0 of 31 font dicts, while 11 `/ToUnicode` references demonstrably exist). **That
number is therefore not reported as a finding** — only the two independent counts are, in §4.3.

**Nothing was written to the corpus directory**, which is denied by `Edit(//D:/Work/pci-corpus/**)`, and
nothing was copied into the repository.

---

## 3. Acceptance criteria — MSG-0085, each with evidence

| # | Criterion | State | Evidence |
|---|---|---|---|
| 1 | Used as approved/synthetic test document only | **MET** | Read-only inspection; no ingestion, no derived artefact |
| 2 | File kept outside the repository at all times | **MET** | §7 verification block |
| 3 | Used the existing MSG-0083 grant; no broadening | **MET** | `runner-settings.json` unchanged — `git diff` empty |
| 4 | Inspected directly; only observations supported by the file | **MET** | §4, every row traced to a byte-level observation |
| 5 | Recorded as **n=1 for the Arabic follow-up**; no generalization | **MET** | §5 states what one document cannot support |
| 6 | Assessed encoding, language declarations, fonts/`ToUnicode`, text-native vs scanned, hazards | **MET** | §4.2–§4.5 |
| 7 | **ADR-0019 not amended**; implications recorded as evidence only | **MET** | No ADR file touched; §5.3 states implications as evidence |
| 8 | Corpus outside repo; working tree clean | **MET** | §7 |
| 9 | COMMS updated; new task recorded rather than re-running a closed one | **MET** | TASK-0028 reconciled by MSG-0086; TASK-0027 untouched |

---

## 4. What n=1 established about **this document**

Every statement below is about the single file inspected. None is a statement about a corpus.

### 4.1 Identity and provenance

| Property | Value | Source |
|---|---|---|
| Path | `D:\Work\pci-corpus\Arabic.pdf` (outside the repository) | filesystem |
| Size | **679,230 bytes** | filesystem |
| Format | **PDF 1.5** | header `%PDF-1.5` |
| Pages | **16** | `/Type/Page` objects |
| Encryption | **none** | no `/Encrypt` anywhere |
| **Producer** | **`ABBYY FineReader PDF 15`** | `/Producer`, in a compressed object stream |
| **Creator** | **`PDFCreator Free 3.5.1`** | `/Creator`, same |
| **Title** | **`00. Country COVID-19 IAR Guidance (vers 1.0)`** | `/Title` |

**No personal names were found in the metadata**, unlike the English document. Nothing personal is
transcribed here in any case, per MSG-0086.

### 4.2 OCR-derived, not text-native — the decisive finding

**The producer is OCR software**, and the file has the structural signature of a scan carrying a
recognised text layer:

```text
/Producer            ABBYY FineReader PDF 15
/Subtype/Image       31 image XObjects
/DCTDecode            5      (JPEG-compressed page images)
/CCITTFaxDecode       2      (fax/bilevel - the classic scanned-page codec)
/ImageMask            present
Do (XObject draws)   33
BT (text blocks)    217      Tj 4,951   TJ 1,486
```

**Both layers are present at once**: 31 images drawn by 33 `Do` invocations, and a substantial text
layer of ~6,400 text-showing operators. A born-digital document does not normally carry per-page
bilevel images; an OCR output does.

**Contrast with the English document** (MSG-0084), which was produced by **Microsoft Word 2016**, was
verified text-native four independent ways, and carried no page images at all.

**This is what D14 excludes.** D14 rules text-native only, and rejects scanned/OCR-dependent documents
rather than treating OCR output as authoritative. **This document is OCR-dependent by construction:**
its text exists because ABBYY recognised it, not because an author typed it.

### 4.3 Fonts, encoding, and `ToUnicode`

**Arabic text is present.** Three embedded `SimplifiedArabic` subsets appear among eighteen distinct
`BaseFont` names:

```text
DKRTAH+SimplifiedArabic,Bold      IMHZMC+SimplifiedArabic      ZWTQPK+SimplifiedArabic
ArialUnicodeMS   QPKGKQ+Calibri   PXWVQR+SegoeUI   DESLQZ+Times-Roman
ZJZIZC+Arial     JWDFBT+Helvetica  SARJMR+ArialNarrow   Symbol   ZapfDingbats   ...
```

Corroborated independently: **62 byte pairs in the Arabic UTF-8 lead range (`D8–DB` followed by a
continuation byte)** appear in the decompressed streams.

**The document is mixed-script**, not Arabic-only — Latin text fonts (Calibri, Segoe UI, Times, Arial)
sit alongside the Arabic subsets, and the metadata title is English.

Encoding machinery:

```text
/Identity-H       1        /CIDFontType2     1        /WinAnsiEncoding  5
/Type/Font       31 dicts  /ToUnicode       11 references
```

**`ToUnicode` coverage is incomplete** — 11 references against 31 font dictionaries — which matters
because without a `ToUnicode` CMap a glyph code cannot be reliably mapped back to a Unicode character.
**Exactly which fonts lack it was not determined**, for the reason in §2; the two counts are reported
and the attribution is not.

### 4.4 No language is declared anywhere

```text
/Lang declarations : none
```

**Not one**, at document level or span level. **The English document declared `en-ZA` 1,819 times and
`en-GB` 46 times** (MSG-0084 §5.2) — enough that harvesting them as body text was itself a hazard.

Here the opposite problem exists: **a pipeline that reads language from the document gets nothing at
all**, and for a mixed Arabic/Latin file the language of any given passage must be *detected* rather
than *read*.

### 4.5 The three English hazards — checked for, and not found

MSG-0086 required these be checked for rather than expected. **None of the three reproduces here:**

| Hazard (MSG-0084 §5) | Present here? |
|---|---|
| Drop-shadow glyph duplication inside `/Artifact` | **No** — no `/Artifact` marked content found |
| `/Span <</Lang (..)>>` strings harvested as body text | **No** — no `/Lang` exists to harvest |
| A page whose meaning is a vector drawing | **No** — this document's non-text content is **raster images**, not vector art |

**Finding none of them is a real result**, and it is the expected one: the hazards of a Word-produced
document and of an OCR-produced scan are simply different populations of defect. **The corollary is
that a T-B pipeline hardened only against the English document's hazards would be hardened against the
wrong things for this one.**

---

## 5. What n=1 did NOT establish

Recorded as insufficient, with **no estimates offered**.

### 5.1 Nothing distributional

**Format mix · language prevalence · scanned-document prevalence · classification and audience
distribution · version and supersession prevalence** — all remain unestablished. One document is not a
population.

### 5.2 The two documents are **not** a corpus

MSG-0086 named this explicitly and it is worth restating: one English file and one Arabic file, both
chosen by an operator, are **not a sample**. Nothing here supports a statement such as "half the corpus
is OCR" or "Arabic material is scanned while English is native". **Two points do not make a
distribution**, and the pairing is an artefact of what was supplied.

### 5.3 Implications for ADR-0019 — evidence only, and deliberately not a proposal

MSG-0085 §7 forbids amending ADR-0019 or deriving implementation authority from one document. **Nothing
is proposed.** What this document *evidences*, for a later architecture decision:

- **Language cannot be read from the document.** No `/Lang` exists, and the file is mixed-script, so
  any language-dependent normalization needs detection with its own error behaviour.
- **Round-tripping glyphs to Unicode is not guaranteed** where `ToUnicode` is absent. Normalization
  operates on extracted characters, so extraction fidelity is upstream of every normalization rule
  ADR-0019 might eventually record.
- **ADR-0019's deferral looks well-judged on this evidence.** A single mixed-script OCR document is
  precisely the material from which a plausible-but-wrong normalization rule could have been
  generalised.

**One document cannot settle any of this**, and it is recorded so a later decision has evidence rather
than a rule inherited from a sample of one.

---

## 6. Two items for the Architecture Lead — neither blocking

**(1) This document is OCR-derived, so D14 would reject it from the corpus.** The authorization calls it
an approved/synthetic Arabic test document, and as a *test* document it is genuinely useful — it is the
first concrete instance of the case D14 excludes, and it shows what such a file looks like structurally.
**But it cannot serve as evidence about how the assistant will handle admissible Arabic policy
material, because under the accepted architecture it would never be admitted.** If the intent was to
characterise the Arabic material the assistant will actually ingest, **a text-native Arabic document is
needed**; if the intent was to characterise what rejection must cope with, this document does that well.
**Which of the two was intended is the Lead's to say.**

**(2) The document is not Hadi Clinic policy material.** Its title is `00. Country COVID-19 IAR Guidance
(vers 1.0)` — WHO-style intra-action-review guidance. This does not affect any structural observation
above, and no boundary was crossed: the Lead designated the path and the read was authorized. It is
raised for the same reason MSG-0084 raised the synthetic/real question — **the record should describe
what the file is**, so that a later reader does not treat these observations as characterising the
organization's own Arabic policy corpus.

---

## 7. Repository and corpus-path verification

Run before completion was claimed:

```text
Test-Path D:\Work\pci-corpus\Arabic.pdf        -> True     (still in place, unmodified)
Test-Path D:\Work\pci-platform\Arabic.pdf      -> False    (nothing copied in)
ls D:\Work\pci-platform\*.pdf                  -> none
git log --diff-filter=A --name-only | grep .pdf-> nothing ever added
git diff --name-only runner-settings.json      -> empty    (no permission change)
git diff --name-only docs/                     -> empty    (no accepted ADR touched)
```

---

## 8. What this task changed, and what it did not

**Changed:** this record, the queue row for TASK-0028, the status board, and the COMMS register.

**Not changed:** **ADR-0019 and every other accepted ADR**; `runner-settings.json`; the corpus file; any
task's READY state other than TASK-0028's own completion. **T-A, T-B, T-D, T-E and T-0 remain
unauthorized**, and nothing here authorizes implementation.

---

## 9. Decision required

**None to proceed.** The two §6 items are for the Lead's attention when convenient.

**A-SURVEY has now been performed at n=1 twice — once on a Word-produced English document, once on an
OCR-produced mixed-script one.** A-SURVEY **at corpus scale remains unperformed**, and the
organizational action that would enable it — representative approved material, **plural** — is
unchanged.
