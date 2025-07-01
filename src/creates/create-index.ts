import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const {
    name,
    dimension,
    metric,
    spec_type,
    cloud,
    region,
    environment,
    pod_type,
    pods,
    replicas,
    shards,
    deletion_protection,
    tags,
  } = bundle.inputData;

  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
  });

  let spec: any;
  if (spec_type === 'serverless') {
    spec = {
      serverless: {
        cloud: cloud as 'aws' | 'gcp' | 'azure',
        region: region as string,
      },
    };
    if (!region) {
      throw new Error('Region is required for serverless indexes');
    }
  } else if (spec_type === 'pod') {
    const podConfig: any = {
      environment: environment as string,
      pod_type: pod_type as string,
    };
    if (pods) podConfig.pods = parseInt(pods as string, 10);
    if (replicas) podConfig.replicas = parseInt(replicas as string, 10);
    if (shards) podConfig.shards = parseInt(shards as string, 10);
    spec = { pod: podConfig };
  } else {
    spec = {
      byoc: {
        environment: environment as string,
      },
    };
  }

  const options: Record<string, any> = {
    name: name as string,
    dimension: parseInt(dimension as string, 10),
    metric: metric as 'cosine' | 'euclidean' | 'dotproduct',
    spec,
  };
  if (deletion_protection) {
    options.deletion_protection = deletion_protection as 'enabled' | 'disabled';
  }
  if (tags) {
    options.tags = JSON.parse(tags as string);
  }

  await pinecone.createIndex(options as any);
  return { name: options.name, status: 'created' };
};

export default {
  key: 'create_index',
  noun: 'Index',
  display: {
    label: 'Create Index',
    description: 'Creates a new Pinecone index with specified configuration.',
  },
  operation: {
    perform,
    inputFields: [
      {
        key: 'name',
        label: 'Index Name',
        type: 'string',
        helpText: 'The name of the index. Must be **unique** within your project.',
        required: true,
      },
      {
        key: 'dimension',
        label: 'Dimension',
        type: 'integer',
        helpText:
          'The dimension of vectors to be stored in the index. Must be **between 1 and 20000**.',
        required: true,
      },
      {
        key: 'metric',
        label: 'Metric',
        type: 'string',
        helpText: 'The distance metric used to calculate similarity between vectors.',
        required: true,
        choices: ['cosine', 'euclidean', 'dotproduct'],
      },
      {
        key: 'spec_type',
        label: 'Spec Type',
        type: 'string',
        helpText: 'The type of index configuration.',
        required: true,
        choices: ['serverless', 'pod', 'byoc'],
      },
      {
        key: 'cloud',
        label: 'Cloud Provider',
        type: 'string',
        helpText: 'The cloud provider for serverless indexes.',
        required: false,
        choices: ['aws', 'gcp', 'azure'],
      },
      {
        key: 'region',
        label: 'Region',
        type: 'string',
        helpText: 'The region for serverless indexes (e.g., us-east-1).',
        required: false,
      },
      {
        key: 'environment',
        label: 'Environment',
        type: 'string',
        helpText: 'The environment for pod-based or BYOC indexes.',
        required: false,
      },
      {
        key: 'pod_type',
        label: 'Pod Type',
        type: 'string',
        helpText: 'The type of pod for pod-based indexes (e.g., p1.x1).',
        required: false,
      },
      {
        key: 'pods',
        label: 'Pods',
        type: 'integer',
        helpText: 'The number of pods for pod-based indexes.',
        required: false,
      },
      {
        key: 'replicas',
        label: 'Replicas',
        type: 'integer',
        helpText: 'The number of replicas for pod-based indexes.',
        required: false,
      },
      {
        key: 'shards',
        label: 'Shards',
        type: 'integer',
        helpText: 'The number of shards for pod-based indexes.',
        required: false,
      },
      {
        key: 'deletion_protection',
        label: 'Deletion Protection',
        type: 'string',
        helpText: 'Whether to enable deletion protection for the index.',
        required: false,
      },
      {
        key: 'tags',
        label: 'Tags',
        type: 'text',
        helpText: 'Tags as JSON object (e.g., {"environment": "dev", "team": "ai"}).',
        required: false,
      },
    ],
    outputFields: [
      { key: 'name', label: 'Name', type: 'string', primary: true },
      { key: 'status', label: 'Status', type: 'string' },
    ],
    sample: {
      name: 'example-index',
      status: 'created',
    },
  },
} satisfies Create;
