import { type Bundle, type ZObject, type Trigger } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`),
        toSnakeCase(v)
      ])
    );
  }
  return obj;
};

const perform = async (z: ZObject, bundle: Bundle) => {
  const pinecone = new Pinecone();
  const response = await pinecone.listIndexes();
  // Convert each index to snake_case keys
  return response.indexes.map(toSnakeCase);
};

export default {
  key: 'list_indexes',
  noun: 'Index',
  display: {
    label: 'List Indexes',
    description: 'Lists all Pinecone indexes in your project.'
  },
  operation: {
    perform,
    outputFields: [
      { key: 'name', label: 'Name', type: 'string', primary: true },
      { key: 'metric', label: 'Metric', type: 'string' },
      { key: 'dimension', label: 'Dimension', type: 'integer' },
      { key: 'status', label: 'Status', dict: true },
      { key: 'status.ready', label: 'Ready', type: 'boolean' },
      { key: 'status.state', label: 'State', type: 'string' },
      { key: 'host', label: 'Host', type: 'string' },
      { key: 'spec', label: 'Spec', dict: true },
      { key: 'spec.serverless.cloud', label: 'Cloud', type: 'string' },
      { key: 'spec.serverless.region', label: 'Region', type: 'string' },
      { key: 'deletion_protection', label: 'Deletion Protection', type: 'string' },
      { key: 'tags', label: 'Tags', dict: true },
      { key: 'vector_type', label: 'Vector Type', type: 'string' }
    ],
    sample: {
      name: 'docs-example2',
      metric: 'cosine',
      dimension: 1536,
      status: {
        ready: true,
        state: 'Ready'
      },
      host: 'docs-example2-govk0nt.svc.aped-4627-b74a.pinecone.io',
      spec: {
        serverless: {
          region: 'us-east-1',
          cloud: 'aws'
        }
      },
      deletion_protection: 'disabled',
      tags: {
        environment: 'production',
        example: 'tag2'
      },
      vector_type: 'dense'
    }
  }
} satisfies Trigger;
