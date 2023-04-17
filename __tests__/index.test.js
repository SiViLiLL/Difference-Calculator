import { test, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import getDifference from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getAnswer = (answerFileName) => readFileSync(`${resolve(__dirname, '..', '__fixtures__', answerFileName)}`, { encoding: 'utf8', flag: 'r' });
const getPath = (fileName) => `${resolve(__dirname, '..', '__fixtures__', fileName)}`;

test('comparison of JSON & get stylish', () => {
  const firstPath = getPath('file1.json');
  const secondPath = getPath('file2.json');

  expect(getDifference(firstPath, secondPath, 'stylish')).toEqual(getAnswer('answerStylish.txt'));
  expect(getDifference(firstPath, secondPath)).toEqual(getAnswer('answerStylish.txt'));
});

test('comparsion of Yml & get stylish', () => {
  const firstPath = getPath('file1.yml');
  const secondPath = getPath('file2.yml');

  expect(getDifference(firstPath, secondPath, 'stylish')).toEqual(getAnswer('answerStylish.txt'));
  expect(getDifference(firstPath, secondPath)).toEqual(getAnswer('answerStylish.txt'));
});

test('comparison of JSON & get plain', () => {
  const firstPath = getPath('file1.json');
  const secondPath = getPath('file2.json');

  expect(getDifference(firstPath, secondPath, 'plain')).toEqual(getAnswer('answerPlain.txt'));
});

test('comparsion of Yml & get plain', () => {
  const firstPath = getPath('file1.yml');
  const secondPath = getPath('file2.yml');

  expect(getDifference(firstPath, secondPath, 'plain')).toEqual(getAnswer('answerPlain.txt'));
});

test('comparsion of JSON & get json', () => {
  const firstPath = getPath('file1.yml');
  const secondPath = getPath('file2.yml');

  expect(getDifference(firstPath, secondPath, 'json')).toEqual(getAnswer('answerJSON.json'));
});

test('comparsion of YML & get json', () => {
  const firstPath = getPath('file1.yml');
  const secondPath = getPath('file2.yml');

  expect(getDifference(firstPath, secondPath, 'json')).toEqual(getAnswer('answerJSON.json'));
});
