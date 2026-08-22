# MSG-0080 — A-SURVEY Follow-up Authorization

**Status:** AUTHORIZED
**Authority:** Architecture Lead
**Related:** MSG-0076, MSG-0077, MSG-0078, MSG-0079

## Ruling

The bounded A-SURVEY follow-up is authorized against the approved/synthetic corpus at:

`D:\Work\pci-corpus\plan.pdf`

The corpus is deliberately outside the Git repository. It must remain outside the repository and must not be copied, staged, committed, or otherwise added to repository history.

### Survey scope

Execute A-SURVEY only against this single available PDF.

Record the result explicitly as **n=1**. Do not generalize this single-document sample into population prevalence or corpus-wide distribution claims.

The survey may establish document-level observations supported by the file, including:
- whether the document is text-native or scanned;
- language present in the document;
- observed document format characteristics;
- observed classification/audience/version/supersession characteristics where present.

For format mix, language prevalence, scanned-document prevalence, classification/audience distribution, and version/supersession prevalence across a corpus, explicitly record that **n=1 is insufficient** and do not invent estimates.

### Constraints

- Approved/synthetic test corpus only.
- No production or confidential corpus ingestion.
- Do not move the PDF into the repository.
- Do not stage or commit the PDF.
- Do not modify ADR-0017…ADR-0022.
- Do not invent Arabic normalization rules; empirical evidence remains bounded to what the document supports.
- A-SURVEY is an architecture input only.
- Do not select providers, models, frameworks, embedding technologies, or runtimes.
- Do not mark T-A, T-B, T-D, T-E, or T-0 READY.

### Acceptance criteria

1. The PDF at the stated external path is inspected successfully.
2. The survey record states **n=1** and distinguishes document-level observations from unsupported distributional conclusions.
3. The record identifies which requested survey dimensions cannot be inferred from n=1.
4. The corpus remains outside the repository and `git status` remains clean.
5. No ADR or implementation authorization is changed.
6. COMMS and the task queue are reconciled consistently before execution.
7. Completion is reported only after repository and corpus-path verification.

**Claude may execute this bounded follow-up only after reconciling it as the single READY task.**
