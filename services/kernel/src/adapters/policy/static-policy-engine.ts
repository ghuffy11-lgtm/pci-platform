/**
 * Static policy engine.
 *
 * Sources: SPEC-0011, docs/security/rbac-abac-model.md, ADR-0011, ADR-0007,
 *          docs/security/data-classification.md, docs/security/ai-security.md.
 *
 * SCOPE
 * -----
 * WP-0001 needs an authorization decision point, not a policy product. This engine implements
 * the SPEC-0011 contract with a fixed, versioned rule set. SPEC-0011 also requires that policy
 * change "without recompiling application logic" — that is satisfied at the *port* level: an
 * external engine (OPA, Cedar, a PCI policy service) can replace this class without touching
 * the application layer. Full externalized policy is a later work package.
 *
 * EVALUATION MODEL
 * ----------------
 * Rules are evaluated in order; the first match wins; an unmatched request is DENIED. Each
 * decision names the rule that produced it so an auditor can reconstruct why.
 *
 * Deny rules are ordered before allow rules. This matters: an agent must not be able to reach
 * an allow rule by holding a broad role, which is precisely the escalation ADR-0011 prohibits.
 */

import type {
  AuthorizationRequest,
  PolicyDecision,
  PolicyEngine,
} from '../../ports/policy.ts';

export const POLICY_VERSION = 'kernel-static/1.0.0';

/* ------------------------------------------------------------------------ roles */

export const ROLES = {
  /** Full platform administration. */
  platformAdmin: 'platform_admin',
  /** May create and amend knowledge. */
  knowledgeAuthor: 'knowledge_author',
  /** Read-only access to knowledge. */
  knowledgeReader: 'knowledge_reader',
  /** May perform high-risk lifecycle actions such as retirement. */
  knowledgeSteward: 'knowledge_steward',
  /** May read audit evidence and access Restricted classification. */
  securityOfficer: 'security_officer',
} as const;

const READ_ACTIONS: ReadonlySet<string> = new Set([
  'knowledge_object.read',
  'knowledge_object.query',
  'knowledge_object.history',
  'relationship.query',
]);

const WRITE_ACTIONS: ReadonlySet<string> = new Set([
  'knowledge_object.create',
  'knowledge_object.update',
  'relationship.create',
]);

const HIGH_RISK_ACTIONS: ReadonlySet<string> = new Set([
  'knowledge_object.retire',
  'relationship.delete',
]);

const AUDIT_ACTIONS: ReadonlySet<string> = new Set(['audit.query']);

type Rule = {
  readonly id: string;
  readonly description: string;
  readonly evaluate: (request: AuthorizationRequest) => PolicyDecision | null;
};

function decide(
  effect: PolicyDecision['effect'],
  matchedRule: string,
  reason: string,
): PolicyDecision {
  return { effect, reason, policyVersion: POLICY_VERSION, matchedRule };
}

function hasAnyRole(request: AuthorizationRequest, ...roles: string[]): boolean {
  return roles.some((role) => request.subject.roles.includes(role));
}

const RULES: readonly Rule[] = [
  /* ---------------------------------------------------------------- deny rules */

  {
    id: 'deny.unknown_action',
    description: 'Actions outside the kernel vocabulary are denied.',
    evaluate: (request) => {
      const known =
        READ_ACTIONS.has(request.action) ||
        WRITE_ACTIONS.has(request.action) ||
        HIGH_RISK_ACTIONS.has(request.action) ||
        AUDIT_ACTIONS.has(request.action);
      return known
        ? null
        : decide('deny', 'deny.unknown_action', `Action '${request.action}' is not recognised`);
    },
  },

  {
    id: 'deny.agent_without_delegation',
    description:
      'An agent that cannot name a delegating principal has no authority to mutate state. ' +
      'ADR-0011: agents are delegated actors, not autonomous authorities.',
    evaluate: (request) => {
      if (request.subject.actorType !== 'agent') return null;
      if (READ_ACTIONS.has(request.action)) return null;
      if (request.subject.delegatedBy !== null) return null;
      return decide(
        'deny',
        'deny.agent_without_delegation',
        'Agent has no delegating principal; mutation denied (ADR-0011)',
      );
    },
  },

  {
    id: 'deny.restricted_classification',
    description:
      'Restricted data requires the security_officer role. ' +
      'docs/security/data-classification.md: Restricted requires explicit access controls.',
    evaluate: (request) => {
      if (request.resourceClassification !== 'restricted') return null;
      if (hasAnyRole(request, ROLES.securityOfficer, ROLES.platformAdmin)) return null;
      return decide(
        'deny',
        'deny.restricted_classification',
        'Restricted classification requires the security_officer role',
      );
    },
  },

  {
    id: 'deny.agent_high_risk',
    description:
      'Agents may never perform high-risk actions, with or without approval. ' +
      'ai-security.md: separate reasoning from privileged execution.',
    evaluate: (request) => {
      if (request.subject.actorType !== 'agent') return null;
      if (!HIGH_RISK_ACTIONS.has(request.action)) return null;
      return decide(
        'deny',
        'deny.agent_high_risk',
        `High-risk action '${request.action}' is not available to agents (ADR-0011)`,
      );
    },
  },

  /* ------------------------------------------------------- approval-gated rules */

  {
    id: 'approval.agent_mutation',
    description:
      'Agent-initiated mutations require explicit human approval. ' +
      'ADR-0011: read operations are the default; mutating operations require policy ' +
      'evaluation and, where required, explicit human approval.',
    evaluate: (request) => {
      if (request.subject.actorType !== 'agent') return null;
      if (!WRITE_ACTIONS.has(request.action)) return null;
      // The agent must still hold the underlying permission — approval does not grant it.
      if (!hasAnyRole(request, ROLES.knowledgeAuthor, ROLES.platformAdmin)) {
        return decide(
          'deny',
          'approval.agent_mutation',
          'Agent lacks the knowledge_author role required for this mutation',
        );
      }
      return decide(
        'approval_required',
        'approval.agent_mutation',
        `Agent-initiated '${request.action}' requires explicit human approval (ADR-0011)`,
      );
    },
  },

  /* --------------------------------------------------------------- allow rules */

  {
    id: 'allow.platform_admin',
    description: 'Platform administrators may perform any recognised kernel action.',
    evaluate: (request) =>
      hasAnyRole(request, ROLES.platformAdmin)
        ? decide('allow', 'allow.platform_admin', 'Subject holds platform_admin')
        : null,
  },

  {
    id: 'allow.audit_read',
    description: 'Audit evidence is readable by security officers.',
    evaluate: (request) => {
      if (!AUDIT_ACTIONS.has(request.action)) return null;
      return hasAnyRole(request, ROLES.securityOfficer)
        ? decide('allow', 'allow.audit_read', 'Subject holds security_officer')
        : decide(
            'deny',
            'allow.audit_read',
            'Audit access requires the security_officer role',
          );
    },
  },

  {
    id: 'allow.high_risk_steward',
    description:
      'High-risk lifecycle actions require knowledge_steward. ' +
      'rbac-abac-model.md: separation of duties for high-risk operations.',
    evaluate: (request) => {
      if (!HIGH_RISK_ACTIONS.has(request.action)) return null;
      return hasAnyRole(request, ROLES.knowledgeSteward)
        ? decide('allow', 'allow.high_risk_steward', 'Subject holds knowledge_steward')
        : decide(
            'deny',
            'allow.high_risk_steward',
            `Action '${request.action}' requires the knowledge_steward role`,
          );
    },
  },

  {
    id: 'allow.author_write',
    description: 'Knowledge authors may create and amend knowledge.',
    evaluate: (request) => {
      if (!WRITE_ACTIONS.has(request.action)) return null;
      return hasAnyRole(request, ROLES.knowledgeAuthor)
        ? decide('allow', 'allow.author_write', 'Subject holds knowledge_author')
        : decide(
            'deny',
            'allow.author_write',
            `Action '${request.action}' requires the knowledge_author role`,
          );
    },
  },

  {
    id: 'allow.reader_read',
    description: 'Readers, authors, and stewards may read knowledge.',
    evaluate: (request) => {
      if (!READ_ACTIONS.has(request.action)) return null;
      return hasAnyRole(
        request,
        ROLES.knowledgeReader,
        ROLES.knowledgeAuthor,
        ROLES.knowledgeSteward,
        ROLES.securityOfficer,
      )
        ? decide('allow', 'allow.reader_read', 'Subject holds a knowledge read role')
        : decide('deny', 'allow.reader_read', 'Subject holds no role permitting read access');
    },
  },
];

export class StaticPolicyEngine implements PolicyEngine {
  readonly version = POLICY_VERSION;

  async authorize(request: AuthorizationRequest): Promise<PolicyDecision> {
    for (const rule of RULES) {
      const decision = rule.evaluate(request);
      if (decision !== null) return decision;
    }

    // Default deny. SPEC-0011 and rbac-abac-model.md both require this to be the fallback,
    // and it must remain the last statement in this method.
    return decide(
      'deny',
      'default.deny',
      'No policy rule permitted this request (default deny)',
    );
  }

  /** Exposed for documentation and tests; the rule set is part of the auditable contract. */
  static describeRules(): readonly { id: string; description: string }[] {
    return RULES.map((rule) => ({ id: rule.id, description: rule.description }));
  }
}
