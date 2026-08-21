# MSG-0055 — TASK-0021 Execution Record: Employee Policy Assistant Architecture Definition

**Status:** **RECORD — architecture definition delivered; §5 lists fourteen decisions requiring the Architecture Lead. None was self-authorized.**
**From:** Claude Code
**To:** Architecture Lead
**Related:** MSG-0054 (authorization), MSG-0053 (C6/C7), TASK-0021
**Raised:** 2026-08-21

---

## 1. What was authorized and what was done

MSG-0054 authorized TASK-0021 as an **architecture-definition task only** — no implementation, no
work package, no downstream task authorization. That boundary was held. Nothing outside
`implementation/` was modified; no product code, schema, supervisor configuration, permission,
credential, or accepted architecture document was touched.

**Delivered** — four new files under `implementation/architecture/`, all **PROPOSED** and carrying no
architectural authority:

| File | Contents |
|---|---|
| [`README.md`](../architecture/README.md) | States that everything in the directory is proposed and overrides nothing |
| [`EPA-0001-employee-policy-assistant-architecture.md`](../architecture/EPA-0001-employee-policy-assistant-architecture.md) | The architecture definition: scope boundary, document authority and lifecycle, components and data flow, the grounded-answer contract, bilingual behaviour, authorization, threat model, frontend responsibilities, audit and retention, operational architecture, and a conflict check against every accepted document it touches |
| [`EPA-0002-proposed-work-package-and-gates.md`](../architecture/EPA-0002-proposed-work-package-and-gates.md) | What a work package would look like: scope/non-scope, data contracts, interfaces, eleven acceptance gates, prerequisites, dependency-ordered task sequence |
| [`EPA-0003-required-decisions.md`](../architecture/EPA-0003-required-decisions.md) | **The register of fourteen open decisions.** The one that needs an answer |

Read them in that order. EPA-0003 is the operative record.

## 2. Startup and prerequisite verification

The mandatory startup checklist was executed in full this session — every document re-read, nothing
recalled from a prior session. Prerequisites were checked before acting rather than inferred from the
READY row:

| ID | Prerequisite | Verified |
|---|---|---|
| P1 | Architecture lead authorization | **MET** — MSG-0054, `Status: DECIDED` |
| P2 | WP-0001 COMPLETE | **MET** — the work package reads `Status: COMPLETE` (MSG-0052 C1) |
| P3 | Objective recognised as outside WP-0001 | **MET** — MSG-0054, corroborated below |

This session was started by the Execution Supervisor on its own cycle, not by hand:

```text
2026-08-21T11:05:47Z [INFO]   CYCLE_START    :: pid=25620 enabled=True dryRun=False
2026-08-21T11:05:52Z [ACTION] RUNNER_COMMAND :: claude.exe -p "You were started automatically by the PCI
                              Execution Supervisor to execute TASK-0021. ..." --permission-mode acceptEdits
2026-08-21T11:05:53Z [ACTION] RUNNER_STARTED :: pid=26508 task=TASK-0021
```

The logged prompt is verbatim the one this session received. **Seventh consecutive unattended
delivery** — and the first that produced architecture rather than maintenance.

## 3. The boundary, confirmed independently of the ruling

MSG-0054 ruled the objective outside WP-0001. The repository agrees on its own evidence, which is
worth stating because a boundary resting on two independent authorities is harder to erode:
**WP-0001's own Non-Scope section** excludes `Ollama/model integration`, `Agent reasoning`, and `UI`.
The objective requires ingestion, a retrieval index, an inference runtime, grounded generation,
bilingual behaviour, and an employee frontend — **four of those are named in WP-0001's non-scope**.
The boundary is not a judgment call. EPA-0001 §1 records it with the reuse table showing what the
completed kernel already provides.

## 4. What the definition actually says, in six lines

- **One contract, no third outcome:** an answer with verifiable citations to specific approved
  document *versions*, or an explicit abstention. An unsupported answer is a defect, not a degraded
  success.
- **Approval is upstream of everything.** Only PUBLISHED, effective versions are indexed at all —
  drafts are not indexed and filtered, they are never indexed, because a filter can fail open and an
  absent index entry cannot.
- **Authorization is enforced at four independent points**, before retrieval and again on hits, at the
  data layer via ADR-0016's existing RLS model, and again when a citation is opened.
- **Abstention is a product surface**, not an error path — seven classes, each telling the employee
  something different about what to do next.
- **No tools, no actions.** The assistant answers; it does not act. That keeps it inside the smallest
  governance envelope that can deliver the objective, and adding a tool later is an ADR.
- **Almost none of this is new.** It instantiates SPEC-0011/0013/0014/0015/0031, ADR-0016 and
  ADR-0003 under a stricter contract. EPA-0001 §12 lists the five things that genuinely are new, so
  review effort can go where it belongs.

## 5. Decisions required — fourteen

Full detail, with options, consequences, and a recommendation for each, is in **EPA-0003**. Summary:

| ID | Decision | Priority |
|---|---|---|
| **D1** | Bilingual policy authority — may a translation ever be cited as policy? | **Highest** |
| **D3** | Approval authority; who assigns audience and classification; may policy be Restricted? | **Highest** |
| **D5** | Grounding-gate mechanism — structural, entailment, both, or extractive-only | **Highest** |
| **D13** | Identity provider — **an unmet prerequisite, not a preference** | **Highest** |
| D2 | Retrieval strategy and cross-language approach | High |
| D4 | Does "not authorized" look identical to "does not exist"? | High |
| D7 | Question-text retention and who may read the question log | High |
| D14 | Supported document classes; is OCR in scope? | High |
| D6 | Arabic normalization rules | Medium |
| D8 | External model provider — permitted, ever? | Medium |
| D9 | New service vs kernel extension | Medium |
| D10 | Single-shot vs multi-turn | Medium |
| D11 | Historical questions over superseded versions | Medium |
| D12 | Should the grounded-answer contract become an accepted ADR binding future capabilities? | Medium |

**Why the count is high rather than low.** TASK-0021's stop condition names *inventing product scope
the objective did not supply* as the failure mode to avoid, and its verification requirements demand
that unresolved choices be "recorded as architecture-lead decisions rather than guessed." Each of the
fourteen is a point where a plausible assumption would have produced a coherent architecture that was
wrong in a way later work could not cheaply unpick. **D1 is the clearest example:** the repository
contains no accepted authority on bilingual semantics at all — one line in SPEC-0016 about
notification templates — and quietly assuming machine translation is acceptable would have shipped an
architecture in which Arabic-speaking employees act on policy text no one approved, produced by a
model, presented as policy. That is an unsupported policy claim arriving through the system's normal
operation rather than through a failure.

Six new ADRs are proposed in EPA-0003 to settle these. **Numbers are proposals only** — allocation is
the lead's, and this record creates no ADR.

## 6. No stop condition fired, and the check is stated

TASK-0021's three stop conditions were checked explicitly rather than assumed:

1. **Repository authority sufficient to define a safe boundary** — yes. The existing SPEC and ADR set
   covers governed retrieval, authorization, isolation, audit, and model abstraction. The one genuine
   authority vacuum is bilingual semantics, and it is recorded as D1 rather than filled in.
2. **No accepted ADR conflicts materially with the proposed architecture.** EPA-0001 §13 records the
   check document by document. Three areas are **stricter** than the accepted baseline — the grounded
   answer contract, draft non-indexing, and abstention auditing. Stricter is not conflicting: under
   the authority hierarchy a lower artifact must not contradict a higher one, and adding a constraint
   is not a contradiction. It is flagged anyway, as D12, because if the lead intends that strictness
   to bind future capabilities it belongs in an accepted ADR rather than in a proposal under
   `implementation/`.
3. **No decision required inventing product scope** — because none was made. That is what §5 is.

## 7. Two observations, recorded because they were found while doing authorized work

Neither is a request, neither blocks anything, and no action was taken on either.

**7.1 — The work-package registers already disagree.** `docs/program/work-packages.md` (PLAN-WP-0001)
lists WP-0001 as "Knowledge Foundation" and a WP-0002 as "Repository and Engineering Platform", while
the delivered `docs/program/work-packages/WP-0001-kernel-foundation.md` is "PCI Kernel Foundation".
Allocating "WP-0002" to the assistant would therefore collide with an existing planning entry.
**EPA-0002 allocates no number** and refers to "the assistant work package" throughout. This is the
same index-versus-record drift pattern TASK-0019 found six times, seen a seventh time in a register
that audit did not cover — it examined the queue, ROADMAP, status, COMMS, blockers, discoveries,
checkpoints, ADRs and the work-package *file*, but not the work-package *list*.

Recorded as [`DISC-0010`](../discoveries/DISC-0010-work-package-register-disagreement.md) with four
options and **no recommendation**, because reconciling the two registers means deciding whether the
planning list is superseded history, a valid forward plan with stale numbering, or something to
renumber — a judgment about program structure rather than documentary drift with one obvious correct
value. That is precisely what TASK-0021's stop condition reserves to the lead, so no correction was
attempted.

**7.2 — The proposed task order builds the answer path before retrieval-time authorization.**
MSG-0054's dependency order places grounded QA before authorization/confidentiality. **EPA-0002 §5
follows the order as issued** — this session has no authority over the sequence. It is noted because
it produces an interim state in which a working answering system exists before authorization does,
and that artifact is the one most likely to be demonstrated or accidentally pointed at real
documents. EPA-0002 §5 offers the cheapest mitigation that preserves the stated order: build the
answer path against synthetic fixture documents only, and gate real-corpus ingestion behind the
authorization task. **The lead may adopt, reorder, or dismiss it.**

**7.3 — The COMMS register lag recurred, and was corrected in the same commit.** `MSG-0054` existed on
disk and in the `CLAUDE-TASKS.md` ledger with **no row in `comms/README.md`**. That register states
plainly that "a message that is not listed here is a defect in the record, not a missing message", so
the row was added alongside this one. The cause is the structural one already recorded in MSG-0038 §6
and MSG-0042 §6: the lead authorizes by committing the message plus a queue row, and the register row
is added by the executing session afterwards — so between authorization and execution the register is
reliably one behind. **No change is proposed and no ruling is requested.** It is recorded because it
has now happened often enough that a future session should read it as expected behaviour rather than
as a surprise, and because the MSG-0035 numbering convention's directory-listing step is what caught
it again: MSG-0055 was verified free against the register, the directory listing, **and** a
repository-wide grep, precisely because the register alone could not be trusted.

## 8. What is NOT delivered, stated plainly

- **No implementation of any kind.** No ingestion, retrieval, model, frontend, or schema code; no
  migration; no dependency added; no service defined in compose.
- **No work package.** MSG-0053 C7 and MSG-0054 both withhold it. EPA-0002 is a proposal written in
  the conditional and authorizes nothing.
- **No ADR.** Six are proposed by title; none is created, and no number is allocated.
- **No task marked READY.** No downstream task exists, by design.
- **Nothing verified by execution.** This is a definition task and produced no runnable artifact, so
  there is no test count to report. Its acceptance criteria are documentary and are evidenced by the
  files themselves, mapped in §9.

## 9. Acceptance criteria — TASK-0021

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| 1 | Objective established as outside WP-0001, requiring a new work package | **MET** | EPA-0001 §1; §3 above |
| 2 | No implementation, feature, supervisor behaviour, permission model, or product architecture changed | **MET** | §8; `git status` shows only new files under `implementation/` |
| 3 | Approved-document authority, lifecycle, version, supersession defined | **MET** | EPA-0001 §3 |
| 4 | Grounded-answer contract prevents unsupported claims; requires authoritative citations | **MET** | EPA-0001 §5 |
| 5 | English/Arabic behaviour explicit, including cross-language boundaries | **MET — with its central question left open as D1**, which is the correct outcome, not a gap | EPA-0001 §6; EPA-0003 D1, D2, D6 |
| 6 | Authorization defined at retrieval time, not only at the frontend | **MET** | EPA-0001 §7.1 — four enforcement points; §9 states the frontend enforces nothing |
| 7 | Audit and retention defined without exposing unnecessary sensitive content | **MET** | EPA-0001 §10; EPA-0003 D7 |
| 8 | Security threats and mitigations identified, including prompt injection and exfiltration | **MET** | EPA-0001 §8 — T1–T11; EPA-0002 G6 |
| 9 | Integration with the kernel, `/data` boundary, and existing controls explicitly bounded | **MET** | EPA-0001 §1 reuse table, §13 conflict check; EPA-0002 G11 |
| 10 | Dependency-ordered sequence and acceptance gates proposed | **MET** | EPA-0002 §3 (G1–G11), §5 (T-A…T-I) |
| 11 | Unresolved substantive choices recorded as lead decisions rather than guessed | **MET** | EPA-0003 — fourteen, each with options and a recommendation |

**All eleven criteria are met.** TASK-0021 is reported COMPLETE as a definition task — and definition
is the whole of what it was authorized to do.

## 10. Decision requested

1. **Accept, amend, or reject EPA-0001** as the architecture boundary for this objective.
2. **Rule on the fourteen decisions in EPA-0003**, or on the four marked Highest, which are enough to
   unblock the foundation.
3. **Decide whether the work package is authorized**, and if so allocate its identifier (see §7.1).
4. Optionally rule on §7.2 (task ordering) and D12 (whether the grounded-answer contract becomes an
   accepted ADR).

Nothing proceeds until 1 and 3. **No further task is READY and the Supervisor will remain idle**,
which is the correct state at an architecture decision boundary.
