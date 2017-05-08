const test = require('tape')
const { parseFragment, serialize } = require('parse5')
const { appendText } = require('../ast/modify.js')

test('append code to script', t => {
  const code = 'if (true && true){ console.log(1); }'
  const fragment = parseFragment('<script></script>')
  const node = fragment.childNodes[0]
  appendText(node, code)
  .then(() => serialize(fragment))
  .then(result => {
    t.equal(result, `<script>${code}</script>`, 'script contains code')
  })
  .then(() => t.end())
  .catch(t.end)
})
