import { type Bundle, type Search, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name, index_host, namespace, prefix, limit, paginationToken } = bundle.inputData;
  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
  });
  const ns = pinecone.index(index_name as string, index_host as string).namespace(namespace as string);
  const options: Record<string, any> = {};
  if (prefix) options.prefix = prefix;
  if (limit) options.limit = Number(limit);
  if (paginationToken) options.paginationToken = paginationToken;
  const response = await ns.listPaginated(options);
  return [response];
};

export default {
  key: 'list_vectors',
  noun: 'Vector',
  display: {
    label: 'List Vectors',
    description: 'Lists vectors in a Pinecone index namespace, with optional prefix and pagination.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'index_host', label: 'Index Host', type: 'string', required: true, helpText: 'The host URL of the Pinecone index.' },
      { key: 'namespace', label: 'Namespace', type: 'string', required: true, helpText: 'The namespace to list vectors from.' },
      { key: 'prefix', label: 'Prefix', type: 'string', required: false, helpText: 'Prefix to filter vector IDs.' },
      { key: 'limit', label: 'Limit', type: 'integer', required: false, helpText: 'Maximum number of vectors to return.' },
      { key: 'paginationToken', label: 'Pagination Token', type: 'string', required: false, helpText: 'Token for fetching the next page of results.' }
    ],
    outputFields: [
      { key: 'vectors', label: 'Vectors', dict: true },
      { key: 'pagination', label: 'Pagination', dict: true },
      { key: 'namespace', label: 'Namespace', type: 'string' },
      { key: 'usage', label: 'Usage', dict: true }
    ],
    sample: {
      vectors: [
        { id: 'doc1#chunk1' },
        { id: 'doc1#chunk2' },
        { id: 'doc1#chunk3' }
      ],
      pagination: {
        next: 'eyJza2lwX3Bhc3QiOiJwcmVUZXN0LS04MCIsInByZWZpeCI6InByZVRlc3QifQ=='
      },
      namespace: 'example-namespace',
      usage: { readUnits: 1 }
    }
  }
} satisfies Search; 