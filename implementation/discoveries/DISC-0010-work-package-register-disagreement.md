# DISC-0010 — The Two Work-Package Registers Disagree About What WP-0001 Is

**Status:** **RECORDED — no action taken, and none is proposed.** Reported to the architecture lead in MSG-0055 §7.1.
**Raised:** 2026-08-21 (during TASK-0021, while considering an identifier for the proposed work package)
**Severity:** Low today; rises the moment a second work package is allocated a number
**Related:** MSG-0055, `EPA-0002` §0, TASK-0021

## Discovery

PCI keeps work-package identity in two places, and they do not agree.

**`docs/program/work-packages.md`** (`PLAN-WP-0001`, `Status: Active`) is a planning list of eight
work packages:

```text
WP-0001 — Knowledge Foundation
WP-0002 — Repository and Engineering Platform
WP-0003 — Platform Runtime Foundation
WP-0004 — Knowledge Service
WP-0005 — AI Runtime Abstraction
WP-0006 — Agent Execution Foundation
WP-0007 — Network Operations Capability
WP-0008 — Customer Zero Integration
```

**`docs/program/work-packages/`** is the directory of actual work packages, and contains exactly one:

```text
WP-0001-kernel-foundation.md   ->   "WP-0001 — PCI Kernel Foundation", Status: COMPLETE
```

The delivered WP-0001 is **"PCI Kernel Foundation"**. The planning register's WP-0001 is **"Knowledge
Foundation"**, whose stated exit is "model reviewed, examples validated, storage-independent
semantics documented" — a modelling exercise, not the transactional kernel that was actually built,
verified on real infrastructure, and declared COMPLETE in MSG-0022 / MSG-0023.

MSG-0005 designated `docs/program/work-packages/` canonical, so the delivered record wins on
authority. The planning list was never reconciled to it.

## Why it was noticed now

TASK-0021 proposed a work package for the employee policy assistant and needed an identifier. The
obvious choice, WP-0002, is **already taken** in the planning register by "Repository and Engineering
Platform". Allocating it would have produced a duplicate-numbered work package — the same failure
mode as the MSG-0020 (a)/(b), MSG-0033 (a)/(b), MSG-0039 (a)/(b) and MSG-0046 (a)/(b) message
collisions, but in a register that has no numbering convention at all.

**`EPA-0002` therefore allocates no number** and refers to "the assistant work package" throughout.
Allocation is the architecture lead's.

## Why this is a discovery and not a blocker

Nothing is prevented. TASK-0021 was a definition task and completed without needing an identifier,
and no work package is authorized anyway (MSG-0053 C7, MSG-0054). The finding matters at the moment a
second work package is *created*, which has not happened.

It is also **not** a correction TASK-0021 was entitled to make. Reconciling the two registers means
choosing whether the planning list is superseded history, a still-valid forward plan whose numbering
happens to be stale, or something to be renumbered — and that is a judgment about program structure,
not documentary drift with a single obvious correct value. TASK-0021's stop condition covers exactly
this: resolving it would require choosing between competing substantive interpretations.

## What a future session should know

- **Do not infer work-package identity from `docs/program/work-packages.md`.** It is a plan, and its
  numbering has not tracked what was delivered.
- **Do not allocate a work-package number without a ruling from the architecture lead.** There is no
  allocation convention for work packages, unlike messages (MSG-0035 decision 2).
- This is the same pattern TASK-0019's audit found six times — a record updated in its own file while
  the index that points at it is not — seen a **seventh** time, in a register the audit did not cover.
  The audit examined the queue, ROADMAP, status, COMMS, blockers, discoveries, checkpoints, ADRs and
  the work-package *file*; it did not examine the work-package *list*.

## Options, if the lead wants it closed

1. **Mark `docs/program/work-packages.md` as superseded planning history**, and treat
   `docs/program/work-packages/` as the sole register. Cheapest; loses the forward plan.
2. **Reconcile the list to reality** — WP-0001 renamed to match the delivered work package, later
   entries renumbered or restated as a backlog without fixed numbers.
3. **Leave both and add an allocation rule** stating which register allocates numbers, mirroring the
   MSG-0035 convention for messages.
4. **No action.** It costs nothing until a second work package is created.

**No option is recommended and no ruling is requested.** The trade is about program structure, which
is the lead's to make.
