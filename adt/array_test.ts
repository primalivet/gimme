import { assertEquals } from "@std/assert";
import { pipe } from "@gimme/base/pipe";
import * as E from "@gimme/adt/either";
import * as M from "@gimme/adt/maybe";
import {
  apply,
  bind,
  empty,
  filter,
  filterMap,
  filterMapWithIdx,
  find,
  fold,
  fromEither,
  fromMaybe,
  head,
  join,
  map,
  mapWithIdx,
  partition,
  partitionMap,
  partitionMapWithIdx,
  pure,
  range,
  reduce,
  show,
  zip,
  zipWith,
} from "./array.ts";

const numbers = [1, 2, 3];

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

Deno.test("apply: applies every function to every value", () => {
  const inc = (n: number) => n + 1;
  const dbl = (n: number) => n * 2;
  const found = apply([inc, dbl])([1, 2]);
  const wanted = [2, 3, 2, 4];
  assertEquals(found, wanted);
});

Deno.test("apply: agrees with bind", () => {
  const inc = (n: number) => n + 1;
  const dbl = (n: number) => n * 2;
  const leftside = apply([inc, dbl])([1, 2]);
  const rightside = bind((f: (n: number) => number) => map(f)([1, 2]))([
    inc,
    dbl,
  ]);
  const found = show(leftside) === show(rightside);
  const wanted = true;

  assertEquals(found, wanted);
});

Deno.test("empty: creates an empty list", () => {
  const found = empty<string>();
  const wanted: string[] = [];
  assertEquals(found, wanted);
});

Deno.test("pure: wraps a value in a list", () => {
  const found = pure("A");
  const wanted = ["A"];
  assertEquals(found, wanted);
});

Deno.test("show: pretty prints the list as JSON", () => {
  const found = show(["A"]);
  const wanted = JSON.stringify(["A"], null, 2);
  assertEquals(found, wanted);
});

Deno.test("map: apply a list of values to a function and collects", () => {
  const found = map((a: number) => a * 2)(numbers);
  const wanted = [2, 4, 6];
  assertEquals(found, wanted);
});

Deno.test("mapWithIdx: apply a list of values to a function and collects", () => {
  const found = mapWithIdx((a: number, i: number) => a * i)(numbers);
  const wanted = [0, 2, 6];
  assertEquals(found, wanted);
});

Deno.test("bind: applies the function to each value and flattens the results", () => {
  const found = bind((a: number) => [a, 0])(numbers);
  const wanted = [1, 0, 2, 0, 3, 0];
  assertEquals(found, wanted);
});

Deno.test("zip: pairs values by position with the piped list first", () => {
  const found = zip(numbers)(["a", "b", "c"]);
  const wanted = [["a", 1], ["b", 2], ["c", 3]];
  assertEquals(found, wanted);
});

Deno.test("zip: truncates to the shorter list", () => {
  const found = zip(numbers)(["a"]);
  const wanted = [["a", 1]];
  assertEquals(found, wanted);
});

Deno.test("zipWith: combines values by position with the function", () => {
  const add = (x: number, y: number) => x + y;
  const found = zipWith(add)(numbers)(numbers);
  const wanted = [2, 4, 6];
  assertEquals(found, wanted);
});

Deno.test("zipWith: truncates to the shorter list", () => {
  const add = (x: number, y: number) => x + y;
  const found = zipWith(add)([10])(numbers);
  const wanted = [11];
  assertEquals(found, wanted);
});

Deno.test("join: flattens one level of nesting", () => {
  const found = join([numbers, numbers]);
  const wanted = [1, 2, 3, 1, 2, 3];
  assertEquals(found, wanted);
});

Deno.test("partition: unsatisfied values first, satisfied values second", () => {
  const odd = (x: number) => x % 2 !== 0;
  const found = partition(odd)(numbers);
  const wanted = [[2], [1, 3]];
  assertEquals(found, wanted);
});

Deno.test("partitionMap: left values first, right values second", () => {
  const isA = (x: string) =>
    pipe(
      x,
      E.fromPredicate(() => "B")((x: unknown): x is "A" => x === "A"),
    );
  const found = partitionMap(isA)(["A", "C", "A", "C"]);
  const wanted: ["B"[], "A"[]] = [["B", "B"], ["A", "A"]];
  assertEquals(found, wanted);
});

Deno.test("partitionMapWithIdx: left values first, right values second, with index", () => {
  const upperIfString = (
    x: unknown,
  ): E.Either<unknown, string> =>
    typeof x === "string" ? E.right(x.toUpperCase()) : E.left(x);
  const found = partitionMapWithIdx((x, i) =>
    pipe(x, upperIfString, E.map((x) => `${i}: ${x}`))
  )(["hello", 1, null, undefined, "world"]);
  const wanted: [unknown[], string[]] = [[1, null, undefined], [
    "0: HELLO",
    "4: WORLD",
  ]];
  assertEquals(found, wanted);
});

Deno.test("filterMap: keeps the just values", () => {
  const doubleOdd = (x: number): M.Maybe<number> =>
    x % 2 !== 0 ? M.just(x * 2) : M.nothing;
  const found = filterMap(doubleOdd)(numbers);
  const wanted = [2, 6];
  assertEquals(found, wanted);
});

Deno.test("filterMapWithIdx: keeps the just values, with index", () => {
  const doubleOddPlusIdx = (x: number, i: number): M.Maybe<number> =>
    x % 2 !== 0 ? M.just(x * 2 + i) : M.nothing;
  const found = filterMapWithIdx(doubleOddPlusIdx)(numbers);
  const wanted = [2, 8];
  assertEquals(found, wanted);
});

Deno.test("filter: keeps values satisfying the predicate", () => {
  const odd = (x: number) => x % 2 !== 0;
  const found = filter(odd)(numbers);
  const wanted = [1, 3];
  assertEquals(found, wanted);
});

Deno.test("reduce: folds the list from the left with an initial value", () => {
  const add = (x: number, y: number) => x + y;
  const found = reduce(0, add)(numbers);
  const wanted = 6;
  assertEquals(found, wanted);
});

Deno.test("find: on match", () => {
  const gte = (x: number) => (y: number) => y >= x;
  const found = find(gte(2))(numbers);
  const wanted = M.just(2);
  assertEquals(M.show(found), M.show(wanted));
});

Deno.test("find: on miss", () => {
  const gte = (x: number) => (y: number) => y >= x;
  const found = find(gte(4))(numbers);
  const wanted = M.nothing;
  assertEquals(M.show(found), M.show(wanted));
});

Deno.test("find: on match 'nullable'", () => {
  const found = find((x) => x === undefined)([null, undefined]);
  const wanted = M.just(undefined);
  assertEquals(M.show(found), M.show(wanted));
});

Deno.test("range: start is less than end", () => {
  const found = range(1, 5);
  const wanted = [1, 2, 3, 4, 5];
  assertEquals(found, wanted);
});

Deno.test("range: start is more than end", () => {
  const found = range(5, 1);
  const wanted = [5, 4, 3, 2, 1];
  assertEquals(found, wanted);
});

Deno.test("range: start is equal to end", () => {
  const found = range(1, 1);
  const wanted = [1];
  assertEquals(found, wanted);
});

Deno.test("range: start and end is zero", () => {
  const found = range(0, 0);
  const wanted = [0];
  assertEquals(found, wanted);
});

Deno.test("range: start is negative and less than end", () => {
  const found = range(-5, 0);
  const wanted = [-5, -4, -3, -2, -1, 0];
  assertEquals(found, wanted);
});

Deno.test("range: start is negative and more than end", () => {
  const found = range(-5, -10);
  const wanted = [-5, -6, -7, -8, -9, -10];
  assertEquals(found, wanted);
});

Deno.test("head: on non empty list", () => {
  const found = head(numbers);
  const wanted = M.just(1);
  assertEquals(M.show(found), M.show(wanted));
});

Deno.test("head: on non empty list with 'nullables'", () => {
  const found = head([null, undefined]);
  const wanted = M.just(null);
  assertEquals(M.show(found), M.show(wanted));
});

Deno.test("head: on empty list", () => {
  const found = head([]);
  const wanted = M.nothing;
  assertEquals(M.show(found), M.show(wanted));
});

Deno.test("fold: on empty list", () => {
  const found = fold(() => 0, (xs) => xs.length)([]);
  const wanted = 0;
  assertEquals(found, wanted);
});

Deno.test("fold: on non empty list", () => {
  const found = fold(() => 0, (xs) => xs.length)(numbers);
  const wanted = 3;
  assertEquals(found, wanted);
});

Deno.test("fromEither: on right", () => {
  const found = fromEither(E.right(1));
  const wanted = [1];
  assertEquals(found, wanted);
});

Deno.test("fromEither: on left", () => {
  const found = fromEither(E.left(1));
  const wanted: number[] = [];
  assertEquals(found, wanted);
});

Deno.test("fromMaybe: on just", () => {
  const found = fromMaybe(M.just(1));
  const wanted = [1];
  assertEquals(found, wanted);
});

Deno.test("fromMaybe: on nothing", () => {
  const found = fromMaybe(M.nothing);
  const wanted: number[] = [];
  assertEquals(found, wanted);
});
