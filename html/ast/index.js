const { parse, serialize } = require('parse5')

exports.getAst = data => {
  return Promise.resolve(data)
  .then(data => Buffer.isBuffer(data) ? data.toString() : data)
  .then(html => parse(html))
}

exports.toHTML = ast => Promise.resolve(serialize(ast))

exports.findNodes = (nodes, nodeName) => {
  const results = []
  const que = [...nodes]
  for (let node of que){
    if (node.childNodes){
      que.push(...node.childNodes)
    }
    if (node.nodeName == nodeName){
      results.push(node)
    }
  }
  return Promise.all(results)
}

exports.search = exports.childNodes = (nodes, nodeName) => {
  const results = []
  for (let node of nodes){
    if (node.nodeName == nodeName){
      results.push(node)
    }
  }
  return Promise.resolve(results)
}

exports.getHref = node => {
  return Promise.resolve(node.attrs)
  .then(attrs => {
    for (let attr of attrs){
      if (attr.name == 'href'){
        return attr.value
      }
    }
  })
}

exports.getSrc = node => {
  return Promise.resolve(node.attrs)
  .then(attrs => {
    for (let attr of attrs){
      if (attr.name == 'src'){
        return attr.value
      }
    }
  })
}

/*
exports.hasAttr = ({ attrs }, attrName, value) => {
  for (let attr of attrs){
    if (attr.name == attrName && (value == null || value == attr.value)){
      return Promise.resolve(true)
    }
  }
  return Promise.resolve(false)
}
*/
