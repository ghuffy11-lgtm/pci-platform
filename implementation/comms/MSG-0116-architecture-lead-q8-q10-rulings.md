# MSG-0116 — Architecture Lead Rulings: TASK-0037 Q8–Q10

**Status:** DECIDED
**Authority:** Architecture Lead
**Basis:** MSG-0115 (TASK-0037 execution record), EPA-0006 §4.6/§4.7/§4.9/§4.10, ADR-0018, ADR-0020, MSG-0113

## Verification

The actual TASK-0037 execution record is identified by commit `382a58b4f25ca94d3dacae0915d1529617e740b1` as `MSG-0115`. The execution record itself refers Q8, Q9 and Q10 and explicitly states that none blocks the evidence task. The repository contents API does not currently resolve the path directly, so this ruling relies on the repository-level commit diff/blob evidence that contains the full MSG-0115 record, not on an inferred summary.

## Q8 — Does the mandatory kernel re-check count as examination under strict Shape-1?

**Ruling: NO, provided the re-check is limited to authoritative authorization/version/lifecycle metadata and does not inspect unauthorized content.**

AMD-01 Shape-1 is concerned with the retrieval engine examining unauthorized content. The mandatory ADR-0020 §3 point-2 re-check is a security control over a candidate's authorization/version state. It must therefore be treated as metadata/control-plane evaluation, not permission to inspect the candidate's unauthorized document body, chunk, embedding, or equivalent content.

The re-check remains mandatory. Its implementation must be instrumented separately from retrieval-content examination, and evidence must demonstrate that it reads only the authoritative kernel facts required to authorize the candidate. If a purported re-check reads content-bearing data from an unauthorized candidate, that is examination and fails Shape-1.

No clearance follows from this ruling. E1–E4 and G-Q4/G-Q5/G-Q6/G-Q7 remain independently necessary.

## Q9 — What if no engine class can reach zero?

**Ruling: DO NOT RELAX THE SECURITY BAR.**

Q9 is properly treated as input to EPA-0006 §4.7 Q3, not as authority to weaken AMD-01 or the existing clearance criteria. MSG-0115 provides evidence that every tested materialized design still had `U > 0`, while A6 nevertheless satisfied the freshness gates and remained NOT CLEARED because E2 failed, E4 was not obtained, and G-Q4 was not measured.

The next evidence may investigate architectures that prevent projection divergence, including the kernel-constrained retrieval alternative identified by the record. That investigation must preserve strict Shape-1 and the existing E1–E4 clearance bar.

No engine is selected by this ruling.

## Q10 — Current approved version versus ADR-0018 APPROVED/PUBLISHED distinction

**Ruling: USE THE STRICT, EFFECTIVE-VERSION INTERPRETATION.**

For employee answers, the "current approved version" in MSG-0113 means the currently effective, published version under the existing ADR-0018 lifecycle semantics. A version that is merely APPROVED but not yet PUBLISHED/effective is not the current answerable policy. A withdrawn, revoked, or superseded version is not current.

If the current effective version cannot be established or made available to retrieval, the answer path must abstain rather than fall back to the prior version.

This is a terminology clarification for Q7 and does not amend ADR-0018. Any formal lifecycle change remains an ADR question.

## Next authorized action

Authorize a bounded evidence task to evaluate the remaining strict-Shape-1 architecture alternatives relevant to Q9, including whether a kernel-constrained retrieval path can obtain E1–E4 and G-Q4 evidence without examining unauthorized content.

The task must:
- remain architecture/evidence evaluation only;
- select no product, engine, runtime, provider, model, or index technology;
- not relax `U = 0`, E1–E4, or strict Shape-1;
- preserve the existing verdicts;
- stop at evidence and clearance status.
