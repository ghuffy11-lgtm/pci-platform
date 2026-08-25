# MSG-0161 — TASK-0047 Execution Record: N6, the Byte-Level Durability Containment Requirement

**From:** Claude Code
**To:** PCI Architecture Lead
**Date:** 2026-08-25
**Status:** **OPEN** — record, with **one question referred (§7)**, **not blocking**
**Authority:** **MSG-0160 (Q19 = YES)**; `implementation/operations/TASK-0047-byte-durability-architecture-requirement.md`; queue board row (single READY task)
**Evidence basis:** **MSG-0158** (TASK-0046), **§4.17**, **§4.13**, **§4.16** as binding before this task
**Delivered:** **EPA-0006 §4.18 — N6**, plus a declared pointer note under §4.13's N-table

---

## 0. The result, first

**N6 exists as an architecture requirement and nothing was measured against it.** That is not a gap in
the run — **TASK-0047 is documentation/architecture definition only**, and its own execution boundary
says so.

**Nothing selected, adopted, deployed, implemented or cleared. No invariant amended. No candidate
verdict moved. Nine probes have still cleared nothing.** `git diff --name-only docs/` is **empty**.

## 1. What N6 says

> **N6 — Byte-level durability containment.** Resolving a routed subject's request must not cause
> **bytes** of content unauthorized for that subject to become durable, **including where those bytes
> are already present in the store's physical history rather than in any structure the traversal may
> open.**

**Three limbs, separable because a topology can fail any one alone:** **N6.1** no history-sourced
durability (freed page, reclaimed extent, recycled block); **N6.2** no original-image escape (rollback
journal, undo record, shadow page); **N6.3** history brought within the invariant by the **§4.13 N3**
transition, not only the live entries.

## 2. The two structural choices, declared rather than assumed (required outcome 3)

**Label `N6`** — it is a **property of the topology**, which is what the N-series states, and N1–N5 are
taken. **Deliberately not a `DA` number:** the DA-series states **what a probe measures on artefacts**;
**N6 states what a design must achieve**. **Merging them would make the criterion and the obligation
impossible to fail separately**, and this evidence exists precisely because they can be.

**New section §4.18, and §4.13's N-table left exactly as TASK-0041 wrote it** — a **pointer note** under
the table rather than a sixth row, on §4.12's Q12 precedent: **one rule, one statement.**

**Rejected: widening N1 to cover bytes.** MSG-0160 preserves N1 in terms, and widening it would destroy
the distinction the evidence records — **L4 satisfies N1 and still made unauthorized bytes durable.**
**A rule that cannot be satisfied and violated independently of another is not a separate rule.**

## 3. Relationship to N1 and DA-1, without conflation (required outcomes 1 and 4)

| | **N1** | **N6** | **DA-1** |
|---|---|---|---|
| Kind | topology requirement | topology requirement | **measurement criterion** |
| Object | **entries** in reachable structures | **bytes** made durable by the request | what the engine **writes** to artefacts |
| Instrument | `Ustruct`, entry counting (§4.11) | page-level parse and classification (MSG-0158) | artefact scan with provenance (DA-4) |
| L4's result | **satisfied** | **violated** | the violation **surfaces as** a DA-1 finding |

**N1 is unchanged, unweakened and still necessary**, and **N6 does not subsume it** — a topology could
keep its history clean while routing a subject to a structure holding unauthorized entries. **Neither
implies the other.**

**DA-1 is where an N6 violation becomes visible**, which is how this one became visible. **Satisfying N6
clears nothing** — it creates no evidence class, is not in §4.6 S6's table, and **cannot substitute for
E1, E2, E3 or E4**. **DA-6's fail-closed rule carries:** residue or pre-image that **cannot be
inspected** is **NOT CLEARED**, never an inferred pass.

## 4. The evidence boundary, stated as limits rather than as scope (required outcome 3)

**Demonstrated:** SQLite **3.51.3** via `node:sqlite`, **both journal modes**, an isolated store that
had **previously held another partition** and was re-materialised, an **appending** write, **a page from
the free list**, **10 store pages still carrying `UNAUTH x15` each**, journal page images **3 of 3
byte-identical** to an independently read copy.

**Not established and not to be inferred:** that **any topology satisfies N6** — **nothing has been
measured against it**; that this is a property of **SQLite, of an engine class, or of storage engines
generally** — **one subject, one allocator**, and §4.6 S10 forbids the generalization; that **freed-page
reuse is the only history mechanism** — N6.1 names extents and blocks **because the mechanism is
generic, not because they were measured**; and that **the residue is itself a violation** — **it is not**,
its provenance is the re-partition (**DA-4 row 1**), and **the finding is what the request then did with
it.**

## 5. Why the requirement is stated at the architecture level

**§4.13 N3 restores the partition invariant on an enumerated transition, and a W1–W3 topology
re-materialises partitions as its normal operating mode** — so the state that produced the result is
**the state such a design spends most of its life in**, not a corner case.

**And it inverts TASK-0045's finding.** There the **updating** write leaked and the **appending** write
journalled nothing, because *"a rollback journal holds original images of overwritten pages and appends
overwrite none"*. **That reasoning was correct about a store whose free list is empty.** In a
re-materialised store **the append does overwrite something**, and **the difference is the store's
history, not the query.** **A better query does not answer it; no entry-counting instrument can see it.**

## 6. Required outcomes — each with its evidence

| # | Required outcome (TASK-0047) | Evidence |
|---|---|---|
| 1 | **N1 preserved as entry containment** | §4.13's table **untouched**; §4.18 states N1 unchanged and still necessary; the pointer note says so at the table |
| 2 | **Explicit requirement for bytes durable via page reuse or equivalent** | **§4.18 N6**, with limbs **N6.1–N6.3** |
| 3 | **Terminology and evidence boundary, without over-generalizing** | §4.18 *"N6's evidence boundary"* — four explicit non-inferences, including **no topology is claimed to satisfy N6** |
| 4 | **Relationship to N1 and DA-1 without conflation** | §4.18's two comparison tables; §3 above |
| 5 | **Shape-1, Q1, Q2, Q7, Q12, Q13, DA-1 preserved** | §4.18 *"N6 relaxes nothing"*, naming each; **no other section edited** |
| 6 | **No engine selected, adopted, deployed, implemented or cleared** | §4.18 *"What this section does NOT do"*; `git diff --name-only docs/` **empty** |
| 7 | **No candidate verdict changed** | **Nine probes have cleared nothing**; §4.11, §4.12, §4.14 and §4.17 verdicts reproduced nowhere and altered nowhere |

## 7. One question referred — **Q20**, and it blocks nothing

**Q20 — should a bounded evidence task now measure N6, and against which topologies?**

**Not taken.** **This task is documentation only** and MSG-0160 authorized **one** bounded task, which is
this one. **N6 is currently a requirement no candidate has been measured against**, and §4.13's **EV-list
of minimum evidence before an engine-selection task** does not yet include an N6 item.

**Fail-closed default until ruled:** **N6 is unmet for every candidate**, because **unmeasured is not
satisfied** — the same rule §4.6 S9 applies everywhere else. **Nothing turns on it today**: selection is
blocked on independent grounds, and **no candidate is eligible under any answer to Q20.**

## 8. Verification, quoted

```text
starting HEAD                      -> 6bb259a (verified against origin/main before editing)
git diff --name-only docs/         -> empty
EPA-0006 §4.18 present             -> yes, between §4.17 and section 5
§4.13 N-table rows changed         -> none (pointer note added below the table)
insertions / deletions             -> 142 / 0, one file
git status --porcelain             -> empty after commit
```

**Post-change content verified from `origin/main` after pushing.**

## 9. State

- **TASK-0047 is COMPLETE.** **No task is READY**, and none is authorized.
- **N6 exists; nothing has been measured against it; no candidate holds an N6 status.**
- **DA-1 remains NOT CLEARED for the one subject measured. Nine probes have cleared nothing.**
- **Open for the Lead:** **Q20** (measure N6?); **Q18** — whether **TASK-0046's evidence** becomes an
  EPA-0006 section of its own, the direct analogue of Q15 which produced §4.17 — **still unruled**, and
  **§4.18 does not answer it**: this section cites MSG-0158 as its **basis** and is **not** a promotion
  of that evidence; **Q17** (the queue mechanism point MSG-0158 raised); **Q14**; and **MSG-0060**'s
  numbering question.
- **No blocker open.** DISC-0011 and DISC-0012 open; neither moves a verdict.
