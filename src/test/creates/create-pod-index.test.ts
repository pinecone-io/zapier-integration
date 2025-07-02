import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.create_pod_index', () => {
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
    it('should create a pod index successfully', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          name: 'test-pod-index',
          dimension: 1536,
          metric: 'cosine',
          environment: 'us-west1-gcp',
          pod_type: 'p1.x1',
          replicas: 1,
        },
      } satisfies Bundle;

      const createIndexMock = vi.fn().mockResolvedValue({
        name: 'test-pod-index',
        status: 'created',
      });
      vi.spyOn(Pinecone.prototype, 'createIndex').mockImplementation(createIndexMock);

      const result = await appTester(App.creates.create_pod_index!.operation.perform as any, bundle);

      expect(createIndexMock).toHaveBeenCalledWith(expect.objectContaining({
        name: 'test-pod-index',
        dimension: 1536,
        metric: 'cosine',
        spec: expect.objectContaining({
          pod: expect.objectContaining({
            environment: 'us-west1-gcp',
            podType: 'p1.x1',
            replicas: 1,
          }),
        }),
      }));
      expect(result).toEqual({ name: 'test-pod-index', status: 'created' });
    });
  });
});
