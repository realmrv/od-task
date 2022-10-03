# Test task

## Description

Nestjs framework test [task](https://github.com/kisilya/test-tasks/tree/main/nodeJS)

## Specification

You can read the specification [here](/specification.md)

## Requirements

- Docker Compose

  **OR**

- PostgreSQL 14
- Redis 7
- [Node.js](https://nodejs.org/) 18
- [npm](https://www.npmjs.com/) (normally comes with Node.js)
- [@nestjs/cli](https://docs.nestjs.com/cli/overview)

## Installation

### Installing dependencies (if without Docker)

```bash
npm install
```

### Setting dotenv values

1. Copy `.env.example` as `.env` file
2. Set values ​​in `.env` based on environment specifics (nothing needs to be changed if using Docker Compose)

## Running the app with Docker Compose

1. Up Docker Containers

    ```bash
    docker-compose up -d
    ```

2. Run DB migrations

    ```bash
    docker compose run api npm run typeorm:run-migrations
    ```

## Running the app

```bash
# run migrations
$ npm run typeorm:run-migrations

# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
