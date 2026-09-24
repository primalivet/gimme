/**
 * Algebraic data types for functional programming in TypeScript: `Either`,
 * `Maybe`, `Task`, `TaskEither` and `Tuple`. Each type is a plain value or a
 * lazy function, with a small set of curried operations designed for use with
 * `pipe` and `flow` from `@gimme/base`. Errors are values, effects are lazy,
 * and every operation is data-last so it composes.
 *
 * @example Modeling a fallible, asynchronous lookup
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { Either, TaskEither } from '@gimme/adt'
 *
 * type NotFound = { type: "not_found"; id: number };
 *
 * const findUser = (id: number): TaskEither.TaskEither<NotFound, string> =>
 *   id === 1 ? TaskEither.right("Alice") : TaskEither.left({ type: "not_found", id });
 *
 * const greet = (id: number) => pipe(
 *   findUser(id),
 *   TaskEither.map((name) => `Hello, ${name}`),
 *   TaskEither.mapLeft((e) => `No user with id ${e.id}`),
 * );
 *
 * Either.show(await TaskEither.run(greet(1))); // Right("Hello, Alice")
 * Either.show(await TaskEither.run(greet(2))); // Left("No user with id 2")
 * ```
 *
 * @module
 */
/** A value that is one of two variants, Left or Right, commonly used for fallible computations. */
export * as Either from "@gimme/adt/either";
/** An optional value, Just or Nothing. */
export * as Maybe from "@gimme/adt/maybe";
/** A lazy asynchronous computation that always succeeds. */
export * as Task from "@gimme/adt/task";
/** An immutable pair of values. */
export * as Tuple from "@gimme/adt/tuple";
/** A lazy asynchronous computation that may fail with a typed error. */
export * as TaskEither from "@gimme/adt/task-either";
