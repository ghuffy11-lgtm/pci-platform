# DISC-0012 — the G-Q4.2 differential in TASK-0038 and TASK-0039 ran against a catalogue containing no foreign structures

**Status:** **RECORDED — no verdict moves, and no prior section is corrected.** Surfaced 2026-08-24 by
TASK-0042 while building the routing measurement MSG-0137 item 1 requires. **No line of §4.11 or
§4.12 was changed**, because correcting a prior section is outside this task's authorization.
**Raised:** 2026-08-24, TASK-0042
**Severity:** **Medium — it bounds a recorded MET result rather than overturning it.** The prior
measurements are correct as taken. What they could establish is narrower than the wording suggests.
**Related:** EPA-0006 §4.9 G-Q4.2, §4.11 (TASK-0038), §4.12 (TASK-0039), §4.14 (TASK-0042), MSG-0140

## What was found

**§4.9 G-Q4.2 requires a differential test:**

> *"Run the same subject and query against collections that differ **only** in other subjects'
> partitions. Identical routed set, identical routing-phase read count."*

**TASK-0038 and TASK-0039 both ran that differential with an `otherSubjects` parameter**, and TASK-0039
recorded **G-Q4 MET in all 12 configurations**.

**But the parameter added other subjects' versions to the KERNEL only.** Both probes' store builder
skips any partition key that is not the requesting subject's, and says so in its own comment:

```js
const key = `${v.scope}|${v.cls}|${v.state}|${tok}`;
if (!mine.has(key)) continue;   // other subjects' partitions are not materialised here
```

**So the structure catalogue those runs routed against contained no other subject's structure at all.**
The differential varied rows in `k_version` and `k_chunk` — tables the routing phase never opens.

**A differential that varies rows in a table nobody routes over does not test G-Q4.2.**

## What TASK-0042 measured, which is how this was found

Materialising other subjects' partitions **physically** and counting the catalogue:

| other subjects | catalogue objects | subject's own | **another subject's** | kernel/other |
|---|---|---|---|---|
| 0 | 32 | 20 | **0** | 12 |
| 16 | 128 | 20 | **80** | 28 |
| 64 | 416 | 20 | **320** | 76 |

**With a catalogue that can fail the gate, the differential discriminates:** the computed-routing
mechanism reads **4 vs 4** and is **MET**; a catalogue-scanning mechanism selecting **the same four
structures** reads **32 vs 416** and **FAILS**.

Evidence: `implementation/probes/TASK-0042/probe-output.txt` sections 3.1–3.3; EPA-0006 §4.14
findings 1 and 2; MSG-0140 §2.

## What this does and does not mean

**It does NOT overturn anything.**

- **TASK-0039's G-Q4 result was correctly measured** and is **not withdrawn**. Its routing
  implementation computes structure names from the subject's entitlements and resolves them by exact
  key; that implementation would pass the stronger differential too, and in TASK-0042 the equivalent
  mechanism does pass it.
- **No candidate verdict changes.** K7 and K8 were NOT CLEARED on E2 and E4, not on G-Q4.

**What it DOES mean is that a MET result was recorded from a test that could not have returned
anything else.** The gate has two limbs — routed set **and** routing-phase read count — and the prior
fixture could not vary either one. **A gate that cannot fail has not been passed; it has not been
run.** That is the same reasoning §4.6 S8 applies to a negative control, applied to a differential.

**The general lesson, stated because it is reusable:** a differential is only as strong as the
variable it varies. **Before recording a differential as MET, check that the quantity being varied is
one the mechanism under test actually reads.**

## What is NOT proposed here

- **No correction to §4.11 or §4.12.** Their text stands; TASK-0042 is additive-only, and rewording a
  prior section needs its own authorization.
- **No re-run of TASK-0038 or TASK-0039.** MSG-0137 item 3 forbids re-running prior cases, and this
  discovery does not require it: **TASK-0042 already ran the stronger differential**, so the evidence
  the prior fixture could not supply now exists in §4.14.
- **No change to G-Q4.** The gate was correct as written; the fixture was weaker than the gate.

**Whether §4.9, §4.11 or §4.12 should carry a note recording this bound is the Architecture Lead's
call.** It blocks nothing: the stronger measurement exists, and every verdict is unchanged.
