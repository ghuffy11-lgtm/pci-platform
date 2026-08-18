# SPEC-0011 — Policy and Authorization

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Provide a centralized, explicit authorization contract for humans, services, agents, workflows, and connectors.

## Requirements

- Support role, group, scope, attribute, resource, action, and contextual policy decisions.
- Deny by default.
- Enforce policy outside the language model.
- Evaluate authorization at the point of privileged execution.
- Record the policy decision and relevant policy version for governed operations.
- Support explicit approval requirements for high-risk actions.
- Permit policy changes without recompiling application logic.
- Prevent agents from delegating authority they do not possess.

## Decision Inputs

Subject, action, resource, tenant, environment, requested scope, risk class, time/context, and applicable policy.

## Acceptance Criteria

A service can request authorization for a specific action against a specific resource and receive an auditable allow, deny, or approval-required decision. The same request must not gain additional authority merely because it originated from an AI agent.
