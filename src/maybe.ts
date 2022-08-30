export type Maybe<A> = Just<A> | Nothing

type Just<A> = { _tag: 'Just'; value: A }

type Nothing = { _tag: 'Nothing' }

export const just = <A>(a: A): Just<A> => ({ _tag: 'Just', value: a })
export const of = just

export const nothing = (): Nothing => ({ _tag: 'Nothing' })

export const isJust = <A>(ma: Maybe<A>): boolean => ma._tag === 'Just'

export const isNothing = <A>(ma: Maybe<A>): boolean => ma._tag === 'Nothing'

export const map =
  <A, B>(f: (a: A) => B) =>
  (ma: Maybe<A>): Maybe<B> =>
    ma._tag === 'Just' ? just(f(ma.value)) : nothing()

export const chain =
  <A, B>(f: (a: A) => Maybe<B>) =>
  (ma: Maybe<A>): Maybe<B> =>
    ma._tag === 'Just' ? f(ma.value) : nothing()

export const ap =
  <A, B>(mf: Just<(a: A) => B>) =>
  (ma: Maybe<A>): Maybe<B> =>
    ma._tag === 'Just' ? just(mf.value(ma.value)) : nothing()

export const orElse =
  <A>(onNothing: () => A) =>
  (ma: Maybe<A>): A =>
    ma._tag === 'Just' ? ma.value : onNothing()

export const fromNullable = <A>(a: A) =>
  a === null || a === undefined ? nothing() : just(a)

export const fromPredicate =
  <A>(predicate: (a: A) => boolean) =>
  (a: A) =>
    predicate(a) ? just(a) : nothing()

export const show = <A>(e: Maybe<A>): string =>
  e._tag === 'Nothing'
    ? `Nothing()`
    : `Just(${JSON.stringify(e.value, null, 2)})`
