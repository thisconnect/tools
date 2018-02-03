const { getAst } = require('./ast/index.js');
const { inlineImgs } = require('./ast/img.js');
const { inlineScripts } = require('./ast/script.js');
const { inlineLinks } = require('./ast/link.js');

module.exports = (data, options) => {
  return getAst(data).then(ast => {
    const html = ast.childNodes[1] || ast.childNodes[0];
    const head = html.childNodes[0];
    const body = html.childNodes[1];

    return Promise.all([
      // minifyStyles
      // minifyScripts
      inlineLinks(head.childNodes, options),
      inlineScripts(html.childNodes, options),
      inlineImgs(body.childNodes, options)
    ]).then(() => ast);
  });
};
