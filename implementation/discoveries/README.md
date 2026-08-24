# Implementation Discoveries

Findings surfaced during implementation that do **not** require stopping work, but that the
architecture lead should know about.

Anything that changes or blocks architecture belongs in `../decisions/` or `../blockers/` instead.

Every `DISC-*.md` record in this directory is listed below. The **record is the source of truth**;
this table is an index of it. A record present on disk but absent from this table is a defect in the
record, not a missing discovery.

| ID | Title | Status |
|---|---|---|
| [DISC-0001](DISC-0001-governance-tree-duplication.md) | Duplicated governance documents across `knowledge/` and `docs/` | Recorded — no action taken |
| [DISC-0002](DISC-0002-adapter-test-fidelity.md) | In-memory adapter test fidelity gap | Recorded — mitigated, not eliminated |
| [DISC-0003](DISC-0003-dev-identity-adapter.md) | Development identity adapter boundary | Recorded |
| [DISC-0004](DISC-0004-compose-storage-boundary.md) | Compose stack predates the `/data/docker` boundary | **RESOLVED** 2026-08-19 — answered by the pre-staged `/data/docker/daemon.json` on the authorized host; no compose change strictly required |
| [DISC-0005](DISC-0005-test-glob-false-green.md) | `npm test` reports success while running zero tests under POSIX shells | **CORRECTED** 2026-08-19 — the target-platform claim was **wrong** and is disproven by measurement; the defect is real but confined to Git Bash / MSYS on Windows. Do not act on the original recommendation |
| [DISC-0006](DISC-0006-crlf-defeats-anchored-edits.md) | CRLF line endings silently defeat anchored text edits | **RESOLVED** 2026-08-20 by TASK-0003 — attribute pinned, working-tree residue 150 -> 0 |
| [DISC-0007](DISC-0007-initdb-role-provisioning-defect.md) | Database init refuses to create a passwordless role, then creates one anyway | **RESOLVED** 2026-08-19 by TASK-0004 (MSG-0012) — fix verified against a clean initialisation |
| [DISC-0008](DISC-0008-compose-kernel-service-incomplete.md) | Compose kernel service cannot start as committed | **RESOLVED** 2026-08-19 by TASK-0005 (MSG-0012, option 1) — guard verified intact |
| [DISC-0009](DISC-0009-docker-client-state-outside-data.md) | Docker CLI writes client state to `/home/claude`, outside the `/data` boundary | **CLOSED — ACCEPTED, NOT A VIOLATION** 2026-08-19 by MSG-0020(b) / MSG-0022 / MSG-0023 — account-level tool state is not a PCI project artifact under contract v0.2 |
| [DISC-0010](DISC-0010-work-package-register-disagreement.md) | The two work-package registers disagree about what WP-0001 is; `docs/program/work-packages.md` already lists a WP-0002 | **RESOLVED** 2026-08-21 (TASK-0023, MSG-0066) — the moment it predicted arrived: a second work package was allocated. Reconciled under MSG-0062 §7.1 by option 3 (both registers retained, allocation rule added); **WP-0009** allocated, historical WP-0001 preserved. Previously **RECORDED** 2026-08-21 (TASK-0021, MSG-0055 §7.1) |
| [DISC-0011](DISC-0011-epa-0006-4-11-verdict-count.md) | EPA-0006 §4.11's summary says *"Six designs NOT CLEARED, three DISQUALIFIED"* while its own table lists **seven** NOT CLEARED and three DISQUALIFIED | **RECORDED — not corrected** 2026-08-24 (TASK-0041, MSG-0132). **No verdict is wrong**; the defect is confined to one arithmetic summary of a correct table, and **nothing downstream depends on the tally**. Not fixed because TASK-0041 is additive-only and rewording a prior section needs its own authorization. **Row added in the same commit that raises the record** |

## Reconciled 2026-08-20 — TASK-0015

This table listed **three** rows while **nine** `DISC-*.md` records existed. DISC-0004 through
DISC-0009 were absent, so a reader of the index alone would have missed every discovery raised during
host verification — including two that were defects in the deployment artifacts (DISC-0007,
DISC-0008) and one that touches a hard boundary rule (DISC-0009).

Authorized by MSG-0039 (a)/(b). Every status above is transcribed from the record's own header line;
**no discovery record was altered, deleted, or renumbered.** The three pre-existing rows already
agreed with their records and were preserved — DISC-0002's wording was aligned to the record's own
phrasing, which changes no status.

Nothing was found that required architectural judgment: all nine records carry an unambiguous status,
and no index row existed without a corresponding record.

Evidence: [`../comms/MSG-0040-task-0015-execution-record.md`](../comms/MSG-0040-task-0015-execution-record.md),
[`../operations/checkpoints/TASK-0015.md`](../operations/checkpoints/TASK-0015.md).

> This is the **third index in a row** to be found drifting from its own records — after the blocker
> index (BLK-0001 / BLK-0004 shown OPEN when resolved, TASK-0013) and the same index again (BLK-0005
> listed nowhere, TASK-0014). The pattern is consistent: a record is created or closed in its own
> file, and the table that indexes it is not updated in the same commit.
