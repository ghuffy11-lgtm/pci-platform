# MSG-0082 — The Corpus Sits Where the Unattended Runner May Not Read

**Status:** **CLOSED** 2026-08-22 — answered by **MSG-0083**, which chose **option A**: a narrow read-only grant for `D:Workpci-corpus` only. Applied to `runner-settings.json` and verified empirically; BLK-0010 is RESOLVED and TASK-0027 is READY again.
**Raised:** 2026-08-22
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Structural finding + decision request
**Authority:** MSG-0080 | **Related:** BLK-0009, BLK-0008, MSG-0081, TASK-0027, MSG-0028 (the runner permission set)

## The finding

**MSG-0080 requires the corpus to live outside the repository. The unattended runner's permission
boundary is the repository. Those two facts collide.**

This is not inference. A real supervisor-started session recorded it while stopping for an unrelated
reason (BLK-0009):

> The corpus PDF was not read, opened, copied, or inspected. Its existence at
> `D:\Work\pci-corpus\plan.pdf` is **UNKNOWN to this session** — a read of that directory was requested
> and **the permission was not granted**, and it was **not routed around**.

`runner-settings.json` grants four narrowly-scoped `Bash` capabilities and nothing else; it confers no
read access outside the working tree. **The corpus is therefore in the one place a runner may not be
able to reach**, by the deliberate design of two controls that are each correct on their own.

## Why neither control should simply be bent

**Moving the corpus into the repository is not an option.** MSG-0080 makes its externality a standing
constraint, and BLK-0008 records the near-miss where the file briefly sat inside the working tree,
untracked and unignored, one `git add -A` from permanent history.

**Weakening the runner's permissions is not Claude's to do.** MSG-0028 set that boundary, it is
version-controlled precisely so it is reviewed rather than adjusted in passing, and "the task could not
finish otherwise" is the exact reasoning a permission boundary exists to refuse.

**Inferring the document's properties from its filename or size is not an option either** — that is the
invented-findings failure the whole n=1 discipline exists to prevent.

## The options, for the Architecture Lead and the operator

Stated without a recommendation between the first two, because they trade different things and the
trade is not Claude's to make.

**A — Grant a narrow read permission.** Add read access for `D:\Work\pci-corpus\` (or that one file) to
`runner-settings.json`. Keeps A-SURVEY unattended and repeatable. It is a **permission change to a
governance control**, needs the Lead's authorization, and should be scoped to that path and no wider.

**B — Run TASK-0027 interactively.** An interactive session can read outside the working directory with
approval. Nothing is granted permanently and no control changes. The cost is that this one task is not
executed by the mechanism the project built, and its evidence comes from an interactive session rather
than a runner-produced record.

**C — Something else entirely**, e.g. a read-only extraction produced outside the repository by the
operator and supplied as text. Mentioned for completeness; it changes what A-SURVEY is surveying, so it
is the Lead's call whether that still answers the question.

**Not an option:** copying the PDF into the repository, editing the permission set without
authorization, or reporting document properties that were never observed.

## What happens if nothing is decided

**Nothing breaks.** TASK-0027 is READY and the Supervisor will start it. If the read is denied, the run
stops at that prerequisite and records it — the same fail-closed behaviour TASK-0026 showed at PR5 and
BLK-0009 showed here. The cost is one supervisor cycle per attempt, and the record stays honest.

The TASK-0027 queue section now carries this constraint explicitly, with instructions to stop and
record rather than copy the file in, edit permissions, or infer properties from proxies. **A runner
that hits this wall should produce a blocker, not a survey.**

## One observation about the pattern

**This is the second time today that two individually-correct controls have combined into a stop**, and
both were caught rather than routed around:

| | Controls | Outcome |
|---|---|---|
| **BLK-0009** | Supervisor reads the *working tree*; the queue is authoritative only when *committed* | Runner declined to execute a task that was READY only in an uncommitted file |
| **This** | Corpus must stay outside the repo; runner may only read inside it | Runner declined to read the corpus |

Neither is a defect in either control. Both are the seam between two controls, and in both cases the
unattended session **stopped and recorded instead of improvising**, which is the behaviour worth having.

---

## CONFIRMED by a second runner — 2026-08-22, added by the TASK-0027 session (BLK-0010)

**This message's finding was tested by the very next Supervisor cycle and it held.** Recorded here so a
reader of MSG-0082 alone knows the collision is observed, not merely predicted.

Runner pid **24140** reached TASK-0027's first action and was refused:

```text
$ ls -l /d/Work/pci-corpus/
ls in '/d/Work/pci-corpus/' was blocked. For security, Claude Code may only list files in the
allowed working directories for this session: 'D:\Work\pci-platform'.
```

**This is better evidence than the BLK-0009 observation quoted above**, because it names the boundary
explicitly. Worth knowing: that runner's *first* attempt produced an ambiguous refusal citing
"multiple operations" in a compound command and **no path at all** — a message equally consistent with
the corpus being readable. Re-issuing the same read as a single plain command produced the quotable
result. **Had the ambiguous message been taken as the diagnosis, this message would have been asking
the Lead to widen a permission on evidence that did not establish the need.**

**Two corrections to this message's own expectations:**

1. **"Undecided is safe" is right about damage and wrong about cost.** No damage occurred — nothing was
   copied, no permission changed, no figure invented. But the cost is **not** "one supervisor cycle per
   attempt" in any bounded sense: the boundary is **non-transient**, so cycles recur indefinitely and
   each produces an identical blocker. **The queue and status files now say so explicitly.**
2. **Option B is narrower than it reads.** "Run TASK-0027 interactively" assumes an interactive session
   can read `D:\Work\pci-corpus\`. The refusal above names the restriction as applying to *"the allowed
   working directories for **this session**"* — **whether an interactive session in this repository is
   scoped differently was not tested here**, and should be confirmed before B is chosen rather than
   assumed. **UNKNOWN**, stated as such.

**The decision request is unchanged and still OPEN.** Nothing in this addendum selects between A, B,
and C.

## State

- **TASK-0027 is READY** in the committed queue as of this reconciliation, and remains authorized by
  MSG-0080. **No re-authorization is needed.**
- **BLK-0009 is RESOLVED** — the concurrent writer was this interactive COMMS session, whose work is now
  committed.
- **No permission was changed. No corpus file was moved, copied, or read by any unattended session.**
- No ADR touched; T-A, T-B, T-D, T-E and T-0 remain unauthorized.
