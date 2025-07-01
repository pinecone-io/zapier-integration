import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name, index_host, namespace, update } = bundle.inputData;
  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
  });
  const ns = pinecone.index(index_name as string, index_host as string).namespace(namespace as string);
  const parsedUpdate = typeof update === 'string' ? JSON.parse(update) : update;
  await ns.update(parsedUpdate);
  return { success: true, id: parsedUpdate.id, name: parsedUpdate.id, status: 'updated' };
};

export default {
  key: 'update_vector',
  noun: 'Vector',
  display: {
    label: 'Update Vector',
    description: 'Updates a vector in a Pinecone index namespace.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'index_host', label: 'Index Host', type: 'string', required: true, helpText: 'The host URL of the Pinecone index.' },
      { key: 'namespace', label: 'Namespace', type: 'string', required: true, helpText: 'The namespace containing the vector.' },
      { key: 'update', label: 'Update Object', type: 'text', required: true, helpText: 'The update object as JSON (e.g., {"id": "id-3", "values": [4.0, 2.0], "metadata": {"genre": "comedy"}}).' }
    ],
    outputFields: [
      { key: 'success', label: 'Success', type: 'boolean' },
      { key: 'id', label: 'Vector ID', type: 'string' },
      { key: 'name', label: 'Vector Name', type: 'string' },
      { key: 'status', label: 'Status', type: 'string' }
    ],
    sample: {
      success: true,
      id: 'id-3',
      name: 'id-3',
      status: 'updated'
    }
  }
} satisfies Create; 