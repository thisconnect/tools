const test = require('tape')
const { parse, serialize } = require('parse5')
const { replaceFragment } = require('../ast/modify.js')

test('replace fragment', t => {
  const doc = parse('<!doctype html><body><div>1</div><p>2</p></body>')
  const html = doc.childNodes[1]
  const body = html.childNodes[1]
  const div = body.childNodes[0]

  replaceFragment(div, '<svg><path /></svg>')
  .then(ast => {
    t.equal(typeof ast, 'object', 'is object')
    t.ok('nodeName' in ast, 'has nodeName')
    t.equal(ast.nodeName, 'svg', 'returns new node')
    t.equal(serialize(doc), '<!DOCTYPE html><html><head></head><body><svg><path></path></svg><p>2</p></body></html>')
    t.end()
  })
  .catch(t.end)
})
