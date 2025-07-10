import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('triggers.describe_index_stats', () => {
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
    it('should describe index stats', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          index_host: 'test-host',
        },
      } satisfies Bundle;

      const describeIndexStatsResponse = {
        namespaces: { 'test-ns': { recordCount: 5 } },
        dimension: 1536,
        indexFullness: 0.0001,
        totalRecordCount: 5,
      };
      const describeIndexStatsMock = vi.fn().mockResolvedValue(describeIndexStatsResponse);
      const indexMock = vi.fn().mockReturnValue({ describeIndexStats: describeIndexStatsMock });
      vi.spyOn(Pinecone.prototype, 'index').mockImplementation(indexMock as any);

      const result = await appTester((App.searches.describe_index_stats!.operation.perform as any), bundle);

      expect(indexMock).toHaveBeenCalledWith('test-index', 'test-host');
      expect(describeIndexStatsMock).toHaveBeenCalledWith();
      expect(result).toEqual([describeIndexStatsResponse]);
    });
  });
}); 