import { I, K, A, T, W, C, B, S } from './combinators'

describe('Combinators', () => {
  test('I', () => {
    const found = I('hello world')
    const wanted = 'hello world'
    expect(found).toBe(wanted)
  })

  test('K', () => {
    const found = K(true)(false)
    const wanted = true
    expect(found).toBe(wanted)
  })

  test('A', () => {
    const found = A(String)(true)
    const wanted = 'true'
    expect(found).toBe(wanted)
  })

  test('T', () => {
    const found = T(true)(String)
    const wanted = 'true'
    expect(found).toBe(wanted)
  })

  test('W', () => {
    const add = (x: number) => (y: number) => x + y
    const found = W(add)(2)
    const wanted = 4
    expect(found).toBe(wanted)
  })

  test('C', () => {
    const fullname = (fst: string) => (snd: string) => fst + snd
    const found = C(fullname)('John')('Doe')
    const wanted = 'DoeJohn'
    expect(found).toBe(wanted)
  })

  test('B', () => {
    const upper = (x: string): string => x.toUpperCase()
    const dashed = (x: string): string => x.replace(' ', '-')
    // HINT: TS inference can't infer the generics for B so have to explicit define generics
    const found = B<string, string, string>(upper)(dashed)('hello world')
    const wanted = 'HELLO-WORLD'
    expect(found).toBe(wanted)
  })

  test('S', () => {
    const double = (x: number) :number =>  x * 2
    const mult =
      (x: number) =>
      (y: number): number =>
        x * y
    const found = S(mult)(double)(10)
    const wanted = 200 
    expect(found).toBe(wanted)
  })

  test('S_', () => {
    const double = (x: number) :number =>  x * 2
    const mult =
      (x: number) =>
      (y: number): number =>
        x * y
    const found = S(mult)(double)(10)
    const wanted = 200 
    expect(found).toBe(wanted)
  })
  test.todo('S2')
})
