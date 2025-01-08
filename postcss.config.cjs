// postcss.config.cjs
const removeCharset = require('./remove-charset.cjs');
const postcssImport = require('postcss-import');
// const postcssNesting = require('postcss-nesting');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    removeCharset(),
    postcssImport(),
//    postcssNesting(),
    tailwindcss(),
    autoprefixer(),
  ],
};

