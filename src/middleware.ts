import type { BeforeRequestMiddleware } from 'zapier-platform-core';

export const addApiKeyHeader: BeforeRequestMiddleware = (request, z, bundle) => {
  if (bundle.authData.api_key) {
    request.headers = {
      ...request.headers,
      'Api-Key': bundle.authData.api_key,
      'Content-Type': 'application/json',
    };
  }
  return request;
};
