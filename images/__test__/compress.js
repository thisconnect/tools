const test = require('tape')
const { resolve } = require('path')
const { readFile } = require('fildes')
const compress = require('../compress.js')

test('compress svg', t => {
  readFile(resolve(__dirname, 'fixtures/mail.svg'))
  .then(svg => compress(svg).then(min => {
    return {
      original: Buffer.byteLength(svg),
      compressed: Buffer.byteLength(min)
    }
  }))
  .then(result => t.ok(result.compressed < result.original, 'compressed svg is smaller'))
  .then(() => t.end())
  .catch(err => t.fail(err))
})

test('compress png', t => {
  readFile(resolve(__dirname, 'fixtures/palette.png'))
  .then(png => compress(png).then(min => {
    return {
      original: Buffer.byteLength(png),
      compressed: Buffer.byteLength(min)
    }
  }))
  .then(result => t.ok(result.compressed < result.original, 'compressed png is smaller'))
  .then(() => t.end())
  .catch(err => t.fail(err))
})

test('compress many', t => {
  const src = resolve(__dirname, 'fixtures/tiger.jpg')

  const files = []
  let count = 11
  while (count--){
    files.push(readFile(src).then(png => compress(png)))
  }

  Promise.all(files)
  .then(() => {
    console.log('done')
    t.end()
  })
  .catch(err => t.fail(err))
})
