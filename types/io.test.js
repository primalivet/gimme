const tap = require('tap')
const IO = require('./io')

tap.test(
  'IO map takes a function which lazily works on the return value of the wrapped function',
  t => {
    const found = IO(() => 10)
      .map(x => x * 2)
      .inspect()
    const wanted = 'IO(20)'

    t.equal(found, wanted)
    t.end()
  }
)

tap.test(
  'IO chain takes a function which returns a IO type and unwraps one level',
  t => {
    const found = IO(() => 3)
      .chain(x => IO(() => x * 2))
      .inspect()
    const wanted = 'IO(6)'

    t.equal(found, wanted)
    t.end()
  }
)

tap.test('IO ap applies the value of a IO type to the wrapped function', t => {
  const found = IO.of(x => y => x * y)
    .ap(IO.of(3))
    .ap(IO.of(4))
    .inspect()
  const wanted = 'IO(12)'

  t.equal(found, wanted)
  t.end()
})
