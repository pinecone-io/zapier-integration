import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import { __setPineconeMockState } from '../../../__mocks__/@pinecone-database/pinecone';
import App from '../../index';

vi.mock('@pinecone-database/pinecone');

const appTester = zapier.createAppTester(App);

describe('searches.search_records', () => {
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
    it('should search records with text query', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          namespace: 'default',
          query_text: 'example query',
          top_k: 5,
          rerank_model: 'pinecone-rerank-v0',
          rank_field: 'text',
        },
      } satisfies Bundle;

      const searchResponse = {
        result: {
          hits: [
            {
              _id: 'rec1',
              _score: 0.95,
              fields: {
                text: 'Example text',
              },
            },
          ],
        },
      };
      const searchMock = vi.fn().mockResolvedValue(searchResponse);
      __setPineconeMockState({
        inference: { embed: vi.fn(), getModel: vi.fn(), listModels: vi.fn(), rerank: vi.fn() },
        describeIndex: vi.fn(),
        listIndexes: vi.fn(),
        index: vi.fn().mockReturnValue({
          namespace: vi.fn().mockReturnValue({
            searchRecords: searchMock,
          }),
        }),
      });

      const result = await appTester((App.searches.search_records!.operation.perform as any), bundle);

      expect(searchMock).toHaveBeenCalledWith({
        query: {
          inputs: { text: 'example query' },
          topK: 5,
        },
        rerank: {
          model: 'pinecone-rerank-v0',
          rankFields: ['text'],
        },
      });
      expect(result).toEqual([
        {
          id: 'rec1',
          score: 0.95,
          fields: {
            text: 'Example text',
          },
        },
      ]);
    });
  });
});
