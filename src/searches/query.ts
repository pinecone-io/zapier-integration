import { type Bundle, type Search, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name, index_host, namespace, vector, filter, topK, includeValues } = bundle.inputData;
  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
  });
  const ns = pinecone.index(index_name as string, index_host as string).namespace(namespace as string);
  const parsedVector = typeof vector === 'string' ? JSON.parse(vector) : vector;
  const parsedFilter = filter && typeof filter === 'string' ? JSON.parse(filter) : filter;
  const options = {
    vector: parsedVector as number[],
    topK: topK ? Number(topK) : 3,
    ...(parsedFilter ? { filter: parsedFilter } : {}),
    ...(typeof includeValues !== 'undefined' ? { includeValues: includeValues === true || includeValues === 'true' } : {})
  };
  const response = await ns.query(options);
  return [response];
};

export default {
  key: 'query',
  noun: 'Vector Query',
  display: {
    label: 'Query Vectors',
    description: 'Queries a Pinecone index namespace using a vector.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'index_host', label: 'Index Host', type: 'string', required: true, helpText: 'The host URL of the Pinecone index.' },
      { key: 'namespace', label: 'Namespace', type: 'string', required: true, helpText: 'The namespace to query.' },
      { key: 'vector', label: 'Query Vector', type: 'text', required: true, helpText: 'The query vector as a JSON array (e.g., [0.3, 0.3, ...]).' },
      { key: 'filter', label: 'Filter', type: 'text', required: false, helpText: 'Optional filter as a JSON object.' },
      { key: 'topK', label: 'Top K', type: 'integer', required: false, helpText: 'Number of top results to return.' },
      { key: 'includeValues', label: 'Include Values', type: 'boolean', required: false, helpText: 'Whether to include vector values in the results.' }
    ],
    outputFields: [
      { key: 'matches', label: 'Matches', list: true },
      { key: 'namespace', label: 'Namespace', type: 'string' },
      { key: 'usage', label: 'Usage', dict: true }
    ],
    sample: {
      matches: [
        { id: 'vec3', score: 0, values: [0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3] },
        { id: 'vec2', score: 0.0800000429, values: [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2] },
        { id: 'vec4', score: 0.0799999237, values: [0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4] }
      ],
      namespace: 'example-namespace',
      usage: { read_units: 6 }
    }
  }
} satisfies Search; 