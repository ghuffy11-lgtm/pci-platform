# BLK-0008 — The Designated A-SURVEY Corpus Is Not Reachable

**Status:** **RESOLVED** 2026-08-22 — neither transport problem had to be solved. The corpus was supplied directly at `D:\Work\pci-corpus\plan.pdf` and is readable; nothing was mounted and no Windows feature was installed. Retained for the diagnosis (SMB tested first, corrected to NFS) and for the near-miss where the file first landed inside the repository
**Raised:** 2026-08-22, on the operator's designation of a corpus path
**Severity:** Medium. A-SURVEY stays unexecutable; A-STACK is delivered and unaffected
**Related:** MSG-0077 (PR5 unmet), MSG-0078 §3 (A-SURVEY stopped), MSG-0076, MSG-0062 §7.5, BLK-0007 (same diagnostic shape)

## What was designated

The operator designated an approved corpus for A-SURVEY:

```text
\\10.1.27.220\LXBackup\plan.pdf
```

with two explicit qualifications: **use it as the approved/synthetic test corpus**, and **do not use it
as a production or confidential corpus**. That designation resolves the *authority* question PR5 raised
— the organization has named material and bounded its use.

**It does not resolve the availability question, because the path cannot be reached.**

## Verified — the path is not reachable from this machine

```text
Test-Path '\\10.1.27.220\LXBackup\plan.pdf'   ->  False
Test-Path '\\10.1.27.220\LXBackup'            ->  False

Test-Connection 10.1.27.220 (ICMP)            ->  True     <- host answers
Test-NetConnection 10.1.27.220 -Port 445      ->  False    <- SMB closed
Test-NetConnection 10.1.27.220 -Port 139      ->  False    <- NetBIOS closed

net view \\10.1.27.220
  System error 53 has occurred.
  The network path was not found.
```

**The host is alive; SMB is not reachable.** ICMP answers, and both file-sharing ports are closed or
filtered.

## This is not a credentials problem — and the distinction matters

**No TCP connection is established on 445 or 139, so no authentication is ever attempted.** A
credentials failure looks different: the connection succeeds and the server returns *access denied*
(system error 5). What is happening here is *network path not found* (error 53), before any identity is
offered.

This is the same discipline BLK-0007 required, and it is recorded because the wrong diagnosis sends the
operator to fix the wrong thing: **supplying credentials, mapping a drive with alternate logins, or
changing share permissions will not help while the transport is closed.**

**What cannot be determined from this machine**, and is therefore not asserted: whether SMB is disabled
on the host, whether a host or network firewall filters it, whether the share is published at all, or
whether this workstation sits on a segment that blocks SMB. Any of the four produces exactly this
signature.

## What was NOT done

- **No alternative transport was tried** — no HTTP, no SSH/SCP, no cloud copy, no attempt to reach the
  host by another route.
- **No credentials were supplied, mapped, cached, or prompted for**; no `net use` with alternate
  logins.
- **Nothing was copied anywhere**, into the repository or outside it.
- **No survey observations were produced.** Not estimated, not illustrated, not inferred from the
  filename. `plan.pdf` tells us nothing about its own format, language, or provenance.

Each of these would be a way of appearing to make progress while the actual prerequisite stayed unmet.

## Impact, stated precisely

**A-SURVEY remains unexecutable.** It is already recorded as unmet: TASK-0026 is **COMPLETE (PARTIAL)**
with MSG-0076 acceptance criterion 1 unmet, and MSG-0078 §3 documents the runner re-checking by
inspection and stopping correctly rather than inventing findings.

**A-STACK is unaffected** — delivered as `EPA-0005`, and it depended on nothing from the corpus.

Because TASK-0026 is already closed, **completing A-SURVEY needs a newly authorized task**, not a
re-run of TASK-0026. That authorization is the Architecture Lead's and is not assumed here.

## An observation about the corpus itself, offered honestly

Even once the path is reachable, **one PDF is a thin corpus for the questions A-SURVEY is asked**.

MSG-0076 asks for **formats, language mix, scanned-document prevalence, classification/audience
patterns, and version/supersession characteristics**. Four of those five are *distributional* — they
describe a population, not a document. A single file can establish whether **it** is text-native or
scanned and what language **it** is in; it cannot establish prevalence, mix, or patterns across a
corpus.

That is worth knowing before the survey runs, because a survey of one file could produce a record that
*reads* like a corpus survey and is treated later as one — and its findings would flow into **D6**
normalization, **D14**'s scanned-document ruling, and **ADR-0019**, which is accepted on condition its
rules come from empirical corpus evidence.

**Not a refusal, and not a request to change the ruling.** A single document is genuinely useful for
the format and extractability questions. The point is only that the resulting record should say what it
sampled, so nobody later mistakes n=1 for a corpus.

## What is needed to clear this

**Operator action, in the order that costs least:**

1. **Confirm the path and host.** `10.1.27.220` answers ICMP but offers no SMB — check the share is
   published and the service running.
2. **Check whether SMB is filtered** between this workstation and that host. The
   ICMP-works/SMB-closed split is the signature to hand a network administrator.
3. **Or supply the file by another authorized route** — placing it somewhere already reachable is
   likely faster than opening SMB, if that is acceptable to the organization.

**Do not treat this as a permissions fix.** The transport is closed before authentication.

## Note for a resuming session

**Re-check reachability by inspection before assuming this is still open.** If `Test-Path` on the UNC
path now succeeds, this blocker is stale — but note that **A-SURVEY still requires a newly authorized
task**, because TASK-0026 is closed. Do not re-run a closed task, and do not survey without
authorization.

---

## CORRECTION — 2026-08-22: the path is NFS, not SMB

**The operator has clarified: `\10.1.27.220\LXBackup\plan.pdf` is an NFS export**, not an SMB share.
The UNC-style notation is how Windows' own Client for NFS addresses an export, so the form was
consistent with either protocol and **this record tested the wrong one first.**

The original SMB findings above are left in place rather than deleted — they are true (SMB genuinely is
closed on that host) but they were **the wrong question**, and the remedy they pointed at was
correspondingly wrong.

### Re-tested against NFS

```text
Test-NetConnection 10.1.27.220 -Port 2049   ->  False    NFS closed
Test-NetConnection 10.1.27.220 -Port 111    ->  False    portmapper/rpcbind closed
```

**Both closed.** NFSv4 does not require portmapper, so 2049 alone would have sufficed; neither
responds.

### And a second, independent blocker: there is no NFS client on this machine

```text
Get-WindowsFeature NFS-Client       ->  InstallState: Available     (i.e. NOT installed)
Get-WindowsFeature FS-NFS-Service   ->  InstallState: Available     (i.e. NOT installed)

showmount.exe  ->  NOT PRESENT
nfsadmin.exe   ->  NOT PRESENT
mount.exe      ->  C:\Program Files\Git\usr\bin\mount.exe   <- Git Bash MSYS binary, NOT the Windows NFS client
```

`Available` in this cmdlet means *installable but not installed*. **This workstation cannot mount NFS
at all**, independently of whether the server is reachable.

The `mount.exe` on PATH is a decoy worth naming: it belongs to Git for Windows and cannot mount an NFS
export. Anyone checking for "is mount available" would get a misleading yes.

### What this changes, and what it does not

**Unchanged:** the corpus is unreachable, A-SURVEY stays unexecutable, and no observations were
produced.

**Changed — the remedy.** The earlier guidance said to check SMB publication and hand the
ICMP-works/SMB-closed split to a network administrator. **That advice was based on the wrong protocol
and should be disregarded.** Two things must both be true before the corpus can be read:

1. **The NFS export must be reachable** from this workstation — 2049 open, and `LXBackup` exported to
   this host with a permitted client address.
2. **Client for NFS must be installed here** — `Install-WindowsFeature NFS-Client`, which requires
   administrator privilege and a Windows feature installation.

### Why item 2 was not done

**Installing a Windows feature is a privileged host modification**, and no current work package or
recorded decision authorizes it. TASK-0026 is closed; MSG-0076 authorized architecture work, not
machine configuration. Per the operating rules, the destination, privilege and authorization must be
stated and confirmed before any host change — the first two are known, the third does not exist.

**So it is recorded as an operator decision rather than performed.** It is also not urgent on its own:
with 2049 closed, installing the client would change nothing yet.

### Corrected diagnosis

**The host answers ICMP and offers neither SMB nor NFS to this workstation, and this workstation has no
NFS client installed.** Whether the export exists, is exported to this address, or is firewalled cannot
be determined from here — `showmount -e` would answer it, and that tool is part of the uninstalled
feature.

---

## RESOLVED — 2026-08-22, by supplying the file locally

**Neither transport problem had to be solved.** The operator placed the corpus directly on this
machine:

```text
D:\Work\pci-corpus\plan.pdf        626.8 KB      header %PDF-1.7      readable
```

So the NFS export being unreachable and Client for NFS being uninstalled are both **moot**. Nothing was
mounted, no feature was installed, and no privileged change was made — which is the outcome the
"place the file somewhere already reachable" option was offered for.

### One thing worth recording: it first landed in the wrong place

The file initially arrived at `D:\Work\pci-platform\plan.pdf` — **inside the Git working tree**,
untracked and not covered by `.gitignore`.

```text
$ git status --porcelain
?? plan.pdf
$ git check-ignore -v plan.pdf     -> no match
```

**Every COMMS cycle and every unattended runner executes `git add -A`.** The next commit would have put
627 KB of corpus into permanent repository history, removable only by rewriting published history.

It was moved to `D:\Work\pci-corpus\` before anything staged it, and `git status` was verified clean
afterwards. **Nothing was ever committed.** MSG-0080 subsequently made the external location a standing
constraint, and the TASK-0027 queue section carries the warning so a runner does not copy it back in.

### State

**A-SURVEY is unblocked.** MSG-0080 authorizes the bounded follow-up, reconciled as **TASK-0027**.
The earlier SMB and NFS findings are retained above as the record of what was tested and why the
diagnosis changed; neither describes a live problem.
