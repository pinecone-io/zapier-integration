import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name, index_host, namespace } = bundle.inputData;
  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
  });
  const index = pinecone.index(index_name as string, index_host as string);
  await index.deleteNamespace(namespace as string);
  return { success: true, namespace, name: namespace, status: 'deleted' };
};

export default {
  key: 'delete_namespace',
  noun: 'Namespace',
  display: {
    label: 'Delete Namespace',
    description: 'Deletes a Pinecone namespace.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'delete_warning', type: 'copy', label: 'Warning', helpText: 'This action will permanently delete the namespace. This cannot be undone.' },
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'index_host', label: 'Index Host', type: 'string', required: true, helpText: 'The host URL of the Pinecone index.' },
      { key: 'namespace', label: 'Namespace', type: 'string', required: true, helpText: 'The name of the namespace to delete.' }
    ],
    outputFields: [
      { key: 'success', label: 'Success', type: 'boolean' },
      { key: 'namespace', label: 'Namespace', type: 'string' }
    ],
    sample: {
      success: true,
      namespace: 'example-namespace'
    }
  }
} satisfies Create; 