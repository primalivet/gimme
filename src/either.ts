export type Either<A, B> = Left<A> | Right<B>

type Left<A> = { _tag: 'Left'; value: A }

type Right<A> = { _tag: 'Right'; value: A }

export const left = <A>(a: A): Left<A> => ({ _tag: 'Left', value: a })

export const right = <A>(a: A): Right<A> => ({ _tag: 'Right', value: a })
export const of = right

export const isLeft = <A, B>(ma: Either<A, B>): boolean => ma._tag === 'Left'

export const isRight = <A, B>(ma: Either<A, B>): boolean => ma._tag === 'Right'

export const map =
  <A, B, C>(f: (b: B) => C) =>
  (ma: Either<A, B>): Either<A, C> =>
    ma._tag === 'Right' ? right(f(ma.value)) : ma

export const chain =
  <A, B, C>(f: (b: B) => Either<A, C>) =>
  (ma: Either<A, B>): Either<A, C> =>
    ma._tag === 'Right' ? f(ma.value) : ma

export const ap =
  <E, A>(fa: Either<E, A>) =>
  <B>(fab: Either<E, (a: A) => B>) =>
    fab._tag === 'Left'
      ? fab
      : fa._tag === 'Left'
      ? fa
      : right(fab.value(fa.value))

export const match =
  <A, B, C>(onLeft: (a: A) => C, onRight: (b: B) => C) =>
  (ma: Either<A, B>): C =>
    ma._tag === 'Left' ? onLeft(ma.value) : onRight(ma.value)

export const fromNullable =
  <A, B>(onNullable: (b: B) => A) =>
  (b: B) =>
    b === null || b === undefined ? left(onNullable(b)) : right(b)

export const fromPredicate =
  <A, B>(predicate: (b: B) => boolean) =>
  (onUnsatisfied: (b: B) => A) =>
  (b: B): Either<A, B> =>
    predicate(b) ? right(b) : left(onUnsatisfied(b))

export const tryCatch = <A, B>(
  f: () => B,
  onError: (e: unknown) => A,
): Either<A, B> => {
  try {
    return right(f())
  } catch (e) {
    return left(onError(e))
  }
}

export const show = <A, B>(e: Either<A, B>): string =>
  e._tag === 'Left'
    ? `Left(${JSON.stringify(e.value, null, 2)})`
    : `Right(${JSON.stringify(e.value, null, 2)})`
