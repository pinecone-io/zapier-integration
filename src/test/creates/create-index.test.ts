import { describe, expect, it, beforeEach } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import nock from 'nock';

import { API_URL } from '../../constants';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.create_index', () => {
  beforeEach(() => {
    nock.cleanAll();
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
    describe('Given valid serverless index configuration', () => {
      it('should create a serverless index successfully', async () => {
        const bundle = {
          ...baseBundle,
          inputData: {
            name: 'test-serverless-index',
            dimension: 1536,
            metric: 'cosine',
            spec_type: 'serverless',
            cloud: 'aws',
            region: 'us-east-1',
            deletion_protection: 'disabled',
          },
        } satisfies Bundle;

        const expectedResponse = {
          name: 'test-serverless-index',
          metric: 'cosine',
          dimension: 1536,
          vector_type: 'dense',
          status: {
            ready: true,
            state: 'Ready',
          },
          host: 'test-serverless-index-abc123.svc.us-east-1-aws.pinecone.io',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-east-1',
            },
          },
          deletion_protection: 'disabled',
          tags: {},
        };

        const expectedRequest = {
          name: 'test-serverless-index',
          dimension: 1536,
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-east-1',
            },
          },
          deletion_protection: 'disabled',
        };

        nock(API_URL).post('/indexes', expectedRequest).reply(201, expectedResponse);

        const result = await appTester(App.creates.create_index!.operation.perform, bundle);

        expect(result).toEqual(expectedResponse);
      });
    });

    describe('Given valid pod-based index configuration', () => {
      it('should create a pod-based index successfully', async () => {
        const bundle = {
          ...baseBundle,
          inputData: {
            name: 'test-pod-index',
            dimension: 768,
            metric: 'euclidean',
            spec_type: 'pod',
            environment: 'us-west1-gcp',
            pod_type: 'p1.x1',
            pods: '1',
            replicas: '1',
            shards: '1',
          },
        } satisfies Bundle;

        const expectedResponse = {
          name: 'test-pod-index',
          metric: 'euclidean',
          dimension: 768,
          vector_type: 'dense',
          status: {
            ready: true,
            state: 'Ready',
          },
          host: 'test-pod-index-def456.svc.us-west1-gcp.pinecone.io',
          spec: {
            pod: {
              environment: 'us-west1-gcp',
              pod_type: 'p1.x1',
              pods: 1,
              replicas: 1,
              shards: 1,
            },
          },
          deletion_protection: 'disabled',
          tags: {},
        };

        const expectedRequest = {
          name: 'test-pod-index',
          dimension: 768,
          metric: 'euclidean',
          spec: {
            pod: {
              environment: 'us-west1-gcp',
              pod_type: 'p1.x1',
              pods: 1,
              replicas: 1,
              shards: 1,
            },
          },
        };

        nock(API_URL).post('/indexes', expectedRequest).reply(201, expectedResponse);

        const result = await appTester(App.creates.create_index!.operation.perform, bundle);

        expect(result).toEqual(expectedResponse);
      });
    });

    describe('Given valid BYOC index configuration', () => {
      it('should create a BYOC index successfully', async () => {
        const bundle = {
          ...baseBundle,
          inputData: {
            name: 'test-byoc-index',
            dimension: 512,
            metric: 'dotproduct',
            spec_type: 'byoc',
            environment: 'aws-us-east-1-b921',
            tags: '{"environment": "production", "team": "ai"}',
          },
        } satisfies Bundle;

        const expectedResponse = {
          name: 'test-byoc-index',
          metric: 'dotproduct',
          dimension: 512,
          vector_type: 'dense',
          status: {
            ready: true,
            state: 'Ready',
          },
          host: 'test-byoc-index-ghi789.svc.private.aped-4627-b74a.pinecone.io',
          spec: {
            byoc: {
              environment: 'aws-us-east-1-b921',
            },
          },
          deletion_protection: 'disabled',
          tags: {
            environment: 'production',
            team: 'ai',
          },
        };

        const expectedRequest = {
          name: 'test-byoc-index',
          dimension: 512,
          metric: 'dotproduct',
          spec: {
            byoc: {
              environment: 'aws-us-east-1-b921',
            },
          },
          tags: {
            environment: 'production',
            team: 'ai',
          },
        };

        nock(API_URL).post('/indexes', expectedRequest).reply(201, expectedResponse);

        const result = await appTester(App.creates.create_index!.operation.perform, bundle);

        expect(result).toEqual(expectedResponse);
      });
    });

    describe('Given minimal required configuration', () => {
      it('should create an index with only required fields', async () => {
        const bundle = {
          ...baseBundle,
          inputData: {
            name: 'minimal-index',
            dimension: 1024,
            metric: 'cosine',
            spec_type: 'serverless',
            cloud: 'gcp',
            region: 'us-central1',
          },
        } satisfies Bundle;

        const expectedResponse = {
          name: 'minimal-index',
          metric: 'cosine',
          dimension: 1024,
          vector_type: 'dense',
          status: {
            ready: false,
            state: 'Initializing',
          },
          host: 'minimal-index-xyz789.svc.us-central1-gcp.pinecone.io',
          spec: {
            serverless: {
              cloud: 'gcp',
              region: 'us-central1',
            },
          },
          deletion_protection: 'disabled',
          tags: {},
        };

        const expectedRequest = {
          name: 'minimal-index',
          dimension: 1024,
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'gcp',
              region: 'us-central1',
            },
          },
        };

        nock(API_URL).post('/indexes', expectedRequest).reply(201, expectedResponse);

        const result = await appTester(App.creates.create_index!.operation.perform, bundle);

        expect(result).toEqual(expectedResponse);
      });
    });

    describe('Given an API error', () => {
      it('should handle 400 bad request error', async () => {
        const bundle = {
          ...baseBundle,
          inputData: {
            name: 'invalid-index',
            dimension: -1, // Invalid dimension
            metric: 'cosine',
            spec_type: 'serverless',
            cloud: 'aws',
            region: 'us-east-1',
          },
        } satisfies Bundle;

        nock(API_URL)
          .post('/indexes')
          .reply(400, {
            error: {
              code: 'INVALID_ARGUMENT',
              message: 'Dimension must be a positive integer',
            },
          });

        await expect(
          appTester(App.creates.create_index!.operation.perform, bundle),
        ).rejects.toThrow();
      });

      it('should handle 409 conflict error for duplicate index name', async () => {
        const bundle = {
          ...baseBundle,
          inputData: {
            name: 'existing-index',
            dimension: 1536,
            metric: 'cosine',
            spec_type: 'serverless',
            cloud: 'aws',
            region: 'us-east-1',
          },
        } satisfies Bundle;

        nock(API_URL)
          .post('/indexes')
          .reply(409, {
            error: {
              code: 'ALREADY_EXISTS',
              message: 'Index with name "existing-index" already exists',
            },
          });

        await expect(
          appTester(App.creates.create_index!.operation.perform, bundle),
        ).rejects.toThrow();
      });
    });
  });
});
