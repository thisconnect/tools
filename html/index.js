const { dirname } = require('path')
const { readFile, writeFile } = require('fildes')
const inline = require('./inline.js')
const { toHTML } = require('./ast/index.js')
const minifyHTML = require('./minify.js')

module.exports = ({ src, dest }) => {
  const options = {
    src: dirname(src),
    dest: dirname(dest)
  }

  return readFile(src)
  .then(data => inline(data, options))
  .then(ast => minifyHTML(ast))
  .then(ast => toHTML(ast))
  .then(html => writeFile(dest, html))
}
