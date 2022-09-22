import * as E from './either'
import * as T from './task'

export type TaskEither<E, A> = T.Task<E.Either<E, A>>

export const pure = <E, A>(a: A): TaskEither<E, A> => T.pure(E.pure(a))

export const left = <E, A>(a: E): TaskEither<E, A> => T.pure(E.left(a))

export const right = <E, A>(a: A): TaskEither<E, A> => T.pure(E.pure(a))

export const fmap =
  <E, A, B>(f: (a: A) => B) =>
  (fa: TaskEither<E, A>): TaskEither<E, B> =>
    T.fmap(E.fmap<E, A, B>(f))(fa)
