import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('searches.describe_index', () => {
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
    it('should describe an index', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
        },
      } satisfies Bundle;

      const describeIndexResponse = {
        name: 'test-index',
        dimension: 1536,
        metric: 'cosine',
        host: 'test-index-host',
        deletionProtection: 'disabled',
        tags: { environment: 'dev' },
        embed: {
          model: 'pinecone-text-embed-v0',
        },
        spec: { pod: undefined, serverless: { cloud: 'aws', region: 'us-east-1' } },
        status: { ready: true, state: 'Ready' },
        vectorType: 'dense',
      };
      const describeIndexMock = vi.fn().mockResolvedValue(describeIndexResponse);
      vi.spyOn(Pinecone.prototype, 'describeIndex').mockImplementation(describeIndexMock);

      const result = await appTester((App.searches.describe_index!.operation.perform as any), bundle);

      expect(describeIndexMock).toHaveBeenCalledWith('test-index');
      expect(result).toEqual([describeIndexResponse]);
    });
  });
}); 