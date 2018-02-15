const pluginReplace = require('rollup-plugin-replace');
const npm = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
// const json = require('rollup-plugin-json')
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const filesize = require('rollup-plugin-filesize');
// const builtins = require('rollup-plugin-node-builtins')

const presetReact = require('babel-preset-react');
const presetStage3 = require('babel-preset-stage-3');
const presetES2015Rollup = require('babel-preset-es2015-rollup');

exports.getPlugins = ({ libs, minify, replace }) => {
  const plugins = [];

  if (replace) {
    plugins.push(pluginReplace(replace));
  }

  if (libs) {
    plugins.push(
      npm({
        jsnext: true
      }),
      commonjs({
        // include: ['node_modules/**'],
        namedExports: {
          'node_modules/react/index.js': ['Component', 'PureComponent', 'Children', 'createElement']
        }
      })
    );
  }

  plugins.push(
    babel({
      babelrc: false,
      // exclude: 'node_modules/**',
      presets: [presetReact, presetStage3, presetES2015Rollup]
      // externalHelpers: true,
      // runtimeHelpers: true
    })
  );

  if (minify) {
    plugins.push(
      uglify({
        compress: {
          ie8: true,
          warnings: false
        }
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
