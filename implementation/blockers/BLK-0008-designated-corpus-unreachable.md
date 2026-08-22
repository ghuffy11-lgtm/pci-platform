# BLK-0008 — The Designated A-SURVEY Corpus Is Not Reachable

**Status:** **OPEN** — operator action required; no local remedy exists and none was attempted
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
