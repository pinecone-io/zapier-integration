import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { document_id, index_name, index_host, namespace, document, metadata, model } = bundle.inputData;
  if (!document && !metadata) {
    throw new Error('You must provide at least one of: new document text or new metadata.');
  }
  const pinecone = new Pinecone({ apiKey: bundle.authData.api_key, sourceTag: 'zapier' });
  let meta = undefined;
  if (metadata && typeof metadata === 'string') {
    try {
      meta = JSON.parse(metadata);
    } catch {
      meta = { value: metadata };
    }
  } else if (metadata && typeof metadata === 'object') {
    meta = metadata;
  }
  let model_name = bundle.inputData.model;
  if (!model_name) {
    const index_info = await pinecone.describeIndex(index_name as string)
    if (!index_info?.embed) {
      throw new Error('No embedding model found for index.');
    }
    model_name = index_info.embed.model;
  } else {
    model_name = model_name as string;
  }
  let values: number[] | undefined = undefined;
  if (document) {
    const docText = typeof document === 'string' ? document : String(document);
    if (!model) {
      throw new Error('Embedding model is required when updating the document text.');
    }
    const embedResponse = await pinecone.inference.embed(model as string, [docText], {});
    const embedding = embedResponse.data[0];
    if (embedding && Array.isArray((embedding as any).values)) {
      values = (embedding as any).values;
    } else if (embedding && (embedding as any).indices && (embedding as any).values) {
      values = (embedding as any).values;
    } else {
      throw new Error('Embedding response did not contain values array.');
    }
  }
  const ns = pinecone.index(index_name as string, index_host as string).namespace(namespace as string);
  const updatePayload: any = { id: String(document_id) };
  if (typeof values !== 'undefined') updatePayload.values = values;
  if (typeof meta !== 'undefined') updatePayload.metadata = meta;
  await ns.update(updatePayload);
  return { id: String(document_id), status: 'updated', index: index_name, namespace };
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
      { key: 'model', label: 'Embedding Model', type: 'string', required: false, helpText: 'Required if updating the document text. Only required if the index was created with a different model than the default. If not provided, the model used for the index will be used.' },
      { key: 'metadata', label: 'New Metadata', type: 'text', required: false, helpText: 'Optional. Provide new metadata as a JSON object or string.' },
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
      status: 'updated',
      index: 'example-index',
      namespace: 'default',
    }
  }
} satisfies Create; 