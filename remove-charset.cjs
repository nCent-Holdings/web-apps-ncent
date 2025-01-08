// remove-charset.js

/**
 * A tiny PostCSS plugin that removes all @charset statements.
 */
module.exports = function removeCharset() {
  return {
    postcssPlugin: 'remove-charset',
    AtRule(atRule) {
      if (atRule.name === 'charset') {
        atRule.remove();
      }
    },
  };
};

module.exports.postcss = true;

