const pluginReplace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
// const json = require('rollup-plugin-json')
const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const filesize = require('rollup-plugin-filesize');
// const builtins = require('rollup-plugin-node-builtins')

const presetReact = require('@babel/preset-react');
const presetEnv = require('@babel/preset-env');

exports.getPlugins = ({ libs, minify, replace }) => {
  const plugins = [];

  if (replace) {
    plugins.push(pluginReplace(replace));
  }

  if (libs) {
    plugins.push(
      resolve({
        mainFields: ['browser', 'module', 'main'],
        preferBuiltins: false
      }),
      commonjs({
        ignoreGlobal: true,
        // include: ['node_modules/**'],
        namedExports: {
          'node_modules/react/index.js': [
            'Component',
            'PureComponent',
            'Children',
            'createElement',
            'Fragment'
          ]
        }
      })
    );
  }

  plugins.push(
    babel({
      babelrc: false,
      ignore: ['node_modules'],
      // exclude: 'node_modules/**',
      // externalHelpers: true,
      // runtimeHelpers: true
      presets: [
        [presetReact],
        [presetEnv, {
          useBuiltIns: 'usage', // 'entry'
          targets: { ie: 11 },
          debug: false
        }]
      ]
    })
  );

  if (minify) {
    plugins.push(
      terser({
        ecma: 5
      })
    );
  }

  plugins.push(
    filesize({
      format: {
        // base: 10,
        exponent: 0
        // standard: 'iec',
        // bits: true
      }
    })
  );

  return plugins;
};
