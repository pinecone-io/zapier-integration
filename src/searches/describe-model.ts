import { type Bundle, type Search, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { model } = bundle.inputData;
  const pinecone = new Pinecone();
  const response = await pinecone.inference.getModel(model as string);
  return [response];
};

export default {
  key: 'describe_model',
  noun: 'Model',
  display: {
    label: 'Describe Model',
    description: 'Describes a Pinecone embedding or reranking model.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'model', label: 'Model', type: 'string', required: true, helpText: 'The model name to describe (e.g., llama-text-embed-v2).' }
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
      { key: 'supportedDimensions', label: 'Supported Dimensions', dict: true },
      { key: 'supportedMetrics', label: 'Supported Metrics', dict: true },
      { key: 'supportedParameters', label: 'Supported Parameters', dict: true }
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
      supportedDimensions: [384, 512, 768, 1024, 2048],
      supportedMetrics: ['Cosine', 'DotProduct'],
      supportedParameters: [
        {
          parameter: 'input_type',
          type: 'one_of',
          valueType: 'string',
          required: true,
          allowedValues: ['passage', 'query'],
          min: undefined,
          max: undefined,
          _default: undefined
        },
        {
          parameter: 'truncate',
          type: 'one_of',
          valueType: 'string',
          required: false,
          allowedValues: ['END', 'START'],
          min: undefined,
          max: undefined,
          _default: 'END'
        },
        {
          parameter: 'dimension',
          type: 'one_of',
          valueType: 'integer',
          required: false,
          allowedValues: [384, 512, 768, 1024, 2048],
          min: undefined,
          max: undefined,
          _default: 1024
        }
      ]
    }
  }
} satisfies Search; 