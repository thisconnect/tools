const { Server } = require('karma')
const buble = require('rollup-plugin-buble')
const tapSpec = require('tap-spec')
const { resolve } = require('path')

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

  return karma({
    autoWatch: false,
    basePath,
    browsers: [ 'Chrome' ], // 'Firefox' process.env.TRAVIS ? 'Chrome_travis_ci'
    browserConsoleLogOptions: {
      level: 'error',
      format: '%b %T: %m',
      terminal: false
    },
    // client: { captureConsole: false },
    colors: true,
    // concurrency: 2,
    // exclude
    files: [
      resolve(__dirname, 'build/tape.min.js'),
      ...files
    ],
    frameworks: ['tap'],
    logLevel: 'ERROR',
    // port: 9876,
    plugins: [
      'karma-rollup-plugin',
      'karma-tap',
      'karma-tap-pretty-reporter',
      // 'karma-firefox-launcher',
      'karma-chrome-launcher'
    ],
    preprocessors,
    // reporters: [ 'dots' ],
    reporters: ['tap-pretty'],
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
      prettify: tapSpec
    }
  })
  .then(server => {
    server.start()

    server.refreshFiles()
    .then(() => console.log('refreshFiles'))
    .catch(err => console.log(err))

    return server
  })

}

function karma(config){
  return Promise.resolve(config)
  .then(config => {
    return new Server(config, exitCode => {
      console.log('Karma has exited with ' + exitCode)
      process.exit(exitCode)
    })
  })
  .then(server => {
/*
    server.on('browser_register', browser => {
      console.log('browser_register')
      // console.log('browser_register', browser)
    })

    server.on('browser_error', (browser, error) => {
      console.log('browser_error', error)
      // console.log('browser_error', browser, error)
    })

    server.on('browser_start', (browser, info) => {
      console.log('browser_start')
      // console.log('browser_start', browser, info)
    })

    server.on('browser_complete', (browser, result) => {
      console.log('browser_complete', result)
      // console.log('browser_complete', browser, result)
    })

    server.on('browsers_change', (browsers) => {
      console.log('browsers_change')
      // console.log('browsers_change', browsers)
    })

    server.on('run_start', (browsers) => {
      console.log('run_start')
      // console.log('run_start', browsers)
    })

    server.on('run_complete', (browsers, results) => {
      console.log('run_complete', results)
      // console.log('run_complete', browsers, results)
    })
*/
    return server

  })

}




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
