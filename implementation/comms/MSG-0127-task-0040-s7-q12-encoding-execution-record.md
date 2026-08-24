# MSG-0127 — TASK-0040 Execution Record: Q12 encoded in EPA-0006 §4.6 S7

**Status:** **OPEN** — record only. **No referral, no question, nothing blocking.**
**Raised:** 2026-08-24
**Raised by:** Claude Code — supervisor-started runner, lock `{"taskId":"TASK-0040","pid":20752,"acquired":"2026-08-24T10:27:18Z"}`
**Type:** Execution record — criterion / evidence-instrument update
**Authority:** **MSG-0125** (AUTHORIZED), with **MSG-0124** (Q12, DECIDED) binding · queue section
`implementation/operations/CLAUDE-TASKS.md` §TASK-0040 · **MSG-0126** (reconciliation)
**Related:** MSG-0123 (TASK-0039 evidence), MSG-0105/TASK-0034 (the precedent mechanism), EPA-0006 §4.6 S7, §4.12

---

## 1. What was done, in one paragraph

**EPA-0006 §4.6 S7 now carries the Q12 ruling as four sub-sections — S7.1 through S7.4 — added
additively.** The three numbered requirements S7 already had are reproduced unchanged; **nothing in
the document was deleted or reworded.** A declared pointer note was added under the §4.12 Q12 referral
so a later reader does not find the question recorded as open. **The change is 98 insertions, 0
deletions, on one file.** **Nothing was selected, nothing was cleared, no ADR was touched, no probe
was written or re-run, and no verdict changed.**

## 2. What S7 said before, and the exact gap that was closed

S7 required a probe to *"record where each instrument sits"*, *"report the maximum count across all
placements"*, and *"never present a single count as 'the' number"*. **It did not say which placements
must be attempted.** §4.12's Q12 referral names that gap in those words, and TASK-0039 demonstrated
its cost: a placement four prior probes had not taken turned a reported `U = 0` into a rising lower
bound **on the same design**.

**The rule Q12 installs is narrow and it is a gate, not a caution.** A row-access counter can read
**zero** while an index cursor walks entries the subject may not see — §4.12 gap 2 shows the opcode
sequence that makes it so, an entry failing the residual being rejected *from the index* with the
table row never read. **S5 always said a zero count proves only what crossed the instrument.** What
changed is that the **omission is now disqualifying** rather than dependent on a probe noticing.

## 3. What was added — S7.1 to S7.4

| Sub-section | What it does |
|---|---|
| **S7.1** | **Quotes MSG-0124's ruling verbatim**, with its stated consequences quoted alongside it — the bar is not relaxed, a probe omitting a reachable placement cannot clear on row-access-only evidence, **K7 and K8 remain NOT CLEARED**. States that it is a **criterion decision, not an engine selection and not implementation authority**, and gives the opcode-level reason the rule is worth a gate |
| **S7.2** | **The three requirements as a failable table — S7-R1, S7-R2, S7-R3** — each with *what discharges it* and *what fails it*. **R3 states the insufficiency as disqualifying**: E2 is **not satisfied**, and by S6 the candidate is **NOT CLEARED** |
| **S7.3** | Defines **"reachable"** as *a placement an instrument can actually occupy through the test subject's own API, runtime or configuration, as exercised* — established by taking it, never by documentation. Permits a probe to report that **none** is reachable **only by enumeration**, pointing at §4.12 gap 1 as the worked standard **including its nonexistent-pragma control**. States that **unreachability is not relief**: the zero stays inconclusive, E1 is still required, and **S10 may bite** |
| **S7.4** | **What this does NOT change**, item by item — verdicts, TASK-0038's row-access `U = 0`, K3/K4/K7/K8, ADRs, G-Q4.4, and the fact that no implementation task becomes READY |

**The requirements as encoded, matching MSG-0125's three:**

1. **S7-R1** — every reachable index-cursor placement the subject exposes **must be exercised**, in
   addition to the other applicable placements. **Exercised means executed and captured**; naming or
   describing a placement is not exercising it, on §4.9 G-Q6's rule that construction never replaces
   execution evidence.
2. **S7-R2** — the reported `U` is the **maximum observed across the exercised applicable placements**,
   and remains a **lower bound**. A mean, a median, or a placement chosen after the numbers were seen
   all fail it.
3. **S7-R3** — **row-access-only `U = 0` is insufficient for E2** where a reachable index-cursor
   placement exists and was not exercised. **Nothing discharges R3 except exercising the placement.**

**What a probe must now record for E2, in every case:** the placements attempted; the count at each;
which is the maximum and therefore the reported `U`; and **the set of reachable-but-unexercised
placements, which must be empty.**

## 4. Acceptance criteria — evidence for each

| # | Criterion | Evidence | Result |
|---|---|---|---|
| 1 | S7 carries all three requirements explicitly and testably, **quoting MSG-0124** rather than paraphrasing | S7.1 reproduces the ruling as a block quote attributed to MSG-0124; S7.2 states R1–R3 in a table with discharge and failure columns | **MET** |
| 2 | The insufficiency rule is stated as **disqualifying** | S7-R3: *"E2 is NOT satisfied, and by S6 the candidate is NOT CLEARED"*; S7.3: *"A non-empty set is E2 not satisfied, however clean the row-access figure looks"* | **MET** |
| 3 | **"Maximum observed across exercised applicable placements"** stated as the reported figure | S7-R2 | **MET** |
| 4 | The change is **additive and declared**, TASK-0034 manner; any non-additive edit called out | `git diff --numstat` → **`98  0`**. **There is no non-additive edit to call out.** Both additions open with a dated declaration naming TASK-0040 and MSG-0125 | **MET** |
| 5 | **No accepted ADR modified** | `git diff --name-only docs/` → **empty**, checked after every edit | **MET** |
| 6 | All existing verdicts reproduced unchanged, K7/K8 NOT CLEARED included; **no prior probe re-run** | S7.4 states the verdicts; `git status --porcelain implementation/probes/` → **empty**, no probe file created or modified. **Nothing was executed at all** | **MET** |
| 7 | Post-change EPA-0006 **verified from `main`**, exact change statistics recorded | §6 below — read back with `git show origin/main:…` after the push | **MET** |
| 8 | COMMS, queue and status reconciled; **stop after the update and its verification** | this record, the queue section and board row, the register, `current.md`, and checkpoint 2. **No next action started** | **MET** |

## 5. Boundaries — each checked, not assumed

- **No engine, runtime, provider, model or index technology selected.** No implementation, no
  deployment, **no implementation task marked READY.**
- **No gate weakened.** E2, strict Shape-1, `U = 0`, E1–E4, G-Q4, and the Q8, Q10 and Q11 rulings are
  textually untouched — the diff adds lines and removes none.
- **No numeric tolerance or threshold introduced.** S7.2 says so in terms: R1–R3 *"say which placements
  must be attempted and which number is reported"*.
- **No row-access-proves-index-cursor claim** is made anywhere, and S7-R3 **forbids the inference being
  drawn or recorded**.
- **No accepted ADR amended, proposed, or affected.**
- **No probe written, run, or re-run.** No engine installed or started, **no network reached**, no
  corpus entered, no wall clock read, and **no benchmark, latency, capacity, recall or throughput
  figure produced** — there is none in this record to misreport.

## 6. Verification from `main`, with the exact statistics

**MSG-0125 asks for the post-change content to be verified from `main` and the change statistics
recorded.** Both were done **after** the push was accepted, by reading the committed object rather
than the working tree.

```text
git diff --numstat  (EPA-0006, before commit)   -> 98      0
git diff --name-only docs/                      -> (empty)
git status --porcelain  (after commit)          -> (empty)
```

The `git show origin/main:` read-back and the resulting commit hash are recorded in
**checkpoint 2** at `implementation/operations/checkpoints/TASK-0040.md`, written after the push
rather than in anticipation of it.

**Double-application check, required by the task's recovery procedure and run before the edit:**
`grep -c "^#### S7"` → **1**; `grep -n "Q12"` returned **only** the three §4.12 referral hits, none
inside S7. After the edit, `grep -c "^##### S7\."` → **4** (S7.1–S7.4) and the §4.12 note appears
**once**. **The rule is stated in one place**; the §4.12 note is a pointer and deliberately does not
restate it, on TASK-0030's *"two statements invite drift"*.

## 7. The one judgement call in this task, stated rather than absorbed

**MSG-0125 authorized an update to §4.6 S7. I also added a six-line declared note under §4.12's Q12
heading**, which reads *"Surfaced, NOT decided"*.

**Why:** leaving it would have left the record self-contradicting — Q12 ruled in S7 and open in §4.12
— which is exactly the documentation-conflict condition CLAUDE.md makes a stop boundary. **Why it is
not a rewrite:** the heading and every existing line are **untouched**, the note is dated and
attributed, and it **points at S7 instead of restating the rule**. TASK-0036 set this precedent when
MSG-0110's rulings landed: §4.7's preamble gained a declared numbering note while its question text
stayed as written.

**It is recorded here rather than left for a reader to find in a diff.** If the Architecture Lead
considers the note outside TASK-0040's scope, it is six lines in one blockquote and reverts cleanly.

## 8. State after this task

- **TASK-0040 is COMPLETE.** 8/8 acceptance criteria met, each with evidence above.
- **Q12 is encoded and closed.** §4.6 S7.1–S7.4 is where it is read from.
- **Nothing is CLEARED.** **K7 and K8 remain NOT CLEARED**; **K3 and K4 remain NOT CLEARED**; **five
  probes have cleared nothing** and this task ran none.
- **No blocker is open.** **No task is READY.**
- **The next evidence action must be separately authorized** — MSG-0125 requires the run to stop here,
  and it does.

## 9. Known limitation of this record

**`git fetch origin` and `git ls-remote origin` are off this runner's Bash allowlist**; both were
attempted this session and declined by the permission layer. So `origin/main` as read locally is the
**remote-tracking ref**, not a freshly fetched one. **The push being accepted as a fast-forward is the
evidence that the remote had not moved** — a real divergence surfaces as a rejected non-fast-forward,
which is how BLK-0006 was caught. This limitation is unchanged from TASK-0036 through TASK-0039 and is
recorded rather than routed around.
