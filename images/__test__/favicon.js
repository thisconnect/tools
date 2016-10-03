const { resolve } = require('path')
const test = require('tape')
const { readFile, writeFile } = require('fildes')
const toIco = require('../ico.js')

test('create ico from png', t => {
  const input = resolve(__dirname, 'fixtures/favicon.png')
  const output = resolve(__dirname, 'build/favicon.ico')
  readFile(input)
  .then(buffer => toIco(buffer))
  .then(ico => {
    t.ok(ico, 'has ico')
    t.ok(ico instanceof Buffer, 'ico is Buffer')
  })
  .then(() => t.end())
  .catch(err => t.fail(err))
})
