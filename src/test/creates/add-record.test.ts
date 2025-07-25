import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.add_record', () => {
  let upsertRecordsMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    upsertRecordsMock = vi.fn();
    const namespaceObj = { upsertRecords: upsertRecordsMock };
    const indexMock = vi.fn().mockReturnValue({ namespace: vi.fn().mockReturnValue(namespaceObj) });
    Pinecone.prototype.index = indexMock;
  });

  it('should add a record with a provided record ID', async () => {
    const bundle = {
      inputData: {
        index_name: 'test-index',
        index_host: 'host',
        namespace: 'default',
        chunk_text: 'Hello world',
        document_id: 'doc-123',
        document_metadata: { foo: 'bar' }
      },
      authData: {
        api_key: 'test_api_key_123',
      },
      meta: {} as Bundle['meta'],
      inputDataRaw: {},
    } satisfies Bundle;

    upsertRecordsMock.mockResolvedValue({ upsertedCount: 1 });

    const result = await appTester((App.creates.add_record!.operation.perform as any), bundle) as any;
    expect(upsertRecordsMock).toHaveBeenCalled();
    expect(result.id).toBe('doc-123');
  });

  it('should add a record and generate a record ID if not provided', async () => {
    const bundle = {
      inputData: {
        index_name: 'test-index',
        index_host: 'host',
        namespace: 'default',
        chunk_text: 'Hello world',
        document_metadata: { foo: 'bar' }
      },
      authData: {
        api_key: 'test_api_key_123',
      },
      meta: {} as Bundle['meta'],
      inputDataRaw: {},
    } satisfies Bundle;

    upsertRecordsMock.mockResolvedValue({ upsertedCount: 1 });

    const result = await appTester((App.creates.add_record!.operation.perform as any), bundle) as any;
    expect(upsertRecordsMock).toHaveBeenCalled();
    expect(result.id).toBeDefined();
  });
}); 