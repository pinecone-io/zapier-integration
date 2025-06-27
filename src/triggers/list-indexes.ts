import type { Trigger, ZObject } from 'zapier-platform-core';

import { API_URL } from '../constants';

interface PineconeIndex {
  name: string;
  metric: string;
  dimension: number;
  status: {
    ready: boolean;
    state: string;
  };
  host: string;
  spec: {
    serverless: {
      region: string;
      cloud: string;
    };
  };
  deletion_protection: string;
  tags: Record<string, string>;
  vector_type: string;
}

interface ListIndexesResponse {
  indexes: PineconeIndex[];
}

const perform = async (z: ZObject) => {
  const response = await z.request<ListIndexesResponse>({
    url: `${API_URL}/indexes`,
    method: 'GET',
  });

  // Return the indexes array directly since triggers expect an array
  // Map name to id to satisfy the constraint
  return (response.data.indexes || []).map((index) => ({
    ...index,
    id: index.name, // Use name as the id
  }));
};

export default {
  key: 'list_indexes',
  noun: 'Index',
  display: {
    label: 'New Index',
    description: 'Triggers when a new index is created.',
  },
  operation: {
    perform,
    sample: {
      id: '123',
      name: 'example-index',
      metric: 'cosine',
      dimension: 1536,
      status: {
        ready: true,
        state: 'Ready',
      },
      host: 'example-index-abc123.svc.us-east-1-aws.pinecone.io',
      spec: {
        serverless: {
          region: 'us-east-1',
          cloud: 'aws',
        },
      },
    },
    outputFields: [
      { key: 'id', label: 'ID', type: 'string', primary: true },
      { key: 'name', label: 'Name', type: 'string' },
      { key: 'metric', label: 'Metric', type: 'string' },
      { key: 'dimension', label: 'Dimension', type: 'integer' },
      { key: 'status__ready', label: 'Ready', type: 'boolean' },
      { key: 'status__state', label: 'State', type: 'string' },
      { key: 'host', label: 'Host', type: 'string' },
      { key: 'spec__serverless__region', label: 'Region', type: 'string' },
      { key: 'spec__serverless__cloud', label: 'Cloud', type: 'string' },
      { key: 'deletion_protection', label: 'Deletion Protection', type: 'string' },
      { key: 'vector_type', label: 'Vector Type', type: 'string' },
    ],
  },
} satisfies Trigger;
