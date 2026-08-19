# MSG-0017 — TASK-0006 Complete: WP-0001 Is Now Reproducible

**Status:** **CLOSED** — TASK-0007 authorized by MSG-0018 and completed 2026-08-19 (gate G4). See MSG-0019.
**Raised:** 2026-08-19
**Raised by:** Claude Code (implementation agent)
**Type:** Record — task completion
**Authority:** MSG-0016 (destructive authorization, limited to TASK-0006)

## Outcome

**Gate G3 passed. The reproducibility gap that has qualified every WP-0001 status report since
2026-08-19 is closed.**

The destructive volume re-initialisation authorized by MSG-0016 was performed, and the stack was
rebuilt from repository configuration only:

```text
migrations   applying 0001_kernel_foundation ... applied
             migrations complete: 1 applied, 0 already present
role         password_set=true  super=false  bypassrls=false  login=true
privileges   CREATE on public: true | USAGE on public: true
pci_test     exists=true  owner=pci_app
schema       8 tables | 6 with FORCE RLS | 6 policies
kernel       /health/ready HTTP 200 - store ok (1ms), identity ok (static), policy ok
boundary     /data/docker/volumes/pci-kernel_postgres-data/_data
```

**No manual SQL was run at any point**, which is the entire point: manual SQL is what DISC-0007 was
about, and clean-room evidence produced with it would have been worthless.

## Procedure followed

| Requirement (MSG-0016 / TASK-0006) | How it was met |
|---|---|
| Checkpoint **before** the destructive operation | Checkpoint 1 written, committed, and pushed (`9c4137e`) before anything was destroyed |
| Checkpoint **after**, with verified state | Checkpoint 2 records the observed rebuild |
| Verify actual resulting state directly | Every assertion above is quoted command output, not inference |
| No manual SQL as clean-room evidence | None run |
| No credential committed | None; `.env` remains 0600 and gitignored |
| `/data` boundary | Volume at `/data/docker/volumes/...`; nothing outside `/data` |

Before destroying anything, the volume was inspected and its contents recorded: databases `pci` and
`pci_test`, 8 tables, **0 knowledge objects, 0 audit records, 1 tenant row** — only TASK-0001
verification artifacts and the manual workaround. Nothing irreplaceable was lost.

## One observation worth recording

The postgres log contains a single `FATAL: the database system is shutting down`. It sits between
`LOG: shutting down` and `LOG: database system is shut down` — a connection arriving during the
entrypoint's normal shutdown of its temporary init server. It is not an initialisation failure, and
it appears in healthy runs. Recorded here so a future session does not mistake it for one.

## What changed in meaning, not just in contents

Before this task, the running database proved nothing: it had been repaired by hand in TASK-0001,
so its correct state was evidence about my typing, not about the repository. It now demonstrates
the repository's own initialisation path.

That distinction is why TASK-0006 existed as a separate gated task rather than being folded into
TASK-0004, and it is recorded in both checkpoints so a resuming session cannot confuse the two
states — they look nearly identical from a `psql` prompt.

## Scope boundary — stopping here

MSG-0016 authorized **TASK-0006 alone**, explicitly excluding TASK-0007, TASK-0008, TASK-0009, and
supervisor installation. The continuation rule therefore does not carry execution forward, and it
has not.

Specifically **not** done: the full test-tier re-verification. No acceptance criterion is
re-asserted on the strength of this rebuild — the AC verdicts in report section 11 still stand on
their original evidence. Section 13 adds reproducibility, which was the missing *completion*
criterion, not new AC evidence.

## Decision required

1. **Authorize TASK-0007** — re-run all three test tiers against the clean-room stack, so the AC
   evidence describes a reproducible system rather than a hand-patched one. This is the natural
   next step and needs no destructive operation.
2. Then TASK-0008 (record reconciliation) and TASK-0009 (your completion decision).

Also still open: MSG-0011 (whether to install/enable the Execution Supervisor) and TASK-0003
(`*.md` line-ending normalisation).

## Note on the queue rewrite

The architecture lead's `2d348c1` condensed `CLAUDE-TASKS.md` from ~700 lines to 240. The board,
ledger, protocol, continuation rule, stop boundaries, and TASK-0006's full specification all
survived, so execution proceeded. Flagged only because the earlier per-task detail for TASK-0007,
TASK-0008, and TASK-0009 — their forbidden actions, evidence requirements, and stop conditions —
is now shorter than it was. If that detail is wanted before those tasks run, it is recoverable from
`78c4a0f`.
