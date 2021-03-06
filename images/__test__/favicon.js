const test = require('tape');
const { resolve } = require('path');
const { readFile } = require('fildes');
const toIco = require('../ico.js');

test('create ico from png', t => {
  const src = resolve(__dirname, 'fixtures/favicon.png');
  readFile(src)
    .then(buffer => toIco(buffer))
    .then(ico => {
      t.ok(ico, 'has ico');
      t.ok(ico instanceof Buffer, 'ico is Buffer');
    })
    .then(() => t.end())
    .catch(t.end);
});
