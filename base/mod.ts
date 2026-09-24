/**
 * Function composition utilities: `pipe`, `flow` and `compose`. They are the
 * glue for the data-last, curried operations in `@gimme/adt`, and work with any
 * unary functions. All three are typed for up to eleven steps.
 *
 * @example Building a small pipeline
 * ```ts
 * import { pipe, flow } from '@gimme/base'
 *
 * const trim = (s: string) => s.trim();
 * const words = (s: string) => s.split(" ");
 * const count = (xs: string[]) => xs.length;
 *
 * // Apply a value through a series of functions
 * pipe("  hello wide world  ", trim, words, count); // 3
 *
 * // Or build the function first and apply it later
 * const wordCount = flow(trim, words, count);
 * wordCount("one two"); // 2
 * ```
 *
 * @module
 */

export * from "@gimme/base/compose";
export * from "@gimme/base/flow";
export * from "@gimme/base/pipe";
