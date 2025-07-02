import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name, index_host, namespace, update } = bundle.inputData;
  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
  });
  const ns = pinecone.index(index_name as string, index_host as string).namespace(namespace as string);
  let updateObj: any = update;
  if (typeof update === 'string') {
    // Try to fix unquoted keys (e.g., {id: ...}) to {"id": ...}
    let fixed = update.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
    try {
      updateObj = JSON.parse(fixed);
    } catch {
      // Try YAML-like parsing for id and metadata
      const idMatch = update.match(/id:\s*([\w-]+)/);
      const metadataMatch = update.match(/metadata:\s*({[^}]+})/);
      if (idMatch) {
        updateObj = { id: idMatch[1] };
        if (metadataMatch) {
          try {
            updateObj.metadata = JSON.parse(metadataMatch[1].replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":'));
          } catch {}
        }
      } else {
        throw new Error('The "update" field could not be parsed. Expected JSON object with quoted keys or YAML-like id/metadata.');
      }
    }
  }
  if (!updateObj || typeof updateObj !== 'object' || !updateObj.id) {
    throw new Error('The "update" field must be an object with an "id" property.');
  }
  await ns.update(updateObj);
  return { success: true, id: updateObj.id, name: updateObj.id, status: 'updated' };
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