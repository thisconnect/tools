const { dirname } = require('path')
const { readFile, writeFile } = require('fildes')
const { getAst, toHTML } = require('./ast/index.js')
const { inlineSvgs } = require('./ast/img.js')
const { inlineScripts } = require('./ast/script.js')
const { inlineStylesheets } = require('./ast/link.js')
const minifyHTML = require('./minify.js')

module.exports = ({ input, output }) => {
  return readFile(input)
  .then(data => getAst(data))
  .then(ast => {
    const dest = dirname(output)
    const src = dirname(input)

    const html = ast.childNodes[1] || ast.childNodes[0]
    const head = html.childNodes[0]
    const body = html.childNodes[1]

    return Promise.all([
      // minifyStyles
      // minifyScripts
      inlineStylesheets(head.childNodes, { dest, src }), // rename inlineLinks
      inlineScripts(html.childNodes, { dest, src }),
      inlineSvgs(body.childNodes, { dest, src }) // rename inlineImgs
    ])
    .then(() => minifyHTML(ast))
    .then(() => toHTML(ast))
    .then(html => writeFile(output, html))
  })
}
