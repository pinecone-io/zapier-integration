import { describe, expect, it, beforeEach } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import nock from 'nock';

import { API_URL } from '../../constants';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('searches.list_indexes', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  const bundle = {
    inputData: {},
    authData: {
      api_key: 'test_api_key_123',
    },
    meta: {} as Bundle['meta'],
    inputDataRaw: {},
  } satisfies Bundle;

  describe('perform', () => {
    it('should return list of indexes', async () => {
      const mockResponse = {
        indexes: [
          {
            name: 'test-index-1',
            metric: 'cosine',
            dimension: 1536,
            status: {
              ready: true,
              state: 'Ready',
            },
            host: 'test-index-1-abc123.svc.us-east-1-aws.pinecone.io',
            spec: {
              serverless: {
                region: 'us-east-1',
                cloud: 'aws',
              },
            },
            deletion_protection: 'disabled',
            tags: {
              environment: 'production',
            },
            vector_type: 'dense',
          },
          {
            name: 'test-index-2',
            metric: 'dotproduct',
            dimension: 768,
            status: {
              ready: false,
              state: 'Initializing',
            },
            host: 'test-index-2-def456.svc.us-west-2-aws.pinecone.io',
            spec: {
              serverless: {
                region: 'us-west-2',
                cloud: 'aws',
              },
            },
            deletion_protection: 'enabled',
            tags: {
              environment: 'development',
            },
            vector_type: 'sparse',
          },
        ],
      };

      const expectedResults = mockResponse.indexes;

      nock(API_URL).get('/indexes').reply(200, mockResponse);

      const results = await appTester((App.searches.list_indexes!.operation.perform as any), bundle);

      expect(results).toEqual(expectedResults);
      expect(results).toHaveLength(2);
      expect(results[0]?.name).toBe('test-index-1');
      expect(results[1]?.name).toBe('test-index-2');
      expect(nock.isDone()).toBe(true);
    });

    it('should return empty array when no indexes exist', async () => {
      const mockResponse = {
        indexes: [],
      };

      nock(API_URL).get('/indexes').reply(200, mockResponse);

      const results = await appTester((App.searches.list_indexes!.operation.perform as any), bundle);

      expect(results).toEqual([]);
      expect(results).toHaveLength(0);
      expect(nock.isDone()).toBe(true);
    });

    it('should handle API errors', async () => {
      nock(API_URL)
        .get('/indexes')
        .reply(500, {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Internal server error',
          },
        });

      await expect(
        appTester((App.searches.list_indexes!.operation.perform as any), bundle),
      ).rejects.toThrow();
      expect(nock.isDone()).toBe(true);
    });
  });
});
