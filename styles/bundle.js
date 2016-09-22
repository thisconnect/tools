const { dirname, join, relative } = require('path');
const { readFile } = require('fildes');
const stylelint = require('stylelint');
const postcss = require('postcss');
const importCSS = require('postcss-import');
const copyCSS = require('postcss-copy');
const pxtorem = require('postcss-pxtorem');
const cssnext = require('postcss-cssnext');
const reporter = require('postcss-reporter');
const { log } = require('./log.js');

const lint = stylelint({
  extends: 'stylelint-config-standard',
  rules: {
    'max-empty-lines': 2
  },
  ignoreFiles: ['node_modules/**']
});

module.exports = ({ input, output, assets = '../fonts' }) => {
  return readFile(input)
  .then(css => {
    return postcss([
      lint,
      importCSS({
        plugins: [lint],
        onImport: files => {
          files = files.map(file => relative(process.cwd(), file))
          log('IMPORTS', files)
        }
      }),
      copyCSS({
        src: ['node_modules'],
        dest: join(dirname(output), assets),
        template: '[name].[hash].[ext]',
        relativePath: (dir, fileMeta, result, opts) => {
          return dirname(result.opts.to);
        }
      }),
      pxtorem({
        rootValue: 16,
        unitPrecision: 4,
        replace: true,
        mediaQuery: true
      }),
      cssnext({
        browsers: [
          'android >= 4',
          'ios >= 8',
          'chrome >= 45', // 9
          'firefox >= 3.6',
          'ie >= 8'
        ],
        features: {
          rem: {
            rootValue: 16,
            unitPrecision: 4
          }
        }
      }),
      reporter()
    ])
    .process(css, {
      from: input,
      to: output,
      map: {
        inline: false
      }
    })
  })
}

module.exports.foo = 'bar'
