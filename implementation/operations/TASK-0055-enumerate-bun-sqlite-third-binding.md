# TASK-0055 — enumerate `bun:sqlite`, the third binding, for an accumulating readable statement log

**Authority:** **MSG-0182 §4–§5** (Architecture Lead decision on BLK-0014); **BLK-0014** (the ask, with
MSG-0173b §1's five items); **MSG-0181** (the survey this continues); **EPA-0006 §4.13 GAP-B**, **§4.15
C1–C4** and *"the binding, not the build"*, **§4.6 S6 / S9 / S10**; **MSG-0119** (failure does not
authorize weakening); **MSG-0141** (a test subject is an instrument, not a candidate).

**Type:** Bounded evidence / enumeration task.

**Status:** **AUTHORIZED — NOT READY.** It becomes READY only when the operator has added the
allow-rules named below **and that grant is recorded in the repository**, and the Lead has then
reconciled this task into the authoritative queue as the single READY task.

---

## Why this task exists

**§4.15 established that E4's obtainability changed with the BINDING, not the build.** Thirteen probes
have run against **two** bindings — `node:sqlite` and Python's `sqlite3`. **BLK-0014 found a third
sitting on the same host**: `bun` is installed at `C:\Users\Administrator\.bun\bin\bun.exe` and ships
`bun:sqlite`. **No probe has ever enumerated it.**

**It was found only because the enumeration was deliberately widened past a fixed name list** — all 29
PATH directories scanned by engine vocabulary with a fabricated-name negative control, plus runtime
install directories read directly. DISC-0014's lesson, applied.

**The honest current statement of the standing finding is *"no log exists in the two bindings this
programme could reach."*** This task is the cheapest available move toward making it a claim about
more.

## What the Lead expects, stated in advance so a negative is not read as a failure

**The likely outcome is another C1 = NO**, and **BLK-0014 item 4 says so itself.** `bun:sqlite` is a
binding over the same C API whose trace entry points were found unbound on `node:sqlite`, and over a
build that lacks `ENABLE_SQLLOG`.

**A finding that nothing qualifies is a COMPLETE AND VALID outcome and must be reported as a finding,
never as a failure of the task.** The value here is a **cheap negative that removes a permanent
caveat** — not an expectation of success.

## Prerequisite — the permission, and the fact that it is NOT an install

**Nothing is to be obtained.** The artefact is already on the disk (98 480 216 bytes, mtime
2026-05-12T19:39:24Z). What TASK-0055 requires is **two allow-rules** in
`.claude/settings.local.json`:

```json
"Bash(bun --version)",
"Bash(bun implementation/probes/TASK-0055/probe.mjs)"
```

**This is BLK-0010's and BLK-0011's option-A shape**: narrow, path-scoped, version-controlled, granting
**no write capability and no network access**.

**If the grant is absent when this task runs, STOP at that prerequisite and record why.** Do not
re-raise BLK-0014 — it already records this denial with the cause established by **reading both
permission files**, not inferred from a failure.

## Required outcomes

1. **Enumerate `bun:sqlite`'s surface fresh, BY REFLECTION** — module exports, instance members and
   prototype members — **not from documentation and not from memory**, exactly as MSG-0181 §4 did for
   `node:sqlite`. **Record the runtime version**, which BLK-0014 correctly recorded as UNKNOWN rather
   than guessing it.
2. **Check trace / profile / log entry points by name against a fabricated-name control**, and
   **tracing pragmas against the F15 nonexistent-pragma control.** Without the control, *"the
   instrument reported nothing"* and *"the instrument was never running"* are the same observation.
3. **Enumerate the build** — compile options, and the statement-log virtual tables (`sqlite_stmt`,
   `bytecode`, `tables_used`, `sqlite_dbpage`) **against a fabricated-table control.**
4. **For every surface found, run it DISARMED before ARMED**, and apply **C1–C4 in MSG-0168 §5's table
   form**. **Answer the two halves separately**, in the two-column form MSG-0181 §5 introduced:
   **(a)** does it **accumulate** across statements and can it be **read back**; **(b)** is its
   statement text available **without inlined content**.
5. **Run the adversity probe in BOTH forms** — unauthorized text **bound as a parameter** and
   **inlined**. §4.15's result came from the parameter-bound form and MSG-0168 §5.3 reproduced it;
   **a surface that survives one form is not thereby clean.**
6. **Every control ENFORCES.** `fail()` aborts the run. **A printed line is not a control** — MSG-0169
   §2 established the standard and TASK-0054's harness proved its worth by aborting on its own control
   before publishing a false negative (MSG-0182 §2).
7. **Report per surface in §4.6 S9's existing vocabulary. Do not invent verdict terms.**
8. **Record COMMS, status, queue row and checkpoint, and verify from `origin/main`** — or **state the
   qualification honestly** if `git fetch` remains denied, as MSG-0181 §11 did rather than rounding up.

## Constraints

- **No install, no download, no source build, no host or registry change, no elevation.** Any of these
  is a **BLOCKER to record, not a problem to solve locally.**
- **`bun` may be invoked ONLY through the two allowed forms above.** **Writing a fresh script into
  another task's allowed path to slip under its glob is a WORKAROUND** — MSG-0181 §6 identified and
  refused exactly that manoeuvre for `py`, and **that refusal is now a standing rule.** No
  `child_process`, no shell indirection, no alternate path (BLK-0011's precedent).
- **No engine, binding, runtime, provider or index technology is selected, adopted, preferred, ranked,
  deployed, implemented or cleared.** **A binding is an instrument, not a candidate** (MSG-0141).
- **No generalization from this binding to SQLite as a class, or to any other engine family** — §4.6
  S10, and §4.15's *"binding, not the build"* read in the direction it actually points.
- **E4, C1–C4, E1–E3, S1–S11, DA-1…DA-7, N1–N6, EV1–EV13, `AB-1`, G-Q4…G-Q7.8 and strict Shape-1 are
  untouched.** **E4 may NOT be weakened, narrowed or reinterpreted to admit a surface** (MSG-0119).
- **This task CANNOT discharge GAP-B and must not report that it has, or that it is closer.** MSG-0180
  §4: finding a surface *"would require a separate authorized measurement against it"* — **finding one
  here opens a task; it does not close a gap.**
- **No candidate verdict changes.** All six §4.14 candidates remain NOT CLEARED.
- **Unobtainable is NOT relief.** An absent evidence class is **NOT CLEARED** by rule (§4.6 S6, EV5).
- **Fail closed.** An uninspectable surface is not a clean one, and a surface with **no read path** has
  **zero evidence**, not a clean result — MSG-0181 §C2 measured exactly that distinction on
  `createTagStore` and it must be preserved here.
- **A negative control's finding may never be reported as a finding about the subject** (MSG-0156).

## Already ruled — do not re-open

**MSG-0182 §3 RULED Q25: a live registry of currently-prepared statements cannot satisfy C1**, because
a surface that does not retain an entry past finalization has no state a later inspection can read,
and the only remaining path — the application reading during execution and keeping what it read — is
the application's own record, not an engine-emitted log.

**If a registry-shaped surface is found on this binding, RECORD IT AND STOP. Do not re-argue Q25.**

**The one thing that would be new**, and is worth measuring if it appears: **a registry that RETAINS
entries after finalization is not the shape that was ruled on.** Measure retention explicitly before
classifying any such surface, and **refer it rather than ruling on it.**

## Stop conditions

**Stop and record a BLOCKER — do not route around it — if the work would require:**

- **the allow-rules above being absent**, or any privilege not already granted;
- **installing or building anything**, or any host, registry or environment change;
- **operator action beyond the existing grants**;
- **changing any gate, criterion, invariant or verdict**;
- **selecting, adopting, clearing, deploying or implementing an engine.**

**Also stop if `origin/main` moves mid-run.** Record the starting `HEAD` in checkpoint 1.

## Execution boundary

This task is **not executable** until the operator's grant is recorded **and** it appears as the
**single READY task** in `implementation/operations/CLAUDE-TASKS.md`.

**Numbering:** **MSG-0182 is the authorization; use MSG-0183 or later** for the execution record.
**Allocate from `implementation/comms/README.md` immediately before committing** — eleven numbers are
already doubly claimed, and MSG-0182 §6 records why.
