import { describe, expect, it, beforeEach, vi } from 'vitest';
vi.mock('@pinecone-database/pinecone');
import { __setPineconeMockState } from '@pinecone-database/pinecone';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.update_document', () => {
  let embedMock: ReturnType<typeof vi.fn>;
  let updateMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    embedMock = vi.fn();
    updateMock = vi.fn();
    // The namespace function should return an object with update: updateMock
    const namespaceObj = { update: updateMock };
    const indexMock = vi.fn().mockReturnValue({ namespace: vi.fn().mockReturnValue(namespaceObj) });
    __setPineconeMockState({
      inference: {
        embed: embedMock,
        getModel: vi.fn(),
        listModels: vi.fn(),
        rerank: vi.fn(),
      },
      index: indexMock,
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

  it('should update a document with new text and embedding', async () => {
    const bundle = {
      ...baseBundle,
      inputData: {
        index_name: 'test-index',
        index_host: 'host',
        namespace: 'default',
        document_id: 'doc-123',
        document: 'Updated text',
        model: 'llama-text-embed-v2',
      },
    } satisfies Bundle;

    embedMock.mockResolvedValue({ data: [{ values: [0.4, 0.5, 0.6] }] });
    updateMock.mockResolvedValue({ updatedCount: 1 });

    const result = await appTester((App.creates.update_document!.operation.perform as any), bundle) as any;
    expect(embedMock).toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalled();
    expect(result.id).toBe('doc-123');
  });

  it('should update a document with new metadata only', async () => {
    const bundle = {
      ...baseBundle,
      inputData: {
        index_name: 'test-index',
        index_host: 'host',
        namespace: 'default',
        document_id: 'doc-123',
        metadata: '{"foo":"baz"}'
      },
    } satisfies Bundle;

    updateMock.mockResolvedValue({ updatedCount: 1 });

    const result = await appTester((App.creates.update_document!.operation.perform as any), bundle) as any;
    expect(updateMock).toHaveBeenCalled();
    expect(result.id).toBe('doc-123');
  });

  it('should throw if neither text nor metadata is provided', async () => {
    const bundle = {
      ...baseBundle,
      inputData: {
        index_name: 'test-index',
        index_host: 'host',
        namespace: 'default',
        document_id: 'doc-123',
      },
    } satisfies Bundle;

    await expect(appTester((App.creates.update_document!.operation.perform as any), bundle)).rejects.toThrow();
  });
}); 