const rollup = require('rollup').rollup
const { getPlugins } = require('./plugins.js')

const env = process.env.NODE_ENV || 'production'

module.exports = ({
  src, dest,
  format = 'iife',
  write = true,
  libs = false,
  minify = true,
  sourceMap = true,
  context,
  replace = {
    'process.env.NODE_ENV': JSON.stringify(env)
  }
}) => {
  return rollup({
    context,
    entry: src,
    // external: ['date-fns/format', 'marked', 'react', 'react-dom'],
    plugins: getPlugins({ libs, minify, replace })
  })
  .then(bundle => {
    if (!write) {
      return bundle.generate({
        format,
        sourceMap: sourceMap ? 'inline' : false
      })
    }
    return bundle.write({
      banner: '// App',
      dest,
      format,
      // globals: {
      //   'date-fns/format': 'format',
      //   'marked': 'marked',
      //   'react': 'React',
      //   'react-dom': 'ReactDOM'
      // },
      indent: false,
      sourceMap
    })
  })
}
