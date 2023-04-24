import { readFileSync } from 'node:fs';
import { cwd } from 'node:process';
import path, { resolve } from 'node:path';
import getParsedContent from './parser.js';
import getFormattedData from './formatters/index.js';

const getContent = (filePath) => readFileSync(`${resolve(cwd(), `${filePath}`)}`, { encoding: 'utf8', flag: 'r' });
const getExtName = (filePath) => path.extname(path.basename(filePath));

export default (firstPath, secondPath, format = 'stylish') => {
  const firstFileContent = getContent(firstPath);
  const secondFileContent = getContent(secondPath);
  const firstFileDataFormat = getExtName(firstPath);
  const secondFileDataFormat = getExtName(secondPath);
  const firstFileParsedContent = getParsedContent(firstFileContent, firstFileDataFormat);
  const secondFileParsedContent = getParsedContent(secondFileContent, secondFileDataFormat);

  return getFormattedData(firstFileParsedContent, secondFileParsedContent, format);
};
