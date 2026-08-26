# DISC-0015 — "AUTHORIZED — NOT READY" parses as READY, and the standing pre-push check is not a faithful replica of the Supervisor

**Raised:** 2026-08-26 by the Architecture Lead, while queueing TASK-0055.
**Status:** OPEN — recorded; the immediate instance is fixed; **the fidelity gaps are NOT fixed.**
**Severity:** **Silent start** — the mirror image of DISC-0013's silent stall, and the more dangerous
of the two. DISC-0013 caused the Supervisor to do nothing when it should have acted. This one would
have caused it to **start a runner against a task whose prerequisite is known to be unmet.**
**Bears on:** **Q17** (the queue-row mechanism), and on **MSG-0172 §3**, which promoted the replicator
to a standing pre-push check.
**Found by:** the standing pre-push check itself, exactly as MSG-0172 §3 intended.

---

## 1. What happened

TASK-0055 was written to the board with the status cell **`**AUTHORIZED — NOT READY**`** — the same
phrase the Lead has used in task *files* since TASK-0052, and a phrase **any human reads as "not
ready"**.

The standing pre-push check was run before committing, and reported:

```text
READY tasks          : TASK-0055
```

**A human-legible "NOT READY" had parsed as READY.** Had it been pushed, the next Supervisor cycle
would have started a runner on a task whose prerequisite — an operator permission line that BLK-0014
records as absent — **cannot be satisfied by the runner.**

## 2. Cause — established from both sources, not inferred from the symptom

**`supervisor.ps1` matches the status cell WORD BY WORD against a fixed list**, taking the longest
match:

```powershell
$statusCell = $cells[2]
foreach ($candidate in $script:VALID_STATUSES) {
    if ($statusCell -match ('\b' + [regex]::Escape($candidate) + '\b')) {
        # Longest match wins so READY does not shadow WAITING_FOR_...
        if ($null -eq $status -or $candidate.Length -gt $status.Length) { $status = $candidate }
    }
}
```

**`\bREADY\b` matches inside "NOT READY".** The word-boundary match sees a word, not a phrase, and
**there is no negation handling of any kind.** No status word in `VALID_STATUSES` is longer and also
present, so `READY` wins outright.

**The comment on the longest-match rule is correct about what it was written for** — it stops `READY`
shadowing `WAITING_FOR_ARCHITECTURE_LEAD` — **and that same rule is what makes the fix below work.**
The defect is not in longest-match; it is that **a negated status word is still a status word.**

## 3. The fix applied to TASK-0055

The status cell now reads **`WAITING_FOR_OPERATOR`** — a status word **both** parsers already know,
**20 characters long**, so longest-match protects it even if another status word appears in the same
cell.

Re-run of the standing check after the fix:

```text
rows parsed          : 53
PROBLEMS             : none
READY tasks          : (none) -> the Supervisor will NOOP, which is correct
```

**The explanatory note was moved OUT of the status cell and into the notes cell**, because prose in a
status cell is exactly what caused this.

## 4. Rule, for every future queue reconciliation

**The status cell carries ONE status word and nothing that could be read as another.**

- **Never negate a status word in the status cell.** *"NOT READY"*, *"no longer BLOCKED"*, *"was
  COMPLETE"* all parse as the word they negate. **There is no negation handling.**
- **Never put explanatory prose in the status cell.** It belongs in the notes cell, which nothing
  parses.
- **Use `WAITING_FOR_OPERATOR` or `WAITING_FOR_ARCHITECTURE_LEAD` for an authorized task whose
  prerequisite is unmet** — they say precisely what is being waited on, and their length protects them.
- **Run the standing pre-push check before pushing ANY board change, not only a READY row.** This
  defect was in a row deliberately written *not* to be READY, and the check is what caught it.

**This joins DISC-0013's rule about the dependency cell.** Both say the same thing from opposite ends:
**a board cell written in prose and read by a regex will keep producing failures that look correct to
a human reader.** **Q17 asks what that mechanism should be; this is the fifth distinct way it has
failed, and it is the first that would have caused an unauthorized-in-practice START rather than a
stall.**

## 5. The second finding — the standing pre-push check is NOT a faithful replica

**MSG-0172 §3 promoted `implementation/probes/TASK-0050/queue-parse-check.mjs` to a standing check on
the strength of it replicating the Supervisor's parse.** Reading the two side by side in this session,
**it does not, in three respects.** All three are **VERIFIED by reading both sources**; none is
inferred from a failure.

| # | `supervisor.ps1` | `queue-parse-check.mjs` | Consequence |
|---|---|---|---|
| 1 | `VALID_STATUSES` = READY, IN_PROGRESS, COMPLETE, BLOCKED, **WAITING_FOR_ARCHITECTURE_LEAD**, WAITING_FOR_OPERATOR, **ABORTED** | VALID = READY, IN_PROGRESS, COMPLETE, BLOCKED, **PROPOSED**, **SUPERSEDED**, **WAITING_FOR_ARCHITECTURE** *(truncated)*, WAITING_FOR_OPERATOR | **The lists disagree in four entries.** A row reading `PROPOSED` or `SUPERSEDED` **passes the check and is UNRECOGNISED by the Supervisor** → contradictory queue → **NOOP every cycle, silently** |
| 2 | An unrecognised status is a **recorded problem**: `'{0} has an unrecognised status: "{1}"'` | **No such check.** A `null` status is simply never READY, so it is skipped | **The check cannot report the failure in row 1 even in principle** |
| 3 | Also validates `IN_PROGRESS` state | Not implemented | A live-runner contradiction is invisible to the check |

**A fourth difference is a language property rather than a list**, and is labelled accordingly.
**VERIFIED by reading:** the JavaScript regex is constructed **without the `i` flag**, so it is
case-sensitive; the PowerShell operator is **`-match`**. **INFERRED from documented PowerShell
semantics, not measured on this host:** `-match` is **case-insensitive by default**, so a status cell
reading `blocked` in lower case would be recognised by the Supervisor and **not** by the check.
**Settling this needs one line run on the Windows machine**, and nobody should act on it as
established until then.

**Is any of this live right now? NO — and that was checked rather than assumed.** Every board row's
status word was enumerated in this session; **none reads `PROPOSED` or `SUPERSEDED`, and the one
`ABORTED` row (TASK-0002) is recognised by the Supervisor**, which is the direction that matters. **The
three gaps are latent hazards, not an active stall.**

**Deliberately NOT fixed here.** Editing the replicator is a change to a standing operational control
promoted by MSG-0172 §3, and **the Lead is not going to quietly re-cut a control it relies on for
verification.** It is recorded for the architecture lead's decision — **and the honest reading is that
a check believed faithful, and not, is worse than no check**, because MSG-0172 §3 made a pre-push pass
count as evidence.

## 6. What is NOT affected

**No architecture, invariant, criterion, gate, candidate verdict or evidence result is touched.** This
is a queue-encoding and tooling-fidelity defect. **GAP-B remains UNDISCHARGED, E4 UNMET, all six
§4.14 candidates NOT CLEARED**, and nothing was selected, adopted, deployed, implemented or cleared.

**TASK-0055's authorization (MSG-0182 §5) and its definition are unchanged.** Only its status word
moved, and it was never pushed in the defective form.
