const rollup = require('rollup').rollup;
const { getPlugins } = require('./plugins');

module.exports = ({
  src,
  dest,
  format = 'iife',
  write = true,
  libs = false, // TODO: change default to true
  minify = true,
  treeshake = true,
  sourceMap = true,
  context,
  globals,
  external = [],
  replace = {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  namedExports
}) => {
  const sourcemap = sourceMap != null ? sourceMap : true;
  return rollup({
    treeshake,
    context,
    input: src,
    external: [].concat(external, globals && Object.keys(globals)),
    plugins: getPlugins({ libs, minify, replace, namedExports })
  }).then(bundle => {
    if (!write) {
      return bundle.generate({
        format,
        sourcemap: sourcemap ? 'inline' : false
      });
    }
    return bundle.write({
      banner: '// App',
      file: dest,
      format,
      globals,
      indent: false,
      sourcemap,
      strict: true
    });
  });
};
