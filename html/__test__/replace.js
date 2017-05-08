const test = require('tape')
const { resolve } = require('path')
const { readFile, rm } = require('fildes-extra')
const inlineHTML = require('../index.js')

test('cleanup', t => {
  rm(resolve(__dirname, 'build2'))
  .then(() => t.end())
  .catch(t.end)
})

test('replace HTML string', t => {
  const src = resolve(__dirname, 'fixtures/index.html')
  const dest = resolve(__dirname, 'build2/index.html')

  inlineHTML({
    src, dest,
    replace: {
      '<footer>': `<footer>©${new Date().getFullYear()} Foo`
    }
  })
  .then(() => readFile(dest, { encoding: 'utf8' }))
  .then(result => {
    t.ok(result.indexOf('<footer>©' + new Date().getFullYear() + ' Foo</footer>') > -1, 'has footer copy right')
  })
  .then(() => t.end())
  .catch(t.end)
})
