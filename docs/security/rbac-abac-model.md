# PCI RBAC and ABAC Model

**Status:** Foundation security specification
**Version:** 0.1

## Decision

PCI uses roles and groups for manageable human administration, while resource and context attributes provide fine-grained authorization for services and agents.

## Subjects

Human users, service identities, agents, workflows, and connectors.

## Resources

Knowledge Objects, documents, tools, workflows, assets, configurations, tenants, and administrative functions.

## Decision Inputs

Subject identity, role/group, tenant, resource owner, resource classification, action, environment, risk, workflow state, and contextual constraints.

## Rules

- Default deny.
- Least privilege.
- Separation of duties for high-risk operations.
- Policy decisions are external to model reasoning.
- Authorization is rechecked before privileged execution.
- Policy changes are auditable and versioned.

## Acceptance Criteria

The same resource/action pair can be authorized differently based on subject, tenant, classification, and context without modifying application code.
