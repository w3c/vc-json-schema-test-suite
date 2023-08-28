package main

import (
	"encoding/json"
	"os"

	"github.com/TBD54566975/ssi-sdk/credential"
	"github.com/TBD54566975/ssi-sdk/credential/schema"
	"github.com/pkg/errors"
)

func getCredentialFromFile(filePath string) (*credential.VerifiableCredential, error) {
	bytes, err := os.ReadFile(filePath)
	if err != nil {
		return nil, errors.Wrapf(err, "could not read credential from file: %s", filePath)
	}
	var cred credential.VerifiableCredential
	if err = json.Unmarshal(bytes, &cred); err != nil {
		return nil, errors.Wrap(err, "could not unmarshal credential")
	}
	return &cred, nil
}

func getSchemaFromFile(format, filePath string) (*schema.VCJSONSchema, error) {
	var s schema.VCJSONSchema
	bytes, err := os.ReadFile(filePath)
	if err != nil {
		return nil, errors.Wrapf(err, "could not read vp from file: %s", filePath)
	}
	if err = json.Unmarshal(bytes, &s); err != nil {
		return nil, errors.Wrap(err, "could not unmarshal schema")
	}
	return &s, nil
}

func writeValidationResult(result ValidationResult, filePath string) error {
	data, err := json.MarshalIndent(validationResult{Result: result}, "", "    ")
	if err != nil {
		return err
	}
	return writeOutputToFile(data, filePath)
}

type ValidationResult string

const (
	Success       ValidationResult = "success"
	Failure       ValidationResult = "failure"
	Indeterminate ValidationResult = "indeterminate"
)

type validationResult struct {
	Result ValidationResult `json:"result"`
}

func writeOutputToFile(data []byte, filePath string) error {
	if err := os.WriteFile(filePath, data, 0755); err != nil {
		return errors.Wrapf(err, "could not write %d bytes to file: %s", len(data), filePath)
	}
	return nil
}
