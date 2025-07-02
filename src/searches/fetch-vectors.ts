import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name, index_host, namespace, ids } = bundle.inputData;
  const pinecone = new Pinecone({ apiKey: bundle.authData.api_key });
  const ns = pinecone.index(index_name as string, index_host as string).namespace(namespace as string);
  const parsedIds = typeof ids === 'string' ? JSON.parse(ids) : ids;
  const response = await ns.fetch(parsedIds);
  return [{
    namespace,
    records: response.records,
    usage: response.usage,
  }];
};

export default {
  key: 'fetch_vectors',
  noun: 'Vector',
  display: {
    label: 'Fetch Vectors',
    description: 'Fetches vectors from a Pinecone index namespace by ID.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'index_host', label: 'Index Host', type: 'string', required: true, helpText: 'The host URL of the Pinecone index.' },
      { key: 'namespace', label: 'Namespace', type: 'string', required: true, helpText: 'The namespace to fetch vectors from.' },
      { key: 'ids', label: 'IDs', type: 'text', required: true, helpText: 'An array of vector IDs as JSON (e.g., ["id-1", "id-2"]).' }
    ],
    outputFields: [
      { key: 'namespace', label: 'Namespace', type: 'string' },
      { key: 'usage', label: 'Usage', dict: true },
      { key: 'records', label: 'Records', dict: true }
    ],
    sample: {
      namespace: 'example-namespace',
      usage: { readUnits: 1 },
      records: {
        'id-1': { id: 'id-1', values: [0.568879, 0.632687092, 0.856837332] },
        'id-2': { id: 'id-2', values: [0.00891787093, 0.581895, 0.315718859] }
      }
    }
  }
} satisfies Create; 