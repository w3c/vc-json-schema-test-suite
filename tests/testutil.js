import * as fs from 'fs';
import shell from 'shelljs';
import {JsonSchemaCredentialTestMapping, JsonSchemaTestMapping, TestResult} from './testmapping.js';

/**
 * Generate test results for a given implementation by calling its docker container with specific inputs
 * @param{string} impl the implementation to test
 * @param{string} jsonSchemaVersion the version of JSON Schema to test
 * @param{string} jsonSchemaType the type (`JsonSchema` or `JsonSchemaCredential`) to test
 * @param{string} testName the test name to run
 * @return {Promise<void>} nothing
 */
export async function generateTestResults(impl, jsonSchemaVersion, jsonSchemaType, testName) {
  const schemaType = jsonSchemaType.toLowerCase();
  const tests = () => {
    if (jsonSchemaType === 'JsonSchemaCredential') {
      return JsonSchemaCredentialTestMapping[testName];
    }
    return JsonSchemaTestMapping[testName];
  };

  for (const test of tests()) {
    const testNumber = test.number;
    const schemaFile = `${test.schema_number}-schema.json`;
    const credentialFile = `${test.cred_number}-credential.json`;
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
  await sleep(150); // Sleep for 150 milliseconds (0.15 seconds)
}

/**
 * Sleep for a given number of milliseconds
 * @param{int} ms the number of milliseconds to sleep
 * @return {Promise<unknown>}  nothing
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check the test results for a given implementation and return the result as one of {@link TestResult}
 * @param{string} impl the implementation to check
 * @param{string} jsonSchemaVersion the version of JSON Schema to lookup
 * @param{string} jsonSchemaType the type (`JsonSchema` or `JsonSchemaCredential`) to lookup
 * @param{string} testName the test name to check
 * @return {Promise<string>} the test result as one of {@link TestResult} or {@link TestResult.Error} if the test result file could not be read
 */
export async function checkTestResults(impl, jsonSchemaVersion, jsonSchemaType, testName) {
  const schemaType = jsonSchemaType.toLowerCase();
  const tests = () => {
    if (jsonSchemaType === 'JsonSchemaCredential') {
      return JsonSchemaCredentialTestMapping[testName];
    }
    return JsonSchemaTestMapping[testName];
  };

  for (const test of tests()) {
    const outputFile = `./tests/output/${schemaType}/${jsonSchemaVersion}/${test.number}-${impl}.json`;
    let jsonData;
    try {
      jsonData = await fs.readFileSync(outputFile);
    } catch (err) {
      console.log(`\nError reading test result: ${err}\n`);
      return TestResult.error;
    }
    const data = await JSON.parse(jsonData);
    if (TestResult[data.result] !== TestResult[test.expected_result]) {
      return TestResult.error;
    }
  }
  return TestResult.success;
}
