# MSG-0097 — TASK-0031 execution record: ADR-0020 AMD-01 is APPLIED

**Status:** OPEN — record, plus **one item referred**, non-blocking
**Date:** 2026-08-23
**From:** Claude Code — supervisor-started session
**To:** Architecture Lead
**Authority:** MSG-0095 (ruling) · MSG-0096 (queue reconciliation) · `CLAUDE-TASKS.md` → TASK-0031
**Related:** ADR-0020, ADR-0020 AMD-01, MSG-0092, MSG-0094, EPA-0005, WP-0009

---

## 1. Result

**TASK-0031 is COMPLETE. All seven acceptance criteria are MET**, each mapped to evidence in §3.

**The amendment is applied.** `docs/decisions/ADR-0020-retrieval-projection-and-index-boundary.md`
now carries hunk 1 at the end of §4, hunk 2 as one Traceability row, and a one-line header note
naming AMD-01 and MSG-0095.

**Applying commit:** `a1be892178dea11d62dee6693c7c8d7d80798e43`
**Tree state after the run:** clean (§4).

**This is a documentary task. It produced no test count and claims none** — there is nothing here for
a test suite to execute, and reporting a count would be inventing one.

**This is the first time this repository has edited an accepted, promoted ADR.** Every prior task in
WP-0009 was forbidden to. MSG-0095 §3 authorizes "acceptance/application of AMD-01 only", so the
prohibition stands everywhere else, and §7 below states what precedent this does and does not set.

## 2. What changed — three edits, 15 insertions, 0 deletions

| # | Edit | Where |
|---|---|---|
| 1 | **Hunk 1** — the 148-word engine-selection and gate-evidence clause, verbatim from AMD-01 §4 | End of §4, immediately after *"An exclusion cannot fail open; a filter can."*, before the `### 5.` heading |
| 2 | **Hunk 2** — one Traceability row, verbatim from AMD-01 §5 | Appended to the Traceability table, after the `/data/docker` row |
| 3 | **Header note** — `**Amended:** 2026-08-23 — AMD-01 (MSG-0095), applied in place: §4 engine-selection criterion` | Header block, after `**Accepted by:** Architecture Lead — MSG-0071` |

**Zero deletions is stronger than criterion 4 required, and it was not luck.** The task's own
verification anticipated a modified header line — `git diff -- docs/decisions/ | grep '^-'` was to
show "no substantive deletions (**header line change aside**)". The note was instead added as a **new
line**, so no existing line was rewritten at all. `git diff --stat` reads **15 insertions(+), 0
deletions**, and the `^-` grep returns only the diff's own `--- a/` file header.

**The practical consequence:** every accepted semantic in ADR-0020 is **byte-identical** to the
promoted copy — the four enforcement points, §3's closing line, §4's existing text including the
MSG-0062 §7.6 block quote, §5's fail-closed rule and three named side channels, §6's Restricted
carve-out and its three obligations, §7's *"No index technology, embedding model, vector store, or
search engine is selected here"*, §8, Consequences, *Deliberately not decided here*, Context,
Rationale, and the reuse-before-create test. Not "checked and found equivalent" — **unmodified**.

## 3. Acceptance criteria — each with its evidence

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| 1 | Hunk 1 at the end of §4, verbatim from AMD-01 §4, preceding text unchanged | **MET** | Diff hunk `@@ -65,6 +66,19 @@` shows 13 added lines and no removed line; the preceding `An exclusion cannot fail open; a filter can.` appears as context, not as a change |
| 2 | Hunk 2 as one new Traceability row, verbatim from AMD-01 §5 | **MET** | Diff hunk `@@ -204,6 +218,7 @@` — one added row, no removed row |
| 3 | Concise header note identifying AMD-01 and MSG-0095 | **MET** | Diff hunk `@@ -5,6 +5,7 @@` — one added line naming both |
| 4 | No other change to `docs/decisions/` | **MET** | `git diff --name-only docs/decisions/` → **`ADR-0020-retrieval-projection-and-index-boundary.md` and nothing else** |
| 5 | No technology or engine name in the applied text | **MET** | A case-insensitive search of the **whole file** for twenty product names (search engines, vector stores, model runtimes, frameworks, datastores) returns **no matches** — a stronger check than the applied text alone |
| 6 | AMD-01's record updated to APPLIED, citing MSG-0095 and the applying commit | **MET** | AMD-01 header now reads **ACCEPTED (MSG-0095) and APPLIED IN PLACE**, with commit `a1be892…`; §8 marked ANSWERED; §9's now-false bullet struck through rather than deleted |
| 7 | COMMS, queue and status reconciled; commit hash and clean tree reported | **MET** | This message, `CLAUDE-TASKS.md`, `current.md`, WP-0009, the comms register; §1 and §4 report the hash and tree |

## 4. Verification — run in this session, quoted

Before applying, to establish the pre-state (recovery rule (f)):

```text
$ git rev-parse HEAD origin/main
dfb719df130f6118b525c4ee6e0f4cba666315a4
dfb719df130f6118b525c4ee6e0f4cba666315a4
$ git status --short
(no output)
```

After applying, before committing:

```text
$ git diff --name-only docs/decisions/
docs/decisions/ADR-0020-retrieval-projection-and-index-boundary.md

$ git diff -- docs/decisions/ | grep '^-'
--- a/docs/decisions/ADR-0020-retrieval-projection-and-index-boundary.md

$ git diff --stat -- docs/decisions/
 .../ADR-0020-retrieval-projection-and-index-boundary.md | 15 +++++++++++++++
 1 file changed, 15 insertions(+)
```

Marker counts in the amended file — the double-insertion guard:

```text
4 occurrences across 1 file, for the four patterns:
  "Consequence for engine selection"    (hunk 1, first line)
  "This criterion selects no engine"    (hunk 1, disclaiming sentence)
  "Pre-constrained retrieval as an"     (hunk 2, traceability row)
  "^\*\*Amended:\*\*"                   (header note)
-> exactly one each. Hunk 1 is present once, not twice.
```

**Fidelity of the applied wording.** AMD-01 presents both hunks as Markdown block quotes — the `> `
prefixes are the draft's quoting device, exactly as they are where AMD-01 §2 quotes ADR-0020's own
§§3–4 back. The prefixes were therefore stripped and the content applied as ordinary ADR prose. Every
applied line was compared against its AMD-01 source line and they match character for character; the
full diff in the applying commit is the evidence, and it can be re-read against AMD-01 §§4–5 at any
time.

## 5. The stop conditions were tested, not assumed

| Stop condition | Tested by | Outcome |
|---|---|---|
| Insertion point cannot be located exactly, or §4's closing sentence differs from AMD-01's quote | Reading the accepted ADR in full and comparing §4 against AMD-01 §2's quotation of it | **Cleared.** §4 matches the quoted text, including the block quote preceding the closing sentence |
| Applying either hunk would require altering existing wording | The applied diff | **Cleared.** 0 deletions |
| The edit would touch a second ADR | `git diff --name-only docs/decisions/` | **Cleared.** One file |
| `origin/main` moving mid-run | Starting HEAD recorded in checkpoint 1; re-checked before the push | **Cleared.** HEAD unmoved at commit time, and **the push was accepted** — a mid-run move would have made it a rejected non-fast-forward, which is the only detection this runner has |

**The double-application hazard was the real risk and it was checked first.** Re-running this task
against an already-amended ADR would insert hunk 1 twice, and a duplicated clause in an ADR that
exists to remove ambiguity is worse than a missing one. Verified absent three ways **before** editing:
§4 ended at the quoted sentence with nothing between it and `### 5.`; the Traceability table had
**11** rows and none about engine selection; the header had no `Amended:` line. A fourth signal
agreed — **no `TASK-0031.md` checkpoint existed**, so this was the first execution.

## 6. Two runner limits, recorded rather than routed around

**`git fetch` is off the Bash allowlist** and was refused in this session — exactly as the queue
section's *Known runner limit* note predicts. So the `origin/main` value quoted in §4 is the **local
remote-tracking ref**, not a freshly fetched one. It is reported as such rather than as a live
comparison. The push being accepted is the stronger evidence, and it arrived after the fact.

**`python` is also off the allowlist**, and so are compound shell forms using redirection or process
substitution. The intended character-level comparison — extracting both hunks to temporary files and
`diff`-ing them — could not run. **No substitute path was used.** The comparison was done instead with
the permitted file-reading and search tools, and the applying commit's diff is left as re-readable
evidence so the check does not have to be taken on trust. Both refusals are noted here because a
future session will hit them too.

## 7. What this does and does not settle

**Settled: how an accepted ADR is amended.** AMD-01 §8 raised it as an open convention with no
precedent — ADR-0015 and ADR-0016 carry `Supersedes:` lines, but those record promotion of a *draft*,
not amendment of an *accepted record*. MSG-0095 chose **option (a), in place**, and explicitly
declined (b): *"Do not create a superseding ADR."* **That is now the repository's precedent for an
additive clarification that changes no substantive policy** — and it is nothing broader. It confers no
authority to edit a promoted ADR in any other circumstance.

**Not settled — and unchanged by this task:**

- **No retrieval engine, index technology, embedding model, framework, runtime, or provider is
  selected.** MSG-0095 §3 says so in terms, and hunk 1 says so in its own second paragraph: *"This
  criterion selects no engine and rules none in."* **A criterion is not a selection.** All nine
  MSG-0092 §4 categories remain open.
- **ADR-0019 and its Arabic production-evidence gate are untouched.** §6's normalization deferral
  stands, no normalization rule was written or inferred, and the n=1 Arabic evidence did not become
  production corpus evidence.
- **The three settled MSG-0092 §9.1 constraints are unchanged** — this amendment makes the first of
  them testable; it does not restate, widen, or narrow any of them.
- **No generic stack ADR was created.**
- **ADR-0017, ADR-0018, ADR-0019, ADR-0021 and ADR-0022 were not touched at all.**
- **No implementation task is READY**, and none of T-A, T-B, T-D, T-E or T-0 was started.

## 8. One item referred — non-blocking

**The queue is now empty and no task is READY.** TASK-0031's own section names its next eligible task
as *"none — no implementation is authorized by MSG-0095"*, so this is the expected terminal state, not
a gap. **The supervisor will idle reporting `no READY task` until the Architecture Lead authorizes
the next one**, which is correct behaviour and should not be mistaken for a stall.

**What the Lead may want to consider next**, offered as observation and **not self-authorized**: with
AMD-01 applied, the ADR set for WP-0009 is complete and stable, and WP-0009 still reads `DEFINED — NOT
AUTHORIZED FOR IMPLEMENTATION` with three open items in its §8 (the T-D/T-E interim mitigation, PR3's
owner and date, and the planning relationship). Those are unchanged by this task.

## 9. Records updated

| Record | Change |
|---|---|
| `docs/decisions/ADR-0020-*.md` | **The amendment applied** — three edits, 15 insertions, 0 deletions |
| `implementation/decisions/ADR-0020-AMD-01-*.md` | Status → **ACCEPTED (MSG-0095) and APPLIED IN PLACE**, citing commit `a1be892…`; §8 ANSWERED; §9's now-false "modifies no file under `docs/`" bullet struck through and corrected rather than deleted; the superseded draft notice retained inside its replacement |
| `implementation/operations/CLAUDE-TASKS.md` | TASK-0031 → **COMPLETE**; status board row updated; no task READY |
| `implementation/status/current.md` | Header line and current position updated; the line replaced is retained |
| `implementation/comms/README.md` | MSG-0097 registered; MSG-0095 and MSG-0096 reconciled |
| `docs/program/work-packages/WP-0009-*.md` | The AMD-01 tracking row updated from **proposed and not applied** to **applied**; one row changed, nothing else |
| `implementation/operations/checkpoints/TASK-0031.md` | Checkpoints 1 and 2 |
