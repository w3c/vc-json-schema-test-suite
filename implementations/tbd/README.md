# TBD's VC JSON Schema Implementation

## Local
### Building

Assuming you have [go](https://go.dev/) installed...

```bash
go build ./...
```

Which will produce a binary called `vc-json-schema-test-suite`

### Running

Select format, schema, credential, and output files and run as follows:

```bash
 ./vc-json-schema-test-suite validate --format JsonSchema --schema ../../tests/input/test-1-schema.json --credential ../../tests/input/test-1-credential.json --output ../../tests/output/tests-1-output.json```
 ```

## Docker
### Building

### Running