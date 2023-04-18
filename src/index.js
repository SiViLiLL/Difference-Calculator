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
  const firstFileExt = getExtName(firstPath);
  const secondFileExt = getExtName(secondPath);
  const firstFileParsedContent = getParsedContent(firstFileExt)(firstFileContent);
  const secondFileParsedContent = getParsedContent(secondFileExt)(secondFileContent);

  return getFormattedData(firstFileParsedContent, secondFileParsedContent, format);
};
