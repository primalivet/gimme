/**
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
