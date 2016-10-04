const { readFile, writeFile, fstat } = require('fildes')
const compress = require('./compress.js')
const { resize } = require('./size.js')

module.exports = ({ input, output, width }) => {
  return fstat(output)
  .then(stat => stat.isFile())
  // .then(() => console.log('file exists', output))
  .catch(() => {
    return readFile(input)
    .then(buffer => width ? resize(buffer, { width }) : buffer)
		.then(buffer => compress(buffer))
		.then(buffer => writeFile(output, buffer))
		// .then(() => console.log('new file', output))
  })
}
