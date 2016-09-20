const { join } = require('path')
const test = require('tape')
const files = require('fildes-extra')
const buildCSS = require('../')

test('cleanup', t => {
  files.rm(join(__dirname, 'imports'))
  .then(() => t.end())
  .catch(err => t.fail(err))
})

test('imports', t => {
  buildCSS({
    input: join(__dirname, 'imports.css'),
    output: join(__dirname, 'imports/styles/bundle.css')
  })
  .then(() => t.end())
  .catch(err => t.fail(err))
})
