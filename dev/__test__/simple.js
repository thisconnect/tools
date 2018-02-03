const test = require('tape');
const sync = require('../sync');
const fetch = require('node-fetch');
const { resolve } = require('path');

test('fetch browser-sync', t => {
  sync({
    dir: resolve(__dirname, 'fixtures/simple'),
    open: false,
    watch: false
  })
    .then(bs => {
      return fetch(`http://localhost:${bs.getOption('port')}`, {
        headers: {
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
        }
      })
        .then(res => {
          t.equal(res.status, 200, 'has 200 status');
          t.ok(res.headers.get('content-length') > 500, 'has content-length');
          return res.text();
        })
        .then(body => {
          t.ok(
            body.match(/browser-sync\/browser-sync-client\.js/),
            'contains bs client'
          );
        })
        .then(() => {
          bs.exit(); // only exits with watch: false atm
          t.end();
        });
    })
    .catch(t.end);
});

test('fail if dir doesnt exist', t => {
  sync({
    dir: resolve(__dirname, 'fixtures/nothinghere'),
    open: false,
    watch: false
  })
    .then(bs => {
      t.fail(bs);
    })
    .catch(error => {
      t.ok(error, 'got error');
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.end();
    });
});
