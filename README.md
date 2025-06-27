# Pinecone

## Prerequisites

- Set up your environment as described in the [root level README](../../README.md#setup).
- Zapier staff only: Add yourself as a collaborator [here](https://zapier.com/app/developer/app/226171/team), and accept the email invitation. This will grant you write access to the app.

## Development

1. From the root of the repository, navigate to your app directory `cd apps/pinecone`
2. `npm install` to install dependencies from npm (don't forget to commit the generated `package-lock.json`).
3. Make your app changes.
4. `zapier test` to run unit tests. Note: These should not make live API calls.
5. Bump the version in package.json. Use [SemVer](http://semver.org/) for versioning.
6. Fill in a [changelog](CHANGELOG.md) entry for your new version.
7. Open an MR on gitlab and follow the [test and deploy instructions](../../README.md#testing-and-deploying)

## Test Accounts

- When testing in the Zap Editor, use API key found in 1Password (linked to `developer-account@zapier.com` username)

<!-- Include any API links that would be useful -->

## API Links

- https://docs.pinecone.io/reference/api/introduction
