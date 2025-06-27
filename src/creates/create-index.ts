import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';

import { API_URL } from '../constants';

interface ServerlessSpec {
  serverless: {
    cloud: 'aws' | 'gcp' | 'azure';
    region: string;
  };
}

interface PodSpec {
  pod: {
    environment: string;
    pod_type: string;
    pods?: number;
    replicas?: number;
    shards?: number;
  };
}

interface ByocSpec {
  byoc: {
    environment: string;
  };
}

interface CreateIndexRequest {
  name: string;
  dimension: number;
  metric: 'cosine' | 'euclidean' | 'dotproduct';
  spec: ServerlessSpec | PodSpec | ByocSpec;
  deletion_protection?: 'enabled' | 'disabled';
  tags?: Record<string, string>;
}

interface PineconeIndex {
  name: string;
  metric: string;
  dimension: number;
  status: {
    ready: boolean;
    state: string;
  };
  host: string;
  spec: ServerlessSpec | PodSpec | ByocSpec;
  deletion_protection: string;
  tags: Record<string, string>;
  vector_type: string;
}

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

  let spec: ServerlessSpec | PodSpec | ByocSpec;

  if (spec_type === 'serverless') {
    spec = {
      serverless: {
        cloud: cloud as 'aws' | 'gcp' | 'azure',
        region: region as string,
      },
    };
    // Manually validate region because it's not a required field.
    if (!region) {
      throw new Error('Region is required for serverless indexes');
    }
  } else if (spec_type === 'pod') {
    const podConfig: {
      environment: string;
      pod_type: string;
      pods?: number;
      replicas?: number;
      shards?: number;
    } = {
      environment: environment as string,
      pod_type: pod_type as string,
    };

    if (pods) podConfig.pods = parseInt(pods as string, 10);
    if (replicas) podConfig.replicas = parseInt(replicas as string, 10);
    if (shards) podConfig.shards = parseInt(shards as string, 10);

    spec = { pod: podConfig };
  } else {
    // BYOC
    spec = {
      byoc: {
        environment: environment as string,
      },
    };
  }

  const requestBody: CreateIndexRequest = {
    name: name as string,
    dimension: parseInt(dimension as string, 10),
    metric: metric as 'cosine' | 'euclidean' | 'dotproduct',
    spec,
  };

  if (deletion_protection) {
    requestBody.deletion_protection = deletion_protection as 'enabled' | 'disabled';
  }

  if (tags) {
    requestBody.tags = JSON.parse(tags as string);
  }

  const response = await z.request<PineconeIndex>({
    url: `${API_URL}/indexes`,
    method: 'POST',
    body: requestBody,
  });

  return response.data;
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
        label: 'Number of Pods',
        type: 'integer',
        helpText: 'The number of pods for pod-based indexes.',
        required: false,
      },
      {
        key: 'replicas',
        label: 'Number of Replicas',
        type: 'integer',
        helpText: 'The number of replicas for pod-based indexes.',
        required: false,
      },
      {
        key: 'shards',
        label: 'Number of Shards',
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
        choices: ['enabled', 'disabled'],
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
      { key: 'metric', label: 'Metric', type: 'string' },
      { key: 'dimension', label: 'Dimension', type: 'integer' },
      { key: 'vector_type', label: 'Vector Type', type: 'string' },
      { key: 'status', label: 'Status', dict: true },
      { key: 'status__ready', label: 'Ready', type: 'boolean' },
      { key: 'status__state', label: 'State', type: 'string' },
      { key: 'host', label: 'Host', type: 'string' },
      { key: 'spec', label: 'Spec', dict: true },
      { key: 'deletion_protection', label: 'Deletion Protection', type: 'string' },
      { key: 'tags', label: 'Tags', dict: true },
    ],
    sample: {
      name: 'example-index',
      metric: 'cosine',
      dimension: 1536,
      vector_type: 'dense',
      status: {
        ready: true,
        state: 'Ready',
      },
      host: 'example-index-abc123.svc.us-east-1-aws.pinecone.io',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1',
        },
      },
      deletion_protection: 'disabled',
      tags: {
        environment: 'production',
      },
    },
  },
} satisfies Create;
