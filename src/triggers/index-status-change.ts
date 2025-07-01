import { type Bundle, type Trigger, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name } = bundle.inputData;
  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
  });
  const response = await pinecone.listIndexes();
  let indexes = response.indexes;
  if (index_name) {
    indexes = indexes.filter(idx => idx.name === index_name);
  }
  // Add a unique id and a timestamp for deduplication
  return indexes.map(idx => ({
    ...idx,
    id: idx.name + '-' + (idx.status?.state || 'unknown'),
    status_changed_at: new Date().toISOString() // In a real app, use the actual status change timestamp if available
  }));
};

export default {
  key: 'index_status_change',
  noun: 'Index',
  display: {
    label: 'Index Status Change',
    description: 'Triggers when the status of any Pinecone index changes.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'index_name', label: 'Index Name', type: 'string', required: false, helpText: 'Optionally filter for a specific index.' }
    ],
    outputFields: [
      { key: 'id', label: 'Event ID', type: 'string', primary: true },
      { key: 'name', label: 'Index Name', type: 'string' },
      { key: 'metric', label: 'Metric', type: 'string' },
      { key: 'dimension', label: 'Dimension', type: 'integer' },
      { key: 'status', label: 'Status', dict: true },
      { key: 'status.ready', label: 'Ready', type: 'boolean' },
      { key: 'status.state', label: 'State', type: 'string' },
      { key: 'status_changed_at', label: 'Status Changed At', type: 'string' },
      { key: 'host', label: 'Host', type: 'string' },
      { key: 'spec', label: 'Spec', dict: true },
      { key: 'deletion_protection', label: 'Deletion Protection', type: 'string' },
      { key: 'tags', label: 'Tags', dict: true },
      { key: 'vector_type', label: 'Vector Type', type: 'string' }
    ],
    sample: {
      id: 'docs-example2-Ready',
      name: 'docs-example2',
      metric: 'cosine',
      dimension: 1536,
      status: {
        ready: true,
        state: 'Ready'
      },
      status_changed_at: '2024-06-01T12:00:00.000Z',
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