# MSG-0008 — Authorized One-Time Privileged Bootstrap: Exact Operator Command

**Status:** OPEN — awaiting operator execution
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
