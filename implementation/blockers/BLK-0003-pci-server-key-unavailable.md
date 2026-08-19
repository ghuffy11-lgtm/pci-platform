# BLK-0003 — PCI Server Key Cannot Be Unlocked From the Tool Environment

**Status:** OPEN
**Severity:** High — blocks the WP-0001 host verification authorized by MSG-0005
**Raised:** 2026-08-19
**Work package:** WP-0001 — PCI Kernel Foundation
**Related:** BLK-0001 (host not yet bootstrapped), BLK-0002 (same failure mode, GitHub key)

## Issue

MSG-0005 authorized resuming WP-0001 on the authorized Ubuntu PCI server. The repository
corrections it required are committed and pushed (`fb49369`). The next step — connecting to the
host to bootstrap it — cannot be performed.

The host is correctly configured and reachable. **The credential cannot be unlocked.**

## Evidence

Host resolved from the deployment environment configuration in `~/.ssh/config`, as
`docs/operations/pci-server-bootstrap.md` describes. The address is deliberately not recorded
here, consistent with that contract.

```text
$ ssh pci_server 'echo ok'
claude@<pci-server>: Permission denied (publickey,password).
```

Verbose handshake:

```text
debug1: identity file .../pci_server_ed25519 type 2
debug1: no identity pubkey loaded from .../pci_server_ed25519
debug1: Offering public key: ... ED25519 SHA256:j9Vfk1HSchWjCxvjyMTfQitg3tTT5JU4iGOuLWLhWXo
debug1: Server accepts key: ... ED25519 SHA256:j9Vfk1HSchWjCxvjyMTfQitg3tTT5JU4iGOuLWLhWXo
claude@<pci-server>: Permission denied (publickey,password).
```

Confirmed independently:

```text
$ ssh-keygen -y -P "" -f ~/.ssh/pci_server_ed25519   -> PASSPHRASE-PROTECTED
$ SSH_AUTH_SOCK=/tmp/pci-ssh-agent.sock ssh-add -l   -> The agent has no identities
```

## Root cause

`Server accepts key` means the host has already authorized this key for the `claude` account.
Authorization is not the problem. The private key is passphrase-protected, the tool environment
has no controlling terminal on which OpenSSH can prompt, and no reachable `ssh-agent` holds the
decrypted key. Authentication therefore aborts client-side.

This is the **same failure mode as BLK-0002**, on a different key. BLK-0002 was diagnosed wrongly
at first — as a missing GitHub registration — and the lesson recorded at its closure was that a
bare authentication error is not a diagnosis. That lesson was applied here: the verbose handshake
was run first, and it shows the credential being accepted before the client gives up.

Note that BLK-0002 was resolved by removing the passphrase from the GitHub key
(`pci_github_ed25519`, with the encrypted original kept as `.backup`). The server key
`pci_server_ed25519` was not changed and still carries its passphrase.

## What is NOT blocked

Everything that does not require the host is complete:

- MSG-0005 corrections applied, committed, pushed (`fb49369`).
- ADR-0015 and ADR-0016 ratification recorded.
- Kernel: typecheck clean, 102 unit + 101 contract tests passing.
- Repository clean and synchronized with `origin/main`.

## What IS blocked

The entire remaining WP-0001 verification, which by definition requires the host:

| AC | Blocked work |
|---|---|
| AC-01 | Container image build |
| AC-02 | Database initialization from migrations |
| AC-05 | Tenant isolation under real PostgreSQL RLS |
| AC-09 | Integration test tier |

Also blocked: DISC-0004 (compose storage boundary correction, to be verified on the host) and the
ADR-0016 FORCE RLS / non-BYPASSRLS verification obligations.

## Resolution — requires operator action

The passphrase belongs to the operator. Claude Code must not handle it, request it in
conversation, or write it to any file, and has not done so.

**Option A — load the key into the shared agent** (preferred; the passphrase stays on the key):

```bash
SSH_AUTH_SOCK=/tmp/pci-ssh-agent.sock ssh-add ~/.ssh/pci_server_ed25519
```

The agent at that socket is already running and reachable from the tool environment.

**Option B — remove the passphrase**, as was done for the GitHub key:

```bash
cp ~/.ssh/pci_server_ed25519 ~/.ssh/pci_server_ed25519.backup
ssh-keygen -p -f ~/.ssh/pci_server_ed25519
```

This weakens an at-rest credential that grants access to the PCI server, which is a materially
larger exposure than the GitHub key represented. Option A is preferred for that reason. This is an
operator security decision, not an implementation one.

**Verification once either is done:**

```bash
ssh pci_server 'hostname; whoami; . /etc/os-release && echo "$PRETTY_NAME"'
```

## Note

This is an operational credential issue on the operator's own machine. It is not an architectural
question, and no architecture-lead decision is required or requested. WP-0001 holds here until the
credential is available.
