package main

import (
	"flag"
	"fmt"
	"os"
)

const (
	JSONSchemaType           = "JsonSchema"
	JSONSchemaCredentialType = "JsonSchemaCredential"
)

func main() {
	if len(os.Args) < 3 {
		panic("must supply [format, schema, credential, output] arguments")
	}

	var schema, format, credential, output string

	createCmd := flag.NewFlagSet("validate", flag.ExitOnError)
	createCmd.StringVar(&format, "format", "", "schema format")
	createCmd.StringVar(&schema, "schema", "", "schema schema file")
	createCmd.StringVar(&credential, "credential", "", "credential schema file")
	createCmd.StringVar(&output, "output", "", "output file")

	switch os.Args[1] {
	case "validate":
		if err := createCmd.Parse(os.Args[2:]); err != nil {
			fmt.Printf("error running create: %s\n", err.Error())
			os.Exit(1)
		}
		fmt.Printf("flags parsed: format=%s, schema=%s, credential=%s, output=%s\n", format, schema, credential, output)
		validateFlags(format, schema, credential, output)
		if err := ValidateCredentialAgainstSchema(format, schema, credential, output); err != nil {
			fmt.Printf("error validating using schema %s: %s\n", schema, err.Error())
			os.Exit(1)
		}
		fmt.Println("credential validated; output written to file")
	default:
		fmt.Println("expected 'validate' command")
		os.Exit(1)
	}
}

func validateFlags(format, schema, credential, output string) {
	if format == "" {
		fmt.Println("no format specified")
		os.Exit(1)
	}
	if format != JSONSchemaType && format != JSONSchemaCredentialType {
		fmt.Println("invalid format specified")
		os.Exit(1)
	}
	if schema == "" {
		fmt.Println("no schema file specified")
		os.Exit(1)
	}
	if credential == "" {
		fmt.Println("no credential file specified")
		os.Exit(1)
	}
	if output == "" {
		fmt.Println("no output file specified")
	}
}
