import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name, index_host, namespace, ids } = bundle.inputData;
  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
  });
  const ns = pinecone.index(index_name as string, index_host as string).namespace(namespace as string);
  let deleted;
  let idsToDelete;
  if (typeof ids === 'string') {
    try {
      const parsed = JSON.parse(ids);
      if (Array.isArray(parsed)) {
        await ns.deleteMany(parsed);
        deleted = true;
        idsToDelete = parsed;
      } else {
        if (typeof parsed === 'string') {
          await ns.deleteOne(parsed);
          deleted = true;
          idsToDelete = [parsed];
        }
      }
    } catch {
      // Not JSON, treat as single id string
      if (typeof ids === 'string') {
        await ns.deleteOne(ids);
        deleted = true;
        idsToDelete = [ids];
      }
    }
  } else if (Array.isArray(ids)) {
    await ns.deleteMany(ids);
    deleted = true;
    idsToDelete = ids;
  } else if (typeof ids === 'string') {
    await ns.deleteOne(ids);
    deleted = true;
    idsToDelete = [ids];
  }
  return { success: deleted, ids: idsToDelete, name: index_name, status: 'deleted' };
};

export default {
  key: 'delete_vectors',
  noun: 'Vector',
  display: {
    label: 'Delete Vectors',
    description: 'Deletes one or more vectors from a Pinecone index namespace.'
  },
  operation: {
    perform,
    inputFields: [
      {
        key: 'delete_warning',
        type: 'copy',
        label: 'Warning',
        helpText: 'This action will permanently delete the selected vectors. This cannot be undone.'
      },
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'index_host', label: 'Index Host', type: 'string', required: true, helpText: 'The host URL of the Pinecone index.' },
      { key: 'namespace', label: 'Namespace', type: 'string', required: true, helpText: 'The namespace containing the vectors.' },
      { key: 'ids', label: 'IDs', type: 'text', required: true, helpText: 'A single vector ID or a JSON array of IDs to delete (e.g., "id-1" or ["id-2", "id-3"]).' }
    ],
    outputFields: [
      { key: 'success', label: 'Success', type: 'boolean' },
      { key: 'ids', label: 'Deleted IDs', type: 'string' }
    ],
    sample: {
      success: true,
      ids: ['id-1', 'id-2']
    }
  }
} satisfies Create; 