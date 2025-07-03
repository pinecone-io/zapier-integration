# Pinecone Zapier Integration

## Prerequisites

- Set up your environment as described in the [root level README](../../README.md#setup).
- Pinecone personnel: Ensure you have access to this repository and the necessary credentials for local development.

## Development

1. From the root of the repository, navigate to your app directory: `cd apps/pinecone` (or the appropriate path).
2. Run `npm install` to install dependencies (commit the generated `package-lock.json`).
3. Make your app changes as needed.
4. Run `npm test` (or `vitest`) to execute unit tests. These tests use mocks and do not make live API calls.
5. Bump the version in `package.json` using [SemVer](http://semver.org/) for versioning.
6. Add a [changelog](CHANGELOG.md) entry for your new version.
7. Open a pull request and follow the [test and deploy instructions](../../README.md#testing-and-deploying).

## Local Testing

- When running or developing locally, use your own Pinecone API key for any manual API tests. Do not commit or share API keys.
- All automated tests are fully mocked and do not require a live Pinecone account.

## API Links

- [Pinecone API Reference](https://docs.pinecone.io/reference/api/introduction)
