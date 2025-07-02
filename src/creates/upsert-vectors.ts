import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';
import yaml from 'js-yaml';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name, index_host, namespace, records } = bundle.inputData;
  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
  });
  let recordsToUpsert: any[] = [];
  if (typeof records === 'string') {
    // Split the string into record blocks by double newlines or similar
    const recordBlocks = records.split(/\n(?=id: )/g);
    for (const block of recordBlocks) {
      const idMatch = block.match(/id:\s*([\w-]+)/);
      const valuesMatch = block.match(/values:\s*\[([^\]]+)\]/);
      if (idMatch && valuesMatch) {
        const id = idMatch[1].trim();
        const valuesStr = valuesMatch[1].trim();
        const values = valuesStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
        recordsToUpsert.push({ id, values });
      }
    }
    if (recordsToUpsert.length === 0) {
      throw new Error('The "records" field could not be parsed. Expected format: id: ...\\nvalues: [...]');
    }
  } else if (Array.isArray(records)) {
    recordsToUpsert = records;
  } else if (typeof records === 'object' && records !== null) {
    recordsToUpsert = Object.values(records);
  } else {
    throw new Error('The "records" field must be a JSON array.');
  }

  // Helper to generate a UUID v4
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Ensure each record has an 'id'. If not, assign a UUID.
  recordsToUpsert = recordsToUpsert.map((rec: any) => ({
    ...rec,
    id: rec.id || uuidv4(),
  }));

  const ns = pinecone.index(index_name as string, index_host as string).namespace(namespace as string);
  await ns.upsert(recordsToUpsert);
  return { upsertedCount: recordsToUpsert.length, name: index_name, status: 'upserted' };
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