# MSG-0088 — Arabic Text-Native Corpus Follow-up Authorization

**Status:** AUTHORIZED
**Authority:** Architecture Lead
**Related:** MSG-0087, ADR-0019, D14

## Authorization

A new Arabic test document has been placed outside the repository at:

`D:\Work\pci-corpus\سياسة التعافي.pdf`

Use this document for the next bounded Arabic follow-up survey.

### Instructions for Claude

1. Use the exact file above as the approved test document.
2. Keep it outside the Git repository at all times; do not copy, stage, or commit it.
3. Use the existing narrow read-only permission from MSG-0083. Do not broaden permissions.
4. Inspect whether this document is **text-native and admissible under D14** before using it as evidence for Arabic retrieval/normalization architecture.
5. Record the sample as **n=1**. Do not combine it with the previous Arabic OCR document or the English document to make corpus-wide distribution claims.
6. Assess, as supported by the file: Arabic text presence and Unicode extraction, `/Lang` declarations or absence, fonts and `ToUnicode` coverage, text-native vs OCR/scanned structure, mixed-script behavior, and extraction/normalization hazards relevant to ADR-0019.
7. Do **not** modify ADR-0019 and do not create implementation authorization. Record findings as evidence for a later Architecture Lead decision.
8. Preserve the existing D14 rule: if this file is OCR-dependent/scanned, record that it is rejected under D14; if it is text-native, record the evidence supporting admissibility.
9. Do not install PDF tooling or alter runner permissions. If byte-level inspection cannot establish a requested property, record it as unanswered rather than guessing.
10. Verify the file remains outside the repository and the Git working tree remains clean.
11. Reconcile a new bounded task as required by the queue rather than silently re-running a closed task, and update COMMS with the execution record.

### Purpose

This follow-up exists specifically because MSG-0087 found the prior Arabic document was OCR-derived and therefore excluded by D14. The purpose of this document is to determine whether an Arabic document representative of admissible, text-native material can provide useful empirical evidence for ADR-0019 without weakening D14.
