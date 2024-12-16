/**
 * Given up to 11 function flow creates a "pipeline", from left
 * to right,  where the output of a function becomes the input to the next.
 * However, in difference to `pipe`, `flow` takes it's data last. Which is
 * useful when creating pipeline that can be called later in a point free
 * style.
 *
 * @typeParam A The input to the first function
 * @typeParam B Result of the first and input to the second function, or result if only one function in the pipeline
 * @typeParam C Result of the second and input to the third function, or result if only two functions in the pipeline
 * @typeParam D Result of the third and input to the fourth function, or result if only three functions in the pipeline
 * @typeParam E Result of the fourth and input to the fifth function, or result if only four functions in the pipeline
 * @typeParam F Result of the fifth and input to the sixth function, or result if only five functions in the pipeline
 * @typeParam G Result of the sixth and input to the seventh function, or result if only six functions in the pipeline
 * @typeParam H Result of the seventh and input to the eight function, or result if only seven functions in the pipeline
 * @typeParam I Result of the eight and input to the ninth function, or result if only eight functions in the pipeline
 * @typeParam J Result of the ninth and input to the tenth function, or result if only nine functions in the pipeline
 * @typeParam K Result of the tenth and input to the eleventh function, or result if only ten functions in the pipeline
 * @typeParam L Result of the eleventh function
 * @param a The input value
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
 * import { flow } from '@gimme/base/flow'
 *
 * const toLower = (s:string):string => s.toLowerCase()
 * const split = (delimiter: string) => (s: string): string[] => s.split(delimiter)
 * const join = (delimiter: string) => (s: string[]): string => s.join(delimiter)
 *
 * const hyphen = flow(toLower, split(" "), join("-"))
 * const snake = flow(toLower, split(" "), join("_"))
 *
 * const hyphenCase = hyphen("Hello World")
 * const snakeCase = snake("Hello World")
 * ```
 */
export function flow<A, B>(ab: (a: A) => B): (a: A) => B;
export function flow<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C;
export function flow<A, B, C, D>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
): (a: A) => D;
export function flow<A, B, C, D, E>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): (a: A) => E;
export function flow<A, B, C, D, E, F>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
): (a: A) => F;
export function flow<A, B, C, D, E, F, G>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
): (a: A) => G;
export function flow<A, B, C, D, E, F, G, H>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
): (a: A) => H;
export function flow<A, B, C, D, E, F, G, H, I>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
): (a: A) => I;
export function flow<A, B, C, D, E, F, G, H, I, J>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
): (a: A) => J;
export function flow<A, B, C, D, E, F, G, H, I, J, K>(
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
): (a: A) => K;
export function flow<A, B, C, D, E, F, G, H, I, J, K, L>(
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
): (a: A) => K;
export function flow<A, B, C, D, E, F, G, H, I, J, K, L>(
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
): (a: A) => unknown {
  return (a: A) => {
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
  };
}
