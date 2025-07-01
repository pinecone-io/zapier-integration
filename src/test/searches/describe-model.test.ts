import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('triggers.describe_model', () => {
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
    it('should describe a model', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          model: 'llama-text-embed-v2',
        },
      } satisfies Bundle;

      const describeModelResponse = {
        model: 'llama-text-embed-v2',
        shortDescription: 'A high performance dense embedding model.',
        type: 'embed',
        vectorType: 'dense',
        defaultDimension: 1024,
        modality: 'text',
        maxSequenceLength: 2048,
        maxBatchSize: 96,
        providerName: 'NVIDIA',
        supportedDimensions: [384, 512, 768, 1024, 2048],
        supportedMetrics: ['Cosine', 'DotProduct'],
        supportedParameters: [
          { parameter: 'input_type', type: 'one_of', valueType: 'string', required: true, allowedValues: ['passage', 'query'] },
          { parameter: 'truncate', type: 'one_of', valueType: 'string', required: false, allowedValues: ['END', 'START'] },
        ],
      };
      const getModelMock = vi.fn().mockResolvedValue(describeModelResponse);
      const realInference = Object.getOwnPropertyDescriptor(Pinecone.prototype, 'inference')?.get?.call({});
      vi.spyOn(Pinecone.prototype, 'inference', 'get').mockReturnValue({ ...realInference, getModel: getModelMock });

      const result = await appTester((App.triggers.describe_model!.operation.perform as any), bundle);

      expect(getModelMock).toHaveBeenCalledWith('llama-text-embed-v2');
      expect(result).toEqual([describeModelResponse]);
    });
  });
}); 