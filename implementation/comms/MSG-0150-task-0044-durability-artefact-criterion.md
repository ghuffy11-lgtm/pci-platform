# MSG-0150 — TASK-0044 Execution Record: the Durability-Artefact Criterion (DA-1), and Nothing Measured

**Status:** **OPEN** — record, with **one referral (§7, Q14)**, **not blocking**
**Raised:** 2026-08-25
**Raised by:** Claude Code (supervisor-started session, `runnerPid` 20592, lock acquired 2026-08-24T21:27:18Z)
**Type:** Execution record — criterion definition
**Authority:** **MSG-0148b** AUTHORIZED, with **MSG-0147** binding | **Related:** MSG-0146 §5/§8 R2, MSG-0148a, MSG-0149, EPA-0006 §4.6 S4/S5/S6/S9/S10, §4.13, §9.3, ADR-0020 §1/§6.2

---

## 0. What this task did, and what it deliberately did not

**It wrote a security criterion and measured nothing.** That is not a limitation of the run — it is the
authorization's whole point. **MSG-0148b puts *"combine criterion creation and measurement in the same
task"* in the may-not list**, so a session that produced a single measurement would have exceeded its
authority no matter how good the measurement was.

**Delivered:** **EPA-0006 §4.16 — DA-1**, the durability-artefact criterion, with its scope,
exclusions, evidence semantics, fail-closed interpretation, the two structural choices declared, and
one question referred. **228 insertions / 0 deletions**, one file, additive.

**Not delivered, because forbidden:** any measurement, probe, fixture or harness; any DA-1 verdict about
any candidate; any change to E1–E4 or to any existing gate; any engine comparison or selection.

## 1. Before writing: the check the task section required, and its answer

> *"Check whether a durability-artefact criterion already exists before writing one."* — TASK-0044,
> Recovery procedure

**VERIFIED by search across `docs/` and `implementation/architecture/`** for `durability`,
`write-ahead`, `WAL`, `rollback journal`, `spill file`, `at rest`. **Four hits, none a criterion:**

| Hit | What it is |
|---|---|
| `docs/security/security-architecture.md:16` | *"Encryption in transit and at rest where appropriate"* — a **storage-layer** control, and one of MSG-0148b's named exclusions |
| `EPA-0005:185` | reindex durability as an **availability** concern |
| `EPA-0006:1461` (§4.12) | an **observation** — `:memory:` leaves *"no journal, WAL or engine-written artefact to read"*; why that limb was unreachable, not a rule |
| `EPA-0003:130` | the word *"rests"* in prose |

**No durability-artefact criterion existed. This is creation, not a second statement of an existing
rule** — the drift this record has warned about since TASK-0030. **The two adjacent rules are pointed
at rather than restated:** **§4.6 S4 U5** (content placed in a buffer, cache, temporary structure or log
line **while resolving the query** counts as a unit examined) and **§9.3 / ADR-0020 §6.2** (the logging
prohibition). **Neither reaches content at rest in an engine-written file after the query is over**,
which is the gap MSG-0148a identified and MSG-0148b authorized filling.

## 2. The two structural choices, declared

**MSG-0148b requires both to be stated because either could defensibly have gone the other way.**

**Label — `DA-1`, and deliberately not `E5`.** MSG-0148b forbids changing or extending E1–E4. An
`E`-number would read as a fifth Shape-1 evidence class whatever its text said, and **§4.6 S6's table
is the clearance bar** — adding to it is the forbidden change. **`DA` was verified unused** across
`docs/` and `implementation/architecture/` before allocation; it collides with none of `E1–E4`,
`S1–S11`, `U1–U5`, `G-Q4…G-Q7.8`, `I1–I8`, `N1–N5`, `W1–W4`, `EV1–EV12`, `F1–F16`, `GAP-A…GAP-E`.

**Section — a new `§4.16`, with `§4.15` deliberately left unallocated.** §4.6 was the alternative and
was rejected on §4.6's own words: its preamble says it exists to decide *"whether a candidate satisfies
the Shape-1 gate"*, and **DA-1 is not a Shape-1 question** — housing it there invites exactly the
conflation MSG-0147 ruled against. **The skipped number is deliberate: R1 is OPEN and proposes §4.15
for the TASK-0043 E4 record**, and taking it here would consume, in passing, a slot the Lead's own open
referral has provisionally claimed. **A declared gap costs nothing; a silent renumbering later would.**

## 3. The criterion, in brief — the full text is EPA-0006 §4.16

> **Resolving a retrieval request on behalf of a subject `s` must not cause content that `s` is not
> authorized to receive to be written to, or left readable in, any engine-managed durability or
> persistence artefact.**

| Limb | Prohibits |
|---|---|
| **DA-1.1** | content unauthorized for the requesting subject becoming **durable because that subject's request was resolved** |
| **DA-1.2** | such content **remaining readable** in an engine-managed artefact **after the request completes** |
| **DA-1.3** | an artefact **widening reach or lifetime** beyond what the projection store itself allows — a spill file outside its protection, an artefact surviving teardown, or one outside the governed persistent-state boundary (`/data/docker`, contract v0.2 — **pointed at, not restated**) |

**"Unauthorized" carries §4.6 S4's meaning unchanged.** No new definition of authorization is
introduced, and none may be inferred.

**In scope:** write-ahead logs, rollback/undo journals, shared-memory and index files, temporary and
spill files, and **backups, snapshots or replication streams the engine itself produces**.

**Deliberately out, each with a stated reason:** application logs/telemetry/audit payloads (**§9.3 and
ADR-0020 §6.2 already**), the engine's **execution surface** (**that is E4**), OS page cache,
storage-layer encryption at rest, operator-taken backups and host images, and **the projection's own
at-rest storage of approved corpus content** (**ADR-0020 §1** — with DA-1.3 still applying, and §4 below
being where that boundary actually bites).

## 4. The load-bearing part: **provenance, not presence** (§4.16 DA-4)

**This is what a criterion written after the measurement would most likely have got wrong, and it is
why MSG-0148b ordered them this way.**

A projection index durably holds the corpus it indexes. **Under a single shared projection, every
subject is unauthorized for some of it** — so *"unauthorized-for-`s` bytes exist somewhere in the
engine's files"* is **true by construction for every candidate at every moment**. A criterion phrased as
mere presence would **fail every engine trivially**, tell nobody anything, and be indistinguishable
from one tuned to fail.

**So DA-1 asks about provenance and reach:**

| Provenance | DA-1 |
|---|---|
| written at **ingest**, maintaining the projection of approved content | **not a DA-1.1/DA-1.2 finding**; ADR-0020 §1 governs it; **DA-1.3 still applies** |
| written or retained **because a request was resolved** | **DA-1.1 / DA-1.2 apply** |
| **provenance not established** | **NOT CLEARED** — never *"presumed ingest"* |

**And it connects to §4.13 without adding anything:** where **N1 containment** holds, the two
provenances converge — there is no unauthorized content in the partition to write down. **Under a
single shared projection they do not converge, and that is the whole question.** **This moves no
verdict and adds no gate**; it says which topologies make DA-1 cheap and which make it binding.

## 5. Evidence semantics — §4.6 S9's vocabulary, unchanged

**No new verdict vocabulary was created**, so a later probe cannot invent one.

| Observation | Verdict |
|---|---|
| unauthorized-for-subject content **found** in an in-scope artefact and **attributable to the request** | **NOT CLEARED**, conclusively — **one occurrence suffices** |
| an engine that writes such content **by design**, or whose artefacts are reachable by a **wider principal set** than the projection store | **DISQUALIFIED** — structural, not incidental |
| a scan finding **nothing** | **not sufficient alone** — **§4.6 S5's asymmetry rule transfers intact**: absence proves only what did not cross the point **and the moment** of inspection; artefacts checkpoint, truncate, rotate and get reclaimed |
| absence **plus** evidence the engine could not have written it — **§4.13 N1/N2 containment**, or an enumerated account of every in-scope artefact the request could touch, inspected across the request's whole lifetime including under spill | **DA-1 satisfied** — deliberately the shape of **E1-with-E2-corroborating**, for the same reason |
| provenance **not separable** by available instruments | **NOT CLEARED** |

**Fail-closed (§4.16 DA-6):** **where an in-scope artefact cannot be inspected at all, the verdict is
`NOT CLEARED` — never an inferred pass.** This is §4.6 S9 (*"`NOT CLEARED` is the required answer
wherever evidence is absent"*) and **§4.6 S10's engine-exposure criterion applied to persistence**: an
engine whose durability artefacts cannot be observed **fails the burden**, exactly as one whose opaque
stages cannot be observed fails E3. **Uninspectable is not clean.**

**Two consequences stated so they cannot be read the other way:** **satisfying DA-1 clears nothing** —
it is not in §4.6 S6's table and substitutes for no evidence class — and **DA-1 relaxes nothing**; it
adds a requirement, and **no verdict anywhere in EPA-0006 moves because of it.**

## 6. The TASK-0043 figures — an illustrative SHAPE, and the criterion's answer on it

**Reproduced from MSG-0146 §5. Nothing was re-run, extended or treated as a result.** `-wal` **28872 B,
marker 135 times**; main db **4096 B, absent**; `-shm` **32768 B, absent**; `-journal` **absent**.

**DA-1 classifies it plainly, which is the only test this task could apply to itself:**

1. **The artefacts are in scope** — including the ones where the marker was absent.
2. **The shape alone decides neither DA-1.1 nor DA-1.2**, because **the record does not establish
   provenance**: it does not say whether those 135 occurrences arrived at ingest or because a request
   was resolved. **Naming the missing discriminator is what a criterion is for**, and separating the two
   provenances is the first thing the separately-authorized evidence task must do.
3. **In the absence of that discriminator the answer is `NOT CLEARED`, not "presumed ingest"** — so
   **the criterion returns a determinate, fail-closed verdict on the shape as recorded.**
4. **The observation does establish the mechanism DA-1 exists for**: content the engine wrote **outlives
   the operation in a file on disk**, and **a scan of the main database alone would have found nothing**
   — precisely the false negative the evidence semantics refuse to accept as satisfaction.

**This is not a DA-1 verdict about any candidate.** No candidate has been measured against DA-1, and
**this task was forbidden to measure one.**

## 7. One referral — **Q14**, and it blocks nothing

**Q14 — does a DA-1 failure block selection, or is it recorded alongside the Shape-1 verdict?**

DA-1 yields its own verdict; **what that verdict does to eligibility is an architecture decision and it
is the Lead's.** MSG-0147 consequence 2 says the ruling *"does not by itself clear or fail any retrieval
engine"*, and MSG-0148b forbids changing any existing gate — so **§4.16 makes DA-1 a separate,
separately-recorded requirement and stops there.**

**Fail-closed default until ruled:** a DA-1 **NOT CLEARED** or **DISQUALIFIED** result is recorded
alongside the Shape-1 verdict and **changes no Shape-1 verdict.** **The default costs nothing either
way** — engine selection is blocked on independent grounds already, and **no candidate is eligible on
any reading of Q14.**

## 8. Acceptance criteria — each with its evidence

| # | Criterion | Evidence |
|---|---|---|
| 1 | **A bounded criterion record exists on `main`**, independently reviewable | **EPA-0006 §4.16**, verified from `main` after the push (§9). It states its own authority, its scope, its exclusions and its verdicts without requiring the reader to have followed this thread |
| 2 | **States plainly what is PROHIBITED** | §4.16 DA-1, three limbs — DA-1.1 request-induced persistence, DA-1.2 residual retention, DA-1.3 widened reach |
| 3 | **States what SATISFIES and what FAILS it, in §4.6 S9's vocabulary** | §4.16 DA-5 — five rows, using **CLEARED / NOT CLEARED / DISQUALIFIED** unchanged; **no new vocabulary created** |
| 4 | **Scope and exclusions explicit**, including what is deliberately out | §4.16 DA-2 — five in-scope classes, six exclusions, **each with a stated reason rather than an omission** |
| 5 | **Fail-closed interpretation stated** — uninspectable ⇒ NOT CLEARED | §4.16 DA-6, in DA-1's own terms, tied to §4.6 S9 and S10 |
| 6 | **Distinguishable from E4 in its own text** | §4.16 DA-7 — a five-row contrast (boundary, artefacts, lifetime, governing rule, role in clearance), plus the U5 adjacency **pointed at, not restated** |
| 7 | **No measurement performed, and the record says so; TASK-0043's figures appear only as a labelled illustration** | §0 and §6 here; §4.16's illustration block and its *"What this section does NOT establish"* list. **No probe, fixture or harness written or run; no test executed; no test count claimed** |
| 8 | **No gate changed, nothing selected; `git diff --name-only docs/` empty; queue, COMMS and status reconciled** | §9 below |

## 9. Verification — quoted, not asserted

```text
git diff --numstat -- implementation/architecture/EPA-0006-assistant-technology-evaluation.md
228     0       implementation/architecture/EPA-0006-assistant-technology-evaluation.md

git diff --name-only docs/
(empty)
```

**Additive: 228 insertions, 0 deletions, in the criterion file.** The other four files in this commit —
this record, the checkpoint, the queue and the status file — **carry the reconciliation, and their
diffs are row replacements rather than additions**; the additive-and-declared constraint applies to
the architecture record, and it holds there. **Nothing is executed, so there is no test count
and none is claimed.** The remaining verification figures — the final `git status --porcelain`, the
commit that carries this work, and the read-back of §4.16 from `main` — are recorded in
`implementation/operations/checkpoints/TASK-0044.md` **checkpoint 2**, which is written **after** the
push and not before.

**Starting HEAD `06d95257dcd9b060595b59bad0062e3178a109c9`**, matching the supervisor heartbeat's
`head` field, re-checked before committing. **One limitation stated rather than glossed:** `git fetch
origin` was **refused by the permission layer** in this session, so `origin/main` was compared against
the locally known remote-tracking ref, corroborated by the live supervisor's independently written
heartbeat. **A remote move in the intervening seconds is UNKNOWN, not excluded.**

## 10. Boundaries — each MSG-0148b prohibition, checked

- **The WAL exposure experiment was NOT run**, and **no measurement of any kind was performed.** No
  probe, fixture or harness was written; nothing was executed.
- **No engine selected, compared, adopted, deployed or implemented.** No engine, runtime, provider,
  model or index technology is named as the bearer of any property in §4.16.
- **E1–E4 unchanged. No existing clearance gate changed.** DA-1 is not in §4.6 S6's table and cannot
  contribute to a CLEARED verdict.
- **Strict Shape-1 not weakened** — DA-1 adds a requirement and relaxes nothing.
- **Criterion creation and measurement were NOT combined.**
- **No numeric threshold, benchmark or invented figure.** The only figures in §4.16 are MSG-0146's,
  quoted as an illustration.
- **No accepted ADR modified** — `git diff --name-only docs/` **empty**.

## 11. State

- **TASK-0044 is COMPLETE — 8/8 acceptance criteria MET.**
- **Nothing CLEARED.** **Seven probes have cleared nothing; all six TASK-0042 candidates remain NOT
  CLEARED.** **DA-1 has been defined and never applied — no DA-1 verdict exists for any candidate.**
- **No task is READY.** **The durability-artefact exposure evidence task is separate and must be
  separately authorized** (MSG-0148b; TASK-0044 *Next eligible task: none*).
- **R1 remains OPEN** — whether TASK-0043's record becomes EPA-0006 §4.15. **§4.15 was deliberately not
  taken by this task.**
- **Q14 referred**, fail-closed, blocking nothing.
- **No blocker open.** **Two discoveries open — DISC-0011, DISC-0012 — neither moves a verdict.**
- **Nothing installed, no host change, no ADR touched, nothing selected.**
