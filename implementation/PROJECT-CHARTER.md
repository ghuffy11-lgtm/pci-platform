# PCI Platform — Project Operating Charter

**Purpose:** Durable recovery and operating context for the project.

## 1. Roles

- **Architecture Lead:** ChatGPT. Owns architecture decisions, task authorization, scope, sequencing, and project-level oversight.
- **Execution Agent:** Claude Code. Implements authorized READY tasks, records evidence in COMMS, and pushes completed work.
- **Human Operator:** User. Provides workstation access/observation when needed; is not the message bus and should not manually relay Claude ↔ Architecture Lead communications unless explicitly asked.
- **Source of truth:** GitHub repository state, task board, COMMS register/messages, committed code/configuration, and documented decisions.

## 2. Operating model

Normal flow:

`Architecture Lead decision → authorized READY task → Windows Execution Supervisor → Claude Code → evidence/COMMS → GitHub → Architecture Lead review`

The human operator should normally observe rather than manually trigger or relay work.

The Windows Execution Supervisor is responsible for unattended execution on its configured cadence. It must fail closed on unsafe repository states and must not bypass security controls.

## 3. Authority boundaries

### Architecture Lead may

- authorize or reject tasks;
- make architecture decisions;
- resolve project-level blockers when evidence supports the decision;
- authorize narrowly scoped documentation/protocol changes;
- define acceptance criteria and test gates.

### Claude may

- execute only authorized task scope;
- inspect project state and required source documents;
- implement the authorized changes;
- create COMMS records and execution evidence;
- push authorized results using the project's permitted mechanism;
- stop and request an Architecture Lead decision when outside its authority.

### Claude must not

- invent task authorization;
- broaden task scope;
- silently resolve architecture decisions;
- weaken Supervisor security controls;
- use `--dangerously-skip-permissions`;
- bypass a fail-closed condition by routing around a denied operation;
- mark work COMPLETE before its required evidence is committed/pushed.

## 4. Task lifecycle

`DEFINED → READY → Supervisor selects → Claude executes → evidence committed/pushed → COMPLETE`

A task that is not READY must not be executed.

If execution encounters a decision boundary, Claude records a COMMS message and stops rather than guessing.

Task numbering/order must not be inferred by skipping entries. Always inspect the authoritative task board and prerequisites before selecting the next task.

## 5. COMMS protocol

COMMS is the durable decision channel between Claude and the Architecture Lead.

`Claude finding → MSG → Architecture Lead decision → DECIDED → Claude executes`

The COMMS register is authoritative for message indexing/status, subject to explicitly documented reconciliation when a stale index is found.

Message numbers must be allocated from the authoritative register before creating a message and verified for uniqueness immediately before commit. Existing duplicate-numbered historical records must not be renumbered unless separately authorized.

A message not represented in the register is a record defect and must be reconciled according to protocol; do not assume the file does not exist.

## 6. Supervisor and security

The Supervisor must use the approved runner configuration and deny rules. The project has explicitly prohibited `--dangerously-skip-permissions`.

Repository reconciliation is fail-closed except for the explicitly authorized safe case: a clean local clone strictly behind remote may fast-forward. Ahead or dirty states require human/lead intervention.

Every Supervisor invocation must leave durable evidence sufficient to distinguish invocation, NOOP, failure, and runner launch. A transient PowerShell window is not evidence of success.

## 7. Evidence standard

A task is considered complete only when its stated acceptance criteria are satisfied and the required evidence is committed and pushed.

For Supervisor execution, the evidence chain should be independently traceable:

`Scheduler → Supervisor CYCLE_START → queue selection → runner start → Claude output/result → COMMS → commit/push → task COMPLETE`

Do not infer success from a window opening/closing.

## 8. Recovery procedure for a new Architecture Lead session

If the current ChatGPT conversation is unavailable, the next Architecture Lead session must reconstruct context from GitHub before taking action.

Read in this order:

1. `implementation/PROJECT-CHARTER.md` — this document.
2. `implementation/operations/CLAUDE-TASKS.md` — authoritative task board and prerequisites.
3. `implementation/comms/README.md` — authoritative COMMS register.
4. The newest relevant `implementation/comms/MSG-*.md` messages, especially OPEN/DECISION REQUIRED records.
5. `implementation/status/current.md` — project status, while checking it against the task board and COMMS rather than treating stale contradictions as authoritative.
6. `implementation/blockers/README.md` and relevant blocker records.
7. Relevant Supervisor configuration, logs/evidence, and recent commits when execution status is in question.

Then establish:

- current HEAD and whether local/remote state is reconciled;
- current task statuses and the highest-priority authorized READY task;
- open blockers and architecture decisions required;
- latest COMMS message number and any duplicate/collision condition;
- current Supervisor state and last verified execution evidence;
- security boundaries and any recent changes.

Do not start work merely because a task appears in prose. Confirm its authoritative status and authorization.

## 9. Continuity rule

This file is the durable project memory for operating role, authority, workflow, and recovery. Conversation history is useful context but is not required to reconstruct project state.

When this charter conflicts with a newer explicit Architecture Lead decision recorded in COMMS, the newer DECIDED COMMS record governs; update this charter only when the durable operating rule itself has changed.

## 10. Current recovery note

The Supervisor end-to-end smoke test has been proven through TASK-0011: a READY task was selected automatically, Claude was launched by the Supervisor, COMMS evidence was created, and the result was pushed without human relay. The test also exposed and corrected a repository-reconciliation gate that previously stalled after Architecture Lead pushes.

The next session must verify current repository state rather than assuming the above remains unchanged.
