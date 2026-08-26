# TASK-0051 — define `AB-1`, the application-binding requirement, before anything is built against it

**Authority:** **MSG-0171** (Q22 = conditional YES — the condition is an enforced check);
**MSG-0172 §5** (the label `AB`, its own section, and this task).
**Type:** Architecture documentation. **Not a measurement task and not an implementation task.**
**Status:** READY — reconciled as the single READY task, 2026-08-26 (MSG-0172).

## Why this task exists, and why definition comes first

**MSG-0171 ruled that an unexpanded statement surface may satisfy E4 *only* where an automated,
build-failing check prevents unauthorized passage content from ever being inlined.** That obligation
now exists and **has no definition anywhere in the architecture.**

**TASK-0044 set the precedent and the reason: define the criterion before measuring against it.** A bar
written by whoever also builds the check is a bar shaped by what that check turned out to catch, and
afterwards the shaping is invisible.

## Objective

Add a new EPA-0006 section defining **`AB-1`** — the application-binding requirement — additively, at
the evidentiary standard §4.16 set for `DA-1`.

## Required outcomes

1. **`AB-1` is stated as a prohibition**, in the form §4.16 uses: what the application must never do,
   not what it should try to do.
2. **The four properties MSG-0171 §3 fixes are carried in terms**, each as its own limb so a
   deployment can fail one alone: **automated** (tooling, not review); **build-failing** (a warning is
   not enforcement); **covering every path that can reach the projection store**; and **evidenced by a
   test demonstrated to FAIL when an inlined statement is introduced.**
3. **The section states what `AB-1` does NOT do**, explicitly: it **does not discharge GAP-B**, **does
   not satisfy E4**, **does not make a non-log surface into a log**, and **clears nothing**. MSG-0171
   §4 is the source and its reasoning is reproduced, not paraphrased away.
4. **The relationship to E4 is stated exactly**: `AB-1` is a condition a surface must satisfy **in
   addition to being a log**, never a substitute for being one.
5. **`AB` is declared as a new namespace**, with the check that it collides with none of `E1–E4`,
   `S1–S11`, `U1–U5`, `G-Q4…G-Q7.8`, `I1–I8`, `N1–N6`, `W1–W4`, `EV1–EV13`, `F1–F16`, `DA-1…DA-7`,
   `GAP-A…GAP-E` **performed and recorded**, not asserted.
6. **Additive.** `git diff --numstat` shows **zero deletions**; no existing section is reworded. Where
   an existing section must point at the new one, use a **declared pointer note** (§4.12 Q12 precedent).
7. **`git diff --name-only docs/` is empty**, and the change is verified from `origin/main` after
   pushing.
8. **COMMS, status, queue row and checkpoint recorded.**

## Constraints

- **Documentary only. Build nothing.** No linter, no rule, no CI configuration, no test. **Writing the
  check is a separate authorization that does not exist yet.**
- **Measure nothing.** No probe, no fixture, no harness, no test count claimed.
- **No change to E1–E4, S1–S11, DA-1…DA-7, N1–N6, EV1–EV13, G-Q4…G-Q7.8, strict Shape-1, or any
  clearance gate.** **E4 is not weakened, narrowed or reinterpreted** (MSG-0119).
- **No candidate verdict changes.** All six §4.14 candidates remain NOT CLEARED; **eleven probes have
  cleared nothing.**
- **No engine, runtime, binding or index technology selected, adopted, preferred, ranked, deployed,
  implemented or cleared.**
- **Do not state or imply that GAP-B is closer to discharge.** It is not. **The second objection —
  that none of the measured surfaces is a log — is untouched.**
- Stop at any environment or operator boundary rather than routing around it.
- Stop if `origin/main` moves mid-run.

## Two obligations this task does NOT perform

Recorded so they are not silently absorbed, the mistake MSG-0157 and MSG-0159 made:

1. **EV13 and the Q14 ruling (MSG-0172 §1–§2) require their own EPA-0006 update.** Not this task.
2. **The L4/W-B re-measurement is authorized and NOT READY** (MSG-0172 §4). Not this task.

## Numbering

**MSG-0172 is this task's authority.** Use **MSG-0173 or later** for the execution record, and check
`implementation/comms/README.md` first — **ten numbers are already doubly claimed.**

## Execution boundary

This task is executable **because its queue row exists** (MSG-0172 §3 ruling 1: an authorization is
incomplete until the row does). **Where this file and the queue row differ, THIS FILE WINS and the
difference is reported.**
