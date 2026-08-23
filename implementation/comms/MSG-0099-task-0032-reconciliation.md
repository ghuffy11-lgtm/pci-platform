# MSG-0099 — TASK-0032 Reconciled: Bounded A-STACK Technology Evaluation

**Status:** **OPEN** — informational; no decision blocks TASK-0032
**Raised:** 2026-08-23
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0098 | **Related:** EPA-0005, MSG-0092, ADR-0020 AMD-01, TASK-0026, TASK-0031

---

## 1. What was reconciled

**TASK-0032 is the single READY task**, authorized by MSG-0098: a bounded **technology evaluation and
implementation planning** exercise that **selects nothing**. The id was allocated here and verified
unused; MSG-0098 names TASK-0032 but assigns no queue row.

## 2. This is not a re-run of TASK-0026 — and the label says otherwise

**Both tasks are called "A-STACK".** WP-0009 §6.2 lists A-STACK once, and that row already reads
**EXECUTED as TASK-0026**. A reader coming to the record cold could reasonably conclude the same task
was run twice.

**They are different exercises:**

| | TASK-0026 (A-STACK) | TASK-0032 (A-STACK) |
|---|---|---|
| Question | Stack **shape** — Approaches A / B / C | **Technology classes** within the chosen shape |
| Against what | The ADR set as it stood on 2026-08-22 | **Approach C as settled**, and **ADR-0020 as amended by AMD-01** |
| Outcome | `EPA-0005`, selecting nothing | A recommendation **or** selection explicitly left open |

**Neither of the two things this task evaluates against existed when EPA-0005 was written.** Approach C
was chosen by MSG-0092 *after* EPA-0005 was delivered, and AMD-01's disqualification criterion was
accepted only yesterday and applied by TASK-0031.

**The task is therefore instructed to distinguish the WP-0009 rows rather than overwrite the existing
one.** Recorded here so the distinction survives in the register too, not only in the work package.

## 3. What AMD-01 changes about this evaluation

**The pre-constrained retrieval requirement is now a testable disqualifier**, which is precisely why
this evaluation is worth doing now rather than before.

ADR-0020 as amended states that an engine which can only match or rank first and exclude afterwards —
**including over-fetching a wider candidate set and discarding the surplus, at any layer** — does not
satisfy §3.1 and is **disqualified**, and that **G3 is evidenced against the query issued to the
engine, not the response returned**.

**That is an engine-selection criterion with teeth**, and the task is required to apply it to each
candidate class with reasoning, not assertion. An evaluation that lists engines without testing them
against it would miss the point of the amendment it was authorized after.

## 4. The likeliest way this task goes wrong

**A technology comparison invites numbers**: throughput, latency, memory footprint, recall. **None has
been measured in this project.**

- **PR4** (a local inference runtime on the authorized host) and **PR6** (host capacity) are recorded
  **UNKNOWN**.
- **No corpus-scale survey exists** — A-SURVEY has run at n=1, three times, on three producers.
- **No benchmark of any kind has been run.**

MSG-0098 §5 says it directly: *"Record missing evidence explicitly; do not invent benchmarks, capacity
figures, or corpus-scale findings."* The queue section extends that with the specific forms the
temptation takes — **an estimate, a typical value, a vendor claim presented as fact, or a range** — and
requires vendor claims to be cited *as claims*.

**This is the same discipline the A-SURVEY tasks held under more pressure**, when asked for a corpus
survey with no corpus and correctly refusing to invent one.

## 5. Boundaries

**A recommendation is permitted; an adoption is not.** MSG-0098 is explicit that no retrieval engine,
vector store, model, serving runtime, application runtime, framework, or provider is selected by the
authorization — and none may be selected by the task.

**No accepted ADR may change**, including the freshly amended ADR-0020. **ADR-0019 stays untouched**,
and the MSG-0091 scoping holds: Arabic n=1 is sufficient for bounded architecture testing and **is not
production corpus evidence**.

**Stop conditions are carried verbatim in substance**: stop if an accepted ADR would need changing, if
production technology would need selecting, if product implementation would be required, or if new
corpus or provider authorization would be needed.

## 6. Execution path

MSG-0098 authorizes execution *"through the normal COMMS/supervisor path"* and states **no second task
may be READY concurrently** — satisfied: TASK-0032 is the only one.

**The scheduled task `PCI-Execution-Supervisor` remains Disabled**, so no unattended cycle will take it;
the supervisor path is available by manual trigger, as used for TASK-0021, TASK-0022, TASK-0030 and
TASK-0031, where the supervisor still made the selection and held the lock.

## 7. State

- **TASK-0032 is READY and is the single READY task.** Not started at the time of writing.
- **TASK-0031 is COMPLETE**: AMD-01 is **APPLIED IN PLACE**, verified — only ADR-0020 changed in
  `docs/decisions/`, hunk 1 appears exactly once, and the header carries the amendment note.
- No blocker open. No implementation task authorized or READY.
