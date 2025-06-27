import { version as platformVersion } from 'zapier-platform-core';

import packageJson from '../package.json';

import authentication from './authentication';
import { addApiKeyHeader } from './middleware';
import ListIndexes from './triggers/list-indexes';
import CreateIndex from './creates/create-index';

const requestTemplate = {
  headers: {
    'Api-Key': '{{ bundle.authData.api_key }}',
    'Content-Type': 'application/json',
  },
};

export default {
  version: packageJson.version,
  platformVersion,

  authentication,
  beforeRequest: [addApiKeyHeader],

  requestTemplate,

  triggers: {
    [ListIndexes.key]: ListIndexes,
  },

  creates: {
    [CreateIndex.key]: CreateIndex,
  },
};
