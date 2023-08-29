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
export async function generateTestResults(impl, jsonSchemaVersion, jsonSchemaType, testName) {
  const schemaType = jsonSchemaType.toLowerCase();
  const tests = () => {
    if (jsonSchemaType === 'JsonSchemaCredential') {
      return jsonSchemaCredentialTestMapping[testName];
    }
    return jsonSchemaTestMapping[testName];
  };

  for (const test of tests) {
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
  await sleep(300); // Sleep for 300 milliseconds (0.3 seconds)
}

/**
 * Sleep for a given number of milliseconds
 * @param{int} ms the number of milliseconds to sleep
 * @return {Promise<unknown>}  nothing
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
export async function checkTestResults(impl, jsonSchemaVersion, jsonSchemaType, testName) {
  const schemaType = jsonSchemaType.toLowerCase();
  const tests = () => {
    if (jsonSchemaType === 'JsonSchemaCredential') {
      return jsonSchemaCredentialTestMapping[testName];
    }
    return jsonSchemaTestMapping[testName];
  };

  for (const test of tests) {
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

const jsonSchemaTestMapping = {
  '2.1 ID - The value MUST be a URL that identifies the schema associated with the verifiable credential.': [
    {
      'number': 1,
      'cred_number': 1,
      'schema_number': 1,
      'description': 'URL identifies associated schema',
      'expected_result': TestResult.success,
    },
    {
      'number': 2,
      'cred_number': 1,
      'schema_number': 2,
      'description': 'URL does not identify associated schema',
      'expected_result': TestResult.failure,
    },
  ],
  '2.1 The type property MUST be JsonSchema.': [
    {
      'number': 3,
      'cred_number': 1,
      'schema_number': 1,
      'description': 'type property is JsonSchema',
      'expected_result': TestResult.success,
    },
    {
      'number': 4,
      'cred_number': 2,
      'schema_number': 1,
      'description': 'type property is not JsonSchema',
      'expected_result': TestResult.failure,
    },
  ],
  '2.2 The credentialSubject property MUST contain two properties: type - the value of which MUST be JsonSchema; jsonSchema - an object which contains a valid JSON Schema': [
    {
      'number': 5,
      'description': 'credentialSubject contains type and jsonSchema properties',
      'expected_result': TestResult.success,
    },
    {
      'number': 6,
      'description': 'credentialSubject does not contain type property',
      'expected_result': TestResult.failure,
    },
    {
      'number': 7,
      'description': 'credentialSubject does not contain jsonSchema property',
      'expected_result': TestResult.failure,
    },
  ],
  '3.1.1 The $id MUST be present and its value MUST represent a valid URI-reference': [
    {
      'number': 8,
      'cred_number': 1,
      'schema_number': 1,
      'description': '$id is present and valid',
      'expected_result': TestResult.success,
    },
    {
      'number': 9,
      'cred_number': 1,
      'schema_number': 3,
      'description': '$id is not present',
      'expected_result': TestResult.failure,
    },
    {
      'number': 10,
      'cred_number': 1,
      'schema_number': 4,
      'description': '$id is not valid',
      'expected_result': TestResult.failure,
    },
  ],
  '3.1.2, 4 The $schema property MUST be present in each schema': [
    {
      'number': 11,
      'cred_number': 1,
      'schema_number': 1,
      'description': '$schema is present',
      'expected_result': TestResult.success,
    },
    {
      'number': 12,
      'cred_number': 1,
      'schema_number': 5,
      'description': '$schema is not present',
      'expected_result': TestResult.failure,
    },
  ],
  '4.2 (Success) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.': [
    {
      'number': 13,
      'cred_number': 1,
      'schema_number': 1,
      'description': 'Validation succeeds',
      'expected_result': TestResult.success,
    },
  ],
  '4.2 (Failure) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.': [
    {
      'number': 14,
      'cred_number': 1,
      'schema_number': 6,
      'description': 'Validation fails',
      'expected_result': TestResult.failure,
    },
  ],
  '4.2 (Indeterminate) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.': [
    {
      'number': 15,
      'cred_number': 1,
      'schema_number': 7,
      'description': 'Validation is indeterminate',
      'expected_result': TestResult.indeterminate,
    },
  ],
};

const jsonSchemaCredentialTestMapping = {
  '2.1 ID - The value MUST be a URL that identifies the schema associated with the verifiable credential.': [
    {
      'number': 1,
      'cred_number': 1,
      'schema_number': 1,
      'description': 'URL identifies associated schema',
      'expected_result': TestResult.success,
    },
    {
      'number': 2,
      'cred_number': 1,
      'schema_number': 2,
      'description': 'URL does not identify associated schema',
      'expected_result': TestResult.failure,
    },
  ],
  '2.1 The type property MUST be JsonSchemaCredential.': [
    {
      'number': 3,
      'cred_number': 1,
      'schema_number': 1,
      'description': 'type property is JsonSchemaCredential',
      'expected_result': TestResult.success,
    },
    {
      'number': 4,
      'cred_number': 2,
      'schema_number': 1,
      'description': 'type property is not JsonSchemaCredential',
      'expected_result': TestResult.failure,
    },
  ],
  '2.2 The credentialSubject property MUST contain two properties: type - the value of which MUST be JsonSchema; jsonSchema - an object which contains a valid JSON Schema': [
    {
      'number': 5,
      'description': 'credentialSubject contains type and jsonSchema properties',
      'expected_result': TestResult.success,
    },
    {
      'number': 6,
      'description': 'credentialSubject does not contain type property',
      'expected_result': TestResult.failure,
    },
    {
      'number': 7,
      'description': 'credentialSubject does not contain jsonSchema property',
      'expected_result': TestResult.failure,
    },
  ],
  '3.1.1 The $id MUST be present and its value MUST represent a valid URI-reference': [
    {
      'number': 8,
      'cred_number': 1,
      'schema_number': 1,
      'description': '$id is present and valid',
      'expected_result': TestResult.success,
    },
    {
      'number': 9,
      'cred_number': 1,
      'schema_number': 3,
      'description': '$id is not present',
      'expected_result': TestResult.failure,
    },
    {
      'number': 10,
      'cred_number': 1,
      'schema_number': 4,
      'description': '$id is not valid',
      'expected_result': TestResult.failure,
    },
  ],
  '3.1.2, 4 The $schema property MUST be present in each schema': [
    {
      'number': 11,
      'cred_number': 1,
      'schema_number': 1,
      'description': '$schema is present',
      'expected_result': TestResult.success,
    },
    {
      'number': 12,
      'cred_number': 1,
      'schema_number': 5,
      'description': '$schema is not present',
      'expected_result': TestResult.failure,
    },
  ],
  '4.2 (Success) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.': [
    {
      'number': 13,
      'cred_number': 1,
      'schema_number': 1,
      'description': 'Validation succeeds',
      'expected_result': TestResult.success,
    },
  ],
  '4.2 (Failure) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.': [
    {
      'number': 14,
      'cred_number': 1,
      'schema_number': 6,
      'description': 'Validation fails',
      'expected_result': TestResult.failure,
    },
  ],
  '4.2 (Indeterminate) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.': [
    {
      'number': 15,
      'cred_number': 1,
      'schema_number': 7,
      'description': 'Validation is indeterminate',
      'expected_result': TestResult.indeterminate,
    },
  ],
};
