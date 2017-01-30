const { basename, dirname, extname, resolve } = require('path')
const { readFile } = require('fildes')
const { search, getHref } = require('./index.js')
const { appendFragment, linkToStyle } = require('./modify.js')
const bundle = require('../../styles/index.js')
const { log } = require('../../log/index.js')

const append = (node, path, { src, dest }) => {
  const dir = dirname(path)
  const ext = extname(path)
  const base = basename(path, ext)
  let file = resolve(dest, dir, base + ext)
  let filemin = resolve(dest, dir, `${base}.min${ext}`)

  return readFile(filemin)
  .catch(() => {
    return bundle({
      src: resolve(src, path),
      dest: file,
      assets: './'
    })
    .then(css => {
      file = resolve(src, path)
      return css
    })
  })
  .then(data => data.toString().replace(/\/\*#\ssourceMappingURL\=.*$/, ''))
  .then(css => appendFragment(node, css))
  .then(() => file)
}

const inline = (links, options) => {
  return Promise.all(links.map(node => {
    return getHref(node)
    .then(path => append(node, path, options))
    .then(src => linkToStyle(node).then(() => src))
  }))
}

exports.inlineLinks = (nodes, options) => {
  return search(nodes, 'link')
  .then(links => links.filter(({ attrs }) => {
    let rel = false
    let href = false
    for (let attr of attrs){
      rel = (attr.name == 'rel') ? attr.value : rel
      href = (attr.name == 'href') ? attr.value : href
    }
    return (rel == 'stylesheet' && !!href)
  }))
  .then(links => inline(links, options))
  .then(srcs => log('inline stylesheets', srcs))
}
