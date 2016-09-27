const { resolve } = require('path')
const test = require('tape')
const { readFile } = require('fildes')
const { resize, getSize } = require('../size.js')

test('resize png', t => {
  readFile(resolve(__dirname, 'fixtures/palette.png'))
  .then(png => resize(png, { width: 48 }))
  .then(small => getSize(small))
  .then(size => {
    t.ok(size, 'has size')
    t.ok(size instanceof Object, 'size is of type Object')
    t.ok('width' in size, 'has width')
    t.ok('height' in size, 'has height')
    t.equal(size.width, 48, 'has width of 48')
  })
  .then(() => t.end())
  .catch(err => t.fail(err))
})
