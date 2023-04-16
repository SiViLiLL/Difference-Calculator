import stylish from './formatters/stylish.js';
import plain from './formatters/plain.js';
import json from './formatters/json.js';
import getParsedContent from './parser.js';
import getDiff from './getDiff.js';

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
