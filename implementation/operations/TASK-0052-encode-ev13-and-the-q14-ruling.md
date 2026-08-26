# TASK-0052 — encode EV13 and the Q14 disqualification ruling in EPA-0006

**Authority:** **MSG-0172 §1** (Q14 ruled) and **§2** (Q21 ruled, EV13).
**Type:** Architecture documentation. **Not a measurement task.**
**Status:** **AUTHORIZED — NOT READY.** Sequenced after TASK-0051. It becomes READY only when the
Architecture Lead reconciles it into the queue as the single READY task.

## Why it exists separately

**MSG-0172 ruled two things that change what future evidence must show, and neither is written into
the architecture yet.** MSG-0172 §8 recorded this as outstanding rather than letting TASK-0051 absorb
it — the mistake MSG-0157 made and MSG-0159 had to catch afterwards.

## Required outcomes

1. **`EV13` added to the §4.13 EV-list**, in the list's existing form and at EV2's strength:

   > **EV13 — N6, measured.** The selected topology must be **measured against N6** (§4.18) — limbs
   > N6.1, N6.2, N6.3 — with **provenance established before any finding is assigned**, and with the
   > **residue after an N3 transition** examined, not only the live entries. **Unmeasured is not
   > satisfied.**

2. **The Q14 ruling recorded against §4.16**, in both limbs and kept separate because they are
   different facts: **DA-1 DISQUALIFIED ⇒ the candidate is disqualified for selection**;
   **DA-1 NOT CLEARED ⇒ cannot support selection, and does not itself disqualify.**
3. **MSG-0172's reasoning for each is reproduced, not paraphrased away** — in particular that a
   confirmed DA-1 violation is *"the same confidentiality failure strict Shape-1 exists to prevent,
   arriving by the write path"*, and that treating unproven as violation *"would let a missing
   instrument convict an engine"* (§4.6 S5).
4. **The asymmetry is stated explicitly** so it is not read as contradicting DA-5 consequence 1:
   **passing a necessary condition is not evidence of the whole; failing one is decisive.**
5. **`EV13` and the Q14 ruling create NO new clearance gate.** §4.6 S6's table is untouched. **N6
   still clears nothing** (§4.18).
6. **Additive.** `git diff --numstat` shows **zero deletions**. Where an existing section must point
   at a change, use a **declared pointer note** (§4.12 Q12 precedent) rather than rewording it.
7. **`git diff --name-only docs/` empty**; verified from `origin/main` after pushing.
8. **COMMS, status, queue row and checkpoint recorded.**

## Constraints

- **Documentary only. Measure nothing, build nothing, run no probe.**
- **No candidate verdict changes.** Q14 re-scores nothing already recorded — **DA-1 has never been
  applied to a candidate**, so no verdict moves. Say so in the section.
- **No change to E1–E4, S1–S11, strict Shape-1, N1–N6, DA-1…DA-7's definitions, or G-Q4…G-Q7.8.**
  **E4 is not weakened** (MSG-0119).
- **Do not imply GAP-B is closer to discharge.** It is not.
- Stop at any environment or operator boundary. Stop if `origin/main` moves mid-run.
