import { version as platformVersion } from 'zapier-platform-core';

import packageJson from '../package.json';

import authentication from './authentication';
import { addApiKeyHeader } from './middleware';

// Creates
import ConfigureIndex from './creates/configure-index';
import CreateIndex from './creates/create-index';
import DeleteIndex from './creates/delete-index';
import DeleteDocument from './creates/delete-document';
import DeleteNamespace from './creates/delete-namespace';
import AddDocument from './creates/add-document';
import UpdateDocument from './creates/update-document';

// Searches
import describeIndex from './searches/describe-index';
import describeIndexStats from './searches/describe-index-stats';
import describeModel from './searches/describe-model';
import describeNamespace from './searches/describe-namespace';
import fetchVectors from './searches/fetch-vectors';
import ListIndexes from './searches/list-indexes';
import ListModels from './searches/list-models';
import listNamespaces from './searches/list-namespaces';
import listVectors from './searches/list-vectors';
import query from './searches/query';
import rerank from './searches/rerank';

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
    [AddDocument.key]: AddDocument,
    [UpdateDocument.key]: UpdateDocument,
    [DeleteIndex.key]: DeleteIndex,
    [DeleteNamespace.key]: DeleteNamespace,
    [DeleteDocument.key]: DeleteDocument,
  },

  searches: {
    [ListIndexes.key]: ListIndexes,
    [describeIndexStats.key]: describeIndexStats,
    [describeIndex.key]: describeIndex,
    [describeModel.key]: describeModel,
    [describeNamespace.key]: describeNamespace,
    [fetchVectors.key]: fetchVectors,
    [ListModels.key]: ListModels,
    [listNamespaces.key]: listNamespaces,
    [listVectors.key]: listVectors,
    [query.key]: query,
    [rerank.key]: rerank,
  },
};
