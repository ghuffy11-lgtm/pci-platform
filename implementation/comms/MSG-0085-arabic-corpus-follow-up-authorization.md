# MSG-0085 — Arabic Corpus Follow-up Authorization

**Status:** AUTHORIZED
**Authority:** Architecture Lead
**Related:** MSG-0083, MSG-0084, ADR-0019, TASK-0027

## Authorization

The newly provided approved/synthetic Arabic test corpus at:

`D:\Work\pci-corpus\Arabic.pdf`

is authorized for a bounded follow-up survey to complement the completed n=1 English survey.

### Instructions for Claude

1. Use `D:\Work\pci-corpus\Arabic.pdf` as an approved/synthetic test document only.
2. Keep the file outside the Git repository at all times.
3. Use the existing narrow read-only corpus permission authorized by MSG-0083. Do not broaden permissions.
4. Inspect the Arabic PDF directly and record only observations supported by the file.
5. Record the sample as **n=1 for the Arabic follow-up**. Do not generalize its findings to the wider corpus.
6. Specifically assess Arabic text encoding/extraction, language declarations, font/ToUnicode behavior, text-native vs scanned characteristics, and any normalization/extraction hazards relevant to ADR-0019 and downstream retrieval.
7. **Do not amend ADR-0019** or create implementation authorization based solely on this one document. Any proposed implications must be recorded as evidence for a later architecture decision.
8. Verify that the Arabic PDF remains outside the repository and that the repository working tree remains clean.
9. Update COMMS with the execution record and evidence. If a new bounded task/READY reconciliation is required by the queue, record that rather than silently re-running a closed task.

### Guardrails

- No production/confidential corpus ingestion.
- No copying the PDF into Git.
- No permission changes beyond MSG-0083.
- No implementation.
- No unsupported corpus-wide prevalence claims.
- Preserve all accepted ADRs unchanged unless separately authorized.
