const test = require('tape');
const { parse } = require('parse5');
const { getNodeById, getNodesByTagName } = require('../ast/match.js');

test('getNodesByTagName', t => {
  const doc = parse(
    '<!doctype html><div><p><span></span><span></span></p></div>'
  );
  getNodesByTagName(doc, 'span')
    .then(nodes => {
      t.ok(Array.isArray(nodes), 'returns an array');
      t.equal(nodes.length, 2, 'has 2 nodes');
      t.equal(nodes[0].tagName, 'span', 'element is a span');
      t.end();
    })
    .catch(t.end);
});

test('getNodeById', t => {
  const doc = parse(
    '<!doctype html><div><p><span id=foo></span><span></span></p></div>'
  );
  getNodeById(doc, 'foo')
    .then(node => {
      t.equal(typeof node, 'object', 'is object');
      t.equal(node.tagName, 'span', 'element is a span');
      t.equal(node.attrs[0].value, 'foo', 'first attribute has value foo');
      t.end();
    })
    .catch(t.end);
});

/*
test('match by tagName', t => {
  const doc = parse('<!doctype html><span></span><div><p><a href="#"></a></p></div>')
  const html = doc.childNodes[1]
  const body = html.childNodes[1]

  match(body, 'a')
  .then(ast => {
    t.equal(typeof ast, 'object', 'is object')
    t.end()

    return;

  })
  .catch(t.end)
})

test('match descendant', t => {
  const doc = parse('<!doctype html><div><p></p><p></p></div>')
  const html = doc.childNodes[1]
  const body = html.childNodes[1]

  match(body, 'div p')
  .then(nodes => {
    console.log('found', nodes)
    t.equal(typeof nodes, 'object', 'is object')
    t.end()
  })
  .catch(t.end)
})

test('match by classNames', t => {
  const doc = parse('<!doctype html><div class="foo bar"></div>')
  const html = doc.childNodes[1]
  const body = html.childNodes[1]

  match(body, '.foo.bar')
  .then(ast => {
    t.equal(typeof ast, 'object', 'is object')
    t.end()
  })
  .catch(t.end)
})
*/
