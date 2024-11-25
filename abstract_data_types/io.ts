export type Trunk<T> = () => T;

export type IO<T> = Trunk<T>;

export const pure = <A>(a: A): IO<A> => () => a;

export const fmap = <A, B>(f: (a: A) => B) => (ma: IO<A>): IO<B> =>
  pure(f(ma()));

export const bind = <A, B>(f: (a: A) => IO<B>) => (ma: IO<A>): IO<B> => f(ma());

export const apply = <A, B>(fa: IO<A>) => (fab: IO<(a: A) => B>): IO<B> =>
  pure(fab()(fa()));

export const show = <T>(io: IO<T>): string =>
  `IO(${JSON.stringify(io, null, 2)})`;
