export const compose =
  <A, B, C>(bc: (b: B) => C, ab: (a: A) => B) => (a: A): C => bc(ab(a));

export const compose3 =
  <A, B, C, D>(cd: (c: C) => D, bc: (b: B) => C, ab: (a: A) => B) =>
  (a: A): D => cd(bc(ab(a)));

export const compose4 = <A, B, C, D, E>(
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
) =>
(a: A): E => de(cd(bc(ab(a))));

export const compose5 = <A, B, C, D, E, F>(
  ef: (e: E) => F,
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
) =>
(a: A): F => ef(de(cd(bc(ab(a)))));

export const compose6 = <A, B, C, D, E, F, G>(
  fg: (f: F) => G,
  ef: (e: E) => F,
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
) =>
(a: A): G => fg(ef(de(cd(bc(ab(a))))));

export const compose7 = <A, B, C, D, E, F, G, H>(
  gh: (g: G) => H,
  fg: (f: F) => G,
  ef: (e: E) => F,
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
) =>
(a: A): H => gh(fg(ef(de(cd(bc(ab(a)))))));

export const compose8 = <A, B, C, D, E, F, G, H, I>(
  hi: (h: H) => I,
  gh: (g: G) => H,
  fg: (f: F) => G,
  ef: (e: E) => F,
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
) =>
(a: A): I => hi(gh(fg(ef(de(cd(bc(ab(a))))))));

export const compose9 = <A, B, C, D, E, F, G, H, I, J>(
  ij: (i: I) => J,
  hi: (g: H) => I,
  gh: (g: G) => H,
  fg: (f: F) => G,
  ef: (e: E) => F,
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
) =>
(a: A): J => ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))));

export const compose10 = <A, B, C, D, E, F, G, H, I, J, K>(
  jk: (j: J) => K,
  ij: (i: I) => J,
  hi: (g: H) => I,
  gh: (g: G) => H,
  fg: (f: F) => G,
  ef: (e: E) => F,
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
) =>
(a: A): K => jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))));

export const compose11 = <A, B, C, D, E, F, G, H, I, J, K, L>(
  kl: (k: K) => L,
  jk: (j: J) => K,
  ij: (i: I) => J,
  hi: (g: H) => I,
  gh: (g: G) => H,
  fg: (f: F) => G,
  ef: (e: E) => F,
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
) =>
(a: A): L => kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))));
