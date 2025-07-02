import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.create_serverless_index', () => {
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
    it('should create a serverless index successfully', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          name: 'test-serverless-index',
          dimension: 1536,
          metric: 'cosine',
          cloud: 'aws',
          region: 'us-east-1',
        },
      } satisfies Bundle;

      const createIndexMock = vi.fn().mockResolvedValue({
        name: 'test-serverless-index',
        status: 'created',
      });
      vi.spyOn(Pinecone.prototype, 'createIndex').mockImplementation(createIndexMock);

      const result = await appTester(App.creates.create_serverless_index!.operation.perform as any, bundle);

      expect(createIndexMock).toHaveBeenCalledWith({
        name: 'test-serverless-index',
        dimension: 1536,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1',
          },
        },
      });
      expect(result).toEqual({ name: 'test-serverless-index', status: 'created' });
    });
  });
});
