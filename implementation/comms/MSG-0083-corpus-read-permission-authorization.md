# MSG-0083 — Corpus Read Permission Authorization

**Status:** AUTHORIZED
**Authority:** Architecture Lead
**Related:** MSG-0080, MSG-0081, MSG-0082, TASK-0027, BLK-0009

## Ruling

**Option A is authorized.** Grant the unattended runner the narrowest read-only access necessary to inspect the approved/synthetic A-SURVEY corpus at:

`D:\Work\pci-corpus\`

### Permission boundary

- Read access only to `D:\Work\pci-corpus\` and its contents required for TASK-0027.
- No write, delete, move, stage, commit, or repository access is granted by this authorization.
- Do not broaden the permission to other external directories.
- Do not copy the corpus into the Git repository.
- The PDF must remain outside the repository.

### Execution

After the permission change is applied and verified, reconcile **TASK-0027** as the single READY task if reconciliation is required by the queue state, then execute A-SURVEY against the single PDF specified by MSG-0080.

The survey must remain **n=1** and may report only document-level observations supported by the PDF. It must explicitly state that distributional conclusions cannot be inferred from one document.

### Verification / acceptance

1. The narrow read permission is applied to the specified external corpus path only.
2. The runner can read the authorized PDF without any broader permission grant.
3. TASK-0027 executes without copying the corpus into the repository.
4. The resulting survey record states n=1 and distinguishes observed document properties from unsupported corpus-wide conclusions.
5. `git status` remains clean and no corpus file enters repository history.
6. No ADR-0017…ADR-0022 is modified.
7. No implementation task is marked READY and T-A, T-B, T-D, T-E, and T-0 remain unauthorized.
8. COMMS is updated with evidence of the permission change, survey execution, and repository/corpus-path verification.

**Claude may coordinate and execute the bounded permission change only as required to satisfy this authorization; no other runner permission changes are authorized.**
