const test = require('tape')
const { resolve } = require('path')
const { readFile, rm } = require('fildes-extra')
const minifyImages = require('../index.js')
const { getSize } = require('../size.js')

test('cleanup', t => {
  rm(resolve(__dirname, 'build'))
  .then(() => t.end())
  .catch(err => t.fail(err))
})

test('compress', t => {
  const src = resolve(__dirname, 'fixtures/palette.png')
  const dest = resolve(__dirname, 'build/palette.png')

  minifyImages({ src, dest })
  .then(() => Promise.all([
    readFile(src).then(data => Buffer.byteLength(data)),
    readFile(dest).then(data => Buffer.byteLength(data))
  ]))
  .then(sizes => {
    t.ok(sizes[1] < sizes[0], 'size of compressed image is smaller')
  })
  .then(() => t.end())
  .catch(err => t.fail(err))
})


test('resize and compress', t => {
  const src = resolve(__dirname, 'fixtures/palette.png')
  const dest = resolve(__dirname, 'build/palette-small.png')

  minifyImages({ src, dest, width: 48 })
  .then(() => Promise.all([
    readFile(src).then(data => getSize(data)),
    readFile(dest).then(data => getSize(data))
  ]))
  .then(sizes => {
    t.ok(sizes[1].width < sizes[0].width, 'width of resized image is smaller')
    t.ok(sizes[1].height < sizes[0].height, 'height of resized image is smaller')
  })
  .then(() => t.end())
  .catch(err => t.fail(err))
})

test.skip('many', t => {
  const src = resolve(__dirname, 'fixtures/palette.png')

  const files = []
  let count = 20
  while (count--){
    files.unshift(`palette-${count}.png`)
  }
  Promise.resolve(files.map(file => resolve(__dirname, 'build/many', file)))
  .then(dest => {
    return Promise.all(dest.map(d => minifyImages({
      src, dest: d, width: 48
    })))
    .then(() => {
      console.log('done')
      t.end()
    })
  })

})
