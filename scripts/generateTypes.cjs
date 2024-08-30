const path = require('path');

const logger = require('./utils/logger.cjs');
const pullRepo = require('./utils/pullRepo.cjs');
const installNodeModules = require('./utils/installNodeModules.cjs');
const readCapsPack = require('./utils/readCapsPack.cjs');
const quicktype = require('./utils/quicktype.cjs');
const prettier = require('./utils/prettier.cjs');

const capsPath = '.tmp/caps-packs-repo/caps-packs';

global.BaseCapability = class BaseCapability {};

module.exports = async (capsPackName, options) => {
  logger.setLevel(options.verbose);

  logger.info('Running gen-types script');

  const capsPackPath = path.join(process.cwd(), capsPath, capsPackName);
  const outputPath = path.join(process.cwd(), options.output, `${capsPackName}.ts`);

  logger.verbose('Pull capabilities repo');
  logger.log('Repo:\t', options.repo);
  logger.log('Branch:\t', options.branch, '\n');
  await pullRepo(options.repo, options.branch);
  logger.verbose('Done.');

  logger.verbose('Install node modules');
  logger.log(capsPackPath);
  await installNodeModules(capsPackPath);
  logger.verbose('Done.');

  logger.verbose('Generate types for caps pack');
  const pack = await readCapsPack(capsPackPath);
  await quicktype(pack, capsPackPath, outputPath);
  await prettier(outputPath);
  logger.verbose('Done.');

  logger.success('Success!');
};
