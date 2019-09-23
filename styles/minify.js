const cssnano = require('cssnano');

module.exports = ({ result, src, dest }) => {
  return cssnano.process(result.css, {
    map: {
      inline: false,
      prev: result.map.toString()
    },
    from: src,
    to: dest,
    save: true,
    autoprefixer: false
  }, {
    preset: ['default', {
      discardComments: { removeAll: true }
    }]
  });
};
