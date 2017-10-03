const tap = require('tap')
const { Any } = require('../')

tap.test('identity', t => {
  const found = Any.empty().fold(x => x)
  const wanted = true

  t.equal(found, wanted)
  t.end()
})

tap.test('associativity law', t => {
  // law: a.concat(b).concat(c) is equivalent to a.concat(b.concat(c))
  const a = Any.of(false)
    .concat(Any.of(true).concat(Any.of(false)))
    .fold(x => x)
  const b = Any.of(false)
    .concat(Any.of(true))
    .concat(Any.of(false))
    .fold(x => x)

  t.equal(a, b)
  t.end()
})
