# MSG-0077 — TASK-0026 Reconciled; A-SURVEY's Corpus Prerequisite Is Not Met

**Status:** **OPEN** — one organizational action needed before A-SURVEY can run; A-STACK is unblocked
**Raised:** 2026-08-22
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record + prerequisite report
**Authority:** MSG-0076 | **Related:** MSG-0062 §7.5, MSG-0061 §7.5, WP-0009 §6.1/§6.2, EPA-0004 §11.5

## What was done

MSG-0076 is reconciled into the queue as **TASK-0026**, the single READY task, with a board row, a full
task section, and ledger rows. MSG-0076 assigns no task number, so **TASK-0026 was allocated here** as
the next unused id, verified free across the repository.

**No corpus was surveyed and no stack was evaluated.** That is TASK-0026's work.

## The prerequisite that is not met

MSG-0076 asks A-SURVEY to inspect "representative approved policy material" and record formats,
language mix, scanned-document prevalence, classification/audience patterns, and version/supersession
characteristics.

**No such corpus is reachable from this repository.** Established by inspection rather than inferred:

```text
$ find . -iname "*.pdf" -o -iname "*.docx" -o -iname "*policy*"   (excluding .md and .git)
  ./services/kernel/src/adapters/policy/static-policy-engine.ts
  ./services/kernel/src/ports/policy.ts
  ./services/kernel/test/unit/policy.test.ts
```

Kernel source files named `policy`. No policy documents of any kind.

**Three authoritative records already say so, and have from the beginning:**

| Record | What it says |
|---|---|
| **WP-0009 §6.1** | "PR5 (the corpus) is the **organization's**" prerequisite |
| **EPA-0004 §11.5, PR5** | "A real approved policy corpus … **UNKNOWN — not visible from the repository** — Organization" |
| **MSG-0061 §7.5** | "**No survey was performed or scheduled.**" |

MSG-0062 §7.5 authorized the survey and MSG-0076 now authorizes the task; **neither supplies the
material**, and neither could — that is an organizational action, not an architectural one.

## Why this is written at length in the queue rather than noted in passing

**A survey with no corpus is the most inviting place in this work package to produce confident,
plausible, invented findings.** The requested outputs are exactly the shape a model can generate
without data: a format breakdown, a language split, a percentage of scanned documents.

And they would not stay harmless. Those figures feed **D6** (Arabic normalization, to be determined
empirically), **D14** (scanned documents rejected rather than OCR'd), and **ADR-0019**, which is
accepted specifically on the condition that its normalization rules come from *empirical corpus
evidence*. **Fabricated survey data would corrupt accepted architecture** — and it would be traceable
to nothing, because there would be no corpus to check it against.

The task section therefore instructs, in order: establish by inspection whether a corpus is reachable;
if not, **stop A-SURVEY and record it**, producing no figures "not as estimates, not as illustrations,
not as expected values"; **do not substitute a method or plan** for the authorized output, since a
method document is easy to mistake later for a completed survey; complete A-STACK, which has no such
dependency; and **report the task PARTIAL**, naming acceptance criterion 1 as unmet and PR5 as the
reason.

**The instruction to re-check by inspection matters as much as the warning.** If the operator supplies
material after this was written, the correct answer changes — and a runner that trusted this text
instead of looking would then wrongly refuse to survey a corpus that exists.

## A-STACK is unblocked, and that is most of the task

Every input A-STACK needs is present and was checked:

```text
docs/architecture/technology-selection-principles.md    present
docs/decisions/ADR-0017 … ADR-0022                      all six present, accepted
docs/program/work-packages/WP-0009-…                    present
```

It evaluates candidate stacks against the accepted contracts and the ADR set, and either recommends
with evidence or records why selection stays open. **MSG-0062 §7.7 governs it: ADR-0015 is not
inherited**, so the kernel stack must not be adopted by default and called inheritance.

Some of A-STACK's evidence gaps will point back at the missing corpus — sizing, embedding behaviour on
real Arabic text. **Saying so is a legitimate result**, not a failure to conclude.

## What the operator needs to decide

**One action, and it is the organization's:** make representative approved policy material available
for a read-only survey, or rule that A-SURVEY is deferred until the corpus exists.

If material is supplied, note that MSG-0076's own constraint still binds: **no production content
ingestion and no bypassing of approval controls.** A survey reads; it does not ingest.

Nothing else is blocked. A-STACK proceeds either way.

## State

- **TASK-0026 is READY and is the single READY task.** Not started at the time of writing.
- **A-SURVEY: prerequisite PR5 UNMET.** A-STACK: unblocked.
- MSG-0076 is registered in the COMMS register and the queue ledger.
- **No accepted ADR was touched.** No implementation task is READY; T-A, T-B, T-D, T-E and T-0 remain
  unauthorized.
- No OPEN blocker. This is a prerequisite report, not a blocker: nothing is broken, and the missing
  input was always recorded as the organization's to provide.
