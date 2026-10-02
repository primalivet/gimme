/**
 * A lazy asynchronous computation that reads from an environment and may fail
 * with a typed error. Combines `Reader` with {@linkcode TaskEither}.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted. Breaking changes may
 * land in any release.
 *
 * @module
 */
import { pipe } from "@gimme/base/pipe";
import type { Either } from "@gimme/adt/either";
import {
  bind as _bind,
  map as _map,
  right as _right,
  run as _run,
  type TaskEither,
} from "@gimme/adt/task-either";

export type ReaderTaskEither<E, A, R> = (env: R) => TaskEither<E, A>;

export const map =
  <A, B>(f: (a: A) => B) =>
  <E, R>(rte: ReaderTaskEither<E, A, R>): ReaderTaskEither<E, B, R> =>
  (env): TaskEither<E, B> => pipe(rte(env), _map(f));

export const bind =
  <E1, A, B, R1>(f: (a: A) => ReaderTaskEither<E1, B, R1>) =>
  <E2, R2>(
    rte: ReaderTaskEither<E2, A, R2>,
  ): ReaderTaskEither<E1 | E2, B, R1 & R2> =>
  (env): TaskEither<E1 | E2, B> => pipe(rte(env), _bind((x) => f(x)(env)));

export const asks = <A, R>(f: (env: R) => A): ReaderTaskEither<never, A, R> =>
(
  env: R,
): TaskEither<never, A> => {
  return _right(f(env));
};

export const ask = <R>(): ReaderTaskEither<never, R, R> =>
(
  env: R,
): TaskEither<never, R> => {
  return _right(env);
};

export const fromTaskEither =
  <E, A, R>(ma: TaskEither<E, A>): ReaderTaskEither<E, A, R> => (_: R) => ma;

export const run = <E, A, R>(
  rte: ReaderTaskEither<E, A, R>,
) =>
(r: R): Promise<Either<E, A>> => pipe(r, rte, _run);
