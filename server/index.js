const http = require('http');
const st = require('st');

module.exports = (options) => {

  const config = Object.assign({
    path: process.cwd(), // resolved against the process cwd
    // url: 'static/', // defaults to '/'

    cache: false,

    // indexing options
    index: true, // auto-index, the default
    dot: false, // default: return 403 for any url with a dot-file part
    passthrough: false, // returns a 404 when a file or an index is not found
    gzip: true, // default: compresses the response with gzip compression
    cors: false // default: static assets not accessible from other domains
  }, options);

  console.log(config);

  const mount = st(config);

  return http.createServer((req, res) => {
    if (mount(req, res)) return; // serving a static file
    res.end('this is not a static file');
  });
};
