// const parse = require('css-what')

exports.getNodesByTagName = (nodes, tagName) => {
  return new Promise(resolve => {
    const results = [];
    const que = getChildNodes(nodes);
    for (const node of que) {
      const { childNodes } = node;
      if (node.tagName === tagName) {
        results.push(node);
      }
      if (childNodes && childNodes.length) {
        que.push(...childNodes);
      }
    }
    resolve(results);
  });
};

exports.getNodeById = (nodes, id) => {
  return new Promise(resolve => {
    const que = getChildNodes(nodes);
    for (const node of que) {
      const { attrs, childNodes } = node;
      if (attrs && attrs.length) {
        for (const attr of attrs) {
          if (attr.name === 'id' && attr.value === id) {
            return resolve(node);
          }
        }
      }
      if (childNodes && childNodes.length) {
        que.push(...childNodes);
      }
    }
    resolve(null);
  });
};

function getChildNodes(nodes) {
  const childNodes = nodes.childNodes;
  return childNodes && childNodes.length ? [...childNodes] : [...nodes];
}

/*
function match(node, t){
  const tokens = t.reverse()
  console.log('---tokens--', tokens)

  for (const token of tokens){
    if (token.type === 'tag'){
      if (node.nodeName !== token.name){
        return false
      }
    } else if (token.type === 'descendant'){

    }
  }
  return true
}

*/

/*
// querySelectorAll
exports.querySelectorAll = (nodes, selector) => {
  return new Promise((resolve, reject) => {
    const selectors = parse(selector)

    const results = []
    const que = (nodes.childNodes && nodes.childNodes.length) ? [...nodes.childNodes] : [...nodes]
    for (const node of que){
      for (const tokens of selectors){
        if (match(node, tokens)){
          results.push(node)
        }
      }

      if (node.childNodes.length){
        que.push(...node.childNodes)
      }
    }
    resolve(results)

  })
}
*/
