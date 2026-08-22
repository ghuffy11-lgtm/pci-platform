# MSG-0091 — n=1 Sufficiency Ruling Recorded; No Authorized Architecture Task Remains

**Status:** **OPEN** — the next action is the Architecture Lead's ruling on `EPA-0005`
**Raised:** 2026-08-22
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Ruling record + next-action identification
**Authority:** Architecture Lead ruling relayed by the operator, 2026-08-22 | **Related:** MSG-0090, MSG-0089, EPA-0005, ADR-0019, WP-0009 §6.2

---

## 1. The ruling, recorded

The Architecture Lead ruled, in full:

> Treat the Arabic n=1 documents as sufficient technical test evidence for the current architecture
> work. Do not require representative organizational Arabic material to continue bounded testing.
> Preserve MSG-0090's evidence-gap finding for the eventual production normalization decision.
> Identify and proceed with the next authorized architecture task; do not create another Arabic corpus
> requirement unless an existing ADR explicitly requires it.

**Recorded here because it arrived conversationally.** Per `CLAUDE.md`, a conversational instruction may
direct what work to do next but cannot silently amend accepted architecture, and must be written down
so the change traces to a recorded decision rather than to a conversation. **This message is that
record.**

## 2. Conflict check — none, and the reason is specific

**The ruling does not conflict with ADR-0019, and does not amend it.**

ADR-0019 §6 and MSG-0056a **D6** gate **production use**: *"the final normalization rule must be
recorded in an ADR before production use."* They say nothing about what evidence is adequate for
**bounded architecture testing**, which is what the three surveys were.

**The ruling scopes n=1 to testing and explicitly preserves the production requirement** — it directs
that MSG-0090's finding be kept *for the eventual production normalization decision*. That is the same
boundary the accepted documents draw, stated from the other side.

**Had the ruling instead declared the n=1 evidence sufficient to amend ADR-0019, that would have
conflicted** with D6, and this session would have stopped and said so rather than recording it.

## 3. MSG-0090 is preserved, not withdrawn

**MSG-0090 stands unchanged and remains OPEN.** Its finding — that representative approved
organizational Arabic material is required and unavailable — is **correct and unaffected**. What the
ruling changes is its *scope of consequence*:

| | Before this ruling | After |
|---|---|---|
| Blocks bounded architecture testing | Implied by "required" | **No** — explicitly not required |
| Blocks ADR-0019's amendment | Yes | **Yes, unchanged** |
| Blocks production use, via D6 | Yes | **Yes, unchanged** |

**Nothing in MSG-0090 was deleted, softened, or re-argued.** A note recording this scoping has been
added to it, pointing here.

## 4. No new Arabic corpus requirement was created

The ruling closes with *"do not create another Arabic corpus requirement unless an existing ADR
explicitly requires it."*

**None was created.** MSG-0090 did not invent a requirement either — it reported one that **ADR-0019 §6
already states in its own words**, listing the five deferred rule classes and saying the rule set
*"requires the empirical corpus evidence that A-SURVEY exists to gather."* That is an existing accepted
ADR explicitly requiring it, and it is the only such requirement recorded.

## 5. The next authorized architecture task — there is none

**Checked rather than assumed. WP-0009 §6.2 defines exactly three architecture tasks, and all three are
executed:**

| Task | Executed as | Delivered | State |
|---|---|---|---|
| **A-ADR** | TASK-0024 | ADR-0017…ADR-0022 | **Accepted (MSG-0071) and promoted (TASK-0025)** |
| **A-STACK** | TASK-0026 | `EPA-0005` | **Delivered — PROPOSED, awaiting the Lead's ruling** |
| **A-SURVEY** | TASK-0027, TASK-0028, TASK-0029 | MSG-0084, MSG-0087, MSG-0089 | **Performed at n=1 on three producers** |

```text
architecture task ids referenced anywhere in WP-0009 / EPA-0004 / EPA-0005:
  A-ADR   A-STACK   A-SURVEY        <- no fourth exists

every AUTHORIZED message has a matching execution record:
  MSG-0073 -> MSG-0075    MSG-0076 -> MSG-0078    MSG-0080 -> MSG-0084
  MSG-0083 -> applied and verified    MSG-0085 -> MSG-0087    MSG-0088 -> MSG-0089
```

**Everything else in the sequence is an implementation task** — T-0 and T-A…T-I — and **all of them are
explicitly unauthorized**, most recently by MSG-0085 and MSG-0088.

**So there is no authorized architecture task to proceed with, and inventing one is precisely what the
operating rules forbid.** The instruction says *proceed with the next authorized* task; the honest
execution of that is to report that the set is empty, not to manufacture a task to satisfy the verb.

## 6. What the next action actually is, and who holds it

**The gate is `EPA-0005`, and only the Architecture Lead can pass it.**

It is `PROPOSED — not authorized, and it selects nothing`, delivered by A-STACK under MSG-0076. Per
`implementation/architecture/README.md`, records there are proposals awaiting a ruling; nothing in it
carries authority until accepted.

**Three things wait behind it:**

1. **Accept, amend, or reject EPA-0005**, including its **§9.1** list of constraints it recommends
   recording as settled, and its **§9** position that stack *selection* stays open.
2. **The one-runtime-or-two trade** EPA-0005 raises.
3. **Whether a stack ADR is created now** — EPA-0005 recommends **not** creating one yet.

**Once EPA-0005 is ruled on, the next authorization is a work-package or implementation-task decision**,
which is also the Lead's. This session cannot self-authorize either.

## 7. What was done and not done

**Done:** the ruling recorded; MSG-0090 annotated with its preserved scope; the architecture task set
verified complete; the next gate identified with its holder.

**Not done:** no ADR touched — **ADR-0019 in particular is unmodified**; no normalization rule proposed;
no task created, authorized, or marked READY; no corpus requirement created; no permission changed; no
corpus file read or moved.

## 8. State

- **No task is READY. No blocker is open.** The scheduled task is **Disabled**, so nothing runs
  unattended.
- **WP-0009 §6.2 architecture tasks: complete.** A-ADR accepted and promoted; A-STACK delivered and
  awaiting ruling; A-SURVEY performed at n=1 three times.
- **The n=1 Arabic evidence is now ruled sufficient for bounded architecture testing**, and
  **insufficient for the production normalization decision**, which remains gated by ADR-0019 §6 and D6.
- **Implementation remains prohibited.** T-0 and T-A…T-I are unauthorized; T-0 additionally needs a
  privileged identity-provider deployment.
