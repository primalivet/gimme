import assert from 'node:assert/strict'
import { suite, test } from 'node:test'
import { I, K, A, T, W, C, B, S, S2, P, Y } from './combinators'

suite('Combinators', () => {
  test('I', () => {
    const found = I('hello world')
    const wanted = 'hello world'
    assert.deepStrictEqual(found, wanted)
  })

  test('K', () => {
    const found = K(true)(false)
    const wanted = true
    assert.deepStrictEqual(found, wanted)
  })

  test('A', () => {
    const found = A(String)(true)
    const wanted = 'true'
    assert.deepStrictEqual(found, wanted)
  })

  test('T', () => {
    const found = T(true)(String)
    const wanted = 'true'
    assert.deepStrictEqual(found, wanted)
  })

  test('W', () => {
    const add = (x: number) => (y: number) => x + y
    const found = W(add)(2)
    const wanted = 4
    assert.deepStrictEqual(found, wanted)
  })

  test('C', () => {
    const fullname = (fst: string) => (snd: string) => fst + snd
    const found = C(fullname)('John')('Doe')
    const wanted = 'DoeJohn'
    assert.deepStrictEqual(found, wanted)
  })

  test('B', () => {
    const upper = (x: string): string => x.toUpperCase()
    const dashed = (x: string): string => x.replace(' ', '-')
    // HINT: TS inference can't infer the generics for B so have to explicit define generics
    const found = B<string, string, string>(upper)(dashed)('hello world')
    const wanted = 'HELLO-WORLD'
    assert.deepStrictEqual(found, wanted)
  })

  test('S', () => {
    const double = (x: number): number => x * 2
    const mult =
      (x: number) =>
      (y: number): number =>
        x * y
    const found = S(mult)(double)(10)
    const wanted = 200
    assert.deepStrictEqual(found, wanted)
  })

  test('S_', () => {
    const double = (x: number): number => x * 2
    const mult =
      (x: number) =>
      (y: number): number =>
        x * y
    const found = S(mult)(double)(10)
    const wanted = 200
    assert.deepStrictEqual(found, wanted)
  })

  test('S2', () => {
    const double = (x: number): number => x * 2
    const inc = (x: number): number => x + 1
    const add =
      (x: number) =>
      (y: number): number =>
        x + y
    const found = S2<number, number, number, number>(add)(double)(inc)(2)
    const wanted = 7
    assert.deepStrictEqual(found, wanted)
  })

  test('P', () => {
    const double = (x: number): number => x * 2
    const add =
      (x: number) =>
      (y: number): number =>
        x + y
    const found = P<number, number, number>(add)(double)(2)(4)
    const wanted = 12
    assert.deepStrictEqual(found, wanted)
  })

  suite('Y Combinator', () => {
    test('Factorial function', () => {
      const factorial = Y<number>(
        (recur) => (n) => n <= 1 ? 1 : n * recur(n - 1),
      )
      assert.deepStrictEqual(factorial(0), 1)
      assert.deepStrictEqual(factorial(1), 1)
      assert.deepStrictEqual(factorial(5), 120)
      assert.deepStrictEqual(factorial(7), 5040)
    })

    test('Fibonacci function', () => {
      const fibonacci = Y<number>(
        (recur) => (n) => n <= 1 ? n : recur(n - 1) + recur(n - 2),
      )
      assert.deepStrictEqual(fibonacci(0), 0)
      assert.deepStrictEqual(fibonacci(1), 1)
      assert.deepStrictEqual(fibonacci(5), 5)
      assert.deepStrictEqual(fibonacci(10), 55)
    })

    test('Alphabet function', () => {
      const alphabet = Y<string>(
        (recur) => (s) =>
          s.length === 0 || s.charCodeAt(s.length - 1) === 'z'.charCodeAt(0)
            ? s
            : recur(s + String.fromCharCode(s.charCodeAt(s.length - 1) + 1)),
      )
      assert.deepStrictEqual(alphabet('a'), 'abcdefghijklmnopqrstuvwxyz')
      assert.deepStrictEqual(alphabet('m'), 'mnopqrstuvwxyz')
      assert.deepStrictEqual(alphabet('w'), 'wxyz')
      assert.deepStrictEqual(alphabet(''), '')
    })
  })
})
