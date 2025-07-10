import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import { __setPineconeMockState } from '../../../__mocks__/@pinecone-database/pinecone';
import App from '../../index';

vi.mock('@pinecone-database/pinecone');

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
        model: 'bge-reranker-v2-m3',
        data: [
          { index: 0, score: 0.95, document: 'Zapier is an automation tool.' },
          { index: 1, score: 0.75, document: 'Pinecone is a vector database.' },
        ],
        usage: { rerankUnits: 1 },
      };
      const rerankMock = vi.fn().mockResolvedValue(rerankResponse);
      __setPineconeMockState({
        inference: { embed: vi.fn(), getModel: vi.fn(), listModels: vi.fn(), rerank: rerankMock },
        describeIndex: vi.fn(),
        listIndexes: vi.fn(),
        index: vi.fn(),
      });

      const result = await appTester((App.searches.rerank!.operation.perform as any), bundle);

      expect(rerankMock).toHaveBeenCalledWith('bge-reranker-v2-m3', 'What is Zapier?', [
        'Zapier is an automation tool.',
        'Pinecone is a vector database.',
      ], expect.objectContaining({}));
      expect(result).toEqual([rerankResponse]);
    });
  });
}); 