import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.update_vector', () => {
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
    it('should update a vector in the namespace', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          index_host: 'test-host',
          namespace: 'test-ns',
          update: '{"id": "vec1", "values": [1,2,3], "metadata": {"genre": "comedy"}}',
        },
      } satisfies Bundle;

      const updateMock = vi.fn().mockResolvedValue(undefined);
      const namespaceMock = vi.fn().mockReturnValue({ update: updateMock });
      const indexMock = vi.fn().mockReturnValue({ namespace: namespaceMock });
      vi.spyOn(Pinecone.prototype, 'index').mockImplementation(indexMock as any);

      const result = await appTester(App.creates.update_vector!.operation.perform, bundle);

      expect(indexMock).toHaveBeenCalledWith('test-index', 'test-host');
      expect(namespaceMock).toHaveBeenCalledWith('test-ns');
      expect(updateMock).toHaveBeenCalledWith({ id: 'vec1', values: [1,2,3], metadata: { genre: 'comedy' } });
      expect(result).toEqual({ success: true, id: 'vec1', name: 'vec1', status: 'updated' });
    });
  });
}); 