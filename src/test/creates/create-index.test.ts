import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.create_index', () => {
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
          spec_type: 'serverless',
          cloud: 'aws',
          region: 'us-east-1',
          deletion_protection: 'disabled',
        },
      } satisfies Bundle;

      const createIndexMock = vi.fn().mockResolvedValue(undefined);
      vi.spyOn(Pinecone.prototype, 'createIndex').mockImplementation(createIndexMock);

      const result = await appTester(App.creates.create_index!.operation.perform, bundle);

      expect(createIndexMock).toHaveBeenCalledWith(expect.objectContaining({
        name: 'test-serverless-index',
        dimension: 1536,
        metric: 'cosine',
        spec: expect.objectContaining({
          serverless: expect.objectContaining({
            cloud: 'aws',
            region: 'us-east-1',
          }),
        }),
        deletion_protection: 'disabled',
      }));
      expect(result).toEqual({ name: 'test-serverless-index', status: 'created' });
    });

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

      const createIndexMock = vi.fn().mockResolvedValue(undefined);
      vi.spyOn(Pinecone.prototype, 'createIndex').mockImplementation(createIndexMock);

      const result = await appTester(App.creates.create_index!.operation.perform, bundle);

      expect(createIndexMock).toHaveBeenCalledWith(expect.objectContaining({
        name: 'test-pod-index',
        dimension: 768,
        metric: 'euclidean',
        spec: expect.objectContaining({
          pod: expect.objectContaining({
            environment: 'us-west1-gcp',
            pod_type: 'p1.x1',
            pods: 1,
            replicas: 1,
            shards: 1,
          }),
        }),
      }));
      expect(result).toEqual({ name: 'test-pod-index', status: 'created' });
    });

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

      const createIndexMock = vi.fn().mockResolvedValue(undefined);
      vi.spyOn(Pinecone.prototype, 'createIndex').mockImplementation(createIndexMock);

      const result = await appTester(App.creates.create_index!.operation.perform, bundle);

      expect(createIndexMock).toHaveBeenCalledWith(expect.objectContaining({
        name: 'test-byoc-index',
        dimension: 512,
        metric: 'dotproduct',
        spec: expect.objectContaining({
          byoc: expect.objectContaining({
            environment: 'aws-us-east-1-b921',
          }),
        }),
        tags: expect.objectContaining({
          environment: 'production',
          team: 'ai',
        }),
      }));
      expect(result).toEqual({ name: 'test-byoc-index', status: 'created' });
    });
  });
});
