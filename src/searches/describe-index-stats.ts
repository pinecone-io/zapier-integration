import { type Bundle, type ZObject, type Trigger } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name, index_host } = bundle.inputData;
  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
  });
  const index = pinecone.index(index_name as string, index_host as string);
  const response = await index.describeIndexStats();
  // Return as an array for Zapier triggers
  return [response];
};

export default {
  key: 'describe_index_stats',
  noun: 'Index Stats',
  display: {
    label: 'Describe Index Stats',
    description: 'Retrieves statistics for a Pinecone index.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'index_host', label: 'Index Host', type: 'string', required: true, helpText: 'The host URL of the Pinecone index.' }
    ],
    outputFields: [
      { key: 'namespaces', label: 'Namespaces', dict: true },
      { key: 'dimension', label: 'Dimension', type: 'integer' },
      { key: 'indexFullness', label: 'Index Fullness', type: 'number' },
      { key: 'totalRecordCount', label: 'Total Record Count', type: 'integer' }
    ],
    sample: {
      namespaces: {
        'example-namespace1': { recordCount: 4 },
        'example-namespace2': { recordCount: 4 }
      },
      dimension: 1024,
      indexFullness: 0.00008,
      totalRecordCount: 8
    }
  }
} satisfies Trigger; 