# DISC-0010 — The Two Work-Package Registers Disagree About What WP-0001 Is

**Status:** **RESOLVED** 2026-08-21 by TASK-0023 under MSG-0062 §7.1 — see *Resolution* at the end of this record.

> **The line this replaces, retained:** "**RECORDED — no action taken, and none is proposed.** Reported
> to the architecture lead in MSG-0055 §7.1." That was accurate from 2026-08-21 until the moment this
> record itself named as decisive — *"the finding matters at the moment a second work package is
> created"* — actually arrived, later the same day. The body below is the discovery **exactly as
> written**; nothing in it has been amended.
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

---

## Resolution — 2026-08-21, TASK-0023

**The trigger this record predicted arrived the same day it was written.** MSG-0062 §7.1 ruled that the
employee policy assistant is allocated as a **new** work package, "no existing WP number is repurposed",
with the identifier "allocated by the governing work-package register reconciliation". MSG-0063
authorized TASK-0023 to perform that reconciliation, with acceptance criterion 2 requiring it be done
**"without repurposing historical WP-0001."**

**Outcome: option 3** — both registers retained, with an allocation rule added. Not by this session's
preference: options 1 and 2 (mark the planning list superseded, or renumber it to match reality) both
require deciding what the forward plan *is*, and this record's own reasoning — *"that is a judgment
about program structure, not documentary drift"* — is the reason a reconciliation task may not make
that call either. Option 3 is the one that fixes the collision hazard without deciding the plan.

**What was done:**

- **`docs/program/work-packages.md` §0** now states plainly that the planning list and
  `docs/program/work-packages/` are different registers, that MSG-0005 makes the directory canonical,
  and that the two disagree about WP-0001 — with the delivered record winning.
- **An allocation rule is recorded**: a new work package takes the next number unused in **either**
  register, and its record is created in the canonical directory. Numbers spoken for by the planning
  list are not reused even where no delivered record exists. This mirrors MSG-0035 decision 2 for
  messages and supplies the convention this record noted was missing.
- **WP-0009 — Employee Policy Assistant** was allocated on that rule. `grep` verified WP-0009 and
  WP-0010 appeared nowhere in the repository beforehand.
- **Nothing was renumbered, renamed, or deleted.** Historical WP-0001 and all eight planning entries
  are intact. The two warnings this record left for a future session — do not infer identity from the
  planning list, and do not allocate without a ruling — are carried into `work-packages.md` §0 itself,
  where the next reader will actually encounter them.

**One part is deliberately still open, and it is not a defect.** Which planning entries WP-0009
satisfies, supersedes, or sits beside — the register's WP-0003/0004/0005 are the near misses EPA-0004
§1.1 identified — remains the Architecture Lead's program-structure judgment. MSG-0062 §7.1 settles the
*number*, not the *plan*. It blocks nothing, and the four options above stay on the table for it.

**Evidence:** MSG-0066 (TASK-0023 execution record) · `docs/program/work-packages.md` §0 ·
`docs/program/work-packages/WP-0009-employee-policy-assistant.md` §1.
