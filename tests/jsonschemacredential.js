import chai from 'chai';

import {
  implementationsWhichSupportVersionAndType, JsonSchemaVersions, VcJsonSchemaTypes,
} from '../implementations/index.js';
import {generateTestResult, checkTestResult, TestResult} from './testutil.js';

const schemaVersions = Object.keys(JsonSchemaVersions);
const should = chai.should();
const jsonSchemaType = VcJsonSchemaTypes.JsonSchemaCredential;
schemaVersions.forEach((schemaVersion) => {
  const schemaVersionName = JsonSchemaVersions[schemaVersion];
  describe(`JsonSchemaCredential – JSON Schema ${schemaVersionName}`, function() {
    const impls = implementationsWhichSupportVersionAndType(
        {version: schemaVersionName, type: jsonSchemaType});
    const implNames = impls.map((i) => i.name);
    this.matrix = true;
    this.report = true;
    this.implemented = [...implNames];
    this.rowLabel = 'Test Name';
    this.columnLabel = 'Implementation';

    // run tests for each impl
    for (const i of impls) {
      describe(i.name, function() {
        before(async function() {
          await generateTestResult(i.name, schemaVersionName, jsonSchemaType, this.test.title);
        });
        it('Smoke Test', async function() {
          this.test.cell = {columnId: i.name, rowId: this.test.title};
          const result = await checkTestResult(i.name, schemaVersionName, jsonSchemaType,
              this.test.title);
          should.equal(result, TestResult.success);
        });

        // it('2.1 ID - The value MUST be a URL that identifies the schema associated with the verifiable credential.', function() {
        // });
        //
        // it('2.1 The type property MUST be JsonSchemaCredential.', function() {
        // });
        //
        // it('2.2 The credentialSubject property MUST contain two properties: type - the value of which MUST be JsonSchema; jsonSchema - an object which contains a valid JSON Schema', function() {
        //
        // });
        //
        // it('3 Implementers MUST provide support for JSON Schema specifications where, in the following table, the required column\'s value is yes', function() {
        // });
        //
        // it('3.1.1 The $id MUST be present and its value MUST represent a valid URI-reference', function() {
        // });
        //
        // // NOTE: this also covers the normative guidance in 4 -- Schemas without a $schema property are not considered valid and MUST NOT be processed.
        // it('3.1.2, 4 The $schema property MUST be present in each schema', function() {
        // });
        //
        // it('4 Conformant implementers MUST support JSON Schema specification versions marked as required in the table defined', function() {
        // });
        //
        // it('4.2 (Success) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.', function() {
        //
        // });
        //
        // it('4.2 (Failure) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.', function() {
        //
        // });
        //
        // it('4.2 (Indeterminate) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate. ' +
        //             'Implementers MUST return this outcome when they encounter a schema whose version they do not support.', function() {
        //
        // });
      });
    }
  });
});
