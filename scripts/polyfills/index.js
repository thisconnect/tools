const bundle = require('../bundle.js');
const { resolve } = require('path');

module.exports = ({ dest }) => {
  return bundle({
    src: resolve(__dirname, './all.js'),
    dest,
    libs: true,
    format: 'iife',
    context: 'window'
  });
};
