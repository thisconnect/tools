const { findNodes, toHTML } = require('./index.js')
const { replaceFragment } = require('./modify.js')
const SVGO = require('svgo')
const svgo = new SVGO({
  plugins: [
    { removeXMLNS: true }
  ]
})

const minify = node => {
  toHTML(node.parentNode)
  .then(svg => {
    return new Promise((resolve/*, reject*/) => {
      svgo.optimize(svg, result => {
        resolve(result)
      })
    })
  })
  .then(svg => replaceFragment(node, svg.data))
}

module.exports = nodes => {
  return findNodes(nodes, 'svg')
  .then(svgs => Promise.all(svgs.map(minify)))
}
