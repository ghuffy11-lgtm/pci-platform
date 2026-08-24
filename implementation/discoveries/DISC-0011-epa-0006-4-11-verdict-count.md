# DISC-0011 — EPA-0006 §4.11's summary count disagrees with its own verdict table

**Status:** **RECORDED — not corrected.** Surfaced 2026-08-24 by TASK-0041 while reproducing prior
verdicts under MSG-0130 acceptance criterion 5. **No line of §4.11 was changed**, because TASK-0041 is
additive-only and correcting a prior section is outside its authorization.
**Raised:** 2026-08-24, TASK-0041
**Severity:** **Low, and it is a summary line, not a verdict.** Every individual verdict is correct
and unambiguous; only the tally over them is wrong. **Nothing downstream depends on the tally.**
**Related:** EPA-0006 §4.11 (TASK-0038, MSG-0116a+b), MSG-0118, MSG-0132

## What was found

**EPA-0006 §4.11's closing summary says:**

> *"**Nothing is CLEARED.** Six designs **NOT CLEARED**, three **DISQUALIFIED**."*

**Its own verdict table, in the same section, lists ten rows:**

| Row | Verdict |
|---|---|
| K0 | NOT CLEARED |
| K1 | NOT CLEARED |
| K2 | NOT CLEARED |
| K3 | NOT CLEARED |
| K4 | NOT CLEARED |
| K5 | **DISQUALIFIED** |
| K6 | **DISQUALIFIED** |
| K7 | NOT CLEARED |
| K8 | NOT CLEARED |
| NC | **DISQUALIFIED** |

**That is SEVEN NOT CLEARED and three DISQUALIFIED**, not six and three. Counting the negative control
out — which the same section's *"9 designs × 7 scenarios × 3 collection sizes"* line implies, since
`K0…K8` is nine — gives **seven NOT CLEARED and two DISQUALIFIED**. **Neither reading produces
"six".**

## What is NOT wrong

**No verdict is wrong, and none is ambiguous.** Each of the ten rows carries its own explicit verdict,
and every one of them is reproduced unchanged in MSG-0112 §6 (for the earlier probes), in MSG-0118,
and in MSG-0132 §6. **K7 and K8 remain NOT CLEARED; K5, K6 and NC remain DISQUALIFIED.** The defect is
confined to one arithmetic summary of a table that is itself correct.

**No downstream record depends on the tally.** MSG-0123, MSG-0124, MSG-0127, MSG-0129 and MSG-0130 all
reference the *verdicts*, never the count.

## Why it was not fixed here

TASK-0041's own section states the constraint: **additive and declared — nothing in §4.1–§4.12 is
deleted or reworded.** Editing a prior section's sentence is a reword, and MSG-0130 authorizes the Q3
architecture response and nothing else. **CLAUDE.md's discovery rule is the applicable one:** *"If
work can safely continue without changing architecture, continue and record the discovery."* Work
continued; this is the record.

## What would close it

**One sentence in EPA-0006 §4.11, and it needs an authorization to change a prior section** — the same
shape of authorization TASK-0031, TASK-0034, TASK-0036 and TASK-0040 each received for their own
edits. **The cheapest correct form is additive rather than a reword**, following the §4.12 Q12 and
§4.7 Q3 precedent: a dated, declared note recording that the tally reads six where the table shows
seven, leaving the original sentence intact. **That is a suggestion, not a decision, and it is the
Architecture Lead's.**

## The pattern worth noting, because it is the fourth of its kind

The blocker index drifted from its records twice (BLK-0001/BLK-0004, then BLK-0005), the discovery
index drifted from its records once (six missing rows, TASK-0015), and this is a **summary drifting
from the table directly above it in the same file.** **Same failure mode, shorter distance:** a
derived figure written alongside the data it derives from, and not re-derived when the data settled.
