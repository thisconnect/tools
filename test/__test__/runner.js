const test = require('tape')
const runner = require('../runner.js')

test('test karma runner', t => {

  runner({
    basePath: __dirname,
    files: [
      // 'fixtures/*.html',
      // 'fixtures/*.css',
      'fixtures/*.karma.js'
    ]
  })
  // .then(exitCode => console.log())
  .then(exitCode => t.equal(exitCode, 0, 'exitCode is 0'))
  .then(() => t.end())
  .catch(err => t.fail(err))
})
