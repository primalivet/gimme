import { assertEquals } from "@std/assert";
import * as T from "./tuple.ts";

const inc = (x: number) => x + 1;
const add = (x: number) => (y: number) => x + y;

Deno.test("mapFst", () => {
  const found = T.show(T.first(inc)(T.pure(0, 0)));
  const wanted = T.show([1, 0]);

  assertEquals(found, wanted);
});

Deno.test("mapSnd", () => {
  const found = T.show(T.second(inc)(T.pure(0, 0)));
  const wanted = T.show([0, 1]);

  assertEquals(found, wanted);
});

Deno.test("bimap", () => {
  const found = T.show(T.bimap(inc, inc)(T.pure(0, 0)));
  const wanted = T.show([1, 1]);

  assertEquals(found, wanted);
});

Deno.test("bimap", () => {
  const found = T.show(T.swap(T.pure(1, 0)));
  const wanted = T.show([0, 1]);

  assertEquals(found, wanted);
});

Deno.test("fst", () => {
  const found = T.fst(T.pure(1, 0));
  const wanted = 1;

  assertEquals(found, wanted);
});

Deno.test("snd", () => {
  const found = T.snd(T.pure(1, 0));
  const wanted = 0;

  assertEquals(found, wanted);
});

Deno.test("snd", () => {
  const found = T.uncurry(add)(T.pure(1, 2));
  const wanted = 3;

  assertEquals(found, wanted);
});
