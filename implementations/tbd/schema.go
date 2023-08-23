package main

import (
	"net/url"

	schemalib "github.com/TBD54566975/ssi-sdk/credential/schema"
)

func ValidateCredentialAgainstSchema(format, schema, credential, output string) error {
	cred, err := getCredentialFromFile(credential)
	if err != nil {
		return err
	}
	s, err := getSchemaFromFile(format, schema)
	if err != nil {
		return err
	}
	schemaVal := *s

	schemaID, ok := schemaVal["$id"].(string)
	if !ok {
		//  The $id MUST be present ...
		return writeValidationResult(Failure, output)
	}
	if !isValidURI(schemaID) {
		// and its value MUST represent a valid URI-reference
		return writeValidationResult(Failure, output)
	}

	// This property MUST be present in each schema
	schemaVersion, ok := schemaVal["$schema"].(string)
	if !ok {
		return writeValidationResult(Failure, output)
	}

	// Implementers MUST return this outcome when they encounter a schema whose version they do not support.
	if !schemalib.IsSupportedJSONSchemaVersion(schemaVersion) {
		return writeValidationResult(Indeterminate, output)
	}

	if err = schemalib.IsCredentialValidForJSONSchema(*cred, *s); err != nil {
		return writeValidationResult(Failure, output)
	}

	return writeValidationResult(Success, output)
}

func isValidURI(input string) bool {
	_, err := url.ParseRequestURI(input)
	return err == nil
}
