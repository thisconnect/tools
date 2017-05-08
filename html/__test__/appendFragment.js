const test = require('tape')
const { parseFragment, serialize } = require('parse5')
const { appendFragment } = require('../ast/modify.js')

test('append fragments to a node', t => {
  const fragment = parseFragment('<div></div>')
  const node = fragment.childNodes[0]
  appendFragment(node, '1')
  .then(() => appendFragment(node, ' & 2 '))
  .then(() => appendFragment(node, '<span>3</span>'))
  .then(() => serialize(fragment))
  .then(result => {
    const expected = '<div>1 &amp; 2 <span>3</span></div>'
    t.equal(result, expected, 'contains 1 &amp; 2 <span>3</span>')
  })
  .then(() => t.end())
  .catch(t.end)
})

test('append fragment after node', t => {
  const fragment = parseFragment('<div></div>')
  appendFragment(fragment, '<div>4</div>')
  .then(() => serialize(fragment))
  .then(result => {
    const expected = '<div></div><div>4</div>'
    t.equal(result, expected, 'expects <div></div><div>4</div>')
  })
  .then(() => t.end())
  .catch(t.end)
})
