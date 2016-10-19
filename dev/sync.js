const browserSync = require('browser-sync')
const { parse } = require('url')
const { resolve, relative } = require('path')
const bundleCSS = require('../styles/bundle.js')
const bundleJS = require('../scripts/bundle.js')

module.exports = ({
  dir,
  open = true
} = {}) => {
  const files = ['*.html', '*.css', 'styles/*.css', '*.js', 'scripts/*.js'].map(f => resolve(dir, f))
  console.time('browser-sync create')
  return Promise.resolve(browserSync.create('tool'))
  .then(bs => {
    console.timeEnd('browser-sync create')
    return new Promise((resolve, reject) => {
      console.time('browser-sync init')
      bs.init({
        browser: ['google chrome'],
        codeSync: true,
        // files: 'app/css/*.less',
        /*files: [{
          match: files,
          fn: (event, file) => {
            console.log(1, basename(file))
          },
          options: {
            ignored: '*.min.css'
          }
        }],*/
        /*ghostMode: {
          clicks: true,
          forms: true,
          scroll: false
        }*/
        // host: '192.168.1.1'
        injectChanges: true,
        // injectFileTypes: ['less'],
        // https: true,
        // https: { key: 'path-to-custom.key', cert: 'path-to-custom.crt' }
        logFileChanges: true,
        logPrefix: 'sync',
        middleware,
        minify: false,
        notify: true,
        open,
        port: 3000,
        // server: dir,
        server: {
          baseDir: dir
          // index: 'index.html',
          // directory: true
        },
        snippetOptions: {
          // ignorePaths: 'templates/*.html',
          rule: {
            match: /$/,
            fn: (snippet, match) => snippet + match
          }
        }
        // timestamps: false
      }, (err) => {
        console.timeEnd('browser-sync init')
        if (err){
          return reject(err)
        }
        resolve(bs)
      })
    })
  })
  .then(bs => {
    return bs.watch(files, {
      ignored: 'fixtures/*.css.map'
    }, (event, file) => {
      console.log(`${event} ${relative(dir, file)}`)
      if (event === 'change') {
        if (file.match(/\.css$/i)){
          return bs.reload('*.css')
        }
        bs.reload(file)
      }
    })
  })

  function middleware(req, res, next) {
    const { pathname } = parse(req.url)
    if (pathname.match(/\.map$/i)) {
      console.log(pathname)
    }
    if (pathname.match(/\.js$/i)) {
      console.log(pathname)
      return bundleJS({
        src: resolve(dir + pathname),
        dest: resolve(dir + pathname.replace(/\.js$/, '.min.js')),
        write: false
      })
      .then(({ code, map }) => {
        res.setHeader('Content-Type', 'application/javascript')
        res.end(code + '\n//# sourceMappingURL=' + map.toUrl())
      })
      .catch(err => console.log(err))
    }
    if (pathname.match(/\.css$/i)) {
      console.log('middleware', pathname)
      return bundleCSS({
        src: resolve(dir + pathname),
        dest: pathname,
        map: { inline: true }
      })
      // .then(result => minify(result))
      .then(result => {
        // cache[`${pathname}.map`] = result.map
        res.setHeader('Content-Type', 'text/css')
        res.end(result.css)
      })
      .catch(err => console.log(err))


    }
    next()
  }

}
