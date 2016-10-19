const { relative } = require('path')
const { writeFile } = require('fildes')
const bundle = require('./bundle.js')
const minify = require('./minify.js')
const { size } = require('../log/index.js')

module.exports = ({ src, dest, assets, fonts }) => {

  return bundle({ src, dest, assets, fonts })
  .then(result => {

    return Promise.all([
      writeFile(dest, result.css),
      writeFile(dest + '.map', result.map)
    ])
    .then(() => {
      const destmin = dest.replace(/\.css$/, '.min.css')

      return minify({ result, src: dest, dest: destmin })
      .then(min => {

        return Promise.all([
          writeFile(destmin, min.css),
          writeFile(destmin + '.map', min.map)
        ])
        .then(() => {
          size({
            title: relative(process.cwd(), dest),
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
