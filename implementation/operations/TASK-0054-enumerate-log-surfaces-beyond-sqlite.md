# TASK-0054 — is there ANY obtainable engine that supplies an accumulating, readable statement log?

**Authority:** Architecture Lead, 2026-08-26 (MSG-0180). Basis: **EPA-0006 §4.13 GAP-B** (undischarged);
**§4.20 `AB-1`**; **MSG-0168 §5** (C1 = NO on every surface measured); **MSG-0179 §3**.
**Type:** Bounded enumeration / survey. **Not a measurement of a candidate, and not a selection.**
**Status:** READY.

## Why this task exists — the gap nobody has named

**Every test subject in this programme has been SQLite.** §4.12/§4.14 used SQLite via `node:sqlite`;
§4.15 used SQLite via Python's `sqlite3`; TASK-0050 enumerated a third and found `node:sqlite` is the
only database the runtime supplies without an install. **Twelve probes, one engine family.**

**GAP-B is undischarged because no subject supplies a LOG** — an accumulating, readable record of the
statements the engine actually executed. **The Lead has now checked what it would take to get one out
of SQLite, and the answer is recorded here so the task does not repeat it:**

```text
node v22.22.2 / SQLite 3.51.2, 49 compile options:
  ENABLE_STMTVTAB        ABSENT     <- the flag that provides sqlite_stmt
  ENABLE_SQLLOG          ABSENT
  DEBUG                  ABSENT
  ENABLE_STMT_SCANSTATUS ABSENT
  ENABLE_NORMALIZE       ABSENT
  sqlite_stmt table:     ABSENT ("no such table: sqlite_stmt")
```

**Two facts follow, and the second is why this task is a survey rather than an install request:**

1. **Getting `sqlite_stmt` is a COMPILE, not a download.** No stock distribution enables
   `SQLITE_ENABLE_STMTVTAB`. It means building SQLite from source with a non-default flag.
2. **Even then it may not qualify.** `sqlite_stmt` lists **currently prepared** statements. A statement
   that has been finalized is gone. **That is a live registry, not a history** — and §4.15's C1 asks for
   a log. **Paying a compile for something that probably fails C1 anyway is the wrong first move.**

**So the prior question is the one never asked: does ANY obtainable engine supply such a surface?**

## Objective

**Enumerate, with evidence, whether any engine or binding obtainable without a source build supplies a
surface that is BOTH (a) accumulating across statements and readable back, AND (b) available in a form
whose statement text does not carry inlined content.** Report the answer per candidate surface.

## Required outcomes

1. **Enumerate what is reachable, and how you established the list** — runtime built-ins, packages
   already present, and packages installable from the default registry **without a source build**.
   **Name what you checked and what returned nothing.** An absence is admissible only by enumeration.
2. **For each reachable engine/binding, determine and record:** does it expose a statement-level
   observability surface at all; **does that surface ACCUMULATE across statements**; **can it be READ
   BACK**; and does it expose statement text in a form that does not inline bound values.
3. **Apply §4.15's C1–C4 to every surface found**, in the same table form MSG-0168 §5 used, so the
   results are directly comparable to the SQLite evidence.
4. **Where installing something would be required, STOP and record a BLOCKER** with the five items
   MSG-0173b §1 requires — artefact and version, why it is needed, the exact step, **what it would
   prove, and what it would still NOT prove.** **Do not install anything.**
5. **A finding that NOTHING reachable qualifies is a complete and valid outcome**, and is the most
   likely one. **Report it as a finding, not as a failure of the task.**
6. **Record whether the SQLite compile route is worth pursuing**, given fact 2 above — specifically,
   whether `sqlite_stmt`'s live-registry semantics could satisfy C1 at all. **Refer that as a question
   if the evidence does not settle it; do not rule it.**
7. **COMMS, status, queue row and checkpoint recorded**, verified from `origin/main`.

## Constraints

- **NO INSTALLS. NO SOURCE BUILDS. NO HOST CHANGES.** Every one of those is a blocker to record.
- **This is a SURVEY of instruments, not an evaluation of products.** MSG-0141 holds: **a test subject
  is an evidence instrument, not a candidate.** Naming an engine here **selects nothing**, and **no
  engine may be described as preferred, suitable, recommended or ranked.**
- **No generalization beyond what is measured** (§4.6 S10).
- **No change to E1–E4, S1–S11, DA-1…DA-7, N1–N6, EV1–EV13, AB-1, G-Q4…G-Q7.8, strict Shape-1 or any
  gate.** **E4 is not weakened to let a surface qualify** (MSG-0119).
- **No candidate verdict changes.** All six §4.14 candidates remain NOT CLEARED; twelve probes have
  cleared nothing.
- **Do not claim GAP-B is discharged or closer to discharge.** Finding a surface would still require a
  separate authorized measurement against it.
- **Never run a destructive command.** If one is refused, stop and record what was refused.
- Stop if `origin/main` moves mid-run.

## Numbering

Use **MSG-0181 or later**. Check `implementation/comms/README.md` — **eleven numbers are already
doubly claimed.**
