# Proposed Architecture Definitions

Architecture definitions produced by implementation sessions at the request of the architecture
lead, before an implementation work package exists.

Records here are **PROPOSED**. They carry no architectural authority. Nothing in this directory
overrides `docs/`, an accepted ADR, an accepted specification, or the Constitution, and nothing here
authorizes implementation. The architecture lead promotes accepted material to `docs/` — until then
these files are a decision-ready proposal and a register of decisions, not a design of record. All
fourteen decisions in `EPA-0003` were ruled on 2026-08-21 (MSG-0056a/b) and are annotated inline; the
records themselves remain **PROPOSED** until the architecture lead accepts them.

Per `CLAUDE.md`, an implementation agent stops at the boundary where an architectural decision is
required, records the issue with impact and options, and does not silently modify or extend accepted
architecture. Where this directory records a recommendation, the recommendation is exactly that: a
recommendation awaiting a ruling.

| ID | Title | Status | Authority |
|---|---|---|---|
| EPA-0001 | Employee Policy Assistant — architecture definition | **PROPOSED** | TASK-0021, MSG-0054 |
| EPA-0002 | Employee Policy Assistant — proposed work package, sequence, and gates | **PROPOSED — not authorized** | TASK-0021, MSG-0054 |
| EPA-0003 | Employee Policy Assistant — required architecture-lead decisions | **ALL FOURTEEN RULED** 2026-08-21 (MSG-0056a/b); its three reconciliation findings **and the numbering collision were ruled by MSG-0058**, and MSG-0057 is CLOSED | TASK-0021, MSG-0054 |
| EPA-0004 | Employee Policy Assistant — **work-package definition** | **PROPOSED — not authorized.** Folds in all fourteen rulings and MSG-0058 F1–F4; thirteen gates, ten tasks, **seven decisions still open** (§11). Allocates no work-package number, creates no ADR, marks no task READY | TASK-0022, MSG-0059 |

> **The EPA-0003 row above previously read "three reconciliation findings open (MSG-0057)".** That was
> true when written and stopped being true the same day, when MSG-0058 ruled all four. Corrected by
> TASK-0022 (MSG-0061 §4) — a fourth instance of the index-lags-its-records failure that TASK-0013,
> TASK-0014 and TASK-0015 each corrected in a different index.

Read EPA-0001 → EPA-0002 → EPA-0003 → EPA-0004. **EPA-0004 is the current one**: EPA-0002 was written
before any decision was ruled and is retained unchanged as the pre-ruling proposal, so where the two
differ, EPA-0004 is the later record and its §12 states why. The decisions in EPA-0003 are all
answered; what remains open is the seven items in EPA-0004 §11 and the lead's acceptance of these
records, without which no implementation task can be authorized.
