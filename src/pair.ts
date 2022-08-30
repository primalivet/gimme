type Pair<A, B> = [A, B]

export const pair = <A, B>(a: A, b: B): Pair<A, B> => [a, b]

export const mapFst =
  <A, B, C>(f: (a: A) => C) =>
  ([fst, snd]: Pair<A, B>): Pair<C, B> =>
    [f(fst), snd]

export const mapSnd =
  <A, B, C>(f: (a: B) => C) =>
  ([fst, snd]: Pair<A, B>): Pair<A, C> =>
    [fst, f(snd)]

export const bimap =
  <A, B, C, D>(f: (a: A) => C, g: (b: B) => D) =>
  ([fst, snd]: Pair<A, B>): Pair<C, D> =>
    [f(fst), g(snd)]

export const swap = <A, B>([fst, snd]: Pair<A, B>): Pair<B, A> => [snd, fst]
