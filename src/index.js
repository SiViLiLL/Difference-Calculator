import getParsedContent from './parser.js';
import getFormattedData from './formatters/index.js';

export default (firstPath, secondPath, format = 'stylish') => {
  const firstFileContent = getParsedContent(firstPath);
  const secondFileContent = getParsedContent(secondPath);

  return getFormattedData(firstFileContent, secondFileContent, format);
};
