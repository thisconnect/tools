import _promise from 'es6-promise/lib/es6-promise.js';
// import _promise from 'es6-promise'
// alternative https://github.com/ysmood/yaku

export default () => {
  _promise.polyfill();
};
