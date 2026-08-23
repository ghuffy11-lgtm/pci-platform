# MSG-0113 — Architecture Lead Ruling: Q7 Freshness/Security

**Status:** DECIDED
**Authority:** Architecture Lead
**Related:** MSG-0112 §2/§7, ADR-0020 §1 / §3.2 / deliberately-not-decided-here section, EPA-0006 §4.9

## 1. Ruling

Q7 is resolved as a **version-transition freshness/security requirement**, not an arbitrary elapsed-time SLA.

When an authorized policy or procedure is manually updated, approved, revoked, or superseded, the previous version must no longer be used for employee answers once the change is recorded. The retrieval system must use the newly approved version. If the current approved version cannot be established or made available to retrieval, the system must abstain rather than answer from the stale version.

## 2. Technical interpretation

The required mechanism is an authoritative-version transition with fail-closed availability semantics:

1. The governance/kernel record is authoritative for the current approved version and its lifecycle state.
2. A policy transition must invalidate or supersede the retrievable prior version as part of the recorded transition, rather than relying solely on a periodic timer.
3. Retrieval must resolve against the current approved version; stale materialization is not authoritative after the transition is recorded.
4. If the new approved version is not available to the retrieval layer, the answer path must abstain.
5. The existing kernel re-check remains mandatory and must be demonstrated against the authoritative current state.
6. Any physical/partitioned representation must carry sufficient version/lifecycle identity to prove that the candidate is current; physical isolation does not excuse stale-version use.

No numeric threshold is introduced by this ruling. A time bound may be evaluated only if a candidate architecture requires one as an enforcement mechanism, and it must not replace the business requirement above.

## 3. Evidence required

Future evidence must demonstrate at minimum:

- an approved-version transition from V1 to V2;
- V1 is usable before the transition;
- after the authoritative transition is recorded, V1 is not usable for an employee answer;
- V2 is used when it is available;
- if V2 is unavailable, retrieval/answering abstains rather than falls back to V1;
- revocation and supersession exercise the same fail-closed behavior;
- the kernel re-check observes the authoritative lifecycle/version state;
- any materialized/partitioned index is shown not to permit stale V1 use after the transition.

Evidence must distinguish **transition-triggered freshness** from ordinary periodic re-materialization. Passing a fixed-time test alone does not establish the requirement.

## 4. Existing verdicts and boundaries

- TASK-0035 and MSG-0104 verdicts remain unchanged.
- G-Q5 remains a necessary prerequisite and is strengthened by this Q7 interpretation; it does not receive a new numeric threshold.
- Strict Shape-1 remains "examines nothing unauthorized."
- No retrieval engine, runtime, provider, model, index technology, or physical implementation is selected.
- No product implementation or deployment is authorized.
- No accepted ADR is modified by this ruling.

## 5. Next bounded action

Authorize a bounded evidence task to evaluate **version-transition freshness and stale-version fail-closed behavior** against the candidate retrieval architectures. The task must produce execution evidence for update/approve/revoke/supersede transitions and the unavailable-new-version abstention case.

The task must not select or deploy an engine. It must stop at evidence and clearance status.
