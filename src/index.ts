import { version as platformVersion } from 'zapier-platform-core';

import packageJson from '../package.json';

import authentication from './authentication';
import { addApiKeyHeader } from './middleware';

// Creates
import ConfigureIndex from './creates/configure-index';
import CreateIndex from './creates/create-index';
import DeleteIndex from './creates/delete-index';
import DeleteNamespace from './creates/delete-namespace';
import AddRecord from './creates/add-record';
import UpdateRecord from './creates/update-record';
import DeleteRecord from './creates/delete-record';
// Searches
import describeIndex from './searches/describe-index';
import describeIndexStats from './searches/describe-index-stats';
import describeNamespace from './searches/describe-namespace';
import ListIndexes from './searches/list-indexes';
import listNamespaces from './searches/list-namespaces';
import search from './searches/search';
import listRecords from './searches/list-records';

// Triggers
import IndexStatusChange from './triggers/index-status-change';

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
    [IndexStatusChange.key]: IndexStatusChange,
  },

  creates: {
    [ConfigureIndex.key]: ConfigureIndex,
    [CreateIndex.key]: CreateIndex,
    [AddRecord.key]: AddRecord,
    [UpdateRecord.key]: UpdateRecord,
    [DeleteIndex.key]: DeleteIndex,
    [DeleteNamespace.key]: DeleteNamespace,
    [DeleteRecord.key]: DeleteRecord,
  },

  searches: {
    [ListIndexes.key]: ListIndexes,
    [describeIndexStats.key]: describeIndexStats,
    [describeIndex.key]: describeIndex,
    [describeNamespace.key]: describeNamespace,
    [listNamespaces.key]: listNamespaces,
    [listRecords.key]: listRecords,
    [search.key]: search,
  },
};
