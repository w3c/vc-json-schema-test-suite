import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const requireDir = require('require-dir');
const dir = requireDir('./');
const implementations = Object.values(dir);

export const JsonSchemaVersions = {
  202012: '2020-12',
  201909: '2019-09',
  Draft7: 'Draft-7',
};

export const VcJsonSchemaTypes = {
  JsonSchema: 'JsonSchema',
  JsonSchemaCredential: 'JsonSchemaCredential',
};

export const implementationsWhichSupportVersionAndType = ({
  impls = implementations,
  version,
  type,
}) => {
  const matchingImpls = [];
  for (const i of impls) {
    if (Object.keys(i.specs).includes(version) && i.specs[version].includes(type)) {
      matchingImpls.push(i);
    }
  }
  return matchingImpls;
};
