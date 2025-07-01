import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.delete_namespace', () => {
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
    it('should delete a namespace', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          index_host: 'test-host',
          namespace: 'test-ns',
        },
      } satisfies Bundle;

      const deleteNamespaceMock = vi.fn().mockResolvedValue(undefined);
      const indexMock = vi.fn().mockReturnValue({ deleteNamespace: deleteNamespaceMock });
      vi.spyOn(Pinecone.prototype, 'index').mockImplementation(indexMock as any);

      const result = await appTester(App.creates.delete_namespace!.operation.perform, bundle);

      expect(indexMock).toHaveBeenCalledWith('test-index', 'test-host');
      expect(deleteNamespaceMock).toHaveBeenCalledWith('test-ns');
      expect(result).toEqual({ success: true, namespace: 'test-ns', name: 'test-ns', status: 'deleted' });
    });
  });
}); 