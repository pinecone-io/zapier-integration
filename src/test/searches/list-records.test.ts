import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import { __setPineconeMockState } from '../../../__mocks__/@pinecone-database/pinecone';
import App from '../../index';

vi.mock('@pinecone-database/pinecone');

const appTester = zapier.createAppTester(App);

describe('searches.list_records', () => {
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
    it('should list records', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          namespace: 'default',
        },
      } satisfies Bundle;

      const listRecordsResponse = {
        namespace: 'default',
        records: [
          { id: 'record1', values: [0.1, 0.2, 0.3] },
          { id: 'record2', values: [0.4, 0.5, 0.6] },
        ],
        usage: { listUnits: 1 },
      };
      const listRecordsMock = vi.fn().mockResolvedValue(listRecordsResponse);
      __setPineconeMockState({
        inference: { embed: vi.fn(), getModel: vi.fn(), listModels: vi.fn(), rerank: vi.fn() },
        describeIndex: vi.fn(),
        listIndexes: vi.fn(),
        index: vi.fn().mockReturnValue({ namespace: vi.fn().mockReturnValue({ listRecords: listRecordsMock }) }),
      });

      const result = await appTester((App.searches.list_records!.operation.perform as any), bundle);

      expect(listRecordsMock).toHaveBeenCalledWith('test-index', 'default', expect.objectContaining({}));
      expect(result).toEqual([listRecordsResponse]);
    });
  });
});
