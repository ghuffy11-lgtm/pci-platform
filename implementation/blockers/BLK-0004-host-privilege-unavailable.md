# BLK-0004 — No Privilege to Bootstrap the Authorized Host

**Status:** **RESOLVED / CLOSED** — 2026-08-19. Bootstrap executed by the operator; `DockerRootDir` verified as `/data/docker`.
**Severity:** High — blocks all remaining WP-0001 verification
**Raised:** 2026-08-19
**Work package:** WP-0001 — PCI Kernel Foundation
**Related:** BLK-0001 (host not bootstrapped), BLK-0003 (RESOLVED — key access), DISC-0004

## Issue

SSH access to the authorized Ubuntu PCI server now works (BLK-0003 resolved). The host was
surveyed read-only. Bootstrap cannot proceed: **Docker is not installed, and the `claude` account
cannot install it.**

```text
$ sudo -n true          -> sudo: a password is required
$ sudo -n -l            -> sudo: a password is required
$ touch /data/docker/.probe -> Permission denied
```

`claude` is a member of the `sudo` group, but every `sudo` invocation requires a password. The
tool environment is non-interactive and must not handle passwords, so no privileged command can
run.

## Host survey — read-only, nothing modified

| Property | Value |
|---|---|
| Host | `hcaisrv` |
| OS | Ubuntu 24.04.4 LTS, kernel 6.8.0-138-generic |
| Architecture | amd64 |
| Account | `claude`, groups `claude sudo users` |
| Docker | **absent** |
| Node.js | absent |
| `psql` | absent |
| Time sync | synchronized |
| Network egress | reachable: `download.docker.com` 200, `archive.ubuntu.com` 200 |
| `/data` | dedicated disk `/dev/sdb1`, 8.7T, 1% used |
| `/data/docker` | exists, `root:root`, empty except `daemon.json` |

Available from the Ubuntu archive: `docker.io` 29.1.3-0ubuntu3~24.04.2,
`docker-compose-v2` 2.40.3+ds1-0ubuntu1~24.04.1.

## Two findings worth recording

### 1. `daemon.json` is pre-staged — and it resolves DISC-0004

`/data/docker/daemon.json` already exists, written 2026-08-18:

```json
{
    "data-root": "/data/docker"
}
```

DISC-0004 asked whether the contract's "all Docker data under `/data/docker`" requires relocating
the daemon's `data-root`, or only per-service bind mounts. The pre-staged file answers it:
**`data-root` is relocated.** With that in place, the named volume in
`deploy/compose/docker-compose.yml` lands inside `/data/docker` and already satisfies the
boundary — no compose change is strictly required. This is stronger than bind mounts, since it
also captures image layers and container state.

`/etc/docker/` does not exist yet, so the staged file has not been installed anywhere the daemon
reads. The bootstrap script installs it.

### 2. `/data` carries a pre-existing non-PCI layout

```text
/data/{backups,compose,grafana,knowledge,logs,loki,n8n,ollama,open-webui,postgres,prometheus,redis}
```

These are siblings of `/data/docker`, not children, and predate PCI work (2026-08-18). They
appear to belong to another stack on this host.

**No PCI state has been or will be written to them.** The contract is explicit that PCI data lives
under `/data/docker`, and equally explicit that unrelated host infrastructure must not be
modified. Flagged only so that nobody later mistakes `/data/postgres` for the PCI database
directory — it is not, and PCI's PostgreSQL state belongs inside the relocated Docker root.

## Resolution — requires operator action

Privilege must be granted, or the bootstrap run on Claude Code's behalf. The bootstrap is
committed as `deploy/bootstrap/pci-server-bootstrap.sh`: idempotent, verifying, and printing the
evidence WP-0001 needs. It has **never been executed**.

**Option A — run the script once (simplest, no standing privilege).**

```bash
sudo bash /data/pci-platform/deploy/bootstrap/pci-server-bootstrap.sh
```

The operator holds the password; Claude Code never sees it. The script's output is the evidence
of record.

**Option B — scoped passwordless sudo**, if Claude Code is to bootstrap and maintain the host
itself as the contract envisages. A narrow `/etc/sudoers.d/` entry is preferable to blanket
NOPASSWD.

**Option C — blanket passwordless sudo for `claude`.** Simplest and broadest. It grants standing
root on the PCI server to a non-interactive automation account; recorded for completeness rather
than recommended.

Note that the script adds `claude` to the `docker` group, which on this host is equivalent to
root. That is required for Claude Code to operate the runtime at all, is authorized by the
contract's Host Responsibilities, and is called out in the script so the grant is never invisible.

## What this blocks

| AC | Blocked work |
|---|---|
| AC-01 | Container image build |
| AC-02 | Database initialization from migrations |
| AC-05 | Tenant isolation under real PostgreSQL RLS |
| AC-09 | Integration test tier |

Also blocked: the ADR-0016 FORCE RLS and non-BYPASSRLS verification obligations, and confirming
DISC-0005's test-runner fix against the target platform.

## Note

This is an operational privilege issue on the customer's host. It is not an architectural
question, and no architecture-lead decision is required. Nothing on the host was created,
installed, or modified while raising this blocker.

---

## Update — 2026-08-19, absolute host file boundary

MSG-0006 established a hard boundary: **no PCI project artifact may exist outside `/data`** on the
PCI server, and `/data/pci-platform` is the mandatory source workspace.

This changes what the operator needs to do, because the workspace is now part of the blocker
rather than an incidental detail. `claude` cannot create it — `/data` is `root:root` and not
writable by the account.

**Required operator action, in order:**

```bash
# 1. Provision the mandatory workspace (root)
sudo install -d -m 0755 -o claude -g claude /data/pci-platform

# 2. As claude, clone the repository into it — nothing lands outside /data
git clone git@github.com:ghuffy11-lgtm/pci-platform.git /data/pci-platform

# 3. Bootstrap from the authorized path (root)
sudo bash /data/pci-platform/deploy/bootstrap/pci-server-bootstrap.sh
```

Step 3 alone is sufficient if the operator prefers to run it from their own copy: the script's
step 2 provisions `/data/pci-platform` itself, after which the repository can be cloned into it.

The earlier instruction in this file to run the script from `~/pci-platform` is withdrawn. That
clone existed briefly, violated the boundary as now defined, and has been removed along with the
`known_hosts` file it created. Nothing of this project remains outside `/data` on the host — and
nothing has been placed inside `/data` either.

Granting scoped passwordless sudo (Option B above) remains the alternative if Claude Code is to
perform the bootstrap itself rather than the operator running it.

---

## GO attempted 2026-08-19 — stopped, no workaround taken

Instruction: proceed with WP-0001, establish `/data/pci-platform` with the required privilege,
run the authorized bootstrap, continue verification.

Preconditions verified directly on the host before acting. Both fail:

```text
$ sudo -n true
sudo: a password is required

$ ls -ld /data
drwxr-xr-x 16 root root 4096 Aug 18 11:54 /data

$ ls -ld /data/pci-platform
ls: cannot access '/data/pci-platform': No such file or directory

$ mkdir /data/pci-platform
mkdir: cannot create directory ‘/data/pci-platform’: Permission denied

$ command -v docker
(absent)

$ id -nG
claude sudo users
```

The workspace cannot be created by `claude`: `/data` is `root:root` `0755`, and every `sudo`
invocation requires a password this environment must not supply. Docker therefore cannot be
installed either, so the bootstrap could not begin.

**Nothing was worked around.** No alternative workspace was created, no temporary directory was
used, no script was piped into a shell, and nothing was written to `/home/claude` or anywhere else
outside `/data`. Nothing was written inside `/data` either — the single `mkdir` attempt failed and
created nothing. The host is byte-for-byte as it was before this session.

Per `CLAUDE.md` Non-Negotiable Rule 2 (server change control) and Rule 6 (stop conditions), work
stopped at this boundary and this blocker is the record.

### Exactly what is needed

One privileged action unblocks everything. Either:

**A — provision the workspace, then Claude Code proceeds unattended:**

```bash
sudo install -d -m 0755 -o claude -g claude /data/pci-platform
```

Claude Code then clones into it, and BLK-0004 still blocks the bootstrap itself unless option C is
also granted.

**B — run the bootstrap once (provisions the workspace as its step 2, installs Docker, verifies
data-root):**

```bash
sudo bash pci-server-bootstrap.sh      # from the operator's own copy of the repository
```

After this, `/data/pci-platform` exists and `claude` is in the `docker` group, so Claude Code can
clone into the workspace and run the remaining WP-0001 verification without further privilege.
**This is the shortest path to unblocking WP-0001 completely.**

**C — scoped passwordless sudo** in `/etc/sudoers.d/`, if Claude Code is to bootstrap and maintain
the host itself as the contract's Host Responsibilities envisage.

Option B is recommended: one command, no standing privilege, and it produces the evidence block
WP-0001 needs for AC-01.

---

## Authorized 2026-08-19 — awaiting operator execution

The architecture lead authorized the one-time privileged bootstrap. The exact command and path are
recorded in `implementation/comms/MSG-0008-authorized-bootstrap-command.md`.

Authorized sequence:

```bash
# 1. operator, privileged — create the mandatory workspace
sudo install -d -m 0755 -o claude -g claude /data/pci-platform

# 2. Claude Code, unprivileged — clone into it over agent forwarding
git clone git@github.com:ghuffy11-lgtm/pci-platform.git /data/pci-platform

# 3. operator, privileged — the authorized bootstrap, from the authorized /data path
sudo bash /data/pci-platform/deploy/bootstrap/pci-server-bootstrap.sh
```

Steps 1 and 3 may be collapsed into a single run from the operator's own copy, since the script is
location-independent and provisions the workspace itself. Contract v0.2 reserves that choice to the
architecture lead; see MSG-0008.

This blocker closes when step 3 has run and `docker info` reports `DockerRootDir` under
`/data/docker`. Claude Code will verify that directly rather than assume it from a report.

---

## Verification log

Each entry is a direct check of the host, run before any action was attempted. Nothing was
modified on the host in any of them.

| When | `/data/pci-platform` | Docker | `sudo -n` | Outcome |
|---|---|---|---|---|
| 2026-08-19, first GO | absent | absent | password required | stopped; blocker raised |
| 2026-08-19, second GO (post-authorization) | absent | absent | password required | stopped; no change since authorization |

The second check followed the architecture lead's authorization of the one-time privileged
bootstrap (MSG-0008). **The authorization is recorded, but the privileged commands have not been
executed.** Authorization and execution are different things, and only the second changes the host.

State verified on the second check:

```text
$ ls -ld /data/pci-platform
ls: cannot access '/data/pci-platform': No such file or directory

$ command -v docker          -> absent
$ ls -la /etc/docker         -> No such file or directory
$ id -nG                     -> claude sudo users
$ sudo -n true               -> sudo: a password is required
```

Step 1 of the MSG-0008 procedure — `sudo install -d -m 0755 -o claude -g claude /data/pci-platform`
— has not run. Steps 2 and 3 depend on it and therefore cannot proceed. Claude Code cannot perform
step 1: `/data` is `root:root` and `sudo` requires a password this environment must not handle.

Nothing was worked around. No alternative workspace, no temporary location, no piped script, and
no PCI artifact created anywhere on the host, inside `/data` or outside it.

This blocker closes when `docker info --format '{{.DockerRootDir}}'` reports a path under
`/data/docker`, verified directly by Claude Code rather than accepted from a report.

---

## Narrowed 2026-08-19 — workspace provisioned, clone complete

The operator executed step 1 of MSG-0008. `/data/pci-platform` now exists as `claude:claude 0755`
on the `/dev/sdb1` 8.7T `/data` mount, and Claude Code has cloned the repository into it at
`9f19bce`, clean, with the bootstrap script byte-identical to the committed blob
(`ef2a74ff…3525c`).

| Verification log | `/data/pci-platform` | repo clone | Docker | `sudo -n` | Outcome |
|---|---|---|---|---|---|
| first GO | absent | — | absent | password required | stopped |
| second GO | absent | — | absent | password required | stopped |
| third GO | **present, owned by claude** | **cloned, verified** | absent | password required | stopped at step 3 |

This blocker is now narrower than when raised. It is no longer "no workspace and no privilege" —
it is **one privileged command**:

```bash
sudo bash /data/pci-platform/deploy/bootstrap/pci-server-bootstrap.sh
```

Everything that could be done without privilege has been done. Nothing else in WP-0001 can advance
until Docker exists, because AC-01, AC-02, AC-05, and AC-09 all require a running container runtime
and a real PostgreSQL instance.

Closure condition unchanged: `docker info --format '{{.DockerRootDir}}'` reporting a path under
`/data/docker`, verified directly by Claude Code.

---

## RESOLVED — 2026-08-19

**Status: RESOLVED / CLOSED.** The operator executed the authorized bootstrap. Closure condition
verified directly by Claude Code rather than accepted from a report:

```text
$ docker info --format '{{.DockerRootDir}}'
/data/docker

$ docker --version          Docker version 29.1.3, build 29.1.3-0ubuntu3~24.04.2
$ systemctl is-active docker    active
$ id -nG                    claude sudo users docker
$ cat /etc/docker/daemon.json   {"data-root": "/data/docker"}
```

`DockerRootDir` resolves inside `/data/docker`, which was the stated closure condition. `claude` is
in the `docker` group, so no further privilege is required for WP-0001 verification — and none was
used: everything after the bootstrap ran unprivileged.

The verification log's final row: third GO — workspace present, repo cloned, **Docker present,
bootstrap executed** — proceeded to complete WP-0001 verification.
