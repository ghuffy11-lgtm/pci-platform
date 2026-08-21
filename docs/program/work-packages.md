# PCI Initial Work Packages

**ID:** PLAN-WP-0001  
**Status:** Active

## 0. Register reconciliation — read this before using a number from the list below

**Added 2026-08-21 by TASK-0023 under MSG-0063. No entry below was renumbered, renamed, or deleted.**

This file and `docs/program/work-packages/` are **two different things**, and for a long time nothing
said so:

| | This file (`PLAN-WP-0001`) | `docs/program/work-packages/` |
|---|---|---|
| What it is | The **forward planning list** — eight intended work packages, written before delivery began | The **canonical register of actual work packages**, one record file each |
| Authority | Planning intent | **Canonical**, designated by **MSG-0005** |
| WP-0001 means | "Knowledge Foundation" — a modelling exercise | **"PCI Kernel Foundation"** — the transactional kernel built, verified on real infrastructure, and declared COMPLETE by MSG-0022 / MSG-0023 |

**They disagree about what WP-0001 is**, and the delivered record wins on authority (MSG-0005). This
was recorded as [`DISC-0010`](../../implementation/discoveries/DISC-0010-work-package-register-disagreement.md)
and is reconciled here rather than resolved by renumbering — **historical WP-0001 is preserved exactly
as delivered**, which MSG-0063 acceptance criterion 2 requires.

**Allocation rule, effective 2026-08-21.** A new work package takes the **next number unused in either
register**, and its record is created in the canonical directory `docs/program/work-packages/` as
`WP-NNNN-<slug>.md`. Numbers already spoken for by the planning list below are **not** reused, even
though no delivered record exists for them — reusing one would produce two different work packages
with the same identifier, which is the collision this rule exists to prevent. This mirrors the COMMS
numbering convention adopted in MSG-0035 decision 2.

**What is still open, and deliberately not decided here:** which entries below WP-0009 satisfies,
supersedes, or sits beside is a **program-structure judgment reserved to the Architecture Lead**.
MSG-0062 §7.1 settles the *number*; it does not settle the *plan*. DISC-0010 lists the four options.
Nothing is blocked by leaving it open.

**Practical consequence: do not infer work-package identity from the list below.** It is a plan, and
its numbering has not tracked what was delivered.

---

## Allocated work packages

| ID | Title | Record | Status |
|---|---|---|---|
| **WP-0001** | **PCI Kernel Foundation** | [`work-packages/WP-0001-kernel-foundation.md`](work-packages/WP-0001-kernel-foundation.md) | **COMPLETE** — MSG-0022 / MSG-0023 |
| **WP-0009** | **Employee Policy Assistant** | [`work-packages/WP-0009-employee-policy-assistant.md`](work-packages/WP-0009-employee-policy-assistant.md) | **DEFINED — NOT AUTHORIZED FOR IMPLEMENTATION** (MSG-0062 accepts the definition; MSG-0063 authorizes no implementation) |

WP-0009 was allocated by TASK-0023 as the next number unused in either register — WP-0002 … WP-0008
are spoken for below. Its accepted definition is `EPA-0004`.

---

## The planning list — unchanged

**Retained exactly as written.** These are planning intents, not delivered work packages, and none has
a record in the canonical directory.

## WP-0001 — Knowledge Foundation

Define and validate the canonical Reality Model, Knowledge Object semantics, relationships, provenance, lifecycle, and interchange strategy.

**Exit:** model reviewed, examples validated, storage-independent semantics documented.

## WP-0002 — Repository and Engineering Platform

Establish code layout, CI, testing conventions, dependency policy, release strategy, and developer tooling.

**Exit:** reproducible development environment and CI baseline.

## WP-0003 — Platform Runtime Foundation

Implement configuration, secrets, identity integration boundary, service discovery, health checks, and observability.

**Exit:** minimal platform runtime deploys reproducibly and is observable.

## WP-0004 — Knowledge Service

Implement canonical object storage/query APIs behind the approved semantic model.

**Exit:** create/read/update/query/relationship operations work with validation and audit.

## WP-0005 — AI Runtime Abstraction

Create an abstraction for local/approved model runtimes. Initial runtime may be Ollama, but business logic must not depend on Ollama-specific behavior.

**Exit:** model can be changed without rewriting platform business capabilities.

## WP-0006 — Agent Execution Foundation

Implement governed agent identity, tool registration, authorization, planning, execution, validation, and evidence capture.

**Exit:** a controlled agent can complete a non-destructive task end-to-end.

## WP-0007 — Network Operations Capability

Enable governed network discovery, configuration generation, diff review, approval, execution, and post-change validation.

**Exit:** a lab switch can be safely configured through the agent workflow with full evidence.

## WP-0008 — Customer Zero Integration

Integrate selected real organizational systems and validate the Reality Model against operational use cases.

**Exit:** measurable operational value in a real environment.
