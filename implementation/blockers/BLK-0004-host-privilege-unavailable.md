# BLK-0004 — No Privilege to Bootstrap the Authorized Host

**Status:** OPEN
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
