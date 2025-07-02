import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const name = String(bundle.inputData.name);
  const podType = String(bundle.inputData.pod_type);
  const replicas = Number(bundle.inputData.replicas);
  const environment = String(bundle.inputData.environment);
  const dimension = Number(bundle.inputData.dimension);
  const metric = String(bundle.inputData.metric);
  const pinecone = new Pinecone({ apiKey: bundle.authData.api_key });
  const response = await pinecone.createIndex({
    name,
    dimension,
    metric: metric as any,
    spec: {
      pod: {
        podType,
        replicas,
        environment,
      },
    },
  });
  return { ...response, name, status: 'created' };
};

export default {
  key: 'create_pod_index',
  noun: 'Pod-based Index',
  display: {
    label: 'Create Pod-based Index',
    description: 'Creates a new pod-based Pinecone index.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'name', label: 'Index Name', type: 'string', required: true },
      { key: 'pod_type', label: 'Pod Type', type: 'string', required: true },
      { key: 'replicas', label: 'Replicas', type: 'integer', required: true },
      { key: 'environment', label: 'Environment', type: 'string', required: true },
      { key: 'dimension', label: 'Dimension', type: 'integer', required: true },
      { key: 'metric', label: 'Metric', type: 'string', required: true, choices: ['cosine', 'dotproduct', 'euclidean'] },
    ],
    outputFields: [
      { key: 'name', label: 'Name', type: 'string', primary: true },
      { key: 'status', label: 'Status', type: 'string' },
    ],
    sample: {
      name: 'my-pod-index',
      status: 'created',
    },
  },
} satisfies Create;
