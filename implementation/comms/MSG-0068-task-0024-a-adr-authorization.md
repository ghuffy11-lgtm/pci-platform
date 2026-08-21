# MSG-0068 — TASK-0024 Authorization: A-ADR

**Status:** AUTHORIZED  
**Authority:** Architecture Lead  
**Related:** MSG-0062, MSG-0067, WP-0009, TASK-0024

## Decision

Authorize **TASK-0024 — A-ADR: Draft the required Employee Policy Assistant ADR set** as the next bounded architecture task.

A-ADR is required before T-A because WP-0009 §6.2 and §7.2 require the architecture to be made enforceable before implementation. The task shall draft only the ADRs required by the accepted architecture and allocate ADR numbers by the repository's established convention at drafting time.

## Scope

TASK-0024 shall:

- review the accepted EPA-0004/WP-0009 decisions and existing accepted ADRs;
- determine the minimal enforceable ADR set described by WP-0009 §7.2;
- draft the required ADRs, without duplicating or modifying accepted ADRs;
- allocate ADR numbers according to the repository convention at drafting time;
- preserve the existing identity boundary (ADR-0007 / OIDC-OAuth2);
- preserve the T-D-before-T-E ordering and synthetic/non-confidential T-D interim constraint from MSG-0067;
- preserve the no-retrieve-then-suppress confidentiality boundary;
- preserve English authority / Arabic approved-translation semantics and cross-language fail-closed grounding;
- preserve session-default question retention and employee-only conversation access;
- preserve the inference-locality/provider boundary;
- record any genuine unresolved architecture issue rather than inventing a decision.

## Forbidden

No product implementation, provider/model/framework/runtime selection, deployment, permissions change, Supervisor change, scheduling change, production corpus ingestion, or downstream implementation task authorization.

TASK-0024 may not mark T-A or any other implementation task READY.

## Acceptance

1. Existing accepted ADRs are identified and not duplicated or modified.
2. The minimal required ADR set is justified against WP-0009 §7.2.
3. ADR numbering follows repository convention and does not collide with existing ADRs.
4. Each drafted ADR has traceable authority to the accepted EPA-0004/WP-0009 decisions.
5. No implementation is authorized.
6. The resulting ADR set is committed and recorded in COMMS.

## Queue requirement

TASK-0024 must be reconciled into `implementation/operations/CLAUDE-TASKS.md` as the **single READY task** before the Supervisor may execute it.
