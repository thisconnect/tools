import tape from 'tape'

tape('test', t => {
  console.log('test ?')
  console.log(Object.keys(tape))
  t.ok(true, 'true is ok')
  t.end()
})

/*
tap.test('test ', t => {
  t.ok(true, 'true is ok')
  t.pass('tape pass 2')
  t.end()
})
.catch(tap.threw)
*/
