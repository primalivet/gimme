export function flow<A, B>(ab: (a: A) => B): (a: A) => B
export function flow<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C
export function flow<A, B, C, D>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
): (a: A) => D
export function flow<A, B, C, D, E>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): (a: A) => E
export function flow<A, B, C, D, E, F>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
): (a: A) => F
export function flow<A, B, C, D, E, F, G>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
): (a: A) => G
export function flow<A, B, C, D, E, F, G, H>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
): (a: A) => H
export function flow<A, B, C, D, E, F, G, H, I>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
): (a: A) => I
export function flow<A, B, C, D, E, F, G, H, I, J>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
): (a: A) => J
export function flow<A, B, C, D, E, F, G, H, I, J, K>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: K) => K,
): (a: A) => K
export function flow<A, B, C, D, E, F, G, H, I, J, K, L>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: J) => K,
  kl: (K: K) => L,
): (a: A) => K
export function flow<A, B, C, D, E, F, G, H, I, J, K, L>(
  ab: (a: A) => B,
  bc?: (b: B) => C,
  cd?: (c: C) => D,
  de?: (d: D) => E,
  ef?: (e: E) => F,
  fg?: (f: F) => G,
  gh?: (g: G) => H,
  hi?: (h: H) => I,
  ij?: (i: I) => J,
  jk?: (j: J) => K,
  kl?: (K: K) => L,
): (a: A) => unknown {
  return (a: A) => {
    if (ab && bc && cd && de && ef && fg && gh && hi && ij && jk && kl) {
      return kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))
    }
    if (ab && bc && cd && de && ef && fg && gh && hi && ij && jk) {
      return jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))
    }
    if (ab && bc && cd && de && ef && fg && gh && hi && ij) {
      return ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))
    }
    if (ab && bc && cd && de && ef && fg && gh && hi) {
      return hi(gh(fg(ef(de(cd(bc(ab(a))))))))
    }
    if (ab && bc && cd && de && ef && fg && gh) {
      return gh(fg(ef(de(cd(bc(ab(a)))))))
    }
    if (ab && bc && cd && de && ef && fg) {
      return fg(ef(de(cd(bc(ab(a))))))
    }
    if (ab && bc && cd && de && ef) {
      return ef(de(cd(bc(ab(a)))))
    }
    if (ab && bc && cd && de) {
      return de(cd(bc(ab(a))))
    }
    if (ab && bc && cd) {
      return cd(bc(ab(a)))
    }
    if (ab && bc) {
      return bc(ab(a))
    }
    return ab(a)
  }
}

export function pipe<A, B>(a: A, ab: (a: A) => B): B
export function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C
export function pipe<A, B, C, D>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
): D
export function pipe<A, B, C, D, E>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): E
export function pipe<A, B, C, D, E, F>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
): F
export function pipe<A, B, C, D, E, F, G>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
): G
export function pipe<A, B, C, D, E, F, G, H>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
): H
export function pipe<A, B, C, D, E, F, G, H, I>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
): I
export function pipe<A, B, C, D, E, F, G, H, I, J>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
): J
export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: K) => K,
): K
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: J) => K,
  kl: (K: K) => L,
): K
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(
  a: A,
  ab: (a: A) => B,
  bc?: (b: B) => C,
  cd?: (c: C) => D,
  de?: (d: D) => E,
  ef?: (e: E) => F,
  fg?: (f: F) => G,
  gh?: (g: G) => H,
  hi?: (h: H) => I,
  ij?: (i: I) => J,
  jk?: (j: J) => K,
  kl?: (K: K) => L,
): unknown {
  if (ab && bc && cd && de && ef && fg && gh && hi && ij && jk && kl) {
    return kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))
  }
  if (ab && bc && cd && de && ef && fg && gh && hi && ij && jk) {
    return jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))
  }
  if (ab && bc && cd && de && ef && fg && gh && hi && ij) {
    return ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))
  }
  if (ab && bc && cd && de && ef && fg && gh && hi) {
    return hi(gh(fg(ef(de(cd(bc(ab(a))))))))
  }
  if (ab && bc && cd && de && ef && fg && gh) {
    return gh(fg(ef(de(cd(bc(ab(a)))))))
  }
  if (ab && bc && cd && de && ef && fg) {
    return fg(ef(de(cd(bc(ab(a))))))
  }
  if (ab && bc && cd && de && ef) {
    return ef(de(cd(bc(ab(a)))))
  }
  if (ab && bc && cd && de) {
    return de(cd(bc(ab(a))))
  }
  if (ab && bc && cd) {
    return cd(bc(ab(a)))
  }
  if (ab && bc) {
    return bc(ab(a))
  }

  return ab(a)
}

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

export const compose8 =
  <A, B, C, D, E, F, G, H, I>(
    hi: (h: H) => I,
    gh: (g: G) => H,
    fg: (f: F) => G,
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B,
  ) =>
  (a: A): I =>
    hi(gh(fg(ef(de(cd(bc(ab(a))))))))

export const compose9 =
  <A, B, C, D, E, F, G, H, I, J>(
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
  (a: A): J =>
    ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))

export const compose10 =
  <A, B, C, D, E, F, G, H, I, J, K>(
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
  (a: A): K =>
    jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))

export const compose11 =
  <A, B, C, D, E, F, G, H, I, J, K, L>(
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
  (a: A): L =>
    kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))
