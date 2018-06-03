const { parse, serialize } = require('parse5');
const adapter = require('parse5-htmlparser2-tree-adapter');

exports.getAst = data => {
  return Promise.resolve(data)
    .then(data => (Buffer.isBuffer(data) ? data.toString() : data))
    .then(html => parse(html));
};

exports.toHTML = ast => {
  if (ast.nodeName == '#document' || ast.nodeName == '#document-fragment') {
    return Promise.resolve(serialize(ast));
  }
  return new Promise((resolve /*, reject*/) => {
    const fragment = adapter.createDocumentFragment();
    adapter.appendChild(fragment, ast);
    resolve(serialize(fragment));
  });
};

exports.findNodes = (nodes, nodeName) => {
  const results = [];
  const que = [...nodes];
  for (let node of que) {
    if (node.childNodes) {
      que.push(...node.childNodes);
    }
    if (node.nodeName == nodeName) {
      results.push(node);
    }
  }
  return Promise.all(results);
};

exports.search = exports.childNodes = (nodes, nodeName) => {
  const results = [];
  for (let node of nodes) {
    if (node.nodeName == nodeName) {
      results.push(node);
    }
  }
  return Promise.resolve(results);
};

exports.getHref = node => {
  return Promise.resolve(node.attrs).then(attrs => {
    for (let attr of attrs) {
      if (attr.name == 'href') {
        return attr.value;
      }
    }
  });
};

exports.getSrc = node => {
  return Promise.resolve(node.attrs).then(attrs => {
    for (let attr of attrs) {
      if (attr.name == 'src') {
        return attr.value;
      }
    }
  });
};

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
