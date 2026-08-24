# MSG-0139 — TASK-0042 Reconciled, and Four EPA-0006 Headings Brought Into Line

**Status:** **OPEN** — informational, with **one item referred** (§4, non-blocking)
**Raised:** 2026-08-24
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0137, with MSG-0138's queue instruction | **Related:** MSG-0133, MSG-0134, MSG-0135, MSG-0136, MSG-0132, DISC-0011

---

## 1. The queue write MSG-0138 named had not happened

**MSG-0138 asked for the authoritative queue to be updated on `main` to mark TASK-0042 READY.** At the
start of this session, `CLAUDE-TASKS.md` contained **zero occurrences of the string `TASK-0042`** — the
commit titled *"Reconcile TASK-0042 as next READY evidence task"* (`2841f23`) **added only the MSG-0138
message file** and touched no other path.

**So the supervisor was right and nothing was stalled.** Its 17:07:20Z heartbeat reads `decision: NOOP`,
`reason: no READY task`, `head: 2841f23` — **an accurate reading of the queue as it stood**. **The queue
is the authority, and an authorization that has not reached it does not start work.** MSG-0138 is honest
about this: its own status line says *"queue write pending supervisor/session reconciliation"*.

**This is the ninth time authorization has existed while the queue did not reflect it.** The gap is
always closed the same way — by a COMMS session writing the row — and it is worth stating that **the
fail-closed behaviour is working as designed**: a runner that invented a READY task from a message file
would be a far worse failure than one that waits.

**TASK-0042 is now READY in the queue, with a board row and a full task section.**

> **Commit note, added by the session that committed this file.** The interactive session that wrote
> §1–§7 **wrote the queue row and these notes into the working tree but did not commit them**, so at
> **`2841f23`** the queue on `main` still held **zero occurrences of `TASK-0042`** — the same state §1
> describes. The **supervisor-started TASK-0042 session on 2026-08-24** found the working tree dirty at
> that HEAD, verified the pending changes against MSG-0137 and MSG-0138, and **committed and pushed them
> before beginning any measurement.** **The sentence above became true at that commit, not before it.**
> One figure was corrected in the same commit: the `implementation/comms/README.md` row for this message
> said **48 insertions / 1 deletion** for EPA-0006 where `git diff --numstat` reports **58 / 1**, which is
> what **§2 of this file already said**.

## 2. Four rulings had landed; EPA-0006 still read them as open

**Q1 (MSG-0134), Q2 (MSG-0135), Q7 (MSG-0136) and Q13 (MSG-0133) are all DECIDED.** The decisions were
recorded in COMMS and in two new side files under `implementation/architecture/`. **But EPA-0006 itself
— the record every probe and task reads — still said they were open**, in its Q1 and Q2 headings, its
Q7 heading, its Q13 heading, and in §4.13's **GAP-E**.

**A reader of EPA-0006 alone would have got the wrong answer**, which is exactly the drift the project
has warned about since TASK-0030. **MSG-0133 also instructs the change in terms**: *"EPA-0006 §4.13 Q13
is updated from Surfaced, NOT decided to DECIDED, with this message as the ruling authority."* That
instruction was outstanding.

**What was done — additive and declared, on TASK-0040's mechanism:**

| Location | Change |
|---|---|
| §4.7 **Q1** heading | Declared note: **ruled A, strict**; U1 stays in scope |
| §4.7 **Q2** heading | Declared note: **ruled B**, physical isolation where necessary; logical/physical distinction preserved |
| §4.9 **Q7** heading | Declared note: **ruled A**, zero stale-answer tolerance, **no threshold introduced** |
| §4.13 **Q13** heading | **Heading text changed** to `RULED by MSG-0133`, plus a declared note — **the one deletion**, and the one MSG-0133 explicitly asks for |
| §4.13 gap block | Declared note: **GAP-E discharged**; **GAP-A, GAP-B and GAP-C are not** |
| §4.9 **G-Q4** open interaction | Declared note: Q1's fail-closed default **is now the ruling** — see §4 below |

**58 insertions, 1 deletion. No question body was reworded, no verdict touched, no gate changed.** Each
note **points at the deciding message rather than restating the rule** — the pattern §4.12 set for Q12,
because two statements of one rule invite drift.

## 3. What the rulings do to the evidence work — they tighten it

**None of the four relaxes anything.** Each was ruled in the fail-closed direction the record already
defaulted to, so **every existing verdict stands unchanged**, and **nothing became CLEARED by a
decision**.

- **Q1 = A** keeps **U1 in scope** — the finding that turned K8's `U = 0` into a rising lower bound is
  now binding rather than a strict reading a probe chose.
- **Q2 = B** makes **routing and physical structure part of what must be measured**, which is precisely
  TASK-0042 item 1.
- **Q7 = A** removes the elapsed-time allowance that never existed anyway — **there is no threshold to
  test against, so the test is the transition itself.**
- **Q13** bounds the topology to the **current/"now" frame**, discharging GAP-D **as scope**, not as
  measurement: **I7 remains NEVER MEASURED.**

## 4. Two items referred, neither blocking

**One numbered question is settled and one unnumbered interaction is not.** §4.9's G-Q4 carries an
**open interaction** — whether an **exact-key catalogue lookup of an already-computed structure name**
is itself examination. It was parked on Q1, and **Q1 is now ruled A**, so the fail-closed default that
paragraph names **is now the ruling**. **What this session did not do is declare the interaction
settled**: MSG-0134 rules on index entries, keys and metadata, while MSG-0109 §9 Q4 records this one as
*"related but distinct"* — identifiers describing **structures**, not **chunks**. **The practical
position is the same either way** — the strict reading applies, and it can only withhold clearance,
never grant it — **so it blocks nothing.** A note recording exactly that was added at the paragraph.

**Sentences elsewhere in EPA-0006 still say Q1 and Q2 are open** — inside §4.7's own bodies, in §4.11,
and in §4.13's numbering paragraph. **They were true when written and are deliberately left as written**,
with the heading notes carrying the current state.

**Whether EPA-0006 should be updated in place more fully is the Architecture Lead's call.** A fuller
rewrite would touch several completed sections, which is a task-shaped change and not a reconciliation.
**It blocks nothing**: TASK-0042's authorization comes from MSG-0137 and the rulings themselves.

## 5. DISC-0011 — carried into the queue without misquoting anything

**DISC-0011 records that §4.11's summary says *"6 NOT CLEARED, 3 DISQUALIFIED"* while its own table
lists seven and three.** **This queue repeats that tally in three places** — TASK-0038's board row, the
MSG-0118 ledger row, and the TASK-0038 section.

**None of the three was edited.** Each faithfully reproduces what MSG-0118 and §4.11 say, and
**rewriting a quotation to fix its source's arithmetic would misquote it**. A declared note under the
status board records the correction instead. **Every individual verdict is correct — K7 and K8 remain
NOT CLEARED — and nothing downstream depends on the count.** Correcting §4.11 itself needs the Lead's
authorization; **DISC-0011 stays open.**

## 6. Verified this session

| Claim | Evidence |
|---|---|
| Repository reconciled at start | `git fetch`; `HEAD` = `origin/main` = **`2841f23`**, `git status --porcelain` empty |
| TASK-0041 delivered | **EPA-0006 §4.13**, 392 insertions in `ad75f2c`, checkpoint `49ef0a1` |
| The ADR-0018 change was authorized | **MSG-0133 §"ADR / architecture application"** instructs the in-place clarification; the diff touches **one file**, header plus two paragraphs |
| TASK-0042 absent from the queue | `grep TASK-0042 CLAUDE-TASKS.md` — **no match** before this session |
| Registers clean before insertion | MSG-0133…MSG-0139 each had **0 rows** in both indexes; each now has **exactly 1** |
| No blocker open | Blocker index unchanged; no `runner.lock` |

## 7. State

- **TASK-0042 is READY and is the single READY task.** Not started at the time of writing.
- **TASK-0041 is COMPLETE** (8/8) — §4.13 delivered, **selection still blocked**.
- **Q1, Q2, Q3, Q7 and Q13 are ruled.** **Q4–Q6 and Q8–Q12 were already ruled.** **Every numbered
  question Q1–Q13 is now ruled** — the first time that has been true. **One unnumbered interaction in
  §4.9 G-Q4 remains formally unsettled** (§4 above), with its fail-closed reading now backed by a
  ruling rather than a default.
- **K7/K8 remain NOT CLEARED; five probes have cleared nothing; GAP-A, GAP-B and GAP-C stand**, and
  **GAP-B blocks clearance independently of topology.**
- **DISC-0011 is open** — an arithmetic summary, not a verdict.
- The scheduler is **enabled**; a cycle can take TASK-0042 without a manual trigger.
- **No implementation task is authorized or READY. Nothing is selected.**
