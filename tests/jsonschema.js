import chai from 'chai';

import {
  implementationsWhichSupportVersionAndType, JsonSchemaVersions, VcJsonSchemaTypes,
} from '../implementations/index.js';
import {generateTestResults, checkTestResults} from './testutil.js';
import {TestResult} from './testmapping.js';

const schemaVersions = Object.keys(JsonSchemaVersions);
const should = chai.should();
const jsonSchemaType = VcJsonSchemaTypes.JsonSchema;
schemaVersions.forEach((schemaVersion) => {
  const schemaVersionName = JsonSchemaVersions[schemaVersion];
  describe(`JsonSchema – JSON Schema ${schemaVersionName}`, function() {
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
      describe(i.name, async function() {
        it('2.1 ID - The value MUST be a URL that identifies the schema associated with the verifiable credential.', async function() {
          await generateTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          this.test.cell = {columnId: i.name, rowId: this.test.title};
          const result = await checkTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          should.equal(result, TestResult.success);
        });

        it('2.1 The type property MUST be JsonSchema.', async function() {
          await generateTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          this.test.cell = {columnId: i.name, rowId: this.test.title};
          const result = await checkTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          should.equal(result, TestResult.success);
        });

        it('3 Implementers MUST provide support for JSON Schema specifications where, in the following table, the required column\'s value is yes', function() {
          this.test.cell = {columnId: i.name, rowId: this.test.title};
          if (schemaVersionName === JsonSchemaVersions['202012']) {
            should.equal(true, true);
          } else {
            this.skip();
          }
        });

        it('3.1.1 The $id MUST be present and its value MUST represent a valid URI-reference', async function() {
          await generateTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          this.test.cell = {columnId: i.name, rowId: this.test.title};
          const result = await checkTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          should.equal(result, TestResult.success);
        });

        // NOTE: this also covers the normative guidance in 4 -- Schemas without a $schema property are not considered valid and MUST NOT be processed.
        it('3.1.2, 4 The $schema property MUST be present in each schema', async function() {
          await generateTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          this.test.cell = {columnId: i.name, rowId: this.test.title};
          const result = await checkTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          should.equal(result, TestResult.success);
        });

        it('4.2 (Success) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.', async function() {
          await generateTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          this.test.cell = {columnId: i.name, rowId: this.test.title};
          const result = await checkTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          should.equal(result, TestResult.success);
        });

        it('4.2 (Failure) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.', async function() {
          await generateTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          this.test.cell = {columnId: i.name, rowId: this.test.title};
          const result = await checkTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          should.equal(result, TestResult.success);
        });

        it('4.2 (Indeterminate) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.', async function() {
          await generateTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          this.test.cell = {columnId: i.name, rowId: this.test.title};
          const result = await checkTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          should.equal(result, TestResult.success);
        });
      });
    }
  });
});
