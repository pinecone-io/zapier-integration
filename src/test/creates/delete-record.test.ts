import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('creates.delete_record', () => {
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

  it('should delete a record by record ID', async () => {
    const bundle = {
      ...baseBundle,
      inputData: {
        index_name: 'test-index',
        index_host: 'host',
        namespace: 'default',
        record_id: 'doc-123',
      },
    } satisfies Bundle;

    const deleteOneMock = vi.fn().mockResolvedValue({ deletedCount: 1 });
    const namespaceMock = vi.fn().mockReturnValue({ deleteOne: deleteOneMock });
    vi.spyOn(Pinecone.prototype, 'index').mockReturnValue({ namespace: namespaceMock } as any);

    const result = await appTester((App.creates.delete_record!.operation.perform as any), bundle) as any;
    expect(deleteOneMock).toHaveBeenCalled();
    expect(result.id).toBe('doc-123');
  });

  it('should handle errors from Pinecone SDK', async () => {
    const bundle = {
      ...baseBundle,
      inputData: {
        index_name: 'test-index',
        index_host: 'host',
        namespace: 'default',
        record_id: 'doc-123',
      },
    } satisfies Bundle;

    const deleteOneMock = vi.fn().mockRejectedValue(new Error('Delete failed'));
    const namespaceMock = vi.fn().mockReturnValue({ deleteOne: deleteOneMock });
    vi.spyOn(Pinecone.prototype, 'index').mockReturnValue({ namespace: namespaceMock } as any);

    await expect(appTester((App.creates.delete_record!.operation.perform as any), bundle)).rejects.toThrow('Delete failed');
  });
}); 