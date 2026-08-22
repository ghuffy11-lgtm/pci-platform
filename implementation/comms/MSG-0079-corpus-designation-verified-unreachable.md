# MSG-0079 — Corpus Designated by the Operator: Verified, and Not Reachable

**Status:** **OPEN** — operator action required. **Corrected 2026-08-22: the designated path is NFS, not SMB.** Re-tested: NFS 2049 and portmapper 111 both closed, **and** Client for NFS is not installed on this workstation. Two independent blockers; the earlier SMB guidance is superseded
**Raised:** 2026-08-22
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Verification result + blocker report
**Authority:** operator designation, 2026-08-22 | **Related:** BLK-0008, MSG-0078 §3, MSG-0077, MSG-0076, MSG-0062 §7.5

## What was designated, and what was verified

The operator designated a corpus for A-SURVEY:

> Approved A-SURVEY corpus is available at `\\10.1.27.220\LXBackup\plan.pdf`. Use this PDF as the
> approved/synthetic test corpus for A-SURVEY. Do not use it as production/confidential corpus.

**The authority question is resolved by that designation.** PR5 asked who may supply approved material
and under what terms; the organization has now named a file and bounded its use to
approved/synthetic — explicitly **not** production or confidential. That is exactly the ruling
MSG-0062 §7.5 and MSG-0076 left to the organization, and it is recorded as given.

**The availability question is not resolved. The path cannot be reached.**

```text
Test-Path '\\10.1.27.220\LXBackup\plan.pdf'   ->  False
Test-Path '\\10.1.27.220\LXBackup'            ->  False

Test-Connection 10.1.27.220 (ICMP)            ->  True     host answers
Test-NetConnection 10.1.27.220 -Port 445      ->  False    SMB closed
Test-NetConnection 10.1.27.220 -Port 139      ->  False    NetBIOS closed

net view \\10.1.27.220
  System error 53 has occurred.  The network path was not found.
```

Full diagnosis in **BLK-0008**.

## The distinction that decides what to fix

**This is not a credentials problem**, and saying so precisely matters because the wrong diagnosis
sends the operator to fix something that is not broken.

No TCP connection is established on 445 or 139, so **no authentication is ever attempted**. A
credentials failure has a different signature entirely: the connection succeeds, and the server
answers *access denied* (error 5). What happens here is *network path not found* (error 53), before
any identity is offered.

**Supplying credentials, mapping a drive with alternate logins, or adjusting share permissions cannot
help while the transport is closed.**

Four causes produce exactly this signature and **cannot be told apart from this machine**: SMB disabled
on the host; a host firewall; network filtering between this workstation and that host; or the share
not being published. That is stated as a limit rather than guessed at — the same discipline BLK-0007
required, after BLK-0002 was once misdiagnosed as a key problem when it was a passphrase problem.

## What was NOT done

- **No alternative transport** — no HTTP, SSH, SCP, or other route to the host.
- **No credentials supplied, mapped, cached, or prompted for.**
- **Nothing copied anywhere**, into the repository or outside it.
- **No survey observations produced** — not estimated, not illustrated, and not inferred from the
  filename. `plan.pdf` says nothing about its own format, language, or provenance.

Each would have been a way to look like progress while the prerequisite stayed unmet.

## Where this leaves TASK-0026

**TASK-0026 already executed and is COMPLETE (PARTIAL)** — it ran on its own supervisor cycle before
this designation arrived.

- **A-STACK: delivered** as `EPA-0005`. It never depended on the corpus and is unaffected.
- **A-SURVEY: stopped at PR5**, exactly as the queue section instructed. MSG-0078 §3 records the runner
  **re-checking by inspection rather than trusting MSG-0077**, finding only `node_modules` text files,
  and producing no observations. **That is the behaviour working as intended**, and it is worth saying
  plainly: an unattended session was asked for a corpus survey with no corpus, and it declined to
  invent one.

**Because TASK-0026 is closed, completing A-SURVEY requires a newly authorized task.** Re-running a
closed task is not something this session will do, and the authorization is the Architecture Lead's.

## One observation about the corpus itself

**Even once reachable, a single PDF is a thin basis for what A-SURVEY is asked to record.**

MSG-0076 asks for **formats, language mix, scanned-document prevalence, classification/audience
patterns, and version/supersession characteristics**. Four of those five are *distributional* — they
describe a population. One file can establish whether **it** is text-native or scanned and what
language **it** is in; it cannot establish prevalence, mix, or patterns.

This matters downstream: survey findings feed **D6** normalization, **D14**'s rejection of scanned
documents, and **ADR-0019**, which was accepted specifically on condition its rules come from
*empirical corpus evidence*. A record built from one file could later be read as a corpus survey.

**This is not a refusal and not a request to change the ruling.** One document is genuinely useful for
the format, extraction and language questions, and for proving the ingestion path end to end. The only
ask is that whatever record results **states its sample size**, so nobody later mistakes n=1 for a
corpus.

## What the operator needs to do

1. **Confirm the share is published and the service running** on `10.1.27.220` — it answers ICMP but
   offers no SMB.
2. **Check whether SMB is filtered** between this workstation and that host. The ICMP-works /
   SMB-closed split is the signature to hand a network administrator.
3. **Or place the file somewhere already reachable**, which may be faster than opening SMB and is
   equally valid — the designation is about authority, not about transport.

Then the Architecture Lead can authorize the follow-on A-SURVEY task, and it will be reconciled into
the queue as the single READY task before execution.

## State

- **BLK-0008 OPEN** — designated corpus unreachable.
- **A-SURVEY: still unexecutable.** A-STACK: delivered (`EPA-0005`).
- **TASK-0026: COMPLETE (PARTIAL)**, criterion 1 unmet, unchanged by this record.
- **No task is READY.** No accepted ADR touched. No implementation authorized.

---

## CORRECTION — 2026-08-22: NFS, not SMB

**The operator clarified that the designated path is an NFS export.** This record originally tested SMB,
because `\host\share\file` is UNC notation — but Windows' own Client for NFS addresses exports the
same way, so the form was consistent with either protocol and **the wrong one was tested first.**

The SMB findings above are left standing rather than removed. They are accurate — SMB genuinely is
closed on that host — but they answered a question nobody asked, and **the remedy they pointed at was
wrong**, which is the part that matters.

### Re-tested against NFS, and a second blocker found

```text
Test-NetConnection 10.1.27.220 -Port 2049   ->  False    NFS closed
Test-NetConnection 10.1.27.220 -Port 111    ->  False    portmapper closed

Get-WindowsFeature NFS-Client               ->  InstallState: Available   (NOT installed)
Get-WindowsFeature FS-NFS-Service           ->  InstallState: Available   (NOT installed)
showmount.exe / nfsadmin.exe                ->  NOT PRESENT
mount.exe                                   ->  Git Bash MSYS binary, not the Windows NFS client
```

**Two independent things are wrong, and fixing either alone changes nothing:**

1. **The export is not reachable** — 2049 and 111 both closed. NFSv4 needs no portmapper, so 2049 alone
   would have been enough; neither answers.
2. **This workstation has no NFS client installed.** `Available` means installable, not installed. The
   `mount.exe` on PATH belongs to Git for Windows and cannot mount an NFS export — a check for "is
   mount available" returns a misleading yes.

### What was not done, and why

**Client for NFS was not installed.** That is a privileged Windows feature installation, and **nothing
authorizes it**: TASK-0026 is closed, and MSG-0076 authorized architecture work rather than machine
configuration. The operating rules require the destination, privilege and authorization to be stated
before any host change; the first two are known and the third does not exist.

It is also not urgent in isolation — with 2049 closed, installing the client would change nothing yet.

### Corrected guidance for the operator

**Disregard the SMB advice above.** Two conditions must both hold before the corpus can be read:

1. **The NFS export must be reachable from this workstation** — 2049 open, and `LXBackup` exported to
   this host's address.
2. **Client for NFS must be installed here** — `Install-WindowsFeature NFS-Client`, administrator
   privilege, and an operator decision to make it.

Whether the export exists at all, or is simply not exported to this address, **cannot be determined
from here**: `showmount -e 10.1.27.220` would answer it, and that tool ships with the uninstalled
feature.

**Everything else in this record stands.** The authority half of PR5 remains resolved by the
designation; no observations were produced; and completing A-SURVEY still requires a newly authorized
task, since TASK-0026 is closed.
