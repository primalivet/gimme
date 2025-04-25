import type { Task } from "./task.ts";
import {
  type Either,
  left as _left,
  map as _map,
  mapLeft as _mapLeft,
  right as _right,
} from "./either.ts";

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
 * @typeParam E The type of the error that may occur
 * @typeParam A The type of the value that will be produced on success
 *
 * @example Basic validation example
 * ```ts
 * import { type TaskEither, left, right, run } from '@gimme/adt/unstable-task-either';
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
 * import { type TaskEither, left, right, bind } from '@gimme/adt/unstable-task-either'
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
 * import { left, run } from '@gimme/adt/unstable-task-either'
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
 * import { type TaskEither, left, right, run } from '@gimme/adt/unstable-task-either'
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
export const left = <E, A>(e: E): TaskEither<E, A> => () =>
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
 * import { right, run } from '@gimme/adt/unstable-task-either'
 * 
 * const succeed = right<Error, number>(42);
 * 
 * await run(succeed); // Right(42)
 * ```
 *
 * @example Combining with computation
 * ```ts
 * import { type TaskEither, left, right, run } from '@gimme/adt/unstable-task-either'
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
export const right = <E, A>(a: A): TaskEither<E, A> => () =>
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
 * import { type TaskEither, right, left, map, run } from '@gimme/adt/unstable-task-either'
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
 * import { type TaskEither, right, left, map, run } from '@gimme/adt/unstable-task-either'
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
  <E, A, B>(f: (a: A) => B) => (ma: TaskEither<E, A>): TaskEither<E, B> => () =>
    ma().then(_map(f));

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
 * import { type TaskEither, right, left, mapLeft, run } from '@gimme/adt/unstable-task-either'
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
 * import { type TaskEither, right, left, mapLeft, run } from '@gimme/adt/unstable-task-either'
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
  <E, U, A>(f: (e: E) => U) => (ma: TaskEither<E, A>): TaskEither<U, A> => () =>
    ma().then(_mapLeft(f));

/**
 * Creates a function that chains TaskEither computations together. When given a
 * function that produces a TaskEither and an existing TaskEither value, it applies
 * the function only if the first operation succeeds. If any operation in the chain
 * fails, that error is propagated and subsequent operations are skipped.
 *
 * @typeParam E The error type shared across operations
 * @typeParam A The input success type
 * @typeParam B The output success type
 * @param f A function that takes a success value and returns a new TaskEither
 * @returns A function that chains the TaskEither computation with f
 *
 * @example Basic chaining of async validations
 * ```ts
 * import { flow } from '@gimme/base'
 * import { type TaskEither, right, left, bind, run } from '@gimme/adt/unstable-task-either'
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
 * import { type TaskEither, right, left, bind, run } from '@gimme/adt/unstable-task-either'
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
 */
export const bind =
  <E, A, B>(f: (a: A) => TaskEither<E, B>) =>
  (ma: TaskEither<E, A>): TaskEither<E, B> =>
  () => ma().then((e) => e._tag === "Right" ? f(e.value)() : e);

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
 * import { type TaskEither, right, left, run } from '@gimme/adt/unstable-task-either'
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
 * import { type TaskEither, right, left, run } from '@gimme/adt/unstable-task-either'
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
 * import { type TaskEither, right, left, fold, run } from '@gimme/adt/unstable-task-either'
 * import { type Task, pure } from '@gimme/adt/task'
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
 * import { type TaskEither, right, left, fold } from '@gimme/adt/unstable-task-either'
 * import { type Task, pure } from '@gimme/adt/task'
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
export const fold =
  <E, A, B>(onLeft: (a: E) => Task<B>, onRight: (e: A) => Task<B>) =>
  (ma: TaskEither<E, A>): Task<B> =>
  () =>
    ma().then((either) => {
      const task = either._tag === "Left"
        ? onLeft(either.value)
        : onRight(either.value);
      return task();
    });

/**
 * Creates a function that safely converts a Promise-returning function into a
 * TaskEither, capturing any errors that occur during the Promise execution.
 * This is useful when working with existing Promise-based APIs or async
 * operations that might throw.
 *
 * @typeParam E The error type to convert thrown errors into
 * @typeParam A The success type from the Promise
 * @param onError Function to convert unknown errors into the expected error type
 * @returns A function that takes a Promise-returning function and returns a TaskEither
 *
 * @example Converting Promise-based API calls
 * ```ts
 * import { type TaskEither, tryCatch, run } from '@gimme/adt/unstable-task-either'
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
 * import { type TaskEither, tryCatch, run } from '@gimme/adt/unstable-task-either'
 * 
 * type ParseError = { type: "parse_error"; input: string };
 * 
 * const toParseError = (input: string) => (e: unknown): ParseError => ({
 *   type: "parse_error",
 *   input
 * });
 * 
 * const parseJson = (input: string): TaskEither<ParseError, unknown> =>
 *   tryCatch(toParseError(input))(
 *     () => Promise.resolve(JSON.parse(input))
 *   );
 * 
 * await run(parseJson('{"valid": true}')); 
 * // Right({ valid: true })
 * 
 * await run(parseJson('invalid json')); 
 * // Left({ type: "parse_error", input: "invalid json" })
 * ```
 */
export const tryCatch =
  <E>(onError: (e: unknown) => E) =>
  <A>(f: () => Promise<A>): TaskEither<E, A> =>
  () => f().then(_right).catch((e) => _left(onError(e)));

export const fromEither = <E, A>(ma: Either<E, A>): TaskEither<E, A> => () =>
  Promise.resolve(ma);

export const fromTask = <E, A>(ma: Task<A>): TaskEither<E, A> => () =>
  ma().then(_right);
