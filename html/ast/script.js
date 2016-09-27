const { resolve } = require('path')
const { readFile, writeFile } = require('fildes')
const { findNodes, getSrc } = require('./index.js')
const { appendFragment, removeSrc } = require('./modify.js')
const minifyScript = require('../../scripts/minify.js')
const { log } = require('../../log/index.js')

const append = (node, path, { dest, src }) => {
  let file = resolve(dest, path)
  return readFile(file)
  .then(data => data.toString())
  .then(code => code.replace(/\/*#\ssourceMappingURL\=.*/, ''))
  .catch(err => {
    file = resolve(src, path)
    return readFile(file)
    .then(data => {
      return minifyScript({
        code: data.toString()
      })
    })
  })
  .then(content => appendFragment(node, content))
  .then(() => file)
}

exports.inlineScripts = (nodes, options) => {
  return findNodes(nodes, 'script')
  .then(scripts => scripts.filter(({ attrs }) => {
    for (let attr of attrs){
      if (attr.name == 'src'){
        return (!!attr.value)
      }
    }
    return false
  }))
  .then(scripts => Promise.all(scripts.map(node => {
    return getSrc(node).then(src => {
      return removeSrc(node)
      .then(() => append(node, src, options))
    })
  })))
  .then(srcs => log('inline scripts', srcs))
}
