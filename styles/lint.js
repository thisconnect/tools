const stylelint = require('stylelint')
// const { resolve } = require('path')
// const stylestandard = require('stylelint-config-standard')

module.exports = stylelint({
  // only required in DEV mode when tool is npm link'ed
  // configBasedir: resolve(__dirname, '../'),
  extends: 'stylelint-config-standard',
  rules: {
    'max-empty-lines': 3,
    'declaration-empty-line-before': null,
    'comment-empty-line-before': null,
    'no-eol-whitespace': [true, {
      ignore: ['empty-lines']
    }],
    'block-opening-brace-space-before': null,
    'number-leading-zero': null,
    'shorthand-property-no-redundant-values': null
  },
  ignoreFiles: ['node_modules/*', 'node_modules/**']
})
