const { libs } = require('../bundle.js')
const { resolve } = require('path')

module.exports = ({ dest }) => {
  return libs({
    entry: resolve(__dirname, './all.js'),
    dest,
    format: 'iife'
  })
}
