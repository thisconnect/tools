const test = require('tape')
const runner = require('../runner.js')

const {
  TRAVIS, TRAVIS_OS_NAME
} = process.env

test('test karma runner', t => {

  if (TRAVIS && TRAVIS_OS_NAME == 'osx'){
    t.comment('karma currently doesnt work on osx-travis')
    return t.end()
  }

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
