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
