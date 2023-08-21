import fs from 'fs';
import path from 'path';

const jsonsInDir = fs.readdirSync('./').filter(file => path.extname(file) === '.json');

const implementations = jsonsInDir.map(file => {
    const fileData = fs.readFileSync(path.join('./', file));
    return JSON.parse(fileData.toString());
});
