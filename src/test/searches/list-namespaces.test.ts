import { describe, expect, it, beforeEach, vi } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import App from '../../index';

const appTester = zapier.createAppTester(App);

describe('searches.list_namespaces', () => {
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
    it('should list namespaces for an index', async () => {
      const bundle = {
        ...baseBundle,
        inputData: {
          index_name: 'test-index',
          index_host: 'test-host',
        },
      } satisfies Bundle;

      const namespacesResponse = ['ns1', 'ns2', 'ns3'];
      const listNamespacesMock = vi.fn().mockResolvedValue({ namespaces: namespacesResponse });
      const indexMock = vi.fn().mockReturnValue({ listNamespaces: listNamespacesMock });
      vi.spyOn(Pinecone.prototype, 'index').mockImplementation(indexMock as any);

      const result = await appTester((App.searches.list_namespaces!.operation.perform as any), bundle);

      expect(indexMock).toHaveBeenCalledWith('test-index', 'test-host');
      expect(listNamespacesMock).toHaveBeenCalledWith();
      expect(result).toEqual(namespacesResponse);
    });
  });
}); 