const exec = require('child_process').execSync;

module.exports = async function prettier(outputPath) {
  await exec(`npx prettier ${outputPath} --write ${outputPath}`);
};
