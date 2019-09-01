const toIco = require('to-ico');
const autocrop = require('./crop.js');

module.exports = (buffer, options = {}) => {
  const { crop = true, resize = true } = options;

  return Promise.resolve()
    .then(() => (crop ? autocrop(buffer) : buffer))
    .then(buf => toIco(buf, { resize, sizes: [16] }));
};
