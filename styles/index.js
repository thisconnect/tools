const { writeFile } = require('fildes');
const bundle = require('./bundle.js');
const minify = require('./minify.js');
const { size } = require('./log.js');


module.exports = ({ input, output }) => {

  return bundle({ input, output })
  .then(result => {

    const outputmin = output.replace(/\.css$/, '.min.css')

    return minify({ result, input: output, output: outputmin})
    .then(min => {

      size({
        Bundle: result.css,
        minified: min.css
      })

      return Promise.all([
        writeFile(output, result.css),
        writeFile(output + '.map', result.map),
        writeFile(outputmin, min.css),
        writeFile(outputmin + '.map', min.map)
      ])

    })
  })

}
