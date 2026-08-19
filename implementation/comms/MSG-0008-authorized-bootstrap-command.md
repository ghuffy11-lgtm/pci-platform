# MSG-0008 — Authorized One-Time Privileged Bootstrap: Exact Operator Command

**Status:** OPEN — procedure amended 2026-08-19 for execution from an existing repository copy; awaiting operator execution
**Raised:** 2026-08-19
**Raised by:** Claude Code (implementation agent)
**Work package:** WP-0001 — PCI Kernel Foundation
**Authorization:** architecture lead, one-time privileged bootstrap
**Blocker:** `implementation/blockers/BLK-0004-host-privilege-unavailable.md`

## Why an operator has to run it

The bootstrap needs root. `sudo` on the PCI server requires a password, which this environment
must not handle, so Claude Code cannot execute it. Verified this session:

```text
$ sudo -n true      -> sudo: a password is required
$ ls -ld /data      -> drwxr-xr-x 16 root root /data
$ mkdir /data/pci-platform
mkdir: cannot create directory ‘/data/pci-platform’: Permission denied
```

## The ordering problem, and how this sequence solves it

Contract v0.2 requires the bootstrap script to be executed from `/data/pci-platform`. But that
workspace does not exist yet, and nothing may be staged outside `/data` to create it. The script
therefore cannot start from where the contract requires it to start.

The sequence below resolves that without violating the boundary: **one privileged command creates
the workspace, Claude Code clones into it unprivileged, and the second privileged command runs the
script from the authorized `/data` path** exactly as the contract requires.

No PCI artifact touches `/home/claude`, `/tmp`, or anywhere else outside `/data` at any point.

## AUTHORIZED PROCEDURE — execute from an existing repository copy

**Amended 2026-08-19.** The architecture lead acknowledged this message and authorized execution
**from an existing repository copy**, provided the `/data` boundary is not violated. That is the
procedure recorded below and it supersedes the three-step sequence originally proposed here (kept
further down for history).

All three commands run **on the PCI server**, as the `claude` account, in one interactive SSH
session where `sudo` can prompt for the operator's password.

### Prerequisite — an existing repository copy on the server

There is none today, and this is the only genuinely awkward part: the workspace that must hold the
copy cannot be created without root, and nothing may be staged outside `/data` to get around that.
So the first privileged command creates the workspace, and the copy goes straight into it.

### Step 1 — create the mandatory workspace (privileged)

```bash
sudo install -d -m 0755 -o claude -g claude /data/pci-platform
```

Creates `/data/pci-platform` owned by `claude`. Nothing else is touched. This is the only command
that must precede the repository copy.

### Step 2 — place the repository copy inside `/data` (unprivileged)

Either let Claude Code do it — say the word and it clones over SSH agent forwarding, no credential
reaching the host — or do it yourself in the same session:

```bash
git clone git@github.com:ghuffy11-lgtm/pci-platform.git /data/pci-platform
```

Requires GitHub access from the host. If you connect with `ssh -A`, your forwarded agent supplies
it and nothing is stored on the server.

If the host has no GitHub access at all, copy the tree from the workstation checkout instead —
straight into `/data`, never via an intermediate location:

```bash
# run from the workstation copy, e.g. D:\Work\pci-platform
scp -r ./deploy ./services ./docs ./implementation claude@<pci-server>:/data/pci-platform/
```

### Step 3 — the authorized bootstrap (privileged, one time)

```bash
sudo bash /data/pci-platform/deploy/bootstrap/pci-server-bootstrap.sh
```

**This is the authorized command and the authorized path.** Everything it writes stays inside
`/data`, except `/etc/docker/daemon.json` and apt package state — the system configuration that
contract v0.2 explicitly permits a privileged bootstrap to install.

### If step 1 and step 3 must be collapsed

The script provisions `/data/pci-platform` itself (its step 2), so a single privileged run from a
copy that is already on the server outside `/data` would also work. **That variant is not used
here**, because it would require a PCI artifact to exist outside `/data` first — exactly what the
boundary forbids. The three steps above avoid it: nothing of this project is ever written outside
`/data`.

### Where the script records its own location

The script now resolves its own path and prints it in the evidence block as `executed from`. If it
is ever run from outside `/data` it says so explicitly in its output rather than passing silently:

```text
[bootstrap] NOTE: executing from <path>, which is outside /data.
[bootstrap]       Permitted for the first bootstrap only, by explicit authorization (MSG-0008).
```

This is an audit-trail record, not a behavioural dependency — the script's actions are identical
either way, and every path it writes to is absolute.

### Verification, before and after

Before step 3, confirm the workspace landed correctly:

```bash
ls -ld /data/pci-platform
ls /data/pci-platform/deploy/bootstrap/
```

After step 3, the script's own final check must pass — it reads `DockerRootDir` back from the
running daemon and **fails loudly** if it is not under `/data/docker`. Independently:

```bash
docker info --format '{{.DockerRootDir}}'      # expect /data/docker
systemctl is-active docker                     # expect active
ls -A /home/claude                             # expect no PCI artifact
```

Claude Code will run these itself over SSH rather than accept the outcome on trust.

---

## Original three-step sequence (historical)

Retained for the record; superseded by the authorized procedure above, which differs only in that
the repository copy is placed by the operator or by Claude Code into the already-created
workspace, rather than being assumed to exist.

## Step 1 — operator, on the PCI server (privileged)

```bash
sudo install -d -m 0755 -o claude -g claude /data/pci-platform
```

Creates the mandatory workspace owned by `claude`. Nothing else.

## Step 2 — Claude Code, unattended (no privilege required)

Once step 1 exists, Claude Code clones the repository into the workspace over SSH agent
forwarding, so no credential is copied to the host:

```bash
git clone git@github.com:ghuffy11-lgtm/pci-platform.git /data/pci-platform
```

Tell Claude Code that step 1 is done and it will perform this itself. Nothing here needs the
operator.

## Step 3 — operator, on the PCI server (privileged, one time)

```bash
sudo bash /data/pci-platform/deploy/bootstrap/pci-server-bootstrap.sh
```

**This is the authorized command and the authorized path.** It is the whole of the privileged
bootstrap.

### Alternative if you prefer not to wait for step 2

The script is location-independent — it contains no relative paths and makes no assumption about
its own directory. Step 3 may therefore be run from the operator's own copy of the repository, and
its step 2 will create `/data/pci-platform` itself, collapsing steps 1 and 3 into one command:

```bash
sudo bash <operator's copy>/deploy/bootstrap/pci-server-bootstrap.sh
```

Claude Code then clones into the workspace afterwards. This is one command instead of two, at the
cost of the script running from outside `/data` for that first execution only. Contract v0.2's
Auditability clause reserves that choice to the architecture lead, which is why it is offered here
rather than assumed.

## What the script does, in order

1. **Preconditions** — refuses unless the host is Ubuntu and `/data` is a real mount point, so
   platform state can never land on the root filesystem.
2. **`/data` layout** — creates `/data/pci-platform`, chowns it to `claude`, verifies it is
   writable. Runs *before* any service is installed.
3. **Docker** — installs `docker.io` and `docker-compose-v2` from the Ubuntu archive. No
   third-party apt source and no new signing key are added.
4. **Storage boundary** — installs the pre-staged `/data/docker/daemon.json` to
   `/etc/docker/daemon.json`, so `data-root` takes effect; tightens `/data/docker` to `root:root
   0710`.
5. **Service** — enables and restarts Docker.
6. **Access** — adds `claude` to the `docker` group.
7. **Verification** — reads `DockerRootDir` back from the daemon and **fails loudly** if it does
   not resolve under `/data/docker`, then prints an evidence block.

Idempotent: safe to re-run. It has **never been executed**.

### Everything it writes

| Path | Why |
|---|---|
| `/data/pci-platform` | the mandatory workspace |
| `/data/docker` | ownership and permissions only; Docker manages the contents |
| `/etc/docker/daemon.json` | system configuration the privileged bootstrap must install — the one permitted exception in contract v0.2 |
| apt package state | installing Docker |

Nothing is written to `/home/claude`, `/tmp`, `/var/tmp`, `/opt`, or `/usr/local`.

## Two things to know before running it

**It adds `claude` to the `docker` group, which on this host is equivalent to root.** That is
required for Claude Code to operate the container runtime at all and is authorized by the
contract's Host Responsibilities — but it is a standing privilege grant and should be a conscious
decision, not a side effect noticed later.

**`/data` already contains a pre-existing non-PCI layout** — `postgres`, `grafana`, `n8n`,
`ollama`, `loki`, `redis` and others, dated 2026-08-18. The script does not read, modify, or
delete any of them. In particular `/data/postgres` is **not** the PCI database directory; PCI's
PostgreSQL state will live inside the relocated Docker root at `/data/docker`.

## After it runs

Paste the evidence block, or simply say it is done — Claude Code verifies the result directly over
SSH rather than taking the outcome on trust, then continues WP-0001 without further privilege:

1. clone into `/data/pci-platform` (if step 2 has not already happened);
2. fix DISC-0005 first — `npm test` exits 0 while running zero tests under `/bin/sh`, which is the
   default on this host, so test counts must be proven non-zero before any result is trusted;
3. bring up PostgreSQL from `deploy/compose/`, with persistent state inside `/data/docker`;
4. run migrations and the integration tier;
5. prove ADR-0016's obligations against the live database: FORCE RLS, a non-BYPASSRLS runtime
   role, and cross-tenant reads returning 404;
6. record the real results in the WP-0001 report and reassess AC-01, AC-02, AC-05, and AC-09.

## Status

Claude Code has **stopped** and made no host change. Nothing was created inside or outside `/data`.
This message is the record of the exact command and path required.

---

## Execution log

| When | Event |
|---|---|
| 2026-08-19 | Message raised; bootstrap not yet authorized. |
| 2026-08-19 | Architecture lead authorized the one-time privileged bootstrap. |
| 2026-08-19 | Procedure amended for execution from an existing repository copy. |
| 2026-08-19 | GO issued. Host verified directly: `/data/pci-platform` absent, Docker absent, `/etc/docker` absent, `sudo` requires a password. **Step 1 has not been executed.** Stopped without host change. |

**This message remains OPEN.** It closes when step 3 has run and Claude Code has verified
`docker info --format '{{.DockerRootDir}}'` resolves under `/data/docker`, directly rather than
from a report.

---

## Step 1 and Step 2 — COMPLETE, verified 2026-08-19

### Step 1 — workspace provisioned by the operator

```text
$ ls -ld /data/pci-platform
drwxr-xr-x 2 claude claude 4096 Aug 19 15:45 /data/pci-platform
writable by claude: YES        empty: YES
$ findmnt -no SOURCE,SIZE,TARGET /data
/dev/sdb1  8.7T /data
```

### Step 2 — repository cloned into the workspace by Claude Code

Cloned over SSH agent forwarding; no credential was written to the host.

```text
$ cd /data/pci-platform && git log --oneline -1
9f19bce docs(comms): record second GO — bootstrap authorized but not executed
$ git status --porcelain | wc -l
0
$ ls -l deploy/bootstrap/pci-server-bootstrap.sh
-rwxrwxr-x 1 claude claude 7960 Aug 19 15:46 ...
$ bash -n deploy/bootstrap/pci-server-bootstrap.sh
syntax OK (parsed, not executed)
```

**Integrity verified against the committed blob** — the script on the host is byte-identical to
`origin/main`, so what will run is exactly what was reviewed:

```text
blob sha256 (origin/main) : ef2a74ff27b3c043dab50411835ba318c7ca37d488bc7044c9ff13c692a3525c
file sha256 (on host)     : ef2a74ff27b3c043dab50411835ba318c7ca37d488bc7044c9ff13c692a3525c
```

### Boundary compliance after step 2

```text
$ ls -A /home/claude
.bash_history  .bash_logout  .bashrc  .cache  .profile  .ssh

$ find / -xdev -user claude -newer <step-1> -not -path "/data/*" ...
/home/claude/.ssh
/home/claude/.ssh/known_hosts
```

The only artifact outside `/data` is `~/.ssh/known_hosts`, recreated by the clone when it recorded
GitHub's host key. Contract v0.2's **SSH exception** places `~/.ssh` outside this boundary as
infrastructure credentials, and states it must not be deleted or recreated merely to satisfy the
project boundary. It is therefore left in place — deliberately, and in contrast to the earlier
cleanup recorded in MSG-0006 where deleting it was the wrong call.

**No PCI project artifact exists outside `/data`.**

## Step 3 — NOT EXECUTED. Privilege unavailable.

```text
$ sudo -n true
sudo: a password is required
$ command -v docker
(absent)
```

The authorized command is in place at the authorized path and cannot be run by Claude Code:

```bash
sudo bash /data/pci-platform/deploy/bootstrap/pci-server-bootstrap.sh
```

This is the **only** remaining action. Steps 1 and 2 are done; step 3 is one command; steps 4 and 5
(bootstrap verification and WP-0001 verification) follow from it and require no further operator
involvement.

Stopped here per the instruction to stop if a prerequisite fails, and per `CLAUDE.md` Rule 2 —
privilege was not worked around. Nothing on the host was modified beyond the authorized clone into
`/data/pci-platform`.

**MSG-0008 remains OPEN**, now blocked on step 3 alone.
