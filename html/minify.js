const minify = nodes => {
  const que = [...nodes];
  for (let node of que) {
    if (node.nodeName === 'pre' || node.nodeName === 'textarea') {
      continue;
    }
    if (node.childNodes) {
      que.push(...node.childNodes);
    }
    // trimm white spaces
    if (node.nodeName === '#text') {
      if (node.value === '\n' || node.value == null) continue;
      const trimmed = node.value.trim();
      node.value = trimmed ? trimmed : '\n';
    } else {
      // remove comments
      if (node.nodeName === '#comment') {
        if (node.data[0] === '[') continue;
        const at = node.parentNode.childNodes.indexOf(node);
        node.parentNode.childNodes.splice(at, 1);
      }
    }
  }
  return Promise.resolve();
};

module.exports = ast => {
  const html = ast.childNodes[1] || ast.childNodes[0];
  return minify(html.childNodes).then(() => ast);
};
