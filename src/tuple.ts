type Tuple<A, B> = Readonly<[A, B]>

export const pure = <A, B>(fst: A, snd: B): Tuple<A, B> => [fst, snd]

export const mapFst =
  <A, B, C>(f: (a: A) => C) =>
  ([fst, snd]: Tuple<A, B>): Tuple<C, B> =>
    [f(fst), snd]

export const mapSnd =
  <A, B, C>(f: (a: B) => C) =>
  ([fst, snd]: Tuple<A, B>): Tuple<A, C> =>
    [fst, f(snd)]

export const bimap =
  <A, B, C, D>(f: (a: A) => C, g: (b: B) => D) =>
  ([fst, snd]: Tuple<A, B>): Tuple<C, D> =>
    [f(fst), g(snd)]

export const swap = <A, B>([fst, snd]: Tuple<A, B>): Tuple<B, A> => [snd, fst]

export const fst = <A, B>([fst]: Tuple<A, B>): A => fst

export const snd = <A, B>([, snd]: Tuple<A, B>): B => snd

export const uncurry =
  <A, B, C>(fn: (a: A) => (b: B) => C) =>
  ([fst,snd]: Tuple<A,B>): C =>
    fn(fst)(snd)
