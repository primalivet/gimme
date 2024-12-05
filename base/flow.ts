export function flow<A, B>(ab: (a: A) => B): (a: A) => B;
export function flow<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C;
export function flow<A, B, C, D>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
): (a: A) => D;
export function flow<A, B, C, D, E>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): (a: A) => E;
export function flow<A, B, C, D, E, F>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
): (a: A) => F;
export function flow<A, B, C, D, E, F, G>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
): (a: A) => G;
export function flow<A, B, C, D, E, F, G, H>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
): (a: A) => H;
export function flow<A, B, C, D, E, F, G, H, I>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
): (a: A) => I;
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
): (a: A) => J;
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
): (a: A) => K;
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
): (a: A) => K;
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
      return kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))));
    }
    if (ab && bc && cd && de && ef && fg && gh && hi && ij && jk) {
      return jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))));
    }
    if (ab && bc && cd && de && ef && fg && gh && hi && ij) {
      return ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))));
    }
    if (ab && bc && cd && de && ef && fg && gh && hi) {
      return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
    }
    if (ab && bc && cd && de && ef && fg && gh) {
      return gh(fg(ef(de(cd(bc(ab(a)))))));
    }
    if (ab && bc && cd && de && ef && fg) {
      return fg(ef(de(cd(bc(ab(a))))));
    }
    if (ab && bc && cd && de && ef) {
      return ef(de(cd(bc(ab(a)))));
    }
    if (ab && bc && cd && de) {
      return de(cd(bc(ab(a))));
    }
    if (ab && bc && cd) {
      return cd(bc(ab(a)));
    }
    if (ab && bc) {
      return bc(ab(a));
    }
    return ab(a);
  };
}
