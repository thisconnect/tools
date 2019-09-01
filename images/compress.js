const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSVGO = require('imagemin-svgo');

module.exports = buffer => {
  return imagemin.buffer(buffer, {
    plugins: [
      imageminPngquant({
        quality: [0.1, 1]
      }),
      imageminJpegtran({
        progressive: true
      }),
      imageminSVGO(),
      imageminGifsicle({
        // interlaced: false,
        // optimizationLevel: 1,
        // colors:
      })
    ]
  });
};

module.exports.optimizeSVG = (buffer, { plugins = [] }) => {
  const svg = imageminSVGO({ plugins });
  return imagemin.buffer(buffer, {
    plugins: [svg]
  });
};

module.exports.toWebp = buffer => {
  const webp = imageminWebp({
    preset: 'default',
    quality: 90,
    method: 6,
    sns: 100,
    filter: 0,
    sharpness: 0,
    lossless: false
  });
  return imagemin.buffer(buffer, {
    plugins: [webp]
  });
};
