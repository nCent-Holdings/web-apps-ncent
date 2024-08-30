#!/usr/bin/env node
const { Command } = require('commander');
const generateTypes = require('./generateTypes.cjs');

const program = new Command();

const defaults = {
  repoUrl: 'git@github.com:Delos-tech/caps-packs.git',
  branch: 'main',
  verbose: 'info',
  outputPath: 'src/api-types',
};

program
  .description('CLI to generate typescript interfaces based on caps-packs repo')
  .argument('<caps-pack>', 'Name of capabilities pack to generate types from')
  .option('-o, --output <outputPath>', 'Path to folder where to place generated files', defaults.outputPath)
  .option('-r, --repo <repoUrl>', 'A repo url to pull capabilities from', defaults.repoUrl)
  .option('-b, --branch <branch>', 'A branch in given repo to pull capabilities from', defaults.branch)
  .option('-v, --verbose', 'Log level', defaults.verbose)
  .action(generateTypes);

program.parse();
