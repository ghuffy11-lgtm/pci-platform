# MSG-0149 — TASK-0044 Reconciled: Criterion First, and the Eighth Number Collision

**Status:** **OPEN** — informational; no decision blocks TASK-0044
**Raised:** 2026-08-25
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0148b, with MSG-0147 binding | **Related:** MSG-0148a, MSG-0146 §5/§8, MSG-0060

---

## 1. What was reconciled

**TASK-0044 is the single READY task**: define the **durability-artefact security criterion**, with its
scope, exclusions, evidence semantics and fail-closed interpretation — **and measure nothing.**

## 2. The Lead took option (a), and made it stronger than the recommendation

**MSG-0148a offered two shapes and advised against combining them. MSG-0148b turns that advice into a
prohibition** — *"combine criterion creation and measurement in the same task"* appears in the **may
not** list, alongside engine selection and gate changes.

> **"The criterion must establish the security bar independently of the measurement. The later evidence
> task must measure against the already-authoritative criterion."**

**That is a stronger position than the one it answers, and the strengthening is the point.** A bar
written by the session that also takes the measurement is **a bar shaped by what that measurement could
reach** — and afterwards the shaping is invisible, because the record shows only a criterion and a
result that agree.

## 3. The trap the criterion has to avoid

**Becoming E4 by another name.** MSG-0147 states that the WAL finding **is not reclassified as E4** and
that **E4 remains limited to the established execution-observability criterion**.

| | **E4** | **This criterion** |
|---|---|---|
| Concerns | what the engine's **execution surface emits** | **content at rest** in engine-managed files |
| Asked of | traces, profiles, logs | WAL, journals, shared-memory and spill files |
| Status | **OBTAINABLE** on subject 2, **NOT OBTAINABLE** on subject 1 | **does not exist yet** |

**MSG-0146 paid to keep these apart.** It had a striking result — unauthorized text sitting 135 times in
a file on disk — and **declined to offer it as E4**, which would have looked like a stronger finding.
**The ruling preserved that separation; the criterion must preserve it too, in its own text.**

## 4. What TASK-0043's numbers are, and are not, in this task

**They are a SHAPE, not evidence.** `-wal` **28872 bytes, marker 135 times**; main database **4096
bytes, marker absent**; `-shm` **32768 bytes, marker absent**; `-journal` **absent**.

**A criterion that cannot say plainly whether that pattern is a violation is not yet usable** — which is
the only reason the figures belong anywhere near this task. **MSG-0148b forbids measurement**, so they
may appear **as an illustration, labelled as such**, and **nothing may be re-run, extended or treated as
a result.**

## 5. Two structural choices the task must declare rather than assume

**Its label.** **E1–E4 may not be changed or extended**, so the criterion needs an identifier that
cannot be mistaken for a Shape-1 gate. **Which one, and why, is the task's to state.**

**Its section.** Beside the other criteria in **§4.6**, or in a section of its own. **Either is
defensible. Choosing silently is not** — §4.12's Q12 note is the pattern: **point rather than restate**,
and say where the rule lives.

## 6. The eighth number collision, and a five-week-old question still unanswered

**MSG-0148 was claimed twice within minutes** — by this session's R2 reconciliation and by the Lead's
authorization. **Indexed as `MSG-0148a` and `MSG-0148b`; no file was renamed** (MSG-0058 F4), and the
register's header note is updated from six shared numbers to **eight**.

**The two do not conflict** — 0148a offered the choice, 0148b takes it — but **the cause is structural
and unchanged: two authors allocating from one sequence without a lock.** **MSG-0060 raised this and has
never been answered.** It is not blocking, and it has now produced eight collisions.

## 7. Boundaries

**No measurement of any kind. No engine selected, compared, adopted, deployed or implemented. No change
to E1–E4 or any existing gate. No weakening of strict Shape-1. No accepted ADR modified. No numeric
threshold.** **The exposure evidence task is separate and must be separately authorized.**

## 8. State

- **TASK-0044 is READY and is the single READY task.** Not started at the time of writing.
- **TASK-0043 is COMPLETE**; **BLK-0011 RESOLVED**, its unattended condition still standing.
- **R2 is ruled; R1 is open** — whether TASK-0043's result becomes **EPA-0006 §4.15**.
- **Nothing CLEARED — seven probes.** **All six TASK-0042 candidates remain NOT CLEARED. GAP-B stands.**
- **No blocker open. Two discoveries open** — DISC-0011, DISC-0012 — **neither moves a verdict.**
- **No implementation task authorized or READY. Nothing selected.**
