# Claude Code Execution Queue

**This file is the authoritative execution queue.** `CLAUDE.md` requires every session to read it at startup and to execute the highest-priority **READY** task, following that task's prerequisites, dependencies, allowed actions, forbidden actions, verification requirements, documentation requirements, checkpoint requirements, stop conditions, and recovery procedure.

Roadmap: [`ROADMAP.md`](ROADMAP.md) — the A→Z sequence this queue implements.
Checkpoints: [`checkpoints/`](checkpoints/) — resumable state for interrupted tasks.

Only the architecture lead may authorize new work, mark a task READY, or change priority or scope. Claude Code may propose tasks; a proposed task is **not** executable.

---

## Status board

| ID | Task | Status | Depends On | Last Verified | Next Action | Owner |
|---|---|---|---|---|---|---|
| TASK-0001 | WP-0001 verification on the authorized host | **COMPLETE** | — | 2026-08-19 `a693910` | none | Claude Code |
| TASK-0004 | Fix database role provisioning (DISC-0007) | **COMPLETE** | TASK-0001 | 2026-08-19 G1 pass | none — clean-room proof is TASK-0006 | Claude Code |
| TASK-0005 | Fix compose kernel service configuration (DISC-0008) | **COMPLETE** | TASK-0001 | 2026-08-19 G2 pass | none | Claude Code |
| TASK-0006 | Clean-room reproducibility verification | **COMPLETE** | TASK-0004, TASK-0005 | 2026-08-19 G3 pass | none | Claude Code |
| TASK-0007 | Full re-verification after fixes | **COMPLETE** | TASK-0006 | 2026-08-19 G4 pass, 229 tests | none | Claude Code |
| TASK-0008 | Final report and status reconciliation | **COMPLETE** | TASK-0007 | 2026-08-19 G5 pass | none — TASK-0009 decision recorded in MSG-0022 | Claude Code |
| TASK-0009 | WP-0001 completion decision | **COMPLETE** | TASK-0008 | 2026-08-19 | none — WP-0001 complete; no post-WP-0001 work authorized until explicitly authorized | Architecture lead |
| TASK-0003 | Normalise `*.md` line endings (DISC-0006) | **COMPLETE** | — | 2026-08-20 w/crlf 150 -> 0 | none | Claude Code |
| TASK-0010 | Execution Supervisor (installed and **ENABLED**, 10-min) | **COMPLETE** | — | 2026-08-19 tests 21/21, enabled cycle verified | none — start path proven by TASK-0003 | Claude Code |
| TASK-0011 | **Execution Supervisor smoke test — COMMS audit and end-to-end report** | **COMPLETE** | TASK-0010 | 2026-08-20 `d16665a` — PASSED | none — terminal by design | Claude Code |
| TASK-0013 | **Apply MSG-0035 maintenance decisions — blocker index + COMMS numbering rule** | **COMPLETE** | TASK-0011, MSG-0035 | 2026-08-20 — both decisions applied, MSG-0036 | none — one finding awaits a ruling, MSG-0036 §6 | Claude Code |
| TASK-0014 | **Reconcile BLK-0005 in blocker index** | **COMPLETE** | TASK-0013, MSG-0037 | 2026-08-20 — row added, MSG-0038 | none | Claude Code |
| TASK-0015 | **Reconcile discoveries index with actual DISC records** | **COMPLETE** | TASK-0014, MSG-0039 | 2026-08-20 — index 3 rows -> 9, MSG-0040 | none | Claude Code |
| TASK-0016 | **Close resolved MSG-0034 informational record** | **COMPLETE** | TASK-0015, MSG-0041 | 2026-08-20 — closure verified, MSG-0042 | none | Claude Code |
| TASK-0017 | **Supervisor heartbeat / unattended observability** | **COMPLETE** | TASK-0016 | 2026-08-20 tests 36/36 | none | Claude Code |
| TASK-0018 | **Live Supervisor heartbeat validation** | **COMPLETE** — 5 of 5 gates MET | TASK-0017 | 2026-08-21 `COMPLETED` observed externally | none | Claude Code |
| TASK-0019 | **Post-WP-0001 repository baseline audit** | **COMPLETE** | TASK-0018, MSG-0050 | 2026-08-21 — 6 corrections applied, 7 items referred, MSG-0051 | none | Claude Code |
| TASK-0021 | **Employee policy assistant — architecture definition** | **COMPLETE** | WP-0001 COMPLETE, MSG-0054 | 2026-08-21 — 11/11 acceptance criteria, MSG-0055; **accepted by the Architecture Lead (MSG-0056a)** | none — all fourteen EPA-0003 decisions ruled (MSG-0056a/b); three reconciliation findings resolved by MSG-0058 | Claude Code |
| TASK-0022 | **Employee policy assistant — work-package definition** | **COMPLETE** — output **ACCEPTED** by MSG-0062 | TASK-0021 COMPLETE, MSG-0058 DECIDED, MSG-0059 | 2026-08-21 — `EPA-0004` delivered, MSG-0061; accepted MSG-0062 with all seven open items ruled | none — the seven items in MSG-0061 §7 are ruled by MSG-0062 | Claude Code |
| TASK-0023 | **EPA work-package governance reconciliation** | **COMPLETE** | TASK-0022 COMPLETE, MSG-0062 DECIDED, MSG-0063 AUTHORIZED | 2026-08-21 — 7/7 acceptance criteria, **WP-0009** allocated, MSG-0066 | none — awaiting the Architecture Lead's next authorization; **no task is READY** | Claude Code |
| TASK-0024 | **A-ADR — draft the required EPA ADR set** | **COMPLETE** | TASK-0023 COMPLETE, MSG-0062 DECIDED, MSG-0067 DECIDED, MSG-0068 AUTHORIZED, WP-0009 defined | 2026-08-21 — 8/8 acceptance criteria, **ADR-0017…ADR-0022 drafted PROPOSED**, MSG-0070 | none — awaiting the Architecture Lead's acceptance of the drafts; **no task is READY** | Claude Code |
| TASK-0025 | **Promote ADR-0018…ADR-0022 into the accepted decision register** | **COMPLETE** | TASK-0024 COMPLETE, MSG-0071 DECIDED, MSG-0073 AUTHORIZED | 2026-08-21 — 5/5 acceptance criteria; five ADRs promoted, **zero body differences** in the per-ADR diffs, MSG-0075 | none — **no task is READY**; A-SURVEY / A-STACK / T-0 stay unauthorized | Claude Code |
| TASK-0026 | **A-SURVEY + A-STACK — bounded corpus survey and stack evaluation** | **COMPLETE (PARTIAL)** | TASK-0025 COMPLETE, MSG-0071 DECIDED, MSG-0076 AUTHORIZED | 2026-08-22 — 5/6 criteria MET; **criterion 1 UNMET (PR5)**; **EPA-0005** delivered, MSG-0078 | none — **no task is READY**. A-SURVEY awaits an organizational corpus action; EPA-0005 awaits the Lead's acceptance | Claude Code |
| TASK-0027 | **A-SURVEY (n=1) — inspect the approved/synthetic corpus** | **COMPLETE** | TASK-0026 COMPLETE (PARTIAL), MSG-0080, MSG-0083 (corpus read permission), corpus readable by the runner | 2026-08-22 — **7/7 acceptance criteria MET**; PDF inspected in place, `git status` clean, no PDF in history; **MSG-0084** | none — **no task is READY**. MSG-0084 §8 refers two non-blocking items to the Lead; A-SURVEY at *corpus* scale still awaits representative material | Claude Code |
| TASK-0028 | **A-SURVEY Arabic follow-up (n=1) — inspect `Arabic.pdf`** | **COMPLETE** | TASK-0027 COMPLETE, MSG-0085 AUTHORIZED, MSG-0083 read grant | 2026-08-22 — 9/9 criteria, MSG-0087; **document is OCR-derived (ABBYY FineReader) — the class D14 rejects** | none — two items referred to the Lead, neither blocking | Claude Code |
| TASK-0029 | **A-SURVEY Arabic text-native follow-up (n=1)** | **COMPLETE** | TASK-0028 COMPLETE, MSG-0088 AUTHORIZED, MSG-0083 read grant | 2026-08-22 — 11/11 instructions, MSG-0089; **text-native and D14-ADMISSIBLE**; **Arabic stored in visual order — naive extraction reverses it** | none — two items referred, neither blocking | Claude Code |
| TASK-0030 | **Draft the minimum ADR-0020 clarification — pre-constrained retrieval as an engine-selection gate** | **COMPLETE** | EPA-0005 ACCEPTED (MSG-0092), ADR-0020 accepted | 2026-08-22 — **7/7 acceptance criteria MET**; `ADR-0020-AMD-01` drafted **PROPOSED** and **NOT applied**, `git diff --name-only docs/` **empty**; **MSG-0094** | none — **no task is READY**. The Lead reviews AMD-01 before anything is applied; applying it needs an explicit authorization (MSG-0092 §5) | Claude Code |
| TASK-0031 | **Apply ADR-0020 AMD-01 in place** — accepted by MSG-0095 | **COMPLETE** | AMD-01 ACCEPTED (MSG-0095), TASK-0030 COMPLETE | 2026-08-23 — **7/7 acceptance criteria MET**; applied in `a1be892`; `git diff --name-only docs/decisions/` named **ADR-0020 only**, **15 insertions / 0 deletions**; **MSG-0097** | none — **no task is READY**. The ADR set is complete and stable; the next authorization is the Lead's | Claude Code |
| TASK-0032 | **A-STACK technology evaluation and implementation planning (bounded)** | **COMPLETE** | MSG-0098 AUTHORIZED, EPA-0005 ACCEPTED (MSG-0092), ADR-0020+AMD-01 applied | 2026-08-23 — **7/7 acceptance criteria MET**; **`EPA-0006`** delivered **PROPOSED and selecting nothing**; `git diff --name-only docs/decisions/` **empty**; **MSG-0100** | none — **no task is READY**. Selection remains open, so MSG-0098 requires stopping for the Lead; five non-blocking referrals in MSG-0100 §10 | Claude Code |
| TASK-0033 | **Bounded retrieval-engine conformance probe** (evaluation only) | **COMPLETE** — 2026-08-23, second run; **8/8 acceptance criteria MET** | MSG-0101 AUTHORIZED, EPA-0006 (TASK-0032), ADR-0020+AMD-01 | 2026-08-23 — **probe built and executed**: **24 candidate executions across 6 fixtures**, all three tiers; **nothing CLEARED**; `git diff --name-only docs/decisions/` **empty**; **MSG-0104** | none — **no task is READY**. **Verdict NOT CLEARED for the one reachable engine** (class R, SQLite 3.51.3 via `node:sqlite`), decided at **Tier 3**: unauthorized rows examined grow linearly with the collection under every index design, because the multi-valued audience conjunct cannot be pushed into the index. **Class D DISQUALIFIED and demonstrated** by the negative control failing Tier 2. **Classes S/V/K NOT CLEARED — zero execution evidence** (`docker` CLI unreachable, no PostgreSQL). One **non-blocking** clarification referred to the Lead in MSG-0104 §8 | Claude Code |
| TASK-0034 | **Update the retrieval-engine criterion and probe spec for strict Shape-1** | **COMPLETE** — 2026-08-23; **7/7 acceptance criteria MET** | MSG-0105 DECIDED, MSG-0104 (probe evidence), ADR-0020+AMD-01 | 2026-08-23 — **EPA-0006 §4.6** (criterion + probe spec) and **§4.7** (three questions, none decided) added; **all nine MSG-0104 verdicts reproduced unchanged**; `git diff --name-only docs/` **empty**; **MSG-0107** | none — **no task is READY**. **The bar is ZERO unauthorized units examined**, invariant with collection size, evidenced by **traversal-bounding plan evidence** and not by counters alone — counters prove failure, never success. **Nothing became CLEARED**; the rejected materialization-only reading is recorded as rejected; EPA-0006 §4.3's class-K *"CONFORMS structurally"* claim is **withdrawn** while its **NOT CLEARED** verdict stands. **Three non-blocking questions referred** in MSG-0107 §7, led by **whether strict Shape-1 implies physical organisation of the projection** | Claude Code |
| TASK-0035 | **Physical projection isolation evaluation against strict Shape-1** | **COMPLETE** — 2026-08-23; **8/8 acceptance items discharged** | MSG-0107b AUTHORIZED, MSG-0105 (strict Shape-1), MSG-0104 evidence, EPA-0006 classes | 2026-08-23 — **probe built and executed**: **8 isolation designs × 3 collection sizes** plus a staleness measurement, class-R test subject, negative control **failed as required**; **`U` reaches ZERO only when the routed structures contain no unauthorized row**, and a **stale materialised structure RETURNS unauthorized rows (5 of 5)**; **nothing CLEARED**, all nine MSG-0104 verdicts **reproduced unchanged**; `git diff --name-only docs/` **empty**; **MSG-0109** | none — **no task is READY.** MSG-0107b §5 requires stopping at evidence; **selection remains a later Architecture Lead decision.** Three non-blocking questions referred in MSG-0109 §9 — partition **routing**, the **staleness bound** for a temporally materialised structure, and whether **structural confinement** is admissible **E3** evidence | Claude Code |
| TASK-0036 | **Encode Q4/Q5/Q6 as strict Shape-1 clearance gates in the EPA-0006 probe spec** | **COMPLETE** — 2026-08-23; **8/8 acceptance criteria MET** | MSG-0110 DECIDED, MSG-0109 (TASK-0035 evidence), TASK-0034 criterion | 2026-08-23 — **EPA-0006 §4.9** added: **G-Q4** (routing computed from the subject's entitlements, and routing itself measured), **G-Q5** (temporal materialisation needs **BOTH** a bounded re-materialisation interval **and** a demonstrated kernel re-check), **G-Q6** (opaque-stage confinement needs **execution** evidence; construction-only is rejected). Documentary — **no test count and none claimed**; **no probe re-run**. **272 insertions, 0 deletions**, one file; `git diff --name-only docs/` **empty**; **MSG-0112** | none — **no task is READY.** MSG-0110 §6 requires stopping at the evidence-instrument update and the COMMS record. **Nothing CLEARED**; all nine MSG-0104 verdicts and all eight TASK-0035 design verdicts reproduced unchanged. **One non-blocking question referred — Q7**: **no numeric staleness threshold exists anywhere in the accepted set** (ADR-0020 leaves it under *Deliberately not decided here*), so G-Q5's bounded-interval limb is **structural, not numeric**; **no number was chosen** | Claude Code |
| TASK-0037 | **Version-transition freshness and stale-version fail-closed evidence** | **COMPLETE** — 2026-08-23; **8/8 acceptance criteria MET** | MSG-0113 DECIDED, EPA-0006 §4.9 gates, TASK-0033/0035 probe harnesses | 2026-08-23 — **probe built and executed**: **8 designs × 11 scenarios × 3 collection sizes**, two instrument placements each; negative control **failed as required**; **all eight MSG-0113 §3 evidence items demonstrated**; **`git diff --name-only docs/` empty**; **EPA-0006 §4.10** added (122 insertions / 0 deletions); **MSG-0115** | none — **no task is READY.** MSG-0113 §5 requires stopping at evidence and clearance status. **Nothing CLEARED** — 7 NOT CLEARED, 1 DISQUALIFIED. **The discriminator fired**: the two timer-only designs returned the **superseded** version before the periodic refresh and the correct one after — a fixed-time test alone would have cleared them. **Version identity alone changed nothing** (two designs differing only in it have identical grids). **The faked kernel re-check is demonstrated to be a no-op** — `kept 4/4` and leaked, where the real one `kept 0/4` and abstained — so **G-Q5.2c is satisfied for the first time**. **`U` = 4 for both**, which is the sharpest instrument finding: **a non-zero count identical between two designs conceals opposite security outcomes**. **The 11/11 design is still NOT CLEARED** on E2, E4 and unmeasured G-Q4. **No numeric threshold introduced.** Three non-blocking questions referred in MSG-0115 §10 — **Q8** (is the mandatory §3 point-2 re-check itself examination?), **Q9** (sharpens §4.7 Q3), **Q10** (MSG-0113/ADR-0018 terminology) | Claude Code |
| TASK-0038 | **Kernel-constrained retrieval / non-divergent projection evidence** | **COMPLETE** — 2026-08-24; **8/8 acceptance criteria MET** | MSG-0116a+b DECIDED (Q8/Q9/Q10), MSG-0115 evidence, EPA-0006 gates | 2026-08-24 — **probe built and executed**: **9 designs × 7 scenarios × 3 collection sizes**, two instrument placements plus a **placement-independent** structural measure; adversarial precondition held at all three sizes and the **negative control failed in 15 of 21 cases**, so the run is valid; **`git diff --name-only docs/` empty**; **EPA-0006 §4.11** added (187 insertions / 0 deletions); **MSG-0118** | none — **no task is READY.** MSG-0116a §6 and MSG-0116b require stopping at evidence and clearance status. **Nothing CLEARED** — 6 NOT CLEARED, 3 DISQUALIFIED. **The referred question is answered and the answer is negative: removing the copy eliminates divergence and does nothing for Shape-1** — the two designs holding no copy at all answer 7/7, cannot go stale, and carry the **largest `U` in the table, growing linearly with `N`**. **The four discrete conjuncts refine perfectly** — K3's residual is composed **entirely** of the three effectivity modes, with **zero** wrong-scope, wrong-audience, restricted-class or superseded units at any size. **`U = 0` is purchasable by withholding authorized content** (K4: zero at every size, **3/7** grid, empty ANSWER where an answer exists). **And the sharpest result: K7 and K8 differ by one `INDEXED BY` token** — same schema, data, indexes, answers and grid — and **`U` goes 715 → 0**, so on this engine class **whether unauthorized content is examined is decided by the query planner**, which is not part of the architecture. **Two defects in the probe's own apparatus were found and fixed before any result was reported** — a blind E1 check that had reported HOLDS for a design scanning the whole collection, and a counter placement that made one design's `U = 0` an artefact. **A6's freshness-passed-but-NOT-CLEARED status preserved**; no prior probe modified or re-run. **One non-blocking question referred — Q11** (does an exact-key seek into a scope-spanning structure violate E1?) | Claude Code |
| TASK-0039 | **K7/K8 remaining clearance evidence — E4, U1 observability, plan-independence** | **COMPLETE** — 2026-08-24; **8/8 acceptance criteria MET** | MSG-0120 AUTHORIZED, MSG-0119 (strict Q11), MSG-0118 evidence, EPA-0006 §4.6–§4.11 | 2026-08-24 — **probe built and executed**: **2 designs × 6 configurations × 4 collection sizes × 2 distributions**, three instrument variants per cell (**96 measurements**), plus an API enumeration, an opcode capture, an instrument calibration and a negative control; both validity gates passed — adversarial precondition held at all four sizes under both distributions and the **negative control failed 4 of 4**; `git diff --name-only docs/` **empty**; **EPA-0006 §4.12** added (178 insertions / 0 deletions); **MSG-0123** | none — **no task is READY.** MSG-0120 requires stopping at evidence and clearance status. **Nothing CLEARED — K7 and K8 both NOT CLEARED.** **All three gaps closed, two of them against the candidates.** **E4 is established UNOBTAINABLE by enumeration, not inferred** — no trace/profile/log API is bound by `node:sqlite`, the build lacks `SQLITE_DEBUG`, `ENABLE_SQLLOG` and `ENABLE_STMT_SCANSTATUS`, every tracing pragma is **demonstrated inert against a nonexistent-pragma control**, and `:memory:` leaves no file; under §4.6 S6 **nothing could have been cleared whatever any count showed**, stated before the results table. **`U1` turned out to be PARTIALLY INSTRUMENTABLE**, reversing MSG-0118's "not instrumentable": a function on `open_ended` — the leading column of **both** candidate indexes — is evaluated **from the index cursor** and fires per entry visited, **calibrated exactly (302 and 402) against a cohort known by construction on both plans** before use, with the transfer licence checked in every cell (**0 of 96 failures**). It is a **LOWER BOUND** and **`U1 = 0` is claimed nowhere. The sharpest result: K7 and K8 visit the SAME number of entries at every size** (10 / 74 / 717 / 2860) **while `U` reads 7 / 71 / 714 / 2857 versus 0 / 0 / 0 / 0** — so **MSG-0118's headline K7-vs-K8 finding was correctly measured and meant something narrower than it looked: K8 did not examine less, it examined the same amount where a row-access counter cannot see it**, its seek being on the upper effectivity bound so unauthorized entries are rejected **from the index**; MSG-0118 §5 result 4 said this could not be measured and it now is, at opcode level (`SeekGT → IdxGT → DeferredSeek → Column(index) → Gt → Next`). **And `ANALYZE` ALONE drives K7's `U` from 2857 to 0** while `Nidx` goes 2860 → **2861** — one entry **more**, not fewer — so **the same design measured before and after routine maintenance receives opposite `U` readings**; §4.11 result 5 said the planner decides, this says **a maintenance command decides**. **Plan-independence SPLITS**: the **reachable-structure limb of E1 is OBTAINED independently of the optimizer** via `DatabaseSync.setAuthorizer` (a surface no prior probe used), which enumerates at compilation a **superset** of what any plan opens — 8 structures, all routed partitions, **no scope-spanning structure**, identical in every configuration, and it **fails the negative control plan-independently**; it was **characterised, not assumed** (callback count invariant with `N`: 101 at M=500 and M=5000 ⇒ a compilation event, not a counter). The **confinement limb is NOT plan-independent** — 2 distinct version traversals each, and **`INDEXED BY` pinned the bounded limb and not the rest**: K8's *open* limb still became a full partition scan after `ANALYZE`. **G-Q4 MET in all 12 design × configuration pairs.** **Two defects in the probe's own apparatus were found and corrected before any result was reported** — an index-entry column mislabelled as unauthorized-only (fixed by splitting engine-measured `Nidx` from a deliberately generous derived `U1lb`, since the wrong direction was **overstatement**), and an assertion the probe's own output contradicted **in the same line** (replaced by an invariance-with-`N` measurement). **Strict Q11 preserved; K3/K4 not re-run and still NOT CLEARED**; all prior verdicts unchanged; no prior probe modified or re-run. **One non-blocking question referred — Q12**: must a probe take the index-cursor placement wherever the engine exposes one, and is a `U` taken only at row access sufficient for E2? | Claude Code |
| TASK-0040 | **Encode Q12 in EPA-0006 §4.6 S7 — index-cursor placement must be exercised** | **COMPLETE** — 2026-08-24; **8/8 acceptance criteria MET** | MSG-0125 AUTHORIZED, MSG-0124 (Q12), MSG-0123 evidence, TASK-0034 precedent | 2026-08-24 — **S7.1–S7.4 added to EPA-0006 §4.6**: MSG-0124 quoted verbatim; **S7-R1** every reachable index-cursor placement must be **exercised** (executed and captured, never described); **S7-R2** the **maximum observed across exercised applicable placements** is the reported `U`, still a lower bound; **S7-R3** row-access-only `U = 0` is **insufficient for E2** where such a placement exists unexercised — **disqualifying**, so E2 is not satisfied and by S6 the candidate is NOT CLEARED. **"Reachable" defined as occupiable-and-exercised**; a "none reachable" report is admissible **only by enumeration**, on §4.12 gap 1's nonexistent-pragma control; **unreachability is not relief** (zero stays inconclusive, E1 still required, S10 may bite). **98 insertions, 0 deletions, one file** — additive and declared; `git diff --name-only docs/` **empty**; **verdicts preserved (K7/K8 NOT CLEARED), no probe written or re-run, nothing executed**. Record: **MSG-0127** | none — **criterion update only**, additive and declared; no ADR change, nothing selected, **verdicts preserved**. One judgement call declared in MSG-0127 §7: a six-line **declared pointer note** was also added under §4.12's Q12 heading so the record does not read the question as both ruled and open; heading and existing lines untouched | Claude Code |
| TASK-0041 | **Q3 architecture response — technology-agnostic retrieval topology against the existing gates** | **COMPLETE** — 2026-08-24; **8/8 acceptance criteria MET** | MSG-0130 AUTHORIZED, MSG-0129 (Q3 ruled), EPA-0006 §4.6–§4.8, all prior evidence | 2026-08-24 — **EPA-0006 §4.13** added (**392 insertions / 0 deletions**, one file) plus a **declared pointer note** under §4.7 Q3; MSG-0129 **quoted, not paraphrased**; `git diff --name-only docs/` **empty**; **nothing executed, no probe written or re-run, no test count claimed**; **MSG-0132** | none — **no task is READY.** MSG-0130's acceptance ends at the documented architecture response; **engine selection stays blocked and must be separately authorized.** **Nothing CLEARED and nothing could have been** — the task is entirely structural and **G-Q6 rejects construction-only evidence**, so its output is a topology **plus the evidence still owed on it**. **Five invariants derived** — **N1** containment, **N2** closure of the reachable set, **N3** refinement by enumerated transition, **N4** plan-independence, **N5** non-withholding — from §4.8 finding 1, the only measured mechanism by which `U` falls. **The load-bearing claim: N1 + N2 make N4 free** — if nothing unauthorized is within reach, **no plan can examine it**, which is why §4.12's `ANALYZE` result (`U` 2857 → 0 on a maintenance command) argues for redesign rather than for a better-behaved engine; **three caveats recorded with it**, chief among them that **N1 is a containment claim and does NOT discharge E2** (§4.11 result 4: two designs at `U = 0` holding 714 and 2143 unauthorized entries). **§4.8's catalogue extended, not replaced**: **I7** boundary-refined effectivity — effectivity **is** piecewise constant in time, so it refines on the interval to the next boundary, which is **data, not a tuning parameter**; and **I8** entitlement-class materialisation. **Both NEVER MEASURED.** **Four topologies W1–W4 mapped cell by cell** to E1–E4 and G-Q4/G-Q5/G-Q6/G-Q7/G-Q7.8, each property marked **S** / **X** / **S→X** — and **they differ from one another in exactly ONE cell**, which is itself the answer: topology decides **G-Q4.1 outright**, creates the **precondition** for E1/E3/G-Q5.1/G-Q7, and decides **E2, E4, G-Q5.2, G-Q6, G-Q7.8 and N5 not at all**. **Minimum evidence stated as EV1–EV12** — evidence, not a shortlist, **adding no gate and relaxing none**. **One bounded recommendation, R1**, a criterion and not a selection; **the W1–W4 choice preserved as OPEN** because the distinguishing costs are **all unmeasured**. **Five gaps recorded — GAP-A…GAP-E**, of which **GAP-B is the one to read first: E4 is UNOBTAINABLE on the only reachable test subject, so a future probe there would clear nothing whatever the topology.** **All prior verdicts reproduced unchanged** (MSG-0132 §6); **K7/K8 still NOT CLEARED**. **One question referred — Q13** (which temporal frames must a topology answer), fail-closed default, blocks nothing. **One discovery recorded and deliberately NOT corrected — DISC-0011**: §4.11's summary says *"Six designs NOT CLEARED"* where its own table shows **seven**; no verdict is wrong and nothing downstream depends on the tally | Claude Code |
| TASK-0042 | **Architecture-bound retrieval evidence — routing, placements, transitions, I5/I7/I8, E4 re-check** | **COMPLETE** 2026-08-24 | MSG-0137 AUTHORIZED, MSG-0138 (queue write), MSG-0134/0135/0136 (Q1/Q2/Q7 ruled), MSG-0132 (§4.13 topology), EPA-0006 §4.6/§4.9/§4.13 | **8/8 acceptance criteria with evidence.** Probe run **VALID** — adversarial precondition HELD at 3 sizes x 2 distributions; retrieval control failed **3/3**; **routing** control failed G-Q4.2 as required; **freshness** control failed **6/6**; calibration EXACT on both plans; plan-transfer **0/54** non-transferable. **18 placement-grid cells + 36 freshness cells.** **ALL SIX CANDIDATES NOT CLEARED.** `U` max across placements: K7 **714**, K8 **709** (its row-access zero superseded by S7-R2), I5 **714**, I8 **714**, KR **714** (G-Q4.3 FAILED), I7 **0 on a VACUOUS bound** that **withheld 142 of 146 authorized chunks** at its interval boundary. **E4 re-checked: still NOT OBTAINABLE**, position unchanged. **DISC-0012** raised. Record **EPA-0006 §4.14**, evidence **MSG-0140**, probe `implementation/probes/TASK-0042/` | **Execute**: measure the **routing phase** and reachable physical structures with routing-phase examination counted in `U`; exercise **every applicable S7 placement** and report the **maximum** `U`; test **zero stale-answer tolerance** across update / approve / revoke / supersede **plus the abstention case**, distinguishing transition-triggered invalidation from periodic re-materialisation; measure **I5/I7/I8** only where genuinely observable, else **NEVER MEASURED / NOT CLEARED** with the exact limitation; **re-check E4 observability**. **Reuse committed harnesses; do not re-run prior cases for repetition.** **May clear nothing — clearance only if every applicable E1–E4 and G-Q4/G-Q5/G-Q6 requirement is satisfied by execution evidence.** **No selection, no implementation, no ADR change, no Docker or host install** — an environment boundary is **recorded**, not routed around | Claude Code |
| TASK-0043 | **Bounded E4 observability evidence on a second test subject** | **COMPLETE** — 2026-08-24; **8/8 acceptance criteria MET** | MSG-0141 AUTHORIZED; **MSG-0145** (operator grant to invoke `py`); MSG-0140 §6; EPA-0006 §4.13 GAP-B, §4.6 S6/S9 | 2026-08-24 — **probe run under MSG-0145**: subject **Python 3.14.5 / SQLite 3.50.4**; **3 observability surfaces present** (`set_trace_callback`, `set_progress_handler`, `set_authorizer`), **4 checked and absent** (`stmt_scanstatus`, `set_profile`, `config_log`, `trace_v2`); **`DEBUG`/`ENABLE_SQLLOG`/`ENABLE_STMT_SCANSTATUS` ABSENT — the same three as the first subject, so the difference is the BINDING, not the build**; **5 of 5 tracing pragmas inert against the nonexistent-pragma control**; every instrument run **disarmed then armed** (0→1, 0→807, 0→3). **MSG-0146** | none — **no task is READY**; MSG-0141 returns control to the Architecture Lead. **E4 is OBTAINABLE on this subject — and the inspection is ADVERSE: unauthorized passage text bound as a PARAMETER appears verbatim in the engine's own trace** (`WHERE body = 'ZZ-UNAUTHORIZED-PASSAGE-TEXT-ZZ body 7'`), **the reverse of TASK-0042 §6's surface scan, which found 0 occurrences "parameters being bound rather than inlined" and rightly declined to offer it as E4**. **C4 kept separate and negative: the trace records the INSTRUCTION, not the examination** — 200 rows examined, 100 returned, **1 trace entry**. **`set_progress_handler` is a counter carrying no content; `set_authorizer` is prepare-time and names objects, never content.** **The WAL holds the unauthorized marker 135 times and is NOT offered as E4** — a durability artefact, referred in MSG-0146 §8 R2. **Nothing CLEARED — seven probes have now cleared nothing; all six TASK-0042 candidates remain NOT CLEARED; GAP-B concerns the FIRST subject and is not withdrawn.** **BLK-0011 RESOLVED** by the grant, **not by a workaround; the runner's permission set was NOT broadened** | Claude Code |
| TASK-0044 | **Define the durability-artefact security criterion — before any measurement** | **COMPLETE** — 2026-08-25; **8/8 acceptance criteria MET** | MSG-0148b AUTHORIZED; MSG-0147 (R2 ruled); MSG-0146 §5/§8 R2; EPA-0006 §4.6 S6/S9, §9.3, ADR-0020 §6.2 | 2026-08-25 — **EPA-0006 §4.16 added — `DA-1`, the durability-artefact criterion** (**228 insertions / 0 deletions**, one file, additive). **Documentary — nothing executed, no probe/fixture/harness written, no test count claimed and none could be.** **Both structural choices DECLARED**: the label is **`DA-1`, not `E5`** (an `E`-number would read as a fifth Shape-1 evidence class, and §4.6 S6's table is the bar MSG-0148b forbids extending; `DA` verified unused before allocation), and the section is a **new §4.16 with §4.15 deliberately left unallocated** because **R1 is OPEN and proposes §4.15** for the TASK-0043 record. **§4.6 was rejected as the home on §4.6's own words** — it exists to decide *"whether a candidate satisfies the Shape-1 gate"*, and DA-1 is not a Shape-1 question. **Three limbs (DA-1.1 request-induced persistence, DA-1.2 residual retention, DA-1.3 widened reach), scope and six reasoned exclusions, evidence semantics in §4.6 S9's vocabulary UNCHANGED, and an explicit fail-closed rule (uninspectable ⇒ NOT CLEARED).** **The load-bearing part is DA-4 — provenance, not presence**: a projection durably holds the corpus it indexes, so a presence-phrased criterion would fail every engine trivially. **§4.6 S5's asymmetry rule transfers intact — a scan finding nothing satisfies nothing.** **TASK-0043's WAL figures appear only as a labelled illustration, and DA-1's verdict on that shape is `NOT CLEARED` because provenance is not established.** `git diff --name-only docs/` **empty**. Record: **MSG-0150** | none — **no task is READY.** **The durability-artefact EXPOSURE evidence task is separate and must be separately authorized** (MSG-0148b). **Nothing CLEARED — DA-1 is defined and never applied; no DA-1 verdict exists for any candidate; all six TASK-0042 candidates remain NOT CLEARED; seven probes have cleared nothing.** **E1–E4 unchanged, no gate changed, Shape-1 not weakened, no ADR touched, no numeric threshold, nothing selected.** **R1 still OPEN** — §4.15 was deliberately not taken. **One question referred — Q14**: does a DA-1 failure block selection, or is it recorded alongside the Shape-1 verdict? Fail-closed default; blocks nothing, since no candidate is eligible on any reading. **The original instruction is retained below for the record**: **Execute**: draft the precise criterion for **unauthorized policy content in engine-managed durability/persistence artefacts**, with **scope and exclusions**, **evidence semantics in §4.6 S9's existing vocabulary**, and an explicit **fail-closed interpretation** (uninspectable ⇒ **NOT CLEARED**). **Declare, do not assume, two structural choices: its label — E1–E4 may not be changed or extended — and its section.** **It must be distinguishable from E4 in its own text**: E4 is **execution observability**, this is **content at rest**. **NO measurement of any kind** — TASK-0043's WAL figures may appear only as an **illustrative shape, labelled as such**. **No engine selection or comparison, no gate change, no Shape-1 weakening, no ADR modified, no numeric threshold.** **The exposure evidence task is separate and must be separately authorized** | Claude Code |
| TASK-0045 | **Bounded DA-1 evidence — measure durability artefacts against the existing criterion** | **COMPLETE** — 2026-08-25; **8/8 acceptance criteria MET** | MSG-0153 AUTHORIZED; **EPA-0006 §4.16 DA-1…DA-7** binding as written; MSG-0147 (R2); MSG-0148b (criterion/measurement separation); §4.15 | 2026-08-25 — **probe built and executed**: **8 configurations across 5 in-scope DA-2 artefact classes**, file-backed fixture on the **FIRST** subject (SQLite **3.51.3** via `node:sqlite`, node **v24.15.0**); **both mandatory negative controls FIRED**, so the run is **VALID**; `git diff --name-only docs/` **empty**; **MSG-0155** | none — **no task is READY.** MSG-0153 returns control to the Architecture Lead at the evidence. **DA-1 is NOT CLEARED for the subject measured**, by **two independent routes** — **DA-5 row 1** on a single occurrence and **DA-6** on a limb no available instrument can reach. **The apparatus is the part that makes the numbers mean anything**: **DA-4 makes a grep meaningless** under a shared projection, so attribution rests on a **measured-empty baseline** — `wal_checkpoint(TRUNCATE)`, then the artefact **read back at 0 bytes** — and where that baseline was unavailable (`-shm`, which a checkpoint does not empty) **the weaker instrument is reported as weaker.** **The sharpest finding was not the one the probe was built to look for: a request that updated ONLY rows the subject was entitled to — ordinary access accounting — still left the unauthorized marker in the rollback journal 236 times**, because **journalling is page-granular and a page holding an authorized row holds its unauthorized neighbours**. **It depends on no post-filtering, no bad plan, and no examination of any unauthorized row** — so unlike §4.11's planner result and §4.12's `ANALYZE` result, **a better query does not answer it**, and **§4.13's N1 containment is the kind of thing that does. This is the first measurement here arguing for containment on grounds independent of `U`.** **DA-4 is demonstrated on the run's own output rather than argued**: the **same artefact** under **ingest** (26 occurrences, **NOT a finding**, DA-4 row 1) and under **request resolution** (236, a **FINDING**, DA-4 row 2) — **opposite verdicts on the same observation shape**, which a presence-phrased criterion could not have produced. **An expectation failed and is recorded as measured**: the **append**-shaped cache write journalled **nothing**, because a rollback journal holds original images of **overwritten** pages and appends overwrite none — so **two request-induced writes differ completely in what they make durable, and the difference is `INSERT` versus `UPDATE`.** **Each limb carries its own verdict per artefact**: **DA-1.1 NOT CLEARED** on **rollback journals** (**236 occurrences on a conforming request** — the page-granularity result); **spill-file DA-1.1 corrected to "not sufficient alone" (MSG-0156)** — the conforming request held **`UNAUTH x0`** and the **5 228 784-byte, 10 000-marker** spill was **NC-1, the negative control**; **DA-1.2 NOT CLEARED (DA-6)** on spill files — **the probe can see the directory entry go and cannot see whether the blocks did**, which is **the criterion being inconvenient and taken as written**; **DA-1.3 FINDING** on spill files (**outside the store directory, at a path the engine chooses**) and on **engine-produced backups** (**measured, not asserted** — the engine wrote a complete second copy outside the store with **no constraint of its own on the destination**). **Two defects in the probe's own apparatus were found and fixed before any result was reported**, both **the presence-versus-provenance error DA-4 exists to prevent, committed by the probe written to test for it** — an **ingest** write reported as a DA-1.1 finding, and a backup-reach verdict **asserted rather than measured**; **fixing the first is what produced the page-granularity result.** **Nothing CLEARED — eight probes have now cleared nothing**; **all six TASK-0042 candidates remain NOT CLEARED**, **no Shape-1 verdict moved**, **no gate changed**, **no criterion adjusted**, **no ADR touched**, **no numeric threshold**, **nothing installed**, **no `py` grant sought or used** — the second subject was **not** invoked. **Stated limitations, not omissions**: one subject only (**§4.15: binding, not build — no class generalization**), **DA-1.3's `/data/docker` limb NOT MEASURED** (no PCI server deployment exists), replication streams **NOT APPLICABLE**, and **byte-scanning would miss re-encoded content**. **Two questions referred, neither blocking — Q15** (does this become an EPA-0006 section? **deliberately not taken**: §4.15 is the precedent for *referring* that, and taking a number here would be the silent architecture change the precedent prevents) and **Q16** (does the page-granularity mechanism bear on the §4.13 W1–W4 topology question?). **The original instruction is retained below for the record**: **Execute**: measure **DA-1.1 request-induced persistence**, **DA-1.2 residual retention** and **DA-1.3 widened reach** across DA-2's in-scope artefacts — WAL, rollback journals, shared-memory files, **temporary/spill files**, engine-produced backups — **each with its own result**, **DA-3's exclusions respected**. **DA-4 is the hard part: DA-1 is about PROVENANCE, not presence** — a probe that greps an artefact for a marker measures nothing, because under a shared projection unauthorized bytes exist by construction. **Provenance not separable ⇒ NOT CLEARED (DA-6), never "presumed ingest"**; **absence alone is not sufficient** (§4.6 S5). **Mandatory negative control that must actually produce a DA-1 finding.** **Record subject, runtime, `journal_mode` and maintenance state per measurement** — a checkpoint can empty a WAL. **The criterion is authoritative and is NOT adjusted by this task.** **Satisfying DA-1 clears nothing**; **no selection, no gate change, no ADR touched, nothing installed** — **`py` is granted for TASK-0043's probe only** | Claude Code |
| TASK-0046 | **Bounded Q16 topology/durability evidence — does physical containment prevent the page-granularity exposure?** | **COMPLETE** — 2026-08-25; **9/9 acceptance criteria MET** | **MSG-0157** (Q15/Q16 **DECIDED**) AUTHORIZED; the Lead's committed task definition [`TASK-0046-q16-topology-durability-evidence.md`](TASK-0046-q16-topology-durability-evidence.md) (`bafe5c9`); TASK-0045 COMPLETE; **EPA-0006 §4.13** (N1/N2, W1–W4) and **§4.16** (DA-1…DA-7) binding as written | 2026-08-25 — **probe built and executed**: **16 configurations** (4 physical organizations × 2 journal modes × 2 request-induced write shapes) on the **FIRST** subject (SQLite **3.51.3** via `node:sqlite`, node **v24.15.0**, `secure_delete=0`, `auto_vacuum=0`); **both mandatory negative controls FIRED**, so the run is **VALID**; `git diff --name-only origin/main -- docs/` **empty**; **MSG-0158** | none — **no task is READY.** **The answer has two parts and the second is the one that matters.** **Part one: physical containment PREVENTED the exposure the task asked about** — under **W-A**, the TASK-0045 access-accounting shape, the **shared** layout made unauthorized content durable (**200 markers across 6 journalled page images, all 6 carrying BOTH classes**) and **no isolated layout did**. **The mechanism is EXHIBITED, not re-asserted**: the artefacts were **parsed**, so every page the request made durable was **identified by number and classified individually**, and **each image was verified byte-identical to an independently read copy of the store** — which is what success criterion 1 asks for and what a marker count cannot supply. **Part two: the same isolated topology failed a different way.** **L4 — isolated stores, but the store had previously held the OTHER partition and was re-materialised — made the unauthorized marker durable 15 times under W-B**, an **appending** cache writeback, with **no unauthorized row anywhere in reach**. **The mechanism is not co-residency of ROWS but of BYTES**: the dropped partition's pages stay on the free list with their content (**10 pages at `UNAUTH x15` each, measured**), the append consumes one, and **journalling it writes its ORIGINAL IMAGE — the old partition's bytes — into the artefact**. **This INVERTS TASK-0045**, where W-A leaked and W-B *"journalled nothing, because a rollback journal holds original images of overwritten pages and appends overwrite none"* — **correct about a store whose free list is empty; in a re-materialised store the append does overwrite something. Same shape, opposite result, and the difference is the store's HISTORY.** **Not a corner case: §4.13 N3 REQUIRES partitions to be rebuilt on invalidating events, so a W1–W3 topology is in L4's state most of its life.** **L4 satisfies N1 AS WRITTEN** — there is no unauthorized *entry*, no query reaches those bytes and **no `U` counter or `Ustruct` can see them** — so **N1 and DA-1 are asking different questions of the same page**; **no invariant was amended and the question is REFERRED (Q19)**. **Two apparatus defects found and fixed before any result was reported**: a parser that required the journal **magic**, which is **ZEROED mid-transaction because the engine writes it last** (cause established, not guessed; replaced with byte-for-byte verification against an independent copy — a stronger check than the header), and a comparability assertion that **confused what the topology puts IN REACH with what the request TOUCHED** and would have failed the run for being correct. **Controls kept structurally separate from subjects per MSG-0156** — both controls sit on the **isolated** layout, where a null result needed defending, and their numbers enter no result row. **Nothing CLEARED — nine probes have now cleared nothing**; **all six TASK-0042 candidates remain NOT CLEARED**, **DA-1 stays NOT CLEARED for this subject on MSG-0155's two routes, neither of which this run touched**, **no gate/criterion/invariant/ADR changed, no topology selected** (W1–W4 still differ on cost — §4.13 GAP-C), **no numeric threshold, nothing installed**, second subject **not** invoked. **Three questions referred, none blocking — Q17** (the queue-row mechanism), **Q18** (does this become an EPA-0006 section? **deliberately not taken** — §4.17 is already fixed for TASK-0045's evidence and **that promotion has no authorized task**), **Q19** (do N1–N5 need a limb about bytes rather than entries?). **The original instruction is retained below for the record**: **Execute** the Lead's committed task file, which is the specification and is not summarised away: measure a **shared physical projection** against a **physically isolated/routed organization** under **the same request-induced write shape**, and inspect the applicable DA-2 artefacts by the **DA-4 provenance method**. **The shared arm must directly measure the page-co-residency mechanism, not merely re-assert TASK-0045's number.** **Provenance not separable ⇒ NOT CLEARED (DA-6)**, never an inferred pass; **absence alone is not sufficient** (§4.6 S5 / DA-5 row 3). **A negative control MUST produce a DA-1 finding or the run is INVALID** — and per **MSG-0156** a control's finding may never also be reported as a finding about the subject. Report **per physical organization and per artefact**, in **DA-5 vocabulary**, and **state whether physical containment prevents the exposure for the tested configuration WITHOUT generalizing to an engine class** (§4.15: the subjects differ in the binding, not the build). **No E1–E4, G-Q4…G-Q7, S1–S11 or DA-1…DA-7 gate may change; no engine selected, adopted, cleared, deployed or implemented; synthetic fixtures only; no install or host change; no numeric threshold** | Claude Code |
| TASK-0047 | **Q19 byte-level durability containment evidence — requirement definition** | **COMPLETE** — 2026-08-25; **7/7 required outcomes MET** | Q19 AUTHORIZED (MSG-0160); TASK-0046 COMPLETE | 2026-08-25 — **EPA-0006 §4.18 delivered: N6, with limbs N6.1–N6.3**; **142 insertions / 0 deletions, one file, additive**; **§4.13's N-table untouched** (a declared pointer note added below it, on §4.12's Q12 precedent); `git diff --name-only docs/` **empty**; verified from `origin/main`. Record: **MSG-0161** | **TASK-0048 — bounded N6 measurement — is now READY** (reconciled 2026-08-25 under **MSG-0161 Q20 = YES** and the Lead's committed task file `TASK-0048-n6-measurement.md`, `fef8bad`). **N6 requires that resolving a request must not make unauthorized BYTES durable, including bytes already in the store's physical history.** **N1 is preserved and unweakened** — L4 **satisfies N1** (no unauthorized entry in reach, `Ustruct` zero) **and still made the previous partition's bytes durable** through a free-list page, so **widening N1 was rejected: a rule that cannot be violated independently of another is not a separate rule.** **N6 is a topology obligation; DA-1 is the criterion that makes a violation visible; satisfying N6 clears nothing** and creates no §4.6 S6 evidence class. **Nothing measured against N6 — no candidate holds an N6 status**, and **unmeasured is not satisfied**. **Nothing selected, adopted, deployed, implemented or cleared; no invariant amended; no verdict moved; nine probes have cleared nothing.** **One question referred — Q20** (should a bounded task now measure N6, and against which topologies?) | Claude Code |
| TASK-0048 | **Bounded N6 measurement — measure byte-level durability containment against EPA-0006 §4.18** | **COMPLETE** — 2026-08-26; **7/7 required outcomes MET** | MSG-0161b (Q20 = YES); MSG-0160; §4.18; MSG-0162 (queue write) | 2026-08-26 — **probe built and run: 4 topologies × 2 journal modes × 2 write shapes = 16 configurations**, each with a **baseline before the request** and artefacts read **while the transaction was open**; **both negative controls behaved as required — RUN VALID**; `git diff --name-only docs/` **empty**. Record: **MSG-0163** | **TASK-0049 — the Q18 §4.19 promotion — is now READY** (reconciled 2026-08-26 under **MSG-0161b Q18 = YES** and the Lead's committed task file `TASK-0049-epa-0006-419-promotion.md`, `9f8f416`; its sequencing prerequisite — TASK-0048 COMPLETE — is now satisfied). **N6 is VIOLATED by L4** — isolated stores **after re-partition** — **on this subject: L4 satisfies N1 (no unauthorized entry in reach) and still failed N6**, which is the distinction §4.18 exists to make, now **measured against the criterion rather than inferred**. **N6.1 + N6.2 FINDING under W-A in both journal modes** (`wal` 1 of 11 frames carrying; `delete` journal marker ×20) **with 0 unauthorized rows in the store, so the bytes came from its history**; **N6.3 VIOLATED in all four L4 arms** — 1 store page carrying unauthorized bytes with no unauthorized row. **L3 satisfied N6.3 on this measurement; L1 produced findings only where the shared layout holds the rows in reach; L2 produced none.** **This run did NOT reproduce TASK-0046's W-B leak, and says so**: this L4 retained **1 residue page against TASK-0046's 10**, so **W-B's silence is a property of the fixture, not evidence that appends are safe** — DA-5 row 3. **Four apparatus defects found and fixed before any result was reported**, two of which **understated the subject**: artefacts scanned after an autocommit (would have reported **DA-6 sixteen times**), a live-row count that missed L2's sibling structure, a journal parser starting at the wrong offset (**"no pre-image" for a journal carrying the marker 800 times**), and a verdict scored on parsed images alone (**would have scored the L4 delete finding as "no finding"**). **Nothing CLEARED — ten probes have now cleared nothing; no candidate verdict moved; no gate changed; N1 preserved throughout.** **One question referred — Q21**: does an N6 violation belong in §4.13's EV-list, and at what strength? | Claude Code |
| TASK-0049 | **Promote TASK-0046's topology/durability evidence into EPA-0006 §4.19** | **COMPLETE** — 2026-08-26; **7/7 required outcomes MET** | **MSG-0161b** (Q18 = **YES**); the Lead's task file; **MSG-0162 §5**; **MSG-0158**; TASK-0048 COMPLETE | 2026-08-26 — **§4.19 delivered**: the full 16-configuration result table, **200 markers across 6 journalled page images all carrying both classes** under L1/W-A, and **L4/W-B making the marker durable 15 times with no unauthorized row in reach**; mechanism **exhibited, not asserted** — pages identified, classified and **byte-verified against an independently read copy**. **167 insertions / 0 deletions, one file**; **zero deletions confirms no gate, table or verdict was edited**; `git diff --name-only docs/` **empty**; verified from `origin/main`. Record: **MSG-0165** | none — **no task is READY.** **Part two is the counter-example inside the same evidence: isolation answered W-A and did not answer W-B.** **§4.19 INVERTS §4.17's W-B result and a declared pointer note now says so IN §4.17** — §4.17's reasoning (*"appends overwrite none"*) is **correct about a store whose free list is empty**, and **neither section is withdrawn**. **L4 satisfies N1 as written** — `U` and `Ustruct` are entry counters and blind to the bytes — and **N1 was referred, not amended**; the referral became **Q19 → §4.18 N6**. **MSG-0163's failure to reproduce the L4/W-B arm is recorded WITHOUT reconciling §4.19 against it**: a later absence is not evidence that this presence was wrong (**DA-5 row 3**). **Promotion clears nothing — ten probes have cleared nothing; nothing selected; no verdict moved.** | Claude Code |
| TASK-0050 | **Discharge GAP-B — is there a reachable subject where E4 is obtainable AND non-adverse?** | **COMPLETE** — 2026-08-26, **7/7**; **outcome 7 discharged and BLK-0013 CLEARED** when the operator reconciled the divergence and pushed (`f9f8f07..dd99f37`); verified from `origin/main` by the Lead in **MSG-0169**. *(Was "BLOCKED on publication" until MSG-0169.)* **Executed in full; outcomes 1–6 and the referral MET; the answer is NO.** **Outcome 7 UNMET: `origin/main` moved mid-run and the push was REJECTED** — records committed at `339157f` and **not on `main`**. **BLK-0013.** Not rounded up | **MSG-0167** AUTHORIZED (operator authorization 2026-08-26); **EPA-0006 §4.13 GAP-B** (undischarged) and **EV5**; **§4.15** (MSG-0146); **§4.12** (F15); **§4.6 S6/S9/S10** binding as written; TASK-0049 COMPLETE | 2026-08-26 — **executed; harness built and run** (`implementation/probes/TASK-0050/`, `f063f09`). **No reachable subject supplies E4 both OBTAINABLE and NON-ADVERSE.** **GAP-B NOT discharged, NOT withdrawn, NOT weakened.** Subject 1 (SQLite **3.51.3** / `node:sqlite` / Node **v24.15.0**) re-established **NOT OBTAINABLE** on a **WIDER** enumeration than §4.12 or §4.14 used — **21 C-API names**, **49 compile options**, **7 of 7** tracing pragmas **inert** against the F15 control, and **`sqlite_stmt` / `bytecode` / `tables_used` / `sqlite_dbpage` ABSENT FROM THE BUILD**. **Four surfaces exercised disarmed-before-armed with C1–C4 each**; **four controls, all behaved — run VALID**, one stronger than a silence test (a **DENYING** authorizer must make a prepare fail, and it did). **Subject 2 NOT re-measured** — MSG-0145's `py` grant is scoped to TASK-0043 and the only allowlisted invocation is that task's probe, which this task may not re-run as new evidence. **REFERRAL MADE, and it points the OPPOSITE way to the one anticipated**: §4.15's adversity is a **BINDING CHOICE, not an engine necessity** — `sourceSQL` carries **0** hits on parameter-bound unauthorized text where `expandedSQL` carries **1, verbatim**. **The gate is NOT shown unsatisfiable.** Records **MSG-0168**, **BLK-0012** (OPEN — the reach the answer is bounded by), **DISC-0014**. **Qualification, not rounded up:** outcome 7's *"verification from `main`"* limb is bounded by a **`git fetch` denial** to this runner — corroborated by the Supervisor heartbeat (`21:56:59Z`, `head 9d71790…`), **not live-checked** | **Awaiting the Architecture Lead.** Four actions, in the record's recommended order: **(1) rule the MSG-0168 §7 referral** — *is E4 satisfiable by a surface built on the **unexpanded** statement text, given its non-adversity holds only for parameter-bound content and is defeated by inlining?* **Both answers move the clearance bar, so neither was taken.** **(2)** decide whether MSG-0168 §4–§6 are **promoted into EPA-0006** as a new section, on the MSG-0153 / TASK-0049 mechanism — **not done here, no authorization exists for it**. **(3)** decide **BLK-0012** — but **option A is to rule the referral first, and it costs nothing**, because a *no* makes the other options wasted effort. **(4)** note **DISC-0014** when the next enumeration is specified. **No task is proposed as READY and none may be.** **Also reported, deliberately NOT fixed** on the MSG-0037 / MSG-0039 precedent: **MSG-0166, MSG-0167 have no row in `comms/README.md`, and DISC-0013 has none in `discoveries/README.md`** — adding another author's index rows without authorization is the pattern those two decisions declined to set. **Historical, retained:** the original instruction read — Execute exactly as the Lead's task file defines it — **`TASK-0050-gap-b-e4-subject.md`** (deliberately named here and NOT linked from the dependency cell: see DISC-0013); **where the file and this row differ, the FILE WINS and the difference is reported**. **GAP-B blocks clearance INDEPENDENTLY OF TOPOLOGY and §4.13 calls it "the one to read first"**: E4 is **NOT OBTAINABLE** on the subject every Shape-1 measurement was taken on, so a probe there **"would clear nothing whatever the topology"**. **A second subject did NOT fix it** — §4.15 found E4 **OBTAINABLE and ADVERSE**: unauthorized text **bound as a PARAMETER** appeared **verbatim** because **the trace emits the EXPANDED statement**. **So the question is not whether a surface exists but whether one PASSES**, on a subject that can also carry the Shape-1 apparatus. **A finding that NONE does is a complete and valid outcome.** **Enumerate with the F15 nonexistent-pragma control** — without it "reported nothing" and "never armed" are the same observation — and **run every instrument disarmed before armed**. **State C1–C4 including C4**: a per-statement surface **cannot measure `U`, is not E2, and cannot substitute for an S7 placement**. **Unobtainable is NOT relief** (EV5). **E4 may NOT be weakened to let a subject pass** (MSG-0119). **A test subject is an INSTRUMENT, not a candidate** (MSG-0141) — **no candidate gains E4 evidence from this task**; no engine selected, adopted, deployed, implemented or cleared; no gate, invariant or verdict changed; no generalization to an engine class (§4.6 S10). **If it needs an install, a build with different flags, or any host change — record a BLOCKER and STOP; do not route around it** (BLK-0008/0010/0011). **If the evidence suggests obtainability and adversity are INSEPARABLE for statement-trace surfaces, REFER it — that bears on the clearance bar and belongs to the Lead.** **Stop if `origin/main` moves mid-run** | Claude Code |
| TASK-0051 | **Define `AB-1`, the application-binding requirement** | **COMPLETE** — 2026-08-26; **8/8 required outcomes MET**, one carrying a stated qualification (below) | **MSG-0171** (Q22 conditional YES) and **MSG-0172 §5** AUTHORIZED; **EPA-0006 §4.16** (the DA-1 precedent) and **§4.6 S6** binding as written; TASK-0050 COMPLETE | 2026-08-26 — **EPA-0006 §4.20 delivered**: **`AB-1`** stated as a **prohibition on the APPLICATION** with **four separable limbs `AB-1.1`–`AB-1.4`**, plus `AB-0` (declared choices + the recorded collision check), `AB-2` (the E4 relationship), `AB-3` (what it does NOT do), `AB-4` (evidence semantics in §4.6 S9's vocabulary), `AB-5` (fail-closed). **241 insertions / 0 deletions, one file** — **zero deletions is the mechanical proof no existing line was reworded**; **one declared pointer note** below §4.6 S6's existing note. `git diff --name-only docs/` **empty**. **Documentary — nothing built, nothing measured, no test count claimed and none could be.** Record: **MSG-0173** | none — **no task is READY.** **`AB-1` DISCHARGES NOTHING, and the section's FIRST element is the blockquote saying so**: **GAP-B UNDISCHARGED, E4 UNMET, all six §4.14 candidates NOT CLEARED, eleven probes have cleared nothing.** Q22 removed **one** objection; **the second was measured in the same run and stands untouched — none of the surfaces found is a LOG** (C1 = NO on every member; **`sqlite_stmt`, which would have been one, is absent from the build**), so **`AB-1` is a condition a surface must satisfy IN ADDITION to being a log, never a substitute** (MSG-0171 §4). **`AB-1.4` is the limb that will be treated as ceremony and is not: §4.6 S5 applied to the CONTROL rather than the counter** — a green pipeline is a **zero count**, and **a check never observed rejecting anything is indistinguishable from one misconfigured, mis-scoped or silently disabled**; §4.12's calibration-before-use, TASK-0048's `fail()` interlock and **MSG-0169 §2's *"VALID" was an assessment, not an interlock*** are all cited as the precedent. **One judgement call DECLARED**: the prohibition is phrased over **corpus content**, not over *unauthorized* content, because **at statement-construction time the constructing code cannot be relied on to know whose entitlements a passage falls outside** — a prohibition over *unauthorized* content would be unenforceable by exactly the tooling `AB-1.1` requires. **Strictly the stronger reading; it relaxes nothing and every case MSG-0171 names is inside it**; a one-line change if the Lead intends the narrower phrasing. **Collision check PERFORMED and RECORDED, not asserted** — **zero `AB` occurrences** in `docs/` and `implementation/architecture/`, and **every identifier in EPA-0006 enumerated rather than recalled**, tabulated per namespace in `AB-0`. **Two things it turned up: `E5` occurs only inside §4.16 `DA-0` as the REJECTED label**, and **the highest `EV` in the record is `EV12` — `EV13` is ruled by MSG-0172 §2 and is NOT written here**, the task file naming it a separate obligation, so **the gap is declared rather than left to be discovered**. **Both obligations this task does NOT perform are named in the section's own boundary**: the **EV13/Q14 update** and the **L4/W-B re-measurement** (authorized, NOT READY). **QUALIFICATION, not rounded up:** required outcome 7's *"verified from `origin/main`"* limb is bounded by a **`git fetch` / `git ls-remote` DENIAL to this runner** — *"`origin/main` has not moved"* is **INFERRED at session start and enforced by the push's own non-fast-forward rejection** (**BLK-0013** is the precedent where that interlock fired), **not live-checked**; **no workaround was taken.** **MSG-0172 §3 ruling 2's standing pre-push check was RUN** before the queue row was pushed. **Also reported, deliberately NOT fixed** on the MSG-0037 / MSG-0039 precedent: **`MSG-0169`, `MSG-0170`, `MSG-0171` and `MSG-0172` have no row in `comms/README.md`** (alongside the still-unregistered MSG-0166/0167 and DISC-0013) — **the sixth index-drift finding, and the same shape as the defect Q17 ruled on.** A row for **MSG-0173**, this session's own record, **was** added. **Nothing selected, adopted, deployed, implemented or cleared; no gate, invariant, criterion or verdict moved; E4 not weakened** (MSG-0119). **The original instruction is retained below for the record**: Add a new EPA-0006 section defining **`AB-1`** as a **prohibition on the APPLICATION**, following §4.16's form. **Carry the four properties in terms, each a separate limb: automated** (tooling, not review), **build-failing** (a warning is not enforcement), **covering every path that can reach the projection store**, and **evidenced by a test demonstrated to FAIL on an inlined statement**. **State what it does NOT do: it does NOT discharge GAP-B, does NOT satisfy E4, does NOT make a non-log surface into a log, and clears nothing** — `AB-1` is a condition a surface must satisfy **IN ADDITION to being a log**, never a substitute. **Declare `AB` as a new namespace and RECORD the collision check** against E1–E4, S1–S11, U1–U5, G-Q4…G-Q7.8, I1–I8, N1–N6, W1–W4, EV1–EV13, F1–F16, DA-1…DA-7, GAP-A…GAP-E. **DOCUMENTARY ONLY — build nothing** (no linter, rule, CI config or test; writing the check is a separate authorization that does not exist) and **measure nothing**. **Additive: zero deletions**; use a declared pointer note rather than rewording an existing section. **No gate, invariant, criterion or verdict changes; E4 NOT weakened** (MSG-0119); nothing selected, adopted, deployed, implemented or cleared. **Do NOT imply GAP-B is closer to discharge — the second objection, that none of the measured surfaces is a log, is untouched.** **Two obligations this task does NOT perform: the EV13/Q14 EPA-0006 update, and the L4/W-B re-measurement** (authorized, NOT READY). **Use MSG-0173 or later.** **Stop if `origin/main` moves mid-run** | Claude Code |
| TASK-0052 | **Encode EV13 and the Q14 disqualification ruling in EPA-0006** | **COMPLETE** — 2026-08-26; **8/8 required outcomes MET**, one carrying a stated qualification (below) | **MSG-0172 §1–§2** AUTHORIZED (Q14 and Q21 ruled) and **§8** (recorded outstanding); **MSG-0174** (defined and queued); **MSG-0175 §3** (reconciled READY); **EPA-0006 §4.13** EV-list and **§4.16** binding as written; TASK-0051 COMPLETE | 2026-08-26 — **`EV13` is in §4.13's EV-list and the Q14 ruling is recorded at the end of §4.16.** **178 insertions / 0 deletions, one file** — **zero deletions is the mechanical proof no existing line was reworded**; `git diff --name-only docs/` **empty**; **no non-markdown file touched**; verified from `origin/main`. **Four insertion points: the `EV13` row + a declared pointer note in §4.13; a declared pointer note under §4.16's existing `Q14 — Surfaced, NOT decided` heading; the new `#### Q14 — RULED by MSG-0172 §1` subsection at the end of §4.16; and one declared pointer note each in §4.18 and §4.20.** Record: **MSG-0176** | none — **no task is READY.** **NOTHING IS DISCHARGED AND NO GATE IS CREATED: §4.6 S6's table is untouched** (mechanically — §4.6 spans lines 364–655 and the first added line is 1924), **N6 still clears nothing**, and **`EV13` requires N6 to be MEASURED, not passed.** **No candidate verdict moves and none could — DA-1 has been defined and never applied, so there is nothing to re-score.** **`EV13` is discharged for NO candidate**: TASK-0048 measured N6 on a **test subject**, and **a test subject is not a candidate** (§4.6 S11) — a distinction §4.18's closing bullet needed said out loud and now has. **The Q14 heading was deliberately NOT changed** — §4.13's Q13 note changed its heading only because **MSG-0133 instructed it in terms**, and MSG-0172 instructs no such change, so the **§4.12 Q12 form** was used; the superseded *"fail-closed default until ruled"* paragraph is **named and left standing**. **One argument added from this record's own measurements rather than asserted**: the write route needs no open read route — **§4.17's journal finding arose on a request that examined no unauthorized row, and §4.19's L4 finding with no unauthorized row in reach at all** — so *a bar decisive on one route and advisory on the other is not a bar*. **TWO DECLARED JUDGEMENT CALLS, both pointer notes beyond the two required edit points and both made under required outcome 6**: **§4.18**, so `EV13` is not read as contradicting *"satisfying N6 clears nothing"*; and **§4.20**, because **TASK-0051's `AB-0` collision table row *"EV1…EV12 only"* went stale the moment `EV13` was written** — **left standing deliberately, because the enumeration was a MEASUREMENT and editing a measurement after the fact destroys what made it trustworthy**; the collision result is unaffected, `EV13` not being an `AB` token. **A small vindication of TASK-0051's restraint: it DECLARED the `EV12`/`EV13` gap instead of quietly filling it, which is why this task had a clean seam.** **QUALIFICATION, not rounded up:** `git fetch` was **DENIED to this runner** (twice, including with the sandbox override), so this session did not itself read the remote — **but `.git/FETCH_HEAD` was VERIFIED written at 09:07 local, ~1 minute before the session started, by the Supervisor cycle that launched it, recording `origin/main` at `0eaa975` = local `HEAD`.** That covers the start of the run and **not movement during it**; for that the detector is unchanged and is an **interlock rather than a claim** — **all three pushes were FAST-FORWARD** (`0eaa975..4ef6533`, `4ef6533..6083b0d`, `6083b0d..19875be`; BLK-0013 is where that interlock fired). **No workaround taken.** **MSG-0172 §3 ruling 2's standing pre-push check was RUN.** **One difference between the task file and this row REPORTED as the row requires**: the file's status line reads *"AUTHORIZED — NOT READY"*, the row reads READY — **not a conflict**, because the file's own next sentence makes READY conditional on the Lead reconciling it as the single READY task, **which `0eaa975` and MSG-0175 §3 did**; **the task file was NOT edited.** **Seventh index-drift finding reported and deliberately NOT fixed** on the MSG-0037 / MSG-0039 precedent — **MSG-0166/0167/0169/0170/0171/0172/0174/0175 have no row in `comms/README.md`, and DISC-0013 none in `discoveries/README.md`**; a row for **MSG-0176**, this session's own record, **was** added. **TASK-0053 remains AUTHORIZED and NOT READY — this session did not mark it READY and may not.** **GAP-B UNDISCHARGED, E4 UNMET, all six §4.14 candidates NOT CLEARED, eleven probes have cleared nothing; nothing selected, adopted, deployed, implemented or cleared; E4 not weakened** (MSG-0119). **The original instruction is retained below for the record**: Execute exactly as the Lead task file `TASK-0052-encode-ev13-and-the-q14-ruling.md` defines it; **where the file and this row differ, the FILE WINS and the difference is reported**. **Add `EV13` to the §4.13 EV-list** at EV2's strength — **"N6, measured"**, provenance established before any finding, **residue after an N3 transition examined, not only live entries**, **unmeasured is not satisfied**. **Record the Q14 ruling against §4.16 in BOTH limbs, kept separate: DA-1 DISQUALIFIED ⇒ the candidate is DISQUALIFIED for selection; DA-1 NOT CLEARED ⇒ cannot support selection and does NOT itself disqualify.** **Reproduce MSG-0172's reasoning rather than paraphrasing it** — a confirmed DA-1 violation is **the same confidentiality failure strict Shape-1 prevents, arriving by the WRITE path**, and treating unproven as violation **would let a missing instrument convict an engine** (§4.6 S5). **State the asymmetry explicitly** so it does not read as contradicting DA-5 consequence 1: **passing a necessary condition is not evidence of the whole; failing one is decisive.** **EV13 and Q14 create NO new clearance gate — §4.6 S6's table is untouched and N6 still clears nothing.** **DOCUMENTARY ONLY: measure nothing, build nothing, run no probe.** **Additive, zero deletions**; declared pointer note rather than rewording. **No candidate verdict changes — DA-1 has never been applied to a candidate, so nothing is re-scored; say so.** **Do NOT imply GAP-B is closer to discharge.** **Numbering: MSG-0173 is DOUBLY CLAIMED (0173a executor, 0173b Lead) — use MSG-0176 or later and check `comms/README.md` first.** **Stop if `origin/main` moves mid-run** | Claude Code |
| TASK-0002 | Make test entry points shell-independent | **ABORTED** | — | 2026-08-19 | none — premise disproven by measurement | — |

> **One arithmetic correction, carried from DISC-0011 — 2026-08-24.** **TASK-0038's row above says
> *"6 NOT CLEARED, 3 DISQUALIFIED"*, and so do the MSG-0118 ledger row and the TASK-0038 section.**
> **The tally is wrong.** §4.11's verdict table lists **ten** rows — **seven NOT CLEARED** (K0–K4, K7,
> K8) and **three DISQUALIFIED** (K5, K6, NC); counting the negative control out gives **seven and
> two**. **Neither reading produces six.**
>
> **The three places above are deliberately NOT edited**: each faithfully reproduces what MSG-0118 and
> EPA-0006 §4.11 say, and rewriting a quotation to fix the source's arithmetic would misquote it.
> **Every individual verdict is correct and unambiguous** — **K7 and K8 remain NOT CLEARED**, K5, K6
> and NC remain DISQUALIFIED — and **nothing downstream depends on the count**. **Correcting §4.11
> itself needs the Architecture Lead's authorization**; DISC-0011 records it and is open.


**TASK-0019 is COMPLETE (2026-08-21).** It was authorized by MSG-0050, reconciled into this queue in `39eabdb`, and executed by a supervisor-started session on its scheduled 06:37:13Z cycle. It was maintenance/audit work only, not a new product work package.
> **Attempted and blocked — 2026-08-22, BLK-0010. Read this before scheduling another cycle.**
> A supervisor-started runner (pid 24140) reached TASK-0027's **first action** and stopped there. The
> corpus read was refused: *"Claude Code may only list files in the allowed working directories for
> this session: `D:\Work\pci-platform`"*. **The corpus is UNKNOWN to that session and no survey figure
> of any kind was produced.** The queue/tree condition that stopped the *previous* cycle (BLK-0009) had
> cleared by then — this is a different, **non-transient** boundary.
> **Retrying will not clear it.** It needs one decision: **MSG-0082 option A** (a narrow read
> permission for `D:\Work\pci-corpus\`), **B** (run TASK-0027 interactively), or **C** (an
> operator-supplied extraction). **TASK-0027 needs no re-authorization** — MSG-0080 still authorizes
> it. Whether to leave it `READY` (one honest, identical blocker per cycle) or hold it pending that
> decision is **the Architecture Lead's call; this session changed no status.**

**TASK-0027 is COMPLETE — executed 2026-08-22 by a supervisor-started session against `HEAD = 9d5f747`,
the cycle immediately after MSG-0083's permission grant was pushed.** All seven MSG-0080 acceptance
criteria are MET, each mapped to evidence in **MSG-0084** §3. Being documentary it produced **no test
count and claims none**.

**The corpus read succeeded on the first attempt** — MSG-0083's narrow grant worked exactly as
authorized, and BLK-0010 is closed by execution rather than by assertion. **The PDF never entered the
repository**: verified four ways (working tree, corpus path, repository path, and the whole of
history), all quoted in MSG-0084 §9.

**The headline findings are document-level and n=1.** The file is a **45-page, text-native, English-only
PDF 1.7** produced by Word 2016 — 107,988 characters of tagged content text decoded across all 45 pages,
**zero Arabic characters**, zero undecodable glyphs, and exactly **two** image XObjects in the whole
document (a 103×92 logo and its mask). **D14 would not reject it.**

**The most reusable output is not the language finding — it is three extraction hazards** (MSG-0084 §5),
each of which corrupts a T-B pipeline *silently* rather than failing: page 1 draws **every glyph twice**,
once as a `/Artifact`-tagged drop shadow, so an extractor without marked-content scoping doubles the one
page carrying the title, authorship and approval block; `/Span <</Lang(en-ZA)>>` property dictionaries
look like body text to a naive regex and inject **1,865** spurious strings; and **page 23 yields 67
characters** because its content is a vector flow chart — text-native, so D14 never fires, yet
effectively unreadable.

**What did NOT change, and this is the part to read before citing this task.** **This document supplies
no Arabic evidence at all**, so **MSG-0056a D6 is exactly as deferred as before** and **ADR-0019 was not
amended and must not be amended on the strength of it**. Four of A-SURVEY's five dimensions — format
mix, language prevalence, scanned prevalence, classification/audience distribution, version/supersession
prevalence — are **recorded as INSUFFICIENT at n=1, with no estimates invented** (MSG-0084 §6). **No ADR
was touched, no provider/model/runtime selected, and T-A, T-B, T-D, T-E and T-0 remain unauthorized.**

**Two items are referred to the Architecture Lead and neither blocks anything** (MSG-0084 §8): the
designated corpus is **real organizational material, not synthetic** — a genuine clinic emergency plan
with a named approver and no confidentiality marking — so the "approved/synthetic" description should be
confirmed rather than left standing unexamined; and the unattended runner **has no PDF tooling**
(`pdftoppm` absent, `pdftotext` off the allowlist), which this task worked around by reading the file's
bytes directly rather than by widening any permission.

> **The paragraphs this replaces, retained.** "**TASK-0027 is READY — the single READY task.** Authorized
> by **MSG-0080** …" plus the BLK-0010 blocked-attempt note above it. Both were true when written; the
> blocked attempt is still the record of what BLK-0010 found, and the decision it asked for was answered
> by MSG-0083 and has now been exercised successfully.

**Superseded, retained — the READY entry.** Authorized by **MSG-0080**, which closes the gap
TASK-0026 stopped at: the organization supplied an approved/synthetic corpus, and A-SURVEY may now run
against it. **TASK-0027 is an id allocated here** — MSG-0080 assigns none — verified unused. There is
no separate `TASK-0027-*.md` file; **MSG-0080 plus the task section below are the specification.**

**The corpus is at `D:\Work\pci-corpus\plan.pdf`, deliberately outside this repository, and it must
stay there.** MSG-0080 is explicit: it must not be copied, staged, committed, or otherwise added to
repository history.

> **That is not a theoretical risk.** The file was first placed at `D:\Work\pci-platform\plan.pdf` —
> inside the working tree, untracked and not ignored — where the next `git add -A` would have committed
> 627 KB of corpus into history. Every COMMS cycle runs `git add -A`, and so does the unattended
> runner. It was moved out before anything staged it, and `git status` was verified clean afterwards.
> **A runner that copies it in "just to read it" would recreate that risk.** Read it in place.

**The survey is n=1, and the boundary between what one document can and cannot establish is the point
of the task**, not a caveat on it. See the section below.

**TASK-0026 is COMPLETE (PARTIAL) — executed 2026-08-22.** It was run by a
supervisor-started session (`runner.lock` pid 27312, acquired 06:57:17Z) against the reconciliation
MSG-0077 pushed in `69a4d03`. **Five of the six MSG-0076 acceptance criteria are MET; criterion 1 is
UNMET on PR5**, each mapped to evidence in **MSG-0078** §2. Being documentary it produced **no test
count and claims none**.

**The prediction in the entry below held exactly, and the important half is the one that did *not*
happen.** A-STACK ran and delivered
[`EPA-0005`](../architecture/EPA-0005-assistant-stack-evaluation.md) — PROPOSED, selecting nothing.
**A-SURVEY stopped at its prerequisite and produced no figures of any kind.** The corpus question was
**re-checked by inspection in the executing session**, not inherited from this entry: a tree-wide search
for document-like files returned two TypeScript licence texts and nothing else. **PR5 is still UNMET.**

**What EPA-0005 concluded, in one line each.** *"The stack"* is not one decision — the real fork is one
runtime or two, and it is framed rather than settled. **ADR-0020 §3.1/§4 make pre-filtered retrieval a
functional requirement on the index engine**, which disqualifies post-filter-only similarity search —
the sharpest finding, because over-fetch-then-filter is the prohibited shape one layer down and *looks*
like enforcement. **Three local models are required, not one** (generation, embedding, **and ADR-0017's
entailment layer**), which multiplies the unmeasured PR6. **Conversation and audit are two stores**, and
a single log violates ADR-0021 §2/§4 invisibly. **Every selection is left open** in §9.2 with the
evidence that would close it.

**WP-0009 §6.2 asked A-STACK whether its output should be an ADR. EPA-0005 §9.3 answers — recommend
*not yet* — and creates none**, MSG-0076 authorizing no ADR drafting.

> **The paragraphs this replaces, retained:** "**TASK-0026 is READY — the single READY task.** Authorized
> by **MSG-0076**, which authorizes one bounded architecture task with two outputs: **A-SURVEY** (bounded
> corpus survey) and **A-STACK** (stack evaluation). MSG-0076 assigns no task number; **TASK-0026 was
> allocated here** as the next unused id, verified free across the repository. There is **no separate
> `TASK-0026-*.md` file** — as with TASK-0025, MSG-0076 plus the task section below are the
> specification." True from the MSG-0077 reconciliation until the task executed the same day. **The
> no-separate-file note still holds** and is repeated so a later reader does not go looking.

**The two halves were not equally executable, and that was the most important thing in this entry.**

- **A-STACK can run now.** Every input it needs is in the repository: `docs/architecture/technology-selection-principles.md`,
  the six accepted EPA ADRs in `docs/decisions/`, and WP-0009.
- **A-SURVEY is blocked on PR5.** It requires "representative approved policy material", and **no such
  corpus is reachable from this repository** — verified, not assumed: a search for policy documents
  returns only kernel source files named `policy`. WP-0009 §6.1 records PR5 as the **organization's**
  prerequisite and EPA-0004 §11.5 records it as **UNKNOWN — not visible from the repository**.

**A-SURVEY must therefore stop at its prerequisite and record why. It must not produce empirical
observations it cannot have made.** See the task section; this is the failure mode the entry exists to
prevent.

> **Outcome, 2026-08-22 — the instruction was followed.** A-SURVEY stopped at PR5. **No format
> breakdown, language mix, scanned-document prevalence, classification pattern, or version
> characteristic exists in the commit** — not as estimates, not as illustrations, not as expected
> values — and **no survey method or plan was substituted** for the authorized output. The corpus was
> **re-checked by inspection** first, as required, because the operator could have supplied material
> after this entry was written; they had not. Evidence: MSG-0078 §3.

**TASK-0025 is COMPLETE (2026-08-21).** It was executed by a supervisor-started
session (`runner.lock` pid 16980, acquired 20:47:18Z) — the cycle immediately after the MSG-0074
reconciliation was pushed. All five MSG-0073 acceptance criteria are met, each mapped to evidence in
**MSG-0075** §2. Being documentary it produced **no test count and claims none**.

**The WP-0009 ADR set is now complete and authoritative.** ADR-0018 … ADR-0022 are promoted into
`docs/decisions/`, joining ADR-0017, which the lead promoted in `d9c4524`. Under the CLAUDE.md authority
order those six now sit at tier 2 — above the COMMS messages that previously carried these rulings,
which is the entire point of having drafted them.

**The verification is a diff per record, and every hunk is in a header.** Each promoted file was
produced by copying its draft **byte for byte** and editing exactly two things — the `Status` block and
an added `Accepted by: Architecture Lead — MSG-0071` line — so the body could not drift and the diff is
a real check rather than a restatement of intent. **Zero body differences across all five.** No accepted
ADR was modified: `git status --porcelain` showed five new paths under `docs/decisions/` and no modified
path there.

**The three MSG-0071 conditions were re-checked in the promoted copies**, not inherited from MSG-0072's
pre-promotion pass, because promotion is the step where they could be lost. No provider, model,
framework or runtime is selected — ADR-0022's citation of ADR-0003's note on Ollama survived intact and
still explicitly declines to elevate it. ADR-0019 still states it is incomplete for production by
design, with **no normalization rule invented**. ADR-0017's entailment model and thresholds remain open
under SPEC-0020.

**Nothing became executable.** A-SURVEY, A-STACK and T-0 remain unauthorized; no implementation task is
READY; the string `READY` does not occur in any promoted ADR.

> **The line this replaces, retained:** "**TASK-0025 is READY — the single READY task.** Authorized by
> **MSG-0073**, which answers the MSG-0072 decision … Prerequisites verified individually … MSG-0073
> states: *'Claude may execute TASK-0025 when it is reconciled as READY.'* With this pushed, the
> Supervisor — enabled and cycling every ten minutes — will start it on its next cycle." True from the
> MSG-0074 reconciliation until the task executed the same day. **The prediction held**, and each
> prerequisite was re-verified at the start of the executing session rather than inherited from that
> paragraph — checkpoint 1 records each.

**There is no separate TASK-0025 specification file.** MSG-0073 carries the objective, constraints and
acceptance criteria, and **the task section below is the specification**. Read both. That remains true
after execution, and is repeated here so a later reader does not go looking for a missing file.

**What the Architecture Lead does next.** MSG-0071's *Next architecture boundary* makes promotion the
precondition for the next bounded architecture task: **A-SURVEY** or **A-STACK** from WP-0009 §6.2.
**That precondition is now met.** Whichever is authorized must be reconciled into this board as the
single READY task, **in the same commit as the authorization**. The MSG-0044 gap recurred for the
**eighth** time with MSG-0073 — `grep -c "TASK-0025"` returned 0 on this file after the authorization
landed — and MSG-0074 repaired it before the next Supervisor cycle, which is why the run started on
time and nothing idled. Repaired-in-time is not the same as prevented.


**TASK-0024 is COMPLETE (2026-08-21), and no task is READY.** It was executed by a supervisor-started
session (`runner.lock` pid 26328, acquired 19:27:19Z) — the next cycle after the reconciliation was
pushed, exactly as predicted below. All eight acceptance criteria are met, each mapped to evidence in
**MSG-0070** §2. Being documentary it produced **no test count and claims none**.

**Six ADRs are drafted as PROPOSED** in `implementation/decisions/`, covering the six WP-0009 §7
surfaces: **ADR-0017** Grounded Answer Contract · **ADR-0018** Approved Document Authority and
Lifecycle · **ADR-0019** Bilingual Policy Semantics · **ADR-0020** Retrieval Projection and Index
Boundary · **ADR-0021** Employee Question Privacy and Retention · **ADR-0022** Inference Locality and
Provider Boundary.

**Numbers were allocated at drafting time and verified collision-free first** — `docs/decisions/` holds
ADR-0001…ADR-0016 with no gaps, and a repo-wide grep for ADR-0017…ADR-0029 returned only prose
references, zero record files. **No accepted ADR was modified, duplicated, renamed, or deleted**,
evidenced by a pre-commit `git status --porcelain` showing no path under `docs/decisions/`.

**The drafts are PROPOSED, not accepted, and that is the boundary rather than an omission.** Claude Code
does not accept architecture: `implementation/decisions/README.md` states that records there carry no
authority until the lead promotes them to `docs/decisions/`, and ADR-0015/ADR-0016 are the precedent —
each drafted PROPOSED there and promoted with a `Supersedes:` line. Neither MSG-0068a nor MSG-0068b
grants acceptance authority.

**All six surfaces were tested independently rather than inherited.** WP-0009 §7 marks all six REQUIRED
and invites disagreement; the task treated that as a hypothesis and checked each against the accepted
ADR set read in full. All six survived, for one structural reason: each rests on a ruling that is
stricter than or absent from the accepted set and currently lives **only in a COMMS message**, which is
not an authority tier. **Surface 4 was the close call, and MSG-0070 §4 records the argument against it**
so the lead can reject it cheaply if they disagree.

**Two things were deliberately not done.** **ADR-0019 does not contain the Arabic normalization rules** —
MSG-0056a D6 requires them determined empirically against a corpus nobody has surveyed, so the draft
records the obligation and three fixed constraints and states that it must be amended before production
use. **No task was marked READY**, including A-STACK and A-SURVEY.

> **The line this replaces, retained:** "**TASK-0024 is READY — the single READY task.** Authorized by
> **MSG-0068** and reconciled into this board on 2026-08-21 after its prerequisites were verified
> individually … **The Supervisor is live again** … it was idling at `NOOP: no READY task` at 19:17:18Z
> while TASK-0024 sat authorized. With this reconciliation pushed, **the next cycle will start it** — no
> manual trigger is needed." True from the MSG-0069 reconciliation until the task executed the same day.
> **The prediction held**: the 19:27:19Z cycle started it.

**What the Architecture Lead does next:** accept, amend, or reject ADR-0017…ADR-0022 and promote what is
accepted to `docs/decisions/`; rule on ADR-0019's normalization gap; and, if further architecture work is
wanted, authorize **A-STACK** or **A-SURVEY** from WP-0009 §6.2 and reconcile it here as the single READY
task. MSG-0070 §9.

> **Two specification files, and two authorization messages.** `TASK-0024-epa-adr-drafting.md` and
> `TASK-0024-a-adr.md` both specify this task; `MSG-0068-task-0024-authorization-epa-adr-drafting.md`
> and `MSG-0068-task-0024-a-adr-authorization.md` both authorize it. **All four agree** — same
> objective, same six surfaces, same forbidden list, same requirement that ADR numbers be allocated at
> drafting time from the repository's actual state — so no stop condition fired. They are not
> identical, so **the section below carries the union of all four.** Nothing was renamed, per MSG-0058
> F4. Recorded in MSG-0069.

> **Reconciliation warning, from MSG-0060 and MSG-0064 — now seven.** TASK-0024 was authorized and
> `grep -c "TASK-0024"` on this file returned **0**, with the Supervisor idling on a healthy-looking
> "no READY task" at the time. This is the **seventh** occurrence, and the first where the cost was
> visible in the log rather than hypothetical.

> **The line this replaces, retained:** "**TASK-0023 is COMPLETE (2026-08-21), and no task is READY.**"
> True from TASK-0023's completion until MSG-0068 authorized TASK-0024 the same day.


**TASK-0023 is COMPLETE (2026-08-21).** It was executed by a supervisor-started
session (`runner.lock` pid 27400, acquired 18:04:59Z) and delivered
[`WP-0009 — Employee Policy Assistant`](../../docs/program/work-packages/WP-0009-employee-policy-assistant.md),
the formal work-package record. All seven MSG-0063 acceptance criteria are met, each mapped to evidence
in **MSG-0066** §3. Being documentary, it produced **no test count and claims none**.

**The identifier is WP-0009** — the next number unused in *either* register, verified by `grep` before
allocation. **Historical WP-0001 is untouched** and all eight `PLAN-WP-0001` planning entries are
retained verbatim; the two registers are reconciled in `docs/program/work-packages.md` §0 with a
standing allocation rule, which also closes **DISC-0010**. WP-0002 looked free from the delivered
directory alone and was **not** taken: the planning list has held it since it was written.

**Three MSG-0062 rulings shaped the sequence.** §7.3 fixes **T-D before T-E** and closes an item open
since EPA-0002. §7.6 makes "retrieve then filter" a **gate failure** rather than a style preference —
Restricted documents are eligible for the corpus, but a Restricted document is never retrieved unless
the subject satisfies its policy, and denial fails closed with no existence, content, timing, or
result-count side channel. §7.7 means **ADR-0015 is not inherited** and no stack is selected.

**Two things were deliberately not done, and both would have looked helpful.** **ADR numbers were not
allocated** — MSG-0062 §7.2 and this queue section both place allocation in the ADR-drafting task, so
the six surfaces are sequenced and justified but unnumbered, with "next free is ADR-0017" recorded as an
observation only. **No task was marked READY**, including the three architecture tasks the record itself
defines. That is the boundary MSG-0063 draws, not an omission.

> **The line this replaces, retained:** "**TASK-0023 is READY — the single READY task.** Authorized by
> **MSG-0063** and reconciled into this board on 2026-08-21 after its prerequisites were verified
> individually, not assumed: TASK-0022 COMPLETE, MSG-0062 DECIDED, MSG-0063 AUTHORIZED, no OPEN blocker,
> no runner lock held, and exactly one TASK-0023 specification file on disk." True from the MSG-0064
> reconciliation until the task executed on the same day. Every prerequisite was re-verified at the start
> of the executing session rather than inherited from this paragraph — checkpoint 1 records each.

**What the Architecture Lead does next:** authorize one bounded architecture task from `WP-0009` §6.2 —
**A-ADR**, **A-STACK**, or **A-SURVEY** — and reconcile it into this board as the single READY task.
The reconciliation warning below applies to it in full; the count stands at six.

It is **architecture/governance reconciliation only.** It may not implement, select any provider,
model, embedding, framework or runtime, change permissions, security boundaries, Supervisor behaviour
or scheduling, create or modify accepted ADRs, or perform any operator-only or privileged action.
**It may not mark any downstream implementation task READY.**

**EPA-0004 was ACCEPTED by MSG-0062**, which also ruled all seven of the open items MSG-0061 §7
raised. Three of those rulings change what the next task must do:

- **7.3** — **T-D (grounded QA) must precede T-E (retrieval-time authorization).** Authorization
  controls must not be validated against an unproven answer path.
- **7.6** — Restricted documents **are** eligible for the governed corpus, but **no retrieve-then-suppress
  design is permitted**: a Restricted document is never retrieved into a request unless the
  authenticated subject satisfies its policy, and denial must fail closed without revealing existence,
  content, timing, or result-count.
- **7.7** — **ADR-0015 is not inherited** as the service stack. A dedicated architecture task must
  propose the concrete stack; nothing is selected by that ruling.

**7.1 leaves the work-package identifier deliberately unallocated** — no existing WP number is
repurposed — and allocating it through the register reconciliation is TASK-0023's job.

> **Reconciliation warning, from MSG-0060 — still live.** Five times an authorization has existed while
> this queue did not reflect it, leaving the Supervisor idling on a healthy-looking "no READY task".
> TASK-0023 was the sixth occurrence: MSG-0063 authorized it and `grep -c "TASK-0023"` on this file
> returned **0**. It is reconciled now. When the next task is authorized, the same step is required
> again, or it becomes the seventh.

> **The line this replaces, retained:** "**TASK-0022 is COMPLETE (2026-08-21) and no task is READY.** …
> **No task is READY, and that is the correct state.** MSG-0059 makes the Architecture Lead's
> acceptance of EPA-0004 the precondition …" True from TASK-0022's completion until MSG-0062 accepted
> EPA-0004 and MSG-0063 authorized TASK-0023 on the same day. The acceptance boundary it described has
> been passed, not removed: implementation remains prohibited.

> **Reconciliation warning, from MSG-0060.** Five times now an authorization has existed while this
> queue did not reflect it, leaving the Supervisor idling on a healthy-looking "no READY task". When
> T-A is authorized, it must be **reconciled into this board as the single READY task** or it will be
> the sixth.

> **The line this replaces, retained:** "**TASK-0022 is READY — the single READY task**, authorized by
> MSG-0059 and reconciled into this board on 2026-08-21. It is architecture/work-package definition
> only …" True from the MSG-0060 reconciliation until TASK-0022 executed on the same day.

> **The line that replaced, retained:** "**No task is READY.**" True from TASK-0021's completion
> until MSG-0059 authorized TASK-0022. The note below it records the earlier correction and is
> kept intact.

> **Corrected 2026-08-21 by TASK-0021.** This line previously read "**No task is READY.** TASK-0019
> was the last authorized one." That was true when written and stopped being true when MSG-0054
> authorized TASK-0021, which was reconciled into the board above in `3350cb4` and has since been
> executed. **TASK-0021 is now COMPLETE** (MSG-0055) and no task is READY again — but for a different
> reason: the project sits at an **architecture decision boundary**, not at an empty queue.
> EPA-0003 lists fourteen decisions; four are marked Highest and are enough to unblock the
> foundation. The Supervisor will correctly remain idle until the lead authorizes something.

**MSG-0052 has since ruled on C1-C5** (2026-08-21). C1 is applied: the accepted work package now reads
`Status: COMPLETE`, so the conflict TASK-0019 referred is closed. C2 and C3 are applied as documentary
supersessions; C4 and C5 required no action. **C6 (a bounded proof of MSG-0049 option B) and C7 (the
next work package) remain architecture-lead decisions and are not self-authorized.**

**TASK-0016 is explicitly authorized by the architecture lead after WP-0001 completion.** It is maintenance/documentation work, not a new product work package.

### TASK-0017 — result: COMPLETE (the section below is superseded history)

> **Corrected 2026-08-20 by TASK-0018.** The status board above reads **COMPLETE** for TASK-0017 and
> the narrative below reads **IMPLEMENTED but NOT COMPLETE** — a straight contradiction inside one
> file. The board is right: MSG-0046 authorized the operator-side test run, MSG-0047 records **36
> passed / 0 failed**, and the task closed in `1f2903d`. The block below was accurate when written,
> before the suite could be executed, and is retained rather than rewritten because the sequence
> — blocked, asked, authorized, verified — is the useful part of the record.
>
> This correction is **additive and declared** (MSG-0049 §7.3). TASK-0018's scope permits updating
> queue documentation; it does not extend to the MSG-0045 record's own status line, which was left
> untouched and still reads OPEN.

**IN_PROGRESS, 2026-08-20.** The defect was reproduced, diagnosed and corrected, and nine focused
tests were written. **The success gate is NOT met**: MSG-0043 requires that the relevant test suite
passes, and the suite **could not be executed** — no allowlist entry permits running a PowerShell
script, so the command documented in the supervisor README was refused three times. Evidence and the
decision request: **MSG-0045**. Both checkpoints: `checkpoints/TASK-0017.md`.

**The reproduction cost nothing.** This session *was* the defect: the Supervisor started it at
12:31:16Z and `state/heartbeat.json` went on reading `NOOP :: no READY task`, `runnerActive: false`,
with a two-commit-old `head`, for the whole run. The log was correct throughout — the fault was
confined to the state file and never touched scheduling.

**Corrected** in `supervisor.ps1`: the runner wait polls instead of blocking, a heartbeat is written
at launch and refreshed while the runner is alive, `runnerPid` is published, and the overloaded
`STARTED` decision is split into `RUNNER_STARTED` / `RUNNER_RUNNING` / `COMPLETED` / `FAILED`, with
`ERROR` narrowed to mean the supervisor itself failed. The ten-minute schedule, the reconciliation
gate, the fail-closed behaviour, and every permission rule are **untouched**.

**Status is IN_PROGRESS, deliberately, not COMPLETE and not READY.** Not COMPLETE because the gate is
unmet. Not READY because that would have the Supervisor start the task again on its next cycle and
repeat the work indefinitely. A checkpoint exists, as IN_PROGRESS requires.

> **Operational risk, stated rather than buried.** The Supervisor is ENABLED and will run this changed
> code unverified on its next cycle. If it contains a fault, unattended execution stops until a human
> intervenes. The change is ASCII-verified, additive, and confined to the state-writing path — but a
> static read is not a passing test. It is one commit and `git revert` undoes it.

### TASK-0017 — authorization (as issued)

**READY, 2026-08-20.** MSG-0043 authorizes diagnosing and correcting the heartbeat/observability
defect. Full specification: [`TASK-0017-supervisor-heartbeat.md`](TASK-0017-supervisor-heartbeat.md);
the queue section below carries prerequisites, allowed and forbidden actions, verification,
documentation, checkpoint, stop conditions, and recovery. Queue reconciliation is recorded in
MSG-0044.

### TASK-0016 — result

**COMPLETE, 2026-08-20.** MSG-0034 is CLOSED in its own record and in the COMMS register, its
substantive content intact. Evidence: MSG-0042; commit and push quoted in `checkpoints/TASK-0016.md`
checkpoint 2.

**Two of the four success-gate items were already satisfied when this session started.** The
architecture lead closed the MSG-0034 record itself in `4b5965d` and the register row in `9c6244c`,
before the Supervisor's 09:57:18Z fast-forward. **Neither was re-done** — CLAUDE.md *Checkpointing and
Recovery* rule (f) forbids repeating an operation because a record says it is incomplete, and both
closures were verified by direct observation of the files. This session executed only what remained:
the execution record, the register row, this queue update, the `current.md` reconciliation, and the
push. **MSG-0034 itself was not modified by this session**, which is the opposite of what "TASK-0016
closed MSG-0034" would suggest, and is why it is stated here.

The stop condition was checked before acting and **did not fire**. It fires on a *material conflict*
between MSG-0034's evidence or MSG-0041 and the actual repository state; what was found instead was
state **ahead of** the authorization in the direction the authorization points. Convergence, not
conflict. The substantive-content check was made by reading the file, not by trusting the diffstat:
`4b5965d` added a `## Closure` section and changed the status line, and deleted nothing.

**The COMMS register lag did not recur** — the first time in four tasks. MSG-0041's register row was
already present, added by the lead in the same commit that closed the MSG-0034 row. Recorded in
MSG-0042 §6 as an observation; **no change proposed, no ruling requested**.

**Zero messages now carry `Status: OPEN`.**

### TASK-0016 — authorization (as issued)

**READY, 2026-08-20.** MSG-0041 authorizes closing MSG-0034 because its diagnosis is verified, the TASK-0011 smoke test passed, and no unresolved action depends on it.

**Allowed:**
- Change only the status/closure section of `implementation/comms/MSG-0034-task-0011-execution-path-correction.md` from OPEN to CLOSED, preserving its substantive historical content.
- Ensure the COMMS register records MSG-0034 as CLOSED.
- Create exactly one execution record for TASK-0016 using the message-numbering protocol, and reconcile the register in the same commit.
- Update required task/status documentation and push the result.

**Forbidden:**
- No changes to Supervisor code/configuration, permissions, scheduling, blockers, discoveries, product/code, or historical substantive COMMS content.
- No renumbering of existing messages.
- No credential access, privilege escalation, destructive commands, repository reset/clean, or force push.

**Success gate:** MSG-0034 is CLOSED in its own record and the register; exactly one TASK-0016 execution record exists; queue/status documentation is consistent; changes are committed and pushed.

**Stop condition:** If MSG-0034's evidence or MSG-0041 materially conflicts with the actual repository state, STOP and report in COMMS. Do not improvise.

### TASK-0015 — result

**COMPLETE, 2026-08-20.** The discoveries index went from **three rows to nine**. DISC-0004 through
DISC-0009 were missing entirely — including the two deployment-artifact defects (DISC-0007,
DISC-0008) and the `/data` boundary finding (DISC-0009). Every status is transcribed from the
record's own header line; **no `DISC-*.md` record was altered, deleted, or renumbered**, evidenced by
the pre-commit `git status --porcelain` in `checkpoints/TASK-0015.md`. Zero index rows were stale and
zero lacked a record — the drift was pure omission. Evidence: MSG-0040.

No stop condition fired. All nine records carry an unambiguous status. The one apparent exception was
checked and dismissed: `grep "Status:.*OPEN"` hits `DISC-0006` line 17, which is quoted `grep` output
inside a fenced example block, not that file's status.

**One judgment call, declared rather than folded in** (MSG-0040 §5): `implementation/status/current.md`
keeps a second discovery table whose DISC-0009 row read **OPEN** while the record reads "CLOSED —
ACCEPTED, NOT A VIOLATION". It was corrected under MSG-0039 (a) §4 and §7, because leaving it would
have created a fresh contradiction the moment the discoveries index became correct. That table's
header was also widened from two columns to three, which is what its rows already supplied — the
renderer had been silently dropping four statuses.

**The authorization was duplicate-numbered.** Two MSG-0039 files exist (`b123361`, `dc307fa`). They do
not conflict; the task executed the stricter reading of both, registered them as MSG-0039 (a)/(b), and
renumbered neither, per MSG-0035 decision 2. Reported in MSG-0040 §6; **no ruling requested**.

### TASK-0015 — authorization (as issued)

**READY, 2026-08-20.** MSG-0039 authorizes a narrowly scoped reconciliation of `implementation/discoveries/README.md` against the actual `DISC-*.md` records. The task may update only the discoveries index and required task/COMMS evidence. It must not alter discovery substance, architecture decisions, blockers, product/code, Supervisor configuration, permissions, scheduling, or repository history. It must stop for malformed records or conflicts requiring architectural judgment.

### TASK-0014 — result

**COMPLETE, 2026-08-20.** The blocker index now lists **BLK-0005 · Two contradictory MSG-0020 decisions · High · RESOLVED 2026-08-19**, citing MSG-0022, MSG-0023, and the blocker record. The underlying `BLK-0005-conflicting-msg-0020-decisions.md` was **not** altered, BLK-0001 through BLK-0004 are unchanged, and the discoveries index was not touched. Evidence: MSG-0038; commit and push quoted in `checkpoints/TASK-0014.md` checkpoint 2.

The stop condition was checked before acting: MSG-0037, MSG-0022, MSG-0023, and the BLK-0005 record agree that WP-0001 is COMPLETE and BLK-0005 is closed, so it did not fire. The one nuance — MSG-0023 retains MSG-0022 "only as the historical conflict-resolution record" — is a clarification of which record survives, not a disagreement about BLK-0005, and is recorded in MSG-0038 §3 so it is not misread later.

**All five blockers are now listed and all five read RESOLVED.** With BLK-0001 and BLK-0004 corrected by TASK-0013 and BLK-0005 added here, the index and the underlying records finally describe the same state.

### TASK-0013 — result

**COMPLETE, 2026-08-20.** Both MSG-0035 decisions applied: BLK-0001 and BLK-0004 are RESOLVED in the blocker index with their resolution date and evidence reference, and the COMMS numbering-allocation convention is recorded in `implementation/comms/README.md`. Evidence: MSG-0036; commit and push quoted in `checkpoints/TASK-0013.md`.

---

## TASK-0011 — prior result

TASK-0011 was a one-time execution-infrastructure test. The Supervisor selected it, launched Claude, Claude read shared repository state, produced MSG-0032, and pushed the result to GitHub with no human relay. The smoke test passed. Earlier attempts had stopped at the reconciliation gate because the clone was behind `origin/main`; the gated fast-forward correction in `479dfa9` resolved that failure mode.

---

## Status values

| Status | Meaning |
|---|---|
| **READY** | Authorized and executable now. Prerequisites are checked before actions begin. |
| **IN_PROGRESS** | Started; a checkpoint exists in `checkpoints/`. |
| **COMPLETE** | Finished and verified, with evidence recorded in the repository. |
| **BLOCKED** | Authorized in principle, but a dependency or prerequisite is unmet. |
| **WAITING_FOR_ARCHITECTURE_LEAD** | Needs a decision or authorization only the lead can give. |
| **WAITING_FOR_OPERATOR** | Needs a privileged or credential-holding action only the operator can perform. |
| **ABORTED** | Withdrawn. Its premise was wrong or it was superseded. Kept for the record. |

READY means *authorized to attempt*, never *authorized to force*. A READY task whose prerequisite is unmet stops at the prerequisite and records why.

---

## Communication ledger

| MSG ID | Type | Status | From | To | Decision / Action | Related Task |
|---|---|---|---|---|---|---|
| MSG-0001 | Question | ANSWERED | Claude Code | Architecture lead | Ubuntu host, `claude` account, `/data/docker` boundary — answered by the accepted bootstrap contract | TASK-0001 |
| MSG-0002 | Proposal | CLOSED | Claude Code | Architecture lead | Kernel stack — ADR-0015 ratified | TASK-0001 |
| MSG-0003 | Question | CLOSED | Claude Code | Architecture lead | Repository layout and governance authority — decided by MSG-0005 | — |
| MSG-0004 | Proposal | CLOSED | Claude Code | Architecture lead | Prepared corrections — approved and applied | — |
| MSG-0005 | Decision | DECIDED | Architecture lead | Claude Code | ADR-0015 and ADR-0016 ratified; `docs/` authoritative; `docs/program/work-packages/` canonical; WP-0001 layout accepted | TASK-0001 |
| MSG-0006 | Directive | DECIDED | Architecture lead | Claude Code | Absolute `/data` boundary; `/data/pci-platform` mandatory workspace; contract v0.2 | all |
| MSG-0007 | Directive | DECIDED | Architecture lead | Claude Code | Twelve non-negotiable rules; startup and pre-action checklists | all |
| MSG-0008 | Procedure | CLOSED | Claude Code | Operator | Authorized bootstrap executed; `DockerRootDir` = `/data/docker` verified | TASK-0001 |
| MSG-0009 | Directive | DECIDED | Architecture lead | Claude Code | Documentation is mandatory | all |
| MSG-0010 | Record | CLOSED | Claude Code | Architecture lead | Phase 0 execution-control system built | TASK-0004, TASK-0005 |
| MSG-0011 | Record | SUPERSEDED | Claude Code | Architecture lead | Execution Supervisor built, tested (17/17), NOT installed and NOT enabled | TASK-0010 |
| MSG-0012 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0004 and TASK-0005 authorized | TASK-0004, TASK-0005 |
| MSG-0013 | Directive | DECIDED | Claude Code | Architecture lead | Reconcile queue to READY from MSG-0012 | TASK-0004, TASK-0005 |
| MSG-0014 | Directive | DECIDED | Claude Code | Architecture lead | Queue authorization reconciliation | TASK-0004, TASK-0005 |
| MSG-0015 | Record | CLOSED | Claude Code | Architecture lead | TASK-0004 and TASK-0005 complete; TASK-0006 authorization required | TASK-0006 |
| MSG-0016 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0006 authorized | TASK-0006 |
| MSG-0017 | Record | CLOSED | Claude Code | Architecture lead | TASK-0006 complete; TASK-0007 authorization required | TASK-0007 |
| MSG-0018 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0007 authorized; continuation to TASK-0008 permitted | TASK-0007, TASK-0008 |
| MSG-0019 | Record | CLOSED | Claude Code | Architecture lead | TASK-0007 / TASK-0008 complete; WP-0001 ready for completion decision | TASK-0009 |
| MSG-0020 (a) | Decision | SUPERSEDED | Architecture lead | Claude Code | Erroneous NOT COMPLETE decision; TASK-0012 authorization superseded by MSG-0022 | TASK-0009 |
| MSG-0020 (b) | Decision | SUPERSEDED | Architecture lead | Claude Code | Duplicate COMPLETE decision; final ruling restated by MSG-0022 | TASK-0009 |
| MSG-0021 | Question | CLOSED | Claude Code | Architecture lead | Duplicate MSG-0020 conflict resolved by MSG-0022 | TASK-0009 |
| MSG-0022 | Decision | DECIDED | Architecture lead | Claude Code | Duplicate MSG-0020 resolved: **WP-0001 COMPLETE**; TASK-0012 not authorized | TASK-0009 |
| MSG-0023 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0009 terminal; TASK-0012 not in the WP-0001 path | TASK-0009 |
| MSG-0024 | Decision | DECIDED | Architecture lead | Claude Code | **Execution Supervisor enablement authorized**, fail-closed preserved | TASK-0010 |
| MSG-0025 | Question | CLOSED | Claude Code | Architecture lead | Supervisor installed and verified in dry-run; NOT enabled | TASK-0010 |
| MSG-0026 | Record | CLOSED | Claude Code | Architecture lead | **Supervisor ENABLED**; acceptEdits + version-controlled deny list; no bypassPermissions | TASK-0010 |
| MSG-0027 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0003 authorized and marked READY; line-ending normalization only | TASK-0003 |
| MSG-0028 | Record | DECIDED | Claude Code | Architecture lead | TASK-0003 implemented, NOT complete; decisions resolved by MSG-0030 | TASK-0003, TASK-0010 |
| MSG-0029 | Record | CLOSED | Claude Code | Architecture lead | Supervisor start path diagnosed and fixed; first launch PROVEN | TASK-0010 |
| MSG-0030 | Question | DECIDED | Architecture lead | Claude Code | Option B authorized: `git checkout -- "*.md"` | TASK-0003 |
| MSG-0031 | Record | DECIDED | Claude Code | Architecture lead | TASK-0003 COMPLETE; CRLF residue 150 -> 0 | TASK-0003 |
| MSG-0032 | Record | CREATED — smoke test PASSED | Claude Code | Architecture lead | End-to-end Supervisor evidence; two findings requested rulings | TASK-0011 |
| MSG-0033 (a) | Directive | DECIDED | Architecture lead | Claude Code | TASK-0011 smoke-test diagnosis/correction | TASK-0011 |
| MSG-0033 (b) | Directive | DECIDED | Architecture lead | Claude Code | TASK-0011 retry correction; duplicate historical number | TASK-0011, TASK-0010 |
| MSG-0034 | Record | CLOSED | Claude Code | Architecture lead | Informational: execution-path diagnosis; smoke test passed; closure authorized by MSG-0041 | TASK-0011, TASK-0016 |
| MSG-0035 | Decision | DECIDED | Architecture lead | Claude Code | BLK-0001/0004 resolved; COMMS numbering-allocation convention approved | TASK-0013 |
| MSG-0036 | Record | CREATED — both decisions applied | Claude Code | Architecture lead | TASK-0013 execution evidence; BLK-0005 index row needs a ruling (§6) | TASK-0013 |
| MSG-0037 | Decision | DECIDED | Architecture lead | Claude Code | **BLK-0005 index reconciliation authorized**; underlying record unchanged | TASK-0014 |
| MSG-0038 | Record | CREATED — authorization applied | Claude Code | Architecture lead | TASK-0014 execution evidence; BLK-0005 row added; **no decision requested** | TASK-0014 |
| MSG-0039 (a) | Decision | DECIDED | Architecture lead | Claude Code | **Discoveries-index reconciliation authorized**; duplicate number, non-conflicting | TASK-0015 |
| MSG-0039 (b) | Decision | DECIDED | Architecture lead | Claude Code | Same authorization restated; duplicate number, non-conflicting — both satisfied | TASK-0015 |
| MSG-0040 | Record | CREATED — authorization applied | Claude Code | Architecture lead | TASK-0015 execution evidence; index 3 rows -> 9; **no decision requested** | TASK-0015 |
| MSG-0041 | Decision | DECIDED | Architecture lead | Claude Code | Close resolved MSG-0034 informational record; applied by TASK-0016, see MSG-0042 | TASK-0016 |
| MSG-0042 | Record | CREATED — closure verified | Claude Code | Architecture lead | TASK-0016 execution evidence; MSG-0034 CLOSED in record and register; **no decision requested** | TASK-0016 |
| MSG-0043 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0017 AUTHORIZED** — correct the stale-heartbeat defect; schedule, gates and permissions unchanged | TASK-0017 |
| MSG-0044 | Record | CLOSED | Claude Code | Architecture lead | **TASK-0017 authorized in MSG-0043 but absent from the queue**, so the supervisor could never select it. Queue reconciled; structural finding recorded | TASK-0017 |
| MSG-0046 (a) / (b) | Decision | DECIDED | Architecture lead | Claude Code | Option A: operator runs the test once; no permission expansion. **Duplicate number, non-conflicting** — two files, same ruling; registered as (a)/(b) by TASK-0019 and neither renumbered, per MSG-0035 decision 2 | TASK-0017 |
| MSG-0047 | Record | CLOSED | Claude Code | Architecture lead | **TASK-0017 verification: 36 passed, 0 failed.** Gate satisfied; task COMPLETE | TASK-0017 |
| MSG-0048 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0018 AUTHORIZED** — one real Supervisor-started run, observe RUNNER_RUNNING live; no manual trigger, no supervisor changes | TASK-0018 |
| MSG-0045 | Record | **CLOSED** — corrected 2026-08-21 by TASK-0019; the record file and the COMMS register both read CLOSED | Claude Code | Architecture lead | **TASK-0017 IMPLEMENTED but NOT COMPLETE.** Defect reproduced and corrected; the test suite **could not be run** — no allowlist entry permits executing a PowerShell script. Three options in §7. *Answered by MSG-0046 and discharged by MSG-0047; the status line in the record itself was not changed by TASK-0018, which had no authority over another message's record* | TASK-0017 |
| MSG-0049 | Record | CLOSED | Claude Code | Architecture lead | **TASK-0018 verification: `RUNNER_RUNNING` observed live during a supervisor-started run.** Gates 1, 2, 4 and 5 MET with quoted evidence; gate 3 (terminal heartbeat) is **structurally unobservable from inside the run it measures**. Three options in §6; (B) recommended | TASK-0018 |
| MSG-0050 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0019 AUTHORIZED and READY** — post-WP-0001 repository baseline audit; maintenance/audit only; queue reconciliation required before execution | TASK-0019 |
| MSG-0054 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0021 authorized — architecture definition ONLY** for the employee policy assistant; outside WP-0001; no implementation, no work package yet | TASK-0021 |
| MSG-0053 | Decision | DECIDED | Architecture lead | Claude Code | **C6 NOT AUTHORIZED / NOT REQUIRED** (option B proof adds execution with no requirement); **C7 no new product work package** pending a concrete objective | — |
| MSG-0052 | Decision | DECIDED | Architecture lead | Claude Code | **C1-C5 ruled.** C1 WP-0001 status COMPLETE; C2/C3 documentary supersessions; C4/C5 no action; **C6/C7 not self-authorized** | TASK-0019 |
| MSG-0055 | Record | CREATED — definition delivered | Claude Code | Architecture lead | **TASK-0021 execution record.** Architecture definition produced as `EPA-0001` (architecture), `EPA-0002` (proposed work package, gates, sequence), `EPA-0003` (**fourteen open decisions**). All eleven acceptance criteria met. **No implementation, no work package, no ADR, no downstream task authorized.** §5 requests the rulings; §7 records three observations needing no action | TASK-0021 |
| MSG-0056a | Decision | DECIDED | Architecture lead | Claude Code | **EPA decision ruling.** TASK-0021 accepted as a complete architecture-definition task. Ten decisions ruled: D2 hybrid retrieval, D4 uniform abstention, D5 layered grounding gate (fail closed), D6 empirical normalization with the final rule in an ADR, **D8 external inference prohibited by default**, **D9 separate service outside the kernel** (ADR-0015 does not automatically govern it), D10 single-shot, D11 no historical questions in release 1, D12 grounded-answer contract promoted to an ADR, D14 text-native only. **D1, D3, D7, D13 escalated — the repository lacks the organizational authority to settle them.** No work package, no implementation task, no ADR, no provider selection authorized | 2026-08-21 |
| MSG-0056b | Decision | DECIDED | Architecture lead | Claude Code | **Employee policy assistant decisions — the four escalated by MSG-0056a, resolved from organizational authority supplied to the lead.** D1: English is the authoritative policy language, Arabic an approved translation; English governs on divergence and the discrepancy is flagged; citations always resolve to English. D3: only privileged users may place documents in the governed flow, upload does not confer authority, the creator must not be sole approver, only approved/published documents are authoritative. D7: session retention by default, administrator-configurable, storage minimized, retained content readable only by the asker. D13: configurable identity modes — Microsoft 365/Entra ID, existing AD/enterprise integration, and optional unauthenticated access for explicitly disclosable information. **No implementation authorized.** Shares a number with MSG-0056a; complementary, not contradictory | 2026-08-21 |
| MSG-0057 | Record + decision request | **CLOSED** | Claude Code | Architecture lead | **Reconciliation of both MSG-0056 rulings.** All fourteen EPA-0003 decisions annotated inline with their source; register, ledger and status reconciled. Three findings need a lead decision before the work package is gated: **F1** the D1 ruling permits answer-time Arabic generation that EPA-0003 recommended prohibiting, so the D5 grounding gate must do cross-language entailment — scope and fallback undefined; **F2** unauthenticated access has zero supporting authority in accepted docs and names a classification value no spec enumerates (recommend deferring); **F3** AD integration must terminate at an OIDC/OAuth2 boundary or ADR-0007 is contradicted. **F4** records a fourth number collision. No task marked READY | 2026-08-21 |
| MSG-0058 | Decision | DECIDED | Architecture lead | Claude Code | **Rules the three MSG-0057 findings, all as recommended.** F1 cross-language grounding is **in scope and fail-closed** — if the Arabic gate fails the system **abstains**, never silently falling back to English or presenting an unofficial rendering as policy; the Arabic bar is evaluated separately under SPEC-0020. F2 unauthenticated access is **deferred** from the first release; no new trust boundary or classification is introduced. F3 enterprise directory integration **must terminate at the OIDC/OAuth2 boundary** of ADR-0007; direct LDAP/Kerberos implementation is not authorized. F4 preserve the MSG-0056a/b distinction and do not rename historical records. **Gate ruling:** findings sufficiently resolved to proceed to a work-package authorization task; implementation still prohibited | 2026-08-21 |
| MSG-0059 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0022 authorized** as the next architecture/work-package definition task. May define scope, gates, acceptance criteria, dependencies, security checkpoints, and the implementation task sequence. **Does not authorize** implementation, provider/model selection, runtime changes, deployment, new permissions, or Supervisor changes, and **no implementation task may be marked READY**. Requires TASK-0022 to be **the single READY task on the board** before the Supervisor may execute it, and the Lead must accept its output before implementation is authorized | 2026-08-21 |
| MSG-0060 | Record | **OPEN** | Claude Code | Architecture lead | **Queue reconciliation for TASK-0022, and a fifth collision — this time on an executable task specification.** Two TASK-0022 files were committed; they agree on scope, authorization, forbidden list and acceptance gate, so no stop fired, but they differ in content (A carries stop conditions and the recommendations-only constraint; B carries a ten-item outcome list). The queue section carries the **union** and links both; neither was renamed, per MSG-0058 F4. TASK-0022 is now the single READY task | 2026-08-21 |
| MSG-0061 | Record | CREATED — awaiting acceptance | Claude Code | Architecture lead | **TASK-0022 execution record.** `EPA-0004` delivered as a **PROPOSED** work-package definition: thirteen gates (G1–G13; G12 identity and G13 retention/privacy are new), ten dependency-ordered tasks (T-0 IdP as an **operator** task, then T-A…T-I), five test tiers, T1–T11 threat coverage, and every required field of the work-package standard. All fourteen rulings and F1–F4 folded in; **F1's cross-language gate is made a protocol-level contract rule** so a failed Arabic gate abstains rather than falling back to English. **No implementation, no ADR created, no provider or stack selected, no work-package number allocated, no task marked READY.** §7 refers **seven decisions** to the Architecture Lead, led by *may a policy document be Restricted?* — the one D3 sub-question MSG-0056b does not reach | 2026-08-21 |
| MSG-0062 | Decision | DECIDED | Architecture lead | Claude Code | **EPA-0004 ACCEPTED** as the bounded work-package definition, and **all seven MSG-0061 §7 items ruled.** 7.1 allocate a **new** work package, no existing WP number repurposed, identifier allocated by register reconciliation. 7.2 create only the ADRs needed to make the architecture enforceable before production; numbers allocated by convention in the next architecture task. **7.3 T-D (grounded QA) precedes T-E (retrieval-time authorization)** — authorization must not be validated against an unproven answer path. 7.4 integrate an OIDC/OAuth2 provider, never implement one; selection and deployment stay operator actions. 7.5 **a bounded corpus survey is authorized before T-B**, discovery input only, no production ingestion. **7.6 Restricted documents are eligible for the corpus but NO retrieve-then-suppress design is permitted** — never retrieved unless the subject satisfies policy; denial fails closed without revealing existence, content, timing, or result-count. **7.7 ADR-0015 is not inherited** as the service stack; a dedicated task proposes it. **Acceptance does not authorize implementation** | 2026-08-21 |
| MSG-0063 | Decision | AUTHORIZED | Architecture lead | Claude Code | **TASK-0023 authorized** — reconcile EPA-0004 and the MSG-0062 rulings into the governed work-package records, resolve the WP numbering/register discrepancy, allocate the formal work-package identity, and define the dependency-ordered architecture tasks and ADR allocation. Seven acceptance criteria. **Forbidden:** implementation, provider/model/runtime selection, permission or security-boundary changes, Supervisor changes, and **marking any implementation task READY**. Must reconcile rather than duplicate existing records | 2026-08-21 |
| MSG-0064 | Record | **CLOSED** | Claude Code | Architecture lead | **TASK-0023 queue reconciliation.** MSG-0063 authorized TASK-0023 and the queue did not contain it — the **sixth** recurrence of the MSG-0044 gap. Reconciled as the single READY task after verifying prerequisites individually: TASK-0022 COMPLETE, MSG-0062 DECIDED, MSG-0063 AUTHORIZED, no OPEN blocker, no runner lock, one specification file. Verified by dry run. **TASK-0023 was not executed in this session**, per the operator instruction | 2026-08-21 |
| MSG-0065 | Record | **CLOSED** | Claude Code | Architecture lead | **State/record correction.** Today's records said the Windows `Schedule` service was stopped by the operator. **Verified this session: the service is Running (Automatic); the scheduled task `PCI-Execution-Supervisor` is Disabled.** `LastRun` 10:47:47Z matches the final scheduled cycle in the supervisor log; every cycle after it is at an irregular time and was manual. The functional conclusion held — no cycle fires unattended — but **the remedy differs: enable the task, do not restart the service.** The task was **not** enabled: that is a Supervisor scheduling change, forbidden by MSG-0063 and an operator decision. MSG-0064 corrected in place | 2026-08-21 |
| MSG-0066 | Record | CREATED — reconciliation applied | Claude Code | Architecture lead | **TASK-0023 execution record.** All seven MSG-0063 acceptance criteria met with evidence. **WP-0009 — Employee Policy Assistant** allocated as the next number unused in either register (`grep` verified before allocation); **historical WP-0001 and all eight planning entries untouched**; the planning list and the canonical directory reconciled in `work-packages.md` §0 with a standing allocation rule, closing **DISC-0010**. Six ADR surfaces converted into a dependency-ordered sequence but **deliberately unnumbered — no ADR created**. **T-0 separated as operator-only** (organizational choice plus a privileged deployment). T-D precedes T-E per §7.3; §7.6's no-retrieve-then-suppress rule bound into gates G3/G6; ADR-0015 not inherited per §7.7. **No implementation, no provider selection, no permission or Supervisor change, and no task marked READY** — the queue has zero READY tasks. §6 carries three open items, none blocking; §7.3 discloses one process error caught before it reached a commit | TASK-0023 |
| MSG-0067 | Decision | DECIDED | Architecture lead | Claude Code | **Rules the three carried-forward MSG-0066 items.** (1) **T-D testing is authorized only against synthetic or otherwise non-confidential documents** — no real or confidential corpus may enter the T-D path until T-E retrieval-time authorization is implemented **and verified**. (2) PR3: use the organization's existing Microsoft/AD identity infrastructure **through the established OIDC/OAuth2 boundary**; PCI builds no IdP and does not bypass ADR-0007 with LDAP/Kerberos; owner and date remain organizational scheduling data, and T-0 stays an operator prerequisite. (3) **WP-0009 sits beside the PLAN-WP-0001 planning entries** — it does not satisfy, supersede, rename, or renumber them; the planning list stays forward-looking and WP-0009 is the canonical delivered identity. No implementation authorized; no task marked READY | 2026-08-21 |
| MSG-0068a | Decision | AUTHORIZED | Architecture lead | Claude Code | **TASK-0024 (A-ADR) authorized** — `-task-0024-authorization-epa-adr-drafting.md`. Evaluate the six WP-0009 §7 ADR surfaces against accepted ADRs, create only the required new ADRs, preserve accepted ADRs, report evidence through COMMS. **If an unresolved architecture conflict is found, stop at that boundary rather than improvising.** Architecture/documentation only; ADR numbers allocated only if and when drafting requires them. **Queue gate: TASK-0024 must be the single READY task before execution** | 2026-08-21 |
| MSG-0068b | Decision | AUTHORIZED | Architecture lead | Claude Code | **TASK-0024 (A-ADR) authorized** — `-task-0024-a-adr-authorization.md`. Same authorization, with a ten-item constraint list to preserve — ADR-0007/OIDC identity boundary, T-D before T-E plus the synthetic/non-confidential interim limit, no retrieve-then-suppress, English authority with Arabic approved translation and cross-language fail-closed grounding, session-default retention with employee-only access, inference-locality boundary — and six acceptance criteria. **May not mark T-A or any implementation task READY.** Shares a number with MSG-0068a; complementary, not contradictory | 2026-08-21 |
| MSG-0069 | Record | **CLOSED** | Claude Code | Architecture lead | **TASK-0024 queue reconciliation, and a doubled collision.** MSG-0068 authorized TASK-0024 and the queue did not contain it — the **seventh** recurrence, and the first observed live: the Supervisor logged `NOOP: no READY task` at 19:07:18Z and 19:17:18Z while the task sat authorized. Reconciled as the single READY task after verifying prerequisites. **Two specification files and two authorization messages** exist for this one task; all four agree, so no stop fired, and the queue section carries the **union** of all four. Nothing renamed, per MSG-0058 F4 | 2026-08-21 |
| MSG-0070 | Record | CREATED — ADR set drafted | Claude Code | Architecture lead | **TASK-0024 execution record.** All eight acceptance criteria met. **ADR-0017…ADR-0022 drafted as PROPOSED** in `implementation/decisions/` for the six WP-0009 §7 surfaces; numbers allocated at drafting time and **verified collision-free against actual repository state** before anything was written. **No accepted ADR modified, duplicated, renamed, or deleted** — `git status --porcelain` shows no path under `docs/decisions/`. All six surfaces **tested independently** against the accepted ADR/SPEC set rather than inherited from WP-0009 §7; all six survived because each rests on a ruling that is stricter than or absent from the accepted set and lives only in a COMMS message, which is not an authority tier. **§4 records the counter-argument for surface 4**, the one close call, so it can be rejected cheaply. **ADR-0019 is knowingly incomplete** — D6's Arabic normalization rules are deferred to the empirical corpus evidence the ruling requires, rather than invented (§6.2). **§7 reports a finding**: the accepted classification standard's Restricted rule is **conditional** (*"unless specifically designed for that data class and protected accordingly"*), not absolute as EPA-0001 §7.3 and EPA-0004 §11.6 summarize it — which is what makes MSG-0062 §7.6 consistent with accepted authority rather than in conflict with it. **No implementation, no provider/model/stack selection, no permission or Supervisor change, no ADR accepted, and no task marked READY** | TASK-0024 |
| MSG-0071 | Decision | DECIDED | Architecture lead | Claude Code | **Accepts ADR-0017 through ADR-0022** as the required enforceable ADR set for WP-0009. ADR-0017 accepted with the entailment model and numeric thresholds **explicitly undecided** under SPEC-0020; ADR-0019 accepted as a **bounded** decision with **Arabic normalization rules deferred to empirical corpus evidence** and no invented rules authorized; ADR-0020 accepted including the **no-retrieve-then-suppress** boundary and fail-closed handling; ADR-0018, ADR-0021, ADR-0022 accepted. The set is **to be promoted to the accepted decision register by repository convention**, preserving traceability and introducing no provider/model/runtime selection. **A-SURVEY and A-STACK remain unauthorized; no implementation task is authorized or READY** | 2026-08-21 |
| MSG-0072 | Record | **CLOSED** | Claude Code | Architecture lead | **ADR promotion gap.** MSG-0071 accepted all six ADRs and directed promotion; only **ADR-0017** was promoted to `docs/decisions/`. ADR-0018…0022 exist solely as drafts. The ADR index and all six draft headers are reconciled to record the acceptance, and the ADR-0017 draft is marked RATIFIED per the ADR-0015 convention. **The promotion itself was not performed** — it is the act that confers authority, and no READY task authorizes it. **Pre-promotion verification passed** (MSG-0072): no provider/model/runtime selection leaked in, ADR-0019 invents no normalization rules, ADR numbering collision-free. One decision required: finish it yourself, or authorize a bounded task | 2026-08-21 |
| MSG-0073 | Decision | AUTHORIZED | Architecture lead | Claude Code | **TASK-0025 authorized** — promote **ADR-0018…ADR-0022** into the authoritative `docs/decisions/` register, preserving approved content, numbering, traceability and explicit non-decisions. **Do not** change decision substance, introduce provider/model/framework/runtime selections left open, alter ADR-0019 normalization (deferred to empirical corpus evidence), authorize implementation, or mark A-SURVEY/A-STACK/T-0 READY. **Every promoted ADR must be verified against its source before completion is reported.** Answers MSG-0072. **Claude may execute it once reconciled as READY** | 2026-08-21 |
| MSG-0075 | Record | CREATED — promotion applied | Claude Code | Architecture lead | **TASK-0025 execution record.** All five MSG-0073 acceptance criteria met with evidence. **ADR-0018…ADR-0022 promoted into `docs/decisions/`**, completing the WP-0009 set alongside the lead's own ADR-0017 promotion; the drafts are marked **RATIFIED** with their proposed text retained unchanged. **Verification is a `diff` per record and every hunk is in a header** — each promoted file is a byte copy of its draft with exactly two edits, the `Status` block and an added `Accepted by: Architecture Lead — MSG-0071` line, so **zero body differences**. **No accepted ADR modified** — `git status --porcelain` showed five new paths under `docs/decisions/` and no modified path there. **The three MSG-0071 conditions were re-checked in the promoted copies**, not inherited from MSG-0072's pre-promotion pass: no provider/model/framework/runtime selection (ADR-0022's ADR-0003 Ollama citation intact and still declining to elevate it), ADR-0019 still incomplete for production by design with **no rule invented**, ADR-0017's entailment model and thresholds still open under SPEC-0020. §6.2 records that the supervisor's heartbeat `head` lagged this session's verified HEAD by one commit and why that is **not** the BLK-0006 abort condition; §6.3 records a cosmetic line-wrapping difference in the lead's ADR-0017 promotion, proposing no correction. **No implementation, no provider/stack selection, no permission or Supervisor change, and no task marked READY** — A-SURVEY, A-STACK and T-0 stay unauthorized. **No decision requested** | TASK-0025 |
| MSG-0076 | Decision | AUTHORIZED | Architecture lead | Claude Code | **Next bounded EPA architecture task authorized**, with two outputs: **A-SURVEY** (bounded, read-only corpus survey — formats, language mix, scanned-document prevalence, classification/audience patterns, version/supersession, **no production ingestion**) and **A-STACK** (evaluate candidate service stacks against accepted contracts and the EPA ADR set; **recommend or record why selection stays open — do not select** a provider, framework, model, embedding technology, or runtime). **Preserve ADR-0017…0022 exactly; no implementation; no IdP selection; no retrieve-then-suppress; do not mark T-A/T-B/T-D/T-E/T-0 READY.** Executable only once reconciled as the single READY task | 2026-08-22 |
| MSG-0077 | Record | **CLOSED** 2026-08-22 — corpus supplied; the one organizational action it asked for is discharged and A-SURVEY is authorized as TASK-0027 | Claude Code | Architecture lead | **TASK-0026 queue reconciliation, and an unmet prerequisite.** Reconciled as the single READY task; **TASK-0026 is an id allocated here** since MSG-0076 assigns none. **A-SURVEY cannot run: PR5 — a reachable approved-policy corpus — does not exist in this repository**, verified by inspection and corroborated by WP-0009 §6.1, EPA-0004 §11.5 and MSG-0061 §7.5. A-STACK is fully executable. The queue section instructs A-SURVEY to stop and record rather than produce observations it cannot have made. **Supplying the corpus is an organizational action** | 2026-08-22 |
| MSG-0078 | Record | **CLOSED** 2026-08-22 — the corpus action it waited on is discharged; its PARTIAL result stands unchanged and correct | Claude Code | Architecture lead | **TASK-0026 execution record — PARTIAL by design.** **5 of 6 MSG-0076 criteria MET; criterion 1 UNMET on PR5**, each mapped to evidence in §2. **A-STACK COMPLETE** → **EPA-0005** (PROPOSED, selects nothing): the stack is **not one decision** — the fork is one runtime or two, framed not settled; **ADR-0020 §3.1/§4 make pre-filtered retrieval a functional requirement on the index engine**, disqualifying post-filter-only similarity search, since over-fetch-then-filter is the prohibited shape one layer down and *looks* like enforcement; **three local models are required, not one** (generation, embedding, **and ADR-0017's entailment layer**), multiplying the unmeasured PR6; **conversation and audit are separate stores**, a single log violating ADR-0021 §2/§4 invisibly; and **streaming an answer as it generates is incompatible** with a post-generation gate that may veto it. **Every selection left open** in §9.2 with the evidence that would close each; **seven questions are corpus-blocked**. WP-0009 §6.2's ADR question is **answered** (§9.3: not yet; if the pre-filtering rule warrants recording it belongs with ADR-0020) and **no ADR was created**. **A-SURVEY NOT PERFORMED** — PR5 **re-verified UNMET by inspection**, not inherited; **no figure, estimate, illustration, or substitute method produced**. **No accepted ADR modified** (`git diff --name-only docs/decisions/` empty); **no task marked READY**; no host touched. **The organizational corpus action of MSG-0077 remains outstanding** | TASK-0026 |
| MSG-0079 | Record | **CLOSED** 2026-08-22 — superseded by local delivery; the unreachable path is moot and its n=1 observation was adopted by MSG-0080 | Claude Code | Architecture lead | **Operator designated an A-SURVEY corpus; verified unreachable.** `\\10.1.27.220\LXBackup\plan.pdf`, designated approved/synthetic and explicitly **not** production/confidential — **the PR5 authority question is resolved by that designation**. **The path is not reachable:** host answers ICMP, **corrected 2026-08-22 — the path is **NFS, not SMB**. Re-tested: **NFS 2049 and portmapper 111 both closed**, *and* **Client for NFS is not installed** on this workstation (`NFS-Client` = `Available`, i.e. installable but absent; the `mount.exe` on PATH is Git Bash MSYS, not the NFS client). **Two independent blockers** — fixing either alone changes nothing. Installing the feature is a privileged host change nothing authorizes. **Not a credentials problem** — no TCP connection is established, so no authentication is attempted; credentials, drive mappings and share permissions cannot help while the transport is closed. Four causes fit the signature and cannot be distinguished from this machine, so none is asserted. **No workaround attempted, nothing copied, no observations produced.** A-SURVEY stays unexecutable and, since TASK-0026 is closed, **completing it needs a newly authorized task**. Also records that one PDF cannot answer four of A-SURVEY's five questions, which are distributional — offered so a future record states its sample size rather than reading as a corpus survey. See **BLK-0008** | 2026-08-22 |
| MSG-0080 | Decision | AUTHORIZED | Architecture lead | Claude Code | **Bounded A-SURVEY follow-up authorized** against the approved/synthetic corpus at `D:\Work\pci-corpus\plan.pdf`, **deliberately outside the Git repository** — it must remain outside and must not be copied, staged, or committed. **Survey scope is n=1:** document-level observations only (text-native vs scanned, language present, format characteristics, and classification/audience/version/supersession **where present**). For format mix, language prevalence, scanned prevalence, classification distribution and supersession prevalence **across a corpus**, record that **n=1 is insufficient and invent no estimates**. No production/confidential ingestion, no ADR modification, no invented Arabic normalization rules, no provider/model/framework/embedding/runtime selection, and **T-A/T-B/T-D/T-E/T-0 stay unauthorized**. Seven acceptance criteria; executable only once reconciled as the single READY task | 2026-08-22 |
| MSG-0081 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0027 queue reconciliation.** Reconciled as the single READY task; **id allocated here** since MSG-0080 assigns none. Corpus verified present and readable outside the repository (626.8 KB, `%PDF-1.7`). **BLK-0008 CLOSED** — the transport problem is gone: the file was supplied locally, so neither the NFS export nor the uninstalled Client for NFS matters any more. The queue section carries the n=1 boundary and an explicit warning that the PDF must never enter the working tree — **a hazard that already materialised once today**, when the file first landed inside the repo untracked and one `git add -A` from permanent history | 2026-08-22 |
| MSG-0082 | Record + decision request | **CLOSED** 2026-08-22 — answered by MSG-0083 option A | Claude Code | Architecture lead | **Structural finding: the corpus is where the runner may not read.** MSG-0080 requires it **outside** the repository; the unattended runner's permission boundary **is** the repository, and `runner-settings.json` grants no read beyond it. **Observed, not inferred** — BLK-0009 records a real runner whose read of `D:\Work\pci-corpus` was **denied and not routed around**. Options for the Lead/operator: **(A)** a narrow read permission for that path, **(B)** run TASK-0027 interactively, **(C)** supply an extraction. **Not options:** copy the PDF into the repo, edit the permission set unauthorized, or infer document properties from filename/size. Undecided is safe — the run stops and records, costing one cycle | 2026-08-22 |
| MSG-0083 | Decision | AUTHORIZED — applied, verified, and **exercised successfully by TASK-0027 on 2026-08-22** | Architecture lead | Claude Code | **Option A authorized**: grant the unattended runner the narrowest read-only access to `D:\Work\pci-corpus\` for TASK-0027. **No write, delete, move, stage, commit, or repository access; do not broaden to other external directories; the PDF stays outside the repository.** Applied to `runner-settings.json` via `additionalDirectories` plus an `Edit()` deny on that path — read-only by construction — and **verified empirically** before being relied on: a headless session with those settings read 641,807 bytes, `%PDF-1.7`, and cannot write. Three ineffective deny rules were rejected by the permission layer and removed rather than left giving false assurance. **BLK-0010 RESOLVED; TASK-0027 READY, no re-authorization needed** | 2026-08-22 |
| MSG-0084 | Record + two referrals | **OPEN** — informational; neither referral blocks anything | Claude Code | Architecture lead | **TASK-0027 execution record — A-SURVEY performed at n=1.** **7/7 acceptance criteria MET.** The PDF was **read in place** and never entered the repository, verified four ways. **Document-level:** 45 pages, PDF 1.7, Word 2016, uniform near-A4, tagged, unencrypted, **no active content of any kind**; **text-native** — 107,988 characters decoded from all 45 pages, 0 undecodable glyphs, only two image XObjects (a 103×92 logo and its mask) in the whole file, so **D14 would not reject it**; **English only** — **0 Arabic characters**, all five `ToUnicode` CMaps Basic-Latin-only, all simple fonts `WinAnsiEncoding` — but three *different* English locale tags (`en-US` catalog, `en-ZA`×1819, `en-GB`×46), so a document's own declared language is not a single reliable value; **no classification marking whatsoever**, and version/approval exist only as title-page prose (`Developed: June 2010` / `Revised: November 2024`) with blank date fields and a handwritten-signature convention — so **at least one real approved policy document carries none of ADR-0018's lifecycle metadata in-band**. **Three extraction hazards** that corrupt ingestion *silently* (§5): every page-1 glyph drawn twice with an `/Artifact` drop-shadow copy; `/Lang` property strings that read as body text; and a 67-character vector flow-chart page. **INSUFFICIENT at n=1, no estimates invented:** format mix, language prevalence, scanned prevalence, classification/audience distribution, version/supersession prevalence — **so D6 stays deferred and ADR-0019 was not amended.** **Referrals:** the designated corpus is **real, not synthetic**; and the runner has **no PDF tooling** | 2026-08-22 |
| MSG-0085 | Decision | AUTHORIZED | Architecture lead | Claude Code | **Arabic corpus follow-up authorized** against `D:\Work\pci-corpus\Arabic.pdf` as an approved/synthetic test document, to complement the completed n=1 English survey. Assess **Arabic text encoding/extraction, language declarations, font/`ToUnicode` behaviour, text-native vs scanned, and normalization/extraction hazards relevant to ADR-0019** and downstream retrieval. **Record as n=1 for the Arabic follow-up; do not generalize.** Uses the existing MSG-0083 read grant — **no permission broadening**. **Do not amend ADR-0019**; implications are evidence for a later decision only. Keep the file outside Git; no production ingestion, no implementation, no corpus-wide prevalence claims; accepted ADRs preserved. Requires a new bounded task rather than re-running the closed TASK-0027 | 2026-08-22 |
| MSG-0086 | Record | **CLOSED** 2026-08-22 — discharged by execution (MSG-0087) | Claude Code | Architecture lead | **TASK-0028 queue reconciliation.** Reconciled as the single READY task; **id allocated here** since MSG-0085 assigns none, and MSG-0085 §9 explicitly requires a new task rather than re-running closed TASK-0027. `Arabic.pdf` verified present (663.3 KB, `%PDF-1.5`) in the directory MSG-0083 already grants read-only — **no permission change needed or made**. Queue section carries the separate-n=1 rule (the two documents must not be combined into a "corpus"), the ADR-0019 no-amendment constraint, TASK-0027's three extraction hazards as things to **check for rather than expect**, the personal-data restraint, and the no-PDF-tooling limit | 2026-08-22 |
| MSG-0087 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0028 execution record — Arabic follow-up at n=1, 9/9 criteria.** Executed interactively on operator instruction. **The document is OCR-derived** — `/Producer` = **ABBYY FineReader PDF 15**, 31 image XObjects with CCITTFax/DCTDecode/ImageMask **plus** a 6,400-operator text layer — so under **D14 it is the class the accepted architecture rejects**. Arabic confirmed present (three embedded `SimplifiedArabic` subsets; 62 UTF-8 Arabic-range byte pairs) in a **mixed-script** file. **No `/Lang` declared anywhere** — the English document declared it 1,865 times — so language must be detected, not read. `ToUnicode` coverage incomplete (11 refs / 31 font dicts); **per-font attribution deliberately not reported** because byte-level regex gave a wrong answer. **All three English hazards checked for and absent** — different producer, different defect population. **ADR-0019 not amended**; implications recorded as evidence only. Two items referred: the OCR class question, and that the file is COVID-19 IAR guidance rather than Hadi Clinic policy | 2026-08-22 |
| MSG-0088 | Decision | AUTHORIZED | Architecture lead | Claude Code | **Arabic text-native follow-up authorized** against a new document outside the repo, specifically because MSG-0087 found the prior Arabic file OCR-derived and excluded by D14. Test **D14 admissibility before using it as evidence**; record as **n=1**; do not combine with the OCR or English documents; assess Arabic extraction, `/Lang`, fonts/`ToUnicode`, native-vs-scanned, mixed script and normalization hazards; **do not modify ADR-0019**; no tooling, no permission changes; reconcile a new task rather than re-running a closed one | 2026-08-22 |
| MSG-0089 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0029 execution record — text-native Arabic at n=1, 11/11.** **D14-ADMISSIBLE**: zero images, zero OCR markers, four subset-embedded CID fonts each with a `ToUnicode` CMap (209 mappings, 186 Arabic), text round-trips to real Arabic. **New reproducible hazard: the text is stored in VISUAL order** — proven by code-point identity between the reversed first run and the authored `/Title` tail; naive extraction yields fluent-looking but wholly reversed Arabic. Also **intra-word spaces from kerning** and **detached diacritics**. **`/Lang` declares `en` on an Arabic document** — across three surveys the declaration has now been correct once, absent once, and wrong once. **ADR-0019 untouched.** Referred: the file is ChatGPT/WeasyPrint-generated, so its hazards are its toolchain's and not the organization's; and `Arabic.pdf` was replaced rather than kept | 2026-08-22 |
| MSG-0090 | Record + decision request | **OPEN** | Claude Code | Architecture lead | **Evidence-gap analysis for ADR-0019.** Verified the corpus directory: one **real English** organizational policy and one **ChatGPT/WeasyPrint-generated Arabic** specimen — **representative approved organizational Arabic material is REQUIRED and NOT AVAILABLE**, and across three surveys the project has never seen real+Arabic+admissible. **Nothing currently authorized is blocked**; ADR-0019's amendment is, and through MSG-0056a D6 so is **production use**. The needed evidence is **observed orthographic variation in real approved documents** across the five classes ADR-0019 §6 deferred. **Key distinction:** the surveys evidenced the **extraction** layer, which follows from the producing toolchain, and say nothing about normalization, which follows from how the organization's authors write — treating one as the other would be the error. Also flags that if approved Arabic policy exists only as scans, D14 leaves no admissible Arabic corpus and the question becomes whether Arabic is in the first release at all. **No rule proposed, no sample threshold invented, no task marked READY, ADR-0019 untouched** | 2026-08-22 |
| MSG-0091 | Record + ruling | **OPEN** | Claude Code | Architecture lead | **Records the Lead's n=1 sufficiency ruling** — the Arabic n=1 documents are sufficient technical test evidence for current architecture work; representative organizational Arabic material is **not required for bounded testing**; MSG-0090's gap is **preserved for the eventual production normalization decision**; and no new Arabic corpus requirement is to be created unless an existing ADR requires it. **Conflict check: none** — ADR-0019 §6 and MSG-0056a D6 gate **production**, which the ruling leaves intact; had it declared n=1 sufficient to amend ADR-0019 it would have conflicted and this session would have stopped. **Next-task identification: there is no authorized architecture task remaining.** WP-0009 §6.2 defines exactly three — A-ADR (TASK-0024, accepted and promoted), A-STACK (TASK-0026, `EPA-0005` PROPOSED), A-SURVEY (TASK-0027/0028/0029, n=1 ×3) — all executed, with no fourth referenced anywhere and every AUTHORIZED message matched to an execution record. **The gate is now the Lead's ruling on EPA-0005.** No task invented, no ADR touched, no corpus requirement created | 2026-08-22 |
| MSG-0092 | Decision | DECIDED | Architecture lead | Claude Code | **EPA-0005 ACCEPTED** as the architecture evaluation record and the ruling record for the runtime seam. **§9.1's three constraints are settled**: authorization enforced **inside** the retrieval operation (no retrieve-then-filter or over-fetch-then-filter); capacity for **three** local model workloads (generation, multilingual embedding, entailment); conversation and audit storage **separate**, Restricted passages barred from ordinary logs/telemetry. **Approach C chosen** — two services along the C2/C6 seam, governed application layer for the authorization-critical path plus a document/inference worker behind an explicit contract; **the worker is not an authorization authority**, authorization stays in the governed layer before retrieval, SPEC-0008 preserved. **A stack-shape decision, not a runtime selection.** **No generic stack ADR** — declined explicitly. **Nine selection categories stay open**; ADR-0019's Arabic deferral unchanged and n=1 does not become production corpus evidence. Authorizes one bounded task to draft a minimum ADR-0020 clarification, **draft only** | 2026-08-22 |
| MSG-0093 | Record | **OPEN** | Claude Code | Architecture lead | **MSG-0092 applied; TASK-0030 reconciled as the single READY task.** EPA-0005's header now records its acceptance, Approach C, and the three settled constraints — **not promoted to `docs/`**, because MSG-0092 accepted it without authorizing promotion and promotion is the Lead's act. TASK-0030 drafts the minimum ADR-0020 clarification making the existing §3/§4 pre-constrained requirement explicit as an **engine-selection gate**, and **stops before applying it** — ADR-0020 is accepted and promoted, so editing it is the Lead's act. Records that "no amendment is needed" is a legitimate outcome. **No engine selected, no ADR touched, no implementation task READY** | 2026-08-22 |
| MSG-0094 | Record + decision request | **CLOSED** 2026-08-23 — **both referrals discharged**: the amendment convention was ruled by MSG-0095 (option (a), in place) and applied by TASK-0031; the criterion-scope conflict it flagged was fixed exactly as it recommended, TASK-0031's criterion 4 reading `git diff --name-only docs/decisions/` | Claude Code | Architecture lead | **TASK-0030 execution record — the ADR-0020 clarification is drafted and NOT applied.** **7/7 acceptance criteria MET**; documentary, so **no test count and none claimed**. Delivers **`ADR-0020-AMD-01`** in `implementation/decisions/` as **PROPOSED**; **`git diff --name-only docs/` empty** — the accepted, promoted ADR-0020 is **unmodified**, per MSG-0092 §5. **The "no amendment needed" outcome was tested against the accepted text and rejected on evidence**: §3.1/§4 state the *rule* unambiguously and are silent on two *consequences* — that it **disqualifies a retrieval engine** unable to constrain inside the query, and **what G3 inspects**, since a conforming and a retrieve-then-filter design return **byte-identical responses**. The amendment is **one 148-word insertion at the end of §4** plus an optional traceability row; **twelve candidate changes were considered and deliberately not made**, including §3's four points, §7 and *Deliberately not decided here* — because **a criterion is not a selection**. **Selects nothing**; all nine MSG-0092 §4 categories stay open; ADR-0017/0018/0019/0021/0022 untouched. **One convention question referred**: no precedent exists for amending an accepted ADR, so **no header change was drafted** rather than invent one. **`git fetch` remains off the allowlist** — recorded, not routed around | 2026-08-22 |
| MSG-0095 | Decision | **DECIDED — §5 action discharged** 2026-08-23 by TASK-0031 (MSG-0097), applying commit `a1be892` | Architecture lead | Claude Code | **ADR-0020 AMD-01 ACCEPTED as drafted, with the optional traceability row included.** The amendment is the minimum clarification making an already-settled confidentiality rule **operationally testable during engine selection**; it changes no substantive policy. Closes two interpretation gaps: that an engine unable to apply authorization constraints **inside** the retrieval operation is **disqualified**, and that **G3 must inspect the query issued to the engine**, not only the returned response. "Over-fetch-then-filter" is consistent with MSG-0092 §1(1), already settled. **Apply in place** with a concise header note naming AMD-01 and MSG-0095 — settling AMD-01 §8 as option **(a)**; **no superseding ADR**. **Selects no engine, index technology, model, framework, runtime or provider**, and authorizes no implementation beyond applying the amendment | 2026-08-22 |
| MSG-0097 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0031 execution record — AMD-01 is APPLIED.** **7/7 acceptance criteria MET**; documentary, so **no test count and none claimed**. Applying commit **`a1be892`**, tree clean. `git diff --name-only docs/decisions/` named **ADR-0020 and nothing else**, at **15 insertions / 0 deletions** — the header note was *added* rather than replacing a line, so every accepted semantic is **byte-identical** to the promoted copy. Each of the four new markers occurs **exactly once**, and the amendment was verified **absent three ways before** editing, because re-running would insert hunk 1 twice. **AMD-01 §8 settled as option (a)** — the repository's first amendment of an accepted ADR, and a precedent **only** for an additive clarification changing no substantive policy. **Selects nothing** — a search of the whole file for twenty product names returns none; all nine MSG-0092 §4 categories stay open; ADR-0019's Arabic deferral untouched; **no implementation task is READY**. Two runner limits recorded, not routed around: **`git fetch` and `python` are both off the allowlist** | 2026-08-23 |
| MSG-0098 | Decision | AUTHORIZED | Architecture lead | Claude Code | **TASK-0032 authorized** — bounded **A-STACK technology evaluation and implementation planning**, as the next single READY task. May compare candidate technologies, record evidence and disqualifiers, define interfaces, and **recommend or explicitly preserve selection as open**. **Not authorized** to implement, deploy, or make a production technology selection. Binding: **Approach C** with the worker not an authorization authority; **ADR-0020 + AMD-01** — constraints inside the retrieval operation, retrieve-then-filter and over-fetch-then-filter disallowed; three local workloads required; conversation/audit storage separate with Restricted barred from logs; technology replaceable; **ADR-0019 untouched** and Arabic n=1 not production evidence. **Record missing evidence explicitly; invent no benchmarks, capacity figures, or corpus-scale findings.** Stop rather than cross the boundary | 2026-08-23 |
| MSG-0100 | Record + referrals | **OPEN** | Claude Code | Architecture lead | **TASK-0032 execution record — the bounded A-STACK technology evaluation is delivered and it selects nothing.** **7/7 acceptance criteria MET**; documentary, so **no test count and none claimed**. Deliverable **`EPA-0006`** in `implementation/architecture/`, **PROPOSED**. `git diff --name-only docs/decisions/` **empty**. **The AMD-01 criterion was applied to seven engine classes with reasoning, not assertion**: **post-filter-only (class D)** and **hosted/managed retrieval (class H)** are **DISQUALIFIED** — H twice over on **independent** grounds, since ADR-0022 §1 names *derived embeddings* explicitly, so relaxing one elimination would not revive the class. Classes **R/S/V/L are not disqualified and explicitly NOT cleared**; class **K** (retrieval computed against the kernel store) **conforms structurally** and is **entirely unmeasured**. **The sharpest finding: AMD-01's G3 evidence rule does not discharge AMD-01's engine-selection criterion** — a Shape-3 engine receives a conformant query and returns a correct response, so a query-shape check cannot detect it; **an engine exposing no plan or counter instrumentation cannot be cleared at all**. Also: **the four-part in-query predicate derived** (ADR-0018 §4's two-sided range with an open upper bound being the sharpest discriminator; **SUPERSEDED** the one lifecycle state that is a query predicate); **ADR-0016 RLS does not reach an external index**; **conformance for a relational engine is a property of the query plan**; **a strategy-switching engine is disqualified unless the strategy can be pinned**; **the retrieval port's signature is itself the control**; **no index-assigned identifier may appear in a citation**; **the verified append-only audit store is disqualified for conversation content**; **ADR-0020 §6.2 is a selection criterion on the engine and the serving runtime, not only a coding rule**. **Ten selections remain OPEN.** **No benchmark, capacity, latency, recall or corpus-scale figure appears anywhere in the record.** **ADR-0019 untouched, no normalization rule written or inferred**; MSG-0091's n=1 scoping respected. **No ADR created, amended or proposed**; **no implementation task marked READY**. **Five referrals, none blocking**; **the run stops for the Lead**, as MSG-0098 directs. **`git fetch` remains off the allowlist** — recorded, not routed around | 2026-08-23 |
| MSG-0101 | Decision | AUTHORIZED | Architecture lead | Claude Code | **Rules MSG-0100's five referrals and authorizes TASK-0033.** (1) **"One projection index" means one *logical* projection** — a lexical+semantic pair may be evaluated only if both operate over the same governed projection and **each independently satisfies AMD-01**; **the fusion layer must never resolve authorization**. (2) **SUPERSEDED chunks not settled now** — exclusion is the safer implementation shape, **ADR-0018's audit/reconstruction semantics preserved**, the ADR not to be modified. (3) **Bounded conformance probe AUTHORIZED** — may name candidate engines **as test subjects only**; naming is not adoption. (4) **EPA-0006 §12.2 obligations accepted as implementation-planning constraints; no new ADR** — authorization context at the retrieval port and worker seam, **index identifiers must not be citation anchors**, audit store not reused for expiring conversation content. (5) **Corpus action remains the organization's**; no new corpus or survey task authorized | 2026-08-23 |
| MSG-0102 | Record | **CLOSED** — environment finding superseded by MSG-0103 | Claude Code | Architecture lead | **TASK-0033 reconciled as the single READY task, with a verified environment finding.** The probe's **Tier 2/3 execution evidence is gated**: Docker Desktop is installed and its Windows services run, but **the Linux engine backend is not reachable** (`dockerDesktopLinuxEngine` pipe absent), and psql/sqlite3/java are absent while Python is installed but off PATH. **Starting Docker Desktop is an operator action and was not attempted**; installing engines is barred by MSG-0101 §4. **Tier 1 is available now**, and where Tier 2/3 cannot be obtained the answer is **NOT CLEARED, never assumed conformance**. Also records a near-miss: a first check through Git Bash reported no Docker and no Python **at all** — a **PATH artefact, not a machine fact** | 2026-08-23 |
| MSG-0103 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0033 stopped at the mid-run repository-movement boundary, and corrected the probe environment.** The stop was correct — `origin/main` moved mid-run, BLK-0006's boundary. **The correction is the substantive part: MSG-0102 §2 was wrong.** SQLite is not only a CLI but an **embedded engine compiled into the Node runtime** that MSG-0102's own table listed as available, reachable via `node:sqlite` with no dependency, install or network — so a real relational engine with lexical search, `EXPLAIN QUERY PLAN` and counters was present all along, and **Tiers 2 and 3 were runnable**. Left uncorrected, the next runner would have scoped the probe around a false constraint. Same shape as the TASK-0029 error; **the lesson is easier to state than to apply** | 2026-08-23 |
| MSG-0104 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0033 execution record — the probe ran and cleared nothing.** **SQLite 3.51.3 via `node:sqlite`** exercised as a **test subject only**: 3 query shapes plus a non-conforming negative control, 2 index designs, 3 collection sizes — **24 candidate executions across 6 fixtures**, all three EPA-0006 §4.4 tiers. **Tier 1 and Tier 2 passed; Tier 3 decided against the candidate**: every shape examines a **non-zero number of unauthorized rows growing linearly with the collection**, bounded by index coverage rather than by the authorization predicate, **while returning results indistinguishable from a perfectly conforming engine's** — AMD-01's central claim demonstrated empirically. Verdicts: SQLite C1/C2/C3 **NOT CLEARED**; class D post-filter **DISQUALIFIED**; classes S/V/K **NOT CLEARED** with zero execution evidence; class H **DISQUALIFIED** under ADR-0022 §1. Probe source and output committed for reproducibility. **No engine adopted; no ADR touched** | 2026-08-23 |
| MSG-0105 | Decision | DECIDED | Architecture lead | Claude Code | **Strict Shape-1 selected: "examines nothing unauthorized."** The engine **must not examine, retrieve, inspect, or otherwise process** content the requesting user is not authorized to access; **authorization must constrain the candidate set before retrieval/search occurs**. Preventing unauthorized content from being materialized or returned **after examination is not sufficient**. **MSG-0104 §6.3's weaker "materializes no unauthorized content" reading is explicitly REJECTED**, and all MSG-0104 verdicts stand unchanged. **An interpretation of AMD-01's existing gate — not a weakening, and not a policy change.** Existing evidence **must not be relabelled** as conformance under the rejected reading. Authorizes a bounded criterion/probe-spec task; **no engine selected, adopted, installed or deployed** | 2026-08-23 |
| MSG-0106 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0034 reconciled as the single READY task** — update the retrieval-engine criterion and probe specification to test **strict Shape-1** explicitly. Carries two constraints the task could otherwise blur: **MSG-0104's verdicts must be reproduced unchanged**, and this is an **evidence-instrument** update, **not an ADR amendment**. Surfaces one consequence **without deciding it**: where a single index spans multiple authorization scopes, a scan may examine unauthorized entries even with a correct predicate — so whether strict Shape-1 is satisfiable by query-time predicates alone, or implies something about how the projection is **physically organised**, is a real question interacting with MSG-0101 §1(1)'s "one **logical** projection". Also repairs a ledger gap: **MSG-0103 and MSG-0104 had register rows but no ledger rows** | 2026-08-23 |
| MSG-0107a | Record + referrals | **OPEN** | Claude Code | Architecture lead | **TASK-0034 execution record — the criterion and probe specification now test strict Shape-1.** **7/7 acceptance criteria MET**; documentary, so **no test count and none claimed**. **EPA-0006 §4.6** states the criterion in testable form: **the passing bar is ZERO unauthorized units examined**, shown **invariant across at least three collection sizes** — growth with `N` rather than with selectivity being the signature of a traversal bounded by **index coverage** instead of **authorization**. Five unit kinds are defined (**U4** term postings / vector-index nodes and **U5** buffers, caches and log lines are the additions, the latter from ADR-0020 §6.2 carrying **no authorization exception**). **Four evidence classes are all required for CLEARED**, led by **E1 traversal-bounding plan evidence**, because of the **asymmetry rule: counters can prove failure but never success** — a zero count observes only the point where the instrument sits, so **a plan showing a scan over a structure spanning authorization scopes is disqualifying regardless of any counter**. **An unmeasurable stage is NOT CLEARED by rule** rather than by the writer's care, closing the FTS5 gap MSG-0104 flagged; instrument placement must be recorded and the **maximum** count reported as a lower bound (MSG-0104 §4.2's identical-plan 2000-vs-1000 result is the precedent); the **negative control is mandatory or the run is void**. **The rejected "materializes no unauthorized content" reading is recorded as rejected**, carrying its worked example — **C1 met that line exactly, zero bodies materialized, while examining 1000 unauthorized rows at M=5000, and remains NOT CLEARED.** **All nine MSG-0104 verdicts are reproduced verbatim and unchanged.** **One claim is WITHDRAWN and it is not a verdict**: EPA-0006 §4.3's class-K *"CONFORMS structurally"*, since its argument reasons from the **result set** — precisely the rejected reading — while **class K's verdict stays NOT CLEARED**; the withdrawal removes a conformance claim and creates none. **§4.7 surfaces three questions and decides none**: whether "examine" reaches index metadata (**default: the strict reading**, fail-closed); **whether strict Shape-1 is satisfiable by query-time predicates alone or implies physical organisation of the projection** — MSG-0106 §4's question, interacting with MSG-0101 §1(1)'s *logical* projection and sharpened by the point that **effectivity is a continuous open-ended range and audience a multi-valued set overlap, so not every conjunct partitions**; and what follows if **no class can reach zero**. **`git diff --name-only docs/` empty** — no accepted ADR touched, ADR-0019 included. **Nothing selected, adopted, installed or deployed; the probe was NOT re-run and no figure in the record is new; no implementation task marked READY.** The run **stops for the Lead** | TASK-0034 |
| MSG-0107b | Decision | AUTHORIZED | Architecture lead | Claude Code | **Physical projection isolation is part of strict Shape-1 where necessary** to guarantee the engine does not examine unauthorized content. **Query-time predicates alone are insufficient unless execution evidence demonstrates they genuinely prevent examination** — predicates are not disqualified in principle, only unproven without evidence. Authorizes **TASK-0035**: define technology-agnostic isolation patterns, evaluate each EPA-0006 class against strict Shape-1, **distinguish logical projection from physical organization** and **do not reinterpret MSG-0101 §1(1) as requiring one physical index or store**, produce evidence on examination-before-retrieval, identify what needs execution evidence versus documentation, **preserve MSG-0104 verdicts without relabelling**, and record disqualifiers and gaps. **The SQLite result is evidence against the tested configuration, not proof that all relational engines fail.** **Nothing selected or deployed**; stop at evidence | 2026-08-23 |
| MSG-0108 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0035 reconciled as the single READY task, and a numbering collision recorded.** **Two files are numbered MSG-0107** — the TASK-0034 execution record (**0107a**) and the physical-isolation authorization (**0107b**). **Complementary, not contradictory**, so no stop fired; disambiguated as a/b, **neither renamed** per MSG-0058 F4, and **0107b was unregistered in both indexes** until now. This is the **sixth** number collision (MSG-0020, 0033, 0046, 0056, 0107) and the first between a **lead-authored decision and a runner-authored record** — the two authorship paths do not see each other's numbering. Task section carries the ruling that answers MSG-0106 §4, the **zero** bar from TASK-0034, and the instruction that the SQLite result does not condemn its class | 2026-08-23 |
| MSG-0109 | Record + referrals | **OPEN** | Claude Code | Architecture lead | **TASK-0035 execution record — physical isolation reaches zero, and the way it reaches it introduces a new failure.** **8/8 acceptance items discharged**; **a real probe ran** — 8 designs × 3 collection sizes on **SQLite 3.51.3 via `node:sqlite`** (class **R** test subject, the only engine reachable), plus a staleness measurement, `:memory:` only, no install, no network, no corpus. The **mandatory negative control failed** (0/5 at M=500 and M=5000), so the run is valid. **Seven technology-agnostic isolation patterns (I0–I6)** are defined from one rule: a partitioning discharges a conjunct **only if the key refines it**. **Scope, classification, lifecycle state and audience refine — audience only at the cost of replication; effectivity does not refine at all without fixing a time**, which is §4.7 Q2's difficulty with a measurement attached. **`U` = 20/200/2000 (no isolation), 40/400/4000 (scope only — the WORST, because a structural restriction replaced an index one without carrying the predicate), 20/200/2000, 10/100/1000, then ZERO** once effectivity is materialised. **`U` equals the number of unauthorized rows the routed structures still contain** — two independently measured quantities agreeing at every design and size. **The sharpest result is the staleness case: a materialised structure queried after the clock moves examines 5/50/500 unauthorized rows AND RETURNS 5 of 5 unauthorized rows** — no TASK-0033 candidate ever returned one. **Physical isolation trades a conservative failure (examine, reject) for a leaking one (return stale content)** unless ADR-0020 §3.2's kernel re-check, §1's staleness threshold and A7 actually run. **Per-partition lexical indexing answers MSG-0104's unmeasurable-FTS5 gap structurally rather than by instrument** — admissibility unruled, default **no**. **Nothing is CLEARED**; **all nine MSG-0104 verdicts reproduced verbatim and none altered**; **`git diff --name-only docs/` empty**; **TASK-0033's harness untouched**. **Three questions referred, none blocking**: partition **routing** (computed, never discovered), the **staleness bound** for a materialised structure, and whether **structural confinement** is admissible E3 evidence | 2026-08-23 |
| MSG-0110 | Decision | DECIDED | Architecture lead | Claude Code | **Rules TASK-0035's three referrals, all fail-closed.** **Q4** — partition routing must be **computed from the requesting subject's own entitlements**, never by enumerating a catalogue whose identifiers or metadata encode other subjects' authorization attributes; **partition selection must not itself become an unauthorized examination step**; logical/physical distinction unchanged. **Q5** — a temporally materialised structure is **NOT CLEARED unless both** its re-materialisation interval is bounded per ADR-0020 §1 **and** the §3.2 post-retrieval kernel re-check is demonstrated to run; the TASK-0035 staleness evidence is **decisive against clearing a stale materialisation**; **no new numeric threshold is invented**. **Q6** — **construction alone cannot satisfy E3**; documentation of an intended boundary is not execution evidence of actual traversal, and the candidate stays NOT CLEARED until such evidence exists. **All nine verdicts unchanged; nothing cleared; nothing selected.** Authorizes TASK-0036 | 2026-08-23 |
| MSG-0111 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0036 reconciled as the single READY task** — encode Q4/Q5/Q6 as explicit strict Shape-1 clearance gates in the EPA-0006 probe specification. Verified before queueing that both anchors MSG-0110 §3 relies on **exist in the accepted ADR**: §1's *"a stale index beyond threshold triggers abstention (A7), never a stale answer"* and §3.2's per-hit re-authorization. **Surfaces one subtlety without deciding it**: §1 names a *threshold* but this task may not fix its value, so if no numeric bound is fixed anywhere accepted, "bounded" is testable **structurally** — a bound exists, is enforced, triggers abstention — **but not numerically**; the task must say which it tests and **refer the gap rather than choose a number**, since choosing one would invent the tolerance MSG-0110 §3 forbids | 2026-08-23 |
| MSG-0112 | Record + referral | **OPEN** | Claude Code | Architecture lead | **TASK-0036 execution record — the three rulings are now testable gates.** **8/8 acceptance criteria MET**; documentary, so **no test count and none claimed**, and **neither probe was re-run**. **EPA-0006 §4.9** encodes MSG-0110 by quotation, not paraphrase. **G-Q4** — the routed set is a function of the **subject's entitlements alone**, **does not vary with collection contents** (differential test), involves **no catalogue enumeration** (E1-class evidence covering the **routing phase**), and **routing-phase units count toward `U`** — closing the gap that routing *feels* like it happens before retrieval when **choosing which structures to open is part of resolving the query**. Records the design consequence: a partition **naming scheme** encoding authorization attributes turns the engine's catalogue into a **directory of other subjects' attributes**, so the name must be **computed and resolved by exact key**, never **found** by scanning — **two behaviourally identical implementations, only one of which passes**. **G-Q5** — **the conjunction IS the gate**: condition 1 bounds *how long* the structure may be wrong, condition 2 catches a hit that is wrong anyway, **and neither substitutes for the other**. **The sharpest limb is G-Q5.2b**: a "re-check" reading the **stale copy's own columns re-checks the stale data against itself and is a no-op** — it would have passed every row of P4S while that design returned 5 of 5 unauthorized rows; **G-Q5.2c** applies §4.6 S5's asymmetry — a re-check observed running but never observed **rejecting** has demonstrated that it runs, not that it works. **G-Q6** — the construction-only proposition is **recorded as rejected**, because the argument assumes the stage cannot reach outside its structure and **that assumption is itself an engine property**; global term dictionaries, shared doc-id maps, corpus-wide statistics and global ANN graphs are each **a path out of the confinement the argument does not see**. **All three are NECESSARY and none is SUFFICIENT** — §4.6 S6's E1–E4 remains the bar. **Nothing CLEARED**; **nine MSG-0104 verdicts and eight TASK-0035 design verdicts reproduced unchanged**, and **no figure is new**. **`git diff --name-only docs/` empty**; **272 insertions, 0 deletions**; `### 4.9` written **exactly once**. **One question referred — Q7**: **VERIFIED that no numeric staleness threshold exists anywhere in the accepted set** — ADR-0020 §1 names it, and ADR-0020's ***Deliberately not decided here*** calls it *"an operational parameter, tuned with real evidence"* — so **G-Q5.1 is a structural gate and says so**, and **no number was chosen**, since choosing one would invent the tolerance MSG-0110 §3 forbids. **It blocks nothing** — the structural gate **fails P4S by demonstration**. Also records, without acting on it, that **WP-0009 §6.2's A-STACK row-chain stops at TASK-0033** and does not carry TASK-0034/0035/0036 | 2026-08-23 |
| MSG-0113 | Decision | DECIDED | Architecture lead | Claude Code | **Q7 resolved as a version-transition freshness/security requirement, NOT an elapsed-time SLA.** When a policy is **updated, approved, revoked or superseded**, the prior version **must not be used for employee answers once the change is recorded**; if the current approved version cannot be established or made available, the system **must abstain** rather than answer stale. Mechanism: the **kernel record is authoritative**; the **transition itself** invalidates the retrievable prior version rather than a periodic timer; retrieval resolves against the current version; **unavailable new version ⇒ abstain**; the kernel re-check stays mandatory against authoritative state; and **any physical/partitioned representation must carry version identity — physical isolation does not excuse stale-version use**. **No numeric threshold introduced**; a time bound may be evaluated only if an architecture needs one as enforcement, never as a replacement. **Evidence must distinguish transition-triggered freshness from periodic re-materialisation — a fixed-time pass alone establishes nothing.** All verdicts unchanged; nothing selected | 2026-08-23 |
| MSG-0114 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0037 reconciled as the single READY task** — produce execution evidence for version-transition freshness and stale-version fail-closed behaviour, covering update/approve/revoke/supersede and the unavailable-new-version abstention case. Records why Q7's reframing retires the numeric question: **a timer measures how long ago a structure was rebuilt; the requirement is whether the authoritative version changed**, which a timer cannot observe. Carries the discriminator into the task as the thing most likely to be got wrong — **a design re-materialising every N seconds passes a naive V1→V2 test by waiting**, so the fixture must test at a moment a timer would not have fired, such that a periodic design fails and a transition-triggered one passes. Also ties MSG-0113 §2(6) to TASK-0035's leaking-failure evidence | 2026-08-23 |
| MSG-0116a | Decision | DECIDED | Architecture lead | Claude Code | **Rulings on Q8/Q9/Q10** (`-rulings-q8-q10.md`). **Q8 — NO**, the mandatory §3 point-2 kernel re-check is not "examination" **provided** it reads only authorization/version/lifecycle metadata and not unauthorized content; it is **mandatory**, must consult **authoritative current state not a materialized copy**, and **the measured kernel-read count is not by itself a Shape-1 violation**. **Q9 — Q3 stays open and the bar is not relaxed**: a non-zero result is not acceptable merely for being invariant with collection size, no engine may be chosen assuming an unmeasured kernel join fixes it, and **if nothing satisfies the gates the project returns to Q3** rather than relaxing Shape-1. **Q10 — currently effective version only**: APPROVED-but-not-PUBLISHED is not answerable, withdrawn/superseded are not current, unavailable ⇒ abstain, and **the citation must identify the actual current version**. No ADR modified; nothing selected | 2026-08-23 |
| MSG-0116b | Decision | DECIDED | Architecture lead | Claude Code | **Rulings on Q8/Q9/Q10** (`-q8-q10-rulings.md`) — **agrees with MSG-0116a on all three and on the next action**, and adds the operative constraints. **Q8**: the re-check **must be instrumented separately from retrieval-content examination**, evidence must show it reads **only authoritative kernel facts**, and **a purported re-check that reads content-bearing data from an unauthorized candidate is examination and fails Shape-1**; **no clearance follows** — E1–E4 and G-Q4/G-Q5/G-Q6/G-Q7 remain independently necessary. **Q9**: records that **A6 passed freshness yet stayed NOT CLEARED** (E2 failed, E4 not obtained, G-Q4 not measured). **Q10**: any formal lifecycle change **remains an ADR question**. Complementary to 0116a, not contradictory | 2026-08-23 |
| MSG-0118 | Record + referral | **OPEN** | Claude Code | Architecture lead | **TASK-0038 execution record — the kernel-constrained alternative is measured, and the answer is negative.** **8/8 acceptance criteria MET**; **a real probe ran**: 9 designs × 7 scenarios × 3 collection sizes, two instrument placements plus a **placement-independent** structural measure, class **R** subject, `:memory:` fixtures, nothing installed, no network, no timing figure. **Both validity gates passed** — the adversarial precondition held at all three sizes and the **negative control failed in 15 of 21 cases**. **Two defects in the probe's own apparatus were caught and fixed before any result was reported**: an E1 check matching table names against a plan that prints **aliases**, which had reported **HOLDS for a design whose plan scans the whole collection**; and a counter placement that made one design's `U = 0` an **artefact** (K7: 0 → 715 once the placement was made uniform). The second defect produced the probe's most useful instrument — **`Ustruct`**, unauthorized versions **present in the structures opened**, which is placement-independent and exists because **`U1` index-entry reads are NOT instrumentable through `node:sqlite`**. **Six results carry beyond the engine.** **(1) Removing the copy fixes divergence and does nothing for Shape-1** — K1/K2 hold no copy, answer **7/7**, cannot go stale, and carry the **largest `U`, growing linearly with `N`**; non-divergence and non-examination are independent properties. **(2) The four discrete conjuncts refine perfectly** — K3's residual is **entirely** the three effectivity modes (714 + 714 + 714), with **zero** wrong-scope, wrong-audience, restricted-class or superseded units at any size, so **§4.7 Q2's answer is yes for the discrete conjuncts** and effectivity is the whole difficulty. **(3) `U = 0` is purchasable by withholding authorized content** — K4 scores zero at every size and **3/7**, returning an **empty ANSWER** where an answer exists; a criterion reading `U` without the served set can be satisfied by a design that answers nothing. **(4) A design can report `U = 0` while the structures it opens still hold unauthorized entries** — K4 and K8 report zero with `Ustruct` **714** and **2143**. **(5) The sharpest result: K7 and K8 differ by ONE `INDEXED BY` token** — same schema, data, indexes, answers, 7/7 grid — and **`U` goes 715 → 0**, so **on this engine class whether unauthorized content is examined is decided by the query planner**, which is not part of the architecture and is not stable across data volumes or engine versions; **a `U = 0` taken without pinning the plan measures one plan, not a design**, and **E1 is the only evidence class that can see it**. **(6) The separately-instrumented re-check is the ONLY thing distinguishing a clean design from a violating one** — K0 and K6 agree on `U`, `Ustruct`, plan, routed set, answers and grid; **only `KR.content` separates them** (12 reads from unauthorized candidates), so **MSG-0116b's requirement is what makes Q8 falsifiable**. Also: **G-Q4 measured for the first time** — **K5 fails it while returning exactly K0's answers**, routing reads scaling **12 → 76** with other subjects' structures, so §4.9's *"behaviourally identical and only one satisfies the gate"* is **demonstrated**. **E4 NOT OBTAINED** (no engine log reachable), stated **before** the results table so no row is misread; **E3 N/A for this fixture and expressly non-transferable**. **Nothing CLEARED** (6 NOT CLEARED, 3 DISQUALIFIED); **all prior verdicts unchanged, A6's freshness-passed-but-NOT-CLEARED included**; no prior probe modified or re-run. **`docs/` untouched**; EPA-0006 **§4.11** added, **187 insertions / 0 deletions**; **no numeric threshold introduced**. **One question referred — Q11**, non-blocking | 2026-08-24 |
| MSG-0119 | Decision | DECIDED | Architecture lead | Claude Code | **Q11 ruled strictly**: an **exact-key seek into a scope-spanning structure does not satisfy E1**, even though it touches only an entitled row — E1 requires confinement to a structure **every entry of which** satisfies the predicate. **K3 and K4 remain NOT CLEARED.** **Fail-closed**: it withholds clearance and relaxes nothing. **K7 and K8 are unaffected** — their version and chunk stores are **physically partitioned**, so they satisfy E1 under both readings. Strict Shape-1, `U=0`, E1–E4 and G-Q4 unchanged; nothing selected or authorized | 2026-08-24 |
| MSG-0120 | Decision | AUTHORIZED | Architecture lead | Claude Code | **TASK-0039 authorized** — close K7/K8's remaining clearance gaps: obtain or explicitly establish the missing **E4 engine-log evidence**; address the **index-entry observability limitation (`U1`) without claiming an unsupported zero**; and determine whether K7/K8 satisfy E1–E4 and G-Q4 **with evidence independent of a single observed optimizer plan**. Preserve strict Q11 and the rule that unauthorized examination is disqualifying. **Do not infer unavailable engine-log evidence; do not claim `U1 = 0` when the subject cannot observe index-entry reads; do not generalize `node:sqlite` planner behaviour to other engines.** **Unobtainable evidence ⇒ NOT CLEARED, never an inferred pass** | 2026-08-24 |
| MSG-0121 | Record | VERIFIED | Architecture lead | Claude Code | **COMMS verification of Q11 and TASK-0039** — confirms MSG-0119 records the already-decided strict E1 ruling and MSG-0120 records TASK-0039 as the next bounded evidence action on K7/K8's E4 and index-entry gaps. **Existing security gates unchanged; no engine selection or implementation authority granted** | 2026-08-24 |
| MSG-0123 | Record + referral | **OPEN** | Claude Code | Architecture lead | **TASK-0039 execution record — the three remaining gaps are closed, and two of them close against the candidates.** **8/8 acceptance criteria MET**; **a real probe ran**: 2 designs × 6 configurations × 4 sizes × 2 distributions, three instrument variants per cell (**96 measurements**), class **R** subject, `:memory:` fixtures, nothing installed, no network, no timing figure. **Both validity gates passed** — adversarial precondition held at all four sizes under both distributions, **negative control failed 4 of 4**. **Two apparatus defects caught before any result was reported**: an index-entry column **mislabelled** as unauthorized-only, whose error direction was **overstatement** (fixed by splitting engine-measured **`Nidx`** from a deliberately generous **derived** `U1lb`); and **an assertion the probe's own output contradicted in the same line** — it claimed the authorizer fires only at prepare time while printing `101` execution-phase callbacks (replaced by an **invariance-with-`N`** measurement: 101 at M=500 and M=5000 ⇒ a **compilation** event, not a counter). **E4: NOT OBTAINABLE, established by enumeration and not inferred** — no trace/profile/log API bound by `node:sqlite`; build lacks `SQLITE_DEBUG`, `ENABLE_SQLLOG`, `ENABLE_STMT_SCANSTATUS`; **every tracing pragma demonstrated inert against a nonexistent-pragma control** (SQLite silently ignores unknown pragmas, so *"no error"* is evidence of nothing); `:memory:` leaves no file. Under §4.6 S6 **nothing could have been cleared whatever any count showed**, stated **before** the results table. **`U1`: PARTIALLY INSTRUMENTABLE after all**, reversing MSG-0118's "not instrumentable" — a function on `open_ended`, the leading column of **both** candidate indexes, is evaluated **from the index cursor** and fires per entry visited; **calibrated exactly (302, 402) against a cohort known by construction on both plans** before use; transfer licence checked in every cell (**0/96 failures**). It is a **LOWER BOUND**; **`U1 = 0` is claimed nowhere.** **The sharpest result: K7 and K8 visit the SAME number of entries at every size** (10 / 74 / 717 / 2860) **while `U` reads 7 / 71 / 714 / 2857 versus 0** — **MSG-0118's headline K7-vs-K8 finding was correctly measured and meant something narrower than it looked: K8 did not examine less; it examined the same amount where a row-access counter cannot see it.** Demonstrated at opcode level: `SeekGT → IdxGT → DeferredSeek → Column(index cursor) → Gt → Next` — the entry is rejected **from the index** and the row is never read, so §4.6 S5 is now the engine's own bytecode rather than a warning. **And `ANALYZE` ALONE drives K7's `U` from 2857 to 0** while `Nidx` goes **2860 → 2861**, one entry **more**: **the same design measured before and after routine maintenance receives opposite `U` readings.** §4.11 result 5 said the planner decides; **this says a maintenance command decides.** **Plan-independence SPLITS.** E1's **reachable-structure** limb is **OBTAINED independently of the optimizer** via `DatabaseSync.setAuthorizer` — a surface no prior probe used — which enumerates at compilation a **superset** of what any plan opens: 8 structures, all routed partitions, **no scope-spanning structure**, identical under every configuration, and it **fails the negative control plan-independently** (`k_chunk`, `k_version`). E1's **confinement** limb is **NOT** — 2 distinct version traversals per design, and **`INDEXED BY` pins one limb only**: K8's *open* limb still became a full partition scan after `ANALYZE`. **G-Q4 MET in all 12 design × configuration pairs**, differential test identical at `otherSubjects` 0 and 64. **Verdicts: K7 NOT CLEARED, K8 NOT CLEARED.** **Strict Q11 preserved — K3/K4 not re-run and still NOT CLEARED**; all prior verdicts unchanged; no prior probe modified or re-run; **`docs/` untouched**; EPA-0006 **§4.12** added, **178 insertions / 0 deletions**; no numeric threshold, no benchmark figure. **The candidates were not defeated by examining too much — they were defeated by the engine not being answerable**, which is §4.6 S10 biting; offered as the sharpest input to the **§4.7 Q3** return MSG-0119 mandates. **One question referred — Q12**, non-blocking | 2026-08-24 |
| MSG-0122 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0039 reconciled as the single READY task.** Records why K7/K8 are the right subject: **MSG-0119's strict Q11 leaves them the only candidates whose E1 position is not in question**, since their version and chunk stores are physically partitioned and satisfy E1 under **both** readings. Carries the three shortcuts that would each produce a false pass — **absence of observation is not observation of absence** (`U1` unmeasurable ≠ zero), **missing logs may not be inferred** (E4 unobtainable ⇒ record it), and **one `EXPLAIN` is not plan-independence** (a single plan shows what the optimizer chose on that occasion, not what it will always choose) — plus the standing bar on generalizing `node:sqlite` planner behaviour | 2026-08-24 |
| MSG-0124 | Decision | DECIDED | Architecture lead | Claude Code | **Q12 ruled strictly**: when the engine exposes a **reachable index-cursor placement, the probe must exercise it** in addition to other applicable placements. **A criterion decision — not an engine selection, not implementation authority.** The strict Shape-1 / E2 bar is **not relaxed**; **a probe omitting a reachable index-cursor placement cannot clear a candidate on row-access-only evidence**; **the maximum observed across exercised applicable placements is the reported figure**. **MSG-0123's verdicts unchanged — K7 and K8 remain NOT CLEARED** | 2026-08-24 |
| MSG-0125 | Decision | AUTHORIZED | Architecture lead | Claude Code | **TASK-0040 authorized** — encode Q12 in **EPA-0006 §4.6 S7** through the established TASK-0034 criterion-update mechanism. S7 must require every **reachable index-cursor placement to be exercised**, the **maximum observed across exercised placements to be reported**, and **row-access-only `U = 0` to be insufficient for E2** where a reachable index-cursor placement exists unexercised. **Additive and declared; no silent rewrites; no ADR modified; verdicts preserved; no prior probe re-run.** **Do not claim a row-access zero proves index-cursor zero; create no numeric tolerance.** **Verify post-change EPA-0006 from `main`** and record exact change statistics. **Stop after the update** — the next evidence action is separately authorized | 2026-08-24 |
| MSG-0126 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0040 reconciled as the single READY task.** Records the inference Q12 closes and why it recurs: **a row-access counter can read zero while an index cursor walks entries the subject cannot see** — the same error shape as the `U1` limitation in TASK-0038/0039, and as earlier PATH and CLI mistakes in this session. S7 must therefore make the **omission itself disqualifying**, not merely noted. Also carries MSG-0125's verification instruction: **read the post-change EPA-0006 from `main`, not the working tree** — the step that distinguishes "written" from "published", after BLK-0006 saw a push rejected mid-run | 2026-08-24 |
| MSG-0127 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0040 execution record — Q12 is encoded and the run stops.** **8/8 acceptance criteria MET.** **EPA-0006 §4.6 gains S7.1–S7.4**: MSG-0124 **quoted verbatim**; **S7-R1** every reachable index-cursor placement must be **exercised — executed and captured, never described** (§4.9 G-Q6's rule applied); **S7-R2** the **maximum observed across exercised applicable placements** is the reported `U`, still a **lower bound**; **S7-R3** row-access-only `U = 0` is **insufficient for E2** where such a placement exists unexercised, and the insufficiency is **disqualifying** — E2 not satisfied, so **NOT CLEARED** by S6. **"Reachable" defined as occupiable-and-exercised**, established by taking the placement rather than by documentation; a **"none reachable" report is admissible only by enumeration**, on §4.12 gap 1's nonexistent-pragma control — *"the instrument reported nothing" and "the instrument was never running" are the same observation*; **unreachability is not relief**: the zero stays inconclusive, **E1 is still required**, **S10 may bite**. A probe must now record the **reachable-but-unexercised set, which must be empty**. **98 insertions, 0 deletions**, one file, **additive and declared**; `git diff --name-only docs/` **empty**; **no gate weakened, no threshold, no ADR touched**; **nothing executed — no probe written or re-run**; **K7/K8 remain NOT CLEARED**, K3/K4 unchanged, **five probes have cleared nothing**. **One judgement call declared (§7)**: a six-line **pointer note** added under §4.12's Q12 heading so the record is not ruled-and-open at once; heading and existing lines untouched, and it **points at S7 rather than restating the rule**. **No referral, nothing blocking. No task READY** — the next evidence action must be **separately authorized** | 2026-08-24 |
| MSG-0128 | Verification | **OPEN** | Claude Code | Architecture lead | **COMMS verification of TASK-0040, by a session that did not execute it.** Verified **from `origin/main`**: **§4.6 S7.1–S7.4 published**, **98 insertions / 0 deletions**, `3a19dfb` touches **nothing under `docs/`**, and **§4.12's Q12 note points to S7 rather than restating it** — the double-encoding hazard TASK-0040's recovery procedure named. **MSG-0123…MSG-0127: one ledger row and one register row each, no duplicate.** `HEAD` = `origin/main` = `c6f9cc9`, tree clean, **no blocker open**, supervisor **enabled and idle** (heartbeat `11:47:18Z`, `NOOP`). **No task READY** — the next evidence action is **separately authorized** (MSG-0125); **MSG-0119 stands: failure does not authorize weakening the gates**, and the question returns to **§4.7 Q3** | 2026-08-24 |
| MSG-0129 | Decision | DECIDED | Architecture lead | Claude Code | **Q3 RULED — return to architecture, do not relax the bar.** *"The response is not to relax the bar and not to select the least-bad engine."* If the remaining candidate classes cannot satisfy strict Shape-1, the project stays **NOT CLEARED for retrieval-engine selection** and returns to architecture work to define a topology that can satisfy the existing gates. **`U = 0`, E1–E4, G-Q4/G-Q5/G-Q6 remain mandatory**; failure of all tested candidates is evidence the explored space is insufficient, **not authority to weaken AMD-01 or strict Shape-1**. **Nothing selected, no ADR modified, all NOT CLEARED and DISQUALIFIED verdicts unchanged, K7/K8 still NOT CLEARED.** The architecture work must **preserve the logical-projection / physical-organization distinction** and **must not assume one engine's planner behaviour generalizes to its class** | 2026-08-24 |
| MSG-0130 | Decision | AUTHORIZED | Architecture lead | Claude Code | **TASK-0041 authorized** — bounded architecture task defining and evaluating the **technology-agnostic retrieval topology** Q3 requires. Six work items: re-read EPA-0006 §4.6–§4.8 and the actual MSG-0129 authority; **reconcile prior evidence without relabelling K7/K8 or any candidate**; define topology patterns; **map each to E1–E4 and G-Q4/G-Q5/G-Q6, separating structural properties from those needing execution evidence**; state the **minimum evidence** before any future engine-selection task; **produce a bounded recommendation or preserve the choice as open**. **No selection, no implementation, no ADR change, no gate weakened, no corpus, no invented figure.** **Do not claim structure clears a gate that requires execution evidence**; **do not generalize `node:sqlite` planner behaviour.** **If no topology can satisfy the gates, record the gap and keep selection blocked** | 2026-08-24 |
| MSG-0131 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0041 reconciled as the single READY task.** Records which branch Q3 took — **§4.7's third option, "reconsider the retrieval topology"**, with **Q1 and Q2 left open** rather than ruled — and the constraint that makes this task different from the five before it: **it is entirely structural, and §4.9 G-Q6 rejects construction-only evidence, so it can clear nothing by itself.** Anchors the work in **§4.8's measured I0–I6 catalogue** rather than a fresh one, carrying forward the facts a proposal must survive: **I6's global secondary index undoes the rest**, **I5 was never measured**, **removing the copy raises `U`**, **`U = 0` is purchasable by withholding authorized content**, and on the one measured class **the planner and `ANALYZE` decided the outcome** — which is why the answer must be topological | 2026-08-24 |
| MSG-0132 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0041 execution record — the Q3 architecture response.** **EPA-0006 §4.13** added, **392 insertions / 0 deletions**, plus a declared pointer note under §4.7 Q3; MSG-0129 **quoted, not paraphrased**. **Nothing CLEARED and nothing could have been** — entirely structural, and **G-Q6 rejects construction-only evidence**. **Five invariants N1–N5**; the load-bearing claim **N1 + N2 make N4 free**, with three caveats, chief among them that **N1 does NOT discharge E2**. **I7** (boundary-refined effectivity — it **is** piecewise constant in time) and **I8** (entitlement-class materialisation) added to §4.8's catalogue, **both NEVER MEASURED**. **W1–W4 mapped to every gate**, each cell **S** / **X** / **S→X**; **they differ in exactly one cell**, which is the finding. **EV1–EV12** state the minimum evidence for any future engine-selection authorization. **R1** is a criterion, not a selection; **the W1–W4 choice stays OPEN on unmeasured cost**. **GAP-A…GAP-E recorded and selection stays blocked** — **GAP-B blocks clearance independently of topology**, E4 being UNOBTAINABLE on the only reachable subject. **All prior verdicts reproduced unchanged (§6); K7/K8 still NOT CLEARED.** **Q13 referred**, fail-closed, blocks nothing. **DISC-0011 recorded, not corrected.** **Second occurrence of BLK-0009's supervisor/working-tree race, diagnosed before work began** | 2026-08-24 |
| MSG-0133 | Decision | DECIDED | Architecture lead | Claude Code | **Q13 RULED — Release 1 is the current/"now" temporal frame only.** Historical and future frames are **out of scope for Release 1**; a request needing a non-now frame **MUST ABSTAIN** rather than answer from an inapplicable interval. **Effective-date and supersession data stay captured** so a later, separately authorized capability loses no history. **GAP-D discharged as a scope decision**; **I7 remains NEVER MEASURED**. Instructs that **ADR-0018's Release-1 boundary be clarified in place** and **EPA-0006 §4.13 Q13 move from "Surfaced, NOT decided" to DECIDED**. **No engine, index, model, runtime or framework selected; no implementation authorized; no gate weakened; no verdict changed** | 2026-08-24 |
| MSG-0134 | Decision | DECIDED | Architecture lead | Claude Code | **Q1 RULED A — the strict reading.** Reading an unauthorized **index entry, key or metadata counts as examination**, even when no passage content is accessed. **§4.6 S4's U1–U5 stays authoritative and U1 stays in scope.** The fail-closed default becomes **a ruling rather than a temporary default**, and **a candidate cannot satisfy E2 by arguing unauthorized metadata was harmless**. **Nothing selected or authorized; Q2 and Q7 not decided by this record** | 2026-08-24 |
| MSG-0135 | Decision | DECIDED | Architecture lead | Claude Code | **Q2 RULED B — physical isolation is required where necessary.** Query-time authorization predicates **alone are insufficient** where the engine must examine unauthorized candidates before applying them; the governed projection must be **physically organized/partitioned as necessary**. **Strict Shape-1 remains a pre-retrieval boundary, not post-filtering.** **The logical-projection / physical-organization distinction is preserved** — multiple physical structures may constitute **one logical projection**. **Nothing selected or authorized; Q7 not decided by this record** | 2026-08-24 |
| MSG-0136 | Decision | DECIDED | Architecture lead | Claude Code | **Q7 RULED A — zero stale-answer tolerance.** After an update, approval, revocation or supersession the **prior version must not answer**; where the current approved version cannot be established or made available, the system **abstains**. **No arbitrary elapsed-time threshold is introduced** — the requirement is freshness, not an allowance. **A stale materialized version may not be used merely because it remains reachable**; **temporal materialization must fail closed**; **G-Q5's bounded interval stays an evidence requirement and never becomes permission to answer stale content**. **Nothing selected or authorized** | 2026-08-24 |
| MSG-0137 | Decision | AUTHORIZED | Architecture lead | Claude Code | **TASK-0042 authorized — architecture-bound retrieval evidence**, evidence-only, under the now-resolved Q1/Q2/Q7 boundaries. Seven items: **measure the routing phase and reachable physical structures with routing-phase examination counted in `U`**; **exercise every applicable S7 placement and report the maximum `U`**, strict U1–U5 preserved; **reuse committed harnesses and do not re-run prior cases for repetition**; **test zero stale-answer tolerance across update/approve/revoke/supersede plus the abstention case**, distinguishing transition-triggered from periodic behaviour; **measure I5/I7/I8 only where genuinely observable, else NEVER MEASURED / NOT CLEARED with the exact limitation**; **re-check E4 observability and infer nothing from its absence**; **preserve all verdicts and report no clearance unless every applicable gate is satisfied by execution evidence**. **No selection, no implementation, no ADR change, no Docker or host install, no operator intervention** — an environment boundary is **recorded, not routed around** | 2026-08-24 |
| MSG-0138 | Record | **OPEN** | Architecture lead | Claude Code | **TASK-0042 queue reconciliation instruction** — states plainly that the **queue write is pending a supervisor or session reconciliation**, that TASK-0042 must be marked **READY** and be **the single READY task** absent a higher-priority authorization, and that the queue must be **re-read from `main` and verified against MSG-0137 before execution begins**. **The queue write it names is performed by MSG-0139** | 2026-08-24 |
| MSG-0139 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0042 reconciled as the single READY task, and four EPA-0006 headings brought into line with the rulings.** The queue write MSG-0138 named **had not happened** — `CLAUDE-TASKS.md` contained **zero mentions of TASK-0042**, so the supervisor's `no READY task` was **correct**, not a stall. Also records that **Q1, Q2, Q7 and Q13 were ruled but EPA-0006 still read them as open**, the decisions living only in side files: **declared pointer notes added at each heading**, **Q13's heading changed as MSG-0133 instructs**, **GAP-E marked discharged**, **48 insertions / 1 deletion, nothing else reworded**. **Sentences elsewhere still say Q1/Q2 are open and are deliberately left as written** — whether to update them in place is **referred to the Lead**. Carries **DISC-0011** forward and corrects the same arithmetic where this queue repeated it | 2026-08-24 |
| MSG-0140 | Record + discovery | **OPEN** | Claude Code | Architecture lead | **TASK-0042 execution record — architecture-bound retrieval evidence, and nothing is cleared.** **8/8 acceptance criteria with evidence.** Run **VALID**: adversarial precondition HELD at 3 sizes x 2 distributions, retrieval control failed **3/3**, **routing** control failed G-Q4.2 as required, **freshness** control failed **6/6**, index-cursor calibration **EXACT on both plans** (302 / 402 reproduced from a constructed cohort), plan-transfer **0/54** non-transferable; **18 placement-grid cells + 36 freshness cells**. **SIX CANDIDATES, ALL NOT CLEARED.** **Five placements exercised** — including **P-CIDX, which no prior probe took**, and **dbstat, TAKEN rather than argued away** and found to measure stored layout rather than traversal, so the reachable-but-unexercised set is **EMPTY for the right reason**. **K8's row-access `U` = 0 is superseded by 2 / 66 / 709 at the index cursor — the first time S7-R3 bites by RULE rather than by a probe's diligence.** **I5 and I8 measure IDENTICALLY to K7 at every size**, corroborating §4.8 finding 1 in a third fixture: a finer key that does not refine **effectivity** removes no unauthorized row. **I7 reached `U` = 0 and failed anyway, by WITHHOLDING — 142 of 146 authorized chunks at its interval boundary**, plus an **ingested version missed inside the interval**, on a bound that is **VACUOUS in 3/3 cells**. **Q7 = A across six transitions x six designs x two instants**: the discriminator **fired in 4 cells** (*made correct by waiting*), and **T3 vs T5 isolates the faked re-check**, reproducing §4.10 result 3. **E4 re-checked with the nonexistent-pragma control: still NOT OBTAINABLE, position unchanged.** **DISC-0012** raised — the prior G-Q4.2 differential ran against a catalogue holding **no foreign structure**; **TASK-0039's MET is bounded, not withdrawn, and no verdict moves**. **Nothing selected, no ADR touched, no gate relaxed, no threshold introduced; `docs/` diff empty; EPA-0006 additive 287/0** | 2026-08-24 |
| MSG-0141 | Decision | AUTHORIZED | Architecture lead | Claude Code | **Bounded E4 observability evidence task authorized** — obtain the missing **E4 execution observability/inspection evidence** on **another available test subject used solely as an evidence instrument**. **Explicitly not engine selection, adoption, deployment or implementation**, and **the subject must not be evaluated for product suitability** beyond the E4 evidence needed. **Minimum probe only**; **record the exact surface, what it proves and its limits**; **include negative controls that distinguish an absent log from an instrument that was never running**; **if E4 cannot be established, record the exact limitation and leave E4 NOT CLEARED**. **No installing or modifying host infrastructure, no deployment, no product selection, no gate or ADR change.** **Do not infer E4 from surface scans, query results, planner output or absence of errors**, and **do not broaden into performance, cost, capability or engine comparison**. **A successful E4 observation clears no candidate** | 2026-08-24 |
| MSG-0142 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0043 reconciled as the single READY task.** Records what the E4 question now is: **not whether the current subject can supply it — MSG-0140 §6 settled that with a second negative — but whether any reachable subject can.** Carries read-only environment enumeration so the task does not spend its budget rediscovering it: **`docker`, `psql`, `sqlite3` CLI, `java`, `dotnet`, `go` all ABSENT**, **`python` ABSENT but `py` PRESENT → Python 3.14.5 with SQLite 3.50.4 exposing `set_trace_callback`, `set_authorizer`, `set_progress_handler`**. **That is capability evidence, explicitly not E4 evidence** — whether a statement-level trace records what the engine **examined** is the question, and *"a real surface that still does not satisfy E4"* is a correct outcome. Notes the **third `PATH`-artefact-read-as-absence** in this project | 2026-08-24 |
| MSG-0143 | Record + correction | **OPEN** | Claude Code | Architecture lead | **The supervisor SCHEDULE is Disabled — TASK-0043 will not start unattended**, and this corrects MSG-0142 §6 and the status file, which said a cycle would take it. **Two independent switches**: `supervisor-config.json` is **`enabled: true` / `dryRun: false`** as recorded, but the Windows task **`PCI-Execution-Supervisor` is `Disabled`** — `LastRunTime 18:07:07Z`, `LastTaskResult 0`, **`NumberOfMissedRuns: 2`**, scheduler service **Running**, and the supervisor log **stops after the 18:07:18Z NOOP**. **Config-enabled plus schedule-disabled means nothing fires**; the supervisor is not stalled, it is **not being invoked**. **Very likely deliberate** — re-enabling is an **operator action on host configuration** and **was not taken**. **Fourth instance of reading a component's self-reported readiness as evidence that something is calling it.** **Nothing installed or changed; checks read-only. TASK-0043 remains correctly READY** | 2026-08-24 |
| MSG-0144 | Record + blocker + correction | **OPEN** | Claude Code | Architecture lead | **TASK-0043 stopped at its first substantive action — the second test subject is UNREACHABLE to this runner. BLK-0011 raised; 4/8 acceptance criteria MET; nothing measured.** MSG-0142's candidate instrument — **Python 3.14.5 / SQLite 3.50.4 via `py`** — **cannot be invoked**: `py -V` and `py …/probe.py` both return **`This command requires approval`**. **The cause is VERIFIED by reading the permission set, not inferred** — `.claude/settings.local.json` allows `Bash(node *)` plus eight `--version` checks and has **no `py` / `python` / `python3` entry**; `runner-settings.json` grants **no interpreter**. Note its shape: the allowlist can ask **`pip --version`** and cannot run Python. **BLK-0010's two-step disambiguation was applied before concluding** — the compound form was refused for *"multiple operations"*, wording that names a command **shape**, not a boundary. **Three distinguishable behaviours establish this as a denial, not an absence**: `node -e` **ran** (`v24.15.0`), `docker`/`psql` returned **`command not found`**, `py` did neither. **The harness is written and committed** (`implementation/probes/TASK-0043/probe.py`, control-standard compliant — every instrument armed is run **disarmed first**, and a non-silent disarmed instrument **voids the run**) **and was NOT RUN**; no output file exists because no output exists. **The verdict is NEITHER outcome MSG-0141 permits, and that is deliberate**: *"the instrument could not be run"* ≠ *"the instrument ran and showed nothing"*, and recording **E4 unobtainable** would commit at task level the precise error **§4.12's nonexistent-pragma control** was invented to prevent. **E4 stays NOT CLEARED; §4.13 GAP-B stands UNTOUCHED** (a claim about the **first** subject); **the second subject's E4 position is UNKNOWN**. **A workaround exists — `Bash(node *)` + `child_process` — and was NOT taken** (rule 2; *"recorded, not routed around"*), **and is written down precisely so the next session does not take it**; the separable observation that the permission set constrains **command shape** rather than process capability is recorded **as a discovery, with nothing proposed and nothing authorized**. **Also corrects MSG-0143**: its observations were sound but its inference was not — **this very session was started unattended by a live supervisor loop** (`supervisorPid` 24604, `runnerPid` 25932 acquired **18:59:38Z**, heartbeat advancing **19:03:08Z → 19:03:38Z**, `head` = `7d6bcbd`). **The scheduler STARTS the loop; it does not drive each cycle**, so a Disabled task with `NumberOfMissedRuns: 2` missed *starts* of a process **already running**. **Fifth instance of the same class of error, and the first where the misread component was the supervisor rather than a `PATH`.** **MSG-0143 is not edited — both readings survive.** `git diff --name-only docs/` **empty**; nothing installed, no host change, no ADR touched, no gate weakened, **no verdict moved** | 2026-08-24 |
| MSG-0145 | Authorization | **AUTHORIZED** | Operator | Claude Code | **Operator grant: invoke `py` SOLELY for TASK-0043's bounded E4 probe.** Recorded **verbatim and before anything ran**, as `CLAUDE.md` requires of a conversational instruction. **No product-engine selection, adoption, deployment, implementation, gate/ADR change or scope expansion authorized** — the same prohibitions MSG-0141 already carries, so the grant widens the task by **exactly one mechanism**. **Nothing installed**: Python 3.14.5 and SQLite 3.50.4 were already present (MSG-0142 §3). **`runner-settings.json` deliberately NOT modified** — a standing rule would be broader than a one-task grant (MSG-0083 precedent) — so **this session executes and BLK-0011's unattended condition survives for future tasks**. TASK-0043 left **BLOCKED while the run proceeded**, so a concurrent supervisor cycle could not start a second session against it | 2026-08-24 |
| MSG-0146 | Record + referrals | **OPEN** | Claude Code | Architecture lead | **TASK-0043 execution record — E4 is OBTAINABLE on the second subject, and the inspection is ADVERSE.** **8/8 criteria MET.** Subject **Python 3.14.5 / SQLite 3.50.4** (first subject quoted, not re-run). **Unauthorized passage text bound as a PARAMETER appears verbatim in the engine's own trace** — **the reverse of TASK-0042 §6's surface scan**, which found 0 occurrences because *"parameters being bound rather than inlined"* and **rightly declined to offer it as E4**: the protection it appeared to observe **does not hold at the surface E4 asks about**. **C4 recorded separately and negative — the trace records the INSTRUCTION, not the examination** (200 examined, 100 returned, **1 entry**). `set_progress_handler`: **807 armed invocations carrying no content — a counter, not a log**. `set_authorizer`: **prepare-time, names objects, 0 events on re-execution**. **5 of 5 tracing pragmas inert vs the control**; **every instrument run disarmed then armed**; **run VALID**. **WAL holds the marker 135 times — a durability artefact, NOT offered as E4** (referred). **Nothing CLEARED; seven probes have cleared nothing; GAP-B untouched.** Two referrals, neither blocking: **whether this becomes EPA-0006 §4.15**, and **whether text at rest in engine-managed files deserves architectural treatment** | 2026-08-24 |
| MSG-0147 | Decision | DECIDED | Architecture lead | Claude Code | **R2 RULED YES — unauthorized policy content in an engine-managed durability artefact (WAL, journal, shared-memory file) is an architectural security concern and must be investigated as a separate security requirement.** **It is NOT reclassified as E4**: E4 stays the execution-observability criterion, and the durability concern is **a separate boundary about persistence** — the separation MSG-0146 preserved by refusing to offer the WAL result as E4. **Unauthorized content must not be accepted as harmless merely because it sits in a durability artefact rather than a log.** **Evidenced separately; clears or fails no engine by itself; no gate changed; nothing selected.** Future evidence must establish **whether a candidate's durability artefacts can contain unauthorized policy content and whether the architecture prevents it**. **The next bounded task, IF authorized, should define a reproducible exposure test rather than broaden engine evaluation** | 2026-08-25 |
| MSG-0148a | Record | **OPEN** | Claude Code | Architecture lead | **R2 reconciled; a new evidence obligation exists and NO task is authorized to meet it.** MSG-0147 §6 is conditional — *"if authorized"* — so **the queue stays empty and the supervisor's NOOP is correct**; nothing was marked READY. Records the gap the ruling creates: **no criterion in EPA-0006 asks the durability question** — E1–E4 do not reach persistence artefacts and §9.3 concerns logs. **One choice offered, not requested**: **(a) encode the criterion first**, on the TASK-0034/0036/0040 mechanism, since evidence gathered before a bar exists gets measured against the probe's own idea of it; or **(b) define the exposure test first**, since **E4's history is the cautionary case — the criterion existed and the first subject could not instrument it at all**. **Doing both in one task is recommended against**: the same session would write the bar and the measurement together. **R1 remains open** | 2026-08-25 |
| MSG-0148b | Decision | AUTHORIZED | Architecture lead | Claude Code | **R2 CRITERION-FIRST authorized — TASK-0044.** Define the **WAL/durability-artefact security criterion BEFORE** any exposure evidence task: *"The criterion must establish the security bar independently of the measurement. The later evidence task must measure against the already-authoritative criterion."* **May**: draft the precise criterion for unauthorized policy content in **engine-managed durability/persistence artefacts**; define its **scope, exclusions, evidence semantics and fail-closed interpretation**; record it through the established architecture/COMMS mechanism. **May NOT**: run the WAL exposure experiment; select, compare, adopt, deploy or implement an engine; change **E1–E4** or any existing gate; weaken Shape-1; or **combine criterion creation and measurement in one task**. **Success:** a bounded, independently reviewable criterion record on `main` stating **what exposure is prohibited and what evidence would satisfy or fail it**. **No measurement under this authorization.** **Number shared with MSG-0148a — eighth collision, no file renamed (MSG-0058 F4)** | 2026-08-25 |
| MSG-0149 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0044 reconciled as the single READY task, and the eighth message-number collision recorded.** The Lead took **option (a), criterion-first**, and **forbade the combination outright** — *"combine criterion creation and measurement in the same task"* is a prohibition, not a preference, which is stronger than the recommendation it answers. Records what the criterion must not become: **E4 by another name**. E4 is about **execution observability**; this is about **content at rest in engine-managed files**, and MSG-0147 kept them separate deliberately. Also records the standing evidence from TASK-0043 the criterion must be able to describe — **a WAL carrying the unauthorized marker 135 times while the main database and `-shm` carried none** — **as an example the criterion must be able to classify, NOT as evidence under it** | 2026-08-25 |
| MSG-0150 | Record + referral | **OPEN** | Claude Code | Architecture lead | **TASK-0044 execution record — the durability-artefact criterion DA-1 is written, and nothing was measured.** **8/8 acceptance criteria MET.** **EPA-0006 §4.16** added — **228 insertions / 0 deletions**, one file, additive. **Both structural choices DECLARED rather than assumed:** the label is **`DA-1`, deliberately not `E5`** — an `E`-number would read as a fifth Shape-1 evidence class whatever its text said, and **§4.6 S6's table is the clearance bar MSG-0148b forbids extending**; and the section is **a new §4.16 with §4.15 deliberately left unallocated**, because **R1 is OPEN and proposes §4.15** for the TASK-0043 record and taking it would consume, in passing, a slot the Lead's own referral has claimed. **§4.6 was the alternative and was rejected on §4.6's own words** — its preamble says it exists to decide *"whether a candidate satisfies the Shape-1 gate"*, and **DA-1 is not a Shape-1 question**. **Three limbs: DA-1.1** request-induced persistence, **DA-1.2** residual retention after the request completes, **DA-1.3** widened reach or lifetime beyond the projection store. **The load-bearing part is DA-4 — provenance, not presence.** A projection durably holds the corpus it indexes, so under a single shared projection *"unauthorized-for-`s` bytes exist somewhere in the engine's files"* is **true by construction for every candidate at every moment**; a presence-phrased criterion would **fail every engine trivially and be indistinguishable from one tuned to fail**. **DA-1 therefore asks what became durable BECAUSE a request was resolved**, and where **§4.13's N1 containment** holds the two provenances converge. **Evidence semantics use §4.6 S9's three verdicts unchanged** — found-and-attributable ⇒ **NOT CLEARED** on a single occurrence; writes-by-design or wider-principal-reach ⇒ **DISQUALIFIED**; **a scan finding nothing satisfies NOTHING**, because **§4.6 S5's asymmetry rule transfers intact** (artefacts checkpoint, truncate, rotate and get reclaimed). **Fail-closed: an in-scope artefact that cannot be inspected at all ⇒ NOT CLEARED, never an inferred pass** — §4.6 S10's engine-exposure criterion applied to persistence. **DA-1 is distinguished from E4 in its own text** — execution surface vs **content at rest**, during vs **after** — and **§4.6 S4 U5 is pointed at, not restated**. **TASK-0043's WAL figures appear ONLY as a labelled illustration**, and **DA-1's verdict on the shape as recorded is `NOT CLEARED`, because the record does not establish provenance** — naming that missing discriminator is the criterion's work, and it is the first thing the separate evidence task must separate. **Nothing measured, nothing executed, no probe/fixture/harness written, no test count claimed and none could be.** **Nothing CLEARED — DA-1 is defined and never applied; no DA-1 verdict exists for any candidate; all six TASK-0042 candidates remain NOT CLEARED.** **E1–E4 unchanged, no gate changed, Shape-1 not weakened, no ADR modified, no numeric threshold**; `git diff --name-only docs/` **empty**. **One referral — Q14**: does a DA-1 failure block selection, or is it recorded alongside the Shape-1 verdict? **Fail-closed default, blocking nothing** | 2026-08-25 |
| MSG-0151 | Verification | **OPEN** | Claude Code | Architecture lead | **COMMS verification of TASK-0044 by a session that did not execute it.** Read **from `origin/main`**: **§4.16 published with DA-0…DA-7**, the **DA-3 heading defect fixed on `main`** with no gap in the sequence, **`docs/` untouched**, **nothing measured** (no probe, fixture or harness), **MSG-0150 holding exactly one register and one ledger row**, **0 READY tasks** and the supervisor's `NOOP` correct. **One figure reconciled**: the status header's **228 / 0** described the first commit; **§4.16 as published is 234 / 0** (228 + the 7/1 heading fix) — the original retained, because a reader counting §4.16 will find 234. Records why the ordering mattered: **DA-4's provenance-not-presence distinction** — under a shared projection *"bytes unauthorized for `s` exist somewhere"* is **true by construction for every candidate**, so a presence-based criterion **would fail every engine trivially and be indistinguishable from one tuned to fail**. **Criterion-first produced a distinction a measurement-first task would likely have missed**, since the WAL observation shows presence and says nothing about provenance | 2026-08-25 |
| MSG-0152 | Record + correction | **OPEN** | Claude Code | Architecture lead | **How the supervisor is actually driven, correcting a claim now in the status file.** The status file said *"the scheduler STARTS the supervisor loop; it does not drive each cycle"* and that a `Disabled` task **did not prevent** TASK-0043 from starting. **The observation behind it was real; the inference does not follow.** VERIFIED from the supervisor's own log: **nothing ran for 52 minutes across the disabled window** — `18:07:18Z NOOP` then **nothing until `18:59:33Z CYCLE_START`**, the cycle that started TASK-0043 — and **every cycle carries a distinct pid**, which is one process per cycle, not a loop. **The model:** a no-work cycle exits in ~5s; **a cycle that starts a runner stays alive monitoring it**, heartbeating every ~30s and logging `COMPLETED` off-cadence — which is exactly what the advancing `19:03:08Z → 19:03:38Z` heartbeat was. **MSG-0143's diagnosis stands.** Also records **two missed cycles today** (last `04:17:13Z`, `NextRunTime 04:47:47Z`, `NumberOfMissedRuns: 2`, schedule `Ready`, `StartWhenAvailable: True`) with **the cause UNKNOWN and deliberately not guessed** — **a missed start leaves no log entry**. **Nothing waited on them; no task is READY** | 2026-08-25 |
| MSG-0153 | Authorization | **AUTHORIZED** | Architecture lead | Claude Code | **R1 RULED YES — record TASK-0043's E4 result as EPA-0006 §4.15**, through the established COMMS/architecture mechanism, **verify the change from `main`**, and **then reconcile the next bounded DA-1 evidence task**. **"Do not select, clear, adopt, deploy, or implement an engine"** — **clearing named explicitly**, so neither §4.15 nor any DA-1 measurement may produce a cleared candidate. Recorded **verbatim and before anything was written**. **§4.15 was the free number** — §4.14 is TASK-0042's evidence, §4.16 is DA-1 — **so nothing is renumbered**. **The section records an INSTRUMENT result, not a candidate verdict** | 2026-08-25 |
| MSG-0155 | Record + referrals | **OPEN** | Claude Code | Architecture lead | **TASK-0045 execution record — DA-1 measured against §4.16 as written, and nothing cleared.** **8/8 acceptance criteria MET**; **a real probe ran** — **8 configurations across 5 in-scope DA-2 artefact classes**, file-backed, on the **FIRST** subject (SQLite **3.51.3** via `node:sqlite`), and **both mandatory negative controls FIRED**, so the run is **VALID**. **DA-1 NOT CLEARED for that subject**, by **two independent routes**: **DA-5 row 1** on a single occurrence, and **DA-6** on a limb no available instrument reaches. **The apparatus is the load-bearing part** — **DA-4 makes a grep meaningless** under a shared projection, so attribution rests on a **measured-empty baseline** (`wal_checkpoint(TRUNCATE)`, artefact **read back at 0 bytes**), and **`-shm`, which a checkpoint does not empty, is reported with a weaker instrument and said to be weaker.** **The sharpest finding was not the one the probe was built to look for: a request updating ONLY rows the subject was ENTITLED to still left the unauthorized marker in the rollback journal 236 times** — **journalling is page-granular, and a page holding an authorized row holds its unauthorized neighbours** — so it depends on **no post-filtering, no bad plan and no examination of anything unauthorized**; **a better query does not answer it, and §4.13 N1 containment does.** **The first measurement in this record arguing for containment on grounds independent of `U`.** **DA-4 demonstrated on the run's own output**: the same artefact at **ingest (26, NOT a finding)** versus **request resolution (236, a FINDING)** — **opposite verdicts on the same observation shape**, which a presence-phrased criterion could not produce. **An expectation failed and is recorded as measured**: the **append**-shaped cache write journalled **nothing**, because appends overwrite no pages — **so two request-induced writes differ entirely in what they make durable, and the difference is `INSERT` versus `UPDATE`**, which is not a security property anyone would think to specify. **Per limb**: **DA-1.1 NOT CLEARED** on **rollback journals** (**236 occurrences, conforming request** — the page-granularity result); **spill-file cell corrected to "not sufficient alone" (MSG-0156)** — the conforming request held **`UNAUTH x0`**, and the **5 228 784-byte / 10 000-marker** spill was **NC-1, the negative control**; **DA-1.2 NOT CLEARED (DA-6)** on spill files — **the directory entry is observably gone and the blocks are not observable**, the criterion **inconvenient and taken as written**; **DA-1.3 FINDING** on spill files (**outside the store directory, engine-chosen path**) and on **engine-produced backups** (**measured, not asserted**). **Two defects in the probe's own apparatus found and fixed before any result was reported** — **both the presence-versus-provenance error DA-4 exists to prevent, committed by the probe written to test for it**; **fixing the first produced the page-granularity result.** **Nothing CLEARED — eight probes have cleared nothing**; **no verdict moved, no gate changed, no criterion adjusted, `docs/` empty, nothing installed, the second subject NOT invoked and no fresh `py` grant sought.** **Limitations stated, not omitted**: one subject (**§4.15 — binding, not build**), **`/data/docker` limb NOT MEASURED**, replication streams **NOT APPLICABLE**, byte-scanning blind to re-encoding. **Two questions referred, neither blocking — Q15** (EPA-0006 section? **deliberately not taken**, §4.15 being the precedent for referring it) and **Q16** (does page granularity bear on the W1–W4 topology question?) | 2026-08-25 |
| MSG-0156 | Correction | **OPEN** | Claude Code | Architecture lead | **A negative-control result was recorded as a subject finding, and is corrected.** MSG-0155's **DA-1.1 spill-file cell** cited the **5 228 784-byte / 10 000-marker** file — **that is NC-1, the post-filtered negative control** (20 000 rows returned where entitlement was 10 000), quoted correctly as the control in §6. **The conforming request's spill file carried `UNAUTH x0`**, and the probe's own output says *"DA-1.1 is not engaged; DA-1.3 is."* **A control is designed to produce a finding — that is what makes it evidence the instrument works — so its finding can never also be a finding about the subject.** Corrected to **not sufficient alone (DA-5 row 3)** in MSG-0155 §5, the status file and the queue rows, **with the original wording retained**. **The DA-1 verdict does not change**: still **NOT CLEARED** on the **rollback-journal DA-5 row 1 finding (236 occurrences, conforming request)** and **DA-6 on the spill residue limb**; **DA-1.2 and DA-1.3 unaffected** — a spill file leaves the store directory whoever's content is in it. **Found by reading the committed probe output back against the record**, as with the §4.15 and §4.16 figures | 2026-08-25 |
| MSG-0157 | Ruling | **DECIDED** | Architecture lead | Claude Code | **Q15 = YES and Q16 = YES.** **Q15** — TASK-0045's DA-1 evidence **is architecturally significant and is promoted into EPA-0006 as a distinct section**, and the Lead **fixes the number: §4.17**, *"because §4.15 records TASK-0043 E4 evidence and §4.16 defines DA-1"* — **evidence/documentation, not an engine-selection or implementation authorization**, and it changes **DA-1's criterion, E1–E4 and every clearance gate** not at all. **Q16** — the **page-granularity result bears directly on the §4.13 W1–W4 topology question**: *"physical containment/isolation is relevant not only to query-time `U`, but also to durability exposure."* **It selects no engine and weakens no gate**; it **authorizes one bounded evidence task**, which the Lead then defined themselves in a committed file (`bafe5c9`) — **TASK-0046**. **Consequence 1 — the §4.17 promotion — has NO authorized task and was NOT performed by TASK-0046**, whose committed definition is the Q16 boundary alone; it is recorded here as **outstanding** rather than absorbed. **Existing strict Shape-1, Q1, Q2, Q7, Q12, Q13 and DA-1 rules remain unchanged**, and the task **"is evidence-only and may result in NOT CLEARED; it does not itself change a candidate verdict"** | 2026-08-25 |
| MSG-0158 | Record + referrals | **OPEN** | Claude Code | Architecture lead | **TASK-0046 execution record — physical containment measured against the Q16 boundary, and it has two answers.** **9/9 acceptance criteria MET**; **16 configurations** on the FIRST subject (SQLite **3.51.3** via `node:sqlite`); **both negative controls FIRED**, run **VALID**; `docs/` diff **empty**. **Part one — containment PREVENTED the exposure the task asked about**: under **W-A** (the TASK-0045 access-accounting shape) the **shared** layout made unauthorized content durable — **200 markers across 6 journalled page images, all 6 carrying BOTH classes** — and **no isolated layout did**. **The mechanism is exhibited rather than asserted**: the artefacts were **parsed**, every durable page **identified by number and classified**, and **every image verified byte-identical to an independently read copy of the store**. **Part two — the same isolated topology failed a different way**: **L4** (isolated stores, but **re-materialised** from the other partition) made the marker durable **15 times** under **W-B**, an **append**, with **no unauthorized row in reach**. **Co-residency of BYTES, not rows** — the dropped partition's pages sit on the free list with their content (**10 pages at `UNAUTH x15`**), the append consumes one, and journalling writes its **original image**. **This inverts TASK-0045**, whose W-B *"journalled nothing"* — true of an empty free list only. **§4.13 N3 makes re-materialisation the normal operating mode, so L4 is where a W1–W3 topology lives.** **L4 satisfies N1 as written** (no unauthorized *entry*; `U` and `Ustruct` are blind to it), so **N1 and DA-1 ask different questions of the same page** — **referred, not amended.** **Two apparatus defects fixed before any result was reported** (the journal **magic is ZEROED mid-transaction** — cause established, replaced by a stronger byte-for-byte check; and a comparability assertion that confused **in reach** with **touched**). **Nothing CLEARED — nine probes have cleared nothing**; no verdict moved, no gate/criterion/invariant changed, **no topology selected**. **Three referrals, none blocking: Q17** (queue-row mechanism), **Q18** (EPA-0006 section — deliberately not taken), **Q19** (do N1–N5 need a byte-level limb?) | 2026-08-25 |
| MSG-0159 | Record | **OPEN** | Claude Code | Architecture lead | **EPA-0006 §4.17 promotion reconciled** — TASK-0045's DA-1 evidence recorded as its own section under **MSG-0157 (Q15 = YES)**, the mechanism §4.15 set: the evidence task **referred** promotion, the Lead **ruled** it, and a separate step wrote the section | 2026-08-25 |
| MSG-0160 | Decision | DECIDED | Architecture lead | Claude Code | **Q19 RULED YES — byte-level durability containment becomes an explicit architectural/security requirement, in addition to N1's entry containment.** The TASK-0046 evidence establishes a **security-relevant distinction between entry containment and byte-level durability exposure**: **L4 satisfied N1 because no unauthorized entry was in reach**, while an **appending write made bytes from a previously materialised partition durable through a reused page**. **N1 remains unchanged**; the ruling **adds the durability dimension** and **does not retroactively alter TASK-0046 or the existing DA-1 evidence**. **Nothing selected, adopted, deployed, implemented or cleared; no candidate cleared or disqualified; strict Shape-1, Q1, Q2, Q7, Q12, Q13 and DA-1 remain binding.** Authorizes **one bounded architecture/documentation task** to define and record the requirement | 2026-08-25 |
| MSG-0161 | Record + referral | **OPEN** | Claude Code | Architecture lead | **TASK-0047 execution record — N6 defined, and nothing measured against it.** **7/7 required outcomes MET.** **EPA-0006 §4.18** delivered: **N6 — resolving a routed subject's request must not make unauthorized BYTES durable, including bytes already in the store's physical history** — with **N6.1 no history-sourced durability**, **N6.2 no original-image escape**, **N6.3 history brought within the N3 invariant**. **142 insertions / 0 deletions, additive; §4.13's N-table untouched**, a **declared pointer note** added below it on §4.12's Q12 precedent. **Two structural choices declared**: the label **N6** (a topology property, not a DA criterion — **merging them would make the obligation and the criterion impossible to fail separately**) and a **new section** rather than a sixth table row. **Widening N1 was rejected**: L4 **satisfies N1** and still leaked bytes, so **a rule that cannot be violated independently of another is not a separate rule**. **Evidence boundary stated as limits** — one subject, one allocator, **no topology claimed to satisfy N6**, residue itself **not** a violation (DA-4 row 1). **Nothing selected, adopted, deployed, implemented or cleared; no invariant amended; no verdict moved; nine probes have cleared nothing.** **One question referred — Q20**: should a bounded task now measure N6, and against which topologies? **Fail-closed default: unmeasured is not satisfied** | 2026-08-25 |
| MSG-0161 *(second file of this number — see MSG-0162)* | Ruling | **DECIDED** | Architecture lead | Claude Code | **Q18 = YES and Q20 = YES** — file `MSG-0161-q18-q20-architecture-rulings.md`, committed `e7daa45`. **Q18** — TASK-0046's topology/durability evidence **is architecturally significant and is promoted into EPA-0006 as a distinct section**, which **must preserve MSG-0158's evidence boundary**: it may state the measured result and its relationship to N1 and DA-1, and **must not generalize the single-subject result to an engine class, select an engine, change a gate, or move a candidate verdict**. **Q20** — authorizes **one bounded evidence task** to measure N6 as defined in EPA-0006 §4.18, with the scope fixed in terms: **the four MSG-0158 physical organizations L1/L2/L3/L4, both journal modes, both request-induced write shapes**, and the task **shall distinguish baseline/reproduction evidence from N6 subject measurements and shall not silently treat prior TASK-0046 measurements as new N6 measurements**. **Evidence-only.** **Ruling consequence 1 (the promotion) and consequence 2 (the task) are SEPARATE**; consequence 3 requires the authorization be **reconciled into the queue before execution**. **This file collides with the TASK-0047 execution record above, which also claims 0161** — the eighth collision in this register, recorded not renamed (MSG-0117 precedent), because `TASK-0048-n6-measurement.md` cites "MSG-0161" as its authority | 2026-08-25 |
| MSG-0162 | Record + reconciliation | **OPEN** | Architecture lead | Claude Code / Supervisor | **TASK-0048 reconciled as the single READY task, one deleted queue row restored, and six stale `READY` headers corrected.** **TASK-0048 was AUTHORIZED but absent from the queue entirely**, so the supervisor read `NOOP :: no READY task` and the loop stalled with the work already authorized — the **third consecutive time** a ruling and a task file landed without the row. **The row was transcribed from the two committed Lead artefacts** (`e7daa45`, `fef8bad`) **and nothing else**; the working tree was **clean at `fef8bad`** before the edit, so no phantom row was adopted (the TASK-0046/Q17 hazard). **Separately, commit `6bb259a` DELETED TASK-0046's COMPLETE summary row** — it overwrote the row in place with TASK-0047's instead of appending — leaving a completed 9/9 task with **no summary row and a detail section still marked `READY`**; **the row is restored verbatim from `6bb259a^`, not re-authored**. **Six stale `READY` headers** (TASK-0025/0027/0028/0041/0042/0045/0046) corrected — a stale `READY` is **the signal a supervisor cycle reads to start a runner**, not cosmetic drift. **Exactly one READY task now exists.** **MSG-0161's Q18 promotion consequence has NO authorized task and is NOT absorbed by TASK-0048** — carried as **TASK-0049 (AUTHORIZED, NOT READY)**, §4.19 fixed by the Lead, deliberately sequenced AFTER TASK-0048 to preserve the single-READY-task rule. **Nothing measured, selected, adopted, deployed, implemented or cleared; no invariant, gate or verdict touched** | 2026-08-25 |
| MSG-0163 | Record + referral | **OPEN** | Claude Code | Architecture lead | **TASK-0048 execution record — N6 measured, and L4 violates it.** **7/7 required outcomes MET.** **16 configurations** — 4 topologies × 2 journal modes × 2 write shapes — each with a **baseline before the request**; **both controls behaved as required, run VALID**. **L4 satisfies N1 and fails N6**: **N6.1 + N6.2 FINDING under W-A in both modes** with **0 unauthorized rows in the store**, so the bytes are **history-sourced**; **N6.3 VIOLATED in all four L4 arms**. **L3 satisfied N6.3 on this measurement**; **L1's findings arise only where the shared layout holds the rows in reach**; **L2 none**. **TASK-0046's W-B leak was NOT reproduced and the record says why** — this L4 kept **1 residue page against 10** — so **W-B's silence is a fixture property, not exoneration** (DA-5 row 3). **Four apparatus defects found and fixed before reporting, two of which understated the subject**: post-autocommit scanning (**DA-6 sixteen times**), a live-row count blind to L2's sibling structure, a journal parser at the wrong offset (**"no pre-image" for a journal carrying the marker 800 times**), and a verdict scored on parsed images alone. **Nothing CLEARED — ten probes have cleared nothing; no verdict moved; no gate changed.** **Q21 referred**: does an N6 violation belong in §4.13's EV-list, and at what strength? **Unmeasured is not satisfied** | 2026-08-26 |
| MSG-0176 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0052 execution record — `EV13` and the Q14 ruling are encoded, and nothing is discharged.** **8/8 required outcomes MET**, one with a stated qualification. **178 insertions / 0 deletions**, one file, `docs/` **empty**, **no non-markdown file touched**. **`EV13` — "N6, measured" — is in §4.13's EV-list at EV2's strength**: measured against N6 across limbs N6.1–N6.3, **provenance established before any finding**, the **residue after an N3 transition** examined and not only the live entries, **unmeasured is not satisfied**. **The Q14 ruling is at the end of §4.16 in BOTH limbs, kept separate** — **DISQUALIFIED ⇒ the candidate is out for selection; NOT CLEARED ⇒ cannot support selection and does not itself disqualify** — with **MSG-0172's reasoning reproduced verbatim** (*"arriving by the write path instead of the read path"*; treating unproven as violation *"would let a missing instrument convict an engine"*) and **the asymmetry under its own heading**: *passing a necessary condition is not evidence of the whole; failing one is decisive* — then **checked against §4.6 S5, S6 E3, S10, DA-6 and §4.18 consequence 1**, which are all the same shape. **NO NEW CLEARANCE GATE: §4.6 S6's table is untouched** (mechanically — §4.6 is lines 364–655, the first added line is 1924), **N6 still clears nothing**, **`EV13` requires MEASUREMENT, not a pass.** **No candidate verdict moves and none could — DA-1 has been defined and never applied.** **`EV13` is discharged for no candidate**: TASK-0048 measured a **test subject**, which is not a candidate (§4.6 S11). **§4.16's Q14 heading deliberately NOT changed** (§4.12 Q12 form; MSG-0133's heading change was instructed in terms and nothing instructs one here), and the superseded fail-closed-default paragraph is **named and left standing**. **Two declared judgement calls, both pointer notes under outcome 6: §4.18**, so `EV13` is not read against *"satisfying N6 clears nothing"*; and **§4.20**, where **TASK-0051's collision-table row *"EV1…EV12 only"* went stale on delivery and is LEFT STANDING — the enumeration was a measurement, and editing a measurement after the fact destroys what made it trustworthy**; the collision result is unaffected. **QUALIFICATION:** `git fetch` **DENIED to this runner**, but **`.git/FETCH_HEAD` was VERIFIED written ~1 minute pre-session by the Supervisor cycle, recording `origin/main` = `0eaa975` = local `HEAD`** — that covers the start of the run, **not movement during it**, for which **all three pushes being FAST-FORWARD** is the interlock. **No workaround taken. No referral, no new blocker, no new discovery.** **Seventh index-drift finding reported and deliberately not fixed.** **GAP-B UNDISCHARGED, E4 UNMET, six candidates NOT CLEARED, eleven probes have cleared nothing; nothing selected, adopted, deployed, implemented or cleared** | 2026-08-26 |
| MSG-0173 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0051 execution record — `AB-1` is defined, nothing is built, and nothing is discharged.** **8/8 required outcomes MET**, one with a stated qualification. **EPA-0006 §4.20 delivered — 241 insertions / 0 deletions**, one file, additive; **one declared pointer note** below §4.6 S6's existing note; `git diff --name-only docs/` **empty**. **`AB-1` is a PROHIBITION ON THE APPLICATION** — corpus content must never enter the text of a statement submitted to the engine, only be bound as a parameter, **enforced mechanically rather than by convention** — with **four separable limbs**: **`AB-1.1` automated** (review, checklist and convention do not satisfy it), **`AB-1.2` build-failing** (**a warning is not enforcement**, nor is a check that can be merged past), **`AB-1.3` complete over every path that can reach the projection store**, **`AB-1.4` evidenced by a test demonstrated to FAIL on an inlined statement**. **`AB-1.4` is §4.6 S5 applied to the CONTROL rather than the counter — a green pipeline is a zero count, and a check never watched reject anything is indistinguishable from one silently disabled.** **THE HEADLINE IS THE CONSTRAINT AND IT IS THE SECTION'S FIRST ELEMENT: `AB-1` DISCHARGES NOTHING** — **GAP-B UNDISCHARGED, E4 UNMET, all six §4.14 candidates NOT CLEARED, eleven probes have cleared nothing**; Q22 removed **one** objection and **the second stands untouched — none of the surfaces found is a LOG**, so `AB-1` is a condition **IN ADDITION to** being a log, never a substitute. **One judgement call DECLARED**: phrased over **corpus content**, not *unauthorized* content, because **the constructing code cannot be relied on to know whose entitlements a passage falls outside** — the stronger reading, relaxing nothing. **Collision check PERFORMED and RECORDED** — zero `AB` occurrences in both trees, every EPA-0006 identifier **enumerated rather than recalled**; **`E5` occurs only as §4.16's rejected label**, and **the highest `EV` is `EV12` — `EV13` is ruled but NOT written here** and the gap is declared. **Documentary only: no linter, rule, CI config or test built; nothing measured; no test count claimed.** **QUALIFICATION:** `git fetch` / `git ls-remote` **DENIED to this runner**, so the origin comparison is **INFERRED at start and enforced by the push's own rejection**, **not live-checked**; **no workaround taken**. **Sixth index-drift finding reported and deliberately NOT fixed** (MSG-0169–0172 unregistered in `comms/README.md`). **Nothing selected, adopted, deployed, implemented or cleared; no verdict moved; E4 not weakened** | 2026-08-26 |
| MSG-0172 | Rulings | **DECIDED** | Architecture lead | Claude Code / Supervisor | **Four open questions RULED by the Lead, which had been referring them upward without cause.** **Q14 — a CONFIRMED DA-1 violation DISQUALIFIES a candidate; NOT CLEARED blocks without disqualifying.** A confirmed violation means an ordinary request wrote content the requester was not entitled to receive into durable storage — **the same confidentiality failure strict Shape-1 exists to prevent, arriving by the WRITE path**; an architecture that disqualifies for examining unauthorized entries and tolerates making unauthorized bytes durable **is not coherent**. NOT CLEARED does not disqualify because **treating unproven as violation would let a missing instrument convict an engine** (§4.6 S5). **Q21 — N6 joins the EV-list as EV13**, "measured, never assumed", at EV2's strength: the §4.13 EV-list **predates N6** and omitting it would let a topology reach selection carrying the exact failure TASK-0046 exists to record — **L4 satisfied N1 and leaked bytes anyway**. EV13 requires **measurement, not a pass**; it adds no clearance gate. **Q17 — the queue row IS the execution gate and ships WITH the authorization**: (1) a ruling + task file without a row is **a draft, not an authorized task — one commit**; (2) **no READY row may be pushed unvalidated** against the Supervisor's parser, and the executor's `queue-parse-check.mjs` is **promoted to a standing pre-push check**; (3) a task ID appears in the dependency cell **only if it IS a dependency**. **FIVE failures, not four** — DISC-0013 is a distinct mode (a row that existed and was malformed). **The Supervisor is NOT modified; the defect was never in it.** **L4/W-B divergence — re-measurement AUTHORIZED but NOT READY**, sequenced behind the definition work on the TASK-0044 precedent (**define the criterion before measuring**). **MSG-0171's enforcement requirement gets its own namespace `AB` — deliberately NOT an `E` number** (MSG-0148b forbids adding to §4.6 S6, the same reasoning that made `DA` not `E5`) **and its own section, because it constrains the APPLICATION, not the engine.** **TASK-0051 authorized and reconciled as the single READY task.** **Nothing changes today: GAP-B UNDISCHARGED, E4 UNMET, all six candidates NOT CLEARED, eleven probes have cleared nothing, no verdict moves** | 2026-08-26 |
| MSG-0171 | Ruling | **DECIDED** | Architecture lead | Claude Code / Supervisor | **Q22 RULED — conditional YES.** A statement surface built on the **UNEXPANDED** statement text may satisfy **E4**, **but ONLY where the project enforces, by an automated check that FAILS THE BUILD**, that unauthorized passage content is **never inlined** and is **always bound as a parameter**. **The condition IS the ruling — without the enforced check the answer is NO.** **Why a build failure and not a policy:** MSG-0168 §5.3 measured both forms — parameter-bound gives `sourceSQL` **0 hits** and `expandedSQL` **1 verbatim hit**, but **inlined makes the two IDENTICAL and both adverse**, so cleanliness is *"a property of the application, not a guarantee the engine provides"*. **A property living in developer discipline is not a security property unless something mechanical enforces it** — the same interlock-vs-claim line MSG-0169 §2 drew. **Enforcement must be automated, build-failing, cover every path to the projection store, and be EVIDENCED by a test shown to FAIL on an inlined statement** (§4.6 S5: a control nobody watched reject anything is untested). **None of it is built.** **CRITICAL — THIS DISCHARGES NOTHING: GAP-B remains UNDISCHARGED and E4 remains UNMET**, because a **second independent objection stands** — **none of the surfaces found is a LOG** (**C1 = NO on every member**): `sourceSQL`/`expandedSQL` are **per-statement accessors with NO accumulation**; `createTagStore` accumulates but **every read path threw**; `dbstat` is page statistics; `setAuthorizer` is prepare-time; and `sqlite_stmt`, which would have been such a log, is **absent from the build**. **E4 is NOT weakened** (MSG-0119) — what is ruled is what a surface must satisfy **in addition to** being a log, never a substitute for being one. **All six §4.14 candidates remain NOT CLEARED; eleven probes have cleared nothing; nothing selected, adopted, deployed, implemented or cleared.** **Two new questions raised and NOT answered:** where the enforcement requirement belongs in the accepted architecture, and whether it needs its own identifier alongside E1–E4/DA-1…DA-7 or is a condition on E4 | 2026-08-26 |
| MSG-0170 | Ruling | **DECIDED** (Q23) · Q22 **OPEN** | Architecture lead | Claude Code / Supervisor | **Q23 RULED — option (a): the Lead Loop writes ONLY to `claude/architecture-lead-loop` and NEVER pushes to `main`; the operator merges.** Options (b) shared lock, (c) widening the runner to fetch/merge, (d) permanent manual triggering were **not chosen**. **MSG-0166 §5 is SUPERSEDED on this point**: it treated a mid-cycle collision as a transient race, and the incident proved otherwise — the runner's push was rejected and, because the Supervisor requires `HEAD == origin/main` and the runner may not merge, **the repository sat deadlocked ~4.5 hours until a human cleared it.** **COST, recorded because it is real and was accepted knowingly: a queue row the loop writes does NOT reach the executor until the operator merges** — the Supervisor reads `main`. **The loop verifies, records and prepares autonomously; releasing work still ends in a human merge.** A partial retreat from MSG-0166's purpose, bought in exchange for the guarantee that the two writers can never collide again. **Q22 DEFERRED by the operator — deliberate, NOT an oversight and NOT a tacit answer either way. It remains OPEN and UNRULED.** Nothing is lost by waiting: **E4 stays unmet, GAP-B stays undischarged, all six §4.14 candidates stay NOT CLEARED, and selection is blocked on independent grounds.** **No other question ruled** — Q21, Q17, Q14 and the L4/W-B non-reproduction remain OPEN. **No invariant, criterion, evidence class, gate or verdict changed; E4 NOT weakened** (MSG-0119). **Supervisor untouched. Nothing selected, adopted, deployed, implemented or cleared; eleven probes have cleared nothing** | 2026-08-26 |
| MSG-0169 | Verification + reconciliation + referral | **OPEN** | Architecture lead | Claude Code / Supervisor | **TASK-0050 VERIFIED and COMPLETE (7/7); BLK-0013 CLEARED; and the two-writer deadlock the LEAD caused.** **GAP-B is NOT discharged — no reachable subject supplies E4 that is both OBTAINABLE and NON-ADVERSE**, which MSG-0167 anticipated as a complete and valid outcome. **Verified against artefacts, not accepted**: the §5.3 pair **confirmed verbatim in the output** (`sourceSQL … body = ?` **0 hits**; `expandedSQL` carrying the marker **1 hit**; inlined **both 1**); controls observed (deny control → `Error: not authorized`; disarmed silent); `docs/` and `implementation/architecture/` diffs **EMPTY**; **eleven probes have cleared nothing**. **ONE VERIFICATION FINDING: "Run validity: VALID" is an ASSESSMENT, not an interlock** — neither probe contains `fail()`/`process.exit`/an assertion and **`VALID` appears in neither output**; TASK-0048 enforced, this one reported. **Read it as ASSESSED VALID; no verdict or finding changes.** **THE DEADLOCK: the Lead pushed to `main` during the runner's TASK-0050 run**, so the runner's push was non-fast-forward and rejected (BLK-0013), and the Supervisor — which requires `HEAD == origin/main` — **correctly refused every cycle for ~4.5 hours** (`NOOP :: not reconciled: local is ahead by 5 (and behind by 1)`). **The runner cannot escape it**: it is permitted `git push origin main` and no merge or fetch. **MSG-0166 §5 called this a race and it is a STANDING DEADLOCK only a human can clear** — the very dependency the loop existed to remove. **Executor and Supervisor behaved exactly as designed; the wrong design is the one MSG-0166 introduced.** **Lead Loop PAUSED** (`trig_01PpjCrtoEUZnF3vPACBPfCW`, `enabled: false`), not deleted. **Two questions referred: Q22** (is E4 satisfiable by a surface built on the UNEXPANDED statement text, given non-adversity holds only for parameter-bound content and is defeated by inlining?) and **Q23** (how, or whether, the Lead Loop should write to `main`). **Nothing selected, adopted, deployed, implemented or cleared** | 2026-08-26 |
| MSG-0168 | Record + referral | **OPEN** | Claude Code | Architecture lead | **TASK-0050 execution record — GAP-B measured, and no reachable subject discharges it.** **7/7 required outcomes MET.** **No reachable subject supplies E4 both OBTAINABLE and NON-ADVERSE** — the outcome MSG-0167 named in advance as *"complete and valid"* and *"the most consequential result the programme could produce"*. **GAP-B is NOT discharged, NOT withdrawn, NOT weakened.** Subject 1 (SQLite **3.51.3** / `node:sqlite` / Node **v24.15.0**) measured on a **WIDER** enumeration than §4.12 or §4.14 used: **21 C-API names checked**, **49 compile options**, **7 of 7** tracing pragmas **inert** against the F15 control, and **`sqlite_stmt` / `bytecode` / `tables_used` / `sqlite_dbpage` ABSENT FROM THE BUILD** — `sqlite_stmt` being the one surface that would have supplied a non-adverse E4 log. **Four surfaces exercised disarmed before armed with C1–C4 each**: `dbstat` (non-adverse, **C1 = NO**), `setAuthorizer` (non-adverse, **invariant with `N` — 3 events at 200/1000/5000 rows**, 0 on re-execution, **C1 = C4 = NO**), `sourceSQL`/`expandedSQL` (**C1 = NO**), `createTagStore` (**accumulates but has NO READ PATH — C3 = NO**, so its zero is **ZERO EVIDENCE, fail closed**). **Four controls, all behaved — run VALID**, one stronger than a silence test: a **DENYING** authorizer must make a prepare **fail**, and it did. **THE REFERRAL IS THE SUBSTANCE, and it points the OPPOSITE way to the one anticipated**: §4.15's adverse result is a **BINDING CHOICE, not an engine necessity** — the same engine exposes `sourceSQL` (**0** hits on parameter-bound unauthorized text) and `expandedSQL` (**1**, verbatim) as **separate accessors**. **The gate is therefore NOT shown unsatisfiable and this record does not conclude that it is.** **But separability is defeated by INLINING** (both forms then carry the text), **and nothing in reach exposes a LOG built on the non-adverse form.** **Referred: is E4 satisfiable by a surface built on the UNEXPANDED statement text, given its non-adversity holds only for parameter-bound content?** **Both answers move the clearance bar, so neither is taken here.** **Raises BLK-0012** (the reach the answer is bounded by — a `py` grant scoped to TASK-0043, a build without `ENABLE_STMTVTAB`, an absent extension binary; **no workaround taken**) **and DISC-0014** (the two subjects were **enumerated to different standards**; the widened enumeration **strengthens** §4.12/§4.14 and moves no verdict). **Nothing selected, adopted, deployed, implemented or cleared; no gate, invariant or verdict changed; eleven probes have cleared nothing** | [`MSG-0168-…`](../comms/MSG-0168-task-0050-gap-b-e4-subject-execution-record.md) |
| MSG-0167 | Authorization + Lead correction | **DECIDED** | Architecture lead | Claude Code | **GAP-B authorized as TASK-0050 — and a Lead error corrected first.** **The Lead told the operator E4 was unobtainable on BOTH subjects. That is WRONG**: §4.15's own heading is *"obtainable, and adverse"* — first subject (`node:sqlite`) **NOT OBTAINABLE**, second (Python `sqlite3`) **OBTAINABLE and ADVERSE**. The three build flags are absent on both, but **the conclusion drawn from that was backwards**: *"the two subjects differ in the binding, not in the build"* — **the binding is why the second HAS a surface.** **GAP-B still blocks and the authorization still stands**, and the position is **worse** than "no surface exists": (1) where the Shape-1 evidence lives E4 **cannot be taken**; (2) where it could be taken it **FAILED** — parameter-bound text verbatim in the trace, because the trace **expands** the statement; (3) even that surface is **C4 = NO**, recording the **instruction** not the **examination** (200 examined, 100 returned, **1 entry**), so it is **not E2**. **EV5: an engine that cannot supply it "cannot be selected under any topology"** — **GAP-B is the binding constraint on the programme.** Authorizes **one bounded evidence task** to establish whether any reachable subject supplies E4 **obtainable AND non-adverse**, and whether such a subject can carry the Shape-1 apparatus. **A finding that none does is a COMPLETE and VALID outcome** — and the most consequential result the programme could produce. **Rules NO open question: Q21, Q17, Q14 and the L4/W-B non-reproduction remain OPEN.** **Nothing selected, adopted, deployed, implemented or cleared** | 2026-08-26 |
| MSG-0166 | Operations decision | **DECIDED** | Architecture lead | Claude Code / Supervisor | **The Architecture Lead side of the loop is AUTOMATED — mechanically, and no further.** A durable Routine starts a **fresh Claude session hourly at an off-minute**; operating rules in [`ARCHITECTURE-LEAD-LOOP.md`](ARCHITECTURE-LEAD-LOOP.md). **MECHANICAL ONLY**: verify executor results **against their artefacts**, reconcile an already-authorized task into the queue, correct status drift, record, push. **FORBIDDEN: ruling any open question, authorizing new work, creating a task, amending any invariant/criterion/gate/verdict, touching engine selection** — those accumulate as OPEN for the operator. **Solves four stalls** (TASK-0045/0046/0048/0049) where an authorized task had **no queue row** and execution waited on a human noticing. **Closing that gap in practice is NOT ruling Q17**, which stays OPEN. **Boundary is the Supervisor's own**: *"if the supervisor could edit the queue, a scheduling bug would become an authorization bug"* — **worse for a Lead loop, which sits ABOVE the queue.** **An empty queue is not automatically a stall**: where every authorized consequence is discharged, the loop records that a decision is owed and **does not manufacture a task**. **Only state is the `Verified at HEAD:` line in the newest Lead record** — no state file, **no-op cycles leave no trace**. **Concurrency**: two automated writers now target `main` (BLK-0009); offset cadence, fetch-before-write, **abort-not-merge if `main` moves**, never force-push; **the executor's `runner.lock` is NOT observable from the Lead environment — runner activity is UNKNOWN.** **Supervisor untouched; `COMMS` unchanged.** **INSTALLED but NOT PROVEN until a first firing is recorded** (MSG-0011/0029/0032 distinction). **Also records TASK-0049 VERIFIED** (§4.19 additive 167/0, `docs/` empty, MSG-0164 §4 constraint followed exactly) **and a tenth number collision the LEAD caused** — MSG-0164 told TASK-0049 to use "MSG-0165 or later", the Lead then took MSG-0165, and the correction was **still uncommitted** when the executor began. **The executor read the repository and was right; this file moved to MSG-0166.** **RATIFIED by the operator 2026-08-26** (MSG-0166 §9) — the approval covers the Routine, the mechanical-only boundary and the loop rules, and **rules NO open question: Q21, Q17, Q14 and the L4/W-B non-reproduction remain OPEN.** **Ratification is not verification** — status stays **INSTALLED, NOT PROVEN** until a first firing is recorded. **Nothing selected, adopted, deployed, implemented or cleared** | 2026-08-26 |
| MSG-0165 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0049 execution record — §4.19 delivered.** **7/7 required outcomes MET.** The TASK-0046 evidence is promoted with its mechanism **exhibited rather than asserted** — every durable page identified, classified, and **byte-verified against an independently read copy**. **167 insertions / 0 deletions**, and **zero deletions is the mechanical proof that no gate, table or verdict was edited**. **Part two is the counter-example inside the same evidence**: **isolation answered W-A and did not answer W-B**, where L4 made the marker durable **15 times with no unauthorized row in reach**. **§4.19 inverts §4.17's W-B result, and a declared pointer note now says so IN §4.17** — §4.17's *"appends overwrite none"* is **correct about an empty free list** — **and neither section is withdrawn**. **MSG-0163's failure to reproduce that arm is recorded without reconciling §4.19 against it**: **a later absence is not evidence that this presence was wrong** (DA-5 row 3). **Promotion clears nothing; nothing measured, selected or changed; ten probes have cleared nothing** | 2026-08-26 |
| MSG-0164 | Verification + reconciliation | **OPEN** | Architecture lead | Claude Code / Supervisor | **TASK-0048 VERIFIED by the Lead, and TASK-0049 reconciled as the single READY task.** MSG-0163's claims were **re-checked against the artefacts** rather than accepted: **16 configuration rows** counted in the probe output; **the negative controls genuinely gate the run** (`probe.mjs` 449–459 calls `fail()` if NC-1 is silent or NC-2 matches — an interlock, not a claim); **provenance ordering confirmed** (`liveRows = 0` for L3/L4, so a history-sourced finding is only reachable with no live unauthorized row); **`docs/` and `implementation/architecture/` diffs both EMPTY** — EPA-0006 untouched, no gate or verdict moved. **7/7 outcomes MET; the record is accepted as written.** **Two precedents endorsed**: the executor **reported a non-reproduction rather than smoothing it** (TASK-0046 found L4/W-B leaking ×15 over 10 residue pages; this run had **1** residue page and **no W-B finding anywhere** — recorded as *"silence, not exoneration"*), and it **found four apparatus defects before reporting**, **two of which would have understated the subject**. **The queue was empty again** — the **fourth** occurrence of an authorized task with no row (0045, 0046, 0048, 0049), and this one was foreseeable since MSG-0162 §5 had already defined and sequenced TASK-0049. **One constraint added to TASK-0049's execution: §4.19 records what MSG-0158 measured, in MSG-0158's terms — it is NOT reconciled against MSG-0163 or softened by it**, because quietly harmonising two disagreeing runs destroys the evidence instead of promoting it. **The L4/W-B non-reproduction is NOT resolved** and no task is created for it — recorded so a future session finds the disagreement rather than inheriting the quieter result. **Nothing measured, selected, adopted, deployed, implemented or cleared; no invariant, gate or verdict touched** | 2026-08-26 |
| MSG-0154 | Record | **OPEN** | Claude Code | Architecture lead | **§4.15 written and verified from `main`; TASK-0045 reconciled as the single READY task.** **§4.15 — 129 insertions / 0 deletions, additive**, reproducing MSG-0146 and adding nothing: **E4 OBTAINABLE on the second subject and ADVERSE** — passage text bound as a **parameter** appears verbatim in the trace, **the reverse of §4.14's surface scan, which was right not to be offered as E4**. Records the implication that constrains reuse: **the two subjects differ in the BINDING, not the build** — `DEBUG`, `ENABLE_SQLLOG` and `ENABLE_STMT_SCANSTATUS` are absent on both — **so E4's obtainability here may not be generalized to "SQLite supplies E4", still less to a class**. **C4 negative and kept beside the verdict**; **GAP-B not withdrawn**, because every Shape-1 measurement in §4.11, §4.12 and §4.14 was taken on the FIRST subject. **The WAL observation is stated as data with its classification left to §4.16 DA-4**, and **DA-1 still holds no verdict about any candidate** | 2026-08-25 |
| MSG-0117 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0038 reconciled as the single READY task, and a seventh number collision recorded.** **Two lead-authored files claim MSG-0116** — the MSG-0020 shape, and MSG-0020's pair **contradicted**, so agreement was verified clause by clause before queueing rather than assumed. **They agree on all three rulings and the next action**; no stop fired. **They are not interchangeable** — 0116a carries the kernel-read-count and citation-version points, 0116b the separate-instrumentation requirement and the no-clearance-follows warning — so **the task section carries the union and links both**. Neither renamed, per MSG-0058 F4; **neither was registered in either index** until now | 2026-08-23 |
| MSG-0115 | Record + referrals | **OPEN** | Claude Code | Architecture lead | **TASK-0037 execution record — the freshness mechanism is measured, and nothing is cleared.** **8/8 acceptance criteria MET**; **a real probe ran** — **8 designs × 11 scenarios × 3 collection sizes**, two instrument placements each, on **SQLite 3.51.3 via `node:sqlite`** (class **R** test subject, the only engine reachable — `docker` is not on this runner's PATH), `:memory:` only, no install, no network, no corpus, **no wall-clock read and no timing figure produced**. The **mandatory negative control failed** — NC returned a superseded version in **12 cases** — so the run is valid; **the adversarial precondition also caught a real fixture defect** and correctly declared the first draft VOID. **Two terminology reconciliations were taken from the accepted ADRs rather than invented**: MSG-0113's *"revoked"* is ADR-0018 §2's **WITHDRAWN** (no `REVOKED` state exists), and *"the current approved version"* is read as ADR-0018's **PUBLISHED and effective** version, since `APPROVED (not yet published)` is **not answerable** — both strict, both fail-closed. **The discriminator MSG-0113 §3 demands was built and it fired**: S2 and S3 are the **same recorded transition** queried before and after the periodic timer, and the two timer-only designs **returned the superseded version before the timer and the correct one after** — *"made correct by waiting, not by the transition."* **Five results carry beyond the engine.** **Version identity is necessary and nowhere near sufficient** — the two designs differing **only** in whether the structure carries it have **identical grids**; carrying it without consulting the kernel changes nothing, and a design carrying none **cannot name the version it answered from**, defeating ADR-0018 §1's citation rule independently. **"Answered nothing" is not "abstained"** — one design returned an **empty ANSWER** where abstention was required, and on the kernel-unreachable case **answered correctly by luck**; ADR-0017 §5 classifies abstentions A1–A7 and an empty answer is none of them. **The faked re-check is a no-op, now demonstrated rather than predicted** — against the same change, the kernel re-check `kept 0/4` and abstained while the self re-check `kept 4/4` and **returned four chunks of a reclassified version**, with the same structures, the same plan and the **same `U`**; **G-Q5.2c is satisfied for the first time** (a re-check observed to **REJECT**). **`U` cannot distinguish a leaking design from a conservative one** — those two designs both report **`U` = 4 at every size**, which **extends §4.6 S5**: the asymmetry rule warns a *zero* count can be a placement artefact; here a *non-zero* count identical between two designs conceals **opposite** security outcomes. **And "`U` = 0 is a property of an instant" is not only about time** — in the decisive scenario **no time passes at all**, an authorization attribute changes in the kernel, and **no timer would have caught it**, corroborating §4.8 finding 1 in a second fixture. **A hook is only as complete as the set of changes it is wired to**, so MSG-0113 §2(2) and §2(5) are **not alternatives**. **Nothing is CLEARED** — 7 NOT CLEARED, 1 DISQUALIFIED; **the design meeting BOTH G-Q5 conditions and every G-Q7 requirement (11/11) is still NOT CLEARED** on **E2** (`U` = 4 > 0), **E4** (not obtained) and **G-Q4** (not measured) — §4.9's *"necessary, never sufficient"* demonstrated in practice. **All nine MSG-0104 and all eight TASK-0035 verdicts reproduced unchanged; neither prior probe modified or re-run**; **`git diff --name-only docs/` empty**; **EPA-0006 §4.10 added, 122 insertions / 0 deletions**; **no numeric threshold introduced** — the bound exhibited is a **fixture constant** whose magnitude **G-Q5.1a** expressly does not judge. **Three questions referred, none blocking**: **Q8** whether the mandatory §3 point-2 re-check is itself *examination* (its kernel reads are **bounded by `k` and invariant with `N`**), **Q9** sharpening §4.7 Q3 with the new evidence, **Q10** the MSG-0113/ADR-0018 terminology mismatch | 2026-08-23 |
| MSG-0099 | Record | **CLOSED** 2026-08-23 — discharged by execution (MSG-0100); the distinction it asked for is recorded in WP-0009 §6.2, the architecture README and MSG-0100 §5, and its warning held — no unmeasured figure appears in the delivered record | Claude Code | Architecture lead | **TASK-0032 reconciled as the single READY task.** Records that this is **not a re-run of TASK-0026**: that task evaluated stack **shape** (Approaches A/B/C) and produced EPA-0005; this evaluates **technology classes** against the now-settled Approach C and against ADR-0020 **as amended by AMD-01**, neither of which existed then. **Both are labelled "A-STACK" in WP-0009 §6.2**, where A-STACK already reads EXECUTED — the label reuse is flagged so the record is not read as one task run twice, and the task is told to distinguish the rows rather than overwrite. Also flags the likeliest failure mode: a technology comparison invites throughput, latency, memory and recall numbers, **none of which has been measured here** | 2026-08-23 |
| MSG-0096 | Record | **CLOSED** 2026-08-23 — discharged by execution (MSG-0097) | Claude Code | Architecture lead | **TASK-0031 reconciled as the single READY task** to apply AMD-01 in place, per MSG-0095 §5. Three edits and nothing else: hunk 1 at the end of ADR-0020 §4, hunk 2 as one Traceability row, and a concise header note naming AMD-01 and MSG-0095. **Wording is taken verbatim from AMD-01** rather than retyped, since transcription drift in an accepted ADR is the failure this must not introduce. The task edits an **accepted, promoted** ADR — authorized here and only here — and its recovery procedure warns that re-running against an already-amended file would insert the clause twice | 2026-08-23 |
| MSG-0074 | Record | **CLOSED** | Claude Code | Architecture lead | **TASK-0025 queue reconciliation.** Reconciled as the single READY task after verifying prerequisites individually. **No separate TASK-0025 specification file exists** — MSG-0073 plus the queue section are the specification, and the section records the promotion convention verified from the ADR-0015 precedent and the lead's own ADR-0017 promotion. **The gap did not recur this time** in one respect: the authorization arrived with no colliding sibling file. **The queue gap itself did recur** — the **eighth** occurrence. **Discharged by execution 2026-08-21** — TASK-0025 ran against this reconciliation and is COMPLETE (MSG-0075); because the repair landed before the next cycle, the task was already the single READY task when the run started and the Supervisor never idled on it | 2026-08-21 |
| MSG-0051 | Record | CREATED — audit complete | Claude Code | Architecture lead | **TASK-0019 baseline audit.** Six documentary corrections applied with their authorities quoted; four record classes verified already correct; **§C refers seven items for decision**, led by the accepted WP-0001 work package still reading `Status: Ready for implementation` — the stop condition fired and that correction was **not** made | TASK-0019 |

## Interruption and recovery protocol

Applies after any interruption: crash, network failure, machine restart, context loss, or a new Claude session.

### Checkpointing

Every task with status IN_PROGRESS **must** maintain a checkpoint at `implementation/operations/checkpoints/TASK-XXXX.md`, committed and pushed. A checkpoint identifies task ID, checkpoint number, current phase, completed operations, last verified operation, next operation, actual external/system state, Git commit/HEAD, and whether resumption is safe.

A checkpoint is written **after** an operation is verified, never in anticipation of one.

### Resuming

Before resuming anything:

- Read the task checkpoint.
- Read GitHub state — status, queue, blockers, communications, discoveries.
- Inspect actual system state directly.
- Inspect git state — `git status`, `git rev-parse HEAD origin/main`.
- **NEVER repeat an operation merely because the checkpoint says it was incomplete.** Observe actual state first.
- If documented and actual state disagree — **STOP**, document the discrepancy, and reconcile safely.
- Resume only from the first operation whose completion is not verified by direct observation.

### Idempotence

Prefer operations that are safe to repeat, and verify-before-acting on those that are not. Where an operation cannot be made idempotent — volume initialisation, migrations that are not checksum-guarded, credential rotation — the checkpoint must say so explicitly.

## Continuation rule

**Claude Code MUST NOT stop merely because one authorized subtask completed.** If the next task is READY, its prerequisites are satisfied, and no architecture or operator decision is required, Claude Code **MUST continue automatically** — documenting and pushing as it goes.

## Stop boundaries

Claude Code MUST stop, document, commit, push, and report when architecture approval is required; privileged operator action is required; a security boundary would be crossed; a prerequisite cannot be satisfied; documentation conflicts; actual state differs materially from recorded state; or an operation is destructive or irreversible and is not explicitly authorized.

---

## TASK-0017 — Supervisor heartbeat / unattended observability

**Priority:** 1 | **Status:** **COMPLETE** — authorized by MSG-0043; verified 36/36 under MSG-0046, recorded in MSG-0047 | **Owner:** Claude Code
**Depends on:** TASK-0016 (COMPLETE) | **Next eligible task:** none — nothing follows automatically
**Full specification:** [`TASK-0017-supervisor-heartbeat.md`](TASK-0017-supervisor-heartbeat.md)
**Checkpoint:** [`checkpoints/TASK-0017.md`](checkpoints/TASK-0017.md)

### Objective

Correct the heartbeat/state defect recorded in MSG-0042: `state/heartbeat.json` can still read
`NOOP :: no READY task` while a supervisor-started run is actually in progress, so unattended
execution looks idle from outside.

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | Architecture lead authorization | **MET** — MSG-0043 |
| P2 | TASK-0016 COMPLETE | MET |
| P3 | Supervisor installed and enabled | MET |

### Allowed actions

Inspect the heartbeat/state-writing path and its tests; reproduce the stale condition with a
harmless controlled run; correct the state updates so an observer can distinguish NOOP,
runner-started, runner-running, completion and failure; add or update focused tests; update
documentation and evidence; commit and push.

### Forbidden actions

- Changing the ten-minute schedule.
- Weakening the reconciliation or fail-closed gates.
- `--dangerously-skip-permissions` or any equivalent bypass; broadening deny rules.
- Changing product architecture or PCI runtime behaviour.
- Credentials, privilege escalation, or destructive repository/infrastructure operations.

### Verification requirements

A controlled test proves the heartbeat reflects a live supervisor-started run **and** its terminal
result. The focused test suite passes. Changes are committed and pushed with no unrelated
modifications.

### Documentation requirements

Update the supervisor README where behaviour changes, record the result in COMMS, and reconcile the
queue and status.

### Checkpoint requirements

Checkpoint after the defect is reproduced, and after the corrected behaviour is verified — each
recording observed state rather than intent.

### Stop conditions

If the fix would require changing the scheduling contract, the permissions model, or an architecture
decision outside this scope — **STOP** and record the exact conflict in COMMS rather than
improvising.

### Recovery procedure

The work is confined to the supervisor's own state-writing path and its tests. On resumption,
inspect `state/heartbeat.json` and the log directly before assuming any earlier edit took effect,
and re-run the suite rather than trusting a recorded pass.

---

## TASK-0018 — Live Supervisor heartbeat validation

**Priority:** 1 | **Status:** **COMPLETE** — all five gates MET; gate 3 met by external observation, recorded in the MSG-0049 addendum | **Owner:** Claude Code
**Depends on:** TASK-0017 (COMPLETE) | **Next eligible task:** none
**Full specification:** [`TASK-0018-live-supervisor-heartbeat-validation.md`](TASK-0018-live-supervisor-heartbeat-validation.md)
**Checkpoint:** [`checkpoints/TASK-0018.md`](checkpoints/TASK-0018.md)

> **Corrected 2026-08-21 by TASK-0019 (MSG-0050).** The status board above read **COMPLETE — 5 of 5
> gates MET** while this section's own status line and narrative read **IN_PROGRESS, four of five** —
> the same board-versus-narrative contradiction inside one file that TASK-0018 itself had to correct
> for TASK-0017, one task earlier. The board is right, on three agreeing authorities: the **MSG-0049
> addendum** records gate 3 met by continuous external observation (`COMPLETED  pid=0  active=False`
> at 21:03:36Z, lock released, exit code 0 carried into the reason line); **MSG-0049's status line**
> reads CLOSED / all five gates MET; and **MSG-0050** opens with "TASK-0018 is complete."
>
> Only the status line above was changed. The narrative below is left exactly as written — it was
> accurate on 2026-08-20, when gate 3 genuinely could not be observed from inside the run, and the
> sequence *observed four, could not observe the fifth, asked, closed it from outside* is the useful
> part of the record. This is an additive correction, as MSG-0050 requires.

### TASK-0018 — result: the heartbeat was observed live

**IN_PROGRESS, 2026-08-20.** The supervisor started this task on its own ten-minute cycle at
20:52:56Z, and while the runner was alive `state/heartbeat.json` read:

```json
{ "decision": "RUNNER_RUNNING", "reason": "TASK-0018 running for 210s",
  "runnerActive": true, "runnerPid": 7984, "head": "0c7d7b2...", "timestamp": "2026-08-20T20:56:26Z" }
```

Three samples 30s / 90s / 210s into the run show the value being **refreshed**, not written once.
Compare TASK-0017's own run, which reported `NOOP :: no READY task`, `runnerActive: false`, and a
two-commit-old `head` throughout. **All three symptoms are absent. The defect does not reproduce.**

| Gate | Verdict |
|---|---|
| 1. Launched by the enabled supervisor, not manually | **MET** — `CYCLE_START` 20:52:51Z, `RUNNER_STARTED pid=7984` 20:52:56Z; the logged prompt is verbatim this session's |
| 2. `RUNNER_RUNNING` with live pid and fresh timestamp | **MET** — three samples; log, lock, heartbeat and prompt all name pid 7984 |
| 3. Terminal heartbeat records the result; lock released | **NOT OBSERVED** — see below |
| 4. No stale `NOOP` persists across the live run | **MET** |
| 5. Evidence in COMMS; queue reconciled | **MET** — MSG-0049, this section, `checkpoints/TASK-0018.md`, `status/current.md` |

**Gate 3 is structurally unobservable from inside this run.** The supervisor writes the terminal
record *after* the runner exits (`supervisor.ps1` 468–485, 728–729), so a session cannot observe the
state its own exit produces. Nothing was modified to compensate: no supervisor change, no second run,
no test substituted for the observation. The evidence lands seconds after this session ends — durably
as a `COMPLETED :: task=TASK-0018` line in `logs/supervisor-20260820.log`, transiently in the
heartbeat, which the next cycle overwrites with `NOOP` about ten minutes later.

**Left IN_PROGRESS, deliberately — not COMPLETE and not READY.** Not COMPLETE because a gate is
unmet. Not READY because MSG-0048 authorizes **one** supervisor-started run, and a READY row would
start a second one that no message authorizes. MSG-0049 §6 asks for one decision and recommends
option (B): authorize a single further cycle, explicitly bounded, whose only work is reading the
previous run's terminal line and closing the task.

**One inference, flagged rather than buried.** Confirming pid 7984 with an external process listing
was refused by the runner's permission layer and **was not routed around**; the pid's liveness is
inferred from four agreeing artifacts and the advancing elapsed-time values. MSG-0049 §3.

### TASK-0018 — authorization (as issued)

### Objective

Close the one gap MSG-0047 named: the corrected heartbeat is proven by test but has never been
observed during a real supervisor-started run. Exercise it for real and record direct evidence that
`state/heartbeat.json` reports the live runner rather than a stale `NOOP`.

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | Architecture lead authorization | **MET** — MSG-0048 |
| P2 | TASK-0017 COMPLETE | MET — tests 36/36, MSG-0047 |
| P3 | Supervisor enabled on its ten-minute cadence | MET |

### Allowed actions

Run only the existing inspection/test commands needed for the observation; read
`state/heartbeat.json`, the supervisor logs, and the task's own execution state while running;
record timestamps and observed fields for the running and terminal states; create exactly one
verification COMMS record; update queue, checkpoint and status.

### Forbidden actions

- Changing supervisor code, configuration, permissions, scheduling, or runner behaviour.
- **Modifying the heartbeat implementation to make the observation pass.**
- **Manually triggering the supervisor** — gate 1 requires a scheduled launch.
- Broadening any allowlist or permission; creating unrelated tasks or architecture.
- Destructive commands, credentials, privilege escalation, force-push, reset, or clean.

### Verification requirements — all five gates

1. Launched by the enabled ten-minute supervisor, **not** manually.
2. While the runner is alive: `RUNNER_RUNNING`, a live `runnerPid`, and a recent timestamp.
3. The terminal heartbeat records the real result and the lock is released.
4. No stale `NOOP` persists across the live run.
5. Evidence recorded in COMMS and the queue reconciled.

### Documentation requirements

One execution/verification COMMS message, plus queue, checkpoint and status reconciliation.

### Checkpoint requirements

Checkpoint after the live observation is captured, and after the terminal state is confirmed —
recording what was observed, not what was expected.

### Stop conditions

STOP and report if the task was not supervisor-started, the heartbeat contradicts the live runner
state, the lock is corrupt or stale, the repository is not at `origin/main`, or progress would
require changing permissions, scheduling, or architecture.

### Recovery procedure

**If the observation fails, do not modify the supervisor to compensate.** Record the exact heartbeat
and log evidence, leave the task IN_PROGRESS with a checkpoint, and await direction. A heartbeat
that fails this test is information, not an inconvenience to be tuned away.

---

## TASK-0019 — Post-WP-0001 repository baseline audit

**Priority:** 1 | **Status:** **COMPLETE** — executed 2026-08-21; success gate met, evidence in MSG-0051 | **Owner:** Claude Code
**Depends on:** TASK-0018 (COMPLETE) | **Next eligible task:** none — nothing follows automatically
**Full specification:** [`TASK-0019-post-wp0001-baseline-audit.md`](TASK-0019-post-wp0001-baseline-audit.md)
**Checkpoint:** [`checkpoints/TASK-0019.md`](checkpoints/TASK-0019.md)

### TASK-0019 — result

**COMPLETE, 2026-08-21.** Started by the Supervisor on its scheduled cycle (`CYCLE_START` 06:37:13Z,
`FAST_FORWARDED` to `39eabdb`, `RUNNER_STARTED pid=22452 task=TASK-0019`), with the logged prompt
verbatim identical to the one this session received. Evidence: **MSG-0051**;
`checkpoints/TASK-0019.md`.

**The finding in one line: the substantive record is sound, and the indexes that point at it are
not.** Every blocker, discovery, message and task record carries a correct, unambiguous status. Six
*summary and index* locations did not — one of them contradicting itself inside a single file.

**Six corrections applied**, each traceable to an existing authoritative record and additive where
the superseded text was worth keeping:

| # | Location | Drift | Authority |
|---|---|---|---|
| A1 | `comms/README.md` | MSG-0046 (a), MSG-0046 (b) and MSG-0050 had **no register row** | the files; the ledger below; charter §5 |
| A2 | this file | Board said TASK-0018 COMPLETE, detail section said IN_PROGRESS | MSG-0049 addendum; MSG-0050 |
| A3 | this file's ledger | MSG-0045 shown OPEN; MSG-0046 shown as one row for two files | the record files; MSG-0035 decision 2 |
| A4 | `status/current.md` | Four messages shown **CLOSED** in a table sitting below the words "No message carries `Status: OPEN`" — plus four other stale statements | all 54 `MSG-*.md` status lines, read directly |
| A5 | `ROADMAP.md` §K | Supervisor described as "NOT installed and NOT enabled" | MSG-0024, MSG-0026, MSG-0047 |
| A6 | `reports/README.md` | WP-0001 shown "PARTIAL — see BLK-0001" | MSG-0022 / MSG-0023; BLK-0001 RESOLVED |
| A7 | `checkpoints/TASK-0018.md` | Ended with the task IN_PROGRESS | MSG-0049 addendum |

**Four record classes were verified already correct** and left alone: the blocker index (5/5), the
discovery index (9/9), the ADR set, and the message files' own statuses — **zero OPEN**, confirmed by
reading all 54 rather than trusting any index.

**The stop condition fired once, and was obeyed.** At the time of the audit,
`docs/program/work-packages/WP-0001-kernel-foundation.md`
still read `**Status:** Ready for implementation` while MSG-0022 / MSG-0023 declared WP-0001 COMPLETE.
**Resolved 2026-08-21 by MSG-0052 C1** — the work package now reads `Status: COMPLETE`.
That is a conflict between accepted work-package authority and current state, so the correction was
**deliberately not made** and is referred to the architecture lead as MSG-0051 §C1. Two further
governance files (`CLAUDE.md`, `ARCHITECTURE-LEAD-CONTEXT.md`) carry stale current-state claims and
were likewise reported rather than amended.

**Seven items are referred for decision in MSG-0051 §C. None was self-authorized**, including the
question of what work comes next: `ROADMAP.md` is WP-0001-scoped and discharged, and no post-WP-0001
roadmap exists.

### Authorization / scope

MSG-0050 is the existing Architecture Lead authorization. No duplicate task or authorization is created.
TASK-0019 is maintenance/audit only. It does not authorize new product architecture, implementation,
work packages, features, Supervisor changes, permissions, scheduling, credentials, infrastructure, or
host changes.

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | Architecture lead authorization | **MET** — MSG-0050 |
| P2 | TASK-0018 COMPLETE | **MET** — all five gates, MSG-0049 |

### Allowed actions

Read and compare the authoritative queue, ROADMAP, current status, COMMS register/messages, blocker
index/records, discovery index/records, checkpoints, and accepted ADR/work-package records. Classify
contradictions, stale status, missing index entries, duplicate identifiers, unresolved decision
requests, and references to completed work. Make only documentary/index corrections whose correct value
is directly established by existing authority and requires no architecture judgment. Create exactly one
TASK-0019 execution/audit COMMS record using the next valid message number. Update required queue,
status, and checkpoint documentation. Commit and push the result.

### Forbidden actions

- No product, database, compose, Supervisor code/configuration, scheduling, permission, credential,
  infrastructure, or host changes.
- No new architecture, ADR, work package, feature scope, or product task authorization.
- No destructive commands, repository reset/clean, force push, privilege escalation, or manual Supervisor trigger.
- Do not rewrite historical evidence merely because a later record superseded it; use additive corrections.
- Do not resolve substantive conflicts requiring Architecture Lead judgment; report them instead.

### Success gate

TASK-0019 is COMPLETE only when the audit covers all specified authoritative record classes, every
finding is classified as documentary drift/superseded history/architecture decision required, safe
corrections are evidenced, exactly one execution/audit COMMS record gives the Architecture Lead a
prioritized list of legitimate next actions without self-authorizing them, and the queue/result are
pushed to `origin/main`.

### Stop condition

If the audit finds a material conflict between accepted architecture/work-package authority and
current repository state, or any correction would require choosing between competing substantive
interpretations, STOP that correction, preserve the evidence, record the conflict in COMMS, and leave
the decision to the Architecture Lead.

### Recovery

Record progress in `implementation/operations/checkpoints/TASK-0019.md`. On restart, verify existing
commits and records before repeating any operation.

---

## TASK-0021 — Employee policy assistant: architecture definition

**Priority:** 1 | **Status:** **COMPLETE** — executed 2026-08-21; all eleven acceptance criteria met, evidence in MSG-0055 | **Owner:** Claude Code
**Depends on:** WP-0001 COMPLETE | **Next eligible task:** none — the work package itself is not authorized
**Full specification:** [`TASK-0021-employee-policy-assistant-architecture-definition.md`](TASK-0021-employee-policy-assistant-architecture-definition.md)
**Checkpoint:** [`checkpoints/TASK-0021.md`](checkpoints/TASK-0021.md)

### TASK-0021 — result

**COMPLETE, 2026-08-21.** Started by the Supervisor on its own cycle (`CYCLE_START` 11:05:47Z,
`RUNNER_STARTED pid=26508 task=TASK-0021`), with the logged prompt verbatim identical to the one the
session received. Evidence: **MSG-0055**; `checkpoints/TASK-0021.md`.

**Delivered** — four PROPOSED records under [`../architecture/`](../architecture/README.md), carrying
no architectural authority:

| File | Contents |
|---|---|
| `EPA-0001` | Architecture definition: scope boundary, document authority and lifecycle, components and data flow, the grounded-answer contract, bilingual behaviour, four-point authorization, threat model T1–T11, frontend responsibilities, audit and retention, operational architecture, conflict check against every accepted document it touches |
| `EPA-0002` | Proposed work package: scope/non-scope, data contracts, interfaces, gates G1–G11, prerequisites, task sequence T-A…T-I. **Written in the conditional; authorizes nothing** |
| `EPA-0003` | **Fourteen open architecture-lead decisions**, each with options, consequences and a recommendation |

**The finding in one line: the boundary is definable from existing authority, and the one genuine
authority vacuum is bilingual policy semantics.** A search of `docs/` and the Constitution for
language/Arabic/bilingual/localization returns a single relevant line — SPEC-0016's notification
templates. Everything else instantiates SPEC-0011/0013/0014/0015/0031, ADR-0016 and ADR-0003 under a
stricter contract; EPA-0001 §12 names the five things that are genuinely new so review effort lands
in the right place.

**No stop condition fired**, and all three were checked explicitly (MSG-0055 §6). Repository authority
was sufficient; **no accepted ADR conflicts** — three areas are *stricter* than the accepted baseline,
which under the authority hierarchy is not a contradiction, and is flagged as decision D12 anyway; and
no decision required inventing product scope, because none was made.

**Nothing was verified by execution.** This was a definition task and produced no runnable artifact,
so there is no test count to report. Its acceptance criteria are documentary and each is mapped to its
evidence in MSG-0055 §9.

**Three observations, none requesting action** (MSG-0055 §7): the work-package registers already
disagree about WP-0001/WP-0002 so **EPA-0002 allocates no number**; MSG-0054's proposed task order
builds the answer path before retrieval-time authorization, which was **followed as issued** with a
mitigation offered rather than a reordering made; and the COMMS register lag recurred — MSG-0054 had
no register row — and was corrected in the same commit.

### TASK-0021 — authorization (as issued)

### Objective

Turn the new product objective — an employee-facing assistant answering only from approved
organizational policy, in English and Arabic, with authoritative citations and fail-closed
abstention — into a decision-ready architecture specification. **Definition only.**

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | Architecture lead authorization | **MET** — MSG-0054 |
| P2 | WP-0001 COMPLETE | MET — TASK-0009, MSG-0022 / MSG-0023 |
| P3 | This objective recognised as outside WP-0001 | MET — MSG-0054 ruling |

### Allowed actions

Define, at architecture level only: approved-document authority and lifecycle; ingestion,
normalization, chunking and provenance; retrieval and grounded QA with citation, abstention and
prompt-injection defence; English/Arabic behaviour including cross-language retrieval; authorization
and confidentiality enforced at retrieval time; auditability and retention; frontend
responsibilities; PCI kernel integration boundaries; required ADRs, threat decisions, data
contracts, interfaces and acceptance gates. Produce one architecture-definition COMMS record plus
the repository documentation that makes the next work package unambiguous.

### Forbidden actions

- **No product implementation** — no ingestion, retrieval, LLM, frontend, or schema migration code.
- No credentials, no external model-service registration.
- No supervisor configuration, scheduling, or permission changes.
- No change to accepted WP-0001 architecture, the `/data` boundary, or existing fail-closed controls.
- **No authorization of downstream implementation tasks** — the work package is not yet authorized.

### Verification requirements

All eleven acceptance criteria in the specification, notably: the objective is established as
**outside WP-0001**; the grounded-answer contract prevents unsupported policy claims and requires
authoritative citations; English and Arabic behaviour is explicit including cross-language
boundaries; authorization is enforced **at retrieval time, not only at the frontend**; audit and
retention are defined without exposing unnecessary sensitive content; prompt injection and
exfiltration through documents are addressed; and unresolved substantive choices are **recorded as
architecture-lead decisions rather than guessed**.

### Documentation requirements

One architecture-definition COMMS record; supporting repository documentation; queue, checkpoint and
status reconciliation. Commit and push before reporting completion.

### Checkpoint requirements

Checkpoint after the scope boundary and document-authority model are settled, and again before the
final record is committed — recording what was decided and what was deliberately left open.

### Stop conditions

Stop and record if repository authority is insufficient to define a safe boundary, if an accepted
ADR conflicts materially with the proposed architecture, or if a decision would require **inventing
product scope the objective did not supply**. Guessing scope is the failure mode this task most
needs to avoid: an architecture invented to fill a silence is harder to unpick than an open question.

### Recovery procedure

The work is documentary. On resumption, re-read MSG-0054 and the specification before continuing,
and check which sections already exist rather than rewriting them — a half-written architecture
record is easy to duplicate and hard to reconcile.

---

## TASK-0022 — Employee policy assistant: work-package definition

**Priority:** 1 | **Status:** **COMPLETE** (2026-08-21) — the deliverable is **PROPOSED** and awaits the Architecture Lead's acceptance | **Owner:** Claude Code
**Depends on:** TASK-0021 COMPLETE; MSG-0058 DECIDED (F1-F4); MSG-0059 (authorization)
**Delivered:** [`EPA-0004`](../architecture/EPA-0004-employee-policy-assistant-work-package-definition.md) | **Execution record:** [`MSG-0061`](../comms/MSG-0061-task-0022-execution-record.md)
**Next eligible task:** none — the Architecture Lead must accept this task's output before any implementation task is authorized

> **Executed 2026-08-21 by a supervisor-started session.** Both specification files were read; the
> requirements below are the union and every one is mapped to its evidence in MSG-0061 §2. The task
> produced **no test count**, as its verification section requires, and none is claimed. **No task was
> marked READY**, and seven decisions are referred to the lead in MSG-0061 §7. The requirements below
> are retained unchanged as the specification that was executed against.

**Full specification — TWO files, both authoritative, read BOTH:**

- [`TASK-0022-employee-policy-assistant-work-package-definition.md`](TASK-0022-employee-policy-assistant-work-package-definition.md) — referred to below as **spec A**
- [`TASK-0022-policy-assistant-work-package-definition.md`](TASK-0022-policy-assistant-work-package-definition.md) — referred to below as **spec B**

> **Why two.** Both were committed by the Architecture Lead on 2026-08-21 (`768300b`, `4fca7fe`) and
> **they agree** — same scope, same authorization, same forbidden list, same acceptance gate — so this
> is not a conflict and no stop condition fired. They are not identical in content: spec A carries the
> stop conditions and the "queue changes as recommendations only" constraint; spec B carries a finer
> ten-item outcome list. **The requirements below are the union of both.** Neither file was renamed,
> per the MSG-0058 F4 ruling that historical records are not renamed. Recorded in MSG-0060.

### Objective

Define the bounded post-WP-0001 work package for the Employee Policy Assistant, using the accepted EPA
architecture decisions (EPA-0001/0002/0003 as ruled by MSG-0056a/b) and the MSG-0058 findings.

**This is architecture/work-package definition only.** It authorizes no implementation.

### Required outputs — the union of both specifications

1. **Work-package scope and boundaries**, covering approved-document management, versioning and
   supersession; ingestion, normalization, provenance and retrieval contracts; grounded English/Arabic
   answering with citation and abstention gates; retrieval-time authorization and confidentiality;
   session-only default retention with configurable retention; authenticated identity via OIDC/OAuth2;
   auditability and security boundaries; the employee-facing frontend contract; and superseded-policy
   handling.
2. **Explicit implementation gates and acceptance criteria**, derived from EPA-0001/EPA-0002/EPA-0003
   and MSG-0056a/b and MSG-0058.
3. **A dependency-ordered implementation task sequence**, with security and architecture checkpoints
   and explicit architecture/operator boundaries.
4. **Test/acceptance gates and threat-model coverage.**
5. **Identification of any remaining genuine architecture decisions.** Do **not** invent decisions that
   are already settled — all fourteen EPA-0003 decisions are ruled, and F1-F4 are ruled by MSG-0058.
6. **A proposed work-package record and execution queue changes as recommendations only.**

### Binding architecture rulings (MSG-0058, MSG-0059)

- **English is authoritative**; Arabic is an approved translation/access language.
- **Cross-language grounding is in scope and fail-closed.** If the Arabic grounding gate fails the
  system must **abstain** — never silently fall back to English, never present an unofficial rendering
  as policy. The Arabic acceptance bar is evaluated separately under SPEC-0020.
- **Unauthenticated access is deferred** from the first release; first release requires authenticated
  identity. No new unauthenticated classification or trust boundary is introduced.
- **Enterprise directory integration terminates at the OIDC/OAuth2 boundary** required by ADR-0007.
  Entra ID, AD FS, or an OIDC/OAuth2 broker may front an existing directory. **Direct LDAP/Kerberos
  authentication implementation is not authorized.**
- **Only approved/published documents are authoritative sources.**
- **Session-only conversation retention is the default**, with configurable retention support.

### Forbidden

- No product or runtime implementation.
- No provider/model selection or external model registration.
- No changes to accepted ADRs.
- No new permissions, security boundaries, Supervisor behaviour, or scheduling changes.
- No credentials or external privileged operations.
- **No implementation task may be marked READY by this task** — queue changes are recommendations only.

### Verification

The definition is complete only when scope, boundaries, acceptance criteria, dependencies, security
gates, and the proposed implementation sequence are documented **and reconciled with the governing
architecture records**. Unresolved decisions must be stated explicitly rather than omitted.

Being documentary, this task produces no test count. Do not report a test result it cannot have; report
each required output against its evidence instead.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md` and this queue, and write the checkpoint. A completely new session
must be able to resume from the repository alone.

### Checkpoint

`implementation/operations/checkpoints/TASK-0022.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one — the TASK-0021 checkpoint recorded a push as successful before
it was attempted, and the push was then rejected (BLK-0006).

### Stop conditions

Stop and report through COMMS if repository authority materially conflicts, if a required architecture
decision is genuinely missing, or if completing the task would require implementation or an
unauthorized architecture change.

**Also stop if `origin/main` moves mid-run.** BLK-0006 is the precedent: the deliverable was pushed,
the Architecture Lead pushed concurrently, and the closeout push was rejected. Stopping was correct.
Record the starting HEAD in checkpoint 1 and re-check it before every push.

### Recovery procedure

The work is documentary. On resumption, re-read MSG-0058, MSG-0059, and **both** specification files
before continuing, and check which sections already exist rather than rewriting them — a half-written
architecture record is easy to duplicate and hard to reconcile.

---

## TASK-0023 — EPA work-package governance reconciliation

**Priority:** 1 | **Status:** **COMPLETE** — executed 2026-08-21; 7/7 acceptance criteria, evidence in MSG-0066 | **Owner:** Claude Code
**Depends on:** TASK-0022 COMPLETE; MSG-0062 DECIDED (EPA-0004 accepted, seven items ruled); MSG-0063 AUTHORIZED
**Delivered:** [`WP-0009 — Employee Policy Assistant`](../../docs/program/work-packages/WP-0009-employee-policy-assistant.md) | **Execution record:** [`MSG-0066`](../comms/MSG-0066-task-0023-execution-record.md)
**Next eligible task:** none — MSG-0063 reserves the next authorization to the Architecture Lead after this task is accepted
**Full specification:** [`TASK-0023-epa-work-package-reconciliation.md`](TASK-0023-epa-work-package-reconciliation.md)
**Checkpoint:** [`checkpoints/TASK-0023.md`](checkpoints/TASK-0023.md)

### TASK-0023 — result

**COMPLETE, 2026-08-21.** Executed by a supervisor-started session; `state/runner.lock` named
`TASK-0023`, pid 27400, acquired 18:04:59Z. Starting HEAD `ad3df56`, re-checked before the commit and
unmoved. Evidence: **MSG-0066**; `checkpoints/TASK-0023.md`.

**The finding in one line: the identifier was the whole difficulty, and it was a trap rather than a
gap.** `WP-0002` has no record in the canonical directory and looks free from a directory listing —
but the planning register has held it as "Repository and Engineering Platform" since it was written.
Allocating it would have produced two different work packages with one number. **WP-0009** is the next
number unused in *either* register, verified by `grep -rn "WP-0009\|WP-0010"` returning nothing before
allocation.

| Criterion (MSG-0063) | Verdict | Where |
|---|---|---|
| 1. EPA-0004 remains the accepted definition | **MET** | `WP-0009` header; EPA-0004 itself unmodified |
| 2. Register discrepancy reconciled, WP-0001 not repurposed | **MET** | `work-packages.md` §0; all eight planning entries verbatim |
| 3. Identifier recorded consistently | **MET** | Record file, register table, DISC-0010 resolution — three places agreeing |
| 4. Six ADRs → explicit sequence, no duplicates, no accepted ADR modified | **MET** | `WP-0009` §7; `docs/decisions/` still ends at ADR-0016 |
| 5. T-0 operator prerequisites separated | **MET** | `WP-0009` §6.1 |
| 6. Dependency ordered; only the next authorized task eligible for READY | **MET** | `WP-0009` §6.2/§6.3; **nothing marked READY** |
| 7. No implementation authorization implied | **MET** | `WP-0009` §9; status line reads NOT AUTHORIZED FOR IMPLEMENTATION |

**No test count is reported. The task is documentary and produces none** — its verification section
forbids claiming one.

**Two deliberate omissions.** **ADR numbers were not allocated**: MSG-0062 §7.2 and this queue section
both place allocation in the drafting task, so the six surfaces are ordered and justified but
unnumbered, with "next free is ADR-0017" recorded as an observation explicitly *not* an allocation.
**No task was marked READY**, including the three architecture tasks the deliverable defines.

**No stop condition fired, and all three were checked.** The authoritative records did not materially
conflict — the register disagreement is a *known, recorded* discrepancy this task was authorized to
reconcile, not a new one. The identifier was allocable without repurposing anything. And no decision
beyond MSG-0062/MSG-0063 was required: where one would have been — the T-D/T-E mitigation, PR3's owner,
which planning entries WP-0009 relates to — it was **carried forward as open rather than decided**
(MSG-0066 §6).

**One process error is disclosed in MSG-0066 §7.3**: the first write of the checkpoint file contained
checkpoints 2 and 3 in anticipation, including a fabricated commit SHA. It was corrected to checkpoint 1
only before anything was staged, so no fabricated value reached a commit. Recorded because the rule it
broke is one this queue has cited against a previous task.

> **One specification file this time**, and MSG-0062/MSG-0063 carry distinct numbers — verified on
> reconciliation. The TASK-0022 union treatment was needed because two files existed; it is not needed
> here. Read the specification **and** MSG-0062 and MSG-0063: the acceptance criteria below come from
> MSG-0063, and the rulings the task must apply come from MSG-0062.

### Objective

Reconcile the **accepted** EPA-0004 work-package definition and the MSG-0062 rulings into the
authoritative governance records. **Architecture and governance only — no implementation.**

### Required work (TASK-0023 specification)

1. Re-read MSG-0062, MSG-0063, EPA-0004, the work-package register, and the existing work-package
   records.
2. **Resolve the WP numbering/register discrepancy explicitly, preserving historical WP-0001** and the
   existing records.
3. Allocate and record the formal work-package identity using the repository's established convention,
   **without inventing or repurposing an existing identifier**.
4. Reconcile the six proposed ADR surfaces into an explicit architecture sequence, **creating no ADRs**
   unless separately authorized.
5. Record **T-0 as an operator-only prerequisite**, kept distinct from Claude-executable work.
6. Produce the dependency-ordered architecture/implementation gate sequence, with the next task
   **identified but not implicitly authorized**.
7. Reconcile COMMS, queue, status, and work-package records consistently.

### Acceptance criteria (MSG-0063)

1. EPA-0004 remains the accepted architecture/work-package definition.
2. The register/directory discrepancy is explicitly reconciled **without repurposing historical WP-0001**.
3. The formal work-package identifier is recorded consistently in the authoritative work-package records.
4. The six ADR recommendations become an explicit proposed/required ADR sequence, **no duplicates and
   no modification of accepted ADRs**.
5. T-0 operator prerequisites, including authenticated IdP deployment, are clearly separated from
   Claude-executable work.
6. The resulting sequence is dependency ordered, with **only the next authorized architecture task
   eligible for READY after queue reconciliation**.
7. **No implementation authorization is implied.**

### Rulings this task must apply (MSG-0062)

- **7.1** — allocate as a **new** work package; **no existing WP number is repurposed**. The identifier
  is allocated by the register reconciliation before implementation authorization.
- **7.2** — create only the ADRs needed to make the accepted architecture enforceable before production:
  the grounded-answer contract, and any new service-boundary/security decisions not already covered.
  **Numbers allocated by repository convention during the next architecture task** — this task defines
  the sequence, it does not create the ADRs.
- **7.3** — **T-D (grounded QA) precedes T-E (retrieval-time authorization).** Authorization controls
  must not be validated against an unproven answer path. Security review remains a gate on the complete
  path before release.
- **7.4** — first release requires an authenticated OIDC/OAuth2 provider; **the platform integrates,
  it does not implement one**. Provider selection and privileged deployment are operator/organization
  actions that must be established before the identity-dependent gates.
- **7.5** — a **bounded corpus survey is authorized before T-B**, as a discovery/architecture input
  only: formats, language mix, scanned-document prevalence, classification/audience patterns,
  version and supersession characteristics. It **must not ingest production content or bypass approval
  controls**.
- **7.6** — Restricted documents **are eligible** for the governed corpus, but **no retrieve-then-suppress
  design is permitted**. A Restricted document is never retrieved into an employee request unless the
  authenticated subject satisfies its authorization policy, and denial must **fail closed without
  revealing existence, content, timing, or result-count**.
- **7.7** — **ADR-0015 is not inherited** as the service stack. The service stays outside the kernel
  boundary and uses accepted platform contracts; a dedicated architecture task proposes the concrete
  stack. **No provider, framework, model, embedding technology, or runtime is selected.**

### Forbidden

- No product or runtime implementation.
- No provider, model, embedding, framework, or runtime selection.
- No permission or security-boundary changes.
- No Supervisor behaviour or scheduling changes.
- **No creation or modification of accepted ADRs.**
- No operator-only action, credential access, or privileged host operation.
- **Do not mark any downstream implementation task READY.**

### Verification

Complete only when the authoritative work-package records, COMMS, queue, and status **agree**; the
formal work-package identity is established **without historical collision**; the ADR sequence is
explicit; T-0 is identified as operator-only; and no implementation authorization has been implied.

Being documentary, this task produces **no test count**. Do not report a test result it cannot have —
map each acceptance criterion to re-readable evidence instead.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and the work-package records, and write the checkpoint.
A completely new session must be able to resume from the repository alone.

### Checkpoint

`implementation/operations/checkpoints/TASK-0023.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one.

### Stop conditions

Stop and record COMMS if the authoritative records materially conflict, if a work-package identifier
**cannot be allocated without repurposing an existing identifier**, or if completing the task would
require an architecture decision beyond MSG-0062/MSG-0063.

**Also stop if `origin/main` moves mid-run.** BLK-0006 is the precedent, and the Architecture Lead has
pushed concurrently during three of the last four tasks. Record the starting HEAD in checkpoint 1 and
re-check it before every push.

> **Known runner limit, not a defect to route around.** `git fetch` is off the runner allowlist, so a
> mid-run move by the lead is detectable only when a push is rejected. Both TASK-0022 and BLK-0006
> record this. Do not attempt to work around it; record it and stop if a push is rejected.

### Recovery procedure

The work is documentary. On resumption, re-read MSG-0062, MSG-0063, EPA-0004 and the specification,
and check which records already exist rather than rewriting them — governance records are easy to
duplicate and hard to reconcile, which is the exact failure this task exists to fix.

---

## TASK-0024 — A-ADR: draft the required Employee Policy Assistant ADR set

### Result — COMPLETE, 2026-08-21

**Six PROPOSED ADR drafts delivered: ADR-0017…ADR-0022** in `implementation/decisions/`, one per
WP-0009 §7 surface. All eight acceptance criteria met with evidence in **MSG-0070** §2. Checkpoints 1–3
in [`checkpoints/TASK-0024.md`](checkpoints/TASK-0024.md).

**No stop condition fired.** The task's stop conditions were checked, not assumed: no unresolved
architecture conflict was found; `origin/main` did not move (starting HEAD `850a9b1` re-verified
immediately before the push); no required decision was missing; and nothing in the work required
implementation or an unauthorized architecture change. **MSG-0070 §7 records the one thing that looked
like a conflict and was not** — the accepted classification standard's Restricted rule is conditional
rather than absolute, which *removes* an apparent tension with MSG-0062 §7.6 instead of creating one.

**The specification below is the authorization as issued, retained unchanged.**

---

**Priority:** 1 | **Status:** **COMPLETE** — see *Result* above | **Owner:** Claude Code
**Depends on:** TASK-0023 COMPLETE; MSG-0062 DECIDED; MSG-0067 DECIDED; WP-0009 defined and not implementation-authorized
**Next eligible task:** none — T-A remains unauthorized and this task may not authorize it
**Work package:** WP-0009 — Employee Policy Assistant | **Architecture task:** A-ADR

**Specification — FOUR documents, all authoritative, read ALL of them:**

- [`TASK-0024-epa-adr-drafting.md`](TASK-0024-epa-adr-drafting.md) — **spec A**
- [`TASK-0024-a-adr.md`](TASK-0024-a-adr.md) — **spec B**
- [`MSG-0068-task-0024-authorization-epa-adr-drafting.md`](../comms/MSG-0068-task-0024-authorization-epa-adr-drafting.md) — **MSG-0068a**
- [`MSG-0068-task-0024-a-adr-authorization.md`](../comms/MSG-0068-task-0024-a-adr-authorization.md) — **MSG-0068b**

> **Why four.** Two specification files and two authorization messages were committed for this one
> task. **They agree** — same objective, same six surfaces, same forbidden list, same rule that ADR
> numbers are allocated at drafting time from the repository's actual state — so no stop condition
> fired. They differ in content, so **everything below is the union.** Nothing was renamed, per
> MSG-0058 F4. See MSG-0069.

### Objective

Draft the **minimal** set of new ADRs required to make the accepted WP-0009 architecture enforceable
before implementation, **without duplicating or modifying accepted ADRs**.

### Required inputs

WP-0009; EPA-0004 as accepted by MSG-0062; the MSG-0067 rulings; the existing accepted ADR register;
and the repository's ADR numbering convention.

### Required work

1. **Identify accepted ADRs that already govern the relevant boundaries** — reuse before creating.
2. Determine the minimal required new ADR surfaces from **WP-0009 §7.2**, judged against MSG-0062 §7.2.
3. **Decide, per surface, whether a new ADR is genuinely required, and document the rationale either
   way.** Evidence must identify every ADR created **or explicitly explain why a surface needs none**.
4. Draft the required ADRs, allocating numbers **at drafting time** by repository convention, verified
   collision-free against the actual ADR state.
5. **Trace every new decision to accepted authority.**
6. **Record any genuine unresolved architecture issue rather than inventing a ruling.**
7. Create one execution COMMS record and reconcile the queue and status evidence.

### The six candidate surfaces (WP-0009 §7)

Grounded Answer Contract · Approved Document Authority and Lifecycle · Bilingual Policy Semantics
(English/Arabic) · Retrieval Projection and Index Boundary · Employee Question Privacy and Retention ·
Inference Locality and Provider Boundary.

**These are proposed surfaces, not pre-authorized ADR numbers.** The final allocation comes from the
repository's actual ADR state.

### Boundaries that must be preserved (MSG-0068b, MSG-0067, MSG-0062)

- **ADR-0007 / OIDC-OAuth2 identity boundary** — PCI integrates an identity provider and never builds
  one; **no direct LDAP/Kerberos**, per MSG-0067 §2.
- **T-D precedes T-E**, and the MSG-0067 §1 interim constraint holds: **T-D testing only against
  synthetic or otherwise non-confidential documents.** No real or confidential corpus may enter the
  T-D path until T-E retrieval-time authorization is implemented **and verified**.
- **No retrieve-then-suppress.** A Restricted document is never retrieved into a request unless the
  authenticated subject satisfies its policy; denial fails closed without revealing existence,
  content, timing, or result-count.
- **English authority, Arabic approved translation**, with cross-language grounding **fail-closed** —
  a failed Arabic gate abstains.
- **Session-default question retention, employee-only conversation access.**
- **Inference locality / provider boundary** — external inference prohibited by default.

### Forbidden

- No implementation, and no product or runtime work of any kind.
- No provider, model, embedding, framework, runtime, or stack selection.
- **No production corpus ingestion.**
- No permission or security-boundary changes.
- No Supervisor behaviour or scheduling changes.
- No operator-only or privileged action.
- **Do not modify accepted ADRs. Do not create duplicate ADRs.**
- **Do not mark T-A, T-B, T-C, T-D, T-E, or any other implementation task READY.**

### Acceptance criteria (union of spec A, spec B, MSG-0068b)

1. Existing accepted ADRs are identified, verified, and **neither duplicated nor modified**.
2. The minimal new ADR set is **justified against WP-0009 §7.2**.
3. New ADR numbers follow repository convention and are **collision-free** against existing ADRs.
4. Each drafted ADR is **traceable to accepted authority** (EPA-0004 / WP-0009 / MSG-0062 / MSG-0067).
5. Draft ADRs are internally consistent with MSG-0062, MSG-0067, EPA-0004, and WP-0009.
6. **No implementation is authorized or performed**, and none is implied.
7. Evidence identifies **every ADR created, or explains why a surface needs no new ADR**.
8. The resulting ADR set is committed and recorded in COMMS.

### Verification

Being documentary, this task produces **no test count**. Do not report a test result it cannot have —
map each acceptance criterion to re-readable evidence instead.

**Check ADR number collisions against the actual repository state**, not against a remembered list.
Four message numbers and two task specifications have collided in this project already; an ADR
collision would be worse, because ADRs are cited as authority.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and WP-0009's architecture-task status, and write the
checkpoint. A completely new session must be able to resume from the repository alone.

### Checkpoint

`implementation/operations/checkpoints/TASK-0024.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one.

### Stop conditions

**Stop and report through COMMS if an architecture conflict is discovered that cannot be resolved from
existing authority. Do not improvise** (spec A; MSG-0068a). Stop also if a required decision is
genuinely missing, or if completing the task would require implementation or an unauthorized
architecture change.

**Also stop if `origin/main` moves mid-run.** BLK-0006 is the precedent and the Architecture Lead has
pushed concurrently during several recent tasks. Record the starting HEAD in checkpoint 1 and re-check
it before every push.

> **Known runner limit.** `git fetch` is off the runner allowlist, so a mid-run move is detectable only
> when a push is rejected. Record it and stop; do not route around it.

### Recovery procedure

The work is documentary. On resumption, re-read MSG-0067, **both** MSG-0068 files, **both**
specification files, and WP-0009 §7, then check which ADRs already exist before drafting anything —
a half-written ADR set is easy to duplicate and hard to reconcile.

---

## TASK-0025 — promote ADR-0018 … ADR-0022 into the accepted decision register

**Priority:** 1 | **Status:** **COMPLETE** — see the summary row above, which has said COMPLETE throughout; record **MSG-0074** | **Owner:** Claude Code

> **Corrected 2026-08-25 (MSG-0162).** Stale `READY` header on a finished task, same defect class as TASK-0041/0042/0045/0046. **The summary row is authoritative and did not change; nothing this task measured or concluded changes.**
**Depends on:** TASK-0024 COMPLETE; MSG-0071 DECIDED (all six ADRs accepted); MSG-0073 AUTHORIZED
**Next eligible task:** none — A-SURVEY and A-STACK remain unauthorized
**Work package:** WP-0009 — Employee Policy Assistant

**Specification:** [`MSG-0073-task-0025-adr-promotion-authorization.md`](../comms/MSG-0073-task-0025-adr-promotion-authorization.md)
**plus this section.** There is **no separate `TASK-0025-*.md` file** — unusually for this queue, and
deliberately noted so a runner does not go looking for one or assume something is missing.

### Objective

Promote **ADR-0018, ADR-0019, ADR-0020, ADR-0021 and ADR-0022** from their accepted drafts in
`implementation/decisions/` into `docs/decisions/`, the authoritative register, **preserving approved
content, numbering, traceability, and explicit non-decisions**.

**ADR-0017 is already promoted** — by the Architecture Lead, in `d9c4524`. Do not re-promote it, do not
alter it, and do not treat its presence as an error.

### The established convention — follow it exactly

Verified from the ADR-0015 precedent and the lead's own ADR-0017 promotion:

**1. The promoted copy** at `docs/decisions/ADR-00NN-<same-slug>.md`:

- **same filename** as the draft — the slug does not change;
- `**Status:** **ACCEPTED** — promoted from `implementation/decisions/ADR-00NN-<slug>.md` (PROPOSED) by MSG-0071`;
- add an `**Accepted by:** Architecture Lead — MSG-0071` line after `**Proposed by:**`;
- **every other header line and the entire body carried over unchanged in substance.**

**2. The draft copy** at `implementation/decisions/ADR-00NN-<slug>.md`:

- `**Status:** **RATIFIED** 2026-08-21 — accepted by MSG-0071 and promoted to `docs/decisions/…`, which is the authoritative copy. The proposed text below is retained unchanged as the historical record.`
- **the proposed text itself is retained unchanged.** Do not edit the body.

**3. The index** `implementation/decisions/README.md`: change each row from *awaiting promotion* to
**promoted**, naming the accepted path — matching the ADR-0017 row already there.

### Constraints (MSG-0073)

- **Do not change the substance of the accepted ADR decisions.**
- **Do not introduce provider, model, framework, runtime, or implementation selections that remain
  deliberately open.** ADR-0022 cites Ollama from ADR-0003 and explicitly declines to select it —
  that wording is load-bearing and must survive promotion intact.
- **Do not alter ADR-0019's normalization rules.** They stay deferred to empirical corpus evidence,
  and no invented rule is authorized. ADR-0019 must still say it is incomplete for production by
  design.
- **Do not authorize implementation.**
- **Do not mark A-SURVEY, A-STACK, or T-0 READY.**
- **Verify every promoted ADR against its source before reporting completion.**

### Acceptance criteria (MSG-0073)

1. ADR-0018, ADR-0019, ADR-0020, ADR-0021 and ADR-0022 each exist in `docs/decisions/` using the
   repository's established ADR convention.
2. Promoted records preserve the accepted decision content and traceability.
3. No implementation authorization is introduced.
4. COMMS and queue records are updated consistently.
5. **TASK-0025 is reported COMPLETE only after repository verification.**

### Verification — and what "verify against source" must mean here

A `diff` between each promoted copy and its draft should show **only** the intended header changes:
the `Status` line and the added `Accepted by` line. **Any body difference is a defect**, not a
formatting preference — these records are cited as authority, and a silent edit during promotion is
the specific failure this step exists to prevent.

State the diff result per ADR. Being documentary, this task produces **no test count**; do not report
one it cannot have.

**Also confirm** the three conditions MSG-0071 attached still hold in the promoted copies: no
provider/model/runtime selection, ADR-0019's normalization still deferred, and ADR-0017's entailment
model and thresholds still open under SPEC-0020. MSG-0072's pre-promotion pass verified these in the
drafts; the point of re-checking is that promotion is where they could be lost.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, the ADR index, and WP-0009 where it tracks ADR status.
Write the checkpoint. A completely new session must be able to resume from the repository alone.

### Checkpoint

`implementation/operations/checkpoints/TASK-0025.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one.

### Stop conditions

Stop and record COMMS if a draft's content conflicts with what MSG-0071 accepted, if promoting would
require resolving something the lead deliberately left open, or if any accepted ADR in `docs/` would
have to be modified.

**Also stop if `origin/main` moves mid-run** — BLK-0006 is the precedent. Record the starting HEAD in
checkpoint 1 and re-check before every push.

> **Known runner limit.** `git fetch` is off the runner allowlist, so a mid-run move is detectable only
> when a push is rejected. Record it and stop; do not route around it.

### Recovery procedure

**Check which ADRs already exist in `docs/decisions/` before writing anything.** ADR-0017 is already
there legitimately; a resumed session that assumes an empty target could overwrite a promoted record
or double-promote. Promotion is idempotent only if you look first.

---

## TASK-0026 — A-SURVEY (bounded corpus survey) and A-STACK (stack evaluation)

**Priority:** 1 | **Status:** **COMPLETE (PARTIAL)** — executed 2026-08-22; record **MSG-0078** | **Owner:** Claude Code
**Depends on:** TASK-0025 COMPLETE; MSG-0071 DECIDED and the ADR set promoted; MSG-0076 AUTHORIZED
**Next eligible task:** none — implementation stays unauthorized

> **Result:** **A-STACK COMPLETE** → [`EPA-0005`](../architecture/EPA-0005-assistant-stack-evaluation.md),
> PROPOSED, selecting nothing. **A-SURVEY NOT PERFORMED** — prerequisite **PR5 UNMET**, re-verified by
> inspection. **5 of 6 acceptance criteria MET; criterion 1 UNMET.** No accepted ADR modified
> (`git diff --name-only docs/decisions/` empty), **no ADR created**, **no task marked READY**, no
> corpus figure produced. The section below is retained **as issued** — it is the specification this
> task was executed against, and MSG-0078 §2 maps each criterion to its evidence.
**Work package:** WP-0009 — Employee Policy Assistant | **Architecture tasks:** A-SURVEY, A-STACK

**Specification:** [`MSG-0076-next-architecture-task-authorization.md`](../comms/MSG-0076-next-architecture-task-authorization.md)
**plus this section.** No separate `TASK-0026-*.md` file exists — as with TASK-0025, that is deliberate
and not a missing file. **TASK-0026 is an id allocated during reconciliation**, verified unused;
MSG-0076 assigns none.

---

### ⚠ Read this before starting A-SURVEY

**A-SURVEY's prerequisite is NOT met, and the task must not paper over it.**

MSG-0076 asks A-SURVEY to "inspect representative approved policy material" and record **formats,
language mix, scanned-document prevalence, classification/audience patterns, and version/supersession
characteristics**.

**No such corpus is reachable from this repository.** Verified at reconciliation time, not assumed:

```text
$ find . -iname "*.pdf" -o -iname "*.docx" -o -iname "*policy*"   (excluding .md, .git)
  ./services/kernel/src/adapters/policy            <- kernel source, not policy documents
  ./services/kernel/src/ports/policy.ts
  ...
```

The authoritative records agree and have said so all along:

- **WP-0009 §6.1** — "PR5 (the corpus) is the **organization's**" prerequisite.
- **EPA-0004 §11.5 / PR5** — "A real approved policy corpus available for ingestion and gate
  evaluation — **UNKNOWN — not visible from the repository** — Organization".
- **MSG-0061 §7.5** — "**No survey was performed or scheduled.**"

**Required behaviour:**

1. **Establish first, by inspection, whether any corpus is actually reachable.** Do not infer it from
   this entry — if the operator has since supplied material, that changes the answer, and this text was
   written before they could have.
2. **If none is reachable: stop A-SURVEY at that prerequisite and record it.** Produce **no** figures,
   **no** format breakdown, **no** language mix, **no** scanned-document prevalence, and **no**
   classification patterns. Not as estimates, not as illustrations, not as "expected" values.
3. **Do not substitute a survey method, template, or plan for the authorized output** unless the
   Architecture Lead authorizes that separately. It would be scope invention, and a method document is
   easy to mistake later for a completed survey.
4. **Complete A-STACK regardless** — it has no such dependency — and report the task as **PARTIAL**,
   naming A-SURVEY and MSG-0076 acceptance criterion 1 as the unmet part and PR5 as the reason.

**Why this is spelled out at length.** A survey with no corpus is the single most inviting place in
this work package to produce confident, plausible, invented findings — and those findings would feed
D6 normalization, D14's scanned-document ruling, and ADR-0019. **Fabricated survey data would corrupt
accepted architecture.** Partial completion, reported honestly, costs nothing by comparison.

---

### A-STACK — executable now

**Objective.** Evaluate candidate service-stack approaches against the accepted platform contracts and
the EPA ADR set, and produce **either** an evidence-based recommendation **or** an explicit record of
why selection remains open.

**Inputs, all present in the repository:** `docs/architecture/technology-selection-principles.md`; the
six accepted ADRs `docs/decisions/ADR-0017 … ADR-0022`; WP-0009 (especially §6.2 and §7); EPA-0004;
and the accepted ADR register generally.

**Binding constraints it must respect:**

- **MSG-0062 §7.7 — ADR-0015 is NOT inherited.** The service sits outside the kernel boundary and uses
  accepted platform contracts. A-STACK proposes; it does not adopt the kernel stack by default.
- **ADR-0022 — inference locality.** External inference is prohibited by default; the ADR selects no
  model, runtime, embedding model, or serving technology, and A-STACK must not quietly do so on its
  behalf.
- **ADR-0007 — identity terminates at the OIDC/OAuth2 boundary.** No direct LDAP or Kerberos.
- **ADR-0020 — no retrieve-then-suppress**, fail-closed without existence, timing, or result-count
  side channels.
- **ADR-0019 — Arabic normalization stays deferred** to empirical corpus evidence.

**Evaluate, do not select.** MSG-0076 is explicit: "Do not select or authorize a provider, framework,
model, embedding technology, or runtime." A recommendation is permitted; an authorization is not. Where
evidence is insufficient, **record that selection remains open and say what evidence would close it** —
several of those gaps depend on the corpus survey that cannot run yet, and saying so is a result.

---

### Constraints on the whole task (MSG-0076)

- **No production corpus ingestion.** No implementation. No identity-provider implementation or
  provider selection.
- **Preserve ADR-0017 … ADR-0022 exactly as accepted.** No accepted ADR may be modified — they are now
  in `docs/decisions/` and carry authority.
- **Do not invent ADR-0019 Arabic normalization rules.**
- **Do not introduce retrieve-then-suppress behaviour.**
- **Do not mark T-A, T-B, T-D, T-E, or T-0 READY.**
- Architecture work only; it authorizes no implementation.

### Acceptance criteria (MSG-0076)

1. A bounded corpus-survey record documents the required empirical observations without production
   ingestion. **Expected UNMET — see the prerequisite warning above. Report it unmet with the reason;
   do not manufacture observations to satisfy it.**
2. A stack-evaluation record maps candidate approaches to the accepted EPA constraints and explicitly
   preserves open selections.
3. No accepted ADR is modified.
4. No implementation task is marked READY.
5. COMMS and the queue are reconciled consistently before execution.
6. **Execution is reported complete only after repository verification.**

### Verification

Being documentary, this task produces **no test count**; do not report one it cannot have. Map each
criterion to re-readable evidence, and state plainly which are MET, UNMET, and why.

**Confirm before reporting:** `git diff --name-only docs/decisions/` is **empty** — no accepted ADR was
touched — and no board row gained READY status.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and WP-0009 §6.2 where it tracks A-SURVEY and A-STACK.
Write the checkpoint. A completely new session must be able to resume from the repository alone.

### Checkpoint

`implementation/operations/checkpoints/TASK-0026.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one.

### Stop conditions

- **A-SURVEY's corpus prerequisite is unmet** — stop that half, record, and continue with A-STACK.
- Any conflict between the accepted ADR set and what the task would need to conclude.
- Any point where completing an output would require selecting a provider, framework, model, embedding
  technology, or runtime.
- **`origin/main` moving mid-run** — BLK-0006 is the precedent. Record the starting HEAD in checkpoint 1
  and re-check before every push.

> **Known runner limit.** `git fetch` is off the runner allowlist, so a mid-run move is detectable only
> when a push is rejected. Record it and stop; do not route around it.

### Recovery procedure

On resumption, re-read MSG-0076 and this section, then **re-check the corpus question by inspection**
before assuming either answer — the operator may have supplied material in the interval. Check which
records already exist rather than rewriting them.

---

## TASK-0027 — A-SURVEY (n=1): inspect the approved/synthetic corpus

**Priority:** 1 | **Status:** **COMPLETE** — see the summary row above, which has said COMPLETE throughout; record **MSG-0085**/**MSG-0087** | **Owner:** Claude Code

> **Corrected 2026-08-25 (MSG-0162).** Stale `READY` header on a finished task, same defect class as TASK-0041/0042/0045/0046. **The summary row is authoritative and did not change; nothing this task measured or concluded changes.**
**Depends on:** TASK-0026 COMPLETE (PARTIAL); MSG-0076; MSG-0080 AUTHORIZED; the corpus present at its external path
**Next eligible task:** none — implementation stays unauthorized
**Work package:** WP-0009 — Employee Policy Assistant | **Architecture task:** A-SURVEY (bounded follow-up)

**Specification:** [`MSG-0080-a-survey-authorization.md`](../comms/MSG-0080-a-survey-authorization.md)
**plus this section.** No separate `TASK-0027-*.md` file exists — deliberate, as with TASK-0025 and
TASK-0026. **TASK-0027 is an id allocated at reconciliation**, verified unused; MSG-0080 assigns none.

### The corpus, and the one rule that must not be broken

```text
D:\Work\pci-corpus\plan.pdf        626.8 KB      header %PDF-1.7
```

**It is outside the repository on purpose and must stay outside.** MSG-0080: it "must remain outside
the repository and must not be copied, staged, committed, or otherwise added to repository history."

**Read it in place. Do not copy it into the working tree** — not to a temp folder inside the repo, not
"just to inspect it", not even briefly. If a scratch working copy is genuinely needed, use the session
scratchpad outside the repository.

> **Why this is stated so firmly.** The file first arrived at `D:\Work\pci-platform\plan.pdf` — inside
> the working tree, untracked and **not** covered by `.gitignore`. Every COMMS cycle and every runner
> executes `git add -A`, so the next commit would have put 627 KB of corpus into permanent history,
> removable only by rewriting published history. It was moved out before anything staged it. **The
> hazard is real and has already happened once.**


### ⚠ A permission constraint that may prevent unattended execution

**BLK-0009 observed, in a real supervisor-started session, that a read of the corpus directory was
requested and refused:** *"a read of that directory was requested and the permission was not granted,
and it was not routed around."*

That is a structural tension, not a bug:

- **MSG-0080 requires the corpus to stay outside the repository** — it must not be copied, staged, or
  committed.
- **The unattended runner's permission boundary is the repository.** `runner-settings.json` grants no
  read access outside it.

**So the corpus is deliberately in the one place the runner may not be able to read.**

**If the read is denied, stop and record it. Do not:**

- copy the PDF into the repository to make it readable — that breaks MSG-0080's standing constraint and
  recreates the near-miss BLK-0008 records;
- edit `runner-settings.json` or any permission setting — no authorization exists, and weakening the
  boundary to complete a task is exactly what the boundary is for;
- infer the document's properties from its filename, size, or any other proxy.

**Report the task blocked on the permission boundary and stop.** MSG-0082 puts the choice to the
Architecture Lead and the operator: grant a narrow read permission for `D:\Work\pci-corpus\`, or run
this one task interactively where reads outside the working directory are available. **Neither is
Claude's to choose.**

### Objective

Inspect the single available PDF and record **document-level** observations, with the sample size
stated as **n=1** and the distinction between what one document can and cannot establish made
explicit. This is an **architecture input only**.

### What n=1 CAN establish (MSG-0080)

- whether **this document** is text-native or scanned;
- the language(s) present **in this document**;
- observed **format characteristics** of this file;
- observed **classification / audience / version / supersession** characteristics **where present** in
  this document.

### What n=1 CANNOT establish — record as insufficient, do not estimate

**Format mix · language prevalence · scanned-document prevalence · classification and audience
distribution · version and supersession prevalence — across a corpus.**

MSG-0080 is explicit: for these, **record that n=1 is insufficient and do not invent estimates.**

**This is the substance of the task, not a disclaimer on it.** Four of A-SURVEY's five original
questions are distributional — they describe a population, and one file is not a population. A record
that reads like a corpus survey would feed **D6** normalization, **D14**'s rejection of scanned
documents, and **ADR-0019**, which was accepted specifically on condition its rules come from
*empirical corpus evidence*. **A confident-sounding distribution derived from one file would corrupt
accepted architecture and be checkable against nothing.**

### Constraints (MSG-0080)

- **Approved/synthetic test corpus only.** No production or confidential corpus ingestion.
- **Do not move the PDF into the repository. Do not stage or commit it.**
- **Do not modify ADR-0017 … ADR-0022.**
- **Do not invent Arabic normalization rules** — empirical evidence stays bounded to what this document
  actually supports.
- **Do not select** providers, models, frameworks, embedding technologies, or runtimes.
- **Do not mark T-A, T-B, T-D, T-E, or T-0 READY.**

### Acceptance criteria (MSG-0080)

1. The PDF at the stated external path is **inspected successfully**.
2. The record states **n=1** and distinguishes document-level observations from unsupported
   distributional conclusions.
3. The record **identifies which requested dimensions cannot be inferred** from n=1.
4. **The corpus remains outside the repository and `git status` stays clean.**
5. No ADR and no implementation authorization is changed.
6. COMMS and the queue are reconciled consistently.
7. **Completion is reported only after repository and corpus-path verification.**

### Verification

Being documentary, this task produces **no test count**; do not report one it cannot have.

**Before reporting completion, verify and quote:**

```text
git status --porcelain                  ->  empty
Test-Path D:\Work\pci-corpus\plan.pdf   ->  True
Test-Path D:\Work\pci-platform\plan.pdf ->  False      (nothing copied in)
git log --diff-filter=A --name-only | grep -i "\.pdf"  ->  no corpus PDF ever added
```

Criterion 4 is the one that can fail silently — check it explicitly rather than assuming.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and WP-0009 §6.2 where it tracks A-SURVEY. Write the
checkpoint. Note the corpus location in the record so a future session does not repeat the
in-repository mistake.

### Checkpoint

`implementation/operations/checkpoints/TASK-0027.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one.

### Stop conditions

- **The corpus path is not readable** — verify by inspection first; do not assume it from this text.
- Reading the document would require moving or copying it into the repository.
- Any point where completing the record would require a distributional claim n=1 cannot support.
- **`origin/main` moving mid-run** — BLK-0006 is the precedent. Record the starting HEAD in
  checkpoint 1 and re-check before every push.

> **Known runner limit.** `git fetch` is off the runner allowlist, so a mid-run move is detectable only
> when a push is rejected. Record it and stop; do not route around it.

### Recovery procedure

Re-verify the corpus path by inspection before assuming either answer, and check which records already
exist rather than rewriting them. **If a `plan.pdf` is found inside the repository at any point, that
is a defect: move it out and record it — do not commit it and do not delete the corpus.**

---

## TASK-0028 — A-SURVEY Arabic follow-up (n=1): inspect `Arabic.pdf`

**Priority:** 1 | **Status:** **COMPLETE** — see the summary row above, which has said COMPLETE throughout; record **MSG-0087** | **Owner:** Claude Code

> **Corrected 2026-08-25 (MSG-0162).** Stale `READY` header on a finished task, same defect class as TASK-0041/0042/0045/0046. **The summary row is authoritative and did not change; nothing this task measured or concluded changes.**
**Depends on:** TASK-0027 COMPLETE; MSG-0085 AUTHORIZED; MSG-0083's read grant (already covers the path)
**Next eligible task:** none — implementation stays unauthorized
**Work package:** WP-0009 — Employee Policy Assistant | **Architecture task:** A-SURVEY, Arabic follow-up

**Specification:** [`MSG-0085-arabic-corpus-follow-up-authorization.md`](../comms/MSG-0085-arabic-corpus-follow-up-authorization.md)
**plus this section.** No separate `TASK-0028-*.md` file — deliberate, as with TASK-0025 through
TASK-0027. **TASK-0028 is an id allocated at reconciliation**, verified unused; MSG-0085 assigns none
but explicitly requires this step: *"If a new bounded task/READY reconciliation is required by the
queue, record that rather than silently re-running a closed task."* **TASK-0027 is closed and must not
be re-run.**

### The corpus

```text
D:\Work\pci-corpus\Arabic.pdf      663.3 KB      header %PDF-1.5      (verified present)
D:\Work\pci-corpus\plan.pdf        626.8 KB      the TASK-0027 subject - not this task's subject
```

**Both files sit in the directory MSG-0083 already granted read-only.** No permission change is needed
and **none is authorized** — MSG-0085 §3: *"Use the existing narrow read-only corpus permission
authorized by MSG-0083. Do not broaden permissions."*

**Read it in place. The PDF must never enter the repository** — writes to that path are denied by
`Edit(//D:/Work/pci-corpus/**)`, and BLK-0008 records the near-miss where a corpus file briefly sat
inside the working tree, one `git add -A` from permanent history.

### Objective (MSG-0085 §6)

Inspect the Arabic PDF directly and record **only observations supported by the file**, specifically
assessing:

- **Arabic text encoding and extraction** — what actually comes out of the content streams;
- **language declarations** — `/Lang` at document and span level;
- **font and `ToUnicode` behaviour** — whether glyphs map back to Unicode, and how reliably;
- **text-native vs scanned** characteristics;
- **normalization and extraction hazards** relevant to **ADR-0019** and downstream retrieval.

### n=1, again — and it is a separate n=1

**Record the sample as n=1 for the Arabic follow-up** (MSG-0085 §5). Do not generalize to the wider
corpus, and **do not combine it with TASK-0027's English document into a two-document "corpus"** — two
files chosen by an operator are not a sample, and "1 English + 1 Arabic" is not evidence about the
prevalence of either.

**Do not amend ADR-0019** (MSG-0085 §7). Any implication for its deferred Arabic normalization rules is
**evidence for a later architecture decision**, recorded as such — not a rule, not a proposal adopted,
and not a change to an accepted ADR.

> **Why this matters more here than it did for English.** ADR-0019 was accepted **on condition** that
> its normalization rules come from empirical corpus evidence. This is the first Arabic evidence the
> project has. The temptation to promote a single document's behaviour into a normalization rule is
> exactly what the condition exists to prevent.

### What TASK-0027 found that is worth carrying in

Its three extraction hazards are reproducible and should be **checked for, not assumed**, in this file:

1. **Duplicated glyphs from drop shadows** — artifact-marked text that naive extraction doubles;
   negligible document-wide, severe on the one page carrying governance metadata.
2. **Language tags harvested as body text** — `/Span <</Lang (..)>>` property strings picked up by a
   regex that does not check the operand precedes `Tj`/`TJ`.
3. **A page whose meaning is vector graphics**, yielding almost no text — ingested silently as nearly
   empty rather than rejected.

**Whether any of these appear here is a question, not an expectation.** A different producer and a
different script may produce entirely different hazards, and finding none of the three is a real result.

### Constraints (MSG-0085 guardrails)

- **No production or confidential corpus ingestion.**
- **No copying the PDF into Git.**
- **No permission changes beyond MSG-0083.**
- **No implementation.**
- **No unsupported corpus-wide prevalence claims.**
- **Preserve all accepted ADRs unchanged** unless separately authorized.
- Do not mark T-A, T-B, T-D, T-E, or T-0 READY.

### Personal data — carry TASK-0027's restraint forward

MSG-0084 §4.1 read the author and approver names in the English document and **deliberately did not
transcribe them**, on the ground that an ordinary project record is not the right place for personal
data about identifiable staff. **Do the same here.** Record that such fields are *present* and what
their *structure* is; do not copy their values into the repository.

### Verification

Being documentary, this task produces **no test count**. Before reporting completion, verify and quote:

```text
git status --porcelain                        ->  empty
Test-Path D:\Work\pci-corpus\Arabic.pdf       ->  True
Test-Path D:\Work\pci-platform\Arabic.pdf     ->  False     (nothing copied in)
git log --diff-filter=A --name-only | grep -i "\.pdf"   ->  nothing
```

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and WP-0009 §6.2 where it tracks A-SURVEY. Write the
checkpoint.

### Checkpoint

`implementation/operations/checkpoints/TASK-0028.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one.

### Stop conditions

- **The corpus file is not readable** — verify by inspection; do not assume it from this text.
- Reading it would require copying it into the repository or broadening any permission.
- Any point where a conclusion would need more than one document to support it.
- **`origin/main` moving mid-run** — BLK-0006 is the precedent. Record the starting HEAD in checkpoint 1
  and re-check before every push.

> **Known runner limits.** `git fetch` is off the allowlist, so a mid-run move is detectable only when a
> push is rejected. **There is also no PDF tooling** — `pdftoppm` is absent and `pdftotext` is not on
> the allowlist (MSG-0084 §8.2). TASK-0027 worked within that by reading the file's bytes directly,
> which the read grant permits. **Do not install tooling and do not request it mid-run**; if byte-level
> inspection cannot answer a question, record the question as unanswered.

### Recovery procedure

Re-verify the corpus path by inspection before assuming either answer, and check which records already
exist rather than rewriting them. **If any PDF is found inside the repository, that is a defect: move it
out and record it — do not commit it and do not delete the corpus.**

---

## TASK-0030 — draft the minimum ADR-0020 clarification (pre-constrained retrieval as a gate criterion)

**Priority:** 1 | **Status:** **COMPLETE** (2026-08-22 — 7/7 criteria, **MSG-0094**) | **Owner:** Claude Code
**Depends on:** EPA-0005 ACCEPTED (MSG-0092); ADR-0020 accepted and promoted
**Next eligible task:** none — the Lead reviews the draft before anything is applied

> **EXECUTED 2026-08-22 by a supervisor-started session. Record: [MSG-0094](../comms/MSG-0094-task-0030-execution-record.md).**
> Deliverable: [`implementation/decisions/ADR-0020-AMD-01-pre-constrained-retrieval-engine-criterion.md`](../decisions/ADR-0020-AMD-01-pre-constrained-retrieval-engine-criterion.md)
> — **PROPOSED and NOT applied.** `git diff --name-only docs/` was **empty**, so the accepted, promoted
> ADR-0020 is unmodified; applying the amendment needs an explicit authorization (MSG-0092 §5).
> **The stop condition was tested, not assumed** — §§3–4 state the *rule* unambiguously, and the gap is
> *consequence*: they do not say the rule **disqualifies an engine** that cannot constrain inside the
> query, nor **what G3 inspects** (conforming and retrieve-then-filter designs return byte-identical
> responses). The amendment is **one 148-word insertion at the end of §4**, plus an optional
> traceability row; **twelve candidate changes were deliberately not made**. **Nothing was selected** —
> all nine MSG-0092 §4 categories stay open. **One convention question** is referred: the repository has
> **no precedent for amending an accepted ADR**, so no header change was drafted.
**Work package:** WP-0009 — Employee Policy Assistant | **Type:** architecture governance, draft only

**Specification:** [`MSG-0092-architecture-lead-epa-0005-ruling.md`](../comms/MSG-0092-architecture-lead-epa-0005-ruling.md) §3 and §5,
**plus this section.** No separate `TASK-0030-*.md` file — deliberate, as with TASK-0025 onward.
**TASK-0030 is an id allocated at reconciliation**, verified unused; MSG-0092 assigns none.

### Objective

**Draft the minimum clarification to ADR-0020 that makes its existing §3/§4 pre-constrained retrieval
requirement explicit as an engine-selection / gate criterion — without changing its substantive
policy.**

MSG-0092 §3: *"Authorize a narrow follow-on governance task to draft the minimum
clarification/amendment to ADR-0020, without changing its substantive policy … No retrieval engine is
selected by that task."*

### The requirement being made explicit

ADR-0020 already contains it. **§4 is titled "No retrieve-then-suppress — the rule this ADR exists
for"**, and **§3 sets out authorization enforced at four points, each independently sufficient to
deny.** MSG-0092 §1(1) restates it as a settled constraint: *"Retrieval must enforce
authorization-relevant constraints **inside the retrieval operation**. Retrieve-then-filter or
over-fetch-then-filter is not acceptable."*

**The gap is not policy, it is consequence.** The ADR states the rule; it does not say in terms that
the rule **disqualifies any retrieval engine that cannot apply authorization constraints inside the
query**. That consequence is what the clarification must make unambiguous, so a future engine
evaluation cannot satisfy the ADR on paper while planning to filter after retrieval.

### Required work

1. **Read ADR-0020 §§3–4 in `docs/decisions/`** — the accepted, promoted copy — and establish exactly
   what they already say. Quote rather than paraphrase.
2. **Draft the minimum wording** that makes the pre-constrained requirement explicit as an
   **engine-selection and gate criterion**. Minimum means: the smallest change that removes the
   ambiguity, not a rewrite, not a tidy-up, and not an improvement of adjacent text.
3. **Preserve all accepted semantics.** The four enforcement points, the fail-closed behaviour, the
   named side channels, and the Restricted-document condition are unchanged. If the draft would alter
   any of them, that is a stop condition, not a judgement call.
4. **Produce the draft as a proposal for Architecture Lead review** — in
   `implementation/decisions/` or `implementation/comms/` as a clearly-marked proposed amendment.
5. **STOP before applying it.** See below.

### The boundary that matters most

**Do not apply the amendment to `docs/decisions/ADR-0020-*.md`.** MSG-0092 §5 is explicit: *"stop
before applying the amendment unless a subsequent explicit authorization permits acceptance."*

**ADR-0020 is accepted and promoted — it carries architectural authority.** Editing it is the Lead's
act, exactly as ADR promotion was (TASK-0025 / MSG-0073). Producing the draft is this task's whole
scope.

### Forbidden

- **No retrieval engine, index engine, framework, model, runtime, or provider is selected** — MSG-0092
  §4 lists nine categories that stay open, and this task touches none of them.
- **No change to ADR-0020's substantive policy**, and **ADR-0017, ADR-0018, ADR-0019, ADR-0021 and
  ADR-0022 are not touched at all**.
- **No new generic stack ADR** — MSG-0092 §3 declined one explicitly.
- **No Arabic normalization rule**; ADR-0019's deferral is unchanged and the n=1 evidence does not
  become production corpus evidence (MSG-0092 §4).
- **Do not start T-A, T-B, T-D, T-E, T-0**, model selection, engine selection, or any production
  implementation (MSG-0092 §5).
- **Do not mark any implementation task READY.**

### Acceptance criteria

1. ADR-0020 §§3–4 are inspected in the accepted copy and quoted, not summarised.
2. A **minimum** clarification is drafted, with its minimality argued — what was deliberately *not*
   changed is stated.
3. **No substantive policy change**: the four enforcement points, fail-closed behaviour, side-channel
   closure and Restricted condition are demonstrably preserved.
4. **No engine or technology selection appears anywhere in the draft.**
5. **ADR-0020 in `docs/decisions/` is unmodified** — `git diff --name-only docs/` is empty.
6. The draft is presented for Lead review, with the exact proposed wording quotable in isolation.
7. COMMS, queue and status are reconciled; completion reported only after repository verification.

### Verification

Documentary — **no test count**; do not report one it cannot have. Before reporting completion, verify
and quote:

```text
git diff --name-only docs/                     -> empty   (no accepted ADR touched)
grep -c READY on the board                     -> the intended count, no implementation task added
```

State explicitly which ADR-0020 semantics were preserved and how that was checked.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and WP-0009 where it tracks the ADR set. Write the
checkpoint.

### Checkpoint

`implementation/operations/checkpoints/TASK-0030.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one.

### Stop conditions

- **The minimum clarification cannot be drafted without changing substantive policy** — stop and record
  the conflict rather than deciding it.
- ADR-0020 §§3–4 turn out to already state the consequence unambiguously — **that is a legitimate
  finding**: report that no amendment is needed rather than manufacturing one.
- Any point where the wording would imply an engine choice.
- **`origin/main` moving mid-run** — BLK-0006 is the precedent. Record the starting HEAD in checkpoint 1
  and re-check before every push.

> **Known runner limits.** `git fetch` is off the allowlist, so a mid-run move is detectable only when a
> push is rejected. Record it and stop; do not route around it.

### Recovery procedure

Re-read MSG-0092 §3 and §5 and check which records already exist before drafting. **If a proposed
amendment already exists, do not write a second one** — governance drafts are easy to duplicate and
hard to reconcile, and duplication is the failure this queue has hit repeatedly.

---

## TASK-0031 — apply ADR-0020 AMD-01 in place

> **COMPLETE — executed 2026-08-23 by a supervisor-started session against starting `HEAD =
> dfb719d`.** All **7/7 acceptance criteria MET**; execution record **MSG-0097**; applying commit
> **`a1be892178dea11d62dee6693c7c8d7d80798e43`**; tree clean. Documentary task — **no test count, and
> none is claimed.**
>
> **The amendment is applied and this section must not be run again.** `git diff --name-only
> docs/decisions/` named **ADR-0020 and nothing else**, with **15 insertions and 0 deletions** — the
> header note was added as a new line rather than by modifying one, so no accepted wording changed
> anywhere in the file. The four new markers each occur **exactly once**; **re-running would insert
> hunk 1 twice**, which the recovery procedure below rightly calls worse than a missing clause.
>
> **AMD-01 §8 is settled as option (a)** — in place, one authoritative file, no superseding ADR. That
> is now the repository's precedent **for an additive clarification that changes no substantive
> policy**, and for nothing wider: MSG-0095 §3 authorized application of AMD-01 only.
>
> **Nothing was selected.** No engine, index technology, embedding model, framework, runtime or
> provider; ADR-0019's §6 Arabic deferral untouched; ADR-0017/0018/0019/0021/0022 not touched at all;
> **no implementation task is READY.**

**Priority:** 1 | **Status:** **COMPLETE** (was READY) | **Owner:** Claude Code
**Depends on:** AMD-01 ACCEPTED (MSG-0095); TASK-0030 COMPLETE
**Next eligible task:** none — no implementation is authorized by MSG-0095
**Type:** governance application, **in place on an accepted ADR**

**Specification:** [`MSG-0095-adr-0020-amd-01-architecture-lead-ruling.md`](../comms/MSG-0095-adr-0020-amd-01-architecture-lead-ruling.md)
**plus** [`ADR-0020-AMD-01-*.md`](../decisions/ADR-0020-AMD-01-pre-constrained-retrieval-engine-criterion.md)
**plus this section.** No separate `TASK-0031-*.md` file; **the id was allocated at reconciliation**,
verified unused.

> **This task edits an accepted, promoted ADR.** That is authorized here and only here: MSG-0095 §3
> *"authorizes acceptance/application of AMD-01 only"*. Nothing else in `docs/decisions/` may change.

### What MSG-0095 decided

- **ACCEPT AMD-01 as drafted, with the optional traceability row included** — so **both hunks**, not
  hunk 1 alone.
- **Apply it in place** to the accepted ADR-0020, with a **concise amendment note in its header
  identifying AMD-01 and MSG-0095**. This settles the open convention question in AMD-01 §8 as
  **option (a)**.
- **Do not create a superseding ADR.**

### Required work — three edits, and nothing else

**Take the wording verbatim from AMD-01. Do not retype or paraphrase it** — transcription drift in an
accepted ADR is exactly the failure this task must not introduce.

1. **Hunk 1** — insert the block quoted in **AMD-01 §4** at the **end of ADR-0020 §4**, immediately
   after the sentence *"An exclusion cannot fail open; a filter can."* **Nothing existing is deleted or
   reworded.**
2. **Hunk 2** — append the single row quoted in **AMD-01 §5** to ADR-0020's **Traceability** table.
3. **Header note** — add a concise amendment line identifying **AMD-01** and **MSG-0095**, in the form
   AMD-01 §8(a) suggests, e.g. `**Amended:** 2026-08-23 — AMD-01 (MSG-0095)`. Keep it to one line;
   MSG-0095 says *concise*.

### Everything AMD-01 §6 listed as untouched stays untouched

§1, §2, §3 and its four numbered points, §3's closing line, §4's existing text including the MSG-0062
§7.6 block quote, §5, §6, §7, §8, Consequences, *Deliberately not decided here*, Context, Rationale, and
the reuse-before-create test. **ADR-0017, ADR-0018, ADR-0019, ADR-0021 and ADR-0022 are not touched at
all.**

### Forbidden (MSG-0095 §4)

- **No change to ADR-0019 or its Arabic production-evidence gate.**
- **No change to the three settled MSG-0092 constraints.**
- **No generic stack ADR.**
- **No retrieval engine, index technology, embedding model, framework, runtime, or provider selection**
  — MSG-0095 §3 is explicit that this ruling selects none.
- **No implementation task authorization beyond applying this amendment**, and no implementation task
  may be marked READY.

### Acceptance criteria

1. Hunk 1 appears at the end of ADR-0020 §4, **verbatim from AMD-01 §4**, with the preceding text
   unchanged.
2. Hunk 2 appears as one new Traceability row, **verbatim from AMD-01 §5**.
3. A concise header amendment note identifies **AMD-01 and MSG-0095**.
4. **No other change to `docs/decisions/`** — `git diff --name-only docs/decisions/` names
   **ADR-0020 and nothing else**.
5. **No technology or engine name appears anywhere in the applied text.**
6. AMD-01's own record is updated to **APPLIED**, citing MSG-0095 and the applying commit.
7. COMMS, queue and status reconciled; **the resulting commit hash and a clean tree are reported**
   (MSG-0095 §5).

### Verification — run and quote before reporting completion

```text
git diff --name-only docs/decisions/     -> ADR-0020-retrieval-projection-and-index-boundary.md only
git diff -- docs/decisions/ | grep '^-'  -> no substantive deletions (header line change aside)
git status --porcelain                   -> empty after commit
```

**Diff-read the applied ADR against AMD-01's quoted hunks** and confirm they match character for
character. Documentary task: **no test count** — do not report one it cannot have.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, AMD-01's status, and WP-0009 where it tracks the ADR
set. Write the checkpoint.

### Checkpoint

`implementation/operations/checkpoints/TASK-0031.md`, written **after** each operation is verified.

### Stop conditions

- **The insertion point cannot be located exactly**, or §4's closing sentence differs from what AMD-01
  quoted — stop and record rather than placing the text approximately.
- Applying either hunk would require altering existing wording.
- Any point where the edit would touch a second ADR.
- **`origin/main` moving mid-run** — BLK-0006 is the precedent. Record the starting HEAD in checkpoint 1
  and re-check before every push.

> **Known runner limit.** `git fetch` is off the allowlist, so a mid-run move is detectable only when a
> push is rejected. Record it and stop.

### Recovery procedure

**Check whether the amendment is already applied before applying it.** Re-running this task against an
already-amended ADR would insert hunk 1 twice — a duplicated clause in an accepted ADR is far worse
than a missing one, and `CLAUDE.md` recovery rule (f) applies with full force: never repeat an
operation merely because a record says it was incomplete.

---

## TASK-0032 — A-STACK technology evaluation and implementation planning (bounded)

**Priority:** 1 | **Status:** **COMPLETE** (2026-08-23) | **Owner:** Claude Code
**Depends on:** MSG-0098 AUTHORIZED; EPA-0005 ACCEPTED (MSG-0092); ADR-0020 + AMD-01 applied (MSG-0095, TASK-0031)
**Next eligible task:** none — MSG-0098 requires stopping for the Lead if selection remains open
**Work package:** WP-0009 | **Type:** architecture evaluation and planning, **selects nothing**

**Specification:** [`MSG-0098-wp-0009-a-stack-authorization.md`](../comms/MSG-0098-wp-0009-a-stack-authorization.md)
**plus this section.** No separate `TASK-0032-*.md` file; the id was allocated at reconciliation and
verified unused. **That remains true after execution, and is repeated so a later reader does not go looking
for a missing file.**

### Result — COMPLETE, 2026-08-23

**Executed by a supervisor-started session** (`runner.lock` pid 16664, acquired 2026-08-23T05:57:17Z,
heartbeat `RUNNER_RUNNING` at `head dfc7822`) against **starting `HEAD = dfc7822`**. All seven acceptance
criteria are **MET**, each mapped to evidence in **[MSG-0100](../comms/MSG-0100-task-0032-execution-record.md)**
§3. Being documentary it produced **no test count and claims none**, as this section's own Verification
paragraph requires.

**The deliverable is [`EPA-0006`](../../architecture/EPA-0006-assistant-technology-evaluation.md) —
PROPOSED, and it selects nothing.** `git diff --name-only docs/decisions/` is **empty**; the accepted ADR
set, including the ADR-0020 amended that same morning, is untouched.

**The criterion was applied, not asserted — which is what acceptance criterion 2 asks for.** Seven engine
classes, each with an execution-shape verdict and the reasoning behind it. **Disqualified: post-filter-only
similarity search** (directly by ADR-0020 §4 as amended, no test required) and **hosted/managed retrieval
services** — the latter **twice over on independent grounds**, because **ADR-0022 §1 names *derived
embeddings* explicitly**, so relaxing one elimination would not revive the class. **Relational,
search-engine, vector-store and lexical-only classes are NOT disqualified and are explicitly NOT cleared**:
each is a class within which conforming and non-conforming members both exist. **Retrieval computed against
the kernel store conforms structurally** — the candidate set *is* an authorized query result, so there is no
wider set to over-fetch from — **and its cost is entirely unmeasured.**

**The finding worth carrying forward is that AMD-01 contains two obligations and an implementer will
conflate them.** An engine that accepts the constrained query and satisfies it by **over-fetching
internally** receives a **conformant query** and returns a **correct response** — so **G3 evidence, which
inspects the query, cannot detect it.** Engine clearance therefore needs execution evidence of its own, and
**an engine that exposes no plan or counter instrumentation cannot be cleared at all.** **This is not a
defect in AMD-01 and no amendment is proposed**; AMD-01 states both obligations, it simply does not say that
one fails to discharge the other. EPA-0006 §14 lists, finding by finding, why **none** of its ten findings
requires an ADR change, naming the accepted section each already follows from.

**On the failure mode this section warned about, at length, in its note on item 5: it did not occur.**
**No throughput, latency, memory, index-size, recall, precision, token-rate or capacity figure appears
anywhere in EPA-0006** — not as an estimate, a typical value, a range, or a vendor claim presented as fact.
Where a number appears it is a **count derived from ADR text with the derivation shown** (§6.4: at least
three model invocations on the critical path of one English answer — embed, generate, entail — with a
cross-language answer adding at least one more). **Product naming was held to two places and disclaimed**
(EPA-0006 §2.2), because the discriminating property — filter execution strategy — is not reliably
determinable from documentation and was not determinable at all from that session.

**Nothing was selected.** Ten selections are recorded OPEN with what would close each. **ADR-0019 is
untouched and no Arabic normalization rule was written, inferred, or proposed** — MSG-0091's scoping is
respected, and one n=1 observation (detached diacritics) is recorded as **input to** the deferred rule and
explicitly not as any part of it. **No ADR was created, amended, or proposed**; **no implementation task was
marked READY**; T-0 and T-A…T-I remain unauthorized.

**Five items are referred to the Architecture Lead and none blocks anything** (MSG-0100 §10): whether
ADR-0020 §7's *"one projection index"* means one **projection** or one **engine**; whether the projection
should retain SUPERSEDED chunks at all; whether the engine conformance probe should be run — **the only
substantial evidence in the whole evaluation not blocked on the organization or the operator**, named as a
sequencing observation and explicitly **not** proposed as a task; whether any of the eight recommended
criteria warrants recording as accepted authority; and the unchanged corpus action, which MSG-0078,
MSG-0084 and MSG-0089 have each already recorded.

**WP-0009 §6.2 was updated additively — two rows added under A-STACK, the TASK-0026 row untouched**, as this
section's Documentation paragraph requires. **The first added row also closed a real lag**: §6.2 still
described EPA-0005 as `PROPOSED` and contained **zero** occurrences of `MSG-0092`, `MSG-0095` or
`Approach C`, verified by search before writing.

> **The section below is the authorization as issued, retained unchanged.**

> **This is not a re-run of TASK-0026.** That task evaluated **stack shape** — Approaches A/B/C — and
> produced `EPA-0005`, which deliberately selected nothing. This task evaluates **technology classes**
> *against* the now-settled **Approach C** and against **ADR-0020 as amended by AMD-01**, neither of
> which existed when EPA-0005 was written. **Both are labelled "A-STACK" in WP-0009 §6.2**, where
> A-STACK is already recorded EXECUTED; that label reuse is noted in MSG-0099 so the record is not read
> as one task run twice.

### Objective (MSG-0098)

Compare candidate technologies, record evidence and disqualifiers, define interfaces, and **either
produce a bounded recommendation or explicitly preserve selection as open.** Scope is **technology
evaluation and implementation planning only.**

### Binding architecture — these are settled and must be treated as constraints, not options

- **Approach C** (EPA-0005 / MSG-0092): a governed application layer plus a **separate document/inference
  worker behind an explicit contract**. **The worker is not an authorization authority.**
- **ADR-0020 as amended by AMD-01**: authorization constraints must be applied **inside the retrieval
  operation**. **Retrieve-then-filter and over-fetch-then-filter are disallowed**, and an engine that
  cannot express such constraints in-query is **disqualified**. **G3 is evidenced against the query
  issued to the engine, not the response returned.**
- **Three local workloads remain required**: generation, multilingual embedding, entailment.
- **Conversation and audit storage remain separate**; **Restricted passages must not enter ordinary
  logs or telemetry.**
- **Technology must remain replaceable** behind the defined capability boundaries.
- **ADR-0019 remains untouched.** Arabic n=1 evidence is sufficient for bounded architecture testing
  and **is not production corpus evidence**.

### Required output — the six MSG-0098 items

1. **Compare candidate technology classes against Approach C.**
2. **Evaluate retrieval engines against ADR-0020 and AMD-01**, including whether each offers **genuine
   pre-constrained retrieval** — the disqualifier is now explicit and testable, so apply it.
3. **Evaluate local inference requirements** for generation, multilingual embedding, and entailment.
4. **Cover** extraction/normalization, grounding validation, storage separation, logging restrictions,
   and rebuild/replaceability implications.
5. **Record missing evidence explicitly. Do not invent benchmarks, capacity figures, or corpus-scale
   findings.**
6. **Produce a bounded recommendation, or state explicitly that selection remains open.**

> **On item 5, which is where this task is most likely to go wrong.** A technology comparison invites
> throughput numbers, latency figures, memory footprints and recall scores. **None has been measured
> here.** PR4 (inference runtime) and PR6 (host capacity) are recorded UNKNOWN, no corpus-scale survey
> exists, and the Arabic evidence is n=1 on three producers. **A figure that was not measured must not
> appear**, not as an estimate, a typical value, a vendor claim presented as fact, or a range. Cite
> what a vendor claims *as a claim*, and mark what would need measuring.

### Forbidden (MSG-0098)

- **No production technology selection.** No implementation, no deployment.
- **No specific retrieval engine, vector store, model, model-serving runtime, application runtime,
  framework, or provider is selected** by the authorizing message — and none may be selected here.
  A **recommendation** is permitted; an **adoption** is not.
- **No accepted ADR may be changed** — ADR-0017…ADR-0022 including the newly amended ADR-0020.
- **No new corpus or provider authorization** may be assumed or requested as a precondition to
  finishing; record the need and continue with what is available.
- **Do not mark any implementation task READY.**

### Acceptance criteria

1. All six required outputs are produced, each traceable to evidence or explicitly marked as
   unevidenced.
2. **The pre-constrained retrieval criterion is actually applied** to each candidate engine class, with
   the disqualification reasoned rather than asserted.
3. **No unmeasured figure appears as fact.**
4. **No technology is selected or adopted**; any recommendation is labelled as such and its open
   questions named.
5. **No accepted ADR modified** — `git diff --name-only docs/decisions/` is empty.
6. **No implementation task marked READY.**
7. COMMS, queue and status reconciled; result reported and **stopped for the Lead if selection remains
   open** (MSG-0098).

### Verification

Documentary — **no test count**; do not report one. Before completion, verify and quote:

```text
git diff --name-only docs/decisions/   -> empty
git status --porcelain                 -> empty after commit
```

State explicitly which candidate classes were disqualified by the AMD-01 criterion and why.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and WP-0009 §6.2 — **distinguishing this evaluation from
TASK-0026's shape evaluation** rather than overwriting that row. Write the checkpoint.

### Checkpoint

`implementation/operations/checkpoints/TASK-0032.md`, written **after** each operation is verified.

### Stop conditions (MSG-0098, verbatim in substance)

Stop rather than cross the boundary if **an accepted ADR would need changing**, **production technology
would need selecting**, **product implementation would be required**, or **new corpus or provider
authorization would be needed**.

**Also stop if `origin/main` moves mid-run** — BLK-0006 is the precedent. Record the starting HEAD in
checkpoint 1 and re-check before every push.

> **Known runner limit.** `git fetch` is off the allowlist, so a mid-run move is detectable only when a
> push is rejected. Record it and stop.

### Recovery procedure

Re-read MSG-0098 and check which records already exist before writing. **If an evaluation record
already exists, do not write a second one** — two overlapping stack evaluations would be materially
confusing given EPA-0005 already occupies that ground.

---

## TASK-0033 — bounded retrieval-engine conformance probe (evaluation only)

**Priority:** 1 | **Status:** **COMPLETE** (2026-08-23, second run — MSG-0104) | **Owner:** Claude Code
**Depends on:** MSG-0101 AUTHORIZED; EPA-0006 (TASK-0032); ADR-0020 as amended by AMD-01; ADR-0018
**Next eligible task:** none — MSG-0101 §5 permits no second READY task, and requires stopping after the result
**Type:** evaluation probe — **adopts nothing, deploys nothing**

> ### Result — 2026-08-23, run 2 (MSG-0104). **The probe ran. It cleared nothing.**
>
> Executed by a supervisor-started session (`runner.lock` pid **16300**, acquired **06:57:18Z**) against
> starting `HEAD = e7aef44`, which **did not move for the whole run**. **8/8 acceptance criteria MET.**
>
> **What ran:** the one reachable engine — **SQLite 3.51.3, embedded in the Node runtime via
> `node:sqlite`**, a genuine class-**R** member and a **test subject only** — in **three query shapes**
> plus a **deliberately non-conforming negative control**, against a synthetic in-memory adversarial
> fixture. **24 candidate executions across 6 fixtures** (2 index designs × M ∈ {50, 500, 5000}), plus
> **6 adversarial-precondition checks**, all three EPA-0006 §4.4 tiers. **No install, no network, no
> Docker, no corpus, no file left behind.**
>
> **Tier 1 PASSED** — all four EPA-0006 §3 constraints expressible in one query, including the
> open-ended temporal range and the multi-valued set overlap. **Tier 2 PASSED** for the three shapes,
> k-complete and result-set-invariant as M grows — **and the negative control FAILED it**, which is what
> makes the passes worth anything: a post-filter design returned **correct results at M=50 and nothing
> at all at M=500 and M=5000**, never once returning an unauthorized row. **It looks right on a small
> collection and degrades into empty answers as the collection grows.**
>
> **Tier 3 decided the outcome, against the candidate.** Every tested shape makes the engine examine
> **unauthorized rows in a number growing linearly with the collection** — **3000 of 5000** with a
> partial index, **1000 of 5000 even with the widest index** — because the **multi-valued audience
> conjunct cannot be pushed into the index**, while returning results **indistinguishable from a
> conforming engine's**. **EPA-0006 findings 1 and 2 are now demonstrated by measurement, not asserted:**
> the same SQL and same engine, plan forced away from the authorization index, reached **5008** rows
> instead of **3008** and returned the **identical correct answer**.
>
> **Verdicts:** **NOT CLEARED** for all three tested shapes (Tier 3) · **class D DISQUALIFIED and
> demonstrated** (Tier 2) · **classes S, V and K NOT CLEARED with zero execution evidence** — the
> `docker` CLI is unreachable from this runner and there is no PostgreSQL · **class H DISQUALIFIED** on
> ADR-0022 §1, needing no test. **Nothing is CLEARED, and under MSG-0101 §2 that is the required
> outcome wherever the evidence does not positively establish Shape 1.**
>
> **Nothing selected, adopted, installed or deployed. No accepted ADR modified** (`git diff --name-only
> docs/decisions/` **empty**). **No implementation task authorized. No `EPA-0007` created** — the queue's
> Documentation section asks for a numbered COMMS message, and MSG-0101 §1(4) authorizes no new ADR.
> **No benchmark, latency, capacity, recall or timing figure appears anywhere**; every number is a count
> the probe emitted, reproducible via `implementation/probes/TASK-0033/probe.mjs`.
>
> **One non-blocking clarification is referred** (MSG-0104 §8): EPA-0006 §4.1 defines Shape 1 as *"the
> engine only ever examines chunks that satisfy it"*, and **no engine can satisfy that strictly** —
> evaluating a predicate *is* examining and rejecting candidates. The measurable line may instead be
> *"materializes no unauthorized passage content"*, which **C1 held and the control failed**. **Only the
> Lead can settle which line AMD-01 intends; until then NOT CLEARED stands.**
>
> **Two self-corrections are recorded rather than tidied away**, both in MSG-0104: a pinning test that
> concluded *"the pin is enforced by the engine"* was **wrong** — it named an index on a different
> table, so the failure was name resolution — and the corrected test **reversed the finding**
> (`INDEXED BY` **accepts** a pin that performs no authorization restriction). And the FTS5 candidates'
> *"0 unauthorized bodies"* is **absence of instrument, not absence of materialization**; body
> materialization is **UNMEASURED** for the lexical half.

**Specification:** [`MSG-0101-architecture-lead-ruling-next-retrieval-conformance-probe.md`](../comms/MSG-0101-architecture-lead-ruling-next-retrieval-conformance-probe.md)
§2–§4, **plus** EPA-0006 §4.4 (the tiered evidence model), **plus this section.**

> **Run history — one attempt, stopped before it started (2026-08-23, MSG-0103).** A supervisor-started
> runner (pid 15500) held the lock for this task from **06:37:18Z**. At **06:39:24Z** a concurrent
> interactive session committed `55a617c` — **this section's own reconciliation** — moving `HEAD` and
> `origin/main` under the running session. **Both the global abort rule and this section's own *"stop if
> `origin/main` moves mid-run"* fired, and the run stopped.**
>
> **Nothing was executed and there is nothing to resume.** No probe harness, no fixture, no query, **no
> candidate evaluated, no `CLEARED`/`DISQUALIFIED`/`NOT CLEARED` verdict**, no `EPA-0007`, no ADR
> touched. The task is at its starting line. **Recovery rule (f) — do not re-run anything on the
> strength of that checkpoint, because nothing ran.**
>
> **The stopping condition was transient and has cleared:** `HEAD` and `origin/main` both read
> `55a617c`. **The next supervisor cycle should simply run this task.** The run did leave one thing
> behind — the environment correction below, which changes what the probe can prove.
>
> **DISCHARGED — that prediction held.** The next supervisor cycle (pid **16300**, 06:57:18Z) ran the
> task to completion against `HEAD = e7aef44`, which did not move. **The environment correction below
> was re-verified in that session rather than inherited, and it was correct**: all three tiers were
> obtained against a class-R subject with no install, no PATH change, no network and no Docker. See the
> **Result** block above and **MSG-0104**. **This run-history note is retained as the record of run 1.**

---

### ⚠ Environment: the execution tiers are gated, and this was verified before the task was queued

**Tier 2 and Tier 3 need to actually run engines. Right now they cannot be run here.**

```text
Docker Desktop            INSTALLED
com.docker.service        Running
docker service            Running
docker.exe                C:\Program Files\Docker\Docker\resources\bin\docker.exe  (not on either shell PATH)
docker version            FAILS - npipe:////./pipe/dockerDesktopLinuxEngine does not exist
                          -> the Linux engine backend is NOT up
psql / sqlite3 / java     absent
python 3.14.5             installed, NOT on PATH
node                      v24.15.0  available
```

**A correction worth carrying, because it nearly became a false finding.** A first check through Git
Bash reported no Docker and no Python at all. That was a **PATH artefact, not a machine fact** — both
are installed. The same shape of error appeared in TASK-0029, where fonts were "absent" because the
search looked in decompressed streams rather than the plain body. **Disbelieve a suspicious absence and
check a second way.**

> ### ⚠ Correction, 2026-08-23 — additive and declared (MSG-0103 §3). Read this before scoping the probe.
>
> **The block above is retained unchanged as the record of what was found, but two of its conclusions
> do not hold, and one of them would misdirect the whole task.**
>
> **1. `sqlite3   absent` is right about the tool and wrong about the engine.** The `sqlite3` **CLI** is
> genuinely not installed. But SQLite is an *embedded* engine, and it is **compiled into the Node
> runtime the same table records as `available`** — reachable through the built-in **`node:sqlite`**
> module with **no installation, no `PATH` change, no network access and no Docker**. VERIFIED
> 2026-08-23 by a supervisor-started session:
>
> ```text
> node:sqlite OK · sqlite version 3.51.3 · FTS5 available
> DatabaseSync.function typeof: function
> EXPLAIN QUERY PLAN -> {"detail":"SEARCH c USING INDEX i_scope (scope=? AND eff_from<?)"}
> ```
>
> **2. So "Tier 2 and Tier 3 cannot be run here" is false for class R.** Tier 2 (k-completeness under
> adversarial selectivity) needs only a synthetic collection and a constrained top-`k` query, which an
> in-process engine supplies completely. Tier 3 — **the tier EPA-0006 §4.4 calls the one that *"actually
> discharges AMD-01's selection criterion"*** — is available in both its forms: `EXPLAIN QUERY PLAN`
> returns structured plan rows, and `DatabaseSync.prototype.function` permits registering the
> authorization predicate as a user-defined SQL function, so **the number of rows the engine actually
> examines can be counted directly.** That is the Shape-1-versus-Shape-3 discriminator.
>
> **This is exactly the near-miss above, one level down** — an absence from `PATH` read as an absence
> from the machine — which is worth noticing, because the lesson was already written on the page.
>
> **The correction is narrow, and the rest of the block stands.** **Classes S and V remain unreachable**
> (containerised; the `docker` CLI is not usable from the runner), **class K remains unmeasured** (no
> PostgreSQL), and **acceptance criterion 6 still cannot be settled for S or V**, because SQLite has no
> approximate vector index and strategy-switching is a property of engines that do. **`NOT CLEARED`
> remains the correct outcome everywhere the evidence is genuinely absent** — the plan line above is
> **capability evidence and explicitly not a conformance verdict.** No candidate has been probed.
>
> **Do not inherit any of this.** Re-verify it in your own session, and re-check Docker too — an
> operator may have started Docker Desktop in the interval.

**What follows for this task:**

- **Do not install any engine, image, package, or runtime.** No `npm install` of a search library, no
  `docker pull`, no `pip install`. MSG-0101 §4 stops on *"provisioning an implementation runtime or
  production service"*, and installing software on this host is not authorized by any record.
- **Do not start Docker Desktop.** It is an operator action on the operator's machine, and it typically
  needs an interactive session. **Record that it is required; do not attempt it.**
- **Tier 1 is available now.** Query-shape analysis from an engine's documented API and query grammar
  needs no execution, and is the tier that establishes whether an authorization predicate can even be
  *expressed* in-query.
- **Where Tier 2/3 cannot be obtained, the answer is `NOT CLEARED`.** MSG-0101 §2: *"Treat inability to
  obtain sufficient execution evidence as NOT CLEARED, not as conformance."* **An engine that looks
  conformant on paper is not cleared.** This is the single most important instruction in this task.

---

### Objective (MSG-0101 §2)

Produce execution evidence for candidate retrieval-engine implementations against **ADR-0020 + AMD-01**,
sufficient to determine whether each candidate can satisfy pre-constrained retrieval **without Shape-3
over-fetch-then-discard behaviour**.

### The Lead's five rulings that bind this probe (MSG-0101 §1)

1. **"One projection index" means one *logical* projection**, not necessarily one physical engine. A
   lexical retriever paired with a semantic one may be evaluated **only if both operate over the same
   governed projection and each independently satisfies AMD-01**. **The fusion layer must never be
   where authorization is resolved.** No engine is selected by this interpretation.
2. **SUPERSEDED chunks: not settled now.** Exclusion from the projection is the safer *implementation
   shape* because it removes a query control surface, but **ADR-0018's audit/reconstruction semantics
   are preserved in the kernel**, and **this task must not modify the accepted ADR on that point.**
3. **The probe is authorized** and may **name concrete candidate engines as test subjects only** —
   naming a candidate is **not** adoption or selection.
4. **EPA-0006 §12.2 obligations are implementation-planning constraints** already implied by the
   accepted ADR set — **no new ADR is authorized.** Authorization context required at the retrieval
   port and worker seam; **index-assigned identifiers must not be citation anchors**; the audit store
   must not be reused for expiring conversation content.
5. **The corpus action remains the organization's.** **No new corpus request or survey task is
   authorized**, and none may be created as a precondition here.

### Required work (MSG-0101 §2)

- **A small, explicit candidate set, labelled evaluation-only**, with the selection rationale recorded.
- **Derive the complete authorization predicate** from ADR-0020/ADR-0018 and **use the same predicate
  for every candidate** — a probe that varies the predicate proves nothing comparative.
- **Run EPA-0006 §4.4's three tiers where supported**: Tier 1 inspect the actual query shape; Tier 2
  inspect execution evidence sufficient to distinguish candidate-set restriction from internal
  over-fetch/rejection; Tier 3 use plan, counter, or instrumentation evidence where available.
- **Test highly selective authorization predicates** — EPA-0006 identifies that as the security-relevant
  case for optimizer/strategy switching.
- **For relational candidates, verify the actual query plan**, not the SQL text alone.
- **Record whether strategy can be pinned.** A strategy that can switch into Shape 3 under restrictive
  predicates **is disqualified for that candidate**.

### Forbidden

- **Do not select, adopt, deploy, or integrate any engine.**
- **Do not modify accepted ADRs** — including ADR-0020 as amended, and ADR-0018 on supersession.
- **Do not modify ADR-0019 or infer Arabic normalization rules.**
- **Do not authorize T-C / T-D / T-E / T-F or any other product implementation.**
- **Do not invent benchmark, latency, capacity, recall, or throughput figures.** Report only
  measurements the bounded probe actually produced, with method and evidence. **Vendor claims are cited
  as claims, never as measurements.**
- **Do not enter a real or confidential corpus.** Synthetic fixtures only.

### Acceptance criteria (MSG-0101 §3)

1. Candidate list explicitly labelled **evaluation-only**; nothing adopted or selected.
2. **The full ADR-0020 authorization predicate used in each probe is recorded.**
3. **Tier-1 query evidence captured for each candidate.**
4. Tier-2/3 evidence captured where exposed; **insufficient evidence recorded as NOT CLEARED**.
5. **Shape-1 vs Shape-3 explicitly distinguished**; post-filter and over-fetch-then-discard stay
   disqualified.
6. Strategy-switching under highly selective authorization **tested, or explicitly NOT CLEARED because
   evidence is unavailable**.
7. **No accepted ADR modified; no implementation task authorized.**
8. COMMS, queue and status reconciled; **stop after reporting if product-level selection would
   otherwise be required.**

### Verification

Documentary/analytical — **no test count unless the probe actually executed something**, in which case
report exactly what ran and how it was observed. Before completion, verify and quote:

```text
git diff --name-only docs/decisions/   -> empty
git status --porcelain                 -> empty after commit
docker availability                    -> restate what was and was not reachable
```

**State per candidate: CLEARED / DISQUALIFIED / NOT CLEARED, with the tier that decided it.**

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and WP-0009 where relevant. Write the checkpoint.

### Stop conditions (MSG-0101 §4)

Stop immediately if execution would require **selecting or adopting a production engine**, **modifying
an accepted ADR**, **entering a real or confidential corpus**, **provisioning an implementation runtime
or production service**, or **inventing or substituting unmeasured evidence**.

**Also stop if `origin/main` moves mid-run** — BLK-0006 is the precedent, and **the scheduler is now
enabled**, so a supervisor cycle can start while other work is in flight. Record the starting HEAD in
checkpoint 1 and re-check before every push.

### Recovery procedure

Re-check Docker reachability by inspection before assuming either answer — **an operator may have
started Docker Desktop in the interval**, which changes what evidence is obtainable. Check which records
already exist before writing a second one.

---

## TASK-0034 — update the retrieval-engine criterion and probe specification for strict Shape-1

### TASK-0034 — result: COMPLETE (2026-08-23)

**Executed by a supervisor-started session** (`runner.lock` pid 24340, acquired 09:17:18Z) against
starting `HEAD = 1451024`, which was **unchanged at commit time** — the mid-run movement boundary did
not fire. **All seven acceptance criteria are MET**, each mapped to evidence in **MSG-0107** §6. Being
documentary it produced **no test count and claims none**, and **the probe was not re-run**, per this
task's own recovery procedure.

**The deliverable is EPA-0006 §4.6 — the criterion in testable form — plus §4.7, three questions
surfaced and none decided.** Every change is **additive and declared**: no existing sentence of EPA-0006
was deleted or reworded, and **`git diff --name-only docs/` is empty**, which is stronger than criterion
5's `docs/decisions/` check.

**What the criterion now says, in the four places the old tier 3 was undecidable:**

1. **The bar is ZERO unauthorized units examined**, shown **invariant across at least three collection
   sizes**. Tier 3 previously required candidates examined be *"bounded by the authorized subset"* — a
   phrase admitting both *"no more numerous than"* and *"a subset of"*, which differ by exactly the
   quantity MSG-0104 measured. **Growth with `N` rather than with selectivity is the signature of a
   traversal bounded by index coverage instead of by authorization.**
2. **Five unit kinds are counted** (S4). **U4** — term postings and vector-index nodes — is the FTS5
   stage MSG-0104 §5.3 could not see into; **U5** — buffers, caches, temporary structures and log lines
   — follows from ADR-0020's Context and from §6.2 carrying **no authorization exception**.
3. **The asymmetry rule: counters can prove failure, never success.** A zero count observes only the
   point where the instrument sits. **A CLEARED verdict therefore requires E1 traversal-bounding plan
   evidence**, and **a plan showing a scan over a structure spanning authorization scopes is
   disqualifying regardless of any counter.** Instrument placement must be recorded and the **maximum**
   count reported as a lower bound — MSG-0104 §4.2's identical-plan **2000 vs 1000** result is why.
4. **An unmeasurable stage is NOT CLEARED by rule**, not by the writer's care. The **negative control is
   mandatory or the run is void** — TASK-0033's control passed at `M=50` and failed at `M=500`/`M=5000`,
   so a single-size run would have cleared a post-filter design.

**The two constraints this task could have blurred both held.**

**Existing evidence was not relabelled.** All nine MSG-0104 verdicts are **reproduced verbatim** in
MSG-0107 §5 so the claim can be checked rather than trusted. **The rejected reading is recorded as
rejected**, carrying the example that gives it teeth: **C1 met the materialization line exactly — zero
unauthorized bodies at every size, under both index designs — while examining 1000 unauthorized rows at
`M=5000`, and it remains NOT CLEARED.**

**One claim was withdrawn, and it is not a verdict.** EPA-0006 §4.3's class-K cell read *"CONFORMS
structurally"*, arguing that *"the candidate set **is** an authorized query result"* — **a statement
about what the query returns, not about what the engine examined**, which is the reading MSG-0105 §2
rejects. It is **annotated, not deleted**; **class K's verdict remains NOT CLEARED**; and the correction
**moves in the strict direction only**, removing a conformance claim and creating none.

**Three questions are referred and none blocks anything** (MSG-0107 §7) — each carries a fail-closed
default, so a future probe can run and return a defensible verdict with all three still open. **The one
with the most leverage is MSG-0106 §4's:** the evidence suggests `U = 0` requires the traversal to open
only structures whose every entry is already authorized, which is a **physical organisation** property
— and **not every conjunct partitions**, since effectivity is a continuous open-ended range and audience
a multi-valued set overlap. It interacts directly with **MSG-0101 §1(1)**, whose word *logical* left
physical organisation open. **Surfaced, not decided.** A third question is stated because it may be the
outcome: **if no class can reach zero**, the response is the Lead's — and **relaxing the bar is
explicitly not proposed**, MSG-0105 §3 forbidding any weakening of AMD-01.

**Nothing was selected, adopted, recommended, installed or deployed. No accepted ADR was touched,
ADR-0019 included, and no Arabic normalization rule was written, inferred or proposed. No implementation
task was marked READY, and no engine became CLEARED.**

> **The line this replaces, retained.** "**Priority:** 1 | **Status:** **READY**" and the specification
> below it. The specification is unchanged and is retained in full, because it is the record of what was
> authorized; only the status has moved.

### TASK-0034 — specification (as issued)

**Priority:** 1 | **Status:** **COMPLETE** (was READY when issued) | **Owner:** Claude Code
**Depends on:** MSG-0105 DECIDED; MSG-0104 (probe evidence); ADR-0020 as amended by AMD-01; EPA-0006 §4.4
**Next eligible task:** none — MSG-0105 §4 requires the resulting criterion to be reconciled and executed under the normal COMMS gate before any implementation authorization
**Type:** architecture / evidence-criterion update — **selects nothing, deploys nothing**

**Specification:** [`MSG-0105-architecture-lead-shape-1-strict-ruling.md`](../comms/MSG-0105-architecture-lead-shape-1-strict-ruling.md) §3–§5, **plus this section.**

### The ruling this task implements, quoted

> **Strict Shape-1 is selected: "examines nothing unauthorized."** … the retrieval engine **must not
> examine, retrieve, inspect, or otherwise process** content that the requesting user is not authorized
> to access. **Authorization must constrain the candidate set before retrieval/search occurs.**
>
> It is **not sufficient** merely to prevent unauthorized content from being materialized or returned
> after the engine has examined it.

**The weaker interpretation proposed in MSG-0104 §6.3 — "materializes no unauthorized content" — is
explicitly rejected as insufficient to clear Shape-1.**

### Objective

Update the **retrieval-engine evaluation criterion** and the **probe specification** so future
conformance evidence **explicitly tests the strict requirement**: that authorization constrains the
engine's candidate set *before* retrieval or search, not merely that unauthorized content is absent
from the returned or materialized result.

### Two things the task must get right

**1. Existing evidence must not be relabelled.** MSG-0105 §3 is explicit. The MSG-0104 verdicts stand
exactly as recorded — SQLite C1/C2/C3 **NOT CLEARED**; class D post-filter **DISQUALIFIED**; classes S,
V, K **NOT CLEARED** pending execution evidence; class H **DISQUALIFIED** under ADR-0022 §1. **Nothing
already measured may be re-presented as conformance under the rejected weaker reading**, and no verdict
may be softened because a new criterion is being written.

**2. This is an interpretation, not a weakening — and not a strengthening either.** MSG-0105 §3: *"This
decision is an interpretation of AMD-01's existing Shape-1 gate. It does not authorize weakening AMD-01
or changing the accepted confidentiality policy."* **The task therefore may not amend ADR-0020, AMD-01,
or any accepted ADR** — it updates the *evaluation criterion and probe specification*, which are
evidence instruments, not policy.

### What the updated criterion must be able to decide

The probe that has already run is the worked example of why this matters: it found an engine whose
results were **indistinguishable from a perfectly conforming engine's**, while examining unauthorized
rows in numbers **growing linearly with the collection**. So the criterion must specify:

- **What observable establishes "examined nothing unauthorized"** — the measurement, not the intent.
  MSG-0104's Tier 3 counters are the existing precedent for what such evidence looks like.
- **What the passing threshold is.** Strict Shape-1 admits no non-zero allowance, so the criterion
  should say plainly whether the bar is *zero unauthorized rows examined* and how that is demonstrated.
- **How absence of evidence is recorded** — `NOT CLEARED`, per MSG-0101 §2 and as MSG-0104 applied it.
- **What an engine must expose** for the question to be answerable at all: plan output, row counters,
  instrumentation. An engine that cannot expose it cannot be cleared, which is itself a finding.

> **One consequence worth surfacing rather than resolving.** Strict Shape-1 asks that unauthorized
> content never be *examined*. Where a single index spans multiple authorization scopes, an index scan
> may touch unauthorized entries even when the predicate is correct — which is what the probe measured.
> **Whether the criterion can be satisfied by query-time predicates alone, or implies something about
> how the projection is physically organised, is a real architectural question.** It interacts with
> MSG-0101 §1(1)'s ruling that "one projection index" means one **logical** projection. **Surface it;
> do not decide it** — deciding it would be an architecture change this task is not authorized to make.

### Forbidden (MSG-0105 §5)

- **No retrieval engine, runtime, or provider selected, adopted, recommended, installed, or deployed.**
- **No product implementation authorized.**
- **No weakening of ADR-0020 or AMD-01**, and **no amendment to any accepted ADR**.
- **No amendment to ADR-0019.**
- **No new production deployment authority.**
- **Do not mark any implementation task READY.**

### Acceptance criteria

1. The criterion states the **strict** requirement in testable terms, quoting MSG-0105 rather than
   paraphrasing it.
2. The probe specification says **what must be measured**, **what evidence counts**, and **what the
   passing bar is**, such that a future probe can return a defensible verdict.
3. **The rejected weaker interpretation is recorded as rejected**, so it cannot quietly return.
4. **All MSG-0104 verdicts are carried forward unchanged**; none is relabelled or softened.
5. **No accepted ADR is modified** — `git diff --name-only docs/decisions/` is empty.
6. Any architectural consequence of strict Shape-1 is **surfaced as a question for the Lead**, not
   decided.
7. COMMS, queue and status reconciled; result reported and stopped for the Lead.

### Verification

Documentary — **no test count**; do not report one. Before completion verify and quote:

```text
git diff --name-only docs/decisions/   -> empty
git status --porcelain                 -> empty after commit
```

Confirm explicitly that the MSG-0104 verdict table is reproduced unchanged.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and EPA-0006 where it carries the §4.4 tier model.
Write the checkpoint.

### Stop conditions

Stop if the updated criterion **cannot be stated without amending an accepted ADR**; if it would
require **selecting or deploying an engine**; if it would require **weakening AMD-01**; or if satisfying
strict Shape-1 provably **requires an architecture decision not yet made** — in that case record the
question and stop, which is the outcome the boxed note above anticipates.

**Also stop if `origin/main` moves mid-run** — BLK-0006 is the precedent and the scheduler is enabled.
Record the starting HEAD in checkpoint 1 and re-check before every push.

### Recovery procedure

Check which records already exist before writing. **Do not re-run the probe** — TASK-0033 is closed and
its evidence stands; this task changes the criterion, not the measurements.

---

## TASK-0035 — physical projection isolation evaluation against strict Shape-1

> **COMPLETE — 2026-08-23. Executed by a supervisor-started session** (`runner.lock` pid 26532,
> acquired 09:57:18Z) against starting `HEAD = f24b21e`, re-checked before every push and unchanged
> throughout. **8/8 acceptance items discharged, each mapped to evidence in MSG-0109 §10.**
>
> **A real probe ran.** `implementation/probes/TASK-0035/probe.mjs` and `probe-output.txt` (354
> lines) are committed as re-readable evidence: **8 isolation designs × 3 collection sizes**, plus a
> staleness measurement, on **SQLite 3.51.3 via `node:sqlite`** — a class-**R test subject**, the only
> engine reachable (`docker: command not found`, re-verified in that session). **The mandatory
> negative control failed** (k-complete at M=50, **0 of 5** at M=500 and M=5000), so the run is valid
> under EPA-0006 §4.6 S8. **TASK-0033's harness was not modified and its probe was not re-run.**
>
> **Result: `U` = 0 is reachable, and only by removing every unauthorized row from the structures the
> traversal opens.** Scope-only partitioning was the **worst** design measured — a structural
> restriction replacing an index one without carrying the rest of the predicate. **The staleness case
> is the finding that matters**: a materialised structure queried after the clock moves **returns**
> unauthorized rows, where every TASK-0033 candidate merely examined and rejected them.
>
> **Nothing is CLEARED. All nine MSG-0104 verdicts are reproduced verbatim and none was altered.**
> `git diff --name-only docs/` is **empty** — no accepted ADR touched, ADR-0019 included. The record
> is **MSG-0109**; EPA-0006 gained an **additive, declared §4.8**. **Three questions referred, none
> blocking. No task is READY.**

**Priority:** 1 | **Status:** **COMPLETE** | **Owner:** Claude Code
**Depends on:** MSG-0107b AUTHORIZED; MSG-0105 (strict Shape-1); MSG-0104 (probe evidence); TASK-0034 criterion; EPA-0006 classes
**Next eligible task:** none — MSG-0107b §5 requires stopping at evidence; **selection remains a later Architecture Lead decision**
**Type:** architecture / evidence evaluation — **selects nothing, deploys nothing**

**Specification:** [`MSG-0107-physical-projection-isolation-evaluation-authorization.md`](../comms/MSG-0107-physical-projection-isolation-evaluation-authorization.md)
(**MSG-0107b** — see the numbering note below), **plus this section.**

> **Two files are numbered MSG-0107.** `-task-0034-execution-record.md` (**MSG-0107a**, the TASK-0034
> record) and `-physical-projection-isolation-evaluation-authorization.md` (**MSG-0107b**, this task's
> authority). **They are complementary, not contradictory** — different subjects entirely — so no stop
> condition applies, as with the MSG-0056 pair. **Neither was renamed**, per MSG-0058 F4. **This task's
> authority is MSG-0107b.** Recorded in MSG-0108.

### The ruling this task evaluates

> **Physical projection isolation/partitioning is part of the strict Shape-1 requirement where
> necessary to guarantee that the retrieval engine does not examine unauthorized content.**
>
> **Query-time predicates alone are insufficient unless execution evidence demonstrates that they
> genuinely prevent examination of unauthorized candidates.**

**This answers the question MSG-0106 §4 surfaced and deliberately did not decide.** The answer is that
physical isolation is in scope where needed — and, critically, that **predicates are not disqualified
in principle**, only unproven without execution evidence.

### Required work (MSG-0107b §2)

1. **Define the physical-isolation patterns** relevant to the governed logical projection — for example
   authorization-scope partitioning, or equivalent physical candidate-set separation — **without
   assuming a particular technology.**
2. **Evaluate each applicable EPA-0006 candidate class** against the strict Shape-1 requirement.
3. **Distinguish logical projection from physical organization.** **Do not reinterpret MSG-0101 §1(1)
   as requiring one physical index or one physical store** — it rules that "one projection index" means
   one *logical* projection, and that ruling stands.
4. **Produce evidence showing whether an architecture can prevent unauthorized candidates from being
   examined before retrieval/search**, rather than merely preventing their return or materialization.
5. **Identify what execution evidence is required to clear a candidate**, and **what cannot be
   established from documentation alone.**
6. **Preserve the MSG-0104 verdicts** unless new evidence actually meets the strict criterion. **Do not
   relabel existing evidence.**
7. **Record disqualifiers and remaining evidence gaps explicitly.**

### Candidate scope (MSG-0107b §3)

EPA-0006 classes as applicable: **relational/R** (already observed), **search/S**, **vector/V**,
**kernel/K**, **lexical/L**, and any other class that can materially satisfy the governed retrieval
boundary.

> **The prior SQLite result is evidence against the tested configuration, not proof that all relational
> engines fail.** MSG-0107b §3 says so explicitly. It remains **NOT CLEARED**, and the class is not
> disqualified by it — a distinction the evaluation must hold, since the probe tested three query
> shapes on one engine with two index designs, not a class.

### The bar, from TASK-0034

The criterion TASK-0034 produced makes strict Shape-1 testable and **the bar is zero** — zero
unauthorized candidates examined. Use it; do not restate it more loosely, and do not introduce a
tolerance the ruling does not contain.

### Forbidden (MSG-0107b §4)

- **No engine, runtime, provider, model, index technology, or physical implementation is selected.**
- **No product implementation or deployment authorized.**
- **No real or confidential corpus** — synthetic fixtures and execution evidence are preferred.
- **Do not weaken ADR-0020 / AMD-01.** **Do not amend ADR-0019.**
- **Do not create a new production architecture decision** merely to record evaluation findings, unless
  separately authorized.
- **Stop at evidence and recommendation / NOT CLEARED status.** Do not mark any implementation task
  READY, and **do not self-authorize the next implementation or technology-selection step.**

### Required output (MSG-0107b §5) — a numbered COMMS execution record carrying, per candidate

- **candidate architecture / class**;
- **physical-isolation strategy evaluated**;
- **whether strict Shape-1 can be demonstrated**;
- **evidence / instrumentation used**;
- **limitations and unmeasured behaviour**;
- **verdict: CLEARED / NOT CLEARED / DISQUALIFIED**;
- an **explicit statement that no technology was selected or deployed.**

### Verification

Report only what was actually measured, with method — **invent no benchmark, latency, capacity, recall
or throughput figures**, and cite vendor claims **as claims**. Where an engine cannot be executed,
**say so and record NOT CLEARED**; absence of evidence is not conformance.

Before completion verify and quote:

```text
git diff --name-only docs/decisions/   -> empty
git status --porcelain                 -> empty after commit
```

**Reproduce the MSG-0104 verdict table unchanged**, and state explicitly which verdicts (if any) new
evidence altered and why.

### Environment note — check, do not assume

**SQLite is available embedded in Node via `node:sqlite`** (MSG-0103), which is how TASK-0033 obtained
Tier 2/3 evidence. **Docker Desktop is installed but its Linux backend was unreachable** at last check;
**re-check rather than assuming either state** — an operator may have started it.

**Install nothing.** No `docker pull`, no `npm install`, no `pip install`. **Do not start Docker
Desktop** — that is an operator action.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and EPA-0006 where relevant. Write the checkpoint.

### Stop conditions

Stop if evaluation would require **selecting or deploying a technology**, **weakening AMD-01**,
**amending an accepted ADR**, **entering a real corpus**, or **inventing unmeasured evidence** — and if
clearing any candidate would require an architecture decision not yet made, **record the question and
stop.**

**Also stop if `origin/main` moves mid-run** — BLK-0006 is the precedent and the scheduler is enabled.
Record the starting HEAD in checkpoint 1 and re-check before every push.

### Recovery procedure

Check which records already exist before writing. **Do not re-run the TASK-0033 probe** — its evidence
stands and is committed; this task evaluates isolation strategies, and may extend the probe only where
new evidence is actually needed.

---

## TASK-0036 — encode Q4/Q5/Q6 as strict Shape-1 clearance gates in the EPA-0006 probe specification

**Priority:** 1 | **Status:** **COMPLETE** — 2026-08-23, **8/8 acceptance criteria MET** | **Owner:** Claude Code
**Depends on:** MSG-0110 DECIDED; MSG-0109 (TASK-0035 evidence); TASK-0034 criterion; MSG-0105 strict Shape-1
**Next eligible task:** none — MSG-0110 §6 requires stopping at the evidence-instrument update and the COMMS record
**Type:** evidence-instrument update — **no ADR change, no technology selected**
**Execution record:** [`MSG-0112-task-0036-execution-record.md`](../comms/MSG-0112-task-0036-execution-record.md) · **Checkpoint:** [`checkpoints/TASK-0036.md`](checkpoints/TASK-0036.md)

> **OUTCOME — 2026-08-23. Executed by a supervisor-started session** (`runner.lock` pid 25120,
> acquired 13:17:18Z) against starting `HEAD = f984b9c`, **unchanged at commit time**.
>
> **The deliverable is EPA-0006 §4.9** — **G-Q4**, **G-Q5** and **G-Q6**, each quoting MSG-0110 rather
> than paraphrasing it, each with what evidence counts, what falsifies it, and **NOT CLEARED** as the
> consequence of *not demonstrated*. **All three are necessary conditions and none is sufficient**:
> §4.6 S6's E1–E4 remains the clearance bar. Documentary — **no test count and none claimed**;
> **neither the TASK-0033 nor the TASK-0035 probe was re-run.**
>
> **The change to EPA-0006 is purely additive: 272 insertions, 0 deletions**, and no existing sentence
> of it was deleted or reworded. **`git diff --name-only docs/` is empty**, stronger than criterion 6's
> `docs/decisions/` check. `### 4.9` occurs **exactly once**.
>
> **Nothing is CLEARED and no verdict moved.** The **nine** MSG-0104 verdicts and the **eight**
> TASK-0035 design verdicts are reproduced unchanged in MSG-0112 §6, and **no figure in the record is
> new**.
>
> **The staleness subtlety MSG-0111 §4 anticipated is real, and it was verified rather than assumed.**
> A search for `stale` across the whole authoritative `docs/` tree finds **no numeric bound anywhere**:
> ADR-0020 §1 names the threshold, and ADR-0020's ***Deliberately not decided here*** calls it *"an
> operational parameter, tuned with real evidence."* **So G-Q5.1 is written as a STRUCTURAL gate — a
> bound exists, is enforced, and its breach triggers abstention A7 — and it says so in its own text.
> No number was chosen**; the gap is referred as **Q7**. **It blocks nothing**: the structural gate
> **fails P4S by demonstration**, and is strictly stronger than the construction-only evidence G-Q6
> rejects.
>
> **Do not re-run this task.** §4.9 exists; re-running would insert a second copy of the same
> clearance-gate section — the double-application hazard MSG-0097 recorded for TASK-0031. **Check for
> `### 4.9` in EPA-0006 first.**

**Specification:** [`MSG-0110-architecture-lead-rulings-task-0035-referrals.md`](../comms/MSG-0110-architecture-lead-rulings-task-0035-referrals.md) §2–§6, **plus this section.**

### The three rulings to encode

**Q4 — partition routing must not itself examine.** *"Partition routing must be computed from the
requesting subject's own entitlements. It must not discover partitions by enumerating a catalogue of
structures whose identifiers or metadata may encode authorization attributes belonging to other
subjects."* **Partition selection must not become an unauthorized examination step**, and the
logical/physical distinction is unchanged — **this does not require one physical index or store.**

**Q5 — temporal materialisation is NOT CLEARED unless both are demonstrated.** (1) its
**re-materialisation interval is bounded** per ADR-0020 §1's staleness discipline, **and** (2) the
**ADR-0020 §3.2 post-retrieval re-check against the kernel is demonstrated to run.** The TASK-0035
staleness evidence is **decisive against clearing a stale materialisation** — after the clock moved the
design examined unauthorized rows and **returned 5 of 5**. **No relaxation or new tolerance is
authorized.**

**Q6 — construction alone cannot satisfy E3.** Structural confinement *"may contribute to the evidence
package only when the candidate provides demonstrable evidence that the stage genuinely cannot reach
outside the confined structure."* **Documentation describing an intended partition boundary is not
execution evidence of the engine's actual traversal boundary.** Until such evidence exists, the
candidate remains **NOT CLEARED**.

### Required work (MSG-0110 §6)

1. **Make computed-only partition routing testable** — state what evidence shows routing was derived
   from the subject's entitlements rather than by catalogue enumeration, and what would falsify it.
2. **Make bounded re-materialisation plus a demonstrated kernel re-check a prerequisite** for clearing
   temporal materialisation — both conditions, not either.
3. **Require execution evidence for opaque-stage confinement**, not construction-only claims.
4. **Preserve all existing verdicts.**
5. **Stop at the evidence-instrument update and the COMMS execution record.**

### Do not invent a staleness number

MSG-0110 §3 is explicit: *"This ruling does not invent a new numeric staleness threshold; the existing
ADR-0020 threshold remains authoritative."*

**ADR-0020 §1 states the discipline** — *"a stale index beyond threshold triggers abstention (A7),
never a stale answer"* — and **§3.2 states the re-check**: *"every hit is re-authorized against its
version's classification…"*. **Reference them; do not restate them numerically.**

> **One subtlety to surface rather than resolve.** ADR-0020 §1 names a *threshold* without this task
> being authorized to fix its value. If no numeric bound is fixed anywhere in the accepted set, then
> "bounded" can be tested **structurally** — that a bound exists, is enforced, and triggers abstention —
> but **not numerically**. **Say which of those the gate actually tests**, and if a numeric value is
> genuinely absent, **record it as a question for the Lead rather than choosing one.** Choosing one
> would be inventing the tolerance MSG-0110 §3 forbids.

### Forbidden (MSG-0110 §5)

- **No candidate is cleared by this task**, and **no existing verdict may be altered** — TASK-0035's
  nine MSG-0104 verdicts stand, and **SQLite/class-R configurations remain NOT CLEARED**.
- **No engine, runtime, provider, model, index technology or physical implementation is selected.**
- **No product implementation or deployment is authorized**, and no implementation task may be marked
  READY.
- **Do not change accepted ADR-0020** — or any accepted ADR, ADR-0019 included. This updates the
  **probe specification and evidence gates**, which are instruments.
- **Do not weaken strict Shape-1** or introduce a tolerance the rulings do not contain.

### Acceptance criteria

1. Q4, Q5 and Q6 each appear as an **explicit, testable clearance requirement**, quoting MSG-0110
   rather than paraphrasing the rulings.
2. For each, the specification says **what evidence counts, what falsifies it, and what "not
   demonstrated" yields** — which is **NOT CLEARED**, never assumed conformance.
3. **Q5 requires both conditions**; a specification that clears on one is wrong.
4. **Q6 rejects construction-only claims** explicitly, so the weaker reading cannot return.
5. **All existing verdicts reproduced unchanged.**
6. **No accepted ADR modified** — `git diff --name-only docs/decisions/` is empty.
7. Any unresolved question (see the staleness note) is **surfaced for the Lead, not decided**.
8. COMMS, queue and status reconciled; stop and report.

### Verification

Documentary — **no test count** unless something was executed. Before completion verify and quote:

```text
git diff --name-only docs/decisions/   -> empty
git status --porcelain                 -> empty after commit
```

**Reproduce the verdict table unchanged** and state explicitly that nothing was cleared.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and **EPA-0006** where it carries the §4.4 tier model
and the evidence gates. Write the checkpoint.

### Stop conditions

Stop if encoding a gate **would require amending an accepted ADR**, **selecting a technology**,
**fixing a numeric threshold not already accepted**, or **weakening strict Shape-1**. If a gate cannot
be made testable without one of those, **record the question and stop** — that is the outcome the
staleness note anticipates.

**Also stop if `origin/main` moves mid-run** — BLK-0006 is the precedent and the scheduler is enabled.
Record the starting HEAD in checkpoint 1 and re-check before every push.

### Recovery procedure

Check which records already exist before writing. **Do not re-run the TASK-0033 or TASK-0035 probes** —
their evidence stands and is committed; this task changes the specification, not the measurements.

---

## TASK-0037 — version-transition freshness and stale-version fail-closed evidence

> **EXECUTED AND COMPLETE — 2026-08-23. 8/8 acceptance criteria MET; record: [`MSG-0115`](../comms/MSG-0115-task-0037-version-transition-freshness-execution-record.md).**
> Run by a supervisor-started session (`runner.lock` pid 27556, acquired 18:57:17Z) against starting
> `HEAD = 57732ac`. **A probe was built and executed** — harness and captured output at
> `implementation/probes/TASK-0037/`, **264 measured cases** (8 designs × 11 scenarios × 3 collection
> sizes, less one n/a pair) at **two instrument placements each**. **The negative control failed as
> required**, and the **adversarial precondition caught a genuine defect in this probe's own first
> fixture** and declared that run VOID rather than reporting its numbers.
>
> **Nothing is CLEARED** — **7 NOT CLEARED, 1 DISQUALIFIED**. **The discriminator this section demanded
> was built and it fired**: the two timer-only designs returned the **superseded** version before the
> periodic refresh and the correct one after. **`git diff --name-only docs/` is empty**; **EPA-0006
> gained an additive §4.10 — 122 insertions, 0 deletions**; **TASK-0033 and TASK-0035 were neither
> modified nor re-run**; **no numeric threshold was introduced.**
>
> **The result most likely to be misread:** one design scores **11/11** on the freshness grid, meeting
> **both** G-Q5 conditions and every G-Q7 requirement, and is **NOT CLEARED** — on **E2** (`U` = 4 > 0),
> **E4** (not obtained) and **G-Q4** (not measured). **G-Q5 and G-Q7 are prerequisites, not clearances.**
>
> **The section below is retained exactly as issued**, because it is the specification the task was
> executed against.

**Priority:** 1 | **Status:** **COMPLETE** (was READY when issued) | **Owner:** Claude Code
**Depends on:** MSG-0113 DECIDED; EPA-0006 §4.9 gates (G-Q4/G-Q5/G-Q6); the committed TASK-0033 and TASK-0035 probe harnesses
**Next eligible task:** none — MSG-0113 §5 requires stopping at evidence and clearance status
**Type:** evidence probe — **selects nothing, deploys nothing**

**Specification:** [`MSG-0113-architecture-lead-q7-freshness-security-ruling.md`](../comms/MSG-0113-architecture-lead-q7-freshness-security-ruling.md) §2–§5, **plus this section.**

### What Q7 turned out to be

**Freshness is a version-transition property, not an elapsed-time SLA.** MSG-0113 §1:

> When an authorized policy or procedure is **manually updated, approved, revoked, or superseded**, the
> previous version **must no longer be used** for employee answers **once the change is recorded**. …
> If the current approved version cannot be established or made available to retrieval, the system
> **must abstain** rather than answer from the stale version.

**This is why no numeric threshold was ever the right answer**, and it retires the question MSG-0112
referred as Q7. A timer measures how long ago a structure was rebuilt; the requirement is about
**whether the authoritative version changed**, which a timer cannot observe.

**No numeric threshold is introduced.** MSG-0113 §2 permits evaluating a time bound **only** if a
candidate architecture needs one as an enforcement mechanism, and **it must not replace the business
requirement.**

### The six mechanism properties to evidence (MSG-0113 §2)

1. **The governance/kernel record is authoritative** for the current approved version and lifecycle
   state.
2. **A transition invalidates or supersedes the retrievable prior version as part of the recorded
   transition** — not by a periodic timer.
3. **Retrieval resolves against the current approved version**; stale materialisation is **not
   authoritative** after the transition is recorded.
4. **If the new approved version is unavailable to retrieval, the answer path abstains.**
5. **The kernel re-check remains mandatory** and must be demonstrated **against the authoritative
   current state**.
6. **Any physical or partitioned representation must carry sufficient version/lifecycle identity to
   prove the candidate is current.** **Physical isolation does not excuse stale-version use.**

### Required execution evidence (MSG-0113 §3) — at minimum

- an approved-version transition **V1 → V2**;
- **V1 is usable before** the transition;
- **after the authoritative transition is recorded, V1 is not usable** for an employee answer;
- **V2 is used when available**;
- **if V2 is unavailable, retrieval/answering abstains** rather than falling back to V1;
- **revocation and supersession exercise the same fail-closed behaviour**;
- **the kernel re-check observes the authoritative lifecycle/version state**;
- **any materialised or partitioned index is shown not to permit stale V1 use after the transition.**

> **The discriminator, and the thing most likely to be got wrong.** MSG-0113 §3: *"Evidence must
> distinguish **transition-triggered** freshness from ordinary **periodic re-materialization**. Passing
> a fixed-time test alone does not establish the requirement."*
>
> **A design that re-materialises every N seconds will pass a naive V1→V2 test** simply by waiting —
> and will still be wrong, because nothing tied the refresh to the transition. **The probe must show
> the transition itself causes V1 to become unusable**, which means testing at a moment when a timer
> would *not* have fired. Design the fixture so a periodic design fails and a transition-triggered one
> passes; otherwise the evidence proves nothing.

### This directly extends TASK-0035's finding

TASK-0035 measured a materialised design that, once stale, **returned 5 of 5 unauthorized rows** —
a leaking failure rather than a conservative one. **MSG-0113 §2(6) is the rule that closes it**:
physical isolation does not excuse stale-version use, and the representation must carry version
identity sufficient to prove currency.

**So the natural subject is the same class-R harness**, extended with lifecycle/version transitions.
**Reuse the committed probe harnesses where they fit; do not rebuild them, and do not re-run their
existing cases** — that evidence stands.

### Environment — check, do not assume

**SQLite is available embedded in Node via `node:sqlite`** and has been the working subject for both
prior probes. **Docker Desktop is installed but its Linux backend was unreachable** at last check —
**re-check rather than assuming either state.**

**Install nothing** — no `docker pull`, `npm install`, or `pip install` — and **do not start Docker
Desktop**, which is an operator action. **Synthetic fixtures only; no real or confidential corpus.**

### Forbidden (MSG-0113 §4)

- **No retrieval engine, runtime, provider, model, index technology or physical implementation is
  selected**, and **nothing is deployed**.
- **No product implementation is authorized**; no implementation task may be marked READY.
- **No accepted ADR is modified.** **Strict Shape-1 remains "examines nothing unauthorized."**
- **G-Q5 receives no numeric threshold** — it is strengthened by Q7's interpretation, not replaced.
- **TASK-0035 and MSG-0104 verdicts remain unchanged**; do not relabel existing evidence.
- **Invent no benchmark, latency, capacity, recall or throughput figures**; report only what was
  measured, with method.

### Acceptance criteria

1. Each of the eight §3 evidence items is **demonstrated or explicitly recorded as not demonstrated**.
2. **Transition-triggered freshness is distinguished from periodic re-materialisation**, with the
   fixture design showing how.
3. **The abstention case is exercised** — V2 unavailable must not fall back to V1.
4. **Revocation and supersession** are tested, not only update.
5. Per candidate: **CLEARED / NOT CLEARED / DISQUALIFIED**, with the evidence that decided it;
   unobtainable evidence is **NOT CLEARED**, never assumed conformance.
6. **All existing verdicts reproduced unchanged.**
7. **No accepted ADR modified** — `git diff --name-only docs/` empty.
8. COMMS, queue and status reconciled; **stop at evidence and clearance status**.

### Verification

Report only measured results, with method and instrumentation. Before completion verify and quote:

```text
git diff --name-only docs/    -> empty
git status --porcelain        -> empty after commit
```

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and EPA-0006 where the gates live. Commit probe source
and output so the result is reproducible, as TASK-0033 and TASK-0035 did. Write the checkpoint.

### Stop conditions

Stop if evidence would require **selecting or deploying a technology**, **modifying an accepted ADR**,
**fixing a numeric threshold**, **entering a real corpus**, or **inventing unmeasured evidence** — and
if a required property cannot be evidenced without an architecture decision not yet made, **record the
question and stop**.

**Also stop if `origin/main` moves mid-run** — BLK-0006 is the precedent and the scheduler is enabled.
Record the starting HEAD in checkpoint 1 and re-check before every push.

### Recovery procedure

Check which records and probe artefacts already exist before writing. **Do not re-run the TASK-0033 or
TASK-0035 cases** — their evidence stands and is committed; this task adds transition cases.

---

## TASK-0038 — kernel-constrained retrieval / non-divergent projection evidence

**Priority:** 1 | **Status:** **COMPLETE** — 2026-08-24, **8/8 acceptance criteria MET** | **Owner:** Claude Code
**Depends on:** MSG-0116a **and** MSG-0116b (Q8/Q9/Q10 rulings); MSG-0115 (TASK-0037 evidence); EPA-0006 §4.6–§4.10 gates
**Next eligible task:** none — both rulings require stopping at evidence and clearance status
**Type:** evidence probe — **selects nothing, deploys nothing**

> **EXECUTED 2026-08-24. Do not re-run.** Deliverables: `implementation/probes/TASK-0038/`
> (`probe.mjs`, 1,376 lines; `probe-output.txt`, 550 lines), **EPA-0006 §4.11** (187 insertions,
> 0 deletions), and **MSG-0118** — the execution record, which carries the full grid and the
> reasoning. Checkpoint: `implementation/operations/checkpoints/TASK-0038.md`.
>
> **Nothing is CLEARED** — 6 NOT CLEARED, 3 DISQUALIFIED. **The question this task was given has a
> negative answer**: a kernel-constrained / in-query authorization path **eliminates divergence
> entirely and does nothing whatever for strict Shape-1.** **No task is READY**; the next action is
> the Architecture Lead's, and MSG-0116a §3 already states what it is — *"if no candidate can satisfy
> the existing gates, the project must return to Q3 … the failure does not authorize relaxing
> Shape-1."* **No candidate satisfied the gates.**
>
> **A session resuming here must not re-run this task.** EPA-0006 already contains `### 4.11`; a
> re-run would insert a second copy — the double-application hazard MSG-0097 recorded for TASK-0031.
> **Check `grep -c "^### 4.11"` before writing anything.**

**Specification — TWO files are numbered MSG-0116, both authoritative, read BOTH:**

- [`MSG-0116-architecture-lead-rulings-q8-q10.md`](../comms/MSG-0116-architecture-lead-rulings-q8-q10.md) — **MSG-0116a**
- [`MSG-0116-architecture-lead-q8-q10-rulings.md`](../comms/MSG-0116-architecture-lead-q8-q10-rulings.md) — **MSG-0116b**

> **They agree on all three rulings and on the next action** — checked clause by clause before this task
> was queued — so **no stop condition fired**, unlike the MSG-0020 pair which contradicted. **They are
> not interchangeable**: each carries constraints the other omits, and **everything below is the
> union.** Neither was renamed, per MSG-0058 F4. Recorded in MSG-0117.

### Q8 — the kernel re-check is not "examination", under conditions

**Both rule NO**: the mandatory ADR-0020 §3 point-2 re-check does not violate strict Shape-1 **provided
it reads only authoritative authorization / version / lifecycle metadata and does not inspect
unauthorized content.**

**From MSG-0116a:** the re-check is **mandatory**, must consult **authoritative current state rather
than a materialized copy**, and **the existing measured kernel-read count is not by itself a Shape-1
violation** — the boundary is content examination, not a bounded metadata lookup. A failing candidate
must be **rejected or abstained before its content is used**.

**From MSG-0116b, and this is the operative addition:** the re-check **must be instrumented separately
from retrieval-content examination**, and **evidence must demonstrate it reads only the authoritative
kernel facts required to authorize the candidate**. **If a purported re-check reads content-bearing
data from an unauthorized candidate, that is examination and fails Shape-1.**

**Also from MSG-0116b: no clearance follows from Q8.** **E1–E4 and G-Q4 / G-Q5 / G-Q6 / G-Q7 remain
independently necessary.** Q8 removes an apparent conflict between AMD-01 and ADR-0020 §3; it clears
nothing.

### Q9 — the bar is not relaxed

**Both rule: do not lower it.** `U = 0` and E1–E4 stand. Specifically (MSG-0116a):

- **Do not treat a non-zero result as acceptable because it is invariant with collection size.**
- **Do not select an engine on the assumption that an unmeasured kernel join will solve the problem.**
- **If no candidate can satisfy the gates, return to EPA-0006 §4.7 Q3 for an explicit architectural
  response — the failure does not authorize relaxing Shape-1.**

**MSG-0116b records the precise status to preserve:** **A6 satisfied the freshness gates and remained
NOT CLEARED** because **E2 failed, E4 was not obtained, and G-Q4 was not measured.** Carry that
distinction; "passed freshness" is not "cleared".

**What this task investigates** is the alternative MSG-0115 identified and did not measure: **a
kernel-constrained / in-query authorization path, and/or an architecture that prevents
security-relevant projection divergence** — whether it can obtain **E1–E4 and G-Q4 evidence without
examining unauthorized content.**

### Q10 — "current approved version" means currently effective

**Both rule the strict, fail-closed interpretation.** **APPROVED but not yet PUBLISHED/effective is not
answerable.** **WITHDRAWN, revoked or superseded versions are not current.** **If the current effective
version cannot be established or made available, abstain** rather than fall back.

**MSG-0116a adds:** the **citation/version identity must identify the actual current document
version**, consistent with ADR-0018's requirement that a citation names a *version*, not merely a
document.

**Both state this is a terminology clarification for Q7 and does NOT amend ADR-0018.** MSG-0116b adds
that **any formal lifecycle change remains an ADR question.**

### Forbidden (both rulings, §5 / "Next authorized action")

- **No engine, runtime, provider, model, index technology or product is selected, adopted, installed,
  deployed or recommended.**
- **Do not relax `U = 0`, E1–E4, or strict Shape-1.**
- **No accepted ADR is modified** — ADR-0018 and ADR-0020 included.
- **Existing NOT CLEARED and DISQUALIFIED verdicts remain unchanged.**
- **No implementation or deployment authorized**; no implementation task may be marked READY.
- **Invent no benchmark, latency, capacity, recall or throughput figures.**

### Acceptance criteria

1. The kernel-constrained / non-divergent alternative is evaluated with **execution evidence**, not
   design argument.
2. **E1–E4 and G-Q4 are each addressed** — obtained, or explicitly recorded as not obtained.
3. **The re-check is instrumented separately from content examination**, with evidence it reads only
   authoritative kernel facts (MSG-0116b).
4. **Any content-bearing read from an unauthorized candidate is reported as a Shape-1 failure.**
5. Per candidate: **CLEARED / NOT CLEARED / DISQUALIFIED**, with the evidence that decided it;
   unobtainable evidence is **NOT CLEARED**.
6. **All existing verdicts reproduced unchanged**, including A6's freshness-passed-but-NOT-CLEARED
   status.
7. **No accepted ADR modified** — `git diff --name-only docs/` empty.
8. COMMS, queue and status reconciled; **stop at evidence and clearance status.**

### Environment — check, do not assume

**SQLite via `node:sqlite`** has been the working subject for all three prior probes. **Docker's Linux
backend was unreachable** at last check — **re-check rather than assuming.** **Install nothing** and
**do not start Docker Desktop** (operator action). **Synthetic fixtures only.**

**Reuse the committed TASK-0033 / TASK-0035 / TASK-0037 harnesses** where they fit; **do not re-run
their existing cases** — that evidence stands.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and EPA-0006 where the gates live. Commit probe source
and output for reproducibility, as the prior probes did. Write the checkpoint.

### Stop conditions

Stop if evidence would require **selecting or deploying a technology**, **modifying an accepted ADR**,
**relaxing any gate**, **entering a real corpus**, or **inventing unmeasured evidence** — and **if no
candidate can satisfy the gates, record that and return the question to EPA-0006 §4.7 Q3** rather than
proposing a relaxation.

**Also stop if `origin/main` moves mid-run** — BLK-0006 is the precedent and the scheduler is enabled.
Record the starting HEAD in checkpoint 1 and re-check before every push.

### Recovery procedure

Check which records and probe artefacts already exist before writing. **Read both MSG-0116 files** — a
runner reading one will miss either the separate-instrumentation requirement or the citation-version
point.

---

## TASK-0039 — K7/K8 remaining clearance evidence: E4, U1 observability, plan-independence

> **EXECUTED AND COMPLETE — 2026-08-24. 8/8 acceptance criteria MET; record: [`MSG-0123`](../comms/MSG-0123-task-0039-k7-k8-clearance-evidence-execution-record.md); evidence: EPA-0006 §4.12 and `implementation/probes/TASK-0039/`.**
> **Nothing is CLEARED — K7 and K8 are both NOT CLEARED.** E4 **UNOBTAINABLE** (enumerated, not
> inferred); E2 **NOT OBTAINED** (`U1` lower bound rises with `N`); E1's **confinement** limb **not**
> plan-independent, though its **reachable-structure** limb **is**. **No task is READY**, and none was
> marked so. **The section below is the specification as issued and is retained unchanged.**

**Priority:** 1 | **Status:** **COMPLETE** (2026-08-24) | **Owner:** Claude Code
**Depends on:** MSG-0120 AUTHORIZED; MSG-0119 (strict Q11); MSG-0118 (TASK-0038 evidence); EPA-0006 §4.6–§4.11
**Next eligible task:** none — MSG-0120 requires stopping at evidence and clearance status
**Type:** evidence probe — **selects nothing, deploys nothing**

**Specification:** [`MSG-0120-task-0039-k7-k8-clearance-evidence-authorization.md`](../comms/MSG-0120-task-0039-k7-k8-clearance-evidence-authorization.md),
with [`MSG-0119`](../comms/MSG-0119-architecture-lead-q11-e1-ruling.md) binding, **plus this section.**

### Why K7/K8 and why now

**MSG-0119 ruled Q11 strictly**: an exact-key seek into a scope-spanning structure **does not satisfy
E1**, even though it touches only an entitled row. **K3 and K4 stay NOT CLEARED** under that reading.

**K7 and K8 are unaffected** — their version and chunk stores are **physically partitioned**, so they
satisfy E1 **under both readings**, which is exactly what TASK-0038 reported. **They are the only
candidates whose E1 position is not in question**, which is why the remaining gaps are worth closing on
them specifically.

### The three gaps to close (MSG-0120 §Scope)

1. **Obtain or explicitly establish the missing E4 engine-log evidence.**
2. **Address the index-entry observability limitation (`U1`) without claiming an unsupported zero.**
3. **Determine whether K7/K8 can satisfy E1–E4 and G-Q4 with evidence independent of a single observed
   optimizer plan**, where independence is required.

### The three ways this task most plausibly goes wrong

**These are the boundaries MSG-0120 states; they are repeated here because each is a tempting shortcut
that would produce a false pass.**

**1. Absence of observation is not observation of absence.** MSG-0118 recorded that the test subject
**cannot observe index-entry reads**. MSG-0120: *"Do not claim `U1 = 0` when the test subject cannot
observe index-entry reads."* **An unmeasurable quantity is not a zero quantity.** If `U1` cannot be
observed, say so and let the affected gate stand **NOT CLEARED** — that is the correct result, not a
failure of the probe.

**2. Missing logs may not be inferred.** MSG-0120: *"Do not infer engine-log evidence that is
unavailable."* If E4 evidence cannot be obtained from this engine, **record E4 as not obtained.**
Reconstructing what a log *would* have shown is exactly the substitution the E-gates exist to prevent.

**3. One plan is not plan-independence.** A single `EXPLAIN QUERY PLAN` shows what the optimizer chose
**on that occasion, for that fixture, at that size** — not what it will always choose. **Where item 3
requires evidence independent of a single observed plan, one observation does not satisfy it.**
Establishing plan stability, or recording that it could not be established, is the work.

**And one carried forward from earlier rulings:** MSG-0120 forbids generalizing **SQLite/`node:sqlite`
planner behaviour to other engines without evidence.** Whatever K7/K8 achieve here is evidence about
**this test subject in this configuration** — a point TASK-0033's verdict already had to make, and the
same discipline applies now that a candidate looks promising rather than doomed.

### Forbidden (MSG-0120 §Boundaries)

- **No engine, runtime, provider, model or index technology selection.** No implementation or
  deployment.
- **No relaxation of strict Shape-1, `U = 0`, E1–E4, G-Q4, Q8, Q10 or Q11.**
- **Unauthorized examination remains disqualifying.**
- No accepted ADR may be modified; no implementation task may be marked READY.
- **Invent no benchmark, latency, capacity, recall or throughput figures.**

### Acceptance criteria (MSG-0120 §Acceptance)

1. **Per-candidate evidence and verdicts** — CLEARED / NOT CLEARED / DISQUALIFIED, each with the
   evidence that decided it.
2. **Any required evidence that remains unobtainable yields NOT CLEARED, not an inferred pass.**
3. **E4** is obtained, or **explicitly established as unobtainable**, with the reason.
4. **`U1`** is measured, or its unobservability is **recorded as a limitation** — **never reported as
   zero**.
5. **Plan-independence** is demonstrated where item 3 requires it, or its absence is recorded.
6. **The strict Q11 interpretation is preserved**; K3/K4 remain NOT CLEARED.
7. **All existing verdicts reproduced unchanged**; `git diff --name-only docs/` empty.
8. COMMS, queue and status reconciled; **stop at evidence and clearance status.**

### Environment — check, do not assume

**SQLite via `node:sqlite`** has been the only reachable subject for all four probes; TASK-0038
re-checked and found **`docker` not on the runner's PATH**. **Re-check rather than assuming** — and
**install nothing**, **start nothing**, **no network, no corpus**, `:memory:` only.

**Reuse the committed TASK-0033 / 0035 / 0037 / 0038 harnesses**; **do not re-run their existing
cases** — that evidence stands, and TASK-0038's apparatus already encodes the gates.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and EPA-0006 where the gates live. Commit probe source
and output for reproducibility. Write the checkpoint.

### Stop conditions

Stop if evidence would require **selecting or deploying a technology**, **modifying an accepted ADR**,
**relaxing any gate**, **inferring unavailable evidence**, or **entering a real corpus**. **If K7/K8
cannot be cleared, record that** — MSG-0119 is explicit that **failure does not authorize weakening the
gates**, and the question returns to EPA-0006 §4.7 Q3.

**Also stop if `origin/main` moves mid-run** — BLK-0006 is the precedent and the scheduler is enabled.
Record the starting HEAD in checkpoint 1 and re-check before every push.

### Recovery procedure

Check which records and probe artefacts already exist before writing. **Do not re-run prior cases**;
this task closes named gaps on two named designs.

---

## TASK-0040 — encode Q12 in EPA-0006 §4.6 S7: reachable index-cursor placements must be exercised

**Priority:** 1 | **Status:** **COMPLETE** — 2026-08-24, **8/8 acceptance criteria MET**; execution record **MSG-0127**; checkpoint `implementation/operations/checkpoints/TASK-0040.md` | **Owner:** Claude Code
**Depends on:** MSG-0125 AUTHORIZED; MSG-0124 (Q12); MSG-0123 (TASK-0039 evidence); TASK-0034's criterion-update precedent
**Next eligible task:** none — MSG-0125 requires stopping after the update and its verification; **the next evidence action must be separately authorized**
**Type:** criterion / evidence-instrument update — **no ADR change, nothing selected**

**Specification:** [`MSG-0125-task-0040-s7-update-authorization.md`](../comms/MSG-0125-task-0040-s7-update-authorization.md),
with [`MSG-0124`](../comms/MSG-0124-architecture-lead-q12-s7-criterion-ruling.md) binding, **plus this section.**

### What Q12 decided

> **When the engine exposes a reachable index-cursor placement, the probe must exercise that placement
> in addition** to other applicable placements.

**A criterion decision — not an engine selection and not implementation authority.** The strict
Shape-1 / E2 bar is **not relaxed**, and **K7 and K8 remain NOT CLEARED** (MSG-0123).

### The three requirements S7 must carry (MSG-0125)

1. **Every reachable index-cursor placement exposed by the test subject must be exercised**, in
   addition to other applicable placements.
2. **The maximum observed result across the exercised applicable placements is what gets reported.**
3. **Row-access-only `U = 0` is insufficient for E2** when a reachable index-cursor placement exists
   but has **not** been exercised.

### The inference this closes, and why it matters

**A row-access counter can read zero while an index cursor is walking entries the subject may not
see.** MSG-0125 forbids the shortcut in terms: *"Do not claim that a row-access zero proves
index-cursor zero."*

**That is the same error shape the project has now hit repeatedly** — treating what an instrument
cannot observe as evidence that nothing happened. It appeared as the `U1` limitation in TASK-0038/0039,
and as my own PATH and CLI mistakes before that. **S7 must make the omission itself disqualifying**,
not merely noted: an unexercised reachable placement means **E2 is not satisfied**, regardless of how
clean the row-access number looks.

### Required method (MSG-0125)

- **Follow TASK-0034's precedent: additive and declared.** That update was **272 insertions, 0
  deletions**. **Do not silently rewrite unrelated text** — if existing S7 wording must change, the
  change is stated rather than absorbed.
- **Preserve the existing strict Shape-1 and E1–E4 clearance bar.**
- **Do not modify any accepted ADR.**
- **Preserve all existing verdicts, and do not re-run prior probes** merely because the criterion is
  being encoded. TASK-0033/0035/0037/0038/0039 evidence stands.
- **Reconcile queue, COMMS register and status consistently.**
- **Verify the post-change EPA-0006 content from `main`** — not from the working tree — **and record the
  exact change statistics.**

> **On that last point.** MSG-0125 asks for verification against `main` specifically. Read the committed
> object after pushing — `git show origin/main:implementation/architecture/EPA-0006-*.md` — rather than
> trusting the local file. It is a small step that distinguishes "I wrote it" from "it is published",
> and this project has had a push rejected mid-run before (BLK-0006).

### Forbidden (MSG-0125)

- **No engine, runtime, provider, model or index technology selection.** No implementation or
  deployment.
- **No weakening of E2, strict Shape-1, `U = 0`, E1–E4, G-Q4, Q8, Q10 or Q11.**
- **Do not claim that a row-access zero proves index-cursor zero.**
- **Do not create a numeric tolerance or threshold.**
- No implementation task may be marked READY.

### Acceptance criteria

1. S7 carries all three requirements **explicitly and testably**, quoting MSG-0124 rather than
   paraphrasing it.
2. **The insufficiency rule is stated as disqualifying** — an unexercised reachable index-cursor
   placement means E2 is **not** satisfied.
3. **"Maximum observed across exercised applicable placements"** is stated as the reported figure.
4. **The change is additive and declared**, in the TASK-0034 manner; any non-additive edit is called out.
5. **No accepted ADR modified** — `git diff --name-only docs/` empty.
6. **All existing verdicts reproduced unchanged**, K7/K8 NOT CLEARED included; **no prior probe re-run**.
7. **Post-change EPA-0006 verified from `main`**, with **exact change statistics recorded**.
8. COMMS, queue and status reconciled; **stop after the update and its verification.**

### Verification

Documentary — **no test count**; nothing is executed. Before reporting completion, verify and quote:

```text
git diff --name-only docs/                          -> empty
git status --porcelain                              -> empty after commit
git show origin/main:implementation/architecture/... -> the S7 text as published
insertions / deletions for EPA-0006                  -> the exact figures
```

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md` and this queue. Write the checkpoint.

### Stop conditions

Stop if encoding Q12 would require **amending an accepted ADR**, **weakening any gate**, **introducing a
numeric threshold**, or **re-running a prior probe to make the criterion fit**. **The next evidence
action is separately authorized** — do not start one.

**Also stop if `origin/main` moves mid-run** — BLK-0006 is the precedent and the scheduler is enabled.
Record the starting HEAD in checkpoint 1 and re-check before every push.

### Recovery procedure

Check whether S7 already carries the Q12 requirements before editing. **Encoding it twice would leave
two statements of one rule** — the drift TASK-0030's minimality analysis warned about, where "two
statements invite drift".

### Result — COMPLETE, 2026-08-24

**Executed by a supervisor-started runner** (lock acquired `2026-08-24T10:27:18Z`, starting `HEAD`
`ef8561e`). **Execution record: [`MSG-0127`](../comms/MSG-0127-task-0040-s7-q12-encoding-execution-record.md).**
**Checkpoint: [`TASK-0040.md`](checkpoints/TASK-0040.md).**

**The double-application check ran before any edit, as this section requires**, and it found the rule
absent: `grep -c "^#### S7"` → **1**, and `grep -n "Q12"` returned **only** the three §4.12 referral
hits, **none inside S7**. The edit is a first application.

**What was added — EPA-0006 §4.6 S7.1–S7.4, additive:**

| | |
|---|---|
| **S7.1** | MSG-0124 **quoted verbatim** with its stated consequences; recorded as a **criterion decision, not an engine selection**; gives the opcode-level reason a row-access counter can read zero while an index cursor walks |
| **S7.2** | **S7-R1 / S7-R2 / S7-R3** as a failable table, each with *what discharges it* and *what fails it* |
| **S7.3** | **"Reachable"** defined as *occupiable through the subject's own API and actually exercised*; a "none reachable" report admissible **only by enumeration**, on §4.12 gap 1's control; **unreachability is not relief** |
| **S7.4** | **What this does NOT change**, item by item |

**Acceptance criteria: 8/8 MET.** Evidence per criterion is in MSG-0127 §4.

**Verification, quoted:**

```text
git diff --numstat  (EPA-0006)        -> 98      0
git diff --name-only docs/            -> (empty)
git status --porcelain  (after commit)-> (empty)
grep -c "^##### S7\."  (after edit)   -> 4
```

**Boundaries held.** No engine, runtime, provider, model or index technology selected; **no gate
weakened** (the diff removes no line); **no numeric tolerance or threshold**; **no ADR touched**; **no
probe written, run or re-run and nothing executed at all**; **K7 and K8 remain NOT CLEARED**, K3/K4
unchanged. **No implementation task is READY.**

**One judgement call, declared** (MSG-0127 §7): a six-line **declared pointer note** was also added
under §4.12's Q12 heading, which read *"Surfaced, NOT decided"*. Leaving it would have left the record
ruled in one place and open in another — a documentation conflict. **The heading and every existing
line are untouched**, and the note **points at S7 rather than restating the rule**. TASK-0036 set the
precedent when MSG-0110 landed. If it is judged out of scope it reverts cleanly.

**The run stops here**, as MSG-0125 requires. **The next evidence action must be separately
authorized.**

---

## TASK-0041 — Q3 architecture response: a technology-agnostic retrieval topology that could satisfy the existing gates

**Priority:** 1 | **Status:** **COMPLETE** — 2026-08-24; **8/8 acceptance criteria MET**; record **MSG-0130**/§4.13 | **Owner:** Claude Code

> **Corrected 2026-08-25 (MSG-0162).** This header still read `READY` after the task finished. The **summary row above has said COMPLETE throughout** and is authoritative; see the `### Result` block in this section. **A stale `READY` on a finished task is the signal a supervisor cycle reads to start a runner**, so it is corrected rather than left as cosmetic drift. **Nothing about what the task measured or concluded changes.**
**Depends on:** MSG-0130 AUTHORIZED; MSG-0129 (Q3 DECIDED); MSG-0128, MSG-0123, MSG-0118, MSG-0115, MSG-0109 (evidence); EPA-0006 §4.6–§4.8
**Next eligible task:** none — MSG-0130's acceptance ends at the documented architecture response; **engine selection stays blocked and must be separately authorized**
**Type:** architecture / analysis — **no probe required, nothing selected, no ADR change**

**Specification:** [`MSG-0130-task-0041-q3-architecture-response-authorization.md`](../comms/MSG-0130-task-0041-q3-architecture-response-authorization.md),
with [`MSG-0129`](../comms/MSG-0129-architecture-lead-q3-ruling.md) binding, **plus this section.**

### What Q3 was, and what the Lead ruled

**Q3 was raised by EPA-0006 §4.7 before any probe ran** — *"if no engine class can reach zero, what is
the architectural response?"* — and the record deliberately proposed none. **Five probes later, nothing
has cleared.** MSG-0129 answers:

> **"The response is not to relax the bar and not to select the least-bad engine."**

**The project stays NOT CLEARED for retrieval-engine selection and returns to architecture work.**
`U = 0`, **E1–E4**, **G-Q4/G-Q5/G-Q6** and every other recorded gate **remain mandatory**. Failure of
all tested candidates is evidence that **the space explored so far is insufficient** — it is **not**
authority to weaken AMD-01 or strict Shape-1.

> **This is the branch §4.7 Q3 named third** — *"reconsider the retrieval topology"* — chosen over
> settling what `U` counts (Q1) or accepting physical organisation as a requirement (Q2), **neither of
> which is thereby ruled**. Q1 and Q2 remain open.

### The six required work items (MSG-0130)

1. **Re-read EPA-0006 §4.6–§4.8 and the actual Q3 authority in MSG-0129** — not the summary of it in
   this queue, and not any session's recollection.
2. **Reconcile all prior evidence without relabelling K7/K8 or any other candidate.**
3. **Define technology-agnostic retrieval-topology patterns** that could satisfy the existing strict
   Shape-1 gates.
4. **Map each pattern to E1–E4 and G-Q4/G-Q5/G-Q6**, separating **structurally necessary** properties
   from those **requiring execution evidence**.
5. **Identify the minimum evidence** needed before any future engine-selection task could be authorized.
6. **Produce a bounded architecture recommendation — or preserve the choice as open** if the evidence is
   insufficient.

### Start from §4.8, do not restart the catalogue

**§4.8 already holds a measured pattern catalogue — I0–I6 — with the conjunct each discharges**, and
§4.9–§4.12 hold what happened when they met the gates. **A new catalogue that ignores it would discard
five probes of evidence.** The specific facts a topology proposal must survive:

- **I6 is the one most easily omitted, and omitting it undoes the rest** — a perfectly partitioned base
  paired with **one global lexical or vector index** puts traversal back over a scope-spanning
  structure, which **E1 makes disqualifying regardless of any counter**.
- **I5 (per-principal materialisation) discharges four conjuncts and was never measured.**
- **Removing the copy does not help.** §4.11: the designs holding **no copy at all** carry the
  **largest `U`**, growing with `N`.
- **`U = 0` is purchasable by withholding authorized content** (K4) — a topology that answers nothing
  is not a topology that clears.
- **On the one measured engine class, the planner decided the outcome** (K7 vs K8: one `INDEXED BY`
  token, `U` 715 → 0) **and so did `ANALYZE`** — which is precisely why the answer must be
  **topological rather than engine-behavioural**.
- **A row-access zero is not an index-cursor zero** (§4.6 S7-R3, MSG-0124).

### Boundaries (MSG-0130)

- **No engine, runtime, provider, model or index technology selection.** No implementation, no
  deployment.
- **No accepted ADR modified.**
- **No weakening of strict Shape-1, `U = 0`, E1–E4, or Q4–Q12.**
- **No real or confidential corpus.**
- **No invented benchmark, latency, capacity, recall or throughput figure.**
- **Do not claim a structural design clears a gate where execution evidence is required** — §4.9 G-Q6
  rejects construction-only evidence in terms, and this task is entirely structural, so **it can clear
  nothing by itself**.
- **Do not generalize `node:sqlite` planner behaviour to an engine class.**

### Acceptance criteria

1. **The Q3 architecture response is explicitly documented**, quoting MSG-0129 rather than paraphrasing.
2. **Topology patterns are defined technology-agnostically** — no product, engine or vendor named as the
   bearer of a property.
3. **Each pattern is mapped to E1–E4 and G-Q4/G-Q5/G-Q6**, marking each property **structural** or
   **execution-evidence-required**.
4. **The minimum evidence for a future engine-selection authorization is stated**, and it is evidence,
   not a shortlist.
5. **All prior verdicts reproduced unchanged** — **K7/K8 NOT CLEARED**, the DISQUALIFIED set unchanged,
   **nothing relabelled**; **no prior probe re-run**.
6. **`git diff --name-only docs/` is empty**; no implementation task marked READY.
7. **Where evidence is insufficient, the architecture gap is recorded and selection stays blocked** —
   an open choice preserved as open is a valid outcome, not a failure.
8. COMMS, queue and status reconciled; **stop at the documented response.**

### Verification

Documentary — **no test count, and none may be claimed**; nothing is executed. Before reporting
completion, verify and quote:

```text
git diff --name-only docs/    -> empty
git status --porcelain        -> empty after commit
insertions / deletions        -> the exact figures for each file changed
```

**Verify the delivered content from `main` after pushing**, as MSG-0125 required of TASK-0040 — the step
that separates *"I wrote it"* from *"it is published"*.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md` and this queue. Write the checkpoint.

### Stop conditions

Stop if the response would require **weakening a gate**, **modifying an accepted ADR**, **selecting an
engine or technology**, **inventing a numeric figure**, or **claiming clearance from structure alone**.
**If no topology can be shown capable of satisfying the gates, that is the finding** — record it and
keep selection blocked. MSG-0129: **"Failure does not authorize relaxing the gates."**

**Also stop if `origin/main` moves mid-run** — the scheduler is enabled. Record the starting HEAD in
checkpoint 1 and re-check before every push.

### Recovery procedure

Check whether an architecture response to Q3 already exists in EPA-0006 or elsewhere before writing one.
**Two answers to one question is the drift this record has warned about repeatedly**; §4.12's Q12 note
is the pattern to follow — **point at the section that holds the rule rather than restating it.**

### Result — COMPLETE 2026-08-24, 8/8 acceptance criteria MET

**Record:** [`MSG-0132`](../comms/MSG-0132-task-0041-q3-architecture-response-execution-record.md) ·
**Checkpoint:** [`TASK-0041`](checkpoints/TASK-0041.md) · **Discovery:**
[`DISC-0011`](../discoveries/DISC-0011-epa-0006-4-11-verdict-count.md)

**The recovery procedure was run first and returned the answer that permitted the work.** No §4.13
existed (`grep -c "^### 4\.13"` → **0**), EPA-0006 cited MSG-0129 nowhere (**0**), §4.7 Q3 carried no
ruling note (**0**), and no answer to Q3 existed anywhere under `implementation/`. **The §4.12 Q12
pattern was followed exactly**: the response is written **once**, in §4.13, and §4.7 Q3 gets a
**pointer** to it rather than a second statement of it.

**Delivered:** EPA-0006 **§4.13**, **392 insertions / 0 deletions**, one file — additive, nothing
deleted or reworded — plus the declared §4.7 Q3 pointer note inside the same insertions.

- **MSG-0129 quoted, not paraphrased**, and the branch it took recorded: §4.7's **third** — reconsider
  the topology — **leaving Q1 and Q2 open, not ruled**.
- **Sixteen measured results (F1–F16)** carried forward as the constraints any proposal must survive,
  each attributed to the section that measured it. **Nothing re-derived, nothing relabelled.**
- **Five invariants: N1 containment · N2 closure of the reachable set · N3 refinement by enumerated
  transition · N4 plan-independence · N5 non-withholding.**
- **The load-bearing claim: N1 + N2 make N4 free.** Nothing unauthorized within reach ⇒ **no plan can
  examine it.** That is why **§4.12's `ANALYZE` result — `U` 2857 → 0 on a maintenance command —
  argues for redesign, not for a better-behaved planner.** **Three caveats recorded with the claim**:
  N2's reachable set must be genuinely complete; **N1 does NOT discharge E2** (§4.11 result 4 is the
  demonstration); and it addresses neither **U5** nor routing-phase units.
- **Catalogue extended, not replaced: I7** boundary-refined effectivity and **I8** entitlement-class
  materialisation, **both NEVER MEASURED**. I7's argument corrects a *reading* of §4.8 and not a fact:
  **effectivity is piecewise constant in time**, so it refines on the interval to the next boundary,
  and **those boundaries are data already in the kernel, not a tuning parameter.**
- **Four topologies W1–W4**, each mapped cell by cell to **E1–E4** and
  **G-Q4/G-Q5/G-Q6/G-Q7/G-Q7.8**, every property marked **S** / **X** / **S→X**. **They differ in
  exactly one cell**, and that is the answer to Q3: topology decides **G-Q4.1** outright, creates the
  **precondition** for E1/E3/G-Q5.1/G-Q7, and decides **E2, E4, G-Q5.2, G-Q6, G-Q7.8 and N5 not at
  all.**
- **EV1–EV12** — the minimum evidence for any future engine-selection authorization. **Evidence, not
  a shortlist; adds no gate and relaxes none.**
- **R1** recommended as a **criterion**, on §12.2's precedent; **the W1–W4 choice preserved as OPEN**
  because every distinguishing cost is **unmeasured** and corpus scale is **UNKNOWN at n=1**.
- **GAP-A…GAP-E recorded; selection stays blocked.** **GAP-B first**: **E4 is UNOBTAINABLE on the only
  reachable test subject**, so a future probe there **would clear nothing whatever the topology** —
  worth knowing **before** such a task is authorized.

**Boundaries verified, not asserted:** `git diff --name-only docs/` **empty**; **392 insertions / 0
deletions**, so no line was removed and no gate weakened; **no numeric threshold, benchmark, latency,
capacity, recall or throughput figure produced**; **no engine, runtime, provider, model or index
technology named as the bearer of any property, and no shortlist created**; **nothing executed** —
`git status --porcelain implementation/probes/` **empty**, no probe written or re-run, **no test count
and none claimed**; **no ADR touched**; **MSG-0101 §1(1) not reinterpreted**.

**All prior verdicts reproduced unchanged in MSG-0132 §6** — the nine MSG-0104 verdicts, the eight
§4.8 designs, the eight §4.10 designs, the ten §4.11 rows and the two §4.12 candidates. **K7 and K8
remain NOT CLEARED; K3 and K4 remain NOT CLEARED; class D and class H remain DISQUALIFIED.**

**One question referred — Q13**: which temporal frames must a topology be able to answer? Fail-closed
default (**abstain rather than answer from the wrong interval**); **blocks nothing**.

**One discovery recorded and deliberately NOT corrected — DISC-0011.** §4.11's summary reads *"Six
designs NOT CLEARED, three DISQUALIFIED"* where its own table shows **seven** NOT CLEARED. **No verdict
is wrong and nothing downstream depends on the tally**; correcting a prior section is a reword and
needs its own authorization, so it was recorded rather than fixed. **Its index row was added in the
same commit that raised it** — the rule three prior index drifts earned.

**One process observation, second occurrence:** `HEAD` and `origin/main` moved **`090fb21` → `8a751ea`
35 seconds after this runner took its lock**, the mover being the interactive COMMS session committing
MSG-0131. **BLK-0009's root cause recurring** — the Supervisor reads the **working-tree** copy of this
file, not the committed one. **Diagnosed before any work began**, BLK-0009's prescribed test run rather
than inferred, no blocker raised, **no supervisor behaviour changed.**

**The run stops here**, as MSG-0130's acceptance requires. **No task is READY. Engine selection stays
blocked and must be separately authorized** once the existing gates are **positively satisfied with
evidence**.

---

## TASK-0042 — architecture-bound retrieval evidence: routing, placements, transitions, I5/I7/I8, and the E4 re-check

**Priority:** 1 | **Status:** **COMPLETE** — 2026-08-24; **8/8 acceptance criteria MET**; record **MSG-0137**/§4.14 | **Owner:** Claude Code

> **Corrected 2026-08-25 (MSG-0162).** This header still read `READY` after the task finished. The **summary row above has said COMPLETE throughout** and is authoritative; see the `### Result` block in this section. **A stale `READY` on a finished task is the signal a supervisor cycle reads to start a runner**, so it is corrected rather than left as cosmetic drift. **Nothing about what the task measured or concluded changes.**
**Depends on:** MSG-0137 AUTHORIZED; MSG-0138 (the queue write, performed here); MSG-0134 (Q1=A), MSG-0135 (Q2=B), MSG-0136 (Q7=A), MSG-0133 (Q13); MSG-0132 / EPA-0006 §4.13
**Next eligible task:** none — the deliverable is an execution record; **engine selection stays blocked and must be separately authorized**
**Type:** evidence / measurement — **nothing selected, no ADR change, and it may clear nothing**

**Specification:** [`MSG-0137-task-0042-architecture-bound-evidence-authorization.md`](../comms/MSG-0137-task-0042-architecture-bound-evidence-authorization.md),
with [`MSG-0138`](../comms/MSG-0138-task-0042-queue-reconciliation.md), and the Q1/Q2/Q7 rulings binding, **plus this section.**

### What changed to make this task possible

**Three architecture questions that were open through five probes are now ruled**, and each one
**tightens** the evidence this task must produce:

| Ruling | Effect on the measurement |
|---|---|
| **Q1 = A** (MSG-0134) — **strict** | **U1 stays in scope.** Reading an unauthorized index entry, key or metadata **is** examination. A candidate cannot pass E2 by arguing no passage content was touched |
| **Q2 = B** (MSG-0135) — **physical isolation where necessary** | Query-time predicates alone are **insufficient** where the engine examines unauthorized candidates first. **Routing and physical structure are part of what must be measured**, not a design preference |
| **Q7 = A** (MSG-0136) — **zero stale-answer tolerance** | **No elapsed-time allowance exists to test against.** The prior version must not answer after a transition; where the current version cannot be established, the system **abstains** |

> **None of the three relaxes anything, and none clears anything.** Each was ruled in the fail-closed
> direction the record already defaulted to, so **every existing verdict stands unchanged**.

### The seven work items (MSG-0137)

1. **Exercise and measure the routing phase and reachable physical structures** under strict Shape-1,
   with **routing-phase examination counted in `U`** under G-Q4 and Q2.
2. **Exercise the applicable index-cursor and other reachable placements S7 requires**; **report the
   maximum observed `U`**; preserve the strict **U1–U5** interpretation.
3. **Reuse the committed harnesses and fixtures where applicable.** **Do not re-run prior cases merely
   for repetition** — TASK-0033/0035/0037/0038/0039 evidence stands as measured.
4. **Test Q7's zero stale-answer tolerance** across **update, approval, revocation and supersession**,
   **including the unavailable-current-version abstention case**, and **distinguish transition-triggered
   invalidation from ordinary periodic re-materialisation.**
5. **Measure I5 / I7 / I8 only where the test subject and instrumentation genuinely observe them.**
   Otherwise record **NEVER MEASURED / NOT CLEARED** with **the exact observability limitation.**
6. **Re-check E4 / log observability** on the reachable subject. **If still unobtainable, record the
   limitation and infer nothing.**
7. **Preserve all existing verdicts.** **Report no clearance** unless every applicable **E1–E4** and
   **G-Q4/G-Q5/G-Q6** requirement is **actually satisfied by execution evidence.**

### What prior evidence says this task will run into

**§4.13 GAP-B is the constraint to read first: E4 is UNOBTAINABLE on the only reachable test subject**,
established in §4.12 **by enumeration against a nonexistent-pragma control**, not by inference. **That
blocks clearance independently of anything this task measures** — item 6 is a **re-check**, and a second
negative is the expected result, not a failure.

**The instrument traps are known, and each was paid for once already:**

- **A row-access zero is not an index-cursor zero** (§4.6 S7-R3). K8's `U = 0` became a **rising lower
  bound** when the index-cursor placement was finally taken.
- **`ANALYZE` alone moved K7's `U` from 2857 to 0** while entries visited went **up** by one. **A
  maintenance command changes the reading**, so state the maintenance state of every measurement.
- **`U = 0` is purchasable by withholding authorized content** (K4). **Record what was answered**, not
  only what was examined.
- **Unobtainable evidence yields NOT CLEARED**, never an inferred pass (§4.6 S9).

### Boundaries (MSG-0137)

- **No engine, runtime, provider, model or index technology selection.** No implementation or deployment
  authorization.
- **No modification of accepted ADRs.**
- **No relaxation, reinterpretation or weakening of strict Shape-1 or any clearance gate.**
- **No invented counts, no inferred observability, no construction-only substitute for execution
  evidence.**
- **No Docker or host-environment installation, and no operator intervention.** **If the environment
  blocks a required measurement, record the exact boundary** — BLK-0008 and BLK-0010 are the precedents
  for recording rather than routing around.

### Acceptance criteria

1. **Each probe or fixture is identified**, with **which placement was exercised** and **the observed
   counts**.
2. **The maximum `U` across exercised applicable placements is reported** (S7-R2), and **U1–U5 strict is
   preserved** (Q1=A).
3. **Routing-phase units are counted in `U`** and routing itself is measured (G-Q4.4), or the record
   states plainly that it was not.
4. **Every transition case in item 4 has a recorded result**, including **abstention**, and the
   **discriminator between transition-triggered and periodic behaviour is exercised**.
5. **I5/I7/I8 each carry either a measurement or NEVER MEASURED with the exact limitation** — no third
   option.
6. **E4 re-check recorded with its method**, and **no clearance inferred from an absent log.**
7. **All prior verdicts reproduced unchanged; no prior case re-run for repetition**; `git diff --name-only docs/`
   **empty**.
8. **Resulting gate status stated per candidate**, with **NOT CLEARED wherever a requirement is
   unevidenced**; COMMS, queue and status reconciled.

### Verification

Execution — **a non-zero measurement count is required, and "0 measurements" is a failure.** Before
reporting completion, verify and quote:

```text
git diff --name-only docs/    -> empty
git status --porcelain        -> empty after commit
the probe's own output        -> counts, placements, transitions, abstentions
insertions / deletions        -> exact figures per file changed
```

**Include a negative control that FAILS as required, and state that the adversarial precondition held**
— §4.6 S8. **A run whose negative control passes has measured nothing.** **Verify the delivered content
from `main` after pushing.**

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md` and this queue. Write the checkpoint.

### Stop conditions

Stop if measurement would require **installing anything**, **operator intervention**, **modifying an
accepted ADR**, **weakening a gate**, or **selecting an engine**. **An environment that blocks a
measurement is recorded as a boundary and the affected gate stays NOT CLEARED.**

**Also stop if `origin/main` moves mid-run** — the scheduler is enabled, and TASK-0041 already diagnosed
one mid-run movement. Record the starting HEAD in checkpoint 1 and re-check before every push.

### Recovery procedure

**Check what has already been measured before measuring it again.** Item 3 forbids repetition, and the
committed harnesses under `implementation/probes/` carry their own outputs. **Re-running a prior case
produces no new evidence and risks presenting an old result as a new one.**

### Result — **COMPLETE** 2026-08-24. Nothing cleared, and nothing could have been

**Record:** [`EPA-0006 §4.14`](../architecture/EPA-0006-assistant-technology-evaluation.md) ·
**Evidence:** [`MSG-0140`](../comms/MSG-0140-task-0042-architecture-bound-evidence-execution-record.md) ·
**Harness and captured output:** `implementation/probes/TASK-0042/` ·
**Checkpoint:** [`checkpoints/TASK-0042.md`](checkpoints/TASK-0042.md) ·
**Discovery:** [`DISC-0012`](../discoveries/DISC-0012-gq4-differential-ran-against-empty-catalogue.md)

**Six candidates measured. All six NOT CLEARED.** **E4 alone would have been enough for that** — §4.13
GAP-B said so before the task started — but **it is not the only thing missing**, and that is what the
run establishes.

**Acceptance criteria, each with its evidence:**

| # | Criterion | Evidence |
|---|---|---|
| 1 | Each probe/fixture identified, with **which placement was exercised** and the observed counts | §4.14 *finding 4* names **five placements taken** — P-ROW, P-VIDX, **P-CIDX (new)**, P-RANK, **P-ROUTE** — each with what calibration showed it counts; the grid reports every count |
| 2 | **Maximum `U` across exercised applicable placements** reported (S7-R2), U1–U5 strict preserved (Q1=A) | §4.14 grid. **K8's row-access `U` = 0 is superseded by 2 / 66 / 709** taken at the index cursor — the first grid where S7-R3 bites **by rule** rather than by a probe's diligence |
| 3 | **Routing-phase units counted in `U`** and routing itself measured (G-Q4.4), or plainly stated otherwise | §4.14 *findings 1–3*. Measured: the catalogue-scanning mechanism reads **320** entries naming other subjects' structures and carries them in `U`. **Stated plainly where it is NOT measured:** implicit schema resolution is **NEVER MEASURED**, with the exact limitation |
| 4 | **Every transition case has a recorded result**, including abstention, and the **discriminator is exercised** | §4.14 *finding 7*. **6 transitions x 6 designs x 2 instants = 36 cells.** The discriminator **fired in 4 cells** — designs *made correct by waiting*. **T3 vs T5 isolates the faked re-check**, reproducing §4.10 result 3 on an independent fixture |
| 5 | **I5/I7/I8 each carry a measurement or NEVER MEASURED with the exact limitation** — no third option | §4.14 *findings 5–6* and MSG-0140 §4.3. All three **measured for `U` at three sizes**; nine remaining quantities recorded **NEVER MEASURED**, each with its limitation |
| 6 | **E4 re-check recorded with its method**, no clearance inferred from an absent log | §4.14 *finding 8*. The §4.12 enumeration re-run in full **including the nonexistent-pragma control**; every tracing pragma **inert and demonstrated inert**. **NOT OBTAINABLE, unchanged** |
| 7 | **All prior verdicts reproduced unchanged; no prior case re-run**; `git diff --name-only docs/` empty | MSG-0140 §7 reproduces every prior verdict. **`git diff --name-only docs/` -> empty**, checked after the edits and again from `main`. **EPA-0006's diff is additive: 287 insertions / 0 deletions** |
| 8 | **Gate status stated per candidate**, NOT CLEARED wherever unevidenced; COMMS, queue and status reconciled | MSG-0140 §7 gives the per-candidate E1–E4 / G-Q4 table; the probe prints a **per-candidate "why not cleared" list** so no row reads as a near-miss. This block, MSG-0140, both registers and the status file are reconciled in one commit |

**The three results worth a later reader's attention:**

1. **A row-access zero was superseded by rule for the first time.** K8 reports `U` = 0 at row access
   at every size — correct, and unchanged from TASK-0038 — and **2 / 66 / 709** at the index cursor.
   **S7-R2 requires the maximum, so the reported figure is the higher one.**
2. **I5 and I8 measure IDENTICALLY to K7 at every size.** A finer partition key that does not refine
   the **effectivity** conjunct removes no unauthorized row and therefore reduces `U` by nothing —
   **§4.8 finding 1 corroborated in a third independent fixture.**
3. **I7 reached `U` = 0 and failed anyway, by WITHHOLDING.** At its interval boundary it **withheld
   142 of the 146 authorized chunks** the kernel held, and a version **ingested inside the interval**
   never appeared. **`U` is blind to both**, and its zero rests on a bound that is **VACUOUS in 3 of 3
   cells**.

**Boundaries held:** nothing selected, adopted, recommended, installed or deployed; **no ADR touched**;
no gate relaxed; **no numeric staleness threshold** — the freshness period is a declared fixture
constant; no Docker or host operation; **`:memory:` only, no network, no corpus**; no benchmark,
latency, capacity, recall, throughput, structure-count, replication-factor or fan-out figure.

**Next eligible task: none.** **Engine selection stays blocked and must be separately authorized.**
**GAP-A, GAP-B and GAP-C stand**, and **GAP-B continues to block clearance independently of anything
measured here.**

---

## TASK-0043 — bounded E4 observability evidence on a second test subject

**Priority:** 1 | **Status:** **BLOCKED — BLK-0011** | **Owner:** Claude Code
**Depends on:** MSG-0141 AUTHORIZED; MSG-0140 §6 (the second negative on the current subject); EPA-0006 §4.13 GAP-B, §4.6 S6/S9
**Next eligible task:** none — MSG-0141 returns control to the Architecture Lead on completion
**Type:** evidence / instrument capability — **the subject is an INSTRUMENT, not a candidate**

**Specification:** [`MSG-0141-e4-observability-evidence-task-authorization.md`](../comms/MSG-0141-e4-observability-evidence-task-authorization.md),
**plus this section.**

> ### ATTEMPTED 2026-08-24 and BLOCKED at the first substantive action — read this before re-running
>
> **The specification below is unchanged and still governs.** What follows records what happened when
> it was attempted, so that the next session does not repeat the attempt blind. Evidence:
> [`BLK-0011`](../blockers/BLK-0011-python-interpreter-denied-to-unattended-runner.md),
> [`MSG-0144`](../comms/MSG-0144-task-0043-blocked-python-unreachable.md), and checkpoint
> [`TASK-0043.md`](checkpoints/TASK-0043.md).
>
> **The subject named in "What is already known about the environment" below is NOT INVOCABLE by an
> unattended runner.** `py -V` and `py implementation/probes/TASK-0043/probe.py` **both** return
> **`This command requires approval`**. **The cause is VERIFIED by reading the permission set**, not
> inferred: `.claude/settings.local.json` allows `Bash(node *)` and eight `--version` checks and
> carries **no `py` / `python` / `python3` entry**; `runner-settings.json` grants **no interpreter**.
>
> **Three distinguishable behaviours make this a denial and not an absence** — `node -e` **ran**
> (`v24.15.0`), `docker` and `psql` returned **`command not found`**, and `py` did neither. **BLK-0010's
> two-step disambiguation was applied first**: the compound form was refused for *"multiple
> operations"*, wording that names a command **shape** rather than a boundary, and reading it as a
> boundary would have been the misdiagnosis BLK-0010 exists to prevent.
>
> **The harness is written, committed and NOT RUN** — `implementation/probes/TASK-0043/probe.py`. It
> takes no arguments, needs no network, installs nothing, and is built to §4.12's control standard:
> **every instrument it arms is run disarmed first, and a disarmed instrument that is not silent voids
> the run.** **There is no `probe-output.txt` because there is no output.**
>
> **The verdict recorded is NEITHER of the two MSG-0141 permits, deliberately.** *"The instrument
> could not be run"* is **not** *"the instrument ran and showed nothing"*. Recording **E4
> unobtainable** here would commit, at the level of the task, the exact error §4.12's
> nonexistent-pragma control was invented to prevent at the level of a pragma. **E4 stays NOT CLEARED
> for the reasons already on record; §4.13 GAP-B stands untouched** — GAP-B is a claim about the
> **first** subject — and **the second subject's E4 position is UNKNOWN.**
>
> **A workaround exists and MUST NOT be taken.** `Bash(node *)` is allowed and the permission layer
> inspects the Bash command line, not what the process it starts goes on to spawn, so
> `node -e "...execSync('py ...')..."` would very probably run. **CLAUDE.md rule 2 forbids it** — *"any
> other substitute for the privilege you were not given"* — as does this section's own stop condition.
> **It is named here so that it is refused deliberately rather than rediscovered and taken.**
>
> **What unblocks this task is an Architecture Lead decision, and nothing else** (BLK-0011 §"What the
> operator can do"): **(A)** a narrow `Bash(py implementation/probes/TASK-0043/probe.py)` grant —
> **recommended**, on the BLK-0010 / MSG-0083 precedent; **(B)** a general `Bash(py *)` grant — **not
> recommended**; **(C)** run this task **attended**. **Until one is chosen, this task is BLOCKED and no
> task is READY.**

### What this task is for

**E4 is the last structural gap that no amount of architecture can close.** §4.13 **GAP-B** says it in
terms, and **MSG-0140 §6 confirmed it a second time** on the only subject reached so far: SQLite 3.51.3
via `node:sqlite` exposes **no trace, profile or log member**, its build lacks `DEBUG`,
`ENABLE_SQLLOG` and `ENABLE_STMT_SCANSTATUS`, **five tracing pragmas behave identically to a pragma
that does not exist**, and `:memory:` leaves no file. **Nothing was inferred from that absence, and
nothing may be.**

**So the question is no longer whether this subject can supply E4 — it cannot — but whether ANY
reachable subject can.** MSG-0141 authorizes exactly that, and no more.

> **The subject is an evidence instrument, not a candidate.** MSG-0141: *"not engine selection,
> adoption, deployment, or implementation authorization"*, and it *"must not be evaluated for product
> suitability beyond the E4 evidence necessary for this task."* **A subject that supplies E4 clears
> nothing and is not thereby preferred.**

### The eight boundaries (MSG-0141)

1. **Identify an available test subject/runtime that exposes what E4 requires.**
2. **Exercise only the minimum probe** needed to establish whether engine-execution inspection or log
   evidence is **genuinely observable**.
3. **Record the exact observability surface, what it proves, and its limitations.**
4. **Include negative controls sufficient to distinguish an absent log from an instrument that was
   never running** — the §4.12 nonexistent-pragma control is the pattern, and without it *"the
   instrument reported nothing"* and *"the instrument was never running"* are **the same observation**.
5. **If E4 cannot be established, record the exact limitation and leave E4 NOT CLEARED.**
6. **Do not install or modify host infrastructure**, deploy anything, select a product engine, or alter
   any gate or ADR.
7. **Do not infer E4 from surface scans, query results, planner output, or absence of errors.**
   MSG-0140 §6 ran a surface scan and **explicitly did not offer it as E4** — follow that.
8. **Do not broaden into performance, cost, capability, engine comparison or product selection.**

### What is already known about the environment — capability evidence, NOT E4 evidence

**Enumerated read-only by the COMMS session that reconciled this task, 2026-08-24. It is offered so the
task does not spend its budget rediscovering it, and it settles nothing:**

| Probe | Result |
|---|---|
| `docker`, `docker-compose` | **ABSENT** from the runner's `PATH` — re-confirmed, as in TASK-0039 |
| `psql`, `mysql`, `sqlite3` CLI, `duckdb`, `java`, `dotnet`, `go`, `rustc` | **ABSENT** |
| `python` / `python3` | **ABSENT** — but see the next row |
| **`py`** (the Windows Python launcher) | **PRESENT** at `C:\Windows\py` → **Python 3.14.5** |
| Python's `sqlite3` module | **SQLite 3.50.4**, exposing **`set_trace_callback`**, **`set_authorizer`**, **`set_progress_handler`** |

> **`python` is absent while Python is present.** That is **the third time in this project a `PATH`
> artefact has been mistaken for absence** — MSG-0102 read it as "no Docker, no Python", MSG-0103
> corrected "no SQLite" that was really "no `sqlite3` CLI". **Check the launcher before recording an
> absence.**

**What this does and does not tell the task.** `set_trace_callback` binds SQLite's **statement-level**
trace; `set_progress_handler` fires per **N virtual-machine instructions**. **Whether either is an
authoritative record of what the engine EXAMINED — which is what E4 asks — is the question, not the
answer.** A statement trace that reports the statement and not the rows visited would be **a real
surface that still does not satisfy E4**, and saying so plainly would be a correct outcome.

### Acceptance criteria

1. **The subject and runtime are named with versions**, as MSG-0140 §6 named its own, so a later reader
   can tell whether a different answer means a changed engine or a changed probe.
2. **The observability surface is described exactly** — what it emits, at what granularity, and **what
   it does not emit**.
3. **A negative control distinguishes an absent log from an inactive instrument**, and its result is
   quoted.
4. **The verdict is one of the two MSG-0141 permits**: E4 **obtainable** with reproducible evidence, or
   E4 **unobtainable** within the bounded scope with the precise limitation recorded.
5. **No candidate is cleared and no engine is selected** — a successful E4 observation **clears
   nothing**, and the record says so.
6. **Nothing installed, no host configuration modified**; `git diff --name-only docs/` **empty**.
7. **All existing verdicts unchanged**; **no prior probe re-run**; **six probes have cleared nothing**
   and that record stands.
8. COMMS, queue and status reconciled; **control returns to the Architecture Lead.**

### Verification

Execution — **a non-zero number of captured observations is required**, and **"the trace produced
nothing" must be distinguished from "the trace was never armed"** by the control in criterion 3. Before
reporting completion, verify and quote:

```text
git diff --name-only docs/    -> empty
git status --porcelain        -> empty after commit
the probe's own output        -> what the surface emitted, verbatim
```

**Verify the delivered content from `main` after pushing.**

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md` and this queue. Write the checkpoint. **Commit the harness and its
captured output** under `implementation/probes/TASK-0043/`, as every prior probe did.

### Stop conditions

Stop if establishing E4 would require **installing anything**, **modifying host configuration**,
**operator intervention**, or **selecting an engine**. **An environment boundary is recorded, not routed
around** — BLK-0008 and BLK-0010 are the precedents. **If E4 is unobtainable here too, that is the
finding**, and E4 stays **NOT CLEARED**.

**Also stop if `origin/main` moves mid-run.** Record the starting HEAD in checkpoint 1 and re-check
before every push.

### Recovery procedure

**Check what MSG-0140 §6 already enumerated before re-enumerating it.** The `node:sqlite` surface is
settled and re-running it produces no new evidence. **The new ground is a different subject**, and the
task's budget belongs there.

---

## TASK-0044 — define the durability-artefact security criterion, before any measurement

**Priority:** 1 | **Status:** **COMPLETE** — 2026-08-25, **8/8 acceptance criteria MET**; record **MSG-0150**; delivered as **EPA-0006 §4.16 (`DA-1`)**, 228 insertions / 0 deletions | **Owner:** Claude Code
**Depends on:** MSG-0148b AUTHORIZED; MSG-0147 (R2 ruled); MSG-0146 §5 and §8 R2 (the observation that raised it); EPA-0006 §4.6 S6, §9.3, ADR-0020 §6.2
**Next eligible task:** none — **the exposure evidence task is separate and must be separately authorized**; MSG-0148b forbids combining them

> **Outcome, recorded 2026-08-25.** **The criterion is written and nothing was measured.** The section
> below is retained **unchanged** as the specification this task was executed against. **`DA-1` lives in
> EPA-0006 §4.16**; the two structural choices are declared in §4.16 DA-0 and in MSG-0150 §2; the
> classification of TASK-0043's WAL shape is **`NOT CLEARED`, on absent provenance** (§4.16 DA-4/DA-6).
> **One question referred — Q14**, fail-closed, blocking nothing. **Nothing CLEARED; no DA-1 verdict
> exists for any candidate.**
**Type:** criterion definition — **no measurement, nothing selected, no gate changed**

**Specification:** [`MSG-0148b`](../comms/MSG-0148-r2-criterion-first-authorization.md), with
[`MSG-0147`](../comms/MSG-0147-r2-wal-architectural-security-decision.md) binding, **plus this section.**

### Why criterion first, in the Lead's words

> **"The criterion must establish the security bar independently of the measurement. The later evidence
> task must measure against the already-authoritative criterion."**

**MSG-0148a offered this as one of two options and recommended against combining them. MSG-0148b turns
that into a prohibition** — *"combine criterion creation and measurement in the same task"* sits in the
**may not** list. **A bar written by the session that also takes the measurement is a bar shaped by what
the measurement could reach**, and §4.6 S5's *counters prove failure, never success* exists because that
shaping is invisible afterwards.

### What the criterion must NOT become

**E4 by another name.** MSG-0147 is explicit that the WAL finding **is not reclassified as E4** and that
**E4 remains limited to the established execution-observability criterion**. **This criterion is about
content AT REST in engine-managed files; E4 is about what an engine's execution surface emits.** Two
different boundaries, deliberately kept apart — **and MSG-0146 kept them apart at some cost**, recording
the WAL result and refusing to offer it as E4 evidence when doing so would have looked like a stronger
result.

### The four things it must define (MSG-0148b)

1. **The precise security criterion** for unauthorized policy content in **engine-managed
   durability/persistence artefacts**.
2. **Scope and exclusions** — which artefacts are in scope (write-ahead logs, rollback journals,
   shared-memory files, temporary spill files, backups produced by the engine) and **what is deliberately
   out** (application logs, OS page cache, storage-layer encryption at rest, anything the engine does not
   itself write).
3. **Evidence semantics** — what observation would **satisfy** it and what would **fail** it, in the
   vocabulary §4.6 S9 already uses, so a later probe cannot invent its own.
4. **The fail-closed interpretation** — what verdict applies when the artefact **cannot be inspected at
   all**. §4.6 S9's answer for unobtainable evidence is **NOT CLEARED**, never an inferred pass, and this
   criterion should say so in its own terms rather than leave it to inference.

### The evidence that already exists, and its exact status

**TASK-0043 observed, on a synthetic fixture:** `-wal` **28872 bytes carrying the unauthorized marker 135
times**; **main database 4096 bytes, marker absent**; **`-shm` 32768 bytes, marker absent**;
**`-journal` absent**.

> **That is an example the criterion must be able to CLASSIFY — it is NOT evidence under the criterion**,
> because the criterion does not exist yet and **MSG-0148b forbids this task from measuring anything.**
> **Do not re-run it, extend it, or treat it as a result.** Its value here is as a **shape**: a criterion
> that cannot say plainly whether *"the marker appears 135 times in a WAL and nowhere else"* is a
> violation is not yet a usable criterion.

### Where it goes

**Through the established architecture/COMMS mechanism** — the additive, declared mechanism TASK-0034,
TASK-0036 and TASK-0040 used for earlier criteria — **plus a numbered COMMS record**.

**Two structural choices this task must make and DECLARE rather than assume:**

- **Its label.** **E1–E4 may not be changed or extended** (MSG-0148b), so the criterion needs an
  identifier of its own that cannot be mistaken for a Shape-1 gate. **State the choice and why.**
- **Its section.** Whether it belongs in **EPA-0006 §4.6** beside the other criteria or in a new section
  of its own. **Either is defensible; picking silently is not.**

### Boundaries (MSG-0148b)

- **Do NOT run the WAL exposure experiment**, or any measurement. **No probe, no fixture, no harness.**
- **No engine selection, comparison, adoption, deployment or implementation.**
- **No change to E1–E4 or any existing clearance gate**; **no weakening of strict Shape-1.**
- **Do not combine criterion creation and measurement.**
- **No numeric threshold, no benchmark, no invented figure.**
- **No accepted ADR modified** — `git diff --name-only docs/` must be **empty**.

### Acceptance criteria

1. **A bounded criterion record exists on `main`** and is **independently reviewable** — readable by
   someone who has not followed this thread.
2. **It states plainly what durability-artefact exposure is PROHIBITED.**
3. **It states what evidence would SATISFY it and what would FAIL it**, in §4.6 S9's existing vocabulary.
4. **Scope and exclusions are explicit**, including artefacts deliberately out of scope.
5. **The fail-closed interpretation is stated** — unobtainable inspection yields **NOT CLEARED**.
6. **The criterion is distinguishable from E4 in its own text**, and says which boundary it is.
7. **No measurement was performed**, and the record says so; **TASK-0043's WAL figures appear only as an
   illustrative shape, labelled as such** if they appear at all.
8. **No gate changed, nothing selected**, `git diff --name-only docs/` **empty**; queue, COMMS and status
   reconciled.

### Verification

Documentary — **no test count, and none may be claimed**; nothing is executed. Before reporting
completion, verify and quote:

```text
git diff --name-only docs/    -> empty
git status --porcelain        -> empty after commit
insertions / deletions        -> exact figures per file changed
```

**Verify the delivered content from `main` after pushing.**

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md` and this queue. Write the checkpoint.

### Stop conditions

Stop if defining the criterion would require **measuring anything**, **changing an existing gate**,
**modifying an accepted ADR**, **selecting or comparing an engine**, or **inventing a numeric threshold**.
**If the criterion cannot be stated without a measurement to anchor it, that is a finding** — record it
and stop, because MSG-0148b's whole premise is that the bar comes first.

**Also stop if `origin/main` moves mid-run.** Record the starting HEAD in checkpoint 1 and re-check
before every push.

### Recovery procedure

**Check whether a durability-artefact criterion already exists before writing one.** §4.6 carries S1–S11
and §4.9 carries G-Q4…G-Q7; **a second statement of one rule is the drift this record has warned about
since TASK-0030**, and §4.12's Q12 note is the pattern to follow — **point rather than restate.**

---

## TASK-0045 — bounded DA-1 evidence: measure durability artefacts against the criterion that already exists

**Priority:** 1 | **Status:** **COMPLETE** — 2026-08-25; **8/8 acceptance criteria MET**; record **MSG-0155**, corrected by **MSG-0156**; evidence promoted to **EPA-0006 §4.17** | **Owner:** Claude Code

> **Corrected 2026-08-25 (MSG-0162).** This header still read `READY` after the task finished. The **summary row above has said COMPLETE throughout** and is authoritative; this section carries NO result block — the record is MSG-0155/MSG-0156 and the summary row. **A stale `READY` on a finished task is the signal a supervisor cycle reads to start a runner**, so it is corrected rather than left as cosmetic drift. **Nothing about what the task measured or concluded changes.**
**Depends on:** MSG-0153 AUTHORIZED; **EPA-0006 §4.16 DA-1…DA-7** (the criterion, already authoritative); MSG-0147 (R2); MSG-0148b (which separated criterion from measurement); §4.15 (the observation that motivated it)
**Next eligible task:** none — the deliverable is an execution record; **engine selection stays blocked and must be separately authorized**
**Type:** evidence / measurement — **it may clear nothing, and DA-1 clears nothing even when satisfied**

**Specification:** [`MSG-0153`](../comms/MSG-0153-r1-ruling-and-da1-evidence-direction.md), with
**EPA-0006 §4.16 binding as written**, **plus this section.**

### The one rule that shapes this task

**The criterion is already authoritative and this task measures against it. It does not adjust it.**
MSG-0148b ordered them this way deliberately, and the ordering only holds if the measurement now takes
DA-1 as given — **including where DA-1 turns out to be inconvenient to measure.**

> **If an in-scope artefact cannot be inspected, DA-6 already gives the answer: `NOT CLEARED`.** That is
> **not a defect in the probe and not a reason to reinterpret the criterion.** Recording *"the criterion
> asks for something this subject cannot show"* is a **result**, and it is the result E4 produced twice
> before a second subject was sought.

### What must be measured (DA-1's three limbs, DA-2's scope)

**Measure, per in-scope artefact:**

1. **DA-1.1 — request-induced persistence.** Does resolving a request for subject `s` cause content
   unauthorized for `s` to be **written** to an engine-managed durability artefact?
2. **DA-1.2 — residual retention.** Does such content **remain readable** in one after the request ends?
3. **DA-1.3 — widened reach.** Does an artefact place corpus content where **more principals, or a
   longer-lived store, can read it** than the projection itself allows?

**In scope (DA-2):** write-ahead logs, rollback journals, shared-memory files, **temporary and spill
files**, and **engine-produced backups/snapshots/replication streams**. **Out of scope (DA-3):**
everything DA-3 excludes — application logs, OS page cache, storage-layer encryption at rest, and
anything the engine does not itself write. **Do not widen the scope; do not narrow it either.**

### DA-4 is the hard part, and the probe must be built for it

**DA-1 is a claim about PROVENANCE, not presence.** Under a shared projection, *"bytes unauthorized for
`s` exist somewhere in the engine's files"* is **true by construction for every candidate at every
moment** — so a probe that merely greps an artefact for a marker **measures nothing**.

**The probe must therefore separate:**

| Provenance | DA-1 |
|---|---|
| written at **ingest**, maintaining the projection of approved content | **not a DA-1.1/DA-1.2 finding** |
| written or retained **because a request was resolved** | **DA-1.1 / DA-1.2 apply** |
| **not separable by the available instruments** | **NOT CLEARED** (DA-6) — never *"presumed ingest"* |

**A fixture design that makes the two indistinguishable produces `NOT CLEARED` by DA-6, not a pass.**
**Say so in the record if it happens** — an honest inconclusive beats a result that cannot be trusted.

### Verdict vocabulary — DA-5, used unchanged

**No new vocabulary.** DA-5's rows are the verdicts: content found and **attributable to the request**;
an engine that **writes such content by design** or whose artefacts are **uninspectable**; **absence
alone, which is NOT sufficient** under §4.6 S5's asymmetry; **absence plus evidence the engine could not
have written it**; and **provenance not separable ⇒ NOT CLEARED**.

**§4.6 S5 applies here exactly as it does to counters: finding nothing proves nothing on its own.**

### Method constraints

- **Reuse the committed harnesses and fixtures where they fit** — `implementation/probes/TASK-0043/` has
  a file-backed WAL fixture already. **Do not re-run prior cases for repetition.**
- **A negative control is mandatory** (§4.6 S8): a configuration that **must** produce a DA-1 finding, and
  **it must actually produce one**. **A run whose negative control comes back clean has measured
  nothing.**
- **State the subject and runtime with versions**, and **state which subject each measurement was taken
  on.** §4.15's caution applies: **the two available subjects differ in the binding, not the build**, and
  **neither generalizes to an engine class.**
- **Record the maintenance and journal state of every measurement** — `journal_mode`, checkpointing,
  vacuum. §4.12 showed `ANALYZE` alone flipping a `U` reading; **a checkpoint can empty a WAL, and an
  uncheckpointed WAL can retain what a checkpointed one does not.**

### Boundaries (MSG-0153, MSG-0141, MSG-0147)

- **Do not select, clear, adopt, deploy or implement an engine.** **Clearing is named explicitly.**
- **Satisfying DA-1 clears nothing** — DA-5 consequence 1. It is **not** an §4.6 S6 evidence class and
  **cannot substitute for E1, E2, E3 or E4.**
- **Do not modify DA-1…DA-7, E1–E4, or any existing gate**; **no weakening of strict Shape-1.**
- **No accepted ADR modified**; **no numeric threshold**; **no benchmark, latency or capacity figure.**
- **No real or confidential corpus** — synthetic fixtures only.
- **Nothing installed, no host configuration modified.** **`py` is authorized for TASK-0043's probe only
  (MSG-0145)** — **a fresh grant is needed if this task requires it**, and BLK-0011's unattended
  condition still stands.

### Acceptance criteria

1. **Each in-scope DA-2 artefact class is either measured or recorded as unreachable with the exact
   limitation** — no silent omissions.
2. **Each of DA-1.1, DA-1.2 and DA-1.3 carries its own result**, not one combined verdict.
3. **Provenance is separated per DA-4**, or **DA-6 is applied and the reason stated.**
4. **Verdicts use DA-5's vocabulary unchanged.**
5. **The negative control produced a DA-1 finding**, quoted; **the run is declared VALID or INVALID on
   that basis.**
6. **Subject, runtime, `journal_mode` and maintenance state recorded per measurement.**
7. **No candidate cleared, no engine selected**; **all existing verdicts reproduced unchanged**; `git
   diff --name-only docs/` **empty**.
8. COMMS, queue and status reconciled; **stop at the evidence.**

### Verification

Execution — **a non-zero measurement count is required**, and **"the artefact was empty" must be
distinguished from "the artefact was never created"**, exactly as §4.12 distinguished an inert pragma
from an absent one. Before reporting completion, verify and quote:

```text
git diff --name-only docs/    -> empty
git status --porcelain        -> empty after commit
the probe's own output        -> per-artefact, per-limb results and the negative control
insertions / deletions        -> exact figures per file changed
```

**Verify the delivered content from `main` after pushing.**

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md` and this queue, **commit the harness and its captured output** under
`implementation/probes/TASK-0045/`, and write the checkpoint.

### Stop conditions

Stop if measuring would require **installing anything**, **modifying host configuration**, **operator
intervention beyond the existing grants**, **changing DA-1 or any gate**, or **selecting an engine**.
**An environment boundary is recorded, not routed around** — BLK-0008, BLK-0010 and BLK-0011 are the
precedents, and **the last of them was cleared by an operator decision, not by a workaround.**

**Also stop if `origin/main` moves mid-run.** Record the starting HEAD in checkpoint 1 and re-check
before every push.

### Recovery procedure

**Read §4.16 before measuring, not this summary of it.** The criterion is authoritative and this section
paraphrases it; **where they differ, §4.16 wins and the difference should be reported.** **Check what
TASK-0043 already captured** — its WAL observation is in §4.15 — **and do not re-run it as though it were
a DA-1 result. It never was one.**

---

## TASK-0046 — bounded Q16 topology/durability evidence

**Priority:** 1 | **Status:** **COMPLETE** — 2026-08-25; **9/9 acceptance criteria MET**; record
**MSG-0158**; checkpoint `implementation/operations/checkpoints/TASK-0046.md` | **Owner:** Claude Code

> **This section said `READY` until 2026-08-25 and it was wrong — corrected by the Architecture Lead
> in the TASK-0048 reconciliation (MSG-0162).** The task completed on 2026-08-25 and MSG-0158 is its
> record; the heading was never updated, and separately **the summary-table row for this task was
> DELETED** — commit `6bb259a` overwrote it in place with the TASK-0047 row instead of appending.
> **The row is restored above, recovered verbatim from `6bb259a^`, not re-authored.** A stale `READY`
> on a finished task is a live hazard, not a cosmetic one: it is exactly the signal a supervisor
> cycle reads to start a runner. **Neither correction changes what TASK-0046 measured or concluded.**
**Depends on:** **MSG-0157** (Q15/Q16 **DECIDED**); TASK-0045 COMPLETE; **EPA-0006 §4.13** (N1/N2,
W1–W4) and **§4.16** (DA-1…DA-7), both binding as written
**Next eligible task:** none — the deliverable is an execution record. **Engine selection stays
blocked and must be separately authorized.** **MSG-0157 consequence 1 — promoting TASK-0045's DA-1
evidence into EPA-0006 §4.17 — is a SEPARATE obligation with no authorized task, and this task does
not perform it.**
**Type:** evidence / measurement — **it may clear nothing**, and **DA-1 clears nothing even when
satisfied** (§4.16 DA-5 consequence 1)

### The specification is the Lead's own file, and it is not summarised away

> **[`TASK-0046-q16-topology-durability-evidence.md`](TASK-0046-q16-topology-durability-evidence.md)**
> — committed by the Architecture Lead at `bafe5c9`, and **authoritative for this task**. It carries
> the objective, scope, nine success criteria, constraints and verification requirements. **Read it
> directly. Where this section and that file differ, the file wins and the difference is reported** —
> the same rule TASK-0045 carried for §4.16.

**This section exists to record the queue reconciliation, not to restate the task.** The one thing it
adds is the note below, which is about how this row came to exist.

### How this row came to exist — recorded, because it is not the usual path

**The Lead committed the ruling (`e871461`) and the task definition (`bafe5c9`) and did not commit the
queue row.** The task file's own line 62 then gates execution on that row: *"This task is not
executable until it appears as the single **READY** task in the authoritative
`implementation/operations/CLAUDE-TASKS.md` queue."* The supervisor read `NOOP :: no READY task` for
three consecutive cycles after fast-forwarding to `bafe5c9`, **which was correct**.

**A READY row for TASK-0046 then appeared in the WORKING TREE — uncommitted, unattributable, and
encoding-corrupted (`EPA-0006 �4.13/�4.16`)** — one minute before the cycle that started the runner.
**Its provenance is UNKNOWN and this record does not guess at it.** The row above was **rewritten from
the two committed Lead artefacts** and committed, so that the authorization traces to MSG-0157 and to
the Lead's task file rather than to a working-tree edit no future session could read. Full detail:
**checkpoint `TASK-0046` §1**, and the question this raises about the mechanism is **Q17**, which
blocks nothing.

**The precedent for a Claude session writing a READY row is `1dd7a78`**, which is the row that made
TASK-0045 READY. **Queue reconciliation is transcription of a committed authorization; it is not
self-authorization, and it may never become one.**

### Stop conditions

Stop if the work would require **installing anything**, **modifying host configuration**, **operator
intervention beyond the existing grants**, **changing DA-1, N1–N5 or any clearance gate**, or
**selecting, adopting, clearing, deploying or implementing an engine**. **An environment boundary is
recorded, not routed around** — BLK-0008, BLK-0010 and BLK-0011 are the precedents.

**Also stop if `origin/main` moves mid-run.** The starting HEAD is recorded in checkpoint 1.

### Recovery procedure

**Read the Lead's task file and EPA-0006 §4.13/§4.16 at the source before measuring, not this
section's pointer to them.** **Do not re-run TASK-0045's probe and report its output as new evidence**
— the constraint is in the task file in terms (*"do not silently re-run prior evidence as new
evidence"*), and TASK-0045's 236-occurrence result is the thing this task must **measure the mechanism
of**, not restate. **MSG-0156 is the trap to avoid twice: a negative control's finding may never be
reported as a finding about the subject.**

---

## TASK-0048 — bounded N6 measurement

**Priority:** 1 | **Status:** **READY** | **Owner:** Claude Code
**Depends on:** **MSG-0161** (Q20 = **YES**); **MSG-0160** (Q19 = YES); **MSG-0158** (the four
topologies and the two write shapes); TASK-0047 COMPLETE; **EPA-0006 §4.18** (N6, N6.1–N6.3),
**§4.13** (N1–N5, W1–W4) and **§4.16** (DA-1…DA-7), all binding as written
**Next eligible task:** none — the deliverable is an execution record. **Engine selection stays
blocked and must be separately authorized.** **MSG-0161's Q18 consequence — promoting TASK-0046's
topology/durability evidence into EPA-0006 as its own section — is a SEPARATE obligation, carried as
`TASK-0049` (AUTHORIZED, NOT READY), and this task does not perform it.**
**Type:** evidence / measurement — **it may clear nothing**, and **satisfying N6 clears nothing**
even where it is met (EPA-0006 §4.18).

### The specification is the Lead's own file, and it is not summarised away

> **[`TASK-0048-n6-measurement.md`](TASK-0048-n6-measurement.md)** — committed by the Architecture
> Lead at `fef8bad`, and **authoritative for this task**. It carries the objective, the topologies
> and scope, the six required outcomes, the constraints and the execution boundary. **Read it
> directly. Where this section and that file differ, the file wins and the difference is reported** —
> the same rule TASK-0045 carried for §4.16 and TASK-0046 for its own definition.

**This section exists to record the queue reconciliation, not to restate the task.**

### How this row came to exist

**The Lead committed the Q18/Q20 ruling (`e7daa45`) and the task definition (`fef8bad`) and did not
commit the queue row.** The task file's own execution boundary then gates execution on that row:
*"It is not executable until it appears as the single READY task in the authoritative
`implementation/operations/CLAUDE-TASKS.md` queue."* **This is the third consecutive time the ruling
and the definition landed without the row** — TASK-0045 (`1dd7a78`), TASK-0046 (recorded in that
task's section), and now TASK-0048 — so the supervisor correctly read `NOOP :: no READY task` and
the loop stalled with the work already authorized.

**The row above was written from the two committed Lead artefacts and nothing else**, so the
authorization traces to MSG-0161 and to the Lead's task file rather than to a conversation or a
working-tree edit. Full detail: **MSG-0162**. **Queue reconciliation is transcription of a committed
authorization; it is not self-authorization, and it may never become one.**

**No working-tree row was present before this reconciliation** — `git status` was clean at
`fef8bad`, which is the check MSG-0158's Q17 asks for and the TASK-0046 phantom-row incident made
mandatory.

### Stop conditions

Stop if the work would require **installing anything**, **modifying host configuration**, **operator
intervention beyond the existing grants**, **changing N1–N5, DA-1…DA-7, E1–E4, strict Shape-1 or any
clearance gate**, or **selecting, adopting, clearing, deploying or implementing an engine**. **An
environment boundary is recorded, not routed around** — BLK-0008, BLK-0010 and BLK-0011 are the
precedents, and **BLK-0011 (no interpreter for an unattended runner) is the one most likely to bite
this task**: if it does, record it and stop rather than substituting a different instrument.

**Also stop if `origin/main` moves mid-run.** Record the starting `HEAD` in checkpoint 1.

### Recovery procedure

**Read the Lead's task file and EPA-0006 §4.18/§4.13/§4.16 at the source before measuring, not this
section's pointer to them.** **Do not re-run TASK-0046's probe and report its output as new N6
evidence** — the constraint is in the task file in terms, and TASK-0046's L4/W-B 15-occurrence result
is the thing this task must measure **against N6**, not restate. **Establish provenance before
assigning any N6 finding**: residue whose provenance is the topology transition itself is not, on its
own, a violation (§4.18, DA-4 row 1). **MSG-0156 remains the trap to avoid: a negative control's
finding may never be reported as a finding about the subject.**
