import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const {
    name,
    cloud,
    region,
    model,
    field_map,
    wait_until_ready,
    deletion_protection,
    tags,
  } = bundle.inputData;

  const pinecone = new Pinecone({ apiKey: bundle.authData.api_key });

  const createIndexParams: any = {
    name: name as string,
    cloud: cloud as 'aws' | 'gcp' | 'azure',
    region: region as string,
    embed: {
      model: model as string,
      fieldMap: JSON.parse(field_map as string),
    },
    waitUntilReady: wait_until_ready as boolean,
    deletionProtection: deletion_protection as 'enabled' | 'disabled',
  };
  if (typeof tags === 'string' && tags.trim()) {
    createIndexParams.tags = JSON.parse(tags);
  }
  const result = await pinecone.createIndexForModel(createIndexParams);
  if (result && typeof result === 'object') {
    return { ...result, name, status: 'created' };
  }
  return { name, status: 'created' };
};

export default {
  key: 'create_integrated_index',
  noun: 'Index',
  display: {
    label: 'Create Integrated Index',
    description: 'Creates a new Pinecone integrated index with specified configuration.',
  },
  operation: {
    perform,
    inputFields: [
      {
        key: 'name',
        label: 'Index Name',
        type: 'string',
        helpText: 'The name of the integrated index. Must be **unique** within your project.',
        required: true,
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
        key: 'model',
        label: 'Model',
        type: 'string',
        helpText: 'The model to use for the index.',
        required: true,
      },
      {
        key: 'field_map',
        label: 'Field Map',
        type: 'text',
        helpText: 'The field map for the index as a JSON object (e.g., {"text": "myField"}).',
        required: true,
      },
      {
        key: 'wait_until_ready',
        label: 'Wait Until Ready',
        type: 'boolean',
        helpText: 'Whether to wait until the index is ready.',
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
      { key: 'dimension', label: 'Dimension', type: 'integer' },
      { key: 'metric', label: 'Metric', type: 'string' },
      { key: 'host', label: 'Host', type: 'string' },
      { key: 'deletionProtection', label: 'Deletion Protection', type: 'string' },
      { key: 'tags', label: 'Tags', dict: true },
      { key: 'vectorType', label: 'Vector Type', type: 'string' },
      { key: 'embed', label: 'Embed', dict: true },
      { key: 'embed.model', label: 'Embed Model', type: 'string' },
      { key: 'embed.metric', label: 'Embed Metric', type: 'string' },
      { key: 'embed.dimension', label: 'Embed Dimension', type: 'integer' },
      { key: 'embed.vectorType', label: 'Embed Vector Type', type: 'string' },
      { key: 'embed.fieldMap', label: 'Embed Field Map', dict: true },
      { key: 'embed.readParameters', label: 'Embed Read Parameters', dict: true },
      { key: 'embed.readParameters.input_type', label: 'Embed Read Parameters Input Type', type: 'string' },
      { key: 'embed.readParameters.truncate', label: 'Embed Read Parameters Truncate', type: 'string' },
      { key: 'embed.writeParameters', label: 'Embed Write Parameters', dict: true },
      { key: 'embed.writeParameters.input_type', label: 'Embed Write Parameters Input Type', type: 'string' },
      { key: 'embed.writeParameters.truncate', label: 'Embed Write Parameters Truncate', type: 'string' },
      { key: 'spec', label: 'Spec', dict: true },
      { key: 'spec.serverless.cloud', label: 'Cloud', type: 'string' },
      { key: 'spec.serverless.region', label: 'Region', type: 'string' },
      { key: 'status', label: 'Status', dict: true },
      { key: 'status.ready', label: 'Ready', type: 'boolean' },
      { key: 'status.state', label: 'State', type: 'string' }
    ],
    sample: {
      name: 'integrated-dense-js',
      dimension: 1024,
      metric: 'cosine',
      host: 'integrated-dense-js-govk0nt.svc.aped-4627-b74a.pinecone.io',
      deletionProtection: 'disabled',
      tags: undefined,
      embed: {
        model: 'llama-text-embed-v2',
        metric: 'cosine',
        dimension: 1024,
        vectorType: 'dense',
        fieldMap: { text: 'chunk_text' },
        readParameters: { input_type: 'query', truncate: 'END' },
        writeParameters: { input_type: 'passage', truncate: 'END' }
      },
      spec: { pod: undefined, serverless: { cloud: 'aws', region: 'us-east-1' } },
      status: { ready: true, state: 'Ready' },
      vectorType: 'dense'
    }
  },
} satisfies Create;
