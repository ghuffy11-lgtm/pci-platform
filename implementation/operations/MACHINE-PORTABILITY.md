# Machine Portability — What Travels in Git, and What Must Be Recreated

**Purpose:** everything a new machine needs to resume this project, and everything it must **not**
copy. Written 2026-08-29 on operator instruction (**MSG-0183**), on the machine that has been running
the work, so the values below are **read from that machine**, not recalled.
**Authority:** none. This is an operational aid. `CLAUDE.md`, the accepted ADRs, the specifications and
`implementation/operations/CLAUDE-TASKS.md` remain authoritative and are unaffected by anything here.

> **The repository is the project.** A fresh clone carries the constitution, every ADR and
> specification, the architecture records, the full COMMS history, the authoritative queue, every
> checkpoint, and every committed probe with its captured output. **Nothing below adds project
> knowledge — it lists the machine-local scaffolding that a clone deliberately does not carry.**

---

## 1. What a fresh clone already gives you

| | |
|---|---|
| **Governance** | `CLAUDE.md`, `AGENTS.md`, the constitution and governance under `docs/` |
| **Decisions** | `docs/decisions/` — the accepted ADRs, including ADR-0018's Q13 amendment and ADR-0020 + AMD-01 |
| **Architecture** | `implementation/architecture/` — EPA-0001…EPA-0006, the latter carrying §4.6 S1–S11, §4.9 gates, §4.13 N1–N5, §4.16 DA-1…DA-7, §4.18 **N6**, and the evidence sections §4.10–§4.15, §4.17, §4.19 |
| **The queue** | `implementation/operations/CLAUDE-TASKS.md` — task board, task sections, and the COMMS ledger |
| **COMMS** | `implementation/comms/` — every numbered message and `README.md`, the register |
| **State records** | `implementation/status/current.md`, `blockers/`, `discoveries/`, `reports/`, `decisions/` |
| **Checkpoints** | `implementation/operations/checkpoints/` — resumable state per task |
| **Probes** | `implementation/probes/TASK-00xx/` — every harness **and its captured output** |
| **Supervisor** | `supervisor.ps1`, its tests, `README.md`, `runner-settings.json`, `supervisor-config.example.json` |

**Start by reading, in this order:** `CLAUDE.md` → `AGENTS.md` → `implementation/status/current.md` →
`implementation/operations/CLAUDE-TASKS.md` → the active task section → the ADRs and specifications it
references → all OPEN items in `comms/`, `blockers/`, `discoveries/`.

---

## 2. What is NOT in the repository, and must be recreated

**Six things. The first two are configuration, the third is a credential, the fourth is data, the fifth
regenerates itself, and the sixth is a Windows registration.**

### 2.1 `implementation/operations/supervisor/supervisor-config.json` — untracked by design

**Gitignored so a machine's paths and its runner command never enter the repository.**
`supervisor-config.example.json` **is** tracked; copy it and set these values, which are the ones this
machine ran with:

```json
{
  "enabled": true,
  "dryRun": false,
  "repositoryPath": "<absolute path to the clone>",
  "queueRelativePath": "implementation/operations/CLAUDE-TASKS.md",
  "remote": "origin",
  "branch": "main",
  "intervalMinutes": 10,
  "staleRunMinutes": 120,
  "lockTimeoutMinutes": 240,
  "runnerCommand": "<absolute path to claude executable>",
  "runnerArguments": [
    "-p", "<the runner prompt — copy it verbatim from the example file's guidance and this machine's config>",
    "--permission-mode", "acceptEdits",
    "--settings", "<clone>/implementation/operations/supervisor/runner-settings.json"
  ],
  "statePath": "state",
  "logPath": "logs"
}
```

**`enabled: true` and `dryRun: false` are both required before anything starts**, and the README calls
installing and enabling **separate operator decisions**. **Install in dry-run first and read one cycle's
log before going live.**

### 2.2 `.claude/settings.local.json` — the interactive session's permission set

**Globally gitignored** (`**/.claude/settings.local.json`), so it never travels. It is **not secret** —
it is an allowlist — and the entries that matter to this project are:

- `Bash(node *)` — every probe from TASK-0033 onward runs on Node.
- `Bash(py -V)` and `Bash(py implementation/probes/TASK-0043/probe.py*)` — **narrow, and deliberately
  so**. **Arbitrary Python is denied**, which is the standing condition **BLK-0011** describes and
  **MSG-0182 §5** made a rule: **writing a new script into TASK-0043's path to slip under that glob is a
  workaround and is refused.**
- `Read(//c/Users/Administrator/.ssh/**)`, `Bash(ssh-add -l)`, `ssh -T git@github-pci`,
  `ssh-keygen -lf …` — used to **diagnose** the SSH transport during BLK-0007, not to use it.
- The `git` entries used for ordinary commit and push.

**Recreate deliberately and no wider than needed.** MSG-0083's precedent governs: **a grant is scoped to
what authorized it, and a standing rule broader than its authorization is itself a finding.**

### 2.3 The GitHub SSH key and its host alias — a CREDENTIAL, never in the repository

**Do not copy the private key into the clone, into any document, or into a chat.** The alias this
machine used is:

```
Host github-pci
    HostName github.com
    User git
    IdentityFile ~/.ssh/pci_github_ed25519
    IdentitiesOnly yes
```

**On the new machine:** either move the existing key by a secure channel the operator controls, or
**generate a new key and add it to the GitHub account**, then recreate the alias. **The remote is
`git@github-pci:ghuffy11-lgtm/pci-platform.git`** — an alias, so **a clone will fail until the alias
exists.** Use `git remote set-url origin git@github.com:ghuffy11-lgtm/pci-platform.git` if you prefer
the direct form.

> **BLK-0007 is the precedent worth knowing before diagnosing any failure here:** SSH once failed at
> `kex_exchange_identification` on ports 22 and 443 while HTTPS returned 200. **That is a transport
> fault, not a credential fault** — it fails *before* authentication — and the correct response was to
> record it and wait, not to switch the remote to HTTPS.

### 2.4 The A-SURVEY corpus — outside the repository by decision

**`D:\Work\pci-corpus\` on this machine.** **MSG-0080 requires it to stay outside the repository**, and
it is not committed:

| File | Size | What it is |
|---|---|---|
| `plan.pdf` | **641,807 bytes** | 45-page English, text-native, PDF 1.7, Word 2016 — the approved/synthetic A-SURVEY corpus |
| `سياسة التعافي.pdf` | **119,055 bytes** | Arabic, **text-native and D14-admissible**, WeasyPrint |

**Re-supply these on the new machine if corpus work resumes**, at a path the runner is granted to read —
**MSG-0083's narrow `additionalDirectories` grant is the mechanism**, and **BLK-0010** records what
happens without it. **They are not needed for any current task**: nothing in the queue reads the corpus
today.

### 2.5 `state/` and `logs/` — regenerate; do NOT copy

**`state/heartbeat.json`, `state/runner.lock` and `logs/*` are machine-local and gitignored.**

**Copying them would be worse than losing them.** A `runner.lock` carries a **pid from another machine**;
a copied heartbeat asserts a cycle that never ran here. **MSG-0152 is the precedent**: a heartbeat is
evidence about the moment and machine that wrote it and **nothing later** — its age is the instrument
that distinguishes *"the cycle ran and found nothing"* from *"no cycle ran"*.

### 2.6 The Windows scheduled task — recreate with the script, not by hand

```
powershell -NoProfile -ExecutionPolicy Bypass -File .\supervisor.ps1 -Install
```

**Registers `PCI-Execution-Supervisor` on a 10-minute interval. Installing does not enable.**

**Read MSG-0143 and MSG-0152 before trusting it:** the **config's `enabled: true` and the scheduled
task's state are two independent switches**, and a live-looking config with a `Disabled` task means
**nothing fires**. **Task Scheduler drives every cycle** — each cycle is its own process — and a cycle
that starts a runner **stays alive monitoring it**, which is why the heartbeat advances off-cadence
during a run.

---

## 3. Toolchain the probes assume

| | On this machine | Why it matters |
|---|---|---|
| **Node** | **v24.15.0** | `node:sqlite` embeds **SQLite 3.51.3**; every probe from TASK-0033 on runs on it. **No install, no PATH change, no Docker.** |
| **Python** | **3.14.5**, reached through the **`py` launcher** | The second E4 subject, **SQLite 3.50.4** via the `sqlite3` module. **`python` and `python3` are absent from PATH — `py` is not.** |
| **Docker / psql / sqlite3 CLI / java / dotnet / go** | **absent** | Recorded so their absence is not rediscovered. **Classes S, V and K were never measured for this reason.** |

> **The recurring trap, recorded four times in this project:** `python` absent while Python is present;
> "no SQLite" that was really "no `sqlite3` CLI"; "no Docker, no Python" that was a `PATH` artefact; and
> a config's `enabled: true` read as evidence something was calling it. **Check the launcher, and check
> the mechanism that invokes a component, before recording an absence.**

---

## 4. Verifying the new machine before doing any work

```text
git clone <remote> && cd pci-platform
git log --oneline -1                 # compare with origin/main
git status --porcelain               # expect empty
node --version                       # expect a runtime carrying node:sqlite
node implementation/probes/TASK-0048/probe.mjs | tail -20    # expect RUN VALIDITY: VALID
```

**Running a committed probe is the cheapest end-to-end check available** — it exercises the runtime, the
filesystem and the harness in one step, **and it changes nothing**: probes write to the OS temp
directory and remove it.

**Then run the mandatory startup checklist in `CLAUDE.md`.** **Do not rely on this file for state** — it
was accurate when written and says nothing about what has happened since.

---

## 5. What must never travel

- **The private SSH key**, any token, and any passphrase.
- **`state/runner.lock` and `state/heartbeat.json`** — they would assert another machine's facts.
- **The corpus, into the repository** — MSG-0080 puts it outside, and BLK-0008 records the near-miss
  where it briefly landed inside, untracked, **one `git add -A` from permanent history**.
- **Anything under `/data` on the PCI server.** That host is a **separate boundary** governed by
  `docs/operations/pci-server-bootstrap.md`: the workspace is `/data/pci-platform`, all runtime state
  lives under `/data/docker`, and **`~/.ssh` is infrastructure credentials, not a project artefact**.
  **This development machine is not that host**, and nothing in this file authorizes touching it.
