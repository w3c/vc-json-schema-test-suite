import shell from 'shelljs';
import * as fs from 'fs';
import {containerNameForImplementation} from '../implementations/index.js';

/**
 * Generate test results for a given implementation by calling its docker container with specific inputs
 * @param{string} impl the implementation to test
 * @param{string} jsonSchemaVersion the version of JSON Schema to test
 * @param{string} jsonSchemaType the type (`JsonSchema` or `JsonSchemaCredential`) to test
 * @param{string} testNumber the test number to run
 * @return {Promise<void>} nothing
 */
export async function generateTestResult(impl, jsonSchemaVersion, jsonSchemaType, testNumber) {
  const schemaType = jsonSchemaType.toLowerCase();
  const containerName = containerNameForImplementation(impl);
  const schemaFile = `${testNumber}-schema.json`;
  const credentialFile = `${testNumber}-credential.json`;
  const outputFile = `${testNumber}-${impl}.json`;

  const command = `
IMPLEMENTATION=${containerName}
FORMAT=${schemaType}
SCHEMA=/tests/input/${schemaType}/${jsonSchemaVersion}/${schemaFile}
CREDENTIAL=/tests/input/${schemaType}/${jsonSchemaVersion}/${credentialFile}
OUTPUT=/tests/input/${schemaType}/${jsonSchemaVersion}/${outputFile}

docker-compose run -d $IMPLEMENTATION \
validate \
--format $FORMAT \
--schema $SCHEMA \
--credential $CREDENTIAL \
--output $OUTPUT
`;

  console.log(`${command}`);
  const {code, stdout} = shell.exec(command, {silent: true});
  if (code !== 0) {
    console.warn(stdout);
  }
}

export const TestResult = {
  Success: 'success',
  Failure: 'failure',
  Indeterminate: 'indeterminate',
  Error: 'error',
};

/**
 * Check the test results for a given implementation and return the result as one of {@link TestResult}
 * @param{string} impl the implementation to check
 * @param{string} jsonSchemaVersion the version of JSON Schema to lookup
 * @param{string} jsonSchemaType the type (`JsonSchema` or `JsonSchemaCredential`) to lookup
 * @param{string} testNumber the test number to check
 * @return {Promise<TestResult>} the test result as one of {@link TestResult} or {@link TestResult.Error} if the test result file could not be read
 */
export async function checkTestResult(impl, jsonSchemaVersion, jsonSchemaType, testNumber) {
  const schemaType = jsonSchemaType.toLowerCase();
  const outputFile = `/tests/output/${schemaType}/${jsonSchemaVersion}/${testNumber}-${impl}.json`;
  let jsonData;
  try {
    jsonData = fs.readFileSync(outputFile);
  } catch (err) {
    return TestResult.Error;
  }
  const data = JSON.parse(jsonData.toString());
  return TestResult[data.result] || TestResult.Error;
};
