# MSG-0178 — TASK-0053 execution record: the L4/W-B divergence, re-measured against a controlled residue population

**From:** Claude Code (Execution Supervisor run)
**To:** PCI Architecture Lead
**Date:** 2026-08-26
**Status:** OPEN — execution record, one question referred, nothing blocking
**Task:** TASK-0053 — re-measure the L4 append arm against a deliberately strong history
**Authority:** **MSG-0172 §4** (the divergence ruled re-measurable); **MSG-0174** (defined and queued);
**MSG-0177 §3** (reconciled as the single READY task); the Lead's task file
`TASK-0053-l4-wb-re-measurement.md`, **which is the specification**; **EPA-0006 §4.18** (N6) and
**§4.16** (DA-1…DA-7) binding as written.
**Artefacts:** `implementation/probes/TASK-0053/probe.mjs` and `probe-output.txt`, committed at
`7521ed8`. **Checkpoint:** `implementation/operations/checkpoints/TASK-0053.md`.

---

## 1. The result, stated first

**A real probe ran: 132 measurements — 128 L4 cells (8 residue densities × 2 transition kinds × 2
journal modes × 2 request-induced write shapes × 2 page-cache settings) plus 4 shared-layout control
cells.** Every cell reports its own **measured** residue count. **All eight controls fired; the run is
VALID, and validity is enforced by an abort rather than asserted.**

> **THE HYPOTHESIS IS `UNRESOLVED`, AND IT IS NOT ROUNDED.**

**The pre-registered rule returned `UNRESOLVED` because the two journal modes disagree:**

| | `wal` | `delete` |
|---|---|---|
| Rule verdict on the W-B append arm | **CONFIRMED** | **UNRESOLVED** — a partial gradient |
| Leak with **1** free residue page | **0 of 4 cells** | **4 of 4 cells** |
| Leak with **42** free residue pages | 4 of 4 cells | 4 of 4 cells |

**In `delete` mode, MSG-0163's proposed cause is refuted on its own terms.** It reasoned that *"an
append can only expose residue if it consumes a residue page, and with one such page the odds are
small."* **Measured: with exactly one free residue page, the append consumed it in 4 of 4 cells, in
both transition kinds and both cache settings. The odds were 1, not small.**

**Nothing is CLEARED. No candidate verdict moved. No gate, invariant, criterion or verdict changed.
`git diff --name-only docs/` is empty. Eleven probes have now cleared nothing, and this is the
twelfth.**

**Neither prior record is re-opened, weakened or superseded. Both stand exactly as taken.** This run
measured a variable neither controlled — and then found that variable was not the one doing the work.

---

## 2. The bigger finding: the explanatory variable is not density, it is the KIND of residue

**The task file anticipated this case in terms — *"if it does not, that is a more important finding
and must be referred, not explained away"*. It is referred in §8 and it is not explained away here.**

**A store page carrying the predecessor's bytes is one of two mechanically different things, and both
priors — and the first pass of this probe — counted them together:**

| | What it is | Which write can reach it |
|---|---|---|
| **FREE** | a whole page the predecessor left on the free list | **only an ALLOCATING write.** The page holds no live row, so nothing else touches it |
| **CO-RESIDENT** | a page the successor **partially reused**, so live authorized rows sit beside the predecessor's dead bytes in the same page | **only a write that touches those authorized rows.** The page is not free, so an allocating write never takes it |

**That single distinction accounts for every result in the run, including the two that look
contradictory.** Grouped by **free** residue rather than total (probe output §G2):

| Free residue pages | co-resident | **W-B append** `delete` | **W-B append** `wal` | **W-A update** `delete` | **W-A update** `wal` |
|---|---|---|---|---|---|
| **0** (8 cells: 4 with no residue at all, 4 with one co-resident page) | 0 / 1 | 0 of 8 | 0 of 8 | **4 of 8** | **4 of 8** |
| **1** | 0 | **4 of 4** | 0 of 4 | 0 of 4 | 0 of 4 |
| **3** | 0 | **4 of 4** | 0 of 4 | 0 of 4 | 0 of 4 |
| **5** | 0 | **4 of 4** | **4 of 4** | 0 of 4 | 0 of 4 |
| **7** | 0 | **4 of 4** | **4 of 4** | 0 of 4 | 0 of 4 |
| **9** | 0 | **4 of 4** | **4 of 4** | 0 of 4 | 0 of 4 |
| **42** | 0 | **4 of 4** | **4 of 4** | 0 of 4 | 0 of 4 |

**Read the `W-A` column against the `W-B` column: the two write shapes have OPPOSITE relationships to
residue, and neither is a relationship to density.** The four `W-A` findings sit **exactly** on the
four cells whose residue is co-resident, and nowhere else. **Density is a proxy that correlates
because a much larger predecessor leaves free pages while a marginally larger one leaves a
co-resident page — and the proxy breaks in both directions.**

---

## 3. The mechanism, exhibited by page number rather than asserted

**§4.19 records what made TASK-0046's evidence worth promoting: pages identified, classified
individually and byte-verified, so the mechanism was exhibited rather than re-asserted. The same is
done here** (probe output §H2, and the per-cell listings in §H). One representative cell per density,
`delete` mode, default cache, `DROP` transition:

```text
D1  residue 3:x14  (ONE page, CO-RESIDENT)
  W-A  made durable : 4:AUTH-only  6:AUTH-only  5:AUTH-only  3:BOTH:x14      -> HISTORY-SOURCED
  W-B  made durable : 7:neither  1:neither                                   -> none

F1  residue 3:x15  (ONE page, FREE)
  W-A  made durable : 4:AUTH-only  7:AUTH-only  6:AUTH-only  5:AUTH-only     -> none
  W-B  made durable : 3:UNAUTH-only:x15  1:neither                           -> HISTORY-SOURCED

D2  residue 3:x15  6:x15 … 13:x15  (NINE pages, all FREE)
  W-A  made durable : 4:AUTH-only  16:AUTH-only  15:AUTH-only  14:AUTH-only  -> none
  W-B  made durable : 5:neither  1:neither  3:UNAUTH-only:x15                -> HISTORY-SOURCED
```

**`D1` and `F1` both hold exactly one residue page and produce opposite results.** At `D1` the page is
`BOTH` — the successor partly reused it — so the **update** reaches it and the **append** cannot. At
`F1` the page is `UNAUTH-only` and free, so the **append** takes it and the **update** never touches
it. **One page in each case; the density is identical; the outcome inverts.**

**And the two journal modes are not measuring the same exposure.** A rollback journal records the page
image **before** the write, so **any** reuse of a free residue page exposes the predecessor's content
in full — which is why one page suffices in `delete` mode. A WAL frame records the image **after**, so
a page the write **fully overwrote** exposes nothing. The probe's own output shows the same page 3
recorded both ways in `wal` mode:

```text
F1-DROP-wal-W-B-default   made durable : 1:neither  3:AUTH-only  8:AUTH-only …    -> none
D2-DROP-wal-W-B-default   made durable : 1:neither  3:UNAUTH-only:x15  5:AUTH-only …  -> FINDING
```

**The `wal`-mode threshold was narrowed by measurement rather than interpolated: it lies between 3 and
5 free residue pages** (0 of 4 at three, 4 of 4 at five). **Why the allocator leaves page 3 carrying
its old content at the higher densities and rewrites it at the lower ones is NOT established here** —
that would require instrumenting the allocator, which this task is not authorized to do and which no
available instrument reaches. **It is referred, not guessed at.**

---

## 4. Reconciling the two priors explicitly (required outcome 6)

**Both prior results are reproduced by this run's model, and neither record needs to change.**

| | TASK-0046 (MSG-0158) | TASK-0048 (MSG-0163) |
|---|---|---|
| L4 residue, as its own output records it | **10 pages, `BOTH 0 \| UNAUTH-only 10`** — all **FREE** | **1 page**; **kind not recorded** |
| L4 / W-B append | **FINDING**, both modes | **no finding** |
| L4 / W-A update | **no finding** | **FINDING**, both modes |
| This run's corresponding row | free residue ≥ 9 → **W-B leaks in both modes, W-A does not** | co-resident residue → **W-A leaks in both modes, W-B does not** |

**TASK-0046 is matched exactly and on a quotation, not an inference.** Its own committed output records
`BOTH 0 | AUTH-only 4 | UNAUTH-only 10 | neither 2` — ten **free** pages, no co-resident page. That is
this run's `free ≥ 9` row, and the result is the same in both modes.

**TASK-0048's match is an INFERENCE, and it is labelled as one.** Its harness counted only *"store
pages carrying the marker"* and **did not record whether that page was free or co-resident**, so the
kind cannot be read from its record and this session did not re-run it (that would be re-reporting a
prior run as new evidence, which MSG-0161b forbids). **The inference is this:** its single residue page
behaved exactly as a **co-resident** page behaves here — `W-A` leaking in both modes, `W-B` silent in
both — and that combination does not occur at any free-residue density measured in this run.
**INFERRED, from the behavioural signature; not verified, because the kind was never recorded.**

**What that does to each record — nothing, and this is the point.** MSG-0163 §4 said its silence was
*"silence, not exoneration"* and declined to assert a cause. **That was the correct holding position
and it is vindicated rather than corrected:** the cause it offered as a hypothesis turns out not to be
the operative one, and it never claimed otherwise. **MSG-0158's finding stands unqualified.** **Neither
is re-opened, weakened or superseded.**

**A second face of the divergence, recorded because the record so far does not carry it.** The
contradiction has been described in one direction only — *"TASK-0046 saw the append leak, TASK-0048 saw
nothing."* **The same two runs also disagree the OTHER way round, on `W-A`**, where TASK-0048 found a
finding (MSG-0163 §3: `wal` 1 of 11 frames carrying; `delete` journal marker ×20) and TASK-0046 found
none. **That is visible only by reading the two committed outputs side by side.** It is not a new
contradiction — the same residue-kind account explains both faces — but a reconciliation that addressed
only the append arm would have left half the disagreement standing.

---

## 5. Controls, and the interlock (required outcome 4)

**MSG-0169 §2 is the standing correction, and it was implemented rather than acknowledged:** TASK-0048's
harness *printed* its controls; *"a printed line is a claim; an abort is an interlock."* **This harness
calls `fail()` and returns a non-zero exit, and — the part that matters — it does NOT PRINT A VERDICT AT
ALL when any control has failed.** The hypothesis section is unreachable on a failed run.

| Control | What it gates | Result |
|---|---|---|
| **NC-1** mechanism | a shared projection **must** produce a finding, per journal mode, or the instrument is not measuring | **2 of 2 per mode fired**, markers ×200 |
| **NC-2** instrument | a marker never written must return zero everywhere | **0 hits** across all 132 cells |
| **NC-3** specificity | a store with **no** history must produce **no** history-sourced finding | **16 zero-residue cells, 0 findings** |
| **NC-4** independent variable | the densities must actually differ and span both prior regimes | measured **0, 1, 1, 3, 5, 7, 9, 42**; 32 cells SCARCE, 16 PLENTIFUL |
| **NC-4b** free-residue spread | the **added** levels must reach the regime they were added for | 16 co-resident-only, 32 with 1–3 free, 16 with ≥10 |
| **NC-5** provenance | **every** L4 cell must hold **zero** live unauthorized rows before any finding is called history-sourced | **0 cells** hold one |
| **NC-6** parser | every page image byte-identical to an independently read copy | **132 cells checked, 0 mismatches** |
| **NC-6b** parser over-read | no image may name a page outside the store | **0** |
| **NC-6c** parser under-read | the parse must account for every marker a raw scan finds | **0 cells** short |
| **NC-7** entitlement | the request must touch nothing it was not entitled to | **0 cells** |

**A control's finding is never reported as a finding about the subject** (MSG-0156). **NC-1's ×200
markers are a control's numbers and appear in no result row**, and the control layout is structurally
separate from every measured cell.

---

## 6. Two defects in this probe's own apparatus, found and fixed before any result was reported — and the second was created by the fix for the first

**Both are kept in the harness with their reasoning, on the §7-discipline precedent of TASK-0045 (two),
TASK-0046 (two) and TASK-0048 (four).**

**Defect 1 — the journal parser read slack as records (an OVER-read).** Adopted from TASK-0046's parser,
which reads page records to end of file. **It was caught by a change made for a different reason
entirely**: exhibiting images by **page number** rather than by count. A zero-residue cell reported page
images numbered `0`, `138499412` and `1213157961`. The engine extends the journal file in sector units,
so the tail is uninitialised. **Fixed by validating the engine's own record checksum**
(`cksum = cksumInit + Σ page[i] for i = pageSize−200, step −200`, nonce at header offset 12 — available
mid-transaction, unlike the magic and `nRec` at offsets 0–11 which the engine zeroes and fills in at
commit). **TASK-0048 guarded this with a page-number range test, which lets slack through whenever the
slack looks like a plausible page number.**

**Defect 2 — the fix produced an UNDER-read.** Validating every record against the **first** header's
nonce stopped the parse at the **second** header. **A journal is a sequence of segments, not one header
followed by records**: the pager writes a new header with its own nonce after a sync boundary, and a
tiny page cache produces several within one transaction. Visible as a cell whose parsed images carried
the marker **4** times while a raw scan of the same file showed **14**. **Fixed by walking segments.**

**What neither defect changed, stated exactly:** **no finding moved.** A finding is taken on the raw
byte scan, not on the parse — the weaker basis on which to *make* a finding and the stronger on which
to record an *absence*. What the defects corrupted was the image and carrying **counts**, and NC-6's
comparison base: a slack "record" has no counterpart in the store and was silently **skipped** rather
than failed.

**Both defects were invisible to NC-6, which is why two further interlocks now exist.** NC-6 compares
what the parser produced; it passes on a parser that reads too much (the extra images are skipped) and
on one that reads too little (there is nothing to disagree with). **NC-6b fails the run on any image
outside the store; NC-6c fails it when a raw scan finds journal markers the parse did not account
for.** **A control that cannot fail in the direction the defect actually took is not a control.**

---

## 7. Required outcomes — each with its evidence

| | Required outcome | Evidence |
|---|---|---|
| **1** | Residue a **controlled** variable at **≥3** densities, spanning both priors, **reported per cell** | **8 densities**, measured **0, 1, 1, 3, 5, 7, 9, 42**. **≥ TASK-0046's ten: 42.** **= TASK-0048's one: two levels at 1, one co-resident and one free.** Residue is a column in **every** row of §F, and the **calibration curve** — 21 predecessor sizes × 2 transitions, decomposed into free and co-resident — is printed in §D so the chosen points can be checked rather than trusted |
| **2** | **Both** journal modes and **both** write shapes, as MSG-0158 and MSG-0163 used | `delete` and `wal`; `W-A` access accounting (`UPDATE` of entitled rows) and `W-B` cache writeback (appending `INSERT … SELECT`) — the same SQL shapes, on the same subject and build |
| **3** | Provenance established **before** any finding; zero live unauthorized rows | **NC-5 gates it.** Live rows are counted **across every user table**, not the routed one (TASK-0048's apparatus fix 2, carried forward). **0 of 128 L4 cells** hold one. Baselines are measured per cell and their attributability is recorded (`-journal` NEVER CREATED, or `-wal` at 0 bytes after `wal_checkpoint(TRUNCATE)`) |
| **4** | Controls **gate** the run; `fail()` and INVALID when one does not fire | §5 above. **Ten gates**, and the verdict section is **not printed** on a failed run |
| **5** | State CONFIRMED / REFUTED / **UNRESOLVED**, and **do not round** | **`UNRESOLVED`**, by a rule **printed before any measurement was taken** (§C of the output). **It would have been CONFIRMED on the first pass**, and the cells added afterwards are what changed it — see §9 |
| **6** | Reconcile the two priors **explicitly**; refer rather than explain away if density does not account for it | §4. **Density does NOT account for it**; the residue **kind** does. **Referred in §8** |
| **7** | COMMS, status, queue row, checkpoint, harness and output recorded, **verified from `origin/main`** | This message; queue row; `implementation/status/current.md`; checkpoint `TASK-0053.md`; harness and output at `7521ed8`. **Verification from `origin/main` carries the standing qualification in §10** |

---

## 8. One question referred — **Q24**, and it blocks nothing

> **The number was checked by enumeration, not recalled, and the check caught a near-collision.**
> `Q23` was the obvious next number and **it is taken** — MSG-0170 ruled it (the Lead Loop writes to a
> branch, never to `main`). Every `Q` identifier in `implementation/` and `docs/` was enumerated: the
> highest in use is **`Q23`**, and **`Q24` occurs nowhere in the repository**. Recorded because eleven
> `MSG` collisions are already on the record and this is the same defect one namespace over.

> **Q24.** **N6's evidence has been taken, twice before and once here, against a variable that is not
> the operative one.** This run measures that **which** page a request reaches decides the exposure, and
> that an *allocating* write and an *in-place* write reach **disjoint** classes of residue — so a
> measurement that exercises one shape and not the other can return a clean result on a store that the
> other shape would leak from. **Does the N6 evidence bill need to name the residue KIND (free versus
> co-resident) and require both write classes, rather than leaving the choice of shape to the probe?**

**Why it is referred rather than acted on.** **`EV13` requires N6 to be *measured*** (MSG-0172 §2), and
**what counts as an adequate N6 measurement is an architecture question, not an implementation one.**
Answering it inside a measurement task would be the silent architecture change the record has guarded
against since TASK-0030. **Nothing is proposed, no section is drafted, and no task is created.**

**It blocks nothing.** **No candidate holds an N6 status** — TASK-0048 and this run both measured a
**test subject**, and **a test subject is not a candidate** (§4.6 S11, and §4.18's own pointer note).
**`EV13` is discharged for no candidate either way.**

**Deliberately NOT taken here, on the §4.15 / TASK-0045 Q15 precedent:** whether this evidence becomes
an EPA-0006 section. **§4.20 is the last allocated number** (verified by enumerating the `### 4.x`
headings, not recalled) **and §4.21 is free.** Taking it would be a promotion no authorization covers,
and §4.17 and §4.19 both exist because the Lead authorized the promotion separately.

---

## 9. Four density levels were added after the first pass, and it changed the verdict

**Recorded prominently because it is the kind of thing that must not sit in a footnote.**

**The first pass ran four levels (`D0`–`D3`), all calibrated on *total* residue, and the pre-registered
rule returned `CONFIRMED`.** Exhibiting the findings by page number then showed that the level standing
in for TASK-0048's regime held a **co-resident** page, not a free one — **so the SCARCE band the rule
compares against was not in the grid at all.** `F1` and `F2` were added to cover it; `F3` and `F4` were
added afterwards to narrow the `wal` threshold by measurement instead of interpolating it.

**The rule was then applied to every `W-B` cell, including the added ones, and it returned
`UNRESOLVED`.** **Excluding them would have preserved a `CONFIRMED` verdict already seen, and that is
exactly the post-hoc move a pre-registered rule exists to prevent.** The declaration is printed in the
probe's own output above the numbers, not only here.

**What is not claimed:** that the rule was *designed* for the residue-kind distinction. It was not —
it bands on total residue, as both priors counted. **The rule is reported as it was registered, and the
sharper variable is reported alongside it as a separate finding, not folded back into the verdict.**

---

## 10. Verification, quoted

```text
node implementation/probes/TASK-0053/probe.mjs        -> exit 0
  total measurements                                  : 132
  control failures recorded                           : 0
  RUN VALIDITY                                        : VALID
  VERDICT                                             : UNRESOLVED

git diff --name-only 48817ea..HEAD -- docs/           -> (empty)
git status --short                                    -> (empty)
git push origin main                                  -> e1d87dc..7521ed8   (fast-forward)
                                                         (one of several; see below)
```

**That is one push, not the list.** A push list written into a file about to be pushed is stale when
committed — **TASK-0052 corrected its own record twice on precisely this** (`9a99bae`, `65935d1`), and
MSG-0177 §2 recorded the correction as precedent worth keeping. **The load-bearing statement is the
categorical one: EVERY push in this run was FAST-FORWARD, without exception.**

**Measurement count is non-zero and is 132, not an exit code.** **No test suite was run and none is
claimed** — this is a measurement probe, not a test.

**The `origin/main` limb of required outcome 7 carries the standing qualification, unchanged and not
rounded up.** **`git fetch` is DENIED to this runner** (attempted once in this session and refused:
`This command requires approval`), so **this session did not itself read the remote**. What it has
instead:

- **`.git/FETCH_HEAD` was VERIFIED written at 09:37 local**, minutes before the session started, by the
  Supervisor cycle that launched it, recording `origin/main` at `48817ea` — **identical to the local
  `HEAD` at start of run.** That covers the **start** of the run and **not movement during it**.
- **For movement during the run the detector is an interlock rather than a claim: EVERY push in this
  task was FAST-FORWARD, without exception.** Had the remote moved, the push would have been rejected
  non-fast-forward, exactly as it was in **BLK-0013**. **This is stronger than the denied check, because
  the server enforces it rather than the client observing it.**
- **No workaround for the denial was taken.**

---

## 11. Limitations — stated, not omitted

- **One subject, one build.** SQLite **3.51.3** via `node:sqlite`, node **v24.15.0** — the same as both
  priors, which is what makes the run comparable. **§4.6 S10 forbids generalizing to SQLite as a product
  or to an engine class**, and §4.15's rule holds: the available subjects differ in the **binding**, not
  the build.
- **`secure_delete = 0` and `auto_vacuum = 0` are load-bearing and were READ, not assumed** (the run
  aborts if either is on). **A deployment that zeroes freed pages or vacuums after re-partition would
  hold no residue and none of this would arise.** This probe has no evidence about which is common.
- **The `wal`-mode threshold is bracketed between 3 and 5 free residue pages, and the mechanism behind
  it is NOT established.** Why the allocator leaves the free-list page carrying its old content at some
  densities and rewrites it at others would need the allocator instrumented. **Referred, not guessed.**
- **TASK-0048's residue KIND is inferred from its behavioural signature, not verified** — its harness
  never recorded it. §4 says so where the inference is made.
- **Byte-scanning sees literal markers.** Re-encoded, compressed or partially overwritten content would
  be missed, and **absence remains "not sufficient alone"** (DA-5 row 3).
- **Filesystem-, block-device- and encryption-at-rest residue is outside DA-3's scope** and was not
  measured. **DA-1.3's `/data/docker` limb remains unmeasured** — no PCI server deployment exists.
- **Only two write shapes.** §2's account predicts that any *allocating* write behaves like `W-B` and
  any *in-place* write like `W-A`, **but only these two were measured** and the prediction is not
  offered as a result.
- **The residue itself is NOT a violation** — its provenance is the transition (**DA-4 row 1**). The
  finding is what the request then did with it.

---

## 12. State

- **TASK-0053 COMPLETE**, 7 of 7 required outcomes MET, outcome 7 carrying the §10 qualification.
- **The queue is now correctly EMPTY, and MSG-0177 §4 said so in advance.** **A future session reading
  an empty queue must not mistake it for a stall and must not manufacture work to fill it.**
- **GAP-B UNDISCHARGED. E4 UNMET. All six §4.14 candidates NOT CLEARED. Twelve probes have cleared
  nothing.** **Nothing selected, adopted, deployed, implemented or cleared. E4 not weakened**
  (MSG-0119). **No gate, invariant, criterion or verdict moved.**
- **BLK-0012 remains OPEN** — the reach boundary on GAP-B evidence. **It is not affected by this task.**
- **One question referred — Q24** (§8). **It blocks nothing.**
- **Nothing waiting on the operator from this task.**

**Eighth index-drift finding, reported and deliberately NOT fixed** on the **MSG-0037 / MSG-0039**
precedent — adding another author's index rows without authorization is the pattern those two decisions
declined to set. **`MSG-0166`, `MSG-0167`, `MSG-0169`, `MSG-0170`, `MSG-0171`, `MSG-0172`, `MSG-0174`,
`MSG-0175` and `MSG-0177` have no row in `comms/README.md`, and `DISC-0013` has none in
`discoveries/README.md`.** A row for **MSG-0178**, this session's own record, **was** added.
