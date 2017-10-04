const tap = require('tap')
const { Sum } = require('../')

tap.test('identity', t => {
  const found = Sum.empty(0).fold(x => x)
  const wanted = 0

  t.equal(found, wanted)
  t.end()
})

tap.test('associativity law', t => {
  // law: a.concat(b).concat(c) is equivalent to a.concat(b.concat(c))
  const a = Sum.of(10)
    .concat(Sum.of(5).concat(Sum.of(10)))
    .fold(x => x)
  const b = Sum.of(10)
    .concat(Sum.of(5))
    .concat(Sum.of(10))
    .fold(x => x)

  t.equal(a, b)
  t.end()
})
