# TASK-0049 — promote TASK-0046's topology/durability evidence into EPA-0006 §4.19

**Authority:** **MSG-0161b** (Q18 = YES), ruling consequence 1; MSG-0158 (the evidence and its boundary);
MSG-0162 §5 (section number fixed, task defined, sequencing).
**Type:** Architecture documentation / evidence promotion. **Not a measurement task.**
**Status:** **READY** — reconciled into `implementation/operations/CLAUDE-TASKS.md` as the single READY
task on 2026-08-26 (**MSG-0164**), its sequencing prerequisite (**TASK-0048 COMPLETE**, MSG-0163) now
satisfied.

> **This line read `AUTHORIZED — NOT READY` until 2026-08-26.** The change is the queue reconciliation
> and nothing else: **the authority is unchanged (MSG-0161b, Q18 = YES), and the scope, required
> outcomes and constraints below are unchanged.**

## Why this task exists separately

MSG-0161 carries two consequences: **Q18** promotes TASK-0046's evidence into EPA-0006, and **Q20**
authorizes the bounded N6 measurement (TASK-0048). **They are separate obligations.** TASK-0048's
definition states in terms that it does not perform the promotion.

This is the second time a promotion consequence has arrived without a task — MSG-0157's §4.17
promotion did the same and had to be caught afterwards by MSG-0159. **Recording it as a numbered,
sequenced task is the correction to that pattern.**

## Objective

Record TASK-0046's measured topology/durability result in EPA-0006 as a distinct **§4.19**, at the
same evidentiary standard as §4.17, and **without changing anything the evidence does not establish**.

## Scope

Promote what MSG-0158 records, in its own terms:

1. **Part one — containment prevented the exposure the Q16 boundary asked about.** Under **W-A**
   (the TASK-0045 access-accounting shape), the **shared** layout made unauthorized content durable —
   **200 markers across 6 journalled page images, all 6 carrying both authorization classes** — and
   **no isolated layout did**.
2. **The mechanism is exhibited, not asserted.** The artefacts were parsed, every durable page was
   identified by number and classified individually, and every image was verified byte-identical to
   an independently read copy of the store.
3. **Part two — the same isolated topology failed a different way.** **L4** (isolated stores,
   re-materialised from the other partition) made the marker durable **15 times** under **W-B**, an
   appending cache writeback, with **no unauthorized row anywhere in reach**. The mechanism is
   **co-residency of bytes, not rows**: the dropped partition's pages sit on the free list with their
   content (**10 pages at `UNAUTH ×15`**), the append consumes one, and journalling writes its
   original image.
4. **This inverts TASK-0045**, whose W-B "journalled nothing" — true of an empty free list only.
5. **§4.13 N3 makes re-materialisation the normal operating mode**, so **L4 is where a W1–W3 topology
   lives**.
6. **L4 satisfies N1 as written** — no unauthorized *entry*; `U` and `Ustruct` are blind to it — so
   **N1 and DA-1 ask different questions of the same page**. This was **referred, not amended**, and
   the referral was answered by **MSG-0160 (Q19 = YES)** and delivered as **§4.18 N6**.
7. **Two apparatus defects were fixed before any result was reported** (the journal magic is zeroed
   mid-transaction — cause established, replaced by a byte-for-byte check; and a comparability
   assertion that confused *in reach* with *touched*). **Record them; a promotion that hides its
   instrument's history is worth less than one that shows it.**
8. **Run validity:** 16 configurations, first subject (SQLite 3.51.3 via `node:sqlite`, node
   v24.15.0, `secure_delete=0`, `auto_vacuum=0`); **both mandatory negative controls fired**, so the
   run is **VALID**.

## Required outcomes

1. **EPA-0006 §4.19 exists**, additive, and carries the result above with its mechanism.
2. **The MSG-0158 evidence boundary is preserved in the section's own text**: one subject, one
   allocator, one build. **State the limits as limits.**
3. **§4.19 states its relationship to N1, to N6 (§4.18) and to DA-1 (§4.16)** without restating or
   amending any of them.
4. **The relationship to §4.17 is stated** — §4.17 is TASK-0045's DA-1 evidence, which part two of
   this result **inverts** under a non-empty free list.
5. **Existing sections are not rewritten.** Follow the §4.17 and §4.18 precedent: **additive, and
   where an existing section needs to point at the new one, a declared pointer note** (§4.12 Q12
   precedent) rather than an edit to a table or a gate.
6. **`git diff --name-only docs/` is empty**, and the change is verified from `origin/main` after
   pushing.
7. **COMMS, status, queue row, and checkpoint recorded**, and the numbering uses **MSG-0165 or
   later** — MSG-0163 is the TASK-0048 record and **MSG-0164 is the Lead's verification/reconciliation
   record**. The MSG-0161 collision is indexed as **MSG-0161a / MSG-0161b** in `comms/README.md`.

## Constraints

- **No generalization of the single-subject result to an engine class.** MSG-0161 Q18 states this in
  terms, and §4.15 already records that the subjects differ in the binding, not the build.
- **No engine selection, adoption, deployment, implementation or clearance.** **Promotion clears
  nothing.**
- **No change to N1–N6, DA-1…DA-7, E1–E4, G-Q4…G-Q7, S1–S11, strict Shape-1, or any clearance gate.**
- **No candidate verdict changes.** **Ten** probes have cleared nothing (TASK-0048 is the tenth).
- **No new measurement.** This task records evidence that already exists; if the promotion appears to
  require a number that MSG-0158 does not contain, **stop and refer it** rather than measuring.
- **Do not restate TASK-0048's N6 findings as part of this section.** **TASK-0048 HAS now reported**
  (MSG-0163): §4.19 remains the **TASK-0046** promotion, and **N6 findings belong to MSG-0163 and to
  their own record.** Note that MSG-0163 **did not reproduce** TASK-0046's L4/W-B arm — §4.19 records
  what **MSG-0158** measured, and **must not** be reconciled against MSG-0163 or softened by it.
- Stop at any environment or operator boundary rather than routing around it.
- Stop if `origin/main` moves mid-run and reconcile before continuing.

## Execution boundary

This task **is now the single READY task** in the authoritative
`implementation/operations/CLAUDE-TASKS.md` queue (**MSG-0164**). **TASK-0048 is COMPLETE** (MSG-0163)
and no longer takes precedence.
