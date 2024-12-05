import { assertEquals } from "@std/assert";
import { pipe } from "@gimme/base/pipe";

const f = (x: number) => x + 1;
const mult = (x: number) => (y: number) => x * y;
const add = (x: number) => (y: number) => x + y;

Deno.test("composes left to right", () => {
  const found = pipe(50, mult(2), add(1));
  const wanted = 101;

  assertEquals(found, wanted);
});

Deno.test("pipe 1", () => {
  const found = pipe(0, f);
  const wanted = 1;
  assertEquals(found, wanted);
});

Deno.test("pipe 2", () => {
  const found = pipe(0, f, f);
  const wanted = 2;
  assertEquals(found, wanted);
});

Deno.test("pipe 3", () => {
  const found = pipe(0, f, f, f);
  const wanted = 3;
  assertEquals(found, wanted);
});

Deno.test("pipe 4", () => {
  const found = pipe(0, f, f, f, f);
  const wanted = 4;
  assertEquals(found, wanted);
});

Deno.test("pipe 5", () => {
  const found = pipe(0, f, f, f, f, f);
  const wanted = 5;
  assertEquals(found, wanted);
});

Deno.test("pipe 6", () => {
  const found = pipe(0, f, f, f, f, f, f);
  const wanted = 6;
  assertEquals(found, wanted);
});

Deno.test("pipe 7", () => {
  const found = pipe(0, f, f, f, f, f, f, f);
  const wanted = 7;
  assertEquals(found, wanted);
});

Deno.test("pipe 8", () => {
  const found = pipe(0, f, f, f, f, f, f, f, f);
  const wanted = 8;
  assertEquals(found, wanted);
});

Deno.test("pipe 9", () => {
  const found = pipe(0, f, f, f, f, f, f, f, f, f);
  const wanted = 9;
  assertEquals(found, wanted);
});

Deno.test("pipe 10", () => {
  const found = pipe(0, f, f, f, f, f, f, f, f, f, f);
  const wanted = 10;
  assertEquals(found, wanted);
});

Deno.test("pipe 11", () => {
  const found = pipe(0, f, f, f, f, f, f, f, f, f, f, f);
  const wanted = 11;
  assertEquals(found, wanted);
});
