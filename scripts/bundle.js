const rollup = require('rollup').rollup;
const { getPlugins } = require('./plugins.js');

module.exports = ({
  src,
  dest,
  format = 'iife',
  write = true,
  libs = false,
  minify = true,
  sourceMap = true,
  context,
  replace = {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
}) => {
  const sourcemap = sourceMap != null ? sourceMap : true;
  return rollup({
    context,
    input: src,
    // external: ['date-fns/format', 'marked', 'react', 'react-dom'],
    plugins: getPlugins({ libs, minify, replace })
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
      // globals: {
      //   'date-fns/format': 'format',
      //   'marked': 'marked',
      //   'react': 'React',
      //   'react-dom': 'ReactDOM'
      // },
      indent: false,
      sourcemap,
      strict: true
    });
  });
};
