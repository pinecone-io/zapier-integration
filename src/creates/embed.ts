import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { model, texts, inputType, truncate } = bundle.inputData;
  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
  });
  const parsedTexts = typeof texts === 'string' ? JSON.parse(texts) : texts;
  const options: Record<string, any> = {};
  if (inputType) options.inputType = inputType;
  if (truncate) options.truncate = truncate;
  const response = await pinecone.inference.embed(model as string, parsedTexts, options);
  return { ...response, name: model, status: 'completed' };
};

export default {
  key: 'embed',
  noun: 'Embedding',
  display: {
    label: 'Generate Embeddings',
    description: 'Generates vector embeddings for text using a Pinecone model.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'model', label: 'Model', type: 'string', required: true, helpText: 'The embedding model to use (e.g., llama-text-embed-v2).' },
      { key: 'texts', label: 'Texts', type: 'text', required: true, helpText: 'An array of texts as JSON (e.g., ["text1", "text2"]).' },
      { key: 'inputType', label: 'Input Type', type: 'string', required: false, helpText: 'Input type for the model (e.g., passage).' },
      { key: 'truncate', label: 'Truncate', type: 'string', required: false, helpText: 'Truncation strategy (e.g., END).' }
    ],
    outputFields: [
      { key: 'model', label: 'Model', type: 'string' },
      { key: 'data', label: 'Embeddings', dict: true },
      { key: 'usage', label: 'Usage', dict: true }
    ],
    sample: {
      model: 'llama-text-embed-v2',
      data: [
        { values: [0.04925537109375, -0.01313018798828125, -0.0112762451171875] }
      ],
      usage: { totalTokens: 130 }
    }
  }
} satisfies Create; 