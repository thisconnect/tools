const { readFile, writeFile, fstat } = require('fildes')
const compress = require('./compress.js')
const { resize } = require('./size.js')

module.exports = ({ src, dest, width }) => {
  return fstat(dest)
  .then(stat => stat.isFile())
  // .then(() => console.log('file exists', output))
  .catch(() => {
    return readFile(src)
    .then(buffer => width ? resize(buffer, { width }) : buffer)
		.then(buffer => compress(buffer))
		.then(buffer => writeFile(dest, buffer))
		// .then(() => console.log('new file', output))
  })
}
