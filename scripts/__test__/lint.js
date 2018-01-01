const test = require('tape')
const { resolve } = require('path')
const lint = require('../lint.js')

test('lint', t => {
  lint({
    src: resolve(__dirname, './fixtures/entry.js')
  })
  .then(result => {
    // console.log(result)
    t.ok(result, 'has result')
    t.end()
  })
  .catch(t.end)
})
