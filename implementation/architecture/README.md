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
| EPA-0005 | Employee Policy Assistant — **service stack evaluation (A-STACK)** | **ACCEPTED 2026-08-22 by MSG-0092** as the architecture evaluation record **and** the ruling record for the runtime seam — **Approach C chosen**, §9.1's three constraints settled, **no generic stack ADR to be created**. **Not promoted to `docs/`** (promotion is the Lead's act), and **it still selects no provider, framework, model, engine or runtime**. Evaluates candidate stack **shapes** (Approaches A/B/C). **Seven questions are corpus-blocked** because A-SURVEY could not run | TASK-0026, MSG-0076; accepted MSG-0092 |
| EPA-0006 | Employee Policy Assistant — **technology evaluation and implementation planning (bounded A-STACK)** | **PROPOSED — and it selects nothing.** Evaluates candidate **technology classes** *within* the settled Approach C, and against **ADR-0020 as amended by AMD-01**. Applies the pre-constrained-retrieval criterion to seven engine classes with reasoned verdicts, derives the four-part predicate an engine must express in-query, and specifies a **three-tier conformance probe**. **Every product-level selection stays OPEN**; **no benchmark, capacity or corpus figure appears anywhere in it**. Creates and proposes **no ADR and no amendment** | TASK-0032, MSG-0098 |

> **The EPA-0003 row above previously read "three reconciliation findings open (MSG-0057)".** That was
> true when written and stopped being true the same day, when MSG-0058 ruled all four. Corrected by
> TASK-0022 (MSG-0061 §4) — a fourth instance of the index-lags-its-records failure that TASK-0013,
> TASK-0014 and TASK-0015 each corrected in a different index.

> **EPA-0005 added 2026-08-22 by TASK-0026 (A-STACK), under MSG-0076.** It is an *evaluation*, not a
> proposal of record: MSG-0076 permits "an evidence-based recommendation **or** an explicit record of
> why selection remains open", and EPA-0005 does the second for the stack and the first for three
> corpus-independent constraints. **Its companion half, A-SURVEY, did not run** — the approved policy
> corpus (PR5) is not reachable, re-verified by inspection during the task. **No corpus figures exist
> anywhere in this directory**, and none may be inferred from EPA-0005's presence. Execution record:
> **MSG-0078**.

> **EPA-0006 added 2026-08-23 by TASK-0032, under MSG-0098.** **It is not a second copy of EPA-0005, and
> the label is why that has to be said.** Both are called "A-STACK" in WP-0009 §6.2, where the row already
> reads EXECUTED. **They answer different questions**: EPA-0005 evaluated the stack **shape** (one runtime
> or two) against the ADR set as it stood on 2026-08-22; EPA-0006 evaluates **technology classes** within
> the **settled Approach C** and against **ADR-0020 as amended by AMD-01** — neither of which existed when
> EPA-0005 was written. Approach C was chosen by MSG-0092 *after* EPA-0005 was delivered, and AMD-01 was
> applied on 2026-08-23 by TASK-0031. **EPA-0006 does not supersede, restate or contradict EPA-0005**; it
> extends it, and names the section each time it does. Execution record: **MSG-0100**.

> **The EPA-0005 row above previously read "PROPOSED — and it selects nothing".** That was true when
> written and stopped being true on 2026-08-22, when **MSG-0092 accepted it** and chose **Approach C**.
> Corrected by TASK-0032 — a fifth instance of the index-lags-its-records failure this README has already
> recorded once. **The "selects nothing" half was and remains accurate**: MSG-0092 §4 keeps every provider,
> framework, model, engine and runtime selection deliberately open, and the corrected row says so.

Read EPA-0001 → EPA-0002 → EPA-0003 → EPA-0004, then **EPA-0005** for the stack-shape evaluation and
**EPA-0006** for the technology evaluation within it.
**EPA-0004 remains the current work-package definition**; neither EPA-0005 nor EPA-0006 supersedes it, and
neither adds a gate, task, or authorization. EPA-0002 was written
before any decision was ruled and is retained unchanged as the pre-ruling proposal, so where the two
differ, EPA-0004 is the later record and its §12 states why. The decisions in EPA-0003 are all
answered; what remains open is the seven items in EPA-0004 §11 and the lead's acceptance of these
records, without which no implementation task can be authorized.
