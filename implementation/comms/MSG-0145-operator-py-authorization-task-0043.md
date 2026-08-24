# MSG-0145 — Operator Authorization: Invoke `py` for TASK-0043's Bounded E4 Probe

**Status:** **AUTHORIZED** — recorded before acting, so the execution traces to a recorded decision
**Raised:** 2026-08-24
**Raised by:** Claude Code (interactive session, COMMS), recording an operator instruction
**Type:** Operator authorization / blocker resolution
**Related:** **BLK-0011** (the denial this clears), **MSG-0144** (the blocked attempt), **MSG-0141**
(the task authorization), **MSG-0142** §3 (which identified the subject), TASK-0043

---

## 1. The instruction, as given

> **"COMMS — operator authorization granted to invoke `py` solely for TASK-0043's bounded E4
> observability probe. No product-engine selection, adoption, deployment, implementation, gate/ADR
> changes, or scope expansion is authorized."**

**Recorded verbatim and before anything was run.** `CLAUDE.md` requires a conversational instruction to
be written into a numbered communication before the change it authorizes is made, so that the work
traces to a recorded decision rather than to a chat message. **This is that record.**

## 2. What it authorizes, and what it does not

**Authorized:** invoking **`py`** — the already-present Windows Python launcher — **solely** to run
TASK-0043's committed probe harness.

**Not authorized, by the operator's own words:** product-engine **selection**, **adoption**,
**deployment**, **implementation**, **gate or ADR changes**, or **scope expansion**. **These match
MSG-0141's own prohibitions**, so the grant widens the task by exactly one mechanism and nothing else.

**Nothing is installed by this.** Python 3.14.5 and SQLite 3.50.4 are already on the machine; MSG-0142
§3 enumerated them read-only. **The grant is permission to invoke what exists.**

## 3. Who executes, and why it is not the unattended runner

**BLK-0011 was raised by a supervisor-started runner that could not invoke `py`**, and it asked for a
decision on **this machine's runner permission set**.

**This session executes the probe directly instead of broadening that permission set.** The reason is
the grant's own scope: **"solely for TASK-0043's bounded E4 observability probe."** An `allow` rule in
`runner-settings.json` would be a **standing** grant surviving every later task — **broader than what
was authorized**, and MSG-0083's narrow corpus grant is the precedent for keeping such rules exactly as
wide as their authorization and no wider.

**So `runner-settings.json` is NOT modified**, and **BLK-0011's underlying condition remains true for
future unattended tasks** — correctly, because nothing has authorized a standing change. **If a later
task needs `py` unattended, that is a fresh decision.**

## 4. The queue state this creates, stated plainly

**TASK-0043 is marked BLOCKED in the committed queue** (`58bb448`), and the blocker naming the denial
is now cleared **for this session only**. **The task is executed under its existing authorization
(MSG-0141) with the mechanism the operator has just granted** — no re-authorization of the task itself
was needed or claimed.

**The scheduled task is `Ready` again** — `LastRunTime` 19:17:17Z, `NextRunTime` 19:27:27Z — so the
supervisor is cycling. **TASK-0043 is deliberately left BLOCKED while this session runs it**, so that a
concurrent cycle cannot start a second session against the same task. **It moves to COMPLETE, or back
to a recorded stop, only when this run finishes.**

## 5. What the probe may and may not conclude

**Unchanged by this grant.** MSG-0141's two permitted outcomes stand: **E4 obtainable** with
reproducible evidence, or **E4 unobtainable** within the bounded scope with the precise limitation
recorded. **A successful E4 observation clears no candidate and prefers no engine.** **Six probes have
cleared nothing, and this one cannot clear anything either** — it is an instrument question.
