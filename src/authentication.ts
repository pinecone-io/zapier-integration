import type { Authentication, HttpMethod, ZObject } from 'zapier-platform-core';

import { API_URL } from './constants';

const test = async (z: ZObject) => {
  const options = {
    url: `${API_URL}/indexes`,
    method: 'GET' as HttpMethod,
  };

  const response = await z.request(options);

  return response?.data;
};

export default {
  type: 'custom',
  test,
  fields: [
    {
      computed: false,
      key: 'api_key',
      required: true,
      label: 'API Key',
      type: 'password',
      helpText:
        'Get your API key from the [Pinecone console](https://app.pinecone.io/) under API Keys.',
    },
  ],
} satisfies Authentication;
