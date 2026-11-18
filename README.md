# XML to Redis Exporter

A TypeScript command-line app that imports XML configuration data
into Redis.

## Requirements

- Docker with Docker Compose
- A running Docker engine
- Bash

Node.js and npm are only needed for local development.
The Docker build installs dependencies, runs tests, and compiles the app.

## Run

From the project directory:

`./export.sh ./config.xml`

Print the saved keys:

`./export.sh -v ./config.xml`

Paths containing spaces must be quoted:

`./export.sh -v "/path/to/my config.xml"`

## Data mapping

- `subdomains`: a JSON string containing all subdomain URLs.
- `cookie:<name>:<host>`: the text value of the corresponding cookie.

Existing keys are overwritten. Unrelated keys are left unchanged.
Writes happen sequentially, so a failed export may leave some entries saved.

## Local development

Install dependencies: `npm ci`

Run unit tests: `npm test`

Build the application: `npm run build`

The unit tests cover key/value conversion, missing cookie hosts,
and missing configuration.

## Project structure

- `src/index.ts`: command-line arguments, file reading, and XML parsing.
- `src/entries.ts`: validation and conversion into key/value entries.
- `src/redis-store.ts`: Redis connection and writes.
- `tests/entries.test.ts`: conversion unit tests.
- `export.sh`: runs the containerized exporter.
- `compose.yaml`: configures the app and Redis containers.

## Stop

Run `docker compose down`.

The Redis data volume is retained.
# emaww-takehome
