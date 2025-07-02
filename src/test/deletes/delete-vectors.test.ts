import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.delete_vectors', () => {
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
    it('should delete multiple vectors with deleteMany', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          index_host: 'test-host',
          namespace: 'test-ns',
          ids: '["id-1", "id-2"]',
        },
      } satisfies Bundle;

      const deleteManyMock = vi.fn().mockResolvedValue(undefined);
      const deleteOneMock = vi.fn().mockResolvedValue(undefined);
      const namespaceMock = vi.fn().mockReturnValue({ deleteMany: deleteManyMock, deleteOne: deleteOneMock });
      const indexMock = vi.fn().mockReturnValue({ namespace: namespaceMock });
      vi.spyOn(Pinecone.prototype, 'index').mockImplementation(indexMock as any);

      const result = await appTester(App.creates.delete_vectors!.operation.perform as any, bundle);

      expect(indexMock).toHaveBeenCalledWith('test-index', 'test-host');
      expect(namespaceMock).toHaveBeenCalledWith('test-ns');
      expect(deleteManyMock).toHaveBeenCalledWith(['id-1', 'id-2']);
      expect(result).toEqual({ message: 'Delete successful' });
    });

    it('should delete a single vector with deleteOne', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          index_host: 'test-host',
          namespace: 'test-ns',
          ids: 'id-3',
        },
      } satisfies Bundle;

      const deleteManyMock = vi.fn().mockResolvedValue(undefined);
      const deleteOneMock = vi.fn().mockResolvedValue(undefined);
      const namespaceMock = vi.fn().mockReturnValue({ deleteMany: deleteManyMock, deleteOne: deleteOneMock });
      const indexMock = vi.fn().mockReturnValue({ namespace: namespaceMock });
      vi.spyOn(Pinecone.prototype, 'index').mockImplementation(indexMock as any);

      const result = await appTester(App.creates.delete_vectors!.operation.perform as any, bundle);

      expect(indexMock).toHaveBeenCalledWith('test-index', 'test-host');
      expect(namespaceMock).toHaveBeenCalledWith('test-ns');
      expect(deleteOneMock).toHaveBeenCalledWith('id-3');
      expect(result).toEqual({ message: 'Delete successful' });
    });
  });
}); 