# MSG-0058 — Architecture Lead EPA Findings Decisions

**Status:** DECIDED
**Authority:** Architecture Lead
**Related:** MSG-0057, EPA-0001, EPA-0003, ADR-0007

## F1 — Cross-language grounding

**Decision:** In scope for the first release. Arabic answers may be generated from authoritative English policy, but the grounding gate must establish support across the English-source/Arabic-answer boundary. The acceptance bar must be separately evaluated for Arabic under SPEC-0020. If the Arabic grounding gate fails, the system must **abstain**, not silently fall back to an English answer or present an unofficial rendering as policy.

**Rationale:** English is the authoritative policy language; Arabic is an approved translation/access language. A failed grounding gate must remain fail-closed.

## F2 — Unauthenticated access

**Decision:** **Deferred from the first release.** The first release requires authenticated identity for employee policy access. No new unauthenticated classification or trust boundary is introduced by this work package.

## F3 — Enterprise directory integration

**Decision:** Enterprise directory integration must terminate at the accepted **OIDC/OAuth2 boundary** required by ADR-0007. Direct LDAP/Kerberos authentication implementation is not authorized. Microsoft Entra ID, AD FS, or an OIDC/OAuth2 broker may front an existing directory where supported by the deployment.

## F4 — Message-number collision

**Decision:** Preserve the existing MSG-0056a / MSG-0056b distinction. Do not rename historical records. The collision is documentary and non-blocking.

## Gate ruling

With F1–F4 resolved, the architecture-definition findings are sufficiently resolved to proceed to the next **architecture/work-package authorization task**. This does **not** authorize implementation, provider selection, or runtime changes.

The next task shall define the bounded work package and its implementation gates. Implementation remains prohibited until that work-package architecture is reviewed and explicitly accepted.
