const tap = require('tap')
const { Either } = require('../')

tap.test('either fromNullable  fold left on null', (t) => {
  const found = Either.fromNullable(null).fold(l => 'left', r => 'right')
  const wanted = 'left'

  t.equal(found, wanted)
  t.end()
})

tap.test('either fromNullable fold left on undefined', (t) => {
  const found = Either.fromNullable(undefined).fold(l => 'left', r => 'right')
  const wanted = 'left'

  t.equal(found, wanted)
  t.end()
})

tap.test('either fromNullable  fold right on not null', (t) => {
  const found = Either.fromNullable('success').fold(l => 'left', r => 'right')
  const wanted = 'right'

  t.equal(found, wanted)
  t.end()
})

tap.test('either of fold right', (t) => {
  const found = Either.of({ hello: 'world' }).fold(l => 'left', r => 'right')
  const wanted = 'right'

  t.deepEqual(found, wanted)
  t.end()
})

tap.test('either left fold left', (t) => {
  const found = Either.Left(null).fold(l => 'left', r => 'right')
  const wanted = 'left'

  t.deepEqual(found, wanted)
  t.end()
})

tap.test('either right fold right', (t) => {
  const found = Either.Right(null).fold(l => 'left', r => 'right')
  const wanted = 'right'

  t.deepEqual(found, wanted)
  t.end()
})
