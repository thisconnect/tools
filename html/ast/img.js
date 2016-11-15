const { extname, resolve } = require('path')
const { parse } = require('url')
const { readFile } = require('fildes')
const { findNodes, getSrc } = require('./index.js')
const { replaceFragment, removeAttr } = require('./modify.js')
const SVGO = require('svgo')
const { log } = require('../../log/index.js')


const replace = (node, path, { src, dest }) => {
  let file = resolve(dest, path)
  return readFile(file)
  .catch(() => {
    file = resolve(src, path)
    return readFile(file)
    .then(buffer => {
      return new Promise((resolve/*, reject*/) => {
        const svgo = new SVGO({
          plugins: [
            { removeXMLNS: true }
          ]
        })
        svgo.optimize(buffer.toString(), result => resolve(result.data))
      })
    })
  //  .then(buffer => optimize(buffer.toString()))
    // .then(b => {console.log(b, '--------------'); return b; })

  })
  .then(data => replaceFragment(node, data))
  .then(b => {console.log('===', b, '--------------'); return b; })
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
        return (extname(parse(attr.value).pathname) == '.svg') // prase().pathname ??
      }
    }
    return false
  }))
  .then(svgs => inline(svgs, options))
  .then(srcs => log('inline svgs', srcs))
}
