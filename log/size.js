const { basename } = require('path');
const { find, readFile } = require('fildes-extra');
const { size } = require('./index.js');

find('**/__test__/build**/*.*')
  .then(paths => {
    const files = {};
    return Promise.all(
      paths.map(p => {
        return readFile(p).then(data => {
          files[basename(p)] = data;
        });
      })
    ).then(() => files);
  })
  .then(files => size({ title: 'FILES', results: files }))
  .catch(err => console.log(err));
