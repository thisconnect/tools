const { resolve } = require('path')
const test = require('tape')
const { readFile, rm } = require('fildes-extra')
const minifyImages = require('../index.js')
const { getSize } = require('../size.js')

test('cleanup', t => {
  rm(resolve(__dirname, 'build'))
  .then(() => t.end())
  .catch(err => t.fail(err))
})

test('compress', t => {
  const input = resolve(__dirname, 'fixtures/palette.png')
  const output = resolve(__dirname, 'build/palette.png')

  minifyImages({ input, output })
  .then(() => Promise.all([
    readFile(input).then(data => Buffer.byteLength(data)),
    readFile(output).then(data => Buffer.byteLength(data))
  ]))
  .then(sizes => {
    t.ok(sizes[1] < sizes[0], 'size of compressed image is smaller')
  })
  .then(() => t.end())
  .catch(err => t.fail(err))
})


test('resize and compress', t => {
  const input = resolve(__dirname, 'fixtures/palette.png')
  const output = resolve(__dirname, 'build/palette-small.png')

  minifyImages({ input, output, width: 48 })
  .then(() => Promise.all([
    readFile(input).then(data => getSize(data)),
    readFile(output).then(data => getSize(data))
  ]))
  .then(sizes => {
    t.ok(sizes[1].width < sizes[0].width, 'width of resized image is smaller')
    t.ok(sizes[1].height < sizes[0].height, 'height of resized image is smaller')
  })
  .then(() => t.end())
  .catch(err => t.fail(err))
})
