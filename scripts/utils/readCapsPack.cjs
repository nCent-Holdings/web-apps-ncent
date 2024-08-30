const path = require('path');

module.exports = async function readCapsPack(capsPackPath) {
  const metadataPath = path.join(capsPackPath, 'metadata.json');

  const metadata = await require(metadataPath);
  const pack = metadata['darwin/caps'].pack || {};

  return pack;
};
