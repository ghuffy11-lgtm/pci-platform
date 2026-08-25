# DISC-0014 — The Two E4 Test Subjects Were Enumerated to Different Standards, and Compared as Though They Were Not

**Status:** OPEN — recorded for the Lead's attention when the next enumeration is specified.
**No verdict, gate, criterion or section is changed by it.**
**Found:** 2026-08-26, by the supervisor-started TASK-0050 session, while widening the subject-1
enumeration that MSG-0167 required
**Severity:** Method defect. **It did not produce a wrong answer** — the widened enumeration reaches the
**same** E4 result — but it made two subjects look comparable when they had not been examined alike
**Related:** EPA-0006 §4.12 gap 1, §4.14 finding 8, §4.15, §4.13 GAP-B; MSG-0168 §9; TASK-0050

---

## What was found

**`DatabaseSync.setAuthorizer` is present on subject 1 — SQLite 3.51.3 via `node:sqlite`, Node
v24.15.0 — and neither §4.12 gap 1 nor §4.14 finding 8 reported it.**

**This is not a version change**, and that was checked rather than assumed. §4.14 finding 8 records its
own runtime: *"the §4.12 enumeration was re-run in full on the runtime as it stands — SQLite **3.51.3**
via `node:sqlite`, Node **v24.15.0**"*. **TASK-0050 measured the same two version strings.** The member
was present when those enumerations ran.

## Why it was missed — the two enumerations asked different questions

| | What it enumerated |
|---|---|
| **§4.12 gap 1** (subject 1) | *"`DatabaseSync` / `StatementSync` prototypes… **no trace, profile or log member of any kind**"*, plus **four** C-API names by hand: `sqlite3_trace_v2`, `sqlite3_profile`, `SQLITE_CONFIG_LOG`, `sqlite3_stmt_scanstatus`. **No authorizer among them** |
| **§4.15** (subject 2) | **42** public `Connection` names, naming the **three** present — `set_trace_callback`, `set_progress_handler`, **`set_authorizer`** — and **exercising all three**, each disarmed before armed |

**§4.12's sentence is not false.** An authorizer is not a trace, a profile, or a log, so *"no trace,
profile or log member"* remains literally true. **The defect is in the comparison, not the sentence:**
§4.15 treated the authorizer as an instrument worth enumerating and answering for, and subject 1's
E4-unobtainability rested on a name list that never asked about it.

**Two subjects examined against different name lists are not compared.** §4.15's own conclusion —
*"the two subjects differ in the binding, not in the build"* — is a comparison, and comparisons need
both sides measured alike.

## What the widened enumeration actually found — the verdict does not move

TASK-0050 applied §4.15's wider standard to subject 1 and **exercised** the member, with a control
stronger than a silence test: an authorizer returning `SQLITE_DENY` **must** make a prepare fail, and
it did (`Error: not authorized`), so the instrument is **wired to the engine** and not a no-op.

| | Observed on subject 1 |
|---|---|
| Disarmed | **0 events** |
| Armed, unauthorized text **parameter-bound** | 3 events at prepare, 0 at execute; **0 marker occurrences** |
| Armed, unauthorized text **inlined** | 3 events; **0 marker occurrences** |
| Invariance with `N` | rows **200 → 1000 → 5000**, events **3 → 3 → 3** |
| Second identical execution | **0 events** |

**NON-ADVERSE, and it does NOT answer E4** — a prepare-time authorization callback is not a log
(C1 = NO), and a surface invariant with `N` cannot measure `U` (C4 = NO). **This is precisely §4.15's
own classification of the same instrument on subject 2** — *"NO — prepare-time, per column reference"* —
reached here independently.

**So the widened enumeration STRENGTHENS §4.12 and §4.14 rather than overturning them.** E4 remains
**NOT OBTAINABLE** on subject 1, now established on a wider name list than either used. **No sentence of
§4.12, §4.14 or §4.15 is amended and no verdict changes.**

**A second member was also unreported and is recorded in MSG-0168 §5.3 rather than here**, because it
bears on the referral rather than on the method: `StatementSync` exposes **`sourceSQL`** and
**`expandedSQL`** — the unexpanded and expanded statement text as separate accessors.

## Why it is worth recording anyway

**An enumeration is only as good as the name list it runs, and a name list is a choice made before the
answer is known.** The record's whole defence against false negatives is the F15 control — which
distinguishes *"the instrument reported nothing"* from *"the instrument was never running"*. **It has no
equivalent for *"the instrument was never asked about"*, and that is the gap this discovery names.**

Twice now the widening has been productive rather than confirmatory: §4.15 found a surface on subject 2
that subject 1's name list would not have looked for, and TASK-0050 found two members on subject 1 that
subject 1's own earlier name list did not carry.

## Proposed remedy — for the Lead, not adopted here

**No change is made and none is proposed as READY.** For consideration when the next enumeration is
specified:

1. **One name list, applied to every subject.** Where a member is absent, record it as absent rather
   than omitting it — an absence that is written down can be compared; an omission cannot.
2. **Enumerate the whole surface first, classify second.** Both §4.15 and TASK-0050 listed every public
   member before filtering, which is why the filter's misses were visible at all.
3. **Where an enumeration is re-run to confirm an earlier one, state whether the name list was the same.**
   §4.14 finding 8 says the §4.12 enumeration was *"re-run in full"*; it was re-run in full against the
   **same** list, which confirms reproducibility and not coverage.

**Nothing is selected, adopted, cleared or generalized by this discovery, and it moves no verdict.**
