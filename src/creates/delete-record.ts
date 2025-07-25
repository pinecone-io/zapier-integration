import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { record_id, index_name, index_host, namespace } = bundle.inputData;
  const pinecone = new Pinecone({ apiKey: bundle.authData.api_key, sourceTag: 'zapier' });
  const ns = pinecone.index(index_name as string, index_host as string).namespace(namespace as string);
  await ns.deleteOne(String(record_id));
  return { id: String(record_id), status: 'deleted', index: index_name, namespace };
};

export default {
  key: 'delete_record',
  noun: 'Record',
  display: {
    label: 'Delete Record',
    description: 'Deletes a record (vector) from Pinecone by ID.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'record_id', label: 'Record ID', type: 'string', required: true, helpText: 'The ID of the record to delete. This is the ID returned by Add Record or the one you provided.' },
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'index_host', label: 'Index Host', type: 'string', required: true, helpText: 'The host URL of the Pinecone index.' },
      { key: 'namespace', label: 'Namespace', type: 'string', required: true, helpText: 'The namespace containing the record.' },
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