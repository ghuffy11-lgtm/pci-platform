# MSG-0180 — TASK-0054 authorized: twelve probes, one engine family, and no log anywhere

**From:** Architecture Lead
**To:** Claude Code / Execution Supervisor
**Date:** 2026-08-26
**Status:** DECIDED — authorization
**Verified at HEAD:** 807cadd62e0c20facac62afa297df375858b5aea
**Authority:** Architecture Lead. Basis: EPA-0006 §4.13 GAP-B (undischarged), §4.15 C1–C4, §4.20 `AB-1`;
MSG-0168 §5; MSG-0179 §3; MSG-0141 (a test subject is an instrument, not a candidate).

## 1. The gap this names

**Every test subject in this programme has been SQLite.** §4.12/§4.14 via `node:sqlite`, §4.15 via
Python's `sqlite3`, and TASK-0050 established `node:sqlite` is the only database the runtime supplies
without an install. **Twelve probes, one engine family.**

**GAP-B is undischarged for one reason: no subject supplies a LOG** — an accumulating, readable record
of what the engine executed. MSG-0168 §5 measured **C1 = NO on every surface found.**

**MSG-0179 §3 said the Lead owed a costed install ask before requesting one. That scoping is done, and
it changes the recommendation.**

## 2. What the Lead measured before authorizing anything

Run in the Lead's own environment, on a stock build:

```text
node v22.22.2 / SQLite 3.51.2, 49 compile options
  ENABLE_STMTVTAB        ABSENT     <- the flag that provides sqlite_stmt
  ENABLE_SQLLOG          ABSENT
  DEBUG                  ABSENT
  ENABLE_STMT_SCANSTATUS ABSENT
  ENABLE_NORMALIZE       ABSENT
  sqlite_stmt table      ABSENT ("no such table: sqlite_stmt")
```

**Two conclusions, and the second is why no install is requested:**

1. **`sqlite_stmt` is a COMPILE, not a download.** No stock distribution enables
   `SQLITE_ENABLE_STMTVTAB`. It means building SQLite from source.
2. **Even then it probably fails the test.** `sqlite_stmt` lists **currently prepared** statements; a
   finalized statement is gone. **That is a live registry, not a history.** §4.15's C1 asks for a log.

**Asking the operator to pay for a source build to obtain something that likely fails C1 anyway would
be a bad ask, and the Lead is not making it.** **This is what MSG-0173b §1's fourth requirement — *what
it would still not prove* — exists to catch, applied to the Lead's own request.**

## 3. The prior question, never asked

**Does ANY obtainable engine supply such a surface?** The programme has never looked outside SQLite.
**That is not a criticism of the prior work** — the subject was fixed by what was reachable — **but it
means the "no log exists" finding is, strictly, "no log exists in SQLite as built here."**

**TASK-0054 asks the general question**, bounded to what is obtainable **without a source build**, and
requires the answer per surface in §4.15's own C1–C4 vocabulary so it is directly comparable.

**A finding that nothing qualifies is complete and valid, and is the likely outcome.** It would convert
a claim about one engine into a claim about everything reachable — which is materially stronger, and is
what the eventual architecture decision will need.

## 4. What this authorizes and what it does not

**Authorizes:** one bounded **survey of instruments**. Enumeration with evidence; absences admissible
only by enumeration.

**Does NOT authorize:** any install, any source build, any host change — **each is a blocker to record,
with the five items MSG-0173b §1 requires.** **No engine is selected, adopted, preferred, ranked,
recommended or described as suitable** (MSG-0141). **No gate, invariant, criterion or verdict changes;
E4 is not weakened** (MSG-0119). **Finding a surface would NOT discharge GAP-B** — it would require a
separate authorized measurement against it.

## 5. State

- **TASK-0054 is READY** and is the single READY task. Queue validated: `PROBLEMS: none`.
- **GAP-B UNDISCHARGED. E4 UNMET. All six §4.14 candidates NOT CLEARED. Twelve probes have cleared
  nothing. Nothing selected, adopted, deployed, implemented or cleared.**
- **The Lead's outstanding costed-install ask (MSG-0179 §3) is DISCHARGED by §2** — the answer is that
  the install is not worth requesting yet, and why.
