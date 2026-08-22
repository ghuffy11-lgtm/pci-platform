# MSG-0078 — TASK-0026 Execution Record: A-STACK Delivered, A-SURVEY Stopped at Its Prerequisite

**Status:** **OPEN** — one organizational action outstanding (A-SURVEY's corpus). The A-STACK half is
delivered and requests no decision beyond the ordinary acceptance of a PROPOSED record.
**Raised:** 2026-08-22
**Raised by:** Claude Code — supervisor-started session, `runner.lock` pid 27312, acquired 06:57:17Z
**Type:** Task execution record + prerequisite report
**Authority:** **MSG-0076** (AUTHORIZED) · queue section `CLAUDE-TASKS.md` §TASK-0026
**Related:** MSG-0077 (the reconciliation this executes against), WP-0009 §6.2, EPA-0004 §11.5,
MSG-0062 §7.5 / §7.7, MSG-0071
**Task result:** **PARTIAL — and partial by design rather than by shortfall.** A-STACK is complete;
A-SURVEY is unmet on **PR5**.

---

## 1. What was done

| Half | Outcome |
|---|---|
| **A-STACK** | **COMPLETE.** Delivered [`EPA-0005 — Employee Policy Assistant: Service Stack Evaluation`](../architecture/EPA-0005-assistant-stack-evaluation.md), **PROPOSED**, in `implementation/architecture/` |
| **A-SURVEY** | **NOT PERFORMED. Stopped at its prerequisite and recorded.** No corpus is reachable; **no survey record was created and no survey figure exists anywhere in this commit** |

Being documentary, this task produced **no test count, and none is claimed.**

---

## 2. Acceptance criteria (MSG-0076) — each mapped to evidence

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| **1** | A bounded corpus-survey record documents the required empirical observations without production-content ingestion | **UNMET — PR5** | §3 below. The prerequisite was re-checked by inspection in this session; no corpus is reachable. **Reported unmet rather than manufactured**, exactly as the queue section required |
| **2** | A stack-evaluation record maps candidate approaches to the accepted EPA constraints and explicitly preserves open selections | **MET** | **EPA-0005**. Mapping: §3 (eliminations from the accepted set), §6 (layer-by-layer candidate classes against binding constraints). Open selections preserved explicitly: **§9.2**, a nine-row table of every open selection with what would close each |
| **3** | No accepted ADR is modified | **MET** | `git diff --name-only docs/decisions/` returned **empty**, and `git status --porcelain` before commit carried **no path under `docs/decisions/`** — only the three new/modified paths in §5 |
| **4** | No implementation task is marked READY | **MET** | No board row gained READY. T-A, T-B, T-D, T-E and **T-0** remain unauthorized. After this task **no task is READY** — §7 |
| **5** | COMMS and the task queue are reconciled consistently before execution | **MET — before this session, by MSG-0077** | MSG-0076 required reconciliation *before* execution. MSG-0077 performed it in `69a4d03`, placing TASK-0026 on the board as the single READY task. **This session verified that state at startup rather than repeating the reconciliation** |
| **6** | Execution is reported complete only after repository verification | **MET** | §4. The verification was run and its output is quoted, not summarized |

**Five of six MET; criterion 1 UNMET with the reason named. The task is PARTIAL.**

---

## 3. A-SURVEY — the prerequisite, re-checked rather than inherited

The queue section was explicit that the corpus question must be **established by inspection**, not read
off MSG-0077 — because the operator could have supplied material after MSG-0077 was written, and a
runner that trusted the text would then wrongly refuse to survey a corpus that exists.

**It was re-checked in this session on 2026-08-22. The answer is unchanged.**

A search of the entire working tree for document-like files in any policy-bearing format:

```text
glob **/*.{pdf,docx,doc,pptx,xlsx,rtf,odt,txt,html,htm,csv}
  services/kernel/node_modules/typescript/LICENSE.txt
  services/kernel/node_modules/typescript/ThirdPartyNoticeText.txt
```

**Two hits, both TypeScript dependency licence texts.** No PDF, no DOCX, no policy document in any
format.

A search for anything named for policy, corpus, handbook, or procedure returned kernel source files
(`services/kernel/src/adapters/policy/…`, `ports/policy.ts`, `test/unit/policy.test.ts`) and the
project's own governance markdown (`SPEC-0011`, `ADR-0019`, the EPA and WP-0009 records). **No
organizational policy content of any kind.** The repository root holds no `data/`, `corpus/`,
`content/`, or `ingest/` directory.

**PR5 is UNMET.** This agrees with WP-0009 §6.1, EPA-0004 §11.5 and MSG-0061 §7.5, and — being an
independent observation — corroborates them rather than restating them.

### What was deliberately not produced

Per the queue section and MSG-0077, and stated so a later reader can confirm the absence is intentional:

- **no** format breakdown, **no** language mix, **no** scanned-document prevalence, **no**
  classification or audience patterns, **no** version/supersession characteristics — **not as
  estimates, not as illustrations, not as "expected" values**;
- **no** survey method, template, or plan substituted for the authorized output. A method document is
  easy to mistake later for a completed survey, and producing one would also be scope invention.

**Why this restraint is the point rather than an omission.** These figures feed **MSG-0056a D6**
(Arabic normalization, required to be empirical), **D14** (the scanned-document rejection rule), and
**ADR-0019**, which MSG-0071 accepted *on the express condition* that its normalization rules come from
empirical corpus evidence. Invented figures would have propagated into accepted architecture and been
traceable to nothing, because there would be no corpus to check them against.

---

## 4. Repository verification — run, with output quoted

Criterion 6 requires verification before reporting, and the queue section names two specific checks:

```text
$ git diff --name-only docs/decisions/
(no output)                      <- no accepted ADR touched

$ git status --porcelain
 M implementation/architecture/README.md
?? implementation/architecture/EPA-0005-assistant-stack-evaluation.md
?? implementation/operations/checkpoints/TASK-0026.md
                                 <- no path under docs/decisions/
```

**Board check:** no row gained `READY`. TASK-0026's row moves READY → COMPLETE (PARTIAL), and no other
row changed status.

**Repository movement check** (CLAUDE.md *Mid-run repository movement*): the session's starting HEAD was
recorded in checkpoint 1 as `69a4d03d0bec45a98aa80211a609e6ed57e44f25`, with `origin/main` equal to it
and the tree clean. It is re-checked before the push.

> **A limit on that evidence, stated rather than glossed.** `git fetch` is off the runner allowlist, so
> a mid-run move by another actor is detectable **only when a push is rejected**. That limit is
> recorded in the queue section, it was not routed around, and if the push is rejected the run stops
> and records rather than forcing.

---

## 5. Files changed

| Path | Change |
|---|---|
| `implementation/architecture/EPA-0005-assistant-stack-evaluation.md` | **NEW** — the A-STACK deliverable, PROPOSED |
| `implementation/architecture/README.md` | Index row for EPA-0005 + a note recording that A-SURVEY did not run and that no corpus figures exist in that directory |
| `implementation/operations/checkpoints/TASK-0026.md` | **NEW** — checkpoints 1 and 2 |
| `implementation/comms/MSG-0078-task-0026-execution-record.md` | **NEW** — this record |
| `implementation/comms/README.md` | Register row for MSG-0078 |
| `implementation/operations/CLAUDE-TASKS.md` | Board row → COMPLETE (PARTIAL); task section outcome; ledger row |
| `implementation/status/current.md` | Current position after TASK-0026 |
| `docs/program/work-packages/WP-0009-employee-policy-assistant.md` | §6.2 — A-STACK executed, A-SURVEY blocked on PR5 |

**Numbering was verified collision-free before allocation**, per the MSG-0035 convention (register row,
directory listing, and repo-wide grep — all three): `EPA-0005` and `MSG-0078` each returned **no
matches** anywhere in the repository.

---

## 6. What EPA-0005 found — the parts worth the Lead's attention

The record is long because the constraint analysis is the deliverable. Four findings carry weight:

1. **"The stack" is not one decision** (§1, §5). The capability holds two workloads with different
   centres of gravity — a governed application layer, and a document-and-model pipeline. The real fork
   is **one runtime or two**, and where the seam falls. EPA-0005 frames that trade with three named
   approaches and recommends none, because operational fit and team capability are part of the answer
   and both are the organization's context, not Claude's.

2. **ADR-0020 makes pre-filtered retrieval a functional requirement on the index engine** (§3.3). This
   is the sharpest finding. §3.1 requires the candidate set be built *"already constrained"*, and §4
   makes retrieve-then-filter a gate failure. Read as an engine criterion, that **disqualifies
   post-filter-only similarity search** — and the usual workaround, over-fetch top-k then filter, is
   the prohibited shape executed one layer lower, where it is harder to see. **An implementer could
   violate this while believing they conform**, because post-filtering looks like enforcement and the
   response body is identical either way.

3. **Three local models are required, not one** (§3.5) — generation (ADR-0022), embedding (ADR-0020 §7),
   and the **entailment layer** of ADR-0017's grounding gate, which ADR-0022's own consequences confirm
   is local too. All three need Arabic capability under separately evaluated per-language bars. This
   multiplies **PR6**, which remains **UNKNOWN and unmeasured**.

4. **Conversation and audit storage are two stores, not one** (§3.7). ADR-0021 §2 restricts retained
   conversation content to the employee who asked — *including from an ordinary administrator* — and §3
   requires expiry to actually delete. A single "log everything to one place" design violates §2 and §4
   at once, **invisibly**, and any telemetry component inherits the restriction.

**One product-visible constraint surfaced early** (§3.6): ADR-0017's gate runs *after* generation and
may veto the whole response, so **streaming an answer to the user as it generates is incompatible with
it**. Better found now than at T-D.

**And one boundary EPA-0005 declined to cross.** SPEC-0008 and ADR-0003 both name Ollama as a possible
initial local runtime; **ADR-0022 is explicit that it "does not select it or anything else."** EPA-0005
takes the same position and names no runtime — because recording one in a PROPOSED document would
convert an accepted non-decision into a de facto selection.

---

## 7. Boundaries respected

- **Nothing was selected.** No provider, framework, model, embedding technology, index engine, or
  runtime. EPA-0005 §9.2 lists every open selection with the evidence that would close it, and §10
  restates the prohibition against itself.
- **No accepted ADR was modified** — verified in §4.
- **No ADR was created.** WP-0009 §6.2 assigns A-STACK the *question* of whether its output should be an
  ADR; EPA-0005 §9.3 **answers** it (recommend: not yet, with a qualification) and creates none. MSG-0076
  authorizes no ADR drafting — when drafting was intended, it was authorized explicitly, as MSG-0068 did
  for A-ADR.
- **No Arabic normalization rule was invented.** EPA-0005 §7 records the three constraints ADR-0019 §6
  fixes and stops there.
- **No retrieve-then-suppress behaviour was introduced** — §3.3 argues the opposite direction.
- **No task was marked READY**, including T-0, T-A, T-B, T-D and T-E. **After this task, no task is
  READY.**
- **No host was touched.** This was documentary work on the Windows workstation; the `/data` boundary
  was not engaged, and `pci-server-bootstrap.md` was correspondingly not required — recorded in
  checkpoint 1 rather than silently skipped.

---

## 8. The decision the Architecture Lead now holds

**Three things, only the first of which blocks anything.**

1. **A-SURVEY's corpus — organizational, and still outstanding.** Make representative approved policy
   material available for a **read-only** survey, or rule that A-SURVEY is **deferred** until the corpus
   exists. MSG-0076's constraint binds either way: **a survey reads; it does not ingest**, and it may
   not bypass approval controls. **This is the same action MSG-0077 asked for; TASK-0026 could not
   discharge it, and re-verified rather than assumed that it remains outstanding.**

2. **EPA-0005 — accept, amend, or reject**, and rule on §9.3: whether the three corpus-independent
   constraints in §9.1 should be recorded as accepted architecture. EPA-0005 recommends **not a new
   stack ADR**, and observes that if the pre-filtering rule warrants recording, it belongs with
   **ADR-0020** — whose §3 and §4 it follows from — rather than in a record of its own.

3. **The §5 one-runtime-or-two trade**, when the Lead judges the timing right. EPA-0005 deliberately
   leaves it open: it turns on operability and team capability in the customer's context, which the
   technology-selection principles make explicitly a matter of **operational fit** rather than technical
   ranking.

**Sequencing observation, offered and not self-authorized.** Seven of the questions a stack proposal
would ordinarily answer are corpus-dependent (EPA-0005 §8), so **A-SURVEY is a genuine input to
A-STACK**. Running A-STACK first was always going to leave that residue. If the corpus becomes
available, the natural follow-up is A-SURVEY and then a revision of EPA-0005 §8 and §9.2 against real
evidence — **but that is the Lead's to authorize, and no task is marked READY here.**

---

## 9. State after this record

- **TASK-0026: COMPLETE (PARTIAL).** A-STACK delivered; A-SURVEY unmet on PR5, with the reason recorded.
- **No task is READY.** The queue sits at an authorization boundary, as it did after TASK-0025.
- **PR5 remains UNMET; PR6 remains UNKNOWN.** PR3 and PR4 remain NOT MET. T-0 is unauthorized.
- **EPA-0005 is PROPOSED** and carries no architectural authority.
- **ADR-0017 … ADR-0022 are untouched** and remain the accepted architecture.
- **OPEN messages: MSG-0060, MSG-0077, and this record.** MSG-0077 stays OPEN because the
  organizational action it asked for has **not** been taken — verified in §3, not assumed.
- **No blocker is OPEN.** This remains a prerequisite report rather than a blocker: nothing is broken,
  and the missing input was always recorded as the organization's to provide.
