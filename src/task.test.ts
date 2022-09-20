import * as T from './task'

const upper = (s: string) => s.toUpperCase()
const asyncUpper =
  (s: string): T.Task<string> =>
  () =>
    new Promise((resolve) => setTimeout(() => resolve(s.toUpperCase()), 1500))

describe('Laws', () => {
  test('left identity', () => {
    const f = (x: number) => T.pure(() => x * 2)
    const leftside = T.bind(f)(T.pure(10))
    const rightside = f(10)
    const found = T.show(leftside) === T.show(rightside)
    const wanted = true

    expect(found).toBe(wanted)
  })

  test('right identity', () => {
    const leftside = T.bind(T.pure)(T.pure(10))
    const rightside = T.pure(10)
    const found = T.show(leftside) === T.show(rightside)
    const wanted = true

    expect(found).toBe(wanted)
  })

  test('associativity', () => {
    const f = (x: number) => T.pure(x * 2)
    const g = (x: number) => T.pure(x + 1)
    const leftside = T.bind(g)(T.bind(f)(T.pure(10)))
    const rightside = T.bind((x: number) => T.bind(g)(f(x)))(T.pure(10))
    const found = T.show(leftside) === T.show(rightside)
    const wanted = true

    expect(found).toBe(wanted)
  })
})

describe('Functor', () => {
  test('fmap: apply a Task of a value to a function', async () => {
    const found = await T.fmap(upper)(T.pure('hello'))()
    const wanted = 'HELLO'
    expect(found).toBe(wanted)
  })
})

describe('', () => {
  test('pure: lifts a value up in Task context', async () => {
    const found = await T.pure('hello')()
    const wanted = 'hello'
    expect(found).toBe(wanted)
  })

  test('apply: apply a Task of a value to a Task of a function', async () => {
    const found = await T.apply(T.pure('hello'))(T.pure(upper))()
    const wanted = 'HELLO'
    expect(found).toBe(wanted)
  })
})

describe('Monad', () => {
  test('bind: apply a Task of a value to a function returning another Task, flatten the result', async () => {
    const found = await T.bind(asyncUpper)(T.pure('hello'))()
    const wanted = 'HELLO'
    expect(found).toBe(wanted)
  })
})

describe('Constructor', () => {

  test('delay', async () => {
    const found = await T.delay(1500)('hello')()
    const wanted = 'hello'
    expect(found).toBe(wanted)
  })
})


