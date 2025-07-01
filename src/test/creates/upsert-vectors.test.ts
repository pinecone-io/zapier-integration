import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.upsert_vectors', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const baseBundle = {
    inputData: {},
    authData: {
      api_key: 'test_api_key_123',
    },
    meta: {} as Bundle['meta'],
    inputDataRaw: {},
  } satisfies Bundle;

  describe('perform', () => {
    it('should upsert vector records in the namespace', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          index_host: 'test-host',
          namespace: 'test-ns',
          records: '[{"id": "vec1", "values": [1,2,3], "metadata": {"genre": "comedy"}}, {"id": "vec2", "values": [4,5,6], "metadata": {"genre": "drama"}}]',
        },
      } satisfies Bundle;

      const upsertResponse = { upsertedCount: 2 };
      const upsertMock = vi.fn().mockResolvedValue(upsertResponse);
      const namespaceMock = vi.fn().mockReturnValue({ upsert: upsertMock });
      const indexMock = vi.fn().mockReturnValue({ namespace: namespaceMock });
      vi.spyOn(Pinecone.prototype, 'index').mockImplementation(indexMock as any);

      const result = await appTester(App.creates.upsert_vectors!.operation.perform, bundle);

      expect(indexMock).toHaveBeenCalledWith('test-index', 'test-host');
      expect(namespaceMock).toHaveBeenCalledWith('test-ns');
      expect(upsertMock).toHaveBeenCalledWith([
        { id: 'vec1', values: [1,2,3], metadata: { genre: 'comedy' } },
        { id: 'vec2', values: [4,5,6], metadata: { genre: 'drama' } },
      ]);
      expect(result).toEqual({ upsertedCount: 2, name: 'test-index', status: 'upserted' });
    });
  });
}); 