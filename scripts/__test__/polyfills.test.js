const test = require('tape');
const { readFile, rm } = require('fildes-extra');
const { resolve } = require('path');
const polyfill = require('../polyfills/index.js');

test('cleanup', t => {
  rm(resolve(__dirname, 'build/polyfills'))
    .then(() => t.end())
    .catch(err => t.fail(err));
});

test('bundle polyfills', t => {
  const dest = resolve(__dirname, 'build/polyfills/polyfills.js');

  polyfill({ dest })
    .then(() => readFile(dest))
    .then(code => t.ok(Buffer.byteLength(code) > 1, 'has some length'))
    /* .then(() => readFile(dest + '.map', { encoding: 'utf8' }))
  .then(map => JSON.parse(map))
  .then(({ version, sources }) => {
    const relSrcPath = relative(dirname(dest), entry)
    t.ok(version >= 3, 'sourcemap version >= 3')
    t.ok(sources.indexOf(relSrcPath) > -1, `sources contain ${relSrcPath}`)
  })*/
    .then(() => t.end())
    .catch(t.end);
});
