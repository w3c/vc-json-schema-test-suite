export const TestResult = {
  success: 'success',
  failure: 'failure',
  indeterminate: 'indeterminate',
  error: 'error',
};
export const JsonSchemaTestMapping = {
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

export const JsonSchemaCredentialTestMapping = {
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
      'cred_number': 1,
      'schema_number': 1,
      'description': 'credentialSubject contains type and jsonSchema properties',
      'expected_result': TestResult.success,
    },
    {
      'number': 6,
      'cred_number': 1,
      'schema_number': 3,
      'description': 'credentialSubject does not contain type property',
      'expected_result': TestResult.failure,
    },
    {
      'number': 7,
      'cred_number': 1,
      'schema_number': 4,
      'description': 'credentialSubject contains the wrong type property',
      'expected_result': TestResult.failure,
    },
    {
      'number': 8,
      'cred_number': 1,
      'schema_number': 5,
      'description': 'credentialSubject does not contain jsonSchema property',
      'expected_result': TestResult.failure,
    },
  ],
  '2.2 The value of the credentialSchema property MUST always be set to [known json schema]': [
    {
      'number': 9,
      'cred_number': 1,
      'schema_number': 1,
      'description': 'credentialSchema set to correct value',
      'expected_result': TestResult.success,
    },
    {
      'number': 10,
      'cred_number': 1,
      'schema_number': 6,
      'description': 'credentialSchema set to incorrect value',
      'expected_result': TestResult.failure,
    },
  ],
  '3.1.1 The $id MUST be present and its value MUST represent a valid URI-reference': [
    {
      'number': 11,
      'cred_number': 1,
      'schema_number': 1,
      'description': '$id is present and valid',
      'expected_result': TestResult.success,
    },
    {
      'number': 12,
      'cred_number': 1,
      'schema_number': 7,
      'description': '$id is not present',
      'expected_result': TestResult.failure,
    },
    {
      'number': 13,
      'cred_number': 1,
      'schema_number': 8,
      'description': '$id is not valid',
      'expected_result': TestResult.failure,
    },
  ],
  '3.1.2, 4 The $schema property MUST be present in each schema': [
    {
      'number': 14,
      'cred_number': 1,
      'schema_number': 1,
      'description': '$schema is present',
      'expected_result': TestResult.success,
    },
    {
      'number': 15,
      'cred_number': 1,
      'schema_number': 9,
      'description': '$schema is not present',
      'expected_result': TestResult.failure,
    },
  ],
  '4.2 (Success) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.': [
    {
      'number': 16,
      'cred_number': 1,
      'schema_number': 1,
      'description': 'Validation succeeds',
      'expected_result': TestResult.success,
    },
  ],
  '4.2 (Failure) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.': [
    {
      'number': 17,
      'cred_number': 1,
      'schema_number': 10,
      'description': 'Validation fails',
      'expected_result': TestResult.failure,
    },
  ],
  '4.2 (Indeterminate) Validation MUST result in one of the following three possible outcomes: success, failure, or indeterminate.': [
    {
      'number': 18,
      'cred_number': 1,
      'schema_number': 11,
      'description': 'Validation is indeterminate',
      'expected_result': TestResult.indeterminate,
    },
  ],
};
