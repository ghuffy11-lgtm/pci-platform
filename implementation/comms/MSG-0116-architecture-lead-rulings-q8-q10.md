# MSG-0116 — Architecture Lead Rulings: Q8–Q10

**Status:** DECIDED
**Authority:** Architecture Lead
**Related:** MSG-0115, MSG-0113, MSG-0110, ADR-0018, ADR-0020, AMD-01, EPA-0006 §4.6–§4.10

## 1. Source verification

The Q8–Q10 referrals below were read from the actual TASK-0037 execution record, MSG-0115, as embedded in the TASK-0037 execution commit `382a58b4f25ca94d3dacae0915d1529617e740b1` and its subsequent checkpoint `2a28f7b3cff2d45c044710a7bb3610e95389aaae`.

No referral has been inferred from the summary.

## 2. Q8 — Does the mandatory ADR-0020 §3 point-2 re-check itself count as “examination” under strict Shape-1?

**Ruling: NO, provided the re-check is limited to authoritative authorization/lifecycle metadata and does not inspect unauthorized document content.**

Strict Shape-1 remains: the retrieval engine must not examine unauthorized **content**. ADR-0020 §3 point-2 simultaneously requires every hit to be re-authorized against the version's classification and audience. Reading the authoritative kernel's authorization/lifecycle record for that purpose is a control-plane authorization check, not retrieval of the unauthorized document body/content.

Therefore:

- The kernel re-check is **mandatory**, not optional.
- It must consult the authoritative current state, not a materialized copy.
- It may read authorization/version/lifecycle metadata needed to decide whether the candidate is authorized/current.
- It must not inspect unauthorized document content, payload, chunks, embeddings, or equivalent content-bearing representation as part of that check.
- A candidate that fails the check must be rejected/abstained before its content is used for the employee answer.
- The existing measured kernel-read count is therefore not, by itself, a Shape-1 violation; the security boundary is the content examination, not the bounded authorization metadata lookup.

This ruling preserves both existing authorities rather than creating a contradiction between AMD-01 and ADR-0020 §3.

## 3. Q9 — sharpening of EPA-0006 §4.7 Q3: what if no engine class reaches zero?

**Ruling: Q3 remains open and the strict bar is not relaxed.**

MSG-0115 provides evidence that every tested materialized design examined unauthorized rows when its copy diverged from the kernel, including divergence with zero elapsed time. It explicitly states that whether an in-query kernel join would change this was not measured.

Accordingly:

- Do not lower the `U = 0` / E1–E4 clearance bar.
- Do not treat a non-zero result as acceptable because it is invariant with collection size.
- Do not select an engine on the assumption that an unmeasured kernel join or equivalent mechanism will solve the problem.
- The next evidence should evaluate architectures that can establish the strict pre-retrieval authorization property without allowing the governed projection to diverge in a security-relevant way, including the unmeasured kernel-constrained/in-query alternative where the existing probe authority permits it.
- If no candidate can satisfy the existing gates, the project must return to Q3 for an explicit architectural response; the failure does not authorize relaxing Shape-1.

## 4. Q10 — “current approved version” versus ADR-0018 APPROVED/PUBLISHED distinction

**Ruling: use the strict, fail-closed lifecycle interpretation already exercised by TASK-0037.**

For Q7 purposes, “current approved version” means the version that is **currently effective for employee answers under the authoritative lifecycle state** — i.e. it must have reached the ADR-0018 state required to be published/effective, not merely an APPROVED-but-not-PUBLISHED state.

Therefore:

- APPROVED but not yet PUBLISHED/effective is **not answerable as the current version**.
- If the current effective version cannot be established or made available to retrieval, the system **abstains**.
- WITHDRAWN/revoked/superseded versions are not current and must not be used.
- The citation/version identity must identify the actual current document version, consistent with the existing ADR-0018 requirement that a citation names a document version rather than merely a document.

This is a clarification of the Q7 terminology and existing lifecycle behavior, not a weakening or replacement of ADR-0018. No ADR file is modified by this message.

## 5. Security consequences

The following remain mandatory and unchanged:

- Strict Shape-1: no unauthorized document content is examined by retrieval.
- Physical isolation is required where necessary to enforce that property.
- Query predicates alone are insufficient without execution evidence that unauthorized candidates are not examined.
- Authoritative kernel re-check is mandatory.
- Stale or unavailable current versions cause fail-closed abstention.
- `U = 0` and the existing E1–E4 clearance requirements remain necessary.
- Existing NOT CLEARED and DISQUALIFIED verdicts remain unchanged.
- No engine/runtime/provider/model/index technology is selected.
- No implementation or deployment is authorized.

## 6. Next bounded action

Authorize a bounded evidence task to evaluate the **kernel-constrained retrieval alternative and/or an architecture that prevents security-relevant projection divergence**, using the existing EPA-0006 gates and the strict Q8/Q9/Q10 rulings above.

The task must produce execution evidence only. It must not select, adopt, install, deploy, or recommend a production engine. It must stop at candidate clearance status.

No further operator decision is required before this bounded evidence task is reconciled as the single READY task under the normal COMMS gate.
