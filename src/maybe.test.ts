import assert from 'node:assert/strict'
import { suite, test } from 'node:test'
import * as M from './maybe.js'
import { pipe } from './function.js'

suite('Laws', () => {
  test('left identity', () => {
    const f = (x: number) => M.pure(x * 2)
    const leftside = M.bind(f)(M.pure(10))
    const rightside = f(10)
    const found = M.show(leftside) === M.show(rightside)
    const wanted = true

    assert.deepStrictEqual(found, wanted)
  })

  test('right identity', () => {
    const leftside = M.bind(M.pure)(M.pure(10))
    const rightside = M.pure(10)
    const found = M.show(leftside) === M.show(rightside)
    const wanted = true

    assert.deepStrictEqual(found, wanted)
  })

  test('associativity', () => {
    const f = (x: number) => M.pure(x * 2)
    const g = (x: number) => M.pure(x + 1)
    const leftside = M.bind(g)(M.bind(f)(M.pure(10)))
    const rightside = M.bind((x: number) => M.bind(g)(f(x)))(M.pure(10))
    const found = M.show(leftside) === M.show(rightside)
    const wanted = true

    assert.deepStrictEqual(found, wanted)
  })
})

suite('Predicates', () => {
  test('isJust', () => {
    const found = [M.isJust(M.just('')), M.isJust(M.nothing())]
    const wanted = [true, false]

    assert.deepStrictEqual(found, wanted)
  })

  test('isNothing', () => {
    const found = [M.isNothing(M.just('')), M.isNothing(M.nothing())]
    const wanted = [false, true]

    assert.deepStrictEqual(found, wanted)
  })
})

suite('Constructors', () => {
  test('nothing', () => {
    const found = pipe(M.nothing(), M.show)
    const wanted = 'Nothing'

    assert.deepStrictEqual(found, wanted)
  })

  test('nothing', () => {
    const found = pipe(M.just('success'), M.show)
    const wanted = 'Just("success")'

    assert.deepStrictEqual(found, wanted)
  })

  test('fromNullable: Nothing when value is null', () => {
    const found = pipe(null, M.fromNullable)
    const wanted = M.nothing()

    assert.deepStrictEqual(M.show(found), M.show(wanted))
  })

  test('fromNullable: Nothing when value is undefined', () => {
    const found = pipe(undefined, M.fromNullable)
    const wanted = M.nothing()

    assert.deepStrictEqual(M.show(found), M.show(wanted))
  })

  test('fromNullable: Just when value is not null or undefined', () => {
    const found = pipe('hello world', M.fromNullable)
    const wanted = M.just('hello world')

    assert.deepStrictEqual(M.show(found), M.show(wanted))
  })

  test('fromPredicate: Just when predicate is true', () => {
    const found = pipe(['hello', 'world'], M.fromPredicate(Array.isArray))
    const wanted = M.just(['hello', 'world'])

    assert.deepStrictEqual(M.show(found), M.show(wanted))
  })

  test('fromPredicate: Nothing when predicate is false', () => {
    const found = pipe('hello world', M.fromPredicate(Array.isArray))
    const wanted = M.nothing()

    assert.deepStrictEqual(M.show(found), M.show(wanted))
  })
})

suite('Destructors', () => {
  test('fold: calls onNothing on nothing value', () => {
    const found = M.fold(
      () => 'none',
      () => 'some',
    )(M.nothing())
    const wanted = 'none'
    assert.deepStrictEqual(found, wanted)
  })

  test('fold: calls onJust on right value', () => {
    const found = M.fold(
      () => 'none',
      () => 'some',
    )(M.just('hello world'))
    const wanted = 'some'
    assert.deepStrictEqual(found, wanted)
  })
})

suite('Functor', () => {
  test('fmap: maps the function over a just value', () => {
    const double = (x: number) => x * 2
    const found = M.fmap(double)(M.just(2))
    const wanted = M.just(4)
    assert.deepStrictEqual(M.show(found), M.show(wanted))
  })

  test('fmap: dont do anything on a nothing value', () => {
    const double = (x: number) => x * 2
    const found = M.fmap(double)(M.nothing())
    const wanted = M.nothing()
    assert.deepStrictEqual(M.show(found), M.show(wanted))
  })
})

suite('Applicative', () => {
  test('pure: wrapps a value in the context', () => {
    const found = M.pure(2)
    const wanted = M.just(2)
    assert.deepStrictEqual(M.show(found), M.show(wanted))
  })

  test('apply: apply the just value to the function', () => {
    const double = (x: number) => x * 2
    const found = M.apply(M.just(2))(M.just(double))
    const wanted = M.just(4)
    assert.deepStrictEqual(M.show(found), M.show(wanted))
  })

  test('apply: dont do anything on a nothing function', () => {
    const found = M.apply(M.just(2))(M.nothing())
    const wanted = M.nothing()
    assert.deepStrictEqual(M.show(found), M.show(wanted))
  })
})

suite('Monad', () => {
  test('bind: apply the just value to a function returning an maybe, then flatten the result', () => {
    const mDouble = (x: number) => M.pure(x * 2)
    const found = M.bind(mDouble)(M.pure(2))
    const wanted = M.just(4)
    assert.deepStrictEqual(M.show(found), M.show(wanted))
  })

  test('bind: dont do anything to a nothing value', () => {
    const mDouble = (x: number) => M.pure(x * 2)
    const found = M.bind(mDouble)(M.nothing())
    const wanted = M.nothing()
    assert.deepStrictEqual(M.show(found), M.show(wanted))
  })
})
