# MSG-0067 — Architecture Lead Ruling: WP-0009 Planning Relationship and Remaining Rulings

**Status:** DECIDED
**Authority:** Architecture Lead
**Related:** MSG-0066, MSG-0062, MSG-0063, DISC-0010, WP-0009

## Ruling

### 1. T-D / T-E interim exposure

**DECISION:** T-D testing is authorized only against synthetic or otherwise non-confidential test documents. No real company/confidential corpus may enter the T-D path until T-E retrieval-time authorization is implemented and verified.

This converts the carried-forward proposal in MSG-0066 §6.1 into an Architecture Lead ruling. It does not authorize implementation by itself and does not weaken the existing fail-closed retrieval authorization boundary.

### 2. PR3 identity-provider dependency

**DECISION:** Use the organization's existing Microsoft/Active Directory identity infrastructure through the already-established OIDC/OAuth2 integration boundary. PCI will not build an identity provider and will not bypass the ADR-0007 boundary with direct LDAP/Kerberos integration.

The owner and deployment date are organizational scheduling dependencies. If the repository does not establish them, they remain unresolved scheduling data rather than an architecture gap or an invented commitment. PR3 remains an operator/organization prerequisite (T-0) for identity-dependent work.

### 3. WP-0009 versus PLAN-WP-0001

**DECISION:** WP-0009 **sits beside** the existing PLAN-WP-0001 planning entries. It does not satisfy, supersede, rename, or renumber them.

Reasoning from the authoritative records:

- `docs/program/work-packages.md` explicitly defines PLAN-WP-0001 as a forward planning list and `docs/program/work-packages/` as the canonical register of actual work packages; MSG-0005 makes the latter authoritative.
- DISC-0010 records the four possible treatments and explains that options 1 and 2 would make a substantive program-structure choice. TASK-0023 therefore correctly left that question open while allocating WP-0009.
- WP-0009 was explicitly authorized as a **new work package rather than being forced into the conflicting WP-0001/WP-0002 planning labels** (MSG-0062 §7.1).
- EPA-0004/WP-0009 describes a distinct employee-facing policy-assistant capability with its own gates, dependencies, architecture tasks, and security boundaries. It therefore should not be retroactively treated as the implementation of PLAN-WP-0003, WP-0004, or WP-0005 merely because those planning entries describe platform capabilities it may depend on or use.

Accordingly, the planning entries remain forward-looking program structure; WP-0009 is the canonical delivered work-package identity for this capability. Where implementation later consumes platform capabilities represented by the planning list, those are dependencies/interfaces, not evidence that WP-0009 has replaced those planning packages.

## Result

The three carried-forward items in MSG-0066 are resolved to the extent requiring Architecture Lead judgment:

- T-D/T-E interim handling: **DECIDED**.
- PR3 architecture boundary: **DECIDED**; owner/date remain organizational scheduling data where not established by repository authority.
- WP-0009 planning relationship: **DECIDED — sits beside PLAN-WP-0001 entries**.

No implementation is authorized by this message. No task is marked READY. The next action is to reconcile this ruling into the governed status/queue records and then authorize the next bounded architecture task, subject to its prerequisites.
