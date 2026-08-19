/**
 * Runs the repository contract suite against the in-memory adapter.
 *
 * The identical suite is run against PostgreSQL by
 * test/integration/postgres-repository.test.ts when PCI_TEST_DATABASE_URL is set.
 */

import { MemoryKnowledgeRepository } from '../../src/adapters/memory/memory-repository.ts';
import { repositoryContract } from './repository.contract.ts';

repositoryContract('memory', async () => {
  const repository = new MemoryKnowledgeRepository();
  return {
    repository,
    reset: async () => repository.reset(),
    teardown: async () => repository.close(),
  };
});
