# MSG-0086 — TASK-0028 Reconciled: the Arabic Follow-up Survey

**Status:** **CLOSED** 2026-08-22 — discharged by execution. TASK-0028 ran and is **COMPLETE** (MSG-0087, 9/9 criteria). This record reconciled the task into the queue; that job is done and the survey it enabled has been performed.
**Raised:** 2026-08-22
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0085 | **Related:** MSG-0083, MSG-0084, ADR-0019, TASK-0027

## What was done

MSG-0085 is reconciled into the queue as **TASK-0028**, the single READY task, with a board row, a full
task section, and ledger rows. MSG-0085 assigns no task number, so **TASK-0028 was allocated here** as
the next unused id, verified free.

**No survey was performed.** That is TASK-0028's work.

MSG-0085 §9 asked for exactly this step — *"if a new bounded task/READY reconciliation is required by
the queue, record that rather than silently re-running a closed task."* **TASK-0027 is COMPLETE and was
not touched.**

## The corpus, and why no permission change was needed

```text
D:\Work\pci-corpus\Arabic.pdf      663.3 KB      %PDF-1.5      verified present
D:\Work\pci-corpus\plan.pdf        626.8 KB      %PDF-1.7      TASK-0027's subject
```

**MSG-0083 granted the directory, not a single file**, so `Arabic.pdf` is already readable by the
unattended runner. **No permission was changed and none is authorized** — MSG-0085 §3 is explicit that
the existing grant is to be used and not broadened.

That the earlier grant was scoped to the directory rather than to `plan.pdf` turns out to be the right
call here. It is worth noting that the reverse is also true: **a directory grant means any file the
operator places there becomes readable**, which is a small standing consequence of the design rather
than a defect, and is the sort of thing worth remembering before that directory is used for anything
else.

## What the task section carries beyond MSG-0085

Five things, each because a runner reading MSG-0085 alone could reasonably get them wrong:

**1. The two documents must not be combined into a "corpus".** MSG-0085 §5 says record this as n=1 for
the Arabic follow-up. The nearby temptation is to treat "one English plus one Arabic" as a two-document
sample and start describing a language mix. **Two files chosen by an operator are not a sample**, and a
prevalence claim from them would be exactly the invented distribution the whole n=1 discipline exists
to prevent.

**2. ADR-0019 must not be amended, and the reason is sharper here than for English.** ADR-0019 was
accepted **on condition** that its Arabic normalization rules come from empirical corpus evidence.
**This is the first Arabic evidence the project has**, which makes promoting one document's behaviour
into a normalization rule both very tempting and precisely what the condition forbids. MSG-0085 §7 says
implications are evidence for a later decision; the section repeats it with that reasoning attached.

**3. TASK-0027's three extraction hazards are things to check for, not to expect.** Duplicated glyphs
from drop shadows, language tags harvested as body text, and a page whose meaning is vector graphics.
A different producer and a different script may behave entirely differently — **finding none of the
three is a real result**, and looking for them is not the same as reporting them.

**4. The personal-data restraint carries forward.** MSG-0084 §4.1 read author and approver names in the
English document and deliberately did not transcribe them into the record. The section instructs the
same: note that such fields are present and what their structure is; do not copy their values into the
repository.

**5. There is no PDF tooling, and none may be added.** `pdftoppm` is absent and `pdftotext` is off the
runner allowlist (MSG-0084 §8.2). TASK-0027 worked within that by reading bytes directly, which the read
grant permits. The section says plainly: do not install tooling, do not request it mid-run, and if
byte-level inspection cannot answer something, **record the question as unanswered**.

## Two items from MSG-0084 still sitting with the Architecture Lead

Neither blocks TASK-0028, and neither is restated as a decision request here — they are MSG-0084's.

**The corpus is real organizational material, not synthetic.** `plan.pdf` is a genuine 45-page Hadi
Clinic emergency-preparedness plan with named author and approver and a real signature block, carrying
**no confidentiality marking**. The Lead designated that exact path, so the read was authorized and no
boundary was crossed. It is raised because **the record should not quietly describe production material
as synthetic**, and the same question now applies to `Arabic.pdf`, which MSG-0085 also calls
approved/synthetic. **TASK-0028 will treat it with the same restraint either way.**

**PDF tooling for the runner** is a permission and tooling decision, and MSG-0084 correctly declined to
self-authorize it.

## State

- ~~**TASK-0028 is READY and is the single READY task.** Not started at the time of writing.~~ **Superseded 2026-08-22:** it has since executed and is **COMPLETE** (MSG-0087). Struck through rather than deleted, because a stale "READY" here is what later prompted a request to re-run a finished task.
- `Arabic.pdf` verified present and outside the repository; `git status` clean; no PDF has ever entered
  history.
- **No permission was changed.** MSG-0083's grant is used as-is.
- MSG-0085 registered in the COMMS register and the queue ledger.
- No ADR touched. **T-A, T-B, T-D, T-E and T-0 remain unauthorized.** No OPEN blocker.

---

## CLOSED — 2026-08-22, discharged by execution

**TASK-0028 executed and is COMPLETE** — the Arabic follow-up survey was performed at n=1 and recorded
in **MSG-0087** (9/9 acceptance criteria).

**The "TASK-0028 is READY and is the single READY task" line in §State above was accurate when written
and is now superseded.** The authoritative statement of the task's state is the queue board, which
reads **COMPLETE**; this record is the reconciliation that made the execution possible, not a live
status.

**Recorded because the stale line caused a real confusion.** A later instruction asked for TASK-0028 to
be executed "now" on the basis that it was still the single READY task — it was not, and re-running it
would have surveyed a byte-identical file to produce duplicate findings and a second record of the same
document. The committed queue and MSG-0087 were checked before anything was re-run.

**The five things this record asked the task to get right were all honoured**, per MSG-0087:

| Constraint | Outcome |
|---|---|
| The two documents are not a corpus | Stated explicitly; no distributional claim made |
| ADR-0019 must not be amended | Untouched; implications recorded as evidence only |
| TASK-0027's hazards are to be checked for, not expected | All three checked; **all three absent** — reported as a real result |
| Personal-data restraint carries forward | No personal names found in metadata; none transcribed regardless |
| No PDF tooling may be added | None added; byte-level inspection only, and its ceiling recorded where it was hit |
