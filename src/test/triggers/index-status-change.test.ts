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

      const listIndexesResponse = {
        indexes: [
          {
            name: 'test-index',
            metric: 'cosine',
            dimension: 1536,
            status: { ready: true, state: 'Ready' },
            host: 'test-index-host',
            spec: { serverless: { region: 'us-east-1', cloud: 'aws' } },
            deletion_protection: 'disabled',
            tags: { environment: 'dev' },
            vector_type: 'dense',
          },
        ],
      };
      const listIndexesMock = vi.fn().mockResolvedValue(listIndexesResponse);
      vi.spyOn(Pinecone.prototype, 'listIndexes').mockImplementation(listIndexesMock);

      const result = await appTester((App.triggers.index_status_change!.operation.perform as any), bundle);

      expect(listIndexesMock).toHaveBeenCalledWith();
      expect(result[0]).toMatchObject({
        name: 'test-index',
        status: { ready: true, state: 'Ready' },
        host: 'test-index-host',
        spec: { serverless: { region: 'us-east-1', cloud: 'aws' } },
        deletion_protection: 'disabled',
        tags: { environment: 'dev' },
        vector_type: 'dense',
      });
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('status_changed_at');
    });
  });
});