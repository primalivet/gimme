const tap = require('tap')
const Either = require('./either')

tap.test('Either fromNullable fold Left on null', t => {
  const found = Either.fromNullable(null).inspect()
  const wanted = 'Left(null)'

  t.equal(found, wanted)
  t.end()
})

tap.test('Either fromNullable fold Left on undefined', t => {
  const found = Either.fromNullable(undefined).inspect()
  const wanted = 'Left(undefined)'

  t.equal(found, wanted)
  t.end()
})

tap.test('Either fromNullable fold Right on not null', t => {
  const found = Either.fromNullable('success').inspect()
  const wanted = 'Right(success)'

  t.equal(found, wanted)
  t.end()
})

tap.test('Either of fold Right', t => {
  const found = Either.of('success').inspect()
  const wanted = 'Right(success)'

  t.equal(found, wanted)
  t.end()
})

tap.test('Either Left fold Left', t => {
  const found = Either.Left(null).inspect()
  const wanted = 'Left(null)'

  t.equal(found, wanted)
  t.end()
})

tap.test('Either Right fold Right', t => {
  const found = Either.Right(null).inspect()
  const wanted = 'Right(null)'

  t.equal(found, wanted)
  t.end()
})

tap.test('Either Right map method does run', t => {
  const found = Either.Right(10)
    .map(x => x * 10)
    .inspect()
  const wanted = 'Right(100)'

  t.equal(found, wanted)
  t.end()
})

tap.test('Either Left map method is does NOT run', t => {
  const found = Either.Left(10)
    .map(x => x * 10)
    .inspect()
  const wanted = 'Left(10)'

  t.equal(found, wanted)
  t.end()
})

tap.test('Either Right chain method does run and unfolds nested type', t => {
  const found = Either.Right(10)
    .chain(x => Either.fromNullable(x * 10))
    .inspect()
  const wanted = 'Right(100)'

  t.equal(found, wanted)
  t.end()
})

tap.test('Either Left chain method does NOT run', t => {
  const found = Either.Left(10)
    .chain(x => Either.fromNullable(x * 10))
    .inspect()
  const wanted = 'Left(10)'

  t.equal(found, wanted)
  t.end()
})

tap.test('Either Left ap method does NOT run', t => {
  const found = Either.Left(x => x * 2)
    .ap(Either.of(10))
    .inspect()
  const wanted = 'Left(x => x * 2)'

  t.equal(found, wanted)
  t.end()
})

tap.test('Either Right ap method does run', t => {
  const found = Either.Right(x => x * 2)
    .ap(Either.of(10))
    .inspect()
  const wanted = 'Right(20)'

  t.equal(found, wanted)
  t.end()
})
