const runner = require('../runner.js')

console.log(process.cwd())

runner({
  basePath: __dirname,
  files: [
    // 'fixtures/*.html',
    // 'fixtures/*.css',
    'fixtures/*.karma.js'
  ]
})
.then(() => console.log('run'))
.catch(err => console.log(err))
