const test = require('tape')
const { join } = require('path')
const { readFile, rm } = require('fildes-extra')
const buildCSS = require('../index.js')

test('cleanup', t => {
  rm(join(__dirname, 'build/flat'))
  .then(() => t.end())
  .catch(t.end)
})

test('build CSS and assets into the same directory', t => {
  const src = join(__dirname, 'fixtures/imports.css')
  const dest = join(__dirname, 'build/flat/bundle.css')

  buildCSS({ src, dest })
  .then(() => readFile(dest), { encoding: 'utf8' })
  .then(styles => t.ok(styles.indexOf(`url('fontawesome-`) > -1, 'path begins with fonts/'))
  .then(() => readFile(dest.replace('.css', '.min.css'), { encoding: 'utf8' }))
  .then(min => t.ok(min.indexOf(`url(fontawesome-`) > -1, 'minified path begins with url(fonts/'))
  .then(() => t.end())
  .catch(t.end)
})
