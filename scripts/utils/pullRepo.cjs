const path = require('path');
const fs = require('fs').promises;
const exists = require('fs').existsSync;
const exec = require('child_process').execSync;

const logger = require('./logger.cjs');

const tmpDir = '.tmp';
const targetDir = 'caps-packs-repo';

module.exports = async function pullRepo(repoUrl, branchName) {
  const tmpDirPath = path.join(process.cwd(), tmpDir);

  if (!exists(tmpDirPath)) {
    await fs.mkdir(tmpDirPath);
  }

  const repoDirPath = path.join(tmpDirPath, targetDir);

  if (!exists(repoDirPath)) {
    logger.debug(`Cloning repo: ${repoUrl}`);

    const cloneResponse = await exec(`git clone ${repoUrl} ${targetDir}`, {
      cwd: tmpDirPath,
    });

    logger.debug(`Git clone output: ${formatObjectToLog(cloneResponse)}`);
  }

  const cwd = repoDirPath;

  logger.debug(`Working directory: ${cwd}`);

  // Hardwired... To Self-Destruct
  const resetResponse = await exec('git reset --hard', { cwd });

  logger.debug(`Git reset output: ${formatObjectToLog(resetResponse)}`);

  const fetchResponse = await exec('git fetch --all', { cwd });

  logger.debug(`Git Fetch output: ${formatObjectToLog(fetchResponse)}`);

  const checkoutResponse = await exec(`git checkout ${branchName}`, {
    cwd,
  });

  logger.debug(`Git checkout output: ${formatObjectToLog(checkoutResponse)}`);

  const pullResponse = await exec(`git pull origin ${branchName}`, { cwd });

  logger.debug(`Git pull output ${formatObjectToLog(pullResponse)}`);

  logger.debug('\n');
};

function formatObjectToLog(data) {
  return JSON.stringify(data.toString());
}
