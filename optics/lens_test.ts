import { assertEquals } from "@std/assert";
import { pipe } from "@gimme/base/pipe";
import { compose, get, lens, over, set } from "./lens.ts";

type Address = { street: string };
type Profile = { name: string; address: Address };

const profile1: Profile = {
  name: "John Doe",
  address: { street: "Somestreet 1" },
};

const lenses = {
  name: lens(
    (p: Profile) => p.name,
    (p: Profile, n) => ({ ...p, name: n }),
  ),
  address: lens(
    (p: Profile) => p.address,
    (p: Profile, a) => ({ ...p, address: a }),
  ),
  street: lens(
    (a: Address) => a.street,
    (a: Address, s) => ({ ...a, street: s }),
  ),
};

Deno.test("law: get-put: set(s, get(s)) = s", () => {
  const found = pipe(profile1, set(lenses.name)(get(lenses.name)(profile1)));
  const wanted = profile1;
  assertEquals(found, wanted);
});

Deno.test("law: put-get: get(set(s, a)) = a", () => {
  const found = pipe(profile1, set(lenses.name)("Jane Doe"), get(lenses.name));
  const wanted = "Jane Doe";
  assertEquals(found, wanted);
});

Deno.test("law: put-put: set(set(s, a), b) = set(s, b)", () => {
  const leftside = pipe(profile1, set(lenses.name)("A"), set(lenses.name)("B"));
  const rightside = pipe(profile1, set(lenses.name)("B"));
  const found = leftside;
  const wanted = rightside;
  assertEquals(found, wanted);
});

Deno.test("get: gets the lens value", () => {
  const found = pipe(profile1, get(lenses.name));
  const wanted = "John Doe";
  assertEquals(found, wanted);
});

Deno.test("set: sets the lens value", () => {
  const found = pipe(profile1, set(lenses.name)("Johnny Doe"));
  const wanted = { ...profile1, name: "Johnny Doe" };
  assertEquals(found, wanted);
});

Deno.test("over: modifies the lens value", () => {
  const found = pipe(profile1, over(lenses.name)((s) => s.toUpperCase()));
  const wanted = { ...profile1, name: "JOHN DOE" };
  assertEquals(found, wanted);
});

Deno.test("compose: combine lenses", () => {
  const found = pipe(
    profile1,
    get(pipe(lenses.address, compose(lenses.street))),
  );
  const wanted = "Somestreet 1";
  assertEquals(found, wanted);
});

Deno.test("composition", () => {
  const found = pipe(
    profile1,
    set(lenses.name)("Johnny Doe"),
    over(lenses.name)((s) => s.toUpperCase()),
  );
  const wanted = { ...profile1, name: "JOHNNY DOE" };
  assertEquals(found, wanted);
});
