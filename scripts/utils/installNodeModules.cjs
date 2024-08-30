const path = require('path');
const exists = require('fs').existsSync;
const exec = require('child_process').execSync;

const logger = require('./logger.cjs');

module.exports = async function installNodeModules(capsPackPath) {
  const packageJsonPath = path.join(capsPackPath, 'package.json');

  if (!exists(packageJsonPath)) {
    return;
  }

  const cwd = capsPackPath;

  logger.debug(`Installing node modules: ${cwd}`);

  const cleanInstallResponse = await exec('npm ci', { cwd });

  logger.debug(
    `Npm install output: ${formatObjectToLog(cleanInstallResponse)}`,
  );
};

function formatObjectToLog(data) {
  return data.toString();
}
