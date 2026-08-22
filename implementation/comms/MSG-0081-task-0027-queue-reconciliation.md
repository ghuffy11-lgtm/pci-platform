# MSG-0081 — TASK-0027 Reconciled; A-SURVEY Is Unblocked

**Status:** **OPEN** — informational; no decision blocks TASK-0027
**Raised:** 2026-08-22
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Queue reconciliation record
**Authority:** MSG-0080 | **Related:** MSG-0076, MSG-0077, MSG-0078, MSG-0079, BLK-0008

## What was done

MSG-0080 is reconciled into the queue as **TASK-0027**, the single READY task, with a board row, a full
task section, and ledger rows. MSG-0080 assigns no task number, so **TASK-0027 was allocated here** as
the next unused id, verified free.

**No survey was performed.** That is TASK-0027's work.

## The corpus is present and readable

```text
D:\Work\pci-corpus\plan.pdf        626.8 KB      header %PDF-1.7
```

Verified by inspection: the file exists at the authorized external path, is a real PDF (valid
`%PDF-1.7` signature, not merely a `.pdf` extension), and is readable.

## BLK-0008 is RESOLVED, and neither transport problem had to be solved

The blocker recorded two independent obstacles — the NFS export unreachable (2049 and 111 closed) and
Client for NFS not installed on this workstation. **Both are moot.** The operator supplied the file
directly on local disk, which was the third and cheapest of the options offered.

**Nothing was mounted and no Windows feature was installed.** The privileged change that BLK-0008
declined to make was never needed, which is the outcome that option existed for.

## The near-miss, recorded because it will otherwise recur

**The file first arrived at `D:\Work\pci-platform\plan.pdf` — inside the Git working tree.**

```text
$ git status --porcelain
?? plan.pdf
$ git check-ignore -v plan.pdf
  (no match - not ignored)
```

**Untracked and unignored.** Every COMMS cycle runs `git add -A`, and so does every unattended runner.
The next commit would have written 627 KB of corpus into permanent repository history — removable only
by rewriting published history, which is precisely the operation the rules forbid.

It was moved to `D:\Work\pci-corpus\` before anything staged it, and `git status` was verified clean
afterwards. **Nothing was ever committed.**

The mistake was mine as much as anyone's: I gave the destination in one line without saying *why* it
had to be outside the repo, and the file landed one directory off. MSG-0080 has since made the external
location a standing constraint, and the TASK-0027 queue section carries an explicit instruction to read
the file **in place** rather than copy it in "just to inspect it".

**A cheap guard exists and was not applied**: a `*.pdf` entry in `.gitignore` would make the mistake
unstageable. It is not applied because nothing authorizes it and it would silently suppress a
legitimate future PDF. Offered as an option, not taken.

## What TASK-0027 must and must not conclude

**n=1 is the whole discipline of this task.** MSG-0080 permits document-level observations — whether
*this* file is text-native or scanned, its language, its format characteristics, and any
classification, audience, version or supersession markers **present in it**.

It forbids anything distributional: format mix, language prevalence, scanned-document prevalence,
classification and audience distribution, version and supersession prevalence **across a corpus**. For
each of those, **the record must state that n=1 is insufficient and invent no estimate.**

That is not a caveat on the task; it is the task. Four of A-SURVEY's five original questions describe a
population, and one file is not a population. A record that reads like a corpus survey would feed
**D6** normalization, **D14**'s rejection of scanned documents, and **ADR-0019** — accepted
specifically on condition its rules come from *empirical corpus evidence*. A confident distribution
derived from one document would corrupt accepted architecture and be checkable against nothing.

## Records closed alongside this

The organizational action three records were waiting on has been taken, so they are closed rather than
left standing:

| Record | Why closed |
|---|---|
| **MSG-0077** | The one organizational action it asked for has been taken |
| **MSG-0078** | Same; its PARTIAL result stands unchanged and correct |
| **MSG-0079** | Superseded by local delivery — the unreachable path is moot; its n=1 observation was adopted by MSG-0080 |
| **BLK-0008** | RESOLVED — corpus supplied locally; no transport fix needed |

**MSG-0060 remains open** — the task-specification collision observation, still unaddressed and still
blocking nothing.

## State

- **TASK-0027 is READY and is the single READY task.** Not started at the time of writing.
- Corpus present, readable, **outside the repository**; `git status` clean.
- MSG-0080 registered in the COMMS register and the queue ledger.
- No ADR touched. **T-A, T-B, T-D, T-E and T-0 remain unauthorized.**
- No OPEN blocker.
