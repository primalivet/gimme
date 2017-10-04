const tap = require('tap')
const { Either } = require('../')

tap.test('either fromNullable  fold left on null', t => {
  const found = Either.fromNullable(null).fold(l => `Left(${l})`, r => `Right(${r})`)
  const wanted = 'Left(null)'

  t.equal(found, wanted)
  t.end()
})

tap.test('either fromNullable fold left on undefined', t => {
  const found = Either.fromNullable(undefined).fold(l => `Left(${l})`, r => `Right(${r})`)
  const wanted = 'Left(undefined)'

  t.equal(found, wanted)
  t.end()
})

tap.test('either fromNullable  fold right on not null', t => {
  const found = Either.fromNullable('success').fold(l => `Left(${l})`, r => `Right(${r})`)
  const wanted = 'Right(success)'

  t.equal(found, wanted)
  t.end()
})

tap.test('either of fold right', t => {
  const found = Either.of('success').fold(l => `Left(${l})`, r => `Right(${r})`)
  const wanted = 'Right(success)'

  t.deepEqual(found, wanted)
  t.end()
})

tap.test('either left fold left', t => {
  const found = Either.Left(null).fold(l => `Left(${l})`, r => `Right(${r})`)
  const wanted = 'Left(null)'

  t.deepEqual(found, wanted)
  t.end()
})

tap.test('either right fold right', t => {
  const found = Either.Right(null).fold(l => `Left(${l})`, r => `Right(${r})`)
  const wanted = 'Right(null)'

  t.equal(found, wanted)
  t.end()
})

tap.test('either right map method is applied', t => {
  const found = Either.Right(10).map(x => x * 10).fold(l => `Left(${l})`, r => `Right(${r})`)
  const wanted = 'Right(100)'

  t.equal(found, wanted)
  t.end()
})

tap.test('either left map method is NOT applied', t => {
  const found = Either.Left(10).map(x => x * 10).fold(l => `Left(${l})`, r => `Right(${r})`)
  const wanted = 'Left(10)'

  t.equal(found, wanted)
  t.end()
})

tap.test('either right chain method is applied and unfolds nested type', t => {
  const found = Either.Right(10).chain(x => Either.fromNullable(x * 10)).fold(l => `Left(${l})`, r => `Right(${r})`)
  const wanted = 'Right(100)'

  t.equal(found, wanted)
  t.end()
})

tap.test('either left chain method is NOT applied', t => {
  const found = Either.Left(10).chain(x => Either.fromNullable(x * 10)).fold(l => `Left(${l})`, r => `Right(${r})`)
  const wanted = 'Left(10)'

  t.equal(found, wanted)
  t.end()
})
