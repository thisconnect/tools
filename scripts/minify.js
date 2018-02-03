const { minify } = require('uglify-js');

module.exports = code => {
  return Promise.resolve(code)
    .then(data => (Buffer.isBuffer(data) ? data.toString() : data))
    .then(code => {
      return minify(code, {
        mangle: true,
        output: {
          // https://github.com/mishoo/UglifyJS2#beautifier-options
          quote_style: 1,
          beautify: false,
          // indent_level: 2,
          comments: false
          // source_map: null
        },
        ie8: true
      });
    })
    .then(result => result.code);
};

/*
const { rollup } = require('rollup')
const nodeResolve = require('rollup-plugin-node-resolve')
// const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')


module.exports = ({ input }) => {
  return rollup({
    entry: input,
    plugins: [
      nodeResolve({ jsnext: true, main: true }),
      // commonjs({ include: ['**'] }),
      uglify()
    ]
  })
  .then(bundle => bundle.generate({
    // output format - 'amd', 'cjs', 'es', 'iife', 'umd'
    format: 'iife',
    sourceMap: true
  }))
  .then(result => result.code)

}
*/

/*

const { basename, dirname } = require('path')
const { minify, SourceMap } = require('uglify-js')

module.exports = ({ path, code }) => {
  return Promise.resolve()
  .then(() => {

    const source_map = SourceMap({
    })

    const file = {}
    file[basename(path)] = code

    const result = minify(file, {
      fromString: true,
      mangle: true,
      sourceMap: true,
      // inSourceMap: JSON.parse(my_source_map_string),
      // outSourceMap: 'minified.js.map'
      outSourceMap: basename(path) + '.map',
      sourceMapUrl: path + '.map', // defaults to outSourceMap

      output: {
        // https://github.com/mishoo/UglifyJS2#beautifier-options
        quote_style: 1,
        beautify: false,
        // indent_level: 2,
        comments: false,
        screw_ie8: true,
        // source_map: null
        source_map: source_map
      }

    })


    source_map.get().setSourceContent(basename(path), code)
    console.log(source_map.toString())
    return { code: result.code, map: source_map.toString() }
})
}


const { basename, dirname } = require('path')
const { minify } = require('uglify-js')

module.exports = ({ path, code }) => {
  return Promise.resolve()
  .then(() => {
    const file = {}
    file[basename(path)] = code

    const min = minify(file, {
      fromString: true,
      mangle: true,
      // inSourceMap: JSON.parse(my_source_map_string),
      // outSourceMap: 'minified.js.map'
      outSourceMap: basename(path) + '.map',
      sourceMapUrl: path + '.map', // defaults to outSourceMap

      output: {
        // https://github.com/mishoo/UglifyJS2#beautifier-options
        quote_style: 1,
        beautify: false,
        // indent_level: 2,
        comments: false,
        screw_ie8: true,
        // source_map: null
      }

    })


    // source_map.get().setSourceContent(basename(path), code)
    // console.log(source_map.toString())
    return min
})
}
*/
