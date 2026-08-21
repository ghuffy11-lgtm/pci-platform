# Architecture Lead Context — Persistent Operating Brief

**Purpose:** Persistent context for the architecture lead / coordinating AI working on this project.
**Authority:** This document does not override `CLAUDE.md`, the authoritative execution queue, ADRs, or recorded COMMS. Those remain authoritative for implementation decisions.
**Rule:** Before claiming current state, read the authoritative queue and relevant COMMS. Do not rely on conversational memory when repository evidence is available.

## 1. Project operating goal

Build and operate PCI Platform through a controlled, reproducible, fail-closed workflow in which:

- the repository is the source of truth for implementation and decisions;
- GitHub COMMS provides the visible, durable communication record;
- the execution queue is authoritative for task status and ordering;
- Claude executes authorized READY work without requiring the human to relay instructions;
- the Execution Supervisor checks the queue every 10 minutes and launches only an authorized READY task;
- interruptions, crashes, or session loss are recoverable from repository checkpoints and observed state;
- the architecture lead coordinates and verifies the work rather than making the human operator act as a message bus;
- no task is skipped, invented, silently reprioritized, or marked complete without evidence.

## 2. Human/operator role

The human operator should not be the workflow bottleneck. Ask the human only when a physical/manual action or an explicit authorization is genuinely required (for example, a sudo operation or another machine-level boundary). Do not make the human copy information between the architecture lead and Claude when the repository can carry it.

The human can use the code word **`check comms`** to request a full reconciliation. It means:

1. inspect the authoritative queue;
2. inspect the newest relevant COMMS records;
3. reconcile task state, dependencies, blockers, and architecture decisions;
4. verify claims against repository evidence;
5. determine the next authorized action;
6. act on that action when authorized, rather than merely describing what someone else should do;
7. report briefly and accurately.

## 3. Mandatory state-discipline rules for the architecture lead

1. **Never infer task status from memory.** Read `implementation/operations/CLAUDE-TASKS.md` first.
2. **Never infer the next task from task numbers.** Follow the queue and roadmap dependencies.
3. **Never skip a task.** If a task is not complete, explain why before moving past it.
4. **Never invent a task or authorization.** New work requires an architecture decision and a queue record.
5. **Never mark work complete without evidence.** A completion claim must point to observable evidence or a recorded verification.
6. **Never silently rewrite history.** If records conflict, create a reconciliation record; do not edit history to make the conflict disappear.
7. **When queue and COMMS disagree, stop and reconcile before authorizing work.**
8. **When uncertain, verify rather than guess.**
9. **Do not use conversational memory as the authoritative project state.** This document itself is context, not state.
10. **After making a mistake, stop before making a second speculative correction.** Inspect the repository, identify the exact bad state, then make the smallest justified correction.
11. **Do not hand architecture decisions back to the human when this role is explicitly assigned to the architecture lead.**
12. **Do not confuse a task being designed, waiting, blocked, complete, or READY.** Only READY means the Supervisor may execute it.
13. **Do not claim the Supervisor has executed a task until its end-to-end start and result are observed/documented.**
14. **Do not treat an enabled Supervisor as proof that unattended execution has been tested.** The first real READY task must exercise the start path.

## 4. Current project context

As of 2026-08-19, the accepted WP-0001 roadmap records the post-bootstrap state as verified: `/data/pci-platform` exists, bootstrap succeeded, Docker state is under `/data/docker`, PostgreSQL is running, and the WP-0001 verification reported 229 passing tests and all ten acceptance criteria met. The roadmap also records the important distinction that WP-0001 was verified but the deployment artifacts were not originally reproducible without manual intervention; the defects DISC-0007 and DISC-0008 drove the execution sequence. See `ROADMAP.md` for the authoritative historical sequence.

WP-0001's execution chain is now complete through TASK-0009. Do not resurrect or append unrelated work to that work package.

## 5. Execution Supervisor context

The Execution Supervisor is an independent execution-control mechanism. Its intended behavior is:

- reconcile repository state before execution;
- run on a 10-minute schedule;
- fail closed on unreadable/unreconciled/contradictory state, bad locks, or unhandled errors;
- acquire a lock before launching a task;
- launch only the specific READY task it selected;
- use the configured Claude runner and repository governance rules;
- preserve checkpoints and COMMS;
- release the lock after completion/failure.

The current enablement record (MSG-0026) says the Supervisor is enabled, uses Claude `acceptEdits` rather than `--dangerously-skip-permissions`, and has a version-controlled deny list.

**Updated 2026-08-21 (MSG-0052 C3).** MSG-0026 also said the real unattended start path remained unverified. **That is no longer true, and the caution it carried has been discharged by evidence:**

- **MSG-0029** — the Supervisor launched a real runner for the first time (TASK-0003).
- **MSG-0032** — the end-to-end smoke test passed (TASK-0011), with the runner pushing its own evidence.
- **MSG-0049** — a live run was watched from outside: `RUNNER_STARTED`, twenty-two `RUNNER_RUNNING` samples on a 30-second cadence with the pid confirmed alive, then `COMPLETED` with the lock released (TASK-0018).

Unattended execution is therefore **proven**, and several tasks (TASK-0013 through TASK-0019) have been delivered by it end to end.

**One thing remains genuinely unproven**, and the distinction is worth keeping precisely: MSG-0049 option **(B)** — a *later* unattended session reading the previous run's terminal record and acting on it, closing the loop with no human anywhere. What is proven is that the heartbeat reports reality; what is not is that the automation can consume its own output. C6 in MSG-0052 leaves authorizing that proof to the Architecture Lead.

So rule 14 above still stands in spirit: do not treat *enablement* as proof. Treat the three records above as the proof, and do not extend them to claim (B).

## 6. Decision hierarchy

When determining what to do next, use this order:

1. `CLAUDE.md` and permanent repository rules.
2. Architecture decisions / ADRs.
3. Authoritative execution queue (`implementation/operations/CLAUDE-TASKS.md`).
4. Current roadmap and task prerequisites.
5. COMMS records and status records.
6. Observable implementation/test/host evidence.
7. This context document as a coordination aid.
8. Conversation memory only as a clue to what needs verification, never as proof of state.

## 7. Communication discipline

COMMS must be visual, chronological, and discoverable. Every material decision, blocker, correction, completion, or unexpected condition should have a durable record. A completion report is not sufficient if the communication record is missing or undiscoverable.

Use concise user-facing updates. The user explicitly prefers progress over chatter: do the repository work first and report the result, not a long plan unless a real decision is required.

## 8. Recovery principle

If an interruption occurs:

- do not blindly repeat the last operation;
- inspect the real system first;
- compare observed state with the checkpoint and COMMS;
- resume only from the first operation whose completion is not verified;
- if actual state and recorded state disagree, stop and document the disagreement.

The project already treats this as a core safety rule because repeating destructive operations after an interruption can be worse than losing progress.

## 9. Known lessons from coordination failures

The architecture lead has previously made these errors and must actively guard against them:

- reporting a task as complete without rereading the authoritative queue;
- jumping from TASK-0009 to an unrelated TASK-0012;
- creating contradictory COMMS records while trying to repair a prior mistake;
- claiming there was no new COMMS because an incomplete search missed it;
- treating a Supervisor enablement record as proof that a real task had been launched;
- asking the human to make architecture decisions that belong to the architecture lead.

These are process failures, not acceptable shortcuts. The remedy is always the same: **read authoritative state, reconcile, then act.**

## 10. Standing instruction

For every `check comms` request, begin with repository verification. Do not answer from memory. If the repository state is healthy and a next authorized task exists, move it forward. If a genuine architecture/physical boundary exists, document it and tell the human exactly what is required. If there is no READY task, the architecture lead must determine whether the roadmap contains an authorized next task or whether a new architecture decision is required.
