#!/usr/bin/env node
import { Command, Option } from 'commander';
import getAnswer from '../src/index.js';

const program = new Command();

program
  .version('0.0.1')
  .helpOption('-h, --help', 'output usage information')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .addOption(new Option('-f, --format <type>', 'output format').default('stylish', 'stylish'))
  .action((firstPath, secondPath) => (
    console.log(getAnswer(firstPath, secondPath, program.opts().format))
  ))
  .parse();
