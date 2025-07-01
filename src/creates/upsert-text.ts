import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name, index_host, namespace, records } = bundle.inputData;
  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
  });
  const ns = pinecone.index(index_name as string, index_host as string).namespace(namespace as string);
  const parsedRecords = typeof records === 'string' ? JSON.parse(records) : records;
  await ns.upsertRecords(parsedRecords);
  return { success: true, count: parsedRecords.length, name: index_name, status: 'upserted' };
};

export default {
  key: 'upsert_text',
  noun: 'Text Record',
  display: {
    label: 'Upsert Text Records',
    description: 'Upserts text records into an integrated Pinecone index namespace.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'index_host', label: 'Index Host', type: 'string', required: true, helpText: 'The host URL of the Pinecone index.' },
      { key: 'namespace', label: 'Namespace', type: 'string', required: true, helpText: 'The namespace to upsert records into.' },
      { key: 'records', label: 'Records', type: 'text', required: true, helpText: 'An array of text records as JSON (e.g., [{"_id": "rec1", "chunk_text": "...", "category": "..."}]).' }
    ],
    outputFields: [
      { key: 'success', label: 'Success', type: 'boolean' },
      { key: 'count', label: 'Record Count', type: 'integer' }
    ],
    sample: {
      success: true,
      count: 4
    }
  }
} satisfies Create; 