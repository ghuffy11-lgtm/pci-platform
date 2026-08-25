# MSG-0158 — TASK-0046 execution record: physical containment measured against the Q16 boundary

**From:** Claude Code
**To:** Architecture Lead
**Date:** 2026-08-25
**Status:** OPEN — record, **three questions referred, none blocking**
**Authority:** **MSG-0157** (Q15/Q16 **DECIDED**); the Lead's committed task definition
`implementation/operations/TASK-0046-q16-topology-durability-evidence.md` (`bafe5c9`); **EPA-0006
§4.13** (N1–N5, W1–W4) and **§4.16** (DA-1…DA-7) binding as written
**Evidence:** `implementation/probes/TASK-0046/probe.mjs` and `probe-output.txt` (1 509 lines,
captured in full); checkpoint `implementation/operations/checkpoints/TASK-0046.md`

---

## 1. The answer, in three sentences

**Physical containment prevented the exposure the task asked about, and did not prevent a second one
that the same isolated topology exhibits.** Under **W-A — access accounting, the TASK-0045 write
shape — the shared layout made unauthorized content durable and no isolated layout did**; the
mechanism is exhibited rather than asserted, because every page the request made durable was parsed
out of the artefact, classified individually, and verified byte-identical to an independently read
copy of the store. **Under W-B — an appending cache writeback — an isolated store that had been
re-materialised made the previous partition's content durable anyway**, from a page the old partition
left on the free list, with **no unauthorized row anywhere in reach**.

**Nothing is CLEARED. Nine probes have now cleared nothing.**

---

## 2. What was measured

**16 configurations**: 4 physical organizations × 2 journal modes × 2 request-induced write shapes.
Subject: **SQLite 3.51.3 via `node:sqlite`, node v24.15.0**, `page_size` 4096,
**`secure_delete` 0, `auto_vacuum` 0** — read, not assumed, because L4's result depends on them.

| | Physical organization | Unauthorized rows in reach |
|---|---|---|
| **L1** | **Shared projection** — one structure, both classes interleaved. The TASK-0045 shape | **200** |
| **L2** | **Isolated structures, one store** — separate b-trees in one file | **0** |
| **L3** | **Isolated stores** — one store per partition; the routed shape of §4.13 W2/W3, bounded by execution context in W4 | **0** |
| **L4** | **Isolated stores, after re-partition** — L3 exactly, except this store previously held the *other* partition and was re-materialised | **0** |

| | Request-induced write shape |
|---|---|
| **W-A** | **Access accounting** — `UPDATE … SET served = served + 1 WHERE <entitled>`. The shape that produced TASK-0045's result, and the one the task file names |
| **W-B** | **Cache writeback** — `INSERT INTO result_cache SELECT … WHERE <entitled>`. The shape **TASK-0045 F3 measured journalling nothing** |

**Neither shape reads, examines or modifies anything the subject is not entitled to, and that is
measured after every write rather than argued from the `WHERE` clause: rows modified that the subject
was not entitled to = `0` in all 16 configurations.** Rows touched = **200** in every configuration of
each shape.

---

## 3. The result table, as captured

| configuration | store BOTH | durable pages | durable UNAUTH | verdict |
|---|---|---|---|---|
| L1 / DELETE / W-A | 7 | 6 | **200** | **FINDING → NOT CLEARED (DA-5 row 1)** |
| L1 / DELETE / W-B | 7 | 2 | 0 | no marker observed (DA-5 row 3 governs) |
| L1 / WAL / W-A | 7 | 6 | **200** | **FINDING → NOT CLEARED (DA-5 row 1)** |
| L1 / WAL / W-B | 7 | 5 | 0 | no marker observed |
| L2 / DELETE / W-A | 0 | 3 | 0 | no marker observed |
| L2 / DELETE / W-B | 0 | 2 | 0 | no marker observed |
| L2 / WAL / W-A | 0 | 3 | 0 | no marker observed |
| L2 / WAL / W-B | 0 | 5 | 0 | no marker observed |
| L3 / DELETE / W-A | 0 | 3 | 0 | no marker observed |
| L3 / DELETE / W-B | 0 | 2 | 0 | no marker observed |
| L3 / WAL / W-A | 0 | 3 | 0 | no marker observed |
| L3 / WAL / W-B | 0 | 5 | 0 | no marker observed |
| L4 / DELETE / W-A | 0 | 3 | 0 | no marker observed |
| **L4 / DELETE / W-B** | 0 | 3 | **15** | **FINDING → NOT CLEARED (DA-5 row 1)** |
| L4 / WAL / W-A | 0 | 3 | 0 | no marker observed |
| **L4 / WAL / W-B** | 0 | 6 | **15** | **FINDING → NOT CLEARED (DA-5 row 1)** |

*"store BOTH" — pages of the store holding rows of both classes, measured before the request.
"durable" — page images the request wrote into the rollback journal or the WAL.*

---

## 4. Part one — the exposure the task asked about, and why this is not TASK-0045 restated

**The task file's success criterion 1 requires the shared arm to *"reproduce or otherwise directly
measure the page-co-residency mechanism … without relying on presence alone"*, and forbids re-running
prior evidence as new evidence.** A marker count cannot do that: it establishes that content is in the
artefact, not that co-residency is why.

**So the artefacts were parsed.** A rollback journal is a sequence of *(page number, original page
image)* records and a WAL is a sequence of frames of the same shape, so **every page the request made
durable is identifiable and classifiable on its own**:

- **L1 / DELETE / W-A** — the store held **7 pages carrying BOTH classes** before the request. The
  journal the transaction created held **6 page images, all 6 carrying BOTH classes**, `UNAUTH x200`
  and `AUTH x200`. Pages **3, 4, 5, 6, 7, 8**, each printed with its own counts.
- **L2, L3, L4 / W-A** — **every page image the request made durable carried one class only.**

**That is the mechanism exhibited.** The unauthorized content became durable because the pages the
engine had to write down held authorized and unauthorized rows together; when they did not, it did
not.

**The parse is not the parser marking its own work.** Before each transaction the store was read
independently, page by page, and **every parsed page image was compared byte for byte against that
copy**: `6 of 6`, `3 of 3`, and so on across all 16 configurations, with **no mismatch anywhere**.

---

## 5. Part two — the result the probe was not built to find

**L4 is L3.** Same isolation, same store layout, same entitlement, **no unauthorized row anywhere in
reach**, same request. One difference: **the store had previously held the other partition and was
re-materialised.** Under **W-B it made the unauthorized marker durable 15 times**, in both journal
modes.

**The mechanism is not co-residency of rows. It is co-residency of bytes.**

- The re-partition dropped the old rows. **Their pages went to the free list and their bytes stayed
  there** — the store scan shows **10 pages still carrying `UNAUTH x15` each** in a store holding no
  unauthorized row.
- **That residue is not itself a DA-1 finding**, and the probe says so where it is measured: its
  provenance is the **re-partition**, not a request, so **DA-4 row 1** applies.
- **The finding is what the request then did.** The appending write consumed a free-list page, and
  **journalling that page wrote its original image — the old partition's bytes — into the artefact.**
  In `L4 / DELETE / W-B` the journal held **3 page images, one of them page 3, `UNAUTH x15`**, and the
  parser check on that measurement was **3 of 3 byte-identical**.

**Note which write shape did it, because it inverts TASK-0045.** There, **W-A** leaked and **W-B
journalled nothing** — *"a rollback journal holds original images of overwritten pages and appends
overwrite none"* (MSG-0155). **That reasoning was correct, and it was correct about a store whose free
list is empty.** In a re-materialised store **the append does overwrite something: a page the previous
partition left behind.** Same write shape, opposite result, and **the difference is the store's
history**.

**This is not a corner case, and that is the part that matters architecturally.** **§4.13 N3 requires
the partition invariant to be restored by "the recorded event that would break it"**, and names
ingestion, effectivity-boundary crossing and entitlement-class change among those events. **A W1–W3
topology re-materialises partitions as its normal operating mode.** The state L4 measures is not one
such a design would rarely be in; **it is the state it spends most of its life in.**

### What this says about N1 — and what it deliberately does not

**§4.13 N1 requires every structure the traversal may open to contain, at answer time, no *entry*
unauthorized for the routed subject. L4 satisfies N1 as written.** There is no such entry; no query
reaches those bytes; **no `U` counter can see them**, and `Ustruct` — N1's own instrument (§4.11) —
counts entries, so it would report zero here.

**N1 and DA-1 are asking different questions of the same page.** N1 asks what the structure
*contains* as data; DA-1 asks what the engine *writes down*. **This record does not propose amending
N1 or any other invariant** — that is an architecture change it has no authority to make. It is
**referred as Q19** below.

---

## 6. Run validity, and the controls kept separate from the subject

**RUN VALIDITY: VALID.** §4.6 S8: *a run whose negative control comes back clean has measured
nothing.*

**Two negative controls, one per instrument, both on the ISOLATED layout** — deliberately, because
that is where the doubt is. A null result under isolation is worthless unless the instrument is shown
capable of a finding **in that layout**; a control on the shared layout would prove nothing about the
isolated arm.

- **NC-1 / DELETE fired** — journal held 1 page image, `UNAUTH x60`.
- **NC-1 / WAL fired** — WAL held 1 frame, `UNAUTH x61`.

**MSG-0156's lesson applied in advance rather than corrected afterwards.** These are **controls**;
they are built to produce a finding, **so their numbers are not a finding about any layout**. They
appear in no result row, no verdict and no count of evidence about the subject. **The probe enforces
this structurally** — sections J and K do not read the control's output at all.

**Separately, and not to be confused with a control: the instrument checks.** Every parsed page image
matched an independently read copy of the store. **A control shows the instrument can see a finding; an
instrument check shows the instrument reports what is actually in the file.** They are different
claims and are reported under different headings.

---

## 7. Two defects in the probe's own apparatus, found and fixed before any result was reported

**Recorded rather than tidied away, in the pattern MSG-0155 §7 and MSG-0156 established.**

1. **The first parser required the rollback journal's magic bytes, and all four rollback-mode
   measurements came back `MAGIC DID NOT MATCH` — the run declared INVALID.** The cause was
   **established rather than named**: read *during* the transaction, which is the only time the
   artefact exists, bytes 0..7 are **zero**, because the engine **writes the magic last** so that a
   torn journal is not mistaken on recovery for a complete one. **A bare failure is not a diagnosis**,
   and the first guess — "the parser is wrong about the format" — would have sent the next session to
   fix the offsets, which were correct. **The fix was not to drop the check but to replace it with a
   stronger one**: byte-for-byte comparison against an independently read copy. A header field the
   engine may legitimately leave blank is a weaker validity test than the bytes themselves.
2. **A comparability check was wrong in a way that would have failed the run for being correct.** It
   asserted that no configuration had unauthorized rows *in reach* — but **that figure is the
   independent variable** (L1: 200; L2/L3/L4: 0). It conflated *"what the topology puts within
   reach"* with *"what the request touched"*. Replaced by the invariant that actually matters, now
   **measured after every write**: rows modified that the subject was not entitled to — **0 in all 16
   configurations**.

**Both are the same class of error as the ones already on this record: a number used without the
condition that produced it.**

---

## 8. Acceptance criteria — the Lead's nine, each with its evidence

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | Shared baseline reproduces or directly measures the page-co-residency mechanism, not presence alone | **MET** | Store scan: **7 BOTH pages**. Journal parse: **6 page images, all BOTH**, `UNAUTH x200`, each page numbered. Parser verified **6/6 byte-identical** |
| 2 | The isolated layout measured under the same request-induced write shape | **MET** | L2, L3, L4 under **W-A and W-B**, identical SQL shape, **200 rows touched** in each |
| 3 | Provenance separated; otherwise NOT CLEARED | **MET** | Per measurement: rollback mode — `-journal` **NEVER CREATED** at baseline, so one seen later was created by the transaction; WAL mode — `wal_checkpoint(TRUNCATE)` then **`-wal` read back at 0 bytes**. Verified, not assumed, in all 16 |
| 4 | Results per physical organization and per applicable artefact, DA-5 vocabulary | **MET** | §3 above and probe section J — **DA-5 row 1** for findings, **row 3** for absences, **row 4** named for what absence would need |
| 5 | A negative control that must produce a DA-1 finding fires, else INVALID | **MET** | **NC-1 / DELETE and NC-1 / WAL both fired**, on the isolated layout; §6 |
| 6 | States whether physical containment prevents the exposure for the tested configuration, without generalizing to an engine class | **MET** | §1, §4, §5, and the probe's section K, which states the boundary in the task file's own words |
| 7 | No E1–E4, G-Q4…G-Q7, S1–S11, DA-1…DA-7 or other gate changed | **MET** | `git diff --name-only origin/main -- docs/` → **empty**; EPA-0006 **not modified**; no criterion adjusted |
| 8 | No engine selected, adopted, deployed or implemented; no candidate cleared | **MET** | Nothing selected; **all six TASK-0042 candidates remain NOT CLEARED**; **nine probes have cleared nothing** |
| 9 | COMMS, status, queue, checkpoint, harness/output and verification reconciled from `main` | **MET** | This message, the queue board and ledger, the comms register, the status file, checkpoint TASK-0046 (3 checkpoints), harness and captured output — all committed; read back from `origin/main` |

---

## 9. Limitations — stated, not omitted

1. **One subject, one build.** §4.15: the two available subjects differ in the **binding, not the
   build**. **Nothing here is a claim about "SQLite", still less about class R.** The second subject
   was **not** invoked — MSG-0145 granted `py` for TASK-0043's probe only and no fresh grant exists.
2. **Two write shapes, not all of them.** W-A and W-B were chosen because TASK-0045 measured both and
   got opposite answers. **A third shape could behave differently again**, and this run cannot exclude
   it. Running W-A alone would have produced the clean answer *"containment prevents it"* — and that
   answer would have been **an artefact of the write shape chosen**.
3. **The L4 result depends on deployment settings**, reported rather than assumed: `secure_delete=0`,
   `auto_vacuum=0`, and **no VACUUM after re-partition**. A deployment that zeroes freed pages or
   vacuums on re-materialisation would not reproduce it. **This record has no evidence about which is
   more common and makes no claim.**
4. **The L4 fixture gives the mechanism a chance to appear** — the predecessor partition used wider
   rows than its successor, so the free list is non-trivial when the request runs. **A declared
   construction, not a hidden one.** It establishes the mechanism is **available**, never that it is
   universal.
5. **Byte scanning.** The classifier counts a literal marker and would miss content stored in a form
   the marker does not survive. **An absence is worth even less than DA-5 row 3 already makes it.**
6. **DA-1.2 and DA-1.3 were not re-measured.** TASK-0045 recorded both **NOT CLEARED** and **this run
   neither confirms nor disturbs them**. Engine-produced backups were **not** re-measured for the same
   reason — the task file forbids re-running prior evidence as new evidence.
7. **Page-to-structure attribution is by content, not by catalogue.** Sufficient for co-residency; not
   a claim about b-tree ownership.

---

## 10. Questions referred — three, none blocking

**Q17 — the queue mechanism, not this task's substance.** MSG-0157 and the TASK-0046 definition were
committed; **the queue row was not**, and the task file gates its own execution on that row. A READY
row then appeared **in the working tree** — uncommitted, unattributable, encoding-corrupted — one
minute before the supervisor cycle that started this runner. **This session rewrote it from the two
committed Lead artefacts and committed it**, so the authorization traces to a record rather than to a
working-tree edit. **Should queue reconciliation continue to be performed this way** (the `1dd7a78`
precedent), **or should the Lead commit the READY row**? Either is workable; the current arrangement
has now produced one case where **the supervisor started a runner on the strength of a file no future
session could read.**

**Q18 — does this evidence become an EPA-0006 section?** **Deliberately not taken.** MSG-0157 fixed
**§4.17** for TASK-0045's DA-1 evidence, and **that promotion has no authorized task and was not
performed here.** Taking §4.18 for this run would be the silent architecture change that referring
§4.15 (R1) and §4.17 (Q15) was designed to prevent.

**Q19 — do N1–N5 need a limb about bytes rather than entries?** §5 above: **L4 satisfies N1 as
written and still made unauthorized content durable.** The candidate answers are visible and each is
an architecture decision: extend N1; add an invariant about the *physical* state of a re-materialised
partition; require erasure or `VACUUM` as part of N3's restoration; or record it as a deployment
requirement outside the topology invariants entirely. **This record recommends none and decides
none.** **It blocks nothing**: engine selection is already blocked on independent grounds, and **no
candidate is eligible on any reading**.

---

## 11. What this record does NOT establish

- **Nothing is CLEARED, and nothing could have been.** **DA-5 consequence 1**: satisfying DA-1 clears
  nothing, and DA-1 is **not** an §4.6 S6 evidence class. **Nine probes have now cleared nothing.**
- **No Shape-1 verdict moves.** All six TASK-0042 candidates remain **NOT CLEARED** for the reasons
  they already were.
- **DA-1 remains NOT CLEARED for this subject**, on the two independent routes MSG-0155 recorded —
  **neither of which this run touched**.
- **No topology is selected.** W1–W4 differ on **cost and operability** (§4.13 **GAP-C**) and nothing
  here narrows that. **L2, L3 and L4 are not ranked**, and a clean W-A column is not a recommendation.
- **No gate, criterion, invariant or ADR is changed.** `docs/` diff **empty**.
- **No numeric threshold, benchmark, latency or capacity figure is introduced.** Every count is an
  observation.
- **Nothing was installed, no host configuration was touched, and no real or confidential corpus was
  read.** Every fixture is synthetic (S11), created under the OS temp directory and removed.
