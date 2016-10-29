const rollup = require('rollup').rollup
const pluginNPM = require('rollup-plugin-node-resolve')
const pluginCommonjs = require('rollup-plugin-commonjs')
// const pluginJson = require('rollup-plugin-json')
const pluginBabel = require('rollup-plugin-babel')
const pluginReplace = require('rollup-plugin-replace')
const pluginUglify = require('rollup-plugin-uglify')
const pluginFilesize = require('rollup-plugin-filesize')
// const builtins = require('rollup-plugin-node-builtins')

const env = process.env.NODE_ENV || 'production'

const replace = pluginReplace({
  'process.env.NODE_ENV': JSON.stringify(env)
})

const npm = pluginNPM({
  jsnext: true
})

const commonjs = pluginCommonjs({
  include: 'node_modules/**',
  namedExports: {
    'node_modules/react/react.js': ['Component', 'createElement']
  }
})

const babel = pluginBabel({
  babelrc: false,
  // exclude: 'node_modules/**',
  presets: ['react', 'stage-3', 'es2015-rollup']
})

const uglify = pluginUglify({
  compress: {
    screw_ie8: true,
    warnings: false
  }
})

const filesize = pluginFilesize({
  format: {
    // base: 10,
    exponent: 0
    // standard: 'iec',
    // bits: true
  }
})

module.exports = ({
  src, dest,
  format = 'iife',
  write = true,
  libs = false,
  minify = true
}) => {

  const plugins = libs ? [
    replace, npm, commonjs, babel
  ] : [
    replace, babel
  ]

  if (minify) {
    plugins.push(uglify)
  }

  plugins.push(filesize)

  return rollup({
    entry: src,
    // external: ['date-fns/format', 'marked', 'react', 'react-dom'],
    plugins
  })
  .then(bundle => {
    if (!write){
      return bundle.generate({ format, sourceMap: 'inline' })
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
      sourceMap: true
    })
  })
}
