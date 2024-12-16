import { assertEquals } from "@std/assert";
import { compose } from "@gimme/base/compose";

const f = (x: number) => x + 1;
const mult = (x: number) => (y: number) => x * y;
const add = (x: number) => (y: number) => x + y;

Deno.test("composes right to left", () => {
  const found = compose(mult(2), add(1))(50);
  const wanted = 102;

  assertEquals(found, wanted);
});
Deno.test("compose 2", () => {
  const found = compose(f, f)(0);
  const wanted = 2;
  assertEquals(found, wanted);
});

Deno.test("compose 3", () => {
  const found = compose(f, f, f)(0);
  const wanted = 3;
  assertEquals(found, wanted);
});

Deno.test("compose 4", () => {
  const found = compose(f, f, f, f)(0);
  const wanted = 4;
  assertEquals(found, wanted);
});

Deno.test("compose 5", () => {
  const found = compose(f, f, f, f, f)(0);
  const wanted = 5;
  assertEquals(found, wanted);
});

Deno.test("compose 6", () => {
  const found = compose(f, f, f, f, f, f)(0);
  const wanted = 6;
  assertEquals(found, wanted);
});

Deno.test("compose 7", () => {
  const found = compose(f, f, f, f, f, f, f)(0);
  const wanted = 7;
  assertEquals(found, wanted);
});

Deno.test("compose 8", () => {
  const found = compose(f, f, f, f, f, f, f, f)(0);
  const wanted = 8;
  assertEquals(found, wanted);
});

Deno.test("compose 9", () => {
  const found = compose(f, f, f, f, f, f, f, f, f)(0);
  const wanted = 9;
  assertEquals(found, wanted);
});

Deno.test("compose 10", () => {
  const found = compose(f, f, f, f, f, f, f, f, f, f)(0);
  const wanted = 10;
  assertEquals(found, wanted);
});

Deno.test("compose 11", () => {
  const found = compose(f, f, f, f, f, f, f, f, f, f, f)(0);
  const wanted = 11;
  assertEquals(found, wanted);
});
