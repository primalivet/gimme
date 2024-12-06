/**
 * Tuple represents an ordered pair of two values of potentially different types.
 * Unlike JavaScript arrays, Tuples are immutable (Readonly) and always contain
 * exactly two elements. Tuples are useful for returning multiple values from
 * functions or representing pairs of related data.
 *
 * @typeParam A The type of the first element
 * @typeParam B The type of the second element
 *
 * @example Creating a tuple of different types
 * ```ts
 * import { type Tuple, pure } from '@gimme/adt/tuple'
 *
 * const userStatus: Tuple<string, boolean> = pure("active", true);
 * ```
 *
 * @example Using tuples for coordinates
 * ```ts
 * import { type Tuple, pure } from '@gimme/adt/tuple'
 *
 * const point: Tuple<number, number> = pure(10, 20);
 * ```
 */
export type Tuple<A, B> = Readonly<[A, B]>;

/**
 * Creates a new Tuple containing the two provided values. This is the
 * "pure" operation for the Tuple type, lifting two values into the Tuple context.
 *
 * @typeParam A The type of the first value
 * @typeParam B The type of the second value
 * @param fst The first value
 * @param snd The second value
 * @returns A new Tuple containing the provided values
 *
 * @example
 * ```ts
 * import { pure } from '@gimme/adt/tuple'
 *
 * const coord = pure(10, 20);
 * const user = pure("john", 42);
 * ```
 */
export const pure = <A, B>(fst: A, snd: B): Tuple<A, B> => [fst, snd];

/**
 * Creates a function that transforms the first element of a Tuple using the
 * provided function, leaving the second element unchanged.
 *
 * @typeParam A The type of the input first element
 * @typeParam B The type of the second element (unchanged)
 * @typeParam C The type of the output first element
 * @param f The function to apply to the first element
 * @returns A function that takes a Tuple and returns a new Tuple with the first element transformed
 *
 * @example
 * ```ts
 * import { pure, first } from '@gimme/adt/tuple'
 *
 * const tuple = pure("hello", 42);
 * const upper = first((s: string) => s.toUpperCase())(tuple); // Tuple("HELLO", 42)
 * ```
 */
export const first =
  <A, B, C>(f: (a: A) => C) => ([fst, snd]: Tuple<A, B>): Tuple<C, B> => [
    f(fst),
    snd,
  ];

/**
 * Creates a function that transforms the second element of a Tuple using the
 * provided function, leaving the first element unchanged.
 *
 * @typeParam A The type of the first element (unchanged)
 * @typeParam B The type of the input second element
 * @typeParam C The type of the output second element
 * @param f The function to apply to the second element
 * @returns A function that takes a Tuple and returns a new Tuple with the second element transformed
 *
 * @example
 * ```ts
 * import { pure, second } from '@gimme/adt/tuple'
 *
 * const tuple = pure("hello", 21);
 * const doubled = second((n: number) => n * 2)(tuple); // Tuple("hello", 42)
 * ```
 */
export const second =
  <A, B, C>(f: (a: B) => C) => ([fst, snd]: Tuple<A, B>): Tuple<A, C> => [
    fst,
    f(snd),
  ];

/**
 * Creates a function that transforms both elements of a Tuple using the provided
 * functions. This combines the functionality of `first` and `second` into a
 * single operation.
 *
 * @typeParam A The type of the input first element
 * @typeParam B The type of the input second element
 * @typeParam C The type of the output first element
 * @typeParam D The type of the output second element
 * @param f The function to apply to the first element
 * @param g The function to apply to the second element
 * @returns A function that takes a Tuple and returns a new Tuple with both elements transformed
 *
 * @example
 * ```ts
 * import { pure, bimap } from '@gimme/adt/tuple'
 *
 * const tuple = pure("hello", 21);
 * const transformed = bimap(
 *   (s: string) => s.toUpperCase(),
 *   (n: number) => n * 2
 * )(tuple); // Tuple("HELLO", 42)
 * ```
 */
export const bimap =
  <A, B, C, D>(f: (a: A) => C, g: (b: B) => D) =>
  ([fst, snd]: Tuple<A, B>): Tuple<C, D> => [f(fst), g(snd)];

/**
 * Creates a new Tuple with the elements in reverse order. This is useful when
 * you need to change the order of elements without modifying their values.
 *
 * @typeParam A The type of the first element
 * @typeParam B The type of the second element
 * @param tuple The tuple to swap
 * @returns A new Tuple with the elements in reverse order
 *
 * @example
 * ```ts
 * import { pure, swap } from '@gimme/adt/tuple'
 *
 * const original = pure("first", "second");
 * const swapped = swap(original); // Tuple("second", "first")
 * ```
 */
export const swap = <A, B>([fst, snd]: Tuple<A, B>): Tuple<B, A> => [snd, fst];

/**
 * Extracts the first element from a Tuple.
 *
 * @typeParam A The type of the first element
 * @typeParam B The type of the second element
 * @param tuple The tuple to extract from
 * @returns The first element
 *
 * @example
 * ```ts
 * import { pure, fst } from '@gimme/adt/tuple'
 *
 * const tuple = pure("hello", 42);
 * const first = fst(tuple); // "hello"
 * ```
 */
export const fst = <A, B>([fst]: Tuple<A, B>): A => fst;

/**
 * Extracts the second element from a Tuple.
 *
 * @typeParam A The type of the first element
 * @typeParam B The type of the second element
 * @param tuple The tuple to extract from
 * @returns The second element
 *
 * @example
 * ```ts
 * import { pure, snd } from '@gimme/adt/tuple'
 *
 * const tuple = pure("hello", 42);
 * const second = snd(tuple); // 42
 * ```
 */
export const snd = <A, B>([, snd]: Tuple<A, B>): B => snd;

/**
 * Converts a curried function that takes two arguments into a function that takes
 * a single Tuple containing both arguments. This is useful when working with
 * functions that expect multiple arguments but you have the values in a Tuple.
 *
 * @typeParam A The type of the first argument
 * @typeParam B The type of the second argument
 * @typeParam C The return type of the function
 * @param fn The curried function to uncurry
 * @returns A function that takes a Tuple and returns the result of applying the function
 *
 * @example
 * ```ts
 * import { pure, uncurry } from '@gimme/adt/tuple'
 *
 * const add = (a: number) => (b: number) => a + b;
 * const tuple = pure(2, 3);
 * const sum = uncurry(add)(tuple); // 5
 * ```
 */
export const uncurry =
  <A, B, C>(fn: (a: A) => (b: B) => C) => ([fst, snd]: Tuple<A, B>): C =>
    fn(fst)(snd);

/**
 * Converts a Tuple to a readable string representation, using pretty-printed
 * JSON for the elements.
 *
 * @typeParam A The type of the first element
 * @typeParam B The type of the second element
 * @param tuple The Tuple to convert to string
 * @returns A formatted string representation of the Tuple
 *
 * @example
 * ```ts
 * import { pure, show } from '@gimme/adt/tuple'
 *
 * const tuple = pure({ x: 1 }, [1, 2, 3]);
 * show(tuple);
 * // Tuple({"x":1}, [1,2,3])
 * ```
 */
export const show = <A, B>([a, b]: Tuple<A, B>): string =>
  `Tuple(${JSON.stringify(a)}, ${JSON.stringify(b)})`;
