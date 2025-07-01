import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.upsert_text', () => {
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
    it('should upsert text records in the namespace', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          index_host: 'test-host',
          namespace: 'test-ns',
          records: '[{"_id": "rec1", "chunk_text": "hello", "category": "a"}, {"_id": "rec2", "chunk_text": "world", "category": "b"}]',
        },
      } satisfies Bundle;

      const upsertRecordsMock = vi.fn().mockResolvedValue(undefined);
      const namespaceMock = vi.fn().mockReturnValue({ upsertRecords: upsertRecordsMock });
      const indexMock = vi.fn().mockReturnValue({ namespace: namespaceMock });
      vi.spyOn(Pinecone.prototype, 'index').mockImplementation(indexMock as any);

      const result = await appTester(App.creates.upsert_text!.operation.perform, bundle);

      expect(indexMock).toHaveBeenCalledWith('test-index', 'test-host');
      expect(namespaceMock).toHaveBeenCalledWith('test-ns');
      expect(upsertRecordsMock).toHaveBeenCalledWith([
        { _id: 'rec1', chunk_text: 'hello', category: 'a' },
        { _id: 'rec2', chunk_text: 'world', category: 'b' },
      ]);
      expect(result).toEqual({ success: true, count: 2, name: 'test-index', status: 'upserted' });
    });
  });
}); 