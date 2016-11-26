const test = require('tape')
const { parse, serialize } = require('parse5')
const { replaceFragment } = require('../ast/modify.js')

test('replace', t => {
  const doc = parse('<!doctype html><body><div>1</div><footer>2</footer></body>')
  const html = doc.childNodes[1]
  const body = html.childNodes[1]
  const footer = body.childNodes[1]

  replaceFragment(footer, 'Footer text')
  .then(ast => {
    t.equal(typeof ast, 'object', 'is object')
    t.ok('nodeName' in ast, 'has nodeName')
    t.equal(ast.nodeName, '#text', 'returns new node')
    t.equal(serialize(doc), '<!DOCTYPE html><html><head></head><body><div>1</div>Footer text</body></html>')
    t.end()
  })
  .catch(err => t.fail(err))
})
