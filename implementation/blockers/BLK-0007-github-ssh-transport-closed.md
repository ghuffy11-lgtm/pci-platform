# BLK-0007 — GitHub SSH Transport Closed at Banner Exchange; Push Unavailable

**Status:** **OPEN** — external transport fault; no local remedy attempted
**Raised:** 2026-08-21, during the TASK-0023 queue reconciliation
**Severity:** Medium. Work is complete and committed locally; it cannot reach `origin/main`
**Related:** BLK-0002 (different cause — see below), MSG-0064, TASK-0023

## What happened

The TASK-0023 queue reconciliation completed and was committed locally. The verification dry run then
failed, and so did every subsequent remote operation:

```text
$ powershell -File ./supervisor.ps1 -Once -ConfigPath <dryRun copy>
ERROR: unhandled: Connection closed by 20.233.83.145 port 22

$ git fetch origin
Connection closed by 20.233.83.145 port 22
fatal: Could not read from remote repository.
```

**Earlier pushes in the same session succeeded** — `1c08d33`, `d7d28df`, `7eea2b0` all reached
`origin/main`, and a supervisor dry run fetched successfully at 13:01:56Z. The fault appeared after
that.

## Cause — established, not guessed

The connection fails **before authentication begins**:

```text
$ ssh -v -T git@github.com
debug1: Connecting to github.com [20.233.83.145] port 22.
debug1: Connection established.
kex_exchange_identification: Connection closed by remote host
Connection closed by 20.233.83.145 port 22
```

`kex_exchange_identification` is the SSH protocol banner exchange. The remote host closes the
connection **at that stage**, before any key is offered and before any authentication decision is
made.

**Both GitHub SSH endpoints behave identically**, on different addresses and different ports:

```text
$ ssh -T -p 443 git@ssh.github.com   ->  Connection closed by 20.233.83.149 port 443
$ ssh -T      git@github.com          ->  Connection closed by 20.233.83.145 port 22
```

**The network path to GitHub is otherwise healthy:**

```text
$ curl -o /dev/null -w "%{http_code}" https://github.com      ->  200
$ curl -o /dev/null -w "%{http_code}" https://api.github.com  ->  200
```

**Conclusion, and its limits.** SSH transport to GitHub is being closed by the remote end at banner
exchange, while HTTPS to the same host works. That is consistent with source-IP throttling by GitHub,
a transient GitHub SSH incident, or a network device interfering with SSH specifically. **Which of
those three it is cannot be determined from this machine**, and is not asserted here.

## This is NOT BLK-0002

BLK-0002 is the earlier push failure, and it was **first misdiagnosed** as an unregistered key before
`ssh -v` showed "Server accepts key" and the real cause turned out to be a passphrase with no TTY.
That lesson applies directly here, so the distinction is stated explicitly:

| | BLK-0002 | BLK-0007 |
|---|---|---|
| Failure stage | **After** the key was accepted | **Before** any key is offered |
| Symptom | Passphrase prompt with no TTY | `kex_exchange_identification: Connection closed` |
| Cause | Local — credential handling | **Remote or network — transport** |
| Fixable locally | Yes, by loading the agent | **No** |

**No credential, key, agent, or configuration problem is implicated by the evidence.** The failure
occurs before authentication, so the state of the key or agent cannot be the cause. `ssh-agent` on
this machine reports `Stopped/Disabled` and `SSH_AUTH_SOCK` is empty in the Git Bash context, but
**that is not the cause** — it would produce `Permission denied (publickey)` after a successful banner
exchange, not a closed connection before one.

## What was NOT done

**No workaround was attempted, and none should be applied without authorization:**

- **The remote was not switched to HTTPS.** HTTPS works, so this would "fix" the symptom — and it
  would change how the repository authenticates, substituting a credential path that is not the
  authorized one. That is routing around a blocker, which the operating rules forbid.
- No key was created, regenerated, re-registered, or had its passphrase changed.
- No SSH configuration, `known_hosts`, or git remote was modified.
- No force push, no history rewrite, no retry loop.
- The supervisor's real `supervisor-config.json` was not modified — verified by diff against a copy
  taken before the dry run.

## Impact

**Bounded.** The TASK-0023 queue reconciliation is complete and committed locally. What is blocked is
publication:

- The commit cannot reach `origin/main`, so the architecture lead cannot see it on GitHub.
- **The Supervisor cannot start TASK-0023 while this persists.** It fetches as part of its
  reconciliation gate, so it fails closed and starts nothing. That is correct behaviour, and it means
  the READY task will not be consumed by accident during the outage.

## An observation about the supervisor's error path

The supervisor reported `ERROR: unhandled: Connection closed by ...`. It **failed closed correctly** —
no runner started, no lock created, and the real config untouched — but it treated a network outage as
an *unhandled* exception rather than a recognised "cannot reconcile" condition.

The outcome is right either way; the label is misleading to whoever reads the log next, because an
unhandled error reads like a defect in the supervisor rather than an unreachable remote. **No change
was made** — the supervisor is outside this task's scope, and a fix would need its own authorization.
Recorded as an observation.

## What is needed to clear this

Nothing on this machine, most likely. In order of cost:

1. **Wait and retry.** If this is throttling or a transient GitHub SSH incident, it clears by itself.
   Retry `git fetch origin`; success means the blocker is gone and the pending commit can be pushed.
2. **Check GitHub status** (`https://www.githubstatus.com`) for an SSH incident.
3. **If it persists**, the operator should determine whether a local network device or policy is
   closing SSH — the HTTPS-works/SSH-closed split is the diagnostic signature to give a network
   administrator.

**Do not "fix" this by changing the remote to HTTPS or by touching credentials.** If a transport
change is genuinely wanted, it is an architecture/operator decision and needs a recorded authorization
first.

## Note for a resuming session

**Check the actual remote before assuming this is still open.** Run `git fetch origin`; if it
succeeds, this blocker is stale — push the pending commit, mark this RESOLVED with the evidence, and
do not re-run any diagnosis. `CLAUDE.md` *Checkpointing and Recovery* rule (f) applies.
