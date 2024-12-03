import { assertEquals } from "@std/assert";
import {
  bimap,
  first,
  fst,
  pure,
  second,
  show,
  snd,
  swap,
  uncurry,
} from "./tuple.ts";

const inc = (x: number) => x + 1;
const add = (x: number) => (y: number) => x + y;

Deno.test("mapFst", () => {
  const found = show(first(inc)(pure(0, 0)));
  const wanted = show([1, 0]);

  assertEquals(found, wanted);
});

Deno.test("mapSnd", () => {
  const found = show(second(inc)(pure(0, 0)));
  const wanted = show([0, 1]);

  assertEquals(found, wanted);
});

Deno.test("bimap", () => {
  const found = show(bimap(inc, inc)(pure(0, 0)));
  const wanted = show([1, 1]);

  assertEquals(found, wanted);
});

Deno.test("bimap", () => {
  const found = show(swap(pure(1, 0)));
  const wanted = show([0, 1]);

  assertEquals(found, wanted);
});

Deno.test("fst", () => {
  const found = fst(pure(1, 0));
  const wanted = 1;

  assertEquals(found, wanted);
});

Deno.test("snd", () => {
  const found = snd(pure(1, 0));
  const wanted = 0;

  assertEquals(found, wanted);
});

Deno.test("snd", () => {
  const found = uncurry(add)(pure(1, 2));
  const wanted = 3;

  assertEquals(found, wanted);
});
