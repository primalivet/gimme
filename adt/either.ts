/**
 * Either represents a value that can be one of two types: either `Left<A>` or
 * `Right<B>`. The Either type is commonly used for handling computations that
 * might fail, where `Left` typically represents failure and `Right` represents
 * a success.
 *
 * @typeParam A The type contained in the `Left` variant
 * @typeParam B The type contained in the `Right` variant
 *
 * @example Success case with Right
 * ```ts
 * import { type Either, right } from '@gimme/adt/either'
 *
 * const success: Either<Error, number> = right(42);
 * ```
 *
 * @example Error case with Left
 * ```ts
 * import { type Either, right, left } from '@gimme/adt/either'
 *
 * const error: Either<Error, number> = left(new Error('Something went wrong'))
 * ```
 */
export type Either<A, B> = Left<A> | Right<B>;

/**
 * Represents the left variant of an Either type, typically used to hold failure
 * values. This is the counterpart to the Right type in the Either sum type.
 *
 * @typeParam A The type of the value contained in the Left variant
 *
 * @example
 * ```ts
 * import { type Left, left } from '@gimme/adt/either'
 *
 * const failure: Left<Error> = left(new Error("Failed"));
 * ```
 */
export type Left<A> = { _tag: "Left"; value: A };

/**
 * Represents the right variant of an Either type, typically used to hold success
 * values. This is the counterpart to the Left type in the Either sum type.
 *
 * @typeParam A The type of the value contained in the Right variant
 *
 * @example
 * ```ts
 * import { type Right, right } from '@gimme/adt/either'
 * const success: Right<number> = right(42);
 * ```
 */
export type Right<A> = { _tag: "Right"; value: A };

/**
 * Creates a Left variant of Either, typically used for failure cases.
 *
 * @typeParam A The type of the value to be wrapped in Left
 * @param a The value to be wrapped in Left
 * @returns A Left instance containing the provided value
 *
 * @example
 * ```ts
 * import { left } from '@gimme/adt/either'
 * const failure = left(new Error("Operation failed"));
 * ```
 */
export const left = <A>(a: A): Left<A> => ({ _tag: "Left", value: a });

/**
 * Creates a Right variant of Either, typically used for success cases.
 *
 * @typeParam A The type of the value to be wrapped in Right
 * @param a The value to be wrapped in Right
 * @returns A Right instance containing the provided value
 *
 * @example
 * ```ts
 * import { right } from '@gimme/adt/either'
 *
 * const success = right(42);
 * ```
 */
export const right = <A>(a: A): Right<A> => ({ _tag: "Right", value: a });

/**
 * A constructor that lifts a value into a successful Either context. This is an alias
 * for the `right` constructor, representing the "pure" operation found in functional
 * programming.
 *
 * Just like how 0 is the identity value for addition (x + 0 = x) and 1 is the
 * identity for multiplication (x * 1 = x), `pure` follows specific identity laws
 * when used with bind:
 *
 * @typeParam A The type of the value to be wrapped
 * @param a The value to be wrapped
 * @returns A Right instance containing the provided value
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { right, pure, bind } from '@gimme/adt/either'
 *
 * const value = 42;
 * const f = (n: number) => right(n * 2);
 *
 * // Left identity: pure(x) bind f = f(x)
 * pipe(pure(value), bind(f)) // Same as f(value)
 *
 * // Right identity: m bind pure = m
 * pipe(f(value), bind(pure)) // Same as f(value)
 * ```
 */
export const pure: typeof right = right;

/**
 * Type guard that checks if an Either value is a Left variant.
 *
 * @typeParam A The type of the Left value
 * @typeParam B The type of the Right value
 * @param ma The Either value to check
 * @returns True if the Either is a Left, with type narrowing
 *
 * @example
 * ```ts
 * import { type Either, left, isLeft } from '@gimme/adt/either'
 *
 * const either: Either<Error, number> = left(new Error("Failed"));
 *
 * if (isLeft(either)) {
 *   // either is narrowed to Left<Error>
 *   console.log(either.value.message);
 * }
 * ```
 */
export const isLeft = <A, B>(ma: Either<A, B>): ma is Left<A> =>
  ma._tag === "Left";

/**
 * Type guard that checks if an Either value is a Right variant.
 *
 * @typeParam A The type of the Left value
 * @typeParam B The type of the Right value
 * @param ma The Either value to check
 * @returns True if the Either is a Right, with type narrowing
 *
 * @example
 * ```ts
 * import { type Either, right, isRight } from '@gimme/adt/either'
 *
 * const either: Either<Error, number> = right(42);
 *
 * if (isRight(either)) {
 *   // either is narrowed to Right<number>
 *   console.log(either.value * 2);
 * }
 * ```
 */
export const isRight = <A, B>(ma: Either<A, B>): ma is Right<B> =>
  ma._tag === "Right";

/**
 * Creates a function that transforms the value inside a Right variant of Either,
 * while preserving Left variants unchanged. Similar to Array.map(), but operating
 * on the value in an Either context.
 *
 * @typeParam A The type of the Left value (remains unchanged)
 * @typeParam B The type of the input Right value
 * @typeParam C The type of the output Right value
 * @param f The function to apply to the Right value
 * @returns A function that takes an Either and returns a new Either with the transformed value
 *
 * @example
 * ```ts
 * import { right, left, map } from '@gimme/adt/either'
 *
 * const double = (n: number) => n * 2;
 *
 * const rightValue = right(21);
 * const doubled = map(double)(rightValue); // Right(42)
 *
 * const leftValue = left(new Error("Failed"));
 * const stillLeft = map(double)(leftValue); // Left(Error("Failed"))
 * ```
 */
export const map =
  <A, B, C>(f: (b: B) => C) => (ma: Either<A, B>): Either<A, C> =>
    ma._tag === "Right" ? right(f(ma.value)) : ma;

/**
 * Creates a function that transforms the value inside a Left variant of Either,
 * while preserving Right variants unchanged. This is the counterpart to `map`
 * which operates on Right values.
 *
 * @typeParam E The type of the input Left value
 * @typeParam F The type of the output Left value
 * @typeParam A The type of the Right value (remains unchanged)
 * @param f The function to apply to the Left value
 * @returns A function that takes an Either and returns a new Either with the transformed error value
 *
 * @example
 * ```ts
 * import { right, left, mapLeft } from '@gimme/adt/either'
 *
 * const addContext = (e: Error) => new Error(`Operation failed: ${e.message}`);
 *
 * const leftValue = left(new Error("Not found"));
 * const withContext = mapLeft(addContext)(leftValue); // Left(Error("Operation failed: Not found"))
 *
 * const rightValue = right(42);
 * const unchanged = mapLeft(addContext)(rightValue); // Right(42)
 * ```
 */
export const mapLeft =
  <E, F, A>(f: (b: E) => F) => (ma: Either<E, A>): Either<F, A> =>
    ma._tag === "Left" ? left(f(ma.value)) : ma;

/**
 * Creates a function that can transform both sides of an Either value. Combines
 * the functionality of `map` and `mapLeft` into a single operation.
 *
 * @typeParam E The type of the input Left value
 * @typeParam F The type of the output Left value
 * @typeParam A The type of the input Right value
 * @typeParam B The type of the output Right value
 * @param f The function to apply to the Left value
 * @param g The function to apply to the Right value
 * @returns A function that takes an Either and returns a new Either with both sides possibly transformed
 *
 * @example
 * ```ts
 * import { right, left, bimap } from '@gimme/adt/either'
 *
 * const addContext = (e: Error) => new Error(`Operation failed: ${e.message}`);
 * const double = (n: number) => n * 2;
 *
 * const transform = bimap(addContext, double);
 *
 * const leftValue = left(new Error("Not found"));
 * transform(leftValue); // Left(Error("Operation failed: Not found"))
 *
 * const rightValue = right(21);
 * transform(rightValue); // Right(42)
 * ```
 */
export const bimap =
  <E, F, A, B>(f: (e: E) => F, g: (a: A) => B) =>
  (ma: Either<E, A>): Either<F, A> | Either<E, B> =>
    ma._tag === "Left" ? left(f(ma.value)) : right(g(ma.value));

/**
 * Creates a function that chains Either computations together. When given a
 * function that produces an Either and an existing Either value, it applies
 * the function only if the Either is a Right variant.
 *
 * This is the fundamental operation for sequencing Either computations, following
 * the monad laws:
 *
 * @typeParam A The error type
 * @typeParam B The input success type
 * @typeParam C The output success type
 * @param f A function that takes a success value and returns a new Either
 * @returns A function that chains the Either computation with f
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { type Either, right, left, bind } from '@gimme/adt/either'
 *
 * const parseInt = (s: string): Either<Error, number> => {
 *   const n = Number(s);
 *   return isNaN(n)
 *     ? left(new Error(`Not a number: ${s}`))
 *     : right(n);
 * };
 *
 * const divide = (n: number): Either<Error, number> =>
 *   n === 0
 *     ? left(new Error("Division by zero"))
 *     : right(10 / n);
 *
 * // Chain operations together
 * const success = pipe(
 *   right("5"),
 *   bind(parseInt),     // Right(5)
 *   bind(divide)        // Right(2)
 * );
 *
 * // Fails at first step
 * const failParse = pipe(
 *   right("not a number"),
 *   bind(parseInt),     // Left(Error("Not a number: not a number"))
 *   bind(divide)        // Left is propagated, divide never runs
 * );
 *
 * // Fails at second step
 * const failDivide = pipe(
 *   right("0"),
 *   bind(parseInt),     // Right(0)
 *   bind(divide)        // Left(Error("Division by zero"))
 * );
 * ```
 */
export const bind =
  <A, B, C>(f: (b: B) => Either<A, C>) => (ma: Either<A, B>): Either<A, C> =>
    ma._tag === "Right" ? f(ma.value) : ma;

/**
 * Flattens a nested Either into a single Either. This function is useful when you
 * have a value of type Either<E, Either<E, A>> and want to get Either<E, A>.
 *
 * @typeParam E The error type
 * @typeParam A The value type
 * @param mma The nested Either to flatten
 * @returns A flattened Either
 *
 * @example
 * ```ts
 * import { right, left, join } from '@gimme/adt/either'
 *
 * const nested = right(right(42));          // Either<never, Either<never, number>>
 * join(nested);                             // Either<never, number>
 *
 * const nestedLeft = right(left(new Error("Failed")));
 * join(nestedLeft);                         // Left(Error("Failed"))
 *
 * const outerLeft = left(new Error("Outer"));
 * join(outerLeft);                          // Left(Error("Outer"))
 * ```
 */
export const join = <E, A>(mma: Either<E, Either<E, A>>): Either<E, A> =>
  mma._tag === "Left" ? mma : mma.value;

/**
 * Creates a function that applies a wrapped function from one Either to a value in
 * another Either. This enables applying functions between Either contexts and is
 * useful when you have a function wrapped in an Either that you want to apply to
 * a value in another Either.
 *
 * @typeParam E The error type of the value Either
 * @typeParam A The type of the input value
 * @typeParam F The error type of the function Either
 * @typeParam B The return type of the wrapped function
 * @param fa The Either containing the value to apply the function to
 * @returns A function that takes an Either containing a function and returns a new Either
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { right, left, apply } from '@gimme/adt/either'
 *
 * const add = (x: number) => (y: number) => x + y;
 *
 * const wrappedFn = right(add(2));  // Right((y: number) => number)
 * const wrappedVal = right(3);      // Right(3)
 *
 * const result = pipe(
 *   wrappedVal,
 *   apply(wrappedFn)    // Right(5)
 * );
 *
 * // If either value is Left, the Left is propagated
 * const failed = pipe(
 *   wrappedVal,
 *   apply(left(new Error("Failed")))  // Left(Error("Failed"))
 * );
 * ```
 */
export const apply =
  <E, A, B>(mab: Either<E, (a: A) => B>) =>
  <F>(ma: Either<E, A>): Either<E | F, B> =>
    mab._tag === "Left"
      ? mab
      : ma._tag === "Left"
      ? ma
      : right(mab.value(ma.value));

/**
 * Converts an array of Either values into an Either containing an array of values.
 * If all values in the input array are Right, returns a Right containing an array
 * of all the values. If any value is Left, returns the first Left encountered.
 *
 * This is useful when you have multiple Either operations and want to combine
 * them, succeeding only if all operations succeed.
 *
 * @typeParam E The error type
 * @typeParam A The success value type
 * @param mas An array of Either values
 * @returns Either the first error encountered, or an array of all success values
 *
 * @example Combining successful operations
 * ```ts
 * import { right, sequence } from '@gimme/adt/either'
 *
 * const values = [
 *   right(1),
 *   right(2),
 *   right(3)
 * ];
 *
 * sequence(values);  // Right([1, 2, 3])
 * ```
 *
 * @example Handling failures
 * ```ts
 * import { right, left, sequence } from '@gimme/adt/either'
 *
 * const values = [
 *   right(1),
 *   left(new Error("Failed")),
 *   right(3)
 * ];
 *
 * sequence(values);  // Left(Error("Failed"))
 * ```
 *
 * @example Practical use with array operations
 * ```ts
 * import { right, left, sequence, Either } from '@gimme/adt/either'
 *
 * const parseInt = (s: string): Either<Error, number> =>
 *   isNaN(Number(s))
 *     ? left(new Error(`Not a number: ${s}`))
 *     : right(Number(s));
 *
 * const strings = ["1", "2", "3"];
 * const numbers = sequence(strings.map(parseInt));  // Right([1, 2, 3])
 *
 * const invalid = ["1", "not a number", "3"];
 * const failed = sequence(invalid.map(parseInt));   // Left(Error("Not a number: not a number"))
 * ```
 */
export const sequence = <E, A>(
  mas: Array<Either<E, A>>,
): Either<E, Array<A>> => {
  const result = [];
  for (const ma of mas) {
    if (isLeft(ma)) return ma;
    result.push(ma.value);
  }
  return right(result);
};

/**
 * Creates a function that reduces an Either to a single value based on whether
 * it's a Left or Right. This is useful for handling both cases of an Either
 * and converting them to a common type.
 *
 * @typeParam A The Left type
 * @typeParam B The Right type
 * @typeParam C The result type
 * @param onLeft Function to handle the Left case
 * @param onRight Function to handle the Right case
 * @returns A function that takes an Either and returns the result type
 *
 * @example
 * ```ts
 * import { right, left, fold } from '@gimme/adt/either'
 *
 * const toString = fold(
 *   (error: Error) => `Error: ${error.message}`,
 *   (value: number) => `Success: ${value}`
 * );
 *
 * const success = right(42);
 * toString(success);           // "Success: 42"
 *
 * const failure = left(new Error("Not found"));
 * toString(failure);          // "Error: Not found"
 * ```
 *
 * @example
 * ```ts
 * import { right, left, fold } from '@gimme/adt/either'
 *
 * // Providing a default value
 * const getValueOrZero = fold(
 *   (_: Error) => 0,
 *   (n: number) => n
 * );
 *
 * getValueOrZero(right(42));  // 42
 * getValueOrZero(left(new Error()));  // 0
 * ```
 */
export const fold =
  <A, B, C>(onLeft: (a: A) => C, onRight: (b: B) => C) =>
  (ma: Either<A, B>): C =>
    ma._tag === "Left" ? onLeft(ma.value) : onRight(ma.value);

/**
 * Creates a function that converts a nullable value into an Either type. If the
 * value is null or undefined, it creates a Left using the provided error function;
 * otherwise, it wraps the value in a Right.
 *
 * @typeParam A The error type
 * @typeParam B The value type
 * @param onNullable Function to create an error value when the input is null/undefined
 * @returns A function that takes a potentially nullable value and returns an Either
 *
 * @example
 * ```ts
 * import { fromNullable } from '@gimme/adt/either'
 *
 * const toError = () => new Error("Value was null");
 * const parseNullable = fromNullable(toError);
 *
 * parseNullable("hello");     // Right("hello")
 * parseNullable(null);        // Left(Error("Value was null"))
 * parseNullable(undefined);   // Left(Error("Value was null"))
 * ```
 */
export const fromNullable =
  <A, B>(onNullable: (b: B) => A) => (b: B): Either<A, B> =>
    b === null || b === undefined ? left(onNullable(b)) : right(b);

/**
 * Creates a function that converts a value into an Either based on a predicate.
 * If the predicate returns true, the value is wrapped in a Right; if false,
 * the error function is called and its result is wrapped in a Left.
 *
 * @typeParam A The error type
 * @typeParam B The value type
 * @param predicate Function that tests if the value is valid
 * @returns A function that takes an error function and returns another function
 * that converts a value to Either based on the predicate
 *
 * @example
 * ```ts
 * import { fromPredicate } from '@gimme/adt/either'
 *
 * const isPositive = (n: number): n is number => n > 0;
 * const toError = (n: number) => new Error(`${n} is not positive`);
 *
 * const ensurePositive = fromPredicate(toError)(isPositive);
 *
 * ensurePositive(42);    // Right(42)
 * ensurePositive(-1);    // Left(Error("-1 is not positive"))
 * ensurePositive(0);     // Left(Error("0 is not positive"))
 * ```
 */
export const fromPredicate =
  <A, B>(onUnsatisfied: (b: B) => A) =>
  <C extends B>(predicate: (b: B) => b is C) =>
  (b: B): Either<A, C> => predicate(b) ? right(b) : left(onUnsatisfied(b));

/**
 * Converts a potentially throwing function into an Either. If the function throws,
 * the error is caught and transformed using the provided error handler into a
 * Left. If the function succeeds, its result is wrapped in a Right.
 *
 * @typeParam A The error type
 * @typeParam B The return type of the function
 * @param f The function that might throw
 * @param onError Function to transform the caught error into the error type
 * @returns An Either containing either the error or the function's result
 *
 * @example
 * ```ts
 * import { tryCatch } from '@gimme/adt/either'
 *
 * const parse = () => JSON.parse('{"valid": "json"}');
 * const parseInvalid = () => JSON.parse('invalid json');
 *
 * const toError = (e: unknown) =>
 *   e instanceof Error ? e : new Error('Unknown error');
 *
 * tryCatch(toError)(parse);      // Right({ valid: "json" })
 * tryCatch(toError)(parseInvalid) // Left(SyntaxError("Unexpected token..."))
 * ```
 */
export const tryCatch =
  <A, B>(onError: (e: unknown) => A) => (f: () => B): Either<A, B> => {
    try {
      return right(f());
    } catch (e) {
      return left(onError(e));
    }
  };

/**
 * Converts an Either value to a readable string representation, using pretty-printed
 * JSON for the contained values.
 *
 * @typeParam A The Left type
 * @typeParam B The Right type
 * @param ma The Either value to convert to string
 * @returns A formatted string representation of the Either
 *
 * @example
 * ```ts
 * import { right, left, show } from '@gimme/adt/either'
 *
 * const success = right({ x: 1, y: 2 });
 * show(success);
 * // Right({
 * //   "x": 1,
 * //   "y": 2
 * // })
 *
 * const failure = left(new Error("Not found"));
 * show(failure);
 * // Left({
 * //   "message": "Not found"
 * // })
 * ```
 */
export const show = <A, B>(ma: Either<A, B>): string =>
  ma._tag === "Left"
    ? `Left(${JSON.stringify(ma.value, null, 2)})`
    : `Right(${JSON.stringify(ma.value, null, 2)})`;
