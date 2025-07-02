import { type Bundle, type ZObject, type Trigger } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name, index_host, namespace } = bundle.inputData;
  const pinecone = new Pinecone({ apiKey: bundle.authData.api_key });
  const index = pinecone.index(index_name as string, index_host as string);
  const response = await index.describeNamespace(namespace as string);
  // Return as an array for Zapier triggers
  return [response];
};

export default {
  key: 'describe_namespace',
  noun: 'Namespace',
  display: {
    label: 'Describe Namespace',
    description: 'Describes a Pinecone namespace.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'index_host', label: 'Index Host', type: 'string', required: true, helpText: 'The host URL of the Pinecone index.' },
      { key: 'namespace', label: 'Namespace', type: 'string', required: true, helpText: 'The name of the namespace to describe.' }
    ],
    outputFields: [
      { key: 'name', label: 'Namespace Name', type: 'string', primary: true },
      { key: 'recordCount', label: 'Record Count', type: 'string' }
    ],
    sample: {
      name: 'example-namespace',
      recordCount: '20000'
    }
  }
} satisfies Trigger; 