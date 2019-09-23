const { dirname } = require('path');
const { readFile, writeFile } = require('fildes');
const inline = require('./inline.js');
const { toHTML } = require('./ast/index.js');
const minifyHTML = require('./minify.js');

module.exports = ({ src, dest, replace, treeshake, minify = true }) => {
  return readFile(src)
    .then(data => inline(data, {
      src: dirname(src),
      dest: dirname(dest),
      treeshake,
      minify
    }))
    .then(ast => minify ? minifyHTML(ast) : ast)
    .then(ast => toHTML(ast))
    .then(html => {
      if (replace) {
        for (const str in replace) {
          html = html.replace(str, replace[str]);
        }
      }
      return html;
    })
    .then(html => writeFile(dest, html));
};
