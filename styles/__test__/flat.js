const { join } = require('path')
const test = require('tape')
const { readFile, rm } = require('fildes-extra')
const buildCSS = require('../')

test('cleanup', t => {
  rm(join(__dirname, 'build/flat'))
  .then(() => t.end())
  .catch(err => t.fail(err))
})

test('build CSS and assets into the same directory', t => {
  const input = join(__dirname, 'fixtures/imports.css')
  const output = join(__dirname, 'build/flat/bundle.css')

  buildCSS({ input, output })
  .then(() => readFile(output), { encoding: 'utf8' })
  .then(styles => t.ok(styles.indexOf(`url('fontawesome-`) > -1, 'path begins with fonts/'))
  .then(() => readFile(output.replace('.css', '.min.css'), { encoding: 'utf8' }))
  .then(min => t.ok(min.indexOf(`url(fontawesome-`) > -1, 'minified path begins with url(fonts/'))
  .then(() => t.end())
  .catch(err => t.fail(err))
})
