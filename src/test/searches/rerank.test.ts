import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('searches.rerank', () => {
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
    it('should rerank documents', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          model: 'bge-reranker-v2-m3',
          query: 'What is Zapier?',
          documents: '["Zapier is an automation tool.", "Pinecone is a vector database."]',
        },
      } satisfies Bundle;

      const rerankResponse = {
        results: [
          { index: 0, relevance_score: 0.95 },
          { index: 1, relevance_score: 0.75 },
        ],
      };
      const rerankMock = vi.fn().mockResolvedValue(rerankResponse);
      const realInference = Object.getOwnPropertyDescriptor(Pinecone.prototype, 'inference')?.get?.call({});
      vi.spyOn(Pinecone.prototype, 'inference', 'get').mockReturnValue({ ...realInference, rerank: rerankMock });

      const result = await appTester((App.searches.rerank!.operation.perform as any), bundle);

      expect(rerankMock).toHaveBeenCalledWith('bge-reranker-v2-m3', 'What is Zapier?', [
        'Zapier is an automation tool.',
        'Pinecone is a vector database.',
      ]);
      expect(result).toEqual([rerankResponse]);
    });
  });
}); 