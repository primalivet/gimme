import { assertEquals } from "@std/assert";
import {
  apply,
  bimap,
  bind,
  fold,
  fromNullable,
  fromPredicate,
  isLeft,
  isRight,
  join,
  left,
  map,
  mapLeft,
  pure,
  right,
  show,
  tryCatch,
} from "./either.ts";

Deno.test("left identity", () => {
  const f = (x: number) => pure(x * 2);
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

Deno.test("left", () => {
  const found = show(left("reason"));
  const wanted = 'Left("reason")';

  assertEquals(found, wanted);
});

Deno.test("right", () => {
  const found = show(right("success"));
  const wanted = 'Right("success")';

  assertEquals(found, wanted);
});

Deno.test("pure: wrapps a value in the context", () => {
  const found = pure(2);
  const wanted = right(2);
  assertEquals(show(found), show(wanted));
});

Deno.test("isRight", () => {
  const found = [isRight(right("")), isRight(left(""))];
  const wanted = [true, false];

  assertEquals(found, wanted);
});

Deno.test("isLeft", () => {
  const found = [isLeft(right("")), isLeft(left(""))];
  const wanted = [false, true];

  assertEquals(found, wanted);
});

Deno.test("map: maps the function over a right value", () => {
  const double = (x: number) => x * 2;
  const found = map(double)(right(2));
  const wanted = right(4);
  assertEquals(show(found), show(wanted));
});

Deno.test("map: dont do anything on a left value", () => {
  const double = (x: number) => x * 2;
  const found = map(double)(left(2));
  const wanted = left(2);
  assertEquals(show(found), show(wanted));
});

Deno.test("mapLeft: apply a Left value to a function", () => {
  const double = (x: number) => x * 2;
  const found = mapLeft(double)(left(2));
  const wanted = left(4);
  assertEquals(show(found), show(wanted));
});

Deno.test("mapLeft: leave a Right value untouched", () => {
  const double = (x: number) => x * 2;
  const found = mapLeft(double)(right(2));
  const wanted = right(2);
  assertEquals(show(found), show(wanted));
});

Deno.test("bimap: apply a Left value to the first given function", () => {
  const inc = (x: number) => x + 1;
  const double = (x: number) => x * 2;
  const found = bimap(inc, double)(left(2));
  const wanted = left(3);
  assertEquals(show(found), show(wanted));
});

Deno.test("bimap: apply a Right value to the second given function", () => {
  const inc = (x: number) => x + 1;
  const double = (x: number) => x * 2;
  const found = bimap(inc, double)(right(2));
  const wanted = right(4);
  assertEquals(show(found), show(wanted));
});

Deno.test("bind: apply the right value to a function returning an either, then flatten the result", () => {
  const mDouble = (x: number) => pure(x * 2);
  const found = bind(mDouble)(pure(2));
  const wanted = right(4);
  assertEquals(show(found), show(wanted));
});

Deno.test("bind: dont do anything to a left value", () => {
  const mDouble = (x: number) => pure(x * 2);
  const found = bind(mDouble)(left(2));
  const wanted = left(2);
  assertEquals(show(found), show(wanted));
});

Deno.test("join: unwrapps a nested right right", () => {
  const nested = right(right(42));
  const found = join(nested);
  const wanted = right(42);
  assertEquals(show(found), show(wanted));
});

Deno.test("join: unwrapps a nested right left", () => {
  const nestedLeft = right(left(new Error("Failed")));
  const found = join(nestedLeft);
  const wanted = left(new Error("Failed"));
  assertEquals(show(found), show(wanted));
});

Deno.test("join: does not unwrap a non nested either left", () => {
  const outerLeft = left(new Error("Outer"));
  const found = join(outerLeft);
  const wanted = left(new Error("Outer"));
  assertEquals(show(found), show(wanted));
});

Deno.test("apply: apply the right value to the function", () => {
  const double = (x: number) => x * 2;
  const found = apply(right(double))(right(2));
  const wanted = right(4);
  assertEquals(show(found), show(wanted));
});

Deno.test("apply: dont do anything on a left function", () => {
  const double = (x: number) => x * 2;
  const found = apply(left(double))(right(2));
  const wanted = left(double);
  assertEquals(show(found), show(wanted));
});

Deno.test("fold: calls onLeft on left value", () => {
  const found = fold(
    () => "failure",
    () => "success",
  )(left(""));
  const wanted = "failure";
  assertEquals(found, wanted);
});

Deno.test("fold: calls onRight on right value", () => {
  const found = fold(
    () => "failure",
    () => "success",
  )(right(""));
  const wanted = "success";
  assertEquals(found, wanted);
});

Deno.test("fromNullable: Left when value is null", () => {
  const found = fromNullable((x) => x)(null);
  const wanted = left(null);

  assertEquals(show(found), show(wanted));
});

Deno.test("fromNullable: Left when value is undefined", () => {
  const found = fromNullable((x) => x)(undefined);
  const wanted = left(undefined);

  assertEquals(show(found), show(wanted));
});

Deno.test("fromNullable: Right when value is not null or undefined", () => {
  const found = fromNullable((x) => x)("hello world");
  const wanted = right("hello world");

  assertEquals(show(found), show(wanted));
});

Deno.test("fromPredicate: Right when predicate is true", () => {
  const found = fromPredicate(String)(Array.isArray)(["hello", "world"]);
  const wanted = right(["hello", "world"]);

  assertEquals(show(found), show(wanted));
});

Deno.test("fromPredicate: Left when predicate is false", () => {
  const found = fromPredicate(String)(Array.isArray)("hello world");
  const wanted = left("hello world");

  assertEquals(show(found), show(wanted));
});

Deno.test("tryCatch: Right when function does not throw", () => {
  const failingFn = () => {
    throw new Error("failure");
  };
  const found = tryCatch((x) => x)(failingFn);
  const wanted = left(new Error("failure"));
  assertEquals(show(found), show(wanted));
});

Deno.test("tryCatch: Left when function does throw", () => {
  const succeedingFn = () => {
    return "success";
  };
  const found = tryCatch((x) => x)(succeedingFn);
  const wanted = right("success");
  assertEquals(show(found), show(wanted));
});
