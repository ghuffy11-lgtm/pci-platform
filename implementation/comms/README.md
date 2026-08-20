# PCI Architecture ↔ Claude Code Communication

This directory is the asynchronous communication channel between Claude Code and the PCI architecture lead.

## Message Register

Every message in this directory, newest first. Each row links to the file. Claude Code updates this
register whenever a message is created or its status changes — a message that is not listed here is
a defect in the record, not a missing message.

| ID | Subject | Status | File |
|---|---|---|---|
| MSG-0049 | **CLOSED** — gate 3 met by external observation (addendum) | **OPEN** — **decision required**, §6: four of five gates MET; the terminal gate cannot be observed from inside the run it measures | [MSG-0049-task-0018-live-heartbeat-verification.md](MSG-0049-task-0018-live-heartbeat-verification.md) |
| MSG-0048 | TASK-0018 authorization — live supervisor heartbeat validation | **DECIDED** — queue reconciled, awaiting scheduled launch | [MSG-0048-task-0018-authorization.md](MSG-0048-task-0018-authorization.md) |
| **MSG-0047** | **TASK-0017 verification result — 36 passed, 0 failed** | **OPEN** — informational; gate satisfied | [MSG-0047-task-0017-verification-result.md](MSG-0047-task-0017-verification-result.md) |
| **MSG-0045** | **TASK-0017 execution record — heartbeat corrected, NOT verified** | **OPEN** — **decision required**: the test suite could not be run by an unattended session | [MSG-0045-task-0017-execution-record.md](MSG-0045-task-0017-execution-record.md) |
| **MSG-0044** | **TASK-0017 was authorized but invisible to the supervisor — queue reconciled** | **OPEN** — informational | [MSG-0044-task-0017-queue-reconciliation.md](MSG-0044-task-0017-queue-reconciliation.md) |
| **MSG-0043** | **Architecture decision: authorize TASK-0017 supervisor heartbeat observability** | **DECIDED** — applied by TASK-0017; verification blocked, see MSG-0045 | [MSG-0043-supervisor-heartbeat-decision.md](MSG-0043-supervisor-heartbeat-decision.md) |
| **MSG-0042** | **TASK-0016 execution record — MSG-0034 closed** | **RECORD** — applied and verified; no decision requested | [MSG-0042-task-0016-execution-record.md](MSG-0042-task-0016-execution-record.md) |
| **MSG-0041** | **Architecture decision: close resolved MSG-0034 informational record** | **DECIDED** — applied by TASK-0016, see MSG-0042 | [MSG-0041-architecture-decision-close-msg-0034.md](MSG-0041-architecture-decision-close-msg-0034.md) |
| **MSG-0040** | **TASK-0015 execution record — discoveries index reconciled, three rows to nine** | **RECORD** — applied and verified; no decision requested | [MSG-0040-task-0015-execution-record.md](MSG-0040-task-0015-execution-record.md) |
| MSG-0039 (b) | Architecture decision: reconcile discoveries index — duplicate number, non-conflicting | **DECIDED** — applied by TASK-0015, see MSG-0040 | [MSG-0039-architecture-decision-discovery-index.md](MSG-0039-architecture-decision-discovery-index.md) |
| MSG-0039 (a) | Architecture decision: reconcile the discoveries index — duplicate number, non-conflicting | **DECIDED** — applied by TASK-0015, see MSG-0040 | [MSG-0039-architecture-decision-discoveries-index-reconciliation.md](MSG-0039-architecture-decision-discoveries-index-reconciliation.md) |
| **MSG-0038** | **TASK-0014 execution record — BLK-0005 reconciled in the blocker index** | **RECORD** — applied and verified; no decision requested | [MSG-0038-task-0014-execution-record.md](MSG-0038-task-0014-execution-record.md) |
| MSG-0037 | Architecture decision: reconcile BLK-0005 in the blocker index | **DECIDED** — applied by TASK-0014, see MSG-0038 | [MSG-0037-architecture-decision-blk-0005.md](MSG-0037-architecture-decision-blk-0005.md) |
| MSG-0036 | TASK-0013 execution record — MSG-0035 decisions applied | **RECORD** — blocker index corrected, numbering convention added; its §6 finding is **ruled on** by MSG-0037 and applied | [MSG-0036-task-0013-execution-record.md](MSG-0036-task-0013-execution-record.md) |
| MSG-0035 | Architecture decisions for the MSG-0032 findings | **DECIDED** — BLK-0001/0004 confirmed RESOLVED; numbering convention approved | [MSG-0035-architecture-decisions.md](MSG-0035-architecture-decisions.md) |
| **MSG-0034** | **TASK-0011 execution path — diagnosis and minimal correction** | **CLOSED** — informational; smoke test passed after the fix | [MSG-0034-task-0011-execution-path-correction.md](MSG-0034-task-0011-execution-path-correction.md) |
| MSG-0033 (b) | TASK-0011 retry — diagnose and correct the failed smoke-test path | **DECIDED** — diagnosed and corrected in `479dfa9`; TASK-0011 passed, see MSG-0032 | [MSG-0033-task-0011-retry-diagnosis.md](MSG-0033-task-0011-retry-diagnosis.md) |
| MSG-0033 (a) | TASK-0011 smoke-test diagnosis and corrective action | **DECIDED** — diagnosed and corrected in `479dfa9`; TASK-0011 passed, see MSG-0032 | [MSG-0033-task-0011-diagnosis.md](MSG-0033-task-0011-diagnosis.md) |
| MSG-0032 | TASK-0011 — Supervisor smoke test: COMMS audit and end-to-end result | **RECORD** — smoke test PASSED; two findings need a ruling (§6.2 blockers, §6.3 numbering) | [MSG-0032-task-0011-supervisor-smoke-test.md](MSG-0032-task-0011-supervisor-smoke-test.md) |
| MSG-0031 | TASK-0003 COMPLETE — CRLF residue cleared (150 -> 0) | **DECIDED** — completion accepted; stat refresh accepted as in scope | [MSG-0031-task-0003-complete.md](MSG-0031-task-0003-complete.md) |
| MSG-0030 | MSG-0028 decisions 2 and 3 applied; decision 1 command was a no-op | **DECIDED** — Option B authorized and executed | [MSG-0030-refresh-command-ineffective.md](MSG-0030-refresh-command-ineffective.md) |
| MSG-0029 | Supervisor start path — diagnosis, fixes, first successful launch | **CLOSED** — start path PROVEN; behaviours ruled by MSG-0028 | [MSG-0029-supervisor-start-path-diagnosis.md](MSG-0029-supervisor-start-path-diagnosis.md) |
| MSG-0028 | TASK-0003 implemented but not complete — three decisions | **DECIDED** — 2 and 3 applied; 1 blocked, see MSG-0030 | [MSG-0028-task-0003-implemented-not-complete.md](MSG-0028-task-0003-implemented-not-complete.md) |
| MSG-0027 | TASK-0003 authorization — line-ending normalization only | DECIDED — executed 2026-08-20, see MSG-0028 | [MSG-0027-task-0003-authorization.md](MSG-0027-task-0003-authorization.md) |
| MSG-0026 | Execution Supervisor ENABLED — permission mode determined and verified | **CLOSED** — start path PROVEN by TASK-0003 | [MSG-0026-supervisor-enabled.md](MSG-0026-supervisor-enabled.md) |
| MSG-0025 | Execution Supervisor installed and dry-run verified — NOT enabled | **CLOSED** — answered by MSG-0026 | [MSG-0025-supervisor-enablement-status.md](MSG-0025-supervisor-enablement-status.md) |
| MSG-0024 | Execution Supervisor enable decision | DECIDED — enablement authorized | [MSG-0024-execution-supervisor-enable-decision.md](MSG-0024-execution-supervisor-enable-decision.md) |
| **MSG-0023** | **Correct TASK-0009 boundary — no TASK-0012 in WP-0001 path** | **DECIDED** | [MSG-0023-correct-task-0009-boundary.md](MSG-0023-correct-task-0009-boundary.md) |
| MSG-0022 | Resolve MSG-0020 conflict — WP-0001 COMPLETE | **DECIDED — superseded/clarified by MSG-0023** | [MSG-0022-resolve-msg-0020-conflict.md](MSG-0022-resolve-msg-0020-conflict.md) |
| MSG-0021 | Which MSG-0020 stands? Two contradictory completion decisions | **CLOSED — resolved by MSG-0022 and clarified by MSG-0023** | [MSG-0021-msg-0020-conflict.md](MSG-0021-msg-0020-conflict.md) |
| MSG-0020 (a) | WP-0001 completion decision — NOT COMPLETE, authorizes TASK-0012 | **SUPERSEDED — MSG-0023** | [MSG-0020-wp-0001-completion-decision.md](MSG-0020-wp-0001-completion-decision.md) |
| MSG-0020 (b) | WP-0001 completion decision — COMPLETE, no remediation | **SURVIVING COMPLETION RULING — clarified by MSG-0023** | [MSG-0020-wp0001-completion-decision.md](MSG-0020-wp0001-completion-decision.md) |
| MSG-0019 | TASK-0007 / TASK-0008 complete — WP-0001 ready for the completion decision | **CLOSED** — TASK-0009 decided | [MSG-0019-task-0007-0008-complete.md](MSG-0019-task-0007-0008-complete.md) |
| MSG-0018 | Authorize TASK-0007 | DECIDED — executed, G4 passed | [MSG-0018-authorize-task-0007.md](MSG-0018-authorize-task-0007.md) |
| MSG-0017 | TASK-0006 complete — WP-0001 is reproducible | **CLOSED** — TASK-0007 authorized and complete | [MSG-0017-task-0006-complete.md](MSG-0017-task-0006-complete.md) |
| MSG-0016 | Authorize TASK-0006 | DECIDED — executed, G3 passed | [MSG-0016-authorize-task-0006.md](MSG-0016-authorize-task-0006.md) |
| MSG-0015 | TASK-0004 / TASK-0005 complete; TASK-0006 authorization required | **CLOSED** — authorized by MSG-0016, executed | [MSG-0015-task-0004-0005-complete.md](MSG-0015-task-0004-0005-complete.md) |
| MSG-0014 | Queue authorization reconciliation | DECIDED | [MSG-0014-queue-ready-authorized.md](MSG-0014-queue-ready-authorized.md) |
| MSG-0013 | Architecture review checkpoint | DECIDED | [MSG-0013-architecture-review-checkpoint.md](MSG-0013-architecture-review-checkpoint.md) |
| MSG-0012 | Architecture lead decisions: TASK-0004 and TASK-0005 | DECIDED | [MSG-0012-architecture-lead-decisions-task-0004-0005.md](MSG-0012-architecture-lead-decisions-task-0004-0005.md) |
| MSG-0011 | Execution Supervisor — built, tested, not installed | **SUPERSEDED** by MSG-0024; supervisor is installed and ENABLED | [MSG-0011-execution-supervisor.md](MSG-0011-execution-supervisor.md) |
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

## TASK-0003 — COMPLETE

The CRLF residue is cleared: tracked `*.md` with CRLF went **150 to 0**, nothing outside `*.md`
changed, and DISC-0006 is RESOLVED. Two authorized commands were no-ops first, because git did not
consider the files modified; a metadata-only `touch` scoped to tracked markdown let the authorized
checkout run. That addition is flagged for review in MSG-0031.

Detail: [`MSG-0031-task-0003-complete.md`](MSG-0031-task-0003-complete.md).

## Execution Supervisor — installed, ENABLED, and smoke-tested end to end

Running every ten minutes with `acceptEdits` and a version-controlled deny list; never
`--dangerously-skip-permissions`. Its start path is **proven** — it launched and ran TASK-0003 on
2026-08-20 (MSG-0029), and TASK-0011 then tested the full loop deliberately: queue → Supervisor →
Claude → COMMS → GitHub, with no human relay. **It passed** (MSG-0032).

The honest limit: it recovers from *behind-with-a-clean-tree* only. Ahead, or behind-and-dirty, it
still refuses and waits for a human — correct fail-closed behaviour, but a silent park looks the
same from outside as a dead scheduler. `CYCLE_START` logging now makes it visible; it does not make
it self-clearing.

Detail: [`MSG-0026-supervisor-enabled.md`](MSG-0026-supervisor-enabled.md),
[`MSG-0029-supervisor-start-path-diagnosis.md`](MSG-0029-supervisor-start-path-diagnosis.md),
[`MSG-0032-task-0011-supervisor-smoke-test.md`](MSG-0032-task-0011-supervisor-smoke-test.md).
Implementation and docs: [`../operations/supervisor/`](../operations/supervisor/README.md).

## Message numbering — allocation convention

**This is a protocol rule.** Approved by the architecture lead in MSG-0035 decision 2 and applied by
TASK-0013.

Before creating a message:

1. **Allocate the next number from this register** — the authoritative index — rather than from
   memory, from a conversation, or from the highest number you happen to have read.
2. **Verify the number is unused immediately before the commit**, not only when you started writing.
   A number that was free when drafting can be taken by the time you commit.
3. **If a collision is detected — stop and report it.** Do not create another duplicate-numbered
   message, and do not silently pick the next number instead. A collision means two actors are
   allocating from indexes that disagree, and that is the thing worth reporting.

Existing duplicate-numbered records are **not** renumbered: MSG-0020 (a)/(b), MSG-0033 (a)/(b), and
MSG-0039 (a)/(b) remain dual-numbered records (MSG-0035 decision 2, explicit).

**MSG-0039 (a)/(b) is the first collision since the rule was adopted, and the rule did not prevent
it** — because it constrains *Claude's* allocation, and both MSG-0039 files were authored by the
architecture lead. The two agree in substance, so TASK-0015 executed the stricter reading of both and
reported the collision rather than stopping (MSG-0040 §6). Step 3 above still stands unchanged for
Claude: never create a further duplicate. Whether anything should constrain the lead's allocation is
not a question TASK-0015 was authorized to raise, and it does not raise one.

### Check the directory, not only this table

TASK-0013 hit the failure this rule exists to prevent, while adding the rule. **MSG-0035 was present
on disk but had no row in this register.** Allocating "the next number after the highest row" would
have produced **MSG-0035** — a third duplicate. The directory listing is what caught it.

**It happened again one message later.** TASK-0014 found **MSG-0037** on disk and in the
`CLAUDE-TASKS.md` ledger with no row here, and the directory listing caught it a second time
(MSG-0038 §6). The cause is structural, not careless: the lead authorizes by committing the message
and a queue row, and the register row is added by the executing session afterwards — so between
authorization and execution this table is reliably one message stale. Expect it; check the directory.

**And a third time, with the stakes raised.** TASK-0015 found **two** MSG-0039 files on disk, neither
with a row here. Allocating from the highest register row would have produced MSG-0039 — a *fourth*
file under that number. The directory listing caught it again (MSG-0040 §6). Three consecutive tasks,
same defect, same step catching it.

So step 1 above means: read this register, **and** list `MSG-*.md`, **and** grep the repository for
the candidate number. A missing row is a record defect, not evidence that a number is free — the
charter (`../PROJECT-CHARTER.md` §5) states this directly: *"A message not represented in the
register is a record defect and must be reconciled according to protocol; do not assume the file does
not exist."* The MSG-0035 row was added by TASK-0013 as exactly that reconciliation.

### Why the rule was asked for

Duplicate numbering had happened twice before any rule existed. MSG-0020 (a)/(b) **contradicted each
other** and cost three further messages — MSG-0021, MSG-0022, MSG-0023 — to work out which decision
stood. MSG-0033 (a)/(b) agreed, so it cost nothing. The difference between the two was luck, not
process, which is why MSG-0032 §6.3 requested a ruling instead of adopting one.

## Bootstrap — closed

**MSG-0008 is CLOSED.** The operator executed the authorized bootstrap on 2026-08-19 and Claude Code verified `DockerRootDir` = `/data/docker`. WP-0001 verification followed and completed: 229 tests passing, all ten acceptance criteria met.

## Protocol

- Claude allocates the next `MSG-XXXX` number from the register above **before** creating the file,
  and re-verifies its uniqueness immediately before committing. On a collision: stop and report. See
  *Message numbering — allocation convention*.
- Claude creates `MSG-XXXX-<short-name>.md` when architectural direction, clarification, or a blocking decision is required.
- Claude sets `Status: OPEN` and records the work package, evidence, options, recommendation, and exact question.
- Claude adds the message to the register above in the same commit that creates it.
- The architecture lead reads open messages from GitHub and responds in the same file or a sequential response file.
- Claude must read the response before continuing.
- Accepted architectural decisions are promoted into ADRs/specifications when appropriate.

## Rule

The user is not a technical relay between Claude Code and the architecture lead. GitHub is the shared engineering communication channel.
