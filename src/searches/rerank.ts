import { type Bundle, type Search, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { model, query, records, topN, returnrecords, parameters } = bundle.inputData;
  const pinecone = new Pinecone({ apiKey: bundle.authData.api_key, sourceTag: 'zapier' });
  const parsedrecords = typeof records === 'string' ? JSON.parse(records) : records;
  const parsedParameters = parameters && typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
  const rerankOptions: Record<string, any> = {};
  if (topN) rerankOptions.topN = Number(topN);
  if (typeof returnrecords !== 'undefined') rerankOptions.returnrecords = returnrecords === true || returnrecords === 'true';
  if (parsedParameters) rerankOptions.parameters = parsedParameters;
  const response = await (pinecone.inference as any).rerank(
    model as string,
    query as string,
    parsedrecords,
    rerankOptions
  );
  return [response];
};

export default {
  key: 'rerank',
  noun: 'Rerank',
  display: {
    label: 'Rerank records',
    description: 'Reranks a set of records using a Pinecone reranking model.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'model', label: 'Model', type: 'string', required: true, helpText: 'The reranking model to use (e.g., bge-reranker-v2-m3).',
        choices: [
          'bge-reranker-v2-m3',
          'cohere-rerank-3.5',
          'pinecone-rerank-v0',
        ]
      },
      { key: 'query', label: 'Query', type: 'string', required: true, helpText: 'The query string to rerank against.' },
      { key: 'records', label: 'records', type: 'text', required: true, helpText: 'An array of records as JSON (e.g., [{"id": "vec1", "text": "..."}]).' },
      { key: 'topN', label: 'Top N', type: 'integer', required: false, helpText: 'Number of top results to return.' },
      { key: 'returnRecords', label: 'Return records', type: 'boolean', required: false, helpText: 'Whether to return the full records.' },
      { key: 'parameters', label: 'Parameters', type: 'text', required: false, helpText: 'Additional parameters as a JSON object.' }
    ],
    outputFields: [
      { key: 'model', label: 'Model', type: 'string' },
      { key: 'data', label: 'Reranked Data', list: true },
      { key: 'usage', label: 'Usage', dict: true }
    ],
    sample: {
      model: 'bge-reranker-v2-m3',
      data: [
        { index: 2, score: 0.48357219, record: { id: 'vec3', text: 'Apple Inc. has revolutionized the tech industry...' } },
        { index: 0, score: 0.048405956, record: { id: 'vec1', text: 'Apple is a popular fruit...' } },
        { index: 3, score: 0.007846239, record: { id: 'vec4', text: 'An apple a day keeps the doctor away...' } },
        { index: 1, score: 0.0006563728, record: { id: 'vec2', text: 'Many people enjoy eating apples...' } }
      ],
      usage: { rerankUnits: 1 }
    }
  }
} satisfies Search; 