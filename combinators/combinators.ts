/**
 * Combinator: I
 * Alias: Idiot / Identity / id
 */
export const I = <A>(x: A): A => x;

/**
 * Combinator: K
 * Alias: Kestrel / constant / const /  always
 */
export const K = <A, B>(x: A) => (_y: B): A => x;

/**
 * Combinator: A
 * Alias: Apply
 */
export const A = <A, B>(f: (x: A) => B) => (x: A): B => f(x);

/**
 * Combinator: T
 * Alias: Thrush / applyto
 */
export const T = <A, B>(x: A) => (f: (x: A) => B): B => f(x);

/**
 * Combinator: W
 * Alias: Warbler / duplication / join / unnest
 */
export const W = <A, B>(f: (x: A) => (y: A) => B) => (x: A): B => f(x)(x);

/**
 * Combinator: C
 * Alias: Cardinal / flip
 */
export const C = <A, B, C>(f: (x: A) => (y: B) => C) => (y: B) => (x: A): C =>
  f(x)(y);

/**
 * Combinator: B
 * Alias: Bluebird / compose
 */
export const B = <A, B, C>(f: (x: B) => C) => (g: (x: A) => B) => (x: A): C =>
  f(g(x));

/**
 * Combinator: S
 * Alias: Starling / substitution / ap (apply?)
 */
export const S =
  <A, B, C>(f: (x: A) => (y: B) => C) => (g: (x: A) => B) => (x: A): C =>
    f(x)(g(x));

/**
 * Combinator: S_
 * Alias: "Starling _" / chain
 */
export const S_ =
  <A, B, C>(f: (x: A) => (y: B) => C) => (g: (x: B) => A) => (x: B): C =>
    f(g(x))(x);

/**
 * Combinator: S2
 * Alias: "Starling 2" / converge / lift2
 */
export const S2 =
  <A, B, C, D>(f: (x: B) => (y: C) => D) =>
  (g: (x: A) => B) =>
  (h: (x: A) => C) =>
  (x: A): D => f(g(x))(h(x));

/**
 * Combinator: P
 * Alias: Psi / on
 */
export const P =
  <A, B, C>(f: (x: B) => (y: B) => C) =>
  (g: (x: A) => B) =>
  (x: A) =>
  (y: A): C => f(g(x))(g(y));

/**
 * Combinator: Y
 * Alias: Y-Fixed point
 */
export const Y = <A>(f: (f: (x: A) => A) => (x: A) => A): (a:A) => A => {
  type RecursiveFunc = (g: RecursiveFunc) => (x: A) => A;
  return ((g: RecursiveFunc) => g(g))((g) => f((x) => g(g)(x)));
};
