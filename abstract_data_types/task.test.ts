import { assertEquals } from "@std/assert";
import {
  apply,
  bind,
  delay,
  join,
  map,
  pure,
  show,
  type Task,
} from "./task.ts";

const upper = (s: string) => s.toUpperCase();
const asyncUpper = (s: string): Task<string> => () =>
  new Promise((resolve) => setTimeout(() => resolve(s.toUpperCase()), 300));

Deno.test("left identity", () => {
  const f = (x: number) => pure(() => x * 2);
  const leftside = bind(f)(pure(10));
  const rightside = f(10);
  const found = show(leftside) === show(rightside);
  const wanted = true;
  assertEquals(found, wanted);
});

Deno.test("right identity", () => {
  const leftside = bind(pure)(pure(10));
  const rightside = pure(10);
  const found = show(leftside) === show(rightside);
  const wanted = true;
  assertEquals(found, wanted);
});

Deno.test("associativity", () => {
  const f = (x: number) => pure(x * 2);
  const g = (x: number) => pure(x + 1);
  const leftside = bind(g)(bind(f)(pure(10)));
  const rightside = bind((x: number) => bind(g)(f(x)))(pure(10));
  const found = show(leftside) === show(rightside);
  const wanted = true;
  assertEquals(found, wanted);
});

Deno.test("pure: lifts a value up in Task context", async () => {
  const found = await pure("hello")();
  const wanted = "hello";
  assertEquals(found, wanted);
});

Deno.test("map: apply a Task of a value to a function", async () => {
  const found = await map(upper)(pure("hello"))();
  const wanted = "HELLO";
  assertEquals(found, wanted);
});

Deno.test("apply: apply a Task of a value to a Task of a function", async () => {
  const found = await apply(pure(upper))(pure("hello"))();
  const wanted = "HELLO";
  assertEquals(found, wanted);
});

Deno.test("join: unwrapps a nested task", () => {
  const nested = pure(pure(42));
  const found = join(nested);
  const wanted = pure(42);
  assertEquals(show(found), show(wanted));
});

Deno.test("bind: apply a Task of a value to a function returning another Task, flatten the result", async () => {
  const found = await bind(asyncUpper)(pure("hello"))();
  const wanted = "HELLO";
  assertEquals(found, wanted);
});

Deno.test("delay", async () => {
  const found = await delay(300)("hello")();
  const wanted = "hello";
  assertEquals(found, wanted);
});
