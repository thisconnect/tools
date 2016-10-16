const { relative } = require('path')
const { writeFile } = require('fildes')
const bundle = require('./bundle.js')
const minify = require('./minify.js')
const { size } = require('../log/index.js')

module.exports = ({ input, output, assets, fonts }) => {

  return bundle({ input, output, assets, fonts })
  .then(result => {

    return Promise.all([
      writeFile(output, result.css),
      writeFile(output + '.map', result.map)
    ])
    .then(() => {
      const outputmin = output.replace(/\.css$/, '.min.css')

      return minify({ result, input: output, output: outputmin })
      .then(min => {

        return Promise.all([
          writeFile(outputmin, min.css),
          writeFile(outputmin + '.map', min.map)
        ])
        .then(() => {
          size({
            title: relative(process.cwd(), output),
            results: {
              Bundle: result.css,
              minified: min.css
            }
          })
        })
        .then(() => min.css)
      })
    })
  })
}
