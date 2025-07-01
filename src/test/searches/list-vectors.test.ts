import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('searches.list_vectors', () => {
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
    it('should list vectors in a namespace', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          index_host: 'test-host',
          namespace: 'test-ns',
        },
      } satisfies Bundle;

      const vectorsResponse = [
        { id: 'vec1', values: [1,2,3], metadata: { genre: 'comedy' } },
        { id: 'vec2', values: [4,5,6], metadata: { genre: 'drama' } },
      ];
      const listPaginatedMock = vi.fn().mockResolvedValue(vectorsResponse);
      const namespaceMock = vi.fn().mockReturnValue({ listPaginated: listPaginatedMock });
      const indexMock = vi.fn().mockReturnValue({ namespace: namespaceMock });
      vi.spyOn(Pinecone.prototype, 'index').mockImplementation(indexMock as any);

      const result = await appTester((App.searches.list_vectors!.operation.perform as any), bundle);

      expect(indexMock).toHaveBeenCalledWith('test-index', 'test-host');
      expect(namespaceMock).toHaveBeenCalledWith('test-ns');
      expect(listPaginatedMock).toHaveBeenCalledWith({});
      expect(result).toEqual([vectorsResponse]);
    });
  });
}); 