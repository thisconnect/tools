const { relative } = require('path');
const { writeFile } = require('fildes');
const bundle = require('./bundle');
const minifyStyles = require('./minify');
const { size } = require('../log/index');

module.exports = ({ src, dest, assets, fonts, minify = true }) => {
  return bundle({ src, dest, assets, fonts }).then(result => {
    return Promise.all([
      writeFile(dest, result.css),
      writeFile(dest + '.map', result.map)
    ]).then(() => {
      if (!minify) {
        return Promise.resolve(result.css);
      }
      const destmin = dest.replace(/\.css$/, '.min.css');
      return minifyStyles({ result, src: dest, dest: destmin }).then(min => {
        return Promise.all([
          writeFile(destmin, min.css),
          writeFile(destmin + '.map', min.map)
        ])
          .then(() => {
            size({
              title: relative(process.cwd(), dest),
              results: {
                Bundle: result.css,
                minified: min.css
              }
            });
          })
          .then(() => min.css);
      });
    });
  });
};
