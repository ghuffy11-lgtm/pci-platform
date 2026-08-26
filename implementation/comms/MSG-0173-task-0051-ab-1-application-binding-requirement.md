# MSG-0173 — TASK-0051 execution record: `AB-1` is defined, nothing is built, and nothing is discharged

**From:** Claude Code
**To:** Architecture Lead
**Date:** 2026-08-26
**Status:** OPEN — record. **No referral, and no decision is required to proceed.**
**Authority:** **MSG-0171** (Q22 = conditional YES); **MSG-0172 §5**; the Lead's committed task file
[`TASK-0051-define-ab-1-application-binding.md`](../operations/TASK-0051-define-ab-1-application-binding.md).
**Starting HEAD:** `c05f23f16e39eabea9f00c1ae718494ccb48c5a0`

---

## 1. Result

**7 of 8 required outcomes MET by direct verification; the 8th is met and carries one bounded
qualification, stated in §8 rather than rounded up.**

**EPA-0006 §4.20 is written**, defining **`AB-1`, the application-binding requirement**, with limbs
**`AB-1.1`–`AB-1.4`**. **241 insertions / 0 deletions**, one file, additive. **One declared pointer
note** added below §4.6 S6's existing TASK-0036 note.

**The headline is the constraint, not the deliverable:**

> **`AB-1` DISCHARGES NOTHING. GAP-B remains UNDISCHARGED. E4 remains UNMET. All six §4.14 candidates
> remain NOT CLEARED. Eleven probes have cleared nothing.**

**Nothing was built** — no linter, rule, CI configuration or test. **Nothing was measured** — no probe,
fixture or harness, no test executed, **no test count claimed and none could be.**

## 2. What §4.20 says, in the order it says it

| | Content |
|---|---|
| **Preamble** | A blockquote placed **before anything else**, stating that AB-1 discharges nothing and reports no progress against any gate. **Put first deliberately** — MSG-0171 §4 names over-reading as the failure mode, so the disclaimer precedes the definition rather than following it |
| **Why the section exists** | MSG-0168 §5.3's measured 2×2 reproduced, not paraphrased; MSG-0171 §2's interlock-vs-claim sentence quoted; TASK-0044's define-before-measure precedent named |
| **`AB-0`** | The two structural choices declared, **with the collision check recorded as a table** |
| **`AB-1`** | The prohibition, stated as a prohibition |
| **`AB-1.1`–`AB-1.4`** | The four MSG-0171 §3 properties, **each its own limb** |
| **`AB-2`** | The relationship to E4, stated as a four-step ordering |
| **`AB-3`** | What AB-1 does **not** do, with MSG-0171 §4's five surface findings quoted |
| **`AB-4`** | Evidence semantics in §4.6 S9's vocabulary — **no new verdict words** |
| **`AB-5`** | Fail-closed, and **the project's current AB-1 status under it** |
| **Boundary** | What the section does not establish, item by item |

## 3. The prohibition, and the one judgement call inside it

> **AB-1 — Application binding.** **The application must never place content drawn from the governed
> corpus into the text of a statement submitted to the retrieval engine.** Such content must be passed
> **only** as a bound parameter, and **the prohibition must be enforced mechanically rather than
> observed by convention**, on every path by which the application can reach the projection store.

**The judgement call, declared because it could defensibly have gone the other way.** MSG-0171 speaks of
*"unauthorized passage content"*. **§4.20 states the prohibition over content drawn from the governed
corpus, not over unauthorized content**, and says why in the section: **at the point a statement is
constructed, whether a given passage is unauthorized for someone is not a property the constructing
code can be relied on to know.** A prohibition phrased over *unauthorized* content would be
unenforceable by exactly the automated tooling AB-1.1 requires — a checker can see that corpus text was
concatenated into SQL; it cannot see whose entitlements that text falls outside.

**This is strictly the stronger reading and relaxes nothing.** Every case MSG-0171 names is inside it.
**If the Lead intends the narrower phrasing, it is a one-line change and this record is where to say
so** — but the narrower phrasing would, on the reasoning above, make AB-1.1 unsatisfiable.

## 4. The four limbs, and why AB-1.4 is the one that will be treated as ceremony

**Each is a separate limb so a deployment can fail one alone**, which is required outcome 2.

| Limb | The bar |
|---|---|
| **AB-1.1 Automated** | Tooling that runs **without a person choosing to run it**. **Review, checklist, convention, style guide and documented practice do not satisfy it, whatever their diligence** |
| **AB-1.2 Build-failing** | **A warning is not enforcement**, a report that must be read is not enforcement, and **a check whose failure can be merged past is not enforcement** |
| **AB-1.3 Complete over reachable paths** | Migrations, maintenance scripts, admin and diagnostic tooling, background jobs, re-index and rebuild paths, **and any second binding or client** — wherever they can reach the store. MSG-0171 §3.3's *"not merely the retrieval component's happy path"* |
| **AB-1.4 Evidenced by a demonstrated failure** | **A test shown to FAIL when an inlined statement is introduced.** *"A check nobody has watched reject anything is untested"* |

**AB-1.4 is §4.6 S5 applied to the control rather than to a counter, and the section says so.** **A green
pipeline is a zero count** — it *"proves only that nothing unauthorized crossed the point where the
instrument sits."* **A check never observed rejecting anything is indistinguishable from one that is
misconfigured, scoped to the wrong paths, or silently disabled.** The record has paid for this
distinction three times already and each instance is cited: §4.12's calibration-before-use, TASK-0048's
`fail()` interlock, and **MSG-0169 §2's finding that TASK-0050's *"Run validity: VALID"* was an
assessment and not an interlock.**

## 5. The relationship to E4, and the thing this record most needs not to be misread as

**Stated in §4.20 `AB-2` as an ordering, so it cannot be read as a shortcut:**

1. **A candidate E4 surface must first BE a log.** Unchanged; AB-1 does not address it.
2. Where such a log is built on the **unexpanded** statement text, MSG-0171's condition applies, **and
   AB-1 is that condition.**
3. Where **AB-1 is unsatisfied**, the unexpanded surface **does not satisfy E4**.
4. Where **AB-1 is satisfied and the surface is still not a log, E4 is still UNMET.** **Satisfying AB-1
   moves nothing on its own.**

**And the second objection is untouched, which is the whole of §4.20 `AB-3`.** MSG-0171 §4's five
findings are quoted rather than summarised — `sourceSQL`/`expandedSQL` are per-statement accessors with
**no accumulation**; `createTagStore` accumulates and **has no read path**; `dbstat` is page statistics;
`setAuthorizer` is prepare-time; and **`sqlite_stmt`, which would have been exactly such a log, is
absent from the build.** **C1 = NO on every member measured.**

> **"E4 asks for log inspection. A surface that shows you one statement you are already holding is not a
> log, and this ruling does not make it one."**

**`AB-3` then states item by item what AB-1 does not do — discharge GAP-B, satisfy E4, make a non-log
surface into a log, clear anything, or show the gate satisfiable** — that last one because MSG-0168
established the gate is **not shown UNSATISFIABLE**, **which is not the same claim**, and §4.20 makes
neither.

## 6. The collision check — performed and recorded, not asserted

**Required outcome 5, and it is a measurement.**

```
rg '\bAB-?\d|\bAB\b' docs/                        -> No matches found (0 occurrences, 0 files)
rg '\bAB-?\d|\bAB\b' implementation/architecture/ -> No matches found (0 occurrences, 0 files)
```

Every identifier token actually present in EPA-0006 was then **enumerated rather than recalled**:

```
DA-0 DA-1 DA-1.1 DA-1.2 DA-1.3 DA-2 DA-3 DA-4 DA-5 DA-6 DA-7
E1 E2 E3 E4 E5
EV1..EV12
F1..F16
G-Q4 G-Q4.1..G-Q4.4 G-Q5 G-Q5.1 G-Q5.2 G-Q6 G-Q6.1..G-Q6.4 G-Q7 G-Q7.1..G-Q7.6 G-Q7.8
GAP-A GAP-B GAP-C GAP-D GAP-E
I0..I8   N1..N6 N6.0..N6.3   S1..S11 S7.1..S7.4   U1..U5   W1..W4 W-A W-B
```

**`AB` appears nowhere. No collision**, against any of the eleven namespaces the task file lists. The
per-namespace result is recorded as a table in §4.20 `AB-0` rather than as a sentence.

**Two things the enumeration turned up, recorded rather than acted on:**

1. **`E5` does occur in the document** — only inside §4.16 `DA-0`, as the label that was **rejected**.
   Consistent, and worth knowing before someone greps for a free `E` number.
2. **The highest `EV` in EPA-0006 is `EV12`.** **`EV13` is ruled by MSG-0172 §2 and is not yet written
   into the record.** **TASK-0051 did not write it** — the task file names it as a separate obligation
   this task does not perform. **§4.20 declares the gap rather than leaving it to be discovered**, and
   it remains outstanding.

## 7. Constraints — each checked, not assumed

| Constraint | State |
|---|---|
| **Documentary only; build nothing** | **HELD.** No linter, rule, CI configuration or test written. `git status` shows two modified files and three new records, none executable |
| **Measure nothing** | **HELD.** No probe, fixture or harness; **no test executed; no test count claimed** |
| **Additive; zero deletions** | **VERIFIED** — `git diff --numstat` reports **`241  0  implementation/architecture/EPA-0006-…`**. **Zero deletions is the mechanical proof that no existing line was reworded** |
| **`git diff --name-only docs/` empty** | **VERIFIED** — empty |
| **No change to E1–E4, S1–S11, DA-1…DA-7, N1–N6, EV1–EV13, G-Q4…G-Q7.8, Shape-1, any gate** | **HELD** — implied by zero deletions, and stated in §4.20's boundary |
| **E4 not weakened, narrowed or reinterpreted** (MSG-0119) | **HELD** — §4.20 `AB-2` states E4 requires exactly what it required before; the pointer note says so in §4.6 S6 itself |
| **No candidate verdict changes** | **HELD** — all six §4.14 candidates NOT CLEARED; **eleven probes have cleared nothing** |
| **Nothing selected, adopted, preferred, ranked, deployed, implemented or cleared** | **HELD** — no engine, runtime, binding or index technology is named as bearing any property |
| **Do not state or imply GAP-B is closer to discharge** | **HELD, and enforced structurally** — the section's **first** element is the blockquote saying so, and `AB-3` is devoted to it |
| **EV13/Q14 update NOT performed** | **HELD** — declared as outstanding in `AB-0` and in the boundary |
| **L4/W-B re-measurement NOT performed** | **HELD** — named in the boundary as authorized and NOT READY |
| **Stop at any environment or operator boundary** | **HELD** — one was hit; see §8 |
| **Stop if `origin/main` moves mid-run** | **Checked as far as this runner is permitted; see §8** |

## 8. The one qualification, stated rather than rounded up

**Required outcome 7 has two limbs. The first is verified; the second is bounded by a permission
denial, and this is the same limitation TASK-0050 recorded in MSG-0168.**

**`git fetch origin` and `git ls-remote origin main` were DENIED to this runner** by the permission
layer — *"This command requires approval"*, returned twice, in a non-interactive supervisor-started
session. **So `origin/main` was compared using the local remote-tracking ref**, which an earlier session
last updated.

**What that means precisely, without overstating it in either direction:**

- **VERIFIED:** at session start, `HEAD` and the local `origin/main` ref were both
  `c05f23f16e39eabea9f00c1ae718494ccb48c5a0`, and the working tree was clean.
- **INFERRED, not verified:** that the remote had not moved since that ref was last fetched.
- **The interlock that does hold:** **a push against a moved `origin/main` is REJECTED as
  non-fast-forward.** That is a mechanical check rather than a claim, and **BLK-0013 is the precedent
  where it fired.** The mid-run movement rule is therefore enforced by the push, not by an assertion in
  this record.
- **The `verified from origin/main` limb** of required outcome 7 is discharged by reading the section
  back from `origin/main` **after** the push succeeded — recorded in §9.

**No workaround was taken.** The denial was not routed around with an alternative transport, a
different remote, or a shell pipe.

**Separately, MSG-0172 §3 ruling 2's standing pre-push check was run** —
`node implementation/probes/TASK-0050/queue-parse-check.mjs` — **before** the queue row was pushed. Its
output is recorded in §9.

## 9. Verification evidence

**Session start — the state the mid-run movement rule is measured against:**

```
git status --short        -> (empty; working tree clean)
git rev-parse HEAD        -> c05f23f16e39eabea9f00c1ae718494ccb48c5a0
git rev-parse origin/main -> c05f23f16e39eabea9f00c1ae718494ccb48c5a0
git log --oneline -1      -> c05f23f Rule Q14, Q21, Q17 and the L4/W-B divergence; authorize TASK-0051
```

**Immediately before the commit — re-checked, not carried forward from session start:**

```
git rev-parse HEAD origin/main
  c05f23f16e39eabea9f00c1ae718494ccb48c5a0
  c05f23f16e39eabea9f00c1ae718494ccb48c5a0

git diff --numstat
  241  0  implementation/architecture/EPA-0006-assistant-technology-evaluation.md
    1  0  implementation/comms/README.md
    2  1  implementation/operations/CLAUDE-TASKS.md
    3  1  implementation/status/current.md

git diff --name-only docs/
  (empty)
```

**On the two files that do show a deletion, stated rather than left to be noticed.** **The additive
requirement is on the architecture change, and it is met exactly — `241 / 0`.** The queue and the status
file each **rewrite one line of their own**: the queue's TASK-0051 row moves `READY` → `COMPLETE`, and
the status file's `Last Updated:` line is replaced. **In both cases the superseded text is RETAINED in
place** — the queue row carries *"The original instruction is retained below for the record"*, and the
status file carries the prior line as a `The line this replaces, retained:` blockquote, which is that
file's standing convention. **No EPA-0006 line was reworded anywhere.**

**Section placement verified structurally rather than assumed:**

```
2845: ### 4.19 TASK-0046 topology/durability evidence …
3001: ### 4.20 The application-binding requirement — AB-1 (TASK-0051, MSG-0171 / MSG-0172 §5)
3043: #### AB-0 …   3090: #### AB-1 …   3125: #### AB-2 …
3146: #### AB-3 …   3178: #### AB-4 …   3191: #### AB-5 …
3230: ## 5. Candidate technology classes against Approach C
```

**§4.20 is the next free number** — §4.19 was the last allocated — **nothing is renumbered and no number
is skipped.** `AB` tokens occur in exactly two places: **§4.20**, and **the declared pointer note at
§4.6 S6 (lines 488–494)**. Nowhere else.

**The standing pre-push queue check (MSG-0172 §3 ruling 2), run before the push:**

```
node implementation/probes/TASK-0050/queue-parse-check.mjs

rows parsed          : 49
TASK-0050 parsed as  : {"id":"TASK-0050","status":"COMPLETE","depends":["TASK-0049"]}
TASK-0049 parsed as  : {"id":"TASK-0049","status":"COMPLETE","depends":["TASK-0048"]}
PROBLEMS             : none
READY tasks          : (none) -> the Supervisor will NOOP, which is correct: only the
                       Architecture Lead may authorize the next task
```

**`READY tasks: (none)` is the correct and intended outcome**, not a stall: TASK-0051 is now COMPLETE
and **only the Architecture Lead may authorize what follows.** **`PROBLEMS: none` confirms the modified
row parses against the Supervisor's own dependency-cell scan** — which is the failure Q17 ruled on, and
the reason the check is now standing rather than one-off.

**Numbering re-verified immediately before the commit**, per the register's own step 2: no `MSG-0173` or
higher file existed on disk other than this one.

**Post-push read-back from `origin/main`** — required outcome 7's second limb — **is recorded in
checkpoint 2 of [`checkpoints/TASK-0051.md`](../operations/checkpoints/TASK-0051.md)**, because it can
only be taken after the push it verifies.

## 10. Index drift — reported, deliberately NOT fixed, on the MSG-0037 / MSG-0039 precedent

**`comms/README.md` has no row for `MSG-0169`, `MSG-0170`, `MSG-0171` or `MSG-0172`** — all four
Lead-authored, all created 2026-08-26. **`MSG-0166` and `MSG-0167` still have none either**, and
**`DISC-0013` still has none in `discoveries/README.md`**; the TASK-0050 session reported both and
declined to fix them, and that note is still standing in the register's own preamble.

**A row for `MSG-0173` — this record, which this session authored — IS added**, because the register's
own rule makes registering one's own message part of creating it. **Rows for another author's messages
are not added**: TASK-0013 found a missing blocker-index row and **reported it rather than fixing it**,
and the Lead authorized the correction separately in **MSG-0037**; TASK-0015 added six missing discovery
rows only under **MSG-0039**. **Adding another author's index rows without authorization is the pattern
those two decisions declined to set.**

**This is now the sixth index-drift finding in the record**, and it keeps arriving by one habit —
**creating a record in its own file and not in the table that indexes it, in the same commit.** **That
is the same shape as the defect Q17 ruled on** (MSG-0172 §3: the ruling, the task file and the queue row
are one commit). **Whether the register rule should be stated the same way is not a question this task
was authorized to raise, and it does not raise one.**

## 11. What has NOT changed

- **GAP-B UNDISCHARGED. E4 UNMET.** MSG-0171 §4 stands: **none of the surfaces found is a log**, and
  **nothing here touches that objection.**
- **All six §4.14 candidates NOT CLEARED. Eleven probes have cleared nothing.**
- **No gate, invariant, criterion, evidence class or verdict changed.** **E4 not weakened** (MSG-0119).
- **Nothing selected, adopted, deployed, implemented or cleared.**
- **`AB-1` has been defined and never applied.** **No AB-1 verdict exists for any component**, and the
  project's own status under `AB-5` is **`NOT CLEARED`, because none of the enforcement is built** —
  which **costs nothing today**, since no E4 evidence rests on an unexpanded surface and selection is
  blocked on independent grounds.

## 12. Outstanding, and none of it is created by this task

1. **The EV13 / Q14 EPA-0006 update** (MSG-0172 §1–§2) — **authorized in substance, no task, not
   performed here.**
2. **The L4/W-B re-measurement** (MSG-0172 §4) — **authorized, NOT READY**, sequenced after this task.
3. **Building the AB-1 check itself** — **no authorization exists.** MSG-0171 §3: *"It is a requirement
   created by this ruling, not a description of anything that exists."*
4. **BLK-0012** — OPEN; the reach the GAP-B answer is bounded by.
5. **The index drift in §10** — reported, unfixed, awaiting the Lead as MSG-0037 and MSG-0039 did.

**No task is proposed as READY and none may be.**
