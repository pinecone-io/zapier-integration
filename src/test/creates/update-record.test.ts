import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.update_record', () => {
  let updateRecordsMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    updateRecordsMock = vi.fn();
    const namespaceObj = { update: updateRecordsMock };
    const indexMock = vi.fn().mockReturnValue({ namespace: vi.fn().mockReturnValue(namespaceObj) });
    Pinecone.prototype.index = indexMock;

    // Ensure describeIndex is mocked
    vi.spyOn(Pinecone.prototype, 'describeIndex').mockResolvedValue({
      name: 'test-index',
      metric: 'cosine',
      host: 'test-index-host',
      spec: { serverless: { region: 'us-east-1', cloud: 'aws' } },
      embed: { model: 'pinecone-text-embed-v0' },
      status: { ready: true, state: 'Ready' },
      vectorType: 'dense',
    });
  });

  // Ensure inference is mocked using Object.defineProperty
  Object.defineProperty(Pinecone.prototype, 'inference', {
    get: () => ({
      embed: vi.fn().mockResolvedValue({
        data: [{ values: [0.1, 0.2, 0.3] }],
      }),
    }),
    set: (value: { embed: ReturnType<typeof vi.fn> }) => {
      // No-op
    },
  });

  it('should update a record with a provided record ID', async () => {
    const bundle = {
      inputData: {
        index_name: 'test-index',
        index_host: 'host',
        namespace: 'default',
        record: 'Hello world',
        record_id: 'doc-123',
        record_metadata: { foo: 'bar' }
      },
      authData: {
        api_key: 'test_api_key_123',
      },
      meta: {} as Bundle['meta'],
      inputDataRaw: {},
    } satisfies Bundle;

    updateRecordsMock.mockResolvedValue({ updatedCount: 1 });

    const result = await appTester((App.creates.update_record!.operation.perform as any), bundle) as any;
    expect(updateRecordsMock).toHaveBeenCalled();
    expect(result.id).toBe('doc-123');
  });
}); 