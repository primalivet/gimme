import { assertEquals } from "@std/assert";
import { flow } from "@gimme/base/flow"

const f = (x: number) => x + 1;
const mult = (x: number) => (y: number) => x * y;
const add = (x: number) => (y: number) => x + y;

  Deno.test("composes left to right", () => {
    const found = flow(mult(2), add(1))(50);
    const wanted = 101;

    assertEquals(found, wanted);
  });

  Deno.test("flow 1", () => {
    const found = flow(f)(0);
    const wanted = 1;
    assertEquals(found, wanted);
  });

  Deno.test("flow 2", () => {
    const found = flow(f, f)(0);
    const wanted = 2;
    assertEquals(found, wanted);
  });
  Deno.test("flow 3", () => {
    const found = flow(f, f, f)(0);
    const wanted = 3;
    assertEquals(found, wanted);
  });

  Deno.test("flow 4", () => {
    const found = flow(f, f, f, f)(0);
    const wanted = 4;
    assertEquals(found, wanted);
  });

  Deno.test("flow 5", () => {
    const found = flow(f, f, f, f, f)(0);
    const wanted = 5;
    assertEquals(found, wanted);
  });

  Deno.test("flow 6", () => {
    const found = flow(f, f, f, f, f, f)(0);
    const wanted = 6;
    assertEquals(found, wanted);
  });

  Deno.test("flow 7", () => {
    const found = flow(f, f, f, f, f, f, f)(0);
    const wanted = 7;
    assertEquals(found, wanted);
  });

  Deno.test("flow 8", () => {
    const found = flow(f, f, f, f, f, f, f, f)(0);
    const wanted = 8;
    assertEquals(found, wanted);
  });

  Deno.test("flow 9", () => {
    const found = flow(f, f, f, f, f, f, f, f, f)(0);
    const wanted = 9;
    assertEquals(found, wanted);
  });

  Deno.test("flow 10", () => {
    const found = flow(f, f, f, f, f, f, f, f, f, f)(0);
    const wanted = 10;
    assertEquals(found, wanted);
  });

  Deno.test("flow 11", () => {
    const found = flow(f, f, f, f, f, f, f, f, f, f, f)(0);
    const wanted = 11;
    assertEquals(found, wanted);
  });
