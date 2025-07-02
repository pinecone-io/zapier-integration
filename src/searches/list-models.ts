import { type Bundle, type Search, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const pinecone = new Pinecone({ apiKey: bundle.authData.api_key });
  const response = await pinecone.inference.listModels();
  const { model } = bundle.inputData;
  let models = response.models;
  if (model) {
    models = models.filter((m: any) => m.model && m.model.includes(model));
  }
  return models;
};

export default {
  key: 'list_models',
  noun: 'Model',
  display: {
    label: 'List Models',
    description: 'Lists available embedding and reranking models from Pinecone.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'model', label: 'Model Name', type: 'string', required: false, helpText: 'Search for a model by name.' }
    ],
    outputFields: [
      { key: 'model', label: 'Model', type: 'string', primary: true },
      { key: 'shortDescription', label: 'Short Description', type: 'string' },
      { key: 'type', label: 'Type', type: 'string' },
      { key: 'vectorType', label: 'Vector Type', type: 'string' },
      { key: 'defaultDimension', label: 'Default Dimension', type: 'integer' },
      { key: 'modality', label: 'Modality', type: 'string' },
      { key: 'maxSequenceLength', label: 'Max Sequence Length', type: 'integer' },
      { key: 'maxBatchSize', label: 'Max Batch Size', type: 'integer' },
      { key: 'providerName', label: 'Provider Name', type: 'string' },
      { key: 'supportedDimensions', label: 'Supported Dimensions', list: true },
      { key: 'supportedMetrics', label: 'Supported Metrics', list: true },
      { key: 'supportedParameters', label: 'Supported Parameters', list: true }
    ],
    sample: {
      model: 'llama-text-embed-v2',
      shortDescription: 'A high performance dense embedding model optimized for multilingual and cross-lingual text question-answering retrieval with support for long documents (up to 2048 tokens) and dynamic embedding size (Matryoshka Embeddings).',
      type: 'embed',
      vectorType: 'dense',
      defaultDimension: 1024,
      modality: 'text',
      maxSequenceLength: 2048,
      maxBatchSize: 96,
      providerName: 'NVIDIA',
      supportedDimensions: [1024, 768, 384],
      supportedMetrics: ['cosine', 'dotproduct'],
      supportedParameters: ['inputType', 'truncate']
    }
  }
} satisfies Search; 