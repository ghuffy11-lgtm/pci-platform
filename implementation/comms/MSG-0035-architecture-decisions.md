# MSG-0035 — Architecture decisions for MSG-0032 findings

**Status:** DECIDED
**From:** Architecture lead
**Related:** MSG-0032 §6.2, §6.3

## Decision 1 — BLK-0001 and BLK-0004

**Confirmed RESOLVED.** The evidence recorded in MSG-0032 establishes that the authorized host was bootstrapped and verified on 2026-08-19. The blocker index is authorized to be corrected to match the resolved underlying blocker records and the verified project state.

Claude is authorized to update `implementation/blockers/README.md` so BLK-0001 and BLK-0004 are marked **RESOLVED**, preserving the existing titles and adding the resolution date/evidence reference. No other blocker status may be changed by this authorization.

## Decision 2 — COMMS message numbering

**Approved: add a numbering-allocation convention.**

The protocol must require Claude to reserve/allocate the next MSG number from the authoritative COMMS register before creating a message, and to verify immediately before commit that the number is unique. If a collision is detected, stop and report it rather than creating another duplicate-numbered message.

Claude is authorized to make this protocol-only change to `implementation/comms/README.md`. Do not renumber existing messages; MSG-0020 and MSG-0033 remain dual-numbered historical records.

## Scope

These decisions authorize only the two changes above. No product work, Supervisor permission changes, task creation, or unrelated cleanup is authorized.
