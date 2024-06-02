import assert from 'node:assert/strict'
import { suite, test } from 'node:test'
import * as IO from './io.js'

suite('Laws', () => {
  test('left identity', () => {
    const f = (x: number) => IO.pure(() => x * 2)
    const leftside = IO.bind(f)(IO.pure(10))
    const rightside = f(10)
    const found = IO.show(leftside) === IO.show(rightside)
    const wanted = true

    assert.deepStrictEqual(found,wanted)
  })

  test('right identity', () => {
    const leftside = IO.bind(IO.pure)(IO.pure(10))
    const rightside = IO.pure(10)
    const found = IO.show(leftside) === IO.show(rightside)
    const wanted = true

    assert.deepStrictEqual(found,wanted)
  })

  test('associativity', () => {
    const f = (x: number) => IO.pure(x * 2)
    const g = (x: number) => IO.pure(x + 1)
    const leftside = IO.bind(g)(IO.bind(f)(IO.pure(10)))
    const rightside = IO.bind((x: number) => IO.bind(g)(f(x)))(IO.pure(10))
    const found = IO.show(leftside) === IO.show(rightside)
    const wanted = true

    assert.deepStrictEqual(found,wanted)
  })
})

suite('Functor', () => {
  test('fmap: maps the function over a io value', () => {
    const double = (x: number) => x * 2
    const found = IO.fmap(double)(IO.pure(2))
    const wanted = IO.pure(4)
    assert.deepStrictEqual(IO.show(found),IO.show(wanted))
  })
})

suite('Applicative', () => {
  test('pure: wrapps a value in the context', () => {
    const found = IO.pure(2)()
    const wanted = 2
    assert.deepStrictEqual(found,wanted)
  })

  test('apply: apply the io value to the function', () => {
    const double = (x: number) => x * 2
    const found = IO.apply(IO.pure(2))(IO.pure(double))
    const wanted = IO.pure(4)
    assert.deepStrictEqual(IO.show(found),IO.show(wanted))
  })
})

suite('Monad', () => {
  test('bind: apply the io value to a function returning an io, then flatten the result', () => {
    const mDouble = (x: number) => IO.pure(x * 2)
    const found = IO.bind(mDouble)(IO.pure(2))
    const wanted = IO.pure(4)
    assert.deepStrictEqual(IO.show(found),IO.show(wanted))
  })
})
