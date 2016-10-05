const rollup = require('rollup').rollup
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
// const json = require('rollup-plugin-json')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')
const filesize = require('rollup-plugin-filesize')

// const builtins = require('rollup-plugin-node-builtins')

const env = process.env.NODE_ENV || 'production'

module.exports = ({ entry, dest, format = 'iife' }) => {
  return rollup({
    entry,
    // external: ['date-fns/format', 'marked', 'react', 'react-dom'],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(env)
      }),
      babel({
        babelrc: false,
        presets: ['es2015-rollup' , 'react', 'stage-3']
      }),
      uglify(),
      filesize({
        format: {
          // base: 10,
          exponent: 0
          // standard: 'iec',
          // bits: true
        }
      })
    ]
  })
  .then(bundle => bundle.write({
    banner: '// App',
    dest,
    format,
    /*globals: {
      'date-fns/format': 'format',
      'marked': 'marked',
      'react': 'React',
      'react-dom': 'ReactDOM'
    },*/
    indent: false,
    sourceMap: true
  }))
}

module.exports.libs = ({ entry, dest, format = 'iife' }) => {
  return rollup({
    entry,
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(env)
      }),
      nodeResolve({
        jsnext: true
      }),
      commonjs({
        include: 'node_modules/**',
        namedExports: {
          'node_modules/react/react.js': ['Component', 'createElement']
        }
      }),
      // json(),
      babel({
        babelrc: false,
        // exclude: 'node_modules/**',
        presets: ['react', 'stage-1', 'es2015-rollup']
      }),
      uglify({
        compress: {
          screw_ie8: true,
          warnings: false
        }
      }),
      filesize()
    ]
  })
  .then(bundle => bundle.write({
    banner: '// Libs',
    dest,
    format,
    indent: false,
    sourceMap: true
  }))
}
