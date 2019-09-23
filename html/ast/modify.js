const { parseFragment } = require('parse5');

exports.appendText = (node, text) => {
  return Promise.resolve().then(() => {
    node.childNodes.push({
      nodeName: '#text',
      value: text,
      parentNode: node
    });
    return node;
  });
};

exports.appendFragment = (node, content) => {
  return Promise.resolve(parseFragment(content)).then(fragment => {
    node.childNodes.push(...fragment.childNodes);
    return node;
  });
};

exports.replaceFragment = (node, data) => {
  return Promise.resolve(Buffer.isBuffer(data) ? data.toString() : data)
    .then(markup => parseFragment(markup.trim()))
    .then(fragment => {
      const at = node.parentNode.childNodes.indexOf(node);
      node.parentNode.childNodes[at] = fragment.childNodes[0];
      return fragment.childNodes[0];
    });
};

exports.removeAttr = (node, attrName) => {
  node.attrs = node.attrs.filter(attr => attr.name != attrName);
  return Promise.resolve(node);
};

exports.removeSrc = node => {
  node.attrs = node.attrs.filter(attr => attr.name != 'src');
  return Promise.resolve(node);
};
