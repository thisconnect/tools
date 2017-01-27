const test = require('tape')
const { readFile, rm } = require('fildes-extra')
const { resolve } = require('path')
const bundle = require('../bundle.js')

test('cleanup', t => {
  rm(resolve(__dirname, 'build/bundle'))
  .then(() => t.end())
  .catch(err => t.fail(err))
})

test('bundle es6 modules', t => {
  const src = resolve(__dirname, 'fixtures/entry.js')
  const dest = resolve(__dirname, 'build/bundle/bundle.js')
  const srcMapPath = '../../fixtures/entry.js'

  bundle({ src, dest, minify: false })
  .then(() => readFile(dest))
  .then(code => t.ok(Buffer.byteLength(code) > 1, 'has some length'))
  .then(() => readFile(dest + '.map', { encoding: 'utf8' }))
  .then(map => JSON.parse(map))
  .then(({ version, sources }) => {
    t.ok(version >= 3, 'sourcemap version >= 3')
    t.ok(sources.indexOf(srcMapPath) > -1, `sources contain ${srcMapPath}`)
  })
  .then(() => t.end())
  .catch(err => t.fail(err))
})
