import { assertEquals } from "@std/assert";
import {
  apply,
  bind,
  fold,
  fromNullable,
  fromPredicate,
  isJust,
  isNothing,
  join,
  just,
  map,
  nothing,
  pure,
  sequence,
  show,
  tryCatch,
} from "./maybe.ts";

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

Deno.test("nothing", () => {
  const found = show(nothing);
  const wanted = "Nothing";
  assertEquals(found, wanted);
});

Deno.test("just", () => {
  const found = show(just("success"));
  const wanted = 'Just("success")';
  assertEquals(found, wanted);
});

Deno.test("pure: wrapps a value in the context", () => {
  const found = pure(2);
  const wanted = just(2);
  assertEquals(show(found), show(wanted));
});

Deno.test("isJust", () => {
  const found = [isJust(just("")), isJust(nothing)];
  const wanted = [true, false];
  assertEquals(found, wanted);
});

Deno.test("isNothing", () => {
  const found = [isNothing(just("")), isNothing(nothing)];
  const wanted = [false, true];
  assertEquals(found, wanted);
});

Deno.test("fmap: maps the function over a just value", () => {
  const double = (x: number) => x * 2;
  const found = map(double)(just(2));
  const wanted = just(4);
  assertEquals(show(found), show(wanted));
});

Deno.test("fmap: dont do anything on a nothing value", () => {
  const double = (x: number) => x * 2;
  const found = map(double)(nothing);
  const wanted = nothing;
  assertEquals(show(found), show(wanted));
});

Deno.test("bind: apply the just value to a function returning an maybe, then flatten the result", () => {
  const mDouble = (x: number) => pure(x * 2);
  const found = bind(mDouble)(pure(2));
  const wanted = just(4);
  assertEquals(show(found), show(wanted));
});

Deno.test("bind: dont do anything to a nothing value", () => {
  const mDouble = (x: number) => pure(x * 2);
  const found = bind(mDouble)(nothing);
  const wanted = nothing;
  assertEquals(show(found), show(wanted));
});

Deno.test("join: unwrapps a nested maybe", () => {
  const nested = just(just(42));
  const found = join(nested);
  const wanted = just(42);
  assertEquals(show(found), show(wanted));
});

Deno.test("join: unwrapps a nested nothing", () => {
  const nestedNothing = just(nothing);
  const found = join(nestedNothing);
  const wanted = nothing;
  assertEquals(show(found), show(wanted));
});

Deno.test("join: does not unwrap a non nested nothing", () => {
  const outerLeft = nothing;
  const found = join(outerLeft);
  const wanted = nothing;
  assertEquals(show(found), show(wanted));
});
Deno.test("apply: apply the just value to the function", () => {
  const double = (x: number) => x * 2;
  const found = apply(just(double))(just(2));
  const wanted = just(4);
  assertEquals(show(found), show(wanted));
});

Deno.test("apply: dont do anything on a nothing function", () => {
  const found = apply(nothing)(just(2));
  const wanted = nothing;
  assertEquals(show(found), show(wanted));
});

Deno.test("fold: calls onNothing on nothing value", () => {
  const found = fold(
    () => "none",
    () => "some",
  )(nothing);
  const wanted = "none";
  assertEquals(found, wanted);
});

Deno.test("fold: calls onJust on right value", () => {
  const found = fold(
    () => "none",
    () => "some",
  )(just("hello world"));
  const wanted = "some";
  assertEquals(found, wanted);
});

Deno.test("fromNullable: Nothing when value is null", () => {
  const found = fromNullable(null);
  const wanted = nothing;
  assertEquals(show(found), show(wanted));
});

Deno.test("fromNullable: Nothing when value is undefined", () => {
  const found = fromNullable(undefined);
  const wanted = nothing;
  assertEquals(show(found), show(wanted));
});

Deno.test("fromNullable: Just when value is not null or undefined", () => {
  const found = fromNullable("hello world");
  const wanted = just("hello world");
  assertEquals(show(found), show(wanted));
});

Deno.test("fromPredicate: Just when predicate is true", () => {
  const found = fromPredicate(Array.isArray)(["hello", "world"]);
  const wanted = just(["hello", "world"]);
  assertEquals(show(found), show(wanted));
});

Deno.test("fromPredicate: Nothing when predicate is false", () => {
  const found = fromPredicate(Array.isArray)("hello world");
  const wanted = nothing;
  assertEquals(show(found), show(wanted));
});

Deno.test("tryCatch: Just when function does not throw", () => {
  const found = tryCatch(
    () => {
      throw new Error("failure");
    },
  );
  const wanted = nothing;
  assertEquals(show(found), show(wanted));
});

Deno.test("tryCatch: Nothing when function does throw", () => {
  const found = tryCatch(
    () => {
      return "success";
    },
  );
  const wanted = just("success");
  assertEquals(show(found), show(wanted));
});

Deno.test("sequence: should turn a list of maybes into a Just of a list when all maybes are justs", () => {
  const found = sequence([just(1), just(2), just(3)]);
  const wanted = just([1, 2, 3]);
  assertEquals(show(found), show(wanted));
});

Deno.test("sequence: should turn a list of maybes into a nothing, if the list includes a nothing", () => {
  const found = sequence([just(1), nothing, just(3)]);
  const wanted = nothing;
  assertEquals(show(found), show(wanted));
});

Deno.test("sequence: of an empty list is a just of a empty list", () => {
  const found = sequence([]);
  const wanted = just([]);
  assertEquals(show(found), show(wanted));
});
