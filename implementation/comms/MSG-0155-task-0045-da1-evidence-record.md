# MSG-0155 — TASK-0045 execution record: DA-1 measured, and nothing cleared

**From:** Claude Code
**To:** PCI Architecture Lead
**Date:** 2026-08-25
**Status:** **OPEN** — record, with **two questions referred, neither blocking**
**Authority:** **MSG-0153** (AUTHORIZED), **EPA-0006 §4.16 DA-0…DA-7 binding as written**,
`implementation/operations/CLAUDE-TASKS.md` TASK-0045 (lines 4578–4717); **MSG-0147** (R2),
**MSG-0148b** (criterion/measurement separation), **§4.15**
**Artefacts:** `implementation/probes/TASK-0045/probe.mjs`, `implementation/probes/TASK-0045/probe-output.txt`,
`implementation/operations/checkpoints/TASK-0045.md`

---

## 1. The result in one paragraph

**A real probe ran** — **8 measured configurations across 5 in-scope artefact classes**, on a
**file-backed** fixture, with **both mandatory negative controls firing**, so the run is **VALID**.
**DA-1 is NOT CLEARED for the subject measured**, by **two independent routes**: a **DA-5 row 1**
finding on a single occurrence, and **DA-6** on a limb the available instruments cannot reach.
**Satisfying DA-1 would have cleared nothing and failing it fails nothing** — DA-5 consequence 1 and
DA-7 row 5. **No candidate moved, no gate changed, no criterion was adjusted, `git diff --name-only
docs/` is empty.** **Eight probes have now cleared nothing.**

---

## 2. The apparatus, because it is what makes the numbers mean anything

**§4.16 DA-4 is the reason this probe is shaped the way it is.** Under a single shared projection,
*"unauthorized-for-`s` bytes exist somewhere in the engine's files"* is **true by construction at
every moment**, so **a probe that greps an artefact for a marker measures nothing.** The queue
section said so; §4.16 said so first.

**The discriminator is a measured-empty baseline:**

```text
C1  after ingest        -wal  PRESENT, 41232 bytes   UNAUTH x235   <- provenance: INGEST (DA-4 row 1)
C2  PRAGMA wal_checkpoint(TRUNCATE)                                 <- the maintenance operation
C3  baseline            -wal  PRESENT BUT EMPTY (0 bytes)  UNAUTH x0
    BASELINE ESTABLISHED for the -wal artefact:  YES -- 0 bytes, verified by reading it
```

**The artefact is measured empty, not assumed empty.** Anything found in it afterwards **arrived
after the baseline**, which is DA-4 row 2 — *"written, or retained, because a request was resolved."*
**Without C3 every later number in this record would be uninterpretable**, and a probe that stopped at
C1 would have reported a dramatic finding that means nothing at all.

**Where that apparatus was unavailable, it is said so and DA-6 is applied rather than the criterion
being reinterpreted** — the `-shm` file is **not** emptied by a checkpoint, so its attribution rests
on a marker count changing rather than on an empty baseline. **A weaker instrument, reported as
weaker.**

---

## 3. The sharpest result: a request that touched nothing forbidden still made forbidden content durable

**This is the finding to read first, and it was not the one the probe was built to look for.**

The measurement is ordinary **access accounting** — a retrieval layer recording that a chunk was
served. It **UPDATES rows in the shared projection**, and it updates **only rows the subject was
entitled to receive**:

```text
F1  baseline            -journal  NEVER CREATED         <- so the file below was created by the txn
F4  UPDATE chunk SET served = served + 1 WHERE scope = 'AUTHORIZED'
    -journal            PRESENT, 33344 bytes            UNAUTH x236   AUTH x235
```

**The request examined no unauthorized row, returned no unauthorized row, and used no bad plan — and
the rollback journal came back holding the unauthorized marker 236 times.** The engine journals
**whole pages**, and **a page holding an authorized row holds its unauthorized neighbours**.

**Why this matters beyond the number:** every previous adverse result in this record — §4.11's
planner result, §4.12's `ANALYZE` result, §4.14's post-filtering — was ultimately about **query
shape**, and a better query or a pinned plan was at least conceivable as an answer. **This one is
about page granularity.** It does not depend on post-filtering, on the optimizer, or on examining
anything unauthorized. **A better query does not answer it.** **§4.13's N1 containment does** — if
the reachable structure holds only content the subject may receive, there are no unauthorized
neighbours on the page to journal. **This is the first measurement in the record that argues for
containment on grounds independent of `U`.**

### And an expectation that did not survive contact with the instrument

**The append-shaped request-induced write journalled nothing:**

```text
F3  INSERT INTO result_cache SELECT ... FROM chunk WHERE ...
    -journal            PRESENT, 8720 bytes             UNAUTH x0   AUTH x0
```

**A rollback journal holds the original images of pages about to be OVERWRITTEN, and rows appended
into fresh pages overwrite nothing.** So **two request-induced writes, both caused by resolving the
same kind of request, differ completely in what they make durable** — and **the difference is
`INSERT` versus `UPDATE`**, which is not a security property anyone would think to specify.
**Recorded as measured.** Under **DA-5 row 3** the F3 absence is **not sufficient and not a pass.**

---

## 4. DA-4 demonstrated on this run's own output, not argued

**The same artefact, the same shape of observation, opposite verdicts — decided only by provenance:**

| | Write | `-journal` holds UNAUTH | DA-1 verdict |
|---|---|---|---|
| **F2** | **ingest** — adding corpus rows | **26 times** | **NOT a finding** — DA-4 row 1, ADR-0020 §1 governs it |
| **F4** | **request resolution** — access accounting | **236 times** | **DA-1.1 FINDING** — DA-4 row 2 |

**A criterion phrased as presence would have flagged both, failed the engine on the ingest one, and
told nobody anything.** **This is exactly what MSG-0148b's ordering was for**, and it is now visible
in output rather than in reasoning. **The criterion earned its keep.**

---

## 5. Per-artefact, per-limb results — each limb its own verdict (criteria 1, 2, 4)

**DA-5's vocabulary is used unchanged. No new verdict term was invented.**

### DA-1.1 — request-induced persistence

| Artefact | Observation | Verdict |
|---|---|---|
| **write-ahead log** | Shape-1-respecting request: `-wal` measured **empty at baseline AND after** | **not sufficient alone** (DA-5 row 3) |
| **rollback journal** | **236 occurrences**, created by the request-resolution transaction | **NOT CLEARED** (DA-5 row 1) |
| **shared-memory `-shm`** | no unauthorized marker in any measurement | **not sufficient alone** (DA-5 row 3) |
| **temporary / spill files** | **5 228 784-byte** spill file, marker **10 000 times**, created **by** the request | **NOT CLEARED** (DA-5 row 1) |
| **engine-produced backup** | content present, but provenance is **ingest** | **no DA-1.1 finding** — DA-4 row 1 |

### DA-1.2 — residual retention

| Artefact | Observation | Verdict |
|---|---|---|
| **write-ahead log** | survives connection close where non-empty; measured empty here | **not sufficient alone** (DA-5 row 3) |
| **rollback journal** | **reclaimed at commit — `NEVER CREATED` afterwards** | **absence only — NOT sufficient.** The content **was** there; F4 measured it |
| **temporary / spill files** | removed when the statement finished; **no residue** | **NOT CLEARED (DA-6)** — see below |

**The spill-file DA-1.2 verdict is DA-6, and this is the criterion being inconvenient exactly as the
queue section predicted.** The probe can observe that **the directory entry is gone**. It **cannot
observe whether the content is gone** — unlinking does not overwrite blocks, and no instrument here
reads them. **DA-6: "the instrument cannot reach it … the verdict is `NOT CLEARED`."** **Recording
*"the criterion asks for something this subject cannot show"* is a result, not a probe defect**, and
the criterion was **not** reinterpreted to make it come out otherwise.

### DA-1.3 — widened reach

| Artefact | Observation | Verdict |
|---|---|---|
| **temporary / spill files** | created **OUTSIDE the store directory**, in the OS temp directory, **at a path the engine chooses** | **FINDING** — DA-1.3 names this case in its own text |
| **`-wal` / `-shm` / `-journal`** | created **inside** the store directory | no location finding; **readable as plain files** by any principal with directory access |
| **engine-produced backup** | **MEASURED**: the engine wrote **a complete second copy of the projection into a directory outside the store**, with **no engine-side constraint** on the destination | **FINDING** — longer-lived copy, wider reach |
| **`/data/docker` limb** | **NOT MEASURED** | **no verdict claimed either way** — see §7 |

---

## 6. Run validity — both negative controls fired, and are quoted (criterion 5)

**Two controls, not one, because there are two instruments and they fail independently.** A control
on the WAL scanner says nothing about whether the spill scanner works.

```text
+ NC-1 fired: spill file etilqs_25FnmRrtGBej9Oc (5228784 bytes) held the unauthorized
  marker 10000 times
+ NC-2 fired: -wal went from 0 bytes to 24752 and held the unauthorized marker 90 times,
  attributable to the resolution

RUN VALIDITY: VALID -- both negative controls produced a DA-1 finding.
```

**NC-1's adverse configuration is not contrived**, and that is worth stating: it is **rank across the
shared projection, apply entitlement to the result** — **post-filtering**, the shape strict Shape-1
exists to forbid, and the shape a retrieval layer takes when authorization is bolted on afterwards.
**The engine sorted all 20 000 rows to answer it and spilled 10 000 unauthorized bodies to a file
outside the store.**

---

## 7. Two defects in the probe's own apparatus, found and fixed before any result was reported

**Both were the presence-versus-provenance error DA-4 exists to prevent — committed by the probe
written to test for it.** They were found by **reading the probe's first output against its own
stated standard**, which is the same step that caught the insertion figures twice this week.

1. **The rollback-journal verdict called an INGEST write a DA-1.1 finding.** The first version opened
   a transaction, inserted corpus rows, and reported the marker in the journal as request-induced.
   **It was not a request being resolved for any subject.** Rebuilt to measure the same artefact
   under **both** provenances — and that rebuild is what produced §3's finding and §4's contrast.
   **The defect was more productive than the original design.**
2. **The backup reach verdict asserted rather than measured.** It said the copy could go *"wherever
   the caller names"*. **An assertion about an API is not a measurement.** Now tested by actually
   writing the backup **outside** the store directory, which succeeded — so the claim in §5 is
   observed.

**Neither defect reached a reported result.** They are recorded because **§4.12, §4.11 and §4.10 each
recorded the same class of self-correction**, and the pattern is now four for four: **the probe's own
apparatus is the most likely thing in the run to be wrong.**

---

## 8. What was not measured, stated rather than left to be discovered (criterion 1)

- **ONE SUBJECT ONLY** — SQLite **3.51.3** via **`node:sqlite`**, node **v24.15.0**, win32/x64.
  **§4.15's caution applies unchanged: the two available subjects differ in the BINDING, not the
  build, and neither generalizes to an engine class.** **Nothing here is a claim about "SQLite", still
  less about class R.**
- **The second subject was NOT invoked.** **MSG-0145 granted `py` for TASK-0043's probe only**, and
  the queue section requires a fresh grant. **None exists, so none was used and none was sought** —
  the instruction followed, not an omission. **BLK-0011's unattended condition still stands.**
- **`DEBUG`, `ENABLE_SQLLOG` and `ENABLE_STMT_SCANSTATUS` are ABSENT** on this build, as on both prior
  subjects. **Irrelevant to DA-1 and recorded only so the build is identified.**
- **DA-1.3's `/data/docker` limb is NOT MEASURED.** This runner is the **Windows development
  machine**; **no PCI server deployment exists to measure**. **No verdict is claimed either way.**
- **Replication streams: NOT APPLICABLE** — this subject is not a replicating engine, so **no such
  artefact exists to inspect.** Recorded rather than silently dropped from DA-2's list.
- **Marker scanning is a byte scan.** It would miss content stored in a form the marker does not
  survive — compression, encoding, partial-page writes. **So every absence above carries even less
  weight than DA-5 row 3 already gives it.**

**Maintenance and journal state are recorded per measurement** (criterion 6) — `journal_mode` `wal` or
`delete` as stated in each section, **`wal_checkpoint(TRUNCATE)` at each WAL baseline, no `VACUUM`,
no `ANALYZE`**. **§4.12's warning that `ANALYZE` alone flipped a `U` reading is why this is stated
rather than assumed.**

---

## 9. What this does NOT do

- **Nothing CLEARED, and nothing could have been.** **DA-1 is not an §4.6 S6 evidence class**
  (DA-5 consequence 1, DA-7 row 5). **Eight probes have now cleared nothing.**
- **Nothing selected, adopted, deployed or implemented** — **clearing named explicitly** in MSG-0153.
- **No Shape-1 verdict moved.** **All six TASK-0042 candidates remain NOT CLEARED** for the reasons
  they already were. **E1–E4, strict Shape-1, `U = 0`, G-Q4…G-Q7.8 and S1–S11 are untouched**, and
  **no `U` was measured here.**
- **The criterion was not adjusted.** **DA-1…DA-7 were applied as written, including where
  inconvenient** — see the DA-6 verdict in §5.
- **No accepted ADR modified** — **`git diff --name-only docs/` empty**, verified.
- **No prior probe re-run, extended or reinterpreted.** **§4.15's WAL figures are TASK-0043's and stay
  TASK-0043's.**
- **No numeric threshold, benchmark, latency or capacity figure.** The byte counts are **observations,
  not bars.**
- **No real or confidential corpus** — every fixture synthetic (S11). **Nothing installed, no host
  configuration modified.**

---

## 10. Questions referred — neither blocking

**Q15 — does this evidence become an EPA-0006 section, and which number?**
**Not taken, deliberately.** TASK-0045's documentation list names COMMS, the status file, the queue,
the probe directory and the checkpoint — **it does not name EPA-0006**, and **§4.15 is the precedent
for how that question gets answered**: MSG-0146 **referred** it as R1, the Lead **ruled** it in
MSG-0153, and a separate task wrote the section. **Taking a section number here would be the silent
architecture change that precedent exists to prevent.** **The evidence is complete in this message and
in the probe output; only its promotion is open.** **Fail-closed default: it stays here until ruled.**

**Q16 — does the page-granularity result (§3) belong to DA-1 alone, or does it bear on the topology
question §4.13 left open?**
**Asked, not answered.** The finding is a **DA-1.1** result and is recorded as one. But its mechanism
— **unauthorized neighbours on a shared page becoming durable because an authorized row was
updated** — is **not a query-shape property**, so **W1–W4 may not be indifferent to it** where §4.13
records them as differing in exactly one cell. **This session did not measure any topology and does
not claim they differ.** **Blocks nothing**: selection is already blocked on independent grounds.

---

## 11. Verification, quoted

```text
git diff --name-only docs/        -> empty
git status --porcelain            -> empty after commit (verified before push)
probe run                         -> 8 configurations, 5 artefact classes, RUN VALIDITY: VALID
negative controls                 -> 2 of 2 fired, each quoted in §6
starting HEAD (checkpoint 1)      -> 5274162c4db3cabfa51fc4f0befa39d698bb975e
```

**Delivered content verified from `origin/main` after pushing** — see the checkpoint.
