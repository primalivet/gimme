import type { Task } from "@gimme/adt/task";
import {
  type Either,
  left as _left,
  map as _map,
  mapLeft as _mapLeft,
  right as _right,
} from "@gimme/adt/either";

/**
 * TaskEither represents an asynchronous computation that may either fail or succeed.
 * It combines the lazy execution of Task with the error handling of Either, making
 * it ideal for modeling operations that are both asynchronous and fallible, such
 * as network requests, file operations, or database queries.
 *
 * While Task represents computations that always succeed and Either handles
 * synchronous operations that may fail, TaskEither handles both concerns by
 * representing an asynchronous computation that will produce either an error
 * of type E or a success value of type A when executed.
 *
 * A TaskEither is expected never to reject. Every constructor in this module
 * upholds that: `left`, `right`, `fromEither`, `tryCatch` and `tryCatchK` always
 * resolve to an Either, and `fromTask` relies on Task's own contract of never
 * failing. Functions passed to `map`, `mapLeft`, `bind` and `fold` are expected
 * to return rather than throw; expected failures are modeled by returning a
 * `Left`. Code that may throw or reject enters through `tryCatch` or
 * `tryCatchK`, which convert the thrown value into the error type. A throw
 * inside a combinator function, or a hand-written task that rejects, is not
 * captured and will propagate out of `run`.
 *
 * @typeParam E The type of the error that may occur
 * @typeParam A The type of the value that will be produced on success
 *
 * @example Basic validation example
 * ```ts
 * import { type TaskEither, left, right, run } from '@gimme/adt/task-either';
 *
 * type ValidationError = { field: string; message: string };
 * type UserData = { age: number; name: string };
 *
 * const validateUser = (data: UserData): TaskEither<ValidationError, UserData> =>
 *   data.age >= 18
 *     ? right(data)
 *     : left({ field: "age", message: "Must be 18 or older" });
 *
 * await run(validateUser({ age: 20, name: "John" }));
 * // Right({ age: 20, name: "John" })
 *
 * await run(validateUser({ age: 16, name: "Young" }));
 * // Left({ field: "age", message: "Must be 18 or older" })
 * ```
 *
 * @example Composing multiple operations
 * ```ts
 * import { flow } from '@gimme/base'
 * import { type TaskEither, left, right, bind, run } from '@gimme/adt/task-either'
 *
 * // Custom error type for our operations
 * type ProcessError =
 *   | { type: "parse"; message: string }
 *   | { type: "validation"; message: string };
 *
 * // Parse a string to number
 * const parseNumber = (s: string): TaskEither<ProcessError, number> => {
 *   const n = Number(s);
 *   return isNaN(n)
 *     ? left({ type: "parse", message: `Invalid number: ${s}` })
 *     : right(n);
 * }
 *
 * // Validate the number is positive
 * const validatePositive = (n: number): TaskEither<ProcessError, number> => {
 *   return n > 0
 *     ? right(n)
 *     : left({ type: "validation", message: "Number must be positive" })
 * };
 *
 * // Compose operations using bind
 * const processInput = flow(
 *   parseNumber,
 *   bind(validatePositive)
 * );
 *
 * await run(processInput("42"));  // Right(42)
 * await run(processInput("abc")); // Left({ type: "parse", message: "Invalid number: abc" })
 * await run(processInput("-57")); // Left({ type: "validation", message: "Number must be positive" })
 * ```
 */
export type TaskEither<E, A> = Task<Either<E, A>>;

/**
 * Creates a TaskEither that will fail with the given error value. This constructor
 * lifts a plain error value into the TaskEither context by wrapping it in both
 * Task and Either layers.
 *
 * @typeParam E The error type
 * @typeParam A The success type (never produced in this case)
 * @param e The error value
 * @returns A TaskEither that resolves to a Left containing the error
 *
 * @example Basic usage
 * ```ts
 * import { left, run } from '@gimme/adt/task-either'
 *
 * type ApiError = { status: number; message: string };
 *
 * const notFound = left<ApiError, string>({
 *   status: 404,
 *   message: "Resource not found"
 * });
 *
 * await run(notFound); // Left({ status: 404, message: "Resource not found" })
 * ```
 *
 * @example Using in error handling
 * ```ts
 * import { type TaskEither, left, right, run } from '@gimme/adt/task-either'
 *
 * type AppError = { type: "validation"; message: string };
 *
 * const validateAge = (age: number): TaskEither<AppError, number> =>
 *   age >= 0
 *     ? right(age)
 *     : left({ type: "validation", message: "Age must be positive" });
 *
 * await run(validateAge(-5));
 * // Left({ type: "validation", message: "Age must be positive" })
 * ```
 */
export const left = <E = never, A = never>(e: E): TaskEither<E, A> => () =>
  Promise.resolve(_left(e));

/**
 * Creates a TaskEither that will succeed with the given value. This constructor
 * lifts a plain value into the TaskEither context by wrapping it in both Task
 * and Either layers.
 *
 * @typeParam E The error type (never produced in this case)
 * @typeParam A The success type
 * @param a The success value
 * @returns A TaskEither that resolves to a Right containing the value
 *
 * @example Basic usage
 * ```ts
 * import { right, run } from '@gimme/adt/task-either'
 *
 * const succeed = right<Error, number>(42);
 *
 * await run(succeed); // Right(42)
 * ```
 *
 * @example Combining with computation
 * ```ts
 * import { type TaskEither, left, right, run } from '@gimme/adt/task-either'
 *
 * type ParseError = { type: "parse"; message: string };
 *
 * const parse = (input: string): TaskEither<ParseError, number> => {
 *   const n = Number(input);
 *   return isNaN(n)
 *     ? left({ type: "parse", message: `Invalid number: ${input}` })
 *     : right(n);
 * };
 *
 * await run(parse("42"));    // Right(42)
 * await run(parse("test"));  // Left({ type: "parse", message: "Invalid number: test" })
 * ```
 */
export const right = <E = never, A = never>(a: A): TaskEither<E, A> => () =>
  Promise.resolve(_right(a));

/**
 * A constructor that lifts a value into a successful TaskEither context. This is
 * an alias for the `right` constructor, representing the "pure" operation found
 * in functional programming.
 *
 * Just like how 0 is the identity value for addition (x + 0 = x) and 1 is the
 * identity for multiplication (x * 1 = x), `pure` follows specific identity laws
 * when used with bind:
 *
 * @typeParam E The error type (never produced in this case)
 * @typeParam A The type of the value to be wrapped
 * @param a The value to be wrapped
 * @returns A TaskEither that resolves to a Right containing the value
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { type TaskEither, pure, bind, run } from '@gimme/adt/task-either'
 *
 * const value = 42;
 * const f = (n: number): TaskEither<Error, number> => pure(n * 2);
 *
 * // Left identity: pure(x) bind f = f(x)
 * await run(pipe(pure<Error, number>(value), bind(f))); // Right(84)
 * await run(f(value));                                  // Right(84)
 *
 * // Right identity: m bind pure = m
 * await run(pipe(f(value), bind(pure)));                // Right(84)
 * await run(f(value));                                  // Right(84)
 * ```
 */
export const pure: typeof right = right;

/**
 * Creates a function that transforms the success value inside a TaskEither using
 * the provided function, while leaving error values unchanged. Similar to
 * Array.map(), but operating on the successful value in a TaskEither context.
 *
 * @typeParam E The error type (remains unchanged)
 * @typeParam A The type of the input success value
 * @typeParam B The type of the output success value
 * @param f The function to apply to the success value
 * @returns A function that takes a TaskEither and returns a new TaskEither with the transformed value
 *
 * @example Basic transformation
 * ```ts
 * import { right, left, map, run } from '@gimme/adt/task-either'
 *
 * const double = (n: number): number => n * 2;
 *
 * const success = right<Error, number>(21);
 * const doubled = map(double)(success);
 * await run(doubled); // Right(42)
 *
 * const failure = left<Error, number>(new Error("Failed"));
 * const stillError = map(double)(failure);
 * await run(stillError); // Left(Error("Failed"))
 * ```
 *
 * @example Complex transformations
 * ```ts
 * import { flow } from '@gimme/base'
 * import { type TaskEither, right, left, map, run } from '@gimme/adt/task-either'
 *
 * type User = { name: string; age: number };
 * type UserError = { code: string; message: string };
 *
 * const formatUser = (user: User): string =>
 *   `${user.name} (${user.age} years old)`;
 *
 * const getUser = (id: number): TaskEither<UserError, User> =>
 *   id > 0
 *     ? right({ name: "Alice", age: 30 })
 *     : left({ code: "INVALID_ID", message: "ID must be positive" });
 *
 * const displayUser = flow(
 *   getUser,
 *   map(formatUser)
 * );
 *
 * await run(displayUser(1));  // Right("Alice (30 years old)")
 * await run(displayUser(-1)); // Left({ code: "INVALID_ID", message: "ID must be positive" })
 * ```
 */
export const map =
  <E, A, B>(f: (a: A) => B): (ma: TaskEither<E, A>) => TaskEither<E, B> =>
  (ma: TaskEither<E, A>): TaskEither<E, B> =>
  () => ma().then(_map(f));

/**
 * Creates a function that transforms the error value inside a TaskEither using
 * the provided function, while leaving success values unchanged. This is the
 * counterpart to `map` which operates on success values.
 *
 * @typeParam E The type of the input error value
 * @typeParam U The type of the output error value
 * @typeParam A The success type (remains unchanged)
 * @param f The function to apply to the error value
 * @returns A function that takes a TaskEither and returns a new TaskEither with the transformed error value
 *
 * @example Basic error transformation
 * ```ts
 * import { right, left, mapLeft, run } from '@gimme/adt/task-either'
 *
 * type BasicError = { message: string };
 * type EnhancedError = { code: string; details: string };
 *
 * const addErrorCode = (e: BasicError): EnhancedError => ({
 *   code: "ERR_001",
 *   details: e.message
 * });
 *
 * const failure = left<BasicError, number>({ message: "Invalid input" });
 * const enhanced = mapLeft(addErrorCode)(failure);
 * await run(enhanced); // Left({ code: "ERR_001", details: "Invalid input" })
 *
 * const success = right<BasicError, number>(42);
 * const unchanged = mapLeft(addErrorCode)(success);
 * await run(unchanged); // Right(42)
 * ```
 *
 * @example Error handling in validation chain
 * ```ts
 * import { flow } from '@gimme/base'
 * import { type TaskEither, right, left, mapLeft, run } from '@gimme/adt/task-either'
 *
 * type ValidationError = { field: string; issue: string };
 * type ApiError = { status: number; message: string };
 *
 * const validateAge = (age: number): TaskEither<ValidationError, number> =>
 *   age >= 0
 *     ? right(age)
 *     : left({ field: "age", issue: "Must be positive" });
 *
 * const toApiError = (e: ValidationError): ApiError => ({
 *   status: 400,
 *   message: `Invalid ${e.field}: ${e.issue}`
 * });
 *
 * const processAge = flow(
 *   validateAge,
 *   mapLeft(toApiError)
 * );
 *
 * await run(processAge(25));  // Right(25)
 * await run(processAge(-5));  // Left({ status: 400, message: "Invalid age: Must be positive" })
 * ```
 */
export const mapLeft =
  <E, U, A>(f: (e: E) => U): (ma: TaskEither<E, A>) => TaskEither<U, A> =>
  (ma: TaskEither<E, A>): TaskEither<U, A> =>
  () => ma().then(_mapLeft(f));

/**
 * Creates a function that chains TaskEither computations together. When given a
 * function that produces a TaskEither and an existing TaskEither value, it applies
 * the function only if the first operation succeeds. If any operation in the chain
 * fails, that error is propagated and subsequent operations are skipped.
 *
 * The error types of the two operations do not have to match. The result carries
 * their union, so operations with different error types can be chained and each
 * error is still matchable at `fold`.
 *
 * @typeParam E1 The error type of the operation produced by f
 * @typeParam A The input success type
 * @typeParam B The output success type
 * @typeParam E2 The error type of the TaskEither being chained from
 * @param f A function that takes a success value and returns a new TaskEither
 * @returns A function that chains the TaskEither computation with f, with error type E1 | E2
 *
 * @example Basic chaining of async validations
 * ```ts
 * import { flow } from '@gimme/base'
 * import { type TaskEither, right, left, bind, run } from '@gimme/adt/task-either'
 *
 * type ValidationError = { field: string; message: string };
 *
 * const checkLength = (s: string): TaskEither<ValidationError, string> =>
 *   s.length >= 3
 *     ? right(s)
 *     : left({ field: "input", message: "Too short" });
 *
 * const checkNumeric = (s: string): TaskEither<ValidationError, number> => {
 *   const n = Number(s);
 *   return isNaN(n)
 *     ? left({ field: "input", message: "Not a number" })
 *     : right(n);
 * };
 *
 * const validate = (input: string): TaskEither<ValidationError, number> =>
 *   flow(
 *     checkLength,
 *     bind(checkNumeric)
 *   )(input);
 *
 * await run(validate("123"));  // Right(123)
 * await run(validate("12"));   // Left({ field: "input", message: "Too short" })
 * await run(validate("abc"));  // Left({ field: "input", message: "Not a number" })
 * ```
 *
 * @example Multi-step data processing
 * ```ts
 * import { flow } from '@gimme/base'
 * import { type TaskEither, right, left, bind, run } from '@gimme/adt/task-either'
 *
 * type ProcessError =
 *   | { type: "fetch"; message: string }
 *   | { type: "parse"; message: string };
 *
 * const fetchData = (id: number): TaskEither<ProcessError, string> =>
 *   id > 0
 *     ? right("{ \"value\": 42 }")
 *     : left({ type: "fetch", message: "Invalid ID" });
 *
 * const parseJson = (data: string): TaskEither<ProcessError, unknown> => {
 *   try {
 *     return right(JSON.parse(data));
 *   } catch {
 *     return left({ type: "parse", message: "Invalid JSON" });
 *   }
 * };
 *
 * const process = flow(
 *   fetchData,
 *   bind(parseJson)
 * );
 *
 * await run(process(1));   // Right({ value: 42 })
 * await run(process(-1));  // Left({ type: "fetch", message: "Invalid ID" })
 * await run(process(2));   // Right({ value: 42 })
 * ```
 *
 * @example Chaining operations with different error types
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { type TaskEither, right, left, bind, run } from '@gimme/adt/task-either'
 *
 * type ApiError = { type: "not_found"; id: number };
 * type DbError = { type: "conflict"; key: string };
 * type User = { id: number; name: string };
 *
 * const fetchUser = (id: number): TaskEither<ApiError, User> =>
 *   id > 0
 *     ? right({ id, name: "Alice" })
 *     : left({ type: "not_found", id });
 *
 * const saveUser = (user: User): TaskEither<DbError, number> =>
 *   user.name !== "taken"
 *     ? right(user.id)
 *     : left({ type: "conflict", key: user.name });
 *
 * // TaskEither<ApiError | DbError, number>
 * const saved = pipe(fetchUser(1), bind(saveUser));
 *
 * await run(saved);                            // Right(1)
 * await run(pipe(fetchUser(-1), bind(saveUser))); // Left({ type: "not_found", id: -1 })
 * ```
 */
export const bind = <E1, A, B>(
  f: (a: A) => TaskEither<E1, B>,
): <E2>(ma: TaskEither<E2, A>) => TaskEither<E1 | E2, B> =>
<E2>(ma: TaskEither<E2, A>): TaskEither<E1 | E2, B> =>
() =>
  ma().then((e): Promise<Either<E1 | E2, B>> =>
    e._tag === "Right" ? f(e.value)() : Promise.resolve(e)
  );

/**
 * Executes a TaskEither computation, converting it from a lazy computation into
 * a Promise that will resolve to an Either. This is typically used as the final
 * step when you need to actually perform the computation and handle its result.
 *
 * @typeParam E The error type
 * @typeParam A The success type
 * @param ma The TaskEither to execute
 * @returns A Promise that resolves to an Either containing either an error or success value
 *
 * @example Basic execution
 * ```ts
 * import { type TaskEither, right, left, run } from '@gimme/adt/task-either'
 *
 * type DataError = { type: "not_found"; id: number };
 *
 * const getData = (id: number): TaskEither<DataError, string> =>
 *   id === 1
 *     ? right("success")
 *     : left({ type: "not_found", id });
 *
 * // TaskEither is lazy - nothing happens until run
 * const task = getData(1);
 *
 * // Now the computation executes
 * const result = await run(task); // Right("success")
 *
 * // Error case
 * const error = await run(getData(2)); // Left({ type: "not_found", id: 2 })
 * ```
 *
 * @example With error handling
 * ```ts
 * import { type TaskEither, right, left, run } from '@gimme/adt/task-either'
 * import { isRight } from '@gimme/adt/either'
 *
 * type ParseError = { type: "parse"; message: string };
 *
 * const parseNumber = (s: string): TaskEither<ParseError, number> => {
 *   const n = Number(s);
 *   return isNaN(n)
 *     ? left({ type: "parse", message: `Invalid number: ${s}` })
 *     : right(n);
 * };
 *
 * const result = await run(parseNumber("42"));
 * if (isRight(result)) {
 *   console.log(result.value * 2);  // 84
 * } else {
 *   console.error(result.value.message);
 * }
 * ```
 */
export const run = <E, A>(ma: TaskEither<E, A>): Promise<Either<E, A>> => ma();

/**
 * Creates a function that reduces a TaskEither to a Task by handling both error
 * and success cases. This is useful when you need to convert both possible
 * outcomes into a common type and continue with a non-failing computation.
 *
 * @typeParam E The error type
 * @typeParam A The success type
 * @typeParam B The common output type for both cases
 * @param onLeft Function to handle the error case, returning a Task
 * @param onRight Function to handle the success case, returning a Task
 * @returns A function that takes a TaskEither and returns a Task of the common type
 *
 * @example Error recovery with default values
 * ```ts
 * import { type TaskEither, right, left, fold } from '@gimme/adt/task-either'
 * import { pure } from '@gimme/adt/task'
 *
 * type LoadError = { type: "not_found"; id: number };
 * type User = { id: number; name: string };
 *
 * const loadUser = (id: number): TaskEither<LoadError, User> =>
 *   id > 0
 *     ? right({ id, name: "John" })
 *     : left({ type: "not_found", id });
 *
 * // Convert both outcomes to a display string
 * const display = fold<LoadError, User, string>(
 *   error => pure(`User ${error.id} not found`),
 *   user => pure(`Found user: ${user.name}`)
 * );
 *
 * const task = display(loadUser(1));
 * await task(); // "Found user: John"
 *
 * const errorTask = display(loadUser(-1));
 * await errorTask(); // "User -1 not found"
 * ```
 *
 * @example Complex error handling with async operations
 * ```ts
 * import { type TaskEither, right, left, fold } from '@gimme/adt/task-either'
 * import { pure } from '@gimme/adt/task'
 *
 * type CacheError = { type: "cache_miss" } | { type: "invalid_key" };
 * type CacheValue = { data: string; timestamp: number };
 *
 * const getFromCache = (key: string): TaskEither<CacheError, CacheValue> =>
 *   key.length > 0
 *     ? right({ data: "cached", timestamp: Date.now() })
 *     : left({ type: "invalid_key" });
 *
 * // Handle cache misses by providing default data
 * const withFallback = fold<CacheError, CacheValue, CacheValue>(
 *   error => pure({ data: "default", timestamp: 0 }),
 *   value => pure(value)
 * );
 *
 * const task = withFallback(getFromCache("user-1"));
 * await task(); // { data: "cached", timestamp: ... }
 *
 * const errorTask = withFallback(getFromCache(""));
 * await errorTask(); // { data: "default", timestamp: 0 }
 * ```
 */
export const fold = <E, A, B>(
  onLeft: (e: E) => Task<B>,
  onRight: (a: A) => Task<B>,
): (ma: TaskEither<E, A>) => Task<B> =>
(ma: TaskEither<E, A>): Task<B> =>
() =>
  ma().then((either) => {
    const task = either._tag === "Left"
      ? onLeft(either.value)
      : onRight(either.value);
    return task();
  });

/**
 * Creates a function that safely converts a possibly throwing function into a
 * TaskEither. The function may return a value or a Promise; a synchronous throw
 * and a rejection are captured the same way and converted with `onError`. This
 * is useful when working with existing Promise-based APIs or synchronous
 * operations that might throw.
 *
 * @typeParam E The error type to convert thrown errors into
 * @typeParam A The success type
 * @param onError Function to convert unknown errors into the expected error type
 * @returns A function that takes a possibly throwing function and returns a TaskEither
 *
 * @example Converting Promise-based API calls
 * ```ts
 * import { tryCatch, run } from '@gimme/adt/task-either'
 *
 * type ApiError = { type: "api_error"; message: string };
 *
 * const toApiError = (e: unknown): ApiError => ({
 *   type: "api_error",
 *   message: e instanceof Error ? e.message : "Unknown error"
 * });
 *
 * // Simulated API call that might fail
 * const fetchData = async (succeeds: boolean): Promise<string> => {
 *   if (succeeds) {
 *     return "success";
 *   }
 *   throw new Error("Network error");
 * };
 *
 * const safeOperation = tryCatch(toApiError);
 *
 * await run(safeOperation(() => fetchData(true)));
 * // Right("success")
 *
 * await run(safeOperation(() => fetchData(false)));
 * // Left({ type: "api_error", message: "Network error" })
 * ```
 *
 * @example Handling JSON parsing
 * ```ts
 * import { type TaskEither, tryCatch, run } from '@gimme/adt/task-either'
 *
 * type ParseError = { type: "parse_error"; input: string };
 *
 * const toParseError = (input: string) => (e: unknown): ParseError => ({
 *   type: "parse_error",
 *   input
 * });
 *
 * const parseJson = (input: string): TaskEither<ParseError, unknown> =>
 *   tryCatch(toParseError(input))(() => JSON.parse(input));
 *
 * await run(parseJson('{"valid": true}'));
 * // Right({ valid: true })
 *
 * await run(parseJson('invalid json'));
 * // Left({ type: "parse_error", input: "invalid json" })
 * ```
 */
export const tryCatch = <E>(
  onError: (e: unknown) => E,
): <A>(f: () => A | Promise<A>) => TaskEither<E, A> =>
<A>(f: () => A | Promise<A>): TaskEither<E, A> =>
async () => {
  try {
    const result = await f();
    return _right(result);
  } catch (err) {
    return _left(onError(err));
  }
};

/**
 * Lifts a function that may throw or reject into one that returns a TaskEither.
 * This is `tryCatch` for functions with arguments: the conversion of thrown
 * values is supplied once, and the resulting function can be used directly
 * with `bind`. Both synchronous and Promise-returning functions are accepted;
 * a synchronous throw and a rejection are captured the same way.
 *
 * @typeParam E The error type to convert thrown values into
 * @typeParam A The parameter types of the lifted function
 * @typeParam B The success type returned by the lifted function
 * @param onError Function to convert unknown thrown values into the error type
 * @returns A function that takes a possibly throwing function and returns a
 * function with the same parameters that produces a TaskEither
 *
 * @example Wrapping a throwing function for use with bind
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { bind, right, run, tryCatchK } from '@gimme/adt/task-either'
 *
 * type AppError = { type: "unexpected"; message: string };
 *
 * const toAppError = (e: unknown): AppError => ({
 *   type: "unexpected",
 *   message: e instanceof Error ? e.message : String(e)
 * });
 *
 * // JSON.parse throws synchronously on invalid input
 * const parseJson = (s: string): unknown => JSON.parse(s);
 *
 * // A Promise-based API that may reject
 * const fetchUser = (id: number): Promise<string> =>
 *   id > 0 ? Promise.resolve(`user-${id}`) : Promise.reject(new Error("Not found"));
 *
 * // Supply the conversion once, reuse it for any function
 * const safe = tryCatchK(toAppError);
 * const safeParse = safe(parseJson);   // (s: string) => TaskEither<AppError, unknown>
 * const safeFetch = safe(fetchUser);   // (id: number) => TaskEither<AppError, string>
 *
 * await run(pipe(right<AppError, string>('{"ok": true}'), bind(safeParse)));
 * // Right({ ok: true })
 *
 * await run(pipe(right<AppError, string>("not json"), bind(safeParse)));
 * // Left({ type: "unexpected", message: "Unexpected token 'o', ..." })
 *
 * await run(safeFetch(-1));
 * // Left({ type: "unexpected", message: "Not found" })
 * ```
 */
export const tryCatchK = <E>(
  onError: (e: unknown) => E,
): <A extends readonly unknown[], B>(
  f: (...a: A) => B | Promise<B>,
) => (...a: A) => TaskEither<E, B> =>
<A extends readonly unknown[], B>(
  f: (...a: A) => B | Promise<B>,
) =>
(...a: A): TaskEither<E, B> => tryCatch(onError)(() => f(...a));

/**
 * Lifts an Either into the TaskEither context. The resulting TaskEither resolves
 * to the given Either unchanged. This is useful for mixing synchronous
 * validations with asynchronous operations in a single chain.
 *
 * @typeParam E The error type
 * @typeParam A The success type
 * @param ma The Either to lift
 * @returns A TaskEither that resolves to the given Either
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { type Either, left, right } from '@gimme/adt/either'
 * import { type TaskEither, bind, fromEither, run } from '@gimme/adt/task-either'
 *
 * type ParseError = { type: "parse"; input: string };
 *
 * const parseNumber = (s: string): Either<ParseError, number> => {
 *   const n = Number(s);
 *   return isNaN(n) ? left<ParseError>({ type: "parse", input: s }) : right(n);
 * };
 *
 * const fetchById = (id: number): TaskEither<ParseError, string> => () =>
 *   Promise.resolve(right(`item-${id}`));
 *
 * const lookup = (s: string) => pipe(
 *   fromEither(parseNumber(s)),
 *   bind(fetchById)
 * );
 *
 * await run(lookup("7"));   // Right("item-7")
 * await run(lookup("abc")); // Left({ type: "parse", input: "abc" })
 * ```
 */
export const fromEither = <E, A>(ma: Either<E, A>): TaskEither<E, A> => () =>
  Promise.resolve(ma);

/**
 * Lifts a Task into the TaskEither context by wrapping its result in a Right.
 * Since Task represents a computation that cannot fail, the resulting TaskEither
 * never resolves to a Left. A rejection of the underlying Task is not captured;
 * use `tryCatch` for that.
 *
 * @typeParam E The error type (never produced in this case)
 * @typeParam A The success type
 * @param ma The Task to lift
 * @returns A TaskEither that resolves to a Right containing the Task's result
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { type Task } from '@gimme/adt/task'
 * import { type TaskEither, bind, fromTask, left, right, run } from '@gimme/adt/task-either'
 *
 * type ClockError = { type: "future"; time: number };
 *
 * const now: Task<number> = () => Promise.resolve(Date.now());
 *
 * const notInFuture = (time: number): TaskEither<ClockError, number> =>
 *   time <= Date.now()
 *     ? right(time)
 *     : left({ type: "future", time });
 *
 * const checked = pipe(
 *   fromTask<ClockError, number>(now),
 *   bind(notInFuture)
 * );
 *
 * await run(checked); // Right(<current timestamp>)
 * ```
 */
export const fromTask = <E, A>(ma: Task<A>): TaskEither<E, A> => () =>
  ma().then(_right);
