import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const name = String(bundle.inputData.name);
  const cloud = String(bundle.inputData.cloud); // Should match ServerlessSpecCloudEnum
  const region = String(bundle.inputData.region);
  const dimension = Number(bundle.inputData.dimension);
  const metric = String(bundle.inputData.metric); // Should match CreateIndexRequestMetricEnum
  // Pass apiKey in constructor as per Pinecone SDK v2
  const pinecone = new Pinecone({ apiKey: bundle.authData.api_key });
  const response = await pinecone.createIndex({
    name,
    dimension,
    metric: metric as 'cosine' | 'dotproduct' | 'euclidean',
    spec: {
      serverless: {
        cloud: cloud as 'aws' | 'gcp' | 'azure',
        region,
      },
    },
  });
  return { ...response, name, status: 'created' };
};

export default {
  key: 'create_serverless_index',
  noun: 'Serverless Index',
  display: {
    label: 'Create Serverless Index',
    description: 'Creates a new serverless Pinecone index.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'name', label: 'Index Name', type: 'string', required: true },
      { key: 'cloud', label: 'Cloud Provider', type: 'string', required: true, choices: ['aws', 'gcp'] },
      { key: 'region', label: 'Region', type: 'string', required: true },
      { key: 'dimension', label: 'Dimension', type: 'integer', required: true },
      { key: 'metric', label: 'Metric', type: 'string', required: true, choices: ['cosine', 'dotproduct', 'euclidean'] },
    ],
    outputFields: [
      { key: 'name', label: 'Name', type: 'string', primary: true },
      { key: 'status', label: 'Status', type: 'string' },
    ],
    sample: {
      name: 'my-serverless-index',
      status: 'created',
    },
  },
} satisfies Create;
