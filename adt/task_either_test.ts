import { assertEquals } from "@std/assert";
import { pure as _pure } from "@gimme/adt/task";
import { left as _left, right as _right, show } from "@gimme/adt/either";
import {
  bind,
  fold,
  fromEither,
  fromTask,
  left,
  map,
  mapLeft,
  pure,
  right,
  run,
  tryCatch,
  tryCatchK,
} from "@gimme/adt/task-either";

Deno.test("left identity", async () => {
  const f = (x: number) => pure(x * 2);
  const leftside = await run(bind(f)(pure(10)));
  const rightside = await run(f(10));
  const found = show(leftside) === show(rightside);
  const wanted = true;

  assertEquals(found, wanted);
});

Deno.test("right identity", async () => {
  const leftside = await run(bind(pure)(pure(10)));
  const rightside = await run(pure(10));
  const found = show(leftside) === show(rightside);
  const wanted = true;

  assertEquals(found, wanted);
});

Deno.test("associativity", async () => {
  const f = (x: number) => pure(x * 2);
  const g = (x: number) => pure(x + 1);
  const leftside = await run(bind(g)(bind(f)(pure(10))));
  const rightside = await run(bind((x: number) => bind(g)(f(x)))(pure(10)));
  const found = show(leftside) === show(rightside);
  const wanted = true;

  assertEquals(found, wanted);
});

Deno.test("right: constructs a task either right", async () => {
  const found = await run(right(10));
  const wanted = _right(10);
  assertEquals(show(found), show(wanted));
});

Deno.test("left: constructs a task either left", async () => {
  const found = await run(left(10));
  const wanted = _left(10);
  assertEquals(show(found), show(wanted));
});

Deno.test("pure: constructs a task either right", async () => {
  const found = await run(pure(10));
  const wanted = _right(10);
  assertEquals(show(found), show(wanted));
});

Deno.test("map: on a task either right", async () => {
  const found = await run(map((x: number) => x * 2)(right(32)));
  const wanted = _right(64);
  assertEquals(show(found), show(wanted));
});

Deno.test("map: on a task either left", async () => {
  const found = await run(map((x: number) => x * 2)(left(32)));
  const wanted = _left(32);
  assertEquals(show(found), show(wanted));
});

Deno.test("mapLeft: on a task either right", async () => {
  const found = await run(mapLeft((x: number) => x * 2)(right(32)));
  const wanted = _right(32);
  assertEquals(show(found), show(wanted));
});

Deno.test("mapLeft: on a task either left", async () => {
  const found = await run(mapLeft((x: number) => x * 2)(left(32)));
  const wanted = _left(64);
  assertEquals(show(found), show(wanted));
});

Deno.test("bind: on a task either right", async () => {
  const found = await run(bind((x: number) => pure(x * 2))(right(32)));
  const wanted = _right(64);
  assertEquals(show(found), show(wanted));
});

Deno.test("bind: on a task either left", async () => {
  const found = await run(bind((x: number) => pure(x * 2))(left(32)));
  const wanted = _left(32);
  assertEquals(show(found), show(wanted));
});

Deno.test("run: runs a task either", async () => {
  const found = await run(right(32));
  const wanted = _right(32);
  assertEquals(show(found), show(wanted));
});

Deno.test("fold: calls onLeft on left value", async () => {
  const found = await fold(
    () => _pure("failure"),
    () => _pure("success"),
  )(left(""))();
  const wanted = "failure";
  assertEquals(found, wanted);
});

Deno.test("fold: calls onRight on right value", async () => {
  const found = await fold(
    () => _pure("failure"),
    () => _pure("success"),
  )(right(""))();
  const wanted = "success";
  assertEquals(found, wanted);
});

Deno.test("tryCatch: when function does not throw ", async () => {
  const found = await run(
    tryCatch(String)(() => Promise.resolve("hello world")),
  );
  const wanted = _right("hello world");
  assertEquals(show(found), show(wanted));
});

Deno.test("tryCatch: when function throws", async () => {
  const found = await run(
    tryCatch(String)(() => Promise.reject(new Error("Some error occured"))),
  );
  const wanted = _left("Error: Some error occured");
  assertEquals(show(found), show(wanted));
});

Deno.test("tryCatchK: when sync function does not throw", async () => {
  const found = await run(
    tryCatchK(String)((s: string): string => s)("hello world"),
  );
  const wanted = _right("hello world");
  assertEquals(show(found), show(wanted));
});

Deno.test("tryCatchK: when sync function does throw", async () => {
  const found = await run(
    tryCatchK(String)((_: string): string => {
      throw new Error("hello world");
    })('{hello:"world"}'),
  );
  const wanted = _left("Error: hello world");
  assertEquals(show(found), show(wanted));
});

Deno.test("tryCatchK: when async function does not throw", async () => {
  const found = await run(
    tryCatchK(String)((s: string): Promise<string> => Promise.resolve(s))(
      "hello world",
    ),
  );
  const wanted = _right("hello world");
  assertEquals(show(found), show(wanted));
});

Deno.test("tryCatchK: when async function does throw", async () => {
  const found = await run(
    tryCatchK(String)((s: string): Promise<string> => Promise.reject(s))(
      "hello world",
    ),
  );
  const wanted = _left("hello world");
  assertEquals(show(found), show(wanted));
});

Deno.test("fromEither: when either is right", async () => {
  const found = await run(fromEither(_right(32)));
  const wanted = await run(right(32));
  assertEquals(show(found), show(wanted));
});

Deno.test("fromEither: when either is left", async () => {
  const found = await run(fromEither(_left(32)));
  const wanted = await run(left(32));
  assertEquals(show(found), show(wanted));
});

Deno.test("fromTask: wraps the value inside the task with a either", async () => {
  const found = await run(fromTask(_pure(10)));
  const wanted = await run(right(10));
  assertEquals(show(found), show(wanted));
});
