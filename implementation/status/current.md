# PCI Implementation Status

**Active Work Package:** WP-0001 — PCI Kernel Foundation
**Status:** **COMPLETE** — declared by the architecture lead 2026-08-19 (MSG-0020(b), resolved by MSG-0022 / MSG-0023, TASK-0009)
**Last Updated:** 2026-08-20 (TASK-0011 — Supervisor smoke test and full record reconciliation)

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

**Current task: none is READY.** TASK-0001 and TASK-0003 through TASK-0011 are COMPLETE. TASK-0003
was authorized by MSG-0027, executed on 2026-08-20 by a supervisor-started session, and completed
later the same day once MSG-0030 authorized the refresh command — CRLF residue 150 -> 0, accepted in
MSG-0031. TASK-0011, the Supervisor smoke test, completed 2026-08-20 (MSG-0032).

| ID | Task | Status | Depends On | Owner |
|---|---|---|---|---|
| TASK-0001 | WP-0001 verification on the authorized host | **COMPLETE** | — | Claude Code |
| TASK-0004 | Fix database role provisioning (DISC-0007) | **COMPLETE** — G1 passed | TASK-0001 | Claude Code |
| TASK-0005 | Fix compose kernel service configuration (DISC-0008) | **COMPLETE** — G2 passed | TASK-0001 | Claude Code |
| TASK-0006 | Clean-room reproducibility verification | **WAITING_FOR_ARCHITECTURE_LEAD** — deps met | TASK-0004 ✅, TASK-0005 ✅ | Architecture lead (destructive authorization) |
| TASK-0007 | Full re-verification after fixes | **COMPLETE** — G4 passed | TASK-0006 | Claude Code |
| TASK-0008 | Final report and status reconciliation | **COMPLETE** — G5 passed | TASK-0007 | Claude Code |
| TASK-0009 | WP-0001 completion decision | **COMPLETE** — WP-0001 declared complete | TASK-0008 | Architecture lead |
| TASK-0003 | Normalise `*.md` line endings (DISC-0006) | **COMPLETE** (2026-08-20) — CRLF 150 -> 0, accepted in MSG-0031 | — | Claude Code |
| TASK-0010 | Execution Supervisor (installed and **ENABLED**) | **COMPLETE** | — | Claude Code |
| TASK-0011 | Execution Supervisor smoke test — COMMS audit, end to end | **COMPLETE** (2026-08-20) — passed, MSG-0032 | TASK-0010 ✅ | Claude Code |
| TASK-0002 | Make test entry points shell-independent | **ABORTED** | — | — |

**No task is currently READY.** TASK-0011 was terminal by its own terms: "after it completes there
will be no READY task unless the architecture lead explicitly authorizes another one."

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

**No message is OPEN.** Every communication is answered, decided, or closed. Every task is COMPLETE
except TASK-0002, which is ABORTED because its premise was disproven by measurement.

**Two findings do await a ruling**, both raised in MSG-0032 §6 by the TASK-0011 audit. Neither is an
OPEN *message* and neither blocks anything, so they are listed here rather than reopening a message:

1. **§6.2 — the blocker register contradicts this file.** `implementation/blockers/README.md` shows
   BLK-0001 and BLK-0004 **OPEN**; the Open Blockers section below says all are RESOLVED. The
   evidence favours this file (MSG-0008 closed, host bootstrapped, 229 tests run on it), but the
   README's own rule says an acceptance criterion covered by an open blocker must never be reported
   as met — so as literally recorded, WP-0001's criteria are reported met while its index shows two
   High blockers open. Correcting a blocker status is substantive, so TASK-0011 stopped at that
   boundary rather than editing it. **Authorization requested to update the README.**
2. **§6.3 — duplicate message numbering has now happened twice**, MSG-0020 and MSG-0033. The first
   pair contradicted each other and cost three messages to resolve; the second agrees and cost
   nothing. No allocation rule prevents a third. **A ruling is requested** on whether to add one to
   the COMMS protocol; Claude Code proposes but does not adopt one.

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

## Repository / GitHub State

**The communication channel is operational.** Verified 2026-08-20 at the start of TASK-0011:

```text
HEAD          479dfa9   fix(supervisor): fast-forward when strictly behind; log every cycle start
origin/main   479dfa9
git status -sb  ## main...origin/main      (clean, no ahead/behind)
```

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

**None.** BLK-0001 through BLK-0005 are all RESOLVED. BLK-0005 was closed by MSG-0022 / MSG-0023,
which ruled that the COMPLETE decision stands and that TASK-0012 is not authorized.

There are no open blockers. The two defects found during verification (DISC-0007, DISC-0008) are
recorded as discoveries with proposed tasks, not as blockers: nothing is prevented from proceeding,
but the deployment artifacts are not yet correct.

> **Unreconciled — flagged by TASK-0011, deliberately not fixed.**
> `implementation/blockers/README.md` still lists **BLK-0001 and BLK-0004 as OPEN**, contradicting
> the paragraph above. The evidence favours this file: MSG-0008 is CLOSED, the operator executed the
> bootstrap on 2026-08-19, `DockerRootDir` = `/data/docker` was verified directly, and 229 tests ran
> on the host — none of it possible with an unbootstrapped host, which is what BLK-0001 and BLK-0004
> assert. The individual blocker files were resolved; the index was never updated with them.
>
> Changing a blocker status is a substantive change to the project record, not a typo fix, and it
> lies outside TASK-0011's authorized scope — so TASK-0011 stopped at that boundary and recorded it
> instead. **Authorization is requested in MSG-0032 §6.2.** Until it is given, a reader should treat
> the blocker README as the stale record and this section as correct, but should not assume that
> reading is authorized.

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
after the change: none removed. `CLAUDE.md` is now 415 lines.

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

| ID | Subject |
|---|---|
| DISC-0001 | Governance documents duplicated across `knowledge/` and `docs/` |
| DISC-0002 | In-memory adapter test-fidelity gap |
| DISC-0003 | Development identity adapter boundary |
| DISC-0004 | Compose stack predates the `/data/docker` boundary |
| DISC-0005 | `npm test` reports success while running zero tests under POSIX shells |
| DISC-0006 | CRLF line endings silently defeat anchored text edits — **RESOLVED** by TASK-0003, residue 150 -> 0 |
| DISC-0009 | Docker CLI writes client state to `/home/claude`, outside `/data` | **OPEN** |
| DISC-0007 | Init refuses to create a passwordless role, then creates one anyway | **RESOLVED** |
| DISC-0008 | Compose kernel service cannot start as committed | **RESOLVED** |

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

**No task is READY. Awaiting the architecture lead.**

WP-0001 is COMPLETE. TASK-0003 is COMPLETE (MSG-0031). **TASK-0011 — the last authorized task —
ran on 2026-08-20 and PASSED** (MSG-0032): the Supervisor selected the READY task, launched Claude,
Claude read shared repository state, produced this audit, and pushed it to GitHub with no human
relay. TASK-0011 was terminal by its own terms, so nothing follows it automatically.

Two things need the lead, neither blocking (both detailed in MSG-0032 §6):

1. **Authorize updating `implementation/blockers/README.md`**, which still shows BLK-0001 and
   BLK-0004 OPEN against all other evidence. TASK-0011 stopped rather than edit a blocker status.
2. **Rule on message-number allocation.** Duplicate numbering has now happened twice — MSG-0020
   (contradictory, cost three messages to resolve) and MSG-0033 (consistent, cost nothing).

Then: **authorize the next work package**, or a task, if any is intended. Nothing is in flight.

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
