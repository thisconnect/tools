const { parseFragment } = require('parse5')

exports.appendFragment = (node, content) => {
  return Promise.resolve(parseFragment(content))
  .then(fragment => {
    node.childNodes.push(...fragment.childNodes)
    return node
  })
}

exports.replaceFragment = (node, data) => {
  return Promise.resolve(Buffer.isBuffer(data) ? data.toString() : data)
  .then(markup => parseFragment(markup.trim()))
  .then(fragment => {
    const at = node.parentNode.childNodes.indexOf(node)
    node.parentNode.childNodes[at] = fragment.childNodes[0]
    return fragment.childNodes[0]
  })
}

exports.linkToStyle = node => {
  return Promise.resolve(node)
  .then(node => {
    node.nodeName = node.tagName = 'style'
    node.attrs = node.attrs.filter(attr => {
      return attr.name != 'href' && attr.name != 'rel'
    })
    return node
  })
}

exports.removeAttr = (node, attrName) => {
  node.attrs = node.attrs.filter(attr => attr.name != attrName)
  return Promise.resolve(node)
}

exports.removeSrc = node => {
  node.attrs = node.attrs.filter(attr => attr.name != 'src')
  return Promise.resolve(node)
}
