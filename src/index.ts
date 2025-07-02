import { version as platformVersion } from 'zapier-platform-core';

import packageJson from '../package.json';

import authentication from './authentication';
import { addApiKeyHeader } from './middleware';

// Creates
import ConfigureIndex from './creates/configure-index';
import CreateIntegratedIndex from './creates/create-integrated-index';
import CreatePodIndex from './creates/create-pod-index';
import CreateServerlessIndex from './creates/create-serverless-index';
import Embed from './creates/embed';
import UpdateVector from './creates/update-vector';
import UpsertText from './creates/upsert-text';
import UpsertVectors from './creates/upsert-vectors';
import DeleteIndex from './deletes/delete-index';
import DeleteNamespace from './deletes/delete-namespace';
import DeleteVector from './deletes/delete-vectors';

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
import searchWithText from './searches/search-with-text';

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
    [CreateIntegratedIndex.key]: CreateIntegratedIndex,
    [CreateServerlessIndex.key]: CreateServerlessIndex,
    [CreatePodIndex.key]: CreatePodIndex,
    [Embed.key]: Embed,
    [UpdateVector.key]: UpdateVector,
    [UpsertText.key]: UpsertText,
    [UpsertVectors.key]: UpsertVectors,
    [DeleteIndex.key]: DeleteIndex,
    [DeleteNamespace.key]: DeleteNamespace,
    [DeleteVector.key]: DeleteVector,
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
    [searchWithText.key]: searchWithText,
  },
};
