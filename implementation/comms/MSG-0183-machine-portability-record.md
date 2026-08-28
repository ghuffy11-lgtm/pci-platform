# MSG-0183 — Operator Instruction: Sync Everything and Make the Project Resumable Elsewhere

**From:** Claude Code (interactive session, recording an operator instruction)
**To:** PCI Architecture Lead
**Date:** 2026-08-29
**Status:** **OPEN** — record. **No task authorized, no architecture changed.**
**Authority:** operator instruction, recorded verbatim below | **Related:** MSG-0080 (corpus outside the repo), MSG-0083 (narrow grants), MSG-0143 / MSG-0152 (the two supervisor switches), BLK-0007, BLK-0008, BLK-0010, BLK-0011

---

## 1. The instruction, as given

> **"we need to transfer and sync all information to github, i will move all this what we did to another
> location, make sure you have transfer all necessary info to start this project from here in another
> server"**

**Recorded before acting**, as `CLAUDE.md` requires of a conversational instruction that directs work.

## 2. What was already true, verified rather than assumed

**The repository was fully synchronized before anything was written.**

```text
local HEAD = origin/main = fde6302
git rev-list --left-right --count origin/main...HEAD   ->   0   0
git status --porcelain                                 ->   empty
```

**Nothing was unpushed, and nothing tracked was uncommitted.** **No work was at risk**, which is the
first thing the instruction asked about.

## 3. What was delivered

**One document: `implementation/operations/MACHINE-PORTABILITY.md`.** It lists what a fresh clone
already carries, **the six things it deliberately does not**, the toolchain the probes assume, a
four-command verification for a new machine, and what must never travel.

**It adds no project knowledge and no authority.** **The repository is the project** — the constitution,
the ADRs, the architecture records, the full COMMS history, the queue, every checkpoint and every probe
**with its captured output** are already in it. What was missing was a written account of the
**machine-local scaffolding around** it, which existed only in this machine's configuration and in the
history of a dozen COMMS records.

## 4. The six things a clone does not carry

| | What | Why it is not in Git |
|---|---|---|
| 1 | `supervisor-config.json` | **untracked by design** so a machine's paths and runner command never enter the repository; `supervisor-config.example.json` **is** tracked |
| 2 | `.claude/settings.local.json` | **globally gitignored**; an allowlist, **not a secret**, but it must be recreated **no wider than needed** |
| 3 | **The SSH key and the `github-pci` host alias** | **a credential.** The remote is an **alias**, so **a clone fails until the alias exists** |
| 4 | **The A-SURVEY corpus** | **MSG-0080 puts it outside the repository**, and **BLK-0008** records the near-miss where it briefly landed inside, **one `git add -A` from permanent history** |
| 5 | `state/` and `logs/` | **regenerate; copying them is worse than losing them** — a `runner.lock` carries **another machine's pid**, and a copied heartbeat asserts a cycle that never ran |
| 6 | The Windows scheduled task | recreated by `supervisor.ps1 -Install`; **installing does not enable** |

## 5. Three things the document records because rediscovering them is expensive

**The two supervisor switches.** **The config's `enabled: true` and the scheduled task's state are
independent**, and a live-looking config with a `Disabled` task means **nothing fires** — MSG-0143 got
that wrong first, and MSG-0152 established the model from the supervisor's own log.

**The `py` grant's exact narrowness.** Two entries — `py -V` and TASK-0043's probe path — so **arbitrary
Python remains denied**, which is **BLK-0011's standing condition**. **MSG-0182 §5 made the
corresponding rule**: writing a new script into that path to slip under the glob **is a workaround and
is refused.**

**The absences, with their causes.** `python` absent while Python is present; "no SQLite" that was "no
`sqlite3` CLI"; "no Docker, no Python" that was a `PATH` artefact; a config's self-reported readiness
read as evidence something was calling it. **Four instances of one error — check the launcher, and check
the mechanism that invokes a component, before recording an absence.**

## 6. What this does NOT do

- **No task is authorized or marked READY.** **The queue is unchanged**, and **no task was READY before
  this instruction or after it.**
- **No architecture, ADR, gate, criterion or verdict is touched.** `git diff --name-only docs/` is
  **empty**.
- **Nothing is selected, adopted, deployed, implemented or cleared.** **Ten probes have cleared
  nothing**, and this record changes none of that.
- **No credential was copied, printed or committed**, and **no corpus file entered the repository** —
  both verified against the staged set before the commit.
- **The PCI server was not touched.** That host is a separate boundary under
  `docs/operations/pci-server-bootstrap.md`, and **this development machine is not it.**

## 7. State

- **No task is READY.** The next action is the Architecture Lead's.
- **The repository is fully synchronized**, and after this commit the new document is part of it.
- **Open for the Lead:** **Q21**, **Q17**, **Q14**, **MSG-0060**, and whatever MSG-0182 left open.
- **No blocker is open** except the standing **BLK-0011** condition for **unattended** tasks needing
  `py`, which is unchanged by this record.
