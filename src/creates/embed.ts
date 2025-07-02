import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { model, inputType, truncate } = bundle.inputData;
  const pinecone = new Pinecone({ apiKey: bundle.authData.api_key });
  let texts = bundle.inputData.texts;
  if (typeof texts === 'string') {
    try {
      texts = JSON.parse(texts);
    } catch {
      texts = [texts];
    }
  }
  // Ensure texts is always a string array
  if (!Array.isArray(texts)) {
    texts = [String(texts)];
  }
  const options: Record<string, any> = {};
  if (inputType) options.inputType = inputType;
  if (truncate) options.truncate = truncate;
  const response = await pinecone.inference.embed(model as string, texts as string[], options);

  // Helper to generate a UUID v4
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Output records in the format upsert expects
  const records = response.data.map((embedding: any) => ({
    id: uuidv4(),
    values: embedding.values,
    // Optionally add metadata here
    // metadata: { ... }
  }));

  return {
    model,
    records,
    usage: response.usage,
  };
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
      { key: 'model', label: 'Model', type: 'string', required: true, helpText: 'The embedding model to use (e.g., llama-text-embed-v2).', 
        choices: [
          'llama-text-embed-v2',
          'multilingual-e5-large', 
          'pinecone-sparse-english-v0', 
          'bge-reranker-v2-m3',
          'cohere-rerank-3.5',
          'pinecone-rerank-v0'
        ] },
      { key: 'texts', label: 'Texts', type: 'text', required: true, helpText: 'An array of texts as JSON (e.g., ["text1", "text2"]).' },
      { key: 'inputType', label: 'Input Type', type: 'string', required: false, helpText: 'Input type for the model (e.g., passage).',
        choices: [
          'passage',
          'query',
          'title',
          'title_and_passage',
          'title_and_query',
        ]
       },
      { key: 'truncate', label: 'Truncate', type: 'string', required: false, helpText: 'Truncation strategy (e.g., END).',
        choices: [
          'END',
          'START',
          'NONE',
        ]
      }
    ],
    outputFields: [
      { key: 'model', label: 'Model', type: 'string' },
      { key: 'records', label: 'Records', list: true },
      { key: 'usage', label: 'Usage', dict: true }
    ],
    sample: {
      model: 'llama-text-embed-v2',
      records: [
        { id: 'uuid', values: [0.04925537109375, -0.01313018798828125, -0.0112762451171875] }
      ],
      usage: { totalTokens: 130 }
    }
  }
} satisfies Create; 