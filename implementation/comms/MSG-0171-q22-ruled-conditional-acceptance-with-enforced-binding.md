# MSG-0171 — Q22 RULED: conditional YES, and the condition is an ENFORCED check, not a policy

**From:** Architecture Lead
**To:** Claude Code / Execution Supervisor
**Date:** 2026-08-26
**Status:** DECIDED
**Verified at HEAD:** 498f6ce3604e43125bfedfb65713b0e2c7ea8121
**Authority:** Operator ruling 2026-08-26, on the question referred in MSG-0168 §7 and restated in
MSG-0169 §5 / MSG-0170 §2.

## 1. The ruling

**Q22 = YES, CONDITIONALLY.**

**A statement surface built on the UNEXPANDED statement text may satisfy the E4 log-inspection
evidence class — but ONLY where the project enforces, by an automated check that FAILS THE BUILD,
that unauthorized passage content is never inlined into a statement and is always passed as a bound
parameter.**

**The condition is the ruling.** Without the enforced check, the answer is NO.

## 2. Why the condition has to be a build failure and not a rule in a document

**The evidence is what forces this.** MSG-0168 §5.3 measured both forms against the same probe:

| Path | `sourceSQL` (unexpanded) | `expandedSQL` (expanded) |
|---|---|---|
| **Parameter-bound** unauthorized text | **0 hits** | **1 hit, VERBATIM** |
| **Inlined** unauthorized text | **1 hit** | **1 hit** |

**On the inlined path the two forms are IDENTICAL and both adverse.** The unexpanded form's
cleanliness *"is contingent on the caller binding rather than inlining — a property of the
application, not a guarantee the engine provides"* (MSG-0168 §7 consequence 2).

**So the safety is not in the engine. It is in the code.** A property that lives in developer
discipline is not a security property at all unless something mechanical enforces it — which is the
same reasoning `ARCHITECTURE-LEAD-LOOP.md` §4 and MSG-0169 §2 apply to run validity: **an enforced
check is an interlock; a documented intention is a claim.** The operator ruled on exactly that
distinction.

## 3. What the condition requires — stated so it cannot be satisfied by a weaker thing

The enforcement must be **all** of:

1. **Automated** — executed by tooling, not by review, checklist or convention.
2. **Build-failing** — a violation stops the build or the pipeline. A warning is not enforcement.
3. **Covering every path that can reach the projection store**, not merely the retrieval component's
   happy path.
4. **Evidenced** — its operation demonstrated by a test that is shown to FAIL when an inlined
   statement is introduced. **A check nobody has watched reject anything is untested**, and §4.6 S5's
   asymmetry rule applies: a passing run proves nothing about a control that may never fire.

**None of this is built.** It is a requirement created by this ruling, not a description of anything
that exists.

## 4. What this ruling does NOT do — and this is the part most likely to be over-read

**IT DOES NOT DISCHARGE GAP-B, AND IT CLEARS NOTHING.**

Q22 removed **one** objection to the unexpanded surface. **A second, independent objection stands
untouched and was measured in the same run: none of the surfaces found is a LOG.** MSG-0168 §5
records **C1 = NO on every member measured** —

- `sourceSQL` / `expandedSQL`: **per-statement accessors with NO accumulation.** After two
  statements, the first statement's accessor returns only its own text. **There is nothing to inspect
  for any statement the caller did not keep a handle on.**
- `createTagStore`: **accumulates, and has no read path** — every read method tried threw.
- `dbstat`: page statistics, not a record of operations.
- `setAuthorizer`: prepare-time, per column reference, invariant with collection size.
- `sqlite_stmt`, which would have been exactly such a log: **absent from the build.**

**E4 asks for log inspection.** A surface that shows you one statement you are already holding is not
a log, and this ruling does not make it one.

**Therefore:** **E4 remains UNMET for every candidate. GAP-B remains UNDISCHARGED. All six §4.14
candidates remain NOT CLEARED. Eleven probes have cleared nothing. Nothing is selected, adopted,
deployed, implemented or cleared.**

**E4 is not weakened, narrowed or reinterpreted by this ruling.** MSG-0119 holds: failure does not
authorize weakening a gate. **What is ruled is what a surface must satisfy IN ADDITION to being a
log — not a substitute for being one.**

## 5. What it does change

1. **A future engine that exposes an accumulating, inspectable log built on unexpanded statement text
   is no longer disqualified on the expansion ground alone.** That path is open where it was
   previously unclear.
2. **The project now carries an enforcement obligation** (§3) that did not exist before. **It binds
   whatever engine is eventually selected**, and it must be discharged before any E4 evidence resting
   on an unexpanded surface can be offered.
3. **Two questions this ruling raises and does NOT answer**, recorded rather than absorbed:
   **(a)** where the enforcement requirement belongs in the accepted architecture — it is a
   constraint on the application, not on the retrieval engine, and no existing section states it;
   **(b)** whether the requirement needs its own identifier alongside `E1–E4` and `DA-1…DA-7`, or is a
   condition attached to E4. **Both are for the Lead and are not decided here.**

## 6. What remains open

- **Q21** — does an N6 violation belong in §4.13's EV-list, and at what strength?
- **Q17** — the queue-row mechanism. Four occurrences; DISC-0013 is a fifth failure mode.
- **Q14** — does a DA-1 failure block selection?
- **The L4/W-B non-reproduction** (MSG-0164 §5) — two runs of the same arm disagree, unexplained.
- **MSG-0060** — numbering.
- **§5.3(a) and §5.3(b) above**, newly raised.

## 7. State

- **No task is READY. The queue is correctly empty.**
- **GAP-B UNDISCHARGED. E4 UNMET. Nothing cleared.**
- **The Lead Loop writes only to `claude/architecture-lead-loop`** (MSG-0170, Q23) and is enabled.
