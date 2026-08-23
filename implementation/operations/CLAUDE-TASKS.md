# Claude Code Execution Queue

**This file is the authoritative execution queue.** `CLAUDE.md` requires every session to read it at startup and to execute the highest-priority **READY** task, following that task's prerequisites, dependencies, allowed actions, forbidden actions, verification requirements, documentation requirements, checkpoint requirements, stop conditions, and recovery procedure.

Roadmap: [`ROADMAP.md`](ROADMAP.md) — the A→Z sequence this queue implements.
Checkpoints: [`checkpoints/`](checkpoints/) — resumable state for interrupted tasks.

Only the architecture lead may authorize new work, mark a task READY, or change priority or scope. Claude Code may propose tasks; a proposed task is **not** executable.

---

## Status board

| ID | Task | Status | Depends On | Last Verified | Next Action | Owner |
|---|---|---|---|---|---|---|
| TASK-0001 | WP-0001 verification on the authorized host | **COMPLETE** | — | 2026-08-19 `a693910` | none | Claude Code |
| TASK-0004 | Fix database role provisioning (DISC-0007) | **COMPLETE** | TASK-0001 | 2026-08-19 G1 pass | none — clean-room proof is TASK-0006 | Claude Code |
| TASK-0005 | Fix compose kernel service configuration (DISC-0008) | **COMPLETE** | TASK-0001 | 2026-08-19 G2 pass | none | Claude Code |
| TASK-0006 | Clean-room reproducibility verification | **COMPLETE** | TASK-0004, TASK-0005 | 2026-08-19 G3 pass | none | Claude Code |
| TASK-0007 | Full re-verification after fixes | **COMPLETE** | TASK-0006 | 2026-08-19 G4 pass, 229 tests | none | Claude Code |
| TASK-0008 | Final report and status reconciliation | **COMPLETE** | TASK-0007 | 2026-08-19 G5 pass | none — TASK-0009 decision recorded in MSG-0022 | Claude Code |
| TASK-0009 | WP-0001 completion decision | **COMPLETE** | TASK-0008 | 2026-08-19 | none — WP-0001 complete; no post-WP-0001 work authorized until explicitly authorized | Architecture lead |
| TASK-0003 | Normalise `*.md` line endings (DISC-0006) | **COMPLETE** | — | 2026-08-20 w/crlf 150 -> 0 | none | Claude Code |
| TASK-0010 | Execution Supervisor (installed and **ENABLED**, 10-min) | **COMPLETE** | — | 2026-08-19 tests 21/21, enabled cycle verified | none — start path proven by TASK-0003 | Claude Code |
| TASK-0011 | **Execution Supervisor smoke test — COMMS audit and end-to-end report** | **COMPLETE** | TASK-0010 | 2026-08-20 `d16665a` — PASSED | none — terminal by design | Claude Code |
| TASK-0013 | **Apply MSG-0035 maintenance decisions — blocker index + COMMS numbering rule** | **COMPLETE** | TASK-0011, MSG-0035 | 2026-08-20 — both decisions applied, MSG-0036 | none — one finding awaits a ruling, MSG-0036 §6 | Claude Code |
| TASK-0014 | **Reconcile BLK-0005 in blocker index** | **COMPLETE** | TASK-0013, MSG-0037 | 2026-08-20 — row added, MSG-0038 | none | Claude Code |
| TASK-0015 | **Reconcile discoveries index with actual DISC records** | **COMPLETE** | TASK-0014, MSG-0039 | 2026-08-20 — index 3 rows -> 9, MSG-0040 | none | Claude Code |
| TASK-0016 | **Close resolved MSG-0034 informational record** | **COMPLETE** | TASK-0015, MSG-0041 | 2026-08-20 — closure verified, MSG-0042 | none | Claude Code |
| TASK-0017 | **Supervisor heartbeat / unattended observability** | **COMPLETE** | TASK-0016 | 2026-08-20 tests 36/36 | none | Claude Code |
| TASK-0018 | **Live Supervisor heartbeat validation** | **COMPLETE** — 5 of 5 gates MET | TASK-0017 | 2026-08-21 `COMPLETED` observed externally | none | Claude Code |
| TASK-0019 | **Post-WP-0001 repository baseline audit** | **COMPLETE** | TASK-0018, MSG-0050 | 2026-08-21 — 6 corrections applied, 7 items referred, MSG-0051 | none | Claude Code |
| TASK-0021 | **Employee policy assistant — architecture definition** | **COMPLETE** | WP-0001 COMPLETE, MSG-0054 | 2026-08-21 — 11/11 acceptance criteria, MSG-0055; **accepted by the Architecture Lead (MSG-0056a)** | none — all fourteen EPA-0003 decisions ruled (MSG-0056a/b); three reconciliation findings resolved by MSG-0058 | Claude Code |
| TASK-0022 | **Employee policy assistant — work-package definition** | **COMPLETE** — output **ACCEPTED** by MSG-0062 | TASK-0021 COMPLETE, MSG-0058 DECIDED, MSG-0059 | 2026-08-21 — `EPA-0004` delivered, MSG-0061; accepted MSG-0062 with all seven open items ruled | none — the seven items in MSG-0061 §7 are ruled by MSG-0062 | Claude Code |
| TASK-0023 | **EPA work-package governance reconciliation** | **COMPLETE** | TASK-0022 COMPLETE, MSG-0062 DECIDED, MSG-0063 AUTHORIZED | 2026-08-21 — 7/7 acceptance criteria, **WP-0009** allocated, MSG-0066 | none — awaiting the Architecture Lead's next authorization; **no task is READY** | Claude Code |
| TASK-0024 | **A-ADR — draft the required EPA ADR set** | **COMPLETE** | TASK-0023 COMPLETE, MSG-0062 DECIDED, MSG-0067 DECIDED, MSG-0068 AUTHORIZED, WP-0009 defined | 2026-08-21 — 8/8 acceptance criteria, **ADR-0017…ADR-0022 drafted PROPOSED**, MSG-0070 | none — awaiting the Architecture Lead's acceptance of the drafts; **no task is READY** | Claude Code |
| TASK-0025 | **Promote ADR-0018…ADR-0022 into the accepted decision register** | **COMPLETE** | TASK-0024 COMPLETE, MSG-0071 DECIDED, MSG-0073 AUTHORIZED | 2026-08-21 — 5/5 acceptance criteria; five ADRs promoted, **zero body differences** in the per-ADR diffs, MSG-0075 | none — **no task is READY**; A-SURVEY / A-STACK / T-0 stay unauthorized | Claude Code |
| TASK-0026 | **A-SURVEY + A-STACK — bounded corpus survey and stack evaluation** | **COMPLETE (PARTIAL)** | TASK-0025 COMPLETE, MSG-0071 DECIDED, MSG-0076 AUTHORIZED | 2026-08-22 — 5/6 criteria MET; **criterion 1 UNMET (PR5)**; **EPA-0005** delivered, MSG-0078 | none — **no task is READY**. A-SURVEY awaits an organizational corpus action; EPA-0005 awaits the Lead's acceptance | Claude Code |
| TASK-0027 | **A-SURVEY (n=1) — inspect the approved/synthetic corpus** | **COMPLETE** | TASK-0026 COMPLETE (PARTIAL), MSG-0080, MSG-0083 (corpus read permission), corpus readable by the runner | 2026-08-22 — **7/7 acceptance criteria MET**; PDF inspected in place, `git status` clean, no PDF in history; **MSG-0084** | none — **no task is READY**. MSG-0084 §8 refers two non-blocking items to the Lead; A-SURVEY at *corpus* scale still awaits representative material | Claude Code |
| TASK-0028 | **A-SURVEY Arabic follow-up (n=1) — inspect `Arabic.pdf`** | **COMPLETE** | TASK-0027 COMPLETE, MSG-0085 AUTHORIZED, MSG-0083 read grant | 2026-08-22 — 9/9 criteria, MSG-0087; **document is OCR-derived (ABBYY FineReader) — the class D14 rejects** | none — two items referred to the Lead, neither blocking | Claude Code |
| TASK-0029 | **A-SURVEY Arabic text-native follow-up (n=1)** | **COMPLETE** | TASK-0028 COMPLETE, MSG-0088 AUTHORIZED, MSG-0083 read grant | 2026-08-22 — 11/11 instructions, MSG-0089; **text-native and D14-ADMISSIBLE**; **Arabic stored in visual order — naive extraction reverses it** | none — two items referred, neither blocking | Claude Code |
| TASK-0030 | **Draft the minimum ADR-0020 clarification — pre-constrained retrieval as an engine-selection gate** | **COMPLETE** | EPA-0005 ACCEPTED (MSG-0092), ADR-0020 accepted | 2026-08-22 — **7/7 acceptance criteria MET**; `ADR-0020-AMD-01` drafted **PROPOSED** and **NOT applied**, `git diff --name-only docs/` **empty**; **MSG-0094** | none — **no task is READY**. The Lead reviews AMD-01 before anything is applied; applying it needs an explicit authorization (MSG-0092 §5) | Claude Code |
| TASK-0031 | **Apply ADR-0020 AMD-01 in place** — accepted by MSG-0095 | **COMPLETE** | AMD-01 ACCEPTED (MSG-0095), TASK-0030 COMPLETE | 2026-08-23 — **7/7 acceptance criteria MET**; applied in `a1be892`; `git diff --name-only docs/decisions/` named **ADR-0020 only**, **15 insertions / 0 deletions**; **MSG-0097** | none — **no task is READY**. The ADR set is complete and stable; the next authorization is the Lead's | Claude Code |
| TASK-0002 | Make test entry points shell-independent | **ABORTED** | — | 2026-08-19 | none — premise disproven by measurement | — |

**TASK-0019 is COMPLETE (2026-08-21).** It was authorized by MSG-0050, reconciled into this queue in `39eabdb`, and executed by a supervisor-started session on its scheduled 06:37:13Z cycle. It was maintenance/audit work only, not a new product work package.
> **Attempted and blocked — 2026-08-22, BLK-0010. Read this before scheduling another cycle.**
> A supervisor-started runner (pid 24140) reached TASK-0027's **first action** and stopped there. The
> corpus read was refused: *"Claude Code may only list files in the allowed working directories for
> this session: `D:\Work\pci-platform`"*. **The corpus is UNKNOWN to that session and no survey figure
> of any kind was produced.** The queue/tree condition that stopped the *previous* cycle (BLK-0009) had
> cleared by then — this is a different, **non-transient** boundary.
> **Retrying will not clear it.** It needs one decision: **MSG-0082 option A** (a narrow read
> permission for `D:\Work\pci-corpus\`), **B** (run TASK-0027 interactively), or **C** (an
> operator-supplied extraction). **TASK-0027 needs no re-authorization** — MSG-0080 still authorizes
> it. Whether to leave it `READY` (one honest, identical blocker per cycle) or hold it pending that
> decision is **the Architecture Lead's call; this session changed no status.**

**TASK-0027 is COMPLETE — executed 2026-08-22 by a supervisor-started session against `HEAD = 9d5f747`,
the cycle immediately after MSG-0083's permission grant was pushed.** All seven MSG-0080 acceptance
criteria are MET, each mapped to evidence in **MSG-0084** §3. Being documentary it produced **no test
count and claims none**.

**The corpus read succeeded on the first attempt** — MSG-0083's narrow grant worked exactly as
authorized, and BLK-0010 is closed by execution rather than by assertion. **The PDF never entered the
repository**: verified four ways (working tree, corpus path, repository path, and the whole of
history), all quoted in MSG-0084 §9.

**The headline findings are document-level and n=1.** The file is a **45-page, text-native, English-only
PDF 1.7** produced by Word 2016 — 107,988 characters of tagged content text decoded across all 45 pages,
**zero Arabic characters**, zero undecodable glyphs, and exactly **two** image XObjects in the whole
document (a 103×92 logo and its mask). **D14 would not reject it.**

**The most reusable output is not the language finding — it is three extraction hazards** (MSG-0084 §5),
each of which corrupts a T-B pipeline *silently* rather than failing: page 1 draws **every glyph twice**,
once as a `/Artifact`-tagged drop shadow, so an extractor without marked-content scoping doubles the one
page carrying the title, authorship and approval block; `/Span <</Lang(en-ZA)>>` property dictionaries
look like body text to a naive regex and inject **1,865** spurious strings; and **page 23 yields 67
characters** because its content is a vector flow chart — text-native, so D14 never fires, yet
effectively unreadable.

**What did NOT change, and this is the part to read before citing this task.** **This document supplies
no Arabic evidence at all**, so **MSG-0056a D6 is exactly as deferred as before** and **ADR-0019 was not
amended and must not be amended on the strength of it**. Four of A-SURVEY's five dimensions — format
mix, language prevalence, scanned prevalence, classification/audience distribution, version/supersession
prevalence — are **recorded as INSUFFICIENT at n=1, with no estimates invented** (MSG-0084 §6). **No ADR
was touched, no provider/model/runtime selected, and T-A, T-B, T-D, T-E and T-0 remain unauthorized.**

**Two items are referred to the Architecture Lead and neither blocks anything** (MSG-0084 §8): the
designated corpus is **real organizational material, not synthetic** — a genuine clinic emergency plan
with a named approver and no confidentiality marking — so the "approved/synthetic" description should be
confirmed rather than left standing unexamined; and the unattended runner **has no PDF tooling**
(`pdftoppm` absent, `pdftotext` off the allowlist), which this task worked around by reading the file's
bytes directly rather than by widening any permission.

> **The paragraphs this replaces, retained.** "**TASK-0027 is READY — the single READY task.** Authorized
> by **MSG-0080** …" plus the BLK-0010 blocked-attempt note above it. Both were true when written; the
> blocked attempt is still the record of what BLK-0010 found, and the decision it asked for was answered
> by MSG-0083 and has now been exercised successfully.

**Superseded, retained — the READY entry.** Authorized by **MSG-0080**, which closes the gap
TASK-0026 stopped at: the organization supplied an approved/synthetic corpus, and A-SURVEY may now run
against it. **TASK-0027 is an id allocated here** — MSG-0080 assigns none — verified unused. There is
no separate `TASK-0027-*.md` file; **MSG-0080 plus the task section below are the specification.**

**The corpus is at `D:\Work\pci-corpus\plan.pdf`, deliberately outside this repository, and it must
stay there.** MSG-0080 is explicit: it must not be copied, staged, committed, or otherwise added to
repository history.

> **That is not a theoretical risk.** The file was first placed at `D:\Work\pci-platform\plan.pdf` —
> inside the working tree, untracked and not ignored — where the next `git add -A` would have committed
> 627 KB of corpus into history. Every COMMS cycle runs `git add -A`, and so does the unattended
> runner. It was moved out before anything staged it, and `git status` was verified clean afterwards.
> **A runner that copies it in "just to read it" would recreate that risk.** Read it in place.

**The survey is n=1, and the boundary between what one document can and cannot establish is the point
of the task**, not a caveat on it. See the section below.

**TASK-0026 is COMPLETE (PARTIAL) — executed 2026-08-22.** It was run by a
supervisor-started session (`runner.lock` pid 27312, acquired 06:57:17Z) against the reconciliation
MSG-0077 pushed in `69a4d03`. **Five of the six MSG-0076 acceptance criteria are MET; criterion 1 is
UNMET on PR5**, each mapped to evidence in **MSG-0078** §2. Being documentary it produced **no test
count and claims none**.

**The prediction in the entry below held exactly, and the important half is the one that did *not*
happen.** A-STACK ran and delivered
[`EPA-0005`](../architecture/EPA-0005-assistant-stack-evaluation.md) — PROPOSED, selecting nothing.
**A-SURVEY stopped at its prerequisite and produced no figures of any kind.** The corpus question was
**re-checked by inspection in the executing session**, not inherited from this entry: a tree-wide search
for document-like files returned two TypeScript licence texts and nothing else. **PR5 is still UNMET.**

**What EPA-0005 concluded, in one line each.** *"The stack"* is not one decision — the real fork is one
runtime or two, and it is framed rather than settled. **ADR-0020 §3.1/§4 make pre-filtered retrieval a
functional requirement on the index engine**, which disqualifies post-filter-only similarity search —
the sharpest finding, because over-fetch-then-filter is the prohibited shape one layer down and *looks*
like enforcement. **Three local models are required, not one** (generation, embedding, **and ADR-0017's
entailment layer**), which multiplies the unmeasured PR6. **Conversation and audit are two stores**, and
a single log violates ADR-0021 §2/§4 invisibly. **Every selection is left open** in §9.2 with the
evidence that would close it.

**WP-0009 §6.2 asked A-STACK whether its output should be an ADR. EPA-0005 §9.3 answers — recommend
*not yet* — and creates none**, MSG-0076 authorizing no ADR drafting.

> **The paragraphs this replaces, retained:** "**TASK-0026 is READY — the single READY task.** Authorized
> by **MSG-0076**, which authorizes one bounded architecture task with two outputs: **A-SURVEY** (bounded
> corpus survey) and **A-STACK** (stack evaluation). MSG-0076 assigns no task number; **TASK-0026 was
> allocated here** as the next unused id, verified free across the repository. There is **no separate
> `TASK-0026-*.md` file** — as with TASK-0025, MSG-0076 plus the task section below are the
> specification." True from the MSG-0077 reconciliation until the task executed the same day. **The
> no-separate-file note still holds** and is repeated so a later reader does not go looking.

**The two halves were not equally executable, and that was the most important thing in this entry.**

- **A-STACK can run now.** Every input it needs is in the repository: `docs/architecture/technology-selection-principles.md`,
  the six accepted EPA ADRs in `docs/decisions/`, and WP-0009.
- **A-SURVEY is blocked on PR5.** It requires "representative approved policy material", and **no such
  corpus is reachable from this repository** — verified, not assumed: a search for policy documents
  returns only kernel source files named `policy`. WP-0009 §6.1 records PR5 as the **organization's**
  prerequisite and EPA-0004 §11.5 records it as **UNKNOWN — not visible from the repository**.

**A-SURVEY must therefore stop at its prerequisite and record why. It must not produce empirical
observations it cannot have made.** See the task section; this is the failure mode the entry exists to
prevent.

> **Outcome, 2026-08-22 — the instruction was followed.** A-SURVEY stopped at PR5. **No format
> breakdown, language mix, scanned-document prevalence, classification pattern, or version
> characteristic exists in the commit** — not as estimates, not as illustrations, not as expected
> values — and **no survey method or plan was substituted** for the authorized output. The corpus was
> **re-checked by inspection** first, as required, because the operator could have supplied material
> after this entry was written; they had not. Evidence: MSG-0078 §3.

**TASK-0025 is COMPLETE (2026-08-21).** It was executed by a supervisor-started
session (`runner.lock` pid 16980, acquired 20:47:18Z) — the cycle immediately after the MSG-0074
reconciliation was pushed. All five MSG-0073 acceptance criteria are met, each mapped to evidence in
**MSG-0075** §2. Being documentary it produced **no test count and claims none**.

**The WP-0009 ADR set is now complete and authoritative.** ADR-0018 … ADR-0022 are promoted into
`docs/decisions/`, joining ADR-0017, which the lead promoted in `d9c4524`. Under the CLAUDE.md authority
order those six now sit at tier 2 — above the COMMS messages that previously carried these rulings,
which is the entire point of having drafted them.

**The verification is a diff per record, and every hunk is in a header.** Each promoted file was
produced by copying its draft **byte for byte** and editing exactly two things — the `Status` block and
an added `Accepted by: Architecture Lead — MSG-0071` line — so the body could not drift and the diff is
a real check rather than a restatement of intent. **Zero body differences across all five.** No accepted
ADR was modified: `git status --porcelain` showed five new paths under `docs/decisions/` and no modified
path there.

**The three MSG-0071 conditions were re-checked in the promoted copies**, not inherited from MSG-0072's
pre-promotion pass, because promotion is the step where they could be lost. No provider, model,
framework or runtime is selected — ADR-0022's citation of ADR-0003's note on Ollama survived intact and
still explicitly declines to elevate it. ADR-0019 still states it is incomplete for production by
design, with **no normalization rule invented**. ADR-0017's entailment model and thresholds remain open
under SPEC-0020.

**Nothing became executable.** A-SURVEY, A-STACK and T-0 remain unauthorized; no implementation task is
READY; the string `READY` does not occur in any promoted ADR.

> **The line this replaces, retained:** "**TASK-0025 is READY — the single READY task.** Authorized by
> **MSG-0073**, which answers the MSG-0072 decision … Prerequisites verified individually … MSG-0073
> states: *'Claude may execute TASK-0025 when it is reconciled as READY.'* With this pushed, the
> Supervisor — enabled and cycling every ten minutes — will start it on its next cycle." True from the
> MSG-0074 reconciliation until the task executed the same day. **The prediction held**, and each
> prerequisite was re-verified at the start of the executing session rather than inherited from that
> paragraph — checkpoint 1 records each.

**There is no separate TASK-0025 specification file.** MSG-0073 carries the objective, constraints and
acceptance criteria, and **the task section below is the specification**. Read both. That remains true
after execution, and is repeated here so a later reader does not go looking for a missing file.

**What the Architecture Lead does next.** MSG-0071's *Next architecture boundary* makes promotion the
precondition for the next bounded architecture task: **A-SURVEY** or **A-STACK** from WP-0009 §6.2.
**That precondition is now met.** Whichever is authorized must be reconciled into this board as the
single READY task, **in the same commit as the authorization**. The MSG-0044 gap recurred for the
**eighth** time with MSG-0073 — `grep -c "TASK-0025"` returned 0 on this file after the authorization
landed — and MSG-0074 repaired it before the next Supervisor cycle, which is why the run started on
time and nothing idled. Repaired-in-time is not the same as prevented.


**TASK-0024 is COMPLETE (2026-08-21), and no task is READY.** It was executed by a supervisor-started
session (`runner.lock` pid 26328, acquired 19:27:19Z) — the next cycle after the reconciliation was
pushed, exactly as predicted below. All eight acceptance criteria are met, each mapped to evidence in
**MSG-0070** §2. Being documentary it produced **no test count and claims none**.

**Six ADRs are drafted as PROPOSED** in `implementation/decisions/`, covering the six WP-0009 §7
surfaces: **ADR-0017** Grounded Answer Contract · **ADR-0018** Approved Document Authority and
Lifecycle · **ADR-0019** Bilingual Policy Semantics · **ADR-0020** Retrieval Projection and Index
Boundary · **ADR-0021** Employee Question Privacy and Retention · **ADR-0022** Inference Locality and
Provider Boundary.

**Numbers were allocated at drafting time and verified collision-free first** — `docs/decisions/` holds
ADR-0001…ADR-0016 with no gaps, and a repo-wide grep for ADR-0017…ADR-0029 returned only prose
references, zero record files. **No accepted ADR was modified, duplicated, renamed, or deleted**,
evidenced by a pre-commit `git status --porcelain` showing no path under `docs/decisions/`.

**The drafts are PROPOSED, not accepted, and that is the boundary rather than an omission.** Claude Code
does not accept architecture: `implementation/decisions/README.md` states that records there carry no
authority until the lead promotes them to `docs/decisions/`, and ADR-0015/ADR-0016 are the precedent —
each drafted PROPOSED there and promoted with a `Supersedes:` line. Neither MSG-0068a nor MSG-0068b
grants acceptance authority.

**All six surfaces were tested independently rather than inherited.** WP-0009 §7 marks all six REQUIRED
and invites disagreement; the task treated that as a hypothesis and checked each against the accepted
ADR set read in full. All six survived, for one structural reason: each rests on a ruling that is
stricter than or absent from the accepted set and currently lives **only in a COMMS message**, which is
not an authority tier. **Surface 4 was the close call, and MSG-0070 §4 records the argument against it**
so the lead can reject it cheaply if they disagree.

**Two things were deliberately not done.** **ADR-0019 does not contain the Arabic normalization rules** —
MSG-0056a D6 requires them determined empirically against a corpus nobody has surveyed, so the draft
records the obligation and three fixed constraints and states that it must be amended before production
use. **No task was marked READY**, including A-STACK and A-SURVEY.

> **The line this replaces, retained:** "**TASK-0024 is READY — the single READY task.** Authorized by
> **MSG-0068** and reconciled into this board on 2026-08-21 after its prerequisites were verified
> individually … **The Supervisor is live again** … it was idling at `NOOP: no READY task` at 19:17:18Z
> while TASK-0024 sat authorized. With this reconciliation pushed, **the next cycle will start it** — no
> manual trigger is needed." True from the MSG-0069 reconciliation until the task executed the same day.
> **The prediction held**: the 19:27:19Z cycle started it.

**What the Architecture Lead does next:** accept, amend, or reject ADR-0017…ADR-0022 and promote what is
accepted to `docs/decisions/`; rule on ADR-0019's normalization gap; and, if further architecture work is
wanted, authorize **A-STACK** or **A-SURVEY** from WP-0009 §6.2 and reconcile it here as the single READY
task. MSG-0070 §9.

> **Two specification files, and two authorization messages.** `TASK-0024-epa-adr-drafting.md` and
> `TASK-0024-a-adr.md` both specify this task; `MSG-0068-task-0024-authorization-epa-adr-drafting.md`
> and `MSG-0068-task-0024-a-adr-authorization.md` both authorize it. **All four agree** — same
> objective, same six surfaces, same forbidden list, same requirement that ADR numbers be allocated at
> drafting time from the repository's actual state — so no stop condition fired. They are not
> identical, so **the section below carries the union of all four.** Nothing was renamed, per MSG-0058
> F4. Recorded in MSG-0069.

> **Reconciliation warning, from MSG-0060 and MSG-0064 — now seven.** TASK-0024 was authorized and
> `grep -c "TASK-0024"` on this file returned **0**, with the Supervisor idling on a healthy-looking
> "no READY task" at the time. This is the **seventh** occurrence, and the first where the cost was
> visible in the log rather than hypothetical.

> **The line this replaces, retained:** "**TASK-0023 is COMPLETE (2026-08-21), and no task is READY.**"
> True from TASK-0023's completion until MSG-0068 authorized TASK-0024 the same day.


**TASK-0023 is COMPLETE (2026-08-21).** It was executed by a supervisor-started
session (`runner.lock` pid 27400, acquired 18:04:59Z) and delivered
[`WP-0009 — Employee Policy Assistant`](../../docs/program/work-packages/WP-0009-employee-policy-assistant.md),
the formal work-package record. All seven MSG-0063 acceptance criteria are met, each mapped to evidence
in **MSG-0066** §3. Being documentary, it produced **no test count and claims none**.

**The identifier is WP-0009** — the next number unused in *either* register, verified by `grep` before
allocation. **Historical WP-0001 is untouched** and all eight `PLAN-WP-0001` planning entries are
retained verbatim; the two registers are reconciled in `docs/program/work-packages.md` §0 with a
standing allocation rule, which also closes **DISC-0010**. WP-0002 looked free from the delivered
directory alone and was **not** taken: the planning list has held it since it was written.

**Three MSG-0062 rulings shaped the sequence.** §7.3 fixes **T-D before T-E** and closes an item open
since EPA-0002. §7.6 makes "retrieve then filter" a **gate failure** rather than a style preference —
Restricted documents are eligible for the corpus, but a Restricted document is never retrieved unless
the subject satisfies its policy, and denial fails closed with no existence, content, timing, or
result-count side channel. §7.7 means **ADR-0015 is not inherited** and no stack is selected.

**Two things were deliberately not done, and both would have looked helpful.** **ADR numbers were not
allocated** — MSG-0062 §7.2 and this queue section both place allocation in the ADR-drafting task, so
the six surfaces are sequenced and justified but unnumbered, with "next free is ADR-0017" recorded as an
observation only. **No task was marked READY**, including the three architecture tasks the record itself
defines. That is the boundary MSG-0063 draws, not an omission.

> **The line this replaces, retained:** "**TASK-0023 is READY — the single READY task.** Authorized by
> **MSG-0063** and reconciled into this board on 2026-08-21 after its prerequisites were verified
> individually, not assumed: TASK-0022 COMPLETE, MSG-0062 DECIDED, MSG-0063 AUTHORIZED, no OPEN blocker,
> no runner lock held, and exactly one TASK-0023 specification file on disk." True from the MSG-0064
> reconciliation until the task executed on the same day. Every prerequisite was re-verified at the start
> of the executing session rather than inherited from this paragraph — checkpoint 1 records each.

**What the Architecture Lead does next:** authorize one bounded architecture task from `WP-0009` §6.2 —
**A-ADR**, **A-STACK**, or **A-SURVEY** — and reconcile it into this board as the single READY task.
The reconciliation warning below applies to it in full; the count stands at six.

It is **architecture/governance reconciliation only.** It may not implement, select any provider,
model, embedding, framework or runtime, change permissions, security boundaries, Supervisor behaviour
or scheduling, create or modify accepted ADRs, or perform any operator-only or privileged action.
**It may not mark any downstream implementation task READY.**

**EPA-0004 was ACCEPTED by MSG-0062**, which also ruled all seven of the open items MSG-0061 §7
raised. Three of those rulings change what the next task must do:

- **7.3** — **T-D (grounded QA) must precede T-E (retrieval-time authorization).** Authorization
  controls must not be validated against an unproven answer path.
- **7.6** — Restricted documents **are** eligible for the governed corpus, but **no retrieve-then-suppress
  design is permitted**: a Restricted document is never retrieved into a request unless the
  authenticated subject satisfies its policy, and denial must fail closed without revealing existence,
  content, timing, or result-count.
- **7.7** — **ADR-0015 is not inherited** as the service stack. A dedicated architecture task must
  propose the concrete stack; nothing is selected by that ruling.

**7.1 leaves the work-package identifier deliberately unallocated** — no existing WP number is
repurposed — and allocating it through the register reconciliation is TASK-0023's job.

> **Reconciliation warning, from MSG-0060 — still live.** Five times an authorization has existed while
> this queue did not reflect it, leaving the Supervisor idling on a healthy-looking "no READY task".
> TASK-0023 was the sixth occurrence: MSG-0063 authorized it and `grep -c "TASK-0023"` on this file
> returned **0**. It is reconciled now. When the next task is authorized, the same step is required
> again, or it becomes the seventh.

> **The line this replaces, retained:** "**TASK-0022 is COMPLETE (2026-08-21) and no task is READY.** …
> **No task is READY, and that is the correct state.** MSG-0059 makes the Architecture Lead's
> acceptance of EPA-0004 the precondition …" True from TASK-0022's completion until MSG-0062 accepted
> EPA-0004 and MSG-0063 authorized TASK-0023 on the same day. The acceptance boundary it described has
> been passed, not removed: implementation remains prohibited.

> **Reconciliation warning, from MSG-0060.** Five times now an authorization has existed while this
> queue did not reflect it, leaving the Supervisor idling on a healthy-looking "no READY task". When
> T-A is authorized, it must be **reconciled into this board as the single READY task** or it will be
> the sixth.

> **The line this replaces, retained:** "**TASK-0022 is READY — the single READY task**, authorized by
> MSG-0059 and reconciled into this board on 2026-08-21. It is architecture/work-package definition
> only …" True from the MSG-0060 reconciliation until TASK-0022 executed on the same day.

> **The line that replaced, retained:** "**No task is READY.**" True from TASK-0021's completion
> until MSG-0059 authorized TASK-0022. The note below it records the earlier correction and is
> kept intact.

> **Corrected 2026-08-21 by TASK-0021.** This line previously read "**No task is READY.** TASK-0019
> was the last authorized one." That was true when written and stopped being true when MSG-0054
> authorized TASK-0021, which was reconciled into the board above in `3350cb4` and has since been
> executed. **TASK-0021 is now COMPLETE** (MSG-0055) and no task is READY again — but for a different
> reason: the project sits at an **architecture decision boundary**, not at an empty queue.
> EPA-0003 lists fourteen decisions; four are marked Highest and are enough to unblock the
> foundation. The Supervisor will correctly remain idle until the lead authorizes something.

**MSG-0052 has since ruled on C1-C5** (2026-08-21). C1 is applied: the accepted work package now reads
`Status: COMPLETE`, so the conflict TASK-0019 referred is closed. C2 and C3 are applied as documentary
supersessions; C4 and C5 required no action. **C6 (a bounded proof of MSG-0049 option B) and C7 (the
next work package) remain architecture-lead decisions and are not self-authorized.**

**TASK-0016 is explicitly authorized by the architecture lead after WP-0001 completion.** It is maintenance/documentation work, not a new product work package.

### TASK-0017 — result: COMPLETE (the section below is superseded history)

> **Corrected 2026-08-20 by TASK-0018.** The status board above reads **COMPLETE** for TASK-0017 and
> the narrative below reads **IMPLEMENTED but NOT COMPLETE** — a straight contradiction inside one
> file. The board is right: MSG-0046 authorized the operator-side test run, MSG-0047 records **36
> passed / 0 failed**, and the task closed in `1f2903d`. The block below was accurate when written,
> before the suite could be executed, and is retained rather than rewritten because the sequence
> — blocked, asked, authorized, verified — is the useful part of the record.
>
> This correction is **additive and declared** (MSG-0049 §7.3). TASK-0018's scope permits updating
> queue documentation; it does not extend to the MSG-0045 record's own status line, which was left
> untouched and still reads OPEN.

**IN_PROGRESS, 2026-08-20.** The defect was reproduced, diagnosed and corrected, and nine focused
tests were written. **The success gate is NOT met**: MSG-0043 requires that the relevant test suite
passes, and the suite **could not be executed** — no allowlist entry permits running a PowerShell
script, so the command documented in the supervisor README was refused three times. Evidence and the
decision request: **MSG-0045**. Both checkpoints: `checkpoints/TASK-0017.md`.

**The reproduction cost nothing.** This session *was* the defect: the Supervisor started it at
12:31:16Z and `state/heartbeat.json` went on reading `NOOP :: no READY task`, `runnerActive: false`,
with a two-commit-old `head`, for the whole run. The log was correct throughout — the fault was
confined to the state file and never touched scheduling.

**Corrected** in `supervisor.ps1`: the runner wait polls instead of blocking, a heartbeat is written
at launch and refreshed while the runner is alive, `runnerPid` is published, and the overloaded
`STARTED` decision is split into `RUNNER_STARTED` / `RUNNER_RUNNING` / `COMPLETED` / `FAILED`, with
`ERROR` narrowed to mean the supervisor itself failed. The ten-minute schedule, the reconciliation
gate, the fail-closed behaviour, and every permission rule are **untouched**.

**Status is IN_PROGRESS, deliberately, not COMPLETE and not READY.** Not COMPLETE because the gate is
unmet. Not READY because that would have the Supervisor start the task again on its next cycle and
repeat the work indefinitely. A checkpoint exists, as IN_PROGRESS requires.

> **Operational risk, stated rather than buried.** The Supervisor is ENABLED and will run this changed
> code unverified on its next cycle. If it contains a fault, unattended execution stops until a human
> intervenes. The change is ASCII-verified, additive, and confined to the state-writing path — but a
> static read is not a passing test. It is one commit and `git revert` undoes it.

### TASK-0017 — authorization (as issued)

**READY, 2026-08-20.** MSG-0043 authorizes diagnosing and correcting the heartbeat/observability
defect. Full specification: [`TASK-0017-supervisor-heartbeat.md`](TASK-0017-supervisor-heartbeat.md);
the queue section below carries prerequisites, allowed and forbidden actions, verification,
documentation, checkpoint, stop conditions, and recovery. Queue reconciliation is recorded in
MSG-0044.

### TASK-0016 — result

**COMPLETE, 2026-08-20.** MSG-0034 is CLOSED in its own record and in the COMMS register, its
substantive content intact. Evidence: MSG-0042; commit and push quoted in `checkpoints/TASK-0016.md`
checkpoint 2.

**Two of the four success-gate items were already satisfied when this session started.** The
architecture lead closed the MSG-0034 record itself in `4b5965d` and the register row in `9c6244c`,
before the Supervisor's 09:57:18Z fast-forward. **Neither was re-done** — CLAUDE.md *Checkpointing and
Recovery* rule (f) forbids repeating an operation because a record says it is incomplete, and both
closures were verified by direct observation of the files. This session executed only what remained:
the execution record, the register row, this queue update, the `current.md` reconciliation, and the
push. **MSG-0034 itself was not modified by this session**, which is the opposite of what "TASK-0016
closed MSG-0034" would suggest, and is why it is stated here.

The stop condition was checked before acting and **did not fire**. It fires on a *material conflict*
between MSG-0034's evidence or MSG-0041 and the actual repository state; what was found instead was
state **ahead of** the authorization in the direction the authorization points. Convergence, not
conflict. The substantive-content check was made by reading the file, not by trusting the diffstat:
`4b5965d` added a `## Closure` section and changed the status line, and deleted nothing.

**The COMMS register lag did not recur** — the first time in four tasks. MSG-0041's register row was
already present, added by the lead in the same commit that closed the MSG-0034 row. Recorded in
MSG-0042 §6 as an observation; **no change proposed, no ruling requested**.

**Zero messages now carry `Status: OPEN`.**

### TASK-0016 — authorization (as issued)

**READY, 2026-08-20.** MSG-0041 authorizes closing MSG-0034 because its diagnosis is verified, the TASK-0011 smoke test passed, and no unresolved action depends on it.

**Allowed:**
- Change only the status/closure section of `implementation/comms/MSG-0034-task-0011-execution-path-correction.md` from OPEN to CLOSED, preserving its substantive historical content.
- Ensure the COMMS register records MSG-0034 as CLOSED.
- Create exactly one execution record for TASK-0016 using the message-numbering protocol, and reconcile the register in the same commit.
- Update required task/status documentation and push the result.

**Forbidden:**
- No changes to Supervisor code/configuration, permissions, scheduling, blockers, discoveries, product/code, or historical substantive COMMS content.
- No renumbering of existing messages.
- No credential access, privilege escalation, destructive commands, repository reset/clean, or force push.

**Success gate:** MSG-0034 is CLOSED in its own record and the register; exactly one TASK-0016 execution record exists; queue/status documentation is consistent; changes are committed and pushed.

**Stop condition:** If MSG-0034's evidence or MSG-0041 materially conflicts with the actual repository state, STOP and report in COMMS. Do not improvise.

### TASK-0015 — result

**COMPLETE, 2026-08-20.** The discoveries index went from **three rows to nine**. DISC-0004 through
DISC-0009 were missing entirely — including the two deployment-artifact defects (DISC-0007,
DISC-0008) and the `/data` boundary finding (DISC-0009). Every status is transcribed from the
record's own header line; **no `DISC-*.md` record was altered, deleted, or renumbered**, evidenced by
the pre-commit `git status --porcelain` in `checkpoints/TASK-0015.md`. Zero index rows were stale and
zero lacked a record — the drift was pure omission. Evidence: MSG-0040.

No stop condition fired. All nine records carry an unambiguous status. The one apparent exception was
checked and dismissed: `grep "Status:.*OPEN"` hits `DISC-0006` line 17, which is quoted `grep` output
inside a fenced example block, not that file's status.

**One judgment call, declared rather than folded in** (MSG-0040 §5): `implementation/status/current.md`
keeps a second discovery table whose DISC-0009 row read **OPEN** while the record reads "CLOSED —
ACCEPTED, NOT A VIOLATION". It was corrected under MSG-0039 (a) §4 and §7, because leaving it would
have created a fresh contradiction the moment the discoveries index became correct. That table's
header was also widened from two columns to three, which is what its rows already supplied — the
renderer had been silently dropping four statuses.

**The authorization was duplicate-numbered.** Two MSG-0039 files exist (`b123361`, `dc307fa`). They do
not conflict; the task executed the stricter reading of both, registered them as MSG-0039 (a)/(b), and
renumbered neither, per MSG-0035 decision 2. Reported in MSG-0040 §6; **no ruling requested**.

### TASK-0015 — authorization (as issued)

**READY, 2026-08-20.** MSG-0039 authorizes a narrowly scoped reconciliation of `implementation/discoveries/README.md` against the actual `DISC-*.md` records. The task may update only the discoveries index and required task/COMMS evidence. It must not alter discovery substance, architecture decisions, blockers, product/code, Supervisor configuration, permissions, scheduling, or repository history. It must stop for malformed records or conflicts requiring architectural judgment.

### TASK-0014 — result

**COMPLETE, 2026-08-20.** The blocker index now lists **BLK-0005 · Two contradictory MSG-0020 decisions · High · RESOLVED 2026-08-19**, citing MSG-0022, MSG-0023, and the blocker record. The underlying `BLK-0005-conflicting-msg-0020-decisions.md` was **not** altered, BLK-0001 through BLK-0004 are unchanged, and the discoveries index was not touched. Evidence: MSG-0038; commit and push quoted in `checkpoints/TASK-0014.md` checkpoint 2.

The stop condition was checked before acting: MSG-0037, MSG-0022, MSG-0023, and the BLK-0005 record agree that WP-0001 is COMPLETE and BLK-0005 is closed, so it did not fire. The one nuance — MSG-0023 retains MSG-0022 "only as the historical conflict-resolution record" — is a clarification of which record survives, not a disagreement about BLK-0005, and is recorded in MSG-0038 §3 so it is not misread later.

**All five blockers are now listed and all five read RESOLVED.** With BLK-0001 and BLK-0004 corrected by TASK-0013 and BLK-0005 added here, the index and the underlying records finally describe the same state.

### TASK-0013 — result

**COMPLETE, 2026-08-20.** Both MSG-0035 decisions applied: BLK-0001 and BLK-0004 are RESOLVED in the blocker index with their resolution date and evidence reference, and the COMMS numbering-allocation convention is recorded in `implementation/comms/README.md`. Evidence: MSG-0036; commit and push quoted in `checkpoints/TASK-0013.md`.

---

## TASK-0011 — prior result

TASK-0011 was a one-time execution-infrastructure test. The Supervisor selected it, launched Claude, Claude read shared repository state, produced MSG-0032, and pushed the result to GitHub with no human relay. The smoke test passed. Earlier attempts had stopped at the reconciliation gate because the clone was behind `origin/main`; the gated fast-forward correction in `479dfa9` resolved that failure mode.

---

## Status values

| Status | Meaning |
|---|---|
| **READY** | Authorized and executable now. Prerequisites are checked before actions begin. |
| **IN_PROGRESS** | Started; a checkpoint exists in `checkpoints/`. |
| **COMPLETE** | Finished and verified, with evidence recorded in the repository. |
| **BLOCKED** | Authorized in principle, but a dependency or prerequisite is unmet. |
| **WAITING_FOR_ARCHITECTURE_LEAD** | Needs a decision or authorization only the lead can give. |
| **WAITING_FOR_OPERATOR** | Needs a privileged or credential-holding action only the operator can perform. |
| **ABORTED** | Withdrawn. Its premise was wrong or it was superseded. Kept for the record. |

READY means *authorized to attempt*, never *authorized to force*. A READY task whose prerequisite is unmet stops at the prerequisite and records why.

---

## Communication ledger

| MSG ID | Type | Status | From | To | Decision / Action | Related Task |
|---|---|---|---|---|---|---|
| MSG-0001 | Question | ANSWERED | Claude Code | Architecture lead | Ubuntu host, `claude` account, `/data/docker` boundary — answered by the accepted bootstrap contract | TASK-0001 |
| MSG-0002 | Proposal | CLOSED | Claude Code | Architecture lead | Kernel stack — ADR-0015 ratified | TASK-0001 |
| MSG-0003 | Question | CLOSED | Claude Code | Architecture lead | Repository layout and governance authority — decided by MSG-0005 | — |
| MSG-0004 | Proposal | CLOSED | Claude Code | Architecture lead | Prepared corrections — approved and applied | — |
| MSG-0005 | Decision | DECIDED | Architecture lead | Claude Code | ADR-0015 and ADR-0016 ratified; `docs/` authoritative; `docs/program/work-packages/` canonical; WP-0001 layout accepted | TASK-0001 |
| MSG-0006 | Directive | DECIDED | Architecture lead | Claude Code | Absolute `/data` boundary; `/data/pci-platform` mandatory workspace; contract v0.2 | all |
| MSG-0007 | Directive | DECIDED | Architecture lead | Claude Code | Twelve non-negotiable rules; startup and pre-action checklists | all |
| MSG-0008 | Procedure | CLOSED | Claude Code | Operator | Authorized bootstrap executed; `DockerRootDir` = `/data/docker` verified | TASK-0001 |
| MSG-0009 | Directive | DECIDED | Architecture lead | Claude Code | Documentation is mandatory | all |
| MSG-0010 | Record | CLOSED | Claude Code | Architecture lead | Phase 0 execution-control system built | TASK-0004, TASK-0005 |
| MSG-0011 | Record | SUPERSEDED | Claude Code | Architecture lead | Execution Supervisor built, tested (17/17), NOT installed and NOT enabled | TASK-0010 |
| MSG-0012 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0004 and TASK-0005 authorized | TASK-0004, TASK-0005 |
| MSG-0013 | Directive | DECIDED | Claude Code | Architecture lead | Reconcile queue to READY from MSG-0012 | TASK-0004, TASK-0005 |
| MSG-0014 | Directive | DECIDED | Claude Code | Architecture lead | Queue authorization reconciliation | TASK-0004, TASK-0005 |
| MSG-0015 | Record | CLOSED | Claude Code | Architecture lead | TASK-0004 and TASK-0005 complete; TASK-0006 authorization required | TASK-0006 |
| MSG-0016 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0006 authorized | TASK-0006 |
| MSG-0017 | Record | CLOSED | Claude Code | Architecture lead | TASK-0006 complete; TASK-0007 authorization required | TASK-0007 |
| MSG-0018 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0007 authorized; continuation to TASK-0008 permitted | TASK-0007, TASK-0008 |
| MSG-0019 | Record | CLOSED | Claude Code | Architecture lead | TASK-0007 / TASK-0008 complete; WP-0001 ready for completion decision | TASK-0009 |
| MSG-0020 (a) | Decision | SUPERSEDED | Architecture lead | Claude Code | Erroneous NOT COMPLETE decision; TASK-0012 authorization superseded by MSG-0022 | TASK-0009 |
| MSG-0020 (b) | Decision | SUPERSEDED | Architecture lead | Claude Code | Duplicate COMPLETE decision; final ruling restated by MSG-0022 | TASK-0009 |
| MSG-0021 | Question | CLOSED | Claude Code | Architecture lead | Duplicate MSG-0020 conflict resolved by MSG-0022 | TASK-0009 |
| MSG-0022 | Decision | DECIDED | Architecture lead | Claude Code | Duplicate MSG-0020 resolved: **WP-0001 COMPLETE**; TASK-0012 not authorized | TASK-0009 |
| MSG-0023 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0009 terminal; TASK-0012 not in the WP-0001 path | TASK-0009 |
| MSG-0024 | Decision | DECIDED | Architecture lead | Claude Code | **Execution Supervisor enablement authorized**, fail-closed preserved | TASK-0010 |
| MSG-0025 | Question | CLOSED | Claude Code | Architecture lead | Supervisor installed and verified in dry-run; NOT enabled | TASK-0010 |
| MSG-0026 | Record | CLOSED | Claude Code | Architecture lead | **Supervisor ENABLED**; acceptEdits + version-controlled deny list; no bypassPermissions | TASK-0010 |
| MSG-0027 | Decision | DECIDED | Architecture lead | Claude Code | TASK-0003 authorized and marked READY; line-ending normalization only | TASK-0003 |
| MSG-0028 | Record | DECIDED | Claude Code | Architecture lead | TASK-0003 implemented, NOT complete; decisions resolved by MSG-0030 | TASK-0003, TASK-0010 |
| MSG-0029 | Record | CLOSED | Claude Code | Architecture lead | Supervisor start path diagnosed and fixed; first launch PROVEN | TASK-0010 |
| MSG-0030 | Question | DECIDED | Architecture lead | Claude Code | Option B authorized: `git checkout -- "*.md"` | TASK-0003 |
| MSG-0031 | Record | DECIDED | Claude Code | Architecture lead | TASK-0003 COMPLETE; CRLF residue 150 -> 0 | TASK-0003 |
| MSG-0032 | Record | CREATED — smoke test PASSED | Claude Code | Architecture lead | End-to-end Supervisor evidence; two findings requested rulings | TASK-0011 |
| MSG-0033 (a) | Directive | DECIDED | Architecture lead | Claude Code | TASK-0011 smoke-test diagnosis/correction | TASK-0011 |
| MSG-0033 (b) | Directive | DECIDED | Architecture lead | Claude Code | TASK-0011 retry correction; duplicate historical number | TASK-0011, TASK-0010 |
| MSG-0034 | Record | CLOSED | Claude Code | Architecture lead | Informational: execution-path diagnosis; smoke test passed; closure authorized by MSG-0041 | TASK-0011, TASK-0016 |
| MSG-0035 | Decision | DECIDED | Architecture lead | Claude Code | BLK-0001/0004 resolved; COMMS numbering-allocation convention approved | TASK-0013 |
| MSG-0036 | Record | CREATED — both decisions applied | Claude Code | Architecture lead | TASK-0013 execution evidence; BLK-0005 index row needs a ruling (§6) | TASK-0013 |
| MSG-0037 | Decision | DECIDED | Architecture lead | Claude Code | **BLK-0005 index reconciliation authorized**; underlying record unchanged | TASK-0014 |
| MSG-0038 | Record | CREATED — authorization applied | Claude Code | Architecture lead | TASK-0014 execution evidence; BLK-0005 row added; **no decision requested** | TASK-0014 |
| MSG-0039 (a) | Decision | DECIDED | Architecture lead | Claude Code | **Discoveries-index reconciliation authorized**; duplicate number, non-conflicting | TASK-0015 |
| MSG-0039 (b) | Decision | DECIDED | Architecture lead | Claude Code | Same authorization restated; duplicate number, non-conflicting — both satisfied | TASK-0015 |
| MSG-0040 | Record | CREATED — authorization applied | Claude Code | Architecture lead | TASK-0015 execution evidence; index 3 rows -> 9; **no decision requested** | TASK-0015 |
| MSG-0041 | Decision | DECIDED | Architecture lead | Claude Code | Close resolved MSG-0034 informational record; applied by TASK-0016, see MSG-0042 | TASK-0016 |
| MSG-0042 | Record | CREATED — closure verified | Claude Code | Architecture lead | TASK-0016 execution evidence; MSG-0034 CLOSED in record and register; **no decision requested** | TASK-0016 |
| MSG-0043 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0017 AUTHORIZED** — correct the stale-heartbeat defect; schedule, gates and permissions unchanged | TASK-0017 |
| MSG-0044 | Record | CLOSED | Claude Code | Architecture lead | **TASK-0017 authorized in MSG-0043 but absent from the queue**, so the supervisor could never select it. Queue reconciled; structural finding recorded | TASK-0017 |
| MSG-0046 (a) / (b) | Decision | DECIDED | Architecture lead | Claude Code | Option A: operator runs the test once; no permission expansion. **Duplicate number, non-conflicting** — two files, same ruling; registered as (a)/(b) by TASK-0019 and neither renumbered, per MSG-0035 decision 2 | TASK-0017 |
| MSG-0047 | Record | CLOSED | Claude Code | Architecture lead | **TASK-0017 verification: 36 passed, 0 failed.** Gate satisfied; task COMPLETE | TASK-0017 |
| MSG-0048 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0018 AUTHORIZED** — one real Supervisor-started run, observe RUNNER_RUNNING live; no manual trigger, no supervisor changes | TASK-0018 |
| MSG-0045 | Record | **CLOSED** — corrected 2026-08-21 by TASK-0019; the record file and the COMMS register both read CLOSED | Claude Code | Architecture lead | **TASK-0017 IMPLEMENTED but NOT COMPLETE.** Defect reproduced and corrected; the test suite **could not be run** — no allowlist entry permits executing a PowerShell script. Three options in §7. *Answered by MSG-0046 and discharged by MSG-0047; the status line in the record itself was not changed by TASK-0018, which had no authority over another message's record* | TASK-0017 |
| MSG-0049 | Record | CLOSED | Claude Code | Architecture lead | **TASK-0018 verification: `RUNNER_RUNNING` observed live during a supervisor-started run.** Gates 1, 2, 4 and 5 MET with quoted evidence; gate 3 (terminal heartbeat) is **structurally unobservable from inside the run it measures**. Three options in §6; (B) recommended | TASK-0018 |
| MSG-0050 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0019 AUTHORIZED and READY** — post-WP-0001 repository baseline audit; maintenance/audit only; queue reconciliation required before execution | TASK-0019 |
| MSG-0054 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0021 authorized — architecture definition ONLY** for the employee policy assistant; outside WP-0001; no implementation, no work package yet | TASK-0021 |
| MSG-0053 | Decision | DECIDED | Architecture lead | Claude Code | **C6 NOT AUTHORIZED / NOT REQUIRED** (option B proof adds execution with no requirement); **C7 no new product work package** pending a concrete objective | — |
| MSG-0052 | Decision | DECIDED | Architecture lead | Claude Code | **C1-C5 ruled.** C1 WP-0001 status COMPLETE; C2/C3 documentary supersessions; C4/C5 no action; **C6/C7 not self-authorized** | TASK-0019 |
| MSG-0055 | Record | CREATED — definition delivered | Claude Code | Architecture lead | **TASK-0021 execution record.** Architecture definition produced as `EPA-0001` (architecture), `EPA-0002` (proposed work package, gates, sequence), `EPA-0003` (**fourteen open decisions**). All eleven acceptance criteria met. **No implementation, no work package, no ADR, no downstream task authorized.** §5 requests the rulings; §7 records three observations needing no action | TASK-0021 |
| MSG-0056a | Decision | DECIDED | Architecture lead | Claude Code | **EPA decision ruling.** TASK-0021 accepted as a complete architecture-definition task. Ten decisions ruled: D2 hybrid retrieval, D4 uniform abstention, D5 layered grounding gate (fail closed), D6 empirical normalization with the final rule in an ADR, **D8 external inference prohibited by default**, **D9 separate service outside the kernel** (ADR-0015 does not automatically govern it), D10 single-shot, D11 no historical questions in release 1, D12 grounded-answer contract promoted to an ADR, D14 text-native only. **D1, D3, D7, D13 escalated — the repository lacks the organizational authority to settle them.** No work package, no implementation task, no ADR, no provider selection authorized | 2026-08-21 |
| MSG-0056b | Decision | DECIDED | Architecture lead | Claude Code | **Employee policy assistant decisions — the four escalated by MSG-0056a, resolved from organizational authority supplied to the lead.** D1: English is the authoritative policy language, Arabic an approved translation; English governs on divergence and the discrepancy is flagged; citations always resolve to English. D3: only privileged users may place documents in the governed flow, upload does not confer authority, the creator must not be sole approver, only approved/published documents are authoritative. D7: session retention by default, administrator-configurable, storage minimized, retained content readable only by the asker. D13: configurable identity modes — Microsoft 365/Entra ID, existing AD/enterprise integration, and optional unauthenticated access for explicitly disclosable information. **No implementation authorized.** Shares a number with MSG-0056a; complementary, not contradictory | 2026-08-21 |
| MSG-0057 | Record + decision request | **CLOSED** | Claude Code | Architecture lead | **Reconciliation of both MSG-0056 rulings.** All fourteen EPA-0003 decisions annotated inline with their source; register, ledger and status reconciled. Three findings need a lead decision before the work package is gated: **F1** the D1 ruling permits answer-time Arabic generation that EPA-0003 recommended prohibiting, so the D5 grounding gate must do cross-language entailment — scope and fallback undefined; **F2** unauthenticated access has zero supporting authority in accepted docs and names a classification value no spec enumerates (recommend deferring); **F3** AD integration must terminate at an OIDC/OAuth2 boundary or ADR-0007 is contradicted. **F4** records a fourth number collision. No task marked READY | 2026-08-21 |
| MSG-0058 | Decision | DECIDED | Architecture lead | Claude Code | **Rules the three MSG-0057 findings, all as recommended.** F1 cross-language grounding is **in scope and fail-closed** — if the Arabic gate fails the system **abstains**, never silently falling back to English or presenting an unofficial rendering as policy; the Arabic bar is evaluated separately under SPEC-0020. F2 unauthenticated access is **deferred** from the first release; no new trust boundary or classification is introduced. F3 enterprise directory integration **must terminate at the OIDC/OAuth2 boundary** of ADR-0007; direct LDAP/Kerberos implementation is not authorized. F4 preserve the MSG-0056a/b distinction and do not rename historical records. **Gate ruling:** findings sufficiently resolved to proceed to a work-package authorization task; implementation still prohibited | 2026-08-21 |
| MSG-0059 | Decision | DECIDED | Architecture lead | Claude Code | **TASK-0022 authorized** as the next architecture/work-package definition task. May define scope, gates, acceptance criteria, dependencies, security checkpoints, and the implementation task sequence. **Does not authorize** implementation, provider/model selection, runtime changes, deployment, new permissions, or Supervisor changes, and **no implementation task may be marked READY**. Requires TASK-0022 to be **the single READY task on the board** before the Supervisor may execute it, and the Lead must accept its output before implementation is authorized | 2026-08-21 |
| MSG-0060 | Record | **OPEN** | Claude Code | Architecture lead | **Queue reconciliation for TASK-0022, and a fifth collision — this time on an executable task specification.** Two TASK-0022 files were committed; they agree on scope, authorization, forbidden list and acceptance gate, so no stop fired, but they differ in content (A carries stop conditions and the recommendations-only constraint; B carries a ten-item outcome list). The queue section carries the **union** and links both; neither was renamed, per MSG-0058 F4. TASK-0022 is now the single READY task | 2026-08-21 |
| MSG-0061 | Record | CREATED — awaiting acceptance | Claude Code | Architecture lead | **TASK-0022 execution record.** `EPA-0004` delivered as a **PROPOSED** work-package definition: thirteen gates (G1–G13; G12 identity and G13 retention/privacy are new), ten dependency-ordered tasks (T-0 IdP as an **operator** task, then T-A…T-I), five test tiers, T1–T11 threat coverage, and every required field of the work-package standard. All fourteen rulings and F1–F4 folded in; **F1's cross-language gate is made a protocol-level contract rule** so a failed Arabic gate abstains rather than falling back to English. **No implementation, no ADR created, no provider or stack selected, no work-package number allocated, no task marked READY.** §7 refers **seven decisions** to the Architecture Lead, led by *may a policy document be Restricted?* — the one D3 sub-question MSG-0056b does not reach | 2026-08-21 |
| MSG-0062 | Decision | DECIDED | Architecture lead | Claude Code | **EPA-0004 ACCEPTED** as the bounded work-package definition, and **all seven MSG-0061 §7 items ruled.** 7.1 allocate a **new** work package, no existing WP number repurposed, identifier allocated by register reconciliation. 7.2 create only the ADRs needed to make the architecture enforceable before production; numbers allocated by convention in the next architecture task. **7.3 T-D (grounded QA) precedes T-E (retrieval-time authorization)** — authorization must not be validated against an unproven answer path. 7.4 integrate an OIDC/OAuth2 provider, never implement one; selection and deployment stay operator actions. 7.5 **a bounded corpus survey is authorized before T-B**, discovery input only, no production ingestion. **7.6 Restricted documents are eligible for the corpus but NO retrieve-then-suppress design is permitted** — never retrieved unless the subject satisfies policy; denial fails closed without revealing existence, content, timing, or result-count. **7.7 ADR-0015 is not inherited** as the service stack; a dedicated task proposes it. **Acceptance does not authorize implementation** | 2026-08-21 |
| MSG-0063 | Decision | AUTHORIZED | Architecture lead | Claude Code | **TASK-0023 authorized** — reconcile EPA-0004 and the MSG-0062 rulings into the governed work-package records, resolve the WP numbering/register discrepancy, allocate the formal work-package identity, and define the dependency-ordered architecture tasks and ADR allocation. Seven acceptance criteria. **Forbidden:** implementation, provider/model/runtime selection, permission or security-boundary changes, Supervisor changes, and **marking any implementation task READY**. Must reconcile rather than duplicate existing records | 2026-08-21 |
| MSG-0064 | Record | **CLOSED** | Claude Code | Architecture lead | **TASK-0023 queue reconciliation.** MSG-0063 authorized TASK-0023 and the queue did not contain it — the **sixth** recurrence of the MSG-0044 gap. Reconciled as the single READY task after verifying prerequisites individually: TASK-0022 COMPLETE, MSG-0062 DECIDED, MSG-0063 AUTHORIZED, no OPEN blocker, no runner lock, one specification file. Verified by dry run. **TASK-0023 was not executed in this session**, per the operator instruction | 2026-08-21 |
| MSG-0065 | Record | **CLOSED** | Claude Code | Architecture lead | **State/record correction.** Today's records said the Windows `Schedule` service was stopped by the operator. **Verified this session: the service is Running (Automatic); the scheduled task `PCI-Execution-Supervisor` is Disabled.** `LastRun` 10:47:47Z matches the final scheduled cycle in the supervisor log; every cycle after it is at an irregular time and was manual. The functional conclusion held — no cycle fires unattended — but **the remedy differs: enable the task, do not restart the service.** The task was **not** enabled: that is a Supervisor scheduling change, forbidden by MSG-0063 and an operator decision. MSG-0064 corrected in place | 2026-08-21 |
| MSG-0066 | Record | CREATED — reconciliation applied | Claude Code | Architecture lead | **TASK-0023 execution record.** All seven MSG-0063 acceptance criteria met with evidence. **WP-0009 — Employee Policy Assistant** allocated as the next number unused in either register (`grep` verified before allocation); **historical WP-0001 and all eight planning entries untouched**; the planning list and the canonical directory reconciled in `work-packages.md` §0 with a standing allocation rule, closing **DISC-0010**. Six ADR surfaces converted into a dependency-ordered sequence but **deliberately unnumbered — no ADR created**. **T-0 separated as operator-only** (organizational choice plus a privileged deployment). T-D precedes T-E per §7.3; §7.6's no-retrieve-then-suppress rule bound into gates G3/G6; ADR-0015 not inherited per §7.7. **No implementation, no provider selection, no permission or Supervisor change, and no task marked READY** — the queue has zero READY tasks. §6 carries three open items, none blocking; §7.3 discloses one process error caught before it reached a commit | TASK-0023 |
| MSG-0067 | Decision | DECIDED | Architecture lead | Claude Code | **Rules the three carried-forward MSG-0066 items.** (1) **T-D testing is authorized only against synthetic or otherwise non-confidential documents** — no real or confidential corpus may enter the T-D path until T-E retrieval-time authorization is implemented **and verified**. (2) PR3: use the organization's existing Microsoft/AD identity infrastructure **through the established OIDC/OAuth2 boundary**; PCI builds no IdP and does not bypass ADR-0007 with LDAP/Kerberos; owner and date remain organizational scheduling data, and T-0 stays an operator prerequisite. (3) **WP-0009 sits beside the PLAN-WP-0001 planning entries** — it does not satisfy, supersede, rename, or renumber them; the planning list stays forward-looking and WP-0009 is the canonical delivered identity. No implementation authorized; no task marked READY | 2026-08-21 |
| MSG-0068a | Decision | AUTHORIZED | Architecture lead | Claude Code | **TASK-0024 (A-ADR) authorized** — `-task-0024-authorization-epa-adr-drafting.md`. Evaluate the six WP-0009 §7 ADR surfaces against accepted ADRs, create only the required new ADRs, preserve accepted ADRs, report evidence through COMMS. **If an unresolved architecture conflict is found, stop at that boundary rather than improvising.** Architecture/documentation only; ADR numbers allocated only if and when drafting requires them. **Queue gate: TASK-0024 must be the single READY task before execution** | 2026-08-21 |
| MSG-0068b | Decision | AUTHORIZED | Architecture lead | Claude Code | **TASK-0024 (A-ADR) authorized** — `-task-0024-a-adr-authorization.md`. Same authorization, with a ten-item constraint list to preserve — ADR-0007/OIDC identity boundary, T-D before T-E plus the synthetic/non-confidential interim limit, no retrieve-then-suppress, English authority with Arabic approved translation and cross-language fail-closed grounding, session-default retention with employee-only access, inference-locality boundary — and six acceptance criteria. **May not mark T-A or any implementation task READY.** Shares a number with MSG-0068a; complementary, not contradictory | 2026-08-21 |
| MSG-0069 | Record | **CLOSED** | Claude Code | Architecture lead | **TASK-0024 queue reconciliation, and a doubled collision.** MSG-0068 authorized TASK-0024 and the queue did not contain it — the **seventh** recurrence, and the first observed live: the Supervisor logged `NOOP: no READY task` at 19:07:18Z and 19:17:18Z while the task sat authorized. Reconciled as the single READY task after verifying prerequisites. **Two specification files and two authorization messages** exist for this one task; all four agree, so no stop fired, and the queue section carries the **union** of all four. Nothing renamed, per MSG-0058 F4 | 2026-08-21 |
| MSG-0070 | Record | CREATED — ADR set drafted | Claude Code | Architecture lead | **TASK-0024 execution record.** All eight acceptance criteria met. **ADR-0017…ADR-0022 drafted as PROPOSED** in `implementation/decisions/` for the six WP-0009 §7 surfaces; numbers allocated at drafting time and **verified collision-free against actual repository state** before anything was written. **No accepted ADR modified, duplicated, renamed, or deleted** — `git status --porcelain` shows no path under `docs/decisions/`. All six surfaces **tested independently** against the accepted ADR/SPEC set rather than inherited from WP-0009 §7; all six survived because each rests on a ruling that is stricter than or absent from the accepted set and lives only in a COMMS message, which is not an authority tier. **§4 records the counter-argument for surface 4**, the one close call, so it can be rejected cheaply. **ADR-0019 is knowingly incomplete** — D6's Arabic normalization rules are deferred to the empirical corpus evidence the ruling requires, rather than invented (§6.2). **§7 reports a finding**: the accepted classification standard's Restricted rule is **conditional** (*"unless specifically designed for that data class and protected accordingly"*), not absolute as EPA-0001 §7.3 and EPA-0004 §11.6 summarize it — which is what makes MSG-0062 §7.6 consistent with accepted authority rather than in conflict with it. **No implementation, no provider/model/stack selection, no permission or Supervisor change, no ADR accepted, and no task marked READY** | TASK-0024 |
| MSG-0071 | Decision | DECIDED | Architecture lead | Claude Code | **Accepts ADR-0017 through ADR-0022** as the required enforceable ADR set for WP-0009. ADR-0017 accepted with the entailment model and numeric thresholds **explicitly undecided** under SPEC-0020; ADR-0019 accepted as a **bounded** decision with **Arabic normalization rules deferred to empirical corpus evidence** and no invented rules authorized; ADR-0020 accepted including the **no-retrieve-then-suppress** boundary and fail-closed handling; ADR-0018, ADR-0021, ADR-0022 accepted. The set is **to be promoted to the accepted decision register by repository convention**, preserving traceability and introducing no provider/model/runtime selection. **A-SURVEY and A-STACK remain unauthorized; no implementation task is authorized or READY** | 2026-08-21 |
| MSG-0072 | Record | **CLOSED** | Claude Code | Architecture lead | **ADR promotion gap.** MSG-0071 accepted all six ADRs and directed promotion; only **ADR-0017** was promoted to `docs/decisions/`. ADR-0018…0022 exist solely as drafts. The ADR index and all six draft headers are reconciled to record the acceptance, and the ADR-0017 draft is marked RATIFIED per the ADR-0015 convention. **The promotion itself was not performed** — it is the act that confers authority, and no READY task authorizes it. **Pre-promotion verification passed** (MSG-0072): no provider/model/runtime selection leaked in, ADR-0019 invents no normalization rules, ADR numbering collision-free. One decision required: finish it yourself, or authorize a bounded task | 2026-08-21 |
| MSG-0073 | Decision | AUTHORIZED | Architecture lead | Claude Code | **TASK-0025 authorized** — promote **ADR-0018…ADR-0022** into the authoritative `docs/decisions/` register, preserving approved content, numbering, traceability and explicit non-decisions. **Do not** change decision substance, introduce provider/model/framework/runtime selections left open, alter ADR-0019 normalization (deferred to empirical corpus evidence), authorize implementation, or mark A-SURVEY/A-STACK/T-0 READY. **Every promoted ADR must be verified against its source before completion is reported.** Answers MSG-0072. **Claude may execute it once reconciled as READY** | 2026-08-21 |
| MSG-0075 | Record | CREATED — promotion applied | Claude Code | Architecture lead | **TASK-0025 execution record.** All five MSG-0073 acceptance criteria met with evidence. **ADR-0018…ADR-0022 promoted into `docs/decisions/`**, completing the WP-0009 set alongside the lead's own ADR-0017 promotion; the drafts are marked **RATIFIED** with their proposed text retained unchanged. **Verification is a `diff` per record and every hunk is in a header** — each promoted file is a byte copy of its draft with exactly two edits, the `Status` block and an added `Accepted by: Architecture Lead — MSG-0071` line, so **zero body differences**. **No accepted ADR modified** — `git status --porcelain` showed five new paths under `docs/decisions/` and no modified path there. **The three MSG-0071 conditions were re-checked in the promoted copies**, not inherited from MSG-0072's pre-promotion pass: no provider/model/framework/runtime selection (ADR-0022's ADR-0003 Ollama citation intact and still declining to elevate it), ADR-0019 still incomplete for production by design with **no rule invented**, ADR-0017's entailment model and thresholds still open under SPEC-0020. §6.2 records that the supervisor's heartbeat `head` lagged this session's verified HEAD by one commit and why that is **not** the BLK-0006 abort condition; §6.3 records a cosmetic line-wrapping difference in the lead's ADR-0017 promotion, proposing no correction. **No implementation, no provider/stack selection, no permission or Supervisor change, and no task marked READY** — A-SURVEY, A-STACK and T-0 stay unauthorized. **No decision requested** | TASK-0025 |
| MSG-0076 | Decision | AUTHORIZED | Architecture lead | Claude Code | **Next bounded EPA architecture task authorized**, with two outputs: **A-SURVEY** (bounded, read-only corpus survey — formats, language mix, scanned-document prevalence, classification/audience patterns, version/supersession, **no production ingestion**) and **A-STACK** (evaluate candidate service stacks against accepted contracts and the EPA ADR set; **recommend or record why selection stays open — do not select** a provider, framework, model, embedding technology, or runtime). **Preserve ADR-0017…0022 exactly; no implementation; no IdP selection; no retrieve-then-suppress; do not mark T-A/T-B/T-D/T-E/T-0 READY.** Executable only once reconciled as the single READY task | 2026-08-22 |
| MSG-0077 | Record | **CLOSED** 2026-08-22 — corpus supplied; the one organizational action it asked for is discharged and A-SURVEY is authorized as TASK-0027 | Claude Code | Architecture lead | **TASK-0026 queue reconciliation, and an unmet prerequisite.** Reconciled as the single READY task; **TASK-0026 is an id allocated here** since MSG-0076 assigns none. **A-SURVEY cannot run: PR5 — a reachable approved-policy corpus — does not exist in this repository**, verified by inspection and corroborated by WP-0009 §6.1, EPA-0004 §11.5 and MSG-0061 §7.5. A-STACK is fully executable. The queue section instructs A-SURVEY to stop and record rather than produce observations it cannot have made. **Supplying the corpus is an organizational action** | 2026-08-22 |
| MSG-0078 | Record | **CLOSED** 2026-08-22 — the corpus action it waited on is discharged; its PARTIAL result stands unchanged and correct | Claude Code | Architecture lead | **TASK-0026 execution record — PARTIAL by design.** **5 of 6 MSG-0076 criteria MET; criterion 1 UNMET on PR5**, each mapped to evidence in §2. **A-STACK COMPLETE** → **EPA-0005** (PROPOSED, selects nothing): the stack is **not one decision** — the fork is one runtime or two, framed not settled; **ADR-0020 §3.1/§4 make pre-filtered retrieval a functional requirement on the index engine**, disqualifying post-filter-only similarity search, since over-fetch-then-filter is the prohibited shape one layer down and *looks* like enforcement; **three local models are required, not one** (generation, embedding, **and ADR-0017's entailment layer**), multiplying the unmeasured PR6; **conversation and audit are separate stores**, a single log violating ADR-0021 §2/§4 invisibly; and **streaming an answer as it generates is incompatible** with a post-generation gate that may veto it. **Every selection left open** in §9.2 with the evidence that would close each; **seven questions are corpus-blocked**. WP-0009 §6.2's ADR question is **answered** (§9.3: not yet; if the pre-filtering rule warrants recording it belongs with ADR-0020) and **no ADR was created**. **A-SURVEY NOT PERFORMED** — PR5 **re-verified UNMET by inspection**, not inherited; **no figure, estimate, illustration, or substitute method produced**. **No accepted ADR modified** (`git diff --name-only docs/decisions/` empty); **no task marked READY**; no host touched. **The organizational corpus action of MSG-0077 remains outstanding** | TASK-0026 |
| MSG-0079 | Record | **CLOSED** 2026-08-22 — superseded by local delivery; the unreachable path is moot and its n=1 observation was adopted by MSG-0080 | Claude Code | Architecture lead | **Operator designated an A-SURVEY corpus; verified unreachable.** `\\10.1.27.220\LXBackup\plan.pdf`, designated approved/synthetic and explicitly **not** production/confidential — **the PR5 authority question is resolved by that designation**. **The path is not reachable:** host answers ICMP, **corrected 2026-08-22 — the path is **NFS, not SMB**. Re-tested: **NFS 2049 and portmapper 111 both closed**, *and* **Client for NFS is not installed** on this workstation (`NFS-Client` = `Available`, i.e. installable but absent; the `mount.exe` on PATH is Git Bash MSYS, not the NFS client). **Two independent blockers** — fixing either alone changes nothing. Installing the feature is a privileged host change nothing authorizes. **Not a credentials problem** — no TCP connection is established, so no authentication is attempted; credentials, drive mappings and share permissions cannot help while the transport is closed. Four causes fit the signature and cannot be distinguished from this machine, so none is asserted. **No workaround attempted, nothing copied, no observations produced.** A-SURVEY stays unexecutable and, since TASK-0026 is closed, **completing it needs a newly authorized task**. Also records that one PDF cannot answer four of A-SURVEY's five questions, which are distributional — offered so a future record states its sample size rather than reading as a corpus survey. See **BLK-0008** | 2026-08-22 |
| MSG-0080 | Decision | AUTHORIZED | Architecture lead | Claude Code | **Bounded A-SURVEY follow-up authorized** against the approved/synthetic corpus at `D:\Work\pci-corpus\plan.pdf`, **deliberately outside the Git repository** — it must remain outside and must not be copied, staged, or committed. **Survey scope is n=1:** document-level observations only (text-native vs scanned, language present, format characteristics, and classification/audience/version/supersession **where present**). For format mix, language prevalence, scanned prevalence, classification distribution and supersession prevalence **across a corpus**, record that **n=1 is insufficient and invent no estimates**. No production/confidential ingestion, no ADR modification, no invented Arabic normalization rules, no provider/model/framework/embedding/runtime selection, and **T-A/T-B/T-D/T-E/T-0 stay unauthorized**. Seven acceptance criteria; executable only once reconciled as the single READY task | 2026-08-22 |
| MSG-0081 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0027 queue reconciliation.** Reconciled as the single READY task; **id allocated here** since MSG-0080 assigns none. Corpus verified present and readable outside the repository (626.8 KB, `%PDF-1.7`). **BLK-0008 CLOSED** — the transport problem is gone: the file was supplied locally, so neither the NFS export nor the uninstalled Client for NFS matters any more. The queue section carries the n=1 boundary and an explicit warning that the PDF must never enter the working tree — **a hazard that already materialised once today**, when the file first landed inside the repo untracked and one `git add -A` from permanent history | 2026-08-22 |
| MSG-0082 | Record + decision request | **CLOSED** 2026-08-22 — answered by MSG-0083 option A | Claude Code | Architecture lead | **Structural finding: the corpus is where the runner may not read.** MSG-0080 requires it **outside** the repository; the unattended runner's permission boundary **is** the repository, and `runner-settings.json` grants no read beyond it. **Observed, not inferred** — BLK-0009 records a real runner whose read of `D:\Work\pci-corpus` was **denied and not routed around**. Options for the Lead/operator: **(A)** a narrow read permission for that path, **(B)** run TASK-0027 interactively, **(C)** supply an extraction. **Not options:** copy the PDF into the repo, edit the permission set unauthorized, or infer document properties from filename/size. Undecided is safe — the run stops and records, costing one cycle | 2026-08-22 |
| MSG-0083 | Decision | AUTHORIZED — applied, verified, and **exercised successfully by TASK-0027 on 2026-08-22** | Architecture lead | Claude Code | **Option A authorized**: grant the unattended runner the narrowest read-only access to `D:\Work\pci-corpus\` for TASK-0027. **No write, delete, move, stage, commit, or repository access; do not broaden to other external directories; the PDF stays outside the repository.** Applied to `runner-settings.json` via `additionalDirectories` plus an `Edit()` deny on that path — read-only by construction — and **verified empirically** before being relied on: a headless session with those settings read 641,807 bytes, `%PDF-1.7`, and cannot write. Three ineffective deny rules were rejected by the permission layer and removed rather than left giving false assurance. **BLK-0010 RESOLVED; TASK-0027 READY, no re-authorization needed** | 2026-08-22 |
| MSG-0084 | Record + two referrals | **OPEN** — informational; neither referral blocks anything | Claude Code | Architecture lead | **TASK-0027 execution record — A-SURVEY performed at n=1.** **7/7 acceptance criteria MET.** The PDF was **read in place** and never entered the repository, verified four ways. **Document-level:** 45 pages, PDF 1.7, Word 2016, uniform near-A4, tagged, unencrypted, **no active content of any kind**; **text-native** — 107,988 characters decoded from all 45 pages, 0 undecodable glyphs, only two image XObjects (a 103×92 logo and its mask) in the whole file, so **D14 would not reject it**; **English only** — **0 Arabic characters**, all five `ToUnicode` CMaps Basic-Latin-only, all simple fonts `WinAnsiEncoding` — but three *different* English locale tags (`en-US` catalog, `en-ZA`×1819, `en-GB`×46), so a document's own declared language is not a single reliable value; **no classification marking whatsoever**, and version/approval exist only as title-page prose (`Developed: June 2010` / `Revised: November 2024`) with blank date fields and a handwritten-signature convention — so **at least one real approved policy document carries none of ADR-0018's lifecycle metadata in-band**. **Three extraction hazards** that corrupt ingestion *silently* (§5): every page-1 glyph drawn twice with an `/Artifact` drop-shadow copy; `/Lang` property strings that read as body text; and a 67-character vector flow-chart page. **INSUFFICIENT at n=1, no estimates invented:** format mix, language prevalence, scanned prevalence, classification/audience distribution, version/supersession prevalence — **so D6 stays deferred and ADR-0019 was not amended.** **Referrals:** the designated corpus is **real, not synthetic**; and the runner has **no PDF tooling** | 2026-08-22 |
| MSG-0085 | Decision | AUTHORIZED | Architecture lead | Claude Code | **Arabic corpus follow-up authorized** against `D:\Work\pci-corpus\Arabic.pdf` as an approved/synthetic test document, to complement the completed n=1 English survey. Assess **Arabic text encoding/extraction, language declarations, font/`ToUnicode` behaviour, text-native vs scanned, and normalization/extraction hazards relevant to ADR-0019** and downstream retrieval. **Record as n=1 for the Arabic follow-up; do not generalize.** Uses the existing MSG-0083 read grant — **no permission broadening**. **Do not amend ADR-0019**; implications are evidence for a later decision only. Keep the file outside Git; no production ingestion, no implementation, no corpus-wide prevalence claims; accepted ADRs preserved. Requires a new bounded task rather than re-running the closed TASK-0027 | 2026-08-22 |
| MSG-0086 | Record | **CLOSED** 2026-08-22 — discharged by execution (MSG-0087) | Claude Code | Architecture lead | **TASK-0028 queue reconciliation.** Reconciled as the single READY task; **id allocated here** since MSG-0085 assigns none, and MSG-0085 §9 explicitly requires a new task rather than re-running closed TASK-0027. `Arabic.pdf` verified present (663.3 KB, `%PDF-1.5`) in the directory MSG-0083 already grants read-only — **no permission change needed or made**. Queue section carries the separate-n=1 rule (the two documents must not be combined into a "corpus"), the ADR-0019 no-amendment constraint, TASK-0027's three extraction hazards as things to **check for rather than expect**, the personal-data restraint, and the no-PDF-tooling limit | 2026-08-22 |
| MSG-0087 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0028 execution record — Arabic follow-up at n=1, 9/9 criteria.** Executed interactively on operator instruction. **The document is OCR-derived** — `/Producer` = **ABBYY FineReader PDF 15**, 31 image XObjects with CCITTFax/DCTDecode/ImageMask **plus** a 6,400-operator text layer — so under **D14 it is the class the accepted architecture rejects**. Arabic confirmed present (three embedded `SimplifiedArabic` subsets; 62 UTF-8 Arabic-range byte pairs) in a **mixed-script** file. **No `/Lang` declared anywhere** — the English document declared it 1,865 times — so language must be detected, not read. `ToUnicode` coverage incomplete (11 refs / 31 font dicts); **per-font attribution deliberately not reported** because byte-level regex gave a wrong answer. **All three English hazards checked for and absent** — different producer, different defect population. **ADR-0019 not amended**; implications recorded as evidence only. Two items referred: the OCR class question, and that the file is COVID-19 IAR guidance rather than Hadi Clinic policy | 2026-08-22 |
| MSG-0088 | Decision | AUTHORIZED | Architecture lead | Claude Code | **Arabic text-native follow-up authorized** against a new document outside the repo, specifically because MSG-0087 found the prior Arabic file OCR-derived and excluded by D14. Test **D14 admissibility before using it as evidence**; record as **n=1**; do not combine with the OCR or English documents; assess Arabic extraction, `/Lang`, fonts/`ToUnicode`, native-vs-scanned, mixed script and normalization hazards; **do not modify ADR-0019**; no tooling, no permission changes; reconcile a new task rather than re-running a closed one | 2026-08-22 |
| MSG-0089 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0029 execution record — text-native Arabic at n=1, 11/11.** **D14-ADMISSIBLE**: zero images, zero OCR markers, four subset-embedded CID fonts each with a `ToUnicode` CMap (209 mappings, 186 Arabic), text round-trips to real Arabic. **New reproducible hazard: the text is stored in VISUAL order** — proven by code-point identity between the reversed first run and the authored `/Title` tail; naive extraction yields fluent-looking but wholly reversed Arabic. Also **intra-word spaces from kerning** and **detached diacritics**. **`/Lang` declares `en` on an Arabic document** — across three surveys the declaration has now been correct once, absent once, and wrong once. **ADR-0019 untouched.** Referred: the file is ChatGPT/WeasyPrint-generated, so its hazards are its toolchain's and not the organization's; and `Arabic.pdf` was replaced rather than kept | 2026-08-22 |
| MSG-0090 | Record + decision request | **OPEN** | Claude Code | Architecture lead | **Evidence-gap analysis for ADR-0019.** Verified the corpus directory: one **real English** organizational policy and one **ChatGPT/WeasyPrint-generated Arabic** specimen — **representative approved organizational Arabic material is REQUIRED and NOT AVAILABLE**, and across three surveys the project has never seen real+Arabic+admissible. **Nothing currently authorized is blocked**; ADR-0019's amendment is, and through MSG-0056a D6 so is **production use**. The needed evidence is **observed orthographic variation in real approved documents** across the five classes ADR-0019 §6 deferred. **Key distinction:** the surveys evidenced the **extraction** layer, which follows from the producing toolchain, and say nothing about normalization, which follows from how the organization's authors write — treating one as the other would be the error. Also flags that if approved Arabic policy exists only as scans, D14 leaves no admissible Arabic corpus and the question becomes whether Arabic is in the first release at all. **No rule proposed, no sample threshold invented, no task marked READY, ADR-0019 untouched** | 2026-08-22 |
| MSG-0091 | Record + ruling | **OPEN** | Claude Code | Architecture lead | **Records the Lead's n=1 sufficiency ruling** — the Arabic n=1 documents are sufficient technical test evidence for current architecture work; representative organizational Arabic material is **not required for bounded testing**; MSG-0090's gap is **preserved for the eventual production normalization decision**; and no new Arabic corpus requirement is to be created unless an existing ADR requires it. **Conflict check: none** — ADR-0019 §6 and MSG-0056a D6 gate **production**, which the ruling leaves intact; had it declared n=1 sufficient to amend ADR-0019 it would have conflicted and this session would have stopped. **Next-task identification: there is no authorized architecture task remaining.** WP-0009 §6.2 defines exactly three — A-ADR (TASK-0024, accepted and promoted), A-STACK (TASK-0026, `EPA-0005` PROPOSED), A-SURVEY (TASK-0027/0028/0029, n=1 ×3) — all executed, with no fourth referenced anywhere and every AUTHORIZED message matched to an execution record. **The gate is now the Lead's ruling on EPA-0005.** No task invented, no ADR touched, no corpus requirement created | 2026-08-22 |
| MSG-0092 | Decision | DECIDED | Architecture lead | Claude Code | **EPA-0005 ACCEPTED** as the architecture evaluation record and the ruling record for the runtime seam. **§9.1's three constraints are settled**: authorization enforced **inside** the retrieval operation (no retrieve-then-filter or over-fetch-then-filter); capacity for **three** local model workloads (generation, multilingual embedding, entailment); conversation and audit storage **separate**, Restricted passages barred from ordinary logs/telemetry. **Approach C chosen** — two services along the C2/C6 seam, governed application layer for the authorization-critical path plus a document/inference worker behind an explicit contract; **the worker is not an authorization authority**, authorization stays in the governed layer before retrieval, SPEC-0008 preserved. **A stack-shape decision, not a runtime selection.** **No generic stack ADR** — declined explicitly. **Nine selection categories stay open**; ADR-0019's Arabic deferral unchanged and n=1 does not become production corpus evidence. Authorizes one bounded task to draft a minimum ADR-0020 clarification, **draft only** | 2026-08-22 |
| MSG-0093 | Record | **OPEN** | Claude Code | Architecture lead | **MSG-0092 applied; TASK-0030 reconciled as the single READY task.** EPA-0005's header now records its acceptance, Approach C, and the three settled constraints — **not promoted to `docs/`**, because MSG-0092 accepted it without authorizing promotion and promotion is the Lead's act. TASK-0030 drafts the minimum ADR-0020 clarification making the existing §3/§4 pre-constrained requirement explicit as an **engine-selection gate**, and **stops before applying it** — ADR-0020 is accepted and promoted, so editing it is the Lead's act. Records that "no amendment is needed" is a legitimate outcome. **No engine selected, no ADR touched, no implementation task READY** | 2026-08-22 |
| MSG-0094 | Record + decision request | **CLOSED** 2026-08-23 — **both referrals discharged**: the amendment convention was ruled by MSG-0095 (option (a), in place) and applied by TASK-0031; the criterion-scope conflict it flagged was fixed exactly as it recommended, TASK-0031's criterion 4 reading `git diff --name-only docs/decisions/` | Claude Code | Architecture lead | **TASK-0030 execution record — the ADR-0020 clarification is drafted and NOT applied.** **7/7 acceptance criteria MET**; documentary, so **no test count and none claimed**. Delivers **`ADR-0020-AMD-01`** in `implementation/decisions/` as **PROPOSED**; **`git diff --name-only docs/` empty** — the accepted, promoted ADR-0020 is **unmodified**, per MSG-0092 §5. **The "no amendment needed" outcome was tested against the accepted text and rejected on evidence**: §3.1/§4 state the *rule* unambiguously and are silent on two *consequences* — that it **disqualifies a retrieval engine** unable to constrain inside the query, and **what G3 inspects**, since a conforming and a retrieve-then-filter design return **byte-identical responses**. The amendment is **one 148-word insertion at the end of §4** plus an optional traceability row; **twelve candidate changes were considered and deliberately not made**, including §3's four points, §7 and *Deliberately not decided here* — because **a criterion is not a selection**. **Selects nothing**; all nine MSG-0092 §4 categories stay open; ADR-0017/0018/0019/0021/0022 untouched. **One convention question referred**: no precedent exists for amending an accepted ADR, so **no header change was drafted** rather than invent one. **`git fetch` remains off the allowlist** — recorded, not routed around | 2026-08-22 |
| MSG-0095 | Decision | **DECIDED — §5 action discharged** 2026-08-23 by TASK-0031 (MSG-0097), applying commit `a1be892` | Architecture lead | Claude Code | **ADR-0020 AMD-01 ACCEPTED as drafted, with the optional traceability row included.** The amendment is the minimum clarification making an already-settled confidentiality rule **operationally testable during engine selection**; it changes no substantive policy. Closes two interpretation gaps: that an engine unable to apply authorization constraints **inside** the retrieval operation is **disqualified**, and that **G3 must inspect the query issued to the engine**, not only the returned response. "Over-fetch-then-filter" is consistent with MSG-0092 §1(1), already settled. **Apply in place** with a concise header note naming AMD-01 and MSG-0095 — settling AMD-01 §8 as option **(a)**; **no superseding ADR**. **Selects no engine, index technology, model, framework, runtime or provider**, and authorizes no implementation beyond applying the amendment | 2026-08-22 |
| MSG-0097 | Record | **OPEN** | Claude Code | Architecture lead | **TASK-0031 execution record — AMD-01 is APPLIED.** **7/7 acceptance criteria MET**; documentary, so **no test count and none claimed**. Applying commit **`a1be892`**, tree clean. `git diff --name-only docs/decisions/` named **ADR-0020 and nothing else**, at **15 insertions / 0 deletions** — the header note was *added* rather than replacing a line, so every accepted semantic is **byte-identical** to the promoted copy. Each of the four new markers occurs **exactly once**, and the amendment was verified **absent three ways before** editing, because re-running would insert hunk 1 twice. **AMD-01 §8 settled as option (a)** — the repository's first amendment of an accepted ADR, and a precedent **only** for an additive clarification changing no substantive policy. **Selects nothing** — a search of the whole file for twenty product names returns none; all nine MSG-0092 §4 categories stay open; ADR-0019's Arabic deferral untouched; **no implementation task is READY**. Two runner limits recorded, not routed around: **`git fetch` and `python` are both off the allowlist** | 2026-08-23 |
| MSG-0096 | Record | **CLOSED** 2026-08-23 — discharged by execution (MSG-0097) | Claude Code | Architecture lead | **TASK-0031 reconciled as the single READY task** to apply AMD-01 in place, per MSG-0095 §5. Three edits and nothing else: hunk 1 at the end of ADR-0020 §4, hunk 2 as one Traceability row, and a concise header note naming AMD-01 and MSG-0095. **Wording is taken verbatim from AMD-01** rather than retyped, since transcription drift in an accepted ADR is the failure this must not introduce. The task edits an **accepted, promoted** ADR — authorized here and only here — and its recovery procedure warns that re-running against an already-amended file would insert the clause twice | 2026-08-23 |
| MSG-0074 | Record | **CLOSED** | Claude Code | Architecture lead | **TASK-0025 queue reconciliation.** Reconciled as the single READY task after verifying prerequisites individually. **No separate TASK-0025 specification file exists** — MSG-0073 plus the queue section are the specification, and the section records the promotion convention verified from the ADR-0015 precedent and the lead's own ADR-0017 promotion. **The gap did not recur this time** in one respect: the authorization arrived with no colliding sibling file. **The queue gap itself did recur** — the **eighth** occurrence. **Discharged by execution 2026-08-21** — TASK-0025 ran against this reconciliation and is COMPLETE (MSG-0075); because the repair landed before the next cycle, the task was already the single READY task when the run started and the Supervisor never idled on it | 2026-08-21 |
| MSG-0051 | Record | CREATED — audit complete | Claude Code | Architecture lead | **TASK-0019 baseline audit.** Six documentary corrections applied with their authorities quoted; four record classes verified already correct; **§C refers seven items for decision**, led by the accepted WP-0001 work package still reading `Status: Ready for implementation` — the stop condition fired and that correction was **not** made | TASK-0019 |

## Interruption and recovery protocol

Applies after any interruption: crash, network failure, machine restart, context loss, or a new Claude session.

### Checkpointing

Every task with status IN_PROGRESS **must** maintain a checkpoint at `implementation/operations/checkpoints/TASK-XXXX.md`, committed and pushed. A checkpoint identifies task ID, checkpoint number, current phase, completed operations, last verified operation, next operation, actual external/system state, Git commit/HEAD, and whether resumption is safe.

A checkpoint is written **after** an operation is verified, never in anticipation of one.

### Resuming

Before resuming anything:

- Read the task checkpoint.
- Read GitHub state — status, queue, blockers, communications, discoveries.
- Inspect actual system state directly.
- Inspect git state — `git status`, `git rev-parse HEAD origin/main`.
- **NEVER repeat an operation merely because the checkpoint says it was incomplete.** Observe actual state first.
- If documented and actual state disagree — **STOP**, document the discrepancy, and reconcile safely.
- Resume only from the first operation whose completion is not verified by direct observation.

### Idempotence

Prefer operations that are safe to repeat, and verify-before-acting on those that are not. Where an operation cannot be made idempotent — volume initialisation, migrations that are not checksum-guarded, credential rotation — the checkpoint must say so explicitly.

## Continuation rule

**Claude Code MUST NOT stop merely because one authorized subtask completed.** If the next task is READY, its prerequisites are satisfied, and no architecture or operator decision is required, Claude Code **MUST continue automatically** — documenting and pushing as it goes.

## Stop boundaries

Claude Code MUST stop, document, commit, push, and report when architecture approval is required; privileged operator action is required; a security boundary would be crossed; a prerequisite cannot be satisfied; documentation conflicts; actual state differs materially from recorded state; or an operation is destructive or irreversible and is not explicitly authorized.

---

## TASK-0017 — Supervisor heartbeat / unattended observability

**Priority:** 1 | **Status:** **COMPLETE** — authorized by MSG-0043; verified 36/36 under MSG-0046, recorded in MSG-0047 | **Owner:** Claude Code
**Depends on:** TASK-0016 (COMPLETE) | **Next eligible task:** none — nothing follows automatically
**Full specification:** [`TASK-0017-supervisor-heartbeat.md`](TASK-0017-supervisor-heartbeat.md)
**Checkpoint:** [`checkpoints/TASK-0017.md`](checkpoints/TASK-0017.md)

### Objective

Correct the heartbeat/state defect recorded in MSG-0042: `state/heartbeat.json` can still read
`NOOP :: no READY task` while a supervisor-started run is actually in progress, so unattended
execution looks idle from outside.

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | Architecture lead authorization | **MET** — MSG-0043 |
| P2 | TASK-0016 COMPLETE | MET |
| P3 | Supervisor installed and enabled | MET |

### Allowed actions

Inspect the heartbeat/state-writing path and its tests; reproduce the stale condition with a
harmless controlled run; correct the state updates so an observer can distinguish NOOP,
runner-started, runner-running, completion and failure; add or update focused tests; update
documentation and evidence; commit and push.

### Forbidden actions

- Changing the ten-minute schedule.
- Weakening the reconciliation or fail-closed gates.
- `--dangerously-skip-permissions` or any equivalent bypass; broadening deny rules.
- Changing product architecture or PCI runtime behaviour.
- Credentials, privilege escalation, or destructive repository/infrastructure operations.

### Verification requirements

A controlled test proves the heartbeat reflects a live supervisor-started run **and** its terminal
result. The focused test suite passes. Changes are committed and pushed with no unrelated
modifications.

### Documentation requirements

Update the supervisor README where behaviour changes, record the result in COMMS, and reconcile the
queue and status.

### Checkpoint requirements

Checkpoint after the defect is reproduced, and after the corrected behaviour is verified — each
recording observed state rather than intent.

### Stop conditions

If the fix would require changing the scheduling contract, the permissions model, or an architecture
decision outside this scope — **STOP** and record the exact conflict in COMMS rather than
improvising.

### Recovery procedure

The work is confined to the supervisor's own state-writing path and its tests. On resumption,
inspect `state/heartbeat.json` and the log directly before assuming any earlier edit took effect,
and re-run the suite rather than trusting a recorded pass.

---

## TASK-0018 — Live Supervisor heartbeat validation

**Priority:** 1 | **Status:** **COMPLETE** — all five gates MET; gate 3 met by external observation, recorded in the MSG-0049 addendum | **Owner:** Claude Code
**Depends on:** TASK-0017 (COMPLETE) | **Next eligible task:** none
**Full specification:** [`TASK-0018-live-supervisor-heartbeat-validation.md`](TASK-0018-live-supervisor-heartbeat-validation.md)
**Checkpoint:** [`checkpoints/TASK-0018.md`](checkpoints/TASK-0018.md)

> **Corrected 2026-08-21 by TASK-0019 (MSG-0050).** The status board above read **COMPLETE — 5 of 5
> gates MET** while this section's own status line and narrative read **IN_PROGRESS, four of five** —
> the same board-versus-narrative contradiction inside one file that TASK-0018 itself had to correct
> for TASK-0017, one task earlier. The board is right, on three agreeing authorities: the **MSG-0049
> addendum** records gate 3 met by continuous external observation (`COMPLETED  pid=0  active=False`
> at 21:03:36Z, lock released, exit code 0 carried into the reason line); **MSG-0049's status line**
> reads CLOSED / all five gates MET; and **MSG-0050** opens with "TASK-0018 is complete."
>
> Only the status line above was changed. The narrative below is left exactly as written — it was
> accurate on 2026-08-20, when gate 3 genuinely could not be observed from inside the run, and the
> sequence *observed four, could not observe the fifth, asked, closed it from outside* is the useful
> part of the record. This is an additive correction, as MSG-0050 requires.

### TASK-0018 — result: the heartbeat was observed live

**IN_PROGRESS, 2026-08-20.** The supervisor started this task on its own ten-minute cycle at
20:52:56Z, and while the runner was alive `state/heartbeat.json` read:

```json
{ "decision": "RUNNER_RUNNING", "reason": "TASK-0018 running for 210s",
  "runnerActive": true, "runnerPid": 7984, "head": "0c7d7b2...", "timestamp": "2026-08-20T20:56:26Z" }
```

Three samples 30s / 90s / 210s into the run show the value being **refreshed**, not written once.
Compare TASK-0017's own run, which reported `NOOP :: no READY task`, `runnerActive: false`, and a
two-commit-old `head` throughout. **All three symptoms are absent. The defect does not reproduce.**

| Gate | Verdict |
|---|---|
| 1. Launched by the enabled supervisor, not manually | **MET** — `CYCLE_START` 20:52:51Z, `RUNNER_STARTED pid=7984` 20:52:56Z; the logged prompt is verbatim this session's |
| 2. `RUNNER_RUNNING` with live pid and fresh timestamp | **MET** — three samples; log, lock, heartbeat and prompt all name pid 7984 |
| 3. Terminal heartbeat records the result; lock released | **NOT OBSERVED** — see below |
| 4. No stale `NOOP` persists across the live run | **MET** |
| 5. Evidence in COMMS; queue reconciled | **MET** — MSG-0049, this section, `checkpoints/TASK-0018.md`, `status/current.md` |

**Gate 3 is structurally unobservable from inside this run.** The supervisor writes the terminal
record *after* the runner exits (`supervisor.ps1` 468–485, 728–729), so a session cannot observe the
state its own exit produces. Nothing was modified to compensate: no supervisor change, no second run,
no test substituted for the observation. The evidence lands seconds after this session ends — durably
as a `COMPLETED :: task=TASK-0018` line in `logs/supervisor-20260820.log`, transiently in the
heartbeat, which the next cycle overwrites with `NOOP` about ten minutes later.

**Left IN_PROGRESS, deliberately — not COMPLETE and not READY.** Not COMPLETE because a gate is
unmet. Not READY because MSG-0048 authorizes **one** supervisor-started run, and a READY row would
start a second one that no message authorizes. MSG-0049 §6 asks for one decision and recommends
option (B): authorize a single further cycle, explicitly bounded, whose only work is reading the
previous run's terminal line and closing the task.

**One inference, flagged rather than buried.** Confirming pid 7984 with an external process listing
was refused by the runner's permission layer and **was not routed around**; the pid's liveness is
inferred from four agreeing artifacts and the advancing elapsed-time values. MSG-0049 §3.

### TASK-0018 — authorization (as issued)

### Objective

Close the one gap MSG-0047 named: the corrected heartbeat is proven by test but has never been
observed during a real supervisor-started run. Exercise it for real and record direct evidence that
`state/heartbeat.json` reports the live runner rather than a stale `NOOP`.

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | Architecture lead authorization | **MET** — MSG-0048 |
| P2 | TASK-0017 COMPLETE | MET — tests 36/36, MSG-0047 |
| P3 | Supervisor enabled on its ten-minute cadence | MET |

### Allowed actions

Run only the existing inspection/test commands needed for the observation; read
`state/heartbeat.json`, the supervisor logs, and the task's own execution state while running;
record timestamps and observed fields for the running and terminal states; create exactly one
verification COMMS record; update queue, checkpoint and status.

### Forbidden actions

- Changing supervisor code, configuration, permissions, scheduling, or runner behaviour.
- **Modifying the heartbeat implementation to make the observation pass.**
- **Manually triggering the supervisor** — gate 1 requires a scheduled launch.
- Broadening any allowlist or permission; creating unrelated tasks or architecture.
- Destructive commands, credentials, privilege escalation, force-push, reset, or clean.

### Verification requirements — all five gates

1. Launched by the enabled ten-minute supervisor, **not** manually.
2. While the runner is alive: `RUNNER_RUNNING`, a live `runnerPid`, and a recent timestamp.
3. The terminal heartbeat records the real result and the lock is released.
4. No stale `NOOP` persists across the live run.
5. Evidence recorded in COMMS and the queue reconciled.

### Documentation requirements

One execution/verification COMMS message, plus queue, checkpoint and status reconciliation.

### Checkpoint requirements

Checkpoint after the live observation is captured, and after the terminal state is confirmed —
recording what was observed, not what was expected.

### Stop conditions

STOP and report if the task was not supervisor-started, the heartbeat contradicts the live runner
state, the lock is corrupt or stale, the repository is not at `origin/main`, or progress would
require changing permissions, scheduling, or architecture.

### Recovery procedure

**If the observation fails, do not modify the supervisor to compensate.** Record the exact heartbeat
and log evidence, leave the task IN_PROGRESS with a checkpoint, and await direction. A heartbeat
that fails this test is information, not an inconvenience to be tuned away.

---

## TASK-0019 — Post-WP-0001 repository baseline audit

**Priority:** 1 | **Status:** **COMPLETE** — executed 2026-08-21; success gate met, evidence in MSG-0051 | **Owner:** Claude Code
**Depends on:** TASK-0018 (COMPLETE) | **Next eligible task:** none — nothing follows automatically
**Full specification:** [`TASK-0019-post-wp0001-baseline-audit.md`](TASK-0019-post-wp0001-baseline-audit.md)
**Checkpoint:** [`checkpoints/TASK-0019.md`](checkpoints/TASK-0019.md)

### TASK-0019 — result

**COMPLETE, 2026-08-21.** Started by the Supervisor on its scheduled cycle (`CYCLE_START` 06:37:13Z,
`FAST_FORWARDED` to `39eabdb`, `RUNNER_STARTED pid=22452 task=TASK-0019`), with the logged prompt
verbatim identical to the one this session received. Evidence: **MSG-0051**;
`checkpoints/TASK-0019.md`.

**The finding in one line: the substantive record is sound, and the indexes that point at it are
not.** Every blocker, discovery, message and task record carries a correct, unambiguous status. Six
*summary and index* locations did not — one of them contradicting itself inside a single file.

**Six corrections applied**, each traceable to an existing authoritative record and additive where
the superseded text was worth keeping:

| # | Location | Drift | Authority |
|---|---|---|---|
| A1 | `comms/README.md` | MSG-0046 (a), MSG-0046 (b) and MSG-0050 had **no register row** | the files; the ledger below; charter §5 |
| A2 | this file | Board said TASK-0018 COMPLETE, detail section said IN_PROGRESS | MSG-0049 addendum; MSG-0050 |
| A3 | this file's ledger | MSG-0045 shown OPEN; MSG-0046 shown as one row for two files | the record files; MSG-0035 decision 2 |
| A4 | `status/current.md` | Four messages shown **CLOSED** in a table sitting below the words "No message carries `Status: OPEN`" — plus four other stale statements | all 54 `MSG-*.md` status lines, read directly |
| A5 | `ROADMAP.md` §K | Supervisor described as "NOT installed and NOT enabled" | MSG-0024, MSG-0026, MSG-0047 |
| A6 | `reports/README.md` | WP-0001 shown "PARTIAL — see BLK-0001" | MSG-0022 / MSG-0023; BLK-0001 RESOLVED |
| A7 | `checkpoints/TASK-0018.md` | Ended with the task IN_PROGRESS | MSG-0049 addendum |

**Four record classes were verified already correct** and left alone: the blocker index (5/5), the
discovery index (9/9), the ADR set, and the message files' own statuses — **zero OPEN**, confirmed by
reading all 54 rather than trusting any index.

**The stop condition fired once, and was obeyed.** At the time of the audit,
`docs/program/work-packages/WP-0001-kernel-foundation.md`
still read `**Status:** Ready for implementation` while MSG-0022 / MSG-0023 declared WP-0001 COMPLETE.
**Resolved 2026-08-21 by MSG-0052 C1** — the work package now reads `Status: COMPLETE`.
That is a conflict between accepted work-package authority and current state, so the correction was
**deliberately not made** and is referred to the architecture lead as MSG-0051 §C1. Two further
governance files (`CLAUDE.md`, `ARCHITECTURE-LEAD-CONTEXT.md`) carry stale current-state claims and
were likewise reported rather than amended.

**Seven items are referred for decision in MSG-0051 §C. None was self-authorized**, including the
question of what work comes next: `ROADMAP.md` is WP-0001-scoped and discharged, and no post-WP-0001
roadmap exists.

### Authorization / scope

MSG-0050 is the existing Architecture Lead authorization. No duplicate task or authorization is created.
TASK-0019 is maintenance/audit only. It does not authorize new product architecture, implementation,
work packages, features, Supervisor changes, permissions, scheduling, credentials, infrastructure, or
host changes.

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | Architecture lead authorization | **MET** — MSG-0050 |
| P2 | TASK-0018 COMPLETE | **MET** — all five gates, MSG-0049 |

### Allowed actions

Read and compare the authoritative queue, ROADMAP, current status, COMMS register/messages, blocker
index/records, discovery index/records, checkpoints, and accepted ADR/work-package records. Classify
contradictions, stale status, missing index entries, duplicate identifiers, unresolved decision
requests, and references to completed work. Make only documentary/index corrections whose correct value
is directly established by existing authority and requires no architecture judgment. Create exactly one
TASK-0019 execution/audit COMMS record using the next valid message number. Update required queue,
status, and checkpoint documentation. Commit and push the result.

### Forbidden actions

- No product, database, compose, Supervisor code/configuration, scheduling, permission, credential,
  infrastructure, or host changes.
- No new architecture, ADR, work package, feature scope, or product task authorization.
- No destructive commands, repository reset/clean, force push, privilege escalation, or manual Supervisor trigger.
- Do not rewrite historical evidence merely because a later record superseded it; use additive corrections.
- Do not resolve substantive conflicts requiring Architecture Lead judgment; report them instead.

### Success gate

TASK-0019 is COMPLETE only when the audit covers all specified authoritative record classes, every
finding is classified as documentary drift/superseded history/architecture decision required, safe
corrections are evidenced, exactly one execution/audit COMMS record gives the Architecture Lead a
prioritized list of legitimate next actions without self-authorizing them, and the queue/result are
pushed to `origin/main`.

### Stop condition

If the audit finds a material conflict between accepted architecture/work-package authority and
current repository state, or any correction would require choosing between competing substantive
interpretations, STOP that correction, preserve the evidence, record the conflict in COMMS, and leave
the decision to the Architecture Lead.

### Recovery

Record progress in `implementation/operations/checkpoints/TASK-0019.md`. On restart, verify existing
commits and records before repeating any operation.

---

## TASK-0021 — Employee policy assistant: architecture definition

**Priority:** 1 | **Status:** **COMPLETE** — executed 2026-08-21; all eleven acceptance criteria met, evidence in MSG-0055 | **Owner:** Claude Code
**Depends on:** WP-0001 COMPLETE | **Next eligible task:** none — the work package itself is not authorized
**Full specification:** [`TASK-0021-employee-policy-assistant-architecture-definition.md`](TASK-0021-employee-policy-assistant-architecture-definition.md)
**Checkpoint:** [`checkpoints/TASK-0021.md`](checkpoints/TASK-0021.md)

### TASK-0021 — result

**COMPLETE, 2026-08-21.** Started by the Supervisor on its own cycle (`CYCLE_START` 11:05:47Z,
`RUNNER_STARTED pid=26508 task=TASK-0021`), with the logged prompt verbatim identical to the one the
session received. Evidence: **MSG-0055**; `checkpoints/TASK-0021.md`.

**Delivered** — four PROPOSED records under [`../architecture/`](../architecture/README.md), carrying
no architectural authority:

| File | Contents |
|---|---|
| `EPA-0001` | Architecture definition: scope boundary, document authority and lifecycle, components and data flow, the grounded-answer contract, bilingual behaviour, four-point authorization, threat model T1–T11, frontend responsibilities, audit and retention, operational architecture, conflict check against every accepted document it touches |
| `EPA-0002` | Proposed work package: scope/non-scope, data contracts, interfaces, gates G1–G11, prerequisites, task sequence T-A…T-I. **Written in the conditional; authorizes nothing** |
| `EPA-0003` | **Fourteen open architecture-lead decisions**, each with options, consequences and a recommendation |

**The finding in one line: the boundary is definable from existing authority, and the one genuine
authority vacuum is bilingual policy semantics.** A search of `docs/` and the Constitution for
language/Arabic/bilingual/localization returns a single relevant line — SPEC-0016's notification
templates. Everything else instantiates SPEC-0011/0013/0014/0015/0031, ADR-0016 and ADR-0003 under a
stricter contract; EPA-0001 §12 names the five things that are genuinely new so review effort lands
in the right place.

**No stop condition fired**, and all three were checked explicitly (MSG-0055 §6). Repository authority
was sufficient; **no accepted ADR conflicts** — three areas are *stricter* than the accepted baseline,
which under the authority hierarchy is not a contradiction, and is flagged as decision D12 anyway; and
no decision required inventing product scope, because none was made.

**Nothing was verified by execution.** This was a definition task and produced no runnable artifact,
so there is no test count to report. Its acceptance criteria are documentary and each is mapped to its
evidence in MSG-0055 §9.

**Three observations, none requesting action** (MSG-0055 §7): the work-package registers already
disagree about WP-0001/WP-0002 so **EPA-0002 allocates no number**; MSG-0054's proposed task order
builds the answer path before retrieval-time authorization, which was **followed as issued** with a
mitigation offered rather than a reordering made; and the COMMS register lag recurred — MSG-0054 had
no register row — and was corrected in the same commit.

### TASK-0021 — authorization (as issued)

### Objective

Turn the new product objective — an employee-facing assistant answering only from approved
organizational policy, in English and Arabic, with authoritative citations and fail-closed
abstention — into a decision-ready architecture specification. **Definition only.**

### Prerequisites

| ID | Prerequisite | State |
|---|---|---|
| P1 | Architecture lead authorization | **MET** — MSG-0054 |
| P2 | WP-0001 COMPLETE | MET — TASK-0009, MSG-0022 / MSG-0023 |
| P3 | This objective recognised as outside WP-0001 | MET — MSG-0054 ruling |

### Allowed actions

Define, at architecture level only: approved-document authority and lifecycle; ingestion,
normalization, chunking and provenance; retrieval and grounded QA with citation, abstention and
prompt-injection defence; English/Arabic behaviour including cross-language retrieval; authorization
and confidentiality enforced at retrieval time; auditability and retention; frontend
responsibilities; PCI kernel integration boundaries; required ADRs, threat decisions, data
contracts, interfaces and acceptance gates. Produce one architecture-definition COMMS record plus
the repository documentation that makes the next work package unambiguous.

### Forbidden actions

- **No product implementation** — no ingestion, retrieval, LLM, frontend, or schema migration code.
- No credentials, no external model-service registration.
- No supervisor configuration, scheduling, or permission changes.
- No change to accepted WP-0001 architecture, the `/data` boundary, or existing fail-closed controls.
- **No authorization of downstream implementation tasks** — the work package is not yet authorized.

### Verification requirements

All eleven acceptance criteria in the specification, notably: the objective is established as
**outside WP-0001**; the grounded-answer contract prevents unsupported policy claims and requires
authoritative citations; English and Arabic behaviour is explicit including cross-language
boundaries; authorization is enforced **at retrieval time, not only at the frontend**; audit and
retention are defined without exposing unnecessary sensitive content; prompt injection and
exfiltration through documents are addressed; and unresolved substantive choices are **recorded as
architecture-lead decisions rather than guessed**.

### Documentation requirements

One architecture-definition COMMS record; supporting repository documentation; queue, checkpoint and
status reconciliation. Commit and push before reporting completion.

### Checkpoint requirements

Checkpoint after the scope boundary and document-authority model are settled, and again before the
final record is committed — recording what was decided and what was deliberately left open.

### Stop conditions

Stop and record if repository authority is insufficient to define a safe boundary, if an accepted
ADR conflicts materially with the proposed architecture, or if a decision would require **inventing
product scope the objective did not supply**. Guessing scope is the failure mode this task most
needs to avoid: an architecture invented to fill a silence is harder to unpick than an open question.

### Recovery procedure

The work is documentary. On resumption, re-read MSG-0054 and the specification before continuing,
and check which sections already exist rather than rewriting them — a half-written architecture
record is easy to duplicate and hard to reconcile.

---

## TASK-0022 — Employee policy assistant: work-package definition

**Priority:** 1 | **Status:** **COMPLETE** (2026-08-21) — the deliverable is **PROPOSED** and awaits the Architecture Lead's acceptance | **Owner:** Claude Code
**Depends on:** TASK-0021 COMPLETE; MSG-0058 DECIDED (F1-F4); MSG-0059 (authorization)
**Delivered:** [`EPA-0004`](../architecture/EPA-0004-employee-policy-assistant-work-package-definition.md) | **Execution record:** [`MSG-0061`](../comms/MSG-0061-task-0022-execution-record.md)
**Next eligible task:** none — the Architecture Lead must accept this task's output before any implementation task is authorized

> **Executed 2026-08-21 by a supervisor-started session.** Both specification files were read; the
> requirements below are the union and every one is mapped to its evidence in MSG-0061 §2. The task
> produced **no test count**, as its verification section requires, and none is claimed. **No task was
> marked READY**, and seven decisions are referred to the lead in MSG-0061 §7. The requirements below
> are retained unchanged as the specification that was executed against.

**Full specification — TWO files, both authoritative, read BOTH:**

- [`TASK-0022-employee-policy-assistant-work-package-definition.md`](TASK-0022-employee-policy-assistant-work-package-definition.md) — referred to below as **spec A**
- [`TASK-0022-policy-assistant-work-package-definition.md`](TASK-0022-policy-assistant-work-package-definition.md) — referred to below as **spec B**

> **Why two.** Both were committed by the Architecture Lead on 2026-08-21 (`768300b`, `4fca7fe`) and
> **they agree** — same scope, same authorization, same forbidden list, same acceptance gate — so this
> is not a conflict and no stop condition fired. They are not identical in content: spec A carries the
> stop conditions and the "queue changes as recommendations only" constraint; spec B carries a finer
> ten-item outcome list. **The requirements below are the union of both.** Neither file was renamed,
> per the MSG-0058 F4 ruling that historical records are not renamed. Recorded in MSG-0060.

### Objective

Define the bounded post-WP-0001 work package for the Employee Policy Assistant, using the accepted EPA
architecture decisions (EPA-0001/0002/0003 as ruled by MSG-0056a/b) and the MSG-0058 findings.

**This is architecture/work-package definition only.** It authorizes no implementation.

### Required outputs — the union of both specifications

1. **Work-package scope and boundaries**, covering approved-document management, versioning and
   supersession; ingestion, normalization, provenance and retrieval contracts; grounded English/Arabic
   answering with citation and abstention gates; retrieval-time authorization and confidentiality;
   session-only default retention with configurable retention; authenticated identity via OIDC/OAuth2;
   auditability and security boundaries; the employee-facing frontend contract; and superseded-policy
   handling.
2. **Explicit implementation gates and acceptance criteria**, derived from EPA-0001/EPA-0002/EPA-0003
   and MSG-0056a/b and MSG-0058.
3. **A dependency-ordered implementation task sequence**, with security and architecture checkpoints
   and explicit architecture/operator boundaries.
4. **Test/acceptance gates and threat-model coverage.**
5. **Identification of any remaining genuine architecture decisions.** Do **not** invent decisions that
   are already settled — all fourteen EPA-0003 decisions are ruled, and F1-F4 are ruled by MSG-0058.
6. **A proposed work-package record and execution queue changes as recommendations only.**

### Binding architecture rulings (MSG-0058, MSG-0059)

- **English is authoritative**; Arabic is an approved translation/access language.
- **Cross-language grounding is in scope and fail-closed.** If the Arabic grounding gate fails the
  system must **abstain** — never silently fall back to English, never present an unofficial rendering
  as policy. The Arabic acceptance bar is evaluated separately under SPEC-0020.
- **Unauthenticated access is deferred** from the first release; first release requires authenticated
  identity. No new unauthenticated classification or trust boundary is introduced.
- **Enterprise directory integration terminates at the OIDC/OAuth2 boundary** required by ADR-0007.
  Entra ID, AD FS, or an OIDC/OAuth2 broker may front an existing directory. **Direct LDAP/Kerberos
  authentication implementation is not authorized.**
- **Only approved/published documents are authoritative sources.**
- **Session-only conversation retention is the default**, with configurable retention support.

### Forbidden

- No product or runtime implementation.
- No provider/model selection or external model registration.
- No changes to accepted ADRs.
- No new permissions, security boundaries, Supervisor behaviour, or scheduling changes.
- No credentials or external privileged operations.
- **No implementation task may be marked READY by this task** — queue changes are recommendations only.

### Verification

The definition is complete only when scope, boundaries, acceptance criteria, dependencies, security
gates, and the proposed implementation sequence are documented **and reconciled with the governing
architecture records**. Unresolved decisions must be stated explicitly rather than omitted.

Being documentary, this task produces no test count. Do not report a test result it cannot have; report
each required output against its evidence instead.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md` and this queue, and write the checkpoint. A completely new session
must be able to resume from the repository alone.

### Checkpoint

`implementation/operations/checkpoints/TASK-0022.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one — the TASK-0021 checkpoint recorded a push as successful before
it was attempted, and the push was then rejected (BLK-0006).

### Stop conditions

Stop and report through COMMS if repository authority materially conflicts, if a required architecture
decision is genuinely missing, or if completing the task would require implementation or an
unauthorized architecture change.

**Also stop if `origin/main` moves mid-run.** BLK-0006 is the precedent: the deliverable was pushed,
the Architecture Lead pushed concurrently, and the closeout push was rejected. Stopping was correct.
Record the starting HEAD in checkpoint 1 and re-check it before every push.

### Recovery procedure

The work is documentary. On resumption, re-read MSG-0058, MSG-0059, and **both** specification files
before continuing, and check which sections already exist rather than rewriting them — a half-written
architecture record is easy to duplicate and hard to reconcile.

---

## TASK-0023 — EPA work-package governance reconciliation

**Priority:** 1 | **Status:** **COMPLETE** — executed 2026-08-21; 7/7 acceptance criteria, evidence in MSG-0066 | **Owner:** Claude Code
**Depends on:** TASK-0022 COMPLETE; MSG-0062 DECIDED (EPA-0004 accepted, seven items ruled); MSG-0063 AUTHORIZED
**Delivered:** [`WP-0009 — Employee Policy Assistant`](../../docs/program/work-packages/WP-0009-employee-policy-assistant.md) | **Execution record:** [`MSG-0066`](../comms/MSG-0066-task-0023-execution-record.md)
**Next eligible task:** none — MSG-0063 reserves the next authorization to the Architecture Lead after this task is accepted
**Full specification:** [`TASK-0023-epa-work-package-reconciliation.md`](TASK-0023-epa-work-package-reconciliation.md)
**Checkpoint:** [`checkpoints/TASK-0023.md`](checkpoints/TASK-0023.md)

### TASK-0023 — result

**COMPLETE, 2026-08-21.** Executed by a supervisor-started session; `state/runner.lock` named
`TASK-0023`, pid 27400, acquired 18:04:59Z. Starting HEAD `ad3df56`, re-checked before the commit and
unmoved. Evidence: **MSG-0066**; `checkpoints/TASK-0023.md`.

**The finding in one line: the identifier was the whole difficulty, and it was a trap rather than a
gap.** `WP-0002` has no record in the canonical directory and looks free from a directory listing —
but the planning register has held it as "Repository and Engineering Platform" since it was written.
Allocating it would have produced two different work packages with one number. **WP-0009** is the next
number unused in *either* register, verified by `grep -rn "WP-0009\|WP-0010"` returning nothing before
allocation.

| Criterion (MSG-0063) | Verdict | Where |
|---|---|---|
| 1. EPA-0004 remains the accepted definition | **MET** | `WP-0009` header; EPA-0004 itself unmodified |
| 2. Register discrepancy reconciled, WP-0001 not repurposed | **MET** | `work-packages.md` §0; all eight planning entries verbatim |
| 3. Identifier recorded consistently | **MET** | Record file, register table, DISC-0010 resolution — three places agreeing |
| 4. Six ADRs → explicit sequence, no duplicates, no accepted ADR modified | **MET** | `WP-0009` §7; `docs/decisions/` still ends at ADR-0016 |
| 5. T-0 operator prerequisites separated | **MET** | `WP-0009` §6.1 |
| 6. Dependency ordered; only the next authorized task eligible for READY | **MET** | `WP-0009` §6.2/§6.3; **nothing marked READY** |
| 7. No implementation authorization implied | **MET** | `WP-0009` §9; status line reads NOT AUTHORIZED FOR IMPLEMENTATION |

**No test count is reported. The task is documentary and produces none** — its verification section
forbids claiming one.

**Two deliberate omissions.** **ADR numbers were not allocated**: MSG-0062 §7.2 and this queue section
both place allocation in the drafting task, so the six surfaces are ordered and justified but
unnumbered, with "next free is ADR-0017" recorded as an observation explicitly *not* an allocation.
**No task was marked READY**, including the three architecture tasks the deliverable defines.

**No stop condition fired, and all three were checked.** The authoritative records did not materially
conflict — the register disagreement is a *known, recorded* discrepancy this task was authorized to
reconcile, not a new one. The identifier was allocable without repurposing anything. And no decision
beyond MSG-0062/MSG-0063 was required: where one would have been — the T-D/T-E mitigation, PR3's owner,
which planning entries WP-0009 relates to — it was **carried forward as open rather than decided**
(MSG-0066 §6).

**One process error is disclosed in MSG-0066 §7.3**: the first write of the checkpoint file contained
checkpoints 2 and 3 in anticipation, including a fabricated commit SHA. It was corrected to checkpoint 1
only before anything was staged, so no fabricated value reached a commit. Recorded because the rule it
broke is one this queue has cited against a previous task.

> **One specification file this time**, and MSG-0062/MSG-0063 carry distinct numbers — verified on
> reconciliation. The TASK-0022 union treatment was needed because two files existed; it is not needed
> here. Read the specification **and** MSG-0062 and MSG-0063: the acceptance criteria below come from
> MSG-0063, and the rulings the task must apply come from MSG-0062.

### Objective

Reconcile the **accepted** EPA-0004 work-package definition and the MSG-0062 rulings into the
authoritative governance records. **Architecture and governance only — no implementation.**

### Required work (TASK-0023 specification)

1. Re-read MSG-0062, MSG-0063, EPA-0004, the work-package register, and the existing work-package
   records.
2. **Resolve the WP numbering/register discrepancy explicitly, preserving historical WP-0001** and the
   existing records.
3. Allocate and record the formal work-package identity using the repository's established convention,
   **without inventing or repurposing an existing identifier**.
4. Reconcile the six proposed ADR surfaces into an explicit architecture sequence, **creating no ADRs**
   unless separately authorized.
5. Record **T-0 as an operator-only prerequisite**, kept distinct from Claude-executable work.
6. Produce the dependency-ordered architecture/implementation gate sequence, with the next task
   **identified but not implicitly authorized**.
7. Reconcile COMMS, queue, status, and work-package records consistently.

### Acceptance criteria (MSG-0063)

1. EPA-0004 remains the accepted architecture/work-package definition.
2. The register/directory discrepancy is explicitly reconciled **without repurposing historical WP-0001**.
3. The formal work-package identifier is recorded consistently in the authoritative work-package records.
4. The six ADR recommendations become an explicit proposed/required ADR sequence, **no duplicates and
   no modification of accepted ADRs**.
5. T-0 operator prerequisites, including authenticated IdP deployment, are clearly separated from
   Claude-executable work.
6. The resulting sequence is dependency ordered, with **only the next authorized architecture task
   eligible for READY after queue reconciliation**.
7. **No implementation authorization is implied.**

### Rulings this task must apply (MSG-0062)

- **7.1** — allocate as a **new** work package; **no existing WP number is repurposed**. The identifier
  is allocated by the register reconciliation before implementation authorization.
- **7.2** — create only the ADRs needed to make the accepted architecture enforceable before production:
  the grounded-answer contract, and any new service-boundary/security decisions not already covered.
  **Numbers allocated by repository convention during the next architecture task** — this task defines
  the sequence, it does not create the ADRs.
- **7.3** — **T-D (grounded QA) precedes T-E (retrieval-time authorization).** Authorization controls
  must not be validated against an unproven answer path. Security review remains a gate on the complete
  path before release.
- **7.4** — first release requires an authenticated OIDC/OAuth2 provider; **the platform integrates,
  it does not implement one**. Provider selection and privileged deployment are operator/organization
  actions that must be established before the identity-dependent gates.
- **7.5** — a **bounded corpus survey is authorized before T-B**, as a discovery/architecture input
  only: formats, language mix, scanned-document prevalence, classification/audience patterns,
  version and supersession characteristics. It **must not ingest production content or bypass approval
  controls**.
- **7.6** — Restricted documents **are eligible** for the governed corpus, but **no retrieve-then-suppress
  design is permitted**. A Restricted document is never retrieved into an employee request unless the
  authenticated subject satisfies its authorization policy, and denial must **fail closed without
  revealing existence, content, timing, or result-count**.
- **7.7** — **ADR-0015 is not inherited** as the service stack. The service stays outside the kernel
  boundary and uses accepted platform contracts; a dedicated architecture task proposes the concrete
  stack. **No provider, framework, model, embedding technology, or runtime is selected.**

### Forbidden

- No product or runtime implementation.
- No provider, model, embedding, framework, or runtime selection.
- No permission or security-boundary changes.
- No Supervisor behaviour or scheduling changes.
- **No creation or modification of accepted ADRs.**
- No operator-only action, credential access, or privileged host operation.
- **Do not mark any downstream implementation task READY.**

### Verification

Complete only when the authoritative work-package records, COMMS, queue, and status **agree**; the
formal work-package identity is established **without historical collision**; the ADR sequence is
explicit; T-0 is identified as operator-only; and no implementation authorization has been implied.

Being documentary, this task produces **no test count**. Do not report a test result it cannot have —
map each acceptance criterion to re-readable evidence instead.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and the work-package records, and write the checkpoint.
A completely new session must be able to resume from the repository alone.

### Checkpoint

`implementation/operations/checkpoints/TASK-0023.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one.

### Stop conditions

Stop and record COMMS if the authoritative records materially conflict, if a work-package identifier
**cannot be allocated without repurposing an existing identifier**, or if completing the task would
require an architecture decision beyond MSG-0062/MSG-0063.

**Also stop if `origin/main` moves mid-run.** BLK-0006 is the precedent, and the Architecture Lead has
pushed concurrently during three of the last four tasks. Record the starting HEAD in checkpoint 1 and
re-check it before every push.

> **Known runner limit, not a defect to route around.** `git fetch` is off the runner allowlist, so a
> mid-run move by the lead is detectable only when a push is rejected. Both TASK-0022 and BLK-0006
> record this. Do not attempt to work around it; record it and stop if a push is rejected.

### Recovery procedure

The work is documentary. On resumption, re-read MSG-0062, MSG-0063, EPA-0004 and the specification,
and check which records already exist rather than rewriting them — governance records are easy to
duplicate and hard to reconcile, which is the exact failure this task exists to fix.

---

## TASK-0024 — A-ADR: draft the required Employee Policy Assistant ADR set

### Result — COMPLETE, 2026-08-21

**Six PROPOSED ADR drafts delivered: ADR-0017…ADR-0022** in `implementation/decisions/`, one per
WP-0009 §7 surface. All eight acceptance criteria met with evidence in **MSG-0070** §2. Checkpoints 1–3
in [`checkpoints/TASK-0024.md`](checkpoints/TASK-0024.md).

**No stop condition fired.** The task's stop conditions were checked, not assumed: no unresolved
architecture conflict was found; `origin/main` did not move (starting HEAD `850a9b1` re-verified
immediately before the push); no required decision was missing; and nothing in the work required
implementation or an unauthorized architecture change. **MSG-0070 §7 records the one thing that looked
like a conflict and was not** — the accepted classification standard's Restricted rule is conditional
rather than absolute, which *removes* an apparent tension with MSG-0062 §7.6 instead of creating one.

**The specification below is the authorization as issued, retained unchanged.**

---

**Priority:** 1 | **Status:** **COMPLETE** — see *Result* above | **Owner:** Claude Code
**Depends on:** TASK-0023 COMPLETE; MSG-0062 DECIDED; MSG-0067 DECIDED; WP-0009 defined and not implementation-authorized
**Next eligible task:** none — T-A remains unauthorized and this task may not authorize it
**Work package:** WP-0009 — Employee Policy Assistant | **Architecture task:** A-ADR

**Specification — FOUR documents, all authoritative, read ALL of them:**

- [`TASK-0024-epa-adr-drafting.md`](TASK-0024-epa-adr-drafting.md) — **spec A**
- [`TASK-0024-a-adr.md`](TASK-0024-a-adr.md) — **spec B**
- [`MSG-0068-task-0024-authorization-epa-adr-drafting.md`](../comms/MSG-0068-task-0024-authorization-epa-adr-drafting.md) — **MSG-0068a**
- [`MSG-0068-task-0024-a-adr-authorization.md`](../comms/MSG-0068-task-0024-a-adr-authorization.md) — **MSG-0068b**

> **Why four.** Two specification files and two authorization messages were committed for this one
> task. **They agree** — same objective, same six surfaces, same forbidden list, same rule that ADR
> numbers are allocated at drafting time from the repository's actual state — so no stop condition
> fired. They differ in content, so **everything below is the union.** Nothing was renamed, per
> MSG-0058 F4. See MSG-0069.

### Objective

Draft the **minimal** set of new ADRs required to make the accepted WP-0009 architecture enforceable
before implementation, **without duplicating or modifying accepted ADRs**.

### Required inputs

WP-0009; EPA-0004 as accepted by MSG-0062; the MSG-0067 rulings; the existing accepted ADR register;
and the repository's ADR numbering convention.

### Required work

1. **Identify accepted ADRs that already govern the relevant boundaries** — reuse before creating.
2. Determine the minimal required new ADR surfaces from **WP-0009 §7.2**, judged against MSG-0062 §7.2.
3. **Decide, per surface, whether a new ADR is genuinely required, and document the rationale either
   way.** Evidence must identify every ADR created **or explicitly explain why a surface needs none**.
4. Draft the required ADRs, allocating numbers **at drafting time** by repository convention, verified
   collision-free against the actual ADR state.
5. **Trace every new decision to accepted authority.**
6. **Record any genuine unresolved architecture issue rather than inventing a ruling.**
7. Create one execution COMMS record and reconcile the queue and status evidence.

### The six candidate surfaces (WP-0009 §7)

Grounded Answer Contract · Approved Document Authority and Lifecycle · Bilingual Policy Semantics
(English/Arabic) · Retrieval Projection and Index Boundary · Employee Question Privacy and Retention ·
Inference Locality and Provider Boundary.

**These are proposed surfaces, not pre-authorized ADR numbers.** The final allocation comes from the
repository's actual ADR state.

### Boundaries that must be preserved (MSG-0068b, MSG-0067, MSG-0062)

- **ADR-0007 / OIDC-OAuth2 identity boundary** — PCI integrates an identity provider and never builds
  one; **no direct LDAP/Kerberos**, per MSG-0067 §2.
- **T-D precedes T-E**, and the MSG-0067 §1 interim constraint holds: **T-D testing only against
  synthetic or otherwise non-confidential documents.** No real or confidential corpus may enter the
  T-D path until T-E retrieval-time authorization is implemented **and verified**.
- **No retrieve-then-suppress.** A Restricted document is never retrieved into a request unless the
  authenticated subject satisfies its policy; denial fails closed without revealing existence,
  content, timing, or result-count.
- **English authority, Arabic approved translation**, with cross-language grounding **fail-closed** —
  a failed Arabic gate abstains.
- **Session-default question retention, employee-only conversation access.**
- **Inference locality / provider boundary** — external inference prohibited by default.

### Forbidden

- No implementation, and no product or runtime work of any kind.
- No provider, model, embedding, framework, runtime, or stack selection.
- **No production corpus ingestion.**
- No permission or security-boundary changes.
- No Supervisor behaviour or scheduling changes.
- No operator-only or privileged action.
- **Do not modify accepted ADRs. Do not create duplicate ADRs.**
- **Do not mark T-A, T-B, T-C, T-D, T-E, or any other implementation task READY.**

### Acceptance criteria (union of spec A, spec B, MSG-0068b)

1. Existing accepted ADRs are identified, verified, and **neither duplicated nor modified**.
2. The minimal new ADR set is **justified against WP-0009 §7.2**.
3. New ADR numbers follow repository convention and are **collision-free** against existing ADRs.
4. Each drafted ADR is **traceable to accepted authority** (EPA-0004 / WP-0009 / MSG-0062 / MSG-0067).
5. Draft ADRs are internally consistent with MSG-0062, MSG-0067, EPA-0004, and WP-0009.
6. **No implementation is authorized or performed**, and none is implied.
7. Evidence identifies **every ADR created, or explains why a surface needs no new ADR**.
8. The resulting ADR set is committed and recorded in COMMS.

### Verification

Being documentary, this task produces **no test count**. Do not report a test result it cannot have —
map each acceptance criterion to re-readable evidence instead.

**Check ADR number collisions against the actual repository state**, not against a remembered list.
Four message numbers and two task specifications have collided in this project already; an ADR
collision would be worse, because ADRs are cited as authority.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and WP-0009's architecture-task status, and write the
checkpoint. A completely new session must be able to resume from the repository alone.

### Checkpoint

`implementation/operations/checkpoints/TASK-0024.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one.

### Stop conditions

**Stop and report through COMMS if an architecture conflict is discovered that cannot be resolved from
existing authority. Do not improvise** (spec A; MSG-0068a). Stop also if a required decision is
genuinely missing, or if completing the task would require implementation or an unauthorized
architecture change.

**Also stop if `origin/main` moves mid-run.** BLK-0006 is the precedent and the Architecture Lead has
pushed concurrently during several recent tasks. Record the starting HEAD in checkpoint 1 and re-check
it before every push.

> **Known runner limit.** `git fetch` is off the runner allowlist, so a mid-run move is detectable only
> when a push is rejected. Record it and stop; do not route around it.

### Recovery procedure

The work is documentary. On resumption, re-read MSG-0067, **both** MSG-0068 files, **both**
specification files, and WP-0009 §7, then check which ADRs already exist before drafting anything —
a half-written ADR set is easy to duplicate and hard to reconcile.

---

## TASK-0025 — promote ADR-0018 … ADR-0022 into the accepted decision register

**Priority:** 1 | **Status:** **READY** | **Owner:** Claude Code
**Depends on:** TASK-0024 COMPLETE; MSG-0071 DECIDED (all six ADRs accepted); MSG-0073 AUTHORIZED
**Next eligible task:** none — A-SURVEY and A-STACK remain unauthorized
**Work package:** WP-0009 — Employee Policy Assistant

**Specification:** [`MSG-0073-task-0025-adr-promotion-authorization.md`](../comms/MSG-0073-task-0025-adr-promotion-authorization.md)
**plus this section.** There is **no separate `TASK-0025-*.md` file** — unusually for this queue, and
deliberately noted so a runner does not go looking for one or assume something is missing.

### Objective

Promote **ADR-0018, ADR-0019, ADR-0020, ADR-0021 and ADR-0022** from their accepted drafts in
`implementation/decisions/` into `docs/decisions/`, the authoritative register, **preserving approved
content, numbering, traceability, and explicit non-decisions**.

**ADR-0017 is already promoted** — by the Architecture Lead, in `d9c4524`. Do not re-promote it, do not
alter it, and do not treat its presence as an error.

### The established convention — follow it exactly

Verified from the ADR-0015 precedent and the lead's own ADR-0017 promotion:

**1. The promoted copy** at `docs/decisions/ADR-00NN-<same-slug>.md`:

- **same filename** as the draft — the slug does not change;
- `**Status:** **ACCEPTED** — promoted from `implementation/decisions/ADR-00NN-<slug>.md` (PROPOSED) by MSG-0071`;
- add an `**Accepted by:** Architecture Lead — MSG-0071` line after `**Proposed by:**`;
- **every other header line and the entire body carried over unchanged in substance.**

**2. The draft copy** at `implementation/decisions/ADR-00NN-<slug>.md`:

- `**Status:** **RATIFIED** 2026-08-21 — accepted by MSG-0071 and promoted to `docs/decisions/…`, which is the authoritative copy. The proposed text below is retained unchanged as the historical record.`
- **the proposed text itself is retained unchanged.** Do not edit the body.

**3. The index** `implementation/decisions/README.md`: change each row from *awaiting promotion* to
**promoted**, naming the accepted path — matching the ADR-0017 row already there.

### Constraints (MSG-0073)

- **Do not change the substance of the accepted ADR decisions.**
- **Do not introduce provider, model, framework, runtime, or implementation selections that remain
  deliberately open.** ADR-0022 cites Ollama from ADR-0003 and explicitly declines to select it —
  that wording is load-bearing and must survive promotion intact.
- **Do not alter ADR-0019's normalization rules.** They stay deferred to empirical corpus evidence,
  and no invented rule is authorized. ADR-0019 must still say it is incomplete for production by
  design.
- **Do not authorize implementation.**
- **Do not mark A-SURVEY, A-STACK, or T-0 READY.**
- **Verify every promoted ADR against its source before reporting completion.**

### Acceptance criteria (MSG-0073)

1. ADR-0018, ADR-0019, ADR-0020, ADR-0021 and ADR-0022 each exist in `docs/decisions/` using the
   repository's established ADR convention.
2. Promoted records preserve the accepted decision content and traceability.
3. No implementation authorization is introduced.
4. COMMS and queue records are updated consistently.
5. **TASK-0025 is reported COMPLETE only after repository verification.**

### Verification — and what "verify against source" must mean here

A `diff` between each promoted copy and its draft should show **only** the intended header changes:
the `Status` line and the added `Accepted by` line. **Any body difference is a defect**, not a
formatting preference — these records are cited as authority, and a silent edit during promotion is
the specific failure this step exists to prevent.

State the diff result per ADR. Being documentary, this task produces **no test count**; do not report
one it cannot have.

**Also confirm** the three conditions MSG-0071 attached still hold in the promoted copies: no
provider/model/runtime selection, ADR-0019's normalization still deferred, and ADR-0017's entailment
model and thresholds still open under SPEC-0020. MSG-0072's pre-promotion pass verified these in the
drafts; the point of re-checking is that promotion is where they could be lost.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, the ADR index, and WP-0009 where it tracks ADR status.
Write the checkpoint. A completely new session must be able to resume from the repository alone.

### Checkpoint

`implementation/operations/checkpoints/TASK-0025.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one.

### Stop conditions

Stop and record COMMS if a draft's content conflicts with what MSG-0071 accepted, if promoting would
require resolving something the lead deliberately left open, or if any accepted ADR in `docs/` would
have to be modified.

**Also stop if `origin/main` moves mid-run** — BLK-0006 is the precedent. Record the starting HEAD in
checkpoint 1 and re-check before every push.

> **Known runner limit.** `git fetch` is off the runner allowlist, so a mid-run move is detectable only
> when a push is rejected. Record it and stop; do not route around it.

### Recovery procedure

**Check which ADRs already exist in `docs/decisions/` before writing anything.** ADR-0017 is already
there legitimately; a resumed session that assumes an empty target could overwrite a promoted record
or double-promote. Promotion is idempotent only if you look first.

---

## TASK-0026 — A-SURVEY (bounded corpus survey) and A-STACK (stack evaluation)

**Priority:** 1 | **Status:** **COMPLETE (PARTIAL)** — executed 2026-08-22; record **MSG-0078** | **Owner:** Claude Code
**Depends on:** TASK-0025 COMPLETE; MSG-0071 DECIDED and the ADR set promoted; MSG-0076 AUTHORIZED
**Next eligible task:** none — implementation stays unauthorized

> **Result:** **A-STACK COMPLETE** → [`EPA-0005`](../architecture/EPA-0005-assistant-stack-evaluation.md),
> PROPOSED, selecting nothing. **A-SURVEY NOT PERFORMED** — prerequisite **PR5 UNMET**, re-verified by
> inspection. **5 of 6 acceptance criteria MET; criterion 1 UNMET.** No accepted ADR modified
> (`git diff --name-only docs/decisions/` empty), **no ADR created**, **no task marked READY**, no
> corpus figure produced. The section below is retained **as issued** — it is the specification this
> task was executed against, and MSG-0078 §2 maps each criterion to its evidence.
**Work package:** WP-0009 — Employee Policy Assistant | **Architecture tasks:** A-SURVEY, A-STACK

**Specification:** [`MSG-0076-next-architecture-task-authorization.md`](../comms/MSG-0076-next-architecture-task-authorization.md)
**plus this section.** No separate `TASK-0026-*.md` file exists — as with TASK-0025, that is deliberate
and not a missing file. **TASK-0026 is an id allocated during reconciliation**, verified unused;
MSG-0076 assigns none.

---

### ⚠ Read this before starting A-SURVEY

**A-SURVEY's prerequisite is NOT met, and the task must not paper over it.**

MSG-0076 asks A-SURVEY to "inspect representative approved policy material" and record **formats,
language mix, scanned-document prevalence, classification/audience patterns, and version/supersession
characteristics**.

**No such corpus is reachable from this repository.** Verified at reconciliation time, not assumed:

```text
$ find . -iname "*.pdf" -o -iname "*.docx" -o -iname "*policy*"   (excluding .md, .git)
  ./services/kernel/src/adapters/policy            <- kernel source, not policy documents
  ./services/kernel/src/ports/policy.ts
  ...
```

The authoritative records agree and have said so all along:

- **WP-0009 §6.1** — "PR5 (the corpus) is the **organization's**" prerequisite.
- **EPA-0004 §11.5 / PR5** — "A real approved policy corpus available for ingestion and gate
  evaluation — **UNKNOWN — not visible from the repository** — Organization".
- **MSG-0061 §7.5** — "**No survey was performed or scheduled.**"

**Required behaviour:**

1. **Establish first, by inspection, whether any corpus is actually reachable.** Do not infer it from
   this entry — if the operator has since supplied material, that changes the answer, and this text was
   written before they could have.
2. **If none is reachable: stop A-SURVEY at that prerequisite and record it.** Produce **no** figures,
   **no** format breakdown, **no** language mix, **no** scanned-document prevalence, and **no**
   classification patterns. Not as estimates, not as illustrations, not as "expected" values.
3. **Do not substitute a survey method, template, or plan for the authorized output** unless the
   Architecture Lead authorizes that separately. It would be scope invention, and a method document is
   easy to mistake later for a completed survey.
4. **Complete A-STACK regardless** — it has no such dependency — and report the task as **PARTIAL**,
   naming A-SURVEY and MSG-0076 acceptance criterion 1 as the unmet part and PR5 as the reason.

**Why this is spelled out at length.** A survey with no corpus is the single most inviting place in
this work package to produce confident, plausible, invented findings — and those findings would feed
D6 normalization, D14's scanned-document ruling, and ADR-0019. **Fabricated survey data would corrupt
accepted architecture.** Partial completion, reported honestly, costs nothing by comparison.

---

### A-STACK — executable now

**Objective.** Evaluate candidate service-stack approaches against the accepted platform contracts and
the EPA ADR set, and produce **either** an evidence-based recommendation **or** an explicit record of
why selection remains open.

**Inputs, all present in the repository:** `docs/architecture/technology-selection-principles.md`; the
six accepted ADRs `docs/decisions/ADR-0017 … ADR-0022`; WP-0009 (especially §6.2 and §7); EPA-0004;
and the accepted ADR register generally.

**Binding constraints it must respect:**

- **MSG-0062 §7.7 — ADR-0015 is NOT inherited.** The service sits outside the kernel boundary and uses
  accepted platform contracts. A-STACK proposes; it does not adopt the kernel stack by default.
- **ADR-0022 — inference locality.** External inference is prohibited by default; the ADR selects no
  model, runtime, embedding model, or serving technology, and A-STACK must not quietly do so on its
  behalf.
- **ADR-0007 — identity terminates at the OIDC/OAuth2 boundary.** No direct LDAP or Kerberos.
- **ADR-0020 — no retrieve-then-suppress**, fail-closed without existence, timing, or result-count
  side channels.
- **ADR-0019 — Arabic normalization stays deferred** to empirical corpus evidence.

**Evaluate, do not select.** MSG-0076 is explicit: "Do not select or authorize a provider, framework,
model, embedding technology, or runtime." A recommendation is permitted; an authorization is not. Where
evidence is insufficient, **record that selection remains open and say what evidence would close it** —
several of those gaps depend on the corpus survey that cannot run yet, and saying so is a result.

---

### Constraints on the whole task (MSG-0076)

- **No production corpus ingestion.** No implementation. No identity-provider implementation or
  provider selection.
- **Preserve ADR-0017 … ADR-0022 exactly as accepted.** No accepted ADR may be modified — they are now
  in `docs/decisions/` and carry authority.
- **Do not invent ADR-0019 Arabic normalization rules.**
- **Do not introduce retrieve-then-suppress behaviour.**
- **Do not mark T-A, T-B, T-D, T-E, or T-0 READY.**
- Architecture work only; it authorizes no implementation.

### Acceptance criteria (MSG-0076)

1. A bounded corpus-survey record documents the required empirical observations without production
   ingestion. **Expected UNMET — see the prerequisite warning above. Report it unmet with the reason;
   do not manufacture observations to satisfy it.**
2. A stack-evaluation record maps candidate approaches to the accepted EPA constraints and explicitly
   preserves open selections.
3. No accepted ADR is modified.
4. No implementation task is marked READY.
5. COMMS and the queue are reconciled consistently before execution.
6. **Execution is reported complete only after repository verification.**

### Verification

Being documentary, this task produces **no test count**; do not report one it cannot have. Map each
criterion to re-readable evidence, and state plainly which are MET, UNMET, and why.

**Confirm before reporting:** `git diff --name-only docs/decisions/` is **empty** — no accepted ADR was
touched — and no board row gained READY status.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and WP-0009 §6.2 where it tracks A-SURVEY and A-STACK.
Write the checkpoint. A completely new session must be able to resume from the repository alone.

### Checkpoint

`implementation/operations/checkpoints/TASK-0026.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one.

### Stop conditions

- **A-SURVEY's corpus prerequisite is unmet** — stop that half, record, and continue with A-STACK.
- Any conflict between the accepted ADR set and what the task would need to conclude.
- Any point where completing an output would require selecting a provider, framework, model, embedding
  technology, or runtime.
- **`origin/main` moving mid-run** — BLK-0006 is the precedent. Record the starting HEAD in checkpoint 1
  and re-check before every push.

> **Known runner limit.** `git fetch` is off the runner allowlist, so a mid-run move is detectable only
> when a push is rejected. Record it and stop; do not route around it.

### Recovery procedure

On resumption, re-read MSG-0076 and this section, then **re-check the corpus question by inspection**
before assuming either answer — the operator may have supplied material in the interval. Check which
records already exist rather than rewriting them.

---

## TASK-0027 — A-SURVEY (n=1): inspect the approved/synthetic corpus

**Priority:** 1 | **Status:** **READY** | **Owner:** Claude Code
**Depends on:** TASK-0026 COMPLETE (PARTIAL); MSG-0076; MSG-0080 AUTHORIZED; the corpus present at its external path
**Next eligible task:** none — implementation stays unauthorized
**Work package:** WP-0009 — Employee Policy Assistant | **Architecture task:** A-SURVEY (bounded follow-up)

**Specification:** [`MSG-0080-a-survey-authorization.md`](../comms/MSG-0080-a-survey-authorization.md)
**plus this section.** No separate `TASK-0027-*.md` file exists — deliberate, as with TASK-0025 and
TASK-0026. **TASK-0027 is an id allocated at reconciliation**, verified unused; MSG-0080 assigns none.

### The corpus, and the one rule that must not be broken

```text
D:\Work\pci-corpus\plan.pdf        626.8 KB      header %PDF-1.7
```

**It is outside the repository on purpose and must stay outside.** MSG-0080: it "must remain outside
the repository and must not be copied, staged, committed, or otherwise added to repository history."

**Read it in place. Do not copy it into the working tree** — not to a temp folder inside the repo, not
"just to inspect it", not even briefly. If a scratch working copy is genuinely needed, use the session
scratchpad outside the repository.

> **Why this is stated so firmly.** The file first arrived at `D:\Work\pci-platform\plan.pdf` — inside
> the working tree, untracked and **not** covered by `.gitignore`. Every COMMS cycle and every runner
> executes `git add -A`, so the next commit would have put 627 KB of corpus into permanent history,
> removable only by rewriting published history. It was moved out before anything staged it. **The
> hazard is real and has already happened once.**


### ⚠ A permission constraint that may prevent unattended execution

**BLK-0009 observed, in a real supervisor-started session, that a read of the corpus directory was
requested and refused:** *"a read of that directory was requested and the permission was not granted,
and it was not routed around."*

That is a structural tension, not a bug:

- **MSG-0080 requires the corpus to stay outside the repository** — it must not be copied, staged, or
  committed.
- **The unattended runner's permission boundary is the repository.** `runner-settings.json` grants no
  read access outside it.

**So the corpus is deliberately in the one place the runner may not be able to read.**

**If the read is denied, stop and record it. Do not:**

- copy the PDF into the repository to make it readable — that breaks MSG-0080's standing constraint and
  recreates the near-miss BLK-0008 records;
- edit `runner-settings.json` or any permission setting — no authorization exists, and weakening the
  boundary to complete a task is exactly what the boundary is for;
- infer the document's properties from its filename, size, or any other proxy.

**Report the task blocked on the permission boundary and stop.** MSG-0082 puts the choice to the
Architecture Lead and the operator: grant a narrow read permission for `D:\Work\pci-corpus\`, or run
this one task interactively where reads outside the working directory are available. **Neither is
Claude's to choose.**

### Objective

Inspect the single available PDF and record **document-level** observations, with the sample size
stated as **n=1** and the distinction between what one document can and cannot establish made
explicit. This is an **architecture input only**.

### What n=1 CAN establish (MSG-0080)

- whether **this document** is text-native or scanned;
- the language(s) present **in this document**;
- observed **format characteristics** of this file;
- observed **classification / audience / version / supersession** characteristics **where present** in
  this document.

### What n=1 CANNOT establish — record as insufficient, do not estimate

**Format mix · language prevalence · scanned-document prevalence · classification and audience
distribution · version and supersession prevalence — across a corpus.**

MSG-0080 is explicit: for these, **record that n=1 is insufficient and do not invent estimates.**

**This is the substance of the task, not a disclaimer on it.** Four of A-SURVEY's five original
questions are distributional — they describe a population, and one file is not a population. A record
that reads like a corpus survey would feed **D6** normalization, **D14**'s rejection of scanned
documents, and **ADR-0019**, which was accepted specifically on condition its rules come from
*empirical corpus evidence*. **A confident-sounding distribution derived from one file would corrupt
accepted architecture and be checkable against nothing.**

### Constraints (MSG-0080)

- **Approved/synthetic test corpus only.** No production or confidential corpus ingestion.
- **Do not move the PDF into the repository. Do not stage or commit it.**
- **Do not modify ADR-0017 … ADR-0022.**
- **Do not invent Arabic normalization rules** — empirical evidence stays bounded to what this document
  actually supports.
- **Do not select** providers, models, frameworks, embedding technologies, or runtimes.
- **Do not mark T-A, T-B, T-D, T-E, or T-0 READY.**

### Acceptance criteria (MSG-0080)

1. The PDF at the stated external path is **inspected successfully**.
2. The record states **n=1** and distinguishes document-level observations from unsupported
   distributional conclusions.
3. The record **identifies which requested dimensions cannot be inferred** from n=1.
4. **The corpus remains outside the repository and `git status` stays clean.**
5. No ADR and no implementation authorization is changed.
6. COMMS and the queue are reconciled consistently.
7. **Completion is reported only after repository and corpus-path verification.**

### Verification

Being documentary, this task produces **no test count**; do not report one it cannot have.

**Before reporting completion, verify and quote:**

```text
git status --porcelain                  ->  empty
Test-Path D:\Work\pci-corpus\plan.pdf   ->  True
Test-Path D:\Work\pci-platform\plan.pdf ->  False      (nothing copied in)
git log --diff-filter=A --name-only | grep -i "\.pdf"  ->  no corpus PDF ever added
```

Criterion 4 is the one that can fail silently — check it explicitly rather than assuming.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and WP-0009 §6.2 where it tracks A-SURVEY. Write the
checkpoint. Note the corpus location in the record so a future session does not repeat the
in-repository mistake.

### Checkpoint

`implementation/operations/checkpoints/TASK-0027.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one.

### Stop conditions

- **The corpus path is not readable** — verify by inspection first; do not assume it from this text.
- Reading the document would require moving or copying it into the repository.
- Any point where completing the record would require a distributional claim n=1 cannot support.
- **`origin/main` moving mid-run** — BLK-0006 is the precedent. Record the starting HEAD in
  checkpoint 1 and re-check before every push.

> **Known runner limit.** `git fetch` is off the runner allowlist, so a mid-run move is detectable only
> when a push is rejected. Record it and stop; do not route around it.

### Recovery procedure

Re-verify the corpus path by inspection before assuming either answer, and check which records already
exist rather than rewriting them. **If a `plan.pdf` is found inside the repository at any point, that
is a defect: move it out and record it — do not commit it and do not delete the corpus.**

---

## TASK-0028 — A-SURVEY Arabic follow-up (n=1): inspect `Arabic.pdf`

**Priority:** 1 | **Status:** **READY** | **Owner:** Claude Code
**Depends on:** TASK-0027 COMPLETE; MSG-0085 AUTHORIZED; MSG-0083's read grant (already covers the path)
**Next eligible task:** none — implementation stays unauthorized
**Work package:** WP-0009 — Employee Policy Assistant | **Architecture task:** A-SURVEY, Arabic follow-up

**Specification:** [`MSG-0085-arabic-corpus-follow-up-authorization.md`](../comms/MSG-0085-arabic-corpus-follow-up-authorization.md)
**plus this section.** No separate `TASK-0028-*.md` file — deliberate, as with TASK-0025 through
TASK-0027. **TASK-0028 is an id allocated at reconciliation**, verified unused; MSG-0085 assigns none
but explicitly requires this step: *"If a new bounded task/READY reconciliation is required by the
queue, record that rather than silently re-running a closed task."* **TASK-0027 is closed and must not
be re-run.**

### The corpus

```text
D:\Work\pci-corpus\Arabic.pdf      663.3 KB      header %PDF-1.5      (verified present)
D:\Work\pci-corpus\plan.pdf        626.8 KB      the TASK-0027 subject - not this task's subject
```

**Both files sit in the directory MSG-0083 already granted read-only.** No permission change is needed
and **none is authorized** — MSG-0085 §3: *"Use the existing narrow read-only corpus permission
authorized by MSG-0083. Do not broaden permissions."*

**Read it in place. The PDF must never enter the repository** — writes to that path are denied by
`Edit(//D:/Work/pci-corpus/**)`, and BLK-0008 records the near-miss where a corpus file briefly sat
inside the working tree, one `git add -A` from permanent history.

### Objective (MSG-0085 §6)

Inspect the Arabic PDF directly and record **only observations supported by the file**, specifically
assessing:

- **Arabic text encoding and extraction** — what actually comes out of the content streams;
- **language declarations** — `/Lang` at document and span level;
- **font and `ToUnicode` behaviour** — whether glyphs map back to Unicode, and how reliably;
- **text-native vs scanned** characteristics;
- **normalization and extraction hazards** relevant to **ADR-0019** and downstream retrieval.

### n=1, again — and it is a separate n=1

**Record the sample as n=1 for the Arabic follow-up** (MSG-0085 §5). Do not generalize to the wider
corpus, and **do not combine it with TASK-0027's English document into a two-document "corpus"** — two
files chosen by an operator are not a sample, and "1 English + 1 Arabic" is not evidence about the
prevalence of either.

**Do not amend ADR-0019** (MSG-0085 §7). Any implication for its deferred Arabic normalization rules is
**evidence for a later architecture decision**, recorded as such — not a rule, not a proposal adopted,
and not a change to an accepted ADR.

> **Why this matters more here than it did for English.** ADR-0019 was accepted **on condition** that
> its normalization rules come from empirical corpus evidence. This is the first Arabic evidence the
> project has. The temptation to promote a single document's behaviour into a normalization rule is
> exactly what the condition exists to prevent.

### What TASK-0027 found that is worth carrying in

Its three extraction hazards are reproducible and should be **checked for, not assumed**, in this file:

1. **Duplicated glyphs from drop shadows** — artifact-marked text that naive extraction doubles;
   negligible document-wide, severe on the one page carrying governance metadata.
2. **Language tags harvested as body text** — `/Span <</Lang (..)>>` property strings picked up by a
   regex that does not check the operand precedes `Tj`/`TJ`.
3. **A page whose meaning is vector graphics**, yielding almost no text — ingested silently as nearly
   empty rather than rejected.

**Whether any of these appear here is a question, not an expectation.** A different producer and a
different script may produce entirely different hazards, and finding none of the three is a real result.

### Constraints (MSG-0085 guardrails)

- **No production or confidential corpus ingestion.**
- **No copying the PDF into Git.**
- **No permission changes beyond MSG-0083.**
- **No implementation.**
- **No unsupported corpus-wide prevalence claims.**
- **Preserve all accepted ADRs unchanged** unless separately authorized.
- Do not mark T-A, T-B, T-D, T-E, or T-0 READY.

### Personal data — carry TASK-0027's restraint forward

MSG-0084 §4.1 read the author and approver names in the English document and **deliberately did not
transcribe them**, on the ground that an ordinary project record is not the right place for personal
data about identifiable staff. **Do the same here.** Record that such fields are *present* and what
their *structure* is; do not copy their values into the repository.

### Verification

Being documentary, this task produces **no test count**. Before reporting completion, verify and quote:

```text
git status --porcelain                        ->  empty
Test-Path D:\Work\pci-corpus\Arabic.pdf       ->  True
Test-Path D:\Work\pci-platform\Arabic.pdf     ->  False     (nothing copied in)
git log --diff-filter=A --name-only | grep -i "\.pdf"   ->  nothing
```

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and WP-0009 §6.2 where it tracks A-SURVEY. Write the
checkpoint.

### Checkpoint

`implementation/operations/checkpoints/TASK-0028.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one.

### Stop conditions

- **The corpus file is not readable** — verify by inspection; do not assume it from this text.
- Reading it would require copying it into the repository or broadening any permission.
- Any point where a conclusion would need more than one document to support it.
- **`origin/main` moving mid-run** — BLK-0006 is the precedent. Record the starting HEAD in checkpoint 1
  and re-check before every push.

> **Known runner limits.** `git fetch` is off the allowlist, so a mid-run move is detectable only when a
> push is rejected. **There is also no PDF tooling** — `pdftoppm` is absent and `pdftotext` is not on
> the allowlist (MSG-0084 §8.2). TASK-0027 worked within that by reading the file's bytes directly,
> which the read grant permits. **Do not install tooling and do not request it mid-run**; if byte-level
> inspection cannot answer a question, record the question as unanswered.

### Recovery procedure

Re-verify the corpus path by inspection before assuming either answer, and check which records already
exist rather than rewriting them. **If any PDF is found inside the repository, that is a defect: move it
out and record it — do not commit it and do not delete the corpus.**

---

## TASK-0030 — draft the minimum ADR-0020 clarification (pre-constrained retrieval as a gate criterion)

**Priority:** 1 | **Status:** **COMPLETE** (2026-08-22 — 7/7 criteria, **MSG-0094**) | **Owner:** Claude Code
**Depends on:** EPA-0005 ACCEPTED (MSG-0092); ADR-0020 accepted and promoted
**Next eligible task:** none — the Lead reviews the draft before anything is applied

> **EXECUTED 2026-08-22 by a supervisor-started session. Record: [MSG-0094](../comms/MSG-0094-task-0030-execution-record.md).**
> Deliverable: [`implementation/decisions/ADR-0020-AMD-01-pre-constrained-retrieval-engine-criterion.md`](../decisions/ADR-0020-AMD-01-pre-constrained-retrieval-engine-criterion.md)
> — **PROPOSED and NOT applied.** `git diff --name-only docs/` was **empty**, so the accepted, promoted
> ADR-0020 is unmodified; applying the amendment needs an explicit authorization (MSG-0092 §5).
> **The stop condition was tested, not assumed** — §§3–4 state the *rule* unambiguously, and the gap is
> *consequence*: they do not say the rule **disqualifies an engine** that cannot constrain inside the
> query, nor **what G3 inspects** (conforming and retrieve-then-filter designs return byte-identical
> responses). The amendment is **one 148-word insertion at the end of §4**, plus an optional
> traceability row; **twelve candidate changes were deliberately not made**. **Nothing was selected** —
> all nine MSG-0092 §4 categories stay open. **One convention question** is referred: the repository has
> **no precedent for amending an accepted ADR**, so no header change was drafted.
**Work package:** WP-0009 — Employee Policy Assistant | **Type:** architecture governance, draft only

**Specification:** [`MSG-0092-architecture-lead-epa-0005-ruling.md`](../comms/MSG-0092-architecture-lead-epa-0005-ruling.md) §3 and §5,
**plus this section.** No separate `TASK-0030-*.md` file — deliberate, as with TASK-0025 onward.
**TASK-0030 is an id allocated at reconciliation**, verified unused; MSG-0092 assigns none.

### Objective

**Draft the minimum clarification to ADR-0020 that makes its existing §3/§4 pre-constrained retrieval
requirement explicit as an engine-selection / gate criterion — without changing its substantive
policy.**

MSG-0092 §3: *"Authorize a narrow follow-on governance task to draft the minimum
clarification/amendment to ADR-0020, without changing its substantive policy … No retrieval engine is
selected by that task."*

### The requirement being made explicit

ADR-0020 already contains it. **§4 is titled "No retrieve-then-suppress — the rule this ADR exists
for"**, and **§3 sets out authorization enforced at four points, each independently sufficient to
deny.** MSG-0092 §1(1) restates it as a settled constraint: *"Retrieval must enforce
authorization-relevant constraints **inside the retrieval operation**. Retrieve-then-filter or
over-fetch-then-filter is not acceptable."*

**The gap is not policy, it is consequence.** The ADR states the rule; it does not say in terms that
the rule **disqualifies any retrieval engine that cannot apply authorization constraints inside the
query**. That consequence is what the clarification must make unambiguous, so a future engine
evaluation cannot satisfy the ADR on paper while planning to filter after retrieval.

### Required work

1. **Read ADR-0020 §§3–4 in `docs/decisions/`** — the accepted, promoted copy — and establish exactly
   what they already say. Quote rather than paraphrase.
2. **Draft the minimum wording** that makes the pre-constrained requirement explicit as an
   **engine-selection and gate criterion**. Minimum means: the smallest change that removes the
   ambiguity, not a rewrite, not a tidy-up, and not an improvement of adjacent text.
3. **Preserve all accepted semantics.** The four enforcement points, the fail-closed behaviour, the
   named side channels, and the Restricted-document condition are unchanged. If the draft would alter
   any of them, that is a stop condition, not a judgement call.
4. **Produce the draft as a proposal for Architecture Lead review** — in
   `implementation/decisions/` or `implementation/comms/` as a clearly-marked proposed amendment.
5. **STOP before applying it.** See below.

### The boundary that matters most

**Do not apply the amendment to `docs/decisions/ADR-0020-*.md`.** MSG-0092 §5 is explicit: *"stop
before applying the amendment unless a subsequent explicit authorization permits acceptance."*

**ADR-0020 is accepted and promoted — it carries architectural authority.** Editing it is the Lead's
act, exactly as ADR promotion was (TASK-0025 / MSG-0073). Producing the draft is this task's whole
scope.

### Forbidden

- **No retrieval engine, index engine, framework, model, runtime, or provider is selected** — MSG-0092
  §4 lists nine categories that stay open, and this task touches none of them.
- **No change to ADR-0020's substantive policy**, and **ADR-0017, ADR-0018, ADR-0019, ADR-0021 and
  ADR-0022 are not touched at all**.
- **No new generic stack ADR** — MSG-0092 §3 declined one explicitly.
- **No Arabic normalization rule**; ADR-0019's deferral is unchanged and the n=1 evidence does not
  become production corpus evidence (MSG-0092 §4).
- **Do not start T-A, T-B, T-D, T-E, T-0**, model selection, engine selection, or any production
  implementation (MSG-0092 §5).
- **Do not mark any implementation task READY.**

### Acceptance criteria

1. ADR-0020 §§3–4 are inspected in the accepted copy and quoted, not summarised.
2. A **minimum** clarification is drafted, with its minimality argued — what was deliberately *not*
   changed is stated.
3. **No substantive policy change**: the four enforcement points, fail-closed behaviour, side-channel
   closure and Restricted condition are demonstrably preserved.
4. **No engine or technology selection appears anywhere in the draft.**
5. **ADR-0020 in `docs/decisions/` is unmodified** — `git diff --name-only docs/` is empty.
6. The draft is presented for Lead review, with the exact proposed wording quotable in isolation.
7. COMMS, queue and status are reconciled; completion reported only after repository verification.

### Verification

Documentary — **no test count**; do not report one it cannot have. Before reporting completion, verify
and quote:

```text
git diff --name-only docs/                     -> empty   (no accepted ADR touched)
grep -c READY on the board                     -> the intended count, no implementation task added
```

State explicitly which ADR-0020 semantics were preserved and how that was checked.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, and WP-0009 where it tracks the ADR set. Write the
checkpoint.

### Checkpoint

`implementation/operations/checkpoints/TASK-0030.md`. Write each checkpoint **after** an operation is
verified, never in anticipation of one.

### Stop conditions

- **The minimum clarification cannot be drafted without changing substantive policy** — stop and record
  the conflict rather than deciding it.
- ADR-0020 §§3–4 turn out to already state the consequence unambiguously — **that is a legitimate
  finding**: report that no amendment is needed rather than manufacturing one.
- Any point where the wording would imply an engine choice.
- **`origin/main` moving mid-run** — BLK-0006 is the precedent. Record the starting HEAD in checkpoint 1
  and re-check before every push.

> **Known runner limits.** `git fetch` is off the allowlist, so a mid-run move is detectable only when a
> push is rejected. Record it and stop; do not route around it.

### Recovery procedure

Re-read MSG-0092 §3 and §5 and check which records already exist before drafting. **If a proposed
amendment already exists, do not write a second one** — governance drafts are easy to duplicate and
hard to reconcile, and duplication is the failure this queue has hit repeatedly.

---

## TASK-0031 — apply ADR-0020 AMD-01 in place

> **COMPLETE — executed 2026-08-23 by a supervisor-started session against starting `HEAD =
> dfb719d`.** All **7/7 acceptance criteria MET**; execution record **MSG-0097**; applying commit
> **`a1be892178dea11d62dee6693c7c8d7d80798e43`**; tree clean. Documentary task — **no test count, and
> none is claimed.**
>
> **The amendment is applied and this section must not be run again.** `git diff --name-only
> docs/decisions/` named **ADR-0020 and nothing else**, with **15 insertions and 0 deletions** — the
> header note was added as a new line rather than by modifying one, so no accepted wording changed
> anywhere in the file. The four new markers each occur **exactly once**; **re-running would insert
> hunk 1 twice**, which the recovery procedure below rightly calls worse than a missing clause.
>
> **AMD-01 §8 is settled as option (a)** — in place, one authoritative file, no superseding ADR. That
> is now the repository's precedent **for an additive clarification that changes no substantive
> policy**, and for nothing wider: MSG-0095 §3 authorized application of AMD-01 only.
>
> **Nothing was selected.** No engine, index technology, embedding model, framework, runtime or
> provider; ADR-0019's §6 Arabic deferral untouched; ADR-0017/0018/0019/0021/0022 not touched at all;
> **no implementation task is READY.**

**Priority:** 1 | **Status:** **COMPLETE** (was READY) | **Owner:** Claude Code
**Depends on:** AMD-01 ACCEPTED (MSG-0095); TASK-0030 COMPLETE
**Next eligible task:** none — no implementation is authorized by MSG-0095
**Type:** governance application, **in place on an accepted ADR**

**Specification:** [`MSG-0095-adr-0020-amd-01-architecture-lead-ruling.md`](../comms/MSG-0095-adr-0020-amd-01-architecture-lead-ruling.md)
**plus** [`ADR-0020-AMD-01-*.md`](../decisions/ADR-0020-AMD-01-pre-constrained-retrieval-engine-criterion.md)
**plus this section.** No separate `TASK-0031-*.md` file; **the id was allocated at reconciliation**,
verified unused.

> **This task edits an accepted, promoted ADR.** That is authorized here and only here: MSG-0095 §3
> *"authorizes acceptance/application of AMD-01 only"*. Nothing else in `docs/decisions/` may change.

### What MSG-0095 decided

- **ACCEPT AMD-01 as drafted, with the optional traceability row included** — so **both hunks**, not
  hunk 1 alone.
- **Apply it in place** to the accepted ADR-0020, with a **concise amendment note in its header
  identifying AMD-01 and MSG-0095**. This settles the open convention question in AMD-01 §8 as
  **option (a)**.
- **Do not create a superseding ADR.**

### Required work — three edits, and nothing else

**Take the wording verbatim from AMD-01. Do not retype or paraphrase it** — transcription drift in an
accepted ADR is exactly the failure this task must not introduce.

1. **Hunk 1** — insert the block quoted in **AMD-01 §4** at the **end of ADR-0020 §4**, immediately
   after the sentence *"An exclusion cannot fail open; a filter can."* **Nothing existing is deleted or
   reworded.**
2. **Hunk 2** — append the single row quoted in **AMD-01 §5** to ADR-0020's **Traceability** table.
3. **Header note** — add a concise amendment line identifying **AMD-01** and **MSG-0095**, in the form
   AMD-01 §8(a) suggests, e.g. `**Amended:** 2026-08-23 — AMD-01 (MSG-0095)`. Keep it to one line;
   MSG-0095 says *concise*.

### Everything AMD-01 §6 listed as untouched stays untouched

§1, §2, §3 and its four numbered points, §3's closing line, §4's existing text including the MSG-0062
§7.6 block quote, §5, §6, §7, §8, Consequences, *Deliberately not decided here*, Context, Rationale, and
the reuse-before-create test. **ADR-0017, ADR-0018, ADR-0019, ADR-0021 and ADR-0022 are not touched at
all.**

### Forbidden (MSG-0095 §4)

- **No change to ADR-0019 or its Arabic production-evidence gate.**
- **No change to the three settled MSG-0092 constraints.**
- **No generic stack ADR.**
- **No retrieval engine, index technology, embedding model, framework, runtime, or provider selection**
  — MSG-0095 §3 is explicit that this ruling selects none.
- **No implementation task authorization beyond applying this amendment**, and no implementation task
  may be marked READY.

### Acceptance criteria

1. Hunk 1 appears at the end of ADR-0020 §4, **verbatim from AMD-01 §4**, with the preceding text
   unchanged.
2. Hunk 2 appears as one new Traceability row, **verbatim from AMD-01 §5**.
3. A concise header amendment note identifies **AMD-01 and MSG-0095**.
4. **No other change to `docs/decisions/`** — `git diff --name-only docs/decisions/` names
   **ADR-0020 and nothing else**.
5. **No technology or engine name appears anywhere in the applied text.**
6. AMD-01's own record is updated to **APPLIED**, citing MSG-0095 and the applying commit.
7. COMMS, queue and status reconciled; **the resulting commit hash and a clean tree are reported**
   (MSG-0095 §5).

### Verification — run and quote before reporting completion

```text
git diff --name-only docs/decisions/     -> ADR-0020-retrieval-projection-and-index-boundary.md only
git diff -- docs/decisions/ | grep '^-'  -> no substantive deletions (header line change aside)
git status --porcelain                   -> empty after commit
```

**Diff-read the applied ADR against AMD-01's quoted hunks** and confirm they match character for
character. Documentary task: **no test count** — do not report one it cannot have.

### Documentation

Record the result in `implementation/comms/` as a numbered message, update
`implementation/status/current.md`, this queue, AMD-01's status, and WP-0009 where it tracks the ADR
set. Write the checkpoint.

### Checkpoint

`implementation/operations/checkpoints/TASK-0031.md`, written **after** each operation is verified.

### Stop conditions

- **The insertion point cannot be located exactly**, or §4's closing sentence differs from what AMD-01
  quoted — stop and record rather than placing the text approximately.
- Applying either hunk would require altering existing wording.
- Any point where the edit would touch a second ADR.
- **`origin/main` moving mid-run** — BLK-0006 is the precedent. Record the starting HEAD in checkpoint 1
  and re-check before every push.

> **Known runner limit.** `git fetch` is off the allowlist, so a mid-run move is detectable only when a
> push is rejected. Record it and stop.

### Recovery procedure

**Check whether the amendment is already applied before applying it.** Re-running this task against an
already-amended ADR would insert hunk 1 twice — a duplicated clause in an accepted ADR is far worse
than a missing one, and `CLAUDE.md` recovery rule (f) applies with full force: never repeat an
operation merely because a record says it was incomplete.
