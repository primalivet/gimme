/*
 * Either is a union type of Left or Right. This means that an either can hold
 * two different semantic values while still beeing one type. By convention,
 * Left is generally used for a failure or error. It's main strenght is to
 * handle errors.
 */
export type Either<A, B> = Left<A> | Right<B>

/*
 * A Left type is one of two parts in the Either union type. It generally holds
 * a reason for failure, error or alike.
 */
export type Left<A> = { _tag: 'Left'; value: A }

/*
 * A Right type is one of two parts in the Either union type. It generally holds
 * a value from a successfull computation.
 */
export type Right<A> = { _tag: 'Right'; value: A }

/*
 * Constructor for a Left value.
 */
export const left = <A>(a: A): Left<A> => ({ _tag: 'Left', value: a })

/*
 * Constructor for a Right value.
 */
export const right = <A>(a: A): Right<A> => ({ _tag: 'Right', value: a })

/*
 * Constructor of the Either identity value, which is a Right. An identity type
 * can be described as a value that wont change the result while being combined
 * with another value of the same type.
 *
 * For example
 * 2 + 0 = 2 (in addition, 0 is the identity value)
 * 2 * 1 = 2 (in multiplication, 1 is the identity value)
 *
 * For an either, right is the identity value as a Left combined with an Right
 * will result in a Left, no mather how it's combined. While a Right combined
 * width a Left will change the Right into a Left.
 */
export const pure = right

/*
 * Predicate for checking if the Either is a Left
 */
export const isLeft = <A, B>(ma: Either<A, B>): boolean => ma._tag === 'Left'

/*
 * Predicate for checking if the Either is a Right
 */
export const isRight = <A, B>(ma: Either<A, B>): boolean => ma._tag === 'Right'

/*
 * The fmap operation of an Either.
 * On a Right value, map will apply it's value to the given function.
 * On a Left value, map will ignore the function and keep it's Left value.
 */
export const fmap =
  <A, B, C>(f: (b: B) => C) =>
  (ma: Either<A, B>): Either<A, C> =>
    ma._tag === 'Right' ? right(f(ma.value)) : ma

/*
 * The bind operation of an Either.
 * On a Right value, bind will apply it's value to the given function, and
 * flatten the result as the function has to return another Either.
 * On a Left value, bind will ignore the function and keep it's Left value.
 */
export const bind =
  <A, B, C>(f: (b: B) => Either<A, C>) =>
  (ma: Either<A, B>): Either<A, C> =>
    ma._tag === 'Right' ? f(ma.value) : ma

/*
 * The apply operation is mush the reverse fmap operation.
 * The Right value holds a argument if you will that will be applied to the
 * given context holding a function
 * Short circuted on any Left value
 */
export const apply =
  <E, A>(fa: Right<A>) =>
  <F, B>(fab: Either<F, (a: A) => B>): Either<E | F, A | B> =>
    fab._tag === 'Left'
      ? fab
      : right(fab.value(fa.value))

/*
 * Constuct a Either from a possible null value
 * Left on null or undefined and otherwise Right
 */
export const fromNullable =
  <A, B>(onNullable: (b: B) => A) =>
  (b: B) =>
    b === null || b === undefined ? left(onNullable(b)) : right(b)

/*
 * Constuct a Either from a Predicate
 * When the predicate is true, wrap the value in a Right otherwise Left
 */
export const fromPredicate =
  <A, B>(predicate: (b: B) => boolean) =>
  (onUnsatisfied: (b: B) => A) =>
  (b: B): Either<A, B> =>
    predicate(b) ? right(b) : left(onUnsatisfied(b))

/*
 * Construct a Either from a thunk that might throw If it throws we get a Left
 * with the reason, otherwise a Right with the value
 */
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

/*
 * Extract the value from an Either by giving it two functions, one if it's a
 * Left value and one if it's a Right value
 */
export const fold =
  <A, B, C>(onLeft: (a: A) => C, onRight: (b: B) => C) =>
  (ma: Either<A, B>): C =>
    ma._tag === 'Left' ? onLeft(ma.value) : onRight(ma.value)

/*
 * Turn your Either into a string to print or inspect the value
 */
export const show = <A, B>(e: Either<A, B>): string =>
  e._tag === 'Left'
    ? `Left(${JSON.stringify(e.value, null, 2)})`
    : `Right(${JSON.stringify(e.value, null, 2)})`
