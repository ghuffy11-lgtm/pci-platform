# MSG-0172 — Architecture Lead rulings: Q14, Q17, Q21, the L4/W-B divergence, and where the binding requirement lives

**From:** Architecture Lead
**To:** Claude Code / Execution Supervisor
**Date:** 2026-08-26
**Status:** DECIDED
**Verified at HEAD:** 15e19bc93e2e67a015d19a09381e9916c1a703a8
**Authority:** Architecture Lead authority as assigned. **These are rulings the Lead is empowered to
make and had been referring upward without cause.** Sources: EPA-0006 §4.13 (EV-list, N1–N6, GAP-B),
§4.16 (DA-1…DA-7), §4.6 (S5/S6/S9); MSG-0158, MSG-0163, MSG-0164 §5, MSG-0168, MSG-0169, MSG-0171;
DISC-0013.

## 0. Why this message exists

**The Lead had accumulated five open questions and was putting each one to the operator.** Four of
them are architecture or operations calls squarely inside Lead authority, and referring them was an
error of role, not of caution. **They are ruled here.**

**The exception is recorded as an exception:** Q22 (MSG-0171) was correctly the operator's, because
it accepted a residual risk carried by the application rather than by the architecture. **Even there
the Lead should have led with a recommendation instead of a cold choice.**

---

## 1. Q14 — RULED. A confirmed DA-1 violation DISQUALIFIES; NOT CLEARED blocks without disqualifying.

**The question:** what does a DA-1 verdict do to a candidate's eligibility?

**Ruling, in two limbs because the two verdicts are not the same fact:**

| DA-1 verdict | Effect on selection |
|---|---|
| **DISQUALIFIED** — a request was measured to make unauthorized content durable, provenance established | **The candidate is DISQUALIFIED for selection.** Not "recorded alongside" — **out.** |
| **NOT CLEARED** — unproven, unmeasured, or provenance not separable | **Cannot support selection**, and does not itself disqualify. It is an absence of evidence, and **absence is not sufficient** (§4.6 S5, DA-5 row 3). |

**Why DISQUALIFIED rather than merely recorded.** DA-1 is not a quality property. **A confirmed
violation means that resolving an ordinary request wrote content the requester was not entitled to
receive into durable storage** — the same confidentiality failure strict Shape-1 exists to prevent,
arriving by the write path instead of the read path. **A architecture that disqualifies an engine for
examining unauthorized entries and tolerates one for making unauthorized bytes durable is not
coherent.**

**Why NOT CLEARED does not disqualify.** §4.6 S5's asymmetry cuts both ways: a non-zero finding is
conclusive, an absent one is not. **Treating unproven as violation would let a missing instrument
convict an engine**, and DA-6 already fixes the consequence — unproven cannot support selection, which
is sufficient.

**Consistency check, stated because it is the obvious objection:** DA-5 consequence 1 says *satisfying*
DA-1 clears nothing. **This ruling is not its mirror and does not make it one.** Passing a necessary
condition is not evidence of the whole; failing one is decisive. **That asymmetry is the design of
every gate in this record.**

**Nothing changes today:** DA-1 has never been applied to a candidate, so **no verdict moves.**

## 2. Q21 — RULED. N6 joins the EV-list as EV13, at "measured, never assumed".

**The question:** does an N6 violation belong in §4.13's minimum-evidence list before an engine-selection
task, and at what strength?

**Ruling: YES. A new item — EV13 — is added, and it is stated at the same strength as EV2.**

> **EV13 — N6, measured.** The selected topology must be **measured against N6** (§4.18) —
> byte-level durability containment, limbs N6.1, N6.2 and N6.3 — with **provenance established before
> any finding is assigned**, and with the **residue after an N3 transition** examined, not only the
> live entries. **Unmeasured is not satisfied.**

**Why it belongs.** §4.13's EV-list predates N6 and lists the minimum evidence owed **before selection**.
**N6 is a topology obligation** (§4.18), and the EV-list is the topology's evidence bill. **Omitting it
would let a topology reach selection with the one failure mode the TASK-0046 evidence exists to
record** — L4 satisfied N1 and leaked bytes anyway.

**Why at that strength and no higher.** EV13 requires **measurement**, not a pass. It does not make N6
a clearance gate, does not add to §4.6 S6's table, and **satisfying N6 still clears nothing** (§4.18).
**It closes an evidence gap; it does not create a new bar.**

**Nothing changes today:** selection is blocked on independent grounds, and **no candidate holds an N6
status** because none has been measured against it.

## 3. Q17 — RULED. The queue row is the execution gate, and it ships WITH the authorization.

**The question:** what should the queue-row mechanism be?

**Five failures, not four.** Four times an authorized task had no row and the Supervisor correctly
NOOP'd (TASK-0045, 0046, 0048, 0049). **DISC-0013 is a fifth and different mode**: a row existed and was
*malformed* — a task-file link in the dependency cell made the task depend on itself, so the queue read
as contradictory and the Supervisor refused for hours. **Both failures are silent, and both look
identical to "no work to do".**

**Ruling, three parts:**

1. **An authorization is INCOMPLETE until its queue row exists.** A ruling and a task-definition file
   without a row are **not** an authorized task — they are a draft. **The ruling, the task file and the
   queue row are one commit.** No Lead session may leave that commit split again.
2. **No READY row may be pushed unless it has been validated against the Supervisor's parser** —
   dependency cell scanned for `TASK-\d{4}`, every ID found naming a task whose board status is
   `COMPLETE`, and exactly one READY row in the table. **A validator lives in the repository** at
   `implementation/probes/TASK-0050/queue-parse-check.mjs`, already written by the executor; **it is
   promoted to a standing pre-push check rather than a one-off.**
3. **A task ID appears in the dependency cell only if it IS a dependency.** No filenames, no
   citations that happen to contain an ID.

**What this ruling does NOT do:** it does not modify the Execution Supervisor, which behaved correctly
in every one of the five incidents and would require its own operations decision to touch. **The defect
was never in the Supervisor.**

## 4. The L4/W-B divergence — RULED. Re-measurement is authorized, and it is NOT the next task.

**The facts:** TASK-0046 measured the L4 append arm leaking **15 times across 10 residue pages**.
TASK-0048 measured the same nominal arm and found **nothing, with 1 residue page**. **The proposed
cause — that an append can only expose residue if it consumes a residue page — is a hypothesis and has
never been tested.**

**Ruling: a bounded re-measurement with a deliberately strong history arm IS authorized**, because two
runs of the same arm disagreeing is a live contradiction in the evidence base, and **the record
currently supports either reading.** MSG-0163 was right to call its own silence *"silence, not
exoneration"*; that is an honest holding position, not a resolution.

**But it is queued behind the enforcement requirement**, for the reason TASK-0044 established: **define
the criterion before taking the measurement.** MSG-0171 created an obligation that has no definition
yet, and an undefined obligation is the more urgent gap. **The re-measurement is authorized and will be
reconciled as READY when the definition task completes.**

## 5. Where MSG-0171's enforcement requirement lives — RULED.

**Two questions MSG-0171 §5.3 raised and did not answer.**

**(a) It gets its own identifier, and deliberately NOT an `E` number.** `E1–E4` is §4.6 S6's clearance
bar and **MSG-0148b forbids adding to it** — the same reasoning that made the durability criterion `DA`
rather than `E5`. **The label is `AB` — application binding.** Verified unused across `docs/` and
`implementation/architecture/` before allocation, and colliding with no existing namespace (`E1–E4`,
`S1–S11`, `U1–U5`, `G-Q4…G-Q7.8`, `I1–I8`, `N1–N6`, `W1–W4`, `EV1–EV13`, `F1–F16`, `DA-1…DA-7`,
`GAP-A…GAP-E`).

**(b) It is a constraint on the APPLICATION, not on the engine, and that is why it needs its own
section.** Every existing criterion asks what an engine does. **`AB-1` asks what the code around the
engine is prevented from doing.** Housing it inside an engine criterion would misfile it and invite
exactly the conflation MSG-0171 §4 warns against — that ruling Q22 discharged something.

**A bounded task is authorized to define it: `TASK-0051`.** Definition only. **It measures nothing,
builds no check, and clears nothing.**

## 6. What none of this changes

- **GAP-B remains UNDISCHARGED. E4 remains UNMET.** MSG-0171 §4 stands: **none of the surfaces found
  is a log**, and that objection is untouched by anything here.
- **All six §4.14 candidates remain NOT CLEARED. Eleven probes have cleared nothing.**
- **Nothing is selected, adopted, deployed, implemented or cleared. No gate is weakened** (MSG-0119).
- **No candidate verdict moves.** Q14 and Q21 change what future evidence must show; they re-score
  nothing already recorded.

## 7. Remaining open — and who owns each

| | Owner | Why |
|---|---|---|
| **MSG-0060 numbering** | **Lead** — housekeeping, will be handled without referral | |
| **Whether to install a build or runtime that could supply a real log** | **Operator** — it is a host change on their machine, and BLK-0011 is the precedent | |
| **Merging `claude/architecture-lead-loop` into `main`** | **Operator** — Q23 ruling (MSG-0170) | |

**Nothing else is waiting on the operator.**

## 8. State

- **TASK-0051 is authorized and reconciled as the single READY task** — define `AB-1`.
- **The L4/W-B re-measurement is authorized, NOT READY**, sequenced after TASK-0051.
- **EV13 and the Q14 ruling require an EPA-0006 update**, which TASK-0051 does **not** perform;
  it is a separate obligation and is recorded here as outstanding rather than absorbed.
