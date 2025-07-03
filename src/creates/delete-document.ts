import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { document_id, index_name, index_host, namespace } = bundle.inputData;
  const pinecone = new Pinecone({ apiKey: bundle.authData.api_key, sourceTag: 'zapier' });
  const ns = pinecone.index(index_name as string, index_host as string).namespace(namespace as string);
  await ns.deleteOne(String(document_id));
  return { id: String(document_id), status: 'deleted', index: index_name, namespace };
};

export default {
  key: 'delete_document',
  noun: 'Document',
  display: {
    label: 'Delete Document',
    description: 'Deletes a document (vector) from Pinecone by ID.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'document_id', label: 'Document ID', type: 'string', required: true, helpText: 'The ID of the document to delete. This is the ID returned by Add Document or the one you provided.' },
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'index_host', label: 'Index Host', type: 'string', required: true, helpText: 'The host URL of the Pinecone index.' },
      { key: 'namespace', label: 'Namespace', type: 'string', required: true, helpText: 'The namespace containing the document.' },
    ],
    outputFields: [
      { key: 'id', label: 'Vector ID', type: 'string' },
      { key: 'status', label: 'Status', type: 'string' },
      { key: 'index', label: 'Index', type: 'string' },
      { key: 'namespace', label: 'Namespace', type: 'string' },
    ],
    sample: {
      id: 'uuid',
      status: 'deleted',
      index: 'example-index',
      namespace: 'default',
    }
  }
} satisfies Create; 