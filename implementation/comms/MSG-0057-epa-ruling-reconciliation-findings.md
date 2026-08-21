# MSG-0057 — Reconciling the EPA Rulings: Three Findings and a Numbering Collision

**Status:** **OPEN** — three findings require an architecture-lead decision before the work package is authorized
**Raised:** 2026-08-21
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Reconciliation record + decision request
**Authority:** MSG-0056a and MSG-0056b (both rule EPA-0003) | **Related:** EPA-0001, EPA-0003, ADR-0007, SPEC-0013, SPEC-0015, MSG-0055

## What was asked and what was done

MSG-0056b closes with the next action: *"reconcile these rulings with EPA-0003, MSG-0055, the COMMS
register, and the execution queue, then determine whether the remaining architecture decisions are
sufficiently resolved to authorize the next architecture/work-package task."*

**The reconciliation is done. The determination is not mine to make** and is not made here.

All fourteen EPA-0003 decisions now carry their ruling inline, sourced to whichever message ruled
them. The COMMS register, the queue ledger, and the status board are updated. Nothing was
implemented, no ADR was created, no task was marked READY.

Reconciling surfaced three things that the rulings imply but do not state. **None is a contradiction
of accepted authority, and none is a stop condition** — they are consequences that need an explicit
architectural answer before the work package can be gated, and recording them now is cheaper than
discovering them during implementation.

---

## F1 — The bilingual ruling permits at answer time what EPA-0003 recommended prohibiting

**The ruling (D1).** English is authoritative, Arabic is an approved translation, English governs on
divergence, and *"Arabic answers may be generated from the authoritative English policy, but the
cited policy authority remains English."*

**What EPA-0003 recommended.** Support M1/M2 as a per-document property and **prohibit M3 — machine
translation at answer time — for policy claims**, on the ground that an employee acting on
model-produced Arabic is acting on text no one approved.

**These are not the same position, and the difference appears deliberate.** The ruling adopts M2 for
*authority* while permitting M3 for the *answer text*, mitigated by keeping the citation anchored to
English. **A recommendation in a PROPOSED record is not authority, so the lead is entitled to rule
against it** — this is recorded as a consequence, not an objection.

**The consequence lands on the grounding gate.** D5 requires layered structural + model-assisted
entailment, fail closed. Under this ruling the gate must decide whether an **Arabic answer** is
entailed by an **English source passage** — cross-language entailment, materially harder than the
same-language case, and the structural layer (quoting, span alignment) largely stops working across a
translation boundary.

D2 already anticipates the shape of an answer — *"separate acceptance bars per language under
SPEC-0020"* — so a coherent path exists. What does not yet exist is a statement of **what the gate
compares when the answer language differs from the source language**, and what an Arabic-speaking
employee sees when the gate fails but an English answer would have passed.

**Decision required:** confirm cross-language grounding is in scope for the first release, and state
whether a failed Arabic gate falls back to the English text, abstains, or offers a clearly labelled
unofficial rendering beside the English citation.

---

## F2 — Unauthenticated access is a new access mode with no accepted authority behind it

**The ruling (D13)** permits *"optional unauthenticated access"*, limited to information *"explicitly
classified safe for unauthenticated disclosure."*

**Two things it depends on do not exist in the repository. Both were checked, not assumed:**

```text
$ grep -rniE "unauthenticated|anonymous" docs/decisions/ docs/specifications/ docs/architecture/
                                    (zero matches)
```

1. **No accepted document contemplates unauthenticated access to PCI at all.** EPA-0003 offered no
   such option, so EPA-0001 presumes an authenticated employee throughout — most directly in its
   four-point retrieval-time authorization model, which evaluates identity, roles, and organizational
   scope. With no subject, three of those four points have nothing to evaluate.
2. **The classification value it names is undefined.** SPEC-0013 and SPEC-0015 both *require*
   classification to be enforced before retrieval, but **no accepted document enumerates the levels**.
   "Safe for unauthenticated disclosure" is therefore a value that must be created, and D3 assigns
   humans the authority to apply a scheme that is not yet specified.

**It also interacts with D4.** The safe uniform abstention model makes "not authorized" and "no
policy" indistinguishable *including timing and result-count side channels*. An unauthenticated
surface is the most exposed place that guarantee has to hold, and the place where a probing client is
most likely to be hostile rather than merely curious.

**Decision required:** whether unauthenticated access is in scope for the first release or deferred;
if in scope, the classification scheme defining the disclosable class, and who assigns it.

**Recommendation: defer it.** It is the one part of D13 that adds a new trust boundary rather than
configuring an existing one, and deferring costs nothing the authenticated path does not already
deliver.

---

## F3 — "Active Directory integration" is bounded by ADR-0007, which is accepted authority

**The ruling (D13)** names three identity modes, one being *"existing Active Directory / enterprise
identity integration."*

**ADR-0007 is Accepted and constrains how that may be built** — quoted, not paraphrased:

> PCI will integrate an established standards-based identity provider rather than implement
> authentication itself. The platform will use OpenID Connect/OAuth 2.0 compatible identity flows [...]
> PCI applications must not implement password storage, token issuance, or bespoke authentication
> protocols.

**No conflict exists if AD is reached through an OIDC/OAuth2 boundary** — AD FS, Entra ID, or any OIDC
broker fronting the directory. That is the ordinary enterprise shape and satisfies both documents.

**A conflict does exist if it means a direct LDAP or Kerberos bind**, because that is PCI implementing
an authentication protocol, which ADR-0007 forbids. The ruling does not say which is meant, and the
distinction stays invisible until someone starts building it.

Per the authority order, **the accepted ADR governs unless an ADR amends it.** No stop is warranted:
the compatible reading is available and is very likely the intended one.

**Decision required:** confirm that all directory integration terminates at an OIDC/OAuth2 boundary,
or record an ADR amending ADR-0007 if a direct bind is genuinely intended.

---

## F4 — A fourth message-number collision, and a concrete suggestion this time

**Two different files both claim MSG-0056:**

```text
MSG-0056-architecture-lead-epa-decisions.md                       (14:33)  rules D2,D4,D5,D6,D8-D12,D14
MSG-0056-architecture-lead-employee-policy-assistant-decisions.md (15:23)  rules D1,D3,D7,D13
```

**They complement rather than contradict** — the first escalates exactly the four the second resolves
— so, as with the MSG-0046 pair, this is not a conflict and no stop was warranted. Throughout the
records they are disambiguated as **MSG-0056a** (earlier) and **MSG-0056b** (later), and both are
registered under that convention.

**Neither file was renumbered.** MSG-0047 set the precedent of recording a collision rather than
unilaterally re-identifying the lead's record, and renaming would break any external reference to it.

This is the **fourth** occurrence — MSG-0020, MSG-0033, MSG-0046, MSG-0056 — and the first cost a full
stop-and-ask cycle because those two disagreed. Since recording the observation has not stopped it
recurring, one concrete option: the next free number is derivable from the register, so a one-line
check before writing (`ls implementation/comms/ | grep -c "^MSG-00NN"`) or a supervisor warning when
two files share a number prefix would catch it at write time.

Offered as an option. **No rule of yours is mine to change, and I have not changed one.**

---

## State

- All fourteen EPA-0003 decisions are RULED and annotated inline with their source.
- **No task is READY. No work package, implementation task, ADR, or provider selection is authorized**,
  exactly as MSG-0056b requires.
- Everything under `implementation/architecture/` remains **PROPOSED**.
- F1, F2 and F3 are open, and belong to the architecture lead's determination of whether the
  architecture is now sufficiently resolved to authorize the next task.
