import assert from 'node:assert/strict'
import { suite, test } from 'node:test'
import { pipe } from './function.js'
import * as E from './either.js'

suite('Laws', () => {
  test('left identity', () => {
    const f = (x: number) => E.pure(x * 2)
    const leftside = E.bind(f)(E.pure(10))
    const rightside = f(10)
    const found = E.show(leftside) === E.show(rightside)
    const wanted = true

    assert.deepStrictEqual(found, wanted)
  })

  test('right identity', () => {
    const leftside = E.bind(E.pure)(E.pure(10))
    const rightside = E.pure(10)
    const found = E.show(leftside) === E.show(rightside)
    const wanted = true

    assert.deepStrictEqual(found, wanted)
  })

  test('associativity', () => {
    const f = (x: number) => E.pure(x * 2)
    const g = (x: number) => E.pure(x + 1)
    const leftside = E.bind(g)(E.bind(f)(E.pure(10)))
    const rightside = E.bind((x: number) => E.bind(g)(f(x)))(E.pure(10))
    const found = E.show(leftside) === E.show(rightside)
    const wanted = true

    assert.deepStrictEqual(found, wanted)
  })
})

suite('Predicates', () => {
  test('isRight', () => {
    const found = [E.isRight(E.right('')), E.isRight(E.left(''))]
    const wanted = [true, false]

    assert.deepStrictEqual(found, wanted)
  })

  test('isLeft', () => {
    const found = [E.isLeft(E.right('')), E.isLeft(E.left(''))]
    const wanted = [false, true]

    assert.deepStrictEqual(found, wanted)
  })
})

suite('Constructors', () => {
  test('left', () => {
    const found = pipe(E.left('reason'), E.show)
    const wanted = 'Left("reason")'

    assert.deepStrictEqual(found, wanted)
  })

  test('right', () => {
    const found = pipe(E.right('success'), E.show)
    const wanted = 'Right("success")'

    assert.deepStrictEqual(found, wanted)
  })

  test('fromNullable: Left when value is null', () => {
    const found = pipe(
      null,
      E.fromNullable((x) => x),
    )
    const wanted = E.left(null)

    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })

  test('fromNullable: Left when value is undefined', () => {
    const found = pipe(
      undefined,
      E.fromNullable((x) => x),
    )
    const wanted = E.left(undefined)

    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })

  test('fromNullable: Right when value is not null or undefined', () => {
    const found = pipe(
      'hello world',
      E.fromNullable((x) => x),
    )
    const wanted = E.right('hello world')

    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })

  test('fromPredicate: Right when predicate is true', () => {
    const found = pipe(
      ['hello', 'world'],
      E.fromPredicate(Array.isArray)((x) => x),
    )
    const wanted = E.right(['hello', 'world'])

    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })

  test('fromPredicate: Left when predicate is false', () => {
    const found = pipe(
      'hello world',
      E.fromPredicate(Array.isArray)((x) => x),
    )
    const wanted = E.left('hello world')

    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })

  test('tryCatch: Right when function does not throw', () => {
    const found = E.tryCatch(
      () => {
        throw new Error('failure')
      },
      (x) => x,
    )
    const wanted = E.left(new Error('failure'))

    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })

  test('tryCatch: Left when function does throw', () => {
    const found = E.tryCatch(
      () => {
        return 'success'
      },
      (x) => x,
    )
    const wanted = E.right('success')

    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })
})

suite('Destructors', () => {
  test('fold: calls onLeft on left value', () => {
    const found = E.fold(
      () => 'failure',
      () => 'success',
    )(E.left(''))
    const wanted = 'failure'
    assert.deepStrictEqual(found, wanted)
  })

  test('fold: calls onRight on right value', () => {
    const found = E.fold(
      () => 'failure',
      () => 'success',
    )(E.right(''))
    const wanted = 'success'
    assert.deepStrictEqual(found, wanted)
  })
})

suite('Functor', () => {
  test('fmap: maps the function over a right value', () => {
    const double = (x: number) => x * 2
    const found = E.fmap(double)(E.right(2))
    const wanted = E.right(4)
    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })

  test('fmap: dont do anything on a left value', () => {
    const double = (x: number) => x * 2
    const found = E.fmap(double)(E.left(2))
    const wanted = E.left(2)
    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })
})

suite('Bifunctor', () => {
  test('bimap: apply a Left value to the first given function', () => {
    const inc = (x: number) => x + 1
    const double = (x: number) => x * 2
    const found = E.bimap(inc, double)(E.left(2))
    const wanted = E.left(3)
    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })

  test('bimap: apply a Right value to the second given function', () => {
    const inc = (x: number) => x + 1
    const double = (x: number) => x * 2
    const found = E.bimap(inc, double)(E.right(2))
    const wanted = E.right(4)
    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })

  test('fmapLeft: apply a Left value to a function', () => {
    const double = (x: number) => x * 2
    const found = E.fmapLeft(double)(E.left(2))
    const wanted = E.left(4)
    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })

  test('fmapLeft: leave a Right value untouched', () => {
    const double = (x: number) => x * 2
    const found = E.fmapLeft(double)(E.right(2))
    const wanted = E.right(2)
    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })
})

suite('Applicative', () => {
  test('pure: wrapps a value in the context', () => {
    const found = E.pure(2)
    const wanted = E.right(2)
    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })

  test('apply: apply the right value to the function', () => {
    const double = (x: number) => x * 2
    const found = E.apply(E.right(2))(E.right(double))
    const wanted = E.right(4)
    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })

  test('apply: dont do anything on a left function', () => {
    const double = (x: number) => x * 2
    const found = E.apply(E.right(2))(E.left(double))
    const wanted = E.left(double)
    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })
})

suite('Monad', () => {
  test('bind: apply the right value to a function returning an either, then flatten the result', () => {
    const mDouble = (x: number) => E.pure(x * 2)
    const found = E.bind(mDouble)(E.pure(2))
    const wanted = E.right(4)
    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })

  test('bind: dont do anything to a left value', () => {
    const mDouble = (x: number) => E.pure(x * 2)
    const found = E.bind(mDouble)(E.left(2))
    const wanted = E.left(2)
    assert.deepStrictEqual(E.show(found), E.show(wanted))
  })
})
