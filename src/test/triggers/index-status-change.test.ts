import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('triggers.index_status_change', () => {
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
    it('should describe index status for polling', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          index_host: 'test-host',
        },
      } satisfies Bundle;

      const describeIndexResponse = {
        name: 'test-index',
        status: { ready: true, state: 'Ready' },
      };
      const describeIndexMock = vi.fn().mockResolvedValue(describeIndexResponse);
      const indexMock = vi.fn().mockReturnValue({ describeIndex: describeIndexMock });
      vi.spyOn(Pinecone.prototype, 'index').mockImplementation(indexMock as any);

      const result = await appTester((App.triggers.index_status_change!.operation.perform as any), bundle);

      expect(indexMock).toHaveBeenCalledWith('test-index', 'test-host');
      expect(describeIndexMock).toHaveBeenCalledWith();
      expect(result).toEqual([{
        name: 'test-index',
        status: 'ready',
      }]);
    });
  });
});