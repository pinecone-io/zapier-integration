import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('triggers.list_models', () => {
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
    it('should list available models', async () => {
      const bundle = {
        ...baseBundle,
      } satisfies Bundle;

      const modelsResponse = [
        { model: 'llama-text-embed-v2', type: 'embed', providerName: 'NVIDIA' },
        { model: 'multilingual-e5-large', type: 'embed', providerName: 'Pinecone' },
      ];
      const listModelsMock = vi.fn().mockResolvedValue(modelsResponse);
      const realInference = Object.getOwnPropertyDescriptor(Pinecone.prototype, 'inference')?.get?.call({});
      vi.spyOn(Pinecone.prototype, 'inference', 'get').mockReturnValue({ ...realInference, listModels: listModelsMock });

      const result = await appTester((App.triggers.list_models!.operation.perform as any), bundle);

      expect(listModelsMock).toHaveBeenCalledWith();
      expect(result).toEqual(modelsResponse);
    });
  });
});
 