# PCI Architecture ↔ Claude Code Communication

This directory is the asynchronous communication channel between Claude Code and the PCI architecture lead.

## Message Register

Every message in this directory, newest first. Each row links to the file. Claude Code updates this
register whenever a message is created or its status changes — a message that is not listed here is
a defect in the record, not a missing message.

| ID | Subject | Status | File |
|---|---|---|---|
| **MSG-0021** | **Which MSG-0020 stands? Two contradictory completion decisions** | **OPEN** — blocking TASK-0009 | [MSG-0021-msg-0020-conflict.md](MSG-0021-msg-0020-conflict.md) |
| MSG-0020 (a) | WP-0001 completion decision — **NOT COMPLETE**, authorizes TASK-0012 | **CONFLICTED** — see BLK-0005 | [MSG-0020-wp-0001-completion-decision.md](MSG-0020-wp-0001-completion-decision.md) |
| MSG-0020 (b) | WP-0001 completion decision — **COMPLETE**, no remediation | **CONFLICTED** — see BLK-0005 | [MSG-0020-wp0001-completion-decision.md](MSG-0020-wp0001-completion-decision.md) |
| **MSG-0019** | **TASK-0007 / TASK-0008 complete — WP-0001 ready for the completion decision** | **OPEN** | [MSG-0019-task-0007-0008-complete.md](MSG-0019-task-0007-0008-complete.md) |
| MSG-0018 | Authorize TASK-0007 | DECIDED — executed, G4 passed | [MSG-0018-authorize-task-0007.md](MSG-0018-authorize-task-0007.md) |
| MSG-0017 | **TASK-0006 complete — WP-0001 is reproducible; TASK-0007 authorization required** | **OPEN** | [MSG-0017-task-0006-complete.md](MSG-0017-task-0006-complete.md) |
| MSG-0016 | Authorize TASK-0006 (destructive volume re-init) | DECIDED — executed, G3 passed | [MSG-0016-authorize-task-0006.md](MSG-0016-authorize-task-0006.md) |
| MSG-0015 | **TASK-0004 / TASK-0005 complete; TASK-0006 authorization required** | **OPEN** — awaiting destructive-volume authorization | [MSG-0015-task-0004-0005-complete.md](MSG-0015-task-0004-0005-complete.md) |
| MSG-0014 | Queue authorization reconciliation | DECIDED — reconciled in `de35bf4` | [MSG-0014-queue-ready-authorized.md](MSG-0014-queue-ready-authorized.md) |
| MSG-0013 | Architecture review checkpoint | DECIDED — acted on | [MSG-0013-architecture-review-checkpoint.md](MSG-0013-architecture-review-checkpoint.md) |
| MSG-0012 | Architecture lead decisions: TASK-0004 and TASK-0005 | DECIDED — both executed | [MSG-0012-architecture-lead-decisions-task-0004-0005.md](MSG-0012-architecture-lead-decisions-task-0004-0005.md) |
| MSG-0011 | Execution Supervisor — built, tested, not installed | **OPEN** — awaiting the install/enable decision | [MSG-0011-execution-supervisor.md](MSG-0011-execution-supervisor.md) |
| MSG-0010 | Phase 0 — execution control, roadmap, queue, recovery | **CLOSED** — TASK-0004 / TASK-0005 authorized by MSG-0012 and executed | [MSG-0010-phase-0-execution-control.md](MSG-0010-phase-0-execution-control.md) |
| MSG-0008 | Authorized one-time privileged bootstrap — exact operator procedure | **CLOSED** — executed and verified 2026-08-19 | [MSG-0008-authorized-bootstrap-command.md](MSG-0008-authorized-bootstrap-command.md) |
| MSG-0009 | Permanent rule added: Documentation Is Mandatory | DECIDED — applied | [MSG-0009-documentation-is-mandatory.md](MSG-0009-documentation-is-mandatory.md) |
| MSG-0007 | Permanent operating rule hardening | DECIDED — applied | [MSG-0007-operating-rule-hardening.md](MSG-0007-operating-rule-hardening.md) |
| MSG-0006 | Absolute host file boundary (architecture lead override) | DECIDED — applied, contract v0.2 | [MSG-0006-absolute-host-file-boundary.md](MSG-0006-absolute-host-file-boundary.md) |
| MSG-0005 | Architecture lead decisions (ADR-0015, ADR-0016, repository layout) | DECIDED — acted on | [MSG-0005-architecture-lead-decisions.md](MSG-0005-architecture-lead-decisions.md) |
| MSG-0004 | Prepared repository corrections for MSG-0003 | CLOSED — applied | [MSG-0004-prepared-repository-corrections.md](MSG-0004-prepared-repository-corrections.md) |
| MSG-0003 | Repository layout authority and document corrections | CLOSED — decided by MSG-0005 | [MSG-0003-repository-layout-and-document-corrections.md](MSG-0003-repository-layout-and-document-corrections.md) |
| MSG-0002 | Kernel implementation stack selection | CLOSED — ADR-0015 ratified by MSG-0005 | [MSG-0002-kernel-runtime-stack.md](MSG-0002-kernel-runtime-stack.md) |
| MSG-0001 | Authorized execution host and persistent storage boundary | ANSWERED — bootstrap contract accepted | [MSG-0001-execution-host-and-storage-boundary.md](MSG-0001-execution-host-and-storage-boundary.md) |

## ACTION REQUIRED — MSG-0011 (Execution Supervisor)

Built, tested (17/17), **not installed and not enabled**. Three independent settings keep it inert:
`enabled: false`, `dryRun: true`, and an empty `runnerCommand`.

The decision is not really about a scheduler. The supervisor itself only reads files, fetches, and
starts one local process — but what it starts is a full Claude session with the developer's
credentials. **Enabling it means consenting to unattended sessions acting on authorized queue
tasks.** That is why it ships disabled.

Detail: [`MSG-0011-execution-supervisor.md`](MSG-0011-execution-supervisor.md).
Implementation and docs: [`../operations/supervisor/`](../operations/supervisor/README.md).

## ACTION REQUIRED — MSG-0015 (TASK-0006 authorization)

TASK-0004 and TASK-0005 are **COMPLETE** (gates G1 and G2 passed, 2026-08-19), authorized by
MSG-0012 and reconciled per MSG-0013 / MSG-0014.

**One decision now stands between WP-0001 and a reproducible stack:**

| Decision | Task |
|---|---|
| **Explicit authorization to destroy `pci-kernel_postgres-data`** (`docker compose down -v`) so the stack can be rebuilt from scratch and gate G3 evaluated | TASK-0006 |
| Optionally authorize `*.md` line-ending normalisation | TASK-0003 |
| Whether to install/enable the Execution Supervisor | TASK-0010 / MSG-0011 |

The volume holds only TASK-0001 verification data — nothing irreplaceable — but the operation is
destructive and irreversible, so Rule 9 requires the authorization to be explicit rather than
inferred from it being the obvious next step.

Granting it runs TASK-0006 -> TASK-0007 -> TASK-0008 as one continuous authorized chain, stopping at
TASK-0009, which is the architecture lead's decision.

Detail: [`MSG-0015-task-0004-0005-complete.md`](MSG-0015-task-0004-0005-complete.md).

Detail: [`MSG-0010-phase-0-execution-control.md`](MSG-0010-phase-0-execution-control.md).
Roadmap and queue: [`../operations/ROADMAP.md`](../operations/ROADMAP.md),
[`../operations/CLAUDE-TASKS.md`](../operations/CLAUDE-TASKS.md).

## Bootstrap — closed

**MSG-0008 is CLOSED.** The operator executed the authorized bootstrap on 2026-08-19 and Claude Code
verified the result directly (`DockerRootDir` = `/data/docker`). WP-0001 verification followed and
completed: 229 tests passing, all ten acceptance criteria met.

Two defects found during that verification are recorded as DISC-0007 and DISC-0008, with proposed
tasks TASK-0004 and TASK-0005 in `implementation/operations/CLAUDE-TASKS.md`. **Neither is
authorized**; both await the architecture lead.

The historical bootstrap procedure is retained below for the record.

Full detail, rationale, and verification steps:
[`MSG-0008-authorized-bootstrap-command.md`](MSG-0008-authorized-bootstrap-command.md).

The procedure, reproduced here so it is readable without opening the message. All three commands
run **on the PCI server**, as the `claude` account, in one interactive SSH session where `sudo` can
prompt for the operator's password:

```bash
# 1. privileged — create the mandatory workspace
sudo install -d -m 0755 -o claude -g claude /data/pci-platform

# 2. unprivileged — place the repository copy inside /data
#    (connect with `ssh -A` so the forwarded agent provides GitHub access,
#     or tell Claude Code that step 1 is done and it will do this itself)
git clone git@github.com:ghuffy11-lgtm/pci-platform.git /data/pci-platform

# 3. privileged, one time — the authorized bootstrap, at the authorized path
sudo bash /data/pci-platform/deploy/bootstrap/pci-server-bootstrap.sh
```

Script: [`deploy/bootstrap/pci-server-bootstrap.sh`](../../deploy/bootstrap/pci-server-bootstrap.sh)
— idempotent, **executed successfully 2026-08-19**, writes only to `/data/pci-platform`, `/data/docker`,
`/etc/docker/daemon.json`, and apt package state.

Two things to decide consciously before running it: it adds `claude` to the `docker` group, which
on this host is equivalent to root; and `/data` already holds a pre-existing non-PCI layout that
the script neither reads nor modifies — `/data/postgres` is **not** the PCI database directory.

## Protocol

- Claude creates `MSG-XXXX-<short-name>.md` when architectural direction, clarification, or a blocking decision is required.
- Claude sets `Status: OPEN` and records the work package, evidence, options, recommendation, and exact question.
- Claude adds the message to the register above in the same commit that creates it.
- The architecture lead reads open messages from GitHub and responds in the same file or a sequential response file.
- Claude must read the response before continuing.
- Accepted architectural decisions are promoted into ADRs/specifications when appropriate.

## Rule

The user is not a technical relay between Claude Code and the architecture lead. GitHub is the shared engineering communication channel.
