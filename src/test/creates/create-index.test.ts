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
    it('should create an index with basic config', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          name: 'integrated-index',
          cloud: 'aws',
          region: 'us-east-1',
          model: 'llama-text-embed-v2',
          field_map: '{"text": "chunk_text"}',
        },
      } satisfies Bundle;

      const createIndexForModelMock = vi.fn().mockResolvedValue({
        name: 'integrated-index',
        status: 'created',
      });
      vi.spyOn(Pinecone.prototype, 'createIndexForModel').mockImplementation(createIndexForModelMock);

      const result = await appTester(App.creates.create_index!.operation.perform as any, bundle);

      expect(createIndexForModelMock).toHaveBeenCalledWith(expect.objectContaining({
        name: 'integrated-index',
        cloud: 'aws',
        region: 'us-east-1',
        embed: { model: 'llama-text-embed-v2', fieldMap: { text: 'chunk_text' } },
      }));
      expect(result).toEqual(expect.objectContaining({
        name: 'integrated-index',
        status: 'created',
      }));
    });

    it('should create an index with tags', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          name: 'integrated-index',
          cloud: 'gcp',
          region: 'europe-west1',
          model: 'llama-text-embed-v2',
          field_map: '{"text": "chunk_text"}',
          tags: '{"environment": "dev", "team": "ai"}',
        },
      } satisfies Bundle;

      const createIndexForModelMock = vi.fn().mockResolvedValue({
        name: 'integrated-index',
        status: 'created',
        tags: { environment: 'dev', team: 'ai' },
      });
      vi.spyOn(Pinecone.prototype, 'createIndexForModel').mockImplementation(createIndexForModelMock);

      const result = await appTester(App.creates.create_index!.operation.perform as any, bundle);

      expect(createIndexForModelMock).toHaveBeenCalledWith(expect.objectContaining({
        tags: { environment: 'dev', team: 'ai' },
      }));
      expect(result).toEqual(expect.objectContaining({
        name: 'integrated-index',
        status: 'created',
      }));
    });

    it('should create an index with wait_until_ready', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          name: 'integrated-index',
          cloud: 'azure',
          region: 'eastus',
          model: 'llama-text-embed-v2',
          field_map: '{"text": "chunk_text"}',
          wait_until_ready: true,
        },
      } satisfies Bundle;

      const createIndexForModelMock = vi.fn().mockResolvedValue({
        name: 'integrated-index',
        status: 'created',
      });
      vi.spyOn(Pinecone.prototype, 'createIndexForModel').mockImplementation(createIndexForModelMock);

      const result = await appTester(App.creates.create_index!.operation.perform as any, bundle);

      expect(createIndexForModelMock).toHaveBeenCalledWith(expect.objectContaining({
        waitUntilReady: true,
      }));
      expect(result).toEqual(expect.objectContaining({
        name: 'integrated-index',
        status: 'created',
      }));
    });
  });
}); 