const test = require('tape')
const { parse, parseFragment } = require('parse5')
const { toHTML } = require('../ast/index.js')

test('document toHTML', t => {
  const doc = parse('<!DOCTYPE html><div>1</div><p>2</p>')
  toHTML(doc)
  .then(html => {
    t.equal(typeof html, 'string')
    t.equal(html, '<!DOCTYPE html><html><head></head><body><div>1</div><p>2</p></body></html>')
  })
  .then(() => {
    const html = doc.childNodes[1]
    return html.childNodes[1]
  })
  .then(body => toHTML(body.childNodes[1]))
  .then(result => {
    t.equal(typeof result, 'string', 'is string')
    t.equal(result, '<p>2</p>', 'is p element')
    t.end()
  })
  .catch(err => t.fail(err))
})

test('fragment toHTML', t => {
  const fragment = parseFragment('<div><p>3</p></div>')
  toHTML(fragment.childNodes[0])
  .then(result => {
    t.equal(typeof result, 'string')
    t.equal(result, '<div><p>3</p></div>')
    t.end()
  })
  .catch(err => t.fail(err))
})
