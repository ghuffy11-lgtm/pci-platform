# WP-0001 Execution Roadmap — A → Z

**Scope:** from the current post-bootstrap state through genuine WP-0001 completion.
**Authority:** WP-0001 work package, ADR-0015, ADR-0016, `docs/operations/pci-server-bootstrap.md`
v0.2, MSG-0005, MSG-0006, MSG-0007, MSG-0009.
**Status:** current as of 2026-08-19.

This roadmap describes only work derivable from accepted architecture, the active work package,
recorded communications, blockers, discoveries, and the actual state of the repository and host.
**No future architecture is invented here.** Where a decision is missing, the roadmap stops at that
boundary and names who must decide.

---

## A. Where we actually are

Verified on the authorized host, 2026-08-19 (evidence: WP-0001 report section 11):

| Fact | State |
|---|---|
| `/data/pci-platform` | exists, `claude:claude`, repository cloned |
| Bootstrap | **executed successfully** by the operator |
| Docker | 29.1.3, active, `DockerRootDir` = `/data/docker` |
| PostgreSQL | running as a container, volume inside `/data/docker` |
| Test suite | **229 pass / 0 fail** — 102 unit, 101 contract, 26 integration |
| Acceptance criteria | **all ten MET** |
| Open blockers | none |
| Open communications | none |

**And the qualifier that shapes everything below:** the verified state was reached with two manual
steps that do not exist in the repository. A clean checkout plus `docker compose up` still produces
a broken stack. WP-0001 is **verified, not deployable**.

---

## B. What stands between here and completion

Two defects, both found by running the stack for the first time:

| ID | Defect | Severity | Consequence |
|---|---|---|---|
| DISC-0007 | Database init creates `pci_app` before the guard meant to prevent a passwordless role; the exception does not stop initialisation; the stack reports healthy with an unusable role; nothing is granted; `pci_test` is never created | **High** | The stack cannot provision its own access control |
| DISC-0008 | Compose `kernel` service sets `PCI_IDENTITY_MODE=static` but never supplies `PCI_STATIC_PRINCIPALS` | Medium | The service cannot start as committed |

Neither weakens the verified kernel. Both block *reproducibility*, which the WP-0001 completion rule
requires: a work package whose deployment artifacts only work after undocumented manual surgery is
not complete.

---

## C. Execution sequence

```text
        [COMPLETE]                    TASK-0001  WP-0001 verification on the host
             |
             v
   +---------+---------+
   |                   |
   v                   v
TASK-0004           TASK-0005          fix DISC-0007      fix DISC-0008
(role provisioning) (compose identity)  |                  |
   |                   |                |                  |
   +---------+---------+                +--------+---------+
             |                                   |
             v                                   |
        TASK-0006  clean-room reproducibility <--+
             |     (destructive: volume re-init)
             v
        TASK-0007  full re-verification after fixes
             |
             v
        TASK-0008  final report and status reconciliation
             |
             v
        TASK-0009  WP-0001 completion decision  [architecture lead]
```

`TASK-0003` (line-ending normalisation, DISC-0006) is independent of this chain and may be
scheduled at any point once authorized.

---

## D. Dependencies

| Task | Depends on | Why |
|---|---|---|
| TASK-0004 | TASK-0001 | The defect was found by it, and its evidence defines the fix |
| TASK-0005 | TASK-0001 | Same |
| TASK-0006 | TASK-0004 **and** TASK-0005 | A clean-room run tests both fixes at once; running it earlier proves nothing |
| TASK-0007 | TASK-0006 | Re-verification is meaningful only against a cleanly provisioned stack |
| TASK-0008 | TASK-0007 | The report records real results, not expected ones |
| TASK-0009 | TASK-0008 | The lead decides on a reconciled record |

TASK-0004 and TASK-0005 are independent of each other and may run in either order.

---

## E. Verification gates

No task passes its gate on intention. Each gate is an observation.

| Gate | Belongs to | Passes when |
|---|---|---|
| **G1 — role provisioning** | TASK-0004 | On a **freshly initialised** volume, `pci_app` exists with a password, `super=false`, `bypassrls=false`, holds exactly the privileges it needs, and no manual SQL was run |
| **G2 — service start** | TASK-0005 | `docker compose up kernel` reaches healthy from a clean checkout with documented setup only; the fail-closed guard is **not** relaxed |
| **G3 — clean room** | TASK-0006 | From a fresh volume: `docker compose up` → PostgreSQL healthy → migrations applied → kernel healthy, with **zero** manual database or environment surgery |
| **G4 — full suite** | TASK-0007 | All three tiers pass with **non-zero** counts on the target platform; integration ≥ 26 tests; ADR-0016 obligations re-proven |
| **G5 — record** | TASK-0008 | Report, status, queue, blockers, communications, and `origin/main` all describe the same state |

**A tier reporting zero tests is a failure, not a pass** (`CLAUDE.md` Rule 10). Exit code 0 is not
evidence.

---

## F. Architecture boundaries

Claude Code may not cross these; it stops and records instead.

- **No new architecture.** ADR-0015 and ADR-0016 are accepted and scoped: ADR-0015 covers the kernel
  only, ADR-0016 excludes system-tenant governance from WP-0001.
- **No relaxation of a fail-closed guard** to make a stack start. DISC-0008's option 3 (defaulting
  to a no-principal mode) is recorded and explicitly not recommended for this reason.
- **No change to accepted documents** without a recorded architecture-lead instruction.
- **No new top-level code area** without an approved work package or ADR.
- **No next work package** until WP-0001 is declared complete by the architecture lead.
- **No credential in the repository**, ever (ADR-0009). `.env.example` may hold only clearly fake
  placeholders.

## G. Operator boundaries

Work requiring the operator, because Claude Code cannot and must not do it:

| Need | Why | Where recorded |
|---|---|---|
| `sudo` on the PCI server | Password required; must not be handled by this environment | BLK-0004 (resolved), MSG-0008 (closed) |
| Destroying the PostgreSQL volume | Destructive and irreversible; Rule 9 requires explicit authorization | TASK-0006 |
| Registering credentials | Passphrases and tokens belong to the operator | BLK-0002, BLK-0003 (both resolved) |

Everything else in this roadmap runs unprivileged as `claude` inside `/data`.

## H. The `/data` boundary — applies to every task

No PCI project artifact outside `/data` on the PCI server: no clone, copy, build output, cache, log,
or temporary file. Workspace is `/data/pci-platform`; all persistent runtime state is under
`/data/docker`. `~/.ssh` is exempt as infrastructure credentials. If a path outside `/data` is
needed, that is a stop condition, not a decision.

---

## I. WP-0001 completion criteria

WP-0001 is complete only when **all** of these hold, each with recorded evidence:

1. All ten acceptance criteria met — **already true** (report section 11).
2. The stack is reproducible: a clean checkout plus documented setup yields a working system with no
   manual surgery — **not yet true** (DISC-0007, DISC-0008).
3. All three test tiers pass on the target platform with non-zero counts — **already true**, to be
   re-confirmed after the fixes.
4. ADR-0016 obligations proven against a live database — **already true**, to be re-confirmed.
5. Security requirements checked: no credential in the repository, runtime role without SUPERUSER or
   BYPASSRLS, audit append-only, no secret in logs or health output.
6. Migrations and configuration documented.
7. Operational impact considered and recorded.
8. Status, blockers, communications, report, and `origin/main` reconciled.
9. Unresolved limitations explicitly recorded — currently: images tag-pinned rather than
   digest-pinned; the static identity adapter is a development fixture prohibited in production.
10. **The architecture lead declares it complete.** Claude Code does not self-certify completion.

Criteria 1, 3, and 4 are met today. Criterion 2 is the substance of the remaining work.

---

## J. What is deliberately not in this roadmap

- Any work package after WP-0001. Nothing may begin until WP-0001 is declared complete.
- Digest-pinning images, OIDC identity, system-tenant governance, and production deployment. These
  are recorded limitations or explicitly out of WP-0001 scope; each needs its own authorization.
- Removal of the legacy `knowledge/` duplicates — MSG-0005 designates that a separate controlled
  cleanup.

---

## K. Execution infrastructure (TASK-0010)

Not part of the WP-0001 chain — infrastructure that changes *when* authorized work starts, never
*what* is allowed.

**Execution Supervisor**, at `implementation/operations/supervisor/`. Runs on the **Windows
development machine only**; it has no SSH code path and cannot reach the PCI server. Every ten
minutes it reconciles with `origin/main`, parses the queue, and starts an authorized Claude runner
only when a READY task exists and no runner is active. Every uncertainty — unreachable remote,
unparseable or contradictory queue, existing or corrupt lock, any unhandled error — results in doing
nothing, logged and heartbeated.

**Status: implemented, tested (17/17), NOT installed and NOT enabled.** Three independent settings
must change before anything runs unattended: `enabled`, `dryRun`, and an empty `runnerCommand`.
Whether to run unattended sessions at all is an operator decision, recorded in MSG-0011.

The supervisor cannot mark a task COMPLETE, change a status or priority, or authorize anything. **The
repository queue remains the sole authority**, and periodic reconciliation remains authoritative — a
webhook, if ever added, may only reduce latency, because a missed webhook is silent and silence is
indistinguishable from "nothing to do".
