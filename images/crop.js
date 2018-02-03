const jimp = require('jimp');

module.exports = buffer =>
  jimp
    .read(buffer)
    .then(img => img.autocrop(false))
    .then(
      img =>
        new Promise((resolve, reject) => {
          img.getBuffer(jimp.AUTO, (err, buffer) => {
            if (err) reject(err);
            resolve(buffer);
          });
        })
    );
