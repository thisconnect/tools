const { resolve } = require('path')
const test = require('tape')
const { readFile, writeFile, rm } = require('fildes-extra')
const inlineHTML = require('../inline.js')

test('cleanup', t => {
  rm(resolve(__dirname, 'inline'))
  .then(() => t.end())
  .catch(err => t.fail(err))
})

test('inline HTML', t => {
  const input = resolve(__dirname, 'fixtures/index.html')
  const output = resolve(__dirname, 'build/index.html')
  inlineHTML({ input, output })
  .then(() => readFile(output, { encoding: 'utf8' }))
  .then(result => {
    t.ok(result.indexOf('src=') == -1, 'has no more src attributes')
    t.ok(result.indexOf('<svg') > -1, 'has svg element')
    t.ok(result.indexOf('rel=stylesheet') == -1, 'has no external stylesheet')
  })
  .then(() => t.end())
  .catch(err => t.fail(err))
})
