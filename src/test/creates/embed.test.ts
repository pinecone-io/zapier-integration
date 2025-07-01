import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.embed', () => {
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
    it('should generate embeddings for basic input', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          model: 'llama-text-embed-v2',
          texts: '["hello world"]',
        },
      } satisfies Bundle;

      const embedMock = vi.fn().mockResolvedValue({
        model: 'llama-text-embed-v2',
        data: [{ values: [0.1, 0.2, 0.3] }],
        usage: { totalTokens: 2 },
      });
      const realInference = Object.getOwnPropertyDescriptor(Pinecone.prototype, 'inference')?.get?.call({});
      vi.spyOn(Pinecone.prototype, 'inference', 'get').mockReturnValue({ ...realInference, embed: embedMock });

      const result = await appTester(App.creates.embed!.operation.perform, bundle);

      expect(embedMock).toHaveBeenCalledWith('llama-text-embed-v2', ['hello world'], {});
      expect(result).toEqual({
        model: 'llama-text-embed-v2',
        data: [{ values: [0.1, 0.2, 0.3] }],
        usage: { totalTokens: 2 },
      });
    });

    it('should generate embeddings with inputType', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          model: 'llama-text-embed-v2',
          texts: '["foo bar"]',
          inputType: 'passage',
        },
      } satisfies Bundle;

      const embedMock = vi.fn().mockResolvedValue({
        model: 'llama-text-embed-v2',
        data: [{ values: [0.4, 0.5, 0.6] }],
        usage: { totalTokens: 2 },
      });
      const realInference = Object.getOwnPropertyDescriptor(Pinecone.prototype, 'inference')?.get?.call({});
      vi.spyOn(Pinecone.prototype, 'inference', 'get').mockReturnValue({ ...realInference, embed: embedMock });

      const result = await appTester(App.creates.embed!.operation.perform, bundle);

      expect(embedMock).toHaveBeenCalledWith('llama-text-embed-v2', ['foo bar'], { inputType: 'passage' });
      expect(result).toEqual({
        model: 'llama-text-embed-v2',
        data: [{ values: [0.4, 0.5, 0.6] }],
        usage: { totalTokens: 2 },
      });
    });

    it('should generate embeddings with truncate', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          model: 'llama-text-embed-v2',
          texts: '["baz qux"]',
          truncate: 'END',
        },
      } satisfies Bundle;

      const embedMock = vi.fn().mockResolvedValue({
        model: 'llama-text-embed-v2',
        data: [{ values: [0.7, 0.8, 0.9] }],
        usage: { totalTokens: 2 },
      });
      const realInference = Object.getOwnPropertyDescriptor(Pinecone.prototype, 'inference')?.get?.call({});
      vi.spyOn(Pinecone.prototype, 'inference', 'get').mockReturnValue({ ...realInference, embed: embedMock });

      const result = await appTester(App.creates.embed!.operation.perform, bundle);

      expect(embedMock).toHaveBeenCalledWith('llama-text-embed-v2', ['baz qux'], { truncate: 'END' });
      expect(result).toEqual({
        model: 'llama-text-embed-v2',
        data: [{ values: [0.7, 0.8, 0.9] }],
        usage: { totalTokens: 2 },
      });
    });
  });
}); 