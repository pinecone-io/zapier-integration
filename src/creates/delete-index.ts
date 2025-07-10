import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name } = bundle.inputData;
  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
    sourceTag: 'zapier',
  });
  await pinecone.deleteIndex(index_name as string);
  return { message: 'Delete successful' };
};

export default {
  key: 'delete_index',
  noun: 'Index',
  display: {
    label: 'Delete Index',
    description: 'Deletes a Pinecone index.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'delete_warning', type: 'copy', label: 'Warning', helpText: 'This action will permanently delete the index. This cannot be undone.' },
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index to delete.' }
    ],
    outputFields: [
      { key: 'message', label: 'Message', type: 'string' }
    ],
    sample: {
      message: 'Delete successful'
    }
  }
} satisfies Create; 