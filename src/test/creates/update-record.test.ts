import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
vi.mock('@pinecone-database/pinecone');
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone, __setPineconeMockState } from '@pinecone-database/pinecone'; 
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.update_record', () => {
  let updateRecordsMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    updateRecordsMock = vi.fn();
    const indexMock = vi.fn().mockReturnValue({ namespace: vi.fn().mockReturnValue({ update: updateRecordsMock }) });
    Pinecone.prototype.index = indexMock;

    const describeIndexResponse = {
      name: 'test-index',
      metric: 'cosine',
      host: 'test-index-host',
      spec: { serverless: { region: 'us-east-1', cloud: 'aws' } },
      embed: { model: 'pinecone-text-embed-v0' },
      status: { ready: true, state: 'Ready' },
      vectorType: 'dense',
    };
    __setPineconeMockState({ describeIndex: vi.fn().mockResolvedValue(describeIndexResponse) });

    __setPineconeMockState({ inference: {
      embed: vi.fn().mockResolvedValue({
        data: [{ values: [0.1, 0.2, 0.3] }], // Mocked embedding values
      }),
    }});
  });

  const baseBundle = {
    inputData: {
      index_name: 'test-index',
      index_host: 'host',
      namespace: 'default',
      record_id: 'doc-123',
    },
    authData: {
      api_key: 'test_api_key_123',
    },
    meta: {} as Bundle['meta'],
    inputDataRaw: {},
  } satisfies Bundle;

  it('should update a record with new record text only', async () => {
    const recordBundle = {
      ...baseBundle,
      inputData: {
        ...baseBundle.inputData,
        record: 'Updated text',
      },
    };

    const result = await appTester((App.creates.update_record!.operation.perform as any), recordBundle) as any;
    expect(result.id).toBe('doc-123');
  });

  it('should update a record with new metadata only', async () => {
    const metadataBundle = {
      ...baseBundle,
      inputData: {
        ...baseBundle.inputData,
        record_metadata: { foo: 'baz' },
      },
    };

    const result = await appTester((App.creates.update_record!.operation.perform as any), metadataBundle) as any;
    expect(result.id).toBe('doc-123');
  });

  it('should throw if neither text nor metadata is provided', async () => {
    const emptyBundle = {
      ...baseBundle,
    };

    await expect(appTester((App.creates.update_record!.operation.perform as any), emptyBundle)).rejects.toThrow();
  });
}); 