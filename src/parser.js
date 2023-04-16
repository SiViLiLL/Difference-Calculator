import yaml from 'js-yaml';
import { readFileSync } from 'node:fs';
import { cwd } from 'node:process';
import path, { resolve } from 'node:path';

const getContent = (filePath) => readFileSync(`${resolve(cwd(), `${filePath}`)}`, { encoding: 'utf8', flag: 'r' });

export default (filePath) => {
  const extName = path.extname(path.basename(filePath));

  switch (extName) {
    case '.json':
      return JSON.parse(getContent(filePath));
    case '.yml':
    case '.yaml':
      return yaml.load(getContent(filePath));
    default:
      throw new Error('This extension isn\'t supported');
  }
};
