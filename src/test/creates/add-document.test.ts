import { describe, expect, it, beforeEach, vi } from 'vitest';
vi.mock('@pinecone-database/pinecone');
import { __setPineconeMockState } from '@pinecone-database/pinecone';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.add_document', () => {
  let upsertRecordsMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    upsertRecordsMock = vi.fn();
    // The namespace function should return an object with upsert: upsertMock
    const namespaceObj = { upsertRecords: upsertRecordsMock };
    const indexMock = vi.fn().mockReturnValue({ namespace: vi.fn().mockReturnValue(namespaceObj) });
    __setPineconeMockState({
      inference: {
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

  it('should add a document with a provided document ID', async () => {
    const bundle = {
      ...baseBundle,
      inputData: {
        index_name: 'test-index',
        index_host: 'host',
        namespace: 'default',
        model: 'llama-text-embed-v2',
        document: 'Hello world',
        document_id: 'doc-123',
        metadata: '{"foo":"bar"}'
      },
    } satisfies Bundle;

    upsertRecordsMock.mockResolvedValue({ upsertedCount: 1 });

    const result = await appTester((App.creates.add_document!.operation.perform as any), bundle) as any;
    expect(upsertRecordsMock).toHaveBeenCalled();
    expect(result.id).toBe('doc-123');
  });

  it('should add a document and generate a document ID if not provided', async () => {
    const bundle = {
      ...baseBundle,
      inputData: {
        index_name: 'test-index',
        index_host: 'host',
        namespace: 'default',
        model: 'llama-text-embed-v2',
        document: 'Hello world',
        metadata: '{"foo":"bar"}'
      },
    } satisfies Bundle;

    upsertRecordsMock.mockResolvedValue({ upsertedCount: 1 });

    const result = await appTester((App.creates.add_document!.operation.perform as any), bundle) as any;
    expect(upsertRecordsMock).toHaveBeenCalled();
    expect(result.id).toBeDefined();
  });
}); 