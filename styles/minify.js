const cssnano = require('cssnano')

module.exports = ({ result, input, output }) => {
  return cssnano.process(result.css, {
    map: {
      inline: false,
      prev: result.map
    },
    from: input,
    to: output,
    autoprefixer: false
  })
}
