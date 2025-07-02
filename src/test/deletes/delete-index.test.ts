import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('deletes.delete_index', () => {
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
    it('should delete an index', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
        },
      } satisfies Bundle;

      const deleteIndexMock = vi.fn().mockResolvedValue(undefined);
      vi.spyOn(Pinecone.prototype, 'deleteIndex').mockImplementation(deleteIndexMock);

      const result = await appTester(App.creates.delete_index!.operation.perform as any, bundle);

      expect(deleteIndexMock).toHaveBeenCalledWith('test-index');
      expect(result).toEqual({ message: 'Delete successful' });
    });
  });
}); 