const stylelint = require('stylelint');
const { resolve } = require('path');
// const stylestandard = require('stylelint-config-standard')

module.exports = stylelint({
  // configBasedir: resolve(__dirname, '../'),
  // extends: 'stylelint-config-standard',
  // only required when tool is npm link'ed
  extends: resolve(__dirname, '../node_modules/stylelint-config-standard'),
  // https://github.com/stylelint/stylelint/blob/master/docs/user-guide/example-config.md
  rules: {
    'block-opening-brace-space-before': null,
    'color-hex-length': null,
    'comment-empty-line-before': null,
    'declaration-empty-line-before': null,
    'max-empty-lines': 3,
    'no-descending-specificity': null,
    'no-eol-whitespace': [
      true,
      {
        ignore: ['empty-lines']
      }
    ],
    'number-leading-zero': null,
    'shorthand-property-no-redundant-values': null
  },
  ignoreFiles: ['node_modules/**']
});
