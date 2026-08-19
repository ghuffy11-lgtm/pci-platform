# BLK-0002 — GitHub Push Unavailable (Communication Channel Down)

**Status:** OPEN
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

## Evidence

```text
$ git push origin main
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.
```

Remote: `git@github-pci:ghuffy11-lgtm/pci-platform.git` (SSH host alias `github-pci`).

Diagnosis — the key exists and is offered, but the server rejects it:

```text
debug1: identity file C:/Users/Administrator/.ssh/pci_github_ed25519 type 2
debug1: Offering public key: ... ED25519 SHA256:zed3jBUKn8dIOM3K6il7VWqgMmJZ9wjjKksHX+Thh0I
debug1: Authentications that can continue: publickey
git@github.com: Permission denied (publickey).
```

The key pair was created 2026-08-19 08:49 and has never been registered on the GitHub account.
This is a missing authorisation, not a missing or malformed key.

A second issue was found and resolved locally: no Git commit identity was configured in either
local or global scope, so `git commit` refused to run at all. Resolved by setting **local**
repository identity to match this repository's existing commit author
(`ghuffy11-lgtm <ghuffy11@gmail.com>`). No global Git configuration was modified. If that
attribution is wrong, amend with `git commit --amend --reset-author`.

## What is committed but unpushed

| Commit | Contents |
|---|---|
| `eabed9b` | `docs(comms)` — all WP-0001 communications, blockers, discoveries, proposed ADRs, report, status |
| `55095d7` | `build(kernel)` — Dockerfile, compose stack, developer documentation |
| `9a18b09` | `feat(kernel)` — WP-0001 kernel implementation and tests |

## Resolution — requires operator action

Only the account holder can authorise the key. Claude Code must not, and did not, attempt to
modify GitHub account settings or generate replacement credentials.

**Option A — register the existing key (recommended).** Add this public key as a deploy key
with write access on `ghuffy11-lgtm/pci-platform`, or as an account SSH key:

```text
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIA2Vc13mSAXGm80KjX551LfHJmZRIfkR5WZ9OGiMC107 pci-platform-github
```

Fingerprint: `SHA256:zed3jBUKn8dIOM3K6il7VWqgMmJZ9wjjKksHX+Thh0I`

Then verify and push:

```bash
ssh -T git@github-pci          # expect: "Hi ghuffy11-lgtm! You've successfully authenticated"
git push origin main
```

**Option B — authenticate over HTTPS** with a personal access token carrying `repo` scope.
Note that ADR-0009 forbids committing credentials; a token must be supplied through a
credential helper or the environment, never written into a tracked file.

## Note on the protocol

The repository-as-channel protocol cannot bootstrap itself: a blocker that prevents pushing
cannot be communicated by pushing a blocker file. Reporting this one to the operator directly
is therefore not a violation of the "no technical messenger" rule — it is the only path that
exists, and it concerns an operational credential on the operator's own machine rather than an
architectural decision for the lead.

Once push is restored, this file and every other communication artifact reach the architecture
lead in a single push, and normal protocol resumes.
