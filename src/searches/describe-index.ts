import { type Bundle, type ZObject, type Trigger } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const { index_name } = bundle.inputData;
  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
  });
  const response = await pinecone.describeIndex(index_name as string);
  // Return as an array for Zapier triggers
  return [response];
};

export default {
  key: 'describe_index',
  noun: 'Index',
  display: {
    label: 'Describe Index',
    description: 'Describes a Pinecone index.'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index to describe.' }
    ],
    outputFields: [
      { key: 'name', label: 'Name', type: 'string', primary: true },
      { key: 'dimension', label: 'Dimension', type: 'integer' },
      { key: 'metric', label: 'Metric', type: 'string' },
      { key: 'host', label: 'Host', type: 'string' },
      { key: 'deletionProtection', label: 'Deletion Protection', type: 'string' },
      { key: 'tags', label: 'Tags', dict: true },
      { key: 'embed', label: 'Embed', dict: true },
      { key: 'spec', label: 'Spec', dict: true },
      { key: 'spec.serverless.cloud', label: 'Cloud', type: 'string' },
      { key: 'spec.serverless.region', label: 'Region', type: 'string' },
      { key: 'status', label: 'Status', dict: true },
      { key: 'status.ready', label: 'Ready', type: 'boolean' },
      { key: 'status.state', label: 'State', type: 'string' },
      { key: 'vectorType', label: 'Vector Type', type: 'string' }
    ],
    sample: {
      name: 'docs-example-dense',
      dimension: 1536,
      metric: 'cosine',
      host: 'docs-example-dense-govk0nt.svc.aped-4627-b74a.pinecone.io',
      deletionProtection: 'disabled',
      tags: { environment: 'development', example: 'tag' },
      embed: undefined,
      spec: { pod: undefined, serverless: { cloud: 'aws', region: 'us-east-1' } },
      status: { ready: true, state: 'Ready' },
      vectorType: 'dense'
    }
  }
} satisfies Trigger; 