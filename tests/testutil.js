import * as fs from 'fs';
import shell from 'shelljs';

/**
 * Generate test results for a given implementation by calling its docker container with specific inputs
 * @param{string} impl the implementation to test
 * @param{string} jsonSchemaVersion the version of JSON Schema to test
 * @param{string} jsonSchemaType the type (`JsonSchema` or `JsonSchemaCredential`) to test
 * @param{string} testName the test name to run
 * @return {Promise<void>} nothing
 */
export async function generateTestResult(impl, jsonSchemaVersion, jsonSchemaType, testName) {
  const schemaType = jsonSchemaType.toLowerCase();
  const testNumber = testMapping[testName];
  const schemaFile = `${testNumber}-schema.json`;
  const credentialFile = `${testNumber}-credential.json`;
  const outputFile = `${testNumber}-${impl}.json`;

  const command = `
docker-compose -f ./implementations/docker-compose.yml \
run -d ${impl} \
validate \
--format ${jsonSchemaType} \
--schema /tests/input/${schemaType}/${jsonSchemaVersion}/${schemaFile} \
--credential /tests/input/${schemaType}/${jsonSchemaVersion}/${credentialFile} \
--output /tests/output/${schemaType}/${jsonSchemaVersion}/${outputFile}
`;

  console.log(`${command}`);
  const {code, stdout} = await shell.exec(command, {silent: false});
  if (code !== 0) {
    console.warn(stdout);
  }
}

export const TestResult = {
  success: 'success',
  failure: 'failure',
  indeterminate: 'indeterminate',
  error: 'error',
};

/**
 * Check the test results for a given implementation and return the result as one of {@link TestResult}
 * @param{string} impl the implementation to check
 * @param{string} jsonSchemaVersion the version of JSON Schema to lookup
 * @param{string} jsonSchemaType the type (`JsonSchema` or `JsonSchemaCredential`) to lookup
 * @param{string} testName the test name to check
 * @return {Promise<string>} the test result as one of {@link TestResult} or {@link TestResult.Error} if the test result file could not be read
 */
export async function checkTestResult(impl, jsonSchemaVersion, jsonSchemaType, testName) {
  const schemaType = jsonSchemaType.toLowerCase();
  const testNumber = testMapping[testName];
  const outputFile = `./tests/output/${schemaType}/${jsonSchemaVersion}/${testNumber}-${impl}.json`;
  let jsonData;
  try {
    jsonData = await fs.readFileSync(outputFile);
  } catch (err) {
    console.log(`\nError reading test result: ${err}\n`);
    return TestResult.error;
  }
  const data = await JSON.parse(jsonData);
  return TestResult[data.result] || TestResult.error;
}

const testMapping = {
  'Smoke Test': 1,
  '2.1 ID - The value MUST be a URL that identifies the schema associated with the verifiable credential.': 2,
  '2.1 The type property MUST be JsonSchema.': 3,
  '2.1 The type property MUST be JsonSchemaCredential.': 4,
  '2.2 The credentialSubject property MUST contain two properties: type - the value of which MUST be JsonSchema; jsonSchema - an object which contains a valid JSON Schema': 5,
  '3 Implementers MUST provide support for JSON Schema specifications where, in the following table, the required column\'s value is yes': 6,
  '3.1.1 The $id MUST be present and its value MUST represent a valid URI-reference': 7,
  '3.1.2, 4 The $schema property MUST be present in each schema': 8,
  '4 Conformant implementers MUST support JSON Schema specification versions marked as required in the table defined': 9,
  '4.2 (Success) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.': 10,
  '4.2 (Failure) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.': 11,
  '4.2 (Indeterminate) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.': 12,
};
