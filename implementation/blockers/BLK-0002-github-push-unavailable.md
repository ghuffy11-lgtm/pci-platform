# BLK-0002 — GitHub Push Unavailable (Communication Channel Down)

**Status:** OPEN — root cause corrected 2026-08-19, resolution is operator-side
**Severity:** Critical — the mandatory communication channel is non-functional
**Raised:** 2026-08-19
**Work package:** WP-0001

## Issue

`CLAUDE.md` establishes GitHub as the communication channel between Claude Code and the
architecture lead, and requires that blockers, discoveries, and proposed decisions be recorded
there rather than relayed through the user.

**That channel is currently one-way. Commits succeed locally; push fails.**

The architecture lead cannot see MSG-0001, MSG-0002, MSG-0003, BLK-0001, ADR-0015, ADR-0016,
DISC-0001…0003, or the WP-0001 report, because none of them have reached the remote.

## Correction to the original diagnosis

> The first version of this blocker stated that the public key "has never been registered on
> the GitHub account" and classified the fault as a missing authorisation. **That was wrong.**
> It was inferred from the bare `Permission denied (publickey)` message without running a
> verbose handshake. A subsequent `ssh -v` trace disproved it. The corrected analysis follows;
> the erroneous conclusion is retained here deliberately so the record shows what changed.

## Evidence

```text
$ git push origin main
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.
```

Remote: `git@github-pci:ghuffy11-lgtm/pci-platform.git` (SSH host alias `github-pci`, which
resolves to `github.com` with `IdentityFile ~/.ssh/pci_github_ed25519` and `IdentitiesOnly yes`).

Verbose handshake — the decisive lines:

```text
debug1: no identity pubkey loaded from C:/Users/Administrator/.ssh/pci_github_ed25519
debug1: Offering public key: ... ED25519 SHA256:zed3jBUKn8dIOM3K6il7VWqgMmJZ9wjjKksHX+Thh0I
debug1: Server accepts key: ... ED25519 SHA256:zed3jBUKn8dIOM3K6il7VWqgMmJZ9wjjKksHX+Thh0I
debug1: read_passphrase: can't open /dev/tty: No such device or address
debug1: No more authentication methods to try.
```

`Server accepts key` is GitHub confirming the key **is** registered and **does** carry access to
this repository. Authentication then fails one step later, entirely client-side.

Confirmed independently:

```text
$ ssh-keygen -y -P "" -f ~/.ssh/pci_github_ed25519   -> fails: key is passphrase-protected
$ echo $SSH_AUTH_SOCK                                -> unset
$ ssh-add -l                                         -> Could not open a connection to your authentication agent
```

## Root cause

The private key is encrypted with a passphrase. The environment executing `git` is
non-interactive and has no controlling terminal, so OpenSSH cannot prompt for that passphrase,
and no `ssh-agent` is reachable to supply the decrypted key on its behalf. With
`IdentitiesOnly yes` pinning authentication to this single credential, there is no fallback
method and the handshake aborts.

This is a **credential-availability** fault in the execution environment, not an authorisation
fault on the GitHub account. Nothing about the key, the account, or the remote needs to change.

## What is committed but unpushed

| Commit | Contents |
|---|---|
| `9945a00` | `docs(comms)` — this blocker |
| `eabed9b` | `docs(comms)` — all WP-0001 communications, blockers, discoveries, proposed ADRs, report, status |
| `55095d7` | `build(kernel)` — Dockerfile, compose stack, developer documentation |
| `9a18b09` | `feat(kernel)` — WP-0001 kernel implementation and tests |

## Resolution — requires operator action

The passphrase belongs to the operator. Claude Code must not handle it, must not request it in
conversation, and must not write it to any file. Claude Code did not generate, replace, or
register any credential.

**The key must be loaded into an `ssh-agent` that the process running `git` can reach.** Both
halves of that sentence matter: an agent holding the key is not sufficient if `git` cannot see
its socket.

Attempted 2026-08-19: an agent was started at a fixed, shareable socket
(`/tmp/pci-ssh-agent.sock`) so that both an interactive shell and the tool environment could
address the same agent. The operator loaded the key into a *different* agent instance
(pid 1663), whose socket is not present under any temporary directory visible to the tool
environment. The shared agent remains empty (`The agent has no identities`), so the push still
fails.

Remaining options:

**Option A — load the key into the shared agent.** From an interactive Git Bash terminal:

```bash
SSH_AUTH_SOCK=/tmp/pci-ssh-agent.sock ssh-add ~/.ssh/pci_github_ed25519
```

Then `SSH_AUTH_SOCK=/tmp/pci-ssh-agent.sock git push origin main` succeeds from either context.

**Option B — the operator pushes directly** from the terminal whose agent already holds the key:

```bash
git push origin main
```

**Option C — remove the passphrase** from the local key copy. Not recommended: it trades an
operational inconvenience for an at-rest credential weakness on a machine that also holds the
repository.

## Note on the protocol

The repository-as-channel protocol cannot bootstrap itself: a blocker that prevents pushing
cannot be communicated by pushing a blocker file. Reporting this one to the operator directly
is therefore not a violation of the "no technical messenger" rule — it is the only path that
exists, and it concerns an operational credential on the operator's own machine rather than an
architectural decision for the lead.

Once push is restored, this file and every other communication artifact reach the architecture
lead in a single push, and normal protocol resumes.
