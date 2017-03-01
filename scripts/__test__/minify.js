const test = require('tape')
const minify = require('../minify.js')

test('minify', t => {
  minify(`
    /* comment */

    (function(long){
      // comment
      console.log(long * 2)
    })(1)
  `)
  .then(min => t.equal(min, '!function(o){console.log(2)}(1);'))
  .then(() => t.end())
  .catch(err => t.fail(err))
})
