import { type Bundle, type Create, type ZObject } from 'zapier-platform-core';
import { Pinecone } from '@pinecone-database/pinecone';

const perform = async (z: ZObject, bundle: Bundle) => {
  const {
    index_name,
    pod_type,
    replicas,
    deletion_protection,
    tags,
    embed_model,
    embed_field_map
  } = bundle.inputData;

  const pinecone = new Pinecone({
    apiKey: bundle.authData.api_key,
    sourceTag: 'zapier',
  });

  // Build the config object dynamically
  const config: Record<string, any> = {};
  if (pod_type) config.pod_type = pod_type;
  if (replicas) config.replicas = Number(replicas);
  if (deletion_protection) config.deletion_protection = deletion_protection;
  if (typeof tags === 'string' && tags.trim()) config.tags = JSON.parse(tags);
  if (embed_model || embed_field_map) {
    config.embed = {};
    if (embed_model) config.embed.model = embed_model;
    if (typeof embed_field_map === 'string' && embed_field_map.trim()) config.embed.fieldMap = JSON.parse(embed_field_map);
  }

  const response = await pinecone.configureIndex(index_name as string, config);
  if (response && typeof response === 'object') {
    return { ...response, name: index_name, status: 'configured' };
  }
  return { name: index_name, status: 'configured' };
};

export default {
  key: 'configure_index',
  noun: 'Index',
  display: {
    label: 'Configure Index',
    description: 'Configures a Pinecone index (e.g., pod type, replicas, deletion protection, tags).'
  },
  operation: {
    perform,
    inputFields: [
      { key: 'index_name', label: 'Index Name', type: 'string', required: true, helpText: 'The name of the Pinecone index to configure.' },
      { key: 'pod_type', label: 'Pod Type', type: 'string', required: false, helpText: 'The pod type for the index (e.g., p1.x2).' },
      { key: 'replicas', label: 'Replicas', type: 'integer', required: false, helpText: 'The number of replicas for the index.' },
      { key: 'deletion_protection', label: 'Deletion Protection', type: 'string', required: false, choices: ['enabled', 'disabled'], helpText: 'Enable or disable deletion protection.' },
      { key: 'tags', label: 'Tags', type: 'text', required: false, helpText: 'Tags as JSON object (e.g., {"environment": "production", "example": "tag"}).' },
      { key: 'embed_model', label: 'Embed Model', type: 'string', required: false, helpText: 'The embedding model to use for integrated indexes.' },
      { key: 'embed_field_map', label: 'Embed Field Map', type: 'text', required: false, helpText: 'Field map for the embed model as a JSON object (e.g., {"text": "chunk_text"}).' }
    ],
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
      { key: 'tags', label: 'Tags', dict: true }
    ],
    sample: {
      name: 'docs-example',
      metric: 'cosine',
      dimension: 1536,
      status: {
        ready: true,
        state: 'Ready'
      },
      host: 'docs-example1-4zo0ijk.svc.dev-us-west2-aws.pinecone.io',
      spec: {
        serverless: {
          region: 'us-east-1',
          cloud: 'aws'
        }
      },
      tags: {
        example: 'tag',
        environment: 'production'
      }
    }
  }
} satisfies Create; 