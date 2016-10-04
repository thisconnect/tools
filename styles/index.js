const { relative } = require('path')
const { writeFile } = require('fildes')
const bundle = require('./bundle.js')
const minify = require('./minify.js')
const { size } = require('../log/index.js')

module.exports = ({ input, output, assets }) => {
  console.log('from', input)
  console.log('to', output)

  return bundle({ input, output, assets })
  .then(result => {

    const outputmin = output.replace(/\.css$/, '.min.css')

    return minify({ result, input: output, output: outputmin })
    .then(min => {

      size({
        title: relative(process.cwd(), output),
        results: {
          Bundle: result.css,
          minified: min.css
        }
      })

      return Promise.all([
        writeFile(output, result.css),
        writeFile(output + '.map', result.map),
        writeFile(outputmin, min.css),
        writeFile(outputmin + '.map', min.map)
      ])
      .then(() => min.css)

    })
  })
}
