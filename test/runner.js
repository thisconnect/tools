const { Server } = require('karma')
const buble = require('rollup-plugin-buble')
// const tapSpec = require('tap-spec')
const { resolve } = require('path')

const { TRAVIS } = process.env // TRAVIS_OS_NAME

module.exports = ({
  basePath,
  files
}) => {

  const preprocessors = files.reduce((a, b) => {
    if (b.match(/\.js$/i)){
      a[b] = ['rollup']
    }
    return a
  }, {})

  const browsers = TRAVIS ? ['Firefox'] : [
    (TRAVIS) ? 'Chrome_travis_ci' : 'Chrome', //  && TRAVIS_OS_NAME == 'linux'
    'Chrome', 'Firefox'
  ]

  return Promise.resolve({
    autoWatch: false,
    basePath,
    browsers,
    browserConsoleLogOptions: {
      level: 'error',
      format: '%b %T: %m',
      terminal: false
    },
    browserDisconnectTimeout: 3000,
    browserDisconnectTolerance: 0,
    browserNoActivityTimeout: 25000,
    captureTimeout: 10000,
    // client: { captureConsole: false },
    colors: true,
    concurrency: 1,
    // exclude
    files: [
      resolve(__dirname, 'build/tape.min.js'),
      ...files
    ],
    frameworks: ['tap'],
    logLevel: 'WARN',
    // port: 9876,
    plugins: [
      'karma-rollup-plugin',
      'karma-tap',
      'karma-tap-pretty-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
    ],
    preprocessors,
    // retryLimit: 0,
    // reporters: ['tap-pretty'],
    rollupPreprocessor: {
      external: ['tape'],
      format: 'iife',
      globals: {
        'tape': 'tape'
      },
      plugins: [
        buble()
      ],
      sourceMap: 'inline'
    },
/*    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },*/
    singleRun: true,
    tapReporter: {
      // prettify: tapSpec
    }
  })
  .then(config => {
    return new Promise((resolve, reject) => {
      const server = new Server(config, exitCode => {
        // process.exit(exitCode)
        console.log('done!!! ', exitCode)
        if (exitCode){
          reject(exitCode)
        } else {
          resolve(exitCode)
        }
      })

      server.on('browser_register', browser => {
        console.log(`\n____browser_register ${browser.name}`)
      })

      server.on('browser_error', (browser, error) => {
        console.log('\n____browser_error', error)
        // console.log('browser_error', browser, error)
      })

      server.on('browser_start', (browser, info) => {
        console.log(`\n____browser_start ${browser.name}`, info)
      })

      server.on('browser_complete', (browser, result) => {
        console.log(`\n____browser_complete ${browser.name}`, result)
      })

      server.on('browsers_change', (/*browsers*/) => {
        // console.log('browsers_change')
        console.log('\n____browsers_change')
      })
      server.on('browsers_ready', (/*browsers*/) => {
        // console.log('browsers_change')
        console.log('\n____browsers_ready')
      })

      server.on('run_start', (/*browsers*/) => {
        // console.log('run_start')
        console.log('\n____run_start')
      })


      server.on('run_complete', (browsers, results) => {
        console.log('\n____run_complete', results)
        // console.log('run_complete', browsers, results)
      })

      server.start()
/*
      server.refreshFiles()
      .then(() => console.log('refreshFiles'))
      .catch(err => console.log(err))
      */

    })
  })

}

/*



*/



/*
// The equivalent of karma run.


var runner = require('karma').runner
runner.run({port: 9876}, function(exitCode) {
  console.log('Karma has exited with ' + exitCode)
  process.exit(exitCode)
})

// This function will signal a running server to stop. The equivalent of karma stop.

var stopper = require('karma').stopper
runner.stop({port: 9876}, function(exitCode) {
  if (exitCode === 0) {
    console.log('Server stop as initiated')
  }
  process.exit(exitCode)
})


*/
