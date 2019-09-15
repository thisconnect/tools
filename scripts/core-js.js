const path = require('path');
const libs = new Map();

libs.set('core-js', require.resolve('core-js'));

module.exports = function(opts) {
    return {
        resolveId(importee) {
            if (libs.has(importee.split('/')[0])) {
                const p = require.resolve('core-js').replace('core-js/index.js', importee)
                return require.resolve(p);
            }
        }
    };
}