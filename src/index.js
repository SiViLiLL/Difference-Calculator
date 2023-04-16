import { readFileSync } from 'node:fs';
import { cwd } from 'node:process';
import path, { resolve } from 'node:path';
import yaml from 'js-yaml';

import stylish from './formatters/stylish.js';
import plain from './formatters/plain.js';
import json from './formatters/json.js';
import { hasProp, isObj } from './utilits.js';

const getContent = (filePath) => readFileSync(`${resolve(cwd(), `${filePath}`)}`, { encoding: 'utf8', flag: 'r' });

const getParsedContent = (filePath) => {
  const fileExt = path.extname(path.basename(filePath));

  switch (fileExt) {
    case '.json':
      return JSON.parse(getContent(filePath));
    case '.yml':
    case '.yaml':
      return yaml.load(getContent(filePath));
    default:
      return 'lol gg';
  }
};

const getDiff = (o1, o2) => Object.keys({ ...o1, ...o2 })
  .reduce((acc, key) => {
    if (hasProp(o1, key) && hasProp(o2, key) && o1[key] === o2[key]) {
      return [...acc, { key, status: 'not updated', val: o1[key] }];
    }
    if (hasProp(o1, key) && hasProp(o2, key) && isObj(o1[key]) && isObj(o2[key])) {
      return [...acc, { key, status: 'tree', children: getDiff(o1[key], o2[key]) }];
    }
    if (hasProp(o1, key) && hasProp(o2, key)) {
      return [...acc, {
        key, status: 'updated', val: o2[key], oldVal: o1[key],
      }];
    }
    return hasProp(o1, key) ? [...acc, { key, status: 'removed', val: o1[key] }]
      : [...acc, { key, status: 'added', val: o2[key] }];
  }, []);

const getFormattedDiff = (format, diff) => {
  switch (format) {
    case 'plain':
      return plain(diff);
    case 'json':
      return json(diff);
    default:
      return stylish(diff);
  }
};

export default (firstPath, secondPath, format = 'stylish') => {
  const firstFileContent = getParsedContent(firstPath);
  const secondFileContent = getParsedContent(secondPath);
  const diff = getDiff(firstFileContent, secondFileContent);

  return getFormattedDiff(format, diff);
};
