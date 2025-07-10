import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import { __setPineconeMockState } from '../../../__mocks__/@pinecone-database/pinecone';
import App from '../../index';

vi.mock('@pinecone-database/pinecone');

const appTester = zapier.createAppTester(App);

describe('searches.describe_model', () => {
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
      __setPineconeMockState({
        inference: { embed: vi.fn(), getModel: getModelMock },
        describeIndex: vi.fn(),
        listIndexes: vi.fn(),
        index: vi.fn(),
      });

      const result = await appTester((App.searches.describe_model!.operation.perform as any), bundle);

      expect(getModelMock).toHaveBeenCalledWith('llama-text-embed-v2');
      expect(result).toEqual([describeModelResponse]);
    });
  });
}); 