/**
 * Given some value and up to 11 function pipe creates a "pipeline", from right
 * to left,  where the output of a function becomes the input to the next.
 *
 * @typeParam A The initial input value and input to the first function
 * @typeParam B The output of the first function, input to the second
 * @typeParam C The output of the second function, input to the third function if given, otherwise the return value
 * @typeParam D The output of the third function, input to the fourth function if given, otherwise the return value
 * @typeParam E The output of the fourth function, input to the fifth function if given, otherwise the return value
 * @typeParam F The output of the fifth function, input to the sixth function if given, otherwise the return value
 * @typeParam G The output of the sixth function, input to the seventh function if given, otherwise the return value
 * @typeParam H The output of the seventh function, input to the eighth function if given, otherwise the return value
 * @typeParam I The output of the eighth function, input to the ninth function if given, otherwise the return value
 * @typeParam J The output of the ninth function, input to the tenth function if given, otherwise the return value
 * @typeParam K The output of the tenth function, input to the eleventh function if given, otherwise the return value
 * @typeParam L The output of the eleventh function, the return value
 * @param {...(a) => b} fns to compose
 * @returns A value transformed by the functions in the pipeline
 *
 * @example
 * ```ts
 * import { compose } from '@gimme/base/compose'
 * const toLower = (s:string):string => s.toLowerCase()
 * const split = (delimiter: string) => (s: string): string[] => s.split(delimiter)
 * const join = (delimiter: string) => (s: string[]): string => s.join(delimiter)
 * const snake_case = compose(join("_"), split(" "), toLower)("Hello world")
 * ```
 */
export function compose<A, B>(
  ...fns: [(a: A) => B]
): (a: A) => B;
export function compose<A, B, C>(
  ...fns: [(b: B) => C, (a: A) => B]
): (a: A) => C;
export function compose<A, B, C, D>(
  ...fns: [(c: C) => D, (b: B) => C, (a: A) => B]
): (a: A) => D;
export function compose<A, B, C, D, E>(
  ...fns: [(d: D) => E, (c: C) => D, (b: B) => C, (a: A) => B]
): (a: A) => E;
export function compose<A, B, C, D, E, F>(
  ...fns: [(e: E) => F, (d: D) => E, (c: C) => D, (b: B) => C, (a: A) => B]
): (a: A) => F;
export function compose<A, B, C, D, E, F, G>(
  ...fns: [
    (f: F) => G,
    (e: E) => F,
    (d: D) => E,
    (c: C) => D,
    (b: B) => C,
    (a: A) => B,
  ]
): (a: A) => G;
export function compose<A, B, C, D, E, F, G, H>(
  ...fns: [
    (g: G) => H,
    (f: F) => G,
    (e: E) => F,
    (d: D) => E,
    (c: C) => D,
    (b: B) => C,
    (a: A) => B,
  ]
): (a: A) => H;
export function compose<A, B, C, D, E, F, G, H, I>(
  ...fns: [
    (h: H) => I,
    (g: G) => H,
    (f: F) => G,
    (e: E) => F,
    (d: D) => E,
    (c: C) => D,
    (b: B) => C,
    (a: A) => B,
  ]
): (a: A) => I;
export function compose<A, B, C, D, E, F, G, H, I, J>(
  ...fns: [
    (i: I) => J,
    (h: H) => I,
    (g: G) => H,
    (f: F) => G,
    (e: E) => F,
    (d: D) => E,
    (c: C) => D,
    (b: B) => C,
    (a: A) => B,
  ]
): (a: A) => J;
export function compose<A, B, C, D, E, F, G, H, I, J, K>(
  ...fns: [
    (j: J) => K,
    (i: I) => J,
    (h: H) => I,
    (g: G) => H,
    (f: F) => G,
    (e: E) => F,
    (d: D) => E,
    (c: C) => D,
    (b: B) => C,
    (a: A) => B,
  ]
): (a: A) => K;
export function compose<A, B, C, D, E, F, G, H, I, J, K, L>(
  ...fns: [
    (k: K) => L,
    (j: J) => K,
    (i: I) => J,
    (h: H) => I,
    (g: G) => H,
    (f: F) => G,
    (e: E) => F,
    (d: D) => E,
    (c: C) => D,
    (b: B) => C,
    (a: A) => B,
  ]
): (a: A) => L;
export function compose(...fns: Array<(x: unknown) => unknown>) {
  if (fns.length === 0) return <A>(x: A) => x;
  return fns.reduce((f, g) => (x) => f(g(x)));
}
