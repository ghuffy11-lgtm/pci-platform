# MSG-0100 — TASK-0032 Execution Record: Bounded A-STACK Technology Evaluation

**Status:** **OPEN** — five items for the Architecture Lead; **none blocks anything**, and MSG-0098 requires
stopping here because selection remains open
**Raised:** 2026-08-23
**Raised by:** Claude Code — supervisor-started session (runner.lock pid 16664, acquired 2026-08-23T05:57:17Z)
**Type:** Task execution record
**Authority:** **MSG-0098** | **Related:** MSG-0099, EPA-0005, MSG-0092, ADR-0020 AMD-01 (MSG-0095), TASK-0026, TASK-0031, MSG-0091

---

## 1. Outcome

**TASK-0032 is COMPLETE.** All seven acceptance criteria are MET, each mapped to evidence in §3.

**The deliverable is [`EPA-0006`](../architecture/EPA-0006-assistant-technology-evaluation.md) — PROPOSED,
and it selects nothing.** No retrieval engine, vector store, model, model-serving runtime, application
runtime, framework, library, or provider is selected, adopted, or shortlisted.

**Being documentary, it produced no test count and claims none.**

**MSG-0098 §6 permits a bounded recommendation *or* an explicit statement that selection remains open.
EPA-0006 does the second for every product-level choice and the first for eight obligations that need no
measurement** (EPA-0006 §12). **The run therefore stops here**, as MSG-0098's closing line directs.

---

## 2. Prerequisites, re-verified in the executing session rather than inherited

The queue row asserts them; CLAUDE.md requires they be checked before the task's actions begin. Each was
verified by reading the file, not by trusting the row.

| Prerequisite | Verdict | Evidence seen in this session |
|---|---|---|
| MSG-0098 AUTHORIZED | **MET** | Header reads `Status: AUTHORIZED`, dated 2026-08-23, naming TASK-0032 |
| EPA-0005 ACCEPTED (MSG-0092) | **MET** | EPA-0005 header reads `ACCEPTED 2026-08-22 by MSG-0092`; Approach C recorded as chosen |
| ADR-0020 + AMD-01 applied | **MET** | `docs/decisions/ADR-0020-*.md` header carries `**Amended:** 2026-08-23 — AMD-01 (MSG-0095), applied in place`; the §4 engine-selection clause is present **once**; the MSG-0092 §1(1)/§3 Traceability row is present |
| TASK-0032 READY and the **only** READY task | **MET** | Status board row reads `READY`; no other row does |
| No OPEN blocker | **MET** | Blocker index shows none OPEN |
| Starting `HEAD` | **`dfc7822`** | `git log -1 --format=%H` → `dfc782253ec61c6e8541c332bf6e025c6bd829cd`; tree clean; `main...origin/main` with no ahead/behind marker |

**The recovery rule was checked before anything was written.** The queue's recovery procedure says *"if an
evaluation record already exists, do not write a second one."* **Checked, and it did not**: `EPA-0006`
returned **zero** matches repository-wide, no `checkpoints/TASK-0032.md` existed, and the highest message
was MSG-0099. The only stack evaluation present was **EPA-0005**, which is a different exercise — §5.

---

## 3. Acceptance criteria, each mapped to evidence

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| 1 | All six required outputs produced, each traceable to evidence or explicitly marked unevidenced | **MET** | MSG-0098 item 1 → EPA-0006 §5; item 2 → §3, §4; item 3 → §6; item 4 → §7 (extraction/normalization), §8 (grounding validation), §9 (storage separation, logging), §10 (rebuild, replaceability, interfaces); item 5 → §11; item 6 → §12 |
| 2 | **The pre-constrained retrieval criterion is actually applied to each candidate engine class, with the disqualification reasoned rather than asserted** | **MET** | EPA-0006 §4.3 — **seven classes**, each with an execution-shape verdict and the reasoning for it; §4.1 defines the three shapes; §4.2 and §4.4 carry the reasoning the verdicts rest on. §4 states which classes are disqualified and why — see §4 of this record |
| 3 | **No unmeasured figure appears as fact** | **MET** | EPA-0006 §2.1 states the rule and the reason; §11 is the register of what is missing. **No throughput, latency, memory, index size, recall, precision, token rate or capacity figure appears anywhere in the record** — not as an estimate, a typical value, a range, or a vendor claim presented as fact. Where a number appears it is a **count derived from ADR text** with the derivation shown (§6.4: at least three model invocations on the critical path) |
| 4 | **No technology selected or adopted**; any recommendation labelled as such with its open questions named | **MET** | EPA-0006 §0 header and §14 state it; §12.1 lists **ten selections, all OPEN**, each with what would close it; §12.2's eight items are **criteria, not selections**, and are labelled as recommendations subject to the Lead's ruling. Product naming is confined to two places and disclaimed — §4 of this record |
| 5 | **No accepted ADR modified** — `git diff --name-only docs/decisions/` empty | **MET** | Run before commit: **empty output**. Quoted in §7 |
| 6 | **No implementation task marked READY** | **MET** | The queue's only status change is TASK-0032 `READY` → `COMPLETE`. **No task is READY.** T-0 and T-A…T-I remain unauthorized; EPA-0006 §13 names a sequencing observation and explicitly does **not** propose it as a task |
| 7 | COMMS, queue and status reconciled; result reported; **stopped for the Lead since selection remains open** | **MET** | This record; `CLAUDE-TASKS.md` board and task section; `implementation/status/current.md`; `implementation/architecture/README.md`; **WP-0009 §6.2** (two additive rows, nothing overwritten); `checkpoints/TASK-0032.md` |

---

## 4. Which candidate classes were disqualified by the AMD-01 criterion, and why

**The queue's Verification section requires this stated explicitly. It is EPA-0006 §4.3.**

**Disqualified:**

- **Class D — post-filter-only similarity search.** Directly by ADR-0020 §4 as amended. The engine ranks
  over the whole collection and something downstream discards; **no test is required to reach this verdict.**
- **Class H — hosted / managed retrieval or vector services.** **Twice over, on independent grounds.**
  **ADR-0022 §1** names *derived embeddings* explicitly and forbids anything derived leaving the host, so the
  class is out regardless of its filter shape; **and** where such a service is post-filter or over-fetch,
  AMD-01 disqualifies it separately. **The two eliminations do not depend on each other**, which matters:
  relaxing one would not revive the class.
- **Any member of any class whose filter resolves to over-fetch-then-discard** — "at any layer, including
  inside the retrieval component", in AMD-01's words. This is a verdict on an **execution shape**, not on a
  product category, and it is why the remaining classes are *not cleared*.

**Not disqualified — and explicitly NOT cleared:** classes **R** (relational with integrated lexical +
vector), **S** (search engine with filtered kNN), **V** (purpose-built vector store), **L** (lexical-only,
insufficient alone under ADR-0020 §7). Each is a class **within which both conforming and non-conforming
members exist.** Membership is settled by EPA-0006 §4.4's probe, which **has not been run** (§11 #8).

**Structurally conforming:** class **K** — retrieval computed against the kernel store, where the candidate
set *is* an authorized query result and there is no wider set to over-fetch from. **Its cost is entirely
unmeasured**, and it is listed because omitting the one option whose conformance needs no test would
misrepresent the option space.

**Product naming was deliberately minimal, and EPA-0006 §2.2 states why rather than leaving it as an
omission.** The discriminating property — filter execution strategy — is not reliably determinable from
product documentation and was not determinable at all from this session, so recording one would be exactly
the vendor-claim-as-fact MSG-0098 §5 forbids. Names appear in **two** places: products already named in
accepted repository documents (PostgreSQL, verified by WP-0001; **Ollama**, cited by ADR-0003/SPEC-0008 and,
as ADR-0022 §4 requires, **not elevated**), and one legibility footnote in §4.3 naming well-known systems
**by category only**, carrying an explicit statement that **no claim is made about any of them and the list
is not a shortlist.**

---

## 5. This is not a re-run of TASK-0026, and the record now says so in three places

**Both tasks are labelled "A-STACK"**, and WP-0009 §6.2 lists A-STACK once with the row already reading
EXECUTED. MSG-0099 §2 flagged the hazard before execution; it is now closed in the register itself.

| | TASK-0026 | TASK-0032 |
|---|---|---|
| Question | Stack **shape** — Approaches A/B/C | **Technology classes** within the settled shape |
| Against | The ADR set as at 2026-08-22 | **Approach C as settled (MSG-0092)** and **ADR-0020 as amended by AMD-01** |
| Output | `EPA-0005` | `EPA-0006` |

**Neither input existed when EPA-0005 was written.** Approach C was chosen by MSG-0092 *after* EPA-0005 was
delivered; AMD-01 was accepted by MSG-0095 and applied in place by TASK-0031 on the morning of this run.

**WP-0009 §6.2 was updated additively — two rows added under A-STACK, and the TASK-0026 row was not
altered**, per the task's Documentation requirement. **The first added row also corrects a real lag**: §6.2
still described EPA-0005 as `PROPOSED` and recorded **nothing** about MSG-0092's acceptance or Approach C
being chosen — verified by search before writing, which returned **zero** occurrences of `MSG-0092`,
`MSG-0095` or `Approach C` anywhere in WP-0009. The correction is **additive and declared**, in the
convention this repository already uses.

---

## 6. What EPA-0006 establishes that EPA-0005 did not

Ten findings; the four with the most consequence for an implementer are named here in full because each is
violated by the *convenient* implementation rather than by a careless one.

1. **AMD-01's G3 evidence rule does not discharge AMD-01's engine-selection criterion** (§4.2). A Shape-3
   engine — one that accepts the constrained query and satisfies it by over-fetching internally — receives a
   **conformant query** and returns a **correct response**. G3 inspects the query, so **G3 evidence cannot
   distinguish it from a conforming engine.** A project collecting only G3 evidence will believe the engine
   is cleared when it is not. **This is not a defect in AMD-01 and needs no amendment** — AMD-01 states both
   obligations; it simply does not say that one fails to discharge the other, because it is answering a
   different question. The practical consequence is a separate conformance obligation with its own evidence,
   and **an engine exposing no plan or counter instrumentation cannot be cleared at all.**
2. **The retrieval port's signature is itself the control** (§10.2). A port typed `search(queryText, k)`
   makes the conforming design **unrepresentable** — there is nowhere to put the predicate, so every
   implementation behind it must post-filter. **The interface has mandated the prohibited shape.** The port
   must take authorization context as a **required** parameter and expose **no unconstrained search
   variant**, including "internal", "admin", "debug" and "reindex verification" ones. The same argument
   binds the Approach C worker contract, where an unconstrained retrieval request reintroduces
   retrieve-then-filter **at the service seam**, harder to see than in code.
3. **No index-assigned identifier may ever appear in a citation** (§8.2). ADR-0020 §1 requires a full
   rebuild be a **no-op with respect to answers**; a citation embedding a row id, point id or index-time
   chunk ordinal is invalidated by a rebuild that reassigns them — **silently**, where identifiers are
   reused rather than merely reassigned. Anchors must be derived deterministically from **kernel-side**
   version identity plus section path, and the structural layer must resolve them against the kernel, which
   also keeps it working while the index is stale or rebuilding — the state ADR-0020 §1 explicitly
   contemplates.
4. **The kernel's verified append-only audit store is disqualified for conversation content** (§9.1) — by
   the very property that makes it good audit storage. WP-0001 proved it append-only (AC-06, live).
   **Append-only and ADR-0021 §3's "expiry actually deletes" are incompatible**, so the natural reuse — one
   governed, verified store for everything — violates ADR-0021 §2, §3 and §4 at once, and does so invisibly.

The remaining six: **the four-part in-query predicate derived** (§3), including ADR-0018 §4's **two-sided
temporal range with an open upper bound** as the sharpest capability discriminator, and **SUPERSEDED** as
the one lifecycle state that is a query predicate rather than an ingestion invariant (§3.1); **ADR-0016's
RLS does not reach an external index**, so enforcement point 3 must be reproduced there or become decorative
(§3.2); **conformance for a relational engine is a property of the query plan**, and a control that depends
on the optimizer's selectivity estimate is not a control (§4.4); **a strategy-switching engine is
disqualified unless the strategy can be pinned**, because its conformance otherwise flips with the data —
in the highly selective case, which is exactly what a restrictive authorization predicate produces (§4.4);
**the embedding model's identity belongs on the index alongside the normalization rule-set version**, since
replacing it silently changes the projection (§6.2); and **ADR-0020 §6.2's logging prohibition is a
selection criterion on the index engine and the model serving runtime**, not only a coding rule — a
serving runtime that logs prompts logs policy passages, and an engine's slow-query log is not exempt because
the application wrote nothing (§9.3).

**EPA-0006 §14 states, finding by finding, why none of the ten requires an ADR change**, naming the accepted
section each already follows from. That list is the check against this record having quietly amended
architecture.

---

## 7. Verification — commands run in this session, with their output

```text
git log -1 --format=%H          -> dfc782253ec61c6e8541c332bf6e025c6bd829cd   (session start)
git status --porcelain          -> (empty)                                     (session start)
git status -sb                  -> ## main...origin/main                       (no ahead/behind marker)

git diff --name-only docs/decisions/   -> (empty)      <- acceptance criterion 5
git status --porcelain (pre-commit)    -> only new/modified paths listed in §8
```

> **Known runner limit, recorded rather than routed around.** **`git fetch` is off this runner's Bash
> allowlist**, exactly as the queue's *Known runner limit* note predicts and as TASK-0031 found. The
> `origin/main` comparison above is therefore against the **local remote-tracking ref**, not a freshly
> fetched one, and is reported as such. **A mid-run move of the real remote is detectable here only by a
> rejected push** — so the accepted push is the stronger evidence, and it is quoted in the checkpoint.

**No test count is reported, because none was produced.** This was documentary work. Under CLAUDE.md
Rule 10, "0 tests" would be a failure if tests were expected; here the queue's own Verification section
says *"Documentary — no test count; do not report one."*

---

## 8. Files changed

| Path | Change |
|---|---|
| `implementation/architecture/EPA-0006-assistant-technology-evaluation.md` | **New** — the deliverable |
| `implementation/architecture/README.md` | EPA-0006 row added; **EPA-0005's row corrected additively** to record MSG-0092's acceptance and Approach C; reading order updated |
| `docs/program/work-packages/WP-0009-employee-policy-assistant.md` | **§6.2 — two rows added under A-STACK; no existing row altered.** §5 of this record explains both |
| `implementation/operations/CLAUDE-TASKS.md` | Status board row → COMPLETE; task section outcome recorded; MSG-0098/0099/0100 ledger |
| `implementation/status/current.md` | Current position updated; the superseded line retained |
| `implementation/comms/MSG-0100-task-0032-execution-record.md` | **New** — this record |
| `implementation/comms/README.md` | MSG-0100 registered |
| `implementation/operations/checkpoints/TASK-0032.md` | **New** — checkpoints 1–3 |

**`docs/decisions/` is untouched** (§7). **No file was deleted or renamed.**

---

## 9. What did NOT change — the boundary, stated as a list

- **No technology selected, adopted, or shortlisted** — ten selections remain OPEN (EPA-0006 §12.1).
- **No accepted ADR modified**, including the freshly amended ADR-0020. **No ADR created, amended, or
  proposed**, and EPA-0006 §12.3 recommends against a new one for the reason EPA-0005 §9.3 gave.
- **ADR-0019 untouched. No Arabic normalization rule was written, inferred, or proposed.** MSG-0091's
  scoping is respected: the Arabic n=1 evidence is used as **bounded architecture evidence** and **not** as
  production corpus evidence. One n=1 observation — detached diacritics — is recorded as **input to** the
  deferred rule, explicitly not as any part of it.
- **No implementation task marked READY.** T-0 and T-A…T-I remain unauthorized. **No task is READY.**
- **No new corpus or provider authorization was assumed or requested as a precondition.** §11 of EPA-0006
  records the need; the work finished without it, as MSG-0098 requires.
- **No permission, security boundary, supervisor configuration, or schedule was changed.** No host
  operation was performed, and none was required — which is why
  `docs/operations/pci-server-bootstrap.md` was not read: its trigger is *"before any host operation"*.

---

## 10. Items for the Architecture Lead — five, none blocking

Carried from EPA-0006 §15 so they are visible in the register too.

1. **"One projection index" — one *projection*, or one *engine*?** (EPA-0006 §4.5). ADR-0020 §7's phrase
   decides whether a lexical engine paired with a vector engine is permitted, which in turn decides whether
   classes L and V are usable at all. **Not settled by this record**, because settling it would fix the
   meaning of an accepted ADR by implication. **Under either reading AMD-01 binds each retriever
   independently**, and **the fusion step must not be where authorization is resolved** — a layer that
   merges a constrained result set with an unconstrained one and then filters is retrieve-then-filter under
   another name.
2. **Should the projection retain SUPERSEDED chunks at all?** (EPA-0006 §3.1). Excluding them **removes a
   predicate rather than implementing one**; retaining them adds one more constraint that must be
   pre-constrained. Both are consistent with ADR-0018 §2 and ADR-0020 §1.
3. **Should the engine conformance probe be run?** (EPA-0006 §4.4, §13). **It is the only substantial piece
   of evidence in this whole evaluation that is not blocked on the organization or the operator.** It is
   named as a sequencing observation and is **explicitly not proposed as a task, marked READY, or
   self-authorized.**
4. **Does any EPA-0006 §12.2 item warrant recording as accepted authority?** This record creates and
   proposes no ADR. **Items 1, 3 and 4 of §12.2 are the candidates**, because each is violated by the
   convenient implementation. If the Lead judges the risk material, **the shape MSG-0092 chose last
   time — a narrow amendment to the ADR the rule already follows from — applies again.**
5. **The corpus action is unchanged and is still the organization's**: representative approved policy
   material, **plural**, produced the way the organization actually produces policy. It has now been
   recorded as outstanding by MSG-0078, MSG-0084, MSG-0089 and this record. **EPA-0006 §11 #3 sharpens
   why it matters here**: extraction hazards are a property of the *producing toolchain*, the three
   surveyed documents came from three producers and yielded **three disjoint defect families with no
   overlap**, and **none of those producers is known to be the organization's**.

---

## 11. Decision required to proceed

**None to complete TASK-0032; it is complete.**

**MSG-0098's closing line applies**: *"After execution, report the result through COMMS and stop for the
next Architecture Lead decision if selection remains open."* **Selection remains open**, so the run stops
here. **No task is READY, and that is the correct state** — the queue's own *Next eligible task* for
TASK-0032 reads *"none — MSG-0098 requires stopping for the Lead if selection remains open."*

**Operational note:** the scheduled task `PCI-Execution-Supervisor` is recorded **Disabled** in MSG-0099 §6;
this session was nonetheless supervisor-started (lock pid 16664 naming TASK-0032, heartbeat
`RUNNER_RUNNING` at `head dfc7822`), so a cycle was triggered. **A future session should verify the
scheduler's state directly rather than inheriting either claim.**
