/**
 * A lens is a reference to one part of a larger value: a getter that reads
 * the part and a setter that returns a copy of the whole with the part
 * replaced.
 *
 * Lenses compose, so a reference into a deeply nested record is built from the
 * references to each level and used like any other value.
 *
 * @module
 */

/**
 * Lens represents a focus on a value of type `A` inside a structure of type `S`.
 * It holds a `get` that extracts the focused value and a `set` that returns a
 * new structure with the focused value replaced. The structure itself is never
 * mutated. A well-behaved lens satisfies three laws: setting what was just
 * read returns the original structure, reading what was just set returns that
 * value, and a second set overrides the first.
 *
 * @typeParam S The type of the whole structure
 * @typeParam A The type of the focused value
 *
 * @example
 * ```ts
 * import { type Lens } from '@gimme/optics/lens'
 *
 * type Point = { x: number; y: number };
 *
 * const x: Lens<Point, number> = {
 *   get: (p) => p.x,
 *   set: (p, x) => ({ ...p, x }),
 * };
 * ```
 */
export type Lens<S, A> = {
  readonly get: (s: S) => A;
  readonly set: (s: S, a: A) => S;
};

/**
 * Creates a Lens from a getter and a setter. The setter receives the whole
 * structure and the new focused value, and must return a new structure rather
 * than mutate the given one.
 *
 * @typeParam S The type of the whole structure
 * @typeParam A The type of the focused value
 * @param get Function that extracts the focused value from the structure
 * @param set Function that returns a copy of the structure with the focused value replaced
 * @returns A Lens focusing on the value selected by get and set
 *
 * @example Focusing on a property
 * ```ts
 * import { lens } from '@gimme/optics/lens'
 *
 * type User = { name: string; age: number };
 *
 * const age = lens(
 *   (u: User) => u.age,
 *   (u: User, age: number) => ({ ...u, age }),
 * );
 *
 * age.get({ name: "Ada", age: 36 });     // 36
 * age.set({ name: "Ada", age: 36 }, 37); // { name: "Ada", age: 37 }
 * ```
 *
 * @example The identity lens focuses on the whole structure
 * ```ts
 * import { lens } from '@gimme/optics/lens'
 *
 * const identity = <S>() => lens((s: S) => s, (_: S, s: S) => s);
 *
 * identity<number>().get(1);    // 1
 * identity<number>().set(1, 2); // 2
 * ```
 */
export const lens = <S, A>(
  get: (s: S) => A,
  set: (s: S, a: A) => S,
): Lens<S, A> => ({ get, set });

/**
 * Creates a function that reads the focused value from a structure. This is
 * the data-last form of the lens getter, for use in a pipeline.
 *
 * @typeParam S The type of the whole structure
 * @typeParam A The type of the focused value
 * @param l The Lens to read through
 * @returns A function that takes a structure and returns the focused value
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { get, lens } from '@gimme/optics/lens'
 *
 * type User = { name: string };
 *
 * const name = lens(
 *   (u: User) => u.name,
 *   (u: User, name: string) => ({ ...u, name }),
 * );
 *
 * pipe({ name: "Ada" }, get(name)); // "Ada"
 * ```
 */
export const get = <S, A>(l: Lens<S, A>): (s: S) => A => (s: S): A => l.get(s);

/**
 * Creates a function that replaces the focused value in a structure, returning
 * a new structure. The original is left unchanged. This is the data-last form
 * of the lens setter, for use in a pipeline.
 *
 * @typeParam S The type of the whole structure
 * @typeParam A The type of the focused value
 * @param l The Lens to write through
 * @returns A function that takes the new value, then a structure, and returns the updated structure
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { lens, set } from '@gimme/optics/lens'
 *
 * type User = { name: string; age: number };
 *
 * const age = lens(
 *   (u: User) => u.age,
 *   (u: User, age: number) => ({ ...u, age }),
 * );
 *
 * const ada = { name: "Ada", age: 36 };
 *
 * pipe(ada, set(age)(37)); // { name: "Ada", age: 37 }
 * ada.age;                 // 36, the original is untouched
 * ```
 */
export const set =
  <S, A>(l: Lens<S, A>): (a: A) => (s: S) => S => (a: A) => (s: S): S =>
    l.set(s, a);

/**
 * Creates a function that updates the focused value in a structure by applying
 * a function to it, returning a new structure. Equivalent to reading with `get`,
 * transforming, and writing back with `set`, in one step.
 *
 * @typeParam S The type of the whole structure
 * @typeParam A The type of the focused value
 * @param l The Lens to update through
 * @returns A function that takes the update function, then a structure, and returns the updated structure
 *
 * @example
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { lens, over } from '@gimme/optics/lens'
 *
 * type Counter = { count: number };
 *
 * const count = lens(
 *   (c: Counter) => c.count,
 *   (c: Counter, count: number) => ({ ...c, count }),
 * );
 *
 * pipe({ count: 1 }, over(count)((n) => n + 1)); // { count: 2 }
 * ```
 */
export const over = <S, A>(
  l: Lens<S, A>,
): (f: (a: A) => A) => (s: S) => S =>
(f: (a: A) => A) =>
(s: S): S => l.set(s, f(l.get(s)));

/**
 * Creates a function that composes a lens into a deeper one. Given a lens from
 * `A` to `B` and applied to a lens from `S` to `A`, the result focuses from `S`
 * straight to `B`. Reading goes through both getters, writing reads the
 * intermediate value, sets the inner part, and writes the result back through
 * the outer lens.
 *
 * The argument is the inner lens and the piped value is the outer lens, so in
 * a pipeline the lenses read in path order, outermost first.
 *
 * @typeParam A The type of the intermediate structure
 * @typeParam B The type of the focused value
 * @typeParam S The type of the whole structure
 * @param ab The inner Lens, from the intermediate structure to the focused value
 * @returns A function that takes the outer Lens and returns a Lens from the whole structure to the focused value
 *
 * @example Composing two lenses
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { compose, get, lens, set } from '@gimme/optics/lens'
 *
 * type Address = { street: string };
 * type Person = { name: string; address: Address };
 *
 * const address = lens(
 *   (p: Person) => p.address,
 *   (p: Person, address: Address) => ({ ...p, address }),
 * );
 * const street = lens(
 *   (a: Address) => a.street,
 *   (a: Address, street: string) => ({ ...a, street }),
 * );
 *
 * const personStreet = pipe(address, compose(street));
 *
 * const ada: Person = { name: "Ada", address: { street: "1 Main St" } };
 *
 * get(personStreet)(ada);              // "1 Main St"
 * set(personStreet)("2 High St")(ada); // { name: "Ada", address: { street: "2 High St" } }
 * ```
 *
 * @example Composing a longer path
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { compose, get, lens } from '@gimme/optics/lens'
 *
 * type Settings = { theme: string };
 * type User = { settings: Settings };
 * type App = { user: User };
 *
 * const user = lens((a: App) => a.user, (a: App, user: User) => ({ ...a, user }));
 * const settings = lens((u: User) => u.settings, (u: User, settings: Settings) => ({ ...u, settings }));
 * const theme = lens((s: Settings) => s.theme, (s: Settings, theme: string) => ({ ...s, theme }));
 *
 * const appTheme = pipe(user, compose(settings), compose(theme));
 *
 * get(appTheme)({ user: { settings: { theme: "dark" } } }); // "dark"
 * ```
 */
export const compose = <A, B>(
  ab: Lens<A, B>,
): <S>(sa: Lens<S, A>) => Lens<S, B> =>
<S>(sa: Lens<S, A>): Lens<S, B> => ({
  get: (s) => ab.get(sa.get(s)),
  set: (s, b) => sa.set(s, ab.set(sa.get(s), b)),
});
