/**
 * Controlled vocabularies.
 *
 * Sources:
 *   docs/knowledge/object-type-registry.md
 *   docs/knowledge/knowledge-object-lifecycle.md
 *   docs/knowledge/relationship-taxonomy.md
 *   docs/security/data-classification.md
 *
 * These are `const` objects rather than TypeScript `enum`s: Node's native type-stripping
 * cannot execute `enum`, and `erasableSyntaxOnly` in tsconfig enforces that at compile time.
 * See ADR-0015 (proposed).
 */

/* ------------------------------------------------------------------ object types */

/**
 * WP-0001 "Initial Object Types" restricts the kernel to the minimum set needed for the
 * kernel demonstration. The full registry in docs/knowledge/object-type-registry.md is
 * intentionally NOT implemented here — the work package says so explicitly.
 *
 * The registry remains extensible: adding a type is a one-line change plus architecture
 * review, per the registry's own rules.
 */
export const OBJECT_TYPES = [
  'Organization',
  'Person',
  'Service',
  'Asset',
  'Document',
  'Policy',
  'Agent',
] as const;

export type ObjectType = (typeof OBJECT_TYPES)[number];

const OBJECT_TYPE_SET: ReadonlySet<string> = new Set(OBJECT_TYPES);

export function isObjectType(value: unknown): value is ObjectType {
  return typeof value === 'string' && OBJECT_TYPE_SET.has(value);
}

/* -------------------------------------------------------------------- lifecycle */

/**
 * docs/knowledge/knowledge-object-lifecycle.md:
 *   Proposed -> Draft -> Reviewed -> Approved -> Active -> Deprecated -> Retired
 */
export const LIFECYCLE_STATES = [
  'proposed',
  'draft',
  'reviewed',
  'approved',
  'active',
  'deprecated',
  'retired',
] as const;

export type LifecycleState = (typeof LIFECYCLE_STATES)[number];

const LIFECYCLE_SET: ReadonlySet<string> = new Set(LIFECYCLE_STATES);

export function isLifecycleState(value: unknown): value is LifecycleState {
  return typeof value === 'string' && LIFECYCLE_SET.has(value);
}

/**
 * Permitted transitions.
 *
 * The lifecycle document specifies only the forward path. Three additional transitions are
 * implementation decisions recorded as assumptions in the WP-0001 report:
 *   - reviewed -> draft and approved -> draft  (review rejection must be expressible)
 *   - deprecated -> active                     (reinstatement)
 *   - any non-terminal -> retired              (withdrawal)
 *
 * `retired` is terminal: the lifecycle document requires retired objects to stay out of
 * current-state results, and resurrecting an identifier would undermine "IDs are stable and
 * never reused".
 */
const TRANSITIONS: Readonly<Record<LifecycleState, readonly LifecycleState[]>> = {
  proposed: ['draft', 'retired'],
  draft: ['reviewed', 'retired'],
  reviewed: ['approved', 'draft', 'retired'],
  approved: ['active', 'draft', 'retired'],
  active: ['deprecated', 'retired'],
  deprecated: ['active', 'retired'],
  retired: [],
};

export function canTransition(from: LifecycleState, to: LifecycleState): boolean {
  if (from === to) return true;
  return TRANSITIONS[from].includes(to);
}

export function allowedTransitions(from: LifecycleState): readonly LifecycleState[] {
  return TRANSITIONS[from];
}

/** Retired objects are excluded from current-state queries unless explicitly requested. */
export function isCurrentState(state: LifecycleState): boolean {
  return state !== 'retired';
}

/* --------------------------------------------------------------- classification */

/** docs/security/data-classification.md */
export const CLASSIFICATIONS = ['public', 'internal', 'confidential', 'restricted'] as const;

export type Classification = (typeof CLASSIFICATIONS)[number];

const CLASSIFICATION_SET: ReadonlySet<string> = new Set(CLASSIFICATIONS);

export function isClassification(value: unknown): value is Classification {
  return typeof value === 'string' && CLASSIFICATION_SET.has(value);
}

/** Ordering used to propagate the highest classification (exports inherit the maximum). */
const CLASSIFICATION_RANK: Readonly<Record<Classification, number>> = {
  public: 0,
  internal: 1,
  confidential: 2,
  restricted: 3,
};

export function classificationRank(value: Classification): number {
  return CLASSIFICATION_RANK[value];
}

export function highestClassification(values: readonly Classification[]): Classification {
  let highest: Classification = 'public';
  for (const value of values) {
    if (CLASSIFICATION_RANK[value] > CLASSIFICATION_RANK[highest]) highest = value;
  }
  return highest;
}

/* ------------------------------------------------------------ relationship types */

/** docs/knowledge/relationship-taxonomy.md — all seven families. */
export const RELATIONSHIP_TYPES = [
  // Organizational
  'OWNS',
  'MANAGES',
  'MEMBER_OF',
  'REPORTS_TO',
  'RESPONSIBLE_FOR',
  // Physical
  'LOCATED_IN',
  'CONTAINS',
  'INSTALLED_AT',
  'CONNECTED_TO',
  'ADJACENT_TO',
  // Technical
  'DEPENDS_ON',
  'HOSTS',
  'RUNS_ON',
  'EXPOSES',
  'CONNECTS_TO',
  'MONITORED_BY',
  // Service
  'SUPPORTS',
  'PROVIDED_BY',
  'AFFECTS',
  'USED_BY',
  'ASSIGNED_TO',
  // Governance
  'GOVERNED_BY',
  'REQUIRES',
  'AUTHORIZED_BY',
  'APPROVED_BY',
  'EXEMPTED_BY',
  // Knowledge
  'DOCUMENTED_BY',
  'DERIVED_FROM',
  'EVIDENCED_BY',
  'RELATED_TO',
  'SUPERSEDES',
  // Operational
  'GENERATED',
  'RESOLVED_BY',
  'CHANGED_BY',
  'IMPACTS',
  'TRIGGERS',
] as const;

export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];

const RELATIONSHIP_TYPE_SET: ReadonlySet<string> = new Set(RELATIONSHIP_TYPES);

export function isRelationshipType(value: unknown): value is RelationshipType {
  return typeof value === 'string' && RELATIONSHIP_TYPE_SET.has(value);
}

/* ------------------------------------------------------------------ actor types */

/** docs/security/rbac-abac-model.md "Subjects" */
export const ACTOR_TYPES = ['human', 'service', 'agent'] as const;
export type ActorType = (typeof ACTOR_TYPES)[number];

const ACTOR_TYPE_SET: ReadonlySet<string> = new Set(ACTOR_TYPES);

export function isActorType(value: unknown): value is ActorType {
  return typeof value === 'string' && ACTOR_TYPE_SET.has(value);
}

/* ------------------------------------------------------------- provenance kinds */

/** docs/knowledge/provenance-model.md "source type" */
export const SOURCE_TYPES = [
  'human_input',
  'service',
  'agent_proposal',
  'connector_observation',
  'document_extraction',
  'imported_dataset',
  'derived',
] as const;

export type SourceType = (typeof SOURCE_TYPES)[number];

const SOURCE_TYPE_SET: ReadonlySet<string> = new Set(SOURCE_TYPES);

export function isSourceType(value: unknown): value is SourceType {
  return typeof value === 'string' && SOURCE_TYPE_SET.has(value);
}

/**
 * Source types representing externally derived facts.
 *
 * canonical-object-schema.md invariant 4 and knowledge-object-lifecycle.md both require
 * provenance for externally derived facts; these are the types that trigger that requirement.
 */
const EXTERNALLY_DERIVED: ReadonlySet<SourceType> = new Set<SourceType>([
  'connector_observation',
  'document_extraction',
  'imported_dataset',
  'derived',
  'agent_proposal',
]);

export function isExternallyDerived(sourceType: SourceType): boolean {
  return EXTERNALLY_DERIVED.has(sourceType);
}

/** docs/knowledge/provenance-model.md "validation status" */
export const VALIDATION_STATES = ['unvalidated', 'validated', 'rejected', 'superseded'] as const;
export type ValidationState = (typeof VALIDATION_STATES)[number];

const VALIDATION_SET: ReadonlySet<string> = new Set(VALIDATION_STATES);

export function isValidationState(value: unknown): value is ValidationState {
  return typeof value === 'string' && VALIDATION_SET.has(value);
}
