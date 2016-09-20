# Build tools

- configured
- opinionated


[![Build Status](https://img.shields.io/travis/thisconnect/tools/master.svg?style=flat-square)](https://travis-ci.org/thisconnect/tools)
[![Dependencies](https://img.shields.io/david/thisconnect/tools.svg?style=flat-square)](https://david-dm.org/thisconnect/tools)
[![Dev Dependencies](https://img.shields.io/david/dev/thisconnect/tools.svg?style=flat-square)](https://david-dm.org/thisconnect/tools#info=devDependencies)


## input

path to your stylesheet

## output

path to write the bundled stylesheet and assets to

## example

```javascript
const styles = require('tool/styles')

styles({
  input: 'src/main.css',
  output: 'build/styles/bundle.css'
})
.then(() => console.log('done woopidoo!'))
.catch(err => console.error(err))
```

### src/main.css

```css
@import "material-design-icons/iconfont/material-icons.css";
@import "animate.css/source/_base.css";
@import "animate.css/source/zooming_entrances/zoomInDown.css";
@import "wide.css" (min-width: 50em);

.main {
  max-width: 400px;
  margin: 0 auto;
}
```

#### creates the following

- build
  - fonts
    - MaterialIcons-Regular.CHECKSUM.eot
    - MaterialIcons-Regular.CHECKSUM.ttf
    - MaterialIcons-Regular.CHECKSUM.woff
    - MaterialIcons-Regular.CHECKSUM.woff2
  - styles
    - bundle.css
    - bundle.css.map
    - bundle.min.css
    - bundle.min.css.map

## develop

```
npm install
npm test
```
