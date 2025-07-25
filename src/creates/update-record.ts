import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { record_id, index_name, index_host, namespace, record, record_metadata } = bundle.inputData;
  if (!record && !record_metadata) {
    throw new Error('You must provide at least one of: new record text or new metadata.');
  }
  const pinecone = new Pinecone({ apiKey: bundle.authData.api_key, sourceTag: 'zapier' });
  for (const key in record_metadata as Record<string, any>) {
    const value = record_metadata[key];
    if (
      typeof value !== 'string' &&
      typeof value !== 'number' &&
      typeof value !== 'boolean' &&
      !(Array.isArray(value) && value.every(v => typeof v === 'string'))
    ) {
      throw new Error(`Invalid type for metadata field '${key}'. Must be a string, number, boolean, or list of strings.`);
    }
  }
  const updatePayload: any = { 
    id: String(record_id),
    metadata: record_metadata as Record<string, any>,
    sparseValues: {
      indices: [] as number[],
      values: [] as number[],
    },
    values: [] as number[], 
  };
  if (record) {
    let model_name = undefined;
    const index_info = await pinecone.describeIndex(index_name as string);
    if (!model_name) {
      if (!index_info) {
        throw new Error('Index not found.');
      }
      if (!index_info?.embed) {
        throw new Error('No embedding model found for index.');
      }
      model_name = index_info.embed.model;
    } else {
      model_name = model_name as string;
    }
    const docText = typeof record === 'string' ? record : String(record);
    const embedResponse = await pinecone.inference.embed(model_name as string, [docText], {
        input_type: 'passage',
        truncate: 'END',
    });
    const embedding = embedResponse.data[0];
    if (!embedding) {
        throw new Error('Failed to retrieve embedding data.');
    }
    if (index_info.vectorType === 'dense' && Array.isArray((embedding as any).values)) {
      updatePayload.values = (embedding as any).values;
    } else if (index_info.vectorType === 'sparse' && Array.isArray((embedding as any).sparseValues)) {
      updatePayload.sparseValues.indices = (embedding as any).sparseIndices;
      updatePayload.sparseValues.values = (embedding as any).sparseValues;
    } else {
      throw new Error('Embedding response did not contain values array. Embedding is.')
    }
    updatePayload.metadata.text = docText;
  }
  const ns = pinecone.index(index_name as string, index_host as string).namespace(namespace as string);
  await ns.update(updatePayload);
  return { id: String(record_id), message: 'Record updated successfully.' };
};

export default {
  key: 'update_record',
  noun: 'Record',
  display: {
    label: 'Update Record',
    description: 'Updates the text and/or metadata for a record in Pinecone.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'record_id', label: 'Record ID', type: 'string', required: true, helpText: 'The ID of the record to update. This is the ID returned by Add Record or the one you provided.' },
      { key: 'record', label: 'New Record Text', type: 'text', required: false, helpText: 'Optional. Provide new text to update the record. If provided, new embeddings will be generated.' },
      { key: 'record_metadata', label: 'New Metadata', required: false, helpText: 'Optional. Provide new metadata as a JSON object or string.', dict: true },
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'index_host', label: 'Index Host', type: 'string', required: false, helpText: 'The host URL of the Pinecone index.' },
      { key: 'namespace', label: 'Namespace', type: 'string', required: true, helpText: 'The namespace containing the record.' },
    ],
    outputFields: [
      { key: 'id', label: 'Vector ID', type: 'string' },
      { key: 'message', label: 'Message', type: 'string' },
    ],
    sample: {
      id: 'uuid',
      message: 'Record updated successfully.',
    }
  }
} satisfies Create;