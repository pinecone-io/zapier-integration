import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name, index_host, namespace, records } = bundle.inputData;
  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
  });
  const ns = pinecone.index(index_name as string, index_host as string).namespace(namespace as string);
  const parsedRecords = typeof records === 'string' ? JSON.parse(records) : records;
  await ns.upsert(parsedRecords);
  return { upsertedCount: parsedRecords.length, name: index_name, status: 'upserted' };
};

export default {
  key: 'upsert_vectors',
  noun: 'Vector',
  display: {
    label: 'Upsert Vectors',
    description: 'Upserts vectors into a Pinecone index namespace.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'index_host', label: 'Index Host', type: 'string', required: true, helpText: 'The host URL of the Pinecone index.' },
      { key: 'namespace', label: 'Namespace', type: 'string', required: true, helpText: 'The namespace to upsert vectors into.' },
      { key: 'records', label: 'Records', type: 'text', required: true, helpText: 'An array of vector records as JSON (e.g., [{"id": "vec1", "values": [0.1, ...], "metadata": {"genre": "comedy"}}]).' }
    ],
    outputFields: [
      { key: 'upsertedCount', label: 'Upserted Count', type: 'integer' }
    ],
    sample: {
      upsertedCount: 2
    }
  }
} satisfies Create; 