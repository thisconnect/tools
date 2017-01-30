const pluginReplace = require('rollup-plugin-replace')
const npm = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
// const json = require('rollup-plugin-json')
const babel = require('rollup-plugin-babel')
const uglify = require('rollup-plugin-uglify')
const filesize = require('rollup-plugin-filesize')
// const builtins = require('rollup-plugin-node-builtins')


exports.getPlugins = ({ libs, minify, replace }) => {
  const plugins = []

  if (replace) {
    plugins.push(pluginReplace(replace))
  }

  if (libs) {
    plugins.push(
      npm({
        jsnext: true
      }),
      commonjs({
        // include: ['node_modules/**'],
        namedExports: {
          'node_modules/react/react.js': ['Component', 'createElement']
        }
      })
    )
  }

  plugins.push(babel({
    babelrc: false,
    // exclude: 'node_modules/**',
    presets: ['react', 'stage-3', 'es2015-rollup']
  }))

  if (minify) {
    plugins.push(uglify({
      compress: {
        screw_ie8: true,
        warnings: false
      }
    }))
  }

  plugins.push(filesize({
    format: {
      // base: 10,
      exponent: 0
      // standard: 'iec',
      // bits: true
    }
  }))

  return plugins

}
