export type Task<A> = () => Promise<A>;

export const pure = <A>(a: A): Task<A> => () => Promise.resolve(a);

export const fmap = <A, B>(f: (a: A) => B) => (fa: Task<A>): Task<B> => () =>
  fa().then(f);

export const bind =
  <A, B>(f: (a: A) => Task<B>) => (fa: Task<A>): Task<B> => () =>
    fa().then((a) => f(a)());

export const apply =
  <A, B>(fa: Task<A>) => (fab: Task<(a: A) => B>): Task<B> => () =>
    fa().then((a) => fab().then((f) => f(a)));

export const delay = <A>(ms: number) => (a: A): Task<A> => () =>
  new Promise((resolve) => setTimeout(() => resolve(a), ms));

export const show = <T>(io: Task<T>): string =>
  `Task(${JSON.stringify(io, null, 2)})`;
