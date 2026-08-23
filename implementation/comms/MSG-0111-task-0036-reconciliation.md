# MSG-0111 — TASK-0036 Reconciled: Encode Q4/Q5/Q6 as Strict Shape-1 Clearance Gates

**Status:** **OPEN** — informational; one subtlety surfaced for the Lead, blocking nothing
**Raised:** 2026-08-23
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0110 | **Related:** MSG-0109, MSG-0105, ADR-0020 §1 and §3.2, EPA-0006 §4.4

---

## 1. What was reconciled

**TASK-0036 is the single READY task**, authorized by MSG-0110 §6: encode **Q4**, **Q5** and **Q6** as
explicit, testable strict Shape-1 clearance requirements in the EPA-0006 evidence/probe specification.
The id was allocated here and verified unused.

## 2. All three rulings are fail-closed, and the task must keep them that way

**Q4** — routing is **computed from the requesting subject's own entitlements**, never discovered by
enumerating a catalogue whose identifiers or metadata encode other subjects' authorization attributes.
**Partition selection must not itself become an unauthorized examination step** — a point easy to miss,
since routing feels like it happens *before* retrieval rather than as part of it.

**Q5** — a temporally materialised structure is **NOT CLEARED unless both** conditions hold: bounded
re-materialisation **and** a demonstrated §3.2 kernel re-check. **Both, not either.** The task section
says so explicitly, because a specification that clears on one would silently restore the failure
TASK-0035 measured.

**Q6** — **construction alone cannot satisfy E3.** Documentation of an intended boundary is not
execution evidence of an engine's actual traversal boundary. Until such evidence exists the candidate
stays **NOT CLEARED**.

**The TASK-0035 evidence is what makes Q5 decisive**, and it is worth restating why: once the
materialisation went stale, the design did not merely examine unauthorized rows — it **returned 5 of 5**
of them. That is a leaking failure, not a conservative one, and it is why "bounded" is a clearance
prerequisite rather than a quality attribute.

## 3. Both anchors MSG-0110 relies on were verified to exist

MSG-0110 §3 says *"the existing ADR-0020 threshold remains authoritative"* and points at the accepted
ADR rather than inventing anything. **Checked before queueing the task, rather than assumed:**

- **ADR-0020 §1** — *"a stale index beyond threshold triggers abstention (A7), never a stale answer"*.
- **ADR-0020 §3.2** — post-retrieval re-check, *"every hit is re-authorized against its version's
  classification…"*.

**Both are present in the accepted, promoted copy.** The task is told to reference them and **not to
restate them numerically.**

## 4. One subtlety surfaced, deliberately not decided

**ADR-0020 §1 names a *threshold*; this task is not authorized to fix its value**, and MSG-0110 §3
forbids inventing one.

**So if no numeric bound is fixed anywhere in the accepted set, "bounded" can be tested structurally —
that a bound exists, is enforced, and triggers abstention — but it cannot be tested numerically.** Those
are materially different gates: the first asks whether the mechanism is present, the second whether the
window is short enough.

**The task is instructed to say which of the two the gate actually tests**, and, if a numeric value is
genuinely absent, **to record it as a question for the Lead rather than choosing one.** Choosing one
would invent exactly the tolerance MSG-0110 §3 refuses to create.

**This blocks nothing.** A structural gate is still a real gate, and it is strictly better than the
construction-only evidence Q6 rejects.

## 5. Boundaries

**Nothing is cleared by this task and no verdict may change** — TASK-0035's nine MSG-0104 verdicts
stand, and SQLite/class-R configurations remain **NOT CLEARED**. **No engine, runtime, provider, model,
index technology or physical implementation is selected.** **No accepted ADR is modified**, ADR-0019
included — this updates *instruments*, not policy. **No implementation task may be marked READY**, and
MSG-0110 §6 grants no implementation or engine-selection authority.

## 6. State

- **TASK-0036 is READY and is the single READY task.** Not started at the time of writing.
- **TASK-0035 is COMPLETE**; its staleness evidence is what Q5 now encodes as a prerequisite.
- The scheduler is **enabled**, so a supervisor cycle can take TASK-0036 without a manual trigger.
- No blocker open. No implementation task authorized or READY.
