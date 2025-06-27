import { describe, expect, it, beforeEach } from 'vitest';
import zapier from 'zapier-platform-core';
import type { Bundle } from 'zapier-platform-core';
import nock from 'nock';

import { API_URL } from '../constants';
import App from '../index';

const appTester = zapier.createAppTester(App);

describe('authentication', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  describe('test', () => {
    const bundle = {
      inputData: {},
      authData: {
        api_key: 'test_api_key_123',
      },
      meta: {} as Bundle['meta'],
      inputDataRaw: {},
    } satisfies Bundle;

    describe('Given a valid API key', () => {
      it('should run the auth test successfully', async () => {
        const expectedResponse = {
          indexes: [
            {
              name: 'test-index',
              dimension: 1536,
              metric: 'cosine',
              host: 'test-index-abc123.svc.us-east-1-aws.pinecone.io',
              spec: {
                serverless: {
                  cloud: 'aws',
                  region: 'us-east-1',
                },
              },
              status: {
                ready: true,
                state: 'Ready',
              },
            },
          ],
        };

        nock(API_URL)
          .get('/indexes')
          .matchHeader('Content-Type', 'application/json')
          .reply(200, expectedResponse);

        const result = await appTester(App.authentication.test, bundle);
        expect(result).toEqual({
          indexes: [
            {
              name: 'test-index',
              dimension: 1536,
              metric: 'cosine',
              host: 'test-index-abc123.svc.us-east-1-aws.pinecone.io',
              spec: {
                serverless: {
                  cloud: 'aws',
                  region: 'us-east-1',
                },
              },
              status: {
                ready: true,
                state: 'Ready',
              },
            },
          ],
        });
        expect(nock.isDone()).toBe(true);
      });
    });

    describe('Given an invalid API key', () => {
      it('should throw an error', async () => {
        nock(API_URL)
          .get('/indexes')
          .reply(401, {
            error: {
              code: 'UNAUTHENTICATED',
              message: 'API key not found',
            },
          });

        await expect(appTester(App.authentication.test, bundle)).rejects.toThrow();
        expect(nock.isDone()).toBe(true);
      });
    });

    describe('Given an API key with no project access', () => {
      it('should indicate authentication success but no project', async () => {
        nock(API_URL).get('/indexes').reply(200, { indexes: [] });

        const result = await appTester(App.authentication.test, bundle);
        expect(result).toEqual({
          indexes: [],
        });
        expect(nock.isDone()).toBe(true);
      });
    });
  });
});
