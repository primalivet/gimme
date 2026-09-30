/**
 * Curried, data-last operations on arrays for use with `pipe` and `flow`.
 * Every function accepts a readonly array and returns a new array, never
 * mutating its input.
 *
 * @module
 */
import type { Either } from "@gimme/adt/either";
import { just, type Maybe, nothing } from "@gimme/adt/maybe";

/**
 * Creates a function that transforms every value in an array with the provided
 * function.
 *
 * @typeParam A The type of the input values
 * @typeParam B The type of the output values
 * @param f The function to apply to each value
 * @returns A function that takes an array and returns a new array of transformed values
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { map } from '@gimme/adt/array'
 *
 * pipe([1, 2, 3], map((n) => n * 2)); // [2, 4, 6]
 * ```
 */
export const map =
  <A, B>(f: (a: A) => B): (ma: readonly A[]) => B[] =>
  (ma: readonly A[]): B[] => ma.map(f);

/**
 * Creates a function that transforms every value in an array with the provided
 * function, which also receives the value's index.
 *
 * @typeParam A The type of the input values
 * @typeParam B The type of the output values
 * @param f The function to apply to each value and its index
 * @returns A function that takes an array and returns a new array of transformed values
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { mapWithIdx } from '@gimme/adt/array'
 *
 * pipe(["a", "b"], mapWithIdx((s, i) => `${i}:${s}`)); // ["0:a", "1:b"]
 * ```
 */
export const mapWithIdx =
  <A, B>(f: (a: A, i: number) => B): (ma: readonly A[]) => B[] =>
  (ma: readonly A[]): B[] => ma.map(f);

/**
 * Creates a function that splits an array in two by a predicate. Values that do
 * not satisfy the predicate come first, values that do come second, mirroring
 * the Left and Right order of `partitionMap`.
 *
 * @typeParam A The type of the values
 * @param f The predicate to test each value with
 * @returns A function that takes an array and returns a pair of arrays, unsatisfied then satisfied
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { partition } from '@gimme/adt/array'
 *
 * const odd = (n: number) => n % 2 !== 0;
 *
 * pipe([1, 2, 3, 4], partition(odd)); // [[2, 4], [1, 3]]
 * ```
 */
export const partition =
  <A>(f: (a: A) => boolean): (ma: readonly A[]) => [A[], A[]] =>
  (ma: readonly A[]): [A[], A[]] => {
    const left: A[] = [];
    const right: A[] = [];
    for (const a of ma) {
      if (f(a)) right.push(a);
      else left.push(a);
    }
    return [left, right];
  };

/**
 * Creates a function that maps every value to an Either and splits the results
 * by variant. Left values come first, Right values second.
 *
 * @typeParam A The type of the input values
 * @typeParam B The type of the Left values
 * @typeParam C The type of the Right values
 * @param f The function that maps a value to an Either
 * @returns A function that takes an array and returns a pair of arrays, lefts then rights
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { type Either, left, right } from '@gimme/adt/either'
 * import { partitionMap } from '@gimme/adt/array'
 *
 * const parse = (s: string): Either<string, number> =>
 *   isNaN(Number(s)) ? left(`not a number: ${s}`) : right(Number(s));
 *
 * pipe(["1", "x", "3"], partitionMap(parse)); // [["not a number: x"], [1, 3]]
 * ```
 */
export const partitionMap =
  <A, B, C>(f: (a: A) => Either<B, C>): (ma: readonly A[]) => [B[], C[]] =>
  (ma: readonly A[]): [B[], C[]] => {
    const left: B[] = [];
    const right: C[] = [];
    for (const a of ma) {
      const mb = f(a);
      if (mb._tag === "Right") right.push(mb.value);
      else left.push(mb.value);
    }
    return [left, right];
  };

/**
 * Creates a function that maps every value and its index to an Either and splits
 * the results by variant. Left values come first, Right values second.
 *
 * @typeParam A The type of the input values
 * @typeParam B The type of the Left values
 * @typeParam C The type of the Right values
 * @param f The function that maps a value and its index to an Either
 * @returns A function that takes an array and returns a pair of arrays, lefts then rights
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { type Either, left, right } from '@gimme/adt/either'
 * import { partitionMapWithIdx } from '@gimme/adt/array'
 *
 * const evenIndex = (s: string, i: number): Either<string, string> =>
 *   i % 2 === 0 ? right(s) : left(s);
 *
 * pipe(["a", "b", "c"], partitionMapWithIdx(evenIndex)); // [["b"], ["a", "c"]]
 * ```
 */
export const partitionMapWithIdx = <A, B, C>(
  f: (a: A, i: number) => Either<B, C>,
): (ma: readonly A[]) => [B[], C[]] =>
(ma: readonly A[]): [B[], C[]] => {
  const left: B[] = [];
  const right: C[] = [];
  for (let i = 0; i < ma.length; i++) {
    const mb = f(ma[i], i);
    if (mb._tag === "Right") right.push(mb.value);
    else left.push(mb.value);
  }
  return [left, right];
};

/**
 * Creates an empty array.
 *
 * @typeParam A The type of the values the array would hold
 * @returns An empty array
 *
 * @example
 * ```ts
 * import { empty } from '@gimme/adt/array'
 *
 * const xs: number[] = empty(); // []
 * ```
 */
export const empty = <A>(): A[] => [];

/**
 * Wraps a single value in an array. This is the "pure" operation for the array
 * type, lifting a plain value into the array context.
 *
 * @typeParam A The type of the value
 * @param a The value to wrap
 * @returns An array holding only the given value
 *
 * @example
 * ```ts
 * import { pure } from '@gimme/adt/array'
 *
 * pure(42); // [42]
 * ```
 */
export const pure = <A>(a: A): A[] => [a];

/**
 * Creates a function that applies an array-returning function to every value
 * and flattens the results into one array.
 *
 * @typeParam A The type of the input values
 * @typeParam B The type of the output values
 * @param f The function that maps a value to an array
 * @returns A function that takes an array and returns the flattened results
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { bind } from '@gimme/adt/array'
 *
 * pipe([1, 2], bind((n) => [n, n * 10])); // [1, 10, 2, 20]
 * ```
 */
export const bind =
  <A, B>(f: (a: A) => B[]): (ma: readonly A[]) => B[] =>
  (ma: readonly A[]): B[] => ma.flatMap(f);

/**
 * Flattens one level of nesting.
 *
 * @typeParam A The type of the values
 * @param mma The array of arrays to flatten
 * @returns A single array with the inner arrays concatenated in order
 *
 * @example
 * ```ts
 * import { join } from '@gimme/adt/array'
 *
 * join([[1, 2], [3]]); // [1, 2, 3]
 * ```
 */
export const join = <A>(mma: readonly (readonly A[])[]): A[] => mma.flat();

/**
 * Creates a function that pairs the values of two arrays by position. The piped
 * array supplies the first element of each pair. The result is as long as the
 * shorter of the two arrays.
 *
 * @typeParam B The type of the values in the second array
 * @typeParam A The type of the values in the piped array
 * @param mb The array supplying the second element of each pair
 * @returns A function that takes an array and returns an array of pairs
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { zip } from '@gimme/adt/array'
 *
 * pipe([1, 2, 3], zip(["a", "b"])); // [[1, "a"], [2, "b"]]
 * ```
 */
export const zip =
  <B>(mb: readonly B[]): <A>(ma: readonly A[]) => [A, B][] =>
  <A>(ma: readonly A[]): [A, B][] => {
    const len = Math.min(ma.length, mb.length);
    const result: [A, B][] = [];
    for (let i = 0; i < len; i++) result.push([ma[i], mb[i]]);
    return result;
  };

/**
 * Creates a function that combines the values of two arrays by position with the
 * provided function. The result is as long as the shorter of the two arrays.
 *
 * @typeParam A The type of the values in the piped array
 * @typeParam B The type of the values in the second array
 * @typeParam C The type of the combined values
 * @param f The function that combines a value from each array
 * @returns A function that takes the second array, then the piped array, and returns the combined values
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { zipWith } from '@gimme/adt/array'
 *
 * const add = (a: number, b: number) => a + b;
 *
 * pipe([1, 2, 3], zipWith(add)([10, 20])); // [11, 22]
 * ```
 */
export const zipWith = <A, B, C>(
  f: (a: A, b: B) => C,
): (mb: readonly B[]) => (ma: readonly A[]) => C[] =>
(mb: readonly B[]) =>
(ma: readonly A[]): C[] => {
  const len = Math.min(ma.length, mb.length);
  const result: C[] = [];
  for (let i = 0; i < len; i++) result.push(f(ma[i], mb[i]));
  return result;
};

/**
 * Creates a function that applies every function in one array to every value in
 * another. The result holds each function's outputs in turn, so it agrees with
 * `bind` over the array of functions.
 *
 * @typeParam A The type of the input values
 * @typeParam B The type of the output values
 * @param mab The array of functions to apply
 * @returns A function that takes an array of values and returns all results
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { apply } from '@gimme/adt/array'
 *
 * const inc = (n: number) => n + 1;
 * const dbl = (n: number) => n * 2;
 *
 * pipe([1, 2], apply([inc, dbl])); // [2, 3, 2, 4]
 * ```
 */
export const apply =
  <A, B>(mab: readonly ((a: A) => B)[]): (ma: readonly A[]) => B[] =>
  (ma: readonly A[]): B[] => mab.flatMap((f) => ma.map(f));

/**
 * Creates a function that keeps the values satisfying a predicate.
 *
 * @typeParam A The type of the values
 * @param f The predicate to test each value with
 * @returns A function that takes an array and returns the satisfying values
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { filter } from '@gimme/adt/array'
 *
 * pipe([1, 2, 3, 4], filter((n) => n > 2)); // [3, 4]
 * ```
 */
export const filter =
  <A>(f: (a: A) => boolean): (ma: readonly A[]) => A[] =>
  (ma: readonly A[]): A[] => ma.filter(f);

/**
 * Creates a function that maps every value to a Maybe and keeps the Just
 * values, unwrapped. Filtering and mapping in one pass.
 *
 * @typeParam A The type of the input values
 * @typeParam B The type of the output values
 * @param f The function that maps a value to a Maybe
 * @returns A function that takes an array and returns the unwrapped Just values
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { type Maybe, just, nothing } from '@gimme/adt/maybe'
 * import { filterMap } from '@gimme/adt/array'
 *
 * const half = (n: number): Maybe<number> => n % 2 === 0 ? just(n / 2) : nothing;
 *
 * pipe([1, 2, 3, 4], filterMap(half)); // [1, 2]
 * ```
 */
export const filterMap =
  <A, B>(f: (a: A) => Maybe<B>): (ma: readonly A[]) => B[] =>
  (ma: readonly A[]): B[] => {
    const result: B[] = [];
    for (const a of ma) {
      const mb = f(a);
      if (mb._tag === "Just") result.push(mb.value);
    }
    return result;
  };

/**
 * Creates a function that maps every value and its index to a Maybe and keeps
 * the Just values, unwrapped.
 *
 * @typeParam A The type of the input values
 * @typeParam B The type of the output values
 * @param f The function that maps a value and its index to a Maybe
 * @returns A function that takes an array and returns the unwrapped Just values
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { type Maybe, just, nothing } from '@gimme/adt/maybe'
 * import { filterMapWithIdx } from '@gimme/adt/array'
 *
 * const atEvenIndex = (s: string, i: number): Maybe<string> => i % 2 === 0 ? just(s) : nothing;
 *
 * pipe(["a", "b", "c"], filterMapWithIdx(atEvenIndex)); // ["a", "c"]
 * ```
 */
export const filterMapWithIdx =
  <A, B>(f: (a: A, i: number) => Maybe<B>): (ma: readonly A[]) => B[] =>
  (ma: readonly A[]): B[] => {
    const result: B[] = [];
    for (let i = 0; i < ma.length; i++) {
      const mb = f(ma[i], i);
      if (mb._tag === "Just") result.push(mb.value);
    }
    return result;
  };

/**
 * Creates a function that folds an array from the left into a single value,
 * starting from an initial value.
 *
 * @typeParam A The type of the values
 * @typeParam B The type of the accumulated result
 * @param b The initial value
 * @param f The function that combines the accumulated result with the next value
 * @returns A function that takes an array and returns the accumulated result
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { reduce } from '@gimme/adt/array'
 *
 * pipe([1, 2, 3], reduce(0, (sum, n) => sum + n)); // 6
 * ```
 */
export const reduce =
  <A, B>(b: B, f: (b: B, a: A) => B): (ma: readonly A[]) => B =>
  (ma: readonly A[]): B => ma.reduce(f, b);

/**
 * Returns the first value of an array as a Maybe. Nothing only when the array is
 * empty; a first value of `null` or `undefined` is still a Just.
 *
 * @typeParam A The type of the values
 * @param ma The array to read from
 * @returns A Just of the first value, or Nothing for an empty array
 *
 * @example
 * ```ts
 * import { head } from '@gimme/adt/array'
 *
 * head([1, 2, 3]); // Just(1)
 * head([]);        // Nothing
 * head([null]);    // Just(null)
 * ```
 */
export const head = <A>(ma: readonly A[]): Maybe<A> => {
  if (ma.length > 0) return just(ma[0]);
  else return nothing;
};

/**
 * Creates a function that returns the first value satisfying a predicate as a
 * Maybe. Nothing only when no value satisfies it; a matching `null` or
 * `undefined` is still a Just.
 *
 * @typeParam A The type of the values
 * @param f The predicate to test each value with
 * @returns A function that takes an array and returns a Just of the first match, or Nothing
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { find } from '@gimme/adt/array'
 *
 * pipe([1, 2, 3], find((n) => n > 1)); // Just(2)
 * pipe([1, 2, 3], find((n) => n > 3)); // Nothing
 * ```
 */
export const find =
  <A>(f: (a: A) => boolean): (ma: readonly A[]) => Maybe<A> =>
  (ma: readonly A[]): Maybe<A> => {
    const i = ma.findIndex(f);
    if (i !== -1) return just(ma[i]);
    else return nothing;
  };

/**
 * Converts an array to a readable string representation, using pretty-printed
 * JSON.
 *
 * @typeParam A The type of the values
 * @param ma The array to convert
 * @returns A formatted string representation of the array
 *
 * @example
 * ```ts
 * import { show } from '@gimme/adt/array'
 *
 * show([1, 2]);
 * // [
 * //   1,
 * //   2
 * // ]
 * ```
 */
export const show = <A>(ma: readonly A[]): string =>
  JSON.stringify(ma, null, 2);

/**
 * Creates an array of consecutive integers from start to end, both inclusive.
 * Counts down when start is greater than end.
 *
 * @param start The first value
 * @param end The last value
 * @returns An array of the integers from start to end
 *
 * @example
 * ```ts
 * import { range } from '@gimme/adt/array'
 *
 * range(1, 4); // [1, 2, 3, 4]
 * range(3, 1); // [3, 2, 1]
 * range(2, 2); // [2]
 * ```
 */
export const range = (start: number, end: number): number[] => {
  let from = start;
  const result: number[] = [];

  if (start <= end) {
    while (from <= end) {
      result.push(from);
      from += 1;
    }
  } else {
    while (from >= end) {
      result.push(from);
      from -= 1;
    }
  }
  return result;
};

/**
 * Creates a function that reduces an array to a single value based on whether
 * it is empty.
 *
 * @typeParam A The type of the values
 * @typeParam B The result type
 * @param onEmpty Function to handle the empty case
 * @param onNonEmpty Function to handle the non-empty case, receiving the array
 * @returns A function that takes an array and returns the result type
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { fold } from '@gimme/adt/array'
 *
 * const describe = fold(
 *   () => "empty",
 *   (xs: readonly number[]) => `${xs.length} values`,
 * );
 *
 * pipe([], describe);        // "empty"
 * pipe([1, 2, 3], describe); // "3 values"
 * ```
 */
export const fold = <A, B>(
  onEmpty: () => B,
  onNonEmpty: (as: readonly A[]) => B,
): (ma: readonly A[]) => B =>
(ma: readonly A[]): B => ma.length === 0 ? onEmpty() : onNonEmpty(ma);

/**
 * Converts an Either to an array: a Right becomes a one-element array, a Left
 * becomes an empty array.
 *
 * @typeParam A The Left type
 * @typeParam B The Right type
 * @param ma The Either to convert
 * @returns An array holding the Right value, or empty
 *
 * @example
 * ```ts
 * import { left, right } from '@gimme/adt/either'
 * import { fromEither } from '@gimme/adt/array'
 *
 * fromEither(right(1));        // [1]
 * fromEither(left("failed")); // []
 * ```
 */
export const fromEither = <A, B>(ma: Either<A, B>): B[] => {
  if (ma._tag === "Right") return [ma.value];
  else return [];
};

/**
 * Converts a Maybe to an array: a Just becomes a one-element array, Nothing
 * becomes an empty array.
 *
 * @typeParam A The type of the value
 * @param ma The Maybe to convert
 * @returns An array holding the Just value, or empty
 *
 * @example
 * ```ts
 * import { just, nothing } from '@gimme/adt/maybe'
 * import { fromMaybe } from '@gimme/adt/array'
 *
 * fromMaybe(just(1)); // [1]
 * fromMaybe(nothing); // []
 * ```
 */
export const fromMaybe = <A>(ma: Maybe<A>): A[] => {
  if (ma._tag === "Just") return [ma.value];
  else return [];
};
