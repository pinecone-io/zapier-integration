import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('deletes.delete_namespace', () => {
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

      const deleteAllMock = vi.fn().mockResolvedValue(undefined);
      const namespaceMock = vi.fn().mockReturnValue({ deleteAll: deleteAllMock });
      const indexMock = vi.fn().mockReturnValue({ namespace: namespaceMock });
      vi.spyOn(Pinecone.prototype, 'index').mockImplementation(indexMock as any);

      const result = await appTester(App.creates.delete_namespace!.operation.perform as any, bundle);

      expect(indexMock).toHaveBeenCalledWith('test-index', 'test-host');
      expect(namespaceMock).toHaveBeenCalledWith('test-ns');
      expect(deleteAllMock).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Delete successful' });
    });
  });
}); 