import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('triggers.fetch_vectors', () => {
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
    it('should fetch vectors from a namespace', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          index_host: 'test-host',
          namespace: 'test-ns',
          ids: '["vec1","vec2"]',
        },
      } satisfies Bundle;

      const fetchResponse = {
        vectors: {
          vec1: { id: 'vec1', values: [1,2,3], metadata: { genre: 'comedy' } },
          vec2: { id: 'vec2', values: [4,5,6], metadata: { genre: 'drama' } },
        },
      };
      const fetchMock = vi.fn().mockResolvedValue(fetchResponse);
      const namespaceMock = vi.fn().mockReturnValue({ fetch: fetchMock });
      const indexMock = vi.fn().mockReturnValue({ namespace: namespaceMock });
      vi.spyOn(Pinecone.prototype, 'index').mockImplementation(indexMock as any);

      const result = await appTester((App.triggers.fetch_vectors!.operation.perform as any), bundle);

      expect(indexMock).toHaveBeenCalledWith('test-index', 'test-host');
      expect(namespaceMock).toHaveBeenCalledWith('test-ns');
      expect(fetchMock).toHaveBeenCalledWith(['vec1', 'vec2']);
      expect(result).toEqual([fetchResponse]);
    });
  });
}); 