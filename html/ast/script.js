const { resolve } = require('path');
const { readFile } = require('fildes');
const { findNodes, getSrc } = require('./index');
const { appendText, removeSrc } = require('./modify');
const bundleScript = require('../../scripts/bundle');
const minifyScript = require('../../scripts/minify');
const { log } = require('../../log/index');

const append = (node, path, { src, dest, treeshake, minify = true }) => {
  let file = resolve(dest, path);
  return bundleScript({
    src: resolve(src, path),
    dest: file,
    libs: true,
    minify,
    treeshake
  })
    .then(() => {
      return readFile(file)
        .then(data => data.toString())
        .then(code => code.replace(/\/*#\ssourceMappingURL\=.*/, ''))
        .catch(() => {
          file = resolve(src, path);
          return readFile(file).then(data => {
            if (!minify) {
              return data.toString();
            }
            return minifyScript({
              code: data.toString()
            });
          });
        })
        .then(content => appendText(node, content))
        .then(() => file);
    })
};

exports.inlineScripts = (nodes, options) => {
  return findNodes(nodes, 'script')
    .then(scripts =>
      scripts.filter(({ attrs }) => {
        for (let attr of attrs) {
          if (attr.name === 'src') {
            return !!attr.value;
          }
        }
        return false;
      })
    )
    .then(scripts =>
      Promise.all(
        scripts.map(node => {
          return getSrc(node).then(src => {
            return removeSrc(node).then(() => append(node, src, options));
          });
        })
      )
    )
    .then(srcs => log('inline scripts', srcs));
};
