const { dirname, resolve } = require('path');
const { readFile } = require('fildes');
const postcss = require('postcss');
const importCSS = require('postcss-import');
const copyCSS = require('postcss-copy');
const pxtorem = require('postcss-pxtorem');
const presetEnv = require('postcss-preset-env');
const reporter = require('postcss-reporter');
const lint = require('./lint.js');
const { log } = require('../log/index.js');

module.exports = ({
  src,
  dest,
  // assets = './',
  fonts = './',
  fontsExt = /eot|ttf|woff|woff2/i,
  fontSrcs = [
    {
      fullName: 'fontawesome-webfont.svg',
      path: 'font-awesome/fonts'
    }
  ],
  map = {
    inline: false
  }
}) => {
  const fromFontSrc = fontSrcs.map(c => {
    return Object.assign({ keys: Object.keys(c) }, c);
  });

  const isFontSrc = meta => {
    return fromFontSrc.some(c => {
      return c.keys.every(key => {
        return c[key] == meta[key];
      });
    });
  };

  return readFile(src).then(css => {
    return postcss([
      lint,
      importCSS({
        plugins: [lint],
        onImport: files => {
          log('IMPORTS', files);
        }
      }),
      copyCSS({
        // fonts
        src: ['node_modules', dirname(src)],
        dest: resolve(dirname(dest), fonts),
        template: '[name].[hash].[ext][query]',
        ignore: meta => {
          if (isFontSrc(meta)) {
            return false;
          }
          return !fontsExt.test(meta.ext);
        },
        relativePath: (dir, meta, result) => {
          return dirname(result.opts.to);
        } /*,
        transform: meta => {
          console.log(`transform ${meta.sourceValue}`)
          return Promise.resolve(meta)
        }*/
      }),
      pxtorem({
        rootValue: 16,
        unitPrecision: 4,
        replace: true,
        mediaQuery: true
      }),
      presetEnv({
        stage: 0,
        browsers: [
          'android >= 4',
          'ios >= 8',
          'chrome >= 45', // 9
          'firefox >= 3.6',
          'ie >= 11'
        ]
      }),
      reporter()
    ]).process(css, {
      from: src,
      to: dest,
      map
    });
  });
};
