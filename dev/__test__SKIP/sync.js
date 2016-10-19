const sync = require('../sync.js')
const { resolve } = require('path')

sync({
  dir: resolve(__dirname, 'fixtures/simple'),
  open: true
})
.then(() => console.log('sync ready'))
.catch(err => console.log(err))
