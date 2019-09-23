const { extname, resolve } = require('path');
const { parse } = require('url');
const { readFile } = require('fildes');
const { findNodes, getSrc } = require('./index');
const { replaceFragment, removeAttr } = require('./modify');
const SVGO = require('svgo');
const { log } = require('../../log/index');

const replace = (node, path, { src, dest }) => {
  let file = resolve(dest, path);
  return readFile(file)
    .catch(() => {
      file = resolve(src, path);
      return readFile(file)
        .then(buffer => {
          const svgo = new SVGO({
            plugins: [{ removeXMLNS: true }]
          });
          return svgo.optimize(buffer.toString());
        })
        .then(result => result.data);
    })
    .then(data => replaceFragment(node, data))
    .then(node => removeAttr(node, 'xmlns'))
    .then(() => file);
};

const inline = (svgs, options) => {
  return Promise.all(
    svgs.map(node => {
      return getSrc(node).then(path => replace(node, path, options)); // prase().pathname ??
    })
  );
};

exports.inlineImgs = (nodes, options) => {
  return findNodes(nodes, 'img')
    .then(imgs =>
      imgs.filter(({ attrs }) => {
        for (let attr of attrs) {
          if (attr.name == 'src') {
            return extname(parse(attr.value).pathname) == '.svg'; // prase().pathname ??
          }
        }
        return false;
      })
    )
    .then(svgs => inline(svgs, options))
    .then(srcs => log('inline svgs', srcs));
};
