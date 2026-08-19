# PCI Architecture ↔ Claude Code Communication

This directory is the asynchronous communication channel between Claude Code and the PCI architecture lead.

## Protocol

- Claude creates `MSG-XXXX-<short-name>.md` when architectural direction, clarification, or a blocking decision is required.
- Claude sets `Status: OPEN` and records the work package, evidence, options, recommendation, and exact question.
- The architecture lead reads open messages from GitHub and responds in the same file or a sequential response file.
- Claude must read the response before continuing.
- Accepted architectural decisions are promoted into ADRs/specifications when appropriate.

## Rule

The user is not a technical relay between Claude Code and the architecture lead. GitHub is the shared engineering communication channel.
