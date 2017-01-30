const test = require('tape')
const { readFile, rm } = require('fildes-extra')
const { resolve } = require('path')
const bundle = require('../bundle.js')

test('cleanup', t => {
  rm(resolve(__dirname, 'build/libs'))
  .then(() => t.end())
  .catch(err => t.fail(err))
})

test('bundle es6 modules', t => {
  const src = resolve(__dirname, 'fixtures/libs.js')
  const dest = resolve(__dirname, 'build/libs/bundle.js')
  const srcMapPath = '../../fixtures/libs.js'

  bundle({ src, dest, libs: true })
  .then(() => readFile(dest))
  .then(code => {
    t.ok(Buffer.byteLength(code) > 1, 'has some length')
    t.ok(code.indexOf('CommonJS module') > -1, 'contains CommonJS module')
    t.ok(code.indexOf('ES6 module') > -1, 'contains ES6 module')
  })
  .then(() => readFile(dest + '.map', { encoding: 'utf8' }))
  .then(map => JSON.parse(map))
  .then(({ version, sources }) => {
    t.ok(version >= 3, 'sourcemap version >= 3')
    t.ok(sources.indexOf(srcMapPath) > -1, `sources contain ${srcMapPath}`)
  })
  .then(() => t.end())
  .catch(err => t.fail(err))
})
