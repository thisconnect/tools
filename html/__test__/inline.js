const test = require('tape');
const { resolve } = require('path');
const { readFile, rm } = require('fildes-extra');
const inlineHTML = require('../index.js');

test('cleanup', t => {
  rm(resolve(__dirname, 'build'))
    .then(() => t.end())
    .catch(err => t.fail(err));
});

test('inline HTML', t => {
  const src = resolve(__dirname, 'fixtures/index.html');
  const dest = resolve(__dirname, 'build/index.html');

  inlineHTML({ src, dest })
    .then(() => readFile(dest, { encoding: 'utf8' }))
    .then(result => {
      t.ok(result.indexOf('<script src=') == -1, 'has inlined script');
      t.ok(result.indexOf('<svg') > -1, 'has svg element');
      t.ok(result.includes('4rem'), 'a value from styles/main.css')
      t.ok(
        result.indexOf('rel=stylesheet') == -1,
        'has no external stylesheet'
      );
      // t.ok(result.indexOf('xmlns="http://www.w3.org/2000/svg"') == -1, 'no xmlns attribute')
      return inlineHTML({ src, dest })
        .then(() => readFile(dest, { encoding: 'utf8' }))
        .then(second => {
          t.equal(result, second, 'same result on second run');
        });
    })
    .then(() => t.end())
    .catch(t.end);
});
