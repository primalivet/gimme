import { I, K, A, T, W, C, B, S, S2, P, Y } from './combinators'

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

  test('S2', () => {
    const double = (x:number): number => x * 2
    const inc = (x:number): number => x + 1
    const add = (x:number) => (y:number):number => x + y
    const found = S2<number, number, number, number>(add)(double)(inc)(2) 
    const wanted = 7
    expect(found).toBe(wanted)
  })

  test('P', () => {
    const double = (x:number): number => x * 2
    const add = (x:number) => (y:number):number => x + y
    const found = P<number, number, number>(add)(double)(2)(4) 
    const wanted = 12
    expect(found).toBe(wanted)
  })

  describe('Y Combinator', () => {
    test('Factorial function', () => {
      const factorial = Y<number>((recur) => (n) => n <= 1 ? 1 : n * recur(n - 1));
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(5)).toBe(120);
      expect(factorial(7)).toBe(5040);
    });

    test('Fibonacci function', () => {
      const fibonacci = Y<number>((recur) => (n) => n <= 1 ? n : recur(n - 1) + recur(n - 2));
      expect(fibonacci(0)).toBe(0);
      expect(fibonacci(1)).toBe(1);
      expect(fibonacci(5)).toBe(5);
      expect(fibonacci(10)).toBe(55);
    });
  });
})
