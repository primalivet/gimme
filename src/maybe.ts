/*
 * Maybe is a union type of Just or Nothing. This means that an maybe can hold
 * a value or nothing while still beeing one type. It's main strenght is to
 * handle null and undefined values.
 */
export type Maybe<A> = Just<A> | Nothing

/*
* A Nothing type is one of two parts in the Maybe union type. 
* It holds the absens of a value, Nothing()
*/
type Nothing = { _tag: 'Nothing' }

/*
* A Just type is one of two parts in the Maybe union type. 
* It holds the value, Just(something)
*/
type Just<A> = { _tag: 'Just'; value: A }

/*
* Constructor for a Nothing value.
*/
export const nothing = (): Nothing => ({ _tag: 'Nothing' })

/*
* Constructor for a Just value.
*/
export const just = <A>(a: A): Just<A> => ({ _tag: 'Just', value: a })

/*
 * Constructor of the Maybe identity value, which is a Just. An identity type
 * can be described as a value that wont change the result while being combined
 * with another value of the same type.
 *
 * For example
 * 2 + 0 = 2 (in addition, 0 is the identity value)
 * 2 * 1 = 2 (in multiplication, 1 is the identity value)
 *
 * For an maybe, just is the identity value as a Nothing combined with an Just
 * will result in a Nothing, no mather how it's combined. While a Just combined
 * width a Nothing will change the Just into a Nothing.
 */
export const pure = just

/*
* Predicate for checking if the Maybe is a Nothing
*/
export const isNothing = <A>(ma: Maybe<A>): boolean => ma._tag === 'Nothing'

/*
* Predicate for checking if the Maybe is a Just
*/
export const isJust = <A>(ma: Maybe<A>): boolean => ma._tag === 'Just'

/*
 * The fmap operation of an Maybe.
 * On a Just value, map will apply it's value to the given function.
 * On a Nothing value, map will ignore the function and keep it's Nothing value.
 */
export const fmap =
  <A, B>(f: (a: A) => B) =>
  (ma: Maybe<A>): Maybe<B> =>
    ma._tag === 'Just' ? just(f(ma.value)) : nothing()

/*
 * The bind operation of an Maybe.
 * On a Just value, bind will apply it's value to the given function, and
 * flatten the result as the function has to return another Maybe.
 * On a Nothing value, bind will ignore the function and keep it's Nothing value.
 */
export const bind =
  <A, B>(f: (a: A) => Maybe<B>) =>
  (ma: Maybe<A>): Maybe<B> =>
    ma._tag === 'Just' ? f(ma.value) : nothing()

/*
 * The apply operation is mush the reverse fmap operation.
 * The Just value holds a argument if you will that will be applied to the
 * given context holding a function
 * Short circuted on any Nothing value
 */
export const apply =
  <A, B>(fa: Just<A>) =>
  (fab: Maybe<(a: A) => B>): Maybe<A | B> =>
    fab._tag === 'Nothing' ? fab : just(fab.value(fa.value))

/*
 * Constuct a Maybe from a possible null value
 * Nothing on null or undefined and otherwise Just
 */
export const fromNullable = <A>(a: A) =>
  a === null || a === undefined ? nothing() : just(a)

/*
 * Constuct a Maybe from a Predicate
 * When the predicate is true, wrap the value in a Just otherwise Nothing
 */
export const fromPredicate =
<A>(predicate: (a: A) => boolean) =>
  (a: A) =>
    predicate(a) ? just(a) : nothing()

/*
 * Extract the value from an Maybe by giving it two functions, one if it's a
 * Nothing value and one if it's a Just value
 */
export const fold =
  <A, B>(onNothing: () => B, onJust: (a: A) => B) =>
  (ma: Maybe<A>): B =>
    ma._tag === 'Just' ? onJust(ma.value) : onNothing()

export const show = <A>(e: Maybe<A>): string =>
  e._tag === 'Nothing' ? `Nothing` : `Just(${JSON.stringify(e.value, null, 2)})`
