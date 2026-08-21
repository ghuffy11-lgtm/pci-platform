# MSG-0061 — TASK-0022 Execution Record: Employee Policy Assistant Work-Package Definition

**Status:** **RECORD** — the deliverable is PROPOSED and requires the Architecture Lead's acceptance.
**Raised:** 2026-08-21
**Raised by:** Claude Code (session started by the Execution Supervisor)
**Type:** Task execution record
**Authority:** MSG-0059 (TASK-0022 authorization) | **Related:** MSG-0056a, MSG-0056b, MSG-0058,
MSG-0060, EPA-0001, EPA-0002, EPA-0003, EPA-0004
**Decision required:** yes — §7 lists seven items. **None was self-authorized.**

---

## 1. What was authorized, and what was done

MSG-0059 authorized TASK-0022 as an **architecture/work-package definition** task and nothing more.
The queue section carries the **union** of two specification files (spec A and spec B, per MSG-0060),
and both were read in full before authoring began.

**Delivered:** [`EPA-0004-employee-policy-assistant-work-package-definition.md`](../architecture/EPA-0004-employee-policy-assistant-work-package-definition.md)
— a work-package definition following every required field of
`docs/engineering/implementation-work-package-standard.md`, with the fourteen EPA-0003 rulings and the
four MSG-0058 findings folded in.

**It is PROPOSED.** It authorizes no implementation, allocates no work-package number, creates no ADR,
selects no provider, model, embedding model, index technology, or runtime, changes no accepted ADR,
adds no permission, alters no Supervisor behaviour, and **marks no task READY.**

---

## 2. Required outputs, mapped to evidence

The union of both specifications. Every item is mapped to the section that satisfies it, so acceptance
can be checked rather than assumed.

| # | Required output | Where | Verdict |
|---|---|---|---|
| 1 | Work-package scope and boundaries | EPA-0004 §1.4, §1.5 | MET |
| 1a | Approved-document lifecycle, versioning, supersession | §1.4(1), §2.1, gate G1 | MET |
| 1b | Ingestion, normalization, provenance, retrieval contracts | §1.4(2–3), §2.1, §2.3, gates G2/G4 | MET |
| 1c | Grounded English/Arabic answering, citation and abstention gates | §1.4(5–6), §2.2, gates G5/G7/G8 | MET |
| 1d | Retrieval-time authorization and confidentiality | §1.4(4), gates G3/G6 | MET |
| 1e | Session-default retention, configurable | §1.4(8), §2.3, gate G13 | MET |
| 1f | Authenticated identity via OIDC/OAuth2 | §1.4(7), gate G12, task T-0 | MET |
| 1g | Auditability and security boundaries | §1.4(9), §6, gate G9 | MET |
| 1h | Employee-facing frontend contract | §1.4(10), §2.3, EPA-0001 §9 | MET |
| 1i | Superseded-policy handling | §1.5 (out of scope, D11), §2.1, §7 | MET |
| 2 | Explicit implementation gates and acceptance criteria | §3 — **thirteen gates**, G1–G13, each with a fail condition | MET |
| 3 | Dependency-ordered task sequence with security and architecture checkpoints | §5 — **ten tasks**, T-0 and T-A…T-I, each with its gate and boundary | MET |
| 4 | Test/acceptance gates and threat-model coverage | §3, §4 (five tiers), §6 (T1–T11 mapped to gates) | MET |
| 5 | Remaining genuine architecture decisions | §11 — **seven**, none of them a settled decision reopened | MET |
| 6 | Proposed work-package record and queue changes **as recommendations only** | §1 (required fields), §13 (six recommendations, none applied) | MET |
| — | Explicit architecture and operator boundaries | §5 boundary column; T-0 marked operator-only | MET |

**No test count is reported, because the task produces no runnable artifact.** The queue section says
so directly: "Being documentary, this task produces no test count. Do not report a test result it
cannot have." Every criterion above is documentary and mapped to re-readable evidence.

---

## 3. The rulings, and what each changed

Folded in from MSG-0056a (D2, D4, D5, D6, D8, D9, D10, D11, D12, D14), MSG-0056b (D1, D3, D7, D13),
and MSG-0058 (F1–F4). EPA-0004 §12 tabulates the six substantive differences from EPA-0002.

**The consequential one is F1.** MSG-0058 ruled cross-language grounding **in scope and fail-closed**,
reversing EPA-0003's recommendation to prohibit generating Arabic answers from English policy. The
lead is entitled to rule against a recommendation, and the ruling pays for the added capability with a
gate. EPA-0004 makes that gate a **protocol-level contract rule** (§2.2 rule 4) rather than a quality
target: when the answer language differs from the authoritative source language, a passing
cross-language gate result must be present, and its absence or failure forces an abstention.

**Stated plainly because it is the easiest thing to get wrong:** if that gate is ever implemented as
"fall back to English", the ruling has been **inverted rather than implemented**. G7's fail condition
is written to catch exactly that.

**Two more worth naming:**

- **D14 raises the stakes on an unknown.** Rejecting scanned documents is the right call, but nobody
  has surveyed the customer corpus from the repository side. If it is largely scanned Arabic PDFs, the
  first release answers from a fraction of it — discovered during ingestion, which is late. §7.5.
- **D8 turns offline-first into a gate.** External inference is prohibited by default, so egress
  becomes a G10 **failure**, not a configuration choice.

---

## 4. Reconciliation performed

- **EPA-0003 status re-read in full**, not summarized from the status file. All fourteen rulings are
  annotated inline and match MSG-0056a/MSG-0056b as committed.
- **`implementation/architecture/README.md` corrected.** Its EPA-0003 row read "three reconciliation
  findings open (MSG-0057)". That stopped being true when MSG-0058 ruled all four the same day, and
  MSG-0057 itself now reads CLOSED. The row now records the MSG-0058 rulings. This is the same
  index-lags-its-records failure mode as the blocker and discoveries indexes (TASK-0013/0014/0015),
  found here in a fourth index.
- **`docs/program/work-packages.md` inspected.** The PLAN-WP-0001 register lists WP-0001 as "Knowledge
  Foundation" and WP-0002 as "Repository and Engineering Platform", while the delivered directory holds
  only `WP-0001-kernel-foundation.md`, "PCI Kernel Foundation". EPA-0002 flagged this; it is
  **unchanged and untouched**. EPA-0004 therefore allocates **no number** (§7.1).
- **Message number allocated per the MSG-0035 convention**, verified three ways this session: the
  register in `comms/README.md`, a directory listing, and a repository-wide grep. `MSG-0061` was free
  in all three. **No collision this time** — the first clean allocation since MSG-0060 recorded the
  fifth.

---

## 5. What was NOT done — the forbidden list, checked item by item

| Forbidden by MSG-0059 / spec A / spec B | Observed |
|---|---|
| Product or runtime implementation | None. No code, no service, no configuration |
| Provider, model, or external model registration | None. EPA-0004 states constraints and the SPEC-0020 evaluation path, never a product |
| Changes to accepted ADRs | None. `docs/decisions/` untouched |
| Creating ADRs | None. §11.2 lists six as recommendations, with numbers deliberately left `00xx` |
| New permissions, security boundaries, Supervisor behaviour, scheduling | None. No settings, allowlist, or supervisor file touched |
| Credentials or external privileged operations | None. No host was contacted; startup checklist item 7 was not required and is recorded as not performed |
| Marking any implementation task READY | **None.** After this task, the queue's correct state is **no READY task** — see §8 |

---

## 6. Stop conditions — checked, and none fired

| Condition | Result |
|---|---|
| Repository authority materially conflicts | **No conflict found.** EPA-0004 §14 records the check against every accepted document touched |
| A required architecture decision is genuinely missing | **Seven items in §7 — but none blocks *this* task.** They block the implementation tasks that follow, which is the correct place for them |
| Completion would require implementation or an unauthorized architecture change | Did not arise |
| `origin/main` moves mid-run | **Checked before the commit.** Starting HEAD `7eea2b0` was recorded in checkpoint 1 and re-checked before pushing |

**One apparent conflict was examined and is not one.** MSG-0056b D13 permits "optional unauthenticated
access"; MSG-0058 F2 defers it from the first release. F2 is the later ruling and defers a mode the
earlier one permitted — a narrowing, not a contradiction. It is recorded in EPA-0004 §14 because a
future session reading D13 alone would build a trust boundary the lead has explicitly postponed.

---

## 7. Decisions required — seven, none self-authorized

Full statements in EPA-0004 §11. Each is either a sub-question that was asked and not answered, or a
consequence of a ruling that the ruling does not resolve. **No settled decision is reopened.**

| # | Item | Why it is genuinely open | Blocks |
|---|---|---|---|
| **7.1** | **Work-package number**, and its relationship to PLAN-WP-0001 | The register and the delivered directory already disagree; allocating here compounds a collision | The work-package record itself |
| **7.2** | **The ADR set** — create which of the six, with which numbers | MSG-0056a D12 accepted *promotion* and stated no ADR was created; allocation is the lead's | D6 requires its normalization rule recorded in an ADR **before production use** |
| **7.3** | **T-D before T-E** — grounded QA before retrieval-time authorization | Raised in EPA-0002 §5; **no ruling has addressed it**, verified by reading MSG-0056a/b, 0058, 0059 | T-D's working environment |
| **7.4** | **PR3 — which IdP, whose deployment, and when** | D13 names modes; it names no provider, owner, or date. Needs a privileged deployment action | T-0, T-E, and every authorization control |
| **7.5** | **PR5 — may the real corpus be surveyed before T-B?** | D14 and D6 both depend on a corpus nobody has inspected. **No survey was performed or scheduled** | T-B scope and D6's empirical normalization |
| **7.6** | **May a policy document be Restricted?** | EPA-0003 D3 asked four sub-questions; **MSG-0056b answers three**. Restricted content may not enter model context, so the answer decides whether such documents are excluded from the corpus or retrieved-then-suppressed | T-A, T-E, and the confidentiality posture |
| **7.7** | **The service's implementation stack** | D9 rules ADR-0015 does **not automatically** govern the new service; it does not say what does | T-A onward — otherwise a stack gets picked by default and called inherited |

**7.6 deserves the lead's attention first among the smaller items.** An exclusion cannot fail open; a
retrieve-then-suppress path can. Building either way without a ruling embeds a confidentiality posture
by accident.

---

## 8. Queue state after this task

**TASK-0022 is COMPLETE as a definition task and its output awaits acceptance. No task is READY.**

That is the correct state, not a stall: MSG-0059 makes the lead's acceptance the precondition for any
implementation task, and EPA-0004 §1.6 PR2 is therefore unmet by design. The queue row and section have
been updated accordingly, and **no task was marked READY**.

The recommended next steps are in EPA-0004 §13 — accept or amend EPA-0004; rule on the seven items;
allocate the number; create whichever ADRs are wanted; authorize T-0 as an **operator** task; and only
then authorize T-A and reconcile it in as the single READY task.

**That last step matters more than it looks.** MSG-0060 recorded the **fifth** occasion on which an
authorization existed and the queue did not reflect it, leaving the Supervisor idling on a healthy-looking
"no READY task". If T-A is authorized in a message but not reconciled into `CLAUDE-TASKS.md`, that will be
the sixth.

---

## 9. Limitations of this record, stated plainly

- **EPA-0004 is PROPOSED and carries no architectural authority.** Nothing in it may be built.
- **No verification by execution was possible.** The task is documentary; there is no test count, and
  none is claimed.
- **The size judgment in EPA-0004 §10 is a judgment, not a measurement.** It should not be quoted as an
  estimate.
- **PR4, PR5 and PR6 remain UNKNOWN** — no inference runtime, no corpus survey, no capacity
  measurement. Each is recorded as unknown rather than assumed.
- **`origin/main` could not be independently confirmed.** `git fetch` is off this runner's allowlist,
  so the remote ref is as the Supervisor's own fetch last left it. This is the BLK-0006 limit; it is
  recorded, not routed around.

---

## 10. Files changed

| File | Change |
|---|---|
| `implementation/architecture/EPA-0004-employee-policy-assistant-work-package-definition.md` | **New** — the deliverable |
| `implementation/architecture/README.md` | EPA-0004 registered; the stale MSG-0057 note on EPA-0003 corrected |
| `implementation/comms/MSG-0061-task-0022-execution-record.md` | **New** — this record |
| `implementation/comms/README.md` | MSG-0061 registered |
| `implementation/operations/CLAUDE-TASKS.md` | TASK-0022 READY → COMPLETE (awaiting acceptance); MSG-0061 added to the ledger; **no task marked READY** |
| `implementation/operations/checkpoints/TASK-0022.md` | **New** — checkpoints 1 and 2 |
| `implementation/status/current.md` | Reconciled to the state above |

The commit SHAs are recorded in checkpoint 2, which is written **after** the push is verified rather
than in anticipation of it. TASK-0021's checkpoint recorded a push as successful before it was
attempted and the push was then rejected (BLK-0006); that is the mistake this ordering prevents.
