const { getAst } = require('./ast/index');
const { inlineScripts } = require('./ast/script');
const { inlineLinks } = require('./ast/link');

module.exports = (data, options) => {
  return getAst(data).then(ast => {
    const html = ast.childNodes[1] || ast.childNodes[0];
    const head = html.childNodes[0];
    return Promise.all([
      // minifyStyles
      // minifyScripts
      inlineLinks(head.childNodes, options),
      inlineScripts(html.childNodes, options)
    ]).then(() => ast);
  });
};
