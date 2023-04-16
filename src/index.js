import stylish from './formatters/stylish.js';
import plain from './formatters/plain.js';
import json from './formatters/json.js';
import { hasProp, isObj } from './utilits.js';
import getParsedContent from './parser.js';

const getDiff = (obj1, obj2) => Object.keys({ ...obj1, ...obj2 })
  .map((key) => {
    if (hasProp(obj1, key) && hasProp(obj2, key) && obj1[key] === obj2[key]) {
      return { key, status: 'not updated', val: obj1[key] };
    }
    if (hasProp(obj1, key) && hasProp(obj2, key) && isObj(obj1[key]) && isObj(obj2[key])) {
      return { key, status: 'tree', children: getDiff(obj1[key], obj2[key]) };
    }
    if (hasProp(obj1, key) && hasProp(obj2, key)) {
      return {
        key, status: 'updated', val: obj2[key], oldVal: obj1[key],
      };
    }
    return hasProp(obj1, key) ? { key, status: 'removed', val: obj1[key] }
      : { key, status: 'added', val: obj2[key] };
  });

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
