/**
 * The OpenAPI document and the implemented router must describe the same API.
 *
 * Source: docs/architecture/technology-standards.md — OpenAPI is "Required for externally
 *         consumed HTTP APIs where applicable"; api-and-event-standards.md — "A service can
 *         consume an API or event contract without knowing internal database structures".
 *
 * A specification that drifts from the implementation is worse than none, because consumers
 * trust it. This test makes drift a build failure rather than a support ticket.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildRouter } from '../../src/http/server.ts';
import { MatchKind } from '../../src/http/router.ts';
import { KnowledgeService } from '../../src/application/knowledge-service.ts';
import { MemoryKnowledgeRepository } from '../../src/adapters/memory/memory-repository.ts';
import { StaticPolicyEngine } from '../../src/adapters/policy/static-policy-engine.ts';
import { systemClock } from '../../src/ports/clock.ts';
import { NullLogger } from '../../src/observability/logger.ts';
import { OBJECT_TYPES, RELATIONSHIP_TYPES, LIFECYCLE_STATES, CLASSIFICATIONS } from '../../src/domain/vocabulary.ts';

const SPEC_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'openapi',
  'kernel.openapi.json',
);

type OpenApi = {
  openapi: string;
  paths: Record<string, Record<string, unknown>>;
  components: { schemas: Record<string, { enum?: string[] }> };
};

const spec = JSON.parse(readFileSync(SPEC_PATH, 'utf8')) as OpenApi;

const HTTP_METHODS = ['get', 'post', 'patch', 'put', 'delete'];

/** Every (method, path) pair declared in the document. */
function specOperations(): { method: string; path: string }[] {
  const operations: { method: string; path: string }[] = [];
  for (const [path, item] of Object.entries(spec.paths)) {
    for (const method of Object.keys(item)) {
      if (HTTP_METHODS.includes(method)) {
        operations.push({ method: method.toUpperCase(), path });
      }
    }
  }
  return operations;
}

/** Substitute a concrete value for each `{param}` so the router can match it. */
function concretePath(path: string): string {
  return path.replace(/\{[^}]+\}/g, '9f1c4a4e-4f2a-4a63-9c2e-2b8a1d0e5f11');
}

function router() {
  const repository = new MemoryKnowledgeRepository();
  return buildRouter(
    new KnowledgeService({
      repository,
      policy: new StaticPolicyEngine(),
      clock: systemClock,
      logger: new NullLogger(),
      environment: 'test',
    }),
  );
}

describe('OpenAPI document', () => {
  test('is a valid OpenAPI 3.1 document with the expected top-level shape', () => {
    assert.match(spec.openapi, /^3\.1\./);
    assert.ok(Object.keys(spec.paths).length > 0);
    assert.ok(spec.components.schemas['KnowledgeObject']);
  });

  test('every documented operation is implemented', () => {
    const implemented = router();
    const missing: string[] = [];

    for (const operation of specOperations()) {
      // Health routes are handled ahead of the router in the server; check them separately.
      if (operation.path.startsWith('/health/')) continue;

      const match = implemented.match(operation.method, concretePath(operation.path));
      if (match.kind !== MatchKind.Found) {
        missing.push(`${operation.method} ${operation.path}`);
      }
    }

    assert.deepEqual(missing, [], 'documented operations that the router does not serve');
  });

  test('health endpoints are documented', () => {
    assert.ok(spec.paths['/health/live']?.['get']);
    assert.ok(spec.paths['/health/ready']?.['get']);
  });

  test('documented enums match the domain vocabularies', () => {
    // A stale enum in the specification would send clients values the kernel rejects.
    assert.deepEqual(
      spec.components.schemas['ObjectType']?.enum?.slice().sort(),
      [...OBJECT_TYPES].sort(),
    );
    assert.deepEqual(
      spec.components.schemas['RelationshipType']?.enum?.slice().sort(),
      [...RELATIONSHIP_TYPES].sort(),
    );
    assert.deepEqual(
      spec.components.schemas['LifecycleState']?.enum?.slice().sort(),
      [...LIFECYCLE_STATES].sort(),
    );
    assert.deepEqual(
      spec.components.schemas['Classification']?.enum?.slice().sort(),
      [...CLASSIFICATIONS].sort(),
    );
  });

  test('every mutating operation documents If-Match or a request body', () => {
    for (const [path, item] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(item)) {
        if (!['patch', 'put'].includes(method)) continue;
        const declared = JSON.stringify(operation) + JSON.stringify(item['parameters'] ?? []);
        assert.ok(
          declared.includes('IfMatch') || declared.includes('If-Match'),
          `${method.toUpperCase()} ${path} must document the If-Match precondition`,
        );
      }
    }
  });

  test('every protected operation documents 401 and 403', () => {
    for (const [path, item] of Object.entries(spec.paths)) {
      if (path.startsWith('/health/')) continue;
      for (const [method, operation] of Object.entries(item)) {
        if (!HTTP_METHODS.includes(method)) continue;
        const responses = (operation as { responses: Record<string, unknown> }).responses;
        assert.ok(responses['401'], `${method.toUpperCase()} ${path} must document 401`);
        assert.ok(responses['403'], `${method.toUpperCase()} ${path} must document 403`);
      }
    }
  });
});
