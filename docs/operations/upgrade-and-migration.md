# PCI Upgrade and Migration Strategy

## Principles

- Upgrades must be repeatable and reversible where practical.
- Database/schema migrations are versioned.
- Knowledge Object schemas are versioned and backward-compatible where possible.
- Model/runtime upgrades are independent from platform upgrades.
- Configuration changes are declarative and reviewable.
- Backups are verified before destructive migrations.

## Upgrade Classes

1. Patch — security and defect fixes with no intended contract changes.
2. Minor — backward-compatible capabilities and schema additions.
3. Major — intentional breaking changes requiring migration planning.

## Required Upgrade Evidence

Each release must identify schema changes, configuration changes, compatibility impact, migration steps, rollback strategy, test evidence, and operational notes.

## AI Runtime Changes

AI model replacement must be evaluated independently from application releases. Model identity, version, evaluation results, and routing policy must be recorded before production promotion.
