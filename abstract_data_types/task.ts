/**
 * Task represents an asynchronous computation that will produce a value of type A
 * when executed. Unlike Promise, Task is lazy - it only executes when explicitly
 * run by calling it as a function. Task specifically handles successful async
 * operations only.
 * 
 * For async operations that might fail, use TaskEither instead which can handle
 * both success and failure cases.
 *
 * @template A The type of the value that will be produced by the Task
 *
 * @example
 * ```ts
 * // Define a Task that will get the current timestamp
 * const getTime: Task<number> = () => Promise.resolve(Date.now());
 * 
 * // Task is lazy - nothing happens until we execute it
 * const task = getTime;
 * 
 * // Execute the Task to get the value
 * const time = await task();
 * ```
 */
export type Task<A> = () => Promise<A>;

/**
 * Creates a Task that immediately resolves with the given value. This is the
 * "pure" operation for the Task type, lifting a plain value into the Task context.
 *
 * @template A The type of the value to wrap in a Task
 * @param a The value to wrap in a Task
 * @returns A Task that resolves to the provided value
 *
 * @example
 * ```ts
 * const task = pure(42);
 * const value = await task(); // 42
 * 
 * // Task is lazy - creating it doesn't execute it
 * const delayedTask = pure("hello");  // No execution yet
 * const message = await delayedTask(); // Now it executes
 * ```
 */
export const pure = <A>(a: A): Task<A> => () => Promise.resolve(a);

/**
 * Creates a function that transforms the value produced by a Task using the
 * provided function. The transformation is only applied when the Task is executed.
 *
 * @template A The type of the input value
 * @template B The type of the output value
 * @param f The function to apply to the Task's result
 * @returns A function that takes a Task and returns a new Task with the transformed value
 *
 * @example
 * ```ts
 * const numberTask = pure(21);
 * const doubled = map((n: number) => n * 2)(numberTask);
 * const result = await doubled(); // 42
 * 
 * // Transforming timestamps
 * const getTime: Task<number> = () => Promise.resolve(Date.now());
 * const getDate = map((time: number) => new Date(time))(getTime);
 * ```
 */
export const map = <A, B>(f: (a: A) => B) => (fa: Task<A>): Task<B> => () =>
  fa().then(f);

/**
 * Creates a function that chains Task computations together. When given a
 * function that produces a Task and an existing Task, it runs the first Task
 * and then uses its result to create and run the next Task.
 *
 * @template A The input value type
 * @template B The output value type
 * @param f A function that takes a value and returns a new Task
 * @returns A function that chains the Task computation with f
 *
 * @example
 * ```ts
 * const getCurrentHour = pure(new Date().getHours());
 * const getGreeting = (hour: number): Task<string> =>
 *   hour < 12 ? pure("Good morning") : pure("Good afternoon");
 * 
 * // Chain the tasks together
 * const greeting = pipe(
 *   getCurrentHour,
 *   bind(getGreeting)
 * );
 * ```
 */
export const bind =
  <A, B>(f: (a: A) => Task<B>) => (ma: Task<A>): Task<B> => () =>
    ma().then((a) => f(a)());


/**
 * Flattens a nested Task into a single Task. This function is useful when you
 * have a value of type Task<Task<A>> and want to get Task<A>. Since Task
 * represents successful async operations, both inner and outer Tasks are 
 * guaranteed to complete successfully.
 *
 * @template A The value type
 * @param mma The nested Task to flatten
 * @returns A flattened Task
 *
 * @example
 * ```ts
 * // A Task that produces another Task
 * const outerTask: Task<Task<number>> = pure(pure(42));
 * const flattened = join(outerTask);
 * const value = await flattened(); // 42
 * 
 * // Useful when working with time-based operations
 * const getDelayedTime = (ms: number): Task<Task<number>> => 
 *   pure(delay(ms)(Date.now()));
 *   
 * const time = join(getDelayedTime(1000)); // Task<number>
 * ```
 */
export const join = <A>(mma: Task<Task<A>>): Task<A> => () =>
  mma().then(inner => inner());

/**
 * Creates a function that applies a wrapped function from one Task to a value in
 * another Task. This enables applying functions between Task contexts when you
 * have both a function and value wrapped in separate Tasks.
 *
 * @template A The type of the input value
 * @template B The type of the output value
 * @param fab The Task containing the function to apply
 * @returns A function that takes a Task value and returns a new Task
 *
 * @example
 * ```ts
 * const add = (x: number) => (y: number) => x + y;
 * 
 * const wrappedFn = pure(add(2));  // Task<(y: number) => number>
 * const wrappedVal = pure(3);      // Task<number>
 * 
 * const result = pipe(
 *   wrappedVal,
 *   apply(wrappedFn)    // Task<number> that resolves to 5
 * );
 * ```
 */
export const apply =
  <A, B>(mab: Task<(a: A) => B>) => (ma: Task<A>): Task<B> => () =>
    ma().then((a) => mab().then((f) => f(a)));

/**
 * Creates a Task that resolves to the provided value after the specified delay.
 * This is useful for adding deliberate delays between operations or implementing
 * polling mechanisms.
 *
 * @template A The type of the value to delay
 * @param ms The delay duration in milliseconds
 * @returns A function that takes a value and returns a Task that resolves to that value after the delay
 *
 * @example
 * ```ts
 * const delayedGreeting = pipe(
 *   pure("Hello"),
 *   bind(delay(1000))  // Resolves to "Hello" after 1 second
 * );
 * 
 * // Implementing a polling mechanism
 * const poll = (interval: number): Task<number> => pipe(
 *   pure(Date.now()),
 *   bind(delay(interval))
 * );
 * ```
 */
export const delay = <A>(ms: number) => (a: A): Task<A> => () =>
  new Promise((resolve) => setTimeout(() => resolve(a), ms));

/**
 * Converts a Task to a readable string representation, using pretty-printed
 * JSON for the Task value.
 *
 * @template T The type of the value contained in the Task
 * @param ma The Task to convert to string
 * @returns A formatted string representation of the Task
 *
 * @example
 * ```ts
 * const task = pure({ count: 42, valid: true });
 * show(task);
 * // Task({
 * //   "count": 42,
 * //   "valid": true
 * // })
 * ```
 */
export const show = <T>(ma: Task<T>): string =>
  `Task(${JSON.stringify(ma, null, 2)})`;
