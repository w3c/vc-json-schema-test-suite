import fs from 'fs';
import path from 'path';

const jsonsInDir = fs.readdirSync('./').filter((file) => path.extname(file) === '.json');

export const implementations = jsonsInDir.map((file) => {
  const fileData = fs.readFileSync(path.join('./', file));
  return JSON.parse(fileData.toString());
});

export const JsonSchemaVersions = {
  202012: '2020-12',
  201909: '2019-09',
  Draft7: 'Draft-7',
};

export const VcJsonSchemaTypes = {
  JsonSchema: 'JsonSchema',
  JsonSchemaCredential: 'JsonSchemaCredential',
};

export const implementationsWhichSupportVersionAndType = (
    {
      impls = implementations,
      version,
      type,
    },
) => {
  const matchingImpls = [];
  for (const i of impls) {
    if (Object.keys(i.specs).includes(version) && i.specs[version].includes(type)) {
      matchingImpls.push(i);
    }
  }
  return matchingImpls;
};
