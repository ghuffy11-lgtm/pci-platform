# MSG-0156 — Correction: a Negative-Control Result Was Recorded as a Subject Finding

**Status:** **OPEN** — correction record. **The DA-1 verdict does not change.**
**Raised:** 2026-08-25
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Correction / verification
**Related:** MSG-0155 §5 and §6, EPA-0006 §4.16 DA-5, §4.6 S8, TASK-0045 probe output

---

## 1. What was wrong

**MSG-0155's DA-1.1 verdict table gave the spill-file row as:**

> *"**5 228 784-byte** spill file, marker **10 000 times**, created **by** the request | **NOT CLEARED**
> (DA-5 row 1)"*

**That measurement is NC-1 — the negative control.** It is the post-filtered configuration that ranks
the whole shared projection and applies entitlement to the result: **20 000 rows returned where
entitlement was 10 000.** MSG-0155 §6 quotes it correctly **as the control**; §5's table presents the
same file as a finding about the subject.

**The conforming request's spill file carried `UNAUTH x0`.** From the probe's own output:

```text
E.  SPILL FILE (during) etilqs_cPRWdlgCPR5RLMc:  PRESENT, 2594395 bytes | UNAUTH x0  AUTH x10000
    rows the ENGINE returned: 10000    rows the request was entitled to: 10000
    "DA-1.1 is not engaged; DA-1.3 is."

G.  NC-1 (negative control) -- post-filtered retrieval
    SPILL FILE (during) etilqs_25FnmRrtGBej9Oc:  PRESENT, 5228784 bytes | UNAUTH x10000 AUTH x10000
    rows the ENGINE returned: 20000    rows the request was entitled to: 10000
```

**Two different files, two different configurations, and the table used the control's.**

## 2. Why it matters, stated precisely

**A negative control is designed to produce a finding.** That is exactly what makes it evidence **that
the instrument works** — §4.6 S8: *"a run whose negative control comes back clean has measured
nothing."*

**So a control's finding can never also be a finding about the subject.** Using it that way asserts
something the subject's own measurement contradicts in the same run, and it makes a **valid** probe
report a **stronger** result than it obtained.

> **This is a close cousin of the two apparatus defects MSG-0155 §7 already records against itself** —
> both were presence-versus-provenance confusions, *"committed by the probe written to test for it"*.
> **This one is control-versus-subject.** The pattern underneath is the same: **a number was carried
> into a cell without carrying the condition that produced it.**

## 3. What changes, and what does not

**Corrected** — in MSG-0155 §5, the status file (two places), and the queue board and ledger rows:

| | Before | After |
|---|---|---|
| **DA-1.1, spill files** | **NOT CLEARED** (DA-5 row 1), citing the 5 228 784-byte file | **not sufficient alone** (DA-5 row 3) — the conforming request wrote **`UNAUTH x0`** |

**Unchanged, and none of it ever rested on that cell:**

- **DA-1 remains NOT CLEARED for the subject measured**, on the **two independent routes MSG-0155 §1
  named**: the **rollback-journal DA-5 row 1 finding on a conforming request** — **236 occurrences**,
  the page-granularity result — and **DA-6 on the spill-file residue limb**.
- **DA-1.2 spill files: NOT CLEARED (DA-6)** — unaffected; that verdict is about **unobservable blocks
  after unlink**, not about markers.
- **DA-1.3 spill files: FINDING** — unaffected, and **independent of whose content is in the file**: the
  probe's own note says *"the difference from NC-1 is WHOSE content, not whether an artefact was
  written."* **A spill file leaves the store directory either way.**
- **The page-granularity result (§3 of MSG-0155) is untouched** and remains the sharpest finding: a
  request that examined nothing unauthorized still made unauthorized content durable, because **the
  engine journals whole pages**.
- **No candidate verdict moves. No gate changes. Eight probes have still cleared nothing.**

## 4. How it was found

**By reading the committed probe output back against the record**, the same step that caught the §4.15
insertion figure and the §4.16 one before it. **The table and the output are in the same commit and
disagree**; nothing external was needed.

**MSG-0155's original wording is retained** in the correction note in §5, not deleted — a corrected
record is worth more to a later reader than a tidy one.

## 5. State

- **No task is READY.** TASK-0045 is **COMPLETE**, and this correction does not reopen it.
- **DA-1: NOT CLEARED** for the one subject measured. **DA-1 clears nothing and fails nothing** — DA-5
  consequence 1, DA-7 row 5.
- **Q15 and Q16 remain referred and unanswered**; **Q14** and **MSG-0060** likewise.
- **No blocker open.** DISC-0011, DISC-0012 open; neither moves a verdict.
