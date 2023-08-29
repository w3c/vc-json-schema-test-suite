# VC JSON Schema Test Suite

Test suite for the [VC JSON Schema](https://github.com/w3c/vc-json-schema/) specification in the W3C.

The suite makes use Digital Bazaar's [mocha-w3c-interop-reporter](https://github.com/digitalbazaar/mocha-w3c-interop-reporter).

## Building & Testing

To build and test the suite, run the following commands:

```bash
npm install
npm test
```

You can remove all generated test cases by running:

```bash
npm clean
```

A report will be generated to the [reports](reports) directory after a successful run.

## Implementations

Implementations are tested on two dimensions: support for defined types (`JsonSchema` and `JsonSchemaCredential`), and
support for specified JSON Schema versions (`Draft-7`, `2019-09`, and `2020-12`).

### How Implementations Work
Implementations are run using [docker compose](https://docs.docker.com/compose/). Each container is called once
per test case. The container is expected take the following inputs:

* `format` - either `JsonSchema` or `JsonSchemaCredential`
* `schema` - a path to the input schema file
* `credential` - a path to the input credential file
* `output` - a path to where the container will write an output

An example command for a container that takes the above inputs would be:

```bash
docker-compose -f ./implementations/docker-compose.yml \
 run -d tbd validate \
 --format JsonSchemaCredential \
 --schema /tests/input/jsonschemacredential/Draft-7/11-schema.json \
 --credential /tests/input/jsonschemacredential/Draft-7/1-credential.json \
 --output /tests/output/jsonschemacredential/Draft-7/18-tbd.json
```

### Adding an Implementation

To add an implementation to the test suite, add a new entry to the `implementations` array in `implementations.json`.
The entry should have the following properties: `name` and `specs`, where `specs` is an object with the supported
[JSON Schema versions](https://json-schema.org/) as keys and an array of supported
[VC JSON Schema Types](https://w3c.github.io/vc-json-schema/#data-model) as values.

```json
{
  "name": "sample",
  "specs": {
    "2020-12": [
      "JsonSchema",
      "JsonSchemaCredential"
    ],
    "2019-09": [
      "JsonSchema",
      "JsonSchemaCredential"
    ],
    "Draft-7": [
      "JsonSchema",
      "JsonSchemaCredential"
    ]
  }
}
```

Next, you'll need to add a new entry for the implementation in the [`docker-compose.yml`](implementations/docker-compose.yml)
file. You may optionally add a directory to the [`implementations`](implementations) directory with the same name as the
implementation which houses the implementation's code.