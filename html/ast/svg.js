const { dirname, extname, resolve } = require('path')
const { parse } = require('url')
const { readFile } = require('fildes')
const { findNodes, getSrc } = require('./index.js')
const { replaceFragment, removeAttr } = require('./modify.js')
const { log } = require('../../log/index.js')

const replace = (node, path, { dest, src }) => {
  let file = resolve(dest, path)
  return readFile(file)
  .catch(err => {
    file = resolve(src, path)
    return readFile(file)
  }) // TODO MINIFY SVG
  .then(data => replaceFragment(node, data))
  .then(node => removeAttr(node, 'xmlns'))
  .then(() => file)
}

const inline = (svgs, options) => {
  return Promise.all(svgs.map(node => {
    return getSrc(node)
    .then(path => replace(node, path, options)) // prase().pathname ??
  }))
}

exports.inlineSvgs = (nodes, options) => {
  return findNodes(nodes, 'img')
  .then(imgs => imgs.filter(({ attrs }) => {
    for (let attr of attrs){
      if (attr.name == 'src'){
        return (extname(parse(attr.value).pathname) == '.svg')
      }
    }
    return false
  }))
  .then(svgs => inline(svgs, options))
  .then(srcs => log('inline svgs', srcs))
}
