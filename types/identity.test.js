const tap = require('tap')
const Identity = require('./identity')

tap.test(
  'Identity map takes a function which works on the wrapped value',
  t => {
    const found = Identity.of(10)
      .map(x => x * 10)
      .inspect()
    const wanted = 'Identity(100)'

    t.equal(found, wanted)
    t.end()
  }
)

tap.test(
  'Identity chain takes a function that returns same type and unwrap one level',
  t => {
    const found = Identity.of(10)
      .chain(x => Identity.of(x * 10))
      .inspect()
    const wanted = 'Identity(100)'

    t.equal(found, wanted)
    t.end()
  }
)

tap.test('Identity ap applies a wrapped value to a wrapped function', t => {
  const found = Identity.of(x => y => x * y)
    .ap(Identity.of(10))
    .ap(Identity.of(10))
    .inspect()
  const wanted = 'Identity(100)'

  t.equal(found, wanted)
  t.end()
})

tap.test('Identity fold takes a function and unwraps the value', t => {
  const found = Identity.of(10).fold(x => x)
  const wanted = 10

  t.equal(found, wanted)
  t.end()
})
