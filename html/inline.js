const { dirname } = require('path')
const { readFile, writeFile } = require('fildes')
const { getAst, toHTML } = require('./ast/index.js')
const minifySVG = require('./ast/svg.js')
const { inlineSvgs } = require('./ast/img.js')
const { inlineScripts } = require('./ast/script.js')
const { inlineStylesheets } = require('./ast/link.js')
const minifyHTML = require('./minify.js')

module.exports = ({ src, dest }) => {

  return readFile(src)
  .then(data => getAst(data))
  .then(ast => {
    const option = {
      src: dirname(src),
      dest: dirname(dest)
    }

    const html = ast.childNodes[1] || ast.childNodes[0]
    const head = html.childNodes[0]
    const body = html.childNodes[1]

    return Promise.all([
      minifySVG(body.childNodes),
      // minifyStyles
      // minifyScripts
      inlineStylesheets(head.childNodes, option), // rename inlineLinks
      inlineScripts(html.childNodes, option),
      inlineSvgs(body.childNodes, option) // rename inlineImgs
    ])
    .then(() => minifyHTML(ast))
    .then(() => toHTML(ast))
    .then(html => writeFile(dest, html))
  })
}
