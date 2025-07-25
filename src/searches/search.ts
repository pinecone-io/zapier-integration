import { type Bundle, type Search, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name, namespace, query_text, top_k, fields } = bundle.inputData;
  const pinecone = new Pinecone({ apiKey: bundle.authData.api_key, sourceTag: 'zapier' });
  const index = pinecone.index(index_name as string);
  const ns = index.namespace(namespace as string);

  const searchResponse = await ns.searchRecords({
    query: {
      inputs: { text: query_text as string },
      topK: top_k as number,
    },
    fields: fields as string[],
  });

  return searchResponse.result.hits.map((hit: any) => ({
    id: hit._id,
    score: hit._score,
    fields: hit.fields,
  }));
};

export default {
  key: 'search_records',
  noun: 'Record',
  display: {
    label: 'Search Records',
    description: 'Searches for records in a Pinecone index using a text query.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index.' },
      { key: 'namespace', label: 'Namespace', type: 'string', required: true, helpText: 'The namespace to search within.' },
      { key: 'query_text', label: 'Query Text', type: 'string', required: true, helpText: 'The text to search for.' },
      { key: 'top_k', label: 'Top K', type: 'integer', required: true, helpText: 'The number of top results to return.' },
      { key: 'fields', label: 'Fields', type: 'string', required: true, helpText: 'The fields to return. This can be retrieved with the Describe Index operation, under embed.field_map.' },
    ],
    outputFields: [
      { key: 'id', label: 'Record ID', type: 'string' },
      { key: 'score', label: 'Score', type: 'number' },
      { key: 'fields', label: 'Fields', dict: true },
    ],
    sample: {
      id: 'rec1',
      score: 0.95,
      fields: {
        category: 'example-category',
        chunk_text: 'Example text',
      },
    },
  },
} satisfies Search;
