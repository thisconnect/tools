const { basename, dirname, extname, resolve } = require('path');
const { search, getHref } = require('./index');
const { replaceFragment } = require('./modify');
const bundle = require('../../styles/index');
const { log } = require('../../log/index');

const replace = (node, path, { src, dest, minify }) => {
  const dir = dirname(path);
  const ext = extname(path);
  const base = basename(path, ext);
  let file = resolve(dest, dir, base + ext);

  return bundle({
      src: resolve(src, path),
      dest: file,
      assets: './',
      minify
    }).then(css => {
      file = resolve(src, path);
      return css;
    })
    .then(data => data.toString().replace(/\/\*#\ssourceMappingURL=.*$/, ''))
    .then(css => replaceFragment(node, `<style>${css}</style>`))
    .then(() => file);
};

exports.inlineLinks = (nodes, options) => {
  return search(nodes, 'link')
    .then(links => links.filter(hasRelAndHref))
    .then(links => inline(links, options))
    .then(srcs => log('inline stylesheets', srcs));
};

function inline(links, options) {
  return Promise.all(
    links.map(node => {
      return getHref(node)
        .then(path => replace(node, path, options));
    })
  );
}

function hasRelAndHref({ attrs }) {
  let rel = false;
  let href = false;
  for (let attr of attrs) {
    rel = attr.name === 'rel' ? attr.value : rel;
    href = attr.name === 'href' ? attr.value : href;
  }
  return rel === 'stylesheet' && !!href;
}
