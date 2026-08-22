# MSG-0093 — MSG-0092 Applied; TASK-0030 Reconciled as the Single READY Task

**Status:** **OPEN** — informational; no decision blocks TASK-0030
**Raised:** 2026-08-22
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Ruling application + queue reconciliation
**Authority:** MSG-0092 | **Related:** EPA-0005, ADR-0020, WP-0009 §6.2

---

## 1. What MSG-0092 settled, and where it is now recorded

**EPA-0005 is ACCEPTED** — as the architecture evaluation record **and** as the ruling record for the
runtime seam. Its header now records that, together with the three settled constraints and Approach C,
so a reader arriving at the file is not told it is an unaccepted proposal.

**The three §9.1 constraints are settled architecture constraints**, recorded as consequences of the
existing ADR set rather than as technology selections:

1. **Authorization is enforced inside the retrieval operation.** Retrieve-then-filter and
   over-fetch-then-filter are both unacceptable.
2. **Capacity planning assumes three local model workloads** — generation, multilingual embedding, and
   the entailment/grounding model.
3. **Conversation storage and audit storage stay separate**, with distinct readers and retention, and
   **Restricted policy passages must not enter ordinary application logs or telemetry.**

**Approach C is chosen** — two services along the C2/C6 seam. The governed application layer keeps the
authorization-critical path; a document/inference worker sits behind an explicit contract. **The worker
is not an authorization authority and makes no authorization decisions**; authorization remains in the
governed layer *before* retrieval, and SPEC-0008's boundary is preserved. **This is a stack-shape
decision and selects no runtime.**

**No generic stack ADR is created.** MSG-0092 §3 declined one, on the ground that manufacturing an ADR
to restate that selections remain open adds nothing.

## 2. EPA-0005 was not promoted, and that is deliberate

**It stays in `implementation/architecture/`.** MSG-0092 accepted it but did not authorize promotion to
`docs/`, and promotion is the Lead's act — the same distinction TASK-0025 turned on, where the ADR set
was accepted by MSG-0071 and promoted only after MSG-0073 authorized it separately.

The header says so explicitly, so a future reader does not mistake the location for a missing step.
**Its authority rests on MSG-0092**, not on its directory.

## 3. TASK-0030 — what it is, and the boundary it must not cross

**Reconciled as the single READY task.** MSG-0092 assigns no id, so **TASK-0030 was allocated here** and
verified unused. No separate `TASK-0030-*.md` file exists; MSG-0092 §3/§5 plus the queue section are the
specification.

**The objective is narrow:** draft the minimum clarification making ADR-0020's existing §3/§4
pre-constrained retrieval requirement explicit **as an engine-selection / gate criterion**, without
changing substantive policy.

**The gap is consequence, not policy.** ADR-0020 §4 is already titled *"No retrieve-then-suppress — the
rule this ADR exists for"*, and §3 already sets out four independently-sufficient enforcement points.
What it does not say in terms is that the rule **disqualifies any retrieval engine that cannot apply
authorization constraints inside the query**. That is what must become unambiguous, so a future engine
evaluation cannot satisfy the ADR on paper while planning to filter afterwards.

**The boundary: the task drafts and stops.** MSG-0092 §5 — *"stop before applying the amendment unless a
subsequent explicit authorization permits acceptance."* **ADR-0020 is accepted and promoted, so editing
it is the Lead's act**, and the queue section says so in those terms rather than leaving it implicit.

**One outcome is explicitly legitimate and worth naming in advance:** if §§3–4 turn out to state the
consequence unambiguously already, **reporting that no amendment is needed is a correct result**, not a
failure to produce one. A governance task that must produce an amendment will produce one whether or
not it is warranted.

## 4. What stays open, unchanged

MSG-0092 §4 keeps **nine** selection categories deliberately open — application framework/runtime,
retrieval/index engine, extraction toolchain, embedding model, generation model, entailment model,
local serving runtime, frontend framework, identity provider. **TASK-0030 touches none of them.**

**ADR-0019's Arabic normalization deferral is unchanged**, and MSG-0092 restates the scoping precisely:
the n=1 evidence is sufficient for bounded architecture testing and **does not become production corpus
evidence**. MSG-0090's gap therefore stands exactly as scoped by MSG-0091.

**T-0 and T-A…T-I remain unauthorized**, and MSG-0092 §5 forbids starting any of them, or any model or
engine selection, from that message.

## 5. Execution path — one operational fact

MSG-0092 §5 directs execution *"through the normal queue/supervisor path"*. **The scheduled task
`PCI-Execution-Supervisor` is currently Disabled**, so no unattended cycle will pick TASK-0030 up.

The supervisor path remains available by manual trigger — the same mechanism used for TASK-0021 and
TASK-0022, where the supervisor still made the selection and held the lock. **Re-enabling the schedule
is an operator action and was not taken.**

## 6. State

- **TASK-0030 is READY and is the single READY task.** Not started at the time of writing.
- **EPA-0005 ACCEPTED**, recorded in its header, **not promoted**.
- **No ADR was modified** — `docs/decisions/` untouched. No engine, model, or runtime selected.
- No blocker open. No implementation task authorized or READY.
