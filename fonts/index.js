const { resolve } = require('path');
const { readFile, writeFile } = require('fildes');
const globby = require('globby');
const webfont = require('webfont').default;
const isSvg = require('is-svg');

const svgo = require('svgo');

// svgo -f source/ dest/

webfont({
  files: resolve(__dirname, '*.svg'),
  fontName: 'iconfont',
  template: 'css',
  cssTemplateClassName: 'if'
}).then(result => {
  console.log(Object.keys(result));
  console.log(result);

  return Promise.all([
    writeFile('./iconfont.css', result.styles),
    writeFile('./iconfont.svg', result.svg),
    writeFile('./iconfont.ttf', result.ttf),
    writeFile('./iconfont.eot', result.eot),
    writeFile('./iconfont.woff', result.woff),
    writeFile('./iconfont.woff2', result.woff2)
  ]);
});
