import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('searches.query', () => {
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
    it('should query an index', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          index_host: 'test-host',
          namespace: 'test-ns',
          topK: 2,
          text: 'find this',
          filter: '{"genre": "comedy"}',
        },
      } satisfies Bundle;

      const queryResponse = {
        matches: [
          { id: 'vec1', score: 0.99 },
          { id: 'vec2', score: 0.95 },
        ],
      };
      const queryMock = vi.fn().mockResolvedValue(queryResponse);
      const namespaceMock = vi.fn().mockReturnValue({ query: queryMock });
      const indexMock = vi.fn().mockReturnValue({ namespace: namespaceMock });
      vi.spyOn(Pinecone.prototype, 'index').mockImplementation(indexMock as any);

      const result = await appTester((App.searches.query!.operation.perform as any), bundle);

      expect(indexMock).toHaveBeenCalledWith('test-index', 'test-host');
      expect(namespaceMock).toHaveBeenCalledWith('test-ns');
      expect(queryMock).toHaveBeenCalledWith({
        topK: 2,
        filter: { genre: 'comedy' },
        text: 'find this',
      });
      expect(result).toEqual([queryResponse]);
    });
  });
}); 