import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { chunk_text, document_metadata, index_name, index_host, namespace } = bundle.inputData;
  const pinecone = new Pinecone({ apiKey: bundle.authData.api_key, sourceTag: 'zapier' });
  // Generate a UUID for the vector
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  const id = bundle.inputData.document_id ? String(bundle.inputData.document_id) : uuidv4();
  // Access document_metadata as a dictionary
  const metadata = bundle.inputData.document_metadata as Record<string, any>;
  // Validate metadata values
  for (const key in metadata) {
    const value = metadata[key];
    if (
      typeof value !== 'string' &&
      typeof value !== 'number' &&
      typeof value !== 'boolean' &&
      !(Array.isArray(value) && value.every(v => typeof v === 'string'))
    ) {
      throw new Error(`Invalid type for metadata field '${key}'. Must be a string, number, boolean, or list of strings.`);
    }
  }

  // Upsert the vector with spread metadata
  const ns = pinecone.index(index_name as string, index_host as string).namespace(namespace as string);
  await ns.upsertRecords([{ id, chunk_text: String(bundle.inputData.chunk_text).trim(), ...metadata }]);
  return { id, status: 'upserted', index: index_name, namespace };
};

export default {
  key: 'add_document',
  noun: 'Document',
  display: {
    label: 'Add Document',
    description: 'Embeds a document and upserts it to Pinecone in one step.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'chunk_text', label: 'Document Text', type: 'text', required: true, helpText: 'The text of the document to add.' },
      { key: 'document_id', label: 'Document ID', type: 'string', required: false, helpText: 'Optional. Provide a unique ID to reference this document for future updates or deletions. If not provided, a UUID will be generated. You will need this ID to update or delete the document later.' },
      { key: 'document_metadata', label: 'Metadata', required: false, helpText: 'Optional metadata as key-value pairs.', "dict": true },
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'index_host', label: 'Index Host', type: 'string', required: false, helpText: 'The host URL of the Pinecone index. Adding this will speed up the operation.' },
      { key: 'namespace', label: 'Namespace', type: 'string', required: true, helpText: 'The namespace to upsert the document into.' },
    ],
    outputFields: [
      { key: 'id', label: 'Vector ID', type: 'string' },
      { key: 'status', label: 'Status', type: 'string' },
      { key: 'index', label: 'Index', type: 'string' },
      { key: 'namespace', label: 'Namespace', type: 'string' },
    ],
    sample: {
      id: 'uuid',
      status: 'upserted',
      index: 'example-index',
      namespace: 'default',
    }
  }
} satisfies Create; 