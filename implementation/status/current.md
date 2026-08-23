# PCI Implementation Status

**Active Work Package:** WP-0001 — PCI Kernel Foundation
**Status:** **COMPLETE** — declared by the architecture lead 2026-08-19 (MSG-0020(b), resolved by MSG-0022 / MSG-0023, TASK-0009)
**Last Updated:** 2026-08-23 UTC — **TASK-0033 COMPLETE (8/8)**. The probe ran against **SQLite 3.51.3 embedded in Node** (`node:sqlite`) — 24 executions, 6 fixtures, all three tiers. **Tier 1 and Tier 2 passed; Tier 3 decided it against the candidate**: every query shape examines unauthorized rows growing linearly with the collection, while returning results **indistinguishable from a conforming engine's**. Verdict **NOT CLEARED**; classes S, V, K NOT CLEARED with no evidence. **My MSG-0102 environment finding was wrong** — corrected by MSG-0103. No engine adopted; no ADR touched.

> **The line this replaces, retained:** "**TASK-0033 is READY and was attempted once, stopping before it started (MSG-0103).** A supervisor-started runner held the lock from **06:37:18Z**; at **06:39:24Z** a concurrent interactive session committed `55a617c` — the task's own reconciliation — moving `HEAD` **and** `origin/main` under it. **Both the global abort rule (MSG-0028 d2) and TASK-0033's own *"stop if `origin/main` moves mid-run"* fired.** **The probe was never built or run: no candidate evaluated, no verdict, no `EPA-0007`, no ADR touched, nothing installed, no corpus entered.** The move was benign and convergent, **and that was deliberately not treated as licence to continue.** **The condition has cleared** — `HEAD` = `origin/main` = `55a617c` — so **the next supervisor cycle should simply run the task.** **One correction was left behind and it changes the probe's scope: Tier 2/3 are NOT gated for class R.** `sqlite3` the *CLI* is absent, but **SQLite 3.51.3 with FTS5 is embedded in the Node runtime already recorded as available** (`node:sqlite`), exposing `EXPLAIN QUERY PLAN` and counter instrumentation with **no install, no PATH change, no network, no Docker** — so **all three EPA-0006 §4.4 tiers are obtainable against one class-R test subject.** **Capability evidence, explicitly not a conformance verdict.** Classes **S and V stay unreachable**, **K unmeasured**, **criterion 6 unsettleable for S/V**, and **`NOT CLEARED` remains correct wherever evidence is absent.** **Scheduler enabled.**" True when written; **the prediction it made held.** The very next supervisor cycle ran the task to completion, and **the environment correction it left behind was re-verified in that session and was correct** — all three tiers were obtained against a class-R subject. **Its `NOT CLEARED` expectation also held, and for a reason it did not anticipate**: not because evidence was absent, but because the evidence obtained was **adverse** (MSG-0104).

> **The line this replaces, retained:** "**TASK-0032 COMPLETE**, delivering `EPA-0006` and selecting nothing. **MSG-0101 rules MSG-0100's five referrals** — "one projection index" is one **logical** projection, the fusion layer must never resolve authorization, SUPERSEDED chunks not settled now — and authorizes **TASK-0033**, a bounded conformance probe, now READY. **Its Tier 2/3 evidence is gated**: Docker engine not reachable, so unobtainable evidence is **NOT CLEARED**, never conformance (MSG-0102). **Scheduler is enabled again.**" True when written; the gating claim is **corrected above** — it holds for classes S, V and K, not for class R.

> **The line this replaces, retained:** "**AMD-01 APPLIED IN PLACE** (TASK-0031, MSG-0097): only ADR-0020 changed in `docs/decisions/`, hunk 1 present exactly once, header note recorded. **MSG-0098 authorizes TASK-0032** — bounded A-STACK **technology** evaluation against the settled Approach C and the amended ADR-0020; **selects nothing**, invents no benchmarks. Not a re-run of TASK-0026 (MSG-0099). Scheduler Disabled." True until the supervisor cycle at 05:57:17Z started that task and completed it the same morning.

> **The line this replaces, retained:** "**AMD-01 ACCEPTED (MSG-0095)** with the traceability row, to be applied **in place**; that settles AMD-01 §8 as option (a), the repository's first amendment of an accepted ADR. **TASK-0031 READY** — three edits, wording verbatim from AMD-01, `docs/decisions/` limited to ADR-0020. No engine or technology selected; ADR-0019 untouched. Scheduler Disabled." True until the next supervisor cycle started that task and completed it the same morning.

> **The line this replaces, retained:** "**EPA-0005 ACCEPTED (MSG-0092)**: three §9.1 constraints settled, **Approach C** chosen for the runtime seam, **no generic stack ADR**. Recorded in EPA-0005's header; **not promoted** — promotion is the Lead's act. **TASK-0030 READY** — draft the minimum ADR-0020 clarification as an engine-selection gate, **then stop before applying**. Nine selection categories stay open; ADR-0019 deferral unchanged. Scheduler Disabled." True until the next supervisor cycle started that task and completed it the same day.

> **The line this replaces, retained:** "**BLK-0010 RESOLVED; TASK-0027 (A-SURVEY, n=1) is READY and
> unblocked.** MSG-0083 authorized **option A**: a narrow read-only grant for `D:Workpci-corpus` only,
> applied to `runner-settings.json` and **verified empirically** (641,807 bytes, `%PDF-1.7`; writes
> denied; three ineffective deny rules removed). **Nothing broadened.**" True until the next supervisor
> cycle exercised that grant and completed the task.

> **The line this replaces, retained:** "**TASK-0027 is READY in the committed queue** (A-SURVEY, n=1)
> and not yet run. **BLK-0008 and BLK-0009 both RESOLVED** … **MSG-0082 raises a decision** — the
> corpus sits outside the repo by MSG-0080, and the runner may not read outside it." True when written
> at ~09:51Z; the very next supervisor cycle tested that decision and hit the wall it predicted.

> **The line this replaces, retained:** "2026-08-21 UTC (**MSG-0073 answers MSG-0072** — **TASK-0025
> authorized** to promote ADR-0018…ADR-0022 and reconciled into the queue as the single READY task,
> MSG-0074; not started)." True until the Supervisor's 20:47:18Z cycle started the task, the next one
> after that reconciliation was pushed.

> **The line this replaces, retained:** "2026-08-21 UTC (**TASK-0023 COMPLETE** — WP-0009 allocated,
> MSG-0066; **MSG-0067** rules the carried-forward items; **MSG-0068 authorizes TASK-0024 (A-ADR)**,
> reconciled into the queue as the single READY task — MSG-0069; Supervisor re-enabled and live)."
> True until TASK-0024 executed later the same day — started by the Supervisor's 19:27:19Z cycle, the
> next one after that reconciliation was pushed.

> **The line this replaces, retained:** "2026-08-21 UTC (**EPA-0004 ACCEPTED** by MSG-0062 with all
> seven items ruled; **MSG-0063 authorizes TASK-0023**, reconciled into the queue as the single READY
> task and **not started** — MSG-0064; BLK-0007 raised and resolved)." True until TASK-0023 executed
> later the same day.

## Current State

Architecture and documentation baseline is established. Permanent Claude Code operating rules are defined in `CLAUDE.md`. The initial server bootstrap contract is defined in `docs/operations/pci-server-bootstrap.md`.

**WP-0001 has been verified against real infrastructure.** The authorized Ubuntu host is
bootstrapped, Docker runs with `DockerRootDir` = `/data/docker`, PostgreSQL runs as a container with
its volume inside that boundary, and the full test suite has executed on the target platform:
**229 tests pass, 0 fail** across unit (102), contract (101), and integration (26).

All ten acceptance criteria are met. The ADR-0016 tenant-isolation obligations — FORCE RLS, a
runtime role without SUPERUSER or BYPASSRLS, cross-tenant reads blocked, fail-closed on missing
tenant context — are proven against a live database rather than asserted.

**Two defects were found by running the stack for the first time**, and they matter more than the
green result: the database init script creates a passwordless role and reports healthy anyway
(DISC-0007), and the compose kernel service cannot start as committed (DISC-0008). Neither weakens
the verified kernel, but together they mean **a clean checkout plus `docker compose up` still
produces a broken stack**. WP-0001 is verified; it is not yet deployable.

## Implementation Environment

- Initial implementation host: customer-controlled Ubuntu PCI server.
- Implementation account: `claude`.
- Source workspace on the host: `/data/pci-platform` (mandatory).
- Runtime/application data boundary: `/data/docker` (mandatory).
- **No PCI artifact of any kind may exist outside `/data` on the PCI server** (contract v0.2,
  MSG-0006).
- Container runtime: Docker.
- Host address: intentionally not stored in Git.
- Authoring host (this machine): Windows, no Docker and no PostgreSQL. It is a workstation
  checkout only, and is not an execution host. The `/data` boundary governs the PCI server; it
  does not apply to this workstation.

## Execution Queue

The execution-control system (Phase 0, MSG-0010):

| Artifact | Purpose |
|---|---|
| `implementation/operations/ROADMAP.md` | A→Z plan from the post-bootstrap state to genuine WP-0001 completion: dependencies, five verification gates, architecture and operator boundaries, completion criteria |
| `implementation/operations/CLAUDE-TASKS.md` | **Authoritative execution queue** — status board, communication ledger, per-task prerequisites, allowed/forbidden actions, verification, documentation, checkpoint, stop conditions, recovery, next eligible task |
| `implementation/operations/checkpoints/` | Resumable state; one file per IN_PROGRESS task |

Every session reads the roadmap and queue at startup and executes the highest-priority READY task,
continuing automatically through authorized work rather than stopping after each subtask.

> **Corrected 2026-08-21 by TASK-0024 — additive and declared.** The sentence below opened "**Current
> task: TASK-0019**", which was true when written and has been stale since TASK-0021. The task table
> immediately below already showed TASK-0021 through TASK-0024 COMPLETE, so this file contradicted
> itself within a few hundred words — the defect Rule 12 exists to catch. **The most recent task is
> TASK-0024 (COMPLETE, MSG-0070), and no task is READY.** The historical account of TASK-0019 is
> retained unchanged because it is still the record of what that task did.

**TASK-0019 — the post-WP-0001 repository baseline audit, authorized by MSG-0050 and
executed 2026-08-21 by a supervisor-started session.** TASK-0001 and TASK-0003 through TASK-0018 are
COMPLETE. TASK-0003
was authorized by MSG-0027, executed on 2026-08-20 by a supervisor-started session, and completed
later the same day once MSG-0030 authorized the refresh command — CRLF residue 150 -> 0, accepted in
MSG-0031. TASK-0011, the Supervisor smoke test, completed 2026-08-20 (MSG-0032). TASK-0013 applied
the MSG-0035 maintenance decisions on 2026-08-20 (MSG-0036), again unattended. TASK-0014 added the
missing BLK-0005 row to the blocker index on 2026-08-20 under MSG-0037 (MSG-0038) — the third
consecutive unattended delivery. TASK-0015 reconciled the discoveries index on 2026-08-20 under
MSG-0039 (MSG-0040) — three rows to nine — making it the fourth. TASK-0016 closed the last OPEN
message on 2026-08-20 under MSG-0041 (MSG-0042) — the fifth.

| ID | Task | Status | Depends On | Owner |
|---|---|---|---|---|
| TASK-0001 | WP-0001 verification on the authorized host | **COMPLETE** | — | Claude Code |
| TASK-0004 | Fix database role provisioning (DISC-0007) | **COMPLETE** — G1 passed | TASK-0001 | Claude Code |
| TASK-0005 | Fix compose kernel service configuration (DISC-0008) | **COMPLETE** — G2 passed | TASK-0001 | Claude Code |
| TASK-0006 | Clean-room reproducibility verification | **COMPLETE** — G3 passed | TASK-0004, TASK-0005 | Claude Code |
| TASK-0007 | Full re-verification after fixes | **COMPLETE** — G4 passed | TASK-0006 | Claude Code |
| TASK-0008 | Final report and status reconciliation | **COMPLETE** — G5 passed | TASK-0007 | Claude Code |
| TASK-0009 | WP-0001 completion decision | **COMPLETE** — WP-0001 declared complete | TASK-0008 | Architecture lead |
| TASK-0003 | Normalise `*.md` line endings (DISC-0006) | **COMPLETE** (2026-08-20) — CRLF 150 -> 0, accepted in MSG-0031 | — | Claude Code |
| TASK-0010 | Execution Supervisor (installed and **ENABLED**) | **COMPLETE** | — | Claude Code |
| TASK-0011 | Execution Supervisor smoke test — COMMS audit, end to end | **COMPLETE** (2026-08-20) — passed, MSG-0032 | TASK-0010 ✅ | Claude Code |
| TASK-0013 | Apply MSG-0035 maintenance decisions — blocker index + COMMS numbering rule | **COMPLETE** (2026-08-20) — MSG-0036 | TASK-0011, MSG-0035 ✅ | Claude Code |
| TASK-0014 | Reconcile BLK-0005 in the blocker index | **COMPLETE** (2026-08-20) — MSG-0038 | TASK-0013, MSG-0037 ✅ | Claude Code |
| TASK-0015 | Reconcile the discoveries index with the actual `DISC-*.md` records | **COMPLETE** (2026-08-20) — 3 rows -> 9, MSG-0040 | TASK-0014, MSG-0039 ✅ | Claude Code |
| TASK-0016 | Close the resolved MSG-0034 informational record | **COMPLETE** (2026-08-20) — closure verified, MSG-0042 | TASK-0015, MSG-0041 ✅ | Claude Code |
| TASK-0017 | Supervisor heartbeat / unattended observability | **COMPLETE** (2026-08-20) — tests 36/36, MSG-0047 | TASK-0016, MSG-0043 ✅ | Claude Code |
| TASK-0018 | Live Supervisor heartbeat validation | **COMPLETE** (2026-08-21) — all five gates, MSG-0049 | TASK-0017, MSG-0048 ✅ | Claude Code |
| TASK-0019 | Post-WP-0001 repository baseline audit | **COMPLETE** (2026-08-21) — MSG-0051 | TASK-0018, MSG-0050 ✅ | Claude Code |
| TASK-0021 | Employee policy assistant — architecture definition | **COMPLETE** (2026-08-21) — 11/11 criteria, MSG-0055 | WP-0001 COMPLETE, MSG-0054 ✅ | Claude Code |
| TASK-0022 | Employee policy assistant — work-package definition | **COMPLETE** (2026-08-21) — `EPA-0004` delivered as PROPOSED, MSG-0061 | TASK-0021, MSG-0058, MSG-0059 ✅ | Claude Code |
| TASK-0023 | EPA work-package governance reconciliation | **COMPLETE** (2026-08-21) — 7/7 criteria, **WP-0009 allocated**, MSG-0066 | TASK-0022, MSG-0062, MSG-0063 ✅ | Claude Code |
| TASK-0024 | A-ADR — draft the required EPA ADR set | **COMPLETE** (2026-08-21) — 8/8 criteria, **ADR-0017…ADR-0022 drafted PROPOSED**, MSG-0070 | TASK-0023, MSG-0062, MSG-0067, MSG-0068 ✅ | Claude Code |
| TASK-0025 | Promote ADR-0018…ADR-0022 into the accepted decision register | **COMPLETE** (2026-08-21) — 5/5 criteria, **five ADRs promoted, zero body differences**, MSG-0075 | TASK-0024, MSG-0071, MSG-0073 ✅ | Claude Code |
| TASK-0026 | A-SURVEY + A-STACK — bounded corpus survey and stack evaluation | **COMPLETE (PARTIAL)** (2026-08-22) — **5/6 criteria; criterion 1 UNMET on PR5**. A-STACK delivered **EPA-0005**; **A-SURVEY not performed**, MSG-0078 | TASK-0025, MSG-0071, MSG-0076 ✅ | Claude Code |
| TASK-0027 | A-SURVEY (n=1) — inspect the approved/synthetic corpus | **COMPLETE** (2026-08-22) — **7/7 criteria**; PDF inspected in place, repository boundary held, **MSG-0084** | TASK-0026, MSG-0080, MSG-0083 ✅ | Claude Code |
| TASK-0028 | A-SURVEY Arabic follow-up (n=1) — inspect `Arabic.pdf` | **COMPLETE** (2026-08-22) — 9/9, MSG-0087; **OCR-derived (ABBYY FineReader) — the class D14 rejects** | TASK-0027, MSG-0085 ✅ | Claude Code |
| TASK-0029 | A-SURVEY Arabic text-native follow-up (n=1) | **COMPLETE** (2026-08-22) — 11/11, MSG-0089; **text-native and D14-admissible**; **Arabic stored in visual order** | TASK-0028, MSG-0088 ✅ | Claude Code |
| TASK-0030 | Draft the minimum ADR-0020 clarification — pre-constrained retrieval as an engine-selection gate | **COMPLETE** (2026-08-22) — **7/7 criteria**; `ADR-0020-AMD-01` **PROPOSED, NOT applied**; **MSG-0094** | EPA-0005 ACCEPTED (MSG-0092) ✅ | Claude Code |
| TASK-0031 | Apply ADR-0020 AMD-01 in place | **COMPLETE** (2026-08-23) — **7/7 criteria**; applied in `a1be892`, **15 insertions / 0 deletions**, one file under `docs/decisions/`; **MSG-0097** | AMD-01 ACCEPTED (MSG-0095) ✅ | Claude Code |
| TASK-0032 | A-STACK **technology** evaluation and implementation planning (bounded) | **COMPLETE** (2026-08-23) — **7/7 criteria**; **`EPA-0006`** delivered **PROPOSED, selecting nothing**; `git diff --name-only docs/decisions/` **empty**; **MSG-0100** | MSG-0098 AUTHORIZED, EPA-0005 ACCEPTED, ADR-0020+AMD-01 applied ✅ | Claude Code |
| TASK-0033 | Bounded retrieval-engine conformance probe (evaluation only) | **COMPLETE** (2026-08-23, run 2) — **8/8 criteria**; probe executed, **24 candidate runs across 6 fixtures**, all three tiers; **nothing CLEARED** — class R **NOT CLEARED** at Tier 3, class D **DISQUALIFIED** and demonstrated, classes S/V/K **NOT CLEARED** with zero evidence; `git diff --name-only docs/decisions/` **empty**; **MSG-0104**. Run 1 (MSG-0103) stopped before starting and is retained as history | MSG-0101 AUTHORIZED, EPA-0006, ADR-0020+AMD-01 ✅ | Claude Code |
| TASK-0002 | Make test entry points shell-independent | **ABORTED** | — | — |

> **Reconciled 2026-08-22 by TASK-0030 — additive and declared.** The three rows above were missing:
> the table stopped at TASK-0027 while TASK-0028 and TASK-0029 had both executed and completed, so
> this file's own table lagged the queue by two tasks. **No existing row was altered.** The queue at
> `implementation/operations/CLAUDE-TASKS.md` was correct throughout and remains the authoritative
> board; this is the status file catching up to it.

**No task is READY** — but the reason has changed. The project now sits at an **architecture decision
boundary**, not at an empty queue.

> **Superseded — corrected 2026-08-21 by TASK-0021.** This paragraph previously read "**No task is
> READY.** TASK-0019 was the last authorized one and it is COMPLETE. What happens next is an
> architecture-lead decision: MSG-0051 §C lists the candidates …". That was true when written and
> stopped being true when MSG-0053 closed C6/C7 and MSG-0054 authorized TASK-0021. TASK-0021 has since
> been executed and is COMPLETE (MSG-0055). MSG-0051 §C is fully discharged: C1–C5 by MSG-0052,
> C6–C7 by MSG-0053.

**Current position, 2026-08-23 after TASK-0032: no task is READY, and the boundary is back to being a
document awaiting review — but a different kind of document, and the difference matters.**

TASK-0032 executed MSG-0098 and is **COMPLETE** — **7/7 acceptance criteria MET**, each mapped to evidence
in **MSG-0100** §3. Being documentary it produced **no test count and claims none**. It was run by a
supervisor-started session (`runner.lock` pid 16664, acquired 05:57:17Z) against starting `HEAD = dfc7822`.

**The deliverable is [`EPA-0006`](../architecture/EPA-0006-assistant-technology-evaluation.md) — PROPOSED,
and it selects nothing.** `git diff --name-only docs/decisions/` is **empty**: the accepted ADR set,
including the ADR-0020 amended a few hours earlier by TASK-0031, is untouched.

**This is not a re-run of TASK-0026, and the label makes that worth stating in the status file too.** Both
tasks are called "A-STACK" and WP-0009 §6.2 lists A-STACK once, already reading EXECUTED. TASK-0026 asked
what **shape** the stack should be — one runtime or two — and produced EPA-0005. TASK-0032 asked which
**technology classes** fit *inside* the settled shape. **Neither of its two inputs existed when EPA-0005 was
written**: Approach C was chosen by MSG-0092 *after* EPA-0005 was delivered, and AMD-01 was applied on the
morning of this run. The distinction is now recorded in three places — WP-0009 §6.2, the architecture
README, and MSG-0100 §5 — so it survives without the conversation that produced it.

**The amendment applied yesterday morning was used, and it did the work it was written to do.** ADR-0020 §4
as amended disqualifies an engine that can only match or rank first and exclude afterwards, *"including
over-fetching a wider candidate set and discarding the surplus, at any layer."* Applied to seven candidate
classes with reasoning rather than assertion: **post-filter-only similarity search is DISQUALIFIED**
directly, needing no test; **hosted and managed retrieval services are DISQUALIFIED twice over on
independent grounds** — ADR-0022 §1 names *derived embeddings* explicitly, so relaxing one elimination would
not revive the class. **Relational engines, search engines with filtered kNN, purpose-built vector stores
and lexical-only engines are NOT disqualified and are explicitly NOT cleared**, because each is a *class*
within which conforming and non-conforming members both exist. **Retrieval computed against the kernel store
conforms structurally** — the candidate set *is* an authorized query result, so there is no wider set to
over-fetch from — **and its cost is entirely unmeasured.**

**The finding most likely to change what an implementer does is that AMD-01 carries two obligations and they
are easy to conflate.** An engine that accepts the fully constrained query and then satisfies it by
**over-fetching internally** receives a **conformant query** and returns a **correct response**. G3 inspects
the query. **So G3 evidence cannot tell that engine apart from a conforming one**, and a project collecting
only G3 evidence will believe the engine is cleared when it is not. Engine clearance needs execution
evidence of its own — a query plan, engine counters, and an inspection of the engine's own logs — and
**an engine that exposes none of that cannot be cleared at all.** **This is not a defect in AMD-01 and no
amendment is proposed:** AMD-01 states both obligations; it simply does not say that the second fails to
discharge the first, because it is answering a different question.

**Nine further findings sit behind it**, and EPA-0006 §14 states, one by one, why **none of the ten requires
an ADR change** — naming the accepted section each already follows from, which is the check against the
record having quietly amended architecture. The four with the most consequence: **the retrieval port's
signature is itself the control** — a port typed `search(queryText, k)` makes the conforming design
*unrepresentable* and has mandated post-filtering, so authorization context must be a **required** parameter
with no unconstrained variant, including at the Approach C worker seam; **no index-assigned identifier may
ever appear in a citation**, because ADR-0020 §1 requires a rebuild be a no-op with respect to answers and a
rebuild that reassigns identifiers would silently invalidate every citation already issued; **the kernel's
verified append-only audit store is disqualified for conversation content**, by the very property that makes
it good audit storage — append-only and ADR-0021 §3's *"expiry actually deletes"* cannot both hold; and
**ADR-0020 §6.2's logging prohibition is a selection criterion on the index engine and the model serving
runtime**, not only a coding rule, since a serving runtime that logs prompts logs policy passages and an
engine's slow-query log is not exempt because the application wrote nothing.

**The failure mode MSG-0099 predicted did not occur, and that is the part worth checking rather than
trusting.** A technology comparison invites throughput, latency, memory and recall figures. **None appears
anywhere in EPA-0006** — not as an estimate, a typical value, a range, or a vendor claim presented as fact.
**PR4 is NOT MET, PR6 is UNKNOWN, no benchmark has ever been run here, and A-SURVEY has run only at n=1,
three times, on three producers.** Where a number does appear it is a **count derived from ADR text with the
derivation shown**: at least three model invocations on the critical path of one English answer — embed the
question, generate, entail — with a cross-language answer adding at least one more. **Product naming was
held to two places and disclaimed**, because the discriminating property is filter *execution strategy*,
which is not reliably determinable from documentation and was not determinable at all from that session;
recording one would have been the vendor-claim-as-fact the authorization forbids.

**Nothing was selected.** Ten selections are recorded OPEN with what would close each. **ADR-0019 is
untouched and no Arabic normalization rule was written, inferred, or proposed** — MSG-0091's scoping holds,
and the one n=1 observation that bears on it (detached diacritics) is recorded as **input to** the deferred
rule and explicitly not as any part of it. **No ADR was created, amended, or proposed**, and EPA-0006 §12.3
recommends against a new one for the reason EPA-0005 §9.3 gave. **No implementation task is READY.**

**Five items are referred to the Architecture Lead and none blocks anything** (MSG-0100 §10). The one with
the most leverage: **the engine conformance probe is the only substantial piece of evidence in the whole
evaluation that is not blocked on the organization or the operator.** Everything else — corpus scale, format
mix, the organization's own authoring toolchain, D14 exposure, PR4, PR6 — waits on someone outside this
repository. It is named as a sequencing observation and is **explicitly not proposed as a task, marked
READY, or self-authorized.**

> **The position after TASK-0031, retained.** "**Current position, 2026-08-23 after TASK-0031: no task is
> READY, and for the first time the boundary is not a document awaiting review — the architecture record is
> settled and the queue is simply empty.**" True when written, at ~08:11Z. The very next supervisor cycle
> authorized and ran TASK-0032, so the queue is again empty — but the boundary has moved back to a
> document: **EPA-0006 awaits the Lead's reading.** Everything the paragraphs below say about **TASK-0031
> and the amendment** remains exact and is unchanged by this task.

**Position after TASK-0031 (superseded, retained): no task is READY, and for the first time the boundary
is not a document awaiting review — the architecture record is settled and the queue is simply
empty.**

TASK-0031 executed MSG-0095 and is **COMPLETE** — **7/7 acceptance criteria MET**, each mapped to
evidence in **MSG-0097** §3. Being documentary it produced **no test count and claims none**.

**ADR-0020 is amended, and this is the first time this repository has edited an accepted, promoted
ADR.** Every prior task in WP-0009 was forbidden to; MSG-0095 §3 authorizes *"acceptance/application
of AMD-01 only"*, so the prohibition stands everywhere else. Three edits went in, with the wording
taken **verbatim** from AMD-01 rather than retyped — transcription drift inside an accepted ADR being
the one failure this task could not be allowed to introduce:

1. **Hunk 1**, the 148-word engine-selection and gate-evidence clause, at the **end of §4** after
   *"An exclusion cannot fail open; a filter can."*
2. **Hunk 2**, one **Traceability** row tracing the new text to MSG-0092 §1(1)/§3 and EPA-0005 §3.3.
3. **The header note** — `**Amended:** 2026-08-23 — AMD-01 (MSG-0095), applied in place: §4
   engine-selection criterion`.

**The verification came out stronger than the criterion asked for, and the reason is worth keeping.**
`git diff --stat` reads **15 insertions, 0 deletions**. The task's own check anticipated a modified
header line — it allowed "no substantive deletions (**header line change aside**)" — but the note was
added as a **new** line instead of rewriting one, so **no existing line changed anywhere in the
file**. The practical consequence is that the four enforcement points, §3's closing line, §4's
existing text and its MSG-0062 §7.6 block quote, §5's fail-closed rule and three named side channels,
§6's Restricted carve-out and its three obligations, §7's *"No index technology, embedding model,
vector store, or search engine is selected here"*, Consequences and *Deliberately not decided here*
are **byte-identical** to the promoted copy — not "reviewed and found equivalent", but untouched.

**The real hazard was double application, and it was checked before acting rather than after.**
Re-running this task against an already-amended ADR would insert hunk 1 **twice**, and a duplicated
clause in an ADR whose whole purpose is removing ambiguity is worse than a missing one — `CLAUDE.md`
recovery rule (f) in its sharpest form. The amendment was verified **absent three ways** first (§4
ended at the quoted sentence; the Traceability table had 11 rows and no engine row; the header had no
`Amended:` line), with a fourth signal agreeing — no `TASK-0031.md` checkpoint existed. After
applying, each of the four new markers occurs **exactly once**.

**AMD-01 §8 is settled: option (a), in place.** The repository had **no precedent** for amending an
accepted ADR — ADR-0015 and ADR-0016 carry `Supersedes:` lines, but those record promotion of a
*draft*, not amendment of an *accepted record*. MSG-0095 chose (a) and explicitly declined (b):
*"Do not create a superseding ADR."* **That is now the precedent — for an additive clarification that
changes no substantive policy, and for nothing wider.**

**Nothing was selected, and the amendment says so in its own second paragraph:** *"This criterion
selects no engine and rules none in."* A search of the whole amended file for twenty product names —
search engines, vector stores, model runtimes, frameworks, datastores — returns **no matches**. All
nine MSG-0092 §4 categories remain open, ADR-0019's §6 Arabic deferral and its production-evidence
gate are untouched, no Arabic normalization rule was written, ADR-0017/0018/0019/0021/0022 were not
touched at all, and **no implementation task was marked READY**.

**Two runner limits were recorded rather than routed around**, and a future session will hit both.
**`git fetch` is off the Bash allowlist** and was refused, exactly as the queue section's *Known
runner limit* note predicts — so the `origin/main` comparison quoted in MSG-0097 §4 is the local
remote-tracking ref, and it is reported as such. The stronger evidence arrived afterwards: **the push
was accepted**, which a mid-run move would have turned into a rejected non-fast-forward. **`python`
is also off the allowlist**, along with compound shell forms using redirection or process
substitution, so the intended file-level `diff` of the two hunks could not run; the comparison was
done with the permitted file tools and the applying commit's diff is left as re-readable evidence
rather than asking anyone to take it on trust.

**What is now open is only the next authorization.** The queue is empty **by design** — TASK-0031's
own section names its next eligible task as *"none — no implementation is authorized by MSG-0095"* —
so the supervisor idling on `no READY task` is correct behaviour, not a stall. WP-0009 still reads
`DEFINED — NOT AUTHORIZED FOR IMPLEMENTATION`, and the three open items in its §8 (the T-D/T-E
interim mitigation, PR3's owner and date, and the planning relationship) are unchanged by this task.

> **Superseded — the position after TASK-0030, retained.** The paragraphs below were written while
> the amendment was a draft awaiting review. **That boundary has been passed**: MSG-0095 reviewed and
> accepted it, and TASK-0031 applied it. Their account of *what* the amendment says and *why* it was
> needed is still exact and is the best short explanation in the repository; only the "PROPOSED and
> NOT applied" state has changed. **Both items they refer to the Lead are now discharged** — the
> amendment convention was ruled by MSG-0095, and the criterion-scope conflict was fixed exactly as
> recommended, TASK-0031's criterion 4 reading `git diff --name-only docs/decisions/`.

**Current position, 2026-08-22 after TASK-0030 (superseded, retained): no task is READY, and the
boundary is a draft the Architecture Lead has not yet reviewed.**

TASK-0030 executed MSG-0092 §3 and is **COMPLETE** — **7/7 acceptance criteria MET**, each mapped to
evidence in **MSG-0094** §7. Being documentary it produced **no test count and claims none**.

**The deliverable is a proposal, and the boundary it respected is the whole point of the task.**
[`ADR-0020-AMD-01`](../decisions/ADR-0020-AMD-01-pre-constrained-retrieval-engine-criterion.md) is
**PROPOSED and NOT applied**. `git diff --name-only docs/decisions/` is **empty** — the accepted,
promoted ADR-0020 is unmodified. **Editing a promoted ADR is the Lead's act**, exactly as promotion
was (TASK-0025 / MSG-0073), and MSG-0092 §5 said so in terms: *"stop before applying the amendment
unless a subsequent explicit authorization permits acceptance."*

**The "no amendment is needed" outcome was a real possibility and it was tested, not assumed.** The
queue permits it explicitly. Reading §§3–4 in the accepted copy shows **the policy is already
unambiguous**: §3.1 requires the candidate set be built "already constrained" and says "Unauthorized
content is never a candidate"; §4 makes retrieve-then-filter "a **gate failure**". **Nothing in the
draft changes any of that.**

**What is missing is consequence, in two specific places** — and both are what an implementer gets
wrong rather than what a reviewer would notice:

1. **The rule never says it disqualifies an engine.** As written it reads as a constraint on how the
   assistant is built, which a permissive reading satisfies with any engine plus careful surrounding
   code — the exact reading that lets post-filtering through.
2. **The ADR never says what G3 inspects.** §3 closes with "A design in which three are decorative
   fails G3 however correct its output looks" — the right failure, no evidence rule. **A conforming
   design and a retrieve-then-filter design return byte-identical responses**, so a gate evidenced
   from the response cannot tell them apart. The draft's answer: **G3 is evidenced against the query
   issued to the engine, not the response returned to the caller.**

**The amendment is one 148-word insertion at the end of §4, and twelve candidate changes were
deliberately not made** (MSG-0094 §4). The two worth naming: **§3's four numbered points were not
edited**, because rewording accepted policy text to make a §4 point is a rewrite rather than a
clarification; and **§7 and *Deliberately not decided here* were left exactly as they are**, because
**a criterion is not a selection** — §7 must go on saying no index technology is selected, and it
does.

**Nothing was selected.** All nine MSG-0092 §4 categories remain open, ADR-0019's §6 deferral is
untouched, no Arabic normalization rule was written, ADR-0017/0018/0019/0021/0022 were not touched at
all, and no implementation task was marked READY.

**Two items are referred to the Lead, neither blocking.** (1) **How an accepted ADR is amended** — the
repository has **no precedent**: ADR-0015 and ADR-0016 carry `Supersedes:` lines, but those record the
promotion of a *draft*, not the amendment of an accepted record. **No header change was drafted**,
because inventing the convention is the silent architecture change this task forbids. (2) **A conflict
inside TASK-0030's own specification** (MSG-0094 §11): criterion 5 requires `git diff --name-only
docs/` to be empty, while the same task's Documentation section requires updating **WP-0009**, which
lives under `docs/`. The WP-0009 update was made — **one added row, nothing modified or deleted** —
and the deviation is reported rather than hidden by skipping the update or by quoting a narrower
command as though it were the one asked for. **The durable fix is one word**: scope the check to
`docs/decisions/`.

> **Superseded — the position after TASK-0027, retained.** The paragraphs below were written when the
> corpus half of the boundary had just moved from "no corpus" to "one document". **Everything they say
> about the corpus, D6, ADR-0019 and D14 is still true and still outstanding** — TASK-0030 was a
> governance drafting task and moved none of it.

**Current position, 2026-08-22 after TASK-0027 (superseded, retained): no task is READY, and for the
first time the corpus half of the boundary has actually moved — but only from "no corpus" to "one
document".**

TASK-0027 executed MSG-0080 under MSG-0083's read grant and is **COMPLETE**. All seven acceptance
criteria are MET, each mapped to evidence in **MSG-0084** §3. Being documentary it produced **no test
count and claims none**.

**The boundary that mattered most was the one that held silently.** The corpus is deliberately outside
the repository, and every COMMS cycle and every runner executes `git add -A`; the file arrived inside
the working tree once already and was one commit from permanent history. **It never entered the
repository**, verified four ways rather than once: `git status --porcelain` empty, the file present at
its external path, **no** `plan.pdf` under `D:\Work\pci-platform`, and **no PDF in any commit in this
repository's history**. The survey read it in place.

**What the survey establishes is real and narrow.** The document is **text-native, not scanned** —
107,988 characters decoded from all 45 pages with **zero** undecodable glyphs, and only **two** image
XObjects in the whole file (a 103×92 logo and its transparency mask), so **D14 would not reject it**. It
is **English only — zero Arabic characters** — confirmed structurally rather than by counting alone: all
five `ToUnicode` CMaps target Basic Latin plus four punctuation marks, and every simple font uses
`WinAnsiEncoding`, which cannot encode Arabic. It declares **three different English locales**
(`en-US` in the catalog, `en-ZA` 1,819 times and `en-GB` 46 times in marked-content spans), which is
worth keeping: **a document's own declared language is not a single reliable value even within one
language.** It carries **no classification marking of any kind**, and its version and approval exist
**only as title-page prose** — `Developed: June 2010`, `Revised: November 2024`, blank `Date` fields, and
a handwritten-signature convention.

**The absence is the part that changes an architectural obligation.** **At least one real approved policy
document carries none of ADR-0018's authority, lifecycle, version, effectivity or supersession metadata
in-band** — so all of it must be supplied at ingestion, by a human or a system outside the file. That is
an *existence* claim, which n=1 can carry; it is **not** a claim about policy documents generally, which
n=1 cannot.

**And the part that must not be misread: D6 did not move.** The document contains **no Arabic at all**,
so A-SURVEY produced **no Arabic evidence whatsoever**. **MSG-0056a D6 remains exactly as partially
discharged as MSG-0071 accepted it, ADR-0019's normalization rules were not written, inferred, or
amended, and D14's rejection exposure remains completely unmeasured.** Four of A-SURVEY's five
dimensions — format mix, language prevalence, scanned prevalence, classification/audience distribution,
version/supersession prevalence — are recorded as **INSUFFICIENT at n=1, with no estimates invented**.

**The most reusable output was not a language finding.** It was **three extraction hazards, each of
which corrupts ingestion silently rather than failing** (MSG-0084 §5). Page 1 draws **every glyph
twice** — once in light grey inside `/Artifact BMC` as a drop shadow, once in black inside
`/P <</MCID n>> BDC` — so an extractor without marked-content scoping doubles the one page carrying the
title, authorship and approval block, and ingests the `- N -` footers as body text. `/Span
<</Lang(...)>>` property dictionaries contain parenthesised strings that a naive regex reads as body
text, 1,865 times. And **page 23 yields 67 characters** because its content is a vector flow chart:
**text-native, so D14 never fires, yet effectively unreadable** — a gap between D14 and ADR-0017's
grounding contract that one document is enough to demonstrate and nowhere near enough to size.

**Two items were referred rather than decided** (MSG-0084 §8): the designated corpus is **real
organizational material, not synthetic**, and that description should be confirmed rather than left
standing; and the unattended runner **has no PDF tooling** — `pdftoppm` is absent and `pdftotext` is off
its Bash allowlist, a refusal that was **recorded rather than routed around**, the survey instead reading
the file's bytes directly within the read permission actually granted.

> **Superseded — the position after TASK-0026, retained.** The paragraphs below were written when
> A-SURVEY had produced nothing at all because no corpus was reachable. **The corpus half has since
> moved**, and A-SURVEY has run — at n=1. Everything they say about *implementation* is unchanged: still
> prohibited, still no task READY. **Everything they say about D6, ADR-0019 and D14 is also still
> true**, which is the point worth carrying forward: supplying one document did not discharge them.

**Current position, 2026-08-22 after TASK-0026 (superseded, retained): no task is READY, and the
boundary is now split in two — one half is the Architecture Lead's acceptance of a record, and the other
half is an organizational action nobody in this repository can take.**

TASK-0026 executed MSG-0076 and is **COMPLETE (PARTIAL)**. **Five of six acceptance criteria are met;
criterion 1 is UNMET on PR5**, each mapped to evidence in **MSG-0078** §2. Being documentary it
produced **no test count and claims none**. The two halves came out differently, exactly as MSG-0077
predicted they would:

- **A-STACK is COMPLETE.** It delivered
  [`EPA-0005`](../architecture/EPA-0005-assistant-stack-evaluation.md) — **PROPOSED, and it selects
  nothing**, which is what MSG-0076 asked for when it permitted "a recommendation **or** an explicit
  record of why selection remains open".
- **A-SURVEY was NOT PERFORMED.** Its corpus prerequisite is unmet, and **it produced no figures at
  all** rather than plausible ones.

**The A-SURVEY restraint is the part worth reading twice, because an absence is easy to mistake for an
oversight.** The corpus question was **re-checked by inspection in the executing session** — not
inherited from MSG-0077, whose own text insisted on that, since the operator could have supplied
material in the interval. A tree-wide search for document-like files returned **two TypeScript
dependency licence texts and nothing else**. So **no format breakdown, no language mix, no
scanned-document prevalence, no classification pattern, no version characteristic** — *not as
estimates, not as illustrations, not as expected values* — and **no survey method or plan was
substituted** for the authorized output. Those figures would have fed **D6**, **D14** and **ADR-0019**,
which MSG-0071 accepted *on the express condition* that its normalization rules come from empirical
corpus evidence. **Invented data would have corrupted accepted architecture and been traceable to
nothing.**

**What EPA-0005 actually establishes**, since "evaluation that selects nothing" could otherwise be
mistaken for an evaluation that concludes nothing. Four findings, three of which hold **regardless of
the corpus**:

1. **"The stack" is not one decision.** The capability holds two workloads with different centres of
   gravity — a governed application layer, and a document-and-model pipeline. The real fork is **one
   runtime or two**, and EPA-0005 §5 frames that trade with three named approaches and **recommends
   none**, because operational fit and team capability are the organization's context to weigh.
2. **ADR-0020 makes pre-filtered retrieval a functional requirement on the index engine** (§3.3) —
   the sharpest finding. §3.1 requires the candidate set be built *"already constrained"* and §4 makes
   retrieve-then-filter a gate failure, which **disqualifies post-filter-only similarity search**. The
   usual workaround — over-fetch top-k, then filter — is the prohibited shape executed one layer down,
   where it is harder to see. **An implementer could violate this while believing they conform**,
   because post-filtering looks like enforcement and the response body is identical either way.
3. **Three local models are required, not one** (§3.5): generation, embedding, and **ADR-0017's
   entailment layer**, which ADR-0022's own consequences confirm is local too. This multiplies **PR6**,
   which is still unmeasured.
4. **Conversation and audit storage are two stores, not one** (§3.7). ADR-0021 §2 keeps retained
   conversation content from *an ordinary administrator*, and §3 requires expiry to actually delete. A
   single "log everything to one place" design violates §2 and §4 at once, **invisibly**.

One product-visible constraint surfaced early (§3.6): ADR-0017's gate runs *after* generation and may
veto the whole response, so **streaming an answer to the user as it generates is incompatible with
it** — better found now than at T-D.

**Two boundaries EPA-0005 declined to cross.** It names **no serving runtime**: SPEC-0008 and ADR-0003
both mention Ollama as a possible initial local runtime, and **ADR-0022 is explicit that it "does not
select it or anything else"** — recording one in a PROPOSED document would convert an accepted
non-decision into a de facto selection. And **it creates no ADR**: WP-0009 §6.2 assigns A-STACK the
*question* of whether its output should be one, and §9.3 **answers** it — recommend **not yet**, since
an ADR records a decision and the honest state is that selections are open; if the §3.3 pre-filtering
rule warrants recording, it belongs with **ADR-0020**, whose own §3 and §4 it follows from.

**PR5 sharpens from UNKNOWN to VERIFIED UNMET**, and the distinction is worth keeping: it was looked
for, in this repository, on this date. **It is not a claim about what the organization possesses** —
only about what is reachable here.

> **Superseded — the position after TASK-0025, retained.** The paragraph below was written when the
> boundary was purely that the Lead had not yet named the next task. **They then named it** (MSG-0076),
> it was reconciled (MSG-0077), and it has now run. Everything it says about *implementation* is
> unchanged: still prohibited, still no task READY.

**Position after TASK-0025 (superseded, retained): no task is READY, and for the first time in this
sequence the boundary is neither acceptance nor authorization of a record — it is simply that the
Architecture Lead has not yet named the next task.**

TASK-0025 executed the MSG-0073 promotion authorization and **promoted ADR-0018, ADR-0019, ADR-0020,
ADR-0021 and ADR-0022 into [`docs/decisions/`](../../docs/decisions/)**, the authoritative register.
With ADR-0017, which the lead promoted in `d9c4524`, **the WP-0009 ADR set is complete and carries
architectural authority** — tier 2 in the CLAUDE.md authority order, above the COMMS messages that
previously held these rulings. All five acceptance criteria are met, each mapped to evidence in
**MSG-0075** §2. Being documentary it produced **no test count and claims none**.

**The verification is worth stating precisely, because "promoted" is easy to claim and hard to check.**
Each promoted file was produced by copying its draft **byte for byte** and then editing exactly two
things: the `Status` block, and an added `**Accepted by:** Architecture Lead — MSG-0071` line. A `diff`
of each pair therefore shows those two header hunks and **nothing else — zero body differences across
all five**. The body was never retyped, so it could not drift. **No accepted ADR was modified**:
`git status --porcelain` before the commit showed five *new* paths under `docs/decisions/` and no
modified path there, so ADR-0001…ADR-0017 are untouched.

**Independently re-verified 2026-08-22 by a separate interactive session**, since these are the
most authority-bearing files in the repository and a self-reported verification is weaker evidence
than an independent one. The method was deliberately different from the runner's: rather than
reading `diff` hunks, each promoted body was extracted from its first section heading onward,
whitespace-collapsed, and compared whole against its draft — a check that also catches silent
reflowing, which hunk-reading can miss.

**All five bodies compared IDENTICAL.** The only differences anywhere are the `Status` block and
the added `Accepted by` line. The three MSG-0071 conditions were re-checked in the promoted copies
as well: ADR-0022's non-selection statement is intact at line 72 with the Ollama citation in the
same two positions, and ADR-0019 still declares itself "not complete for production use,
deliberately" with normalization deferred at §6.

This corroborates MSG-0075 §3 and §4 rather than replacing them; it found nothing to correct.

**The three conditions MSG-0071 attached were re-checked in the promoted copies rather than inherited.**
MSG-0072's pre-promotion pass verified them in the *drafts*; promotion is the step where they could be
lost, so verifying the source is not verifying the copy. All three hold: **no provider, model, framework
or runtime is selected** — ADR-0022's citation of ADR-0003's note on Ollama survived intact and still
says *"this ADR does not select it or anything else"*; **ADR-0019 still declares itself incomplete for
production by design**, with its Arabic normalization rules deferred to empirical corpus evidence and
**no rule invented**; **ADR-0017's entailment model and numeric thresholds remain open** under SPEC-0020.

**Promotion conferred authority and authorized nothing else.** **A-SURVEY, A-STACK and T-0 remain
unauthorized**, no implementation task is READY, and the literal string `READY` occurs in none of the
promoted records. WP-0009 still reads `DEFINED — NOT AUTHORIZED FOR IMPLEMENTATION`, and the three open
items in its §8 — the T-D/T-E interim mitigation, PR3's owner and date, and the planning relationship —
are all still open; promotion touched none of them.

**The next action is the Architecture Lead's**, and MSG-0071 already names the shape of it: its *Next
architecture boundary* made promotion the precondition for authorizing **A-SURVEY** or **A-STACK** from
WP-0009 §6.2. **That precondition is now met.** Whichever is authorized must be reconciled into
`CLAUDE-TASKS.md` as the single READY task, **in the same commit as the authorization**. The MSG-0044
queue gap recurred for the **eighth** time with MSG-0073 and was repaired by MSG-0074 before the next
Supervisor cycle — which is why this run started on time. Repaired in time is not prevented.

> **Superseded — corrected 2026-08-21 by TASK-0025.** The paragraph below was the position after
> TASK-0024 and was true until MSG-0071 accepted all six drafts and TASK-0025 promoted five of them the
> same day. **The acceptance boundary it describes has been passed**: the drafts do now carry authority,
> because they are no longer only drafts. Everything it says about *implementation* is unchanged — that
> boundary was not crossed.

**Position after TASK-0024 (superseded, retained): no task is READY, and the boundary is acceptance —
six ADR drafts exist and none of them carries authority yet.**

TASK-0024 executed the **A-ADR** architecture task under MSG-0068a/b and delivered **six PROPOSED ADR
drafts** in [`../decisions/`](../decisions/README.md), one for each WP-0009 §7 surface: **ADR-0017**
Grounded Answer Contract · **ADR-0018** Approved Document Authority and Lifecycle · **ADR-0019**
Bilingual Policy Semantics · **ADR-0020** Retrieval Projection and Index Boundary · **ADR-0021**
Employee Question Privacy and Retention · **ADR-0022** Inference Locality and Provider Boundary. All
eight acceptance criteria are met, each mapped to evidence in **MSG-0070** §2. Being documentary it
produced **no test count and claims none**.

**The drafts are PROPOSED and carry no architectural authority.** Claude Code does not accept
architecture; promotion to `docs/decisions/` is the Architecture Lead's act. ADR-0015 and ADR-0016 are
the precedent — each was drafted PROPOSED in `implementation/decisions/` and promoted with a
`Supersedes:` line. Numbers were still allocated at drafting time, as the task required, and
**verified collision-free against the actual repository state** before anything was written:
`docs/decisions/` holds ADR-0001…ADR-0016 with no gaps, and a repo-wide grep for ADR-0017…ADR-0029
returned only prose references. **No accepted ADR was modified, duplicated, renamed, or deleted** —
evidenced by a pre-commit `git status --porcelain` carrying no path under `docs/decisions/`.

**The judgment was made independently rather than inherited.** WP-0009 §7 marks all six surfaces
REQUIRED and explicitly invites disagreement; the task treated that as a hypothesis and tested each
surface against the accepted ADR set, read in full. All six survived for one structural reason: each
rests on a ruling that is **stricter than, or wholly absent from, the accepted set**, and each of those
rulings lives **only in a COMMS message** — which is not an authority tier under CLAUDE.md. The
bilingual surface is the starkest: searching all sixteen accepted ADRs for language, Arabic, bilingual,
i18n or localization returns two hits, and both are about programming languages.

**Surface 4 was the close call, and the counter-argument is recorded rather than hidden** (MSG-0070 §4).
SPEC-0013 already requires authorization before results enter application or AI context — but that
wording *permits* retrieving into the application and filtering, which is exactly the shape MSG-0062
§7.6 forbids, and no accepted specification names the timing or result-count channels. If the lead
disagrees with any of the six, ADR-0020 is the one to reject, and the argument for doing so is written
into the record.

**Two things were deliberately not done.** **ADR-0019 does not contain the Arabic normalization rules** —
MSG-0056a D6 requires them determined empirically against a corpus nobody has surveyed, so the draft
records the obligation and three constraints that hold regardless (raw text immutable; ingestion and
query normalization identical; the rule set versioned) and states plainly that it **must be amended
before production use**. D6 is therefore partially discharged, disclosed rather than papered over.
**No task was marked READY**, including A-STACK and A-SURVEY.

**One finding, and it resolves a tension rather than raising one** (MSG-0070 §7). EPA-0001 §7.3 and
EPA-0004 §11.6 both summarize the accepted classification standard as forbidding Restricted content in
model context *absolutely*. The accepted text is conditional — *"unless specifically designed for that
data class and protected accordingly"* — and reading it in full is what makes **MSG-0062 §7.6**
consistent with accepted authority instead of in conflict with it. No stop condition arose. One
obligation inside that carve-out is easy to lose and is recorded in ADR-0020 §6: **the prohibition on
Restricted data in *logs* carries no authorization exception.**

> **Superseded — corrected 2026-08-21 by TASK-0024.** The paragraph below was the position after
> TASK-0023 and was true until TASK-0024 executed the same day. The authorization boundary it describes
> has been passed: MSG-0068 named A-ADR, and A-ADR has run. **Implementation is still prohibited** —
> that part did not change, and WP-0009 still reads `DEFINED — NOT AUTHORIZED FOR IMPLEMENTATION`.

**Position after TASK-0023 (superseded, retained): no task is READY, and the boundary is authorization —
the governance is now in place and the next bounded task is the Architecture Lead's to name.**

TASK-0023 executed the MSG-0063 reconciliation and delivered
[`WP-0009 — Employee Policy Assistant`](../../docs/program/work-packages/WP-0009-employee-policy-assistant.md),
the formal work-package record in the canonical directory. All seven MSG-0063 acceptance criteria are
met, each mapped to evidence in **MSG-0066** §3. Being documentary it produced **no test count and
claims none**.

**The identifier was the hard part, and it was a trap rather than a gap.** `WP-0002` has no record in
`docs/program/work-packages/` and looks free from a directory listing — but `PLAN-WP-0001` has held it
as "Repository and Engineering Platform" since it was written. **WP-0009** is the next number unused in
*either* register, verified by `grep` returning nothing before allocation. **Historical WP-0001 —
PCI Kernel Foundation — is untouched**, and all eight planning entries are retained verbatim. The two
registers are now reconciled in `docs/program/work-packages.md` §0, which states plainly that the
planning list is a plan, that MSG-0005 makes the directory canonical, and that a new work package takes
the next number unused in either. That closes **DISC-0010**, whose own trigger — "the moment a second
work package is created" — arrived the same day it was written.

**Three MSG-0062 rulings shaped the sequence.** §7.3 fixes **T-D (grounded QA) before T-E
(retrieval-time authorization)**, closing an item open since EPA-0002 — and the interim exposure it
creates is carried forward as an open item rather than quietly resolved, because §7.3 rules the order
and is silent on the mitigation. §7.6 makes **"retrieve then filter" a gate failure**: Restricted
documents are eligible for the corpus, but one is never retrieved unless the subject satisfies its
policy, and denial fails closed with no existence, content, timing, or result-count side channel.
§7.7 means **ADR-0015 is not inherited** and no stack is selected.

**Two things were deliberately not done.** **ADR numbers were not allocated** — MSG-0062 §7.2 places
allocation in the drafting task, so the six surfaces are sequenced and justified but unnumbered, with
"next free is ADR-0017" recorded as an observation and explicitly not an allocation. **No task was
marked READY**, including the three architecture tasks WP-0009 §6.2 itself defines: **A-ADR** (draft the
required ADRs), **A-STACK** (propose the service stack, §7.7), **A-SURVEY** (the bounded corpus survey
§7.5 authorized in principle). Authorizing one of them is the next action, and it is the lead's.

**Three items remain genuinely open, none blocking:** the T-D/T-E mitigation; PR3's owner and date for
the identity provider; and which `PLAN-WP-0001` entries WP-0009 satisfies, supersedes, or sits beside —
a program-structure judgment §7.1 does not reach. MSG-0066 §6.

> **Superseded — corrected 2026-08-21 by TASK-0023.** The paragraph below was the position after
> TASK-0022 and remained true until TASK-0023 executed. The acceptance boundary it describes has been
> passed: MSG-0062 accepted EPA-0004 and ruled all seven of its open items, and those rulings are now
> reconciled into the governance records. **Implementation is still prohibited** — that part did not
> change.

**Position after TASK-0022 (superseded, retained): no task is READY, and the boundary is acceptance
rather than decision.** TASK-0022 delivered
[`EPA-0004`](../architecture/EPA-0004-employee-policy-assistant-work-package-definition.md) — the
Employee Policy Assistant work-package definition, **PROPOSED**: thirteen acceptance gates, ten
dependency-ordered tasks, five test tiers, T1–T11 threat coverage, and every required field of
`docs/engineering/implementation-work-package-standard.md`. It **allocates no work-package number,
creates no ADR, selects no provider or stack, and marks no task READY.** Execution record: MSG-0061.

The next moves are the architecture lead's: accept or amend EPA-0004, and rule on the **seven open
items** in MSG-0061 §7 — the work-package number; the ADR set; the T-D/T-E ordering; PR3 (which IdP,
whose deployment); PR5 (may the real corpus be surveyed); **whether a policy document may be
classified Restricted**; and the assistant service's implementation stack. None was self-authorized.

> **Superseded — corrected 2026-08-21 by TASK-0022.** This paragraph previously read "What happens
> next is the architecture lead's: **fourteen decisions in EPA-0003**, of which four are marked
> Highest … D1, D3, D5, D13. None was self-authorized." That was true when written and stopped being
> true the same day: **all fourteen were ruled** by MSG-0056a and MSG-0056b, and the three
> reconciliation findings they raised were ruled by MSG-0058. The sections below already recorded
> those rulings while this paragraph still described the decisions as open — the same
> file-contradicts-itself defect Rule 12 exists to catch.

> **Superseded — corrected 2026-08-21 by TASK-0019 (MSG-0050).** This paragraph previously read
> "**No task is currently READY. TASK-0018 is IN_PROGRESS with one gate unmet** … MSG-0049 §6 asks
> for one decision to close it." That was true when written and stopped being true when the MSG-0049
> addendum recorded gate 3 met by external observation — the terminal `COMPLETED  pid=0
> active=False` at 21:03:36Z, lock released, exit code 0. All five gates are MET and MSG-0050 opens
> by stating "TASK-0018 is complete." The row above already said COMPLETE while this paragraph said
> IN_PROGRESS; the row was right.

> **Superseded — the position after TASK-0017's first attempt.** This paragraph previously read
> "TASK-0017 is IN_PROGRESS and stopped at a permission boundary … MSG-0045 §7 asks for one decision".
> That was true when written and stopped being true when MSG-0046 authorized the operator-side test
> run and MSG-0047 recorded 36 passed / 0 failed. TASK-0017 is COMPLETE.

> There is no TASK-0012. MSG-0022 and MSG-0023 ruled it out of the WP-0001 path, and the number was
> never reused. Do not infer a gap in the queue as missing work — the charter's own warning
> (`../PROJECT-CHARTER.md` §4) is not to infer task order by skipping entries.

Only the architecture lead may authorize new work or change a task's priority or scope. A PROPOSED
task is not executable.

### TASK-0003 — executed and COMPLETED 2026-08-20

> **Reconciled 2026-08-20 (TASK-0011).** This block was written mid-task, when TASK-0003 was
> genuinely IMPLEMENTED-but-NOT-COMPLETE, and it was never updated after MSG-0030 unblocked it. The
> "Not fixed" paragraph below is retained as the record of what was tried and refused — but it is
> **history, not current state.** The residue is gone: 150 -> 0, verified, accepted in MSG-0031.

Authorized by MSG-0027 and executed by the **first session the Execution Supervisor started on its
own**. `.gitattributes` now pins `*.md text eol=lf`.

DISC-0006 had flagged this as a risky repository-wide rewrite. It was not one. Every tracked `*.md`
blob was already LF in the index — `core.autocrlf=true` had normalised on commit all along, and the
CRLF lived only in the working tree:

```text
$ git ls-files --eol "*.md" | grep -c "i/lf"
195                     <- every index blob already LF

$ git add --renormalize -- "*.md"
$ git diff --cached --stat
(no output)             <- ZERO committed content changed
```

**Fixed:** every clone or checkout from now on writes `*.md` as LF.

**Not fixed:** 152 `*.md` files already on this workstation's disk still carry CRLF. Setting the
attribute does not rewrite files already written. The three commands that could refresh them —
`git checkout`, `git rm --cached`, `git checkout-index` — were each refused by the unattended
runner's permission layer. Not by the governance deny list (which covers only `sudo`, destructive
`docker`, force-push, `git reset --hard`, `git clean -fd`, `rm -rf`, and the SSH key commands) but by
the ordinary allowlist in `.claude/settings.local.json`, which permits `git add`/`git commit`/
`git config` and nothing else — and an unattended runner has no one to approve a prompt.

**No substitute was used.** Rule 2 forbids routing around a permission denial, so the denial is
reported instead. The decision is MSG-0028 §2: (A) the operator runs one path-scoped command,
(B) widen the runner allowlist, or (C) accept a residue that exists only on this workstation.

**Outcome — the above is now closed.** MSG-0030 authorized Option B (`git checkout -- "*.md"`). The
authorized command was a no-op at first because git did not consider the files modified; a
metadata-only `touch` scoped to tracked markdown let it run, and that addition was flagged for
review and **accepted** in MSG-0031, with the lead noting it creates **no general authorization for
arbitrary preparatory commands**. Residue: **150 -> 0**. DISC-0006 RESOLVED.

Evidence: [`../operations/checkpoints/TASK-0003.md`](../operations/checkpoints/TASK-0003.md),
[`../comms/MSG-0031-task-0003-complete.md`](../comms/MSG-0031-task-0003-complete.md).

### Supervisor start path — proven, with a caveat

MSG-0026 left the supervisor's start path "unproven until a task is READY". TASK-0003 proved it: lock
acquired naming the task, runner launched, startup checklist run, queue read, authorized task
executed, boundary respected.

The first live run produced two findings, both in MSG-0028:

- **The allowlist, not the deny list, is the real ceiling on unattended work.** In `acceptEdits` with
  no approver present, only already-allowlisted Bash commands run. This is sound fail-closed
  behaviour and it is why TASK-0003 stopped where it did.
- **A concurrent actor committed to this repository mid-task** (`aaf0d34`, moving HEAD and
  `origin/main` under a running session). No overlap with TASK-0003, so no harm — but `runner.lock`
  guards against a second *supervisor*, not against a human or manually-started session in the same
  tree. Whether a mid-run HEAD move should abort the session is an open decision.

## Active Work Package

`docs/program/work-packages/WP-0001-kernel-foundation.md`

> Settled. This file and `CLAUDE.md` both previously pointed at `implementation/work-packages/`,
> which does not exist. MSG-0005 designated `docs/program/work-packages/` canonical, and
> `CLAUDE.md` startup step 4 was corrected accordingly in `fb49369`. Nothing outstanding.

## Verification Summary

**Verified on the authorized host, 2026-08-19 — re-run against the clean-room stack (TASK-0007).**

| Tier | Result |
|---|---|
| Typecheck | PASS |
| Unit | **102 pass / 0 fail** |
| Contract | **101 pass / 0 fail** |
| Integration (clean-room PostgreSQL) | **26 pass / 0 fail / 0 skipped** |
| **Total** | **229 pass / 0 fail** |

Every tier reported a non-zero test count.

| AC | Verdict |
|---|---|
| AC-01 Build | **MET** — both images built; `DockerRootDir` = `/data/docker` |
| AC-02 Database | **MET** — migrations applied to real PostgreSQL, idempotency verified |
| AC-03 Create object | MET |
| AC-04 Relationships | MET |
| AC-05 Tenant isolation | **MET** — RLS + FORCE RLS proven live |
| AC-06 Audit | MET — append-only proven under the runtime role |
| AC-07 Validation | MET |
| AC-08 Health | MET — `/health/ready` 200 with `store: ok` against real PostgreSQL |
| AC-09 Tests | **MET** — all three tiers executed |
| AC-10 Evidence | MET — report section 11 |

**All ten acceptance criteria are met.** Full evidence:
`implementation/reports/WP-0001-kernel-foundation-report.md` section 11.

> **Reproducibility: CLOSED (2026-08-19, gate G3).** The two manual steps that once stood between a
> clean checkout and a working stack are fixed (DISC-0007, DISC-0008) and the fixes are demonstrated:
> the PostgreSQL volume was destroyed under MSG-0016 and rebuilt from repository configuration alone,
> with no manual SQL. See report section 13.
>
> **Re-verified 2026-08-19 (TASK-0007, gate G4):** all three tiers re-run against the clean-room
> stack — 229 pass / 0 fail — and the ADR-0016 obligations re-proven live. The AC verdicts above now
> rest on evidence from a database the repository built itself, not one repaired by hand.
>
> Remaining: **TASK-0009**, the architecture lead's completion decision. Claude Code does not
> self-certify completion.

## Open Communications

Index: `implementation/comms/README.md` carries the full message register with links and status.

**MSG-0053 and MSG-0054 (2026-08-21).** C6 is **NOT AUTHORIZED / NOT REQUIRED** — proving MSG-0049
option (B) would add an unattended cycle no current requirement needs, so option (B) stays
explicitly unproven rather than being proven for its own sake. C7 authorized **no new product work
package**; the project sat at a completed-WP-0001 checkpoint.

That checkpoint has since moved: **MSG-0054 authorizes TASK-0021**, an architecture-definition task
for an employee policy assistant — answering only from approved organizational policy, in English and
Arabic, with authoritative citations and fail-closed abstention. It is **outside WP-0001** and
authorizes **no implementation and no work package**; the architecture must be accepted first.

**TASK-0021 is COMPLETE (2026-08-21, MSG-0055).** All eleven acceptance criteria are met. It produced
four PROPOSED records under [`../architecture/`](../architecture/README.md) — none of which carries
architectural authority:

| Record | Contents |
|---|---|
| `EPA-0001` | The architecture definition: scope boundary, approved-document authority and lifecycle, components and answer/ingestion data flow, the grounded-answer contract, bilingual behaviour, four-point retrieval-time authorization, threat model T1–T11, frontend responsibilities, audit and retention, operational architecture, and a conflict check against every accepted document it touches |
| `EPA-0002` | What a work package **would** look like — scope, data contracts, interfaces, gates G1–G11, prerequisites, sequence T-A…T-I. Written in the conditional; **authorizes nothing**, and deliberately allocates no WP number |
| `EPA-0003` | **The operative record: fourteen open architecture-lead decisions**, each with options, consequences, and a recommendation |

**No implementation, no work package, no ADR, and no downstream task was authorized**, and nothing was
verified by execution — it was a definition task and produced no runnable artifact, so there is no
test count to report. Its acceptance criteria are documentary and each is mapped to its evidence in
MSG-0055 §9.

**The one genuine authority vacuum is bilingual policy semantics.** A search of `docs/` and the
Constitution for language, Arabic, bilingual, i18n, or localization returns a single relevant line —
SPEC-0016's notification templates. Everything else in the definition instantiates
SPEC-0011/0013/0014/0015/0031, ADR-0016 and ADR-0003 under a stricter contract, and EPA-0001 §12 names
the five things that are genuinely new so review effort lands where it belongs.

**MSG-0056a — the first ruling (2026-08-21).** The Architecture Lead **accepted TASK-0021 as a
complete architecture-definition task** and ruled ten of the fourteen EPA-0003 decisions: D2, D4, D5,
D6, D8, D9, D10, D11, D12, D14. Two are worth naming here because they narrow the architecture
sharply — **D8 prohibits external inference by default**, so the first implementation stays local
with any exception requiring its own ADR, deployment switch, classification controls and egress
audit; and **D9 places the assistant in a separate service outside the PCI kernel**, reusing kernel
contracts and the `/data/docker` boundary, which means **ADR-0015's kernel stack does not
automatically govern it**.

**Four decisions were escalated rather than ruled — D1, D3, D7, D13** — on the explicit ground that
the repository does not contain the organization's authority and the Lead must not invent it. D1
(bilingual policy authority) is the vacuum this status file already named; D3 is approval authority
and classification; D7 is question retention and identity-linked access, a privacy/jurisdictional
question; D13 is the identity provider, which also needs a privileged deployment action. See
**Next Action** for who must answer each.

**Nothing became executable under MSG-0056a.** It authorizes no work package, no implementation task, no ADR,
no provider selection, no document ingestion, and no change to Supervisor or security behaviour.

**MSG-0056b — the four escalated decisions, answered (2026-08-21).** The organization supplied the
authority and the Architecture Lead ruled all four the same day:

- **D1 — bilingual authority.** **English is the authoritative policy language**; Arabic is an
  approved translation and accessibility language, never an independent authority. Where the two
  differ in meaning, **English governs and the discrepancy must be flagged rather than silently
  resolved**. Employees may ask and be answered in either language; citations always resolve to the
  English text.
- **D3 — approval authority.** Only privileged users may place documents into the governed flow, and
  **upload does not itself confer authority**. Authorized personnel approve/publish and assign
  audience and classification, and **the creator must not be the sole approver of their own policy**.
- **D7 — question retention.** Session retention by default, administrator-configurable (session-only
  or a defined period), storage minimized, and **retained conversation content readable only by the
  employee who asked it**. Security and audit records are governed separately.
- **D13 — identity.** Configurable modes rather than a single product choice: Microsoft 365 / Entra
  ID, existing Active Directory / enterprise integration, and **optional unauthenticated access**
  limited to information explicitly classified safe for unauthenticated disclosure.

**All fourteen EPA-0003 decisions are now RULED**, each annotated inline in the record with the
message that ruled it. **Nothing became executable**: MSG-0056b is explicit that no implementation
task is READY or authorized.

**MSG-0057 — the reconciliation, and three findings (2026-08-21, OPEN).** Reconciling the rulings
against the accepted documents surfaced three consequences the rulings imply but do not state. None
contradicts accepted authority; none is a stop condition; all three need an answer before the work
package can be gated:

- **F1 — cross-language grounding.** The D1 ruling permits generating Arabic answers from English
  policy, which is what EPA-0003 recommended prohibiting for policy claims. That is the lead's call —
  a recommendation is not authority — but the D5 grounding gate must now judge whether an **Arabic
  answer is entailed by an English source**, and the structural layer largely stops working across a
  translation boundary. Scope and failure behaviour are undefined.
- **F2 — unauthenticated access.** Verified by search: **zero** occurrences of "unauthenticated" or
  "anonymous" anywhere in `docs/decisions/`, `docs/specifications/`, or `docs/architecture/`. EPA-0001
  presumes an authenticated subject throughout, and the classification value the ruling names is not
  enumerated by any accepted spec, though SPEC-0013/0015 both require classification to be enforced.
  **Recommended: defer it** — it is the one part of D13 that adds a trust boundary rather than
  configuring an existing one.
- **F3 — Active Directory and ADR-0007.** Accepted ADR-0007 requires OIDC/OAuth2 flows and forbids
  PCI implementing authentication. AD integration is compatible **through an OIDC boundary** (AD FS,
  Entra, a broker) and incompatible as a direct LDAP/Kerberos bind. The compatible reading is almost
  certainly intended; it needs confirming rather than assuming.

**F4** records a fourth message-number collision: two different files both claim MSG-0056. They
complement rather than contradict, so no stop was warranted; they are disambiguated throughout as
**MSG-0056a** and **MSG-0056b**, and neither was renumbered.

**MSG-0058 — all three findings ruled (2026-08-21), each as recommended.**

- **F1 — cross-language grounding: in scope, and fail-closed.** Arabic answers may be generated from
  authoritative English policy, but the grounding gate must establish support across the
  English-source/Arabic-answer boundary, with the Arabic acceptance bar evaluated separately under
  SPEC-0020. **If the Arabic gate fails, the system abstains** — it must not silently fall back to an
  English answer, and must not present an unofficial rendering as policy. This closes the gap MSG-0057
  identified: the failure behaviour is now specified rather than implied.
- **F2 — unauthenticated access: deferred** from the first release. The first release requires
  authenticated identity, and **no new unauthenticated classification or trust boundary is
  introduced** — which also means the undefined classification value MSG-0057 flagged does not need to
  be invented now.
- **F3 — directory integration terminates at the ADR-0007 OIDC/OAuth2 boundary.** Entra ID, AD FS, or
  an OIDC/OAuth2 broker may front an existing directory; **direct LDAP/Kerberos authentication
  implementation is not authorized.** The accepted ADR is confirmed as governing rather than amended.
- **F4 — preserve the MSG-0056a/MSG-0056b distinction and do not rename historical records.** The
  collision is documentary and non-blocking.

**Gate ruling:** with F1-F4 resolved, the architecture-definition findings are sufficiently resolved
to proceed to a work-package authorization task. **Implementation, provider selection, and runtime
changes remain prohibited.**

**MSG-0059 — TASK-0022 authorized (2026-08-21).** The next task is the bounded **work-package
definition** for the Employee Policy Assistant: scope, implementation gates, acceptance criteria,
dependencies, security checkpoints, and a dependency-ordered task sequence. It authorizes no
implementation, no provider or model selection, no runtime or deployment change, no new permissions,
and no Supervisor change, and **no implementation task may be marked READY by it**. The Architecture
Lead must accept its output before implementation is authorized.

**MSG-0060 — TASK-0022 reconciled into the queue (2026-08-21, OPEN, informational).** MSG-0059
required TASK-0022 to be the **single READY task** on the board before the Supervisor may execute it,
and to remain idle until then. It was absent from `CLAUDE-TASKS.md` entirely — **the fifth recurrence
of the MSG-0044 gap**, where an authorization exists and the queue does not reflect it, and the
supervisor idles indefinitely reporting a healthy `no READY task`. It is now on the board as the only
READY task, verified by a dry run that selected it without starting anything.

**The collision recurred too, and this one carries more risk.** Two files specify TASK-0022. They
agree on scope, authorization, forbidden actions and acceptance gate, but spec A carries the stop
conditions and the recommendations-only constraint while spec B carries a finer ten-item outcome
list. A message collision is read by humans; **a task collision is read by an unattended runner that
cannot notice a sibling file exists**, and would report success against whichever half it read. The
queue section therefore carries the **union** of both and links both. Neither was renamed, per F4.

**MSG-0061 — TASK-0022 executed; the work-package definition exists and is PROPOSED (2026-08-21).**
A supervisor-started session executed TASK-0022 and delivered **EPA-0004**. Every required output of
both TASK-0022 specification files is mapped to its evidence in MSG-0061 §2. Being documentary, the
task produced **no test count, and none is claimed** — its own verification section forbids reporting
one.

**What EPA-0004 adds over EPA-0002**, which was written before any decision was ruled and is retained
unchanged: thirteen gates rather than eleven (**G12 identity**, **G13 retention and question privacy**,
both of which had no ruling to rest on when EPA-0002 was written); ten tasks rather than nine, with
**T-0 — deploy an identity provider — made explicit as an operator task**, because PR3 was named a
critical-path prerequisite in EPA-0002 and then never appeared in the sequence; and the rulings folded
in concretely rather than conditionally.

**The consequential change is F1's cross-language gate.** MSG-0058 ruled that Arabic answers may be
generated from authoritative English policy, provided a grounding gate establishes support across the
language boundary and **abstains** when it cannot. EPA-0004 makes that a **protocol-level contract
rule** — when the answer language differs from the source language, a passing gate result must be
present, and its absence or failure forces an abstention. Stated plainly in the record because it is
the easiest thing to get wrong: **if that gate is ever built as "fall back to English", the ruling has
been inverted rather than implemented.**

**Seven decisions are referred to the architecture lead (MSG-0061 §7), none self-authorized.** Two
deserve naming here. **Whether a policy document may be classified Restricted** is the one D3
sub-question MSG-0056b does not reach — and it matters because Restricted content may not enter model
context at all, so the answer decides whether such documents are excluded from the corpus (an exclusion
cannot fail open) or retrieved and then suppressed (which can). **The T-D-before-T-E ordering** was
raised in EPA-0002 §5, no ruling has addressed it — verified by reading MSG-0056a, MSG-0056b, MSG-0058
and MSG-0059 — and it is repeated rather than quietly dropped.

**One index defect was found and corrected.** `implementation/architecture/README.md` still described
EPA-0003 as carrying "three reconciliation findings open (MSG-0057)" after MSG-0058 had ruled all four
and MSG-0057 had closed. That is the fourth index to lag its own records, after the blocker index
(TASK-0013, TASK-0014) and the discoveries index (TASK-0015).

**MSG-0052 applied (2026-08-21).** The Architecture Lead ruled on the TASK-0019 audit referrals:
C1 — the accepted WP-0001 work package now reads `Status: COMPLETE`, closing the last conflict
between accepted authority and current state; C2 and C3 — `CLAUDE.md` and `ARCHITECTURE-LEAD-CONTEXT.md`
carry explicit supersession notes, with no supervisor behaviour, permission, or schedule changed;
C4 and C5 — no action, deliberately. **C6 (a bounded proof of MSG-0049 option B) and C7 (the next
work package) remain the Lead's to decide and are not self-authorized.**

**Open messages:** MSG-0060, MSG-0081, MSG-0084, MSG-0087, MSG-0089, MSG-0090 (SCOPED), MSG-0091, MSG-0093, MSG-0096, MSG-0097, MSG-0099, MSG-0100, MSG-0103 and MSG-0104. **MSG-0102 is CLOSED** — its environment finding was wrong and is superseded by MSG-0103. All remaining are records or referrals; **none blocks anything**.

**MSG-0094 is the TASK-0030 execution record**, and it is OPEN for a reason rather than as housekeeping:
it carries **a drafted amendment the Architecture Lead has not reviewed**. The one decision it asks for
is **accept, amend, or reject `ADR-0020-AMD-01`** — and, if accepting, which recording convention and
whether the optional traceability row is included. **Applying it requires an explicit authorization**;
this session had none and did not act as though it did.

> **The line this replaces, retained:** "**Eight messages carry `Status: OPEN`** — MSG-0060, MSG-0081,
> MSG-0084, MSG-0087, MSG-0089, MSG-0090 (**SCOPED**), MSG-0091 and MSG-0093. Verified across all three
> views. All are records or carry referrals; **none blocks TASK-0030**." True until TASK-0030 executed
> and raised MSG-0094.

**MSG-0084 is the TASK-0027 execution record** — a record, plus **two referrals that block nothing**
(§8 of that message): the designated corpus is **real organizational material, not synthetic**, and the
"approved/synthetic" description should be confirmed rather than left standing unexamined; and the
unattended runner **has no PDF tooling** (`pdftoppm` absent, `pdftotext` off its Bash allowlist), which
TASK-0027 worked around by reading the file's bytes directly rather than by widening any permission.

> **The line this replaces, retained:** "**Two messages carry `Status: OPEN`** — **MSG-0060** and
> **MSG-0081**." True until MSG-0084 was raised on 2026-08-22.

**MSG-0082 is CLOSED** — MSG-0083 answered it with **option A**: a narrow read-only grant for `D:Workpci-corpus` only, applied to `runner-settings.json` and **verified empirically** (641,807 bytes, `%PDF-1.7`, writes denied). **BLK-0010 is RESOLVED and TASK-0027 is READY again.**

**MSG-0081 is the TASK-0027 reconciliation**: informational, blocking nothing.

**MSG-0060 carries the one unaddressed observation** — whether colliding *task specifications* warrant
more than the union treatment. It blocks nothing.

**Three were closed on 2026-08-22 because the organizational action they waited on has been taken**, not
because they were tidied away: **MSG-0077** and **MSG-0078** (the corpus was supplied, and A-SURVEY is
authorized as TASK-0027 — MSG-0078's PARTIAL result stands unchanged and correct), and **MSG-0079**
(superseded by local delivery; the unreachable NFS path is moot, and its n=1 observation was adopted
into MSG-0080).

> **The line this replaces, retained:** "**Four messages carry `Status: OPEN`** — **MSG-0060**,
> **MSG-0077**, **MSG-0078**, and **MSG-0079**." True until the corpus was supplied on 2026-08-22.

> **An older retained line, kept:** "**Three messages carry `Status: OPEN`** — **MSG-0060**,
> **MSG-0077**, and **MSG-0078**." True until MSG-0079 was raised on 2026-08-22.

**MSG-0078's PARTIAL result stands and is worth keeping in view.** TASK-0026 delivered A-STACK and
**correctly did not perform A-SURVEY** — it re-verified the missing corpus by inspection rather than
assuming it, and produced no figures. That is the behaviour working: an unattended session asked for a
corpus survey with no corpus declined to invent one. The corpus has since been supplied, and A-SURVEY
is authorized separately as **TASK-0027** rather than by reopening the closed task.

> **The paragraph this replaces, retained:** "**MSG-0078 is the TASK-0026 execution record**, and it is
> OPEN rather than a closed RECORD for one reason: **the organizational action MSG-0077 asked for has
> not been taken.** … **MSG-0077 therefore stays OPEN alongside it**." True until the corpus was
> supplied on 2026-08-22; both are now closed.

**The Architecture Lead holds four open items, and none of them blocks anything, because no task is
READY:** (1) **accept, amend, or reject EPA-0005**, including its §9 recommendation that no stack ADR be
created yet; (2) the **one-runtime-or-two trade** of EPA-0005, when the timing is right; (3) **confirm
the corpus designation** — the file A-SURVEY read is **real organizational material, not synthetic**
(MSG-0084 §8); and (4) whether the unattended runner should have **PDF tooling** at all (MSG-0084 §8).
**The corpus action is discharged at n=1 and outstanding at corpus scale** — one document is not
representative material, and supplying more remains the organization's action.

> **The paragraph this replaces, retained:** "**The Architecture Lead holds two open items, neither of
> which blocks TASK-0027:** (1) **accept, amend, or reject EPA-0005** … and (2) the
> **one-runtime-or-two trade** … **The corpus action is discharged.**" True until TASK-0027 executed on
> 2026-08-22 and raised the two MSG-0084 referrals.

> **The paragraph this replaces, retained:** "**The Architecture Lead now holds three things, only the
> first of which blocks anything:** (1) the **corpus action** … (2) accept, amend or reject EPA-0005 …
> (3) the **one-runtime-or-two trade** …" Item (1) was discharged on 2026-08-22 when the corpus was
> supplied.

> **The line this replaces, retained:** "**Two messages carry `Status: OPEN`** — **MSG-0060** and
> **MSG-0077**." True from the MSG-0077 reconciliation until TASK-0026 executed the same day.

**MSG-0077 reports an unmet prerequisite and needs one organizational action.** MSG-0076
authorized TASK-0026 with two outputs, and **A-SURVEY cannot run**: it requires representative
approved policy material, and **no corpus is reachable from this repository** — verified by
inspection, and corroborated by three records that have said so all along (WP-0009 §6.1,
EPA-0004 §11.5 PR5, MSG-0061 §7.5). **A-STACK is unblocked and is most of the task.**

**The action is the organization's:** make representative approved policy material available for
a read-only survey, or rule that A-SURVEY is deferred until the corpus exists. MSG-0076's
constraint still binds either way — **a survey reads; it does not ingest**, and it may not bypass
approval controls.

> **The line this replaces, retained:** "**One message carries `Status: OPEN`** — **MSG-0060**."
> True until MSG-0077 was raised on 2026-08-22.

**MSG-0074 was closed** 2026-08-21 by execution, not by tidying: TASK-0025 ran against its
reconciliation and is COMPLETE (MSG-0075). The reconciliation did its job — it repaired the **eighth**
recurrence of the MSG-0044 queue gap before the Supervisor's next cycle, so the task was already the
single READY task when the run started and nothing idled. The gap recurred; it was caught in time.
**What did not recur was the sibling-file collision** — MSG-0073 arrived alone.

**MSG-0075 is the TASK-0025 execution record** — a RECORD requesting no decision.

> **The lines this replace, retained:** "**Two messages carry `Status: OPEN`** — **MSG-0060** and
> **MSG-0074**. Verified across all three views … **MSG-0074** is the TASK-0025 queue reconciliation:
> informational, blocking nothing." True until TASK-0025 executed the same day.

**MSG-0060 carries the one unaddressed observation** — whether colliding *task specifications*
warrant more than the union treatment. It did **not** recur with MSG-0073, which arrived alone:
the first clean authorization in four.

**MSG-0072 was closed** by **MSG-0073**, which answers it. Its pre-promotion verification — no
provider/model/runtime selection, ADR-0019 invents no normalization rules, numbering
collision-free — stands as evidence for TASK-0025 rather than being discarded with the message.

> **The line this replaces, retained:** "**Two messages carry `Status: OPEN`** … **MSG-0072 needs
> an answer** … **MSG-0060 carries an unaddressed observation**." True until MSG-0073 answered
> MSG-0072 the same day.
**Three were closed on 2026-08-21 because they were discharged, not because they were tidied
away:** **MSG-0064** (TASK-0023 executed and COMPLETE, delivering WP-0009), **MSG-0065** (the
operator enabled the scheduled task; verified **Ready** and cycling), and **MSG-0069** (TASK-0024
executed and COMPLETE). MSG-0069's collision observation was **not** closed with it — it is the
same question MSG-0060 carries, and duplicating it across two records would have meant two
records waiting on one answer.

> **Also corrected:** the ledger row for **MSG-0057** read OPEN while the message file has read
> CLOSED since MSG-0058 ruled its four findings. The three views now agree for every message.

> **The line this replaces, retained:** "**Five messages carry `Status: OPEN`. Four are
> informational; one requires a decision.**" True until the three discharged records were closed.

> **The line this replaces, retained:** "**Four messages carry `Status: OPEN`, all informational
> and none blocking** …" True until MSG-0072 was raised the same day.

**MSG-0065's operator action has been taken.** It reported the scheduled task
`PCI-Execution-Supervisor` as **Disabled** while the `Schedule` service ran, and said the remedy
was to enable the task rather than restart the service. **The operator enabled it.** Verified
2026-08-21: task state **Ready**, cycling every ten minutes, `LastRunTime` 19:07 local. TASK-0023
was executed by a supervisor-started session as a direct result.

> **The lines this replaces, retained:** "**Three messages carry `Status: OPEN`** … **MSG-0065 is
> the one with an operator action attached** … the remedy is to **enable the task**, not restart
> the service. **It was not enabled by TASK-0023**: that is a Supervisor scheduling change,
> forbidden by MSG-0063, and an operator decision." Accurate until the operator enabled it.

> **The line this replaces, retained:** "**Two messages carry `Status: OPEN`, both informational and
> neither blocking: MSG-0060** … **and MSG-0064** (the TASK-0023 queue reconciliation)." True until
> MSG-0065 was raised later the same day.

> **The line this replaces, retained:** "**One message carries `Status: OPEN`: MSG-0060**, the
> TASK-0022 queue reconciliation … that a fifth number collision occurred, this time on an
> **executable task specification** rather than a message." True until MSG-0064 was raised.

> **The line this replaces, retained:** "**One message carries `Status: OPEN`: MSG-0057.**" That
> was true from 2026-08-21 until MSG-0058 ruled all four of its findings the same day. MSG-0057 is
> now **CLOSED**; its F1/F2/F3 were each decided as recommended.

> **The line this replaces, retained:** "**No message carries `Status: OPEN`.**" That was true
> from the TASK-0016 reconciliation until MSG-0057 was raised. The four that had been open —
> MSG-0044, MSG-0045, MSG-0047, MSG-0049 — remain closed, as the table below records.

**Those four are all settled and closed as of 2026-08-21:**

| ID | How it closed |
|---|---|
| MSG-0044 | TASK-0017 was reconciled into the queue, executed, and is COMPLETE |
| MSG-0045 | Its decision came in MSG-0046 (Option A); the suite ran 36/36 and TASK-0017 closed |
| MSG-0047 | Gate satisfied; the live-run gap it named was closed by TASK-0018 |
| MSG-0049 | Gate 3 met by external observation during the live run; all five gates MET |


> The line this replaces read "**No message carries `Status: OPEN`**", which was true when TASK-0016
> wrote it and stopped being true when TASK-0017 was authorized. It is corrected rather than quietly
> swapped, because a status file that overstates calm is the specific failure Rule 12 exists to
> prevent.

Every other communication is answered, decided, closed, or a record requesting no decision. **Every
task is COMPLETE except TASK-0002** (ABORTED, premise disproven by measurement).

> **Corrected 2026-08-21 by TASK-0019 (MSG-0050).** The sentence above previously also excepted
> "TASK-0017 (IN_PROGRESS, stopped at a permission boundary)". TASK-0017 has been COMPLETE since
> 2026-08-20 — the operator ran the suite under MSG-0046 and MSG-0047 records **36 passed, 0
> failed**. The status table earlier in this file already said so; only this sentence lagged.

> **MSG-0034 was the last one, and it is now CLOSED (2026-08-20, TASK-0016, MSG-0041).** It had been
> informational rather than a question — the TASK-0011 execution-path diagnosis, whose correction the
> smoke test then passed on — so nothing ever depended on closing it. MSG-0041 ruled that its
> diagnosis was verified and no unresolved action depends on the record.
>
> **The lead had already applied both closures before TASK-0016's session started** — the record
> itself in `4b5965d`, the register row in `9c6244c`. Neither was re-done: CLAUDE.md *Checkpointing
> and Recovery* rule (f) forbids repeating an operation merely because a record says it is
> incomplete, and both were verified by reading the files. TASK-0016 executed only what remained —
> the execution record, the register row, the queue update, this reconciliation, and the push. So
> **MSG-0034 was not modified by TASK-0016 at all**, which is worth stating because "TASK-0016 closed
> MSG-0034" reads otherwise. Substantive content is intact: `4b5965d` added a `## Closure` section
> and changed the status line, and deleted nothing.
>
> The stop condition was checked and did not fire. It covers a *material conflict* between MSG-0034 or
> MSG-0041 and actual state; what was found was state **ahead of** the authorization in the direction
> it points. Evidence: MSG-0042.

**The two findings raised in MSG-0032 §6 are now DECIDED and APPLIED.** The architecture lead ruled
on both in MSG-0035; TASK-0013 executed them on 2026-08-20 and recorded the evidence in MSG-0036:

1. **§6.2 — the blocker index contradicted this file. FIXED.** `implementation/blockers/README.md`
   showed BLK-0001 and BLK-0004 **OPEN** while both blocker records themselves read "RESOLVED /
   CLOSED — 2026-08-19". Only the index was stale. MSG-0035 decision 1 authorized the correction and
   both rows now read **RESOLVED 2026-08-19** with the evidence reference. The index and this file
   agree.
2. **§6.3 — duplicate message numbering. RULED ON.** MSG-0035 decision 2 approved a
   numbering-allocation convention, now recorded in `implementation/comms/README.md`: allocate from
   the register before creating a message, re-verify uniqueness immediately before commit, and on a
   collision **stop and report** rather than creating another duplicate. MSG-0020 and MSG-0033 stay
   dual-numbered; renumbering them is explicitly forbidden.

> **The rule caught a live collision on the day it was adopted.** MSG-0035 existed on disk but had no
> row in the COMMS register, so "the next number after the highest register row" would have produced
> **MSG-0035** — a third duplicate, created in the act of adding the rule against duplicates. The
> directory listing caught it. The convention as written therefore requires the register **and** a
> `MSG-*.md` listing **and** a repository grep. A missing row is a record defect, never evidence that
> a number is free.

**The MSG-0036 §6 finding is now DECIDED and APPLIED.** It had read: *BLK-0005 has no row in the
blocker index* — the file existed and was closed (MSG-0022 / MSG-0023), but TASK-0013 was forbidden
from changing any blocker other than BLK-0001 and BLK-0004, so it reported rather than fixed.
**MSG-0037 authorized the row; TASK-0014 added it on 2026-08-20** and recorded the evidence in
MSG-0038. The index now lists **BLK-0005 · High · RESOLVED 2026-08-19** with its evidence references.
The underlying blocker record was not altered, as MSG-0037 required.

**All five blockers are listed and all five read RESOLVED.** With TASK-0013's correction of BLK-0001
and BLK-0004 and TASK-0014's addition of BLK-0005, `implementation/blockers/README.md` and the blocker
records finally describe the same state.

**The discoveries-index drift is now FIXED.** It had read: `implementation/discoveries/README.md`
lists three discoveries while nine `DISC-*.md` files exist — third index, same failure mode. MSG-0037
had named it *"a separate future review"* and TASK-0014 left it alone. **MSG-0039 authorized the
review; TASK-0015 executed it on 2026-08-20** and recorded the evidence in MSG-0040. The index now
carries all nine rows, each status transcribed from the record's own header, with **no `DISC-*.md`
record altered**. Zero rows were stale and zero lacked a record — the drift was pure omission, and it
had hidden the two deployment-artifact defects (DISC-0007, DISC-0008) and the `/data` boundary finding
(DISC-0009) from anyone reading the index alone.

**All three indexes now agree with their records.** Blockers were corrected by TASK-0013 (BLK-0001,
BLK-0004) and TASK-0014 (BLK-0005); discoveries by TASK-0015. The shared failure mode across all
three was the same: a record is created or closed in its own file, and the table that indexes it is
not updated in the same commit.

> **The authorization arrived duplicate-numbered.** Two MSG-0039 files exist (`b123361`, `dc307fa`) —
> the third duplicate after MSG-0020 (a)/(b) and MSG-0033 (a)/(b), and the **first since the MSG-0035
> numbering rule was adopted**. They do not conflict: both are DECIDED, both authorize the same
> narrowly scoped reconciliation with the same forbidden list. TASK-0015 executed the stricter reading
> of both, registered them as MSG-0039 (a)/(b), and renumbered neither, per MSG-0035 decision 2.
>
> Worth stating once, plainly: the numbering rule constrains **Claude's** allocation, not the lead's,
> which is why it did not prevent this. MSG-0020 (a)/(b) contradicted each other and cost three
> follow-up messages; this pair agrees and cost nothing. That difference remains luck rather than
> process. **No ruling was requested** — TASK-0015 was not authorized to propose a protocol change,
> and did not. Recorded in MSG-0040 §6.

> **A second observation, recorded because it has now happened twice** (MSG-0038 §6). The COMMS
> register was one message stale when TASK-0014 allocated its number: **MSG-0037 was on disk and in
> the `CLAUDE-TASKS.md` ledger with no row in `comms/README.md`** — precisely the defect TASK-0013 hit
> with MSG-0035, one message later. The cause is structural rather than careless: the lead authorizes
> by committing the message plus a queue row, and the register row is added by the *executing session*
> afterwards, so between authorization and execution the register is reliably one behind. The
> directory-listing step of the MSG-0035 numbering convention caught it both times, which is the
> convention doing exactly its job. **No change is proposed and no ruling is requested** — it is
> recorded so a third occurrence is not read as a surprise.

> **Precedent, recorded so it is not over-read.** MSG-0031 accepted a metadata-only `touch` as
> within the scope of an authorized path-scoped `git checkout`. The architecture lead stated that
> this **does not create a general authorization for arbitrary preparatory commands** — each future
> case must be judged against its own authorization boundary. Do not cite MSG-0031 as licence to add
> preparatory steps to an authorized command.

**WP-0001 is COMPLETE.** MSG-0021 and BLK-0005 are closed; MSG-0019 is answered by the completion
decision. The **Execution Supervisor is ENABLED** and reconciling every ten minutes (MSG-0026). It runs
`acceptEdits` with a version-controlled deny list and never `--dangerously-skip-permissions`.
Testing showed the **deny list, not the permission mode, is the effective control** in headless
mode. MSG-0011 and MSG-0025 are closed.

Its start path is **proven**: it ran TASK-0003 on 2026-08-20 (MSG-0029), and TASK-0011 then tested
the whole loop on purpose — queue → Supervisor → Claude → COMMS → GitHub, no human relay — and it
**passed** (MSG-0032). The limit worth remembering: it recovers from *behind-with-a-clean-tree*
only. Ahead, or behind-and-dirty, it still refuses and waits for a human. That is the right
fail-closed choice, but a silent park looks identical from outside to a dead scheduler, which is
exactly what stalled TASK-0011's first attempts. `CYCLE_START` logging (`479dfa9`) now makes it
visible; it does not make it self-clearing.

| ID | Subject | Status |
|---|---|---|
| MSG-0001 | Authorized Ubuntu host and `/data/docker` storage boundary | ANSWERED — bootstrap contract |
| MSG-0002 | Kernel runtime stack ratification | CLOSED — ADR-0015 ratified |
| MSG-0003 | Repository layout authority and document corrections | CLOSED — decided by MSG-0005 |
| MSG-0004 | Prepared repository corrections | CLOSED — approved and applied |
| MSG-0005 | Architecture lead decisions | DECIDED — acted on 2026-08-19 |
| MSG-0006 | Absolute host file boundary (override) | DECIDED — correction applied, awaiting review |
| MSG-0007 | Permanent operating rule hardening | DECIDED — applied to CLAUDE.md and AGENTS.md |
| MSG-0009 | Documentation Is Mandatory rule added to `CLAUDE.md` | DECIDED — applied |
| MSG-0008 | Authorized bootstrap: exact operator procedure and path | **CLOSED** — executed and verified 2026-08-19 |
| MSG-0010 | Phase 0 — execution control, roadmap, queue, recovery | **CLOSED** — authorized via MSG-0012, executed |
| MSG-0012 | Architecture lead decisions: TASK-0004 / TASK-0005 | DECIDED — both COMPLETE |
| MSG-0013 | Architecture review checkpoint | DECIDED — queue reconciled |
| MSG-0014 | Queue authorization reconciliation | DECIDED — reconciled in `de35bf4` |
| MSG-0015 | TASK-0004 / TASK-0005 complete; TASK-0006 authorization required | **CLOSED** — authorized by MSG-0016, executed |
| MSG-0016 | Authorize TASK-0006 | DECIDED — executed, G3 passed |
| MSG-0017 | TASK-0006 complete; WP-0001 reproducible | **CLOSED** — TASK-0007 authorized and complete |
| MSG-0018 | Authorize TASK-0007 | DECIDED — executed, G4 passed |
| MSG-0019 | TASK-0007 / TASK-0008 complete; ready for completion decision | **CLOSED** — answered by the completion decision |
| MSG-0020 (a) / (b) | WP-0001 completion decision — duplicate numbering | **SUPERSEDED** — both retained; resolved by MSG-0022 |
| MSG-0021 | Which MSG-0020 stands? | **CLOSED** — COMPLETE stands; boundary ruling recorded |
| MSG-0022 | Resolve MSG-0020 conflict | DECIDED — WP-0001 COMPLETE; TASK-0012 not authorized |
| MSG-0023 | Correct TASK-0009 boundary | DECIDED — TASK-0009 terminal; no TASK-0012 |
| MSG-0024 | Execution Supervisor enable decision | DECIDED — enablement authorized |
| MSG-0025 | Supervisor installed, dry-run verified, NOT enabled | **CLOSED** — answered by MSG-0026 |
| MSG-0026 | Supervisor **ENABLED**; permission mode determined and verified | **CLOSED** — start path PROVEN by TASK-0003, re-proven end to end by TASK-0011 |
| MSG-0027 | TASK-0003 authorized; line-ending normalization only | DECIDED — executed 2026-08-20 |
| MSG-0028 | TASK-0003 implemented, NOT complete — refresh refused by the permission layer | **DECIDED** — decisions 2 and 3 applied; decision 1 resolved by MSG-0030 |
| MSG-0011 | Execution Supervisor — built, tested, not installed | **SUPERSEDED** by MSG-0024 — the supervisor is installed and ENABLED |
| MSG-0029 | Supervisor start path — diagnosis, fixes, first successful launch | **CLOSED** |
| MSG-0030 | Authorized refresh command was a no-op; three alternatives | **DECIDED** — Option B authorized and executed |
| MSG-0031 | TASK-0003 COMPLETE — CRLF residue cleared | **DECIDED** — completion accepted |
| MSG-0032 | TASK-0011 Supervisor smoke test — COMMS audit and result | **RECORD** — passed; **two findings need a ruling** (§6.2, §6.3) |
| MSG-0033 (a) / (b) | TASK-0011 diagnosis directives — duplicate numbering, non-conflicting | **DECIDED** — both satisfied; corrected in `479dfa9`, answered by MSG-0032 |
| MSG-0034 | TASK-0011 execution path — diagnosis and minimal correction | **CLOSED** 2026-08-20 by MSG-0041; informational only, the smoke test passed after the fix |
| MSG-0035 | Architecture decisions for the MSG-0032 findings | **DECIDED** — both applied by TASK-0013, see MSG-0036 |
| MSG-0036 | TASK-0013 execution record — MSG-0035 decisions applied | **RECORD** — its §6 finding is ruled on by MSG-0037 and applied |
| MSG-0037 | Architecture decision: reconcile BLK-0005 in the blocker index | **DECIDED** — applied by TASK-0014, see MSG-0038 |
| MSG-0038 | TASK-0014 execution record — BLK-0005 row added | **RECORD** — applied and verified; **no decision requested** |
| MSG-0039 (a) / (b) | Architecture decision: reconcile the discoveries index — duplicate numbering, non-conflicting | **DECIDED** — both satisfied by TASK-0015, see MSG-0040 |
| MSG-0040 | TASK-0015 execution record — discoveries index reconciled, 3 rows -> 9 | **RECORD** — applied and verified; **no decision requested** |
| MSG-0041 | Architecture decision: close the resolved MSG-0034 informational record | **DECIDED** — applied by TASK-0016, see MSG-0042 |
| MSG-0042 | TASK-0016 execution record — MSG-0034 closed in record and register | **RECORD** — applied and verified; **no decision requested** |
| MSG-0043 | Architecture decision: authorize TASK-0017 supervisor heartbeat observability | **DECIDED** — executed by TASK-0017; verification blocked, see MSG-0045 |
| MSG-0044 | TASK-0017 authorized but absent from the queue; queue reconciled | **CLOSED** — informational; TASK-0017 executed and COMPLETE |
| MSG-0045 | TASK-0017 execution record — heartbeat corrected, **NOT verified** | **CLOSED** — answered by MSG-0046 and discharged by MSG-0047 |
| MSG-0046 (a) / (b) | Architecture decision: how TASK-0017's test gate is satisfied — duplicate numbering, non-conflicting | **DECIDED** — Option A, operator runs the suite once; no permission expansion. Both register rows added 2026-08-21 by TASK-0019 |
| MSG-0047 | TASK-0017 verification result — **36 passed, 0 failed** | **CLOSED** — gate satisfied; the live-run gap it named was closed by TASK-0018 |
| MSG-0048 | Architecture decision: authorize TASK-0018 live heartbeat validation | **DECIDED** — executed; see MSG-0049 |
| MSG-0049 | TASK-0018 verification record — `RUNNER_RUNNING` **observed live** | **CLOSED** — gate 3 met by external observation; all five gates MET |
| MSG-0050 | Architecture decision: authorize TASK-0019 post-WP-0001 baseline audit | **DECIDED** — executed; see MSG-0051 |
| MSG-0070 | TASK-0024 execution record — **the EPA ADR set is drafted** | **RECORD** — 8/8 acceptance criteria; **ADR-0017…ADR-0022 created as PROPOSED**, no accepted ADR modified, no task marked READY; **§9 asks the lead to accept, amend or reject the six drafts** and to rule on ADR-0019's normalization gap |
| MSG-0066 | TASK-0023 execution record — EPA governance reconciled, **WP-0009** allocated | **RECORD** — 7/7 acceptance criteria; no ADR created, no task marked READY; **no decision requested** |
| MSG-0055 | TASK-0021 execution record — employee policy assistant architecture definition | **RECORD** — 11/11 criteria met; **§5 lists fourteen decisions requiring the architecture lead**; none self-authorized |
| MSG-0054 | Employee policy assistant architecture objective | **DECIDED** — TASK-0021 authorized as architecture definition only; executed, see MSG-0055 |
| MSG-0053 | Architecture lead decisions C6-C7 | **DECIDED** — C6 not authorized/not required; C7 no new work package pending a concrete objective |
| MSG-0052 | Architecture lead baseline decisions C1-C5 | **DECIDED** — C1-C3 applied, C4/C5 no action; C6/C7 subsequently resolved by MSG-0053 |
| MSG-0051 | TASK-0019 execution record — post-WP-0001 baseline audit | **RECORD** — corrections applied; **§C lists items needing an architecture-lead decision** |

> **Corrected 2026-08-21 by TASK-0019 (MSG-0050).** Four rows above — MSG-0044, MSG-0045, MSG-0047
> and MSG-0049 — read **OPEN** while the message files themselves, and `comms/README.md`, both read
> **CLOSED**. All four were closed on 2026-08-21 in commit `ef454af`; this table was the one place
> the change did not land. The section immediately above it in this same file already said "No
> message carries `Status: OPEN`", so the file contradicted itself within a few hundred words.
> Every status here is now transcribed from the message file's own `**Status:**` line, read
> directly — all 54 of them — rather than copied from another index.

## Repository / GitHub State

> **Current as of 2026-08-21, TASK-0021 — read this before the block below.** The channel is
> **partially** operational. TASK-0021's first push succeeded (`3350cb4..b96187b`) and delivered the
> entire architecture definition. Its second push was **rejected** because a concurrent actor moved
> `origin/main` mid-run. The session stopped at the fail-closed boundary and attempted no
> reconciliation. `origin/main`'s current value is **UNKNOWN** — `git fetch` is not allowlisted and
> `git ls-remote` was refused. See **BLK-0006**. The 2026-08-20 verification quoted below is history,
> and its SHAs were already stale before this note was written.

**The communication channel is operational.** Verified 2026-08-20 at the start of TASK-0016:

```text
HEAD          9c6244c   docs(comms): register MSG-0041 and close MSG-0034
origin/main   9c6244c
git status -sb  ## main...origin/main      (clean, no ahead/behind)
```

That `origin/main` value is the ref as the **Supervisor** left it after its own fast-forward at
09:57:18Z — not a fetch by the session, which cannot perform one (see below). HEAD was re-checked
immediately before TASK-0016's commit and had not moved.

**Push is now available to the unattended runner.** `git push origin main` was added to
`implementation/operations/supervisor/runner-settings.json` under MSG-0028, narrowly scoped so the
remote and branch are fixed and arbitrary refspecs remain unavailable. `git push --force` and
`git push -f` stay denied. TASK-0011 delivered its own evidence to GitHub without a human relaying
it — which is the specific thing TASK-0011 existed to prove.

**`git fetch` is still not allowlisted**, so a runner cannot independently confirm `origin/main`; it
sees the ref as the Supervisor's own fetch/fast-forward last left it. Recorded as a real limit, not
worked around.

---

### Historical — the TASK-0003 push gap, since closed

> The block below records the state on 2026-08-20 *before* the push capability was granted, when
> `93d7067` was stranded locally. It is retained because it is the evidence behind that grant. The
> SHAs in it are history; **do not read them as current.** Both commits reached `origin/main` long
> ago, and HEAD has since moved to `479dfa9`.

`aaf0d34` was not that session's commit — it is `fix(supervisor): capture runner output and make the
start path actually work`, pushed by a **concurrent actor while TASK-0003 was running**. It is the
evidence behind MSG-0028 §3(a).

#### The TASK-0003 commit was COMMITTED but NOT PUSHED

```text
$ git log --oneline -2
93d7067 feat(records): TASK-0003 - pin *.md to LF; refresh refused, not worked around
aaf0d34 fix(supervisor): capture runner output and make the start path actually work

$ git status -sb
## main...origin/main [ahead 1]

$ git push origin main
This command requires approval
```

`git push` is not on the `.claude/settings.local.json` allowlist, so the unattended runner cannot
perform it. **`93d7067` exists locally only.** The architecture lead cannot read any of it on GitHub
until someone runs:

```bash
git push origin main
```

This is the one case `CLAUDE.md` Rule 7 exempts from repository-first communication — a fault that
prevents pushing at all.

`git push --force` and `git push -f` are separately and correctly denied by the governance deny list.
The plain push was merely un-allowlisted, which is a gap in the runner's grant rather than a policy
decision — and it meant **an unattended session could complete work it could not deliver.** That gap
is what MSG-0028 closed by adding the narrowly-scoped `git push origin main`. End of historical block.

---

Local and remote are identical. All WP-0001 implementation and communication artifacts are on
`origin/main`. The architecture lead can read every artifact directly; the operator is no longer
required as a messenger.

> Every SHA in this section is a point-in-time check and goes stale the moment anything is
> committed. Treat them as evidence that a reconciliation was performed on the stated date, never as
> the current HEAD. Verify with `git rev-parse HEAD origin/main` rather than trusting this file.

## Open Blockers

**None.** BLK-0001 through **BLK-0010** are all RESOLVED.

**BLK-0010's resolution has now been proven by execution, not just by a headless probe.** On
2026-08-22 the next supervisor-started session ran TASK-0027 end to end: **the corpus read succeeded on
the first attempt**, the survey completed, and **the repository boundary held** — `git status` clean, no
`plan.pdf` under `D:\Work\pci-platform`, and no PDF anywhere in this repository's history. Record:
**MSG-0084**.

**BLK-0010 was raised and resolved on 2026-08-22.** A supervisor-started TASK-0027 runner was denied
its read of the corpus — *"Claude Code may only list files in the allowed working directories for this
session: 'D:\Work\pci-platform'"* — and stopped at its first action, producing **no survey figure of
any kind**. That was the seam between two individually-correct controls: MSG-0080 requires the corpus
**outside** the repository, and the runner's session boundary **is** the repository.

**MSG-0083 chose option A** and authorized the narrowest read-only grant. It is applied to
`runner-settings.json` — version-controlled, so the change is reviewable rather than buried in a
command line:

```json
"additionalDirectories": [ "D:\Work\pci-corpus" ]
"deny": [ "Edit(//D:/Work/pci-corpus/**)", ... ]
```

**Read-only by construction**, and **verified empirically before being relied on**: a headless session
with exactly those settings read **641,807 bytes, `%PDF-1.7`**, and cannot write.

**Three deny rules were wrong and were removed rather than left in.** `Write(...)`, `MultiEdit(...)`
and `NotebookEdit(...)` on that path were rejected by the permission layer — only `Edit(path)` rules
are matched by file-permission checks, and `Edit` covers every file-editing tool. Leaving them would
have produced a warning on every runner start **and a settings file that read as stricter than it
was**, which is worse than useless in a security control.

**Nothing was broadened.** One external directory, read-only; MSG-0028's four `allow` entries
untouched; no repository access and no other external path.

**BLK-0001 through BLK-0005 are all RESOLVED.** BLK-0005 was closed by MSG-0022 / MSG-0023,
which ruled that the COMPLETE decision stands and that TASK-0012 is not authorized.

There are no open blockers. The two defects found during verification (DISC-0007, DISC-0008) are
recorded as discoveries with proposed tasks, not as blockers: nothing is prevented from proceeding,
but the deployment artifacts are not yet correct.

> **Reconciled 2026-08-20 by TASK-0013.** `implementation/blockers/README.md` had listed **BLK-0001
> and BLK-0004 as OPEN**, contradicting the paragraph above. Both now read **RESOLVED 2026-08-19**,
> with the resolution date and evidence reference, under MSG-0035 decision 1.
>
> The block below is retained as the record of what was found and why it was not fixed at the time.
> TASK-0011 was right to stop: changing a blocker status is a substantive change to the project
> record, not a typo fix, and it lay outside that task's authorized scope. It recorded the
> contradiction and asked (MSG-0032 §6.2); MSG-0035 answered; TASK-0013 applied it. That sequence —
> stop, record, ask, execute on the ruling — is the intended one.
>
> The underlying evidence never changed: MSG-0008 is CLOSED, the operator executed the bootstrap on
> 2026-08-19, `DockerRootDir` = `/data/docker` was verified directly, and 229 tests ran on the host —
> none of it possible with an unbootstrapped host, which is what BLK-0001 and BLK-0004 asserted. The
> individual blocker files were resolved on the day; only the index lagged.
>
> **BLK-0005 — now listed, 2026-08-20 (TASK-0014, MSG-0037).** Its file existed and was closed, but
> the index had no row for it. TASK-0013 was forbidden from touching any blocker other than BLK-0001
> and BLK-0004, so it reported instead (MSG-0036 §6); MSG-0037 authorized the row and TASK-0014 added
> it, citing MSG-0022, MSG-0023, and the blocker record. The underlying record was not altered.
>
> Both corrections are one failure seen from two sides: BLK-0001 and BLK-0004 were shown OPEN when
> their records said RESOLVED, and BLK-0005 was shown nowhere at all when its record said RESOLVED.
> A blocker gets closed in its own file and not in the table. **All five rows are now present and
> correct.** Evidence: [`../comms/MSG-0038-task-0014-execution-record.md`](../comms/MSG-0038-task-0014-execution-record.md).

## Recently Closed

| ID | Subject | Closed | Outcome |
|---|---|---|---|
| BLK-0002 | GitHub push unavailable — communication channel down | 2026-08-19 | **RESOLVED.** All commits reached `origin/main`. Diagnosis history preserved in the blocker. |
| BLK-0003 | PCI server key could not be unlocked | 2026-08-19 | **RESOLVED.** Key loaded into a reachable agent; SSH access to the host verified. Passphrase retained. |
| MSG-0001 | Authorized Ubuntu host and `/data/docker` storage boundary | 2026-08-19 | **ANSWERED** by `docs/operations/pci-server-bootstrap.md` (accepted contract). |
| BLK-0001 | No PostgreSQL or container execution environment | 2026-08-19 | **RESOLVED.** Host bootstrapped; all four gated acceptance criteria verified. |
| BLK-0004 | No privilege to bootstrap the authorized host | 2026-08-19 | **RESOLVED.** Operator executed the bootstrap; `DockerRootDir` = `/data/docker` verified directly. |
| MSG-0008 | Authorized bootstrap procedure | 2026-08-19 | **CLOSED.** All three steps complete and verified. |

## Permanent Operating Rules

The permanent rules in `CLAUDE.md` and `AGENTS.md` govern every session. Two hardening rounds are
recorded:

| Date | Change | Record |
|---|---|---|
| 2026-08-19 | Twelve non-negotiable rules, mandatory startup checklist, mandatory pre-action checklist | MSG-0007 |
| 2026-08-19 | **Documentation Is Mandatory** — ten clauses added to `CLAUDE.md` | MSG-0009 |

**Documentation Is Mandatory** (`CLAUDE.md`) requires, for every task: reading the applicable
documentation before starting; recording discoveries, assumptions, blockers, failed verification,
deviations, and decisions during execution; updating the persistent records on completion; and
committing and pushing those updates *before* reporting the task complete.

Its operative constraints:

- A conversational response is **not** the project record. The repository is.
- Never report *done*, *complete*, *verified*, *blocked*, or *waiting* unless the state and its
  evidence are recorded in GitHub.
- "No documentation change required" must be **verified**, never assumed.
- A completely new Claude session must be able to resume from repository documentation and
  repository state alone, without access to any conversation.

Both files were extended additively. Every original line of `CLAUDE.md` was checked for presence
after the change: none removed. `CLAUDE.md` was 415 lines at that point.

> **Corrected 2026-08-21 by TASK-0019.** The sentence read "`CLAUDE.md` is now 415 lines", in the
> present tense, which stopped being true as soon as later rules were added. Measured this session:
> **`CLAUDE.md` 571 lines, `AGENTS.md` 115** (`wc -l`). The tense is the defect — a measurement
> written as a standing fact. It is now anchored to the date it describes; do not treat either
> number as current without re-measuring.

## Accepted Decisions

| ID | Subject | Authoritative record |
|---|---|---|
| ADR-0015 | Kernel implementation stack (Node.js 24 LTS + TypeScript, zero-framework, `pg`) | `docs/decisions/ADR-0015-kernel-implementation-stack.md` — ACCEPTED |
| ADR-0016 | Tenant isolation enforcement (three layers, FORCE RLS, 404 over 403) | `docs/decisions/ADR-0016-tenant-isolation-enforcement.md` — ACCEPTED |

Both were ratified by the architecture lead on 2026-08-19 in MSG-0005 and promoted to
`docs/decisions/`. The implementation-side proposals in `implementation/decisions/` are retained
as history and now record their ratification.

**Stated scope limits, which implementation must respect:**

- ADR-0015 applies to the kernel only. It does not constrain future AI, ingestion, connector, or
  UI runtimes.
- ADR-0016 excludes system-tenant governance from WP-0001.
- ADR-0016's FORCE RLS and non-BYPASSRLS requirements are **VERIFIED** as of 2026-08-19 and
  re-verified under TASK-0007 (gate G4) against the clean-room stack. Ratification still does not
  constitute verification — but these obligations have now been exercised against a live PostgreSQL
  instance, not merely asserted. See the Verification Summary above and report section 11.

  > Reconciled by TASK-0011. This bullet previously read "remain **unverified** … never been
  > exercised against a real PostgreSQL instance", which was true when written and was contradicted
  > by this same file's Verification Summary once the host runs completed. Kept visible rather than
  > silently swapped, because the correction is the useful part of the record.

## Applied Repository Corrections — 2026-08-19

Authorized by MSG-0005; prepared in MSG-0004.

| File | Correction |
|---|---|
| `CLAUDE.md` | Startup step 4 now reads the active work package from `docs/program/work-packages/`. |
| `AGENTS.md` | New Governance Tree Authority section: `docs/` authoritative, `knowledge/governance/constitution.md` excepted, other `knowledge/` content legacy. |
| `docs/architecture/repository-map.md` | Records `services/`, `deploy/`, `implementation/`, `CLAUDE.md`, and `docs/program/`; sequencing gate replaced with the lifted-gate statement. |
| `implementation/decisions/ADR-0015`, `ADR-0016` | Ratification recorded; proposed text retained. |
| `implementation/comms/MSG-0003`, `MSG-0004` | Closed and retained as historical records; not deleted. |

Legacy `knowledge/` duplicates were **not** deleted, by explicit instruction — their migration is
a separate controlled cleanup task. DISC-0001's divergence therefore still exists on disk; only
precedence has changed.

## Discoveries

Index: `implementation/discoveries/README.md` — reconciled 2026-08-20 by TASK-0015, and extended to
**ten** records on 2026-08-21 when TASK-0021 added DISC-0010. The record file is the source of truth;
both tables index it, and both were updated in the same commit as the record.

| ID | Subject | Status |
|---|---|---|
| DISC-0001 | Governance documents duplicated across `knowledge/` and `docs/` | Recorded — no action taken |
| DISC-0002 | In-memory adapter test-fidelity gap | Recorded — mitigated, not eliminated |
| DISC-0003 | Development identity adapter boundary | Recorded |
| DISC-0004 | Compose stack predates the `/data/docker` boundary | **RESOLVED** 2026-08-19 — pre-staged `daemon.json` answers it |
| DISC-0005 | `npm test` reports success while running zero tests under POSIX shells | **CORRECTED** 2026-08-19 — target-platform claim disproven; confined to Git Bash / MSYS |
| DISC-0006 | CRLF line endings silently defeat anchored text edits | **RESOLVED** 2026-08-20 by TASK-0003 — residue 150 -> 0 |
| DISC-0007 | Init refuses to create a passwordless role, then creates one anyway | **RESOLVED** 2026-08-19 by TASK-0004 |
| DISC-0008 | Compose kernel service cannot start as committed | **RESOLVED** 2026-08-19 by TASK-0005 |
| DISC-0009 | Docker CLI writes client state to `/home/claude`, outside `/data` | **CLOSED — ACCEPTED, NOT A VIOLATION** 2026-08-19 by MSG-0020(b) / MSG-0022 / MSG-0023 |
| DISC-0010 | The two work-package registers disagree about what WP-0001 is | **RECORDED** 2026-08-21 (TASK-0021, MSG-0055 §7.1) — no action taken, none proposed |

> **Corrected 2026-08-20 by TASK-0015.** This table had two defects. It was declared with **two**
> columns while four rows supplied three cells, so the renderer silently dropped the status of
> DISC-0006 through DISC-0009 — the header is now three columns, matching the data that was already
> there. And the DISC-0009 row read **OPEN** while its record reads "CLOSED — ACCEPTED, NOT A
> VIOLATION", ruled on 2026-08-19. Both are stale-index corrections against unambiguous records,
> authorized by MSG-0039 (a) §4 and §7, and declared as a judgment call in MSG-0040 §5 because
> MSG-0039 named `discoveries/README.md` specifically and this is a second file. No discovery
> substance changed.

## Report

`implementation/reports/WP-0001-kernel-foundation-report.md`

## Communication Commands

- `GO` — continue the active work package.
- `STATUS` — inspect and update current implementation state.
- `COMMS` — inspect implementation communication artifacts.
- `CHECK` — verify tests and acceptance criteria.
- `REPORT` — produce the current work-package report.
- `STOP` — stop safely and record state.

## Next Action

**No task is READY, and the next action is the Architecture Lead's: authorize one.**

**TASK-0031 is COMPLETE (2026-08-23, MSG-0097).** ADR-0020 AMD-01 is **APPLIED** — applying commit
`a1be892`, tree clean, **7/7 acceptance criteria MET**, `docs/decisions/` changed in **one file** at
**15 insertions / 0 deletions**. That was the only thing MSG-0095 authorized, so **the queue is now
empty by design**, and the supervisor reporting `no READY task` is correct behaviour rather than a
stall.

**Nothing downstream became executable.** No engine, index technology, embedding model, framework,
runtime or provider is selected; ADR-0019's §6 Arabic deferral and its production-evidence gate stand;
WP-0009 still reads `DEFINED — NOT AUTHORIZED FOR IMPLEMENTATION`; **T-0 and T-A…T-I remain
unauthorized.**

> **Do not re-run TASK-0031.** Re-running it against the now-amended ADR would insert hunk 1 **twice**,
> and a duplicated clause in an ADR that exists to remove ambiguity is worse than a missing one. Each
> of the four applied markers currently occurs **exactly once** — verify that before believing any
> record that says otherwise.

**Three open items in WP-0009 §8 are unchanged by this task** and are still the Lead's: the T-D/T-E
interim mitigation, PR3's owner and date for the identity provider, and how WP-0009 relates to the
`PLAN-WP-0001` planning entries.

> **Historical — the position while TASK-0031 was READY and unexecuted, retained.** Everything below
> described the task to be done. **It has been done**, exactly as described and within the boundary it
> names. The account of *what* was accepted and *why* is still the clearest short statement of it in
> this file, which is why it is retained rather than deleted.

### What was accepted

**AMD-01 is ACCEPTED as drafted, with the optional traceability row** — both hunks. MSG-0095 confirmed
the draft's reading: ADR-0020 §3.1 already required an already-constrained candidate set and §4 already
made retrieve-then-filter a gate failure, but the accepted text **did not say** that an engine unable
to constrain **inside** the retrieval operation is **disqualified**, nor that **G3 is evidenced at the
query issued to the engine** rather than the response returned. Those two gaps are what the amendment
closes.

**"Over-fetch-then-filter" stays.** The draft flagged it as the one phrase not already in ADR-0020's
own words and invited the Lead to strike it; MSG-0095 ruled it consistent with **MSG-0092 §1(1)**,
which states it verbatim and is settled authority. Surfacing it rather than burying it was right, and
so was declining to decide it.

### What TASK-0031 does — three edits, nothing else

1. **Hunk 1** at the end of ADR-0020 **§4**, after *"An exclusion cannot fail open; a filter can."*
2. **Hunk 2** as one appended **Traceability** row.
3. **A concise header note** naming AMD-01 and MSG-0095.

**Wording is taken verbatim from AMD-01, not retyped** — transcription drift inside an accepted ADR is
the failure this must not introduce.

### The boundary, because this task is unusual

**It edits an accepted, promoted ADR** — something every prior task in this work package was forbidden
to do, TASK-0030 included, which drafted and stopped as instructed.

**That prohibition is not relaxed generally.** MSG-0095 §3 authorizes *"acceptance/application of AMD-01
only"*, so `docs/decisions/` may change in exactly one file and exactly three places. The verification
that proves it: `git diff --name-only docs/decisions/` must name **ADR-0020 and nothing else**.

**ADR-0019 is explicitly out of scope**, along with its Arabic production-evidence gate — first among
the boundaries MSG-0095 §4 preserves. The MSG-0091 n=1 scoping is untouched.

### The hazard the recovery procedure names

**Re-running this task against an already-amended ADR would insert hunk 1 twice.** A duplicated clause
in an accepted ADR is worse than a missing one — it creates two readings of a rule that exists to
remove ambiguity. The task must check whether the amendment is already applied *before* applying it.

### Operational

**The scheduled task is `Disabled`**, so no unattended cycle will take TASK-0031. The supervisor path
remains available by manual trigger, as used for TASK-0021, TASK-0022 and TASK-0030 — the supervisor
still makes the selection and holds the lock. **Re-enabling the schedule is an operator action and was
not taken.**

**No implementation is authorized.** T-0 and T-A…T-I remain unauthorized, and MSG-0095 §4 authorizes
nothing beyond applying this amendment.

---

**Historical — the position while AMD-01 awaited a ruling, retained.** The text below reported
TASK-0030 complete with the draft awaiting review. **MSG-0095 accepted it** and authorized
TASK-0031 to apply it.

> ## Next Action
> 
> **No task is READY. TASK-0030 is COMPLETE (MSG-0094), and the next action is the Architecture Lead's:
> review `ADR-0020-AMD-01`.**
> 
> **The decision, precisely:** accept, amend, or reject the drafted amendment — and if accepting, say
> **which recording convention** (in place with a header amendment note, or a superseding ADR; the
> repository has **no precedent** for amending an accepted ADR) and **whether the optional traceability
> row is included**. **Applying the amendment requires an explicit authorization** — MSG-0092 §5 withheld
> it, and TASK-0030 stopped accordingly.
> 
> **A second, smaller item is referred and blocks nothing** (MSG-0094 §11): TASK-0030's criterion 5
> requires `git diff --name-only docs/` to be empty while the same task's Documentation section requires
> updating **WP-0009**, which lives under `docs/`. Both cannot hold literally. The check's stated intent —
> *"no accepted ADR touched"* — **is met**: `git diff --name-only docs/decisions/` is empty. **Scoping the
> check to `docs/decisions/` is the durable fix**, and it is the Lead's wording to change.
> 
> **Nothing else may start.** T-0 and T-A…T-I remain unauthorized, no engine or model may be selected,
> and no implementation task is READY.
> 
> > **Superseded 2026-08-22 — the position while TASK-0030 was READY, retained.** The section below was
> > written when MSG-0092 had just authorized the task and it had not run. **It has now run and is
> > COMPLETE.** Everything it says about what stays open — the nine selection categories, ADR-0019's
> > deferral, T-0 and T-A…T-I — is **unchanged and still current**; TASK-0030 touched none of it.
> 
> ### EPA-0005 is ACCEPTED
> 
> **MSG-0092 accepted it** as the architecture evaluation record **and** as the ruling record for the
> runtime seam. Its header now records that; **it was not promoted to `docs/`**, because MSG-0092
> accepted without authorizing promotion and promotion is the Lead's act — the same distinction TASK-0025
> turned on.
> 
> **Three constraints are now settled architecture**, as consequences of the existing ADR set rather than
> technology selections:
> 
> 1. **Authorization enforced inside the retrieval operation** — retrieve-then-filter and
>    over-fetch-then-filter are both unacceptable.
> 2. **Capacity planned for three local model workloads** — generation, multilingual embedding,
>    entailment.
> 3. **Conversation and audit storage separate**, with **Restricted passages barred from ordinary logs
>    and telemetry**.
> 
> **Approach C is chosen** — two services on the C2/C6 seam: a governed application layer holding the
> authorization-critical path, and a document/inference worker behind an explicit contract. **The worker
> is not an authorization authority**; authorization stays in the governed layer *before* retrieval, and
> SPEC-0008's boundary is preserved. **A stack-shape decision that selects no runtime.**
> 
> **No generic stack ADR is created** — declined explicitly, on the ground that an ADR restating that
> selections remain open adds nothing.
> 
> ### What TASK-0030 does, and where it stops
> 
> **Draft the minimum clarification** making ADR-0020's existing §3/§4 pre-constrained retrieval
> requirement explicit **as an engine-selection / gate criterion**, without changing substantive policy.
> 
> **The gap is consequence, not policy.** §4 is already *"No retrieve-then-suppress — the rule this ADR
> exists for"*, and §3 already sets out four independently-sufficient enforcement points. What is not
> stated in terms is that the rule **disqualifies any retrieval engine that cannot apply authorization
> constraints inside the query** — so a future evaluation could satisfy the ADR on paper while planning
> to filter afterwards.
> 
> **It drafts and stops.** MSG-0092 §5: *"stop before applying the amendment unless a subsequent explicit
> authorization permits acceptance."* **ADR-0020 is accepted and promoted — editing it is the Lead's
> act.**
> 
> **One outcome is legitimate and named in advance:** if §§3–4 already state the consequence
> unambiguously, **reporting that no amendment is needed is a correct result.** A task that must produce
> an amendment will produce one whether or not it is warranted.
> 
> > **Outcome, recorded 2026-08-22 (MSG-0094).** That named outcome **was tested against the accepted
> > text and did not apply.** §§3–4 state the *rule* unambiguously; what they omit is the *consequence* —
> > engine disqualification, and what G3 inspects. **An amendment was drafted, one 148-word insertion at
> > the end of §4, and it was NOT applied.**
> 
> ### What stays open
> 
> **Nine selection categories** remain deliberately open — application framework/runtime, retrieval/index
> engine, extraction toolchain, embedding model, generation model, entailment model, local serving
> runtime, frontend framework, identity provider. **TASK-0030 touches none.**
> 
> **ADR-0019's Arabic deferral is unchanged**, and MSG-0092 restates the scoping exactly: n=1 is
> sufficient for bounded architecture testing and **does not become production corpus evidence**.
> 
> **T-0 and T-A…T-I remain unauthorized**, and MSG-0092 §5 forbids starting any of them, or any model or
> engine selection, from that message.
> 
> ### Operational
> 
> MSG-0092 directs execution through the normal queue/supervisor path. **The scheduled task is
> `Disabled`**, so no unattended cycle will take TASK-0030 — the supervisor path remains available by
> manual trigger, as used for TASK-0021 and TASK-0022. **Re-enabling the schedule is an operator action
> and was not taken.**
> 
---

**Historical — the position while EPA-0005 awaited a ruling, retained.** The text below reported
no authorized architecture task remaining and named EPA-0005 as the gate. **MSG-0092 ruled on it**
and authorized TASK-0030.

> ## Next Action
> 
> **No task is READY, and there is no authorized architecture task remaining. The live gate is the
> Architecture Lead's ruling on `EPA-0005`.**
> 
> ### The ruling that changed the position
> 
> The Lead ruled (MSG-0091) that the Arabic **n=1** documents are **sufficient technical test evidence
> for the current architecture work**, that representative organizational Arabic material is **not
> required to continue bounded testing**, and that MSG-0090's evidence gap is **preserved for the
> eventual production normalization decision**.
> 
> **It conflicts with nothing.** ADR-0019 §6 and MSG-0056a **D6** gate **production use**, which the
> ruling explicitly leaves intact; they say nothing about evidence adequacy for bounded testing. Had the
> ruling declared n=1 sufficient to *amend* ADR-0019, that would have conflicted and this session would
> have stopped instead of recording it.
> 
> **MSG-0090 is preserved, not withdrawn** — unchanged and still OPEN, with a note recording that its
> consequence is now scoped to the production decision. Its §4 evidence specification remains the
> statement of what that decision will need.
> 
> ### Why there is no next architecture task
> 
> **Verified rather than assumed.** WP-0009 §6.2 defines exactly three architecture tasks, and no fourth
> is referenced anywhere in WP-0009, EPA-0004 or EPA-0005:
> 
> | Task | Executed as | State |
> |---|---|---|
> | **A-ADR** | TASK-0024 | ADR-0017…ADR-0022 **accepted (MSG-0071) and promoted (TASK-0025)** |
> | **A-STACK** | TASK-0026 | **`EPA-0005` delivered — PROPOSED, awaiting the ruling** |
> | **A-SURVEY** | TASK-0027 / 0028 / 0029 | **Performed at n=1 on three producers** |
> 
> Every AUTHORIZED message has a matching execution record. Everything remaining in the sequence is an
> **implementation** task — T-0 and T-A…T-I — and all are explicitly unauthorized.
> 
> **The instruction was to proceed with the next authorized architecture task. The honest execution is to
> report that the set is empty rather than manufacture a task to satisfy the verb.**
> 
> ### What waits behind EPA-0005
> 
> 1. **Accept, amend, or reject `EPA-0005`**, including its **§9.1** constraints recommended as settled
>    and its position that stack **selection** stays open.
> 2. **The one-runtime-or-two trade.**
> 3. **Whether a stack ADR is created now** — EPA-0005 recommends **not** yet.
> 
> **Once ruled on, the next authorization is a work-package or implementation-task decision**, which is
> also the Lead's. This session can self-authorize neither.
> 
> ### Operational
> 
> The scheduled task `PCI-Execution-Supervisor` is **Disabled**; nothing runs unattended until it is
> re-enabled. **Implementation remains prohibited**, and **T-0 still needs a privileged
> identity-provider deployment** that no decision can substitute for.
> 
---

**Historical — the position before the n=1 sufficiency ruling, retained.** The text below
reported the Arabic evidence gap as gating. **MSG-0091 scoped it** to the production
normalization decision, leaving bounded architecture testing unblocked.

> ## Next Action
> 
> **No task is READY. The next action is a scoping decision by the Architecture Lead, and it needs one
> answer from the organization first (MSG-0090).**
> 
> ### The finding
> 
> **Representative approved organizational Arabic policy material is REQUIRED and is NOT AVAILABLE.**
> Verified by inspection of the corpus directory: one **real English** organizational policy
> (`plan.pdf`, Word 2016) and one **ChatGPT/WeasyPrint-generated** Arabic specimen. Nothing else.
> 
> **Across three surveys the project has seen real+English+admissible, real+Arabic+rejected (OCR), and
> generated+Arabic+admissible. It has never seen real+Arabic+admissible** — which is exactly the
> intersection ADR-0019's evidence requirement names.
> 
> ### What this does and does not block
> 
> **Not blocked:** no task is READY and none waits on this; the architecture is not blocked — ADR-0019
> was accepted *as a bounded decision* with this gap recorded, not overlooked; `EPA-0005` awaits review
> on its own merits.
> 
> **Blocked:** **ADR-0019's amendment with the concrete rule set**, and through MSG-0056a D6 —
> *"the final normalization rule must be recorded in an ADR before production use"* — **production use**.
> T-B is blocked in practice rather than formally: building normalization against unknown orthographic
> variation means making the guess D6 forbids, relocated from an ADR into code.
> 
> ### The distinction that matters most
> 
> **The three surveys evidenced the extraction layer. They say nothing about normalization, and cannot.**
> 
> - **Extraction** — bidi order, tokenization, diacritic attachment, `/Lang` reliability, OCR vs native —
>   follows from the **producing toolchain**. Well evidenced now: three producers, three disjoint defect
>   families.
> - **Normalization** — alef/hamza forms, ta marbuta, tatweel, diacritics, Arabic-Indic digits — follows
>   from **how the organization's authors actually write Arabic**. **No evidence at all.**
> 
> Treating the first as the second would be the error. MSG-0089's visual-order finding is a fact about
> WeasyPrint; it tells you what an extractor must repair, and nothing about whether policy authors use
> tatweel or mix digit forms.
> 
> ### The next action, ordered by cost
> 
> 1. **Establish what form the organization's approved Arabic policy actually takes** — text-native,
>    scanned, or non-existent. A question to the organization, not a task. **If it exists only as scans,
>    D14 leaves no admissible Arabic corpus at all**, and the question becomes whether Arabic is in the
>    first release — the risk EPA-0004 §11.5 flagged, where nobody discovers it until ingestion runs.
> 2. **Decide pursue-or-defer.** Deferring is legitimate — ADR-0019 is already accepted as bounded — but
>    it should be a decision on the record rather than a gap that quietly persists.
> 3. **If pursued**, the corpus is an organizational prerequisite of the same class as PR5, and **has
>    never been requested in these specific terms**: genuinely organizational, approved, text-native,
>    plural, spanning authors and dates, produced the way policy is actually produced. **No sample size
>    is named** — naming one would invent a threshold on no more evidence than the guess D6 forbids.
> 4. **Independently:** `EPA-0005` (A-STACK) still awaits acceptance, with its §9 recommendation that no
>    stack ADR be created yet, and the one-runtime-or-two trade.
> 
> ### Operational
> 
> The scheduled task `PCI-Execution-Supervisor` is **Disabled**; nothing runs unattended until it is
> re-enabled. **Implementation remains prohibited** — T-A, T-B, T-D, T-E and T-0 are unauthorized, and
> T-0 still needs a privileged identity-provider deployment.
> 
---

**Historical — the position immediately after TASK-0029, retained.** The text below summarised
the three surveys. **MSG-0090 then analysed what ADR-0019 still needs** and established that the
required material does not exist.

> ## Next Action
> 
> **No task is READY. TASK-0029 is COMPLETE, and the next action is the Architecture Lead's.**
> 
> **MSG-0088 asked whether an admissible, text-native Arabic document could yield ADR-0019 evidence
> without weakening D14. The answer is yes**, and TASK-0029 produced that evidence (MSG-0089, 11/11).
> 
> ### Three documents, three producers, three disjoint defect families
> 
> | | Producer | D14 | Language declared | Defects found |
> |---|---|---|---|---|
> | `plan.pdf` | Microsoft Word 2016 | **admissible** | `en-ZA` ×1,819 — correct | drop-shadow duplication, `/Lang` harvested as text, vector-only page |
> | `Arabic.pdf` *(since removed)* | ABBYY FineReader | **rejected** | **none at all** | — (excluded before defects matter) |
> | `سياسة التعافي.pdf` | WeasyPrint / ChatGPT | **admissible** | **`en` — wrong** | **visual-order storage**, intra-word spaces, detached diacritics |
> 
> **No defect family overlaps another.** Each producer generates its own, which is the single most
> useful thing the three surveys have established.
> 
> ### The new hazard, and it is the sharpest one yet
> 
> **Arabic text is stored in visual order.** Proven by code-point identity: reversing the first extracted
> run reproduces the authored `/Title` tail exactly. **Naive extraction yields fluent-looking but wholly
> reversed Arabic** — the pipeline does not fail, it produces confident garbage, the same shape as the
> English drop-shadow hazard.
> 
> **This sits upstream of every ADR-0019 normalization rule.** Normalizing reversed text produces
> normalized nonsense, so bidirectional order must be reconstructed at extraction before any
> normalization question is even reachable.
> 
> **`/Lang` has now been correct once, absent once, and wrong once** across three documents. Offered as
> three observations, **not a rate** — three operator-chosen files are not a sample.
> 
> ### ADR-0019 remains untouched, and its deferral looks better than ever
> 
> **No rule was proposed.** A normalization rule generalised from any one of the three documents would
> have been wrong for the other two — which is precisely what the acceptance condition was protecting
> against.
> 
> ### Two items with the Lead
> 
> 1. **The Arabic specimen is generated, not organizational** — ChatGPT/WeasyPrint. Its hazards are its
>    toolchain's. **Extraction hazards are a property of the producer**, so characterising the real
>    corpus needs documents produced the way the organization actually produces policy.
> 2. **`Arabic.pdf` was replaced rather than kept.** MSG-0087's findings stand as a record but can no
>    longer be re-verified against the file.
> 
> Also still open: **`EPA-0005`** (A-STACK, PROPOSED) and its §9 recommendation that no stack ADR be
> created yet; the **one-runtime-or-two** trade; **PDF tooling** for the runner; and the
> **synthetic-versus-real designation** question, which now has a third instance.
> 
> ### Operational
> 
> **The scheduled task `PCI-Execution-Supervisor` is Disabled** (last run 17:37:37). No unattended cycle
> will pick up future work until it is re-enabled — TASK-0029 was executed interactively for that reason.
> 
> **Implementation remains prohibited.** T-A, T-B, T-D, T-E and T-0 are unauthorized; T-0 still needs a
> privileged identity-provider deployment.
> 
---

**Historical — the position after TASK-0028, retained.** The text below described the OCR Arabic
document as the newest evidence and asked for a text-native one. **MSG-0088 supplied it and
TASK-0029 surveyed it** (MSG-0089).

> ## Next Action
> 
> **No task is READY. TASK-0028 is COMPLETE, and the next action is the Architecture Lead's.**
> 
> **A-SURVEY has now been performed at n=1 twice**, and the two documents are strikingly unalike — which
> is the most useful thing to come out of the pair.
> 
> | | `plan.pdf` (TASK-0027) | `Arabic.pdf` (TASK-0028) |
> |---|---|---|
> | Producer | Microsoft Word 2016 | **ABBYY FineReader PDF 15** |
> | Nature | **Text-native**, verified four ways | **OCR-derived** — 31 page images *plus* a text layer |
> | Language declared | `en-ZA` ×1,819, `en-GB` ×46 | **none at all** |
> | Script | Latin | **Mixed** Arabic + Latin |
> | Hazards found | Three, all reproducible | **None of those three** — a different defect population |
> 
> ### The finding that matters: D14 would reject the Arabic sample
> 
> `Arabic.pdf` is **OCR-dependent by construction** — its text exists because ABBYY recognised it. **D14
> rules text-native only and rejects OCR-dependent documents rather than treating OCR output as
> authoritative.** So the first Arabic material the project has seen is precisely the class the accepted
> architecture excludes.
> 
> **That is a result, not a failure**, and it cuts two ways for the Lead to decide between (MSG-0087 §6):
> 
> - as a **test** document it is genuinely valuable — the first concrete instance of what D14 must cope
>   with, and evidence of what a rejected file looks like structurally;
> - as **evidence about admissible Arabic policy material it says nothing**, because such a file would
>   never be admitted. Characterising what the assistant will actually ingest needs a **text-native**
>   Arabic document.
> 
> **It is also not Hadi Clinic material** — its title is `00. Country COVID-19 IAR Guidance (vers 1.0)`.
> No boundary was crossed; the Lead designated the path. It is recorded so nobody later reads these
> observations as characterising the organization's own Arabic corpus.
> 
> ### Evidence for ADR-0019 — recorded, not acted on
> 
> **ADR-0019 was not amended and no normalization rule was proposed**, per MSG-0085 §7. What the document
> evidences for a later decision: **language cannot be read from the file** (no `/Lang`, mixed script, so
> detection with its own error behaviour is required), and **glyph-to-Unicode round-tripping is not
> guaranteed** where `ToUnicode` is absent — extraction fidelity sits upstream of every normalization
> rule ADR-0019 might record. **On this evidence ADR-0019's deferral looks well-judged**: one mixed-script
> OCR document is exactly the material from which a plausible-but-wrong rule could have been generalised.
> 
> ### Still open, and unchanged
> 
> **The two documents are not a corpus.** A-SURVEY **at corpus scale remains unperformed**, and the
> organizational action that would enable it — representative approved material, **plural** — has not
> changed.
> 
> Also still with the Lead: **`EPA-0005`** (A-STACK, PROPOSED) and its §9 recommendation that no stack ADR
> be created yet; the **one-runtime-or-two** trade; **PDF tooling** for the runner (MSG-0084 §8.2); and
> the **synthetic-versus-real** designation question, which now applies to both files.
> 
> **Implementation remains prohibited.** T-A, T-B, T-D, T-E and T-0 are unauthorized, and **T-0 is still
> an operator prerequisite** needing a privileged identity-provider deployment.
> 
---

**Historical — the position while TASK-0028 was READY, retained.** The text below described the
Arabic follow-up as pending. **It has since been executed** (MSG-0087, 9/9 criteria).

> ## Next Action
> 
> **TASK-0028 is READY and is the single READY task — the Arabic follow-up survey. The Supervisor will
> start it on its next cycle; no manual trigger is needed.**
> 
> **MSG-0085 authorized it** against `D:\Work\pci-corpus\Arabic.pdf` (663.3 KB, `%PDF-1.5`, verified
> present) to complement the completed English survey. **No permission change was needed or made** —
> MSG-0083 granted the *directory*, so the new file is already readable, and MSG-0085 §3 forbids
> broadening.
> 
> ### The two constraints that matter most
> 
> **It is a separate n=1, and the two documents are not a corpus.** One English plus one Arabic file,
> both chosen by an operator, is not a sample. Any statement about language mix or prevalence would be
> the invented distribution the n=1 discipline exists to prevent.
> 
> **ADR-0019 must not be amended, and the reason is sharper here.** It was accepted *on condition* that
> its Arabic normalization rules come from empirical corpus evidence — and **this is the first Arabic
> evidence the project has.** That makes promoting one document's behaviour into a normalization rule
> both very tempting and exactly what the condition forbids. Implications are **evidence for a later
> decision**, nothing more.
> 
> ### What A-SURVEY produced for English (MSG-0084, 7/7 criteria)
> 
> **Text-native, verified four independent ways** — the one dimension n=1 answers cleanly. Beyond that,
> its most reusable output is three extraction hazards, each observed and reproducible, each of which
> would corrupt a T-B pipeline **silently rather than failing**:
> 
> 1. **Drop-shadow glyph duplication.** Every title-page character is drawn twice; naive extraction reads
>    `HHAADDII CCLLIINNIICC`. Document-wide it is 0.7% of characters — **but on page 1 it is 231 artifact
>    characters against 276 of content.** The document-wide figure is the misleading one; the corruption
>    sits exactly where the governance metadata lives.
> 2. **Language tags harvested as body text** — `en-ZA` picked up 1,819 times by a regex that does not
>    check the operand precedes `Tj`/`TJ`. Observed, not hypothesised.
> 3. **A page whose meaning is a vector drawing**, yielding 67 characters. **D14 does not fire on it** —
>    the document *is* text-native — so a grounded-answer system would be unable to cite that content
>    while showing no sign anything is missing. **A gap between D14 and ADR-0017 that one document is
>    enough to demonstrate, and not enough to size.**
> 
> ### Two items sitting with the Architecture Lead — neither blocking
> 
> 1. **The corpus is real, not synthetic.** `plan.pdf` is a genuine 45-page Hadi Clinic emergency
>    preparedness plan with named author and approver and a real signature block, carrying **no
>    confidentiality marking**. The Lead designated that exact path, so the read was authorized and no
>    boundary was crossed — but **the record should not quietly describe production material as
>    synthetic**, and the same question applies to `Arabic.pdf`. The surveys keep personal names and
>    document content out of the repository either way.
> 2. **The runner has no PDF tooling** — `pdftoppm` absent, `pdftotext` off the allowlist. Both surveys
>    work by reading bytes directly. Making PDF inspection routine is a permission and tooling decision,
>    correctly not self-authorized.
> 
> ### Still unauthorized
> 
> **A-SURVEY at corpus scale remains unperformed**, and the organizational action that would enable it —
> representative approved material, **plural** — is unchanged. Implementation stays prohibited: **T-A,
> T-B, T-D, T-E and T-0 are not authorized**, and TASK-0028 may not mark them READY. `EPA-0005` (A-STACK)
> is still PROPOSED and awaits the Lead.
> 
---

**Historical — the position after TASK-0027 and before MSG-0085, retained.** The text below
described a queue at rest with A-SURVEY performed at n=1 for English and nothing READY.
**MSG-0085 then authorized the Arabic follow-up**, reconciled as TASK-0028.

> ## Next Action
> 
> **No task is READY. TASK-0027 is COMPLETE, and the next action is the Architecture Lead's.**
> 
> **A-SURVEY has been performed at n=1** (MSG-0084, 7/7 acceptance criteria MET). The corpus read
> succeeded on the first attempt under MSG-0083's grant, the survey ran against the file **in place**, and
> **the repository boundary held** — checked four ways, all quoted in MSG-0084 §9.
> 
> ### What the survey established, and what it deliberately did not
> 
> **Established, about that one document:** it is **text-native, not scanned** (107,988 characters decoded
> from all 45 pages, 0 undecodable glyphs, only two image XObjects in the entire file), **English only**
> (**0 Arabic characters**, confirmed structurally), **carries no classification marking of any kind**, and
> **versions itself only in title-page prose** with blank date fields and a handwritten-signature
> convention. So **at least one real approved policy document carries none of ADR-0018's lifecycle
> metadata in-band** — an existence claim n=1 can carry.
> 
> **Deliberately not established** — recorded as INSUFFICIENT with **no estimates invented**: format mix,
> language prevalence, scanned-document prevalence, classification and audience distribution, and
> version/supersession prevalence **across a corpus**.
> 
> **Read this before citing A-SURVEY for anything.** The document contains **zero Arabic**, which means it
> supplied **no Arabic evidence at all**. **MSG-0056a D6 is exactly as partially discharged as before, and
> ADR-0019's normalization rules were not written, inferred, or amended.** **D14's rejection exposure
> remains completely unmeasured.** The one thing A-SURVEY was meant to unblock is still blocked, and now
> for a different reason — not "no corpus" but "one document".
> 
> ### The finding most likely to matter later
> 
> **Three extraction hazards, each of which corrupts ingestion silently rather than failing** (MSG-0084
> §5): page 1 draws **every glyph twice**, the second copy an `/Artifact`-tagged drop shadow, so an
> extractor without marked-content scoping doubles the one page carrying title, authorship and approval;
> `/Span <</Lang(...)>>` property dictionaries read as body text to a naive regex; and **page 23 yields 67
> characters** because its content is a vector flow chart — **text-native, so D14 never fires, yet
> effectively unreadable**, which is a gap between D14 and ADR-0017's grounding contract.
> 
> ### What the Architecture Lead holds
> 
> Four items, none of them blocking, because no task is READY:
> 
> 1. **Accept, amend, or reject `EPA-0005`** (the A-STACK evaluation, PROPOSED), including its §9
>    recommendation that **no stack ADR be created yet**.
> 2. **The one-runtime-or-two trade** in EPA-0005, when the timing is right.
> 3. **Confirm the corpus designation.** MSG-0080 authorizes A-SURVEY against an *approved/synthetic*
>    corpus; the file at the designated path is **real organizational material** — a genuine clinic
>    emergency-preparedness plan with a named approver and **no confidentiality marking**. The read was
>    authorized and no boundary was crossed; what needs confirming is whether the record should keep
>    calling it synthetic. MSG-0084 §8.
> 4. **Whether the unattended runner should have PDF tooling.** `pdftoppm` is not installed and
>    `pdftotext` is off the runner's Bash allowlist, so TASK-0027 read the file's bytes directly rather
>    than widening any permission. MSG-0084 §8.
> 
> **And one item is the organization's:** **representative** approved policy material — plural — if
> A-SURVEY is to answer the four distributional questions it was created for.
> 
> ### Still unauthorized
> 
> Implementation remains prohibited. **T-A, T-B, T-D, T-E and T-0 are not authorized**, and TASK-0027 did
> not mark them READY. **T-0 remains an operator prerequisite** — an identity provider needing a
> privileged deployment that no decision can substitute for.
> 
---

**Historical — the position while TASK-0027 was READY and unrun, retained.** The text below was accurate
from MSG-0083's permission grant until the next Supervisor cycle executed the task. Its "what TASK-0027
must and must not conclude" section is retained because **it is the standard MSG-0084 was written
against**, and a later reader checking whether the survey stayed inside its bounds should read it.

> ## Next Action
>
> **TASK-0027 is READY and is the single READY task. The Supervisor will start it on its next cycle — no
> manual trigger is needed, and nothing now blocks it.**
>
> **MSG-0083 chose option A and it is applied and verified.** The runner has a narrow, read-only grant to
> `D:\Work\pci-corpus\` and nothing else; a headless session with those exact settings read **641,807
> bytes, `%PDF-1.7`** and cannot write. **BLK-0010 is RESOLVED**, and TASK-0027 needs no
> re-authorization — MSG-0080 still authorizes it.
>
> ### What TASK-0027 must and must not conclude
>
> **n=1 is the discipline, not a caveat.** Permitted: whether **this** document is text-native or
> scanned, its language, its format characteristics, and any classification, audience, version or
> supersession markers **present in it**.
>
> Forbidden: format mix, language prevalence, scanned-document prevalence, classification and audience
> distribution, version and supersession prevalence **across a corpus**. For each, the record must state
> **n=1 is insufficient** and invent no estimate.
>
> Four of A-SURVEY's five original questions describe a population, and one file is not a population. A
> record that reads like a corpus survey would feed **D6** normalization, **D14**'s rejection of scanned
> documents, and **ADR-0019** — accepted specifically on condition its rules come from *empirical corpus
> evidence*.
>
> **The corpus must not enter the repository**, and the grant cannot be used to put it there: writes to
> that path are denied, and MSG-0080 makes its externality a standing constraint.
>
> ### What the Architecture Lead still holds
>
> Two items, neither blocking TASK-0027:
>
> 1. **Accept, amend, or reject `EPA-0005`** (the A-STACK evaluation, PROPOSED), including its §9
>    recommendation that **no stack ADR be created yet**.
> 2. **The one-runtime-or-two trade** in EPA-0005, when the timing is right.
>
> ### Still unauthorized
>
> Implementation remains prohibited. **T-A, T-B, T-D, T-E and T-0 are not authorized**, and TASK-0027 may
> not mark them READY. **T-0 remains an operator prerequisite** — an identity provider needing a
> privileged deployment that no decision can substitute for.

---

**Historical — the position while BLK-0010 was open, retained.** The text below asked the
Architecture Lead and operator to choose MSG-0082 option A, B or C, and recorded that another
Supervisor cycle would not help. **Option A was chosen (MSG-0083), applied, and verified.**

> ## Next Action
> 
> **The next action is a decision, and it is the Architecture Lead's and the operator's: MSG-0082 option
> A, B, or C. TASK-0027 cannot finish without one, and another Supervisor cycle will not help.**
> 
> **TASK-0027 was attempted on 2026-08-22 and stopped at its first action — BLK-0010, OPEN.** It is
> still READY and still authorized by MSG-0080; **it needs no re-authorization.** What it needs is a
> readable corpus.
> 
> **MSG-0082's collision is no longer a prediction. It was tested and it held:**
> 
> ```text
> $ ls -l /d/Work/pci-corpus/
> ls in '/d/Work/pci-corpus/' was blocked. For security, Claude Code may only list files in the
> allowed working directories for this session: 'D:\Work\pci-platform'.
> ```
> 
> MSG-0080 requires the corpus **outside** the repository; the unattended runner's session boundary **is**
> the repository. **The corpus is therefore UNKNOWN to that session** — not read, not opened, not copied,
> not inferred from — and **no survey figure of any kind was produced**, not as an estimate and not as an
> illustration. The `626.8 KB / %PDF-1.7` line below was recorded by an *interactive* session and was
> **not** corroborated by the runner.
> 
> **The distinction that matters for scheduling:** BLK-0009's condition was transient and cleared on its
> own when the interactive session committed. **This one is not.** Nothing about the runner's permission
> set changes by itself, so every unattended retry produces an identical blocker at one cycle apiece.
> 
> **The options are MSG-0082's, and none is Claude's to choose:** **A** — grant a narrow read permission
> for `D:\Work\pci-corpus\` in `runner-settings.json`, scoped to that path and no wider; **B** — run
> TASK-0027 **interactively**, where reads outside the working directory are available with approval;
> **C** — the operator supplies a read-only extraction, which changes what A-SURVEY is surveying and so
> is the Lead's call. **Not options:** copying the PDF into the repository, editing the permission set
> without authorization, or reporting properties never observed.
> 
> **Undecided remains safe** — the run stops and records honestly. Whether to leave TASK-0027 `READY` or
> hold it pending the decision is the Lead's call; **this session changed no task status.**
> 
> > **The paragraph this replaces, retained:** "**TASK-0027 is READY and is the single READY task. The
> > Supervisor will start it on its next cycle — no manual trigger is needed.** … **Undecided is safe:**
> > the run stops, records, and costs one cycle." Accurate when written, and the next cycle proved its
> > final sentence exactly right.
> 
> 
> **MSG-0080 authorized the bounded A-SURVEY follow-up** against the corpus the operator supplied, and
> reconciliation allocated it the id **TASK-0027** (MSG-0080 assigns none; the id was verified unused).
> **BLK-0008 is RESOLVED** — the corpus arrived on local disk, so neither the unreachable NFS export nor
> the uninstalled Client for NFS matters any more.
> 
> ```text
> D:\Work\pci-corpus\plan.pdf        626.8 KB      header %PDF-1.7      readable, outside the repo
> ```
> 
> ### The one rule that must not break
> 
> **The PDF must never enter the repository.** MSG-0080 makes that a standing constraint: it must not be
> copied, staged, committed, or otherwise added to history. **Read it in place.**
> 
> This is not hypothetical. The file first landed at `D:\Work\pci-platform\plan.pdf` — inside the working
> tree, untracked, **not** covered by `.gitignore`. Every COMMS cycle and every runner executes
> `git add -A`, so the next commit would have put 627 KB of corpus into permanent history, removable only
> by rewriting published history. It was moved out before anything staged it.
> 
> ### What TASK-0027 may and may not conclude
> 
> **n=1 is the discipline, not a caveat.** Permitted: whether **this** document is text-native or
> scanned, its language, its format characteristics, and any classification, audience, version or
> supersession markers **present in it**.
> 
> Forbidden: format mix, language prevalence, scanned-document prevalence, classification and audience
> distribution, version and supersession prevalence **across a corpus**. For each, the record must state
> **n=1 is insufficient** and invent no estimate.
> 
> Four of A-SURVEY's five original questions describe a population, and one file is not a population. A
> record that reads like a corpus survey would feed **D6** normalization, **D14**'s rejection of scanned
> documents, and **ADR-0019** — accepted specifically on condition its rules come from *empirical corpus
> evidence*. A confident distribution drawn from one document would corrupt accepted architecture and be
> checkable against nothing.
> 
> ### What the Architecture Lead still holds
> 
> Three items. **The first now blocks TASK-0027; the other two do not.**
> 
> 1. **MSG-0082 — option A, B, or C for the corpus read.** Raised as a possibility, **now confirmed by a
>    real runner refusal** (BLK-0010). Until it is answered, A-SURVEY cannot be performed by any
>    unattended session. This is the only one with a task waiting on it.
> 2. **Accept, amend, or reject `EPA-0005`** (the A-STACK evaluation, PROPOSED), including its §9
>    recommendation that **no stack ADR be created yet**.
> 3. **The one-runtime-or-two trade** in EPA-0005, when the timing is right.
> 
> > **The line this replaces, retained:** "Two items, neither blocking TASK-0027: (1) accept, amend, or
> > reject `EPA-0005` … (2) the one-runtime-or-two trade." True until BLK-0010 turned MSG-0082 from a
> > possibility into a confirmed blocker on 2026-08-22.
> 
> **The corpus action is discharged.**
> 
> ### Still unauthorized
> 
> Implementation remains prohibited. **T-A, T-B, T-D, T-E and T-0 are not authorized**, and TASK-0027 may
> not mark them READY. **T-0 remains an operator prerequisite** — an identity provider needing a
> privileged deployment that no decision can substitute for.
> 
---

**Historical — the position while the corpus was unreachable, retained.** The text below asked
the organization to make the designated NFS path reachable or install a client. **Neither was
needed**: the file was supplied directly on local disk on 2026-08-22, and BLK-0008 is RESOLVED.

> ## Next Action
> 
> **No task is READY. One operator action is required: make the designated A-SURVEY corpus reachable.**
> 
> **The organization has designated the corpus** — `\\10.1.27.220\LXBackup\plan.pdf`, approved/synthetic,
> explicitly **not** production or confidential. **That resolves the authority half of PR5**, which had
> been open since EPA-0002: someone with standing has named material and bounded its use.
> 
> **The path cannot be read**, and **it is an NFS export rather than an SMB share** — clarified by the
> operator after SMB was tested first, since the UNC form fits either. **BLK-0008** carries the full
> diagnosis; **MSG-0079** carries the verification and the correction.
> 
> **Two independent blockers**, and fixing either alone changes nothing: **NFS 2049 and portmapper 111
> are both closed**, *and* **Client for NFS is not installed on this workstation** (`NFS-Client` reports
> `InstallState: Available`). Installing it is a privileged host change that nothing currently
> authorizes.
> 
> **It is not a credentials problem**, and that decides what to fix. No TCP connection is established, so
> no authentication is ever attempted — credentials, drive mappings and share permission changes cannot
> help while the transport is closed. Four causes fit the signature and **cannot be distinguished from
> this machine**, so none is asserted.
> 
> ### What the operator needs to do
> 
> **Two conditions must both hold** — fixing either alone leaves the corpus unreadable:
> 
> 1. **Make the NFS export reachable from this workstation** — port **2049** open, and `LXBackup`
>    exported to this host's address. Whether the export exists or simply excludes this address
>    **cannot be determined from here**: `showmount -e 10.1.27.220` would answer it, and that tool ships
>    with the feature that is not installed.
> 2. **Install Client for NFS on this workstation** — `Install-WindowsFeature NFS-Client`, administrator
>    privilege. **Not done, and deliberately so:** it is a privileged host modification and nothing
>    authorizes it. It is also not urgent alone, since with 2049 closed it would change nothing yet.
> 
> **Or place the file somewhere already reachable** — the designation is about authority, not transport,
> so this remains equally valid and is likely the fastest of the three.
> 
> > **Superseded guidance, retained:** this section previously said to confirm SMB publication and hand
> > the ICMP-works/SMB-closed split to a network administrator. **That was based on the wrong protocol
> > and should be disregarded.**
> 
> ### Then — a new task, not a re-run
> 
> **TASK-0026 is COMPLETE (PARTIAL) and closed.** A-STACK is delivered as `EPA-0005`; A-SURVEY is
> recorded unmet against MSG-0076 criterion 1. **Completing A-SURVEY needs a newly authorized task**, and
> that authorization is the Architecture Lead's. A closed task is not re-run.
> 
> When it is authorized, its board row must be added in the same commit — the queue gap has recurred
> eight times and has only ever been repaired, never prevented.
> 
> ### One thing to settle when authorizing it
> 
> **One PDF cannot answer four of A-SURVEY's five questions.** Formats, language mix, scanned-document
> prevalence, and classification/audience patterns are *distributional* — they describe a population.
> A single file can establish whether **it** is text-native or scanned and what language **it** is in;
> it cannot establish prevalence or mix.
> 
> That matters because survey findings feed **D6** normalization, **D14**'s rejection of scanned
> documents, and **ADR-0019**, accepted specifically on condition its rules come from *empirical corpus
> evidence*. **The ask is not to change the ruling** — one document is genuinely useful for format,
> extraction and language questions, and for proving the ingestion path. It is that the resulting record
> **state its sample size**, so nobody later reads n=1 as a corpus survey.
> 
> ### Still unauthorized
> 
> Implementation remains prohibited. **T-A, T-B, T-D, T-E and T-0 are not authorized.** T-0 stays an
> operator prerequisite needing a privileged identity-provider deployment. `EPA-0005` is **PROPOSED** and
> selects nothing — it awaits the Architecture Lead's review.
> 
---

**Historical — the position before the corpus was designated, retained.** The text below asked
the organization to supply approved policy material. **It has now been designated** —
`\\10.1.27.220\LXBackup\plan.pdf`, approved/synthetic — but the path is **not reachable**
(BLK-0008), so A-SURVEY remains blocked for a different reason. Retained as the record of what
was asked.

> ## Next Action
> 
> **No task is READY. TASK-0026 is COMPLETE (PARTIAL), and what happens next divides between the
> Architecture Lead and the organization.**
> 
> ### The one action that is genuinely blocking, and it is the organization's
> 
> **Supply representative approved policy material for a read-only survey, or rule that A-SURVEY is
> deferred until the corpus exists.** MSG-0076's constraint binds either way: **a survey reads; it does
> not ingest**, and it may not bypass approval controls.
> 
> This is the same action MSG-0077 asked for. **TASK-0026 re-verified by inspection that it is still
> outstanding** — it did not assume so from the earlier record — and it is not an action Claude Code can
> take or route around. Until it is taken, **MSG-0056a D6 stays partially discharged and ADR-0019's
> Arabic normalization rules stay deferred**, which is exactly the condition MSG-0071 accepted that ADR
> under. **D14's rejection exposure stays unmeasured** too: WP-0009 §6.2 warned that if the real corpus
> is largely scanned Arabic PDFs, the first release answers from a fraction of it and *nobody discovers
> that until T-B runs*.
> 
> ### What the Architecture Lead holds, neither of which blocks anything
> 
> 1. **Accept, amend, or reject `EPA-0005`** — the A-STACK evaluation, PROPOSED. Including its **§9.3**
>    recommendation that **no stack ADR be created yet**, and its observation that if the §3.3
>    pre-filtering rule warrants recording as accepted architecture, it belongs with **ADR-0020** —
>    whose §3 and §4 it follows from — rather than in a record of its own.
> 2. **The one-runtime-or-two trade** of EPA-0005 §5, when the timing is right. It was deliberately left
>    open: it turns on operability and team capability in the customer's context, which the
>    technology-selection principles make a matter of **operational fit** rather than technical ranking.
> 
> **A sequencing observation, offered and not self-authorized.** Seven of the questions a stack proposal
> would ordinarily answer are corpus-dependent (EPA-0005 §8), so **A-SURVEY is a genuine input to
> A-STACK** and running A-STACK first was always going to leave that residue. If the corpus becomes
> available, the natural follow-up is A-SURVEY and then a revision of EPA-0005 §8 and §9.2 against real
> evidence. **No task is marked READY on the strength of that observation** — naming the next task is
> the Lead's act, and it must be reconciled into `CLAUDE-TASKS.md` as the single READY task **in the same
> commit as the authorization** (the MSG-0044 gap, which has now recurred eight times).
> 
> ### Still unauthorized after TASK-0026
> 
> Implementation stays prohibited. **T-A, T-B, T-D, T-E and T-0 are not authorized**, and TASK-0026
> marked none of them READY. **T-0 remains an operator prerequisite** needing a privileged
> identity-provider deployment that no decision can substitute for. **PR3 and PR4 remain NOT MET; PR5 is
> now VERIFIED UNMET; PR6 remains UNKNOWN** — and EPA-0005 §3.5 makes PR6 larger than it looked, since
> the capability needs **three** concurrent local models rather than one.
> 
---

**Historical — the position after MSG-0077 and before TASK-0026 executed, retained.** The text below
described TASK-0026 as READY and predicted the shape of its two halves. **The prediction held**:
A-STACK ran, A-SURVEY stopped at PR5, and the task reported PARTIAL exactly as instructed.

> **TASK-0026 is READY and is the single READY task. The Supervisor will start it on its next cycle — no
> manual trigger is needed.**

**MSG-0076 authorized one bounded architecture task with two outputs**, and reconciliation allocated it
the id **TASK-0026** (MSG-0076 assigns none; the id was verified unused). The two halves were **not**
equally executable, and that asymmetry was the substance of this entry.

### A-STACK — unblocked, and most of the task

Evaluate candidate service-stack approaches against the accepted platform contracts and the EPA ADR
set, then **either** recommend with evidence **or** record explicitly why selection stays open. Every
input is present and was checked: `technology-selection-principles.md`, the six accepted ADRs, WP-0009.

**MSG-0062 §7.7 governs it — ADR-0015 is not inherited.** The kernel stack must not be adopted by
default and then described as inheritance. And MSG-0076 is explicit that A-STACK **evaluates**: it may
not select or authorize a provider, framework, model, embedding technology, or runtime.

### A-SURVEY — prerequisite PR5 is NOT met

It requires "representative approved policy material". **No corpus is reachable from this repository** —
established by inspection, not inferred, and corroborated by three records that have said so from the
start: **WP-0009 §6.1** (PR5 is the organization's), **EPA-0004 §11.5** ("UNKNOWN — not visible from
the repository"), and **MSG-0061 §7.5** ("no survey was performed or scheduled").

**The queue section instructs A-SURVEY to stop at that prerequisite and record it** — producing no
format breakdown, no language mix, no scanned-document prevalence, "not as estimates, not as
illustrations, not as expected values" — to complete A-STACK regardless, and to report the task
**PARTIAL** with acceptance criterion 1 named as unmet and PR5 as the reason.

**Why the emphasis.** A survey with no corpus is the most inviting place in this work package to
produce confident, invented findings, and they would not stay harmless: those figures feed **D6**
normalization, **D14**'s rejection of scanned documents, and **ADR-0019**, which was accepted
specifically on condition its rules come from *empirical* corpus evidence. Fabricated data would
corrupt accepted architecture and be checkable against nothing.

The section also tells the runner to **re-check by inspection rather than trust that text** — if
material has since been supplied, the right answer changes.

### What the organization must decide

**One action:** make representative approved policy material available for a read-only survey, or rule
that A-SURVEY is deferred until the corpus exists. MSG-0076's constraint binds either way — **a survey
reads, it does not ingest**, and it may not bypass approval controls.

### Still unauthorized after TASK-0026

Implementation stays prohibited. **T-A, T-B, T-D, T-E and T-0 are not authorized**, and TASK-0026 may
not mark them READY. **T-0 remains an operator prerequisite** needing a privileged identity-provider
deployment that no decision can substitute for.

---

**Historical — the position after TASK-0025 and before MSG-0076, retained.** The text below
described a queue at rest with the WP-0009 ADR set complete and nothing READY, awaiting the
lead's choice between A-SURVEY and A-STACK. **MSG-0076 authorized both**, as one bounded task.

> ## Next Action
> 
> **No task is READY. The next move is the Architecture Lead's: authorize A-SURVEY or A-STACK, or neither.**
> 
> **TASK-0025 is COMPLETE (2026-08-21, MSG-0075).** The Supervisor started it on its 20:47:18Z cycle — the
> next one after MSG-0074 was pushed, exactly as predicted — and it promoted **ADR-0018 … ADR-0022** into
> `docs/decisions/`. **The WP-0009 ADR set is complete and authoritative**, ADR-0017 … ADR-0022.
> 
> **MSG-0071's own gate is what opens next.** Its *Next architecture boundary* says the Lead may consider
> authorizing the next bounded architecture task **only after** the accepted set is reconciled and
> promoted. That is now done, so both candidates in WP-0009 §6.2 are eligible to be authorized:
> 
> - **A-SURVEY** — the bounded, read-only corpus survey. It is the one that unblocks something already
>   known to be incomplete: **ADR-0019's Arabic normalization rules are deferred to empirical corpus
>   evidence**, and that evidence does not exist. Until it does, ADR-0019 remains incomplete for
>   production **by design**. MSG-0062 §7.5 authorizes it *in principle* before T-B; that is not the same
>   as marking it READY, which remains the Lead's act.
> - **A-STACK** — propose the assistant service's concrete implementation stack. ADR-0015 is **not**
>   inherited (MSG-0062 §7.7), and no promoted ADR selects a provider, model, framework or runtime.
> 
> **Neither is authorized, and this record does not recommend one over the other** — that judgment is the
> Lead's, and nothing in the repository forces the order.
> 
> ### What is still true after promotion
> 
> - **Implementation remains prohibited.** WP-0009 reads `DEFINED — NOT AUTHORIZED FOR IMPLEMENTATION`.
> - **T-0 remains an operator prerequisite** — the identity provider needs a privileged deployment that no
>   decision can substitute for.
> - **WP-0009 §8's three open items are untouched**: the T-D/T-E interim mitigation, PR3's owner and date,
>   and which PLAN-WP-0001 entries WP-0009 sits beside.
> - **ADR-0017's entailment model and numeric thresholds stay open** under SPEC-0020.
> 
> ### When the next task is authorized
> 
> **Its board row must be added in the same commit as the authorization.** The queue gap reached its
> **eighth** occurrence with MSG-0073 and was repaired by MSG-0074 before the Supervisor's next cycle —
> which is why TASK-0025 started on time. It is the one failure in this project that has never been
> prevented, only repaired, and repairing it in time is luck about timing rather than a control.
> 
---

> **Historical — the position while TASK-0025 was READY and unstarted, retained.** The text below
> described what TASK-0025 had to preserve and what a runner needed to know before it ran. It is kept
> because the preservation constraints are the checklist the promotion was verified against, and
> MSG-0075 §3–§4 report the result against exactly these points.

> **TASK-0025 is READY and is the single READY task. The Supervisor will start it on its next cycle — no
> manual trigger is needed.**

> **MSG-0073 answers MSG-0072.** It authorizes TASK-0025 to promote **ADR-0018 … ADR-0022** into
> `docs/decisions/`, the authoritative register, and states plainly: *"Claude may execute TASK-0025 when
> it is reconciled as READY."* ADR-0017 was already promoted by the lead and must not be touched.
>
> ### What TASK-0025 must preserve
>
> - **No change to the substance** of the accepted decisions. A `diff` between each promoted copy and its
>   draft should show only the `Status` line and an added `Accepted by` line; **any body difference is a
>   defect**, since these records are cited as authority.
> - **No provider, model, framework, or runtime selection** that was deliberately left open. ADR-0022's
>   wording — citing Ollama from ADR-0003 while explicitly declining to select it — is load-bearing and
>   must survive promotion intact.
> - **ADR-0019's normalization rules stay deferred** to empirical corpus evidence. It must still read as
>   incomplete for production by design.
> - **No implementation authorization**, and **A-SURVEY, A-STACK and T-0 stay unauthorized**.
> - **Completion is reported only after repository verification** — MSG-0073 is explicit about that
>   ordering.
>
> ### Two things worth knowing before it runs
>
> **There is no `TASK-0025-*.md` specification file.** Every task since TASK-0017 has had one; this one
> does not. MSG-0073 plus the queue section are the specification. Recorded so a runner neither hunts for
> a missing file nor improvises one to fill the gap.
>
> **The promotion convention was verified rather than remembered**, from the ADR-0015 precedent and the
> lead's own ADR-0017 promotion three commits ago. The queue section states it exactly.
>
> ### After TASK-0025
>
> Implementation remains prohibited. **A-SURVEY and A-STACK are unauthorized**, and **T-0 remains an
> operator prerequisite** — the identity provider needs a privileged deployment that no decision can
> substitute for. The lead authorizes the next bounded task after reviewing the promoted register.
>
> **When that happens, its board row must be added in the same commit.** The queue gap has now recurred
> eight times (MSG-0074); it is the one failure in this project that has never yet been prevented, only
> repaired.

**Every preservation constraint above was checked against the result, and all five hold.** Evidence:
MSG-0075 §3 (the per-ADR diffs — zero body differences) and §4 (the three MSG-0071 conditions
re-verified in the promoted copies, including ADR-0022's load-bearing Ollama wording). Completion was
reported only after that verification ran against the files on disk, and after the commit was pushed.

---

**Historical — the position while MSG-0072 awaited a decision, retained.** The text below asked
the lead to finish the ADR promotion or authorize a task for it. **MSG-0073 chose the second**,
authorizing TASK-0025. Retained as the record of what was asked.

> ## Next Action
> 
> **No task is READY. One decision is required from the architecture lead: finish promoting the accepted
> ADR set, or authorize a bounded task to do it (MSG-0072).**
> 
> **TASK-0024 (A-ADR) is COMPLETE.** It was executed unattended by a supervisor-started session and
> drafted six ADRs — **ADR-0017 … ADR-0022** — covering the grounded answer contract, approved-document
> authority and lifecycle, bilingual policy semantics, the retrieval projection and index boundary,
> employee question privacy and retention, and inference locality and the provider boundary. Execution
> record: **MSG-0070**.
> 
> **MSG-0071 accepted all six**, with three bounded conditions worth carrying forward:
> 
> - **ADR-0017** — the fail-closed, citation-bound answer contract is approved, but **the entailment
>   model and numeric thresholds remain explicitly undecided** under SPEC-0020.
> - **ADR-0019** — accepted as a **bounded** decision: **Arabic normalization rules stay deliberately
>   incomplete** and must come from empirical corpus evidence before production use. **No invented
>   normalization rules are authorized.**
> - **ADR-0020** — the **no-retrieve-then-suppress** confidentiality boundary and fail-closed handling
>   are approved.
> 
> ### The open item
> 
> **Only ADR-0017 has been promoted to `docs/decisions/`.** ADR-0018 through ADR-0022 exist solely as
> drafts under `implementation/decisions/`, so five accepted decisions currently have no authoritative
> record — including the confidentiality, retrieval and inference-locality boundaries that later
> implementation work is meant to be gated on.
> 
> **The promotion was deliberately not performed.** It is the act that confers architectural authority;
> no READY task authorizes it; and the lead promoted ADR-0017 personally, which reads as the lead doing
> this work rather than delegating it. Everything that did not depend on that answer **was** done: the
> ADR index and all six draft headers now record the acceptance, the ADR-0017 draft is marked RATIFIED
> per the ADR-0015 precedent, and MSG-0071 is registered in both the COMMS register and the queue
> ledger. **No ADR text was altered.**
> 
> **A pre-promotion verification pass was run, read-only, and it passed** (MSG-0072). MSG-0071
> attached conditions to its own acceptance, and the moment to check them is before the drafts
> become authoritative:
> 
> - **No provider, model, runtime, or framework is selected.** The only substantive technology
>   mention is **Ollama, twice in ADR-0022** — a *citation* of ADR-0003, with that ADR stating
>   twice that it selects nothing. Verified at source: ADR-0003 line 17 reads verbatim as quoted.
> - **ADR-0019 invents no normalization rules.** It fixes the obligation — raw text immutable,
>   ingestion and query normalization identical, rule set versioned — and defers the rules to
>   corpus evidence, stating it must be amended before production use.
> - **ADR numbering is collision-free.** The three ids in both directories are promoted pairs with
>   identical filenames; no id is claimed by two titles.
> 
> This establishes that promoting ADR-0018 … ADR-0022 **as written** would not violate MSG-0071's
> conditions or close a question the lead left open. **It does not authorize the promotion**, and
> none was performed.
> 
> ### What remains explicitly unauthorized
> 
> **A-SURVEY and A-STACK remain unauthorized.** No implementation task is authorized or READY, and
> nothing in MSG-0071 permits provider, model, framework, or runtime selection. MSG-0071 is explicit
> that the next bounded architecture task may only be considered **after** the ADR set is reconciled and
> promoted.
> 
> **T-0 remains an operator prerequisite** — the identity provider needs a privileged deployment and
> cannot be satisfied by a decision alone.
> 
> ### Operational note
> 
> The Supervisor is enabled and cycling every ten minutes; it fast-forwarded to `d9c4524` at 20:07:24Z
> and is idling correctly at `NOOP: no READY task`. **When the next task is authorized, its board row
> must be added in the same commit** — that gap has now recurred seven times (MSG-0069).
> 
---

**Historical — the position while TASK-0024 was READY, retained.** The text below described the
queue with TASK-0024 armed and the Supervisor about to start it. **It did start it**, unattended,
and TASK-0024 is now COMPLETE with its ADR set accepted by MSG-0071. Retained as the record of
the position it described.

> ## Next Action
> 
> **TASK-0024 (A-ADR) is READY and is the single READY task. The Supervisor will start it on its next
> cycle — no manual trigger is needed.**
> 
> The scheduled task `PCI-Execution-Supervisor` is enabled again and cycling every ten minutes. It was
> observed idling at `NOOP: no READY task` at 19:07:18Z and 19:17:18Z **while TASK-0024 sat authorized
> and unreconciled** — the seventh recurrence of that gap, and the first one visible in the log rather
> than argued from principle (MSG-0069).
> 
> **What TASK-0024 does.** Draft the **minimal** set of new ADRs that makes the accepted WP-0009
> architecture enforceable before implementation, evaluating the six candidate surfaces in WP-0009 §7
> against the accepted ADRs and creating only what is genuinely required. ADR numbers are allocated **at
> drafting time** from the repository's actual state, never pre-assigned.
> 
> **What it may not do.** No implementation; no provider, model, embedding, framework or runtime
> selection; **no production corpus ingestion**; no permission, security-boundary, Supervisor or
> scheduling change; no operator-only action; **no modification or duplication of accepted ADRs**; and
> **it may not mark T-A through T-E or any other implementation task READY.**
> 
> ### Four documents govern it, and all four must be read
> 
> Two specification files and two authorization messages were committed for this one task. **All four
> agree**, so no stop condition fired — but each pair carries safety-relevant content the other lacks:
> spec A and MSG-0068a hold the **stop-rather-than-improvise** condition; spec B and MSG-0068b hold the
> **ten constraints to preserve**, including MSG-0067's limit that **T-D may be tested only against
> synthetic or non-confidential documents** until T-E is implemented and verified. The queue section
> carries the union of all four. Nothing was renamed, per MSG-0058 F4.
> 
> ### What MSG-0067 settled, and what it deliberately did not
> 
> - **T-D/T-E interim exposure — DECIDED.** No real or confidential corpus enters the T-D path until
>   T-E retrieval-time authorization is implemented **and verified**.
> - **PR3 identity — DECIDED.** Use the organization's existing Microsoft/Active Directory
>   infrastructure **through the established ADR-0007 OIDC/OAuth2 boundary**. PCI builds no identity
>   provider and does not bypass that boundary with LDAP or Kerberos.
> - **WP-0009's relationship to PLAN-WP-0001 — DECIDED.** WP-0009 **sits beside** the planning entries.
>   It does not satisfy, supersede, rename, or renumber them; the planning list stays forward-looking,
>   and WP-0009 is the canonical delivered identity for this capability. This also closes DISC-0010.
> 
> **Left as organizational scheduling data, not architecture:** the IdP owner and deployment date. **T-0
> remains an operator prerequisite** for identity-dependent work and cannot be satisfied by a decision.
> 
> ### After TASK-0024
> 
> Implementation remains prohibited. **T-A is not authorized**, and TASK-0024 may not authorize it — the
> lead authorizes the next bounded task after reviewing the ADR set. When that happens, its board row
> must be added in the same breath, or it becomes the eighth recurrence.
> 
---

**Historical — the position after TASK-0023 and before MSG-0068, retained.** The text below
described the queue at a post-reconciliation pause: WP-0009 allocated, no task READY. **MSG-0067**
then ruled the three carried-forward items and **MSG-0068 authorized TASK-0024**, which is now
READY. Retained as the record of the position it described.

> ## Next Action
> 
> **TASK-0023 is READY and is the single READY task. It has NOT been started.**
> The queue is armed and nothing has consumed it. **Starting it requires enabling the scheduled task
> or an explicit manual trigger** — see the corrected operational note below. The reconciliation and
> the execution were deliberately separated by operator instruction (MSG-0064).
> 
> > **Corrected 2026-08-21 (MSG-0065).** This paragraph previously said starting TASK-0023 required
> > "restarting the Windows `Schedule` service — stopped by the operator". **That was wrong.** The
> > `Schedule` service is **Running (Automatic)**; what is **Disabled** is the scheduled task
> > `PCI-Execution-Supervisor`. Restarting the service would therefore have done nothing. The
> > functional consequence was right — no cycle fires on its own — but the remedy was not.
> 
> **What changed.** **MSG-0062 ACCEPTED EPA-0004** as the bounded work-package definition and ruled all
> seven of the open items MSG-0061 §7 raised. **MSG-0063** then authorized **TASK-0023**, the governance
> reconciliation that turns the accepted definition into authoritative work-package records.
> 
> ### The three rulings that most change what happens next
> 
> - **7.6 — Restricted documents are eligible for the governed corpus, but no retrieve-then-suppress
>   design is permitted.** A Restricted document is never retrieved into an employee request unless the
>   authenticated subject satisfies its authorization policy, and denial must **fail closed without
>   revealing existence, content, timing, or result-count**. This settles the item MSG-0061 flagged as
>   deserving attention first: an exclusion cannot fail open, and the ruling forbids the path that can.
> - **7.3 — T-D (grounded QA) must precede T-E (retrieval-time authorization).** Authorization controls
>   must not be validated against an unproven answer path. Security review remains a gate on the
>   complete path before release.
> - **7.7 — ADR-0015 is not inherited** as the service stack. The service stays outside the kernel
>   boundary and uses accepted platform contracts; a dedicated architecture task must propose the
>   concrete stack. Nothing — provider, framework, model, embedding technology, runtime — is selected.
> 
> The remaining four: **7.1** allocate a **new** work package with no existing WP number repurposed;
> **7.2** create only the ADRs needed to make the architecture enforceable before production, numbered
> by repository convention in the next architecture task; **7.4** integrate an OIDC/OAuth2 provider and
> never implement one, with selection and privileged deployment remaining operator actions; **7.5** a
> **bounded corpus survey is authorized before T-B** as a discovery input only, with no production
> ingestion and no bypass of approval controls.
> 
> ### What TASK-0023 may and may not do
> 
> It reconciles EPA-0004 and the MSG-0062 rulings into the governed records: resolve the WP
> numbering/register discrepancy **preserving historical WP-0001**, allocate the formal work-package
> identity by repository convention, turn the six ADR surfaces into an explicit sequence **without
> creating any ADR**, record **T-0 as operator-only**, and produce the dependency-ordered gate sequence
> with the next task **identified but not implicitly authorized**.
> 
> It may **not** implement, select any provider/model/embedding/framework/runtime, change permissions or
> security boundaries, change Supervisor behaviour or scheduling, create or modify accepted ADRs,
> perform any operator-only or privileged action, or **mark any downstream implementation task READY**.
> 
> ### Still the lead's, after TASK-0023
> 
> MSG-0063 reserves the next authorization: after TASK-0023 is completed **and accepted**, the lead
> authorizes the next bounded task. **Implementation remains prohibited** until every architecture gate
> and prerequisite is satisfied — including **T-0**, which needs a privileged operator deployment of the
> selected identity provider and cannot be satisfied by a decision alone.
> 
> **MSG-0060 remains open and unaddressed**: whether a task-specification collision warrants more than
> the union treatment applied to TASK-0022. It blocks nothing.
> 
---

**Historical — the position after TASK-0022 and before MSG-0062, retained.** The text below
described an **acceptance boundary**: EPA-0004 delivered as PROPOSED, seven items awaiting a
ruling. **MSG-0062 accepted EPA-0004 and ruled all seven on the same day**, and MSG-0063
authorized TASK-0023. The boundary was passed, not removed — implementation is still prohibited.

> ## Next Action
> 
> **TASK-0022 is COMPLETE. No task is READY, and the next action belongs to the architecture lead.**
> 
> The queue is at an **acceptance boundary**, not an empty queue and not a decision boundary. Every
> EPA-0003 decision is ruled and every MSG-0057 finding is ruled; what is missing is the lead's
> acceptance of the definition those rulings produced.
> 
> **What TASK-0022 delivered.** `EPA-0004` — the Employee Policy Assistant work-package definition, as
> a **PROPOSED** record carrying no architectural authority: thirteen acceptance gates, ten
> dependency-ordered tasks, five test tiers, T1–T11 threat coverage, and every required field of the
> work-package standard. It allocates **no work-package number**, creates **no ADR**, selects **no
> provider, model, or runtime stack**, and marks **no task READY**. Execution record: **MSG-0061**.
> 
> **What the lead is asked to do, in order** (EPA-0004 §13, restated in MSG-0061 §8):
> 
> 1. Accept, amend, or reject EPA-0004 — until then prerequisite PR2 is unmet and no implementation
>    task can be authorized.
> 2. Rule on the **seven open items** in MSG-0061 §7. Three block the earliest tasks: the work-package
>    number, **whether a policy document may be classified Restricted**, and who owns the identity
>    provider (PR3).
> 3. Allocate the work-package number, recording its relationship to the PLAN-WP-0001 register — which
>    already disagrees with the delivered work-package directory about what WP-0001 is.
> 4. Create whichever of the six proposed ADRs are wanted, or rule that the rulings themselves suffice.
>    **Claude Code creates no ADR without an explicit instruction.**
> 5. Authorize **T-0, the identity provider, as an operator task** — it needs a privileged deployment
>    action no Claude session may perform, and every authorization control depends on it.
> 6. **Then** authorize T-A and reconcile it into `CLAUDE-TASKS.md` as the single READY task.
> 
> > **Step 6 is not a formality.** MSG-0060 recorded the **fifth** occasion on which an authorization
> > existed while the queue did not reflect it, leaving the Supervisor idling on a healthy-looking
> > "no READY task". An authorization that stops at a message is invisible to the runner.
> 
> ### The binding rulings TASK-0022 inherited, and EPA-0004 now carries
> 
> - **English is authoritative**; Arabic is an approved translation/access language.
> - **Cross-language grounding is in scope and fail-closed.** A failed Arabic grounding gate must
>   **abstain** — never silently fall back to an English answer, never present an unofficial rendering
>   as policy. The Arabic acceptance bar is evaluated separately under SPEC-0020.
> - **Unauthenticated access is deferred** from the first release; no new trust boundary is introduced.
> - **Directory integration terminates at the ADR-0007 OIDC/OAuth2 boundary.** Entra ID, AD FS, or an
>   OIDC broker may front an existing directory; **direct LDAP/Kerberos implementation is not
>   authorized.**
> - **Only approved/published documents are authoritative sources.**
> - **Session-only retention is the default**, with configurable retention support.
> 
> ### One thing the next session must know
> 
> **Two files specify TASK-0022**, and both are authoritative. They agree on scope, authorization,
> forbidden actions and acceptance gate, but each carries content the other lacks — spec A the stop
> conditions and the recommendations-only constraint, spec B a ten-item outcome list. The queue section
> carries the **union** and links both. Neither was renamed, per MSG-0058 F4.
> 
> **Read both.** A runner that reads one silently loses half its instructions and would report success
> against the half it read (MSG-0060).
> 
> > **Both were read by the executing session**, and MSG-0061 §2 maps the union — all sixteen required
> > outputs — to the section of EPA-0004 that satisfies each. The warning above is retained because it
> > applies to anyone re-reading the TASK-0022 specification, not only to the session that executed it.
> 
> **The other thing to know: EPA-0004 supersedes EPA-0002 in substance, and EPA-0002 is retained
> unchanged.** EPA-0002 was written before any decision was ruled and is conditional throughout; where
> they differ, EPA-0004 is the later record and its §12 tabulates the six differences with the ruling
> behind each. Do not read EPA-0002 as current.
> 
> ### Operational note
> 
> The Windows `Schedule` service was stopped by the operator on 2026-08-21, so the Supervisor's
> ten-minute cadence is inert. Cycles run only when triggered manually until that service is restarted;
> the start path itself is unchanged and proven.
> 
---

**Historical — the position between MSG-0057 and MSG-0058, retained.** The text below asked the
lead to rule F1, F2 and F3 and then judge whether the architecture was sufficiently resolved.
**All three were ruled the same day** by MSG-0058, each as recommended, and the gate was opened by
MSG-0059 authorizing TASK-0022. Retained as the record of what was asked.

> ## Next Action
> 
> **All fourteen EPA-0003 decisions are ruled. Nothing is READY, and the next move is the architecture
> lead's judgement call — explicitly reserved to them by MSG-0056b.**
> 
> MSG-0056b states it directly: *"No implementation task is READY or authorized by this message. The
> next Architecture Lead action is to reconcile these rulings with EPA-0003, MSG-0055, the COMMS
> register, and the execution queue, then determine whether the remaining architecture decisions are
> sufficiently resolved to authorize the next architecture/work-package task."*
> 
> **The reconciliation half is done** (MSG-0057): every decision is annotated inline in EPA-0003 with
> the message that ruled it, and the register, ledger and this board agree. **The determination half is
> not Claude's to make and has not been made.**
> 
> ### What the lead needs to decide
> 
> 1. **Rule F1, F2 and F3** (MSG-0057) — three consequences the rulings imply but do not state:
>    - **F1** — is cross-language grounding (Arabic answer, English source) in scope for the first
>      release, and what does an employee see when the Arabic gate fails but English would have passed?
>    - **F2** — is unauthenticated access in scope, or deferred? If in scope, which classification
>      scheme defines "safe for unauthenticated disclosure", and who assigns it? **Recommended: defer.**
>    - **F3** — confirm directory integration terminates at an OIDC/OAuth2 boundary, or amend ADR-0007
>      by ADR if a direct bind is intended.
> 2. **Determine whether the architecture is now sufficiently resolved** to authorize the next task.
> 3. **If it is, authorize that task and allocate the work-package identifier** — `EPA-0002`
>    deliberately allocates none, because `docs/program/work-packages.md` already lists a WP-0002
>    (MSG-0055 §7.1).
> 4. **Allocate the D12 ADR number** during architecture drafting, per MSG-0056a.
> 
> ### What remains prohibited
> 
> No work package, implementation task, ADR, provider selection, or document ingestion is authorized,
> and no Supervisor or security behaviour may change. Everything under `implementation/architecture/`
> stays **PROPOSED** until the lead accepts it.
> 
> **A task becomes executable only when it appears as READY on the queue board** — the structural
> finding MSG-0044 recorded, which has now recurred five times. The Supervisor reads
> `CLAUDE-TASKS.md` and nothing else; an authorization recorded only in a message is invisible to it and
> produces a silent, indefinite idle.
> 
> **The Supervisor is correctly idle** at `NOOP: no READY task`. Note that the Windows `Schedule`
> service was stopped by the operator on 2026-08-21, so its ten-minute cadence is inert until that
> service is restarted; until then, cycles run only when triggered manually.
> 
---

**Historical — the position between MSG-0056a and MSG-0056b, retained.** The text below asked the
organization to answer D1, D3, D7 and D13. **All four were answered the same day** by MSG-0056b and
the table is kept as the record of what was asked and of whom.

> **The four that needed the organization.** D1 — are English and Arabic parallel authoritative
> versions, or is one a reference translation? (policy owner). D3 — who approves and publishes policy,
> and who assigns audience and classification? (policy/information owner). D7 — retention of and
> identity-linked access to employee questions (policy owner / legal). D13 — which OIDC identity
> provider, plus the privileged deployment action (operator). D13 was noted as the only one that could
> not be satisfied by a decision alone.

---

**Historical — the position after TASK-0021 and before MSG-0056a, retained.** The text below asked the
architecture lead to accept EPA-0001 and rule the fourteen decisions. Items 1, 2 and 4 are now
discharged by MSG-0056a; item 3 (work package authorization) was deferred until D1/D3/D7/D13 were
resolved, which MSG-0056b then did. Retained because it records what was asked, not deleted because
it was answered.

> **TASK-0021 delivered the employee policy assistant architecture definition on 2026-08-21
> (MSG-0055).** It is a definition, not a design of record. What was requested: (1) accept, amend or
> reject `EPA-0001`; (2) rule the fourteen `EPA-0003` decisions, or the four marked **Highest** —
> D1 bilingual policy authority, D3 approval authority, D5 the grounding gate, D13 the identity
> provider; (3) decide whether the work package is authorized and allocate its identifier, since
> `docs/program/work-packages.md` already lists a WP-0002 (MSG-0055 §7.1); (4) optionally rule the
> task-ordering observation (§7.2) and D12.
---

**Historical — the position after TASK-0019, since superseded.** MSG-0051 §C is now fully discharged:
C1–C5 by MSG-0052, C6–C7 by MSG-0053. The text below is retained as the record of what the audit
found and asked.

TASK-0019 completed the post-WP-0001 baseline audit on 2026-08-21 (MSG-0051). Six documentary
corrections were applied, each traceable to an existing authoritative record; seven items were
classified as needing an architecture-lead decision and **none of them was self-authorized**.

**The baseline, stated plainly.** WP-0001 is COMPLETE and verified on real infrastructure. All five
blockers are RESOLVED. No message carries `Status: OPEN` — verified by reading all 54 message files,
not by trusting an index. The blocker and discovery indexes agree with their records. The Supervisor
is ENABLED, its tests pass 36/36, and its unattended loop has been proven end to end three times
(TASK-0003, TASK-0011, TASK-0018).

**What the audit found, in one sentence:** the records are substantively sound and the drift is
entirely in the *indexes and summaries* that point at them — the same failure mode, now seen for the
fourth, fifth and sixth time, of closing something in its own file and not in the table that lists
it.

**The items awaiting a decision**, in MSG-0051's priority order — the first is the one that matters:

1. **§C1 — `docs/program/work-packages/WP-0001-kernel-foundation.md` still reads `Status: Ready for
   implementation`** while MSG-0022 / MSG-0023 declare WP-0001 COMPLETE. This is a conflict between
   *accepted work-package authority* and current state, which is TASK-0019's explicit stop
   condition, so the correction was **deliberately not made**. It needs the lead's own edit or an
   instruction authorizing it.
2. **§C2 — `CLAUDE.md` still describes the Supervisor as inert by default**, citing MSG-0011, which
   is SUPERSEDED. Governance file; not amended by an executing session.
3. **§C6 — no post-WP-0001 roadmap exists.** `ROADMAP.md` is WP-0001-scoped and fully discharged.
4. **§C3 / §C4 / §C5 / §C7** — the lead's own operating brief and the charter carry stale
   current-state notes; the MSG-0046 duplicate is the second lead-side numbering collision since the
   MSG-0035 rule, which by design does not constrain the lead's allocation.

Then: **authorize the next work package, or a task, if any is intended.**

---

**Historical — the position while TASK-0018 was open, since resolved.** The text below records the
state before the MSG-0049 addendum closed gate 3 by external observation. It is retained because the
sequence — observed four gates, could not observe the fifth from inside the run, asked, closed it
from outside — is the useful part of the record.

**One decision is required: MSG-0049 §6.** TASK-0018 is IN_PROGRESS with four of five gates MET.

**The heartbeat defect is closed in production, not just in test.** The Supervisor started TASK-0018
on its own ten-minute cycle at 20:52:56Z, and while the runner was alive `state/heartbeat.json` read
`RUNNER_RUNNING`, `runnerActive: true`, `runnerPid: 7984`, with `head` equal to the actual `HEAD` and
a timestamp that advanced 30s → 90s → 210s across three samples. TASK-0017's own run reported
`NOOP :: no READY task`, `runnerActive: false`, and a two-commit-old `head` for its entire duration.
All three symptoms are gone.

**What is not proven:** gate 3, the terminal heartbeat and lock release. The Supervisor writes that
record *after* the runner exits, so a session cannot observe the state its own exit produces. Nothing
was modified to compensate — no supervisor change, no second run, no test substituted for the
observation. The durable evidence appears seconds after the run ends, as a `COMPLETED :: task=TASK-0018`
line in `implementation/operations/supervisor/logs/supervisor-20260820.log`; the heartbeat's terminal
value is transient and the next cycle overwrites it with `NOOP` about ten minutes later.

MSG-0049 §6 offers three ways to close it — (A) read the durable log line and close, (B) authorize one
further, explicitly bounded supervisor cycle whose only work is that observation, (C) rule the gate
satisfied by MSG-0047's test. **(B) is recommended**, because proving the loop without a human in it is
what MSG-0048 is about; (A) is the cheaper fallback. TASK-0018 is left IN_PROGRESS rather than READY
precisely so no unauthorized second run starts on its own.

---

**Historical — the position after TASK-0017's first attempt, since resolved.** MSG-0046 authorized the
operator-side test run and MSG-0047 recorded 36 passed / 0 failed; TASK-0017 is COMPLETE. The text
below is retained as the record of the permission boundary it hit.

The heartbeat defect MSG-0043 authorized fixing is **reproduced, diagnosed, and corrected**, with
nine focused tests written for it. It is **not verified**, and TASK-0017 is therefore reported as
IMPLEMENTED but NOT COMPLETE. The suite could not be executed by an unattended session — no allowlist
entry permits running a PowerShell script — so the gate MSG-0043 set is unmet. One command run by
someone who can approve it closes this out:

```powershell
cd D:\Work\pci-platform\implementation\operations\supervisor
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\supervisor.tests.ps1
```

MSG-0045 §7 offers three options — (A) the operator runs it once, (B) a path-pinned allowlist entry,
(C) revert until either is possible — and recommends (A) as the smallest grant.

> **Note the risk while this sits open.** The Supervisor is ENABLED and will execute the changed
> `supervisor.ps1` unverified on its next cycle. If it is faulty, unattended execution stops until a
> human intervenes. `git revert` of the single TASK-0017 commit is the remedy.

**The defect reproduced itself at no cost.** The session that fixed it was the defect: started at
12:31:16Z, working, while `heartbeat.json` reported `NOOP :: no READY task` with `runnerActive:
false`. Two of the last three tasks have now found the automation's own records lagging reality —
first the queue (MSG-0044), then the heartbeat.

---

**Historical — the position after TASK-0016, when nothing was outstanding.**

WP-0001 is COMPLETE. **TASK-0016 ran on 2026-08-20 and completed** (MSG-0042). MSG-0041 is applied:
MSG-0034 is CLOSED in its own record and in the register, its substantive content intact. It was the
last authorized task at that moment; TASK-0017 was authorized afterwards, in MSG-0043.

That makes **five consecutive unattended deliveries** — TASK-0011, TASK-0013, TASK-0014, TASK-0015,
TASK-0016. The Supervisor fast-forwarded onto the lead's push, saw the READY task, launched Claude,
and the session did the work and pushed its own evidence — no human relay in either direction. The
full chain for this one is in the log:

```text
09:57:13Z CYCLE_START     :: pid=20308 enabled=True dryRun=False
09:57:18Z FAST_FORWARDED  :: local was behind; fast-forwarded to 9c6244c
09:57:19Z RUNNER_STARTED  :: pid=23668 task=TASK-0016
```

The `FAST_FORWARDED` line is the MSG-0034 correction working, for the fourth authorization push in a
row. Before `479dfa9`, a push by the lead left the Supervisor stuck at `NOOP :: not reconciled`
indefinitely — it could not see the very authorization it existed to act on. There is a small
symmetry worth noting: the task that closed MSG-0034 was itself started by the fix MSG-0034 records.

Nothing needed the lead in order to unblock anything *at that moment*: no blocker was open, no message
was OPEN, and no task was in flight. **The index-drift work is finished** — blockers and discoveries
both agree with their records (TASK-0013, TASK-0014, TASK-0015), and the communications register
agrees with the message files (TASK-0016).

> **No longer current.** TASK-0017 is in flight and MSG-0044 and MSG-0045 are OPEN; MSG-0045 requests
> a decision. See *Next Action* at the top of this section. The index-drift statement still holds.

Two items sit available as future work if the lead wants them, neither requested by the executing
session and neither blocking anything:

- the **COMMS register lag** — three consecutive tasks (TASK-0013, TASK-0014, TASK-0015) found the
  authorizing message on disk with no register row. **It did not recur for TASK-0016**: the lead added
  the MSG-0041 row himself, in the same commit that closed the MSG-0034 row. The narrow conclusion is
  that the lag is not inherent to the protocol but a consequence of *who* commits the register row.
  Recorded in MSG-0042 §6; no change proposed;
- **duplicate numbering from the authorizing side.** MSG-0039 (a)/(b) was the first collision since
  the MSG-0035 rule, and the rule does not reach it: it constrains Claude's allocation only. Harmless
  that time because the two agreed; MSG-0020 (a)/(b) is what it looks like when they do not. MSG-0041
  arrived single-numbered.

Then: **authorize the next work package**, or a task, if any is intended.

Also recorded, and now partly addressed: **the queue historically had no task detail
specifications.** MSG-0027 directed the executor to follow TASK-0003's "existing prerequisites,
allowed/forbidden actions, verification, documentation, checkpoint, and recovery requirements", and
none existed — `CLAUDE-TASKS.md` had only status-board rows. TASK-0011 (`2f46280`) is the **first
task written with an explicit scope block**: allowed actions, forbidden actions, success gate, and
stop conditions. It worked — the boundaries were unambiguous in execution, including where to stop.
Recommended as the pattern for future authorizations.

---

**Historical — the WP-0001 defect-fix decision, since taken.** The text below records the state
before TASK-0004 and TASK-0005 were authorized (MSG-0012) and completed. Both are now COMPLETE and
the reproducibility gate G3 has passed; it is retained as the record of what was asked and why.

TASK-0001 is DONE: WP-0001 is verified on the authorized host, all ten acceptance criteria met,
229 tests passing. The decision now needed is whether to authorize the two defect fixes:

| Task | Addresses | Why it matters |
|---|---|---|
| TASK-0004 | DISC-0007 | The database init creates a passwordless role and reports healthy anyway. Highest priority — it is the one with a security shape, even though its current effect is availability. Verifying the fix needs a **destructive** volume re-initialisation, which requires explicit authorization under Rule 9. |
| TASK-0005 | DISC-0008 | The compose kernel service cannot start as committed. Needs a decision on how a development principal is supplied without committing a token. |

Until both are fixed, **a clean checkout plus `docker compose up` produces a broken stack.** That is
the honest reading of WP-0001's state: the kernel is verified, the deployment artifacts are not.

Also awaiting a decision: TASK-0003 (`*.md` line-ending normalisation, DISC-0006), and whether
WP-0001 may now be declared COMPLETE given that every acceptance criterion is met while the
reproducibility defects remain open. Claude Code has not declared it complete.

---

**Historical — MSG-0008 progress record.** Steps 1 and 2 were **COMPLETE and verified**
(2026-08-19):

- `/data/pci-platform` provisioned by the operator: `claude:claude 0755`, on the `/dev/sdb1` 8.7T
  `/data` mount.
- Repository cloned into it by Claude Code at `9f19bce`, clean working tree, bootstrap script
  byte-identical to the committed blob (`ef2a74ff…3525c`) and parsing cleanly.
- Boundary verified after the clone: the only artifact outside `/data` is `~/.ssh/known_hosts`,
  which contract v0.2's SSH exception explicitly places outside this boundary. **No PCI project
  artifact exists outside `/data`.**

Step 3 is not executed — `sudo` requires a password and Docker is still absent:

```bash
sudo bash /data/pci-platform/deploy/bootstrap/pci-server-bootstrap.sh
```

That single command is the whole remaining blocker. Steps 4 and 5 — bootstrap verification and
WP-0001 verification — follow from it with no further operator involvement.

**Earlier record — first GO attempt.** GO was issued 2026-08-19 and stopped at the privilege
boundary: `/data/pci-platform` does not exist, `/data` is `root:root` and not writable by
`claude`, and `sudo` requires a password. Docker remains absent. No workaround was taken and the
host is unchanged. The one-time privileged bootstrap is now **authorized**; the exact command and path are in
MSG-0008. Awaiting operator execution.

**Previously stopped by instruction (MSG-0006).** Implementation
is held pending architecture-lead review of the contract v0.2 correction. Docker was not
installed, the host was not bootstrapped, `/data/pci-platform` was not created, and the host has
not been modified since the out-of-boundary clone was removed.

**Blocked on BLK-0004 — host privilege.** Resuming WP-0001 on the authorized Ubuntu PCI server is
authorized by MSG-0005 and was attempted 2026-08-19. SSH access is verified and the host was
surveyed read-only: Ubuntu 24.04.4 LTS, `/data` on a dedicated 8.7T disk, `/data/docker` present
with a pre-staged `daemon.json` setting `data-root`. Docker is absent and `claude` has no
passwordless sudo, so no bootstrap step ran. **Nothing on the host was created, installed, or
modified.**

`deploy/bootstrap/pci-server-bootstrap.sh` is committed and awaits one privileged run:

```bash
sudo bash /data/pci-platform/deploy/bootstrap/pci-server-bootstrap.sh
```

Once BLK-0004 clears, the objective is unchanged. Original text follows.

**Resume WP-0001 on the authorized Ubuntu PCI server.** Authorized by MSG-0005 after the
repository corrections above were committed and pushed. No new work package is to be started.

The objective is real verification, not further construction: bootstrap the host per
`docs/operations/pci-server-bootstrap.md`, stand up PostgreSQL with all persistent state under
`/data/docker`, run the integration tier, and prove tenant isolation against a live database with
FORCE RLS and a non-BYPASSRLS runtime role.

That closes AC-02 and the integration tier of AC-09, and converts AC-01 and AC-05 from partial to
verified. Two recorded items must be handled on the way:

- **DISC-0004** — the compose stack uses a named volume and predates the `/data/docker` boundary.
  Correct it on the host, where it can be verified.
- **DISC-0005** — `npm test` exits 0 while running zero tests under POSIX shells, which is the
  default on the target Ubuntu host. Fix before trusting any tier's result there, or the
  integration evidence will be worthless.
