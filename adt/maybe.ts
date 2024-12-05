/**
 * Maybe represents a value that may or may not exist. It has two variants:
 * `Just<A>` which contains a value, or `Nothing` which represents the absence
 * of a value. Maybe is commonly used for handling optional values and
 * computations that might not produce a result.
 *
 * @typeParam A The type of the value that may be present
 *
 * @example Working with present values
 * ```ts
 * import { type Maybe, just } from '@gimme/adt/maybe'
 *
 * const present: Maybe<number> = just(42);
 * ```
 *
 * @example Working with absent values
 * ```ts
 * import { type Maybe, nothing } from '@gimme/adt/maybe'
 *
 * const absent: Maybe<number> = nothing;
 * ```
 */
export type Maybe<A> = Just<A> | Nothing;

/**
 * Represents the absence of a value in the Maybe type. This is used when
 * a computation produces no result or when an optional value is not present.
 *
 * @example
 * ```ts
 * import { type Nothing, nothing } from '@gimme/adt/maybe'
 *
 * const noValue: Nothing = nothing;
 * ```
 */
export type Nothing = { _tag: "Nothing" };

/**
 * Represents the presence of a value in the Maybe type. This is used when
 * a computation successfully produces a result or when an optional value exists.
 *
 * @typeParam A The type of the contained value
 *
 * @example
 * ```ts
 * import { type Just, just } from '@gimme/adt/maybe'
 *
 * const hasValue: Just<number> = just(42);
 * ```
 */
export type Just<A> = { _tag: "Just"; value: A };

/**
 * A singleton value representing the absence of a value in a Maybe type.
 *
 * @example
 * ```ts
 * import { type Maybe, nothing } from '@gimme/adt/maybe'
 *
 * const noResult: Maybe<number> = nothing;
 * ```
 */
export const nothing: Nothing = { _tag: "Nothing" };

/**
 * Creates a Just variant of Maybe, representing the presence of a value.
 *
 * @typeParam A The type of the value to be wrapped
 * @param a The value to be wrapped in Just
 * @returns A Just instance containing the provided value
 *
 * @example
 * ```ts
 * import { type Maybe, just } from '@gimme/adt/maybe'
 *
 * const value: Just<number> = just(42);
 * ```
 */
export const just = <A>(a: A): Just<A> => ({ _tag: "Just", value: a });

/**
 * A constructor that lifts a value into a Maybe context. This is an alias
 * for the `just` constructor, representing the "pure" operation in functional
 * programming.
 *
 * Just like the Either monad, `pure` follows specific identity laws when used
 * with bind:
 *
 * @typeParam A The type of the value to be wrapped
 * @param a The value to be wrapped
 * @returns A Just instance containing the provided value
 *
 * @example
 * ```ts
 * import { just, pure, bind } from '@gimme/adt/maybe'
 *
 * const value = 42;
 * const f = (n: number) => just(n * 2);
 *
 * // Left identity: pure(x) bind f = f(x)
 * pipe(pure(value), bind(f)) // Same as f(value)
 *
 * // Right identity: m bind pure = m
 * pipe(f(value), bind(pure)) // Same as f(value)
 * ```
 */
export const pure: typeof just = just;

/**
 * Type guard that checks if a Maybe value is Nothing.
 *
 * @typeParam A The type of the value that might be present
 * @param ma The Maybe value to check
 * @returns True if the Maybe is Nothing
 *
 * @example
 * ```ts
 * import { type Maybe, nothing, isNothing } from '@gimme/adt/maybe'
 *
 * const maybe: Maybe<number> = nothing;
 *
 * if (isNothing(maybe)) {
 *   console.log("No value present");
 * }
 * ```
 */
export const isNothing = <A>(ma: Maybe<A>): boolean => ma._tag === "Nothing";

/**
 * Type guard that checks if a Maybe value is Just.
 *
 * @typeParam A The type of the value that might be present
 * @param ma The Maybe value to check
 * @returns True if the Maybe is Just
 *
 * @example
 * ```ts
 * import { type Maybe, just, isJust } from '@gimme/adt/maybe'
 *
 * const maybe: Maybe<number> = just(42);
 *
 * if (isJust(maybe)) {
 *   console.log(maybe.value * 2);
 * }
 * ```
 */
export const isJust = <A>(ma: Maybe<A>): boolean => ma._tag === "Just";

/**
 * Creates a function that transforms the value inside a Just variant of Maybe,
 * while leaving Nothing values unchanged. Similar to Array.map(), but operating
 * on the value in a Maybe context.
 *
 * @typeParam A The type of the input value
 * @typeParam B The type of the output value
 * @param f The function to apply to the value if present
 * @returns A function that takes a Maybe and returns a new Maybe with the transformed value
 *
 * @example
 * ```ts
 * import { just, nothing, map } from '@gimme/adt/maybe'
 *
 * const double = (n: number) => n * 2;
 *
 * const hasValue = just(21);
 * const doubled = map(double)(hasValue); // Just(42)
 *
 * const noValue = nothing;
 * const stillNothing = map(double)(noValue); // Nothing
 * ```
 */
export const map = <A, B>(f: (a: A) => B) => (ma: Maybe<A>): Maybe<B> =>
  ma._tag === "Just" ? just(f(ma.value)) : nothing;

/**
 * Creates a function that chains Maybe computations together. When given a
 * function that produces a Maybe and an existing Maybe value, it applies
 * the function only if the Maybe is a Just variant.
 *
 * @typeParam A The input value type
 * @typeParam B The output value type
 * @param f A function that takes a value and returns a new Maybe
 * @returns A function that chains the Maybe computation with f
 *
 * @example
 * ```ts
 * import { just, nothing, bind } from '@gimme/adt/maybe'
 *
 * const parseInt = (s: string): Maybe<number> => {
 *   const n = Number(s);
 *   return isNaN(n) ? nothing : just(n);
 * };
 *
 * const divideBy2 = (n: number): Maybe<number> =>
 *   n === 0 ? nothing : just(n / 2);
 *
 * // Chain operations together
 * const success = pipe(
 *   just("42"),
 *   bind(parseInt),    // Just(42)
 *   bind(divideBy2)    // Just(21)
 * );
 *
 * // Fails at first step
 * const failParseFstStep = pipe(
 *   just("not a number"),
 *   bind(parseInt),    // Nothing
 *   bind(divideBy2)    // Nothing
 * );
 *
 * // Fails at second step
 * const failParseSndStep = pipe(
 *   just("0"),
 *   bind(parseInt),    // Just(0)
 *   bind(divideBy2)    // Nothing
 * );
 * ```
 */
export const bind = <A, B>(f: (a: A) => Maybe<B>) => (ma: Maybe<A>): Maybe<B> =>
  ma._tag === "Just" ? f(ma.value) : nothing;

/**
 * Flattens a nested Maybe into a single Maybe. This function is useful when you
 * have a value of type Maybe<Maybe<A>> and want to get Maybe<A>.
 *
 * @typeParam A The value type
 * @param mma The nested Maybe to flatten
 * @returns A flattened Maybe
 *
 * @example
 * ```ts
 * import { just, nothing, join } from '@gimme/adt/maybe'
 *
 * const nested = just(just(42));      // Maybe<Maybe<number>>
 * join(nested);                       // Just(42)
 *
 * const nestedNothing = just(nothing);
 * join(nestedNothing);               // Nothing
 *
 * const outerNothing = nothing;
 * join(outerNothing);                // Nothing
 * ```
 */
export const join = <A>(mma: Maybe<Maybe<A>>): Maybe<A> =>
  mma._tag === "Nothing" ? mma : mma.value;

/**
 * Creates a function that applies a wrapped function from one Maybe to a value in
 * another Maybe. This enables applying functions between Maybe contexts and is
 * useful when you have a function wrapped in a Maybe that you want to apply to
 * a value in another Maybe.
 *
 * @typeParam A The type of the input value
 * @typeParam B The type of the output value
 * @param mab The Maybe containing the function to apply
 * @returns A function that takes a Maybe value and returns a new Maybe
 *
 * @example
 * ```ts
 * import { just, nothing, apply } from '@gimme/adt/maybe'
 *
 * const add = (x: number) => (y: number) => x + y;
 *
 * const wrappedFn = just(add(2));  // Just((y: number) => number)
 * const wrappedVal = just(3);      // Just(3)
 *
 * const result = pipe(
 *   wrappedVal,
 *   apply(wrappedFn)    // Just(5)
 * );
 *
 * // If either value is Nothing, the result is Nothing
 * const failed = pipe(
 *   wrappedVal,
 *   apply(nothing)      // Nothing
 * );
 * ```
 */
export const apply =
  <A, B>(mab: Maybe<(a: A) => B>) => (ma: Maybe<A>): Maybe<B> =>
    mab._tag === "Nothing"
      ? mab
      : ma._tag === "Nothing"
      ? ma
      : just(mab.value(ma.value));

/**
 * Creates a function that reduces a Maybe to a single value based on whether
 * it's Nothing or Just. This is useful for handling both cases of a Maybe
 * and converting them to a common type.
 *
 * @typeParam A The value type
 * @typeParam B The result type
 * @param onNothing Function to call when the Maybe is Nothing
 * @param onJust Function to call when the Maybe has a value
 * @returns A function that takes a Maybe and returns the result type
 *
 * @example
 * ```ts
 * import { just, nothing, fold } from '@gimme/adt/maybe'
 *
 * const toString = fold(
 *   () => "No value present",
 *   (value: number) => `Value is ${value}`
 * );
 *
 * const hasValue = just(42);
 * toString(hasValue);           // "Value is 42"
 *
 * const noValue = nothing;
 * toString(noValue);           // "No value present"
 * ```
 */
export const fold =
  <A, B>(onNothing: () => B, onJust: (a: A) => B) => (ma: Maybe<A>): B =>
    ma._tag === "Just" ? onJust(ma.value) : onNothing();

/**
 * Converts a nullable value into a Maybe type. If the value is null or
 * undefined, it returns Nothing; otherwise, it wraps the value in Just.
 *
 * @typeParam A The type of the nullable value
 * @param a The nullable value to convert
 * @returns A Maybe containing the value if it exists
 *
 * @example
 * ```ts
 * import { fromNullable } from '@gimme/adt/maybe'
 *
 * fromNullable("hello");     // Just("hello")
 * fromNullable(null);        // Nothing
 * fromNullable(undefined);   // Nothing
 * ```
 */
export const fromNullable = <A>(a: A): Maybe<A> =>
  a === null || a === undefined ? nothing : just(a);

/**
 * Creates a function that converts a value into a Maybe based on a predicate.
 * If the predicate returns true, the value is wrapped in Just; if false,
 * Nothing is returned.
 *
 * @typeParam A The value type
 * @param predicate Function that tests if the value should be included
 * @returns A function that converts a value to Maybe based on the predicate
 *
 * @example
 * ```ts
 * import { fromPredicate } from '@gimme/adt/maybe'
 *
 * const isPositive = (n: number) => n > 0;
 * const positiveOnly = fromPredicate(isPositive);
 *
 * positiveOnly(42);    // Just(42)
 * positiveOnly(-1);    // Nothing
 * positiveOnly(0);     // Nothing
 * ```
 */
export const fromPredicate =
  <A>(predicate: (a: A) => boolean) => (a: A): Maybe<A> =>
    predicate(a) ? just(a) : nothing;

/**
 * Converts a potentially throwing function into a Maybe. If the function throws,
 * the result is Nothing. If the function succeeds, its result is wrapped in Just.
 * Unlike Either's tryCatch, this version doesn't need an error handler since
 * Maybe doesn't carry error information.
 *
 * @typeParam A The return type of the function
 * @param f The function that might throw
 * @returns A Maybe containing either the function's result or Nothing if it threw
 *
 * @example Basic successful case
 * ```ts
 * import { tryCatch } from '@gimme/adt/maybe'
 *
 * const parse = () => JSON.parse('{"valid": "json"}');
 *
 * tryCatch(parse);  // Just({ valid: "json" })
 * ```
 *
 * @example Handling parsing errors
 * ```ts
 * import { tryCatch } from '@gimme/adt/maybe'
 *
 * const parseInvalid = () => JSON.parse('invalid json');
 *
 * tryCatch(parseInvalid);  // Nothing
 * ```
 *
 * @example Using with further operations
 * ```ts
 * import { tryCatch, map, fold } from '@gimme/adt/maybe'
 *
 * const getCount = () => JSON.parse('{"count": 42}');
 *
 * pipe(
 *   tryCatch(getCount),
 *   map(obj => obj.count),  // Only runs if parsing succeeded
 *   fold(
 *     () => 0,             // Default value if anything failed
 *     count => count       // Use the successfully parsed count
 *   )
 * );
 * ```
 */
export const tryCatch = <A, B>(f: () => B): Maybe<B> => {
  try {
    return just(f());
  } catch {
    return nothing;
  }
};

/**
 * Converts a Maybe value to a readable string representation, using pretty-printed
 * JSON for Just values.
 *
 * @typeParam A The value type
 * @param e The Maybe value to convert to string
 * @returns A formatted string representation of the Maybe
 *
 * @example
 * ```ts
 * import { just, show } from '@gimme/adt/maybe'
 *
 * const hasValue = just({ x: 1, y: 2 });
 * show(hasValue);
 * // Just({
 * //   "x": 1,
 * //   "y": 2
 * // })
 *
 * const noValue = nothing;
 * show(noValue);
 * // Nothing
 * ```
 */
export const show = <A>(e: Maybe<A>): string =>
  e._tag === "Nothing"
    ? `Nothing`
    : `Just(${JSON.stringify(e.value, null, 2)})`;
