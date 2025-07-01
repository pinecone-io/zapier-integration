import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('triggers.describe_namespace', () => {
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
    it('should describe a namespace', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          index_host: 'test-host',
          namespace: 'test-ns',
        },
      } satisfies Bundle;

      const describeNamespaceResponse = {
        name: 'test-ns',
        vectorCount: 42,
        dimension: 1536,
        status: { ready: true, state: 'Ready' },
      };
      const describeNamespaceMock = vi.fn().mockResolvedValue(describeNamespaceResponse);
      const indexMock = vi.fn().mockReturnValue({ describeNamespace: describeNamespaceMock });
      vi.spyOn(Pinecone.prototype, 'index').mockImplementation(indexMock as any);

      const result = await appTester((App.triggers.describe_namespace!.operation.perform as any), bundle);

      expect(indexMock).toHaveBeenCalledWith('test-index', 'test-host');
      expect(describeNamespaceMock).toHaveBeenCalledWith('test-ns');
      expect(result).toEqual([describeNamespaceResponse]);
    });
  });
}); 