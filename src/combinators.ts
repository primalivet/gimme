/**
 * Combinator: I
 * Alias: identity / id
 */
export const I = <A>(x: A): A => x

/**
 * Combinator: K
 * Alias: constant / const /  always
 */
export const K =
  <A, B>(x: A) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_y: B): A =>
    x

/**
 * Combinator: A
 * Alias: apply
 */
export const A =
  <A, B>(f: (x: A) => B) =>
  (x: A): B =>
    f(x)

/**
 * Combinator: T
 * Alias: thrush / applyto
 */
export const T =
  <A, B>(x: A) =>
  (f: (x: A) => B): B =>
    f(x)

/**
 * Combinator: W
 * Alias: duplication / join / unnest
 */
export const W =
  <A, B>(f: (x: A) => (y: A) => B) =>
  (x: A): B =>
    f(x)(x)

/**
 * Combinator: C
 * Alias: flip
 */
export const C =
  <A, B, C>(f: (x: A) => (y: B) => C) =>
  (y: B) =>
  (x: A): C =>
    f(x)(y)

/**
 * Combinator: B
 * Alias: compose
 */
export const B =
  <A, B, C>(f: (x: B) => C) =>
  (g: (x: A) => B) =>
  (x: A): C =>
    f(g(x))

/**
 * Combinator: S
 * Alias: substitution / ap (apply?)
 */
export const S =
  <A, B, C>(f: (x: A) => (y: B) => C) =>
  (g: (x: A) => B) =>
  (x: A): C =>
    f(x)(g(x))

/**
 * Combinator: S_
 * Alias: chain
 */
export const S_ =
  <A, B, C>(f: (x: A) => (y: B) => C) =>
  (g: (x: B) => A) =>
  (x: B): C =>
    f(g(x))(x)

/**
 * Combinator: S2
 * Alias: converge / lift2
 */
export const S2 =
  <A, B, C, D>(f: (x: B) => (y: C) => D) =>
  (g: (x: A) => B) =>
  (h: (x: A) => C) =>
  (x: A): D =>
    f(g(x))(h(x))
