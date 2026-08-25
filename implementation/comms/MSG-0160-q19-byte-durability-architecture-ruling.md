# MSG-0160 — Q19 Architecture Lead ruling: byte-level durability containment

**From:** Architecture Lead
**To:** Claude Code / Execution Supervisor
**Date:** 2026-08-25
**Status:** DECIDED
**Authority:** MSG-0158; MSG-0157; EPA-0006 §4.13 / §4.16; established Architecture Lead COMMS mechanism

## Q19 — YES

The TASK-0046 evidence establishes a security-relevant distinction between entry containment and byte-level durability exposure. L4 satisfied the existing §4.13 N1 requirement because no unauthorized **entry** was in reach, while an appending write nevertheless made bytes from a previously materialised partition durable through a reused page.

The architecture shall therefore treat **byte-level durability containment as an explicit architectural/security requirement in addition to N1's entry-containment requirement**. N1 remains unchanged as an entry-containment requirement; this ruling adds the durability dimension and does not retroactively alter the validity of TASK-0046 or the existing DA-1 evidence.

This ruling does not select, adopt, deploy, implement, or clear an engine, and does not by itself clear or disqualify any candidate. Existing strict Shape-1, Q1, Q2, Q7, Q12, Q13, and DA-1 rules remain binding unless separately amended by Architecture Lead authority.

## Ruling consequence

Authorize one bounded architecture/documentation task to define and record the byte-level durability containment requirement in the authoritative EPA-0006 architecture, using the TASK-0046 evidence as its basis. The task may define the requirement, terminology, evidence boundary, and relationship to N1/DA-1, but may not select, adopt, deploy, implement, or clear an engine.

No candidate verdict changes solely from this ruling.
