export const compose =
  <A, B, C>(bc: (b: B) => C, ab: (a: A) => B) =>
  (a: A): C =>
    bc(ab(a))

export const compose3 =
  <A, B, C, D>(cd: (c: C) => D, bc: (b: B) => C, ab: (a: A) => B) =>
  (a: A): D =>
    cd(bc(ab(a)))

export const compose4 =
  <A, B, C, D, E>(
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B,
  ) =>
  (a: A): E =>
    de(cd(bc(ab(a))))

export const compose5 =
  <A, B, C, D, E, F>(
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B,
  ) =>
  (a: A): F =>
    ef(de(cd(bc(ab(a)))))

export const compose6 =
  <A, B, C, D, E, F, G>(
    fg: (f: F) => G,
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B,
  ) =>
  (a: A): G =>
    fg(ef(de(cd(bc(ab(a))))))

export const compose7 =
  <A, B, C, D, E, F, G, H>(
    gh: (g: G) => H,
    fg: (f: F) => G,
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B,
  ) =>
  (a: A): H =>
    gh(fg(ef(de(cd(bc(ab(a)))))))
