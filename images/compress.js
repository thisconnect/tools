const imagemin = require('imagemin')
const imageminWebp = require('imagemin-webp')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
const imageminSVGO = require('imagemin-svgo')

const suffix = /\.(jpeg|jpg|png)$/gi

const png = imageminPngquant({
  quality: '10-100'
})

const jpeg = imageminJpegtran({
  progressive: true
})

const svg = imageminSVGO()

const webp = imageminWebp({
  preset: 'default',
  quality: 90,
  method: 6,
  sns: 100,
  filter: 0,
  sharpness: 0,
  lossless: false
})

module.exports = buffer => {
  return imagemin.buffer(buffer, {
    plugins: [png, jpeg, svg]
  })
}

module.exports.toWebp = buffer => {
  return imagemin.buffer(buffer, {
    plugins: [webp]
  })
}
