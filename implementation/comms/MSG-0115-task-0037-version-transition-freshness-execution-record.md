# MSG-0115 — TASK-0037 Execution Record: Version-Transition Freshness and Stale-Version Fail-Closed Evidence

**Status:** **OPEN** — informational execution record; three non-blocking questions referred
**Raised:** 2026-08-23
**Raised by:** Claude Code (supervisor-started session, `runner.lock` pid 27556, acquired 2026-08-23T18:57:17Z)
**Type:** Evidence probe execution record
**Authority:** **MSG-0113 §2–§5** | **Related:** MSG-0114 (reconciliation), MSG-0112 (Q7 referral),
MSG-0109 (TASK-0035 evidence), MSG-0104 (TASK-0033 evidence), EPA-0006 §4.6/§4.8/§4.9,
ADR-0018 §1/§2/§4/§5, ADR-0020 §1/§2/§3, ADR-0017 §5

---

## 1. What ran, and what it is not

**A probe was built and executed.** Harness at `implementation/probes/TASK-0037/probe.mjs` (958 lines),
captured output at `implementation/probes/TASK-0037/probe-output.txt` (541 lines), both committed as
re-readable evidence.

**264 measured cases**: **8 designs × 11 scenarios × 3 collection sizes**, minus the one
design/scenario pair that is not applicable (A0 has no materialised structure, so no staleness bound
applies to it). Each case ran at **two instrument placements**, so **528 answer-path executions**.

**It is not a re-run of TASK-0033 or TASK-0035.** Those harnesses were **not modified and not
executed**; `implementation/probes/TASK-0033/` and `implementation/probes/TASK-0035/` never appeared
in `git status`. Their evidence and verdicts stand and are reproduced unchanged in §8 below.

**What it reuses from them, as the task section directs:** the instrument-placement discipline
(EPA-0006 §4.6 S5/S7), the mandatory negative control and adversarial precondition (S8), the
five-failure-mode noise cohort, and the I1+I2+I3+I4 partitioned physical design (§4.8). **What is new
is the variable**: the freshness mechanism. The authorization predicate, the physical organisation and
the query are held constant across designs.

**The designs labelled A0…A6 and NC are ARCHITECTURES, not products.** The engine is a **test
subject** (MSG-0101 §3).

## 2. Environment — verified in this session

| Capability | Command | Result |
|---|---|---|
| Node runtime | `node --version` | **`v24.15.0`** |
| SQLite, embedded | `node -e "…DatabaseSync(':memory:')… sqlite_version()"` | **`3.51.3`** via `node:sqlite` |
| Docker | `docker info` | **`bash: line 1: docker: command not found`** |

The Docker line is the precise observation — **the CLI is not on this runner's PATH**. It is *not* a
claim about whether Docker Desktop is installed or whether its backend would start. **Nothing was
installed and Docker Desktop was not started** (an operator action).

**Consequence:** the only reachable engine is a class **R** member. Classes **S**, **V** and **K**
remain **NOT CLEARED with zero execution evidence** (EPA-0006 §4.6 S9).

**No wall-clock was read and no timing figure was produced anywhere.** The probe's clock is a fixture
integer, which also makes every result deterministic and re-runnable.

## 3. Two terminology reconciliations, taken from the accepted ADRs rather than invented

**These were settled before any code was written, and both move in the strict direction only.**

**3.1 "Revoked" already has an accepted name: WITHDRAWN.** MSG-0113 §1 requires
update/approve/revoke/supersede to be evidenced. **ADR-0018 §2's lifecycle contains no `REVOKED`
state** — the graph is `DRAFT → IN_REVIEW → APPROVED → PUBLISHED → SUPERSEDED` with branches to
`REJECTED` and **`WITHDRAWN`**, and the table records WITHDRAWN as **not answerable**, retrievable
*"Yes, for audit only"*, **"Dropped from the projection"**. **The probe exercises WITHDRAWN** (scenario
S4) rather than inventing a state name the accepted ADR does not carry.

**3.2 "The current approved version" is read as ADR-0018's PUBLISHED and effective version.**
**ADR-0018 §2 separates `APPROVED` from `PUBLISHED` and marks `APPROVED (not yet published/effective)`
as NOT answerable.** Reading MSG-0113's phrase as the ADR's `APPROVED` *state* would license answering
from a version ADR-0018 forbids. The accepted ADR outranks a communication under the CLAUDE.md
authority order, so **the strict reading is taken** and **scenario S1 tests it directly**: V2 moved to
`APPROVED` and not published must not be used, and V1 must remain authoritative.

**Both readings are fail-closed** — each can only withhold an answer, never grant one — **so neither
needs a ruling to operate.** 3.2 is nonetheless referred as **Q10** in §10, because a terminology
mismatch between a ruling and an ADR is worth the Lead's eye.

## 4. Method

**The kernel is the truth and the projection is a copy.** Following **ADR-0020 §2** — *"A chunk's
authorization constraints are exactly those of its document version"* — the fixture stores
authorization facts on the **version**, never on the chunk. A materialised projection denormalises
those facts onto its rows, which is exactly the copy **EPA-0006 §3.3** says can go stale. Ground truth
is computed only from the kernel, at answer time, and is never visible to the design under test.

**The only legitimate way a version changes state is a recorded transition.** A design with an
invalidation hook re-materialises *as part of* that recorded transition (MSG-0113 §2(2)); a design
without one does not.

**Instrumentation.** `probe_seen` counts units the traversal surfaces, at two placements per design —
**inside each routed structure's own scan** and **as an outer conjunct** — with the **maximum reported
as `U`**, treated as a lower bound (§4.6 S7). Kernel reads are counted **at the harness call site** and
reported separately and labelled as such; they are not engine-internal counters.

**Grading is two independent columns, and the distinction matters:**

- **LEAK** — did the answer contain a chunk the kernel does not authorize at answer time? This is the
  security property.
- **OUTCOME** — did the design emit the outcome the accepted architecture requires (an ANSWER from the
  right version, or an **abstention**)? This is the fail-closed property.

**PASS requires both.** A design can be leak-free and still fail, and §5 finding 4 is that case.

**Validity gates, both passed.** The **adversarial precondition** (§4.6 S8) was verified before every
fixture: the unconstrained lexical top-5 returned `ids=[13,14,15,16,17]` with
`authorized-among-them=0` at all three sizes. The **negative control failed as required** — NC leaked a
superseded version in **12 cases** across S4, S6, S7 and S8 — **so the run is valid** rather than
merely green.

> **One fixture defect was found by the probe's own precondition and is recorded rather than fixed
> quietly**, because it is §4.6 S8 earning its place. The first draft expired the
> `expired-effectivity` noise cohort at `T_ORIGIN − 1`, which is **after** the earliest query instant,
> so those chunks were still effective when queried and the precondition correctly declared the run
> **VOID**. The cohort now expires before every query instant. **A fixture that is not adversarial
> proves nothing, and this one said so instead of producing numbers.**

## 5. Results

### 5.1 The grid — identical at all three collection sizes

`.` pass · `L` leaked a version the kernel does not authorize at answer time · `X` wrong outcome
(answered where abstention is required, or answered from the wrong version) · `-` not applicable.

| design | S0 | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | S8b | S9 | |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **A0** | . | . | . | . | . | . | . | . | . | . | - | **10/10** |
| **A1** | . | . | **L** | . | **L** | **L** | **L** | **L** | **L** | **L** | X | **3/11** |
| **A2** | . | . | **L** | . | **L** | **L** | **L** | **L** | **L** | **L** | X | **3/11** |
| **A3** | . | . | . | . | X | . | X | X | X | **L** | X | **5/11** |
| **A4** | . | . | . | . | . | . | . | . | . | . | X | **10/11** |
| **A5** | . | . | . | . | . | . | . | . | . | **L** | X | **9/11** |
| **A6** | . | . | . | . | . | . | . | . | . | . | . | **11/11** |
| **NC** | . | . | . | . | **L** | . | **L** | **L** | **L** | X | X | **5/11** |

**The grid is byte-identical at M=50, M=500 and M=5000.** Freshness behaviour is a property of the
mechanism, not of the collection size — which is worth stating because `U` is *not*, and §5.3 shows it.

| design | |
|---|---|
| **A0** | live kernel-backed store, no projection |
| **A1** | materialised + partitioned, **no version identity**, periodic refresh only |
| **A2** | as A1 **+ version identity** carried in the structure |
| **A3** | as A2 **+ transition-triggered re-materialisation** |
| **A4** | as A3 **+ kernel consult and the ADR-0020 §3 point-2 re-check against the KERNEL** |
| **A5** | as A4 but **the re-check reads the materialised copy** (G-Q5.2b's faked limb) |
| **A6** | as A4 **+ a configured staleness bound** enforced against a clock it does not control |
| **NC** | **NEGATIVE CONTROL** — as A4 but **falls back to the retained prior snapshot** |

| scenario | |
|---|---|
| **S0** | no transition — V1 published and effective |
| **S1** | V2 **APPROVED but not published** (ADR-0018 §2: not answerable) |
| **S2** | V2 **PUBLISHED**, V1 **SUPERSEDED** — queried **before** the periodic timer fires |
| **S3** | the same transition — queried **after** the timer fires (**the naive test**) |
| **S4** | V1 **WITHDRAWN** with no successor |
| **S5** | supersession chain — V2 already current, V3 published and V2 superseded |
| **S6** | V2 published but **its chunks are absent from retrieval** (ingestion lag) |
| **S7** | the same transition, but **the kernel is unreachable** at answer time |
| **S8** | **no version transition** — the kernel's authorization facts for V1 change, **delivered as a recorded transition** |
| **S8b** | the same change, **not wired to the invalidation hook** — the §3 point-2 re-check is the only control left |
| **S9** | no transition — **the clock passes the configured staleness bound** (G-Q5.1c) |

### 5.2 The discriminator MSG-0113 §3 demands

**S2 and S3 are the same recorded transition.** Only the query instant differs.

| design | S2 (timer **not** fired) | S3 (timer fired) | reading |
|---|---|---|---|
| A0 | `ANSWER ["V2"]` | `ANSWER ["V2"]` | correct before the timer could fire |
| **A1** | **`ANSWER ["V1"]` LEAK** | `ANSWER ["V2"]` | **DISCRIMINATED — a fixed-time test alone would have cleared it** |
| **A2** | **`ANSWER ["V1"]` LEAK** | `ANSWER ["V2"]` | **DISCRIMINATED — a fixed-time test alone would have cleared it** |
| A3, A4, A5, A6, NC | `ANSWER ["V2"]` | `ANSWER ["V2"]` | transition-triggered — correct before the timer could fire |

**This is the evidence MSG-0113 §3 asks for**, in the form it asks for it: *"Passing a fixed-time test
alone does not establish the requirement."* A1 and A2 pass S3 and fail S2 — **they were not made
correct by the transition; they were made correct by waiting.**

### 5.3 `U` — unauthorized units examined during retrieval

Maximum over instrument placements. **Two figures are given because one alone would mislead**: the S5
slice, and the maximum over **all** scenarios, which is what decides E2 under §4.6 S3.

| design | S5: M=50 / M=500 / M=5000 | invariant with N | **max over all scenarios** | worst scenario(s) |
|---|---|---|---|---|
| **A0** | **58 / 508 / 5008** | **NO — grows with N** | **62 / 512 / 5012** | S8, S8b |
| **A1** | 4 / 4 / 4 | yes | **4 / 4 / 4** | S2, S4, S5, S6, S7, S8, S8b |
| **A2** | 4 / 4 / 4 | yes | **4 / 4 / 4** | S2, S4, S5, S6, S7, S8, S8b |
| **A3** | 0 / 0 / 0 | yes | **4 / 4 / 4** | S8b |
| **A4** | 0 / 0 / 0 | yes | **4 / 4 / 4** | S8b |
| **A5** | 0 / 0 / 0 | yes | **4 / 4 / 4** | S8b |
| **A6** | 0 / 0 / 0 | yes | **4 / 4 / 4** | S8b |
| **NC** | 0 / 0 / 0 | yes | **4 / 4 / 4** | S4, S6, S7, S8, S8b |

**No design reached `U` = 0 across all scenarios.** Every materialisation instant is recorded per case
in the probe output, as **G-Q5.1d** requires.

### 5.4 Kernel reads during the answer path

Counted at the harness call site, S5, maximum over placements.

| design | M=50 / M=500 / M=5000 | invariant with N |
|---|---|---|
| A0, A4, A6, NC | **9 / 9 / 9** | **yes** |
| A5 | 1 / 1 / 1 | yes |
| A1, A2, A3 | 0 / 0 / 0 | yes |

**The re-check's cost against the authoritative record is bounded by `k`, not by the collection** — one
read to resolve the current version, then two per hit. **That is a measurement, not an estimate**, and
it bears on Q8 in §10.

### 5.5 E1 — the plans actually used

| design | plan (first rows) |
|---|---|
| **A0** | `SCAN c` · `SEARCH v USING INDEX sqlite_autoindex_k_version_1 (version_id=?)` · `SEARCH a EXISTS USING COVERING INDEX i_kaud (…)` |
| A1…NC | `CO-ROUTINE x` · `COMPOUND QUERY` · `SCAN p_org_a_internal_published_staff` · `UNION ALL` · `SCAN p_org_a_internal_published_all_employees` |

**A0's `SCAN c` is disqualifying on its own under §4.6 S6/E1** — a scan over a store that spans
authorization scopes — **regardless of any counter**, and its `U` figures confirm it independently.

## 6. Findings

**F1 — The discriminator worked, and it separated exactly the two designs it was built to separate.**
§5.2. Had the probe tested only after the timer, A1 and A2 would have looked correct. **A fixture that
does not separate the two proves nothing however many cases it runs**, and this one separates them at
every collection size.

**F2 — Version identity is necessary and nowhere near sufficient.** **A1 and A2 differ in exactly one
property** — whether the structure carries version identity — **and their grids are identical, 3/11
each, leaking in the same seven scenarios.** MSG-0113 §2(6) is a real requirement, but the work is done
by §2(2) and §2(3): something must consult the authoritative record. **A further consequence worth
stating:** A1 **cannot report which version it answered from**. The harness can, because it holds the
fixture; the design cannot, because it carries nothing to report. **A design that cannot name its own
answer's version cannot satisfy §2(6) and cannot produce ADR-0018 §1's citation either** — *"A citation
names a document version, never a document."*

**F3 — The faked re-check is a no-op, now demonstrated rather than predicted.** A4 and A5 differ only
in what the re-check reads. On **S8b**: A4 traces `re-check(kernel) kept 0/4` and **abstains**; A5
traces `re-check(self) kept 4/4` and **returns four chunks of a version the kernel had reclassified
RESTRICTED**. **Same structures, same plan, same `U` = 4.** EPA-0006 §4.9 **G-Q5.2b** called this *"the
limb most easily faked and the one that matters"* on the strength of TASK-0035's P4S; **it is now
demonstrated directly.** **G-Q5.2c is satisfied for the first time in this repository** — the re-check
was observed to **REJECT**, not merely to execute.

**F4 — "Answered nothing" is not "abstained", and A3 is the design that shows it.** A3 has the
transition hook but consults nothing at answer time. On **S4, S6 and S8** it returns an **ANSWER
containing zero chunks** — trace `routed set is empty` — which to the employee is indistinguishable
from *"no approved policy covers this"*. **It leaks nothing in those cases and is still wrong:**
ADR-0017 §5 makes abstention a **first-class, audited outcome** classified A1–A7, and an empty answer
is none of the seven. **And on S7 — the kernel unreachable — A3 answers correctly by luck**, because
its hook had already fired; it cannot know that, because it never asks. **MSG-0113 §1 requires
abstention when the current version *cannot be established*, not merely when it is established to be
missing.**

**F5 — No design reached `U` = 0, and the two failure routes differ in kind.** A0 fails by scanning the
collection — `U` **grows with N**, 62 / 512 / 5012. Every materialised design fails by holding a
**stale copy** — `U` = 4, **invariant with N**. **Invariance with N is necessary and not sufficient;
§4.6 S3's bar is zero**, and a design can be perfectly invariant and still fail it.

**F6 — The most consequential finding: `U` cannot distinguish a leaking design from a conservative
one.** **A4 and A5 both report `U` = 4 at every collection size, with identical plans and identical
structures. One abstains; the other returns four unauthorized chunks.** The counter is blind to the
difference the employee would actually experience. **This extends §4.6 S5's asymmetry rule in a
direction it did not state:** the rule warns that a *zero* count can be an artefact of placement; this
shows that a *non-zero* count identical between two designs can conceal **opposite** security
outcomes. **Clearance can therefore never rest on `U` alone** — which is what §4.6 S6 already requires,
here corroborated by measurement rather than argued.

**F7 — "`U` = 0 is a property of an instant, not of a design" is not only about time.** EPA-0006 §4.8
finding 3 established that for **effectivity decay**, where a clock moves. **In S8b no time passes at
all** — an authorization attribute changes in the kernel, and the routed structures immediately hold
four rows that are unauthorized at answer time. **There is no timer that would have caught it**, which
is precisely why MSG-0113 replaced the elapsed-time question rather than answering it. This
**corroborates §4.8 finding 1** — *"`U` equals the number of unauthorized rows the routed structures
still contain"* — in a second, independent fixture and for a different cause. **Whether an in-query
join against the kernel would change this was NOT measured**, and no claim is made about it.

**F8 — A transition-triggered hook is only as complete as the set of changes it is wired to.** S8 and
S8b are **the same authorization change**. Delivered as a recorded transition (S8) every hooked design
is saved by re-materialisation and **A5's faked re-check is never tested**; delivered as an attribute
reassignment the hook does not observe (S8b), **only the designs that re-check against the kernel
survive**. **MSG-0113 §2(2) and §2(5) are therefore not alternatives**, and a record that tested only
S8 would have reported A5 as equal to A4.

**F9 — A6 satisfies both G-Q5 conditions and is still NOT CLEARED.** This is §4.9's *"necessary, never
sufficient"* structure demonstrated in practice rather than asserted. See §7.

## 7. Verdicts — this probe's candidates

**Vocabulary unchanged from EPA-0006 §4.6 S9 / MSG-0101 §2. Unobtainable evidence is NOT CLEARED,
never assumed conformance.**

| Candidate | **Verdict** | Decided by |
|---|---|---|
| **A0** — live kernel-backed store | **NOT CLEARED** | **E1 fails**: `SCAN c` over a store spanning authorization scopes, disqualifying regardless of any counter. **E2 fails**: `U` grows with `N` — 62 / 512 / 5012. **E4 not obtained.** Its freshness behaviour is faultless (10/10) and that clears nothing |
| **A1** — no version identity, periodic only | **NOT CLEARED** | Returned a **superseded version** in 7 scenarios; **fails the discriminator** (S2); `U` = 4 > 0; cannot name the version it answered from |
| **A2** — version identity, periodic only | **NOT CLEARED** | **Identical grid to A1.** Version identity alone changed no outcome |
| **A3** — transition hook, no re-check | **NOT CLEARED** | **Leaks on S8b**; answers where abstention is required on S4, S6, S7, S8, S9; `U` = 4 > 0 |
| **A4** — transition hook + kernel re-check | **NOT CLEARED** | **G-Q5 condition 2 demonstrated in both limbs** (G-Q5.2b and, for the first time, **G-Q5.2c**). **G-Q5 condition 1 NOT demonstrated** — no bound configured, fails S9. `U` = 4 > 0 (**E2 fails**). **E4 not obtained. G-Q4 not measured** |
| **A5** — transition hook + **self** re-check | **NOT CLEARED** | **Fails G-Q5.2b and G-Q5.2c by demonstration** — the re-check kept 4/4 rows the kernel had made unauthorized and the design returned them |
| **A6** — A4 + configured staleness bound | **NOT CLEARED** | **The first design in this repository to satisfy BOTH G-Q5 conditions** — bound exists, is enforced against a clock it does not control, and its breach triggered **abstention A7** (S9, trace `staleness 900 > bound 600`); re-check demonstrated to reject (S8b). **Still NOT CLEARED**: `U` = 4 > 0 in S8b (**E2 fails**), **E4 not obtained**, **G-Q4 not measured** |
| **NC** — negative control | **DISQUALIFIED** | Returned a superseded version in **12 cases** across S4, S6, S7, S8. **The control failed as required, so the run is valid** (§4.6 S8) |

**Nothing is CLEARED.** **No engine, runtime, provider, model, index technology or physical
implementation was selected, adopted, recommended, installed or deployed.**

> **A6 is the row most open to misreading and it is worth being blunt.** An 11/11 grid is a **freshness**
> result. **G-Q5 is a prerequisite, not a clearance** (EPA-0006 §4.9), and A6 fails the clearance bar on
> **E2** with a measured non-zero `U`, has **no E4 evidence at all**, and was **never measured for
> G-Q4**. A record that reported "A6 passes everything" would be true about the grid and false about
> the verdict.

## 8. Existing verdicts, reproduced unchanged (acceptance criterion 6)

**Reproduced verbatim from MSG-0112 §6, which reproduced them from MSG-0109 and MSG-0104. Nothing is
relabelled, softened, or re-presented as conformance. This task altered no verdict. No figure in the
two tables below is new — none of it was re-measured, because neither prior probe was re-run.**

### 8.1 The nine MSG-0104 verdicts

| Subject | Verdict | Decided at | Reason |
|---|---|---|---|
| **SQLite 3.51.3 — C1**, relational scalar | **NOT CLEARED** | **Tier 3** | Tier 1 and Tier 2 both pass; Tier 3 shows unauthorized rows examined scaling with the collection (1000 at M=5000, covering index). Strict Shape 1 not demonstrated |
| **SQLite 3.51.3 — C2**, FTS5 natural form | **NOT CLEARED** | **Tier 3** | As C1, **plus a measurement gap**: the FTS5 traversal cannot accept the authorization predicate into its own index — the join applies it outside — and **whether unauthorized content is traversed inside FTS5 was NOT MEASURED** (§5.3) |
| **SQLite 3.51.3 — C3**, FTS5 authorization-first join | **NOT CLEARED** | **Tier 3** | As C2. Forcing join order **did not** eliminate the residual, and does not close the FTS5 measurement gap |
| **NC — application post-filter** (class **D**) | **DISQUALIFIED** | **Tier 2** | Failed k-completeness at M=500 and M=5000; result set not invariant; materialized every unauthorized body. **Demonstrated, not merely argued** |
| **Class S** — search engines | **NOT CLEARED** | — | **No execution evidence: no engine reachable.** MSG-0101 §2: inability to obtain evidence is NOT CLEARED, never conformance |
| **Class V** — vector stores | **NOT CLEARED** | — | As S. Criterion 6's strategy-switching case is **untestable here** — SQLite has no approximate vector index, which is the property that produces switching |
| **Class K** — kernel store | **NOT CLEARED** | — | No PostgreSQL on this host. EPA-0006 §4.3 argues it conforms *structurally*; **that is a documentary argument and this probe produced no execution evidence for it** |
| **Class L** — lexical-only | **NOT CLEARED** | Tier 3 | Exercised only as FTS5 inside the class-R subject. ADR-0020 §7's hybrid requirement keeps it insufficient alone regardless |
| **Class H** — hosted / managed | **DISQUALIFIED** | not tested; none needed | ADR-0022 §1 — derived embeddings must not leave the host. Independent of filter shape |

### 8.2 The eight TASK-0035 isolation-design verdicts

| Design | Patterns | M=50 | M=500 | M=5000 | **Verdict (unchanged)** |
|---|---|---|---|---|---|
| **P0** | I0 | 20 | 200 | 2000 | **NOT CLEARED** |
| **P1** | I1 | **40** | **400** | **4000** | **NOT CLEARED** |
| **P2** | I1+I2 | 20 | 200 | 2000 | **NOT CLEARED** |
| **P3** | I1+I2+I3 | 10 | 100 | 1000 | **NOT CLEARED** |
| **P4** | +I4 | **0** | **0** | **0** | **NOT CLEARED** — E4 not obtained; zero holds at the materialisation instant only |
| **P5** | P4+I6 | **0** | **0** | **0** | **NOT CLEARED** — E3 argued from construction, not instrumented |
| **P4S** | P4 after the clock moved | 5 | 50 | 500 | **NOT CLEARED** — and it **returned** unauthorized rows |
| **NC** | negative control | 50 | 500 | 5000 | **DISQUALIFIED** — the control fails, so the run is valid |

**How this task's evidence relates to P4S without altering it.** P4S leaked because **a clock moved**.
**S8b leaks with no elapsed time at all.** The two are different causes of the same class of failure,
and **F7 records that as an extension of §4.8 finding 3, not a correction of it.** **P4S's numbers are
untouched.**

## 9. MSG-0113 §3 evidence items — item by item

| # | Required evidence | Status | Where |
|---|---|---|---|
| **1** | an approved-version transition V1 → V2 | **DEMONSTRATED** | S2/S3 record a publish/supersede transition; S1 records approve-without-publish |
| **2** | V1 is usable **before** the transition | **DEMONSTRATED** | **S0 — all 8 designs pass at all 3 sizes** |
| **3** | after the transition is recorded, V1 is **not** usable | **DEMONSTRATED, and it discriminates** | S2 — A3…NC pass; **A1 and A2 return V1** |
| **4** | V2 is used when available | **DEMONSTRATED** | S2/S3 — 6 of 8 designs return `["V2"]` before the timer fires |
| **5** | if V2 is unavailable, retrieval/answering **abstains** | **DEMONSTRATED, and it discriminates three ways** | S6 — A0/A4/A5/A6 abstain **A7**; **A1/A2/NC return V1**; **A3 answers empty**, which is not an abstention (F4) |
| **6** | revocation and supersession exercise the same fail-closed behaviour | **DEMONSTRATED** | **S4 (WITHDRAWN)** and **S5 (supersession chain V2→V3)**, with the same pass/fail pattern as S6 |
| **7** | the kernel re-check observes the authoritative lifecycle/version state | **DEMONSTRATED — and demonstrated to REJECT** | **S8b**: A4/A6 `kept 0/4` → abstain; **A5 `kept 4/4` → leak.** This is **G-Q5.2c** satisfied |
| **8** | a materialised/partitioned index does not permit stale V1 use after the transition | **DEMONSTRATED for A3…A6; DISPROVED for A1/A2** | S2 against the I1+I2+I3+I4 projection. **The projection alone does not deliver it** — the mechanism does |

**Additionally demonstrated, beyond the eight:** **G-Q5.1a/b/c** — A6 exhibits a configured bound,
enforced against a clock it does not control, whose breach produced **abstention A7 and no answer**
(S9). **G-Q5.1d** — every `U` figure in the probe output carries its materialisation instant.

**Explicitly NOT demonstrated, and recorded as such rather than omitted:**

- **G-Q4 (routing) was NOT MEASURED.** Routing is *computed* by exact key from the subject's
  entitlements and no catalogue is scanned, but **the routing step was not instrumented**, so under
  **G-Q4.4** this probe has not measured the gate and says so. Unchanged from TASK-0035.
- **E4 (log inspection) was NOT obtained** for any design.
- **E3** does not arise — every design here is purely relational with no opaque stage.
- **Classes S, V and K** have **no execution evidence** and are untouched by this probe.

## 10. Questions referred — three, and none blocks anything

**Numbering:** EPA-0006 §4.7 holds **Q1–Q3**; MSG-0109 raised **Q4–Q6** (ruled by MSG-0110); MSG-0112
raised **Q7** (ruled by MSG-0113). **Q8 is the next free number**, allocated here and verified unused.

### Q8 — Does the mandatory ADR-0020 §3 point-2 re-check itself count as "examination" under strict Shape-1?

**The tension is real and this probe measured both sides of it.** ADR-0020 §3 point 2 **requires** that
*"every hit is re-authorized against its version's classification and audience"*. To do that against
the kernel, the design must read the kernel's record **for candidates that turn out to be
unauthorized** — A4 and A6 read **9 kernel units** per answer at every collection size (§5.4). Under
§4.6 S4's strict default those reads are units examined.

**Fail-closed default taken, and it needs no ruling to operate:** they are counted and reported
separately, as the probe does. **It blocks nothing** — every design is already NOT CLEARED on
independent grounds. **It becomes decisive only if a future design ever reaches `U` = 0 in retrieval**,
at which point the mandatory re-check would be the only remaining source of examination. **The measured
fact that bears on the ruling:** the re-check's kernel reads are **bounded by `k` and invariant with
`N`** — one to resolve the current version, two per hit — so whatever is ruled, this is not a
collection-scale exposure.

### Q9 — a sharpening of §4.7 Q3, not a new question

§4.7 **Q3** already asks what the architectural response is *"if no engine class can reach zero."*
**This probe adds evidence that narrows it:** every materialised design examined unauthorized rows
**whenever its copy diverged from the kernel in any respect**, and **S8b shows divergence can occur
with zero elapsed time**. If that generalises, strict Shape-1 and ADR-0020 §1's projection architecture
may be jointly satisfiable only by a projection that **cannot** diverge — **a claim about architecture,
not about engines**, and one this probe has **not** established.

**Relaxing the bar is explicitly NOT proposed.** MSG-0105 §3 forbids weakening AMD-01, and a criterion
loosened whenever nothing passes it is not a criterion. **Recorded as input to Q3, not as an answer to
it.**

### Q10 — MSG-0113's "current approved version" versus ADR-0018's APPROVED/PUBLISHED distinction

Stated in §3.2. **The strict reading was taken and is fail-closed**, so this needs no ruling to
operate. It is referred because a terminology mismatch between a ruling and an accepted ADR is worth
correcting in the record rather than in each reader's head. **If the Lead intends the looser reading,
that is an ADR-0018 question, not an evidence-instrument one.**

## 11. Acceptance criteria — mapped to evidence

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | Each of the eight §3 evidence items demonstrated or explicitly recorded as not demonstrated | **MET** | **§9** — all eight demonstrated; four further items recorded as **not** demonstrated |
| 2 | Transition-triggered freshness distinguished from periodic re-materialisation, with the fixture design showing how | **MET** | **§5.2** — S2/S3 are the same transition at two instants; A1/A2 discriminated at all three sizes |
| 3 | The abstention case exercised — V2 unavailable must not fall back to V1 | **MET** | **S6** — and NC's fallback **leaked V1**, which is the control failing as required |
| 4 | Revocation and supersession tested, not only update | **MET** | **S4 (WITHDRAWN)**, **S5 (supersession chain)**; S1 additionally covers approve-without-publish |
| 5 | Per candidate CLEARED / NOT CLEARED / DISQUALIFIED with the evidence that decided it; unobtainable evidence is NOT CLEARED | **MET** | **§7** — 7 NOT CLEARED, 1 DISQUALIFIED, **none CLEARED** |
| 6 | All existing verdicts reproduced unchanged | **MET** | **§8** — nine MSG-0104 and eight TASK-0035 verdicts, verbatim; no figure re-measured |
| 7 | No accepted ADR modified — `git diff --name-only docs/` empty | **MET** | verified before commit; quoted in §12 |
| 8 | COMMS, queue and status reconciled; stop at evidence and clearance status | **MET** | this record; queue board row 49 and the TASK-0037 section; `implementation/status/current.md`; **no next task marked READY** |

## 12. Boundaries held

```text
git diff --name-only docs/    -> (empty)
git status --porcelain        -> (empty, after commit)
```

- **No accepted ADR was created, amended or proposed** — ADR-0018, ADR-0019, ADR-0020 included.
- **No retrieval engine, runtime, provider, model, index technology or physical implementation was
  selected, adopted, recommended, installed or deployed.**
- **No numeric staleness threshold was introduced.** A6's bound is a **fixture constant**, exhibited
  because **G-Q5.1a** requires a bound to exist and be shown; **its magnitude is not judged, proposed
  or recommended**, exactly as that gate states. **G-Q5 received no numeric threshold.**
- **Strict Shape-1 remains "examines nothing unauthorized."** Nothing here weakens it; F5–F7 make it
  harder to satisfy, not easier.
- **No real or confidential corpus was entered.** Fixtures are synthetic and generated in-process; no
  file was written outside the repository; no network was reached; **nothing was installed** and
  **Docker Desktop was not started**.
- **TASK-0033 and TASK-0035 harnesses were not modified and not re-run.**
- **No benchmark, latency, capacity, throughput or recall figure appears anywhere.** Every number in
  this record is a **count** produced by an instrument whose placement is recorded.
- **No implementation task is READY**, and no ADR-0019 normalization rule was written or inferred.

## 13. State

- **TASK-0037 is COMPLETE** — 8/8 acceptance criteria MET, mapped in §11.
- **Nothing is CLEARED.** Seven designs **NOT CLEARED**, one **DISQUALIFIED**.
- **Q7 is discharged** — MSG-0113 resolved it and this task produced the evidence it authorized.
- **Q8, Q9 and Q10 are referred and none blocks anything.**
- **The next action is the Architecture Lead's.** MSG-0113 §5 requires stopping at evidence and
  clearance status, and this run stops there.
