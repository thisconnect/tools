const jimp = require('jimp');

exports.resize = (buffer, { width }) => {
  return jimp
    .read(buffer)
    .then(img => {
      const minwidth = Math.min(img.bitmap.width, width);
      return img.resize(minwidth, jimp.AUTO, jimp.RESIZE_BEZIER);
    })
    .then(
      img =>
        new Promise((resolve, reject) => {
          img.getBuffer(jimp.AUTO, (err, buffer) => {
            if (err) reject(err);
            resolve(buffer);
          });
        })
    );
};

exports.getSize = buffer => {
  return jimp.read(buffer).then(img => {
    return {
      width: img.bitmap.width,
      height: img.bitmap.height
    };
  });
};
