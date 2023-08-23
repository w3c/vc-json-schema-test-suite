import shell from 'shelljs';

// function that calls a docker container with a set input file and describes and output location
import {containerNameForImplementation} from '../implementations/index.js';

const ignoreImplementations = ['sample'];

const dockerCall = ({inputFile, implName}) => {
  const containerName = containerNameForImplementation(implName);

  const command = `
CONTAINER=${containerName}
INPUT=/tests/input/${inputFile}
OUTPUT=/tests/output/$IMPLEMENTATION/output-${inputFile}.json

docker-compose run -d $CONTAINER \
vcjsonschema \
--input $INPUT \
--output $OUTPUT
`;

  console.log(`${command}`);
  const {code, stdout} = shell.exec(command, {silent: true});
  if (code !== 0) {
    console.warn(stdout);
  }
};
