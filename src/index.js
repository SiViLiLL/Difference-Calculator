import stylish from './formatters/stylish.js';
import plain from './formatters/plain.js';
import json from './formatters/json.js';
import { hasProp, isObj } from './utilits.js';
import getParsedContent from './parser.js';

const getDiff = (o1, o2) => Object.keys({ ...o1, ...o2 })
  .map((key) => {
    if (hasProp(o1, key) && hasProp(o2, key) && o1[key] === o2[key]) {
      return { key, status: 'not updated', val: o1[key] };
    }
    if (hasProp(o1, key) && hasProp(o2, key) && isObj(o1[key]) && isObj(o2[key])) {
      return { key, status: 'tree', children: getDiff(o1[key], o2[key]) };
    }
    if (hasProp(o1, key) && hasProp(o2, key)) {
      return {
        key, status: 'updated', val: o2[key], oldVal: o1[key],
      };
    }
    return hasProp(o1, key) ? { key, status: 'removed', val: o1[key] }
      : { key, status: 'added', val: o2[key] };
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
