# SPEC-0022 — Human Approval

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Provide explicit human authorization for operations whose policy requires review before execution.

## Requirements

- Approval requests identify actor, intent, target, proposed change, risk, evidence, and expiry.
- Approvers must be authorized for the requested action.
- Approval is bound to a specific operation or immutable change plan.
- Material changes invalidate prior approval.
- Approval and rejection are auditable.
- Time-limited approvals expire automatically.
- Multi-person approval may be required for high-risk operations.

## AI Boundary

An agent may prepare an approval request but cannot approve its own action or reinterpret a rejection as approval.

## Acceptance Criteria

A high-risk workflow pauses for an authorized human, executes only the approved plan, and records who approved what and when.
