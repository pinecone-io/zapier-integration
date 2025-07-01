import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.configure_index', () => {
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
    it('should configure index with basic config', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          pod_type: 'p1.x2',
          replicas: 2,
          deletion_protection: 'enabled',
        },
      } satisfies Bundle;

      const configureIndexMock = vi.fn().mockResolvedValue({
        name: 'test-index',
        metric: 'cosine',
        dimension: 1536,
        status: { ready: true, state: 'Ready' },
        host: 'test-index-host',
        spec: { serverless: { region: 'us-east-1', cloud: 'aws' } },
        tags: undefined,
      });
      vi.spyOn(Pinecone.prototype, 'configureIndex').mockImplementation(configureIndexMock);

      const result = await appTester(App.creates.configure_index!.operation.perform, bundle);

      expect(configureIndexMock).toHaveBeenCalledWith('test-index', expect.objectContaining({
        pod_type: 'p1.x2',
        replicas: 2,
        deletion_protection: 'enabled',
      }));
      expect(result).toEqual(expect.objectContaining({
        name: 'test-index',
        metric: 'cosine',
        dimension: 1536,
        status: 'configured',
        host: 'test-index-host',
        spec: { serverless: { region: 'us-east-1', cloud: 'aws' } },
      }));
    });

    it('should configure index with tags', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          tags: '{"environment": "production", "example": "tag"}',
        },
      } satisfies Bundle;

      const configureIndexMock = vi.fn().mockResolvedValue({
        name: 'test-index',
        tags: { environment: 'production', example: 'tag' },
      });
      vi.spyOn(Pinecone.prototype, 'configureIndex').mockImplementation(configureIndexMock);

      const result = await appTester(App.creates.configure_index!.operation.perform, bundle);

      expect(configureIndexMock).toHaveBeenCalledWith('test-index', expect.objectContaining({
        tags: { environment: 'production', example: 'tag' },
      }));
      expect(result).toEqual(expect.objectContaining({
        name: 'test-index',
        tags: { environment: 'production', example: 'tag' },
        status: 'configured',
      }));
    });

    it('should configure index with embed config', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          embed_model: 'llama-text-embed-v2',
          embed_field_map: '{"text": "chunk_text"}',
        },
      } satisfies Bundle;

      const configureIndexMock = vi.fn().mockResolvedValue({
        name: 'test-index',
        embed: { model: 'llama-text-embed-v2', fieldMap: { text: 'chunk_text' } },
      });
      vi.spyOn(Pinecone.prototype, 'configureIndex').mockImplementation(configureIndexMock);

      const result = await appTester(App.creates.configure_index!.operation.perform, bundle);

      expect(configureIndexMock).toHaveBeenCalledWith('test-index', expect.objectContaining({
        embed: { model: 'llama-text-embed-v2', fieldMap: { text: 'chunk_text' } },
      }));
      expect(result).toEqual(expect.objectContaining({
        name: 'test-index',
        embed: { model: 'llama-text-embed-v2', fieldMap: { text: 'chunk_text' } },
        status: 'configured',
      }));
    });
  });
}); 