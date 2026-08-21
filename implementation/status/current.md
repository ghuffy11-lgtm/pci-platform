# PCI Implementation Status

**Active Work Package:** WP-0001 — PCI Kernel Foundation
**Status:** **COMPLETE** — declared by the architecture lead 2026-08-19 (MSG-0020(b), resolved by MSG-0022 / MSG-0023, TASK-0009)
**Last Updated:** 2026-08-21 UTC (MSG-0058 rules the MSG-0057 findings; MSG-0059 authorizes TASK-0022; TASK-0022 reconciled into the queue as the single READY task — MSG-0060)

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

**Current task: TASK-0019 — the post-WP-0001 repository baseline audit, authorized by MSG-0050 and
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
| TASK-0002 | Make test entry points shell-independent | **ABORTED** | — | — |

**No task is READY** — but the reason has changed. The project now sits at an **architecture decision
boundary**, not at an empty queue.

> **Superseded — corrected 2026-08-21 by TASK-0021.** This paragraph previously read "**No task is
> READY.** TASK-0019 was the last authorized one and it is COMPLETE. What happens next is an
> architecture-lead decision: MSG-0051 §C lists the candidates …". That was true when written and
> stopped being true when MSG-0053 closed C6/C7 and MSG-0054 authorized TASK-0021. TASK-0021 has since
> been executed and is COMPLETE (MSG-0055). MSG-0051 §C is fully discharged: C1–C5 by MSG-0052,
> C6–C7 by MSG-0053.

What happens next is the architecture lead's: **fourteen decisions in
[`../architecture/EPA-0003-required-decisions.md`](../architecture/EPA-0003-required-decisions.md)**,
of which four are marked Highest and are enough to unblock the foundation — D1 (bilingual policy
authority), D3 (approval authority and audience assignment), D5 (grounding-gate mechanism), and D13
(identity provider, which is an **unmet prerequisite** rather than a preference). None was
self-authorized.

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

**MSG-0052 applied (2026-08-21).** The Architecture Lead ruled on the TASK-0019 audit referrals:
C1 — the accepted WP-0001 work package now reads `Status: COMPLETE`, closing the last conflict
between accepted authority and current state; C2 and C3 — `CLAUDE.md` and `ARCHITECTURE-LEAD-CONTEXT.md`
carry explicit supersession notes, with no supervisor behaviour, permission, or schedule changed;
C4 and C5 — no action, deliberately. **C6 (a bounded proof of MSG-0049 option B) and C7 (the next
work package) remain the Lead's to decide and are not self-authorized.**

**One message carries `Status: OPEN`: MSG-0060**, the TASK-0022 queue reconciliation. It is
informational and blocks nothing — it records that TASK-0022 is now the single READY task, and
that a fifth number collision occurred, this time on an **executable task specification** rather
than a message.

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

**None.** BLK-0001 through **BLK-0006** are all RESOLVED.

**BLK-0006 was resolved on 2026-08-21 by the interactive session**, the same day TASK-0021 raised it.
The unknown that forced the stop is now a fact: the concurrent actor was the architecture lead
pushing `182698c` — **MSG-0056**, the EPA decision ruling — directly between TASK-0021's two pushes.
The blocker record inferred exactly that and labelled it as inference; the inference was right.

Reconciled by option 1, the cheapest of the three the record offered: `git fetch origin` then
`git rebase origin/main`. The file overlap was checked first and was **empty** — `182698c` touches
only `implementation/comms/MSG-0056-*.md`, which neither stranded commit touches — so no conflict was
possible and none occurred. **No force-push. No published history rewritten**: both rebased commits
were unpushed, and `b96187b` carrying the TASK-0021 deliverable remains an untouched ancestor of HEAD.

The stranded work turned out to be two commits rather than the one the record could see at the time:
DISC-0010 with its index rows, and BLK-0006 itself. Both are now on `origin/main`.

> **Why the unattended session stopped and this one did not.** The runner could not read the remote
> at all — `git fetch` is off-allowlist and `git ls-remote` was refused — so reconciliation would
> have meant acting against a base it could not name. Stopping was correct, and its "Note for a
> resuming session" is why resumption cost minutes. The interactive session can read the remote, so
> the base is observed rather than assumed. The boundary did not move; the available evidence did.

> **The former text of this section, retained:** "**One: BLK-0006, raised 2026-08-21 by TASK-0021** …
> A human must inspect the remote and choose among the three options … None was taken." That was
> accurate while the remote was unknown. Superseded by the resolution above, not deleted.

> **The former text of this section, retained:** "**None.** BLK-0001 through BLK-0005 are all
> RESOLVED." That remains true of those five and is preserved below; it stopped being the whole
> picture when BLK-0006 was raised.

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

**TASK-0022 is READY and is the single READY task. Execution is authorized; the Supervisor may start
it.** This is the first READY task since TASK-0021 completed.

**What changed.** MSG-0058 ruled all three MSG-0057 findings, each as recommended, and set the gate:
the architecture-definition findings are *"sufficiently resolved to proceed to the next
architecture/work-package authorization task."* MSG-0059 then authorized **TASK-0022** — the bounded
work-package definition for the Employee Policy Assistant.

**The precondition MSG-0059 set has been satisfied.** It required TASK-0022 to be the single READY
task on the board before the Supervisor may execute it, and said the Supervisor must remain idle
until then. TASK-0022 was absent from the queue entirely — the fifth recurrence of the MSG-0044
structural gap — and is now reconciled in. Verified by a dry run against a forced-`dryRun` config:
`DRY_RUN: would start TASK-0022`, `readyTask=TASK-0022`, no lock created (MSG-0060).

### What TASK-0022 may and may not do

It is **architecture/work-package definition only.** It defines scope, boundaries, implementation
gates, acceptance criteria, dependencies, security checkpoints, threat-model coverage, and a
dependency-ordered implementation task sequence.

It may **not** implement, select a provider or model, change accepted ADRs, change permissions,
security boundaries, scheduling, or Supervisor behaviour, or perform privileged operations. **It may
not mark any implementation task READY** — queue changes are recommendations only. The Architecture
Lead must review and accept its output before any implementation task is authorized.

### The binding rulings it inherits

- **English is authoritative**; Arabic is an approved translation/access language.
- **Cross-language grounding is in scope and fail-closed.** A failed Arabic grounding gate must
  **abstain** — never silently fall back to an English answer, never present an unofficial rendering
  as policy. The Arabic acceptance bar is evaluated separately under SPEC-0020.
- **Unauthenticated access is deferred** from the first release; no new trust boundary is introduced.
- **Directory integration terminates at the ADR-0007 OIDC/OAuth2 boundary.** Entra ID, AD FS, or an
  OIDC broker may front an existing directory; **direct LDAP/Kerberos implementation is not
  authorized.**
- **Only approved/published documents are authoritative sources.**
- **Session-only retention is the default**, with configurable retention support.

### One thing the next session must know

**Two files specify TASK-0022**, and both are authoritative. They agree on scope, authorization,
forbidden actions and acceptance gate, but each carries content the other lacks — spec A the stop
conditions and the recommendations-only constraint, spec B a ten-item outcome list. The queue section
carries the **union** and links both. Neither was renamed, per MSG-0058 F4.

**Read both.** A runner that reads one silently loses half its instructions and would report success
against the half it read (MSG-0060).

### Operational note

The Windows `Schedule` service was stopped by the operator on 2026-08-21, so the Supervisor's
ten-minute cadence is inert. Cycles run only when triggered manually until that service is restarted;
the start path itself is unchanged and proven.

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
