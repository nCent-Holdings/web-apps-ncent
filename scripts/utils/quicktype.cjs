const path = require('path');
const fs = require('fs').promises;
const { quicktype, InputData, jsonInputForTargetLanguage } = require('quicktype-core');

const targetLanguage = 'ts';
const eslintComment = `
/* eslint-disable @typescript-eslint/no-empty-interface */
`;

const dontEditComment = `
/**
* DON'T EDIT THIS FILE!
* It's auto-generated from caps-packs repo
*/

`;

module.exports = async function runQuicktype(pack, capsPackPath, outputPath) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);

  for (const [capabilityName, capabilityFile] of Object.entries(pack)) {
    const capabilityPath = path.join(capsPackPath, capabilityFile);

    const capability = require(capabilityPath);
    const capabilityState = capability.state || {};

    await jsonInput.addSource({
      name: capabilityName,
      samples: [JSON.stringify(capabilityState)],
    });
  }

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const { lines } = await quicktype({
    inputData,
    lang: targetLanguage,
    fixedTopLevels: true,
  });

  await fs.rm(outputPath, { force: true });

  await fs.appendFile(outputPath, eslintComment);
  await fs.appendFile(outputPath, dontEditComment);

  for (const line of lines) {
    if (line.startsWith('//')) {
      continue;
    }

    if (line.startsWith('export class Convert {')) {
      break;
    }

    await fs.appendFile(outputPath, line);
    await fs.appendFile(outputPath, '\n');
  }
};
