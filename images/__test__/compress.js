const test = require('tape')
const { resolve } = require('path')
const { readFile } = require('fildes')
const compress = require('../compress.js')
const { optimizeSVG } = compress

test('compress svg', t => {
  readFile(resolve(__dirname, 'fixtures/mail.svg'))
  .then(svg => compress(svg).then(min => {
    t.ok(min.indexOf('xmlns="http://www.w3.org/2000/svg"') > -1, 'has xmlns attribute')
    return {
      original: Buffer.byteLength(svg),
      compressed: Buffer.byteLength(min)
    }
  }))
  .then(({ compressed, original }) => {
    t.ok(compressed < original, 'compressed svg is smaller')
    t.end()
  })
  .catch(t.end)
})

test('optimizeSVG with plugins', t => {
  const options = {
    plugins: [
      { removeXMLNS: true }
    ]
  }
  readFile(resolve(__dirname, 'fixtures/mail.svg'))
  .then(svg => optimizeSVG(svg, options).then(min => {
    t.ok(min.indexOf('xmlns="http://www.w3.org/2000/svg"') == -1, 'no xmlns attribute')
    return {
      original: Buffer.byteLength(svg),
      compressed: Buffer.byteLength(min)
    }
  }))
  .then(({ compressed, original }) => {
    t.ok(compressed < original, 'compressed svg is smaller')
    t.end()
  })
  .catch(t.end)
})

test('compress png', t => {
  readFile(resolve(__dirname, 'fixtures/palette.png'))
  .then(png => compress(png).then(min => {
    return {
      original: Buffer.byteLength(png),
      compressed: Buffer.byteLength(min)
    }
  }))
  .then(({ compressed, original }) => {
    t.ok(compressed < original, 'compressed svg is smaller')
    t.end()
  })
  .catch(t.end)
})

test.skip('compress many', t => {
  const src = resolve(__dirname, 'fixtures/tiger.jpg')

  const files = []
  let count = 11
  while (count--){
    files.push(readFile(src).then(png => compress(png)))
  }

  Promise.all(files)
  .then(() => {
    t.end()
  })
  .catch(t.end)
})
