/**
 * Optics: composable references to a part of a larger structure.
 * A `Lens` consists of getter and setter for one location in a structure.
 * So reading, replacing and updating a deeply nested field becomes a single
 * composed value instead of hand-written spread expressions.
 *
 * All operations are curried and data-last so it plays nicley with
 * `pipe` and `flow` from `@gimme/base`.
 *
 * @example Reading and updating a nested field
 * ```ts
 * import { pipe } from '@gimme/base'
 * import { Lens } from '@gimme/optics'
 *
 * type Address = { street: string; city: string };
 * type Person = { name: string; address: Address };
 *
 * const address = Lens.lens(
 *   (p: Person) => p.address,
 *   (p: Person, a: Address) => ({ ...p, address: a }),
 * );
 * const city = Lens.lens(
 *   (a: Address) => a.city,
 *   (a: Address, c: string) => ({ ...a, city: c }),
 * );
 * const personCity = pipe(address, Lens.compose(city));
 *
 * const ada: Person = { name: "Ada", address: { street: "1 Main St", city: "London" } };
 *
 * Lens.get(personCity)(ada);                 // "London"
 * Lens.set(personCity)("Paris")(ada);        // { name: "Ada", address: { street: "1 Main St", city: "Paris" } }
 * Lens.over(personCity)((c) => c.toUpperCase())(ada);
 * // { name: "Ada", address: { street: "1 Main St", city: "LONDON" } }
 * ```
 *
 * @module
 */
/** A composable getter and setter pair focusing on one part of a structure. */
export * as Lens from "@gimme/optics/lens";
