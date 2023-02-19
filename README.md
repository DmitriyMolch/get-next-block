## Description
- The application has a simple API that takes a timestamp in seconds as an input and returns the closest Ethereum block number that was created after the input timestamp based on binary search algorithm.
- Used **TypeScript** and **Express.js** to build an API that accepts a timestamp in seconds as input.
- The **Ethers.js** the API queries the Ethereum blockchain with the function `getBlock` and return the closest block number that was right after the input timestamp.

## Local configuration

```bash
$ cp .env.default .env
```

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# build
$ yarn build

# production
$ yarn start

# watch mode
$ yarn dev
```

## Test

```bash

# e2e tests
$ yarn test:e2e
```
