/**
 * Given some value and up to 11 function pipe creates a "pipeline", from left
 * to right,  where the output of a function becomes the input to the next.
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
 * @param a The initial input value
 * @param ab function to transform input A to output B,
 * @param bc function to transform input B to output C,
 * @param cd function to transform input C to output D,
 * @param de function to transform input D to output E,
 * @param ef function to transform input E to output F,
 * @param fg function to transform input F to output G,
 * @param gh function to transform input G to output H,
 * @param hi function to transform input H to output I,
 * @param ij function to transform input I to output J,
 * @param jk function to transform input J to output K,
 * @param kl function to transform input K to output L,
 * @returns A value transformed by the functions in the pipeline
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base/pipe'
 * const toLower = (s:string):string => s.toLowerCase()
 * const split = (delimiter: string) => (s: string): string[] => s.split(delimiter)
 * const join = (delimiter: string) => (s: string[]): string => s.join(delimiter)
 * const snake_case = pipe("Hello World", toLower, split(" "), join("_"))
 * ```
 */
export function pipe<A, B>(a: A, ab: (a: A) => B): B;
export function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C;
export function pipe<A, B, C, D>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
): D;
export function pipe<A, B, C, D, E>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): E;
export function pipe<A, B, C, D, E, F>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
): F;
export function pipe<A, B, C, D, E, F, G>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
): G;
export function pipe<A, B, C, D, E, F, G, H>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
): H;
export function pipe<A, B, C, D, E, F, G, H, I>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
): I;
export function pipe<A, B, C, D, E, F, G, H, I, J>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
): J;
export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: K) => K,
): K;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: J) => K,
  kl: (K: K) => L,
): K;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(
  a: A,
  ab: (a: A) => B,
  bc?: (b: B) => C,
  cd?: (c: C) => D,
  de?: (d: D) => E,
  ef?: (e: E) => F,
  fg?: (f: F) => G,
  gh?: (g: G) => H,
  hi?: (h: H) => I,
  ij?: (i: I) => J,
  jk?: (j: J) => K,
  kl?: (K: K) => L,
): unknown {
  if (ab && bc && cd && de && ef && fg && gh && hi && ij && jk && kl) {
    return kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))));
  }
  if (ab && bc && cd && de && ef && fg && gh && hi && ij && jk) {
    return jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))));
  }
  if (ab && bc && cd && de && ef && fg && gh && hi && ij) {
    return ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))));
  }
  if (ab && bc && cd && de && ef && fg && gh && hi) {
    return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
  }
  if (ab && bc && cd && de && ef && fg && gh) {
    return gh(fg(ef(de(cd(bc(ab(a)))))));
  }
  if (ab && bc && cd && de && ef && fg) {
    return fg(ef(de(cd(bc(ab(a))))));
  }
  if (ab && bc && cd && de && ef) {
    return ef(de(cd(bc(ab(a)))));
  }
  if (ab && bc && cd && de) {
    return de(cd(bc(ab(a))));
  }
  if (ab && bc && cd) {
    return cd(bc(ab(a)));
  }
  if (ab && bc) {
    return bc(ab(a));
  }

  return ab(a);
}
