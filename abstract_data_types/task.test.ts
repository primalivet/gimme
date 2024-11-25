import { assertEquals } from "@std/assert";
import * as T from "./task.ts";

const upper = (s: string) => s.toUpperCase();
const asyncUpper = (s: string): T.Task<string> => () =>
  new Promise((resolve) => setTimeout(() => resolve(s.toUpperCase()), 300));

Deno.test("Laws", () => {
  Deno.test("left identity", () => {
    const f = (x: number) => T.pure(() => x * 2);
    const leftside = T.bind(f)(T.pure(10));
    const rightside = f(10);
    const found = T.show(leftside) === T.show(rightside);
    const wanted = true;

    assertEquals(found, wanted);
  });

  Deno.test("right identity", () => {
    const leftside = T.bind(T.pure)(T.pure(10));
    const rightside = T.pure(10);
    const found = T.show(leftside) === T.show(rightside);
    const wanted = true;

    assertEquals(found, wanted);
  });

  Deno.test("associativity", () => {
    const f = (x: number) => T.pure(x * 2);
    const g = (x: number) => T.pure(x + 1);
    const leftside = T.bind(g)(T.bind(f)(T.pure(10)));
    const rightside = T.bind((x: number) => T.bind(g)(f(x)))(T.pure(10));
    const found = T.show(leftside) === T.show(rightside);
    const wanted = true;

    assertEquals(found, wanted);
  });
});

Deno.test("Functor", () => {
  Deno.test("fmap: apply a Task of a value to a function", async () => {
    const found = await T.fmap(upper)(T.pure("hello"))();
    const wanted = "HELLO";
    assertEquals(found, wanted);
  });
});

Deno.test("Apply", () => {
  Deno.test("apply: apply a Task of a value to a Task of a function", async () => {
    const found = await T.apply(T.pure("hello"))(T.pure(upper))();
    const wanted = "HELLO";
    assertEquals(found, wanted);
  });
});

Deno.test("Applicative", () => {
  Deno.test("pure: lifts a value up in Task context", async () => {
    const found = await T.pure("hello")();
    const wanted = "hello";
    assertEquals(found, wanted);
  });
});

Deno.test("Monad", () => {
  Deno.test("bind: apply a Task of a value to a function returning another Task, flatten the result", async () => {
    const found = await T.bind(asyncUpper)(T.pure("hello"))();
    const wanted = "HELLO";
    assertEquals(found, wanted);
  });
});

Deno.test("Constructor", () => {
  Deno.test("delay", async () => {
    const found = await T.delay(300)("hello")();
    const wanted = "hello";
    assertEquals(found, wanted);
  });
});
