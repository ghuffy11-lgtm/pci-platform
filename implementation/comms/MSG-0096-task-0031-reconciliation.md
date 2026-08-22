# MSG-0096 — TASK-0031 Reconciled: Apply ADR-0020 AMD-01 In Place

**Status:** **OPEN** — informational; no decision blocks TASK-0031
**Raised:** 2026-08-23
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0095 | **Related:** ADR-0020, ADR-0020 AMD-01, MSG-0092, TASK-0030

---

## 1. What MSG-0095 decided

**AMD-01 is ACCEPTED as drafted, with the optional traceability row included** — so **both hunks**,
not hunk 1 alone.

It is to be **applied in place** to the accepted ADR-0020, with a **concise header note identifying
AMD-01 and MSG-0095**, and **no superseding ADR**. That settles the one question AMD-01 §8 left open
as **option (a)** — the convention this repository had no precedent for.

**MSG-0095 also confirmed the draft's central reading:** ADR-0020 §3.1 already required the candidate
set to be built already constrained, and §4 already made retrieve-then-filter a gate failure, but the
accepted text **did not say** that an engine incapable of constraining inside the retrieval operation
is itself disqualified, nor that **G3 must inspect the query issued to the engine** rather than only
the response returned. Those were the two gaps.

**On the one phrase the draft flagged for possible removal** — "over-fetch-then-filter" — MSG-0095
ruled it **consistent with MSG-0092 §1(1)**, which states it verbatim and is already settled
authority. It stays. The draft was right to surface it rather than bury it, and right not to decide it.

## 2. TASK-0031 — three edits and nothing else

**Reconciled as the single READY task**; the id was allocated here, verified unused, since MSG-0095
assigns none.

1. **Hunk 1** at the end of ADR-0020 **§4**, immediately after *"An exclusion cannot fail open; a
   filter can."* — nothing existing deleted or reworded.
2. **Hunk 2** as one appended **Traceability** row.
3. **A concise header amendment note** naming AMD-01 and MSG-0095.

**The wording is to be taken verbatim from AMD-01, not retyped.** Transcription drift inside an
accepted ADR is precisely the failure this task must not introduce, and paraphrase is how it would
happen.

## 3. The boundary, stated because this task is unusual

**TASK-0031 edits an accepted, promoted ADR.** Every prior task in this work package was forbidden from
doing that — TASK-0030 in particular was told to draft and stop, and did.

**That prohibition has not been relaxed generally.** MSG-0095 §3 authorizes *"acceptance/application of
AMD-01 only"*. `docs/decisions/` may change in exactly one file, in exactly the three places above.
The queue section states the verification that proves it: `git diff --name-only docs/decisions/` must
name **ADR-0020 and nothing else**.

**ADR-0019 is explicitly out of scope**, along with its Arabic production-evidence gate — MSG-0095 §4
names it first among the boundaries preserved. The n=1 scoping from MSG-0091 is untouched.

## 4. One hazard the recovery procedure names

**Re-running this task against an already-amended ADR would insert hunk 1 twice.** A duplicated clause
in an accepted ADR is materially worse than a missing one: it invites two readings of a rule whose
whole purpose is to remove ambiguity.

So the recovery procedure requires checking whether the amendment is already applied **before**
applying it, and `CLAUDE.md` recovery rule (f) applies with full force — never repeat an operation
merely because a record says it was incomplete.

## 5. Execution path

MSG-0095 §5 permits reconciliation and execution under the ruling. **The scheduled task
`PCI-Execution-Supervisor` remains Disabled**, so no unattended cycle will take TASK-0031; the
supervisor path stays available by manual trigger, as used for TASK-0021, TASK-0022 and TASK-0030,
where the supervisor still made the selection and held the lock.

**Re-enabling the schedule is an operator action and was not taken.**

## 6. State

- **TASK-0031 is READY and is the single READY task.** Not started at the time of writing.
- **`docs/decisions/` is currently unmodified**; ADR-0020 still stands as accepted and unamended.
- **AMD-01 remains PROPOSED** until the applying task updates it to APPLIED with the commit reference.
- No blocker open. No implementation task authorized or READY.
