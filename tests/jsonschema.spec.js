import {should} from 'chai';
import {
  implementationsWhichSupportVersionAndType, JsonSchemaVersions, VcJsonSchemaTypes,
} from '../implementations/index.js';
import {generateTestResult, checkTestResult, TestResult} from './testutil.js';

const schemaVersions = Object.keys(JsonSchemaVersions);
schemaVersions.forEach((schemaVersion) => {
  const schemaVersionName = JsonSchemaVersions[schemaVersion];
  describe(`JSON Schema ${schemaVersionName} - JsonSchema`, function() {
    const impls = implementationsWhichSupportVersionAndType(
        {version: schemaVersionName, type: VcJsonSchemaTypes.JsonSchema});
    const implNames = impls.map((i) => i.name);
    this.matrix = true;
    this.mreport = true;
    this.implemented = [...implNames];
    this.rowLabel = 'Test Name';
    this.columnLabel = 'Implementation';

    // run tests for each impl
    for (const i of impls) {
      describe(i.name, function() {
        it('1 - Passes sanity tests', async function() {
          await generateTestResult(i.name, schemaVersionName, VcJsonSchemaTypes.JsonSchema, '1');
          this.test.cell = {columnId: i.name, rowId: this.test.title};
          const result = await checkTestResult(i.name, schemaVersionName, VcJsonSchemaTypes.JsonSchema, '1');
          should().equal(result, TestResult.Success);
        });

        it('2.1 ID - The value MUST be a URL that identifies the schema associated with the verifiable credential.', function() {
        });

        it('2.1 The type property MUST be JsonSchema.', function() {
        });

        it('3 Implementers MUST provide support for JSON Schema specifications where, in the following table, the required column\'s value is yes', function() {
        });

        it('3.1.1 The $id MUST be present and its value MUST represent a valid URI-reference', function() {
        });

        // NOTE: this also covers the normative guidance in 4 -- Schemas without a $schema property are not considered valid and MUST NOT be processed.
        it('3.1.2, 4 The $schema property MUST be present in each schema', function() {
        });

        it('4 Conformant implementers MUST support JSON Schema specification versions marked as required in the table defined (2020-12)', function() {
        });

        it('4.1 Validation of the integrity of the schema MUST be done before evaluation.', function() {

        });

        it('4.2 (Success) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.', function() {

        });

        it('4.2 (Failure) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.', function() {

        });

        it('4.2 (Indeterminate) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate. ' +
            'Implementers MUST return this outcome when they encounter a schema whose version they do not support.', function() {

        });
      });
    }
  });
});


//
// describe('Matrix Test', function() {
//   // summaries are displayed in the SOTD section after the results
//   const summaries = new Set();
//   this.summary = summaries;
//   // when the report sees a suite with report true it includes it
//   this.report = true;
//   // this tells the reporter to use the matrix.hbs template to display the results
//   this.matrix = true;
//   // this gives the names of the implementations that are being tested
//   this.implemented = ['foo'];
//   // this gives the names of the implementations that are not being tested
//   this.notImplemented = ['bar'];
//   // this will give the row label in the matrix
//   this.rowLabel = 'Row';
//   // this is the column label in the matrix
//   this.columnLabel = 'Verifier';
//   // this is an array with items in the form {data: 'foo', detail: false, label: 'bar'}
//   const reportData = [];
//   // reportData is displayed as code examples
//   this.reportData = reportData;
//   // this is an array with items in the form {src: 'foo', meta: ['bar']}
//   // the images will be displayed with the meta under them
//   const images = [];
//   this.images = images;
//   it('should be a cell in the matrix', function() {
//     // this tells the reporter which column and row the test result
//     // should be placed in
//     this.test.cell = {columnId: 'foo', rowId: 'bar'};
//   });
//   after(function() {
//     summaries.add('Test specific summary data here');
//   });
// });
