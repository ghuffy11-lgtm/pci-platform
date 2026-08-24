# MSG-0148 — R2 Reconciled: A New Evidence Obligation Exists, and No Task Is Authorized to Meet It

**Status:** **OPEN** — reconciliation record, with **one decision offered** (§4)
**Raised:** 2026-08-25
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Decision reconciliation
**Authority:** MSG-0147 | **Related:** MSG-0146 §8 (R1, R2), EPA-0006 §4.6 S6, §9.3, ADR-0020 §6.2

---

## 1. What was ruled

**R2 = YES.** Unauthorized policy content in an **engine-managed durability artefact** — a WAL, a
journal, a shared-memory file — is **an architectural security concern in its own right** and **must be
investigated as a separate security requirement**.

**And the ruling is careful about what it does not do:** the WAL finding is **not** reclassified as E4.
**E4 stays exactly what it was** — the execution-observability criterion — and **the new concern is a
separate boundary about persistence.** That distinction was the whole reason MSG-0146 recorded the WAL
result and **refused to offer it as E4**; the ruling preserves the separation rather than collapsing it.

**Consequence 1 is the load-bearing sentence:** unauthorized policy content **must not be accepted as
harmless merely because it appears in a durability artefact rather than an execution log.**

## 2. What this changes, and what it does not

**No gate moves. No verdict moves. No engine is selected.** MSG-0147 §5: Shape-1, E2, E4, freshness and
every other clearance gate are **unchanged**, and §2: the requirement **"does not by itself clear or
fail any retrieval engine."**

**All six TASK-0042 candidates remain NOT CLEARED. Seven probes have cleared nothing.**

**What it creates is an obligation with nowhere yet to live.** MSG-0147 §3 says future evidence must
establish **whether a candidate's engine-managed durability artefacts can contain unauthorized policy
content, and if so whether the architecture prevents that exposure.** **No criterion in EPA-0006
currently asks that question** — §4.6's E1–E4 do not reach persistence artefacts, and §9.3 concerns
logs.

## 3. No task is READY, and none is authorized

**MSG-0147 §6 is conditional in terms:** *"The next bounded evidence task, **if authorized**, should
define a reproducible WAL/durability-artifact exposure test rather than broaden engine evaluation."*

**That is guidance for a task that does not exist yet, not an authorization to create one.** **The queue
therefore stays empty**, and the supervisor's `NOOP` remains correct. **This session did not mark
anything READY**, and would not have the authority to.

## 4. The choice offered — two shapes, and they are not interchangeable

**Offered, not requested, and neither is urgent:**

**(a) Encode the requirement first.** Add the durability-artefact criterion to EPA-0006 §4.6 as a
gate — the mechanism TASK-0034, TASK-0036 and TASK-0040 used for earlier rulings, **additive and
declared**. **Evidence gathered before a criterion exists tends to get measured against the probe's own
idea of the bar**, which is what §4.6 S7 was written to stop.

**(b) Define the exposure test first**, as §6 suggests, and encode afterwards from what the test turns
out to be able to observe. **This has the advantage that the criterion is then known to be testable** —
E4's history is the cautionary case, where the criterion existed and the first subject could not
instrument it at all.

**A third option is doing both in one task, and I recommend against it**: the same session would be
writing the bar and the measurement together, which is precisely the arrangement §4.6 S5's
counters-prove-failure-never-success rule exists to distrust.

**R1 from MSG-0146 §8 is still open** — whether TASK-0043's result becomes **EPA-0006 §4.15**. It
blocks nothing, and **the record is complete either way**.

## 5. State

- **No task is READY and none is authorized.** MSG-0147 authorizes no work.
- **R2 is DECIDED; R1 is open.**
- **E4 is OBTAINABLE on the second subject** (Python 3.14.5 / SQLite 3.50.4) **and NOT OBTAINABLE on the
  first**; **GAP-B stands.**
- **Nothing CLEARED — seven probes.** **All six TASK-0042 candidates remain NOT CLEARED.**
- **No blocker open.** BLK-0011 is RESOLVED, and **its unattended condition still holds** — the runner's
  permission set was not broadened.
- **Two discoveries open: DISC-0011, DISC-0012.** Neither moves a verdict.
- **MSG-0060's observation about colliding task specifications remains unanswered.**
