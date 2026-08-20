# PCI Architecture ↔ Claude Code Communication

This directory is the asynchronous communication channel between Claude Code and the PCI architecture lead.

## Message Register

Every message in this directory, newest first. Each row links to the file. Claude Code updates this
register whenever a message is created or its status changes — a message that is not listed here is
a defect in the record, not a missing message.

| ID | Subject | Status | File |
|---|---|---|---|
| **MSG-0030** | **MSG-0028 decisions 2 and 3 applied; decision 1 command is a no-op here** | **OPEN — DECISION REQUIRED** | [MSG-0030-refresh-command-ineffective.md](MSG-0030-refresh-command-ineffective.md) |
| **MSG-0029** | **Supervisor start path — diagnosis, fixes, first successful launch** | **OPEN** — informational; start path now PROVEN | [MSG-0029-supervisor-start-path-diagnosis.md](MSG-0029-supervisor-start-path-diagnosis.md) |
| **MSG-0028** | **TASK-0003 implemented but not complete — one permission grant required** | **OPEN — DECISION REQUIRED** | [MSG-0028-task-0003-implemented-not-complete.md](MSG-0028-task-0003-implemented-not-complete.md) |
| MSG-0027 | TASK-0003 authorization — line-ending normalization only | DECIDED — executed 2026-08-20, see MSG-0028 | [MSG-0027-task-0003-authorization.md](MSG-0027-task-0003-authorization.md) |
| **MSG-0026** | **Execution Supervisor ENABLED — permission mode determined and verified** | **OPEN** — start path now **PROVEN** by TASK-0003; see MSG-0028 §4 | [MSG-0026-supervisor-enabled.md](MSG-0026-supervisor-enabled.md) |
| MSG-0025 | Execution Supervisor installed and dry-run verified — NOT enabled | **CLOSED** — answered by MSG-0026 | [MSG-0025-supervisor-enablement-status.md](MSG-0025-supervisor-enablement-status.md) |
| MSG-0024 | Execution Supervisor enable decision | DECIDED — enablement authorized | [MSG-0024-execution-supervisor-enable-decision.md](MSG-0024-execution-supervisor-enable-decision.md) |
| **MSG-0023** | **Correct TASK-0009 boundary — no TASK-0012 in WP-0001 path** | **DECIDED** | [MSG-0023-correct-task-0009-boundary.md](MSG-0023-correct-task-0009-boundary.md) |
| MSG-0022 | Resolve MSG-0020 conflict — WP-0001 COMPLETE | **DECIDED — superseded/clarified by MSG-0023** | [MSG-0022-resolve-msg-0020-conflict.md](MSG-0022-resolve-msg-0020-conflict.md) |
| MSG-0021 | Which MSG-0020 stands? Two contradictory completion decisions | **CLOSED — resolved by MSG-0022 and clarified by MSG-0023** | [MSG-0021-msg-0020-conflict.md](MSG-0021-msg-0020-conflict.md) |
| MSG-0020 (a) | WP-0001 completion decision — NOT COMPLETE, authorizes TASK-0012 | **SUPERSEDED — MSG-0023** | [MSG-0020-wp-0001-completion-decision.md](MSG-0020-wp-0001-completion-decision.md) |
| MSG-0020 (b) | WP-0001 completion decision — COMPLETE, no remediation | **SURVIVING COMPLETION RULING — clarified by MSG-0023** | [MSG-0020-wp0001-completion-decision.md](MSG-0020-wp0001-completion-decision.md) |
| MSG-0019 | TASK-0007 / TASK-0008 complete — WP-0001 ready for the completion decision | OPEN | [MSG-0019-task-0007-0008-complete.md](MSG-0019-task-0007-0008-complete.md) |
| MSG-0018 | Authorize TASK-0007 | DECIDED — executed, G4 passed | [MSG-0018-authorize-task-0007.md](MSG-0018-authorize-task-0007.md) |
| MSG-0017 | TASK-0006 complete — WP-0001 is reproducible | OPEN | [MSG-0017-task-0006-complete.md](MSG-0017-task-0006-complete.md) |
| MSG-0016 | Authorize TASK-0006 | DECIDED — executed, G3 passed | [MSG-0016-authorize-task-0006.md](MSG-0016-authorize-task-0006.md) |
| MSG-0015 | TASK-0004 / TASK-0005 complete; TASK-0006 authorization required | OPEN | [MSG-0015-task-0004-0005-complete.md](MSG-0015-task-0004-0005-complete.md) |
| MSG-0014 | Queue authorization reconciliation | DECIDED | [MSG-0014-queue-ready-authorized.md](MSG-0014-queue-ready-authorized.md) |
| MSG-0013 | Architecture review checkpoint | DECIDED | [MSG-0013-architecture-review-checkpoint.md](MSG-0013-architecture-review-checkpoint.md) |
| MSG-0012 | Architecture lead decisions: TASK-0004 and TASK-0005 | DECIDED | [MSG-0012-architecture-lead-decisions-task-0004-0005.md](MSG-0012-architecture-lead-decisions-task-0004-0005.md) |
| MSG-0011 | Execution Supervisor — built, tested, not installed | OPEN — awaiting install/enable decision | [MSG-0011-execution-supervisor.md](MSG-0011-execution-supervisor.md) |
| MSG-0010 | Phase 0 — execution control, roadmap, queue, recovery | CLOSED | [MSG-0010-phase-0-execution-control.md](MSG-0010-phase-0-execution-control.md) |
| MSG-0009 | Permanent rule added: Documentation Is Mandatory | DECIDED — applied | [MSG-0009-documentation-is-mandatory.md](MSG-0009-documentation-is-mandatory.md) |
| MSG-0008 | Authorized one-time privileged bootstrap | CLOSED — executed and verified | [MSG-0008-authorized-bootstrap-command.md](MSG-0008-authorized-bootstrap-command.md) |
| MSG-0007 | Permanent operating rule hardening | DECIDED — applied | [MSG-0007-operating-rule-hardening.md](MSG-0007-operating-rule-hardening.md) |
| MSG-0006 | Absolute host file boundary | DECIDED — applied, contract v0.2 | [MSG-0006-absolute-host-file-boundary.md](MSG-0006-absolute-host-file-boundary.md) |
| MSG-0005 | Architecture lead decisions | DECIDED — acted on | [MSG-0005-architecture-lead-decisions.md](MSG-0005-architecture-lead-decisions.md) |
| MSG-0004 | Prepared repository corrections | CLOSED — applied | [MSG-0004-prepared-repository-corrections.md](MSG-0004-prepared-repository-corrections.md) |
| MSG-0003 | Repository layout authority and document corrections | CLOSED — decided by MSG-0005 | [MSG-0003-repository-layout-and-document-corrections.md](MSG-0003-repository-layout-and-document-corrections.md) |
| MSG-0002 | Kernel implementation stack selection | CLOSED — ADR-0015 ratified | [MSG-0002-kernel-runtime-stack.md](MSG-0002-kernel-runtime-stack.md) |
| MSG-0001 | Authorized execution host and persistent storage boundary | ANSWERED | [MSG-0001-execution-host-and-storage-boundary.md](MSG-0001-execution-host-and-storage-boundary.md) |

## ACTION REQUIRED — MSG-0028 (TASK-0003)

TASK-0003 applied its authorized change and verified it changed **zero** committed content. It stopped
short of refreshing 152 `*.md` files already on the authoring workstation's disk, because the three
commands that could do it were refused by the unattended runner's permission layer and Rule 2 forbids
substituting another mechanism.

**It also could not push its own commit.** `git push` is not on the runner allowlist, so `93d7067` —
including MSG-0028 itself — exists locally only until someone runs `git push origin main`. An
unattended session can currently complete authorized work and be unable to deliver any record of it.

Three decisions: which refresh option (A — you run one command; B — widen the runner allowlist; C —
accept the residue); whether a supervisor session should abort when HEAD moves mid-run; and whether
an unattended runner may push at all.

Detail: [`MSG-0028-task-0003-implemented-not-complete.md`](MSG-0028-task-0003-implemented-not-complete.md).

## ACTION REQUIRED — MSG-0011 (Execution Supervisor)

Built, tested (17/17), **not installed and not enabled**. Three independent settings keep it inert: `enabled: false`, `dryRun: true`, and an empty `runnerCommand`.

Enabling it means consenting to unattended sessions acting on authorized queue tasks. It remains a separate operator/architecture decision.

Detail: [`MSG-0011-execution-supervisor.md`](MSG-0011-execution-supervisor.md).
Implementation and docs: [`../operations/supervisor/`](../operations/supervisor/README.md).

## Bootstrap — closed

**MSG-0008 is CLOSED.** The operator executed the authorized bootstrap on 2026-08-19 and Claude Code verified `DockerRootDir` = `/data/docker`. WP-0001 verification followed and completed: 229 tests passing, all ten acceptance criteria met.

## Protocol

- Claude creates `MSG-XXXX-<short-name>.md` when architectural direction, clarification, or a blocking decision is required.
- Claude sets `Status: OPEN` and records the work package, evidence, options, recommendation, and exact question.
- Claude adds the message to the register above in the same commit that creates it.
- The architecture lead reads open messages from GitHub and responds in the same file or a sequential response file.
- Claude must read the response before continuing.
- Accepted architectural decisions are promoted into ADRs/specifications when appropriate.

## Rule

The user is not a technical relay between Claude Code and the architecture lead. GitHub is the shared engineering communication channel.
