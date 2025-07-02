import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name, index_host, namespace } = bundle.inputData;
  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
  });
  await pinecone.index(index_name as string, index_host as string).namespace(namespace as string).deleteAll();
  return { message: 'Delete successful' };
};

export default {
  key: 'delete_namespace',
  noun: 'Namespace',
  display: {
    label: 'Delete Namespace',
    description: 'Deletes all vectors in a Pinecone namespace.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'index_host', label: 'Index Host', type: 'string', required: true, helpText: 'The host URL of the Pinecone index.' },
      { key: 'namespace', label: 'Namespace', type: 'string', required: true, helpText: 'The namespace to delete.' }
    ],
    outputFields: [
      { key: 'message', label: 'Message', type: 'string' }
    ],
    sample: {
      message: 'Delete successful'
    }
  }
} satisfies Create; 