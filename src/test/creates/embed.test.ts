import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';

vi.mock('@pinecone-database/pinecone');
import { Pinecone, __setPineconeMockState, __getPineconeMockState } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.embed', () => {
  beforeEach(() => {
    __setPineconeMockState({
      inference: { embed: vi.fn() },
      describeIndex: vi.fn(),
      listIndexes: vi.fn(),
      index: vi.fn(),
    });
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
    it('should generate embeddings for basic input', async () => {
      const embedMock = vi.fn().mockResolvedValue({
        data: [{ values: [0.1, 0.2, 0.3] }],
        usage: { totalTokens: 2 },
      });
      __setPineconeMockState({
        inference: { embed: embedMock },
        describeIndex: vi.fn(),
        listIndexes: vi.fn(),
        index: vi.fn(),
      });
      const bundle = {
        ...baseBundle,
        inputData: {
          model: 'llama-text-embed-v2',
          texts: '["hello world"]',
        },
      } satisfies Bundle;

      const result = await appTester(App.creates.embed!.operation.perform, bundle);

      expect(result).toEqual({
        model: 'llama-text-embed-v2',
        data: [{ values: [0.1, 0.2, 0.3] }],
        usage: { totalTokens: 2 },
      });
    });

    it('should generate embeddings with inputType', async () => {
      const embedMock = vi.fn().mockResolvedValue({
        data: [{ values: [0.4, 0.5, 0.6] }],
        usage: { totalTokens: 2 },
      });
      __setPineconeMockState({
        inference: { embed: embedMock },
        describeIndex: vi.fn(),
        listIndexes: vi.fn(),
        index: vi.fn(),
      });
      const bundle = {
        ...baseBundle,
        inputData: {
          model: 'llama-text-embed-v2',
          texts: '["foo bar"]',
          inputType: 'passage',
        },
      } satisfies Bundle;

      const result = await appTester(App.creates.embed!.operation.perform, bundle);

      expect(result).toEqual({
        model: 'llama-text-embed-v2',
        data: [{ values: [0.4, 0.5, 0.6] }],
        usage: { totalTokens: 2 },
      });
    });

    it('should generate embeddings with truncate', async () => {
      const embedMock = vi.fn().mockResolvedValue({
        data: [{ values: [0.7, 0.8, 0.9] }],
        usage: { totalTokens: 2 },
      });
      __setPineconeMockState({
        inference: { embed: embedMock },
        describeIndex: vi.fn(),
        listIndexes: vi.fn(),
        index: vi.fn(),
      });
      const bundle = {
        ...baseBundle,
        inputData: {
          model: 'llama-text-embed-v2',
          texts: '["baz qux"]',
          truncate: 'END',
        },
      } satisfies Bundle;

      const result = await appTester(App.creates.embed!.operation.perform, bundle);
      // Log the result for debugging
      console.log('EMBED TEST RESULT:', result);
      expect(result).toEqual({
        model: 'llama-text-embed-v2',
        data: [{ values: [0.7, 0.8, 0.9] }],
        usage: { totalTokens: 2 },
      });
    });
  });
}); 